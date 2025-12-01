const path = require('path');

module.exports = {
    // mode: 'none',
    entry: path.join(__dirname, './src/index.js'),
    output: {
        filename: 'main.js',
        path: path.join(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, './loaders/a-loader.js'),
                    path.resolve(__dirname, './loaders/b-loader.js')
                ]
            }
        ]
    }
}