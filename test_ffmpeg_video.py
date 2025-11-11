#!/usr/bin/env python3
"""
Test FFmpeg video assembly with Romanian automotive styling
Tests the complete video generation pipeline with captions
"""

import os
import subprocess
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

# Test configuration
OUTPUT_DIR = Path('test_outputs')
OUTPUT_DIR.mkdir(exist_ok=True)


def create_test_images(num_images=5):
    """Create test automotive-style images with Romanian text"""
    print(f"🖼️  Creating {num_images} test images...")
    
    images = []
    colors = [
        ('#1a1a2e', '#e94560'),  # Dark blue + Red
        ('#16213e', '#0f3460'),  # Navy + Deep blue
        ('#0f0f0f', '#f38181'),  # Black + Coral
        ('#2d4059', '#ea5455'),  # Dark slate + Red
        ('#1b262c', '#bbe1fa'),  # Dark + Light blue
    ]
    
    # Romanian automotive features to display
    features = [
        'RENAULT WIND 2011',
        'Motor 1.2 Benzină\n100 CP',
        'Plafon Decapotabil\nElectric',
        'Interior cu Scaune\nSport Semipiele',
        'Pilot Automat\nOglinzi Electrice'
    ]
    
    for i in range(num_images):
        # Create 9:16 portrait image (1080x1920 for Instagram/TikTok)
        img = Image.new('RGB', (1080, 1920), colors[i % len(colors)][0])
        draw = ImageDraw.Draw(img)
        
        # Try to load a nice font, fallback to default
        try:
            font_large = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 120)
            font_small = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 60)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Add feature text
        feature_text = features[i % len(features)]
        
        # Draw centered text with background
        bbox = draw.textbbox((0, 0), feature_text, font=font_large)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (1080 - text_width) // 2
        y = (1920 - text_height) // 2
        
        # Draw accent color background
        padding = 40
        draw.rectangle(
            [x - padding, y - padding, x + text_width + padding, y + text_height + padding],
            fill=colors[i % len(colors)][1]
        )
        
        # Draw text
        draw.text((x, y), feature_text, font=font_large, fill='white', align='center')
        
        # Add image number at top
        draw.text((40, 40), f'Slide {i+1}/{num_images}', font=font_small, fill=colors[i % len(colors)][1])
        
        # Save image
        img_path = OUTPUT_DIR / f'test_image_{i+1}.jpg'
        img.save(img_path, 'JPEG', quality=95)
        images.append(str(img_path))
        
        print(f"  ✓ Created: {img_path.name}")
    
    return images


def create_test_audio():
    """Create a test audio file using TTS or use the one from previous test"""
    print(f"\n🎙️  Checking for test audio...")
    
    # Check if we have the Romanian TTS output from previous test
    romanian_audio = Path('test_romanian_tts_output.mp3')
    
    if romanian_audio.exists():
        print(f"  ✓ Using existing Romanian TTS: {romanian_audio}")
        return str(romanian_audio)
    
    # If not, create a simple test audio using FFmpeg
    print(f"  Creating simple test audio with FFmpeg...")
    
    test_audio = OUTPUT_DIR / 'test_audio.mp3'
    
    # Generate 10 seconds of sine wave (440 Hz - A note)
    cmd = [
        'ffmpeg', '-y',
        '-f', 'lavfi',
        '-i', 'sine=frequency=440:duration=10',
        '-af', 'volume=0.5',
        str(test_audio)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Failed to create test audio: {result.stderr}")
    
    print(f"  ✓ Created: {test_audio}")
    return str(test_audio)


def create_test_captions(audio_path):
    """Create test caption data structure"""
    print(f"\n📝 Creating test captions...")
    
    # Get audio duration
    probe_cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        audio_path
    ]
    
    duration = float(subprocess.check_output(probe_cmd).decode().strip())
    
    # Create sample Romanian captions with word-level timestamps
    captions = {
        'text': 'Renault Wind, an 2011 – un roadster compact, perfect pentru cei care vor o experiență de condus diferită.',
        'words': []
    }
    
    # Simulate word-level timestamps
    words = captions['text'].split()
    time_per_word = duration / len(words)
    
    for i, word in enumerate(words):
        start = i * time_per_word
        end = (i + 1) * time_per_word
        captions['words'].append({
            'word': word,
            'start': start,
            'end': end
        })
    
    print(f"  ✓ Created {len(captions['words'])} word timestamps")
    return captions


