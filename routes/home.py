"""
Home page routes
"""

from flask import Blueprint, render_template
import json
import os

bp = Blueprint('home', __name__)

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

@bp.route('/')
def index():
    """Homepage with featured listings"""
    # Load listings from db.json
    db = load_db()
    listings = db.get('listings', [])
    
    # Convert to template format
    featured_items = []
    for listing in listings:
        featured_items.append({
            'id': listing['id'],
            'title': listing['title'],
            'price': f"€{listing['price']:,}" if listing.get('currency') == 'EUR' else f"${listing['price']:,}",
            'category': listing['category'],
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
            }
        })
    
    return render_template('home.html', featured_items=featured_items)
