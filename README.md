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
  - openai
  - authentication
---

# VidX - Video Marketplace Revolution 🎥

A modern video-first marketplace where AI creates professional video ads automatically from your photos and descriptions.

## ✨ Key Features

### 🤖 AI-Powered Video Creation
- **Automatic Script Generation**: AI writes engaging promotional copy from your description
- **Professional Voiceover**: Consistent brand voice (TTS) for familiarity
- **Auto Captions**: Accessibility-friendly animated captions
- **Smart Transitions**: Mobile-optimized slideshow format
- **Background Music**: Curated music options (Upbeat, Calm, Energetic, None)

### 🔐 Secure Authentication
- **Password Hashing**: SHA-256 with salt (ready for bcrypt upgrade)
- **Session Management**: Secure token-based sessions
- **Profile System**: User profiles with avatars from DiceBear
- **Local Development**: Works on localhost with fallback for iOS

### 📱 Mobile-First Design
- **Immersive Scrolling**: Full-screen snap scrolling on automotive page
- **Hover-to-Play**: Desktop videos play on hover, pause on leave
- **Dark Mode**: Full dark mode support across all pages
- **Responsive**: Optimized for mobile, tablet, and desktop

### 🎬 Upload Flow
1. **Upload Images** → Select background music
2. **Add Details** → Product info, category, pricing
3. **AI Generation** → OpenAI creates professional video (60-90 sec)
4. **Publish** → Video ad goes live on marketplace

## 🚀 Quick Start

### 1. Clone & Setup

**Primary Repository (GitHub):**
```bash
git clone https://github.com/Andrei0927/vidx-video-marketplace-revolution.git
cd vidx-video-marketplace-revolution
```

**Alternative (HuggingFace Backup):**
```bash
git clone https://huggingface.co/spaces/andrei-09/vidx-video-marketplace-revolution
cd vidx-video-marketplace-revolution
```

> 📚 **Migration Note**: This project was migrated to GitHub on November 9, 2025. See [GITHUB_MIGRATION.md](./docs/GITHUB_MIGRATION.md) for details.

### 2. Start Development Servers
```bash
chmod +x scripts/start_dev.sh
./scripts/start_dev.sh
```

This starts:
- Static server on http://localhost:3000
- Auth API server on http://localhost:3001

### 3. Configure OpenAI API

**Get API Key**:
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Add credits to your account ($5 minimum)
3. Generate API key from dashboard

**Add to Backend**:
```bash
# .env file (backend only - NEVER in frontend!)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 4. Test the App
- Browse marketplace: http://localhost:3000
- Upload ad: http://localhost:3000/upload.html
- Login/Register: Click user icon

## 📚 Documentation

### 🚀 Deployment (NEW!)
- **[DEPLOYMENT_GUIDE_CORRECTED.md](./docs/DEPLOYMENT_GUIDE_CORRECTED.md)** - Production deployment guide (Azure + R2) ⭐
- **[DEPLOYMENT_STATUS.md](./docs/DEPLOYMENT_STATUS.md)** - Interactive deployment tracker
- **[GITHUB_MIGRATION.md](./docs/GITHUB_MIGRATION.md)** - GitHub migration documentation
- **[VIDEO_PIPELINE_COMPARISON.md](./docs/audits/VIDEO_PIPELINE_COMPARISON.md)** - Cost analysis & stack comparison

### Core Guides
- **[VIDEO_GENERATION_QUICKSTART.md](./docs/guides/VIDEO_GENERATION_QUICKSTART.md)** - Quick start for video generation
- **[OPENAI_VIDEO_PIPELINE.md](./docs/guides/OPENAI_VIDEO_PIPELINE.md)** - Complete pipeline documentation
- **[DEV_GUIDE.md](./docs/guides/DEV_GUIDE.md)** - Development guide & project structure
- **[AUTH_README.md](./docs/guides/AUTH_README.md)** - Authentication system docs
- **[PASSWORD_RESET.md](./docs/guides/PASSWORD_RESET.md)** - Password reset implementation

### Architecture
- **[API_ARCHITECTURE.md](./docs/architecture/API_ARCHITECTURE.md)** - API design and flow
- **[CATEGORY_ARCHITECTURE.md](./docs/architecture/CATEGORY_ARCHITECTURE.md)** - Category system design

### Audits & Roadmap
- **[COMPREHENSIVE_WORK_REPORT.md](./docs/COMPREHENSIVE_WORK_REPORT.md)** - Complete 48-hour development timeline
- **[AUDIT_RECOMMENDATIONS.md](./docs/audits/AUDIT_RECOMMENDATIONS.md)** - Platform audit findings
- **[GO_LIVE_ROADMAP.md](./docs/audits/GO_LIVE_ROADMAP.md)** - Production deployment roadmap

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
- ### AI Services
- **OpenAI GPT-4o Mini** - Script generation
- **OpenAI TTS HD** - Professional voiceover
- **OpenAI Whisper** - Caption generation
- **FFmpeg** - Video rendering

## 📂 Project Structure

```
vidx-video-marketplace-revolution/
├── index.html              # Homepage
├── automotive.html         # Immersive video feed
├── details.html           # Ad detail page
├── upload.html            # Step 1: Upload images
├── upload-details.html    # Step 2: Add details
├── upload-review.html     # Step 3: Generate & publish
├── login.html, register.html, profile.html, my-ads.html
│
├── js/
│   ├── auth-service.js              # Auth API wrapper
│   ├── video-generation-service.js  # OpenAI video pipeline ⭐
│   └── dark-mode.js                 # Theme management
│
├── components/
│   ├── auth-modal.js      # Login/register modal
│   └── user-dropdown.js   # User menu component
│
├── css/
│   └── dark-mode.css      # Dark mode styles
│
├── scripts/
│   ├── auth_server.py     # Authentication API
│   ├── server.py          # Static file server
│   ├── migrate_db.py      # Database migration
│   └── start_dev.sh       # Development startup script ⭐
│
├── data/
│   ├── auth_db.json       # User database
│   └── db.json            # Main database
│
└── docs/
    ├── guides/            # User guides and tutorials
    ├── architecture/      # System architecture docs
    ├── audits/           # Audits and roadmaps
    └── summaries/        # Implementation summaries
