// Jharkhand Multi-District Platform Constants & Data
const JHARKHAND_DATA = {
  activeDistrict: 'Hazaribagh',
  districts: {
    'Hazaribagh': {
      name: 'Hazaribagh',
      hindi: 'हजारीबाग',
      status: 'Active Hub',
      center: [23.9967, 85.3687],
      zoom: 13,
      localities: [
        { name: "Matwari", desc: "Annada College & Coaching Hub", lat: 23.9935, lng: 85.3621 },
        { name: "Korrah", desc: "Vinoba Bhave University (VBU) Area", lat: 24.0042, lng: 85.3812 },
        { name: "Babugaon", desc: "Coaching Mandi & Bypass Road", lat: 23.9878, lng: 85.3745 },
        { name: "Hurhuru", desc: "Peaceful Family Residential Area", lat: 23.9989, lng: 85.3524 },
        { name: "Nawabganj", desc: "Central Market & Sadar Hospital", lat: 23.9941, lng: 85.3592 },
        { name: "Canary Hill Road", desc: "Tourism & Scenic Guest Houses", lat: 24.0152, lng: 85.3725 },
        { name: "Dipugarha", desc: "St. Columba's College Area", lat: 24.0015, lng: 85.3698 },
        { name: "Jhanda Chowk", desc: "Prime Commercial Main Road", lat: 23.9958, lng: 85.3648 },
        { name: "District More", desc: "New Bus Stand & Transit Lodges", lat: 23.9922, lng: 85.3665 },
        { name: "Okni / Lake Road", desc: "Hazaribagh Jheel & Parks", lat: 23.9890, lng: 85.3570 }
      ],
      landmarks: [
        { name: "Vinoba Bhave University (VBU)", lat: 24.0042, lng: 85.3812, type: "Univ" },
        { name: "Annada College", lat: 23.9930, lng: 85.3615, type: "College" },
        { name: "St. Columba's College", lat: 24.0020, lng: 85.3695, type: "College" },
        { name: "Hazaribagh Lake (Jheel)", lat: 23.9890, lng: 85.3570, type: "Tourism" },
        { name: "Canary Hill Viewpoint", lat: 24.0180, lng: 85.3750, type: "Tourism" },
        { name: "Govt Bus Stand (District More)", lat: 23.9922, lng: 85.3665, type: "Transport" }
      ]
    },
    'Ranchi': {
      name: 'Ranchi',
      hindi: 'राँची (राजधानी)',
      status: 'Live',
      center: [23.3700, 85.3250],
      zoom: 13,
      localities: [
        { name: "Lalpur", desc: "Coaching & Girls PG Hub (Nucleus Mall)", lat: 23.3725, lng: 85.3340 },
        { name: "Morabadi", desc: "Morabadi Ground & Peaceful Flats", lat: 23.3920, lng: 85.3260 },
        { name: "Kanke Road", desc: "BAU University & Premium Residential", lat: 23.4050, lng: 85.3180 },
        { name: "Doranda", desc: "High Court & Central Secretariat", lat: 23.3360, lng: 85.3250 },
        { name: "Ratu Road", desc: "Commercial & Business Hub", lat: 23.3780, lng: 85.3050 },
        { name: "Bariatu", desc: "RIMS Medical College Hospital Area", lat: 23.3960, lng: 85.3580 }
      ],
      landmarks: [
        { name: "Ranchi University", lat: 23.3860, lng: 85.3240, type: "Univ" },
        { name: "Morabadi Ground", lat: 23.3910, lng: 85.3270, type: "Tourism" },
        { name: "Ranchi Railway Station", lat: 23.3510, lng: 85.3380, type: "Transport" }
      ]
    },
    'Dhanbad': {
      name: 'Dhanbad',
      hindi: 'धनबाद',
      status: 'Live',
      center: [23.7957, 86.4304],
      zoom: 13,
      localities: [
        { name: "Bank More", desc: "Prime Commercial & Retail Market", lat: 23.7885, lng: 86.4250 },
        { name: "Saraidhela", desc: "Malls, Hospitals & Residential Flats", lat: 23.8180, lng: 86.4480 },
        { name: "Hirapur", desc: "Student Lodges & Coaching Hub", lat: 23.8050, lng: 86.4350 },
        { name: "City Centre", desc: "Commercial Complex & Offices", lat: 23.8120, lng: 86.4420 }
      ],
      landmarks: [
        { name: "IIT (ISM) Dhanbad", lat: 23.8160, lng: 86.4410, type: "Univ" },
        { name: "Dhanbad Junction", lat: 23.7920, lng: 86.4290, type: "Transport" }
      ]
    },
    'Bokaro': {
      name: 'Bokaro',
      hindi: 'बोकारो स्टील सिटी',
      status: 'Live',
      center: [23.6693, 86.1511],
      zoom: 13,
      localities: [
        { name: "Sector 4", desc: "Student Coaching & City Centre Hub", lat: 23.6695, lng: 86.1515 },
        { name: "Chas", desc: "Affordable Family Flats & Markets", lat: 23.6350, lng: 86.1750 },
        { name: "Sector 1", desc: "Residential Colony with Parks", lat: 23.6780, lng: 86.1350 },
        { name: "Cooperative Colony", desc: "Quiet Residential Society", lat: 23.6520, lng: 86.1680 }
      ],
      landmarks: [
        { name: "City Centre Sector 4", lat: 23.6680, lng: 86.1520, type: "Commercial" },
        { name: "Bokaro Steel Plant", lat: 23.6750, lng: 86.1850, type: "Industrial" }
      ]
    },
    'Ramgarh': {
      name: 'Ramgarh',
      hindi: 'रामगढ़',
      status: 'Live',
      center: [23.6332, 85.5147],
      zoom: 13,
      localities: [
        { name: "Subhash Chowk", desc: "Main Road Market & Bus Stand", lat: 23.6335, lng: 85.5150 },
        { name: "Ramgarh Cantt", desc: "Cantt Area & Army Ground", lat: 23.6280, lng: 85.5250 },
        { name: "Chitarpur", desc: "RU University Link & Colleges", lat: 23.5850, lng: 85.6450 }
      ],
      landmarks: [
        { name: "Rajrappa Mandir Link", lat: 23.6320, lng: 85.5200, type: "Tourism" },
        { name: "Ramgarh Cantt Railway Station", lat: 23.6390, lng: 85.5080, type: "Transport" }
      ]
    },
    'Giridih': {
      name: 'Giridih',
      hindi: 'गिरिडीह',
      status: 'Launch Phase',
      center: [24.1856, 86.3097],
      zoom: 13,
      localities: [
        { name: "Makatpur", desc: "Commercial & Shopping Market", lat: 24.1870, lng: 86.3120 },
        { name: "Bada Chowk", desc: "Main Town Area & Lodges", lat: 24.1820, lng: 86.3050 },
        { name: "Pachamba", desc: "Quiet Residential Colony", lat: 24.2150, lng: 86.2750 }
      ],
      landmarks: [
        { name: "Usri Falls Road", lat: 24.1950, lng: 86.3250, type: "Tourism" }
      ]
    },
    'Deoghar': {
      name: 'Deoghar',
      hindi: 'देवघर (बाबाधाम)',
      status: 'Live',
      center: [24.4826, 86.7003],
      zoom: 13,
      localities: [
        { name: "Tower Chowk", desc: "Central Market & Pilgrim Hotels", lat: 24.4850, lng: 86.6980 },
        { name: "Jasidih", desc: "Main Railway Junction & Transits", lat: 24.5150, lng: 86.6450 },
        { name: "Castairs Town", desc: "Peaceful Residential Colony", lat: 24.4780, lng: 86.7080 }
      ],
      landmarks: [
        { name: "Baba Baidyanath Jyotirlinga", lat: 24.4920, lng: 86.7000, type: "Tourism" }
      ]
    },
    'Koderma': {
      name: 'Koderma',
      hindi: 'कोडरमा / झुमरी तिलैया',
      status: 'Launch Phase',
      center: [24.4340, 85.5350],
      zoom: 13,
      localities: [
        { name: "Jhumri Telaiya", desc: "Famous Commercial Town & Lodges", lat: 24.4350, lng: 85.5320 },
        { name: "Station Road", desc: "Koderma Junction Transit Area", lat: 24.4420, lng: 85.5280 }
      ],
      landmarks: [
        { name: "Koderma Railway Junction", lat: 24.4430, lng: 85.5290, type: "Transport" }
      ]
    },
    'Chatra': {
      name: 'Chatra',
      hindi: 'चतरा',
      status: 'Launch Phase',
      center: [24.2094, 84.8715],
      zoom: 13,
      localities: [
        { name: "Main Market", desc: "Main Town Market & Lodges", lat: 24.2110, lng: 84.8730 },
        { name: "Sadar Hospital Road", desc: "Residential Area", lat: 24.2050, lng: 84.8690 }
      ],
      landmarks: [
        { name: "Chatra Collectorate", lat: 24.2080, lng: 84.8750, type: "Govt" }
      ]
    }
  }
};

