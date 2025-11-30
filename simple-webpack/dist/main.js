
(function (modules) {
  function require(fileName) {
    const fn = modules[fileName];

    const module = { exports: {} };

    fn(require, module, module.exports);

    return module.exports;
  }

  require('/Users/nanxiao/webpack/simple-webpack/src/index.js');
})({
  '/Users/nanxiao/webpack/simple-webpack/src/index.js': function (require, module, exports) {
    "use strict";

    var _greeting = require("./greeting.js");

    document.write((0, _greeting.greeting)('Jane'));
  }, './greeting.js': function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.greeting = greeting;

    var _a = require("./a.js");

    (0, _a.a)();

    function greeting(name) {
      return 'hello' + name;
    }
  }, './a.js': function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.a = a;
    function a() {
      console.log('a');
    }
  },
})
