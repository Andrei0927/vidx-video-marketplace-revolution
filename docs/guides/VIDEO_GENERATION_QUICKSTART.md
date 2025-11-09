# Video Generation Quick Start

Get your first AI-generated video in 5 minutes.

## Prerequisites

- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Node.js 18+ (for local testing)
- Python 3.9+ (for backend)

## Quick Setup

### 1. Configure OpenAI API Key

Add to your backend `.env` file:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

⚠️ **IMPORTANT**: Never commit this file or expose the API key in frontend code!

### 2. Test Script Generation

```javascript
import videoGenerationService from './js/video-generation-service.js';

const result = await videoGenerationService.generateScript({
  description: '2020 Toyota Camry in excellent condition with low mileage',
  title: '2020 Toyota Camry',
  category: 'automotive',
  price: 18500
});

console.log(result.script);
// Output: "Looking for a reliable family car? Check out this stunning 2020 Toyota Camry..."
```

### 3. Generate Your First Video

```javascript
// Prepare your images
const imageFiles = [
  document.getElementById('image1').files[0],
  document.getElementById('image2').files[0],
  document.getElementById('image3').files[0]
];

// Start video generation
const job = await videoGenerationService.generateVideo({
  script: result.script,
  files: imageFiles,
  music: 'upbeat',
  voice: 'alloy'
});

console.log('Job started:', job.jobId);
// Output: "Job started: job_abc123"

// Wait for completion with progress updates
const video = await videoGenerationService.waitForVideo(
  job.jobId,
  (status) => {
    console.log(`${status.status}: ${status.progress}%`);
  }
);

console.log('Video ready:', video.videoUrl);
// Output: "Video ready: https://cdn.example.com/videos/xyz.mp4"
```

## API Flow

```
1. generateScript()     → Returns AI-generated script in 1-2s
2. generateVideo()      → Starts async job, returns jobId
3. waitForVideo()       → Polls until complete (40-90s total)
   └─ Progress updates: script → audio → captions → render → upload → complete
4. Result               → Video URL ready for download/playback
```

## Voice Options

```javascript
const voices = {
  'alloy': 'Neutral, balanced (default)',
  'echo': 'Male, clear',
  'fable': 'British accent',
  'onyx': 'Deep, authoritative',
  'nova': 'Warm, engaging',
  'shimmer': 'Soft, friendly'
};

// Try different voices
await videoGenerationService.generateVideo({
  script: "...",
  voice: 'nova'  // Warm and engaging tone
});
```

## Music Options

```javascript
const musicOptions = {
  'upbeat': 'Energetic, positive',
  'calm': 'Relaxing, professional',
  'energetic': 'High-energy, exciting',
  'none': 'No background music'
};
```

## Progress Tracking

### Basic Progress

```javascript
const job = await videoGenerationService.generateVideo({...});

const video = await videoGenerationService.waitForVideo(
  job.jobId,
  (status) => {
    console.log(`Progress: ${status.progress}%`);
  }
);
```

### Detailed Progress with UI Updates

```javascript
function updateProgressUI(status) {
  const progressBar = document.getElementById('progress-bar');
  const statusText = document.getElementById('status-text');
  
  progressBar.style.width = `${status.progress}%`;
  
  const messages = {
    'queued': 'Preparing video generation...',
    'script': 'Generating AI script...',
    'audio': 'Creating professional voiceover...',
    'captions': 'Adding accessibility captions...',
    'render': 'Rendering final video...',
    'upload': 'Uploading to cloud storage...',
    'complete': 'Video ready!'
  };
  
  statusText.textContent = messages[status.status] || status.status;
}

const video = await videoGenerationService.waitForVideo(
  job.jobId,
  updateProgressUI
);
```

## Error Handling

```javascript
try {
  const video = await videoGenerationService.generateVideo({...});
} catch (error) {
  if (error.message.includes('Rate limit')) {
    alert('Too many videos generated. Please wait a moment.');
  } else if (error.message.includes('API key')) {
    console.error('Backend API configuration issue');
  } else {
    alert('Video generation failed: ' + error.message);
  }
}
```

## Testing Locally

### 1. Start Backend

```bash
python auth_server.py
# Server running on http://localhost:5000
```

### 2. Open Upload Page

```bash
open upload.html
# Or: python -m http.server 8000
```

### 3. Create Test Ad

- Fill in product details
- Upload 2-3 images
- Click "Generate AI Video"
- Watch progress in real-time
- Download completed video

## Cost Monitoring

Each video costs approximately **$0.024**:

```javascript
Script:    $0.001  (GPT-4o Mini)
Audio:     $0.003  (OpenAI TTS)
Captions:  $0.003  (Whisper API)
Rendering: $0.005  (FFmpeg compute)
Storage:   $0.015  (Cloudflare R2)
─────────────────
Total:     $0.024  ✅ 95%+ cheaper than commercial APIs
```

To monitor your OpenAI usage:
1. Visit https://platform.openai.com/usage
2. Set up billing alerts
3. Track costs per day/month

## Production Checklist

Before deploying to production:

- [ ] OpenAI API key configured in backend only
- [ ] Rate limiting enabled (10 videos/hour per user)
- [ ] Cloudflare R2 bucket created and configured
- [ ] Error logging and monitoring set up
- [ ] Video storage cleanup job scheduled (delete after 30 days)
- [ ] Content moderation enabled for scripts
- [ ] HTTPS enabled for all API endpoints
- [ ] Session token authentication working

## Troubleshooting

### "Failed to generate script"

**Problem**: OpenAI API key not configured or invalid.

**Solution**: 
```bash
# Check backend .env file
echo $OPENAI_API_KEY  # Should show sk-proj-...

# Test API key directly
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### "Video generation timed out"

**Problem**: FFmpeg rendering taking longer than expected.

**Solution**:
- Check backend logs for rendering errors
- Reduce image count (max 5 images recommended)
- Reduce video duration (15s default is optimal)
- Ensure FFmpeg is installed: `ffmpeg -version`

### "Upload failed"

**Problem**: Cloudflare R2 credentials not configured.

**Solution**:
```bash
# Verify R2 credentials in .env
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vidx-videos
```

## Next Steps

- 📖 Read full integration guide: `OPENAI_VIDEO_PIPELINE.md`
- 💰 Review cost comparison: `VIDEO_PIPELINE_COMPARISON.md`
- 🚀 Deploy to production: `GO_LIVE_ROADMAP.md`
- 🛠️ Customize pipeline: `DEV_GUIDE.md`

## Example Videos

Generated with this pipeline:
- Automotive ad: 3 images + AI script → 15s video in 60s
- Electronics ad: 5 images + AI script → 20s video in 90s
- Fashion ad: 2 images + AI script → 12s video in 45s

All generated at **$0.024 per video** using OpenAI APIs.

## Support

If you encounter issues:
1. Check backend logs for detailed error messages
2. Verify all environment variables are set
3. Test OpenAI API key independently
4. Review `OPENAI_VIDEO_PIPELINE.md` for detailed architecture

Happy video generating! 🎥✨
