# ☁️ VidX Cloud Deployment Guide

**Last Updated**: November 9, 2025  
**Estimated Time**: 3-4 hours  
**Difficulty**: Intermediate  
**Cost**: ~$25-50/month (scales with usage)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Step 1: Database Setup (Railway)](#step-1-database-setup-railway)
4. [Step 2: Backend Deployment (Railway)](#step-2-backend-deployment-railway)
5. [Step 3: File Storage Setup (Cloudflare R2)](#step-3-file-storage-setup-cloudflare-r2)
6. [Step 4: Email Service Setup (SendGrid)](#step-4-email-service-setup-sendgrid)
7. [Step 5: Frontend Deployment (Vercel)](#step-5-frontend-deployment-vercel)
8. [Step 6: Environment Variables Configuration](#step-6-environment-variables-configuration)
9. [Step 7: Database Migrations](#step-7-database-migrations)
10. [Step 8: Testing & Verification](#step-8-testing--verification)
11. [Step 9: Monitoring Setup (Sentry)](#step-9-monitoring-setup-sentry)
12. [Step 10: Analytics Setup (Plausible)](#step-10-analytics-setup-plausible)
13. [Troubleshooting](#troubleshooting)
14. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

### Required Accounts (Free tiers available)
- [ ] **GitHub Account** - Code repository (already have)
- [ ] **Railway Account** - Backend + Database hosting
- [ ] **Vercel Account** - Frontend CDN hosting
- [ ] **Cloudflare Account** - R2 file storage
- [ ] **SendGrid Account** - Email service (100 emails/day free)
- [ ] **Sentry Account** - Error monitoring (5K events/month free)
- [ ] **Plausible Account** - Analytics (optional, paid)

### Required Tools
- [ ] Git installed and configured
- [ ] Web browser (Chrome/Firefox recommended)
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command line access

### Required API Keys (obtain during setup)
- [ ] OpenAI API key (for video generation) - from https://platform.openai.com
- [ ] SendGrid API key - from https://app.sendgrid.com
- [ ] Sentry DSN - from https://sentry.io

### Payment Methods
- [ ] Credit/debit card for Railway (~$5-20/month)
- [ ] Credit/debit card for Cloudflare R2 (~$0-10/month)
- [ ] Optional: Card for Plausible (~$9/month)

**Note**: Most services offer free trials. Estimated total cost: $25-50/month depending on usage.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER DEVICE                          │
│                    (Browser/Mobile App)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend CDN)                     │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ index.html │  │  style.css │  │ JS modules │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  • Global CDN (ultra-fast loading)                          │
│  • Automatic HTTPS                                          │
│  • Git-based deployment                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ API Calls (/api/*)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   RAILWAY (Backend API)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Python Flask Server                      │  │
│  │                                                        │  │
│  │  • Authentication (login, register, sessions)        │  │
│  │  • Ad Management (CRUD operations)                   │  │
│  │  • Video Generation (OpenAI proxy)                   │  │
│  │  • Email Service (password resets)                   │  │
│  │  • File Upload handling                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ Database Queries                 │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                         │  │
│  │                                                        │  │
│  │  Tables:                                              │  │
│  │  • users (id, email, password_hash, created_at)      │  │
│  │  • sessions (token, user_id, expires_at)             │  │
│  │  • ads (id, user_id, title, price, images, video)    │  │
│  │  • password_resets (email, code, expires_at)         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ File Storage
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               CLOUDFLARE R2 (File Storage)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         S3-Compatible Object Storage                  │  │
│  │                                                        │  │
│  │  /uploads/images/                                     │  │
│  │    • 2024-11-09-abc123-image1.jpg                     │  │
│  │    • 2024-11-09-abc123-image2.jpg                     │  │
│  │                                                        │  │
│  │  /uploads/videos/                                     │  │
│  │    • 2024-11-09-abc123-video.mp4                      │  │
│  │                                                        │  │
│  │  • Zero egress fees                                  │  │
│  │  • S3 API compatibility                              │  │
│  │  • Global CDN delivery                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   SendGrid   │   │   OpenAI     │   │    Sentry    │
│    (Email)   │   │   (Video)    │   │ (Monitoring) │
└──────────────┘   └──────────────┘   └──────────────┘
```

**Data Flow**:
1. User visits `vidx.vercel.app` (Vercel serves static files)
2. User creates ad → Frontend calls `/api/ads` (Railway backend)
3. Backend validates → Saves to PostgreSQL
4. Backend uploads images → Cloudflare R2
5. Backend requests video → OpenAI API
6. Backend saves video URL → PostgreSQL + R2
7. Frontend displays ad with images/video from R2 CDN

---

## Step 1: Database Setup (Railway)

**Time**: 15 minutes  
**Cost**: Included in Railway backend plan

### 1.1 Create Railway Account

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended for easy deployment)
4. Authorize Railway to access your GitHub account

### 1.2 Create PostgreSQL Database

1. In Railway dashboard, click **"New Project"**
2. Select **"Provision PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. Wait ~30 seconds for provisioning

### 1.3 Get Database Credentials

1. Click on the PostgreSQL service in your Railway project
2. Go to **"Variables"** tab
3. Copy these values (you'll need them later):
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway
   PGHOST=containers-us-west-xxx.railway.app
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=[auto-generated]
   PGDATABASE=railway
   ```

4. **Save these credentials** in a secure location (password manager)

### 1.4 Test Database Connection (Optional)

If you have `psql` installed locally:

```bash
# Test connection
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"

# If connected successfully, you'll see:
# railway=>

# Exit with:
# \q
```

✅ **Checkpoint**: You now have a PostgreSQL database running on Railway.

---

## Step 2: Backend Deployment (Railway)

**Time**: 20 minutes  
**Cost**: ~$5-20/month (based on usage)

### 2.1 Prepare Backend Code

First, let's prepare the repository for deployment.

#### Create `requirements.txt`

Create a file at the **root** of your repository:

```txt
Flask==3.0.0
Flask-CORS==4.0.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
requests==2.31.0
gunicorn==21.2.0
sendgrid==6.11.0
boto3==1.34.0
```

#### Create `Procfile`

Create a file at the **root** of your repository:

```
web: gunicorn scripts.auth_server:app --bind 0.0.0.0:$PORT
```

#### Update `scripts/auth_server.py`

Add at the top of the file (after imports):

```python
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import hashlib
import secrets

app = Flask(__name__)

# CORS configuration
CORS(app, origins=[
    'http://localhost:8080',
    'http://localhost:3000',
    'https://*.vercel.app',  # Your Vercel frontend
], supports_credentials=True)

# Database connection
def get_db_connection():
    """Create database connection from DATABASE_URL environment variable"""
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if not DATABASE_URL:
        raise ValueError('DATABASE_URL environment variable not set')
    
    # Railway uses postgres:// but psycopg2 needs postgresql://
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn
```

### 2.2 Create Railway Backend Service

1. In your Railway project (same project as database), click **"New"**
2. Select **"GitHub Repo"**
3. Connect to your `vidx-video-marketplace-revolution` repository
4. Railway will automatically detect it's a Python app
5. Click **"Deploy"**

### 2.3 Configure Environment Variables

1. Click on your backend service in Railway
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add the following variables one by one:

```bash
# Database (auto-linked from Railway PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Flask Configuration
FLASK_ENV=production
SECRET_KEY=<generate-random-64-char-string>

# OpenAI API (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# SendGrid API (get from SendGrid dashboard)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Cloudflare R2 (will add after Step 3)
R2_ACCOUNT_ID=<will-fill-later>
R2_ACCESS_KEY_ID=<will-fill-later>
R2_SECRET_ACCESS_KEY=<will-fill-later>
R2_BUCKET_NAME=vidx-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Sentry (optional, will add in Step 9)
SENTRY_DSN=<will-fill-later>
```

**To generate SECRET_KEY**:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 2.4 Get Backend URL

1. In Railway backend service, go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will create a public URL like: `vidx-backend-production.up.railway.app`
5. **Save this URL** - you'll need it for frontend configuration

### 2.5 Test Backend Deployment

```bash
# Test health endpoint (create this endpoint first)
curl https://your-backend.up.railway.app/health

# Expected response:
# {"status": "ok", "database": "connected"}
```

#### Add Health Check Endpoint

Add to `scripts/auth_server.py`:

```python
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({'status': 'ok', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Commit and push - Railway will auto-deploy.

✅ **Checkpoint**: Backend is deployed and accessible via public URL.

---

## Step 3: File Storage Setup (Cloudflare R2)

**Time**: 20 minutes  
**Cost**: $0.015/GB storage + $0.36/million requests (very cheap)

### 3.1 Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify email address

### 3.2 Enable R2 Storage

1. In Cloudflare dashboard, click **"R2"** in left sidebar
2. Click **"Purchase R2"** (don't worry, free tier is generous)
3. Add payment method (required but won't charge unless you exceed free tier)
4. Free tier includes:
   - 10 GB storage/month
   - 1 million Class A operations/month (writes)
   - 10 million Class B operations/month (reads)

### 3.3 Create R2 Bucket

1. Click **"Create bucket"**
2. Bucket name: `vidx-uploads` (must be globally unique, add suffix if needed)
3. Location: **Automatic** (Cloudflare will optimize)
4. Click **"Create bucket"**

### 3.4 Configure Public Access

1. Click on your bucket (`vidx-uploads`)
2. Go to **"Settings"** tab
3. Scroll to **"Public access"**
4. Click **"Allow Access"**
5. Copy the **Public Bucket URL**: `https://pub-xxxxx.r2.dev`
6. Save this URL for environment variables

### 3.5 Create API Token

1. Go to **"R2"** → **"Manage R2 API Tokens"**
2. Click **"Create API token"**
3. Token name: `vidx-backend-access`
4. Permissions: **Object Read & Write**
5. Apply to specific bucket: Select `vidx-uploads`
6. Click **"Create API Token"**
7. **Copy and save** (shown only once):
   ```
   Access Key ID: xxxxxxxxxxxxx
   Secret Access Key: xxxxxxxxxxxxx
   Account ID: xxxxxxxxxxxxx
   ```

### 3.6 Test R2 Access (Optional)

Using AWS CLI (S3-compatible):

```bash
# Install AWS CLI if not installed
# brew install awscli  # macOS
# pip install awscli   # Python

# Configure profile
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

### 3.7 Update Railway Backend Variables

Go back to Railway backend service → Variables:

```bash
R2_ACCOUNT_ID=<your-account-id>
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
R2_BUCKET_NAME=vidx-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

✅ **Checkpoint**: File storage is ready and accessible.

---

## Step 4: Email Service Setup (SendGrid)

**Time**: 15 minutes  
**Cost**: Free (100 emails/day), $15/month (40K emails)

### 4.1 Create SendGrid Account

1. Go to https://signup.sendgrid.com
2. Sign up with email
3. Fill out account details
4. Choose **Free Plan** (100 emails/day)
5. Verify email address

### 4.2 Complete Sender Authentication

**Important**: SendGrid requires sender verification to prevent spam.

#### Option 1: Single Sender Verification (Quick)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Enter:
   - From Name: `VidX Marketplace`
   - From Email: `noreply@yourdomain.com` (use your actual domain)
   - Reply To: Your actual email
4. Click **"Create"**
5. Check your email and click verification link

#### Option 2: Domain Authentication (Recommended for production)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records provided by SendGrid to your domain registrar
5. Wait for DNS propagation (~10-60 minutes)
6. Verify in SendGrid dashboard

**Note**: If you don't have a custom domain yet, use Option 1 with a Gmail address for testing.

### 4.3 Create API Key

1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: `vidx-backend-production`
4. Permissions: **Full Access** (or **Mail Send** only for security)
5. Click **"Create & View"**
6. **Copy the API key** (shown only once): `SG.xxxxxxxxxxxxx`
7. Save securely

### 4.4 Update Railway Backend Variables

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=VidX Marketplace
```

### 4.5 Test Email Sending

Add test endpoint to `scripts/auth_server.py`:

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

@app.route('/test-email', methods=['POST'])
def test_email():
    """Test email sending (remove in production)"""
    try:
        message = Mail(
            from_email=os.environ.get('SENDGRID_FROM_EMAIL'),
            to_emails='your-email@example.com',
            subject='VidX Test Email',
            html_content='<strong>Email sending works!</strong>'
        )
        
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        
        return jsonify({
            'status': 'sent',
            'status_code': response.status_code
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

Test:
```bash
curl -X POST https://your-backend.up.railway.app/test-email
```

Check your email inbox.

✅ **Checkpoint**: Email service configured and working.

---

## Step 5: Frontend Deployment (Vercel)

**Time**: 15 minutes  
**Cost**: Free (for personal projects)

### 5.1 Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub

### 5.2 Prepare Frontend Code

#### Create `vercel.json` at repository root:

```json
{
  "version": 2,
  "buildCommand": "echo 'No build needed - static site'",
  "devCommand": "python3 -m http.server 8080",
  "installCommand": "echo 'No install needed'",
  "framework": null,
  "outputDirectory": ".",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend.up.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Replace** `your-backend.up.railway.app` with your actual Railway backend URL.

#### Update `js/auth-service.js`:

```javascript
constructor() {
    const hostname = window.location.hostname;
    
    // Use /api prefix for production (proxied by Vercel to Railway)
    // Use localhost:3001 for local development
    this.baseUrl = hostname === 'localhost' 
        ? 'http://localhost:3001'
        : '/api';  // Vercel will proxy to Railway backend
}
```

### 5.3 Deploy to Vercel

#### Option 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `vidx-video-marketplace-revolution` repo
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty
5. Click **"Deploy"**
6. Wait ~2 minutes for deployment

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /path/to/vidx-video-marketplace-revolution
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? vidx-marketplace
# Directory? ./
# Override settings? No

# Production deployment
vercel --prod
```

### 5.4 Get Frontend URL

After deployment completes:
- **Production URL**: `vidx-marketplace.vercel.app`
- Or custom domain if you configured one

### 5.5 Configure Custom Domain (Optional)

1. In Vercel project settings, go to **"Domains"**
2. Add your custom domain: `yourdomain.com`
3. Follow DNS configuration instructions
4. Add these DNS records to your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait for DNS propagation (~10-60 minutes)

### 5.6 Update CORS in Backend

Update Railway backend `scripts/auth_server.py`:

```python
CORS(app, origins=[
    'http://localhost:8080',
    'http://localhost:3000',
    'https://vidx-marketplace.vercel.app',  # Your Vercel URL
    'https://yourdomain.com',  # Your custom domain (if any)
    'https://www.yourdomain.com',
], supports_credentials=True)
```

Commit, push, Railway auto-deploys.

✅ **Checkpoint**: Frontend is live and accessible worldwide.

---

## Step 6: Environment Variables Configuration

**Time**: 10 minutes

### 6.1 Railway Backend Variables (Complete List)

Go to Railway backend service → Variables tab:

```bash
# Database (auto-linked)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Flask
FLASK_ENV=production
SECRET_KEY=<64-char-random-string>
PORT=8080

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=VidX Marketplace

# Cloudflare R2
R2_ACCOUNT_ID=xxxxxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
R2_BUCKET_NAME=vidx-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Frontend URL (for CORS)
FRONTEND_URL=https://vidx-marketplace.vercel.app

# Sentry (optional, add in Step 9)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 6.2 Vercel Environment Variables (if needed)

Most configuration is in `vercel.json`, but you can add environment variables:

1. Go to Vercel project → Settings → Environment Variables
2. Add any frontend-specific variables (usually not needed for static sites)

### 6.3 Local Development `.env`

Create `.env` file in repository root (for local testing):

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/vidx_local
FLASK_ENV=development
SECRET_KEY=local-development-key-not-secure
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
R2_ACCOUNT_ID=xxxxxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
R2_BUCKET_NAME=vidx-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

**Important**: Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

✅ **Checkpoint**: All environment variables configured.

---

## Step 7: Database Migrations

**Time**: 15 minutes

### 7.1 Create Database Schema

Create `scripts/setup_database.py`:

```python
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def setup_database():
    """Create database tables"""
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Users table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Sessions table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            token VARCHAR(255) UNIQUE NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Password resets table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            reset_code VARCHAR(10) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Ads table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS ads (
            id VARCHAR(100) PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price VARCHAR(50),
            category VARCHAR(50) NOT NULL,
            images JSONB DEFAULT '[]',
            video_url TEXT,
            video_status VARCHAR(50) DEFAULT 'pending',
            status VARCHAR(50) DEFAULT 'active',
            views INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create indexes
    cur.execute('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_ads_category ON ads(category)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status)')
    
    conn.commit()
    cur.close()
    conn.close()
    
    print("✅ Database tables created successfully!")

if __name__ == '__main__':
    setup_database()
```

### 7.2 Run Migrations Locally (Test)

```bash
# Install dependencies
pip3 install psycopg2-binary python-dotenv

# Run migrations
python3 scripts/setup_database.py
```

### 7.3 Run Migrations on Railway

#### Option 1: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migration
railway run python3 scripts/setup_database.py
```

#### Option 2: One-time Deployment Job

1. Add to `scripts/auth_server.py` (temporary):

```python
@app.route('/setup-database', methods=['POST'])
def setup_database_endpoint():
    """One-time database setup (REMOVE AFTER USE!)"""
    # Add authentication check here in production
    auth_header = request.headers.get('X-Setup-Key')
    if auth_header != os.environ.get('SETUP_KEY'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        from scripts.setup_database import setup_database
        setup_database()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

2. Add `SETUP_KEY` to Railway variables (random string)
3. Call endpoint:

```bash
curl -X POST https://your-backend.up.railway.app/setup-database \
  -H "X-Setup-Key: your-random-setup-key"
```

4. **Remove endpoint after use** (security risk if left active)

✅ **Checkpoint**: Database schema created and ready.

---

## Step 8: Testing & Verification

**Time**: 30 minutes

### 8.1 Frontend Tests

1. **Homepage Load**:
   - Visit `https://vidx-marketplace.vercel.app`
   - Check console for errors
   - Verify dark mode toggle works
   - Check all navigation links

2. **Authentication**:
   - Click "Sign In"
   - Register new account
   - Verify email doesn't error (won't actually send in test)
   - Login with new account
   - Check session persists on refresh

3. **Category Pages**:
   - Visit automotive, electronics, fashion pages
   - Verify empty states show
   - Check all filters work

### 8.2 Backend API Tests

```bash
# Health check
curl https://your-backend.up.railway.app/health

# Register user
curl -X POST https://your-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST https://your-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 8.3 Database Tests

Use Railway's built-in PostgreSQL client:

1. Railway dashboard → PostgreSQL service
2. Click **"Query"** tab
3. Run test queries:

```sql
-- Check users
SELECT * FROM users;

-- Check sessions
SELECT * FROM sessions;

-- Check database size
SELECT pg_size_pretty(pg_database_size('railway'));
```

### 8.4 File Upload Tests

1. Navigate to upload page
2. Select images
3. Check browser DevTools Network tab
4. Verify images upload to R2
5. Visit `https://pub-xxxxx.r2.dev/uploads/images/[filename]`
6. Verify image loads

### 8.5 End-to-End Test

Complete flow:
1. Register account
2. Login
3. Create new ad (upload images)
4. Generate video (may take 1-2 minutes)
5. Verify ad appears in "My Ads"
6. Verify ad appears in category page
7. View ad details
8. Share ad (test share modal)
9. Logout
10. View ad as anonymous user

✅ **Checkpoint**: All core features working in production.

---

## Step 9: Monitoring Setup (Sentry)

**Time**: 15 minutes  
**Cost**: Free (5K events/month)

### 9.1 Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up with GitHub or email
3. Choose **Free Plan** (5,000 events/month)

### 9.2 Create Project

1. Click **"Create Project"**
2. Platform: **Flask** (for backend)
3. Alert frequency: **Alert me on every new issue**
4. Project name: `vidx-backend`
5. Click **"Create Project"**

### 9.3 Get DSN

1. After project creation, copy the **DSN**:
   ```
   https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```
2. Save this for environment variables

### 9.4 Install Sentry in Backend

Update `requirements.txt`:

```txt
sentry-sdk[flask]==1.40.0
```

Update `scripts/auth_server.py`:

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

# Initialize Sentry (add after imports)
sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    integrations=[FlaskIntegration()],
    traces_sample_rate=0.1,  # 10% of transactions
    profiles_sample_rate=0.1,
    environment='production'
)
```

### 9.5 Add Sentry DSN to Railway

Railway backend → Variables:

```bash
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 9.6 Test Error Tracking

Add test endpoint (remove after testing):

```python
@app.route('/sentry-test')
def sentry_test():
    """Test Sentry error tracking"""
    raise Exception("Test error for Sentry!")
```

Visit: `https://your-backend.up.railway.app/sentry-test`

Check Sentry dashboard - error should appear within 1 minute.

✅ **Checkpoint**: Error monitoring active.

---

## Step 10: Analytics Setup (Plausible)

**Time**: 10 minutes  
**Cost**: $9/month (or self-host for free)

### 10.1 Create Plausible Account

1. Go to https://plausible.io/register
2. Sign up with email
3. Start 30-day free trial
4. Add payment method (required after trial)

### 10.2 Add Website

1. Enter domain: `vidx-marketplace.vercel.app`
2. Timezone: Select yours
3. Click **"Add snippet"**

### 10.3 Install Tracking Script

Add to **all HTML files** before `</head>`:

```html
<!-- Plausible Analytics -->
<script defer data-domain="vidx-marketplace.vercel.app" src="https://plausible.io/js/script.js"></script>
```

**Better**: Add to `templates/dark-mode-head.html` if using template includes.

### 10.4 Verify Tracking

1. Deploy to Vercel (commit + push)
2. Visit your site
3. Check Plausible dashboard (real-time visitors)
4. Should see yourself as "1 current visitor"

### 10.5 Configure Goals (Optional)

Track important events:

1. Plausible dashboard → Settings → Goals
2. Add custom events:
   - `Register` - User registration
   - `Login` - User login
   - `Create Ad` - Ad creation
   - `Generate Video` - Video generation
   - `Share` - Ad sharing

Add to JavaScript:

```javascript
// Track event
window.plausible('Register', {
    props: {
        method: 'email'
    }
});
```

✅ **Checkpoint**: Analytics tracking live.

---

## Troubleshooting

### Common Issues

#### 1. "DATABASE_URL not set" Error

**Problem**: Backend can't connect to database

**Solution**:
```bash
# Railway dashboard → PostgreSQL service → Variables
# Copy DATABASE_URL

# Railway backend → Variables
# Add: DATABASE_URL=${{Postgres.DATABASE_URL}}
```

#### 2. CORS Errors in Browser Console

**Problem**: Frontend can't call backend API

**Solution**:
```python
# Update scripts/auth_server.py
CORS(app, origins=[
    'https://vidx-marketplace.vercel.app',  # Add your Vercel URL
], supports_credentials=True)
```

#### 3. Images Not Loading from R2

**Problem**: R2 bucket not public

**Solution**:
```bash
# Cloudflare dashboard → R2 → Your bucket → Settings
# Enable "Public Access"
```

#### 4. Railway Deployment Fails

**Problem**: Missing dependencies or Procfile

**Solution**:
```bash
# Check logs: Railway → Backend → Deployments → Click failed deployment
# Common fixes:
# - Add missing package to requirements.txt
# - Fix Procfile path: web: gunicorn scripts.auth_server:app
# - Check Python version (Railway uses 3.11 by default)
```

#### 5. Vercel 404 on Page Refresh

**Problem**: Client-side routing not configured

**Solution**:
```json
// vercel.json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "https://backend.railway.app/api/$1" },
    { "src": "/(.*)", "dest": "/$1" }  // Serve static files
  ]
}
```

#### 6. Email Not Sending

**Problem**: SendGrid sender not verified

**Solution**:
```bash
# SendGrid → Settings → Sender Authentication
# Verify single sender OR authenticate domain
# Check spam folder for verification email
```

---

## Post-Deployment Checklist

### Security

- [ ] All API keys stored in environment variables (not hardcoded)
- [ ] `.env` file added to `.gitignore`
- [ ] HTTPS enabled (automatic with Vercel/Railway)
- [ ] CORS configured with specific origins (no wildcards)
- [ ] Database credentials never committed to Git
- [ ] Rate limiting configured (optional for MVP)

### Performance

- [ ] Images compressed and resized before upload
- [ ] Cloudflare R2 CDN enabled for fast global delivery
- [ ] Vercel Edge Network serving static files
- [ ] Database indexes created for frequent queries
- [ ] Service worker caching enabled

### Monitoring

- [ ] Sentry error tracking active
- [ ] Plausible analytics installed
- [ ] Railway health checks configured
- [ ] Database backup schedule set (Railway auto-backups)
- [ ] Uptime monitoring (optional: UptimeRobot)

### Testing

- [ ] Registration flow works end-to-end
- [ ] Login/logout works
- [ ] Ad creation with image upload works
- [ ] Video generation completes successfully
- [ ] Email sending works (password reset)
- [ ] Mobile responsive design tested
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### Documentation

- [ ] Environment variables documented
- [ ] Deployment process documented (this guide!)
- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Troubleshooting guide created

### Business

- [ ] Custom domain configured (optional)
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Contact page created
- [ ] Support email configured

---

## Cost Breakdown (Monthly)

```
Service              Plan          Cost       Notes
─────────────────────────────────────────────────────────────
Railway (Backend)    Hobby         $5-20      Based on usage
Railway (Database)   Included      $0         Included in backend plan
Cloudflare R2        Pay-as-go     $0-10      First 10GB free
SendGrid             Free          $0         100 emails/day
Vercel               Hobby         $0         Unlimited for personal
Sentry               Free          $0         5K events/month
Plausible            Growth        $9         (optional)
Domain (optional)    Annual        $12/year   ~$1/month

Total:               ~$15-40/month (without Plausible)
                     ~$25-50/month (with Plausible)
```

**Free Tier Limits:**
- Railway: $5 credit/month (enough for small apps)
- R2: 10GB storage + 1M writes + 10M reads
- SendGrid: 100 emails/day
- Vercel: Unlimited bandwidth for personal projects
- Sentry: 5,000 errors/month

**When to upgrade:**
- Railway: >100 concurrent users or high CPU usage
- R2: >10GB storage or >1M uploads/month
- SendGrid: >100 emails/day
- Sentry: >5K errors/month

---

## Next Steps After Deployment

1. **Week 1**: Monitor error rates and fix any production bugs
2. **Week 2**: Gather user feedback and iterate
3. **Week 3**: Optimize performance based on analytics
4. **Month 2**: Consider custom domain and branding
5. **Month 3**: Implement custom video pipeline (95% cost savings)
6. **Month 4+**: Add new features (messaging, reviews, notifications)

---

## Support & Resources

### Documentation
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Cloudflare R2: https://developers.cloudflare.com/r2
- SendGrid: https://docs.sendgrid.com
- Sentry: https://docs.sentry.io

### Community
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://discord.gg/vercel
- Stack Overflow: Tag questions with `railway`, `vercel`, `cloudflare-r2`

### Helpful Commands

```bash
# Railway CLI
railway login
railway link
railway logs
railway run <command>
railway status

# Vercel CLI
vercel login
vercel deploy
vercel logs
vercel env pull

# Git workflow
git add .
git commit -m "Deploy to production"
git push origin main
# Both Railway and Vercel auto-deploy on push!
```

---

**Deployment Status**: ✅ Complete  
**Production URL**: `https://vidx-marketplace.vercel.app`  
**Backend API**: `https://vidx-backend.up.railway.app`  
**Total Setup Time**: ~3-4 hours  
**Monthly Cost**: $25-50

🎉 **Congratulations! Your VidX platform is now live in production!**
