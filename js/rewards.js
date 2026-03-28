/* =====================================================
   ROSIE'S BEAUTY SPA — REWARDS TAB MODULE
   Points hero, earn actions, available rewards, history
   ===================================================== */

const Rewards = {
  MOCK_HISTORY: [
    { type: 'earned', description: 'Corrective Facial booking', points: 100, date: 'Mar 22' },
    { type: 'earned', description: 'Melanu Serum purchase', points: 50, date: 'Mar 18' },
    { type: 'earned', description: 'Chemical Peel booking', points: 100, date: 'Mar 10' },
    { type: 'redeemed', description: 'Free add-on redeemed', points: -500, date: 'Feb 28' },
    { type: 'earned', description: 'Referral: Tanya M.', points: 200, date: 'Feb 15' },
    { type: 'earned', description: 'App download bonus', points: 50, date: 'Feb 1' },
  ],

  EARN_ACTIONS: [
    { icon: 'ph-calendar-blank', text: 'Book any treatment', points: '+100' },
    { icon: 'ph-users', text: 'Refer a friend', points: '+200' },
    { icon: 'ph-bag-simple', text: 'Buy a product', points: '+50' },
    { icon: 'ph-star', text: 'Leave a review', points: '+50' },
    { icon: 'ph-device-mobile', text: 'Download the app', points: '+50' },
  ],

  REWARDS: [
    { name: 'Free Treatment Add-On', description: 'Add a mask, serum boost, or LED session to any facial', cost: 500 },
    { name: '$25 Off Any Treatment', description: 'Apply $25 credit toward any single treatment booking', cost: 1000 },
    { name: 'Free Corrective Facial', description: 'A full 60-minute corrective facial — on us', cost: 2000 },
  ],

  // ─── Render ───────────────────────────────────────────
  render() {
    const container = document.getElementById('tab-rewards');
    if (!container) return;

    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderPointsHero()}
      ${this._renderEarnSection()}
      ${this._renderAvailableRewards()}
      ${this._renderHistory()}
      <div class="rewards-footer"></div>
    `;
  },

  // ─── Header ───────────────────────────────────────────
  _renderHeader() {
    return `
      <header class="rewards-header">
        <h1 class="rewards-header__title">My Glow Rewards</h1>
      </header>
    `;
  },

  // ─── Points Hero ──────────────────────────────────────
  _renderPointsHero() {
    const points = MOCK_USER.glowPoints;
    const nextAt = MOCK_USER.nextRewardAt;
    const remaining = nextAt - points;
    const progress = Math.min(points / nextAt, 1);

    // SVG circle math
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress);
    const percent = Math.round(progress * 100);

    return `
      <div class="rewards-hero">
        <div class="rewards-hero__points">${points}</div>
        <div class="rewards-hero__label">Glow Points</div>

        <div
          class="rewards-hero__progress"
          role="progressbar"
          aria-valuenow="${points}"
          aria-valuemin="0"
          aria-valuemax="${nextAt}"
          aria-label="${points} of ${nextAt} Glow Points"
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle class="rewards-hero__progress-track" cx="50" cy="50" r="${radius}" />
            <circle
              class="rewards-hero__progress-fill"
              cx="50" cy="50" r="${radius}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${dashOffset}"
            />
          </svg>
          <div class="rewards-hero__progress-text">${percent}%</div>
        </div>

        <p class="rewards-hero__next">${remaining > 0 ? `${remaining} points to next reward` : 'You have enough for a reward!'}</p>
        ${remaining > 0 ? `<p class="rewards-hero__visits">That's about ${Math.ceil(remaining / 100)} more visit${Math.ceil(remaining / 100) === 1 ? '' : 's'}</p>` : ''}
      </div>
    `;
  },

  // ─── How to Earn ──────────────────────────────────────
  _renderEarnSection() {
    const cards = this.EARN_ACTIONS.map((action) => `
      <div class="rewards-earn__card">
        <div class="rewards-earn__icon" aria-hidden="true">
          <i class="ph ${action.icon}"></i>
        </div>
        <span class="rewards-earn__text">${action.text}</span>
        <span class="rewards-earn__points-pill">${action.points}</span>
      </div>
    `).join('');

    return `
      <section class="rewards-earn" aria-label="How to earn points">
        <h2 class="rewards-section-title">How to Earn</h2>
        <div class="rewards-earn__list">
          ${cards}
        </div>
      </section>
    `;
  },

  // ─── Available Rewards ────────────────────────────────
  _renderAvailableRewards() {
    const userPoints = MOCK_USER.glowPoints;

    const cards = this.REWARDS.map((reward) => {
      const canRedeem = userPoints >= reward.cost;
      return `
        <div class="rewards-available__card">
          <div class="rewards-available__top">
            <div class="rewards-available__info">
              <p class="rewards-available__name">${reward.name}</p>
              <p class="rewards-available__desc">${reward.description}</p>
            </div>
            <span class="rewards-available__cost">${reward.cost} pts</span>
          </div>
          <button
            class="rewards-available__redeem"
            ${canRedeem ? '' : 'disabled'}
            ${canRedeem ? `onclick="alert('Reward redeemed! Show this screen to Ashley at your next visit. Your points balance has been updated.')"` : ''}
            aria-label="${canRedeem ? `Redeem ${reward.name} for ${reward.cost} points` : `Need ${reward.cost - userPoints} more points to redeem ${reward.name}`}"
          >
            ${canRedeem ? 'Redeem' : `Need ${reward.cost - userPoints} more pts`}
          </button>
        </div>
      `;
    }).join('');

    return `
      <section class="rewards-available" aria-label="Available rewards">
        <h2 class="rewards-section-title">Available Rewards</h2>
        <div class="rewards-available__list">
          ${cards}
        </div>
      </section>
    `;
  },

  // ─── History ──────────────────────────────────────────
  _renderHistory() {
    const rows = this.MOCK_HISTORY.map((item) => {
      const isEarned = item.type === 'earned';
      const iconClass = isEarned ? 'rewards-history__icon--earned' : 'rewards-history__icon--redeemed';
      const iconName = isEarned ? 'ph-arrow-up' : 'ph-arrow-down';
      const pointsClass = isEarned ? 'rewards-history__points--earned' : 'rewards-history__points--redeemed';
      const pointsDisplay = isEarned ? `+${item.points}` : `${item.points}`;

      return `
        <div class="rewards-history__row">
          <div class="rewards-history__icon ${iconClass}" aria-hidden="true">
            <i class="ph ${iconName}"></i>
          </div>
          <div class="rewards-history__details">
            <p class="rewards-history__desc">${item.description}</p>
            <p class="rewards-history__date">${item.date}</p>
          </div>
          <span class="rewards-history__points ${pointsClass}">${pointsDisplay}</span>
        </div>
      `;
    }).join('');

    return `
      <section class="rewards-history" aria-label="Recent activity">
        <h2 class="rewards-section-title">Recent Activity</h2>
        <div class="rewards-history__list">
          ${rows}
        </div>
      </section>
    `;
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    // No timers or event listeners to clean up
  },
};
