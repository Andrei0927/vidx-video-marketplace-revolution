# Category Architecture & Naming Scheme

## File Naming Convention

VidX uses a clear two-page pattern for each category:

### Pattern
- **Search Page**: `search.html` or `search-{category}.html` - Advanced filters
- **Feed Page**: `{category}.html` - TikTok-style video browsing

### Current Implementation

| Category | Search Page | Feed Page | Status |
|----------|------------|-----------|--------|
| Automotive | `search.html` | `automotive.html` | ✅ Complete |
| Electronics | `search-electronics.html` | `electronics.html` | 🚧 Planned |
| Fashion | `search-fashion.html` | `fashion.html` | 🚧 Planned |
| Home & Garden | `search-home-garden.html` | `home-garden.html` | 🚧 Planned |
| Sports | `search-sports.html` | `sports.html` | 🚧 Planned |
| Real Estate | `search-real-estate.html` | `real-estate.html` | 🚧 Planned |

## User Flow

```
index.html (Homepage)
    ↓
    Click "Automotive" category
    ↓
search.html (Filter & Search)
    ↓
    Apply Filters → localStorage
    ↓
automotive.html (TikTok Feed)
    ↓
    Click video → details.html?ad={id}
```

## Page Responsibilities

### Search Pages (search.html, search-{category}.html)
**Purpose**: Advanced filtering and search interface

**Features**:
- Category-specific filters
- Quick search bar
- Collapsible filter sections
- Range inputs (price, year, mileage, etc.)
- Multiple selection (checkboxes)
- Single selection (radio buttons)
- Active filter tags with remove buttons
- Filter count display
- Dark mode support
- Mobile responsive

**Actions**:
- Save filters to `localStorage` with key pattern: `{category}Filters`
- Redirect to feed page on "Apply Filters"
- Clear filters button
- Live filter updates

### Feed Pages ({category}.html)
**Purpose**: TikTok-style video browsing with applied filters

**Features**:
- Full-screen vertical video scrolling
- Snap scrolling (mobile)
- Hover-to-play (desktop)
- Tap-to-unmute
- Volume indicator
- Video metadata overlay
- Filter results based on localStorage
- Autoplay with intersection observer

**Actions**:
- Load filters from `localStorage`
- Filter video cards based on criteria
- Navigate to details page on click

### Details Page (details.html)
**Purpose**: Full listing details and contact options

**Features**:
- Large video player
- Full specifications
- Seller information
- Contact buttons
- Share functionality
- Related listings

## Automotive Filters (Complete Implementation)

### Filter Categories (14 total)

1. **Quick Search**: Keyword search across make, model
2. **Type** (7 options): Cars, Commercial, Trucks & Trailers, Motorcycles, Scooters & ATV, Boats, Industrial & Farm
3. **Price Range**: From/To numeric inputs
4. **Year Range**: From/To numeric inputs  
5. **Body Type** (10 options): Coupe, Cabrio, Sedan, Pick-up, Hatchback, Estate, Off-road, Minibus, People Carrier, SUV
6. **Make** (100+ brands): Searchable dropdown with all major automotive brands
7. **Mileage Range**: From/To in kilometers
8. **Fuel Type** (5 options): Petrol, Diesel, LPG, Hybrid, Electric
9. **Transmission**: Automatic, Manual, Any
10. **Displacement Range**: From/To in liters
11. **Power Range**: From/To in HP
12. **Color** (10 options): White, Black, Gray, Silver, Blue, Red, Green, Yellow/Gold, Brown/Beige, Other
13. **Steering Wheel**: Left-hand drive, Right-hand drive, Any
14. **Condition** (3 options): New, Used, Damaged

### localStorage Structure

```javascript
{
  "automotiveFilters": {
    "quickSearch": "BMW",
    "type": ["Cars"],
    "priceFrom": "20000",
    "priceTo": "50000",
    "yearFrom": "2018",
    "yearTo": "2024",
    "bodyType": ["SUV", "Sedan"],
    "make": ["BMW", "Audi"],
    "mileageFrom": "0",
    "mileageTo": "100000",
    "fuel": ["Diesel", "Hybrid"],
    "transmission": "Automatic",
    "displacementFrom": "2.0",
    "displacementTo": "3.5",
    "powerFrom": "150",
    "powerTo": "400",
    "color": ["Black", "White"],
    "steering": "Left-hand drive",
    "condition": ["New", "Used"]
  }
}
```

