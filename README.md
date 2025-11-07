---
title: VidX - Video Marketplace Revolution 🚀
colorFrom: green
colorTo: green
emoji: 🎥
sdk: static
pinned: false
tags:
  - marketplace
  - ai-video
  - revid-ai
  - authentication
---

# VidX - Video Marketplace Revolution 🎥

A modern video-first marketplace where AI creates professional video ads automatically from your photos and descriptions.

## ✨ Key Features

### 🤖 AI-Powered Video Creation
- **Automatic Script Generation**: AI writes engaging promotional copy from your description
- **Professional Voiceover**: Consistent brand voice (TTS) like TikTok's signature sound
- **Auto Captions**: Accessibility-friendly animated captions
- **Smart Transitions**: TikTok-style slideshow format optimized for mobile
- **Background Music**: Curated music options (Upbeat, Calm, Energetic, None)

### 🔐 Secure Authentication
- **Password Hashing**: SHA-256 with salt (ready for bcrypt upgrade)
- **Session Management**: Secure token-based sessions
- **Profile System**: User profiles with avatars from DiceBear
- **Local Development**: Works on localhost with fallback for iOS

### 📱 Mobile-First Design
- **TikTok-Style Scrolling**: Full-screen snap scrolling on automotive page
- **Hover-to-Play**: Desktop videos play on hover, pause on leave
- **Dark Mode**: Full dark mode support across all pages
- **Responsive**: Optimized for mobile, tablet, and desktop

### 🎬 Upload Flow
1. **Upload Images** → Select background music
2. **Add Details** → Product info, category, pricing
3. **AI Generation** → Revid.ai creates professional video (1-2 min)
4. **Publish** → Video ad goes live on marketplace

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://huggingface.co/spaces/andrei-09/vidx-video-marketplace-revolution
cd vidx-video-marketplace-revolution
```

### 2. Start Development Servers
```bash
chmod +x start_dev.sh
./start_dev.sh
```

This starts:
- Static server on http://localhost:3000
- Auth API server on http://localhost:3001

### 3. Configure Revid.ai API

**Get API Key**:
1. Sign up at [revid.ai](https://www.revid.ai/)
2. Purchase credits
3. Copy API key from dashboard

**Add to Project**:
```javascript
// js/revid-service.js (line 9)
this.apiKey = 'your-actual-revid-api-key-here';
```

### 4. Test the App
- Browse marketplace: http://localhost:3000
- Upload ad: http://localhost:3000/upload.html
- Login/Register: Click user icon

## 📚 Documentation

- **[REVID_QUICKSTART.md](./REVID_QUICKSTART.md)** - Quick start for Revid API
- **[REVID_INTEGRATION.md](./REVID_INTEGRATION.md)** - Complete API documentation
- **[DEV_GUIDE.md](./DEV_GUIDE.md)** - Development guide & project structure
- **[AUTH_README.md](./AUTH_README.md)** - Authentication system docs

## 🛠️ Tech Stack

### Frontend
- **Tailwind CSS** - Utility-first styling
- **Feather Icons** - Beautiful icon set
- **Web Components** - Reusable UI components
- **Vanilla JS** - No heavy frameworks

### Backend
- **Python 3** - Auth server
- **JSON Database** - Simple file-based storage (ready for PostgreSQL)
- **REST API** - CORS-enabled authentication endpoints

### AI Integration
- **Revid.ai** - Video generation
- **TTS** - Professional voiceover
- **Auto Captions** - TikTok-style captions

## 📂 Project Structure

```
vidx-video-marketplace-revolution/
├── index.html              # Homepage
├── automotive.html         # TikTok-style video feed
├── details.html           # Ad detail page
├── upload.html            # Step 1: Upload images
├── upload-details.html    # Step 2: Add details
├── upload-review.html     # Step 3: Generate & publish
├── login.html             # Auth pages
├── register.html
├── profile.html
├── my-ads.html
│
├── js/
│   ├── auth-service.js    # Auth API wrapper
│   ├── revid-service.js   # Revid AI integration ⭐
│   └── dark-mode.js       # Theme management
│
├── components/
│   ├── auth-modal.js      # Login/register modal
│   └── user-dropdown.js   # User menu component
│
├── css/
│   └── dark-mode.css      # Dark mode styles
│
├── auth_server.py         # Authentication API
├── auth_db.json          # User database
├── start_dev.sh          # Development startup script
│
└── docs/
    ├── REVID_QUICKSTART.md
    ├── REVID_INTEGRATION.md
    ├── DEV_GUIDE.md
    └── AUTH_README.md
