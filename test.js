var assert = require('assert');
var path = require('path');
var fs = require('fs');

var outputFile = __dirname + '/test.xml';
var tests = [];
var strip = new RegExp('[\t\n]', 'g');
var oldWrite = process.stdout.write.bind(process.stdout);

// TEST
// sanity check the path name provided
tests.push(function() {
  var reporter = path.resolve('./reporter.js');
  assert.equal(reporter, require('./index'));
  assert.ok(require(reporter));
});

// TEST
// make sure no errors get thrown, yep, ghetto test #2
tests.push(function() {
  var formatter = require('./reporter.js');
});

// TEST
// verify output for 0 errors
tests.push(function() {
  // Arrange
  var formatter = require('./reporter.js');
  process.stdout.write = function() {};
  var mock1 = {
    results: [],
    data: [],
    opts: null
  };
  var expected = ['<?xml', '<testcase', '<testsuite'];

  // Act
  var results = formatter.reporter(mock1.results, mock1.data, mock1.opts);
  process.stdout.write = oldWrite;

  // Assert
  if (!results) {
    throw new Error('You should have some XML!');
  }
  expected.forEach(function(str) {
    if (results.indexOf(str) === -1) {
      throw new Error('Expected to see ' + str);
    }
  })
});

// TEST
// verify output for 1 error
tests.push(function() {
  // Arrange
  var formatter = require('./reporter.js');
  process.stdout.write = function() {};
  var mock = {
    results: [{
      file: './my/file.js',
      error: {
          id: '(error)',
          raw: 'Missing semicolon.',
          code: 'W033',
          evidence: '}',
          line: 36,
          character: 2,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing semicolon.'
      }
    }],
    data: [{
      file: 'my/file.js'
    }],
    opts: null
  };
  var expected = '<?xml version="1.0" encoding="utf-8"?><testsuite name="jshint" tests="1" failures="1" errors="0"><testcase name="my/file.js"><failure message="1 JSHINT Failure">1. line 36, char 2: Missing semicolon.</failure></testcase></testsuite>';

  // Act
  var results = formatter.reporter(mock.results, mock.data, mock.opts);
  process.stdout.write = oldWrite;

  // Assert
  if (results.replace(strip, '') !== expected.replace(strip, '')) {
    throw new Error('Unexpected results');
  }
});

// TEST
// verify output for > 1 error
tests.push(function() {
  // Arrange
  var formatter = require('./reporter.js');
  process.stdout.write = function() {};
  var mock = {
    results: [
      { 
        file: 'reporter.js',
        error: {
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  var pairs = {',
          line: 9,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      },
      { 
        file: 'reporter.js',
        error: { 
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  var count = failures.length;',
          line: 25,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      },
      { 
        file: 'reporter.js',
        error: { 
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  var msg = [];',
          line: 34,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      },
      { 
        file: 'reporter.js',
        error: { 
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  console.log(results)',
          line: 45,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      }
    ],
    data: [{
      file: 'reporter.js'
    }],
    opts: null
  };
  var expected = '<?xml version="1.0" encoding="utf-8"?><testsuite name="jshint" tests="1" failures="4" errors="0"><testcase name="reporter.js"><failure message="4 JSHint Failures">1. line 9, char 3: Missing &quot;use strict&quot; statement.2. line 25, char 3: Missing &quot;use strict&quot; statement.3. line 34, char 3: Missing &quot;use strict&quot; statement.4. line 45, char 3: Missing &quot;use strict&quot; statement.</failure></testcase></testsuite>';

  // Act
  var results = formatter.reporter(mock.results, mock.data, mock.opts);
  process.stdout.write = oldWrite;

  // Assert
  if (results.replace(strip, '') !== expected.replace(strip, '')) {
    throw new Error('Unexpected results');
  }
});

// TEST
// verify for output file
tests.push(function() {
  // Arrange
  var formatter = require('./reporter.js');
  var mock = {
    results: [
      { 
        file: 'reporter.js',
        error: {
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  var pairs = {',
          line: 9,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      },
      { 
        file: 'reporter.js',
        error: { 
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  var count = failures.length;',
          line: 25,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      },
      { 
        file: 'reporter.js',
        error: { 
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  var msg = [];',
          line: 34,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      },
      { 
        file: 'reporter.js',
        error: { 
          id: '(error)',
          raw: 'Missing "use strict" statement.',
          evidence: '  console.log(results)',
          line: 45,
          character: 3,
          scope: '(main)',
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          reason: 'Missing "use strict" statement.' 
        }
      }
    ],
    data: [{
      file: 'reporter.js'
    }],
    opts: { 
      outputFile: outputFile 
    }
  };
  var expected = '<?xml version="1.0" encoding="utf-8"?><testsuite name="jshint" tests="1" failures="4" errors="0"><testcase name="reporter.js"><failure message="4 JSHint Failures">1. line 9, char 3: Missing &quot;use strict&quot; statement.2. line 25, char 3: Missing &quot;use strict&quot; statement.3. line 34, char 3: Missing &quot;use strict&quot; statement.4. line 45, char 3: Missing &quot;use strict&quot; statement.</failure></testcase></testsuite>';

  // Act
  var results = formatter.reporter(mock.results, mock.data, mock.opts);

  // Assert
  var success = false;
  var content;
  if (fs.existsSync(outputFile)) {
    content = fs.readFileSync(outputFile, "utf8");
    if (content.replace(strip, '') === expected.replace(strip, '')) {
      success = true;
    }
    fs.unlinkSync(outputFile);
  }
  if (!success) {
    throw new Error('Unexpected results');
  }
});

// lint this file, but only if you have jshint
tests.push(function() {
  console.log('Don\'t forget to lint this file also!');
  console.log('jshint --reporter=reporter.js reporter.js\n\n');
});

// run all tests
tests.forEach(function(test) {
  test();
});

// seems like we're ok
console.log('all of the tests passed!');