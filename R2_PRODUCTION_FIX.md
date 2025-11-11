# R2 Production Deployment - Quick Fix Guide

## 🚨 Current Issue

**Rate Limiting**: The `pub-*.r2.dev` URL is rate-limited and not suitable for production.

**Current URL**: `https://pub-384ac06d34574276b20539cbf26191e2.r2.dev`  
**Status**: ❌ Development only, rate limited  
**Impact**: Videos fail to load after hitting rate limits

## ✅ Solution: Deploy Cloudflare Worker Proxy

This bypasses R2 rate limits by proxying requests through a Cloudflare Worker.

### Prerequisites

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Step 1: Deploy the Worker

```bash
# Deploy from project root
wrangler deploy

# Expected output:
# ✨ Built successfully
# 🚀 Deployed r2-video-proxy
# 🔗 https://r2-video-proxy.<your-subdomain>.workers.dev
```

### Step 2: Test the Worker

```bash
# Test with a video URL
curl -I "https://r2-video-proxy.<your-subdomain>.workers.dev/test-videos/automotive/6ffc3239_1762826994.mp4"

# Should return:
# HTTP/2 200
# content-type: video/mp4
# access-control-allow-origin: *
```

### Step 3: Update Production Environment

**In Azure App Service Configuration**:

1. Go to Azure Portal
2. Navigate to your App Service: `vidx-marketplace`
3. Click "Configuration" → "Application settings"
4. Update `R2_PUBLIC_URL`:
   ```
   OLD: https://pub-384ac06d34574276b20539cbf26191e2.r2.dev
   NEW: https://r2-video-proxy.<your-subdomain>.workers.dev
   ```
5. Click "Save"
6. Restart the app

### Step 4: Update Local Development

**File: `.env.production`**

```bash
# Update this line:
R2_PUBLIC_URL=https://r2-video-proxy.<your-subdomain>.workers.dev
```

**Commit and push**:
```bash
git add .env.production wrangler.toml cloudflare-worker-r2-proxy.js
git commit -m "Add Cloudflare Worker proxy for R2 to bypass rate limits"
git push
```

### Step 5: Update Database URLs (if needed)

If `db.json` has hardcoded URLs, update them:

```bash
# Find all old URLs
grep -r "pub-384ac06d34574276b20539cbf26191e2.r2.dev" data/

# Replace with worker URL (do this carefully)
# Or regenerate videos with new R2_PUBLIC_URL
```

## 🎯 Verification

1. **Check Worker Logs**:
   ```bash
   wrangler tail
   ```

2. **Test Production Site**:
   - Open: https://vidx-marketplace.azurewebsites.net/automotive
   - Video should load without CORS errors
   - Check browser console - no rate limit errors

3. **Monitor Performance**:
   - Cloudflare Dashboard → Workers → r2-video-proxy
   - Check requests, errors, and latency

## 📊 Benefits of Worker Proxy

✅ **No Rate Limits**: Workers have generous limits (100k requests/day free tier)  
✅ **CORS Handled**: Full control over CORS headers  
✅ **Range Requests**: Proper video seeking support  
✅ **Caching**: 1-year cache for videos (immutable content)  
✅ **Performance**: Cloudflare's global network  
✅ **Cost**: Free for most use cases  

## 🔮 Long-term Solution

For production at scale, consider:

1. **Custom Domain for R2**:
   - Setup: `videos.yourdomain.com` → R2 bucket
   - Benefit: Direct R2 access, no worker overhead
   - Cost: Requires domain ownership

2. **Azure CDN + Blob Storage**:
   - Upload videos to Azure Blob Storage
   - Use Azure CDN for delivery
   - Benefit: Integrated with Azure, Microsoft support

3. **Hybrid Approach**:
   - Use Worker for now
   - Migrate to custom domain when ready
   - Keep Worker as fallback

## 🆘 Troubleshooting

**Worker not deploying?**
```bash
# Check Wrangler version
wrangler --version

# Update if needed
npm update -g wrangler

# Login again
wrangler logout
wrangler login
```

**Videos still not loading?**
- Check Azure App Service environment variables
- Verify worker URL is correct
- Check worker logs: `wrangler tail`
- Test directly: `curl -I <worker-url>/test-videos/...`

**CORS errors still appearing?**
- Worker adds proper CORS headers
- But check if video URLs in HTML are correct
- Verify no mixed http/https issues

## 📝 Next Steps

1. Deploy worker: `wrangler deploy`
2. Get worker URL from output
3. Update Azure environment variable
4. Restart Azure App Service
5. Test production site
6. Monitor worker analytics

**Estimated Time**: 10-15 minutes  
**Downtime**: None (existing videos continue working until switch)
