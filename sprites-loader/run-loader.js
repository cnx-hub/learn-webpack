const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
    resource: path.join(__dirname, './src/index.css'),
    readResource: fs.readFile.bind(fs),
    loaders: [
        { loader: path.join(__dirname, './src/sprites-loader.js') }
    ],
    context: {
        // emitFile: () => { },
        minimize: true
    }
}, (err, result) => {
    err ? console.error(err) : console.log(result)
})