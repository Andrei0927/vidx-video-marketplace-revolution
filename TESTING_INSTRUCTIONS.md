# Testing Instructions - Upload Page Fix

**Status:** ✅ Fix deployed and live

## What Was Fixed

The authentication loop bug where users couldn't access upload.html even after logging in successfully. The issue was caused by empty `fullName` in the database being stored as an empty string, which failed the authentication check.

**Fix:** Auth modal now uses email as fallback when fullName is empty.

---

## How to Test the Fix

### Step 1: Clear Your Browser Data

**In Brave/Chrome:**
```javascript
// Open DevTools (F12 or Cmd+Option+I)
// Go to Console tab
// Run this command:
localStorage.clear();
```

**Or manually:**
1. Open DevTools → Application tab
2. Left sidebar → Storage → Local Storage
3. Right-click → Clear

### Step 2: Hard Refresh the Upload Page

**Keyboard shortcut:**
- **macOS:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + F5`

**Or:**
1. Open DevTools
2. Network tab → Check "Disable cache"
3. Refresh page

### Step 3: Log In Again

Navigate to: https://mango-desert-0f205db03.3.azurestaticapps.net/upload.html

**Test Account:**
- Email: `testlive@example.com`
- Password: (your password)

**Expected Behavior:**
1. ✅ Login modal appears
2. ✅ Enter credentials
3. ✅ Login succeeds
4. ✅ Page reloads
5. ✅ **Upload form displays** (no more loop!)

### Step 4: Verify in Console

With DevTools open (Preserve Log enabled):

**Expected logs:**
```
[Upload] Auth check: {hasSessionToken: true, hasUserName: true, sessionToken: '...'}
// userName should now be 'testlive@example.com' (your email)
```

**What changed:**
```diff
- userName: ''  ❌ (empty - caused loop)
+ userName: 'testlive@example.com'  ✅ (email fallback)
```

---

## Troubleshooting

### Issue: Still seeing login loop

**Solution:**
1. Ensure you cleared localStorage completely
2. Hard refresh with `Cmd+Shift+R`
3. Wait 2-3 minutes for CDN cache to clear
4. Try incognito/private browsing mode

### Issue: Can't see console logs

**Solution:**
1. Open DevTools: `Cmd+Option+I` (Mac) or `F12` (Windows)
2. Go to Console tab
3. Check "Preserve log" checkbox
4. Refresh page

### Issue: Login credentials don't work

**Solution:**
1. Try registering a new account
2. Use the debug page: https://mango-desert-0f205db03.3.azurestaticapps.net/debug-auth.html
3. Check backend health: https://video-marketplace-api.victoriousforest-01a281fd.northeurope.azurecontainerapps.io/health

---

## What Happens Next

Once logged in successfully:

1. **Upload form appears** with:
   - File upload area (drag & drop)
   - AI video options
   - "Next: Add Details" button

2. **Your name displays** in the nav bar:
   - If you have a full name: Shows full name
   - If not: Shows your email address

3. **You can now test video generation:**
   - Upload 2-5 images
   - Click "Next: Add Details"
   - Fill in product information
   - Generate AI video!

---

## Related Documentation

- **Bug Report:** `UPLOAD_BUG.md` - Detailed analysis of the issue
- **Upload Flow:** `docs/guides/UPLOAD_FLOW_REVIEW.md` - Complete upload flow documentation
- **Debug Tool:** `debug-auth.html` - Interactive debugging page
- **Video Testing:** `docs/guides/VIDEO_TESTING_GUIDE.md` - Video generation testing guide

---

## Need Help?

If you encounter any issues:

1. **Check the debug page:**
   https://mango-desert-0f205db03.3.azurestaticapps.net/debug-auth.html

2. **Verify backend health:**
   https://video-marketplace-api.victoriousforest-01a281fd.northeurope.azurecontainerapps.io/health

3. **Review console logs** with "Preserve log" enabled

4. **Share error messages** from the console for debugging

---

**Last Updated:** 2025-11-09  
**Fix Version:** Commit `6279980` + `4bf9d80`  
**Status:** ✅ Live and working