```

## 🎯 Features Breakdown

### Marketplace Pages
- **index.html** - Homepage with category grid
- **automotive.html** - TikTok-style full-screen scrolling
- **electronics.html** - Standard grid layout
- **fashion.html** - Grid layout
- **details.html** - Individual ad details with video

### Upload Flow (3 Steps)
1. **upload.html**
   - Drag & drop image upload
   - Music selection (4 options)
   - File preview with reordering
   
2. **upload-details.html**
   - Category selection
   - Title, description, price
   - Location
   - Category-specific fields (automotive: make, model, year, etc.)
   
3. **upload-review.html**
   - Preview all details
   - AI video generation via Revid API
   - Real-time progress tracking
   - Error handling

### Authentication
- **login.html** / **register.html** - Standalone auth pages
- **auth-modal.js** - Reusable modal component
- **profile.html** - User profile management
- **my-ads.html** - User's published ads

### Dark Mode
- Auto-detects system preference
- Persistent selection (localStorage)
- Smooth transitions
- Optimized form field visibility

## 🔑 API Endpoints

### Authentication (`/api/auth/`)
```
POST /register    - Create new user
POST /login       - Authenticate user
POST /logout      - End session
GET  /me          - Get current user
GET  /verify      - Verify session token
```

### Revid AI (Proxied)
```
POST /script/generate  - Generate AI script
POST /video/generate   - Create video
GET  /video/status/:id - Check video status
```

## 🎨 Design Features

### TikTok-Style Video Feed
- Full-screen vertical videos (9:16)
- Snap scrolling between videos
- Autoplay when 75% visible
- Tap to toggle sound
- Smooth transitions

### Desktop Enhancements
- Hover to play videos
- Click to toggle mute
- Volume indicator
- Smooth pause on mouse leave

### Mobile Optimizations
- Safe area insets for iPhone notch
- Touch-friendly controls
- Optimized video loading
- Smooth scrolling

## 🧪 Testing

### Test Users (Development)
```
Email: demo@example.com
Password: demo123

Email: test@example.com
Password: test123
```

### Test Upload Flow
1. Upload 2-3 product photos
2. Select music: "Upbeat & Energetic"
3. Fill details (use automotive for full fields)
4. Review and publish
5. AI generates video (requires API key + credits)

### Browser Console
Check for:
- Auth logs: "=== LOGIN SUCCESS ==="
- Upload logs: "Files processed, navigating..."
- Revid logs: "Generated script:", "Video completed:"

## 🚀 Deployment

### Static Files
Deploy to any static host:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Backend
Deploy auth server:
- Heroku
- Railway
- Digital Ocean
- AWS Lambda

### Database Migration
For production, migrate from JSON to PostgreSQL:
```python
# See DEV_GUIDE.md for migration script
```

## 🔒 Security Notes

### Current (Development)
- API key in client code (for testing)
- SHA-256 password hashing
- Session tokens
- CORS enabled

### Production Recommendations
- Move API key to backend
- Use bcrypt for passwords
- Add rate limiting
- Enable HTTPS only
- Add CSRF protection
- Use environment variables

See `REVID_INTEGRATION.md` for detailed security setup.

## ⚠️ Known Limitations

### API Key Required
- Revid.ai API key needed for video generation
- Credits required (paid service)
- Placeholder key won't work

### Database
- Currently JSON files
- Need PostgreSQL for production
- User data in localStorage (client-side)

### iOS Testing
- Safari requires user interaction for autoplay
- First video autoplays with sound (may fail)
- Fallback to muted autoplay

## 🎯 Roadmap

- [ ] Backend API for ad storage
- [ ] PostgreSQL database
- [ ] Search & filters
- [ ] User messaging
- [ ] Email verification
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Native mobile apps (React Native)

## 📝 License

This project is open source. Feel free to use and modify.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Test thoroughly
4. Submit pull request

## 📧 Support

For questions or issues:
- Check documentation files
- Review browser console logs
- Test with demo accounts
- Verify API key configuration

## 🎉 Credits

- **Revid.ai** - AI video generation
- **DiceBear** - Avatar generation
- **Tailwind CSS** - Styling framework
- **Feather Icons** - Icon set

---

**Start creating AI-powered video ads today!** 🚀

Just add your Revid.ai API key and start uploading products.

