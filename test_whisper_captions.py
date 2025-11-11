#!/usr/bin/env python3
"""
Test Whisper captions with Romanian audio
Tests word-level timestamp generation for subtitle overlay
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Test configuration
OUTPUT_DIR = Path('test_outputs')
OUTPUT_DIR.mkdir(exist_ok=True)


def test_whisper_transcription():
    """Test Whisper transcription with word-level timestamps"""
    print("\n" + "="*60)
    print("🎙️  WHISPER CAPTION GENERATION TEST")
    print("="*60 + "\n")
    
    # Use the Romanian TTS audio from previous test
    audio_file = Path('test_romanian_tts_output.mp3')
    
    if not audio_file.exists():
        print("❌ Romanian TTS audio not found. Run test_romanian_tts.py first.")
        return None
    
    print(f"📂 Audio file: {audio_file}")
    print(f"📊 Size: {audio_file.stat().st_size / 1024:.1f} KB\n")
    
    try:
        print("🎬 Transcribing with Whisper...")
        print("   Model: whisper-1")
        print("   Language: Romanian (ro)")
        print("   Response format: verbose_json (with word timestamps)\n")
        
        # Transcribe with word-level timestamps
        with open(audio_file, 'rb') as f:
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=f,
                language="ro",
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )
        
        print("✅ Transcription complete!\n")
        
        # Display full transcript
        print("="*60)
        print("📝 FULL TRANSCRIPT")
        print("="*60)
        print(f"{transcript.text}\n")
        
        # Display word-level timestamps
        print("="*60)
        print("⏱️  WORD-LEVEL TIMESTAMPS")
        print("="*60 + "\n")
        
        if hasattr(transcript, 'words') and transcript.words:
            print(f"Total words: {len(transcript.words)}\n")
            
            # Show first 10 words with timestamps
            print("First 10 words:")
            for i, word_info in enumerate(transcript.words[:10]):
                word = word_info.word
                start = word_info.start
                end = word_info.end
                duration = end - start
                print(f"  {i+1:2d}. [{start:6.2f}s - {end:6.2f}s] ({duration:.2f}s) → '{word}'")
            
            if len(transcript.words) > 10:
                print(f"\n  ... ({len(transcript.words) - 10} more words)")
            
            print("\n" + "="*60)
            print("🎯 ACCURACY CHECK")
            print("="*60 + "\n")
            
            # Original text for comparison
            original_text = """Renault Wind, an 2011 – un roadster compact, perfect pentru cei care vor o experiență de condus diferită. Sub capotă ai motorul de 1.2 benzină, 100 de cai putere, suficient pentru oraș și pentru drumuri scurte în afara lui.
