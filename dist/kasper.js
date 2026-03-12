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
    $onInit() {
    }
    $onRender() {
    }
    $onChanges() {
    }
    $onDestroy() {
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
    TokenType2[TokenType2["And"] = 51] = "And";
    TokenType2[TokenType2["Const"] = 52] = "Const";
    TokenType2[TokenType2["Debug"] = 53] = "Debug";
    TokenType2[TokenType2["False"] = 54] = "False";
    TokenType2[TokenType2["Instanceof"] = 55] = "Instanceof";
    TokenType2[TokenType2["New"] = 56] = "New";
    TokenType2[TokenType2["Null"] = 57] = "Null";
    TokenType2[TokenType2["Undefined"] = 58] = "Undefined";
    TokenType2[TokenType2["Of"] = 59] = "Of";
    TokenType2[TokenType2["Or"] = 60] = "Or";
    TokenType2[TokenType2["True"] = 61] = "True";
    TokenType2[TokenType2["Typeof"] = 62] = "Typeof";
    TokenType2[TokenType2["Void"] = 63] = "Void";
    TokenType2[TokenType2["With"] = 64] = "With";
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
      const expr = this.ternary();
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
      let expr = this.addition();
      while (this.match(
        TokenType.BangEqual,
        TokenType.BangEqualEqual,
        TokenType.EqualEqual,
        TokenType.EqualEqualEqual,
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual
      )) {
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
            const args = [];
            if (!this.check(TokenType.RightParen)) {
              do {
                args.push(this.expression());
              } while (this.match(TokenType.Comma));
            }
            const paren = this.consume(
              TokenType.RightParen,
              `Expected ")" after arguments`
            );
            expr = new Call(expr, paren, args, paren.line);
          } while (this.match(TokenType.LeftParen));
        }
        if (this.match(TokenType.Dot, TokenType.QuestionDot)) {
          consumed = true;
          expr = this.dotGet(expr, this.previous());
        }
        if (this.match(TokenType.LeftBracket)) {
          consumed = true;
          expr = this.bracketGet(expr, this.previous());
        }
      } while (consumed);
      return expr;
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
      if (this.match(TokenType.Identifier)) {
        const identifier = this.previous();
        return new Variable(identifier, identifier.line);
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
        if (this.match(TokenType.String, TokenType.Identifier, TokenType.Number)) {
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
        values.push(this.expression());
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
          this.addToken(this.match("|") ? TokenType.Or : TokenType.Pipe, null);
          break;
        case "&":
          this.addToken(
            this.match("&") ? TokenType.And : TokenType.Ampersand,
            null
          );
          break;
        case ">":
          this.addToken(
            this.match("=") ? TokenType.GreaterEqual : TokenType.Greater,
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
            this.match("=") ? this.match(">") ? TokenType.LessEqualGreater : TokenType.LessEqual : TokenType.Less,
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
        const value = this.evaluate(expression);
        values.push(value);
      }
      return values;
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
      if (typeof callee !== "function") {
        this.error(`${callee} is not a function`);
      }
      const args = [];
      for (const argument of expr.args) {
        args.push(this.evaluate(argument));
      }
      if (expr.callee instanceof Get && (expr.callee.entity instanceof Variable || expr.callee.entity instanceof Grouping)) {
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
            value = this.string("'");
          } else if (this.match('"')) {
            value = this.string('"');
          } else {
            value = this.identifier(">", "/>");
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
  class Signal {
    constructor(initialValue) {
      this.subscribers = /* @__PURE__ */ new Set();
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
        this._value = newValue;
        const subs = Array.from(this.subscribers);
        for (const sub of subs) {
          try {
            sub();
          } catch (e) {
            console.error("Effect error:", e);
          }
        }
      }
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
      const boundary = new Boundary(parent, "each");
      const originalScope = this.interpreter.scope;
      const keyAttr = this.findAttr(node, ["@key"]);
      if (keyAttr) {
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
      } else {
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
            const itemScope = new Scope(originalScope, scopeValues);
            this.interpreter.scope = itemScope;
            this.createElement(node, boundary);
            index += 1;
          }
          this.interpreter.scope = originalScope;
        });
        this.trackEffect(boundary, stop);
      }
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
            if (typeof component.$onInit === "function") {
              component.$onInit();
            }
          }
          component.$slots = slots;
          this.interpreter.scope = new Scope(restoreScope, component);
          this.interpreter.scope.set("$instance", component);
          this.createSiblings(this.registry[node.name].nodes, element);
          if (component && typeof component.$onRender === "function") {
            component.$onRender();
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
            return name.startsWith("@") && !["@if", "@elseif", "@else", "@each", "@while", "@let", "@key"].includes(
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
        if (instance.$onDestroy) instance.$onDestroy();
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
      const template = document.querySelector(entry.selector);
      if (template) {
        entry.template = template;
        entry.nodes = parser.parse(template.innerHTML);
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
    if (typeof instance.$onInit === "function") {
      instance.$onInit();
    }
    transpiler.transpile(nodes, instance, node);
    if (typeof instance.$onRender === "function") {
      instance.$onRender();
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
      computed
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
  exports2.computed = computed;
  exports2.effect = effect;
  exports2.execute = execute;
  exports2.signal = signal;
  exports2.transpile = transpile;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3NpZ25hbC50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy90cmFuc3BpbGVyLnRzIiwiLi4vc3JjL2thc3Blci50cyIsIi4uL3NyYy92aWV3ZXIudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3Mge1xuICBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgJG9uSW5pdCgpIHt9XG4gICRvblJlbmRlcigpIHt9XG4gICRvbkNoYW5nZXMoKSB7fVxuICAkb25EZXN0cm95KCkge31cblxuICAkZG9SZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgS2FzcGVyRW50aXR5ID0gQ29tcG9uZW50IHwgUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIENvbXBvbmVudENsYXNzID0geyBuZXcgKGFyZ3M/OiBDb21wb25lbnRBcmdzKTogQ29tcG9uZW50IH07XG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFJlZ2lzdHJ5IHtcbiAgW3RhZ05hbWU6IHN0cmluZ106IHtcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU6IEVsZW1lbnQ7XG4gICAgbm9kZXM6IEtOb2RlW107XG4gIH07XG59XG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoYFBhcnNlIEVycm9yICgke2xpbmV9OiR7Y29sfSkgPT4gJHt2YWx1ZX1gKTtcbiAgICB0aGlzLm5hbWUgPSBcIkthc3BlckVycm9yXCI7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJ3Rva2VuJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4cHIge1xuICBwdWJsaWMgcmVzdWx0OiBhbnk7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUjtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcjogQXNzaWduKTogUjtcbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcjogQmluYXJ5KTogUjtcbiAgICB2aXNpdENhbGxFeHByKGV4cHI6IENhbGwpOiBSO1xuICAgIHZpc2l0RGVidWdFeHByKGV4cHI6IERlYnVnKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG4gICAgdmlzaXRWb2lkRXhwcihleHByOiBWb2lkKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzaWduRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFzc2lnbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5CaW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNhbGxlZTogRXhwcjtcbiAgICBwdWJsaWMgcGFyZW46IFRva2VuO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHIsIHBhcmVuOiBUb2tlbiwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkNhbGwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERlYnVnRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRlYnVnJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihjbGF6ejogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xhenogPSBjbGF6ejtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZXdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTmV3JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbENvYWxlc2NpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsQ29hbGVzY2luZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OdWxsQ29hbGVzY2luZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RmaXggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBpbmNyZW1lbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwgaW5jcmVtZW50OiBudW1iZXIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UG9zdGZpeEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Qb3N0Zml4JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVm9pZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZvaWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVm9pZCc7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAvLyBQYXJzZXIgVG9rZW5zXHJcbiAgRW9mLFxyXG4gIFBhbmljLFxyXG5cclxuICAvLyBTaW5nbGUgQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFtcGVyc2FuZCxcclxuICBBdFNpZ24sXHJcbiAgQ2FyZXQsXHJcbiAgQ29tbWEsXHJcbiAgRG9sbGFyLFxyXG4gIERvdCxcclxuICBIYXNoLFxyXG4gIExlZnRCcmFjZSxcclxuICBMZWZ0QnJhY2tldCxcclxuICBMZWZ0UGFyZW4sXHJcbiAgUGVyY2VudCxcclxuICBQaXBlLFxyXG4gIFJpZ2h0QnJhY2UsXHJcbiAgUmlnaHRCcmFja2V0LFxyXG4gIFJpZ2h0UGFyZW4sXHJcbiAgU2VtaWNvbG9uLFxyXG4gIFNsYXNoLFxyXG4gIFN0YXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFycm93LFxyXG4gIEJhbmcsXHJcbiAgQmFuZ0VxdWFsLFxyXG4gIEJhbmdFcXVhbEVxdWFsLFxyXG4gIENvbG9uLFxyXG4gIEVxdWFsLFxyXG4gIEVxdWFsRXF1YWwsXHJcbiAgRXF1YWxFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBEZWJ1ZyxcclxuICBGYWxzZSxcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBWb2lkLFxyXG4gIFdpdGgsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbiB7XHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xyXG4gIHB1YmxpYyBsaXRlcmFsOiBhbnk7XHJcbiAgcHVibGljIGxleGVtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHR5cGU6IFRva2VuVHlwZSxcclxuICAgIGxleGVtZTogc3RyaW5nLFxyXG4gICAgbGl0ZXJhbDogYW55LFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sOiBudW1iZXJcclxuICApIHtcclxuICAgIHRoaXMubmFtZSA9IFRva2VuVHlwZVt0eXBlXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxleGVtZSA9IGxleGVtZTtcclxuICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gYFsoJHt0aGlzLmxpbmV9KTpcIiR7dGhpcy5sZXhlbWV9XCJdYDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblBhcnNlciB7XG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICBwcml2YXRlIHRva2VuczogVG9rZW5bXTtcblxuICBwdWJsaWMgcGFyc2UodG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgY29uc3QgZXhwcmVzc2lvbnM6IEV4cHIuRXhwcltdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi50eXBlczogVG9rZW5UeXBlW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50XTtcbiAgfVxuXG4gIHByaXZhdGUgcHJldmlvdXMoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT09IHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVjayhUb2tlblR5cGUuRW9mKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3VtZSh0eXBlOiBUb2tlblR5cGUsIG1lc3NhZ2U6IHN0cmluZyk6IFRva2VuIHtcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVycm9yKFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICBtZXNzYWdlICsgYCwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKHRva2VuOiBUb2tlbiwgbWVzc2FnZTogc3RyaW5nKTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IobWVzc2FnZSwgdG9rZW4ubGluZSwgdG9rZW4uY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgc3luY2hyb25pemUoKTogdm9pZCB7XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLlNlbWljb2xvbikgfHwgdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcblxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3RlZCBhbiBpZGVudGlmaWVyIGluc2lkZSBcImVhY2hcIiBzdGF0ZW1lbnRgXG4gICAgKTtcblxuICAgIGxldCBrZXk6IFRva2VuID0gbnVsbDtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcbiAgICAgIGtleSA9IHRoaXMuY29uc3VtZShcbiAgICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuT2YsXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICk7XG4gICAgY29uc3QgaXRlcmFibGUgPSB0aGlzLmV4cHJlc3Npb24oKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5FYWNoKG5hbWUsIGtleSwgaXRlcmFibGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGV4cHJlc3Npb24oKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByZXNzaW9uOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xuICAgICAgLy8gY29uc3VtZSBhbGwgc2VtaWNvbG9uc1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkgeyAvKiBjb25zdW1lIHNlbWljb2xvbnMgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWdubWVudCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TdGFyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBsZXQgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XG4gICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5HZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCBleHByLnR5cGUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlNldChleHByLmVudGl0eSwgZXhwci5rZXksIHZhbHVlLCBleHByLmxpbmUpO1xuICAgICAgfVxuICAgICAgdGhpcy5lcnJvcihvcGVyYXRvciwgYEludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuYCk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXJuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCB0aGVuRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcbiAgICAgIGNvbnN0IGVsc2VFeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZXJuYXJ5KGV4cHIsIHRoZW5FeHByLCBlbHNlRXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG51bGxDb2FsZXNjaW5nKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubG9naWNhbE9yKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCByaWdodEV4cHI6IEV4cHIuRXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OdWxsQ29hbGVzY2luZyhleHByLCByaWdodEV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsT3IoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsQW5kKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkFuZCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3NFcXVhbFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51cywgVG9rZW5UeXBlLlBsdXMpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtb2R1bHVzKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aXBsaWNhdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TbGFzaCwgVG9rZW5UeXBlLlN0YXIpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UeXBlb2YpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UeXBlb2YodmFsdWUsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgIFRva2VuVHlwZS5Eb2xsYXIsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzUGx1cyxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnVuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmV3S2V5d29yZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXdLZXl3b3JkKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk5ldykpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCBjb25zdHJ1Y3Q6IEV4cHIuRXhwciA9IHRoaXMucG9zdGZpeCgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QsIGtleXdvcmQubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBvc3RmaXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zdGZpeCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAxLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIC0xLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcbiAgICBsZXQgY29uc3VtZWQ6IGJvb2xlYW47XG4gICAgZG8ge1xuICAgICAgY29uc3VtZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XG4gICAgICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcGFyZW46IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgICAgICAgVG9rZW5UeXBlLlJpZ2h0UGFyZW4sXG4gICAgICAgICAgICBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgYXJndW1lbnRzYFxuICAgICAgICAgICk7XG4gICAgICAgICAgZXhwciA9IG5ldyBFeHByLkNhbGwoZXhwciwgcGFyZW4sIGFyZ3MsIHBhcmVuLmxpbmUpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3QsIFRva2VuVHlwZS5RdWVzdGlvbkRvdCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgZXhwcmVzc2lvbmApO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkdyb3VwaW5nKGV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlZvaWQpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRlYnVnKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGVidWcoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cblxuICAgIHRocm93IHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIGBFeHBlY3RlZCBleHByZXNzaW9uLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgICAvLyB1bnJlYWNoZWFibGUgY29kZVxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xuICB9XG5cbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBsZWZ0QnJhY2UgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIGBTdHJpbmcsIE51bWJlciBvciBJZGVudGlmaWVyIGV4cGVjdGVkIGFzIGEgS2V5IG9mIERpY3Rpb25hcnkgeywgdW5leHBlY3RlZCB0b2tlbiAke1xuICAgICAgICAgICAgdGhpcy5wZWVrKCkubGV4ZW1lXG4gICAgICAgICAgfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gIC8qKiBzY3JpcHRzIHNvdXJjZSBjb2RlICovXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xuICBwdWJsaWMgdG9rZW5zOiBUb2tlbltdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmdldFRva2VuKCk7XG4gICAgfVxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xuICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPj0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XG4gICAgICB0aGlzLmxpbmUrKztcbiAgICAgIHRoaXMuY29sID0gMDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgdGhpcy5jb2wrKztcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHRva2VuVHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lLCB0aGlzLmNvbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaChleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCArIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVDb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgY29tbWVudCwgZXhwZWN0aW5nIGNsb3NpbmcgXCIqL1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7cXVvdGV9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAvLyBUcmltIHRoZSBzdXJyb3VuZGluZyBxdW90ZXMuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XG4gICAgLy8gZ2V0cyBpbnRlZ2VyIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLlwiICYmIFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGV4cG9uZW50XG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCItXCIgfHwgdGhpcy5wZWVrKCkgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKSBhcyBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlO1xuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZVtjYXBpdGFsaXplZF0sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSBcIihcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIsXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNvbW1hLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiO1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TZW1pY29sb24sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJeXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNhcmV0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiOlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkNvbG9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlN0YXJFcXVhbCA6IFRva2VuVHlwZS5TdGFyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlBlcmNlbnRFcXVhbCA6IFRva2VuVHlwZS5QZXJjZW50LFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDogVG9rZW5UeXBlLlBpcGUsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIiZcIikgPyBUb2tlblR5cGUuQW5kIDogVG9rZW5UeXBlLkFtcGVyc2FuZCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5HcmVhdGVyRXF1YWwgOiBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiFcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5CYW5nRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiK1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTWludXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj5cIilcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxuICAgICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90LCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xuICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCIqXCIpKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYCdgOlxuICAgICAgY2FzZSBgXCJgOlxuICAgICAgY2FzZSBcImBcIjpcbiAgICAgICAgdGhpcy5zdHJpbmcoY2hhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gaWdub3JlIGNhc2VzXG4gICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNvbXBsZXggY2FzZXNcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc0FscGhhKGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7Y2hhcn0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYW4gRXJyb3IgKCR7dGhpcy5saW5lfToke3RoaXMuY29sfSkgPT4gJHttZXNzYWdlfWApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93W2tleSBhcyBrZXlvZiB0eXBlb2Ygd2luZG93XTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcblxuICAgIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIuZW50aXR5Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgIGV4cHIuZW50aXR5LmVudGl0eSxcbiAgICAgICAgZXhwci5lbnRpdHkua2V5LFxuICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoYEludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gcG9zdGZpeCBvcGVyYXRpb246ICR7ZXhwci5lbnRpdHl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKTtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvciBcIiArIGV4cHIub3BlcmF0b3IpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKVxuICAgICAgPyB0aGlzLmV2YWx1YXRlKGV4cHIudGhlbkV4cHIpXG4gICAgICA6IHRoaXMuZXZhbHVhdGUoZXhwci5lbHNlRXhwcik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogRXhwci5OdWxsQ29hbGVzY2luZyk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBpZiAobGVmdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICB9XG4gICAgcmV0dXJuIGxlZnQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogRXhwci5Hcm91cGluZyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5leHByZXNzaW9uKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpdGVyYWxFeHByKGV4cHI6IEV4cHIuTGl0ZXJhbCk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIudmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRVbmFyeUV4cHIoZXhwcjogRXhwci5VbmFyeSk6IGFueSB7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgICAgcmV0dXJuIC1yaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmc6XG4gICAgICAgIHJldHVybiAhcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogICR7ZXhwci5yaWdodH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICcgKyBleHByLm9wZXJhdG9yYCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoYCR7Y2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmApO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb25cbiAgICBpZiAoXG4gICAgICBleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0ICYmXG4gICAgICAoZXhwci5jYWxsZWUuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSB8fFxuICAgICAgICBleHByLmNhbGxlZS5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdyb3VwaW5nKVxuICAgICkge1xuICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXROZXdFeHByKGV4cHI6IEV4cHIuTmV3KTogYW55IHtcbiAgICBjb25zdCBuZXdDYWxsID0gZXhwci5jbGF6eiBhcyBFeHByLkNhbGw7XG4gICAgLy8gaW50ZXJuYWwgY2xhc3MgZGVmaW5pdGlvbiBpbnN0YW5jZVxuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShuZXdDYWxsLmNhbGxlZSk7XG5cbiAgICBpZiAodHlwZW9mIGNsYXp6ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgIGAnJHtjbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgbmV3Q2FsbC5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VHlwZW9mRXhwcihleHByOiBFeHByLlR5cGVvZik6IGFueSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWFjaEV4cHIoZXhwcjogRXhwci5FYWNoKTogYW55IHtcbiAgICByZXR1cm4gW1xuICAgICAgZXhwci5uYW1lLmxleGVtZSxcbiAgICAgIGV4cHIua2V5ID8gZXhwci5rZXkubGV4ZW1lIDogbnVsbCxcbiAgICAgIHRoaXMuZXZhbHVhdGUoZXhwci5pdGVyYWJsZSksXG4gICAgXTtcbiAgfVxuXG4gIHZpc2l0Vm9pZEV4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29sICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHtlb2ZFcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZyhcIidcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoJ1wiJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChcInt7XCIpKSB7IGRlcHRoKys7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPiAwICYmIHRoaXMubWF0Y2goXCJ9fVwiKSkgeyBkZXB0aC0tOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmIHRoaXMucGVlayhcIjxcIikpIHsgYnJlYWs7IH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCFyYXcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0aGlzLmRlY29kZUVudGl0aWVzKHJhdyksIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVFbnRpdGllcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiXFx1MDBhMFwiKVxuICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgIC5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcbiAgICAgIC5yZXBsYWNlKC8mYXBvczsvZywgXCInXCIpXG4gICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpOyAvLyBtdXN0IGJlIGxhc3QgdG8gYXZvaWQgZG91YmxlLWRlY29kaW5nXG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJ0eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxubGV0IGFjdGl2ZUVmZmVjdDogeyBmbjogTGlzdGVuZXI7IGRlcHM6IFNldDxhbnk+IH0gfCBudWxsID0gbnVsbDtcbmNvbnN0IGVmZmVjdFN0YWNrOiBhbnlbXSA9IFtdO1xuXG5leHBvcnQgY2xhc3MgU2lnbmFsPFQ+IHtcbiAgcHJpdmF0ZSBfdmFsdWU6IFQ7XG4gIHByaXZhdGUgc3Vic2NyaWJlcnMgPSBuZXcgU2V0PExpc3RlbmVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZTogVCkge1xuICAgIHRoaXMuX3ZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlcnMuYWRkKGFjdGl2ZUVmZmVjdC5mbik7XG4gICAgICBhY3RpdmVFZmZlY3QuZGVwcy5hZGQodGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogVCkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbSh0aGlzLnN1YnNjcmliZXJzKTtcbiAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzdWIoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFZmZlY3QgZXJyb3I6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5zdWJzY3JpYmUoZm46IExpc3RlbmVyKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5kZWxldGUoZm4pO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7IHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSk7IH1cbiAgcGVlaygpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlZmZlY3QoZm46IExpc3RlbmVyKSB7XG4gIGNvbnN0IGVmZmVjdE9iaiA9IHtcbiAgICBmbjogKCkgPT4ge1xuICAgICAgZWZmZWN0T2JqLmRlcHMuZm9yRWFjaChzaWcgPT4gc2lnLnVuc3Vic2NyaWJlKGVmZmVjdE9iai5mbikpO1xuICAgICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcblxuICAgICAgZWZmZWN0U3RhY2sucHVzaChlZmZlY3RPYmopO1xuICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0T2JqO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGVmZmVjdFN0YWNrLnBvcCgpO1xuICAgICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RTdGFja1tlZmZlY3RTdGFjay5sZW5ndGggLSAxXSB8fCBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVwczogbmV3IFNldDxTaWduYWw8YW55Pj4oKVxuICB9O1xuXG4gIGVmZmVjdE9iai5mbigpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbmFsPFQ+KGluaXRpYWxWYWx1ZTogVCk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgU2lnbmFsKGluaXRpYWxWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlZDxUPihmbjogKCkgPT4gVCk6IFNpZ25hbDxUPiB7XG4gIGNvbnN0IHMgPSBzaWduYWw8VD4odW5kZWZpbmVkIGFzIGFueSk7XG4gIGVmZmVjdCgoKSA9PiB7XG4gICAgcy52YWx1ZSA9IGZuKCk7XG4gIH0pO1xuICByZXR1cm4gcztcbn1cbiIsImV4cG9ydCBjbGFzcyBCb3VuZGFyeSB7XG4gIHByaXZhdGUgc3RhcnQ6IENvbW1lbnQ7XG4gIHByaXZhdGUgZW5kOiBDb21tZW50O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogTm9kZSwgbGFiZWw6IHN0cmluZyA9IFwiYm91bmRhcnlcIikge1xuICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1zdGFydGApO1xuICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tZW5kYCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuc3RhcnQpO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIHRvUmVtb3ZlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRvUmVtb3ZlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmVuZC5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUobm9kZSwgdGhpcy5lbmQpO1xuICB9XG5cbiAgcHVibGljIG5vZGVzKCk6IE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBOb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBOb2RlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucGFyZW50Tm9kZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IGVmZmVjdCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgQm91bmRhcnkgfSBmcm9tIFwiLi9ib3VuZGFyeVwiO1xuaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBJZkVsc2VOb2RlID0gW0tOb2RlLkVsZW1lbnQsIEtOb2RlLkF0dHJpYnV0ZV07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XG4gIHByaXZhdGUgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5ID0ge307XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IHsgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5IH0pIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucmVnaXN0cnkpIHtcbiAgICAgIHRoaXMucmVnaXN0cnkgPSBvcHRpb25zLnJlZ2lzdHJ5O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBub2RlLmFjY2VwdCh0aGlzLCBwYXJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBiaW5kTWV0aG9kcyhlbnRpdHk6IGFueSk6IHZvaWQge1xuICAgIGlmICghZW50aXR5IHx8IHR5cGVvZiBlbnRpdHkgIT09IFwib2JqZWN0XCIpIHJldHVybjtcblxuICAgIGxldCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihlbnRpdHkpO1xuICAgIHdoaWxlIChwcm90byAmJiBwcm90byAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgZW50aXR5W2tleV0gPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgIGtleSAhPT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlbnRpdHksIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW50aXR5W2tleV0gPSBlbnRpdHlba2V5XS5iaW5kKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGVzIGFuIGVmZmVjdCB0aGF0IHJlc3RvcmVzIHRoZSBjdXJyZW50IHNjb3BlIG9uIGV2ZXJ5IHJlLXJ1bixcbiAgLy8gc28gZWZmZWN0cyBzZXQgdXAgaW5zaWRlIEBlYWNoIGFsd2F5cyBldmFsdWF0ZSBpbiB0aGVpciBpdGVtIHNjb3BlLlxuICBwcml2YXRlIHNjb3BlZEVmZmVjdChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0WzBdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRyYW5zcGlsZShcbiAgICBub2RlczogS05vZGUuS05vZGVbXSxcbiAgICBlbnRpdHk6IGFueSxcbiAgICBjb250YWluZXI6IEVsZW1lbnRcbiAgKTogTm9kZSB7XG4gICAgdGhpcy5kZXN0cm95KGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuaW5pdChlbnRpdHkpO1xuICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGNvbnRhaW5lcik7XG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXh0S05vZGUobm9kZTogS05vZGUuVGV4dCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihlLm1lc3NhZ2UgfHwgYCR7ZX1gLCBcInRleHQgbm9kZVwiKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYXR0ci52YWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGF0dHIsIHN0b3ApO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChyZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja0VmZmVjdCh0YXJnZXQ6IGFueSwgc3RvcDogKCkgPT4gdm9pZCkge1xuICAgIGlmICghdGFyZ2V0LiRrYXNwZXJFZmZlY3RzKSB0YXJnZXQuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB0YXJnZXQuJGthc3BlckVmZmVjdHMucHVzaChzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEF0dHIoXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcbiAgICBuYW1lOiBzdHJpbmdbXVxuICApOiBLTm9kZS5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuYXR0cmlidXRlcyB8fCAhbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmliID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+XG4gICAgICBuYW1lLmluY2x1ZGVzKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZSlcbiAgICApO1xuICAgIGlmIChhdHRyaWIpIHtcbiAgICAgIHJldHVybiBhdHRyaWIgYXMgS05vZGUuQXR0cmlidXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9JZihleHByZXNzaW9uczogSWZFbHNlTm9kZVtdLCBwYXJlbnQ6IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiaWZcIik7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgIGJvdW5kYXJ5LmNsZWFyKCk7XG5cbiAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvbnNbMF1bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICBpZiAoJGlmKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uc1swXVswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMuc2xpY2UoMSwgZXhwcmVzc2lvbnMubGVuZ3RoKSkge1xuICAgICAgICBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlaWZcIl0pKSB7XG4gICAgICAgICAgY29uc3QgJGVsc2VpZiA9IHRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvblsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICBpZiAoJGVsc2VpZikge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlXCJdKSkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuXG4gICAgaWYgKGtleUF0dHIpIHtcbiAgICAgIC8vIEtleWVkIHJlY29uY2lsaWF0aW9uIOKAlCByZXVzZSBET00gbm9kZXMgd2hvc2Uga2V5IG1hdGNoZXNcbiAgICAgIGNvbnN0IGtleWVkTm9kZXMgPSBuZXcgTWFwPGFueSwgTm9kZT4oKTtcblxuICAgICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgICBjb25zdCBbbmFtZSwgaW5kZXhLZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXNcbiAgICAgICAgY29uc3QgbmV3SXRlbXM6IEFycmF5PHsgaXRlbTogYW55OyBpZHg6IG51bWJlcjsga2V5OiBhbnkgfT4gPSBbXTtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpbmRleDtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcbiAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG4gICAgICAgICAgbmV3SXRlbXMucHVzaCh7IGl0ZW0sIGlkeDogaW5kZXgsIGtleSB9KTtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBkb21Ob2RlXSBvZiBrZXllZE5vZGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgeyBpdGVtLCBpZHgsIGtleSB9IG9mIG5ld0l0ZW1zKSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG5cbiAgICAgICAgICBpZiAoa2V5ZWROb2Rlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgLy8gTW92ZSBleGlzdGluZyBub2RlIHRvIGN1cnJlbnQgZW5kIG9mIGJvdW5kYXJ5IChwcmVzZXJ2ZXMgaXRzIGVmZmVjdHMpXG4gICAgICAgICAgICBib3VuZGFyeS5pbnNlcnQoa2V5ZWROb2Rlcy5nZXQoa2V5KSEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IG5vZGVcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIGlmIChjcmVhdGVkKSBrZXllZE5vZGVzLnNldChrZXksIGNyZWF0ZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbmtleWVkIOKAlCBmdWxsIGNsZWFyIGFuZCByZWJ1aWxkXG4gICAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbigoZWFjaCBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgY29uc3QgW25hbWUsIGtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgICBpZiAoa2V5KSBzY29wZVZhbHVlc1trZXldID0gaW5kZXg7XG5cbiAgICAgICAgICBjb25zdCBpdGVtU2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBpdGVtU2NvcGU7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRvV2hpbGUoJHdoaWxlOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJ3aGlsZVwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICAgIHdoaWxlICh0aGlzLmV4ZWN1dGUoJHdoaWxlLnZhbHVlKSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICAvLyBleGVjdXRlcyBpbml0aWFsaXphdGlvbiBpbiB0aGUgY3VycmVudCBzY29wZVxuICBwcml2YXRlIGRvTGV0KGluaXQ6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgdGhpcy5leGVjdXRlKGluaXQudmFsdWUpO1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRyZWZcIiwgZWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVNpYmxpbmdzKG5vZGVzOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSAwO1xuICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZXNbY3VycmVudCsrXTtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgIGNvbnN0ICRlYWNoID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlYWNoXCJdKTtcbiAgICAgICAgaWYgKCRlYWNoKSB7XG4gICAgICAgICAgdGhpcy5kb0VhY2goJGVhY2gsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkaWYgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGlmXCJdKTtcbiAgICAgICAgaWYgKCRpZikge1xuICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10gPSBbW25vZGUgYXMgS05vZGUuRWxlbWVudCwgJGlmXV07XG5cbiAgICAgICAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgW1xuICAgICAgICAgICAgICBcIkBlbHNlXCIsXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKFtub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBhdHRyXSk7XG4gICAgICAgICAgICAgIGN1cnJlbnQgKz0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZG9JZihleHByZXNzaW9ucywgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkd2hpbGUgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQHdoaWxlXCJdKTtcbiAgICAgICAgaWYgKCR3aGlsZSkge1xuICAgICAgICAgIHRoaXMuZG9XaGlsZSgkd2hpbGUsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkbGV0ID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBsZXRcIl0pO1xuICAgICAgICBpZiAoJGxldCkge1xuICAgICAgICAgIHRoaXMuZG9MZXQoJGxldCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5ldmFsdWF0ZShub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudChub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChub2RlLm5hbWUgPT09IFwic2xvdFwiKSB7XG4gICAgICAgIGNvbnN0IG5hbWVBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJuYW1lXCJdKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVBdHRyID8gbmFtZUF0dHIudmFsdWUgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgY29uc3Qgc2xvdHMgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRzbG90c1wiKTtcbiAgICAgICAgaWYgKHNsb3RzICYmIHNsb3RzW25hbWVdKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhzbG90c1tuYW1lXSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1ZvaWQgPSBub2RlLm5hbWUgPT09IFwidm9pZFwiO1xuICAgICAgY29uc3QgaXNDb21wb25lbnQgPSAhIXRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBpc1ZvaWQgPyBwYXJlbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSk7XG4gICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCBzY29wZVxuICAgICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSB7fTtcbiAgICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBjaGlsZHJlbiBmb3Igc2xvdHNcbiAgICAgICAgY29uc3Qgc2xvdHM6IFJlY29yZDxzdHJpbmcsIEtOb2RlLktOb2RlW10+ID0geyBkZWZhdWx0OiBbXSB9O1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHNsb3RBdHRyID0gdGhpcy5maW5kQXR0cihjaGlsZCBhcyBLTm9kZS5FbGVtZW50LCBbXCJzbG90XCJdKTtcbiAgICAgICAgICAgIGlmIChzbG90QXR0cikge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc2xvdEF0dHIudmFsdWU7XG4gICAgICAgICAgICAgIGlmICghc2xvdHNbbmFtZV0pIHNsb3RzW25hbWVdID0gW107XG4gICAgICAgICAgICAgIHNsb3RzW25hbWVdLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2xvdHMuZGVmYXVsdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0uY29tcG9uZW50KHtcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICByZWY6IGVsZW1lbnQsXG4gICAgICAgICAgICB0cmFuc3BpbGVyOiB0aGlzLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5iaW5kTWV0aG9kcyhjb21wb25lbnQpO1xuICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gY29tcG9uZW50O1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuJG9uSW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnQuJG9uSW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHBvc2Ugc2xvdHMgaW4gY29tcG9uZW50IHNjb3BlXG4gICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMsIGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC4kb25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGNvbXBvbmVudC4kb25SZW5kZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVm9pZCkge1xuICAgICAgICAvLyBldmVudCBiaW5kaW5nXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQgYXMgS05vZGUuQXR0cmlidXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZ3VsYXIgYXR0cmlidXRlcyAocHJvY2Vzc2VkIGZpcnN0KVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcihcbiAgICAgICAgICAoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNob3J0aGFuZCBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgc2Vjb25kLCBhbGxvd3MgbWVyZ2luZylcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kQXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBuYW1lLnN0YXJ0c1dpdGgoXCJAXCIpICYmXG4gICAgICAgICAgICAhW1wiQGlmXCIsIFwiQGVsc2VpZlwiLCBcIkBlbHNlXCIsIFwiQGVhY2hcIiwgXCJAd2hpbGVcIiwgXCJAbGV0XCIsIFwiQGtleVwiXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIikgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzaG9ydGhhbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgcmVhbE5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgbGV0IGxhc3REeW5hbWljVmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXRpY0NsYXNzID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gc3RhdGljQ2xhc3Muc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihjID0+IGMgIT09IGxhc3REeW5hbWljVmFsdWUgJiYgYyAhPT0gXCJcIilcbiAgICAgICAgICAgICAgICAuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY3VycmVudENsYXNzZXMgPyBgJHtjdXJyZW50Q2xhc3Nlc30gJHt2YWx1ZX1gIDogdmFsdWU7XG4gICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgIGxhc3REeW5hbWljVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5yZW1vdmVBdHRyaWJ1dGUocmVhbE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgPyBgJHtleGlzdGluZy5lbmRzV2l0aChcIjtcIikgPyBleGlzdGluZyA6IGV4aXN0aW5nICsgXCI7XCJ9ICR7dmFsdWV9YFxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShyZWFsTmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnNlbGYpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZS5jaGlsZHJlbiwgZWxlbWVudCk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuXG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRoaXMuZXJyb3IoZS5tZXNzYWdlIHx8IGAke2V9YCwgbm9kZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5leGVjdXRlKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgW2V2ZW50TmFtZSwgLi4ubW9kaWZpZXJzXSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGxpc3RlbmVyU2NvcGUgPSBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbCA9IGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkgICAgb3B0aW9ucy5vbmNlICAgID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSkgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChldmVudCkgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInByZXZlbnRcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic3RvcFwiKSkgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICB0aGlzLmV4ZWN1dGUoYXR0ci52YWx1ZSwgbGlzdGVuZXJTY29wZSk7XG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlVGVtcGxhdGVTdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb25zdCByZWdleCA9IC9cXHtcXHsuK1xcfVxcfS9tcztcbiAgICBpZiAocmVnZXgudGVzdCh0ZXh0KSkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24ocGxhY2Vob2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24oc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gYCR7dGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKX1gO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95Tm9kZShub2RlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyAxLiBDbGVhbnVwIGNvbXBvbmVudCBpbnN0YW5jZVxuICAgIGlmIChub2RlLiRrYXNwZXJJbnN0YW5jZSkge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBub2RlLiRrYXNwZXJJbnN0YW5jZTtcbiAgICAgIGlmIChpbnN0YW5jZS4kb25EZXN0cm95KSBpbnN0YW5jZS4kb25EZXN0cm95KCk7XG4gICAgICBpZiAoaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5hYm9ydCgpO1xuICAgIH1cblxuICAgIC8vIDIuIENsZWFudXAgZWZmZWN0cyBhdHRhY2hlZCB0byB0aGUgbm9kZVxuICAgIGlmIChub2RlLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgfVxuXG4gICAgLy8gMy4gQ2xlYW51cCBlZmZlY3RzIG9uIGF0dHJpYnV0ZXNcbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBhdHRyID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBpZiAoYXR0ci4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA0LiBSZWN1cnNlXG4gICAgbm9kZS5jaGlsZE5vZGVzPy5mb3JFYWNoKChjaGlsZDogYW55KSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveShjb250YWluZXI6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RG9jdHlwZUtOb2RlKF9ub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgdGFnTmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IG1lc3NhZ2Uuc3RhcnRzV2l0aChcIlJ1bnRpbWUgRXJyb3JcIilcbiAgICAgID8gbWVzc2FnZVxuICAgICAgOiBgUnVudGltZSBFcnJvcjogJHttZXNzYWdlfWA7XG5cbiAgICBpZiAodGFnTmFtZSAmJiAhY2xlYW5NZXNzYWdlLmluY2x1ZGVzKGBhdCA8JHt0YWdOYW1lfT5gKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2NsZWFuTWVzc2FnZX1cXG4gIGF0IDwke3RhZ05hbWV9PmApO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihjbGVhbk1lc3NhZ2UpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnQsXG4gIHJlZ2lzdHJ5PzogQ29tcG9uZW50UmVnaXN0cnlcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IHx8IHt9IH0pO1xuICBjb25zdCByZXN1bHQgPSB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgZW50aXR5IHx8IHt9LCBjb250YWluZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXIoQ29tcG9uZW50Q2xhc3M6IGFueSkge1xuICBLYXNwZXJJbml0KHtcbiAgICByb290OiBcImthc3Blci1hcHBcIixcbiAgICBlbnRyeTogXCJrYXNwZXItcm9vdFwiLFxuICAgIHJlZ2lzdHJ5OiB7XG4gICAgICBcImthc3Blci1yb290XCI6IHtcbiAgICAgICAgc2VsZWN0b3I6IFwidGVtcGxhdGVcIixcbiAgICAgICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcyxcbiAgICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59XG5cbmludGVyZmFjZSBBcHBDb25maWcge1xuICByb290Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG4gIGVudHJ5Pzogc3RyaW5nO1xuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChcbiAgdHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeVxuKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZWdpc3RyeVt0YWddLmNvbXBvbmVudCh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiByZWdpc3RyeVt0YWddLm5vZGVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZWdpc3RyeShcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5LFxuICBwYXJzZXI6IFRlbXBsYXRlUGFyc2VyXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0geyAuLi5yZWdpc3RyeSB9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWdpc3RyeSkpIHtcbiAgICBjb25zdCBlbnRyeSA9IHJlZ2lzdHJ5W2tleV07XG4gICAgaWYgKGVudHJ5Lm5vZGVzICYmIGVudHJ5Lm5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZW50cnkuc2VsZWN0b3IpO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgZW50cnkudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgIGVudHJ5Lm5vZGVzID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLmlubmVySFRNTCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXJJbml0KGNvbmZpZzogQXBwQ29uZmlnKSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCByb290ID1cbiAgICB0eXBlb2YgY29uZmlnLnJvb3QgPT09IFwic3RyaW5nXCJcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdClcbiAgICAgIDogY29uZmlnLnJvb3Q7XG5cbiAgaWYgKCFyb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSb290IGVsZW1lbnQgbm90IGZvdW5kOiAke2NvbmZpZy5yb290fWApO1xuICB9XG5cbiAgY29uc3QgcmVnaXN0cnkgPSBub3JtYWxpemVSZWdpc3RyeShjb25maWcucmVnaXN0cnksIHBhcnNlcik7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB9KTtcbiAgY29uc3QgZW50cnlUYWcgPSBjb25maWcuZW50cnkgfHwgXCJrYXNwZXItYXBwXCI7XG5cbiAgY29uc3QgeyBub2RlLCBpbnN0YW5jZSwgbm9kZXMgfSA9IGNyZWF0ZUNvbXBvbmVudChcbiAgICB0cmFuc3BpbGVyLFxuICAgIGVudHJ5VGFnLFxuICAgIHJlZ2lzdHJ5XG4gICk7XG5cbiAgaWYgKHJvb3QpIHtcbiAgICByb290LmlubmVySFRNTCA9IFwiXCI7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChub2RlKTtcbiAgfVxuXG4gIC8vIEluaXRpYWwgcmVuZGVyIGFuZCBsaWZlY3ljbGVcbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS4kb25Jbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS4kb25Jbml0KCk7XG4gIH1cblxuICB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgaW5zdGFuY2UsIG5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2UuJG9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS4kb25SZW5kZXIoKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cbiIsImltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld2VyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHN0cmluZz4ge1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUuYWNjZXB0KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zcGlsZShub2RlczogS05vZGUuS05vZGVbXSk6IHN0cmluZ1tdIHtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZXZhbHVhdGUobm9kZSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcy5tYXAoKGF0dHIpID0+IHRoaXMuZXZhbHVhdGUoYXR0cikpLmpvaW4oXCIgXCIpO1xyXG4gICAgaWYgKGF0dHJzLmxlbmd0aCkge1xyXG4gICAgICBhdHRycyA9IFwiIFwiICsgYXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfS8+YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSkuam9pbihcIlwiKTtcclxuICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9PiR7Y2hpbGRyZW59PC8ke25vZGUubmFtZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSk6IHN0cmluZyB7XHJcbiAgICBpZiAobm9kZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gYCR7bm9kZS5uYW1lfT1cIiR7bm9kZS52YWx1ZX1cImA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5uYW1lO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUudmFsdWVcclxuICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcclxuICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csIFwiJm5ic3A7XCIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGA8IS0tICR7bm9kZS52YWx1ZX0gLS0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCFkb2N0eXBlICR7bm9kZS52YWx1ZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBleGVjdXRlLCB0cmFuc3BpbGUsIEthc3BlciwgS2FzcGVySW5pdCB9IGZyb20gXCIuL2thc3BlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgVmlld2VyIH0gZnJvbSBcIi4vdmlld2VyXCI7XG5pbXBvcnQgeyBzaWduYWwsIGVmZmVjdCwgY29tcHV0ZWQgfSBmcm9tIFwiLi9zaWduYWxcIjtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgKCh3aW5kb3cgYXMgYW55KSB8fCB7fSkua2FzcGVyID0ge1xuICAgIGV4ZWN1dGU6IGV4ZWN1dGUsXG4gICAgdHJhbnNwaWxlOiB0cmFuc3BpbGUsXG4gICAgQXBwOiBLYXNwZXJJbml0LFxuICAgIENvbXBvbmVudDogQ29tcG9uZW50LFxuICAgIFRlbXBsYXRlUGFyc2VyOiBUZW1wbGF0ZVBhcnNlcixcbiAgICBUcmFuc3BpbGVyOiBUcmFuc3BpbGVyLFxuICAgIFZpZXdlcjogVmlld2VyLFxuICAgIHNpZ25hbDogc2lnbmFsLFxuICAgIGVmZmVjdDogZWZmZWN0LFxuICAgIGNvbXB1dGVkOiBjb21wdXRlZCxcbiAgfTtcbiAgKHdpbmRvdyBhcyBhbnkpW1wiS2FzcGVyXCJdID0gS2FzcGVyO1xuICAod2luZG93IGFzIGFueSlbXCJDb21wb25lbnRcIl0gPSBDb21wb25lbnQ7XG59XG5cbmV4cG9ydCB7IEV4cHJlc3Npb25QYXJzZXIsIEludGVycHJldGVyLCBTY2FubmVyLCBUZW1wbGF0ZVBhcnNlciwgVHJhbnNwaWxlciwgVmlld2VyLCBzaWduYWwsIGVmZmVjdCwgY29tcHV0ZWQgfTtcbmV4cG9ydCB7IGV4ZWN1dGUsIHRyYW5zcGlsZSwgS2FzcGVyLCBLYXNwZXJJbml0IGFzIEFwcCwgQ29tcG9uZW50IH07XG4iXSwibmFtZXMiOlsiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5UZXJuYXJ5IiwiRXhwci5OdWxsQ29hbGVzY2luZyIsIkV4cHIuTG9naWNhbCIsIkV4cHIuVHlwZW9mIiwiRXhwci5VbmFyeSIsIkV4cHIuTmV3IiwiRXhwci5Qb3N0Zml4IiwiRXhwci5DYWxsIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsInNlbGYiLCJOb2RlLkNvbW1lbnQiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCJdLCJtYXBwaW5ncyI6Ijs7OztFQVNPLE1BQU0sVUFBVTtBQUFBLElBTXJCLFlBQVksT0FBdUI7QUFMbkMsV0FBQSxPQUE0QixDQUFBO0FBRzVCLFdBQUEsbUJBQW1CLElBQUksZ0JBQUE7QUFHckIsVUFBSSxDQUFDLE9BQU87QUFDVixhQUFLLE9BQU8sQ0FBQTtBQUNaO0FBQUEsTUFDRjtBQUNBLFVBQUksTUFBTSxNQUFNO0FBQ2QsYUFBSyxPQUFPLE1BQU0sUUFBUSxDQUFBO0FBQUEsTUFDNUI7QUFDQSxVQUFJLE1BQU0sS0FBSztBQUNiLGFBQUssTUFBTSxNQUFNO0FBQUEsTUFDbkI7QUFDQSxVQUFJLE1BQU0sWUFBWTtBQUNwQixhQUFLLGFBQWEsTUFBTTtBQUFBLE1BQzFCO0FBQUEsSUFDRjtBQUFBLElBRUEsVUFBVTtBQUFBLElBQUM7QUFBQSxJQUNYLFlBQVk7QUFBQSxJQUFDO0FBQUEsSUFDYixhQUFhO0FBQUEsSUFBQztBQUFBLElBQ2QsYUFBYTtBQUFBLElBQUM7QUFBQSxJQUVkLFlBQVk7QUFDVixVQUFJLENBQUMsS0FBSyxZQUFZO0FB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Q0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLEtBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxnQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGlCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxlQUFBQSxXQUFBLEtBQUEs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
