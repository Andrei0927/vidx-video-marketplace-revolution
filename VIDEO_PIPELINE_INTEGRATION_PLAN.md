# Video Pipeline Integration Plan

## Executive Summary

**Status**: ✅ Pipeline code exists, needs integration into upload flow

**Current State**:
- ✅ `video_pipeline.py` - Complete GPT + TTS + Whisper + FFmpeg pipeline
- ✅ `/api/video/generate-script` - Script generation endpoint (in app.py)
- ✅ `/api/video/generate` - Full video generation endpoint (in app.py)
- ✅ Upload UI (step1.html) - File picker working
- ❌ Frontend integration - Not connected to backend
- ❌ Progress tracking - No WebSocket/polling
- ❌ Error handling - Basic only
- ❌ Queue system - Synchronous only (blocks request)

**Goal**: Connect upload flow → video generation → publish listing

---

## Pipeline Architecture

### Current Flow (Works in Isolation)
```
video_pipeline.py standalone:
  Images + Description → GPT-4o Mini → OpenAI TTS → Whisper → FFmpeg → R2 → Video URL
  Cost: $0.007/video
  Time: 30-60 seconds
```

### Needed Flow (Upload Integration)
```
User Flow:
  Step 1: Upload images + select music
  Step 2: Add details (title, description, price, category)
  Step 3: Review → Trigger video generation → Progress UI → Complete

Backend Flow:
  1. Save uploaded images temporarily
  2. Call video_pipeline.generate_video_pipeline()
  3. Poll/stream progress updates
  4. Save video URL + metadata to database
  5. Publish listing
```

---

## Gap Analysis

### ✅ What We Have

**1. Complete Video Pipeline** (`video_pipeline.py`):
```python
generate_video_pipeline(
    images=[...],
    description="...",
    title="...",
    category="...",
    price=1000,
    voice='alloy'
) 
→ {video_url, script, duration, cost, thumbnail_url}
```

**2. API Endpoints** (`app.py`):
- `POST /api/video/generate-script` - Generate script only
- `POST /api/video/generate` - Full video generation

**3. Upload UI** (`templates/upload/step1.html`):
- File picker (images/videos)
- Music selection dropdown
- AI features info panel

**4. Dependencies Installed**:
- ✅ `openai==1.51.0`
- ✅ `boto3==1.34.51` (for R2)
- ⚠️ Missing: FFmpeg (system dependency)

### ❌ What's Missing

**1. FFmpeg Installation**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
apt-get install ffmpeg

# Azure App Service
# Need to add FFmpeg to deployment
```

**2. Environment Variables** (`.env`):
```bash
# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxx

# Cloudflare R2 Storage
R2_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=vidx-videos
```

**3. Frontend Service Integration**:
- No JavaScript to call `/api/video/generate`
- No progress tracking UI
- No error handling displays

**4. Asynchronous Processing**:
- Current: Synchronous (blocks for 30-60s)
- Needed: Background job queue (Celery/Redis or simple threading)

**5. Database Schema**:
- No `videos` table to store generated videos
- No `video_jobs` table for tracking progress

**6. Step 2/3 Upload Templates**:
- Need to capture: title, description, price, category
- Need to trigger video generation
- Need to show progress

---

## Implementation Plan

### Phase 1: Local Testing (1-2 hours)

**Goal**: Verify pipeline works end-to-end locally

**Steps**:

1. **Install FFmpeg**:
```bash
brew install ffmpeg
```

2. **Configure Environment Variables**:
```bash
# Add to .env
OPENAI_API_KEY=sk-proj-xxxxxx  # Get from https://platform.openai.com
R2_ACCOUNT_ID=xxxxxx
R2_ACCESS_KEY_ID=xxxxxx
R2_SECRET_ACCESS_KEY=xxxxxx
R2_BUCKET_NAME=vidx-videos-dev
```

3. **Test Pipeline Standalone**:
```bash
# Create test images directory
mkdir -p test_images

# Download sample images or use existing
cp path/to/image1.jpg test_images/
cp path/to/image2.jpg test_images/
cp path/to/image3.jpg test_images/

# Run pipeline test
python video_pipeline.py
```

Expected output:
```
=== Video Generation Pipeline ===
Product: 2020 Toyota Camry
Images: 3

