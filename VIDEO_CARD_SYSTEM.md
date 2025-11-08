# Video Card Component & ID System Usage Guide

## Overview
The VidX platform now has a **global video card component** and **ID generation system** that ensures consistency across all pages.

## Core Components

### 1. ID Generator (`js/id-generator.js`)
Generates and tracks unique IDs for all ads/videos.

### 2. Video Card Component (`components/video-card.js`)
Generates consistent video card HTML structure.

### 3. Video Card Engagement (`js/video-card-engagement.js`)
Handles like, favorite, and share functionality (already exists).

## Required Scripts (Add to `<head>` in this order)

```html
<script src="js/id-generator.js"></script>
<script src="components/video-card.js"></script>
<script src="js/video-card-engagement.js"></script>
```

---

## Usage Examples

### Example 1: Creating Video Cards Dynamically

```javascript
// Generate IDs and create video data
const videoData = [
    {
        id: idGenerator.generateFromTitle('VW Transporter T6.1 2021', 'auto'),
        videoUrl: 'Demo ads/VW.m4v',
        title: 'VW Transporter T6.1 2021',
        price: '€28,500',
        seller: 'John Doe',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        location: 'București',
        timeAgo: '2 days ago',
        description: '150,000 km | Manual | Diesel',
        favoriteCount: 15,
        messageCount: 12,
        attributes: {
            make: 'VW',
            year: '2021',
            transmission: 'Manual',
            fuel: 'Diesel'
        }
    },
    {
        id: idGenerator.generateFromTitle('Audi A5 Sportback', 'auto'),
        videoUrl: 'Demo ads/Audi.m4v',
        title: 'Audi A5 Sportback',
        price: '€35,900',
        seller: 'Jane Smith',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        location: 'Cluj-Napoca',
        timeAgo: '1 day ago',
        description: '32,000 km | Automatic | Petrol',
        favoriteCount: 0,
        messageCount: 0,
        attributes: {
            make: 'Audi',
            year: '2020',
            transmission: 'Automatic',
            fuel: 'Petrol'
        }
    }
];

// Register ads in the ID system
videoData.forEach(ad => {
    idGenerator.registerAd(ad.id, {
        title: ad.title,
        category: 'automotive',
        price: ad.price,
        seller: ad.seller
    });
});

// Render video cards into a container
VideoCard.render('#video-grid', videoData);
```

### Example 2: Hardcoded HTML (Still Works!)

You can still write hardcoded video cards using the same structure:

```html
<div class="video-card" data-video-card data-make="VW" data-year="2021" data-details-url="details.html?ad=auto-vw-transporter-2021">
    <video loop playsinline preload="metadata">
        <source src="Demo ads/VW.m4v" type="video/mp4" />
        Your browser does not support the video tag.
    </video>
    
    <div class="volume-indicator">
        <i data-feather="volume-x" class="h-5 w-5 text-white volume-off"></i>
        <i data-feather="volume-2" class="h-5 w-5 text-white volume-on" style="display: none;"></i>
    </div>
    
    <div class="video-overlay">
        <div class="flex items-center mb-3">
            <img class="h-10 w-10 rounded-full" src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" alt="John Doe">
            <div class="ml-3">
                <h3 class="text-white font-medium">John Doe</h3>
                <p class="text-gray-300 text-sm">2 days ago · București</p>
            </div>
        </div>
        <a href="details.html?ad=auto-vw-transporter-2021" class="block group">
            <h2 class="text-lg font-bold text-white group-hover:text-indigo-400 transition">VW Transporter T6.1 2021</h2>
        </a>
        <p class="mt-1 text-gray-300 text-sm">150,000 km | Manual | Diesel</p>
        <div class="mt-3 flex items-center justify-between">
            <span class="text-xl font-bold text-white">€28,500</span>
            <div class="flex space-x-3">
                <!-- Like Button (Thumbs Up) -->
                <button class="flex items-center text-white group" data-like-btn data-ad-id="auto-vw-transporter-2021">
                    <i data-feather="thumbs-up" class="h-5 w-5 group-hover:text-indigo-400 transition"></i>
                </button>
                
                <!-- Favorite Button (Heart) with count -->
                <button class="flex items-center text-white group" data-favorite-btn data-ad-id="auto-vw-transporter-2021" data-favorite-count="15">
                    <i data-feather="heart" class="h-5 w-5 group-hover:text-pink-500 transition"></i>
                    <span class="ml-1 text-sm" data-count-display>15</span>
                </button>
                
                <!-- Message Button -->
                <button class="flex items-center text-white group">
                    <i data-feather="message-square" class="h-5 w-5 group-hover:text-blue-500 transition"></i>
                    <span class="ml-1 text-sm">12</span>
                </button>
                
                <!-- Share Button -->
                <button class="flex items-center text-white group" data-share-btn data-ad-id="auto-vw-transporter-2021" data-ad-title="VW Transporter T6.1 2021" data-ad-price="€28,500">
                    <i data-feather="share-2" class="h-5 w-5 group-hover:text-green-500 transition"></i>
                </button>
            </div>
        </div>
    </div>
</div>
```

