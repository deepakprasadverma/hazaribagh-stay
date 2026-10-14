const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const PROPS_FILE = path.join(DATA_DIR, 'properties.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Helper to read and write JSON safely
const readJson = (filePath, fallback = []) => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
};

const writeJson = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// ================= PROPERTY ROUTES ================= //

// GET all properties with filtering
app.get('/api/properties', (req, res) => {
  let properties = readJson(PROPS_FILE, []);
  const { category, locality, minPrice, maxPrice, search, ownerId, status } = req.query;

  if (category && category !== 'all') {
    properties = properties.filter(p => p.category === category);
  }

  if (locality && locality !== 'all') {
    properties = properties.filter(p => p.locality.toLowerCase() === locality.toLowerCase());
  }

  if (minPrice) {
    properties = properties.filter(p => Number(p.price) >= Number(minPrice));
  }

  if (maxPrice) {
    properties = properties.filter(p => Number(p.price) <= Number(maxPrice));
  }

  if (ownerId) {
    properties = properties.filter(p => p.ownerId === ownerId);
  }

  if (status) {
    properties = properties.filter(p => p.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    properties = properties.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.landmark.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: properties.length, data: properties });
});

// GET single property
app.get('/api/properties/:id', (req, res) => {
  const properties = readJson(PROPS_FILE, []);
  const item = properties.find(p => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  res.json({ success: true, data: item });
});

// POST create new property (Owner manual listing)
app.post('/api/properties', (req, res) => {
  const properties = readJson(PROPS_FILE, []);
  const newProp = {
    id: 'prop-' + Date.now(),
    title: req.body.title || 'Untitled Property',
    category: req.body.category || 'student_hostel',
    targetAudience: req.body.targetAudience || 'Any',
    price: Number(req.body.price) || 2000,
    pricePeriod: req.body.pricePeriod || 'month',
    deposit: Number(req.body.deposit) || 0,
    locality: req.body.locality || 'Matwari',
    address: req.body.address || 'Hazaribagh',
    landmark: req.body.landmark || '',
    lat: Number(req.body.lat) || 23.9967,
    lng: Number(req.body.lng) || 85.3687,
    sharing: req.body.sharing || 'Single',
    foodIncluded: req.body.foodIncluded === true || req.body.foodIncluded === 'true',
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
    ownerId: req.body.ownerId || 'owner-1',
    ownerName: req.body.ownerName || 'Property Owner',
    ownerPhone: req.body.ownerPhone || '+919431100000',
    ownerWhatsapp: req.body.ownerWhatsapp || '919431100000',
    ownerEmail: req.body.ownerEmail || 'owner@hazaribaghstay.in',
    images: Array.isArray(req.body.images) && req.body.images.length > 0 
      ? req.body.images 
      : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
    description: req.body.description || '',
    status: req.body.status || 'approved', // Instant approved for smooth demo
    isFeatured: req.body.isFeatured || false,
    availableRooms: Number(req.body.availableRooms) || 1,
    createdAt: new Date().toISOString()
  };

  properties.unshift(newProp);
  writeJson(PROPS_FILE, properties);

  res.status(201).json({ success: true, message: 'Property successfully registered!', data: newProp });
});

// PUT update property
app.put('/api/properties/:id', (req, res) => {
  let properties = readJson(PROPS_FILE, []);
  const index = properties.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  properties[index] = { ...properties[index], ...req.body, updatedAt: new Date().toISOString() };
  writeJson(PROPS_FILE, properties);
  res.json({ success: true, message: 'Property updated', data: properties[index] });
});

// DELETE property
app.delete('/api/properties/:id', (req, res) => {
  let properties = readJson(PROPS_FILE, []);
  const exists = properties.some(p => p.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  properties = properties.filter(p => p.id !== req.params.id);
  writeJson(PROPS_FILE, properties);
  res.json({ success: true, message: 'Property deleted successfully' });
});

// PATCH toggle featured / approval status (Admin / Super Admin)
app.patch('/api/properties/:id/status', (req, res) => {
  let properties = readJson(PROPS_FILE, []);
  const item = properties.find(p => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  if (req.body.status !== undefined) item.status = req.body.status;
  if (req.body.isFeatured !== undefined) item.isFeatured = req.body.isFeatured;
  item.updatedAt = new Date().toISOString();

  writeJson(PROPS_FILE, properties);
  res.json({ success: true, message: 'Status updated', data: item });
});

// ================= INQUIRY ROUTES ================= //

// GET inquiries
app.get('/api/inquiries', (req, res) => {
  let inquiries = readJson(INQUIRIES_FILE, []);
  const { propertyId, status } = req.query;

  if (propertyId) inquiries = inquiries.filter(i => i.propertyId === propertyId);
  if (status) inquiries = inquiries.filter(i => i.status === status);

  res.json({ success: true, count: inquiries.length, data: inquiries });
});

// POST create inquiry (User directly inquiries with owner)
app.post('/api/inquiries', (req, res) => {
  const inquiries = readJson(INQUIRIES_FILE, []);
  const newInq = {
    id: 'inq-' + Date.now(),
    propertyId: req.body.propertyId,
    propertyTitle: req.body.propertyTitle || 'Property Inquiry',
    senderName: req.body.senderName || 'Anonymous Student',
    senderPhone: req.body.senderPhone || '',
    senderWhatsapp: req.body.senderWhatsapp || req.body.senderPhone || '',
    senderEmail: req.body.senderEmail || '',
    message: req.body.message || 'I am interested in this property. Please share details.',
    requestedCategory: req.body.requestedCategory || 'student_hostel',
    status: 'pending',
    date: new Date().toISOString()
  };

  inquiries.unshift(newInq);
  writeJson(INQUIRIES_FILE, inquiries);
  res.status(201).json({ success: true, message: 'Inquiry sent successfully to owner!', data: newInq });
});

// PATCH update inquiry status
app.patch('/api/inquiries/:id', (req, res) => {
  let inquiries = readJson(INQUIRIES_FILE, []);
  const inq = inquiries.find(i => i.id === req.params.id);
  if (!inq) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  if (req.body.status) inq.status = req.body.status;
  writeJson(INQUIRIES_FILE, inquiries);
  res.json({ success: true, message: 'Inquiry updated', data: inq });
});

// ================= USER & AUTH ROUTES ================= //

app.get('/api/users', (req, res) => {
  const users = readJson(USERS_FILE, []);
  res.json({ success: true, data: users });
});

// User & Admin Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, pin, role } = req.body;
  const users = readJson(USERS_FILE, []);

  let user = null;
  if (email) {
    user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim());
  } else if (role) {
    user = users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found. Please check your email or role.' });
  }

  if (password && user.password && user.password !== password.trim()) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  if (pin && user.pin && user.pin !== pin.trim()) {
    return res.status(401).json({ success: false, message: 'Incorrect PIN.' });
  }

  res.json({
    success: true,
    message: `Login successful as ${user.name}`,
    user: user
  });
});

