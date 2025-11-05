// Single, clean AuthModal web component implementation
// Dark-mode aware via :host-context(.dark)

class AuthModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
              <input type="email" id="login-email" placeholder="your@email.com">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" placeholder="••••••••">
            </div>
            <button class="btn" id="login-btn">Login</button>
          </div>

          <div id="register-form" style="display: none;">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input type="text" id="register-name" placeholder="Your name">
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" placeholder="your@email.com">
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label for="register-confirm">Confirm Password</label>
              <input type="password" id="register-confirm" placeholder="••••••••">
            </div>
            <button class="btn" id="register-btn">Register</button>
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
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const isLogin = tab.dataset.tab === 'login';
        this.shadowRoot.querySelector('#login-form').style.display = isLogin ? 'block' : 'none';
        this.shadowRoot.querySelector('#register-form').style.display = isLogin ? 'none' : 'block';
      });
    });

    loginBtn?.addEventListener('click', () => this.handleLogin());
    registerBtn?.addEventListener('click', () => this.handleRegister());

    // Setup escape key handler
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.closeModal();
    };
    document.addEventListener('keydown', this._escHandler);
  }

  handleLogin() {
    const email = this.shadowRoot.querySelector('#login-email').value.trim();
    const password = this.shadowRoot.querySelector('#login-password').value;
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Simulate login - in real app, call your auth API here
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    this.closeModal();
    window.location.reload();
  }

  handleRegister() {
    const name = this.shadowRoot.querySelector('#register-name').value.trim();
    const email = this.shadowRoot.querySelector('#register-email').value.trim();
    const password = this.shadowRoot.querySelector('#register-password').value;
    const confirm = this.shadowRoot.querySelector('#register-confirm').value;
    
    if (!name || !email || !password || !confirm) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    // Simulate registration - in real app, call your auth API here
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    this.closeModal();
    window.location.reload();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._escHandler);
  }

  closeModal() {
    document.removeEventListener('keydown', this._escHandler);
    this.remove();
  }
}

// Register the custom element
if (!customElements.get('auth-modal')) {
  customElements.define('auth-modal', AuthModal);
}
