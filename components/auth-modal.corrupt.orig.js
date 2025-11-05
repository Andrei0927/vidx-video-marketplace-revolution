// Single, clean AuthModal web component (dark-mode aware via :host-context(.dark)).
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
    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; }
        :host * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; }
        .modal-content { background: #fff; color: #111827; width: 92%; max-width: 420px; border-radius: 10px; padding: 20px; box-shadow: 0 10px 30px rgba(2,6,23,0.2); position: relative; }
        :host-context(.dark) .modal-content { background: #242526; color: #E4E6EB; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
        .tabs { display:flex; gap:8px; border-bottom:1px solid #e5e7eb; padding-bottom:8px; margin-bottom:14px; }
        :host-context(.dark) .tabs { border-bottom-color:#3A3B3C; }
        .tab { padding:6px 10px; cursor:pointer; font-weight:600; }
        .tab.active { border-bottom:2px solid #6366f1; color:#6366f1; }
        :host-context(.dark) .tab.active { border-bottom-color:#818cf8; color:#818cf8; }
        .form-group { margin-bottom:12px; }
        label { display:block; margin-bottom:6px; font-size:13px; }
        input { width:100%; padding:8px 10px; border-radius:6px; border:1px solid #d1d5db; background:#fff; color:#111827; }
        input::placeholder { color:#9CA3AF; }
        :host-context(.dark) input { background:#242526; border-color:#3A3B3C; color:#E4E6EB; }
        :host-context(.dark) input::placeholder { color:#6B7280; }
        .btn { width:100%; padding:10px 12px; border-radius:8px; background:#6366f1; color:#fff; border:none; cursor:pointer; font-weight:600; }
        .btn:hover { filter:brightness(.95); }
        :host-context(.dark) .btn { background:#818cf8; }
        .close-btn { position:absolute; top:-10px; right:-10px; width:28px; height:28px; border-radius:50%; border:1px solid #e5e7eb; background:#fff; color:#6b7280; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        :host-context(.dark) .close-btn { background:#242526; border-color:#3A3B3C; color:#9CA3AF; }
      </style>
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
              <input id="login-email" type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input id="login-password" type="password" placeholder="••••••••">
            </div>
            <button id="login-btn" class="btn">Login</button>
          </div>
          <div id="register-form" style="display:none;">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input id="register-name" type="text" placeholder="Your name">
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input id="register-email" type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input id="register-password" type="password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label for="register-confirm">Confirm</label>
              <input id="register-confirm" type="password" placeholder="••••••••">
            </div>
            <button id="register-btn" class="btn">Register</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
    const tabs = this.shadowRoot.querySelectorAll('.tab');

    closeBtn?.addEventListener('click', () => this.closeModal());
    backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) this.closeModal(); });

    tabs.forEach(t => t.addEventListener('click', (e) => {
      tabs.forEach(x => x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const isLogin = e.currentTarget.dataset.tab === 'login';
      this.shadowRoot.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
      this.shadowRoot.getElementById('register-form').style.display = isLogin ? 'none' : 'block';
    }));

    const loginBtn = this.shadowRoot.getElementById('login-btn');
    const registerBtn = this.shadowRoot.getElementById('register-btn');

    loginBtn?.addEventListener('click', () => this.handleLogin());
    registerBtn?.addEventListener('click', () => this.handleRegister());

    this._escHandler = (e) => { if (e.key === 'Escape') this.closeModal(); };
    document.addEventListener('keydown', this._escHandler);
  }

  handleLogin() {
    const email = this.shadowRoot.getElementById('login-email').value.trim();
    const password = this.shadowRoot.getElementById('login-password').value;
    if (!email || !password) { alert('Please fill in all fields'); return; }
    localStorage.setItem('authToken', 'sample-token');
    this.closeModal();
    window.location.reload();
  }

  handleRegister() {
    const name = this.shadowRoot.getElementById('register-name').value.trim();
    const email = this.shadowRoot.getElementById('register-email').value.trim();
    const password = this.shadowRoot.getElementById('register-password').value;
    const confirm = this.shadowRoot.getElementById('register-confirm').value;
    if (!name || !email || !password || !confirm) { alert('Please fill in all fields'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    localStorage.setItem('authToken', 'sample-token');
    localStorage.setItem('userName', name);
    this.closeModal();
    window.location.reload();
  }

  closeModal() {
    document.removeEventListener('keydown', this._escHandler);
    this.remove();
  }
}

if (!customElements.get('auth-modal')) customElements.define('auth-modal', AuthModal);

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    // Simple, robust styles. Dark mode handled by :host-context(.dark)
    this.shadowRoot.innerHTML = `
      <style>
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
          background: #ffffff;
          color: #111827;
          width: 92%;
          max-width: 420px;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.2);
        }

        :host-context(.dark) .modal-content {
          background: #242526;
          color: #E4E6EB;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }

        .tabs { display: flex; gap: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 14px; }
        :host-context(.dark) .tabs { border-bottom-color: #3A3B3C; }

        .tab { padding: 6px 10px; cursor: pointer; font-weight: 600; color: inherit; }
        .tab.active { border-bottom: 2px solid #6366f1; color: #6366f1; }
        :host-context(.dark) .tab.active { border-bottom-color: #818cf8; color: #818cf8; }

        .form-group { margin-bottom: 12px; }
        label { display:block; margin-bottom:6px; font-size:13px; }

        input { width:100%; padding:8px 10px; border-radius:6px; border:1px solid #d1d5db; background:#fff; color:#111827; }
        input::placeholder { color:#9CA3AF; }
        :host-context(.dark) input { background:#242526; border-color:#3A3B3C; color:#E4E6EB; }
        :host-context(.dark) input::placeholder { color:#6B7280; }

        .btn { width:100%; padding:10px 12px; border-radius:8px; background:#6366f1; color:#fff; border:none; cursor:pointer; font-weight:600; }
        .btn:hover { filter:brightness(.95); }
        :host-context(.dark) .btn { background:#818cf8; }

        .close-btn { position:absolute; top:-10px; right:-10px; width:28px; height:28px; border-radius:50%; border:1px solid #e5e7eb; background:#fff; color:#6b7280; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        :host-context(.dark) .close-btn { background:#242526; border-color:#3A3B3C; color:#9CA3AF; }
      </style>

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
              <input id="login-email" type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input id="login-password" type="password" placeholder="••••••••">
            </div>
            <button id="login-btn" class="btn">Login</button>
          </div>

          <div id="register-form" style="display:none;">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input id="register-name" type="text" placeholder="Your name">
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input id="register-email" type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input id="register-password" type="password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label for="register-confirm">Confirm</label>
              <input id="register-confirm" type="password" placeholder="••••••••">
            </div>
            <button id="register-btn" class="btn">Register</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
    const tabs = this.shadowRoot.querySelectorAll('.tab');

    closeBtn?.addEventListener('click', () => this.closeModal());
    backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) this.closeModal(); });

    tabs.forEach(t => t.addEventListener('click', (e) => {
      tabs.forEach(x => x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const isLogin = e.currentTarget.dataset.tab === 'login';
      this.shadowRoot.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
      this.shadowRoot.getElementById('register-form').style.display = isLogin ? 'none' : 'block';
    }));

    const loginBtn = this.shadowRoot.getElementById('login-btn');
    const registerBtn = this.shadowRoot.getElementById('register-btn');

    loginBtn?.addEventListener('click', () => this.handleLogin());
    registerBtn?.addEventListener('click', () => this.handleRegister());

    // close on Esc
    this._escHandler = (e) => { if (e.key === 'Escape') this.closeModal(); };
    document.addEventListener('keydown', this._escHandler);
  }

  handleLogin() {
    const email = this.shadowRoot.getElementById('login-email').value.trim();
    const password = this.shadowRoot.getElementById('login-password').value;
    if (!email || !password) { alert('Please fill in all fields'); return; }
    localStorage.setItem('authToken', 'sample-token');
    this.closeModal();
    window.location.reload();
  }

  handleRegister() {
    const name = this.shadowRoot.getElementById('register-name').value.trim();
    const email = this.shadowRoot.getElementById('register-email').value.trim();
    const password = this.shadowRoot.getElementById('register-password').value;
    const confirm = this.shadowRoot.getElementById('register-confirm').value;
    if (!name || !email || !password || !confirm) { alert('Please fill in all fields'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    localStorage.setItem('authToken', 'sample-token');
    localStorage.setItem('userName', name);
    this.closeModal();
    window.location.reload();
  }

  closeModal() {
    document.removeEventListener('keydown', this._escHandler);
    this.remove();
  }
}

customElements.define('auth-modal', AuthModal);

// --- Clean replacement below to ensure no duplicate/corrupt code remains ---
// Overwrite entire file content with a single, well-formed AuthModal class.

/* eslint-disable */
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
    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; }
        :host * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; }
        .modal-content { background: #fff; color: #111827; width: 92%; max-width: 420px; border-radius: 10px; padding: 20px; box-shadow: 0 10px 30px rgba(2,6,23,0.2); position: relative; }
        :host-context(.dark) .modal-content { background: #242526; color: #E4E6EB; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }

        .tabs { display:flex; gap:8px; border-bottom:1px solid #e5e7eb; padding-bottom:8px; margin-bottom:14px; }
        :host-context(.dark) .tabs { border-bottom-color:#3A3B3C; }

        .tab { padding:6px 10px; cursor:pointer; font-weight:600; }
        .tab.active { border-bottom:2px solid #6366f1; color:#6366f1; }
        :host-context(.dark) .tab.active { border-bottom-color:#818cf8; color:#818cf8; }

        .form-group { margin-bottom:12px; }
        label { display:block; margin-bottom:6px; font-size:13px; }

        input { width:100%; padding:8px 10px; border-radius:6px; border:1px solid #d1d5db; background:#fff; color:#111827; }
        input::placeholder { color:#9CA3AF; }
        :host-context(.dark) input { background:#242526; border-color:#3A3B3C; color:#E4E6EB; }
        :host-context(.dark) input::placeholder { color:#6B7280; }

        .btn { width:100%; padding:10px 12px; border-radius:8px; background:#6366f1; color:#fff; border:none; cursor:pointer; font-weight:600; }
        .btn:hover { filter:brightness(.95); }
        :host-context(.dark) .btn { background:#818cf8; }

        .close-btn { position:absolute; top:-10px; right:-10px; width:28px; height:28px; border-radius:50%; border:1px solid #e5e7eb; background:#fff; color:#6b7280; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        :host-context(.dark) .close-btn { background:#242526; border-color:#3A3B3C; color:#9CA3AF; }
      </style>

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
              <input id="login-email" type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input id="login-password" type="password" placeholder="••••••••">
            </div>
            <button id="login-btn" class="btn">Login</button>
          </div>

          <div id="register-form" style="display:none;">
            <div class="form-group">
              <label for="register-name">Name</label>
              <input id="register-name" type="text" placeholder="Your name">
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input id="register-email" type="email" placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input id="register-password" type="password" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label for="register-confirm">Confirm</label>
              <input id="register-confirm" type="password" placeholder="••••••••">
            </div>
            <button id="register-btn" class="btn">Register</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
    const tabs = this.shadowRoot.querySelectorAll('.tab');

    closeBtn?.addEventListener('click', () => this.closeModal());
    backdrop?.addEventListener('click', (e) => { if (e.target === backdrop) this.closeModal(); });

    tabs.forEach(t => t.addEventListener('click', (e) => {
      tabs.forEach(x => x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const isLogin = e.currentTarget.dataset.tab === 'login';
      this.shadowRoot.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
      this.shadowRoot.getElementById('register-form').style.display = isLogin ? 'none' : 'block';
    }));

    const loginBtn = this.shadowRoot.getElementById('login-btn');
    const registerBtn = this.shadowRoot.getElementById('register-btn');

    loginBtn?.addEventListener('click', () => this.handleLogin());
    registerBtn?.addEventListener('click', () => this.handleRegister());

    this._escHandler = (e) => { if (e.key === 'Escape') this.closeModal(); };
    document.addEventListener('keydown', this._escHandler);
  }

  handleLogin() {
    const email = this.shadowRoot.getElementById('login-email').value.trim();
    const password = this.shadowRoot.getElementById('login-password').value;
    if (!email || !password) { alert('Please fill in all fields'); return; }
    localStorage.setItem('authToken', 'sample-token');
    this.closeModal();
    window.location.reload();
  }

  handleRegister() {
    const name = this.shadowRoot.getElementById('register-name').value.trim();
    const email = this.shadowRoot.getElementById('register-email').value.trim();
    const password = this.shadowRoot.getElementById('register-password').value;
    const confirm = this.shadowRoot.getElementById('register-confirm').value;
    if (!name || !email || !password || !confirm) { alert('Please fill in all fields'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    localStorage.setItem('authToken', 'sample-token');
    localStorage.setItem('userName', name);
    this.closeModal();
    window.location.reload();
  }

  closeModal() {
    document.removeEventListener('keydown', this._escHandler);
    this.remove();
  }
}

// Ensure single define (idempotent guard)
if (!customElements.get('auth-modal')) customElements.define('auth-modal', AuthModal);

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.observeDarkMode();
  }
    const isDark = document.documentElement.classList.contains('dark');
    const theme = isDark ? 'dark' : 'light';
  observeDarkMode() {
    // Create observer for dark mode changes
    // Add constructable stylesheets support for better dark mode handling
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(\`
      :host(.dark) .modal-content {
        background: var(--bg-dark);
        color: var(--text-dark);
      }
      :host(.dark) .tabs {
        border-bottom-color: var(--border-dark);
      }
      :host(.dark) .tab.active {
        border-bottom-color: var(--indigo-dark);
        color: var(--indigo-dark);
      }
      :host(.dark) input {
        background: var(--bg-dark);
        border-color: var(--border-dark);
        color: var(--text-dark);
      }
      :host(.dark) input::placeholder {
        color: #6B7280;
      }
      :host(.dark) button {
        background-color: var(--indigo-dark);
      }
      :host(.dark) button:hover {
        background-color: #6366f1;
      }
      :host(.dark) .close-btn {
        background: var(--bg-dark);
        border-color: var(--border-dark);
        color: #9CA3AF;
      }
      :host(.dark) .close-btn:hover {
        color: var(--text-dark);
        background: var(--hover-dark);
      }
    \`);
    
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.shadowRoot.innerHTML = `
      <style>
    const isDark = document.documentElement.classList.contains('dark');
    const theme = isDark ? 'dark' : 'light';
        :host {
          color-scheme: light dark;
        }
        
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
        
          background: ${theme === 'dark' ? '#242526' : '#ffffff'};
          color: ${theme === 'dark' ? '#E4E6EB' : '#374151'};
          border-radius: 0.5rem;
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, ${theme === 'dark' ? '0.3' : '0.1'});
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          position: relative;
          transition: all 0.3s ease;
        }
          border-bottom: 1px solid ${theme === 'dark' ? '#3A3B3C' : '#e5e7eb'};
        :host-context(html.dark) .modal-content,
        :host(.dark) .modal-content {
          background: #242526;
          color: #E4E6EB;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        
          display: flex;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 1.5rem;
          border-bottom: 2px solid ${theme === 'dark' ? '#818cf8' : '#6366f1'};
          color: ${theme === 'dark' ? '#818cf8' : '#6366f1'};
        
        :host-context(.dark) .tabs {
          border-bottom-color: var(--border-dark);
        }
        
        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 500;
          color: inherit;
          transition: color 0.3s ease, border-color 0.3s ease;
          color: ${theme === 'dark' ? '#E4E6EB' : '#374151'};
        
        .tab.active {
          border-bottom: 2px solid var(--indigo-light);
          color: var(--indigo-light);
        }
          border: 1px solid ${theme === 'dark' ? '#3A3B3C' : '#d1d5db'};
        :host-context(.dark) .tab.active {
          background: ${theme === 'dark' ? '#242526' : '#ffffff'};
          color: ${theme === 'dark' ? '#E4E6EB' : '#374151'};
          border-bottom-color: var(--indigo-dark);
          color: var(--indigo-dark);
        }
          color: ${theme === 'dark' ? '#6B7280' : '#9CA3AF'};
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          background-color: ${theme === 'dark' ? '#818cf8' : '#6366f1'};
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: inherit;
          transition: color 0.3s ease;
          transition: background-color 0.15s ease;
        }
        
        input {
          background-color: ${theme === 'dark' ? '#6366f1' : '#4f46e5'};
          padding: 0.5rem;
          border: 1px solid var(--border-light);
          border-radius: 0.375rem;
          background: var(--bg-light);
          color: var(--text-light);
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          background: ${theme === 'dark' ? '#242526' : '#ffffff'};
          border: 1px solid ${theme === 'dark' ? '#3A3B3C' : '#e5e7eb'};
        :host-context(.dark) input {
          background: var(--bg-dark);
          border-color: var(--border-dark);
          color: var(--text-dark);
        }
        
        :host-context(.dark) input::placeholder {
          color: #6B7280;
          color: ${theme === 'dark' ? '#9CA3AF' : '#6B7280'};
          box-shadow: 0 1px 3px rgba(0, 0, 0, ${theme === 'dark' ? '0.3' : '0.1'});
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--indigo-light);
          color: white;
          color: ${theme === 'dark' ? '#E4E6EB' : '#374151'};
          background: ${theme === 'dark' ? '#3A3B3C' : '#f3f4f6'};
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }
        
        button:hover {
          background-color: #4f46e5;
        }
        
        :host-context(.dark) button {
          background-color: var(--indigo-dark);
        }
        
        :host-context(.dark) button:hover {
          background-color: #6366f1;
        }
        
        .close-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: var(--bg-light);
          border: 1px solid var(--border-light);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 0;
          line-height: 1;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          color: var(--text-light);
          background: var(--hover-light);
        }
        
        :host-context(.dark) .close-btn {
          background: var(--bg-dark);
          border-color: var(--border-dark);
          color: #9CA3AF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        :host-context(.dark) .close-btn:hover {
          color: var(--text-dark);
          background: var(--hover-dark);
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
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector(".close-btn");
    const modalBackdrop = this.shadowRoot.querySelector(".modal-backdrop");
    const modalContent = this.shadowRoot.querySelector(".modal-content");
    const tabs = this.shadowRoot.querySelectorAll(".tab");
    const loginBtn = this.shadowRoot.querySelector("#login-btn");
    const registerBtn = this.shadowRoot.querySelector("#register-btn");

    closeBtn.addEventListener("click", () => this.closeModal());

    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        this.closeModal();
      }
    });

    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        const isLogin = tab.dataset.tab === "login";
        this.shadowRoot.querySelector("#login-form").style.display = isLogin ? "block" : "none";
        this.shadowRoot.querySelector("#register-form").style.display = isLogin ? "none" : "block";
      });
    });

    loginBtn.addEventListener("click", () => this.handleLogin());
    registerBtn.addEventListener("click", () => this.handleRegister());
  }

  handleLogin() {
    const email = this.shadowRoot.querySelector("#login-email").value;
    const password = this.shadowRoot.querySelector("#login-password").value;
    
        // Watch for theme changes
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
              this.render(); // Re-render when theme changes
            }
          });
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class']
        });
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    localStorage.setItem("authToken", "sample-token");
    this.closeModal();
    window.location.reload();
  }

  handleRegister() {
    const name = this.shadowRoot.querySelector("#register-name").value;
    const email = this.shadowRoot.querySelector("#register-email").value;
    const password = this.shadowRoot.querySelector("#register-password").value;
    const confirm = this.shadowRoot.querySelector("#register-confirm").value;
    
    if (!name || !email || !password || !confirm) {
      alert("Please fill in all fields");
      return;
    }
    
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    localStorage.setItem("authToken", "sample-token");
    localStorage.setItem("userName", name);
    this.closeModal();
    window.location.reload();
  }

  closeModal() {
    this.remove();
  }
}

customElements.define("auth-modal", AuthModal);
