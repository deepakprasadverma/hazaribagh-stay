// Main Application Controller for Apna Hazaribagh Stay Hub

const App = {
  currentView: 'listings',
  currentUser: null,
  users: [],
  properties: [],
  settings: {},
  activeCategoryFilter: 'all',
  activeLocalityFilter: 'all',
  searchQuery: '',
  maxPriceFilter: '',

  async init() {
    await this.loadUsers();
    await this.loadSettings();
    this.setupCurrentUser('user-renter-1'); // Default to Student/Renter
    this.bindEvents();
    this.switchView('listings');
    Chatbot.init();
    await this.loadProperties();
  },

  async loadSettings() {
    try {
      const res = await API.getSettings();
      if (res.success) {
        this.settings = res.data;
        this.renderAnnouncement();
      }
    } catch (e) {
      console.warn("Failed to load settings:", e);
    }
  },

  renderAnnouncement() {
    const el = document.getElementById('announcement-banner-text');
    if (el && this.settings.announcement) {
      el.textContent = this.settings.announcement;
    }
  },

  async loadUsers() {
    try {
      const res = await API.getUsers();
      if (res.success) {
        this.users = res.data;
      }
    } catch (e) {
      console.warn("Failed to load users:", e);
    }
  },

  setupCurrentUser(userId) {
    this.currentUser = this.users.find(u => u.id === userId) || this.users[0];
    this.updateRoleUI();
  },

  switchRole(role) {
    let target = this.users.find(u => u.role === role);
    if (!target) {
      target = { id: 'temp-' + role, name: role.toUpperCase(), role };
    }
    this.currentUser = target;
    this.updateRoleUI();

    // Auto navigate to relevant view based on role
    if (role === 'owner') {
      this.switchView('owner-dashboard');
    } else if (role === 'admin') {
      this.switchView('admin-view');
    } else if (role === 'superadmin') {
      this.switchView('superadmin-view');
    } else {
      this.switchView('listings');
    }
  },

  updateRoleUI() {
    const roleBadge = document.getElementById('current-user-role-badge');
    const userNameEl = document.getElementById('current-user-name');
    const roleSelector = document.getElementById('role-selector-dropdown');

    if (roleBadge) {
      const rolesMap = {
        renter: { text: 'Student / Renter', class: 'bg-emerald-100 text-emerald-800' },
        owner: { text: 'Property Owner', class: 'bg-purple-100 text-purple-800' },
        admin: { text: 'City Admin', class: 'bg-blue-100 text-blue-800' },
        superadmin: { text: 'Super Admin', class: 'bg-amber-100 text-amber-800' }
      };
      const info = rolesMap[this.currentUser.role] || rolesMap.renter;
      roleBadge.className = `text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${info.class}`;
      roleBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-current"></span> ${info.text}`;
    }

    if (userNameEl) {
      userNameEl.textContent = this.currentUser.name;
    }

    if (roleSelector) {
      roleSelector.value = this.currentUser.role;
    }

    // Toggle nav item visibility based on permissions
    document.querySelectorAll('.owner-only').forEach(el => {
      el.style.display = (this.currentUser.role === 'owner' || this.currentUser.role === 'admin' || this.currentUser.role === 'superadmin') ? '' : 'none';
    });
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = (this.currentUser.role === 'admin' || this.currentUser.role === 'superadmin') ? '' : 'none';
    });
    document.querySelectorAll('.superadmin-only').forEach(el => {
      el.style.display = (this.currentUser.role === 'superadmin') ? '' : 'none';
    });
  },

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) {
      activeSec.classList.remove('hidden');
    }

    // Update nav links active states
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('text-blue-600', 'border-blue-600', 'font-bold');
        btn.classList.remove('text-slate-600');
      } else {
        btn.classList.remove('text-blue-600', 'border-blue-600', 'font-bold');
        btn.classList.add('text-slate-600');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle map views initialization
    if (viewName === 'map') {
      setTimeout(() => {
        MapManager.initMainMap();
        MapManager.renderPropertiesOnMap(this.properties);
        if (mainMap) mainMap.invalidateSize();
      }, 150);
    } else if (viewName === 'owner-add') {
      setTimeout(() => {
        MapManager.initPickerMap();
        if (pickerMap) pickerMap.invalidateSize();
      }, 150);
    } else if (viewName === 'owner-dashboard') {
      this.loadOwnerDashboard();
    } else if (viewName === 'admin-view') {
      this.loadAdminView();
    } else if (viewName === 'superadmin-view') {
      this.loadSuperAdminView();
    }
  },

  bindEvents() {
    // Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const v = btn.dataset.view;
        this.switchView(v);
      });
    });

    // Role switcher dropdown
    const roleSelector = document.getElementById('role-selector-dropdown');
    if (roleSelector) {
      roleSelector.addEventListener('change', (e) => {
        this.switchRole(e.target.value);
      });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.filterAndRenderProperties();
      });
    }

    // Locality dropdown filter
    const locFilter = document.getElementById('locality-filter-select');
    if (locFilter) {
      locFilter.addEventListener('change', (e) => {
        this.activeLocalityFilter = e.target.value;
        this.filterAndRenderProperties();
      });
    }

    // Category pills filter
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.category-filter-btn').forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
        });
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');

        this.activeCategoryFilter = btn.dataset.category;
        this.filterAndRenderProperties();
      });
    });

    // Property Registration Form
    const propForm = document.getElementById('owner-property-form');
    if (propForm) {
      propForm.addEventListener('submit', (e) => this.handlePropertyFormSubmit(e));
    }

    // Pre-populate amenities in the form
    this.renderAmenitiesCheckboxes();
  },

  renderAmenitiesCheckboxes() {
    const container = document.getElementById('amenities-checkboxes-container');
    if (!container) return;

    container.innerHTML = HAZARIBAGH_DATA.amenitiesList.map(item => `
      <label class="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
        <input type="checkbox" name="amenities" value="${item.label}" class="w-4 h-4 text-blue-600 rounded">
        <span class="text-xs md:text-sm text-slate-700 flex items-center gap-1.5 font-medium">
          <i class="fa-solid ${item.icon} text-slate-500"></i> ${item.label}
        </span>
      </label>
    `).join('');
  },

  async loadProperties() {
    try {
      const res = await API.getProperties();
      if (res.success) {
        this.properties = res.data;
        this.filterAndRenderProperties();
      }
    } catch (e) {
      console.error("Failed to load properties:", e);
    }
  },

  filterAndRenderProperties() {
    let filtered = [...this.properties];

    if (this.activeCategoryFilter && this.activeCategoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === this.activeCategoryFilter);
    }

    if (this.activeLocalityFilter && this.activeLocalityFilter !== 'all') {
      filtered = filtered.filter(p => p.locality.toLowerCase() === this.activeLocalityFilter.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.landmark.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    this.renderPropertiesList(filtered);

    // Also update main map if currently on map view
    if (this.currentView === 'map' && mainMap) {
      MapManager.renderPropertiesOnMap(filtered);
    }
  },

  renderPropertiesList(properties) {
    const container = document.getElementById('properties-grid');
    const countBadge = document.getElementById('results-count-badge');
    if (countBadge) countBadge.textContent = `${properties.length} Properties in Hazaribagh`;

    if (!container) return;

    if (properties.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i class="fa-solid fa-house-chimney-crack"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Hazaribagh me koi matching property nahi mili</h3>
          <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">Aap filters ko reset karein ya Chatbot "Hazaribagh Mitra" se poochhein.</p>
          <button onclick="App.resetFilters()" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = properties.map(p => {
      const catMeta = HAZARIBAGH_DATA.categories[p.category] || HAZARIBAGH_DATA.categories.student_hostel;
      const whatsappText = encodeURIComponent(`Namaste! I am interested in your property "${p.title}" located at ${p.locality}, Hazaribagh (Rent: ₹${p.price}/${p.pricePeriod}). Is it currently available for booking?`);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

      return `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
          <!-- Card Image Container -->
          <div class="relative h-52 overflow-hidden bg-slate-100">
            <img src="${p.images[0]}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            
            <!-- Category Tag -->
            <div class="absolute top-3 left-3 flex items-center gap-2">
              <span class="${catMeta.bgClass} text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <i class="fa-solid ${catMeta.icon}"></i> ${catMeta.short}
              </span>
              ${p.isFeatured ? '<span class="bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow"><i class="fa-solid fa-star"></i> FEATURED</span>' : ''}
            </div>

            <!-- Price Tag -->
            <div class="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl font-extrabold text-base shadow-lg">
              ₹${p.price.toLocaleString('en-IN')}<span class="text-xs font-normal text-slate-300">/${p.pricePeriod}</span>
            </div>

            <!-- Audience Tag -->
            <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold shadow">
              <i class="fa-solid fa-user-group text-blue-600"></i> ${p.targetAudience || 'Any'}
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span class="flex items-center gap-1 font-semibold text-blue-600">
                  <i class="fa-solid fa-location-dot"></i> ${p.locality}, Hazaribagh
                </span>
                <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium pulse-available">
                  ${p.availableRooms ? `${p.availableRooms} Vacant` : 'Available'}
                </span>
              </div>

              <h3 class="font-bold text-slate-900 text-base md:text-lg mb-1 leading-snug line-clamp-1 group-hover:text-blue-600 transition">
                ${p.title}
              </h3>

              <p class="text-xs text-slate-500 mb-3 flex items-center gap-1 line-clamp-1">
                <i class="fa-regular fa-compass text-amber-500"></i> Landmark: ${p.landmark || p.address}
              </p>

              <!-- Amenities tags -->
              <div class="flex flex-wrap gap-1.5 mb-4">
                ${p.amenities.slice(0, 3).map(a => `
                  <span class="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                    ${a}
                  </span>
                `).join('')}
                ${p.amenities.length > 3 ? `<span class="text-[11px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-medium">+${p.amenities.length - 3} more</span>` : ''}
              </div>
            </div>

            <!-- Direct Contact & Action Bar -->
            <div class="pt-3 border-t border-slate-100 space-y-2">
              <div class="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span class="flex items-center gap-1 font-semibold">
                  <i class="fa-solid fa-circle-user text-slate-400"></i> ${p.ownerName}
                </span>
                <span class="text-slate-400 text-[11px]">GPS Verified</span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <!-- Direct WhatsApp Button -->
                <a href="https://wa.me/${p.ownerWhatsapp}?text=${whatsappText}" target="_blank" class="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-sm">
                  <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
                </a>

                <!-- Direct Call Button -->
                <a href="tel:${p.ownerPhone}" class="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-sm">
                  <i class="fa-solid fa-phone text-xs"></i> Call Owner
                </a>
              </div>

              <div class="grid grid-cols-3 gap-1.5 pt-1">
                <button onclick="App.openPropertyDetailModal('${p.id}')" class="col-span-2 text-center text-xs font-semibold py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                  <i class="fa-solid fa-eye"></i> View Details
                </button>
                <a href="${googleMapsUrl}" target="_blank" class="text-center text-xs font-semibold py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition" title="Get GPS Directions on Google Maps">
                  <i class="fa-solid fa-location-arrow text-blue-500"></i> Map
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  resetFilters() {
    this.activeCategoryFilter = 'all';
    this.activeLocalityFilter = 'all';
    this.searchQuery = '';
    const sInput = document.getElementById('search-input');
    if (sInput) sInput.value = '';
    const locSelect = document.getElementById('locality-filter-select');
    if (locSelect) locSelect.value = 'all';

    document.querySelectorAll('.category-filter-btn').forEach((b, idx) => {
      if (idx === 0) {
        b.classList.add('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.remove('bg-white', 'text-slate-700');
      } else {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700');
      }
    });

    this.filterAndRenderProperties();
  },

  // ================= PROPERTY DETAILS MODAL ================= //
  async openPropertyDetailModal(propertyId) {
    const prop = this.properties.find(p => p.id === propertyId);
    if (!prop) return;

    const modal = document.getElementById('property-detail-modal');
    const content = document.getElementById('property-detail-modal-content');
    if (!modal || !content) return;

    const catMeta = HAZARIBAGH_DATA.categories[prop.category] || HAZARIBAGH_DATA.categories.student_hostel;
    const whatsappText = encodeURIComponent(`Namaste! I am inquiring about "${prop.title}" in ${prop.locality}, Hazaribagh.`);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${prop.lat},${prop.lng}`;

    content.innerHTML = `
      <div class="space-y-6">
        <!-- Image Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
          <img src="${prop.images[0]}" class="w-full h-64 md:h-80 object-cover rounded-xl" alt="${prop.title}">
          <div class="grid grid-rows-2 gap-3 h-64 md:h-80">
            <img src="${prop.images[1] || prop.images[0]}" class="w-full h-full object-cover rounded-xl" alt="${prop.title}">
            <div class="bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
              <div class="text-center text-white">
                <span class="text-xs uppercase tracking-wider text-slate-400">GPS Coordinates</span>
                <p class="font-mono text-sm font-bold text-amber-400 mt-1">${prop.lat.toFixed(4)}° N, ${prop.lng.toFixed(4)}° E</p>
                <a href="${googleMapsUrl}" target="_blank" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">
                  <i class="fa-solid fa-diamond-turn-right"></i> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Header Info -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="${catMeta.bgClass} text-xs font-bold px-3 py-1 rounded-full">
                <i class="fa-solid ${catMeta.icon}"></i> ${catMeta.label}
              </span>
              <span class="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                <i class="fa-solid fa-users"></i> ${prop.targetAudience}
              </span>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900">${prop.title}</h2>
            <p class="text-sm text-slate-600 mt-1 flex items-center gap-1.5">
              <i class="fa-solid fa-location-dot text-red-500"></i> ${prop.address}, <b>${prop.locality}</b>, Hazaribagh
            </p>
            <p class="text-xs text-amber-600 font-medium mt-0.5">
              <i class="fa-solid fa-flag"></i> Landmark: ${prop.landmark}
            </p>
          </div>

          <div class="text-right flex-shrink-0 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <span class="text-xs text-slate-500 font-medium">Rent Amount</span>
            <div class="text-2xl font-black text-blue-700">₹${prop.price.toLocaleString('en-IN')}<span class="text-sm font-normal text-slate-500">/${prop.pricePeriod}</span></div>
            ${prop.deposit ? `<span class="text-xs text-slate-500">Security Deposit: ₹${prop.deposit.toLocaleString('en-IN')}</span>` : '<span class="text-xs text-emerald-600 font-semibold">Zero Deposit</span>'}
          </div>
        </div>

        <!-- Description -->
        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-2">Property Description & Details</h4>
          <p class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            ${prop.description || 'Verified property in Hazaribagh with complete electricity, water and road connectivity.'}
          </p>
        </div>

        <!-- Amenities -->
        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-3">Included Amenities & Facilities</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            ${prop.amenities.map(a => `
              <div class="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm">
                <i class="fa-solid fa-circle-check text-emerald-500"></i> ${a}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Owner Contact & Direct Actions -->
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl text-amber-400">
                <i class="fa-solid fa-user-shield"></i>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium">Property Owner Contact</p>
                <h4 class="text-lg font-bold">${prop.ownerName}</h4>
                <p class="text-xs text-slate-300 mt-0.5"><i class="fa-solid fa-phone"></i> ${prop.ownerPhone} • <i class="fa-solid fa-envelope"></i> ${prop.ownerEmail}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2.5 w-full md:w-auto">
              <a href="https://wa.me/${prop.ownerWhatsapp}?text=${whatsappText}" target="_blank" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow">
                <i class="fa-brands fa-whatsapp text-lg"></i> WhatsApp Direct
              </a>
              <a href="tel:${prop.ownerPhone}" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-bold text-sm shadow">
                <i class="fa-solid fa-phone text-xs"></i> Call Owner
              </a>
              <button onclick="App.openInquiryModal('${prop.id}', '${encodeURIComponent(prop.title)}')" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow">
                <i class="fa-solid fa-envelope"></i> Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  },

  closePropertyDetailModal() {
    const modal = document.getElementById('property-detail-modal');
    if (modal) modal.classList.add('hidden');
  },

  // ================= INQUIRY MODAL ================= //
  openInquiryModal(propId, encodedTitle) {
    const title = decodeURIComponent(encodedTitle);
    const modal = document.getElementById('inquiry-modal');
    const titleEl = document.getElementById('inquiry-property-title');
    const idInput = document.getElementById('inquiry-property-id');

    if (titleEl) titleEl.textContent = title;
    if (idInput) idInput.value = propId;

    if (modal) modal.classList.remove('hidden');
  },

  closeInquiryModal() {
    const modal = document.getElementById('inquiry-modal');
    if (modal) modal.classList.add('hidden');
  },

  async handleInquirySubmit(e) {
    e.preventDefault();
    const propId = document.getElementById('inquiry-property-id').value;
    const name = document.getElementById('inquiry-name').value;
    const phone = document.getElementById('inquiry-phone').value;
    const email = document.getElementById('inquiry-email').value;
    const message = document.getElementById('inquiry-message').value;

    const prop = this.properties.find(p => p.id === propId);

    const payload = {
      propertyId: propId,
      propertyTitle: prop ? prop.title : 'Hazaribagh Property',
      senderName: name,
      senderPhone: phone,
      senderWhatsapp: phone.replace(/[^0-9]/g, ''),
      senderEmail: email,
      message: message,
      requestedCategory: prop ? prop.category : 'student_hostel'
    };

    try {
      const res = await API.createInquiry(payload);
      if (res.success) {
        alert("Aapka message owner ko bhej diya gaya hai! Owner aapse turant sampark karega.");
        this.closeInquiryModal();
      }
    } catch (err) {
      alert("Inquiry submit nahi ho saki. Kripya direct WhatsApp par contact karein.");
    }
  },

  // ================= OWNER MANUAL LISTING FORM ================= //
  async handlePropertyFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Collect amenities checkboxes
    const amenities = [];
    form.querySelectorAll('input[name="amenities"]:checked').forEach(cb => {
      amenities.push(cb.value);
    });

    const category = form.querySelector('[name="category"]').value;
    const presets = HAZARIBAGH_DATA.presetImages[category] || HAZARIBAGH_DATA.presetImages.student_hostel;
    const customImg = form.querySelector('[name="imageUrl"]').value.trim();
    const images = customImg ? [customImg, presets[0]] : presets;

    const payload = {
      title: form.querySelector('[name="title"]').value.trim(),
      category: category,
      targetAudience: form.querySelector('[name="targetAudience"]').value,
      price: Number(form.querySelector('[name="price"]').value),
      pricePeriod: form.querySelector('[name="pricePeriod"]').value,
      deposit: Number(form.querySelector('[name="deposit"]').value || 0),
      locality: form.querySelector('[name="locality"]').value,
      address: form.querySelector('[name="address"]').value.trim(),
      landmark: form.querySelector('[name="landmark"]').value.trim(),
      lat: Number(form.querySelector('#prop-form-lat').value),
      lng: Number(form.querySelector('#prop-form-lng').value),
      sharing: form.querySelector('[name="sharing"]').value,
      foodIncluded: form.querySelector('[name="foodIncluded"]').checked,
      amenities: amenities,
      ownerId: this.currentUser.id || 'owner-1',
      ownerName: form.querySelector('[name="ownerName"]').value.trim() || this.currentUser.name,
      ownerPhone: form.querySelector('[name="ownerPhone"]').value.trim(),
      ownerWhatsapp: form.querySelector('[name="ownerWhatsapp"]').value.trim().replace(/[^0-9]/g, ''),
      ownerEmail: form.querySelector('[name="ownerEmail"]').value.trim(),
      images: images,
      description: form.querySelector('[name="description"]').value.trim(),
      availableRooms: Number(form.querySelector('[name="availableRooms"]').value || 1),
      status: 'approved' // Automatically active for immediate visibility
    };

    try {
      const res = await API.createProperty(payload);
      if (res.success) {
        alert("Badhai ho! Aapki property Hazaribagh Portal par successfully register ho gayi hai aur map par live hai!");
        form.reset();
        await this.loadProperties();
        this.switchView('listings');
      }
    } catch (err) {
      alert("Registration failed. Please verify inputs.");
    }
  },

  // ================= OWNER DASHBOARD ================= //
  async loadOwnerDashboard() {
    const listContainer = document.getElementById('owner-properties-list');
    const inqContainer = document.getElementById('owner-inquiries-list');

    // Filter properties for owner
    const myProps = this.properties.filter(p => p.ownerId === this.currentUser.id || this.currentUser.role === 'superadmin' || this.currentUser.role === 'admin' || p.ownerPhone === this.currentUser.phone);

    if (listContainer) {
      if (myProps.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p class="text-slate-500 text-sm">Aapne abhi tak koi property add nahi ki hai.</p>
            <button onclick="App.switchView('owner-add')" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
              + Add Property Now
            </button>
          </div>
        `;
      } else {
        listContainer.innerHTML = myProps.map(p => `
          <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-3">
              <img src="${p.images[0]}" class="w-16 h-16 rounded-xl object-cover" alt="${p.title}">
              <div>
                <h4 class="font-bold text-slate-900 text-sm">${p.title}</h4>
                <p class="text-xs text-slate-500">${p.locality} • ₹${p.price}/${p.pricePeriod}</p>
                <span class="inline-block mt-1 text-[11px] px-2 py-0.5 rounded font-semibold ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${p.status === 'approved' ? 'Active & Live' : 'Under Review'}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="App.openPropertyDetailModal('${p.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
                Preview
              </button>
              <button onclick="App.deleteProperty('${p.id}')" class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold">
                Delete
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // Load Inquiries
    if (inqContainer) {
      try {
        const res = await API.getInquiries();
        if (res.success && res.data.length > 0) {
          inqContainer.innerHTML = res.data.map(inq => `
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h5 class="font-bold text-sm text-slate-900">${inq.senderName}</h5>
                  <p class="text-xs text-slate-500">${inq.propertyTitle} • ${new Date(inq.date).toLocaleDateString()}</p>
                </div>
                <span class="text-xs font-semibold px-2 py-0.5 rounded ${inq.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                  ${inq.status}
                </span>
              </div>
              <p class="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg mb-3">"${inq.message}"</p>
              <div class="flex gap-2">
                <a href="https://wa.me/${inq.senderWhatsapp}?text=Namaste%20${encodeURIComponent(inq.senderName)}%2C%20I%20saw%20your%20inquiry%20regarding%20my%20property." target="_blank" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                  <i class="fa-brands fa-whatsapp"></i> Reply on WhatsApp
                </a>
                <a href="tel:${inq.senderPhone}" class="px-3 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                  <i class="fa-solid fa-phone"></i> Call
                </a>
              </div>
            </div>
          `).join('');
        } else {
          inqContainer.innerHTML = '<p class="text-slate-500 text-xs text-center py-6">No inquiry messages yet.</p>';
        }
      } catch (e) {
        console.warn(e);
      }
    }
  },

  async deleteProperty(id) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await API.deleteProperty(id);
      if (res.success) {
        await this.loadProperties();
        this.loadOwnerDashboard();
      }
    } catch (e) {
      alert("Failed to delete property.");
    }
  },

  // ================= ADMIN DASHBOARD ================= //
  async loadAdminView() {
    const container = document.getElementById('admin-properties-table-body');
    if (!container) return;

    container.innerHTML = this.properties.map(p => `
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="p-3">
          <div class="flex items-center gap-2">
            <img src="${p.images[0]}" class="w-10 h-10 rounded-lg object-cover">
            <div>
              <p class="font-bold text-slate-900 text-xs">${p.title}</p>
              <p class="text-[11px] text-slate-500">${p.locality} • ₹${p.price}</p>
            </div>
          </div>
        </td>
        <td class="p-3 text-xs capitalize">${p.category.replace('_', ' ')}</td>
        <td class="p-3 text-xs font-semibold text-slate-700">${p.ownerName} (${p.ownerPhone})</td>
        <td class="p-3">
          <span class="text-[11px] px-2 py-0.5 rounded font-bold ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${p.status}
          </span>
        </td>
        <td class="p-3 text-right">
          <div class="flex justify-end gap-1.5">
            <button onclick="App.togglePropertyFeatured('${p.id}', ${!p.isFeatured})" class="px-2 py-1 ${p.isFeatured ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'} rounded text-xs font-semibold">
              <i class="fa-solid fa-star"></i>
            </button>
            <button onclick="App.togglePropertyApproval('${p.id}', '${p.status === 'approved' ? 'pending' : 'approved'}')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">
              ${p.status === 'approved' ? 'Revoke' : 'Approve'}
            </button>
            <button onclick="App.deleteProperty('${p.id}')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  async togglePropertyApproval(id, newStatus) {
    try {
      await API.updatePropertyStatus(id, { status: newStatus });
      await this.loadProperties();
      this.loadAdminView();
    } catch (e) {
      alert("Failed to update status");
    }
  },

  async togglePropertyFeatured(id, isFeatured) {
    try {
      await API.updatePropertyStatus(id, { isFeatured });
      await this.loadProperties();
      this.loadAdminView();
    } catch (e) {
      alert("Failed to update featured status");
    }
  },

  // ================= SUPER ADMIN DASHBOARD ================= //
  async loadSuperAdminView() {
    try {
      const statsRes = await API.getStats();
      if (statsRes.success) {
        const s = statsRes.data;
        document.getElementById('stat-total-props').textContent = s.totalProperties;
        document.getElementById('stat-active-props').textContent = s.activeProperties;
        document.getElementById('stat-total-owners').textContent = s.totalOwners;
        document.getElementById('stat-total-inquiries').textContent = s.totalInquiries;
      }

      // Render Users Table
      const userRes = await API.getUsers();
      if (userRes.success) {
        const container = document.getElementById('superadmin-users-table-body');
        if (container) {
          container.innerHTML = userRes.data.map(u => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-3 flex items-center gap-2">
                <img src="${u.avatar}" class="w-8 h-8 rounded-full object-cover">
                <div>
                  <p class="font-bold text-xs text-slate-900">${u.name}</p>
                  <p class="text-[11px] text-slate-500">${u.email || u.phone}</p>
                </div>
              </td>
              <td class="p-3 text-xs uppercase font-bold text-slate-600">${u.role}</td>
              <td class="p-3 text-xs">
                <span class="${u.isVerified ? 'text-emerald-600 font-bold' : 'text-slate-400'}">
                  ${u.isVerified ? '<i class="fa-solid fa-circle-check"></i> Verified' : 'Unverified'}
                </span>
              </td>
              <td class="p-3 text-right">
                <select onchange="App.changeUserRole('${u.id}', this.value)" class="text-xs bg-slate-100 border border-slate-300 rounded px-2 py-1">
                  <option value="renter" ${u.role === 'renter' ? 'selected' : ''}>Renter</option>
                  <option value="owner" ${u.role === 'owner' ? 'selected' : ''}>Owner</option>
                  <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                  <option value="superadmin" ${u.role === 'superadmin' ? 'selected' : ''}>Super Admin</option>
                </select>
              </td>
            </tr>
          `).join('');
        }
      }
    } catch (e) {
      console.warn(e);
    }
  },

  async changeUserRole(userId, newRole) {
    try {
      await API.updateUserRole(userId, { role: newRole });
      await this.loadUsers();
      alert(`User role changed to ${newRole}`);
    } catch (e) {
      alert("Failed to change user role.");
    }
  },

  async handleSettingsFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      announcement: form.querySelector('[name="announcement"]').value,
      supportPhone: form.querySelector('[name="supportPhone"]').value,
      supportWhatsapp: form.querySelector('[name="supportWhatsapp"]').value,
      supportEmail: form.querySelector('[name="supportEmail"]').value
    };

    try {
      const res = await API.updateSettings(payload);
      if (res.success) {
        alert("Settings updated successfully!");
        this.settings = res.data;
        this.renderAnnouncement();
      }
    } catch (err) {
      alert("Failed to update settings.");
    }
  }
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
