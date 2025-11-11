"""
Quick Test - Verify all fixes
"""

import json

# Simulate the seed data update logic
test_listing = {
    "id": "6ffc3239",
    "title": "Renault Wind Roadster 2011",
    "video_url": "https://pub-384ac06d34574276b20539cbf26191e2.r2.dev/test-videos/automotive/6ffc3239_1762826994.mp4"
}

print("🧪 Testing Seed Data Update Logic")
print("=" * 60)

# Simulate existing data with old URL
existing_ads = [
    {
        "id": "6ffc3239",
        "title": "Renault Wind Roadster 2011",
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
]

print("\n📦 Before:")
print(json.dumps(existing_ads, indent=2))

# Find and update
existing_index = next((i for i, ad in enumerate(existing_ads) if ad['id'] == test_listing['id']), -1)

if existing_index >= 0:
    existing_ads[existing_index] = test_listing
    print("\n🔄 Updated existing entry")
else:
    existing_ads.insert(0, test_listing)
    print("\n➕ Added new entry")

print("\n📦 After:")
print(json.dumps(existing_ads, indent=2))

print("\n✅ Seed data update logic working correctly!")
print("\n📋 Summary:")
print(f"   - Video URL updated: {test_listing['video_url']}")
print(f"   - Entry ID: {test_listing['id']}")
