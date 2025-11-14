"""
Home page routes
"""

from flask import Blueprint, render_template
import json
import os

bp = Blueprint('home', __name__)

def load_listings_from_db(limit=None):
    """Load recent listings from PostgreSQL database"""
    try:
        from app import get_db
        conn = get_db()
        cur = conn.cursor()
        
        query = """
            SELECT * FROM listings 
            WHERE status = 'active'
            ORDER BY created_at DESC
        """
        
        if limit:
            query += f" LIMIT {limit}"
        
        cur.execute(query)
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
            print(f"[DEBUG] Loaded {len(data.get('listings', []))} listings")
            return data
    except FileNotFoundError as e:
        print(f"[ERROR] db.json not found: {e}")
        return {'listings': []}
    except Exception as e:
        print(f"[ERROR] Failed to load db.json: {e}")
        return {'listings': []}

@bp.route('/')
def index():
    """Homepage with recently published listings"""
    # Load recent listings from database (limit to 4 for desktop, will handle mobile in template)
    listings = load_listings_from_db(limit=4)
    
    # Convert to template format
    featured_items = []
    for listing in listings:
        # Format price with currency symbol
        price_value = listing.get('price', 0)
        currency = listing.get('currency', 'EUR')
        if currency == 'EUR':
            price_str = f"€{price_value:,}"
        else:
            price_str = f"${price_value:,}"
        
        featured_items.append({
            'id': listing['id'],
            'title': listing['title'],
            'price': price_str,
            'category': listing['category'],
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
            }
        })
    
    print(f"[DEBUG] Homepage: Loaded {len(featured_items)} recent listings")
    
    return render_template('home.html', featured_items=featured_items)
