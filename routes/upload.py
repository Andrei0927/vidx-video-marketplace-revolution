"""
Upload flow routes
Handles the 3-step upload process
"""

from flask import Blueprint, render_template

bp = Blueprint('upload', __name__)

@bp.route('/upload')
def upload_step1():
    """Upload - Step 1: Select files"""
    return render_template('upload/step1.html')

@bp.route('/upload/details')
def upload_step2():
    """Upload - Step 2: Add details"""
    return render_template('upload/step2.html')

@bp.route('/upload/review')
def upload_step3():
    """Upload - Step 3: Review and publish"""
    return render_template('upload/step3.html')
