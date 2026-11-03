let mainMap = null;
let pickerMap = null;
let mainMarkersGroup = null;
let landmarksGroup = null;
let pickerMarker = null;

const MapManager = {
  currentDistrict: 'Hazaribagh',

  // Initialize the primary interactive exploration map
  initMainMap() {
    const mapElement = document.getElementById('hazaribagh-main-map');
    if (!mapElement || mainMap) return;

    const districtData = (JHARKHAND_DATA && JHARKHAND_DATA.districts[this.currentDistrict]) || JHARKHAND_DATA.districts.Hazaribagh;

    mainMap = L.map('hazaribagh-main-map', {
      center: districtData.center,
      zoom: districtData.zoom || 13,
      scrollWheelZoom: true
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Addix Stay GPS Map',
      maxZoom: 19
    }).addTo(mainMap);

    landmarksGroup = L.layerGroup().addTo(mainMap);
    mainMarkersGroup = L.layerGroup().addTo(mainMap);

    // Add Landmark Markers for initial district
    this.renderLandmarksForDistrict(this.currentDistrict);
  },

  setDistrict(districtName) {
    this.currentDistrict = districtName;
    const districtData = JHARKHAND_DATA && JHARKHAND_DATA.districts[districtName];
    if (districtData && mainMap) {
      mainMap.flyTo(districtData.center, districtData.zoom || 13, { animate: true, duration: 1.5 });
      this.renderLandmarksForDistrict(districtName);
    }
  },

  renderLandmarksForDistrict(districtName) {
    if (!landmarksGroup || !mainMap) return;
    landmarksGroup.clearLayers();

    const districtData = JHARKHAND_DATA && JHARKHAND_DATA.districts[districtName];
    const landmarks = (districtData && districtData.landmarks) || [];

    landmarks.forEach(lm => {
      const landmarkIcon = L.divIcon({
        className: 'landmark-pin',
        html: `<div style="background:#1e293b; color:#fbbf24; border: 2px solid white; border-radius: 6px; padding: 2px 6px; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><i class="fa-solid fa-location-dot"></i> ${lm.name}</div>`,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });
      L.marker([lm.lat, lm.lng], { icon: landmarkIcon }).addTo(landmarksGroup);
    });
  },

  // Render properties on the main map
  renderPropertiesOnMap(properties) {
    if (!mainMap || !mainMarkersGroup) {
      this.initMainMap();
    }
    mainMarkersGroup.clearLayers();

    properties.forEach(prop => {
      if (!prop.lat || !prop.lng) return;

      const catMeta = HAZARIBAGH_DATA.categories[prop.category] || HAZARIBAGH_DATA.categories.student_hostel;
      
      // Category styled circle icon with FontAwesome icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: ${catMeta.color}; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">
            <i class="fa-solid ${catMeta.icon} text-white" style="font-size: 16px;"></i>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const districtName = prop.district || 'Hazaribagh';
      const whatsappText = encodeURIComponent(`Namaste! I am interested in your property "${prop.title}" in ${prop.locality}, ${districtName} (Rent: ₹${prop.price}/${prop.pricePeriod}). Is it available?`);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${prop.lat},${prop.lng}`;

      const popupContent = `
        <div style="width: 250px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="position: relative; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${prop.images[0]}" style="width: 100%; height: 120px; object-fit: cover; display: block;" alt="${prop.title}">
            <span style="position: absolute; top: 6px; right: 6px; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: rgba(0,0,0,0.7); color: white;">
              ${catMeta.short}
            </span>
          </div>
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px; color: #0f172a; line-height: 1.2;">${prop.title}</h4>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 6px;"><i class="fa-solid fa-location-dot text-red-500"></i> ${prop.locality}, <b>${districtName}</b></p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 16px; color: #2563eb;">₹${prop.price.toLocaleString('en-IN')}<span style="font-size: 11px; font-weight: 500; color: #64748b;">/${prop.pricePeriod}</span></span>
            <span style="font-size: 11px; color: #059669; font-weight: 600; background: #d1fae5; padding: 2px 6px; border-radius: 4px;">Available</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
            <a href="https://wa.me/${prop.ownerWhatsapp}?text=${whatsappText}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #22c55e; color: white; padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            <a href="${googleMapsUrl}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #3b82f6; color: white; padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
              <i class="fa-solid fa-diamond-turn-right"></i> GPS Dir
            </a>
          </div>
          <button onclick="App.openPropertyDetailModal('${prop.id}')" style="width: 100%; background: #0f172a; color: white; border: none; padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            View Full Details
          </button>
        </div>
      `;

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon });
      marker.bindPopup(popupContent);
      mainMarkersGroup.addLayer(marker);
    });
  },

  // Focus map on a specific locality across any district
  flyToLocality(localityName) {
    let targetLoc = null;
    const currentDist = JHARKHAND_DATA.districts[this.currentDistrict];
    if (currentDist) {
      targetLoc = currentDist.localities.find(l => l.name.toLowerCase() === localityName.toLowerCase());
    }
    if (!targetLoc) {
      for (const distKey in JHARKHAND_DATA.districts) {
        const found = JHARKHAND_DATA.districts[distKey].localities.find(l => l.name.toLowerCase() === localityName.toLowerCase());
        if (found) { targetLoc = found; break; }
      }
    }
    if (targetLoc && mainMap) {
      mainMap.flyTo([targetLoc.lat, targetLoc.lng], 15, { animate: true, duration: 1.2 });
    }
  },

  // Focus on a specific coordinate
  flyToCoord(lat, lng) {
    if (mainMap) {
      mainMap.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
    }
  },

  // HTML5 User GPS Locate Me
  locateUser() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mainMap) {
          mainMap.flyTo([latitude, longitude], 15);
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#ffffff",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(mainMap).bindPopup("<b>Aapki Current Location (GPS)</b>").openPopup();
        }
      },
      (err) => {
        console.warn("GPS location error:", err.message);
        // Default jump to Hazaribagh center if permission denied
        if (mainMap) mainMap.flyTo(HAZARIBAGH_DATA.center, 14);
      }
    );
  },

  // ================= OWNER PIN PICKER MAP ================= //
  initPickerMap(defaultLat = 23.9967, defaultLng = 85.3687) {
    const mapEl = document.getElementById('owner-pin-picker-map');
    if (!mapEl) return;

    if (pickerMap) {
      pickerMap.remove();
      pickerMap = null;
    }

    pickerMap = L.map('owner-pin-picker-map', {
      center: [defaultLat, defaultLng],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap | Click to set Property Location',
      maxZoom: 19
    }).addTo(pickerMap);

    const pinIcon = L.divIcon({
      className: 'picker-pin',
      html: `<div style="background:#ef4444; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.4);"><i class="fa-solid fa-map-pin"></i></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    pickerMarker = L.marker([defaultLat, defaultLng], {
      icon: pinIcon,
      draggable: true
    }).addTo(pickerMap);

    pickerMarker.on('dragend', (e) => {
      const position = pickerMarker.getLatLng();
      this.updatePickerInputs(position.lat, position.lng);
    });

    pickerMap.on('click', (e) => {
      pickerMarker.setLatLng(e.latlng);
      this.updatePickerInputs(e.latlng.lat, e.latlng.lng);
    });

    this.updatePickerInputs(defaultLat, defaultLng);
  },

  updatePickerInputs(lat, lng) {
    const latInp = document.getElementById('prop-form-lat');
    const lngInp = document.getElementById('prop-form-lng');
    const displayEl = document.getElementById('gps-coords-display');

    if (latInp) latInp.value = lat.toFixed(6);
    if (lngInp) lngInp.value = lng.toFixed(6);
    if (displayEl) {
      displayEl.innerHTML = `<span class="text-emerald-700 font-semibold"><i class="fa-solid fa-check-circle"></i> GPS Pin Selected:</span> Lat <b>${lat.toFixed(5)}</b>, Lng <b>${lng.toFixed(5)}</b>`;
    }

    // Guess closest locality
    let closestLoc = HAZARIBAGH_DATA.localities[0].name;
    let minD = 999999;
    HAZARIBAGH_DATA.localities.forEach(loc => {
      const d = Math.hypot(loc.lat - lat, loc.lng - lng);
      if (d < minD) {
        minD = d;
        closestLoc = loc.name;
      }
    });

    const localitySelect = document.getElementById('prop-form-locality');
    if (localitySelect && !localitySelect.dataset.userChanged) {
      localitySelect.value = closestLoc;
    }
  }
};
