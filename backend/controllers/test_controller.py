from flask import Blueprint, request, jsonify
from models.test import Test
from utils.auth_utils import role_required

Test.create_table()
test_bp = Blueprint('test', __name__)

# Create a test (Interviewer only)
@test_bp.route('/test/create', methods=['POST'])
@role_required(['Interviewer'])
def create_test():
    data = request.get_json()
    title = data.get('title')
    candidate = data.get('candidate')
    interviewer = data.get('interviewer')
    if not all([title, candidate, interviewer]):
        return jsonify({'error': 'Missing fields'}), 400
    Test.add_test(title, candidate, interviewer)
    return jsonify({'message': 'Test created'})

# Assign a test (Interviewer only, same as create for MVP)
@test_bp.route('/test/assign', methods=['POST'])
@role_required(['Interviewer'])
def assign_test():
    return create_test()

# Terminate a test (Interviewer only)
@test_bp.route('/test/terminate', methods=['POST'])
@role_required(['Interviewer'])
def terminate_test():
    data = request.get_json()
    test_id = data.get('test_id')
    if not test_id:
        return jsonify({'error': 'Missing test_id'}), 400
    Test.update_status(test_id, 'terminated')
    return jsonify({'message': 'Test terminated'})


# Update test score (Interviewer only)
@test_bp.route('/test/score', methods=['POST'])
@role_required(['Interviewer'])
def update_score():
    data = request.get_json()
    test_id = data.get('test_id')
    score = data.get('score')
    if not all([test_id, score]):
        return jsonify({'error': 'Missing fields'}), 400
    Test.update_score(test_id, score)
    return jsonify({'message': 'Score updated'})

# Get tests for a user (Candidate or Interviewer)
@test_bp.route('/test/list', methods=['GET'])
@role_required(['Candidate', 'Interviewer'])
def list_tests():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Missing username'}), 400
    tests = Test.get_tests_by_user(username)
    return jsonify({'tests': tests})