### Example 3: Generating Single Card HTML

```javascript
const cardHTML = VideoCard.generate({
    id: 'auto-bmw-x5-2022',
    videoUrl: 'Demo ads/BMW.m4v',
    title: 'BMW X5 M Sport',
    price: '€65,000',
    seller: 'Mike Johnson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    location: 'Brașov',
    timeAgo: '3 hours ago',
    description: '45,000 km | Automatic | Diesel',
    favoriteCount: 28,
    messageCount: 15
});

// Insert into container
document.getElementById('video-grid').insertAdjacentHTML('beforeend', cardHTML);
```

---

## Button Icons Explained

| Button | Icon | Color | Purpose |
|--------|------|-------|---------|
| **Like** | `thumbs-up` | Indigo | User likes the ad |
| **Favorite** | `heart` | Pink | Save to favorites (with global count) |
| **Message** | `message-square` | Blue | Message seller (count display only) |
| **Share** | `share-2` | Green | Share ad via native share or clipboard |

---

## ID System Methods

```javascript
// Generate sequential ID
const id1 = idGenerator.generateID(); // "1001"
const id2 = idGenerator.generateID('auto'); // "auto-1002"

// Generate from title
const id3 = idGenerator.generateFromTitle('VW Transporter 2021', 'auto'); 
// "auto-vw-transporter-2021"

// Register ad
idGenerator.registerAd('auto-vw-transporter-2021', {
    title: 'VW Transporter T6.1 2021',
    category: 'automotive',
    price: '€28,500',
    seller: 'John Doe'
});

// Get ad metadata
const ad = idGenerator.getAd('auto-vw-transporter-2021');

// Get all ads
const allAds = idGenerator.getAllAds();

// Get ads by category
const autoAds = idGenerator.getAdsByCategory('automotive');

// Check if ID exists
const exists = idGenerator.idExists('auto-vw-transporter-2021'); // true
```

---

## Migration Guide

### For Existing Pages (like automotive.html, fashion.html, etc.)

**Option 1: Keep Hardcoded (No Changes Needed)**
- Just ensure buttons use correct data attributes: `data-like-btn`, `data-favorite-btn`, `data-share-btn`
- Ensure proper icons: thumbs-up, heart, message-square, share-2

**Option 2: Convert to Dynamic Rendering**
1. Add scripts to `<head>`:
   ```html
   <script src="js/id-generator.js"></script>
   <script src="components/video-card.js"></script>
   <script src="js/video-card-engagement.js"></script>
   ```

2. Create data array in your page script:
   ```javascript
   const videoData = [...]; // Array of video objects
   VideoCard.render('#video-grid', videoData);
   ```

---

## Best Practices

1. **Always use unique IDs** - Use `idGenerator.generateFromTitle()` for consistency
2. **Register all ads** - Use `idGenerator.registerAd()` to track metadata
3. **Use data attributes** - Not CSS classes for engagement buttons
4. **Consistent icons** - thumbs-up (like), heart (favorite), message-square (message), share-2 (share)
5. **Include feather.replace()** - After dynamic rendering to render icons

---

## Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Category - VidX</title>
    
    <!-- Core scripts -->
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="components/auth-modal.js"></script>
    
    <!-- ID and Video Card System -->
    <script src="js/id-generator.js"></script>
    <script src="components/video-card.js"></script>
    <script src="js/video-card-engagement.js"></script>
</head>
<body>
    <div id="video-grid" class="video-grid"></div>
    
    <script type="module">
        // Define video data
        const videos = [
            {
                id: idGenerator.generateFromTitle('Product Name', 'category'),
                videoUrl: 'path/to/video.mp4',
                title: 'Product Name',
                price: '€100',
                seller: 'Seller Name',
                sellerAvatar: 'avatar-url',
                location: 'Location',
                timeAgo: '1 day ago',
                description: 'Description here',
                favoriteCount: 10,
                messageCount: 5
            }
        ];
        
        // Render cards
        VideoCard.render('#video-grid', videos);
    </script>
</body>
</html>
```
