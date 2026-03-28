/* =====================================================
   ROSIE'S BEAUTY SPA — BOOK TAB MODULE
   PocketSuite iframe embed, category filters,
   loading skeleton, error state, fallback CTAs
   ===================================================== */

const Book = {
  BASE_URL: 'https://pocketsuite.io/book/rosies-beauty-spa',
  currentCategory: 'all',
  iframeLoaded: false,
  loadTimeout: null,

  categories: [
    { id: 'all',           label: 'All Services',    path: '' },
    { id: 'facials',       label: 'Facials',          path: '/items/facials' },
    { id: 'peels',         label: 'Chemical Peels',   path: '/items/chemical-peels' },
    { id: 'microneedling', label: 'Microneedling',    path: '/items/microneedling' },
    { id: 'brightening',   label: 'Brightening',      path: '/items/brightening' },
  ],

  // ─── Render ───────────────────────────────────────────
  render() {
    const container = document.getElementById('tab-book');
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderCategories()}
      ${this._renderEmbed()}
      ${this._renderFallbacks()}
      ${this._renderFooter()}
    `;

    this._bindEvents();
    this._loadIframe();
  },

  // ─── Header ───────────────────────────────────────────
  _renderHeader() {
    return `
      <header class="book-header">
        <h1 class="book-header__title">Book a Treatment</h1>
        <p class="book-header__subtitle">Schedule your visit with Ashley</p>
      </header>
    `;
  },

  // ─── Category Pills ───────────────────────────────────
  _renderCategories() {
    const pills = this.categories.map((cat) => `
      <button
        class="book-category${cat.id === this.currentCategory ? ' active' : ''}"
        data-category="${cat.id}"
        role="tab"
        aria-selected="${cat.id === this.currentCategory ? 'true' : 'false'}"
        aria-controls="book-embed-frame"
      >
        ${cat.label}
      </button>
    `).join('');

    return `
      <div class="book-categories" role="tablist" aria-label="Service categories">
        ${pills}
      </div>
    `;
  },

  // ─── Embed Card ───────────────────────────────────────
  _renderEmbed() {
    return `
      <div class="book-embed" id="book-embed-card">

        <!-- Loading Skeleton -->
        <div class="book-skeleton" aria-hidden="true" id="book-skeleton">
          <div class="book-skeleton__row">
            <div class="book-skeleton__avatar"></div>
            <div class="book-skeleton__lines">
              <div class="book-skeleton__line book-skeleton__line--medium"></div>
              <div class="book-skeleton__line book-skeleton__line--short"></div>
            </div>
          </div>
          <div class="book-skeleton__block"></div>
          <div class="book-skeleton__row">
            <div class="book-skeleton__avatar"></div>
            <div class="book-skeleton__lines">
              <div class="book-skeleton__line book-skeleton__line--medium"></div>
              <div class="book-skeleton__line book-skeleton__line--short"></div>
            </div>
          </div>
          <div class="book-skeleton__block"></div>
          <div class="book-skeleton__row">
            <div class="book-skeleton__avatar"></div>
            <div class="book-skeleton__lines">
              <div class="book-skeleton__line book-skeleton__line--medium"></div>
              <div class="book-skeleton__line book-skeleton__line--short"></div>
            </div>
          </div>
          <div class="book-skeleton__block"></div>
        </div>

        <!-- PocketSuite Booking Iframe -->
        <iframe
          id="book-embed-frame"
          title="Book a treatment at Rosie's Beauty Spa"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
          aria-label="Online booking calendar"
        ></iframe>

        <!-- Error State -->
        <div class="book-error" id="book-error" role="alert" aria-live="polite">
          <div class="book-error__icon" aria-hidden="true">
            <i class="ph ph-wifi-slash"></i>
          </div>
          <h2 class="book-error__title">We Hit a Snag</h2>
          <p class="book-error__text">Online booking isn't loading right now. Try again or reach out directly.</p>
          <div class="book-error__actions">
            <button class="book-error__retry btn btn-primary" onclick="Book.retry()" aria-label="Retry loading booking">
              <i class="ph ph-arrow-clockwise" aria-hidden="true"></i>
              Try Again
            </button>
            <a
              class="book-error__browser-link"
              href="${this.BASE_URL}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book on PocketSuite.io
            </a>
          </div>
        </div>

      </div>
    `;
  },

  // ─── Fallback CTAs ────────────────────────────────────
  _renderFallbacks() {
    return `
      <div class="book-fallbacks">

        <a
          href="tel:8174229613"
          class="book-fallback-card"
          aria-label="Call Rosie's Beauty Spa at (817) 422-9613"
        >
          <div class="book-fallback-card__icon" aria-hidden="true">
            <i class="ph ph-phone"></i>
          </div>
          <div class="book-fallback-card__content">
            <p class="book-fallback-card__label">Call to Book</p>
            <p class="book-fallback-card__detail">(817) 422-9613</p>
          </div>
          <i class="ph ph-caret-right book-fallback-card__arrow" aria-hidden="true"></i>
        </a>

        <a
          href="https://instagram.com/rosiesbeautyspatx"
          target="_blank"
          rel="noopener noreferrer"
          class="book-fallback-card"
          aria-label="DM Rosie's Beauty Spa on Instagram"
        >
          <div class="book-fallback-card__icon" aria-hidden="true">
            <i class="ph ph-instagram-logo"></i>
          </div>
          <div class="book-fallback-card__content">
            <p class="book-fallback-card__label">DM on Instagram</p>
            <p class="book-fallback-card__detail">@rosiesbeautyspatx</p>
          </div>
          <i class="ph ph-caret-right book-fallback-card__arrow" aria-hidden="true"></i>
        </a>

      </div>
    `;
  },

  // ─── Footer ───────────────────────────────────────────
  _renderFooter() {
    return `
      <footer class="book-footer">
        <p class="book-footer__caption">
          Secure booking powered by PocketSuite.<br>
          Questions? Call or DM us on Instagram.
        </p>
      </footer>
    `;
  },

  // ─── Bind Events ─────────────────────────────────────
  _bindEvents() {
    const categoryRow = document.querySelector('.book-categories');
    if (!categoryRow) return;

    categoryRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.book-category');
      if (!btn) return;

      const newCategory = btn.dataset.category;
      if (newCategory === this.currentCategory) return;

      // Update active state on pills
      categoryRow.querySelectorAll('.book-category').forEach((pill) => {
        const isActive = pill.dataset.category === newCategory;
        pill.classList.toggle('active', isActive);
        pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      this.currentCategory = newCategory;
      this._loadIframe();
    });
  },

  // ─── Load Iframe ─────────────────────────────────────
  _loadIframe() {
    const embedCard = document.getElementById('book-embed-card');
    const skeleton  = document.getElementById('book-skeleton');
    const iframe    = document.getElementById('book-embed-frame');

    if (!embedCard || !iframe) return;

    // Clear any previous timeout
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }

    // Reset states
    this.iframeLoaded = false;
    embedCard.classList.remove('loaded', 'error');

    // Show skeleton
    if (skeleton) skeleton.style.display = '';

    // Build URL
    const category = this.categories.find((c) => c.id === this.currentCategory);
    const path = category ? category.path : '';
    const url = this.BASE_URL + path;

    // Wire load/error handlers before setting src
    iframe.onload = () => {
      if (this.loadTimeout) {
        clearTimeout(this.loadTimeout);
        this.loadTimeout = null;
      }
      this.iframeLoaded = true;
      embedCard.classList.add('loaded');
      embedCard.classList.remove('error');
    };

    // Set src — triggers load
    iframe.src = url;

    // 15-second timeout fallback
    this.loadTimeout = setTimeout(() => {
      if (!this.iframeLoaded) {
        console.warn('[Book] Iframe load timeout — showing error state');
        this._showError();
      }
    }, 15000);
  },

  // ─── Show Error ───────────────────────────────────────
  _showError() {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }

    const embedCard = document.getElementById('book-embed-card');
    if (embedCard) {
      embedCard.classList.remove('loaded');
      embedCard.classList.add('error');
    }
  },

  // ─── Retry ────────────────────────────────────────────
  retry() {
    this._loadIframe();
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
    this.iframeLoaded = false;
  },
};
