const sharedVideos = {
    phone: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-using-a-modern-phone-70454-large.mp4',
    laptop: 'https://assets.mixkit.co/videos/preview/mixkit-person-typing-on-a-laptop-3013-large.mp4',
    coding: 'https://assets.mixkit.co/videos/preview/mixkit-programming-coding-on-computers-3445-large.mp4',
    studio: 'https://assets.mixkit.co/videos/preview/mixkit-dj-turning-knobs-in-a-club-3024-large.mp4',
    livingRoom: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-living-room-tv-1674-large.mp4',
    smartHome: 'https://assets.mixkit.co/videos/preview/mixkit-smart-speaker-in-a-living-room-48713-large.mp4'
};

export const electronicsListings = [
    {
        id: 'iphone-15-pro-max',
        title: 'Apple iPhone 15 Pro Max 256GB - Titanium Blue',
        seller: {
            name: 'Ana Popescu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
            location: 'Bucuresti',
            posted: '3 days ago'
        },
        make: 'Apple',
        type: 'Mobile phones',
        condition: 'Like New',
        price: 1399,
        location: 'Bucuresti',
        specs: '256GB · Unlocked · Dual SIM',
        likes: 112,
        comments: 14,
        videoUrl: sharedVideos.phone,
        detailsUrl: 'details?ad=iphone-15-pro-max'
    },
    {
        id: 'samsung-galaxy-s24-ultra',
        title: 'Samsung Galaxy S24 Ultra 512GB - Titanium Gray',
        seller: {
            name: 'Mihai Cristea',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mihai',
            location: 'Cluj',
            posted: '5 days ago'
        },
        make: 'Samsung',
        type: 'Mobile phones',
        condition: 'New',
        price: 1529,
        location: 'Cluj',
        specs: '512GB · Snapdragon X Elite · 200MP Camera',
        likes: 89,
        comments: 21,
        videoUrl: sharedVideos.phone,
        detailsUrl: 'details?ad=galaxy-s24-ultra'
    },
    {
        id: 'macbook-pro-14',
        title: 'MacBook Pro 14" M3 Max · 32GB RAM · 1TB SSD',
        seller: {
            name: 'Radu Ionescu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=radu',
            location: 'Timis',
            posted: '1 day ago'
        },
        make: 'Apple',
        type: 'Computers',
        condition: 'Like New',
        price: 3299,
        location: 'Timis',
        specs: '14" · M3 Max 14-core · 32GB RAM · 1TB SSD',
        likes: 65,
        comments: 9,
        videoUrl: sharedVideos.laptop,
        detailsUrl: 'details?ad=macbook-pro-14'
    },
    {
        id: 'asus-rog-zephyrus',
        title: 'ASUS ROG Zephyrus G16 Gaming Laptop',
        seller: {
            name: 'Cezar Balan',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cezar',
            location: 'Iasi',
            posted: '7 hours ago'
        },
        make: 'ASUS',
        type: 'Computer/Laptop parts',
        condition: 'New',
        price: 2549,
        location: 'Iasi',
        specs: 'Intel Core Ultra 9 · RTX 4080 · 32GB RAM · 1TB SSD',
        likes: 48,
        comments: 6,
        videoUrl: sharedVideos.coding,
        detailsUrl: 'details?ad=asus-rog-zephyrus'
    },
    {
        id: 'sony-a7-iv',
        title: 'Sony Alpha A7 IV Mirrorless Camera Body',
        seller: {
            name: 'Oana Dumitrescu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oana',
            location: 'Brasov',
            posted: '6 days ago'
        },
        make: 'Sony',
        type: 'Gadgets, wearables & photo-video cameras',
        condition: 'Refurbished',
        price: 2199,
        location: 'Brasov',
        specs: '33MP · 4K 60fps · Real-time AF',
        likes: 77,
        comments: 11,
        videoUrl: sharedVideos.studio,
        detailsUrl: 'details?ad=sony-a7-iv'
    },
    {
        id: 'bose-quietcomfort-ultra',
        title: 'Bose QuietComfort Ultra Headphones - Black',
        seller: {
            name: 'Ioana Marin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ioana',
            location: 'Constanta',
            posted: '12 hours ago'
        },
        make: 'Bose',
        type: 'Headphones',
        condition: 'New',
        price: 429,
        location: 'Constanta',
        specs: 'Spatial Audio · 24h Battery · ANC',
        likes: 95,
        comments: 8,
        videoUrl: sharedVideos.studio,
        detailsUrl: 'details?ad=bose-quietcomfort-ultra'
    },
    {
        id: 'lg-oled-g3',
        title: 'LG OLED G3 65" 4K Smart TV',
        seller: {
            name: 'Vlad Georgescu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vlad',
            location: 'Bucuresti',
            posted: '1 week ago'
        },
        make: 'LG',
        type: 'Home cinema & audio',
        condition: 'Like New',
        price: 2799,
        location: 'Bucuresti',
        specs: '65" · OLED Evo · Dolby Vision & Atmos',
        likes: 54,
        comments: 5,
        videoUrl: sharedVideos.livingRoom,
        detailsUrl: 'details?ad=lg-oled-g3'
    },
    {
        id: 'denon-avr-x3800h',
        title: 'Denon AVR-X3800H 9.4CH A/V Receiver',
        seller: {
            name: 'Cristian Enache',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cristian',
            location: 'Bihor',
            posted: '2 days ago'
        },
        make: 'Denon',
        type: 'HiFi & professional audio',
        condition: 'Used',
        price: 1390,
        location: 'Bihor',
        specs: '9.4 Channel · 8K · Audyssey XT32',
        likes: 41,
        comments: 4,
        videoUrl: sharedVideos.studio,
        detailsUrl: 'details?ad=denon-avr-x3800h'
    },
    {
        id: 'sonos-arc-set',
        title: 'Sonos Arc + Sub (Gen 3) + Era 300 Surround Set',
        seller: {
            name: 'Laura Stan',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=laura',
            location: 'Prahova',
            posted: '4 days ago'
        },
        make: 'Sonos',
        type: 'Smarthome',
        condition: 'Like New',
        price: 1899,
        location: 'Prahova',
        specs: 'Dolby Atmos · Voice Control · WiFi 6',
        likes: 58,
        comments: 7,
        videoUrl: sharedVideos.smartHome,
        detailsUrl: 'details?ad=sonos-arc-set'
    },
    {
        id: 'dji-mini-4-pro',
        title: 'DJI Mini 4 Pro Fly More Combo',
        seller: {
            name: 'Lucian Matei',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucian',
            location: 'Suceava',
            posted: '9 hours ago'
        },
        make: 'DJI',
        type: 'Drones & accessories',
        condition: 'New',
        price: 1099,
        location: 'Suceava',
        specs: '4K HDR · Obstacle Avoidance · Remote ID Ready',
        likes: 73,
        comments: 10,
        videoUrl: sharedVideos.smartHome,
        detailsUrl: 'details?ad=dji-mini-4-pro'
    },
    {
        id: 'netgear-orbi-960',
        title: 'Netgear Orbi 960 WiFi 6E Mesh System (3-Pack)',
        seller: {
            name: 'George Lupu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=george',
            location: 'Ilfov',
            posted: '2 days ago'
        },
        make: 'Netgear',
        type: 'Networking & servers',
        condition: 'Like New',
        price: 1299,
        location: 'Ilfov',
        specs: '10.8Gbps · WiFi 6E · 3 units coverage 750m²',
        likes: 52,
        comments: 5,
        videoUrl: sharedVideos.coding,
        detailsUrl: 'details?ad=netgear-orbi-960'
    },
    {
        id: 'kindle-scribe',
        title: 'Amazon Kindle Scribe 64GB Premium Pen Bundle',
        seller: {
            name: 'Alina Grosu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alina',
            location: 'Cluj',
            posted: '3 days ago'
        },
        make: 'Amazon',
        type: 'Tablets/eReaders',
        condition: 'Like New',
        price: 469,
        location: 'Cluj',
        specs: '10.2" · Warm Light · Premium Pen Included',
        likes: 38,
        comments: 3,
        videoUrl: sharedVideos.phone,
        detailsUrl: 'details?ad=kindle-scribe'
    },
    {
        id: 'philips-800-series-purifier',
        title: 'Philips 800 Series Smart Air Purifier',
        seller: {
            name: 'Sorina Badea',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sorina',
            location: 'Arad',
            posted: '1 day ago'
        },
        make: 'Philips',
        type: 'Household items',
        condition: 'New',
        price: 229,
        location: 'Arad',
        specs: 'HEPA · App Control · Night Mode',
        likes: 44,
        comments: 4,
        videoUrl: sharedVideos.smartHome,
        detailsUrl: 'details?ad=philips-800-series-purifier'
    },
    {
        id: 'braun-series-9',
        title: 'Braun Series 9 Pro+ Wet & Dry Shaver Kit',
        seller: {
            name: 'Iulia Pavel',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iulia',
            location: 'Bucuresti',
            posted: '5 hours ago'
        },
        make: 'Braun',
        type: 'Personal care',
        condition: 'New',
        price: 359,
        location: 'Bucuresti',
        specs: 'Sonic Technology · PowerCase · 100% Waterproof',
        likes: 29,
        comments: 2,
        videoUrl: sharedVideos.smartHome,
        detailsUrl: 'details?ad=braun-series-9'
    },
    {
        id: 'epson-ecotank-pro',
        title: 'Epson EcoTank Pro ET-5850 A3 Inkjet Printer',
        seller: {
            name: 'Marius Dima',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marius',
            location: 'Sibiu',
            posted: '4 days ago'
        },
        make: 'Epson',
        type: 'Printers & scanners',
        condition: 'Used',
        price: 799,
        location: 'Sibiu',
        specs: 'A3 · 24 ppm · WiFi · 12k pages included ink',
        likes: 33,
        comments: 5,
        videoUrl: sharedVideos.laptop,
        detailsUrl: 'details?ad=epson-ecotank-pro'
    },
    {
        id: 'anker-magsafe-pack',
        title: 'Anker MagGo 10K MagSafe Power Bank',
        seller: {
            name: 'Tudor Ene',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tudor',
            location: 'Ilfov',
            posted: '8 hours ago'
        },
        make: 'Anker',
        type: 'Phone & tablet accessories',
        condition: 'Like New',
        price: 99,
        location: 'Ilfov',
        specs: '10,000 mAh · 15W MagSafe · Foldable Stand',
        likes: 57,
        comments: 6,
        videoUrl: sharedVideos.phone,
        detailsUrl: 'details?ad=anker-magsafe-pack'
    },
    {
        id: 'ifixit-pro-tech',
        title: 'iFixit Pro Tech Toolkit 2025 Edition',
        seller: {
            name: 'Daniel Muntean',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel',
            location: 'Cluj',
            posted: '3 days ago'
        },
        make: 'iFixit',
        type: 'Phone and tablet parts',
        condition: 'Like New',
        price: 94,
        location: 'Cluj',
        specs: '64 Bits · Anti-static Tools · Lifetime Warranty',
        likes: 46,
        comments: 5,
        videoUrl: sharedVideos.coding,
        detailsUrl: 'details?ad=ifixit-pro-tech'
    },
    {
        id: 'samsung-990-pro',
        title: 'Samsung 990 Pro 2TB NVMe SSD with Heatsink',
        seller: {
            name: 'Alexandru Cazan',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexandru',
            location: 'Brasov',
            posted: '2 days ago'
        },
        make: 'Samsung',
        type: 'Computer/Laptop parts',
        condition: 'New',
        price: 249,
        location: 'Brasov',
        specs: 'PCIe 4.0 · 7,450 MB/s Read · PS5 Ready',
        likes: 51,
        comments: 4,
        videoUrl: sharedVideos.coding,
        detailsUrl: 'details?ad=samsung-990-pro'
    },
    {
        id: 'xgimi-horizon-pro',
        title: 'XGIMI Horizon Pro 4K Android TV Projector',
        seller: {
            name: 'Claudiu Iancu',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=claudiu',
            location: 'Timis',
            posted: '6 days ago'
        },
        make: 'XGIMI',
        type: 'Video projectors & accessories',
        condition: 'Used',
        price: 1290,
        location: 'Timis',
        specs: '2200 ANSI · Auto Keystone · Harman Kardon Audio',
        likes: 39,
        comments: 3,
        videoUrl: sharedVideos.livingRoom,
        detailsUrl: 'details?ad=xgimi-horizon-pro'
    }
];

export const electronicsCategories = [
    'Mobile phones',
    'Household items',
    'Tablets/eReaders',
    'Video projectors & accessories',
    'Networking & servers',
    'Phone and tablet parts',
    'Computers',
    'Personal care',
    'Printers & scanners',
    'Home cinema & audio',
    'Gadgets, wearables & photo-video cameras',
    'Drones & accessories',
    'Computer/Laptop parts',
    'Headphones',
    'Smarthome',
    'HiFi & professional audio',
    'Phone & tablet accessories'
];

export const electronicsConditions = [
    'New',
    'Like New',
    'Refurbished',
    'Used',
    'For Parts'
];
