/* =====================================================
   ROSIE'S BEAUTY SPA — ONBOARDING MODULE
   3-screen swipeable onboarding with page dots + CTA
   ===================================================== */

const Onboarding = {
  currentSlide: 0,
  totalSlides: 3,

  // ─── SVG Icons ──────────────────────────────────────
  icons: {
    rose: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="36" stroke="#9B1B21" stroke-width="1.5"/>
      <!-- Rose bloom -->
      <path d="M40 18C40 18 28 28 28 38C28 44.6 33.4 50 40 50C46.6 50 52 44.6 52 38C52 28 40 18 40 18Z" stroke="#9B1B21" stroke-width="1.5" fill="rgba(155,27,33,0.08)"/>
      <!-- Inner petals -->
      <path d="M36 30C36 30 40 26 44 30" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M33 36C33 36 40 32 47 36" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Side leaves -->
      <path d="M32 35C32 35 26 30 22 30" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M48 35C48 35 54 30 58 30" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Stem -->
      <path d="M40 50V66" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M40 58C37 56 34 56 32 56" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    treatment: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="36" stroke="#9B1B21" stroke-width="1.5"/>
      <!-- Cross / treatment symbol -->
      <rect x="35" y="22" width="10" height="36" rx="5" stroke="#9B1B21" stroke-width="1.5"/>
      <rect x="22" y="35" width="36" height="10" rx="5" stroke="#9B1B21" stroke-width="1.5"/>
      <!-- Sparkle dots -->
      <circle cx="24" cy="24" r="2" stroke="#9B1B21" stroke-width="1.5"/>
      <circle cx="56" cy="56" r="2" stroke="#9B1B21" stroke-width="1.5"/>
      <circle cx="56" cy="24" r="2" stroke="#9B1B21" stroke-width="1.5"/>
      <circle cx="24" cy="56" r="2" stroke="#9B1B21" stroke-width="1.5"/>
    </svg>`,

    checkmark: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="36" stroke="#9B1B21" stroke-width="1.5"/>
      <!-- Checkmark -->
      <path d="M24 40 L35 52 L56 28" stroke="#9B1B21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Stars / sparkles -->
      <path d="M62 20 L63.5 23.5 L67 25 L63.5 26.5 L62 30 L60.5 26.5 L57 25 L60.5 23.5 Z" stroke="#9B1B21" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M16 52 L17 54.5 L19.5 55.5 L17 56.5 L16 59 L15 56.5 L12.5 55.5 L15 54.5 Z" stroke="#9B1B21" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
  },

  // ─── Slides Data ────────────────────────────────────
  slides: [
    {
      iconKey: 'rose',
      heading: 'Corrective Skincare. Made for Your Melanin.',
      body: 'We specialize in treating Black and brown skin — addressing hyperpigmentation, uneven tone, and texture with clinically proven techniques.',
      pills: [],
      socialProof: null,
    },
    {
      iconKey: 'treatment',
      heading: 'Every Treatment Plan is Built for YOUR Skin.',
      body: 'No one-size-fits-all here. Your consultation starts with your skin type, goals, and concerns.',
      pills: ['Corrective Facials', 'Chemical Peels', 'Microneedling', 'Brightening', 'Anti-Aging'],
      socialProof: null,
    },
    {
      iconKey: 'checkmark',
      heading: 'Ready for Your Glow Up?',
      body: 'Join hundreds of clients who\'ve transformed their skin with Rosie\'s signature corrective treatments.',
      pills: [],
      socialProof: '5.0 ★ · 91 Reviews · As seen in Voyage Dallas',
    },
  ],

  // ─── Render ─────────────────────────────────────────
  render() {
    const container = document.getElementById('onboarding');
    if (!container) return;

    container.innerHTML = `
      <div class="onboarding-slides" id="onboarding-slides" role="region" aria-label="Welcome screens">
        ${this.slides.map((slide, i) => this._renderSlide(slide, i)).join('')}
      </div>
      <footer class="onboarding-footer">
        <div class="onboarding-dots" role="tablist" aria-label="Slide indicator">
          ${Array.from({ length: this.totalSlides }, (_, i) => `
            <div
              class="onboarding-dot${i === 0 ? ' active' : ''}"
              role="tab"
              aria-label="Slide ${i + 1} of ${this.totalSlides}"
              aria-selected="${i === 0}"
            ></div>
          `).join('')}
        </div>
        <button
          id="onboarding-cta"
          class="btn btn-primary btn-lg btn-block"
          style="max-width: 320px;"
        >
          Next
        </button>
        <button
          id="onboarding-skip"
          class="btn btn-text"
        >
          Skip
        </button>
      </footer>
    `;

    this.currentSlide = 0;
    this.bindEvents();
  },

  _renderSlide(slide, index) {
    const pillsHTML = slide.pills.length
      ? `<div class="onboarding-pills">${slide.pills.map(p => `<span class="pill">${p}</span>`).join('')}</div>`
      : '';

    const socialHTML = slide.socialProof
      ? `<p class="onboarding-social-proof">${slide.socialProof}</p>`
      : '';

    return `
      <section
        class="onboarding-slide"
        role="tabpanel"
        aria-label="Slide ${index + 1}"
        id="onboarding-slide-${index}"
      >
        <div class="onboarding-icon">
          ${this.icons[slide.iconKey]}
        </div>
        <h2>${slide.heading}</h2>
        <p>${slide.body}</p>
        ${pillsHTML}
        ${socialHTML}
      </section>
    `;
  },

  // ─── Events ─────────────────────────────────────────
  bindEvents() {
    const slidesEl = document.getElementById('onboarding-slides');
    const ctaBtn   = document.getElementById('onboarding-cta');
    const skipBtn  = document.getElementById('onboarding-skip');

    if (!slidesEl || !ctaBtn || !skipBtn) return;

    // Scroll listener — detect active slide via scroll position
    let scrollTimer = null;
    slidesEl.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const slideWidth = slidesEl.offsetWidth;
        if (slideWidth === 0) return;
        const newSlide = Math.round(slidesEl.scrollLeft / slideWidth);
        if (newSlide !== this.currentSlide) {
          this.currentSlide = newSlide;
          this.updateDots();
          this.updateCta();
        }
      }, 60);
    }, { passive: true });

    // CTA button — advance or complete
    ctaBtn.addEventListener('click', () => {
      if (this.currentSlide < this.totalSlides - 1) {
        // Scroll to next slide
        const slidesEl = document.getElementById('onboarding-slides');
        const slideWidth = slidesEl.offsetWidth;
        slidesEl.scrollTo({
          left: (this.currentSlide + 1) * slideWidth,
          behavior: 'smooth',
        });
      } else {
        // Last slide — complete onboarding
        App.completeOnboarding();
      }
    });

    // Skip button — complete immediately
    skipBtn.addEventListener('click', () => {
      App.completeOnboarding();
    });
  },

  // ─── Update Dots ────────────────────────────────────
  updateDots() {
    const dots = document.querySelectorAll('.onboarding-dot');
    dots.forEach((dot, i) => {
      const isActive = i === this.currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  },

  // ─── Update CTA label ───────────────────────────────
  updateCta() {
    const ctaBtn = document.getElementById('onboarding-cta');
    if (!ctaBtn) return;
    ctaBtn.textContent = this.currentSlide === this.totalSlides - 1
      ? 'Book Your First Visit'
      : 'Next';
  },
};
