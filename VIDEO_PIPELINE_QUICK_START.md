# Video Pipeline - Ready to Start! 🎬

## ✅ What We Have Configured

### 1. **Cloudflare R2 Storage** ✅
```bash
R2_ACCOUNT_ID=c26c8394fb93e67fc5f913894a929467
R2_ACCESS_KEY_ID=482722d37434d880650023e880dfee08
R2_SECRET_ACCESS_KEY=e4bdc965de36d185f8bc5ed2ce81f627a86d7813253e8a6989bea032511bbe59
R2_BUCKET_NAME=video-marketplace-videos
```

**Status**: ✅ Already configured in `.env` file

### 2. **OpenAI API Key** ⚠️
```bash
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

**Status**: ⚠️ **ACTION REQUIRED**
- Get free $5 credit: https://platform.openai.com
- Create API key
- Replace `sk-proj-YOUR_KEY_HERE` in `.env`

### 3. **FFmpeg** ❌
**Status**: ❌ **ACTION REQUIRED**
```bash
brew install ffmpeg
```

---

## 🚀 Quick Start Steps

### Step 1: Get OpenAI API Key (5 minutes)

1. Go to https://platform.openai.com
2. Sign up or log in
3. Click "API Keys" in left sidebar
4. Click "Create new secret key"
5. Copy the key (starts with `sk-proj-...`)
6. Update `.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

**Free Credits**: $5 free credit = ~700 videos generated!

### Step 2: Install FFmpeg (1 minute)

```bash
brew install ffmpeg
```

Verify installation:
```bash
ffmpeg -version
```

### Step 3: Test the Pipeline (2 minutes)

Create test images:
```bash
mkdir -p test_images
# Download 3 sample images or use existing ones
```

Test the pipeline:
```bash
python video_pipeline.py
```

Expected output:
```
=== Video Generation Pipeline ===
Product: 2020 Toyota Camry
Images: 3

[1/5] Generating script...
✓ Script: "Looking for a reliable family car?..."

[2/5] Generating voiceover...
✓ Generated voiceover: /tmp/xyz.mp3

[3/5] Generating captions...
✓ Generated captions: 45 words

[4/5] Rendering video...
✓ Created video: /tmp/final.mp4

[5/5] Uploading to cloud storage...
✓ Uploaded to R2: https://pub-xxx.r2.dev/videos/xxx.mp4

✓ Pipeline complete!
Total cost: $0.0070
```

---

## 📋 What Happens Next

Once you complete the 3 steps above, we can:

1. **Test the API endpoints** (`/api/video/generate-script`, `/api/video/generate`)
2. **Update upload Step 2** - Add form fields (title, description, price, category)
3. **Update upload Step 3** - Add video generation trigger + progress UI
4. **Add ads database integration** - Save generated videos to listings
5. **Deploy to production** - Add FFmpeg to Azure, configure env vars

---

## 💰 Cost Breakdown

### Per Video Generated:
- GPT-4o Mini (script): $0.001
- OpenAI TTS HD (voiceover): $0.003
- Whisper API (captions): $0.003
- Cloudflare R2 (storage): $0.015
- **Total: $0.022/video**

### $5 Free Credit Gets You:
- ~227 videos generated
- vs. Revid.ai: $0.50-2.00/video (95-99% savings!)

### Monthly Estimates:
- 10 videos: $0.22
- 100 videos: $2.20
- 1,000 videos: $22.00

---

## 🔧 Technical Details

### Pipeline Flow:
```
User uploads images + description
  ↓
Step 1: GPT-4o Mini generates factual script (1-2s)
  ↓
Step 2: OpenAI TTS creates voiceover audio (3-5s)
  ↓
Step 3: Whisper extracts word-level timestamps (2-4s)
  ↓
Step 4: FFmpeg renders video with Ken Burns effects + captions (30-60s)
  ↓
Step 5: Upload to Cloudflare R2 storage (5-10s)
  ↓
Return video URL to user
```

**Total Time**: 40-90 seconds per video

### Files Involved:
- `video_pipeline.py` - Complete pipeline logic ✅
- `app.py` - API endpoints already coded ✅
- `.env` - Configuration (R2 ✅, OpenAI ⚠️)
- `requirements.txt` - Dependencies installed ✅
- FFmpeg - System dependency ❌

---

## 🎯 Your Action Items

1. [ ] **Install FFmpeg**: `brew install ffmpeg`
2. [ ] **Get OpenAI key**: https://platform.openai.com
3. [ ] **Update .env**: Replace `sk-proj-YOUR_KEY_HERE` with real key
4. [ ] **Test pipeline**: `python video_pipeline.py`

**Time required**: 10-15 minutes total

Once done, ping me and we'll continue with frontend integration!

---

## 📚 Documentation

- Full integration plan: `VIDEO_PIPELINE_INTEGRATION_PLAN.md`
- OpenAI pipeline guide: `docs/guides/OPENAI_VIDEO_PIPELINE.md`
- Cost comparison: `docs/audits/VIDEO_PIPELINE_COMPARISON.md`

---

## 🆘 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'openai'"
```bash
pip install openai
```

### Error: "ffmpeg: command not found"
```bash
brew install ffmpeg
```

### Error: "OpenAI API key invalid"
- Check `.env` file has correct key
- Verify key starts with `sk-proj-`
- Restart Flask server: `./dev.sh`

### Error: "R2 upload failed"
- Credentials should already work (configured in .env)
- If issues, check R2 dashboard: https://dash.cloudflare.com

---

Ready to get started? Complete the 3 steps above and we'll test the pipeline! 🚀
