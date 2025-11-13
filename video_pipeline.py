"""
Video Generation Pipeline
OpenAI-based video generation for marketplace ads

Pipeline: Media + Description → GPT-4 Script → OpenAI TTS → FFmpeg → R2 Storage
Cost: ~$0.007 per video (vs $0.50-2.00 for commercial APIs)
"""

import os
import json
import tempfile
import subprocess
from pathlib import Path
from openai import AsyncOpenAI
import boto3
from datetime import datetime
import hashlib
from dotenv import load_dotenv
import asyncio
from tts_config import get_tts_config, ROMANIAN_TTS_INSTRUCTIONS

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI async client for TTS
openai_client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize R2 client (S3-compatible)
r2_client = boto3.client(
    's3',
    endpoint_url=f"https://{os.getenv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com",
    aws_access_key_id=os.getenv('R2_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('R2_SECRET_ACCESS_KEY'),
    region_name='auto'
)

R2_BUCKET = os.getenv('R2_BUCKET_NAME', 'video-marketplace-videos')


def generate_script(description, title, category, price, details=None):
    """
    Generate video script using GPT-4o Mini
    
    Args:
        description: Product description
        title: Product title
        category: Product category (automotive, electronics, fashion)
        price: Product price
        details: Additional product details (dict)
    
    Returns:
        dict: {script: str, estimated_duration: int}
    """
    # Build context-aware prompt
    prompt = f"""Create a 15-second video ad script for a marketplace listing.

PRODUCT INFORMATION:
Title: {title}
Category: {category}
Price: ${price:,.0f}
Description: {description}

STRICT RULES:
- Use ONLY the information provided above
- DO NOT add features, specs, or details not mentioned
- Keep it under 60 words (15 seconds when spoken)
- Make it engaging and conversational
- Focus on value proposition and key selling points
- End with a call to action

OUTPUT FORMAT:
Just the script text, no labels or formatting."""

    if details:
        prompt += f"\n\nAdditional Details:\n{json.dumps(details, indent=2)}"

    try:
        # Use sync client for script generation
        from openai import OpenAI
        sync_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        response = sync_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional ad copywriter. Create factual, engaging scripts using only the information provided. Never hallucinate details."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,  # Some creativity, but not too much
            max_tokens=150
        )
        
        script = response.choices[0].message.content.strip()
        
        # Estimate duration (average speaking rate: 150 words/minute)
        word_count = len(script.split())
        estimated_duration = int((word_count / 150) * 60) + 2  # Add 2s buffer
        
        return {
            'script': script,
            'estimated_duration': estimated_duration,
            'word_count': word_count,
            'cost': 0.001  # Approximate cost
        }
    
    except Exception as e:
        print(f"Error generating script: {e}")
        raise


async def generate_voiceover_async(script, category='automotive', language='ro'):
    """
    Generate voiceover using OpenAI TTS with custom Romanian instructions (async)
    
    Args:
        script: Text to convert to speech
        category: Product category (automotive, electronics, fashion)
        language: Language code (ro, en)
    
    Returns:
        str: Path to generated audio file
    """
    try:
        # Get TTS configuration for category and language
        tts_config = get_tts_config(category, language)
        
        print(f"TTS Config: model={tts_config['model']}, voice={tts_config['voice']}")
        # Note: OpenAI TTS API doesn't support 'instructions' parameter
        # Voice characteristics are controlled by the 'voice' parameter only
        
        # Create the speech using async client with streaming
        async with openai_client.audio.speech.with_streaming_response.create(
            model=tts_config['model'],
            voice=tts_config['voice'],
            input=script,
            response_format='mp3',  # Use mp3 for FFmpeg compatibility
            speed=1.0  # Normal speed
        ) as response:
            # Save to temp file
            temp_audio = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
            
            # Stream the response to file
            async for chunk in response.iter_bytes(chunk_size=4096):
                temp_audio.write(chunk)
            
            temp_audio.close()
            
            print(f"✓ Generated Romanian voiceover: {temp_audio.name}")
            return temp_audio.name
    
    except Exception as e:
        print(f"Error generating voiceover: {e}")
        raise


