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
      }
    }

    if (!reportPath) {
      console.log('Could not find test results file. Checked paths:', possiblePaths);
      return null;
    }

    console.log('Reading test results from:', reportPath);
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Extract test statistics
    const stats = report.stats;
    const totalTests = stats.expected + stats.unexpected;
    const passedTests = stats.expected;
    const failedTests = stats.unexpected;

    // Extract failed test names
    const failedTestNames = [];

    // Helper function to process suites recursively
    function processSuite(suite) {
      if (suite.specs?.length > 0) {
        for (const spec of suite.specs) {
          if (spec.tests?.length > 0) {
            for (const test of spec.tests) {
              if (test.results?.some(result => result.status === 'failed')) {
                failedTestNames.push(spec.title);
              }
            }
          }
        }
      }
      if (suite.suites?.length > 0) {
        for (const subSuite of suite.suites) {
          processSuite(subSuite);
        }
      }
    }

    // Process all suites
    for (const suite of report.suites) {
      processSuite(suite);
    }

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