```

## 🎯 Features Breakdown

### Marketplace Pages
- **index.html** - Homepage with category grid
- **automotive.html** - Full-screen immersive scrolling
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
   - AI video generation via OpenAI pipeline
   - Real-time progress tracking (script → audio → captions → render)
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

### Video Generation (`/api/video/`)
```
POST /generate-script     - Generate AI script from description
POST /upload-url          - Get presigned URL for file upload
POST /generate            - Start video generation job
GET  /status/:jobId       - Check generation status
POST /cancel/:jobId       - Cancel generation job
```

## 🎨 Design Features

### Immersive Video Feed
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
- Video logs: "Script generated", "Video job started:", "Progress: 60%"

## 🚀 Deployment

### 📖 Complete Deployment Guide

**IMPORTANT**: We've completed extensive cost analysis and identified the optimal production stack.

**Recommended Architecture**: Azure Container Instances + Cloudflare R2

**Cost**: $0.024/video (98% savings vs Revid.ai)

📚 **Read the guides**:
- **[DEPLOYMENT_GUIDE_CORRECTED.md](./docs/DEPLOYMENT_GUIDE_CORRECTED.md)** - Step-by-step production deployment ⭐
- **[DEPLOYMENT_STATUS.md](./docs/DEPLOYMENT_STATUS.md)** - Interactive checklist & progress tracker
- **[VIDEO_PIPELINE_COMPARISON.md](./docs/audits/VIDEO_PIPELINE_COMPARISON.md)** - Full cost analysis & recommendation rationale

### Deployment Options

**Option A: HuggingFace + Azure Backend** (~$42/month)
- ✅ Easiest migration (3-4 hours)
- ✅ Free frontend hosting (current HuggingFace Spaces)
- ✅ Lowest cost
- ⚠️ Public repos only

**Option C: Full Azure Migration** (~$47/month)
- ✅ Production-grade performance
- ✅ Private repos available
- ✅ Azure Static Web Apps + CDN
- ⚠️ Requires GitHub migration (5-6 hours)

### Quick Deploy Steps

1. **Choose deployment option** (see DEPLOYMENT_STATUS.md)
2. **Setup Azure account** (get $200 free credit)
3. **Deploy backend** (Azure Container Instances)
4. **Configure storage** (Cloudflare R2 - zero egress fees!)
5. **Update frontend** (API endpoint change)
6. **Test & launch** 🚀

**Total Time**: 3-6 hours (depending on option)

---

### Legacy Options (Not Recommended)

> ⚠️ **Note**: The original CLOUD_DEPLOYMENT_GUIDE.md recommended Railway + Vercel, but our detailed cost analysis found Azure + Cloudflare R2 to be superior (better performance, lower cost, zero egress fees). Please use DEPLOYMENT_GUIDE_CORRECTED.md instead.

#### Static Files
Deploy to any static host:
- HuggingFace Spaces (current)
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

#### Backend
Deploy auth server:
- Azure Container Instances ⭐ (Recommended)
- Heroku
- Railway
- Digital Ocean
- AWS Lambda

#### Database Migration
For production, migrate from JSON to PostgreSQL:
```python
# See DEPLOYMENT_GUIDE_CORRECTED.md for migration script
```

---

## 🔒 Security Notes

### Current (Development)
- API key in client code (for testing)
- SHA-256 password hashing
- Session tokens
- CORS enabled

### Production Recommendations
- Keep API keys in backend only
- Use bcrypt for passwords
- Add rate limiting (10 videos/hour per user)
- Enable HTTPS only
- Add CSRF protection
- Use environment variables
- Set up content moderation

See `OPENAI_VIDEO_PIPELINE.md` for detailed security setup.

## ⚠️ Known Limitations

### API Configuration
- OpenAI API key required for video generation
- Cloudflare R2 needed for video storage
- All API calls proxied through backend
- Use placeholder keys in development

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

