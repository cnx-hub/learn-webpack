const { SyncHook, AsyncSeriesHook } = require('tapable')


module.exports = class Compiler {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newSpeed']),
            break: new SyncHook(),
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
        }
    }

    run() {
        this.accelerate(10);
        this.break()
        this.calculateRoutes('Async', 'hook', 'demo')
    }

    accelerate(newSpeed) {
        this.hooks.accelerate.call(newSpeed)
    }

    break() {
        this.hooks.break.call();
    }

    calculateRoutes() {
        this.hooks.calculateRoutes.callAsync(...arguments, (err, res) => {
            console.log('calculateRoutes');
        });
    }
}