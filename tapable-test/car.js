const { SyncHook, AsyncSeriesHook } = require('tapable');

class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newSpeed']),
            brake: new SyncHook(),
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
        }
    }
}

const myCar = new Car();


myCar.hooks.accelerate.tap('accelerate', (newSpeed) => {
    console.log(`Accelerating to ${newSpeed}`);
})

myCar.hooks.brake.tap('brake', () => {
    console.log('Braking!');
});

//绑定一个异步Promise钩子
myCar.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise", (source, target, routesList, callback) => {
    // return a promise
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`tapPromise to ${source} ${target} ${routesList}`)
            resolve(routesList);
        }, 1000)
    })
});



myCar.hooks.accelerate.call(100);

myCar.hooks.brake.call();

//执行异步钩子
myCar.hooks.calculateRoutes.promise('Async', 'hook', 'demo').then((res) => {
    // console.timeEnd('cost');
    console.log(res);
    
}, err => {
    console.error(err);
    console.timeEnd('cost');
});