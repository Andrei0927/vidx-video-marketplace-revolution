"""
Search routes
Handles both general search and category-specific search
Each category has its own template with custom filters
"""

from flask import Blueprint, render_template, request, abort

bp = Blueprint('search', __name__)

# Import categories from categories route
from .categories import CATEGORIES

@bp.route('/search')
@bp.route('/search/<category>')
def search_page(category=None):
    """
    Search page - renders category-specific template with custom filters
    """
    # Get search query
    query = request.args.get('q', '')
    
    # Validate category if specified
    if category and category not in CATEGORIES:
        abort(404)
    
    category_info = CATEGORIES.get(category) if category else None
    
    # TODO: Fetch search results from database
    # For now, return empty list
    results = []
    
    # Use category-specific template if it exists
    template = f'search/{category}.html' if category else 'search/general.html'
    
    return render_template(template,
                         category=category,
                         category_info=category_info,
                         query=query,
                         results=results)