[1/5] Generating script...
Script: Looking for a reliable family car?...

[2/5] Generating voiceover...
✓ Generated voiceover: /tmp/xyz.mp3

[3/5] Generating captions...
✓ Generated captions: 45 words

[4/5] Rendering video...
✓ Created video: /tmp/final.mp4

[5/5] Uploading to cloud storage...
✓ Uploaded to R2: https://pub-xxxxx.r2.dev/videos/20251111_abc123.mp4

✓ Pipeline complete!
Video URL: https://pub-xxxxx.r2.dev/videos/20251111_abc123.mp4
Total cost: $0.0070
```

4. **Test API Endpoint**:
```bash
# Start Flask server
./dev.sh

# Test script generation (new terminal)
curl -X POST http://localhost:8080/api/video/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "description": "Spacious family car with low mileage",
    "title": "2020 Toyota Camry",
    "category": "automotive",
    "price": 18500
  }'

# Expected response:
{
  "success": true,
  "script": "Looking for a reliable family car? Check out this stunning 2020 Toyota Camry...",
  "estimatedDuration": 15,
  "wordCount": 58,
  "cost": 0.001
}
```

**Validation Criteria**:
- ✅ Script generates in <5 seconds
- ✅ Voiceover generates in <10 seconds
- ✅ Captions extract word timestamps
- ✅ FFmpeg renders video successfully
- ✅ Video uploads to R2
- ✅ Total time: 30-60 seconds
- ✅ Total cost: ~$0.007

---

### Phase 2: Frontend Integration (2-3 hours)

**Goal**: Connect upload UI to video generation pipeline

**File Changes**:

**1. Update Step 1** (`templates/upload/step1.html`):
```javascript
// After file upload, save files temporarily
nextBtn.addEventListener('click', async () => {
    // Store uploaded files in sessionStorage as base64
    const fileData = await Promise.all(
        uploadedFiles.map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
                name: file.name,
                type: file.type,
                data: base64
            };
        })
    );
    
    sessionStorage.setItem('uploadedImages', JSON.stringify(fileData));
    sessionStorage.setItem('aiMusic', document.getElementById('ai-music').value);
    
    window.location.href = "/upload/details";
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
```

**2. Update Step 2** (`templates/upload/step2.html`):
Add form fields:
```html
<form id="details-form">
    <input type="text" id="title" placeholder="Product Title" required>
    <textarea id="description" placeholder="Description" required></textarea>
    <input type="number" id="price" placeholder="Price" required>
    <select id="category" required>
        <option value="automotive">Automotive</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <!-- ... -->
    </select>
    
    <button type="submit">Continue to Review</button>
</form>

<script>
document.getElementById('details-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Save to sessionStorage
    sessionStorage.setItem('adTitle', document.getElementById('title').value);
    sessionStorage.setItem('adDescription', document.getElementById('description').value);
    sessionStorage.setItem('adPrice', document.getElementById('price').value);
    sessionStorage.setItem('adCategory', document.getElementById('category').value);
    
    window.location.href = "/upload/review";
});
</script>
```

**3. Update Step 3** (`templates/upload/step3.html`):
Trigger video generation:
```html
<div id="review-container">
    <!-- Show preview of uploaded data -->
</div>

<div id="progress-container" class="hidden">
    <div class="progress-bar">
        <div id="progress-fill" style="width: 0%"></div>
    </div>
    <p id="progress-text">Initializing...</p>
</div>

<button id="publish-btn">Generate Video & Publish</button>

<script>
document.getElementById('publish-btn').addEventListener('click', async () => {
    try {
        // Show progress UI
        document.getElementById('progress-container').classList.remove('hidden');
        document.getElementById('publish-btn').disabled = true;
        
        // Retrieve data from sessionStorage
        const images = JSON.parse(sessionStorage.getItem('uploadedImages') || '[]');
        const title = sessionStorage.getItem('adTitle');
        const description = sessionStorage.getItem('adDescription');
        const price = sessionStorage.getItem('adPrice');
        const category = sessionStorage.getItem('adCategory');
        const music = sessionStorage.getItem('aiMusic');
        
        // Convert base64 back to Blobs
        const imageBlobs = images.map(img => {
            const byteString = atob(img.data.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: img.type });
        });
        
        // Create FormData
        const formData = new FormData();
        imageBlobs.forEach((blob, i) => {
            formData.append('images', blob, `image${i}.jpg`);
        });
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('voice', 'alloy');  // Default voice
        
        // Update progress
        updateProgress(10, 'Generating AI script...');
        
        // Call video generation API
        const response = await fetch('/api/video/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Video generation failed');
        }
        
        updateProgress(100, 'Video generated successfully!');
        
        const result = await response.json();
        
        // Save listing with video URL
        await saveAd({
            title,
            description,
            price,
            category,
            videoUrl: result.videoUrl,
            thumbnailUrl: result.thumbnailUrl,
            script: result.script
        });
        
        // Redirect to success page
        window.location.href = '/my-ads';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate video. Please try again.');
        document.getElementById('publish-btn').disabled = false;
    }
});

