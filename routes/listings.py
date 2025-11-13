"""
Listings API routes
Handles CRUD operations for marketplace listings
"""

from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime
import uuid

bp = Blueprint('listings', __name__, url_prefix='/api/listings')


@bp.route('', methods=['POST'])
def create_listing():
    """
    Create a new listing
    
    Expected JSON payload:
    {
        "id": "listing-123",
        "title": "Product Title",
        "category": "automotive",
        "description": "Product description",
        "price": 6500,
        "currency": "EUR",
        "location": "Cluj-Napoca",
        "videoUrl": "https://...",
        "thumbnailUrl": "https://...",
        "condition": "good",
        "metadata": {...}
    }
    
    Returns:
    {
        "success": true,
        "listing_id": "listing-123",
        "message": "Listing created successfully"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'category', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Generate ID if not provided
        listing_id = data.get('id', f'listing-{uuid.uuid4()}')
        
        # Extract data
        title = data['title']
        category = data['category']
        description = data.get('description', '')
        price = float(data['price'])
        currency = data.get('currency', 'EUR')
        location = data.get('location', '')
        video_url = data.get('videoUrl', '')
        thumbnail_url = data.get('thumbnailUrl', video_url)
        condition = data.get('condition', 'good')
        status = data.get('status', 'active')
        metadata = data.get('metadata', {})
        
        # Get user_id from session (for now use demo user)
        user_id = 'demo-user'  # TODO: Get from session/auth
        
        # Try to save to database
        DATABASE_URL = os.environ.get('DATABASE_URL')
        if DATABASE_URL:
            try:
                from app import get_db
                conn = get_db()
                cur = conn.cursor()
                
                cur.execute("""
                    INSERT INTO listings (
                        id, user_id, title, description, category, 
                        price, currency, location, video_url, thumbnail_url,
                        seller_name, seller_avatar, status, metadata, 
                        created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s::jsonb,
                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )
                    ON CONFLICT (id) 
                    DO UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        price = EXCLUDED.price,
                        video_url = EXCLUDED.video_url,
                        updated_at = CURRENT_TIMESTAMP;
                """, (
                    listing_id,
                    user_id,
                    title,
                    description,
                    category,
                    price,
                    currency,
                    location,
                    video_url,
                    thumbnail_url,
                    'VidX User',  # Default seller name
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=vidx',  # Default avatar
                    status,
                    json.dumps(metadata)
                ))
                
                conn.commit()
                cur.close()
                conn.close()
                
                print(f"✅ Listing saved to database: {listing_id}")
                
                return jsonify({
                    'success': True,
                    'listing_id': listing_id,
                    'message': 'Listing created successfully',
                    'saved_to': 'database'
                }), 201
                
            except Exception as db_error:
                print(f"⚠️ Database error: {db_error}")
                # Fall through to localStorage fallback
        
        # Fallback: Save to db.json
        db_file = os.path.join(os.path.dirname(__file__), '..', 'db.json')
        
        # Load existing data
        if os.path.exists(db_file):
            with open(db_file, 'r') as f:
                db_data = json.load(f)
        else:
            db_data = {'listings': []}
        
        # Add new listing
        listing = {
            'id': listing_id,
            'user_id': user_id,
            'title': title,
            'description': description,
            'category': category,
            'price': price,
            'currency': currency,
            'location': location,
            'video_url': video_url,
            'thumbnail_url': thumbnail_url,
            'seller_name': 'VidX User',
            'seller_avatar': 'https://api.dicebear.com/7.x/avataaars/svg?seed=vidx',
            'status': status,
            'metadata': metadata,
            'views': 0,
            'likes': 0,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Remove existing listing with same ID
        db_data['listings'] = [l for l in db_data['listings'] if l.get('id') != listing_id]
        
        # Add new listing at the beginning
        db_data['listings'].insert(0, listing)
        
        # Save to file
        with open(db_file, 'w') as f:
            json.dump(db_data, f, indent=2)
        
        print(f"✅ Listing saved to db.json: {listing_id}")
        
        return jsonify({
            'success': True,
            'listing_id': listing_id,
            'message': 'Listing created successfully',
            'saved_to': 'json'
        }), 201
        
    except Exception as e:
        print(f"❌ Error creating listing: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/<listing_id>', methods=['GET'])
def get_listing(listing_id):
    """Get a specific listing by ID"""
    try:
        # Try database first
        DATABASE_URL = os.environ.get('DATABASE_URL')
        if DATABASE_URL:
            try:
                from app import get_db
                conn = get_db()
                cur = conn.cursor()
                
                cur.execute("SELECT * FROM listings WHERE id = %s", (listing_id,))
                listing = cur.fetchone()
                
                cur.close()
                conn.close()
                
                if listing:
                    return jsonify({
                        'success': True,
                        'listing': dict(listing)
                    })
            except Exception as db_error:
                print(f"⚠️ Database error: {db_error}")
        
        # Fallback to db.json
        db_file = os.path.join(os.path.dirname(__file__), '..', 'db.json')
        if os.path.exists(db_file):
            with open(db_file, 'r') as f:
                db_data = json.load(f)
                
            for listing in db_data.get('listings', []):
                if listing.get('id') == listing_id:
                    return jsonify({
                        'success': True,
                        'listing': listing
                    })
        
        return jsonify({
            'success': False,
            'error': 'Listing not found'
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
