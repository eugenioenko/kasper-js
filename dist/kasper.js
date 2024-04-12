/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/expression-parser.ts":
/*!**********************************!*\
  !*** ./src/expression-parser.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExpressionParser: () => (/* binding */ ExpressionParser)
/* harmony export */ });
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
                if (e instanceof _types_error__WEBPACK_IMPORTED_MODULE_0__.KasperError) {
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
        return this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Eof);
    }
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        return this.error(this.peek(), message + `, unexpected token "${this.peek().lexeme}"`);
    }
    error(token, message) {
        throw new _types_error__WEBPACK_IMPORTED_MODULE_0__.KasperError(message, token.line, token.col);
    }
    synchronize() {
        do {
            if (this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Semicolon) || this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBrace)) {
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
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Const, `Expected const definition starting "each" statement`);
        const name = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier, `Expected an identifier inside "each" statement`);
        let key = null;
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.With)) {
            key = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier, `Expected a "key" identifier after "with" keyword in foreach statement`);
        }
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Of, `Expected "of" keyword inside foreach statement`);
        const iterable = this.expression();
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Each(name, key, iterable, name.line);
    }
    expression() {
        const expression = this.assignment();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Semicolon)) {
            // consume all semicolons
            // tslint:disable-next-line
            while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Semicolon)) { }
        }
        return expression;
    }
    assignment() {
        const expr = this.ternary();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Equal, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.PlusEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.MinusEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.StarEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.SlashEqual)) {
            const operator = this.previous();
            let value = this.assignment();
            if (expr instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Variable) {
                const name = expr.name;
                if (operator.type !== _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Equal) {
                    value = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Binary(new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Variable(name, name.line), operator, value, operator.line);
                }
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Assign(name, value, name.line);
            }
            else if (expr instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Get) {
                if (operator.type !== _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Equal) {
                    value = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Binary(new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Get(expr.entity, expr.key, expr.type, expr.line), operator, value, operator.line);
                }
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Set(expr.entity, expr.key, value, expr.line);
            }
            this.error(operator, `Invalid l-value, is not an assigning target.`);
        }
        return expr;
    }
    ternary() {
        const expr = this.nullCoalescing();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Question)) {
            const thenExpr = this.ternary();
            this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Colon, `Expected ":" after ternary ? expression`);
            const elseExpr = this.ternary();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Ternary(expr, thenExpr, elseExpr, expr.line);
        }
        return expr;
    }
    nullCoalescing() {
        const expr = this.logicalOr();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.QuestionQuestion)) {
            const rightExpr = this.nullCoalescing();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.NullCoalescing(expr, rightExpr, expr.line);
        }
        return expr;
    }
    logicalOr() {
        let expr = this.logicalAnd();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Or)) {
            const operator = this.previous();
            const right = this.logicalAnd();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Logical(expr, operator, right, operator.line);
        }
        return expr;
    }
    logicalAnd() {
        let expr = this.equality();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.And)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Logical(expr, operator, right, operator.line);
        }
        return expr;
    }
    equality() {
        let expr = this.addition();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.BangEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.EqualEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Greater, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.GreaterEqual, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Less, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LessEqual)) {
            const operator = this.previous();
            const right = this.addition();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Binary(expr, operator, right, operator.line);
        }
        return expr;
    }
    addition() {
        let expr = this.modulus();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Minus, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Plus)) {
            const operator = this.previous();
            const right = this.modulus();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Binary(expr, operator, right, operator.line);
        }
        return expr;
    }
    modulus() {
        let expr = this.multiplication();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Percent)) {
            const operator = this.previous();
            const right = this.multiplication();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Binary(expr, operator, right, operator.line);
        }
        return expr;
    }
    multiplication() {
        let expr = this.typeof();
        while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Slash, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Star)) {
            const operator = this.previous();
            const right = this.typeof();
            expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Binary(expr, operator, right, operator.line);
        }
        return expr;
    }
    typeof() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Typeof)) {
            const operator = this.previous();
            const value = this.typeof();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Typeof(value, operator.line);
        }
        return this.unary();
    }
    unary() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Minus, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Bang, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Dollar, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.PlusPlus, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.MinusMinus)) {
            const operator = this.previous();
            const right = this.unary();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Unary(operator, right, operator.line);
        }
        return this.newKeyword();
    }
    newKeyword() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.New)) {
            const keyword = this.previous();
            const construct = this.call();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.New(construct, keyword.line);
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        let consumed = true;
        do {
            consumed = false;
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LeftParen)) {
                consumed = true;
                do {
                    const args = [];
                    if (!this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightParen)) {
                        do {
                            args.push(this.expression());
                        } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Comma));
                    }
                    const paren = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightParen, `Expected ")" after arguments`);
                    expr = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Call(expr, paren, args, paren.line);
                } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LeftParen));
            }
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Dot, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.QuestionDot)) {
                consumed = true;
                expr = this.dotGet(expr, this.previous());
            }
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LeftBracket)) {
                consumed = true;
                expr = this.bracketGet(expr, this.previous());
            }
        } while (consumed);
        return expr;
    }
    dotGet(expr, operator) {
        const name = this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier, `Expect property name after '.'`);
        const key = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Key(name, name.line);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Get(expr, key, operator.type, name.line);
    }
    bracketGet(expr, operator) {
        let key = null;
        if (!this.check(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBracket)) {
            key = this.expression();
        }
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBracket, `Expected "]" after an index`);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Get(expr, key, operator.type, operator.line);
    }
    primary() {
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.False)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Literal(false, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.True)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Literal(true, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Null)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Literal(null, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Undefined)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Literal(undefined, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Number) || this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.String)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Literal(this.previous().literal, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Template)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Template(this.previous().literal, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier)) {
            const identifier = this.previous();
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.PlusPlus)) {
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Postfix(identifier, 1, identifier.line);
            }
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.MinusMinus)) {
                return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Postfix(identifier, -1, identifier.line);
            }
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Variable(identifier, identifier.line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LeftParen)) {
            const expr = this.expression();
            this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightParen, `Expected ")" after expression`);
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Grouping(expr, expr.line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LeftBrace)) {
            return this.dictionary();
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.LeftBracket)) {
            return this.list();
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Void)) {
            const expr = this.expression();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Void(expr, this.previous().line);
        }
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Debug)) {
            const expr = this.expression();
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Debug(expr, this.previous().line);
        }
        throw this.error(this.peek(), `Expected expression, unexpected token "${this.peek().lexeme}"`);
        // unreacheable code
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Literal(null, 0);
    }
    dictionary() {
        const leftBrace = this.previous();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBrace)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Dictionary([], this.previous().line);
        }
        const properties = [];
        do {
            if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.String, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier, _types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Number)) {
                const key = this.previous();
                if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Colon)) {
                    const value = this.expression();
                    properties.push(new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Set(null, new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Key(key, key.line), value, key.line));
                }
                else {
                    const value = new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Variable(key, key.line);
                    properties.push(new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Set(null, new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Key(key, key.line), value, key.line));
                }
            }
            else {
                this.error(this.peek(), `String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${this.peek().lexeme}`);
            }
        } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Comma));
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBrace, `Expected "}" after object literal`);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.Dictionary(properties, leftBrace.line);
    }
    list() {
        const values = [];
        const leftBracket = this.previous();
        if (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBracket)) {
            return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.List([], this.previous().line);
        }
        do {
            values.push(this.expression());
        } while (this.match(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.Comma));
        this.consume(_types_token__WEBPACK_IMPORTED_MODULE_2__.TokenType.RightBracket, `Expected "]" after array declaration`);
        return new _types_expressions__WEBPACK_IMPORTED_MODULE_1__.List(values, leftBracket.line);
    }
}


/***/ }),

/***/ "./src/interpreter.ts":
/*!****************************!*\
  !*** ./src/interpreter.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Interpreter: () => (/* binding */ Interpreter)
/* harmony export */ });
/* harmony import */ var _types_expressions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/expressions */ "./src/types/expressions.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scope */ "./src/scope.ts");
/* harmony import */ var _types_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types/token */ "./src/types/token.ts");





class Interpreter {
    constructor() {
        this.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__.Scope();
        this.errors = [];
        this.scanner = new _scanner__WEBPACK_IMPORTED_MODULE_1__.Scanner();
        this.parser = new _expression_parser__WEBPACK_IMPORTED_MODULE_2__.ExpressionParser();
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
        if (!entity && expr.type === _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.QuestionDot) {
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
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Minus:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.MinusEqual:
                return left - right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Slash:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.SlashEqual:
                return left / right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Star:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.StarEqual:
                return left * right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Percent:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.PercentEqual:
                return left % right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Plus:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.PlusEqual:
                return left + right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Pipe:
                return left | right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Caret:
                return left ^ right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Greater:
                return left > right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.GreaterEqual:
                return left >= right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Less:
                return left < right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.LessEqual:
                return left <= right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.EqualEqual:
                return left === right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.BangEqual:
                return left !== right;
            default:
                this.error("Unknown binary operator " + expr.operator);
                return null; // unreachable
        }
    }
    visitLogicalExpr(expr) {
        const left = this.evaluate(expr.left);
        if (expr.operator.type === _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Or) {
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
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Minus:
                return -right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.Bang:
                return !right;
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.PlusPlus:
            case _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.MinusMinus:
                const newValue = Number(right) + (expr.operator.type === _types_token__WEBPACK_IMPORTED_MODULE_4__.TokenType.PlusPlus ? 1 : -1);
                if (expr.right instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Variable) {
                    this.scope.set(expr.right.name.lexeme, newValue);
                }
                else if (expr.right instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Get) {
                    const assign = new _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Set(expr.right.entity, expr.right.key, new _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Literal(newValue, expr.line), expr.line);
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
        if (expr.callee instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Get &&
            (expr.callee.entity instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Variable ||
                expr.callee.entity instanceof _types_expressions__WEBPACK_IMPORTED_MODULE_0__.Grouping)) {
            return callee.apply(expr.callee.entity.result, args);
        }
        else {
            return callee(...args);
        }
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
    visitVoidExpr(expr) {
        this.evaluate(expr.value);
        return "";
    }
    visitDebugExpr(expr) {
        const result = this.evaluate(expr.value);
        console.log(result);
        return "";
    }
}


/***/ }),

/***/ "./src/scanner.ts":
/*!************************!*\
  !*** ./src/scanner.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scanner: () => (/* binding */ Scanner)
