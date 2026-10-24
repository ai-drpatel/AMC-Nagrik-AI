'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Flame,
  Globe,
  Info,
  Layers,
  ListOrdered,
  Loader2,
  LogOut,
  MapPin,
  Maximize2,
  Navigation,
  Phone,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  SwitchCamera,
  Trash2,
  User,
  Users,
  Video,
  VideoOff,
  X,
  Zap,
} from 'lucide-react';

import {
  auth,
  googleProvider,
  createTicketInFirestore,
  listenToTicket,
  listenToUserTickets,
  advanceTicketStage,
  AmcTicket,
  ComplaintStage,
  generateAmcTicketId,
} from '../lib/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

import {
  AMC_ZONES,
  AMC_ALL_WARDS,
  AMC_DEPARTMENTS_CONFIG,
  WardInfo,
  resolveWardByCoordinates,
  resolveWardByName,
  getAllZones,
} from '../lib/amcDirectory';

export default function AMCNagrikAIPage() {
  // Navigation Tabs: 'CAMERA' | 'REVIEW' | 'CHALLAN' | 'MY_REPORTS' | 'DIRECTORY'
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'REVIEW' | 'CHALLAN' | 'MY_REPORTS' | 'DIRECTORY'>('CAMERA');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // STRICT Camera State (No Gallery / No Presets)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // GPS Location State
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedWard, setDetectedWard] = useState<WardInfo>(AMC_ALL_WARDS.Navrangpura);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // AI Extraction State (Citizen Review & Override)
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<string>('Pothole');
  const [editSeverity, setEditSeverity] = useState<'Critical' | 'High' | 'Moderate'>('High');
  const [editDepartment, setEditDepartment] = useState<string>('Roads & Bridges Department');
  const [editWard, setEditWard] = useState<string>('Navrangpura');
  const [editSummary, setEditSummary] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [isSubmittingToFirestore, setIsSubmittingToFirestore] = useState<boolean>(false);

  // Active Ticket & Real-Time Tracking
  const [activeTicket, setActiveTicket] = useState<AmcTicket | null>(null);
  const [isSimulatingStage, setIsSimulatingStage] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Citizen Dashboard ("My Reports")
  const [userTickets, setUserTickets] = useState<AmcTicket[]>([]);

  // Directory Search
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Listen to user tickets
        const unsubTickets = listenToUserTickets(user.uid, (tickets) => {
          setUserTickets(tickets);
        });
        return () => unsubTickets();
      } else {
        setUserTickets([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to active ticket changes in real-time from Firestore!
  useEffect(() => {
    if (!activeTicket?.id) return;
    const unsub = listenToTicket(activeTicket.id, (freshTicket) => {
      if (freshTicket) {
        setActiveTicket(freshTicket);
      }
    });
    return () => unsub();
  }, [activeTicket?.id]);

  // Start Camera Stream when on CAMERA tab
  useEffect(() => {
    if (activeTab === 'CAMERA') {
      startCamera();
      detectGps();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, facingMode]);

  // Start HTML5 Camera Stream (`getUserMedia`)
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      } else {
        setCameraError('Camera API not supported by this browser. Use HTTPS or a mobile browser.');
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission denied or camera device unavailable. Please allow camera access.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Flip Camera Front / Back
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Detect GPS Location
  const detectGps = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentCoords(coords);
        const resolved = resolveWardByCoordinates(coords.lat, coords.lng);
        setDetectedWard(resolved);
        setEditWard(resolved.name);
        setEditAddress(`${resolved.name}, ${resolved.zone}, Ahmedabad`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  // Capture Frame from Live Camera Stream
  const handleSnapPhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      alert('Camera stream is not active.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedPhoto(photoDataUrl);
    stopCamera();

    // Trigger AI Dynamic Extraction with Gemini 2.5 Flash
    setIsAiScanning(true);
    setActiveTab('REVIEW');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoDataUrl,
          locationCoords: currentCoords,
          areaHint: detectedWard.name,
        }),
      });

      const data = await response.json();
      if (data.success && data.extraction) {
        const ext = data.extraction;
        setEditCategory(ext.category || 'Pothole');
        setEditSeverity(ext.severity || 'High');
        setEditDepartment(ext.department || 'Roads & Bridges Department');
        setEditSummary(ext.summary || 'Civic infrastructure defect flagged for repair');
        if (ext.ward) {
          const w = resolveWardByName(ext.ward);
          setDetectedWard(w);
          setEditWard(w.name);
          setEditAddress(`${w.name}, ${w.zone}, Ahmedabad`);
        }
      }
    } catch (err) {
      console.error('AI extraction error:', err);
      setEditSummary('Severe civic hazard detected on street requiring urgent repair');
    } finally {
      setIsAiScanning(false);
    }
  };

  // Confirm and Dispatch Ticket to Firestore
  const handleConfirmAndDispatch = async () => {
    if (!capturedPhoto) {
      alert('Photo is missing. Please capture a real-time photo.');
      return;
    }

    setIsSubmittingToFirestore(true);

    try {
      const wardInfo = resolveWardByName(editWard);
      const ticketId = generateAmcTicketId();
      const userId = currentUser ? currentUser.uid : 'citizen_guest_' + Math.floor(1000 + Math.random() * 9000);
      const userPhoneOrEmail = currentUser?.phoneNumber || currentUser?.email || 'Registered Ahmedabad Citizen';

      const createdTicket = await createTicketInFirestore({
        id: ticketId,
        userId,
        userPhoneOrEmail,
        imageUrl: capturedPhoto,
        category: editCategory,
        severity: editSeverity,
        department: editDepartment,
        zone: wardInfo.zone,
        ward: wardInfo.name,
        locationCoords: currentCoords || { lat: wardInfo.latitude, lng: wardInfo.longitude },
        address: editAddress || `${wardInfo.name}, ${wardInfo.zone}, Ahmedabad`,
        summary: editSummary || `${editCategory} hazard requiring municipal intervention`,
      });

      setActiveTicket(createdTicket);
      setActiveTab('CHALLAN');
    } catch (err) {
      console.error('Failed to create ticket in Firestore:', err);
      alert('Failed to connect to AMC Firestore. Check internet connection.');
    } finally {
      setIsSubmittingToFirestore(false);
    }
  };

  // AMC Official Action Simulation Toggle for Judges
  const handleSimulateStage = async () => {
    if (!activeTicket) return;
    setIsSimulatingStage(true);
    try {
      await advanceTicketStage(activeTicket.id, activeTicket.status);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulatingStage(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      setAuthError(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Phone Number Sign-In with OTP
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formatted, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP';
      setAuthError(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || !confirmationResult) return;
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      await confirmationResult.confirm(otpCode);
      setShowAuthModal(false);
      setConfirmationResult(null);
      setOtpCode('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP code';
      setAuthError(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!activeTicket) return;
    const msg = encodeURIComponent(
      `🏛️ AMC Nagrik AI Digital Challan\n` +
      `Ticket ID: ${activeTicket.id}\n` +
      `Category: ${activeTicket.category} (${activeTicket.severity} Hazard)\n` +
      `Location: Ward ${activeTicket.ward} (${activeTicket.zone})\n` +
      `Department: ${activeTicket.department}\n` +
      `Status: ${activeTicket.status}\n` +
      `Track Online: http://localhost:3000`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Invisible Recaptcha container for Phone OTP */}
      <div id="recaptcha-container" />
      <canvas ref={canvasRef} className="hidden" />

      {/* ==================================================================== */}
      {/* 1. TOP APP BAR */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between max-w-xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-orange-500/20 border border-amber-400/30">
            AMC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                AMC Nagrik AI
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                Camera-Only
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન
            </p>
          </div>
        </div>

        {/* User Account / Auth Button */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-[11px] truncate max-w-[100px]">
                  {currentUser.displayName || currentUser.phoneNumber || 'Citizen'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. TAB NAVIGATION (Camera, My Reports, AMC Directory) */}
      {/* ==================================================================== */}
      <nav className="border-b border-slate-800/80 bg-slate-950 px-4 max-w-xl w-full mx-auto flex items-center justify-around text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('CAMERA')}
          className={`py-3 flex-1 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'CAMERA' || activeTab === 'REVIEW' || activeTab === 'CHALLAN'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MY_REPORTS')}
          className={`py-3 flex-1 flex items-center justify-center gap-1.5 border-b-2 transition-all relative ${
            activeTab === 'MY_REPORTS'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>My Reports</span>
          {userTickets.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center ml-0.5">
              {userTickets.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DIRECTORY')}
          className={`py-3 flex-1 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'DIRECTORY'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>48 Wards</span>
        </button>
      </nav>

      {/* ==================================================================== */}
      {/* 3. MAIN CONTENT CONTAINER */}
      {/* ==================================================================== */}
      <div className="flex-1 w-full max-w-xl mx-auto p-4 sm:p-5 flex flex-col justify-between gap-4">

        {/* ================================================================== */}
        {/* VIEW A: STRICT LIVE CAMERA VIEW */}
        {/* ================================================================== */}
        {activeTab === 'CAMERA' && (
          <div className="flex-1 flex flex-col justify-between gap-4 animate-fadeIn">
            
            {/* Viewfinder Canvas */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-black aspect-[3/4] flex items-center justify-center shadow-2xl">
              
              {/* HTML5 Video Stream */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Camera Error Banner if Permission Blocked */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 p-6 flex flex-col items-center justify-center text-center gap-3 z-30">
                  <VideoOff className="w-12 h-12 text-red-400" />
                  <p className="text-xs text-red-300 font-semibold leading-relaxed">
                    {cameraError}
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Camera
                  </button>
                </div>
              )}

              {/* Tactical Camera HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between z-20">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-amber-400" />
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-amber-300 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    REAL-TIME SENSOR
                  </div>
                  <div className="w-8 h-8 border-t-2 border-r-2 border-amber-400" />
                </div>

                {/* Reticle Focus Indicator */}
                <div className="self-center flex flex-col items-center">
                  <div className="w-16 h-16 border border-dashed border-amber-400/50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-950/80 px-2 py-0.5 rounded">
                    POINT AT CIVIC HAZARD
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 border-b-2 border-l-2 border-amber-400" />
                  <div className="w-8 h-8 border-b-2 border-r-2 border-amber-400" />
                </div>
              </div>

              {/* Flip Camera Button */}
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-700 text-slate-200 backdrop-blur-md active:scale-95"
                title="Flip Front/Rear Camera"
              >
                <SwitchCamera className="w-4 h-4 text-amber-400" />
              </button>

              {/* Bottom GPS Ward Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-30">
                <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between text-xs shadow-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-mono block">GPS WARD DETECTED</span>
                      <p className="font-extrabold text-slate-100 truncate">
                        {detectedWard.name} • Ward ({detectedWard.zone})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={detectGps}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400"
                    title="Refresh GPS"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Shutter Capture Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={!isCameraActive}
                onClick={handleSnapPhoto}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all shadow-2xl active:scale-95 ${
                  isCameraActive
                    ? 'border-amber-400 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-orange-500/30'
                    : 'border-slate-700 bg-slate-800 opacity-50 cursor-not-allowed'
                }`}
                title="Capture Photograph"
              >
                <div className="w-14 h-14 rounded-full border-2 border-slate-950 bg-white/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-950" />
                </div>
              </button>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tap Shutter to Snap
              </span>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW B: CITIZEN REVIEW & EDIT OVERRIDE */}
        {/* ================================================================== */}
        {activeTab === 'REVIEW' && (
          <div className="flex-1 flex flex-col justify-between gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('CAMERA')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Step 2: Review &amp; Edit
                </span>
              </div>

              {/* Photo Preview & AI Extraction Status */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center mb-3">
                {capturedPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={capturedPhoto}
                    alt="Captured Defect"
                    className="w-full h-full object-contain"
                  />
                )}
                {isAiScanning && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    <p className="text-xs font-mono text-amber-300 animate-pulse">
                      Gemini 2.5 Flash Inspecting Hazard...
                    </p>
                  </div>
                )}
              </div>

              {/* Citizen Edit Override Form */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    AI Extraction (Citizen Can Edit)
                  </span>
                  <span className="text-[10px] text-slate-500">Tap to modify</span>
                </div>

                {/* Category & Severity Dropdowns */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Civic Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="Pothole">Pothole (ખાડો)</option>
                      <option value="Garbage">Garbage (કચરો)</option>
                      <option value="Streetlight">Streetlight (લાઇટ)</option>
                      <option value="Waterlogging">Waterlogging (પાણી ભરાવું)</option>
                      <option value="Other">Other Civic Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Hazard Severity
                    </label>
                    <select
                      value={editSeverity}
                      onChange={(e) => setEditSeverity(e.target.value as 'Critical' | 'High' | 'Moderate')}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="Critical">Critical (અતિ ગંભીર)</option>
                      <option value="High">High (ગંભીર)</option>
                      <option value="Moderate">Moderate (સામાન્ય)</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Department */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    AMC Responsible Department
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Roads & Bridges Department">Roads &amp; Bridges Department (રોડ વિભાગ)</option>
                    <option value="Solid Waste Management (SWM)">Solid Waste Management (ઘન કચરો)</option>
                    <option value="Street Lighting & Electrical Dept">Street Lighting &amp; Electrical (લાઇટ)</option>
                    <option value="Drainage & Storm Water Dept">Drainage &amp; Storm Water (ડ્રેનેજ)</option>
                  </select>
                </div>

                {/* Ward Selector (All 48 Wards) */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Municipal Ward Jurisdiction (48 Wards)
                  </label>
                  <select
                    value={editWard}
                    onChange={(e) => {
                      setEditWard(e.target.value);
                      const w = resolveWardByName(e.target.value);
                      setDetectedWard(w);
                      setEditAddress(`${w.name}, ${w.zone}, Ahmedabad`);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
                  >
                    {Object.values(AMC_ALL_WARDS).map((w) => (
                      <option key={w.name} value={w.name}>
                        {w.name} ({w.gujaratiName}) • {w.zone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Citizen Summary Description */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Layman Damage Summary
                  </label>
                  <input
                    type="text"
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    placeholder="Brief description of the defect"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Confirm & Dispatch Button */}
            <button
              type="button"
              disabled={isSubmittingToFirestore || isAiScanning}
              onClick={handleConfirmAndDispatch}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl ${
                isSubmittingToFirestore || isAiScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-orange-500/25 active:scale-[0.99]'
              }`}
            >
              {isSubmittingToFirestore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Recording in AMC Firestore...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Confirm &amp; Dispatch to Ward</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW C: REAL-TIME DIGITAL CHALLAN & LIVE TRACKER */}
        {/* ================================================================== */}
        {activeTab === 'CHALLAN' && activeTicket && (
          <div className="flex-1 flex flex-col gap-4 animate-fadeIn">
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('CAMERA')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Snap Another Defect</span>
              </button>

              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Firestore Listener Active
              </span>
            </div>

            {/* Digital Challan Receipt */}
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    Grievance Registered with AMC
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-mono tracking-tight text-slate-100">
                      {activeTicket.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(activeTicket.id)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100"
                      title="Copy Ticket ID"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="py-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Issue Category</span>
                    <h3 className="font-extrabold text-sm text-slate-100">
                      {activeTicket.category}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      activeTicket.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {activeTicket.severity} Hazard
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 italic">
                  &ldquo;{activeTicket.summary}&rdquo;
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Assigned Department</span>
                    <span className="font-bold text-slate-200 block truncate">{activeTicket.department}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Ward &amp; Zone</span>
                    <span className="font-bold text-slate-200 block truncate">{activeTicket.ward} ({activeTicket.zone})</span>
                  </div>
                </div>

                {/* Proof Image if Resolved */}
                {activeTicket.status === 'Resolved' && activeTicket.proofImageUrl && (
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeTicket.proofImageUrl}
                      alt="Resolution Proof"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                        Verified Resolution Proof Attached
                      </span>
                      <p className="text-xs font-semibold">Repairs completed &amp; inspected by Ward Engineer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Progress Stepper (Synced with Firestore) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Live Firestore Resolution Stages
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  {activeTicket.status}
                </span>
              </div>

              {/* Stepper Dots */}
              <div className="grid grid-cols-5 gap-1 text-center py-2">
                {[
                  { stage: 'Submitted', label: 'Submitted' },
                  { stage: 'Inspector Assigned', label: 'Inspector' },
                  { stage: 'Crew Dispatched', label: 'Crew' },
                  { stage: 'Work In Progress', label: 'In Progress' },
                  { stage: 'Resolved', label: 'Resolved' },
                ].map((s, idx) => {
                  const stageOrder = ['Submitted', 'Inspector Assigned', 'Crew Dispatched', 'Work In Progress', 'Resolved'];
                  const currentIndex = stageOrder.indexOf(activeTicket.status);
                  const isDone = currentIndex >= idx;
                  const isCurrent = currentIndex === idx;

                  return (
                    <div key={s.stage} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 animate-pulse'
                            : isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-600'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className={`text-[9px] font-bold ${isDone ? 'text-slate-200' : 'text-slate-600'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Official Action Simulation Toggle for Hackathon Judges */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>🧑‍💼 Hackathon Judge Simulation Toggle:</span>
                </div>
                <button
                  type="button"
                  disabled={isSimulatingStage || activeTicket.status === 'Resolved'}
                  onClick={handleSimulateStage}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    activeTicket.status === 'Resolved'
                      ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 cursor-default'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-400/50 active:scale-95'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingStage ? 'animate-spin' : ''}`} />
                  <span>
                    {activeTicket.status === 'Resolved'
                      ? '✓ Fully Resolved in Firestore'
                      : 'Simulate AMC Officer Action (Advance Stage)'}
                  </span>
                </button>
              </div>

              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Tracking Link via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW D: CITIZEN DASHBOARD ("My Reports") */}
        {/* ================================================================== */}
        {activeTab === 'MY_REPORTS' && (
          <div className="flex-1 flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-sm text-slate-100">
                  My Filed Civic Reports
                </h2>
                <p className="text-[11px] text-slate-400">
                  Live sync with AMC Firestore
                </p>
              </div>
              <span className="text-xs font-mono text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                {userTickets.length} Reports
              </span>
            </div>

            {userTickets.length === 0 ? (
              <div className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center gap-3">
                <Camera className="w-10 h-10 text-slate-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-300">
                    No complaints registered yet
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Snap a photo with the live camera to record your first grievance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('CAMERA')}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Open Camera
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[70vh] no-scrollbar">
                {userTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTicket(t);
                      setActiveTab('CHALLAN');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                        {t.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={t.imageUrl}
                            alt="Defect"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-amber-300">
                            {t.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-100 truncate">
                          {t.category} • Ward {t.ward}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {t.summary}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          t.status === 'Resolved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW E: AMC 48 WARDS & 7 ZONES DIRECTORY */}
        {/* ================================================================== */}
        {activeTab === 'DIRECTORY' && (
          <div className="flex-1 flex flex-col gap-3 animate-fadeIn">
            <div>
              <h2 className="font-extrabold text-sm text-slate-100">
                AMC 7 Zones &amp; 48 Municipal Wards Directory
              </h2>
              <p className="text-[10px] text-slate-400">
                Official Zonal Headquarters &amp; Ward Officers
              </p>
            </div>

            {/* Search & Zone Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search ward (e.g. Navrangpura, Naroda)..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Zones</option>
                {getAllZones().map((z) => (
                  <option key={z.name} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* List of Wards */}
            <div className="space-y-2 overflow-y-auto max-h-[65vh] no-scrollbar">
              {Object.values(AMC_ALL_WARDS)
                .filter((w) => {
                  const matchSearch =
                    w.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
                    w.gujaratiName.includes(directorySearch);
                  const matchZone =
                    selectedZoneFilter === 'ALL' || w.zone === selectedZoneFilter;
                  return matchSearch && matchZone;
                })
                .map((w) => (
                  <div
                    key={w.name}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-100">
                          {w.name}
                        </span>
                        <span className="text-xs text-amber-400 font-bold">
                          ({w.gujaratiName})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {w.zone} • {w.headquarters}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Officer: {w.officerName}
                      </span>
                    </div>

                    <a
                      href={`tel:${w.officerPhone}`}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs flex items-center gap-1 border border-slate-700 shrink-0"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>Call</span>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>

      {/* ==================================================================== */}
      {/* 4. FIREBASE AUTH MODAL (Google + Phone OTP) */}
      {/* ==================================================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-slate-100">
                  AMC Citizen Sign-In
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {authError}
              </div>
            )}

            {/* Google Sign In */}
            <button
              type="button"
              disabled={isAuthLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 uppercase font-mono">Or Phone OTP</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Phone Number OTP Flow */}
            {!confirmationResult ? (
              <div className="space-y-2">
                <input
                  type="tel"
                  placeholder="Enter 10-digit Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  disabled={isAuthLoading || !phoneNumber}
                  onClick={handleSendOtp}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  {isAuthLoading ? 'Sending OTP...' : 'Send OTP Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono text-center tracking-widest focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  disabled={isAuthLoading || !otpCode}
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  {isAuthLoading ? 'Verifying OTP...' : 'Verify & Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-2.5 text-center text-[10px] text-slate-500 border-t border-slate-900 bg-slate-950 max-w-xl w-full mx-auto">
        AMC Nagrik AI • Garbathon by GDG Ahmedabad • Powered by Gemini 2.5 Flash &amp; Firebase
      </footer>
    </main>
  );
}

// Global declaration for Firebase Recaptcha
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
