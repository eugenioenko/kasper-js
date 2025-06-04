var V = Object.defineProperty;
var z = (r, t, e) => t in r ? V(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var a = (r, t, e) => z(r, typeof t != "symbol" ? t + "" : t, e);
class q {
  constructor(t, e, s) {
    a(this, "value");
    a(this, "line");
    a(this, "col");
    this.value = t, this.line = e, this.col = s;
  }
  toString() {
    return this.value.toString();
  }
}
var i = /* @__PURE__ */ ((r) => (r[r.Eof = 0] = "Eof", r[r.Panic = 1] = "Panic", r[r.Ampersand = 2] = "Ampersand", r[r.AtSign = 3] = "AtSign", r[r.Caret = 4] = "Caret", r[r.Comma = 5] = "Comma", r[r.Dollar = 6] = "Dollar", r[r.Dot = 7] = "Dot", r[r.Hash = 8] = "Hash", r[r.LeftBrace = 9] = "LeftBrace", r[r.LeftBracket = 10] = "LeftBracket", r[r.LeftParen = 11] = "LeftParen", r[r.Percent = 12] = "Percent", r[r.Pipe = 13] = "Pipe", r[r.RightBrace = 14] = "RightBrace", r[r.RightBracket = 15] = "RightBracket", r[r.RightParen = 16] = "RightParen", r[r.Semicolon = 17] = "Semicolon", r[r.Slash = 18] = "Slash", r[r.Star = 19] = "Star", r[r.Arrow = 20] = "Arrow", r[r.Bang = 21] = "Bang", r[r.BangEqual = 22] = "BangEqual", r[r.Colon = 23] = "Colon", r[r.Equal = 24] = "Equal", r[r.EqualEqual = 25] = "EqualEqual", r[r.EqualEqualEqual = 26] = "EqualEqualEqual", r[r.Greater = 27] = "Greater", r[r.GreaterEqual = 28] = "GreaterEqual", r[r.Less = 29] = "Less", r[r.LessEqual = 30] = "LessEqual", r[r.Minus = 31] = "Minus", r[r.MinusEqual = 32] = "MinusEqual", r[r.MinusMinus = 33] = "MinusMinus", r[r.PercentEqual = 34] = "PercentEqual", r[r.Plus = 35] = "Plus", r[r.PlusEqual = 36] = "PlusEqual", r[r.PlusPlus = 37] = "PlusPlus", r[r.Question = 38] = "Question", r[r.QuestionDot = 39] = "QuestionDot", r[r.QuestionQuestion = 40] = "QuestionQuestion", r[r.SlashEqual = 41] = "SlashEqual", r[r.StarEqual = 42] = "StarEqual", r[r.DotDot = 43] = "DotDot", r[r.DotDotDot = 44] = "DotDotDot", r[r.LessEqualGreater = 45] = "LessEqualGreater", r[r.Identifier = 46] = "Identifier", r[r.Template = 47] = "Template", r[r.String = 48] = "String", r[r.Number = 49] = "Number", r[r.And = 50] = "And", r[r.Const = 51] = "Const", r[r.Debug = 52] = "Debug", r[r.False = 53] = "False", r[r.Instanceof = 54] = "Instanceof", r[r.New = 55] = "New", r[r.Null = 56] = "Null", r[r.Undefined = 57] = "Undefined", r[r.Of = 58] = "Of", r[r.Or = 59] = "Or", r[r.True = 60] = "True", r[r.Typeof = 61] = "Typeof", r[r.Void = 62] = "Void", r[r.With = 63] = "With", r))(i || {});
class N {
  constructor(t, e, s, n, h) {
    a(this, "name");
    a(this, "line");
    a(this, "col");
    a(this, "type");
    a(this, "literal");
    a(this, "lexeme");
    this.name = i[t], this.type = t, this.lexeme = e, this.literal = s, this.line = n, this.col = h;
  }
  toString() {
    return `[(${this.line}):"${this.lexeme}"]`;
  }
}
const y = [" ", `
`, "	", "\r"], O = [
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
class c {
  // tslint:disable-next-line
  constructor() {
    a(this, "result");
    a(this, "line");
  }
}
class W extends c {
  constructor(e, s, n) {
    super();
    a(this, "name");
    a(this, "value");
    this.name = e, this.value = s, this.line = n;
  }
  accept(e) {
    return e.visitAssignExpr(this);
  }
  toString() {
    return "Expr.Assign";
  }
}
class v extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "left");
    a(this, "operator");
    a(this, "right");
    this.left = e, this.operator = s, this.right = n, this.line = h;
  }
  accept(e) {
    return e.visitBinaryExpr(this);
  }
  toString() {
    return "Expr.Binary";
  }
}
class _ extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "callee");
    a(this, "paren");
    a(this, "args");
    this.callee = e, this.paren = s, this.args = n, this.line = h;
  }
  accept(e) {
    return e.visitCallExpr(this);
  }
  toString() {
    return "Expr.Call";
  }
}
class H extends c {
  constructor(e, s) {
    super();
    a(this, "value");
    this.value = e, this.line = s;
  }
  accept(e) {
    return e.visitDebugExpr(this);
  }
  toString() {
    return "Expr.Debug";
  }
}
class L extends c {
  constructor(e, s) {
    super();
    a(this, "properties");
    this.properties = e, this.line = s;
  }
  accept(e) {
    return e.visitDictionaryExpr(this);
  }
  toString() {
    return "Expr.Dictionary";
  }
}
class j extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "name");
    a(this, "key");
    a(this, "iterable");
    this.name = e, this.key = s, this.iterable = n, this.line = h;
  }
  accept(e) {
    return e.visitEachExpr(this);
  }
  toString() {
    return "Expr.Each";
  }
}
class E extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "entity");
    a(this, "key");
    a(this, "type");
    this.entity = e, this.key = s, this.type = n, this.line = h;
  }
  accept(e) {
    return e.visitGetExpr(this);
  }
  toString() {
    return "Expr.Get";
  }
}
class M extends c {
  constructor(e, s) {
    super();
    a(this, "expression");
    this.expression = e, this.line = s;
  }
  accept(e) {
    return e.visitGroupingExpr(this);
  }
  toString() {
    return "Expr.Grouping";
  }
}
class k extends c {
  constructor(e, s) {
    super();
    a(this, "name");
    this.name = e, this.line = s;
  }
  accept(e) {
    return e.visitKeyExpr(this);
  }
  toString() {
    return "Expr.Key";
  }
}
class A extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "left");
    a(this, "operator");
    a(this, "right");
    this.left = e, this.operator = s, this.right = n, this.line = h;
  }
  accept(e) {
    return e.visitLogicalExpr(this);
  }
  toString() {
    return "Expr.Logical";
  }
}
class D extends c {
  constructor(e, s) {
    super();
    a(this, "value");
    this.value = e, this.line = s;
  }
  accept(e) {
    return e.visitListExpr(this);
  }
  toString() {
    return "Expr.List";
  }
}
class g extends c {
  constructor(e, s) {
    super();
    a(this, "value");
    this.value = e, this.line = s;
  }
  accept(e) {
    return e.visitLiteralExpr(this);
  }
  toString() {
    return "Expr.Literal";
  }
}
class F extends c {
  constructor(e, s) {
    super();
    a(this, "clazz");
    this.clazz = e, this.line = s;
  }
  accept(e) {
    return e.visitNewExpr(this);
  }
  toString() {
    return "Expr.New";
  }
}
class J extends c {
  constructor(e, s, n) {
    super();
    a(this, "left");
    a(this, "right");
    this.left = e, this.right = s, this.line = n;
  }
  accept(e) {
    return e.visitNullCoalescingExpr(this);
  }
  toString() {
    return "Expr.NullCoalescing";
  }
}
class B extends c {
  constructor(e, s, n) {
    super();
    a(this, "name");
    a(this, "increment");
    this.name = e, this.increment = s, this.line = n;
  }
  accept(e) {
    return e.visitPostfixExpr(this);
  }
  toString() {
    return "Expr.Postfix";
  }
}
class $ extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "entity");
    a(this, "key");
    a(this, "value");
    this.entity = e, this.key = s, this.value = n, this.line = h;
  }
  accept(e) {
    return e.visitSetExpr(this);
  }
  toString() {
    return "Expr.Set";
  }
}
class Y extends c {
  constructor(e, s) {
    super();
    a(this, "value");
    this.value = e, this.line = s;
  }
  accept(e) {
    return e.visitTemplateExpr(this);
  }
  toString() {
    return "Expr.Template";
  }
}
class Z extends c {
  constructor(e, s, n, h) {
    super();
    a(this, "condition");
    a(this, "thenExpr");
    a(this, "elseExpr");
    this.condition = e, this.thenExpr = s, this.elseExpr = n, this.line = h;
  }
  accept(e) {
    return e.visitTernaryExpr(this);
  }
  toString() {
    return "Expr.Ternary";
  }
}
class X extends c {
  constructor(e, s) {
    super();
    a(this, "value");
    this.value = e, this.line = s;
  }
  accept(e) {
    return e.visitTypeofExpr(this);
  }
  toString() {
    return "Expr.Typeof";
  }
}
class T extends c {
  constructor(e, s, n) {
    super();
    a(this, "operator");
    a(this, "right");
    this.operator = e, this.right = s, this.line = n;
  }
  accept(e) {
    return e.visitUnaryExpr(this);
  }
  toString() {
    return "Expr.Unary";
  }
}
class x extends c {
  constructor(e, s) {
    super();
    a(this, "name");
    this.name = e, this.line = s;
  }
  accept(e) {
    return e.visitVariableExpr(this);
  }
  toString() {
    return "Expr.Variable";
  }
}
class tt extends c {
  constructor(e, s) {
    super();
    a(this, "value");
    this.value = e, this.line = s;
  }
  accept(e) {
    return e.visitVoidExpr(this);
  }
  toString() {
    return "Expr.Void";
  }
}
class R {
  constructor() {
    a(this, "current", 0);
    a(this, "tokens", []);
    a(this, "errors", []);
    a(this, "errorLevel", 1);
  }
  parse(t) {
    this.current = 0, this.tokens = t, this.errors = [];
    const e = [];
    for (; !this.eof(); )
      try {
        e.push(this.expression());
      } catch (s) {
        if (s instanceof q)
          this.errors.push(`Parse Error (${s.line}:${s.col}) => ${s.value}`);
        else if (this.errors.push(`${s}`), this.errors.length > 100)
          return this.errors.push("Parse Error limit exceeded"), e;
        this.synchronize();
      }
    return e;
  }
  match(...t) {
    for (const e of t)
      if (this.check(e))
        return this.advance(), !0;
    return !1;
  }
  advance() {
    return this.eof() || this.current++, this.previous();
  }
  peek() {
    return this.tokens[this.current];
  }
  previous() {
    return this.tokens[this.current - 1];
  }
  check(t) {
    return this.peek().type === t;
  }
  eof() {
    return this.check(i.Eof);
  }
  consume(t, e) {
    return this.check(t) ? this.advance() : this.error(
      this.peek(),
      e + `, unexpected token "${this.peek().lexeme}"`
    );
  }
  error(t, e) {
    throw new q(e, t.line, t.col);
  }
  synchronize() {
    do {
      if (this.check(i.Semicolon) || this.check(i.RightBrace)) {
        this.advance();
        return;
      }
      this.advance();
    } while (!this.eof());
  }
  foreach(t) {
    this.current = 0, this.tokens = t, this.errors = [];
    const e = this.consume(
      i.Identifier,
      'Expected an identifier inside "each" statement'
    );
    let s = null;
    this.match(i.With) && (s = this.consume(
      i.Identifier,
      'Expected a "key" identifier after "with" keyword in foreach statement'
    )), this.consume(
      i.Of,
      'Expected "of" keyword inside foreach statement'
    );
    const n = this.expression();
    return new j(e, s, n, e.line);
  }
  expression() {
    const t = this.assignment();
    if (this.match(i.Semicolon))
      for (; this.match(i.Semicolon); )
        ;
    return t;
  }
  assignment() {
    const t = this.ternary();
    if (this.match(
      i.Equal,
      i.PlusEqual,
      i.MinusEqual,
      i.StarEqual,
      i.SlashEqual
    )) {
      const e = this.previous();
      let s = this.assignment();
      if (t instanceof x) {
        const n = t.name;
        return e.type !== i.Equal && (s = new v(
          new x(n, n.line),
          e,
          s,
          e.line
        )), new W(n, s, n.line);
      } else if (t instanceof E)
        return e.type !== i.Equal && (s = new v(
          new E(t.entity, t.key, t.type, t.line),
          e,
          s,
          e.line
        )), new $(t.entity, t.key, s, t.line);
      this.error(e, "Invalid l-value, is not an assigning target.");
    }
    return t;
  }
  ternary() {
    const t = this.nullCoalescing();
    if (this.match(i.Question)) {
      const e = this.ternary();
      this.consume(i.Colon, 'Expected ":" after ternary ? expression');
      const s = this.ternary();
      return new Z(t, e, s, t.line);
    }
    return t;
  }
  nullCoalescing() {
    const t = this.logicalOr();
    if (this.match(i.QuestionQuestion)) {
      const e = this.nullCoalescing();
      return new J(t, e, t.line);
    }
    return t;
  }
  logicalOr() {
    let t = this.logicalAnd();
    for (; this.match(i.Or); ) {
      const e = this.previous(), s = this.logicalAnd();
      t = new A(t, e, s, e.line);
    }
    return t;
  }
  logicalAnd() {
    let t = this.equality();
    for (; this.match(i.And); ) {
      const e = this.previous(), s = this.equality();
      t = new A(t, e, s, e.line);
    }
    return t;
  }
  equality() {
    let t = this.addition();
    for (; this.match(
      i.BangEqual,
      i.EqualEqual,
      i.Greater,
      i.GreaterEqual,
      i.Less,
      i.LessEqual
    ); ) {
      const e = this.previous(), s = this.addition();
      t = new v(t, e, s, e.line);
    }
    return t;
  }
  addition() {
    let t = this.modulus();
    for (; this.match(i.Minus, i.Plus); ) {
      const e = this.previous(), s = this.modulus();
      t = new v(t, e, s, e.line);
    }
    return t;
  }
  modulus() {
    let t = this.multiplication();
    for (; this.match(i.Percent); ) {
      const e = this.previous(), s = this.multiplication();
      t = new v(t, e, s, e.line);
    }
    return t;
  }
  multiplication() {
    let t = this.typeof();
    for (; this.match(i.Slash, i.Star); ) {
      const e = this.previous(), s = this.typeof();
      t = new v(t, e, s, e.line);
    }
    return t;
  }
  typeof() {
    if (this.match(i.Typeof)) {
      const t = this.previous(), e = this.typeof();
      return new X(e, t.line);
    }
    return this.unary();
  }
  unary() {
    if (this.match(
      i.Minus,
      i.Bang,
      i.Dollar,
      i.PlusPlus,
      i.MinusMinus
    )) {
      const t = this.previous(), e = this.unary();
      return new T(t, e, t.line);
    }
    return this.newKeyword();
  }
  newKeyword() {
    if (this.match(i.New)) {
      const t = this.previous(), e = this.call();
      return new F(e, t.line);
    }
    return this.call();
  }
  call() {
    let t = this.primary(), e = !0;
    do {
      if (e = !1, this.match(i.LeftParen)) {
        e = !0;
        do {
          const s = [];
          if (!this.check(i.RightParen))
            do
              s.push(this.expression());
            while (this.match(i.Comma));
          const n = this.consume(
            i.RightParen,
            'Expected ")" after arguments'
          );
          t = new _(t, n, s, n.line);
        } while (this.match(i.LeftParen));
      }
      this.match(i.Dot, i.QuestionDot) && (e = !0, t = this.dotGet(t, this.previous())), this.match(i.LeftBracket) && (e = !0, t = this.bracketGet(t, this.previous()));
    } while (e);
    return t;
  }
  dotGet(t, e) {
    const s = this.consume(
      i.Identifier,
      "Expect property name after '.'"
    ), n = new k(s, s.line);
    return new E(t, n, e.type, s.line);
  }
  bracketGet(t, e) {
    let s = null;
    return this.check(i.RightBracket) || (s = this.expression()), this.consume(i.RightBracket, 'Expected "]" after an index'), new E(t, s, e.type, e.line);
  }
  primary() {
    if (this.match(i.False))
      return new g(!1, this.previous().line);
    if (this.match(i.True))
      return new g(!0, this.previous().line);
    if (this.match(i.Null))
      return new g(null, this.previous().line);
    if (this.match(i.Undefined))
      return new g(void 0, this.previous().line);
    if (this.match(i.Number) || this.match(i.String))
      return new g(this.previous().literal, this.previous().line);
    if (this.match(i.Template))
      return new Y(this.previous().literal, this.previous().line);
    if (this.match(i.Identifier)) {
      const t = this.previous();
      return this.match(i.PlusPlus) ? new B(t, 1, t.line) : this.match(i.MinusMinus) ? new B(t, -1, t.line) : new x(t, t.line);
    }
    if (this.match(i.LeftParen)) {
      const t = this.expression();
      return this.consume(i.RightParen, 'Expected ")" after expression'), new M(t, t.line);
    }
    if (this.match(i.LeftBrace))
      return this.dictionary();
    if (this.match(i.LeftBracket))
      return this.list();
    if (this.match(i.Void)) {
      const t = this.expression();
      return new tt(t, this.previous().line);
    }
    if (this.match(i.Debug)) {
      const t = this.expression();
      return new H(t, this.previous().line);
    }
    throw this.error(
      this.peek(),
      `Expected expression, unexpected token "${this.peek().lexeme}"`
    );
  }
  dictionary() {
    const t = this.previous();
    if (this.match(i.RightBrace))
      return new L([], this.previous().line);
    const e = [];
    do
      if (this.match(i.String, i.Identifier, i.Number)) {
        const s = this.previous();
        if (this.match(i.Colon)) {
          const n = this.expression();
          e.push(
            new $(null, new k(s, s.line), n, s.line)
          );
        } else {
          const n = new x(s, s.line);
          e.push(
            new $(null, new k(s, s.line), n, s.line)
          );
        }
      } else
        this.error(
          this.peek(),
          `String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${this.peek().lexeme}`
        );
    while (this.match(i.Comma));
    return this.consume(i.RightBrace, 'Expected "}" after object literal'), new L(e, t.line);
  }
  list() {
    const t = [], e = this.previous();
    if (this.match(i.RightBracket))
      return new D([], this.previous().line);
    do
      t.push(this.expression());
    while (this.match(i.Comma));
    return this.consume(
      i.RightBracket,
      'Expected "]" after array declaration'
    ), new D(t, e.line);
  }
}
function m(r) {
  return r >= "0" && r <= "9";
}
function G(r) {
  return r >= "a" && r <= "z" || r >= "A" && r <= "Z" || r === "$";
}
function et(r) {
  return G(r) || m(r);
}
function st(r) {
  return r.charAt(0).toUpperCase() + r.substring(1).toLowerCase();
}
function rt(r) {
  return i[r] >= i.And;
}
class I {
  constructor() {
    /** scripts source code */
    a(this, "source");
    /** contains the source code represented as list of tokens */
    a(this, "tokens");
    /** List of errors from scanning */
    a(this, "errors");
    /** points to the current character being tokenized */
    a(this, "current");
    /** points to the start of the token  */
    a(this, "start");
    /** current line of source code being tokenized */
    a(this, "line");
    /** current column of the character being tokenized */
    a(this, "col");
    /** maximum number of errors before exiting */
    a(this, "maxErrorcount", 7);
  }
  scan(t) {
    for (this.source = t, this.tokens = [], this.errors = [], this.current = 0, this.start = 0, this.line = 1, this.col = 1; !this.eof(); ) {
      this.start = this.current;
      try {
        this.getToken();
      } catch (e) {
        if (this.errors.push(`${e}`), this.errors.length >= this.maxErrorcount)
          return this.errors.push("Error limit exceeded"), this.tokens;
      }
    }
    return this.tokens.push(new N(i.Eof, "", null, this.line, 0)), this.tokens;
  }
  eof() {
    return this.current >= this.source.length;
  }
  advance() {
    return this.peek() === `
` && (this.line++, this.col = 1), this.current++, this.col++, this.source.charAt(this.current - 1);
  }
  addToken(t, e) {
    const s = this.source.substring(this.start, this.current);
    this.tokens.push(new N(t, s, e, this.line, this.col));
  }
  match(t) {
    return this.eof() || this.source.charAt(this.current) !== t ? !1 : (this.current++, !0);
  }
  peek() {
    return this.eof() ? "\0" : this.source.charAt(this.current);
  }
  peekNext() {
    return this.current + 1 >= this.source.length ? "\0" : this.source.charAt(this.current + 1);
  }
  comment() {
    for (; this.peek() !== `
` && !this.eof(); )
      this.advance();
  }
  multilineComment() {
    for (; !this.eof() && !(this.peek() === "*" && this.peekNext() === "/"); )
      this.advance();
    this.eof() ? this.error('Unterminated comment, expecting closing "*/"') : (this.advance(), this.advance());
  }
  string(t) {
    for (; this.peek() !== t && !this.eof(); )
      this.advance();
    if (this.eof()) {
      this.error(`Unterminated string, expecting closing ${t}`);
      return;
    }
    this.advance();
    const e = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(t !== "`" ? i.String : i.Template, e);
  }
  number() {
    for (; m(this.peek()); )
      this.advance();
    if (this.peek() === "." && m(this.peekNext()))
      for (this.advance(); m(this.peek()); )
        this.advance();
    if (this.peek().toLowerCase() === "e")
      for (this.advance(), (this.peek() === "-" || this.peek() === "+") && this.advance(), m(this.peek()) || this.error("Invalid number: exponent has no digits"); m(this.peek()); )
        this.advance();
    const t = this.source.substring(this.start, this.current);
    this.addToken(i.Number, Number(t));
  }
  identifier() {
    for (; et(this.peek()); )
      this.advance();
    const t = this.source.substring(this.start, this.current), e = st(t);
    rt(e) ? this.addToken(i[e], t) : this.addToken(i.Identifier, t);
  }
  getToken() {
    const t = this.advance();
    switch (t) {
      case "(":
        this.addToken(i.LeftParen, null);
        break;
      case ")":
        this.addToken(i.RightParen, null);
        break;
      case "[":
        this.addToken(i.LeftBracket, null);
        break;
      case "]":
        this.addToken(i.RightBracket, null);
        break;
      case "{":
        this.addToken(i.LeftBrace, null);
        break;
      case "}":
        this.addToken(i.RightBrace, null);
        break;
      case ",":
        this.addToken(i.Comma, null);
        break;
      case ";":
        this.addToken(i.Semicolon, null);
        break;
      case "^":
        this.addToken(i.Caret, null);
        break;
      case "#":
        this.addToken(i.Hash, null);
        break;
      case ":":
        this.match("=") ? this.addToken(i.Arrow, null) : this.addToken(i.Colon, null);
        break;
      case "*":
        this.match("=") ? this.addToken(i.StarEqual, null) : this.addToken(i.Star, null);
        break;
      case "%":
        this.match("=") ? this.addToken(i.PercentEqual, null) : this.addToken(i.Percent, null);
        break;
      case "|":
        this.match("|") ? this.addToken(i.Or, null) : this.addToken(i.Pipe, null);
        break;
      case "&":
        this.match("&") ? this.addToken(i.And, null) : this.addToken(i.Ampersand, null);
        break;
      case ">":
        this.match("=") ? this.addToken(i.GreaterEqual, null) : this.addToken(i.Greater, null);
        break;
      case "!":
        this.match("=") ? this.addToken(i.BangEqual, null) : this.addToken(i.Bang, null);
        break;
      case "?":
        this.match("?") ? this.addToken(i.QuestionQuestion, null) : this.match(".") ? this.addToken(i.QuestionDot, null) : this.addToken(i.Question, null);
        break;
      case "=":
        if (this.match("=")) {
          this.match("=") ? this.addToken(i.EqualEqualEqual, null) : this.addToken(i.EqualEqual, null);
          break;
        }
        this.match(">") ? this.addToken(i.Arrow, null) : this.addToken(i.Equal, null);
        break;
      case "+":
        this.match("+") ? this.addToken(i.PlusPlus, null) : this.match("=") ? this.addToken(i.PlusEqual, null) : this.addToken(i.Plus, null);
        break;
      case "-":
        this.match("-") ? this.addToken(i.MinusMinus, null) : this.match("=") ? this.addToken(i.MinusEqual, null) : this.addToken(i.Minus, null);
        break;
      case "<":
        this.match("=") ? this.match(">") ? this.addToken(i.LessEqualGreater, null) : this.addToken(i.LessEqual, null) : this.addToken(i.Less, null);
        break;
      case ".":
        this.match(".") ? this.match(".") ? this.addToken(i.DotDotDot, null) : this.addToken(i.DotDot, null) : this.addToken(i.Dot, null);
        break;
      case "/":
        this.match("/") ? this.comment() : this.match("*") ? this.multilineComment() : this.match("=") ? this.addToken(i.SlashEqual, null) : this.addToken(i.Slash, null);
        break;
      case "'":
      case '"':
      case "`":
        this.string(t);
        break;
      // ignore cases
      case `
`:
      case " ":
      case "\r":
      case "	":
        break;
      // complex cases
      default:
        m(t) ? this.number() : G(t) ? this.identifier() : this.error(`Unexpected character '${t}'`);
        break;
    }
  }
  error(t) {
    throw new Error(`Scan Error (${this.line}:${this.col}) => ${t}`);
  }
}
class w {
  constructor(t, e) {
    a(this, "values");
    a(this, "parent");
    this.parent = t || null, this.values = e || {};
  }
  init(t) {
    this.values = t || {};
  }
  set(t, e) {
    this.values[t] = e;
  }
  get(t) {
    return typeof this.values[t] < "u" ? this.values[t] : this.parent !== null ? this.parent.get(t) : window[t];
  }
}
class it {
  constructor() {
    a(this, "scope", new w());
    a(this, "errors", []);
    a(this, "scanner", new I());
    a(this, "parser", new R());
  }
  evaluate(t) {
    return t.result = t.accept(this);
  }
  error(t) {
    throw new Error(`Runtime Error => ${t}`);
  }
  visitVariableExpr(t) {
    return this.scope.get(t.name.lexeme);
  }
  visitAssignExpr(t) {
    const e = this.evaluate(t.value);
    return this.scope.set(t.name.lexeme, e), e;
  }
  visitKeyExpr(t) {
    return t.name.literal;
  }
  visitGetExpr(t) {
    const e = this.evaluate(t.entity), s = this.evaluate(t.key);
    if (!(!e && t.type === i.QuestionDot))
      return e[s];
  }
  visitSetExpr(t) {
    const e = this.evaluate(t.entity), s = this.evaluate(t.key), n = this.evaluate(t.value);
    return e[s] = n, n;
  }
  visitPostfixExpr(t) {
    const e = this.scope.get(t.name.lexeme), s = e + t.increment;
    return this.scope.set(t.name.lexeme, s), e;
  }
  visitListExpr(t) {
    const e = [];
    for (const s of t.value) {
      const n = this.evaluate(s);
      e.push(n);
    }
    return e;
  }
  templateParse(t) {
    const e = this.scanner.scan(t), s = this.parser.parse(e);
    this.parser.errors.length && this.error(`Template string  error: ${this.parser.errors[0]}`);
    let n = "";
    for (const h of s)
      n += this.evaluate(h).toString();
    return n;
  }
  visitTemplateExpr(t) {
    return t.value.replace(
      /\{\{([\s\S]+?)\}\}/g,
      (s, n) => this.templateParse(n)
    );
  }
  visitBinaryExpr(t) {
    const e = this.evaluate(t.left), s = this.evaluate(t.right);
    switch (t.operator.type) {
      case i.Minus:
      case i.MinusEqual:
        return e - s;
      case i.Slash:
      case i.SlashEqual:
        return e / s;
      case i.Star:
      case i.StarEqual:
        return e * s;
      case i.Percent:
      case i.PercentEqual:
        return e % s;
      case i.Plus:
      case i.PlusEqual:
        return e + s;
      case i.Pipe:
        return e | s;
      case i.Caret:
        return e ^ s;
      case i.Greater:
        return e > s;
      case i.GreaterEqual:
        return e >= s;
      case i.Less:
        return e < s;
      case i.LessEqual:
        return e <= s;
      case i.EqualEqual:
        return e === s;
      case i.BangEqual:
        return e !== s;
      default:
        return this.error("Unknown binary operator " + t.operator), null;
    }
  }
  visitLogicalExpr(t) {
    const e = this.evaluate(t.left);
    if (t.operator.type === i.Or) {
      if (e)
        return e;
    } else if (!e)
      return e;
    return this.evaluate(t.right);
  }
  visitTernaryExpr(t) {
    return this.evaluate(t.condition).isTruthy() ? this.evaluate(t.thenExpr) : this.evaluate(t.elseExpr);
  }
  visitNullCoalescingExpr(t) {
    const e = this.evaluate(t.left);
    return e || this.evaluate(t.right);
  }
  visitGroupingExpr(t) {
    return this.evaluate(t.expression);
  }
  visitLiteralExpr(t) {
    return t.value;
  }
  visitUnaryExpr(t) {
    const e = this.evaluate(t.right);
    switch (t.operator.type) {
      case i.Minus:
        return -e;
      case i.Bang:
        return !e;
      case i.PlusPlus:
      case i.MinusMinus:
        const s = Number(e) + (t.operator.type === i.PlusPlus ? 1 : -1);
        if (t.right instanceof x)
          this.scope.set(t.right.name.lexeme, s);
        else if (t.right instanceof E) {
          const n = new $(
            t.right.entity,
            t.right.key,
            new g(s, t.line),
            t.line
          );
          this.evaluate(n);
        } else
          this.error(
            `Invalid right-hand side expression in prefix operation:  ${t.right}`
          );
        return s;
      default:
        return this.error("Unknown unary operator ' + expr.operator"), null;
    }
  }
  visitCallExpr(t) {
    const e = this.evaluate(t.callee);
    typeof e != "function" && this.error(`${e} is not a function`);
    const s = [];
    for (const n of t.args)
      s.push(this.evaluate(n));
    return t.callee instanceof E && (t.callee.entity instanceof x || t.callee.entity instanceof M) ? e.apply(t.callee.entity.result, s) : e(...s);
  }
  visitNewExpr(t) {
    const e = t.clazz, s = this.evaluate(e.callee);
    typeof s != "function" && this.error(
      `'${s}' is not a class. 'new' statement must be used with classes.`
    );
    const n = [];
    for (const h of e.args)
      n.push(this.evaluate(h));
    return new s(...n);
  }
  visitDictionaryExpr(t) {
    const e = {};
    for (const s of t.properties) {
      const n = this.evaluate(s.key), h = this.evaluate(s.value);
      e[n] = h;
    }
    return e;
  }
  visitTypeofExpr(t) {
    return typeof this.evaluate(t.value);
  }
  visitEachExpr(t) {
    return [
      t.name.lexeme,
      t.key ? t.key.lexeme : null,
      this.evaluate(t.iterable)
    ];
  }
  visitVoidExpr(t) {
    return this.evaluate(t.value), "";
  }
  visitDebugExpr(t) {
    const e = this.evaluate(t.value);
    return console.log(e), "";
  }
}
class b {
  constructor() {
    a(this, "line");
    a(this, "type");
  }
}
class K extends b {
  constructor(e, s, n, h, l = 0) {
    super();
    a(this, "name");
    a(this, "attributes");
    a(this, "children");
    a(this, "self");
    this.type = "element", this.name = e, this.attributes = s, this.children = n, this.self = h, this.line = l;
  }
  accept(e, s) {
    return e.visitElementKNode(this, s);
  }
  toString() {
    return "KNode.Element";
  }
}
class nt extends b {
  constructor(e, s, n = 0) {
    super();
    a(this, "name");
    a(this, "value");
    this.type = "attribute", this.name = e, this.value = s, this.line = n;
  }
  accept(e, s) {
    return e.visitAttributeKNode(this, s);
  }
  toString() {
    return "KNode.Attribute";
  }
}
class at extends b {
  constructor(e, s = 0) {
    super();
    a(this, "value");
    this.type = "text", this.value = e, this.line = s;
  }
  accept(e, s) {
    return e.visitTextKNode(this, s);
  }
  toString() {
    return "KNode.Text";
  }
}
let ht = class extends b {
  constructor(e, s = 0) {
    super();
    a(this, "value");
    this.type = "comment", this.value = e, this.line = s;
  }
  accept(e, s) {
    return e.visitCommentKNode(this, s);
  }
  toString() {
    return "KNode.Comment";
  }
};
class ct extends b {
  constructor(e, s = 0) {
    super();
    a(this, "value");
    this.type = "doctype", this.value = e, this.line = s;
  }
  accept(e, s) {
    return e.visitDoctypeKNode(this, s);
  }
  toString() {
    return "KNode.Doctype";
  }
}
class U {
  constructor(t) {
    a(this, "scanner", new I());
    a(this, "parser", new R());
    a(this, "interpreter", new it());
    a(this, "errors", []);
    a(this, "registry", {});
    t && t.registry && (this.registry = t.registry);
  }
  evaluate(t, e) {
    t.accept(this, e);
  }
  // evaluates expressions and returns the result of the first evaluation
  execute(t, e) {
    const s = this.scanner.scan(t), n = this.parser.parse(s), h = this.interpreter.scope;
    e && (this.interpreter.scope = e);
    const l = n.map(
      (f) => this.interpreter.evaluate(f)
    );
    return this.interpreter.scope = h, l && l.length ? l[0] : void 0;
  }
  transpile(t, e, s) {
    s.innerHTML = "", this.interpreter.scope.init(e), this.errors = [];
    try {
      this.createSiblings(t, s);
    } catch (n) {
      console.error(`${n}`);
    }
    return s;
  }
  visitElementKNode(t, e) {
    this.createElement(t, e);
  }
  visitTextKNode(t, e) {
    const s = this.evaluateTemplateString(t.value), n = document.createTextNode(s);
    e && e.appendChild(n);
  }
  visitAttributeKNode(t, e) {
    const s = document.createAttribute(t.name);
    t.value && (s.value = this.evaluateTemplateString(t.value)), e && e.setAttributeNode(s);
  }
  visitCommentKNode(t, e) {
    const s = new Comment(t.value);
    e && e.appendChild(s);
  }
  findAttr(t, e) {
    if (!t || !t.attributes || !t.attributes.length)
      return null;
    const s = t.attributes.find(
      (n) => e.includes(n.name)
    );
    return s || null;
  }
  doIf(t, e) {
    if (this.execute(t[0][1].value)) {
      this.createElement(t[0][0], e);
      return;
    }
    for (const n of t.slice(1, t.length)) {
      if (this.findAttr(n[0], ["@elseif"]))
        if (this.execute(n[1].value)) {
          this.createElement(n[0], e);
          return;
        } else
          continue;
      if (this.findAttr(n[0], ["@else"])) {
        this.createElement(n[0], e);
        return;
      }
    }
  }
  doEach(t, e, s) {
    const n = this.scanner.scan(t.value), [h, l, f] = this.interpreter.evaluate(
      this.parser.foreach(n)
    ), u = this.interpreter.scope;
    let p = 0;
    for (const o of f) {
      const d = { [h]: o };
      l && (d[l] = p), this.interpreter.scope = new w(u, d), this.createElement(e, s), p += 1;
    }
    this.interpreter.scope = u;
  }
  doWhile(t, e, s) {
    const n = this.interpreter.scope;
    for (this.interpreter.scope = new w(n); this.execute(t.value); )
      this.createElement(e, s);
    this.interpreter.scope = n;
  }
  // executes initialization in the current scope
  doLet(t, e, s) {
    this.execute(t.value);
    const n = this.createElement(e, s);
    this.interpreter.scope.set("$ref", n);
  }
  createSiblings(t, e) {
    let s = 0;
    for (; s < t.length; ) {
      const n = t[s++];
      if (n.type === "element") {
        const h = this.findAttr(n, ["@each"]);
        if (h) {
          this.doEach(h, n, e);
          continue;
        }
        const l = this.findAttr(n, ["@if"]);
        if (l) {
          const p = [[n, l]], o = n.name;
          let d = !0;
          for (; d && !(s >= t.length); ) {
            const S = this.findAttr(t[s], [
              "@else",
              "@elseif"
            ]);
            t[s].name === o && S ? (p.push([t[s], S]), s += 1) : d = !1;
          }
          this.doIf(p, e);
          continue;
        }
        const f = this.findAttr(n, ["@while"]);
        if (f) {
          this.doWhile(f, n, e);
          continue;
        }
        const u = this.findAttr(n, ["@let"]);
        if (u) {
          this.doLet(u, n, e);
          continue;
        }
      }
      this.evaluate(n, e);
    }
  }
  createElement(t, e) {
    var f;
    const s = t.name === "void", n = !!this.registry[t.name], h = s ? e : document.createElement(t.name), l = this.interpreter.scope;
    if (n) {
      let u = {};
      const p = t.attributes.filter(
        (d) => d.name.startsWith("@:")
      ), o = this.createComponentArgs(p);
      if ((f = this.registry[t.name]) != null && f.component) {
        const d = h, S = this;
        u = new this.registry[t.name].component({
          args: o,
          ref: d,
          transpiler: S
        });
      }
      this.interpreter.scope = new w(l, u), this.createSiblings(this.registry[t.name].nodes, h);
    }
    if (!s) {
      const u = t.attributes.filter(
        (o) => o.name.startsWith("@on:")
      );
      for (const o of u)
        this.createEventListener(h, o);
      const p = t.attributes.filter(
        (o) => !o.name.startsWith("@")
      );
      for (const o of p)
        this.evaluate(o, h);
    }
    return t.self || (this.createSiblings(t.children, h), this.interpreter.scope = l, !s && e && e.appendChild(h)), h;
  }
  createComponentArgs(t) {
    if (!t.length)
      return {};
    const e = {};
    for (const s of t) {
      const n = s.name.split(":")[1];
      e[n] = this.evaluateTemplateString(s.value);
    }
    return e;
  }
  createEventListener(t, e) {
    const s = e.name.split(":")[1], n = new w(this.interpreter.scope);
    t.addEventListener(s, (h) => {
      n.set("$event", h), this.execute(e.value, n);
    });
  }
  evaluateTemplateString(t) {
    return t && (/\{\{.+\}\}/ms.test(t) ? t.replace(/\{\{([\s\S]+?)\}\}/g, (s, n) => this.evaluateExpression(n)) : t);
  }
  evaluateExpression(t) {
    const e = this.scanner.scan(t), s = this.parser.parse(e);
    this.parser.errors.length && this.error(`Template string  error: ${this.parser.errors[0]}`);
    let n = "";
    for (const h of s)
      n += `${this.interpreter.evaluate(h)}`;
    return n;
  }
  visitDoctypeKNode(t) {
    throw "Doctype nodes are not supported in the transpiler.";
  }
  error(t) {
    throw new Error(`Runtime Error => ${t}`);
  }
}
class lt {
  constructor(t) {
    a(this, "args", {});
    a(this, "ref");
    a(this, "transpiler");
    a(this, "$onInit", () => {
    });
    a(this, "$onRender", () => {
    });
    a(this, "$onChanges", () => {
    });
    a(this, "$onDestroy", () => {
    });
    if (!t) {
      this.args = {};
      return;
    }
    t.args && (this.args = t.args || {}), t.ref && (this.ref = t.ref), t.transpiler && (this.transpiler = t.transpiler);
  }
  $doRender() {
    this.transpiler;
  }
}
class C {
  constructor() {
    a(this, "current");
    a(this, "line");
    a(this, "col");
    a(this, "source");
    a(this, "errors");
    a(this, "nodes");
  }
  parse(t) {
    for (this.current = 0, this.line = 1, this.col = 1, this.source = t, this.errors = [], this.nodes = []; !this.eof(); )
      try {
        const e = this.node();
        if (e === null)
          continue;
        this.nodes.push(e);
      } catch (e) {
        if (e instanceof q)
          this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
        else if (this.errors.push(`${e}`), this.errors.length > 10)
          return this.errors.push("Parse Error limit exceeded"), this.nodes;
        break;
      }
    return this.source = "", this.nodes;
  }
  match(...t) {
    for (const e of t)
      if (this.check(e))
        return this.current += e.length, !0;
    return !1;
  }
  advance(t = "") {
    this.eof() ? this.error(`Unexpected end of file. ${t}`) : (this.check(`
`) ? (this.line += 1, this.col = 1) : this.col += 1, this.current++);
  }
  peek(...t) {
    for (const e of t)
      if (this.check(e))
        return !0;
    return !1;
  }
  check(t) {
    return this.source.slice(this.current, this.current + t.length) === t;
  }
  eof() {
    return this.current >= this.source.length;
  }
  error(t) {
    throw new q(t, this.line, this.col);
  }
  node() {
    this.whitespace();
    let t;
    return this.match("</") && this.error("Unexpected closing tag"), this.match("<!--") ? t = this.comment() : this.match("<!doctype") || this.match("<!DOCTYPE") ? t = this.doctype() : this.match("<") ? t = this.element() : t = this.text(), this.whitespace(), t;
  }
  comment() {
    const t = this.current;
    for (; !this.match("-->"); )
      this.eof() && this.error("Unterminated comment: expected closing '-->'"), this.advance("Expected comment closing '-->'");
    const e = this.source.slice(t, this.current - 3);
    return new ht(e, this.line);
  }
  doctype() {
    const t = this.current;
    for (; !this.match(">"); )
      this.eof() && this.error("Unterminated doctype: expected closing '>'"), this.advance("Expected closing doctype");
    const e = this.source.slice(t, this.current - 1).trim();
    return new ct(e, this.line);
  }
  element() {
    const t = this.line, e = this.identifier("/", ">");
    e || this.error("Expected a tag name");
    const s = this.attributes();
    if (this.match("/>") || O.includes(e) && this.match(">"))
      return new K(e, s, [], !0, this.line);
    this.match(">") || this.error("Expected closing tag");
    let n = [];
    return this.whitespace(), this.peek("</") || (n = this.children(e)), this.close(e), new K(e, s, n, !1, t);
  }
  close(t) {
    this.match("</") || this.error(`Expected </${t}>`), this.match(`${t}`) || this.error(`Expected </${t}>`), this.whitespace(), this.match(">") || this.error(`Expected </${t}>`);
  }
  children(t) {
    const e = [];
    do {
      this.eof() && this.error(`Expected </${t}>`);
      const s = this.node();
      s !== null && e.push(s);
    } while (!this.peek("</"));
    return e;
  }
  attributes() {
    const t = [];
    for (; !this.peek(">", "/>") && !this.eof(); ) {
      this.whitespace();
      const e = this.line, s = this.identifier("=", ">", "/>");
      s || this.error("Blank attribute name"), this.whitespace();
      let n = "";
      this.match("=") && (this.whitespace(), this.match("'") ? n = this.string("'") : this.match('"') ? n = this.string('"') : n = this.identifier(">", "/>")), this.whitespace(), t.push(new nt(s, n, e));
    }
    return t;
  }
  text() {
    const t = this.current, e = this.line;
    for (; !this.peek("<") && !this.eof(); )
      this.advance();
    const s = this.source.slice(t, this.current).trim();
    return s ? new at(s, e) : null;
  }
  whitespace() {
    let t = 0;
    for (; this.peek(...y) && !this.eof(); )
      t += 1, this.advance();
    return t;
  }
  identifier(...t) {
    this.whitespace();
    const e = this.current;
    for (; !this.peek(...y, ...t); )
      this.eof() && this.error(`Unterminated identifier: expected closing ${t}`), this.advance(`Expected closing ${t}`);
    const s = this.current;
    return this.whitespace(), this.source.slice(e, s).trim();
  }
  string(t) {
    const e = this.current;
    for (; !this.match(t); )
      this.eof() && this.error(`Unterminated string: expected closing ${t}`), this.advance(`Expected closing ${t}`);
    return this.source.slice(e, this.current - 1);
  }
}
function ot(r) {
  const t = new C(), e = t.parse(r);
  return t.errors.length ? JSON.stringify(t.errors) : JSON.stringify(e);
}
function Q(r, t, e) {
  const n = new C().parse(r);
  return new U().transpile(n, t, e);
}
function ut(r) {
  if (typeof window > "u") {
    console.error("kasper requires a browser environment to render templates.");
    return;
  }
  const t = document.getElementsByTagName("template")[0];
  if (!t) {
    console.error("No template found in the document.");
    return;
  }
  const e = document.getElementsByTagName("kasper-app"), s = Q(
    t.innerHTML,
    r,
    e[0]
  );
  document.body.appendChild(s);
}
class ft {
  constructor() {
    a(this, "entity");
    a(this, "changes", 1);
    a(this, "dirty", !1);
    a(this, "render", () => {
      var t;
      this.changes += 1, this.entity && (typeof ((t = this.entity) == null ? void 0 : t.$onChanges) == "function" && this.entity.$onChanges(), this.changes > 0 && !this.dirty && (this.dirty = !0, queueMicrotask(() => {
        var e;
        ut(this.entity), typeof ((e = this.entity) == null ? void 0 : e.$onRender) == "function" && this.entity.$onRender(), this.dirty = !1, this.changes = 0;
      })));
    });
  }
}
let P = new ft();
class pt {
  constructor(t) {
    a(this, "_value");
    this._value = t;
  }
  get value() {
    return this._value;
  }
  set(t) {
    this._value = t, P.render();
  }
  toString() {
    return this._value.toString();
  }
}
function dt(r) {
  return new pt(r);
}
function mt(r) {
  const t = new r();
  P.entity = t, P.render(), typeof t.$onInit == "function" && t.$onInit();
}
function vt(r, t, e) {
  const s = document.createElement(t), n = new e[t].component();
  n.$onInit();
  const h = e[t].nodes;
  return r.transpile(h, n, s);
}
function gt(r, t) {
  const e = { ...r };
  for (const s of Object.keys(r)) {
    const n = r[s];
    n.template = document.querySelector(n.selector), n.nodes = t.parse(n.template.innerHTML);
  }
  return e;
}
function Et(r) {
  const t = new C(), e = document.querySelector(r.root || "body"), s = gt(r.registry, t), n = new U({ registry: s }), h = r.entry || "kasper-app", l = vt(n, h, s);
  e.appendChild(l);
}
class bt {
  constructor() {
    a(this, "errors", []);
  }
  evaluate(t) {
    return t.accept(this);
  }
  transpile(t) {
    this.errors = [];
    const e = [];
    for (const s of t)
      try {
        e.push(this.evaluate(s));
      } catch (n) {
        if (console.error(`${n}`), this.errors.push(`${n}`), this.errors.length > 100)
          return this.errors.push("Error limit exceeded"), e;
      }
    return e;
  }
  visitElementKNode(t) {
    let e = t.attributes.map((n) => this.evaluate(n)).join(" ");
    if (e.length && (e = " " + e), t.self)
      return `<${t.name}${e}/>`;
    const s = t.children.map((n) => this.evaluate(n)).join("");
    return `<${t.name}${e}>${s}</${t.name}>`;
  }
  visitAttributeKNode(t) {
    return t.value ? `${t.name}="${t.value}"` : t.name;
  }
  visitTextKNode(t) {
    return t.value;
  }
  visitCommentKNode(t) {
    return `<!-- ${t.value} -->`;
  }
  visitDoctypeKNode(t) {
    return `<!doctype ${t.value}>`;
  }
  error(t) {
    throw new Error(`Runtime Error => ${t}`);
  }
}
function St() {
  (window || {}).kasper = {
    execute: ot,
    transpile: Q,
    App: Et
  }, window.Kasper = mt, window.Component = lt, window.$state = dt;
}
export {
  R as ExpressionParser,
  St as InitKasper,
  it as Interpreter,
  I as Scanner,
  C as TemplateParser,
  U as Transpiler,
  bt as Viewer
};
