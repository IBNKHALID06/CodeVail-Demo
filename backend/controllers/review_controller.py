from flask import Blueprint, request, jsonify
from models.submission import Submission
from utils.auth_utils import role_required

review_bp = Blueprint('review', __name__)

# Endpoint for interviewers to review flagged submissions
@review_bp.route('/review/flagged', methods=['GET'])
@role_required(['Interviewer'])
def get_flagged():
    flagged = Submission.get_flagged()
    return jsonify({'flagged': flagged})

# Endpoint to get all submissions
@review_bp.route('/review/all', methods=['GET'])
@role_required(['Interviewer'])
def get_all():
    all_subs = Submission.get_all()
    return jsonify({'submissions': all_subs})

# Endpoint to receive frontend reports (e.g., Cluely/app detection)
@review_bp.route('/review/report', methods=['POST'])
@role_required(['Candidate'])
def report():
    data = request.get_json()
    username = data.get('username')
    report = data.get('report')
    # For MVP, just log to console
    print(f'Received cheating report for {username}: {report}')
    return jsonify({'message': 'Report received'})