/* harmony export */ });
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
        this.tokens.push(new _types_token__WEBPACK_IMPORTED_MODULE_1__.Token(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Eof, "", null, this.line, 0));
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
        this.tokens.push(new _types_token__WEBPACK_IMPORTED_MODULE_1__.Token(tokenType, text, literal, this.line, this.col));
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
        this.addToken(quote !== "`" ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.String : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Template, value);
    }
    number() {
        // gets integer part
        while (_utils__WEBPACK_IMPORTED_MODULE_0__.isDigit(this.peek())) {
            this.advance();
        }
        // checks for fraction
        if (this.peek() === "." && _utils__WEBPACK_IMPORTED_MODULE_0__.isDigit(this.peekNext())) {
            this.advance();
        }
        // gets fraction part
        while (_utils__WEBPACK_IMPORTED_MODULE_0__.isDigit(this.peek())) {
            this.advance();
        }
        // checks for exponent
        if (this.peek().toLowerCase() === "e") {
            this.advance();
            if (this.peek() === "-" || this.peek() === "+") {
                this.advance();
            }
        }
        while (_utils__WEBPACK_IMPORTED_MODULE_0__.isDigit(this.peek())) {
            this.advance();
        }
        const value = this.source.substring(this.start, this.current);
        this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Number, Number(value));
    }
    identifier() {
        while (_utils__WEBPACK_IMPORTED_MODULE_0__.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        const value = this.source.substring(this.start, this.current);
        const capitalized = _utils__WEBPACK_IMPORTED_MODULE_0__.capitalize(value);
        if (_utils__WEBPACK_IMPORTED_MODULE_0__.isKeyword(capitalized)) {
            this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType[capitalized], value);
        }
        else {
            this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Identifier, value);
        }
    }
    getToken() {
        const char = this.advance();
        switch (char) {
            case "(":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.LeftParen, null);
                break;
            case ")":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.RightParen, null);
                break;
            case "[":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.LeftBracket, null);
                break;
            case "]":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.RightBracket, null);
                break;
            case "{":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.LeftBrace, null);
                break;
            case "}":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.RightBrace, null);
                break;
            case ",":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Comma, null);
                break;
            case ";":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Semicolon, null);
                break;
            case "^":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Caret, null);
                break;
            case "$":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Dollar, null);
                break;
            case "#":
                this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Hash, null);
                break;
            case ":":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Arrow : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Colon, null);
                break;
            case "*":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.StarEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Star, null);
                break;
            case "%":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.PercentEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Percent, null);
                break;
            case "|":
                this.addToken(this.match("|") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Or : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Pipe, null);
                break;
            case "&":
                this.addToken(this.match("&") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.And : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Ampersand, null);
                break;
            case ">":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.GreaterEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Greater, null);
                break;
            case "!":
                this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.BangEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Bang, null);
                break;
            case "?":
                this.addToken(this.match("?")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.QuestionQuestion
                    : this.match(".")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.QuestionDot
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Question, null);
                break;
            case "=":
                this.addToken(this.match("=")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.EqualEqual
                    : this.match(">")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Arrow
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Equal, null);
                break;
            case "+":
                this.addToken(this.match("+")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.PlusPlus
                    : this.match("=")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.PlusEqual
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Plus, null);
                break;
            case "-":
                this.addToken(this.match("-")
                    ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.MinusMinus
                    : this.match("=")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.MinusEqual
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Minus, null);
                break;
            case "<":
                this.addToken(this.match("=")
                    ? this.match(">")
                        ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.LessEqualGreater
                        : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.LessEqual
                    : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Less, null);
                break;
            case ".":
                if (this.match(".")) {
                    if (this.match(".")) {
                        this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.DotDotDot, null);
                    }
                    else {
                        this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.DotDot, null);
                    }
                }
                else {
                    this.addToken(_types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Dot, null);
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
                    this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.SlashEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Slash, null);
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
                if (_utils__WEBPACK_IMPORTED_MODULE_0__.isDigit(char)) {
                    this.number();
                }
                else if (_utils__WEBPACK_IMPORTED_MODULE_0__.isAlpha(char)) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scope: () => (/* binding */ Scope)
/* harmony export */ });
class Scope {
    constructor(parent, entries) {
        this.parent = parent ? parent : null;
        this.values = entries ? entries : {};
    }
    init(entries) {
        this.values = entries ? entries : {};
    }
    set(name, value) {
        this.values[name] = value;
    }
    get(key) {
        if (typeof this.values[key] !== "undefined") {
            return this.values[key];
        }
        if (this.parent !== null) {
            return this.parent.get(key);
        }
        return window[key];
    }
}


/***/ }),

/***/ "./src/state.ts":
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   State: () => (/* binding */ State)
/* harmony export */ });
class State {
    constructor(initial, entity) {
        this._value = initial;
        this.entity = entity;
    }
    get value() {
        return this._value;
    }
    set(value) {
        this._value = value;
        this.entity.$changes += 1;
        this.entity.$doRender();
    }
    toString() {
        return this._value.toString();
    }
}


/***/ }),

/***/ "./src/template-parser.ts":
/*!********************************!*\
  !*** ./src/template-parser.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateParser: () => (/* binding */ TemplateParser)
/* harmony export */ });
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
                if (e instanceof _types_error__WEBPACK_IMPORTED_MODULE_0__.KasperError) {
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
        throw new _types_error__WEBPACK_IMPORTED_MODULE_0__.KasperError(message, this.line, this.col);
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
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__.Comment(comment, this.line);
    }
    doctype() {
        const start = this.current;
        do {
            this.advance("Expected closing doctype");
        } while (!this.match(`>`));
        const doctype = this.source.slice(start, this.current - 1).trim();
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__.Doctype(doctype, this.line);
    }
    element() {
        const line = this.line;
        const name = this.identifier("/", ">");
        if (!name) {
            this.error("Expected a tag name");
        }
        const attributes = this.attributes();
        if (this.match("/>") ||
            (_types_token__WEBPACK_IMPORTED_MODULE_2__.SelfClosingTags.includes(name) && this.match(">"))) {
            return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__.Element(name, attributes, [], true, this.line);
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
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__.Element(name, attributes, children, false, line);
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
            attributes.push(new _types_nodes__WEBPACK_IMPORTED_MODULE_1__.Attribute(name, value, line));
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
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__.Text(text, line);
    }
    whitespace() {
        let count = 0;
        while (this.peek(..._types_token__WEBPACK_IMPORTED_MODULE_2__.WhiteSpaces) && !this.eof()) {
            count += 1;
            this.advance();
        }
        return count;
    }
    identifier(...closing) {
        this.whitespace();
        const start = this.current;
        while (!this.peek(..._types_token__WEBPACK_IMPORTED_MODULE_2__.WhiteSpaces, ...closing)) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transpiler: () => (/* binding */ Transpiler)
/* harmony export */ });
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _interpreter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scope */ "./src/scope.ts");




class Transpiler {
    constructor() {
        this.scanner = new _scanner__WEBPACK_IMPORTED_MODULE_2__.Scanner();
        this.parser = new _expression_parser__WEBPACK_IMPORTED_MODULE_0__.ExpressionParser();
        this.interpreter = new _interpreter__WEBPACK_IMPORTED_MODULE_1__.Interpreter();
        this.errors = [];
    }
    evaluate(node, parent) {
        node.accept(this, parent);
    }
    // evaluates expressions and returns the result of the first evaluation
    execute(source, overrideScope) {
        const tokens = this.scanner.scan(source);
        const expressions = this.parser.parse(tokens);
        const restoreScope = this.interpreter.scope;
        if (overrideScope) {
            this.interpreter.scope = overrideScope;
        }
        const result = expressions.map((expression) => this.interpreter.evaluate(expression));
        this.interpreter.scope = restoreScope;
        return result && result.length ? result[0] : undefined;
    }
    transpile(nodes, entries, container) {
        container = container || document.createElement("kasper");
        container.innerHTML = "";
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
        const regex = /\{\{.+\}\}/ms;
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
    findAttr(node, name) {
        if (!node || !node.attributes || !node.attributes.length) {
            return null;
        }
        const attrib = node.attributes.find((attr) => name.includes(attr.name));
        if (attrib) {
            return attrib;
        }
        return null;
    }
    doIf(expressions, parent) {
        const $if = this.execute(expressions[0][1].value);
        if ($if) {
            this.createElement(expressions[0][0], parent);
            return;
        }
        for (const expression of expressions.slice(1, expressions.length)) {
            if (this.findAttr(expression[0], ["@elseif"])) {
                const $elseif = this.execute(expression[1].value);
                if ($elseif) {
                    this.createElement(expression[0], parent);
                    return;
                }
                else {
                    continue;
                }
            }
            if (this.findAttr(expression[0], ["@else"])) {
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
            this.interpreter.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__.Scope(originalScope, scope);
            this.createElement(node, parent);
            index += 1;
        }
        this.interpreter.scope = originalScope;
    }
    doWhile($while, node, parent) {
        const originalScope = this.interpreter.scope;
        this.interpreter.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__.Scope(originalScope);
        while (this.execute($while.value)) {
            this.createElement(node, parent);
        }
        this.interpreter.scope = originalScope;
    }
    doLet(init, node, parent) {
        const originalScope = this.interpreter.scope;
        this.interpreter.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__.Scope(originalScope);
        this.execute(init.value);
        this.createElement(node, parent);
        this.interpreter.scope = originalScope;
    }
    createSiblings(nodes, parent) {
        let current = 0;
        while (current < nodes.length) {
            const node = nodes[current++];
            if (node.type === "element") {
                const $each = this.findAttr(node, ["@each"]);
                if ($each) {
                    this.doEach($each, node, parent);
                    continue;
                }
                const $if = this.findAttr(node, ["@if"]);
                if ($if) {
                    const expressions = [[node, $if]];
                    const tag = node.name;
                    let found = true;
                    while (found) {
                        if (current >= nodes.length) {
                            break;
                        }
                        const attr = this.findAttr(nodes[current], [
                            "@else",
                            "@elseif",
                        ]);
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
                const $while = this.findAttr(node, ["@while"]);
                if ($while) {
                    this.doWhile($while, node, parent);
                    continue;
                }
                const $let = this.findAttr(node, ["@let"]);
                if ($let) {
                    this.doLet($let, node, parent);
                    continue;
                }
            }
            this.evaluate(node, parent);
        }
    }
    createElement(node, parent) {
        const isTemplate = node.name === "kvoid";
        const element = isTemplate ? parent : document.createElement(node.name);
        if (!isTemplate) {
            // event binding
            const events = node.attributes.filter((attr) => attr.name.startsWith("@on:"));
            for (const event of events) {
                this.createEventListener(element, event);
            }
            // attributes
            node.attributes
                .filter((attr) => !attr.name.startsWith("@"))
                .map((attr) => this.evaluate(attr, element));
        }
        if (node.self) {
            return;
        }
        this.createSiblings(node.children, element);
        if (!isTemplate && parent) {
            parent.appendChild(element);
        }
    }
    createEventListener(element, attr) {
        const type = attr.name.split(":")[1];
        const currentScope = this.interpreter.scope;
        element.addEventListener(type, () => {
            this.execute(attr.value, currentScope);
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

/***/ "./src/types/error.ts":
/*!****************************!*\
  !*** ./src/types/error.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KasperError: () => (/* binding */ KasperError)
/* harmony export */ });
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Assign: () => (/* binding */ Assign),
/* harmony export */   Binary: () => (/* binding */ Binary),
/* harmony export */   Call: () => (/* binding */ Call),
/* harmony export */   Debug: () => (/* binding */ Debug),
/* harmony export */   Dictionary: () => (/* binding */ Dictionary),
/* harmony export */   Each: () => (/* binding */ Each),
/* harmony export */   Expr: () => (/* binding */ Expr),
/* harmony export */   Get: () => (/* binding */ Get),
/* harmony export */   Grouping: () => (/* binding */ Grouping),
/* harmony export */   Key: () => (/* binding */ Key),
/* harmony export */   List: () => (/* binding */ List),
/* harmony export */   Literal: () => (/* binding */ Literal),
/* harmony export */   Logical: () => (/* binding */ Logical),
/* harmony export */   New: () => (/* binding */ New),
/* harmony export */   NullCoalescing: () => (/* binding */ NullCoalescing),
/* harmony export */   Postfix: () => (/* binding */ Postfix),
/* harmony export */   Set: () => (/* binding */ Set),
/* harmony export */   Template: () => (/* binding */ Template),
/* harmony export */   Ternary: () => (/* binding */ Ternary),
/* harmony export */   Typeof: () => (/* binding */ Typeof),
/* harmony export */   Unary: () => (/* binding */ Unary),
/* harmony export */   Variable: () => (/* binding */ Variable),
/* harmony export */   Void: () => (/* binding */ Void)
/* harmony export */ });
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
class Debug extends Expr {
    constructor(value, line) {
        super();
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitDebugExpr(this);
    }
    toString() {
        return 'Expr.Debug';
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
class Void extends Expr {
    constructor(value, line) {
        super();
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitVoidExpr(this);
    }
    toString() {
        return 'Expr.Void';
    }
}


/***/ }),

/***/ "./src/types/nodes.ts":
/*!****************************!*\
  !*** ./src/types/nodes.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Attribute: () => (/* binding */ Attribute),
/* harmony export */   Comment: () => (/* binding */ Comment),
/* harmony export */   Doctype: () => (/* binding */ Doctype),
/* harmony export */   Element: () => (/* binding */ Element),
/* harmony export */   KNode: () => (/* binding */ KNode),
/* harmony export */   Text: () => (/* binding */ Text)
/* harmony export */ });
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelfClosingTags: () => (/* binding */ SelfClosingTags),
/* harmony export */   Token: () => (/* binding */ Token),
/* harmony export */   TokenType: () => (/* binding */ TokenType),
/* harmony export */   WhiteSpaces: () => (/* binding */ WhiteSpaces)
/* harmony export */ });
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
    TokenType[TokenType["Debug"] = 51] = "Debug";
    TokenType[TokenType["False"] = 52] = "False";
    TokenType[TokenType["Instanceof"] = 53] = "Instanceof";
    TokenType[TokenType["New"] = 54] = "New";
    TokenType[TokenType["Null"] = 55] = "Null";
    TokenType[TokenType["Undefined"] = 56] = "Undefined";
    TokenType[TokenType["Of"] = 57] = "Of";
    TokenType[TokenType["Or"] = 58] = "Or";
    TokenType[TokenType["True"] = 59] = "True";
    TokenType[TokenType["Typeof"] = 60] = "Typeof";
    TokenType[TokenType["Void"] = 61] = "Void";
    TokenType[TokenType["With"] = 62] = "With";
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   capitalize: () => (/* binding */ capitalize),
/* harmony export */   isAlpha: () => (/* binding */ isAlpha),
/* harmony export */   isAlphaNumeric: () => (/* binding */ isAlphaNumeric),
/* harmony export */   isDigit: () => (/* binding */ isDigit),
/* harmony export */   isKeyword: () => (/* binding */ isKeyword)
/* harmony export */ });
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
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}
function isKeyword(word) {
    return _types_token__WEBPACK_IMPORTED_MODULE_0__.TokenType[word] >= _types_token__WEBPACK_IMPORTED_MODULE_0__.TokenType.And;
}


