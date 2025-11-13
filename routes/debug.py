"""
Debug routes - Temporary for troubleshooting
"""

from flask import Blueprint, jsonify
import os
import json
import subprocess
import shutil

bp = Blueprint('debug', __name__, url_prefix='/debug')

@bp.route('/ffmpeg')
def check_ffmpeg():
    """Check if FFmpeg is installed and working"""
    info = {
        'ffmpeg': {},
        'ffprobe': {},
        'imagemagick': {}
    }
    
    # Check ffmpeg
    ffmpeg_path = shutil.which('ffmpeg')
    info['ffmpeg']['path'] = ffmpeg_path
    info['ffmpeg']['installed'] = ffmpeg_path is not None
    
    if ffmpeg_path:
        try:
            result = subprocess.run(['ffmpeg', '-version'], 
                                  capture_output=True, text=True, timeout=5)
            info['ffmpeg']['version'] = result.stdout.split('\n')[0] if result.stdout else None
        except Exception as e:
            info['ffmpeg']['error'] = str(e)
    
    # Check ffprobe
    ffprobe_path = shutil.which('ffprobe')
    info['ffprobe']['path'] = ffprobe_path
    info['ffprobe']['installed'] = ffprobe_path is not None
    
    if ffprobe_path:
        try:
            result = subprocess.run(['ffprobe', '-version'], 
                                  capture_output=True, text=True, timeout=5)
            info['ffprobe']['version'] = result.stdout.split('\n')[0] if result.stdout else None
        except Exception as e:
            info['ffprobe']['error'] = str(e)
    
    # Check ImageMagick
    convert_path = shutil.which('convert')
    info['imagemagick']['path'] = convert_path
    info['imagemagick']['installed'] = convert_path is not None
    
    return jsonify(info)

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
