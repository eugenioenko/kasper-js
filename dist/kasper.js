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
  onMount() {
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
    const $imports = (_b = (_a = this.values) == null ? void 0 : _a.constructor) == null ? void 0 : _b.$imports;
    if ($imports && typeof $imports[key] !== "undefined") {
      return $imports[key];
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
  onMount() {
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
    var _a;
    if (!entity || typeof entity !== "object") return;
    let proto = Object.getPrototypeOf(entity);
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        if ((_a = Object.getOwnPropertyDescriptor(proto, key)) == null ? void 0 : _a.get) continue;
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
            const routeScope = new Scope(restoreScope, component);
            component.setRoutes(this.extractRoutes(node.children, void 0, routeScope));
          }
          if (typeof component.onMount === "function") {
            component.onMount();
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
    if (typeof component.onMount === "function") component.onMount();
    const scope = new Scope(null, component);
    scope.set("$instance", component);
    const prev = this.interpreter.scope;
    this.interpreter.scope = scope;
    this.createSiblings(nodes, host);
    this.interpreter.scope = prev;
    if (typeof component.onRender === "function") component.onRender();
  }
  extractRoutes(children, parentGuard, scope) {
    const routes = [];
    const prevScope = scope ? this.interpreter.scope : void 0;
    if (scope) this.interpreter.scope = scope;
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
    if (scope) this.interpreter.scope = prevScope;
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
  if (typeof instance.onMount === "function") {
    instance.onMount();
  }
  transpiler.transpile(nodes, instance, node);
  if (typeof instance.onRender === "function") {
    instance.onRender();
  }
  return instance;
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
  batch,
  computed,
  effect,
  execute,
  navigate,
  signal,
  transpile
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2Vycm9yLnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3JvdXRlci50cyIsIi4uL3NyYy9zaWduYWwudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvdHJhbnNwaWxlci50cyIsIi4uL3NyYy9rYXNwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2lnbmFsIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS05vZGUgfSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIFdhdGNoZXI8VD4gPSAobmV3VmFsdWU6IFQsIG9sZFZhbHVlOiBUKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50QXJncyB7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcbiAgc3RhdGljIHRlbXBsYXRlPzogc3RyaW5nO1xuICBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xuICAkYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAkd2F0Y2hTdG9wczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcbiAgJHJlbmRlcj86ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgaGF1bnQ8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+KTogdm9pZCB7XG4gICAgdGhpcy4kd2F0Y2hTdG9wcy5wdXNoKHNpZy5vbkNoYW5nZShmbikpO1xuICB9XG5cbiAgb25Nb3VudCgpIHt9XG4gIG9uUmVuZGVyKCkge31cbiAgb25DaGFuZ2VzKCkge31cbiAgb25EZXN0cm95KCkge31cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy4kcmVuZGVyPy4oKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBLYXNwZXJFbnRpdHkgPSBDb21wb25lbnQgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50Q2xhc3MgPSB7IG5ldyAoYXJncz86IENvbXBvbmVudEFyZ3MpOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yPzogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU/OiBFbGVtZW50IHwgbnVsbDtcbiAgICBub2Rlcz86IEtOb2RlW107XG4gIH07XG59XG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoYFBhcnNlIEVycm9yICgke2xpbmV9OiR7Y29sfSkgPT4gJHt2YWx1ZX1gKTtcbiAgICB0aGlzLm5hbWUgPSBcIkthc3BlckVycm9yXCI7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJ3Rva2VuJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4cHIge1xuICBwdWJsaWMgcmVzdWx0OiBhbnk7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUjtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEFycm93RnVuY3Rpb24pOiBSO1xuICAgIHZpc2l0QXNzaWduRXhwcihleHByOiBBc3NpZ24pOiBSO1xuICAgIHZpc2l0QmluYXJ5RXhwcihleHByOiBCaW5hcnkpOiBSO1xuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcjogQ2FsbCk6IFI7XG4gICAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRGVidWcpOiBSO1xuICAgIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRGljdGlvbmFyeSk6IFI7XG4gICAgdmlzaXRFYWNoRXhwcihleHByOiBFYWNoKTogUjtcbiAgICB2aXNpdEdldEV4cHIoZXhwcjogR2V0KTogUjtcbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBHcm91cGluZyk6IFI7XG4gICAgdmlzaXRLZXlFeHByKGV4cHI6IEtleSk6IFI7XG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByOiBMb2dpY2FsKTogUjtcbiAgICB2aXNpdExpc3RFeHByKGV4cHI6IExpc3QpOiBSO1xuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogTGl0ZXJhbCk6IFI7XG4gICAgdmlzaXROZXdFeHByKGV4cHI6IE5ldyk6IFI7XG4gICAgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogTnVsbENvYWxlc2NpbmcpOiBSO1xuICAgIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogUG9zdGZpeCk6IFI7XG4gICAgdmlzaXRTZXRFeHByKGV4cHI6IFNldCk6IFI7XG4gICAgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogUGlwZWxpbmUpOiBSO1xuICAgIHZpc2l0U3ByZWFkRXhwcihleHByOiBTcHJlYWQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG4gICAgdmlzaXRWb2lkRXhwcihleHByOiBWb2lkKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEFycm93RnVuY3Rpb24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcGFyYW1zOiBUb2tlbltdO1xuICAgIHB1YmxpYyBib2R5OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBUb2tlbltdLCBib2R5OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXJyb3dGdW5jdGlvbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5BcnJvd0Z1bmN0aW9uJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzaWduIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXNzaWduJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkJpbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2FsbGVlOiBFeHByO1xuICAgIHB1YmxpYyBwYXJlbjogVG9rZW47XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcbiAgICBwdWJsaWMgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHIsIHBhcmVuOiBUb2tlbiwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIsIG9wdGlvbmFsID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IG9wdGlvbmFsO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdENhbGxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQ2FsbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVidWdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGVidWcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHByb3BlcnRpZXM6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGljdGlvbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EaWN0aW9uYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWFjaCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMga2V5OiBUb2tlbjtcbiAgICBwdWJsaWMgaXRlcmFibGU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwga2V5OiBUb2tlbiwgaXRlcmFibGU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVhY2hFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRWFjaCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHR5cGU6IFRva2VuVHlwZSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JvdXBpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdyb3VwaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5LZXknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dpY2FsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TG9naWNhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Mb2dpY2FsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpc3QnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGl0ZXJhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjbGF6ejogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGF6eiA9IGNsYXp6O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE5ld0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OZXcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsQ29hbGVzY2luZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE51bGxDb2FsZXNjaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk51bGxDb2FsZXNjaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9zdGZpeCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQb3N0Zml4RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBvc3RmaXgnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UGlwZWxpbmVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUGlwZWxpbmUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcHJlYWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTcHJlYWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU3ByZWFkJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVtcGxhdGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVtcGxhdGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXJuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogRXhwcjtcbiAgICBwdWJsaWMgdGhlbkV4cHI6IEV4cHI7XG4gICAgcHVibGljIGVsc2VFeHByOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBFeHByLCB0aGVuRXhwcjogRXhwciwgZWxzZUV4cHI6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuRXhwciA9IHRoZW5FeHByO1xuICAgICAgICB0aGlzLmVsc2VFeHByID0gZWxzZUV4cHI7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVybmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZXJuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHlwZW9mIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHlwZW9mRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlR5cGVvZic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJpYWJsZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5WYXJpYWJsZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZvaWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWb2lkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZvaWQnO1xuICB9XG59XG5cbiIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgLy8gUGFyc2VyIFRva2Vuc1xyXG4gIEVvZixcclxuICBQYW5pYyxcclxuXHJcbiAgLy8gU2luZ2xlIENoYXJhY3RlciBUb2tlbnNcclxuICBBbXBlcnNhbmQsXHJcbiAgQXRTaWduLFxyXG4gIENhcmV0LFxyXG4gIENvbW1hLFxyXG4gIERvbGxhcixcclxuICBEb3QsXHJcbiAgSGFzaCxcclxuICBMZWZ0QnJhY2UsXHJcbiAgTGVmdEJyYWNrZXQsXHJcbiAgTGVmdFBhcmVuLFxyXG4gIFBlcmNlbnQsXHJcbiAgUGlwZSxcclxuICBSaWdodEJyYWNlLFxyXG4gIFJpZ2h0QnJhY2tldCxcclxuICBSaWdodFBhcmVuLFxyXG4gIFNlbWljb2xvbixcclxuICBTbGFzaCxcclxuICBTdGFyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnNcclxuICBBcnJvdyxcclxuICBCYW5nLFxyXG4gIEJhbmdFcXVhbCxcclxuICBCYW5nRXF1YWxFcXVhbCxcclxuICBDb2xvbixcclxuICBFcXVhbCxcclxuICBFcXVhbEVxdWFsLFxyXG4gIEVxdWFsRXF1YWxFcXVhbCxcclxuICBHcmVhdGVyLFxyXG4gIEdyZWF0ZXJFcXVhbCxcclxuICBMZXNzLFxyXG4gIExlc3NFcXVhbCxcclxuICBNaW51cyxcclxuICBNaW51c0VxdWFsLFxyXG4gIE1pbnVzTWludXMsXHJcbiAgUGVyY2VudEVxdWFsLFxyXG4gIFBsdXMsXHJcbiAgUGx1c0VxdWFsLFxyXG4gIFBsdXNQbHVzLFxyXG4gIFF1ZXN0aW9uLFxyXG4gIFF1ZXN0aW9uRG90LFxyXG4gIFF1ZXN0aW9uUXVlc3Rpb24sXHJcbiAgU2xhc2hFcXVhbCxcclxuICBTdGFyRXF1YWwsXHJcbiAgRG90RG90LFxyXG4gIERvdERvdERvdCxcclxuICBMZXNzRXF1YWxHcmVhdGVyLFxyXG5cclxuICAvLyBMaXRlcmFsc1xyXG4gIElkZW50aWZpZXIsXHJcbiAgVGVtcGxhdGUsXHJcbiAgU3RyaW5nLFxyXG4gIE51bWJlcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zIChiaXR3aXNlIHNoaWZ0cylcclxuICBMZWZ0U2hpZnQsXHJcbiAgUmlnaHRTaGlmdCxcclxuICBQaXBlbGluZSxcclxuICBUaWxkZSxcclxuXHJcbiAgLy8gS2V5d29yZHNcclxuICBBbmQsXHJcbiAgQ29uc3QsXHJcbiAgRGVidWcsXHJcbiAgRmFsc2UsXHJcbiAgSW4sXHJcbiAgSW5zdGFuY2VvZixcclxuICBOZXcsXHJcbiAgTnVsbCxcclxuICBVbmRlZmluZWQsXHJcbiAgT2YsXHJcbiAgT3IsXHJcbiAgVHJ1ZSxcclxuICBUeXBlb2YsXHJcbiAgVm9pZCxcclxuICBXaXRoLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcclxuICBwdWJsaWMgbGl0ZXJhbDogYW55O1xyXG4gIHB1YmxpYyBsZXhlbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0eXBlOiBUb2tlblR5cGUsXHJcbiAgICBsZXhlbWU6IHN0cmluZyxcclxuICAgIGxpdGVyYWw6IGFueSxcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBUb2tlblR5cGVbdHlwZV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XHJcbiAgICB0aGlzLmxpdGVyYWwgPSBsaXRlcmFsO1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBbKCR7dGhpcy5saW5lfSk6XCIke3RoaXMubGV4ZW1lfVwiXWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlbGZDbG9zaW5nVGFncyA9IFtcclxuICBcImFyZWFcIixcclxuICBcImJhc2VcIixcclxuICBcImJyXCIsXHJcbiAgXCJjb2xcIixcclxuICBcImVtYmVkXCIsXHJcbiAgXCJoclwiLFxyXG4gIFwiaW1nXCIsXHJcbiAgXCJpbnB1dFwiLFxyXG4gIFwibGlua1wiLFxyXG4gIFwibWV0YVwiLFxyXG4gIFwicGFyYW1cIixcclxuICBcInNvdXJjZVwiLFxyXG4gIFwidHJhY2tcIixcclxuICBcIndiclwiLFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW107XG5cbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgZXhwcmVzc2lvbnMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBUb2tlbiB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XG4gIH1cblxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09PSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvcihcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgbWVzc2FnZSArIGAsIHVuZXhwZWN0ZWQgdG9rZW4gXCIke3RoaXMucGVlaygpLmxleGVtZX1cImBcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcih0b2tlbjogVG9rZW4sIG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5TZW1pY29sb24pIHx8IHRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9IHdoaWxlICghdGhpcy5lb2YoKSk7XG4gIH1cblxuICBwdWJsaWMgZm9yZWFjaCh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHIge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgICBjb25zdCBuYW1lID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxuICAgICk7XG5cbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLldpdGgpKSB7XG4gICAgICBrZXkgPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgICBgRXhwZWN0ZWQgYSBcImtleVwiIGlkZW50aWZpZXIgYWZ0ZXIgXCJ3aXRoXCIga2V5d29yZCBpbiBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLk9mLFxuICAgICAgYEV4cGVjdGVkIFwib2ZcIiBrZXl3b3JkIGluc2lkZSBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICApO1xuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRWFjaChuYW1lLCBrZXksIGl0ZXJhYmxlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHByZXNzaW9uKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHtcbiAgICAgIC8vIGNvbnN1bWUgYWxsIHNlbWljb2xvbnNcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHsgLyogY29uc3VtZSBzZW1pY29sb25zICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIGFzc2lnbm1lbnQoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnBpcGVsaW5lKCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKG9wZXJhdG9yLCBgSW52YWxpZCBsLXZhbHVlLCBpcyBub3QgYW4gYXNzaWduaW5nIHRhcmdldC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHBpcGVsaW5lKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGlwZWxpbmUpKSB7XG4gICAgICBjb25zdCByaWdodCA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLlBpcGVsaW5lKGV4cHIsIHJpZ2h0LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5Db2xvbiwgYEV4cGVjdGVkIFwiOlwiIGFmdGVyIHRlcm5hcnkgPyBleHByZXNzaW9uYCk7XG4gICAgICBjb25zdCBlbHNlRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBudWxsQ29hbGVzY2luZygpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgcmlnaHRFeHByOiBFeHByLkV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbE9yKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuT3IpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5BbmQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGVxdWFsaXR5KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICB3aGlsZSAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5JbnN0YW5jZW9mLFxuICAgICAgICBUb2tlblR5cGUuSW4sXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgc2hpZnQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0U2hpZnQsIFRva2VuVHlwZS5SaWdodFNoaWZ0KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51cywgVG9rZW5UeXBlLlBsdXMpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtb2R1bHVzKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aXBsaWNhdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TbGFzaCwgVG9rZW5UeXBlLlN0YXIpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UeXBlb2YpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UeXBlb2YodmFsdWUsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgIFRva2VuVHlwZS5UaWxkZSxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5wb3N0Zml4KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucG9zdGZpeCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3N0Zml4KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuY2FsbCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIDEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgLTEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZDogYm9vbGVhbjtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIGZhbHNlKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90LCBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZG90R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjb25zdW1lZCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRva2VuQXQob2Zmc2V0OiBudW1iZXIpOiBUb2tlblR5cGUge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgKyBvZmZzZXRdPy50eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Fycm93UGFyYW1zKCk6IGJvb2xlYW4ge1xuICAgIGxldCBpID0gdGhpcy5jdXJyZW50ICsgMTsgLy8gc2tpcCAoXG4gICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgIH1cbiAgICB3aGlsZSAoaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuSWRlbnRpZmllcikgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5Db21tYSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGZpbmlzaENhbGwoY2FsbGVlOiBFeHByLkV4cHIsIHBhcmVuOiBUb2tlbiwgb3B0aW9uYWw6IGJvb2xlYW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICAgIGFyZ3MucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB9XG4gICAgY29uc3QgY2xvc2VQYXJlbiA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGFyZ3VtZW50c2ApO1xuICAgIHJldHVybiBuZXcgRXhwci5DYWxsKGNhbGxlZSwgY2xvc2VQYXJlbiwgYXJncywgY2xvc2VQYXJlbi5saW5lLCBvcHRpb25hbCk7XG4gIH1cblxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbmFtZTogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXG4gICAgKTtcbiAgICBjb25zdCBrZXk6IEV4cHIuS2V5ID0gbmV3IEV4cHIuS2V5KG5hbWUsIG5hbWUubGluZSk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGxldCBrZXk6IEV4cHIuRXhwciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIGtleSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYW4gaW5kZXhgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgb3BlcmF0b3IubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHByaW1hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh1bmRlZmluZWQsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlbXBsYXRlKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5JZGVudGlmaWVyKSAmJiB0aGlzLnRva2VuQXQoMSkgPT09IFRva2VuVHlwZS5BcnJvdykge1xuICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lID0+XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihbcGFyYW1dLCBib2R5LCBwYXJhbS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLklkZW50aWZpZXIpKSB7XG4gICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZhcmlhYmxlKGlkZW50aWZpZXIsIGlkZW50aWZpZXIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5MZWZ0UGFyZW4pICYmIHRoaXMuaXNBcnJvd1BhcmFtcygpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSAoXG4gICAgICBjb25zdCBwYXJhbXM6IFRva2VuW10gPSBbXTtcbiAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHBhcmFtcy5wdXNoKHRoaXMuY29uc3VtZShUb2tlblR5cGUuSWRlbnRpZmllciwgXCJFeHBlY3RlZCBwYXJhbWV0ZXIgbmFtZVwiKSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcImApO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5BcnJvdywgYEV4cGVjdGVkIFwiPT5cImApO1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24ocGFyYW1zLCBib2R5LCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGV4cHJlc3Npb25gKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXN0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Wb2lkKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVm9pZChleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5EZWJ1ZykpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRlYnVnKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG5cbiAgICB0aHJvdyB0aGlzLmVycm9yKFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxuICAgICk7XG4gICAgLy8gdW5yZWFjaGVhYmxlIGNvZGVcbiAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCAwKTtcbiAgfVxuXG4gIHB1YmxpYyBkaWN0aW9uYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbGVmdEJyYWNlID0gdGhpcy5wcmV2aW91cygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgY29uc3QgcHJvcGVydGllczogRXhwci5FeHByW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIGBTdHJpbmcsIE51bWJlciBvciBJZGVudGlmaWVyIGV4cGVjdGVkIGFzIGEgS2V5IG9mIERpY3Rpb25hcnkgeywgdW5leHBlY3RlZCB0b2tlbiAke1xuICAgICAgICAgICAgdGhpcy5wZWVrKCkubGV4ZW1lXG4gICAgICAgICAgfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgdmFsdWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gIC8qKiBzY3JpcHRzIHNvdXJjZSBjb2RlICovXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xuICBwdWJsaWMgdG9rZW5zOiBUb2tlbltdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmdldFRva2VuKCk7XG4gICAgfVxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xuICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPj0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XG4gICAgICB0aGlzLmxpbmUrKztcbiAgICAgIHRoaXMuY29sID0gMDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgdGhpcy5jb2wrKztcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHRva2VuVHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lLCB0aGlzLmNvbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaChleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCArIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVDb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgY29tbWVudCwgZXhwZWN0aW5nIGNsb3NpbmcgXCIqL1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7cXVvdGV9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAvLyBUcmltIHRoZSBzdXJyb3VuZGluZyBxdW90ZXMuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XG4gICAgLy8gZ2V0cyBpbnRlZ2VyIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLlwiICYmIFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGV4cG9uZW50XG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCItXCIgfHwgdGhpcy5wZWVrKCkgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKSBhcyBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlO1xuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZVtjYXBpdGFsaXplZF0sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSBcIihcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIsXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNvbW1hLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiO1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TZW1pY29sb24sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlRpbGRlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSGFzaCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5Db2xvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TdGFyRXF1YWwgOiBUb2tlblR5cGUuU3RhcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5QZXJjZW50RXF1YWwgOiBUb2tlblR5cGUuUGVyY2VudCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwifFwiKSA/IFRva2VuVHlwZS5PciA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUGlwZWxpbmUgOlxuICAgICAgICAgIFRva2VuVHlwZS5QaXBlLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCImXCIpID8gVG9rZW5UeXBlLkFuZCA6IFRva2VuVHlwZS5BbXBlcnNhbmQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUmlnaHRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuR3JlYXRlckVxdWFsIDogVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwgOiBUb2tlblR5cGUuQmFuZ0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5CYW5nLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiP1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI/XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCIuXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvbkRvdFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUXVlc3Rpb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwgOiBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNQbHVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlBsdXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIi1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI8XCIpID8gVG9rZW5UeXBlLkxlZnRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj5cIilcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxuICAgICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90LCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xuICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCIqXCIpKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYCdgOlxuICAgICAgY2FzZSBgXCJgOlxuICAgICAgY2FzZSBcImBcIjpcbiAgICAgICAgdGhpcy5zdHJpbmcoY2hhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gaWdub3JlIGNhc2VzXG4gICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNvbXBsZXggY2FzZXNcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc0FscGhhKGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7Y2hhcn0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNjYW4gRXJyb3IgKCR7dGhpcy5saW5lfToke3RoaXMuY29sfSkgPT4gJHttZXNzYWdlfWApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0ICRpbXBvcnRzID0gKHRoaXMudmFsdWVzPy5jb25zdHJ1Y3RvciBhcyBhbnkpPy4kaW1wb3J0cztcbiAgICBpZiAoJGltcG9ydHMgJiYgdHlwZW9mICRpbXBvcnRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiAkaW1wb3J0c1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5IGFzIGtleW9mIHR5cGVvZiB3aW5kb3ddO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciBhcyBQYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEludGVycHJldGVyIGltcGxlbWVudHMgRXhwci5FeHByVmlzaXRvcjxhbnk+IHtcbiAgcHVibGljIHNjb3BlID0gbmV3IFNjb3BlKCk7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG4gIHB1YmxpYyBldmFsdWF0ZShleHByOiBFeHByLkV4cHIpOiBhbnkge1xuICAgIHJldHVybiAoZXhwci5yZXN1bHQgPSBleHByLmFjY2VwdCh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogRXhwci5QaXBlbGluZSk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuQ2FsbCkge1xuICAgICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0LmNhbGxlZSk7XG4gICAgICBjb25zdCBhcmdzID0gW3ZhbHVlXTtcbiAgICAgIGZvciAoY29uc3QgYXJnIG9mIGV4cHIucmlnaHQuYXJncykge1xuICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJnIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXhwci5yaWdodC5jYWxsZWUgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIucmlnaHQuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjb25zdCBmbiA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgcmV0dXJuIGZuKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEV4cHIuQXJyb3dGdW5jdGlvbik6IGFueSB7XG4gICAgY29uc3QgY2FwdHVyZWRTY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuc2NvcGU7XG4gICAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlKGNhcHR1cmVkU2NvcGUpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHByLnBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnBhcmFtc1tpXS5sZXhlbWUsIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5ib2R5KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSdW50aW1lIEVycm9yID0+ICR7bWVzc2FnZX1gKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBFeHByLlZhcmlhYmxlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5zY29wZS5nZXQoZXhwci5uYW1lLmxleGVtZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEV4cHIuQXNzaWduKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgdGhpcy5zY29wZS5zZXQoZXhwci5uYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEtleUV4cHIoZXhwcjogRXhwci5LZXkpOiBhbnkge1xuICAgIHJldHVybiBleHByLm5hbWUubGl0ZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdldEV4cHIoZXhwcjogRXhwci5HZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGlmICghZW50aXR5ICYmIGV4cHIudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5W2tleV07XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTZXRFeHByKGV4cHI6IEV4cHIuU2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgZW50aXR5W2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQb3N0Zml4RXhwcihleHByOiBFeHByLlBvc3RmaXgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSArIGV4cHIuaW5jcmVtZW50O1xuXG4gICAgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5lbnRpdHkubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgZXhwci5lbnRpdHkuZW50aXR5LFxuICAgICAgICBleHByLmVudGl0eS5rZXksXG4gICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgIGV4cHIubGluZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBwb3N0Zml4IG9wZXJhdGlvbjogJHtleHByLmVudGl0eX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXN0RXhwcihleHByOiBFeHByLkxpc3QpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwci52YWx1ZSkge1xuICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICB2YWx1ZXMucHVzaCguLi50aGlzLmV2YWx1YXRlKChleHByZXNzaW9uIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTcHJlYWRFeHByKGV4cHI6IEV4cHIuU3ByZWFkKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluc3RhbmNlb2Y6XG4gICAgICAgIHJldHVybiBsZWZ0IGluc3RhbmNlb2YgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZWZ0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0IDw8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUmlnaHRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKFwiVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgXCIgKyBleHByLm9wZXJhdG9yKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogRXhwci5Mb2dpY2FsKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLk9yKSB7XG4gICAgICBpZiAobGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogRXhwci5UZXJuYXJ5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmNvbmRpdGlvbilcbiAgICAgID8gdGhpcy5ldmFsdWF0ZShleHByLnRoZW5FeHByKVxuICAgICAgOiB0aGlzLmV2YWx1YXRlKGV4cHIuZWxzZUV4cHIpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IEV4cHIuTnVsbENvYWxlc2NpbmcpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgaWYgKGxlZnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuVGlsZGU6XG4gICAgICAgIHJldHVybiB+cmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogICR7ZXhwci5yaWdodH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICcgKyBleHByLm9wZXJhdG9yYCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmIChjYWxsZWUgPT0gbnVsbCAmJiBleHByLm9wdGlvbmFsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoYCR7Y2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmApO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmd1bWVudCBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb24g4oCUIHByZXNlcnZlIGB0aGlzYCBmb3IgbWV0aG9kIGNhbGxzXG4gICAgaWYgKGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TmV3RXhwcihleHByOiBFeHByLk5ldyk6IGFueSB7XG4gICAgY29uc3QgbmV3Q2FsbCA9IGV4cHIuY2xhenogYXMgRXhwci5DYWxsO1xuICAgIC8vIGludGVybmFsIGNsYXNzIGRlZmluaXRpb24gaW5zdGFuY2VcbiAgICBjb25zdCBjbGF6eiA9IHRoaXMuZXZhbHVhdGUobmV3Q2FsbC5jYWxsZWUpO1xuXG4gICAgaWYgKHR5cGVvZiBjbGF6eiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKFxuICAgICAgICBgJyR7Y2xhenp9JyBpcyBub3QgYSBjbGFzcy4gJ25ldycgc3RhdGVtZW50IG11c3QgYmUgdXNlZCB3aXRoIGNsYXNzZXMuYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmdzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJnIG9mIG5ld0NhbGwuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJnKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgY2xhenooLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBFeHByLkRpY3Rpb25hcnkpOiBhbnkge1xuICAgIGNvbnN0IGRpY3Q6IGFueSA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgZXhwci5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAocHJvcGVydHkgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGRpY3QsIHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLmtleSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLnZhbHVlKTtcbiAgICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VHlwZW9mRXhwcihleHByOiBFeHByLlR5cGVvZik6IGFueSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWFjaEV4cHIoZXhwcjogRXhwci5FYWNoKTogYW55IHtcbiAgICByZXR1cm4gW1xuICAgICAgZXhwci5uYW1lLmxleGVtZSxcbiAgICAgIGV4cHIua2V5ID8gZXhwci5rZXkubGV4ZW1lIDogbnVsbCxcbiAgICAgIHRoaXMuZXZhbHVhdGUoZXhwci5pdGVyYWJsZSksXG4gICAgXTtcbiAgfVxuXG4gIHZpc2l0Vm9pZEV4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29sICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHtlb2ZFcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKFwiJ1wiKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZygnXCInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChcInt7XCIpKSB7IGRlcHRoKys7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPiAwICYmIHRoaXMubWF0Y2goXCJ9fVwiKSkgeyBkZXB0aC0tOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmIHRoaXMucGVlayhcIjxcIikpIHsgYnJlYWs7IH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCFyYXcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0aGlzLmRlY29kZUVudGl0aWVzKHJhdyksIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVFbnRpdGllcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiXFx1MDBhMFwiKVxuICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgIC5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcbiAgICAgIC5yZXBsYWNlKC8mYXBvczsvZywgXCInXCIpXG4gICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpOyAvLyBtdXN0IGJlIGxhc3QgdG8gYXZvaWQgZG91YmxlLWRlY29kaW5nXG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENsYXNzIH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm91dGVDb25maWcge1xuICBwYXRoOiBzdHJpbmc7XG4gIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gIGd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBcIlwiLCBwYXRoKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFBvcFN0YXRlRXZlbnQoXCJwb3BzdGF0ZVwiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaFBhdGgocGF0dGVybjogc3RyaW5nLCBwYXRobmFtZTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICBpZiAocGF0dGVybiA9PT0gXCIqXCIpIHJldHVybiB7fTtcbiAgY29uc3QgcGF0dGVyblBhcnRzID0gcGF0dGVybi5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBwYXRoUGFydHMgPSBwYXRobmFtZS5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAocGF0dGVyblBhcnRzLmxlbmd0aCAhPT0gcGF0aFBhcnRzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm5QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwYXR0ZXJuUGFydHNbaV0uc3RhcnRzV2l0aChcIjpcIikpIHtcbiAgICAgIHBhcmFtc1twYXR0ZXJuUGFydHNbaV0uc2xpY2UoMSldID0gcGF0aFBhcnRzW2ldO1xuICAgIH0gZWxzZSBpZiAocGF0dGVyblBhcnRzW2ldICE9PSBwYXRoUGFydHNbaV0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgY2xhc3MgUm91dGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcHJpdmF0ZSByb3V0ZXM6IFJvdXRlQ29uZmlnW10gPSBbXTtcblxuICBzZXRSb3V0ZXMocm91dGVzOiBSb3V0ZUNvbmZpZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXM7XG4gIH1cblxuICBvbk1vdW50KCk6IHZvaWQge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgKCkgPT4gdGhpcy5fbmF2aWdhdGUoKSwge1xuICAgICAgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgIH0pO1xuICAgIHRoaXMuX25hdmlnYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9uYXZpZ2F0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHRoaXMucm91dGVzKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBtYXRjaFBhdGgocm91dGUucGF0aCwgcGF0aG5hbWUpO1xuICAgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBpZiAocm91dGUuZ3VhcmQpIHtcbiAgICAgICAgY29uc3QgYWxsb3dlZCA9IGF3YWl0IHJvdXRlLmd1YXJkKCk7XG4gICAgICAgIGlmICghYWxsb3dlZCkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fbW91bnQocm91dGUuY29tcG9uZW50LCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX21vdW50KENvbXBvbmVudENsYXNzOiBDb21wb25lbnRDbGFzcywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMucmVmIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICghZWxlbWVudCB8fCAhdGhpcy50cmFuc3BpbGVyKSByZXR1cm47XG4gICAgdGhpcy50cmFuc3BpbGVyLm1vdW50Q29tcG9uZW50KENvbXBvbmVudENsYXNzLCBlbGVtZW50LCBwYXJhbXMpO1xuICB9XG59XG4iLCJ0eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxubGV0IGFjdGl2ZUVmZmVjdDogeyBmbjogTGlzdGVuZXI7IGRlcHM6IFNldDxhbnk+IH0gfCBudWxsID0gbnVsbDtcbmNvbnN0IGVmZmVjdFN0YWNrOiBhbnlbXSA9IFtdO1xuXG5sZXQgYmF0Y2hpbmcgPSBmYWxzZTtcbmNvbnN0IHBlbmRpbmdTdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG5jb25zdCBwZW5kaW5nV2F0Y2hlcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbnR5cGUgV2F0Y2hlcjxUPiA9IChuZXdWYWx1ZTogVCwgb2xkVmFsdWU6IFQpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIF92YWx1ZTogVDtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG4gIHByaXZhdGUgd2F0Y2hlcnMgPSBuZXcgU2V0PFdhdGNoZXI8VD4+KCk7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZhbHVlOiBUKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5hZGQoYWN0aXZlRWZmZWN0LmZuKTtcbiAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLmFkZCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl92YWx1ZTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBpZiAoYmF0Y2hpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpYmVycykgcGVuZGluZ1N1YnNjcmliZXJzLmFkZChzdWIpO1xuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykgcGVuZGluZ1dhdGNoZXJzLnB1c2goKCkgPT4gd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycykpIHtcbiAgICAgICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSB7XG4gICAgICAgICAgdHJ5IHsgd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2UoZm46IFdhdGNoZXI8VD4pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lcikge1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25hbDxUPihpbml0aWFsVmFsdWU6IFQpOiBTaWduYWw8VD4ge1xuICByZXR1cm4gbmV3IFNpZ25hbChpbml0aWFsVmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmF0Y2goZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgYmF0Y2hpbmcgPSB0cnVlO1xuICB0cnkge1xuICAgIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgYmF0Y2hpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbShwZW5kaW5nU3Vic2NyaWJlcnMpO1xuICAgIHBlbmRpbmdTdWJzY3JpYmVycy5jbGVhcigpO1xuICAgIGNvbnN0IHdhdGNoZXJzID0gcGVuZGluZ1dhdGNoZXJzLnNwbGljZSgwKTtcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiBzdWJzKSB7XG4gICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2Ygd2F0Y2hlcnMpIHtcbiAgICAgIHRyeSB7IHdhdGNoZXIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgY29uc3QgcyA9IHNpZ25hbDxUPih1bmRlZmluZWQgYXMgYW55KTtcbiAgZWZmZWN0KCgpID0+IHtcbiAgICBzLnZhbHVlID0gZm4oKTtcbiAgfSk7XG4gIHJldHVybiBzO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJvdW5kYXJ5IHtcbiAgcHJpdmF0ZSBzdGFydDogQ29tbWVudDtcbiAgcHJpdmF0ZSBlbmQ6IENvbW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBOb2RlLCBsYWJlbDogc3RyaW5nID0gXCJib3VuZGFyeVwiKSB7XG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LXN0YXJ0YCk7XG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1lbmRgKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRDbGFzcywgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZUNvbmZpZyB9IGZyb20gXCIuL3JvdXRlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IGVmZmVjdCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgQm91bmRhcnkgfSBmcm9tIFwiLi9ib3VuZGFyeVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcigpO1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiB7IHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSB9KSB7XG4gICAgdGhpcy5yZWdpc3RyeVtcInJvdXRlclwiXSA9IHsgY29tcG9uZW50OiBSb3V0ZXIsIG5vZGVzOiBbXSB9O1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuO1xuICAgIGlmIChvcHRpb25zLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0geyAuLi50aGlzLnJlZ2lzdHJ5LCAuLi5vcHRpb25zLnJlZ2lzdHJ5IH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGtleSk/LmdldCkgY29udGludWU7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgZW50aXR5W2tleV0gPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgIGtleSAhPT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlbnRpdHksIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW50aXR5W2tleV0gPSBlbnRpdHlba2V5XS5iaW5kKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGVzIGFuIGVmZmVjdCB0aGF0IHJlc3RvcmVzIHRoZSBjdXJyZW50IHNjb3BlIG9uIGV2ZXJ5IHJlLXJ1bixcbiAgLy8gc28gZWZmZWN0cyBzZXQgdXAgaW5zaWRlIEBlYWNoIGFsd2F5cyBldmFsdWF0ZSBpbiB0aGVpciBpdGVtIHNjb3BlLlxuICBwcml2YXRlIHNjb3BlZEVmZmVjdChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0WzBdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRyYW5zcGlsZShcbiAgICBub2RlczogS05vZGUuS05vZGVbXSxcbiAgICBlbnRpdHk6IGFueSxcbiAgICBjb250YWluZXI6IEVsZW1lbnRcbiAgKTogTm9kZSB7XG4gICAgdGhpcy5kZXN0cm95KGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuaW5pdChlbnRpdHkpO1xuICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGNvbnRhaW5lcik7XG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVsZW1lbnRLTm9kZShub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXh0S05vZGUobm9kZTogS05vZGUuVGV4dCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihlLm1lc3NhZ2UgfHwgYCR7ZX1gLCBcInRleHQgbm9kZVwiKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYXR0ci52YWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGF0dHIsIHN0b3ApO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChyZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja0VmZmVjdCh0YXJnZXQ6IGFueSwgc3RvcDogKCkgPT4gdm9pZCkge1xuICAgIGlmICghdGFyZ2V0LiRrYXNwZXJFZmZlY3RzKSB0YXJnZXQuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB0YXJnZXQuJGthc3BlckVmZmVjdHMucHVzaChzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEF0dHIoXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcbiAgICBuYW1lOiBzdHJpbmdbXVxuICApOiBLTm9kZS5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuYXR0cmlidXRlcyB8fCAhbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmliID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+XG4gICAgICBuYW1lLmluY2x1ZGVzKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZSlcbiAgICApO1xuICAgIGlmIChhdHRyaWIpIHtcbiAgICAgIHJldHVybiBhdHRyaWIgYXMgS05vZGUuQXR0cmlidXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9JZihleHByZXNzaW9uczogSWZFbHNlTm9kZVtdLCBwYXJlbnQ6IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiaWZcIik7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgIGJvdW5kYXJ5LmNsZWFyKCk7XG5cbiAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvbnNbMF1bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICBpZiAoJGlmKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uc1swXVswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMuc2xpY2UoMSwgZXhwcmVzc2lvbnMubGVuZ3RoKSkge1xuICAgICAgICBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlaWZcIl0pKSB7XG4gICAgICAgICAgY29uc3QgJGVsc2VpZiA9IHRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvblsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICBpZiAoJGVsc2VpZikge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlXCJdKSkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChleHByZXNzaW9uWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuICAgIGlmIChrZXlBdHRyKSB7XG4gICAgICB0aGlzLmRvRWFjaEtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCwga2V5QXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9FYWNoVW5rZXllZChlYWNoLCBub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoVW5rZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG5cbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChrZXkpIHNjb3BlVmFsdWVzW2tleV0gPSBpbmRleDtcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgIGluZGV4ICs9IDE7XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICB9KTtcblxuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hLZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSwga2V5QXR0cjogS05vZGUuQXR0cmlidXRlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgY29uc3Qga2V5ZWROb2RlcyA9IG5ldyBNYXA8YW55LCBOb2RlPigpO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBpbmRleEtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuXG4gICAgICAvLyBDb21wdXRlIG5ldyBpdGVtcyBhbmQgdGhlaXIga2V5c1xuICAgICAgY29uc3QgbmV3SXRlbXM6IEFycmF5PHsgaXRlbTogYW55OyBpZHg6IG51bWJlcjsga2V5OiBhbnkgfT4gPSBbXTtcbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG4gICAgICAgIG5ld0l0ZW1zLnB1c2goeyBpdGVtOiBpdGVtLCBpZHg6IGluZGV4LCBrZXk6IGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgY29uc3QgbmV3S2V5U2V0ID0gbmV3IFNldChuZXdJdGVtcy5tYXAoKGkpID0+IGkua2V5KSk7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRvbU5vZGVdIG9mIGtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICB0aGlzLmRlc3Ryb3lOb2RlKGRvbU5vZGUpO1xuICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICBmb3IgKGNvbnN0IHsgaXRlbSwgaWR4LCBrZXkgfSBvZiBuZXdJdGVtcykge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuXG4gICAgICAgIGlmIChrZXllZE5vZGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGtleWVkTm9kZXMuZ2V0KGtleSkhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgaWYgKGNyZWF0ZWQpIGtleWVkTm9kZXMuc2V0KGtleSwgY3JlYXRlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9XaGlsZSgkd2hpbGU6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcIndoaWxlXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUpO1xuICAgICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIC8vIGV4ZWN1dGVzIGluaXRpYWxpemF0aW9uIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gIHByaXZhdGUgZG9MZXQoaW5pdDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGVhY2hcIl0pO1xuICAgICAgICBpZiAoJGVhY2gpIHtcbiAgICAgICAgICB0aGlzLmRvRWFjaCgkZWFjaCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAaWZcIl0pO1xuICAgICAgICBpZiAoJGlmKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbbm9kZSBhcyBLTm9kZS5FbGVtZW50LCAkaWZdXTtcblxuICAgICAgICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gdGhpcy5maW5kQXR0cihub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBbXG4gICAgICAgICAgICAgIFwiQGVsc2VcIixcbiAgICAgICAgICAgICAgXCJAZWxzZWlmXCIsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICR3aGlsZSA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAd2hpbGVcIl0pO1xuICAgICAgICBpZiAoJHdoaWxlKSB7XG4gICAgICAgICAgdGhpcy5kb1doaWxlKCR3aGlsZSwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgdGhpcy5kb0xldCgkbGV0LCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJzbG90XCIpIHtcbiAgICAgICAgY29uc3QgbmFtZUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBuYW1lXCJdKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVBdHRyID8gbmFtZUF0dHIudmFsdWUgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgY29uc3Qgc2xvdHMgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRzbG90c1wiKTtcbiAgICAgICAgaWYgKHNsb3RzICYmIHNsb3RzW25hbWVdKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhzbG90c1tuYW1lXSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1ZvaWQgPSBub2RlLm5hbWUgPT09IFwidm9pZFwiO1xuICAgICAgY29uc3QgaXNDb21wb25lbnQgPSAhIXRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBpc1ZvaWQgPyBwYXJlbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSk7XG4gICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCBzY29wZVxuICAgICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSB7fTtcbiAgICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBjaGlsZHJlbiBmb3Igc2xvdHNcbiAgICAgICAgY29uc3Qgc2xvdHM6IFJlY29yZDxzdHJpbmcsIEtOb2RlLktOb2RlW10+ID0geyBkZWZhdWx0OiBbXSB9O1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHNsb3RBdHRyID0gdGhpcy5maW5kQXR0cihjaGlsZCBhcyBLTm9kZS5FbGVtZW50LCBbXCJAc2xvdFwiXSk7XG4gICAgICAgICAgICBpZiAoc2xvdEF0dHIpIHtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNsb3RBdHRyLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoIXNsb3RzW25hbWVdKSBzbG90c1tuYW1lXSA9IFtdO1xuICAgICAgICAgICAgICBzbG90c1tuYW1lXS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsb3RzLmRlZmF1bHQucHVzaChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb21wb25lbnQgPSBuZXcgdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLmNvbXBvbmVudCh7XG4gICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgcmVmOiBlbGVtZW50LFxuICAgICAgICAgICAgdHJhbnNwaWxlcjogdGhpcyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE5vZGVzID0gdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLm5vZGVzITtcbiAgICAgICAgICBjb21wb25lbnQuJHJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICBjb21wb25lbnQuJHNsb3RzID0gc2xvdHM7XG4gICAgICAgICAgICBjb25zdCBwcmV2U2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhjb21wb25lbnROb2RlcywgZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChub2RlLm5hbWUgPT09IFwicm91dGVyXCIgJiYgY29tcG9uZW50IGluc3RhbmNlb2YgUm91dGVyKSB7XG4gICAgICAgICAgICBjb25zdCByb3V0ZVNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXRSb3V0ZXModGhpcy5leHRyYWN0Um91dGVzKG5vZGUuY2hpbGRyZW4sIHVuZGVmaW5lZCwgcm91dGVTY29wZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uTW91bnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXhwb3NlIHNsb3RzIGluIGNvbXBvbmVudCBzY29wZVxuICAgICAgICBjb21wb25lbnQuJHNsb3RzID0gc2xvdHM7XG5cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZHJlbiBvZiB0aGUgY29tcG9uZW50XG4gICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3ModGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLm5vZGVzISwgZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudCAmJiB0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVm9pZCkge1xuICAgICAgICAvLyBldmVudCBiaW5kaW5nXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQgYXMgS05vZGUuQXR0cmlidXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZ3VsYXIgYXR0cmlidXRlcyAocHJvY2Vzc2VkIGZpcnN0KVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcihcbiAgICAgICAgICAoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNob3J0aGFuZCBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgc2Vjb25kLCBhbGxvd3MgbWVyZ2luZylcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kQXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBuYW1lLnN0YXJ0c1dpdGgoXCJAXCIpICYmXG4gICAgICAgICAgICAhW1wiQGlmXCIsIFwiQGVsc2VpZlwiLCBcIkBlbHNlXCIsIFwiQGVhY2hcIiwgXCJAd2hpbGVcIiwgXCJAbGV0XCIsIFwiQGtleVwiLCBcIkByZWZcIl0uaW5jbHVkZXMoXG4gICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2Ygc2hvcnRoYW5kQXR0cmlidXRlcykge1xuICAgICAgICAgIGNvbnN0IHJlYWxOYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0RHluYW1pY1ZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBzdGF0aWNDbGFzcyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IHN0YXRpY0NsYXNzLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiBjICE9PSBsYXN0RHluYW1pY1ZhbHVlICYmIGMgIT09IFwiXCIpXG4gICAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGN1cnJlbnRDbGFzc2VzID8gYCR7Y3VycmVudENsYXNzZXN9ICR7dmFsdWV9YCA6IHZhbHVlO1xuICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICBsYXN0RHluYW1pY1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSAhPT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkucmVtb3ZlQXR0cmlidXRlKHJlYWxOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBleGlzdGluZyAmJiAhZXhpc3RpbmcuaW5jbHVkZXModmFsdWUpXG4gICAgICAgICAgICAgICAgICAgID8gYCR7ZXhpc3RpbmcuZW5kc1dpdGgoXCI7XCIpID8gZXhpc3RpbmcgOiBleGlzdGluZyArIFwiO1wifSAke3ZhbHVlfWBcbiAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmVudCAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZWZBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAcmVmXCJdKTtcbiAgICAgIGlmIChyZWZBdHRyICYmICFpc1ZvaWQpIHtcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSByZWZBdHRyLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgaW5zdGFuY2VbcHJvcE5hbWVdID0gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChwcm9wTmFtZSwgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUuc2VsZikge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlLmNoaWxkcmVuLCBlbGVtZW50KTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG5cbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihlLm1lc3NhZ2UgfHwgYCR7ZX1gLCBub2RlLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzOiBLTm9kZS5BdHRyaWJ1dGVbXSk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgY29uc3Qga2V5ID0gYXJnLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmV4ZWN1dGUoYXJnLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBOb2RlLCBhdHRyOiBLTm9kZS5BdHRyaWJ1dGUpOiB2b2lkIHtcbiAgICBjb25zdCBbZXZlbnROYW1lLCAuLi5tb2RpZmllcnNdID0gYXR0ci5uYW1lLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0ge307XG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gICAgfVxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvbmNlXCIpKSAgICBvcHRpb25zLm9uY2UgICAgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKSBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKSBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzdG9wXCIpKSAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxpc3RlbmVyU2NvcGUuc2V0KFwiJGV2ZW50XCIsIGV2ZW50KTtcbiAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBsaXN0ZW5lclNjb3BlKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xce1xcey4rXFx9XFx9L21zO1xuICAgIGlmIChyZWdleC50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZywgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSBgJHt0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pfWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lOb2RlKG5vZGU6IGFueSk6IHZvaWQge1xuICAgIC8vIDEuIENsZWFudXAgY29tcG9uZW50IGluc3RhbmNlXG4gICAgaWYgKG5vZGUuJGthc3Blckluc3RhbmNlKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5vZGUuJGthc3Blckluc3RhbmNlO1xuICAgICAgaWYgKGluc3RhbmNlLm9uRGVzdHJveSkgaW5zdGFuY2Uub25EZXN0cm95KCk7XG4gICAgICBpZiAoaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5hYm9ydCgpO1xuICAgICAgaWYgKGluc3RhbmNlLiR3YXRjaFN0b3BzKSBpbnN0YW5jZS4kd2F0Y2hTdG9wcy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgIH1cblxuICAgIC8vIDIuIENsZWFudXAgZWZmZWN0cyBhdHRhY2hlZCB0byB0aGUgbm9kZVxuICAgIGlmIChub2RlLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgfVxuXG4gICAgLy8gMy4gQ2xlYW51cCBlZmZlY3RzIG9uIGF0dHJpYnV0ZXNcbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBhdHRyID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBpZiAoYXR0ci4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA0LiBSZWN1cnNlXG4gICAgbm9kZS5jaGlsZE5vZGVzPy5mb3JFYWNoKChjaGlsZDogYW55KSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveShjb250YWluZXI6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIG1vdW50Q29tcG9uZW50KENvbXBvbmVudENsYXNzOiBDb21wb25lbnRDbGFzcywgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gKENvbXBvbmVudENsYXNzIGFzIGFueSkudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgbm9kZXMgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKS5wYXJzZSh0ZW1wbGF0ZSk7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhvc3QpO1xuXG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudENsYXNzKHsgYXJnczogeyBwYXJhbXM6IHBhcmFtcyB9LCByZWY6IGhvc3QsIHRyYW5zcGlsZXI6IHRoaXMgfSk7XG4gICAgdGhpcy5iaW5kTWV0aG9kcyhjb21wb25lbnQpO1xuICAgIChob3N0IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gY29tcG9uZW50O1xuXG4gICAgY29uc3QgY29tcG9uZW50Tm9kZXMgPSBub2RlcztcbiAgICBjb21wb25lbnQuJHJlbmRlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuZGVzdHJveShob3N0KTtcbiAgICAgIGhvc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKG51bGwsIGNvbXBvbmVudCk7XG4gICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhjb21wb25lbnROb2RlcywgaG9zdCk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcbiAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vbk1vdW50KCk7XG5cbiAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBob3N0KTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICB9XG5cbiAgcHVibGljIGV4dHJhY3RSb3V0ZXMoY2hpbGRyZW46IEtOb2RlLktOb2RlW10sIHBhcmVudEd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPiwgc2NvcGU/OiBTY29wZSk6IFJvdXRlQ29uZmlnW10ge1xuICAgIGNvbnN0IHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuICAgIGNvbnN0IHByZXZTY29wZSA9IHNjb3BlID8gdGhpcy5pbnRlcnByZXRlci5zY29wZSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQudHlwZSAhPT0gXCJlbGVtZW50XCIpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZWwgPSBjaGlsZCBhcyBLTm9kZS5FbGVtZW50O1xuICAgICAgaWYgKGVsLm5hbWUgPT09IFwicm91dGVcIikge1xuICAgICAgICBjb25zdCBwYXRoQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBwYXRoXCJdKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50QXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjb21wb25lbnRcIl0pO1xuICAgICAgICBjb25zdCBndWFyZEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZ3VhcmRcIl0pO1xuICAgICAgICBpZiAoIXBhdGhBdHRyIHx8ICFjb21wb25lbnRBdHRyKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhBdHRyLnZhbHVlO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmV4ZWN1dGUoY29tcG9uZW50QXR0ci52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGd1YXJkID0gZ3VhcmRBdHRyID8gdGhpcy5leGVjdXRlKGd1YXJkQXR0ci52YWx1ZSkgOiBwYXJlbnRHdWFyZDtcbiAgICAgICAgcm91dGVzLnB1c2goeyBwYXRoOiBwYXRoLCBjb21wb25lbnQ6IGNvbXBvbmVudCwgZ3VhcmQ6IGd1YXJkIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGVsLm5hbWUgPT09IFwiZ3VhcmRcIikge1xuICAgICAgICBjb25zdCBjaGVja0F0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAY2hlY2tcIl0pO1xuICAgICAgICBpZiAoIWNoZWNrQXR0cikgY29udGludWU7XG4gICAgICAgIGNvbnN0IGNoZWNrID0gdGhpcy5leGVjdXRlKGNoZWNrQXR0ci52YWx1ZSk7XG4gICAgICAgIHJvdXRlcy5wdXNoKC4uLnRoaXMuZXh0cmFjdFJvdXRlcyhlbC5jaGlsZHJlbiwgY2hlY2spKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNjb3BlKSB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgIHJldHVybiByb3V0ZXM7XG4gIH1cblxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUoX25vZGU6IEtOb2RlLkRvY3R5cGUpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gICAgLy8gcmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50VHlwZShcImh0bWxcIiwgXCJcIiwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nLCB0YWdOYW1lPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgY2xlYW5NZXNzYWdlID0gbWVzc2FnZS5zdGFydHNXaXRoKFwiUnVudGltZSBFcnJvclwiKVxuICAgICAgPyBtZXNzYWdlXG4gICAgICA6IGBSdW50aW1lIEVycm9yOiAke21lc3NhZ2V9YDtcblxuICAgIGlmICh0YWdOYW1lICYmICFjbGVhbk1lc3NhZ2UuaW5jbHVkZXMoYGF0IDwke3RhZ05hbWV9PmApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Y2xlYW5NZXNzYWdlfVxcbiAgYXQgPCR7dGFnTmFtZX0+YCk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGNsZWFuTWVzc2FnZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShub2Rlcyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKV0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3BpbGUoXG4gIHNvdXJjZTogc3RyaW5nLFxuICBlbnRpdHk/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LFxuICBjb250YWluZXI/OiBIVE1MRWxlbWVudCxcbiAgcmVnaXN0cnk/OiBDb21wb25lbnRSZWdpc3RyeVxuKTogTm9kZSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogcmVnaXN0cnkgfHwge30gfSk7XG4gIGNvbnN0IHJlc3VsdCA9IHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBlbnRpdHkgfHwge30sIGNvbnRhaW5lcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIEthc3BlcihDb21wb25lbnRDbGFzczogYW55KSB7XG4gIEthc3BlckluaXQoe1xuICAgIHJvb3Q6IFwia2FzcGVyLWFwcFwiLFxuICAgIGVudHJ5OiBcImthc3Blci1yb290XCIsXG4gICAgcmVnaXN0cnk6IHtcbiAgICAgIFwia2FzcGVyLXJvb3RcIjoge1xuICAgICAgICBzZWxlY3RvcjogXCJ0ZW1wbGF0ZVwiLFxuICAgICAgICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzLFxuICAgICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59XG5cbmludGVyZmFjZSBBcHBDb25maWcge1xuICByb290Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG4gIGVudHJ5Pzogc3RyaW5nO1xuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChcbiAgdHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeVxuKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZWdpc3RyeVt0YWddLmNvbXBvbmVudCh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiByZWdpc3RyeVt0YWddLm5vZGVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZWdpc3RyeShcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5LFxuICBwYXJzZXI6IFRlbXBsYXRlUGFyc2VyXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0geyAuLi5yZWdpc3RyeSB9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWdpc3RyeSkpIHtcbiAgICBjb25zdCBlbnRyeSA9IHJlZ2lzdHJ5W2tleV07XG4gICAgaWYgKCFlbnRyeS5ub2RlcykgZW50cnkubm9kZXMgPSBbXTtcbiAgICBpZiAoZW50cnkubm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChlbnRyeS5zZWxlY3Rvcikge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICBlbnRyeS50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICBlbnRyeS5ub2RlcyA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZS5pbm5lckhUTUwpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RhdGljVGVtcGxhdGUgPSAoZW50cnkuY29tcG9uZW50IGFzIGFueSkudGVtcGxhdGU7XG4gICAgaWYgKHN0YXRpY1RlbXBsYXRlKSB7XG4gICAgICBlbnRyeS5ub2RlcyA9IHBhcnNlci5wYXJzZShzdGF0aWNUZW1wbGF0ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXJJbml0KGNvbmZpZzogQXBwQ29uZmlnKSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCByb290ID1cbiAgICB0eXBlb2YgY29uZmlnLnJvb3QgPT09IFwic3RyaW5nXCJcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdClcbiAgICAgIDogY29uZmlnLnJvb3Q7XG5cbiAgaWYgKCFyb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSb290IGVsZW1lbnQgbm90IGZvdW5kOiAke2NvbmZpZy5yb290fWApO1xuICB9XG5cbiAgY29uc3QgcmVnaXN0cnkgPSBub3JtYWxpemVSZWdpc3RyeShjb25maWcucmVnaXN0cnksIHBhcnNlcik7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB9KTtcbiAgY29uc3QgZW50cnlUYWcgPSBjb25maWcuZW50cnkgfHwgXCJrYXNwZXItYXBwXCI7XG5cbiAgY29uc3QgeyBub2RlLCBpbnN0YW5jZSwgbm9kZXMgfSA9IGNyZWF0ZUNvbXBvbmVudChcbiAgICB0cmFuc3BpbGVyLFxuICAgIGVudHJ5VGFnLFxuICAgIHJlZ2lzdHJ5XG4gICk7XG5cbiAgaWYgKHJvb3QpIHtcbiAgICByb290LmlubmVySFRNTCA9IFwiXCI7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChub2RlKTtcbiAgfVxuXG4gIC8vIEluaXRpYWwgcmVuZGVyIGFuZCBsaWZlY3ljbGVcbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vbk1vdW50KCk7XG4gIH1cblxuICB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgaW5zdGFuY2UsIG5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG4iXSwibmFtZXMiOlsiU2V0IiwiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5QaXBlbGluZSIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuU3ByZWFkIiwiRXhwci5DYWxsIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5BcnJvd0Z1bmN0aW9uIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsIkNvbW1lbnQiLCJOb2RlLkNvbW1lbnQiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCIsIkNvbXBvbmVudENsYXNzIiwic2NvcGUiLCJwcmV2Il0sIm1hcHBpbmdzIjoiQUFZTyxNQUFNLFVBQVU7QUFBQSxFQVNyQixZQUFZLE9BQXVCO0FBUG5DLFNBQUEsT0FBNEIsQ0FBQTtBQUc1QixTQUFBLG1CQUFtQixJQUFJLGdCQUFBO0FBQ3ZCLFNBQUEsY0FBaUMsQ0FBQTtBQUkvQixRQUFJLENBQUMsT0FBTztBQUNWLFdBQUssT0FBTyxDQUFBO0FBQ1o7QUFBQSxJQUNGO0FBQ0EsUUFBSSxNQUFNLE1BQU07QUFDZCxXQUFLLE9BQU8sTUFBTSxRQUFRLENBQUE7QUFBQSxJQUM1QjtBQUNBLFFBQUksTUFBTSxLQUFLO0FBQ2IsV0FBSyxNQUFNLE1BQU07QUFBQSxJQUNuQjtBQUNBLFFBQUksTUFBTSxZQUFZO0FBQ3BCLFdBQUssYUFBYSxNQUFNO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFTLEtBQWdCLElBQXNCO0FBQzdDLFNBQUssWUFBWSxLQUFLLElBQUksU0FBUyxFQUFFLENBQUM7QUFBQSxFQUN4QztBQUFBLEVBRUEsVUFBVTtBQUFBLEVBQUM7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUFDO0FBQUEsRUFDWixZQUFZO0FBQUEsRUFBQztBQUFBLEVBQ2IsWUFBWTtBQUFBLEVBQUM7QUFBQSxFQUViLFNBQVM7QUFsQ0o7QUFtQ0gsZUFBSyxZQUFMO0FBQUEsRUFDRjtBQUNGO0FDakRPLE1BQU0sb0JBQW9CLE1BQU07QUFBQSxFQUlyQyxZQUFZLE9BQWUsTUFBYyxLQUFhO0FBQ3BELFVBQU0sZ0JBQWdCLElBQUksSUFBSSxHQUFHLFFBQVEsS0FBSyxFQUFFO0FBQ2hELFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUNaLFNBQUssTUFB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LE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGdCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsaUJBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLElBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFB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
