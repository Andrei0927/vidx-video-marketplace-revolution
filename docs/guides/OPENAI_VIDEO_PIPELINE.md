# OpenAI Video Generation Pipeline

## Overview

VidX uses a custom video generation pipeline powered by OpenAI APIs. This approach provides:
- **95%+ cost savings** compared to commercial video APIs ($0.024 vs $0.50-2.00 per video)
- **Full control** over quality, branding, and features
- **No vendor lock-in** - own the entire pipeline
- **Transparent pricing** - predictable per-video costs

## Architecture

```
User Upload → Script Generation → Audio Generation → Caption Generation → Video Rendering → Cloud Storage
              (GPT-4o Mini)       (OpenAI TTS HD)    (Whisper API)       (FFmpeg)          (Cloudflare R2)
              ~$0.001/video       ~$0.003/video      ~$0.003/video       ~$0.005/video     ~$0.015/GB
```

### Component Breakdown

#### 1. Script Generation (GPT-4o Mini)
- **Purpose**: Convert product descriptions into engaging video scripts
- **API**: OpenAI Chat Completions API
- **Model**: `gpt-4o-mini` (latest)
- **Cost**: ~$0.001 per video (150 input tokens + 100 output tokens)
- **Average Latency**: 1-2 seconds

**Request Format:**
```javascript
POST /api/video/generate-script
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "description": "Spacious family car with low mileage",
  "title": "2020 Toyota Camry",
  "category": "automotive",
  "price": 18500,
  "details": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "mileage": 35000
  }
}
```

**Response:**
```javascript
{
  "script": "Looking for a reliable family car? Check out this stunning 2020 Toyota Camry...",
  "estimatedDuration": 15
}
```

#### 2. Text-to-Speech (OpenAI TTS HD)
- **Purpose**: Generate professional voiceover audio
- **API**: OpenAI Audio API
- **Model**: `tts-1-hd` (high quality)
- **Voice**: `alloy` (default), `echo`, `fable`, `onyx`, `nova`, `shimmer`
- **Cost**: $0.030 per 1000 characters (~$0.003 per 100-char video)
- **Average Latency**: 3-5 seconds

**Request Format:**
```javascript
POST /api/video/generate-audio
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "script": "Looking for a reliable family car?...",
  "voice": "alloy",
  "speed": 1.0
}
```

**Response:**
```javascript
{
  "audioUrl": "https://r2.example.com/audio/xyz.mp3",
  "duration": 14.5
}
```

#### 3. Caption Generation (Whisper API)
- **Purpose**: Generate accurate captions for accessibility
- **API**: OpenAI Whisper API
- **Model**: `whisper-1`
- **Cost**: $0.006 per minute (~$0.003 per 15-second video)
- **Average Latency**: 2-4 seconds

**Request Format:**
```javascript
POST /api/video/generate-captions
Content-Type: multipart/form-data
Authorization: Bearer {session_token}

{
  "file": audio.mp3,
  "language": "en",
  "format": "srt"
}
```

**Response:**
```javascript
{
  "captions": "1\n00:00:00,000 --> 00:00:03,500\nLooking for a reliable family car?\n\n2\n...",
  "format": "srt"
}
```

#### 4. Video Rendering (FFmpeg)
- **Purpose**: Combine images, audio, and captions into final video
- **Technology**: FFmpeg on serverless compute (AWS Lambda / Cloudflare Workers)
- **Resolution**: 1080x1920 (portrait 9:16 for mobile)
- **Format**: MP4 (H.264 video, AAC audio)
- **Cost**: $0.002-0.007 per video (compute time)
- **Average Latency**: 30-60 seconds

**FFmpeg Command Example:**
```bash
ffmpeg -loop 1 -i image1.jpg -i audio.mp3 -vf "subtitles=captions.srt" \
  -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p \
  -t 15 -s 1080x1920 -r 30 output.mp4
```

#### 5. Cloud Storage (Cloudflare R2)
- **Purpose**: Store generated videos with zero egress fees
- **Cost**: $0.015 per GB stored, $0 egress
- **Average**: ~$0.015 per video (10MB video × $0.015/GB)
- **CDN**: Cloudflare global network (instant delivery)

