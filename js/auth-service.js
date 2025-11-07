// API service for authentication
class AuthService {
  constructor(baseUrl = null) {
    // Auto-detect the base URL based on environment
    if (!baseUrl) {
      // If on localhost, use the local API server
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.baseUrl = 'http://localhost:3001/api/auth';
      } else {
        // For remote/production, use mock/localStorage-based auth
        this.baseUrl = null; // Will use localStorage for demo
      }
    } else {
      this.baseUrl = baseUrl;
    }
  }

  async register(userData) {
    try {
      // If no API server (remote deployment), use localStorage
      if (!this.baseUrl) {
        return this.registerLocal(userData);
      }

      // Call new auth API
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // If no API server (remote deployment), use localStorage
      if (!this.baseUrl) {
        return this.loginLocal(email, password);
      }

      // Call new auth API
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const result = await response.json();
      
      return {
        user: result.user,
        profile: result.profile,
        session: result.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(sessionToken) {
    try {
      // If no API server, just clear localStorage
      if (!this.baseUrl) {
        return true;
      }

      // Call logout endpoint
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      return true; // Don't block logout on error
    }
  }

  isLoggedIn() {
    return !!(localStorage.getItem('sessionToken') || localStorage.getItem('authToken') || localStorage.getItem('userId'));
  }

  // ========================================
  // LocalStorage-based auth (for remote/iOS)
  // ========================================
  
  registerLocal(userData) {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('vidx_users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password // In production, hash this!
    };
    
    users.push(newUser);
    localStorage.setItem('vidx_users', JSON.stringify(users));
    
    return newUser;
  }
  
  loginLocal(email, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('vidx_users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify password
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Generate session token
    const session = this.generateSessionToken();
    
    // Create profile with avatar
    const profile = {
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: ''
    };
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      profile,
      session
    };
  }
}

// Export as a singleton and attach to window for legacy callers/components
const authServiceInstance = new AuthService();
try {
  // attach to window for components loaded as non-module consumers
  if (typeof window !== 'undefined') window.authService = authServiceInstance;
} catch (err) {
  // ignore in non-browser environments
}

export default authServiceInstance;