/**
 * AMC Municipal Ward & Zonal Directory
 * Ahmedabad Municipal Corporation (AMC) - અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન
 * Complete mapping of all 7 Zones and 48 Municipal Wards.
 */

export interface WardInfo {
  name: string;
  gujaratiName: string;
  wardNumber?: number;
  zone: string;
  headquarters: string;
  officerName: string;
  officerPhone: string;
  latitude: number;
  longitude: number;
}

export interface ZoneInfo {
  name: string;
  gujaratiName: string;
  headquarters: string;
  address: string;
  wards: string[];
}

export interface DepartmentInfo {
  key: string;
  name: string;
  gujaratiName: string;
  defaultSla: string;
  description: string;
  keywords: string[];
}

// ============================================================================
// 1. All 7 AMC Zones & Headquarters
// ============================================================================

export const AMC_ZONES: Record<string, ZoneInfo> = {
  'Central Zone': {
    name: 'Central Zone',
    gujaratiName: 'મધ્ય ઝોન',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    address: 'Sardar Patel Bhavan, Danapith, Ahmedabad - 380001',
    wards: ['Jamalpur', 'Khadia', 'Shahpur', 'Dariapur', 'Shahibaug', 'Asarwa'],
  },
  'North Zone': {
    name: 'North Zone',
    gujaratiName: 'ઉત્તર ઝોન',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    address: 'Rajiv Gandhi Bhavan, Near Memco Cross Roads, Naroda Road, Ahmedabad - 380025',
    wards: [
      'Bapunagar',
      'India Colony',
      'Kubernagar',
      'Naroda',
      'Saijpur Bogha',
      'Saraspur-Rakhial',
      'Sardarnagar',
      'Thakkarbapa Nagar',
    ],
  },
  'South Zone': {
    name: 'South Zone',
    gujaratiName: 'દક્ષિણ ઝોન',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    address: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar, Ahmedabad - 380028',
    wards: [
      'Maninagar',
      'Kankaria',
      'Behrampura',
      'Danilimda',
      'Isanpur',
      'Lambha',
      'Vatva',
      'Khokhra',
      'Indrapuri',
      'Bhaipura-Hatkeshwar',
    ],
  },
  'East Zone': {
    name: 'East Zone',
    gujaratiName: 'પૂર્વ ઝોન',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    address: 'Harubhai Mehta Bhavan, Viratnagar Cross Roads, Odhav, Ahmedabad - 380038',
    wards: [
      'Amraiwadi',
      'Nikol',
      'Odhav',
      'Ramol-Hathijan',
      'Vastral',
      'Viratnagar',
      'Gomtipur',
    ],
  },
  'West Zone': {
    name: 'West Zone',
    gujaratiName: 'પશ્ચિમ ઝોન',
    headquarters: 'Dr. Ramanbhai Patel Bhavan, Usmanpura Zonal Office',
    address: 'Usmanpura Cross Roads, Ashram Road, Ahmedabad - 380013',
    wards: [
      'Navrangpura',
      'Naranpura',
      'Paldi',
      'Vasna',
      'Ranip',
      'Sabarmati',
      'Chandkheda-Motera',
      'Nava Vadaj',
      'Sardar Patel Stadium',
    ],
  },
  'North West Zone': {
    name: 'North West Zone',
    gujaratiName: 'ઉત્તર પશ્ચિમ ઝોન',
    headquarters: 'Bodakdev Zonal Office, Judges Bungalow',
    address: 'Opp. Atithi Dining Hall, Judges Bungalow Road, Bodakdev, Ahmedabad - 380054',
    wards: ['Bodakdev', 'Thaltej', 'Gota', 'Ghatlodiya', 'Chandlodiya'],
  },
  'South West Zone': {
    name: 'South West Zone',
    gujaratiName: 'દક્ષિણ પશ્ચિમ ઝોન',
    headquarters: 'Jodhpur Zonal Office',
    address: 'Beside Jodhpur Ward Office, Near Star Bazaar, Jodhpur, Ahmedabad - 380015',
    wards: ['Satellite-Jodhpur', 'Vejalpur', 'Sarkhej', 'Maktampura'],
  },
};

