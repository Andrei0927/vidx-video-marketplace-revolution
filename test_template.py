#!/usr/bin/env python3
"""Quick test to see if template renders with items"""

from app import app
import json
import os

with app.test_client() as client:
    # Test the automotive page
    response = client.get('/automotive')
    html = response.data.decode('utf-8')
    
    print("=" * 80)
    print("TESTING AUTOMOTIVE PAGE")
    print("=" * 80)
    
    # Check if video-card class appears
    video_card_count = html.count('video-card')
    print(f"\n✓ Found {video_card_count} instances of 'video-card' class")
    
    # Check if Renault appears
    renault_count = html.count('Renault')
    print(f"✓ Found {renault_count} instances of 'Renault'")
    
    # Check if video URL appears
    video_url_count = html.count('6ffc3239_1762826994.mp4')
    print(f"✓ Found {video_url_count} instances of the video URL")
    
    # Check if price appears
    price_count = html.count('€6,500')
    print(f"✓ Found {price_count} instances of '€6,500'")
    
    print("\n" + "=" * 80)
    if video_card_count > 0 and renault_count > 0:
        print("✅ SUCCESS! Template is rendering the Renault Wind listing")
    else:
        print("❌ FAILED! Template is NOT rendering the listing")
        print("\nShowing first 2000 chars of video-grid section:")
        start_idx = html.find('id="video-grid"')
        if start_idx != -1:
            print(html[start_idx:start_idx + 2000])
    print("=" * 80)
