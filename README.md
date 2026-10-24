# 🏛️ AMC Nagrik AI (અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન)

> **Autonomous Camera-Only Civic Grievance Dispatch & Real-Time Redressal PWA**  
> Developed for **Garbathon by GDG Ahmedabad 2026** • Powered by **Google Gemini 2.5 Flash** & **Firebase**.

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Google Gemini 2.5 Flash](https://img.shields.io/badge/Gemini_2.5_Flash-Multimodal_AI-orange?logo=google)](https://aistudio.google.com/)
[![Firebase v10](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-yellow?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ai-drpatel/AMC-Nagrik-AI)

---

## 💡 The Philosophy: Zero-Typing, Camera-First Civic Action

Citizens and field workers should never have to fill out complex 10-step municipal grievance forms, navigate obscure departmental dropdowns, or know their municipal ward numbers.

**AMC Nagrik AI** reimagines civic grievance reporting from the ground up:
1. **Strict Camera Capture**: The citizen simply points their camera at a civic problem (pothole, garbage dump, broken streetlight, or waterlogging) and taps the shutter.
2. **Autonomous AI Extraction**: Google Gemini 2.5 Flash analyzes the image, identifies the hazard category, evaluates public risk severity, and routes it to the official AMC department.
3. **Automated Geolocation & Municipal Resolution**: Browser GPS instantly resolves the exact AMC Ward (from all 48 wards) and Zonal Headquarters.
4. **Citizen Review & Override**: The citizen can verify or edit extracted fields before dispatching.
5. **Real-Time Digital Challan & Firestore Sync**: An official verifiable ticket (`AMC-YYYY-XXXXXX`) is logged to Firebase Firestore, providing live progress updates as municipal crews respond.

---

## 🌟 Key Features

- 📸 **Strict HTML5 Live Camera Viewfinder**: Real-time camera stream (`getUserMedia`) with front/rear flip, tactical reticle HUD, and instant frame snapshot (no gallery or demo presets).
- 🧠 **Google Gemini 2.5 Flash Multimodal Vision**: Forensic inspection detecting potholes, overflowing waste, streetlight blackouts, and drainage overflow with 5–8 word plain layman summaries.
- 🏢 **Complete 7 Zones & 48 Wards AMC Directory**: Complete municipal jurisdiction database mapping all 48 wards of Ahmedabad (Central, North, South, East, West, North West, South West) with zonal headquarters and duty officer contact numbers.
- 🔐 **Dual Firebase Authentication**: Google Sign-In Popup and Phone Number OTP (using `RecaptchaVerifier` and `PhoneAuthProvider`).
- ⚡ **Live Real-Time Stepper (`onSnapshot`)**: Real-time Firestore sync tracking grievance stages:
  $$\text{Submitted} \longrightarrow \text{Inspector Assigned} \longrightarrow \text{Crew Dispatched} \longrightarrow \text{Work In Progress} \longrightarrow \text{Resolved with Proof}$$
- 🧑‍💼 **Judge Simulation Toggle**: 1-click simulation button to advance municipal action stages in real-time on Firestore during evaluations.
- 📋 **Citizen Dashboard ("My Reports")**: Real-time list of all previous grievances filed by the citizen.
- 💬 **1-Tap WhatsApp Sharing**: Share digital receipts and tracking links directly to WhatsApp.

---

## 🏛️ AMC Ward & Zone Directory Structure

| Zone | Zonal Headquarters | Municipal Wards (48 Total) |
| :--- | :--- | :--- |
| **Central Zone** | Sardar Patel Bhavan, Danapith | Jamalpur, Khadia, Shahpur, Dariapur, Shahibaug, Asarwa |
| **North Zone** | Rajiv Gandhi Bhavan, Memco | Bapunagar, India Colony, Kubernagar, Naroda, Saijpur Bogha, Saraspur-Rakhial, Sardarnagar, Thakkarbapa Nagar |
| **South Zone** | Dr. Shyama Prasad Mukherjee Bhavan, Rambaug | Maninagar, Kankaria, Behrampura, Danilimda, Isanpur, Lambha, Vatva, Khokhra, Indrapuri, Bhaipura-Hatkeshwar |
| **East Zone** | Harubhai Mehta Bhavan, Viratnagar | Amraiwadi, Nikol, Odhav, Ramol-Hathijan, Vastral, Viratnagar, Gomtipur |
| **West Zone** | Usmanpura Zonal Office | Navrangpura, Naranpura, Paldi, Vasna, Ranip, Sabarmati, Chandkheda-Motera, Nava Vadaj, Sardar Patel Stadium |
| **North West Zone** | Bodakdev Zonal Office, Judges Bungalow | Bodakdev, Thaltej, Gota, Ghatlodiya, Chandlodiya |
| **South West Zone** | Jodhpur Zonal Office | Satellite-Jodhpur, Vejalpur, Sarkhej, Maktampura |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React Icons.
- **AI Engine**: Google Gemini 2.5 Flash via REST endpoint (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`).
- **Backend & Database**: Firebase Auth & Cloud Firestore with real-time snapshot listeners.
- **Geolocation**: HTML5 Geolocation API with Great-Circle Haversine distance ward resolver.

---

## 🚀 Quickstart & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/ai-drpatel/AMC-Nagrik-AI.git
cd AMC-Nagrik-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API credentials in `.env.local`:
```env
# Google Gemini 2.5 Flash API Key (from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web App Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firestore Security Rules
Paste the contents of [`firestore.rules`](./firestore.rules) into your Firebase Console under **Firestore Database > Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /tickets/{ticketId} {
      allow read: if true;
      allow create, update: if true;
      allow delete: if false;
    }
  }
}
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) on your device.

---

## 📁 Repository Structure

```
├── app/
│   ├── api/
│   │   └── agent/
│   │       └── route.ts       # Gemini 2.5 Flash Vision & Extraction API
│   ├── globals.css            # Dark mode styles & custom scrollbars
│   ├── layout.tsx             # Root layout & PWA metadata
│   └── page.tsx               # Camera viewfinder, review & challan UI
├── lib/
│   ├── amcDirectory.ts        # 7 AMC Zones & 48 Wards Directory with GPS
│   ├── amcData.ts             # Department schemas & resolution rules
│   ├── amc.ts                 # Backward-compatible exports
│   └── firebase.ts            # Firebase Auth & Firestore client configuration
├── firestore.rules            # Production Firestore security rules
├── .env.example               # Environment variable templates
├── package.json               # Dependencies and build scripts
└── tailwind.config.js         # Tailwind configuration
```

---

## 🛡️ Security & Privacy Notice
- All private keys and Firebase secrets are strictly excluded from source control via `.gitignore`.
- Image data captured by the camera is processed ephemerally for multimodal classification and stored securely in Firestore.

---

## 👥 Contributors & Hackathon Team
- **Project**: AMC Nagrik AI
- **Event**: Garbathon by GDG Ahmedabad 2026
- **Lead Developer**: Dhruv Patel ([@ai-drpatel](https://github.com/ai-drpatel))
