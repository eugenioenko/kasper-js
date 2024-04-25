/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/component.ts":
/*!**************************!*\
  !*** ./src/component.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component)
/* harmony export */ });
class Component {
    constructor(props) {
        this.args = {};
        this.$onInit = () => { };
        this.$onRender = () => { };
        this.$onChanges = () => { };
        this.$onDestroy = () => { };
        if (!props) {
            this.args = {};
            return;
        }
        if (props.args) {
            this.args = props.args || {};
        }
        if (props.ref) {
            this.ref = props.ref;
        }
        if (props.transpiler) {
            this.transpiler = props.transpiler;
        }
    }
    $doRender() {
        if (!this.transpiler) {
            return;
        }
        //this.transpiler?.createComponent(this);
    }
}


/***/ }),

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

/***/ "./src/kasper.ts":
/*!***********************!*\
  !*** ./src/kasper.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Kasper: () => (/* binding */ Kasper),
/* harmony export */   KasperInit: () => (/* binding */ KasperInit),
/* harmony export */   KasperRenderer: () => (/* binding */ KasperRenderer),
/* harmony export */   KasperState: () => (/* binding */ KasperState),
/* harmony export */   execute: () => (/* binding */ execute),
/* harmony export */   kasperState: () => (/* binding */ kasperState),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   transpile: () => (/* binding */ transpile)
/* harmony export */ });
/* harmony import */ var _template_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-parser */ "./src/template-parser.ts");
/* harmony import */ var _transpiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transpiler */ "./src/transpiler.ts");


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
    const transpiler = new _transpiler__WEBPACK_IMPORTED_MODULE_1__.Transpiler();
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
    const container = document.getElementsByTagName("kasper-app");
    const node = transpile(template.innerHTML, entity, container[0]);
    document.body.appendChild(node);
}
class KasperRenderer {
    constructor() {
        this.entity = undefined;
        this.changes = 1;
        this.dirty = false;
        this.render = () => {
            this.changes += 1;
            if (!this.entity) {
                // do not render if entity is not set
                return;
            }
            if (typeof this.entity?.$onChanges === "function") {
                this.entity.$onChanges();
            }
            if (this.changes > 0 && !this.dirty) {
                this.dirty = true;
                queueMicrotask(() => {
                    render(this.entity);
                    // console.log(this.changes);
                    if (typeof this.entity?.$onRender === "function") {
                        this.entity.$onRender();
                    }
                    this.dirty = false;
                    this.changes = 0;
                });
            }
        };
    }
}
let renderer = new KasperRenderer();
class KasperState {
    constructor(initial) {
        this._value = initial;
    }
    get value() {
        return this._value;
    }
    set(value) {
        this._value = value;
        renderer.render();
    }
    toString() {
        return this._value.toString();
    }
}
function kasperState(initial) {
    return new KasperState(initial);
}
function Kasper(Component) {
    const entity = new Component();
    renderer.entity = entity;
    renderer.render();
    // entity.$doRender();
    if (typeof entity.$onInit === "function") {
        entity.$onInit();
    }
}
function createComponent(transpiler, tag, registry) {
    const element = document.createElement(tag);
    const component = new registry[tag].component();
    component.$onInit();
    const nodes = registry[tag].nodes;
    return transpiler.transpile(nodes, component, element);
}
function normalizeRegistry(registry, parser) {
    const result = { ...registry };
    for (const key of Object.keys(registry)) {
        const entry = registry[key];
        entry.template = document.querySelector(entry.selector);
        entry.nodes = parser.parse(entry.template.innerHTML);
    }
    return result;
}
function KasperInit(config) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__.TemplateParser();
    const root = document.querySelector(config.root || "body");
    const registry = normalizeRegistry(config.registry, parser);
    const transpiler = new _transpiler__WEBPACK_IMPORTED_MODULE_1__.Transpiler({ registry });
    const entryTag = config.entry || "kasper-app";
    const htmlNodes = createComponent(transpiler, entryTag, registry);
    root.appendChild(htmlNodes);
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
                if (this.match("=")) {
                    this.addToken(this.match("=") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.EqualEqual : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.EqualEqual, null);
                    break;
                }
                this.addToken(this.match(">") ? _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Arrow : _types_token__WEBPACK_IMPORTED_MODULE_1__.TokenType.Equal, null);
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
    constructor(parent, entity) {
        this.parent = parent ? parent : null;
        this.values = entity ? entity : {};
    }
    init(entity) {
        this.values = entity ? entity : {};
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
    constructor(options) {
        this.scanner = new _scanner__WEBPACK_IMPORTED_MODULE_2__.Scanner();
        this.parser = new _expression_parser__WEBPACK_IMPORTED_MODULE_0__.ExpressionParser();
        this.interpreter = new _interpreter__WEBPACK_IMPORTED_MODULE_1__.Interpreter();
        this.errors = [];
        this.registry = {};
        if (!options) {
            return;
        }
        if (options.registry) {
            this.registry = options.registry;
        }
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
    transpile(nodes, entity, container) {
        container.innerHTML = "";
        this.interpreter.scope.init(entity);
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
        const content = this.evaluateTemplateString(node.value);
        const text = document.createTextNode(content);
        if (parent) {
            parent.appendChild(text);
        }
    }
    visitAttributeKNode(node, parent) {
        const attr = document.createAttribute(node.name);
        if (node.value) {
            attr.value = this.evaluateTemplateString(node.value);
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
        const element = this.createElement(node, parent);
        this.interpreter.scope.set("$ref", element);
        this.execute(init.value);
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
        const isVoid = node.name === "void";
        const isComponent = !!this.registry[node.name];
        const element = isVoid ? parent : document.createElement(node.name);
        const restoreScope = this.interpreter.scope;
        if (isComponent) {
            // create a new instance of the component and set it as the current scope
            let component = {};
            const argsAttr = node.attributes.filter((attr) => attr.name.startsWith("@:"));
            const args = this.createComponentArgs(argsAttr);
            if (this.registry[node.name]?.component) {
                const ref = element;
                const transpiler = this;
                component = new this.registry[node.name].component({
                    args,
                    ref,
                    transpiler,
                });
            }
            this.interpreter.scope = new _scope__WEBPACK_IMPORTED_MODULE_3__.Scope(restoreScope, component);
            // create the children of the component
            this.createSiblings(this.registry[node.name].nodes, element);
        }
        if (!isVoid) {
            // event binding
            const events = node.attributes.filter((attr) => attr.name.startsWith("@on:"));
            for (const event of events) {
                this.createEventListener(element, event);
            }
            // attributes
            const attributes = node.attributes.filter((attr) => !attr.name.startsWith("@"));
            for (const attr of attributes) {
                this.evaluate(attr, element);
            }
        }
        if (node.self) {
            return element;
        }
        this.createSiblings(node.children, element);
        this.interpreter.scope = restoreScope;
        if (!isVoid && parent) {
            parent.appendChild(element);
        }
        return element;
    }
    createComponentArgs(args) {
        if (!args.length) {
            return {};
        }
        const result = {};
        for (const arg of args) {
            const key = arg.name.split(":")[1];
            result[key] = this.evaluateTemplateString(arg.value);
        }
        return result;
    }
    createEventListener(element, attr) {
        const type = attr.name.split(":")[1];
        const listenerScope = new _scope__WEBPACK_IMPORTED_MODULE_3__.Scope(this.interpreter.scope);
        element.addEventListener(type, (event) => {
            listenerScope.set("$event", event);
            this.execute(attr.value, listenerScope);
        });
    }
    evaluateTemplateString(text) {
        if (!text) {
            return text;
        }
        const regex = /\{\{.+\}\}/ms;
        if (regex.test(text)) {
            return text.replace(/\{\{([\s\S]+?)\}\}/g, (m, placeholder) => {
                return this.evaluateExpression(placeholder);
            });
        }
        return text;
    }
    evaluateExpression(source) {
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
    return ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "$");
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
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component.ts");
/* harmony import */ var _expression_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression-parser */ "./src/expression-parser.ts");
/* harmony import */ var _interpreter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter */ "./src/interpreter.ts");
/* harmony import */ var _kasper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./kasper */ "./src/kasper.ts");
/* harmony import */ var _scanner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scanner */ "./src/scanner.ts");
/* harmony import */ var _template_parser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./template-parser */ "./src/template-parser.ts");
/* harmony import */ var _transpiler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transpiler */ "./src/transpiler.ts");
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./viewer */ "./src/viewer.ts");








