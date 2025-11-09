# Upload Page Authentication Loop Bug

**Date:** 2025-11-09

## Summary
When attempting to access `upload.html`, users are forced into a login loop even after successfully authenticating. The upload form never renders and the authentication modal keeps reappearing.

## Observed Behaviour
- Auth modal displays on page load.
- Login request succeeds (`200 OK`), new session token stored in `localStorage`.
- Page reloads, but auth check still reports `userName` missing.
- Modal is created again, trapping the user in the login flow.

Console excerpt (Brave, logs preserved):
```
upload.html:262 [Upload] Auth check: {hasSessionToken: true, hasUserName: false, sessionToken: 'DFeSmU8U-J...'}
auth-modal.js:427 Session: DFeSmU8U-JPFpv2aaW9756SFpIOgAn7a-1TERmJlckU
auth-modal.js:436 Stored in localStorage: {sessionToken: 'DFeSmU8U-J...', userId: '3', userEmail: 'testlive@example.com', userName: '', userAvatar: ''}
```

## Likely Root Cause
- Backend returns the user object with `fullName: ''` (empty string) for accounts created without a name.
- `auth-modal.js` persists `localStorage.userName` using `user?.name`, which resolves to empty string.
- `upload.html` treats an empty string as "unauthenticated" because the auth gate checks:
  ```javascript
  if (!sessionToken || !localStorage.getItem('userName')) {
      // show auth modal
  }
  ```
- Result: auth loop despite valid session token.

### Code Evidence
- **Backend login response:** `app.py` lines 196-204 always return `user['full_name']` under the JSON key `fullName`. When the database column `full_name` is empty, this ships an empty string to the browser.
- **Frontend storage bug (pre-fix):** `components/auth-modal.js` (login handler, line ~430 before commit `6279980`) called `localStorage.setItem('userName', user?.name || '')`. Because the backend payload exposes `fullName`, the optional chaining expression resolved to `undefined` and then stored `''` (empty string).
- **Auth gate:** `upload.html` line 262 requires both a session token and a truthy `userName`. An empty string fails this check, so the modal is re-rendered even though the session token is valid.

## Mitigation Implemented
- Update `auth-modal.js` to map the backend field `fullName` and fall back to email when name is blank:
  ```javascript
  const displayName = user?.fullName && user.fullName.trim() !== ''
        ? user.fullName
        : user?.email || '';
  localStorage.setItem('userName', displayName);
  ```
- Applied in both login and registration handlers (commit `6279980`).

## Remaining Work / Recommendations
1. **Backend safeguard:** When returning user data, populate `fullName` with email if empty to avoid similar issues in other clients.
2. **Front-end guard:** Optionally adjust `upload.html` auth check to allow `userName` fallback (e.g., accept session token alone).
3. **QA regression:** Retest upload flow with accounts that have and do not have profile names.
4. **Monitoring:** Add telemetry or console warnings if `userName` resolves empty after login to catch regressions early.

## Related References
- Commits: `6279980` (auth fallback fix), `e7584a5` (enhanced logging)
- Files touched: `components/auth-modal.js`, `upload.html`
- Debug artifacts: `debug-auth.html`, `UPLOAD_FLOW_REVIEW.md`
