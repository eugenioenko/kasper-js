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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3NpZ25hbC50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy90cmFuc3BpbGVyLnRzIiwiLi4vc3JjL2thc3Blci50cyIsIi4uL3NyYy92aWV3ZXIudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3Mge1xuICBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgb25Jbml0KCkge31cbiAgb25SZW5kZXIoKSB7fVxuICBvbkNoYW5nZXMoKSB7fVxuICBvbkRlc3Ryb3koKSB7fVxuXG4gICRkb1JlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMudHJhbnNwaWxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdHlwZSBLYXNwZXJFbnRpdHkgPSBDb21wb25lbnQgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50Q2xhc3MgPSB7IG5ldyAoYXJncz86IENvbXBvbmVudEFyZ3MpOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgICB0ZW1wbGF0ZTogRWxlbWVudDtcbiAgICBub2RlczogS05vZGVbXTtcbiAgfTtcbn1cbiIsImV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICBzdXBlcihgUGFyc2UgRXJyb3IgKCR7bGluZX06JHtjb2x9KSA9PiAke3ZhbHVlfWApO1xuICAgIHRoaXMubmFtZSA9IFwiS2FzcGVyRXJyb3JcIjtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sID0gY29sO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAndG9rZW4nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXhwciB7XG4gIHB1YmxpYyByZXN1bHQ6IGFueTtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBpbnRlcmZhY2UgRXhwclZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0QXNzaWduRXhwcihleHByOiBBc3NpZ24pOiBSO1xuICAgIHZpc2l0QmluYXJ5RXhwcihleHByOiBCaW5hcnkpOiBSO1xuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcjogQ2FsbCk6IFI7XG4gICAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRGVidWcpOiBSO1xuICAgIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRGljdGlvbmFyeSk6IFI7XG4gICAgdmlzaXRFYWNoRXhwcihleHByOiBFYWNoKTogUjtcbiAgICB2aXNpdEdldEV4cHIoZXhwcjogR2V0KTogUjtcbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBHcm91cGluZyk6IFI7XG4gICAgdmlzaXRLZXlFeHByKGV4cHI6IEtleSk6IFI7XG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByOiBMb2dpY2FsKTogUjtcbiAgICB2aXNpdExpc3RFeHByKGV4cHI6IExpc3QpOiBSO1xuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogTGl0ZXJhbCk6IFI7XG4gICAgdmlzaXROZXdFeHByKGV4cHI6IE5ldyk6IFI7XG4gICAgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogTnVsbENvYWxlc2NpbmcpOiBSO1xuICAgIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogUG9zdGZpeCk6IFI7XG4gICAgdmlzaXRTZXRFeHByKGV4cHI6IFNldCk6IFI7XG4gICAgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogVGVtcGxhdGUpOiBSO1xuICAgIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogVGVybmFyeSk6IFI7XG4gICAgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IFR5cGVvZik6IFI7XG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcjogVW5hcnkpOiBSO1xuICAgIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IFZhcmlhYmxlKTogUjtcbiAgICB2aXNpdFZvaWRFeHByKGV4cHI6IFZvaWQpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgQXNzaWduIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXNzaWduJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkJpbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2FsbGVlOiBFeHByO1xuICAgIHB1YmxpYyBwYXJlbjogVG9rZW47XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKGNhbGxlZTogRXhwciwgcGFyZW46IFRva2VuLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgdGhpcy5wYXJlbiA9IHBhcmVuO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdENhbGxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQ2FsbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVidWdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGVidWcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHByb3BlcnRpZXM6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGljdGlvbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EaWN0aW9uYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWFjaCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMga2V5OiBUb2tlbjtcbiAgICBwdWJsaWMgaXRlcmFibGU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwga2V5OiBUb2tlbiwgaXRlcmFibGU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVhY2hFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRWFjaCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHR5cGU6IFRva2VuVHlwZSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JvdXBpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdyb3VwaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5LZXknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dpY2FsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TG9naWNhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Mb2dpY2FsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpc3QnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGl0ZXJhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjbGF6ejogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGF6eiA9IGNsYXp6O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE5ld0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OZXcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsQ29hbGVzY2luZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE51bGxDb2FsZXNjaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk51bGxDb2FsZXNjaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9zdGZpeCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQb3N0Zml4RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBvc3RmaXgnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlbXBsYXRlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlbXBsYXRlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVybmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjb25kaXRpb246IEV4cHI7XG4gICAgcHVibGljIHRoZW5FeHByOiBFeHByO1xuICAgIHB1YmxpYyBlbHNlRXhwcjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbjogRXhwciwgdGhlbkV4cHI6IEV4cHIsIGVsc2VFeHByOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgICAgIHRoaXMudGhlbkV4cHIgPSB0aGVuRXhwcjtcbiAgICAgICAgdGhpcy5lbHNlRXhwciA9IGVsc2VFeHByO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlcm5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVybmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVvZiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFR5cGVvZkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UeXBlb2YnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlVuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VmFyaWFibGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVmFyaWFibGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWb2lkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Vm9pZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Wb2lkJztcbiAgfVxufVxuXG4iLCJleHBvcnQgZW51bSBUb2tlblR5cGUge1xyXG4gIC8vIFBhcnNlciBUb2tlbnNcclxuICBFb2YsXHJcbiAgUGFuaWMsXHJcblxyXG4gIC8vIFNpbmdsZSBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQW1wZXJzYW5kLFxyXG4gIEF0U2lnbixcclxuICBDYXJldCxcclxuICBDb21tYSxcclxuICBEb2xsYXIsXHJcbiAgRG90LFxyXG4gIEhhc2gsXHJcbiAgTGVmdEJyYWNlLFxyXG4gIExlZnRCcmFja2V0LFxyXG4gIExlZnRQYXJlbixcclxuICBQZXJjZW50LFxyXG4gIFBpcGUsXHJcbiAgUmlnaHRCcmFjZSxcclxuICBSaWdodEJyYWNrZXQsXHJcbiAgUmlnaHRQYXJlbixcclxuICBTZW1pY29sb24sXHJcbiAgU2xhc2gsXHJcbiAgU3RhcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQXJyb3csXHJcbiAgQmFuZyxcclxuICBCYW5nRXF1YWwsXHJcbiAgQmFuZ0VxdWFsRXF1YWwsXHJcbiAgQ29sb24sXHJcbiAgRXF1YWwsXHJcbiAgRXF1YWxFcXVhbCxcclxuICBFcXVhbEVxdWFsRXF1YWwsXHJcbiAgR3JlYXRlcixcclxuICBHcmVhdGVyRXF1YWwsXHJcbiAgTGVzcyxcclxuICBMZXNzRXF1YWwsXHJcbiAgTWludXMsXHJcbiAgTWludXNFcXVhbCxcclxuICBNaW51c01pbnVzLFxyXG4gIFBlcmNlbnRFcXVhbCxcclxuICBQbHVzLFxyXG4gIFBsdXNFcXVhbCxcclxuICBQbHVzUGx1cyxcclxuICBRdWVzdGlvbixcclxuICBRdWVzdGlvbkRvdCxcclxuICBRdWVzdGlvblF1ZXN0aW9uLFxyXG4gIFNsYXNoRXF1YWwsXHJcbiAgU3RhckVxdWFsLFxyXG4gIERvdERvdCxcclxuICBEb3REb3REb3QsXHJcbiAgTGVzc0VxdWFsR3JlYXRlcixcclxuXHJcbiAgLy8gTGl0ZXJhbHNcclxuICBJZGVudGlmaWVyLFxyXG4gIFRlbXBsYXRlLFxyXG4gIFN0cmluZyxcclxuICBOdW1iZXIsXHJcblxyXG4gIC8vIEtleXdvcmRzXHJcbiAgQW5kLFxyXG4gIENvbnN0LFxyXG4gIERlYnVnLFxyXG4gIEZhbHNlLFxyXG4gIEluc3RhbmNlb2YsXHJcbiAgTmV3LFxyXG4gIE51bGwsXHJcbiAgVW5kZWZpbmVkLFxyXG4gIE9mLFxyXG4gIE9yLFxyXG4gIFRydWUsXHJcbiAgVHlwZW9mLFxyXG4gIFZvaWQsXHJcbiAgV2l0aCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XHJcbiAgcHVibGljIGxpdGVyYWw6IGFueTtcclxuICBwdWJsaWMgbGV4ZW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHlwZTogVG9rZW5UeXBlLFxyXG4gICAgbGV4ZW1lOiBzdHJpbmcsXHJcbiAgICBsaXRlcmFsOiBhbnksXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2w6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5uYW1lID0gVG9rZW5UeXBlW3R5cGVdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGV4ZW1lID0gbGV4ZW1lO1xyXG4gICAgdGhpcy5saXRlcmFsID0gbGl0ZXJhbDtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiBgWygke3RoaXMubGluZX0pOlwiJHt0aGlzLmxleGVtZX1cIl1gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uUGFyc2VyIHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xuXG4gIHB1YmxpYyBwYXJzZSh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHJbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLnR5cGVzOiBUb2tlblR5cGVbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogVG9rZW4ge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnRdO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmV2aW91cygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCAtIDFdO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayh0eXBlOiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrKFRva2VuVHlwZS5Fb2YpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdW1lKHR5cGU6IFRva2VuVHlwZSwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIG1lc3NhZ2UgKyBgLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IodG9rZW46IFRva2VuLCBtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0b2tlbi5saW5lLCB0b2tlbi5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBzeW5jaHJvbml6ZSgpOiB2b2lkIHtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfSB3aGlsZSAoIXRoaXMuZW9mKCkpO1xuICB9XG5cbiAgcHVibGljIGZvcmVhY2godG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdGVkIGFuIGlkZW50aWZpZXIgaW5zaWRlIFwiZWFjaFwiIHN0YXRlbWVudGBcbiAgICApO1xuXG4gICAgbGV0IGtleTogVG9rZW4gPSBudWxsO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5XaXRoKSkge1xuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxuICAgICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgICAgYEV4cGVjdGVkIGEgXCJrZXlcIiBpZGVudGlmaWVyIGFmdGVyIFwid2l0aFwiIGtleXdvcmQgaW4gZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5PZixcbiAgICAgIGBFeHBlY3RlZCBcIm9mXCIga2V5d29yZCBpbnNpZGUgZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgKTtcbiAgICBjb25zdCBpdGVyYWJsZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHJlc3Npb246IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7XG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7IC8qIGNvbnN1bWUgc2VtaWNvbG9ucyAqLyB9XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKG9wZXJhdG9yLCBgSW52YWxpZCBsLXZhbHVlLCBpcyBub3QgYW4gYXNzaWduaW5nIHRhcmdldC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRlcm5hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHRoZW5FeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQ29sb24sIGBFeHBlY3RlZCBcIjpcIiBhZnRlciB0ZXJuYXJ5ID8gZXhwcmVzc2lvbmApO1xuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlcm5hcnkoZXhwciwgdGhlbkV4cHIsIGVsc2VFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5sb2dpY2FsT3IoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk51bGxDb2FsZXNjaW5nKGV4cHIsIHJpZ2h0RXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk9yKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxBbmQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBlcXVhbGl0eSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgd2hpbGUgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxuICAgICAgICBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkaXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzLCBUb2tlblR5cGUuUGx1cykpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QZXJjZW50KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG11bHRpcGxpY2F0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdHlwZW9mKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuYXJ5KCk7XG4gIH1cblxuICBwcml2YXRlIHVuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5wb3N0Zml4KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucG9zdGZpeCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3N0Zml4KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuY2FsbCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIDEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgLTEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZDogYm9vbGVhbjtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY29uc3QgYXJnczogRXhwci5FeHByW10gPSBbXTtcbiAgICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwYXJlbjogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgICAgICBUb2tlblR5cGUuUmlnaHRQYXJlbixcbiAgICAgICAgICAgIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgXG4gICAgICAgICAgKTtcbiAgICAgICAgICBleHByID0gbmV3IEV4cHIuQ2FsbChleHByLCBwYXJlbiwgYXJncywgcGFyZW4ubGluZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCB0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjb25zdW1lZCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbmFtZTogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXG4gICAgKTtcbiAgICBjb25zdCBrZXk6IEV4cHIuS2V5ID0gbmV3IEV4cHIuS2V5KG5hbWUsIG5hbWUubGluZSk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGxldCBrZXk6IEV4cHIuRXhwciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIGtleSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYW4gaW5kZXhgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgb3BlcmF0b3IubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHByaW1hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh1bmRlZmluZWQsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlbXBsYXRlKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZShpZGVudGlmaWVyLCBpZGVudGlmaWVyLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZvaWQoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRGVidWcpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgYEV4cGVjdGVkIGV4cHJlc3Npb24sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke3RoaXMucGVlaygpLmxleGVtZX1cImBcbiAgICApO1xuICAgIC8vIHVucmVhY2hlYWJsZSBjb2RlXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgMCk7XG4gIH1cblxuICBwdWJsaWMgZGljdGlvbmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcsIFRva2VuVHlwZS5JZGVudGlmaWVyLCBUb2tlblR5cGUuTnVtYmVyKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db2xvbikpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEV4cHIuVmFyaWFibGUoa2V5LCBrZXkubGluZSk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgdGhpcy5wZWVrKCksXG4gICAgICAgICAgYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7XG4gICAgICAgICAgICB0aGlzLnBlZWsoKS5sZXhlbWVcbiAgICAgICAgICB9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KHByb3BlcnRpZXMsIGxlZnRCcmFjZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcbiAgICBjb25zdCBsZWZ0QnJhY2tldCA9IHRoaXMucHJldmlvdXMoKTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGlzdChbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBkbyB7XG4gICAgICB2YWx1ZXMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5SaWdodEJyYWNrZXQsXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuTGlzdCh2YWx1ZXMsIGxlZnRCcmFja2V0LmxpbmUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIikgfHwgY2hhciA9PT0gXCIkXCIgfHwgY2hhciA9PT0gXCJfXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDoga2V5b2YgdHlwZW9mIFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW5UeXBlW3dvcmRdID49IFRva2VuVHlwZS5BbmQ7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XG4gIC8qKiBwb2ludHMgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgLyoqIHBvaW50cyB0byB0aGUgc3RhcnQgb2YgdGhlIHRva2VuICAqL1xuICBwcml2YXRlIHN0YXJ0OiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGxpbmUgb2Ygc291cmNlIGNvZGUgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgbGluZTogbnVtYmVyO1xuICAvKiogY3VycmVudCBjb2x1bW4gb2YgdGhlIGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjb2w6IG51bWJlcjtcblxuICBwdWJsaWMgc2Nhbihzb3VyY2U6IHN0cmluZyk6IFRva2VuW10ge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcbiAgICB9XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4oVG9rZW5UeXBlLkVvZiwgXCJcIiwgbnVsbCwgdGhpcy5saW5lLCAwKSk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiXFxuXCIpIHtcbiAgICAgIHRoaXMubGluZSsrO1xuICAgICAgdGhpcy5jb2wgPSAwO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB0aGlzLmNvbCsrO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRva2VuKHRva2VuVHlwZTogVG9rZW5UeXBlLCBsaXRlcmFsOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4odG9rZW5UeXBlLCB0ZXh0LCBsaXRlcmFsLCB0aGlzLmxpbmUsIHRoaXMuY29sKSk7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKGV4cGVjdGVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrTmV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgKyAxID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50ICsgMSk7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBcIlxcblwiICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG11bHRpbGluZUNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpICYmICEodGhpcy5wZWVrKCkgPT09IFwiKlwiICYmIHRoaXMucGVla05leHQoKSA9PT0gXCIvXCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoJ1VudGVybWluYXRlZCBjb21tZW50LCBleHBlY3RpbmcgY2xvc2luZyBcIiovXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGhlIGNsb3Npbmcgc2xhc2ggJyovJ1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhxdW90ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBxdW90ZSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihgVW50ZXJtaW5hdGVkIHN0cmluZywgZXhwZWN0aW5nIGNsb3NpbmcgJHtxdW90ZX1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgY2xvc2luZyBcIi5cbiAgICB0aGlzLmFkdmFuY2UoKTtcblxuICAgIC8vIFRyaW0gdGhlIHN1cnJvdW5kaW5nIHF1b3Rlcy5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0ICsgMSwgdGhpcy5jdXJyZW50IC0gMSk7XG4gICAgdGhpcy5hZGRUb2tlbihxdW90ZSAhPT0gXCJgXCIgPyBUb2tlblR5cGUuU3RyaW5nIDogVG9rZW5UeXBlLlRlbXBsYXRlLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIG51bWJlcigpOiB2b2lkIHtcbiAgICAvLyBnZXRzIGludGVnZXIgcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBmcmFjdGlvblxuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCIuXCIgJiYgVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWtOZXh0KCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBnZXRzIGZyYWN0aW9uIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZXhwb25lbnRcbiAgICBpZiAodGhpcy5wZWVrKCkudG9Mb3dlckNhc2UoKSA9PT0gXCJlXCIpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgaWYgKHRoaXMucGVlaygpID09PSBcIi1cIiB8fCB0aGlzLnBlZWsoKSA9PT0gXCIrXCIpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLk51bWJlciwgTnVtYmVyKHZhbHVlKSk7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoKTogdm9pZCB7XG4gICAgd2hpbGUgKFV0aWxzLmlzQWxwaGFOdW1lcmljKHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICBjb25zdCBjYXBpdGFsaXplZCA9IFV0aWxzLmNhcGl0YWxpemUodmFsdWUpIGFzIGtleW9mIHR5cGVvZiBUb2tlblR5cGU7XG4gICAgaWYgKFV0aWxzLmlzS2V5d29yZChjYXBpdGFsaXplZCkpIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlW2NhcGl0YWxpemVkXSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5JZGVudGlmaWVyLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRUb2tlbigpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFyID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICBjYXNlIFwiKFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIpXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJbXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIixcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ29tbWEsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlNlbWljb2xvbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ2FyZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkhhc2gsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI6XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4odGhpcy5tYXRjaChcInxcIikgPyBUb2tlblR5cGUuT3IgOiBUb2tlblR5cGUuUGlwZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiZcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiIVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkJhbmdFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj9cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiP1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvblxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25Eb3RcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlF1ZXN0aW9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPVwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiK1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCIrXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzUGx1c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5QbHVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCItXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPlwiKVxuICAgICAgICAgICAgICA/IFRva2VuVHlwZS5MZXNzRXF1YWxHcmVhdGVyXG4gICAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3NFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3REb3QsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3QsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3QsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIvXCIpKSB7XG4gICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIipcIikpIHtcbiAgICAgICAgICB0aGlzLm11bHRpbGluZUNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU2xhc2hFcXVhbCA6IFRva2VuVHlwZS5TbGFzaCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBgJ2A6XG4gICAgICBjYXNlIGBcImA6XG4gICAgICBjYXNlIFwiYFwiOlxuICAgICAgICB0aGlzLnN0cmluZyhjaGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBpZ25vcmUgY2FzZXNcbiAgICAgIGNhc2UgXCJcXG5cIjpcbiAgICAgIGNhc2UgXCIgXCI6XG4gICAgICBjYXNlIFwiXFxyXCI6XG4gICAgICBjYXNlIFwiXFx0XCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY29tcGxleCBjYXNlc1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFV0aWxzLmlzRGlnaXQoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLm51bWJlcigpO1xuICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzQWxwaGEoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLmlkZW50aWZpZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciAnJHtjaGFyfSdgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgU2NhbiBFcnJvciAoJHt0aGlzLmxpbmV9OiR7dGhpcy5jb2x9KSA9PiAke21lc3NhZ2V9YCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY29wZSB7XG4gIHB1YmxpYyB2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHB1YmxpYyBwYXJlbnQ6IFNjb3BlO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudD86IFNjb3BlLCBlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgPyBwYXJlbnQgOiBudWxsO1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgaW5pdChlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZXNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2tleV07XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5IGFzIGtleW9mIHR5cGVvZiB3aW5kb3ddO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciBhcyBQYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEludGVycHJldGVyIGltcGxlbWVudHMgRXhwci5FeHByVmlzaXRvcjxhbnk+IHtcbiAgcHVibGljIHNjb3BlID0gbmV3IFNjb3BlKCk7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG4gIHB1YmxpYyBldmFsdWF0ZShleHByOiBFeHByLkV4cHIpOiBhbnkge1xuICAgIHJldHVybiAoZXhwci5yZXN1bHQgPSBleHByLmFjY2VwdCh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSdW50aW1lIEVycm9yID0+ICR7bWVzc2FnZX1gKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBFeHByLlZhcmlhYmxlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5zY29wZS5nZXQoZXhwci5uYW1lLmxleGVtZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEV4cHIuQXNzaWduKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgdGhpcy5zY29wZS5zZXQoZXhwci5uYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEtleUV4cHIoZXhwcjogRXhwci5LZXkpOiBhbnkge1xuICAgIHJldHVybiBleHByLm5hbWUubGl0ZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdldEV4cHIoZXhwcjogRXhwci5HZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGlmICghZW50aXR5ICYmIGV4cHIudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5W2tleV07XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTZXRFeHByKGV4cHI6IEV4cHIuU2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgZW50aXR5W2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQb3N0Zml4RXhwcihleHByOiBFeHByLlBvc3RmaXgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSArIGV4cHIuaW5jcmVtZW50O1xuXG4gICAgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5lbnRpdHkubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgZXhwci5lbnRpdHkuZW50aXR5LFxuICAgICAgICBleHByLmVudGl0eS5rZXksXG4gICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgIGV4cHIubGluZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBwb3N0Zml4IG9wZXJhdGlvbjogJHtleHByLmVudGl0eX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXN0RXhwcihleHByOiBFeHByLkxpc3QpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwci52YWx1ZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pO1xuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogRXhwci5UZW1wbGF0ZSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwci52YWx1ZS5yZXBsYWNlKFxuICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGFyc2UocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEJpbmFyeUV4cHIoZXhwcjogRXhwci5CaW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2hFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50OlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAlIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBpcGU6XG4gICAgICAgIHJldHVybiBsZWZ0IHwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DYXJldDpcbiAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXI6XG4gICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzczpcbiAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3NFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgIT09IHJpZ2h0O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihcIlVua25vd24gYmluYXJ5IG9wZXJhdG9yIFwiICsgZXhwci5vcGVyYXRvcik7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IEV4cHIuTG9naWNhbCk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5Pcikge1xuICAgICAgaWYgKGxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IEV4cHIuVGVybmFyeSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5jb25kaXRpb24pXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmIChsZWZ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBFeHByLkdyb3VwaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogRXhwci5MaXRlcmFsKTogYW55IHtcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFVuYXJ5RXhwcihleHByOiBFeHByLlVuYXJ5KTogYW55IHtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgICByZXR1cm4gLXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZzpcbiAgICAgICAgcmV0dXJuICFyaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNQbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNNaW51czoge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgTnVtYmVyKHJpZ2h0KSArIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5QbHVzUGx1cyA/IDEgOiAtMSk7XG4gICAgICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucmlnaHQubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgICAgICBleHByLnJpZ2h0LmVudGl0eSxcbiAgICAgICAgICAgIGV4cHIucmlnaHQua2V5LFxuICAgICAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgICBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAgJHtleHByLnJpZ2h0fWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoYFVua25vd24gdW5hcnkgb3BlcmF0b3IgJyArIGV4cHIub3BlcmF0b3JgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENhbGxFeHByKGV4cHI6IEV4cHIuQ2FsbCk6IGFueSB7XG4gICAgLy8gdmVyaWZ5IGNhbGxlZSBpcyBhIGZ1bmN0aW9uXG4gICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgaWYgKHR5cGVvZiBjYWxsZWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihgJHtjYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgfVxuICAgIC8vIGV2YWx1YXRlIGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIGV4cHIuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJndW1lbnQpKTtcbiAgICB9XG4gICAgLy8gZXhlY3V0ZSBmdW5jdGlvblxuICAgIGlmIChcbiAgICAgIGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQgJiZcbiAgICAgIChleHByLmNhbGxlZS5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlIHx8XG4gICAgICAgIGV4cHIuY2FsbGVlLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR3JvdXBpbmcpXG4gICAgKSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IG5ld0NhbGwgPSBleHByLmNsYXp6IGFzIEV4cHIuQ2FsbDtcbiAgICAvLyBpbnRlcm5hbCBjbGFzcyBkZWZpbml0aW9uIGluc3RhbmNlXG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKG5ld0NhbGwuY2FsbGVlKTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgYCcke2NsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBuZXdDYWxsLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLmtleSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50S05vZGUoa25vZGU6IEVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlS05vZGUoa25vZGU6IEF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRUZXh0S05vZGUoa25vZGU6IFRleHQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0Q29tbWVudEtOb2RlKGtub2RlOiBDb21tZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdERvY3R5cGVLTm9kZShrbm9kZTogRG9jdHlwZSwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IEtOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBzZWxmOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBLTm9kZVtdLCBjaGlsZHJlbjogS05vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUGFyc2VyIHtcbiAgcHVibGljIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm5vZGVzID0gW107XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKGVvZkVycm9yOiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgdGhpcy5jb2wgPSAwO1xuICAgICAgfVxuICAgICAgdGhpcy5jb2wgKz0gMTtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGVuZCBvZiBmaWxlLiAke2VvZkVycm9yfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVlayguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPiB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuS05vZGUge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGxldCBub2RlOiBOb2RlLktOb2RlO1xuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IS0tXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5jb21tZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPCFkb2N0eXBlXCIpIHx8IHRoaXMubWF0Y2goXCI8IURPQ1RZUEVcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmRvY3R5cGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8XCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5lbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDMpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Db21tZW50KGNvbW1lbnQsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRvY3R5cGUoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY2xvc2luZyBkb2N0eXBlXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGA+YCkpO1xuICAgIGNvbnN0IGRvY3R5cGUgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSkudHJpbSgpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Eb2N0eXBlKGRvY3R5cGUsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGVsZW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiL1wiLCBcIj5cIik7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgYSB0YWcgbmFtZVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzKCk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFwiLz5cIikgfHxcbiAgICAgIChTZWxmQ2xvc2luZ1RhZ3MuaW5jbHVkZXMobmFtZSkgJiYgdGhpcy5tYXRjaChcIj5cIikpXG4gICAgKSB7XG4gICAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBbXSwgdHJ1ZSwgdGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWF0Y2goYCR7bmFtZX1gKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtwYXJlbnR9PmApO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRyaWJ1dGVzKCk6IE5vZGUuQXR0cmlidXRlW10ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIj5cIiwgXCIvPlwiKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIj1cIiwgXCI+XCIsIFwiLz5cIik7XG4gICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhpcy5lcnJvcihcIkJsYW5rIGF0dHJpYnV0ZSBuYW1lXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nKFwiJ1wiKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZygnXCInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwie3tcIikpIHsgZGVwdGgrKzsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgdGhpcy5tYXRjaChcIn19XCIpKSB7IGRlcHRoLS07IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdGhpcy5wZWVrKFwiPFwiKSkgeyBicmVhazsgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXJhdykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRoaXMuZGVjb2RlRW50aXRpZXMocmF3KSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUVudGl0aWVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCJcXHUwMGEwXCIpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgICAgLnJlcGxhY2UoLyZhcG9zOy9nLCBcIidcIilcbiAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7IC8vIG11c3QgYmUgbGFzdCB0byBhdm9pZCBkb3VibGUtZGVjb2RpbmdcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsInR5cGUgTGlzdGVuZXIgPSAoKSA9PiB2b2lkO1xuXG5sZXQgYWN0aXZlRWZmZWN0OiB7IGZuOiBMaXN0ZW5lcjsgZGVwczogU2V0PGFueT4gfSB8IG51bGwgPSBudWxsO1xuY29uc3QgZWZmZWN0U3RhY2s6IGFueVtdID0gW107XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIF92YWx1ZTogVDtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZhbHVlOiBUKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5hZGQoYWN0aXZlRWZmZWN0LmZuKTtcbiAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLmFkZCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGNvbnN0IHN1YnMgPSBBcnJheS5mcm9tKHRoaXMuc3Vic2NyaWJlcnMpO1xuICAgICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN1YigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkVmZmVjdCBlcnJvcjpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnN1YnNjcmliZShmbjogTGlzdGVuZXIpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmRlbGV0ZShmbik7XG4gIH1cblxuICB0b1N0cmluZygpIHsgcmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKTsgfVxuICBwZWVrKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVmZmVjdChmbjogTGlzdGVuZXIpIHtcbiAgY29uc3QgZWZmZWN0T2JqID0ge1xuICAgIGZuOiAoKSA9PiB7XG4gICAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuXG4gICAgICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdE9iaik7XG4gICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RPYmo7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXBzOiBuZXcgU2V0PFNpZ25hbDxhbnk+PigpXG4gIH07XG5cbiAgZWZmZWN0T2JqLmZuKCk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgZWZmZWN0T2JqLmRlcHMuZm9yRWFjaChzaWcgPT4gc2lnLnVuc3Vic2NyaWJlKGVmZmVjdE9iai5mbikpO1xuICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWw8VD4oaW5pdGlhbFZhbHVlOiBUKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBTaWduYWwoaW5pdGlhbFZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgY29uc3QgcyA9IHNpZ25hbDxUPih1bmRlZmluZWQgYXMgYW55KTtcbiAgZWZmZWN0KCgpID0+IHtcbiAgICBzLnZhbHVlID0gZm4oKTtcbiAgfSk7XG4gIHJldHVybiBzO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJvdW5kYXJ5IHtcbiAgcHJpdmF0ZSBzdGFydDogQ29tbWVudDtcbiAgcHJpdmF0ZSBlbmQ6IENvbW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBOb2RlLCBsYWJlbDogc3RyaW5nID0gXCJib3VuZGFyeVwiKSB7XG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LXN0YXJ0YCk7XG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1lbmRgKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgZWZmZWN0IH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBCb3VuZGFyeSB9IGZyb20gXCIuL2JvdW5kYXJ5XCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIElmRWxzZU5vZGUgPSBbS05vZGUuRWxlbWVudCwgS05vZGUuQXR0cmlidXRlXTtcblxuZXhwb3J0IGNsYXNzIFRyYW5zcGlsZXIgaW1wbGVtZW50cyBLTm9kZS5LTm9kZVZpc2l0b3I8dm9pZD4ge1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBFeHByZXNzaW9uUGFyc2VyKCk7XG4gIHByaXZhdGUgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIoKTtcbiAgcHJpdmF0ZSByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5yZWdpc3RyeSkge1xuICAgICAgdGhpcy5yZWdpc3RyeSA9IG9wdGlvbnMucmVnaXN0cnk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwaWxlKFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVudGl0eTogYW55LFxuICAgIGNvbnRhaW5lcjogRWxlbWVudFxuICApOiBOb2RlIHtcbiAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGVudGl0eSk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgY29udGFpbmVyKTtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudHJhY2tFZmZlY3QodGV4dCwgc3RvcCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKGUubWVzc2FnZSB8fCBgJHtlfWAsIFwidGV4dCBub2RlXCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHIgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobm9kZS5uYW1lKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBhdHRyLnZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgIH0pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYXR0ciwgc3RvcCk7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAocGFyZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IENvbW1lbnQobm9kZS52YWx1ZSk7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYWNrRWZmZWN0KHRhcmdldDogYW55LCBzdG9wOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25zWzBdWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxLCBleHByZXNzaW9ucy5sZW5ndGgpKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICBjb25zdCAkZWxzZWlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgIGlmICgkZWxzZWlmKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VcIl0pKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qga2V5QXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQGtleVwiXSk7XG4gICAgaWYgKGtleUF0dHIpIHtcbiAgICAgIHRoaXMuZG9FYWNoS2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50LCBrZXlBdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb0VhY2hVbmtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hVbmtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBrZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcblxuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGtleSkgc2NvcGVWYWx1ZXNba2V5XSA9IGluZGV4O1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgY29uc3QgW25hbWUsIGluZGV4S2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IGl0ZW1zIGFuZCB0aGVpciBrZXlzXG4gICAgICBjb25zdCBuZXdJdGVtczogQXJyYXk8eyBpdGVtOiBhbnk7IGlkeDogbnVtYmVyOyBrZXk6IGFueSB9PiA9IFtdO1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpbmRleDtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXhlY3V0ZShrZXlBdHRyLnZhbHVlKTtcbiAgICAgICAgbmV3SXRlbXMucHVzaCh7IGl0ZW0sIGlkeDogaW5kZXgsIGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgY29uc3QgbmV3S2V5U2V0ID0gbmV3IFNldChuZXdJdGVtcy5tYXAoKGkpID0+IGkua2V5KSk7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRvbU5vZGVdIG9mIGtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICB0aGlzLmRlc3Ryb3lOb2RlKGRvbU5vZGUpO1xuICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICBmb3IgKGNvbnN0IHsgaXRlbSwgaWR4LCBrZXkgfSBvZiBuZXdJdGVtcykge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuXG4gICAgICAgIGlmIChrZXllZE5vZGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGtleWVkTm9kZXMuZ2V0KGtleSkhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgaWYgKGNyZWF0ZWQpIGtleWVkTm9kZXMuc2V0KGtleSwgY3JlYXRlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9XaGlsZSgkd2hpbGU6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcIndoaWxlXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUpO1xuICAgICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIC8vIGV4ZWN1dGVzIGluaXRpYWxpemF0aW9uIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gIHByaXZhdGUgZG9MZXQoaW5pdDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGVhY2hcIl0pO1xuICAgICAgICBpZiAoJGVhY2gpIHtcbiAgICAgICAgICB0aGlzLmRvRWFjaCgkZWFjaCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAaWZcIl0pO1xuICAgICAgICBpZiAoJGlmKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbbm9kZSBhcyBLTm9kZS5FbGVtZW50LCAkaWZdXTtcblxuICAgICAgICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gdGhpcy5maW5kQXR0cihub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBbXG4gICAgICAgICAgICAgIFwiQGVsc2VcIixcbiAgICAgICAgICAgICAgXCJAZWxzZWlmXCIsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICR3aGlsZSA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAd2hpbGVcIl0pO1xuICAgICAgICBpZiAoJHdoaWxlKSB7XG4gICAgICAgICAgdGhpcy5kb1doaWxlKCR3aGlsZSwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgdGhpcy5kb0xldCgkbGV0LCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJzbG90XCIpIHtcbiAgICAgICAgY29uc3QgbmFtZUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIm5hbWVcIl0pO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZUF0dHIgPyBuYW1lQXR0ci52YWx1ZSA6IFwiZGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBzbG90cyA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJHNsb3RzXCIpO1xuICAgICAgICBpZiAoc2xvdHMgJiYgc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuICAgICAgY29uc3QgZWxlbWVudCA9IGlzVm9pZCA/IHBhcmVudCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZS5uYW1lKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQgIT09IHBhcmVudCkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRyZWZcIiwgZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0NvbXBvbmVudCkge1xuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBhbmQgc2V0IGl0IGFzIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IHt9O1xuICAgICAgICBjb25zdCBhcmdzQXR0ciA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5jcmVhdGVDb21wb25lbnRBcmdzKGFyZ3NBdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZVtdKTtcblxuICAgICAgICAvLyBDYXB0dXJlIGNoaWxkcmVuIGZvciBzbG90c1xuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgS05vZGUuS05vZGVbXT4gPSB7IGRlZmF1bHQ6IFtdIH07XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcInNsb3RcIl0pO1xuICAgICAgICAgICAgaWYgKHNsb3RBdHRyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzbG90QXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFzbG90c1tuYW1lXSkgc2xvdHNbbmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgc2xvdHNbbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzbG90cy5kZWZhdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXT8uY29tcG9uZW50KSB7XG4gICAgICAgICAgY29tcG9uZW50ID0gbmV3IHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5jb21wb25lbnQoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbkluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uSW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHBvc2Ugc2xvdHMgaW4gY29tcG9uZW50IHNjb3BlXG4gICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMsIGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgICAgLy8gZXZlbnQgYmluZGluZ1xuICAgICAgICBjb25zdCBldmVudHMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBmaXJzdClcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoXG4gICAgICAgICAgKGF0dHIpID0+ICEoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgYXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXR0ciwgZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG9ydGhhbmQgYXR0cmlidXRlcyAocHJvY2Vzc2VkIHNlY29uZCwgYWxsb3dzIG1lcmdpbmcpXG4gICAgICAgIGNvbnN0IHNob3J0aGFuZEF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgbmFtZS5zdGFydHNXaXRoKFwiQFwiKSAmJlxuICAgICAgICAgICAgIVtcIkBpZlwiLCBcIkBlbHNlaWZcIiwgXCJAZWxzZVwiLCBcIkBlYWNoXCIsIFwiQHdoaWxlXCIsIFwiQGxldFwiLCBcIkBrZXlcIl0uaW5jbHVkZXMoXG4gICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2Ygc2hvcnRoYW5kQXR0cmlidXRlcykge1xuICAgICAgICAgIGNvbnN0IHJlYWxOYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0RHluYW1pY1ZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBzdGF0aWNDbGFzcyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IHN0YXRpY0NsYXNzLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiBjICE9PSBsYXN0RHluYW1pY1ZhbHVlICYmIGMgIT09IFwiXCIpXG4gICAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGN1cnJlbnRDbGFzc2VzID8gYCR7Y3VycmVudENsYXNzZXN9ICR7dmFsdWV9YCA6IHZhbHVlO1xuICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICBsYXN0RHluYW1pY1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSAhPT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkucmVtb3ZlQXR0cmlidXRlKHJlYWxOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBleGlzdGluZyAmJiAhZXhpc3RpbmcuaW5jbHVkZXModmFsdWUpXG4gICAgICAgICAgICAgICAgICAgID8gYCR7ZXhpc3RpbmcuZW5kc1dpdGgoXCI7XCIpID8gZXhpc3RpbmcgOiBleGlzdGluZyArIFwiO1wifSAke3ZhbHVlfWBcbiAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmVudCAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKGUubWVzc2FnZSB8fCBgJHtlfWAsIG5vZGUubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb21wb25lbnRBcmdzKGFyZ3M6IEtOb2RlLkF0dHJpYnV0ZVtdKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBjb25zdCBrZXkgPSBhcmcubmFtZS5zcGxpdChcIjpcIilbMV07XG4gICAgICByZXN1bHRba2V5XSA9IHRoaXMuZXhlY3V0ZShhcmcudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQ6IE5vZGUsIGF0dHI6IEtOb2RlLkF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIGNvbnN0IFtldmVudE5hbWUsIC4uLm1vZGlmaWVyc10gPSBhdHRyLm5hbWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCBsaXN0ZW5lclNjb3BlID0gbmV3IFNjb3BlKHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7fTtcbiAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikge1xuICAgICAgb3B0aW9ucy5zaWduYWwgPSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgICB9XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm9uY2VcIikpICAgIG9wdGlvbnMub25jZSAgICA9IHRydWU7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhc3NpdmVcIikpIG9wdGlvbnMucGFzc2l2ZSA9IHRydWU7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhcHR1cmVcIikpIG9wdGlvbnMuY2FwdHVyZSA9IHRydWU7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwcmV2ZW50XCIpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGlzdGVuZXJTY29wZS5zZXQoXCIkZXZlbnRcIiwgZXZlbnQpO1xuICAgICAgdGhpcy5leGVjdXRlKGF0dHIudmFsdWUsIGxpc3RlbmVyU2NvcGUpO1xuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgcmVnZXggPSAvXFx7XFx7LitcXH1cXH0vbXM7XG4gICAgaWYgKHJlZ2V4LnRlc3QodGV4dCkpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLCAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uKHBsYWNlaG9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveU5vZGUobm9kZTogYW55KTogdm9pZCB7XG4gICAgLy8gMS4gQ2xlYW51cCBjb21wb25lbnQgaW5zdGFuY2VcbiAgICBpZiAobm9kZS4ka2FzcGVySW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbm9kZS4ka2FzcGVySW5zdGFuY2U7XG4gICAgICBpZiAoaW5zdGFuY2Uub25EZXN0cm95KSBpbnN0YW5jZS5vbkRlc3Ryb3koKTtcbiAgICAgIGlmIChpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuXG4gICAgLy8gMi4gQ2xlYW51cCBlZmZlY3RzIGF0dGFjaGVkIHRvIHRoZSBub2RlXG4gICAgaWYgKG5vZGUuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyAzLiBDbGVhbnVwIGVmZmVjdHMgb24gYXR0cmlidXRlc1xuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChhdHRyLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDQuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkOiBhbnkpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KGNvbnRhaW5lcjogRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUoX25vZGU6IEtOb2RlLkRvY3R5cGUpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gICAgLy8gcmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50VHlwZShcImh0bWxcIiwgXCJcIiwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nLCB0YWdOYW1lPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgY2xlYW5NZXNzYWdlID0gbWVzc2FnZS5zdGFydHNXaXRoKFwiUnVudGltZSBFcnJvclwiKVxuICAgICAgPyBtZXNzYWdlXG4gICAgICA6IGBSdW50aW1lIEVycm9yOiAke21lc3NhZ2V9YDtcblxuICAgIGlmICh0YWdOYW1lICYmICFjbGVhbk1lc3NhZ2UuaW5jbHVkZXMoYGF0IDwke3RhZ05hbWV9PmApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Y2xlYW5NZXNzYWdlfVxcbiAgYXQgPCR7dGFnTmFtZX0+YCk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGNsZWFuTWVzc2FnZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShub2Rlcyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKV0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3BpbGUoXG4gIHNvdXJjZTogc3RyaW5nLFxuICBlbnRpdHk/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LFxuICBjb250YWluZXI/OiBIVE1MRWxlbWVudCxcbiAgcmVnaXN0cnk/OiBDb21wb25lbnRSZWdpc3RyeVxuKTogTm9kZSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogcmVnaXN0cnkgfHwge30gfSk7XG4gIGNvbnN0IHJlc3VsdCA9IHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBlbnRpdHkgfHwge30sIGNvbnRhaW5lcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEthc3BlcihDb21wb25lbnRDbGFzczogYW55KSB7XG4gIEthc3BlckluaXQoe1xuICAgIHJvb3Q6IFwia2FzcGVyLWFwcFwiLFxuICAgIGVudHJ5OiBcImthc3Blci1yb290XCIsXG4gICAgcmVnaXN0cnk6IHtcbiAgICAgIFwia2FzcGVyLXJvb3RcIjoge1xuICAgICAgICBzZWxlY3RvcjogXCJ0ZW1wbGF0ZVwiLFxuICAgICAgICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzLFxuICAgICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cblxuaW50ZXJmYWNlIEFwcENvbmZpZyB7XG4gIHJvb3Q/OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcbiAgZW50cnk/OiBzdHJpbmc7XG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KFxuICB0cmFuc3BpbGVyOiBUcmFuc3BpbGVyLFxuICB0YWc6IHN0cmluZyxcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5XG4pIHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgY29uc3QgY29tcG9uZW50ID0gbmV3IHJlZ2lzdHJ5W3RhZ10uY29tcG9uZW50KHtcbiAgICByZWY6IGVsZW1lbnQsXG4gICAgdHJhbnNwaWxlcjogdHJhbnNwaWxlcixcbiAgICBhcmdzOiB7fSxcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlOiBlbGVtZW50LFxuICAgIGluc3RhbmNlOiBjb21wb25lbnQsXG4gICAgbm9kZXM6IHJlZ2lzdHJ5W3RhZ10ubm9kZXMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlZ2lzdHJ5KFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnksXG4gIHBhcnNlcjogVGVtcGxhdGVQYXJzZXJcbikge1xuICBjb25zdCByZXN1bHQgPSB7IC4uLnJlZ2lzdHJ5IH07XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJlZ2lzdHJ5KSkge1xuICAgIGNvbnN0IGVudHJ5ID0gcmVnaXN0cnlba2V5XTtcbiAgICBpZiAoZW50cnkubm9kZXMgJiYgZW50cnkubm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbnRyeS5zZWxlY3Rvcik7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBlbnRyeS50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UodGVtcGxhdGUuaW5uZXJIVE1MKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEthc3BlckluaXQoY29uZmlnOiBBcHBDb25maWcpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IHJvb3QgPVxuICAgIHR5cGVvZiBjb25maWcucm9vdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KVxuICAgICAgOiBjb25maWcucm9vdDtcblxuICBpZiAoIXJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJvb3QgZWxlbWVudCBub3QgZm91bmQ6ICR7Y29uZmlnLnJvb3R9YCk7XG4gIH1cblxuICBjb25zdCByZWdpc3RyeSA9IG5vcm1hbGl6ZVJlZ2lzdHJ5KGNvbmZpZy5yZWdpc3RyeSwgcGFyc2VyKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IH0pO1xuICBjb25zdCBlbnRyeVRhZyA9IGNvbmZpZy5lbnRyeSB8fCBcImthc3Blci1hcHBcIjtcblxuICBjb25zdCB7IG5vZGUsIGluc3RhbmNlLCBub2RlcyB9ID0gY3JlYXRlQ29tcG9uZW50KFxuICAgIHRyYW5zcGlsZXIsXG4gICAgZW50cnlUYWcsXG4gICAgcmVnaXN0cnlcbiAgKTtcblxuICBpZiAocm9vdCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICByb290LmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG5cbiAgLy8gSW5pdGlhbCByZW5kZXIgYW5kIGxpZmVjeWNsZVxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uSW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25Jbml0KCk7XG4gIH1cblxuICB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgaW5zdGFuY2UsIG5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG4iLCJpbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjxzdHJpbmc+IHtcclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIGV2YWx1YXRlKG5vZGU6IEtOb2RlLktOb2RlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLmFjY2VwdCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0cmFuc3BpbGUobm9kZXM6IEtOb2RlLktOb2RlW10pOiBzdHJpbmdbXSB7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmV2YWx1YXRlKG5vZGUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1gKTtcclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwMCkge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCk6IHN0cmluZyB7XHJcbiAgICBsZXQgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXMubWFwKChhdHRyKSA9PiB0aGlzLmV2YWx1YXRlKGF0dHIpKS5qb2luKFwiIFwiKTtcclxuICAgIGlmIChhdHRycy5sZW5ndGgpIHtcclxuICAgICAgYXR0cnMgPSBcIiBcIiArIGF0dHJzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlLnNlbGYpIHtcclxuICAgICAgcmV0dXJuIGA8JHtub2RlLm5hbWV9JHthdHRyc30vPmA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuLm1hcCgoZWxtKSA9PiB0aGlzLmV2YWx1YXRlKGVsbSkpLmpvaW4oXCJcIik7XHJcbiAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfT4ke2NoaWxkcmVufTwvJHtub2RlLm5hbWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUpOiBzdHJpbmcge1xyXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGAke25vZGUubmFtZX09XCIke25vZGUudmFsdWV9XCJgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGUubmFtZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLnZhbHVlXHJcbiAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcclxuICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxyXG4gICAgICAucmVwbGFjZSgvXFx1MDBhMC9nLCBcIiZuYnNwO1wiKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCEtLSAke25vZGUudmFsdWV9IC0tPmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhZG9jdHlwZSAke25vZGUudmFsdWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgZXhlY3V0ZSwgdHJhbnNwaWxlLCBLYXNwZXIsIEthc3BlckluaXQgfSBmcm9tIFwiLi9rYXNwZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IFZpZXdlciB9IGZyb20gXCIuL3ZpZXdlclwiO1xuaW1wb3J0IHsgc2lnbmFsLCBlZmZlY3QsIGNvbXB1dGVkIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICgod2luZG93IGFzIGFueSkgfHwge30pLmthc3BlciA9IHtcbiAgICBleGVjdXRlOiBleGVjdXRlLFxuICAgIHRyYW5zcGlsZTogdHJhbnNwaWxlLFxuICAgIEFwcDogS2FzcGVySW5pdCxcbiAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICBUZW1wbGF0ZVBhcnNlcjogVGVtcGxhdGVQYXJzZXIsXG4gICAgVHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgICBWaWV3ZXI6IFZpZXdlcixcbiAgICBzaWduYWw6IHNpZ25hbCxcbiAgICBlZmZlY3Q6IGVmZmVjdCxcbiAgICBjb21wdXRlZDogY29tcHV0ZWQsXG4gIH07XG4gICh3aW5kb3cgYXMgYW55KVtcIkthc3BlclwiXSA9IEthc3BlcjtcbiAgKHdpbmRvdyBhcyBhbnkpW1wiQ29tcG9uZW50XCJdID0gQ29tcG9uZW50O1xufVxuXG5leHBvcnQgeyBFeHByZXNzaW9uUGFyc2VyLCBJbnRlcnByZXRlciwgU2Nhbm5lciwgVGVtcGxhdGVQYXJzZXIsIFRyYW5zcGlsZXIsIFZpZXdlciwgc2lnbmFsLCBlZmZlY3QsIGNvbXB1dGVkIH07XG5leHBvcnQgeyBleGVjdXRlLCB0cmFuc3BpbGUsIEthc3BlciwgS2FzcGVySW5pdCBhcyBBcHAsIENvbXBvbmVudCB9O1xuIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsIkV4cHIuRWFjaCIsIkV4cHIuVmFyaWFibGUiLCJFeHByLkJpbmFyeSIsIkV4cHIuQXNzaWduIiwiRXhwci5HZXQiLCJFeHByLlNldCIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuQ2FsbCIsIkV4cHIuS2V5IiwiRXhwci5MaXRlcmFsIiwiRXhwci5UZW1wbGF0ZSIsIkV4cHIuR3JvdXBpbmciLCJFeHByLlZvaWQiLCJFeHByLkRlYnVnIiwiRXhwci5EaWN0aW9uYXJ5IiwiRXhwci5MaXN0IiwiVXRpbHMuaXNEaWdpdCIsIlV0aWxzLmlzQWxwaGFOdW1lcmljIiwiVXRpbHMuY2FwaXRhbGl6ZSIsIlV0aWxzLmlzS2V5d29yZCIsIlV0aWxzLmlzQWxwaGEiLCJQYXJzZXIiLCJzZWxmIiwiTm9kZS5Db21tZW50IiwiTm9kZS5Eb2N0eXBlIiwiTm9kZS5FbGVtZW50IiwiTm9kZS5BdHRyaWJ1dGUiLCJOb2RlLlRleHQiXSwibWFwcGluZ3MiOiI7Ozs7RUFTTyxNQUFNLFVBQVU7QUFBQSxJQU1yQixZQUFZLE9BQXVCO0FBTG5DLFdBQUEsT0FBNEIsQ0FBQTtBQUc1QixXQUFBLG1CQUFtQixJQUFJLGdCQUFBO0FBR3JCLFVBQUksQ0FBQyxPQUFPO0FBQ1YsYUFBSyxPQUFPLENBQUE7QUFDWjtBQUFBLE1BQ0Y7QUFDQSxVQUFJLE1BQU0sTUFBTTtBQUNkLGFBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQTtBQUFBLE1BQzVCO0FBQ0EsVUFBSSxNQUFNLEtBQUs7QUFDYixhQUFLLE1BQU0sTUFBTTtBQUFBLE1BQ25CO0FBQ0EsVUFBSSxNQUFNLFlBQVk7QUFDcEIsYUFBSyxhQUFhLE1BQU07QUFBQSxNQUMxQjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxJQUFDO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFBQztBQUFBLElBQ1osWUFBWTtBQUFBLElBQUM7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUFDO0FBQUEsSUFFYixZQUFZO0FBQ1YsVUFBSSxDQUFDLEtBQUssWUFBWTtBQUNwQjtBQUFBLE1B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QUFBLFFBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFFBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxLQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsZ0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxpQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxrQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxrQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsZUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJ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QUFDeEM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxhQUFhLElBQUk7QUFDekM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxjQUFjLElBQUk7QUFDMUM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxXQUFXLElBQUk7QUFDdkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxZQUFZLElBQUk7QUFDeEM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxPQUFPLElBQUk7QUFDbkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxXQUFXLElBQUk7QUFDdkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxPQUFPLElBQUk7QUFDbkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxNQUFNLElBQUk7QUFDbEM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsUUFBUSxVQUFVO0FBQUEsWUFDOUM7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsWUFBWSxVQUFVO0FBQUEsWUFDbEQ7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsZUFBZSxVQUFVO0FBQUEsWUFDckQ7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEtBQUssVUFBVSxNQUFNLElBQUk7QUFDbkU7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsTUFBTSxVQUFVO0FBQUEsWUFDNUM7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxl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
