from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from urllib.parse import parse_qs, urlparse

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()
        
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query = parse_qs(parsed_path.query)

        with open('db.json', 'r') as f:
            db = json.load(f)

        # /users optionally supports ?email=<email>
        if parsed_path.path == '/users':
            email = query.get('email', [None])[0]
            if email:
                users = [u for u in db.get('users', []) if u.get('email') == email]
            else:
                users = db.get('users', [])
            self._set_headers()
            self.wfile.write(json.dumps(users).encode())
            return

        # /profiles supports ?userId=<id>
        if parsed_path.path == '/profiles':
            userId = query.get('userId', [None])[0]
            if userId:
                try:
                    uid = int(userId)
                except ValueError:
                    uid = None
                profiles = [p for p in db.get('profiles', []) if p.get('userId') == uid]
            else:
                profiles = db.get('profiles', [])
            self._set_headers()
            self.wfile.write(json.dumps(profiles).encode())
            return

        # /sessions supports ?token=<token>
        if parsed_path.path == '/sessions':
            token = query.get('token', [None])[0]
            if token:
                sessions = [s for s in db.get('sessions', []) if s.get('token') == token]
            else:
                sessions = db.get('sessions', [])
            self._set_headers()
            self.wfile.write(json.dumps(sessions).encode())
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            
            with open('db.json', 'r') as f:
                db = json.load(f)

            parsed_path = urlparse(self.path)
            if parsed_path.path == '/users':
                # Simple user creation
                new_user = {
                    "id": len(db['users']) + 1,
                    "name": data.get('name'),
                    "email": data.get('email'),
                    "password": data.get('password')  # In real app, hash this!
                }
                db['users'].append(new_user)
                
                # Create profile
                new_profile = {
                    "id": len(db['profiles']) + 1,
                    "userId": new_user['id'],
                    "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={data.get('email')}",
                    "bio": ""
                }
                db['profiles'].append(new_profile)
                
                with open('db.json', 'w') as f:
                    json.dump(db, f, indent=2)
                
                self._set_headers(201)
                # Return created user and profile to match client expectations
                self.wfile.write(json.dumps({"user": new_user, "profile": new_profile}).encode())
                
            elif parsed_path.path == '/login':
                # Simple login
                email = data.get('email')
                password = data.get('password')
                
                user = next((u for u in db['users'] if u['email'] == email and u['password'] == password), None)
                if user:
                    profile = next((p for p in db['profiles'] if p['userId'] == user['id']), None)
                    session = {"token": f"session_{user['id']}_{hash(email)}"}
                    
                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "user": user,
                        "profile": profile,
                        "session": session['token']
                    }).encode())
                else:
                    self._set_headers(401)
                    self.wfile.write(json.dumps({"error": "Invalid credentials"}).encode())
            elif parsed_path.path == '/sessions':
                # create a session record
                token = data.get('token')
                userId = data.get('userId')
                createdAt = data.get('createdAt')
                new_session = {
                    "id": len(db.get('sessions', [])) + 1,
                    "userId": userId,
                    "token": token,
                    "createdAt": createdAt
                }
                db.setdefault('sessions', []).append(new_session)
                with open('db.json', 'w') as f:
                    json.dump(db, f, indent=2)
                self._set_headers(201)
                self.wfile.write(json.dumps(new_session).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Not found"}).encode())
                
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_DELETE(self):
        parsed_path = urlparse(self.path)
        query = parse_qs(parsed_path.query)

        with open('db.json', 'r') as f:
            db = json.load(f)

        # Delete sessions by token: /sessions?token=...
        if parsed_path.path == '/sessions':
            token = query.get('token', [None])[0]
            if not token:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "token query required"}).encode())
                return

            before = len(db.get('sessions', []))
            db['sessions'] = [s for s in db.get('sessions', []) if s.get('token') != token]
            after = len(db.get('sessions', []))

            with open('db.json', 'w') as f:
                json.dump(db, f, indent=2)

            if before == after:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "session not found"}).encode())
            else:
                self._set_headers(200)
                self.wfile.write(json.dumps({"deleted": True}).encode())
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode())

def run(server_class=HTTPServer, handler_class=RequestHandler, port=3001):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()