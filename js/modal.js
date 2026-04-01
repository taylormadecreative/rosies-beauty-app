/* =====================================================
   ROSIE'S BEAUTY SPA — BRANDED MODAL SYSTEM
   Replaces all native alert()/confirm() with branded UI
   ===================================================== */

const Modal = {

  _overlay: null,

  /**
   * Show a branded modal dialog.
   * @param {Object} opts
   * @param {string} opts.title       - Heading text
   * @param {string} [opts.message]   - Body text
   * @param {string} [opts.confirmText='OK'] - Primary button label
   * @param {string} [opts.cancelText]       - Secondary button label (omit for single-button)
   * @param {Function} [opts.onConfirm]      - Callback on confirm
   * @param {string} [opts.type='confirm']   - 'success' | 'confirm' | 'warning'
   */
  show({ title, message, confirmText = 'OK', cancelText, onConfirm, type = 'confirm' }) {
    // Store previous focus for restoration
    this._previousFocus = document.activeElement;

    // Remove any existing modal
    this.hide();

    const iconMap = {
      success: 'ph-check-circle',
      confirm: 'ph-question',
      warning: 'ph-warning-circle',
    };
    const iconClass = iconMap[type] || iconMap.confirm;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);

    overlay.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-card modal-card--${type}">
        <div class="modal-icon modal-icon--${type}" aria-hidden="true">
          <i class="ph ${iconClass}"></i>
        </div>
        <h3 class="modal-title">${title}</h3>
        ${message ? `<p class="modal-message">${message}</p>` : ''}
        <div class="modal-actions">
          ${cancelText ? `<button class="modal-btn modal-btn--cancel">${cancelText}</button>` : ''}
          <button class="modal-btn modal-btn--${type === 'warning' ? 'danger' : 'primary'}">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this._overlay = overlay;

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('visible'));

    // Bind events
    const confirmBtn = overlay.querySelector(`.modal-btn--${type === 'warning' ? 'danger' : 'primary'}`);
    const cancelBtn = overlay.querySelector('.modal-btn--cancel');
    const backdrop = overlay.querySelector('.modal-backdrop');

    confirmBtn.addEventListener('click', () => {
      this.hide();
      if (onConfirm) onConfirm();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.hide());
    }

    backdrop.addEventListener('click', () => this.hide());

    // Escape key + focus trap
    this._escHandler = (e) => {
      if (e.key === 'Escape') { this.hide(); return; }
      if (e.key === 'Tab') {
        const focusable = overlay.querySelectorAll('button:not([disabled])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', this._escHandler);

    // Fire confetti for success type
    if (type === 'success') {
      setTimeout(() => {
        const card = overlay.querySelector('.modal-card');
        if (card && typeof Animations !== 'undefined') {
          Animations.confetti(card, 8);
        }
      }, 150);
    }

    // Focus the confirm button
    confirmBtn.focus();
  },

  hide() {
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
    if (this._overlay) {
      this._overlay.classList.remove('visible');
      const overlay = this._overlay;
      this._overlay = null;
      setTimeout(() => overlay.remove(), 250);
    }
    // Restore focus to the element that opened the modal
    if (this._previousFocus && typeof this._previousFocus.focus === 'function') {
      this._previousFocus.focus();
      this._previousFocus = null;
    }
  },
};
