(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.KasperLib = {}));
})(this, (function(exports2) {
  "use strict";
  class Component {
    constructor(props) {
      this.args = {};
      this.$abortController = new AbortController();
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
    onInit() {
    }
    onRender() {
    }
    onChanges() {
    }
    onDestroy() {
    }
    $doRender() {
      if (!this.transpiler) {
        return;
      }
    }
  }
  class KasperError extends Error {
    constructor(value, line, col) {
      super(`Parse Error (${line}:${col}) => ${value}`);
      this.name = "KasperError";
      this.line = line;
      this.col = col;
    }
  }
  class Expr {
    // tslint:disable-next-line
    constructor() {
    }
  }
  class ArrowFunction extends Expr {
    constructor(params, body, line) {
      super();
      this.params = params;
      this.body = body;
      this.line = line;
    }
    accept(visitor) {
      return visitor.visitArrowFunctionExpr(this);
    }
    toString() {
      return "Expr.ArrowFunction";
    }
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
      return "Expr.Assign";
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
      return "Expr.Binary";
    }
  }
  class Call extends Expr {
    constructor(callee, paren, args, line, optional = false) {
      super();
      this.callee = callee;
      this.paren = paren;
      this.args = args;
      this.line = line;
      this.optional = optional;
    }
    accept(visitor) {
      return visitor.visitCallExpr(this);
    }
    toString() {
      return "Expr.Call";
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
      return "Expr.Debug";
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
      return "Expr.Dictionary";
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
      return "Expr.Each";
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
      return "Expr.Get";
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
      return "Expr.Grouping";
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
      return "Expr.Key";
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
      return "Expr.Logical";
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
      return "Expr.List";
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
      return "Expr.Literal";
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
      return "Expr.New";
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
      return "Expr.NullCoalescing";
    }
  }
  class Postfix extends Expr {
    constructor(entity, increment, line) {
      super();
      this.entity = entity;
      this.increment = increment;
      this.line = line;
    }
    accept(visitor) {
      return visitor.visitPostfixExpr(this);
    }
    toString() {
      return "Expr.Postfix";
    }
  }
  let Set$1 = class Set extends Expr {
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
      return "Expr.Set";
    }
  };
  class Pipeline extends Expr {
    constructor(left, right, line) {
      super();
      this.left = left;
      this.right = right;
      this.line = line;
    }
    accept(visitor) {
      return visitor.visitPipelineExpr(this);
    }
    toString() {
      return "Expr.Pipeline";
    }
  }
  class Spread extends Expr {
    constructor(value, line) {
      super();
      this.value = value;
      this.line = line;
    }
    accept(visitor) {
      return visitor.visitSpreadExpr(this);
    }
    toString() {
      return "Expr.Spread";
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
      return "Expr.Template";
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
      return "Expr.Ternary";
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
      return "Expr.Typeof";
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
      return "Expr.Unary";
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
      return "Expr.Variable";
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
      return "Expr.Void";
    }
  }
  var TokenType = /* @__PURE__ */ ((TokenType2) => {
    TokenType2[TokenType2["Eof"] = 0] = "Eof";
    TokenType2[TokenType2["Panic"] = 1] = "Panic";
    TokenType2[TokenType2["Ampersand"] = 2] = "Ampersand";
    TokenType2[TokenType2["AtSign"] = 3] = "AtSign";
    TokenType2[TokenType2["Caret"] = 4] = "Caret";
    TokenType2[TokenType2["Comma"] = 5] = "Comma";
    TokenType2[TokenType2["Dollar"] = 6] = "Dollar";
    TokenType2[TokenType2["Dot"] = 7] = "Dot";
    TokenType2[TokenType2["Hash"] = 8] = "Hash";
    TokenType2[TokenType2["LeftBrace"] = 9] = "LeftBrace";
    TokenType2[TokenType2["LeftBracket"] = 10] = "LeftBracket";
    TokenType2[TokenType2["LeftParen"] = 11] = "LeftParen";
    TokenType2[TokenType2["Percent"] = 12] = "Percent";
    TokenType2[TokenType2["Pipe"] = 13] = "Pipe";
    TokenType2[TokenType2["RightBrace"] = 14] = "RightBrace";
    TokenType2[TokenType2["RightBracket"] = 15] = "RightBracket";
    TokenType2[TokenType2["RightParen"] = 16] = "RightParen";
    TokenType2[TokenType2["Semicolon"] = 17] = "Semicolon";
    TokenType2[TokenType2["Slash"] = 18] = "Slash";
    TokenType2[TokenType2["Star"] = 19] = "Star";
    TokenType2[TokenType2["Arrow"] = 20] = "Arrow";
    TokenType2[TokenType2["Bang"] = 21] = "Bang";
    TokenType2[TokenType2["BangEqual"] = 22] = "BangEqual";
    TokenType2[TokenType2["BangEqualEqual"] = 23] = "BangEqualEqual";
    TokenType2[TokenType2["Colon"] = 24] = "Colon";
    TokenType2[TokenType2["Equal"] = 25] = "Equal";
    TokenType2[TokenType2["EqualEqual"] = 26] = "EqualEqual";
    TokenType2[TokenType2["EqualEqualEqual"] = 27] = "EqualEqualEqual";
    TokenType2[TokenType2["Greater"] = 28] = "Greater";
    TokenType2[TokenType2["GreaterEqual"] = 29] = "GreaterEqual";
    TokenType2[TokenType2["Less"] = 30] = "Less";
    TokenType2[TokenType2["LessEqual"] = 31] = "LessEqual";
    TokenType2[TokenType2["Minus"] = 32] = "Minus";
    TokenType2[TokenType2["MinusEqual"] = 33] = "MinusEqual";
    TokenType2[TokenType2["MinusMinus"] = 34] = "MinusMinus";
    TokenType2[TokenType2["PercentEqual"] = 35] = "PercentEqual";
    TokenType2[TokenType2["Plus"] = 36] = "Plus";
    TokenType2[TokenType2["PlusEqual"] = 37] = "PlusEqual";
    TokenType2[TokenType2["PlusPlus"] = 38] = "PlusPlus";
    TokenType2[TokenType2["Question"] = 39] = "Question";
    TokenType2[TokenType2["QuestionDot"] = 40] = "QuestionDot";
    TokenType2[TokenType2["QuestionQuestion"] = 41] = "QuestionQuestion";
    TokenType2[TokenType2["SlashEqual"] = 42] = "SlashEqual";
    TokenType2[TokenType2["StarEqual"] = 43] = "StarEqual";
    TokenType2[TokenType2["DotDot"] = 44] = "DotDot";
    TokenType2[TokenType2["DotDotDot"] = 45] = "DotDotDot";
    TokenType2[TokenType2["LessEqualGreater"] = 46] = "LessEqualGreater";
    TokenType2[TokenType2["Identifier"] = 47] = "Identifier";
    TokenType2[TokenType2["Template"] = 48] = "Template";
    TokenType2[TokenType2["String"] = 49] = "String";
    TokenType2[TokenType2["Number"] = 50] = "Number";
    TokenType2[TokenType2["LeftShift"] = 51] = "LeftShift";
    TokenType2[TokenType2["RightShift"] = 52] = "RightShift";
    TokenType2[TokenType2["Pipeline"] = 53] = "Pipeline";
    TokenType2[TokenType2["Tilde"] = 54] = "Tilde";
    TokenType2[TokenType2["And"] = 55] = "And";
    TokenType2[TokenType2["Const"] = 56] = "Const";
    TokenType2[TokenType2["Debug"] = 57] = "Debug";
    TokenType2[TokenType2["False"] = 58] = "False";
    TokenType2[TokenType2["In"] = 59] = "In";
    TokenType2[TokenType2["Instanceof"] = 60] = "Instanceof";
    TokenType2[TokenType2["New"] = 61] = "New";
    TokenType2[TokenType2["Null"] = 62] = "Null";
    TokenType2[TokenType2["Undefined"] = 63] = "Undefined";
    TokenType2[TokenType2["Of"] = 64] = "Of";
    TokenType2[TokenType2["Or"] = 65] = "Or";
    TokenType2[TokenType2["True"] = 66] = "True";
    TokenType2[TokenType2["Typeof"] = 67] = "Typeof";
    TokenType2[TokenType2["Void"] = 68] = "Void";
    TokenType2[TokenType2["With"] = 69] = "With";
    return TokenType2;
  })(TokenType || {});
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
  const WhiteSpaces = [" ", "\n", "	", "\r"];
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
    "wbr"
  ];
  class ExpressionParser {
    parse(tokens) {
      this.current = 0;
      this.tokens = tokens;
      const expressions = [];
      while (!this.eof()) {
        expressions.push(this.expression());
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
      return this.check(TokenType.Eof);
    }
    consume(type, message) {
      if (this.check(type)) {
        return this.advance();
      }
      return this.error(
        this.peek(),
        message + `, unexpected token "${this.peek().lexeme}"`
      );
    }
    error(token, message) {
      throw new KasperError(message, token.line, token.col);
    }
    synchronize() {
      do {
        if (this.check(TokenType.Semicolon) || this.check(TokenType.RightBrace)) {
          this.advance();
          return;
        }
        this.advance();
      } while (!this.eof());
    }
    foreach(tokens) {
      this.current = 0;
      this.tokens = tokens;
      const name = this.consume(
        TokenType.Identifier,
        `Expected an identifier inside "each" statement`
      );
      let key = null;
      if (this.match(TokenType.With)) {
        key = this.consume(
          TokenType.Identifier,
          `Expected a "key" identifier after "with" keyword in foreach statement`
        );
      }
      this.consume(
        TokenType.Of,
        `Expected "of" keyword inside foreach statement`
      );
      const iterable = this.expression();
      return new Each(name, key, iterable, name.line);
    }
    expression() {
      const expression = this.assignment();
      if (this.match(TokenType.Semicolon)) {
        while (this.match(TokenType.Semicolon)) {
        }
      }
      return expression;
    }
    assignment() {
      const expr = this.pipeline();
      if (this.match(
        TokenType.Equal,
        TokenType.PlusEqual,
        TokenType.MinusEqual,
        TokenType.StarEqual,
        TokenType.SlashEqual
      )) {
        const operator = this.previous();
        let value = this.assignment();
        if (expr instanceof Variable) {
          const name = expr.name;
          if (operator.type !== TokenType.Equal) {
            value = new Binary(
              new Variable(name, name.line),
              operator,
              value,
              operator.line
            );
          }
          return new Assign(name, value, name.line);
        } else if (expr instanceof Get) {
          if (operator.type !== TokenType.Equal) {
            value = new Binary(
              new Get(expr.entity, expr.key, expr.type, expr.line),
              operator,
              value,
              operator.line
            );
          }
          return new Set$1(expr.entity, expr.key, value, expr.line);
        }
        this.error(operator, `Invalid l-value, is not an assigning target.`);
      }
      return expr;
    }
    pipeline() {
      let expr = this.ternary();
      while (this.match(TokenType.Pipeline)) {
        const right = this.ternary();
        expr = new Pipeline(expr, right, expr.line);
      }
      return expr;
    }
    ternary() {
      const expr = this.nullCoalescing();
      if (this.match(TokenType.Question)) {
        const thenExpr = this.ternary();
        this.consume(TokenType.Colon, `Expected ":" after ternary ? expression`);
        const elseExpr = this.ternary();
        return new Ternary(expr, thenExpr, elseExpr, expr.line);
      }
      return expr;
    }
    nullCoalescing() {
      const expr = this.logicalOr();
      if (this.match(TokenType.QuestionQuestion)) {
        const rightExpr = this.nullCoalescing();
        return new NullCoalescing(expr, rightExpr, expr.line);
      }
      return expr;
    }
    logicalOr() {
      let expr = this.logicalAnd();
      while (this.match(TokenType.Or)) {
        const operator = this.previous();
        const right = this.logicalAnd();
        expr = new Logical(expr, operator, right, operator.line);
      }
      return expr;
    }
    logicalAnd() {
      let expr = this.equality();
      while (this.match(TokenType.And)) {
        const operator = this.previous();
        const right = this.equality();
        expr = new Logical(expr, operator, right, operator.line);
      }
      return expr;
    }
    equality() {
      let expr = this.shift();
      while (this.match(
        TokenType.BangEqual,
        TokenType.BangEqualEqual,
        TokenType.EqualEqual,
        TokenType.EqualEqualEqual,
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual,
        TokenType.Instanceof,
        TokenType.In
      )) {
        const operator = this.previous();
        const right = this.shift();
        expr = new Binary(expr, operator, right, operator.line);
      }
      return expr;
    }
    shift() {
      let expr = this.addition();
      while (this.match(TokenType.LeftShift, TokenType.RightShift)) {
        const operator = this.previous();
        const right = this.addition();
        expr = new Binary(expr, operator, right, operator.line);
      }
      return expr;
    }
    addition() {
      let expr = this.modulus();
      while (this.match(TokenType.Minus, TokenType.Plus)) {
        const operator = this.previous();
        const right = this.modulus();
        expr = new Binary(expr, operator, right, operator.line);
      }
      return expr;
    }
    modulus() {
      let expr = this.multiplication();
      while (this.match(TokenType.Percent)) {
        const operator = this.previous();
        const right = this.multiplication();
        expr = new Binary(expr, operator, right, operator.line);
      }
      return expr;
    }
    multiplication() {
      let expr = this.typeof();
      while (this.match(TokenType.Slash, TokenType.Star)) {
        const operator = this.previous();
        const right = this.typeof();
        expr = new Binary(expr, operator, right, operator.line);
      }
      return expr;
    }
    typeof() {
      if (this.match(TokenType.Typeof)) {
        const operator = this.previous();
        const value = this.typeof();
        return new Typeof(value, operator.line);
      }
      return this.unary();
    }
    unary() {
      if (this.match(
        TokenType.Minus,
        TokenType.Bang,
        TokenType.Tilde,
        TokenType.Dollar,
        TokenType.PlusPlus,
        TokenType.MinusMinus
      )) {
        const operator = this.previous();
        const right = this.unary();
        return new Unary(operator, right, operator.line);
      }
      return this.newKeyword();
    }
    newKeyword() {
      if (this.match(TokenType.New)) {
        const keyword = this.previous();
        const construct = this.postfix();
        return new New(construct, keyword.line);
      }
      return this.postfix();
    }
    postfix() {
      const expr = this.call();
      if (this.match(TokenType.PlusPlus)) {
        return new Postfix(expr, 1, expr.line);
      }
      if (this.match(TokenType.MinusMinus)) {
        return new Postfix(expr, -1, expr.line);
      }
      return expr;
    }
    call() {
      let expr = this.primary();
      let consumed;
      do {
        consumed = false;
        if (this.match(TokenType.LeftParen)) {
          consumed = true;
          do {
            expr = this.finishCall(expr, this.previous(), false);
          } while (this.match(TokenType.LeftParen));
        }
        if (this.match(TokenType.Dot, TokenType.QuestionDot)) {
          consumed = true;
          const operator = this.previous();
          if (operator.type === TokenType.QuestionDot && this.match(TokenType.LeftBracket)) {
            expr = this.bracketGet(expr, operator);
          } else if (operator.type === TokenType.QuestionDot && this.match(TokenType.LeftParen)) {
            expr = this.finishCall(expr, this.previous(), true);
          } else {
            expr = this.dotGet(expr, operator);
          }
        }
        if (this.match(TokenType.LeftBracket)) {
          consumed = true;
          expr = this.bracketGet(expr, this.previous());
        }
      } while (consumed);
      return expr;
    }
    tokenAt(offset) {
      var _a;
      return (_a = this.tokens[this.current + offset]) == null ? void 0 : _a.type;
    }
    isArrowParams() {
      var _a, _b, _c, _d, _e, _f;
      let i = this.current + 1;
      if (((_a = this.tokens[i]) == null ? void 0 : _a.type) === TokenType.RightParen) {
        return ((_b = this.tokens[i + 1]) == null ? void 0 : _b.type) === TokenType.Arrow;
      }
      while (i < this.tokens.length) {
        if (((_c = this.tokens[i]) == null ? void 0 : _c.type) !== TokenType.Identifier) return false;
        i++;
        if (((_d = this.tokens[i]) == null ? void 0 : _d.type) === TokenType.RightParen) {
          return ((_e = this.tokens[i + 1]) == null ? void 0 : _e.type) === TokenType.Arrow;
        }
        if (((_f = this.tokens[i]) == null ? void 0 : _f.type) !== TokenType.Comma) return false;
        i++;
      }
      return false;
    }
    finishCall(callee, paren, optional) {
      const args = [];
      if (!this.check(TokenType.RightParen)) {
        do {
          if (this.match(TokenType.DotDotDot)) {
            args.push(new Spread(this.expression(), this.previous().line));
          } else {
            args.push(this.expression());
          }
        } while (this.match(TokenType.Comma));
      }
      const closeParen = this.consume(TokenType.RightParen, `Expected ")" after arguments`);
      return new Call(callee, closeParen, args, closeParen.line, optional);
    }
    dotGet(expr, operator) {
      const name = this.consume(
        TokenType.Identifier,
        `Expect property name after '.'`
      );
      const key = new Key(name, name.line);
      return new Get(expr, key, operator.type, name.line);
    }
    bracketGet(expr, operator) {
      let key = null;
      if (!this.check(TokenType.RightBracket)) {
        key = this.expression();
      }
      this.consume(TokenType.RightBracket, `Expected "]" after an index`);
      return new Get(expr, key, operator.type, operator.line);
    }
    primary() {
      if (this.match(TokenType.False)) {
        return new Literal(false, this.previous().line);
      }
      if (this.match(TokenType.True)) {
        return new Literal(true, this.previous().line);
      }
      if (this.match(TokenType.Null)) {
        return new Literal(null, this.previous().line);
      }
      if (this.match(TokenType.Undefined)) {
        return new Literal(void 0, this.previous().line);
      }
      if (this.match(TokenType.Number) || this.match(TokenType.String)) {
        return new Literal(this.previous().literal, this.previous().line);
      }
      if (this.match(TokenType.Template)) {
        return new Template(this.previous().literal, this.previous().line);
      }
      if (this.check(TokenType.Identifier) && this.tokenAt(1) === TokenType.Arrow) {
        const param = this.advance();
        this.advance();
        const body = this.expression();
        return new ArrowFunction([param], body, param.line);
      }
      if (this.match(TokenType.Identifier)) {
        const identifier = this.previous();
        return new Variable(identifier, identifier.line);
      }
      if (this.check(TokenType.LeftParen) && this.isArrowParams()) {
        this.advance();
        const params = [];
        if (!this.check(TokenType.RightParen)) {
          do {
            params.push(this.consume(TokenType.Identifier, "Expected parameter name"));
          } while (this.match(TokenType.Comma));
        }
        this.consume(TokenType.RightParen, `Expected ")"`);
        this.consume(TokenType.Arrow, `Expected "=>"`);
        const body = this.expression();
        return new ArrowFunction(params, body, this.previous().line);
      }
      if (this.match(TokenType.LeftParen)) {
        const expr = this.expression();
        this.consume(TokenType.RightParen, `Expected ")" after expression`);
        return new Grouping(expr, expr.line);
      }
      if (this.match(TokenType.LeftBrace)) {
        return this.dictionary();
      }
      if (this.match(TokenType.LeftBracket)) {
        return this.list();
      }
      if (this.match(TokenType.Void)) {
        const expr = this.expression();
        return new Void(expr, this.previous().line);
      }
      if (this.match(TokenType.Debug)) {
        const expr = this.expression();
        return new Debug(expr, this.previous().line);
      }
      throw this.error(
        this.peek(),
        `Expected expression, unexpected token "${this.peek().lexeme}"`
      );
    }
    dictionary() {
      const leftBrace = this.previous();
      if (this.match(TokenType.RightBrace)) {
        return new Dictionary([], this.previous().line);
      }
      const properties = [];
      do {
        if (this.match(TokenType.DotDotDot)) {
          properties.push(new Spread(this.expression(), this.previous().line));
        } else if (this.match(TokenType.String, TokenType.Identifier, TokenType.Number)) {
          const key = this.previous();
          if (this.match(TokenType.Colon)) {
            const value = this.expression();
            properties.push(
              new Set$1(null, new Key(key, key.line), value, key.line)
            );
          } else {
            const value = new Variable(key, key.line);
            properties.push(
              new Set$1(null, new Key(key, key.line), value, key.line)
            );
          }
        } else {
          this.error(
            this.peek(),
            `String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${this.peek().lexeme}`
          );
        }
      } while (this.match(TokenType.Comma));
      this.consume(TokenType.RightBrace, `Expected "}" after object literal`);
      return new Dictionary(properties, leftBrace.line);
    }
    list() {
      const values = [];
      const leftBracket = this.previous();
      if (this.match(TokenType.RightBracket)) {
        return new List([], this.previous().line);
      }
      do {
        if (this.match(TokenType.DotDotDot)) {
          values.push(new Spread(this.expression(), this.previous().line));
        } else {
          values.push(this.expression());
        }
      } while (this.match(TokenType.Comma));
      this.consume(
        TokenType.RightBracket,
        `Expected "]" after array declaration`
      );
      return new List(values, leftBracket.line);
    }
  }
  function isDigit(char) {
    return char >= "0" && char <= "9";
  }
  function isAlpha(char) {
    return char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "$" || char === "_";
  }
  function isAlphaNumeric(char) {
    return isAlpha(char) || isDigit(char);
  }
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  }
  function isKeyword(word) {
    return TokenType[word] >= TokenType.And;
  }
  class Scanner {
    scan(source) {
      this.source = source;
      this.tokens = [];
      this.current = 0;
      this.start = 0;
      this.line = 1;
      this.col = 1;
      while (!this.eof()) {
        this.start = this.current;
        this.getToken();
      }
      this.tokens.push(new Token(TokenType.Eof, "", null, this.line, 0));
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
      this.tokens.push(new Token(tokenType, text, literal, this.line, this.col));
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
      } else {
        this.advance();
        this.advance();
      }
    }
    string(quote) {
      while (this.peek() !== quote && !this.eof()) {
        this.advance();
      }
      if (this.eof()) {
        this.error(`Unterminated string, expecting closing ${quote}`);
        return;
      }
      this.advance();
      const value = this.source.substring(this.start + 1, this.current - 1);
      this.addToken(quote !== "`" ? TokenType.String : TokenType.Template, value);
    }
    number() {
      while (isDigit(this.peek())) {
        this.advance();
      }
      if (this.peek() === "." && isDigit(this.peekNext())) {
        this.advance();
      }
      while (isDigit(this.peek())) {
        this.advance();
      }
      if (this.peek().toLowerCase() === "e") {
        this.advance();
        if (this.peek() === "-" || this.peek() === "+") {
          this.advance();
        }
      }
      while (isDigit(this.peek())) {
        this.advance();
      }
      const value = this.source.substring(this.start, this.current);
      this.addToken(TokenType.Number, Number(value));
    }
    identifier() {
      while (isAlphaNumeric(this.peek())) {
        this.advance();
      }
      const value = this.source.substring(this.start, this.current);
      const capitalized = capitalize(value);
      if (isKeyword(capitalized)) {
        this.addToken(TokenType[capitalized], value);
      } else {
        this.addToken(TokenType.Identifier, value);
      }
    }
    getToken() {
      const char = this.advance();
      switch (char) {
        case "(":
          this.addToken(TokenType.LeftParen, null);
          break;
        case ")":
          this.addToken(TokenType.RightParen, null);
          break;
        case "[":
          this.addToken(TokenType.LeftBracket, null);
          break;
        case "]":
          this.addToken(TokenType.RightBracket, null);
          break;
        case "{":
          this.addToken(TokenType.LeftBrace, null);
          break;
        case "}":
          this.addToken(TokenType.RightBrace, null);
          break;
        case ",":
          this.addToken(TokenType.Comma, null);
          break;
        case ";":
          this.addToken(TokenType.Semicolon, null);
          break;
        case "~":
          this.addToken(TokenType.Tilde, null);
          break;
        case "^":
          this.addToken(TokenType.Caret, null);
          break;
        case "#":
          this.addToken(TokenType.Hash, null);
          break;
        case ":":
          this.addToken(
            this.match("=") ? TokenType.Arrow : TokenType.Colon,
            null
          );
          break;
        case "*":
          this.addToken(
            this.match("=") ? TokenType.StarEqual : TokenType.Star,
            null
          );
          break;
        case "%":
          this.addToken(
            this.match("=") ? TokenType.PercentEqual : TokenType.Percent,
            null
          );
          break;
        case "|":
          this.addToken(
            this.match("|") ? TokenType.Or : this.match(">") ? TokenType.Pipeline : TokenType.Pipe,
            null
          );
          break;
        case "&":
          this.addToken(
            this.match("&") ? TokenType.And : TokenType.Ampersand,
            null
          );
          break;
        case ">":
          this.addToken(
            this.match(">") ? TokenType.RightShift : this.match("=") ? TokenType.GreaterEqual : TokenType.Greater,
            null
          );
          break;
        case "!":
          this.addToken(
            this.match("=") ? this.match("=") ? TokenType.BangEqualEqual : TokenType.BangEqual : TokenType.Bang,
            null
          );
          break;
        case "?":
          this.addToken(
            this.match("?") ? TokenType.QuestionQuestion : this.match(".") ? TokenType.QuestionDot : TokenType.Question,
            null
          );
          break;
        case "=":
          if (this.match("=")) {
            this.addToken(
              this.match("=") ? TokenType.EqualEqualEqual : TokenType.EqualEqual,
              null
            );
            break;
          }
          this.addToken(
            this.match(">") ? TokenType.Arrow : TokenType.Equal,
            null
          );
          break;
        case "+":
          this.addToken(
            this.match("+") ? TokenType.PlusPlus : this.match("=") ? TokenType.PlusEqual : TokenType.Plus,
            null
          );
          break;
        case "-":
          this.addToken(
            this.match("-") ? TokenType.MinusMinus : this.match("=") ? TokenType.MinusEqual : TokenType.Minus,
            null
          );
          break;
        case "<":
          this.addToken(
            this.match("<") ? TokenType.LeftShift : this.match("=") ? this.match(">") ? TokenType.LessEqualGreater : TokenType.LessEqual : TokenType.Less,
            null
          );
          break;
        case ".":
          if (this.match(".")) {
            if (this.match(".")) {
              this.addToken(TokenType.DotDotDot, null);
            } else {
              this.addToken(TokenType.DotDot, null);
            }
          } else {
            this.addToken(TokenType.Dot, null);
          }
          break;
        case "/":
          if (this.match("/")) {
            this.comment();
          } else if (this.match("*")) {
            this.multilineComment();
          } else {
            this.addToken(
              this.match("=") ? TokenType.SlashEqual : TokenType.Slash,
              null
            );
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
        case "	":
          break;
        // complex cases
        default:
          if (isDigit(char)) {
            this.number();
          } else if (isAlpha(char)) {
            this.identifier();
          } else {
            this.error(`Unexpected character '${char}'`);
          }
          break;
      }
    }
    error(message) {
      throw new Error(`Scan Error (${this.line}:${this.col}) => ${message}`);
    }
  }
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
  class Interpreter {
    constructor() {
      this.scope = new Scope();
      this.scanner = new Scanner();
      this.parser = new ExpressionParser();
    }
    evaluate(expr) {
      return expr.result = expr.accept(this);
    }
    visitPipelineExpr(expr) {
      const value = this.evaluate(expr.left);
      if (expr.right instanceof Call) {
        const callee = this.evaluate(expr.right.callee);
        const args = [value];
        for (const arg of expr.right.args) {
          if (arg instanceof Spread) {
            args.push(...this.evaluate(arg.value));
          } else {
            args.push(this.evaluate(arg));
          }
        }
        if (expr.right.callee instanceof Get) {
          return callee.apply(expr.right.callee.entity.result, args);
        }
        return callee(...args);
      }
      const fn = this.evaluate(expr.right);
      return fn(value);
    }
    visitArrowFunctionExpr(expr) {
      const capturedScope = this.scope;
      return (...args) => {
        const prev = this.scope;
        this.scope = new Scope(capturedScope);
        for (let i = 0; i < expr.params.length; i++) {
          this.scope.set(expr.params[i].lexeme, args[i]);
        }
        try {
          return this.evaluate(expr.body);
        } finally {
          this.scope = prev;
        }
      };
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
      if (!entity && expr.type === TokenType.QuestionDot) {
        return void 0;
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
      const value = this.evaluate(expr.entity);
      const newValue = value + expr.increment;
      if (expr.entity instanceof Variable) {
        this.scope.set(expr.entity.name.lexeme, newValue);
      } else if (expr.entity instanceof Get) {
        const assign = new Set$1(
          expr.entity.entity,
          expr.entity.key,
          new Literal(newValue, expr.line),
          expr.line
        );
        this.evaluate(assign);
      } else {
        this.error(`Invalid left-hand side in postfix operation: ${expr.entity}`);
      }
      return value;
    }
    visitListExpr(expr) {
      const values = [];
      for (const expression of expr.value) {
        if (expression instanceof Spread) {
          values.push(...this.evaluate(expression.value));
        } else {
          values.push(this.evaluate(expression));
        }
      }
      return values;
    }
    visitSpreadExpr(expr) {
      return this.evaluate(expr.value);
    }
    templateParse(source) {
      const tokens = this.scanner.scan(source);
      const expressions = this.parser.parse(tokens);
      let result = "";
      for (const expression of expressions) {
        result += this.evaluate(expression).toString();
      }
      return result;
    }
    visitTemplateExpr(expr) {
      const result = expr.value.replace(
        /\{\{([\s\S]+?)\}\}/g,
        (m, placeholder) => {
          return this.templateParse(placeholder);
        }
      );
      return result;
    }
    visitBinaryExpr(expr) {
      const left = this.evaluate(expr.left);
      const right = this.evaluate(expr.right);
      switch (expr.operator.type) {
        case TokenType.Minus:
        case TokenType.MinusEqual:
          return left - right;
        case TokenType.Slash:
        case TokenType.SlashEqual:
          return left / right;
        case TokenType.Star:
        case TokenType.StarEqual:
          return left * right;
        case TokenType.Percent:
        case TokenType.PercentEqual:
          return left % right;
        case TokenType.Plus:
        case TokenType.PlusEqual:
          return left + right;
        case TokenType.Pipe:
          return left | right;
        case TokenType.Caret:
          return left ^ right;
        case TokenType.Greater:
          return left > right;
        case TokenType.GreaterEqual:
          return left >= right;
        case TokenType.Less:
          return left < right;
        case TokenType.LessEqual:
          return left <= right;
        case TokenType.EqualEqual:
        case TokenType.EqualEqualEqual:
          return left === right;
        case TokenType.BangEqual:
        case TokenType.BangEqualEqual:
          return left !== right;
        case TokenType.Instanceof:
          return left instanceof right;
        case TokenType.In:
          return left in right;
        case TokenType.LeftShift:
          return left << right;
        case TokenType.RightShift:
          return left >> right;
        default:
          this.error("Unknown binary operator " + expr.operator);
          return null;
      }
    }
    visitLogicalExpr(expr) {
      const left = this.evaluate(expr.left);
      if (expr.operator.type === TokenType.Or) {
        if (left) {
          return left;
        }
      } else {
        if (!left) {
          return left;
        }
      }
      return this.evaluate(expr.right);
    }
    visitTernaryExpr(expr) {
      return this.evaluate(expr.condition) ? this.evaluate(expr.thenExpr) : this.evaluate(expr.elseExpr);
    }
    visitNullCoalescingExpr(expr) {
      const left = this.evaluate(expr.left);
      if (left == null) {
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
        case TokenType.Minus:
          return -right;
        case TokenType.Bang:
          return !right;
        case TokenType.Tilde:
          return ~right;
        case TokenType.PlusPlus:
        case TokenType.MinusMinus: {
          const newValue = Number(right) + (expr.operator.type === TokenType.PlusPlus ? 1 : -1);
          if (expr.right instanceof Variable) {
            this.scope.set(expr.right.name.lexeme, newValue);
          } else if (expr.right instanceof Get) {
            const assign = new Set$1(
              expr.right.entity,
              expr.right.key,
              new Literal(newValue, expr.line),
              expr.line
            );
            this.evaluate(assign);
          } else {
            this.error(
              `Invalid right-hand side expression in prefix operation:  ${expr.right}`
            );
          }
          return newValue;
        }
        default:
          this.error(`Unknown unary operator ' + expr.operator`);
          return null;
      }
    }
    visitCallExpr(expr) {
      const callee = this.evaluate(expr.callee);
      if (callee == null && expr.optional) return void 0;
      if (typeof callee !== "function") {
        this.error(`${callee} is not a function`);
      }
      const args = [];
      for (const argument of expr.args) {
        if (argument instanceof Spread) {
          args.push(...this.evaluate(argument.value));
        } else {
          args.push(this.evaluate(argument));
        }
      }
      if (expr.callee instanceof Get) {
        return callee.apply(expr.callee.entity.result, args);
      } else {
        return callee(...args);
      }
    }
    visitNewExpr(expr) {
      const newCall = expr.clazz;
      const clazz = this.evaluate(newCall.callee);
      if (typeof clazz !== "function") {
        this.error(
          `'${clazz}' is not a class. 'new' statement must be used with classes.`
        );
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
        if (property instanceof Spread) {
          Object.assign(dict, this.evaluate(property.value));
        } else {
          const key = this.evaluate(property.key);
          const value = this.evaluate(property.value);
          dict[key] = value;
        }
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
        this.evaluate(expr.iterable)
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
  class KNode {
  }
  class Element extends KNode {
    constructor(name, attributes, children, self2, line = 0) {
      super();
      this.type = "element";
      this.name = name;
      this.attributes = attributes;
      this.children = children;
      this.self = self2;
      this.line = line;
    }
    accept(visitor, parent) {
      return visitor.visitElementKNode(this, parent);
    }
    toString() {
      return "KNode.Element";
    }
  }
  class Attribute extends KNode {
    constructor(name, value, line = 0) {
      super();
      this.type = "attribute";
      this.name = name;
      this.value = value;
      this.line = line;
    }
    accept(visitor, parent) {
      return visitor.visitAttributeKNode(this, parent);
    }
    toString() {
      return "KNode.Attribute";
    }
  }
  class Text extends KNode {
    constructor(value, line = 0) {
      super();
      this.type = "text";
      this.value = value;
      this.line = line;
    }
    accept(visitor, parent) {
      return visitor.visitTextKNode(this, parent);
    }
    toString() {
      return "KNode.Text";
    }
  }
  let Comment$1 = class Comment extends KNode {
    constructor(value, line = 0) {
      super();
      this.type = "comment";
      this.value = value;
      this.line = line;
    }
    accept(visitor, parent) {
      return visitor.visitCommentKNode(this, parent);
    }
    toString() {
      return "KNode.Comment";
    }
  };
  class Doctype extends KNode {
    constructor(value, line = 0) {
      super();
      this.type = "doctype";
      this.value = value;
      this.line = line;
    }
    accept(visitor, parent) {
      return visitor.visitDoctypeKNode(this, parent);
    }
    toString() {
      return "KNode.Doctype";
    }
  }
  class TemplateParser {
    parse(source) {
      this.current = 0;
      this.line = 1;
      this.col = 1;
      this.source = source;
      this.nodes = [];
      while (!this.eof()) {
        const node = this.node();
        if (node === null) {
          continue;
        }
        this.nodes.push(node);
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
      } else {
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
      throw new KasperError(message, this.line, this.col);
    }
    node() {
      this.whitespace();
      let node;
      if (this.match("</")) {
        this.error("Unexpected closing tag");
      }
      if (this.match("<!--")) {
        node = this.comment();
      } else if (this.match("<!doctype") || this.match("<!DOCTYPE")) {
        node = this.doctype();
      } else if (this.match("<")) {
        node = this.element();
      } else {
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
      return new Comment$1(comment, this.line);
    }
    doctype() {
      const start = this.current;
      do {
        this.advance("Expected closing doctype");
      } while (!this.match(`>`));
      const doctype = this.source.slice(start, this.current - 1).trim();
      return new Doctype(doctype, this.line);
    }
    element() {
      const line = this.line;
      const name = this.identifier("/", ">");
      if (!name) {
        this.error("Expected a tag name");
      }
      const attributes = this.attributes();
      if (this.match("/>") || SelfClosingTags.includes(name) && this.match(">")) {
        return new Element(name, attributes, [], true, this.line);
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
      return new Element(name, attributes, children, false, line);
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
            value = this.decodeEntities(this.string("'"));
          } else if (this.match('"')) {
            value = this.decodeEntities(this.string('"'));
          } else {
            value = this.decodeEntities(this.identifier(">", "/>"));
          }
        }
        this.whitespace();
        attributes.push(new Attribute(name, value, line));
      }
      return attributes;
    }
    text() {
      const start = this.current;
      const line = this.line;
      let depth = 0;
      while (!this.eof()) {
        if (this.match("{{")) {
          depth++;
          continue;
        }
        if (depth > 0 && this.match("}}")) {
          depth--;
          continue;
        }
        if (depth === 0 && this.peek("<")) {
          break;
        }
        this.advance();
      }
      const raw = this.source.slice(start, this.current).trim();
      if (!raw) {
        return null;
      }
      return new Text(this.decodeEntities(raw), line);
    }
    decodeEntities(text) {
      return text.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
    }
    whitespace() {
      let count = 0;
      while (this.peek(...WhiteSpaces) && !this.eof()) {
        count += 1;
        this.advance();
      }
      return count;
    }
    identifier(...closing) {
      this.whitespace();
      const start = this.current;
      while (!this.peek(...WhiteSpaces, ...closing)) {
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
  let activeEffect = null;
  const effectStack = [];
  let batching = false;
  const pendingSubscribers = /* @__PURE__ */ new Set();
  const pendingWatchers = [];
  class Signal {
    constructor(initialValue) {
      this.subscribers = /* @__PURE__ */ new Set();
      this.watchers = /* @__PURE__ */ new Set();
      this._value = initialValue;
    }
    get value() {
      if (activeEffect) {
        this.subscribers.add(activeEffect.fn);
        activeEffect.deps.add(this);
      }
      return this._value;
    }
    set value(newValue) {
      if (this._value !== newValue) {
        const oldValue = this._value;
        this._value = newValue;
        if (batching) {
          for (const sub of this.subscribers) pendingSubscribers.add(sub);
          for (const watcher of this.watchers) pendingWatchers.push(() => watcher(newValue, oldValue));
        } else {
          for (const sub of Array.from(this.subscribers)) {
            try {
              sub();
            } catch (e) {
              console.error("Effect error:", e);
            }
          }
          for (const watcher of this.watchers) {
            try {
              watcher(newValue, oldValue);
            } catch (e) {
              console.error("Watcher error:", e);
            }
          }
        }
      }
    }
    onChange(fn) {
      this.watchers.add(fn);
      return () => this.watchers.delete(fn);
    }
    unsubscribe(fn) {
      this.subscribers.delete(fn);
    }
    toString() {
      return String(this.value);
    }
    peek() {
      return this._value;
    }
  }
  function effect(fn) {
    const effectObj = {
      fn: () => {
        effectObj.deps.forEach((sig) => sig.unsubscribe(effectObj.fn));
        effectObj.deps.clear();
        effectStack.push(effectObj);
        activeEffect = effectObj;
        try {
          fn();
        } finally {
          effectStack.pop();
          activeEffect = effectStack[effectStack.length - 1] || null;
        }
      },
      deps: /* @__PURE__ */ new Set()
    };
    effectObj.fn();
    return () => {
      effectObj.deps.forEach((sig) => sig.unsubscribe(effectObj.fn));
      effectObj.deps.clear();
    };
  }
  function signal(initialValue) {
    return new Signal(initialValue);
  }
  function batch(fn) {
    batching = true;
    try {
      fn();
    } finally {
      batching = false;
      const subs = Array.from(pendingSubscribers);
      pendingSubscribers.clear();
      const watchers = pendingWatchers.splice(0);
      for (const sub of subs) {
        try {
          sub();
        } catch (e) {
          console.error("Effect error:", e);
        }
      }
      for (const watcher of watchers) {
        try {
          watcher();
        } catch (e) {
          console.error("Watcher error:", e);
        }
      }
    }
  }
  function computed(fn) {
    const s = signal(void 0);
    effect(() => {
      s.value = fn();
    });
    return s;
  }
  class Boundary {
    constructor(parent, label = "boundary") {
      this.start = document.createComment(`${label}-start`);
      this.end = document.createComment(`${label}-end`);
      parent.appendChild(this.start);
      parent.appendChild(this.end);
    }
    clear() {
      var _a;
      let current = this.start.nextSibling;
      while (current && current !== this.end) {
        const toRemove = current;
        current = current.nextSibling;
        (_a = toRemove.parentNode) == null ? void 0 : _a.removeChild(toRemove);
      }
    }
    insert(node) {
      var _a;
      (_a = this.end.parentNode) == null ? void 0 : _a.insertBefore(node, this.end);
    }
    nodes() {
      const result = [];
      let current = this.start.nextSibling;
      while (current && current !== this.end) {
        result.push(current);
        current = current.nextSibling;
      }
      return result;
    }
    get parent() {
      return this.start.parentNode;
    }
  }
  class Transpiler {
    constructor(options) {
      this.scanner = new Scanner();
      this.parser = new ExpressionParser();
      this.interpreter = new Interpreter();
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
    bindMethods(entity) {
      if (!entity || typeof entity !== "object") return;
      let proto = Object.getPrototypeOf(entity);
      while (proto && proto !== Object.prototype) {
        for (const key of Object.getOwnPropertyNames(proto)) {
          if (typeof entity[key] === "function" && key !== "constructor" && !Object.prototype.hasOwnProperty.call(entity, key)) {
            entity[key] = entity[key].bind(entity);
          }
        }
        proto = Object.getPrototypeOf(proto);
      }
    }
    // Creates an effect that restores the current scope on every re-run,
    // so effects set up inside @each always evaluate in their item scope.
    scopedEffect(fn) {
      const scope = this.interpreter.scope;
      return effect(() => {
        const prev = this.interpreter.scope;
        this.interpreter.scope = scope;
        try {
          fn();
        } finally {
          this.interpreter.scope = prev;
        }
      });
    }
    // evaluates expressions and returns the result of the first evaluation
    execute(source, overrideScope) {
      const tokens = this.scanner.scan(source);
      const expressions = this.parser.parse(tokens);
      const restoreScope = this.interpreter.scope;
      if (overrideScope) {
        this.interpreter.scope = overrideScope;
      }
      const result = expressions.map(
        (expression) => this.interpreter.evaluate(expression)
      );
      this.interpreter.scope = restoreScope;
      return result && result.length ? result[0] : void 0;
    }
    transpile(nodes, entity, container) {
      this.destroy(container);
      container.innerHTML = "";
      this.bindMethods(entity);
      this.interpreter.scope.init(entity);
      this.createSiblings(nodes, container);
      return container;
    }
    visitElementKNode(node, parent) {
      this.createElement(node, parent);
    }
    visitTextKNode(node, parent) {
      try {
        const text = document.createTextNode("");
        if (parent) {
          if (parent.insert && typeof parent.insert === "function") {
            parent.insert(text);
          } else {
            parent.appendChild(text);
          }
        }
        const stop = this.scopedEffect(() => {
          text.textContent = this.evaluateTemplateString(node.value);
        });
        this.trackEffect(text, stop);
      } catch (e) {
        this.error(e.message || `${e}`, "text node");
      }
    }
    visitAttributeKNode(node, parent) {
      const attr = document.createAttribute(node.name);
      const stop = this.scopedEffect(() => {
        attr.value = this.evaluateTemplateString(node.value);
      });
      this.trackEffect(attr, stop);
      if (parent) {
        parent.setAttributeNode(attr);
      }
    }
    visitCommentKNode(node, parent) {
      const result = new Comment(node.value);
      if (parent) {
        if (parent.insert && typeof parent.insert === "function") {
          parent.insert(result);
        } else {
          parent.appendChild(result);
        }
      }
    }
    trackEffect(target, stop) {
      if (!target.$kasperEffects) target.$kasperEffects = [];
      target.$kasperEffects.push(stop);
    }
    findAttr(node, name) {
      if (!node || !node.attributes || !node.attributes.length) {
        return null;
      }
      const attrib = node.attributes.find(
        (attr) => name.includes(attr.name)
      );
      if (attrib) {
        return attrib;
      }
      return null;
    }
    doIf(expressions, parent) {
      const boundary = new Boundary(parent, "if");
      const stop = this.scopedEffect(() => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();
        const $if = this.execute(expressions[0][1].value);
        if ($if) {
          this.createElement(expressions[0][0], boundary);
          return;
        }
        for (const expression of expressions.slice(1, expressions.length)) {
          if (this.findAttr(expression[0], ["@elseif"])) {
            const $elseif = this.execute(expression[1].value);
            if ($elseif) {
              this.createElement(expression[0], boundary);
              return;
            } else {
              continue;
            }
          }
          if (this.findAttr(expression[0], ["@else"])) {
            this.createElement(expression[0], boundary);
            return;
          }
        }
      });
      this.trackEffect(boundary, stop);
    }
    doEach(each, node, parent) {
      const keyAttr = this.findAttr(node, ["@key"]);
      if (keyAttr) {
        this.doEachKeyed(each, node, parent, keyAttr);
      } else {
        this.doEachUnkeyed(each, node, parent);
      }
    }
    doEachUnkeyed(each, node, parent) {
      const boundary = new Boundary(parent, "each");
      const originalScope = this.interpreter.scope;
      const stop = effect(() => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();
        const tokens = this.scanner.scan(each.value);
        const [name, key, iterable] = this.interpreter.evaluate(
          this.parser.foreach(tokens)
        );
        let index = 0;
        for (const item of iterable) {
          const scopeValues = { [name]: item };
          if (key) scopeValues[key] = index;
          this.interpreter.scope = new Scope(originalScope, scopeValues);
          this.createElement(node, boundary);
          index += 1;
        }
        this.interpreter.scope = originalScope;
      });
      this.trackEffect(boundary, stop);
    }
    doEachKeyed(each, node, parent, keyAttr) {
      const boundary = new Boundary(parent, "each");
      const originalScope = this.interpreter.scope;
      const keyedNodes = /* @__PURE__ */ new Map();
      const stop = effect(() => {
        var _a;
        const tokens = this.scanner.scan(each.value);
        const [name, indexKey, iterable] = this.interpreter.evaluate(
          this.parser.foreach(tokens)
        );
        const newItems = [];
        let index = 0;
        for (const item of iterable) {
          const scopeValues = { [name]: item };
          if (indexKey) scopeValues[indexKey] = index;
          this.interpreter.scope = new Scope(originalScope, scopeValues);
          const key = this.execute(keyAttr.value);
          newItems.push({ item, idx: index, key });
          index++;
        }
        const newKeySet = new Set(newItems.map((i) => i.key));
        for (const [key, domNode] of keyedNodes) {
          if (!newKeySet.has(key)) {
            this.destroyNode(domNode);
            (_a = domNode.parentNode) == null ? void 0 : _a.removeChild(domNode);
            keyedNodes.delete(key);
          }
        }
        for (const { item, idx, key } of newItems) {
          const scopeValues = { [name]: item };
          if (indexKey) scopeValues[indexKey] = idx;
          this.interpreter.scope = new Scope(originalScope, scopeValues);
          if (keyedNodes.has(key)) {
            boundary.insert(keyedNodes.get(key));
          } else {
            const created = this.createElement(node, boundary);
            if (created) keyedNodes.set(key, created);
          }
        }
        this.interpreter.scope = originalScope;
      });
      this.trackEffect(boundary, stop);
    }
    doWhile($while, node, parent) {
      const boundary = new Boundary(parent, "while");
      const originalScope = this.interpreter.scope;
      const stop = this.scopedEffect(() => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();
        this.interpreter.scope = new Scope(originalScope);
        while (this.execute($while.value)) {
          this.createElement(node, boundary);
        }
        this.interpreter.scope = originalScope;
      });
      this.trackEffect(boundary, stop);
    }
    // executes initialization in the current scope
    doLet(init, node, parent) {
      this.execute(init.value);
      const element = this.createElement(node, parent);
      this.interpreter.scope.set("$ref", element);
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
            while (current < nodes.length) {
              const attr = this.findAttr(nodes[current], [
                "@else",
                "@elseif"
              ]);
              if (attr) {
                expressions.push([nodes[current], attr]);
                current += 1;
              } else {
                break;
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
      var _a;
      try {
        if (node.name === "slot") {
          const nameAttr = this.findAttr(node, ["name"]);
          const name = nameAttr ? nameAttr.value : "default";
          const slots = this.interpreter.scope.get("$slots");
          if (slots && slots[name]) {
            this.createSiblings(slots[name], parent);
          }
          return void 0;
        }
        const isVoid = node.name === "void";
        const isComponent = !!this.registry[node.name];
        const element = isVoid ? parent : document.createElement(node.name);
        const restoreScope = this.interpreter.scope;
        if (element && element !== parent) {
          this.interpreter.scope.set("$ref", element);
        }
        if (isComponent) {
          let component = {};
          const argsAttr = node.attributes.filter(
            (attr) => attr.name.startsWith("@:")
          );
          const args = this.createComponentArgs(argsAttr);
          const slots = { default: [] };
          for (const child of node.children) {
            if (child.type === "element") {
              const slotAttr = this.findAttr(child, ["slot"]);
              if (slotAttr) {
                const name = slotAttr.value;
                if (!slots[name]) slots[name] = [];
                slots[name].push(child);
                continue;
              }
            }
            slots.default.push(child);
          }
          if ((_a = this.registry[node.name]) == null ? void 0 : _a.component) {
            component = new this.registry[node.name].component({
              args,
              ref: element,
              transpiler: this
            });
            this.bindMethods(component);
            element.$kasperInstance = component;
            if (typeof component.onInit === "function") {
              component.onInit();
            }
          }
          component.$slots = slots;
          this.interpreter.scope = new Scope(restoreScope, component);
          this.interpreter.scope.set("$instance", component);
          this.createSiblings(this.registry[node.name].nodes, element);
          if (component && typeof component.onRender === "function") {
            component.onRender();
          }
          this.interpreter.scope = restoreScope;
          if (parent) {
            if (parent.insert && typeof parent.insert === "function") {
              parent.insert(element);
            } else {
              parent.appendChild(element);
            }
          }
          return element;
        }
        if (!isVoid) {
          const events = node.attributes.filter(
            (attr) => attr.name.startsWith("@on:")
          );
          for (const event of events) {
            this.createEventListener(element, event);
          }
          const attributes = node.attributes.filter(
            (attr) => !attr.name.startsWith("@")
          );
          for (const attr of attributes) {
            this.evaluate(attr, element);
          }
          const shorthandAttributes = node.attributes.filter((attr) => {
            const name = attr.name;
            return name.startsWith("@") && !["@if", "@elseif", "@else", "@each", "@while", "@let", "@key", "@ref"].includes(
              name
            ) && !name.startsWith("@on:") && !name.startsWith("@:");
          });
          for (const attr of shorthandAttributes) {
            const realName = attr.name.slice(1);
            if (realName === "class") {
              let lastDynamicValue = "";
              const stop = this.scopedEffect(() => {
                const value = this.execute(attr.value);
                const staticClass = element.getAttribute("class") || "";
                const currentClasses = staticClass.split(" ").filter((c) => c !== lastDynamicValue && c !== "").join(" ");
                const newValue = currentClasses ? `${currentClasses} ${value}` : value;
                element.setAttribute("class", newValue);
                lastDynamicValue = value;
              });
              this.trackEffect(element, stop);
            } else {
              const stop = this.scopedEffect(() => {
                const value = this.execute(attr.value);
                if (value === false || value === null || value === void 0) {
                  if (realName !== "style") {
                    element.removeAttribute(realName);
                  }
                } else {
                  if (realName === "style") {
                    const existing = element.getAttribute("style");
                    const newValue = existing && !existing.includes(value) ? `${existing.endsWith(";") ? existing : existing + ";"} ${value}` : value;
                    element.setAttribute("style", newValue);
                  } else {
                    element.setAttribute(realName, value);
                  }
                }
              });
              this.trackEffect(element, stop);
            }
          }
        }
        if (parent && !isVoid) {
          if (parent.insert && typeof parent.insert === "function") {
            parent.insert(element);
          } else {
            parent.appendChild(element);
          }
        }
        const refAttr = this.findAttr(node, ["@ref"]);
        if (refAttr && !isVoid) {
          const propName = refAttr.value.trim();
          const instance = this.interpreter.scope.get("$instance");
          if (instance) {
            instance[propName] = element;
          } else {
            this.interpreter.scope.set(propName, element);
          }
        }
        if (node.self) {
          return element;
        }
        this.createSiblings(node.children, element);
        this.interpreter.scope = restoreScope;
        return element;
      } catch (e) {
        this.error(e.message || `${e}`, node.name);
      }
    }
    createComponentArgs(args) {
      if (!args.length) {
        return {};
      }
      const result = {};
      for (const arg of args) {
        const key = arg.name.split(":")[1];
        result[key] = this.execute(arg.value);
      }
      return result;
    }
    createEventListener(element, attr) {
      const [eventName, ...modifiers] = attr.name.split(":")[1].split(".");
      const listenerScope = new Scope(this.interpreter.scope);
      const instance = this.interpreter.scope.get("$instance");
      const options = {};
      if (instance && instance.$abortController) {
        options.signal = instance.$abortController.signal;
      }
      if (modifiers.includes("once")) options.once = true;
      if (modifiers.includes("passive")) options.passive = true;
      if (modifiers.includes("capture")) options.capture = true;
      element.addEventListener(eventName, (event) => {
        if (modifiers.includes("prevent")) event.preventDefault();
        if (modifiers.includes("stop")) event.stopPropagation();
        listenerScope.set("$event", event);
        this.execute(attr.value, listenerScope);
      }, options);
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
      let result = "";
      for (const expression of expressions) {
        result += `${this.interpreter.evaluate(expression)}`;
      }
      return result;
    }
    destroyNode(node) {
      var _a;
      if (node.$kasperInstance) {
        const instance = node.$kasperInstance;
        if (instance.onDestroy) instance.onDestroy();
        if (instance.$abortController) instance.$abortController.abort();
      }
      if (node.$kasperEffects) {
        node.$kasperEffects.forEach((stop) => stop());
        node.$kasperEffects = [];
      }
      if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          if (attr.$kasperEffects) {
            attr.$kasperEffects.forEach((stop) => stop());
            attr.$kasperEffects = [];
          }
        }
      }
      (_a = node.childNodes) == null ? void 0 : _a.forEach((child) => this.destroyNode(child));
    }
    destroy(container) {
      container.childNodes.forEach((child) => this.destroyNode(child));
    }
    visitDoctypeKNode(_node) {
      return;
    }
    error(message, tagName) {
      const cleanMessage = message.startsWith("Runtime Error") ? message : `Runtime Error: ${message}`;
      if (tagName && !cleanMessage.includes(`at <${tagName}>`)) {
        throw new Error(`${cleanMessage}
  at <${tagName}>`);
      }
      throw new Error(cleanMessage);
    }
  }
  function execute(source) {
    const parser = new TemplateParser();
    try {
      const nodes = parser.parse(source);
      return JSON.stringify(nodes);
    } catch (e) {
      return JSON.stringify([e instanceof Error ? e.message : String(e)]);
    }
  }
  function transpile(source, entity, container, registry) {
    const parser = new TemplateParser();
    const nodes = parser.parse(source);
    const transpiler = new Transpiler({ registry: registry || {} });
    const result = transpiler.transpile(nodes, entity || {}, container);
    return result;
  }
  function Kasper(ComponentClass) {
    KasperInit({
      root: "kasper-app",
      entry: "kasper-root",
      registry: {
        "kasper-root": {
          selector: "template",
          component: ComponentClass,
          template: null,
          nodes: []
        }
      }
    });
  }
  function createComponent(transpiler, tag, registry) {
    const element = document.createElement(tag);
    const component = new registry[tag].component({
      ref: element,
      transpiler,
      args: {}
    });
    return {
      node: element,
      instance: component,
      nodes: registry[tag].nodes
    };
  }
  function normalizeRegistry(registry, parser) {
    const result = { ...registry };
    for (const key of Object.keys(registry)) {
      const entry = registry[key];
      if (entry.nodes && entry.nodes.length > 0) {
        continue;
      }
      if (entry.selector) {
        const template = document.querySelector(entry.selector);
        if (template) {
          entry.template = template;
          entry.nodes = parser.parse(template.innerHTML);
          continue;
        }
      }
      const staticTemplate = entry.component.template;
      if (staticTemplate) {
        entry.nodes = parser.parse(staticTemplate);
      }
    }
    return result;
  }
  function KasperInit(config) {
    const parser = new TemplateParser();
    const root = typeof config.root === "string" ? document.querySelector(config.root) : config.root;
    if (!root) {
      throw new Error(`Root element not found: ${config.root}`);
    }
    const registry = normalizeRegistry(config.registry, parser);
    const transpiler = new Transpiler({ registry });
    const entryTag = config.entry || "kasper-app";
    const { node, instance, nodes } = createComponent(
      transpiler,
      entryTag,
      registry
    );
    if (root) {
      root.innerHTML = "";
      root.appendChild(node);
    }
    if (typeof instance.onInit === "function") {
      instance.onInit();
    }
    transpiler.transpile(nodes, instance, node);
    if (typeof instance.onRender === "function") {
      instance.onRender();
    }
    return instance;
  }
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
        } catch (e) {
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
      return node.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u00a0/g, "&nbsp;");
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
  if (typeof window !== "undefined") {
    (window || {}).kasper = {
      execute,
      transpile,
      App: KasperInit,
      Component,
      TemplateParser,
      Transpiler,
      Viewer,
      signal,
      effect,
      computed,
      batch
    };
    window["Kasper"] = Kasper;
    window["Component"] = Component;
  }
  exports2.App = KasperInit;
  exports2.Component = Component;
  exports2.ExpressionParser = ExpressionParser;
  exports2.Interpreter = Interpreter;
  exports2.Kasper = Kasper;
  exports2.Scanner = Scanner;
  exports2.TemplateParser = TemplateParser;
  exports2.Transpiler = Transpiler;
  exports2.Viewer = Viewer;
  exports2.batch = batch;
  exports2.computed = computed;
  exports2.effect = effect;
  exports2.execute = execute;
  exports2.signal = signal;
  exports2.transpile = transpile;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3NpZ25hbC50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy90cmFuc3BpbGVyLnRzIiwiLi4vc3JjL2thc3Blci50cyIsIi4uL3NyYy92aWV3ZXIudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3Mge1xuICBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIHN0YXRpYyB0ZW1wbGF0ZT86IHN0cmluZztcbiAgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbiAgJGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz86IENvbXBvbmVudEFyZ3MpIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSB7fTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHByb3BzLmFyZ3MpIHtcbiAgICAgIHRoaXMuYXJncyA9IHByb3BzLmFyZ3MgfHwge307XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZWYpIHtcbiAgICAgIHRoaXMucmVmID0gcHJvcHMucmVmO1xuICAgIH1cbiAgICBpZiAocHJvcHMudHJhbnNwaWxlcikge1xuICAgICAgdGhpcy50cmFuc3BpbGVyID0gcHJvcHMudHJhbnNwaWxlcjtcbiAgICB9XG4gIH1cblxuICBvbkluaXQoKSB7fVxuICBvblJlbmRlcigpIHt9XG4gIG9uQ2hhbmdlcygpIHt9XG4gIG9uRGVzdHJveSgpIHt9XG5cbiAgJGRvUmVuZGVyKCkge1xuICAgIGlmICghdGhpcy50cmFuc3BpbGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEthc3BlckVudGl0eSA9IENvbXBvbmVudCB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBDb21wb25lbnRDbGFzcyA9IHsgbmV3IChhcmdzPzogQ29tcG9uZW50QXJncyk6IENvbXBvbmVudCB9O1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRSZWdpc3RyeSB7XG4gIFt0YWdOYW1lOiBzdHJpbmddOiB7XG4gICAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgICB0ZW1wbGF0ZT86IEVsZW1lbnQgfCBudWxsO1xuICAgIG5vZGVzOiBLTm9kZVtdO1xuICB9O1xufVxuIiwiZXhwb3J0IGNsYXNzIEthc3BlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlcikge1xuICAgIHN1cGVyKGBQYXJzZSBFcnJvciAoJHtsaW5lfToke2NvbH0pID0+ICR7dmFsdWV9YCk7XG4gICAgdGhpcy5uYW1lID0gXCJLYXNwZXJFcnJvclwiO1xuICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBBcnJvd0Z1bmN0aW9uKTogUjtcbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcjogQXNzaWduKTogUjtcbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcjogQmluYXJ5KTogUjtcbiAgICB2aXNpdENhbGxFeHByKGV4cHI6IENhbGwpOiBSO1xuICAgIHZpc2l0RGVidWdFeHByKGV4cHI6IERlYnVnKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IFBpcGVsaW5lKTogUjtcbiAgICB2aXNpdFNwcmVhZEV4cHIoZXhwcjogU3ByZWFkKTogUjtcbiAgICB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBUZW1wbGF0ZSk6IFI7XG4gICAgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBUZXJuYXJ5KTogUjtcbiAgICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mKTogUjtcbiAgICB2aXNpdFVuYXJ5RXhwcihleHByOiBVbmFyeSk6IFI7XG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogVmFyaWFibGUpOiBSO1xuICAgIHZpc2l0Vm9pZEV4cHIoZXhwcjogVm9pZCk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJvd0Z1bmN0aW9uIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHBhcmFtczogVG9rZW5bXTtcbiAgICBwdWJsaWMgYm9keTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogVG9rZW5bXSwgYm9keTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFycm93RnVuY3Rpb25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXJyb3dGdW5jdGlvbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzaWduRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFzc2lnbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5CaW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNhbGxlZTogRXhwcjtcbiAgICBwdWJsaWMgcGFyZW46IFRva2VuO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG4gICAgcHVibGljIG9wdGlvbmFsOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyLCBvcHRpb25hbCA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBvcHRpb25hbDtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkNhbGwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERlYnVnRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRlYnVnJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGF6ejogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xhenogPSBjbGF6ejtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZXdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTmV3JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbENvYWxlc2NpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsQ29hbGVzY2luZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OdWxsQ29hbGVzY2luZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RmaXggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBpbmNyZW1lbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwgaW5jcmVtZW50OiBudW1iZXIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UG9zdGZpeEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Qb3N0Zml4JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBpcGVsaW5lRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBpcGVsaW5lJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3ByZWFkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U3ByZWFkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNwcmVhZCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlbXBsYXRlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlbXBsYXRlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVybmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjb25kaXRpb246IEV4cHI7XG4gICAgcHVibGljIHRoZW5FeHByOiBFeHByO1xuICAgIHB1YmxpYyBlbHNlRXhwcjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbjogRXhwciwgdGhlbkV4cHI6IEV4cHIsIGVsc2VFeHByOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgICAgIHRoaXMudGhlbkV4cHIgPSB0aGVuRXhwcjtcbiAgICAgICAgdGhpcy5lbHNlRXhwciA9IGVsc2VFeHByO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlcm5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVybmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVvZiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFR5cGVvZkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UeXBlb2YnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlVuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VmFyaWFibGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVmFyaWFibGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWb2lkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Vm9pZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Wb2lkJztcbiAgfVxufVxuXG4iLCJleHBvcnQgZW51bSBUb2tlblR5cGUge1xyXG4gIC8vIFBhcnNlciBUb2tlbnNcclxuICBFb2YsXHJcbiAgUGFuaWMsXHJcblxyXG4gIC8vIFNpbmdsZSBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQW1wZXJzYW5kLFxyXG4gIEF0U2lnbixcclxuICBDYXJldCxcclxuICBDb21tYSxcclxuICBEb2xsYXIsXHJcbiAgRG90LFxyXG4gIEhhc2gsXHJcbiAgTGVmdEJyYWNlLFxyXG4gIExlZnRCcmFja2V0LFxyXG4gIExlZnRQYXJlbixcclxuICBQZXJjZW50LFxyXG4gIFBpcGUsXHJcbiAgUmlnaHRCcmFjZSxcclxuICBSaWdodEJyYWNrZXQsXHJcbiAgUmlnaHRQYXJlbixcclxuICBTZW1pY29sb24sXHJcbiAgU2xhc2gsXHJcbiAgU3RhcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQXJyb3csXHJcbiAgQmFuZyxcclxuICBCYW5nRXF1YWwsXHJcbiAgQmFuZ0VxdWFsRXF1YWwsXHJcbiAgQ29sb24sXHJcbiAgRXF1YWwsXHJcbiAgRXF1YWxFcXVhbCxcclxuICBFcXVhbEVxdWFsRXF1YWwsXHJcbiAgR3JlYXRlcixcclxuICBHcmVhdGVyRXF1YWwsXHJcbiAgTGVzcyxcclxuICBMZXNzRXF1YWwsXHJcbiAgTWludXMsXHJcbiAgTWludXNFcXVhbCxcclxuICBNaW51c01pbnVzLFxyXG4gIFBlcmNlbnRFcXVhbCxcclxuICBQbHVzLFxyXG4gIFBsdXNFcXVhbCxcclxuICBQbHVzUGx1cyxcclxuICBRdWVzdGlvbixcclxuICBRdWVzdGlvbkRvdCxcclxuICBRdWVzdGlvblF1ZXN0aW9uLFxyXG4gIFNsYXNoRXF1YWwsXHJcbiAgU3RhckVxdWFsLFxyXG4gIERvdERvdCxcclxuICBEb3REb3REb3QsXHJcbiAgTGVzc0VxdWFsR3JlYXRlcixcclxuXHJcbiAgLy8gTGl0ZXJhbHNcclxuICBJZGVudGlmaWVyLFxyXG4gIFRlbXBsYXRlLFxyXG4gIFN0cmluZyxcclxuICBOdW1iZXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2VucyAoYml0d2lzZSBzaGlmdHMpXHJcbiAgTGVmdFNoaWZ0LFxyXG4gIFJpZ2h0U2hpZnQsXHJcbiAgUGlwZWxpbmUsXHJcbiAgVGlsZGUsXHJcblxyXG4gIC8vIEtleXdvcmRzXHJcbiAgQW5kLFxyXG4gIENvbnN0LFxyXG4gIERlYnVnLFxyXG4gIEZhbHNlLFxyXG4gIEluLFxyXG4gIEluc3RhbmNlb2YsXHJcbiAgTmV3LFxyXG4gIE51bGwsXHJcbiAgVW5kZWZpbmVkLFxyXG4gIE9mLFxyXG4gIE9yLFxyXG4gIFRydWUsXHJcbiAgVHlwZW9mLFxyXG4gIFZvaWQsXHJcbiAgV2l0aCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XHJcbiAgcHVibGljIGxpdGVyYWw6IGFueTtcclxuICBwdWJsaWMgbGV4ZW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHlwZTogVG9rZW5UeXBlLFxyXG4gICAgbGV4ZW1lOiBzdHJpbmcsXHJcbiAgICBsaXRlcmFsOiBhbnksXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2w6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5uYW1lID0gVG9rZW5UeXBlW3R5cGVdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGV4ZW1lID0gbGV4ZW1lO1xyXG4gICAgdGhpcy5saXRlcmFsID0gbGl0ZXJhbDtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiBgWygke3RoaXMubGluZX0pOlwiJHt0aGlzLmxleGVtZX1cIl1gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uUGFyc2VyIHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xuXG4gIHB1YmxpYyBwYXJzZSh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHJbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLnR5cGVzOiBUb2tlblR5cGVbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogVG9rZW4ge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnRdO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmV2aW91cygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCAtIDFdO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayh0eXBlOiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrKFRva2VuVHlwZS5Fb2YpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdW1lKHR5cGU6IFRva2VuVHlwZSwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIG1lc3NhZ2UgKyBgLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IodG9rZW46IFRva2VuLCBtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0b2tlbi5saW5lLCB0b2tlbi5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBzeW5jaHJvbml6ZSgpOiB2b2lkIHtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfSB3aGlsZSAoIXRoaXMuZW9mKCkpO1xuICB9XG5cbiAgcHVibGljIGZvcmVhY2godG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdGVkIGFuIGlkZW50aWZpZXIgaW5zaWRlIFwiZWFjaFwiIHN0YXRlbWVudGBcbiAgICApO1xuXG4gICAgbGV0IGtleTogVG9rZW4gPSBudWxsO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5XaXRoKSkge1xuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxuICAgICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgICAgYEV4cGVjdGVkIGEgXCJrZXlcIiBpZGVudGlmaWVyIGFmdGVyIFwid2l0aFwiIGtleXdvcmQgaW4gZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5PZixcbiAgICAgIGBFeHBlY3RlZCBcIm9mXCIga2V5d29yZCBpbnNpZGUgZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgKTtcbiAgICBjb25zdCBpdGVyYWJsZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHJlc3Npb246IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7XG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7IC8qIGNvbnN1bWUgc2VtaWNvbG9ucyAqLyB9XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5waXBlbGluZSgpO1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TdGFyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBsZXQgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XG4gICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5HZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCBleHByLnR5cGUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlNldChleHByLmVudGl0eSwgZXhwci5rZXksIHZhbHVlLCBleHByLmxpbmUpO1xuICAgICAgfVxuICAgICAgdGhpcy5lcnJvcihvcGVyYXRvciwgYEludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuYCk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBwaXBlbGluZSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBpcGVsaW5lKSkge1xuICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5QaXBlbGluZShleHByLCByaWdodCwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRlcm5hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHRoZW5FeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQ29sb24sIGBFeHBlY3RlZCBcIjpcIiBhZnRlciB0ZXJuYXJ5ID8gZXhwcmVzc2lvbmApO1xuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlcm5hcnkoZXhwciwgdGhlbkV4cHIsIGVsc2VFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5sb2dpY2FsT3IoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk51bGxDb2FsZXNjaW5nKGV4cHIsIHJpZ2h0RXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk9yKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxBbmQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBlcXVhbGl0eSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnNoaWZ0KCk7XG4gICAgd2hpbGUgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxuICAgICAgICBUb2tlblR5cGUuTGVzc0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuSW5zdGFuY2VvZixcbiAgICAgICAgVG9rZW5UeXBlLkluLFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHNoaWZ0KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFNoaWZ0LCBUb2tlblR5cGUuUmlnaHRTaGlmdCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRpdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXMsIFRva2VuVHlwZS5QbHVzKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbW9kdWx1cygpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBlcmNlbnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlwbGljYXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2xhc2gsIFRva2VuVHlwZS5TdGFyKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0eXBlb2YoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHlwZW9mKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVHlwZW9mKHZhbHVlLCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudW5hcnkoKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuTWludXMsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nLFxuICAgICAgICBUb2tlblR5cGUuVGlsZGUsXG4gICAgICAgIFRva2VuVHlwZS5Eb2xsYXIsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzUGx1cyxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnVuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmV3S2V5d29yZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXdLZXl3b3JkKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk5ldykpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCBjb25zdHJ1Y3Q6IEV4cHIuRXhwciA9IHRoaXMucG9zdGZpeCgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QsIGtleXdvcmQubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBvc3RmaXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zdGZpeCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAxLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIC0xLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcbiAgICBsZXQgY29uc3VtZWQ6IGJvb2xlYW47XG4gICAgZG8ge1xuICAgICAgY29uc3VtZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCBmYWxzZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2tlbkF0KG9mZnNldDogbnVtYmVyKTogVG9rZW5UeXBlIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50ICsgb2Zmc2V0XT8udHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNBcnJvd1BhcmFtcygpOiBib29sZWFuIHtcbiAgICBsZXQgaSA9IHRoaXMuY3VycmVudCArIDE7IC8vIHNraXAgKFxuICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICB9XG4gICAgd2hpbGUgKGkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLklkZW50aWZpZXIpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuQ29tbWEpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5pc2hDYWxsKGNhbGxlZTogRXhwci5FeHByLCBwYXJlbjogVG9rZW4sIG9wdGlvbmFsOiBib29sZWFuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBhcmdzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgICBhcmdzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgfVxuICAgIGNvbnN0IGNsb3NlUGFyZW4gPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuQ2FsbChjYWxsZWUsIGNsb3NlUGFyZW4sIGFyZ3MsIGNsb3NlUGFyZW4ubGluZSwgb3B0aW9uYWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuSWRlbnRpZmllcikgJiYgdGhpcy50b2tlbkF0KDEpID09PSBUb2tlblR5cGUuQXJyb3cpIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSA9PlxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24oW3BhcmFtXSwgYm9keSwgcGFyYW0ubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZShpZGVudGlmaWVyLCBpZGVudGlmaWVyLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuTGVmdFBhcmVuKSAmJiB0aGlzLmlzQXJyb3dQYXJhbXMoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgKFxuICAgICAgY29uc3QgcGFyYW1zOiBUb2tlbltdID0gW107XG4gICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBwYXJhbXMucHVzaCh0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklkZW50aWZpZXIsIFwiRXhwZWN0ZWQgcGFyYW1ldGVyIG5hbWVcIikpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCJgKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQXJyb3csIGBFeHBlY3RlZCBcIj0+XCJgKTtcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKHBhcmFtcywgYm9keSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZvaWQoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRGVidWcpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgYEV4cGVjdGVkIGV4cHJlc3Npb24sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke3RoaXMucGVlaygpLmxleGVtZX1cImBcbiAgICApO1xuICAgIC8vIHVucmVhY2hlYWJsZSBjb2RlXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgMCk7XG4gIH1cblxuICBwdWJsaWMgZGljdGlvbmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZywgVG9rZW5UeXBlLklkZW50aWZpZXIsIFRva2VuVHlwZS5OdW1iZXIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qga2V5OiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbG9uKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgRXhwci5WYXJpYWJsZShrZXksIGtleS5saW5lKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICB0aGlzLnBlZWsoKSxcbiAgICAgICAgICBgU3RyaW5nLCBOdW1iZXIgb3IgSWRlbnRpZmllciBleHBlY3RlZCBhcyBhIEtleSBvZiBEaWN0aW9uYXJ5IHssIHVuZXhwZWN0ZWQgdG9rZW4gJHtcbiAgICAgICAgICAgIHRoaXMucGVlaygpLmxleGVtZVxuICAgICAgICAgIH1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIGBFeHBlY3RlZCBcIn1cIiBhZnRlciBvYmplY3QgbGl0ZXJhbGApO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkocHJvcGVydGllcywgbGVmdEJyYWNlLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgdmFsdWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGNvbnN0IGxlZnRCcmFja2V0ID0gdGhpcy5wcmV2aW91cygpO1xuXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXN0KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCxcbiAgICAgIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhcnJheSBkZWNsYXJhdGlvbmBcbiAgICApO1xuICAgIHJldHVybiBuZXcgRXhwci5MaXN0KHZhbHVlcywgbGVmdEJyYWNrZXQubGluZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpZ2l0KGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gY2hhciA+PSBcIjBcIiAmJiBjaGFyIDw9IFwiOVwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYShjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAoY2hhciA+PSBcImFcIiAmJiBjaGFyIDw9IFwielwiKSB8fCAoY2hhciA+PSBcIkFcIiAmJiBjaGFyIDw9IFwiWlwiKSB8fCBjaGFyID09PSBcIiRcIiB8fCBjaGFyID09PSBcIl9cIlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYU51bWVyaWMoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0FscGhhKGNoYXIpIHx8IGlzRGlnaXQoY2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzS2V5d29yZCh3b3JkOiBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBUb2tlblR5cGVbd29yZF0gPj0gVG9rZW5UeXBlLkFuZDtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIFNjYW5uZXIge1xuICAvKiogc2NyaXB0cyBzb3VyY2UgY29kZSAqL1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIC8qKiBjb250YWlucyB0aGUgc291cmNlIGNvZGUgcmVwcmVzZW50ZWQgYXMgbGlzdCBvZiB0b2tlbnMgKi9cbiAgcHVibGljIHRva2VuczogVG9rZW5bXTtcbiAgLyoqIHBvaW50cyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICAvKiogcG9pbnRzIHRvIHRoZSBzdGFydCBvZiB0aGUgdG9rZW4gICovXG4gIHByaXZhdGUgc3RhcnQ6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgbGluZSBvZiBzb3VyY2UgY29kZSBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGNvbHVtbiBvZiB0aGUgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGNvbDogbnVtYmVyO1xuXG4gIHB1YmxpYyBzY2FuKHNvdXJjZTogc3RyaW5nKTogVG9rZW5bXSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgdGhpcy5nZXRUb2tlbigpO1xuICAgIH1cbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xuICAgICAgdGhpcy5saW5lKys7XG4gICAgICB0aGlzLmNvbCA9IDA7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHRoaXMuY29sKys7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpICE9PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWtOZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcignVW50ZXJtaW5hdGVkIGNvbW1lbnQsIGV4cGVjdGluZyBjbG9zaW5nIFwiKi9cIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgY2xvc2luZyBzbGFzaCAnKi8nXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKHF1b3RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IHF1b3RlICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBVbnRlcm1pbmF0ZWQgc3RyaW5nLlxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKGBVbnRlcm1pbmF0ZWQgc3RyaW5nLCBleHBlY3RpbmcgY2xvc2luZyAke3F1b3RlfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxuICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICB0aGlzLmFkZFRva2VuKHF1b3RlICE9PSBcImBcIiA/IFRva2VuVHlwZS5TdHJpbmcgOiBUb2tlblR5cGUuVGVtcGxhdGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbnVtYmVyKCk6IHZvaWQge1xuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGZyYWN0aW9uXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcbiAgICB3aGlsZSAoVXRpbHMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcbiAgICBpZiAoVXRpbHMuaXNLZXl3b3JkKGNhcGl0YWxpemVkKSkge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGVbY2FwaXRhbGl6ZWRdLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLklkZW50aWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIltcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJdXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIntcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjtcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiflwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5UaWxkZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ2FyZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkhhc2gsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI6XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcInxcIikgPyBUb2tlblR5cGUuT3IgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlBpcGVsaW5lIDpcbiAgICAgICAgICBUb2tlblR5cGUuUGlwZSxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiZcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlJpZ2h0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiIVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkJhbmdFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj9cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiP1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvblxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25Eb3RcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlF1ZXN0aW9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPVwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiK1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCIrXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzUGx1c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5QbHVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCItXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPFwiKSA/IFRva2VuVHlwZS5MZWZ0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXG4gICAgICAgICAgICAgID8gVG9rZW5UeXBlLkxlc3NFcXVhbEdyZWF0ZXJcbiAgICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiL1wiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi9cIikpIHtcbiAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xuICAgICAgICAgIHRoaXMubXVsdGlsaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TbGFzaEVxdWFsIDogVG9rZW5UeXBlLlNsYXNoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGAnYDpcbiAgICAgIGNhc2UgYFwiYDpcbiAgICAgIGNhc2UgXCJgXCI6XG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGlnbm9yZSBjYXNlc1xuICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgIGNhc2UgXCJcXHJcIjpcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjb21wbGV4IGNhc2VzXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdChjaGFyKSkge1xuICAgICAgICAgIHRoaXMubnVtYmVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xuICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2NoYXJ9J2ApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBTY2FuIEVycm9yICgke3RoaXMubGluZX06JHt0aGlzLmNvbH0pID0+ICR7bWVzc2FnZX1gKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgcHVibGljIHZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgcHVibGljIHBhcmVudDogU2NvcGU7XG5cbiAgY29uc3RydWN0b3IocGFyZW50PzogU2NvcGUsIGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlc1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXNba2V5XTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvd1trZXkgYXMga2V5b2YgdHlwZW9mIHdpbmRvd107XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIGFzIFBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJwcmV0ZXIgaW1wbGVtZW50cyBFeHByLkV4cHJWaXNpdG9yPGFueT4ge1xuICBwdWJsaWMgc2NvcGUgPSBuZXcgU2NvcGUoKTtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG5cbiAgcHVibGljIGV2YWx1YXRlKGV4cHI6IEV4cHIuRXhwcik6IGFueSB7XG4gICAgcmV0dXJuIChleHByLnJlc3VsdCA9IGV4cHIuYWNjZXB0KHRoaXMpKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBpcGVsaW5lRXhwcihleHByOiBFeHByLlBpcGVsaW5lKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5DYWxsKSB7XG4gICAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQuY2FsbGVlKTtcbiAgICAgIGNvbnN0IGFyZ3MgPSBbdmFsdWVdO1xuICAgICAgZm9yIChjb25zdCBhcmcgb2YgZXhwci5yaWdodC5hcmdzKSB7XG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmcgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChleHByLnJpZ2h0LmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5yaWdodC5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0IGZuID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICByZXR1cm4gZm4odmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXJyb3dGdW5jdGlvbkV4cHIoZXhwcjogRXhwci5BcnJvd0Z1bmN0aW9uKTogYW55IHtcbiAgICBjb25zdCBjYXB0dXJlZFNjb3BlID0gdGhpcy5zY29wZTtcbiAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gdGhpcy5zY29wZTtcbiAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGUoY2FwdHVyZWRTY29wZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cHIucGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucGFyYW1zW2ldLmxleGVtZSwgYXJnc1tpXSk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmJvZHkpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IEV4cHIuVmFyaWFibGUpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnNjb3BlLmdldChleHByLm5hbWUubGV4ZW1lKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFzc2lnbkV4cHIoZXhwcjogRXhwci5Bc3NpZ24pOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0S2V5RXhwcihleHByOiBFeHByLktleSk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIubmFtZS5saXRlcmFsO1xuICB9XG5cbiAgcHVibGljIHZpc2l0R2V0RXhwcihleHByOiBFeHByLkdldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgaWYgKCFlbnRpdHkgJiYgZXhwci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHlba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNldEV4cHIoZXhwcjogRXhwci5TZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBlbnRpdHlba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IEV4cHIuUG9zdGZpeCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlICsgZXhwci5pbmNyZW1lbnQ7XG5cbiAgICBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICB0aGlzLnNjb3BlLnNldChleHByLmVudGl0eS5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICBleHByLmVudGl0eS5lbnRpdHksXG4gICAgICAgIGV4cHIuZW50aXR5LmtleSxcbiAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKGBJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIHBvc3RmaXggb3BlcmF0aW9uOiAke2V4cHIuZW50aXR5fWApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpc3RFeHByKGV4cHI6IEV4cHIuTGlzdCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWVzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByLnZhbHVlKSB7XG4gICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGV4cHJlc3Npb24gYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNwcmVhZEV4cHIoZXhwcjogRXhwci5TcHJlYWQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogRXhwci5UZW1wbGF0ZSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwci52YWx1ZS5yZXBsYWNlKFxuICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGFyc2UocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEJpbmFyeUV4cHIoZXhwcjogRXhwci5CaW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2hFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50OlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAlIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBpcGU6XG4gICAgICAgIHJldHVybiBsZWZ0IHwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DYXJldDpcbiAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXI6XG4gICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzczpcbiAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3NFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgIT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuSW5zdGFuY2VvZjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW5zdGFuY2VvZiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluOlxuICAgICAgICByZXR1cm4gbGVmdCBpbiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlZnRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5SaWdodFNoaWZ0OlxuICAgICAgICByZXR1cm4gbGVmdCA+PiByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvciBcIiArIGV4cHIub3BlcmF0b3IpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKVxuICAgICAgPyB0aGlzLmV2YWx1YXRlKGV4cHIudGhlbkV4cHIpXG4gICAgICA6IHRoaXMuZXZhbHVhdGUoZXhwci5lbHNlRXhwcik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogRXhwci5OdWxsQ29hbGVzY2luZyk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBpZiAobGVmdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICB9XG4gICAgcmV0dXJuIGxlZnQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogRXhwci5Hcm91cGluZyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5leHByZXNzaW9uKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpdGVyYWxFeHByKGV4cHI6IEV4cHIuTGl0ZXJhbCk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIudmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRVbmFyeUV4cHIoZXhwcjogRXhwci5VbmFyeSk6IGFueSB7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgICAgcmV0dXJuIC1yaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmc6XG4gICAgICAgIHJldHVybiAhcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5UaWxkZTpcbiAgICAgICAgcmV0dXJuIH5yaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNQbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNNaW51czoge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgTnVtYmVyKHJpZ2h0KSArIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5QbHVzUGx1cyA/IDEgOiAtMSk7XG4gICAgICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucmlnaHQubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgICAgICBleHByLnJpZ2h0LmVudGl0eSxcbiAgICAgICAgICAgIGV4cHIucmlnaHQua2V5LFxuICAgICAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgICBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAgJHtleHByLnJpZ2h0fWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoYFVua25vd24gdW5hcnkgb3BlcmF0b3IgJyArIGV4cHIub3BlcmF0b3JgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENhbGxFeHByKGV4cHI6IEV4cHIuQ2FsbCk6IGFueSB7XG4gICAgLy8gdmVyaWZ5IGNhbGxlZSBpcyBhIGZ1bmN0aW9uXG4gICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgaWYgKGNhbGxlZSA9PSBudWxsICYmIGV4cHIub3B0aW9uYWwpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgaWYgKHR5cGVvZiBjYWxsZWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihgJHtjYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgfVxuICAgIC8vIGV2YWx1YXRlIGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIGV4cHIuYXJncykge1xuICAgICAgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGFyZ3VtZW50IGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJndW1lbnQpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZXhlY3V0ZSBmdW5jdGlvbiDigJQgcHJlc2VydmUgYHRoaXNgIGZvciBtZXRob2QgY2FsbHNcbiAgICBpZiAoZXhwci5jYWxsZWUgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXROZXdFeHByKGV4cHI6IEV4cHIuTmV3KTogYW55IHtcbiAgICBjb25zdCBuZXdDYWxsID0gZXhwci5jbGF6eiBhcyBFeHByLkNhbGw7XG4gICAgLy8gaW50ZXJuYWwgY2xhc3MgZGVmaW5pdGlvbiBpbnN0YW5jZVxuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShuZXdDYWxsLmNhbGxlZSk7XG5cbiAgICBpZiAodHlwZW9mIGNsYXp6ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgIGAnJHtjbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgbmV3Q2FsbC5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChwcm9wZXJ0eSBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGljdCwgdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkua2V5KTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50S05vZGUoa25vZGU6IEVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlS05vZGUoa25vZGU6IEF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRUZXh0S05vZGUoa25vZGU6IFRleHQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0Q29tbWVudEtOb2RlKGtub2RlOiBDb21tZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdERvY3R5cGVLTm9kZShrbm9kZTogRG9jdHlwZSwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IEtOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBzZWxmOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBLTm9kZVtdLCBjaGlsZHJlbjogS05vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUGFyc2VyIHtcbiAgcHVibGljIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm5vZGVzID0gW107XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKGVvZkVycm9yOiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgdGhpcy5jb2wgPSAwO1xuICAgICAgfVxuICAgICAgdGhpcy5jb2wgKz0gMTtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGVuZCBvZiBmaWxlLiAke2VvZkVycm9yfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVlayguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPiB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuS05vZGUge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGxldCBub2RlOiBOb2RlLktOb2RlO1xuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IS0tXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5jb21tZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPCFkb2N0eXBlXCIpIHx8IHRoaXMubWF0Y2goXCI8IURPQ1RZUEVcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmRvY3R5cGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8XCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5lbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDMpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Db21tZW50KGNvbW1lbnQsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRvY3R5cGUoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY2xvc2luZyBkb2N0eXBlXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGA+YCkpO1xuICAgIGNvbnN0IGRvY3R5cGUgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSkudHJpbSgpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Eb2N0eXBlKGRvY3R5cGUsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGVsZW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiL1wiLCBcIj5cIik7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgYSB0YWcgbmFtZVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzKCk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFwiLz5cIikgfHxcbiAgICAgIChTZWxmQ2xvc2luZ1RhZ3MuaW5jbHVkZXMobmFtZSkgJiYgdGhpcy5tYXRjaChcIj5cIikpXG4gICAgKSB7XG4gICAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBbXSwgdHJ1ZSwgdGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWF0Y2goYCR7bmFtZX1gKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtwYXJlbnR9PmApO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRyaWJ1dGVzKCk6IE5vZGUuQXR0cmlidXRlW10ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIj5cIiwgXCIvPlwiKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIj1cIiwgXCI+XCIsIFwiLz5cIik7XG4gICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhpcy5lcnJvcihcIkJsYW5rIGF0dHJpYnV0ZSBuYW1lXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoXCInXCIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKCdcIicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwie3tcIikpIHsgZGVwdGgrKzsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgdGhpcy5tYXRjaChcIn19XCIpKSB7IGRlcHRoLS07IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdGhpcy5wZWVrKFwiPFwiKSkgeyBicmVhazsgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXJhdykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRoaXMuZGVjb2RlRW50aXRpZXMocmF3KSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUVudGl0aWVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCJcXHUwMGEwXCIpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgICAgLnJlcGxhY2UoLyZhcG9zOy9nLCBcIidcIilcbiAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7IC8vIG11c3QgYmUgbGFzdCB0byBhdm9pZCBkb3VibGUtZGVjb2RpbmdcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsInR5cGUgTGlzdGVuZXIgPSAoKSA9PiB2b2lkO1xuXG5sZXQgYWN0aXZlRWZmZWN0OiB7IGZuOiBMaXN0ZW5lcjsgZGVwczogU2V0PGFueT4gfSB8IG51bGwgPSBudWxsO1xuY29uc3QgZWZmZWN0U3RhY2s6IGFueVtdID0gW107XG5cbmxldCBiYXRjaGluZyA9IGZhbHNlO1xuY29uc3QgcGVuZGluZ1N1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbmNvbnN0IHBlbmRpbmdXYXRjaGVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUPiB7XG4gIHByaXZhdGUgX3ZhbHVlOiBUO1xuICBwcml2YXRlIHN1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbiAgcHJpdmF0ZSB3YXRjaGVycyA9IG5ldyBTZXQ8V2F0Y2hlcjxUPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWU6IFQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzLmFkZChhY3RpdmVFZmZlY3QuZm4pO1xuICAgICAgYWN0aXZlRWZmZWN0LmRlcHMuYWRkKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGlmIChiYXRjaGluZykge1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmliZXJzKSBwZW5kaW5nU3Vic2NyaWJlcnMuYWRkKHN1Yik7XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSBwZW5kaW5nV2F0Y2hlcnMucHVzaCgoKSA9PiB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgQXJyYXkuZnJvbSh0aGlzLnN1YnNjcmliZXJzKSkge1xuICAgICAgICAgIHRyeSB7IHN1YigpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJFZmZlY3QgZXJyb3I6XCIsIGUpOyB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCB3YXRjaGVyIG9mIHRoaXMud2F0Y2hlcnMpIHtcbiAgICAgICAgICB0cnkgeyB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7IH0gY2F0Y2ggKGUpIHsgY29uc29sZS5lcnJvcihcIldhdGNoZXIgZXJyb3I6XCIsIGUpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZShmbjogV2F0Y2hlcjxUPik6ICgpID0+IHZvaWQge1xuICAgIHRoaXMud2F0Y2hlcnMuYWRkKGZuKTtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy53YXRjaGVycy5kZWxldGUoZm4pO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoZm46IExpc3RlbmVyKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5kZWxldGUoZm4pO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7IHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSk7IH1cbiAgcGVlaygpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlZmZlY3QoZm46IExpc3RlbmVyKSB7XG4gIGNvbnN0IGVmZmVjdE9iaiA9IHtcbiAgICBmbjogKCkgPT4ge1xuICAgICAgZWZmZWN0T2JqLmRlcHMuZm9yRWFjaChzaWcgPT4gc2lnLnVuc3Vic2NyaWJlKGVmZmVjdE9iai5mbikpO1xuICAgICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcblxuICAgICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3RPYmopO1xuICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0T2JqO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVwczogbmV3IFNldDxTaWduYWw8YW55Pj4oKVxuICB9O1xuXG4gIGVmZmVjdE9iai5mbigpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbmFsPFQ+KGluaXRpYWxWYWx1ZTogVCk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgU2lnbmFsKGluaXRpYWxWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXRjaChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBiYXRjaGluZyA9IHRydWU7XG4gIHRyeSB7XG4gICAgZm4oKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBiYXRjaGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IHN1YnMgPSBBcnJheS5mcm9tKHBlbmRpbmdTdWJzY3JpYmVycyk7XG4gICAgcGVuZGluZ1N1YnNjcmliZXJzLmNsZWFyKCk7XG4gICAgY29uc3Qgd2F0Y2hlcnMgPSBwZW5kaW5nV2F0Y2hlcnMuc3BsaWNlKDApO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgIHRyeSB7IHN1YigpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJFZmZlY3QgZXJyb3I6XCIsIGUpOyB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgdHJ5IHsgd2F0Y2hlcigpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZWQ8VD4oZm46ICgpID0+IFQpOiBTaWduYWw8VD4ge1xuICBjb25zdCBzID0gc2lnbmFsPFQ+KHVuZGVmaW5lZCBhcyBhbnkpO1xuICBlZmZlY3QoKCkgPT4ge1xuICAgIHMudmFsdWUgPSBmbigpO1xuICB9KTtcbiAgcmV0dXJuIHM7XG59XG4iLCJleHBvcnQgY2xhc3MgQm91bmRhcnkge1xuICBwcml2YXRlIHN0YXJ0OiBDb21tZW50O1xuICBwcml2YXRlIGVuZDogQ29tbWVudDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IE5vZGUsIGxhYmVsOiBzdHJpbmcgPSBcImJvdW5kYXJ5XCIpIHtcbiAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tc3RhcnRgKTtcbiAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LWVuZGApO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0KTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5lbmQpO1xuICB9XG5cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgY29uc3QgdG9SZW1vdmUgPSBjdXJyZW50O1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICB0b1JlbW92ZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZCh0b1JlbW92ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc2VydChub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5lbmQucGFyZW50Tm9kZT8uaW5zZXJ0QmVmb3JlKG5vZGUsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBub2RlcygpOiBOb2RlW10ge1xuICAgIGNvbnN0IHJlc3VsdDogTm9kZVtdID0gW107XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICByZXN1bHQucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJlbnQoKTogTm9kZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnBhcmVudE5vZGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBlZmZlY3QgfSBmcm9tIFwiLi9zaWduYWxcIjtcbmltcG9ydCB7IEJvdW5kYXJ5IH0gZnJvbSBcIi4vYm91bmRhcnlcIjtcbmltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcigpO1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiB7IHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSB9KSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0gb3B0aW9ucy5yZWdpc3RyeTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlKG5vZGU6IEtOb2RlLktOb2RlLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbm9kZS5hY2NlcHQodGhpcywgcGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZE1ldGhvZHMoZW50aXR5OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0eSB8fCB0eXBlb2YgZW50aXR5ICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZW50aXR5KTtcbiAgICB3aGlsZSAocHJvdG8gJiYgcHJvdG8gIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZW9mIGVudGl0eVtrZXldID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICBrZXkgIT09IFwiY29uc3RydWN0b3JcIiAmJlxuICAgICAgICAgICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZW50aXR5LCBrZXkpXG4gICAgICAgICkge1xuICAgICAgICAgIGVudGl0eVtrZXldID0gZW50aXR5W2tleV0uYmluZChlbnRpdHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhbiBlZmZlY3QgdGhhdCByZXN0b3JlcyB0aGUgY3VycmVudCBzY29wZSBvbiBldmVyeSByZS1ydW4sXG4gIC8vIHNvIGVmZmVjdHMgc2V0IHVwIGluc2lkZSBAZWFjaCBhbHdheXMgZXZhbHVhdGUgaW4gdGhlaXIgaXRlbSBzY29wZS5cbiAgcHJpdmF0ZSBzY29wZWRFZmZlY3QoZm46ICgpID0+IHZvaWQpOiAoKSA9PiB2b2lkIHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgcmV0dXJuIGVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGV2YWx1YXRlcyBleHByZXNzaW9ucyBhbmQgcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBmaXJzdCBldmFsdWF0aW9uXG4gIHByaXZhdGUgZXhlY3V0ZShzb3VyY2U6IHN0cmluZywgb3ZlcnJpZGVTY29wZT86IFNjb3BlKTogYW55IHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcblxuICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgaWYgKG92ZXJyaWRlU2NvcGUpIHtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvdmVycmlkZVNjb3BlO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBleHByZXNzaW9ucy5tYXAoKGV4cHJlc3Npb24pID0+XG4gICAgICB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pXG4gICAgKTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgIHJldHVybiByZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCA/IHJlc3VsdFswXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3BpbGUoXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZW50aXR5OiBhbnksXG4gICAgY29udGFpbmVyOiBFbGVtZW50XG4gICk6IE5vZGUge1xuICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoZW50aXR5KTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLmluaXQoZW50aXR5KTtcbiAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy50cmFja0VmZmVjdCh0ZXh0LCBzdG9wKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRoaXMuZXJyb3IoZS5tZXNzYWdlIHx8IGAke2V9YCwgXCJ0ZXh0IG5vZGVcIik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ciA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShub2RlLm5hbWUpO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGF0dHIudmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFja0VmZmVjdChhdHRyLCBzdG9wKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIChwYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tbWVudChub2RlLnZhbHVlKTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQocmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChyZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhY2tFZmZlY3QodGFyZ2V0OiBhbnksIHN0b3A6ICgpID0+IHZvaWQpIHtcbiAgICBpZiAoIXRhcmdldC4ka2FzcGVyRWZmZWN0cykgdGFyZ2V0LiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgdGFyZ2V0LiRrYXNwZXJFZmZlY3RzLnB1c2goc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGZpbmRBdHRyKFxuICAgIG5vZGU6IEtOb2RlLkVsZW1lbnQsXG4gICAgbmFtZTogc3RyaW5nW11cbiAgKTogS05vZGUuQXR0cmlidXRlIHwgbnVsbCB7XG4gICAgaWYgKCFub2RlIHx8ICFub2RlLmF0dHJpYnV0ZXMgfHwgIW5vZGUuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYiA9IG5vZGUuYXR0cmlidXRlcy5maW5kKChhdHRyKSA9PlxuICAgICAgbmFtZS5pbmNsdWRlcygoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUpXG4gICAgKTtcbiAgICBpZiAoYXR0cmliKSB7XG4gICAgICByZXR1cm4gYXR0cmliIGFzIEtOb2RlLkF0dHJpYnV0ZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGRvSWYoZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSwgcGFyZW50OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImlmXCIpO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICBjb25zdCAkaWYgPSB0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25zWzBdWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgaWYgKCRpZikge1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvbnNbMF1bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEsIGV4cHJlc3Npb25zLmxlbmd0aCkpIHtcbiAgICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZWlmXCJdKSkge1xuICAgICAgICAgIGNvbnN0ICRlbHNlaWYgPSB0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgaWYgKCRlbHNlaWYpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZVwiXSkpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2goZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCBrZXlBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAa2V5XCJdKTtcbiAgICBpZiAoa2V5QXR0cikge1xuICAgICAgdGhpcy5kb0VhY2hLZXllZChlYWNoLCBub2RlLCBwYXJlbnQsIGtleUF0dHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvRWFjaFVua2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaFVua2V5ZWQoZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgIGNvbnN0IHN0b3AgPSBlZmZlY3QoKCkgPT4ge1xuICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgIGJvdW5kYXJ5LmNsZWFyKCk7XG5cbiAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgY29uc3QgW25hbWUsIGtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuXG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICBpZiAoa2V5KSBzY29wZVZhbHVlc1trZXldID0gaW5kZXg7XG5cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICBpbmRleCArPSAxO1xuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoS2V5ZWQoZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUsIGtleUF0dHI6IEtOb2RlLkF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGNvbnN0IGtleWVkTm9kZXMgPSBuZXcgTWFwPGFueSwgTm9kZT4oKTtcblxuICAgIGNvbnN0IHN0b3AgPSBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwgaW5kZXhLZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXNcbiAgICAgIGNvbnN0IG5ld0l0ZW1zOiBBcnJheTx7IGl0ZW06IGFueTsgaWR4OiBudW1iZXI7IGtleTogYW55IH0+ID0gW107XG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGluZGV4O1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5leGVjdXRlKGtleUF0dHIudmFsdWUpO1xuICAgICAgICBuZXdJdGVtcy5wdXNoKHsgaXRlbSwgaWR4OiBpbmRleCwga2V5IH0pO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuXG4gICAgICAvLyBEZXN0cm95IG5vZGVzIHdob3NlIGtleXMgYXJlIG5vIGxvbmdlciBwcmVzZW50XG4gICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZG9tTm9kZV0gb2Yga2V5ZWROb2Rlcykge1xuICAgICAgICBpZiAoIW5ld0tleVNldC5oYXMoa2V5KSkge1xuICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChkb21Ob2RlKTtcbiAgICAgICAgICBrZXllZE5vZGVzLmRlbGV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEluc2VydC9yZXVzZSBub2RlcyBpbiBuZXcgb3JkZXJcbiAgICAgIGZvciAoY29uc3QgeyBpdGVtLCBpZHgsIGtleSB9IG9mIG5ld0l0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGlkeDtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG5cbiAgICAgICAgaWYgKGtleWVkTm9kZXMuaGFzKGtleSkpIHtcbiAgICAgICAgICBib3VuZGFyeS5pbnNlcnQoa2V5ZWROb2Rlcy5nZXQoa2V5KSEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICBpZiAoY3JlYXRlZCkga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICB9KTtcblxuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBkb1doaWxlKCR3aGlsZTogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwid2hpbGVcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgIGJvdW5kYXJ5LmNsZWFyKCk7XG5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSk7XG4gICAgICB3aGlsZSAodGhpcy5leGVjdXRlKCR3aGlsZS52YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICB9KTtcblxuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgLy8gZXhlY3V0ZXMgaW5pdGlhbGl6YXRpb24gaW4gdGhlIGN1cnJlbnQgc2NvcGVcbiAgcHJpdmF0ZSBkb0xldChpbml0OiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIHRoaXMuZXhlY3V0ZShpbml0LnZhbHVlKTtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTaWJsaW5ncyhub2RlczogS05vZGUuS05vZGVbXSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gMDtcbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCAkZWFjaCA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWFjaFwiXSk7XG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGlmID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBpZlwiXSk7XG4gICAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tub2RlIGFzIEtOb2RlLkVsZW1lbnQsICRpZl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxuICAgICAgICAgICAgICBcIkBlbHNlaWZcIixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChbbm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgYXR0cl0pO1xuICAgICAgICAgICAgICBjdXJyZW50ICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJHdoaWxlID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkB3aGlsZVwiXSk7XG4gICAgICAgIGlmICgkd2hpbGUpIHtcbiAgICAgICAgICB0aGlzLmRvV2hpbGUoJHdoaWxlLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGxldCA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICB0aGlzLmRvTGV0KCRsZXQsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1lbnQobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgIHRyeSB7XG4gICAgICBpZiAobm9kZS5uYW1lID09PSBcInNsb3RcIikge1xuICAgICAgICBjb25zdCBuYW1lQXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wibmFtZVwiXSk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lQXR0ciA/IG5hbWVBdHRyLnZhbHVlIDogXCJkZWZhdWx0XCI7XG4gICAgICAgIGNvbnN0IHNsb3RzID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkc2xvdHNcIik7XG4gICAgICAgIGlmIChzbG90cyAmJiBzbG90c1tuYW1lXSkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Moc2xvdHNbbmFtZV0sIHBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNWb2lkID0gbm9kZS5uYW1lID09PSBcInZvaWRcIjtcbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gISF0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG4gICAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQ29tcG9uZW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgICAgbGV0IGNvbXBvbmVudDogYW55ID0ge307XG4gICAgICAgIGNvbnN0IGFyZ3NBdHRyID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnc0F0dHIgYXMgS05vZGUuQXR0cmlidXRlW10pO1xuXG4gICAgICAgIC8vIENhcHR1cmUgY2hpbGRyZW4gZm9yIHNsb3RzXG4gICAgICAgIGNvbnN0IHNsb3RzOiBSZWNvcmQ8c3RyaW5nLCBLTm9kZS5LTm9kZVtdPiA9IHsgZGVmYXVsdDogW10gfTtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICBjb25zdCBzbG90QXR0ciA9IHRoaXMuZmluZEF0dHIoY2hpbGQgYXMgS05vZGUuRWxlbWVudCwgW1wic2xvdFwiXSk7XG4gICAgICAgICAgICBpZiAoc2xvdEF0dHIpIHtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNsb3RBdHRyLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoIXNsb3RzW25hbWVdKSBzbG90c1tuYW1lXSA9IFtdO1xuICAgICAgICAgICAgICBzbG90c1tuYW1lXS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsb3RzLmRlZmF1bHQucHVzaChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb21wb25lbnQgPSBuZXcgdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLmNvbXBvbmVudCh7XG4gICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgcmVmOiBlbGVtZW50LFxuICAgICAgICAgICAgdHJhbnNwaWxlcjogdGhpcyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uSW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnQub25Jbml0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEV4cG9zZSBzbG90cyBpbiBjb21wb25lbnQgc2NvcGVcbiAgICAgICAgY29tcG9uZW50LiRzbG90cyA9IHNsb3RzO1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGRyZW4gb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5ub2RlcywgZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudCAmJiB0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVm9pZCkge1xuICAgICAgICAvLyBldmVudCBiaW5kaW5nXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQgYXMgS05vZGUuQXR0cmlidXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZ3VsYXIgYXR0cmlidXRlcyAocHJvY2Vzc2VkIGZpcnN0KVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcihcbiAgICAgICAgICAoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNob3J0aGFuZCBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgc2Vjb25kLCBhbGxvd3MgbWVyZ2luZylcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kQXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBuYW1lLnN0YXJ0c1dpdGgoXCJAXCIpICYmXG4gICAgICAgICAgICAhW1wiQGlmXCIsIFwiQGVsc2VpZlwiLCBcIkBlbHNlXCIsIFwiQGVhY2hcIiwgXCJAd2hpbGVcIiwgXCJAbGV0XCIsIFwiQGtleVwiLCBcIkByZWZcIl0uaW5jbHVkZXMoXG4gICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2Ygc2hvcnRoYW5kQXR0cmlidXRlcykge1xuICAgICAgICAgIGNvbnN0IHJlYWxOYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0RHluYW1pY1ZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBzdGF0aWNDbGFzcyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IHN0YXRpY0NsYXNzLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiBjICE9PSBsYXN0RHluYW1pY1ZhbHVlICYmIGMgIT09IFwiXCIpXG4gICAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGN1cnJlbnRDbGFzc2VzID8gYCR7Y3VycmVudENsYXNzZXN9ICR7dmFsdWV9YCA6IHZhbHVlO1xuICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICBsYXN0RHluYW1pY1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSAhPT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkucmVtb3ZlQXR0cmlidXRlKHJlYWxOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBleGlzdGluZyAmJiAhZXhpc3RpbmcuaW5jbHVkZXModmFsdWUpXG4gICAgICAgICAgICAgICAgICAgID8gYCR7ZXhpc3RpbmcuZW5kc1dpdGgoXCI7XCIpID8gZXhpc3RpbmcgOiBleGlzdGluZyArIFwiO1wifSAke3ZhbHVlfWBcbiAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmVudCAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZWZBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAcmVmXCJdKTtcbiAgICAgIGlmIChyZWZBdHRyICYmICFpc1ZvaWQpIHtcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSByZWZBdHRyLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgaW5zdGFuY2VbcHJvcE5hbWVdID0gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChwcm9wTmFtZSwgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUuc2VsZikge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlLmNoaWxkcmVuLCBlbGVtZW50KTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG5cbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihlLm1lc3NhZ2UgfHwgYCR7ZX1gLCBub2RlLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzOiBLTm9kZS5BdHRyaWJ1dGVbXSk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgY29uc3Qga2V5ID0gYXJnLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmV4ZWN1dGUoYXJnLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBOb2RlLCBhdHRyOiBLTm9kZS5BdHRyaWJ1dGUpOiB2b2lkIHtcbiAgICBjb25zdCBbZXZlbnROYW1lLCAuLi5tb2RpZmllcnNdID0gYXR0ci5uYW1lLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0ge307XG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gICAgfVxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvbmNlXCIpKSAgICBvcHRpb25zLm9uY2UgICAgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKSBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKSBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzdG9wXCIpKSAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxpc3RlbmVyU2NvcGUuc2V0KFwiJGV2ZW50XCIsIGV2ZW50KTtcbiAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBsaXN0ZW5lclNjb3BlKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xce1xcey4rXFx9XFx9L21zO1xuICAgIGlmIChyZWdleC50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZywgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSBgJHt0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pfWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lOb2RlKG5vZGU6IGFueSk6IHZvaWQge1xuICAgIC8vIDEuIENsZWFudXAgY29tcG9uZW50IGluc3RhbmNlXG4gICAgaWYgKG5vZGUuJGthc3Blckluc3RhbmNlKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5vZGUuJGthc3Blckluc3RhbmNlO1xuICAgICAgaWYgKGluc3RhbmNlLm9uRGVzdHJveSkgaW5zdGFuY2Uub25EZXN0cm95KCk7XG4gICAgICBpZiAoaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5hYm9ydCgpO1xuICAgIH1cblxuICAgIC8vIDIuIENsZWFudXAgZWZmZWN0cyBhdHRhY2hlZCB0byB0aGUgbm9kZVxuICAgIGlmIChub2RlLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgfVxuXG4gICAgLy8gMy4gQ2xlYW51cCBlZmZlY3RzIG9uIGF0dHJpYnV0ZXNcbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBhdHRyID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBpZiAoYXR0ci4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA0LiBSZWN1cnNlXG4gICAgbm9kZS5jaGlsZE5vZGVzPy5mb3JFYWNoKChjaGlsZDogYW55KSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveShjb250YWluZXI6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RG9jdHlwZUtOb2RlKF9ub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgdGFnTmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IG1lc3NhZ2Uuc3RhcnRzV2l0aChcIlJ1bnRpbWUgRXJyb3JcIilcbiAgICAgID8gbWVzc2FnZVxuICAgICAgOiBgUnVudGltZSBFcnJvcjogJHttZXNzYWdlfWA7XG5cbiAgICBpZiAodGFnTmFtZSAmJiAhY2xlYW5NZXNzYWdlLmluY2x1ZGVzKGBhdCA8JHt0YWdOYW1lfT5gKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2NsZWFuTWVzc2FnZX1cXG4gIGF0IDwke3RhZ05hbWV9PmApO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihjbGVhbk1lc3NhZ2UpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnQsXG4gIHJlZ2lzdHJ5PzogQ29tcG9uZW50UmVnaXN0cnlcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IHx8IHt9IH0pO1xuICBjb25zdCByZXN1bHQgPSB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgZW50aXR5IHx8IHt9LCBjb250YWluZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXIoQ29tcG9uZW50Q2xhc3M6IGFueSkge1xuICBLYXNwZXJJbml0KHtcbiAgICByb290OiBcImthc3Blci1hcHBcIixcbiAgICBlbnRyeTogXCJrYXNwZXItcm9vdFwiLFxuICAgIHJlZ2lzdHJ5OiB7XG4gICAgICBcImthc3Blci1yb290XCI6IHtcbiAgICAgICAgc2VsZWN0b3I6IFwidGVtcGxhdGVcIixcbiAgICAgICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcyxcbiAgICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59XG5cbmludGVyZmFjZSBBcHBDb25maWcge1xuICByb290Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG4gIGVudHJ5Pzogc3RyaW5nO1xuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChcbiAgdHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeVxuKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZWdpc3RyeVt0YWddLmNvbXBvbmVudCh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiByZWdpc3RyeVt0YWddLm5vZGVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZWdpc3RyeShcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5LFxuICBwYXJzZXI6IFRlbXBsYXRlUGFyc2VyXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0geyAuLi5yZWdpc3RyeSB9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWdpc3RyeSkpIHtcbiAgICBjb25zdCBlbnRyeSA9IHJlZ2lzdHJ5W2tleV07XG4gICAgaWYgKGVudHJ5Lm5vZGVzICYmIGVudHJ5Lm5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoZW50cnkuc2VsZWN0b3IpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbnRyeS5zZWxlY3Rvcik7XG4gICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgZW50cnkudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UodGVtcGxhdGUuaW5uZXJIVE1MKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHN0YXRpY1RlbXBsYXRlID0gKGVudHJ5LmNvbXBvbmVudCBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmIChzdGF0aWNUZW1wbGF0ZSkge1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2Uoc3RhdGljVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVySW5pdChjb25maWc6IEFwcENvbmZpZykge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgcm9vdCA9XG4gICAgdHlwZW9mIGNvbmZpZy5yb290ID09PSBcInN0cmluZ1wiXG4gICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpXG4gICAgICA6IGNvbmZpZy5yb290O1xuXG4gIGlmICghcm9vdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUm9vdCBlbGVtZW50IG5vdCBmb3VuZDogJHtjb25maWcucm9vdH1gKTtcbiAgfVxuXG4gIGNvbnN0IHJlZ2lzdHJ5ID0gbm9ybWFsaXplUmVnaXN0cnkoY29uZmlnLnJlZ2lzdHJ5LCBwYXJzZXIpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogcmVnaXN0cnkgfSk7XG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuXG4gIGNvbnN0IHsgbm9kZSwgaW5zdGFuY2UsIG5vZGVzIH0gPSBjcmVhdGVDb21wb25lbnQoXG4gICAgdHJhbnNwaWxlcixcbiAgICBlbnRyeVRhZyxcbiAgICByZWdpc3RyeVxuICApO1xuXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cblxuICAvLyBJbml0aWFsIHJlbmRlciBhbmQgbGlmZWN5Y2xlXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Jbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vbkluaXQoKTtcbiAgfVxuXG4gIHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBpbnN0YW5jZSwgbm9kZSBhcyBIVE1MRWxlbWVudCk7XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cbiIsImltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld2VyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHN0cmluZz4ge1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUuYWNjZXB0KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zcGlsZShub2RlczogS05vZGUuS05vZGVbXSk6IHN0cmluZ1tdIHtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZXZhbHVhdGUobm9kZSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcy5tYXAoKGF0dHIpID0+IHRoaXMuZXZhbHVhdGUoYXR0cikpLmpvaW4oXCIgXCIpO1xyXG4gICAgaWYgKGF0dHJzLmxlbmd0aCkge1xyXG4gICAgICBhdHRycyA9IFwiIFwiICsgYXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfS8+YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSkuam9pbihcIlwiKTtcclxuICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9PiR7Y2hpbGRyZW59PC8ke25vZGUubmFtZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSk6IHN0cmluZyB7XHJcbiAgICBpZiAobm9kZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gYCR7bm9kZS5uYW1lfT1cIiR7bm9kZS52YWx1ZX1cImA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5uYW1lO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUudmFsdWVcclxuICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcclxuICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csIFwiJm5ic3A7XCIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGA8IS0tICR7bm9kZS52YWx1ZX0gLS0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCFkb2N0eXBlICR7bm9kZS52YWx1ZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBleGVjdXRlLCB0cmFuc3BpbGUsIEthc3BlciwgS2FzcGVySW5pdCB9IGZyb20gXCIuL2thc3BlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgVmlld2VyIH0gZnJvbSBcIi4vdmlld2VyXCI7XG5pbXBvcnQgeyBzaWduYWwsIGVmZmVjdCwgY29tcHV0ZWQsIGJhdGNoIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICgod2luZG93IGFzIGFueSkgfHwge30pLmthc3BlciA9IHtcbiAgICBleGVjdXRlOiBleGVjdXRlLFxuICAgIHRyYW5zcGlsZTogdHJhbnNwaWxlLFxuICAgIEFwcDogS2FzcGVySW5pdCxcbiAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICBUZW1wbGF0ZVBhcnNlcjogVGVtcGxhdGVQYXJzZXIsXG4gICAgVHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgICBWaWV3ZXI6IFZpZXdlcixcbiAgICBzaWduYWw6IHNpZ25hbCxcbiAgICBlZmZlY3Q6IGVmZmVjdCxcbiAgICBjb21wdXRlZDogY29tcHV0ZWQsXG4gICAgYmF0Y2g6IGJhdGNoLFxuICB9O1xuICAod2luZG93IGFzIGFueSlbXCJLYXNwZXJcIl0gPSBLYXNwZXI7XG4gICh3aW5kb3cgYXMgYW55KVtcIkNvbXBvbmVudFwiXSA9IENvbXBvbmVudDtcbn1cblxuZXhwb3J0IHsgRXhwcmVzc2lvblBhcnNlciwgSW50ZXJwcmV0ZXIsIFNjYW5uZXIsIFRlbXBsYXRlUGFyc2VyLCBUcmFuc3BpbGVyLCBWaWV3ZXIsIHNpZ25hbCwgZWZmZWN0LCBjb21wdXRlZCwgYmF0Y2ggfTtcbmV4cG9ydCB7IGV4ZWN1dGUsIHRyYW5zcGlsZSwgS2FzcGVyLCBLYXNwZXJJbml0IGFzIEFwcCwgQ29tcG9uZW50IH07XG4iXSwibmFtZXMiOlsiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5QaXBlbGluZSIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuU3ByZWFkIiwiRXhwci5DYWxsIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5BcnJvd0Z1bmN0aW9uIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsInNlbGYiLCJOb2RlLkNvbW1lbnQiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCJdLCJtYXBwaW5ncyI6Ijs7OztFQVNPLE1BQU0sVUFBVTtBQUFBLElBT3JCLFlBQVksT0FBdUI7QUFMbkMsV0FBQSxPQUE0QixDQUFBO0FBRzVCLFdBQUEsbUJBQW1CLElBQUksZ0JBQUE7QUFHckIsVUFBSSxDQUFDLE9BQU87QUFDVixhQUFLLE9BQU8sQ0FBQTtBQUNaO0FBQUEsTUFDRjtBQUNBLFVBQUksTUFBTSxNQUFNO0FBQ2QsYUFBSyxPQUFPLE1BQU0sUUFBUSxDQUFBO0FBQUEsTUFDNUI7QUFDQSxVQUFJLE1BQU0sS0FBSztBQUNiLGFBQUssTUFBTSxNQUFNO0FBQUEsTUFDbkI7QUFDQSxVQUFJLE1BQU0sWUFBWTtBQUNwQixhQUFLLGFBQWEsTUFBTTtBQUFBLE1BQzFCO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBLElBQUM7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUFDO0FBQUEsSUFDWixZQUFZO0FBQUEsSUFBQztBQUFBLElBQ2IsWUFBWTtBQUFBLElBQUM7QUFBQSxJQUViLFlBQVk7QUFDVixVQUFJLENBQUMsS0FBSyxZQUFZO0FBQ3BCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUMxQ08sTUFBTSxvQkFBb0IsTUFBTTtB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LGVBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGdCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsaUJBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxlQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFB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
