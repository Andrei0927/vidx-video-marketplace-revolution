const jobsFilterSchema = {
    // Job Category - Always visible dropdown
    category: {
        type: 'dropdown',
        label: 'Job Category',
        width: 'full',
        alwaysVisible: true,
        options: [
            { id: 'all', value: '', label: '💼 All Categories' },
            { id: 'it', value: 'IT & Technology', label: '💻 IT & Technology' },
            { id: 'marketing', value: 'Marketing & Sales', label: '📊 Marketing & Sales' },
            { id: 'finance', value: 'Finance & Accounting', label: '💰 Finance & Accounting' },
            { id: 'healthcare', value: 'Healthcare & Medical', label: '⚕️ Healthcare & Medical' },
            { id: 'engineering', value: 'Engineering', label: '⚙️ Engineering' },
            { id: 'education', value: 'Education & Training', label: '📚 Education & Training' },
            { id: 'hospitality', value: 'Hospitality & Tourism', label: '🏨 Hospitality & Tourism' },
            { id: 'retail', value: 'Retail & Customer Service', label: '🛍️ Retail & Customer Service' },
            { id: 'construction', value: 'Construction & Trades', label: '🏗️ Construction & Trades' },
            { id: 'logistics', value: 'Logistics & Transportation', label: '🚚 Logistics & Transportation' },
            { id: 'hr', value: 'Human Resources', label: '👥 Human Resources' },
            { id: 'legal', value: 'Legal', label: '⚖️ Legal' },
            { id: 'design', value: 'Design & Creative', label: '🎨 Design & Creative' },
            { id: 'admin', value: 'Admin & Office', label: '📋 Admin & Office' },
            { id: 'management', value: 'Management & Executive', label: '👔 Management & Executive' }
        ]
    },

    // Job Type - Always visible
    jobType: {
        type: 'multi-select',
        label: 'Job Type',
        width: 'full',
        alwaysVisible: true,
        options: [
            'Full-Time',
            'Part-Time',
            'Contract',
            'Temporary',
            'Internship',
            'Freelance',
            'Remote',
            'Hybrid'
        ]
    },

    // Salary Range - Always visible
    salaryRange: {
        type: 'range',
        label: 'Salary Range (€/month)',
        width: 'full',
        alwaysVisible: true,
        range: {
            min: 0,
            max: 15000,
            step: 500,
            unit: '€'
        },
        inputs: {
            from: { placeholder: 'Min salary', id: 'salary-from' },
            to: { placeholder: 'Max salary', id: 'salary-to' }
        }
    },

    // Location - Always visible
    location: {
        type: 'text',
        label: 'Location',
        placeholder: 'City or region',
        width: 'full',
        alwaysVisible: true
    },

    // Experience Level - Collapsible
    experienceLevel: {
        type: 'dropdown',
        label: 'Experience Level',
        width: 'half',
        options: [
            { value: '', label: 'Any Experience' },
            { value: 'Entry Level', label: 'Entry Level (0-2 years)' },
            { value: 'Mid Level', label: 'Mid Level (2-5 years)' },
            { value: 'Senior Level', label: 'Senior Level (5-10 years)' },
            { value: 'Expert', label: 'Expert (10+ years)' },
            { value: 'Manager', label: 'Manager' },
            { value: 'Director', label: 'Director' },
            { value: 'Executive', label: 'Executive' }
        ]
    },

    // Education Level - Collapsible
    educationLevel: {
        type: 'dropdown',
        label: 'Education Level',
        width: 'half',
        options: [
            { value: '', label: 'Any Education' },
            { value: 'High School', label: 'High School' },
            { value: 'Vocational', label: 'Vocational Training' },
            { value: 'Bachelor', label: 'Bachelor\'s Degree' },
            { value: 'Master', label: 'Master\'s Degree' },
            { value: 'PhD', label: 'PhD/Doctorate' },
            { value: 'Professional', label: 'Professional Certification' }
        ]
    },

    // Work Schedule - Collapsible
    workSchedule: {
        type: 'multi-select',
        label: 'Work Schedule',
        width: 'full',
        options: [
            'Monday-Friday',
            'Weekends',
            'Flexible Hours',
            'Shift Work',
            'Night Shift',
            'Rotating Shifts',
            '24/7 Availability'
        ]
    },

    // Company Size - Collapsible
    companySize: {
        type: 'dropdown',
        label: 'Company Size',
        width: 'half',
        options: [
            { value: '', label: 'Any Size' },
            { value: 'Startup', label: 'Startup (1-10)' },
            { value: 'Small', label: 'Small (11-50)' },
            { value: 'Medium', label: 'Medium (51-200)' },
            { value: 'Large', label: 'Large (201-1000)' },
            { value: 'Enterprise', label: 'Enterprise (1000+)' }
        ]
    },

    // Industry - Collapsible
    industry: {
        type: 'dropdown',
        label: 'Industry',
        width: 'half',
        options: [
            { value: '', label: 'Any Industry' },
            { value: 'Technology', label: 'Technology' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Healthcare', label: 'Healthcare' },
            { value: 'Retail', label: 'Retail' },
            { value: 'Manufacturing', label: 'Manufacturing' },
            { value: 'Education', label: 'Education' },
            { value: 'Real Estate', label: 'Real Estate' },
            { value: 'Hospitality', label: 'Hospitality' },
            { value: 'Automotive', label: 'Automotive' },
            { value: 'Energy', label: 'Energy' },
            { value: 'Telecommunications', label: 'Telecommunications' },
            { value: 'Media', label: 'Media & Entertainment' },
            { value: 'Consulting', label: 'Consulting' },
            { value: 'Non-Profit', label: 'Non-Profit' }
        ]
    },

    // Benefits - Collapsible multi-select
    benefits: {
        type: 'multi-select',
        label: 'Benefits',
        width: 'full',
        options: [
            'Health Insurance',
            'Dental Insurance',
            'Vision Insurance',
            'Life Insurance',
            'Pension Plan',
            'Stock Options',
            'Performance Bonus',
            'Paid Time Off',
            'Sick Leave',
            'Parental Leave',
            'Gym Membership',
            'Meal Vouchers',
            'Transportation Allowance',
            'Remote Work',
            'Flexible Hours',
            'Professional Development',
            'Training Programs',
            'Company Car',
            'Phone Allowance',
            'Relocation Assistance'
        ]
    },

    // Skills Required - Collapsible
    skills: {
        type: 'multi-select',
        label: 'Key Skills',
        width: 'full',
        options: [
            // IT & Tech
            'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
            'Kubernetes', 'Machine Learning', 'Data Analysis', 'Cybersecurity',
            // Business
            'Project Management', 'Sales', 'Marketing', 'SEO', 'Content Marketing',
            'Social Media', 'CRM', 'Excel', 'PowerPoint', 'Negotiation',
            // General
            'Leadership', 'Communication', 'Problem Solving', 'Team Management',
            'Customer Service', 'Time Management', 'Analytical Skills'
        ]
    },

    // Languages - Collapsible
    languages: {
        type: 'multi-select',
        label: 'Languages Required',
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
            'Chinese',
            'Japanese',
            'Arabic',
            'Dutch',
            'Polish',
            'Turkish'
        ]
    },

    // Posted Date - Collapsible
    postedDate: {
        type: 'dropdown',
        label: 'Posted Date',
        width: 'half',
        options: [
            { value: '', label: 'Any Time' },
            { value: 'Today', label: 'Today' },
            { value: 'Last 3 Days', label: 'Last 3 Days' },
            { value: 'Last Week', label: 'Last Week' },
            { value: 'Last Month', label: 'Last Month' }
        ]
    },

    // Urgency - Collapsible
    urgency: {
        type: 'radio',
        label: 'Urgency',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'Urgent', label: 'Urgent Hiring' },
            { value: 'Normal', label: 'Normal' }
        ]
    },

    // Visa Sponsorship - Collapsible
    visaSponsorship: {
        type: 'radio',
        label: 'Visa Sponsorship',
        width: 'half',
        options: [
            { value: '', label: 'Any' },
            { value: 'Yes', label: 'Offers Sponsorship' },
            { value: 'No', label: 'No Sponsorship' }
        ]
    },

    // Career Level - Collapsible
    careerLevel: {
        type: 'dropdown',
        label: 'Career Level',
        width: 'half',
        options: [
            { value: '', label: 'Any Level' },
            { value: 'Student', label: 'Student' },
            { value: 'Entry', label: 'Entry Level' },
            { value: 'Experienced', label: 'Experienced' },
            { value: 'Manager', label: 'Manager' },
            { value: 'Senior Manager', label: 'Senior Manager' },
            { value: 'Executive', label: 'Executive/C-Level' }
        ]
    }
};

// Export for use in filter renderer
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { jobsFilterSchema };
}
