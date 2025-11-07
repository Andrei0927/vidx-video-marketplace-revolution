#!/usr/bin/env python3
"""
Migration script to convert db.json to auth_db.json with hashed passwords
"""

import json
import hashlib
import secrets

def hash_password(password):
    """Hash a password using SHA-256 with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"

def migrate():
    # Load old database
    try:
        with open('db.json', 'r') as f:
            old_db = json.load(f)
    except FileNotFoundError:
        print("❌ db.json not found")
        return
    
    # Create new database structure
    new_db = {
        'users': [],
        'sessions': [],
        'profiles': []
    }
    
    # Migrate users with hashed passwords
    print("🔄 Migrating users...")
    for user in old_db.get('users', []):
        new_user = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'password': hash_password(user['password']),  # Hash the password
            'createdAt': '2025-11-07T00:00:00.000Z',
            'updatedAt': '2025-11-07T00:00:00.000Z'
        }
        new_db['users'].append(new_user)
        print(f"  ✅ Migrated user: {user['email']} (password hashed)")
    
    # Migrate sessions
    print("🔄 Migrating sessions...")
    for session in old_db.get('sessions', []):
        new_session = {
            'id': session['id'],
            'userId': session['userId'],
            'token': session['token'],
            'createdAt': session.get('createdAt', '2025-11-07T00:00:00.000Z'),
            'expiresAt': None
        }
        new_db['sessions'].append(new_session)
        print(f"  ✅ Migrated session for user ID: {session['userId']}")
    
    # Migrate profiles
    print("🔄 Migrating profiles...")
    for profile in old_db.get('profiles', []):
        new_profile = {
            'id': profile['id'],
            'userId': profile['userId'],
            'avatar': profile['avatar'],
            'bio': profile.get('bio', ''),
            'phone': '',
            'location': '',
            'createdAt': '2025-11-07T00:00:00.000Z',
            'updatedAt': '2025-11-07T00:00:00.000Z'
        }
        new_db['profiles'].append(new_profile)
        print(f"  ✅ Migrated profile for user ID: {profile['userId']}")
    
    # Save new database
    with open('auth_db.json', 'w') as f:
        json.dump(new_db, f, indent=2)
    
    print("\n✅ Migration complete!")
    print(f"📁 New database saved to: auth_db.json")
    print(f"👤 Users migrated: {len(new_db['users'])}")
    print(f"🔐 Sessions migrated: {len(new_db['sessions'])}")
    print(f"📋 Profiles migrated: {len(new_db['profiles'])}")
    print("\n⚠️  Old passwords have been hashed - users will need to use their original passwords")
    print("📝 Original test credentials:")
    for user in old_db.get('users', []):
        print(f"   Email: {user['email']} | Password: {user['password']}")

if __name__ == '__main__':
    migrate()
