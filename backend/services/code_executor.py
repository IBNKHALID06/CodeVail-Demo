import sys
import io
import signal

class TimeoutException(Exception):
	pass

def _timeout_handler(signum, frame):
	raise TimeoutException('Execution time limit exceeded')

def execute_code(code, time_limit_sec: int = 2, output_limit_bytes: int = 64 * 1024):
	# Time limit using signals (only works on POSIX). On Windows, we rely on logic in caller to limit invocations.
	try:
		signal.signal(signal.SIGALRM, _timeout_handler)
		signal.alarm(max(1, int(time_limit_sec)))
	except Exception:
		# On platforms without SIGALRM, we skip alarm
		pass

	old_stdout = sys.stdout
	redirected_output = sys.stdout = io.StringIO()
	try:
		# Execute in a restricted namespace
		sandbox_globals = {
			'__builtins__': {
				'print': print,
				'range': range,
				'len': len,
				'int': int,
				'float': float,
				'str': str,
				'bool': bool,
				'abs': abs,
				'min': min,
				'max': max,
				'sum': sum,
			}
		}
		exec(code, sandbox_globals, {})
		result = redirected_output.getvalue()
		if len(result.encode('utf-8')) > output_limit_bytes:
			result = result[:output_limit_bytes]
	except TimeoutException as e:
		result = str(e)
	except Exception as e:
		result = str(e)
	finally:
		try:
			signal.alarm(0)
		except Exception:
			pass
		sys.stdout = old_stdout
	return result
