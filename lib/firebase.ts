import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';

// Your web app's Firebase configuration (loaded from environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'amc-nagrik-ai.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'amc-nagrik-ai',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'amc-nagrik-ai.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '850277548117',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:850277548117:web:b36f058e5ab5a73fea14dc',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-S50HWW1GEG',
};

// Initialize Firebase (SSR safe)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ============================================================================
// Types
// ============================================================================

export type ComplaintStage =
  | 'Submitted'
  | 'Inspector Assigned'
  | 'Crew Dispatched'
  | 'Work In Progress'
  | 'Resolved';

export interface TimelineEntry {
  stage: ComplaintStage;
  timestamp: number;
  note: string;
}

export interface AmcTicket {
  id: string; // AMC-YYYY-XXXXXX
  userId: string;
  userPhoneOrEmail: string;
  imageUrl: string; // Base64 data URI
  category: string; // Pothole | Garbage | Streetlight | Waterlogging | Other
  severity: 'Critical' | 'High' | 'Moderate';
  department: string;
  zone: string;
  ward: string;
  locationCoords?: { lat: number; lng: number };
  address: string;
  summary: string;
  status: ComplaintStage;
  createdAt: number;
  updatedAt: number;
  timeline: TimelineEntry[];
  proofImageUrl?: string;
}

// Stage sequence mapping for simulation
export const STAGE_SEQUENCE: ComplaintStage[] = [
  'Submitted',
  'Inspector Assigned',
  'Crew Dispatched',
  'Work In Progress',
  'Resolved',
];

// ============================================================================
// Firestore Helper Functions
// ============================================================================

/**
 * Generate official AMC Ticket ID: AMC-YYYY-XXXXXX
 */
export function generateAmcTicketId(): string {
  const year = new Date().getFullYear();
  const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
  return `AMC-${year}-${randomSixDigit}`;
}

/**
 * Save new ticket to Firestore
 */
export async function createTicketInFirestore(
  ticketData: Omit<AmcTicket, 'createdAt' | 'updatedAt' | 'timeline' | 'status'>
): Promise<AmcTicket> {
  const now = Date.now();
  const initialTimeline: TimelineEntry[] = [
    {
      stage: 'Submitted',
      timestamp: now,
      note: `Complaint recorded by AMC Nagrik AI. Dispatched to Ward ${ticketData.ward} (${ticketData.zone}).`,
    },
  ];

  const fullTicket: AmcTicket = {
    ...ticketData,
    status: 'Submitted',
    createdAt: now,
    updatedAt: now,
    timeline: initialTimeline,
  };

  const docRef = doc(db, 'tickets', fullTicket.id);
  await setDoc(docRef, fullTicket);
  return fullTicket;
}

/**
 * Real-time listener for a single ticket
 */
export function listenToTicket(
  ticketId: string,
  callback: (ticket: AmcTicket | null) => void
): Unsubscribe {
  const docRef = doc(db, 'tickets', ticketId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as AmcTicket);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.error('[listenToTicket error]', err);
    }
  );
}

/**
 * Real-time listener for citizen dashboard ("My Reports")
 */
export function listenToUserTickets(
  userId: string,
  callback: (tickets: AmcTicket[]) => void
): Unsubscribe {
  const ticketsCol = collection(db, 'tickets');
  const q = query(
    ticketsCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tickets: AmcTicket[] = [];
      snapshot.forEach((doc) => {
        tickets.push(doc.data() as AmcTicket);
      });
      callback(tickets);
    },
    (err) => {
      console.warn('[listenToUserTickets] Fallback listener without composite index:', err);
      // Fallback query if index is building
      const fallbackQuery = query(ticketsCol, where('userId', '==', userId));
      onSnapshot(fallbackQuery, (snapshot) => {
        const list: AmcTicket[] = [];
        snapshot.forEach((d) => list.push(d.data() as AmcTicket));
        list.sort((a, b) => b.createdAt - a.createdAt);
        callback(list);
      });
    }
  );
}

/**
 * AMC Official Action Simulation Toggle for Hackathon Judges
 * Moves the ticket status forward in real-time in Firestore!
 */
export async function advanceTicketStage(
  ticketId: string,
  currentStatus: ComplaintStage
): Promise<ComplaintStage> {
  const currentIndex = STAGE_SEQUENCE.indexOf(currentStatus);
  const nextIndex = Math.min(STAGE_SEQUENCE.length - 1, currentIndex + 1);
  const nextStage = STAGE_SEQUENCE[nextIndex];
  const now = Date.now();

  let note = '';
  switch (nextStage) {
    case 'Inspector Assigned':
      note = 'Ward Junior Officer physically surveyed the location & assigned repair work order.';
      break;
    case 'Crew Dispatched':
      note = 'Municipal rapid response maintenance crew dispatched with asphalt/suction equipment.';
      break;
    case 'Work In Progress':
      note = 'Crew actively performing repairs and clearing obstructions on site.';
      break;
    case 'Resolved':
      note = 'Defect successfully repaired and verified by Ward Junior Engineer. Site sanitized.';
      break;
    default:
      note = `Status advanced to ${nextStage}.`;
  }

  const docRef = doc(db, 'tickets', ticketId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as AmcTicket;
    const updatedTimeline = [
      ...data.timeline,
      { stage: nextStage, timestamp: now, note },
    ];

    await updateDoc(docRef, {
      status: nextStage,
      updatedAt: now,
      timeline: updatedTimeline,
      ...(nextStage === 'Resolved'
        ? {
            proofImageUrl:
              'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?q=80&w=600&auto=format&fit=crop',
          }
        : {}),
    });
  }

  return nextStage;
}
