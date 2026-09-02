import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve('logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
const LOG_FILE_PATH = path.join(LOG_DIR, 'wrangler.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10 MB

// Function to strip ANSI escape codes for clean text in file log
function stripAnsi(str) {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

function rotateLogs() {
  try {
    if (fs.existsSync(LOG_FILE_PATH)) {
      const stats = fs.statSync(LOG_FILE_PATH);
      if (stats.size >= MAX_LOG_SIZE) {
        const archive3 = path.join(LOG_DIR, 'wrangler.3.log');
        const archive2 = path.join(LOG_DIR, 'wrangler.2.log');
        const archive1 = path.join(LOG_DIR, 'wrangler.1.log');

        if (fs.existsSync(archive3)) fs.unlinkSync(archive3);
        if (fs.existsSync(archive2)) fs.renameSync(archive2, archive3);
        if (fs.existsSync(archive1)) fs.renameSync(archive1, archive2);
        fs.renameSync(LOG_FILE_PATH, archive1);
      }
    }
  } catch (err) {
    process.stderr.write(`Error rotating log files: ${err.message}\n`);
  }
}

function writeToLogFile(dataStr) {
  try {
    rotateLogs();
    const cleanData = stripAnsi(dataStr);
    fs.appendFileSync(LOG_FILE_PATH, cleanData, 'utf-8');
  } catch (err) {
    process.stderr.write(`Failed to write log: ${err.message}\n`);
  }
}

// Read piped output from wrangler dev via process.stdin
process.stdin.setEncoding('utf-8');

process.stdin.on('data', (chunk) => {
  // Pass through to stdout so terminal output still shows in real-time
  process.stdout.write(chunk);
  // Write clean plain text to log file
  writeToLogFile(chunk);
});

process.stdin.on('end', () => {
  process.exit(0);
});
