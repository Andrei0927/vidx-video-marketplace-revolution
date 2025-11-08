# VidX Platform - Ad ID Registry

This document contains all unique Ad IDs across the platform for reference and tracking.

## Format
- **Pattern**: `{category}-{item-description}`
- **Example**: `auto-vw-transporter-2021`
- All IDs are lowercase with hyphens
- IDs are globally unique across the platform

---

## Automotive (`automotive.html`)

| ID | Title | Price |
|----|-------|-------|
| `auto-vw-transporter-2021` | VW Transporter T6.1 2021 | €28,500 |
| `auto-audi-a5-sportback-2020` | Audi A5 Sportback 2020 | €32,900 |

---

## Fashion (`fashion.html`)

| ID | Title | Price |
|----|-------|-------|
| `fashion-vw-transporter-2021` | VW Transporter T6.1 2021 (Demo) | €28,500 |
| `fashion-audi-a5-sportback-2020` | Audi A5 Sportback (Demo) | €35,900 |

---

## Home & Garden (`home-garden.html`)

| ID | Title | Price |
|----|-------|-------|
| `home-modern-sofa-3-seater` | Modern 3-Seater Sofa | €450 |
| `home-dining-table-set-6-chairs` | Dining Table Set with 6 Chairs | €850 |
| `home-rattan-garden-furniture` | Rattan Garden Furniture Set | €1,200 |
| `home-industrial-floor-lamp` | Industrial Style Floor Lamp | €95 |

---

## Sports (`sports.html`)

| ID | Title | Price |
|----|-------|-------|
| `sports-specialized-road-bike` | Specialized Allez Road Bike | €1,200 |
| `sports-technogym-treadmill` | Technogym Treadmill Run 700 | €2,500 |
| `sports-wilson-pro-tennis-racket` | Wilson Pro Staff Tennis Racket | €180 |
| `sports-rossignol-ski-set` | Rossignol Experience Ski Set | €650 |
| `sports-nike-running-shoes` | Nike Air Zoom Pegasus Running Shoes | €120 |
| `sports-manduka-yoga-mat` | Manduka Pro Yoga Mat | €85 |

---

## Real Estate (`real-estate.html`)

| ID | Title | Price |
|----|-------|-------|
| `realestate-2br-apartment-bucharest` | Modern 2BR Apartment | €125,000 |
| `realestate-villa-pool-brasov` | Luxury Villa with Pool | €450,000 |
| `realestate-studio-rent-cluj` | Modern Studio for Rent | €450/month |
| `realestate-3br-house-rent-timisoara` | 3BR House for Rent | €850/month |
| `realestate-office-space-bucharest` | Modern Office Space | €1,200/month |
| `realestate-land-plot-ilfov` | Land Plot - Ready to Build | €75,000 |

---

## Jobs (`jobs.html`)

| ID | Title | Salary |
|----|-------|--------|
| `jobs-software-engineer-senior` | Senior Software Engineer | €4,500/month |
| `jobs-marketing-manager-mid` | Marketing Manager | €3,500/month |
| `jobs-accountant-mid` | Accountant | €2,800/month |
| `jobs-customer-service-entry` | Customer Service Representative | €1,800/month |
| `jobs-civil-engineer-senior` | Civil Engineer | €4,000/month |
| `jobs-english-teacher-mid` | English Teacher | €2,200/month |

---

## Services (`services.html`)

| ID | Title | Price |
|----|-------|-------|
| `service-plumbing-24-7` | Emergency Plumbing Service | €50/hour |
| `service-wedding-photography` | Professional Wedding Photography | €1,500/event |
| `service-personal-training` | Personal Fitness Training | €45/session |
| `service-computer-repair` | Computer Repair Service | €40/hour |
| `service-legal-consultation` | Legal Consultation | €100/hour |
| `service-dog-walking` | Dog Walking Service | €15/walk |

---

## Electronics (Dynamic - `electronics-page.js`)

Electronics page uses dynamically generated IDs from the Revid API.
IDs are generated using: `electronics-{listing.id}` or from the listing ID directly.

---

## Usage Notes

1. **Hardcoded Pages**: Use these exact IDs for like/favorite/share buttons
2. **Dynamic Pages**: IDs are generated programmatically
3. **New Ads**: Use `idGenerator.generateFromTitle(title, category)` to create new IDs
4. **ID Format**: Always use lowercase, hyphens, descriptive names

## ID Generator Examples

```javascript
// Generate automotive ID
const id = idGenerator.generateFromTitle('BMW X5 M Sport 2022', 'auto');
// Result: 'auto-bmw-x5-m-sport-2022'

// Generate home & garden ID
const id2 = idGenerator.generateFromTitle('Leather Armchair', 'home');
// Result: 'home-leather-armchair'

// Register the ad
idGenerator.registerAd(id, {
    title: 'BMW X5 M Sport 2022',
    category: 'automotive',
    price: '€65,000',
    seller: 'John Doe'
});
```

---

## Implementation Status

- ✅ Automotive: Complete with unique IDs
- ✅ Fashion: Scripts added, needs ID updates
- ✅ Home & Garden: Scripts added, needs ID updates  
- ✅ Sports: Scripts added, needs ID updates
- ✅ Real Estate: Scripts added, needs ID updates
- ✅ Jobs: Scripts added, needs ID updates
- ✅ Services: Scripts added, needs ID updates
- ✅ Electronics: Dynamic rendering with IDs

---

Last Updated: November 8, 2025
