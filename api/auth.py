"""
API routes for authentication
Handles login, register, logout
"""

from flask import Blueprint, request, jsonify
import secrets
import hashlib
from datetime import datetime, timedelta

bp = Blueprint('api_auth', __name__, url_prefix='/api/auth')

# In-memory user storage (replace with database later)
users = {}
sessions = {}

# Map emails to integer user IDs for database compatibility
user_id_counter = 1
email_to_user_id = {}

@bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    email = data['email'].lower()
    
    # Check if user already exists
    if email in users:
        return jsonify({'error': 'User already exists'}), 409
    
    # Create user with incremental integer ID
    global user_id_counter
    user_id = user_id_counter
    user_id_counter += 1
    
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    
    users[email] = {
        'id': user_id,
        'email': email,
        'name': data.get('name', ''),
        'password_hash': password_hash,
        'created_at': datetime.now().isoformat()
    }
    
    # Map email to integer user ID
    email_to_user_id[email] = user_id
    
    # Create session token
    token = secrets.token_hex(32)
    sessions[token] = {
        'user_id': user_id,
        'email': email,
        'expires_at': (datetime.now() + timedelta(days=30)).isoformat()
    }
    
    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': user_id,
            'email': email,
            'name': data.get('name', '')
        }
    })

@bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    email = data['email'].lower()
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    
    # Check credentials
    user = users.get(email)
    if not user or user['password_hash'] != password_hash:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Create session token
    token = secrets.token_hex(32)
    sessions[token] = {
        'user_id': user['id'],
        'email': email,
        'expires_at': (datetime.now() + timedelta(days=30)).isoformat()
    }
    
    print(f"[AUTH] User logged in: {email}, user_id: {user['id']}, token: {token[:16]}...")
    
    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user.get('name', '')
        }
    })

@bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if token in sessions:
        del sessions[token]
    
    return jsonify({'success': True})

@bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    session = sessions.get(token)
    if not session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    email = session['email']
    user = users.get(email)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'email': user['email'],
        'name': user.get('name', '')
    })