function updateProgress(percent, text) {
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-text').textContent = text;
}

async function saveAd(data) {
    // TODO: Implement /api/ads/create endpoint
    const response = await fetch('/api/ads/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
</script>
```

**4. Create Ad Creation Endpoint** (`app.py`):
```python
@app.route('/api/ads/create', methods=['POST'])
@require_auth
def api_create_ad():
    """Create new ad listing with generated video"""
    try:
        data = request.json
        user_id = session.get('user_id')
        
        # Save to database (using db.json for now)
        import json
        with open('db.json', 'r') as f:
            db = json.load(f)
        
        ad = {
            'id': len(db.get('ads', [])) + 1,
            'userId': user_id,
            'title': data['title'],
            'description': data['description'],
            'price': float(data['price']),
            'category': data['category'],
            'videoUrl': data['videoUrl'],
            'thumbnailUrl': data['thumbnailUrl'],
            'script': data.get('script', ''),
            'status': 'active',
            'createdAt': datetime.now().isoformat()
        }
        
        if 'ads' not in db:
            db['ads'] = []
        db['ads'].append(ad)
        
        with open('db.json', 'w') as f:
            json.dump(db, f, indent=2)
        
        return jsonify({
            'success': True,
            'adId': ad['id']
        })
    
    except Exception as e:
        print(f"Ad creation error: {e}")
        return jsonify({'error': str(e)}), 500
```

**Validation Criteria**:
- ✅ Step 1: File upload works
- ✅ Step 2: Details form saves to sessionStorage
- ✅ Step 3: Video generation triggered
- ✅ Progress bar updates (even if fake for now)
- ✅ Video URL returned and saved
- ✅ Ad created in db.json

---

### Phase 3: Async Processing (2-4 hours)

**Goal**: Move video generation to background to avoid request timeouts

**Problem**: Current implementation blocks for 30-60 seconds, which can cause:
- Browser timeout
- Poor UX (user staring at loading spinner)
- Server timeout (Azure default: 30s)

**Solution Options**:

**Option A: Simple Threading (Quick & Dirty)**
```python
import threading

@app.route('/api/video/generate', methods=['POST'])
@require_auth
def api_generate_video():
    # Generate job ID
    job_id = str(uuid.uuid4())
    
    # Save job to db.json with status='queued'
    jobs[job_id] = {'status': 'queued', 'progress': 0}
    
    # Start background thread
    thread = threading.Thread(
        target=generate_video_worker,
        args=(job_id, images, description, title, category, price)
    )
    thread.start()
    
    # Return job ID immediately
    return jsonify({
        'success': True,
        'jobId': job_id,
        'estimatedTime': 60
    })

def generate_video_worker(job_id, images, description, title, category, price):
    try:
        # Update progress
        jobs[job_id] = {'status': 'script', 'progress': 20}
        
        # Run pipeline
        result = generate_video_pipeline(...)
        
        # Update with result
        jobs[job_id] = {
            'status': 'complete',
            'progress': 100,
            'videoUrl': result['video_url'],
            'thumbnailUrl': result['thumbnail_url']
        }
    except Exception as e:
        jobs[job_id] = {'status': 'error', 'progress': 0, 'error': str(e)}

@app.route('/api/video/status/<job_id>', methods=['GET'])
def api_video_status(job_id):
    """Poll for job status"""
    return jsonify(jobs.get(job_id, {'status': 'not_found'}))
```

**Option B: Celery + Redis (Production-Ready)**
```python
# Requires: pip install celery redis
from celery import Celery

celery = Celery('tasks', broker='redis://localhost:6379')

@celery.task(bind=True)
def generate_video_task(self, images, description, title, category, price):
    # Update progress using self.update_state()
    self.update_state(state='PROGRESS', meta={'progress': 20})
    
    result = generate_video_pipeline(...)
    
    return result

@app.route('/api/video/generate', methods=['POST'])
@require_auth
def api_generate_video():
    task = generate_video_task.delay(images, description, title, category, price)
    return jsonify({'jobId': task.id})

@app.route('/api/video/status/<job_id>', methods=['GET'])
def api_video_status(job_id):
    task = generate_video_task.AsyncResult(job_id)
    return jsonify({
        'status': task.state,
        'progress': task.info.get('progress', 0) if task.info else 0,
        'result': task.result if task.state == 'SUCCESS' else None
    })
```

**Recommendation**: Start with **Option A (Threading)** for MVP, migrate to **Option B (Celery)** for production.

**Frontend Polling**:
```javascript
async function pollVideoStatus(jobId) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const response = await fetch(`/api/video/status/${jobId}`);
            const status = await response.json();
            
            // Update UI
            updateProgress(status.progress, getProgressMessage(status.status));
            
            if (status.status === 'complete') {
                clearInterval(interval);
                resolve(status);
            } else if (status.status === 'error') {
                clearInterval(interval);
                reject(new Error(status.error));
            }
        }, 2000);  // Poll every 2 seconds
    });
}

