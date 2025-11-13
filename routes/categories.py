"""
Category pages routes
Handles all 8 category pages with a single template
"""

from flask import Blueprint, render_template, abort, request
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

bp = Blueprint('categories', __name__)

# Valid categories in the marketplace
CATEGORIES = {
    'electronics': {
        'name': 'Electronics',
        'description': 'Phones, Laptops, Cameras, and More',
        'icon': 'smartphone'
    },
    'fashion': {
        'name': 'Fashion',
        'description': 'Clothing, Shoes, Accessories',
        'icon': 'shopping-bag'
    },
    'automotive': {
        'name': 'Automotive',
        'description': 'Cars, Motorcycles, Parts',
        'icon': 'truck'
    },
    'jobs': {
        'name': 'Jobs',
        'description': 'Find Your Next Opportunity',
        'icon': 'briefcase'
    },
    'real-estate': {
        'name': 'Real Estate',
        'description': 'Houses, Apartments, Land',
        'icon': 'home'
    },
    'services': {
        'name': 'Services',
        'description': 'Professional Services',
        'icon': 'tool'
    },
    'sports': {
        'name': 'Sports & Outdoors',
        'description': 'Equipment, Gear, Activities',
        'icon': 'activity'
    },
    'home-garden': {
        'name': 'Home & Garden',
        'description': 'Furniture, Decor, Tools',
        'icon': 'home'
    }
}

def load_listings_from_db(category=None):
    """Load listings from PostgreSQL database"""
    try:
        from app import get_db
        conn = get_db()
        cur = conn.cursor()
        
        if category:
            cur.execute("""
                SELECT * FROM listings 
                WHERE category = %s AND status = 'active'
                ORDER BY created_at DESC;
            """, (category,))
        else:
            cur.execute("""
                SELECT * FROM listings 
                WHERE status = 'active'
                ORDER BY created_at DESC;
            """)
        
        listings = cur.fetchall()
        cur.close()
        conn.close()
        
        # Convert to list of dicts
        return [dict(listing) for listing in listings]
        
    except Exception as e:
        print(f"[ERROR] Database error: {e}")
        # Fallback to db.json if database fails
        return load_db().get('listings', [])

def load_db():
    """Load data from db.json (fallback)"""
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'db.json')
    print(f"[DEBUG] Looking for db.json at: {db_path}")
    print(f"[DEBUG] File exists: {os.path.exists(db_path)}")
    if os.path.exists(db_path):
        print(f"[DEBUG] File size: {os.path.getsize(db_path)} bytes")
    try:
        with open(db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"[DEBUG] Loaded {len(data.get('listings', []))} listings from JSON")
            return data
    except FileNotFoundError as e:
        print(f"[ERROR] db.json not found: {e}")
        return {'listings': []}
    except Exception as e:
        print(f"[ERROR] Failed to load db.json: {e}")
        return {'listings': []}

@bp.route('/<category>')
def category_page(category):
    """
    Render category page
    ONE template serves all 8 categories
    Shows filters by default, or video feed if ?show=videos
    """
    # Validate category
    if category not in CATEGORIES:
        abort(404)
    
    category_info = CATEGORIES[category]
    
    # Check if we should show videos or filters
    # Default to showing videos if no explicit filter request
    show_videos = request.args.get('show', 'videos') == 'videos'
    
    # Get filter parameters from URL
    filters = dict(request.args)
    if 'show' in filters:
        del filters['show']  # Remove the 'show' parameter from filters
    
    # Load items from database (PostgreSQL with fallback to db.json)
    print(f"[DEBUG] Loading listings for category: {category}")
    listings = load_listings_from_db(category)
    print(f"[DEBUG] Found {len(listings)} listings from database")
    
    # Format items for template
    items = []
    for listing in listings:
        # Format price with currency symbol
        price_value = listing.get('price', 0)
        currency = listing.get('currency', 'EUR')
        if currency == 'EUR':
            price_str = f"€{price_value:,}"
        else:
            price_str = f"${price_value:,}"
        
        # Handle metadata (can be dict or JSON string)
        metadata = listing.get('metadata', {})
        if isinstance(metadata, str):
            try:
                metadata = json.loads(metadata)
            except:
                metadata = {}
        
        items.append({
            'id': listing['id'],
            'title': listing['title'],
            'price': price_str,
            'price_value': price_value,  # Keep numeric value for sorting
            'currency': currency,
            'location': listing.get('location', ''),
            'video_url': listing['video_url'],
            'thumbnail': listing.get('thumbnail_url', listing.get('video_url')),
            'user': {
                'name': listing.get('seller_name', 'VidX Demo'),
                'avatar': listing.get('seller_avatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo')
            },
            'stats': {
                'views': listing.get('views', 0),
                'likes': listing.get('likes', 0)
            },
            'description': listing.get('description', ''),
            'features': metadata.get('features', [])
        })
    
    print(f"[DEBUG] Category: {category}, Found {len(items)} items")
    if items:
        print(f"[DEBUG] First item: {items[0]['title']}")
    
    return render_template('category.html',
                         category=category,
                         category_info=category_info,
                         items=items,
                         all_categories=CATEGORIES,
                         show_videos=show_videos,
                         filters=filters)