app.post('/api/users/register', (req, res) => {
  const users = readJson(USERS_FILE, []);
  const newUser = {
    id: 'user-' + Date.now(),
    name: req.body.name,
    role: req.body.role || 'renter',
    phone: req.body.phone,
    whatsapp: req.body.whatsapp || req.body.phone,
    email: req.body.email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isVerified: req.body.role === 'owner' ? false : true,
    joined: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  writeJson(USERS_FILE, users);
  res.status(201).json({ success: true, message: 'User registered successfully!', data: newUser });
});

app.patch('/api/users/:id', (req, res) => {
  let users = readJson(USERS_FILE, []);
  const u = users.find(x => x.id === req.params.id);
  if (!u) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (req.body.role) u.role = req.body.role;
  if (req.body.isVerified !== undefined) u.isVerified = req.body.isVerified;
  writeJson(USERS_FILE, users);
  res.json({ success: true, message: 'User updated', data: u });
});

// ================= SETTINGS & STATS ================= //

app.get('/api/settings', (req, res) => {
  const settings = readJson(SETTINGS_FILE, {});
  res.json({ success: true, data: settings });
});

app.put('/api/settings', (req, res) => {
  const current = readJson(SETTINGS_FILE, {});
  const updated = { ...current, ...req.body };
  writeJson(SETTINGS_FILE, updated);
  res.json({ success: true, message: 'Settings saved', data: updated });
});

// Admin / Super Admin Analytics Stats
app.get('/api/stats', (req, res) => {
  const properties = readJson(PROPS_FILE, []);
  const users = readJson(USERS_FILE, []);
  const inquiries = readJson(INQUIRIES_FILE, []);

  const categoryBreakdown = {};
  const localityBreakdown = {};

  properties.forEach(p => {
    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
    localityBreakdown[p.locality] = (localityBreakdown[p.locality] || 0) + 1;
  });

  const stats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'approved').length,
    pendingProperties: properties.filter(p => p.status === 'pending').length,
    totalOwners: users.filter(u => u.role === 'owner').length,
    totalUsers: users.length,
    totalInquiries: inquiries.length,
    pendingInquiries: inquiries.filter(i => i.status === 'pending').length,
    categoryBreakdown,
    localityBreakdown
  };

  res.json({ success: true, data: stats });
});

