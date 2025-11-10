"""
Category pages routes
Handles all 8 category pages with a single template
"""

from flask import Blueprint, render_template, abort

bp = Blueprint('categories', __name__)

# Valid categories in the marketplace
CATEGORIES = {
    'electronics': {
        'name': 'Electronics',
        'description': 'Phones, Laptops, Cameras, and More',
        'icon': 'smartphone'
    },
    'fashion': {
        'name': 'Fashion',
        'description': 'Clothing, Shoes, Accessories',
        'icon': 'shopping-bag'
    },
    'automotive': {
        'name': 'Automotive',
        'description': 'Cars, Motorcycles, Parts',
        'icon': 'truck'
    },
    'jobs': {
        'name': 'Jobs',
        'description': 'Find Your Next Opportunity',
        'icon': 'briefcase'
    },
    'real-estate': {
        'name': 'Real Estate',
        'description': 'Houses, Apartments, Land',
        'icon': 'home'
    },
    'services': {
        'name': 'Services',
        'description': 'Professional Services',
        'icon': 'tool'
    },
    'sports': {
        'name': 'Sports & Outdoors',
        'description': 'Equipment, Gear, Activities',
        'icon': 'activity'
    },
    'home-garden': {
        'name': 'Home & Garden',
        'description': 'Furniture, Decor, Tools',
        'icon': 'home'
    }
}

@bp.route('/<category>')
def category_page(category):
    """
    Render category page
    ONE template serves all 8 categories
    """
    # Validate category
    if category not in CATEGORIES:
        abort(404)
    
    category_info = CATEGORIES[category]
    
    # TODO: Fetch actual items from database
    # For now, return empty list
    items = []
    
    return render_template('category.html',
                         category=category,
                         category_info=category_info,
                         items=items,
                         all_categories=CATEGORIES)  # For category quick links

