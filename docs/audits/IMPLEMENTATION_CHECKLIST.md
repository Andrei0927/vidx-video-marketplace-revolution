# Implementation Checklist: Audit Gap Fixes

**Start Date**: [TBD]  
**Target Completion**: Before go-live  
**Owner**: [TBD]  

---

## 🔴 CRITICAL FIXES (Do This FIRST - 4 hours)

### AUDIT-C1: Fix Storage Manager Metadata Bug
**Impact**: Resume banner shows "NaN minutes ago" → User trust destroyed  
**Audit Finding**: Claude #8, #13  
**File**: `js/storage-manager.js`  
**Lines**: 40-92  

**Checklist**:
- [ ] Read current `storage-manager.js` implementation
- [ ] Understand issue: `getDraft()` returns only `.data`, loses numeric timestamp
- [ ] Fix: Change return statement from `resolve(request.result.data)` to `resolve(request.result)`
- [ ] Update `upload.html` to handle full record (access `draft.timestamp` not `draft.data.timestamp`)
- [ ] Test in browser:
  - [ ] Create upload draft
  - [ ] Close tab
  - [ ] Return to upload.html
  - [ ] Verify banner shows "X minutes ago" (not "NaN minutes ago")
- [ ] Verify timestamp calculation works with numeric value
- [ ] Code review + merge

**Estimated Time**: 30 minutes  
**Difficulty**: ⭐ Easy  
**Testing**: Manual (browser)

---

### AUDIT-C2: Remove Password Reset Code from API Response
**Impact**: CRITICAL SECURITY - Accounts can be hijacked via DevTools  
**Audit Finding**: GPT #9, Gemini #2  
**File**: `auth_server.py`  
**Function**: `handle_password_reset_request`  

**Checklist**:
- [ ] Read current password reset implementation
- [ ] Find response JSON that includes `resetCode` field
- [ ] Remove `resetCode` from API response JSON
- [ ] Ensure code is STILL sent via email (verify email sending logic)
- [ ] Test endpoint:
  - [ ] Call `/api/password-reset` with valid email
  - [ ] Inspect Network tab in DevTools
  - [ ] Verify response does NOT contain any code/token
  - [ ] Verify email was sent with code (check email service logs)
- [ ] Verify user can still reset password with code from email
- [ ] Code review + merge

**Estimated Time**: 15 minutes  
**Difficulty**: ⭐ Easy  
**Testing**: API + Email verification

**SECURITY NOTE**: This is a critical security vulnerability. If in doubt, remove the field entirely and rely on email-only delivery.

---

### AUDIT-C3: Add Warning When Videos Filtered in Upload
**Impact**: Users confused why videos disappear → Support tickets  
**Audit Finding**: Claude #7  
**File**: `upload-review.html`  
**Location**: Around line 270 (video filtering logic)  

**Checklist**:
- [ ] Find video format filtering logic in `upload-review.html`
- [ ] Understand what formats are allowed/rejected
- [ ] Create warning modal component:
  - [ ] HTML structure for modal
  - [ ] CSS styling (match dark mode theme)
  - [ ] JavaScript to show/hide modal
- [ ] Detect when user uploads video but no video format in final ad
- [ ] Show modal: "⚠️ Video format not supported - AI-generated thumbnail will be used instead"
- [ ] Allow user to proceed or go back
- [ ] Test:
  - [ ] Upload video in details form
  - [ ] Proceed to review
  - [ ] Verify warning appears
  - [ ] Click proceed → continues
  - [ ] Click back → returns to details
- [ ] Code review + merge

**Estimated Time**: 1 hour  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Manual workflow testing

---

### AUDIT-C4: Consolidate Dark Mode Code Duplication
**Impact**: Technical debt - hard to change theme logic globally  
**Audit Finding**: Claude #29  
**Files**: 15+ HTML files (see theme initialization)  

**Checklist**:
- [ ] Find all dark mode bootstrap code across codebase
- [ ] Create new file: `js/theme-bootstrap.js`
- [ ] Extract dark mode initialization logic:
  ```javascript
  (function() {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') {
          document.documentElement.classList.remove('dark');
      } else {
          document.documentElement.classList.add('dark');
      }
  })();
  ```
- [ ] Remove inline theme scripts from all HTML files
- [ ] Add `<script src="js/theme-bootstrap.js"></script>` to every HTML file `<head>`
- [ ] Test:
  - [ ] Load each HTML file
  - [ ] Verify theme setting persists
  - [ ] Toggle theme → verify changes everywhere
  - [ ] Check DevTools console for errors
- [ ] Code review + merge

**Estimated Time**: 2 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Manual + cross-browser

---

## Total Time for Critical Fixes: ~4 hours

**✅ DO NOT PROCEED with any other work until these 4 are done and tested.**

---

## 🟠 HIGH PRIORITY (Week 1-2 - 13-18 hours)

