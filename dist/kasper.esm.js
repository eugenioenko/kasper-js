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
export {
  KasperInit as App,
  Component,
  ExpressionParser,
  Interpreter,
  Kasper,
  Scanner,
  TemplateParser,
  Transpiler,
  Viewer,
  batch,
  computed,
  effect,
  execute,
  signal,
  transpile
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmVzbS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudC50cyIsIi4uL3NyYy90eXBlcy9lcnJvci50cyIsIi4uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIi4uL3NyYy90eXBlcy90b2tlbi50cyIsIi4uL3NyYy9leHByZXNzaW9uLXBhcnNlci50cyIsIi4uL3NyYy91dGlscy50cyIsIi4uL3NyYy9zY2FubmVyLnRzIiwiLi4vc3JjL3Njb3BlLnRzIiwiLi4vc3JjL2ludGVycHJldGVyLnRzIiwiLi4vc3JjL3R5cGVzL25vZGVzLnRzIiwiLi4vc3JjL3RlbXBsYXRlLXBhcnNlci50cyIsIi4uL3NyYy9zaWduYWwudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvdHJhbnNwaWxlci50cyIsIi4uL3NyYy9rYXNwZXIudHMiLCIuLi9zcmMvdmlld2VyLnRzIiwiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLTm9kZSB9IGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbmludGVyZmFjZSBDb21wb25lbnRBcmdzIHtcbiAgYXJnczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xuICBzdGF0aWMgdGVtcGxhdGU/OiBzdHJpbmc7XG4gIGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge307XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzIHx8IHt9O1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgb25Jbml0KCkge31cbiAgb25SZW5kZXIoKSB7fVxuICBvbkNoYW5nZXMoKSB7fVxuICBvbkRlc3Ryb3koKSB7fVxuXG4gICRkb1JlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMudHJhbnNwaWxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdHlwZSBLYXNwZXJFbnRpdHkgPSBDb21wb25lbnQgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50Q2xhc3MgPSB7IG5ldyAoYXJncz86IENvbXBvbmVudEFyZ3MpOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yPzogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU/OiBFbGVtZW50IHwgbnVsbDtcbiAgICBub2RlczogS05vZGVbXTtcbiAgfTtcbn1cbiIsImV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICBzdXBlcihgUGFyc2UgRXJyb3IgKCR7bGluZX06JHtjb2x9KSA9PiAke3ZhbHVlfWApO1xuICAgIHRoaXMubmFtZSA9IFwiS2FzcGVyRXJyb3JcIjtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sID0gY29sO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAndG9rZW4nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXhwciB7XG4gIHB1YmxpYyByZXN1bHQ6IGFueTtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBpbnRlcmZhY2UgRXhwclZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0QXJyb3dGdW5jdGlvbkV4cHIoZXhwcjogQXJyb3dGdW5jdGlvbik6IFI7XG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEFzc2lnbik6IFI7XG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEJpbmFyeSk6IFI7XG4gICAgdmlzaXRDYWxsRXhwcihleHByOiBDYWxsKTogUjtcbiAgICB2aXNpdERlYnVnRXhwcihleHByOiBEZWJ1Zyk6IFI7XG4gICAgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBEaWN0aW9uYXJ5KTogUjtcbiAgICB2aXNpdEVhY2hFeHByKGV4cHI6IEVhY2gpOiBSO1xuICAgIHZpc2l0R2V0RXhwcihleHByOiBHZXQpOiBSO1xuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEdyb3VwaW5nKTogUjtcbiAgICB2aXNpdEtleUV4cHIoZXhwcjogS2V5KTogUjtcbiAgICB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IExvZ2ljYWwpOiBSO1xuICAgIHZpc2l0TGlzdEV4cHIoZXhwcjogTGlzdCk6IFI7XG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByOiBMaXRlcmFsKTogUjtcbiAgICB2aXNpdE5ld0V4cHIoZXhwcjogTmV3KTogUjtcbiAgICB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBOdWxsQ29hbGVzY2luZyk6IFI7XG4gICAgdmlzaXRQb3N0Zml4RXhwcihleHByOiBQb3N0Zml4KTogUjtcbiAgICB2aXNpdFNldEV4cHIoZXhwcjogU2V0KTogUjtcbiAgICB2aXNpdFBpcGVsaW5lRXhwcihleHByOiBQaXBlbGluZSk6IFI7XG4gICAgdmlzaXRTcHJlYWRFeHByKGV4cHI6IFNwcmVhZCk6IFI7XG4gICAgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogVGVtcGxhdGUpOiBSO1xuICAgIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogVGVybmFyeSk6IFI7XG4gICAgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IFR5cGVvZik6IFI7XG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcjogVW5hcnkpOiBSO1xuICAgIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IFZhcmlhYmxlKTogUjtcbiAgICB2aXNpdFZvaWRFeHByKGV4cHI6IFZvaWQpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgQXJyb3dGdW5jdGlvbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwYXJhbXM6IFRva2VuW107XG4gICAgcHVibGljIGJvZHk6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFRva2VuW10sIGJvZHk6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBcnJvd0Z1bmN0aW9uRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFycm93RnVuY3Rpb24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFzc2lnbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Bc3NpZ24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQmluYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjYWxsZWU6IEV4cHI7XG4gICAgcHVibGljIHBhcmVuOiBUb2tlbjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuICAgIHB1YmxpYyBvcHRpb25hbDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKGNhbGxlZTogRXhwciwgcGFyZW46IFRva2VuLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlciwgb3B0aW9uYWwgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgdGhpcy5wYXJlbiA9IHBhcmVuO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gb3B0aW9uYWw7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FsbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5DYWxsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWJ1Z0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EZWJ1Zyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcHJvcGVydGllczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREaWN0aW9uYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRpY3Rpb25hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFYWNoIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBrZXk6IFRva2VuO1xuICAgIHB1YmxpYyBpdGVyYWJsZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBrZXk6IFRva2VuLCBpdGVyYWJsZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLml0ZXJhYmxlID0gaXRlcmFibGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWFjaEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5FYWNoJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdHlwZTogVG9rZW5UeXBlLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5HZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cGluZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R3JvdXBpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR3JvdXBpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLZXkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0S2V5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLktleSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2ljYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMb2dpY2FsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxvZ2ljYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpc3RFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGlzdCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXRlcmFsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmV3IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNsYXp6OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY2xheno6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsYXp6ID0gY2xheno7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmV3RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk5ldyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxDb2FsZXNjaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbENvYWxlc2NpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTnVsbENvYWxlc2NpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0Zml4IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMgaW5jcmVtZW50OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGluY3JlbWVudDogbnVtYmVyLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBvc3RmaXhFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUG9zdGZpeCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQaXBlbGluZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5QaXBlbGluZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwcmVhZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNwcmVhZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TcHJlYWQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVm9pZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZvaWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVm9pZCc7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAvLyBQYXJzZXIgVG9rZW5zXHJcbiAgRW9mLFxyXG4gIFBhbmljLFxyXG5cclxuICAvLyBTaW5nbGUgQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFtcGVyc2FuZCxcclxuICBBdFNpZ24sXHJcbiAgQ2FyZXQsXHJcbiAgQ29tbWEsXHJcbiAgRG9sbGFyLFxyXG4gIERvdCxcclxuICBIYXNoLFxyXG4gIExlZnRCcmFjZSxcclxuICBMZWZ0QnJhY2tldCxcclxuICBMZWZ0UGFyZW4sXHJcbiAgUGVyY2VudCxcclxuICBQaXBlLFxyXG4gIFJpZ2h0QnJhY2UsXHJcbiAgUmlnaHRCcmFja2V0LFxyXG4gIFJpZ2h0UGFyZW4sXHJcbiAgU2VtaWNvbG9uLFxyXG4gIFNsYXNoLFxyXG4gIFN0YXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFycm93LFxyXG4gIEJhbmcsXHJcbiAgQmFuZ0VxdWFsLFxyXG4gIEJhbmdFcXVhbEVxdWFsLFxyXG4gIENvbG9uLFxyXG4gIEVxdWFsLFxyXG4gIEVxdWFsRXF1YWwsXHJcbiAgRXF1YWxFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnMgKGJpdHdpc2Ugc2hpZnRzKVxyXG4gIExlZnRTaGlmdCxcclxuICBSaWdodFNoaWZ0LFxyXG4gIFBpcGVsaW5lLFxyXG4gIFRpbGRlLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBEZWJ1ZyxcclxuICBGYWxzZSxcclxuICBJbixcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBWb2lkLFxyXG4gIFdpdGgsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbiB7XHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xyXG4gIHB1YmxpYyBsaXRlcmFsOiBhbnk7XHJcbiAgcHVibGljIGxleGVtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHR5cGU6IFRva2VuVHlwZSxcclxuICAgIGxleGVtZTogc3RyaW5nLFxyXG4gICAgbGl0ZXJhbDogYW55LFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sOiBudW1iZXJcclxuICApIHtcclxuICAgIHRoaXMubmFtZSA9IFRva2VuVHlwZVt0eXBlXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxleGVtZSA9IGxleGVtZTtcclxuICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gYFsoJHt0aGlzLmxpbmV9KTpcIiR7dGhpcy5sZXhlbWV9XCJdYDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblBhcnNlciB7XG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICBwcml2YXRlIHRva2VuczogVG9rZW5bXTtcblxuICBwdWJsaWMgcGFyc2UodG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgY29uc3QgZXhwcmVzc2lvbnM6IEV4cHIuRXhwcltdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi50eXBlczogVG9rZW5UeXBlW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50XTtcbiAgfVxuXG4gIHByaXZhdGUgcHJldmlvdXMoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT09IHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVjayhUb2tlblR5cGUuRW9mKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3VtZSh0eXBlOiBUb2tlblR5cGUsIG1lc3NhZ2U6IHN0cmluZyk6IFRva2VuIHtcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVycm9yKFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICBtZXNzYWdlICsgYCwgdW5leHBlY3RlZCB0b2tlbiBcIiR7dGhpcy5wZWVrKCkubGV4ZW1lfVwiYFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKHRva2VuOiBUb2tlbiwgbWVzc2FnZTogc3RyaW5nKTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IobWVzc2FnZSwgdG9rZW4ubGluZSwgdG9rZW4uY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgc3luY2hyb25pemUoKTogdm9pZCB7XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLlNlbWljb2xvbikgfHwgdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcblxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3RlZCBhbiBpZGVudGlmaWVyIGluc2lkZSBcImVhY2hcIiBzdGF0ZW1lbnRgXG4gICAgKTtcblxuICAgIGxldCBrZXk6IFRva2VuID0gbnVsbDtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcbiAgICAgIGtleSA9IHRoaXMuY29uc3VtZShcbiAgICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuT2YsXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICk7XG4gICAgY29uc3QgaXRlcmFibGUgPSB0aGlzLmV4cHJlc3Npb24oKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5FYWNoKG5hbWUsIGtleSwgaXRlcmFibGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGV4cHJlc3Npb24oKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByZXNzaW9uOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xuICAgICAgLy8gY29uc3VtZSBhbGwgc2VtaWNvbG9uc1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkgeyAvKiBjb25zdW1lIHNlbWljb2xvbnMgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWdubWVudCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucGlwZWxpbmUoKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU3RhckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU2xhc2hFcXVhbFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgbGV0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICAgIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICBjb25zdCBuYW1lOiBUb2tlbiA9IGV4cHIubmFtZTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuVmFyaWFibGUobmFtZSwgbmFtZS5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuQXNzaWduKG5hbWUsIHZhbHVlLCBuYW1lLmxpbmUpO1xuICAgICAgfSBlbHNlIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuR2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgZXhwci50eXBlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5TZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCB2YWx1ZSwgZXhwci5saW5lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXJyb3Iob3BlcmF0b3IsIGBJbnZhbGlkIGwtdmFsdWUsIGlzIG5vdCBhbiBhc3NpZ25pbmcgdGFyZ2V0LmApO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgcGlwZWxpbmUoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QaXBlbGluZSkpIHtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuUGlwZWxpbmUoZXhwciwgcmlnaHQsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXJuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCB0aGVuRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcbiAgICAgIGNvbnN0IGVsc2VFeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZXJuYXJ5KGV4cHIsIHRoZW5FeHByLCBlbHNlRXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG51bGxDb2FsZXNjaW5nKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubG9naWNhbE9yKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCByaWdodEV4cHI6IEV4cHIuRXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OdWxsQ29hbGVzY2luZyhleHByLCByaWdodEV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsT3IoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsQW5kKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkFuZCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgIHdoaWxlIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3NFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkluc3RhbmNlb2YsXG4gICAgICAgIFRva2VuVHlwZS5JbixcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnNoaWZ0KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBzaGlmdCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRTaGlmdCwgVG9rZW5UeXBlLlJpZ2h0U2hpZnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkaXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzLCBUb2tlblR5cGUuUGx1cykpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QZXJjZW50KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG11bHRpcGxpY2F0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdHlwZW9mKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuYXJ5KCk7XG4gIH1cblxuICBwcml2YXRlIHVuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgVG9rZW5UeXBlLlRpbGRlLFxuICAgICAgICBUb2tlblR5cGUuRG9sbGFyLFxuICAgICAgICBUb2tlblR5cGUuUGx1c1BsdXMsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy51bmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlVuYXJ5KG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld0tleXdvcmQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV3S2V5d29yZCgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OZXcpKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgY29uc3RydWN0OiBFeHByLkV4cHIgPSB0aGlzLnBvc3RmaXgoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LCBrZXl3b3JkLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wb3N0Zml4KCk7XG4gIH1cblxuICBwcml2YXRlIHBvc3RmaXgoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5jYWxsKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBsdXNQbHVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgMSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzTWludXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAtMSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGNhbGwoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5wcmltYXJ5KCk7XG4gICAgbGV0IGNvbnN1bWVkOiBib29sZWFuO1xuICAgIGRvIHtcbiAgICAgIGNvbnN1bWVkID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgZmFsc2UpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3QsIFRva2VuVHlwZS5RdWVzdGlvbkRvdCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCB0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGNvbnN1bWVkKTtcbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdG9rZW5BdChvZmZzZXQ6IG51bWJlcik6IFRva2VuVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCArIG9mZnNldF0/LnR5cGU7XG4gIH1cblxuICBwcml2YXRlIGlzQXJyb3dQYXJhbXMoKTogYm9vbGVhbiB7XG4gICAgbGV0IGkgPSB0aGlzLmN1cnJlbnQgKyAxOyAvLyBza2lwIChcbiAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgPT09IFRva2VuVHlwZS5SaWdodFBhcmVuKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgfVxuICAgIHdoaWxlIChpIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5JZGVudGlmaWVyKSByZXR1cm4gZmFsc2U7XG4gICAgICBpKys7XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgPT09IFRva2VuVHlwZS5SaWdodFBhcmVuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLkNvbW1hKSByZXR1cm4gZmFsc2U7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgZmluaXNoQ2FsbChjYWxsZWU6IEV4cHIuRXhwciwgcGFyZW46IFRva2VuLCBvcHRpb25hbDogYm9vbGVhbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgYXJnczogRXhwci5FeHByW10gPSBbXTtcbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIH1cbiAgICBjb25zdCBjbG9zZVBhcmVuID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgYXJndW1lbnRzYCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkNhbGwoY2FsbGVlLCBjbG9zZVBhcmVuLCBhcmdzLCBjbG9zZVBhcmVuLmxpbmUsIG9wdGlvbmFsKTtcbiAgfVxuXG4gIHByaXZhdGUgZG90R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBuYW1lOiBUb2tlbiA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdCBwcm9wZXJ0eSBuYW1lIGFmdGVyICcuJ2BcbiAgICApO1xuICAgIGNvbnN0IGtleTogRXhwci5LZXkgPSBuZXcgRXhwci5LZXkobmFtZSwgbmFtZS5saW5lKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgYnJhY2tldEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgbGV0IGtleTogRXhwci5FeHByID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAga2V5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhbiBpbmRleGApO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBvcGVyYXRvci5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJpbWFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5GYWxzZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKGZhbHNlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UcnVlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodHJ1ZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTnVsbCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlVuZGVmaW5lZCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHVuZGVmaW5lZCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTnVtYmVyKSB8fCB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVGVtcGxhdGUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVtcGxhdGUodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLklkZW50aWZpZXIpICYmIHRoaXMudG9rZW5BdCgxKSA9PT0gVG9rZW5UeXBlLkFycm93KSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgPT5cbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKFtwYXJhbV0sIGJvZHksIHBhcmFtLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLkxlZnRQYXJlbikgJiYgdGhpcy5pc0Fycm93UGFyYW1zKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lIChcbiAgICAgIGNvbnN0IHBhcmFtczogVG9rZW5bXSA9IFtdO1xuICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgcGFyYW1zLnB1c2godGhpcy5jb25zdW1lKFRva2VuVHlwZS5JZGVudGlmaWVyLCBcIkV4cGVjdGVkIHBhcmFtZXRlciBuYW1lXCIpKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiYCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkFycm93LCBgRXhwZWN0ZWQgXCI9PlwiYCk7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihwYXJhbXMsIGJvZHksIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgZXhwcmVzc2lvbmApO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkdyb3VwaW5nKGV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlZvaWQpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRlYnVnKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGVidWcoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cblxuICAgIHRocm93IHRoaXMuZXJyb3IoXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIGBFeHBlY3RlZCBleHByZXNzaW9uLCB1bmV4cGVjdGVkIHRva2VuIFwiJHt0aGlzLnBlZWsoKS5sZXhlbWV9XCJgXG4gICAgKTtcbiAgICAvLyB1bnJlYWNoZWFibGUgY29kZVxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xuICB9XG5cbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBsZWZ0QnJhY2UgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgIHByb3BlcnRpZXMucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcsIFRva2VuVHlwZS5JZGVudGlmaWVyLCBUb2tlblR5cGUuTnVtYmVyKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db2xvbikpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEV4cHIuVmFyaWFibGUoa2V5LCBrZXkubGluZSk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgdGhpcy5wZWVrKCksXG4gICAgICAgICAgYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7XG4gICAgICAgICAgICB0aGlzLnBlZWsoKS5sZXhlbWVcbiAgICAgICAgICB9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KHByb3BlcnRpZXMsIGxlZnRCcmFjZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcbiAgICBjb25zdCBsZWZ0QnJhY2tldCA9IHRoaXMucHJldmlvdXMoKTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGlzdChbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICB2YWx1ZXMucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5SaWdodEJyYWNrZXQsXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuTGlzdCh2YWx1ZXMsIGxlZnRCcmFja2V0LmxpbmUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIikgfHwgY2hhciA9PT0gXCIkXCIgfHwgY2hhciA9PT0gXCJfXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDoga2V5b2YgdHlwZW9mIFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW5UeXBlW3dvcmRdID49IFRva2VuVHlwZS5BbmQ7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XG4gIC8qKiBwb2ludHMgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgLyoqIHBvaW50cyB0byB0aGUgc3RhcnQgb2YgdGhlIHRva2VuICAqL1xuICBwcml2YXRlIHN0YXJ0OiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGxpbmUgb2Ygc291cmNlIGNvZGUgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgbGluZTogbnVtYmVyO1xuICAvKiogY3VycmVudCBjb2x1bW4gb2YgdGhlIGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjb2w6IG51bWJlcjtcblxuICBwdWJsaWMgc2Nhbihzb3VyY2U6IHN0cmluZyk6IFRva2VuW10ge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcbiAgICB9XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4oVG9rZW5UeXBlLkVvZiwgXCJcIiwgbnVsbCwgdGhpcy5saW5lLCAwKSk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiXFxuXCIpIHtcbiAgICAgIHRoaXMubGluZSsrO1xuICAgICAgdGhpcy5jb2wgPSAwO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB0aGlzLmNvbCsrO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRva2VuKHRva2VuVHlwZTogVG9rZW5UeXBlLCBsaXRlcmFsOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4odG9rZW5UeXBlLCB0ZXh0LCBsaXRlcmFsLCB0aGlzLmxpbmUsIHRoaXMuY29sKSk7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKGV4cGVjdGVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrTmV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgKyAxID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50ICsgMSk7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBcIlxcblwiICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG11bHRpbGluZUNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpICYmICEodGhpcy5wZWVrKCkgPT09IFwiKlwiICYmIHRoaXMucGVla05leHQoKSA9PT0gXCIvXCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoJ1VudGVybWluYXRlZCBjb21tZW50LCBleHBlY3RpbmcgY2xvc2luZyBcIiovXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGhlIGNsb3Npbmcgc2xhc2ggJyovJ1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhxdW90ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBxdW90ZSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihgVW50ZXJtaW5hdGVkIHN0cmluZywgZXhwZWN0aW5nIGNsb3NpbmcgJHtxdW90ZX1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgY2xvc2luZyBcIi5cbiAgICB0aGlzLmFkdmFuY2UoKTtcblxuICAgIC8vIFRyaW0gdGhlIHN1cnJvdW5kaW5nIHF1b3Rlcy5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0ICsgMSwgdGhpcy5jdXJyZW50IC0gMSk7XG4gICAgdGhpcy5hZGRUb2tlbihxdW90ZSAhPT0gXCJgXCIgPyBUb2tlblR5cGUuU3RyaW5nIDogVG9rZW5UeXBlLlRlbXBsYXRlLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIG51bWJlcigpOiB2b2lkIHtcbiAgICAvLyBnZXRzIGludGVnZXIgcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBmcmFjdGlvblxuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCIuXCIgJiYgVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWtOZXh0KCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBnZXRzIGZyYWN0aW9uIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZXhwb25lbnRcbiAgICBpZiAodGhpcy5wZWVrKCkudG9Mb3dlckNhc2UoKSA9PT0gXCJlXCIpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgaWYgKHRoaXMucGVlaygpID09PSBcIi1cIiB8fCB0aGlzLnBlZWsoKSA9PT0gXCIrXCIpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLk51bWJlciwgTnVtYmVyKHZhbHVlKSk7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoKTogdm9pZCB7XG4gICAgd2hpbGUgKFV0aWxzLmlzQWxwaGFOdW1lcmljKHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICBjb25zdCBjYXBpdGFsaXplZCA9IFV0aWxzLmNhcGl0YWxpemUodmFsdWUpIGFzIGtleW9mIHR5cGVvZiBUb2tlblR5cGU7XG4gICAgaWYgKFV0aWxzLmlzS2V5d29yZChjYXBpdGFsaXplZCkpIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlW2NhcGl0YWxpemVkXSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5JZGVudGlmaWVyLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRUb2tlbigpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFyID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICBjYXNlIFwiKFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIpXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJbXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIixcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ29tbWEsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlNlbWljb2xvbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuVGlsZGUsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJeXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNhcmV0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiOlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkNvbG9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlN0YXJFcXVhbCA6IFRva2VuVHlwZS5TdGFyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlBlcmNlbnRFcXVhbCA6IFRva2VuVHlwZS5QZXJjZW50LFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5QaXBlbGluZSA6XG4gICAgICAgICAgVG9rZW5UeXBlLlBpcGUsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIiZcIikgPyBUb2tlblR5cGUuQW5kIDogVG9rZW5UeXBlLkFtcGVyc2FuZCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5SaWdodFNoaWZ0IDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5HcmVhdGVyRXF1YWwgOiBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiFcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5CYW5nRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiK1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTWludXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIjxcIikgPyBUb2tlblR5cGUuTGVmdFNoaWZ0IDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPlwiKVxuICAgICAgICAgICAgICA/IFRva2VuVHlwZS5MZXNzRXF1YWxHcmVhdGVyXG4gICAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3NFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3REb3QsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3QsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3QsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIvXCIpKSB7XG4gICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIipcIikpIHtcbiAgICAgICAgICB0aGlzLm11bHRpbGluZUNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU2xhc2hFcXVhbCA6IFRva2VuVHlwZS5TbGFzaCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBgJ2A6XG4gICAgICBjYXNlIGBcImA6XG4gICAgICBjYXNlIFwiYFwiOlxuICAgICAgICB0aGlzLnN0cmluZyhjaGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBpZ25vcmUgY2FzZXNcbiAgICAgIGNhc2UgXCJcXG5cIjpcbiAgICAgIGNhc2UgXCIgXCI6XG4gICAgICBjYXNlIFwiXFxyXCI6XG4gICAgICBjYXNlIFwiXFx0XCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY29tcGxleCBjYXNlc1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFV0aWxzLmlzRGlnaXQoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLm51bWJlcigpO1xuICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzQWxwaGEoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLmlkZW50aWZpZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciAnJHtjaGFyfSdgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgU2NhbiBFcnJvciAoJHt0aGlzLmxpbmV9OiR7dGhpcy5jb2x9KSA9PiAke21lc3NhZ2V9YCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY29wZSB7XG4gIHB1YmxpYyB2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHB1YmxpYyBwYXJlbnQ6IFNjb3BlO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudD86IFNjb3BlLCBlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgPyBwYXJlbnQgOiBudWxsO1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgaW5pdChlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZXNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2tleV07XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5IGFzIGtleW9mIHR5cGVvZiB3aW5kb3ddO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciBhcyBQYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEludGVycHJldGVyIGltcGxlbWVudHMgRXhwci5FeHByVmlzaXRvcjxhbnk+IHtcbiAgcHVibGljIHNjb3BlID0gbmV3IFNjb3BlKCk7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG4gIHB1YmxpYyBldmFsdWF0ZShleHByOiBFeHByLkV4cHIpOiBhbnkge1xuICAgIHJldHVybiAoZXhwci5yZXN1bHQgPSBleHByLmFjY2VwdCh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogRXhwci5QaXBlbGluZSk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuQ2FsbCkge1xuICAgICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0LmNhbGxlZSk7XG4gICAgICBjb25zdCBhcmdzID0gW3ZhbHVlXTtcbiAgICAgIGZvciAoY29uc3QgYXJnIG9mIGV4cHIucmlnaHQuYXJncykge1xuICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJnIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXhwci5yaWdodC5jYWxsZWUgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIucmlnaHQuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjb25zdCBmbiA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgcmV0dXJuIGZuKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEV4cHIuQXJyb3dGdW5jdGlvbik6IGFueSB7XG4gICAgY29uc3QgY2FwdHVyZWRTY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuc2NvcGU7XG4gICAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlKGNhcHR1cmVkU2NvcGUpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHByLnBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnBhcmFtc1tpXS5sZXhlbWUsIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5ib2R5KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSdW50aW1lIEVycm9yID0+ICR7bWVzc2FnZX1gKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBFeHByLlZhcmlhYmxlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5zY29wZS5nZXQoZXhwci5uYW1lLmxleGVtZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEV4cHIuQXNzaWduKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgdGhpcy5zY29wZS5zZXQoZXhwci5uYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEtleUV4cHIoZXhwcjogRXhwci5LZXkpOiBhbnkge1xuICAgIHJldHVybiBleHByLm5hbWUubGl0ZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdldEV4cHIoZXhwcjogRXhwci5HZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGlmICghZW50aXR5ICYmIGV4cHIudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5W2tleV07XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTZXRFeHByKGV4cHI6IEV4cHIuU2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgZW50aXR5W2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQb3N0Zml4RXhwcihleHByOiBFeHByLlBvc3RmaXgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSArIGV4cHIuaW5jcmVtZW50O1xuXG4gICAgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5lbnRpdHkubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgZXhwci5lbnRpdHkuZW50aXR5LFxuICAgICAgICBleHByLmVudGl0eS5rZXksXG4gICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgIGV4cHIubGluZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBwb3N0Zml4IG9wZXJhdGlvbjogJHtleHByLmVudGl0eX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXN0RXhwcihleHByOiBFeHByLkxpc3QpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwci52YWx1ZSkge1xuICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICB2YWx1ZXMucHVzaCguLi50aGlzLmV2YWx1YXRlKChleHByZXNzaW9uIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTcHJlYWRFeHByKGV4cHI6IEV4cHIuU3ByZWFkKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluc3RhbmNlb2Y6XG4gICAgICAgIHJldHVybiBsZWZ0IGluc3RhbmNlb2YgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZWZ0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0IDw8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUmlnaHRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKFwiVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgXCIgKyBleHByLm9wZXJhdG9yKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogRXhwci5Mb2dpY2FsKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLk9yKSB7XG4gICAgICBpZiAobGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogRXhwci5UZXJuYXJ5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmNvbmRpdGlvbilcbiAgICAgID8gdGhpcy5ldmFsdWF0ZShleHByLnRoZW5FeHByKVxuICAgICAgOiB0aGlzLmV2YWx1YXRlKGV4cHIuZWxzZUV4cHIpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IEV4cHIuTnVsbENvYWxlc2NpbmcpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgaWYgKGxlZnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuVGlsZGU6XG4gICAgICAgIHJldHVybiB+cmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogICR7ZXhwci5yaWdodH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICcgKyBleHByLm9wZXJhdG9yYCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmIChjYWxsZWUgPT0gbnVsbCAmJiBleHByLm9wdGlvbmFsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoYCR7Y2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmApO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmd1bWVudCBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb24g4oCUIHByZXNlcnZlIGB0aGlzYCBmb3IgbWV0aG9kIGNhbGxzXG4gICAgaWYgKGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TmV3RXhwcihleHByOiBFeHByLk5ldyk6IGFueSB7XG4gICAgY29uc3QgbmV3Q2FsbCA9IGV4cHIuY2xhenogYXMgRXhwci5DYWxsO1xuICAgIC8vIGludGVybmFsIGNsYXNzIGRlZmluaXRpb24gaW5zdGFuY2VcbiAgICBjb25zdCBjbGF6eiA9IHRoaXMuZXZhbHVhdGUobmV3Q2FsbC5jYWxsZWUpO1xuXG4gICAgaWYgKHR5cGVvZiBjbGF6eiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKFxuICAgICAgICBgJyR7Y2xhenp9JyBpcyBub3QgYSBjbGFzcy4gJ25ldycgc3RhdGVtZW50IG11c3QgYmUgdXNlZCB3aXRoIGNsYXNzZXMuYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmdzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJnIG9mIG5ld0NhbGwuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJnKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgY2xhenooLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBFeHByLkRpY3Rpb25hcnkpOiBhbnkge1xuICAgIGNvbnN0IGRpY3Q6IGFueSA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgZXhwci5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAocHJvcGVydHkgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGRpY3QsIHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLmtleSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLnZhbHVlKTtcbiAgICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VHlwZW9mRXhwcihleHByOiBFeHByLlR5cGVvZik6IGFueSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWFjaEV4cHIoZXhwcjogRXhwci5FYWNoKTogYW55IHtcbiAgICByZXR1cm4gW1xuICAgICAgZXhwci5uYW1lLmxleGVtZSxcbiAgICAgIGV4cHIua2V5ID8gZXhwci5rZXkubGV4ZW1lIDogbnVsbCxcbiAgICAgIHRoaXMuZXZhbHVhdGUoZXhwci5pdGVyYWJsZSksXG4gICAgXTtcbiAgfVxuXG4gIHZpc2l0Vm9pZEV4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29sICs9IDE7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHtlb2ZFcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKFwiJ1wiKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZygnXCInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChcInt7XCIpKSB7IGRlcHRoKys7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPiAwICYmIHRoaXMubWF0Y2goXCJ9fVwiKSkgeyBkZXB0aC0tOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmIHRoaXMucGVlayhcIjxcIikpIHsgYnJlYWs7IH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCFyYXcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0aGlzLmRlY29kZUVudGl0aWVzKHJhdyksIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVFbnRpdGllcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiXFx1MDBhMFwiKVxuICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgIC5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcbiAgICAgIC5yZXBsYWNlKC8mYXBvczsvZywgXCInXCIpXG4gICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpOyAvLyBtdXN0IGJlIGxhc3QgdG8gYXZvaWQgZG91YmxlLWRlY29kaW5nXG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJ0eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxubGV0IGFjdGl2ZUVmZmVjdDogeyBmbjogTGlzdGVuZXI7IGRlcHM6IFNldDxhbnk+IH0gfCBudWxsID0gbnVsbDtcbmNvbnN0IGVmZmVjdFN0YWNrOiBhbnlbXSA9IFtdO1xuXG5sZXQgYmF0Y2hpbmcgPSBmYWxzZTtcbmNvbnN0IHBlbmRpbmdTdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG5jb25zdCBwZW5kaW5nV2F0Y2hlcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbnR5cGUgV2F0Y2hlcjxUPiA9IChuZXdWYWx1ZTogVCwgb2xkVmFsdWU6IFQpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIF92YWx1ZTogVDtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG4gIHByaXZhdGUgd2F0Y2hlcnMgPSBuZXcgU2V0PFdhdGNoZXI8VD4+KCk7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZhbHVlOiBUKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5hZGQoYWN0aXZlRWZmZWN0LmZuKTtcbiAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLmFkZCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl92YWx1ZTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBpZiAoYmF0Y2hpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpYmVycykgcGVuZGluZ1N1YnNjcmliZXJzLmFkZChzdWIpO1xuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykgcGVuZGluZ1dhdGNoZXJzLnB1c2goKCkgPT4gd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycykpIHtcbiAgICAgICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSB7XG4gICAgICAgICAgdHJ5IHsgd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2UoZm46IFdhdGNoZXI8VD4pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lcikge1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25hbDxUPihpbml0aWFsVmFsdWU6IFQpOiBTaWduYWw8VD4ge1xuICByZXR1cm4gbmV3IFNpZ25hbChpbml0aWFsVmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmF0Y2goZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgYmF0Y2hpbmcgPSB0cnVlO1xuICB0cnkge1xuICAgIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgYmF0Y2hpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbShwZW5kaW5nU3Vic2NyaWJlcnMpO1xuICAgIHBlbmRpbmdTdWJzY3JpYmVycy5jbGVhcigpO1xuICAgIGNvbnN0IHdhdGNoZXJzID0gcGVuZGluZ1dhdGNoZXJzLnNwbGljZSgwKTtcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiBzdWJzKSB7XG4gICAgICB0cnkgeyBzdWIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiRWZmZWN0IGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2Ygd2F0Y2hlcnMpIHtcbiAgICAgIHRyeSB7IHdhdGNoZXIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgY29uc3QgcyA9IHNpZ25hbDxUPih1bmRlZmluZWQgYXMgYW55KTtcbiAgZWZmZWN0KCgpID0+IHtcbiAgICBzLnZhbHVlID0gZm4oKTtcbiAgfSk7XG4gIHJldHVybiBzO1xufVxuIiwiZXhwb3J0IGNsYXNzIEJvdW5kYXJ5IHtcbiAgcHJpdmF0ZSBzdGFydDogQ29tbWVudDtcbiAgcHJpdmF0ZSBlbmQ6IENvbW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBOb2RlLCBsYWJlbDogc3RyaW5nID0gXCJib3VuZGFyeVwiKSB7XG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LXN0YXJ0YCk7XG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1lbmRgKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgZWZmZWN0IH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBCb3VuZGFyeSB9IGZyb20gXCIuL2JvdW5kYXJ5XCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIElmRWxzZU5vZGUgPSBbS05vZGUuRWxlbWVudCwgS05vZGUuQXR0cmlidXRlXTtcblxuZXhwb3J0IGNsYXNzIFRyYW5zcGlsZXIgaW1wbGVtZW50cyBLTm9kZS5LTm9kZVZpc2l0b3I8dm9pZD4ge1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBFeHByZXNzaW9uUGFyc2VyKCk7XG4gIHByaXZhdGUgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIoKTtcbiAgcHJpdmF0ZSByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5yZWdpc3RyeSkge1xuICAgICAgdGhpcy5yZWdpc3RyeSA9IG9wdGlvbnMucmVnaXN0cnk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwaWxlKFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVudGl0eTogYW55LFxuICAgIGNvbnRhaW5lcjogRWxlbWVudFxuICApOiBOb2RlIHtcbiAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGVudGl0eSk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgY29udGFpbmVyKTtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudHJhY2tFZmZlY3QodGV4dCwgc3RvcCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKGUubWVzc2FnZSB8fCBgJHtlfWAsIFwidGV4dCBub2RlXCIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZUtOb2RlKG5vZGU6IEtOb2RlLkF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGF0dHIgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUobm9kZS5uYW1lKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBhdHRyLnZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgIH0pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYXR0ciwgc3RvcCk7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAocGFyZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IENvbW1lbnQobm9kZS52YWx1ZSk7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYWNrRWZmZWN0KHRhcmdldDogYW55LCBzdG9wOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgY29uc3QgJGlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uc1swXVsxXSBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25zWzBdWzBdLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxLCBleHByZXNzaW9ucy5sZW5ndGgpKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICBjb25zdCAkZWxzZWlmID0gdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgIGlmICgkZWxzZWlmKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoZXhwcmVzc2lvblswXSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VcIl0pKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KGV4cHJlc3Npb25bMF0sIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qga2V5QXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQGtleVwiXSk7XG4gICAgaWYgKGtleUF0dHIpIHtcbiAgICAgIHRoaXMuZG9FYWNoS2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50LCBrZXlBdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb0VhY2hVbmtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hVbmtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBrZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcblxuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGtleSkgc2NvcGVWYWx1ZXNba2V5XSA9IGluZGV4O1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBzdG9wID0gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgY29uc3QgW25hbWUsIGluZGV4S2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IGl0ZW1zIGFuZCB0aGVpciBrZXlzXG4gICAgICBjb25zdCBuZXdJdGVtczogQXJyYXk8eyBpdGVtOiBhbnk7IGlkeDogbnVtYmVyOyBrZXk6IGFueSB9PiA9IFtdO1xuICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpbmRleDtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXhlY3V0ZShrZXlBdHRyLnZhbHVlKTtcbiAgICAgICAgbmV3SXRlbXMucHVzaCh7IGl0ZW0sIGlkeDogaW5kZXgsIGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgY29uc3QgbmV3S2V5U2V0ID0gbmV3IFNldChuZXdJdGVtcy5tYXAoKGkpID0+IGkua2V5KSk7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRvbU5vZGVdIG9mIGtleWVkTm9kZXMpIHtcbiAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICB0aGlzLmRlc3Ryb3lOb2RlKGRvbU5vZGUpO1xuICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICBmb3IgKGNvbnN0IHsgaXRlbSwgaWR4LCBrZXkgfSBvZiBuZXdJdGVtcykge1xuICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuXG4gICAgICAgIGlmIChrZXllZE5vZGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGtleWVkTm9kZXMuZ2V0KGtleSkhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgaWYgKGNyZWF0ZWQpIGtleWVkTm9kZXMuc2V0KGtleSwgY3JlYXRlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9XaGlsZSgkd2hpbGU6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcIndoaWxlXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUpO1xuICAgICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIC8vIGV4ZWN1dGVzIGluaXRpYWxpemF0aW9uIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gIHByaXZhdGUgZG9MZXQoaW5pdDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGVhY2hcIl0pO1xuICAgICAgICBpZiAoJGVhY2gpIHtcbiAgICAgICAgICB0aGlzLmRvRWFjaCgkZWFjaCwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRpZiA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAaWZcIl0pO1xuICAgICAgICBpZiAoJGlmKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbbm9kZSBhcyBLTm9kZS5FbGVtZW50LCAkaWZdXTtcblxuICAgICAgICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0gdGhpcy5maW5kQXR0cihub2Rlc1tjdXJyZW50XSBhcyBLTm9kZS5FbGVtZW50LCBbXG4gICAgICAgICAgICAgIFwiQGVsc2VcIixcbiAgICAgICAgICAgICAgXCJAZWxzZWlmXCIsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICR3aGlsZSA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAd2hpbGVcIl0pO1xuICAgICAgICBpZiAoJHdoaWxlKSB7XG4gICAgICAgICAgdGhpcy5kb1doaWxlKCR3aGlsZSwgbm9kZSBhcyBLTm9kZS5FbGVtZW50LCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKG5vZGUgYXMgS05vZGUuRWxlbWVudCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgdGhpcy5kb0xldCgkbGV0LCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJzbG90XCIpIHtcbiAgICAgICAgY29uc3QgbmFtZUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIm5hbWVcIl0pO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZUF0dHIgPyBuYW1lQXR0ci52YWx1ZSA6IFwiZGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBzbG90cyA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJHNsb3RzXCIpO1xuICAgICAgICBpZiAoc2xvdHMgJiYgc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuICAgICAgY29uc3QgZWxlbWVudCA9IGlzVm9pZCA/IHBhcmVudCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZS5uYW1lKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQgIT09IHBhcmVudCkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRyZWZcIiwgZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0NvbXBvbmVudCkge1xuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBhbmQgc2V0IGl0IGFzIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IHt9O1xuICAgICAgICBjb25zdCBhcmdzQXR0ciA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5jcmVhdGVDb21wb25lbnRBcmdzKGFyZ3NBdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZVtdKTtcblxuICAgICAgICAvLyBDYXB0dXJlIGNoaWxkcmVuIGZvciBzbG90c1xuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgS05vZGUuS05vZGVbXT4gPSB7IGRlZmF1bHQ6IFtdIH07XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcInNsb3RcIl0pO1xuICAgICAgICAgICAgaWYgKHNsb3RBdHRyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzbG90QXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFzbG90c1tuYW1lXSkgc2xvdHNbbmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgc2xvdHNbbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzbG90cy5kZWZhdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXT8uY29tcG9uZW50KSB7XG4gICAgICAgICAgY29tcG9uZW50ID0gbmV3IHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5jb21wb25lbnQoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbkluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uSW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHBvc2Ugc2xvdHMgaW4gY29tcG9uZW50IHNjb3BlXG4gICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMsIGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgICAgLy8gZXZlbnQgYmluZGluZ1xuICAgICAgICBjb25zdCBldmVudHMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBmaXJzdClcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoXG4gICAgICAgICAgKGF0dHIpID0+ICEoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgYXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXR0ciwgZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG9ydGhhbmQgYXR0cmlidXRlcyAocHJvY2Vzc2VkIHNlY29uZCwgYWxsb3dzIG1lcmdpbmcpXG4gICAgICAgIGNvbnN0IHNob3J0aGFuZEF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgbmFtZS5zdGFydHNXaXRoKFwiQFwiKSAmJlxuICAgICAgICAgICAgIVtcIkBpZlwiLCBcIkBlbHNlaWZcIiwgXCJAZWxzZVwiLCBcIkBlYWNoXCIsIFwiQHdoaWxlXCIsIFwiQGxldFwiLCBcIkBrZXlcIiwgXCJAcmVmXCJdLmluY2x1ZGVzKFxuICAgICAgICAgICAgICBuYW1lXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIHNob3J0aGFuZEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCByZWFsTmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zbGljZSgxKTtcblxuICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICBsZXQgbGFzdER5bmFtaWNWYWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhdGljQ2xhc3MgPSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBzdGF0aWNDbGFzcy5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGMgPT4gYyAhPT0gbGFzdER5bmFtaWNWYWx1ZSAmJiBjICE9PSBcIlwiKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBjdXJyZW50Q2xhc3NlcyA/IGAke2N1cnJlbnRDbGFzc2VzfSAke3ZhbHVlfWAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgbGFzdER5bmFtaWNWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcblxuICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVhbE5hbWUgIT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gZXhpc3RpbmcgJiYgIWV4aXN0aW5nLmluY2x1ZGVzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKHJlYWxOYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJlbnQgJiYgIWlzVm9pZCkge1xuICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVmQXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQHJlZlwiXSk7XG4gICAgICBpZiAocmVmQXR0ciAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcmVmQXR0ci52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IGVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQocHJvcE5hbWUsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnNlbGYpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZS5jaGlsZHJlbiwgZWxlbWVudCk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuXG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRoaXMuZXJyb3IoZS5tZXNzYWdlIHx8IGAke2V9YCwgbm9kZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5leGVjdXRlKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgW2V2ZW50TmFtZSwgLi4ubW9kaWZpZXJzXSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGxpc3RlbmVyU2NvcGUgPSBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbCA9IGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkgICAgb3B0aW9ucy5vbmNlICAgID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSkgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChldmVudCkgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInByZXZlbnRcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic3RvcFwiKSkgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICB0aGlzLmV4ZWN1dGUoYXR0ci52YWx1ZSwgbGlzdGVuZXJTY29wZSk7XG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlVGVtcGxhdGVTdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb25zdCByZWdleCA9IC9cXHtcXHsuK1xcfVxcfS9tcztcbiAgICBpZiAocmVnZXgudGVzdCh0ZXh0KSkge1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24ocGxhY2Vob2xkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24oc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gYCR7dGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKX1gO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95Tm9kZShub2RlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyAxLiBDbGVhbnVwIGNvbXBvbmVudCBpbnN0YW5jZVxuICAgIGlmIChub2RlLiRrYXNwZXJJbnN0YW5jZSkge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBub2RlLiRrYXNwZXJJbnN0YW5jZTtcbiAgICAgIGlmIChpbnN0YW5jZS5vbkRlc3Ryb3kpIGluc3RhbmNlLm9uRGVzdHJveSgpO1xuICAgICAgaWYgKGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9XG5cbiAgICAvLyAyLiBDbGVhbnVwIGVmZmVjdHMgYXR0YWNoZWQgdG8gdGhlIG5vZGVcbiAgICBpZiAobm9kZS4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIH1cblxuICAgIC8vIDMuIENsZWFudXAgZWZmZWN0cyBvbiBhdHRyaWJ1dGVzXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gNC4gUmVjdXJzZVxuICAgIG5vZGUuY2hpbGROb2Rlcz8uZm9yRWFjaCgoY2hpbGQ6IGFueSkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koY29udGFpbmVyOiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShfbm9kZTogS05vZGUuRG9jdHlwZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIHRhZ05hbWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjbGVhbk1lc3NhZ2UgPSBtZXNzYWdlLnN0YXJ0c1dpdGgoXCJSdW50aW1lIEVycm9yXCIpXG4gICAgICA/IG1lc3NhZ2VcbiAgICAgIDogYFJ1bnRpbWUgRXJyb3I6ICR7bWVzc2FnZX1gO1xuXG4gICAgaWYgKHRhZ05hbWUgJiYgIWNsZWFuTWVzc2FnZS5pbmNsdWRlcyhgYXQgPCR7dGFnTmFtZX0+YCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtjbGVhbk1lc3NhZ2V9XFxuICBhdCA8JHt0YWdOYW1lfT5gKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoY2xlYW5NZXNzYWdlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICB0cnkge1xuICAgIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcGlsZShcbiAgc291cmNlOiBzdHJpbmcsXG4gIGVudGl0eT86IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gIGNvbnRhaW5lcj86IEhUTUxFbGVtZW50LFxuICByZWdpc3RyeT86IENvbXBvbmVudFJlZ2lzdHJ5XG4pOiBOb2RlIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB8fCB7fSB9KTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudGl0eSB8fCB7fSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVyKENvbXBvbmVudENsYXNzOiBhbnkpIHtcbiAgS2FzcGVySW5pdCh7XG4gICAgcm9vdDogXCJrYXNwZXItYXBwXCIsXG4gICAgZW50cnk6IFwia2FzcGVyLXJvb3RcIixcbiAgICByZWdpc3RyeToge1xuICAgICAgXCJrYXNwZXItcm9vdFwiOiB7XG4gICAgICAgIHNlbGVjdG9yOiBcInRlbXBsYXRlXCIsXG4gICAgICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3MsXG4gICAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgICBub2RlczogW10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgQXBwQ29uZmlnIHtcbiAgcm9vdD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoXG4gIHRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsXG4gIHRhZzogc3RyaW5nLFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnlcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVnaXN0cnlbdGFnXS5jb21wb25lbnQoe1xuICAgIHJlZjogZWxlbWVudCxcbiAgICB0cmFuc3BpbGVyOiB0cmFuc3BpbGVyLFxuICAgIGFyZ3M6IHt9LFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIG5vZGU6IGVsZW1lbnQsXG4gICAgaW5zdGFuY2U6IGNvbXBvbmVudCxcbiAgICBub2RlczogcmVnaXN0cnlbdGFnXS5ub2RlcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmVnaXN0cnkoXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSxcbiAgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxuKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHsgLi4ucmVnaXN0cnkgfTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocmVnaXN0cnkpKSB7XG4gICAgY29uc3QgZW50cnkgPSByZWdpc3RyeVtrZXldO1xuICAgIGlmIChlbnRyeS5ub2RlcyAmJiBlbnRyeS5ub2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGVudHJ5LnNlbGVjdG9yKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZW50cnkuc2VsZWN0b3IpO1xuICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIGVudHJ5LnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgIGVudHJ5Lm5vZGVzID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLmlubmVySFRNTCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzdGF0aWNUZW1wbGF0ZSA9IChlbnRyeS5jb21wb25lbnQgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoc3RhdGljVGVtcGxhdGUpIHtcbiAgICAgIGVudHJ5Lm5vZGVzID0gcGFyc2VyLnBhcnNlKHN0YXRpY1RlbXBsYXRlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEthc3BlckluaXQoY29uZmlnOiBBcHBDb25maWcpIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IHJvb3QgPVxuICAgIHR5cGVvZiBjb25maWcucm9vdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KVxuICAgICAgOiBjb25maWcucm9vdDtcblxuICBpZiAoIXJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJvb3QgZWxlbWVudCBub3QgZm91bmQ6ICR7Y29uZmlnLnJvb3R9YCk7XG4gIH1cblxuICBjb25zdCByZWdpc3RyeSA9IG5vcm1hbGl6ZVJlZ2lzdHJ5KGNvbmZpZy5yZWdpc3RyeSwgcGFyc2VyKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IH0pO1xuICBjb25zdCBlbnRyeVRhZyA9IGNvbmZpZy5lbnRyeSB8fCBcImthc3Blci1hcHBcIjtcblxuICBjb25zdCB7IG5vZGUsIGluc3RhbmNlLCBub2RlcyB9ID0gY3JlYXRlQ29tcG9uZW50KFxuICAgIHRyYW5zcGlsZXIsXG4gICAgZW50cnlUYWcsXG4gICAgcmVnaXN0cnlcbiAgKTtcblxuICBpZiAocm9vdCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICByb290LmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG5cbiAgLy8gSW5pdGlhbCByZW5kZXIgYW5kIGxpZmVjeWNsZVxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uSW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25Jbml0KCk7XG4gIH1cblxuICB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgaW5zdGFuY2UsIG5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG4iLCJpbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjxzdHJpbmc+IHtcclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIGV2YWx1YXRlKG5vZGU6IEtOb2RlLktOb2RlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLmFjY2VwdCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0cmFuc3BpbGUobm9kZXM6IEtOb2RlLktOb2RlW10pOiBzdHJpbmdbXSB7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmV2YWx1YXRlKG5vZGUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1gKTtcclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwMCkge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCk6IHN0cmluZyB7XHJcbiAgICBsZXQgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXMubWFwKChhdHRyKSA9PiB0aGlzLmV2YWx1YXRlKGF0dHIpKS5qb2luKFwiIFwiKTtcclxuICAgIGlmIChhdHRycy5sZW5ndGgpIHtcclxuICAgICAgYXR0cnMgPSBcIiBcIiArIGF0dHJzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlLnNlbGYpIHtcclxuICAgICAgcmV0dXJuIGA8JHtub2RlLm5hbWV9JHthdHRyc30vPmA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuLm1hcCgoZWxtKSA9PiB0aGlzLmV2YWx1YXRlKGVsbSkpLmpvaW4oXCJcIik7XHJcbiAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfT4ke2NoaWxkcmVufTwvJHtub2RlLm5hbWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUpOiBzdHJpbmcge1xyXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGAke25vZGUubmFtZX09XCIke25vZGUudmFsdWV9XCJgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGUubmFtZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLnZhbHVlXHJcbiAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcclxuICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxyXG4gICAgICAucmVwbGFjZSgvXFx1MDBhMC9nLCBcIiZuYnNwO1wiKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdENvbW1lbnRLTm9kZShub2RlOiBLTm9kZS5Db21tZW50KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgPCEtLSAke25vZGUudmFsdWV9IC0tPmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhZG9jdHlwZSAke25vZGUudmFsdWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgZXhlY3V0ZSwgdHJhbnNwaWxlLCBLYXNwZXIsIEthc3BlckluaXQgfSBmcm9tIFwiLi9rYXNwZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IFZpZXdlciB9IGZyb20gXCIuL3ZpZXdlclwiO1xuaW1wb3J0IHsgc2lnbmFsLCBlZmZlY3QsIGNvbXB1dGVkLCBiYXRjaCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAoKHdpbmRvdyBhcyBhbnkpIHx8IHt9KS5rYXNwZXIgPSB7XG4gICAgZXhlY3V0ZTogZXhlY3V0ZSxcbiAgICB0cmFuc3BpbGU6IHRyYW5zcGlsZSxcbiAgICBBcHA6IEthc3BlckluaXQsXG4gICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgVGVtcGxhdGVQYXJzZXI6IFRlbXBsYXRlUGFyc2VyLFxuICAgIFRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsXG4gICAgVmlld2VyOiBWaWV3ZXIsXG4gICAgc2lnbmFsOiBzaWduYWwsXG4gICAgZWZmZWN0OiBlZmZlY3QsXG4gICAgY29tcHV0ZWQ6IGNvbXB1dGVkLFxuICAgIGJhdGNoOiBiYXRjaCxcbiAgfTtcbiAgKHdpbmRvdyBhcyBhbnkpW1wiS2FzcGVyXCJdID0gS2FzcGVyO1xuICAod2luZG93IGFzIGFueSlbXCJDb21wb25lbnRcIl0gPSBDb21wb25lbnQ7XG59XG5cbmV4cG9ydCB7IEV4cHJlc3Npb25QYXJzZXIsIEludGVycHJldGVyLCBTY2FubmVyLCBUZW1wbGF0ZVBhcnNlciwgVHJhbnNwaWxlciwgVmlld2VyLCBzaWduYWwsIGVmZmVjdCwgY29tcHV0ZWQsIGJhdGNoIH07XG5leHBvcnQgeyBleGVjdXRlLCB0cmFuc3BpbGUsIEthc3BlciwgS2FzcGVySW5pdCBhcyBBcHAsIENvbXBvbmVudCB9O1xuIl0sIm5hbWVzIjpbIlNldCIsIlRva2VuVHlwZSIsIkV4cHIuRWFjaCIsIkV4cHIuVmFyaWFibGUiLCJFeHByLkJpbmFyeSIsIkV4cHIuQXNzaWduIiwiRXhwci5HZXQiLCJFeHByLlNldCIsIkV4cHIuUGlwZWxpbmUiLCJFeHByLlRlcm5hcnkiLCJFeHByLk51bGxDb2FsZXNjaW5nIiwiRXhwci5Mb2dpY2FsIiwiRXhwci5UeXBlb2YiLCJFeHByLlVuYXJ5IiwiRXhwci5OZXciLCJFeHByLlBvc3RmaXgiLCJFeHByLlNwcmVhZCIsIkV4cHIuQ2FsbCIsIkV4cHIuS2V5IiwiRXhwci5MaXRlcmFsIiwiRXhwci5UZW1wbGF0ZSIsIkV4cHIuQXJyb3dGdW5jdGlvbiIsIkV4cHIuR3JvdXBpbmciLCJFeHByLlZvaWQiLCJFeHByLkRlYnVnIiwiRXhwci5EaWN0aW9uYXJ5IiwiRXhwci5MaXN0IiwiVXRpbHMuaXNEaWdpdCIsIlV0aWxzLmlzQWxwaGFOdW1lcmljIiwiVXRpbHMuY2FwaXRhbGl6ZSIsIlV0aWxzLmlzS2V5d29yZCIsIlV0aWxzLmlzQWxwaGEiLCJQYXJzZXIiLCJDb21tZW50IiwiTm9kZS5Db21tZW50IiwiTm9kZS5Eb2N0eXBlIiwiTm9kZS5FbGVtZW50IiwiTm9kZS5BdHRyaWJ1dGUiLCJOb2RlLlRleHQiXSwibWFwcGluZ3MiOiJBQVNPLE1BQU0sVUFBVTtBQUFBLEVBT3JCLFlBQVksT0FBdUI7QUFMbkMsU0FBQSxPQUE0QixDQUFBO0FBRzVCLFNBQUEsbUJBQW1CLElBQUksZ0JBQUE7QUFHckIsUUFBSSxDQUFDLE9BQU87QUFDVixXQUFLLE9BQU8sQ0FBQTtBQUNaO0FBQUEsSUFDRjtBQUNBLFFBQUksTUFBTSxNQUFNO0FBQ2QsV0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFBO0FBQUEsSUFDNUI7QUFDQSxRQUFJLE1BQU0sS0FBSztBQUNiLFdBQUssTUFBTSxNQUFNO0FBQUEsSUFDbkI7QUFDQSxRQUFJLE1BQU0sWUFBWTtBQUNwQixXQUFLLGFBQWEsTUFBTTtBQUFBLElBQzFCO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUztBQUFBLEVBQUM7QUFBQSxFQUNWLFdBQVc7QUFBQSxFQUFDO0FBQUEsRUFDWixZQUFZO0FBQUEsRUFBQztBQUFBLEVBQ2IsWUFBWTtBQUFBLEVBQUM7QUFBQSxFQUViLFlBQVk7QUFDVixRQUFJLENBQUMsS0FBSyxZQUFZO0FBQ3BCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQzFDTyxNQUFNLG9CQUFvQixNQUFNO0FB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YUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxnQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGlCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFB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VyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsWUFBWSxJQUFJO0FBQ3hDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsYUFBYSxJQUFJO0FBQ3pDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsY0FBYyxJQUFJO0FBQzFDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsWUFBWSxJQUFJO0FBQ3hDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsTUFBTSxJQUFJO0FBQ2xDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFFBQVEsVUFBVTtBQUFBLFVBQzlDO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFlBQVksVUFBVTtBQUFBLFVBQ2xEO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLGVBQWUsVUFBVTtBQUFBLFVBQ3JEO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEtBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksVUFB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
