from flask import Blueprint, request, jsonify
from utils.auth_utils import role_required

schedule_bp = Blueprint('schedule', __name__)

# Schedule an interview (Interviewer only)
@schedule_bp.route('/schedule/interview', methods=['POST'])
@role_required(['Interviewer'])
def schedule_interview():
    data = request.get_json()
    candidate = data.get('candidate')
    interviewer = data.get('interviewer')
    time = data.get('time')
    if not all([candidate, interviewer, time]):
        return jsonify({'error': 'Missing fields'}), 400
    # For MVP, just echo back
    return jsonify({'message': f'Interview scheduled for {candidate} with {interviewer} at {time}'})
