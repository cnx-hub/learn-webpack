const { getAst, getDependencies, transform } = require("./parser");

const path = require("path");

const fs = require('fs');


module.exports = class Compiler {

    constructor(options) {
        this.options = options;
        const { entry, output } = this.options;
        this.entry = entry;
        this.output = output;
        this.modules = []
    }

    run() {
        const entryModule = this.buildModule(this.entry, true);
        this.modules.push(entryModule);

        // 使用队列处理所有依赖，确保递归收集所有模块
        for (let i = 0; i < this.modules.length; i++) {
            const _module = this.modules[i];
            _module.dependencies.forEach((dependency) => {
                this.modules.push(this.buildModule(dependency));
            });
        }

        this.emitFiles();
    }


    buildModule(fileName, isEntry) {
        let ast;

        if (isEntry) {
            ast = getAst(fileName);
        } else {
            const absolutePath = path.join(process.cwd(), './src', fileName);
            ast = getAst(absolutePath)
        }

        return {
            fileName: fileName,
            dependencies: getDependencies(ast),
            transformCode: transform(ast)
        }
    }

    emitFiles() {

        const outputPath = path.join(this.output.path, this.output.fileName);
        
        // 确保输出目录存在
        if (!fs.existsSync(this.output.path)) {
            fs.mkdirSync(this.output.path, { recursive: true });
        }
        
        let modules = '';

        // console.log(this.modules, 'modules');


        this.modules.map((_module) => {
            modules += `'${_module.fileName}': function(require, module, exports) { ${_module.transformCode} },`
        })

        // console.log(modules);


        const bundle = `
            (function(modules) {
                function require(fileName) {
                    const fn = modules[fileName];
        
                    const module = { exports : {} };
        
                    fn(require, module, module.exports);
        
                    return module.exports;
                }

                require('${this.entry}');
            })({${modules}})
        `;

        // console.log(bundle);


        fs.writeFileSync(outputPath, bundle, 'utf-8')
    }

}

