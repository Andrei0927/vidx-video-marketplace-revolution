/**
 * Sports & Fitness Filter Schema
 * For vidx-video-marketplace-revolution
 * Inspired by Decathlon, SportsDirect, eBay Sports patterns
 */

const sportsFilterSchema = {
    // Main category structure
    categories: {
        type: 'dropdown',
        label: 'Category',
        width: 'full',
        alwaysVisible: true,
        options: [
            { id: 'all', value: '', label: '⚽ Choose Category - All Sports' },
            { id: 'team-sports', value: 'Team Sports', label: '⚽ Team Sports' },
            { id: 'fitness', value: 'Fitness & Gym', label: '💪 Fitness & Gym' },
            { id: 'outdoor', value: 'Outdoor Sports', label: '🏔️ Outdoor Sports' },
            { id: 'water-sports', value: 'Water Sports', label: '🏊 Water Sports' },
            { id: 'winter-sports', value: 'Winter Sports', label: '⛷️ Winter Sports' },
            { id: 'cycling', value: 'Cycling', label: '🚴 Cycling' },
            { id: 'running', value: 'Running & Athletics', label: '🏃 Running & Athletics' },
            { id: 'racket-sports', value: 'Racket Sports', label: '🎾 Racket Sports' },
            { id: 'combat-sports', value: 'Combat Sports', label: '🥊 Combat Sports' },
            { id: 'golf', value: 'Golf', label: '⛳ Golf' },
            { id: 'extreme-sports', value: 'Extreme Sports', label: '🛹 Extreme Sports' }
        ]
    },

    // Sport Type (Sub-category)
    sportType: {
        type: 'dropdown',
        label: 'Sport Type',
        required: false,
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' },
            // Team Sports
            { value: 'Football/Soccer', label: 'Football / Soccer' },
            { value: 'Basketball', label: 'Basketball' },
            { value: 'Volleyball', label: 'Volleyball' },
            { value: 'Rugby', label: 'Rugby' },
            { value: 'Baseball', label: 'Baseball' },
            { value: 'Handball', label: 'Handball' },
            { value: 'Hockey', label: 'Hockey' },
            // Fitness
            { value: 'Gym Equipment', label: 'Gym Equipment' },
            { value: 'Weights', label: 'Weights & Dumbbells' },
            { value: 'Cardio', label: 'Cardio Equipment' },
            { value: 'Yoga', label: 'Yoga & Pilates' },
            { value: 'CrossFit', label: 'CrossFit' },
            // Outdoor
            { value: 'Hiking', label: 'Hiking & Trekking' },
            { value: 'Camping', label: 'Camping' },
            { value: 'Climbing', label: 'Climbing' },
            { value: 'Fishing', label: 'Fishing' },
            { value: 'Hunting', label: 'Hunting' },
            // Water Sports
            { value: 'Swimming', label: 'Swimming' },
            { value: 'Surfing', label: 'Surfing' },
            { value: 'Diving', label: 'Diving' },
            { value: 'Kayaking', label: 'Kayaking / Canoeing' },
            { value: 'Stand-Up Paddle', label: 'Stand-Up Paddle' },
            // Winter Sports
            { value: 'Skiing', label: 'Skiing' },
            { value: 'Snowboarding', label: 'Snowboarding' },
            { value: 'Ice Skating', label: 'Ice Skating' },
            // Cycling
            { value: 'Road Cycling', label: 'Road Cycling' },
            { value: 'Mountain Biking', label: 'Mountain Biking' },
            { value: 'BMX', label: 'BMX' },
            { value: 'E-Bikes', label: 'E-Bikes' },
            // Racket Sports
            { value: 'Tennis', label: 'Tennis' },
            { value: 'Badminton', label: 'Badminton' },
            { value: 'Squash', label: 'Squash' },
            { value: 'Table Tennis', label: 'Table Tennis' },
            // Combat Sports
            { value: 'Boxing', label: 'Boxing' },
            { value: 'MMA', label: 'MMA' },
            { value: 'Martial Arts', label: 'Martial Arts' },
            { value: 'Wrestling', label: 'Wrestling' },
            // Extreme
            { value: 'Skateboarding', label: 'Skateboarding' },
            { value: 'Scooter', label: 'Scooter' },
            { value: 'Rollerblading', label: 'Rollerblading' },
            { value: 'Parkour', label: 'Parkour' }
        ]
    },

    // Price Range
    price: {
        type: 'range',
        label: 'Price',
        width: 'half',
        alwaysVisible: true,
        currency: {
            default: 'EUR',
            options: ['EUR', 'USD', 'RON', 'GBP']
        },
        range: {
            min: 0,
            max: 5000,
            step: 10,
            unit: '€'
        },
        inputs: {
            from: { placeholder: 'Min price', id: 'price-from' },
            to: { placeholder: 'Max price', id: 'price-to' }
        }
    },

    // Condition
    condition: {
        type: 'dropdown',
        label: 'Condition',
        width: 'half',
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'New', label: 'Brand New' },
            { value: 'Like New', label: 'Like New' },
            { value: 'Excellent', label: 'Excellent' },
            { value: 'Good', label: 'Good' },
            { value: 'Fair', label: 'Fair' },
            { value: 'For Parts', label: 'For Parts/Repair' }
        ]
    },

    // Location
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'City or region...',
        alwaysVisible: true,
        helpText: 'Enter city, region, or postal code'
    },

    // Brand
    brand: {
        type: 'dropdown',
        label: 'Brand',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            // Major Sports Brands
            { value: 'Nike', label: 'Nike' },
            { value: 'Adidas', label: 'Adidas' },
            { value: 'Puma', label: 'Puma' },
            { value: 'Under Armour', label: 'Under Armour' },
            { value: 'Reebok', label: 'Reebok' },
            { value: 'New Balance', label: 'New Balance' },
            { value: 'Asics', label: 'Asics' },
            // Outdoor Brands
            { value: 'The North Face', label: 'The North Face' },
            { value: 'Patagonia', label: 'Patagonia' },
            { value: 'Columbia', label: 'Columbia' },
            { value: 'Arc\'teryx', label: 'Arc\'teryx' },
            { value: 'Salomon', label: 'Salomon' },
            { value: 'Mammut', label: 'Mammut' },
            // Cycling Brands
            { value: 'Specialized', label: 'Specialized' },
            { value: 'Trek', label: 'Trek' },
            { value: 'Giant', label: 'Giant' },
            { value: 'Cannondale', label: 'Cannondale' },
            { value: 'Scott', label: 'Scott' },
            { value: 'Shimano', label: 'Shimano' },
            // Fitness Brands
            { value: 'Technogym', label: 'Technogym' },
            { value: 'Life Fitness', label: 'Life Fitness' },
            { value: 'Bowflex', label: 'Bowflex' },
            { value: 'NordicTrack', label: 'NordicTrack' },
            { value: 'Peloton', label: 'Peloton' },
            { value: 'Rogue', label: 'Rogue Fitness' },
            // Water Sports
            { value: 'Speedo', label: 'Speedo' },
            { value: 'Arena', label: 'Arena' },
            { value: 'Rip Curl', label: 'Rip Curl' },
            { value: 'Quiksilver', label: 'Quiksilver' },
            // Winter Sports
            { value: 'Rossignol', label: 'Rossignol' },
            { value: 'Atomic', label: 'Atomic' },
            { value: 'Burton', label: 'Burton' },
            { value: 'K2', label: 'K2' },
            // Golf
            { value: 'Callaway', label: 'Callaway' },
            { value: 'TaylorMade', label: 'TaylorMade' },
            { value: 'Titleist', label: 'Titleist' },
            { value: 'Ping', label: 'Ping' },
            // Racket Sports
            { value: 'Wilson', label: 'Wilson' },
            { value: 'Head', label: 'Head' },
            { value: 'Babolat', label: 'Babolat' },
            { value: 'Yonex', label: 'Yonex' },
            { value: 'Other', label: 'Other' }
        ]
    },

    // Size (for clothing & shoes)
    size: {
        type: 'dropdown',
        label: 'Size',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            // Clothing
            { value: 'XS', label: 'XS' },
            { value: 'S', label: 'S' },
            { value: 'M', label: 'M' },
            { value: 'L', label: 'L' },
            { value: 'XL', label: 'XL' },
            { value: 'XXL', label: 'XXL' },
            { value: 'XXXL', label: 'XXXL' },
            // Shoes (EU sizes)
            { value: '35-37', label: 'EU 35-37' },
            { value: '38-40', label: 'EU 38-40' },
            { value: '41-43', label: 'EU 41-43' },
            { value: '44-46', label: 'EU 44-46' },
            { value: '47+', label: 'EU 47+' }
        ]
    },

    // Gender
    gender: {
        type: 'radio',
        label: 'Gender',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Men', label: 'Men' },
            { value: 'Women', label: 'Women' },
            { value: 'Unisex', label: 'Unisex' },
            { value: 'Kids', label: 'Kids' }
        ]
    },

    // Color
    color: {
        type: 'multi-select',
        label: 'Color',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Black', label: 'Black' },
            { value: 'White', label: 'White' },
            { value: 'Red', label: 'Red' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Green', label: 'Green' },
            { value: 'Yellow', label: 'Yellow' },
            { value: 'Orange', label: 'Orange' },
            { value: 'Pink', label: 'Pink' },
            { value: 'Purple', label: 'Purple' },
            { value: 'Grey', label: 'Grey' },
            { value: 'Navy', label: 'Navy' },
            { value: 'Multicolor', label: 'Multicolor' }
        ]
    },

    // Material
    material: {
        type: 'multi-select',
        label: 'Material',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Cotton', label: 'Cotton' },
            { value: 'Polyester', label: 'Polyester' },
            { value: 'Nylon', label: 'Nylon' },
            { value: 'Spandex', label: 'Spandex / Lycra' },
            { value: 'Mesh', label: 'Mesh' },
            { value: 'Gore-Tex', label: 'Gore-Tex' },
            { value: 'Leather', label: 'Leather' },
            { value: 'Synthetic', label: 'Synthetic' },
            { value: 'Merino Wool', label: 'Merino Wool' },
            { value: 'Carbon Fiber', label: 'Carbon Fiber' },
            { value: 'Aluminum', label: 'Aluminum' },
            { value: 'Steel', label: 'Steel' }
        ]
    },

    // Product Type
    productType: {
        type: 'multi-select',
        label: 'Product Type',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Clothing', label: 'Clothing / Apparel' },
            { value: 'Footwear', label: 'Footwear / Shoes' },
            { value: 'Equipment', label: 'Equipment' },
            { value: 'Accessories', label: 'Accessories' },
            { value: 'Protective Gear', label: 'Protective Gear' },
            { value: 'Bags', label: 'Bags & Backpacks' },
            { value: 'Nutrition', label: 'Nutrition & Supplements' },
            { value: 'Electronics', label: 'Electronics & Gadgets' }
        ]
    },

    // Features
    features: {
        type: 'multi-select',
        label: 'Features',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Waterproof', label: 'Waterproof / Water Resistant' },
            { value: 'Breathable', label: 'Breathable' },
            { value: 'Lightweight', label: 'Lightweight' },
            { value: 'Windproof', label: 'Windproof' },
            { value: 'UV Protection', label: 'UV Protection' },
            { value: 'Reflective', label: 'Reflective' },
            { value: 'Quick-Dry', label: 'Quick-Dry' },
            { value: 'Thermal', label: 'Thermal / Insulated' },
            { value: 'Adjustable', label: 'Adjustable' },
            { value: 'Foldable', label: 'Foldable / Portable' },
            { value: 'GPS', label: 'GPS Enabled' },
            { value: 'Bluetooth', label: 'Bluetooth' },
            { value: 'Heart Rate Monitor', label: 'Heart Rate Monitor' }
        ]
    },

    // Level
    skillLevel: {
        type: 'radio',
        label: 'Skill Level',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Beginner', label: 'Beginner / Entry Level' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Advanced', label: 'Advanced / Expert' },
            { value: 'Professional', label: 'Professional' }
        ]
    },

    // Age Group
    ageGroup: {
        type: 'multi-select',
        label: 'Age Group',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Kids (3-7)', label: 'Kids (3-7 years)' },
            { value: 'Junior (8-14)', label: 'Junior (8-14 years)' },
            { value: 'Teen (15-17)', label: 'Teen (15-17 years)' },
            { value: 'Adult (18+)', label: 'Adult (18+ years)' },
            { value: 'Senior (60+)', label: 'Senior (60+ years)' }
        ]
    },

    // Seller Type
    sellerType: {
        type: 'radio',
        label: 'Seller Type',
        collapsible: true,
        options: [
            { value: '', label: 'All' },
            { value: 'private', label: 'Private Seller' },
            { value: 'dealer', label: 'Retailer / Sports Shop' }
        ]
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sportsFilterSchema;
}

if (typeof window !== 'undefined') {
    window.sportsFilterSchema = sportsFilterSchema;
}
