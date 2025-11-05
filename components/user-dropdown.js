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
        /* DEBUG outlines: visible border around portal and content to help diagnose stacking/pointer issues */
        .user-dropdown-portal { outline: 2px dashed rgba(255,0,0,0.5); }
        .user-dropdown-portal .dropdown-content {
          pointer-events: auto;
          position: absolute;
          background: white;
          min-width: 200px;
          border-radius: 8px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          padding: 8px 0;
          z-index: 99999;
          outline: 2px dashed rgba(0,0,255,0.35);
        }
        .user-dropdown-portal .dropdown-item {
          padding: 12px 16px;
          display: block;
          color: #374151;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }
        .user-dropdown-portal .dropdown-item:hover { background: #f3f4f6; }
        .user-dropdown-portal .dropdown-divider { border-top: 1px solid #e5e7eb; margin: 6px 0; }

        @media (max-width: 640px) {
          .user-dropdown-portal .dropdown-content { left: 0 !important; right: 0 !important; top: 56px !important; border-radius: 0; min-width: auto; }
          .user-dropdown-portal .dropdown-item { padding: 16px; font-size: 16px; }
        }
      </style>
      <div class="dropdown-content" role="menu">
        <a href="profile.html" class="dropdown-item" role="menuitem">My Profile</a>
        <a href="my-ads.html" class="dropdown-item" role="menuitem">My ads</a>
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
        console.log('[user-dropdown] menu-item click:', it.textContent && it.textContent.trim(), { target: it, event: ev });
        ev.stopPropagation();
      });
    });

    // Log clicks on portal and content to observe event flow
    this._portal.addEventListener('click', (ev) => {
      console.log('[user-dropdown] portal clicked', { target: ev.target, path: ev.composedPath && ev.composedPath() });
    });
    this._portalContent.addEventListener('click', (ev) => {
      console.log('[user-dropdown] content clicked', { target: ev.target, path: ev.composedPath && ev.composedPath() });
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
