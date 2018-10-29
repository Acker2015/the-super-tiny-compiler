/** 
 *                  LISP                      C
 *
 *   2 + 2          (add 2 2)                 add(2, 2)
 *   4 - 2          (subtract 4 2)            subtract(4, 2)
 *   2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
 * 
 * (add 2 (subtract 4 2))
 * 
 *  它产生的 Token 看起来或许是这样的：
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        }
 *   ]
 * 
 * 它的抽象语法树（AST）看起来或许是这样的：
 *
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2'
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4'
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2'
 *         }]
 *       }]
 *     }]
 *   }
 */
var symbol = {
    number: 'number',
    operator: 'operator',
    paren: 'paren'
}
function tokenizer(input) {
    var current = 0;
    var tokens = [];
    while (current < input.length) {
        var c = input[current];
        if (c === '(' || c === ')') {
            tokens.push({
                type: symbol.paren,
                value: c
            });
            //console.log(tokens);
            current++;
            continue;
        }
        var WHITESPACE = /\s|\t/;
        if (WHITESPACE.test(c)) {
            current++;
            continue;
        }
        var NUMBER = /[0-9]/;
        if (NUMBER.test(c)) {
            var value = '';
            while(current < input.length && NUMBER.test(c)) {
                value += c;
                current++;
                c = current === input.length - 1 ? '' : input[current];
            }
            tokens.push({
                type: symbol.number,
                value: value
            });
            //console.log(tokens);
            continue;
        }
        var LETTERS=/[a-z]/;
        if (LETTERS.test(c)) {
            var value = '';
            while(current < input.length && LETTERS.test(c)) {
                value += c;
                current++;
                c = current === input.length - 1 ? '' : input[current];
            }
            tokens.push({
                type: symbol.operator,
                value: value
            });
            //console.log(tokens);
            continue;
        }
        throw new TypeError("I don't know what this character is: " + c + ' current:' + current);
    }
    return tokens;
}

 /**
  * 词法分析 tokens -> AST
  * @param {token数组} tokens 
  */
 function parser(tokens) {
    var current = 0;
    function walk() {
        var token = tokens[current];
        if (token.type === symbol.number) {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value
            };
        }
        // CallExpression, 发现左括号
        if (token.type === symbol.paren && token.value === '(') {
            token = tokens[++current];
            var node = {
                type: 'CallExpression',
                name: token.value,          // 操作符
                params: []
            };
            token = tokens[++current];
            while(
                token.type !== symbol.paren ||
                (token.type === symbol.paren && token.value !== ')')
            ) {
                node.params.push(walk());
                token = tokens[current];
            }
            current++;
            return node;
        }
        throw new TypeError(token.type);
    }
    var ast = {
        type: 'Program',
        body: []
    }
    while(current < tokens.length) {
        ast.body.push(walk());
    }
    return ast;
}

module.exports = {
    tokenizer: tokenizer,
    parser: parser
}