def generate_voiceover(script, category='automotive', language='ro'):
    """
    Generate voiceover using OpenAI TTS (sync wrapper)
    
    Args:
        script: Text to convert to speech
        category: Product category (automotive, electronics, fashion)
        language: Language code (ro, en)
    
    Returns:
        str: Path to generated audio file
    """
    # Run async function in event loop
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        # Create new event loop if one doesn't exist
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(generate_voiceover_async(script, category, language))


def generate_captions(audio_path):
    """
    Generate captions with word-level timestamps using Whisper
    
    Args:
        audio_path: Path to audio file
    
    Returns:
        dict: {text: str, words: [{word, start, end}]}
    """
    try:
        # Use sync client for Whisper
        from openai import OpenAI
        sync_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        with open(audio_path, 'rb') as audio_file:
            transcript = sync_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )
        
        # Extract word-level timestamps
        words = []
        if hasattr(transcript, 'words') and transcript.words:
            words = [
                {
                    'word': w.word,
                    'start': w.start,
                    'end': w.end
                }
                for w in transcript.words
            ]
        
        print(f"✓ Generated captions: {len(words)} words")
        return {
            'text': transcript.text,
            'words': words,
            'duration': transcript.duration if hasattr(transcript, 'duration') else 0
        }
    
    except Exception as e:
        print(f"Error generating captions: {e}")
        raise


def create_video(images, audio_path, captions, output_path):
    """
    Create video using FFmpeg
    
    Args:
        images: List of image file paths
        audio_path: Path to audio file
        captions: Caption data from generate_captions()
        output_path: Where to save final video
    
    Returns:
        str: Path to generated video
    """
    try:
        # Get audio duration
        probe_cmd = [
            'ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            audio_path
        ]
        audio_duration = float(subprocess.check_output(probe_cmd).decode().strip())
        
        # Calculate duration per image
        num_images = len(images)
        duration_per_image = audio_duration / num_images if num_images > 0 else 3.0
        
        # Create filter complex for slideshow with Ken Burns effect
        filters = []
        for i, img_path in enumerate(images):
            # Zoompan effect (subtle zoom)
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
        cmd = ['ffmpeg', '-y']  # -y to overwrite output
        
        # Add image inputs
        for img_path in images:
            cmd.extend(['-loop', '1', '-t', str(duration_per_image), '-i', img_path])
        
        # Add audio input
        cmd.extend(['-i', audio_path])
        
        # Add filters
        cmd.extend([
            '-filter_complex', filter_complex,
            '-map', '[outv]',
            '-map', f'{num_images}:a',  # Audio from last input
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-movflags', '+faststart',  # Optimize for streaming
            '-t', str(audio_duration),  # Match audio duration
            output_path
        ])
        
        print(f"Running FFmpeg: {' '.join(cmd[:10])}...")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            print(f"FFmpeg error: {result.stderr}")
            raise RuntimeError(f"FFmpeg failed: {result.stderr}")
        
        print(f"✓ Created video: {output_path}")
        return output_path
    
    except subprocess.TimeoutExpired:
        raise RuntimeError("Video rendering timed out (5 minutes)")
    except Exception as e:
        print(f"Error creating video: {e}")
        raise


def upload_to_r2(file_path, object_key=None):
    """
    Upload file to Cloudflare R2
    
    Args:
        file_path: Local file path
        object_key: R2 object key (auto-generated if None)
    
    Returns:
        str: Public URL to uploaded file
    """
    try:
        if object_key is None:
            # Generate unique key based on file hash + timestamp
            with open(file_path, 'rb') as f:
                file_hash = hashlib.md5(f.read()).hexdigest()[:8]
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            ext = Path(file_path).suffix
            object_key = f"videos/{timestamp}_{file_hash}{ext}"
        
        # Upload to R2
        with open(file_path, 'rb') as f:
            r2_client.upload_fileobj(
                f,
                R2_BUCKET,
                object_key,
                ExtraArgs={
                    'ContentType': 'video/mp4' if file_path.endswith('.mp4') else 'audio/mpeg'
                }
            )
        
        # Generate public URL using configured public URL
        r2_public_url = os.getenv('R2_PUBLIC_URL', f"https://pub-{os.getenv('R2_ACCOUNT_ID')}.r2.dev")
        public_url = f"{r2_public_url}/{object_key}"
        
        print(f"✓ Uploaded to R2: {public_url}")
        return public_url
    
    except Exception as e:
        print(f"Error uploading to R2: {e}")
        raise


