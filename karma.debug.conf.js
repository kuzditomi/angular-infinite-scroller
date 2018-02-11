module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "node_modules/angular/angular.min.js",
            "src/**/*.ts",
            "tests/**/*.ts"
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript",
        },
        karmaTypescriptConfig: {
            bundlerOptions: {
                sourceMap: true,
            },
            coverageOptions: {
                exclude: /tests/,
                instrumentation: false
            }
        },
        singleRun: false,
        browsers: ["Chrome"]
    });
};