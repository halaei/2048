#!/usr/bin/env node

// Setup jsdom for browser environment simulation
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

// Set global window and document objects
global.window = dom.window;
global.document = dom.window.document;

// Load all js/ files using eval to make them globally available (like browser)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadGlobalScript(filePath) {
    const realPath = path.resolve(__dirname, filePath);
    const content = fs.readFileSync(realPath, 'utf8');
    // Execute in global scope to make functions globally available
    vm.runInThisContext(content, { filename: realPath });
}

// Load dependencies in order (js/ files use vm.runInThisContext)
loadGlobalScript('../js/helpers/misc.js');
loadGlobalScript('../js/helpers/3d.js');
loadGlobalScript('../js/logics/cell.js');
loadGlobalScript('../js/logics/tile.js');
loadGlobalScript('../js/logics/events.js');
loadGlobalScript('../js/logics/grid.js');
loadGlobalScript('../js/logics/game.js');

// Load test framework using require (CommonJS modules)
const UnitTest = require('./unit_test.js');
const Mock = require('./mock.js');
const Expectation = require('./expectation.js');

// Initialize event prototypes for Node.js environment
globalThis.initEventPrototypes();

console.log('🚀 Running 2048 Game Tests...\n');

// Global test tracking
let totalPassed = 0;
let totalFailed = 0;
let totalSuites = 0;

// Override UnitTest methods to track global results
const originalRun = UnitTest.prototype.run;
UnitTest.prototype.run = function() {
    totalSuites++;
    const suitePassed = this.passedCount || 0;
    const suiteFailed = this.failedCount || 0;
    
    // Call original run method
    originalRun.call(this);
    
    // Update global counters
    totalPassed += this.passedCount || 0;
    totalFailed += this.failedCount || 0;
};

const originalPass = UnitTest.prototype.pass;
UnitTest.prototype.pass = function(test) {
    this.passedCount = (this.passedCount || 0) + 1;
    originalPass.call(this, test);
};

const originalFail = UnitTest.prototype.fail;
UnitTest.prototype.fail = function(test, exception) {
    this.failedCount = (this.failedCount || 0) + 1;
    originalFail.call(this, test, exception);
};

// Load test files using require (CommonJS modules)
console.log('📂 Loading test files...');
const TestMock = require('./test_mock.js');
const TestGrid3 = require('./logics/test_grid_3.js');
const TestGrid = require('./logics/test_grid.js');
const TestEvents = require('./logics/test_events.js');
const TestGame = require('./logics/test_game.js');
const TestCallbacks = require('./logics/test_callback.js');
const TestHelpers = require('./helpers/test_helpers.js');

// Instantiate and run all test classes
console.log('🚀 Running tests...\n');
new TestMock().run();
new TestGrid3().run();
new TestGrid().run();
new TestEvents().run();
new TestGame().run();
new TestCallbacks().run();
new TestHelpers().run();

// Final summary and exit code
console.log('\n🏁 Test run completed!');
console.log(`📊 Final Results: ${totalPassed} passed, ${totalFailed} failed across ${totalSuites} test suites`);

// Exit with appropriate code (0 for success, 1 for failure)
if (totalFailed > 0) {
    console.log('❌ Some tests failed!');
    process.exit(1);
} else {
    console.log('✅ All tests passed!');
    process.exit(0);
}
