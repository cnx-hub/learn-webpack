const loaderUtils = require('loader-utils');
const path = require('path');


module.exports = function (source) {
    // 通过 loader-runner 提供的 this.query 直接拿到 options
    const { name } = this.query || {};

    const url = loaderUtils.interpolateName(this, "[name].[ext]", {
        source,
    });

    // console.log(url);
    this.emitFile(path.join(__dirname, url), source);

    this.cacheable(false);


    const json = JSON.stringify(source)
        .replace('foo', '')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');



    return `export default ${json}`;
}