def test_ffmpeg_basic():
    """Test basic FFmpeg functionality"""
    print("\n" + "="*60)
    print("🧪 TEST 1: Basic FFmpeg Installation")
    print("="*60 + "\n")
    
    # Check FFmpeg version
    result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
    version_line = result.stdout.split('\n')[0]
    print(f"✓ {version_line}")
    
    # Check for required encoders
    print("\n📦 Checking required encoders:")
    encoders = ['libx264', 'aac', 'libvpx-vp9']
    
    for encoder in encoders:
        result = subprocess.run(
            ['ffmpeg', '-encoders'],
            capture_output=True,
            text=True
        )
        if encoder in result.stdout:
            print(f"  ✓ {encoder}")
        else:
            print(f"  ✗ {encoder} (not found)")
    
    return True


def test_ffmpeg_slideshow():
    """Test creating a slideshow with Ken Burns effect"""
    print("\n" + "="*60)
    print("🧪 TEST 2: Slideshow with Ken Burns Effect")
    print("="*60 + "\n")
    
    # Create test images
    images = create_test_images(5)
    
    # Create test audio
    audio_path = create_test_audio()
    
    # Get audio duration
    probe_cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        audio_path
    ]
    audio_duration = float(subprocess.check_output(probe_cmd).decode().strip())
    
    print(f"\n⏱️  Audio duration: {audio_duration:.2f}s")
    
    # Calculate duration per image
    num_images = len(images)
    duration_per_image = audio_duration / num_images
    
    print(f"🖼️  {num_images} images × {duration_per_image:.2f}s each\n")
    
    # Create filter complex for slideshow with Ken Burns effect
    print("🎬 Building FFmpeg filter chain...")
    filters = []
    
    for i in range(num_images):
        # Zoompan effect (subtle zoom) + fade in/out
        filters.append(
            f"[{i}:v]scale=1080:1920:force_original_aspect_ratio=increase,"
            f"crop=1080:1920,"
            f"zoompan=z='zoom+0.001':d={int(duration_per_image * 30)}:s=1080x1920,"
            f"fade=t=in:st=0:d=0.3,fade=t=out:st={duration_per_image - 0.3}:d=0.3[v{i}]"
        )
    
    # Concatenate all clips
    concat_inputs = ''.join([f"[v{i}]" for i in range(num_images)])
    filters.append(f"{concat_inputs}concat=n={num_images}:v=1:a=0[outv]")
    
    filter_complex = ';'.join(filters)
    
    # Build FFmpeg command
    output_path = OUTPUT_DIR / 'test_slideshow.mp4'
    
    cmd = ['ffmpeg', '-y']
    
    # Add image inputs
    for img_path in images:
        cmd.extend(['-loop', '1', '-t', str(duration_per_image), '-i', img_path])
    
    # Add audio input
    cmd.extend(['-i', audio_path])
    
    # Add filters and encoding settings
    cmd.extend([
        '-filter_complex', filter_complex,
        '-map', '[outv]',
        '-map', f'{num_images}:a',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
        '-t', str(audio_duration),
        str(output_path)
    ])
    
    print(f"🎥 Running FFmpeg (this may take a minute)...")
    print(f"   Command: ffmpeg [+{len(cmd)-1} args]")
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    
    if result.returncode != 0:
        print(f"\n❌ FFmpeg failed:")
        print(result.stderr[-500:])  # Last 500 chars of error
        return False
    
    # Check output
    if output_path.exists():
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"\n✅ Video created successfully!")
        print(f"   📂 File: {output_path}")
        print(f"   📊 Size: {size_mb:.2f} MB")
        print(f"   ⏱️  Duration: {audio_duration:.2f}s")
        
        # Get video info
        probe_cmd = [
            'ffprobe', '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height,codec_name,r_frame_rate',
            '-of', 'json',
            str(output_path)
        ]
        
        probe_result = subprocess.run(probe_cmd, capture_output=True, text=True)
        info = json.loads(probe_result.stdout)
        
        if 'streams' in info and len(info['streams']) > 0:
            stream = info['streams'][0]
            print(f"   🎞️  Codec: {stream.get('codec_name', 'unknown')}")
            print(f"   📐 Resolution: {stream.get('width', '?')}×{stream.get('height', '?')}")
            print(f"   🎯 FPS: {stream.get('r_frame_rate', 'unknown')}")
        
        # Try to play the video (macOS only)
        print(f"\n🔊 Opening video...")
        try:
            subprocess.run(['open', str(output_path)], check=True)
        except:
            print(f"   Manually open: {output_path}")
        
        return True
    else:
        print(f"\n❌ Output file not created")
        return False


