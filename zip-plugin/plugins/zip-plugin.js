
const JSZip = require('jszip');
const path = require('path');
const zip = new JSZip();
const RawSource = require('webpack-sources').RawSource;



module.exports = class ZipPlugin {
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        // 文件已经准备好了，要进行打包了
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            // 获取输出的目录
            const folder = zip.folder(this.options.filename);

            for (let filename in compilation.assets) {
                const source = compilation.assets[filename].source();
                folder.file(filename, source)
            }

            zip.generateAsync({
                type: 'nodebuffer'
            }).then((content) => {
                const outputPath = path.join(compilation.options.output.path, this.options.filename + '.zip');

                const outputRelativePath = path.relative(
                    compilation.options.output.path,
                    outputPath
                );


                compilation.assets[outputRelativePath] = new RawSource(content);
                callback()
            })

            // console.log(compilation.assets, 'compilation');

        })
    }
}