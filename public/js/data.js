// Hazaribagh Localities and Platform Constants
const HAZARIBAGH_DATA = {
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
  }
};
