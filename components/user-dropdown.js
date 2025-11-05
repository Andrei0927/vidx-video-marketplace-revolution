class UserDropdown extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
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
          z-index: 1;
          margin-top: 8px;
        }
        .dropdown-item {
          padding: 12px 16px;
          display: block;
          color: #4b5563;
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
      </style>
      <div class="dropdown-container">
        <div class="dropdown-content">
          <a href="profile.html" class="dropdown-item">My Profile</a>
          <a href="my-listings.html" class="dropdown-item">My Listings</a>
          <a href="upload.html" class="dropdown-item">Create Listing</a>
          <div class="dropdown-divider"></div>
          <a href="login.html" class="dropdown-item" id="logout-btn">Logout</a>
</div>
      </div>
    `;

    this.shadowRoot.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      window.location.href = 'index.html';
    });
  }
}

customElements.define('user-dropdown', UserDropdown);