const Compiler = require('./compiler');



class MyPlugin {
    apply(compiler) {
        compiler.hooks.break.tap('break', () => {
            console.log('break')
        })

        compiler.hooks.accelerate.tap("accelerate", (newSpeed) => {
            console.log(`Accelerating to ${newSpeed}`);

        })

        compiler.hooks.calculateRoutes.tapAsync('calculateRoutes', (source, target, routesList, callback) => {
            setTimeout(() => {
                console.log(`tapAsync to ${source} ${target} ${routesList}`);
                callback();
            }, 1000)
        })
    }
}

const options = {
    plugins: [
        new MyPlugin()
    ]
}

const compiler = new Compiler();

for (const plugin of options.plugins) {
    if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
    } else {
        plugin.apply(compiler);
    }
}


compiler.run()