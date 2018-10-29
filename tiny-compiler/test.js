/**
 * LISP                                     C
 * (add 2 2)                                add(2, 2)
 * (subtract 4 2)                           subtract(4, 2)
 * (add 2 (subtract 4 2))                   add(2, subtract(4, 2))
 * (add 2 (subtract 4 (accr 1)))            add(2, subtract(4, accr(1)))
 */

// node test.js '(add 2 (subtract 4 (accr 1)))'
var Compiler = require('./tiny-compiler-by-acker');
var args = process.argv.splice(2);
if (args == null || args.length <= 0) {
    throw new Error('you have to input at least one argv.');
}
var expression = args[0];
var cExpression = Compiler.compiler(expression);
console.log(cExpression);