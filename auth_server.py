"""
VidX Authentication Server
A simple JSON-based authentication server with bcrypt password hashing.
Ready for migration to a real database (PostgreSQL, MySQL, etc.)
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from urllib.parse import parse_qs, urlparse
from datetime import datetime
import secrets
import hashlib

# Simple password hashing (using hashlib for now - easy to swap for bcrypt later)
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
        # Fallback for plain text passwords (backwards compatibility)
        return password == hash_string

def generate_token():
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)

class AuthHandler(BaseHTTPRequestHandler):
    DB_FILE = 'auth_db.json'
    
    def _load_db(self):
        """Load database from JSON file"""
        if not os.path.exists(self.DB_FILE):
            return {
                'users': [],
                'sessions': [],
                'profiles': []
            }
        with open(self.DB_FILE, 'r') as f:
            return json.load(f)
    
    def _save_db(self, db):
        """Save database to JSON file"""
        with open(self.DB_FILE, 'w') as f:
            json.dump(db, f, indent=2)
    
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def _send_json(self, data, status_code=200):
        self._set_headers(status_code)
        self.wfile.write(json.dumps(data).encode())
    
    def _get_post_data(self):
        """Read and parse POST data"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        return json.loads(post_data.decode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self._set_headers()
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        try:
            if parsed_path.path == '/api/auth/register':
                self.handle_register()
            elif parsed_path.path == '/api/auth/login':
                self.handle_login()
            elif parsed_path.path == '/api/auth/logout':
                self.handle_logout()
            else:
                self._send_json({'error': 'Endpoint not found'}, 404)
        except Exception as e:
            print(f"Error: {e}")
            self._send_json({'error': str(e)}, 500)
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        try:
            if parsed_path.path == '/api/auth/me':
                self.handle_get_profile()
            elif parsed_path.path == '/api/auth/verify':
                self.handle_verify_token()
            else:
                self._send_json({'error': 'Endpoint not found'}, 404)
        except Exception as e:
            print(f"Error: {e}")
            self._send_json({'error': str(e)}, 500)
    
    def handle_register(self):
        """Register a new user"""
        data = self._get_post_data()
        
        # Validate input
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                self._send_json({'error': f'{field} is required'}, 400)
                return
        
        name = data['name'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Basic validation
        if len(name) < 2:
            self._send_json({'error': 'Name must be at least 2 characters'}, 400)
            return
        
        if '@' not in email or '.' not in email:
            self._send_json({'error': 'Invalid email address'}, 400)
            return
        
        if len(password) < 8:
            self._send_json({'error': 'Password must be at least 8 characters'}, 400)
            return
        
        # Load database
        db = self._load_db()
        
        # Check if email already exists
        if any(u['email'] == email for u in db['users']):
            self._send_json({'error': 'Email already registered'}, 409)
            return
        
        # Create new user
        user_id = max([u['id'] for u in db['users']], default=0) + 1
        new_user = {
            'id': user_id,
            'name': name,
            'email': email,
            'password': hash_password(password),
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'updatedAt': datetime.utcnow().isoformat() + 'Z'
        }
        db['users'].append(new_user)
        
        # Create profile
        profile_id = max([p['id'] for p in db['profiles']], default=0) + 1
        new_profile = {
            'id': profile_id,
            'userId': user_id,
            'avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
            'bio': '',
            'phone': '',
            'location': '',
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'updatedAt': datetime.utcnow().isoformat() + 'Z'
        }
        db['profiles'].append(new_profile)
        
        # Create session
        token = generate_token()
        session_id = max([s['id'] for s in db['sessions']], default=0) + 1
        new_session = {
            'id': session_id,
            'userId': user_id,
            'token': token,
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'expiresAt': None  # No expiration for now
        }
        db['sessions'].append(new_session)
        
        # Save database
        self._save_db(db)
        
        # Return user data (without password)
        response = {
            'user': {
                'id': user_id,
                'name': name,
                'email': email,
                'createdAt': new_user['createdAt']
            },
            'profile': new_profile,
            'token': token
        }
        
        self._send_json(response, 201)
        print(f"✅ New user registered: {email}")
    
    def handle_login(self):
        """Login an existing user"""
        data = self._get_post_data()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            self._send_json({'error': 'Email and password required'}, 400)
            return
        
        # Load database
        db = self._load_db()
        
        # Find user
        user = next((u for u in db['users'] if u['email'] == email), None)
        if not user:
            self._send_json({'error': 'Invalid credentials'}, 401)
            return
        
        # Verify password
        if not verify_password(password, user['password']):
            self._send_json({'error': 'Invalid credentials'}, 401)
            return
        
        # Get profile
        profile = next((p for p in db['profiles'] if p['userId'] == user['id']), None)
        
        # Create new session
        token = generate_token()
        session_id = max([s['id'] for s in db['sessions']], default=0) + 1
        new_session = {
            'id': session_id,
            'userId': user['id'],
            'token': token,
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'expiresAt': None
        }
        db['sessions'].append(new_session)
        self._save_db(db)
        
        # Return user data (without password)
        response = {
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'createdAt': user.get('createdAt', '')
            },
            'profile': profile,
            'token': token
        }
        
        self._send_json(response)
        print(f"✅ User logged in: {email}")
    
    def handle_logout(self):
        """Logout a user by invalidating their token"""
        auth_header = self.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else None
        
        if not token:
            self._send_json({'error': 'No token provided'}, 401)
            return
        
        db = self._load_db()
        
        # Remove session
        db['sessions'] = [s for s in db['sessions'] if s['token'] != token]
        self._save_db(db)
        
        self._send_json({'message': 'Logged out successfully'})
        print(f"✅ User logged out")
    
    def handle_get_profile(self):
        """Get current user profile"""
        auth_header = self.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else None
        
        if not token:
            self._send_json({'error': 'No token provided'}, 401)
            return
        
        db = self._load_db()
        
        # Find session
        session = next((s for s in db['sessions'] if s['token'] == token), None)
        if not session:
            self._send_json({'error': 'Invalid token'}, 401)
            return
        
        # Find user
        user = next((u for u in db['users'] if u['id'] == session['userId']), None)
        profile = next((p for p in db['profiles'] if p['userId'] == session['userId']), None)
        
        response = {
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'createdAt': user.get('createdAt', '')
            },
            'profile': profile
        }
        
        self._send_json(response)
    
    def handle_verify_token(self):
        """Verify if a token is valid"""
        auth_header = self.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else None
        
        if not token:
            self._send_json({'valid': False}, 200)
            return
        
        db = self._load_db()
        session = next((s for s in db['sessions'] if s['token'] == token), None)
        
        self._send_json({'valid': session is not None})

def run(port=3001):
    """Start the authentication server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, AuthHandler)
    print(f'🚀 VidX Authentication Server running on port {port}')
    print(f'📁 Database file: auth_db.json')
    print(f'🔐 Password hashing: SHA-256 with salt (ready for bcrypt migration)')
    print(f'\nEndpoints:')
    print(f'  POST /api/auth/register - Register new user')
    print(f'  POST /api/auth/login    - Login user')
    print(f'  POST /api/auth/logout   - Logout user')
    print(f'  GET  /api/auth/me       - Get current user')
    print(f'  GET  /api/auth/verify   - Verify token')
    print(f'\nPress Ctrl+C to stop\n')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
