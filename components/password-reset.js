// Password Reset Component
let authService;

class PasswordReset extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentStep = 'email'; // email, code, newPassword, success
    this.email = '';
    this.resetCode = '';
    
    // Load auth service
    import('../js/auth-service.js').then(module => {
      authService = module.default;
    }).catch(error => {
      console.error('Failed to load auth service:', error);
    });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const styles = `
      :host { all: initial; }
      :host * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
      
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }

      .modal-content {
        background: #fff;
        color: #111827;
        width: 92%;
        max-width: 420px;
        border-radius: 10px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.2);
        position: relative;
      }
      
      :host-context(.dark) .modal-content {
        background: #242526;
        color: #E4E6EB;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      }

      .close-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid #e5e7eb;
        background: #fff;
        color: #6b7280;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.3s ease;
      }

      .close-btn:hover {
        color: #374151;
        background: #f3f4f6;
      }

      :host-context(.dark) .close-btn {
        background: #242526;
        border-color: #3A3B3C;
        color: #9CA3AF;
      }

      :host-context(.dark) .close-btn:hover {
        color: #E4E6EB;
        background: #3A3B3C;
      }

      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 700;
        color: inherit;
      }

      .subtitle {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 20px;
      }

      :host-context(.dark) .subtitle {
        color: #9CA3AF;
      }

      .form-group {
        margin-bottom: 16px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 500;
        color: inherit;
      }

      input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background: #fff;
        color: #111827;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      input:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      input::placeholder {
        color: #9CA3AF;
      }

      :host-context(.dark) input {
        background: #3A3B3C;
        border-color: #3A3B3C;
        color: #E4E6EB;
      }

      :host-context(.dark) input:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
      }

      :host-context(.dark) input::placeholder {
        color: #6B7280;
      }

      .code-input {
        text-align: center;
        font-size: 24px;
        letter-spacing: 8px;
        font-weight: 600;
      }

      button.btn {
        width: 100%;
        padding: 12px 16px;
        border-radius: 8px;
        background: #6366f1;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: background-color 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button.btn:hover:not(:disabled) {
        background: #4f46e5;
      }

      button.btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      :host-context(.dark) button.btn {
        background: #818cf8;
      }

      :host-context(.dark) button.btn:hover:not(:disabled) {
        background: #6366f1;
      }

      .btn-secondary {
        background: transparent;
        color: #6366f1;
        border: 1px solid #6366f1;
        margin-top: 8px;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #f3f4f6;
      }

      :host-context(.dark) .btn-secondary {
        color: #818cf8;
        border-color: #818cf8;
      }

      :host-context(.dark) .btn-secondary:hover:not(:disabled) {
        background: #3A3B3C;
      }

      .error-message {
        color: #ef4444;
        font-size: 13px;
        margin-top: 8px;
        display: none;
      }

      .error-message.show {
        display: block;
      }

      :host-context(.dark) .error-message {
        color: #f87171;
      }

      .success-message {
        color: #10b981;
        font-size: 13px;
        margin-top: 8px;
        display: none;
      }

      .success-message.show {
        display: block;
      }

      :host-context(.dark) .success-message {
        color: #34d399;
      }

      .spinner {
        display: none;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .loading .spinner {
        display: inline-block;
      }

      .dev-note {
        background: #fef3c7;
        border: 1px solid #fbbf24;
        border-radius: 6px;
        padding: 10px 12px;
        margin-top: 12px;
        font-size: 12px;
        color: #92400e;
      }

      :host-context(.dark) .dev-note {
        background: #451a03;
        border-color: #78350f;
        color: #fbbf24;
      }

      .success-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: white;
      }

      .step {
        display: none;
      }

      .step.active {
        display: block;
      }
    `;

    const markup = `
      <div class="modal-backdrop">
        <div class="modal-content" role="dialog" aria-modal="true">
          <button class="close-btn" aria-label="Close">×</button>
          
          <!-- Step 1: Enter Email -->
          <div class="step active" id="step-email">
            <h2>Reset Password</h2>
            <p class="subtitle">Enter your email address and we'll send you a reset code</p>
            
            <div class="form-group">
              <label for="reset-email">Email Address</label>
              <input type="email" id="reset-email" placeholder="your@email.com" autocomplete="email">
            </div>
            
            <div class="error-message" id="email-error"></div>
            
            <button class="btn" id="send-code-btn">
              <div class="spinner"></div>
              <span class="btn-text">Send Reset Code</span>
            </button>
            
            <button class="btn btn-secondary" id="back-to-login-btn">
              Back to Login
            </button>
          </div>

          <!-- Step 2: Enter Code -->
          <div class="step" id="step-code">
            <h2>Enter Reset Code</h2>
            <p class="subtitle">We've sent a 6-digit code to <strong id="email-display"></strong></p>
            
            <div class="form-group">
              <label for="reset-code">Reset Code</label>
              <input type="text" id="reset-code" class="code-input" placeholder="000000" maxlength="6" inputmode="numeric">
            </div>
            
            <div id="dev-code-display" class="dev-note" style="display: none;">
              <strong>Development Mode:</strong> Your reset code is: <strong id="dev-code"></strong>
            </div>
            
            <div class="error-message" id="code-error"></div>
            
            <button class="btn" id="verify-code-btn">
              <div class="spinner"></div>
              <span class="btn-text">Verify Code</span>
            </button>
            
            <button class="btn btn-secondary" id="resend-code-btn">
              Resend Code
            </button>
          </div>

          <!-- Step 3: Enter New Password -->
          <div class="step" id="step-password">
            <h2>Create New Password</h2>
            <p class="subtitle">Enter a new password for your account</p>
            
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input type="password" id="new-password" placeholder="At least 8 characters" autocomplete="new-password">
            </div>
            
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" placeholder="Re-enter password" autocomplete="new-password">
            </div>
            
            <div class="error-message" id="password-error"></div>
            
            <button class="btn" id="reset-password-btn">
              <div class="spinner"></div>
              <span class="btn-text">Reset Password</span>
            </button>
          </div>

          <!-- Step 4: Success -->
          <div class="step" id="step-success">
            <div class="success-icon">✓</div>
            <h2 style="text-align: center;">Password Reset!</h2>
            <p class="subtitle" style="text-align: center;">Your password has been successfully reset</p>
            
            <button class="btn" id="login-now-btn">
              Login Now
            </button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = `<style>${styles}</style>${markup}`;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
    
    closeBtn.addEventListener('click', () => this.close());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    // Step 1: Send code
    const sendCodeBtn = this.shadowRoot.getElementById('send-code-btn');
    sendCodeBtn.addEventListener('click', () => this.handleSendCode());
    
    const backToLoginBtn = this.shadowRoot.getElementById('back-to-login-btn');
    backToLoginBtn.addEventListener('click', () => this.close());

    // Step 2: Verify code
    const verifyCodeBtn = this.shadowRoot.getElementById('verify-code-btn');
    verifyCodeBtn.addEventListener('click', () => this.handleVerifyCode());
    
    const resendCodeBtn = this.shadowRoot.getElementById('resend-code-btn');
    resendCodeBtn.addEventListener('click', () => this.handleSendCode());

    // Step 3: Reset password
    const resetPasswordBtn = this.shadowRoot.getElementById('reset-password-btn');
    resetPasswordBtn.addEventListener('click', () => this.handleResetPassword());

    // Step 4: Login
    const loginNowBtn = this.shadowRoot.getElementById('login-now-btn');
    loginNowBtn.addEventListener('click', () => {
      this.close();
      this.dispatchEvent(new CustomEvent('login-requested'));
    });

    // Enter key handling
    const emailInput = this.shadowRoot.getElementById('reset-email');
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendCode();
    });

    const codeInput = this.shadowRoot.getElementById('reset-code');
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleVerifyCode();
    });

    const confirmPasswordInput = this.shadowRoot.getElementById('confirm-password');
    confirmPasswordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleResetPassword();
    });
  }

  async handleSendCode() {
    const emailInput = this.shadowRoot.getElementById('reset-email');
    const sendCodeBtn = this.shadowRoot.getElementById('send-code-btn');
    const errorMsg = this.shadowRoot.getElementById('email-error');
    
    const email = emailInput.value.trim();
    
    if (!email) {
      this.showError('email-error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      this.showError('email-error', 'Please enter a valid email address');
      return;
    }

    this.setLoading(sendCodeBtn, true);
    this.hideError('email-error');

    try {
      const result = await authService.requestPasswordReset(email);
      this.email = email;
      
      // Store the code if provided (development mode)
      if (result.resetCode) {
        this.resetCode = result.resetCode;
        const devCodeDisplay = this.shadowRoot.getElementById('dev-code-display');
        const devCode = this.shadowRoot.getElementById('dev-code');
        devCode.textContent = result.resetCode;
        devCodeDisplay.style.display = 'block';
      }
      
      // Move to code step
      this.goToStep('code');
      this.shadowRoot.getElementById('email-display').textContent = email;
      
    } catch (error) {
      this.showError('email-error', error.message);
    } finally {
      this.setLoading(sendCodeBtn, false);
    }
  }

  async handleVerifyCode() {
    const codeInput = this.shadowRoot.getElementById('reset-code');
    const verifyCodeBtn = this.shadowRoot.getElementById('verify-code-btn');
    
    const code = codeInput.value.trim();
    
    if (!code || code.length !== 6) {
      this.showError('code-error', 'Please enter the 6-digit code');
      return;
    }

    this.setLoading(verifyCodeBtn, true);
    this.hideError('code-error');

    try {
      await authService.verifyResetCode(this.email, code);
      this.resetCode = code;
      
      // Move to password step
      this.goToStep('password');
      
    } catch (error) {
      this.showError('code-error', error.message);
    } finally {
      this.setLoading(verifyCodeBtn, false);
    }
  }

  async handleResetPassword() {
    const newPasswordInput = this.shadowRoot.getElementById('new-password');
    const confirmPasswordInput = this.shadowRoot.getElementById('confirm-password');
    const resetPasswordBtn = this.shadowRoot.getElementById('reset-password-btn');
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!newPassword || !confirmPassword) {
      this.showError('password-error', 'Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 8) {
      this.showError('password-error', 'Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showError('password-error', 'Passwords do not match');
      return;
    }

    this.setLoading(resetPasswordBtn, true);
    this.hideError('password-error');

    try {
      await authService.resetPassword(this.email, this.resetCode, newPassword);
      
      // Move to success step
      this.goToStep('success');
      
    } catch (error) {
      this.showError('password-error', error.message);
    } finally {
      this.setLoading(resetPasswordBtn, false);
    }
  }

  goToStep(step) {
    this.currentStep = step;
    const steps = this.shadowRoot.querySelectorAll('.step');
    steps.forEach(s => s.classList.remove('active'));
    this.shadowRoot.getElementById(`step-${step}`).classList.add('active');
  }

  showError(id, message) {
    const errorEl = this.shadowRoot.getElementById(id);
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }

  hideError(id) {
    const errorEl = this.shadowRoot.getElementById(id);
    errorEl.classList.remove('show');
  }

  setLoading(button, loading) {
    if (loading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  close() {
    this.dispatchEvent(new CustomEvent('close'));
    this.remove();
  }
}

customElements.define('password-reset', PasswordReset);
