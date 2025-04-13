const fs = require('node:fs');
const path = require('node:path');

function parseTestResults() {
  try {
    // Try different possible report locations
    const possiblePaths = [
      path.join(process.cwd(), 'playwright-report', 'test-results.json'),
    ];

    let reportPath = null;
    for (const p of possiblePaths) {
      console.log(`Checking path: ${p}`);
      if (fs.existsSync(p)) {
        const stats = fs.statSync(p);
        if (stats.isFile()) {
          reportPath = p;
          console.log(`Found valid file at: ${p}`);
          break;
        }
        if (stats.isDirectory()) {
          console.log(`Path is a directory, not a file: ${p}`);
          // Check if the file exists inside this directory
          const potentialFile = path.join(p, 'test-results.json');
          if (fs.existsSync(potentialFile) && fs.statSync(potentialFile).isFile()) {
            reportPath = potentialFile;
            console.log(`Found file inside directory: ${potentialFile}`);
            break;
          }
        }
      }
    }

    if (!reportPath) {
      console.log('Could not find test results file. Checked paths:', possiblePaths);
      return null;
    }

    console.log('Reading test results from:', reportPath);
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    const totalTests = report.suites.reduce((acc, suite) => acc + suite.specs.length, 0);
    const passedTests = report.suites.reduce((acc, suite) => 
      acc + suite.specs.filter(spec => spec.tests.every(test => test.status === 'passed')).length, 0);
    const failedTests = totalTests - passedTests;

    const failedTestNames = report.suites.reduce((acc, suite) => {
      const failed = suite.specs
        .filter(spec => spec.tests.some(test => test.status === 'failed'))
        .map(spec => spec.title);
      return acc.concat(failed);
    }, []);

    console.log('Parsed results:', {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      failedTests: failedTestNames
    });

    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      failedTests: failedTestNames
    };
  } catch (error) {
    console.error('Error parsing test results:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      path: error.path
    });
    return null;
  }
}

module.exports = parseTestResults; 