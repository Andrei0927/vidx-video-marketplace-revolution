"""
Product detail pages routes
Handles all product detail pages with a single template
"""

from flask import Blueprint, render_template

bp = Blueprint('products', __name__)

@bp.route('/product/<product_id>')
def product_detail(product_id):
    """
    Product detail page
    Data is fetched client-side from localStorage
    product_id can be string or int
    """
    # Check if scroll to description is requested
    from flask import request
    scroll_to_desc = request.args.get('scroll') == 'description'
    
    # Pass product_id to template, let client-side JS fetch the data
    return render_template('product.html', product_id=product_id, scroll_to_desc=scroll_to_desc)
