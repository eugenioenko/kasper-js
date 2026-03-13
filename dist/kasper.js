class Component {
  constructor(props) {
    this.args = {};
    this.$abortController = new AbortController();
    this.$watchStops = [];
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
  haunt(sig, fn) {
    this.$watchStops.push(sig.onChange(fn));
  }
  onInit() {
  }
  onRender() {
  }
  onChanges() {
  }
  onDestroy() {
  }
  render() {
    var _a;
    (_a = this.$render) == null ? void 0 : _a.call(this);
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
let Set$1 = class Set2 extends Expr {
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
    var _a, _b;
    if (typeof this.values[key] !== "undefined") {
      return this.values[key];
    }
    if (this.parent !== null) {
      return this.parent.get(key);
    }
    const $imports = (_b = (_a = this.values) == null ? void 0 : _a.constructor) == null ? void 0 : _b.$imports;
    if ($imports && typeof $imports[key] !== "undefined") {
      return $imports[key];
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
  constructor(name, attributes, children, self, line = 0) {
    super();
    this.type = "element";
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
let Comment$1 = class Comment2 extends KNode {
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
function navigate(path) {
  history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
function matchPath(pattern, pathname) {
  if (pattern === "*") return {};
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
class Router extends Component {
  constructor() {
    super(...arguments);
    this.routes = [];
  }
  setRoutes(routes) {
    this.routes = routes;
  }
  onInit() {
    window.addEventListener("popstate", () => this._navigate(), {
      signal: this.$abortController.signal
    });
    this._navigate();
  }
  async _navigate() {
    const pathname = window.location.pathname;
    for (const route of this.routes) {
      const params = matchPath(route.path, pathname);
      if (params === null) continue;
      if (route.guard) {
        const allowed = await route.guard();
        if (!allowed) return;
      }
      this._mount(route.component, params);
      return;
    }
  }
  _mount(ComponentClass2, params) {
    const element = this.ref;
    if (!element || !this.transpiler) return;
    this.transpiler.mountComponent(ComponentClass2, element, params);
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
    this.registry["router"] = { component: Router, nodes: [] };
    if (!options) return;
    if (options.registry) {
      this.registry = { ...this.registry, ...options.registry };
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
        const nameAttr = this.findAttr(node, ["@name"]);
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
            const slotAttr = this.findAttr(child, ["@slot"]);
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
          const componentNodes = this.registry[node.name].nodes;
          component.$render = () => {
            this.destroy(element);
            element.innerHTML = "";
            const scope = new Scope(restoreScope, component);
            scope.set("$instance", component);
            component.$slots = slots;
            const prevScope = this.interpreter.scope;
            this.interpreter.scope = scope;
            this.createSiblings(componentNodes, element);
            this.interpreter.scope = prevScope;
            if (typeof component.onRender === "function") component.onRender();
          };
          if (node.name === "router" && component instanceof Router) {
            component.setRoutes(this.extractRoutes(node.children));
          }
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
      if (instance.$watchStops) instance.$watchStops.forEach((stop) => stop());
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
  mountComponent(ComponentClass2, container, params = {}) {
    this.destroy(container);
    container.innerHTML = "";
    const template = ComponentClass2.template;
    if (!template) return;
    const nodes = new TemplateParser().parse(template);
    const host = document.createElement("div");
    container.appendChild(host);
    const component = new ComponentClass2({ args: { params }, ref: host, transpiler: this });
    this.bindMethods(component);
    host.$kasperInstance = component;
    const componentNodes = nodes;
    component.$render = () => {
      this.destroy(host);
      host.innerHTML = "";
      const scope2 = new Scope(null, component);
      scope2.set("$instance", component);
      const prev2 = this.interpreter.scope;
      this.interpreter.scope = scope2;
      this.createSiblings(componentNodes, host);
      this.interpreter.scope = prev2;
      if (typeof component.onRender === "function") component.onRender();
    };
    if (typeof component.onInit === "function") component.onInit();
    const scope = new Scope(null, component);
    scope.set("$instance", component);
    const prev = this.interpreter.scope;
    this.interpreter.scope = scope;
    this.createSiblings(nodes, host);
    this.interpreter.scope = prev;
    if (typeof component.onRender === "function") component.onRender();
  }
  extractRoutes(children, parentGuard) {
    const routes = [];
    for (const child of children) {
      if (child.type !== "element") continue;
      const el = child;
      if (el.name === "route") {
        const pathAttr = this.findAttr(el, ["@path"]);
        const componentAttr = this.findAttr(el, ["@component"]);
        const guardAttr = this.findAttr(el, ["@guard"]);
        if (!pathAttr || !componentAttr) continue;
        const path = pathAttr.value;
        const component = this.execute(componentAttr.value);
        const guard = guardAttr ? this.execute(guardAttr.value) : parentGuard;
        routes.push({ path, component, guard });
      }
      if (el.name === "guard") {
        const checkAttr = this.findAttr(el, ["@check"]);
        if (!checkAttr) continue;
        const check = this.execute(checkAttr.value);
        routes.push(...this.extractRoutes(el.children, check));
      }
    }
    return routes;
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
        template: null
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
    if (!entry.nodes) entry.nodes = [];
    if (entry.nodes.length > 0) {
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
export {
  KasperInit as App,
  Component,
  ExpressionParser,
  Interpreter,
  Kasper,
  Router,
  Scanner,
  TemplateParser,
  Transpiler,
  Viewer,
  batch,
  computed,
  effect,
  execute,
  navigate,
  signal,
  transpile
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3JvdXRlci50cyIsIi4uL3NyYy9zaWduYWwudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvdHJhbnNwaWxlci50cyIsIi4uL3NyYy9rYXNwZXIudHMiLCIuLi9zcmMvdmlld2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNpZ25hbCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3Mge1xuICBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIHN0YXRpYyB0ZW1wbGF0ZT86IHN0cmluZztcbiAgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbiAgJGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgJHdhdGNoU3RvcHM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG4gICRyZW5kZXI/OiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogQ29tcG9uZW50QXJncykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgIHRoaXMuYXJncyA9IHt9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocHJvcHMuYXJncykge1xuICAgICAgdGhpcy5hcmdzID0gcHJvcHMuYXJncyB8fCB7fTtcbiAgICB9XG4gICAgaWYgKHByb3BzLnJlZikge1xuICAgICAgdGhpcy5yZWYgPSBwcm9wcy5yZWY7XG4gICAgfVxuICAgIGlmIChwcm9wcy50cmFuc3BpbGVyKSB7XG4gICAgICB0aGlzLnRyYW5zcGlsZXIgPSBwcm9wcy50cmFuc3BpbGVyO1xuICAgIH1cbiAgfVxuXG4gIGhhdW50PFQ+KHNpZzogU2lnbmFsPFQ+LCBmbjogV2F0Y2hlcjxUPik6IHZvaWQge1xuICAgIHRoaXMuJHdhdGNoU3RvcHMucHVzaChzaWcub25DaGFuZ2UoZm4pKTtcbiAgfVxuXG4gIG9uSW5pdCgpIHt9XG4gIG9uUmVuZGVyKCkge31cbiAgb25DaGFuZ2VzKCkge31cbiAgb25EZXN0cm95KCkge31cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy4kcmVuZGVyPy4oKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBLYXNwZXJFbnRpdHkgPSBDb21wb25lbnQgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50Q2xhc3MgPSB7IG5ldyAoYXJncz86IENvbXBvbmVudEFyZ3MpOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yPzogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU/OiBFbGVtZW50IHwgbnVsbDtcbiAgICBub2Rlcz86IEtOb2RlW107XG4gIH07XG59XG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoYFBhcnNlIEVycm9yICgke2xpbmV9OiR7Y29sfSkgPT4gJHt2YWx1ZX1gKTtcbiAgICB0aGlzLm5hbWUgPSBcIkthc3BlckVycm9yXCI7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJ3Rva2VuJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4cHIge1xuICBwdWJsaWMgcmVzdWx0OiBhbnk7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUjtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEFycm93RnVuY3Rpb24pOiBSO1xuICAgIHZpc2l0QXNzaWduRXhwcihleHByOiBBc3NpZ24pOiBSO1xuICAgIHZpc2l0QmluYXJ5RXhwcihleHByOiBCaW5hcnkpOiBSO1xuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcjogQ2FsbCk6IFI7XG4gICAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRGVidWcpOiBSO1xuICAgIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRGljdGlvbmFyeSk6IFI7XG4gICAgdmlzaXRFYWNoRXhwcihleHByOiBFYWNoKTogUjtcbiAgICB2aXNpdEdldEV4cHIoZXhwcjogR2V0KTogUjtcbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBHcm91cGluZyk6IFI7XG4gICAgdmlzaXRLZXlFeHByKGV4cHI6IEtleSk6IFI7XG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByOiBMb2dpY2FsKTogUjtcbiAgICB2aXNpdExpc3RFeHByKGV4cHI6IExpc3QpOiBSO1xuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogTGl0ZXJhbCk6IFI7XG4gICAgdmlzaXROZXdFeHByKGV4cHI6IE5ldyk6IFI7XG4gICAgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogTnVsbENvYWxlc2NpbmcpOiBSO1xuICAgIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogUG9zdGZpeCk6IFI7XG4gICAgdmlzaXRTZXRFeHByKGV4cHI6IFNldCk6IFI7XG4gICAgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogUGlwZWxpbmUpOiBSO1xuICAgIHZpc2l0U3ByZWFkRXhwcihleHByOiBTcHJlYWQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG4gICAgdmlzaXRWb2lkRXhwcihleHByOiBWb2lkKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEFycm93RnVuY3Rpb24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcGFyYW1zOiBUb2tlbltdO1xuICAgIHB1YmxpYyBib2R5OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBUb2tlbltdLCBib2R5OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXJyb3dGdW5jdGlvbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5BcnJvd0Z1bmN0aW9uJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzaWduIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXNzaWduJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkJpbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2FsbGVlOiBFeHByO1xuICAgIHB1YmxpYyBwYXJlbjogVG9rZW47XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcbiAgICBwdWJsaWMgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHIsIHBhcmVuOiBUb2tlbiwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIsIG9wdGlvbmFsID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IG9wdGlvbmFsO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdENhbGxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQ2FsbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVidWdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGVidWcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHByb3BlcnRpZXM6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGljdGlvbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EaWN0aW9uYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWFjaCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMga2V5OiBUb2tlbjtcbiAgICBwdWJsaWMgaXRlcmFibGU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwga2V5OiBUb2tlbiwgaXRlcmFibGU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVhY2hFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRWFjaCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHR5cGU6IFRva2VuVHlwZSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JvdXBpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdyb3VwaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5LZXknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dpY2FsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TG9naWNhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Mb2dpY2FsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpc3QnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGl0ZXJhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjbGF6ejogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGF6eiA9IGNsYXp6O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE5ld0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OZXcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsQ29hbGVzY2luZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE51bGxDb2FsZXNjaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk51bGxDb2FsZXNjaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9zdGZpeCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQb3N0Zml4RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBvc3RmaXgnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UGlwZWxpbmVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUGlwZWxpbmUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcHJlYWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTcHJlYWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU3ByZWFkJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVtcGxhdGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVtcGxhdGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXJuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogRXhwcjtcbiAgICBwdWJsaWMgdGhlbkV4cHI6IEV4cHI7XG4gICAgcHVibGljIGVsc2VFeHByOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBFeHByLCB0aGVuRXhwcjogRXhwciwgZWxzZUV4cHI6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuRXhwciA9IHRoZW5FeHByO1xuICAgICAgICB0aGlzLmVsc2VFeHByID0gZWxzZUV4cHI7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVybmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZXJuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHlwZW9mIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHlwZW9mRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlR5cGVvZic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJpYWJsZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5WYXJpYWJsZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZvaWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWb2lkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZvaWQnO1xuICB9XG59XG5cbiIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgLy8gUGFyc2VyIFRva2Vuc1xyXG4gIEVvZixcclxuICBQYW5pYyxcclxuXHJcbiAgLy8gU2luZ2xlIENoYXJhY3RlciBUb2tlbnNcclxuICBBbXBlcnNhbmQsXHJcbiAgQXRTaWduLFxyXG4gIENhcmV0LFxyXG4gIENvbW1hLFxyXG4gIERvbGxhcixcclxuICBEb3QsXHJcbiAgSGFzaCxcclxuICBMZWZ0QnJhY2UsXHJcbiAgTGVmdEJyYWNrZXQsXHJcbiAgTGVmdFBhcmVuLFxyXG4gIFBlcmNlbnQsXHJcbiAgUGlwZSxcclxuICBSaWdodEJyYWNlLFxyXG4gIFJpZ2h0QnJhY2tldCxcclxuICBSaWdodFBhcmVuLFxyXG4gIFNlbWljb2xvbixcclxuICBTbGFzaCxcclxuICBTdGFyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnNcclxuICBBcnJvdyxcclxuICBCYW5nLFxyXG4gIEJhbmdFcXVhbCxcclxuICBCYW5nRXF1YWxFcXVhbCxcclxuICBDb2xvbixcclxuICBFcXVhbCxcclxuICBFcXVhbEVxdWFsLFxyXG4gIEVxdWFsRXF1YWxFcXVhbCxcclxuICBHcmVhdGVyLFxyXG4gIEdyZWF0ZXJFcXVhbCxcclxuICBMZXNzLFxyXG4gIExlc3NFcXVhbCxcclxuICBNaW51cyxcclxuICBNaW51c0VxdWFsLFxyXG4gIE1pbnVzTWludXMsXHJcbiAgUGVyY2VudEVxdWFsLFxyXG4gIFBsdXMsXHJcbiAgUGx1c0VxdWFsLFxyXG4gIFBsdXNQbHVzLFxyXG4gIFF1ZXN0aW9uLFxyXG4gIFF1ZXN0aW9uRG90LFxyXG4gIFF1ZXN0aW9uUXVlc3Rpb24sXHJcbiAgU2xhc2hFcXVhbCxcclxuICBTdGFyRXF1YWwsXHJcbiAgRG90RG90LFxyXG4gIERvdERvdERvdCxcclxuICBMZXNzRXF1YWxHcmVhdGVyLFxyXG5cclxuICAvLyBMaXRlcmFsc1xyXG4gIElkZW50aWZpZXIsXHJcbiAgVGVtcGxhdGUsXHJcbiAgU3RyaW5nLFxyXG4gIE51bWJlcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zIChiaXR3aXNlIHNoaWZ0cylcclxuICBMZWZ0U2hpZnQsXHJcbiAgUmlnaHRTaGlmdCxcclxuICBQaXBlbGluZSxcclxuICBUaWxkZSxcclxuXHJcbiAgLy8gS2V5d29yZHNcclxuICBBbmQsXHJcbiAgQ29uc3QsXHJcbiAgRGVidWcsXHJcbiAgRmFsc2UsXHJcbiAgSW4sXHJcbiAgSW5zdGFuY2VvZixcclxuICBOZXcsXHJcbiAgTnVsbCxcclxuICBVbmRlZmluZWQsXHJcbiAgT2YsXHJcbiAgT3IsXHJcbiAgVHJ1ZSxcclxuICBUeXBlb2YsXHJcbiAgVm9pZCxcclxuICBXaXRoLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcclxuICBwdWJsaWMgbGl0ZXJhbDogYW55O1xyXG4gIHB1YmxpYyBsZXhlbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0eXBlOiBUb2tlblR5cGUsXHJcbiAgICBsZXhlbWU6IHN0cmluZyxcclxuICAgIGxpdGVyYWw6IGFueSxcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBUb2tlblR5cGVbdHlwZV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XHJcbiAgICB0aGlzLmxpdGVyYWwgPSBsaXRlcmFsO1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBbKCR7dGhpcy5saW5lfSk6XCIke3RoaXMubGV4ZW1lfVwiXWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlbGZDbG9zaW5nVGFncyA9IFtcclxuICBcImFyZWFcIixcclxuICBcImJhc2VcIixcclxuICBcImJyXCIsXHJcbiAgXCJjb2xcIixcclxuICBcImVtYmVkXCIsXHJcbiAgXCJoclwiLFxyXG4gIFwiaW1nXCIsXHJcbiAgXCJpbnB1dFwiLFxyXG4gIFwibGlua1wiLFxyXG4gIFwibWV0YVwiLFxyXG4gIFwicGFyYW1cIixcclxuICBcInNvdXJjZVwiLFxyXG4gIFwidHJhY2tcIixcclxuICBcIndiclwiLFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW107XG5cbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgZXhwcmVzc2lvbnMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBUb2tlbiB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XG4gIH1cblxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09PSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvcihcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgbWVzc2FnZSArIGAsIHVuZXhwZWN0ZWQgdG9rZW4gXCIke3RoaXMucGVlaygpLmxleGVtZX1cImBcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcih0b2tlbjogVG9rZW4sIG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5TZW1pY29sb24pIHx8IHRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9IHdoaWxlICghdGhpcy5lb2YoKSk7XG4gIH1cblxuICBwdWJsaWMgZm9yZWFjaCh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHIge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgICBjb25zdCBuYW1lID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxuICAgICk7XG5cbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLldpdGgpKSB7XG4gICAgICBrZXkgPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgICBgRXhwZWN0ZWQgYSBcImtleVwiIGlkZW50aWZpZXIgYWZ0ZXIgXCJ3aXRoXCIga2V5d29yZCBpbiBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLk9mLFxuICAgICAgYEV4cGVjdGVkIFwib2ZcIiBrZXl3b3JkIGluc2lkZSBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICApO1xuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRWFjaChuYW1lLCBrZXksIGl0ZXJhYmxlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHByZXNzaW9uKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHtcbiAgICAgIC8vIGNvbnN1bWUgYWxsIHNlbWljb2xvbnNcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHsgLyogY29uc3VtZSBzZW1pY29sb25zICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIGFzc2lnbm1lbnQoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnBpcGVsaW5lKCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKG9wZXJhdG9yLCBgSW52YWxpZCBsLXZhbHVlLCBpcyBub3QgYW4gYXNzaWduaW5nIHRhcmdldC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHBpcGVsaW5lKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGlwZWxpbmUpKSB7XG4gICAgICBjb25zdCByaWdodCA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLlBpcGVsaW5lKGV4cHIsIHJpZ2h0LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5Db2xvbiwgYEV4cGVjdGVkIFwiOlwiIGFmdGVyIHRlcm5hcnkgPyBleHByZXNzaW9uYCk7XG4gICAgICBjb25zdCBlbHNlRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBudWxsQ29hbGVzY2luZygpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgcmlnaHRFeHByOiBFeHByLkV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbE9yKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuT3IpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5BbmQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGVxdWFsaXR5KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICB3aGlsZSAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5JbnN0YW5jZW9mLFxuICAgICAgICBUb2tlblR5cGUuSW4sXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgc2hpZnQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0U2hpZnQsIFRva2VuVHlwZS5SaWdodFNoaWZ0KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51cywgVG9rZW5UeXBlLlBsdXMpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtb2R1bHVzKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aXBsaWNhdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TbGFzaCwgVG9rZW5UeXBlLlN0YXIpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UeXBlb2YpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UeXBlb2YodmFsdWUsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgIFRva2VuVHlwZS5UaWxkZSxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5wb3N0Zml4KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucG9zdGZpeCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3N0Zml4KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuY2FsbCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIDEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgLTEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZDogYm9vbGVhbjtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIGZhbHNlKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90LCBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZG90R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjb25zdW1lZCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRva2VuQXQob2Zmc2V0OiBudW1iZXIpOiBUb2tlblR5cGUge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgKyBvZmZzZXRdPy50eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Fycm93UGFyYW1zKCk6IGJvb2xlYW4ge1xuICAgIGxldCBpID0gdGhpcy5jdXJyZW50ICsgMTsgLy8gc2tpcCAoXG4gICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgIH1cbiAgICB3aGlsZSAoaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuSWRlbnRpZmllcikgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5Db21tYSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGZpbmlzaENhbGwoY2FsbGVlOiBFeHByLkV4cHIsIHBhcmVuOiBUb2tlbiwgb3B0aW9uYWw6IGJvb2xlYW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICAgIGFyZ3MucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB9XG4gICAgY29uc3QgY2xvc2VQYXJlbiA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGFyZ3VtZW50c2ApO1xuICAgIHJldHVybiBuZXcgRXhwci5DYWxsKGNhbGxlZSwgY2xvc2VQYXJlbiwgYXJncywgY2xvc2VQYXJlbi5saW5lLCBvcHRpb25hbCk7XG4gIH1cblxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbmFtZTogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXG4gICAgKTtcbiAgICBjb25zdCBrZXk6IEV4cHIuS2V5ID0gbmV3IEV4cHIuS2V5KG5hbWUsIG5hbWUubGluZSk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGxldCBrZXk6IEV4cHIuRXhwciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIGtleSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYW4gaW5kZXhgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgb3BlcmF0b3IubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHByaW1hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh1bmRlZmluZWQsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlbXBsYXRlKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5JZGVudGlmaWVyKSAmJiB0aGlzLnRva2VuQXQoMSkgPT09IFRva2VuVHlwZS5BcnJvdykge1xuICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lID0+XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihbcGFyYW1dLCBib2R5LCBwYXJhbS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLklkZW50aWZpZXIpKSB7XG4gICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZhcmlhYmxlKGlkZW50aWZpZXIsIGlkZW50aWZpZXIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5MZWZ0UGFyZW4pICYmIHRoaXMuaXNBcnJvd1BhcmFtcygpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSAoXG4gICAgICBjb25zdCBwYXJhbXM6IFRva2VuW10gPSBbXTtcbiAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHBhcmFtcy5wdXNoKHRoaXMuY29uc3VtZShUb2tlblR5cGUuSWRlbnRpZmllciwgXCJFeHBlY3RlZCBwYXJhbWV0ZXIgbmFtZVwiKSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcImApO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5BcnJvdywgYEV4cGVjdGVkIFwiPT5cImApO1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24ocGFyYW1zLCBib2R5LCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGV4cHJlc3Npb25gKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXN0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Wb2lkKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVm9pZChleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5EZWJ1ZykpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRlYnVnKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG5cbiAgICB0aHJvdyB0aGlzLmVycm9yKFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxuICAgICk7XG4gICAgLy8gdW5yZWFjaGVhYmxlIGNvZGVcbiAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCAwKTtcbiAgfVxuXG4gIHB1YmxpYyBkaWN0aW9uYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbGVmdEJyYWNlID0gdGhpcy5wcmV2aW91cygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgY29uc3QgcHJvcGVydGllczogRXhwci5FeHByW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIGBTdHJpbmcsIE51bWJlciBvciBJZGVudGlmaWVyIGV4cGVjdGVkIGFzIGEgS2V5IG9mIERpY3Rpb25hcnkgeywgdW5leHBlY3RlZCB0b2tlbiAke1xuICAgICAgICAgICAgdGhpcy5wZWVrKCkubGV4ZW1lXG4gICAgICAgICAgfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgdmFsdWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gIC8qKiBzY3JpcHRzIHNvdXJjZSBjb2RlICovXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xuICBwdWJsaWMgdG9rZW5zOiBUb2tlbltdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmdldFRva2VuKCk7XG4gICAgfVxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xuICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPj0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XG4gICAgICB0aGlzLmxpbmUrKztcbiAgICAgIHRoaXMuY29sID0gMDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgdGhpcy5jb2wrKztcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHRva2VuVHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lLCB0aGlzLmNvbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaChleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCArIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVDb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgY29tbWVudCwgZXhwZWN0aW5nIGNsb3NpbmcgXCIqL1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7cXVvdGV9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAvLyBUcmltIHRoZSBzdXJyb3VuZGluZyBxdW90ZXMuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XG4gICAgLy8gZ2V0cyBpbnRlZ2VyIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLlwiICYmIFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGV4cG9uZW50XG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCItXCIgfHwgdGhpcy5wZWVrKCkgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKSBhcyBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlO1xuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZVtjYXBpdGFsaXplZF0sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSBcIihcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIsXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNvbW1hLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiO1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TZW1pY29sb24sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlRpbGRlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSGFzaCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5Db2xvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TdGFyRXF1YWwgOiBUb2tlblR5cGUuU3RhcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5QZXJjZW50RXF1YWwgOiBUb2tlblR5cGUuUGVyY2VudCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwifFwiKSA/IFRva2VuVHlwZS5PciA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUGlwZWxpbmUgOlxuICAgICAgICAgIFRva2VuVHlwZS5QaXBlLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCImXCIpID8gVG9rZW5UeXBlLkFuZCA6IFRva2VuVHlwZS5BbXBlcnNhbmQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUmlnaHRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuR3JlYXRlckVxdWFsIDogVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwgOiBUb2tlblR5cGUuQmFuZ0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5CYW5nLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiP1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI/XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCIuXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvbkRvdFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUXVlc3Rpb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwgOiBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNQbHVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlBsdXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIi1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI8XCIpID8gVG9rZW5UeXBlLkxlZnRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj5cIilcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxuICAgICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90LCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xuICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCIqXCIpKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYCdgOlxuICAgICAgY2FzZSBgXCJgOlxuICAgICAgY2FzZSBcImBcIjpcbiAgICAgICAgdGhpcy5zdHJpbmcoY2hhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gaWdub3JlIGNhc2VzXG4gICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNvbXBsZXggY2FzZXNcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc0FscGhhKGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7Y2hhcn0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYW4gRXJyb3IgKCR7dGhpcy5saW5lfToke3RoaXMuY29sfSkgPT4gJHttZXNzYWdlfWApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICBjb25zdCAkaW1wb3J0cyA9ICh0aGlzLnZhbHVlcz8uY29uc3RydWN0b3IgYXMgYW55KT8uJGltcG9ydHM7XG4gICAgaWYgKCRpbXBvcnRzICYmIHR5cGVvZiAkaW1wb3J0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gJGltcG9ydHNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93W2tleSBhcyBrZXlvZiB0eXBlb2Ygd2luZG93XTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IEV4cHIuUGlwZWxpbmUpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkNhbGwpIHtcbiAgICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodC5jYWxsZWUpO1xuICAgICAgY29uc3QgYXJncyA9IFt2YWx1ZV07XG4gICAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLnJpZ2h0LmFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGFyZyBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGV4cHIucmlnaHQuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLnJpZ2h0LmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3QgZm4gPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHJldHVybiBmbih2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBFeHByLkFycm93RnVuY3Rpb24pOiBhbnkge1xuICAgIGNvbnN0IGNhcHR1cmVkU2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnNjb3BlO1xuICAgICAgdGhpcy5zY29wZSA9IG5ldyBTY29wZShjYXB0dXJlZFNjb3BlKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwci5wYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5wYXJhbXNbaV0ubGV4ZW1lLCBhcmdzW2ldKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuYm9keSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcblxuICAgIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIuZW50aXR5Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgIGV4cHIuZW50aXR5LmVudGl0eSxcbiAgICAgICAgZXhwci5lbnRpdHkua2V5LFxuICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoYEludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gcG9zdGZpeCBvcGVyYXRpb246ICR7ZXhwci5lbnRpdHl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgdmFsdWVzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoZXhwcmVzc2lvbiBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U3ByZWFkRXhwcihleHByOiBFeHByLlNwcmVhZCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHRlbXBsYXRlUGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBFeHByLlRlbXBsYXRlKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSBleHByLnZhbHVlLnJlcGxhY2UoXG4gICAgICAvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVQYXJzZShwbGFjZWhvbGRlcik7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0QmluYXJ5RXhwcihleHByOiBFeHByLkJpbmFyeSk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAtIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2g6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnQ6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50RXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICUgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGlwZTpcbiAgICAgICAgcmV0dXJuIGxlZnQgfCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkNhcmV0OlxuICAgICAgICByZXR1cm4gbGVmdCBeIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlcjpcbiAgICAgICAgcmV0dXJuIGxlZnQgPiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzOlxuICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzc0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA8PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbnN0YW5jZW9mOlxuICAgICAgICByZXR1cm4gbGVmdCBpbnN0YW5jZW9mIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuSW46XG4gICAgICAgIHJldHVybiBsZWZ0IGluIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVmdFNoaWZ0OlxuICAgICAgICByZXR1cm4gbGVmdCA8PCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlJpZ2h0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0ID4+IHJpZ2h0O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihcIlVua25vd24gYmluYXJ5IG9wZXJhdG9yIFwiICsgZXhwci5vcGVyYXRvcik7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IEV4cHIuTG9naWNhbCk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5Pcikge1xuICAgICAgaWYgKGxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IEV4cHIuVGVybmFyeSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5jb25kaXRpb24pXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmIChsZWZ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBFeHByLkdyb3VwaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogRXhwci5MaXRlcmFsKTogYW55IHtcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFVuYXJ5RXhwcihleHByOiBFeHByLlVuYXJ5KTogYW55IHtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgICByZXR1cm4gLXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZzpcbiAgICAgICAgcmV0dXJuICFyaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlRpbGRlOlxuICAgICAgICByZXR1cm4gfnJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgICBOdW1iZXIocmlnaHQpICsgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlBsdXNQbHVzID8gMSA6IC0xKTtcbiAgICAgICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5yaWdodC5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgICAgIGV4cHIucmlnaHQuZW50aXR5LFxuICAgICAgICAgICAgZXhwci5yaWdodC5rZXksXG4gICAgICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICAgIGBJbnZhbGlkIHJpZ2h0LWhhbmQgc2lkZSBleHByZXNzaW9uIGluIHByZWZpeCBvcGVyYXRpb246ICAke2V4cHIucmlnaHR9YFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihgVW5rbm93biB1bmFyeSBvcGVyYXRvciAnICsgZXhwci5vcGVyYXRvcmApO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gc2hvdWxkIGJlIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q2FsbEV4cHIoZXhwcjogRXhwci5DYWxsKTogYW55IHtcbiAgICAvLyB2ZXJpZnkgY2FsbGVlIGlzIGEgZnVuY3Rpb25cbiAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2FsbGVlKTtcbiAgICBpZiAoY2FsbGVlID09IG51bGwgJiYgZXhwci5vcHRpb25hbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIGNhbGxlZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKGAke2NhbGxlZX0gaXMgbm90IGEgZnVuY3Rpb25gKTtcbiAgICB9XG4gICAgLy8gZXZhbHVhdGUgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgY29uc3QgYXJncyA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJndW1lbnQgb2YgZXhwci5hcmdzKSB7XG4gICAgICBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJndW1lbnQgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmd1bWVudCkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBleGVjdXRlIGZ1bmN0aW9uIOKAlCBwcmVzZXJ2ZSBgdGhpc2AgZm9yIG1ldGhvZCBjYWxsc1xuICAgIGlmIChleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IG5ld0NhbGwgPSBleHByLmNsYXp6IGFzIEV4cHIuQ2FsbDtcbiAgICAvLyBpbnRlcm5hbCBjbGFzcyBkZWZpbml0aW9uIGluc3RhbmNlXG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKG5ld0NhbGwuY2FsbGVlKTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgYCcke2NsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBuZXdDYWxsLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgaWYgKHByb3BlcnR5IGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkaWN0LCB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGljdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFR5cGVvZkV4cHIoZXhwcjogRXhwci5UeXBlb2YpOiBhbnkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVhY2hFeHByKGV4cHI6IEV4cHIuRWFjaCk6IGFueSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGV4cHIubmFtZS5sZXhlbWUsXG4gICAgICBleHByLmtleSA/IGV4cHIua2V5LmxleGVtZSA6IG51bGwsXG4gICAgICB0aGlzLmV2YWx1YXRlKGV4cHIuaXRlcmFibGUpLFxuICAgIF07XG4gIH1cblxuICB2aXNpdFZvaWRFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIHZpc2l0RGVidWdFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgS05vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS05vZGVWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEVsZW1lbnRLTm9kZShrbm9kZTogRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVLTm9kZShrbm9kZTogQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdFRleHRLTm9kZShrbm9kZTogVGV4dCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRDb21tZW50S05vZGUoa25vZGU6IENvbW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0RG9jdHlwZUtOb2RlKGtub2RlOiBEb2N0eXBlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogS05vZGVbXTtcbiAgICBwdWJsaWMgY2hpbGRyZW46IEtOb2RlW107XG4gICAgcHVibGljIHNlbGY6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IEtOb2RlW10sIGNoaWxkcmVuOiBLTm9kZVtdLCBzZWxmOiBib29sZWFuLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLnNlbGYgPSBzZWxmO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2RvY3R5cGUnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcbmltcG9ydCB7IFNlbGZDbG9zaW5nVGFncywgV2hpdGVTcGFjZXMgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIge1xuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgcHVibGljIG5vZGVzOiBOb2RlLktOb2RlW107XG5cbiAgcHVibGljIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMubm9kZXMgPSBbXTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRoaXMuc291cmNlID0gXCJcIjtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gY2hhci5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoZW9mRXJyb3I6IHN0cmluZyA9IFwiXCIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFwiXFxuXCIpKSB7XG4gICAgICAgIHRoaXMubGluZSArPSAxO1xuICAgICAgICB0aGlzLmNvbCA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbCArPSAxO1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7ZW9mRXJyb3J9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2soY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IobWVzc2FnZSwgdGhpcy5saW5lLCB0aGlzLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIG5vZGUoKTogTm9kZS5LTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuS05vZGU7XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNvbW1lbnQgY2xvc2luZyAnLS0+J1wiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMyk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkNvbW1lbnQoY29tbWVudCwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXCIvPlwiKSB8fFxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIFtdLCB0cnVlLCB0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5wZWVrKFwiPC9cIikpIHtcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbihuYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKG5hbWUpO1xuICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuLCBmYWxzZSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoaWxkcmVuKHBhcmVudDogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke3BhcmVudH0+YCk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKFwiQmxhbmsgYXR0cmlidXRlIG5hbWVcIik7XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiJ1wiKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZyhcIidcIikpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goJ1wiJykpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoJ1wiJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgTm9kZS5BdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGxpbmUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIHRleHQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICBsZXQgZGVwdGggPSAwO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCJ7e1wiKSkgeyBkZXB0aCsrOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID4gMCAmJiB0aGlzLm1hdGNoKFwifX1cIikpIHsgZGVwdGgtLTsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA9PT0gMCAmJiB0aGlzLnBlZWsoXCI8XCIpKSB7IGJyZWFrOyB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgY29uc3QgcmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCkudHJpbSgpO1xuICAgIGlmICghcmF3KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlLlRleHQodGhpcy5kZWNvZGVFbnRpdGllcyhyYXcpLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb2RlRW50aXRpZXModGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dFxuICAgICAgLnJlcGxhY2UoLyZuYnNwOy9nLCBcIlxcdTAwYTBcIilcbiAgICAgIC5yZXBsYWNlKC8mbHQ7L2csIFwiPFwiKVxuICAgICAgLnJlcGxhY2UoLyZndDsvZywgXCI+XCIpXG4gICAgICAucmVwbGFjZSgvJnF1b3Q7L2csICdcIicpXG4gICAgICAucmVwbGFjZSgvJmFwb3M7L2csIFwiJ1wiKVxuICAgICAgLnJlcGxhY2UoLyZhbXA7L2csIFwiJlwiKTsgLy8gbXVzdCBiZSBsYXN0IHRvIGF2b2lkIGRvdWJsZS1kZWNvZGluZ1xuICB9XG5cbiAgcHJpdmF0ZSB3aGl0ZXNwYWNlKCk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzLCAuLi5jbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKS50cmltKCk7XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhjbG9zaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5tYXRjaChjbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDbGFzcyB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJvdXRlQ29uZmlnIHtcbiAgcGF0aDogc3RyaW5nO1xuICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzO1xuICBndWFyZD86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgXCJcIiwgcGF0aCk7XG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBQb3BTdGF0ZUV2ZW50KFwicG9wc3RhdGVcIikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hQYXRoKHBhdHRlcm46IHN0cmluZywgcGF0aG5hbWU6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgaWYgKHBhdHRlcm4gPT09IFwiKlwiKSByZXR1cm4ge307XG4gIGNvbnN0IHBhdHRlcm5QYXJ0cyA9IHBhdHRlcm4uc3BsaXQoXCIvXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgcGF0aFBhcnRzID0gcGF0aG5hbWUuc3BsaXQoXCIvXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKHBhdHRlcm5QYXJ0cy5sZW5ndGggIT09IHBhdGhQYXJ0cy5sZW5ndGgpIHJldHVybiBudWxsO1xuICBjb25zdCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocGF0dGVyblBhcnRzW2ldLnN0YXJ0c1dpdGgoXCI6XCIpKSB7XG4gICAgICBwYXJhbXNbcGF0dGVyblBhcnRzW2ldLnNsaWNlKDEpXSA9IHBhdGhQYXJ0c1tpXTtcbiAgICB9IGVsc2UgaWYgKHBhdHRlcm5QYXJ0c1tpXSAhPT0gcGF0aFBhcnRzW2ldKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZXhwb3J0IGNsYXNzIFJvdXRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHByaXZhdGUgcm91dGVzOiBSb3V0ZUNvbmZpZ1tdID0gW107XG5cbiAgc2V0Um91dGVzKHJvdXRlczogUm91dGVDb25maWdbXSk6IHZvaWQge1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzO1xuICB9XG5cbiAgb25Jbml0KCk6IHZvaWQge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgKCkgPT4gdGhpcy5fbmF2aWdhdGUoKSwge1xuICAgICAgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgIH0pO1xuICAgIHRoaXMuX25hdmlnYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9uYXZpZ2F0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHRoaXMucm91dGVzKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBtYXRjaFBhdGgocm91dGUucGF0aCwgcGF0aG5hbWUpO1xuICAgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBpZiAocm91dGUuZ3VhcmQpIHtcbiAgICAgICAgY29uc3QgYWxsb3dlZCA9IGF3YWl0IHJvdXRlLmd1YXJkKCk7XG4gICAgICAgIGlmICghYWxsb3dlZCkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fbW91bnQocm91dGUuY29tcG9uZW50LCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX21vdW50KENvbXBvbmVudENsYXNzOiBDb21wb25lbnRDbGFzcywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMucmVmIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICghZWxlbWVudCB8fCAhdGhpcy50cmFuc3BpbGVyKSByZXR1cm47XG4gICAgdGhpcy50cmFuc3BpbGVyLm1vdW50Q29tcG9uZW50KENvbXBvbmVudENsYXNzLCBlbGVtZW50LCBwYXJhbXMpO1xuICB9XG59XG4iLCJ0eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxubGV0IGFjdGl2ZUVmZmVjdDogeyBmbjogTGlzdGVuZXI7IGRlcHM6IFNldDxhbnk+IH0gfCBudWxsID0gbnVsbDtcbmNvbnN0IGVmZmVjdFN0YWNrOiBhbnlbXSA9IFtdO1xuXG5sZXQgYmF0Y2hpbmcgPSBmYWxzZTtcbmNvbnN0IHBlbmRpbmdTdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG5jb25zdCBwZW5kaW5nV2F0Y2hlcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbnR5cGUgV2F0Y2hlcjxUPiA9IChuZXdWYWx1ZTogVCwgb2xkVmFsdWU6IFQpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIF92YWx1ZTogVDtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG4gIHByaXZhdGUgd2F0Y2hlcnMgPSBuZXcgU2V0PFdhdGNoZXI8VD4+KCk7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZhbHVlOiBUKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5hZGQoYWN0aXZlRWZmZWN0LmZuKTtcbiAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLmFkZCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl92YWx1ZTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBpZiAoYmF0Y2hpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpYmVycykgcGVuZGluZ1N1YnNjcmliZXJzLmFkZChzdWIpO1xuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykgcGVuZGluZ1dhdGNoZXJzLnB1c2goKCkgPT4gd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycykpIHtcbiAgICAgICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSB7XG4gICAgICAgICAgdHJ5IHsgd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2UoZm46IFdhdGNoZXI8VD4pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lcikge1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25hbDxUPihpbml0aWFsVmFsdWU6IFQpOiBTaWduYWw8VD4ge1xuICByZXR1cm4gbmV3IFNpZ25hbChpbml0aWFsVmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmF0Y2goZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgYmF0Y2hpbmcgPSB0cnVlO1xuICB0cnkge1xuICAgIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgYmF0Y2hpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbShwZW5kaW5nU3Vic2NyaWJlcnMpO1xuICAgIHBlbmRpbmdTdWJzY3JpYmVycy5jbGVhcigpO1xuICAgIGNvbnN0IHdhdGNoZXJzID0gcGVuZGluZ1dhdGNoZXJzLnNwbGljZSgwKTtcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiBzdWJzKSB7XG4gICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2Ygd2F0Y2hlcnMpIHtcbiAgICAgIHRyeSB7IHdhdGNoZXIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgY29uc3QgcyA9IHNpZ25hbDxUPih1bmRlZmluZWQgYXMgYW55KTtcbiAgZWZmZWN0KCgpID0+IHtcbiAgICBzLnZhbHVlID0gZm4oKTtcbiAgfSk7XG4gIHJldHVybiBzO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJvdW5kYXJ5IHtcbiAgcHJpdmF0ZSBzdGFydDogQ29tbWVudDtcbiAgcHJpdmF0ZSBlbmQ6IENvbW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBOb2RlLCBsYWJlbDogc3RyaW5nID0gXCJib3VuZGFyeVwiKSB7XG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LXN0YXJ0YCk7XG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1lbmRgKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRDbGFzcywgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZUNvbmZpZyB9IGZyb20gXCIuL3JvdXRlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IGVmZmVjdCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgQm91bmRhcnkgfSBmcm9tIFwiLi9ib3VuZGFyeVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcigpO1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiB7IHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSB9KSB7XG4gICAgdGhpcy5yZWdpc3RyeVtcInJvdXRlclwiXSA9IHsgY29tcG9uZW50OiBSb3V0ZXIsIG5vZGVzOiBbXSB9O1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuO1xuICAgIGlmIChvcHRpb25zLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0geyAuLi50aGlzLnJlZ2lzdHJ5LCAuLi5vcHRpb25zLnJlZ2lzdHJ5IH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwaWxlKFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVudGl0eTogYW55LFxuICAgIGNvbnRhaW5lcjogRWxlbWVudFxuICApOiBOb2RlIHtcbiAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGVudGl0eSk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgY29udGFpbmVyKTtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudHJhY2tFZmZlY3QodGV4dCwgc3RvcCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKGUubWVzc2FnZSB8fCBgJHtlfWAsIFwidGV4dCBub2RlXCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHIgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobm9kZS5uYW1lKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBhdHRyLnZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgIH0pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYXR0ciwgc3RvcCk7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAocGFyZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IENvbW1lbnQobm9kZS52YWx1ZSk7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYWNrRWZmZWN0KHRhcmdldDogYW55LCBzdG9wOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25zWzBdWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxLCBleHByZXNzaW9ucy5sZW5ndGgpKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICBjb25zdCAkZWxzZWlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgIGlmICgkZWxzZWlmKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VcIl0pKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qga2V5QXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQGtleVwiXSk7XG4gICAgaWYgKGtleUF0dHIpIHtcbiAgICAgIHRoaXMuZG9FYWNoS2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50LCBrZXlBdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb0VhY2hVbmtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hVbmtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBrZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcblxuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGtleSkgc2NvcGVWYWx1ZXNba2V5XSA9IGluZGV4O1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgY29uc3QgW25hbWUsIGluZGV4S2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IGl0ZW1zIGFuZCB0aGVpciBrZXlzXG4gICAgICBjb25zdCBuZXdJdGVtczogQXJyYXk8eyBpdGVtOiBhbnk7IGlkeDogbnVtYmVyOyBrZXk6IGFueSB9PiA9IFtdO1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpbmRleDtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXhlY3V0ZShrZXlBdHRyLnZhbHVlKTtcbiAgICAgICAgbmV3SXRlbXMucHVzaCh7IGl0ZW06IGl0ZW0sIGlkeDogaW5kZXgsIGtleToga2V5IH0pO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuXG4gICAgICAvLyBEZXN0cm95IG5vZGVzIHdob3NlIGtleXMgYXJlIG5vIGxvbmdlciBwcmVzZW50XG4gICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZG9tTm9kZV0gb2Yga2V5ZWROb2Rlcykge1xuICAgICAgICBpZiAoIW5ld0tleVNldC5oYXMoa2V5KSkge1xuICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChkb21Ob2RlKTtcbiAgICAgICAgICBrZXllZE5vZGVzLmRlbGV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEluc2VydC9yZXVzZSBub2RlcyBpbiBuZXcgb3JkZXJcbiAgICAgIGZvciAoY29uc3QgeyBpdGVtLCBpZHgsIGtleSB9IG9mIG5ld0l0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGlkeDtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG5cbiAgICAgICAgaWYgKGtleWVkTm9kZXMuaGFzKGtleSkpIHtcbiAgICAgICAgICBib3VuZGFyeS5pbnNlcnQoa2V5ZWROb2Rlcy5nZXQoa2V5KSEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICBpZiAoY3JlYXRlZCkga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICB9KTtcblxuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBkb1doaWxlKCR3aGlsZTogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwid2hpbGVcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgIGJvdW5kYXJ5LmNsZWFyKCk7XG5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSk7XG4gICAgICB3aGlsZSAodGhpcy5leGVjdXRlKCR3aGlsZS52YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICB9KTtcblxuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgLy8gZXhlY3V0ZXMgaW5pdGlhbGl6YXRpb24gaW4gdGhlIGN1cnJlbnQgc2NvcGVcbiAgcHJpdmF0ZSBkb0xldChpbml0OiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIHRoaXMuZXhlY3V0ZShpbml0LnZhbHVlKTtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTaWJsaW5ncyhub2RlczogS05vZGUuS05vZGVbXSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gMDtcbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCAkZWFjaCA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWFjaFwiXSk7XG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGlmID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBpZlwiXSk7XG4gICAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tub2RlIGFzIEtOb2RlLkVsZW1lbnQsICRpZl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxuICAgICAgICAgICAgICBcIkBlbHNlaWZcIixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChbbm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgYXR0cl0pO1xuICAgICAgICAgICAgICBjdXJyZW50ICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJHdoaWxlID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkB3aGlsZVwiXSk7XG4gICAgICAgIGlmICgkd2hpbGUpIHtcbiAgICAgICAgICB0aGlzLmRvV2hpbGUoJHdoaWxlLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGxldCA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICB0aGlzLmRvTGV0KCRsZXQsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1lbnQobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgIHRyeSB7XG4gICAgICBpZiAobm9kZS5uYW1lID09PSBcInNsb3RcIikge1xuICAgICAgICBjb25zdCBuYW1lQXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQG5hbWVcIl0pO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZUF0dHIgPyBuYW1lQXR0ci52YWx1ZSA6IFwiZGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBzbG90cyA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJHNsb3RzXCIpO1xuICAgICAgICBpZiAoc2xvdHMgJiYgc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuICAgICAgY29uc3QgZWxlbWVudCA9IGlzVm9pZCA/IHBhcmVudCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZS5uYW1lKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQgIT09IHBhcmVudCkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRyZWZcIiwgZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0NvbXBvbmVudCkge1xuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBhbmQgc2V0IGl0IGFzIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IHt9O1xuICAgICAgICBjb25zdCBhcmdzQXR0ciA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5jcmVhdGVDb21wb25lbnRBcmdzKGFyZ3NBdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZVtdKTtcblxuICAgICAgICAvLyBDYXB0dXJlIGNoaWxkcmVuIGZvciBzbG90c1xuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgS05vZGUuS05vZGVbXT4gPSB7IGRlZmF1bHQ6IFtdIH07XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBzbG90XCJdKTtcbiAgICAgICAgICAgIGlmIChzbG90QXR0cikge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc2xvdEF0dHIudmFsdWU7XG4gICAgICAgICAgICAgIGlmICghc2xvdHNbbmFtZV0pIHNsb3RzW25hbWVdID0gW107XG4gICAgICAgICAgICAgIHNsb3RzW25hbWVdLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2xvdHMuZGVmYXVsdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0uY29tcG9uZW50KHtcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICByZWY6IGVsZW1lbnQsXG4gICAgICAgICAgICB0cmFuc3BpbGVyOiB0aGlzLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5iaW5kTWV0aG9kcyhjb21wb25lbnQpO1xuICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gY29tcG9uZW50O1xuXG4gICAgICAgICAgY29uc3QgY29tcG9uZW50Tm9kZXMgPSB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMhO1xuICAgICAgICAgIGNvbXBvbmVudC4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcbiAgICAgICAgICAgIGNvbnN0IHByZXZTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKGNvbXBvbmVudE5vZGVzLCBlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJyb3V0ZXJcIiAmJiBjb21wb25lbnQgaW5zdGFuY2VvZiBSb3V0ZXIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXRSb3V0ZXModGhpcy5leHRyYWN0Um91dGVzKG5vZGUuY2hpbGRyZW4pKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbkluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uSW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHBvc2Ugc2xvdHMgaW4gY29tcG9uZW50IHNjb3BlXG4gICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMhLCBlbGVtZW50KTtcblxuICAgICAgICBpZiAoY29tcG9uZW50ICYmIHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWb2lkKSB7XG4gICAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgICAgY29uc3QgZXZlbnRzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudCBhcyBLTm9kZS5BdHRyaWJ1dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgZmlyc3QpXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAgIChhdHRyKSA9PiAhKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGF0dHIsIGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvcnRoYW5kIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBzZWNvbmQsIGFsbG93cyBtZXJnaW5nKVxuICAgICAgICBjb25zdCBzaG9ydGhhbmRBdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG5hbWUuc3RhcnRzV2l0aChcIkBcIikgJiZcbiAgICAgICAgICAgICFbXCJAaWZcIiwgXCJAZWxzZWlmXCIsIFwiQGVsc2VcIiwgXCJAZWFjaFwiLCBcIkB3aGlsZVwiLCBcIkBsZXRcIiwgXCJAa2V5XCIsIFwiQHJlZlwiXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIikgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzaG9ydGhhbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgcmVhbE5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgbGV0IGxhc3REeW5hbWljVmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXRpY0NsYXNzID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gc3RhdGljQ2xhc3Muc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihjID0+IGMgIT09IGxhc3REeW5hbWljVmFsdWUgJiYgYyAhPT0gXCJcIilcbiAgICAgICAgICAgICAgICAuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY3VycmVudENsYXNzZXMgPyBgJHtjdXJyZW50Q2xhc3Nlc30gJHt2YWx1ZX1gIDogdmFsdWU7XG4gICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgIGxhc3REeW5hbWljVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5yZW1vdmVBdHRyaWJ1dGUocmVhbE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgPyBgJHtleGlzdGluZy5lbmRzV2l0aChcIjtcIikgPyBleGlzdGluZyA6IGV4aXN0aW5nICsgXCI7XCJ9ICR7dmFsdWV9YFxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShyZWFsTmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZkF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkByZWZcIl0pO1xuICAgICAgaWYgKHJlZkF0dHIgJiYgIWlzVm9pZCkge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHJlZkF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KHByb3BOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKGUubWVzc2FnZSB8fCBgJHtlfWAsIG5vZGUubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb21wb25lbnRBcmdzKGFyZ3M6IEtOb2RlLkF0dHJpYnV0ZVtdKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBjb25zdCBrZXkgPSBhcmcubmFtZS5zcGxpdChcIjpcIilbMV07XG4gICAgICByZXN1bHRba2V5XSA9IHRoaXMuZXhlY3V0ZShhcmcudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQ6IE5vZGUsIGF0dHI6IEtOb2RlLkF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIGNvbnN0IFtldmVudE5hbWUsIC4uLm1vZGlmaWVyc10gPSBhdHRyLm5hbWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCBsaXN0ZW5lclNjb3BlID0gbmV3IFNjb3BlKHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7fTtcbiAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikge1xuICAgICAgb3B0aW9ucy5zaWduYWwgPSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgICB9XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm9uY2VcIikpICAgIG9wdGlvbnMub25jZSAgICA9IHRydWU7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhc3NpdmVcIikpIG9wdGlvbnMucGFzc2l2ZSA9IHRydWU7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhcHR1cmVcIikpIG9wdGlvbnMuY2FwdHVyZSA9IHRydWU7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwcmV2ZW50XCIpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGlzdGVuZXJTY29wZS5zZXQoXCIkZXZlbnRcIiwgZXZlbnQpO1xuICAgICAgdGhpcy5leGVjdXRlKGF0dHIudmFsdWUsIGxpc3RlbmVyU2NvcGUpO1xuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgcmVnZXggPSAvXFx7XFx7LitcXH1cXH0vbXM7XG4gICAgaWYgKHJlZ2V4LnRlc3QodGV4dCkpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLCAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uKHBsYWNlaG9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveU5vZGUobm9kZTogYW55KTogdm9pZCB7XG4gICAgLy8gMS4gQ2xlYW51cCBjb21wb25lbnQgaW5zdGFuY2VcbiAgICBpZiAobm9kZS4ka2FzcGVySW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbm9kZS4ka2FzcGVySW5zdGFuY2U7XG4gICAgICBpZiAoaW5zdGFuY2Uub25EZXN0cm95KSBpbnN0YW5jZS5vbkRlc3Ryb3koKTtcbiAgICAgIGlmIChpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgICBpZiAoaW5zdGFuY2UuJHdhdGNoU3RvcHMpIGluc3RhbmNlLiR3YXRjaFN0b3BzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgfVxuXG4gICAgLy8gMi4gQ2xlYW51cCBlZmZlY3RzIGF0dGFjaGVkIHRvIHRoZSBub2RlXG4gICAgaWYgKG5vZGUuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyAzLiBDbGVhbnVwIGVmZmVjdHMgb24gYXR0cmlidXRlc1xuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChhdHRyLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDQuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkOiBhbnkpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KGNvbnRhaW5lcjogRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgbW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSAoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKSByZXR1cm47XG5cbiAgICBjb25zdCBub2RlcyA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpLnBhcnNlKHRlbXBsYXRlKTtcbiAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaG9zdCk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50Q2xhc3MoeyBhcmdzOiB7IHBhcmFtczogcGFyYW1zIH0sIHJlZjogaG9zdCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgKGhvc3QgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICBjb25zdCBjb21wb25lbnROb2RlcyA9IG5vZGVzO1xuICAgIGNvbXBvbmVudC4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5kZXN0cm95KGhvc3QpO1xuICAgICAgaG9zdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUobnVsbCwgY29tcG9uZW50KTtcbiAgICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKGNvbXBvbmVudE5vZGVzLCBob3N0KTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uSW5pdCA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25Jbml0KCk7XG5cbiAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBob3N0KTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICB9XG5cbiAgcHVibGljIGV4dHJhY3RSb3V0ZXMoY2hpbGRyZW46IEtOb2RlLktOb2RlW10sIHBhcmVudEd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPik6IFJvdXRlQ29uZmlnW10ge1xuICAgIGNvbnN0IHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC50eXBlICE9PSBcImVsZW1lbnRcIikgY29udGludWU7XG4gICAgICBjb25zdCBlbCA9IGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBpZiAoZWwubmFtZSA9PT0gXCJyb3V0ZVwiKSB7XG4gICAgICAgIGNvbnN0IHBhdGhBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQHBhdGhcIl0pO1xuICAgICAgICBjb25zdCBjb21wb25lbnRBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGNvbXBvbmVudFwiXSk7XG4gICAgICAgIGNvbnN0IGd1YXJkQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBndWFyZFwiXSk7XG4gICAgICAgIGlmICghcGF0aEF0dHIgfHwgIWNvbXBvbmVudEF0dHIpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBwYXRoID0gcGF0aEF0dHIudmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuZXhlY3V0ZShjb21wb25lbnRBdHRyLnZhbHVlKTtcbiAgICAgICAgY29uc3QgZ3VhcmQgPSBndWFyZEF0dHIgPyB0aGlzLmV4ZWN1dGUoZ3VhcmRBdHRyLnZhbHVlKSA6IHBhcmVudEd1YXJkO1xuICAgICAgICByb3V0ZXMucHVzaCh7IHBhdGg6IHBhdGgsIGNvbXBvbmVudDogY29tcG9uZW50LCBndWFyZDogZ3VhcmQgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZWwubmFtZSA9PT0gXCJndWFyZFwiKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjaGVja1wiXSk7XG4gICAgICAgIGlmICghY2hlY2tBdHRyKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY2hlY2sgPSB0aGlzLmV4ZWN1dGUoY2hlY2tBdHRyLnZhbHVlKTtcbiAgICAgICAgcm91dGVzLnB1c2goLi4udGhpcy5leHRyYWN0Um91dGVzKGVsLmNoaWxkcmVuLCBjaGVjaykpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RG9jdHlwZUtOb2RlKF9ub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgdGFnTmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IG1lc3NhZ2Uuc3RhcnRzV2l0aChcIlJ1bnRpbWUgRXJyb3JcIilcbiAgICAgID8gbWVzc2FnZVxuICAgICAgOiBgUnVudGltZSBFcnJvcjogJHttZXNzYWdlfWA7XG5cbiAgICBpZiAodGFnTmFtZSAmJiAhY2xlYW5NZXNzYWdlLmluY2x1ZGVzKGBhdCA8JHt0YWdOYW1lfT5gKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2NsZWFuTWVzc2FnZX1cXG4gIGF0IDwke3RhZ05hbWV9PmApO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihjbGVhbk1lc3NhZ2UpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnQsXG4gIHJlZ2lzdHJ5PzogQ29tcG9uZW50UmVnaXN0cnlcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IHx8IHt9IH0pO1xuICBjb25zdCByZXN1bHQgPSB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgZW50aXR5IHx8IHt9LCBjb250YWluZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXIoQ29tcG9uZW50Q2xhc3M6IGFueSkge1xuICBLYXNwZXJJbml0KHtcbiAgICByb290OiBcImthc3Blci1hcHBcIixcbiAgICBlbnRyeTogXCJrYXNwZXItcm9vdFwiLFxuICAgIHJlZ2lzdHJ5OiB7XG4gICAgICBcImthc3Blci1yb290XCI6IHtcbiAgICAgICAgc2VsZWN0b3I6IFwidGVtcGxhdGVcIixcbiAgICAgICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcyxcbiAgICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgQXBwQ29uZmlnIHtcbiAgcm9vdD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoXG4gIHRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsXG4gIHRhZzogc3RyaW5nLFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnlcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVnaXN0cnlbdGFnXS5jb21wb25lbnQoe1xuICAgIHJlZjogZWxlbWVudCxcbiAgICB0cmFuc3BpbGVyOiB0cmFuc3BpbGVyLFxuICAgIGFyZ3M6IHt9LFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIG5vZGU6IGVsZW1lbnQsXG4gICAgaW5zdGFuY2U6IGNvbXBvbmVudCxcbiAgICBub2RlczogcmVnaXN0cnlbdGFnXS5ub2RlcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmVnaXN0cnkoXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSxcbiAgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxuKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHsgLi4ucmVnaXN0cnkgfTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocmVnaXN0cnkpKSB7XG4gICAgY29uc3QgZW50cnkgPSByZWdpc3RyeVtrZXldO1xuICAgIGlmICghZW50cnkubm9kZXMpIGVudHJ5Lm5vZGVzID0gW107XG4gICAgaWYgKGVudHJ5Lm5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoZW50cnkuc2VsZWN0b3IpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbnRyeS5zZWxlY3Rvcik7XG4gICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgZW50cnkudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UodGVtcGxhdGUuaW5uZXJIVE1MKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHN0YXRpY1RlbXBsYXRlID0gKGVudHJ5LmNvbXBvbmVudCBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmIChzdGF0aWNUZW1wbGF0ZSkge1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2Uoc3RhdGljVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVySW5pdChjb25maWc6IEFwcENvbmZpZykge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgcm9vdCA9XG4gICAgdHlwZW9mIGNvbmZpZy5yb290ID09PSBcInN0cmluZ1wiXG4gICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpXG4gICAgICA6IGNvbmZpZy5yb290O1xuXG4gIGlmICghcm9vdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUm9vdCBlbGVtZW50IG5vdCBmb3VuZDogJHtjb25maWcucm9vdH1gKTtcbiAgfVxuXG4gIGNvbnN0IHJlZ2lzdHJ5ID0gbm9ybWFsaXplUmVnaXN0cnkoY29uZmlnLnJlZ2lzdHJ5LCBwYXJzZXIpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogcmVnaXN0cnkgfSk7XG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuXG4gIGNvbnN0IHsgbm9kZSwgaW5zdGFuY2UsIG5vZGVzIH0gPSBjcmVhdGVDb21wb25lbnQoXG4gICAgdHJhbnNwaWxlcixcbiAgICBlbnRyeVRhZyxcbiAgICByZWdpc3RyeVxuICApO1xuXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cblxuICAvLyBJbml0aWFsIHJlbmRlciBhbmQgbGlmZWN5Y2xlXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Jbml0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vbkluaXQoKTtcbiAgfVxuXG4gIHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBpbnN0YW5jZSwgbm9kZSBhcyBIVE1MRWxlbWVudCk7XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cbiIsImltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld2VyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHN0cmluZz4ge1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUuYWNjZXB0KHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zcGlsZShub2RlczogS05vZGUuS05vZGVbXSk6IHN0cmluZ1tdIHtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZXZhbHVhdGUobm9kZSkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtlfWApO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMTAwKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcy5tYXAoKGF0dHIpID0+IHRoaXMuZXZhbHVhdGUoYXR0cikpLmpvaW4oXCIgXCIpO1xyXG4gICAgaWYgKGF0dHJzLmxlbmd0aCkge1xyXG4gICAgICBhdHRycyA9IFwiIFwiICsgYXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfS8+YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSkuam9pbihcIlwiKTtcclxuICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9PiR7Y2hpbGRyZW59PC8ke25vZGUubmFtZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSk6IHN0cmluZyB7XHJcbiAgICBpZiAobm9kZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gYCR7bm9kZS5uYW1lfT1cIiR7bm9kZS52YWx1ZX1cImA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5uYW1lO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5vZGUudmFsdWVcclxuICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxyXG4gICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcclxuICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csIFwiJm5ic3A7XCIpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKG5vZGU6IEtOb2RlLkNvbW1lbnQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGA8IS0tICR7bm9kZS52YWx1ZX0gLS0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShub2RlOiBLTm9kZS5Eb2N0eXBlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCFkb2N0eXBlICR7bm9kZS52YWx1ZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgUnVudGltZSBFcnJvciA9PiAke21lc3NhZ2V9YCk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJTZXQiLCJUb2tlblR5cGUiLCJFeHByLkVhY2giLCJFeHByLlZhcmlhYmxlIiwiRXhwci5CaW5hcnkiLCJFeHByLkFzc2lnbiIsIkV4cHIuR2V0IiwiRXhwci5TZXQiLCJFeHByLlBpcGVsaW5lIiwiRXhwci5UZXJuYXJ5IiwiRXhwci5OdWxsQ29hbGVzY2luZyIsIkV4cHIuTG9naWNhbCIsIkV4cHIuVHlwZW9mIiwiRXhwci5VbmFyeSIsIkV4cHIuTmV3IiwiRXhwci5Qb3N0Zml4IiwiRXhwci5TcHJlYWQiLCJFeHByLkNhbGwiLCJFeHByLktleSIsIkV4cHIuTGl0ZXJhbCIsIkV4cHIuVGVtcGxhdGUiLCJFeHByLkFycm93RnVuY3Rpb24iLCJFeHByLkdyb3VwaW5nIiwiRXhwci5Wb2lkIiwiRXhwci5EZWJ1ZyIsIkV4cHIuRGljdGlvbmFyeSIsIkV4cHIuTGlzdCIsIlV0aWxzLmlzRGlnaXQiLCJVdGlscy5pc0FscGhhTnVtZXJpYyIsIlV0aWxzLmNhcGl0YWxpemUiLCJVdGlscy5pc0tleXdvcmQiLCJVdGlscy5pc0FscGhhIiwiUGFyc2VyIiwiQ29tbWVudCIsIk5vZGUuQ29tbWVudCIsIk5vZGUuRG9jdHlwZSIsIk5vZGUuRWxlbWVudCIsIk5vZGUuQXR0cmlidXRlIiwiTm9kZS5UZXh0IiwiQ29tcG9uZW50Q2xhc3MiLCJzY29wZSIsInByZXYiXSwibWFwcGluZ3MiOiJBQVlPLE1BQU0sVUFBVTtBQUFBLEVBU3JCLFlBQVksT0FBdUI7QUFQbkMsU0FBQSxPQUE0QixDQUFBO0FBRzVCLFNBQUEsbUJBQW1CLElBQUksZ0JBQUE7QUFDdkIsU0FBQSxjQUFpQyxDQUFBO0FBSS9CLFFBQUksQ0FBQyxPQUFPO0FBQ1YsV0FBSyxPQUFPLENBQUE7QUFDWjtBQUFBLElBQ0Y7QUFDQSxRQUFJLE1BQU0sTUFBTTtBQUNkLFdBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQTtBQUFBLElBQzVCO0FBQ0EsUUFBSSxNQUFNLEtBQUs7QUFDYixXQUFLLE1BQU0sTUFBTTtBQUFBLElBQ25CO0FBQ0EsUUFBSSxNQUFNLFlBQVk7QUFDcEIsV0FBSyxhQUFhLE1BQU07QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE1BQVMsS0FBZ0IsSUFBc0I7QUFDN0MsU0FBSyxZQUFZLEtBQUssSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUFBLEVBQ3hDO0FBQUEsRUFFQSxTQUFTO0FBQUEsRUFBQztBQUFBLEVBQ1YsV0FBVztBQUFBLEVBQUM7QUFBQSxFQUNaLFlBQVk7QUFBQSxFQUFDO0FBQUEsRUFDYixZQUFZO0FBQUEsRUFBQztBQUFBLEVBRWIsU0FBUztBQWxDSjtBQW1DSCxlQUFLLFlBQUw7QUFBQSxFQUNGO0FBQ0Y7QUNqRE8sTUFBTSxvQkFBb0IsTUFBTTtBQUFBLEVBSXJDLFlBQVksT0FBZSxNQUFjLEtBQWE7QUFDcEQsVUFBTSxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxLQUFLLEVBQUU7QUFDaEQsU0FBSyxPQUFPO0FBQ1osU0FBSyxPQUFPO0FBQ1osU0FBSyxNQUFNO0FBQUEsRUFDYjtBQUNGO0FDUk8sTUFBZSxLQUFLO0FBQUE7QUFBQSxFQUl6QixjQUFjO0FBQUEsRUFBRTtBQUVsQjtBQStCTyxNQUFNLHNCQUFzQixLQUFLO0FBQUEsRUFJcEMsWUFBWSxRQUFpQixNQUFZLE1BQWM7QUFDbkQsVUFBQTtBQUNBLFNBQUssU0FBUztBQUNkLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSx1QkFBdUIsSUFBSTtBQUFBLEVBQzlDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxlQUFlLEtBQUs7QUFBQSxFQUk3QixZQUFZLE1BQWEsT0FBYSxNQUFjO0FBQ2hELFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsZ0JBQWdCLElBQUk7QUFBQSxFQUN2QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sZUFBZSxLQUFLO0FBQUEsRUFLN0IsWUFBWSxNQUFZLFVBQWlCLE9BQWEsTUFBYztBQUNoRSxVQUFBO0FBQ0EsU0FBSyxPQUFPO0FBQ1osU0FBSyxXQUFXO0FBQ2hCLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxnQkFBZ0IsSUFBSTtBQUFBLEVBQ3ZDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxhQUFhLEtBQUs7QUFBQSxFQU0zQixZQUFZLFFBQWMsT0FBYyxNQUFjLE1BQWMsV0FBVyxPQUFPO0FBQ2xGLFVBQUE7QUFDQSxTQUFLLFNBQVM7QUFDZCxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFDWixTQUFLLFdBQVc7QUFBQSxFQUNwQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGNBQWMsS0FBSztBQUFBLEVBRzVCLFlBQVksT0FBYSxNQUFjO0FBQ25DLFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsZUFBZSxJQUFJO0FBQUEsRUFDdEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLG1CQUFtQixLQUFLO0FBQUEsRUFHakMsWUFBWSxZQUFvQixNQUFjO0FBQzFDLFVBQUE7QUFDQSxTQUFLLGFBQWE7QUFDbEIsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLG9CQUFvQixJQUFJO0FBQUEsRUFDM0M7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGFBQWEsS0FBSztBQUFBLEVBSzNCLFlBQVksTUFBYSxLQUFZLFVBQWdCLE1BQWM7QUFDL0QsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssTUFBTTtBQUNYLFNBQUssV0FBVztBQUNoQixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLFlBQVksS0FBSztBQUFBLEVBSzFCLFlBQVksUUFBYyxLQUFXLE1BQWlCLE1BQWM7QUFDaEUsVUFBQTtBQUNBLFNBQUssU0FBUztBQUNkLFNBQUssTUFBTTtBQUNYLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxFQUNwQztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0saUJBQWlCLEtBQUs7QUFBQSxFQUcvQixZQUFZLFlBQWtCLE1BQWM7QUFDeEMsVUFBQTtBQUNBLFNBQUssYUFBYTtBQUNsQixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsa0JBQWtCLElBQUk7QUFBQSxFQUN6QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sWUFBWSxLQUFLO0FBQUEsRUFHMUIsWUFBWSxNQUFhLE1BQWM7QUFDbkMsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxFQUNwQztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sZ0JBQWdCLEtBQUs7QUFBQSxFQUs5QixZQUFZLE1BQVksVUFBaUIsT0FBYSxNQUFjO0FBQ2hFLFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLFdBQVc7QUFDaEIsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGlCQUFpQixJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGFBQWEsS0FBSztBQUFBLEVBRzNCLFlBQVksT0FBZSxNQUFjO0FBQ3JDLFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGdCQUFnQixLQUFLO0FBQUEsRUFHOUIsWUFBWSxPQUFZLE1BQWM7QUFDbEMsVUFBQTtBQUNBLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxpQkFBaUIsSUFBSTtBQUFBLEVBQ3hDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxZQUFZLEtBQUs7QUFBQSxFQUcxQixZQUFZLE9BQWEsTUFBYztBQUNuQyxVQUFBO0FBQ0EsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGFBQWEsSUFBSTtBQUFBLEVBQ3BDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSx1QkFBdUIsS0FBSztBQUFBLEVBSXJDLFlBQVksTUFBWSxPQUFhLE1BQWM7QUFDL0MsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSx3QkFBd0IsSUFBSTtBQUFBLEVBQy9DO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxnQkFBZ0IsS0FBSztBQUFBLEVBSTlCLFlBQVksUUFBYyxXQUFtQixNQUFjO0FBQ3ZELFVBQUE7QUFDQSxTQUFLLFNBQVM7QUFDZCxTQUFLLFlBQVk7QUFDakIsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGlCQUFpQixJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7WUFFTyxNQUFNQSxhQUFZLEtBQUs7QUFBQSxFQUsxQixZQUFZLFFBQWMsS0FBVyxPQUFhLE1BQWM7QUFDNUQsVUFBQTtBQUNBLFNBQUssU0FBUztBQUNkLFNBQUssTUFBTTtBQUNYLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxFQUNwQztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0saUJBQWlCLEtBQUs7QUFBQSxFQUkvQixZQUFZLE1BQVksT0FBYSxNQUFjO0FBQy9DLFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsa0JBQWtCLElBQUk7QUFBQSxFQUN6QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sZUFBZSxLQUFLO0FBQUEsRUFHN0IsWUFBWSxPQUFhLE1BQWM7QUFDbkMsVUFBQTtBQUNBLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxnQkFBZ0IsSUFBSTtBQUFBLEVBQ3ZDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxpQkFBaUIsS0FBSztBQUFBLEVBRy9CLFlBQVksT0FBZSxNQUFjO0FBQ3JDLFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsa0JBQWtCLElBQUk7QUFBQSxFQUN6QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sZ0JBQWdCLEtBQUs7QUFBQSxFQUs5QixZQUFZLFdBQWlCLFVBQWdCLFVBQWdCLE1BQWM7QUFDdkUsVUFBQTtBQUNBLFNBQUssWUFBWTtBQUNqQixTQUFLLFdBQVc7QUFDaEIsU0FBSyxXQUFXO0FBQ2hCLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxpQkFBaUIsSUFBSTtBQUFBLEVBQ3hDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxlQUFlLEtBQUs7QUFBQSxFQUc3QixZQUFZLE9BQWEsTUFBYztBQUNuQyxVQUFBO0FBQ0EsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGdCQUFnQixJQUFJO0FBQUEsRUFDdkM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGNBQWMsS0FBSztBQUFBLEVBSTVCLFlBQVksVUFBaUIsT0FBYSxNQUFjO0FBQ3BELFVBQUE7QUFDQSxTQUFLLFdBQVc7QUFDaEIsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGVBQWUsSUFBSTtBQUFBLEVBQ3RDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxpQkFBaUIsS0FBSztBQUFBLEVBRy9CLFlBQVksTUFBYSxNQUFjO0FBQ25DLFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsa0JBQWtCLElBQUk7QUFBQSxFQUN6QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sYUFBYSxLQUFLO0FBQUEsRUFHM0IsWUFBWSxPQUFhLE1BQWM7QUFDbkMsVUFBQTtBQUNBLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxjQUFjLElBQUk7QUFBQSxFQUNyQztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQ2poQk8sSUFBSyw4QkFBQUMsZUFBTDtBQUVMQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsZ0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxpQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxrQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxrQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJ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
