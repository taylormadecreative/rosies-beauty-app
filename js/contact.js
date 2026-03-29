/* =====================================================
   ROSIE'S BEAUTY SPA — CONTACT & LOCATION TAB MODULE
   Map card, hours, contact cards, about Ashley,
   sticky book CTA
   ===================================================== */

const Contact = {

  // ─── Render ─────────────────────────────────────────
  render() {
    const container = document.getElementById('tab-contact');
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      <div class="fade-in">
        ${this._renderMapCard()}
        ${this._renderHours()}
        <h2 class="contact-section-title">Get in Touch</h2>
        ${this._renderContactCards()}
        ${this._renderAbout()}
        <div class="contact-spacer" aria-hidden="true"></div>
      </div>
      ${this._renderBookCta()}
    `;
  },

  // ─── Header ─────────────────────────────────────────
  _renderHeader() {
    return `
      <header class="contact-header">
        <h1 class="contact-header__title">Contact & Location</h1>
      </header>
    `;
  },

  // ─── Map Card ───────────────────────────────────────
  _renderMapCard() {
    return `
      <div class="contact-map" role="region" aria-label="Location">
        <a href="https://maps.apple.com/?address=1150+W+Pioneer+Pkwy,+Arlington,+TX+76013" target="_blank" rel="noopener" class="contact-map__visual" aria-label="Open in Apple Maps">
          <iframe
            class="contact-map__iframe"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-97.1485%2C32.7075%2C-97.1385%2C32.7145&layer=mapnik&marker=32.711%2C-97.1435"
            loading="lazy"
            title="Rosie's Beauty Spa location on map"
          ></iframe>
          <div class="contact-map__img-overlay"><i class="ph ph-map-pin"></i> Tap to Open in Maps</div>
        </a>
        <div class="contact-map__body">
          <p class="contact-map__address">1150 W Pioneer Pkwy<br>Arlington, TX 76013</p>
          <p class="contact-map__landmark">Pioneer Plaza</p>
          <a
            href="https://maps.apple.com/?address=1150+W+Pioneer+Pkwy,+Arlington,+TX+76013"
            target="_blank"
            rel="noopener"
            class="contact-map__directions"
            aria-label="Get directions to Rosie's Beauty Spa"
          >
            <i class="ph ph-navigation-arrow" aria-hidden="true"></i>
            Get Directions
          </a>
        </div>
      </div>
    `;
  },

  // ─── Hours Card ─────────────────────────────────────
  _renderHours() {
    const todayIndex = this._getTodayIndex();
    const hours = [
      { day: 'Monday',    time: 'Closed',         closed: true },
      { day: 'Tuesday',   time: '10 AM – 6 PM',   closed: false },
      { day: 'Wednesday', time: '10 AM – 6 PM',   closed: false },
      { day: 'Thursday',  time: '10 AM – 7 PM',   closed: false },
      { day: 'Friday',    time: '10 AM – 6 PM',   closed: false },
      { day: 'Saturday',  time: '9 AM – 4 PM',    closed: false },
      { day: 'Sunday',    time: 'Closed',          closed: true },
    ];

    const rows = hours.map((h, i) => {
      const isToday = i === todayIndex;
      const closedClass = h.closed ? ' contact-hours__row--closed' : '';
      const todayClass = isToday ? ' contact-hours__row--today' : '';
      return `
        <li class="contact-hours__row${todayClass}${closedClass}" ${isToday ? 'aria-current="date"' : ''}>
          <span class="contact-hours__day">${h.day}${isToday ? ' (Today)' : ''}</span>
          <span class="contact-hours__time">${h.time}</span>
        </li>
      `;
    }).join('');

    return `
      <div class="contact-hours" role="region" aria-label="Business hours">
        <h2 class="contact-hours__title">Hours</h2>
        <ul class="contact-hours__list">
          ${rows}
        </ul>
      </div>
    `;
  },

  // ─── Contact Cards ──────────────────────────────────
  _renderContactCards() {
    return `
      <div class="contact-cards">
        <a
          href="tel:8174229613"
          class="contact-card"
          aria-label="Call or text (817) 422-9613"
        >
          <div class="contact-card__icon" aria-hidden="true">
            <i class="ph ph-phone"></i>
          </div>
          <div class="contact-card__content">
            <p class="contact-card__label">Call or Text</p>
            <p class="contact-card__detail">(817) 422-9613</p>
            <p class="contact-card__detail">Running late? Need to cancel? Call us</p>
          </div>
          <i class="ph ph-caret-right contact-card__arrow" aria-hidden="true"></i>
        </a>

        <a
          href="https://instagram.com/rosiesbeautyspatx"
          target="_blank"
          rel="noopener"
          class="contact-card"
          aria-label="DM on Instagram @rosiesbeautyspatx"
        >
          <div class="contact-card__icon" aria-hidden="true">
            <i class="ph ph-instagram-logo"></i>
          </div>
          <div class="contact-card__content">
            <p class="contact-card__label">DM on Instagram</p>
            <p class="contact-card__detail">@rosiesbeautyspatx</p>
          </div>
          <i class="ph ph-caret-right contact-card__arrow" aria-hidden="true"></i>
        </a>
      </div>
    `;
  },

  // ─── About Ashley ───────────────────────────────────
  _renderAbout() {
    return `
      <div class="contact-about" role="region" aria-label="About Ashley">
        <img src="assets/images/ashley-portrait.jpg" alt="Ashley, founder of Rosie's Beauty Spa" class="contact-about__photo" loading="lazy" />
        <h2 class="contact-about__title">About Ashley</h2>
        <p class="contact-about__bio">
          Licensed esthetician, certified nutritionist, and founder of Rosie's Beauty Spa.
          Over 6 years specializing in corrective skincare for women of color.
        </p>
        <div class="contact-about__proof">
          <i class="ph ph-star-fill" aria-hidden="true"></i>
          5.0 ★ · 91 Reviews · As seen in Voyage Dallas
        </div>
      </div>
    `;
  },

  // ─── Book CTA ───────────────────────────────────────
  _renderBookCta() {
    return `
      <div class="contact-book-cta">
        <button
          class="contact-book-cta__btn"
          onclick="App.switchTab('book')"
          aria-label="Book your visit"
        >
          <i class="ph ph-calendar-blank" aria-hidden="true"></i>
          Book Your Visit
        </button>
      </div>
    `;
  },

  // ─── Get Today Index (0=Mon, 6=Sun) ─────────────────
  _getTodayIndex() {
    // JS getDay(): 0=Sun, 1=Mon ... 6=Sat
    // We need: 0=Mon, 1=Tue ... 6=Sun
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  },

  // ─── Destroy ────────────────────────────────────────
  destroy() {
    // No cleanup needed currently
  },
};
