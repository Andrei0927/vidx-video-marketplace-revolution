# Filter Renderer Integration Guide

## Overview

The dynamic filter renderer system generates filter UI from schema definitions with full support for OLX.ro-inspired filter structure, implemented with VidX's design language.

**No OLX graphics, assets, or branding** - only their filter structure adapted to VidX's superior design.

## Files

- `js/filter-renderer.js` - Main FilterRenderer class
- `js/automotive-filter-schema.js` - Automotive filters + car models data
- `js/electronics-filter-schema.js` - Electronics/tech filters
- `js/fashion-filter-schema.js` - Fashion/apparel filters
- `filter-renderer-example.html` - Live demo (switch between categories)

## Quick Start

### 1. Include Required Files

```html
<!-- Include schemas -->
<script src="js/automotive-filter-schema.js"></script>
<script src="js/electronics-filter-schema.js"></script>
<script src="js/fashion-filter-schema.js"></script>

<!-- Include renderer -->
<script src="js/filter-renderer.js"></script>

<!-- Feather icons (already in your project) -->
<script src="https://unpkg.com/feather-icons"></script>
```

### 2. Basic Usage

```html
<!-- Container for filters -->
<div id="filter-container" class="space-y-4"></div>

<script>
// Initialize renderer with automotive schema
const renderer = new FilterRenderer(automotiveFilterSchema, 'filter-container', {
    carModels: carModels  // Required for make-model dependency
});

// Set up callbacks
renderer.on('onChange', (filters) => {
    console.log('Filters changed:', filters);
    // Update UI, save to localStorage, etc.
});

renderer.on('onApply', (filters) => {
    console.log('Apply filters:', filters);
    // Redirect to results page or fetch filtered data
    window.location.href = 'automotive.html?filters=' + encodeURIComponent(JSON.stringify(filters));
});

renderer.on('onClear', () => {
    console.log('Filters cleared');
    // Clear localStorage, reset UI, etc.
});

// Render the filters
renderer.render();

// Replace feather icons
feather.replace();
</script>
```

### 3. Integrate into search.html

Replace your existing filter HTML in `search.html` with:

```html
<!-- Filters Card -->
<div class="bg-white dark:bg-dark-100 rounded-lg shadow-md dark:shadow-dark-200 p-6 mb-8">
    <!-- Dynamic Filter Container -->
    <div id="filter-container" class="space-y-4"></div>
    
    <!-- Active Filters Display (optional) -->
    <div id="active-filters" class="mt-6 flex flex-wrap gap-2"></div>
</div>

<script src="js/automotive-filter-schema.js"></script>
<script src="js/filter-renderer.js"></script>
<script>
    // Initialize automotive filters
    const automotiveRenderer = new FilterRenderer(
        automotiveFilterSchema, 
        'filter-container',
        { carModels: carModels }
    );
    
    // Handle filter changes
    automotiveRenderer.on('onChange', (filters) => {
        // Update active filters display
        displayActiveFilters(filters);
    });
    
    // Handle apply button
    automotiveRenderer.on('onApply', (filters) => {
        // Save to localStorage
        localStorage.setItem('automotiveFilters', JSON.stringify(filters));
        
        // Redirect to results
        window.location.href = 'automotive.html';
    });
    
    // Handle clear button
    automotiveRenderer.on('onClear', () => {
        localStorage.removeItem('automotiveFilters');
        displayActiveFilters({});
    });
    
    // Render
    automotiveRenderer.render();
    feather.replace();
    
    // Optional: Display active filters as tags
    function displayActiveFilters(filters) {
        const container = document.getElementById('active-filters');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (Object.keys(filters).length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-dark-400 italic">No filters applied</p>';
            return;
        }
        
        Object.entries(filters).forEach(([key, value]) => {
            const values = Array.isArray(value) ? value : [value];
            values.forEach(val => {
                if (val) {
                    const tag = document.createElement('span');
                    tag.className = 'inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm';
                    tag.innerHTML = `
                        <span>${key}: ${val}</span>
                        <button class="hover:text-indigo-600 dark:hover:text-indigo-400">
                            <i data-feather="x" class="h-4 w-4"></i>
                        </button>
                    `;
                    container.appendChild(tag);
                }
            });
        });
        
        feather.replace();
    }
</script>
```

