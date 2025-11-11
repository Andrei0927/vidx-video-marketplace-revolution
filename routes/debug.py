"""
Debug routes - Temporary for troubleshooting
"""

from flask import Blueprint, jsonify
import os
import json

bp = Blueprint('debug', __name__, url_prefix='/debug')

@bp.route('/files')
def list_files():
    """List files in the application directory"""
    app_dir = os.path.dirname(os.path.dirname(__file__))
    
    file_list = {}
    for root, dirs, files in os.walk(app_dir):
        rel_path = os.path.relpath(root, app_dir)
        file_list[rel_path] = {
            'dirs': dirs,
            'files': files
        }
    
    return jsonify(file_list)

@bp.route('/db-info')
def db_info():
    """Check if db.json exists and what it contains"""
    app_dir = os.path.dirname(os.path.dirname(__file__))
    db_path = os.path.join(app_dir, 'data', 'db.json')
    
    info = {
        'app_dir': app_dir,
        'db_path': db_path,
        'exists': os.path.exists(db_path),
        'cwd': os.getcwd()
    }
    
    if os.path.exists(db_path):
        info['size'] = os.path.getsize(db_path)
        try:
            with open(db_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                info['listings_count'] = len(data.get('listings', []))
                info['data_keys'] = list(data.keys())
        except Exception as e:
            info['error'] = str(e)
    else:
        # Check what IS in the data directory
        data_dir = os.path.join(app_dir, 'data')
        if os.path.exists(data_dir):
            info['data_dir_contents'] = os.listdir(data_dir)
        else:
            info['data_dir_exists'] = False
    
    return jsonify(info)
