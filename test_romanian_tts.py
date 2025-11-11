#!/usr/bin/env python3
"""
Test Romanian TTS with real automotive ad example
Tests the custom voice instructions for Romanian pronunciation
"""

import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import AsyncOpenAI
from tts_config import get_tts_config

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai_client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Your Romanian automotive ad example
ROMANIAN_AD_TEXT = """Renault Wind, an 2011 – un roadster compact, perfect pentru cei care vor o experiență de condus diferită. Sub capotă ai motorul de 1.2 benzină, 100 de cai putere, suficient pentru oraș și pentru drumuri scurte în afara lui.
Mașina vine cu jante din aliaj, plafon decapotabil electric și un interior cu scaune sport, finisate în semipiele. La interior găsești și comenzi pe volan, pilot automat și oglinzi electrice – exact cât ai nevoie pentru confort în utilizarea zilnică.
Starea generală este foarte bună, atât tehnic cât și estetic. Există și posibilitatea de achiziție în rate, dacă preferi o variantă mai flexibilă.
Dacă vrei o mașină mică, diferită și plăcută la condus, acest Renault Wind merită văzut!"""


async def test_romanian_tts():
    """Test Romanian TTS with streaming audio"""
    print("🎙️  Testing Romanian TTS with Renault Wind example...")
    print(f"\n📝 Text ({len(ROMANIAN_AD_TEXT)} characters):")
    print(f"{ROMANIAN_AD_TEXT[:100]}...\n")
    
    # Get TTS configuration for Romanian automotive ads
    tts_config = get_tts_config(category='automotive', language='ro')
    
    print(f"🔧 TTS Config:")
    print(f"   Model: {tts_config['model']}")
    print(f"   Voice: {tts_config['voice']}")
    print(f"   Format: {tts_config['response_format']}")
    print(f"   Instructions: Custom Romanian automotive voice\n")
    
    try:
        # Generate voiceover with streaming
        print("🎬 Generating voiceover...")
        
        async with openai_client.audio.speech.with_streaming_response.create(
            model=tts_config['model'],
            voice=tts_config['voice'],
            input=ROMANIAN_AD_TEXT,
            instructions=tts_config['instructions'],
            response_format='mp3',  # Use mp3 for file saving
        ) as response:
            # Save to file
            output_file = Path('test_romanian_tts_output.mp3')
            
            print(f"💾 Saving to: {output_file}")
            with output_file.open('wb') as f:
                async for chunk in response.iter_bytes():
                    f.write(chunk)
        
        print(f"\n✅ Voiceover generated successfully!")
        print(f"📂 File: {output_file.absolute()}")
        print(f"📊 Size: {output_file.stat().st_size / 1024:.1f} KB")
        
        # Try to play the audio (macOS only)
        print(f"\n🔊 Playing audio...")
        import subprocess
        try:
            subprocess.run(['afplay', str(output_file)], check=True)
            print("✅ Audio playback complete!")
        except FileNotFoundError:
            print("ℹ️  'afplay' not found. On macOS, audio would auto-play.")
            print(f"   Manually play: open {output_file}")
        except subprocess.CalledProcessError:
            print(f"⚠️  Could not play audio automatically.")
            print(f"   Manually play: open {output_file}")
        
        print(f"\n💰 Estimated cost: ${len(ROMANIAN_AD_TEXT) / 1000 * 0.015:.4f}")
        print(f"   (TTS HD rate: $0.015 per 1000 characters)")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if "quota" in str(e).lower():
            print(f"\n💡 OpenAI API quota exceeded.")
            print(f"   Add credits at: https://platform.openai.com/settings/organization/billing")
        raise


async def test_simple_tts():
    """Test with a simple Romanian phrase"""
    print("\n" + "="*60)
    print("🧪 Testing simple Romanian TTS...")
    print("="*60 + "\n")
    
    simple_text = "Bună ziua! Aceasta este o mașină excelentă, cu motor puternic și consum redus."
    
    print(f"📝 Text: {simple_text}\n")
    
    try:
        tts_config = get_tts_config(category='automotive', language='ro')
        
        async with openai_client.audio.speech.with_streaming_response.create(
            model=tts_config['model'],
            voice=tts_config['voice'],
            input=simple_text,
            instructions=tts_config['instructions'],
            response_format='mp3',
        ) as response:
            output_file = Path('test_simple_romanian.mp3')
            
            with output_file.open('wb') as f:
                async for chunk in response.iter_bytes():
                    f.write(chunk)
        
        print(f"✅ Simple test complete: {output_file}")
        print(f"📊 Size: {output_file.stat().st_size / 1024:.1f} KB\n")
        
    except Exception as e:
        print(f"❌ Error: {e}\n")
        raise


async def main():
    """Run all TTS tests"""
    print("\n" + "="*60)
    print("🎙️  ROMANIAN TTS TEST SUITE")
    print("="*60 + "\n")
    
    # Test 1: Full Romanian automotive ad
    await test_romanian_tts()
    
    # Test 2: Simple phrase
    # await test_simple_tts()
    
    print("\n" + "="*60)
    print("✅ All tests complete!")
    print("="*60 + "\n")
    
    print("📋 Next steps:")
    print("   1. Listen to the generated audio files")
    print("   2. Verify Romanian pronunciation (especially brand names)")
    print("   3. Check voice excitement/engagement levels")
    print("   4. Integrate into video_pipeline.py")


if __name__ == "__main__":
    asyncio.run(main())
