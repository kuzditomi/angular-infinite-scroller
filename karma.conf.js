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
            coverageOptions: {
                exclude: /tests/
            }
        },
        singleRun: true,
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"]
    });
};