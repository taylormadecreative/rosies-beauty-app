/* =====================================================
   ROSIE'S BEAUTY SPA — ONBOARDING MODULE
   Placeholder — full implementation in Task 7
   ===================================================== */

const Onboarding = {
  render() {
    const container = document.getElementById('onboarding');
    container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100dvh;
        padding: var(--space-8) var(--space-5);
        text-align: center;
        gap: var(--space-6);
      ">
        <div style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--accent-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <i class="ph ph-sparkle" style="font-size: 36px; color: var(--accent);"></i>
        </div>
        <h1 class="heading-xl" style="color: var(--text-primary);">
          Rosie's Beauty Spa
        </h1>
        <p class="text-body" style="color: var(--text-secondary); max-width: 280px;">
          Corrective skincare crafted for Black and brown skin. Your glow journey starts here.
        </p>
        <button
          class="btn btn-primary btn-lg btn-block"
          style="max-width: 320px;"
          onclick="App.completeOnboarding()"
        >
          Get Started
        </button>
      </div>
    `;
  },
};
