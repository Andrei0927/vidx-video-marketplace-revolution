# ☁️ VidX Cloud Deployment Guide (Corrected)

**Last Updated**: November 9, 2025  
**Estimated Time**: 3-4 hours  
**Difficulty**: Intermediate  
**Cost**: ~$25-35/month (scales with usage)

---

## 🔍 Important: Deployment Stack Clarification

### **Actual Recommended Stack** (from VIDEO_PIPELINE_COMPARISON.md)

**Backend Video Processing**: Azure Container Instances + Cloudflare R2  
**Frontend Hosting**: HuggingFace Spaces (current) or Azure Static Web Apps  
**Database**: Azure PostgreSQL Flexible Server  
**File Storage**: Cloudflare R2

**Cost**: $0.024/video (~98% savings vs Revid.ai)

### ❌ Incorrect Previous Recommendation

The initial CLOUD_DEPLOYMENT_GUIDE.md incorrectly suggested:
- Railway (backend) - **NOT actually recommended**
- Vercel (frontend) - **NOT actually recommended**

This was an error. The VIDEO_PIPELINE_COMPARISON.md clearly states:

> **Final Recommendation: Azure + Cloudflare R2**
> - Azure Container Instances (rendering): $0.002/video
> - Cloudflare R2 (storage + transfer): $0.015/video
> - **Total: $0.024/video**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Deployment Options Analysis](#deployment-options-analysis)
4. [Option A: Stay on HuggingFace Spaces (Simplest)](#option-a-stay-on-huggingface-spaces-simplest)
5. [Option B: Hybrid (HuggingFace + Azure Backend)](#option-b-hybrid-huggingface--azure-backend)
6. [Option C: Full Azure Migration (Recommended)](#option-c-full-azure-migration-recommended)
7. [Step-by-Step: Azure + Cloudflare R2 Setup](#step-by-step-azure--cloudflare-r2-setup)
8. [HuggingFace Migration Guide](#huggingface-migration-guide)
9. [Cost Comparison](#cost-comparison)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] **Azure Account** - Backend compute + database + frontend (free $200 credit for 30 days)
- [ ] **Cloudflare Account** - R2 file storage (free tier: 10GB storage)
- [ ] **SendGrid Account** - Email service (free: 100 emails/day)
- [ ] **OpenAI Account** - API for video generation (pay-as-you-go)
- [ ] **Sentry Account** - Error monitoring (optional, free: 5K events/month)
- [ ] **HuggingFace Account** - Current hosting (free for public spaces)

### Required Tools
- [ ] Git installed and configured
- [ ] Azure CLI installed: `brew install azure-cli` (macOS)
- [ ] Python 3.11+ installed
- [ ] Docker installed (for local testing)
- [ ] Web browser

### Required API Keys
- [ ] OpenAI API key: https://platform.openai.com/api-keys
- [ ] SendGrid API key: https://app.sendgrid.com/settings/api_keys
- [ ] Cloudflare R2 credentials (obtained during setup)

### Payment Methods
- [ ] Credit/debit card for Azure (~$20-30/month after free credits)
- [ ] Credit/debit card for Cloudflare R2 (typically $0-5/month on free tier)

**Note**: Azure offers $200 free credit for 30 days - plenty to test the full stack.

---

## Architecture Overview

### Current State (HuggingFace Spaces)
```
┌─────────────────────────────────────────────────────────────┐
│          HuggingFace Spaces (Free Static Hosting)           │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ index.html │  │  style.css │  │ JS modules │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  Limitations:                                               │
│  • No backend processing (static files only)                │
│  • No database                                              │
│  • No video generation (client-side only)                   │
│  • No authentication persistence                            │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Architecture (Azure + Cloudflare R2)
```
┌─────────────────────────────────────────────────────────────┐
│              USER DEVICE (Browser/Mobile)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│          Azure Static Web Apps (Frontend CDN)                │
│                                                              │
│  • Global CDN (Faster than HuggingFace)                     │
│  • Automatic HTTPS                                          │
│  • Free tier: 100GB bandwidth/month                         │
│  • Can integrate with HuggingFace git repo                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ API Calls (/api/*)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│        Azure Container Instances (Backend API)               │
│                                                              │
│  • Python FastAPI server                                    │
│  • Video generation (MoviePy + FFmpeg)                      │
│  • Authentication & sessions                                │
│  • Cost: $0.002 per video render                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ├─→ Database Queries
                           │   ┌─────────────────────────────┐
                           │   │ Azure PostgreSQL Flexible   │
                           │   │ • 1 vCore, 2GB RAM          │
                           │   │ • Cost: ~$15/month          │
                           │   └─────────────────────────────┘
                           │
                           └─→ File Storage
                               ┌─────────────────────────────┐
                               │ Cloudflare R2               │
                               │ • S3-compatible storage     │
                               │ • Zero egress fees          │
                               │ • Global CDN                │
                               │ • Cost: $0.015/GB           │
                               └─────────────────────────────┘

External Services:
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   SendGrid   │   │   OpenAI     │   │    Sentry    │
│    (Email)   │   │ (GPT+TTS+    │   │ (Monitoring) │
│              │   │  Whisper)    │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## Deployment Options Analysis

### Option A: Stay on HuggingFace Spaces (Simplest)

**What This Means:**
- Keep frontend on HuggingFace Spaces (free)
- Deploy backend to Azure Container Instances
- Use Cloudflare R2 for storage
- **No migration needed** for frontend

**Pros:**
- ✅ **Zero migration effort** for frontend
- ✅ **Free frontend hosting** (HuggingFace Spaces)
- ✅ **Keep current git workflow** (push to HF, auto-deploy)
- ✅ **Simpler setup** (only backend deployment)

**Cons:**
- ❌ HuggingFace CDN **slower than Azure** (not globally distributed)
- ❌ Limited to public repos (privacy concerns)
- ❌ Less control over caching/CDN configuration
- ❌ Potential rate limiting on free tier

**Best For:** Quick MVP, testing, limited budget

**Cost:** ~$20-25/month (backend + database only)

---

### Option B: Hybrid (HuggingFace + Azure Backend)

**What This Means:**
- Frontend stays on HuggingFace Spaces
- Backend on Azure Container Instances
- Database on Azure PostgreSQL
- Storage on Cloudflare R2

**Implementation:**
```javascript
// js/auth-service.js - Update API endpoint
constructor() {
    // Point to Azure backend instead of localhost
    this.baseUrl = window.location.hostname.includes('hf.space')
        ? 'https://vidx-backend.azurecontainerapps.io/api'  // Azure backend
        : 'http://localhost:8000/api';  // Local development
}
```

**Pros:**
- ✅ **Best of both worlds** (free frontend + powerful backend)
- ✅ **Minimal migration** (only backend code)
- ✅ **Keep HF git workflow**
- ✅ **Lowest cost** (~$20-25/month)

**Cons:**
- ❌ CORS complexity (cross-origin requests)
- ❌ Slower frontend (HF Spaces not globally CDN'd)
- ❌ Public repo requirement

**Best For:** Budget-conscious MVP with full features

**Cost:** ~$20-25/month

---

### Option C: Full Azure Migration (Recommended)

**What This Means:**
- Frontend on Azure Static Web Apps
- Backend on Azure Container Instances
- Database on Azure PostgreSQL
- Storage on Cloudflare R2
- **Full migration** from HuggingFace

**Pros:**
- ✅ **Fastest global performance** (Azure CDN worldwide)
- ✅ **Private repositories** supported
- ✅ **Better integration** (all services in one account)
- ✅ **Production-grade** infrastructure
- ✅ **Free tier available** (100GB bandwidth/month)
- ✅ **Custom domains** easily configured
- ✅ **Better monitoring** and logging

**Cons:**
- ❌ **Migration required** (~2 hours work)
- ❌ **Slightly higher cost** (~$5/month for frontend)
- ❌ **New git workflow** (Azure DevOps or GitHub Actions)

**Best For:** Production deployment, scalability, performance

**Cost:** ~$25-35/month

---

## HuggingFace Migration Guide

### Understanding the Differences

**HuggingFace Spaces:**
- **Type:** Static file hosting (like GitHub Pages)
- **Git:** HuggingFace git (different from GitHub)
- **Auto-deploy:** Push to HF repo → automatic deployment
- **Limitations:** No backend execution, no databases

**Azure Static Web Apps:**
- **Type:** Static hosting + serverless functions
- **Git:** GitHub, GitLab, Azure DevOps
- **Auto-deploy:** Push to connected repo → GitHub Actions → deploy
- **Capabilities:** Full backend support (optional)

### Migration Implications

#### What Stays the Same ✅
- All frontend files (HTML, CSS, JS)
- File structure
- Assets (images, icons)
- Service worker
- Client-side logic

#### What Changes ⚠️
- **Git repository location** (HF → GitHub or stay HF with manual deploy)
- **Deployment workflow** (HF auto-deploy → GitHub Actions or Azure CLI)
- **API endpoints** (localhost → Azure backend URL)
- **Environment variables** (hardcoded → Azure App Settings)

#### What's Added ➕
- Backend API server (Azure Container Instances)
- Database (Azure PostgreSQL)
- File storage (Cloudflare R2)
- Monitoring (Sentry)

### Migration Options

#### Option 1: Keep HuggingFace Repo (Easier)

**Steps:**
1. Keep code on HuggingFace Spaces repo
2. Deploy backend to Azure separately
3. Update frontend API calls to point to Azure backend
4. Push to HF repo (auto-deploys frontend)
5. **No git migration needed!**

**Deployment:**
```bash
# Frontend: Push to HuggingFace (as usual)
git add .
git commit -m "Update API endpoint to Azure backend"
git push origin main  # HuggingFace auto-deploys

# Backend: Deploy to Azure manually (one-time setup)
az container create --resource-group vidx-rg --name vidx-backend \
  --image vidx/backend:latest --dns-name-label vidx-backend \
  --ports 8000 --environment-variables API_KEYS=...
```

**Pros:** Zero git migration, familiar workflow  
**Cons:** Manual backend deployment (not auto-deploy)

---

#### Option 2: Mirror to GitHub (Better)

**Steps:**
1. Create GitHub repo
2. Add GitHub as second remote
3. Push to both HF (for frontend) and GitHub (for Azure deployment)
4. Set up GitHub Actions for Azure backend auto-deploy

**Setup:**
```bash
# Add GitHub remote
git remote add github https://github.com/yourusername/vidx-marketplace.git

# Push to both
git push origin main      # HuggingFace Spaces (frontend)
git push github main      # GitHub (for Azure backend CI/CD)
```

**Pros:** Auto-deploy for both frontend and backend  
**Cons:** Need GitHub account, dual remote management

---

#### Option 3: Full Migration to Azure (Recommended for Production)

**Steps:**
1. Create GitHub repository (Azure prefers GitHub)
2. Mirror HuggingFace repo to GitHub
3. Connect GitHub to Azure Static Web Apps (auto-deploy)
4. Set up Azure Container Instances for backend
5. Configure GitHub Actions for CI/CD

**Migration Command:**
```bash
# Clone from HuggingFace
git clone https://huggingface.co/spaces/andrei-09/vidx-video-marketplace-revolution
cd vidx-video-marketplace-revolution

# Create new GitHub repo (via GitHub web UI first)

# Change remote from HF to GitHub
git remote remove origin
git remote add origin https://github.com/yourusername/vidx-marketplace.git

# Push to GitHub
git push -u origin main

# Deploy to Azure (one command!)
az staticwebapp create \
  --name vidx-frontend \
  --resource-group vidx-rg \
  --source https://github.com/yourusername/vidx-marketplace \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location ""
```

**Pros:**  
- ✅ Single source of truth (GitHub)
- ✅ Full CI/CD automation
- ✅ Better for team collaboration
- ✅ Industry standard workflow

**Cons:**  
- ❌ Lose HuggingFace Spaces free hosting (~$5/month on Azure)
- ❌ Migration effort (~2 hours)

---

## Step-by-Step: Azure + Cloudflare R2 Setup

### Step 1: Azure Account Setup

**Time:** 10 minutes

1. Go to https://azure.microsoft.com/free
2. Click **"Start free"**
3. Sign in with Microsoft account (or create one)
4. Verify phone number
5. Add credit card (required but won't charge during free trial)
6. Get **$200 free credit** for 30 days

**Free Tier Includes:**
- 750 hours/month Container Instances (enough for 24/7 backend)
- 100GB bandwidth Static Web Apps
- 1GB PostgreSQL database storage
- 25GB storage

### Step 2: Install Azure CLI

**macOS:**
```bash
brew update && brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**Windows:**
```powershell
winget install Microsoft.AzureCLI
```

**Verify:**
```bash
az --version
# Should show: azure-cli 2.x.x
```

### Step 3: Login to Azure

```bash
# Login (opens browser for authentication)
az login

# Set subscription (if you have multiple)
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_NAME"

# Verify
az account show
```

### Step 4: Create Resource Group

```bash
# Create resource group (container for all resources)
az group create \
  --name vidx-rg \
  --location eastus2

# Verify
az group show --name vidx-rg
```

**Why eastus2?** Lower cost than westus, good performance for North America/Europe.

### Step 5: Create PostgreSQL Database

**Time:** 15 minutes

```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group vidx-rg \
  --name vidx-db-server \
  --location eastus2 \
  --admin-user vidxadmin \
  --admin-password 'YourSecurePassword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --public-access 0.0.0.0

# Create database
az postgres flexible-server db create \
  --resource-group vidx-rg \
  --server-name vidx-db-server \
  --database-name vidx_production

# Get connection string
az postgres flexible-server show-connection-string \
  --server-name vidx-db-server \
  --database-name vidx_production \
  --admin-user vidxadmin \
  --admin-password 'YourSecurePassword123!'
```

**Save this connection string:**
```
postgresql://vidxadmin:YourSecurePassword123!@vidx-db-server.postgres.database.azure.com:5432/vidx_production?sslmode=require
```

**Cost:** ~$12-15/month (Burstable B1ms: 1 vCore, 2GB RAM)

### Step 6: Setup Cloudflare R2 (File Storage)

**Time:** 20 minutes

#### 6.1 Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify email

#### 6.2 Enable R2 Storage

1. Cloudflare Dashboard → **R2**
2. Click **"Purchase R2"**
3. Add payment method (required but free tier available)
4. **Free tier:**
   - 10 GB storage/month
   - 1 million Class A operations/month (writes)
   - 10 million Class B operations/month (reads)
   - **Zero egress fees** (unlimited downloads!)

#### 6.3 Create R2 Bucket

```bash
# Using Cloudflare API (or use web dashboard)
# Via dashboard (easier):
# 1. Click "Create bucket"
# 2. Name: vidx-uploads
# 3. Location: Automatic
# 4. Click "Create bucket"
```

#### 6.4 Enable Public Access

1. Click bucket → **Settings**
2. Scroll to **"Public access"**
3. Click **"Allow Access"**
4. **Public URL:** `https://pub-xxxxx.r2.dev`
5. **Save this URL** for environment variables

#### 6.5 Create API Token

1. R2 → **Manage R2 API Tokens**
2. **Create API token**
3. Name: `vidx-backend-access`
4. Permissions: **Object Read & Write**
5. Bucket: Select `vidx-uploads`
6. **Create & Copy:**
   - Access Key ID: `xxxxx`
   - Secret Access Key: `xxxxx`
   - Account ID: `xxxxx`

**Save these credentials securely!**

#### 6.6 Test R2 Access

```bash
# Install AWS CLI (S3-compatible)
pip install awscli

# Configure for R2
aws configure --profile r2
# AWS Access Key ID: <your R2 access key>
# AWS Secret Access Key: <your R2 secret key>
# Default region: auto
# Default output format: json

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://vidx-uploads/test.txt \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com \
  --profile r2

# Verify via public URL
curl https://pub-xxxxx.r2.dev/test.txt
# Should return: test
```

**Cost:** $0 (within free tier for MVP)

### Step 7: Create Backend Container

**Time:** 30 minutes

#### 7.1 Prepare Backend Code

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "-w", "2", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "main:app"]
```

Create `backend/requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
openai==1.3.0
moviepy==1.0.3
pillow==10.1.0
boto3==1.34.0
sendgrid==6.11.0
sentry-sdk[fastapi]==1.38.0
python-multipart==0.0.6
```

Create `backend/main.py`:

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List
import sentry_sdk

# Initialize Sentry
sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    traces_sample_rate=0.1,
    environment='production'
)

app = FastAPI(title="VidX Backend API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://huggingface.co",
        "https://*.hf.space",
        "https://vidx-frontend.azurestaticapps.net",  # If migrating frontend
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "vidx-backend"}

# Video generation endpoint
@app.post("/api/video/generate")
async def generate_video(
    images: List[UploadFile] = File(...),
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    price: str = Form(...)
):
    """Generate video from images and metadata"""
    try:
        # Implementation from VIDEO_PIPELINE_COMPARISON.md
        # (See Option 3: Hybrid Approach)
        
        return {
            "success": True,
            "video_url": "https://pub-xxxxx.r2.dev/videos/abc123.mp4",
            "thumbnail_url": "https://pub-xxxxx.r2.dev/thumbnails/abc123.jpg",
            "duration": 30,
            "cost": 0.024
        }
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

# More endpoints for auth, ads, etc.
```

#### 7.2 Build and Push Docker Image

```bash
# Build image locally
cd backend
docker build -t vidx-backend:latest .

# Test locally
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e OPENAI_API_KEY="sk-..." \
  vidx-backend:latest

# Visit http://localhost:8000/health

# Create Azure Container Registry
az acr create \
  --resource-group vidx-rg \
  --name vidxregistry \
  --sku Basic

# Login to ACR
az acr login --name vidxregistry

# Tag image
docker tag vidx-backend:latest vidxregistry.azurecr.io/vidx-backend:latest

# Push to ACR
docker push vidxregistry.azurecr.io/vidx-backend:latest
```

#### 7.3 Deploy Container to Azure

```bash
# Create Container Instance
az container create \
  --resource-group vidx-rg \
  --name vidx-backend \
  --image vidxregistry.azurecr.io/vidx-backend:latest \
  --registry-username vidxregistry \
  --registry-password $(az acr credential show --name vidxregistry --query "passwords[0].value" -o tsv) \
  --dns-name-label vidx-backend \
  --ports 8000 \
  --cpu 2 \
  --memory 8 \
  --environment-variables \
    DATABASE_URL="postgresql://vidxadmin:YourSecurePassword123!@vidx-db-server.postgres.database.azure.com:5432/vidx_production?sslmode=require" \
    OPENAI_API_KEY="sk-proj-xxxxx" \
    R2_ACCOUNT_ID="xxxxx" \
    R2_ACCESS_KEY_ID="xxxxx" \
    R2_SECRET_ACCESS_KEY="xxxxx" \
    R2_BUCKET_NAME="vidx-uploads" \
    R2_PUBLIC_URL="https://pub-xxxxx.r2.dev" \
    SENDGRID_API_KEY="SG.xxxxx" \
    SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# Get public URL
az container show \
  --resource-group vidx-rg \
  --name vidx-backend \
  --query "ipAddress.fqdn" \
  --output tsv

# Returns: vidx-backend.eastus2.azurecontainer.io
```

**Your backend URL:** `https://vidx-backend.eastus2.azurecontainer.io`

**Test:**
```bash
curl https://vidx-backend.eastus2.azurecontainer.io/health
# Should return: {"status":"ok","service":"vidx-backend"}
```

**Cost:** ~$0.002 per video render (charges only when processing)

### Step 8: Setup SendGrid (Email Service)

**Time:** 10 minutes

1. Go to https://signup.sendgrid.com
2. Sign up (free 100 emails/day)
3. Settings → **Sender Authentication**
4. **Verify Single Sender:**
   - From Name: VidX Marketplace
   - From Email: noreply@yourdomain.com
   - Click verification email
5. Settings → **API Keys** → **Create API Key**
6. Name: `vidx-production`
7. Permissions: **Full Access**
8. **Copy API key:** `SG.xxxxx` (shown once!)

**Update Azure Container:**
```bash
az container set-environment-variables \
  --resource-group vidx-rg \
  --name vidx-backend \
  --environment-variables SENDGRID_API_KEY="SG.xxxxx"

# Restart container
az container restart --resource-group vidx-rg --name vidx-backend
```

### Step 9: Update Frontend API Endpoint

**For HuggingFace Spaces (Option A/B):**

Edit `js/auth-service.js`:

```javascript
constructor() {
    const hostname = window.location.hostname;
    
    // Point to Azure backend
    if (hostname.includes('hf.space') || hostname.includes('huggingface.co')) {
        this.baseUrl = 'https://vidx-backend.eastus2.azurecontainer.io/api';
    } else {
        this.baseUrl = 'http://localhost:8000/api';  // Local development
    }
}
```

**Push to HuggingFace:**
```bash
git add js/auth-service.js
git commit -m "Connect to Azure backend"
git push origin main
# HuggingFace auto-deploys in ~1 minute
```

**For Full Azure Migration (Option C):**

See next section.

### Step 10: Database Migrations

```bash
# Connect to database
psql "postgresql://vidxadmin:YourSecurePassword123!@vidx-db-server.postgres.database.azure.com:5432/vidx_production?sslmode=require"

# Or use Azure CLI
az postgres flexible-server execute \
  --name vidx-db-server \
  --admin-user vidxadmin \
  --admin-password 'YourSecurePassword123!' \
  --database-name vidx_production \
  --querytext "CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );"
```

Or use migration script from `scripts/setup_database.py` (see CLOUD_DEPLOYMENT_GUIDE.md Step 7).

---

## Cost Comparison

### Monthly Costs (1,000 videos/month)

#### Option A: HuggingFace + Azure Backend
| Component | Provider | Cost |
|-----------|----------|------|
| Frontend | HuggingFace Spaces | **$0** |
| Backend | Azure Container Instances | $7 |
| Database | Azure PostgreSQL B1ms | $13 |
| Storage + Transfer | Cloudflare R2 | $15 |
| Video Processing APIs | OpenAI (GPT+TTS+Whisper) | $7 |
| Email | SendGrid (free tier) | $0 |
| **Total** | | **~$42/month** |
| **Per Video** | | **$0.042** |

#### Option B: Full Azure Stack
| Component | Provider | Cost |
|-----------|----------|------|
| Frontend | Azure Static Web Apps | $5 |
| Backend | Azure Container Instances | $7 |
| Database | Azure PostgreSQL B1ms | $13 |
| Storage + Transfer | Cloudflare R2 | $15 |
| Video Processing APIs | OpenAI | $7 |
| Email | SendGrid | $0 |
| **Total** | | **~$47/month** |
| **Per Video** | | **$0.047** |

#### Comparison vs Revid.ai

| Volume | Revid.ai (est.) | Azure + R2 | Savings |
|--------|-----------------|------------|---------|
| 100 videos | $50-200 | $5-10 | **90-98%** |
| 1,000 videos | $500-2,000 | $42-47 | **92-98%** |
| 10,000 videos | $5,000-20,000 | $420-470 | **92-98%** |

**Key Insight:** Video processing cost ($0.024/video) stays constant regardless of volume!

---

## Full Azure Migration (Option C) - Complete Guide

### Step 1: Create GitHub Repository

```bash
# Via GitHub web UI:
# 1. Go to https://github.com/new
# 2. Repository name: vidx-marketplace
# 3. Public or Private
# 4. Do NOT initialize with README
# 5. Click "Create repository"
```

### Step 2: Mirror HuggingFace to GitHub

```bash
# Clone from HuggingFace
git clone https://huggingface.co/spaces/andrei-09/vidx-video-marketplace-revolution vidx-temp
cd vidx-temp

# Remove HuggingFace-specific files
rm README.md  # Will recreate without HF header

# Create new README
cat > README.md << 'EOF'
# VidX - Video Marketplace Revolution

AI-powered video marketplace with automatic video ad generation.

## Tech Stack
- Frontend: HTML, CSS, JavaScript (Vanilla)
- Backend: Python FastAPI on Azure Container Instances
- Database: Azure PostgreSQL
- Storage: Cloudflare R2
- Video Generation: OpenAI (GPT-4o Mini + TTS + Whisper)

## Deployment
- Frontend: Azure Static Web Apps
- Backend: Azure Container Instances
- Cost: ~$0.024 per video generated

EOF

# Change remote
git remote remove origin
git remote add origin https://github.com/yourusername/vidx-marketplace.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy Frontend to Azure Static Web Apps

```bash
# Create Static Web App (connects to GitHub)
az staticwebapp create \
  --name vidx-frontend \
  --resource-group vidx-rg \
  --source https://github.com/yourusername/vidx-marketplace \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --output-location "" \
  --login-with-github

# This will:
# 1. Open GitHub for authorization
# 2. Create GitHub Actions workflow
# 3. Auto-deploy on every push to main
```

**Your frontend URL:** `https://vidx-frontend.azurestaticapps.net`

### Step 4: Configure Custom Domain (Optional)

```bash
# Add custom domain
az staticwebapp hostname set \
  --name vidx-frontend \
  --resource-group vidx-rg \
  --hostname www.yourdomain.com

# Add DNS records at your domain registrar:
# Type: CNAME
# Name: www
# Value: vidx-frontend.azurestaticapps.net
```

**SSL:** Automatic (Azure provides free SSL via Let's Encrypt)

### Step 5: Update Frontend for Azure

Edit `js/auth-service.js`:

```javascript
constructor() {
    const hostname = window.location.hostname;
    
    // Azure Static Web Apps automatically proxies /api to backend
    this.baseUrl = hostname === 'localhost' 
        ? 'http://localhost:8000/api'
        : '/api';  // Azure proxies to Container Instance
}
```

Create `staticwebapp.config.json` (Azure routing config):

```json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "https://vidx-backend.eastus2.azurecontainer.io/api/*"
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "text/javascript",
    ".css": "text/css"
  }
}
```

Commit and push:

```bash
git add js/auth-service.js staticwebapp.config.json
git commit -m "Configure Azure Static Web Apps"
git push origin main

# GitHub Actions auto-deploys in ~2 minutes
# Check: https://github.com/yourusername/vidx-marketplace/actions
```

---

## Troubleshooting

### Issue: Container Instance Won't Start

**Check logs:**
```bash
az container logs --resource-group vidx-rg --name vidx-backend
```

**Common fixes:**
- Missing environment variables
- Invalid database connection string
- Port 8000 not exposed
- Image build failed

### Issue: CORS Errors

**Update backend CORS:**
```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://huggingface.co",
        "https://*.hf.space",
        "https://vidx-frontend.azurestaticapps.net",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### Issue: Database Connection Failed

**Check firewall:**
```bash
# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group vidx-rg \
  --name vidx-db-server \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Issue: R2 Upload Fails

**Verify credentials:**
```bash
# Test with AWS CLI
aws s3 ls s3://vidx-uploads \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com \
  --profile r2
```

**Check bucket permissions:** Make sure bucket has "Allow Access" enabled.

---

## Final Recommendation

### For MVP/Testing: **Option A (HuggingFace + Azure Backend)**
- ✅ Fastest to deploy
- ✅ Lowest cost ($42/month)
- ✅ No migration effort
- ✅ Keep familiar HF workflow

**Deploy in ~2 hours**

### For Production: **Option C (Full Azure Migration)**
- ✅ Best performance (global CDN)
- ✅ Industry-standard workflow
- ✅ Scalable to millions of users
- ✅ Private repositories

**Deploy in ~4 hours (including migration)**

---

## Next Steps

1. **Test the deployment guide** with Azure free trial ($200 credit)
2. **Choose deployment option** (A, B, or C)
3. **Deploy backend** to Azure Container Instances
4. **Set up Cloudflare R2** for storage
5. **Update frontend** API endpoints
6. **Run end-to-end tests**
7. **Monitor with Sentry**
8. **Go live!**

---

**Total Setup Time:** 3-4 hours  
**Monthly Cost:** $42-47/month  
**Cost per Video:** $0.024 (98% savings vs Revid.ai)  
**Deployment Complexity:** Intermediate  

🎉 **Ready to deploy your production-grade video marketplace!**
