"""
Category pages routes
Handles all 8 category pages with a single template
"""

from flask import Blueprint, render_template, abort, request
import json
import os

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

def load_db():
    """Load data from db.json"""
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'db.json')
    print(f"[DEBUG] Looking for db.json at: {db_path}")
    print(f"[DEBUG] File exists: {os.path.exists(db_path)}")
    if os.path.exists(db_path):
        print(f"[DEBUG] File size: {os.path.getsize(db_path)} bytes")
    try:
        with open(db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"[DEBUG] Loaded {len(data.get('listings', []))} listings")
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
    show_videos = request.args.get('show') == 'videos'
    
    # Get filter parameters from URL
    filters = dict(request.args)
    if 'show' in filters:
        del filters['show']  # Remove the 'show' parameter from filters
    
    # Load items from database
    db = load_db()
    listings = db.get('listings', [])
    
    # Filter by category
    items = []
    for listing in listings:
        if listing.get('category') == category:
            items.append({
                'id': listing['id'],
                'title': listing['title'],
                'price': f"€{listing['price']:,}" if listing.get('currency') == 'EUR' else f"${listing['price']:,}",
                'location': listing.get('location', ''),
                'video_url': listing['video_url'],
                'thumbnail': listing.get('thumbnail_url', listing.get('video_url')),
                'user': {
                    'name': 'VidX Demo',
                    'avatar': 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
                },
                'stats': {
                    'views': listing.get('views', 0),
                    'likes': listing.get('likes', 0)
                },
                'description': listing.get('description', ''),
                'features': []  # Can be added from metadata if needed
            })
    
    return render_template('category.html',
                         category=category,
                         category_info=category_info,
                         items=items,
                         all_categories=CATEGORIES,
                         show_videos=show_videos,
                         filters=filters)

