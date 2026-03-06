from flask import Blueprint, request, jsonify
from agent import AIAgent

agent_bp = Blueprint('agent', __name__, url_prefix='/api/agent')

# Initialize agent
try:
    ai_agent = AIAgent()
except ValueError as e:
    ai_agent = None
    print(f"Warning: {str(e)}")

@agent_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Agent service is running',
        'agent_initialized': ai_agent is not None
    })