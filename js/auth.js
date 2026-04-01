/* =====================================================
   ROSIE'S BEAUTY SPA — AUTH MODULE
   Login, signup, password reset, confirmation views
   ===================================================== */

const Auth = {
  currentView: 'login',

  // ─── Show / Hide ──────────────────────────────────────
  show(view = 'login') {
    this.currentView = view;
    const authScreen = document.getElementById('auth-screen');
    const appEl = document.getElementById('app');
    if (authScreen) authScreen.classList.remove('hidden');
    if (appEl) appEl.classList.add('hidden');

    switch (view) {
      case 'signup': this._renderSignup(); break;
      case 'reset':  this._renderReset(); break;
      case 'confirm': this._renderConfirmation(); break;
      default:       this._renderLogin(); break;
    }
  },

  hide() {
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.classList.add('hidden');
  },

  // ─── Login View ───────────────────────────────────────
  _renderLogin() {
    const container = document.getElementById('auth-content');
    if (!container) return;

    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-card__logo-wrap">
          <img src="assets/images/rosies-logo.png" alt="Rosie's Beauty Spa" class="auth-card__logo" />
        </div>
        <h1 class="auth-card__tagline">Welcome Back</h1>
        <p class="auth-card__subtitle">Sign in to your account</p>

        <div class="auth-error-banner" id="auth-error" role="alert"></div>

        <form class="auth-form" id="auth-form" novalidate>
          <div class="auth-field">
            <label class="auth-field__label" for="auth-email">Email</label>
            <input
              class="auth-field__input"
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="auth-password">Password</label>
            <input
              class="auth-field__input"
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
            />
          </div>

          <div class="auth-forgot">
            <button type="button" class="auth-link" onclick="Auth.show('reset')">Forgot password?</button>
          </div>

          <button type="submit" class="auth-submit" id="auth-submit-btn">Sign In</button>
        </form>

        <div class="auth-divider">
          <span>or</span>
        </div>

        <button type="button" class="auth-guest-btn" id="auth-guest-btn" onclick="Auth._handleGuest()">
          <i class="ph ph-user" aria-hidden="true"></i>
          Continue as Guest
        </button>

        <div class="auth-link-row">
          <span>Don't have an account?</span>
          <button type="button" class="auth-link" onclick="Auth.show('signup')">Create one</button>
        </div>
      </div>
    `;

    document.getElementById('auth-form').addEventListener('submit', (e) => this._handleLogin(e));
  },

  // ─── Signup View ──────────────────────────────────────
  _renderSignup() {
    const container = document.getElementById('auth-content');
    if (!container) return;

    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-card__logo-wrap">
          <img src="assets/images/rosies-logo.png" alt="Rosie's Beauty Spa" class="auth-card__logo" />
        </div>
        <h1 class="auth-card__tagline">Join Rosie's</h1>
        <p class="auth-card__subtitle">Create your account to start earning Glow Points</p>

        <div class="auth-error-banner" id="auth-error" role="alert"></div>

        <form class="auth-form" id="auth-form" novalidate>
          <div class="auth-field">
            <label class="auth-field__label" for="auth-name">Name</label>
            <input
              class="auth-field__input"
              id="auth-name"
              type="text"
              placeholder="What should we call you?"
              autocomplete="given-name"
              required
            />
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="auth-email">Email</label>
            <input
              class="auth-field__input"
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="auth-password">Password</label>
            <input
              class="auth-field__input"
              id="auth-password"
              type="password"
              placeholder="At least 6 characters"
              autocomplete="new-password"
              minlength="6"
              required
            />
          </div>

          <div class="auth-field">
            <label class="auth-field__label" for="auth-confirm-password">Confirm Password</label>
            <input
              class="auth-field__input"
              id="auth-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              autocomplete="new-password"
              minlength="6"
              required
            />
          </div>

          <button type="submit" class="auth-submit" id="auth-submit-btn">Create Account</button>
        </form>

        <div class="auth-link-row">
          <span>Already have an account?</span>
          <button type="button" class="auth-link" onclick="Auth.show('login')">Sign in</button>
        </div>
      </div>
    `;

    document.getElementById('auth-form').addEventListener('submit', (e) => this._handleSignup(e));
  },

  // ─── Reset View ───────────────────────────────────────
  _renderReset() {
    const container = document.getElementById('auth-content');
    if (!container) return;

    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-card__logo-wrap">
          <img src="assets/images/rosies-logo.png" alt="Rosie's Beauty Spa" class="auth-card__logo" />
        </div>
        <h1 class="auth-card__tagline">Reset Password</h1>
        <p class="auth-card__subtitle">Enter your email and we'll send you a reset link</p>

        <div class="auth-error-banner" id="auth-error" role="alert"></div>

        <form class="auth-form" id="auth-form" novalidate>
          <div class="auth-field">
            <label class="auth-field__label" for="auth-email">Email</label>
            <input
              class="auth-field__input"
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <button type="submit" class="auth-submit" id="auth-submit-btn">Send Reset Link</button>
        </form>

        <div class="auth-link-row">
          <button type="button" class="auth-link" onclick="Auth.show('login')">Back to sign in</button>
        </div>
      </div>
    `;

    document.getElementById('auth-form').addEventListener('submit', (e) => this._handleReset(e));
  },

  // ─── Confirmation View ────────────────────────────────
  _renderConfirmation() {
    const container = document.getElementById('auth-content');
    if (!container) return;

    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-success">
          <div class="auth-success__icon">
            <i class="ph ph-envelope-simple" aria-hidden="true"></i>
          </div>
          <h1 class="auth-success__title">Check Your Email</h1>
          <p class="auth-success__text">
            We sent a confirmation link to your email address. Click the link to verify your account, then come back and sign in.
          </p>
          <button type="button" class="auth-submit" onclick="Auth.show('login')" style="max-width: 280px;">
            Back to Sign In
          </button>
        </div>
      </div>
    `;
  },

  // ─── Handlers ─────────────────────────────────────────
  async _handleLogin(e) {
    e.preventDefault();
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-submit-btn');
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    this._hideError(errorEl);
    this._setLoading(btn, true, 'Signing in...');

    try {
      await SupabaseData.signIn(email, password);
      // Auth state change listener in App will handle the rest
    } catch (err) {
      this._showError(errorEl, this._friendlyError(err.message));
      this._setLoading(btn, false, 'Sign In');
    }
  },

  async _handleSignup(e) {
    e.preventDefault();
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-submit-btn');
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const confirm = document.getElementById('auth-confirm-password').value;

    this._hideError(errorEl);

    if (password !== confirm) {
      this._showError(errorEl, 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      this._showError(errorEl, 'Password must be at least 6 characters.');
      return;
    }

    this._setLoading(btn, true, 'Creating account...');

    try {
      await SupabaseData.signUp(email, password, name);
      this.show('confirm');
    } catch (err) {
      this._showError(errorEl, this._friendlyError(err.message));
      this._setLoading(btn, false, 'Create Account');
    }
  },

  async _handleReset(e) {
    e.preventDefault();
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-submit-btn');
    const email = document.getElementById('auth-email').value.trim();

    this._hideError(errorEl);
    this._setLoading(btn, true, 'Sending...');

    try {
      await SupabaseData.resetPassword(email);
      if (typeof Modal !== 'undefined' && Modal.show) {
        Modal.show({
          title: 'Reset Link Sent',
          message: 'Check your email for a password reset link.',
          confirmText: 'OK',
        });
      }
      this._setLoading(btn, false, 'Send Reset Link');
    } catch (err) {
      this._showError(errorEl, this._friendlyError(err.message));
      this._setLoading(btn, false, 'Send Reset Link');
    }
  },

  async _handleGuest() {
    const btn = document.getElementById('auth-guest-btn');
    const errorEl = document.getElementById('auth-error');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="auth-spinner"></span> Entering as guest...';
    }
    this._hideError(errorEl);

    try {
      await SupabaseData.signInAnonymously();
      // Auth state change listener in App handles the rest
    } catch (err) {
      this._showError(errorEl, 'Guest sign-in is not available right now. Please create an account.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="ph ph-user" aria-hidden="true"></i> Continue as Guest';
      }
    }
  },

  // ─── UI Helpers ───────────────────────────────────────
  _setLoading(btn, loading, text) {
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
      ? `<span class="auth-spinner"></span> ${text}`
      : text;
  },

  _showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
  },

  _hideError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
  },

  _friendlyError(msg) {
    if (!msg) return 'Something went wrong. Please try again.';
    if (msg.includes('Invalid login'))    return 'Invalid email or password.';
    if (msg.includes('already registered')) return 'An account with this email already exists.';
    if (msg.includes('valid email'))      return 'Please enter a valid email address.';
    if (msg.includes('at least'))         return 'Password must be at least 6 characters.';
    if (msg.includes('rate limit'))       return 'Too many attempts. Please wait a moment.';
    return msg;
  },
};
