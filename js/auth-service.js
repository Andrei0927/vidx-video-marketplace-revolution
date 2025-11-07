// API service for authentication
class AuthService {
  constructor(baseUrl = null) {
    // Auto-detect the base URL based on environment
    if (!baseUrl) {
      // If on localhost, use the local API server
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.baseUrl = 'http://localhost:3001/api/auth';
      } 
      // If on Hugging Face Spaces, try to use API (you'll need to update this with your Space URL)
      else if (window.location.hostname.includes('hf.space')) {
        this.baseUrl = null; // Will use localStorage for now (update with your API endpoint when deployed)
      }
      else {
        // For remote/production, use mock/localStorage-based auth
        this.baseUrl = null; // Will use localStorage for demo
      }
    } else {
      this.baseUrl = baseUrl;
    }
    
    console.log('[AuthService] Initialized with baseUrl:', this.baseUrl || 'localStorage mode');
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

  async requestPasswordReset(email) {
    try {
      // If no API server (remote deployment), use localStorage
      if (!this.baseUrl) {
        return this.requestPasswordResetLocal(email);
      }

      const response = await fetch(`${this.baseUrl}/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to request password reset');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  async verifyResetCode(email, code) {
    try {
      // If no API server (remote deployment), use localStorage
      if (!this.baseUrl) {
        return this.verifyResetCodeLocal(email, code);
      }

      const response = await fetch(`${this.baseUrl}/password-reset/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid code');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Code verification error:', error);
      throw error;
    }
  }

  async resetPassword(email, code, newPassword) {
    try {
      // If no API server (remote deployment), use localStorage
      if (!this.baseUrl) {
        return this.resetPasswordLocal(email, code, newPassword);
      }

      const response = await fetch(`${this.baseUrl}/password-reset/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code, newPassword })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  generateSessionToken() {
    // Generate a random session token
    return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // ========================================
  // LocalStorage-based auth (for remote/iOS)
  // ========================================
  
  _seedDefaultUsers() {
    // Seed with some default test users if localStorage is empty
    const defaultUsers = [
      { id: 1, name: 'Demo User', email: 'demo@example.com', password: 'demo123' },
      { id: 2, name: 'Test User', email: 'test@example.com', password: 'test123' }
    ];
    
    const users = JSON.parse(localStorage.getItem('vidx_users') || '[]');
    if (users.length === 0) {
      console.log('[AuthService] Seeding default test users for localStorage mode');
      localStorage.setItem('vidx_users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return users;
  }
  
  registerLocal(userData) {
    // Get existing users from localStorage (or seed defaults)
    const users = this._seedDefaultUsers();
    
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
    
    console.log('[AuthService] User registered in localStorage:', newUser.email);
    return newUser;
  }
  
  loginLocal(email, password) {
    // Get users from localStorage (or seed defaults)
    const users = this._seedDefaultUsers();
    
    console.log('[AuthService] Attempting login for:', email);
    console.log('[AuthService] Available users:', users.map(u => u.email));
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      console.error('[AuthService] User not found. Available:', users.map(u => u.email));
      throw new Error(`User not found. Try: ${users[0].email}`);
    }
    
    // Verify password
    if (user.password !== password) {
      console.error('[AuthService] Invalid password for:', email);
      throw new Error('Invalid password');
    }
    
    console.log('[AuthService] Login successful for:', email);
    
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
  
  requestPasswordResetLocal(email) {
    // Get users from localStorage
    const users = this._seedDefaultUsers();
    
    // Find user
    const user = users.find(u => u.email === email);
    
    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset token in localStorage
    const resetTokens = JSON.parse(localStorage.getItem('vidx_reset_tokens') || '[]');
    
    // Remove old tokens for this email
    const filteredTokens = resetTokens.filter(t => t.email !== email);
    
    if (user) {
      // Add new token (expires in 1 hour)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      filteredTokens.push({
        email,
        code: resetCode,
        createdAt: new Date().toISOString(),
        expiresAt,
        used: false
      });
      
      localStorage.setItem('vidx_reset_tokens', JSON.stringify(filteredTokens));
      
      console.log('[AuthService] Password reset code generated:', resetCode);
      
      return {
        message: 'If an account exists with this email, a reset code has been sent',
        resetCode,  // In production, this would be sent via email
        devNote: 'Reset code shown for development only'
      };
    }
    
    // Don't reveal if email doesn't exist
    console.log('[AuthService] Password reset requested for non-existent email:', email);
    return {
      message: 'If an account exists with this email, a reset code has been sent'
    };
  }
  
  verifyResetCodeLocal(email, code) {
    const resetTokens = JSON.parse(localStorage.getItem('vidx_reset_tokens') || '[]');
    
    // Find valid token
    const now = new Date().toISOString();
    const token = resetTokens.find(t => 
      t.email === email &&
      t.code === code &&
      !t.used &&
      t.expiresAt > now
    );
    
    if (!token) {
      throw new Error('Invalid or expired code');
    }
    
    return {
      valid: true,
      message: 'Code verified successfully'
    };
  }
  
  resetPasswordLocal(email, code, newPassword) {
    // Get users and tokens
    const users = this._seedDefaultUsers();
    const resetTokens = JSON.parse(localStorage.getItem('vidx_reset_tokens') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid code');
    }
    
    // Find valid token
    const now = new Date().toISOString();
    const tokenIndex = resetTokens.findIndex(t => 
      t.email === email &&
      t.code === code &&
      !t.used &&
      t.expiresAt > now
    );
    
    if (tokenIndex === -1) {
      throw new Error('Invalid or expired code');
    }
    
    // Update password
    user.password = newPassword;
    localStorage.setItem('vidx_users', JSON.stringify(users));
    
    // Mark token as used
    resetTokens[tokenIndex].used = true;
    localStorage.setItem('vidx_reset_tokens', JSON.stringify(resetTokens));
    
    console.log('[AuthService] Password reset completed for:', email);
    
    return {
      message: 'Password reset successfully',
      email
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