# 🏠 Addix Stay - Stay & Rental Portal (स्टे एवं रेंटल पोर्टल)

Jharkhand's premier all-in-one accommodation, rental, and commercial property portal, launched initially in **Hazaribagh** (हजारीबाग) and architected for expansion across all 24 districts of Jharkhand.

- 🌐 **Live Website (Vercel)**: [https://hazaribagh-stay.vercel.app](https://hazaribagh-stay.vercel.app)
- 🐙 **GitHub Repository**: [https://github.com/deepakprasadverma/hazaribagh-stay](https://github.com/deepakprasadverma/hazaribagh-stay)
- 📱 **Official Helpline / WhatsApp**: **+91-7631740228**
- ✉️ **Support Email**: `contact@addixstay.in`

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
   - 🟢 1-Click WhatsApp Chat (`https://wa.me/917631740228`) with pre-filled message.
   - 📞 Direct Phone Call button (`tel:+917631740228`).
   - ✉️ Direct Inquiry Modal saving leads in database.

5. **Discreet & Secure Admin Access (Hidden Portals)**:
   - Regular public visitors only see public roles (**Student / Renter** & **Property Owner**).
   - Admin and Super Admin access are securely hidden and can be accessed via:
     - ⌨️ **Keyboard Shortcut**: `Ctrl + Shift + A` (or `Alt + A`).
     - 🔗 **Direct URL Hash**: `/#superadmin`, `/#admin`, or `/#admin-portal`.
     - 🦶 **Footer Link**: Discreet `Staff Portal` link in footer.
     - 🖱️ **Logo Triple-Click**: 3 consecutive clicks on the top "Addix Stay" logo.

6. **🤖 "Hazaribagh Mitra" - AI Chat Assistant**:
   - Intelligent floating assistant speaking Hinglish, Hindi, and English.
   - Recommends rooms based on colleges (VBU, Annada, St. Columba's), budget, or area.
   - Displays interactive cards directly inside chat with WhatsApp buttons.

---

## 🔐 Demo Credentials (लॉगिन विवरण)

| Role | Email ID / Username | Password | 4-Digit Quick PIN | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `superadmin@addixstay.in` | `superadmin123` | **`9999`** | Full platform analytics, settings, district expansion |
| 🛡️ **City Admin** | `admin.hazaribagh@stayhub.in` | `admin123` | **`1234`** | Property approvals, moderation, featured badges |
| 🏠 **Property Owner** | `ramesh.vbu.hostel@gmail.com` | `owner123` | **`5678`** | Post property, manage rooms, track student inquiries |
| 👤 **Student / Renter** | *Default Public Access* | *None* | *None* | Browse listings, GPS map search, direct WhatsApp contact |

---

## 🚀 How to Run Locally (लोकल सर्वर शुरू करें)

```powershell
# 1. Clone repository
git clone https://github.com/deepakprasadverma/hazaribagh-stay.git
cd hazaribagh-stay

# 2. Install dependencies
npm install

# 3. Start local development server
npm start
```

Open **`http://localhost:3000`** in your browser.

---

## 📁 Project Structure

```
hazaribagh-stay/
├── server.js               # Node.js Express Backend REST API
├── package.json            # Node.js Dependencies & NPM Scripts
├── vercel.json             # Vercel Serverless & SPA routing config
├── README.md               # Complete Documentation & Guide
├── data/
│   ├── properties.json     # Pre-seeded property listings
│   ├── users.json          # Demo user accounts (Renter, Owner, Admin, Super Admin)
│   ├── inquiries.json      # Inquiries and student lead messages
│   └── settings.json       # Platform helpline, banners, and map settings
└── public/
    ├── index.html          # Main responsive SPA UI with Tailwind CSS
    ├── css/
    │   └── custom.css      # Glassmorphism, animations, Leaflet map styles
    └── js/
        ├── app.js          # App controller, role switcher, filtering, modals
        ├── map.js          # Leaflet GPS map & interactive pin picker
        ├── chatbot.js      # Hazaribagh Mitra AI chatbot logic
        └── data.js         # Localities metadata, categories, API client
```
