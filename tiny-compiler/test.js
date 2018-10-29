/**
 input: (add 2 (subtract 4 2))
 tokens:
[ { type: 'paren', value: '(' },
  { type: 'operator', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'operator', value: 'subtract' },
  { type: 'number', value: '4' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' } ]
 */

var compiler = require('./tiny-compiler-by-acker');
var args = process.argv.splice(2);
if (args == null || args.length <= 0) {
    throw new Error('you have to input at least one argv.');
}
var expression = args[0];
var tokens = compiler.tokenizer(expression);
console.log(tokens);
var ast = compiler.parser(tokens);
console.log(ast);
console.log(ast.body[0].params);