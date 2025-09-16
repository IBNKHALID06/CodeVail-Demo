import os
import secrets
from datetime import timedelta

class Config:
    # Generate a secure secret key or load from environment
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_urlsafe(32)
    
    # Database configuration
    DB_PATH = os.path.join(os.path.dirname(__file__), 'codevail.db')
    
    # JWT configuration
    JWT_EXPIRATION_DELTA = timedelta(hours=2)
    JWT_ALGORITHM = 'HS256'
    
    # Security settings
    WTF_CSRF_ENABLED = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # CORS settings (restrictive)
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')
    
    # Rate limiting
    RATELIMIT_STORAGE_URL = "memory://"
    
    # Development vs Production
    DEBUG = os.environ.get('FLASK_ENV') == 'development'

class DevelopmentConfig(Config):
    DEBUG = True
    # Allow localhost origins for development
    CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'tauri://localhost', 'null']

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    # Only allow specific production origins
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '').split(',')

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
