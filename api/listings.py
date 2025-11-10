"""
API routes for listings/uploads
Handles creating, updating, deleting listings
"""

from flask import Blueprint, request, jsonify
import secrets
from datetime import datetime

bp = Blueprint('api_listings', __name__, url_prefix='/api/listings')

# In-memory listings storage (replace with database later)
listings = {}

@bp.route('', methods=['POST'])
def create_listing():
    """Create a new listing"""
    # Get auth token
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    # For now, allow creating without auth (we can add validation later)
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('title') or not data.get('price'):
        return jsonify({'error': 'Title and price required'}), 400
    
    # Create listing
    listing_id = secrets.token_hex(8)
    
    listings[listing_id] = {
        'id': listing_id,
        'title': data['title'],
        'description': data.get('description', ''),
        'price': data['price'],
        'category': data.get('category', ''),
        'condition': data.get('condition', ''),
        'location': data.get('location', ''),
        'media_files': data.get('media_files', []),
        'created_at': datetime.now().isoformat(),
        'status': 'active'
    }
    
    return jsonify({
        'success': True,
        'listing_id': listing_id,
        'message': 'Listing created successfully'
    }), 201

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
