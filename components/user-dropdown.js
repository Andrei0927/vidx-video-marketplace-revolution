
class UserDropdown extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        .dropdown-container {
          position: relative;
          display: inline-block;
        }
        .dropdown-content {
          position: absolute;
          right: 0;
          background-color: white;
          min-width: 200px;
          box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 8px 0;
          z-index: 50;
        }
        .dropdown-item {
          padding: 12px 16px;
          display: block;
          color: #374151;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
        }
        .dropdown-item:hover {
          background-color: #f3f4f6;
        }
        .dropdown-divider {
          border-top: 1px solid #e5e7eb;
          margin: 4px 0;
        }

        /* Mobile: show as a full-width stacked list (behaves like a sheet/list) */
        @media (max-width: 640px) {
          .dropdown-content {
            position: fixed;
            top: 56px; /* below header */
            left: 0;
            right: 0;
            margin: 0;
            border-radius: 0;
            min-width: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            padding: 8px 0;
          }
          .dropdown-item {
            padding: 16px;
            font-size: 16px;
          }
        }
      </style>
      <div class="dropdown-container" role="menu">
        <div class="dropdown-content">
          <a href="profile.html" class="dropdown-item" role="menuitem">My Profile</a>
          <a href="my-ads.html" class="dropdown-item" role="menuitem">My ads</a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item" id="logout-btn" role="menuitem">Log out</a>
        </div>
      </div>
    `;

    const logoutBtn = this.shadowRoot.getElementById('logout-btn');
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear known auth/session keys
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userUsername');

      // If an auth service is available on window, call its logout helper
      try {
        if (window.authService && typeof window.authService.logout === 'function') {
          window.authService.logout();
        }
      } catch (err) {
        // ignore
      }

      // Dispatch an event so the host page can react (update nav, close menu, redirect)
      this.dispatchEvent(new CustomEvent('user-logout', { bubbles: true, composed: true }));
      // Default behaviour: navigate to home
      window.location.href = 'index.html';
    });
  }
}

customElements.define('user-dropdown', UserDropdown);
