/**
 * Electronics & Technology Filter Schema
 * For vidx-video-marketplace-revolution
 * Professional electronics marketplace filter system
 */

const electronicsFilterSchema = {
    // Main category structure
    categories: {
        type: 'dropdown',
        label: 'Category',
        width: 'full',
        alwaysVisible: true,
        options: [
            { id: 'all', value: '', label: '📱 Choose Category - All Electronics' },
            { id: 'phones', value: 'Phones & Tablets', label: '📱 Phones & Tablets' },
            { id: 'computers', value: 'Computers & Laptops', label: '💻 Computers & Laptops' },
            { id: 'tv-audio', value: 'TV & Audio', label: '📺 TV & Audio' },
            { id: 'cameras', value: 'Cameras & Photography', label: '📷 Cameras & Photography' },
            { id: 'gaming', value: 'Gaming & Consoles', label: '🎮 Gaming & Consoles' },
            { id: 'wearables', value: 'Wearables & Smart Devices', label: '⌚ Wearables & Smart Devices' },
            { id: 'accessories', value: 'Accessories & Parts', label: '🔌 Accessories & Parts' },
            { id: 'appliances', value: 'Home Appliances', label: '🏠 Home Appliances' }
        ]
    },

    // Brand
    brand: {
        type: 'dropdown',
        label: 'Brand',
        required: false,
        alwaysVisible: true,
        options: [
            { value: '', label: 'Any' },
            // Phones & Tablets
            { value: 'Apple', label: 'Apple' },
            { value: 'Samsung', label: 'Samsung' },
            { value: 'Xiaomi', label: 'Xiaomi' },
            { value: 'Huawei', label: 'Huawei' },
            { value: 'OnePlus', label: 'OnePlus' },
            { value: 'Google', label: 'Google' },
            { value: 'Oppo', label: 'Oppo' },
            { value: 'Vivo', label: 'Vivo' },
            { value: 'Realme', label: 'Realme' },
            { value: 'Motorola', label: 'Motorola' },
            { value: 'Nokia', label: 'Nokia' },
            { value: 'Sony', label: 'Sony' },
            // Computers
            { value: 'Dell', label: 'Dell' },
            { value: 'HP', label: 'HP' },
            { value: 'Lenovo', label: 'Lenovo' },
            { value: 'Asus', label: 'Asus' },
            { value: 'Acer', label: 'Acer' },
            { value: 'MSI', label: 'MSI' },
            { value: 'Microsoft', label: 'Microsoft' },
            // TV & Audio
            { value: 'LG', label: 'LG' },
            { value: 'Philips', label: 'Philips' },
            { value: 'Panasonic', label: 'Panasonic' },
            { value: 'Bose', label: 'Bose' },
            { value: 'JBL', label: 'JBL' },
            { value: 'Harman Kardon', label: 'Harman Kardon' },
            // Gaming
            { value: 'Nintendo', label: 'Nintendo' },
            { value: 'PlayStation', label: 'PlayStation' },
            { value: 'Xbox', label: 'Xbox' },
            { value: 'Razer', label: 'Razer' },
            { value: 'Logitech', label: 'Logitech' },
            // Cameras
            { value: 'Canon', label: 'Canon' },
            { value: 'Nikon', label: 'Nikon' },
            { value: 'Fujifilm', label: 'Fujifilm' },
            { value: 'Olympus', label: 'Olympus' },
            { value: 'GoPro', label: 'GoPro' },
            { value: 'DJI', label: 'DJI' },
            { value: 'Other', label: 'Other' }
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
            max: 10000,
            step: 50,
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
            { value: 'For Parts', label: 'For Parts/Not Working' }
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

    // Model (text input for electronics)
    model: {
        type: 'text',
        label: 'Model',
        placeholder: 'e.g., iPhone 15 Pro, Galaxy S24',
        collapsible: true,
        optional: true
    },

    // Warranty
    warranty: {
        type: 'radio',
        label: 'Warranty',
        collapsible: true,
        options: [
            { value: '', label: 'Any' },
            { value: 'yes', label: 'With Warranty' },
            { value: 'no', label: 'No Warranty' }
        ]
    },

    // Storage (for phones, tablets, laptops)
    storage: {
        type: 'multi-select',
        label: 'Storage',
        collapsible: true,
        optional: true,
        options: [
            { value: '64GB', label: '64 GB' },
            { value: '128GB', label: '128 GB' },
            { value: '256GB', label: '256 GB' },
            { value: '512GB', label: '512 GB' },
            { value: '1TB', label: '1 TB' },
            { value: '2TB', label: '2 TB+' }
        ]
    },

    // RAM (for computers, phones)
    ram: {
        type: 'multi-select',
        label: 'RAM',
        collapsible: true,
        optional: true,
        options: [
            { value: '4GB', label: '4 GB' },
            { value: '6GB', label: '6 GB' },
            { value: '8GB', label: '8 GB' },
            { value: '12GB', label: '12 GB' },
            { value: '16GB', label: '16 GB' },
            { value: '32GB', label: '32 GB+' }
        ]
    },

    // Screen Size (for phones, tablets, TVs, laptops)
    screenSize: {
        type: 'range',
        label: 'Screen Size (inches)',
        collapsible: true,
        optional: true,
        range: {
            min: 4,
            max: 100,
            step: 1,
            unit: '"'
        },
        inputs: {
            from: { placeholder: 'Min', id: 'screen-from' },
            to: { placeholder: 'Max', id: 'screen-to' }
        }
    },

    // Color
    color: {
        type: 'multi-select',
        label: 'Color',
        collapsible: true,
        options: [
            { value: 'Black', label: 'Black' },
            { value: 'White', label: 'White' },
            { value: 'Silver', label: 'Silver' },
            { value: 'Grey', label: 'Grey / Space Grey' },
            { value: 'Gold', label: 'Gold' },
            { value: 'Rose Gold', label: 'Rose Gold' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Green', label: 'Green' },
            { value: 'Red', label: 'Red' },
            { value: 'Purple', label: 'Purple' },
            { value: 'Pink', label: 'Pink' },
            { value: 'Other', label: 'Other' }
        ]
    },

    // Connectivity (for various devices)
    connectivity: {
        type: 'multi-select',
        label: 'Connectivity',
        collapsible: true,
        optional: true,
        options: [
            { value: '5G', label: '5G' },
            { value: '4G/LTE', label: '4G / LTE' },
            { value: 'WiFi 6', label: 'WiFi 6' },
            { value: 'Bluetooth', label: 'Bluetooth' },
            { value: 'NFC', label: 'NFC' },
            { value: 'USB-C', label: 'USB-C' },
            { value: 'HDMI', label: 'HDMI' }
        ]
    },

    // Features
    features: {
        type: 'multi-select',
        label: 'Features',
        collapsible: true,
        optional: true,
        options: [
            { value: 'unlocked', label: 'Unlocked' },
            { value: 'dual-sim', label: 'Dual SIM' },
            { value: 'waterproof', label: 'Water Resistant' },
            { value: 'fast-charging', label: 'Fast Charging' },
            { value: 'wireless-charging', label: 'Wireless Charging' },
            { value: 'touchscreen', label: 'Touchscreen' },
            { value: 'backlit-keyboard', label: 'Backlit Keyboard' },
            { value: 'fingerprint', label: 'Fingerprint Sensor' },
            { value: 'face-recognition', label: 'Face Recognition' }
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
    },

    // Location
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'e.g., București, Cluj-Napoca',
        optional: true
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = electronicsFilterSchema;
}

if (typeof window !== 'undefined') {
    window.electronicsFilterSchema = electronicsFilterSchema;
}
