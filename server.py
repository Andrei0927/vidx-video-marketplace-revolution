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
        if parsed_path.path == '/users':
            with open('db.json', 'r') as f:
                data = json.load(f)
                self._set_headers()
                self.wfile.write(json.dumps(data['users']).encode())
        else:
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
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Not found"}).encode())
                
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode())

def run(server_class=HTTPServer, handler_class=RequestHandler, port=3001):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()