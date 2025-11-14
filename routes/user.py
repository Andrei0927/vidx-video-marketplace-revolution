"""
User pages routes
Profile, my ads, favourites, login, register
"""

from flask import Blueprint, render_template, session, request
import json
import os

bp = Blueprint('user', __name__)

def get_current_user_id():
    """Get current user ID from session or demo user"""
    # TODO: Replace with proper session auth
    # For now, check localStorage via cookie or use demo
    # Note: Using numeric ID 1 for demo user (matches users.id in database)
    return session.get('user_id', 1)

def load_user_listings(user_id):
    """Load listings for a specific user from PostgreSQL database"""
    try:
        from app import get_db
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT * FROM listings 
            WHERE user_id = %s
            ORDER BY created_at DESC;
        """, (user_id,))
        
        listings = cur.fetchall()
        cur.close()
        conn.close()
        
        # Convert to list of dicts
        return [dict(listing) for listing in listings]
        
    except Exception as e:
        print(f"[ERROR] Database error loading user listings: {e}")
        # Fallback to db.json
        return load_user_listings_from_json(user_id)

def load_user_listings_from_json(user_id):
    """Load user listings from db.json (fallback)"""
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'db.json')
    try:
        with open(db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            listings = data.get('listings', [])
            # Filter by user_id
            return [l for l in listings if l.get('user_id') == user_id]
    except Exception as e:
        print(f"[ERROR] Failed to load from db.json: {e}")
        return []

@bp.route('/login')
def login():
    """Login page"""
    return render_template('user/login.html')

@bp.route('/register')
def register():
    """Register page"""
    return render_template('user/register.html')

@bp.route('/profile')
def profile():
    """User profile page"""
    return render_template('user/profile.html')

@bp.route('/my-ads')
def my_ads():
    """User's ads page"""
    user_id = get_current_user_id()
    listings = load_user_listings(user_id)
    
    # Categorize listings by status
    active_listings = [l for l in listings if l.get('status') == 'active']
    pending_listings = [l for l in listings if l.get('status') == 'pending']
    sold_listings = [l for l in listings if l.get('status') == 'sold']
    archived_listings = [l for l in listings if l.get('status') == 'archived']
    
    return render_template('user/my-ads.html',
                         active_listings=active_listings,
                         pending_listings=pending_listings,
                         sold_listings=sold_listings,
                         archived_listings=archived_listings)

@bp.route('/favourites')
def favourites():
    """User's favourites page"""
    return render_template('user/favourites.html')
