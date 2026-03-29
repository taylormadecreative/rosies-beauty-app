/* =====================================================
   ROSIE'S BEAUTY SPA — BOOK TAB MODULE
   Native service browser with category filtering,
   service detail overlay, PocketSuite handoff
   ===================================================== */

const Book = {
  POCKETSUITE_URL: 'https://pocketsuite.io/book/rosies-beauty-spa',
  activeCategory: 'All',

  // ─── Render ───────────────────────────────────────────
  render() {
    const container = document.getElementById('tab-book');
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderCategoryPills()}
      <div id="book-service-list">
        ${this._renderServiceList()}
      </div>
      ${this._renderCallCard()}
      ${this._renderFooter()}
    `;

    this._bindCategoryPills();
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
    const services = getServicesByCategory(this.activeCategory);

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
    const duration = formatDuration(service.duration);
    const price = service.price === 0 ? 'Free' : `$${service.price}`;
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
          <p class="book-service-card__meta">${duration} · ${price}</p>
          <p class="book-service-card__benefit">${benefitText}</p>
        </div>
        <i class="ph ph-caret-right book-service-card__arrow" aria-hidden="true"></i>
      </article>
    `;
  },

  // ─── Call Card ────────────────────────────────────────
  _renderCallCard() {
    return `
      <a
        href="tel:8174229613"
        class="book-call-card"
        aria-label="Call Ashley at (817) 422-9613"
      >
        <div class="book-call-card__icon" aria-hidden="true">
          <i class="ph ph-phone"></i>
        </div>
        <div class="book-call-card__content">
          <p class="book-call-card__label">Questions? Call Ashley</p>
          <p class="book-call-card__number">(817) 422-9613</p>
        </div>
        <i class="ph ph-caret-right book-call-card__arrow" aria-hidden="true"></i>
      </a>
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
  },
};
