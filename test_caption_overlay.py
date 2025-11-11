#!/usr/bin/env python3
"""
Test caption overlay on existing video
Uses existing video, generates captions with Whisper, and overlays them with FFmpeg
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from video_pipeline import generate_captions, upload_to_r2
import subprocess
import tempfile

# Load environment variables
load_dotenv()

# Test configuration
OUTPUT_DIR = Path('test_outputs')
OUTPUT_DIR.mkdir(exist_ok=True)


def extract_audio_from_video(video_path, audio_output):
    """Extract audio from video file for Whisper transcription"""
    print(f"🎵 Extracting audio from video...")
    
    cmd = [
        'ffmpeg',
        '-i', str(video_path),
        '-vn',  # No video
        '-acodec', 'libmp3lame',
        '-ar', '44100',  # Sample rate
        '-ac', '2',  # Stereo
        '-b:a', '192k',
        '-y',  # Overwrite
        str(audio_output)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        raise Exception(f"Audio extraction failed: {result.stderr}")
    
    print(f"✅ Audio extracted to: {audio_output.name}")
    return audio_output


def overlay_captions_on_video(video_path, captions, output_path):
    """Overlay captions on existing video using FFmpeg"""
    print(f"\n🎬 Overlaying captions on video...")
    
    # Create SRT file from captions
    srt_file = OUTPUT_DIR / 'captions.srt'
    
    if 'words' in captions and captions['words']:
        # Generate SRT from word-level timestamps
        words = captions['words']
        
        srt_content = []
        segment_index = 1
        words_per_segment = 5  # Show 5 words at a time
        
        for i in range(0, len(words), words_per_segment):
            segment_words = words[i:i + words_per_segment]
            
            # Get start time from first word, end time from last word
            start_time = segment_words[0]['start']
            end_time = segment_words[-1]['end']
            
            # Format times as SRT timestamps (HH:MM:SS,mmm)
            start_str = format_srt_time(start_time)
            end_str = format_srt_time(end_time)
            
            # Join words into text
            text = ' '.join(word['word'] for word in segment_words)
            
            # Add SRT entry
            srt_content.append(f"{segment_index}")
            srt_content.append(f"{start_str} --> {end_str}")
            srt_content.append(text)
            srt_content.append("")  # Blank line between entries
            
            segment_index += 1
        
        with open(srt_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(srt_content))
        
        print(f"✅ Created SRT file with {segment_index - 1} caption segments")
    else:
        print("⚠️  No word-level timestamps available")
        return None
    
    # Apply subtitles using FFmpeg
    print(f"🎨 Applying captions with FFmpeg...")
    
    # FFmpeg subtitle filter with styling
    subtitle_style = "FontName=Helvetica,FontSize=32,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BackColour=&H80000000,Outline=2,Shadow=1,MarginV=100,Alignment=2"
    
    cmd = [
        'ffmpeg',
        '-i', str(video_path),
        '-vf', f"subtitles={srt_file}:force_style='{subtitle_style}'",
        '-c:a', 'copy',  # Copy audio without re-encoding
        '-y',  # Overwrite
        str(output_path)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"⚠️  FFmpeg failed: {result.stderr}")
        return None
    
    print(f"✅ Video with captions created: {output_path}")
    return output_path


def format_srt_time(seconds):
    """Format seconds as SRT timestamp (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def test_caption_overlay():
    """Test caption overlay on existing video"""
    print("\n" + "="*60)
    print("🎬 CAPTION OVERLAY TEST")
    print("   Using existing video + Whisper captions")
    print("="*60 + "\n")
    
    # Test listing data (Renault Wind)
    test_listing = {
        'title': 'Renault Wind Roadster 2011',
        'category': 'automotive',
        'price': 6500,
        'description': 'Roadster compact 2011, motor 1.2 benzină 100 CP',
        'details': {
            'year': 2011,
            'mileage': 145000,
            'fuel_type': 'Benzină',
            'condition': 'Foarte bună',
            'location': 'București, România'
        }
    }
    
    print("📋 Test Listing:")
    print(f"   Title: {test_listing['title']}")
    print(f"   Category: {test_listing['category']}")
    print(f"   Price: €{test_listing['price']}")
    print(f"   Location: {test_listing['details']['location']}\n")
    
    # Check for existing test video
    existing_video = OUTPUT_DIR / 'pipeline_complete_video.mp4'
    
    if not existing_video.exists():
        print(f"❌ No existing video found at: {existing_video}")
        print(f"   Please run test_full_pipeline.py first to generate a test video\n")
        return False
    
    print(f"✅ Using existing video: {existing_video.name}")
    video_size_mb = existing_video.stat().st_size / (1024 * 1024)
    print(f"   Size: {video_size_mb:.2f} MB\n")
    
    try:
        # ===== STEP 1: Extract Audio =====
        print("="*60)
        print("📍 STEP 1: Extract Audio from Video")
        print("="*60 + "\n")
        
        audio_temp = OUTPUT_DIR / 'extracted_audio.mp3'
        extract_audio_from_video(existing_video, audio_temp)
        
        audio_size_kb = audio_temp.stat().st_size / 1024
        print(f"   Size: {audio_size_kb:.1f} KB\n")
        
        # ===== STEP 2: Generate Captions with Whisper =====
        print("="*60)
        print("📍 STEP 2: Generate Captions with Whisper")
        print("="*60 + "\n")
        
        print("🎤 Transcribing audio with Whisper...")
        print(f"   Model: whisper-1")
        print(f"   Language: Romanian")
        print(f"   Response format: verbose_json (word timestamps)\n")
        
        captions = generate_captions(str(audio_temp))
        
        num_words = len(captions.get('words', []))
        print(f"\n✅ Captions generated!")
        print(f"   Total words: {num_words}")
        print(f"   Text: {captions['text'][:100]}...\n")
        
        # Save captions
        captions_file = OUTPUT_DIR / 'overlay_captions.json'
        with open(captions_file, 'w', encoding='utf-8') as f:
            json.dump(captions, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Captions saved to: {captions_file}")
        
        # Calculate Whisper cost
        audio_duration_min = audio_size_kb / 1024 / 2  # Rough estimate
        whisper_cost = 0.006 * audio_duration_min
        print(f"💰 Whisper cost: ${whisper_cost:.6f}\n")
        
        # ===== STEP 3: Overlay Captions on Video =====
        print("="*60)
        print("📍 STEP 3: Overlay Captions with FFmpeg")
        print("="*60 + "\n")
        
        output_video = OUTPUT_DIR / 'video_with_captions.mp4'
        
        result_path = overlay_captions_on_video(
            video_path=existing_video,
            captions=captions,
            output_path=output_video
        )
        
        if result_path:
            final_size_mb = Path(result_path).stat().st_size / (1024 * 1024)
            print(f"   Final size: {final_size_mb:.2f} MB\n")
            
            # ===== STEP 4: Upload to R2 (Optional) =====
            print("="*60)
            print("📍 STEP 4: Upload to Cloudflare R2")
            print("="*60 + "\n")
            
            print("☁️  Uploading video to R2...")
            
            import hashlib
            import time
            video_hash = hashlib.md5(open(result_path, 'rb').read()).hexdigest()[:8]
            object_key = f"test-videos/{test_listing['category']}/{video_hash}_{int(time.time())}.mp4"
            
            try:
                video_url = upload_to_r2(
                    file_path=str(result_path),
                    object_key=object_key
                )
                
                print(f"✅ Video uploaded!")
                print(f"   🔑 Key: {object_key}")
                print(f"   🌐 URL: {video_url}\n")
                
                r2_cost = final_size_mb * 0.015
                print(f"💰 R2 cost: ${r2_cost:.6f}\n")
                
                # Create full ad listing data
                ad_listing = {
                    'id': video_hash,
                    'title': test_listing['title'],
                    'category': test_listing['category'],
                    'description': test_listing['description'],
                    'price': test_listing['price'],
                    'condition': test_listing['details']['condition'],
                    'location': test_listing['details']['location'],
                    'video_url': video_url,
                    'thumbnail_url': video_url,
                    'created_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'views': 0,
                    'likes': 0,
                    'favorites': 0,
                    'metadata': {
                        'duration': captions.get('duration', 0),
                        'word_count': num_words,
                        'has_captions': True,
                        'cost': whisper_cost + r2_cost
                    }
                }
                
                # Save ad listing
                listing_file = OUTPUT_DIR / 'test_ad_listing.json'
                with open(listing_file, 'w', encoding='utf-8') as f:
                    json.dump(ad_listing, f, ensure_ascii=False, indent=2)
                
                print(f"💾 Ad listing saved to: {listing_file}\n")
                
            except Exception as e:
                print(f"⚠️  R2 upload failed: {e}")
                print(f"   (Continuing without upload)\n")
            
            # ===== SUMMARY =====
            print("="*60)
            print("✅ CAPTION OVERLAY COMPLETE!")
            print("="*60 + "\n")
            
            total_cost = whisper_cost
            print(f"💰 Total Cost: ${total_cost:.6f} (~{total_cost * 100:.2f} cents)")
            print(f"   (Reusing existing video - no GPT/TTS costs!)\n")
            
            print("📊 Files Created:")
            print(f"   • Audio: {audio_temp.name}")
            print(f"   • Captions: {captions_file.name}")
            print(f"   • Video: {output_video.name}")
            
            if 'video_url' in locals():
                print(f"\n🌐 Video URL: {video_url}")
            
            print("\n🎬 Opening final video...")
            try:
                subprocess.run(['open', str(result_path)], check=True)
                print("✓ Video opened in default player\n")
            except:
                print(f"   Manually open: {result_path}\n")
            
            return True
        else:
            print("❌ Caption overlay failed")
            return False
            
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run caption overlay test"""
    print("\n" + "="*60)
    print("🎬 VIDX CAPTION OVERLAY TEST")
    print("   Reuse existing video → Add Whisper captions")
    print("="*60)
    
    success = test_caption_overlay()
    
    if success:
        print("\n✅ Caption overlay successful!")
        print("   Now you can reuse existing videos without regenerating!")
    else:
        print("\n❌ Caption overlay failed. Check errors above.")
    
    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
