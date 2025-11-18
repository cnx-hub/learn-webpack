const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        library: [
            'react',
            'react-dom'
        ]
    },
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.join(__dirname, 'build/library'),
        library: '[name]'
        // 会导出一个全局变量 window.library 
    },
    plugins: [
        // Dll 生成的 name 名称，也是最终 DllReferencePlugin 生成的全局变量名
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.join(__dirname, 'build/library/[name].json')
        })
    ]
}