if (typeof window !== "undefined") {
    (window || {}).kasper = {
        execute: _kasper__WEBPACK_IMPORTED_MODULE_3__.execute,
        transpile: _kasper__WEBPACK_IMPORTED_MODULE_3__.transpile,
        App: _kasper__WEBPACK_IMPORTED_MODULE_3__.KasperInit,
    };
    window["Kasper"] = _kasper__WEBPACK_IMPORTED_MODULE_3__.Kasper;
    window["Component"] = _component__WEBPACK_IMPORTED_MODULE_0__.Component;
    window["$state"] = _kasper__WEBPACK_IMPORTED_MODULE_3__.kasperState;
}
else if (typeof exports !== "undefined") {
    exports.kasper = {
        ExpressionParser: _expression_parser__WEBPACK_IMPORTED_MODULE_1__.ExpressionParser,
        Interpreter: _interpreter__WEBPACK_IMPORTED_MODULE_2__.Interpreter,
        Scanner: _scanner__WEBPACK_IMPORTED_MODULE_4__.Scanner,
        TemplateParser: _template_parser__WEBPACK_IMPORTED_MODULE_5__.TemplateParser,
        Transpiler: _transpiler__WEBPACK_IMPORTED_MODULE_6__.Transpiler,
        Viewer: _viewer__WEBPACK_IMPORTED_MODULE_7__.Viewer,
    };
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bURBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsSUFBSSxFQUN0RCxJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsT0FBTyxFQUM1RCxJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyRSxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsU0FBUyxFQUNyRCxJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsT0FBTyxFQUM1RCxJQUFJLENBQ0wsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbURBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLG1EQUFTLENBQUMsSUFBSSxFQUN0RCxJQUFJLENBQ0wsQ0FBQztnQkFDRixN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Iiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL2NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvZXhwcmVzc2lvbi1wYXJzZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL2ludGVycHJldGVyLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy9rYXNwZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3NjYW5uZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3Njb3BlLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy90ZW1wbGF0ZS1wYXJzZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3RyYW5zcGlsZXIudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3R5cGVzL2Vycm9yLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvdHlwZXMvbm9kZXMudHMiLCJ3ZWJwYWNrOi8va2FzcGVyLWpzLy4vc3JjL3R5cGVzL3Rva2VuLnRzIiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9rYXNwZXItanMvLi9zcmMvdmlld2VyLnRzIiwid2VicGFjazovL2thc3Blci1qcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9rYXNwZXItanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2thc3Blci1qcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2thc3Blci1qcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2thc3Blci1qcy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS05vZGUgfSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50QXJncyB7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcbiAgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbiAgJG9uSW5pdCA9ICgpID0+IHt9O1xuICAkb25SZW5kZXIgPSAoKSA9PiB7fTtcbiAgJG9uQ2hhbmdlcyA9ICgpID0+IHt9O1xuICAkb25EZXN0cm95ID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgJGRvUmVuZGVyKCkge1xuICAgIGlmICghdGhpcy50cmFuc3BpbGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdGhpcy50cmFuc3BpbGVyPy5jcmVhdGVDb21wb25lbnQodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgS2FzcGVyRW50aXR5ID0gQ29tcG9uZW50IHwgUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIENvbXBvbmVudENsYXNzID0geyBuZXcgKGFyZ3M/OiBDb21wb25lbnRBcmdzKTogQ29tcG9uZW50IH07XG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFJlZ2lzdHJ5IHtcbiAgW3RhZ05hbWU6IHN0cmluZ106IHtcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU6IEVsZW1lbnQ7XG4gICAgbm9kZXM6IEtOb2RlW107XG4gIH07XG59XG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW107XG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xuICBwdWJsaWMgZXJyb3JMZXZlbCA9IDE7XG5cbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgY29uc3QgZXhwcmVzc2lvbnM6IEV4cHIuRXhwcltdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBLYXNwZXJFcnJvcikge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYFBhcnNlIEVycm9yICgke2UubGluZX06JHtlLmNvbH0pID0+ICR7ZS52YWx1ZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIlBhcnNlIEVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25zO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN5bmNocm9uaXplKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBUb2tlbiB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XG4gIH1cblxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09PSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvcihcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgbWVzc2FnZSArIGAsIHVuZXhwZWN0ZWQgdG9rZW4gXCIke3RoaXMucGVlaygpLmxleGVtZX1cImBcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcih0b2tlbjogVG9rZW4sIG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5TZW1pY29sb24pIHx8IHRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9IHdoaWxlICghdGhpcy5lb2YoKSk7XG4gIH1cblxuICBwdWJsaWMgZm9yZWFjaCh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHIge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcblxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3RlZCBhbiBpZGVudGlmaWVyIGluc2lkZSBcImVhY2hcIiBzdGF0ZW1lbnRgXG4gICAgKTtcblxuICAgIGxldCBrZXk6IFRva2VuID0gbnVsbDtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcbiAgICAgIGtleSA9IHRoaXMuY29uc3VtZShcbiAgICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuT2YsXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICk7XG4gICAgY29uc3QgaXRlcmFibGUgPSB0aGlzLmV4cHJlc3Npb24oKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5FYWNoKG5hbWUsIGtleSwgaXRlcmFibGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGV4cHJlc3Npb24oKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByZXNzaW9uOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xuICAgICAgLy8gY29uc3VtZSBhbGwgc2VtaWNvbG9uc1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge31cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIGFzc2lnbm1lbnQoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU3RhckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU2xhc2hFcXVhbFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgbGV0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICAgIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICBjb25zdCBuYW1lOiBUb2tlbiA9IGV4cHIubmFtZTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuVmFyaWFibGUobmFtZSwgbmFtZS5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuQXNzaWduKG5hbWUsIHZhbHVlLCBuYW1lLmxpbmUpO1xuICAgICAgfSBlbHNlIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuR2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgZXhwci50eXBlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5TZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCB2YWx1ZSwgZXhwci5saW5lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXJyb3Iob3BlcmF0b3IsIGBJbnZhbGlkIGwtdmFsdWUsIGlzIG5vdCBhbiBhc3NpZ25pbmcgdGFyZ2V0LmApO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5Db2xvbiwgYEV4cGVjdGVkIFwiOlwiIGFmdGVyIHRlcm5hcnkgPyBleHByZXNzaW9uYCk7XG4gICAgICBjb25zdCBlbHNlRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBudWxsQ29hbGVzY2luZygpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgcmlnaHRFeHByOiBFeHByLkV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbE9yKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuT3IpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5BbmQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGVxdWFsaXR5KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICB3aGlsZSAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxuICAgICAgICBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkaXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzLCBUb2tlblR5cGUuUGx1cykpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QZXJjZW50KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG11bHRpcGxpY2F0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdHlwZW9mKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuYXJ5KCk7XG4gIH1cblxuICBwcml2YXRlIHVuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5jYWxsKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2FsbCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZCA9IHRydWU7XG4gICAgZG8ge1xuICAgICAgY29uc3VtZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XG4gICAgICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcGFyZW46IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgICAgICAgVG9rZW5UeXBlLlJpZ2h0UGFyZW4sXG4gICAgICAgICAgICBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgYXJndW1lbnRzYFxuICAgICAgICAgICk7XG4gICAgICAgICAgZXhwciA9IG5ldyBFeHByLkNhbGwoZXhwciwgcGFyZW4sIGFyZ3MsIHBhcmVuLmxpbmUpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3QsIFRva2VuVHlwZS5RdWVzdGlvbkRvdCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGlkZW50aWZpZXIsIDEsIGlkZW50aWZpZXIubGluZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoaWRlbnRpZmllciwgLTEsIGlkZW50aWZpZXIubGluZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgZXhwcmVzc2lvbmApO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkdyb3VwaW5nKGV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlZvaWQpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRlYnVnKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGVidWcoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cblxuICAgIHRocm93IHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIGBFeHBlY3RlZCBleHByZXNzaW9uLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgICAvLyB1bnJlYWNoZWFibGUgY29kZVxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xuICB9XG5cbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBsZWZ0QnJhY2UgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIGBTdHJpbmcsIE51bWJlciBvciBJZGVudGlmaWVyIGV4cGVjdGVkIGFzIGEgS2V5IG9mIERpY3Rpb25hcnkgeywgdW5leHBlY3RlZCB0b2tlbiAke1xuICAgICAgICAgICAgdGhpcy5wZWVrKCkubGV4ZW1lXG4gICAgICAgICAgfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKTtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgaWYgKHRoaXMucGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFRlbXBsYXRlIHN0cmluZyAgZXJyb3I6ICR7dGhpcy5wYXJzZXIuZXJyb3JzWzBdfWApO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogRXhwci5UZW1wbGF0ZSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwci52YWx1ZS5yZXBsYWNlKFxuICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGFyc2UocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEJpbmFyeUV4cHIoZXhwcjogRXhwci5CaW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2hFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50OlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAlIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBpcGU6XG4gICAgICAgIHJldHVybiBsZWZ0IHwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DYXJldDpcbiAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXI6XG4gICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzczpcbiAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3NFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvciBcIiArIGV4cHIub3BlcmF0b3IpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKS5pc1RydXRoeSgpXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmICghbGVmdCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOlxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgTnVtYmVyKHJpZ2h0KSArIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5QbHVzUGx1cyA/IDEgOiAtMSk7XG4gICAgICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucmlnaHQubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgICAgICBleHByLnJpZ2h0LmVudGl0eSxcbiAgICAgICAgICAgIGV4cHIucmlnaHQua2V5LFxuICAgICAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgICBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAgJHtleHByLnJpZ2h0fWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoYFVua25vd24gdW5hcnkgb3BlcmF0b3IgJyArIGV4cHIub3BlcmF0b3JgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENhbGxFeHByKGV4cHI6IEV4cHIuQ2FsbCk6IGFueSB7XG4gICAgLy8gdmVyaWZ5IGNhbGxlZSBpcyBhIGZ1bmN0aW9uXG4gICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgaWYgKHR5cGVvZiBjYWxsZWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihgJHtjYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgfVxuICAgIC8vIGV2YWx1YXRlIGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIGV4cHIuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJndW1lbnQpKTtcbiAgICB9XG4gICAgLy8gZXhlY3V0ZSBmdW5jdGlvblxuICAgIGlmIChcbiAgICAgIGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQgJiZcbiAgICAgIChleHByLmNhbGxlZS5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlIHx8XG4gICAgICAgIGV4cHIuY2FsbGVlLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR3JvdXBpbmcpXG4gICAgKSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IG5ld0NhbGwgPSBleHByLmNsYXp6IGFzIEV4cHIuQ2FsbDtcbiAgICAvLyBpbnRlcm5hbCBjbGFzcyBkZWZpbml0aW9uIGluc3RhbmNlXG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKG5ld0NhbGwuY2FsbGVlKTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgYCcke2NsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBuZXdDYWxsLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLmtleSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGlmIChwYXJzZXIuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJzZXIuZXJyb3JzKTtcbiAgfVxuICBjb25zdCByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShub2Rlcyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3BpbGUoXG4gIHNvdXJjZTogc3RyaW5nLFxuICBlbnRpdHk/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LFxuICBjb250YWluZXI/OiBIVE1MRWxlbWVudFxuKTogTm9kZSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoKTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudGl0eSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihlbnRpdHk6IGFueSk6IHZvaWQge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJrYXNwZXIgcmVxdWlyZXMgYSBicm93c2VyIGVudmlyb25tZW50IHRvIHJlbmRlciB0ZW1wbGF0ZXMuXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGVtcGxhdGVcIilbMF07XG4gIGlmICghdGVtcGxhdGUpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiTm8gdGVtcGxhdGUgZm91bmQgaW4gdGhlIGRvY3VtZW50LlwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImthc3Blci1hcHBcIik7XG4gIGNvbnN0IG5vZGUgPSB0cmFuc3BpbGUoXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MLFxuICAgIGVudGl0eSxcbiAgICBjb250YWluZXJbMF0gYXMgSFRNTEVsZW1lbnRcbiAgKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2RlKTtcbn1cblxuZXhwb3J0IGNsYXNzIEthc3BlclJlbmRlcmVyIHtcbiAgZW50aXR5PzogQ29tcG9uZW50ID0gdW5kZWZpbmVkO1xuICBjaGFuZ2VzID0gMTtcbiAgZGlydHkgPSBmYWxzZTtcblxuICByZW5kZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5jaGFuZ2VzICs9IDE7XG4gICAgaWYgKCF0aGlzLmVudGl0eSkge1xuICAgICAgLy8gZG8gbm90IHJlbmRlciBpZiBlbnRpdHkgaXMgbm90IHNldFxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMuZW50aXR5Py4kb25DaGFuZ2VzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZW50aXR5LiRvbkNoYW5nZXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhbmdlcyA+IDAgJiYgIXRoaXMuZGlydHkpIHtcbiAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICByZW5kZXIodGhpcy5lbnRpdHkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYW5nZXMpO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZW50aXR5Py4kb25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHRoaXMuZW50aXR5LiRvblJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGFuZ2VzID0gMDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxubGV0IHJlbmRlcmVyID0gbmV3IEthc3BlclJlbmRlcmVyKCk7XG5cbmV4cG9ydCBjbGFzcyBLYXNwZXJTdGF0ZSB7XG4gIF92YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWw6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlID0gaW5pdGlhbDtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICByZW5kZXJlci5yZW5kZXIoKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZS50b1N0cmluZygpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrYXNwZXJTdGF0ZShpbml0aWFsOiBhbnkpOiBLYXNwZXJTdGF0ZSB7XG4gIHJldHVybiBuZXcgS2FzcGVyU3RhdGUoaW5pdGlhbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXIoQ29tcG9uZW50OiBhbnkpIHtcbiAgY29uc3QgZW50aXR5ID0gbmV3IENvbXBvbmVudCgpO1xuICByZW5kZXJlci5lbnRpdHkgPSBlbnRpdHk7XG4gIHJlbmRlcmVyLnJlbmRlcigpO1xuICAvLyBlbnRpdHkuJGRvUmVuZGVyKCk7XG4gIGlmICh0eXBlb2YgZW50aXR5LiRvbkluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGVudGl0eS4kb25Jbml0KCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIEFwcENvbmZpZyB7XG4gIHJvb3Q/OiBzdHJpbmc7XG4gIGVudHJ5Pzogc3RyaW5nO1xuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChcbiAgdHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeVxuKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZWdpc3RyeVt0YWddLmNvbXBvbmVudCgpO1xuICBjb21wb25lbnQuJG9uSW5pdCgpO1xuICBjb25zdCBub2RlcyA9IHJlZ2lzdHJ5W3RhZ10ubm9kZXM7XG4gIHJldHVybiB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgY29tcG9uZW50LCBlbGVtZW50KTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmVnaXN0cnkoXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSxcbiAgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxuKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHsgLi4ucmVnaXN0cnkgfTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocmVnaXN0cnkpKSB7XG4gICAgY29uc3QgZW50cnkgPSByZWdpc3RyeVtrZXldO1xuICAgIGVudHJ5LnRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbnRyeS5zZWxlY3Rvcik7XG4gICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UoZW50cnkudGVtcGxhdGUuaW5uZXJIVE1MKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVySW5pdChjb25maWc6IEFwcENvbmZpZykge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QgfHwgXCJib2R5XCIpO1xuICBjb25zdCByZWdpc3RyeSA9IG5vcm1hbGl6ZVJlZ2lzdHJ5KGNvbmZpZy5yZWdpc3RyeSwgcGFyc2VyKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnkgfSk7XG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuICBjb25zdCBodG1sTm9kZXMgPSBjcmVhdGVDb21wb25lbnQodHJhbnNwaWxlciwgZW50cnlUYWcsIHJlZ2lzdHJ5KTtcblxuICByb290LmFwcGVuZENoaWxkKGh0bWxOb2Rlcyk7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XG4gIC8qKiBMaXN0IG9mIGVycm9ycyBmcm9tIHNjYW5uaW5nICovXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xuICAgICAgdGhpcy5saW5lKys7XG4gICAgICB0aGlzLmNvbCA9IDA7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHRoaXMuY29sKys7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpICE9PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWtOZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcignVW50ZXJtaW5hdGVkIGNvbW1lbnQsIGV4cGVjdGluZyBjbG9zaW5nIFwiKi9cIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgY2xvc2luZyBzbGFzaCAnKi8nXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKHF1b3RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IHF1b3RlICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBVbnRlcm1pbmF0ZWQgc3RyaW5nLlxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKGBVbnRlcm1pbmF0ZWQgc3RyaW5nLCBleHBlY3RpbmcgY2xvc2luZyAke3F1b3RlfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxuICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICB0aGlzLmFkZFRva2VuKHF1b3RlICE9PSBcImBcIiA/IFRva2VuVHlwZS5TdHJpbmcgOiBUb2tlblR5cGUuVGVtcGxhdGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbnVtYmVyKCk6IHZvaWQge1xuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGZyYWN0aW9uXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcbiAgICB3aGlsZSAoVXRpbHMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcbiAgICBpZiAoVXRpbHMuaXNLZXl3b3JkKGNhcGl0YWxpemVkKSkge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGVbY2FwaXRhbGl6ZWRdLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLklkZW50aWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIltcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJdXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIntcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjtcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSGFzaCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5Db2xvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TdGFyRXF1YWwgOiBUb2tlblR5cGUuU3RhcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5QZXJjZW50RXF1YWwgOiBUb2tlblR5cGUuUGVyY2VudCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbih0aGlzLm1hdGNoKFwifFwiKSA/IFRva2VuVHlwZS5PciA6IFRva2VuVHlwZS5QaXBlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCImXCIpID8gVG9rZW5UeXBlLkFuZCA6IFRva2VuVHlwZS5BbXBlcnNhbmQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuR3JlYXRlckVxdWFsIDogVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQmFuZ0VxdWFsIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWwgOiBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNQbHVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlBsdXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIi1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXG4gICAgICAgICAgICAgID8gVG9rZW5UeXBlLkxlc3NFcXVhbEdyZWF0ZXJcbiAgICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiL1wiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi9cIikpIHtcbiAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xuICAgICAgICAgIHRoaXMubXVsdGlsaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TbGFzaEVxdWFsIDogVG9rZW5UeXBlLlNsYXNoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGAnYDpcbiAgICAgIGNhc2UgYFwiYDpcbiAgICAgIGNhc2UgXCJgXCI6XG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGlnbm9yZSBjYXNlc1xuICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgIGNhc2UgXCJcXHJcIjpcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjb21wbGV4IGNhc2VzXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdChjaGFyKSkge1xuICAgICAgICAgIHRoaXMubnVtYmVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xuICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2NoYXJ9J2ApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBTY2FuIEVycm9yICgke3RoaXMubGluZX06JHt0aGlzLmNvbH0pID0+ICR7bWVzc2FnZX1gKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgcHVibGljIHZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgcHVibGljIHBhcmVudDogU2NvcGU7XG5cbiAgY29uc3RydWN0b3IocGFyZW50PzogU2NvcGUsIGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlc1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXNba2V5XTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvd1trZXkgYXMga2V5b2YgdHlwZW9mIHdpbmRvd107XG4gIH1cbn1cbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcbmltcG9ydCB7IFNlbGZDbG9zaW5nVGFncywgV2hpdGVTcGFjZXMgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIge1xuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgcHVibGljIGVycm9yczogc3RyaW5nW107XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIHRoaXMubm9kZXMgPSBbXTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBLYXNwZXJFcnJvcikge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYFBhcnNlIEVycm9yICgke2UubGluZX06JHtlLmNvbH0pID0+ICR7ZS52YWx1ZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiUGFyc2UgRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc291cmNlID0gXCJcIjtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gY2hhci5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoZW9mRXJyb3I6IHN0cmluZyA9IFwiXCIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFwiXFxuXCIpKSB7XG4gICAgICAgIHRoaXMubGluZSArPSAxO1xuICAgICAgICB0aGlzLmNvbCA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbCArPSAxO1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7ZW9mRXJyb3J9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2soY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IobWVzc2FnZSwgdGhpcy5saW5lLCB0aGlzLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIG5vZGUoKTogTm9kZS5LTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuS05vZGU7XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNvbW1lbnQgY2xvc2luZyAnLS0+J1wiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMyk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkNvbW1lbnQoY29tbWVudCwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXCIvPlwiKSB8fFxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIFtdLCB0cnVlLCB0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5wZWVrKFwiPC9cIikpIHtcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbihuYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKG5hbWUpO1xuICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuLCBmYWxzZSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoaWxkcmVuKHBhcmVudDogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke3BhcmVudH0+YCk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKFwiQmxhbmsgYXR0cmlidXRlIG5hbWVcIik7XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiJ1wiKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoXCInXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goJ1wiJykpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nKCdcIicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgTm9kZS5BdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGxpbmUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIHRleHQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIjxcIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCkudHJpbSgpO1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRleHQsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSB3aGl0ZXNwYWNlKCk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzLCAuLi5jbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKS50cmltKCk7XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhjbG9zaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5tYXRjaChjbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBJZkVsc2VOb2RlID0gW0tOb2RlLkVsZW1lbnQsIEtOb2RlLkF0dHJpYnV0ZV07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5ID0ge307XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IHsgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5IH0pIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucmVnaXN0cnkpIHtcbiAgICAgIHRoaXMucmVnaXN0cnkgPSBvcHRpb25zLnJlZ2lzdHJ5O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBub2RlLmFjY2VwdCh0aGlzLCBwYXJlbnQpO1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0WzBdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRyYW5zcGlsZShcbiAgICBub2RlczogS05vZGUuS05vZGVbXSxcbiAgICBlbnRpdHk6IG9iamVjdCxcbiAgICBjb250YWluZXI6IEVsZW1lbnRcbiAgKTogTm9kZSB7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgY29udGFpbmVyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGAke2V9YCk7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb250ZW50KTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ciA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShub2RlLm5hbWUpO1xuICAgIGlmIChub2RlLnZhbHVlKSB7XG4gICAgICBhdHRyLnZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIChwYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tbWVudChub2RlLnZhbHVlKTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbmRBdHRyKFxuICAgIG5vZGU6IEtOb2RlLkVsZW1lbnQsXG4gICAgbmFtZTogc3RyaW5nW11cbiAgKTogS05vZGUuQXR0cmlidXRlIHwgbnVsbCB7XG4gICAgaWYgKCFub2RlIHx8ICFub2RlLmF0dHJpYnV0ZXMgfHwgIW5vZGUuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYiA9IG5vZGUuYXR0cmlidXRlcy5maW5kKChhdHRyKSA9PlxuICAgICAgbmFtZS5pbmNsdWRlcygoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUpXG4gICAgKTtcbiAgICBpZiAoYXR0cmliKSB7XG4gICAgICByZXR1cm4gYXR0cmliIGFzIEtOb2RlLkF0dHJpYnV0ZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGRvSWYoZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSwgcGFyZW50OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICBpZiAoJGlmKSB7XG4gICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvbnNbMF1bMF0sIHBhcmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEsIGV4cHJlc3Npb25zLmxlbmd0aCkpIHtcbiAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgY29uc3QgJGVsc2VpZiA9IHRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvblsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgaWYgKCRlbHNlaWYpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgcGFyZW50KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VcIl0pKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBwYXJlbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2goZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbigoZWFjaCBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgY29uc3Qgc2NvcGU6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBzY29wZVtrZXldID0gaW5kZXg7XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlKTtcbiAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gIH1cblxuICBwcml2YXRlIGRvV2hpbGUoJHdoaWxlOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSk7XG4gICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gIH1cblxuICBwcml2YXRlIGRvTGV0KGluaXQ6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICAgIHRoaXMuZXhlY3V0ZShpbml0LnZhbHVlKTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGVhY2hcIl0pO1xuICAgICAgICBpZiAoJGVhY2gpIHtcbiAgICAgICAgICB0aGlzLmRvRWFjaCgkZWFjaCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGlmID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBpZlwiXSk7XG4gICAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tub2RlIGFzIEtOb2RlLkVsZW1lbnQsICRpZl1dO1xuICAgICAgICAgIGNvbnN0IHRhZyA9IChub2RlIGFzIEtOb2RlLkVsZW1lbnQpLm5hbWU7XG4gICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgIHdoaWxlIChmb3VuZCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPj0gbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgW1xuICAgICAgICAgICAgICBcIkBlbHNlXCIsXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAoKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQpLm5hbWUgPT09IHRhZyAmJiBhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkd2hpbGUgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQHdoaWxlXCJdKTtcbiAgICAgICAgaWYgKCR3aGlsZSkge1xuICAgICAgICAgIHRoaXMuZG9XaGlsZSgkd2hpbGUsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgdGhpcy5kb0xldCgkbGV0LCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1lbnQobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgY29uc3QgaXNDb21wb25lbnQgPSAhIXRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXTtcbiAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IHt9O1xuICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICApO1xuICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG4gICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5jb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgcmVmID0gZWxlbWVudDtcbiAgICAgICAgY29uc3QgdHJhbnNwaWxlciA9IHRoaXM7XG4gICAgICAgIGNvbXBvbmVudCA9IG5ldyB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0uY29tcG9uZW50KHtcbiAgICAgICAgICBhcmdzLFxuICAgICAgICAgIHJlZixcbiAgICAgICAgICB0cmFuc3BpbGVyLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZHJlbiBvZiB0aGUgY29tcG9uZW50XG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5ub2RlcywgZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZXNcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKVxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG5cbiAgICBpZiAoIWlzVm9pZCAmJiBwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgdHlwZSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV07XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICB0aGlzLmV4ZWN1dGUoYXR0ci52YWx1ZSwgbGlzdGVuZXJTY29wZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlVGVtcGxhdGVTdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb25zdCByZWdleCA9IC9cXHtcXHsuK1xcfVxcfS9tcztcbiAgICBpZiAocmVnZXgudGVzdCh0ZXh0KSkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24ocGxhY2Vob2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24oc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgaWYgKHRoaXMucGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFRlbXBsYXRlIHN0cmluZyAgZXJyb3I6ICR7dGhpcy5wYXJzZXIuZXJyb3JzWzBdfWApO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciB7XG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlcikge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sID0gY29sO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJ3Rva2VuJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4cHIge1xuICBwdWJsaWMgcmVzdWx0OiBhbnk7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUjtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcjogQXNzaWduKTogUjtcbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcjogQmluYXJ5KTogUjtcbiAgICB2aXNpdENhbGxFeHByKGV4cHI6IENhbGwpOiBSO1xuICAgIHZpc2l0RGVidWdFeHByKGV4cHI6IERlYnVnKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG4gICAgdmlzaXRWb2lkRXhwcihleHByOiBWb2lkKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzaWduRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFzc2lnbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5CaW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNhbGxlZTogRXhwcjtcbiAgICBwdWJsaWMgcGFyZW46IFRva2VuO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHIsIHBhcmVuOiBUb2tlbiwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkNhbGwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERlYnVnRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRlYnVnJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGF6ejogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xhenogPSBjbGF6ejtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZXdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTmV3JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbENvYWxlc2NpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsQ29hbGVzY2luZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OdWxsQ29hbGVzY2luZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RmaXggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGluY3JlbWVudDogbnVtYmVyLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UG9zdGZpeEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Qb3N0Zml4JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVm9pZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZvaWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVm9pZCc7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50S05vZGUoa25vZGU6IEVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlS05vZGUoa25vZGU6IEF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRUZXh0S05vZGUoa25vZGU6IFRleHQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0Q29tbWVudEtOb2RlKGtub2RlOiBDb21tZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdERvY3R5cGVLTm9kZShrbm9kZTogRG9jdHlwZSwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IEtOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBzZWxmOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBLTm9kZVtdLCBjaGlsZHJlbjogS05vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJleHBvcnQgZW51bSBUb2tlblR5cGUge1xyXG4gIC8vIFBhcnNlciBUb2tlbnNcclxuICBFb2YsXHJcbiAgUGFuaWMsXHJcblxyXG4gIC8vIFNpbmdsZSBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQW1wZXJzYW5kLFxyXG4gIEF0U2lnbixcclxuICBDYXJldCxcclxuICBDb21tYSxcclxuICBEb2xsYXIsXHJcbiAgRG90LFxyXG4gIEhhc2gsXHJcbiAgTGVmdEJyYWNlLFxyXG4gIExlZnRCcmFja2V0LFxyXG4gIExlZnRQYXJlbixcclxuICBQZXJjZW50LFxyXG4gIFBpcGUsXHJcbiAgUmlnaHRCcmFjZSxcclxuICBSaWdodEJyYWNrZXQsXHJcbiAgUmlnaHRQYXJlbixcclxuICBTZW1pY29sb24sXHJcbiAgU2xhc2gsXHJcbiAgU3RhcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQXJyb3csXHJcbiAgQmFuZyxcclxuICBCYW5nRXF1YWwsXHJcbiAgQ29sb24sXHJcbiAgRXF1YWwsXHJcbiAgRXF1YWxFcXVhbCxcclxuICBHcmVhdGVyLFxyXG4gIEdyZWF0ZXJFcXVhbCxcclxuICBMZXNzLFxyXG4gIExlc3NFcXVhbCxcclxuICBNaW51cyxcclxuICBNaW51c0VxdWFsLFxyXG4gIE1pbnVzTWludXMsXHJcbiAgUGVyY2VudEVxdWFsLFxyXG4gIFBsdXMsXHJcbiAgUGx1c0VxdWFsLFxyXG4gIFBsdXNQbHVzLFxyXG4gIFF1ZXN0aW9uLFxyXG4gIFF1ZXN0aW9uRG90LFxyXG4gIFF1ZXN0aW9uUXVlc3Rpb24sXHJcbiAgU2xhc2hFcXVhbCxcclxuICBTdGFyRXF1YWwsXHJcbiAgRG90RG90LFxyXG4gIERvdERvdERvdCxcclxuICBMZXNzRXF1YWxHcmVhdGVyLFxyXG5cclxuICAvLyBMaXRlcmFsc1xyXG4gIElkZW50aWZpZXIsXHJcbiAgVGVtcGxhdGUsXHJcbiAgU3RyaW5nLFxyXG4gIE51bWJlcixcclxuXHJcbiAgLy8gS2V5d29yZHNcclxuICBBbmQsXHJcbiAgQ29uc3QsXHJcbiAgRGVidWcsXHJcbiAgRmFsc2UsXHJcbiAgSW5zdGFuY2VvZixcclxuICBOZXcsXHJcbiAgTnVsbCxcclxuICBVbmRlZmluZWQsXHJcbiAgT2YsXHJcbiAgT3IsXHJcbiAgVHJ1ZSxcclxuICBUeXBlb2YsXHJcbiAgVm9pZCxcclxuICBXaXRoLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcclxuICBwdWJsaWMgbGl0ZXJhbDogYW55O1xyXG4gIHB1YmxpYyBsZXhlbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0eXBlOiBUb2tlblR5cGUsXHJcbiAgICBsZXhlbWU6IHN0cmluZyxcclxuICAgIGxpdGVyYWw6IGFueSxcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBUb2tlblR5cGVbdHlwZV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XHJcbiAgICB0aGlzLmxpdGVyYWwgPSBsaXRlcmFsO1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBbKCR7dGhpcy5saW5lfSk6XCIke3RoaXMubGV4ZW1lfVwiXWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlbGZDbG9zaW5nVGFncyA9IFtcclxuICBcImFyZWFcIixcclxuICBcImJhc2VcIixcclxuICBcImJyXCIsXHJcbiAgXCJjb2xcIixcclxuICBcImVtYmVkXCIsXHJcbiAgXCJoclwiLFxyXG4gIFwiaW1nXCIsXHJcbiAgXCJpbnB1dFwiLFxyXG4gIFwibGlua1wiLFxyXG4gIFwibWV0YVwiLFxyXG4gIFwicGFyYW1cIixcclxuICBcInNvdXJjZVwiLFxyXG4gIFwidHJhY2tcIixcclxuICBcIndiclwiLFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIikgfHwgY2hhciA9PT0gXCIkXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDoga2V5b2YgdHlwZW9mIFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW5UeXBlW3dvcmRdID49IFRva2VuVHlwZS5BbmQ7XG59XG4iLCJpbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjxzdHJpbmc+IHtcclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIGV2YWx1YXRlKG5vZGU6IEtOb2RlLktOb2RlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLmFjY2VwdCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0cmFuc3BpbGUobm9kZXM6IEtOb2RlLktOb2RlW10pOiBzdHJpbmdbXSB7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmV2YWx1YXRlKG5vZGUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1gKTtcclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwMCkge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCk6IHN0cmluZyB7XHJcbiAgICBsZXQgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXMubWFwKChhdHRyKSA9PiB0aGlzLmV2YWx1YXRlKGF0dHIpKS5qb2luKFwiIFwiKTtcclxuICAgIGlmIChhdHRycy5sZW5ndGgpIHtcclxuICAgICAgYXR0cnMgPSBcIiBcIiArIGF0dHJzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlLnNlbGYpIHtcclxuICAgICAgcmV0dXJuIGA8JHtub2RlLm5hbWV9JHthdHRyc30vPmA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuLm1hcCgoZWxtKSA9PiB0aGlzLmV2YWx1YXRlKGVsbSkpLmpvaW4oXCJcIik7XHJcbiAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfT4ke2NoaWxkcmVufTwvJHtub2RlLm5hbWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUpOiBzdHJpbmcge1xyXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGAke25vZGUubmFtZX09XCIke25vZGUudmFsdWV9XCJgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGUubmFtZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLnZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGA8IS0tICR7bm9kZS52YWx1ZX0gLS0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCFkb2N0eXBlICR7bm9kZS52YWx1ZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IGV4ZWN1dGUsIHRyYW5zcGlsZSwgS2FzcGVyLCBrYXNwZXJTdGF0ZSwgS2FzcGVySW5pdCB9IGZyb20gXCIuL2thc3BlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgVmlld2VyIH0gZnJvbSBcIi4vdmlld2VyXCI7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICgod2luZG93IGFzIGFueSkgfHwge30pLmthc3BlciA9IHtcbiAgICBleGVjdXRlLFxuICAgIHRyYW5zcGlsZSxcbiAgICBBcHA6IEthc3BlckluaXQsXG4gIH07XG4gICh3aW5kb3cgYXMgYW55KVtcIkthc3BlclwiXSA9IEthc3BlcjtcbiAgKHdpbmRvdyBhcyBhbnkpW1wiQ29tcG9uZW50XCJdID0gQ29tcG9uZW50O1xuICAod2luZG93IGFzIGFueSlbXCIkc3RhdGVcIl0gPSBrYXNwZXJTdGF0ZTtcbn0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZXhwb3J0cy5rYXNwZXIgPSB7XG4gICAgRXhwcmVzc2lvblBhcnNlcixcbiAgICBJbnRlcnByZXRlcixcbiAgICBTY2FubmVyLFxuICAgIFRlbXBsYXRlUGFyc2VyLFxuICAgIFRyYW5zcGlsZXIsXG4gICAgVmlld2VyLFxuICB9O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9