## Backend Implementation

### Required Environment Variables

```bash
# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Cloudflare R2 Storage
R2_ACCOUNT_ID=xxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxx
R2_BUCKET_NAME=vidx-videos

# Optional: Redis for job queue
REDIS_URL=redis://localhost:6379
```

### API Endpoints

All video generation endpoints are proxied through the backend to keep API keys secure.

#### POST /api/video/generate-script
Generate AI script from product description.

#### POST /api/video/upload-url
Get presigned URL for uploading user images.

#### POST /api/video/generate
Start video generation job (async).

Returns:
```javascript
{
  "jobId": "job_abc123",
  "estimatedTime": 90  // seconds
}
```

#### GET /api/video/status/:jobId
Check generation status.

Returns:
```javascript
{
  "status": "render",  // queued|script|audio|captions|render|upload|complete|error
  "progress": 75,      // 0-100
  "elapsed": 45,       // seconds
  "videoUrl": null,    // populated when complete
  "error": null
}
```

#### POST /api/video/cancel/:jobId
Cancel a running job.

### Job Queue Flow

```
1. User submits → Job created (status: queued)
2. Worker picks up → Generate script (status: script, progress: 20%)
3. Worker continues → Generate audio (status: audio, progress: 40%)
4. Worker continues → Generate captions (status: captions, progress: 60%)
5. Worker continues → Render video (status: render, progress: 80%)
6. Worker continues → Upload to R2 (status: upload, progress: 95%)
7. Complete → Return video URL (status: complete, progress: 100%)
```

## Frontend Integration

### Basic Usage

```javascript
import videoGenerationService from './js/video-generation-service.js';

// 1. Generate script
const script = await videoGenerationService.generateScript({
  description: 'Product description...',
  title: 'Product Title',
  category: 'automotive',
  price: 15000
});

// 2. Start video generation
const job = await videoGenerationService.generateVideo({
  script: script.script,
  files: [image1, image2, image3],
  music: 'upbeat',
  voice: 'alloy'
});

// 3. Poll for completion
const result = await videoGenerationService.waitForVideo(
  job.jobId,
  (status) => {
    console.log(`${status.status}: ${status.progress}%`);
  }
);

console.log('Video ready:', result.videoUrl);
```

### Progress Tracking

The service provides detailed progress updates:

```javascript
const job = await videoGenerationService.generateVideo({...});

videoGenerationService.waitForVideo(
  job.jobId,
  (status) => {
    // Update UI based on status
    switch(status.status) {
      case 'script':
        updateProgress('Generating AI script...', 20);
        break;
      case 'audio':
        updateProgress('Creating voiceover...', 40);
        break;
      case 'captions':
        updateProgress('Adding captions...', 60);
        break;
      case 'render':
        updateProgress('Rendering video...', 80);
        break;
      case 'upload':
        updateProgress('Uploading to cloud...', 95);
        break;
    }
  }
);
```

## Cost Breakdown

### Per Video Cost

| Component | Cost per Video | Notes |
|-----------|---------------|-------|
| Script Generation (GPT-4o Mini) | $0.001 | ~250 tokens total |
| Text-to-Speech (TTS HD) | $0.003 | ~100 characters |
| Captions (Whisper) | $0.003 | ~15 seconds audio |
| Video Rendering (FFmpeg) | $0.005 | ~45 seconds compute |
| Storage (R2) | $0.015 | 10MB video |
| **Total** | **$0.024** | **95%+ savings vs commercial APIs** |

### Monthly Estimates (500 videos)

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| OpenAI API | $3.50 | Script + TTS + Captions |
| Serverless Compute | $2.50 | FFmpeg rendering |
| Cloudflare R2 | $7.50 | 500 × 10MB storage |
| **Total** | **$13.50** | vs $250-1000 with commercial APIs |

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Script Generation | 1-2s | GPT-4o Mini response |
| Audio Generation | 3-5s | OpenAI TTS HD |
| Caption Generation | 2-4s | Whisper API |
| Video Rendering | 30-60s | FFmpeg on serverless |
| Total Time | 40-90s | End-to-end |

