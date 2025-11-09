# VidX Development Guide

## 🚀 Quick Start

### Option 1: One Command Start (Recommended)
```bash
./start_dev.sh
```

This starts both servers:
- Static files: `http://localhost:3000`
- Auth API: `http://localhost:3001`

### Option 2: Manual Start

**Terminal 1 - Static Server:**
```bash
python3 -m http.server 3000
```

**Terminal 2 - Auth Server:**
```bash
python3 auth_server.py
```

## 📁 Project Structure

```
vidx-video-marketplace-revolution/
├── index.html                 # Landing page
├── automotive.html            # Automotive marketplace
├── electronics.html           # Electronics marketplace
├── fashion.html              # Fashion marketplace
├── upload.html               # Upload step 1: Media
├── upload-details.html       # Upload step 2: Details
├── upload-review.html        # Upload step 3: Review & publish
├── details.html              # Ad detail pages
├── profile.html              # User profile
├── my-ads.html              # User's listings
│
├── js/
│   ├── auth-service.js       # Authentication client
│   ├── dark-mode.js          # Dark mode toggle
│   ├── filter-manager.js     # Category filters
│   └── [category]-page.js    # Category-specific logic
│
├── components/
│   ├── auth-modal.js         # Login/Register modal
│   └── user-dropdown.js      # User menu component
│
├── css/
│   └── dark-mode.css         # Dark theme styles
│
├── Demo ads/                 # Sample video files
│   ├── VW.m4v
│   └── Audi.m4v
│
├── auth_server.py            # Authentication API server
├── migrate_db.py             # Database migration script
├── auth_db.json              # User database
├── db.json                   # Old database (legacy)
│
├── AUTH_README.md            # Auth system documentation
└── DEV_GUIDE.md             # This file
```

## 🔐 Authentication System

### Database Structure

**auth_db.json:**
- `users[]` - User accounts (hashed passwords)
- `sessions[]` - Active login sessions
- `profiles[]` - User profile data

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | End session |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/verify` | Verify token |

### Test Credentials
```
Email: demo@example.com
Password: demo1234

Email: test@example.com  
Password: pass1234
```

## 🎨 Frontend Architecture

### Page Types

**1. Landing Page (index.html)**
- Category showcase
- Hero section
- PWA ready

**2. Category Pages (automotive.html, electronics.html, etc.)**
- TikTok-style video browsing
- Mobile: Snap scrolling, autoplay
- Desktop: Hover to play
- Filter system

**3. Upload Flow (3 steps)**
- Step 1: Media upload with AI options
- Step 2: Item details form
- Step 3: Review and publish

**4. Detail Pages**
- Portrait video display
- Seller information
- Contact options

### Components

**auth-modal.js** - Web component
```javascript
<auth-modal></auth-modal>
```
- Login/Register tabs
- Dark mode aware
- Validation

**user-dropdown.js** - Web component
```javascript
<user-dropdown id="user-menu"></user-dropdown>
```
- User menu
- Profile/Settings/Logout
- Portal rendering

### State Management

**localStorage Keys:**
- `theme` - 'light' or 'dark'
- `sessionToken` - Auth token
- `userId` - Current user ID
- `userName` - Display name
- `userEmail` - User email
- `userAvatar` - Avatar URL

**sessionStorage Keys:**
- `uploadData` - Upload step 1 data
- `uploadFiles` - Base64 file data
- `listingDetails` - Upload step 2 data
- `lastScrollPosition` - Video scroll state

## 🎥 Video System

### Desktop Behavior
- Hover to play
- Click to toggle mute
- Pause on mouse leave
- Volume indicator

### Mobile Behavior
- TikTok-style snap scrolling
- Autoplay when 75% visible
- Tap to toggle sound
- Full screen videos

### Video Requirements
- Format: .m4v, .mp4, .webm
- Portrait: 9:16 aspect ratio
- Max size: Varies by browser

## 🌓 Dark Mode

### Implementation
- Tailwind dark mode: `'class'` strategy
- CSS variables in `dark-mode.css`
- Toggle stored in localStorage
- Auto-applies on page load

### Colors
```javascript
dark: {
  50: '#18191A',   // Background
  100: '#242526',  // Cards
  200: '#3A3B3C',  // Borders
  300: '#4E4F50',  // Inputs
  400: '#6B6C6D',  // Muted
  500: '#B0B3B8',  // Secondary text
  600: '#E4E6EB',  // Primary text
  700: '#F5F6F7'   // Headers
}
```

## 🧪 Testing

### Manual Testing

**1. Authentication:**
```bash
# Register new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@new.com","password":"test1234"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}'
```

**2. Upload Flow:**
1. Navigate to `/upload.html`
2. Upload images/videos
3. Fill in details
4. Review and publish

**3. Video Browsing:**
1. Open `/automotive.html`
2. Desktop: Hover over videos
3. Mobile: Scroll to snap between videos

### iOS Testing

**Safari on iPhone:**
1. Open Settings > Developer > Enable Web Inspector
2. Connect to Mac
3. Safari > Develop > [Your iPhone]
4. Test upload flow, video playback

**Local Network Testing:**
1. Get your Mac's local IP: `ifconfig | grep "inet "`
2. Access from iOS: `http://192.168.x.x:3000`
3. Auth will use localStorage (no backend needed)

## 🐛 Common Issues

### Issue: "User not found" on iOS
**Solution:** Remote devices use localStorage auth (no backend). Create a new account or use the auth modal.

### Issue: Videos not playing
**Solution:**
- Check preload="metadata"
- Verify video paths
- Check console for errors
- iOS: Requires user interaction

### Issue: Upload button doesn't work
**Solution:**
- Check console logs
- Verify files are selected
- May need to allow camera/photos permission

### Issue: Dark mode not working
**Solution:**
- Check localStorage.theme value
- Verify dark-mode.css loaded
- Clear cache and reload

## 🚢 Deployment

### Static Hosting (GitHub Pages, Netlify, etc.)
```bash
# Build is already static - just upload:
- index.html
- *.html files
- js/
- css/
- components/
- Demo ads/
```

### Backend Deployment

**Option 1: Heroku/Railway**
```bash
# Procfile
web: python3 auth_server.py
```

**Option 2: VPS (DigitalOcean, AWS, etc.)**
```bash
# Use systemd or PM2
pm2 start auth_server.py --name vidx-auth
```

**Option 3: Serverless (AWS Lambda, Vercel)**
- Convert auth_server.py to AWS Lambda function
- Or use Vercel serverless functions

### Database Migration

**PostgreSQL Example:**
```sql
-- See AUTH_README.md for full schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 📚 Next Steps

### Immediate
- [ ] Fix remaining iOS bugs
- [ ] Add email verification
- [ ] Implement real Revid.ai API
- [ ] Add more demo videos

### Short Term
- [ ] Migrate to PostgreSQL
- [ ] Add Stripe payments
- [ ] Build messaging system
- [ ] Add search functionality

### Long Term
- [ ] Native iOS/Android apps
- [ ] AI video generation
- [ ] Analytics dashboard
- [ ] Admin panel

## 🔧 Development Tips

1. **Use the dev script:** `./start_dev.sh` for easy startup
2. **Check console:** Always open browser DevTools
3. **Test both themes:** Toggle dark mode frequently
4. **Test mobile:** Use Chrome DevTools device emulation
5. **Version control:** Commit often with descriptive messages
6. **Document changes:** Update this guide when adding features

## 📖 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Feather Icons](https://feathericons.com/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
