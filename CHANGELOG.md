# Changelog - Video Marketplace

## [Build cb9] - 2025-11-14

### Fixed
- **User Listings Integration**: Fixed database type mismatch for `user_id` field
  - Changed from string `'demo-user'` to integer `1` to match PostgreSQL schema
  - Fixed query errors: "invalid input syntax for type integer: 'demo-user'"
  - Routes now correctly fetch user-specific listings from database

- **Upload Review Page Media Preview**: Fixed media not displaying in correct location
  - Added JavaScript to populate `#media-preview` div with uploaded media
  - Reads from `sessionStorage.uploadedFiles` stored in step 1
  - Dynamically creates `<video>` or `<img>` elements based on file type
  - Preview now appears in the designated "Media preview will appear here" section

- **My-Ads Page Dynamic Rendering**: Replaced hardcoded demo content with real data
  - Converted from static HTML to server-side Jinja2 rendering
  - Tab counts now dynamic: `Active ({{ active_listings|length }})`
  - Displays actual user listings filtered by `user_id`
  - Added empty state with "Create Listing" CTA when no listings exist
  - Shows real video/image previews, titles, prices, and dates

### Changed
- **routes/user.py**: Complete rewrite (28 → 94 lines)
  - Added `get_current_user_id()` - returns user ID from session or defaults to 1
  - Added `load_user_listings(user_id)` - fetches from PostgreSQL with user filter
  - Added `load_user_listings_from_json(user_id)` - fallback to db.json
  - Updated `my_ads()` route to categorize by status (active/pending/sold/archived)
  - Changed `user_id` from `'demo-user'` to `1` (integer)

- **api/listings.py**: Updated user ID handling
  - Changed `user_id = 'demo-user'` to `user_id = 1`
  - Ensures new listings save with correct integer user ID

- **templates/upload/step3.html**: Added media preview display logic (lines 233-261)
  - Parses uploadedFiles from sessionStorage
  - Checks file type (video vs image)
  - Injects appropriate HTML element into media-preview container
  - Handles errors gracefully with try-catch

- **templates/user/my-ads.html**: Converted to dynamic template (lines 15-88)
  - Replaced hardcoded demo cards with Jinja2 loops
  - Dynamic tab counts based on actual listing data
  - Real listing cards with database-driven content
  - Conditional rendering with empty states
  - Links to category detail pages: `/{{ listing.category }}/{{ listing.id }}`

### Technical Details

**Database Configuration:**
- PostgreSQL: video-marketplace-db.postgres.database.azure.com
- Schema: listings table with INTEGER user_id column
- Demo user ID: 1 (matches users table primary key)

**Docker Deployments:**
- Build cb7: Initial fixes attempt (had user_id type mismatch)
- Build cb8: Template updates deployed
- Build cb9: Fixed user_id integer conversion ✅

**Azure Container Registry:**
- Registry: vidxmarketplace.azurecr.io
- Image: vidx-marketplace:latest
- Webhook configured for continuous deployment

**Routes:**
- Upload flow: `/upload` → `/upload/details` → `/upload/review`
- My Ads: `/my-ads`
- API: POST `/api/listings`

### Architecture Notes

**Upload Flow:**
1. Step 1 (`/upload`): Upload media → Store in `sessionStorage.uploadedFiles`
2. Step 2 (`/upload/details`): Add details → Store in `sessionStorage.adDetails`
3. Step 3 (`/upload/review`): Review & publish
   - Display media preview from sessionStorage
   - Call POST `/api/listings` with user_id=1
   - Redirect to `/my-ads` on success

**User Authentication (Current State):**
- Using hardcoded `user_id = 1` for demo/testing
- Session framework ready: `session.get('user_id', 1)`
- auth-service.js exists but not integrated with backend
- TODO: Connect frontend auth to backend session

**Data Flow:**
1. User uploads listing → Saved to database with user_id=1
2. Homepage queries: `SELECT * FROM listings ORDER BY created_at DESC LIMIT 4`
3. Category pages query: `SELECT * FROM listings WHERE category = %s`
4. My-Ads queries: `SELECT * FROM listings WHERE user_id = 1`

### Verified Working
✅ Homepage displays 4 recent listings (desktop), 2 (mobile)
✅ Category pages filter by category correctly
✅ Upload review page shows media preview in correct location
✅ My-ads page displays real user listings with dynamic counts
✅ Database integration with PostgreSQL
✅ Empty states when no listings exist
✅ Video generation with FFmpeg 7.1.2

### Known Issues / TODO
- Video generation produces output but lacks images and captions
- Pending/Sold/Archived tabs not yet implemented (structure ready)
- User authentication needs backend integration
- Media uploads save to sessionStorage (not Azure Blob yet)

---

## Previous Sessions

### [Build cb6] - 2025-11-13
- Docker deployment with FFmpeg 7.1.2
- Homepage listing integration with PostgreSQL
- Category page fixes
- Automotive listings displaying correctly

### Database Credentials (For Reference)
**PostgreSQL Connection:**
- Host: video-marketplace-db.postgres.database.azure.com
- Database: video_marketplace
- User: psqladmin
- Password: `Andrei0927!`
- SSL Mode: require

**Azure Resources:**
- Resource Group: andrei_09_rg_3843
- Container Registry: vidxmarketplace.azurecr.io
- Web App: vidx-marketplace.azurewebsites.net
