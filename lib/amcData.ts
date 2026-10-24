/**
 * AMC Nagrik AI - Ahmedabad Municipal Corporation (AMC) Knowledge Base & Directory
 * Production-grade mapping for zero-typing civic reporting.
 */

// ============================================================================
// 1. Types & Interfaces
// ============================================================================

export type TicketCategory = 'Pothole' | 'Garbage' | 'Streetlight' | 'Waterlogging';

export type TicketSeverity = 'Critical' | 'High' | 'Moderate';

export type TicketStatus = 
  | 'Reported' 
  | 'Inspector Assigned' 
  | 'Crew Dispatched' 
  | 'Work In Progress' 
  | 'Resolved';

export interface AreaInfo {
  name: string;
  zone: string;
  wardNumber: number;
  nodalOffice: string;
  officerName: string;
  officerPhone: string;
  latitude: number;
  longitude: number;
}

export interface DepartmentInfo {
  name: string;
  category: TicketCategory;
  defaultSla: string; // e.g. "24 Hours"
  icon: string;
  description: string;
}

export interface Ticket {
  id: string; // e.g., "AMC-2026-8492"
  category: TicketCategory;
  severity: TicketSeverity;
  department: string;
  summary: string; // 5-8 word plain layman summary
  estimatedSla: string; // "24 Hours" | "48 Hours"
  area: string;
  zone: string;
  wardNumber: number;
  nodalOffice: string;
  officerName: string;
  officerPhone: string;
  status: TicketStatus;
  statusMessage: string;
  stepIndex: number; // 0: Reported, 1: Inspector Assigned, 2: Crew Dispatched, 3: Work In Progress, 4: Resolved
  imageBase64?: string;
  createdAt: string;
  updatedAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface QuickTestPreset {
  id: string;
  label: string;
  chipTitle: string;
  area: string;
  category: TicketCategory;
  severity: TicketSeverity;
  department: string;
  summary: string;
  imageDataUrl: string;
}

// ============================================================================
// 2. Municipal Directory (Ahmedabad Areas, Zones, Wards & Offices)
// ============================================================================

export const AMC_AREAS: Record<string, AreaInfo> = {
  Navrangpura: {
    name: 'Navrangpura',
    zone: 'West Zone',
    wardNumber: 10,
    nodalOffice: 'Stadium Cross Roads Office, Navrangpura',
    officerName: 'Rajesh Trivedi (Ward Engineer)',
    officerPhone: '+91 79 2539 4410',
    latitude: 23.0365,
    longitude: 72.5611,
  },
  Bodakdev: {
    name: 'Bodakdev',
    zone: 'North West Zone',
    wardNumber: 8,
    nodalOffice: 'Judges Bungalow Office, Bodakdev',
    officerName: 'Nilesh Solanki (Chief Inspector)',
    officerPhone: '+91 79 2539 6621',
    latitude: 23.0416,
    longitude: 72.5085,
  },
  Satellite: {
    name: 'Satellite',
    zone: 'South West Zone',
    wardNumber: 14,
    nodalOffice: 'Anandnagar Office, Satellite',
    officerName: 'Pragnesh Patel (Works Supervisor)',
    officerPhone: '+91 79 2539 7733',
    latitude: 23.0298,
    longitude: 72.5186,
  },
  Vastrapur: {
    name: 'Vastrapur',
    zone: 'West Zone',
    wardNumber: 9,
    nodalOffice: 'Vastrapur Lake Office, Vastrapur',
    officerName: 'Hardik Raval (Junior Engineer)',
    officerPhone: '+91 79 2539 9901',
    latitude: 23.0350,
    longitude: 72.5293,
  },
  Maninagar: {
    name: 'Maninagar',
    zone: 'South Zone',
    wardNumber: 22,
    nodalOffice: 'Kankaria Lake Office, Maninagar',
    officerName: 'D. M. Vaghela (Drainage Officer)',
    officerPhone: '+91 79 2539 3302',
    latitude: 22.9967,
    longitude: 72.6017,
  },
  Paldi: {
    name: 'Paldi',
    zone: 'West Zone',
    wardNumber: 11,
    nodalOffice: 'Paldi Cross Roads Office, Paldi',
    officerName: 'K. J. Makwana (Ward Inspector)',
    officerPhone: '+91 79 2539 8812',
    latitude: 23.0124,
    longitude: 72.5626,
  },
  Chandkheda: {
    name: 'Chandkheda',
    zone: 'West Zone',
    wardNumber: 1,
    nodalOffice: 'Ring Road Office, Chandkheda',
    officerName: 'Vijay Parmar (Field Superintendent)',
    officerPhone: '+91 79 2539 1109',
    latitude: 23.1118,
    longitude: 72.5722,
  },
};

// Backward-compatible alias
export const AMC_WARD_DIRECTORY = AMC_AREAS;

// ============================================================================
// 3. AMC Department Routing Rules
// ============================================================================

export const AMC_DEPARTMENTS: Record<TicketCategory, DepartmentInfo> = {
  Pothole: {
    name: 'Roads & Bridges Department',
    category: 'Pothole',
    defaultSla: '24 Hours',
    icon: 'Construction',
    description: 'Potholes, asphalt damage, road depressions and bridge joints',
  },
  Garbage: {
    name: 'Solid Waste Management (SWM)',
    category: 'Garbage',
    defaultSla: '24 Hours',
    icon: 'Trash2',
    description: 'Overflowing garbage heaps, uncollected bins, street litter and debris',
  },
  Streetlight: {
    name: 'Street Lighting & Electrical Dept',
    category: 'Streetlight',
    defaultSla: '48 Hours',
    icon: 'Zap',
    description: 'Broken lamp posts, non-functional streetlights and open wiring hazards',
  },
  Waterlogging: {
    name: 'Drainage & Storm Water Dept',
    category: 'Waterlogging',
    defaultSla: '24 Hours',
    icon: 'Droplets',
    description: 'Waterlogging, flooded underpasses, gutter clogs and manhole overflow',
  },
};

// ============================================================================
// 4. Pre-built Test Chips for Judges (Instant 1-Click Evaluation)
// ============================================================================

export const QUICK_TEST_PRESETS: QuickTestPreset[] = [
  {
    id: 'preset-pothole',
    label: 'Try Pothole',
    chipTitle: 'Navrangpura Pothole',
    area: 'Navrangpura',
    category: 'Pothole',
    severity: 'Critical',
    department: 'Roads & Bridges Department',
    summary: 'Deep dangerous road pothole causing vehicle skids',
    imageDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e2430"/><path d="M40 330 L560 330" stroke="%23f59e0b" stroke-width="8" stroke-dasharray="24,16"/><path d="M140 210 C210 160, 290 260, 380 190 C460 230, 500 170, 470 280 C420 340, 260 350, 160 300 Z" fill="%230b0f19" stroke="%23ef4444" stroke-width="5"/><circle cx="300" cy="260" r="48" fill="%23020617"/><text x="300" y="65" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="%23f97316" text-anchor="middle">AMC CIVIC DAMAGE REPORT</text><text x="300" y="98" font-family="Arial,sans-serif" font-size="15" fill="%2394a3b8" text-anchor="middle">Navrangpura Commerce Six Roads • Hazard: Crater Pothole</text><rect x="200" y="125" width="200" height="32" rx="16" fill="%23ef4444" fill-opacity="0.25" stroke="%23ef4444"/><text x="300" y="146" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="%23fca5a5" text-anchor="middle">CRITICAL VEHICLE RISK</text></svg>`,
  },
  {
    id: 'preset-garbage',
    label: 'Try Garbage',
    chipTitle: 'Bodakdev Garbage Dump',
    area: 'Bodakdev',
    category: 'Garbage',
    severity: 'High',
    department: 'Solid Waste Management (SWM)',
    summary: 'Overflowing municipal community waste bin on road',
    imageDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23141f2e"/><rect x="80" y="180" width="180" height="170" rx="12" fill="%2315803d" stroke="%2322c55e" stroke-width="3"/><rect x="70" y="150" width="200" height="30" rx="6" fill="%23166534"/><path d="M140 150 C200 70, 280 110, 360 150 C420 120, 500 160, 530 230 C560 300, 500 350, 420 360 L210 360 Z" fill="%2378350f" stroke="%23f59e0b" stroke-width="3"/><text x="300" y="65" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="%2322c55e" text-anchor="middle">AMC SWM RAPID SWEEP</text><text x="300" y="98" font-family="Arial,sans-serif" font-size="15" fill="%23cbd5e1" text-anchor="middle">Bodakdev Ward 8 • Spill: Community Dumper Overflow</text><rect x="210" y="120" width="180" height="30" rx="15" fill="%23eab308" fill-opacity="0.25" stroke="%23eab308"/><text x="300" y="140" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="%23fef08a" text-anchor="middle">SLA: 24-HR PICKUP</text></svg>`,
  },
  {
    id: 'preset-waterlogging',
    label: 'Try Waterlogging',
    chipTitle: 'Satellite Waterlogging',
    area: 'Satellite',
    category: 'Waterlogging',
    severity: 'Critical',
    department: 'Drainage & Storm Water Dept',
    summary: 'Stagnant sewage water accumulated blocking pedestrian street',
    imageDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2309131f"/><path d="M0 240 Q150 200, 300 240 T600 240 L600 400 L0 400 Z" fill="%230284c7" fill-opacity="0.8"/><circle cx="300" cy="310" r="60" fill="%231e293b" stroke="%2338bdf8" stroke-width="4"/><circle cx="300" cy="310" r="25" fill="%230284c7"/><text x="300" y="60" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="%2338bdf8" text-anchor="middle">AMC DRAINAGE DIVISION</text><text x="300" y="95" font-family="Arial,sans-serif" font-size="15" fill="%2394a3b8" text-anchor="middle">Satellite Anandnagar • Hazard: Waterlogged Carriageway</text><rect x="200" y="120" width="200" height="32" rx="16" fill="%2338bdf8" fill-opacity="0.25" stroke="%2338bdf8"/><text x="300" y="141" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="%23bae6fd" text-anchor="middle">SEVERITY: CRITICAL</text></svg>`,
  },
];

// ============================================================================
// 5. GPS Distance & Area Resolution
// ============================================================================

/**
 * Calculate Great-Circle distance between two coordinates in kilometers (Haversine formula)
 */
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolve closest Ahmedabad Area based on GPS coordinates
 */
export function resolveAreaFromCoordinates(lat: number, lng: number): AreaInfo {
  let closestArea: AreaInfo = AMC_AREAS.Navrangpura;
  let minDistance = Infinity;

  for (const area of Object.values(AMC_AREAS)) {
    const dist = calculateDistanceKm(lat, lng, area.latitude, area.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closestArea = area;
    }
  }

  return closestArea;
}

/**
 * Resolve Area by name (with fuzzy match fallback)
 */
export function resolveAreaByName(areaName: string): AreaInfo {
  const clean = (areaName || '').trim().toLowerCase();
  for (const [key, value] of Object.entries(AMC_AREAS)) {
    if (key.toLowerCase() === clean || clean.includes(key.toLowerCase())) {
      return value;
    }
  }
  return AMC_AREAS.Navrangpura;
}

/**
 * Generate official AMC ticket ID: AMC-2026-XXXX
 */
export function generateTicketId(): string {
  const random4Digit = Math.floor(1000 + Math.random() * 9000);
  return `AMC-2026-${random4Digit}`;
}

// ============================================================================
// 6. Client-Side LocalStorage Helpers
// ============================================================================

const STORAGE_KEY = 'amc_nagrik_tickets_v3';

export function getStoredTickets(): Ticket[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('[amcData] Failed to parse tickets from localStorage:', err);
    return [];
  }
}

export function saveStoredTicket(ticket: Ticket): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredTickets();
    const updated = [ticket, ...existing.filter((t) => t.id !== ticket.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('[amcData] Failed to save ticket to localStorage:', err);
  }
}

export function updateTicketInStorage(
  ticketId: string,
  updates: Partial<Ticket>
): Ticket | null {
  if (typeof window === 'undefined') return null;
  try {
    const existing = getStoredTickets();
    const index = existing.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;

    const updated: Ticket = {
      ...existing[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    existing[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return updated;
  } catch (err) {
    console.error('[amcData] Failed to update ticket in localStorage:', err);
    return null;
  }
}

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('amc_gemini_api_key') || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (key.trim()) {
      localStorage.setItem('amc_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('amc_gemini_api_key');
    }
  } catch (err) {
    console.error('[amcData] Failed to save API key:', err);
  }
}
