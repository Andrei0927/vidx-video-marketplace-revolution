// API service for authentication
class AuthService {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async register(userData) {
    try {
      // First check if user exists
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // In a real app, we'd hash the password on the server
      // For demo, we're just storing it (don't do this in production!)
      const response = await fetch(`${this.baseUrl}/users`, {
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
        throw new Error('Registration failed');
      }

      const result = await response.json();
      // server returns { user: {...}, profile: {...} }
      const user = result.user || result;
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, we'd verify the password hash
      // For demo, we're just comparing directly (don't do this in production!)
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Create session
      const session = await this.createSession(user.id);
      
      // Get user profile
      const profile = await this.getUserProfile(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        profile,
        session
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(sessionToken) {
    try {
      // Find and delete session
      const response = await fetch(`${this.baseUrl}/sessions?token=${sessionToken}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const response = await fetch(`${this.baseUrl}/users?email=${email}`);
      const users = await response.json();
      return users[0] || null;
    } catch (error) {
      console.error('Find user error:', error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/profiles?userId=${userId}`);
      const profiles = await response.json();
      return profiles[0] || null;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async createSession(userId) {
    try {
      const token = this.generateSessionToken();
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          token,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      return token;
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  }

  generateSessionToken() {
    // In production, use a proper UUID library
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  isLoggedIn() {
    return !!(localStorage.getItem('sessionToken') || localStorage.getItem('authToken') || localStorage.getItem('userId'));
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