Mașina vine cu jante din aliaj, plafon decapotabil electric și un interior cu scaune sport, finisate în semipiele. La interior găsești și comenzi pe volan, pilot automat și oglinzi electrice – exact cât ai nevoie pentru confort în utilizarea zilnică.
Starea generală este foarte bună, atât tehnic cât și estetic. Există și posibilitatea de achiziție în rate, dacă preferi o variantă mai flexibilă.
Dacă vrei o mașină mică, diferită și plăcută la condus, acest Renault Wind merită văzut!"""
            
            print("Original text:")
            print(f"{original_text[:150]}...\n")
            
            print("Whisper transcription:")
            print(f"{transcript.text[:150]}...\n")
            
            # Simple word count comparison
            original_words = original_text.split()
            transcribed_words = transcript.text.split()
            
            print(f"Original word count: {len(original_words)}")
            print(f"Transcribed word count: {len(transcribed_words)}")
            
            # Check for key Romanian automotive terms
            print("\n🚗 Romanian Automotive Terms Check:")
            key_terms = ['Renault', 'Wind', 'roadster', 'motor', 'benzină', 
                        'plafon', 'decapotabil', 'pilot', 'automat', 'oglinzi', 'electrice']
            
            for term in key_terms:
                if term.lower() in transcript.text.lower():
                    print(f"  ✓ '{term}' detected")
                else:
                    print(f"  ✗ '{term}' not found")
            
        else:
            print("⚠️  No word-level timestamps found in response")
            print("   Using segment-level timestamps instead:\n")
            
            if hasattr(transcript, 'segments'):
                for i, segment in enumerate(transcript.segments[:5]):
                    print(f"  Segment {i+1}: [{segment.start:.2f}s - {segment.end:.2f}s]")
                    print(f"    Text: {segment.text}\n")
        
        # Save transcript to JSON
        output_file = OUTPUT_DIR / 'whisper_transcript.json'
        
        # Convert to dict for JSON serialization
        transcript_data = {
            'text': transcript.text,
            'language': getattr(transcript, 'language', 'ro'),
            'duration': getattr(transcript, 'duration', 0),
            'words': []
        }
        
        if hasattr(transcript, 'words') and transcript.words:
            transcript_data['words'] = [
                {
                    'word': w.word,
                    'start': w.start,
                    'end': w.end
                }
                for w in transcript.words
            ]
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(transcript_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Saved transcript to: {output_file}")
        
        # Calculate cost
        audio_minutes = audio_file.stat().st_size / (1024 * 1024 * 2)  # Rough estimate
        cost = audio_minutes * 0.006  # $0.006 per minute
        
        print(f"\n💰 Estimated cost: ${cost:.4f}")
        print(f"   (Whisper rate: $0.006 per minute)")
        
        return transcript_data
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        
        if "quota" in str(e).lower():
            print(f"\n💡 OpenAI API quota exceeded.")
            print(f"   Add credits at: https://platform.openai.com/settings/organization/billing")
        elif "invalid" in str(e).lower():
            print(f"\n💡 Check if audio file is valid MP3 format")
        
        raise


def generate_srt_file(transcript_data):
    """Generate SRT subtitle file from transcript data"""
    print("\n" + "="*60)
    print("📄 GENERATING SRT SUBTITLE FILE")
    print("="*60 + "\n")
    
    if not transcript_data or not transcript_data.get('words'):
        print("❌ No word-level timestamps available")
        return None
    
    words = transcript_data['words']
    srt_file = OUTPUT_DIR / 'romanian_captions.srt'
    
    # Group words into subtitle chunks (max 5 words or 3 seconds per subtitle)
    subtitles = []
    current_subtitle = {
        'words': [],
        'start': 0,
        'end': 0
    }
    
    for word_info in words:
        # Start new subtitle if we have 5 words or if too much time has passed
        if len(current_subtitle['words']) >= 5 or \
           (current_subtitle['words'] and word_info['start'] - current_subtitle['start'] > 3.0):
            # Save current subtitle
            if current_subtitle['words']:
                subtitles.append(current_subtitle)
            
            # Start new one
            current_subtitle = {
                'words': [word_info['word']],
                'start': word_info['start'],
                'end': word_info['end']
            }
        else:
            # Add to current subtitle
            if not current_subtitle['words']:
                current_subtitle['start'] = word_info['start']
            
            current_subtitle['words'].append(word_info['word'])
            current_subtitle['end'] = word_info['end']
    
    # Add last subtitle
    if current_subtitle['words']:
        subtitles.append(current_subtitle)
    
    print(f"📊 Generated {len(subtitles)} subtitle segments")
    print(f"   Average words per segment: {len(words) / len(subtitles):.1f}\n")
    
    # Write SRT file
    with open(srt_file, 'w', encoding='utf-8') as f:
        for i, subtitle in enumerate(subtitles, 1):
            # Subtitle index
            f.write(f"{i}\n")
            
            # Timestamps in SRT format (HH:MM:SS,mmm --> HH:MM:SS,mmm)
            start_time = format_srt_timestamp(subtitle['start'])
            end_time = format_srt_timestamp(subtitle['end'])
            f.write(f"{start_time} --> {end_time}\n")
            
            # Subtitle text
            text = ' '.join(subtitle['words'])
            f.write(f"{text}\n\n")
    
    print(f"✅ SRT file created: {srt_file}\n")
    
    # Show first 3 subtitles as preview
    print("Preview (first 3 subtitles):")
    print("-" * 60)
    
    with open(srt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        preview_lines = []
        subtitle_count = 0
        
        for line in lines:
            preview_lines.append(line)
            if line.strip() == '' and subtitle_count < 2:
                subtitle_count += 1
            elif subtitle_count >= 2:
                break
        
        print(''.join(preview_lines))
    
    return srt_file


def format_srt_timestamp(seconds):
    """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def test_caption_overlay():
    """Test adding captions to video using FFmpeg"""
    print("\n" + "="*60)
    print("🎬 TESTING CAPTION OVERLAY ON VIDEO")
    print("="*60 + "\n")
    
    # Check for required files
    video_file = OUTPUT_DIR / 'romanian_automotive_video.mp4'
    srt_file = OUTPUT_DIR / 'romanian_captions.srt'
    
    if not video_file.exists():
        print(f"❌ Video file not found: {video_file}")
        return False
    
    if not srt_file.exists():
        print(f"❌ SRT file not found: {srt_file}")
        return False
    
    print(f"📂 Video: {video_file.name}")
    print(f"📄 Subtitles: {srt_file.name}\n")
    
    # Output with captions
    output_file = OUTPUT_DIR / 'romanian_video_with_captions.mp4'
    
    print("🎥 Adding Romanian captions to video...")
    print("   Style: White text, black background, bottom center\n")
    
    # FFmpeg command with subtitle overlay
    import subprocess
    
    # Escape the SRT file path for FFmpeg
    srt_path_escaped = str(srt_file).replace('\\', '/').replace(':', '\\:')
    
    cmd = [
        'ffmpeg', '-y',
        '-i', str(video_file),
        '-vf', f"subtitles='{srt_path_escaped}':force_style='FontName=Helvetica,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=2,Shadow=1,MarginV=60'",
        '-c:a', 'copy',
        str(output_file)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    
    if result.returncode != 0:
        print(f"❌ FFmpeg error:")
        print(result.stderr[-500:])
        return False
    
    if output_file.exists():
        size_mb = output_file.stat().st_size / (1024 * 1024)
        print(f"✅ Video with captions created!")
        print(f"   📂 File: {output_file}")
        print(f"   📊 Size: {size_mb:.2f} MB\n")
        
        # Open the video
        print("🎬 Opening video with Romanian captions...")
        try:
            subprocess.run(['open', str(output_file)], check=True)
            print("✓ Video opened in default player\n")
        except:
            print(f"   Manually open: {output_file}\n")
        
        return True
    else:
        print(f"❌ Output file not created")
        return False


def main():
    """Run Whisper caption tests"""
    print("\n" + "="*60)
    print("🎙️  WHISPER CAPTION TEST SUITE")
    print("="*60)
    
    try:
        # Step 1: Transcribe audio with Whisper
        print("\n📍 STEP 1: Transcribe Romanian audio")
        transcript_data = test_whisper_transcription()
        
        if not transcript_data:
            print("\n❌ Transcription failed. Cannot continue.")
            return
        
        # Step 2: Generate SRT file
        print("\n📍 STEP 2: Generate SRT subtitle file")
        srt_file = generate_srt_file(transcript_data)
        
        if not srt_file:
            print("\n❌ SRT generation failed. Cannot continue.")
            return
        
        # Step 3: Add captions to video
        print("\n📍 STEP 3: Add captions to video")
        success = test_caption_overlay()
        
        # Summary
        print("="*60)
        print("✅ WHISPER CAPTION TEST COMPLETE")
        print("="*60 + "\n")
        
        print("Generated files:")
        print(f"  1. {OUTPUT_DIR}/whisper_transcript.json - Full transcript with timestamps")
        print(f"  2. {OUTPUT_DIR}/romanian_captions.srt - SRT subtitle file")
        print(f"  3. {OUTPUT_DIR}/romanian_video_with_captions.mp4 - Video with captions\n")
        
        if success:
            print("🎉 All Whisper caption tests passed!")
            print("\n📋 Next: Test full pipeline (GPT → TTS → Whisper → FFmpeg → R2)")
        else:
            print("⚠️  Caption overlay failed. Check FFmpeg subtitle support.")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