### AUDIT-H1: Implement Email Verification for New Users
**Impact**: Prevents spam, enables email delivery  
**Audit Finding**: Claude #31  
**Files**: `app.py` (backend), multiple HTML files (frontend)  

**Checklist - Backend**:
- [ ] Add `email_verified: boolean` (default false) to users table
- [ ] Create `/api/verify-email?token=xxx` endpoint
- [ ] Generate unique verification token on registration
- [ ] Send verification email with token link
- [ ] Mark user as verified when token is confirmed
- [ ] Add check: block ad uploads if email not verified

**Checklist - Frontend**:
- [ ] Show "Please verify your email" banner until verified
- [ ] Link to resend verification email
- [ ] Create verification page/modal with status
- [ ] Test full flow:
  - [ ] Register → get email with link
  - [ ] Click link → verify
  - [ ] Try upload → success
  - [ ] Try upload before verify → blocked

**Estimated Time**: 4-6 hours  
**Difficulty**: ⭐⭐⭐ Hard  
**Testing**: Full workflow + email delivery

---

### AUDIT-H2: Add Rate Limiting on Auth Endpoints
**Impact**: Prevents brute force attacks  
**Audit Finding**: Claude #27  
**File**: `app.py`  
**Package**: Flask-Limiter  

**Checklist**:
- [ ] Install Flask-Limiter: `pip install flask-limiter`
- [ ] Import and initialize in `app.py`
- [ ] Add decorators:
  - [ ] Login: 5 attempts/minute per IP
  - [ ] Register: 1 account/minute per IP
  - [ ] Password reset: 3 attempts/hour per email
- [ ] Test with rapid requests:
  - [ ] Attempt 6 logins → should get 429 error
  - [ ] Wait 1 minute → should work again
- [ ] Verify error message to user
- [ ] Test with multiple IPs (if possible)

**Estimated Time**: 2-3 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Automated + manual

---

### AUDIT-H3: Verify ID Registry Sync with Backend
**Impact**: Upload flow data must appear in my-ads  
**Audit Finding**: Claude #25  
**Files**: `my-ads.html`, `upload-review.html`, `app.py`  

**Checklist**:
- [ ] Verify `/api/ads/my-ads` returns all user ads
- [ ] Test upload flow:
  - [ ] Create new ad → publish
  - [ ] Refresh my-ads page
  - [ ] Verify ad appears within 1 second
- [ ] Check for race conditions
- [ ] Verify correct user filtering (user can only see own ads)
- [ ] Test with multiple users
- [ ] Verify timestamp sorting (newest first)

**Estimated Time**: 3-4 hours  
**Difficulty**: ⭐⭐⭐ Hard (integration testing)  
**Testing**: Integration tests + manual

---

### AUDIT-H4: Add Health Checks & Monitoring
**Impact**: Can detect when service is down  
**Audit Finding**: Claude #38  
**Files**: `app.py` (backend), Sentry setup  

**Checklist - Backend**:
- [ ] Ensure `/health` endpoint exists
- [ ] Test `/health` returns `{"status": "ok"}` with 200 status
- [ ] Install Sentry: `pip install sentry-sdk`
- [ ] Initialize in `app.py` with DSN from environment
- [ ] Test error capture:
  - [ ] Trigger intentional error
  - [ ] Verify appears in Sentry dashboard

**Checklist - Frontend**:
- [ ] Add Sentry to frontend CDN
- [ ] Initialize with DSN
- [ ] Test error capture from client-side

**Checklist - Infrastructure**:
- [ ] Set up Azure Monitor alerts for errors
- [ ] Configure notification channels (email/SMS)

**Estimated Time**: 2-3 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Error injection + dashboard verification

---

### AUDIT-H5: Database Backups & Disaster Recovery
**Impact**: Can recover data if corruption occurs  
**Audit Finding**: Claude #40  
**Service**: Azure PostgreSQL  

**Checklist**:
- [ ] Enable Azure PostgreSQL automated daily backups
- [ ] Verify retention (recommend 7-30 days)
- [ ] Test point-in-time restore on test database
- [ ] Document backup locations
- [ ] Create runbook: "How to restore from backup"
- [ ] Test recovery procedures
- [ ] Enable R2 versioning (if not already)
- [ ] Document recovery SLOs

**Estimated Time**: 1-2 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Recovery drill

---

## 🟡 MEDIUM PRIORITY (Week 2-3 - 15-21 hours)

### AUDIT-M1: Set Up CI/CD Pipeline (GitHub Actions)
**Impact**: Automated testing + deployment  
**Files**: `.github/workflows/deploy.yml` (new)  

**Checklist**:
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Add steps:
  - [ ] Checkout code
  - [ ] Run Python linter (flake8)
  - [ ] Run unit tests (if available)
  - [ ] Build Docker image
  - [ ] Push to Azure Container Registry
  - [ ] Deploy to Azure Container Apps (if tests pass)
