/* =====================================================
   ROSIE'S BEAUTY SPA — TREATMENT DETAIL OVERLAY
   Bottom-sheet detail view for a single treatment
   ===================================================== */

const TreatmentDetail = {

  _currentId: null,

  // ─── Show ────────────────────────────────────────────
  show(treatmentId) {
    const treatment = getTreatmentById(treatmentId);
    if (!treatment) {
      console.warn('[TreatmentDetail] Treatment not found:', treatmentId);
      return;
    }

    this._currentId = treatmentId;

    const overlay = document.getElementById('treatment-overlay');
    if (!overlay) {
      console.warn('[TreatmentDetail] Overlay element not found');
      return;
    }

    // Clear closing state and make visible
    overlay.classList.remove('hidden', 'closing');

    // Render content into the content div
    const contentEl = document.getElementById('treatment-overlay-content');
    if (contentEl) {
      contentEl.innerHTML = this._render(treatment);
    }

    // Scroll the sheet to top
    const sheet = overlay.querySelector('.treatment-overlay__sheet');
    if (sheet) {
      sheet.scrollTop = 0;
    }

    // Trap focus for accessibility
    overlay.setAttribute('aria-label', `${treatment.name} details`);

    // Prevent body scroll while overlay is open
    document.body.style.overflow = 'hidden';
  },

  // ─── Hide ────────────────────────────────────────────
  hide() {
    const overlay = document.getElementById('treatment-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;

    overlay.classList.add('closing');

    // Restore body scroll immediately (feels more responsive)
    document.body.style.overflow = '';

    // Listen on the sheet (which has the animation)
    const sheet = overlay.querySelector('.treatment-overlay__sheet');
    const target = sheet || overlay;

    const onAnimEnd = () => {
      target.removeEventListener('animationend', onAnimEnd);
      overlay.classList.add('hidden');
      overlay.classList.remove('closing');
      this._currentId = null;
    };

    target.addEventListener('animationend', onAnimEnd);

    // Fallback: if animation doesn't fire (e.g. display:none race), hide after 300ms
    setTimeout(() => {
      if (overlay.classList.contains('closing')) {
        target.removeEventListener('animationend', onAnimEnd);
        overlay.classList.add('hidden');
        overlay.classList.remove('closing');
        this._currentId = null;
      }
    }, 300);
  },

  // ─── Render HTML ─────────────────────────────────────
  _render(treatment) {
    return `
      <div class="td-body">

        ${this._renderHero(treatment)}

        <div class="td-title-row">
          <h2 class="td-title">${treatment.name}</h2>
          <p class="td-benefit">${treatment.benefit}</p>
        </div>

        ${this._renderTags(treatment)}

        <div class="td-divider" aria-hidden="true"></div>

        <!-- What to Expect -->
        <div class="td-section">
          <p class="td-section__label">What to Expect</p>
          <p class="td-section__description">${treatment.description}</p>
        </div>

        <div class="td-divider" aria-hidden="true"></div>

        <!-- Best For -->
        ${this._renderBestFor(treatment.bestFor)}

        <div class="td-divider" aria-hidden="true"></div>

        <!-- Before Your Visit -->
        ${this._renderPrep(treatment.prep)}

        <!-- Sticky CTA -->
        ${this._renderCTA(treatment)}

      </div>
    `;
  },

  // ─── Hero ─────────────────────────────────────────────
  _renderHero(treatment) {
    // We always render placeholder first; img loads on top if path exists
    return `
      <div class="td-hero" role="img" aria-label="${treatment.name} treatment image">
        <div class="td-hero__placeholder" aria-hidden="true">
          <i class="ph ${treatment.icon}"></i>
        </div>
        ${treatment.image ? `
        <img
          class="td-hero__img"
          src="${treatment.image}"
          alt="${treatment.name}"
          loading="eager"
          onerror="this.style.display='none'"
        />` : ''}
      </div>
    `;
  },

  // ─── Tags Row ─────────────────────────────────────────
  _renderTags(treatment) {
    const durationLabel = formatDuration(treatment.duration);
    const priceLabel    = `From ${formatPrice(treatment.priceFrom)}`;

    // Limit bestFor pills to 3 in the tag row to avoid overflow
    const bestForPills = (treatment.bestFor || [])
      .slice(0, 3)
      .map((label) => `<span class="td-tag td-tag--neutral">${label}</span>`)
      .join('');

    return `
      <div class="td-tags" role="list" aria-label="Treatment details">
        <span class="td-tag td-tag--meta" role="listitem">
          <i class="ph ph-clock" aria-hidden="true"></i>
          ${durationLabel}
        </span>
        <span class="td-tag td-tag--meta" role="listitem">
          <i class="ph ph-tag" aria-hidden="true"></i>
          ${priceLabel}
        </span>
        ${bestForPills}
      </div>
    `;
  },

  // ─── Best For ─────────────────────────────────────────
  _renderBestFor(bestFor) {
    if (!bestFor || bestFor.length === 0) return '';

    const pills = bestFor
      .map((item) => `<span class="pill pill-neutral" role="listitem">${item}</span>`)
      .join('');

    return `
      <div class="td-section">
        <p class="td-section__label">Best For</p>
        <div class="td-section__pills" role="list" aria-label="Best for conditions">
          ${pills}
        </div>
      </div>
    `;
  },

  // ─── Before Your Visit / Prep ─────────────────────────
  _renderPrep(prep) {
    if (!prep) return '';

    let content;

    if (Array.isArray(prep)) {
      const items = prep.map((step) => `
        <li class="td-prep-list__item">
          <div class="td-prep-list__bullet" aria-hidden="true">
            <i class="ph ph-check"></i>
          </div>
          <span>${step}</span>
        </li>
      `).join('');

      content = `<ul class="td-prep-list" aria-label="Preparation steps">${items}</ul>`;
    } else {
      content = `<p class="td-prep-text">${prep}</p>`;
    }

    return `
      <div class="td-section">
        <p class="td-section__label">Before Your Visit</p>
        ${content}
      </div>
    `;
  },

  // ─── Sticky CTA ───────────────────────────────────────
  _renderCTA(treatment) {
    return `
      <div class="td-cta">
        <button
          class="td-cta__btn"
          onclick="TreatmentDetail._handleBook()"
          aria-label="Book ${treatment.name}"
        >
          <i class="ph ph-calendar-check" aria-hidden="true"></i>
          Book This Treatment
        </button>
      </div>
    `;
  },

  // ─── Book Button Handler ──────────────────────────────
  _handleBook() {
    this.hide();
    // Switch to book tab after hide animation starts
    if (typeof App !== 'undefined' && App.switchTab) {
      App.switchTab('book');
    }
  },
};

/* ─── Bootstrap: wire up backdrop tap + back gesture ──── */
document.addEventListener('DOMContentLoaded', () => {
  const overlay  = document.getElementById('treatment-overlay');
  const backdrop = document.getElementById('overlay-backdrop');

  // Tapping the backdrop closes the sheet
  if (backdrop) {
    backdrop.addEventListener('click', () => TreatmentDetail.hide());
  }

  // Keyboard: Escape closes the overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
      TreatmentDetail.hide();
    }
  });
});