// ================= AI CHATBOT ROUTE ================= //

app.post('/api/chatbot', (req, res) => {
  const { message } = req.body;
  const q = (message || '').toLowerCase();
  const properties = readJson(PROPS_FILE, []);

  let reply = '';
  let matchedProperties = [];

  // Match localities
  const localities = ['matwari', 'korrah', 'babugaon', 'hurhuru', 'nawabganj', 'canary', 'dipugarha', 'jhanda chowk', 'district more'];
  const matchedLocality = localities.find(loc => q.includes(loc));

  // Match categories
  let categoryFilter = null;
  if (q.includes('hostel') || q.includes('boys') || q.includes('girls')) categoryFilter = 'student_hostel';
  else if (q.includes('lodge') || q.includes('room') || q.includes('to-let') || q.includes('single')) categoryFilter = 'student_lodge';
  else if (q.includes('flat') || q.includes('family') || q.includes('bhk') || q.includes('apartment')) categoryFilter = 'family_flat';
  else if (q.includes('hotel') || q.includes('guest house') || q.includes('visit') || q.includes('day')) categoryFilter = 'hotel_stay';
  else if (q.includes('shop') || q.includes('commercial') || q.includes('office') || q.includes('showroom') || q.includes('dukan')) categoryFilter = 'commercial_shop';

  // Find candidate listings
  matchedProperties = properties.filter(p => {
    let match = true;
    if (categoryFilter && p.category !== categoryFilter) match = false;
    if (matchedLocality && !p.locality.toLowerCase().includes(matchedLocality) && !p.address.toLowerCase().includes(matchedLocality)) match = false;
    return match;
  });

  // Construct intelligent response in natural Hinglish
  if (q.includes('hello') || q.includes('hi') || q.includes('namaste') || q.includes('pranam')) {
    reply = `Namaste! 🙏 Main aapka Hazaribagh Stay Assistant hoon. Main aapko VBU, Annada College, Matwari, Korrah ya poore Hazaribagh me best Student Hostel, Lodge, Family Flat, Hotel aur Shop dhundhne me madad kar sakta hoon! Aapko kis type ki property chahiye?`;
  } else if (matchedProperties.length > 0) {
    const top = matchedProperties.slice(0, 3);
    const names = top.map(p => `• <b>${p.title}</b> (${p.locality}) - ₹${p.price}/${p.pricePeriod}`).join('<br>');
    reply = `Mujhe aapke liye Hazaribagh me <b>${matchedProperties.length}</b> behtareen options mile:<br><br>${names}<br><br>👉 Aap map par inka exact GPS location dekh sakte hain ya direct WhatsApp par owner se baat kar sakte hain!`;
  } else if (q.includes('price') || q.includes('budget') || q.includes('rent') || q.includes('kam kharch')) {
    reply = `Hazaribagh me student lodges ₹1,500 - ₹2,500/month se start hoti hain. Hostels with 4-time food ₹3,200 - ₹4,000/month me available hain. Family flats ₹7,000 - ₹15,000/month me milte hain. Aap hamare filter se apna budget set kar sakte hain!`;
  } else if (q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('help')) {
    reply = `Aap kisi bhi property ke card par <b>WhatsApp Chat</b> ya <b>Call Owner</b> button daba kar seedhe owner se baat kar sakte hain. Platform helpline WhatsApp number: <b>+91-9431100000</b> hai!`;
  } else {
    reply = `Aap Hazaribagh ke kisi bhi area jaise Matwari, Korrah, Babugaon, Hurhuru ya Main Road me Hostel, Flat, Lodge, Hotel ya Shop khoj sakte hain. Neeche diye gaye quick buttons par click karein ya apna requirement batayein!`;
  }

  res.json({
    success: true,
    reply,
    count: matchedProperties.length,
    properties: matchedProperties.slice(0, 4)
  });
});

// Fallback to index.html for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only listen if not running in a Vercel serverless environment
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🏠 Apna Hazaribagh Stay & To-Let Hub Server Running`);
    console.log(`  🌐 URL: http://localhost:${PORT}`);
    console.log(`  📍 Center: Hazaribagh, Jharkhand (GPS: 23.9967, 85.3687)`);
    console.log(`====================================================`);
  });
}

module.exports = app;
