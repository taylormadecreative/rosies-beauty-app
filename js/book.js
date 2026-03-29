/* =====================================================
   ROSIE'S BEAUTY SPA — BOOK TAB MODULE
   Native service browser with category filtering,
   service detail overlay, PocketSuite handoff
   ===================================================== */

const Book = {
  POCKETSUITE_URL: 'https://pocketsuite.io/book/rosies-beauty-spa',
  activeCategory: 'All',
  searchQuery: '',

  // ─── Render ───────────────────────────────────────────
  render() {
    const container = document.getElementById('tab-book');
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderSearch()}
      ${this._renderCategoryPills()}
      <div id="book-service-list">
        ${this._renderServiceList()}
      </div>
      ${this._renderContactCards()}
      ${this._renderFooter()}
    `;

    this._bindCategoryPills();
    this._bindSearch();
  },

  // ─── Header ───────────────────────────────────────────
  _renderHeader() {
    return `
      <header class="book-header">
        <h1 class="book-header__title">Book a Treatment</h1>
        <p class="book-header__subtitle">Browse services and book your visit</p>
      </header>
    `;
  },

  // ─── Search Bar ─────────────────────────────────────────
  _renderSearch() {
    return `
      <div class="book-search" role="search">
        <i class="ph ph-magnifying-glass book-search__icon" aria-hidden="true"></i>
        <input
          type="search"
          id="book-search-input"
          class="book-search__input"
          placeholder="Search treatments..."
          aria-label="Search treatments"
          autocomplete="off"
        >
        <button
          id="book-search-clear"
          class="book-search__clear hidden"
          aria-label="Clear search"
          type="button"
        >
          <i class="ph ph-x-circle"></i>
        </button>
      </div>
    `;
  },

  // ─── Category Pills ──────────────────────────────────
  _renderCategoryPills() {
    const categories = ['All', ...getServiceCategories()];
    const pills = categories
      .map(
        (cat) => `
        <button
          class="book-category${cat === this.activeCategory ? ' active' : ''}"
          data-category="${cat}"
          aria-pressed="${cat === this.activeCategory}"
          aria-label="Filter by ${cat}"
        >${cat}</button>
      `
      )
      .join('');

    return `
      <div class="book-categories" role="tablist" aria-label="Service categories">
        ${pills}
      </div>
    `;
  },

  // ─── Service List ─────────────────────────────────────
  _renderServiceList() {
    let services = getServicesByCategory(this.activeCategory);

    // Apply search filter
    if (this.searchQuery) {
      const q = this.searchQuery;
      services = services.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.bestFor && s.bestFor.some((b) => b.toLowerCase().includes(q)))
      );

      if (services.length === 0) {
        return `
          <div class="book-empty-search">
            <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
            <p class="book-empty-search__title">No services found</p>
            <p class="book-empty-search__text">Try a different search term</p>
          </div>
        `;
      }

      // When searching, show flat list (no category headers)
      return services.map((s) => this._renderServiceCard(s)).join('');
    }

    if (this.activeCategory === 'All') {
      // Group by category with section headers
      const categories = getServiceCategories();
      return categories
        .map((cat) => {
          const catServices = services.filter((s) => s.category === cat);
          if (catServices.length === 0) return '';
          const cards = catServices.map((s) => this._renderServiceCard(s)).join('');
          return `
            <div class="book-category-group">
              <h2 class="book-category-header">${cat}</h2>
              ${cards}
            </div>
          `;
        })
        .join('');
    }

    return services.map((s) => this._renderServiceCard(s)).join('');
  },

  // ─── Service Card ─────────────────────────────────────
  _renderServiceCard(service) {
    const duration = service.duration > 0 ? formatDuration(service.duration) : '';
    const price = service.salePrice
      ? `<s>$${service.price}</s> $${service.salePrice}`
      : (service.price === 0 ? 'View Options' : `$${service.price}`);
    const benefitText = service.bestFor && service.bestFor.length > 0
      ? service.bestFor[0]
      : service.description.substring(0, 50) + '...';

    return `
      <article
        class="book-service-card"
        role="button"
        tabindex="0"
        aria-label="${service.name}, ${duration}, ${price}"
        onclick="Book._openServiceDetail('${service.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Book._openServiceDetail('${service.id}')}"
      >
        <div class="book-service-card__icon" aria-hidden="true">
          <i class="ph ${service.icon}"></i>
        </div>
        <div class="book-service-card__content">
          <p class="book-service-card__name">${service.name}</p>
          <p class="book-service-card__meta">${duration ? duration + ' · ' : ''}${price}</p>
          <p class="book-service-card__benefit">${benefitText}</p>
        </div>
        <i class="ph ph-caret-right book-service-card__arrow" aria-hidden="true"></i>
      </article>
    `;
  },

  // ─── Contact Quick Link ─────────────────────────────────
  _renderContactCards() {
    return `
      <div class="book-contact-section" style="text-align: center;">
        <p style="font-size: var(--text-subhead); color: var(--text-secondary);">
          Questions? <a href="tel:8174229613" style="color: var(--accent); text-decoration: none; font-weight: 600;">Call (817) 422-9613</a>
        </p>
      </div>
    `;
  },

  // ─── Footer ───────────────────────────────────────────
  _renderFooter() {
    return `
      <footer class="book-footer">
        <p class="book-footer__caption">
          Online booking powered by PocketSuite.<br>
          Questions? Call or DM us on Instagram.
        </p>
      </footer>
    `;
  },

  // ─── Bind Category Pills ─────────────────────────────
  _bindCategoryPills() {
    const container = document.querySelector('.book-categories');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const pill = e.target.closest('.book-category');
      if (!pill) return;

      const category = pill.dataset.category;
      if (category === this.activeCategory) return;

      this.activeCategory = category;

      // Update pill states
      container.querySelectorAll('.book-category').forEach((p) => {
        const isActive = p.dataset.category === category;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-pressed', isActive);
      });

      // Re-render the service list
      const listContainer = document.getElementById('book-service-list');
      if (listContainer) {
        listContainer.innerHTML = this._renderServiceList();
      }
    });
  },

  // ─── Bind Search ────────────────────────────────────────
  _bindSearch() {
    const input = document.getElementById('book-search-input');
    const clearBtn = document.getElementById('book-search-clear');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.searchQuery = input.value.trim().toLowerCase();
        clearBtn.classList.toggle('hidden', !this.searchQuery);
        this._updateServiceList();
      }, 200);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        this.searchQuery = '';
        clearBtn.classList.add('hidden');
        this._updateServiceList();
        input.focus();
      });
    }
  },

  // ─── Update Service List (filter by search + category) ──
  _updateServiceList() {
    const listContainer = document.getElementById('book-service-list');
    if (listContainer) {
      listContainer.innerHTML = this._renderServiceList();
    }
  },

  // ─── Open Service Detail ──────────────────────────────
  _openServiceDetail(serviceId) {
    if (typeof TreatmentDetail !== 'undefined' && TreatmentDetail.show) {
      TreatmentDetail.show(serviceId);
    } else {
      // Fallback: go straight to PocketSuite
      window.open(this.POCKETSUITE_URL, '_blank');
    }
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    this.activeCategory = 'All';
    this.searchQuery = '';
  },
};