def generate_video_pipeline(images, description, title, category, price, details=None, language='ro'):
    """
    Complete video generation pipeline
    
    Args:
        images: List of image file paths
        description: Product description
        title: Product title
        category: Product category
        price: Product price
        details: Additional details (dict)
        language: Language code (ro, en)
    
    Returns:
        dict: {
            video_url: str,
            script: str,
            duration: int,
            cost: float,
            thumbnail_url: str
        }
    """
    temp_files = []
    
    try:
        print(f"\n=== Video Generation Pipeline ===")
        print(f"Product: {title}")
        print(f"Images: {len(images)}")
        print(f"Language: {language}")
        
        # Step 1: Generate script
        print("\n[1/5] Generating script...")
        script_result = generate_script(description, title, category, price, details)
        print(f"Script: {script_result['script'][:100]}...")
        
        # Step 2: Generate voiceover with Romanian instructions
        print("\n[2/5] Generating Romanian voiceover...")
        audio_path = generate_voiceover(script_result['script'], category, language)
        temp_files.append(audio_path)
        
        # Step 3: Generate captions
        print("\n[3/5] Generating captions...")
        captions = generate_captions(audio_path)
        
        # Step 4: Create video
        print("\n[4/5] Rendering video...")
        output_video = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
        temp_files.append(output_video.name)
        
        create_video(images, audio_path, captions, output_video.name)
        
        # Step 5: Upload to R2
        print("\n[5/5] Uploading to cloud storage...")
        video_url = upload_to_r2(output_video.name)
        
        # Generate thumbnail (use first image)
        thumbnail_url = upload_to_r2(images[0], object_key=None) if images else None
        
        total_cost = script_result['cost'] + 0.003 + 0.003  # Script + TTS + Whisper
        
        print(f"\n✓ Pipeline complete!")
        print(f"Video URL: {video_url}")
        print(f"Total cost: ${total_cost:.4f}")
        
        return {
            'video_url': video_url,
            'script': script_result['script'],
            'duration': captions['duration'],
            'cost': total_cost,
            'thumbnail_url': thumbnail_url,
            'captions': captions['text']
        }
    
    finally:
        # Cleanup temp files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
                    print(f"Cleaned up: {temp_file}")
            except Exception as e:
                print(f"Warning: Failed to cleanup {temp_file}: {e}")


# Example usage
if __name__ == '__main__':
    # Test with Romanian Renault Wind ad (your example)
    test_images = [
        'sample_images/car1.jpg',
        'sample_images/car2.jpg',
        'sample_images/car3.jpg'
    ]
    
    result = generate_video_pipeline(
        images=test_images,
        description="Renault Wind, an 2011 – un roadster compact, perfect pentru cei care vor o experiență de condus diferită. Sub capotă ai motorul de 1.2 benzină, 100 de cai putere, suficient pentru oraș și pentru drumuri scurte în afara lui.\nMașina vine cu jante din aliaj, plafon decapotabil electric și un interior cu scaune sport, finisate în semipiele. La interior găsești și comenzi pe volan, pilot automat și oglinzi electrice – exact cât ai nevoie pentru confort în utilizarea zilnică.\nStarea generală este foarte bună, atât tehnic cât și estetic. Există și posibilitatea de achiziție în rate, dacă preferi o variantă mai flexibilă.\nDacă vrei o mașină mică, diferită și plăcută la condus, acest Renault Wind merită văzut!",
        title="Renault Wind 2011",
        category="automotive",
        price=4500,
        details={
            'make': 'Renault',
            'model': 'Wind',
            'year': 2011,
            'engine': '1.2 benzină',
            'horsepower': 100,
            'features': [
                'Jante din aliaj',
                'Plafon decapotabil electric',
                'Scaune sport semipiele',
                'Comenzi pe volan',
                'Pilot automat',
                'Oglinzi electrice'
            ]
        },
        language='ro'
    )
    
    print(json.dumps(result, indent=2))
