const fs = require('fs');
const path = require('path');

function parseTestResults() {
  try {
    // Try different possible report locations
    const possiblePaths = [
      path.join(process.cwd(), 'playwright-report', 'data', 'test-results.json'),
      path.join(process.cwd(), 'playwright-report', 'test-results.json'),
      path.join(process.cwd(), 'test-results.json')
    ];

    let reportPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        reportPath = p;
        break;
      }
    }

    if (!reportPath) {
      console.log('Could not find test results file. Checked paths:', possiblePaths);
      return null;
    }

    console.log('Found test results at:', reportPath);
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    const totalTests = report.suites.reduce((acc, suite) => acc + suite.specs.length, 0);
    const passedTests = report.suites.reduce((acc, suite) => 
      acc + suite.specs.filter(spec => spec.tests.every(test => test.status === 'passed')).length, 0);
    const failedTests = totalTests - passedTests;

    const failedTestNames = report.suites.reduce((acc, suite) => {
      const failed = suite.specs
        .filter(spec => spec.tests.some(test => test.status === 'failed'))
        .map(spec => spec.title);
      return [...acc, ...failed];
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
    return null;
  }
}

module.exports = parseTestResults; 