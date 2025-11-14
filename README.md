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

# VidX - Video Marketplace Revolution

A revolutionary video-first marketplace platform where sellers showcase products through short-form videos, similar to TikTok's engaging format.

## 🚀 Quick Start

### Local Development (Start Here!)

```bash
# First time setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start development server
./dev.sh
```

Visit **http://127.0.0.1:5000**

### Deploy to Production

```bash
# Recommended: Deploy from local directory (includes all files)
az webapp up --name vidx-marketplace --runtime "PYTHON:3.12" --sku B1 --location westeurope

# Alternative: Legacy deployment script
./scripts/deploy.sh
```

**⚠️ Important**: Always use `az webapp up` for production deployments. It's faster, more reliable, and deploys the complete application from your local directory.

**📖 Full deployment guide**: See [DEPLOYMENT_GUIDE_CORRECTED.md](docs/DEPLOYMENT_GUIDE_CORRECTED.md)  
**🔧 Troubleshooting**: See [DEPLOYMENT_SUCCESS_NOV11.md](DEPLOYMENT_SUCCESS_NOV11.md)

---

## 🌐 Live Production Site

**URL**: https://vidx-marketplace.azurewebsites.net  
**Status**: ✅ Live and deployed with Docker  
**Last Deployed**: November 14, 2025 (Build cb9)  
**Deployment Method**: Azure Container Registry + Docker

### Production Stack
- **Hosting**: Azure App Service (Container)
- **Container**: Docker with FFmpeg 7.1.2
- **Runtime**: Python 3.12-slim
- **Server**: Gunicorn with 2 workers
- **Database**: Azure PostgreSQL 14.19
- **Video Pipeline**: OpenAI TTS + FFmpeg
- **Registry**: vidxmarketplace.azurecr.io
- **Region**: West Europe

## 🚀 Key Features

### Core Functionality
- **Video-First Listings**: All products showcased through engaging short videos
- **TikTok-Style Feed**: Vertical scroll video browsing optimized for mobile
- **8 Major Categories**: Automotive, Electronics, Fashion, Home & Garden, Sports, Real Estate, Jobs, Services
- **Advanced Filters**: Category-specific filter schemas with dynamic rendering
- **Filter Modal**: Mobile-first filter experience before video feed
- **Modern UI**: Rounded corners, smooth animations, glassmorphism effects

### Technical Features
- **Flask Backend**: Python 3.12 with Flask 3.0.0
- **Dark Mode**: Full dark mode support with smooth transitions
- **PWA Ready**: Progressive Web App with offline capabilities and service worker
- **Responsive Design**: Mobile-first with iOS Safari optimizations
- **Authentication**: In-memory auth system (PostgreSQL ready)
- **API Endpoints**: RESTful API for auth, listings, and uploads
- **Video Pipeline**: OpenAI TTS + FFmpeg for automated video generation
- **Cloud Storage**: Cloudflare R2 (S3-compatible) for media files

---

## 📦 Dependencies & Requirements

### Production-Tested Stack (November 11, 2025)

```txt
flask==3.0.0              # Web framework
flask-cors==4.0.0         # Cross-origin resource sharing
psycopg2-binary==2.9.9    # PostgreSQL adapter
python-dotenv==1.0.0      # Environment variable management
gunicorn==21.2.0          # Production WSGI server
openai==1.54.4            # ⚠️ CRITICAL: Use 1.54.4 (not 1.51.0)
httpx==0.27.2             # ⚠️ CRITICAL: Pin for OpenAI compatibility
boto3==1.34.51            # AWS S3/R2 client
sendgrid==6.11.0          # Email service
Pillow==10.1.0            # Image processing
requests==2.31.0          # HTTP library
```

### Critical Version Notes

**OpenAI + httpx Compatibility**:
- ✅ `openai==1.54.4` + `httpx==0.27.2` - **Production tested, works**
- ❌ `openai==1.51.0` - **Breaks in Azure** with `AsyncClient` error
- **Always pin both versions** to prevent deployment failures

**Why These Versions Matter**:
- Different environments (local vs Azure) may install different httpx versions
- OpenAI 1.51.0 has incompatibility with newer httpx releases
- Pinning prevents `TypeError: AsyncClient.__init__() got an unexpected keyword argument 'proxies'`

See [DEPLOYMENT_SUCCESS_NOV11.md](DEPLOYMENT_SUCCESS_NOV11.md) for full deployment troubleshooting guide.

---