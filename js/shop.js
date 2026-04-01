/* =====================================================
   ROSIE'S BEAUTY SPA — SHOP TAB MODULE
   Shopify products fetch, product grid, detail overlay
   ===================================================== */

const Shop = {
  PRODUCTS_URL: 'https://rosiesbeautyspa.com/products.json',
  STORE_URL: 'https://rosiesbeautyspa.com/products',
  products: [],
  loaded: false,
  _focusTrapHandler: null,
  _triggerElement: null,

  // ─── Render ───────────────────────────────────────────
  async render() {
    const container = document.getElementById('tab-shop');
    if (!container) return;

    // Render header + skeleton immediately
    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderSkeleton()}
    `;

    // Fetch products (cache-friendly — only fetches once)
    if (!this.loaded) {
      try {
        await this._fetchProducts();
        this.loaded = true;
      } catch (err) {
        console.warn('[Shop] Failed to fetch products:', err);
        container.innerHTML = `
          ${this._renderHeader()}
          ${this._renderError(err)}
        `;
        return;
      }
    }

    // Render full grid
    if (this.products.length === 0) {
      container.innerHTML = `
        ${this._renderHeader()}
        ${this._renderEmpty()}
      `;
    } else {
      container.innerHTML = `
        ${this._renderHeader()}
        ${this._renderGrid()}
        ${this._renderFooter()}
      `;
    }
  },

  // ─── Fetch Products ───────────────────────────────────
  async _fetchProducts() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(this.PRODUCTS_URL, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.products = (data.products || []).map((p) => ({
        id:          p.id,
        handle:      p.handle,
        title:       p.title,
        description: this._stripHtml(p.body_html || ''),
        price:       p.variants && p.variants[0] ? p.variants[0].price : null,
        image:       p.images && p.images[0] ? p.images[0].src : null,
        imageAlt:    p.images && p.images[0] ? (p.images[0].alt || p.title) : p.title,
      }));
    } catch (e) {
      this.products = [];
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  },

  // ─── Header ───────────────────────────────────────────
  _renderHeader() {
    return `
      <header class="shop-header">
        <h1 class="shop-header__title">Shop</h1>
        <p class="shop-header__subtitle">Melanu Skincare by Rosie's</p>
      </header>
    `;
  },

  // ─── Product Grid ─────────────────────────────────────
  _renderGrid() {
    const cards = this.products
      .map((product) => this._renderProductCard(product))
      .join('');

    return `
      <div class="shop-grid" role="list" aria-label="Skincare products">
        ${cards}
      </div>
    `;
  },

  // ─── Product Card ─────────────────────────────────────
  _renderProductCard(product) {
    const priceDisplay = product.price
      ? `$${parseFloat(product.price).toFixed(2).replace(/\.00$/, '')}`
      : '';

    const imageHtml = product.image
      ? `<img
           class="shop-product-card__img"
           src="${product.image}"
           alt="${this._escHtml(product.imageAlt)}"
           loading="lazy"
           onerror="this.style.display='none'; this.parentElement.querySelector('.shop-product-card__placeholder').style.display='flex';"
         />
         <div class="shop-product-card__placeholder" style="display:none;" aria-hidden="true">
           <i class="ph ph-bottle"></i>
         </div>`
      : `<div class="shop-product-card__placeholder" aria-hidden="true">
           <i class="ph ph-bottle"></i>
         </div>`;

    return `
      <div
        class="shop-product-card"
        role="listitem"
        tabindex="0"
        aria-label="${this._escHtml(product.title)}${priceDisplay ? ', ' + priceDisplay : ''} — tap for details"
        onclick="Shop.showDetail('${product.handle}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Shop.showDetail('${product.handle}')}"
      >
        <div class="shop-product-card__image-wrap">
          ${imageHtml}
        </div>
        <div class="shop-product-card__body">
          <p class="shop-product-card__name">${this._escHtml(product.title)}</p>
          ${priceDisplay ? `<p class="shop-product-card__price">${priceDisplay}</p>` : ''}
          ${product.description ? `<p class="shop-product-card__desc">${this._escHtml(product.description.slice(0, 50))}${product.description.length > 50 ? '…' : ''}</p>` : ''}
        </div>
      </div>
    `;
  },

  // ─── Skeleton ─────────────────────────────────────────
  _renderSkeleton() {
    // 2x2 shimmer grid (4 cards)
    const cards = Array.from({ length: 4 }, () => `
      <div class="shop-skeleton__card" aria-hidden="true">
        <div class="shop-skeleton__image"></div>
        <div class="shop-skeleton__lines">
          <div class="shop-skeleton__line shop-skeleton__line--medium"></div>
          <div class="shop-skeleton__line shop-skeleton__line--short"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="shop-skeleton" aria-label="Loading products" role="status" aria-live="polite">
        ${cards}
      </div>
    `;
  },

  // ─── Error State ──────────────────────────────────────
  _renderError(err) {
    const isTimeout = err && err.name === 'AbortError';
    const errorText = isTimeout
      ? 'Taking too long to load. Check your connection and try again.'
      : 'Couldn\'t load products right now. Try again in a moment.';
    return `
      <div class="shop-error" role="alert" aria-live="polite">
        <div class="shop-error__icon" aria-hidden="true">
          <i class="ph ph-wifi-slash"></i>
        </div>
        <h2 class="shop-error__title">Couldn't Load Products</h2>
        <p class="shop-error__text">${errorText}</p>
        <button
          class="shop-error__retry"
          onclick="Shop.retry()"
          aria-label="Retry loading products"
        >
          <i class="ph ph-arrow-clockwise" aria-hidden="true"></i>
          Try Again
        </button>
      </div>
    `;
  },

  // ─── Empty State ──────────────────────────────────────
  _renderEmpty() {
    return `
      <div class="shop-empty">
        <div class="shop-empty__icon" aria-hidden="true">
          <i class="ph ph-bag-simple"></i>
        </div>
        <h2 class="shop-empty__title">Coming Soon</h2>
        <p class="shop-empty__text">New skincare drops coming soon. Follow <a href="https://instagram.com/rosiesbeautyspatx" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none;">@rosiesbeautyspatx</a> on Instagram to be the first to know.</p>
      </div>
    `;
  },

  // ─── Footer ───────────────────────────────────────────
  _renderFooter() {
    return `
      <footer class="shop-footer">
        <p class="shop-footer__caption">
          Melanu Skincare — formulated for melanin-rich skin.<br>
          Fulfilled securely through Rosie's online store.
        </p>
      </footer>
    `;
  },

  // ─── Show Detail Overlay ──────────────────────────────
  showDetail(productHandle) {
    const product = this.products.find((p) => p.handle === productHandle);
    if (!product) {
      console.warn('[Shop] Product not found:', productHandle);
      return;
    }

    const overlay = document.getElementById('shop-detail');
    if (!overlay) {
      console.warn('[Shop] Detail overlay element not found');
      return;
    }

    // Build content
    overlay.innerHTML = this._renderDetailContent(product);

    // Show overlay
    overlay.classList.remove('hidden', 'closing');

    // Scroll sheet to top
    const sheet = overlay.querySelector('.shop-detail__sheet');
    if (sheet) sheet.scrollTop = 0;

    // Accessibility
    overlay.setAttribute('aria-label', `${product.title} — product details`);
    document.body.style.overflow = 'hidden';
    this._triggerElement = document.activeElement;

    // Focus close button
    const closeBtn = overlay.querySelector('.shop-detail__close');
    if (closeBtn) closeBtn.focus();

    // Backdrop tap to close
    const backdrop = overlay.querySelector('.shop-detail__backdrop');
    if (backdrop) {
      backdrop.onclick = () => this.hideDetail();
    }

    // Focus trap
    this._trapFocus(overlay);
  },

  // ─── Hide Detail Overlay ──────────────────────────────
  hideDetail() {
    const overlay = document.getElementById('shop-detail');
    if (!overlay || overlay.classList.contains('hidden')) return;

    overlay.classList.add('closing');
    document.body.style.overflow = '';
    this._releaseFocus();

    const sheet = overlay.querySelector('.shop-detail__sheet');
    const target = sheet || overlay;

    const onAnimEnd = () => {
      target.removeEventListener('animationend', onAnimEnd);
      overlay.classList.add('hidden');
      overlay.classList.remove('closing');
    };

    target.addEventListener('animationend', onAnimEnd);

    // Fallback if animation doesn't fire
    setTimeout(() => {
      if (overlay.classList.contains('closing')) {
        target.removeEventListener('animationend', onAnimEnd);
        overlay.classList.add('hidden');
        overlay.classList.remove('closing');
      }
    }, 300);
  },

  // ─── Render Detail Content ────────────────────────────
  _renderDetailContent(product) {
    const priceDisplay = product.price
      ? `$${parseFloat(product.price).toFixed(2).replace(/\.00$/, '')}`
      : '';

    const imageHtml = product.image
      ? `<img
           class="shop-detail__img"
           src="${product.image}"
           alt="${this._escHtml(product.imageAlt)}"
           loading="eager"
           onerror="this.style.display='none'; this.parentElement.querySelector('.shop-detail__placeholder').style.display='flex';"
         />
         <div class="shop-detail__placeholder" style="display:none;" aria-hidden="true">
           <i class="ph ph-bottle"></i>
         </div>`
      : `<div class="shop-detail__placeholder" aria-hidden="true">
           <i class="ph ph-bottle"></i>
         </div>`;

    const descriptionHtml = product.description
      ? `
        <div class="shop-detail__divider" aria-hidden="true"></div>
        <p class="shop-detail__desc-label">About This Product</p>
        <p class="shop-detail__description">${this._escHtml(product.description)}</p>
      `
      : '';

    const productUrl = `${this.STORE_URL}/${product.handle}`;

    return `
      <div class="shop-detail__backdrop" tabindex="-1"></div>
      <div
        class="shop-detail__sheet"
        role="dialog"
        aria-modal="true"
        aria-label="${this._escHtml(product.title)} — product details"
      >
        <div class="shop-detail__handle" aria-hidden="true"></div>

        <!-- Close button -->
        <button
          class="shop-detail__close"
          onclick="Shop.hideDetail()"
          aria-label="Close"
        >
          <i class="ph ph-x" aria-hidden="true"></i>
        </button>

        <!-- Product image -->
        <div class="shop-detail__image-wrap" role="img" aria-label="${this._escHtml(product.title)} product image">
          ${imageHtml}
        </div>

        <!-- Product info -->
        <div class="shop-detail__content">
          <h2 class="shop-detail__name">${this._escHtml(product.title)}</h2>
          ${priceDisplay ? `<span class="shop-detail__price-pill">${priceDisplay}</span>` : ''}
          ${descriptionHtml}
        </div>

        <!-- Sticky CTA -->
        <div class="shop-detail__cta">
          <a
            href="${productUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="shop-detail__cta-btn"
            aria-label="Buy ${this._escHtml(product.title)}${priceDisplay ? ' for ' + priceDisplay : ''}"
          >
            <i class="ph ph-shopping-cart" aria-hidden="true"></i>
            Buy Now${priceDisplay ? ' · ' + priceDisplay : ''}
          </a>
          <p style="font-size: var(--text-caption1); color: var(--text-secondary); margin-top: var(--space-2); text-align: center;">Secure checkout on rosiesbeautyspa.com</p>
        </div>

      </div>
    `;
  },

  // ─── Retry ────────────────────────────────────────────
  retry() {
    this.loaded = false;
    this.products = [];
    this.render();
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    // Hide any open detail overlay
    const overlay = document.getElementById('shop-detail');
    if (overlay && !overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
      overlay.classList.remove('closing');
    }
    document.body.style.overflow = '';
    this._releaseFocus();
  },

  // ─── Strip HTML ───────────────────────────────────────
  _stripHtml(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  },

  // ─── Escape HTML (for inline attributes) ─────────────
  _escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  // ─── Focus Trap ───────────────────────────────────────
  _trapFocus(container) {
    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', this._focusTrapHandler);
  },

  _releaseFocus() {
    if (this._focusTrapHandler) {
      document.removeEventListener('keydown', this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
    if (this._triggerElement && typeof this._triggerElement.focus === 'function') {
      this._triggerElement.focus();
      this._triggerElement = null;
    }
  },
};

/* ─── Bootstrap: wire Escape key ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('shop-detail');
      if (overlay && !overlay.classList.contains('hidden')) {
        Shop.hideDetail();
      }
    }
  });
});
