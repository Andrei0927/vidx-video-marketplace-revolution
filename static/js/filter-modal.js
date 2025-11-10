/**
 * Category Filter Modal
 * Shows filters before video feed, applies user preferences
 */

// Check if filters have been applied in this session
const filtersApplied = sessionStorage.getItem(`filters_applied_${window.location.pathname}`);

// Get filter modal
const filterModal = document.getElementById('filter-modal');
const skipFiltersBtn = document.getElementById('skip-filters');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearAllFiltersBtn = document.getElementById('clear-all-filters');
const filterOptionsContainer = document.getElementById('filter-options-container');

// If filters already applied, hide modal
if (filtersApplied) {
    filterModal.style.transform = 'translateY(-100%)';
    filterModal.style.pointerEvents = 'none';
}

// Skip filters - go straight to feed
skipFiltersBtn.addEventListener('click', () => {
    sessionStorage.setItem(`filters_applied_${window.location.pathname}`, 'true');
    filterModal.style.transform = 'translateY(-100%)';
    setTimeout(() => {
        filterModal.style.pointerEvents = 'none';
    }, 300);
});

// Apply filters - save preferences and show feed
applyFiltersBtn.addEventListener('click', () => {
    // Collect all filter values
    const filters = collectFilters();
    
    // Save to sessionStorage
    sessionStorage.setItem(`filters_${window.location.pathname}`, JSON.stringify(filters));
    sessionStorage.setItem(`filters_applied_${window.location.pathname}`, 'true');
    
    // Hide modal
    filterModal.style.transform = 'translateY(-100%)';
    setTimeout(() => {
        filterModal.style.pointerEvents = 'none';
    }, 300);
    
    // Apply filters to video feed
    applyFiltersToFeed(filters);
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
    // Import filter schema for this category
    import(`/static/js/${category}-filter-schema.js`)
        .then(module => {
            const schema = module.default || module.filterSchema;
            renderFilters(schema);
            feather.replace();
        })
        .catch(err => {
            console.error('Failed to load filter schema:', err);
            // Fallback to basic filters
            renderBasicFilters();
            feather.replace();
        });
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

// Export for use in other scripts
export { collectFilters, applyFiltersToFeed };