## Filter Schema Structure

### Filter Types

1. **range** - From/To number inputs
   ```javascript
   price: {
       type: 'range',
       label: 'Price',
       range: { min: 0, max: 500000, step: 500 },
       inputs: {
           from: { id: 'price-from', placeholder: 'Min' },
           to: { id: 'price-to', placeholder: 'Max' }
       }
   }
   ```

2. **dropdown** - Select dropdown
   ```javascript
   make: {
       type: 'dropdown',
       label: 'Make',
       required: false,
       options: [
           { value: '', label: 'Any' },
           { value: 'Audi', label: 'Audi' },
           // ... more options
       ]
   }
   ```

3. **multi-select** - Checkbox grid
   ```javascript
   bodyType: {
       type: 'multi-select',
       label: 'Body Type',
       collapsible: true,
       options: [
           { value: 'Sedan', label: 'Sedan' },
           { value: 'SUV', label: 'SUV / Crossover' },
           // ... more options
       ]
   }
   ```

4. **radio** - Radio buttons
   ```javascript
   transmission: {
       type: 'radio',
       label: 'Transmission',
       collapsible: true,
       options: [
           { value: '', label: 'Any' },
           { value: 'Manual', label: 'Manual' },
           { value: 'Automatic', label: 'Automatic' }
       ]
   }
   ```

5. **text** - Text input
   ```javascript
   location: {
       type: 'text',
       label: 'Location',
       placeholder: 'e.g., București, Cluj-Napoca',
       optional: true
   }
   ```

## Make-Model Dependency

The renderer automatically handles make-model dependencies:

```javascript
// Car models data (already in automotive-filter-schema.js)
const carModels = {
    'Audi': ['A1', 'A3', 'A4', ...],
    'BMW': ['1 Series', '2 Series', ...],
    // ... 40+ brands with models
};

// Pass to renderer
const renderer = new FilterRenderer(schema, 'container', {
    carModels: carModels
});
```

**Behavior:**
- Model dropdown disabled until Make selected
- Selecting Make populates Model with relevant models
- Selecting "Other" Make disables Model (not applicable)
- Makes without model data show "Other" option

## Styling

All filters use VidX's existing design system:

- **Colors:** Indigo primary, gray neutrals, dark mode support
- **Spacing:** Tailwind spacing scale
- **Typography:** Your existing font stack
- **Components:** Rounded corners, shadows, hover states
- **Icons:** Feather icons (already in project)

### Customization

Modify `js/filter-renderer.js` class names:

```javascript
// Example: Change button colors
applyBtn.className = 'flex-1 px-6 py-3 bg-blue-600 text-white ...';

// Example: Change border colors
wrapper.className = 'border border-blue-200 rounded-lg';
```

## API Reference

### Constructor

```javascript
new FilterRenderer(schema, containerId, options)
```

**Parameters:**
- `schema` (Object) - Filter schema object
- `containerId` (String) - ID of container element
- `options` (Object) - Optional configuration
  - `carModels` (Object) - Car models data for make-model dependency

### Methods

#### `render()`
Renders all filters from schema into container.

```javascript
renderer.render();
```

#### `getFilters()`
Returns current filter values as object.

```javascript
const filters = renderer.getFilters();
// { make: 'Audi', model: 'A4', priceFrom: '10000', ... }
```

#### `clearFilters()`
Clears all filter values and resets UI.

```javascript
renderer.clearFilters();
```

#### `on(event, callback)`
Sets callback for events: `onChange`, `onApply`, `onClear`.

```javascript
renderer.on('onChange', (filters) => {
    console.log('Changed:', filters);
});
```

## Migration from Existing Filters

### Before (manual HTML):

```html
<div class="border rounded-lg p-4">
    <label>Make</label>
    <select id="make-select">
        <option value="">Any</option>
        <option value="Audi">Audi</option>
        <!-- 100+ options... -->
    </select>
</div>

<script>
    // Manual event handling
    document.getElementById('make-select').addEventListener('change', ...);
    // Manual model population
    // Manual filter collection
    // Manual clear logic
</script>
```

