"""
Product detail pages routes
Handles all product detail pages with a single template
"""

from flask import Blueprint, render_template, abort

bp = Blueprint('products', __name__)

@bp.route('/product/<int:product_id>')
@bp.route('/product/<slug>')
def product_detail(product_id=None, slug=None):
    """
    Product detail page
    ONE template serves all products
    Can access by ID or slug
    """
    # TODO: Fetch product from database by ID or slug
    # For now, return mock data
    
    if product_id:
        # Fetch by ID
        product = {
            'id': product_id,
            'title': 'Sample Product',
            'description': 'This is a sample product',
            'price': 999,
            'category': 'electronics',
            'images': [],
            'video_url': None
        }
    elif slug:
        # Fetch by slug (for clean URLs like /product/iphone-15-pro-max)
        product = {
            'id': 1,
            'title': slug.replace('-', ' ').title(),
            'description': f'Details for {slug}',
            'price': 999,
            'category': 'electronics',
            'images': [],
            'video_url': None
        }
    else:
        abort(404)
    
    return render_template('product.html', product=product)
