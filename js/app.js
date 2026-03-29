/* =====================================================
   ROSIE'S BEAUTY SPA — APP ROUTER
   Tab switching, theme, service worker, onboarding
   ===================================================== */

const App = {
  currentTab: 'home',
  isFirstRun: false,

  // ─── Init ─────────────────────────────────────────
  init() {
    this.initTheme();
    this.isFirstRun = !localStorage.getItem('rosies_onboarded');

    if (this.isFirstRun) {
      this.showOnboarding();
    } else {
      this.showApp();
    }

    this.initTabs();
    this.registerSW();
  },

  // ─── Theme ────────────────────────────────────────
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

  // ─── Onboarding / App visibility ──────────────────
  showOnboarding() {
    const onboarding = document.getElementById('onboarding');
    const appEl = document.getElementById('app');
    onboarding.classList.remove('hidden');
    appEl.classList.add('hidden');

    // Trigger onboarding render if module loaded
    if (typeof Onboarding !== 'undefined' && Onboarding.render) {
      Onboarding.render();
    }
  },

  showApp() {
    const onboarding = document.getElementById('onboarding');
    const appEl = document.getElementById('app');

    onboarding.classList.add('hidden');
    appEl.classList.remove('hidden');

    // Render the current (home) tab
    if (typeof Home !== 'undefined' && Home.render) {
      Home.render();
    }

    // Enable tab crossfade transitions after first render
    requestAnimationFrame(() => {
      document.getElementById('app').classList.add('tab-transitions');
    });
  },

  completeOnboarding() {
    localStorage.setItem('rosies_onboarded', 'true');
    this.isFirstRun = false;
    this.showApp();
  },

  // ─── Tabs ──────────────────────────────────────────
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
    if (this.currentTab === 'book' && typeof Book !== 'undefined' && Book.destroy) {
      Book.destroy();
    }
    if (this.currentTab === 'contact' && typeof Contact !== 'undefined' && Contact.destroy) {
      Contact.destroy();
    }
    if (this.currentTab === 'rewards' && typeof Rewards !== 'undefined' && Rewards.destroy) {
      Rewards.destroy();
    }
    if (this.currentTab === 'profile' && typeof Profile !== 'undefined' && Profile.destroy) {
      Profile.destroy();
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

  // ─── Service Worker ────────────────────────────────
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

// ─── Bootstrap ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
