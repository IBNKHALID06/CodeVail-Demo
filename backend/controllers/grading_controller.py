from flask import Blueprint, request, jsonify
import ast
import io
import contextlib
import traceback
import time

grading_bp = Blueprint('grading', __name__)

TEST_SPEC = {
    'function_name': 'add_numbers',
    'tests': [
        ((1, 2), 3),
        ((-5, 10), 5),
        ((0, 0), 0),
        ((1000, 2345), 3345)
    ]
}

def safe_execute(code: str, func_name: str):
    """Safely execute user code and retrieve function."""
    # Basic static checks
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return None, {'error': 'syntax_error', 'message': str(e)}

    # Disallow dangerous nodes
    # Disallow basic potentially dangerous constructs (Exec removed in Py3)
    dangerous = (ast.Import, ast.ImportFrom, ast.Global)
    for node in ast.walk(tree):
        if isinstance(node, dangerous):
            return None, {'error': 'disallowed_construct', 'message': 'Imports and exec not allowed'}

    sandbox_globals = { '__builtins__': { 'range': range, 'len': len, 'print': print, 'abs': abs } }
    sandbox_locals = {}
    try:
        exec(code, sandbox_globals, sandbox_locals)
    except Exception as e:
        return None, {'error': 'runtime_error', 'message': str(e)}

    fn = sandbox_locals.get(func_name) or sandbox_globals.get(func_name)
    if not callable(fn):
        return None, {'error': 'function_not_found', 'message': f"Function '{func_name}' not defined"}
    return fn, None

@grading_bp.route('/grade', methods=['POST'])
def grade_submission():
    try:
        data = request.get_json(silent=True) or {}
        code = data.get('code', '')
        start = time.time()
        fn, err = safe_execute(code, TEST_SPEC['function_name'])
        if err:
            return jsonify({'ok': False, 'error': err, 'duration_ms': int((time.time()-start)*1000)}), 200

        results = []
        passed = 0
        for (args, expected) in TEST_SPEC['tests']:
            try:
                with contextlib.redirect_stdout(io.StringIO()):
                    out = fn(*args)
                success = (out == expected)
                passed += 1 if success else 0
                results.append({
                    'input': args,
                    'expected': expected,
                    'received': out,
                    'passed': success
                })
            except Exception as e:
                results.append({
                    'input': args,
                    'expected': expected,
                    'error': str(e),
                    'passed': False
                })

        score = int((passed / len(TEST_SPEC['tests'])) * 100)
        return jsonify({
            'ok': True,
            'tests': results,
            'passed': passed,
            'total': len(TEST_SPEC['tests']),
            'score': score,
            'duration_ms': int((time.time()-start)*1000)
        })
    except Exception as outer_e:
        traceback.print_exc()
        return jsonify({'ok': False, 'error': {'error': 'internal_error', 'message': str(outer_e)}}), 500
