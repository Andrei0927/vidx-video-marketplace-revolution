"""
User pages routes
Profile, my ads, favourites, login, register
"""

from flask import Blueprint, render_template

bp = Blueprint('user', __name__)

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
    return render_template('user/my-ads.html')

@bp.route('/favourites')
def favourites():
    """User's favourites page"""
    return render_template('user/favourites.html')
