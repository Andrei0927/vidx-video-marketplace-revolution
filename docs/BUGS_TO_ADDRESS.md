# Known Bugs to Address 🐛

**Date**: November 9, 2025  
**Status**: Pending Investigation

---

## 1. File Browser Not Opening on Upload Page

### Issue
- **Location**: `upload.html`
- **Description**: File browser does not open when clicking "Browse files" button or upload area
- **User Impact**: Cannot create new ads

### Possible Causes
1. JavaScript error blocking event handlers
2. Browser security policy preventing file input trigger
3. Race condition with storage manager initialization
4. Event listener not attached properly

### Investigation Steps
1. Check browser console for JavaScript errors
2. Verify file input element exists: `document.getElementById('file-input')`
3. Test if click event handler is attached: Check in DevTools Event Listeners
4. Try different browsers (Chrome, Safari, Firefox)
5. Test on mobile vs desktop

### Quick Fix Attempts
```javascript
// Try adding this after line 487 in upload.html
console.log('[Upload] File input element:', fileInput);
console.log('[Upload] Browse button:', browseBtn);
console.log('[Upload] Upload area:', uploadArea);

// Verify click handler is working
browseBtn.addEventListener('click', (e) => {
    console.log('[Upload] Browse button clicked!');
    e.stopPropagation();
    fileInput.click();
});
```

### Potential Fix
If the issue is a race condition with DOM loading:
```javascript
// Wrap all event listeners in DOMContentLoaded or move to end of file
document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    
    if (!uploadArea || !fileInput || !browseBtn) {
        console.error('[Upload] Required elements not found!');
        return;
    }
    
    // Rest of initialization...
});
```

---

## 2. Registration Auto-Logs User In

### Issue
- **Location**: `components/auth-modal.js` (lines 540-543)
- **Description**: After successful registration, user is immediately logged in
- **User Impact**: User may want to verify email before logging in, or may expect to manually login

### Current Behavior
```javascript
// Line 540-543
console.log('=== REGISTRATION SUCCESS ===');

this.closeModal();
window.location.reload();  // ← This logs user in immediately
```

### Expected Behavior (Option 1: Require Manual Login)
```javascript
console.log('=== REGISTRATION SUCCESS ===');

// Show success message
this.showSuccess('register-success', 'Account created! Please log in.');

// Switch to login tab
this.setActiveTab('login');

// Don't reload or auto-login
// this.closeModal();
// window.location.reload();
```

### Expected Behavior (Option 2: Keep Auto-Login but Show Message)
```javascript
console.log('=== REGISTRATION SUCCESS ===');

// Show welcome message before redirect
const welcomeMsg = document.createElement('div');
welcomeMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
welcomeMsg.textContent = `Welcome, ${user.name}! Your account has been created.`;
document.body.appendChild(welcomeMsg);

setTimeout(() => {
    this.closeModal();
    window.location.reload();
}, 1500);
```

### Decision Needed
- **Option A**: Require manual login (better security practice)
- **Option B**: Keep auto-login (better UX)
- **Option C**: Add email verification step before auto-login (best practice)

### Recommendation
**Option C** - Add email verification:
1. Registration creates account but marks as `email_verified: false`
2. Send verification email with code/link
3. User must verify email before logging in
4. Show message: "Please check your email to verify your account"

This requires:
- Backend email service (already planned in Phase 6)
- Email verification endpoints
- Frontend verification flow

---

## Priority Assessment

| Bug | Severity | User Impact | Fix Complexity | Priority |
|-----|----------|-------------|----------------|----------|
| File browser not opening | **High** | Blocking (cannot create ads) | Low-Medium | **P0** |
| Auto-login after registration | **Low** | Minor UX confusion | Low | **P2** |

---

## Next Steps

1. **Immediate**: Debug file browser issue in browser DevTools
2. **Short-term**: Decide on registration flow (manual login vs auto-login)
3. **Long-term**: Implement email verification (Phase 6)

---

## Testing Checklist

### File Browser Issue
- [ ] Test on Chrome (desktop)
- [ ] Test on Safari (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on iOS Safari (mobile)
- [ ] Test on Android Chrome (mobile)
- [ ] Check browser console for errors
- [ ] Verify file input element exists
- [ ] Verify event listeners are attached
- [ ] Test with browser extensions disabled
- [ ] Test in incognito/private mode

### Registration Flow
- [ ] Test registration with immediate auto-login
- [ ] Test registration with manual login requirement
- [ ] Verify session storage after registration
- [ ] Test registration error handling
- [ ] Test password validation
- [ ] Test email validation
- [ ] Test duplicate email prevention

---

**Status**: Documented for future investigation and fixing
