/* =====================================================
   ROSIE'S BEAUTY SPA — PROFILE TAB MODULE
   Client info, past visits, notification toggles,
   dark mode, settings, account actions
   ===================================================== */

const Profile = {
  NOTIFICATIONS: [
    { key: 'reminders', label: 'Appointment Reminders',  desc: 'Get reminded before your visits',  defaultOn: true },
    { key: 'rewards',   label: 'Rewards Updates',        desc: 'Points earned and new rewards',     defaultOn: true },
    { key: 'offers',    label: 'New Products & Offers',  desc: 'Sales, launches, and promos',       defaultOn: true },
    { key: 'openings',  label: 'Cancellation Openings',  desc: 'Get notified when slots open up',   defaultOn: true },
  ],

  // ─── Render ───────────────────────────────────────────
  async render() {
    const container = document.getElementById('tab-profile');
    if (!container) return;

    // Show skeleton while loading
    container.innerHTML = `
      ${this._renderHeader()}
      <div class="profile-loading" aria-busy="true" aria-label="Loading profile">
        <div class="profile-skeleton"></div>
      </div>
    `;

    // Fetch past visits
    let pastVisits = [];
    try {
      if (App.currentUser) {
        pastVisits = await SupabaseData.getPastAppointments(App.currentUser.id);
      }
    } catch (err) {
      console.warn('[Profile] Could not load past visits:', err);
    }

    // Render full UI with data
    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderInfo()}
      ${this._renderHistory(pastVisits)}
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
    const profile = App.currentProfile || {};
    const name = profile.name || 'Rosebud';
    const initials = name.charAt(0).toUpperCase();
    const email = profile.email || '';
    const phone = profile.phone || '';
    const photoUrl = profile.photo_url || null;

    let memberSince = '';
    if (profile.created_at) {
      memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    return `
      <div class="profile-info">
        <div class="profile-info__avatar-wrap">
          <div class="profile-info__avatar" id="profileAvatar" role="button" tabindex="0" aria-label="Change profile photo" onclick="Profile._triggerPhotoUpload()" onkeydown="if(event.key==='Enter')Profile._triggerPhotoUpload()">
            ${photoUrl
              ? `<img src="${photoUrl}" alt="${name}" class="profile-info__photo" />`
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
          ${email || phone ? `<p class="profile-info__contact">${[email, phone].filter(Boolean).join('<br>')}</p>` : ''}
          ${memberSince ? `<p class="profile-info__member">Member since ${memberSince}</p>` : ''}
        </div>
      </div>
    `;
  },

  // ─── Past Visits ──────────────────────────────────────
  _renderHistory(visits) {
    let content;
    if (!visits || visits.length === 0) {
      content = `<p class="profile-history__empty">Your visit history will appear here after your first appointment.</p>`;
    } else {
      content = visits.map((visit) => {
        const formattedDate = new Date(visit.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return `
          <div class="profile-history__row">
            <div class="profile-history__info">
              <p class="profile-history__service">${visit.service_name}</p>
              <p class="profile-history__date">${formattedDate}</p>
            </div>
            <span class="profile-history__pts">+100 pts</span>
          </div>
        `;
      }).join('');
    }

    return `
      <section class="profile-history" aria-label="Past visits">
        <h2 class="profile-section-title">Past Visits</h2>
        <div class="profile-history__list">
          ${content}
        </div>
      </section>
    `;
  },

  // ─── Notifications ────────────────────────────────────
  _renderNotifications() {
    const prefs = (App.currentProfile && App.currentProfile.notification_prefs) || {};

    const rows = this.NOTIFICATIONS.map((notif) => {
      const isOn = notif.key in prefs ? prefs[notif.key] : notif.defaultOn;
      const descId = `notif-desc-${notif.key}`;

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
        <p class="profile-settings__version">v2.0.0</p>
      </section>
    `;
  },

  // ─── Account Actions ──────────────────────────────────
  _renderAccountActions() {
    return `
      <div class="profile-actions">
        <button class="profile-actions__signout" aria-label="Sign out of your account" onclick="Modal.show({ title: 'Sign Out?', message: 'You will need to sign in again next time.', cancelText: 'Cancel', confirmText: 'Sign Out', type: 'confirm', onConfirm: () => App.handleSignOut() })">
          Sign Out
        </button>
        <button class="profile-actions__delete" aria-label="Delete your account" onclick="Profile._confirmDeleteAccount()">
          Delete Account
        </button>
      </div>
    `;
  },

  // ─── Delete Account ───────────────────────────────────
  _confirmDeleteAccount() {
    Modal.show({
      title: 'Delete Account?',
      message: 'This will remove all your data, rewards, and appointment history. This cannot be undone.',
      cancelText: 'Cancel',
      confirmText: 'Delete',
      type: 'warning',
      onConfirm: async () => {
        try {
          await SupabaseData.deleteAccount();
          await SupabaseData.signOut();
        } catch (err) {
          console.error('[Profile] Delete account failed:', err);
          Modal.show({
            title: 'Contact Ashley',
            message: 'Please call or text (817) 422-9613 to complete your account deletion.',
            confirmText: 'Got It',
            type: 'confirm',
          });
        }
      },
    });
  },

  // ─── Init Toggles ─────────────────────────────────────
  _initToggles() {
    // Notification toggles — persist to Supabase notification_prefs JSONB
    const notifToggles = document.querySelectorAll('[data-notif-key]');
    notifToggles.forEach((toggle) => {
      toggle.addEventListener('change', async (e) => {
        const key = e.target.dataset.notifKey;
        const value = e.target.checked;

        // Update local profile copy immediately
        if (App.currentProfile) {
          if (!App.currentProfile.notification_prefs) {
            App.currentProfile.notification_prefs = {};
          }
          App.currentProfile.notification_prefs[key] = value;
        }

        // Persist to Supabase
        try {
          if (App.currentUser && App.currentProfile) {
            await SupabaseData.updateProfile(App.currentUser.id, {
              notification_prefs: App.currentProfile.notification_prefs,
            });
          }
        } catch (err) {
          console.warn('[Profile] Failed to save notification pref:', err);
        }
      });
    });

    // Dark mode toggle — wire to App.setTheme (stays in localStorage)
    const darkToggle = document.getElementById('profile-dark-toggle');
    if (darkToggle) {
      darkToggle.addEventListener('change', (e) => {
        App.setTheme(e.target.checked ? 'dark' : 'light');
      });
    }
  },

  // ─── Photo Upload ─────────────────────────────────────
  _triggerPhotoUpload() {
    const input = document.getElementById('profilePhotoInput');
    if (input) input.click();
  },

  async _handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      Modal.show({ title: 'Image Too Large', message: 'Please choose a photo under 5MB.', confirmText: 'OK', type: 'confirm' });
      return;
    }

    if (!App.currentUser) return;

    try {
      const photoUrl = await SupabaseData.uploadAvatar(App.currentUser.id, file);

      // Update local profile copy
      if (App.currentProfile) {
        App.currentProfile.photo_url = photoUrl;
      }

      // Update avatar element immediately
      const avatar = document.getElementById('profileAvatar');
      if (avatar) {
        const existing = avatar.querySelector('.profile-info__photo, .profile-info__initials');
        if (existing) existing.remove();
        const photo = document.createElement('img');
        photo.src = photoUrl;
        photo.alt = 'Profile photo';
        photo.className = 'profile-info__photo';
        avatar.insertBefore(photo, avatar.firstChild);
      }

      // Also update Home header if present
      const homeIcon = document.querySelector('.home-header__icon');
      if (homeIcon) {
        const initial = homeIcon.querySelector('.home-header__initial');
        if (initial) {
          initial.remove();
          const homePhoto = document.createElement('img');
          homePhoto.src = photoUrl;
          homePhoto.alt = 'Profile';
          homePhoto.className = 'home-header__photo';
          homeIcon.insertBefore(homePhoto, homeIcon.firstChild);
        }
      }
    } catch (err) {
      console.error('[Profile] Photo upload failed:', err);
      Modal.show({
        title: 'Upload Failed',
        message: 'Could not upload your photo. Please try again.',
        confirmText: 'OK',
        type: 'confirm',
      });
    }
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    // Toggle event listeners are on elements inside tab-profile,
    // which gets innerHTML-replaced on next render — no manual cleanup needed
  },
};
