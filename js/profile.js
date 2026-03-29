/* =====================================================
   ROSIE'S BEAUTY SPA — PROFILE TAB MODULE
   Client info, past visits, notification toggles,
   dark mode, settings, account actions
   ===================================================== */

const Profile = {
  MOCK_VISITS: [
    { service: 'Corrective Facial', date: 'March 22, 2026', status: 'completed' },
    { service: 'Chemical Peel', date: 'March 10, 2026', status: 'completed' },
    { service: 'Microneedling', date: 'February 20, 2026', status: 'completed' },
    { service: 'Brightening Treatment', date: 'January 30, 2026', status: 'completed' },
  ],

  NOTIFICATIONS: [
    { key: 'rosies_notif_reminders',  label: 'Appointment Reminders',  desc: 'Get reminded before your visits', defaultOn: true },
    { key: 'rosies_notif_rewards',    label: 'Rewards Updates',        desc: 'Points earned and new rewards',   defaultOn: true },
    { key: 'rosies_notif_offers',     label: 'New Products & Offers',  desc: 'Sales, launches, and promos',     defaultOn: true },
    { key: 'rosies_notif_openings',   label: 'Cancellation Openings',  desc: 'Get notified when slots open up', defaultOn: true },
  ],

  MOCK_USER_EXTENDED: {
    email: 'keisha.w@gmail.com',
    phone: '(817) 555-0142',
    memberSince: 'November 2025',
  },

  // ─── Render ───────────────────────────────────────────
  render() {
    const container = document.getElementById('tab-profile');
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderInfo()}
      ${this._renderHistory()}
      ${this._renderNotifications()}
      ${this._renderSettings()}
      ${this._renderAccountActions()}
      <div class="profile-footer"></div>
    `;

    this._initToggles();
  },

  // ─── Header ───────────────────────────────────────────
  _renderHeader() {
    return `
      <header class="profile-header">
        <h1 class="profile-header__title">Profile</h1>
      </header>
    `;
  },

  // ─── Client Info ──────────────────────────────────────
  _renderInfo() {
    const name = localStorage.getItem('rosies_client_name') || MOCK_USER.name;
    const initials = name.charAt(0).toUpperCase();
    const ext = this.MOCK_USER_EXTENDED;
    const savedPhoto = localStorage.getItem('rosies_profile_photo');

    return `
      <div class="profile-info">
        <div class="profile-info__avatar-wrap">
          <div class="profile-info__avatar" id="profileAvatar" role="button" tabindex="0" aria-label="Change profile photo" onclick="Profile._triggerPhotoUpload()" onkeydown="if(event.key==='Enter')Profile._triggerPhotoUpload()">
            ${savedPhoto
              ? `<img src="${savedPhoto}" alt="${name}" class="profile-info__photo" />`
              : `<span class="profile-info__initials">${initials}</span>`
            }
            <div class="profile-info__camera">
              <i class="ph ph-camera"></i>
            </div>
          </div>
          <input type="file" id="profilePhotoInput" accept="image/*" style="display:none;" onchange="Profile._handlePhotoUpload(event)" />
        </div>
        <div class="profile-info__details">
          <p class="profile-info__name">${name}</p>
          <p class="profile-info__contact">${ext.email}<br>${ext.phone}</p>
          <p class="profile-info__member">Member since ${ext.memberSince}</p>
        </div>
      </div>
    `;
  },

  // ─── Past Visits ──────────────────────────────────────
  _renderHistory() {
    const rows = this.MOCK_VISITS.map((visit) => `
      <div class="profile-history__row">
        <div class="profile-history__info">
          <p class="profile-history__service">${visit.service}</p>
          <p class="profile-history__date">${visit.date}</p>
        </div>
        <span class="profile-history__pts">+100 pts</span>
      </div>
    `).join('');

    return `
      <section class="profile-history" aria-label="Past visits">
        <h2 class="profile-section-title">Past Visits</h2>
        <div class="profile-history__list">
          ${rows}
        </div>
      </section>
    `;
  },

  // ─── Notifications ────────────────────────────────────
  _renderNotifications() {
    const rows = this.NOTIFICATIONS.map((notif) => {
      const saved = localStorage.getItem(notif.key);
      const isOn = saved !== null ? saved === 'true' : notif.defaultOn;
      const descId = `notif-desc-${notif.key.replace('rosies_notif_', '')}`;

      return `
        <div class="profile-toggle-row">
          <div class="profile-toggle-row__text">
            <p class="profile-toggle-row__label">${notif.label}</p>
            <p class="profile-toggle-row__desc" id="${descId}">${notif.desc}</p>
          </div>
          <label class="profile-toggle">
            <input
              type="checkbox"
              data-notif-key="${notif.key}"
              ${isOn ? 'checked' : ''}
              aria-label="${notif.label}"
              aria-describedby="${descId}"
            />
            <span class="profile-toggle__track"></span>
          </label>
        </div>
      `;
    }).join('');

    return `
      <section class="profile-notifications" aria-label="Notification preferences">
        <h2 class="profile-section-title">Notifications</h2>
        <div class="profile-notifications__list">
          ${rows}
        </div>
      </section>
    `;
  },

  // ─── Settings ─────────────────────────────────────────
  _renderSettings() {
    // Check current dark mode state
    const savedTheme = localStorage.getItem('rosies_theme');
    const isDark = savedTheme === 'dark' ||
      (savedTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return `
      <section class="profile-settings" aria-label="App settings">
        <h2 class="profile-section-title">Settings</h2>
        <div class="profile-settings__list">

          <div class="profile-settings__row">
            <span class="profile-settings__label">Dark Mode</span>
            <label class="profile-toggle">
              <input
                type="checkbox"
                id="profile-dark-toggle"
                ${isDark ? 'checked' : ''}
                aria-label="Dark mode"
              />
              <span class="profile-toggle__track"></span>
            </label>
          </div>

          <a class="profile-settings__link" href="https://rosiesbeautyspa.com" target="_blank" rel="noopener" aria-label="Privacy Policy">
            <span class="profile-settings__link-label">Privacy Policy</span>
            <i class="ph ph-caret-right profile-settings__link-arrow" aria-hidden="true"></i>
          </a>

          <a class="profile-settings__link" href="https://rosiesbeautyspa.com" target="_blank" rel="noopener" aria-label="Terms of Service">
            <span class="profile-settings__link-label">Terms of Service</span>
            <i class="ph ph-caret-right profile-settings__link-arrow" aria-hidden="true"></i>
          </a>

        </div>
        <p class="profile-settings__version">v1.0.0</p>
      </section>
    `;
  },

  // ─── Account Actions ──────────────────────────────────
  _renderAccountActions() {
    return `
      <div class="profile-actions">
        <button class="profile-actions__signout" aria-label="Sign out of your account" onclick="Modal.show({ title: 'Sign Out?', message: 'You will need to sign in again next time.', cancelText: 'Cancel', confirmText: 'Sign Out', type: 'confirm', onConfirm: () => { localStorage.clear(); location.reload(); } })">
          Sign Out
        </button>
        <button class="profile-actions__delete" aria-label="Delete your account" onclick="Modal.show({ title: 'Delete Account?', message: 'This will remove all your data, rewards, and appointment history. This cannot be undone.', cancelText: 'Cancel', confirmText: 'Delete', type: 'warning', onConfirm: () => { Modal.show({ title: 'Contact Ashley', message: 'Please call or text (817) 422-9613 to complete your account deletion.', confirmText: 'Got It', type: 'confirm' }); } })">
          Delete Account
        </button>
      </div>
    `;
  },

  // ─── Init Toggles ─────────────────────────────────────
  _initToggles() {
    // Notification toggles — persist to localStorage
    const notifToggles = document.querySelectorAll('[data-notif-key]');
    notifToggles.forEach((toggle) => {
      toggle.addEventListener('change', (e) => {
        localStorage.setItem(e.target.dataset.notifKey, e.target.checked.toString());
      });
    });

    // Dark mode toggle — wire to App.setTheme
    const darkToggle = document.getElementById('profile-dark-toggle');
    if (darkToggle) {
      darkToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          App.setTheme('dark');
        } else {
          App.setTheme('light');
        }
      });
    }
  },

  // ─── Photo Upload ────────────────────────────────────
  _triggerPhotoUpload() {
    const input = document.getElementById('profilePhotoInput');
    if (input) input.click();
  },

  _handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      if (typeof Modal !== 'undefined') {
        Modal.show({ title: 'Image Too Large', message: 'Please choose a photo under 5MB.', confirmText: 'OK', type: 'confirm' });
      }
      return;
    }

    // Read and resize to 200x200 for localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize with canvas
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Crop to square (center crop)
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

        // Save as JPEG to localStorage
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        localStorage.setItem('rosies_profile_photo', dataUrl);

        // Update avatar immediately
        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
          const existing = avatar.querySelector('.profile-info__photo, .profile-info__initials');
          if (existing) existing.remove();
          const photo = document.createElement('img');
          photo.src = dataUrl;
          photo.alt = 'Profile photo';
          photo.className = 'profile-info__photo';
          avatar.insertBefore(photo, avatar.firstChild);
        }

        // Also update Home header
        const homeIcon = document.querySelector('.home-header__icon');
        if (homeIcon) {
          const initial = homeIcon.querySelector('.home-header__initial');
          if (initial) {
            initial.remove();
            const homePhoto = document.createElement('img');
            homePhoto.src = dataUrl;
            homePhoto.alt = 'Profile';
            homePhoto.className = 'home-header__photo';
            homeIcon.insertBefore(homePhoto, homeIcon.firstChild);
          }
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    // Toggle event listeners are on elements inside tab-profile,
    // which gets innerHTML-replaced on next render — no manual cleanup needed
  },
};