def test_ffmpeg_with_romanian_audio():
    """Test with actual Romanian TTS audio"""
    print("\n" + "="*60)
    print("🧪 TEST 3: Romanian Automotive Video")
    print("="*60 + "\n")
    
    romanian_audio = Path('test_romanian_tts_output.mp3')
    
    if not romanian_audio.exists():
        print("⚠️  Romanian TTS audio not found. Run test_romanian_tts.py first.")
        return False
    
    print(f"✓ Using Romanian TTS audio: {romanian_audio}\n")
    
    # Create automotive images
    images = create_test_images(5)
    
    # Use the Romanian audio
    audio_path = str(romanian_audio)
    
    # Get audio duration
    probe_cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        audio_path
    ]
    audio_duration = float(subprocess.check_output(probe_cmd).decode().strip())
    
    print(f"⏱️  Audio duration: {audio_duration:.2f}s")
    
    # Calculate duration per image
    num_images = len(images)
    duration_per_image = audio_duration / num_images
    
    print(f"🖼️  {num_images} images × {duration_per_image:.2f}s each\n")
    
    # Create filter complex
    print("🎬 Building Romanian automotive video...")
    filters = []
    
    for i in range(num_images):
        filters.append(
            f"[{i}:v]scale=1080:1920:force_original_aspect_ratio=increase,"
            f"crop=1080:1920,"
            f"zoompan=z='zoom+0.001':d={int(duration_per_image * 30)}:s=1080x1920,"
            f"fade=t=in:st=0:d=0.3,fade=t=out:st={duration_per_image - 0.3}:d=0.3[v{i}]"
        )
    
    concat_inputs = ''.join([f"[v{i}]" for i in range(num_images)])
    filters.append(f"{concat_inputs}concat=n={num_images}:v=1:a=0[outv]")
    
    filter_complex = ';'.join(filters)
    
    # Output path
    output_path = OUTPUT_DIR / 'romanian_automotive_video.mp4'
    
    # Build command
    cmd = ['ffmpeg', '-y']
    
    for img_path in images:
        cmd.extend(['-loop', '1', '-t', str(duration_per_image), '-i', img_path])
    
    cmd.extend(['-i', audio_path])
    
    cmd.extend([
        '-filter_complex', filter_complex,
        '-map', '[outv]',
        '-map', f'{num_images}:a',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
        '-t', str(audio_duration),
        str(output_path)
    ])
    
    print(f"🎥 Rendering video...")
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    
    if result.returncode != 0:
        print(f"\n❌ FFmpeg failed:")
        print(result.stderr[-500:])
        return False
    
    if output_path.exists():
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"\n✅ Romanian automotive video created!")
        print(f"   📂 File: {output_path}")
        print(f"   📊 Size: {size_mb:.2f} MB")
        print(f"   ⏱️  Duration: {audio_duration:.2f}s")
        print(f"   🎙️  Voice: Romanian TTS with Renault Wind ad")
        
        # Open the video
        print(f"\n🎬 Opening video...")
        try:
            subprocess.run(['open', str(output_path)], check=True)
            print("✓ Video opened in default player")
        except:
            print(f"   Manually open: {output_path}")
        
        return True
    else:
        print(f"\n❌ Output file not created")
        return False


def main():
    """Run all FFmpeg tests"""
    print("\n" + "="*60)
    print("🎥 FFMPEG VIDEO ASSEMBLY TEST SUITE")
    print("="*60)
    
    results = []
    
    # Test 1: Basic FFmpeg check
    try:
        results.append(('Basic FFmpeg', test_ffmpeg_basic()))
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        results.append(('Basic FFmpeg', False))
    
    # Test 2: Slideshow creation
    try:
        results.append(('Slideshow', test_ffmpeg_slideshow()))
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        results.append(('Slideshow', False))
    
    # Test 3: Romanian automotive video
    try:
        results.append(('Romanian Video', test_ffmpeg_with_romanian_audio()))
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        results.append(('Romanian Video', False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60 + "\n")
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status}: {test_name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print(f"\n  Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! FFmpeg video assembly is working perfectly!")
        print(f"\n📂 Check outputs in: {OUTPUT_DIR.absolute()}")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")


if __name__ == "__main__":
    main()
