
from flask import Blueprint, request, jsonify
from services.code_executor import execute_code
from utils.auth_utils import role_required
from utils.rate_limiter import rate_limit, key_by_user_or_ip
from models.submission import Submission
from models.assignment import Assignment
import datetime
import hashlib

code_bp = Blueprint('code', __name__)

@code_bp.route('/execute', methods=['POST'])
@rate_limit(key_by_user_or_ip, limit=30, window_sec=60)
@role_required(['Candidate'])
def execute():
	data = request.get_json()
	code = data.get('code', '')
	username = data.get('username', None)
	if not username:
		return jsonify({'error': 'Missing username'}), 400

	# Server-side window enforcement
	active = Assignment.get_active_for_user(username)
	if not active:
		return jsonify({'error': 'No active assignment'}), 403
	assignment_id, _u, _tid, time_limit_sec, started_at, status = active
	try:
		started_dt = datetime.datetime.fromisoformat(started_at)
	except Exception:
		return jsonify({'error': 'Invalid assignment state'}), 403
	elapsed = (datetime.datetime.utcnow() - started_dt).total_seconds()
	if elapsed > max(0, int(time_limit_sec)):
		Assignment.complete(assignment_id)
		return jsonify({'error': 'Time limit exceeded'}), 403

	# Log submission
	Submission.log_submission(username, code)
	# Simple similarity/plagiarism heuristic: flag if identical code seen >1 times recently
	recent = Submission.get_recent_submissions(username, minutes=30)
	code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
	identical = 0
	for sub in recent:
		# sub schema: (id, username, code, timestamp, flagged)
		prev_code = sub[2] or ''
		if hashlib.sha256(prev_code.encode('utf-8')).hexdigest() == code_hash:
			identical += 1
	if identical >= 1:
		# mark latest submission as flagged for identical content reuse
		Submission.flag_submission(recent[-1][0])

	# Simple abuse guard: if more than 10 execs in 5 minutes, error
	burst = Submission.get_recent_submissions(username, minutes=5)
	if len(burst) > 10:
		return jsonify({'error': 'Too many executions. Please slow down.'}), 429

	result = execute_code(code)
	return jsonify({'result': result, 'assignment_id': assignment_id, 'elapsed': int(elapsed)})

@code_bp.route('/assignment/start', methods=['POST'])
@role_required(['Candidate'])
def start_assignment():
	data = request.get_json()
	username = data.get('username')
	time_limit_sec = int(data.get('timeLimitSec', 0))
	test_id = data.get('testId')
	if not username or time_limit_sec <= 0:
		return jsonify({'error': 'Missing username or timeLimitSec'}), 400
	assignment_id = Assignment.start(username, test_id, time_limit_sec)
	return jsonify({'assignmentId': assignment_id, 'startedAt': datetime.datetime.utcnow().isoformat()}), 200

@code_bp.route('/assignment/complete', methods=['POST'])
@role_required(['Candidate'])
def complete_assignment():
	data = request.get_json()
	assignment_id = data.get('assignmentId')
	if not assignment_id:
		return jsonify({'error': 'Missing assignmentId'}), 400
	Assignment.complete(int(assignment_id))
	return jsonify({'ok': True})
