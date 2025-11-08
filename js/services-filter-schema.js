const servicesFilterSchema = {
    // Service Category - Always visible dropdown
    category: {
        type: 'dropdown',
        label: 'Service Category',
        width: 'full',
        alwaysVisible: true,
        options: [
            { id: 'all', value: '', label: '🛠️ All Services' },
            { id: 'home', value: 'Home Services', label: '🏠 Home Services' },
            { id: 'professional', value: 'Professional Services', label: '💼 Professional Services' },
            { id: 'events', value: 'Events & Entertainment', label: '🎉 Events & Entertainment' },
            { id: 'beauty', value: 'Beauty & Wellness', label: '💅 Beauty & Wellness' },
            { id: 'automotive', value: 'Automotive Services', label: '🚗 Automotive Services' },
            { id: 'pet', value: 'Pet Services', label: '🐾 Pet Services' },
            { id: 'education', value: 'Education & Training', label: '📚 Education & Training' },
            { id: 'tech', value: 'Tech & IT Services', label: '💻 Tech & IT Services' },
            { id: 'health', value: 'Health & Medical', label: '⚕️ Health & Medical' },
            { id: 'moving', value: 'Moving & Delivery', label: '📦 Moving & Delivery' },
            { id: 'creative', value: 'Creative Services', label: '🎨 Creative Services' },
            { id: 'business', value: 'Business Services', label: '📊 Business Services' }
        ]
    },

    // Service Type - Always visible
    serviceType: {
        type: 'dropdown',
        label: 'Service Type',
        width: 'full',
        alwaysVisible: true,
        options: [
            { value: '', label: 'All Types' },
            // Home Services
            { value: 'Plumbing', label: 'Plumbing' },
            { value: 'Electrical', label: 'Electrical' },
            { value: 'Cleaning', label: 'Cleaning' },
            { value: 'Painting', label: 'Painting' },
            { value: 'Carpentry', label: 'Carpentry' },
            { value: 'HVAC', label: 'HVAC' },
            { value: 'Roofing', label: 'Roofing' },
            { value: 'Gardening', label: 'Gardening & Landscaping' },
            { value: 'Pest Control', label: 'Pest Control' },
            { value: 'Appliance Repair', label: 'Appliance Repair' },
            // Professional Services
            { value: 'Legal', label: 'Legal Services' },
            { value: 'Accounting', label: 'Accounting & Tax' },
            { value: 'Consulting', label: 'Consulting' },
            { value: 'Real Estate', label: 'Real Estate Agent' },
            { value: 'Financial Planning', label: 'Financial Planning' },
            { value: 'Translation', label: 'Translation' },
            { value: 'Notary', label: 'Notary Services' },
            // Events
            { value: 'Photography', label: 'Photography' },
            { value: 'Videography', label: 'Videography' },
            { value: 'DJ', label: 'DJ Services' },
            { value: 'Catering', label: 'Catering' },
            { value: 'Event Planning', label: 'Event Planning' },
            { value: 'Entertainment', label: 'Entertainment' },
            // Beauty & Wellness
            { value: 'Hair Salon', label: 'Hair Salon' },
            { value: 'Barbershop', label: 'Barbershop' },
            { value: 'Nails', label: 'Nail Salon' },
            { value: 'Spa', label: 'Spa & Massage' },
            { value: 'Personal Trainer', label: 'Personal Training' },
            { value: 'Yoga', label: 'Yoga Instruction' },
            { value: 'Nutrition', label: 'Nutrition Coaching' },
            // Automotive
            { value: 'Car Repair', label: 'Car Repair' },
            { value: 'Car Wash', label: 'Car Wash & Detailing' },
            { value: 'Towing', label: 'Towing' },
            { value: 'Auto Body', label: 'Auto Body Shop' },
            // Pet Services
            { value: 'Grooming', label: 'Pet Grooming' },
            { value: 'Walking', label: 'Dog Walking' },
            { value: 'Sitting', label: 'Pet Sitting' },
            { value: 'Training', label: 'Pet Training' },
            { value: 'Veterinary', label: 'Veterinary' },
            // Education
            { value: 'Tutoring', label: 'Tutoring' },
            { value: 'Language Lessons', label: 'Language Lessons' },
            { value: 'Music Lessons', label: 'Music Lessons' },
            { value: 'Driving School', label: 'Driving School' },
            // Tech & IT
            { value: 'Computer Repair', label: 'Computer Repair' },
            { value: 'Phone Repair', label: 'Phone Repair' },
            { value: 'Web Development', label: 'Web Development' },
            { value: 'IT Support', label: 'IT Support' },
            { value: 'Software Development', label: 'Software Development' },
            // Health
            { value: 'Dentist', label: 'Dentist' },
            { value: 'Physiotherapy', label: 'Physiotherapy' },
            { value: 'Therapy', label: 'Therapy & Counseling' },
            { value: 'Chiropractor', label: 'Chiropractor' },
            // Moving & Delivery
            { value: 'Moving', label: 'Moving Services' },
            { value: 'Courier', label: 'Courier & Delivery' },
            { value: 'Furniture Assembly', label: 'Furniture Assembly' },
            // Creative
            { value: 'Graphic Design', label: 'Graphic Design' },
            { value: 'Video Editing', label: 'Video Editing' },
            { value: 'Writing', label: 'Writing & Copywriting' },
            { value: 'Marketing', label: 'Marketing Services' }
        ]
    },

    // Price Range - Always visible
    priceRange: {
        type: 'range',
        label: 'Price Range (€)',
        width: 'full',
        alwaysVisible: true,
        min: 0,
        max: 5000,
        step: 50,
        unit: '€'
    },

    // Location - Always visible
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'City or region',
        width: 'full',
        alwaysVisible: true
    },

    // Service Provider Type - Collapsible
    providerType: {
        type: 'radio',
        label: 'Provider Type',
        width: 'full',
        options: [
            { value: '', label: 'All Providers' },
            { value: 'Individual', label: 'Individual' },
            { value: 'Company', label: 'Company' },
            { value: 'Freelancer', label: 'Freelancer' }
        ]
    },

    // Experience Level - Collapsible
    experienceLevel: {
        type: 'dropdown',
        label: 'Experience Level',
        width: 'half',
        options: [
            { value: '', label: 'Any Experience' },
            { value: 'Entry Level', label: 'Entry Level (0-2 years)' },
            { value: 'Experienced', label: 'Experienced (2-5 years)' },
            { value: 'Expert', label: 'Expert (5+ years)' }
        ]
    },

    // Availability - Collapsible
    availability: {
        type: 'multi-select',
        label: 'Availability',
        width: 'full',
        options: [
            'Weekdays',
            'Weekends',
            'Evenings',
            'Emergency/24-7',
            'Same Day Service',
            'Flexible Schedule'
        ]
    },

    // Service Location - Collapsible
    serviceLocation: {
        type: 'radio',
        label: 'Service Location',
        width: 'full',
        options: [
            { value: '', label: 'Any Location' },
            { value: 'On-site', label: 'On-site (at customer location)' },
            { value: 'Remote', label: 'Remote/Online' },
            { value: 'Studio', label: 'At provider\'s location' }
        ]
    },

    // Certification - Collapsible
    certification: {
        type: 'multi-select',
        label: 'Certification & Credentials',
        width: 'full',
        options: [
            'Licensed',
            'Insured',
            'Certified',
            'Background Checked',
            'Bonded',
            'Award Winner',
            'Verified Reviews'
        ]
    },

    // Languages - Collapsible
    languages: {
        type: 'multi-select',
        label: 'Languages Spoken',
        width: 'full',
        options: [
            'English',
            'Romanian',
            'Spanish',
            'French',
            'German',
            'Italian',
            'Portuguese',
            'Russian',
            'Arabic',
            'Chinese'
        ]
    },

    // Payment Methods - Collapsible
    paymentMethods: {
        type: 'multi-select',
        label: 'Payment Methods',
        width: 'full',
        options: [
            'Cash',
            'Card',
            'Bank Transfer',
            'PayPal',
            'Crypto',
            'Installments',
            'Invoice'
        ]
    },

    // Rating - Collapsible
    rating: {
        type: 'dropdown',
        label: 'Minimum Rating',
        width: 'half',
        options: [
            { value: '', label: 'Any Rating' },
            { value: '4.5', label: '4.5+ Stars' },
            { value: '4.0', label: '4.0+ Stars' },
            { value: '3.5', label: '3.5+ Stars' },
            { value: '3.0', label: '3.0+ Stars' }
        ]
    },

    // Response Time - Collapsible
    responseTime: {
        type: 'dropdown',
        label: 'Response Time',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'Under 1 hour', label: 'Under 1 hour' },
            { value: 'Under 24 hours', label: 'Under 24 hours' },
            { value: 'Under 3 days', label: 'Under 3 days' }
        ]
    },

    // Special Offers - Collapsible
    specialOffers: {
        type: 'multi-select',
        label: 'Special Offers',
        width: 'full',
        options: [
            'First-time Discount',
            'Free Consultation',
            'Free Quote',
            'Package Deals',
            'Seasonal Offers',
            'Loyalty Program'
        ]
    }
};

// Export for use in filter renderer
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { servicesFilterSchema };
}