// ============================================================================
// 2. Complete 48 Wards Registry with Geolocation
// ============================================================================

export const AMC_ALL_WARDS: Record<string, WardInfo> = {
  // Central Zone (6 wards)
  Jamalpur: {
    name: 'Jamalpur',
    gujaratiName: 'જમાલપુર',
    zone: 'Central Zone',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    officerName: 'Imran Mansuri (Ward Inspector)',
    officerPhone: '+91 79 2539 1801',
    latitude: 23.0135,
    longitude: 72.5833,
  },
  Khadia: {
    name: 'Khadia',
    gujaratiName: 'ખાડિયા',
    zone: 'Central Zone',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    officerName: 'Hasmukh Bhatt (Sanitary Inspector)',
    officerPhone: '+91 79 2539 1802',
    latitude: 23.0232,
    longitude: 72.5921,
  },
  Shahpur: {
    name: 'Shahpur',
    gujaratiName: 'શાહપુર',
    zone: 'Central Zone',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    officerName: 'Kishore Parmar (Engineering Officer)',
    officerPhone: '+91 79 2539 1803',
    latitude: 23.0371,
    longitude: 72.5801,
  },
  Dariapur: {
    name: 'Dariapur',
    gujaratiName: 'દરિયાપુર',
    zone: 'Central Zone',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    officerName: 'Anil Makwana (Ward Inspector)',
    officerPhone: '+91 79 2539 1804',
    latitude: 23.0345,
    longitude: 72.5932,
  },
  Shahibaug: {
    name: 'Shahibaug',
    gujaratiName: 'શાહીબાગ',
    zone: 'Central Zone',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    officerName: 'Deepak Vaghela (Civil Inspector)',
    officerPhone: '+91 79 2539 1805',
    latitude: 23.0566,
    longitude: 72.5898,
  },
  Asarwa: {
    name: 'Asarwa',
    gujaratiName: 'અસારવા',
    zone: 'Central Zone',
    headquarters: 'Sardar Patel Bhavan, Danapith',
    officerName: 'Pravin Solanki (Sanitation Officer)',
    officerPhone: '+91 79 2539 1806',
    latitude: 23.0510,
    longitude: 72.6033,
  },

  // North Zone (8 wards)
  Bapunagar: {
    name: 'Bapunagar',
    gujaratiName: 'બાપુનગર',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Girish Patel (Ward Engineer)',
    officerPhone: '+91 79 2539 2101',
    latitude: 23.0388,
    longitude: 72.6318,
  },
  'India Colony': {
    name: 'India Colony',
    gujaratiName: 'ઇન્ડિયા કોલોની',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Piyush Dave (Junior Inspector)',
    officerPhone: '+91 79 2539 2102',
    latitude: 23.0512,
    longitude: 72.6455,
  },
  Kubernagar: {
    name: 'Kubernagar',
    gujaratiName: 'કુબેરનગર',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Kamlesh Vaghela (Works Inspector)',
    officerPhone: '+91 79 2539 2103',
    latitude: 23.0722,
    longitude: 72.6389,
  },
  Naroda: {
    name: 'Naroda',
    gujaratiName: 'નરોડા',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Mahesh Barot (Sanitary Inspector)',
    officerPhone: '+91 79 2539 2104',
    latitude: 23.0841,
    longitude: 72.6592,
  },
  'Saijpur Bogha': {
    name: 'Saijpur Bogha',
    gujaratiName: 'સૈજપુર બોઘા',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Bharat Desai (Field Supervisor)',
    officerPhone: '+91 79 2539 2105',
    latitude: 23.0645,
    longitude: 72.6321,
  },
  'Saraspur-Rakhial': {
    name: 'Saraspur-Rakhial',
    gujaratiName: 'સરસપુર-રખિયાલ',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Ramesh Chauhan (Civil Inspector)',
    officerPhone: '+91 79 2539 2106',
    latitude: 23.0289,
    longitude: 72.6189,
  },
  Sardarnagar: {
    name: 'Sardarnagar',
    gujaratiName: 'સરદારનગર',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Vijay Prajapati (Ward Officer)',
    officerPhone: '+91 79 2539 2107',
    latitude: 23.0789,
    longitude: 72.6255,
  },
  'Thakkarbapa Nagar': {
    name: 'Thakkarbapa Nagar',
    gujaratiName: 'ઠક્કરબાપા નગર',
    zone: 'North Zone',
    headquarters: 'Rajiv Gandhi Bhavan, Memco, Naroda Road',
    officerName: 'Nitin Suthar (Junior Engineer)',
    officerPhone: '+91 79 2539 2108',
    latitude: 23.0567,
    longitude: 72.6512,
  },

  // South Zone (10 wards)
  Maninagar: {
    name: 'Maninagar',
    gujaratiName: 'મણિનગર',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'D. M. Vaghela (City Drainage Officer)',
    officerPhone: '+91 79 2539 3302',
    latitude: 22.9967,
    longitude: 72.6017,
  },
  Kankaria: {
    name: 'Kankaria',
    gujaratiName: 'કાંકરિયા',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Sanjay Joshi (Ward Supervisor)',
    officerPhone: '+91 79 2539 3303',
    latitude: 23.0062,
    longitude: 72.6025,
  },
  Behrampura: {
    name: 'Behrampura',
    gujaratiName: 'બહેરામપુરા',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Arvind Rathod (Sanitation Officer)',
    officerPhone: '+91 79 2539 3304',
    latitude: 22.9989,
    longitude: 72.5821,
  },
  Danilimda: {
    name: 'Danilimda',
    gujaratiName: 'દાણીલીમડા',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Firoz Sheikh (Drainage Inspector)',
    officerPhone: '+91 79 2539 3305',
    latitude: 22.9856,
    longitude: 72.5855,
  },
  Isanpur: {
    name: 'Isanpur',
    gujaratiName: 'ઇસનપુર',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Hiren Pandya (Road Inspector)',
    officerPhone: '+91 79 2539 3306',
    latitude: 22.9734,
    longitude: 72.5978,
  },
  Lambha: {
    name: 'Lambha',
    gujaratiName: 'લાંભા',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Kantilal Zala (Field Supervisor)',
    officerPhone: '+91 79 2539 3307',
    latitude: 22.9456,
    longitude: 72.5921,
  },
  Vatva: {
    name: 'Vatva',
    gujaratiName: 'વટવા',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Bhavesh Raval (Civil Engineer)',
    officerPhone: '+91 79 2539 3308',
    latitude: 22.9612,
    longitude: 72.6312,
  },
  Khokhra: {
    name: 'Khokhra',
    gujaratiName: 'ખોખરા',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Ashok Patel (Ward Inspector)',
    officerPhone: '+91 79 2539 3309',
    latitude: 23.0012,
    longitude: 72.6189,
  },
  Indrapuri: {
    name: 'Indrapuri',
    gujaratiName: 'ઇન્દ્રપુરી',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Mukesh Sharma (Light Inspector)',
    officerPhone: '+91 79 2539 3310',
    latitude: 22.9912,
    longitude: 72.6123,
  },
  'Bhaipura-Hatkeshwar': {
    name: 'Bhaipura-Hatkeshwar',
    gujaratiName: 'ભાઈપુરા-હાટકેશ્વર',
    zone: 'South Zone',
    headquarters: 'Dr. Shyama Prasad Mukherjee Bhavan, Rambaug, Maninagar',
    officerName: 'Dinesh Dabhi (Sanitary Supervisor)',
    officerPhone: '+91 79 2539 3311',
    latitude: 22.9978,
    longitude: 72.6245,
  },

  // East Zone (7 wards)
  Amraiwadi: {
    name: 'Amraiwadi',
    gujaratiName: 'અમરાઈવાડી',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Suresh Patel (Works Supervisor)',
    officerPhone: '+91 79 2539 4101',
    latitude: 23.0078,
    longitude: 72.6356,
  },
  Nikol: {
    name: 'Nikol',
    gujaratiName: 'નિકોલ',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Hasmukh Goti (Junior Engineer)',
    officerPhone: '+91 79 2539 4102',
    latitude: 23.0489,
    longitude: 72.6712,
  },
  Odhav: {
    name: 'Odhav',
    gujaratiName: 'ઓઢવ',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Pravin Chauhan (Sanitary Officer)',
    officerPhone: '+91 79 2539 4103',
    latitude: 23.0234,
    longitude: 72.6689,
  },
  'Ramol-Hathijan': {
    name: 'Ramol-Hathijan',
    gujaratiName: 'રામોલ-હાથીજણ',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Jayanti Solanki (Drainage Inspector)',
    officerPhone: '+91 79 2539 4104',
    latitude: 22.9789,
    longitude: 72.6612,
  },
  Vastral: {
    name: 'Vastral',
    gujaratiName: 'વસ્ત્રાલ',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Vipul Patel (Road Inspector)',
    officerPhone: '+91 79 2539 4105',
    latitude: 23.0012,
    longitude: 72.6589,
  },
  Viratnagar: {
    name: 'Viratnagar',
    gujaratiName: 'વિરાટનગર',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Ketan Barot (Ward Supervisor)',
    officerPhone: '+91 79 2539 4106',
    latitude: 23.0278,
    longitude: 72.6489,
  },
  Gomtipur: {
    name: 'Gomtipur',
    gujaratiName: 'ગોમતીપુર',
    zone: 'East Zone',
    headquarters: 'Harubhai Mehta Bhavan, Viratnagar',
    officerName: 'Manish Parmar (Field Officer)',
    officerPhone: '+91 79 2539 4107',
    latitude: 23.0189,
    longitude: 72.6234,
  },

  // West Zone (9 wards)
  Navrangpura: {
    name: 'Navrangpura',
    gujaratiName: 'નવરંગપુરા',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Rajesh Trivedi (Senior City Engineer)',
    officerPhone: '+91 79 2539 4410',
    latitude: 23.0365,
    longitude: 72.5611,
  },
  Naranpura: {
    name: 'Naranpura',
    gujaratiName: 'નારણપુરા',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Gaurang Vyas (Ward Inspector)',
    officerPhone: '+91 79 2539 4411',
    latitude: 23.0567,
    longitude: 72.5534,
  },
  Paldi: {
    name: 'Paldi',
    gujaratiName: 'પાલડી',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'K. J. Makwana (Ward 11 Inspector)',
    officerPhone: '+91 79 2539 8812',
    latitude: 23.0124,
    longitude: 72.5626,
  },
  Vasna: {
    name: 'Vasna',
    gujaratiName: 'વાસણા',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Sanjay Bharwad (Civil Supervisor)',
    officerPhone: '+91 79 2539 4412',
    latitude: 22.9989,
    longitude: 72.5478,
  },
  Ranip: {
    name: 'Ranip',
    gujaratiName: 'રાણીપ',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Nayan Dave (Sanitary Inspector)',
    officerPhone: '+91 79 2539 4413',
    latitude: 23.0789,
    longitude: 72.5712,
  },
  Sabarmati: {
    name: 'Sabarmati',
    gujaratiName: 'સાબરમતી',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Sunil Patel (Drainage Superintendent)',
    officerPhone: '+91 79 2539 4414',
    latitude: 23.0845,
    longitude: 72.5823,
  },
  'Chandkheda-Motera': {
    name: 'Chandkheda-Motera',
    gujaratiName: 'ચાંદખેડા-મોટેરા',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Vijay Parmar (North Control Officer)',
    officerPhone: '+91 79 2539 1109',
    latitude: 23.1118,
    longitude: 72.5722,
  },
  'Nava Vadaj': {
    name: 'Nava Vadaj',
    gujaratiName: 'નવા વાડજ',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Mahendra Solanki (Ward Inspector)',
    officerPhone: '+91 79 2539 4415',
    latitude: 23.0612,
    longitude: 72.5712,
  },
  'Sardar Patel Stadium': {
    name: 'Sardar Patel Stadium',
    gujaratiName: 'સરદાર પટેલ સ્ટેડિયમ',
    zone: 'West Zone',
    headquarters: 'Usmanpura Zonal Office',
    officerName: 'Hemant Shukla (Works Engineer)',
    officerPhone: '+91 79 2539 4416',
    latitude: 23.0412,
    longitude: 72.5645,
  },

  // North West Zone (5 wards)
  Bodakdev: {
    name: 'Bodakdev',
    gujaratiName: 'બોડકદેવ',
    zone: 'North West Zone',
    headquarters: 'Bodakdev Zonal Office, Judges Bungalow',
    officerName: 'Nilesh Solanki (Chief Sanitary Inspector)',
    officerPhone: '+91 79 2539 6621',
    latitude: 23.0416,
    longitude: 72.5085,
  },
  Thaltej: {
    name: 'Thaltej',
    gujaratiName: 'થલતેજ',
    zone: 'North West Zone',
    headquarters: 'Bodakdev Zonal Office, Judges Bungalow',
    officerName: 'Ravi Mehta (Ward Engineer)',
    officerPhone: '+91 79 2539 6622',
    latitude: 23.0589,
    longitude: 72.5112,
  },
  Gota: {
    name: 'Gota',
    gujaratiName: 'ગોટા',
    zone: 'North West Zone',
    headquarters: 'Bodakdev Zonal Office, Judges Bungalow',
    officerName: 'Chirag Patel (Civil Supervisor)',
    officerPhone: '+91 79 2539 6623',
    latitude: 23.0989,
    longitude: 72.5345,
  },
  Ghatlodiya: {
    name: 'Ghatlodiya',
    gujaratiName: 'ઘાટલોડિયા',
    zone: 'North West Zone',
    headquarters: 'Bodakdev Zonal Office, Judges Bungalow',
    officerName: 'Deepak Bhatt (Junior Inspector)',
    officerPhone: '+91 79 2539 6624',
    latitude: 23.0712,
    longitude: 72.5412,
  },
  Chandlodiya: {
    name: 'Chandlodiya',
    gujaratiName: 'ચાંદલોડિયા',
    zone: 'North West Zone',
    headquarters: 'Bodakdev Zonal Office, Judges Bungalow',
    officerName: 'Bhavin Shah (Drainage Inspector)',
    officerPhone: '+91 79 2539 6625',
    latitude: 23.0812,
    longitude: 72.5489,
  },

  // South West Zone (4 wards)
  'Satellite-Jodhpur': {
    name: 'Satellite-Jodhpur',
    gujaratiName: 'સેટેલાઇટ-જોધપુર',
    zone: 'South West Zone',
    headquarters: 'Jodhpur Zonal Office',
    officerName: 'Pragnesh Patel (Works Supervisor)',
    officerPhone: '+91 79 2539 7733',
    latitude: 23.0298,
    longitude: 72.5186,
  },
  Vejalpur: {
    name: 'Vejalpur',
    gujaratiName: 'વેજલપુર',
    zone: 'South West Zone',
    headquarters: 'Jodhpur Zonal Office',
    officerName: 'Ritesh Vaghela (Sanitary Officer)',
    officerPhone: '+91 79 2539 7734',
    latitude: 23.0078,
    longitude: 72.5289,
  },
  Sarkhej: {
    name: 'Sarkhej',
    gujaratiName: 'સરખેજ',
    zone: 'South West Zone',
    headquarters: 'Jodhpur Zonal Office',
    officerName: 'Harish Makwana (Civil Inspector)',
    officerPhone: '+91 79 2539 7735',
    latitude: 22.9834,
    longitude: 72.5012,
  },
  Maktampura: {
    name: 'Maktampura',
    gujaratiName: 'મકતમપુરા',
    zone: 'South West Zone',
    headquarters: 'Jodhpur Zonal Office',
    officerName: 'Irfan Pathan (Field Inspector)',
    officerPhone: '+91 79 2539 7736',
    latitude: 22.9912,
    longitude: 72.5156,
  },
};

