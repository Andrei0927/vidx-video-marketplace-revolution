# Password Reset Flow - VidX

## Overview

Complete password reset implementation with 4-step flow, supporting both API server (localhost) and localStorage mode (iOS/remote).

## Features

### Security Features
- ✅ 6-digit verification codes
- ✅ Codes expire after 1 hour
- ✅ Single-use tokens (marked as used after reset)
- ✅ All user sessions invalidated on password reset
- ✅ Doesn't reveal if email exists (security best practice)
- ✅ Minimum 8-character password requirement

### User Experience
- ✅ Clear 4-step process
- ✅ Inline validation and error messages
- ✅ Mobile-responsive design
- ✅ Dark mode support
- ✅ Seamless integration with login flow

### Development Features
- ✅ Dev mode shows reset codes in response/UI
- ✅ Works offline with localStorage
- ✅ Console logging for debugging
- ✅ Test page for easy verification

## User Flow

### Step 1: Request Reset Code
1. User clicks "Forgot Password?" on login screen
2. Enters their email address
3. System generates 6-digit code (expires in 1 hour)
4. **Production**: Code sent via email
5. **Development**: Code shown in response and UI

### Step 2: Verify Code
1. User enters the 6-digit code
2. System validates code is:
   - Valid for the email address
   - Not expired (< 1 hour old)
   - Not already used
3. Proceeds to password reset on success

### Step 3: Create New Password
1. User enters new password (min 8 characters)
2. Confirms password matches
3. System updates password and:
   - Marks reset token as used
   - Invalidates all existing sessions
   - Hashes new password securely

### Step 4: Success
1. Success screen shown
2. User clicks "Login Now"
3. Returns to login modal
4. Can login with new password

## API Endpoints

### Request Password Reset
```http
POST /api/auth/password-reset/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If an account exists with this email, a reset code has been sent",
  "resetCode": "123456",  // DEV MODE ONLY - remove in production
  "devNote": "Reset code shown for development only"
}
```

### Verify Reset Code
```http
POST /api/auth/password-reset/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "message": "Code verified successfully"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid or expired code"
}
```

### Reset Password
```http
POST /api/auth/password-reset/reset
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully",
  "email": "user@example.com"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid or expired code"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Password must be at least 8 characters"
}
```

## Frontend Integration

### Using the Component

```javascript
// Import the component
import './components/password-reset.js';

// Create and show password reset modal
const passwordReset = document.createElement('password-reset');

// Listen for events
passwordReset.addEventListener('login-requested', () => {
  // User wants to login after successful reset
  openLoginModal();
});

passwordReset.addEventListener('close', () => {
  // Modal was closed
  console.log('Password reset cancelled');
});

document.body.appendChild(passwordReset);
```

### Integration with Auth Modal

The auth modal already includes a "Forgot Password?" link:

```javascript
// Auth modal automatically shows password reset when clicked
// No additional code needed
```

### Using Auth Service

```javascript
import authService from './js/auth-service.js';

// Request password reset
try {
  const result = await authService.requestPasswordReset('user@example.com');
  console.log('Reset code requested:', result.resetCode); // Dev mode only
} catch (error) {
  console.error('Failed to request reset:', error.message);
}

// Verify reset code
try {
  await authService.verifyResetCode('user@example.com', '123456');
  console.log('Code verified!');
} catch (error) {
  console.error('Invalid code:', error.message);
}

// Reset password
try {
  await authService.resetPassword('user@example.com', '123456', 'newPassword123');
  console.log('Password reset successfully!');
} catch (error) {
  console.error('Reset failed:', error.message);
}
```

## Testing

### Test on Localhost (with API Server)

1. Start the auth server:
```bash
python3 auth_server.py
```

2. Open test page:
```
http://localhost:3000/test-password-reset.html
```

3. Use test credentials:
   - Email: `demo@example.com`
   - The reset code will be printed in the server console

### Test on iOS/Remote (localStorage Mode)

1. Deploy to Hugging Face or access remotely
2. Component automatically uses localStorage mode
3. Reset codes are shown in the UI (dev mode)
4. No API server required

### Manual API Testing

```bash
# Request reset code
curl -X POST http://localhost:3001/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com"}'

# Verify code (use code from response above)
curl -X POST http://localhost:3001/api/auth/password-reset/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","code":"123456"}'

# Reset password
curl -X POST http://localhost:3001/api/auth/password-reset/reset \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","code":"123456","newPassword":"newPassword123"}'

# Test login with new password
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"newPassword123"}'
```

## Database Structure

### Reset Token Record
```json
{
  "id": 1,
  "userId": 1,
  "code": "123456",
  "createdAt": "2025-11-07T10:30:00.000Z",
  "expiresAt": "2025-11-07T11:30:00.000Z",
  "used": false
}
```

### localStorage Structure (iOS/Remote)

**Reset Tokens:**
```javascript
// localStorage.getItem('vidx_reset_tokens')
[
  {
    "email": "demo@example.com",
    "code": "123456",
    "createdAt": "2025-11-07T10:30:00.000Z",
    "expiresAt": "2025-11-07T11:30:00.000Z",
    "used": false
  }
]
```

## Production Deployment

### Important Changes for Production

1. **Remove Dev Mode Code Display:**
   - Remove `resetCode` from API response in `auth_server.py`
   - Remove dev code display UI in `password-reset.js`

2. **Implement Email Sending:**
   ```python
   # In auth_server.py - handle_password_reset_request()
   if user:
       reset_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
       
       # Send email (replace with your email service)
       send_reset_email(user['email'], reset_code)
       
       # Don't return code in response
       return {'message': 'If an account exists...'}
   ```

3. **Configure Email Service:**
   - Use SendGrid, AWS SES, or similar
   - Create email template with reset code
   - Include expiration time in email

4. **Security Enhancements:**
   - Consider rate limiting reset requests
   - Log reset attempts for security monitoring
   - Consider CAPTCHA for public deployments

## File Structure

```
components/
  password-reset.js          # Password reset web component
  auth-modal.js              # Updated with "Forgot Password?" link

js/
  auth-service.js            # Added reset methods (API + localStorage)

auth_server.py               # Added 3 password reset endpoints

test-password-reset.html     # Test page for password reset flow
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (iOS 14+)
- ✅ Safari (macOS 12+)

## Known Limitations

1. **Development Mode**: Reset codes are visible in responses and UI
   - Must be removed before production deployment

2. **Email Service**: Not implemented
   - Currently just logs code to console/shows in UI
   - Production needs email integration

3. **Rate Limiting**: Not implemented
   - Should add rate limiting in production to prevent abuse

## Future Enhancements

- [ ] Email integration (SendGrid/AWS SES)
- [ ] SMS-based reset codes as alternative
- [ ] Magic link option (email with token link)
- [ ] Rate limiting on reset requests
- [ ] Admin panel to view/revoke reset tokens
- [ ] Security questions as additional verification
- [ ] 2FA integration
- [ ] Password strength meter on reset page

## Support

For issues or questions:
1. Check server console for reset codes (dev mode)
2. Check browser console for client-side errors
3. Verify auth server is running on port 3001
4. Test with `demo@example.com` account first