function getProgressMessage(status) {
    const messages = {
        'queued': 'Queued...',
        'script': 'Generating AI script...',
        'audio': 'Creating voiceover...',
        'captions': 'Adding captions...',
        'render': 'Rendering video...',
        'upload': 'Uploading to cloud...',
        'complete': 'Complete!'
    };
    return messages[status] || 'Processing...';
}

// Usage in Step 3
const response = await fetch('/api/video/generate', {
    method: 'POST',
    body: formData
});

const { jobId } = await response.json();
const result = await pollVideoStatus(jobId);

console.log('Video ready:', result.videoUrl);
```

**Validation Criteria**:
- ✅ API returns job ID immediately (<1s)
- ✅ Background processing completes in 30-60s
- ✅ Frontend polls every 2s for updates
- ✅ Progress bar shows realistic progress
- ✅ Errors handled gracefully

---

### Phase 4: Production Deployment (1-2 hours)

**Goal**: Deploy to Azure with all dependencies

**Challenges**:
1. FFmpeg not installed on Azure App Service by default
2. Need R2 credentials in production
3. OpenAI API key in production

**Solutions**:

**1. Install FFmpeg on Azure**:

**Option A: Use Custom Docker Container**
```dockerfile
# Dockerfile
FROM python:3.11-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy app
COPY . /app
WORKDIR /app

# Install Python deps
RUN pip install -r requirements.txt

# Run
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

**Option B: Use Buildpack** (Simpler)
```bash
# Add to .buildpacks file
https://github.com/heroku/heroku-buildpack-python
https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest
```

**2. Configure Environment Variables**:
```bash
# Azure Portal → App Service → Configuration → Application Settings
OPENAI_API_KEY=sk-proj-xxxxxx
R2_ACCOUNT_ID=xxxxxx
R2_ACCESS_KEY_ID=xxxxxx
R2_SECRET_ACCESS_KEY=xxxxxx
R2_BUCKET_NAME=vidx-videos-prod
```

**3. Test in Production**:
```bash
curl -X POST https://vidx-marketplace.azurewebsites.net/api/video/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Test product",
    "title": "Test",
    "category": "electronics",
    "price": 100
  }'
```

**Validation Criteria**:
- ✅ FFmpeg available: `ffmpeg -version`
- ✅ OpenAI API works
- ✅ R2 uploads work
- ✅ Video generation completes end-to-end
- ✅ No timeout errors (using async processing)

---

## Cost Analysis

### Per Video Cost Breakdown

| Component | Service | Cost |
|-----------|---------|------|
| Script Generation | OpenAI GPT-4o Mini | $0.001 |
| Voiceover | OpenAI TTS HD | $0.003 |
| Captions | OpenAI Whisper API | $0.003 |
| Video Rendering | Local FFmpeg | $0.000 |
| Cloud Storage | Cloudflare R2 | $0.015 |
| **TOTAL** | | **$0.022** |

