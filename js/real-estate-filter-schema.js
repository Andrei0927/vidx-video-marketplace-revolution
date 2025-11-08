const realEstateFilterSchema = {
    // Property Type - Always visible dropdown
    propertyType: {
        type: 'dropdown',
        label: 'Property Type',
        width: 'full',
        alwaysVisible: true,
        options: [
            { id: 'all', value: '', label: '🏠 All Property Types' },
            { id: 'apartment', value: 'Apartment', label: '🏢 Apartment' },
            { id: 'house', value: 'House', label: '🏡 House' },
            { id: 'villa', value: 'Villa', label: '🏰 Villa' },
            { id: 'studio', value: 'Studio', label: '🚪 Studio' },
            { id: 'penthouse', value: 'Penthouse', label: '🌆 Penthouse' },
            { id: 'duplex', value: 'Duplex', label: '🏘️ Duplex' },
            { id: 'land', value: 'Land', label: '🌳 Land/Plot' },
            { id: 'commercial', value: 'Commercial', label: '🏪 Commercial' },
            { id: 'office', value: 'Office', label: '🏢 Office Space' },
            { id: 'warehouse', value: 'Warehouse', label: '🏭 Warehouse' },
            { id: 'garage', value: 'Garage', label: '🚗 Garage/Parking' }
        ]
    },

    // Listing Type - Always visible
    listingType: {
        type: 'radio',
        label: 'Listing Type',
        width: 'full',
        alwaysVisible: true,
        options: [
            { value: '', label: 'All' },
            { value: 'For Sale', label: 'For Sale' },
            { value: 'For Rent', label: 'For Rent' }
        ]
    },

    // Price Range - Always visible
    priceRange: {
        type: 'range',
        label: 'Price Range (€)',
        width: 'full',
        alwaysVisible: true,
        range: {
            min: 0,
            max: 2000000,
            step: 10000,
            unit: '€'
        },
        inputs: {
            from: { placeholder: 'Min price', id: 'price-from' },
            to: { placeholder: 'Max price', id: 'price-to' }
        }
    },

    // Location - Always visible
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'City, neighborhood, or address',
        width: 'full',
        alwaysVisible: true
    },

    // Bedrooms - Collapsible
    bedrooms: {
        type: 'dropdown',
        label: 'Bedrooms',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'Studio', label: 'Studio' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5+', label: '5+' }
        ]
    },

    // Bathrooms - Collapsible
    bathrooms: {
        type: 'dropdown',
        label: 'Bathrooms',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4+', label: '4+' }
        ]
    },

    // Area (sqm) - Collapsible
    area: {
        type: 'range',
        label: 'Area (m²)',
        width: 'full',
        range: {
            min: 0,
            max: 500,
            step: 10,
            unit: 'm²'
        },
        inputs: {
            from: { placeholder: 'Min area', id: 'area-from' },
            to: { placeholder: 'Max area', id: 'area-to' }
        }
    },

    // Floor - Collapsible
    floor: {
        type: 'dropdown',
        label: 'Floor',
        width: 'half',
        options: [
            { value: '', label: 'Any Floor' },
            { value: 'Ground', label: 'Ground Floor' },
            { value: '1', label: '1st Floor' },
            { value: '2', label: '2nd Floor' },
            { value: '3', label: '3rd Floor' },
            { value: '4', label: '4th Floor' },
            { value: '5+', label: '5th Floor+' },
            { value: 'Top', label: 'Top Floor' }
        ]
    },

    // Year Built - Collapsible
    yearBuilt: {
        type: 'dropdown',
        label: 'Year Built',
        width: 'half',
        options: [
            { value: '', label: 'Any Year' },
            { value: '2020+', label: '2020 or newer' },
            { value: '2010-2019', label: '2010-2019' },
            { value: '2000-2009', label: '2000-2009' },
            { value: '1990-1999', label: '1990-1999' },
            { value: 'Before 1990', label: 'Before 1990' }
        ]
    },

    // Condition - Collapsible
    condition: {
        type: 'dropdown',
        label: 'Condition',
        width: 'half',
        options: [
            { value: '', label: 'Any Condition' },
            { value: 'New Construction', label: 'New Construction' },
            { value: 'Excellent', label: 'Excellent' },
            { value: 'Good', label: 'Good' },
            { value: 'Needs Renovation', label: 'Needs Renovation' }
        ]
    },

    // Furnished - Collapsible
    furnished: {
        type: 'dropdown',
        label: 'Furnished',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'Furnished', label: 'Furnished' },
            { value: 'Semi-Furnished', label: 'Semi-Furnished' },
            { value: 'Unfurnished', label: 'Unfurnished' }
        ]
    },

    // Features/Amenities - Collapsible multi-select
    features: {
        type: 'multi-select',
        label: 'Features & Amenities',
        width: 'full',
        options: [
            'Balcony',
            'Terrace',
            'Garden',
            'Parking',
            'Garage',
            'Elevator',
            'Air Conditioning',
            'Central Heating',
            'Fireplace',
            'Swimming Pool',
            'Gym',
            'Security',
            'Storage Room',
            'Pet Friendly',
            'Wheelchair Accessible',
            'Smart Home',
            'Solar Panels',
            'Double Glazing',
            'Alarm System',
            'Video Intercom'
        ]
    },

    // Heating Type - Collapsible
    heatingType: {
        type: 'dropdown',
        label: 'Heating Type',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'Central', label: 'Central Heating' },
            { value: 'Autonomous', label: 'Autonomous' },
            { value: 'Gas', label: 'Gas' },
            { value: 'Electric', label: 'Electric' },
            { value: 'Heat Pump', label: 'Heat Pump' },
            { value: 'None', label: 'None' }
        ]
    },

    // Energy Rating - Collapsible
    energyRating: {
        type: 'dropdown',
        label: 'Energy Rating',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'A+', label: 'A+' },
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
            { value: 'C', label: 'C' },
            { value: 'D', label: 'D' },
            { value: 'E', label: 'E' },
            { value: 'F', label: 'F' },
            { value: 'G', label: 'G' }
        ]
    },

    // View - Collapsible
    view: {
        type: 'multi-select',
        label: 'View',
        width: 'full',
        options: [
            'Sea View',
            'Mountain View',
            'City View',
            'Park View',
            'Garden View',
            'Street View',
            'Unobstructed'
        ]
    },

    // Orientation - Collapsible
    orientation: {
        type: 'multi-select',
        label: 'Orientation',
        width: 'full',
        options: [
            'North',
            'South',
            'East',
            'West',
            'Northeast',
            'Northwest',
            'Southeast',
            'Southwest'
        ]
    },

    // Seller Type - Collapsible
    sellerType: {
        type: 'radio',
        label: 'Seller Type',
        width: 'full',
        options: [
            { value: '', label: 'All Sellers' },
            { value: 'Owner', label: 'Owner' },
            { value: 'Agency', label: 'Real Estate Agency' },
            { value: 'Developer', label: 'Developer' }
        ]
    }
};

// Export for use in filter renderer
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { realEstateFilterSchema };
}
