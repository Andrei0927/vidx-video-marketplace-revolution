# Video Pipeline Testing Guide

## Quick Start

### Method 1: Using Upload Flow (Main App)

1. **Login to the platform**
   - Go to: https://mango-desert-0f205db03.3.azurestaticapps.net
   - Register or login

2. **Navigate to Upload**
   - Click "Sell Item" or go to `/upload.html`

3. **Upload Images**
   - Click "Browse Files" button OR
   - Drag and drop images onto the upload area
   - Select 2-5 product images

4. **Fill in Product Details**
   - Enter title, description, category, price
   - Select voice and music options
   - Click "Next"

5. **Generate Video**
   - The system will automatically:
     - Generate AI script from your description
     - Create voiceover with OpenAI TTS
     - Generate captions with Whisper
     - Render video with FFmpeg
     - Upload to Cloudflare R2
   - Total time: 40-90 seconds

### Method 2: Using API Tester (Standalone Tool)

**Best for debugging and development**

1. **Login to main app first**
   - Go to: https://mango-desert-0f205db03.3.azurestaticapps.net
   - Login with your account

2. **Get session token**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Run: `localStorage.getItem('sessionToken')`
   - Copy the token (starts with random characters)

3. **Open API tester**
   - File: `test-video-api.html`
   - Open directly in browser or:
   - Deploy to GitHub Pages: https://andrei0927.github.io/vidx-video-marketplace-revolution/test-video-api.html

4. **Configure API tester**
   - Paste session token
   - Backend URL is pre-filled

5. **Test Script Generation**
   - Fill in product details
   - Click "Generate Script"
   - See AI-generated script in ~2 seconds
   - Cost: $0.001

6. **Test Video Generation**
   - Fill in product details
   - Select 2-5 images
   - Click "Generate Video"
   - Watch progress bar
   - Get video URL in 40-90 seconds
   - Cost: ~$0.007

## API Endpoints

### 1. Generate Script

```bash
POST /api/video/generate-script
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "title": "2020 Toyota Camry",
  "description": "Excellent condition family sedan...",
  "category": "automotive",
  "price": 18500,
  "details": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020
  }
}
```

**Response:**
```json
{
  "success": true,
  "script": "Looking for a reliable family car?...",
  "estimatedDuration": 15,
  "wordCount": 58,
  "cost": 0.001
}
```

### 2. Generate Video

```bash
POST /api/video/generate
Content-Type: multipart/form-data
Authorization: Bearer {session_token}

Fields:
- title: string
- description: string
- category: string (automotive|electronics|fashion)
- price: number
- voice: string (alloy|echo|fable|onyx|nova|shimmer)
- images[]: files (2-5 images, JPG/PNG)
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://pub-xxx.r2.dev/videos/20251109_abc123.mp4",
  "script": "Looking for a reliable family car?...",
  "duration": 14.5,
  "cost": 0.007,
  "thumbnailUrl": "https://pub-xxx.r2.dev/videos/20251109_abc123_thumb.jpg",
  "captions": "Looking for a reliable family car? Check out..."
}
```

## Voice Options

| Voice | Style | Best For |
|-------|-------|----------|
| **alloy** | Neutral, balanced | Professional, default |
| **echo** | Male, clear | Automotive, tech |
| **fable** | British accent | Luxury, premium items |
| **onyx** | Deep, authoritative | Real estate, high-value |
| **nova** | Warm, engaging | Fashion, lifestyle |
| **shimmer** | Soft, friendly | Family items, casual |

## Expected Performance

| Stage | Time | Cost |
|-------|------|------|
| Script Generation | 1-2s | $0.001 |
| Voiceover (TTS) | 3-5s | $0.003 |
| Captions (Whisper) | 2-4s | $0.003 |
| Video Rendering | 30-60s | FREE |
| Upload to R2 | 2-5s | ~$0.015/GB |
| **TOTAL** | **40-90s** | **~$0.007** |

## Troubleshooting

### Upload Button Not Working

**Problem:** Browse button doesn't open file dialog

**Solutions:**
1. Try drag-and-drop instead
2. Click directly on upload area
3. Hard refresh (Cmd+Shift+R)
4. Use API tester tool instead

### "Session token required"

**Problem:** Not logged in or session expired

**Solution:**
1. Login at main site
2. Get fresh session token from localStorage
3. Paste into API tester

### "OpenAI API key not configured"

**Problem:** Backend missing OPENAI_API_KEY

**Solution:**
```bash
# Add to backend environment
az containerapp update \
  --name video-marketplace-api \
  --resource-group video-marketplace-prod \
  --set-env-vars "OPENAI_API_KEY=sk-proj-..."
```

### Video generation times out

**Possible causes:**
- Too many images (max 5)
- Images too large (resize to 1920x1080)
- FFmpeg not installed on backend
- Backend cold start (first request takes longer)

**Solution:**
1. Check backend logs
2. Reduce image count to 2-3
3. Resize images before upload
4. Wait 2 minutes for cold start

### "Failed to upload to R2"

**Problem:** R2 credentials not configured

**Solution:**
```bash
# Verify R2 env vars
az containerapp show \
  --name video-marketplace-api \
  --resource-group video-marketplace-prod \
  --query "properties.template.containers[0].env"
```

Should show:
- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME

## Testing Checklist

- [ ] Backend health check passes
- [ ] Script generation works (test-video-api.html)
- [ ] Full video pipeline works (test-video-api.html)
- [ ] Upload flow works (upload.html)
- [ ] Video plays correctly
- [ ] Cost under $0.01 per video
- [ ] Total time under 2 minutes
- [ ] Video quality acceptable
- [ ] Captions visible and accurate
- [ ] R2 public URLs accessible

## Example Test Data

### Automotive
```json
{
  "title": "2020 Toyota Camry SE",
  "description": "Excellent condition family sedan with low mileage. Perfect first car or reliable daily driver. Full service history, one owner, accident-free. Features include backup camera, lane assist, and premium sound system.",
  "category": "automotive",
  "price": 18500
}
```

### Electronics
```json
{
  "title": "iPhone 13 Pro Max 256GB",
  "description": "Like new condition, barely used. Comes with original box, charger, and protective case. No scratches, battery health 98%. Unlocked for all carriers.",
  "category": "electronics",
  "price": 899
}
```

### Fashion
```json
{
  "title": "Vintage Leather Jacket",
  "description": "Authentic vintage leather jacket from the 80s. Premium quality leather, perfect patina. Size medium, fits true to size. No tears or damage, well maintained.",
  "category": "fashion",
  "price": 250
}
```

## Cost Tracking

Monitor costs in OpenAI dashboard:
- https://platform.openai.com/usage

Expected monthly costs (100 videos):
- Script generation: 100 × $0.001 = $0.10
- TTS voiceovers: 100 × $0.003 = $0.30
- Whisper captions: 100 × $0.003 = $0.30
- R2 storage: 100 × 10MB = 1GB = $0.015
- **Total: $0.715 for 100 videos**

Compare to:
- Revid.ai: 100 × $0.50 = $50.00 (70x more expensive!)
- Pictory.ai: 100 × $1.00 = $100.00 (140x more expensive!)

## Next Steps

1. Test upload flow on production
2. Generate sample videos for each category
3. Monitor costs and performance
4. Optimize FFmpeg parameters if needed
5. Add caching for common scripts
6. Implement rate limiting
7. Add video preview before publishing

## Support

If issues persist:
1. Check backend logs: `az containerapp logs show --name video-marketplace-api`
2. Verify environment variables are set
3. Test OpenAI API key independently
4. Check R2 bucket permissions
5. Review CREDENTIALS.txt for all secrets
