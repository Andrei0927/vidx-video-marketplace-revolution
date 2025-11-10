"""
Home page routes
"""

from flask import Blueprint, render_template

bp = Blueprint('home', __name__)

@bp.route('/')
def index():
    """Homepage"""
    return render_template('home.html')
