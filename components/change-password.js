// Change Password Component (for logged-in users)
let authService;

class ChangePassword extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
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
        background: #d1fae5;
        border: 1px solid #10b981;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
        font-size: 14px;
        color: #065f46;
        display: none;
      }

      .success-message.show {
        display: block;
      }

      :host-context(.dark) .success-message {
        background: #064e3b;
        border-color: #10b981;
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

      .password-requirements {
        background: #f3f4f6;
        border-radius: 6px;
        padding: 10px 12px;
        margin-bottom: 16px;
        font-size: 12px;
        color: #6b7280;
      }

      :host-context(.dark) .password-requirements {
        background: #3A3B3C;
        color: #9CA3AF;
      }

      .password-requirements ul {
        margin: 4px 0 0 0;
        padding-left: 20px;
      }

      .password-requirements li {
        margin: 2px 0;
      }

      .forgot-link {
        text-align: center;
        margin-top: 12px;
        font-size: 13px;
        color: #6b7280;
      }

      .forgot-link a {
        color: #6366f1;
        text-decoration: none;
        cursor: pointer;
      }

      .forgot-link a:hover {
        text-decoration: underline;
      }

      :host-context(.dark) .forgot-link a {
        color: #818cf8;
      }
    `;

    const markup = `
      <div class="modal-backdrop">
        <div class="modal-content" role="dialog" aria-modal="true">
          <button class="close-btn" aria-label="Close">×</button>
          
          <h2>Change Password</h2>
          <p class="subtitle">Enter your current password and choose a new one</p>
          
          <div class="success-message" id="success-message">
            Password changed successfully!
          </div>
          
          <form id="change-password-form">
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <input type="password" id="current-password" placeholder="Enter current password" autocomplete="current-password" required>
            </div>
            
            <div class="password-requirements">
              <strong>New password must:</strong>
              <ul>
                <li>Be at least 8 characters long</li>
                <li>Be different from current password</li>
              </ul>
            </div>
            
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input type="password" id="new-password" placeholder="At least 8 characters" autocomplete="new-password" required>
            </div>
            
            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <input type="password" id="confirm-password" placeholder="Re-enter new password" autocomplete="new-password" required>
            </div>
            
            <div class="error-message" id="error-message"></div>
            
            <button type="submit" class="btn" id="change-btn">
              <div class="spinner"></div>
              <span class="btn-text">Change Password</span>
            </button>
          </form>
          
          <div class="forgot-link">
            Forgot your password? <a id="forgot-link">Reset it here</a>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = `<style>${styles}</style>${markup}`;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
    const form = this.shadowRoot.getElementById('change-password-form');
    const forgotLink = this.shadowRoot.getElementById('forgot-link');
    
    closeBtn.addEventListener('click', () => this.close());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleChangePassword();
    });

    forgotLink.addEventListener('click', () => {
      this.close();
      // Open password reset modal
      import('./password-reset.js').then(() => {
        const passwordReset = document.createElement('password-reset');
        document.body.appendChild(passwordReset);
      });
    });

    // Escape key to close
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this._escHandler);
  }

  async handleChangePassword() {
    const currentPassword = this.shadowRoot.getElementById('current-password').value;
    const newPassword = this.shadowRoot.getElementById('new-password').value;
    const confirmPassword = this.shadowRoot.getElementById('confirm-password').value;
    const changeBtn = this.shadowRoot.getElementById('change-btn');
    
    // Validation
    if (!currentPassword) {
      this.showError('Please enter your current password');
      return;
    }

    if (!newPassword || !confirmPassword) {
      this.showError('Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 8) {
      this.showError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showError('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      this.showError('New password must be different from current password');
      return;
    }

    this.setLoading(changeBtn, true);
    this.hideError();

    try {
      await authService.changePassword(currentPassword, newPassword);
      
      // Show success message
      this.showSuccess();
      
      // Clear form
      this.shadowRoot.getElementById('change-password-form').reset();
      
      // Close after 2 seconds
      setTimeout(() => {
        this.close();
        this.dispatchEvent(new CustomEvent('password-changed'));
      }, 2000);
      
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.setLoading(changeBtn, false);
    }
  }

  showError(message) {
    const errorEl = this.shadowRoot.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }

  hideError() {
    const errorEl = this.shadowRoot.getElementById('error-message');
    errorEl.classList.remove('show');
  }

  showSuccess() {
    const successEl = this.shadowRoot.getElementById('success-message');
    successEl.classList.add('show');
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
    document.removeEventListener('keydown', this._escHandler);
    this.dispatchEvent(new CustomEvent('close'));
    this.remove();
  }
}

customElements.define('change-password', ChangePassword);