- [ ] Test workflow on PR
- [ ] Verify tests pass before deploy
- [ ] Verify deploy only happens on main branch

**Estimated Time**: 4-6 hours  
**Difficulty**: ⭐⭐⭐ Hard  
**Testing**: CI/CD workflow verification

---

### AUDIT-M2: API Documentation (API_REFERENCE.md)
**Impact**: Easier onboarding for developers  
**Files**: `docs/API_REFERENCE.md` (new)  

**Checklist**:
- [ ] List all API endpoints with:
  - [ ] HTTP method (GET, POST, etc.)
  - [ ] Path (`/api/users`, etc.)
  - [ ] Authentication required (yes/no)
  - [ ] Request body example (if POST/PUT)
  - [ ] Response example (success)
  - [ ] Error examples (400, 401, 500)
- [ ] Document rate limits per endpoint
- [ ] Document authentication method (Bearer token, etc.)
- [ ] Consider Swagger/OpenAPI integration

**Estimated Time**: 3-4 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Manual documentation review

---

### AUDIT-M3: Consolidate Feather Icons
**Impact**: Eliminate duplicate icon CDN loads  
**Files**: Multiple HTML files  

**Checklist**:
- [ ] Identify all `feather.replace()` calls
- [ ] Create `js/icons-debouncer.js` with debounced helper
- [ ] Replace all calls with `window.replaceFeatherIcons()`
- [ ] Load Feather CDN only once per page
- [ ] Test:
  - [ ] Load each page
  - [ ] Verify icons render correctly
  - [ ] Check DevTools Network tab (only 1 Feather load)

**Estimated Time**: 1-2 hours  
**Difficulty**: ⭐ Easy  
**Testing**: Manual browser testing

---

### AUDIT-M4: Confirmation Dialogs for Destructive Actions
**Impact**: Prevent accidental deletes  
**Files**: `my-ads.html`, `components/user-dropdown.js`  

**Checklist**:
- [ ] Add confirmation modal for delete ad button
- [ ] Add confirmation modal for logout
- [ ] Match design to dark mode theme
- [ ] Test:
  - [ ] Click delete → modal appears
  - [ ] Click cancel → dismissed
  - [ ] Click confirm → deletes
  - [ ] Click logout → modal appears

**Estimated Time**: 2-3 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Manual workflow testing

---

### AUDIT-M5: Video Preload Optimization
**Impact**: Don't waste bandwidth on unseen videos  
**Files**: Category HTML files  

**Checklist**:
- [ ] Add Intersection Observer to detect visible videos
- [ ] Set `preload="none"` by default on video elements
- [ ] When video enters viewport, set `preload="metadata"`
- [ ] Test:
  - [ ] Load page → check Network (no video loads)
  - [ ] Scroll to video → check Network (metadata loads)

**Estimated Time**: 2-3 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Network inspection

---

### AUDIT-M6: Parallelize Image Resizing
**Impact**: Faster image upload (10 images in 2s vs 10s)  
**Files**: `upload.html`  

**Checklist**:
- [ ] Replace sequential image resizing with Promise.all()
- [ ] Add progress indicator: "Processing 3/10 images..."
- [ ] Test with 10 images:
  - [ ] Measure time (should be ~2-3s not 10s)
  - [ ] Verify all images resized correctly

**Estimated Time**: 2-3 hours  
**Difficulty**: ⭐⭐ Medium  
**Testing**: Performance measurement

---

## 🔵 STRATEGIC (Post-Launch - 8-12 days)

### AUDIT-S1: Video Quality Variants (360p/720p/1080p)
**Effort**: 2-3 days  
**Priority**: ⭐⭐⭐⭐ High ROI  

### AUDIT-S2: Comprehensive E2E Test Suite
**Effort**: 3-4 days  
**Priority**: ⭐⭐⭐⭐ Prevents regressions  

### AUDIT-S3: Professional Email Templates
**Effort**: 2-3 hours  
**Priority**: ⭐⭐⭐ Brand consistency  

---

## Summary

| Category | Items | Time | Status |
|----------|-------|------|--------|
| CRITICAL | 4 | 4 hrs | ⏳ Start TODAY |
| HIGH | 5 | 13-18 hrs | ⏳ Week 1-2 |
| MEDIUM | 6 | 15-21 hrs | ⏳ Week 2-3 |
| STRATEGIC | 3 | 8-12 days | ⏳ Month 2-3 |
| **TOTAL** | **18** | **~7-10 days** | Ready |

---

## Sign-Off

**Prepared By**: [Your Name]  
**Reviewed By**: [Manager Name]  
**Approved By**: [Product Lead]  

**Start Date**: ___________  
**Target Completion**: ___________  
**Actual Completion**: ___________  

---

**Note**: This checklist is a detailed implementation guide. Check off each item as completed. If any item is blocked, escalate immediately.
