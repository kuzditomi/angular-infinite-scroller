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
            bundlerOptions: {
                sourceMap: true,
            },
            coverageOptions: {
                exclude: /tests/,
                instrumentation: false
            }
        },
        singleRun: false,
        browsers: [],
        port: 9876
    });
};