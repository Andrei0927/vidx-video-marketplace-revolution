# Revid.ai API Integration Guide

## Overview

VidX uses Revid.ai to automatically generate professional video ads from user-uploaded images and descriptions. The integration handles:

- **AI Script Generation**: Creates engaging promotional scripts from item descriptions
- **Text-to-Speech**: Professional voiceover using a consistent brand voice
- **Video Creation**: TikTok-style slideshow with transitions and effects
- **Auto Captions**: Accessibility-friendly captions in TikTok style
- **Background Music**: Curated music options to match the vibe

## Features

### User-Facing Features

1. **Simplified Options**
   - Music selection (4 options: Upbeat, Calm, Energetic, No Music)
   - Video style is fixed to "slideshow" for consistency
   - One consistent AI voice for brand familiarity (like TikTok's signature voice)

2. **Automated Video Generation**
   - Upload images → Add description → Get professional video
   - No video editing skills required
   - 15-30 second videos optimized for social media
   - Vertical format (9:16) for mobile

3. **Smart Script Generation**
   - AI analyzes product description
   - Maintains factual accuracy (only uses provided info)
   - Includes pricing and key features
   - Professional, conversational tone
   - Clear call-to-action

## Technical Implementation

### File Structure

```
js/
  revid-service.js          # Main Revid API service
upload.html                 # Step 1: Upload images, select music
upload-details.html         # Step 2: Add product details
upload-review.html          # Step 3: Generate video & publish
```

### API Configuration

**Location**: `js/revid-service.js`

```javascript
class RevidService {
    constructor() {
        this.apiKey = 'YOUR_REVID_API_KEY';  // ⚠️ REPLACE THIS
        this.baseUrl = 'https://api.revid.ai/v1';
        this.defaultVoice = 'emma';  // Consistent brand voice
    }
}
```

### Setting Up Your API Key

1. **Get API Key**:
   - Sign up at [revid.ai](https://www.revid.ai/)
   - Purchase credits (video generation requires credits)
   - Get API key from dashboard

2. **Configure API Key**:
   ```bash
   # Open the service file
   nano js/revid-service.js
   
   # Find line 9 and replace placeholder
   this.apiKey = 'your-actual-api-key-here';
   ```

3. **Test Integration**:
   - Upload test images
   - Add product description
   - Click "Publish Ad"
   - Check browser console for API responses

## API Endpoints Used

### 1. Script Generation

**Endpoint**: `POST /v1/script/generate`

**Request**:
```json
{
  "prompt": "Create script for [category] listing...",
  "tone": "professional",
  "length": "short",
  "platform": "tiktok"
}
```

**Response**:
```json
{
  "id": "script_abc123",
  "script": "Check out this amazing...",
  "duration": 25
}
```

### 2. Video Generation

**Endpoint**: `POST /v1/video/generate`

**Request**:
```json
{
  "script": "Generated script text",
  "voice": "emma",
  "music": "upbeat_commercial",
  "style": "image_slideshow",
  "images": [...base64 encoded images],
  "captions": {
    "enabled": true,
    "style": "tiktok",
    "position": "center",
    "animation": true
  },
  "format": {
    "resolution": "1080x1920",
    "fps": 30,
    "quality": "high"
  }
}
```

**Response**:
```json
{
  "job_id": "job_xyz789",
  "status": "processing",
  "estimated_time": 60
}
```

### 3. Status Check

**Endpoint**: `GET /v1/video/status/{job_id}`

**Response**:
```json
{
  "status": "completed",
  "progress": 100,
  "video_url": "https://cdn.revid.ai/videos/...",
  "thumbnail_url": "https://cdn.revid.ai/thumbs/...",
  "duration": 28
}
```

## Integration Flow

### Upload Flow (User Perspective)

```
1. Upload Images
   └─> Select background music
   └─> Click "Next"

2. Add Product Details
   └─> Title, description, price
   └─> Category-specific fields
   └─> Click "Next"

3. Review & Publish
   └─> Preview all details
   └─> Click "Publish Ad"
   └─> AI generates video (1-2 min)
   └─> Ad published with video
```

### Technical Flow

```
1. uploadFiles stored in sessionStorage
2. User fills details form
3. On publish click:
   a. Generate script via Revid API
   b. Convert images to format Revid expects
   c. Submit video generation job
   d. Poll for completion (5s intervals, 5min max)
   e. Store video URL with ad data
   f. Publish to marketplace
```

## Configuration Options

### Music Options

Defined in `revidService.musicOptions`:

```javascript
{
  'upbeat': 'upbeat_commercial',      // High energy, exciting
  'calm': 'calm_background',          // Professional, relaxed
  'energetic': 'energetic_promo',     // Fast-paced, dynamic
  'none': null                        // No background music
}
```

### Video Styles

Fixed to slideshow for consistency:

```javascript
{
  'slideshow': 'image_slideshow',     // Main style (used)
  'dynamic': 'dynamic_slideshow'      // Optional zoom/pan
}
```

### Voice Configuration

Single voice for brand consistency:

```javascript
this.defaultVoice = 'emma';  // Professional, clear voice
```

**Why one voice?**
- Creates brand recognition (like TikTok's signature voice)
- Users get familiar with the sound
- Professional and consistent quality

## Error Handling

### No API Credits

If API key has no credits:

```javascript
// Fallback to client-side script generation
_generateFallbackScript(description, title, price, details)
```

User sees error message:
```
"This is likely due to missing API credits. 
The video generation requires an active Revid.ai API key with credits."
```

### API Failures

- Script generation fails → Use fallback template
- Video generation fails → Show error with retry button
- Timeout (5 min) → Show timeout error

### Network Issues

```javascript
try {
  const response = await fetch(...);
  if (!response.ok) {
    throw new Error(`API failed: ${response.statusText}`);
  }
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error
}
```

## Testing Without API Credits

### Development Mode

The service includes fallback functionality:

1. **Script Generation Fallback**:
   ```javascript
   _generateFallbackScript(description, title, price, details)
   ```
   - Creates basic script from description
   - No API call required
   - Good for testing UI flow

2. **Mock Video Generation**:
   ```javascript
   // Comment out actual API call
   // const videoJob = await revidService.generateVideo(...);
   
   // Use mock response
   const videoJob = {
     jobId: 'test_' + Date.now(),
     status: 'completed',
     videoUrl: '/demo-video.mp4'
   };
   ```

### Testing Checklist

- [ ] Upload images (at least 1)
- [ ] Select music option
- [ ] Fill product details
- [ ] Review page shows correct data
- [ ] Publish button triggers video generation
- [ ] Progress bar updates
- [ ] Error handling works
- [ ] Success redirect works

## Production Deployment

### Environment Variables

For production, use environment variables:

```javascript
// In production config
this.apiKey = process.env.REVID_API_KEY || 'YOUR_REVID_API_KEY';
```

### Security

⚠️ **Never expose API key in client-side code for production!**

**Recommended approach**:

1. Create backend proxy endpoint:
   ```python
   # auth_server.py
   @app.route('/api/revid/generate-video', methods=['POST'])
   def proxy_revid():
       # API key stored securely on server
       headers = {'Authorization': f'Bearer {REVID_API_KEY}'}
       # Forward request to Revid.ai
   ```

2. Update client to call proxy:
   ```javascript
   // js/revid-service.js
   this.baseUrl = '/api/revid';  // Proxy through your server
   ```

### Rate Limiting

Implement rate limiting to prevent abuse:

```python
# Limit video generation per user
@limiter.limit("5 per hour")
@app.route('/api/revid/generate-video', methods=['POST'])
```

### Cost Management

Track usage:

```python
# Log each video generation
logger.info(f"Video generated for user {user_id}, cost: {credits_used}")
```

## API Documentation

**Official Docs**: https://documenter.getpostman.com/view/36975521/2sA3kPo4BR

**Support**: https://www.revid.ai/contact

## Troubleshooting

### "Publishing Failed" Error

**Cause**: API key invalid or no credits

**Fix**:
1. Check API key is correct in `revid-service.js`
2. Verify credits in Revid.ai dashboard
3. Check browser console for detailed error

### Video Generation Timeout

**Cause**: Video taking >5 minutes

**Fix**:
1. Reduce number of images (max 10 recommended)
2. Check Revid.ai status page
3. Increase timeout in `waitForVideo()`:
   ```javascript
   const maxAttempts = 120;  // 10 minutes instead of 5
   ```

### Script Not Accurate

**Cause**: Vague or incomplete description

**Fix**:
1. Provide detailed product description
2. Include key features and specs
3. Use clear, factual language
4. Check generated script in console logs

### Images Not Processing

**Cause**: Image size or format issues

**Fix**:
1. Compress large images (<5MB each)
2. Use standard formats (JPEG, PNG)
3. Limit to 10 images max
4. Check browser console for errors

## Next Steps

1. **Get API Key**: Sign up at revid.ai and purchase credits
2. **Configure**: Replace placeholder API key in `revid-service.js`
3. **Test**: Upload test product and generate video
4. **Optimize**: Adjust music/voice based on user feedback
5. **Secure**: Move API key to backend for production
6. **Monitor**: Track usage and costs

## Related Files

- `js/revid-service.js` - Main API service
- `upload.html` - Image upload and music selection
- `upload-details.html` - Product details form
- `upload-review.html` - Video generation trigger
- `DEV_GUIDE.md` - General development guide
- `AUTH_README.md` - Authentication system docs
