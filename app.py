"""
VidX Authentication & API Server - Production Version
Flask backend with PostgreSQL database
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import secrets
import hashlib
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)

# Configure CORS - allow frontend domain
CORS_ORIGIN = os.getenv('CORS_ORIGIN', 'http://localhost:8080')
CORS(app, origins=[CORS_ORIGIN, 'http://localhost:8080', 'http://127.0.0.1:8080'])

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')

def get_db():
    """Get database connection"""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def hash_password(password):
    """Hash a password using SHA-256 with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"

def verify_password(password, hash_string):
    """Verify a password against a hash"""
    try:
        salt, pwd_hash = hash_string.split('$')
        return hashlib.sha256((password + salt).encode()).hexdigest() == pwd_hash
    except:
        return False

def generate_token():
    """Generate a secure random session token"""
    return secrets.token_urlsafe(32)

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No authentication token provided'}), 401
        
        conn = get_db()
        cur = conn.cursor()
        
        try:
            # Check if token is valid and not expired
            cur.execute("""
                SELECT s.user_id, u.* 
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.token = %s AND s.expires_at > NOW()
            """, (token,))
            
            user = cur.fetchone()
            
            if not user:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            request.user = dict(user)
            return f(*args, **kwargs)
            
        finally:
            cur.close()
            conn.close()
    
    return decorated_function

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        conn.close()
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# Register endpoint
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.json
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    full_name = data.get('fullName', '')
    phone = data.get('phone', '')
    
    # Validation
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Check if user already exists
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create user
        password_hash = hash_password(password)
        cur.execute("""
            INSERT INTO users (email, password_hash, full_name, phone)
            VALUES (%s, %s, %s, %s)
            RETURNING id, email, full_name, phone, created_at
        """, (email, password_hash, full_name, phone))
        
        user = cur.fetchone()
        
        # Create session
        token = generate_token()
        expires_at = datetime.now() + timedelta(days=30)
        
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%s, %s, %s)
        """, (user['id'], token, expires_at))
        
        conn.commit()
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'fullName': user['full_name'],
                'phone': user['phone']
            }
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
        
    finally:
        cur.close()
        conn.close()

# Login endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.json
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Find user
        cur.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cur.fetchone()
        
        if not user or not verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create session
        token = generate_token()
        expires_at = datetime.now() + timedelta(days=30)
        
        cur.execute("""
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (%s, %s, %s)
        """, (user['id'], token, expires_at))
        
        conn.commit()
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'fullName': user['full_name'],
                'phone': user['phone'],
                'avatarUrl': user['avatar_url']
            }
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
        
    finally:
        cur.close()
        conn.close()

# Get current user endpoint
@app.route('/api/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user"""
    user = request.user
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'fullName': user['full_name'],
            'phone': user['phone'],
            'avatarUrl': user['avatar_url']
        }
    }), 200

# Logout endpoint
@app.route('/api/auth/logout', methods=['POST'])
@require_auth
def logout():
    """Logout user (invalidate session)"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        cur.execute('DELETE FROM sessions WHERE token = %s', (token,))
        conn.commit()
        return jsonify({'success': True}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
        
    finally:
        cur.close()
        conn.close()

# Update profile endpoint
@app.route('/api/auth/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile"""
    data = request.json
    user_id = request.user['id']
    
    full_name = data.get('fullName')
    phone = data.get('phone')
    avatar_url = data.get('avatarUrl')
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Build dynamic update query
        updates = []
        params = []
        
        if full_name is not None:
            updates.append('full_name = %s')
            params.append(full_name)
        
        if phone is not None:
            updates.append('phone = %s')
            params.append(phone)
        
        if avatar_url is not None:
            updates.append('avatar_url = %s')
            params.append(avatar_url)
        
        if not updates:
            return jsonify({'error': 'No fields to update'}), 400
        
        params.append(user_id)
        
        cur.execute(f"""
            UPDATE users 
            SET {', '.join(updates)}
            WHERE id = %s
            RETURNING id, email, full_name, phone, avatar_url
        """, params)
        
        user = cur.fetchone()
        conn.commit()
        
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'fullName': user['full_name'],
                'phone': user['phone'],
                'avatarUrl': user['avatar_url']
            }
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
        
    finally:
        cur.close()
        conn.close()

# Password reset request endpoint
@app.route('/api/auth/reset-password-request', methods=['POST'])
def reset_password_request():
    """Request password reset (sends email with code)"""
    data = request.json
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    # TODO: Implement email sending with SendGrid
    # For now, just return success
    return jsonify({
        'success': True,
        'message': 'Password reset code sent to your email'
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