## Error Handling

### Common Errors

**OpenAI API Errors:**
```javascript
{
  "error": {
    "type": "invalid_request_error",
    "message": "Incorrect API key provided",
    "code": "invalid_api_key"
  }
}
```

**Rate Limiting:**
```javascript
{
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded. Try again in 60s"
  }
}
```

**Rendering Errors:**
```javascript
{
  "error": {
    "type": "render_error",
    "message": "FFmpeg process failed: Invalid image format"
  }
}
```

### Retry Strategy

- **Script/Audio/Caption errors**: Retry up to 3 times with exponential backoff
- **Rendering errors**: Log and alert (manual investigation needed)
- **Rate limits**: Queue job and retry after cooldown period

## Security

### API Key Protection

✅ **NEVER expose OpenAI API keys in frontend code**
✅ All OpenAI calls proxied through backend
✅ Session token authentication for all /api/video/* endpoints
✅ Rate limiting per user (10 videos/hour, 100 videos/day)

### Content Moderation

All generated scripts are filtered through OpenAI's moderation API before TTS generation:

```javascript
const moderation = await openai.moderations.create({
  input: script
});

if (moderation.results[0].flagged) {
  throw new Error('Script contains inappropriate content');
}
```

## Development Setup

### 1. Install Dependencies

```bash
# Python backend
pip install openai boto3 redis

# FFmpeg (required for video rendering)
brew install ffmpeg  # macOS
```

### 2. Configure Environment

Create `.env` file:
```bash
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
R2_ACCOUNT_ID=YOUR_R2_ACCOUNT_ID
R2_ACCESS_KEY_ID=YOUR_R2_ACCESS_KEY
R2_SECRET_ACCESS_KEY=YOUR_R2_SECRET_KEY
R2_BUCKET_NAME=vidx-videos-dev
```

### 3. Test Locally

```bash
# Run backend server
python auth_server.py

# Test script generation
curl -X POST http://localhost:5000/api/video/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"description":"Test product","title":"Test"}'
```

## Production Deployment

### Recommended Stack

- **Backend**: AWS Lambda / Cloudflare Workers
- **Queue**: Redis or AWS SQS
- **Rendering**: Lambda with FFmpeg layer OR dedicated EC2 instances
- **Storage**: Cloudflare R2 (zero egress fees)
- **Monitoring**: CloudWatch / Datadog

### Scaling Considerations

| Videos/Day | Architecture | Monthly Cost |
|-----------|-------------|--------------|
| 0-1000 | Single Lambda + Redis | $20-30 |
| 1000-10,000 | Lambda + SQS + R2 | $50-100 |
| 10,000+ | Dedicated EC2 + SQS | $150-300 |

## Comparison vs Commercial APIs

| Feature | VidX Custom Pipeline | Revid.ai | Synthesia |
|---------|---------------------|----------|-----------|
| Cost per video | $0.024 | $0.50-2.00 | $1.00-5.00 |
| Generation time | 40-90s | 60-120s | 90-180s |
| Customization | Full control | Limited | Moderate |
| API keys | Backend only | Frontend exposed | Backend only |
| Vendor lock-in | None | High | High |
| Quality | High (OpenAI TTS HD) | Medium-High | High |

## Next Steps

1. ✅ Review this integration guide
2. ✅ Obtain OpenAI API key ($5 free credit for testing)
3. ✅ Set up Cloudflare R2 bucket (free tier: 10GB storage)
4. ✅ Configure backend environment variables
5. ✅ Test script generation locally
6. ✅ Test full video pipeline
7. ✅ Deploy to production

## Support & Resources

- **OpenAI Documentation**: https://platform.openai.com/docs
- **FFmpeg Documentation**: https://ffmpeg.org/documentation.html
- **Cloudflare R2 Guide**: https://developers.cloudflare.com/r2/
- **VidX Dev Guide**: See `DEV_GUIDE.md`
- **Cost Comparison**: See `VIDEO_PIPELINE_COMPARISON.md`
