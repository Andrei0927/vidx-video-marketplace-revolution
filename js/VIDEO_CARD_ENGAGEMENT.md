# Video Card Engagement Component

## Overview

Global component that handles **Like**, **Favorite**, and **Share** functionality for all video cards across the VidX platform. Works with both static HTML cards and dynamically loaded content (from Revid API or other sources).

## Features

### 1. Like Button (Algorithmic Engagement)
- **Visual State Only** - No counter displayed to users
- **User-Specific** - Each user's likes are stored separately
- **Automatic State** - Icon fills with indigo color when liked
- **Login Optional** - Can work without login (for algorithm training)

### 2. Favorite Button (User Collections)
- **Global Counter** - Shows total favorites across all users
- **User-Specific State** - Heart fills pink when user favorites
- **Dynamic Updates** - Counter increments/decrements in real-time
- **Login Required** - Redirects to registration if not logged in

### 3. Share Button
- **Native Share API** - Uses device's native sharing on mobile
- **Clipboard Fallback** - Copies link on desktop browsers
- **Visual Feedback** - Shows checkmark when link copied
- **Deep Links** - Generates direct links to ad details page

## Usage

### Basic Setup

Add the script to your HTML page (after feather-icons):

```html
<script src="https://unpkg.com/feather-icons"></script>
<script src="components/auth-modal.js"></script>
<script src="js/video-card-engagement.js"></script>
```

### Video Card HTML Structure

```html
<div class="video-card">
    <!-- Video content -->
    
    <!-- Engagement Buttons -->
    <div class="engagement-buttons">
        <!-- Like Button (no counter) -->
        <button data-like-btn data-ad-id="unique-ad-id">
            <i data-feather="thumbs-up"></i>
        </button>
        
        <!-- Favorite Button (with counter) -->
        <button data-favorite-btn data-ad-id="unique-ad-id" data-favorite-count="15">
            <i data-feather="heart"></i>
            <span data-count-display>15</span>
        </button>
        
        <!-- Share Button -->
        <button data-share-btn 
                data-ad-id="unique-ad-id" 
                data-ad-title="Product Title" 
                data-ad-price="€1,000">
            <i data-feather="share-2"></i>
        </button>
    </div>
</div>
```

### Required Data Attributes

#### All Buttons
- `data-ad-id` - Unique identifier for the ad (required)

#### Like Button
- `data-like-btn` - Marks button as like handler

#### Favorite Button
- `data-favorite-btn` - Marks button as favorite handler
- `data-favorite-count` - Initial/base favorite count
- `data-count-display` - Span that shows current count

#### Share Button
- `data-share-btn` - Marks button as share handler
- `data-ad-title` - Product/ad title for share text
- `data-ad-price` - Price for share text

## Storage Schema

### User-Specific Likes (Algorithmic Only)
```javascript
localStorage.userLikes = {
  "user@example.com": ["ad-id-1", "ad-id-2"],
  "another@user.com": ["ad-id-3"]
}
```

### User-Specific Favorites (Collections)
```javascript
localStorage.userFavorites = {
  "user@example.com": ["ad-id-1", "ad-id-2"],
  "another@user.com": ["ad-id-1"]
}
```

### Global Favorite Counts (Shared)
```javascript
localStorage.globalFavoriteCounts = {
  "ad-id-1": 42,
  "ad-id-2": 15,
  "ad-id-3": 0
}
```

## Dynamic Content Support

When loading content dynamically (e.g., from Revid API), call `refreshButtonStates()`:

```javascript
// After loading new video cards
fetch('/api/ads')
  .then(res => res.json())
  .then(ads => {
    // Render ads to DOM
    renderAds(ads);
    
    // Refresh engagement button states
    if (window.videoCardEngagement) {
      window.videoCardEngagement.refreshButtonStates();
    }
    
    // Reinitialize feather icons
    feather.replace();
  });
```

## Public API

The global `videoCardEngagement` instance provides these methods:

### Check Status
```javascript
// Check if ad is favorited by current user
videoCardEngagement.isFavorited('ad-id-123'); // returns boolean

// Check if ad is liked by current user
videoCardEngagement.isLiked('ad-id-123'); // returns boolean

// Get global favorite count for an ad
videoCardEngagement.getFavoriteCount('ad-id-123'); // returns number
```

### Refresh States
```javascript
// After dynamically adding new video cards
videoCardEngagement.refreshButtonStates();
```

## How It Works

### Event Delegation
The component uses **event delegation** on the document level, so it works with:
- Static HTML content
- Dynamically loaded content (Revid API)
- Content loaded after page initialization
- Infinite scroll / pagination

### Initialization Flow
1. Component initializes on `DOMContentLoaded`
2. Sets up global click listener using event delegation
3. Reads user email and authentication state from localStorage
4. Loads user-specific likes and favorites
5. Initializes button states (filled icons, counters)

### Click Flow

#### Like Button
1. User clicks thumbs-up icon
2. Check if user email exists (can work without login for algorithm)
3. Toggle like state in `userLikes[email]` array
4. Add/remove `fill-indigo-400` class
5. Save to localStorage
6. (Future) Send to backend API

#### Favorite Button
1. User clicks heart icon
2. Check authentication (redirect if not logged in)
3. Toggle favorite state in `userFavorites[email]` array
4. Increment/decrement global counter in `globalFavoriteCounts`
5. Update counter display span
6. Add/remove `fill-pink-500` class
7. Save both to localStorage
8. (Future) Send to backend API

#### Share Button
1. User clicks share icon
2. Create share data object with title, text, URL
3. If `navigator.share` exists (mobile): use native sharing
4. If not (desktop): copy link to clipboard
5. Show visual feedback (checkmark icon for 2 seconds)

## Integration Checklist

- [ ] Add `<script src="js/video-card-engagement.js"></script>` to HTML
- [ ] Add required data attributes to buttons
- [ ] Test like button (visual state only, no counter)
- [ ] Test favorite button (counter increments/decrements)
- [ ] Test share button (native share on mobile, copy on desktop)
- [ ] Test login redirect for favorites
- [ ] Test user-specific state isolation
- [ ] Test with multiple users (different accounts)
- [ ] Test dynamic content loading (call `refreshButtonStates()`)

## Future Enhancements

- [ ] Backend API integration (POST to /api/engagement)
- [ ] Real-time synchronization across devices
- [ ] Analytics tracking for algorithmic engagement
- [ ] Favorite collections/playlists
- [ ] Share analytics (track share conversions)
- [ ] Social media share previews (Open Graph)

## Troubleshooting

### Buttons not working after dynamic load
Call `refreshButtonStates()` after adding new content to the DOM.

### Counter not updating
Ensure `data-count-display` span exists and `data-favorite-count` is set.

### Share not working on mobile
Check HTTPS requirement for `navigator.share()` API.

### Icons not rendering
Call `feather.replace()` after dynamic content loads.

### User state not persisting
Verify `userEmail` is stored in localStorage after login.
