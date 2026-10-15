# 🏠 Addix Stay - Stay & Rental Portal (स्टे एवं रेंटल पोर्टल)

Jharkhand's premier all-in-one accommodation, rental, and commercial property portal, launched initially in **Hazaribagh** (हजारीबाग) and designed for expansion across all districts of Jharkhand. Official Contact / WhatsApp: **+91-7631740228**.

---

## 🌟 Key Features (मुख्य विशेषताएं)

1. **All Property Categories Included**:
   - 🎓 **Student Hostels (Boys & Girls)**: Vinoba Bhave University (VBU) & Annada College coaching hubs, mess food, Wi-Fi, warden info.
   - 🚪 **Lodges & To-Let Rooms**: Single & double rooms for students and competitive exam aspirants (Babugaon, Korrah, Dipugarha).
   - 🏢 **Family Flats (Permanent Residency)**: 1BHK, 2BHK, 3BHK apartments in Hurhuru, Nawabganj, Matwari with parking and 24x7 water.
   - 🏨 **Hotels & Guest Houses (Visiting / Short Stay)**: Canary Hill tourism road & District More (Govt Bus Stand) for tourists and visitors.
   - 🏪 **Commercial Shops & Showrooms**: Prime main road shops (Jhanda Chowk, Malviya Marg, Matwari) for retail, clinics, offices.

2. **Complete Hazaribagh GPS Map**:
   - Leaflet.js interactive map centered on Hazaribagh `(23.9967° N, 85.3687° E)`.
   - Category-colored GPS pins with instant popups.
   - Landmark pins: *VBU*, *Annada College*, *St. Columba's College*, *Hazaribagh Lake*, *Canary Hill*, *New Bus Stand*.
   - Locality quick-jump navigation and "Locate Me (GPS)" button.
   - 1-Click Google Maps turn-by-turn navigation directions.

3. **Owner Manual Listing & Tracking Portal**:
   - Manual data entry wizard for property owners:
     - Title, Category, Audience, Pricing, Security deposit, Units.
     - Interactive **Map Pin Picker**: click anywhere on Hazaribagh map to auto-set Latitude & Longitude!
     - 10+ Amenities checklist.
     - Direct Contact details (Calling Phone, WhatsApp Number, Email).
   - Owner dashboard to track live properties, edit/delete, and manage incoming leads with 1-click WhatsApp reply!

4. **Instant Direct Contact (WhatsApp, Call & Email)**:
   - 🟢 1-Click WhatsApp Chat (`https://wa.me/...`) with pre-filled message.
   - 📞 Direct Phone Call button (`tel:...`).
   - ✉️ Direct Inquiry Modal saving leads in database.

5. **Multi-Role Support (Renter, Owner, Admin & Super Admin)**:
   - Instant Header Role Switcher for live testing:
     - 👤 **Student / Renter**: Browse, search, filter, contact owners, chat with AI bot.
     - 🏠 **Property Owner**: Add properties manually, track listings, reply to inquiries.
     - 🛡️ **City Admin**: Verify, approve, reject, feature/unfeature listings.
     - 👑 **Super Admin**: Complete city analytics, assign user roles, update platform settings & broadcast banners.

6. **🤖 "Hazaribagh Mitra" - AI Chat Assistant**:
   - Intelligent floating assistant speaking Hinglish, Hindi, and English.
   - Recommends rooms based on colleges (VBU, Annada, St. Columba's), budget, or area.
   - Displays interactive cards directly inside chat with WhatsApp buttons.

---

## 🚀 How to Run the Website (वेबसाइट कैसे चलाएं)

### 1. Requirements:
- Node.js (v18+)
- Browser (Chrome, Edge, Firefox)

### 2. Start the Server:
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\hazaribagh-stay
node server.js
```

### 3. Open in Browser:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
hazaribagh-stay/
├── server.js               # Node.js Express Backend REST API
├── package.json            # Node.js Dependencies
├── README.md               # Complete Documentation & Guide
├── data/
│   ├── properties.json     # Pre-seeded Hazaribagh property listings
│   ├── users.json          # Demo user accounts (Renter, Owner, Admin, Super Admin)
│   ├── inquiries.json      # Inquiries and student lead messages
│   └── settings.json       # Platform helpline, banners, and map settings
└── public/
    ├── index.html          # Main responsive SPA UI with Tailwind CSS
    ├── css/
    │   └── custom.css      # Glassmorphism, animations, Leaflet map styles
    └── js/
        ├── app.js          # App controller, role switcher, filtering, modals
        ├── map.js          # Leaflet Hazaribagh GPS map & pin picker
        ├── chatbot.js      # Hazaribagh Mitra AI chatbot logic
        └── data.js         # Localities metadata, categories, API client
```
