(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.KasperLib = {}));
})(this, (function(exports2) {
  "use strict";
  class Component {
    constructor(props) {
      this.args = {};
      this.$onInit = () => {
      };
      this.$onRender = () => {
      };
      this.$onChanges = () => {
      };
      this.$onDestroy = () => {
      };
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
    }
  }
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
      return "Expr.Postfix";
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
      return "Expr.Set";
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
    TokenType2[TokenType2["Colon"] = 23] = "Colon";
    TokenType2[TokenType2["Equal"] = 24] = "Equal";
    TokenType2[TokenType2["EqualEqual"] = 25] = "EqualEqual";
    TokenType2[TokenType2["Greater"] = 26] = "Greater";
    TokenType2[TokenType2["GreaterEqual"] = 27] = "GreaterEqual";
    TokenType2[TokenType2["Less"] = 28] = "Less";
    TokenType2[TokenType2["LessEqual"] = 29] = "LessEqual";
    TokenType2[TokenType2["Minus"] = 30] = "Minus";
    TokenType2[TokenType2["MinusEqual"] = 31] = "MinusEqual";
    TokenType2[TokenType2["MinusMinus"] = 32] = "MinusMinus";
    TokenType2[TokenType2["PercentEqual"] = 33] = "PercentEqual";
    TokenType2[TokenType2["Plus"] = 34] = "Plus";
    TokenType2[TokenType2["PlusEqual"] = 35] = "PlusEqual";
    TokenType2[TokenType2["PlusPlus"] = 36] = "PlusPlus";
    TokenType2[TokenType2["Question"] = 37] = "Question";
    TokenType2[TokenType2["QuestionDot"] = 38] = "QuestionDot";
    TokenType2[TokenType2["QuestionQuestion"] = 39] = "QuestionQuestion";
    TokenType2[TokenType2["SlashEqual"] = 40] = "SlashEqual";
    TokenType2[TokenType2["StarEqual"] = 41] = "StarEqual";
    TokenType2[TokenType2["DotDot"] = 42] = "DotDot";
    TokenType2[TokenType2["DotDotDot"] = 43] = "DotDotDot";
    TokenType2[TokenType2["LessEqualGreater"] = 44] = "LessEqualGreater";
    TokenType2[TokenType2["Identifier"] = 45] = "Identifier";
    TokenType2[TokenType2["Template"] = 46] = "Template";
    TokenType2[TokenType2["String"] = 47] = "String";
    TokenType2[TokenType2["Number"] = 48] = "Number";
    TokenType2[TokenType2["And"] = 49] = "And";
    TokenType2[TokenType2["Const"] = 50] = "Const";
    TokenType2[TokenType2["Debug"] = 51] = "Debug";
    TokenType2[TokenType2["False"] = 52] = "False";
    TokenType2[TokenType2["Instanceof"] = 53] = "Instanceof";
    TokenType2[TokenType2["New"] = 54] = "New";
    TokenType2[TokenType2["Null"] = 55] = "Null";
    TokenType2[TokenType2["Undefined"] = 56] = "Undefined";
    TokenType2[TokenType2["Of"] = 57] = "Of";
    TokenType2[TokenType2["Or"] = 58] = "Or";
    TokenType2[TokenType2["True"] = 59] = "True";
    TokenType2[TokenType2["Typeof"] = 60] = "Typeof";
    TokenType2[TokenType2["Void"] = 61] = "Void";
    TokenType2[TokenType2["With"] = 62] = "With";
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
        } catch (e) {
          if (e instanceof KasperError) {
            this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
          } else {
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
      this.errors = [];
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
          return new Set(expr.entity, expr.key, value, expr.line);
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
        TokenType.EqualEqual,
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
        const construct = this.call();
        return new New(construct, keyword.line);
      }
      return this.call();
    }
    call() {
      let expr = this.primary();
      let consumed = true;
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
        if (this.match(TokenType.PlusPlus)) {
          return new Postfix(identifier, 1, identifier.line);
        }
        if (this.match(TokenType.MinusMinus)) {
          return new Postfix(identifier, -1, identifier.line);
        }
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
              new Set(null, new Key(key, key.line), value, key.line)
            );
          } else {
            const value = new Variable(key, key.line);
            properties.push(
              new Set(null, new Key(key, key.line), value, key.line)
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
    return char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "$";
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
      this.errors = [];
      this.current = 0;
      this.start = 0;
      this.line = 1;
      this.col = 1;
      while (!this.eof()) {
        this.start = this.current;
        try {
          this.getToken();
        } catch (e) {
          this.errors.push(`${e}`);
          if (this.errors.length > 100) {
            this.errors.push("Error limit exceeded");
            return this.tokens;
          }
        }
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
            this.match("=") ? TokenType.BangEqual : TokenType.Bang,
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
              this.match("=") ? TokenType.EqualEqual : TokenType.EqualEqual,
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
      this.errors = [];
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
          return left === right;
        case TokenType.BangEqual:
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
      return this.evaluate(expr.condition).isTruthy() ? this.evaluate(expr.thenExpr) : this.evaluate(expr.elseExpr);
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
        case TokenType.Minus:
          return -right;
        case TokenType.Bang:
          return !right;
        case TokenType.PlusPlus:
        case TokenType.MinusMinus:
          const newValue = Number(right) + (expr.operator.type === TokenType.PlusPlus ? 1 : -1);
          if (expr.right instanceof Variable) {
            this.scope.set(expr.right.name.lexeme, newValue);
          } else if (expr.right instanceof Get) {
            const assign = new Set(
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
      this.errors = [];
      this.nodes = [];
      while (!this.eof()) {
        try {
          const node = this.node();
          if (node === null) {
            continue;
          }
          this.nodes.push(node);
        } catch (e) {
          if (e instanceof KasperError) {
            this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
          } else {
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
      while (!this.peek("<") && !this.eof()) {
        this.advance();
      }
      const text = this.source.slice(start, this.current).trim();
      if (!text) {
        return null;
      }
      return new Text(text, line);
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
  class Transpiler {
    constructor(options) {
      this.scanner = new Scanner();
      this.parser = new ExpressionParser();
      this.interpreter = new Interpreter();
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
      const result = expressions.map(
        (expression) => this.interpreter.evaluate(expression)
      );
      this.interpreter.scope = restoreScope;
      return result && result.length ? result[0] : void 0;
    }
    transpile(nodes, entity, container) {
      container.innerHTML = "";
      this.interpreter.scope.init(entity);
      this.errors = [];
      try {
        this.createSiblings(nodes, container);
      } catch (e) {
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
      const attrib = node.attributes.find(
        (attr) => name.includes(attr.name)
      );
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
          } else {
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
      const [name, key, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );
      const originalScope = this.interpreter.scope;
      let index = 0;
      for (const item of iterable) {
        const scope = { [name]: item };
        if (key) {
          scope[key] = index;
        }
        this.interpreter.scope = new Scope(originalScope, scope);
        this.createElement(node, parent);
        index += 1;
      }
      this.interpreter.scope = originalScope;
    }
    doWhile($while, node, parent) {
      const originalScope = this.interpreter.scope;
      this.interpreter.scope = new Scope(originalScope);
      while (this.execute($while.value)) {
        this.createElement(node, parent);
      }
      this.interpreter.scope = originalScope;
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
            const tag = node.name;
            let found = true;
            while (found) {
              if (current >= nodes.length) {
                break;
              }
              const attr = this.findAttr(nodes[current], [
                "@else",
                "@elseif"
              ]);
              if (nodes[current].name === tag && attr) {
                expressions.push([nodes[current], attr]);
                current += 1;
              } else {
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
      var _a;
      const isVoid = node.name === "void";
      const isComponent = !!this.registry[node.name];
      const element = isVoid ? parent : document.createElement(node.name);
      const restoreScope = this.interpreter.scope;
      if (isComponent) {
        let component = {};
        const argsAttr = node.attributes.filter(
          (attr) => attr.name.startsWith("@:")
        );
        const args = this.createComponentArgs(argsAttr);
        if ((_a = this.registry[node.name]) == null ? void 0 : _a.component) {
          const ref = element;
          const transpiler = this;
          component = new this.registry[node.name].component({
            args,
            ref,
            transpiler
          });
        }
        this.interpreter.scope = new Scope(restoreScope, component);
        this.createSiblings(this.registry[node.name].nodes, element);
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
      const listenerScope = new Scope(this.interpreter.scope);
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
    }
    error(message) {
      throw new Error(`Runtime Error => ${message}`);
    }
  }
  function execute(source) {
    const parser = new TemplateParser();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
      return JSON.stringify(parser.errors);
    }
    const result = JSON.stringify(nodes);
    return result;
  }
  function transpile(source, entity, container) {
    const parser = new TemplateParser();
    const nodes = parser.parse(source);
    const transpiler = new Transpiler();
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
    const node = transpile(
      template.innerHTML,
      entity,
      container[0]
    );
    document.body.appendChild(node);
  }
  class KasperRenderer {
    constructor() {
      this.entity = void 0;
      this.changes = 1;
      this.dirty = false;
      this.render = () => {
        var _a;
        this.changes += 1;
        if (!this.entity) {
          return;
        }
        if (typeof ((_a = this.entity) == null ? void 0 : _a.$onChanges) === "function") {
          this.entity.$onChanges();
        }
        if (this.changes > 0 && !this.dirty) {
          this.dirty = true;
          queueMicrotask(() => {
            var _a2;
            render(this.entity);
            if (typeof ((_a2 = this.entity) == null ? void 0 : _a2.$onRender) === "function") {
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
  function Kasper(Component2) {
    const entity = new Component2();
    renderer.entity = entity;
    renderer.render();
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
    const parser = new TemplateParser();
    const root = document.querySelector(config.root || "body");
    const registry = normalizeRegistry(config.registry, parser);
    const transpiler = new Transpiler({ registry });
    const entryTag = config.entry || "kasper-app";
    const htmlNodes = createComponent(transpiler, entryTag, registry);
    root.appendChild(htmlNodes);
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
  if (typeof window !== "undefined") {
    (window || {}).kasper = {
      execute,
      transpile,
      App: KasperInit
    };
    window["Kasper"] = Kasper;
    window["Component"] = Component;
    window["$state"] = kasperState;
  }
  exports2.$state = kasperState;
  exports2.App = KasperInit;
  exports2.Component = Component;
  exports2.ExpressionParser = ExpressionParser;
  exports2.Interpreter = Interpreter;
  exports2.Kasper = Kasper;
  exports2.Scanner = Scanner;
  exports2.TemplateParser = TemplateParser;
  exports2.Transpiler = Transpiler;
  exports2.Viewer = Viewer;
  exports2.execute = execute;
  exports2.transpile = transpile;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3RyYW5zcGlsZXIudHMiLCIuLi9zcmMva2FzcGVyLnRzIiwiLi4vc3JjL3ZpZXdlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS05vZGUgfSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50QXJncyB7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcbiAgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbiAgJG9uSW5pdCA9ICgpID0+IHt9O1xuICAkb25SZW5kZXIgPSAoKSA9PiB7fTtcbiAgJG9uQ2hhbmdlcyA9ICgpID0+IHt9O1xuICAkb25EZXN0cm95ID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgJGRvUmVuZGVyKCkge1xuICAgIGlmICghdGhpcy50cmFuc3BpbGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdGhpcy50cmFuc3BpbGVyPy5jcmVhdGVDb21wb25lbnQodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgS2FzcGVyRW50aXR5ID0gQ29tcG9uZW50IHwgUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIENvbXBvbmVudENsYXNzID0geyBuZXcgKGFyZ3M/OiBDb21wb25lbnRBcmdzKTogQ29tcG9uZW50IH07XG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFJlZ2lzdHJ5IHtcbiAgW3RhZ05hbWU6IHN0cmluZ106IHtcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU6IEVsZW1lbnQ7XG4gICAgbm9kZXM6IEtOb2RlW107XG4gIH07XG59XG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3Ige1xuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEFzc2lnbik6IFI7XG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEJpbmFyeSk6IFI7XG4gICAgdmlzaXRDYWxsRXhwcihleHByOiBDYWxsKTogUjtcbiAgICB2aXNpdERlYnVnRXhwcihleHByOiBEZWJ1Zyk6IFI7XG4gICAgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBEaWN0aW9uYXJ5KTogUjtcbiAgICB2aXNpdEVhY2hFeHByKGV4cHI6IEVhY2gpOiBSO1xuICAgIHZpc2l0R2V0RXhwcihleHByOiBHZXQpOiBSO1xuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEdyb3VwaW5nKTogUjtcbiAgICB2aXNpdEtleUV4cHIoZXhwcjogS2V5KTogUjtcbiAgICB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IExvZ2ljYWwpOiBSO1xuICAgIHZpc2l0TGlzdEV4cHIoZXhwcjogTGlzdCk6IFI7XG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByOiBMaXRlcmFsKTogUjtcbiAgICB2aXNpdE5ld0V4cHIoZXhwcjogTmV3KTogUjtcbiAgICB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBOdWxsQ29hbGVzY2luZyk6IFI7XG4gICAgdmlzaXRQb3N0Zml4RXhwcihleHByOiBQb3N0Zml4KTogUjtcbiAgICB2aXNpdFNldEV4cHIoZXhwcjogU2V0KTogUjtcbiAgICB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBUZW1wbGF0ZSk6IFI7XG4gICAgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBUZXJuYXJ5KTogUjtcbiAgICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mKTogUjtcbiAgICB2aXNpdFVuYXJ5RXhwcihleHByOiBVbmFyeSk6IFI7XG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogVmFyaWFibGUpOiBSO1xuICAgIHZpc2l0Vm9pZEV4cHIoZXhwcjogVm9pZCk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFzc2lnbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Bc3NpZ24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQmluYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjYWxsZWU6IEV4cHI7XG4gICAgcHVibGljIHBhcmVuOiBUb2tlbjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FsbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5DYWxsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWJ1Z0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EZWJ1Zyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcHJvcGVydGllczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREaWN0aW9uYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRpY3Rpb25hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFYWNoIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBrZXk6IFRva2VuO1xuICAgIHB1YmxpYyBpdGVyYWJsZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBrZXk6IFRva2VuLCBpdGVyYWJsZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLml0ZXJhYmxlID0gaXRlcmFibGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWFjaEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5FYWNoJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdHlwZTogVG9rZW5UeXBlLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5HZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cGluZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R3JvdXBpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR3JvdXBpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLZXkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0S2V5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLktleSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2ljYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMb2dpY2FsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxvZ2ljYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpc3RFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGlzdCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXRlcmFsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmV3IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNsYXp6OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY2xheno6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsYXp6ID0gY2xheno7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmV3RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk5ldyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxDb2FsZXNjaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbENvYWxlc2NpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTnVsbENvYWxlc2NpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0Zml4IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBpbmNyZW1lbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBvc3RmaXhFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUG9zdGZpeCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVtcGxhdGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVtcGxhdGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXJuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogRXhwcjtcbiAgICBwdWJsaWMgdGhlbkV4cHI6IEV4cHI7XG4gICAgcHVibGljIGVsc2VFeHByOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBFeHByLCB0aGVuRXhwcjogRXhwciwgZWxzZUV4cHI6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuRXhwciA9IHRoZW5FeHByO1xuICAgICAgICB0aGlzLmVsc2VFeHByID0gZWxzZUV4cHI7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVybmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZXJuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHlwZW9mIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHlwZW9mRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlR5cGVvZic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJpYWJsZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5WYXJpYWJsZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZvaWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWb2lkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZvaWQnO1xuICB9XG59XG5cbiIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgLy8gUGFyc2VyIFRva2Vuc1xyXG4gIEVvZixcclxuICBQYW5pYyxcclxuXHJcbiAgLy8gU2luZ2xlIENoYXJhY3RlciBUb2tlbnNcclxuICBBbXBlcnNhbmQsXHJcbiAgQXRTaWduLFxyXG4gIENhcmV0LFxyXG4gIENvbW1hLFxyXG4gIERvbGxhcixcclxuICBEb3QsXHJcbiAgSGFzaCxcclxuICBMZWZ0QnJhY2UsXHJcbiAgTGVmdEJyYWNrZXQsXHJcbiAgTGVmdFBhcmVuLFxyXG4gIFBlcmNlbnQsXHJcbiAgUGlwZSxcclxuICBSaWdodEJyYWNlLFxyXG4gIFJpZ2h0QnJhY2tldCxcclxuICBSaWdodFBhcmVuLFxyXG4gIFNlbWljb2xvbixcclxuICBTbGFzaCxcclxuICBTdGFyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnNcclxuICBBcnJvdyxcclxuICBCYW5nLFxyXG4gIEJhbmdFcXVhbCxcclxuICBDb2xvbixcclxuICBFcXVhbCxcclxuICBFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBEZWJ1ZyxcclxuICBGYWxzZSxcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBWb2lkLFxyXG4gIFdpdGgsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbiB7XHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xyXG4gIHB1YmxpYyBsaXRlcmFsOiBhbnk7XHJcbiAgcHVibGljIGxleGVtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHR5cGU6IFRva2VuVHlwZSxcclxuICAgIGxleGVtZTogc3RyaW5nLFxyXG4gICAgbGl0ZXJhbDogYW55LFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sOiBudW1iZXJcclxuICApIHtcclxuICAgIHRoaXMubmFtZSA9IFRva2VuVHlwZVt0eXBlXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxleGVtZSA9IGxleGVtZTtcclxuICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gYFsoJHt0aGlzLmxpbmV9KTpcIiR7dGhpcy5sZXhlbWV9XCJdYDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblBhcnNlciB7XG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICBwcml2YXRlIHRva2VuczogVG9rZW5bXTtcbiAgcHVibGljIGVycm9yczogc3RyaW5nW107XG4gIHB1YmxpYyBlcnJvckxldmVsID0gMTtcblxuICBwdWJsaWMgcGFyc2UodG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgUGFyc2UgRXJyb3IgKCR7ZS5saW5lfToke2UuY29sfSkgPT4gJHtlLnZhbHVlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiUGFyc2UgRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3luY2hyb25pemUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi50eXBlczogVG9rZW5UeXBlW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50XTtcbiAgfVxuXG4gIHByaXZhdGUgcHJldmlvdXMoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT09IHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVjayhUb2tlblR5cGUuRW9mKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3VtZSh0eXBlOiBUb2tlblR5cGUsIG1lc3NhZ2U6IHN0cmluZyk6IFRva2VuIHtcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVycm9yKFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICBtZXNzYWdlICsgYCwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKHRva2VuOiBUb2tlbiwgbWVzc2FnZTogc3RyaW5nKTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IobWVzc2FnZSwgdG9rZW4ubGluZSwgdG9rZW4uY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgc3luY2hyb25pemUoKTogdm9pZCB7XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLlNlbWljb2xvbikgfHwgdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdGVkIGFuIGlkZW50aWZpZXIgaW5zaWRlIFwiZWFjaFwiIHN0YXRlbWVudGBcbiAgICApO1xuXG4gICAgbGV0IGtleTogVG9rZW4gPSBudWxsO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5XaXRoKSkge1xuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxuICAgICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgICAgYEV4cGVjdGVkIGEgXCJrZXlcIiBpZGVudGlmaWVyIGFmdGVyIFwid2l0aFwiIGtleXdvcmQgaW4gZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5PZixcbiAgICAgIGBFeHBlY3RlZCBcIm9mXCIga2V5d29yZCBpbnNpZGUgZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgKTtcbiAgICBjb25zdCBpdGVyYWJsZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHJlc3Npb246IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7XG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7fVxuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWdubWVudCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TdGFyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBsZXQgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XG4gICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5HZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCBleHByLnR5cGUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlNldChleHByLmVudGl0eSwgZXhwci5rZXksIHZhbHVlLCBleHByLmxpbmUpO1xuICAgICAgfVxuICAgICAgdGhpcy5lcnJvcihvcGVyYXRvciwgYEludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuYCk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXJuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCB0aGVuRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcbiAgICAgIGNvbnN0IGVsc2VFeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZXJuYXJ5KGV4cHIsIHRoZW5FeHByLCBlbHNlRXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG51bGxDb2FsZXNjaW5nKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubG9naWNhbE9yKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCByaWdodEV4cHI6IEV4cHIuRXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OdWxsQ29hbGVzY2luZyhleHByLCByaWdodEV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsT3IoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsQW5kKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkFuZCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRpdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXMsIFRva2VuVHlwZS5QbHVzKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbW9kdWx1cygpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBlcmNlbnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlwbGljYXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2xhc2gsIFRva2VuVHlwZS5TdGFyKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0eXBlb2YoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHlwZW9mKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVHlwZW9mKHZhbHVlLCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudW5hcnkoKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuTWludXMsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nLFxuICAgICAgICBUb2tlblR5cGUuRG9sbGFyLFxuICAgICAgICBUb2tlblR5cGUuUGx1c1BsdXMsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy51bmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlVuYXJ5KG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld0tleXdvcmQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV3S2V5d29yZCgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OZXcpKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgY29uc3RydWN0OiBFeHByLkV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LCBrZXl3b3JkLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jYWxsKCk7XG4gIH1cblxuICBwcml2YXRlIGNhbGwoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5wcmltYXJ5KCk7XG4gICAgbGV0IGNvbnN1bWVkID0gdHJ1ZTtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY29uc3QgYXJnczogRXhwci5FeHByW10gPSBbXTtcbiAgICAgICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBwYXJlbjogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgICAgICBUb2tlblR5cGUuUmlnaHRQYXJlbixcbiAgICAgICAgICAgIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgXG4gICAgICAgICAgKTtcbiAgICAgICAgICBleHByID0gbmV3IEV4cHIuQ2FsbChleHByLCBwYXJlbiwgYXJncywgcGFyZW4ubGluZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCB0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjb25zdW1lZCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbmFtZTogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXG4gICAgKTtcbiAgICBjb25zdCBrZXk6IEV4cHIuS2V5ID0gbmV3IEV4cHIuS2V5KG5hbWUsIG5hbWUubGluZSk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGxldCBrZXk6IEV4cHIuRXhwciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIGtleSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYW4gaW5kZXhgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgb3BlcmF0b3IubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHByaW1hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh1bmRlZmluZWQsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlbXBsYXRlKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoaWRlbnRpZmllciwgMSwgaWRlbnRpZmllci5saW5lKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChpZGVudGlmaWVyLCAtMSwgaWRlbnRpZmllci5saW5lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZShpZGVudGlmaWVyLCBpZGVudGlmaWVyLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZvaWQoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRGVidWcpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgYEV4cGVjdGVkIGV4cHJlc3Npb24sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke3RoaXMucGVlaygpLmxleGVtZX1cImBcbiAgICApO1xuICAgIC8vIHVucmVhY2hlYWJsZSBjb2RlXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgMCk7XG4gIH1cblxuICBwdWJsaWMgZGljdGlvbmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcsIFRva2VuVHlwZS5JZGVudGlmaWVyLCBUb2tlblR5cGUuTnVtYmVyKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db2xvbikpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEV4cHIuVmFyaWFibGUoa2V5LCBrZXkubGluZSk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgdGhpcy5wZWVrKCksXG4gICAgICAgICAgYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7XG4gICAgICAgICAgICB0aGlzLnBlZWsoKS5sZXhlbWVcbiAgICAgICAgICB9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KHByb3BlcnRpZXMsIGxlZnRCcmFjZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcbiAgICBjb25zdCBsZWZ0QnJhY2tldCA9IHRoaXMucHJldmlvdXMoKTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGlzdChbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBkbyB7XG4gICAgICB2YWx1ZXMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5SaWdodEJyYWNrZXQsXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuTGlzdCh2YWx1ZXMsIGxlZnRCcmFja2V0LmxpbmUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIikgfHwgY2hhciA9PT0gXCIkXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDoga2V5b2YgdHlwZW9mIFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW5UeXBlW3dvcmRdID49IFRva2VuVHlwZS5BbmQ7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XG4gIC8qKiBMaXN0IG9mIGVycm9ycyBmcm9tIHNjYW5uaW5nICovXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xuICAgICAgdGhpcy5saW5lKys7XG4gICAgICB0aGlzLmNvbCA9IDA7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHRoaXMuY29sKys7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpICE9PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWtOZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcignVW50ZXJtaW5hdGVkIGNvbW1lbnQsIGV4cGVjdGluZyBjbG9zaW5nIFwiKi9cIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgY2xvc2luZyBzbGFzaCAnKi8nXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKHF1b3RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IHF1b3RlICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBVbnRlcm1pbmF0ZWQgc3RyaW5nLlxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKGBVbnRlcm1pbmF0ZWQgc3RyaW5nLCBleHBlY3RpbmcgY2xvc2luZyAke3F1b3RlfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxuICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICB0aGlzLmFkZFRva2VuKHF1b3RlICE9PSBcImBcIiA/IFRva2VuVHlwZS5TdHJpbmcgOiBUb2tlblR5cGUuVGVtcGxhdGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbnVtYmVyKCk6IHZvaWQge1xuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGZyYWN0aW9uXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcbiAgICB3aGlsZSAoVXRpbHMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcbiAgICBpZiAoVXRpbHMuaXNLZXl3b3JkKGNhcGl0YWxpemVkKSkge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGVbY2FwaXRhbGl6ZWRdLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLklkZW50aWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIltcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJdXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIntcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjtcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSGFzaCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5Db2xvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TdGFyRXF1YWwgOiBUb2tlblR5cGUuU3RhcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5QZXJjZW50RXF1YWwgOiBUb2tlblR5cGUuUGVyY2VudCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbih0aGlzLm1hdGNoKFwifFwiKSA/IFRva2VuVHlwZS5PciA6IFRva2VuVHlwZS5QaXBlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCImXCIpID8gVG9rZW5UeXBlLkFuZCA6IFRva2VuVHlwZS5BbXBlcnNhbmQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuR3JlYXRlckVxdWFsIDogVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQmFuZ0VxdWFsIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWwgOiBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNQbHVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlBsdXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIi1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXG4gICAgICAgICAgICAgID8gVG9rZW5UeXBlLkxlc3NFcXVhbEdyZWF0ZXJcbiAgICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiL1wiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi9cIikpIHtcbiAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xuICAgICAgICAgIHRoaXMubXVsdGlsaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TbGFzaEVxdWFsIDogVG9rZW5UeXBlLlNsYXNoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGAnYDpcbiAgICAgIGNhc2UgYFwiYDpcbiAgICAgIGNhc2UgXCJgXCI6XG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGlnbm9yZSBjYXNlc1xuICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgIGNhc2UgXCJcXHJcIjpcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjb21wbGV4IGNhc2VzXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdChjaGFyKSkge1xuICAgICAgICAgIHRoaXMubnVtYmVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xuICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2NoYXJ9J2ApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBTY2FuIEVycm9yICgke3RoaXMubGluZX06JHt0aGlzLmNvbH0pID0+ICR7bWVzc2FnZX1gKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgcHVibGljIHZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgcHVibGljIHBhcmVudDogU2NvcGU7XG5cbiAgY29uc3RydWN0b3IocGFyZW50PzogU2NvcGUsIGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlc1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXNba2V5XTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvd1trZXkgYXMga2V5b2YgdHlwZW9mIHdpbmRvd107XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIGFzIFBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJwcmV0ZXIgaW1wbGVtZW50cyBFeHByLkV4cHJWaXNpdG9yPGFueT4ge1xuICBwdWJsaWMgc2NvcGUgPSBuZXcgU2NvcGUoKTtcbiAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG5cbiAgcHVibGljIGV2YWx1YXRlKGV4cHI6IEV4cHIuRXhwcik6IGFueSB7XG4gICAgcmV0dXJuIChleHByLnJlc3VsdCA9IGV4cHIuYWNjZXB0KHRoaXMpKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IEV4cHIuVmFyaWFibGUpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnNjb3BlLmdldChleHByLm5hbWUubGV4ZW1lKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFzc2lnbkV4cHIoZXhwcjogRXhwci5Bc3NpZ24pOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0S2V5RXhwcihleHByOiBFeHByLktleSk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIubmFtZS5saXRlcmFsO1xuICB9XG5cbiAgcHVibGljIHZpc2l0R2V0RXhwcihleHByOiBFeHByLkdldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgaWYgKCFlbnRpdHkgJiYgZXhwci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHlba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNldEV4cHIoZXhwcjogRXhwci5TZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBlbnRpdHlba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IEV4cHIuUG9zdGZpeCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNjb3BlLmdldChleHByLm5hbWUubGV4ZW1lKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlICsgZXhwci5pbmNyZW1lbnQ7XG4gICAgdGhpcy5zY29wZS5zZXQoZXhwci5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpc3RFeHByKGV4cHI6IEV4cHIuTGlzdCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWVzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByLnZhbHVlKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbik7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBwcml2YXRlIHRlbXBsYXRlUGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuICAgIGlmICh0aGlzLnBhcnNlci5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmVycm9yKGBUZW1wbGF0ZSBzdHJpbmcgIGVycm9yOiAke3RoaXMucGFyc2VyLmVycm9yc1swXX1gKTtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gcmlnaHQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKFwiVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgXCIgKyBleHByLm9wZXJhdG9yKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogRXhwci5Mb2dpY2FsKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLk9yKSB7XG4gICAgICBpZiAobGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogRXhwci5UZXJuYXJ5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmNvbmRpdGlvbikuaXNUcnV0aHkoKVxuICAgICAgPyB0aGlzLmV2YWx1YXRlKGV4cHIudGhlbkV4cHIpXG4gICAgICA6IHRoaXMuZXZhbHVhdGUoZXhwci5lbHNlRXhwcik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogRXhwci5OdWxsQ29hbGVzY2luZyk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBpZiAoIWxlZnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBFeHByLkdyb3VwaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogRXhwci5MaXRlcmFsKTogYW55IHtcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFVuYXJ5RXhwcihleHByOiBFeHByLlVuYXJ5KTogYW55IHtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgICByZXR1cm4gLXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZzpcbiAgICAgICAgcmV0dXJuICFyaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNQbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNNaW51czpcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogICR7ZXhwci5yaWdodH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICcgKyBleHByLm9wZXJhdG9yYCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoYCR7Y2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmApO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb25cbiAgICBpZiAoXG4gICAgICBleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0ICYmXG4gICAgICAoZXhwci5jYWxsZWUuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSB8fFxuICAgICAgICBleHByLmNhbGxlZS5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdyb3VwaW5nKVxuICAgICkge1xuICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXROZXdFeHByKGV4cHI6IEV4cHIuTmV3KTogYW55IHtcbiAgICBjb25zdCBuZXdDYWxsID0gZXhwci5jbGF6eiBhcyBFeHByLkNhbGw7XG4gICAgLy8gaW50ZXJuYWwgY2xhc3MgZGVmaW5pdGlvbiBpbnN0YW5jZVxuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShuZXdDYWxsLmNhbGxlZSk7XG5cbiAgICBpZiAodHlwZW9mIGNsYXp6ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgIGAnJHtjbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgbmV3Q2FsbC5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VHlwZW9mRXhwcihleHByOiBFeHByLlR5cGVvZik6IGFueSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWFjaEV4cHIoZXhwcjogRXhwci5FYWNoKTogYW55IHtcbiAgICByZXR1cm4gW1xuICAgICAgZXhwci5uYW1lLmxleGVtZSxcbiAgICAgIGV4cHIua2V5ID8gZXhwci5rZXkubGV4ZW1lIDogbnVsbCxcbiAgICAgIHRoaXMuZXZhbHVhdGUoZXhwci5pdGVyYWJsZSksXG4gICAgXTtcbiAgfVxuXG4gIHZpc2l0Vm9pZEV4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXTtcbiAgcHVibGljIG5vZGVzOiBOb2RlLktOb2RlW107XG5cbiAgcHVibGljIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgUGFyc2UgRXJyb3IgKCR7ZS5saW5lfToke2UuY29sfSkgPT4gJHtlLnZhbHVlfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcbiAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29sICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHtlb2ZFcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZyhcIidcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoJ1wiJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPFwiKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlLlRleHQodGV4dCwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIElmRWxzZU5vZGUgPSBbS05vZGUuRWxlbWVudCwgS05vZGUuQXR0cmlidXRlXTtcblxuZXhwb3J0IGNsYXNzIFRyYW5zcGlsZXIgaW1wbGVtZW50cyBLTm9kZS5LTm9kZVZpc2l0b3I8dm9pZD4ge1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBFeHByZXNzaW9uUGFyc2VyKCk7XG4gIHByaXZhdGUgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIoKTtcbiAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5yZWdpc3RyeSkge1xuICAgICAgdGhpcy5yZWdpc3RyeSA9IG9wdGlvbnMucmVnaXN0cnk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwaWxlKFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVudGl0eTogb2JqZWN0LFxuICAgIGNvbnRhaW5lcjogRWxlbWVudFxuICApOiBOb2RlIHtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLmluaXQoZW50aXR5KTtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXh0S05vZGUobm9kZTogS05vZGUuVGV4dCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvbnRlbnQpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIGF0dHIudmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZmluZEF0dHIoXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcbiAgICBuYW1lOiBzdHJpbmdbXVxuICApOiBLTm9kZS5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuYXR0cmlidXRlcyB8fCAhbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmliID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+XG4gICAgICBuYW1lLmluY2x1ZGVzKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZSlcbiAgICApO1xuICAgIGlmIChhdHRyaWIpIHtcbiAgICAgIHJldHVybiBhdHRyaWIgYXMgS05vZGUuQXR0cmlidXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9JZihleHByZXNzaW9uczogSWZFbHNlTm9kZVtdLCBwYXJlbnQ6IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCAkaWYgPSB0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25zWzBdWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgIGlmICgkaWYpIHtcbiAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uc1swXVswXSwgcGFyZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMuc2xpY2UoMSwgZXhwcmVzc2lvbnMubGVuZ3RoKSkge1xuICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZWlmXCJdKSkge1xuICAgICAgICBjb25zdCAkZWxzZWlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICBpZiAoJGVsc2VpZikge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBwYXJlbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZVwiXSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIHBhcmVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKChlYWNoIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgIGNvbnN0IFtuYW1lLCBrZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICApO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICBjb25zdCBzY29wZTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHNjb3BlW2tleV0gPSBpbmRleDtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGUpO1xuICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gICAgICBpbmRleCArPSAxO1xuICAgIH1cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgfVxuXG4gIHByaXZhdGUgZG9XaGlsZSgkd2hpbGU6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICB3aGlsZSAodGhpcy5leGVjdXRlKCR3aGlsZS52YWx1ZSkpIHtcbiAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgfVxuXG4gIC8vIGV4ZWN1dGVzIGluaXRpYWxpemF0aW9uIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gIHByaXZhdGUgZG9MZXQoaW5pdDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGVhY2hcIl0pO1xuICAgICAgICBpZiAoJGVhY2gpIHtcbiAgICAgICAgICB0aGlzLmRvRWFjaCgkZWFjaCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGlmID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBpZlwiXSk7XG4gICAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tub2RlIGFzIEtOb2RlLkVsZW1lbnQsICRpZl1dO1xuICAgICAgICAgIGNvbnN0IHRhZyA9IChub2RlIGFzIEtOb2RlLkVsZW1lbnQpLm5hbWU7XG4gICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgIHdoaWxlIChmb3VuZCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPj0gbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgW1xuICAgICAgICAgICAgICBcIkBlbHNlXCIsXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAoKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQpLm5hbWUgPT09IHRhZyAmJiBhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkd2hpbGUgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQHdoaWxlXCJdKTtcbiAgICAgICAgaWYgKCR3aGlsZSkge1xuICAgICAgICAgIHRoaXMuZG9XaGlsZSgkd2hpbGUsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgdGhpcy5kb0xldCgkbGV0LCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1lbnQobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgY29uc3QgaXNDb21wb25lbnQgPSAhIXRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXTtcbiAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IHt9O1xuICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICApO1xuICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG4gICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5jb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgcmVmID0gZWxlbWVudDtcbiAgICAgICAgY29uc3QgdHJhbnNwaWxlciA9IHRoaXM7XG4gICAgICAgIGNvbXBvbmVudCA9IG5ldyB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0uY29tcG9uZW50KHtcbiAgICAgICAgICBhcmdzLFxuICAgICAgICAgIHJlZixcbiAgICAgICAgICB0cmFuc3BpbGVyLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZHJlbiBvZiB0aGUgY29tcG9uZW50XG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5ub2RlcywgZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZXNcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKVxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG5cbiAgICBpZiAoIWlzVm9pZCAmJiBwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgdHlwZSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV07XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICB0aGlzLmV4ZWN1dGUoYXR0ci52YWx1ZSwgbGlzdGVuZXJTY29wZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlVGVtcGxhdGVTdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb25zdCByZWdleCA9IC9cXHtcXHsuK1xcfVxcfS9tcztcbiAgICBpZiAocmVnZXgudGVzdCh0ZXh0KSkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24ocGxhY2Vob2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24oc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgaWYgKHRoaXMucGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFRlbXBsYXRlIHN0cmluZyAgZXJyb3I6ICR7dGhpcy5wYXJzZXIuZXJyb3JzWzBdfWApO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBpZiAocGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFyc2VyLmVycm9ycyk7XG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnRcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKCk7XG4gIGNvbnN0IHJlc3VsdCA9IHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBlbnRpdHksIGNvbnRhaW5lcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZW50aXR5OiBhbnkpOiB2b2lkIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwia2FzcGVyIHJlcXVpcmVzIGEgYnJvd3NlciBlbnZpcm9ubWVudCB0byByZW5kZXIgdGVtcGxhdGVzLlwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRlbXBsYXRlXCIpWzBdO1xuICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgY29uc29sZS5lcnJvcihcIk5vIHRlbXBsYXRlIGZvdW5kIGluIHRoZSBkb2N1bWVudC5cIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJrYXNwZXItYXBwXCIpO1xuICBjb25zdCBub2RlID0gdHJhbnNwaWxlKFxuICAgIHRlbXBsYXRlLmlubmVySFRNTCxcbiAgICBlbnRpdHksXG4gICAgY29udGFpbmVyWzBdIGFzIEhUTUxFbGVtZW50XG4gICk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBLYXNwZXJSZW5kZXJlciB7XG4gIGVudGl0eT86IENvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgY2hhbmdlcyA9IDE7XG4gIGRpcnR5ID0gZmFsc2U7XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIHRoaXMuY2hhbmdlcyArPSAxO1xuICAgIGlmICghdGhpcy5lbnRpdHkpIHtcbiAgICAgIC8vIGRvIG5vdCByZW5kZXIgaWYgZW50aXR5IGlzIG5vdCBzZXRcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLmVudGl0eT8uJG9uQ2hhbmdlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVudGl0eS4kb25DaGFuZ2VzKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoYW5nZXMgPiAwICYmICF0aGlzLmRpcnR5KSB7XG4gICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgcmVuZGVyKHRoaXMuZW50aXR5KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jaGFuZ2VzKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmVudGl0eT8uJG9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB0aGlzLmVudGl0eS4kb25SZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2hhbmdlcyA9IDA7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmxldCByZW5kZXJlciA9IG5ldyBLYXNwZXJSZW5kZXJlcigpO1xuXG5leHBvcnQgY2xhc3MgS2FzcGVyU3RhdGUge1xuICBfdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGluaXRpYWw7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgcmVuZGVyZXIucmVuZGVyKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24ga2FzcGVyU3RhdGUoaW5pdGlhbDogYW55KTogS2FzcGVyU3RhdGUge1xuICByZXR1cm4gbmV3IEthc3BlclN0YXRlKGluaXRpYWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVyKENvbXBvbmVudDogYW55KSB7XG4gIGNvbnN0IGVudGl0eSA9IG5ldyBDb21wb25lbnQoKTtcbiAgcmVuZGVyZXIuZW50aXR5ID0gZW50aXR5O1xuICByZW5kZXJlci5yZW5kZXIoKTtcbiAgLy8gZW50aXR5LiRkb1JlbmRlcigpO1xuICBpZiAodHlwZW9mIGVudGl0eS4kb25Jbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBlbnRpdHkuJG9uSW5pdCgpO1xuICB9XG59XG5cbmludGVyZmFjZSBBcHBDb25maWcge1xuICByb290Pzogc3RyaW5nO1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoXG4gIHRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsXG4gIHRhZzogc3RyaW5nLFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnlcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVnaXN0cnlbdGFnXS5jb21wb25lbnQoKTtcbiAgY29tcG9uZW50LiRvbkluaXQoKTtcbiAgY29uc3Qgbm9kZXMgPSByZWdpc3RyeVt0YWddLm5vZGVzO1xuICByZXR1cm4gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGNvbXBvbmVudCwgZWxlbWVudCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlZ2lzdHJ5KFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnksXG4gIHBhcnNlcjogVGVtcGxhdGVQYXJzZXJcbikge1xuICBjb25zdCByZXN1bHQgPSB7IC4uLnJlZ2lzdHJ5IH07XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJlZ2lzdHJ5KSkge1xuICAgIGNvbnN0IGVudHJ5ID0gcmVnaXN0cnlba2V5XTtcbiAgICBlbnRyeS50ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZW50cnkuc2VsZWN0b3IpO1xuICAgIGVudHJ5Lm5vZGVzID0gcGFyc2VyLnBhcnNlKGVudHJ5LnRlbXBsYXRlLmlubmVySFRNTCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEthc3BlckluaXQoY29uZmlnOiBBcHBDb25maWcpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290IHx8IFwiYm9keVwiKTtcbiAgY29uc3QgcmVnaXN0cnkgPSBub3JtYWxpemVSZWdpc3RyeShjb25maWcucmVnaXN0cnksIHBhcnNlcik7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5IH0pO1xuICBjb25zdCBlbnRyeVRhZyA9IGNvbmZpZy5lbnRyeSB8fCBcImthc3Blci1hcHBcIjtcbiAgY29uc3QgaHRtbE5vZGVzID0gY3JlYXRlQ29tcG9uZW50KHRyYW5zcGlsZXIsIGVudHJ5VGFnLCByZWdpc3RyeSk7XG5cbiAgcm9vdC5hcHBlbmRDaGlsZChodG1sTm9kZXMpO1xufVxuIiwiaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWV3ZXIgaW1wbGVtZW50cyBLTm9kZS5LTm9kZVZpc2l0b3I8c3RyaW5nPiB7XHJcbiAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbm9kZS5hY2NlcHQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdHJhbnNwaWxlKG5vZGVzOiBLTm9kZS5LTm9kZVtdKTogc3RyaW5nW10ge1xyXG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5ldmFsdWF0ZShub2RlKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGAke2V9YCk7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xyXG4gICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAxMDApIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQpOiBzdHJpbmcge1xyXG4gICAgbGV0IGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzLm1hcCgoYXR0cikgPT4gdGhpcy5ldmFsdWF0ZShhdHRyKSkuam9pbihcIiBcIik7XHJcbiAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XHJcbiAgICAgIGF0dHJzID0gXCIgXCIgKyBhdHRycztcclxuICAgIH1cclxuXHJcbiAgICBpZiAobm9kZS5zZWxmKSB7XHJcbiAgICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9Lz5gO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbi5tYXAoKGVsbSkgPT4gdGhpcy5ldmFsdWF0ZShlbG0pKS5qb2luKFwiXCIpO1xyXG4gICAgcmV0dXJuIGA8JHtub2RlLm5hbWV9JHthdHRyc30+JHtjaGlsZHJlbn08LyR7bm9kZS5uYW1lfT5gO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlKTogc3RyaW5nIHtcclxuICAgIGlmIChub2RlLnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBgJHtub2RlLm5hbWV9PVwiJHtub2RlLnZhbHVlfVwiYDtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLm5hbWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRUZXh0S05vZGUobm9kZTogS05vZGUuVGV4dCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbm9kZS52YWx1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCEtLSAke25vZGUudmFsdWV9IC0tPmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhZG9jdHlwZSAke25vZGUudmFsdWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgZXhlY3V0ZSwgdHJhbnNwaWxlLCBLYXNwZXIsIGthc3BlclN0YXRlLCBLYXNwZXJJbml0IH0gZnJvbSBcIi4va2FzcGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBWaWV3ZXIgfSBmcm9tIFwiLi92aWV3ZXJcIjtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgKCh3aW5kb3cgYXMgYW55KSB8fCB7fSkua2FzcGVyID0ge1xuICAgIGV4ZWN1dGUsXG4gICAgdHJhbnNwaWxlLFxuICAgIEFwcDogS2FzcGVySW5pdCxcbiAgfTtcbiAgKHdpbmRvdyBhcyBhbnkpW1wiS2FzcGVyXCJdID0gS2FzcGVyO1xuICAod2luZG93IGFzIGFueSlbXCJDb21wb25lbnRcIl0gPSBDb21wb25lbnQ7XG4gICh3aW5kb3cgYXMgYW55KVtcIiRzdGF0ZVwiXSA9IGthc3BlclN0YXRlO1xufVxuXG5leHBvcnQgeyBFeHByZXNzaW9uUGFyc2VyLCBJbnRlcnByZXRlciwgU2Nhbm5lciwgVGVtcGxhdGVQYXJzZXIsIFRyYW5zcGlsZXIsIFZpZXdlciB9O1xuZXhwb3J0IHsgZXhlY3V0ZSwgdHJhbnNwaWxlLCBLYXNwZXIsIGthc3BlclN0YXRlIGFzICRzdGF0ZSwgS2FzcGVySW5pdCBhcyBBcHAsIENvbXBvbmVudCB9O1xuIl0sIm5hbWVzIjpbIlRva2VuVHlwZSIsIkV4cHIuRWFjaCIsIkV4cHIuVmFyaWFibGUiLCJFeHByLkJpbmFyeSIsIkV4cHIuQXNzaWduIiwiRXhwci5HZXQiLCJFeHByLlNldCIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLk5ldyIsIkV4cHIuQ2FsbCIsIkV4cHIuS2V5IiwiRXhwci5MaXRlcmFsIiwiRXhwci5UZW1wbGF0ZSIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuR3JvdXBpbmciLCJFeHByLlZvaWQiLCJFeHByLkRlYnVnIiwiRXhwci5EaWN0aW9uYXJ5IiwiRXhwci5MaXN0IiwiVXRpbHMuaXNEaWdpdCIsIlV0aWxzLmlzQWxwaGFOdW1lcmljIiwiVXRpbHMuY2FwaXRhbGl6ZSIsIlV0aWxzLmlzS2V5d29yZCIsIlV0aWxzLmlzQWxwaGEiLCJQYXJzZXIiLCJzZWxmIiwiTm9kZS5Db21tZW50IiwiTm9kZS5Eb2N0eXBlIiwiTm9kZS5FbGVtZW50IiwiTm9kZS5BdHRyaWJ1dGUiLCJOb2RlLlRleHQiLCJfYSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7OztFQVNPLE1BQU0sVUFBVTtBQUFB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QUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGVBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxlQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsS0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLElBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGVBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxlQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsZUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBeEVVLFdBQUFBO0FBQUFBLEVBQUEsR0FBQSxhQUFBLENBQUEsQ0FB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LEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxjQUFjLElBQUk7QUFDMUM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxXQUFXLElBQUk7QUFDdkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxZQUFZLElBQUk7QUFDeEM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxPQUFPLElBQUk7QUFDbkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxXQUFXLElBQUk7QUFDdkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxPQUFPLElBQUk7QUFDbkM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsVUFBVSxNQUFNLElBQUk7QUFDbEM7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsUUFBUSxVQUFVO0FBQUEsWUFDOUM7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsWUFBWSxVQUFVO0FBQUEsWUFDbEQ7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsZUFBZSxVQUFVO0FBQUEsWUFDckQ7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLLFNBQVMsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEtBQUssVUFBVSxNQUFNLElBQUk7QUFDbkU7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsTUFBTSxVQUFVO0FBQUEsWUFDNUM7QUFBQSxVQUFBO0FBRUY7QUFBQSxRQUNGLEtBQUs7QUFDSCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsZUFBZSxVQUFVO0FBQUEsWUFDckQ7QUFBQSxV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
