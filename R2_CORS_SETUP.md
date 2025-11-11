# R2 CORS Configuration Instructions

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
