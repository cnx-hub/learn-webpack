const Compiler = require('./compiler.js');

const option = require('../simplepack.config.js');

new Compiler(option).run();