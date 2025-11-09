# VidX Video Generation API Architecture

## Overview
This document outlines the architecture for the video generation and upload flow using Revid.ai.

## Flow Diagram

```
User Upload → Frontend → Backend API → Revid.ai → Video URL → Database → Marketplace
```

## Components

### 1. Frontend (upload.html)
**Responsibilities:**
- File upload UI (drag & drop, browse)
- Image/video preview
- AI options configuration
- Temporary file storage (browser only)

**Output:**
- FormData with images/videos
- User preferences (style, music, voiceover)
- Item description (from step 2)

### 2. Backend API Endpoints

#### POST `/api/upload/create-video`
**Request:**
```json
{
  "files": [FormData with images/videos],
  "description": "VW Transporter in excellent condition...",
  "preferences": {
    "style": "Modern Slideshow",
    "music": "Upbeat",
    "voiceover": true,
    "captions": true
  },
  "itemDetails": {
    "category": "automotive",
    "make": "Volkswagen",
    "model": "Transporter",
    "price": 28500
  }
}
```

**Process:**
1. Receive files and metadata
2. Upload files to temporary storage (optional)
3. Call Revid.ai API with images + description
4. Wait for video generation (webhook or polling)
5. Receive video URL from Revid.ai
6. Create ad listing in database
7. Return ad ID and video URL

**Response:**
```json
{
  "success": true,
  "adId": "vw-transporter-abc123",
  "videoUrl": "https://revid.ai/videos/abc123.mp4",
  "status": "processing" | "completed"
}
```

#### GET `/api/upload/status/:jobId`
**Check video generation status**

```json
{
  "status": "processing" | "completed" | "failed",
  "progress": 75,
  "videoUrl": "https://revid.ai/videos/abc123.mp4"
}
```

### 3. Revid.ai Integration

#### API Endpoint
```
POST https://api.revid.ai/v1/videos/create
```

#### Request Structure
```json
{
  "images": [
    "base64_encoded_image_1",
    "base64_encoded_image_2"
  ],
  "script": "Generated from user description...",
  "voice": {
    "enabled": true,
    "language": "en-US",
    "gender": "neutral"
  },
  "captions": {
    "enabled": true,
    "style": "modern"
  },
  "music": {
    "type": "upbeat",
    "volume": 0.3
  },
  "style": "slideshow",
  "aspectRatio": "9:16"
}
```

#### Response
```json
{
  "jobId": "job_abc123",
  "status": "queued",
  "estimatedTime": 60
}
```

### 4. Database Schema (db.json)

#### Ads Collection
```json
{
  "ads": [
    {
      "id": "vw-transporter-abc123",
      "title": "VW Transporter T6.1 2021",
      "category": "automotive",
      "seller": {
        "id": 1,
        "name": "John Doe",
        "avatar": "https://...",
        "location": "Cluj-Napoca"
      },
      "videoUrl": "https://revid.ai/videos/abc123.mp4",
      "videoJobId": "job_abc123",
      "videoStatus": "completed",
      "price": 28500,
      "description": "...",
      "specs": {
        "make": "Volkswagen",
        "model": "Transporter",
        "year": 2021,
        "mileage": "45,000 km"
      },
      "likes": 0,
      "comments": 0,
      "createdAt": "2025-11-07T10:30:00Z",
      "status": "published" | "draft" | "processing"
    }
  ]
}
```

## Implementation Steps

### Phase 1: Local Development (No Revid.ai)
1. ✅ Build upload.html with dark mode theming
2. Create mock video generation endpoint
3. Store uploaded files locally
4. Generate placeholder video URLs
5. Test full upload → publish flow

### Phase 2: Revid.ai Integration
1. Sign up for Revid.ai API key
2. Implement image upload to Revid.ai
3. Implement script generation from description
4. Handle webhook/polling for video completion
5. Store final video URL in database

### Phase 3: Production
1. Add proper file validation
2. Implement file size limits
3. Add error handling and retries
4. Set up video processing queue
5. Add user notifications for completion

## Revid.ai API Details

### Authentication
```bash
Authorization: Bearer YOUR_API_KEY
```

### Alternative Services (If Revid.ai doesn't fit)
- **Synthesia** - AI video with avatars
- **D-ID** - Image to talking video
- **Pictory.ai** - Text to video
- **Runway ML** - Advanced AI video tools
- **InVideo AI** - Automated video creation

## File Storage Strategy

**Recommendation: No permanent storage of uploaded files**

1. User uploads images → Stored in browser memory (Base64)
2. Send to backend → Convert to format for Revid.ai
3. Upload to Revid.ai → Delete from backend
4. Revid.ai returns video URL → Store URL only
5. Display video from Revid.ai CDN

**Benefits:**
- No storage costs
- No file management complexity
- Fast uploads
- Scalable

## Security Considerations

1. **File Validation:**
   - Max file size: 10MB per file
   - Allowed types: image/*, video/*
   - Max files: 10 per upload

2. **API Rate Limiting:**
   - 10 uploads per hour per user
   - Queue system for high load

3. **Authentication:**
   - Require login to upload
   - Associate ads with user ID

## Next Steps

1. Test upload.html locally
2. Create mock backend endpoint (server.py)
3. Implement video generation simulation
4. Build step 2: Item details form
5. Build step 3: Review & publish
6. Integrate with Revid.ai API
