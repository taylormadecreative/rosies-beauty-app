/* =====================================================
   ROSIE'S BEAUTY SPA — HOME SCREEN MODULE
   Placeholder — full implementation in Task 8
   ===================================================== */

const Home = {
  render() {
    const panel = document.getElementById('tab-home');
    const user = MOCK_USER;
    const greeting = getGreeting();

    panel.innerHTML = `
      <div class="container fade-in" style="padding-top: var(--space-8); padding-bottom: var(--space-8);">
        <p class="text-subhead" style="color: var(--text-secondary);">${greeting}</p>
        <h1 class="heading-lg" style="margin-bottom: var(--space-6);">${user.name} ✨</h1>

        <div class="card" style="padding: var(--space-5); margin-bottom: var(--space-4);">
          <p class="text-footnote" style="color: var(--text-secondary); margin-bottom: var(--space-2);">Upcoming Appointment</p>
          <p class="text-headline">${user.upcomingAppointment.service}</p>
          <p class="text-subhead" style="color: var(--text-secondary);">
            ${user.upcomingAppointment.date} at ${user.upcomingAppointment.time}
          </p>
        </div>

        <div class="card" style="padding: var(--space-5); margin-bottom: var(--space-6);">
          <div class="section-header" style="margin-bottom: var(--space-3);">
            <p class="text-subhead" style="color: var(--text-secondary);">Glow Points</p>
            <span class="pill">${user.glowPoints} pts</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill shimmer"
              style="width: ${Math.round((user.glowPoints / user.nextRewardAt) * 100)}%"
            ></div>
          </div>
          <p class="text-caption" style="color: var(--text-secondary); margin-top: var(--space-2);">
            ${user.nextRewardAt - user.glowPoints} points until your next reward
          </p>
        </div>

        <div class="section-header">
          <h2>Our Services</h2>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${TREATMENTS.map((t) => `
            <div
              class="card fade-in"
              style="padding: var(--space-4); cursor: pointer;"
              onclick="Home.openTreatment('${t.id}')"
              role="button"
              tabindex="0"
              aria-label="Learn more about ${t.name}"
            >
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3);">
                <div style="flex: 1;">
                  <h3 class="text-headline" style="margin-bottom: 4px;">${t.name}</h3>
                  <p class="text-callout" style="color: var(--text-secondary);">${t.benefit}</p>
                  <div style="display: flex; gap: var(--space-2); margin-top: var(--space-2);">
                    <span class="pill">${formatPrice(t.priceFrom)}+</span>
                    <span class="pill pill-neutral">${formatDuration(t.duration)}</span>
                  </div>
                </div>
                <i class="ph ${t.icon}" style="font-size: 28px; color: var(--accent); flex-shrink: 0;"></i>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  openTreatment(id) {
    const treatment = getTreatmentById(id);
    if (!treatment) return;

    const overlay = document.getElementById('treatment-overlay');
    const content = document.getElementById('treatment-overlay-content');
    const backdrop = document.getElementById('overlay-backdrop');

    content.innerHTML = `
      <div style="padding-bottom: var(--space-4);">
        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
          <div style="
            width: 52px; height: 52px; border-radius: 12px;
            background-color: var(--accent-subtle);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
          ">
            <i class="ph ${treatment.icon}" style="font-size: 26px; color: var(--accent);"></i>
          </div>
          <div>
            <h2 class="heading-sm">${treatment.name}</h2>
            <div style="display: flex; gap: var(--space-2); margin-top: 4px;">
              <span class="pill">${formatPrice(treatment.priceFrom)}+</span>
              <span class="pill pill-neutral">${formatDuration(treatment.duration)}</span>
            </div>
          </div>
        </div>

        <p class="text-body" style="color: var(--text-secondary); margin-bottom: var(--space-4);">
          ${treatment.description}
        </p>

        <p class="text-headline" style="margin-bottom: var(--space-2);">Best For</p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);">
          ${treatment.bestFor.map((concern) => `<span class="pill">${concern}</span>`).join('')}
        </div>

        <p class="text-headline" style="margin-bottom: var(--space-2);">How to Prep</p>
        <ul style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-6);">
          ${treatment.prep.map((step) => `
            <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
              <i class="ph ph-check-circle" style="font-size: 18px; color: var(--success); flex-shrink: 0; margin-top: 2px;"></i>
              <span class="text-callout" style="color: var(--text-secondary);">${step}</span>
            </li>
          `).join('')}
        </ul>

        <button
          class="btn btn-primary btn-lg btn-block"
          onclick="App.switchTab('book')"
        >
          Book This Service
        </button>
      </div>
    `;

    overlay.classList.remove('hidden');

    // Close on backdrop tap
    backdrop.onclick = () => Home.closeTreatment();
  },

  closeTreatment() {
    const overlay = document.getElementById('treatment-overlay');
    overlay.classList.add('hidden');
  },
};
