let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome'
    },
    directConnect: true,
    specs: ['tests/*.spec.js'],
    onPrepare: function () {
        jasmine.getEnv().addReporter(new SpecReporter({
            displayFailuresSummary: true,
            displayFailuredSpec: true,
            displaySuiteNumber: true,
            displaySpecDuration: true
        }));
    }
}