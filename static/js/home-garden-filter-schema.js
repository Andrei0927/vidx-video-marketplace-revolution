/**
 * Home & Garden Filter Schema
 * For vidx-video-marketplace-revolution
 * Professional home and garden marketplace filter system
 */

const homeGardenFilterSchema = {
    // Main category structure
    categories: {
        type: 'dropdown',
        label: 'Category',
        width: 'full',
        alwaysVisible: true,
        options: [
            { id: 'all', value: '', label: '🏠 Choose Category - All Home & Garden' },
            { id: 'furniture', value: 'Furniture', label: '🛋️ Furniture' },
            { id: 'garden', value: 'Garden & Outdoor', label: '🌳 Garden & Outdoor' },
            { id: 'decor', value: 'Decor & Accessories', label: '🖼️ Decor & Accessories' },
            { id: 'lighting', value: 'Lighting', label: '💡 Lighting' },
            { id: 'tools', value: 'Tools & Equipment', label: '🔧 Tools & Equipment' },
            { id: 'textiles', value: 'Textiles & Fabrics', label: '🛏️ Textiles & Fabrics' },
            { id: 'storage', value: 'Storage & Organization', label: '📦 Storage & Organization' },
            { id: 'kitchen', value: 'Kitchen & Dining', label: '🍽️ Kitchen & Dining' },
            { id: 'bathroom', value: 'Bathroom', label: '🚿 Bathroom' },
            { id: 'building', value: 'Building Materials', label: '🧱 Building Materials' }
        ]
    },

    // Sub-category (Room/Type)
    room: {
        type: 'dropdown',
        label: 'Room / Type',
        required: false,
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' },
            // Furniture rooms
            { value: 'Living Room', label: 'Living Room' },
            { value: 'Bedroom', label: 'Bedroom' },
            { value: 'Dining Room', label: 'Dining Room' },
            { value: 'Kitchen', label: 'Kitchen' },
            { value: 'Bathroom', label: 'Bathroom' },
            { value: 'Home Office', label: 'Home Office' },
            { value: 'Kids Room', label: 'Kids Room' },
            { value: 'Hallway', label: 'Hallway / Entryway' },
            { value: 'Outdoor', label: 'Outdoor / Garden' },
            { value: 'Garage', label: 'Garage / Workshop' }
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

    // Brand (for furniture, appliances, tools)
    brand: {
        type: 'dropdown',
        label: 'Brand',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            // Furniture brands
            { value: 'IKEA', label: 'IKEA' },
            { value: 'Wayfair', label: 'Wayfair' },
            { value: 'Ashley Furniture', label: 'Ashley Furniture' },
            { value: 'West Elm', label: 'West Elm' },
            { value: 'Crate & Barrel', label: 'Crate & Barrel' },
            { value: 'Restoration Hardware', label: 'Restoration Hardware' },
            { value: 'Pottery Barn', label: 'Pottery Barn' },
            { value: 'CB2', label: 'CB2' },
            { value: 'Article', label: 'Article' },
            { value: 'Jysk', label: 'Jysk' },
            { value: 'BoConcept', label: 'BoConcept' },
            { value: 'Agata Meble', label: 'Agata Meble' },
            // Tool brands
            { value: 'Bosch', label: 'Bosch' },
            { value: 'Makita', label: 'Makita' },
            { value: 'DeWalt', label: 'DeWalt' },
            { value: 'Black & Decker', label: 'Black & Decker' },
            { value: 'Milwaukee', label: 'Milwaukee' },
            { value: 'Ryobi', label: 'Ryobi' },
            { value: 'Husqvarna', label: 'Husqvarna' },
            { value: 'Stihl', label: 'Stihl' },
            { value: 'Parkside', label: 'Parkside' },
            // Lighting brands
            { value: 'Philips', label: 'Philips' },
            { value: 'Osram', label: 'Osram' },
            { value: 'GE', label: 'GE Lighting' },
            { value: 'Other', label: 'Other' }
        ]
    },

    // Material (for furniture, decor)
    material: {
        type: 'multi-select',
        label: 'Material',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Wood', label: 'Wood / Wooden' },
            { value: 'Metal', label: 'Metal' },
            { value: 'Plastic', label: 'Plastic' },
            { value: 'Glass', label: 'Glass' },
            { value: 'Fabric', label: 'Fabric / Upholstered' },
            { value: 'Leather', label: 'Leather' },
            { value: 'Rattan', label: 'Rattan / Wicker' },
            { value: 'Marble', label: 'Marble' },
            { value: 'Concrete', label: 'Concrete' },
            { value: 'Ceramic', label: 'Ceramic' },
            { value: 'Stone', label: 'Stone' },
            { value: 'Bamboo', label: 'Bamboo' }
        ]
    },

    // Style
    style: {
        type: 'multi-select',
        label: 'Style',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Modern', label: 'Modern / Contemporary' },
            { value: 'Scandinavian', label: 'Scandinavian' },
            { value: 'Industrial', label: 'Industrial' },
            { value: 'Rustic', label: 'Rustic / Farmhouse' },
            { value: 'Mid-Century', label: 'Mid-Century Modern' },
            { value: 'Minimalist', label: 'Minimalist' },
            { value: 'Traditional', label: 'Traditional / Classic' },
            { value: 'Vintage', label: 'Vintage / Retro' },
            { value: 'Art Deco', label: 'Art Deco' },
            { value: 'Bohemian', label: 'Bohemian' },
            { value: 'Coastal', label: 'Coastal / Beach' },
            { value: 'Eclectic', label: 'Eclectic' }
        ]
    },

    // Color
    color: {
        type: 'multi-select',
        label: 'Color',
        collapsible: true,
        optional: true,
        options: [
            { value: 'White', label: 'White / Off-White' },
            { value: 'Black', label: 'Black' },
            { value: 'Grey', label: 'Grey' },
            { value: 'Brown', label: 'Brown / Wood Tone' },
            { value: 'Beige', label: 'Beige / Cream' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Green', label: 'Green' },
            { value: 'Yellow', label: 'Yellow' },
            { value: 'Red', label: 'Red' },
            { value: 'Orange', label: 'Orange' },
            { value: 'Pink', label: 'Pink' },
            { value: 'Purple', label: 'Purple' },
            { value: 'Gold', label: 'Gold / Brass' },
            { value: 'Silver', label: 'Silver / Chrome' },
            { value: 'Multicolor', label: 'Multicolor / Patterned' }
        ]
    },

    // Size/Dimensions
    size: {
        type: 'dropdown',
        label: 'Size',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Small', label: 'Small (< 100cm)' },
            { value: 'Medium', label: 'Medium (100-200cm)' },
            { value: 'Large', label: 'Large (200-300cm)' },
            { value: 'Extra Large', label: 'Extra Large (> 300cm)' }
        ]
    },

    // Assembly Required
    assembly: {
        type: 'radio',
        label: 'Assembly',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'assembled', label: 'Already Assembled' },
            { value: 'required', label: 'Assembly Required' },
            { value: 'easy', label: 'Easy Assembly' }
        ]
    },

    // For Garden & Outdoor
    weatherResistant: {
        type: 'radio',
        label: 'Weather Resistant',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'yes', label: 'Weather Resistant' },
            { value: 'no', label: 'Indoor Only' }
        ]
    },

    // For Tools
    powerType: {
        type: 'multi-select',
        label: 'Power Type',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Electric', label: 'Electric (Corded)' },
            { value: 'Battery', label: 'Battery / Cordless' },
            { value: 'Gas', label: 'Gas / Petrol' },
            { value: 'Manual', label: 'Manual / Hand Tool' }
        ]
    },

    // Delivery Options
    delivery: {
        type: 'multi-select',
        label: 'Delivery',
        collapsible: true,
        optional: true,
        options: [
            { value: 'pickup', label: 'Local Pickup Only' },
            { value: 'delivery', label: 'Delivery Available' },
            { value: 'shipping', label: 'Shipping Nationwide' },
            { value: 'assembly', label: 'Assembly Service' }
        ]
    },

    // Special Features
    features: {
        type: 'multi-select',
        label: 'Features',
        collapsible: true,
        optional: true,
        options: [
            { value: 'storage', label: 'With Storage' },
            { value: 'foldable', label: 'Foldable / Collapsible' },
            { value: 'adjustable', label: 'Adjustable' },
            { value: 'extendable', label: 'Extendable' },
            { value: 'convertible', label: 'Convertible / Multi-Use' },
            { value: 'eco-friendly', label: 'Eco-Friendly / Sustainable' },
            { value: 'handmade', label: 'Handmade / Artisan' },
            { value: 'smart', label: 'Smart / Connected' },
            { value: 'waterproof', label: 'Waterproof' },
            { value: 'fire-resistant', label: 'Fire Resistant' }
        ]
    },

    // Furniture Specific - Seating Capacity
    seatingCapacity: {
        type: 'dropdown',
        label: 'Seating Capacity',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: '1', label: '1 person' },
            { value: '2', label: '2 people' },
            { value: '3-4', label: '3-4 people' },
            { value: '5-6', label: '5-6 people' },
            { value: '7+', label: '7+ people' }
        ]
    },

    // For Beds & Mattresses
    bedSize: {
        type: 'dropdown',
        label: 'Bed Size',
        collapsible: true,
        optional: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'Single', label: 'Single (90x200cm)' },
            { value: 'Twin', label: 'Twin (100x200cm)' },
            { value: 'Double', label: 'Double (140x200cm)' },
            { value: 'Queen', label: 'Queen (160x200cm)' },
            { value: 'King', label: 'King (180x200cm)' },
            { value: 'Super King', label: 'Super King (200x200cm)' }
        ]
    },

    // Lighting Type
    lightingType: {
        type: 'multi-select',
        label: 'Lighting Type',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Ceiling', label: 'Ceiling / Chandelier' },
            { value: 'Pendant', label: 'Pendant' },
            { value: 'Floor Lamp', label: 'Floor Lamp' },
            { value: 'Table Lamp', label: 'Table Lamp' },
            { value: 'Wall Sconce', label: 'Wall Sconce' },
            { value: 'LED Strip', label: 'LED Strip' },
            { value: 'Outdoor', label: 'Outdoor / Garden' },
            { value: 'Smart Bulb', label: 'Smart Bulb' }
        ]
    },

    // Garden Equipment Type
    gardenEquipment: {
        type: 'multi-select',
        label: 'Garden Equipment',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Lawn Mower', label: 'Lawn Mower' },
            { value: 'Trimmer', label: 'Trimmer / Edger' },
            { value: 'Chainsaw', label: 'Chainsaw' },
            { value: 'Leaf Blower', label: 'Leaf Blower' },
            { value: 'Hedge Trimmer', label: 'Hedge Trimmer' },
            { value: 'Pressure Washer', label: 'Pressure Washer' },
            { value: 'Garden Tools', label: 'Hand Garden Tools' },
            { value: 'Wheelbarrow', label: 'Wheelbarrow / Cart' }
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
            { value: 'dealer', label: 'Retailer / Company' }
        ]
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = homeGardenFilterSchema;
}

if (typeof window !== 'undefined') {
    window.homeGardenFilterSchema = homeGardenFilterSchema;
}
