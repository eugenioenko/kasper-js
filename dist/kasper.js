/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/kasper.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/expression-parser.ts":
/*!**********************************!*\
  !*** ./src/expression-parser.ts ***!
  \**********************************/
/*! exports provided: ExpressionParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpressionParser", function() { return ExpressionParser; });
/* harmony import */ var _types_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/error */ "./src/types/error.ts");
/* harmony import */ var _types_expressions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/expressions */ "./src/types/expressions.ts");
/* harmony import */ var _types_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types/token */ "./src/types/token.ts");



class ExpressionParser {
    constructor() {
        this.errorLevel = 1;
    }
    parse(tokens) {
        this.current = 0;
        this.tokens = tokens;
        this.errors = [];
        const expressions = [];
        while (!this.eof()) {
            try {
                expressions.push(this.expression());
            }
            catch (e) {
                if (e instanceof _types_error__WEBPACK_IMPORTED_MODULE_0__["KasperError"]) {
                    this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
                }
                else {
                    this.errors.push(`${e}`);
                    if (this.errors.length > 100) {
                        this.errors.push("Parse Error limit exceeded");
                        return expressions;
                    }
                }
                this.synchronize();
            }
        }
        return expressions;
    }
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    advance() {
        if (!this.eof()) {
            this.current++;
        }
        return this.previous();
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    check(type) {
        return this.peek().type === type;
    }
    eof() {
        return this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Eof);
    }
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        return this.error(this.peek(), message + `, unexpected token "${this.peek().lexeme}"`);
    }
    error(token, message) {
        throw new _types_error__WEBPACK_IMPORTED_MODULE_0__["KasperError"](message, token.line, token.col);
    }
    synchronize() {
        do {
            if (this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Semicolon) || this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBrace)) {
                this.advance();
                return;
            }
            this.advance();
        } while (!this.eof());
    }
    foreach(tokens) {
        this.current = 0;
        this.tokens = tokens;
        this.errors = [];
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Const, `Expected const definition starting "each" statement`);
        const name = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Identifier, `Expected an identifier inside "each" statement`);
        let key = null;
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].With)) {
            key = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Identifier, `Expected a "key" identifier after "with" keyword in foreach statement`);
        }
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Of, `Expected "of" keyword inside foreach statement`);
        const iterable = this.expression();
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Each"](name, key, iterable, name.line);
    }
    expression() {
        const expression = this.assignment();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Semicolon)) {
            // consume all semicolons
            // tslint:disable-next-line
            while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Semicolon)) { }
        }
        return expression;
    }
    assignment() {
        const expr = this.ternary();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Equal, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].PlusEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].MinusEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].StarEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].SlashEqual)) {
            const operator = this.previous();
            let value = this.assignment();
            if (expr instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Variable"]) {
                const name = expr.name;
                if (operator.type !== _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Equal) {
                    value = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Binary"](new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Variable"](name, name.line), operator, value, operator.line);
                }
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Assign"](name, value, name.line);
            }
            else if (expr instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Get"]) {
                if (operator.type !== _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Equal) {
                    value = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Binary"](new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Get"](expr.entity, expr.key, expr.type, expr.line), operator, value, operator.line);
                }
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Set"](expr.entity, expr.key, value, expr.line);
            }
            this.error(operator, `Invalid l-value, is not an assigning target.`);
        }
        return expr;
    }
    ternary() {
        const expr = this.nullCoalescing();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Question)) {
            const thenExpr = this.ternary();
            this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Colon, `Expected ":" after ternary ? expression`);
            const elseExpr = this.ternary();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Ternary"](expr, thenExpr, elseExpr, expr.line);
        }
        return expr;
    }
    nullCoalescing() {
        const expr = this.logicalOr();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].QuestionQuestion)) {
            const rightExpr = this.nullCoalescing();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["NullCoalescing"](expr, rightExpr, expr.line);
        }
        return expr;
    }
    logicalOr() {
        let expr = this.logicalAnd();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Or)) {
            const operator = this.previous();
            const right = this.logicalAnd();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Logical"](expr, operator, right, operator.line);
        }
        return expr;
    }
    logicalAnd() {
        let expr = this.equality();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].And)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Logical"](expr, operator, right, operator.line);
        }
        return expr;
    }
    equality() {
        let expr = this.addition();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].BangEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].EqualEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Greater, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].GreaterEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Less, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LessEqual)) {
            const operator = this.previous();
            const right = this.addition();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Binary"](expr, operator, right, operator.line);
        }
        return expr;
    }
    addition() {
        let expr = this.modulus();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Minus, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Plus)) {
            const operator = this.previous();
            const right = this.modulus();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Binary"](expr, operator, right, operator.line);
        }
        return expr;
    }
    modulus() {
        let expr = this.multiplication();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Percent)) {
            const operator = this.previous();
            const right = this.multiplication();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Binary"](expr, operator, right, operator.line);
        }
        return expr;
    }
    multiplication() {
        let expr = this.typeof();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Slash, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Star)) {
            const operator = this.previous();
            const right = this.typeof();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Binary"](expr, operator, right, operator.line);
        }
        return expr;
    }
    typeof() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Typeof)) {
            const operator = this.previous();
            const value = this.typeof();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Typeof"](value, operator.line);
        }
        return this.unary();
    }
    unary() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Minus, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Bang, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Dollar, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].PlusPlus, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].MinusMinus)) {
            const operator = this.previous();
            const right = this.unary();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Unary"](operator, right, operator.line);
        }
        return this.newKeyword();
    }
    newKeyword() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].New)) {
            const keyword = this.previous();
            const construct = this.call();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["New"](construct, keyword.line);
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        let consumed = true;
        do {
            consumed = false;
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LeftParen)) {
                consumed = true;
                do {
                    const args = [];
                    if (!this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightParen)) {
                        do {
                            args.push(this.expression());
                        } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Comma));
                    }
                    const paren = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightParen, `Expected ")" after arguments`);
                    expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Call"](expr, paren, args, paren.line);
                } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LeftParen));
            }
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Dot, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].QuestionDot)) {
                consumed = true;
                expr = this.dotGet(expr, this.previous());
            }
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LeftBracket)) {
                consumed = true;
                expr = this.bracketGet(expr, this.previous());
            }
        } while (consumed);
        return expr;
    }
    dotGet(expr, operator) {
        const name = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Identifier, `Expect property name after '.'`);
        const key = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Key"](name, name.line);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Get"](expr, key, operator.type, name.line);
    }
    bracketGet(expr, operator) {
        let key = null;
        if (!this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBracket)) {
            key = this.expression();
        }
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBracket, `Expected "]" after an index`);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Get"](expr, key, operator.type, operator.line);
    }
    primary() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].False)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Literal"](false, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].True)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Literal"](true, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Null)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Literal"](null, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Undefined)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Literal"](undefined, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Number) || this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].String)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Literal"](this.previous().literal, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Template)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Template"](this.previous().literal, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Identifier)) {
            const identifier = this.previous();
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].PlusPlus)) {
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Postfix"](identifier, 1, identifier.line);
            }
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].MinusMinus)) {
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Postfix"](identifier, -1, identifier.line);
            }
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Variable"](identifier, identifier.line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LeftParen)) {
            const expr = this.expression();
            this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightParen, `Expected ")" after expression`);
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Grouping"](expr, expr.line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LeftBrace)) {
            return this.dictionary();
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].LeftBracket)) {
            return this.list();
        }
        throw this.error(this.peek(), `Expected expression, unexpected token "${this.peek().lexeme}"`);
        // unreacheable code
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Literal"](null, 0);
    }
    dictionary() {
        const leftBrace = this.previous();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBrace)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Dictionary"]([], this.previous().line);
        }
        const properties = [];
        do {
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].String, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Identifier, _types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Number)) {
                const key = this.previous();
                if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Colon)) {
                    const value = this.expression();
                    properties.push(new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Set"](null, new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Key"](key, key.line), value, key.line));
                }
                else {
                    const value = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Variable"](key, key.line);
                    properties.push(new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Set"](null, new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Key"](key, key.line), value, key.line));
                }
            }
            else {
                this.error(this.peek(), `String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${this.peek().lexeme}`);
            }
        } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Comma));
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBrace, `Expected "}" after object literal`);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["Dictionary"](properties, leftBrace.line);
    }
    list() {
        const values = [];
        const leftBracket = this.previous();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBracket)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["List"]([], this.previous().line);
        }
        do {
            values.push(this.expression());
        } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].Comma));
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__["TokenType"].RightBracket, `Expected "]" after array declaration`);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__["List"](values, leftBracket.line);
    }
}


/***/ }),

/***/ "./src/interpreter.ts":
/*!****************************!*\
  !*** ./src/interpreter.ts ***!
  \****************************/
/*! exports provided: Interpreter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Interpreter", function() { return Interpreter; });
/* harmony import */ var _types_expressions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/expressions */ "./src/types/expressions.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scope */ "./src/scope.ts");
/* harmony import */ var _types_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types/token */ "./src/types/token.ts");





class Interpreter {
    constructor() {
        this.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__["Scope"]();
        this.errors = [];
        this.scanner = new _scanner__WEBPACK_IMPORTED_MODULE_1__["Scanner"]();
        this.parser = new _expression_parser__WEBPACK_IMPORTED_MODULE_2__["ExpressionParser"]();
    }
    evaluate(expr) {
        return (expr.result = expr.accept(this));
    }
    error(message) {
        throw new Error(`Runtime Error => ${message}`);
    }
    visitVariableExpr(expr) {
        return this.scope.get(expr.name.lexeme);
    }
    visitAssignExpr(expr) {
        const value = this.evaluate(expr.value);
        this.scope.set(expr.name.lexeme, value);
        return value;
    }
    visitKeyExpr(expr) {
        return expr.name.literal;
    }
    visitGetExpr(expr) {
        const entity = this.evaluate(expr.entity);
        const key = this.evaluate(expr.key);
        if (!entity && expr.type === _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].QuestionDot) {
            return undefined;
        }
        return entity[key];
    }
    visitSetExpr(expr) {
        const entity = this.evaluate(expr.entity);
        const key = this.evaluate(expr.key);
        const value = this.evaluate(expr.value);
        entity[key] = value;
        return value;
    }
    visitPostfixExpr(expr) {
        const value = this.scope.get(expr.name.lexeme);
        const newValue = value + expr.increment;
        this.scope.set(expr.name.lexeme, newValue);
        return value;
    }
    visitListExpr(expr) {
        const values = [];
        for (const expression of expr.value) {
            const value = this.evaluate(expression);
            values.push(value);
        }
        return values;
    }
    templateParse(source) {
        const tokens = this.scanner.scan(source);
        const expressions = this.parser.parse(tokens);
        if (this.parser.errors.length) {
            this.error(`Template string  error: ${this.parser.errors[0]}`);
        }
        let result = "";
        for (const expression of expressions) {
            result += this.evaluate(expression).toString();
        }
        return result;
    }
    visitTemplateExpr(expr) {
        const result = expr.value.replace(/\{\{([\s\S]+?)\}\}/g, (m, placeholder) => {
            return this.templateParse(placeholder);
        });
        return result;
    }
    visitBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Minus:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].MinusEqual:
                return left - right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Slash:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].SlashEqual:
                return left / right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Star:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].StarEqual:
                return left * right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Percent:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].PercentEqual:
                return left % right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Plus:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].PlusEqual:
                return left + right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Pipe:
                return left | right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Caret:
                return left ^ right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Greater:
                return left > right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].GreaterEqual:
                return left >= right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Less:
                return left < right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].LessEqual:
                return left <= right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].EqualEqual:
                return left === right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].BangEqual:
                return left !== right;
            default:
                this.error("Unknown binary operator " + expr.operator);
                return null; // unreachable
        }
    }
    visitLogicalExpr(expr) {
        const left = this.evaluate(expr.left);
        if (expr.operator.type === _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Or) {
            if (left) {
                return left;
            }
        }
        else {
            if (!left) {
                return left;
            }
        }
        return this.evaluate(expr.right);
    }
    visitTernaryExpr(expr) {
        return this.evaluate(expr.condition).isTruthy()
            ? this.evaluate(expr.thenExpr)
            : this.evaluate(expr.elseExpr);
    }
    visitNullCoalescingExpr(expr) {
        const left = this.evaluate(expr.left);
        if (!left) {
            return this.evaluate(expr.right);
        }
        return left;
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Minus:
                return -right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].Bang:
                return !right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].PlusPlus:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].MinusMinus:
                const newValue = Number(right) + (expr.operator.type === _types_token__WEBPACK_IMPORTED_MODULE_4__["TokenType"].PlusPlus ? 1 : -1);
                if (expr.right instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__["Variable"]) {
                    this.scope.set(expr.right.name.lexeme, newValue);
                }
                else if (expr.right instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__["Get"]) {
                    const assign = new _types_expressions__WEBPACK_IMPORTED_MODULE_0__["Set"](expr.right.entity, expr.right.key, new _types_expressions__WEBPACK_IMPORTED_MODULE_0__["Literal"](newValue, expr.line), expr.line);
                    this.evaluate(assign);
                }
                else {
                    this.error(`Invalid right-hand side expression in prefix operation:  ${expr.right}`);
                }
                return newValue;
            default:
                this.error(`Unknown unary operator ' + expr.operator`);
                return null; // should be unreachable
        }
    }
    visitCallExpr(expr) {
        // verify callee is a function
        const callee = this.evaluate(expr.callee);
        if (typeof callee !== "function") {
            this.error(`${callee} is not a function`);
        }
        // evaluate function arguments
        const args = [];
        for (const argument of expr.args) {
            args.push(this.evaluate(argument));
        }
        // execute function
        return callee(...args);
    }
    visitNewExpr(expr) {
        const newCall = expr.clazz;
        // internal class definition instance
        const clazz = this.evaluate(newCall.callee);
        if (typeof clazz !== "function") {
            this.error(`'${clazz}' is not a class. 'new' statement must be used with classes.`);
        }
        const args = [];
        for (const arg of newCall.args) {
            args.push(this.evaluate(arg));
        }
        return new clazz(...args);
    }
    visitDictionaryExpr(expr) {
        const dict = {};
        for (const property of expr.properties) {
            const key = this.evaluate(property.key);
            const value = this.evaluate(property.value);
            dict[key] = value;
        }
        return dict;
    }
    visitTypeofExpr(expr) {
        return typeof this.evaluate(expr.value);
    }
    visitEachExpr(expr) {
        return [
            expr.name.lexeme,
            expr.key ? expr.key.lexeme : null,
            this.evaluate(expr.iterable),
        ];
    }
}