### Monthly Estimates

| Volume | API Cost | Storage | Total |
|--------|----------|---------|-------|
| 10 videos | $0.07 | $0.15 | $0.22 |
| 100 videos | $0.70 | $1.50 | $2.20 |
| 1,000 videos | $7.00 | $15.00 | $22.00 |

**vs. Revid.ai**: $0.50-2.00/video = **95-99% savings**

---

## Testing Checklist

### Unit Tests (video_pipeline.py)
- [ ] `generate_script()` returns valid script
- [ ] `generate_voiceover()` creates MP3 file
- [ ] `generate_captions()` extracts word timestamps
- [ ] `create_video()` renders MP4 successfully
- [ ] `upload_to_r2()` returns public URL

### Integration Tests (API Endpoints)
- [ ] `/api/video/generate-script` authenticated only
- [ ] `/api/video/generate` handles file uploads
- [ ] `/api/video/status/<job_id>` returns progress
- [ ] `/api/ads/create` saves to database

### E2E Tests (Upload Flow)
- [ ] Step 1: Upload 3 images → Next
- [ ] Step 2: Fill details → Next
- [ ] Step 3: Generate video → Poll status → Success
- [ ] Verify ad appears in My Ads
- [ ] Verify video playable in browser

### Error Handling Tests
- [ ] Invalid image format (e.g., .gif)
- [ ] Missing description
- [ ] OpenAI API timeout
- [ ] FFmpeg error (corrupted image)
- [ ] R2 upload failure
- [ ] Network interruption during generation

---

## Monitoring & Debugging

### Key Metrics to Track
```python
# Add logging to video_pipeline.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_video_pipeline(...):
    start_time = time.time()
    
    logger.info(f"Starting pipeline for: {title}")
    
    # Track each step
    script_time = time.time()
    result = generate_script(...)
    logger.info(f"Script generated in {time.time() - script_time:.2f}s")
    
    # ... repeat for each step
    
    total_time = time.time() - start_time
    logger.info(f"Pipeline complete in {total_time:.2f}s, cost: ${cost:.4f}")
```

### Error Alerts
```python
# Send email/Slack on errors
def send_error_alert(error, context):
    # TODO: Integrate with SendGrid or Slack webhook
    logger.error(f"Pipeline error: {error}, context: {context}")
```

---

## Timeline Summary

| Phase | Task | Duration | Dependencies |
|-------|------|----------|--------------|
| 1 | Install FFmpeg + test pipeline | 1-2 hours | OpenAI API key, R2 credentials |
| 2 | Frontend integration (Steps 1-3) | 2-3 hours | Phase 1 complete |
| 3 | Async processing (threading) | 2-4 hours | Phase 2 complete |
| 4 | Production deployment | 1-2 hours | Azure account, env vars |
| **Total** | | **6-11 hours** | |

---

## Next Steps

1. **Immediate** (Do Now):
   - [ ] Get OpenAI API key (https://platform.openai.com)
   - [ ] Set up Cloudflare R2 bucket
   - [ ] Install FFmpeg locally: `brew install ffmpeg`
   - [ ] Configure `.env` file
   - [ ] Test `video_pipeline.py` standalone

2. **Today**:
   - [ ] Update upload Step 2 template (details form)
   - [ ] Update upload Step 3 template (generate button + progress)
   - [ ] Test full flow locally

3. **Tomorrow**:
   - [ ] Add async processing (threading)
   - [ ] Add polling endpoint
   - [ ] Test end-to-end with real data

4. **Production**:
   - [ ] Deploy FFmpeg to Azure
   - [ ] Configure production environment variables
   - [ ] Test in production
   - [ ] Monitor first 10 videos for errors

---

## Questions to Resolve

1. **R2 Setup**: Do you have Cloudflare R2 credentials, or should we set that up now?
2. **OpenAI Key**: Do you have an OpenAI API key with credits?
3. **Voice Preference**: Which OpenAI voice? (alloy, nova, shimmer are female; onyx, echo, fable are male)
4. **Video Length**: 15 seconds (current) or 30 seconds?
5. **Async vs Sync**: Should we implement threading now or wait until we hit timeout issues?

Let me know your answers and I'll proceed with the implementation!