### After (schema-driven):

```javascript
const schema = {
    make: {
        type: 'dropdown',
        label: 'Make',
        options: [/* ... */]
    }
};

const renderer = new FilterRenderer(schema, 'container', { carModels });
renderer.render();
// All event handling, dependencies, styling automatic
```

## Advanced Usage

### URL Parameter Encoding

```javascript
renderer.on('onApply', (filters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            params.append(key, value.join(','));
        } else {
            params.append(key, value);
        }
    });
    
    window.location.href = `automotive.html?${params.toString()}`;
});
```

### LocalStorage Persistence

```javascript
// Save filters
renderer.on('onChange', (filters) => {
    localStorage.setItem('lastFilters', JSON.stringify(filters));
});

// Load saved filters on page load
const savedFilters = JSON.parse(localStorage.getItem('lastFilters') || '{}');
// Apply saved filters to UI (would need setFilters method)
```

### Multiple Categories

```javascript
// Category switcher
function loadCategory(category) {
    const schemas = {
        automotive: automotiveFilterSchema,
        electronics: electronicsFilterSchema,
        fashion: fashionFilterSchema
    };
    
    const renderer = new FilterRenderer(
        schemas[category], 
        'filter-container',
        { carModels: category === 'automotive' ? carModels : null }
    );
    
    renderer.render();
}

// Switch categories
document.getElementById('category-select').addEventListener('change', (e) => {
    loadCategory(e.target.value);
});
```

## OLX.ro Filter Structure (Reference)

We analyzed OLX.ro and adopted their filter structure (NOT their design):

**OLX Filter Categories:**
1. Category (All, Cars, Commercial, Motorcycles, etc.)
2. Subcategory (expandable with counts)
3. Body Type (Sedan, SUV, Hatchback, etc.)
4. Price Range (EUR/USD/RON toggle)
5. Year Range
6. Mileage Range
7. Make (dropdown with 100+ brands)
8. Model (depends on make)
9. Variant (optional text)
10. Fuel Type (Petrol, Diesel, Hybrid, Electric, etc.)
11. Transmission (Manual, Automatic, Semi-automatic)
12. Engine Displacement
13. Power (HP)
14. Color
15. Steering (Left/Right)
16. Condition (New, Used, Damaged)
17. Seller Type (Private, Dealer)
18. Features (4x4, Leather, Sunroof, etc.)

**VidX Implementation:**
✅ All 18 filter categories implemented
✅ Same logical structure
✅ VidX's superior design language
✅ Dark mode support (OLX doesn't have)
✅ Better mobile UX
✅ Cleaner, modern UI

## Testing

**Test the demo:**
```bash
# Open in browser
open filter-renderer-example.html

# Test make-model dependency with Automotive
# Test collapsible sections
# Test multi-select checkboxes
# Test range inputs
# Test Apply/Clear buttons
# Test dark mode toggle
```

**Expected behavior:**
- ✅ Filters render correctly for all 3 categories
- ✅ Make selection populates Model dropdown
- ✅ "Other" Make disables Model
- ✅ Collapsible sections expand/collapse
- ✅ Apply button shows JSON output
- ✅ Clear button resets all filters
- ✅ onChange fires on any filter change
- ✅ Dark mode styles apply correctly

## Next Steps

1. **Integrate into search.html** - Replace manual filter HTML
2. **Add URL parameters** - Share filtered searches
3. **Add result counts** - Show how many items match each filter
4. **Add filter persistence** - Remember user's last filters
5. **Add saved searches** - Let users save favorite filter combinations
6. **Create other category schemas** - Real Estate, Services, Jobs, etc.

## Support

The filter renderer is designed to be:
- **Extensible** - Easy to add new filter types
- **Maintainable** - Schema-driven, single source of truth
- **Consistent** - All filters use same design language
- **Accessible** - Semantic HTML, keyboard navigation ready
- **Responsive** - Mobile-first design

No OLX graphics or assets used - only their logical filter structure adapted to VidX's superior design system.
