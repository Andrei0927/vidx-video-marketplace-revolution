# R2 Production Setup - CRITICAL

## ⚠️ URGENT: Rate Limiting Issue

**Current Problem**: We're using `pub-384ac06d34574276b20539cbf26191e2.r2.dev` which is:
- ❌ **Rate limited** for production use
- ❌ Meant for **development/testing only**
- ❌ Will cause video loading failures at scale

**Impact**: Videos may fail to load for users when rate limits are hit.

## 🚨 Required Actions

### Option 1: Custom Domain (Recommended)

Set up a custom domain for R2 to bypass rate limits and get production-grade performance.

#### Steps:

1. **In Cloudflare Dashboard**:
   - Go to R2 > `video-marketplace-videos`
   - Click "Settings" > "Public Access"
   - Click "Connect Domain"
   - Choose a subdomain: `videos.vidx-marketplace.com` (or similar)
   - Follow DNS setup instructions

2. **Update Environment Variables**:
   ```bash
   # In Azure App Service Configuration
   R2_PUBLIC_URL=https://videos.vidx-marketplace.com
   ```

3. **Update db.json**:
   Replace all `pub-384ac06d34574276b20539cbf26191e2.r2.dev` URLs with your custom domain

#### Benefits:
- ✅ No rate limits
- ✅ Better performance (Cloudflare CDN)
- ✅ Custom branding
- ✅ Full CORS control
- ✅ SSL/TLS included

### Option 2: Cloudflare Workers Proxy (Quick Fix)

If you don't have a custom domain, use a Worker to proxy R2:

1. **Create Worker** (`r2-video-proxy`):
   ```javascript
   export default {
     async fetch(request, env) {
       const url = new URL(request.url);
       const objectKey = url.pathname.slice(1); // Remove leading /
       
       try {
         const object = await env.MY_BUCKET.get(objectKey);
         if (!object) {
           return new Response('Video not found', { status: 404 });
         }
         
         const headers = new Headers();
         headers.set('Content-Type', 'video/mp4');
         headers.set('Access-Control-Allow-Origin', '*');
         headers.set('Cache-Control', 'public, max-age=31536000');
         
         return new Response(object.body, { headers });
       } catch (error) {
         return new Response('Error loading video', { status: 500 });
       }
     }
   };
   ```

2. **Bind R2 Bucket** to Worker:
   ```bash
   wrangler r2 bucket binding create MY_BUCKET --bucket video-marketplace-videos
   ```

3. **Deploy Worker**:
   ```bash
   wrangler deploy
   ```

4. **Update Environment**:
   ```bash
   R2_PUBLIC_URL=https://r2-video-proxy.your-subdomain.workers.dev
   ```

### Option 3: Migrate to Azure Blob Storage

If R2 continues to cause issues:

1. Create Azure Storage Account
2. Enable Static Website hosting
3. Upload videos to `$web` container
4. Update URLs to use Azure CDN

## Problem
Videos from R2 bucket fail to load with CORS error:
```
Access to video at 'https://pub-384ac06d34574276b20539cbf26191e2.r2.dev/...' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header 
is present on the requested resource.
```

## Solution
Configure CORS on the Cloudflare R2 bucket.

### Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to R2 > Your Bucket
3. Click on "Settings"
4. Scroll to "CORS Policy"
5. Add the CORS configuration from `r2-cors-config.json`

### Using Wrangler CLI

```bash
# Install wrangler if needed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set CORS configuration
wrangler r2 bucket cors put video-marketplace-videos \
  --file r2-cors-config.json
```

### Verify CORS Configuration

```bash
# Check current CORS settings
wrangler r2 bucket cors get video-marketplace-videos
```

### Test CORS

After applying the configuration, test with:

```bash
curl -H "Origin: https://vidx-marketplace.azurewebsites.net" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://pub-384ac06d34574276b20539cbf26191e2.r2.dev/test-videos/automotive/6ffc3239_1762826994.mp4
```

You should see `Access-Control-Allow-Origin` in the response headers.

## Alternative: Use R2 Custom Domain

If CORS configuration doesn't work, you can:

1. Set up a custom domain for R2 bucket (e.g., `videos.vidx.com`)
2. This allows full control over CORS headers via Cloudflare Workers
3. No `crossorigin` attribute needed on video elements

## Current Workaround

The video elements have been configured to work WITHOUT CORS by:
- Removing `crossorigin="anonymous"` attribute
- Videos load as regular resources (no credentials)
- This works for public videos but prevents some advanced features

## Note

The CORS configuration in `r2-cors-config.json` allows:
- GET and HEAD requests
- Origins: production site + localhost for development
- Standard video headers
- 1 hour cache for preflight requests
