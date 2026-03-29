/* =====================================================
   ROSIE'S BEAUTY SPA — ONBOARDING MODULE
   3-screen swipeable onboarding with page dots + CTA
   ===================================================== */

const Onboarding = {
  currentSlide: 0,
  totalSlides: 3,

  // ─── SVG Icons ──────────────────────────────────────
  icons: {
    rose: `<img src="assets/images/rosies-logo.jpg" alt="Rosie's Beauty" class="onboarding-logo" aria-hidden="true" />`,

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
              tabindex="0"
              aria-label="Slide ${i + 1} of ${this.totalSlides}"
              aria-selected="${i === 0}"
              onclick="Onboarding.goToSlide(${i})"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Onboarding.goToSlide(${i})}"
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

    const isLastSlide = index === this.totalSlides - 1;

    const profileSetupHTML = isLastSlide
      ? `
        <div class="onboarding-profile-setup">
          <div class="onboarding-avatar" id="onboardingAvatar" role="button" tabindex="0" aria-label="Add a profile photo" onclick="Onboarding._triggerPhoto()">
            <span class="onboarding-avatar__initial" id="onboardingAvatarContent">
              <i class="ph ph-camera" style="font-size: 24px; color: var(--accent);"></i>
            </span>
            <div class="onboarding-avatar__badge">
              <i class="ph ph-plus"></i>
            </div>
          </div>
          <p style="font-size: var(--text-caption); color: var(--text-secondary); margin-top: 8px;">Add a photo (optional)</p>
          <input type="file" id="onboardingPhotoInput" accept="image/*" style="display:none;" onchange="Onboarding._handlePhoto(event)" />
          <input type="text" placeholder="What should we call you?" class="onboarding-name-input" id="onboarding-name" autocomplete="given-name">
        </div>`
      : '';

    const signInHTML = isLastSlide
      ? `<p class="onboarding-sign-in" style="margin-top: 12px; font-size: var(--text-footnote); color: var(--text-secondary);">Already have an account? <button onclick="App.completeOnboarding()" style="background:none;border:none;color:var(--accent);font-weight:600;cursor:pointer;padding:0;font-size:inherit;font-family:inherit;">Sign In</button></p>`
      : '';

    return `
      <section
        class="onboarding-slide"
        role="tabpanel"
        aria-label="Slide ${index + 1}"
        id="onboarding-slide-${index}"
      >
        ${!isLastSlide ? `<div class="onboarding-icon">${this.icons[slide.iconKey]}</div>` : ''}
        <h2>${slide.heading}</h2>
        <p>${slide.body}</p>
        ${pillsHTML}
        ${socialHTML}
        ${profileSetupHTML}
        ${signInHTML}
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
        // Last slide — save name and complete onboarding
        const nameInput = document.getElementById('onboarding-name');
        if (nameInput && nameInput.value.trim()) {
          localStorage.setItem('rosies_client_name', nameInput.value.trim());
        }
        App.completeOnboarding();
      }
    });

    // Skip button — complete immediately
    skipBtn.addEventListener('click', () => {
      App.completeOnboarding();
    });

    // Keyboard: ArrowLeft/ArrowRight to navigate slides
    slidesEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && this.currentSlide < this.totalSlides - 1) {
        e.preventDefault();
        this.goToSlide(this.currentSlide + 1);
      } else if (e.key === 'ArrowLeft' && this.currentSlide > 0) {
        e.preventDefault();
        this.goToSlide(this.currentSlide - 1);
      }
    });
  },

  // ─── Go To Slide ──────────────────────────────────────
  goToSlide(index) {
    const slidesEl = document.getElementById('onboarding-slides');
    if (!slidesEl) return;
    const slideWidth = slidesEl.offsetWidth;
    slidesEl.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
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
      ? 'Get Started'
      : 'Next';
  },

  // ─── Photo Upload ────────────────────────────────────
  _triggerPhoto() {
    const input = document.getElementById('onboardingPhotoInput');
    if (input) input.click();
  },

  _handlePhoto(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Save immediately
        localStorage.setItem('rosies_profile_photo', dataUrl);

        // Update the avatar circle to show the photo
        const avatarContent = document.getElementById('onboardingAvatarContent');
        if (avatarContent) {
          avatarContent.innerHTML = `<img src="${dataUrl}" alt="Your photo" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;" />`;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },
};