/***/ }),

/***/ "./src/kasper.ts":
/*!***********************!*\
  !*** ./src/kasper.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _template_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-parser */ "./src/template-parser.ts");
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _interpreter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");
/* harmony import */ var _transpiler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transpiler */ "./src/transpiler.ts");
/* harmony import */ var _types_demo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types/demo */ "./src/types/demo.ts");
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./viewer */ "./src/viewer.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");







function execute(source) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"]();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
        return JSON.stringify(parser.errors);
    }
    const result = JSON.stringify(nodes);
    return result;
}
function transpile(source, entries) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"]();
    const nodes = parser.parse(source);
    const transpiler = new _transpiler__WEBPACK_IMPORTED_MODULE_3__["Transpiler"]();
    const result = transpiler.transpile(nodes, entries);
    return result;
}
if (typeof window !== "undefined") {
    (window || {}).kasper = {
        demoJson: _types_demo__WEBPACK_IMPORTED_MODULE_4__["DemoJson"],
        demoSourceCode: _types_demo__WEBPACK_IMPORTED_MODULE_4__["DemoSource"],
        execute,
        transpile,
    };
}
else if (typeof exports !== "undefined") {
    exports.kasper = {
        ExpressionParser: _expression_parser__WEBPACK_IMPORTED_MODULE_1__["ExpressionParser"],
        Interpreter: _interpreter__WEBPACK_IMPORTED_MODULE_2__["Interpreter"],
        Scanner: _scanner__WEBPACK_IMPORTED_MODULE_6__["Scanner"],
        TemplateParser: _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"],
        Transpiler: _transpiler__WEBPACK_IMPORTED_MODULE_3__["Transpiler"],
        Viewer: _viewer__WEBPACK_IMPORTED_MODULE_5__["Viewer"],
    };
}


/***/ }),

/***/ "./src/scanner.ts":
/*!************************!*\
  !*** ./src/scanner.ts ***!
  \************************/
/*! exports provided: Scanner */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scanner", function() { return Scanner; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _types_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/token */ "./src/types/token.ts");


class Scanner {
    scan(source) {
        this.source = source;
        this.tokens = [];
        this.errors = [];
        this.current = 0;
        this.start = 0;
        this.line = 1;
        this.col = 1;
        while (!this.eof()) {
            this.start = this.current;
            try {
                this.getToken();
            }
            catch (e) {
                this.errors.push(`${e}`);
                if (this.errors.length > 100) {
                    this.errors.push("Error limit exceeded");
                    return this.tokens;
                }
            }
        }
        this.tokens.push(new _types_token__WEBPACK_IMPORTED_MODULE_1__["Token"](_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Eof, "", null, this.line, 0));
        return this.tokens;
    }
    eof() {
        return this.current >= this.source.length;
    }
    advance() {
        if (this.peek() === "\n") {
            this.line++;
            this.col = 0;
        }
        this.current++;
        this.col++;
        return this.source.charAt(this.current - 1);
    }
    addToken(tokenType, literal) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new _types_token__WEBPACK_IMPORTED_MODULE_1__["Token"](tokenType, text, literal, this.line, this.col));
    }
    match(expected) {
        if (this.eof()) {
            return false;
        }
        if (this.source.charAt(this.current) !== expected) {
            return false;
        }
        this.current++;
        return true;
    }
    peek() {
        if (this.eof()) {
            return "\0";
        }
        return this.source.charAt(this.current);
    }
    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return "\0";
        }
        return this.source.charAt(this.current + 1);
    }
    comment() {
        while (this.peek() !== "\n" && !this.eof()) {
            this.advance();
        }
    }
    multilineComment() {
        while (!this.eof() && !(this.peek() === "*" && this.peekNext() === "/")) {
            this.advance();
        }
        if (this.eof()) {
            this.error('Unterminated comment, expecting closing "*/"');
        }
        else {
            // the closing slash '*/'
            this.advance();
            this.advance();
        }
    }
    string(quote) {
        while (this.peek() !== quote && !this.eof()) {
            this.advance();
        }
        // Unterminated string.
        if (this.eof()) {
            this.error(`Unterminated string, expecting closing ${quote}`);
            return;
        }
        // The closing ".
        this.advance();
        // Trim the surrounding quotes.
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(quote !== "`" ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].String : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Template, value);
    }
    number() {
        // gets integer part
        while (_utils__WEBPACK_IMPORTED_MODULE_0__["isDigit"](this.peek())) {
            this.advance();
        }
        // checks for fraction
        if (this.peek() === "." && _utils__WEBPACK_IMPORTED_MODULE_0__["isDigit"](this.peekNext())) {
            this.advance();
        }
        // gets fraction part
        while (_utils__WEBPACK_IMPORTED_MODULE_0__["isDigit"](this.peek())) {
            this.advance();
        }
        // checks for exponent
        if (this.peek().toLowerCase() === "e") {
            this.advance();
            if (this.peek() === "-" || this.peek() === "+") {
                this.advance();
            }
        }
        while (_utils__WEBPACK_IMPORTED_MODULE_0__["isDigit"](this.peek())) {
            this.advance();
        }
        const value = this.source.substring(this.start, this.current);
        this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Number, Number(value));
    }
    identifier() {
        while (_utils__WEBPACK_IMPORTED_MODULE_0__["isAlphaNumeric"](this.peek())) {
            this.advance();
        }
        const value = this.source.substring(this.start, this.current);
        const capitalized = _utils__WEBPACK_IMPORTED_MODULE_0__["capitalize"](value);
        if (_utils__WEBPACK_IMPORTED_MODULE_0__["isKeyword"](capitalized)) {
            this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"][capitalized], value);
        }
        else {
            this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Identifier, value);
        }
    }
    getToken() {
        const char = this.advance();
        switch (char) {
            case "(":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].LeftParen, null);
                break;
            case ")":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].RightParen, null);
                break;
            case "[":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].LeftBracket, null);
                break;
            case "]":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].RightBracket, null);
                break;
            case "{":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].LeftBrace, null);
                break;
            case "}":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].RightBrace, null);
                break;
            case ",":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Comma, null);
                break;
            case ";":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Semicolon, null);
                break;
            case "^":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Caret, null);
                break;
            case "$":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Dollar, null);
                break;
            case "#":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Hash, null);
                break;
            case ":":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Arrow : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Colon, null);
                break;
            case "*":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].StarEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Star, null);
                break;
            case "%":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].PercentEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Percent, null);
                break;
            case "|":
                this.addToken(this.match("|") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Or : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Pipe, null);
                break;
            case "&":
                this.addToken(this.match("&") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].And : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Ampersand, null);
                break;
            case ">":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].GreaterEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Greater, null);
                break;
            case "!":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].BangEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Bang, null);
                break;
            case "?":
                this.addToken(this.match("?")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].QuestionQuestion
                    : this.match(".")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].QuestionDot
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Question, null);
                break;
            case "=":
                this.addToken(this.match("=")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].EqualEqual
                    : this.match(">")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Arrow
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Equal, null);
                break;
            case "+":
                this.addToken(this.match("+")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].PlusPlus
                    : this.match("=")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].PlusEqual
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Plus, null);
                break;
            case "-":
                this.addToken(this.match("-")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].MinusMinus
                    : this.match("=")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].MinusEqual
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Minus, null);
                break;
            case "<":
                this.addToken(this.match("=")
                    ? this.match(">")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].LessEqualGreater
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].LessEqual
                    : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Less, null);
                break;
            case ".":
                if (this.match(".")) {
                    if (this.match(".")) {
                        this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].DotDotDot, null);
                    }
                    else {
                        this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].DotDot, null);
                    }
                }
                else {
                    this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Dot, null);
                }
                break;
            case "/":
                if (this.match("/")) {
                    this.comment();
                }
                else if (this.match("*")) {
                    this.multilineComment();
                }
                else {
                    this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].SlashEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__["TokenType"].Slash, null);
                }
                break;
            case `'`:
            case `"`:
            case "`":
                this.string(char);
                break;
            // ignore cases
            case "\n":
            case " ":
            case "\r":
            case "\t":
                break;
            // complex cases
            default:
                if (_utils__WEBPACK_IMPORTED_MODULE_0__["isDigit"](char)) {
                    this.number();
                }
                else if (_utils__WEBPACK_IMPORTED_MODULE_0__["isAlpha"](char)) {
                    this.identifier();
                }
                else {
                    this.error(`Unexpected character '${char}'`);
                }
                break;
        }
    }
    error(message) {
        throw new Error(`Scan Error (${this.line}:${this.col}) => ${message}`);
    }
}


/***/ }),

/***/ "./src/scope.ts":
/*!**********************!*\
  !*** ./src/scope.ts ***!
  \**********************/
/*! exports provided: Scope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scope", function() { return Scope; });
class Scope {
    constructor(parent, entries) {
        this.parent = parent ? parent : null;
        this.init(entries);
    }
    init(entries) {
        if (entries) {
            this.values = new Map(Object.entries(entries));
        }
        else {
            this.values = new Map();
        }
    }
    set(name, value) {
        this.values.set(name, value);
    }
    get(key) {
        if (this.values.has(key)) {
            return this.values.get(key);
        }
        if (this.parent !== null) {
            return this.parent.get(key);
        }
        return window[key];
    }
}


/***/ }),

/***/ "./src/template-parser.ts":
/*!********************************!*\
  !*** ./src/template-parser.ts ***!
  \********************************/
/*! exports provided: TemplateParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemplateParser", function() { return TemplateParser; });
/* harmony import */ var _types_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/error */ "./src/types/error.ts");
/* harmony import */ var _types_nodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/nodes */ "./src/types/nodes.ts");
/* harmony import */ var _types_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types/token */ "./src/types/token.ts");



