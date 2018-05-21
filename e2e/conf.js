let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ["--headless", "--disable-gpu", "--window-size=800,600"]
        }
    },
    baseUrl: 'http://127.0.0.1:8080/',
    directConnect: true,
    specs: ['tests/**/*.spec.js'],
    onPrepare: function () {
        const env = jasmine.getEnv();
        
        env.clearReporters();
        env.addReporter(new SpecReporter({
            displayFailuresSummary: true,
            displayFailuredSpec: true,
            displaySuiteNumber: true,
            displaySpecDuration: true
        }));
    },
    SELENIUM_PROMISE_MANAGER: false,
}