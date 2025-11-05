class AuthModal extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 0.5rem;
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }
        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 500;
        }
        .tab.active {
          border-bottom: 2px solid #6366f1;
          color: #6366f1;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }
        button:hover {
          background-color: #4f46e5;
        }
        .close-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 10;
        }

        @media (min-width: 640px) {
          .close-btn {
            top: 1rem;
            right: 1rem;
          }
        }
</style>
      <div class="modal-backdrop">
        <div class="modal-content">
          <button class="close-btn">&times;</button>
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
            <button id="login-btn">Login</button>
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
            <button id="register-btn">Register</button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
      this.remove();
    });

    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.shadowRoot.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'login') {
          this.shadowRoot.querySelector('#login-form').style.display = 'block';
          this.shadowRoot.querySelector('#register-form').style.display = 'none';
        } else {
          this.shadowRoot.querySelector('#login-form').style.display = 'none';
          this.shadowRoot.querySelector('#register-form').style.display = 'block';
        }
      });
    });

    this.shadowRoot.querySelector('#login-btn').addEventListener('click', () => this.handleLogin());
    this.shadowRoot.querySelector('#register-btn').addEventListener('click', () => this.handleRegister());
  }

  handleLogin() {
    const email = this.shadowRoot.querySelector('#login-email').value;
    const password = this.shadowRoot.querySelector('#login-password').value;
    
    // TODO: Implement actual login logic
    console.log('Login attempt with:', email, password);
    localStorage.setItem('authToken', 'sample-token');
    this.remove();
    window.location.reload();
  }

  handleRegister() {
    const name = this.shadowRoot.querySelector('#register-name').value;
    const email = this.shadowRoot.querySelector('#register-email').value;
    const password = this.shadowRoot.querySelector('#register-password').value;
    const confirm = this.shadowRoot.querySelector('#register-confirm').value;
    
    // TODO: Implement actual registration logic
    console.log('Register attempt with:', name, email, password, confirm);
    localStorage.setItem('authToken', 'sample-token');
    this.remove();
    window.location.reload();
  }
}

customElements.define('auth-modal', AuthModal);