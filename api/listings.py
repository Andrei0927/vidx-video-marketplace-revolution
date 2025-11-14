"""
API routes for listings/uploads
Handles creating, updating, deleting listings
"""

from flask import Blueprint, request, jsonify
import secrets
import os
import json
import uuid
from datetime import datetime

bp = Blueprint('api_listings', __name__, url_prefix='/api/listings')

@bp.route('', methods=['POST'])
def create_listing():
    """Create a new listing"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('title') or not data.get('price'):
            return jsonify({
                'success': False,
                'error': 'Title and price are required'
            }), 400
        
        # Generate ID if not provided
        listing_id = data.get('id', f'listing-{uuid.uuid4()}')
        
        # Extract data with defaults
        title = data['title']
        category = data.get('category', 'other')
        description = data.get('description', '')
        price = float(data['price'])
        currency = data.get('currency', 'EUR')
        location = data.get('location', '')
        video_url = data.get('videoUrl', data.get('video_url', ''))
        thumbnail_url = data.get('thumbnailUrl', data.get('thumbnail_url', video_url))
        condition = data.get('condition', 'good')
        status = data.get('status', 'active')
        metadata = data.get('metadata', {})
        
        # Get user_id from session (for now use demo user)
        # Note: Using numeric ID 1 for demo user (matches users.id in database)
        user_id = 1  # TODO: Get from session/auth
        
        # Try to save to database
        DATABASE_URL = os.environ.get('DATABASE_URL')
        if DATABASE_URL:
            try:
                import psycopg2
                from psycopg2.extras import RealDictCursor
                
                conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
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
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING id;
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
                import traceback
                traceback.print_exc()
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
    """Get a specific listing"""
    listing = listings.get(listing_id)
    
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    return jsonify(listing)

@bp.route('/<listing_id>', methods=['PUT'])
def update_listing(listing_id):
    """Update a listing"""
    listing = listings.get(listing_id)
    
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        listing['title'] = data['title']
    if 'description' in data:
        listing['description'] = data['description']
    if 'price' in data:
        listing['price'] = data['price']
    if 'status' in data:
        listing['status'] = data['status']
    
    listing['updated_at'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': 'Listing updated successfully'
    })

@bp.route('/<listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    """Delete a listing"""
    if listing_id not in listings:
        return jsonify({'error': 'Listing not found'}), 404
    
    del listings[listing_id]
    
    return jsonify({
        'success': True,
        'message': 'Listing deleted successfully'
    })

@bp.route('/upload', methods=['POST'])
def upload_files():
    """Handle file uploads"""
    # Check if files are present
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []
    
    for file in files:
        if file.filename:
            # Generate unique filename
            file_id = secrets.token_hex(8)
            file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
            filename = f"{file_id}.{file_ext}"
            
            # In production, save to S3 or similar
            # For now, just return the filename
            uploaded_files.append({
                'id': file_id,
                'filename': filename,
                'original_name': file.filename,
                'url': f'/uploads/{filename}'  # Placeholder URL
            })
    
    return jsonify({
        'success': True,
        'files': uploaded_files
    })
