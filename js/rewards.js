/* =====================================================
   ROSIE'S BEAUTY SPA — REWARDS TAB MODULE
   Points hero, earn actions, available rewards, history
   ===================================================== */

const Rewards = {
  rewardsHistory: [],

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
  async render() {
    const container = document.getElementById('tab-rewards');
    if (!container) return;

    // Fetch real history from Supabase
    try {
      this.rewardsHistory = await SupabaseData.getRewardsHistory(App.currentUser.id);
    } catch (err) {
      console.warn('[Rewards] Failed to fetch history:', err);
      this.rewardsHistory = [];
    }

    container.innerHTML = `
      ${this._renderHeader()}
      ${this._renderPointsHero()}
      ${this._renderEarnSection()}
      ${this._renderAvailableRewards()}
      ${this._renderHistory()}
      <div class="rewards-footer"></div>
    `;
  },

  // ─── Next Reward Tier Helper ──────────────────────────
  _getNextRewardTier(points) {
    if (points < 500) return 500;
    if (points < 1000) return 1000;
    return 2000;
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
    const points = App.currentProfile.glow_points || 0;
    const nextAt = this._getNextRewardTier(points);
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
    const userPoints = App.currentProfile.glow_points || 0;

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
            ${canRedeem ? `onclick="Rewards._handleRedeem(${reward.cost}, '${reward.name.replace(/'/g, "\\'")}')"` : ''}
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

  // ─── Handle Redeem ────────────────────────────────────
  async _handleRedeem(cost, rewardName) {
    const safeRewardName = escHtml(rewardName);
    try {
      await SupabaseData.redeemReward(App.currentUser.id, cost, safeRewardName);

      // Refresh profile so points are current
      App.currentProfile = await SupabaseData.getProfile(App.currentUser.id);

      // Confetti + success modal
      Animations.confetti(document.querySelector('.rewards-hero'));
      Modal.show({
        title: 'Reward Redeemed!',
        message: 'Show this screen to Ashley at your next visit. Your points balance has been updated.',
        type: 'success',
        confirmText: 'Got It',
      });

      // Re-render tab with updated data
      await this.render();
    } catch (err) {
      console.error('[Rewards] Redemption failed:', err);
      Modal.show({
        title: 'Redemption Failed',
        message: 'Something went wrong. Please try again.',
        type: 'error',
        confirmText: 'OK',
      });
    }
  },

  // ─── History ──────────────────────────────────────────
  _renderHistory() {
    let content;

    if (!this.rewardsHistory || this.rewardsHistory.length === 0) {
      content = `
        <p class="rewards-history__empty">Your rewards activity will appear here after your first visit.</p>
      `;
    } else {
      content = `
        <div class="rewards-history__list">
          ${this.rewardsHistory.map((item) => {
            const isEarned = item.type === 'earned';
            const iconClass = isEarned ? 'rewards-history__icon--earned' : 'rewards-history__icon--redeemed';
            const iconName = isEarned ? 'ph-arrow-up' : 'ph-arrow-down';
            const pointsClass = isEarned ? 'rewards-history__points--earned' : 'rewards-history__points--redeemed';
            const pointsDisplay = isEarned ? `+${item.points}` : `${item.points}`;
            const dateLabel = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return `
              <div class="rewards-history__row">
                <div class="rewards-history__icon ${iconClass}" aria-hidden="true">
                  <i class="ph ${iconName}"></i>
                </div>
                <div class="rewards-history__details">
                  <p class="rewards-history__desc">${escHtml(item.description)}</p>
                  <p class="rewards-history__date">${dateLabel}</p>
                </div>
                <span class="rewards-history__points ${pointsClass}">${pointsDisplay}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <section class="rewards-history" aria-label="Recent activity">
        <h2 class="rewards-section-title">Recent Activity</h2>
        ${content}
      </section>
    `;
  },

  // ─── Destroy ──────────────────────────────────────────
  destroy() {
    // No timers or event listeners to clean up
  },
};
