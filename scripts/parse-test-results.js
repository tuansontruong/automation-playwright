const fs = require('fs');
const path = require('path');

function parseTestResults() {
  try {
    const reportPath = path.join(process.cwd(), 'playwright-report', 'data', 'test-results.json');
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