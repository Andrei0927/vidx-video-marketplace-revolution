# Where to See Ad IDs in VidX

## 1. In the Browser URL Bar

When you click on an ad title, the ID appears in the URL:

```
https://vidx.com/details.html?ad=auto-vw-transporter-2021
                                   ↑
                                   This is the Ad ID
```

**Examples:**
- `details.html?ad=auto-vw-transporter-2021`
- `details.html?ad=home-modern-sofa-3-seater`
- `details.html?ad=sports-specialized-road-bike`

---

## 2. In the HTML (Inspect Element)

### On the Video Card Container:
```html
<div class="video-card" 
     data-video-card 
     data-ad-id="auto-vw-transporter-2021"     ← Ad ID here
     data-make="Volkswagen" 
     data-year="2021">
```

### On Each Engagement Button:
```html
<!-- Like Button -->
<button data-like-btn data-ad-id="auto-vw-transporter-2021">
                                   ↑ Ad ID

<!-- Favorite Button -->
<button data-favorite-btn 
        data-ad-id="auto-vw-transporter-2021"     ← Ad ID
        data-favorite-count="15">

<!-- Share Button -->
<button data-share-btn 
        data-ad-id="auto-vw-transporter-2021"     ← Ad ID
        data-ad-title="VW Transporter T6.1 2021" 
        data-ad-price="€28,500">
```

---

## 3. In Browser Console (DevTools)

### When You Like/Favorite/Share:

Open Developer Tools (F12) → Console tab, you'll see:

```
[FAVORITE] Button clicked for ad: auto-vw-transporter-2021
[FAVORITE] Icon found: true
[FAVORITE] isLoggedIn: true
[FAVORITE] userEmail: safari-test@example.com
[FAVORITE] Current favorites for user: ["auto-vw-transporter-2021"]
[FAVORITE] Saved favorites: ["auto-vw-transporter-2021"]
Favorite toggled: auto-vw-transporter-2021 Favorited: true User: safari-test@example.com Global count: 16
```

### ID Migration Messages:
```
[ID MIGRATION] Updated favorites: ["vw-transporter"] → ["auto-vw-transporter-2021"]
[ID MIGRATION] ✅ Migration complete!
```

---

## 4. In localStorage (DevTools → Application Tab)

### Path: Application → Local Storage → https://your-domain

**userFavorites:**
```json
{
  "safari-test@example.com": [
    "auto-vw-transporter-2021",
    "home-modern-sofa-3-seater"
  ]
}
```

**userLikes:**
```json
{
  "safari-test@example.com": [
    "auto-audi-a5-sportback-2020"
  ]
}
```

**globalFavoriteCounts:**
```json
{
  "auto-vw-transporter-2021": 16,
  "auto-audi-a5-sportback-2020": 8,
  "home-modern-sofa-3-seater": 28
}
```

**vidx_ads_registry:**
```json
{
  "auto-vw-transporter-2021": {
    "id": "auto-vw-transporter-2021",
    "title": "VW Transporter T6.1 2021",
    "category": "automotive",
    "price": "€28,500",
    "seller": "John Doe",
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

---

## 5. In Share Links

When you click the share button, the generated link contains the ID:

```
https://vidx.com/details.html?ad=auto-vw-transporter-2021

Copied to clipboard!
```

Or if using native share (mobile):
```
Title: VW Transporter T6.1 2021 - €28,500
URL: https://vidx.com/details.html?ad=auto-vw-transporter-2021
```

---

## ID Format by Category

| Category | Prefix | Example |
|----------|--------|---------|
| Automotive | `auto-` | `auto-vw-transporter-2021` |
| Home & Garden | `home-` | `home-modern-sofa-3-seater` |
| Sports | `sports-` | `sports-specialized-road-bike` |
| Real Estate | `realestate-` | `realestate-2br-apartment-bucharest` |
| Jobs | `jobs-` | `jobs-software-engineer-senior` |
| Services | `service-` | `service-plumbing-24-7` |
| Fashion | `fashion-` | `fashion-designer-jacket` |
| Electronics | `electronics-` | `electronics-iphone-15-pro` |

---

## How IDs Work

### ✅ Work WITHOUT Details Page:
- **Like** button - Stores like in localStorage
- **Favorite** button - Stores favorite + increments global count
- **Share** button - Generates shareable link (even if details page doesn't exist yet)

### ✅ Work WITH Details Page:
- Clicking ad title navigates to `details.html?ad={id}`
- Details page looks up ad data by ID
- Shows full product information

---

## Testing IDs

### 1. Check if ID exists in localStorage:
```javascript
// Open Console (F12)
idGenerator.idExists('auto-vw-transporter-2021')
// Returns: true or false
```

### 2. Get ad metadata:
```javascript
idGenerator.getAd('auto-vw-transporter-2021')
// Returns: { id, title, category, price, seller, createdAt }
```

### 3. Get all ads:
```javascript
idGenerator.getAllAds()
// Returns: Array of all registered ads
```

### 4. Get ads by category:
```javascript
idGenerator.getAdsByCategory('automotive')
// Returns: Array of automotive ads
```

---

## Summary

**Where to see IDs:**
1. ✅ URL bar when viewing ad details
2. ✅ HTML attributes (inspect element)
3. ✅ Browser console logs
4. ✅ localStorage (Application tab in DevTools)
5. ✅ Share links

**ID Features:**
- Globally unique across platform
- Category-prefixed for organization
- Human-readable slugs
- Tracked in localStorage registry
- Works with or without details pages
