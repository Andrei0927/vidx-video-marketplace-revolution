"""
Video generation API routes
Handles AI video generation for marketplace listings
"""

from flask import Blueprint, request, jsonify
import os
import json
from pathlib import Path
import tempfile
import hashlib
from datetime import datetime
from video_pipeline import generate_video_pipeline

bp = Blueprint('video', __name__, url_prefix='/api/video')


@bp.route('/generate', methods=['POST'])
def generate_video():
    """
    Generate AI video from listing details
    
    Expected JSON payload:
    {
        "title": "Product Title",
        "category": "automotive",
        "description": "Product description",
        "price": 6500,
        "images": ["base64_image_1", "base64_image_2", ...],
        "details": {
            "condition": "good",
            "location": "Cluj-Napoca",
            ...
        }
    }
    
    Returns:
    {
        "success": true,
        "video_url": "https://...",
        "processing_time": 120,
        "cost": 0.021
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'category', 'description', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract data
        title = data['title']
        category = data['category']
        description = data['description']
        price = float(data['price'])
        details = data.get('details', {})
        images_data = data.get('images', [])
        
        # Convert base64 images to temp files
        import base64
        image_files = []
        
        for i, img_data in enumerate(images_data):
            # Remove data URI prefix if present
            if ',' in img_data:
                img_data = img_data.split(',')[1]
            
            # Decode base64
            img_bytes = base64.b64decode(img_data)
            
            # Save to temp file
            temp_img = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
            temp_img.write(img_bytes)
            temp_img.close()
            image_files.append(temp_img.name)
        
        # If no images provided, use placeholder
        if not image_files:
            # TODO: Generate placeholder images or use default automotive images
            return jsonify({
                'success': False,
                'error': 'At least one image is required'
            }), 400
        
        # Generate video using the pipeline
        print(f"🎬 Generating video for: {title}")
        print(f"   Category: {category}")
        print(f"   Price: €{price}")
        print(f"   Images: {len(image_files)}")
        
        import time
        start_time = time.time()
        
        result = generate_video_pipeline(
            images=image_files,
            description=description,
            title=title,
            category=category,
            price=price,
            details=details,
            language='ro'  # Romanian by default
        )
        
        processing_time = time.time() - start_time
        
        # Clean up temp files
        for img_file in image_files:
            try:
                os.unlink(img_file)
            except:
                pass
        
        # Create ad listing data
        ad_listing = {
            'id': hashlib.md5(f"{title}{datetime.now().isoformat()}".encode()).hexdigest()[:12],
            'title': title,
            'category': category,
            'description': description,
            'price': price,
            'condition': details.get('condition', 'good'),
            'location': details.get('location', 'Romania'),
            'video_url': result['video_url'],
            'video_key': result.get('video_key', ''),
            'script': result.get('script', ''),
            'thumbnail_url': result['video_url'],  # Video URL also serves as thumbnail
            'created_at': datetime.now().isoformat(),
            'views': 0,
            'likes': 0,
            'favorites': 0,
            'metadata': {
                'duration': result.get('duration', 0),
                'word_count': result.get('word_count', 0),
                'caption_count': result.get('caption_count', 0),
                'processing_time': round(processing_time, 2),
                'cost': result.get('cost', 0.021)
            }
        }
        
        # Save to session storage (for demo) or database
        # TODO: Save to database when available
        session_key = f"ad_{ad_listing['id']}"
        
        # Return success response with full ad data
        return jsonify({
            'success': True,
            'ad': ad_listing,
            'video_url': result['video_url'],
            'video_key': result.get('video_key', ''),
            'script': result.get('script', ''),
            'processing_time': round(processing_time, 2),
            'estimated_cost': result.get('cost', 0.021),
            'metadata': ad_listing['metadata']
        })
        
    except Exception as e:
        print(f"❌ Error generating video: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e),
            'details': traceback.format_exc()
        }), 500


@bp.route('/status/<job_id>', methods=['GET'])
def get_video_status(job_id):
    """
    Get video generation status (for async processing)
    TODO: Implement job queue system
    """
    return jsonify({
        'success': True,
        'status': 'completed',
        'job_id': job_id
    })


@bp.route('/script/generate', methods=['POST'])
def generate_script_only():
    """
    Generate only the script (for preview)
    
    Expected JSON:
    {
        "title": "Product Title",
        "category": "automotive",
        "description": "Description",
        "price": 6500
    }
    """
    try:
        from video_pipeline import generate_script
        
        data = request.get_json()
        
        result = generate_script(
            description=data['description'],
            title=data['title'],
            category=data['category'],
            price=float(data['price']),
            details=data.get('details')
        )
        
        return jsonify({
            'success': True,
            'script': result['script'],
            'estimated_duration': result.get('estimated_duration', 15),
            'word_count': result.get('word_count', 0)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