## Creating New Category Search Pages

### Template Checklist

When creating a new category search page (e.g., `search-electronics.html`):

1. **Copy** `search.html` as base template
2. **Update** page title and heading
3. **Replace** filter sections with category-specific filters
4. **Update** localStorage key (e.g., `electronicsFilters`)
5. **Update** redirect target (e.g., `electronics.html`)
6. **Update** icon to match category
7. **Test** filter functionality
8. **Update** `index.html` link to new search page

### Example Filter Sets by Category

#### Electronics
- Type: Phones, Laptops, Tablets, Cameras, Audio, Gaming
- Brand: Apple, Samsung, Sony, LG, Dell, HP, etc.
- Price Range
- Condition: New, Used, Refurbished
- Storage: 64GB, 128GB, 256GB, 512GB, 1TB+
- RAM: 4GB, 8GB, 16GB, 32GB+
- Screen Size
- Operating System: iOS, Android, Windows, macOS, Linux

#### Fashion
- Category: Clothing, Shoes, Accessories, Bags
- Gender: Men, Women, Unisex, Kids
- Size: XS, S, M, L, XL, XXL
- Brand: Nike, Adidas, Zara, H&M, etc.
- Color
- Condition: New with tags, New without tags, Used
- Material
- Season: Spring/Summer, Fall/Winter

#### Real Estate
- Type: Apartment, House, Studio, Commercial, Land
- Rooms: 1, 2, 3, 4, 5+
- Bathrooms: 1, 2, 3, 4+
- Area (m²): From/To
- Price Range
- Location: City, District, Neighborhood
- Amenities: Parking, Garden, Balcony, Elevator
- Condition: New, Renovated, Needs renovation
- Furnished: Yes, No, Partially

## Best Practices

### UX Principles
1. **Progressive Disclosure**: Use collapsible sections for advanced filters
2. **Immediate Feedback**: Show active filter count and tags
3. **Easy Reset**: Individual tag removal + clear all button
4. **Mobile First**: Touch-friendly controls, adequate spacing
5. **Search**: Provide search within large dropdown lists (like Make)

### Performance
1. **Lazy Loading**: Only expand filter sections when clicked
2. **Debounce**: Use debouncing for search inputs
3. **localStorage**: Keep filter state across sessions
4. **Minimal DOM**: Use CSS for show/hide instead of creating/destroying elements

### Accessibility
1. **Labels**: All inputs have associated labels
2. **Keyboard Navigation**: All filters keyboard accessible
3. **ARIA**: Use appropriate ARIA labels for screen readers
4. **Color Contrast**: Maintain WCAG AA standards in light/dark modes

## Future Enhancements

### Planned Features
- [ ] Save favorite searches
- [ ] Filter presets (e.g., "Luxury SUVs under €50k")
- [ ] Filter sharing via URL parameters
- [ ] Recently used filters
- [ ] Popular filters suggestions
- [ ] Advanced sorting options
- [ ] Map view integration (for location-based categories)
- [ ] Price history graphs
- [ ] Compare feature (select multiple items)

### Technical Improvements
- [ ] Create reusable filter components
- [ ] Shared filter logic library
- [ ] Filter validation
- [ ] Error handling for invalid ranges
- [ ] Analytics tracking for popular filters
- [ ] A/B testing different filter layouts
- [ ] Filter recommendations based on user behavior

## Integration Points

### Current Integrations
- **Authentication**: User dropdown in nav
- **Theme System**: Dark mode toggle
- **localStorage**: Filter persistence
- **Feather Icons**: UI iconography

### Future Integrations
- **Backend API**: Real-time filter counts
- **Database**: Filter options from inventory
- **Analytics**: Track filter usage
- **Search Engine**: Advanced search algorithms
- **Geolocation**: Location-based filtering
- **AI**: Smart filter suggestions

---

**Last Updated**: November 7, 2025  
**Version**: 1.0  
**Status**: Automotive filters complete, other categories planned
