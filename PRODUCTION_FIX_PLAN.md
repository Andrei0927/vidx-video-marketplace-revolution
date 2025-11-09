# Production Fix Work Plan - November 10, 2025

**Strategy**: Fix in production (since platform is partially broken), then implement local development workflow once stable.

**Current Status**:
- ✅ Backend deployed (Azure Container Apps)
- ✅ Frontend deployed (Azure Static Web Apps)
- ✅ Authentication loop fixed (UPLOAD_BUG)
- ✅ Video generation pipeline deployed
- ⚠️ Platform partially functional but needs critical audit fixes

---

## 🎯 Priority 1: CRITICAL FIXES (4 hours total)

These 4 items **MUST** be fixed before any new features or optimization work.

### C1: Fix Storage Manager Metadata Bug (NaN timestamps)
**File**: `js/storage-manager.js`  
**Issue**: `getDraft()` returns only `.data`, losing timestamp metadata  
**User Impact**: Resume banner shows "NaN minutes ago" instead of "5 minutes ago"  
**Severity**: 🔴 CRITICAL - Trust destroyer  
**Effort**: 30 minutes

**Steps**:
1. Read `js/storage-manager.js` lines 40-92
2. Current: `resolve(request.result.data)` - loses timestamp
3. Change to: `resolve(request.result)` - returns full object with timestamp
4. Update `upload.html` to access `draft.timestamp` instead of `draft.data.timestamp`
5. Test:
   - Create upload draft
   - Close tab
   - Return to upload.html
   - Verify banner shows "X minutes ago" not "NaN minutes ago"

**Files to Modify**:
- `js/storage-manager.js` (getDraft method)
- `upload.html` (getDraft calls)

---

### C2: Remove Password Reset Code from API Response (SECURITY)
**File**: `app.py` (backend)  
**Issue**: Password reset endpoint returns 6-digit code in JSON response  
**User Impact**: Security vulnerability - accounts can be hijacked  
**Severity**: 🔴 CRITICAL - SECURITY BREACH  
**Effort**: 15 minutes

**Steps**:
1. Find `/api/password-reset` endpoint in `app.py`
2. Locate line returning `resetCode` in response JSON
3. Remove that line from response (code should ONLY go in email)
4. Verify email sending still works
5. Test:
   - Call API with valid email
   - Check network response (should NOT contain code)
   - Verify email was sent with code

**Files to Modify**:
- `app.py` (password reset endpoint)

---

### C3: Add Warning When Videos Filtered in Upload
**File**: `upload-review.html`  
**Issue**: When users upload video files, they're silently filtered without warning  
**User Impact**: Users confused why their videos disappear  
**Severity**: 🔴 CRITICAL - UX blocker (support tickets)  
**Effort**: 1 hour

**Steps**:
1. Find video filtering logic in `upload-review.html` (around line 270)
2. Detect when user provides video but no video in final output
3. Create warning modal:
   - HTML: "⚠️ Video format not supported - AI-generated thumbnail will be used instead"
   - Allow user to proceed or go back
4. Test:
   - Upload video in details form
   - Proceed to review
   - Verify warning modal appears
   - Click proceed → continues
   - Click back → returns to details

**Files to Modify**:
- `upload-review.html` (video filtering + warning modal)

---

### C4: Consolidate Dark Mode Code Duplication
**File**: 15+ HTML files  
**Issue**: Dark mode bootstrap code duplicated in every HTML file  
**User Impact**: Hard to maintain, technical debt  
**Severity**: 🔴 CRITICAL - Maintainability  
**Effort**: 2 hours

**Steps**:
1. Create new file: `js/theme-bootstrap.js`
2. Extract dark mode init code (from any HTML file)
3. Remove inline theme scripts from all HTML files
4. Add `<script src="js/theme-bootstrap.js"></script>` to each HTML file `<head>`
5. Test:
   - Load each HTML file
   - Verify theme persists
   - Toggle theme → verify works everywhere
   - Check console for errors

**Files to Modify**:
- Create: `js/theme-bootstrap.js`
- Modify: All ~15 HTML files (remove inline theme code)

---

## 🔴 Quick Checklist - Do These Today

```
Priority 1: CRITICAL FIXES (4 hours)
├─ [ ] C1: Fix storage manager metadata (30 min)
├─ [ ] C2: Remove password reset code from response (15 min)
├─ [ ] C3: Add video filtering warning (1 hour)
└─ [ ] C4: Consolidate dark mode code (2 hours)

Total: ~4 hours of work
```

**After these are done**: Platform will be much more stable and trustworthy.

---

## 📋 Execution Order

**Recommended**: Do in this order (easier to hardest)

1. **C2: Password reset** (15 min) - Easiest, immediate security win
2. **C1: Storage metadata** (30 min) - Quick fix, improves UX
3. **C3: Video warning** (1 hour) - UX improvement, reduces support tickets
4. **C4: Dark mode** (2 hours) - Technical debt, prepares for future work

**Total time**: ~4 hours  
**Estimated completion**: Today or tomorrow

---

## 🚀 After Critical Fixes

Once C1-C4 are done:
- Platform will be stable and trustworthy
- Ready for High-Priority fixes (H1-H5)
- Can then set up proper local development workflow
- Then work on Medium-Priority and Strategic items

---

## 📝 Next Document to Update

Once all fixes are committed and deployed:
- Update `COMPREHENSIVE_WORK_REPORT.md` with fixes completed
- Update `IMPLEMENTATION_CHECKLIST.md` with actual commit hashes
- Create branch for local development (develop branch)

---

**Ready to start?** Begin with C2 (password reset) - quickest security fix.
