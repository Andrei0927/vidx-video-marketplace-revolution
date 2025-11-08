class UserDropdown extends HTMLElement {
  constructor() {
    super();
    this._initialized = false;
    this._portal = null;
    this._logoutHandler = null;
    this._observer = null;
    this._resizeHandler = null;
  }

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    // Create portal container appended to body
    this._portal = document.createElement('div');
    this._portal.className = 'user-dropdown-portal';
    Object.assign(this._portal.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '9999',
      pointerEvents: 'auto'
    });
    this._portal.innerHTML = `
      <style>
        .user-dropdown-portal {
          pointer-events: auto;
        }
        .user-dropdown-portal .dropdown-content {
          pointer-events: auto;
          position: absolute;
          background: #ffffff;
          min-width: 220px;
          border-radius: 12px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
          padding: 8px 0;
          z-index: 99999;
          border: 1px solid rgba(229, 231, 235, 0.8);
        }
        .dark .user-dropdown-portal .dropdown-content {
          background: #242526;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        }
        .user-dropdown-portal .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          width: 100%;
          background: transparent;
          border: none;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.15s ease, color 0.15s ease;
          appearance: none;
        }
        .user-dropdown-portal .dropdown-item:hover,
        .user-dropdown-portal .dropdown-item:focus {
          background: rgba(99, 102, 241, 0.12);
          color: #312e81;
          outline: none;
        }
        .user-dropdown-portal .dropdown-item:focus-visible {
          outline: 2px solid rgba(99, 102, 241, 0.65);
          outline-offset: 2px;
        }
        .dark .user-dropdown-portal .dropdown-item {
          color: #E4E6EB;
        }
        .dark .user-dropdown-portal .dropdown-item:hover,
        .dark .user-dropdown-portal .dropdown-item:focus {
          background: rgba(99, 102, 241, 0.24);
          color: #EEF2FF;
        }
        .user-dropdown-portal .dropdown-divider {
          border-top: 1px solid rgba(229, 231, 235, 0.8);
          margin: 6px 0;
        }
        .dark .user-dropdown-portal .dropdown-divider {
          border-color: rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 640px) {
          .user-dropdown-portal .dropdown-content {
            left: 0 !important;
            right: 0 !important;
            top: 56px !important;
            border-radius: 0;
            min-width: auto;
          }
          .user-dropdown-portal .dropdown-item {
            padding: 16px;
            font-size: 16px;
          }
        }
      </style>
      <div class="dropdown-content" role="menu">
        <a href="profile.html" class="dropdown-item" role="menuitem">My Profile</a>
        <a href="my-ads.html" class="dropdown-item" role="menuitem">My ads</a>
        <a href="liked.html" class="dropdown-item" role="menuitem">Liked Videos</a>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" id="logout-btn" type="button" role="menuitem">Log out</button>
      </div>
    `;

    document.body.appendChild(this._portal);

    // Elements
    this._portalContent = this._portal.querySelector('.dropdown-content');
    this._logoutBtn = this._portal.querySelector('#logout-btn');
    this._menuItems = Array.from(this._portal.querySelectorAll('.dropdown-item'));

    // stopPropagation on menu items so document click doesn't immediately close the menu
    this._menuItems.forEach((it) => {
      it.addEventListener('click', (ev) => {
        ev.stopPropagation();
        // Close menu after navigation clicks to keep UI tidy
        if (it.tagName.toLowerCase() === 'a') {
          this._hidePortal();
        }
      });
    });

    // close when clicking outside the content
    this._portal.addEventListener('click', (ev) => {
      if (!this._portalContent.contains(ev.target)) {
        this._hidePortal();
      }
    });

    // Logout handler
    this._logoutHandler = async (e) => {
      console.log('[user-dropdown] logout initiated', { event: e });
      e.preventDefault();
      e.stopPropagation();
      
      // Close menu immediately to provide feedback
      this._hidePortal();

      const sessionToken = localStorage.getItem('sessionToken') || localStorage.getItem('authToken');
      console.log('[user-dropdown] logout token', sessionToken);
      if (window.authService && typeof window.authService.logout === 'function') {
        try {
          await window.authService.logout(sessionToken);
          console.log('[user-dropdown] server logout succeeded');
        } catch (err) {
          console.warn('[user-dropdown] server logout failed', err);
        }
      }

      // Clear client state
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userUsername');

      // Notify host page
      this.dispatchEvent(new CustomEvent('user-logout', { bubbles: true, composed: true }));
      
      console.log('[user-dropdown] redirecting to index.html');
      window.location.href = 'index.html';
    };

    this._logoutBtn.addEventListener('click', this._logoutHandler);

    // Mirror host 'hidden' class to portal visibility
    this._portal.style.display = this.classList.contains('hidden') ? 'none' : 'block';

    this._observer = new MutationObserver(() => {
      const hidden = this.classList.contains('hidden');
      this._portal.style.display = hidden ? 'none' : 'block';
      if (!hidden) this._updatePosition();
    });
    this._observer.observe(this, { attributes: true, attributeFilter: ['class'] });

    // reposition on resize/scroll
    this._resizeHandler = () => { if (!this.classList.contains('hidden')) this._updatePosition(); };
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('scroll', this._resizeHandler, true);
  }

  disconnectedCallback() {
    if (this._logoutBtn && this._logoutHandler) this._logoutBtn.removeEventListener('click', this._logoutHandler);
    if (this._menuItems) this._menuItems.forEach((it) => it.removeEventListener('click', (ev) => ev.stopPropagation()));
    if (this._portal && this._portal.parentNode) this._portal.parentNode.removeChild(this._portal);
    if (this._observer) this._observer.disconnect();
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      window.removeEventListener('scroll', this._resizeHandler, true);
    }
  }

  _hidePortal() {
    if (this._portal) this._portal.style.display = 'none';
    this.classList.add('hidden');
  }

  _updatePosition() {
    if (!this._portalContent) return;

    const hostRect = this.getBoundingClientRect();
    const contentRect = this._portalContent.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const headerHeight = 64; // header height

    // On small screens, pin to left/right via CSS media query; otherwise position to align to host's right edge
    if (viewportWidth <= 640) {
      Object.assign(this._portalContent.style, {
        position: 'fixed',
        left: '0',
        right: '0',
        top: `${headerHeight}px`,
        transform: 'none'
      });
    } else {
      // Position relative to host button
      Object.assign(this._portalContent.style, {
        position: 'fixed',
        left: `${hostRect.right - contentRect.width}px`,
        right: 'auto',
        top: `${headerHeight}px`,
        transform: 'none'
      });
    }
  }
}

customElements.define('user-dropdown', UserDropdown);
