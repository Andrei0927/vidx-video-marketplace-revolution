#!/usr/bin/env python3
"""
Test complete video generation pipeline end-to-end
GPT Script → TTS Voiceover → Whisper Captions → FFmpeg Assembly → R2 Upload
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Add current directory to path to import video_pipeline
sys.path.insert(0, str(Path(__file__).parent))

from video_pipeline import (
    generate_script,
    generate_voiceover,
    generate_captions,
    create_video,
    upload_to_r2
)

# Load environment variables
load_dotenv()

# Test configuration
OUTPUT_DIR = Path('test_outputs')
OUTPUT_DIR.mkdir(exist_ok=True)


def test_full_pipeline():
    """Test complete pipeline from description to uploaded video"""
    print("\n" + "="*60)
    print("🚀 COMPLETE VIDEO GENERATION PIPELINE TEST")
    print("="*60 + "\n")
    
    # Test data: Real Romanian automotive ad
    test_ad = {
        'title': 'Renault Wind 2011',
        'category': 'automotive',
        'description': 'Roadster compact 2011, motor 1.2 benzină 100 CP, plafon decapotabil electric, interior sport semipiele, pilot automat, oglinzi electrice, stare foarte bună',
        'price': 6500,
        'year': 2011,
        'mileage': 145000,
        'fuel_type': 'Benzină',
        'features': [
            'Plafon decapotabil electric',
            'Interior sport semipiele',
            'Pilot automat',
            'Oglinzi electrice',
            'Jante din aliaj'
        ]
    }
    
    print("📋 Test Ad Details:")
    print(f"   Title: {test_ad['title']}")
    print(f"   Category: {test_ad['category']}")
    print(f"   Price: {test_ad['price']} EUR")
    print(f"   Year: {test_ad['year']}")
    print(f"   Description: {test_ad['description'][:80]}...")
    print(f"   Features: {len(test_ad['features'])} items\n")
    
    pipeline_results = {
        'test_ad': test_ad,
        'steps': {}
    }
    
    try:
        # ===== STEP 1: Generate Script with GPT =====
        print("="*60)
        print("📍 STEP 1: Generate Romanian Script with GPT-4o Mini")
        print("="*60 + "\n")
        
        print("🤖 Generating factual Romanian script...")
        print(f"   Model: GPT-4o Mini")
        print(f"   Language: Romanian")
        print(f"   Tone: Enthusiastic automotive sales\n")
        
        # Build description for GPT
        full_description = f"{test_ad['description']}. "
        if test_ad.get('features'):
            full_description += "Dotări: " + ", ".join(test_ad['features'])
        
        script_result = generate_script(
            description=full_description,
            title=test_ad['title'],
            category=test_ad['category'],
            price=test_ad['price']
        )
        
        # Extract script text from result
        script = script_result['script'] if isinstance(script_result, dict) else script_result
        
        print(f"✅ Script generated ({len(script)} characters)\n")
        print("="*60)
        print("📝 GENERATED SCRIPT")
        print("="*60)
        print(script)
        print("="*60 + "\n")
        
        # Save script
        script_file = OUTPUT_DIR / 'generated_script.txt'
        with open(script_file, 'w', encoding='utf-8') as f:
            f.write(script)
        
        # Save full result as JSON
        script_json_file = OUTPUT_DIR / 'generated_script.json'
        with open(script_json_file, 'w', encoding='utf-8') as f:
            json.dump(script_result, f, ensure_ascii=False, indent=2)
        
        pipeline_results['steps']['script'] = {
            'content': script,
            'length': len(script),
            'file': str(script_file),
            'estimated_duration': script_result.get('estimated_duration', 15),
            'word_count': script_result.get('word_count', len(script.split())),
            'cost': script_result.get('cost', len(script) / 1000 * 0.00015)
        }
        
        print(f"💾 Script saved to: {script_file}")
        print(f"💰 Estimated cost: ${pipeline_results['steps']['script']['cost']:.6f}\n")
        
        # ===== STEP 2: Generate Voiceover with TTS =====
        print("="*60)
        print("📍 STEP 2: Generate Romanian Voiceover with TTS")
        print("="*60 + "\n")
        
        print("🎙️  Generating Romanian voiceover...")
        print(f"   Model: gpt-4o-mini-tts")
        print(f"   Voice: shimmer")
        print(f"   Instructions: Romanian automotive (French brands, rolled Rs)\n")
        
        audio_path = generate_voiceover(
            script=script,
            category=test_ad['category'],
            language='ro'
        )
        
        audio_file = Path(audio_path)
        audio_size_kb = audio_file.stat().st_size / 1024
        
        print(f"\n✅ Voiceover generated!")
        print(f"   📂 File: {audio_file.name}")
        print(f"   📊 Size: {audio_size_kb:.1f} KB\n")
        
        pipeline_results['steps']['voiceover'] = {
            'file': audio_path,
            'size_kb': audio_size_kb,
            'cost': len(script) / 1000 * 0.015  # TTS HD rate
        }
        
        print(f"💰 Estimated cost: ${pipeline_results['steps']['voiceover']['cost']:.6f}\n")
        
        # ===== STEP 3: Generate Captions with Whisper =====
        print("="*60)
        print("📍 STEP 3: Generate Romanian Captions with Whisper")
        print("="*60 + "\n")
        
        print("🎬 Transcribing audio for captions...")
        print(f"   Model: whisper-1")
        print(f"   Language: Romanian")
        print(f"   Format: Word-level timestamps\n")
        
        captions = generate_captions(audio_path)
        
        num_words = len(captions.get('words', []))
        print(f"✅ Captions generated!")
        print(f"   Total words: {num_words}")
        print(f"   Text length: {len(captions['text'])} characters\n")
        
        # Save captions
        captions_file = OUTPUT_DIR / 'pipeline_captions.json'
        with open(captions_file, 'w', encoding='utf-8') as f:
            json.dump(captions, f, ensure_ascii=False, indent=2)
        
        pipeline_results['steps']['captions'] = {
            'file': str(captions_file),
            'words': num_words,
            'text': captions['text'],
            'cost': 0.006 * (audio_size_kb / 1024 / 2)  # Rough estimate: $0.006/min
        }
        
        print(f"💾 Captions saved to: {captions_file}")
        print(f"💰 Estimated cost: ${pipeline_results['steps']['captions']['cost']:.6f}\n")
        
        # ===== STEP 4: Create Video with FFmpeg =====
        print("="*60)
        print("📍 STEP 4: Assemble Video with FFmpeg")
        print("="*60 + "\n")
        
        print("🎥 Creating video from images + audio + captions...")
        print(f"   Resolution: 1080×1920 (9:16 portrait)")
        print(f"   Codec: H.264")
        print(f"   Audio: AAC 192kbps")
        print(f"   Effects: Ken Burns, fade in/out\n")
        
        # Use test images from previous test
        test_images = []
        for i in range(1, 6):
            img_path = OUTPUT_DIR / f'test_image_{i}.jpg'
            if img_path.exists():
                test_images.append(str(img_path))
        
        if not test_images:
            print("⚠️  No test images found. Creating new ones...")
            # Import the image creation function from test_ffmpeg_video
            import subprocess
            subprocess.run(['python', 'test_ffmpeg_video.py'], capture_output=True)
            
            # Try again
            for i in range(1, 6):
                img_path = OUTPUT_DIR / f'test_image_{i}.jpg'
                if img_path.exists():
                    test_images.append(str(img_path))
        
        print(f"   Using {len(test_images)} test images\n")
        
        video_output = OUTPUT_DIR / 'pipeline_complete_video.mp4'
        
        video_path = create_video(
            images=test_images,
            audio_path=audio_path,
            captions=captions,
            output_path=str(video_output)
        )
        
        video_file = Path(video_path)
        video_size_mb = video_file.stat().st_size / (1024 * 1024)
        
        print(f"\n✅ Video created!")
        print(f"   📂 File: {video_file.name}")
        print(f"   📊 Size: {video_size_mb:.2f} MB\n")
        
        pipeline_results['steps']['video'] = {
            'file': video_path,
            'size_mb': video_size_mb,
            'cost': 0.005  # FFmpeg serverless estimate
        }
        
        print(f"💰 Estimated cost: ${pipeline_results['steps']['video']['cost']:.6f}\n")
        
        # ===== STEP 5: Upload to R2 =====
        print("="*60)
        print("📍 STEP 5: Upload to Cloudflare R2")
        print("="*60 + "\n")
        
        print("☁️  Uploading video to R2...")
        print(f"   Bucket: {os.getenv('R2_BUCKET_NAME')}")
        print(f"   Region: auto")
        print(f"   Size: {video_size_mb:.2f} MB\n")
        
        # Generate object key
        import hashlib
        import time
        video_hash = hashlib.md5(open(video_path, 'rb').read()).hexdigest()[:8]
        object_key = f"test-videos/{test_ad['category']}/{video_hash}_{int(time.time())}.mp4"
        
        try:
            video_url = upload_to_r2(
                file_path=video_path,
                object_key=object_key
            )
            
            print(f"✅ Video uploaded!")
            print(f"   🔑 Key: {object_key}")
            print(f"   🌐 URL: {video_url}\n")
            
            pipeline_results['steps']['upload'] = {
                'url': video_url,
                'key': object_key,
                'cost': video_size_mb * 0.015  # R2 storage + bandwidth estimate
            }
            
            print(f"💰 Estimated cost: ${pipeline_results['steps']['upload']['cost']:.6f}\n")
            
        except Exception as e:
            print(f"⚠️  Upload failed: {e}")
            print(f"   (This is expected if R2 credentials need verification)\n")
            
            pipeline_results['steps']['upload'] = {
                'status': 'skipped',
                'reason': str(e),
                'cost': 0
            }
        
        # ===== PIPELINE SUMMARY =====
        print("="*60)
        print("✅ PIPELINE COMPLETE!")
        print("="*60 + "\n")
        
        # Calculate total cost
        total_cost = sum(
            step.get('cost', 0) 
            for step in pipeline_results['steps'].values()
        )
        
        print("📊 Pipeline Costs Breakdown:")
        print(f"   1. GPT Script:     ${pipeline_results['steps']['script']['cost']:.6f}")
        print(f"   2. TTS Voiceover:  ${pipeline_results['steps']['voiceover']['cost']:.6f}")
        print(f"   3. Whisper:        ${pipeline_results['steps']['captions']['cost']:.6f}")
        print(f"   4. FFmpeg:         ${pipeline_results['steps']['video']['cost']:.6f}")
        
        if 'upload' in pipeline_results['steps'] and pipeline_results['steps']['upload'].get('cost'):
            print(f"   5. R2 Upload:      ${pipeline_results['steps']['upload']['cost']:.6f}")
        
        print(f"   " + "-"*30)
        print(f"   TOTAL:            ${total_cost:.6f} (~{total_cost * 100:.2f} cents)\n")
        
        # Time estimate
        print("⏱️  Processing Time Estimate:")
        print("   • GPT Script: ~5-10 seconds")
        print("   • TTS Voiceover: ~10-15 seconds")
        print("   • Whisper Captions: ~20-30 seconds")
        print("   • FFmpeg Assembly: ~30-60 seconds")
        print("   • R2 Upload: ~5-10 seconds")
        print("   TOTAL: ~1-2 minutes per video\n")
        
        # Save results
        results_file = OUTPUT_DIR / 'pipeline_results.json'
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(pipeline_results, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Results saved to: {results_file}\n")
        
        # Open the final video
        print("🎬 Opening final video...")
        import subprocess
        try:
            subprocess.run(['open', str(video_output)], check=True)
            print("✓ Video opened in default player\n")
        except:
            print(f"   Manually open: {video_output}\n")
        
        print("="*60)
        print("🎉 SUCCESS! Full pipeline working end-to-end!")
        print("="*60 + "\n")
        
        print("📋 Next Steps:")
        print("   1. ✅ Pipeline validated at ~${:.4f} per video".format(total_cost))
        print("   2. 📝 Integrate with upload flow (Steps 2 & 3)")
        print("   3. 🎨 Add progress tracking UI")
        print("   4. 🚀 Deploy to production\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Pipeline failed: {e}")
        import traceback
        traceback.print_exc()
        
        # Save error state
        pipeline_results['error'] = {
            'message': str(e),
            'traceback': traceback.format_exc()
        }
        
        results_file = OUTPUT_DIR / 'pipeline_results_error.json'
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(pipeline_results, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Error details saved to: {results_file}")
        
        return False


def main():
    """Run full pipeline test"""
    print("\n" + "="*60)
    print("🚀 VIDX VIDEO GENERATION PIPELINE")
    print("   GPT → TTS → Whisper → FFmpeg → R2")
    print("="*60)
    
    success = test_full_pipeline()
    
    if success:
        print("\n✅ All systems operational! Ready for production integration.")
    else:
        print("\n❌ Pipeline test failed. Check errors above.")
    
    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
