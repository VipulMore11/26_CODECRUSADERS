import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from config import config
from routes import agent_bp

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    """Flask app factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(agent_bp)
    
    # Root endpoint
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Welcome to Flask Agentic AI API',
            'endpoints': {
                'agent_health': '/api/agent/health',
                'query': '/api/agent/query',
                'chat': '/api/agent/chat'
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )
