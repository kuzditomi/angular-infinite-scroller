const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/module.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'angular-infinite-scroll.min.js'
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
        new UglifyJsPlugin({ sourceMap: true })
    ]
}