/***/ }),

/***/ "./src/viewer.ts":
/*!***********************!*\
  !*** ./src/viewer.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Viewer: () => (/* binding */ Viewer)
/* harmony export */ });
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

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/kasper.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KasperApp: () => (/* binding */ KasperApp)
/* harmony export */ });
/* harmony import */ var _template_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-parser */ "./src/template-parser.ts");
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _interpreter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");
/* harmony import */ var _transpiler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transpiler */ "./src/transpiler.ts");
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./viewer */ "./src/viewer.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./state */ "./src/state.ts");







function execute(source) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__.TemplateParser();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
        return JSON.stringify(parser.errors);
    }
    const result = JSON.stringify(nodes);
    return result;
}
function transpile(source, entity, container) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__.TemplateParser();
    const nodes = parser.parse(source);
    const transpiler = new _transpiler__WEBPACK_IMPORTED_MODULE_3__.Transpiler();
    const result = transpiler.transpile(nodes, entity, container);
    return result;
}
function render(entity) {
    if (typeof window === "undefined") {
        console.error("kasper requires a browser environment to render templates.");
        return;
    }
    const template = document.getElementsByTagName("template")[0];
    if (!template) {
        console.error("No template found in the document.");
        return;
    }
    const container = document.getElementsByTagName("kasper");
    if (container.length) {
        document.body.removeChild(container[0]);
    }
    const node = transpile(template.innerHTML, entity);
    document.body.appendChild(node);
}
class KasperApp {
    constructor() {
        this.$state = (initial) => new _state__WEBPACK_IMPORTED_MODULE_6__.State(initial, this);
        this.$changes = 1;
        this.$dirty = false;
        this.$doRender = () => {
            if (typeof this.$onChanges === "function") {
                this.$onChanges();
            }
            if (this.$changes > 0 && !this.$dirty) {
                this.$dirty = true;
                queueMicrotask(() => {
                    render(this);
                    // console.log(this.$changes);
                    if (typeof this.$onRender === "function") {
                        this.$onRender();
                    }
                    this.$dirty = false;
                    this.$changes = 0;
                });
            }
        };
        this.$onInit = () => { };
        this.$onRender = () => { };
        this.$onChanges = () => { };
    }
}
function Kasper(initializer) {
    const entity = new initializer();
    entity.$doRender();
    if (typeof entity.$onInit === "function") {
        entity.$onInit();
    }
}
if (typeof window !== "undefined") {
    (window || {}).kasper = {
        execute,
        transpile,
    };
    window["Kasper"] = Kasper;
    window["KasperApp"] = KasperApp;
}
else if (typeof exports !== "undefined") {
    exports.kasper = {
        ExpressionParser: _expression_parser__WEBPACK_IMPORTED_MODULE_1__.ExpressionParser,
        Interpreter: _interpreter__WEBPACK_IMPORTED_MODULE_2__.Interpreter,
        Scanner: _scanner__WEBPACK_IMPORTED_MODULE_5__.Scanner,
        TemplateParser: _template_parser__WEBPACK_IMPORTED_MODULE_0__.TemplateParser,
        Transpiler: _transpiler__WEBPACK_IMPORTED_MODULE_3__.Transpiler,
        Viewer: _viewer__WEBPACK_IMPORTED_MODULE_4__.Viewer,
    };
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUMsbURBQVMsQ0FBQyxLQUFLLEVBQ25ELElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtREFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxJQUFJLEVBQ3RELElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtREFBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxPQUFPLEVBQzVELElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtREFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JFLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtREFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxTQUFTLEVBQ3JELElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtREFBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxPQUFPLEVBQzVELElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtREFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxJQUFJLEVBQ3RELElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDYixDQUFDLENBQUMsbURBQVMsQ0FBQyxnQkFBZ0I7b0JBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzt3QkFDakIsQ0FBQyxDQUFDLG1EQUFTLENBQUMsV0FBVzt3QkFDdkIsQ0FBQyxDQUFDLG1EQUFTLENBQUMsUUFBUSxFQUN0QixJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7b0JBQ2IsQ0FBQyxDQUFDLG1EQUFTLENBQUMsVUFBVTtvQkFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO3dCQUNqQixDQUFDLENBQUMsbURBQVMsQ0FBQyxLQUFLO3dCQUNqQixDQUFDLENBQUMsbURBQVMsQ0FBQyxLQUFLLEVBQ25CLElBQUksQ0FDTCxDQUFDO2dCQUNGLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FDWCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDYixDQUFDLENBQUMsbURBQVMsQ0FBQyxRQUFRO29CQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7d0JBQ2pCLENBQUMsQ0FBQyxtREFBUyxDQUFDLFNBQVM7d0JBQ3JCLENBQUMsQ0FBQyxtREFBUyxDQUFDLElBQUksRUFDbEIsSUFBSSxDQUNMLENBQUM7Z0JBQ0YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUNiLENBQUMsQ0FBQyxtREFBUyxDQUFDLFVBQVU7b0JBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzt3QkFDakIsQ0FBQyxDQUFDLG1EQUFTLENBQUMsVUFBVTt3QkFDdEIsQ0FBQyxDQUFDLG1EQUFTLENBQUMsS0FBSyxFQUNuQixJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7b0JBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO3dCQUNmLENBQUMsQ0FBQyxtREFBUyxDQUFDLGdCQUFnQjt3QkFDNUIsQ0FBQyxDQUFDLG1EQUFTLENBQUMsU0FBUztvQkFDdkIsQ0FBQyxDQUFDLG1EQUFTLENBQUMsSUFBSSxFQUNsQixJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtREFBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0MsQ0FBQzt5QkFBTSxDQUFDO3dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsbURBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3hDLENBQUM7Z0JBQ0gsQ0FBQztxQkFBTSxDQUFDO29CQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsbURBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBQ0QsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqQixDQUFDO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUMzQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsS0FBSyxFQUN4RCxJQUFJLENBQ0wsQ0FBQztnQkFDSixDQUFDO2dCQUNELE1BQU07WUFDUixLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLE1BQU07WUFDUixlQUFlO1lBQ2YsS0FBSyxJQUFJLENBQUM7WUFDVixLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssSUFBSSxDQUFDO1lBQ1YsS0FBSyxJQUFJO2dCQUNQLE1BQU07WUFDUixnQkFBZ0I7WUFDaEI7Z0JBQ0UsSUFBSSwyQ0FBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQztxQkFBTSxJQUFJLDJDQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNwQixDQUFDO3FCQUFNLENBQUM7b0JBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztnQkFDRCxNQUFNO1FBQ1YsQ0FBQztJQUNILENBQUM7SUFFTyxLQUFLLENBQUMsT0FBZTtRQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxRQUFRLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7Ozs7QUM3Vk0sTUFBTSxLQUFLO0lBSWhCLFlBQVksTUFBYyxFQUFFLE9BQTZCO1FBQ3ZELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVNLElBQUksQ0FBQyxPQUE2QjtRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBVTtRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQVc7UUFDcEIsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFLENBQUM7WUFDNUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsT0FBTyxNQUFNLENBQUMsR0FBMEIsQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FDRjs7Ozs7Ozs7Ozs7Ozs7O0FDekJNLE1BQU0sS0FBSztJQUtoQixZQUFZLE9BQVksRUFBRSxNQUFpQjtRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBVTtRQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Q0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekIyQztBQUNOO0FBQ3VCO0FBRXRELE1BQU0sY0FBYztJQVFsQixLQUFLLENBQUMsTUFBYztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFaEIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQztnQkFDSCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUNsQixTQUFTO2dCQUNYLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLFlBQVkscURBQVcsRUFBRSxDQUFDO29CQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRSxDQUFDO3FCQUFNLENBQUM7b0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDO3dCQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO3dCQUMvQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3BCLENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxNQUFNO1lBQ1IsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVPLEtBQUssQ0FBQyxHQUFHLEtBQWU7UUFDOUIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUM1QixPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU8sT0FBTyxDQUFDLFdBQW1CLEVBQUU7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQTJCLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDcEQsQ0FBQztJQUNILENBQUM7SUFFTyxJQUFJLENBQUMsR0FBRyxLQUFlO1FBQzdCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7WUFDekIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQztRQUNILENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxLQUFLLENBQUMsSUFBWTtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQzlFLENBQUM7SUFFTyxHQUFHO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzNDLENBQUM7SUFFTyxLQUFLLENBQUMsT0FBZTtRQUMzQixNQUFNLElBQUkscURBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVPLElBQUk7UUFDVixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxJQUFnQixDQUFDO1FBRXJCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDdkIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4QixDQUFDO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztZQUM5RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLENBQUM7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLE9BQU87UUFDYixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzNCLEdBQUcsQ0FBQztZQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNqRCxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNELE9BQU8sSUFBSSxpREFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVPLE9BQU87UUFDYixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzNCLEdBQUcsQ0FBQztZQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUMzQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xFLE9BQU8sSUFBSSxpREFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVPLE9BQU87UUFDYixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNWLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXJDLElBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQyx5REFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ25ELENBQUM7WUFDRCxPQUFPLElBQUksaURBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQWlCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNyQixRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixPQUFPLElBQUksaURBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLEtBQUssQ0FBQyxJQUFZO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksR0FBRyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNwQyxDQUFDO0lBQ0gsQ0FBQztJQUVPLFFBQVEsQ0FBQyxNQUFjO1FBQzdCLE1BQU0sUUFBUSxHQUFpQixFQUFFLENBQUM7UUFDbEMsR0FBRyxDQUFDO1lBQ0YsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDZixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN0QyxDQUFDO1lBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNsQixTQUFTO1lBQ1gsQ0FBQztZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUUzQixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU8sVUFBVTtRQUNoQixNQUFNLFVBQVUsR0FBcUIsRUFBRSxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7b0JBQ3BCLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQixDQUFDO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUMzQixLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0IsQ0FBQztxQkFBTSxDQUFDO29CQUNOLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQztZQUNILENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLG1EQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRU8sSUFBSTtRQUNWLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDVixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxPQUFPLElBQUksOENBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVPLFVBQVU7UUFDaEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcscURBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDaEQsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU8sVUFBVSxDQUFDLEdBQUcsT0FBaUI7UUFDckMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxxREFBVyxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRU8sTUFBTSxDQUFDLE9BQWU7UUFDNUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOVBzRDtBQUNYO0FBQ1I7QUFDSjtBQUt6QixNQUFNLFVBQVU7SUFBdkI7UUFDVSxZQUFPLEdBQUcsSUFBSSw2Q0FBTyxFQUFFLENBQUM7UUFDeEIsV0FBTSxHQUFHLElBQUksZ0VBQWdCLEVBQUUsQ0FBQztRQUNoQyxnQkFBVyxHQUFHLElBQUkscURBQVcsRUFBRSxDQUFDO1FBQ2pDLFdBQU0sR0FBYSxFQUFFLENBQUM7SUErUS9CLENBQUM7SUE3UVMsUUFBUSxDQUFDLElBQWlCLEVBQUUsTUFBYTtRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsdUVBQXVFO0lBQy9ELE9BQU8sQ0FBQyxNQUFjLEVBQUUsYUFBcUI7UUFDbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFDNUMsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7UUFDekMsQ0FBQztRQUNELE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FDdEMsQ0FBQztRQUNGLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUN0QyxPQUFPLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sU0FBUyxDQUNkLEtBQW9CLEVBQ3BCLE9BQWdCLEVBQ2hCLFNBQXVCO1FBRXZCLFNBQVMsR0FBRyxTQUFTLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQW1CLEVBQUUsTUFBYTtRQUN6RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sY0FBYyxDQUFDLElBQWdCLEVBQUUsTUFBYTtRQUNuRCxNQUFNLEtBQUssR0FBRyxjQUFjLENBQUM7UUFDN0IsSUFBSSxJQUFVLENBQUM7UUFDZixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQy9CLHFCQUFxQixFQUNyQixDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRTtnQkFDakIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FDRixDQUFDO1lBQ0YsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUNELElBQUksTUFBTSxFQUFFLENBQUM7WUFDWCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBRU0sbUJBQW1CLENBQUMsSUFBcUIsRUFBRSxNQUFhO1FBQzdELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLENBQUM7UUFFRCxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1YsTUFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0gsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQW1CLEVBQUUsTUFBYTtRQUN6RCxNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFFTyxRQUFRLENBQ2QsSUFBbUIsRUFDbkIsSUFBYztRQUVkLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN6RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQzNDLElBQUksQ0FBQyxRQUFRLENBQUUsSUFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FDOUMsQ0FBQztRQUNGLElBQUksTUFBTSxFQUFFLENBQUM7WUFDWCxPQUFPLE1BQXlCLENBQUM7UUFDbkMsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLElBQUksQ0FBQyxXQUF5QixFQUFFLE1BQVk7UUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZFLElBQUksR0FBRyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QyxPQUFPO1FBQ1QsQ0FBQztRQUVELEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbEUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQy9ELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUUsVUFBVSxDQUFDLENBQUMsQ0FBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkUsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDWixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDMUMsT0FBTztnQkFDVCxDQUFDO3FCQUFNLENBQUM7b0JBQ04sU0FBUztnQkFDWCxDQUFDO1lBQ0gsQ0FBQztZQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFrQixFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM3RCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDMUMsT0FBTztZQUNULENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLE1BQU0sQ0FBQyxJQUFxQixFQUFFLElBQW1CLEVBQUUsTUFBWTtRQUNyRSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FDNUIsQ0FBQztRQUNGLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssTUFBTSxJQUFJLElBQUksUUFBUSxFQUFFLENBQUM7WUFDNUIsTUFBTSxLQUFLLEdBQTJCLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN2RCxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNSLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDckIsQ0FBQztZQUNELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUkseUNBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakMsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7SUFDekMsQ0FBQztJQUVPLE9BQU8sQ0FBQyxNQUF1QixFQUFFLElBQW1CLEVBQUUsTUFBWTtRQUN4RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLHlDQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7SUFDekMsQ0FBQztJQUVPLEtBQUssQ0FBQyxJQUFxQixFQUFFLElBQW1CLEVBQUUsTUFBWTtRQUNwRSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLHlDQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBQ3pDLENBQUM7SUFFTyxjQUFjLENBQUMsS0FBb0IsRUFBRSxNQUFhO1FBQ3hELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixPQUFPLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUM1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQXFCLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ2xELFNBQVM7Z0JBQ1gsQ0FBQztnQkFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNSLE1BQU0sV0FBVyxHQUFpQixDQUFDLENBQUMsSUFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxNQUFNLEdBQUcsR0FBSSxJQUFzQixDQUFDLElBQUksQ0FBQztvQkFDekMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUVqQixPQUFPLEtBQUssRUFBRSxDQUFDO3dCQUNiLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFDNUIsTUFBTTt3QkFDUixDQUFDO3dCQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBa0IsRUFBRTs0QkFDMUQsT0FBTzs0QkFDUCxTQUFTO3lCQUNWLENBQUMsQ0FBQzt3QkFDSCxJQUFLLEtBQUssQ0FBQyxPQUFPLENBQW1CLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs0QkFDM0QsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDMUQsT0FBTyxJQUFJLENBQUMsQ0FBQzt3QkFDZixDQUFDOzZCQUFNLENBQUM7NEJBQ04sS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDaEIsQ0FBQztvQkFDSCxDQUFDO29CQUVELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUMvQixTQUFTO2dCQUNYLENBQUM7Z0JBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFxQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEUsSUFBSSxNQUFNLEVBQUUsQ0FBQztvQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNwRCxTQUFTO2dCQUNYLENBQUM7Z0JBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxJQUFJLEVBQUUsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNoRCxTQUFTO2dCQUNYLENBQUM7WUFDSCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQztJQUNILENBQUM7SUFFTyxhQUFhLENBQUMsSUFBbUIsRUFBRSxNQUFhO1FBQ3RELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4RSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDaEIsZ0JBQWdCO1lBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FDNUMsSUFBd0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUNsRCxDQUFDO1lBRUYsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxLQUF3QixDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELGFBQWE7WUFDYixJQUFJLENBQUMsVUFBVTtpQkFDWixNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUUsSUFBd0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNqRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUMxQixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBRU8sbUJBQW1CLENBQUMsT0FBYSxFQUFFLElBQXFCO1FBQzlELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxhQUFhLENBQUMsTUFBYztRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRUQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFLENBQUM7WUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQW1CO1FBQzFDLE9BQU87UUFDUCxxRUFBcUU7SUFDdkUsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFlO1FBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7Ozs7QUMzUk0sTUFBTSxXQUFXO0lBS3RCLFlBQVksS0FBYSxFQUFFLElBQVksRUFBRSxHQUFXO1FBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7Q0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pNLE1BQWUsSUFBSTtJQUd4QiwyQkFBMkI7SUFDM0IsZ0JBQWdCLENBQUM7Q0FFbEI7QUE0Qk0sTUFBTSxNQUFPLFNBQVEsSUFBSTtJQUk1QixZQUFZLElBQVcsRUFBRSxLQUFXLEVBQUUsSUFBWTtRQUM5QyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFSSxNQUFNLENBQUksT0FBdUI7UUFDcEMsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztDQUNGO0FBRU0sTUFBTSxNQUFPLFNBQVEsSUFBSTtJQUs1QixZQUFZLElBQVUsRUFBRSxRQUFlLEVBQUUsS0FBVyxFQUFFLElBQVk7UUFDOUQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUksTUFBTSxDQUFJLE9BQXVCO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7Q0FDRjtBQUVNLE1BQU0sSUFBSyxTQUFRLElBQUk7SUFLMUIsWUFBWSxNQUFZLEVBQUUsS0FBWSxFQUFFLElBQVksRUFBRSxJQUFZO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFFTSxNQUFNLEtBQU0sU0FBUSxJQUFJO0lBRzNCLFlBQVksS0FBVyxFQUFFLElBQVk7UUFDakMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUksTUFBTSxDQUFJLE9BQXVCO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQUVNLE1BQU0sVUFBVyxTQUFRLElBQUk7SUFHaEMsWUFBWSxVQUFrQixFQUFFLElBQVk7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUksTUFBTSxDQUFJLE9BQXVCO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxpQkFBaUIsQ0FBQztJQUM3QixDQUFDO0NBQ0Y7QUFFTSxNQUFNLElBQUssU0FBUSxJQUFJO0lBSzFCLFlBQVksSUFBVyxFQUFFLEdBQVUsRUFBRSxRQUFjLEVBQUUsSUFBWTtRQUM3RCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFFTSxNQUFNLEdBQUksU0FBUSxJQUFJO0lBS3pCLFlBQVksTUFBWSxFQUFFLEdBQVMsRUFBRSxJQUFlLEVBQUUsSUFBWTtRQUM5RCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0NBQ0Y7QUFFTSxNQUFNLFFBQVMsU0FBUSxJQUFJO0lBRzlCLFlBQVksVUFBZ0IsRUFBRSxJQUFZO1FBQ3RDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sZUFBZSxDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQUVNLE1BQU0sR0FBSSxTQUFRLElBQUk7SUFHekIsWUFBWSxJQUFXLEVBQUUsSUFBWTtRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFSSxNQUFNLENBQUksT0FBdUI7UUFDcEMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztDQUNGO0FBRU0sTUFBTSxPQUFRLFNBQVEsSUFBSTtJQUs3QixZQUFZLElBQVUsRUFBRSxRQUFlLEVBQUUsS0FBVyxFQUFFLElBQVk7UUFDOUQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUksTUFBTSxDQUFJLE9BQXVCO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBRU0sTUFBTSxJQUFLLFNBQVEsSUFBSTtJQUcxQixZQUFZLEtBQWEsRUFBRSxJQUFZO1FBQ25DLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFFTSxNQUFNLE9BQVEsU0FBUSxJQUFJO0lBRzdCLFlBQVksS0FBVSxFQUFFLElBQVk7UUFDaEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUksTUFBTSxDQUFJLE9BQXVCO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBRU0sTUFBTSxHQUFJLFNBQVEsSUFBSTtJQUd6QixZQUFZLEtBQVcsRUFBRSxJQUFZO1FBQ2pDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0NBQ0Y7QUFFTSxNQUFNLGNBQWUsU0FBUSxJQUFJO0lBSXBDLFlBQVksSUFBVSxFQUFFLEtBQVcsRUFBRSxJQUFZO1FBQzdDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8scUJBQXFCLENBQUM7SUFDakMsQ0FBQztDQUNGO0FBRU0sTUFBTSxPQUFRLFNBQVEsSUFBSTtJQUk3QixZQUFZLElBQVcsRUFBRSxTQUFpQixFQUFFLElBQVk7UUFDcEQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUksTUFBTSxDQUFJLE9BQXVCO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBRU0sTUFBTSxHQUFJLFNBQVEsSUFBSTtJQUt6QixZQUFZLE1BQVksRUFBRSxHQUFTLEVBQUUsS0FBVyxFQUFFLElBQVk7UUFDMUQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFSSxNQUFNLENBQUksT0FBdUI7UUFDcEMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztDQUNGO0FBRU0sTUFBTSxRQUFTLFNBQVEsSUFBSTtJQUc5QixZQUFZLEtBQWEsRUFBRSxJQUFZO1FBQ25DLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sZUFBZSxDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQUVNLE1BQU0sT0FBUSxTQUFRLElBQUk7SUFLN0IsWUFBWSxTQUFlLEVBQUUsUUFBYyxFQUFFLFFBQWMsRUFBRSxJQUFZO1FBQ3JFLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7Q0FDRjtBQUVNLE1BQU0sTUFBTyxTQUFRLElBQUk7SUFHNUIsWUFBWSxLQUFXLEVBQUUsSUFBWTtRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFSSxNQUFNLENBQUksT0FBdUI7UUFDcEMsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztDQUNGO0FBRU0sTUFBTSxLQUFNLFNBQVEsSUFBSTtJQUkzQixZQUFZLFFBQWUsRUFBRSxLQUFXLEVBQUUsSUFBWTtRQUNsRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFSSxNQUFNLENBQUksT0FBdUI7UUFDcEMsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBRU0sTUFBTSxRQUFTLFNBQVEsSUFBSTtJQUc5QixZQUFZLElBQVcsRUFBRSxJQUFZO1FBQ2pDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVJLE1BQU0sQ0FBSSxPQUF1QjtRQUNwQyxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sZUFBZSxDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQUVNLE1BQU0sSUFBSyxTQUFRLElBQUk7SUFHMUIsWUFBWSxLQUFXLEVBQUUsSUFBWTtRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFSSxNQUFNLENBQUksT0FBdUI7UUFDcEMsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xkTSxNQUFlLEtBQUs7Q0FJMUI7QUFVTSxNQUFNLE9BQVEsU0FBUSxLQUFLO0lBTTlCLFlBQVksSUFBWSxFQUFFLFVBQW1CLEVBQUUsUUFBaUIsRUFBRSxJQUFhLEVBQUUsT0FBZSxDQUFDO1FBQzdGLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLE1BQU0sQ0FBSSxPQUF3QixFQUFFLE1BQWE7UUFDcEQsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBRU0sTUFBTSxTQUFVLFNBQVEsS0FBSztJQUloQyxZQUFZLElBQVksRUFBRSxLQUFhLEVBQUUsT0FBZSxDQUFDO1FBQ3JELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLE1BQU0sQ0FBSSxPQUF3QixFQUFFLE1BQWE7UUFDcEQsT0FBTyxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxpQkFBaUIsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFFTSxNQUFNLElBQUssU0FBUSxLQUFLO0lBRzNCLFlBQVksS0FBYSxFQUFFLE9BQWUsQ0FBQztRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxNQUFNLENBQUksT0FBd0IsRUFBRSxNQUFhO1FBQ3BELE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0NBQ0o7QUFFTSxNQUFNLE9BQVEsU0FBUSxLQUFLO0lBRzlCLFlBQVksS0FBYSxFQUFFLE9BQWUsQ0FBQztRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxNQUFNLENBQUksT0FBd0IsRUFBRSxNQUFhO1FBQ3BELE9BQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sZUFBZSxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQUVNLE1BQU0sT0FBUSxTQUFRLEtBQUs7SUFHOUIsWUFBWSxLQUFhLEVBQUUsT0FBZSxDQUFDO1FBQ3ZDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLE1BQU0sQ0FBSSxPQUF3QixFQUFFLE1BQWE7UUFDcEQsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuSEQsSUFBWSxTQXlFWDtBQXpFRCxXQUFZLFNBQVM7SUFDbkIsZ0JBQWdCO0lBQ2hCLHVDQUFHO0lBQ0gsMkNBQUs7SUFFTCwwQkFBMEI7SUFDMUIsbURBQVM7SUFDVCw2Q0FBTTtJQUNOLDJDQUFLO0lBQ0wsMkNBQUs7SUFDTCw2Q0FBTTtJQUNOLHVDQUFHO0lBQ0gseUNBQUk7SUFDSixtREFBUztJQUNULHdEQUFXO0lBQ1gsb0RBQVM7SUFDVCxnREFBTztJQUNQLDBDQUFJO0lBQ0osc0RBQVU7SUFDViwwREFBWTtJQUNaLHNEQUFVO0lBQ1Ysb0RBQVM7SUFDVCw0Q0FBSztJQUNMLDBDQUFJO0lBRUosOEJBQThCO0lBQzlCLDRDQUFLO0lBQ0wsMENBQUk7SUFDSixvREFBUztJQUNULDRDQUFLO0lBQ0wsNENBQUs7SUFDTCxzREFBVTtJQUNWLGdEQUFPO0lBQ1AsMERBQVk7SUFDWiwwQ0FBSTtJQUNKLG9EQUFTO0lBQ1QsNENBQUs7SUFDTCxzREFBVTtJQUNWLHNEQUFVO0lBQ1YsMERBQVk7SUFDWiwwQ0FBSTtJQUNKLG9EQUFTO0lBQ1Qsa0RBQVE7SUFDUixrREFBUTtJQUNSLHdEQUFXO0lBQ1gsa0VBQWdCO0lBQ2hCLHNEQUFVO0lBQ1Ysb0RBQVM7SUFDVCw4Q0FBTTtJQUNOLG9EQUFTO0lBQ1Qsa0VBQWdCO0lBRWhCLFdBQVc7SUFDWCxzREFBVTtJQUNWLGtEQUFRO0lBQ1IsOENBQU07SUFDTiw4Q0FBTTtJQUVOLFdBQVc7SUFDWCx3Q0FBRztJQUNILDRDQUFLO0lBQ0wsNENBQUs7SUFDTCw0Q0FBSztJQUNMLHNEQUFVO0lBQ1Ysd0NBQUc7SUFDSCwwQ0FBSTtJQUNKLG9EQUFTO0lBQ1Qsc0NBQUU7SUFDRixzQ0FBRTtJQUNGLDBDQUFJO0lBQ0osOENBQU07SUFDTiwwQ0FBSTtJQUNKLDBDQUFJO0FBQ04sQ0FBQyxFQXpFVyxTQUFTLEtBQVQsU0FBUyxRQXlFcEI7QUFFTSxNQUFNLEtBQUs7SUFRaEIsWUFDRSxJQUFlLEVBQ2YsTUFBYyxFQUNkLE9BQVksRUFDWixJQUFZLEVBQ1osR0FBVztRQUVYLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDO0lBQzdDLENBQUM7Q0FDRjtBQUVNLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFVLENBQUM7QUFFckQsTUFBTSxlQUFlLEdBQUc7SUFDN0IsTUFBTTtJQUNOLE1BQU07SUFDTixJQUFJO0lBQ0osS0FBSztJQUNMLE9BQU87SUFDUCxJQUFJO0lBQ0osS0FBSztJQUNMLE9BQU87SUFDUCxNQUFNO0lBQ04sTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLEtBQUs7Q0FDTixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hId0M7QUFFbkMsU0FBUyxPQUFPLENBQUMsSUFBWTtJQUNsQyxPQUFPLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUNwQyxDQUFDO0FBRU0sU0FBUyxPQUFPLENBQUMsSUFBWTtJQUNsQyxPQUFPLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRU0sU0FBUyxjQUFjLENBQUMsSUFBWTtJQUN6QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVNLFNBQVMsVUFBVSxDQUFDLElBQVk7SUFDckMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDeEUsQ0FBQztBQUVNLFNBQVMsU0FBUyxDQUFDLElBQTRCO0lBQ3BELE9BQU8sbURBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxtREFBUyxDQUFDLEdBQUcsQ0FBQztBQUMxQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNsQk0sTUFBTSxNQUFNO0lBQW5CO1FBQ1MsV0FBTSxHQUFhLEVBQUUsQ0FBQztJQTREL0IsQ0FBQztJQTFEUyxRQUFRLENBQUMsSUFBaUI7UUFDaEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFTSxTQUFTLENBQUMsS0FBb0I7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDO2dCQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBQ3pDLE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBbUI7UUFDMUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakIsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUM7UUFDbkMsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQzVELENBQUM7SUFFTSxtQkFBbUIsQ0FBQyxJQUFxQjtRQUM5QyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFTSxjQUFjLENBQUMsSUFBZ0I7UUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxJQUFtQjtRQUMxQyxPQUFPLFFBQVEsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxJQUFtQjtRQUMxQyxPQUFPLGFBQWEsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxLQUFLLENBQUMsT0FBZTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRjs7Ozs7OztVQy9ERDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1EO0FBQ0k7QUFDWDtBQUNGO0FBQ1I7QUFDRTtBQUNKO0FBRWhDLFNBQVMsT0FBTyxDQUFDLE1BQWM7SUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSw0REFBYyxFQUFFLENBQUM7SUFDcEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQ2hCLE1BQWMsRUFDZCxNQUErQixFQUMvQixTQUF1QjtJQUV2QixNQUFNLE1BQU0sR0FBRyxJQUFJLDREQUFjLEVBQUUsQ0FBQztJQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksbURBQVUsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5RCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsTUFBVztJQUN6QixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztRQUM1RSxPQUFPO0lBQ1QsQ0FBQztJQUNELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDcEQsT0FBTztJQUNULENBQUM7SUFFRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUQsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFTSxNQUFNLFNBQVM7SUFBdEI7UUFDRSxXQUFNLEdBQUcsQ0FBQyxPQUFZLEVBQUUsRUFBRSxDQUFDLElBQUkseUNBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEQsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixjQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ2YsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixDQUFDO1lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLGNBQWMsQ0FBQyxHQUFHLEVBQUU7b0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDYiw4QkFBOEI7b0JBQzlCLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRSxDQUFDO3dCQUN6QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ25CLENBQUM7b0JBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUM7UUFDRixZQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBQ25CLGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDckIsZUFBVSxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQUE7QUFFRCxTQUFTLE1BQU0sQ0FBQyxXQUFnQjtJQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixJQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztRQUN6QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztBQUNILENBQUM7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUUsTUFBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRztRQUMvQixPQUFPO1FBQ1AsU0FBUztLQUNWLENBQUM7SUFDRCxNQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ2xDLE1BQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDM0MsQ0FBQztLQUFNLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFLENBQUM7SUFDMUMsT0FBTyxDQUFDLE1BQU0sR0FBRztRQUNmLGdCQUFnQjtRQUNoQixXQUFXO1FBQ1gsT0FBTztRQUNQLGNBQWM7UUFDZCxVQUFVO1FBQ1YsTUFBTTtLQUNQLENBQUM7QUFDSixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy9pbnRlcnByZXRlci50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvc2Nhbm5lci50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvc2NvcGUudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3N0YXRlLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy90ZW1wbGF0ZS1wYXJzZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3RyYW5zcGlsZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3R5cGVzL2Vycm9yLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvdHlwZXMvbm9kZXMudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3R5cGVzL3Rva2VuLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvdmlld2VyLnRzIiwid2VicGFjazovL2thc3Blci1qcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9rYXNwZXItanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2thc3Blci1qcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2thc3Blci1qcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy9rYXNwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xyXG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XHJcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xyXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xyXG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xyXG4gIHB1YmxpYyBlcnJvckxldmVsID0gMTtcclxuXHJcbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcclxuICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBLYXNwZXJFcnJvcikge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgUGFyc2UgRXJyb3IgKCR7ZS5saW5lfToke2UuY29sfSkgPT4gJHtlLnZhbHVlfWApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25zO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN5bmNocm9uaXplKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBleHByZXNzaW9ucztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcclxuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcclxuICAgIGlmICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcclxuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XHJcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXHJcbiAgICAgIHRoaXMucGVlaygpLFxyXG4gICAgICBtZXNzYWdlICsgYCwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IodG9rZW46IFRva2VuLCBtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xyXG4gICAgZG8ge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XHJcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG5cclxuICAgIHRoaXMuY29uc3VtZShcclxuICAgICAgVG9rZW5UeXBlLkNvbnN0LFxyXG4gICAgICBgRXhwZWN0ZWQgY29uc3QgZGVmaW5pdGlvbiBzdGFydGluZyBcImVhY2hcIiBzdGF0ZW1lbnRgXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXHJcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxyXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcclxuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxyXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxyXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29uc3VtZShcclxuICAgICAgVG9rZW5UeXBlLk9mLFxyXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xyXG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xyXG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXHJcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge31cclxuICAgIH1cclxuICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XHJcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcclxuICAgIGlmIChcclxuICAgICAgdGhpcy5tYXRjaChcclxuICAgICAgICBUb2tlblR5cGUuRXF1YWwsXHJcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuU3RhckVxdWFsLFxyXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XHJcbiAgICAgIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xyXG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xyXG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcclxuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxyXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxyXG4gICAgICAgICAgICBvcGVyYXRvcixcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XHJcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xyXG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXHJcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcclxuICAgICAgICAgICAgb3BlcmF0b3IsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5lcnJvcihvcGVyYXRvciwgYEludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xyXG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcclxuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xyXG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcclxuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcclxuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XHJcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xyXG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcclxuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XHJcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xyXG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XHJcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xyXG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XHJcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XHJcbiAgICB3aGlsZSAoXHJcbiAgICAgIHRoaXMubWF0Y2goXHJcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcclxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcclxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlckVxdWFsLFxyXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxyXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWxcclxuICAgICAgKVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcclxuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcclxuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XHJcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XHJcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXMsIFRva2VuVHlwZS5QbHVzKSkge1xyXG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcclxuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XHJcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xyXG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXhwcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbXVsdGlwbGljYXRpb24oKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xyXG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcclxuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcclxuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLm1hdGNoKFxyXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcclxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcclxuICAgICAgICBUb2tlblR5cGUuRG9sbGFyLFxyXG4gICAgICAgIFRva2VuVHlwZS5QbHVzUGx1cyxcclxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy51bmFyeSgpO1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm5ld0tleXdvcmQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbmV3S2V5d29yZCgpOiBFeHByLkV4cHIge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk5ldykpIHtcclxuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcclxuICAgICAgY29uc3QgY29uc3RydWN0OiBFeHByLkV4cHIgPSB0aGlzLmNhbGwoKTtcclxuICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QsIGtleXdvcmQubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5jYWxsKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGwoKTogRXhwci5FeHByIHtcclxuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcclxuICAgIGxldCBjb25zdW1lZCA9IHRydWU7XHJcbiAgICBkbyB7XHJcbiAgICAgIGNvbnN1bWVkID0gZmFsc2U7XHJcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XHJcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XHJcbiAgICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgcGFyZW46IFRva2VuID0gdGhpcy5jb25zdW1lKFxyXG4gICAgICAgICAgICBUb2tlblR5cGUuUmlnaHRQYXJlbixcclxuICAgICAgICAgICAgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGFyZ3VtZW50c2BcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBleHByID0gbmV3IEV4cHIuQ2FsbChleHByLCBwYXJlbiwgYXJncywgcGFyZW4ubGluZSk7XHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xyXG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcclxuICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XHJcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xyXG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcclxuICAgICAgfVxyXG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xyXG4gICAgcmV0dXJuIGV4cHI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XHJcbiAgICBjb25zdCBuYW1lOiBUb2tlbiA9IHRoaXMuY29uc3VtZShcclxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXHJcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXHJcbiAgICApO1xyXG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xyXG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xyXG4gICAgbGV0IGtleTogRXhwci5FeHByID0gbnVsbDtcclxuXHJcbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcclxuICAgICAga2V5ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhbiBpbmRleGApO1xyXG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKGZhbHNlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodHJ1ZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHVuZGVmaW5lZCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVtcGxhdGUodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xyXG4gICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy5wcmV2aW91cygpO1xyXG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoaWRlbnRpZmllciwgMSwgaWRlbnRpZmllci5saW5lKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChpZGVudGlmaWVyLCAtMSwgaWRlbnRpZmllci5saW5lKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XHJcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByLCBleHByLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5saXN0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcclxuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5EZWJ1ZykpIHtcclxuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcclxuICAgICAgdGhpcy5wZWVrKCksXHJcbiAgICAgIGBFeHBlY3RlZCBleHByZXNzaW9uLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXHJcbiAgICApO1xyXG4gICAgLy8gdW5yZWFjaGVhYmxlIGNvZGVcclxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcclxuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcHJvcGVydGllczogRXhwci5FeHByW10gPSBbXTtcclxuICAgIGRvIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZywgVG9rZW5UeXBlLklkZW50aWZpZXIsIFRva2VuVHlwZS5OdW1iZXIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbG9uKSkge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcclxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgRXhwci5WYXJpYWJsZShrZXksIGtleS5saW5lKTtcclxuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcclxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lcnJvcihcclxuICAgICAgICAgIHRoaXMucGVlaygpLFxyXG4gICAgICAgICAgYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7XHJcbiAgICAgICAgICAgIHRoaXMucGVlaygpLmxleGVtZVxyXG4gICAgICAgICAgfWBcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xyXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcclxuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcclxuICAgIGNvbnN0IGxlZnRCcmFja2V0ID0gdGhpcy5wcmV2aW91cygpO1xyXG5cclxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXN0KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XHJcbiAgICB9XHJcbiAgICBkbyB7XHJcbiAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcclxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XHJcblxyXG4gICAgdGhpcy5jb25zdW1lKFxyXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxyXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKTtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgaWYgKHRoaXMucGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFRlbXBsYXRlIHN0cmluZyAgZXJyb3I6ICR7dGhpcy5wYXJzZXIuZXJyb3JzWzBdfWApO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogRXhwci5UZW1wbGF0ZSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwci52YWx1ZS5yZXBsYWNlKFxuICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGFyc2UocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEJpbmFyeUV4cHIoZXhwcjogRXhwci5CaW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2hFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50OlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAlIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBpcGU6XG4gICAgICAgIHJldHVybiBsZWZ0IHwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DYXJldDpcbiAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXI6XG4gICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzczpcbiAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3NFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvciBcIiArIGV4cHIub3BlcmF0b3IpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKS5pc1RydXRoeSgpXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmICghbGVmdCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOlxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgTnVtYmVyKHJpZ2h0KSArIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5QbHVzUGx1cyA/IDEgOiAtMSk7XG4gICAgICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucmlnaHQubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgICAgICBleHByLnJpZ2h0LmVudGl0eSxcbiAgICAgICAgICAgIGV4cHIucmlnaHQua2V5LFxuICAgICAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgICBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAgJHtleHByLnJpZ2h0fWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoYFVua25vd24gdW5hcnkgb3BlcmF0b3IgJyArIGV4cHIub3BlcmF0b3JgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENhbGxFeHByKGV4cHI6IEV4cHIuQ2FsbCk6IGFueSB7XG4gICAgLy8gdmVyaWZ5IGNhbGxlZSBpcyBhIGZ1bmN0aW9uXG4gICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgaWYgKHR5cGVvZiBjYWxsZWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihgJHtjYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgfVxuICAgIC8vIGV2YWx1YXRlIGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIGV4cHIuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJndW1lbnQpKTtcbiAgICB9XG4gICAgLy8gZXhlY3V0ZSBmdW5jdGlvblxuICAgIGlmIChcbiAgICAgIGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQgJiZcbiAgICAgIChleHByLmNhbGxlZS5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlIHx8XG4gICAgICAgIGV4cHIuY2FsbGVlLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR3JvdXBpbmcpXG4gICAgKSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IG5ld0NhbGwgPSBleHByLmNsYXp6IGFzIEV4cHIuQ2FsbDtcbiAgICAvLyBpbnRlcm5hbCBjbGFzcyBkZWZpbml0aW9uIGluc3RhbmNlXG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKG5ld0NhbGwuY2FsbGVlKTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgYCcke2NsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBuZXdDYWxsLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLmtleSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XHJcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cclxuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XHJcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xyXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XHJcbiAgLyoqIExpc3Qgb2YgZXJyb3JzIGZyb20gc2Nhbm5pbmcgKi9cclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXTtcclxuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cclxuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcclxuICAvKiogcG9pbnRzIHRvIHRoZSBzdGFydCBvZiB0aGUgdG9rZW4gICovXHJcbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xyXG4gIC8qKiBjdXJyZW50IGxpbmUgb2Ygc291cmNlIGNvZGUgYmVpbmcgdG9rZW5pemVkICovXHJcbiAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XHJcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXHJcbiAgcHJpdmF0ZSBjb2w6IG51bWJlcjtcclxuXHJcbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcclxuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgdGhpcy50b2tlbnMgPSBbXTtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy5zdGFydCA9IDA7XHJcbiAgICB0aGlzLmxpbmUgPSAxO1xyXG4gICAgdGhpcy5jb2wgPSAxO1xyXG5cclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcclxuICAgIHJldHVybiB0aGlzLnRva2VucztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+PSB0aGlzLnNvdXJjZS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkdmFuY2UoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xyXG4gICAgICB0aGlzLmxpbmUrKztcclxuICAgICAgdGhpcy5jb2wgPSAwO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jdXJyZW50Kys7XHJcbiAgICB0aGlzLmNvbCsrO1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xyXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xyXG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4odG9rZW5UeXBlLCB0ZXh0LCBsaXRlcmFsLCB0aGlzLmxpbmUsIHRoaXMuY29sKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1hdGNoKGV4cGVjdGVkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmVvZigpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5lb2YoKSkge1xyXG4gICAgICByZXR1cm4gXCJcXDBcIjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnQgKyAxID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gXCJcXDBcIjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50ICsgMSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbW1lbnQoKTogdm9pZCB7XHJcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG11bHRpbGluZUNvbW1lbnQoKTogdm9pZCB7XHJcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgY29tbWVudCwgZXhwZWN0aW5nIGNsb3NpbmcgXCIqL1wiJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB0aGUgY2xvc2luZyBzbGFzaCAnKi8nXHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RyaW5nKHF1b3RlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cclxuICAgIGlmICh0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7cXVvdGV9YCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGUgY2xvc2luZyBcIi5cclxuICAgIHRoaXMuYWR2YW5jZSgpO1xyXG5cclxuICAgIC8vIFRyaW0gdGhlIHN1cnJvdW5kaW5nIHF1b3Rlcy5cclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcclxuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XHJcbiAgICAvLyBnZXRzIGludGVnZXIgcGFydFxyXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cclxuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCIuXCIgJiYgVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWtOZXh0KCkpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxyXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrcyBmb3IgZXhwb25lbnRcclxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgICAgaWYgKHRoaXMucGVlaygpID09PSBcIi1cIiB8fCB0aGlzLnBlZWsoKSA9PT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xyXG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcclxuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcclxuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcclxuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XHJcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlW2NhcGl0YWxpemVkXSwgdmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRUb2tlbigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcclxuICAgIHN3aXRjaCAoY2hhcikge1xyXG4gICAgICBjYXNlIFwiKFwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIpXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiXVwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJ7XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIn1cIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIixcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCI7XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIl5cIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIkXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG9sbGFyLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIiNcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIjpcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIipcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIiVcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInxcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDogVG9rZW5UeXBlLlBpcGUsIG51bGwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiJlwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCI+XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcclxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIhXCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcclxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbCA6IFRva2VuVHlwZS5CYW5nLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCI/XCI6XHJcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcclxuICAgICAgICAgIHRoaXMubWF0Y2goXCI/XCIpXHJcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cclxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvbkRvdFxyXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcclxuICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiPVwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5FcXVhbEVxdWFsXHJcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj5cIilcclxuICAgICAgICAgICAgPyBUb2tlblR5cGUuQXJyb3dcclxuICAgICAgICAgICAgOiBUb2tlblR5cGUuRXF1YWwsXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIitcIjpcclxuICAgICAgICB0aGlzLmFkZFRva2VuKFxyXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcclxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcclxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcclxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcclxuICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxyXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXHJcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcclxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxyXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcclxuICAgICAgICAgIG51bGxcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxyXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXHJcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxyXG4gICAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3NFcXVhbFxyXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIuXCI6XHJcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiL1wiOlxyXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xyXG4gICAgICAgICAgdGhpcy5jb21tZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xyXG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXHJcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXHJcbiAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGAnYDpcclxuICAgICAgY2FzZSBgXCJgOlxyXG4gICAgICBjYXNlIFwiYFwiOlxyXG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAvLyBpZ25vcmUgY2FzZXNcclxuICAgICAgY2FzZSBcIlxcblwiOlxyXG4gICAgICBjYXNlIFwiIFwiOlxyXG4gICAgICBjYXNlIFwiXFxyXCI6XHJcbiAgICAgIGNhc2UgXCJcXHRcIjpcclxuICAgICAgICBicmVhaztcclxuICAgICAgLy8gY29tcGxleCBjYXNlc1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XHJcbiAgICAgICAgICB0aGlzLm51bWJlcigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xyXG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2NoYXJ9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYW4gRXJyb3IgKCR7dGhpcy5saW5lfToke3RoaXMuY29sfSkgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50cmllcz86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRyaWVzID8gZW50cmllcyA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50cmllcz86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcyA9IGVudHJpZXMgPyBlbnRyaWVzIDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93W2tleSBhcyBrZXlvZiB0eXBlb2Ygd2luZG93XTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgS2FzcGVyQXBwIH0gZnJvbSBcIi4va2FzcGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XG4gIF92YWx1ZTogYW55O1xuICBlbnRpdHk6IEthc3BlckFwcDtcbiAgcmVuZGVyOiAoZW50aXR5OiBhbnkpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbDogYW55LCBlbnRpdHk6IEthc3BlckFwcCkge1xuICAgIHRoaXMuX3ZhbHVlID0gaW5pdGlhbDtcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmVudGl0eS4kY2hhbmdlcyArPSAxO1xuICAgIHRoaXMuZW50aXR5LiRkb1JlbmRlcigpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcbmltcG9ydCB7IFNlbGZDbG9zaW5nVGFncywgV2hpdGVTcGFjZXMgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIge1xuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgcHVibGljIGVycm9yczogc3RyaW5nW107XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIHRoaXMubm9kZXMgPSBbXTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBLYXNwZXJFcnJvcikge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYFBhcnNlIEVycm9yICgke2UubGluZX06JHtlLmNvbH0pID0+ICR7ZS52YWx1ZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiUGFyc2UgRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc291cmNlID0gXCJcIjtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gY2hhci5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoZW9mRXJyb3I6IHN0cmluZyA9IFwiXCIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFwiXFxuXCIpKSB7XG4gICAgICAgIHRoaXMubGluZSArPSAxO1xuICAgICAgICB0aGlzLmNvbCA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbCArPSAxO1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7ZW9mRXJyb3J9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2soY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IobWVzc2FnZSwgdGhpcy5saW5lLCB0aGlzLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIG5vZGUoKTogTm9kZS5LTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuS05vZGU7XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNvbW1lbnQgY2xvc2luZyAnLS0+J1wiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMyk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkNvbW1lbnQoY29tbWVudCwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXCIvPlwiKSB8fFxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIFtdLCB0cnVlLCB0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5wZWVrKFwiPC9cIikpIHtcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbihuYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKG5hbWUpO1xuICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuLCBmYWxzZSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoaWxkcmVuKHBhcmVudDogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke3BhcmVudH0+YCk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKFwiQmxhbmsgYXR0cmlidXRlIG5hbWVcIik7XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiJ1wiKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoXCInXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goJ1wiJykpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nKCdcIicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgTm9kZS5BdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGxpbmUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIHRleHQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIjxcIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCkudHJpbSgpO1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRleHQsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSB3aGl0ZXNwYWNlKCk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzLCAuLi5jbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKS50cmltKCk7XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhjbG9zaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5tYXRjaChjbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBJZkVsc2VOb2RlID0gW0tOb2RlLkVsZW1lbnQsIEtOb2RlLkF0dHJpYnV0ZV07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwaWxlKFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVudHJpZXM/OiBvYmplY3QsXG4gICAgY29udGFpbmVyPzogSFRNTEVsZW1lbnRcbiAgKTogTm9kZSB7XG4gICAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJrYXNwZXJcIik7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudHJpZXMpO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGNvbnRhaW5lcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgcmVnZXggPSAvXFx7XFx7LitcXH1cXH0vbXM7XG4gICAgbGV0IHRleHQ6IFRleHQ7XG4gICAgaWYgKHJlZ2V4LnRlc3Qobm9kZS52YWx1ZSkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG5vZGUudmFsdWUucmVwbGFjZShcbiAgICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZS52YWx1ZSk7XG4gICAgfVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIGF0dHIudmFsdWUgPSBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIChwYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tbWVudChub2RlLnZhbHVlKTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbmRBdHRyKFxuICAgIG5vZGU6IEtOb2RlLkVsZW1lbnQsXG4gICAgbmFtZTogc3RyaW5nW11cbiAgKTogS05vZGUuQXR0cmlidXRlIHwgbnVsbCB7XG4gICAgaWYgKCFub2RlIHx8ICFub2RlLmF0dHJpYnV0ZXMgfHwgIW5vZGUuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYiA9IG5vZGUuYXR0cmlidXRlcy5maW5kKChhdHRyKSA9PlxuICAgICAgbmFtZS5pbmNsdWRlcygoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUpXG4gICAgKTtcbiAgICBpZiAoYXR0cmliKSB7XG4gICAgICByZXR1cm4gYXR0cmliIGFzIEtOb2RlLkF0dHJpYnV0ZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGRvSWYoZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSwgcGFyZW50OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICBpZiAoJGlmKSB7XG4gICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvbnNbMF1bMF0sIHBhcmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEsIGV4cHJlc3Npb25zLmxlbmd0aCkpIHtcbiAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgY29uc3QgJGVsc2VpZiA9IHRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvblsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgaWYgKCRlbHNlaWYpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgcGFyZW50KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VcIl0pKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBwYXJlbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2goZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbigoZWFjaCBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgY29uc3Qgc2NvcGU6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBzY29wZVtrZXldID0gaW5kZXg7XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlKTtcbiAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gIH1cblxuICBwcml2YXRlIGRvV2hpbGUoJHdoaWxlOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSk7XG4gICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gIH1cblxuICBwcml2YXRlIGRvTGV0KGluaXQ6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVNpYmxpbmdzKG5vZGVzOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSAwO1xuICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZXNbY3VycmVudCsrXTtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgIGNvbnN0ICRlYWNoID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlYWNoXCJdKTtcbiAgICAgICAgaWYgKCRlYWNoKSB7XG4gICAgICAgICAgdGhpcy5kb0VhY2goJGVhY2gsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAaWZcIl0pO1xuICAgICAgICBpZiAoJGlmKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbbm9kZSBhcyBLTm9kZS5FbGVtZW50LCAkaWZdXTtcbiAgICAgICAgICBjb25zdCB0YWcgPSAobm9kZSBhcyBLTm9kZS5FbGVtZW50KS5uYW1lO1xuICAgICAgICAgIGxldCBmb3VuZCA9IHRydWU7XG5cbiAgICAgICAgICB3aGlsZSAoZm91bmQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50ID49IG5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxuICAgICAgICAgICAgICBcIkBlbHNlaWZcIixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKChub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50KS5uYW1lID09PSB0YWcgJiYgYXR0cikge1xuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKFtub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBhdHRyXSk7XG4gICAgICAgICAgICAgIGN1cnJlbnQgKz0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJHdoaWxlID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkB3aGlsZVwiXSk7XG4gICAgICAgIGlmICgkd2hpbGUpIHtcbiAgICAgICAgICB0aGlzLmRvV2hpbGUoJHdoaWxlLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkbGV0ID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBsZXRcIl0pO1xuICAgICAgICBpZiAoJGxldCkge1xuICAgICAgICAgIHRoaXMuZG9MZXQoJGxldCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBpc1RlbXBsYXRlID0gbm9kZS5uYW1lID09PSBcImt2b2lkXCI7XG4gICAgY29uc3QgZWxlbWVudCA9IGlzVGVtcGxhdGUgPyBwYXJlbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSk7XG5cbiAgICBpZiAoIWlzVGVtcGxhdGUpIHtcbiAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICB9XG4gICAgICAvLyBhdHRyaWJ1dGVzXG4gICAgICBub2RlLmF0dHJpYnV0ZXNcbiAgICAgICAgLmZpbHRlcigoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKSlcbiAgICAgICAgLm1hcCgoYXR0cikgPT4gdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc2VsZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZS5jaGlsZHJlbiwgZWxlbWVudCk7XG5cbiAgICBpZiAoIWlzVGVtcGxhdGUgJiYgcGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQ6IE5vZGUsIGF0dHI6IEtOb2RlLkF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIGNvbnN0IHR5cGUgPSBhdHRyLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgIGNvbnN0IGN1cnJlbnRTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsICgpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBjdXJyZW50U2NvcGUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcblxuICAgIGlmICh0aGlzLnBhcnNlci5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmVycm9yKGBUZW1wbGF0ZSBzdHJpbmcgIGVycm9yOiAke3RoaXMucGFyc2VyLmVycm9yc1swXX1gKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSBgJHt0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pfWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3Ige1xuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEFzc2lnbik6IFI7XG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEJpbmFyeSk6IFI7XG4gICAgdmlzaXRDYWxsRXhwcihleHByOiBDYWxsKTogUjtcbiAgICB2aXNpdERlYnVnRXhwcihleHByOiBEZWJ1Zyk6IFI7XG4gICAgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBEaWN0aW9uYXJ5KTogUjtcbiAgICB2aXNpdEVhY2hFeHByKGV4cHI6IEVhY2gpOiBSO1xuICAgIHZpc2l0R2V0RXhwcihleHByOiBHZXQpOiBSO1xuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEdyb3VwaW5nKTogUjtcbiAgICB2aXNpdEtleUV4cHIoZXhwcjogS2V5KTogUjtcbiAgICB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IExvZ2ljYWwpOiBSO1xuICAgIHZpc2l0TGlzdEV4cHIoZXhwcjogTGlzdCk6IFI7XG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByOiBMaXRlcmFsKTogUjtcbiAgICB2aXNpdE5ld0V4cHIoZXhwcjogTmV3KTogUjtcbiAgICB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBOdWxsQ29hbGVzY2luZyk6IFI7XG4gICAgdmlzaXRQb3N0Zml4RXhwcihleHByOiBQb3N0Zml4KTogUjtcbiAgICB2aXNpdFNldEV4cHIoZXhwcjogU2V0KTogUjtcbiAgICB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBUZW1wbGF0ZSk6IFI7XG4gICAgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBUZXJuYXJ5KTogUjtcbiAgICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mKTogUjtcbiAgICB2aXNpdFVuYXJ5RXhwcihleHByOiBVbmFyeSk6IFI7XG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogVmFyaWFibGUpOiBSO1xuICAgIHZpc2l0Vm9pZEV4cHIoZXhwcjogVm9pZCk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFzc2lnbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Bc3NpZ24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQmluYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjYWxsZWU6IEV4cHI7XG4gICAgcHVibGljIHBhcmVuOiBUb2tlbjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FsbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5DYWxsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWJ1Z0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EZWJ1Zyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcHJvcGVydGllczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREaWN0aW9uYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRpY3Rpb25hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFYWNoIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBrZXk6IFRva2VuO1xuICAgIHB1YmxpYyBpdGVyYWJsZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBrZXk6IFRva2VuLCBpdGVyYWJsZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLml0ZXJhYmxlID0gaXRlcmFibGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWFjaEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5FYWNoJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdHlwZTogVG9rZW5UeXBlLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5HZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cGluZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R3JvdXBpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR3JvdXBpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLZXkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0S2V5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLktleSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2ljYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMb2dpY2FsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxvZ2ljYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpc3RFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGlzdCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXRlcmFsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmV3IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNsYXp6OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY2xheno6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsYXp6ID0gY2xheno7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmV3RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk5ldyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxDb2FsZXNjaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbENvYWxlc2NpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTnVsbENvYWxlc2NpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0Zml4IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBpbmNyZW1lbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBvc3RmaXhFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUG9zdGZpeCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVtcGxhdGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVtcGxhdGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXJuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogRXhwcjtcbiAgICBwdWJsaWMgdGhlbkV4cHI6IEV4cHI7XG4gICAgcHVibGljIGVsc2VFeHByOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBFeHByLCB0aGVuRXhwcjogRXhwciwgZWxzZUV4cHI6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuRXhwciA9IHRoZW5FeHByO1xuICAgICAgICB0aGlzLmVsc2VFeHByID0gZWxzZUV4cHI7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVybmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZXJuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHlwZW9mIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHlwZW9mRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlR5cGVvZic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJpYWJsZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5WYXJpYWJsZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZvaWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWb2lkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZvaWQnO1xuICB9XG59XG5cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAvLyBQYXJzZXIgVG9rZW5zXHJcbiAgRW9mLFxyXG4gIFBhbmljLFxyXG5cclxuICAvLyBTaW5nbGUgQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFtcGVyc2FuZCxcclxuICBBdFNpZ24sXHJcbiAgQ2FyZXQsXHJcbiAgQ29tbWEsXHJcbiAgRG9sbGFyLFxyXG4gIERvdCxcclxuICBIYXNoLFxyXG4gIExlZnRCcmFjZSxcclxuICBMZWZ0QnJhY2tldCxcclxuICBMZWZ0UGFyZW4sXHJcbiAgUGVyY2VudCxcclxuICBQaXBlLFxyXG4gIFJpZ2h0QnJhY2UsXHJcbiAgUmlnaHRCcmFja2V0LFxyXG4gIFJpZ2h0UGFyZW4sXHJcbiAgU2VtaWNvbG9uLFxyXG4gIFNsYXNoLFxyXG4gIFN0YXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFycm93LFxyXG4gIEJhbmcsXHJcbiAgQmFuZ0VxdWFsLFxyXG4gIENvbG9uLFxyXG4gIEVxdWFsLFxyXG4gIEVxdWFsRXF1YWwsXHJcbiAgR3JlYXRlcixcclxuICBHcmVhdGVyRXF1YWwsXHJcbiAgTGVzcyxcclxuICBMZXNzRXF1YWwsXHJcbiAgTWludXMsXHJcbiAgTWludXNFcXVhbCxcclxuICBNaW51c01pbnVzLFxyXG4gIFBlcmNlbnRFcXVhbCxcclxuICBQbHVzLFxyXG4gIFBsdXNFcXVhbCxcclxuICBQbHVzUGx1cyxcclxuICBRdWVzdGlvbixcclxuICBRdWVzdGlvbkRvdCxcclxuICBRdWVzdGlvblF1ZXN0aW9uLFxyXG4gIFNsYXNoRXF1YWwsXHJcbiAgU3RhckVxdWFsLFxyXG4gIERvdERvdCxcclxuICBEb3REb3REb3QsXHJcbiAgTGVzc0VxdWFsR3JlYXRlcixcclxuXHJcbiAgLy8gTGl0ZXJhbHNcclxuICBJZGVudGlmaWVyLFxyXG4gIFRlbXBsYXRlLFxyXG4gIFN0cmluZyxcclxuICBOdW1iZXIsXHJcblxyXG4gIC8vIEtleXdvcmRzXHJcbiAgQW5kLFxyXG4gIENvbnN0LFxyXG4gIERlYnVnLFxyXG4gIEZhbHNlLFxyXG4gIEluc3RhbmNlb2YsXHJcbiAgTmV3LFxyXG4gIE51bGwsXHJcbiAgVW5kZWZpbmVkLFxyXG4gIE9mLFxyXG4gIE9yLFxyXG4gIFRydWUsXHJcbiAgVHlwZW9mLFxyXG4gIFZvaWQsXHJcbiAgV2l0aCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XHJcbiAgcHVibGljIGxpdGVyYWw6IGFueTtcclxuICBwdWJsaWMgbGV4ZW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHlwZTogVG9rZW5UeXBlLFxyXG4gICAgbGV4ZW1lOiBzdHJpbmcsXHJcbiAgICBsaXRlcmFsOiBhbnksXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2w6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5uYW1lID0gVG9rZW5UeXBlW3R5cGVdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGV4ZW1lID0gbGV4ZW1lO1xyXG4gICAgdGhpcy5saXRlcmFsID0gbGl0ZXJhbDtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiBgWygke3RoaXMubGluZX0pOlwiJHt0aGlzLmxleGVtZX1cIl1gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIgaW1wbGVtZW50cyBLTm9kZS5LTm9kZVZpc2l0b3I8c3RyaW5nPiB7XHJcbiAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbm9kZS5hY2NlcHQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdHJhbnNwaWxlKG5vZGVzOiBLTm9kZS5LTm9kZVtdKTogc3RyaW5nW10ge1xyXG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5ldmFsdWF0ZShub2RlKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGAke2V9YCk7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xyXG4gICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAxMDApIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQpOiBzdHJpbmcge1xyXG4gICAgbGV0IGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzLm1hcCgoYXR0cikgPT4gdGhpcy5ldmFsdWF0ZShhdHRyKSkuam9pbihcIiBcIik7XHJcbiAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XHJcbiAgICAgIGF0dHJzID0gXCIgXCIgKyBhdHRycztcclxuICAgIH1cclxuXHJcbiAgICBpZiAobm9kZS5zZWxmKSB7XHJcbiAgICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9Lz5gO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbi5tYXAoKGVsbSkgPT4gdGhpcy5ldmFsdWF0ZShlbG0pKS5qb2luKFwiXCIpO1xyXG4gICAgcmV0dXJuIGA8JHtub2RlLm5hbWV9JHthdHRyc30+JHtjaGlsZHJlbn08LyR7bm9kZS5uYW1lfT5gO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlKTogc3RyaW5nIHtcclxuICAgIGlmIChub2RlLnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBgJHtub2RlLm5hbWV9PVwiJHtub2RlLnZhbHVlfVwiYDtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLm5hbWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRUZXh0S05vZGUobm9kZTogS05vZGUuVGV4dCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbm9kZS52YWx1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCEtLSAke25vZGUudmFsdWV9IC0tPmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhZG9jdHlwZSAke25vZGUudmFsdWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBWaWV3ZXIgfSBmcm9tIFwiLi92aWV3ZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5cbmZ1bmN0aW9uIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgaWYgKHBhcnNlci5lcnJvcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcnNlci5lcnJvcnMpO1xuICB9XG4gIGNvbnN0IHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnRcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKCk7XG4gIGNvbnN0IHJlc3VsdCA9IHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBlbnRpdHksIGNvbnRhaW5lcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHJlbmRlcihlbnRpdHk6IGFueSk6IHZvaWQge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJrYXNwZXIgcmVxdWlyZXMgYSBicm93c2VyIGVudmlyb25tZW50IHRvIHJlbmRlciB0ZW1wbGF0ZXMuXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGVtcGxhdGVcIilbMF07XG4gIGlmICghdGVtcGxhdGUpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiTm8gdGVtcGxhdGUgZm91bmQgaW4gdGhlIGRvY3VtZW50LlwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImthc3BlclwiKTtcbiAgaWYgKGNvbnRhaW5lci5sZW5ndGgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGNvbnRhaW5lclswXSk7XG4gIH1cbiAgY29uc3Qgbm9kZSA9IHRyYW5zcGlsZSh0ZW1wbGF0ZS5pbm5lckhUTUwsIGVudGl0eSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBLYXNwZXJBcHAge1xuICAkc3RhdGUgPSAoaW5pdGlhbDogYW55KSA9PiBuZXcgU3RhdGUoaW5pdGlhbCwgdGhpcyk7XG4gICRjaGFuZ2VzID0gMTtcbiAgJGRpcnR5ID0gZmFsc2U7XG4gICRkb1JlbmRlciA9ICgpID0+IHtcbiAgICBpZiAodHlwZW9mIHRoaXMuJG9uQ2hhbmdlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLiRvbkNoYW5nZXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuJGNoYW5nZXMgPiAwICYmICF0aGlzLiRkaXJ0eSkge1xuICAgICAgdGhpcy4kZGlydHkgPSB0cnVlO1xuICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICByZW5kZXIodGhpcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuJGNoYW5nZXMpO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuJG9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB0aGlzLiRvblJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGRpcnR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGNoYW5nZXMgPSAwO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICAkb25Jbml0ID0gKCkgPT4ge307XG4gICRvblJlbmRlciA9ICgpID0+IHt9O1xuICAkb25DaGFuZ2VzID0gKCkgPT4ge307XG59XG5cbmZ1bmN0aW9uIEthc3Blcihpbml0aWFsaXplcjogYW55KSB7XG4gIGNvbnN0IGVudGl0eSA9IG5ldyBpbml0aWFsaXplcigpO1xuICBlbnRpdHkuJGRvUmVuZGVyKCk7XG4gIGlmICh0eXBlb2YgZW50aXR5LiRvbkluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGVudGl0eS4kb25Jbml0KCk7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgKCh3aW5kb3cgYXMgYW55KSB8fCB7fSkua2FzcGVyID0ge1xuICAgIGV4ZWN1dGUsXG4gICAgdHJhbnNwaWxlLFxuICB9O1xuICAod2luZG93IGFzIGFueSlbXCJLYXNwZXJcIl0gPSBLYXNwZXI7XG4gICh3aW5kb3cgYXMgYW55KVtcIkthc3BlckFwcFwiXSA9IEthc3BlckFwcDtcbn0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZXhwb3J0cy5rYXNwZXIgPSB7XG4gICAgRXhwcmVzc2lvblBhcnNlcixcbiAgICBJbnRlcnByZXRlcixcbiAgICBTY2FubmVyLFxuICAgIFRlbXBsYXRlUGFyc2VyLFxuICAgIFRyYW5zcGlsZXIsXG4gICAgVmlld2VyLFxuICB9O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9