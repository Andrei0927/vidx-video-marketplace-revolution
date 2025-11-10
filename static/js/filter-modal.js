/**
 * Category Filter Modal
 * Shows filters before video feed, applies user preferences
 */

// Get filter modal elements (with safety checks for iOS)
const filterModal = document.getElementById('filter-modal');
const skipFiltersBtn = document.getElementById('skip-filters');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearAllFiltersBtn = document.getElementById('clear-all-filters');
const filterOptionsContainer = document.getElementById('filter-options-container');

// Exit early if elements don't exist (e.g., on video feed page)
if (!filterModal || !skipFiltersBtn || !applyFiltersBtn || !clearAllFiltersBtn || !filterOptionsContainer) {
    console.log('Filter modal elements not found - likely on video feed page');
} else {

// Skip filters - navigate to video feed without filters
skipFiltersBtn.addEventListener('click', () => {
    window.location.href = `${window.location.pathname}?show=videos`;
});

// Apply filters - navigate to video feed page with filter parameters
applyFiltersBtn.addEventListener('click', () => {
    // Collect all filter values
    const filters = collectFilters();
    
    // Build URL parameters from filters
    const params = new URLSearchParams();
    params.set('show', 'videos');
    
    // Add each filter to URL
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
            if (Array.isArray(value)) {
                // For multi-select filters
                params.set(key, value.join(','));
            } else {
                params.set(key, value);
            }
        }
    });
    
    // Navigate to video feed page with filters
    window.location.href = `${window.location.pathname}?${params.toString()}`;
});

// Clear all filters
clearAllFiltersBtn.addEventListener('click', () => {
    // Reset all inputs
    document.querySelectorAll('#filter-options-container input, #filter-options-container select').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Remove active classes
    document.querySelectorAll('.filter-chip.active').forEach(chip => {
        chip.classList.remove('active', 'bg-indigo-600', 'text-white');
        chip.classList.add('bg-gray-100', 'dark:bg-dark-200', 'text-gray-700', 'dark:text-dark-500');
    });
});

// Collect filter values
function collectFilters() {
    const filters = {};
    
    document.querySelectorAll('[data-filter-type]').forEach(element => {
        const filterType = element.dataset.filterType;
        const filterValue = element.value || element.dataset.value;
        
        if (element.type === 'checkbox' && element.checked) {
            if (!filters[filterType]) filters[filterType] = [];
            filters[filterType].push(filterValue);
        } else if (element.classList.contains('active')) {
            filters[filterType] = filterValue;
        } else if (element.tagName === 'SELECT' && filterValue) {
            filters[filterType] = filterValue;
        } else if (element.tagName === 'INPUT' && element.type === 'text' && filterValue) {
            filters[filterType] = filterValue;
        } else if (element.tagName === 'INPUT' && element.type === 'number' && filterValue) {
            filters[filterType] = filterValue;
        }
    });
    
    return filters;
}

// Apply filters to video feed (placeholder - will be implemented with real data)
function applyFiltersToFeed(filters) {
    console.log('Filters applied:', filters);
    // This will filter the video feed based on selected criteria
    // Implementation will be added when we have real video data
}

// Load saved filters on page load
function loadSavedFilters() {
    const savedFilters = sessionStorage.getItem(`filters_${window.location.pathname}`);
    if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        // Apply saved filters to UI
        Object.keys(filters).forEach(filterType => {
            const value = filters[filterType];
            const element = document.querySelector(`[data-filter-type="${filterType}"]`);
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.value = value;
                } else if (element.tagName === 'INPUT') {
                    element.value = value;
                }
            }
        });
    }
}

// Build filter UI based on category
function buildFilterUI(category) {
    // Get comprehensive filters for this category
    const schema = getCategoryFilterSchema(category);
    renderFilters(schema);
    feather.replace();
}

