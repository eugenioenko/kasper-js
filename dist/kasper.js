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
          const operator = this.previous();
          if (operator.type === TokenType.QuestionDot && this.match(TokenType.LeftBracket)) {
            expr = this.bracketGet(expr, operator);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3NpZ25hbC50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy90cmFuc3BpbGVyLnRzIiwiLi4vc3JjL2thc3Blci50cyIsIi4uL3NyYy92aWV3ZXIudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3Mge1xuICBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgb25Jbml0KCkge31cbiAgb25SZW5kZXIoKSB7fVxuICBvbkNoYW5nZXMoKSB7fVxuICBvbkRlc3Ryb3koKSB7fVxuXG4gICRkb1JlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMudHJhbnNwaWxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdHlwZSBLYXNwZXJFbnRpdHkgPSBDb21wb25lbnQgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50Q2xhc3MgPSB7IG5ldyAoYXJncz86IENvbXBvbmVudEFyZ3MpOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgICB0ZW1wbGF0ZTogRWxlbWVudDtcbiAgICBub2RlczogS05vZGVbXTtcbiAgfTtcbn1cbiIsImV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICBzdXBlcihgUGFyc2UgRXJyb3IgKCR7bGluZX06JHtjb2x9KSA9PiAke3ZhbHVlfWApO1xuICAgIHRoaXMubmFtZSA9IFwiS2FzcGVyRXJyb3JcIjtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sID0gY29sO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAndG9rZW4nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXhwciB7XG4gIHB1YmxpYyByZXN1bHQ6IGFueTtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBpbnRlcmZhY2UgRXhwclZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0QXNzaWduRXhwcihleHByOiBBc3NpZ24pOiBSO1xuICAgIHZpc2l0QmluYXJ5RXhwcihleHByOiBCaW5hcnkpOiBSO1xuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcjogQ2FsbCk6IFI7XG4gICAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRGVidWcpOiBSO1xuICAgIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRGljdGlvbmFyeSk6IFI7XG4gICAgdmlzaXRFYWNoRXhwcihleHByOiBFYWNoKTogUjtcbiAgICB2aXNpdEdldEV4cHIoZXhwcjogR2V0KTogUjtcbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBHcm91cGluZyk6IFI7XG4gICAgdmlzaXRLZXlFeHByKGV4cHI6IEtleSk6IFI7XG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByOiBMb2dpY2FsKTogUjtcbiAgICB2aXNpdExpc3RFeHByKGV4cHI6IExpc3QpOiBSO1xuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogTGl0ZXJhbCk6IFI7XG4gICAgdmlzaXROZXdFeHByKGV4cHI6IE5ldyk6IFI7XG4gICAgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogTnVsbENvYWxlc2NpbmcpOiBSO1xuICAgIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogUG9zdGZpeCk6IFI7XG4gICAgdmlzaXRTZXRFeHByKGV4cHI6IFNldCk6IFI7XG4gICAgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogVGVtcGxhdGUpOiBSO1xuICAgIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogVGVybmFyeSk6IFI7XG4gICAgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IFR5cGVvZik6IFI7XG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcjogVW5hcnkpOiBSO1xuICAgIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IFZhcmlhYmxlKTogUjtcbiAgICB2aXNpdFZvaWRFeHByKGV4cHI6IFZvaWQpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgQXNzaWduIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXNzaWduJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkJpbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2FsbGVlOiBFeHByO1xuICAgIHB1YmxpYyBwYXJlbjogVG9rZW47XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKGNhbGxlZTogRXhwciwgcGFyZW46IFRva2VuLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgdGhpcy5wYXJlbiA9IHBhcmVuO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdENhbGxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQ2FsbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVidWdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGVidWcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHByb3BlcnRpZXM6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGljdGlvbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EaWN0aW9uYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWFjaCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMga2V5OiBUb2tlbjtcbiAgICBwdWJsaWMgaXRlcmFibGU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwga2V5OiBUb2tlbiwgaXRlcmFibGU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVhY2hFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRWFjaCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHR5cGU6IFRva2VuVHlwZSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JvdXBpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdyb3VwaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5LZXknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dpY2FsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TG9naWNhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Mb2dpY2FsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpc3QnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGl0ZXJhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjbGF6ejogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGF6eiA9IGNsYXp6O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE5ld0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OZXcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsQ29hbGVzY2luZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE51bGxDb2FsZXNjaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk51bGxDb2FsZXNjaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9zdGZpeCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQb3N0Zml4RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBvc3RmaXgnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlbXBsYXRlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlbXBsYXRlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVybmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjb25kaXRpb246IEV4cHI7XG4gICAgcHVibGljIHRoZW5FeHByOiBFeHByO1xuICAgIHB1YmxpYyBlbHNlRXhwcjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbjogRXhwciwgdGhlbkV4cHI6IEV4cHIsIGVsc2VFeHByOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgICAgIHRoaXMudGhlbkV4cHIgPSB0aGVuRXhwcjtcbiAgICAgICAgdGhpcy5lbHNlRXhwciA9IGVsc2VFeHByO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlcm5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVybmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVvZiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFR5cGVvZkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UeXBlb2YnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlVuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VmFyaWFibGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVmFyaWFibGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWb2lkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Vm9pZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Wb2lkJztcbiAgfVxufVxuXG4iLCJleHBvcnQgZW51bSBUb2tlblR5cGUge1xyXG4gIC8vIFBhcnNlciBUb2tlbnNcclxuICBFb2YsXHJcbiAgUGFuaWMsXHJcblxyXG4gIC8vIFNpbmdsZSBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQW1wZXJzYW5kLFxyXG4gIEF0U2lnbixcclxuICBDYXJldCxcclxuICBDb21tYSxcclxuICBEb2xsYXIsXHJcbiAgRG90LFxyXG4gIEhhc2gsXHJcbiAgTGVmdEJyYWNlLFxyXG4gIExlZnRCcmFja2V0LFxyXG4gIExlZnRQYXJlbixcclxuICBQZXJjZW50LFxyXG4gIFBpcGUsXHJcbiAgUmlnaHRCcmFjZSxcclxuICBSaWdodEJyYWNrZXQsXHJcbiAgUmlnaHRQYXJlbixcclxuICBTZW1pY29sb24sXHJcbiAgU2xhc2gsXHJcbiAgU3RhcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQXJyb3csXHJcbiAgQmFuZyxcclxuICBCYW5nRXF1YWwsXHJcbiAgQmFuZ0VxdWFsRXF1YWwsXHJcbiAgQ29sb24sXHJcbiAgRXF1YWwsXHJcbiAgRXF1YWxFcXVhbCxcclxuICBFcXVhbEVxdWFsRXF1YWwsXHJcbiAgR3JlYXRlcixcclxuICBHcmVhdGVyRXF1YWwsXHJcbiAgTGVzcyxcclxuICBMZXNzRXF1YWwsXHJcbiAgTWludXMsXHJcbiAgTWludXNFcXVhbCxcclxuICBNaW51c01pbnVzLFxyXG4gIFBlcmNlbnRFcXVhbCxcclxuICBQbHVzLFxyXG4gIFBsdXNFcXVhbCxcclxuICBQbHVzUGx1cyxcclxuICBRdWVzdGlvbixcclxuICBRdWVzdGlvbkRvdCxcclxuICBRdWVzdGlvblF1ZXN0aW9uLFxyXG4gIFNsYXNoRXF1YWwsXHJcbiAgU3RhckVxdWFsLFxyXG4gIERvdERvdCxcclxuICBEb3REb3REb3QsXHJcbiAgTGVzc0VxdWFsR3JlYXRlcixcclxuXHJcbiAgLy8gTGl0ZXJhbHNcclxuICBJZGVudGlmaWVyLFxyXG4gIFRlbXBsYXRlLFxyXG4gIFN0cmluZyxcclxuICBOdW1iZXIsXHJcblxyXG4gIC8vIEtleXdvcmRzXHJcbiAgQW5kLFxyXG4gIENvbnN0LFxyXG4gIERlYnVnLFxyXG4gIEZhbHNlLFxyXG4gIEluc3RhbmNlb2YsXHJcbiAgTmV3LFxyXG4gIE51bGwsXHJcbiAgVW5kZWZpbmVkLFxyXG4gIE9mLFxyXG4gIE9yLFxyXG4gIFRydWUsXHJcbiAgVHlwZW9mLFxyXG4gIFZvaWQsXHJcbiAgV2l0aCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XHJcbiAgcHVibGljIGxpdGVyYWw6IGFueTtcclxuICBwdWJsaWMgbGV4ZW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHlwZTogVG9rZW5UeXBlLFxyXG4gICAgbGV4ZW1lOiBzdHJpbmcsXHJcbiAgICBsaXRlcmFsOiBhbnksXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2w6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5uYW1lID0gVG9rZW5UeXBlW3R5cGVdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGV4ZW1lID0gbGV4ZW1lO1xyXG4gICAgdGhpcy5saXRlcmFsID0gbGl0ZXJhbDtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiBgWygke3RoaXMubGluZX0pOlwiJHt0aGlzLmxleGVtZX1cIl1gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uUGFyc2VyIHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xuXG4gIHB1YmxpYyBwYXJzZSh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHJbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLnR5cGVzOiBUb2tlblR5cGVbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogVG9rZW4ge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnRdO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmV2aW91cygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCAtIDFdO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayh0eXBlOiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrKFRva2VuVHlwZS5Fb2YpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdW1lKHR5cGU6IFRva2VuVHlwZSwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIG1lc3NhZ2UgKyBgLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IodG9rZW46IFRva2VuLCBtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0b2tlbi5saW5lLCB0b2tlbi5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBzeW5jaHJvbml6ZSgpOiB2b2lkIHtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfSB3aGlsZSAoIXRoaXMuZW9mKCkpO1xuICB9XG5cbiAgcHVibGljIGZvcmVhY2godG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdGVkIGFuIGlkZW50aWZpZXIgaW5zaWRlIFwiZWFjaFwiIHN0YXRlbWVudGBcbiAgICApO1xuXG4gICAgbGV0IGtleTogVG9rZW4gPSBudWxsO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5XaXRoKSkge1xuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxuICAgICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgICAgYEV4cGVjdGVkIGEgXCJrZXlcIiBpZGVudGlmaWVyIGFmdGVyIFwid2l0aFwiIGtleXdvcmQgaW4gZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5PZixcbiAgICAgIGBFeHBlY3RlZCBcIm9mXCIga2V5d29yZCBpbnNpZGUgZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgKTtcbiAgICBjb25zdCBpdGVyYWJsZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHJlc3Npb246IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7XG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7IC8qIGNvbnN1bWUgc2VtaWNvbG9ucyAqLyB9XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKG9wZXJhdG9yLCBgSW52YWxpZCBsLXZhbHVlLCBpcyBub3QgYW4gYXNzaWduaW5nIHRhcmdldC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRlcm5hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHRoZW5FeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQ29sb24sIGBFeHBlY3RlZCBcIjpcIiBhZnRlciB0ZXJuYXJ5ID8gZXhwcmVzc2lvbmApO1xuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlcm5hcnkoZXhwciwgdGhlbkV4cHIsIGVsc2VFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5sb2dpY2FsT3IoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk51bGxDb2FsZXNjaW5nKGV4cHIsIHJpZ2h0RXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk9yKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxBbmQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBlcXVhbGl0eSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgd2hpbGUgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxuICAgICAgICBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkaXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzLCBUb2tlblR5cGUuUGx1cykpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QZXJjZW50KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG11bHRpcGxpY2F0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdHlwZW9mKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuYXJ5KCk7XG4gIH1cblxuICBwcml2YXRlIHVuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5wb3N0Zml4KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucG9zdGZpeCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3N0Zml4KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuY2FsbCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIDEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgLTEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZDogYm9vbGVhbjtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY29uc3QgYXJnczogRXhwci5FeHByW10gPSBbXTtcbiAgICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwYXJlbjogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgICAgICBUb2tlblR5cGUuUmlnaHRQYXJlbixcbiAgICAgICAgICAgIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgXG4gICAgICAgICAgKTtcbiAgICAgICAgICBleHByID0gbmV3IEV4cHIuQ2FsbChleHByLCBwYXJlbiwgYXJncywgcGFyZW4ubGluZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgZXhwcmVzc2lvbmApO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkdyb3VwaW5nKGV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlZvaWQpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRlYnVnKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGVidWcoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cblxuICAgIHRocm93IHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIGBFeHBlY3RlZCBleHByZXNzaW9uLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgICAvLyB1bnJlYWNoZWFibGUgY29kZVxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xuICB9XG5cbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBsZWZ0QnJhY2UgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIGBTdHJpbmcsIE51bWJlciBvciBJZGVudGlmaWVyIGV4cGVjdGVkIGFzIGEgS2V5IG9mIERpY3Rpb25hcnkgeywgdW5leHBlY3RlZCB0b2tlbiAke1xuICAgICAgICAgICAgdGhpcy5wZWVrKCkubGV4ZW1lXG4gICAgICAgICAgfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gIC8qKiBzY3JpcHRzIHNvdXJjZSBjb2RlICovXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xuICBwdWJsaWMgdG9rZW5zOiBUb2tlbltdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmdldFRva2VuKCk7XG4gICAgfVxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xuICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPj0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XG4gICAgICB0aGlzLmxpbmUrKztcbiAgICAgIHRoaXMuY29sID0gMDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgdGhpcy5jb2wrKztcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHRva2VuVHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lLCB0aGlzLmNvbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaChleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCArIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVDb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgY29tbWVudCwgZXhwZWN0aW5nIGNsb3NpbmcgXCIqL1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7cXVvdGV9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAvLyBUcmltIHRoZSBzdXJyb3VuZGluZyBxdW90ZXMuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XG4gICAgLy8gZ2V0cyBpbnRlZ2VyIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLlwiICYmIFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGV4cG9uZW50XG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCItXCIgfHwgdGhpcy5wZWVrKCkgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKSBhcyBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlO1xuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZVtjYXBpdGFsaXplZF0sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSBcIihcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIsXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNvbW1hLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiO1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TZW1pY29sb24sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJeXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNhcmV0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiOlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkNvbG9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlN0YXJFcXVhbCA6IFRva2VuVHlwZS5TdGFyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlBlcmNlbnRFcXVhbCA6IFRva2VuVHlwZS5QZXJjZW50LFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDogVG9rZW5UeXBlLlBpcGUsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIiZcIikgPyBUb2tlblR5cGUuQW5kIDogVG9rZW5UeXBlLkFtcGVyc2FuZCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5HcmVhdGVyRXF1YWwgOiBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiFcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5CYW5nRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiK1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTWludXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj5cIilcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxuICAgICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90LCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xuICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCIqXCIpKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYCdgOlxuICAgICAgY2FzZSBgXCJgOlxuICAgICAgY2FzZSBcImBcIjpcbiAgICAgICAgdGhpcy5zdHJpbmcoY2hhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gaWdub3JlIGNhc2VzXG4gICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNvbXBsZXggY2FzZXNcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc0FscGhhKGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7Y2hhcn0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYW4gRXJyb3IgKCR7dGhpcy5saW5lfToke3RoaXMuY29sfSkgPT4gJHttZXNzYWdlfWApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93W2tleSBhcyBrZXlvZiB0eXBlb2Ygd2luZG93XTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcblxuICAgIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIuZW50aXR5Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgIGV4cHIuZW50aXR5LmVudGl0eSxcbiAgICAgICAgZXhwci5lbnRpdHkua2V5LFxuICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoYEludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gcG9zdGZpeCBvcGVyYXRpb246ICR7ZXhwci5lbnRpdHl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKTtcbiAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmtub3duIGJpbmFyeSBvcGVyYXRvciBcIiArIGV4cHIub3BlcmF0b3IpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKVxuICAgICAgPyB0aGlzLmV2YWx1YXRlKGV4cHIudGhlbkV4cHIpXG4gICAgICA6IHRoaXMuZXZhbHVhdGUoZXhwci5lbHNlRXhwcik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogRXhwci5OdWxsQ29hbGVzY2luZyk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBpZiAobGVmdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICB9XG4gICAgcmV0dXJuIGxlZnQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogRXhwci5Hcm91cGluZyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5leHByZXNzaW9uKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpdGVyYWxFeHByKGV4cHI6IEV4cHIuTGl0ZXJhbCk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIudmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRVbmFyeUV4cHIoZXhwcjogRXhwci5VbmFyeSk6IGFueSB7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgICAgcmV0dXJuIC1yaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmc6XG4gICAgICAgIHJldHVybiAhcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogICR7ZXhwci5yaWdodH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICcgKyBleHByLm9wZXJhdG9yYCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoYCR7Y2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmApO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb25cbiAgICBpZiAoXG4gICAgICBleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0ICYmXG4gICAgICAoZXhwci5jYWxsZWUuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSB8fFxuICAgICAgICBleHByLmNhbGxlZS5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdyb3VwaW5nKVxuICAgICkge1xuICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXROZXdFeHByKGV4cHI6IEV4cHIuTmV3KTogYW55IHtcbiAgICBjb25zdCBuZXdDYWxsID0gZXhwci5jbGF6eiBhcyBFeHByLkNhbGw7XG4gICAgLy8gaW50ZXJuYWwgY2xhc3MgZGVmaW5pdGlvbiBpbnN0YW5jZVxuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShuZXdDYWxsLmNhbGxlZSk7XG5cbiAgICBpZiAodHlwZW9mIGNsYXp6ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgIGAnJHtjbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgbmV3Q2FsbC5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VHlwZW9mRXhwcihleHByOiBFeHByLlR5cGVvZik6IGFueSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWFjaEV4cHIoZXhwcjogRXhwci5FYWNoKTogYW55IHtcbiAgICByZXR1cm4gW1xuICAgICAgZXhwci5uYW1lLmxleGVtZSxcbiAgICAgIGV4cHIua2V5ID8gZXhwci5rZXkubGV4ZW1lIDogbnVsbCxcbiAgICAgIHRoaXMuZXZhbHVhdGUoZXhwci5pdGVyYWJsZSksXG4gICAgXTtcbiAgfVxuXG4gIHZpc2l0Vm9pZEV4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29sICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHtlb2ZFcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKFwiJ1wiKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZygnXCInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChcInt7XCIpKSB7IGRlcHRoKys7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPiAwICYmIHRoaXMubWF0Y2goXCJ9fVwiKSkgeyBkZXB0aC0tOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmIHRoaXMucGVlayhcIjxcIikpIHsgYnJlYWs7IH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCFyYXcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0aGlzLmRlY29kZUVudGl0aWVzKHJhdyksIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVFbnRpdGllcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiXFx1MDBhMFwiKVxuICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgIC5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcbiAgICAgIC5yZXBsYWNlKC8mYXBvczsvZywgXCInXCIpXG4gICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpOyAvLyBtdXN0IGJlIGxhc3QgdG8gYXZvaWQgZG91YmxlLWRlY29kaW5nXG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJ0eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxubGV0IGFjdGl2ZUVmZmVjdDogeyBmbjogTGlzdGVuZXI7IGRlcHM6IFNldDxhbnk+IH0gfCBudWxsID0gbnVsbDtcbmNvbnN0IGVmZmVjdFN0YWNrOiBhbnlbXSA9IFtdO1xuXG5sZXQgYmF0Y2hpbmcgPSBmYWxzZTtcbmNvbnN0IHBlbmRpbmdTdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG5jb25zdCBwZW5kaW5nV2F0Y2hlcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbnR5cGUgV2F0Y2hlcjxUPiA9IChuZXdWYWx1ZTogVCwgb2xkVmFsdWU6IFQpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIF92YWx1ZTogVDtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG4gIHByaXZhdGUgd2F0Y2hlcnMgPSBuZXcgU2V0PFdhdGNoZXI8VD4+KCk7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZhbHVlOiBUKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5hZGQoYWN0aXZlRWZmZWN0LmZuKTtcbiAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLmFkZCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl92YWx1ZTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBpZiAoYmF0Y2hpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpYmVycykgcGVuZGluZ1N1YnNjcmliZXJzLmFkZChzdWIpO1xuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykgcGVuZGluZ1dhdGNoZXJzLnB1c2goKCkgPT4gd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycykpIHtcbiAgICAgICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSB7XG4gICAgICAgICAgdHJ5IHsgd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2UoZm46IFdhdGNoZXI8VD4pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lcikge1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25hbDxUPihpbml0aWFsVmFsdWU6IFQpOiBTaWduYWw8VD4ge1xuICByZXR1cm4gbmV3IFNpZ25hbChpbml0aWFsVmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmF0Y2goZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgYmF0Y2hpbmcgPSB0cnVlO1xuICB0cnkge1xuICAgIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgYmF0Y2hpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbShwZW5kaW5nU3Vic2NyaWJlcnMpO1xuICAgIHBlbmRpbmdTdWJzY3JpYmVycy5jbGVhcigpO1xuICAgIGNvbnN0IHdhdGNoZXJzID0gcGVuZGluZ1dhdGNoZXJzLnNwbGljZSgwKTtcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiBzdWJzKSB7XG4gICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2Ygd2F0Y2hlcnMpIHtcbiAgICAgIHRyeSB7IHdhdGNoZXIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgY29uc3QgcyA9IHNpZ25hbDxUPih1bmRlZmluZWQgYXMgYW55KTtcbiAgZWZmZWN0KCgpID0+IHtcbiAgICBzLnZhbHVlID0gZm4oKTtcbiAgfSk7XG4gIHJldHVybiBzO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJvdW5kYXJ5IHtcbiAgcHJpdmF0ZSBzdGFydDogQ29tbWVudDtcbiAgcHJpdmF0ZSBlbmQ6IENvbW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBOb2RlLCBsYWJlbDogc3RyaW5nID0gXCJib3VuZGFyeVwiKSB7XG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LXN0YXJ0YCk7XG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1lbmRgKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgZWZmZWN0IH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBCb3VuZGFyeSB9IGZyb20gXCIuL2JvdW5kYXJ5XCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIElmRWxzZU5vZGUgPSBbS05vZGUuRWxlbWVudCwgS05vZGUuQXR0cmlidXRlXTtcblxuZXhwb3J0IGNsYXNzIFRyYW5zcGlsZXIgaW1wbGVtZW50cyBLTm9kZS5LTm9kZVZpc2l0b3I8dm9pZD4ge1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBFeHByZXNzaW9uUGFyc2VyKCk7XG4gIHByaXZhdGUgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIoKTtcbiAgcHJpdmF0ZSByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5yZWdpc3RyeSkge1xuICAgICAgdGhpcy5yZWdpc3RyeSA9IG9wdGlvbnMucmVnaXN0cnk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwaWxlKFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVudGl0eTogYW55LFxuICAgIGNvbnRhaW5lcjogRWxlbWVudFxuICApOiBOb2RlIHtcbiAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGVudGl0eSk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgY29udGFpbmVyKTtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudHJhY2tFZmZlY3QodGV4dCwgc3RvcCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKGUubWVzc2FnZSB8fCBgJHtlfWAsIFwidGV4dCBub2RlXCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHIgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobm9kZS5uYW1lKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBhdHRyLnZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgIH0pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYXR0ciwgc3RvcCk7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAocGFyZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IENvbW1lbnQobm9kZS52YWx1ZSk7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYWNrRWZmZWN0KHRhcmdldDogYW55LCBzdG9wOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25zWzBdWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxLCBleHByZXNzaW9ucy5sZW5ndGgpKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICBjb25zdCAkZWxzZWlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgIGlmICgkZWxzZWlmKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VcIl0pKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qga2V5QXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQGtleVwiXSk7XG4gICAgaWYgKGtleUF0dHIpIHtcbiAgICAgIHRoaXMuZG9FYWNoS2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50LCBrZXlBdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb0VhY2hVbmtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hVbmtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBrZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcblxuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGtleSkgc2NvcGVWYWx1ZXNba2V5XSA9IGluZGV4O1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgY29uc3QgW25hbWUsIGluZGV4S2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IGl0ZW1zIGFuZCB0aGVpciBrZXlzXG4gICAgICBjb25zdCBuZXdJdGVtczogQXJyYXk8eyBpdGVtOiBhbnk7IGlkeDogbnVtYmVyOyBrZXk6IGFueSB9PiA9IFtdO1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpbmRleDtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXhlY3V0ZShrZXlBdHRyLnZhbHVlKTtcbiAgICAgICAgbmV3SXRlbXMucHVzaCh7IGl0ZW0sIGlkeDogaW5kZXgsIGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgY29uc3QgbmV3S2V5U2V0ID0gbmV3IFNldChuZXdJdGVtcy5tYXAoKGkpID0+IGkua2V5KSk7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRvbU5vZGVdIG9mIGtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICB0aGlzLmRlc3Ryb3lOb2RlKGRvbU5vZGUpO1xuICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICBmb3IgKGNvbnN0IHsgaXRlbSwgaWR4LCBrZXkgfSBvZiBuZXdJdGVtcykge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuXG4gICAgICAgIGlmIChrZXllZE5vZGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGtleWVkTm9kZXMuZ2V0KGtleSkhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgaWYgKGNyZWF0ZWQpIGtleWVkTm9kZXMuc2V0KGtleSwgY3JlYXRlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9XaGlsZSgkd2hpbGU6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcIndoaWxlXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUpO1xuICAgICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIC8vIGV4ZWN1dGVzIGluaXRpYWxpemF0aW9uIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gIHByaXZhdGUgZG9MZXQoaW5pdDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGVhY2hcIl0pO1xuICAgICAgICBpZiAoJGVhY2gpIHtcbiAgICAgICAgICB0aGlzLmRvRWFjaCgkZWFjaCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAaWZcIl0pO1xuICAgICAgICBpZiAoJGlmKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbbm9kZSBhcyBLTm9kZS5FbGVtZW50LCAkaWZdXTtcblxuICAgICAgICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gdGhpcy5maW5kQXR0cihub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBbXG4gICAgICAgICAgICAgIFwiQGVsc2VcIixcbiAgICAgICAgICAgICAgXCJAZWxzZWlmXCIsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICR3aGlsZSA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAd2hpbGVcIl0pO1xuICAgICAgICBpZiAoJHdoaWxlKSB7XG4gICAgICAgICAgdGhpcy5kb1doaWxlKCR3aGlsZSwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgdGhpcy5kb0xldCgkbGV0LCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJzbG90XCIpIHtcbiAgICAgICAgY29uc3QgbmFtZUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIm5hbWVcIl0pO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZUF0dHIgPyBuYW1lQXR0ci52YWx1ZSA6IFwiZGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBzbG90cyA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJHNsb3RzXCIpO1xuICAgICAgICBpZiAoc2xvdHMgJiYgc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuICAgICAgY29uc3QgZWxlbWVudCA9IGlzVm9pZCA/IHBhcmVudCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZS5uYW1lKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQgIT09IHBhcmVudCkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRyZWZcIiwgZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0NvbXBvbmVudCkge1xuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBhbmQgc2V0IGl0IGFzIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IHt9O1xuICAgICAgICBjb25zdCBhcmdzQXR0ciA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5jcmVhdGVDb21wb25lbnRBcmdzKGFyZ3NBdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZVtdKTtcblxuICAgICAgICAvLyBDYXB0dXJlIGNoaWxkcmVuIGZvciBzbG90c1xuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgS05vZGUuS05vZGVbXT4gPSB7IGRlZmF1bHQ6IFtdIH07XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcInNsb3RcIl0pO1xuICAgICAgICAgICAgaWYgKHNsb3RBdHRyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzbG90QXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFzbG90c1tuYW1lXSkgc2xvdHNbbmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgc2xvdHNbbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzbG90cy5kZWZhdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXT8uY29tcG9uZW50KSB7XG4gICAgICAgICAgY29tcG9uZW50ID0gbmV3IHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5jb21wb25lbnQoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbkluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uSW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHBvc2Ugc2xvdHMgaW4gY29tcG9uZW50IHNjb3BlXG4gICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMsIGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgICAgLy8gZXZlbnQgYmluZGluZ1xuICAgICAgICBjb25zdCBldmVudHMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBmaXJzdClcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoXG4gICAgICAgICAgKGF0dHIpID0+ICEoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgYXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXR0ciwgZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG9ydGhhbmQgYXR0cmlidXRlcyAocHJvY2Vzc2VkIHNlY29uZCwgYWxsb3dzIG1lcmdpbmcpXG4gICAgICAgIGNvbnN0IHNob3J0aGFuZEF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgbmFtZS5zdGFydHNXaXRoKFwiQFwiKSAmJlxuICAgICAgICAgICAgIVtcIkBpZlwiLCBcIkBlbHNlaWZcIiwgXCJAZWxzZVwiLCBcIkBlYWNoXCIsIFwiQHdoaWxlXCIsIFwiQGxldFwiLCBcIkBrZXlcIiwgXCJAcmVmXCJdLmluY2x1ZGVzKFxuICAgICAgICAgICAgICBuYW1lXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIHNob3J0aGFuZEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCByZWFsTmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zbGljZSgxKTtcblxuICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICBsZXQgbGFzdER5bmFtaWNWYWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhdGljQ2xhc3MgPSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBzdGF0aWNDbGFzcy5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGMgPT4gYyAhPT0gbGFzdER5bmFtaWNWYWx1ZSAmJiBjICE9PSBcIlwiKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBjdXJyZW50Q2xhc3NlcyA/IGAke2N1cnJlbnRDbGFzc2VzfSAke3ZhbHVlfWAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgbGFzdER5bmFtaWNWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcblxuICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbE5hbWUgIT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gZXhpc3RpbmcgJiYgIWV4aXN0aW5nLmluY2x1ZGVzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKHJlYWxOYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJlbnQgJiYgIWlzVm9pZCkge1xuICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVmQXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQHJlZlwiXSk7XG4gICAgICBpZiAocmVmQXR0ciAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcmVmQXR0ci52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IGVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQocHJvcE5hbWUsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnNlbGYpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZS5jaGlsZHJlbiwgZWxlbWVudCk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuXG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRoaXMuZXJyb3IoZS5tZXNzYWdlIHx8IGAke2V9YCwgbm9kZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5leGVjdXRlKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgW2V2ZW50TmFtZSwgLi4ubW9kaWZpZXJzXSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGxpc3RlbmVyU2NvcGUgPSBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbCA9IGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkgICAgb3B0aW9ucy5vbmNlICAgID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSkgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChldmVudCkgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInByZXZlbnRcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic3RvcFwiKSkgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICB0aGlzLmV4ZWN1dGUoYXR0ci52YWx1ZSwgbGlzdGVuZXJTY29wZSk7XG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlVGVtcGxhdGVTdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb25zdCByZWdleCA9IC9cXHtcXHsuK1xcfVxcfS9tcztcbiAgICBpZiAocmVnZXgudGVzdCh0ZXh0KSkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24ocGxhY2Vob2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24oc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gYCR7dGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKX1gO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95Tm9kZShub2RlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyAxLiBDbGVhbnVwIGNvbXBvbmVudCBpbnN0YW5jZVxuICAgIGlmIChub2RlLiRrYXNwZXJJbnN0YW5jZSkge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBub2RlLiRrYXNwZXJJbnN0YW5jZTtcbiAgICAgIGlmIChpbnN0YW5jZS5vbkRlc3Ryb3kpIGluc3RhbmNlLm9uRGVzdHJveSgpO1xuICAgICAgaWYgKGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9XG5cbiAgICAvLyAyLiBDbGVhbnVwIGVmZmVjdHMgYXR0YWNoZWQgdG8gdGhlIG5vZGVcbiAgICBpZiAobm9kZS4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIH1cblxuICAgIC8vIDMuIENsZWFudXAgZWZmZWN0cyBvbiBhdHRyaWJ1dGVzXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gNC4gUmVjdXJzZVxuICAgIG5vZGUuY2hpbGROb2Rlcz8uZm9yRWFjaCgoY2hpbGQ6IGFueSkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koY29udGFpbmVyOiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShfbm9kZTogS05vZGUuRG9jdHlwZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIHRhZ05hbWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjbGVhbk1lc3NhZ2UgPSBtZXNzYWdlLnN0YXJ0c1dpdGgoXCJSdW50aW1lIEVycm9yXCIpXG4gICAgICA/IG1lc3NhZ2VcbiAgICAgIDogYFJ1bnRpbWUgRXJyb3I6ICR7bWVzc2FnZX1gO1xuXG4gICAgaWYgKHRhZ05hbWUgJiYgIWNsZWFuTWVzc2FnZS5pbmNsdWRlcyhgYXQgPCR7dGFnTmFtZX0+YCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtjbGVhbk1lc3NhZ2V9XFxuICBhdCA8JHt0YWdOYW1lfT5gKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoY2xlYW5NZXNzYWdlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICB0cnkge1xuICAgIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcGlsZShcbiAgc291cmNlOiBzdHJpbmcsXG4gIGVudGl0eT86IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gIGNvbnRhaW5lcj86IEhUTUxFbGVtZW50LFxuICByZWdpc3RyeT86IENvbXBvbmVudFJlZ2lzdHJ5XG4pOiBOb2RlIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB8fCB7fSB9KTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudGl0eSB8fCB7fSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVyKENvbXBvbmVudENsYXNzOiBhbnkpIHtcbiAgS2FzcGVySW5pdCh7XG4gICAgcm9vdDogXCJrYXNwZXItYXBwXCIsXG4gICAgZW50cnk6IFwia2FzcGVyLXJvb3RcIixcbiAgICByZWdpc3RyeToge1xuICAgICAgXCJrYXNwZXItcm9vdFwiOiB7XG4gICAgICAgIHNlbGVjdG9yOiBcInRlbXBsYXRlXCIsXG4gICAgICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3MsXG4gICAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgICBub2RlczogW10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgQXBwQ29uZmlnIHtcbiAgcm9vdD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoXG4gIHRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsXG4gIHRhZzogc3RyaW5nLFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnlcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVnaXN0cnlbdGFnXS5jb21wb25lbnQoe1xuICAgIHJlZjogZWxlbWVudCxcbiAgICB0cmFuc3BpbGVyOiB0cmFuc3BpbGVyLFxuICAgIGFyZ3M6IHt9LFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIG5vZGU6IGVsZW1lbnQsXG4gICAgaW5zdGFuY2U6IGNvbXBvbmVudCxcbiAgICBub2RlczogcmVnaXN0cnlbdGFnXS5ub2RlcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmVnaXN0cnkoXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSxcbiAgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxuKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHsgLi4ucmVnaXN0cnkgfTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocmVnaXN0cnkpKSB7XG4gICAgY29uc3QgZW50cnkgPSByZWdpc3RyeVtrZXldO1xuICAgIGlmIChlbnRyeS5ub2RlcyAmJiBlbnRyeS5ub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVudHJ5LnNlbGVjdG9yKTtcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIGVudHJ5LnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICBlbnRyeS5ub2RlcyA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZS5pbm5lckhUTUwpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVySW5pdChjb25maWc6IEFwcENvbmZpZykge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgcm9vdCA9XG4gICAgdHlwZW9mIGNvbmZpZy5yb290ID09PSBcInN0cmluZ1wiXG4gICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpXG4gICAgICA6IGNvbmZpZy5yb290O1xuXG4gIGlmICghcm9vdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUm9vdCBlbGVtZW50IG5vdCBmb3VuZDogJHtjb25maWcucm9vdH1gKTtcbiAgfVxuXG4gIGNvbnN0IHJlZ2lzdHJ5ID0gbm9ybWFsaXplUmVnaXN0cnkoY29uZmlnLnJlZ2lzdHJ5LCBwYXJzZXIpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogcmVnaXN0cnkgfSk7XG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuXG4gIGNvbnN0IHsgbm9kZSwgaW5zdGFuY2UsIG5vZGVzIH0gPSBjcmVhdGVDb21wb25lbnQoXG4gICAgdHJhbnNwaWxlcixcbiAgICBlbnRyeVRhZyxcbiAgICByZWdpc3RyeVxuICApO1xuXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cblxuICAvLyBJbml0aWFsIHJlbmRlciBhbmQgbGlmZWN5Y2xlXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Jbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vbkluaXQoKTtcbiAgfVxuXG4gIHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBpbnN0YW5jZSwgbm9kZSBhcyBIVE1MRWxlbWVudCk7XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cbiIsImltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld2VyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHN0cmluZz4ge1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUuYWNjZXB0KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zcGlsZShub2RlczogS05vZGUuS05vZGVbXSk6IHN0cmluZ1tdIHtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZXZhbHVhdGUobm9kZSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcy5tYXAoKGF0dHIpID0+IHRoaXMuZXZhbHVhdGUoYXR0cikpLmpvaW4oXCIgXCIpO1xyXG4gICAgaWYgKGF0dHJzLmxlbmd0aCkge1xyXG4gICAgICBhdHRycyA9IFwiIFwiICsgYXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfS8+YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSkuam9pbihcIlwiKTtcclxuICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9PiR7Y2hpbGRyZW59PC8ke25vZGUubmFtZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSk6IHN0cmluZyB7XHJcbiAgICBpZiAobm9kZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gYCR7bm9kZS5uYW1lfT1cIiR7bm9kZS52YWx1ZX1cImA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5uYW1lO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUudmFsdWVcclxuICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcclxuICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csIFwiJm5ic3A7XCIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGA8IS0tICR7bm9kZS52YWx1ZX0gLS0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCFkb2N0eXBlICR7bm9kZS52YWx1ZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBleGVjdXRlLCB0cmFuc3BpbGUsIEthc3BlciwgS2FzcGVySW5pdCB9IGZyb20gXCIuL2thc3BlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgVmlld2VyIH0gZnJvbSBcIi4vdmlld2VyXCI7XG5pbXBvcnQgeyBzaWduYWwsIGVmZmVjdCwgY29tcHV0ZWQsIGJhdGNoIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICgod2luZG93IGFzIGFueSkgfHwge30pLmthc3BlciA9IHtcbiAgICBleGVjdXRlOiBleGVjdXRlLFxuICAgIHRyYW5zcGlsZTogdHJhbnNwaWxlLFxuICAgIEFwcDogS2FzcGVySW5pdCxcbiAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICBUZW1wbGF0ZVBhcnNlcjogVGVtcGxhdGVQYXJzZXIsXG4gICAgVHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgICBWaWV3ZXI6IFZpZXdlcixcbiAgICBzaWduYWw6IHNpZ25hbCxcbiAgICBlZmZlY3Q6IGVmZmVjdCxcbiAgICBjb21wdXRlZDogY29tcHV0ZWQsXG4gICAgYmF0Y2g6IGJhdGNoLFxuICB9O1xuICAod2luZG93IGFzIGFueSlbXCJLYXNwZXJcIl0gPSBLYXNwZXI7XG4gICh3aW5kb3cgYXMgYW55KVtcIkNvbXBvbmVudFwiXSA9IENvbXBvbmVudDtcbn1cblxuZXhwb3J0IHsgRXhwcmVzc2lvblBhcnNlciwgSW50ZXJwcmV0ZXIsIFNjYW5uZXIsIFRlbXBsYXRlUGFyc2VyLCBUcmFuc3BpbGVyLCBWaWV3ZXIsIHNpZ25hbCwgZWZmZWN0LCBjb21wdXRlZCwgYmF0Y2ggfTtcbmV4cG9ydCB7IGV4ZWN1dGUsIHRyYW5zcGlsZSwgS2FzcGVyLCBLYXNwZXJJbml0IGFzIEFwcCwgQ29tcG9uZW50IH07XG4iXSwibmFtZXMiOlsiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5UZXJuYXJ5IiwiRXhwci5OdWxsQ29hbGVzY2luZyIsIkV4cHIuTG9naWNhbCIsIkV4cHIuVHlwZW9mIiwiRXhwci5VbmFyeSIsIkV4cHIuTmV3IiwiRXhwci5Qb3N0Zml4IiwiRXhwci5DYWxsIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsInNlbGYiLCJOb2RlLkNvbW1lbnQiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCJdLCJtYXBwaW5ncyI6Ijs7OztFQVNPLE1BQU0sVUFBVTtBQUFBLElBTXJCLFlBQVksT0FBdUI7QUFMbkMsV0FBQSxPQUE0QixDQUFBO0FBRzVCLFdBQUEsbUJBQW1CLElBQUksZ0JBQUE7QUFHckIsVUFBSSxDQUFDLE9BQU87QUFDVixhQUFLLE9BQU8sQ0FBQTtBQUNaO0FBQUEsTUFDRjtBQUNBLFVBQUksTUFBTSxNQUFNO0FBQ2QsYUFBSyxPQUFPLE1BQU0sUUFBUSxDQUFBO0FBQUEsTUFDNUI7QUFDQSxVQUFJLE1BQU0sS0FBSztBQUNiLGFBQUssTUFBTSxNQUFNO0FBQUEsTUFDbkI7QUFDQSxVQUFJLE1BQU0sWUFBWTtBQUNwQixhQUFLLGFBQWEsTUFBTTtBQUFBLE1BQzFCO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUztBQUFBLElBQUM7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUFDO0FBQUEsSUFDWixZQUFZO0FBQUEsSUFBQztBQUFBLElBQ2IsWUFBWTtBQUFBLElBQUM7QUFBQSxJQUViLFlBQVk7QUFDVixVQUFJLENBQUMsS0FBSyxZQUFZO0FBQ3BCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUN6Q08sTUFBTSxvQkFBb0IsTUFBTTtBQUFBLElBSXJDLFlBQVksT0FBZSxNQUFjLEtBQWE7QUFDcEQsWUFBTSxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxLQUFLLEVBQUU7QUFDaEQsV0FBSyxPQUFPO0FBQ1osV0FBSyxPQUFPO0FBQ1osV0FBSyxNQUFNO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFBQSxFQ1JPLE1BQWUsS0FBSztBQUFBO0FBQUEsSUFJekIsY0FBYztBQUFBLElBQUU7QUFBQSxFQUVsQjtBQUFBLEVBNEJPLE1BQU0sZUFBZSxLQUFLO0FBQUEsSUFJN0IsWUFBWSxNQUFhLE9BQWEsTUFBYztBQUNoRCxZQUFBO0FBQ0EsV0FBSyxPQUFPO0FBQ1osV0FBSyxRQUFRO0FBQ2IsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGdCQUFnQixJQUFJO0FBQUEsSUFDdkM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxlQUFlLEtBQUs7QUFBQSxJQUs3QixZQUFZLE1BQVksVUFBaUIsT0FBYSxNQUFjO0FBQ2hFLFlBQUE7QUFDQSxXQUFLLE9BQU87QUFDWixXQUFLLFdBQVc7QUFDaEIsV0FBSyxRQUFRO0FBQ2IsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGdCQUFnQixJQUFJO0FBQUEsSUFDdkM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxhQUFhLEtBQUs7QUFBQSxJQUszQixZQUFZLFFBQWMsT0FBYyxNQUFjLE1BQWM7QUFDaEUsWUFBQTtBQUNBLFdBQUssU0FBUztBQUNkLFdBQUssUUFBUTtBQUNiLFdBQUssT0FBTztBQUNaLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxjQUFjLElBQUk7QUFBQSxJQUNyQztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxNQUFNLGNBQWMsS0FBSztBQUFBLElBRzVCLFlBQVksT0FBYSxNQUFjO0FBQ25DLFlBQUE7QUFDQSxXQUFLLFFBQVE7QUFDYixXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBRUssT0FBVSxTQUE0QjtBQUN6QyxhQUFPLFFBQVEsZUFBZSxJQUFJO0FBQUEsSUFDdEM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxtQkFBbUIsS0FBSztBQUFBLElBR2pDLFlBQVksWUFBb0IsTUFBYztBQUMxQyxZQUFBO0FBQ0EsV0FBSyxhQUFhO0FBQ2xCLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxvQkFBb0IsSUFBSTtBQUFBLElBQzNDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sYUFBYSxLQUFLO0FBQUEsSUFLM0IsWUFBWSxNQUFhLEtBQVksVUFBZ0IsTUFBYztBQUMvRCxZQUFBO0FBQ0EsV0FBSyxPQUFPO0FBQ1osV0FBSyxNQUFNO0FBQ1gsV0FBSyxXQUFXO0FBQ2hCLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxjQUFjLElBQUk7QUFBQSxJQUNyQztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxNQUFNLFlBQVksS0FBSztBQUFBLElBSzFCLFlBQVksUUFBYyxLQUFXLE1BQWlCLE1BQWM7QUFDaEUsWUFBQTtBQUNBLFdBQUssU0FBUztBQUNkLFdBQUssTUFBTTtBQUNYLFdBQUssT0FBTztBQUNaLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxJQUNwQztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxNQUFNLGlCQUFpQixLQUFLO0FBQUEsSUFHL0IsWUFBWSxZQUFrQixNQUFjO0FBQ3hDLFlBQUE7QUFDQSxXQUFLLGFBQWE7QUFDbEIsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGtCQUFrQixJQUFJO0FBQUEsSUFDekM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxZQUFZLEtBQUs7QUFBQSxJQUcxQixZQUFZLE1BQWEsTUFBYztBQUNuQyxZQUFBO0FBQ0EsV0FBSyxPQUFPO0FBQ1osV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGFBQWEsSUFBSTtBQUFBLElBQ3BDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sZ0JBQWdCLEtBQUs7QUFBQSxJQUs5QixZQUFZLE1BQVksVUFBaUIsT0FBYSxNQUFjO0FBQ2hFLFlBQUE7QUFDQSxXQUFLLE9BQU87QUFDWixXQUFLLFdBQVc7QUFDaEIsV0FBSyxRQUFRO0FBQ2IsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGlCQUFpQixJQUFJO0FBQUEsSUFDeEM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxhQUFhLEtBQUs7QUFBQSxJQUczQixZQUFZLE9BQWUsTUFBYztBQUNyQyxZQUFBO0FBQ0EsV0FBSyxRQUFRO0FBQ2IsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGNBQWMsSUFBSTtBQUFBLElBQ3JDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sZ0JBQWdCLEtBQUs7QUFBQSxJQUc5QixZQUFZLE9BQVksTUFBYztBQUNsQyxZQUFBO0FBQ0EsV0FBSyxRQUFRO0FBQ2IsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGlCQUFpQixJQUFJO0FBQUEsSUFDeEM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxZQUFZLEtBQUs7QUFBQSxJQUcxQixZQUFZLE9BQWEsTUFBYztBQUNuQyxZQUFBO0FBQ0EsV0FBSyxRQUFRO0FBQ2IsV0FBSyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUVLLE9BQVUsU0FBNEI7QUFDekMsYUFBTyxRQUFRLGFBQWEsSUFBSTtBQUFBLElBQ3BDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sdUJBQXVCLEtBQUs7QUFBQSxJQUlyQyxZQUFZLE1BQVksT0FBYSxNQUFjO0FBQy9DLFlBQUE7QUFDQSxXQUFLLE9BQU87QUFDWixXQUFLLFFBQVE7QUFDYixXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBRUssT0FBVSxTQUE0QjtBQUN6QyxhQUFPLFFBQVEsd0JBQXdCLElBQUk7QUFBQSxJQUMvQztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxNQUFNLGdCQUFnQixLQUFLO0FBQUEsSUFJOUIsWUFBWSxRQUFjLFdBQW1CLE1BQWM7QUFDdkQsWUFBQTtBQUNBLFdBQUssU0FBUztBQUNkLFdBQUssWUFBWTtBQUNqQixXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBRUssT0FBVSxTQUE0QjtBQUN6QyxhQUFPLFFBQVEsaUJBQWlCLElBQUk7QUFBQSxJQUN4QztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO2NBRU8sTUFBTSxZQUFZLEtBQUs7QUFBQSxJQUsxQixZQUFZLFFBQWMsS0FBVyxPQUFhLE1BQWM7QUFDNUQsWUFBQTtBQUNBLFdBQUssU0FBUztBQUNkLFdBQUssTUFBTTtBQUNYLFdBQUssUUFBUTtBQUNiLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxJQUNwQztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxNQUFNLGlCQUFpQixLQUFLO0FBQUEsSUFHL0IsWUFBWSxPQUFlLE1BQWM7QUFDckMsWUFBQTtBQUNBLFdBQUssUUFBUTtBQUNiLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxrQkFBa0IsSUFBSTtBQUFBLElBQ3pDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sZ0JBQWdCLEtBQUs7QUFBQSxJQUs5QixZQUFZLFdBQWlCLFVBQWdCLFVBQWdCLE1BQWM7QUFDdkUsWUFBQTtBQUNBLFdBQUssWUFBWTtBQUNqQixXQUFLLFdBQVc7QUFDaEIsV0FBSyxXQUFXO0FBQ2hCLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxpQkFBaUIsSUFBSTtBQUFBLElBQ3hDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sZUFBZSxLQUFLO0FBQUEsSUFHN0IsWUFBWSxPQUFhLE1BQWM7QUFDbkMsWUFBQTtBQUNBLFdBQUssUUFBUTtBQUNiLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFFSyxPQUFVLFNBQTRCO0FBQ3pDLGFBQU8sUUFBUSxnQkFBZ0IsSUFBSTtBQUFBLElBQ3ZDO0FBQUEsSUFFTyxXQUFtQjtBQUN0QixhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUVPLE1BQU0sY0FBYyxLQUFLO0FBQUEsSUFJNUIsWUFBWSxVQUFpQixPQUFhLE1BQWM7QUFDcEQsWUFBQTtBQUNBLFdBQUssV0FBVztBQUNoQixXQUFLLFFBQVE7QUFDYixXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBRUssT0FBVSxTQUE0QjtBQUN6QyxhQUFPLFFBQVEsZUFBZSxJQUFJO0FBQUEsSUFDdEM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxpQkFBaUIsS0FBSztBQUFBLElBRy9CLFlBQVksTUFBYSxNQUFjO0FBQ25DLFlBQUE7QUFDQSxXQUFLLE9BQU87QUFDWixXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBRUssT0FBVSxTQUE0QjtBQUN6QyxhQUFPLFFBQVEsa0JBQWtCLElBQUk7QUFBQSxJQUN6QztBQUFBLElBRU8sV0FBbUI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxNQUFNLGFBQWEsS0FBSztBQUFBLElBRzNCLFlBQVksT0FBYSxNQUFjO0FBQ25DLFlBQUE7QUFDQSxXQUFLLFFBQVE7QUFDYixXQUFLLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBRUssT0FBVSxTQUE0QjtBQUN6QyxhQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsSUFDckM7QUFBQSxJQUVPLFdBQW1CO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDRjtBQ2xkTyxNQUFLLDhCQUFBQSxlQUFMO0FBRUxBLGVBQUFBLFdBQUEsS0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFHQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLEtBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxnQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGlCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEs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
