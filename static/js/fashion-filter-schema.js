/**
 * Fashion Filter Schema
 * Comprehensive clothing and accessories filters
 * Based on Amazon Fashion, eBay Clothing, OLX, FashionDays, AboutYou
 */

const fashionFilterSchema = {
    // ===== CORE FILTERS (Always Visible) =====
    category: {
        type: 'dropdown',
        label: 'Category',
        alwaysVisible: true,
        placeholder: 'Choose Category - All Fashion',
        width: 'full',
        options: [
            { value: '', label: '📦 All Categories' },
            { value: 'womens-clothing', label: '👗 Women\'s Clothing' },
            { value: 'mens-clothing', label: '👔 Men\'s Clothing' },
            { value: 'shoes', label: '👟 Shoes' },
            { value: 'bags', label: '👜 Bags & Accessories' },
            { value: 'jewelry', label: '💍 Jewelry & Watches' },
            { value: 'kids', label: '👶 Kids & Baby' },
            { value: 'sportswear', label: '🏃 Sportswear' },
            { value: 'underwear', label: '👙 Underwear & Sleepwear' },
            { value: 'vintage', label: '🕰️ Vintage & Second Hand' }
        ]
    },

    brand: {
        type: 'dropdown',
        label: 'Brand',
        alwaysVisible: true,
        placeholder: 'Any Brand',
        width: 'half',
        options: [
            { value: '', label: 'Any Brand' },
            // Luxury Brands
            { value: 'gucci', label: 'Gucci' },
            { value: 'prada', label: 'Prada' },
            { value: 'louis-vuitton', label: 'Louis Vuitton' },
            { value: 'chanel', label: 'Chanel' },
            { value: 'versace', label: 'Versace' },
            { value: 'dior', label: 'Dior' },
            { value: 'burberry', label: 'Burberry' },
            // Premium Brands
            { value: 'hugo-boss', label: 'Hugo Boss' },
            { value: 'tommy-hilfiger', label: 'Tommy Hilfiger' },
            { value: 'calvin-klein', label: 'Calvin Klein' },
            { value: 'ralph-lauren', label: 'Ralph Lauren' },
            { value: 'michael-kors', label: 'Michael Kors' },
            { value: 'armani', label: 'Armani' },
            // Sportswear
            { value: 'nike', label: 'Nike' },
            { value: 'adidas', label: 'Adidas' },
            { value: 'puma', label: 'Puma' },
            { value: 'under-armour', label: 'Under Armour' },
            { value: 'reebok', label: 'Reebok' },
            { value: 'new-balance', label: 'New Balance' },
            // Fast Fashion
            { value: 'zara', label: 'Zara' },
            { value: 'h&m', label: 'H&M' },
            { value: 'mango', label: 'Mango' },
            { value: 'pull&bear', label: 'Pull&Bear' },
            { value: 'bershka', label: 'Bershka' },
            { value: 'reserved', label: 'Reserved' },
            { value: 'massimo-dutti', label: 'Massimo Dutti' },
            // Denim
            { value: 'levis', label: 'Levi\'s' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'guess', label: 'Guess' },
            { value: 'wrangler', label: 'Wrangler' },
            // Romanian Brands
            { value: 'murmur', label: 'Murmur' },
            { value: 'andra-designs', label: 'Andra Designs' },
            { value: 'other', label: 'Other Brand' }
        ]
    },

    price: {
        type: 'range',
        label: 'Price Range',
        alwaysVisible: true,
        width: 'half',
        range: {
            min: 0,
            max: 5000,
            step: 10,
            unit: '€'
        },
        inputs: {
            from: { placeholder: 'Min €', id: 'price-from' },
            to: { placeholder: 'Max €', id: 'price-to' }
        }
    },

    condition: {
        type: 'dropdown',
        label: 'Condition',
        alwaysVisible: true,
        placeholder: 'Any Condition',
        width: 'half',
        options: [
            { value: '', label: 'Any Condition' },
            { value: 'new-with-tags', label: '🏷️ New with Tags' },
            { value: 'new-without-tags', label: '✨ New without Tags' },
            { value: 'like-new', label: '⭐ Like New' },
            { value: 'excellent', label: '👍 Excellent' },
            { value: 'good', label: '👌 Good' },
            { value: 'fair', label: '✓ Fair' },
            { value: 'vintage', label: '🕰️ Vintage' }
        ]
    },

    location: {
        type: 'text',
        label: 'Location',
        alwaysVisible: true,
        placeholder: 'Enter city or region',
        width: 'half'
    },

    // ===== ADVANCED FILTERS (Collapsible) =====
    gender: {
        type: 'dropdown',
        label: 'Gender',
        placeholder: 'Any Gender',
        width: 'third',
        options: [
            { value: '', label: 'Any Gender' },
            { value: 'women', label: 'Women' },
            { value: 'men', label: 'Men' },
            { value: 'unisex', label: 'Unisex' },
            { value: 'kids-girls', label: 'Girls' },
            { value: 'kids-boys', label: 'Boys' },
            { value: 'baby', label: 'Baby' }
        ]
    },

    size: {
        type: 'dropdown',
        label: 'Size',
        placeholder: 'Select Size',
        width: 'third',
        options: [
            { value: '', label: 'Any Size' },
            // Women's Clothing
            { value: 'xxs', label: 'XXS' },
            { value: 'xs', label: 'XS' },
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
            { value: 'xl', label: 'XL' },
            { value: 'xxl', label: 'XXL' },
            { value: 'xxxl', label: 'XXXL' },
            // Numeric sizes
            { value: '34', label: '34' },
            { value: '36', label: '36' },
            { value: '38', label: '38' },
            { value: '40', label: '40' },
            { value: '42', label: '42' },
            { value: '44', label: '44' },
            { value: '46', label: '46' },
            { value: '48', label: '48' },
            { value: '50', label: '50' },
            { value: 'one-size', label: 'One Size' }
        ]
    },

    shoeSize: {
        type: 'dropdown',
        label: 'Shoe Size (EU)',
        placeholder: 'Select Size',
        width: 'third',
        options: [
            { value: '', label: 'Any Size' },
            { value: '35', label: '35' },
            { value: '36', label: '36' },
            { value: '37', label: '37' },
            { value: '38', label: '38' },
            { value: '39', label: '39' },
            { value: '40', label: '40' },
            { value: '41', label: '41' },
            { value: '42', label: '42' },
            { value: '43', label: '43' },
            { value: '44', label: '44' },
            { value: '45', label: '45' },
            { value: '46', label: '46' },
            { value: '47', label: '47' },
            { value: '48', label: '48' }
        ]
    },

    color: {
        type: 'dropdown',
        label: 'Color',
        placeholder: 'Any Color',
        width: 'third',
        options: [
            { value: '', label: 'Any Color' },
            { value: 'black', label: '⬛ Black' },
            { value: 'white', label: '⬜ White' },
            { value: 'gray', label: '🔲 Gray' },
            { value: 'beige', label: '🟤 Beige' },
            { value: 'brown', label: '🟫 Brown' },
            { value: 'red', label: '🟥 Red' },
            { value: 'pink', label: '🩷 Pink' },
            { value: 'orange', label: '🟧 Orange' },
            { value: 'yellow', label: '🟨 Yellow' },
            { value: 'green', label: '🟩 Green' },
            { value: 'blue', label: '🟦 Blue' },
            { value: 'navy', label: '🔷 Navy' },
            { value: 'purple', label: '🟪 Purple' },
            { value: 'gold', label: '🟨 Gold' },
            { value: 'silver', label: '⬜ Silver' },
            { value: 'multicolor', label: '🌈 Multicolor' }
        ]
    },

    material: {
        type: 'dropdown',
        label: 'Material',
        placeholder: 'Any Material',
        width: 'third',
        options: [
            { value: '', label: 'Any Material' },
            { value: 'cotton', label: 'Cotton' },
            { value: 'linen', label: 'Linen' },
            { value: 'silk', label: 'Silk' },
            { value: 'wool', label: 'Wool' },
            { value: 'cashmere', label: 'Cashmere' },
            { value: 'leather', label: 'Leather' },
            { value: 'faux-leather', label: 'Faux Leather' },
            { value: 'denim', label: 'Denim' },
            { value: 'polyester', label: 'Polyester' },
            { value: 'nylon', label: 'Nylon' },
            { value: 'viscose', label: 'Viscose' },
            { value: 'synthetic', label: 'Synthetic' },
            { value: 'mixed', label: 'Mixed Materials' }
        ]
    },

    style: {
        type: 'dropdown',
        label: 'Style',
        placeholder: 'Any Style',
        width: 'third',
        options: [
            { value: '', label: 'Any Style' },
            { value: 'casual', label: 'Casual' },
            { value: 'formal', label: 'Formal' },
            { value: 'business', label: 'Business' },
            { value: 'sporty', label: 'Sporty' },
            { value: 'elegant', label: 'Elegant' },
            { value: 'vintage', label: 'Vintage' },
            { value: 'bohemian', label: 'Bohemian' },
            { value: 'streetwear', label: 'Streetwear' },
            { value: 'minimalist', label: 'Minimalist' },
            { value: 'romantic', label: 'Romantic' },
            { value: 'edgy', label: 'Edgy' },
            { value: 'classic', label: 'Classic' }
        ]
    },

    season: {
        type: 'dropdown',
        label: 'Season',
        placeholder: 'Any Season',
        width: 'third',
        options: [
            { value: '', label: 'Any Season' },
            { value: 'spring', label: '🌸 Spring' },
            { value: 'summer', label: '☀️ Summer' },
            { value: 'autumn', label: '🍂 Autumn' },
            { value: 'winter', label: '❄️ Winter' },
            { value: 'all-season', label: '🔄 All Season' }
        ]
    },

    pattern: {
        type: 'dropdown',
        label: 'Pattern',
        placeholder: 'Any Pattern',
        width: 'third',
        options: [
            { value: '', label: 'Any Pattern' },
            { value: 'solid', label: 'Solid' },
            { value: 'striped', label: 'Striped' },
            { value: 'floral', label: 'Floral' },
            { value: 'polka-dot', label: 'Polka Dot' },
            { value: 'checkered', label: 'Checkered' },
            { value: 'animal-print', label: 'Animal Print' },
            { value: 'geometric', label: 'Geometric' },
            { value: 'abstract', label: 'Abstract' },
            { value: 'camouflage', label: 'Camouflage' }
        ]
    },

    fit: {
        type: 'dropdown',
        label: 'Fit',
        placeholder: 'Any Fit',
        width: 'third',
        options: [
            { value: '', label: 'Any Fit' },
            { value: 'slim', label: 'Slim Fit' },
            { value: 'regular', label: 'Regular Fit' },
            { value: 'loose', label: 'Loose Fit' },
            { value: 'oversized', label: 'Oversized' },
            { value: 'tailored', label: 'Tailored' },
            { value: 'skinny', label: 'Skinny' },
            { value: 'relaxed', label: 'Relaxed' }
        ]
    },

    occasion: {
        type: 'dropdown',
        label: 'Occasion',
        placeholder: 'Any Occasion',
        width: 'third',
        options: [
            { value: '', label: 'Any Occasion' },
            { value: 'everyday', label: 'Everyday' },
            { value: 'work', label: 'Work' },
            { value: 'party', label: 'Party' },
            { value: 'wedding', label: 'Wedding' },
            { value: 'formal-event', label: 'Formal Event' },
            { value: 'beach', label: 'Beach' },
            { value: 'sport', label: 'Sport' },
            { value: 'casual-outing', label: 'Casual Outing' }
        ]
    },

    features: {
        type: 'checkboxes',
        label: 'Features',
        width: 'full',
        options: [
            { value: 'sustainable', label: 'Sustainable/Eco-Friendly' },
            { value: 'handmade', label: 'Handmade' },
            { value: 'designer', label: 'Designer' },
            { value: 'limited-edition', label: 'Limited Edition' },
            { value: 'waterproof', label: 'Waterproof' },
            { value: 'breathable', label: 'Breathable' },
            { value: 'reversible', label: 'Reversible' },
            { value: 'wrinkle-free', label: 'Wrinkle-Free' },
            { value: 'quick-dry', label: 'Quick Dry' },
            { value: 'plus-size', label: 'Plus Size Available' }
        ]
    }
};
