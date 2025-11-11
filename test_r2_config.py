"""
Test R2 Configuration
Verify that R2 public URL is working correctly
"""

import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

def test_r2_config():
    """Test R2 configuration and public access"""
    
    print("\n🔍 Testing R2 Configuration...")
    print("=" * 60)
    
    # Check environment variables
    r2_account_id = os.getenv('R2_ACCOUNT_ID')
    r2_bucket = os.getenv('R2_BUCKET_NAME')
    r2_public_url = os.getenv('R2_PUBLIC_URL')
    
    print(f"\n📋 Configuration:")
    print(f"   Account ID: {r2_account_id}")
    print(f"   Bucket: {r2_bucket}")
    print(f"   Public URL: {r2_public_url}")
    
    # Test video URL
    test_video_path = "test-videos/automotive/6ffc3239_1762826994.mp4"
    test_video_url = f"{r2_public_url}/{test_video_path}"
    
    print(f"\n🎥 Testing Video URL:")
    print(f"   {test_video_url}")
    
    try:
        # Make a HEAD request to check if video is accessible
        response = requests.head(test_video_url, timeout=10)
        
        if response.status_code == 200:
            print(f"\n✅ SUCCESS! Video is publicly accessible")
            print(f"   Status: {response.status_code}")
            print(f"   Content-Type: {response.headers.get('Content-Type')}")
            print(f"   Content-Length: {int(response.headers.get('Content-Length', 0)) / 1024:.1f} KB")
            return True
        else:
            print(f"\n❌ FAILED! Received status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    success = test_r2_config()
    exit(0 if success else 1)
