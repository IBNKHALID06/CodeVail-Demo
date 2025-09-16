const { spawn } = require('child_process');
const path = require('path');

// Test the startup violation check function
async function testStartupCheck() {
  console.log('Testing startup violation check...');
  
  try {
    const pythonScriptPath = path.join(__dirname, 'backend', 'services', 'anti_cheat.py');
    console.log('Python script path:', pythonScriptPath);
    
    const pythonProcess = spawn('python', [pythonScriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      console.log('\n--- Startup Check Results ---');
      console.log('Exit code:', code);
      
      if (output) {
        console.log('\nSTDOUT:');
        console.log(output);
        
        try {
          const result = JSON.parse(output.trim());
          console.log('\n--- Parsed Results ---');
          console.log('Has violations:', result.detected_violations?.length > 0);
          console.log('Should terminate:', result.should_terminate);
          console.log('Detected processes:', result.detected_violations?.map(v => v.process_name));
          console.log('Severity levels:', result.detected_violations?.map(v => v.severity));
        } catch (e) {
          console.log('Could not parse as JSON, raw output above');
        }
      }
      
      if (errorOutput) {
        console.log('\nSTDERR:');
        console.log(errorOutput);
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Process error:', error);
    });

  } catch (error) {
    console.error('Test error:', error);
  }
}

testStartupCheck();