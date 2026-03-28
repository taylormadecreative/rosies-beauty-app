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
    switch (tabName) {
      case 'home':
        if (typeof Home !== 'undefined' && Home.render) {
          Home.render();
        }
        break;

      case 'book':
        document.getElementById('tab-book').innerHTML = `
          <div class="container" style="padding-top: calc(var(--safe-top) + var(--space-6));">
            <h1 class="heading-lg" style="margin-bottom: var(--space-2);">Book a Treatment</h1>
            <p class="text-subhead text-secondary" style="margin-bottom: var(--space-8);">Schedule your next visit with Ashley</p>

            <div class="card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
              <h3 class="heading-sm" style="margin-bottom: var(--space-3);">Call to Book</h3>
              <p class="text-footnote text-secondary" style="margin-bottom: var(--space-4);">Speak directly with Ashley to schedule your appointment</p>
              <a href="tel:8174229613" class="btn btn-primary btn-block" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="ph ph-phone"></i> Call (817) 422-9613
              </a>
            </div>

            <div class="card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
              <h3 class="heading-sm" style="margin-bottom: var(--space-3);">Book Online</h3>
              <p class="text-footnote text-secondary" style="margin-bottom: var(--space-4);">View availability and book instantly</p>
              <a href="https://pocketsuite.io/book/rosies-beauty-spa" target="_blank" rel="noopener" class="btn btn-primary btn-block" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="ph ph-calendar-check"></i> Book Online
              </a>
            </div>

            <div class="card" style="padding: var(--space-5);">
              <h3 class="heading-sm" style="margin-bottom: var(--space-3);">DM on Instagram</h3>
              <p class="text-footnote text-secondary" style="margin-bottom: var(--space-4);">Send a message to book or ask questions</p>
              <a href="https://instagram.com/rosiesbeautyspatx" target="_blank" rel="noopener" class="btn btn-secondary btn-block" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="ph ph-instagram-logo"></i> @rosiesbeautyspatx
              </a>
            </div>
          </div>
        `;
        break;

      case 'shop':
        document.getElementById('tab-shop').innerHTML = this.renderPlaceholderTab(
          'Shop',
          'ph-bag-simple',
          'Coming Soon — Melanu Skincare products will be available here.'
        );
        break;

      case 'rewards':
        document.getElementById('tab-rewards').innerHTML = this.renderPlaceholderTab(
          'Your Glow Rewards',
          'ph-gift',
          'Earn points on every visit. Full rewards tracking coming soon.'
        );
        break;

      case 'profile':
        document.getElementById('tab-profile').innerHTML = this.renderPlaceholderTab(
          'Your Profile',
          'ph-user',
          'Account management coming soon.'
        );
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