class TemplateParser {
    parse(source) {
        this.current = 0;
        this.line = 1;
        this.col = 1;
        this.source = source;
        this.errors = [];
        this.nodes = [];
        while (!this.eof()) {
            try {
                const node = this.node();
                if (node === null) {
                    continue;
                }
                this.nodes.push(node);
            }
            catch (e) {
                if (e instanceof _types_error__WEBPACK_IMPORTED_MODULE_0__["KasperError"]) {
                    this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
                }
                else {
                    this.errors.push(`${e}`);
                    if (this.errors.length > 10) {
                        this.errors.push("Parse Error limit exceeded");
                        return this.nodes;
                    }
                }
                break;
            }
        }
        this.source = "";
        return this.nodes;
    }
    match(...chars) {
        for (const char of chars) {
            if (this.check(char)) {
                this.current += char.length;
                return true;
            }
        }
        return false;
    }
    advance(eofError = "") {
        if (!this.eof()) {
            if (this.check("\n")) {
                this.line += 1;
                this.col = 0;
            }
            this.col += 1;
            this.current++;
        }
        else {
            this.error(`Unexpected end of file. ${eofError}`);
        }
    }
    peek(...chars) {
        for (const char of chars) {
            if (this.check(char)) {
                return true;
            }
        }
        return false;
    }
    check(char) {
        return this.source.slice(this.current, this.current + char.length) === char;
    }
    eof() {
        return this.current > this.source.length;
    }
    error(message) {
        throw new _types_error__WEBPACK_IMPORTED_MODULE_0__["KasperError"](message, this.line, this.col);
    }
    node() {
        this.whitespace();
        let node;
        if (this.match("</")) {
            this.error("Unexpected closing tag");
        }
        if (this.match("<!--")) {
            node = this.comment();
        }
        else if (this.match("<!doctype") || this.match("<!DOCTYPE")) {
            node = this.doctype();
        }
        else if (this.match("<")) {
            node = this.element();
        }
        else {
            node = this.text();
        }
        this.whitespace();
        return node;
    }
    comment() {
        const start = this.current;
        do {
            this.advance("Expected comment closing '-->'");
        } while (!this.match(`-->`));
        const comment = this.source.slice(start, this.current - 3);
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Comment"](comment, this.line);
    }
    doctype() {
        const start = this.current;
        do {
            this.advance("Expected closing doctype");
        } while (!this.match(`>`));
        const doctype = this.source.slice(start, this.current - 1).trim();
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Doctype"](doctype, this.line);
    }
    element() {
        const line = this.line;
        const name = this.identifier("/", ">");
        if (!name) {
            this.error("Expected a tag name");
        }
        const attributes = this.attributes();
        if (this.match("/>") ||
            (_types_token__WEBPACK_IMPORTED_MODULE_2__["SelfClosingTags"].includes(name) && this.match(">"))) {
            return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, [], true, this.line);
        }
        if (!this.match(">")) {
            this.error("Expected closing tag");
        }
        let children = [];
        this.whitespace();
        if (!this.peek("</")) {
            children = this.children(name);
        }
        this.close(name);
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, children, false, line);
    }
    close(name) {
        if (!this.match("</")) {
            this.error(`Expected </${name}>`);
        }
        if (!this.match(`${name}`)) {
            this.error(`Expected </${name}>`);
        }
        this.whitespace();
        if (!this.match(">")) {
            this.error(`Expected </${name}>`);
        }
    }
    children(parent) {
        const children = [];
        do {
            if (this.eof()) {
                this.error(`Expected </${parent}>`);
            }
            const node = this.node();
            if (node === null) {
                continue;
            }
            children.push(node);
        } while (!this.peek(`</`));
        return children;
    }
    attributes() {
        const attributes = [];
        while (!this.peek(">", "/>") && !this.eof()) {
            this.whitespace();
            const line = this.line;
            const name = this.identifier("=", ">", "/>");
            if (!name) {
                this.error("Blank attribute name");
            }
            this.whitespace();
            let value = "";
            if (this.match("=")) {
                this.whitespace();
                if (this.match("'")) {
                    value = this.string("'");
                }
                else if (this.match('"')) {
                    value = this.string('"');
                }
                else {
                    value = this.identifier(">", "/>");
                }
            }
            this.whitespace();
            attributes.push(new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Attribute"](name, value, line));
        }
        return attributes;
    }
    text() {
        const start = this.current;
        const line = this.line;
        while (!this.peek("<") && !this.eof()) {
            this.advance();
        }
        const text = this.source.slice(start, this.current).trim();
        if (!text) {
            return null;
        }
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Text"](text, line);
    }
    whitespace() {
        let count = 0;
        while (this.peek(..._types_token__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"]) && !this.eof()) {
            count += 1;
            this.advance();
        }
        return count;
    }
    identifier(...closing) {
        this.whitespace();
        const start = this.current;
        while (!this.peek(..._types_token__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"], ...closing)) {
            this.advance(`Expected closing ${closing}`);
        }
        const end = this.current;
        this.whitespace();
        return this.source.slice(start, end).trim();
    }
    string(closing) {
        const start = this.current;
        while (!this.match(closing)) {
            this.advance(`Expected closing ${closing}`);
        }
        return this.source.slice(start, this.current - 1);
    }
}


/***/ }),

/***/ "./src/transpiler.ts":
/*!***************************!*\
  !*** ./src/transpiler.ts ***!
  \***************************/
/*! exports provided: Transpiler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transpiler", function() { return Transpiler; });
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _interpreter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scope */ "./src/scope.ts");




class Transpiler {
    constructor() {
        this.scanner = new _scanner__WEBPACK_IMPORTED_MODULE_2__["Scanner"]();
        this.parser = new _expression_parser__WEBPACK_IMPORTED_MODULE_0__["ExpressionParser"]();
        this.interpreter = new _interpreter__WEBPACK_IMPORTED_MODULE_1__["Interpreter"]();
        this.errors = [];
    }
    evaluate(node, parent) {
        node.accept(this, parent);
    }
    execute(source) {
        const tokens = this.scanner.scan(source);
        const expressions = this.parser.parse(tokens);
        return expressions.map((expression) => this.interpreter.evaluate(expression));
    }
    transpile(nodes, entries) {
        const container = document.createElement("kasper");
        this.interpreter.scope.init(entries);
        this.errors = [];
        try {
            this.createSiblings(nodes, container);
        }
        catch (e) {
            console.error(`${e}`);
        }
        return container;
    }
    visitElementKNode(node, parent) {
        this.createElement(node, parent);
    }
    visitTextKNode(node, parent) {
        const regex = /\{\{.+\}\}/;
        let text;
        if (regex.test(node.value)) {
            const result = node.value.replace(/\{\{([\s\S]+?)\}\}/g, (m, placeholder) => {
                return this.templateParse(placeholder);
            });
            text = document.createTextNode(result);
        }
        else {
            text = document.createTextNode(node.value);
        }
        if (parent) {
            parent.appendChild(text);
        }
    }
    visitAttributeKNode(node, parent) {
        const attr = document.createAttribute(node.name);
        if (node.value) {
            attr.value = node.value;
        }
        if (parent) {
            parent.setAttributeNode(attr);
        }
    }
    visitCommentKNode(node, parent) {
        const result = new Comment(node.value);
        if (parent) {
            parent.appendChild(result);
        }
    }
    findAttr(node, ...name) {
        const attrib = node.attributes.find((attr) => name.includes(attr.name));
        if (attrib) {
            return attrib;
        }
        return null;
    }
    doIf(expressions, parent) {
        const $if = this.execute(expressions[0][1].value);
        if ($if && $if.length && $if[0]) {
            this.createElement(expressions[0][0], parent);
            return;
        }
        for (const expression of expressions.slice(1, expressions.length)) {
            if ((this.findAttr(expression[0]), "@elseif")) {
                const $elseif = this.execute(expression[1].value);
                if ($elseif && $elseif.length && $elseif[0]) {
                    this.createElement(expression[0], parent);
                    return;
                }
                else {
                    continue;
                }
            }
            if ((this.findAttr(expression[0]), "@else")) {
                this.createElement(expression[0], parent);
                return;
            }
        }
    }
    doEach(each, node, parent) {
        const tokens = this.scanner.scan(each.value);
        const [name, key, iterable] = this.interpreter.evaluate(this.parser.foreach(tokens));
        const originalScope = this.interpreter.scope;
        let index = 0;
        for (const item of iterable) {
            const scope = { [name]: item };
            if (key) {
                scope[key] = index;
            }
            this.interpreter.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__["Scope"](originalScope, scope);
            this.createElement(node, parent);
            index += 1;
        }
        this.interpreter.scope = originalScope;
    }
    doInit(init, node, parent) {
        const originalScope = this.interpreter.scope;
        this.interpreter.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__["Scope"](originalScope);
        this.execute(init.value);
        this.createElement(node, parent);
        this.interpreter.scope = originalScope;
    }
    createSiblings(nodes, parent) {
        let current = 0;
        while (current < nodes.length) {
            const node = nodes[current++];
            if (node.type === "element") {
                const $each = this.findAttr(node, "@each");
                if ($each) {
                    this.doEach($each, node, parent);
                    continue;
                }
                const $if = this.findAttr(node, "@if");
                if ($if) {
                    const expressions = [[node, $if]];
                    const tag = node.name;
                    let found = true;
                    while (found) {
                        if (current >= nodes.length) {
                            break;
                        }
                        const attr = this.findAttr(nodes[current], "@else", "@elseif");
                        if (nodes[current].name === tag && attr) {
                            expressions.push([nodes[current], attr]);
                            current += 1;
                        }
                        else {
                            found = false;
                        }
                    }
                    this.doIf(expressions, parent);
                    continue;
                }
                const $init = this.findAttr(node, "@init");
                if ($init) {
                    this.doInit($init, node, parent);
                    continue;
                }
            }
            this.evaluate(node, parent);
        }
    }
    createElement(node, parent) {
        const element = document.createElement(node.name);
        // event binding
        const events = node.attributes.filter((attr) => attr.name.startsWith("@on:"));
        for (const event of events) {
            this.createEventListener(element, event);
        }
        // attributes
        node.attributes
            .filter((attr) => !attr.name.startsWith("@"))
            .map((attr) => this.evaluate(attr, element));
        if (node.self) {
            return;
        }
        this.createSiblings(node.children, element);
        if (parent) {
            parent.appendChild(element);
        }
    }
    createEventListener(element, attr) {
        const type = attr.name.split(":")[1];
        element.addEventListener(type, () => {
            this.execute(attr.value);
        });
    }
    templateParse(source) {
        const tokens = this.scanner.scan(source);
        const expressions = this.parser.parse(tokens);
        if (this.parser.errors.length) {
            this.error(`Template string  error: ${this.parser.errors[0]}`);
        }
        let result = "";
        for (const expression of expressions) {
            result += `${this.interpreter.evaluate(expression)}`;
        }
        return result;
    }
    visitDoctypeKNode(node) {
        return;
        // return document.implementation.createDocumentType("html", "", "");
    }
    error(message) {
        throw new Error(`Runtime Error => ${message}`);
    }
}


/***/ }),

/***/ "./src/types/demo.ts":
/*!***************************!*\
  !*** ./src/types/demo.ts ***!
  \***************************/
/*! exports provided: DemoSource, DemoJson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoSource", function() { return DemoSource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoJson", function() { return DemoJson; });
const DemoSource = `
<div id="top" role="document">
  <header>
    <h3>{{person.name}}</h3>
    <h4>{{person.profession}}</h4>
    <p @if="person.age > 21">Age is greater than 21</p>
    <p @elseif="person.age == 21">Age is equal to 21</p>
    <p @elseif="person.age < 21">Age is less than 21</p>
    <p @else>Age is impossible</p>
  </header>
  <h4>Hobbies ({{person.hobbies.length}}):</h4>
  <ul>
    <li @each="const hobby with index of person.hobbies" class="text-red">
      {{index + 1}}: {{hobby}}
    </li>
  </ul>
  <div>
    100 + 20 / (10 * (10 -20) + 4) =
    {{100 + 20 / (10 * (10 -20) + 4)}}
  </div>
  <div @init="student = {name: person.name, degree: 'Masters'}; console.log(student.name)">
     {{student.name}}
  </div>
  <div  class="sdf-v-margin">
    <button
      @on:click="alert('Hello World'); console.log(100 / 2.5 + 15)"
    >
      CLICK ME
    </button>
  </div>
</div>
`;
const DemoJson = `
{
  "person": {
    "name": "John Doe",
    "profession": "Software Developer",
    "age": 20,
    "hobbies": ["reading", "music", "golf"]
  }
}
`;


/***/ }),

/***/ "./src/types/error.ts":
/*!****************************!*\
  !*** ./src/types/error.ts ***!
  \****************************/
/*! exports provided: KasperError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KasperError", function() { return KasperError; });
class KasperError {
    constructor(value, line, col) {
        this.value = value;
        this.line = line;
        this.col = col;
    }
    toString() {
        return this.value.toString();
    }
}


/***/ }),

/***/ "./src/types/expressions.ts":
/*!**********************************!*\
  !*** ./src/types/expressions.ts ***!
  \**********************************/
/*! exports provided: Expr, Assign, Binary, Call, Dictionary, Each, Get, Grouping, Key, Logical, List, Literal, New, NullCoalescing, Postfix, Set, Template, Ternary, Typeof, Unary, Variable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Expr", function() { return Expr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Assign", function() { return Assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Binary", function() { return Binary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Call", function() { return Call; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dictionary", function() { return Dictionary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Each", function() { return Each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Get", function() { return Get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Grouping", function() { return Grouping; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Key", function() { return Key; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logical", function() { return Logical; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Literal", function() { return Literal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "New", function() { return New; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NullCoalescing", function() { return NullCoalescing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Postfix", function() { return Postfix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Set", function() { return Set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Template", function() { return Template; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ternary", function() { return Ternary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Typeof", function() { return Typeof; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Unary", function() { return Unary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Variable", function() { return Variable; });
class Expr {
    // tslint:disable-next-line
    constructor() { }
}
class Assign extends Expr {
    constructor(name, value, line) {
        super();
        this.name = name;
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitAssignExpr(this);
    }
    toString() {
        return 'Expr.Assign';
    }
}
class Binary extends Expr {
    constructor(left, operator, right, line) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
    toString() {
        return 'Expr.Binary';
    }
}
class Call extends Expr {
    constructor(callee, paren, args, line) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
    toString() {
        return 'Expr.Call';
    }
}
class Dictionary extends Expr {
    constructor(properties, line) {
        super();
        this.properties = properties;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitDictionaryExpr(this);
    }
    toString() {
        return 'Expr.Dictionary';
    }
}
class Each extends Expr {
    constructor(name, key, iterable, line) {
        super();
        this.name = name;
        this.key = key;
        this.iterable = iterable;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitEachExpr(this);
    }
    toString() {
        return 'Expr.Each';
    }
}
class Get extends Expr {
    constructor(entity, key, type, line) {
        super();
        this.entity = entity;
        this.key = key;
        this.type = type;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitGetExpr(this);
    }
    toString() {
        return 'Expr.Get';
    }
}
class Grouping extends Expr {
    constructor(expression, line) {
        super();
        this.expression = expression;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
    toString() {
        return 'Expr.Grouping';
    }
}
class Key extends Expr {
    constructor(name, line) {
        super();
        this.name = name;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitKeyExpr(this);
    }
    toString() {
        return 'Expr.Key';
    }
}
class Logical extends Expr {
    constructor(left, operator, right, line) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
    toString() {
        return 'Expr.Logical';
    }
}
class List extends Expr {
    constructor(value, line) {
        super();
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitListExpr(this);
    }
    toString() {
        return 'Expr.List';
    }
}
class Literal extends Expr {
    constructor(value, line) {
        super();
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
    toString() {
        return 'Expr.Literal';
    }
}
class New extends Expr {
    constructor(clazz, line) {
        super();
        this.clazz = clazz;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitNewExpr(this);
    }
    toString() {
        return 'Expr.New';
    }
}
class NullCoalescing extends Expr {
    constructor(left, right, line) {
        super();
        this.left = left;
        this.right = right;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitNullCoalescingExpr(this);
    }
    toString() {
        return 'Expr.NullCoalescing';
    }
}
class Postfix extends Expr {
    constructor(name, increment, line) {
        super();
        this.name = name;
        this.increment = increment;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitPostfixExpr(this);
    }
    toString() {
        return 'Expr.Postfix';
    }
}
class Set extends Expr {
    constructor(entity, key, value, line) {
        super();
        this.entity = entity;
        this.key = key;
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitSetExpr(this);
    }
    toString() {
        return 'Expr.Set';
    }
}
class Template extends Expr {
    constructor(value, line) {
        super();
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitTemplateExpr(this);
    }
    toString() {
        return 'Expr.Template';
    }
}
class Ternary extends Expr {
    constructor(condition, thenExpr, elseExpr, line) {
        super();
        this.condition = condition;
        this.thenExpr = thenExpr;
        this.elseExpr = elseExpr;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitTernaryExpr(this);
    }
    toString() {
        return 'Expr.Ternary';
    }
}
class Typeof extends Expr {
    constructor(value, line) {
        super();
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitTypeofExpr(this);
    }
    toString() {
        return 'Expr.Typeof';
    }
}
class Unary extends Expr {
    constructor(operator, right, line) {
        super();
        this.operator = operator;
        this.right = right;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
    toString() {
        return 'Expr.Unary';
    }
}
class Variable extends Expr {
    constructor(name, line) {
        super();
        this.name = name;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
    toString() {
        return 'Expr.Variable';
    }
}


/***/ }),