// Backward-compatible alias for existing references
const HAZARIBAGH_DATA = {
  center: JHARKHAND_DATA.districts.Hazaribagh.center,
  zoom: JHARKHAND_DATA.districts.Hazaribagh.zoom,
  localities: JHARKHAND_DATA.districts.Hazaribagh.localities,
  categories: {
    student_hostel: {
      label: "Student Hostel (छात्र हॉस्टल)",
      short: "Hostel",
      icon: "fa-graduation-cap",
      color: "#8b5cf6",
      bgClass: "badge-student_hostel",
      target: "Boys / Girls Students"
    },
    student_lodge: {
      label: "Lodge & To-Let Room (लॉज / सिंगल रूम)",
      short: "Lodge / Room",
      icon: "fa-bed",
      color: "#06b6d4",
      bgClass: "badge-student_lodge",
      target: "Single / Double To-Let"
    },
    family_flat: {
      label: "Family Flat (फैमिली फ्लैट / अपार्टमेंट)",
      short: "Family Flat",
      icon: "fa-building-user",
      color: "#2563eb",
      bgClass: "badge-family_flat",
      target: "Permanent Residency"
    },
    hotel_stay: {
      label: "Hotel & Guest House (होटल / विजिटिंग स्टे)",
      short: "Hotel / Visiting",
      icon: "fa-hotel",
      color: "#10b981",
      bgClass: "badge-hotel_stay",
      target: "Short Stay / Daily Booking"
    },
    commercial_shop: {
      label: "Shop & Office Rent (दुकान / कमर्शियल स्पेस)",
      short: "Shop for Rent",
      icon: "fa-store",
      color: "#ea580c",
      bgClass: "badge-commercial_shop",
      target: "Retail / Business Rent"
    }
  },
  amenitiesList: [
    { id: "wifi", label: "High-Speed Wi-Fi", icon: "fa-wifi" },
    { id: "ro_water", label: "RO Drinking Water", icon: "fa-faucet-drip" },
    { id: "food", label: "Mess / Food Included", icon: "fa-utensils" },
    { id: "power_backup", label: "24x7 Inverter / Power Backup", icon: "fa-bolt" },
    { id: "cctv", label: "CCTV & Security Guard", icon: "fa-shield-halved" },
    { id: "attached_bath", label: "Attached Bathroom", icon: "fa-bath" },
    { id: "parking", label: "Bike / Car Parking", icon: "fa-motorcycle" },
    { id: "ac", label: "Air Conditioner (AC)", icon: "fa-snowflake" },
    { id: "lift", label: "Lift Facility", icon: "fa-elevator" },
    { id: "shutter", label: "Commercial Rolling Shutter", icon: "fa-door-open" }
  ],
  presetImages: {
    student_hostel: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    student_lodge: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    family_flat: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    hotel_stay: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
    ],
    commercial_shop: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
    ]
  }
};

// API Helper Client
const API = {
  async getProperties(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/properties?${query}`);
    return await res.json();
  },
  async getProperty(id) {
    const res = await fetch(`/api/properties/${id}`);
    return await res.json();
  },
  async createProperty(data) {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  async updateProperty(id, data) {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  async deleteProperty(id) {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },
  async updatePropertyStatus(id, data) {
    const res = await fetch(`/api/properties/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  async getInquiries(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/inquiries?${query}`);
    return await res.json();
  },
  async createInquiry(data) {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  async updateInquiryStatus(id, status) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },
  async getUsers() {
    const res = await fetch('/api/users');
    return await res.json();
  },
  async updateUserRole(id, data) {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  async getStats() {
    const res = await fetch('/api/stats');
    return await res.json();
  },
  async getSettings() {
    const res = await fetch('/api/settings');
    return await res.json();
  },
  async updateSettings(data) {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  async sendChatMessage(message) {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await res.json();
  },
  async login(credentials) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  }
};
