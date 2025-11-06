# Video Loading & Filter Button Fixes

## Issues Fixed

### 1. Filter Button Error
**Problem:** Clicking the vertical filter button caused JavaScript error:
```
Uncaught TypeError: Cannot read properties of null (reading 'className')
```

**Cause:** The vertical filter button (`#vertical-filter-btn`) is a link to `search.html`, not a dropdown. The JavaScript was trying to find a `#vertical-filter-menu` element that doesn't exist.

**Fix:** Added check to skip vertical filter button in the dropdown logic:
```javascript
if (btn.id === 'vertical-filter-btn') {
    return; // Let the link work normally
}
```

### 2. Video Loading Issues
**Problem:** Videos showing black screen on:
- Safari (desktop & iOS)
- Brave/Chromium
- Android Chrome (showed first frame but wouldn't play)

**Root Causes:**
1. `preload="metadata"` only loads metadata, not enough to show video
2. Just setting `currentTime` doesn't render frame in many browsers
3. Browsers require actual play() to render video content

**Fixes Applied:**

#### Change 1: Preload Strategy
```html
<!-- Before -->
<video loop playsinline preload="metadata">

<!-- After -->
<video loop playsinline preload="auto" muted>
```
- Changed to `preload="auto"` to load more video data
- Added `muted` attribute for better autoplay compatibility

#### Change 2: First Frame Display
Instead of just setting `currentTime`, now using play-then-pause strategy:
```javascript
const showFirstFrame = () => {
    video.muted = true;
    video.play().then(() => {
        // Pause after brief moment to show first frame
        setTimeout(() => {
            if (!isMobile || index !== 0) {
                video.pause();
                video.currentTime = 0;
            }
        }, 100);
    }).catch(err => {
        // Fallback to currentTime
        video.currentTime = 0.1;
    });
};
```

This works because:
- Play() forces browser to render video
- 100ms is enough to show frame
- Catches errors gracefully for restricted autoplay

#### Change 3: Mobile Autoplay
Simplified intersection observer logic:
- Removed duplicate first-video autoplay (handled by showFirstFrame)
- Better error handling with play promise
- Added console logging for debugging

## Testing Checklist

Test on each platform:
- [ ] Desktop Safari - First frame visible, hover to play
- [ ] Desktop Chrome/Brave - First frame visible, hover to play  
- [ ] iOS Safari - First frame visible, scroll to autoplay
- [ ] Android Chrome - First frame visible, scroll to autoplay
- [ ] PWA iOS - Works in installed app
- [ ] PWA Android - Works in installed app
- [ ] Filter button - No errors, redirects to search.html

## Expected Behavior

**Desktop:**
1. Page loads → First frame of each video visible
2. Hover over video → Video plays with sound
3. Move mouse away → Video pauses and resets
4. Click during playback → Toggle mute

**Mobile:**
1. Page loads → First frame of each video visible
2. Scroll to video (75% visible) → Video autoplays muted
3. Tap video → Toggle sound
4. Scroll away → Video pauses and resets

**Filter Button:**
- Click → Redirects to search.html (no errors)