/***/ "./src/types/nodes.ts":
/*!****************************!*\
  !*** ./src/types/nodes.ts ***!
  \****************************/
/*! exports provided: KNode, Element, Attribute, Text, Comment, Doctype */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KNode", function() { return KNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Element", function() { return Element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return Attribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Comment", function() { return Comment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Doctype", function() { return Doctype; });
class KNode {
}
class Element extends KNode {
    constructor(name, attributes, children, self, line = 0) {
        super();
        this.type = 'element';
        this.name = name;
        this.attributes = attributes;
        this.children = children;
        this.self = self;
        this.line = line;
    }
    accept(visitor, parent) {
        return visitor.visitElementKNode(this, parent);
    }
    toString() {
        return 'KNode.Element';
    }
}
class Attribute extends KNode {
    constructor(name, value, line = 0) {
        super();
        this.type = 'attribute';
        this.name = name;
        this.value = value;
        this.line = line;
    }
    accept(visitor, parent) {
        return visitor.visitAttributeKNode(this, parent);
    }
    toString() {
        return 'KNode.Attribute';
    }
}
class Text extends KNode {
    constructor(value, line = 0) {
        super();
        this.type = 'text';
        this.value = value;
        this.line = line;
    }
    accept(visitor, parent) {
        return visitor.visitTextKNode(this, parent);
    }
    toString() {
        return 'KNode.Text';
    }
}
class Comment extends KNode {
    constructor(value, line = 0) {
        super();
        this.type = 'comment';
        this.value = value;
        this.line = line;
    }
    accept(visitor, parent) {
        return visitor.visitCommentKNode(this, parent);
    }
    toString() {
        return 'KNode.Comment';
    }
}
class Doctype extends KNode {
    constructor(value, line = 0) {
        super();
        this.type = 'doctype';
        this.value = value;
        this.line = line;
    }
    accept(visitor, parent) {
        return visitor.visitDoctypeKNode(this, parent);
    }
    toString() {
        return 'KNode.Doctype';
    }
}


/***/ }),

/***/ "./src/types/token.ts":
/*!****************************!*\
  !*** ./src/types/token.ts ***!
  \****************************/
/*! exports provided: TokenType, Token, WhiteSpaces, SelfClosingTags */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TokenType", function() { return TokenType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Token", function() { return Token; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhiteSpaces", function() { return WhiteSpaces; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelfClosingTags", function() { return SelfClosingTags; });
var TokenType;
(function (TokenType) {
    // Parser Tokens
    TokenType[TokenType["Eof"] = 0] = "Eof";
    TokenType[TokenType["Panic"] = 1] = "Panic";
    // Single Character Tokens
    TokenType[TokenType["Ampersand"] = 2] = "Ampersand";
    TokenType[TokenType["AtSign"] = 3] = "AtSign";
    TokenType[TokenType["Caret"] = 4] = "Caret";
    TokenType[TokenType["Comma"] = 5] = "Comma";
    TokenType[TokenType["Dollar"] = 6] = "Dollar";
    TokenType[TokenType["Dot"] = 7] = "Dot";
    TokenType[TokenType["Hash"] = 8] = "Hash";
    TokenType[TokenType["LeftBrace"] = 9] = "LeftBrace";
    TokenType[TokenType["LeftBracket"] = 10] = "LeftBracket";
    TokenType[TokenType["LeftParen"] = 11] = "LeftParen";
    TokenType[TokenType["Percent"] = 12] = "Percent";
    TokenType[TokenType["Pipe"] = 13] = "Pipe";
    TokenType[TokenType["RightBrace"] = 14] = "RightBrace";
    TokenType[TokenType["RightBracket"] = 15] = "RightBracket";
    TokenType[TokenType["RightParen"] = 16] = "RightParen";
    TokenType[TokenType["Semicolon"] = 17] = "Semicolon";
    TokenType[TokenType["Slash"] = 18] = "Slash";
    TokenType[TokenType["Star"] = 19] = "Star";
    // One Or Two Character Tokens
    TokenType[TokenType["Arrow"] = 20] = "Arrow";
    TokenType[TokenType["Bang"] = 21] = "Bang";
    TokenType[TokenType["BangEqual"] = 22] = "BangEqual";
    TokenType[TokenType["Colon"] = 23] = "Colon";
    TokenType[TokenType["Equal"] = 24] = "Equal";
    TokenType[TokenType["EqualEqual"] = 25] = "EqualEqual";
    TokenType[TokenType["Greater"] = 26] = "Greater";
    TokenType[TokenType["GreaterEqual"] = 27] = "GreaterEqual";
    TokenType[TokenType["Less"] = 28] = "Less";
    TokenType[TokenType["LessEqual"] = 29] = "LessEqual";
    TokenType[TokenType["Minus"] = 30] = "Minus";
    TokenType[TokenType["MinusEqual"] = 31] = "MinusEqual";
    TokenType[TokenType["MinusMinus"] = 32] = "MinusMinus";
    TokenType[TokenType["PercentEqual"] = 33] = "PercentEqual";
    TokenType[TokenType["Plus"] = 34] = "Plus";
    TokenType[TokenType["PlusEqual"] = 35] = "PlusEqual";
    TokenType[TokenType["PlusPlus"] = 36] = "PlusPlus";
    TokenType[TokenType["Question"] = 37] = "Question";
    TokenType[TokenType["QuestionDot"] = 38] = "QuestionDot";
    TokenType[TokenType["QuestionQuestion"] = 39] = "QuestionQuestion";
    TokenType[TokenType["SlashEqual"] = 40] = "SlashEqual";
    TokenType[TokenType["StarEqual"] = 41] = "StarEqual";
    TokenType[TokenType["DotDot"] = 42] = "DotDot";
    TokenType[TokenType["DotDotDot"] = 43] = "DotDotDot";
    TokenType[TokenType["LessEqualGreater"] = 44] = "LessEqualGreater";
    // Literals
    TokenType[TokenType["Identifier"] = 45] = "Identifier";
    TokenType[TokenType["Template"] = 46] = "Template";
    TokenType[TokenType["String"] = 47] = "String";
    TokenType[TokenType["Number"] = 48] = "Number";
    // Keywords
    TokenType[TokenType["And"] = 49] = "And";
    TokenType[TokenType["Const"] = 50] = "Const";
    TokenType[TokenType["False"] = 51] = "False";
    TokenType[TokenType["Instanceof"] = 52] = "Instanceof";
    TokenType[TokenType["New"] = 53] = "New";
    TokenType[TokenType["Null"] = 54] = "Null";
    TokenType[TokenType["Undefined"] = 55] = "Undefined";
    TokenType[TokenType["Of"] = 56] = "Of";
    TokenType[TokenType["Or"] = 57] = "Or";
    TokenType[TokenType["True"] = 58] = "True";
    TokenType[TokenType["Typeof"] = 59] = "Typeof";
    TokenType[TokenType["With"] = 60] = "With";
})(TokenType || (TokenType = {}));
class Token {
    constructor(type, lexeme, literal, line, col) {
        this.name = TokenType[type];
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
        this.col = col;
    }
    toString() {
        return `[(${this.line}):"${this.lexeme}"]`;
    }
}
const WhiteSpaces = [" ", "\n", "\t", "\r"];
const SelfClosingTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: isDigit, isAlpha, isAlphaNumeric, capitalize, isKeyword */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDigit", function() { return isDigit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAlpha", function() { return isAlpha; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAlphaNumeric", function() { return isAlphaNumeric; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isKeyword", function() { return isKeyword; });
/* harmony import */ var _types_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/token */ "./src/types/token.ts");

function isDigit(char) {
    return char >= "0" && char <= "9";
}
function isAlpha(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}
function isAlphaNumeric(char) {
    return isAlpha(char) || isDigit(char);
}
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}
function isKeyword(word) {
    return _types_token__WEBPACK_IMPORTED_MODULE_0__["TokenType"][word] >= _types_token__WEBPACK_IMPORTED_MODULE_0__["TokenType"].And;
}


/***/ }),

/***/ "./src/viewer.ts":
/*!***********************!*\
  !*** ./src/viewer.ts ***!
  \***********************/
