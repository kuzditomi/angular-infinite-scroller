const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/module.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'angular-infinite-scroller.min.js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new UglifyJsPlugin({ sourceMap: true }),
        new FileManagerPlugin({
            onEnd: {
                copy: [
                    { source: 'dist/angular-infinite-scroller.min.js', destination: 'docs/assets/js' },
                    { source: 'dist/angular-infinite-scroller.min.js', destination: 'e2e/site' },
                ]
            }
        }),
        new TSLintPlugin({
            files: [
                './src/**/*.ts',
                './tests/**/*.ts',
            ]
        })
    ]
}