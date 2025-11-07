# VidX Authentication System

A simple but secure authentication system with password hashing, ready for database migration.

## 🚀 Quick Start

### 1. Run Migration (Optional)
Convert existing `db.json` to new format with hashed passwords:

```bash
python3 migrate_db.py
```

### 2. Start Auth Server

```bash
python3 auth_server.py
```

Server will run on `http://localhost:3001`

## 📡 API Endpoints

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

Response: {
  "user": { "id", "name", "email", "createdAt" },
  "profile": { "id", "userId", "avatar", "bio", ... },
  "token": "session_token_here"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}

Response: {
  "user": { "id", "name", "email", "createdAt" },
  "profile": { "id", "userId", "avatar", "bio", ... },
  "token": "session_token_here"
}
```

### Logout
```bash
POST /api/auth/logout
Authorization: Bearer {token}

Response: { "message": "Logged out successfully" }
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer {token}

Response: {
  "user": { "id", "name", "email", "createdAt" },
  "profile": { "id", "userId", "avatar", "bio", ... }
}
```

### Verify Token
```bash
GET /api/auth/verify
Authorization: Bearer {token}

Response: { "valid": true/false }
```

## 🔐 Security Features

### Current Implementation
- ✅ Password hashing with SHA-256 + salt
- ✅ Secure random token generation
- ✅ CORS support for development
- ✅ Input validation
- ✅ SQL-injection proof (JSON storage)
- ✅ Session management

### Production Recommendations
- 🔄 Migrate to bcrypt/argon2 for password hashing
- 🔄 Add rate limiting
- 🔄 Implement HTTPS only
- 🔄 Add JWT tokens with expiration
- 🔄 Add refresh tokens
- 🔄 Add email verification
- 🔄 Add password reset flow
- 🔄 Add 2FA support

## 📁 Database Structure

### auth_db.json
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "password": "salt$hash",
      "createdAt": "2025-11-07T00:00:00.000Z",
      "updatedAt": "2025-11-07T00:00:00.000Z"
    }
  ],
  "sessions": [
    {
      "id": 1,
      "userId": 1,
      "token": "secure_random_token",
      "createdAt": "2025-11-07T00:00:00.000Z",
      "expiresAt": null
    }
  ],
  "profiles": [
    {
      "id": 1,
      "userId": 1,
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
      "bio": "",
      "phone": "",
      "location": "",
      "createdAt": "2025-11-07T00:00:00.000Z",
      "updatedAt": "2025-11-07T00:00:00.000Z"
    }
  ]
}
```

## 🔄 Migration to Production Database

The current JSON structure maps easily to SQL:

### PostgreSQL Example
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    avatar TEXT,
    bio TEXT,
    phone VARCHAR(50),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Test Credentials (after migration)
```
Email: demo@example.com
Password: demo1234

Email: test@example.com
Password: pass1234
```

### Manual Testing
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get profile (use token from login)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Client Integration

The `js/auth-service.js` automatically detects:
- **Localhost**: Uses auth server on port 3001
- **Remote**: Uses localStorage-based auth (no backend needed)

### Usage Example
```javascript
import authService from './js/auth-service.js';

// Register
const { user, profile, token } = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure123'
});

// Login
const { user, profile, session } = await authService.login(
  'john@example.com',
  'secure123'
);

// Store in localStorage
localStorage.setItem('sessionToken', session);
localStorage.setItem('userId', user.id);
localStorage.setItem('userName', user.name);
localStorage.setItem('userEmail', user.email);
localStorage.setItem('userAvatar', profile.avatar);
```

## 🛠️ Development vs Production

### Development (Current)
- JSON file storage
- SHA-256 password hashing
- No rate limiting
- No HTTPS enforcement
- Simple token format

### Production Ready Upgrade
1. Switch to PostgreSQL/MySQL
2. Upgrade to bcrypt/argon2
3. Add rate limiting (express-rate-limit)
4. Enforce HTTPS
5. Use JWT tokens
6. Add refresh tokens
7. Add email verification
8. Add monitoring/logging

## 📚 Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] OAuth (Google, Facebook, Apple)
- [ ] Two-factor authentication
- [ ] Session expiration
- [ ] Account deletion
- [ ] Profile editing
- [ ] Change password
- [ ] Activity log
- [ ] Device management