// Get filter schema for category
function getCategoryFilterSchema(category) {
    const schemas = {
        'automotive': {
            sections: [
                {
                    title: 'Vehicle Details',
                    fields: [
                        {
                            id: 'vehicle_type',
                            label: 'Vehicle Type',
                            type: 'chips',
                            options: [
                                { value: 'cars', label: 'Cars' },
                                { value: 'motorcycles', label: 'Motorcycles' },
                                { value: 'trucks', label: 'Trucks' },
                                { value: 'vans', label: 'Vans' },
                                { value: 'suvs', label: 'SUVs' },
                                { value: 'parts', label: 'Parts & Accessories' }
                            ]
                        },
                        {
                            id: 'make',
                            label: 'Make',
                            type: 'select',
                            placeholder: 'Select Make',
                            options: [
                                { value: 'toyota', label: 'Toyota' },
                                { value: 'volkswagen', label: 'Volkswagen' },
                                { value: 'ford', label: 'Ford' },
                                { value: 'bmw', label: 'BMW' },
                                { value: 'mercedes', label: 'Mercedes-Benz' },
                                { value: 'audi', label: 'Audi' },
                                { value: 'honda', label: 'Honda' },
                                { value: 'nissan', label: 'Nissan' },
                                { value: 'hyundai', label: 'Hyundai' },
                                { value: 'kia', label: 'Kia' },
                                { value: 'mazda', label: 'Mazda' },
                                { value: 'subaru', label: 'Subaru' },
                                { value: 'tesla', label: 'Tesla' },
                                { value: 'volvo', label: 'Volvo' },
                                { value: 'jaguar', label: 'Jaguar' },
                                { value: 'land-rover', label: 'Land Rover' },
                                { value: 'porsche', label: 'Porsche' },
                                { value: 'ferrari', label: 'Ferrari' },
                                { value: 'lamborghini', label: 'Lamborghini' },
                                { value: 'maserati', label: 'Maserati' }
                            ]
                        },
                        {
                            id: 'fuel_type',
                            label: 'Fuel Type',
                            type: 'chips',
                            options: [
                                { value: 'petrol', label: 'Petrol' },
                                { value: 'diesel', label: 'Diesel' },
                                { value: 'electric', label: 'Electric' },
                                { value: 'hybrid', label: 'Hybrid' },
                                { value: 'cng', label: 'CNG' }
                            ]
                        },
                        {
                            id: 'transmission',
                            label: 'Transmission',
                            type: 'chips',
                            options: [
                                { value: 'manual', label: 'Manual' },
                                { value: 'automatic', label: 'Automatic' },
                                { value: 'semi-automatic', label: 'Semi-Automatic' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price & Year',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        },
                        {
                            id: 'year',
                            label: 'Year Range',
                            type: 'range',
                            min: { label: 'Min Year' },
                            max: { label: 'Max Year' }
                        },
                        {
                            id: 'mileage',
                            label: 'Mileage Range (km)',
                            type: 'range',
                            min: { label: 'Min km' },
                            max: { label: 'Max km' }
                        }
                    ]
                },
                {
                    title: 'Condition',
                    fields: [
                        {
                            id: 'condition',
                            label: 'Condition',
                            type: 'chips',
                            options: [
                                { value: 'new', label: 'New' },
                                { value: 'used', label: 'Used' },
                                { value: 'certified-pre-owned', label: 'Certified Pre-Owned' }
                            ]
                        }
                    ]
                }
            ]
        },
        'electronics': {
            sections: [
                {
                    title: 'Product Type',
                    fields: [
                        {
                            id: 'subcategory',
                            label: 'Subcategory',
                            type: 'select',
                            placeholder: 'Select Type',
                            options: [
                                { value: 'phones', label: 'Phones' },
                                { value: 'laptops', label: 'Laptops' },
                                { value: 'tablets', label: 'Tablets' },
                                { value: 'cameras', label: 'Cameras' },
                                { value: 'audio', label: 'Audio Equipment' },
                                { value: 'tv', label: 'TVs & Monitors' },
                                { value: 'gaming', label: 'Gaming Consoles' },
                                { value: 'smartwatches', label: 'Smartwatches' },
                                { value: 'accessories', label: 'Accessories' }
                            ]
                        },
                        {
                            id: 'brand',
                            label: 'Brand',
                            type: 'select',
                            placeholder: 'Select Brand',
                            options: [
                                { value: 'apple', label: 'Apple' },
                                { value: 'samsung', label: 'Samsung' },
                                { value: 'sony', label: 'Sony' },
                                { value: 'dell', label: 'Dell' },
                                { value: 'hp', label: 'HP' },
                                { value: 'lenovo', label: 'Lenovo' },
                                { value: 'asus', label: 'Asus' },
                                { value: 'lg', label: 'LG' },
                                { value: 'canon', label: 'Canon' },
                                { value: 'nikon', label: 'Nikon' },
                                { value: 'bose', label: 'Bose' },
                                { value: 'jbl', label: 'JBL' },
                                { value: 'microsoft', label: 'Microsoft' },
                                { value: 'nintendo', label: 'Nintendo' },
                                { value: 'xiaomi', label: 'Xiaomi' }
                            ]
                        },
                        {
                            id: 'storage',
                            label: 'Storage',
                            type: 'select',
                            placeholder: 'Select Storage',
                            options: [
                                { value: '32gb', label: '32GB' },
                                { value: '64gb', label: '64GB' },
                                { value: '128gb', label: '128GB' },
                                { value: '256gb', label: '256GB' },
                                { value: '512gb', label: '512GB' },
                                { value: '1tb', label: '1TB' },
                                { value: '2tb', label: '2TB' },
                                { value: '2tb+', label: '2TB+' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price & Warranty',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        },
                        {
                            id: 'warranty',
                            label: 'Warranty',
                            type: 'chips',
                            options: [
                                { value: 'none', label: 'No Warranty' },
                                { value: 'manufacturer', label: 'Manufacturer' },
                                { value: 'extended', label: 'Extended' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Condition',
                    fields: [
                        {
                            id: 'condition',
                            label: 'Condition',
                            type: 'chips',
                            options: [
                                { value: 'new', label: 'New' },
                                { value: 'like-new', label: 'Like New' },
                                { value: 'good', label: 'Good' },
                                { value: 'fair', label: 'Fair' },
                                { value: 'refurbished', label: 'Refurbished' }
                            ]
                        }
                    ]
                }
            ]
        },
        'fashion': {
            sections: [
                {
                    title: 'Product Details',
                    fields: [
                        {
                            id: 'subcategory',
                            label: 'Subcategory',
                            type: 'select',
                            placeholder: 'Select Type',
                            options: [
                                { value: 'clothing', label: 'Clothing' },
                                { value: 'shoes', label: 'Shoes' },
                                { value: 'accessories', label: 'Accessories' },
                                { value: 'bags', label: 'Bags' },
                                { value: 'jewelry', label: 'Jewelry' },
                                { value: 'watches', label: 'Watches' },
                                { value: 'sportswear', label: 'Sportswear' },
                                { value: 'kids', label: 'Kids Fashion' }
                            ]
                        },
                        {
                            id: 'gender',
                            label: 'Gender',
                            type: 'chips',
                            options: [
                                { value: 'men', label: 'Men' },
                                { value: 'women', label: 'Women' },
                                { value: 'unisex', label: 'Unisex' },
                                { value: 'kids', label: 'Kids' }
                            ]
                        },
                        {
                            id: 'brand',
                            label: 'Brand',
                            type: 'select',
                            placeholder: 'Select Brand',
                            options: [
                                { value: 'nike', label: 'Nike' },
                                { value: 'adidas', label: 'Adidas' },
                                { value: 'zara', label: 'Zara' },
                                { value: 'hm', label: 'H&M' },
                                { value: 'gucci', label: 'Gucci' },
                                { value: 'prada', label: 'Prada' },
                                { value: 'levis', label: "Levi's" },
                                { value: 'gap', label: 'Gap' },
                                { value: 'uniqlo', label: 'Uniqlo' },
                                { value: 'ralph-lauren', label: 'Ralph Lauren' },
                                { value: 'tommy-hilfiger', label: 'Tommy Hilfiger' },
                                { value: 'calvin-klein', label: 'Calvin Klein' }
                            ]
                        },
                        {
                            id: 'size',
                            label: 'Size',
                            type: 'select',
                            placeholder: 'Select Size',
                            options: [
                                { value: 'xxs', label: 'XXS' },
                                { value: 'xs', label: 'XS' },
                                { value: 's', label: 'S' },
                                { value: 'm', label: 'M' },
                                { value: 'l', label: 'L' },
                                { value: 'xl', label: 'XL' },
                                { value: 'xxl', label: 'XXL' },
                                { value: 'xxxl', label: 'XXXL' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price & Material',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        },
                        {
                            id: 'material',
                            label: 'Material',
                            type: 'chips',
                            options: [
                                { value: 'cotton', label: 'Cotton' },
                                { value: 'polyester', label: 'Polyester' },
                                { value: 'leather', label: 'Leather' },
                                { value: 'denim', label: 'Denim' },
                                { value: 'silk', label: 'Silk' },
                                { value: 'wool', label: 'Wool' },
                                { value: 'synthetic', label: 'Synthetic' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Condition',
                    fields: [
                        {
                            id: 'condition',
                            label: 'Condition',
                            type: 'chips',
                            options: [
                                { value: 'new', label: 'New' },
                                { value: 'like-new', label: 'Like New' },
                                { value: 'good', label: 'Good' },
                                { value: 'fair', label: 'Fair' }
                            ]
                        }
                    ]
                }
            ]
        },
        'home-garden': {
            sections: [
                {
                    title: 'Product Type',
                    fields: [
                        {
                            id: 'subcategory',
                            label: 'Subcategory',
                            type: 'select',
                            placeholder: 'Select Type',
                            options: [
                                { value: 'furniture', label: 'Furniture' },
                                { value: 'appliances', label: 'Appliances' },
                                { value: 'decor', label: 'Home Decor' },
                                { value: 'lighting', label: 'Lighting' },
                                { value: 'textiles', label: 'Textiles' },
                                { value: 'kitchenware', label: 'Kitchenware' },
                                { value: 'bathroom', label: 'Bathroom' },
                                { value: 'garden', label: 'Garden' },
                                { value: 'storage', label: 'Storage' },
                                { value: 'diy', label: 'DIY Tools' }
                            ]
                        },
                        {
                            id: 'room',
                            label: 'Room',
                            type: 'select',
                            placeholder: 'Select Room',
                            options: [
                                { value: 'living-room', label: 'Living Room' },
                                { value: 'bedroom', label: 'Bedroom' },
                                { value: 'kitchen', label: 'Kitchen' },
                                { value: 'bathroom', label: 'Bathroom' },
                                { value: 'dining-room', label: 'Dining Room' },
                                { value: 'office', label: 'Office' },
                                { value: 'outdoor', label: 'Outdoor' },
                                { value: 'kids-room', label: 'Kids Room' }
                            ]
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            type: 'chips',
                            options: [
                                { value: 'modern', label: 'Modern' },
                                { value: 'traditional', label: 'Traditional' },
                                { value: 'rustic', label: 'Rustic' },
                                { value: 'industrial', label: 'Industrial' },
                                { value: 'scandinavian', label: 'Scandinavian' },
                                { value: 'vintage', label: 'Vintage' },
                                { value: 'minimalist', label: 'Minimalist' },
                                { value: 'bohemian', label: 'Bohemian' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price & Material',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        },
                        {
                            id: 'material',
                            label: 'Material',
                            type: 'chips',
                            options: [
                                { value: 'wood', label: 'Wood' },
                                { value: 'metal', label: 'Metal' },
                                { value: 'plastic', label: 'Plastic' },
                                { value: 'glass', label: 'Glass' },
                                { value: 'fabric', label: 'Fabric' },
                                { value: 'ceramic', label: 'Ceramic' },
                                { value: 'stone', label: 'Stone' },
                                { value: 'composite', label: 'Composite' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Condition',
                    fields: [
                        {
                            id: 'condition',
                            label: 'Condition',
                            type: 'chips',
                            options: [
                                { value: 'new', label: 'New' },
                                { value: 'like-new', label: 'Like New' },
                                { value: 'good', label: 'Good' },
                                { value: 'fair', label: 'Fair' }
                            ]
                        }
                    ]
                }
            ]
        },
        'sports': {
            sections: [
                {
                    title: 'Sport Type',
                    fields: [
                        {
                            id: 'sport_type',
                            label: 'Sport Type',
                            type: 'select',
                            placeholder: 'Select Sport',
                            options: [
                                { value: 'football', label: 'Football / Soccer' },
                                { value: 'basketball', label: 'Basketball' },
                                { value: 'tennis', label: 'Tennis' },
                                { value: 'running', label: 'Running & Athletics' },
                                { value: 'cycling', label: 'Cycling' },
                                { value: 'swimming', label: 'Swimming' },
                                { value: 'gym', label: 'Gym Equipment' },
                                { value: 'yoga', label: 'Yoga & Pilates' },
                                { value: 'hiking', label: 'Hiking & Camping' },
                                { value: 'skiing', label: 'Skiing & Snowboarding' },
                                { value: 'golf', label: 'Golf' },
                                { value: 'boxing', label: 'Boxing & MMA' },
                                { value: 'other', label: 'Other Sports' }
                            ]
                        },
                        {
                            id: 'brand',
                            label: 'Brand',
                            type: 'select',
                            placeholder: 'Select Brand',
                            options: [
                                { value: 'nike', label: 'Nike' },
                                { value: 'adidas', label: 'Adidas' },
                                { value: 'puma', label: 'Puma' },
                                { value: 'under-armour', label: 'Under Armour' },
                                { value: 'reebok', label: 'Reebok' },
                                { value: 'new-balance', label: 'New Balance' },
                                { value: 'asics', label: 'Asics' },
                                { value: 'north-face', label: 'The North Face' },
                                { value: 'patagonia', label: 'Patagonia' },
                                { value: 'wilson', label: 'Wilson' },
                                { value: 'callaway', label: 'Callaway' },
                                { value: 'speedo', label: 'Speedo' }
                            ]
                        },
                        {
                            id: 'gender',
                            label: 'Gender',
                            type: 'chips',
                            options: [
                                { value: 'men', label: 'Men' },
                                { value: 'women', label: 'Women' },
                                { value: 'unisex', label: 'Unisex' },
                                { value: 'kids', label: 'Kids' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price & Size',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        },
                        {
                            id: 'size',
                            label: 'Size',
                            type: 'select',
                            placeholder: 'Select Size',
                            options: [
                                { value: 'xs', label: 'XS' },
                                { value: 's', label: 'S' },
                                { value: 'm', label: 'M' },
                                { value: 'l', label: 'L' },
                                { value: 'xl', label: 'XL' },
                                { value: 'xxl', label: 'XXL' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Condition',
                    fields: [
                        {
                            id: 'condition',
                            label: 'Condition',
                            type: 'chips',
                            options: [
                                { value: 'new', label: 'Brand New' },
                                { value: 'like-new', label: 'Like New' },
                                { value: 'good', label: 'Good' },
                                { value: 'fair', label: 'Fair' }
                            ]
                        }
                    ]
                }
            ]
        },
        'real-estate': {
            sections: [
                {
                    title: 'Property Details',
                    fields: [
                        {
                            id: 'property_type',
                            label: 'Property Type',
                            type: 'select',
                            placeholder: 'Select Type',
                            options: [
                                { value: 'apartment', label: 'Apartment' },
                                { value: 'house', label: 'House' },
                                { value: 'villa', label: 'Villa' },
                                { value: 'studio', label: 'Studio' },
                                { value: 'penthouse', label: 'Penthouse' },
                                { value: 'land', label: 'Land/Plot' },
                                { value: 'commercial', label: 'Commercial' },
                                { value: 'office', label: 'Office Space' }
                            ]
                        },
                        {
                            id: 'listing_type',
                            label: 'Listing Type',
                            type: 'chips',
                            options: [
                                { value: 'sale', label: 'For Sale' },
                                { value: 'rent', label: 'For Rent' }
                            ]
                        },
                        {
                            id: 'bedrooms',
                            label: 'Bedrooms',
                            type: 'select',
                            placeholder: 'Select Bedrooms',
                            options: [
                                { value: 'studio', label: 'Studio' },
                                { value: '1', label: '1' },
                                { value: '2', label: '2' },
                                { value: '3', label: '3' },
                                { value: '4', label: '4' },
                                { value: '5+', label: '5+' }
                            ]
                        },
                        {
                            id: 'bathrooms',
                            label: 'Bathrooms',
                            type: 'select',
                            placeholder: 'Select Bathrooms',
                            options: [
                                { value: '1', label: '1' },
                                { value: '2', label: '2' },
                                { value: '3', label: '3' },
                                { value: '4+', label: '4+' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price & Area',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        },
                        {
                            id: 'area',
                            label: 'Area (m²)',
                            type: 'range',
                            min: { label: 'Min m²' },
                            max: { label: 'Max m²' }
                        }
                    ]
                },
                {
                    title: 'Features',
                    fields: [
                        {
                            id: 'furnished',
                            label: 'Furnished',
                            type: 'chips',
                            options: [
                                { value: 'furnished', label: 'Furnished' },
                                { value: 'semi-furnished', label: 'Semi-Furnished' },
                                { value: 'unfurnished', label: 'Unfurnished' }
                            ]
                        }
                    ]
                }
            ]
        },
        'jobs': {
            sections: [
                {
                    title: 'Job Details',
                    fields: [
                        {
                            id: 'job_category',
                            label: 'Job Category',
                            type: 'select',
                            placeholder: 'Select Category',
                            options: [
                                { value: 'it', label: 'IT & Technology' },
                                { value: 'marketing', label: 'Marketing & Sales' },
                                { value: 'finance', label: 'Finance & Accounting' },
                                { value: 'healthcare', label: 'Healthcare & Medical' },
                                { value: 'engineering', label: 'Engineering' },
                                { value: 'education', label: 'Education & Training' },
                                { value: 'hospitality', label: 'Hospitality & Tourism' },
                                { value: 'retail', label: 'Retail & Customer Service' },
                                { value: 'construction', label: 'Construction & Trades' },
                                { value: 'hr', label: 'Human Resources' },
                                { value: 'legal', label: 'Legal' },
                                { value: 'design', label: 'Design & Creative' }
                            ]
                        },
                        {
                            id: 'job_type',
                            label: 'Job Type',
                            type: 'chips',
                            options: [
                                { value: 'full-time', label: 'Full-Time' },
                                { value: 'part-time', label: 'Part-Time' },
                                { value: 'contract', label: 'Contract' },
                                { value: 'internship', label: 'Internship' },
                                { value: 'remote', label: 'Remote' }
                            ]
                        },
                        {
                            id: 'experience_level',
                            label: 'Experience Level',
                            type: 'select',
                            placeholder: 'Select Experience',
                            options: [
                                { value: 'entry', label: 'Entry Level (0-2 years)' },
                                { value: 'mid', label: 'Mid Level (2-5 years)' },
                                { value: 'senior', label: 'Senior Level (5-10 years)' },
                                { value: 'expert', label: 'Expert (10+ years)' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Salary Range',
                    fields: [
                        {
                            id: 'salary',
                            label: 'Salary Range (€/month)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        }
                    ]
                }
            ]
        },
        'services': {
            sections: [
                {
                    title: 'Service Type',
                    fields: [
                        {
                            id: 'service_category',
                            label: 'Service Category',
                            type: 'select',
                            placeholder: 'Select Category',
                            options: [
                                { value: 'home', label: 'Home Services' },
                                { value: 'professional', label: 'Professional Services' },
                                { value: 'events', label: 'Events & Entertainment' },
                                { value: 'beauty', label: 'Beauty & Wellness' },
                                { value: 'automotive', label: 'Automotive Services' },
                                { value: 'pet', label: 'Pet Services' },
                                { value: 'education', label: 'Education & Training' },
                                { value: 'tech', label: 'Tech & IT Services' },
                                { value: 'health', label: 'Health & Medical' },
                                { value: 'creative', label: 'Creative Services' }
                            ]
                        },
                        {
                            id: 'provider_type',
                            label: 'Provider Type',
                            type: 'chips',
                            options: [
                                { value: 'individual', label: 'Individual' },
                                { value: 'company', label: 'Company' },
                                { value: 'freelancer', label: 'Freelancer' }
                            ]
                        },
                        {
                            id: 'availability',
                            label: 'Availability',
                            type: 'chips',
                            options: [
                                { value: 'weekdays', label: 'Weekdays' },
                                { value: 'weekends', label: 'Weekends' },
                                { value: 'emergency', label: 'Emergency/24-7' },
                                { value: 'same-day', label: 'Same Day' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Price Range',
                    fields: [
                        {
                            id: 'price',
                            label: 'Price Range (€)',
                            type: 'range',
                            min: { label: 'Min €' },
                            max: { label: 'Max €' }
                        }
                    ]
                },
                {
                    title: 'Certification',
                    fields: [
                        {
                            id: 'certification',
                            label: 'Certification',
                            type: 'chips',
                            options: [
                                { value: 'licensed', label: 'Licensed' },
                                { value: 'insured', label: 'Insured' },
                                { value: 'certified', label: 'Certified' },
                                { value: 'verified', label: 'Verified Reviews' }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    
    // Return schema for category, or fall back to basic filters
    return schemas[category] || null;
}

// Render filters from schema
function renderFilters(schema) {
    if (!schema || !schema.sections) {
        renderBasicFilters();
        return;
    }
    
    filterOptionsContainer.innerHTML = '';
    
    schema.sections.forEach(section => {
        const sectionEl = createFilterSection(section);
        filterOptionsContainer.appendChild(sectionEl);
    });
}

// Create filter section
function createFilterSection(section) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'filter-section';
    
    // Section title
    const title = document.createElement('h3');
    title.className = 'text-sm font-semibold text-gray-900 dark:text-dark-600 mb-3';
    title.textContent = section.title;
    sectionDiv.appendChild(title);
    
    // Section fields
    const fieldsContainer = document.createElement('div');
    fieldsContainer.className = 'space-y-3';
    
    section.fields.forEach(field => {
        const fieldEl = createFilterField(field);
        fieldsContainer.appendChild(fieldEl);
    });
    
    sectionDiv.appendChild(fieldsContainer);
    return sectionDiv;
}

// Create filter field
function createFilterField(field) {
    const fieldDiv = document.createElement('div');
    
    if (field.type === 'select') {
        return createSelectField(field);
    } else if (field.type === 'chips') {
        return createChipsField(field);
    } else if (field.type === 'range') {
        return createRangeField(field);
    } else if (field.type === 'text') {
        return createTextField(field);
    }
    
    return fieldDiv;
}

// Create select dropdown
function createSelectField(field) {
    const div = document.createElement('div');
    
    const label = document.createElement('label');
    label.className = 'block text-sm text-gray-700 dark:text-dark-500 mb-2';
    label.textContent = field.label;
    
    const select = document.createElement('select');
    select.className = 'w-full px-4 py-3 border border-gray-300 dark:border-dark-300 rounded-xl bg-white dark:bg-dark-200 text-gray-900 dark:text-dark-600 focus:ring-2 focus:ring-indigo-500';
    select.dataset.filterType = field.id;
    
    // Add placeholder option
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = field.placeholder || `Select ${field.label}`;
    select.appendChild(placeholder);
    
    // Add options
    field.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
    });
    
    div.appendChild(label);
    div.appendChild(select);
    return div;
}

// Create chips (multi-select buttons)
function createChipsField(field) {
    const div = document.createElement('div');
    
    const label = document.createElement('label');
    label.className = 'block text-sm text-gray-700 dark:text-dark-500 mb-2';
    label.textContent = field.label;
    div.appendChild(label);
    
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'flex flex-wrap gap-2';
    
    field.options.forEach(opt => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'filter-chip px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-dark-500 hover:bg-gray-200 dark:hover:bg-dark-300';
        chip.textContent = opt.label;
        chip.dataset.filterType = field.id;
        chip.dataset.value = opt.value;
        
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            if (chip.classList.contains('active')) {
                chip.classList.remove('bg-gray-100', 'dark:bg-dark-200', 'text-gray-700', 'dark:text-dark-500');
                chip.classList.add('bg-indigo-600', 'text-white');
            } else {
                chip.classList.add('bg-gray-100', 'dark:bg-dark-200', 'text-gray-700', 'dark:text-dark-500');
                chip.classList.remove('bg-indigo-600', 'text-white');
            }
        });
        
        chipsContainer.appendChild(chip);
    });
    
    div.appendChild(chipsContainer);
    return div;
}

// Create range input (min/max)
function createRangeField(field) {
    const div = document.createElement('div');
    
    const label = document.createElement('label');
    label.className = 'block text-sm text-gray-700 dark:text-dark-500 mb-2';
    label.textContent = field.label;
    div.appendChild(label);
    
    const rangeContainer = document.createElement('div');
    rangeContainer.className = 'grid grid-cols-2 gap-3';
    
    // Min input
    const minDiv = document.createElement('div');
    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.placeholder = field.min?.label || 'Min';
    minInput.className = 'w-full px-4 py-3 border border-gray-300 dark:border-dark-300 rounded-xl bg-white dark:bg-dark-200 text-gray-900 dark:text-dark-600 focus:ring-2 focus:ring-indigo-500';
    minInput.dataset.filterType = `${field.id}_min`;
    minDiv.appendChild(minInput);
    
    // Max input
    const maxDiv = document.createElement('div');
    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.placeholder = field.max?.label || 'Max';
    maxInput.className = 'w-full px-4 py-3 border border-gray-300 dark:border-dark-300 rounded-xl bg-white dark:bg-dark-200 text-gray-900 dark:text-dark-600 focus:ring-2 focus:ring-indigo-500';
    maxInput.dataset.filterType = `${field.id}_max`;
    maxDiv.appendChild(maxInput);
    
    rangeContainer.appendChild(minDiv);
    rangeContainer.appendChild(maxDiv);
    div.appendChild(rangeContainer);
    return div;
}

// Create text input
function createTextField(field) {
    const div = document.createElement('div');
    
    const label = document.createElement('label');
    label.className = 'block text-sm text-gray-700 dark:text-dark-500 mb-2';
    label.textContent = field.label;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = field.placeholder || '';
    input.className = 'w-full px-4 py-3 border border-gray-300 dark:border-dark-300 rounded-xl bg-white dark:bg-dark-200 text-gray-900 dark:text-dark-600 focus:ring-2 focus:ring-indigo-500';
    input.dataset.filterType = field.id;
    
    div.appendChild(label);
    div.appendChild(input);
    return div;
}

// Fallback basic filters
function renderBasicFilters() {
    filterOptionsContainer.innerHTML = `
        <div class="filter-section">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-dark-600 mb-3">Price Range</h3>
            <div class="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Min Price" data-filter-type="price_min" class="w-full px-4 py-3 border border-gray-300 dark:border-dark-300 rounded-xl bg-white dark:bg-dark-200 text-gray-900 dark:text-dark-600 focus:ring-2 focus:ring-indigo-500">
                <input type="number" placeholder="Max Price" data-filter-type="price_max" class="w-full px-4 py-3 border border-gray-300 dark:border-dark-300 rounded-xl bg-white dark:bg-dark-200 text-gray-900 dark:text-dark-600 focus:ring-2 focus:ring-indigo-500">
            </div>
        </div>
        
        <div class="filter-section">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-dark-600 mb-3">Condition</h3>
            <div class="flex flex-wrap gap-2">
                <button type="button" class="filter-chip px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-dark-500" data-filter-type="condition" data-value="new">New</button>
                <button type="button" class="filter-chip px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-dark-500" data-filter-type="condition" data-value="like-new">Like New</button>
                <button type="button" class="filter-chip px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-dark-500" data-filter-type="condition" data-value="good">Good</button>
                <button type="button" class="filter-chip px-4 py-2 rounded-xl text-sm font-medium transition bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-dark-500" data-filter-type="condition" data-value="fair">Fair</button>
            </div>
        </div>
    `;
    
    // Add click handlers to chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            // Single select for condition
            document.querySelectorAll('.filter-chip[data-filter-type="condition"]').forEach(c => {
                c.classList.remove('active', 'bg-indigo-600', 'text-white');
                c.classList.add('bg-gray-100', 'dark:bg-dark-200', 'text-gray-700', 'dark:text-dark-500');
            });
            
            chip.classList.add('active', 'bg-indigo-600', 'text-white');
            chip.classList.remove('bg-gray-100', 'dark:bg-dark-200', 'text-gray-700', 'dark:text-dark-500');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get category from URL
    const pathParts = window.location.pathname.split('/');
    const category = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    
    // Build filter UI
    buildFilterUI(category);
    
    // Load saved filters
    loadSavedFilters();
});

} // End of safety check

// Export for use in other scripts (commented out for iOS compatibility)
// export { collectFilters, applyFiltersToFeed };
