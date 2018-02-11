module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "node_modules/angular/angular.min.js",
            "node_modules/angular-mocks/angular-mocks.js",
            "src/**/*.ts",
            "tests/**/*.ts"
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript",
        },
        karmaTypescriptConfig: {
            tsconfig: './tsconfig.json',
            reports: {
                'html': 'coverage',
                'lcovonly': {
                    'directory': 'coverage',
                    'subdirectory': '.',
                    'filename': 'lcov.info'
                },
                'text-summary': ''
            },
            coverageOptions: {
                exclude: /tests/
            }
        },
        singleRun: true,
        reporters: ["spec", "karma-typescript", "travis-fold"],
        travisFoldReporter: {
            foldName: 'testresults',
        },
        browsers: ["Chrome"]
    });
};