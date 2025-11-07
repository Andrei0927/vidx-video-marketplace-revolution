/**
 * Fashion & Apparel Filter Schema
 * For vidx-video-marketplace-revolution
 */

const fashionFilterSchema = {
    // Main category structure
    categories: {
        type: 'single-select',
        label: 'Type',
        options: [
            { id: 'all', value: '', label: 'All Fashion', count: null },
            { id: 'womens', value: "Women's Clothing", label: "Women's Clothing", count: null },
            { id: 'mens', value: "Men's Clothing", label: "Men's Clothing", count: null },
            { id: 'kids', value: "Kids & Baby", label: "Kids & Baby", count: null },
            { id: 'shoes', value: 'Shoes', label: 'Shoes', count: null },
            { id: 'accessories', value: 'Accessories', label: 'Accessories', count: null },
            { id: 'bags', value: 'Bags & Luggage', label: 'Bags & Luggage', count: null },
            { id: 'jewelry', value: 'Jewelry & Watches', label: 'Jewelry & Watches', count: null }
        ]
    },

    // Subcategory (clothing type)
    subcategory: {
        type: 'multi-select',
        label: 'Clothing Type',
        collapsible: true,
        options: [
            // Women's
            { value: 'Dresses', label: 'Dresses' },
            { value: 'Tops', label: 'Tops & Blouses' },
            { value: 'Sweaters', label: 'Sweaters & Cardigans' },
            { value: 'Jeans', label: 'Jeans' },
            { value: 'Pants', label: 'Pants & Trousers' },
            { value: 'Skirts', label: 'Skirts' },
            { value: 'Shorts', label: 'Shorts' },
            { value: 'Activewear', label: 'Activewear' },
            { value: 'Swimwear', label: 'Swimwear' },
            { value: 'Outerwear', label: 'Coats & Jackets' },
            { value: 'Suits', label: 'Suits & Blazers' },
            { value: 'Lingerie', label: 'Lingerie & Sleepwear' },
            // Men's
            { value: 'Shirts', label: 'Shirts' },
            { value: 'T-shirts', label: 'T-shirts & Polos' },
            { value: 'Hoodies', label: 'Hoodies & Sweatshirts' },
            // Shoes
            { value: 'Sneakers', label: 'Sneakers' },
            { value: 'Boots', label: 'Boots' },
            { value: 'Sandals', label: 'Sandals' },
            { value: 'Heels', label: 'Heels' },
            { value: 'Flats', label: 'Flats' },
            { value: 'Formal Shoes', label: 'Formal Shoes' }
        ]
    },

    // Price Range
    price: {
        type: 'range',
        label: 'Price',
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

    // Brand
    brand: {
        type: 'dropdown',
        label: 'Brand',
        required: false,
        options: [
            { value: '', label: 'Any' },
            // Luxury
            { value: 'Gucci', label: 'Gucci' },
            { value: 'Louis Vuitton', label: 'Louis Vuitton' },
            { value: 'Chanel', label: 'Chanel' },
            { value: 'Prada', label: 'Prada' },
            { value: 'Versace', label: 'Versace' },
            { value: 'Dior', label: 'Dior' },
            { value: 'Burberry', label: 'Burberry' },
            { value: 'Hermès', label: 'Hermès' },
            // Premium
            { value: 'Ralph Lauren', label: 'Ralph Lauren' },
            { value: 'Tommy Hilfiger', label: 'Tommy Hilfiger' },
            { value: 'Calvin Klein', label: 'Calvin Klein' },
            { value: 'Hugo Boss', label: 'Hugo Boss' },
            { value: 'Armani', label: 'Armani' },
            { value: 'Lacoste', label: 'Lacoste' },
            { value: 'Michael Kors', label: 'Michael Kors' },
            // Sportswear
            { value: 'Nike', label: 'Nike' },
            { value: 'Adidas', label: 'Adidas' },
            { value: 'Puma', label: 'Puma' },
            { value: 'Under Armour', label: 'Under Armour' },
            { value: 'Reebok', label: 'Reebok' },
            { value: 'New Balance', label: 'New Balance' },
            { value: 'The North Face', label: 'The North Face' },
            { value: 'Columbia', label: 'Columbia' },
            // High Street
            { value: 'Zara', label: 'Zara' },
            { value: 'H&M', label: 'H&M' },
            { value: 'Mango', label: 'Mango' },
            { value: 'Massimo Dutti', label: 'Massimo Dutti' },
            { value: 'Gap', label: 'Gap' },
            { value: 'Uniqlo', label: 'Uniqlo' },
            { value: "Levi's", label: "Levi's" },
            { value: 'Diesel', label: 'Diesel' },
            { value: 'Guess', label: 'Guess' },
            // Shoes
            { value: 'Converse', label: 'Converse' },
            { value: 'Vans', label: 'Vans' },
            { value: 'Timberland', label: 'Timberland' },
            { value: 'Dr. Martens', label: 'Dr. Martens' },
            { value: 'Clarks', label: 'Clarks' },
            { value: 'Other', label: 'Other' }
        ]
    },

    // Size
    size: {
        type: 'multi-select',
        label: 'Size',
        options: [
            // General
            { value: 'XXS', label: 'XXS' },
            { value: 'XS', label: 'XS' },
            { value: 'S', label: 'S' },
            { value: 'M', label: 'M' },
            { value: 'L', label: 'L' },
            { value: 'XL', label: 'XL' },
            { value: 'XXL', label: 'XXL' },
            { value: 'XXXL', label: 'XXXL' },
            // EU sizes
            { value: '34', label: '34' },
            { value: '36', label: '36' },
            { value: '38', label: '38' },
            { value: '40', label: '40' },
            { value: '42', label: '42' },
            { value: '44', label: '44' },
            { value: '46', label: '46' },
            { value: '48', label: '48' },
            { value: '50', label: '50+' },
            // Shoe sizes
            { value: 'One Size', label: 'One Size' }
        ]
    },

    // Gender
    gender: {
        type: 'radio',
        label: 'Gender',
        options: [
            { value: '', label: 'Any' },
            { value: 'Women', label: 'Women' },
            { value: 'Men', label: 'Men' },
            { value: 'Unisex', label: 'Unisex' },
            { value: 'Kids', label: 'Kids' }
        ]
    },

    // Color
    color: {
        type: 'multi-select',
        label: 'Color',
        collapsible: true,
        options: [
            { value: 'Black', label: 'Black' },
            { value: 'White', label: 'White' },
            { value: 'Grey', label: 'Grey' },
            { value: 'Navy', label: 'Navy Blue' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Red', label: 'Red' },
            { value: 'Pink', label: 'Pink' },
            { value: 'Purple', label: 'Purple' },
            { value: 'Green', label: 'Green' },
            { value: 'Yellow', label: 'Yellow' },
            { value: 'Orange', label: 'Orange' },
            { value: 'Brown', label: 'Brown' },
            { value: 'Beige', label: 'Beige' },
            { value: 'Gold', label: 'Gold' },
            { value: 'Silver', label: 'Silver' },
            { value: 'Multicolor', label: 'Multicolor' },
            { value: 'Other', label: 'Other' }
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
            { value: 'Wool', label: 'Wool' },
            { value: 'Silk', label: 'Silk' },
            { value: 'Linen', label: 'Linen' },
            { value: 'Denim', label: 'Denim' },
            { value: 'Leather', label: 'Leather' },
            { value: 'Synthetic Leather', label: 'Synthetic Leather' },
            { value: 'Suede', label: 'Suede' },
            { value: 'Cashmere', label: 'Cashmere' },
            { value: 'Velvet', label: 'Velvet' },
            { value: 'Nylon', label: 'Nylon' },
            { value: 'Spandex', label: 'Spandex / Elastane' }
        ]
    },

    // Condition
    condition: {
        type: 'multi-select',
        label: 'Condition',
        options: [
            { value: 'New with tags', label: 'New with Tags' },
            { value: 'New without tags', label: 'New without Tags' },
            { value: 'Like New', label: 'Like New' },
            { value: 'Excellent', label: 'Excellent' },
            { value: 'Good', label: 'Good' },
            { value: 'Fair', label: 'Fair / Worn' }
        ]
    },

    // Style/Pattern
    style: {
        type: 'multi-select',
        label: 'Style / Pattern',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Solid', label: 'Solid Color' },
            { value: 'Striped', label: 'Striped' },
            { value: 'Floral', label: 'Floral' },
            { value: 'Polka Dot', label: 'Polka Dot' },
            { value: 'Plaid', label: 'Plaid / Checkered' },
            { value: 'Animal Print', label: 'Animal Print' },
            { value: 'Geometric', label: 'Geometric' },
            { value: 'Abstract', label: 'Abstract' },
            { value: 'Graphic', label: 'Graphic / Print' },
            { value: 'Embroidered', label: 'Embroidered' }
        ]
    },

    // Season
    season: {
        type: 'multi-select',
        label: 'Season',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Spring', label: 'Spring' },
            { value: 'Summer', label: 'Summer' },
            { value: 'Fall', label: 'Fall / Autumn' },
            { value: 'Winter', label: 'Winter' },
            { value: 'All Season', label: 'All Season' }
        ]
    },

    // Features
    features: {
        type: 'multi-select',
        label: 'Features',
        collapsible: true,
        optional: true,
        options: [
            { value: 'Vintage', label: 'Vintage' },
            { value: 'Designer', label: 'Designer' },
            { value: 'Limited Edition', label: 'Limited Edition' },
            { value: 'Handmade', label: 'Handmade' },
            { value: 'Sustainable', label: 'Sustainable / Eco' },
            { value: 'Waterproof', label: 'Waterproof' },
            { value: 'Breathable', label: 'Breathable' },
            { value: 'Reversible', label: 'Reversible' },
            { value: 'Wrinkle-free', label: 'Wrinkle-free' },
            { value: 'Quick-dry', label: 'Quick-dry' }
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
            { value: 'boutique', label: 'Boutique / Store' }
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
    module.exports = fashionFilterSchema;
}

if (typeof window !== 'undefined') {
    window.fashionFilterSchema = fashionFilterSchema;
}
