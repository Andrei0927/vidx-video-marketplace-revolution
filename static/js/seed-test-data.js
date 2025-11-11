/**
 * Seed test data for development
 * Adds sample video listings to localStorage
 */

function seedTestData() {
    // Test video listing (Renault Wind)
    // Using R2 public URL with configured dev domain
    const testListings = [
        {
            id: "6ffc3239",
            title: "Renault Wind Roadster 2011",
            category: "automotive",
            description: "Roadster compact 2011, motor 1.2 benzină 100 CP",
            price: 6500,
            condition: "Foarte bună",
            location: "București, România",
            // R2 public URL
            video_url: "https://pub-384ac06d34574276b20539cbf26191e2.r2.dev/test-videos/automotive/6ffc3239_1762826994.mp4",
            thumbnail_url: "https://pub-384ac06d34574276b20539cbf26191e2.r2.dev/test-videos/automotive/6ffc3239_1762826994.mp4",
            created_at: "2025-11-11T04:09:54Z",
            views: 0,
            likes: 0,
            favorites: 0,
            metadata: {
                duration: 23.209999084472656,
                word_count: 55,
                has_captions: true,
                ai_generated: true
            }
        }
    ];

    // Save to localStorage
    const existingAds = JSON.parse(localStorage.getItem('publishedAds') || '[]');
    
    // Check if test video already exists
    const existingIndex = existingAds.findIndex(ad => ad.id === "6ffc3239");
    
    if (existingIndex >= 0) {
        // Update existing entry with new URL
        existingAds[existingIndex] = testListings[0];
        localStorage.setItem('publishedAds', JSON.stringify(existingAds));
        console.log('🔄 Updated existing test data with new R2 URL');
        return true;
    } else {
        // Add test listings to the beginning
        const updatedAds = [...testListings, ...existingAds];
        localStorage.setItem('publishedAds', JSON.stringify(updatedAds));
        console.log('✅ Test data seeded successfully!');
        console.log(`   Added ${testListings.length} test listing(s)`);
        return true;
    }
}

// Auto-seed on page load if in development
// Allow any local network IP (192.168.x.x, 10.x.x.x, etc.) or localhost
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.startsWith('192.168.') ||
                      window.location.hostname.startsWith('10.') ||
                      window.location.hostname.startsWith('172.16.');

if (isDevelopment) {
    document.addEventListener('DOMContentLoaded', () => {
        // Always try to seed (will check for duplicates internally)
        seedTestData();
    });
}

// Expose globally for manual seeding
window.seedTestData = seedTestData;
