/* =====================================================
   ROSIE'S BEAUTY SPA — HOME SCREEN MODULE
   Hero, treatments scroll, upcoming appointment,
   rewards peek, and recommended product
   ===================================================== */

const Home = {

  // ─── Render ─────────────────────────────────────────
  render() {
    const panel = document.getElementById('tab-home');
    if (!panel) return;

    const user = MOCK_USER;
    const greeting = getGreeting();
    const pointsProgress = Math.min(
      Math.round((user.glowPoints / user.nextRewardAt) * 100),
      100
    );
    const pointsRemaining = user.nextRewardAt - user.glowPoints;

    panel.innerHTML = `
      ${Home._renderHeader(greeting, user.name)}

      <div class="home-content fade-in">

        ${Home._renderHeroCard(greeting, user.name, user.visitStreak)}

        ${Home._renderTreatmentsSection()}

        ${Home._renderUpcomingSection(user.upcomingAppointment)}

        ${Home._renderRewardsSection(user.glowPoints, pointsRemaining, pointsProgress)}

        ${Home._renderProductSection(user.recommendedProduct)}

        <div style="height: 100px;" aria-hidden="true"></div>

      </div>
    `;
  },

  // ─── Header ─────────────────────────────────────────
  _renderHeader(greeting, name) {
    return `
      <header class="home-header" role="banner">
        <div>
          <p class="home-header__greeting">${greeting}</p>
          <p class="home-header__name">${name}</p>
        </div>
        <div class="home-header__icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M16 6C16 6 10 11 10 16C10 19.3 12.7 22 16 22C19.3 22 22 19.3 22 16C22 11 16 6 16 6Z" stroke="var(--accent)" stroke-width="1.5" fill="rgba(155,27,33,0.08)"/>
            <path d="M13 13C13 13 11 10 8 10" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M19 13C19 13 21 10 24 10" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M16 22V28" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M16 25C14 23.5 12.5 23 11 23" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </header>
    `;
  },

  // ─── Hero Card ──────────────────────────────────────
  _renderHeroCard(greeting, name, visitStreak) {
    const streakText = visitStreak === 1
      ? '1 visit this month'
      : `${visitStreak} visits this month`;

    return `
      <div class="hero-card" role="region" aria-label="Welcome banner">
        <p class="hero-card__greeting">${greeting},<br>${name}.</p>
        <p class="hero-card__streak">${streakText} — keep glowing.</p>
        <button
          class="hero-card__cta"
          onclick="App.switchTab('book')"
          aria-label="Book your next visit"
        >
          <i class="ph ph-calendar-blank" aria-hidden="true"></i>
          Book Your Next Visit
        </button>
        <p class="hero-card__social-proof">5.0 ★ · 91 Reviews</p>
      </div>
    `;
  },

  // ─── Treatments Section ─────────────────────────────
  _renderTreatmentsSection() {
    const cards = TREATMENTS.map((t) => Home._renderTreatmentCard(t)).join('');

    return `
      <section class="home-section" aria-label="Treatments">
        <div class="home-section__header">
          <h2 class="home-section__title">Treatments</h2>
        </div>
        <div
          class="treatments-scroll"
          role="list"
          aria-label="Available treatments"
        >
          ${cards}
        </div>
      </section>
    `;
  },

  _renderTreatmentCard(treatment) {
    const duration = formatDuration(treatment.duration);
    const price = formatPrice(treatment.priceFrom);

    return `
      <article
        class="treatment-card"
        role="listitem"
        tabindex="0"
        aria-label="${treatment.name}, from ${price}, ${duration}"
        onclick="Home._openTreatment('${treatment.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Home._openTreatment('${treatment.id}')}"
      >
        <div class="treatment-card__icon" aria-hidden="true">
          <i class="ph ${treatment.icon}"></i>
        </div>
        <p class="treatment-card__name">${treatment.name}</p>
        <p class="treatment-card__duration">${duration}</p>
        <p class="treatment-card__benefit">${treatment.benefit}</p>
        <p class="treatment-card__price">${price}+</p>
      </article>
    `;
  },

  // ─── Upcoming Appointment Section ───────────────────
  _renderUpcomingSection(appointment) {
    const cardHTML = appointment
      ? Home._renderAppointmentCard(appointment)
      : Home._renderAppointmentEmpty();

    return `
      <section class="home-section" aria-label="Upcoming appointment">
        <div class="home-section__header">
          <h2 class="home-section__title">Upcoming</h2>
        </div>
        ${cardHTML}
      </section>
    `;
  },

  _renderAppointmentCard(appt) {
    const daysLabel = appt.daysUntil === 1
      ? 'Tomorrow'
      : `${appt.daysUntil} days`;

    return `
      <div
        class="appointment-card"
        role="button"
        tabindex="0"
        aria-label="${appt.service} on ${appt.date} at ${appt.time}, in ${daysLabel}"
        onclick="App.switchTab('book')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();App.switchTab('book')}"
      >
        <div class="appointment-card__photo" aria-hidden="true">
          <i class="ph ph-sparkle"></i>
        </div>
        <div class="appointment-card__body">
          <p class="appointment-card__service">${appt.service}</p>
          <p class="appointment-card__datetime">${appt.date} · ${appt.time}</p>
        </div>
        <p class="appointment-card__countdown">${daysLabel}</p>
      </div>
    `;
  },

  _renderAppointmentEmpty() {
    return `
      <div
        class="appointment-empty"
        role="button"
        tabindex="0"
        aria-label="No upcoming appointment. Tap to book a service."
        onclick="App.switchTab('book')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();App.switchTab('book')}"
      >
        <div class="appointment-empty__icon" aria-hidden="true">
          <i class="ph ph-calendar-plus"></i>
        </div>
        <p class="appointment-empty__text">No upcoming appointments</p>
        <p class="appointment-empty__cta">Book a service →</p>
      </div>
    `;
  },

  // ─── Rewards Section ────────────────────────────────
  _renderRewardsSection(points, remaining, progressPct) {
    return `
      <section class="home-section" aria-label="Glow Rewards">
        <div class="home-section__header">
          <h2 class="home-section__title">Rewards</h2>
          <button
            class="home-section__link"
            onclick="App.switchTab('rewards')"
            aria-label="View all rewards"
          >
            View All →
          </button>
        </div>
        <div
          class="rewards-card"
          role="button"
          tabindex="0"
          aria-label="Glow Rewards: ${points} points, ${remaining} until next reward"
          onclick="App.switchTab('rewards')"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();App.switchTab('rewards')}"
        >
          <div class="rewards-card__top">
            <div class="rewards-card__points-group">
              <p class="rewards-card__points-number">${points}</p>
              <p class="rewards-card__points-label">Glow Points</p>
            </div>
            <span class="rewards-card__remaining-pill">${remaining} to next reward</span>
          </div>
          <div class="progress-bar" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100" aria-label="Rewards progress">
            <div class="progress-fill shimmer" style="width: ${progressPct}%"></div>
          </div>
          <p class="rewards-card__caption">Earn points with every visit. Redeem for free services.</p>
        </div>
      </section>
    `;
  },

  // ─── Recommended Product Section ────────────────────
  _renderProductSection(product) {
    const imageHTML = product.image
      ? `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\"ph ph-flask\\" aria-hidden=\\"true\\"></i>'">`
      : `<i class="ph ph-flask" aria-hidden="true"></i>`;

    return `
      <section class="home-section" aria-label="Recommended for you">
        <div class="home-section__header">
          <h2 class="home-section__title">Recommended For You</h2>
        </div>
        <div
          class="product-card"
          role="button"
          tabindex="0"
          aria-label="${product.name}, $${product.price}"
          onclick="App.switchTab('shop')"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();App.switchTab('shop')}"
        >
          <div class="product-card__image" aria-hidden="true">
            ${imageHTML}
          </div>
          <div class="product-card__body">
            <p class="product-card__name">${product.name}</p>
            <p class="product-card__context">${product.description}</p>
          </div>
          <p class="product-card__price">$${product.price}</p>
        </div>
      </section>
    `;
  },

  // ─── Open Treatment ─────────────────────────────────
  // Delegates to TreatmentDetail (Task 9). Falls back gracefully if not yet loaded.
  _openTreatment(id) {
    if (typeof TreatmentDetail !== 'undefined' && TreatmentDetail.show) {
      TreatmentDetail.show(id);
    } else {
      // Fallback: open the existing overlay from the previous stub if present
      const treatment = getTreatmentById(id);
      if (!treatment) return;
      console.info('[Home] TreatmentDetail not loaded yet (Task 9). Treatment:', treatment.name);
    }
  },
};
