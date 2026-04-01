/* =====================================================
   ROSIE'S BEAUTY SPA — APP ROUTER
   Auth state management, tab switching, theme, SW
   ===================================================== */

const App = {
  currentTab: 'home',
  currentUser: null,
  currentProfile: null,

  // ─── Init ─────────────────────────────────────────────
  async init() {
    this.initTheme();
    this.initTabs();
    this.registerSW();

    // Listen for auth state changes
    SupabaseData.onAuthStateChange((event, session) => {
      console.log('[App] Auth event:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          this.onSignIn(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        this.onSignOut();
      }
    });

    // Check for existing session
    try {
      const { data } = await SupabaseData.getSession();
      if (data?.session?.user) {
        await this.onSignIn(data.session.user);
      } else {
        Auth.show('login');
      }
    } catch (err) {
      console.warn('[App] Session check failed:', err);
      Auth.show('login');
    }
  },

  // ─── Auth State Handlers ──────────────────────────────
  async onSignIn(user) {
    this.currentUser = user;

    // Load profile (retry once if trigger hasn't fired yet)
    try {
      this.currentProfile = await SupabaseData.getProfile(user.id);
    } catch (err) {
      console.warn('[App] Profile not ready, retrying in 1s...');
      await new Promise((r) => setTimeout(r, 1000));
      try {
        this.currentProfile = await SupabaseData.getProfile(user.id);
      } catch (retryErr) {
        console.error('[App] Profile load failed:', retryErr);
        this.currentProfile = { id: user.id, name: user.user_metadata?.name || '', glow_points: 0 };
      }
    }

    // Migrate localStorage data from old onboarding flow
    await this._migrateLocalStorage();

    // Init push notifications if module exists
    if (typeof Push !== 'undefined' && Push.init) {
      Push.init(user.id);
    }

    Auth.hide();
    this.showApp();
  },

  onSignOut() {
    this.currentUser = null;
    this.currentProfile = null;

    // Clear tab render cache so tabs re-render on next login
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      delete panel.dataset.rendered;
    });

    Auth.show('login');
  },

  // ─── localStorage Migration ───────────────────────────
  async _migrateLocalStorage() {
    if (!this.currentUser || !this.currentProfile) return;

    const oldName = localStorage.getItem('rosies_client_name');
    const oldPhoto = localStorage.getItem('rosies_profile_photo');
    const updates = {};

    if (oldName && !this.currentProfile.name) {
      updates.name = oldName;
    }

    // Migrate profile photo to Supabase Storage
    if (oldPhoto && !this.currentProfile.photo_url) {
      try {
        const response = await fetch(oldPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        await SupabaseData.uploadAvatar(this.currentUser.id, file);
        console.log('[App] Migrated profile photo to Supabase Storage');
      } catch (err) {
        console.warn('[App] Photo migration failed:', err);
      }
    }

    // Migrate notification preferences
    const notifKeys = ['rosies_notif_appointments', 'rosies_notif_promos', 'rosies_notif_rewards'];
    const notifPrefs = {};
    notifKeys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val !== null) {
        const shortKey = key.replace('rosies_notif_', 'notif_');
        notifPrefs[shortKey] = val === 'true';
      }
    });

    if (Object.keys(notifPrefs).length > 0) {
      Object.assign(updates, notifPrefs);
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      try {
        this.currentProfile = await SupabaseData.updateProfile(this.currentUser.id, updates);
        console.log('[App] Migrated localStorage data to Supabase');
      } catch (err) {
        console.warn('[App] Migration update failed:', err);
      }
    }

    // Clear old keys
    localStorage.removeItem('rosies_client_name');
    localStorage.removeItem('rosies_profile_photo');
    localStorage.removeItem('rosies_onboarded');
    notifKeys.forEach((key) => localStorage.removeItem(key));
  },

  // ─── Sign Out ─────────────────────────────────────────
  async handleSignOut() {
    try {
      // Remove push token if module exists
      if (typeof Push !== 'undefined' && Push.currentToken && this.currentUser) {
        await SupabaseData.removePushToken(this.currentUser.id, Push.currentToken);
      }
      await SupabaseData.signOut();
    } catch (err) {
      console.error('[App] Sign out error:', err);
    }
  },

  // ─── Theme ────────────────────────────────────────────
  initTheme() {
    const saved = localStorage.getItem('rosies_theme');
    if (saved && saved !== 'system') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      // Remove attribute — CSS media query handles system preference
      document.documentElement.removeAttribute('data-theme');
    }
  },

  setTheme(theme) {
    localStorage.setItem('rosies_theme', theme);
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  // ─── App Visibility ──────────────────────────────────
  showApp() {
    const authScreen = document.getElementById('auth-screen');
    const appEl = document.getElementById('app');

    if (authScreen) authScreen.classList.add('hidden');
    if (appEl) appEl.classList.remove('hidden');

    // Render the current (home) tab
    if (typeof Home !== 'undefined' && Home.render) {
      Home.render();
    }

    // Enable tab crossfade transitions after first render
    requestAnimationFrame(() => {
      const app = document.getElementById('app');
      if (app) app.classList.add('tab-transitions');
    });
  },

  // ─── Tabs ──────────────────────────────────────────────
  initTabs() {
    const tabButtons = document.querySelectorAll('.tab[data-tab]');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        this.switchTab(tabName);
      });
    });
  },

  switchTab(tabName) {
    if (tabName === this.currentTab) return;

    // Clean up previous tab
    const cleanupMap = {
      book: Book,
      contact: Contact,
      rewards: Rewards,
      profile: Profile,
    };
    const prevModule = cleanupMap[this.currentTab];
    if (prevModule && typeof prevModule !== 'undefined' && prevModule.destroy) {
      prevModule.destroy();
    }

    const prevTab = this.currentTab;
    this.currentTab = tabName;

    // Update tab button states
    document.querySelectorAll('.tab[data-tab]').forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update tab panel visibility
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`tab-${tabName}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Render tab content
    this.renderTab(tabName);
  },

  renderTab(tabName) {
    // Skip re-render if tab content already exists (preserves scroll/state)
    const panel = document.getElementById(`tab-${tabName}`);
    if (panel && panel.dataset.rendered === 'true' && tabName !== 'home') {
      return;
    }

    switch (tabName) {
      case 'home':
        if (typeof Home !== 'undefined' && Home.render) {
          Home.render();
        }
        break;

      case 'book':
        if (typeof Book !== 'undefined' && Book.render) {
          Book.render();
          if (panel) panel.dataset.rendered = 'true';
        }
        break;

      case 'contact':
        if (typeof Contact !== 'undefined' && Contact.render) {
          Contact.render();
          if (panel) panel.dataset.rendered = 'true';
        }
        break;

      case 'rewards':
        if (typeof Rewards !== 'undefined' && Rewards.render) {
          Rewards.render();
          if (panel) panel.dataset.rendered = 'true';
        }
        break;

      case 'profile':
        if (typeof Profile !== 'undefined' && Profile.render) {
          Profile.render();
          if (panel) panel.dataset.rendered = 'true';
        }
        break;

      default:
        break;
    }
  },

  renderPlaceholderTab(title, icon, message) {
    return `
      <div class="empty-state fade-in">
        <div class="empty-state__icon">
          <i class="ph ${icon}" aria-hidden="true"></i>
        </div>
        <h2 class="empty-state__title">${title}</h2>
        <p class="empty-state__text">${message}</p>
        <button class="btn btn-primary" onclick="App.switchTab('home')">
          Back to Home
        </button>
      </div>
    `;
  },

  // ─── Service Worker ────────────────────────────────────
  registerSW() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[App] Service worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('[App] Service worker registration failed:', err);
          });
      });
    }
  },
};

// ─── Bootstrap ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
