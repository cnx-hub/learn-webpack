const path = require('path');

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        fileName: 'main.js',
        path: path.join(__dirname, './dist')
    }
}