/*! exports provided: Viewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Viewer", function() { return Viewer; });
class Viewer {
    constructor() {
        this.errors = [];
    }
    evaluate(node) {
        return node.accept(this);
    }
    transpile(nodes) {
        this.errors = [];
        const result = [];
        for (const node of nodes) {
            try {
                result.push(this.evaluate(node));
            }
            catch (e) {
                console.error(`${e}`);
                this.errors.push(`${e}`);
                if (this.errors.length > 100) {
                    this.errors.push("Error limit exceeded");
                    return result;
                }
            }
        }
        return result;
    }
    visitElementKNode(node) {
        let attrs = node.attributes.map((attr) => this.evaluate(attr)).join(" ");
        if (attrs.length) {
            attrs = " " + attrs;
        }
        if (node.self) {
            return `<${node.name}${attrs}/>`;
        }
        const children = node.children.map((elm) => this.evaluate(elm)).join("");
        return `<${node.name}${attrs}>${children}</${node.name}>`;
    }
    visitAttributeKNode(node) {
        if (node.value) {
            return `${node.name}="${node.value}"`;
        }
        return node.name;
    }
    visitTextKNode(node) {
        return node.value;
    }
    visitCommentKNode(node) {
        return `<!-- ${node.value} -->`;
    }
    visitDoctypeKNode(node) {
        return `<!doctype ${node.value}>`;
    }
    error(message) {
        throw new Error(`Runtime Error => ${message}`);
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMva2FzcGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2FubmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zY29wZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9kZW1vLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMvZXhwcmVzc2lvbnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3R5cGVzL25vZGVzLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy90b2tlbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBNEM7QUFDQTtBQUNLO0FBRTFDLE1BQU0sZ0JBQWdCO0lBQTdCO1FBSVMsZUFBVSxHQUFHLENBQUMsQ0FBQztJQTZieEIsQ0FBQztJQTNiUSxLQUFLLENBQUMsTUFBZTtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLFdBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDbEIsSUFBSTtnQkFDRixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLFlBQVksd0RBQVcsRUFBRTtvQkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDcEU7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQzt3QkFDL0MsT0FBTyxXQUFXLENBQUM7cUJBQ3BCO2lCQUNGO2dCQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNwQjtTQUNGO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVPLEtBQUssQ0FBQyxHQUFHLEtBQWtCO1FBQ2pDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNmLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVPLE9BQU87UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLElBQUk7UUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTyxRQUFRO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVPLEtBQUssQ0FBQyxJQUFlO1FBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQUVPLEdBQUc7UUFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU8sT0FBTyxDQUFDLElBQWUsRUFBRSxPQUFlO1FBQzlDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN2QjtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FDZixJQUFJLENBQUMsSUFBSSxFQUFFLEVBQ1gsT0FBTyxHQUFHLHVCQUF1QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQ3ZELENBQUM7SUFDSixDQUFDO0lBRU8sS0FBSyxDQUFDLEtBQVksRUFBRSxPQUFlO1FBQ3pDLE1BQU0sSUFBSSx3REFBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU8sV0FBVztRQUNqQixHQUFHO1lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUN2RSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDeEIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxNQUFlO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxPQUFPLENBQ1Ysc0RBQVMsQ0FBQyxLQUFLLEVBQ2YscURBQXFELENBQ3RELENBQUM7UUFFRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUN2QixzREFBUyxDQUFDLFVBQVUsRUFDcEIsZ0RBQWdELENBQ2pELENBQUM7UUFFRixJQUFJLEdBQUcsR0FBVSxJQUFJLENBQUM7UUFDdEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2hCLHNEQUFTLENBQUMsVUFBVSxFQUNwQix1RUFBdUUsQ0FDeEUsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FDVixzREFBUyxDQUFDLEVBQUUsRUFDWixnREFBZ0QsQ0FDakQsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVuQyxPQUFPLElBQUksdURBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVPLFVBQVU7UUFDaEIsTUFBTSxVQUFVLEdBQWMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLHlCQUF5QjtZQUN6QiwyQkFBMkI7WUFDM0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRTtTQUMzQztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxVQUFVO1FBQ2hCLE1BQU0sSUFBSSxHQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QyxJQUNFLElBQUksQ0FBQyxLQUFLLENBQ1Isc0RBQVMsQ0FBQyxLQUFLLEVBQ2Ysc0RBQVMsQ0FBQyxTQUFTLEVBQ25CLHNEQUFTLENBQUMsVUFBVSxFQUNwQixzREFBUyxDQUFDLFNBQVMsRUFDbkIsc0RBQVMsQ0FBQyxVQUFVLENBQ3JCLEVBQ0Q7WUFDQSxNQUFNLFFBQVEsR0FBVSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEMsSUFBSSxLQUFLLEdBQWMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pDLElBQUksSUFBSSxZQUFZLDJEQUFhLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzlCLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxzREFBUyxDQUFDLEtBQUssRUFBRTtvQkFDckMsS0FBSyxHQUFHLElBQUkseURBQVcsQ0FDckIsSUFBSSwyREFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ2xDLFFBQVEsRUFDUixLQUFLLEVBQ0wsUUFBUSxDQUFDLElBQUksQ0FDZCxDQUFDO2lCQUNIO2dCQUNELE9BQU8sSUFBSSx5REFBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNLElBQUksSUFBSSxZQUFZLHNEQUFRLEVBQUU7Z0JBQ25DLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxzREFBUyxDQUFDLEtBQUssRUFBRTtvQkFDckMsS0FBSyxHQUFHLElBQUkseURBQVcsQ0FDckIsSUFBSSxzREFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDekQsUUFBUSxFQUNSLEtBQUssRUFDTCxRQUFRLENBQUMsSUFBSSxDQUNkLENBQUM7aUJBQ0g7Z0JBQ0QsT0FBTyxJQUFJLHNEQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUQ7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sT0FBTztRQUNiLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNsQyxNQUFNLFFBQVEsR0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzREFBUyxDQUFDLEtBQUssRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sUUFBUSxHQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzQyxPQUFPLElBQUksMERBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxjQUFjO1FBQ3BCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQzFDLE1BQU0sU0FBUyxHQUFjLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLElBQUksaUVBQW1CLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxTQUFTO1FBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQy9CLE1BQU0sUUFBUSxHQUFVLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QyxNQUFNLEtBQUssR0FBYyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDM0MsSUFBSSxHQUFHLElBQUksMERBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxVQUFVO1FBQ2hCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQyxNQUFNLFFBQVEsR0FBVSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEMsTUFBTSxLQUFLLEdBQWMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3pDLElBQUksR0FBRyxJQUFJLDBEQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sUUFBUTtRQUNkLElBQUksSUFBSSxHQUFjLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxPQUNFLElBQUksQ0FBQyxLQUFLLENBQ1Isc0RBQVMsQ0FBQyxTQUFTLEVBQ25CLHNEQUFTLENBQUMsVUFBVSxFQUNwQixzREFBUyxDQUFDLE9BQU8sRUFDakIsc0RBQVMsQ0FBQyxZQUFZLEVBQ3RCLHNEQUFTLENBQUMsSUFBSSxFQUNkLHNEQUFTLENBQUMsU0FBUyxDQUNwQixFQUNEO1lBQ0EsTUFBTSxRQUFRLEdBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sS0FBSyxHQUFjLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN6QyxJQUFJLEdBQUcsSUFBSSx5REFBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5RDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLFFBQVE7UUFDZCxJQUFJLElBQUksR0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsS0FBSyxFQUFFLHNEQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEQsTUFBTSxRQUFRLEdBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sS0FBSyxHQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4QyxJQUFJLEdBQUcsSUFBSSx5REFBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5RDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLE9BQU87UUFDYixJQUFJLElBQUksR0FBYyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDNUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDcEMsTUFBTSxRQUFRLEdBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sS0FBSyxHQUFjLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMvQyxJQUFJLEdBQUcsSUFBSSx5REFBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5RDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGNBQWM7UUFDcEIsSUFBSSxJQUFJLEdBQWMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLEtBQUssRUFBRSxzREFBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xELE1BQU0sUUFBUSxHQUFVLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QyxNQUFNLEtBQUssR0FBYyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkMsSUFBSSxHQUFHLElBQUkseURBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxNQUFNO1FBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEMsTUFBTSxRQUFRLEdBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sS0FBSyxHQUFjLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN2QyxPQUFPLElBQUkseURBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLEtBQUs7UUFDWCxJQUNFLElBQUksQ0FBQyxLQUFLLENBQ1Isc0RBQVMsQ0FBQyxLQUFLLEVBQ2Ysc0RBQVMsQ0FBQyxJQUFJLEVBQ2Qsc0RBQVMsQ0FBQyxNQUFNLEVBQ2hCLHNEQUFTLENBQUMsUUFBUSxFQUNsQixzREFBUyxDQUFDLFVBQVUsQ0FDckIsRUFDRDtZQUNBLE1BQU0sUUFBUSxHQUFVLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QyxNQUFNLEtBQUssR0FBYyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEMsT0FBTyxJQUFJLHdEQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkQ7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8sVUFBVTtRQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEMsTUFBTSxTQUFTLEdBQWMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pDLE9BQU8sSUFBSSxzREFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUM7UUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU8sSUFBSTtRQUNWLElBQUksSUFBSSxHQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDcEIsR0FBRztZQUNELFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ25DLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLEdBQUc7b0JBQ0QsTUFBTSxJQUFJLEdBQWdCLEVBQUUsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDckMsR0FBRzs0QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO3lCQUM5QixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtxQkFDdkM7b0JBQ0QsTUFBTSxLQUFLLEdBQVUsSUFBSSxDQUFDLE9BQU8sQ0FDL0Isc0RBQVMsQ0FBQyxVQUFVLEVBQ3BCLDhCQUE4QixDQUMvQixDQUFDO29CQUNGLElBQUksR0FBRyxJQUFJLHVEQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyRCxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTthQUMzQztZQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLEdBQUcsRUFBRSxzREFBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUNwRCxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDckMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQy9DO1NBQ0YsUUFBUSxRQUFRLEVBQUU7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sTUFBTSxDQUFDLElBQWUsRUFBRSxRQUFlO1FBQzdDLE1BQU0sSUFBSSxHQUFVLElBQUksQ0FBQyxPQUFPLENBQzlCLHNEQUFTLENBQUMsVUFBVSxFQUNwQixnQ0FBZ0MsQ0FDakMsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFhLElBQUksc0RBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELE9BQU8sSUFBSSxzREFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVPLFVBQVUsQ0FBQyxJQUFlLEVBQUUsUUFBZTtRQUNqRCxJQUFJLEdBQUcsR0FBYyxJQUFJLENBQUM7UUFFMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN2QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzREFBUyxDQUFDLFlBQVksRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sSUFBSSxzREFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLE9BQU87UUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQixPQUFPLElBQUksMERBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLDBEQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyRDtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSwwREFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckQ7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNuQyxPQUFPLElBQUksMERBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2hFLE9BQU8sSUFBSSwwREFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDbEMsT0FBTyxJQUFJLDJEQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekU7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNwQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2xDLE9BQU8sSUFBSSwwREFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pEO1lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3BDLE9BQU8sSUFBSSwwREFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUQ7WUFDRCxPQUFPLElBQUksMkRBQWEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEdBQWMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsc0RBQVMsQ0FBQyxVQUFVLEVBQUUsK0JBQStCLENBQUMsQ0FBQztZQUNwRSxPQUFPLElBQUksMkRBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDMUI7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNyQyxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNwQjtRQUVELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FDZCxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQ1gsMENBQTBDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FDaEUsQ0FBQztRQUNGLG9CQUFvQjtRQUNwQixPQUFPLElBQUksMERBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVNLFVBQVU7UUFDZixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNEQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDcEMsT0FBTyxJQUFJLDZEQUFlLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0RDtRQUNELE1BQU0sVUFBVSxHQUFnQixFQUFFLENBQUM7UUFDbkMsR0FBRztZQUNELElBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLE1BQU0sRUFBRSxzREFBUyxDQUFDLFVBQVUsRUFBRSxzREFBUyxDQUFDLE1BQU0sQ0FBQyxFQUNwRTtnQkFDQSxNQUFNLEdBQUcsR0FBVSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQ2IsSUFBSSxzREFBUSxDQUFDLElBQUksRUFBRSxJQUFJLHNEQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUNqRSxDQUFDO2lCQUNIO3FCQUFNO29CQUNMLE1BQU0sS0FBSyxHQUFHLElBQUksMkRBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQyxVQUFVLENBQUMsSUFBSSxDQUNiLElBQUksc0RBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxzREFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FDakUsQ0FBQztpQkFDSDthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLENBQ1IsSUFBSSxDQUFDLElBQUksRUFBRSxFQUNYLG9GQUNFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUNkLEVBQUUsQ0FDSCxDQUFDO2FBQ0g7U0FDRixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLHNEQUFTLENBQUMsVUFBVSxFQUFFLG1DQUFtQyxDQUFDLENBQUM7UUFFeEUsT0FBTyxJQUFJLDZEQUFlLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU8sSUFBSTtRQUNWLE1BQU0sTUFBTSxHQUFnQixFQUFFLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXBDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxzREFBUyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3RDLE9BQU8sSUFBSSx1REFBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxHQUFHO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUNoQyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsc0RBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUV0QyxJQUFJLENBQUMsT0FBTyxDQUNWLHNEQUFTLENBQUMsWUFBWSxFQUN0QixzQ0FBc0MsQ0FDdkMsQ0FBQztRQUNGLE9BQU8sSUFBSSx1REFBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7O0FDcmNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTRDO0FBQ1I7QUFDNkI7QUFDakM7QUFDVTtBQUVuQyxNQUFNLFdBQVc7SUFBeEI7UUFDUyxVQUFLLEdBQUcsSUFBSSw0Q0FBSyxFQUFFLENBQUM7UUFDcEIsV0FBTSxHQUFhLEVBQUUsQ0FBQztRQUNyQixZQUFPLEdBQUcsSUFBSSxnREFBTyxFQUFFLENBQUM7UUFDeEIsV0FBTSxHQUFHLElBQUksbUVBQU0sRUFBRSxDQUFDO0lBdVBoQyxDQUFDO0lBclBRLFFBQVEsQ0FBQyxJQUFlO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQWU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBbUI7UUFDMUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxlQUFlLENBQUMsSUFBaUI7UUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sWUFBWSxDQUFDLElBQWM7UUFDaEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRU0sWUFBWSxDQUFDLElBQWM7UUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHNEQUFTLENBQUMsV0FBVyxFQUFFO1lBQ2xELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFjO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDcEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsSUFBa0I7UUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBZTtRQUNsQyxNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7UUFDekIsS0FBSyxNQUFNLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxhQUFhLENBQUMsTUFBYztRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDcEMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDaEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBbUI7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQy9CLHFCQUFxQixFQUNyQixDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUNGLENBQUM7UUFDRixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sZUFBZSxDQUFDLElBQWlCO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDMUIsS0FBSyxzREFBUyxDQUFDLEtBQUssQ0FBQztZQUNyQixLQUFLLHNEQUFTLENBQUMsVUFBVTtnQkFDdkIsT0FBTyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLEtBQUssc0RBQVMsQ0FBQyxLQUFLLENBQUM7WUFDckIsS0FBSyxzREFBUyxDQUFDLFVBQVU7Z0JBQ3ZCLE9BQU8sSUFBSSxHQUFHLEtBQUssQ0FBQztZQUN0QixLQUFLLHNEQUFTLENBQUMsSUFBSSxDQUFDO1lBQ3BCLEtBQUssc0RBQVMsQ0FBQyxTQUFTO2dCQUN0QixPQUFPLElBQUksR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxzREFBUyxDQUFDLE9BQU8sQ0FBQztZQUN2QixLQUFLLHNEQUFTLENBQUMsWUFBWTtnQkFDekIsT0FBTyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLEtBQUssc0RBQVMsQ0FBQyxJQUFJLENBQUM7WUFDcEIsS0FBSyxzREFBUyxDQUFDLFNBQVM7Z0JBQ3RCLE9BQU8sSUFBSSxHQUFHLEtBQUssQ0FBQztZQUN0QixLQUFLLHNEQUFTLENBQUMsSUFBSTtnQkFDakIsT0FBTyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLEtBQUssc0RBQVMsQ0FBQyxLQUFLO2dCQUNsQixPQUFPLElBQUksR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxzREFBUyxDQUFDLE9BQU87Z0JBQ3BCLE9BQU8sSUFBSSxHQUFHLEtBQUssQ0FBQztZQUN0QixLQUFLLHNEQUFTLENBQUMsWUFBWTtnQkFDekIsT0FBTyxJQUFJLElBQUksS0FBSyxDQUFDO1lBQ3ZCLEtBQUssc0RBQVMsQ0FBQyxJQUFJO2dCQUNqQixPQUFPLElBQUksR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxzREFBUyxDQUFDLFNBQVM7Z0JBQ3RCLE9BQU8sSUFBSSxJQUFJLEtBQUssQ0FBQztZQUN2QixLQUFLLHNEQUFTLENBQUMsVUFBVTtnQkFDdkIsT0FBTyxJQUFJLEtBQUssS0FBSyxDQUFDO1lBQ3hCLEtBQUssc0RBQVMsQ0FBQyxTQUFTO2dCQUN0QixPQUFPLElBQUksS0FBSyxLQUFLLENBQUM7WUFDeEI7Z0JBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sSUFBSSxDQUFDLENBQUMsY0FBYztTQUM5QjtJQUNILENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxJQUFrQjtRQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLHNEQUFTLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksSUFBSSxFQUFFO2dCQUNSLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxJQUFrQjtRQUN4QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sdUJBQXVCLENBQUMsSUFBeUI7UUFDdEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxJQUFtQjtRQUMxQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxJQUFrQjtRQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxJQUFnQjtRQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzFCLEtBQUssc0RBQVMsQ0FBQyxLQUFLO2dCQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2hCLEtBQUssc0RBQVMsQ0FBQyxJQUFJO2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2hCLEtBQUssc0RBQVMsQ0FBQyxRQUFRLENBQUM7WUFDeEIsS0FBSyxzREFBUyxDQUFDLFVBQVU7Z0JBQ3ZCLE1BQU0sUUFBUSxHQUNaLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLHNEQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSwyREFBYSxFQUFFO29CQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7aUJBQ2xEO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxzREFBUSxFQUFFO29CQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHNEQUFRLENBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFDZCxJQUFJLDBEQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDckMsSUFBSSxDQUFDLElBQUksQ0FDVixDQUFDO29CQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3ZCO3FCQUFNO29CQUNMLElBQUksQ0FBQyxLQUFLLENBQ1IsNERBQTRELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FDekUsQ0FBQztpQkFDSDtnQkFDRCxPQUFPLFFBQVEsQ0FBQztZQUNsQjtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sSUFBSSxDQUFDLENBQUMsd0JBQXdCO1NBQ3hDO0lBQ0gsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFlO1FBQ2xDLDhCQUE4QjtRQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsOEJBQThCO1FBQzlCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDcEM7UUFDRCxtQkFBbUI7UUFDbkIsT0FBTyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU0sWUFBWSxDQUFDLElBQWM7UUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQWtCLENBQUM7UUFDeEMscUNBQXFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFO1lBQy9CLElBQUksQ0FBQyxLQUFLLENBQ1IsSUFBSSxLQUFLLDhEQUE4RCxDQUN4RSxDQUFDO1NBQ0g7UUFFRCxNQUFNLElBQUksR0FBVSxFQUFFLENBQUM7UUFDdkIsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxtQkFBbUIsQ0FBQyxJQUFxQjtRQUM5QyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUUsUUFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFFLFFBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNuQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGVBQWUsQ0FBQyxJQUFpQjtRQUN0QyxPQUFPLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFlO1FBQ2xDLE9BQU87WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQzdCLENBQUM7SUFDSixDQUFDO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7QUNqUUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFtRDtBQUNJO0FBQ1g7QUFDRjtBQUNVO0FBQ2xCO0FBQ0U7QUFFcEMsU0FBUyxPQUFPLENBQUMsTUFBYztJQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLCtEQUFjLEVBQUUsQ0FBQztJQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDeEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN0QztJQUNELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLE1BQWMsRUFBRSxPQUFnQztJQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLCtEQUFjLEVBQUUsQ0FBQztJQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksc0RBQVUsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtJQUNqQyxDQUFFLE1BQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUc7UUFDL0IsUUFBUSxFQUFFLG9EQUFRO1FBQ2xCLGNBQWMsRUFBRSxzREFBVTtRQUMxQixPQUFPO1FBQ1AsU0FBUztLQUNWLENBQUM7Q0FDSDtLQUFNLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO0lBQ3pDLE9BQU8sQ0FBQyxNQUFNLEdBQUc7UUFDZixxRkFBZ0I7UUFDaEIscUVBQVc7UUFDWCx5REFBTztRQUNQLCtFQUFjO1FBQ2Qsa0VBQVU7UUFDVixzREFBTTtLQUNQLENBQUM7Q0FDSDs7Ozs7Ozs7Ozs7OztBQzFDRDtBQUFBO0FBQUE7QUFBQTtBQUFpQztBQUNnQjtBQUUxQyxNQUFNLE9BQU87SUFnQlgsSUFBSSxDQUFDLE1BQWM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRWIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDMUIsSUFBSTtnQkFDRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDakI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO29CQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUN6QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ3BCO2FBQ0Y7U0FDRjtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksa0RBQUssQ0FBQyxzREFBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVPLEdBQUc7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDNUMsQ0FBQztJQUVPLE9BQU87UUFDYixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRU8sUUFBUSxDQUFDLFNBQW9CLEVBQUUsT0FBWTtRQUNqRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGtEQUFLLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRU8sS0FBSyxDQUFDLFFBQWdCO1FBQzVCLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUNqRCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sSUFBSTtRQUNWLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2QsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTyxRQUFRO1FBQ2QsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUMxQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTyxPQUFPO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDdkUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7U0FDNUQ7YUFBTTtZQUNMLHlCQUF5QjtZQUN6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEI7SUFDSCxDQUFDO0lBRU8sTUFBTSxDQUFDLEtBQWE7UUFDMUIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtRQUVELHVCQUF1QjtRQUN2QixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsMENBQTBDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDOUQsT0FBTztTQUNSO1FBRUQsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVmLCtCQUErQjtRQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsc0RBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHNEQUFTLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFTyxNQUFNO1FBQ1osb0JBQW9CO1FBQ3BCLE9BQU8sOENBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEI7UUFFRCxzQkFBc0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxJQUFJLDhDQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7WUFDekQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO1FBRUQscUJBQXFCO1FBQ3JCLE9BQU8sOENBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEI7UUFFRCxzQkFBc0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNmLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO2dCQUM5QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDaEI7U0FDRjtRQUVELE9BQU8sOENBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEI7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsUUFBUSxDQUFDLHNEQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTyxVQUFVO1FBQ2hCLE9BQU8scURBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUQsTUFBTSxXQUFXLEdBQUcsaURBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxnREFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsc0RBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxzREFBUyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7SUFFTyxRQUFRO1FBQ2QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVCLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsc0RBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxzREFBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLHNEQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQyxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsc0RBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxzREFBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekMsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLHNEQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsc0RBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxzREFBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekMsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLHNEQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsc0RBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxzREFBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDcEMsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxzREFBUyxDQUFDLEtBQUssRUFDbkQsSUFBSSxDQUNMLENBQUM7Z0JBQ0YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzREFBUyxDQUFDLElBQUksRUFDdEQsSUFBSSxDQUNMLENBQUM7Z0JBQ0YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxzREFBUyxDQUFDLE9BQU8sRUFDNUQsSUFBSSxDQUNMLENBQUM7Z0JBQ0YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxzREFBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDckUsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxzREFBUyxDQUFDLFNBQVMsRUFDckQsSUFBSSxDQUNMLENBQUM7Z0JBQ0YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNE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QUFHLEtBQUssQ0FBQztTQUNyQjtRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDO1NBQ2xDO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekUsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7SUFDNUQsQ0FBQztJQUVNLG1CQUFtQixDQUFDLElBQXFCO1FBQzlDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztTQUN2QztRQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRU0sY0FBYyxDQUFDLElBQWdCO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBbUI7UUFDMUMsT0FBTyxRQUFRLElBQUksQ0FBQyxLQUFLLE1BQU0sQ0FBQztJQUNsQyxDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBbUI7UUFDMUMsT0FBTyxhQUFhLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUNwQyxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQWU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0YiLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMva2FzcGVyLnRzXCIpO1xuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xyXG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XHJcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xyXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xyXG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xyXG4gIHB1YmxpYyBlcnJvckxldmVsID0gMTtcclxuXHJcbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcclxuICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBLYXNwZXJFcnJvcikge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgUGFyc2UgRXJyb3IgKCR7ZS5saW5lfToke2UuY29sfSkgPT4gJHtlLnZhbHVlfWApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25zO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN5bmNocm9uaXplKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBleHByZXNzaW9ucztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcclxuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcclxuICAgIGlmICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcclxuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XHJcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXHJcbiAgICAgIHRoaXMucGVlaygpLFxyXG4gICAgICBtZXNzYWdlICsgYCwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IodG9rZW46IFRva2VuLCBtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xyXG4gICAgZG8ge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XHJcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG5cclxuICAgIHRoaXMuY29uc3VtZShcclxuICAgICAgVG9rZW5UeXBlLkNvbnN0LFxyXG4gICAgICBgRXhwZWN0ZWQgY29uc3QgZGVmaW5pdGlvbiBzdGFydGluZyBcImVhY2hcIiBzdGF0ZW1lbnRgXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXHJcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxyXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcclxuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxyXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxyXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29uc3VtZShcclxuICAgICAgVG9rZW5UeXBlLk9mLFxyXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xyXG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xyXG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXHJcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge31cclxuICAgIH1cclxuICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XHJcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcclxuICAgIGlmIChcclxuICAgICAgdGhpcy5tYXRjaChcclxuICAgICAgICBUb2tlblR5cGUuRXF1YWwsXHJcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuU3RhckVxdWFsLFxyXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XHJcbiAgICAgIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xyXG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xyXG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcclxuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxyXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxyXG4gICAgICAgICAgICBvcGVyYXRvcixcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XHJcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xyXG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXHJcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcclxuICAgICAgICAgICAgb3BlcmF0b3IsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5lcnJvcihvcGVyYXRvciwgYEludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xyXG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcclxuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xyXG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcclxuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcclxuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XHJcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xyXG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcclxuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XHJcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xyXG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XHJcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xyXG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XHJcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XHJcbiAgICB3aGlsZSAoXHJcbiAgICAgIHRoaXMubWF0Y2goXHJcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcclxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlckVxdWFsLFxyXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxyXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWxcclxuICAgICAgKVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcclxuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcclxuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XHJcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XHJcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXMsIFRva2VuVHlwZS5QbHVzKSkge1xyXG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcclxuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XHJcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xyXG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbXVsdGlwbGljYXRpb24oKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xyXG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcclxuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcclxuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLm1hdGNoKFxyXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcclxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcclxuICAgICAgICBUb2tlblR5cGUuRG9sbGFyLFxyXG4gICAgICAgIFRva2VuVHlwZS5QbHVzUGx1cyxcclxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy51bmFyeSgpO1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm5ld0tleXdvcmQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbmV3S2V5d29yZCgpOiBFeHByLkV4cHIge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk5ldykpIHtcclxuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcclxuICAgICAgY29uc3QgY29uc3RydWN0OiBFeHByLkV4cHIgPSB0aGlzLmNhbGwoKTtcclxuICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QsIGtleXdvcmQubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5jYWxsKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGwoKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcclxuICAgIGxldCBjb25zdW1lZCA9IHRydWU7XHJcbiAgICBkbyB7XHJcbiAgICAgIGNvbnN1bWVkID0gZmFsc2U7XHJcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XHJcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XHJcbiAgICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgcGFyZW46IFRva2VuID0gdGhpcy5jb25zdW1lKFxyXG4gICAgICAgICAgICBUb2tlblR5cGUuUmlnaHRQYXJlbixcclxuICAgICAgICAgICAgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGFyZ3VtZW50c2BcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBleHByID0gbmV3IEV4cHIuQ2FsbChleHByLCBwYXJlbiwgYXJncywgcGFyZW4ubGluZSk7XHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xyXG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcclxuICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XHJcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xyXG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcclxuICAgICAgfVxyXG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XHJcbiAgICBjb25zdCBuYW1lOiBUb2tlbiA9IHRoaXMuY29uc3VtZShcclxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXHJcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXHJcbiAgICApO1xyXG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xyXG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xyXG4gICAgbGV0IGtleTogRXhwci5FeHByID0gbnVsbDtcclxuXHJcbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcclxuICAgICAga2V5ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhbiBpbmRleGApO1xyXG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKGZhbHNlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodHJ1ZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHVuZGVmaW5lZCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVtcGxhdGUodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xyXG4gICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoaWRlbnRpZmllciwgMSwgaWRlbnRpZmllci5saW5lKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChpZGVudGlmaWVyLCAtMSwgaWRlbnRpZmllci5saW5lKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XHJcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByLCBleHByLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5saXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcclxuICAgICAgdGhpcy5wZWVrKCksXHJcbiAgICAgIGBFeHBlY3RlZCBleHByZXNzaW9uLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXHJcbiAgICApO1xyXG4gICAgLy8gdW5yZWFjaGVhYmxlIGNvZGVcclxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcclxuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvcGVydGllczogRXhwci5FeHByW10gPSBbXTtcclxuICAgIGRvIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZywgVG9rZW5UeXBlLklkZW50aWZpZXIsIFRva2VuVHlwZS5OdW1iZXIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbG9uKSkge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcclxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgRXhwci5WYXJpYWJsZShrZXksIGtleS5saW5lKTtcclxuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcclxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lcnJvcihcclxuICAgICAgICAgIHRoaXMucGVlaygpLFxyXG4gICAgICAgICAgYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7XHJcbiAgICAgICAgICAgIHRoaXMucGVlaygpLmxleGVtZVxyXG4gICAgICAgICAgfWBcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xyXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcclxuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcclxuICAgIGNvbnN0IGxlZnRCcmFja2V0ID0gdGhpcy5wcmV2aW91cygpO1xyXG5cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXN0KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XHJcbiAgICB9XHJcbiAgICBkbyB7XHJcbiAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcclxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XHJcblxyXG4gICAgdGhpcy5jb25zdW1lKFxyXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxyXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKTtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgaWYgKHRoaXMucGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFRlbXBsYXRlIHN0cmluZyAgZXJyb3I6ICR7dGhpcy5wYXJzZXIuZXJyb3JzWzBdfWApO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogRXhwci5UZW1wbGF0ZSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwci52YWx1ZS5yZXBsYWNlKFxuICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGFyc2UocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEJpbmFyeUV4cHIoZXhwcjogRXhwci5CaW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2hFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50OlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAlIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBpcGU6XG4gICAgICAgIHJldHVybiBsZWZ0IHwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DYXJldDpcbiAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXI6XG4gICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzczpcbiAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3NFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvciBcIiArIGV4cHIub3BlcmF0b3IpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKS5pc1RydXRoeSgpXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmICghbGVmdCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOlxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgTnVtYmVyKHJpZ2h0KSArIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5QbHVzUGx1cyA/IDEgOiAtMSk7XG4gICAgICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucmlnaHQubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgICAgICBleHByLnJpZ2h0LmVudGl0eSxcbiAgICAgICAgICAgIGV4cHIucmlnaHQua2V5LFxuICAgICAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgICBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAgJHtleHByLnJpZ2h0fWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoYFVua25vd24gdW5hcnkgb3BlcmF0b3IgJyArIGV4cHIub3BlcmF0b3JgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENhbGxFeHByKGV4cHI6IEV4cHIuQ2FsbCk6IGFueSB7XG4gICAgLy8gdmVyaWZ5IGNhbGxlZSBpcyBhIGZ1bmN0aW9uXG4gICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgaWYgKHR5cGVvZiBjYWxsZWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihgJHtjYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgfVxuICAgIC8vIGV2YWx1YXRlIGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIGV4cHIuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJndW1lbnQpKTtcbiAgICB9XG4gICAgLy8gZXhlY3V0ZSBmdW5jdGlvblxuICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXROZXdFeHByKGV4cHI6IEV4cHIuTmV3KTogYW55IHtcbiAgICBjb25zdCBuZXdDYWxsID0gZXhwci5jbGF6eiBhcyBFeHByLkNhbGw7XG4gICAgLy8gaW50ZXJuYWwgY2xhc3MgZGVmaW5pdGlvbiBpbnN0YW5jZVxuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShuZXdDYWxsLmNhbGxlZSk7XG5cbiAgICBpZiAodHlwZW9mIGNsYXp6ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgIGAnJHtjbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgbmV3Q2FsbC5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdCA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgZXhwci5wcm9wZXJ0aWVzKSB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkua2V5KTtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLnZhbHVlKTtcbiAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gZGljdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFR5cGVvZkV4cHIoZXhwcjogRXhwci5UeXBlb2YpOiBhbnkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVhY2hFeHByKGV4cHI6IEV4cHIuRWFjaCk6IGFueSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGV4cHIubmFtZS5sZXhlbWUsXG4gICAgICBleHByLmtleSA/IGV4cHIua2V5LmxleGVtZSA6IG51bGwsXG4gICAgICB0aGlzLmV2YWx1YXRlKGV4cHIuaXRlcmFibGUpLFxuICAgIF07XG4gIH1cbn1cbiIsImltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBEZW1vSnNvbiwgRGVtb1NvdXJjZSB9IGZyb20gXCIuL3R5cGVzL2RlbW9cIjtcbmltcG9ydCB7IFZpZXdlciB9IGZyb20gXCIuL3ZpZXdlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcblxuZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBpZiAocGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFyc2VyLmVycm9ycyk7XG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB0cmFuc3BpbGUoc291cmNlOiBzdHJpbmcsIGVudHJpZXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogTm9kZSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoKTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudHJpZXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAoKHdpbmRvdyBhcyBhbnkpIHx8IHt9KS5rYXNwZXIgPSB7XG4gICAgZGVtb0pzb246IERlbW9Kc29uLFxuICAgIGRlbW9Tb3VyY2VDb2RlOiBEZW1vU291cmNlLFxuICAgIGV4ZWN1dGUsXG4gICAgdHJhbnNwaWxlLFxuICB9O1xufSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBleHBvcnRzLmthc3BlciA9IHtcbiAgICBFeHByZXNzaW9uUGFyc2VyLFxuICAgIEludGVycHJldGVyLFxuICAgIFNjYW5uZXIsXG4gICAgVGVtcGxhdGVQYXJzZXIsXG4gICAgVHJhbnNwaWxlcixcbiAgICBWaWV3ZXIsXG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcclxuICAvKiogc2NyaXB0cyBzb3VyY2UgY29kZSAqL1xyXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcclxuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXHJcbiAgcHVibGljIHRva2VuczogVG9rZW5bXTtcclxuICAvKiogTGlzdCBvZiBlcnJvcnMgZnJvbSBzY2FubmluZyAqL1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xyXG4gIC8qKiBwb2ludHMgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xyXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xyXG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cclxuICBwcml2YXRlIHN0YXJ0OiBudW1iZXI7XHJcbiAgLyoqIGN1cnJlbnQgbGluZSBvZiBzb3VyY2UgY29kZSBiZWluZyB0b2tlbml6ZWQgKi9cclxuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcclxuICAvKiogY3VycmVudCBjb2x1bW4gb2YgdGhlIGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cclxuICBwcml2YXRlIGNvbDogbnVtYmVyO1xyXG5cclxuICBwdWJsaWMgc2Nhbihzb3VyY2U6IHN0cmluZyk6IFRva2VuW10ge1xyXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB0aGlzLnRva2VucyA9IFtdO1xyXG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB0aGlzLnN0YXJ0ID0gMDtcclxuICAgIHRoaXMubGluZSA9IDE7XHJcbiAgICB0aGlzLmNvbCA9IDE7XHJcblxyXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xyXG4gICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAxMDApIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnRva2VucztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xyXG4gICAgcmV0dXJuIHRoaXMudG9rZW5zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XHJcbiAgICAgIHRoaXMubGluZSsrO1xyXG4gICAgICB0aGlzLmNvbCA9IDA7XHJcbiAgICB9XHJcbiAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIHRoaXMuY29sKys7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XHJcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XHJcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KSAhPT0gZXhwZWN0ZWQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3VycmVudCsrO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLmVvZigpKSB7XHJcbiAgICAgIHJldHVybiBcIlxcMFwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwZWVrTmV4dCgpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBcIlxcMFwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcclxuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VudGVybWluYXRlZCBjb21tZW50LCBleHBlY3RpbmcgY2xvc2luZyBcIiovXCInKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBxdW90ZSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVbnRlcm1pbmF0ZWQgc3RyaW5nLlxyXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy5lcnJvcihgVW50ZXJtaW5hdGVkIHN0cmluZywgZXhwZWN0aW5nIGNsb3NpbmcgJHtxdW90ZX1gKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxyXG4gICAgdGhpcy5hZHZhbmNlKCk7XHJcblxyXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xyXG4gICAgdGhpcy5hZGRUb2tlbihxdW90ZSAhPT0gXCJgXCIgPyBUb2tlblR5cGUuU3RyaW5nIDogVG9rZW5UeXBlLlRlbXBsYXRlLCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG51bWJlcigpOiB2b2lkIHtcclxuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XHJcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2hlY2tzIGZvciBmcmFjdGlvblxyXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XHJcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxyXG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XHJcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xyXG4gICAgd2hpbGUgKFV0aWxzLmlzQWxwaGFOdW1lcmljKHRoaXMucGVlaygpKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xyXG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKTtcclxuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XHJcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlW2NhcGl0YWxpemVkXSwgdmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRUb2tlbigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcclxuICAgIHN3aXRjaCAoY2hhcikge1xyXG4gICAgICBjYXNlIFwiKFwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIpXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiXVwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJ7XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIn1cIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIixcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCI7XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIl5cIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIkXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG9sbGFyLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIiNcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIjpcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIipcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIiVcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInxcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDogVG9rZW5UeXBlLlBpcGUsIG51bGwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiJlwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCI+XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcclxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIhXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcclxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbCA6IFRva2VuVHlwZS5CYW5nLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCI/XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcclxuICAgICAgICAgIHRoaXMubWF0Y2goXCI/XCIpXHJcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cclxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvbkRvdFxyXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcclxuICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiPVwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5FcXVhbEVxdWFsXHJcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj5cIilcclxuICAgICAgICAgICAgPyBUb2tlblR5cGUuQXJyb3dcclxuICAgICAgICAgICAgOiBUb2tlblR5cGUuRXF1YWwsXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIitcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcclxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcclxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcclxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcclxuICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXHJcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcclxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxyXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcclxuICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxyXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXHJcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxyXG4gICAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3NFcXVhbFxyXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIuXCI6XHJcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiL1wiOlxyXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xyXG4gICAgICAgICAgdGhpcy5jb21tZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xyXG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXHJcbiAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGAnYDpcclxuICAgICAgY2FzZSBgXCJgOlxyXG4gICAgICBjYXNlIFwiYFwiOlxyXG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAvLyBpZ25vcmUgY2FzZXNcclxuICAgICAgY2FzZSBcIlxcblwiOlxyXG4gICAgICBjYXNlIFwiIFwiOlxyXG4gICAgICBjYXNlIFwiXFxyXCI6XHJcbiAgICAgIGNhc2UgXCJcXHRcIjpcclxuICAgICAgICBicmVhaztcclxuICAgICAgLy8gY29tcGxleCBjYXNlc1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XHJcbiAgICAgICAgICB0aGlzLm51bWJlcigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xyXG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2NoYXJ9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYW4gRXJyb3IgKCR7dGhpcy5saW5lfToke3RoaXMuY29sfSkgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50cmllcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy5pbml0KGVudHJpZXMpO1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50cmllcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcbiAgICBpZiAoZW50cmllcykge1xuICAgICAgdGhpcy52YWx1ZXMgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGVudHJpZXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlcy5zZXQobmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHRoaXMudmFsdWVzLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXMuZ2V0KGtleSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5XTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXTtcbiAgcHVibGljIG5vZGVzOiBOb2RlLktOb2RlW107XG5cbiAgcHVibGljIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgUGFyc2UgRXJyb3IgKCR7ZS5saW5lfToke2UuY29sfSkgPT4gJHtlLnZhbHVlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29sICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHtlb2ZFcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZyhcIidcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoJ1wiJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPFwiKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlLlRleHQodGV4dCwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcclxuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xyXG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xyXG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XHJcbmltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XHJcblxyXG50eXBlIElmRWxzZU5vZGUgPSBbS05vZGUuRWxlbWVudCwgS05vZGUuQXR0cmlidXRlXTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcclxuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xyXG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcclxuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XHJcbiAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xyXG4gICAgbm9kZS5hY2NlcHQodGhpcywgcGFyZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IGFueVtdIHtcclxuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XHJcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XHJcbiAgICByZXR1cm4gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxyXG4gICAgICB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zcGlsZShcclxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxyXG4gICAgZW50cmllcz86IHsgW2tleTogc3RyaW5nXTogYW55IH1cclxuICApOiBOb2RlIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJrYXNwZXJcIik7XHJcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLmluaXQoZW50cmllcyk7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgY29udGFpbmVyKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XHJcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XHJcbiAgICBjb25zdCByZWdleCA9IC9cXHtcXHsuK1xcfVxcfS87XHJcbiAgICBsZXQgdGV4dDogVGV4dDtcclxuICAgIGlmIChyZWdleC50ZXN0KG5vZGUudmFsdWUpKSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG5vZGUudmFsdWUucmVwbGFjZShcclxuICAgICAgICAvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csXHJcbiAgICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXN1bHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5vZGUudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmVudCkge1xyXG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcclxuICAgIGNvbnN0IGF0dHIgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobm9kZS5uYW1lKTtcclxuICAgIGlmIChub2RlLnZhbHVlKSB7XHJcbiAgICAgIGF0dHIudmFsdWUgPSBub2RlLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tbWVudChub2RlLnZhbHVlKTtcclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZpbmRBdHRyKFxyXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcclxuICAgIC4uLm5hbWU6IHN0cmluZ1tdXHJcbiAgKTogS05vZGUuQXR0cmlidXRlIHwgbnVsbCB7XHJcbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cclxuICAgICAgbmFtZS5pbmNsdWRlcygoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUpXHJcbiAgICApO1xyXG4gICAgaWYgKGF0dHJpYikge1xyXG4gICAgICByZXR1cm4gYXR0cmliIGFzIEtOb2RlLkF0dHJpYnV0ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xyXG4gICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcclxuICAgIGlmICgkaWYgJiYgJGlmLmxlbmd0aCAmJiAkaWZbMF0pIHtcclxuICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25zWzBdWzBdLCBwYXJlbnQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEsIGV4cHJlc3Npb25zLmxlbmd0aCkpIHtcclxuICAgICAgaWYgKCh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCksIFwiQGVsc2VpZlwiKSkge1xyXG4gICAgICAgIGNvbnN0ICRlbHNlaWYgPSB0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKCRlbHNlaWYgJiYgJGVsc2VpZi5sZW5ndGggJiYgJGVsc2VpZlswXSkge1xyXG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIHBhcmVudCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50KSwgXCJAZWxzZVwiKSkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBwYXJlbnQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb0VhY2goZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcclxuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKChlYWNoIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xyXG4gICAgY29uc3QgW25hbWUsIGtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcclxuICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXHJcbiAgICApO1xyXG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XHJcbiAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XHJcbiAgICAgIGNvbnN0IHNjb3BlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0geyBbbmFtZV06IGl0ZW0gfTtcclxuICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgIHNjb3BlW2tleV0gPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlKTtcclxuICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XHJcbiAgICAgIGluZGV4ICs9IDE7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZG9Jbml0KGluaXQ6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XHJcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcclxuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSk7XHJcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XHJcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcclxuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVTaWJsaW5ncyhub2RlczogS05vZGUuS05vZGVbXSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xyXG4gICAgbGV0IGN1cnJlbnQgPSAwO1xyXG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcclxuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XHJcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XHJcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgXCJAZWFjaFwiKTtcclxuICAgICAgICBpZiAoJGVhY2gpIHtcclxuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBcIkBpZlwiKTtcclxuICAgICAgICBpZiAoJGlmKSB7XHJcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tub2RlIGFzIEtOb2RlLkVsZW1lbnQsICRpZl1dO1xyXG4gICAgICAgICAgY29uc3QgdGFnID0gKG5vZGUgYXMgS05vZGUuRWxlbWVudCkubmFtZTtcclxuICAgICAgICAgIGxldCBmb3VuZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgd2hpbGUgKGZvdW5kKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50ID49IG5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKFxyXG4gICAgICAgICAgICAgIG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxyXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICgobm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCkubmFtZSA9PT0gdGFnICYmIGF0dHIpIHtcclxuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKFtub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBhdHRyXSk7XHJcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0ICRpbml0ID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFwiQGluaXRcIik7XHJcbiAgICAgICAgaWYgKCRpbml0KSB7XHJcbiAgICAgICAgICB0aGlzLmRvSW5pdCgkaW5pdCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQpO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudChub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xyXG5cclxuICAgIC8vIGV2ZW50IGJpbmRpbmdcclxuICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XHJcbiAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxyXG4gICAgKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xyXG4gICAgICB0aGlzLmNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQgYXMgS05vZGUuQXR0cmlidXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhdHRyaWJ1dGVzXHJcbiAgICBub2RlLmF0dHJpYnV0ZXNcclxuICAgICAgLmZpbHRlcigoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKSlcclxuICAgICAgLm1hcCgoYXR0cikgPT4gdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KSk7XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlLmNoaWxkcmVuLCBlbGVtZW50KTtcclxuXHJcbiAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBOb2RlLCBhdHRyOiBLTm9kZS5BdHRyaWJ1dGUpOiB2b2lkIHtcclxuICAgIGNvbnN0IHR5cGUgPSBhdHRyLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsICgpID0+IHtcclxuICAgICAgdGhpcy5leGVjdXRlKGF0dHIudmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRlbXBsYXRlUGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcclxuXHJcbiAgICBpZiAodGhpcy5wYXJzZXIuZXJyb3JzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmVycm9yKGBUZW1wbGF0ZSBzdHJpbmcgIGVycm9yOiAke3RoaXMucGFyc2VyLmVycm9yc1swXX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcclxuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xyXG4gICAgICByZXN1bHQgKz0gYCR7dGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKX1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XHJcbiAgICByZXR1cm47XHJcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjb25zdCBEZW1vU291cmNlID0gYFxuPGRpdiBpZD1cInRvcFwiIHJvbGU9XCJkb2N1bWVudFwiPlxuICA8aGVhZGVyPlxuICAgIDxoMz57e3BlcnNvbi5uYW1lfX08L2gzPlxuICAgIDxoND57e3BlcnNvbi5wcm9mZXNzaW9ufX08L2g0PlxuICAgIDxwIEBpZj1cInBlcnNvbi5hZ2UgPiAyMVwiPkFnZSBpcyBncmVhdGVyIHRoYW4gMjE8L3A+XG4gICAgPHAgQGVsc2VpZj1cInBlcnNvbi5hZ2UgPT0gMjFcIj5BZ2UgaXMgZXF1YWwgdG8gMjE8L3A+XG4gICAgPHAgQGVsc2VpZj1cInBlcnNvbi5hZ2UgPCAyMVwiPkFnZSBpcyBsZXNzIHRoYW4gMjE8L3A+XG4gICAgPHAgQGVsc2U+QWdlIGlzIGltcG9zc2libGU8L3A+XG4gIDwvaGVhZGVyPlxuICA8aDQ+SG9iYmllcyAoe3twZXJzb24uaG9iYmllcy5sZW5ndGh9fSk6PC9oND5cbiAgPHVsPlxuICAgIDxsaSBAZWFjaD1cImNvbnN0IGhvYmJ5IHdpdGggaW5kZXggb2YgcGVyc29uLmhvYmJpZXNcIiBjbGFzcz1cInRleHQtcmVkXCI+XG4gICAgICB7e2luZGV4ICsgMX19OiB7e2hvYmJ5fX1cbiAgICA8L2xpPlxuICA8L3VsPlxuICA8ZGl2PlxuICAgIDEwMCArIDIwIC8gKDEwICogKDEwIC0yMCkgKyA0KSA9XG4gICAge3sxMDAgKyAyMCAvICgxMCAqICgxMCAtMjApICsgNCl9fVxuICA8L2Rpdj5cbiAgPGRpdiBAaW5pdD1cInN0dWRlbnQgPSB7bmFtZTogcGVyc29uLm5hbWUsIGRlZ3JlZTogJ01hc3RlcnMnfTsgY29uc29sZS5sb2coc3R1ZGVudC5uYW1lKVwiPlxuICAgICB7e3N0dWRlbnQubmFtZX19XG4gIDwvZGl2PlxuICA8ZGl2ICBjbGFzcz1cInNkZi12LW1hcmdpblwiPlxuICAgIDxidXR0b25cbiAgICAgIEBvbjpjbGljaz1cImFsZXJ0KCdIZWxsbyBXb3JsZCcpOyBjb25zb2xlLmxvZygxMDAgLyAyLjUgKyAxNSlcIlxuICAgID5cbiAgICAgIENMSUNLIE1FXG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5leHBvcnQgY29uc3QgRGVtb0pzb24gPSBgXG57XG4gIFwicGVyc29uXCI6IHtcbiAgICBcIm5hbWVcIjogXCJKb2huIERvZVwiLFxuICAgIFwicHJvZmVzc2lvblwiOiBcIlNvZnR3YXJlIERldmVsb3BlclwiLFxuICAgIFwiYWdlXCI6IDIwLFxuICAgIFwiaG9iYmllc1wiOiBbXCJyZWFkaW5nXCIsIFwibXVzaWNcIiwgXCJnb2xmXCJdXG4gIH1cbn1cbmA7XG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3Ige1xuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEFzc2lnbik6IFI7XG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEJpbmFyeSk6IFI7XG4gICAgdmlzaXRDYWxsRXhwcihleHByOiBDYWxsKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFzc2lnbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Bc3NpZ24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQmluYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjYWxsZWU6IEV4cHI7XG4gICAgcHVibGljIHBhcmVuOiBUb2tlbjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FsbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5DYWxsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGF6ejogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xhenogPSBjbGF6ejtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZXdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTmV3JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbENvYWxlc2NpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsQ29hbGVzY2luZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OdWxsQ29hbGVzY2luZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RmaXggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGluY3JlbWVudDogbnVtYmVyLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UG9zdGZpeEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Qb3N0Zml4JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgS05vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS05vZGVWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEVsZW1lbnRLTm9kZShrbm9kZTogRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVLTm9kZShrbm9kZTogQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdFRleHRLTm9kZShrbm9kZTogVGV4dCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRDb21tZW50S05vZGUoa25vZGU6IENvbW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0RG9jdHlwZUtOb2RlKGtub2RlOiBEb2N0eXBlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogS05vZGVbXTtcbiAgICBwdWJsaWMgY2hpbGRyZW46IEtOb2RlW107XG4gICAgcHVibGljIHNlbGY6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IEtOb2RlW10sIGNoaWxkcmVuOiBLTm9kZVtdLCBzZWxmOiBib29sZWFuLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLnNlbGYgPSBzZWxmO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2RvY3R5cGUnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgLy8gUGFyc2VyIFRva2Vuc1xyXG4gIEVvZixcclxuICBQYW5pYyxcclxuXHJcbiAgLy8gU2luZ2xlIENoYXJhY3RlciBUb2tlbnNcclxuICBBbXBlcnNhbmQsXHJcbiAgQXRTaWduLFxyXG4gIENhcmV0LFxyXG4gIENvbW1hLFxyXG4gIERvbGxhcixcclxuICBEb3QsXHJcbiAgSGFzaCxcclxuICBMZWZ0QnJhY2UsXHJcbiAgTGVmdEJyYWNrZXQsXHJcbiAgTGVmdFBhcmVuLFxyXG4gIFBlcmNlbnQsXHJcbiAgUGlwZSxcclxuICBSaWdodEJyYWNlLFxyXG4gIFJpZ2h0QnJhY2tldCxcclxuICBSaWdodFBhcmVuLFxyXG4gIFNlbWljb2xvbixcclxuICBTbGFzaCxcclxuICBTdGFyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnNcclxuICBBcnJvdyxcclxuICBCYW5nLFxyXG4gIEJhbmdFcXVhbCxcclxuICBDb2xvbixcclxuICBFcXVhbCxcclxuICBFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBGYWxzZSxcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBXaXRoLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcclxuICBwdWJsaWMgbGl0ZXJhbDogYW55O1xyXG4gIHB1YmxpYyBsZXhlbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0eXBlOiBUb2tlblR5cGUsXHJcbiAgICBsZXhlbWU6IHN0cmluZyxcclxuICAgIGxpdGVyYWw6IGFueSxcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBUb2tlblR5cGVbdHlwZV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XHJcbiAgICB0aGlzLmxpdGVyYWwgPSBsaXRlcmFsO1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBbKCR7dGhpcy5saW5lfSk6XCIke3RoaXMubGV4ZW1lfVwiXWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlbGZDbG9zaW5nVGFncyA9IFtcclxuICBcImFyZWFcIixcclxuICBcImJhc2VcIixcclxuICBcImJyXCIsXHJcbiAgXCJjb2xcIixcclxuICBcImVtYmVkXCIsXHJcbiAgXCJoclwiLFxyXG4gIFwiaW1nXCIsXHJcbiAgXCJpbnB1dFwiLFxyXG4gIFwibGlua1wiLFxyXG4gIFwibWV0YVwiLFxyXG4gIFwicGFyYW1cIixcclxuICBcInNvdXJjZVwiLFxyXG4gIFwidHJhY2tcIixcclxuICBcIndiclwiLFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoY2hhciA+PSBcImFcIiAmJiBjaGFyIDw9IFwielwiKSB8fCAoY2hhciA+PSBcIkFcIiAmJiBjaGFyIDw9IFwiWlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBUb2tlblR5cGVbd29yZF0gPj0gVG9rZW5UeXBlLkFuZDtcbn1cbiIsImltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld2VyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHN0cmluZz4ge1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUuYWNjZXB0KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zcGlsZShub2RlczogS05vZGUuS05vZGVbXSk6IHN0cmluZ1tdIHtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZXZhbHVhdGUobm9kZSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcy5tYXAoKGF0dHIpID0+IHRoaXMuZXZhbHVhdGUoYXR0cikpLmpvaW4oXCIgXCIpO1xyXG4gICAgaWYgKGF0dHJzLmxlbmd0aCkge1xyXG4gICAgICBhdHRycyA9IFwiIFwiICsgYXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfS8+YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSkuam9pbihcIlwiKTtcclxuICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9PiR7Y2hpbGRyZW59PC8ke25vZGUubmFtZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSk6IHN0cmluZyB7XHJcbiAgICBpZiAobm9kZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gYCR7bm9kZS5uYW1lfT1cIiR7bm9kZS52YWx1ZX1cImA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5uYW1lO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUudmFsdWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhLS0gJHtub2RlLnZhbHVlfSAtLT5gO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0RG9jdHlwZUtOb2RlKG5vZGU6IEtOb2RlLkRvY3R5cGUpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGA8IWRvY3R5cGUgJHtub2RlLnZhbHVlfT5gO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBSdW50aW1lIEVycm9yID0+ICR7bWVzc2FnZX1gKTtcclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==