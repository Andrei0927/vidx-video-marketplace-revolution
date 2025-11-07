// Single, clean AuthModal web component implementation
// Dark-mode aware via :host-context(.dark)
let authService;

class AuthModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isLoading = false;
    
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
    // Define styles with dark mode support via :host-context(.dark)
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
        padding: 20px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.2);
        position: relative;
      }
      
      :host-context(.dark) .modal-content {
        background: #242526;
        color: #E4E6EB;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      }

      .tabs {
        display: flex;
        gap: 8px;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 8px;
        margin-bottom: 14px;
      }
      
      :host-context(.dark) .tabs {
        border-bottom-color: #3A3B3C;
      }

      .tab {
        padding: 6px 10px;
        cursor: pointer;
        font-weight: 600;
        color: inherit;
        transition: color 0.3s ease;
      }
      
      .tab.active {
        border-bottom: 2px solid #6366f1;
        color: #6366f1;
      }
      
      :host-context(.dark) .tab.active {
        border-bottom-color: #818cf8;
        color: #818cf8;
      }

      .form-group {
        margin-bottom: 12px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        color: inherit;
      }

      input {
        width: 100%;
        padding: 8px 10px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background: #fff;
        color: #111827;
        transition: background-color 0.3s ease, border-color 0.3s ease;
      }

      input::placeholder {
        color: #9CA3AF;
      }

      :host-context(.dark) input {
        background: #242526;
        border-color: #3A3B3C;
        color: #E4E6EB;
      }

      :host-context(.dark) input::placeholder {
        color: #6B7280;
      }

      button.btn {
        width: 100%;
        padding: 10px 12px;
        border-radius: 8px;
        background: #6366f1;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.15s ease;
      }

      button.btn:hover {
        background: #4f46e5;
      }

      :host-context(.dark) button.btn {
        background: #818cf8;
      }

      :host-context(.dark) button.btn:hover {
        background: #6366f1;
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

      .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: none;
      }

      :host-context(.dark) .error-message {
        color: #f87171;
      }

      button.btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button.btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
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

      .loading .btn-text {
        opacity: 0.7;
      }
    `;

    // Define markup
    const markup = `
      <div class="modal-backdrop">
        <div class="modal-content" role="dialog" aria-modal="true">
          <button class="close-btn" aria-label="Close">×</button>
          
          <div class="tabs">
            <div class="tab active" data-tab="login">Login</div>
            <div class="tab" data-tab="register">Register</div>
          </div>

          <div id="login-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" placeholder="your@email.com" autocomplete="email">
              <div class="error-message" id="login-email-error"></div>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" placeholder="••••••••" autocomplete="current-password">
              <div class="error-message" id="login-password-error"></div>
            </div>
            <button class="btn" id="login-btn">
              <div class="spinner"></div>
              <span class="btn-text">Login</span>
            </button>
            <div class="error-message" id="login-error"></div>
          </div>

          <div id="register-form" style="display: none;">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input type="text" id="register-name" placeholder="Your name" autocomplete="name">
              <div class="error-message" id="register-name-error"></div>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" placeholder="your@email.com" autocomplete="email">
              <div class="error-message" id="register-email-error"></div>
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" placeholder="••••••••" autocomplete="new-password">
              <div class="error-message" id="register-password-error"></div>
            </div>
            <div class="form-group">
              <label for="register-confirm">Confirm Password</label>
              <input type="password" id="register-confirm" placeholder="••••••••" autocomplete="new-password">
              <div class="error-message" id="register-confirm-error"></div>
            </div>
            <button class="btn" id="register-btn">
              <div class="spinner"></div>
              <span class="btn-text">Register</span>
            </button>
            <div class="error-message" id="register-error"></div>
          </div>
        </div>
      </div>
    `;

    // Set the shadow DOM content
    this.shadowRoot.innerHTML = `<style>${styles}</style>${markup}`;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const modalBackdrop = this.shadowRoot.querySelector('.modal-backdrop');
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    const loginBtn = this.shadowRoot.querySelector('#login-btn');
    const registerBtn = this.shadowRoot.querySelector('#register-btn');

    closeBtn?.addEventListener('click', () => this.closeModal());
    modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        this.closeModal();
      }
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (this.isLoading) return;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const isLogin = tab.dataset.tab === 'login';
        this.shadowRoot.querySelector('#login-form').style.display = isLogin ? 'block' : 'none';
        this.shadowRoot.querySelector('#register-form').style.display = isLogin ? 'none' : 'block';
        
        // Clear any errors when switching tabs
        this.clearErrors();
      });
    });

    loginBtn?.addEventListener('click', () => this.handleLogin());
    registerBtn?.addEventListener('click', () => this.handleRegister());

    // Add keyboard support
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const activeTab = this.shadowRoot.querySelector('.tab.active');
        if (activeTab?.dataset.tab === 'login') {
          this.handleLogin();
        } else {
          this.handleRegister();
        }
      }
    });

    // Setup escape key handler
    this._escHandler = (e) => {
      if (e.key === 'Escape' && !this.isLoading) this.closeModal();
    };
    document.addEventListener('keydown', this._escHandler);
  }

  async handleLogin() {
    try {
      this.clearErrors();
      
      const email = this.shadowRoot.querySelector('#login-email').value.trim();
      const password = this.shadowRoot.querySelector('#login-password').value;
      
      // Validate inputs
      let hasError = false;
      
      if (!email) {
        this.showError('login-email-error', 'Email is required');
        hasError = true;
      } else if (!this.isValidEmail(email)) {
        this.showError('login-email-error', 'Please enter a valid email');
        hasError = true;
      }
      
      if (!password) {
        this.showError('login-password-error', 'Password is required');
        hasError = true;
      }
      
      if (hasError) return;

      this.setLoading(true);
      const result = await authService.login(email, password);
      
      console.log('Login result:', result);
      
      const { user, profile, session } = result;
      
      console.log('User:', user);
      console.log('Profile:', profile);
      console.log('Session:', session);
      
      // Store session and user info
      localStorage.setItem('sessionToken', session);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userAvatar', profile.avatar);
      
      console.log('Stored in localStorage:', {
        sessionToken: localStorage.getItem('sessionToken'),
        userId: localStorage.getItem('userId'),
        userEmail: localStorage.getItem('userEmail'),
        userName: localStorage.getItem('userName'),
        userAvatar: localStorage.getItem('userAvatar')
      });

      this.closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      this.showError('login-error', error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async handleRegister() {
    try {
      this.clearErrors();
      
      const name = this.shadowRoot.querySelector('#register-name').value.trim();
      const email = this.shadowRoot.querySelector('#register-email').value.trim();
      const password = this.shadowRoot.querySelector('#register-password').value;
      const confirm = this.shadowRoot.querySelector('#register-confirm').value;
      
      // Validate inputs
      let hasError = false;
      
      if (!name) {
        this.showError('register-name-error', 'Name is required');
        hasError = true;
      }
      
      if (!email) {
        this.showError('register-email-error', 'Email is required');
        hasError = true;
      } else if (!this.isValidEmail(email)) {
        this.showError('register-email-error', 'Please enter a valid email');
        hasError = true;
      }
      
      if (!password) {
        this.showError('register-password-error', 'Password is required');
        hasError = true;
      } else if (password.length < 8) {
        this.showError('register-password-error', 'Password must be at least 8 characters');
        hasError = true;
      }
      
      if (!confirm) {
        this.showError('register-confirm-error', 'Please confirm your password');
        hasError = true;
      } else if (password !== confirm) {
        this.showError('register-confirm-error', 'Passwords do not match');
        hasError = true;
      }
      
      if (hasError) return;

      this.setLoading(true);
      const result = await authService.register({ name, email, password });
      
      console.log('Registration result:', result);
      
      // Extract user, profile, and token from registration response
      const { user, profile, token } = result;
      
      console.log('User:', user);
      console.log('Profile:', profile);
      console.log('Token:', token);
      
      // Store session and user info
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userAvatar', profile.avatar);
      
      console.log('Stored in localStorage:', {
        sessionToken: localStorage.getItem('sessionToken'),
        userId: localStorage.getItem('userId'),
        userEmail: localStorage.getItem('userEmail'),
        userName: localStorage.getItem('userName'),
        userAvatar: localStorage.getItem('userAvatar')
      });

      this.closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Registration error:', error);
      this.showError('register-error', error.message);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    
    const loginBtn = this.shadowRoot.querySelector('#login-btn');
    const registerBtn = this.shadowRoot.querySelector('#register-btn');
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    
    [loginBtn, registerBtn].forEach(btn => {
      if (btn) {
        btn.disabled = loading;
        btn.classList.toggle('loading', loading);
      }
    });
    
    tabs.forEach(tab => {
      tab.style.pointerEvents = loading ? 'none' : 'auto';
      tab.style.opacity = loading ? '0.7' : '1';
    });
  }

  showError(elementId, message) {
    const errorElement = this.shadowRoot.querySelector(`#${elementId}`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  clearErrors() {
    const errorElements = this.shadowRoot.querySelectorAll('.error-message');
    errorElements.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._escHandler);
  }

  closeModal() {
    if (!this.isLoading) {
      document.removeEventListener('keydown', this._escHandler);
      this.remove();
    }
  }
}

// Register the custom element
if (!customElements.get('auth-modal')) {
  customElements.define('auth-modal', AuthModal);
}
