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
    try:
        with open(db_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
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
