#!/usr/bin/env python3
"""Test template rendering with show=videos parameter"""

import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import Flask app
from app import app

# Test the automotive page WITH show=videos
with app.app_context():
    with app.test_client() as client:
        print("\n" + "="*80)
        print("TESTING AUTOMOTIVE PAGE WITH ?show=videos")
        print("="*80 + "\n")
        
        response = client.get('/automotive?show=videos')
        html = response.data.decode('utf-8')
        
        # Save HTML for inspection
        with open('/tmp/automotive_videos_page.html', 'w') as f:
            f.write(html)
        print("HTML saved to /tmp/automotive_videos_page.html\n")
        
        # Check for key elements
        checks = {
            'video-card class': html.count('class="video-card'),
            'Renault Wind': html.count('Renault Wind'),
            'Video URL': html.count('6ffc3239_1762826994.mp4'),
            'Price €6,500': html.count('€6,500'),
            'data-ad-id="6ffc3239"': html.count('data-ad-id="6ffc3239"'),
        }
        
        for check_name, count in checks.items():
            status = "✅" if count > 0 else "❌"
            print(f"{status} {check_name}: {count} occurrences")
        
        print("\n" + "="*80)
        
        # Overall verdict
        if checks['video-card class'] > 0 and checks['Renault Wind'] > 0:
            print("✅ SUCCESS! Template is rendering server-side data correctly!")
            print("\n💡 TIP: Users need to add '?show=videos' to see listings")
            print("   Or change default behavior to show videos without filter page")
        else:
            print("❌ FAILED! Template is not rendering the listing")
        
        print("="*80 + "\n")
