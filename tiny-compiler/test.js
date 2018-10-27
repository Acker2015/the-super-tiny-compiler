//import * as Compiler from './tiny-compiler-by-acker.js'
var compiler = require('./tiny-compiler-by-acker');

var ce = '(add 2 (subtract 4 2))';
var tokens = compiler.tokenizer(ce);
console.log(tokens);