// ============================================================================
// 3. Official AMC Departments
// ============================================================================

export const AMC_DEPARTMENTS_CONFIG: Record<string, DepartmentInfo> = {
  'Roads & Bridges': {
    key: 'ROADS_BRIDGES',
    name: 'Roads & Bridges Department',
    gujaratiName: 'રોડ અને બ્રિજ વિભાગ',
    defaultSla: '24 Hours',
    description: 'Potholes, asphalt damage, road depressions, broken dividers, cave-ins',
    keywords: ['pothole', 'road', 'asphalt', 'divider', 'crater', 'bridge', 'pavement'],
  },
  'Solid Waste Management': {
    key: 'SOLID_WASTE',
    name: 'Solid Waste Management (SWM)',
    gujaratiName: 'ઘન કચરા વ્યવસ્થાપન વિભાગ',
    defaultSla: '12 Hours',
    description: 'Garbage heaps, uncollected community bins, bio-waste, street litter, dead animals',
    keywords: ['garbage', 'waste', 'trash', 'kachra', 'dump', 'bin', 'litter', 'smell'],
  },
  'Street Lighting & Electrical': {
    key: 'STREET_LIGHTING',
    name: 'Street Lighting & Electrical Dept',
    gujaratiName: 'સ્ટ્રીટ લાઇટ અને ઇલેક્ટ્રિકલ વિભાગ',
    defaultSla: '24 Hours',
    description: 'Broken lamp posts, non-functional streetlights, sparking boxes, dangling wires',
    keywords: ['light', 'lamp', 'dark', 'bulb', 'electric', 'wire', 'pole', 'spark'],
  },
  'Drainage & Storm Water': {
    key: 'DRAINAGE_WATER',
    name: 'Drainage & Storm Water Dept',
    gujaratiName: 'ડ્રેનેજ અને વરસાદી પાણી વિભાગ',
    defaultSla: '12 Hours',
    description: 'Waterlogging, flooded underpasses, gutter clogs, open manhole covers, sewer overflow',
    keywords: ['water', 'drain', 'drainage', 'gutter', 'sewer', 'manhole', 'flood', 'overflow'],
  },
};

// ============================================================================
// 4. Helper Functions
// ============================================================================

export function getAllZones(): ZoneInfo[] {
  return Object.values(AMC_ZONES);
}

export function getWardsByZone(zoneName: string): WardInfo[] {
  const zone = AMC_ZONES[zoneName];
  if (!zone) return [];
  return zone.wards.map((wName) => AMC_ALL_WARDS[wName]).filter(Boolean);
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

export function resolveWardByCoordinates(lat: number, lng: number): WardInfo {
  let closestWard: WardInfo = AMC_ALL_WARDS.Navrangpura;
  let minDistance = Infinity;

  for (const ward of Object.values(AMC_ALL_WARDS)) {
    const dist = calculateDistanceKm(lat, lng, ward.latitude, ward.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closestWard = ward;
    }
  }

  return closestWard;
}

export function resolveWardByName(wardName: string): WardInfo {
  const clean = (wardName || '').trim().toLowerCase();
  for (const [key, value] of Object.entries(AMC_ALL_WARDS)) {
    if (key.toLowerCase() === clean || clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return value;
    }
  }
  return AMC_ALL_WARDS.Navrangpura;
}
