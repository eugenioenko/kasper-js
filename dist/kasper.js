const KErrorCode = {
  // Bootstrap
  ROOT_ELEMENT_NOT_FOUND: "K001-1",
  ENTRY_COMPONENT_NOT_FOUND: "K001-2",
  // Scanner
  UNTERMINATED_COMMENT: "K002-1",
  UNTERMINATED_STRING: "K002-2",
  UNEXPECTED_CHARACTER: "K002-3",
  // Template Parser
  UNEXPECTED_EOF: "K003-1",
  UNEXPECTED_CLOSING_TAG: "K003-2",
  EXPECTED_TAG_NAME: "K003-3",
  EXPECTED_CLOSING_BRACKET: "K003-4",
  EXPECTED_CLOSING_TAG: "K003-5",
  BLANK_ATTRIBUTE_NAME: "K003-6",
  MISPLACED_CONDITIONAL: "K003-7",
  DUPLICATE_IF: "K003-8",
  // Expression Parser
  UNEXPECTED_TOKEN: "K004-1",
  INVALID_LVALUE: "K004-2",
  EXPECTED_EXPRESSION: "K004-3",
  INVALID_DICTIONARY_KEY: "K004-4",
  // Interpreter
  INVALID_POSTFIX_LVALUE: "K005-1",
  UNKNOWN_BINARY_OPERATOR: "K005-2",
  INVALID_PREFIX_RVALUE: "K005-3",
  UNKNOWN_UNARY_OPERATOR: "K005-4",
  NOT_A_FUNCTION: "K005-5",
  NOT_A_CLASS: "K005-6",
  // Signals
  CIRCULAR_COMPUTED: "K006-1",
  // Transpiler
  RUNTIME_ERROR: "K007-1",
  MISSING_REQUIRED_ATTR: "K007-2"
};
const ErrorTemplates = {
  "K001-1": (a) => `Root element not found: ${a.root}`,
  "K001-2": (a) => `Entry component <${a.tag}> not found in registry.`,
  "K002-1": () => 'Unterminated comment, expecting closing "*/"',
  "K002-2": (a) => `Unterminated string, expecting closing ${a.quote}`,
  "K002-3": (a) => `Unexpected character '${a.char}'`,
  "K003-1": (a) => `Unexpected end of file. ${a.eofError}`,
  "K003-2": () => "Unexpected closing tag",
  "K003-3": () => "Expected a tag name",
  "K003-4": () => "Expected closing tag >",
  "K003-5": (a) => `Expected </${a.name}>`,
  "K003-6": () => "Blank attribute name",
  "K003-7": (a) => `@${a.name} must be preceded by an @if or @elseif block.`,
  "K003-8": () => "Multiple conditional directives (@if, @elseif, @else) on the same element are not allowed.",
  "K004-1": (a) => `${a.message}, unexpected token "${a.token}"`,
  "K004-2": () => "Invalid l-value, is not an assigning target.",
  "K004-3": (a) => `Expected expression, unexpected token "${a.token}"`,
  "K004-4": (a) => `String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${a.token}`,
  "K005-1": (a) => `Invalid left-hand side in postfix operation: ${a.entity}`,
  "K005-2": (a) => `Unknown binary operator ${a.operator}`,
  "K005-3": (a) => `Invalid right-hand side expression in prefix operation: ${a.right}`,
  "K005-4": (a) => `Unknown unary operator ${a.operator}`,
  "K005-5": (a) => `${a.callee} is not a function`,
  "K005-6": (a) => `'${a.clazz}' is not a class. 'new' statement must be used with classes.`,
  "K006-1": () => "Circular dependency detected in computed signal",
  "K007-1": (a) => a.message,
  "K007-2": (a) => a.message
};
class KasperError extends Error {
  constructor(code, args = {}, line, col, tagName) {
    const isDev = typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
    const template = ErrorTemplates[code];
    const message = template ? template(args) : typeof args === "string" ? args : "Unknown error";
    const location = line !== void 0 ? ` (${line}:${col})` : "";
    const tagInfo = tagName ? `
  at <${tagName}>` : "";
    const link = isDev ? `

See: https://kasperjs.top/reference/errors#${code.toLowerCase().replace(".", "")}` : "";
    super(`[${code}] ${message}${location}${tagInfo}${link}`);
    this.code = code;
    this.args = args;
    this.line = line;
    this.col = col;
    this.tagName = tagName;
    this.name = "KasperError";
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
        const subs = Array.from(this.subscribers);
        for (const sub of subs) {
          sub();
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
  onChange(fn, options) {
    var _a;
    if ((_a = options == null ? void 0 : options.signal) == null ? void 0 : _a.aborted) return () => {
    };
    this.watchers.add(fn);
    const stop = () => this.watchers.delete(fn);
    if (options == null ? void 0 : options.signal) {
      options.signal.addEventListener("abort", stop, { once: true });
    }
    return stop;
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
class ComputedSignal extends Signal {
  constructor(fn, options) {
    super(void 0);
    this.computing = false;
    this.fn = fn;
    const stop = effect(() => {
      if (this.computing) {
        throw new KasperError(KErrorCode.CIRCULAR_COMPUTED);
      }
      this.computing = true;
      try {
        super.value = this.fn();
      } finally {
        this.computing = false;
      }
    }, options);
    if (options == null ? void 0 : options.signal) {
      options.signal.addEventListener("abort", stop, { once: true });
    }
  }
  get value() {
    return super.value;
  }
  set value(_v) {
  }
}
function effect(fn, options) {
  var _a;
  if ((_a = options == null ? void 0 : options.signal) == null ? void 0 : _a.aborted) return () => {
  };
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
  const stop = () => {
    effectObj.deps.forEach((sig) => sig.unsubscribe(effectObj.fn));
    effectObj.deps.clear();
  };
  stop.run = effectObj.fn;
  if (options == null ? void 0 : options.signal) {
    options.signal.addEventListener("abort", stop, { once: true });
  }
  return stop;
}
function signal(initialValue) {
  return new Signal(initialValue);
}
function watch(sig, fn, options) {
  return sig.onChange(fn, options);
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
      sub();
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
function computed(fn, options) {
  return new ComputedSignal(fn, options);
}
class Component {
  constructor(props) {
    this.args = {};
    this.$abortController = new AbortController();
    if (!props) {
      this.args = {};
      return;
    }
    if (props.args) {
      this.args = props.args;
    }
    if (props.ref) {
      this.ref = props.ref;
    }
    if (props.transpiler) {
      this.transpiler = props.transpiler;
    }
  }
  /**
   * Creates a reactive effect tied to the component's lifecycle.
   * Runs immediately and re-runs when any signal dependency changes.
   */
  effect(fn) {
    effect(fn, { signal: this.$abortController.signal });
  }
  /**
   * Watches a specific signal for changes.
   * Does NOT run immediately.
   */
  watch(sig, fn) {
    sig.onChange(fn, { signal: this.$abortController.signal });
  }
  /**
   * Creates a computed signal tied to the component's lifecycle.
   * The internal effect is automatically cleaned up when the component is destroyed.
   */
  computed(fn) {
    return computed(fn, { signal: this.$abortController.signal });
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
  constructor(clazz, args, line) {
    super();
    this.clazz = clazz;
    this.args = args;
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
      KErrorCode.UNEXPECTED_TOKEN,
      this.peek(),
      { message, token: this.peek().lexeme }
    );
  }
  error(code, token, args = {}) {
    throw new KasperError(code, args, token.line, token.col);
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
      this.error(KErrorCode.INVALID_LVALUE, operator);
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
      const construct = this.call();
      if (construct instanceof Call) {
        return new New(construct.callee, construct.args, keyword.line);
      }
      return new New(construct, [], keyword.line);
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
      KErrorCode.EXPECTED_EXPRESSION,
      this.peek(),
      { token: this.peek().lexeme }
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
          KErrorCode.INVALID_DICTIONARY_KEY,
          this.peek(),
          { token: this.peek().lexeme }
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
      this.error(KErrorCode.UNTERMINATED_COMMENT);
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
      this.error(KErrorCode.UNTERMINATED_STRING, { quote });
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
          this.error(KErrorCode.UNEXPECTED_CHARACTER, { char });
        }
        break;
    }
  }
  error(code, args = {}) {
    throw new KasperError(code, args, this.line, this.col);
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
  error(code, args = {}, line, col) {
    throw new KasperError(code, args, line, col);
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
      this.error(KErrorCode.INVALID_POSTFIX_LVALUE, { entity: expr.entity }, expr.line);
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
        this.error(KErrorCode.UNKNOWN_BINARY_OPERATOR, { operator: expr.operator }, expr.line);
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
            KErrorCode.INVALID_PREFIX_RVALUE,
            { right: expr.right },
            expr.line
          );
        }
        return newValue;
      }
      default:
        this.error(KErrorCode.UNKNOWN_UNARY_OPERATOR, { operator: expr.operator }, expr.line);
        return null;
    }
  }
  visitCallExpr(expr) {
    const callee = this.evaluate(expr.callee);
    if (callee == null && expr.optional) return void 0;
    if (typeof callee !== "function") {
      this.error(KErrorCode.NOT_A_FUNCTION, { callee }, expr.line);
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
    const clazz = this.evaluate(expr.clazz);
    if (typeof clazz !== "function") {
      this.error(
        KErrorCode.NOT_A_CLASS,
        { clazz },
        expr.line
      );
    }
    const args = [];
    for (const arg of expr.args) {
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
      if (!this.eof()) {
        this.current++;
      } else {
        this.error(KErrorCode.UNEXPECTED_EOF, { eofError });
      }
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
  error(code, args = {}) {
    throw new KasperError(code, args, this.line, this.col);
  }
  node() {
    this.whitespace();
    let node;
    if (this.match("</")) {
      this.error(KErrorCode.UNEXPECTED_CLOSING_TAG);
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
      this.error(KErrorCode.EXPECTED_TAG_NAME);
    }
    const attributes = this.attributes();
    if (this.match("/>") || SelfClosingTags.includes(name) && this.match(">")) {
      return new Element(name, attributes, [], true, this.line);
    }
    if (!this.match(">")) {
      this.error(KErrorCode.EXPECTED_CLOSING_BRACKET);
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
      this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name });
    }
    if (!this.match(`${name}`)) {
      this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name });
    }
    this.whitespace();
    if (!this.match(">")) {
      this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name });
    }
  }
  children(parent) {
    const children = [];
    do {
      if (this.eof()) {
        this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name: parent });
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
        this.error(KErrorCode.BLANK_ATTRIBUTE_NAME);
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
const queue = /* @__PURE__ */ new Map();
const nextTickCallbacks = [];
let isScheduled = false;
let batchingEnabled = true;
function flush() {
  isScheduled = false;
  for (const [instance, tasks] of queue.entries()) {
    try {
      if (typeof instance.onChanges === "function") {
        instance.onChanges();
      }
      for (const task of tasks) {
        task();
      }
      if (typeof instance.onRender === "function") {
        instance.onRender();
      }
    } catch (e) {
      console.error("[Kasper] Error during component update:", e);
    }
  }
  queue.clear();
  const callbacks = nextTickCallbacks.splice(0);
  for (const cb of callbacks) {
    try {
      cb();
    } catch (e) {
      console.error("[Kasper] Error in nextTick callback:", e);
    }
  }
}
function queueUpdate(instance, task) {
  if (!batchingEnabled) {
    task();
    return;
  }
  if (!queue.has(instance)) {
    queue.set(instance, []);
  }
  queue.get(instance).push(task);
  if (!isScheduled) {
    isScheduled = true;
    queueMicrotask(flush);
  }
}
function flushSync(fn) {
  const prev = batchingEnabled;
  batchingEnabled = false;
  try {
    fn();
  } finally {
    batchingEnabled = prev;
  }
}
function nextTick(cb) {
  if (cb) {
    nextTickCallbacks.push(cb);
    if (!isScheduled) {
      isScheduled = true;
      queueMicrotask(flush);
    }
    return;
  }
  return new Promise((resolve) => {
    nextTickCallbacks.push(resolve);
    if (!isScheduled) {
      isScheduled = true;
      queueMicrotask(flush);
    }
  });
}
class Transpiler {
  constructor(options) {
    this.scanner = new Scanner();
    this.parser = new ExpressionParser();
    this.interpreter = new Interpreter();
    this.registry = {};
    this.mode = "development";
    this.isRendering = false;
    this.registry["router"] = { component: Router, nodes: [] };
    if (!options) return;
    if (options.registry) {
      this.registry = { ...this.registry, ...options.registry };
    }
  }
  evaluate(node, parent) {
    if (node.type === "element") {
      const el = node;
      const misplaced = this.findAttr(el, ["@elseif", "@else"]);
      if (misplaced) {
        const name = misplaced.name.startsWith("@") ? misplaced.name.slice(1) : misplaced.name;
        this.error(KErrorCode.MISPLACED_CONDITIONAL, { name }, el.name);
      }
    }
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
    return result && result.length ? result[result.length - 1] : void 0;
  }
  transpile(nodes, entity, container) {
    this.isRendering = true;
    try {
      this.destroy(container);
      container.innerHTML = "";
      this.bindMethods(entity);
      this.interpreter.scope.init(entity);
      this.interpreter.scope.set("$instance", entity);
      flushSync(() => {
        this.createSiblings(nodes, container);
        this.triggerRender();
      });
      return container;
    } finally {
      this.isRendering = false;
    }
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
        const newValue = this.evaluateTemplateString(node.value);
        const instance = this.interpreter.scope.get("$instance");
        if (instance) {
          queueUpdate(instance, () => {
            text.textContent = newValue;
          });
        } else {
          text.textContent = newValue;
        }
      });
      this.trackEffect(text, stop);
    } catch (e) {
      this.error(KErrorCode.RUNTIME_ERROR, { message: e.message || `${e}` }, "text node");
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
    const run = () => {
      const instance = this.interpreter.scope.get("$instance");
      const trackingScope = instance ? new Scope(this.interpreter.scope) : this.interpreter.scope;
      const prevScope = this.interpreter.scope;
      this.interpreter.scope = trackingScope;
      const results = [];
      results.push(!!this.execute(expressions[0][1].value));
      if (!results[0]) {
        for (const expression of expressions.slice(1)) {
          if (this.findAttr(expression[0], ["@elseif"])) {
            const val = !!this.execute(expression[1].value);
            results.push(val);
            if (val) break;
          } else if (this.findAttr(expression[0], ["@else"])) {
            results.push(true);
            break;
          }
        }
      }
      this.interpreter.scope = prevScope;
      const task = () => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();
        const restoreScope = this.interpreter.scope;
        this.interpreter.scope = trackingScope;
        try {
          if (results[0]) {
            expressions[0][0].accept(this, boundary);
            return;
          }
          for (let i = 1; i < results.length; i++) {
            if (results[i]) {
              expressions[i][0].accept(this, boundary);
              return;
            }
          }
        } finally {
          this.interpreter.scope = restoreScope;
        }
      };
      if (instance) {
        queueUpdate(instance, task);
      } else {
        task();
      }
    };
    boundary.start.$kasperRefresh = run;
    const stop = this.scopedEffect(run);
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
    const run = () => {
      const tokens = this.scanner.scan(each.value);
      const [name, key, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );
      const instance = this.interpreter.scope.get("$instance");
      const task = () => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();
        let index = 0;
        for (const item of iterable) {
          const scopeValues = { [name]: item };
          if (key) scopeValues[key] = index;
          this.interpreter.scope = new Scope(originalScope, scopeValues);
          this.createElement(node, boundary);
          index += 1;
        }
        this.interpreter.scope = originalScope;
      };
      if (instance) {
        queueUpdate(instance, task);
      } else {
        task();
      }
    };
    boundary.start.$kasperRefresh = run;
    const stop = this.scopedEffect(run);
    this.trackEffect(boundary, stop);
  }
  triggerRefresh(node) {
    var _a;
    if (node.$kasperRefresh) {
      node.$kasperRefresh();
    }
    if (node.$kasperEffects) {
      node.$kasperEffects.forEach((stop) => {
        if (typeof stop.run === "function") {
          stop.run();
        }
      });
    }
    (_a = node.childNodes) == null ? void 0 : _a.forEach((child) => this.triggerRefresh(child));
  }
  doEachKeyed(each, node, parent, keyAttr) {
    const boundary = new Boundary(parent, "each");
    const originalScope = this.interpreter.scope;
    const keyedNodes = /* @__PURE__ */ new Map();
    const run = () => {
      const tokens = this.scanner.scan(each.value);
      const [name, indexKey, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );
      const instance = this.interpreter.scope.get("$instance");
      const newItems = [];
      const seenKeys = /* @__PURE__ */ new Set();
      let index = 0;
      for (const item of iterable) {
        const scopeValues = { [name]: item };
        if (indexKey) scopeValues[indexKey] = index;
        this.interpreter.scope = new Scope(originalScope, scopeValues);
        const key = this.execute(keyAttr.value);
        if (this.mode === "development" && seenKeys.has(key)) {
          console.warn(`[Kasper] Duplicate key detected in @each: "${key}". Keys must be unique to ensure correct reconciliation.`);
        }
        seenKeys.add(key);
        newItems.push({ item, idx: index, key });
        index++;
      }
      const task = () => {
        var _a;
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
            const domNode = keyedNodes.get(key);
            boundary.insert(domNode);
            const nodeScope = domNode.$kasperScope;
            if (nodeScope) {
              nodeScope.set(name, item);
              if (indexKey) nodeScope.set(indexKey, idx);
              this.triggerRefresh(domNode);
            }
          } else {
            const created = this.createElement(node, boundary);
            if (created) {
              keyedNodes.set(key, created);
              created.$kasperScope = this.interpreter.scope;
            }
          }
        }
        this.interpreter.scope = originalScope;
      };
      if (instance) {
        queueUpdate(instance, task);
      } else {
        task();
      }
    };
    boundary.start.$kasperRefresh = run;
    const stop = this.scopedEffect(run);
    this.trackEffect(boundary, stop);
  }
  doWhile($while, node, parent) {
    const boundary = new Boundary(parent, "while");
    const originalScope = this.interpreter.scope;
    const run = () => {
      const instance = this.interpreter.scope.get("$instance");
      if (instance) {
        const trackingScope = new Scope(originalScope);
        const prevScope = this.interpreter.scope;
        this.interpreter.scope = trackingScope;
        const firstCondition = !!this.execute($while.value);
        this.interpreter.scope = prevScope;
        const task = () => {
          boundary.nodes().forEach((n) => this.destroyNode(n));
          boundary.clear();
          const restoreScope = this.interpreter.scope;
          this.interpreter.scope = trackingScope;
          let currentCondition = firstCondition;
          while (currentCondition) {
            this.createElement(node, boundary);
            currentCondition = !!this.execute($while.value);
          }
          this.interpreter.scope = restoreScope;
        };
        queueUpdate(instance, task);
      } else {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();
        this.interpreter.scope = new Scope(originalScope);
        while (this.execute($while.value)) {
          this.createElement(node, boundary);
        }
        this.interpreter.scope = originalScope;
      }
    };
    boundary.start.$kasperRefresh = run;
    const stop = this.scopedEffect(run);
    this.trackEffect(boundary, stop);
  }
  // executes initialization in the current scope
  doLet(init, node, parent) {
    const restoreScope = this.interpreter.scope;
    this.interpreter.scope = new Scope(restoreScope);
    this.execute(init.value);
    this.createElement(node, parent);
    this.interpreter.scope = restoreScope;
  }
  createSiblings(nodes, parent) {
    let current = 0;
    while (current < nodes.length) {
      const node = nodes[current++];
      if (node.type === "element") {
        const el = node;
        const ifAttr = this.findAttr(el, ["@if"]);
        const elseifAttr = this.findAttr(el, ["@elseif"]);
        const elseAttr = this.findAttr(el, ["@else"]);
        if ([ifAttr, elseifAttr, elseAttr].filter((a) => a).length > 1) {
          this.error(KErrorCode.DUPLICATE_IF, {}, el.name);
        }
        const $each = this.findAttr(el, ["@each"]);
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
            this.isRendering = true;
            try {
              this.destroy(element);
              element.innerHTML = "";
              const scope = new Scope(restoreScope, component);
              scope.set("$instance", component);
              component.$slots = slots;
              const prevScope = this.interpreter.scope;
              this.interpreter.scope = scope;
              flushSync(() => {
                this.createSiblings(componentNodes, element);
                if (typeof component.onRender === "function") component.onRender();
              });
              this.interpreter.scope = prevScope;
            } finally {
              this.isRendering = false;
            }
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
        flushSync(() => {
          this.createSiblings(this.registry[node.name].nodes, element);
          if (component && typeof component.onRender === "function") {
            component.onRender();
          }
        });
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
              const instance = this.interpreter.scope.get("$instance");
              const task = () => {
                const staticClass = element.getAttribute("class") || "";
                const currentClasses = staticClass.split(" ").filter((c) => c !== lastDynamicValue && c !== "").join(" ");
                const newValue = currentClasses ? `${currentClasses} ${value}` : value;
                element.setAttribute("class", newValue);
                lastDynamicValue = value;
              };
              if (instance) {
                queueUpdate(instance, task);
              } else {
                task();
              }
            });
            this.trackEffect(element, stop);
          } else {
            const stop = this.scopedEffect(() => {
              const value = this.execute(attr.value);
              const instance = this.interpreter.scope.get("$instance");
              const task = () => {
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
              };
              if (instance) {
                queueUpdate(instance, task);
              } else {
                task();
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
      this.error(KErrorCode.RUNTIME_ERROR, { message: e.message || `${e}` }, node.name);
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
      if (instance.onDestroy) {
        instance.onDestroy();
      }
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
      this.isRendering = true;
      try {
        this.destroy(host);
        host.innerHTML = "";
        const scope2 = new Scope(null, component);
        scope2.set("$instance", component);
        const prev2 = this.interpreter.scope;
        this.interpreter.scope = scope2;
        flushSync(() => {
          this.createSiblings(componentNodes, host);
          if (typeof component.onRender === "function") component.onRender();
        });
        this.interpreter.scope = prev2;
      } finally {
        this.isRendering = false;
      }
    };
    if (typeof component.onMount === "function") component.onMount();
    const scope = new Scope(null, component);
    scope.set("$instance", component);
    const prev = this.interpreter.scope;
    this.interpreter.scope = scope;
    flushSync(() => {
      this.createSiblings(nodes, host);
      if (typeof component.onRender === "function") component.onRender();
    });
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
        if (!pathAttr || !componentAttr) {
          this.error(KErrorCode.MISSING_REQUIRED_ATTR, { message: "<route> requires @path and @component attributes." }, el.name);
        }
        const path = pathAttr.value;
        const component = this.execute(componentAttr.value);
        const guard = guardAttr ? this.execute(guardAttr.value) : parentGuard;
        routes.push({ path, component, guard });
      } else if (el.name === "guard") {
        const checkAttr = this.findAttr(el, ["@check"]);
        if (!checkAttr) {
          this.error(KErrorCode.MISSING_REQUIRED_ATTR, { message: "<guard> requires @check attribute." }, el.name);
        }
        if (!checkAttr) continue;
        const check = this.execute(checkAttr.value);
        routes.push(...this.extractRoutes(el.children, check));
      }
    }
    if (scope) this.interpreter.scope = prevScope;
    return routes;
  }
  triggerRender() {
    if (this.isRendering) return;
    const instance = this.interpreter.scope.get("$instance");
    if (instance && typeof instance.onRender === "function") {
      instance.onRender();
    }
  }
  visitDoctypeKNode(_node) {
    return;
  }
  error(code, args, tagName) {
    let finalArgs = args;
    if (typeof args === "string") {
      const cleanMessage = args.includes("Runtime Error") ? args.replace("Runtime Error: ", "") : args;
      finalArgs = { message: cleanMessage };
    }
    throw new KasperError(code, finalArgs, void 0, void 0, tagName);
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
  bootstrap({
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
    if (typeof entry.template === "string") {
      entry.nodes = parser.parse(entry.template);
      continue;
    }
    const staticTemplate = entry.component.template;
    if (staticTemplate) {
      entry.nodes = parser.parse(staticTemplate);
    }
  }
  return result;
}
function bootstrap(config) {
  const parser = new TemplateParser();
  const root = typeof config.root === "string" ? document.querySelector(config.root) : config.root;
  if (!root) {
    throw new KasperError(
      KErrorCode.ROOT_ELEMENT_NOT_FOUND,
      { root: config.root }
    );
  }
  const entryTag = config.entry || "kasper-app";
  if (!config.registry[entryTag]) {
    throw new KasperError(
      KErrorCode.ENTRY_COMPONENT_NOT_FOUND,
      { tag: entryTag }
    );
  }
  const registry = normalizeRegistry(config.registry, parser);
  const transpiler = new Transpiler({ registry });
  if (config.mode) {
    transpiler.mode = config.mode;
  } else {
    transpiler.mode = "development";
  }
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
  bootstrap as App,
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
  nextTick,
  signal,
  transpile,
  watch
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvc2lnbmFsLnRzIiwiLi4vc3JjL2NvbXBvbmVudC50cyIsIi4uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIi4uL3NyYy90eXBlcy90b2tlbi50cyIsIi4uL3NyYy9leHByZXNzaW9uLXBhcnNlci50cyIsIi4uL3NyYy91dGlscy50cyIsIi4uL3NyYy9zY2FubmVyLnRzIiwiLi4vc3JjL3Njb3BlLnRzIiwiLi4vc3JjL2ludGVycHJldGVyLnRzIiwiLi4vc3JjL3R5cGVzL25vZGVzLnRzIiwiLi4vc3JjL3RlbXBsYXRlLXBhcnNlci50cyIsIi4uL3NyYy9yb3V0ZXIudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvc2NoZWR1bGVyLnRzIiwiLi4vc3JjL3RyYW5zcGlsZXIudHMiLCIuLi9zcmMva2FzcGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBLRXJyb3JDb2RlID0ge1xuICAvLyBCb290c3RyYXBcbiAgUk9PVF9FTEVNRU5UX05PVF9GT1VORDogXCJLMDAxLTFcIixcbiAgRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORDogXCJLMDAxLTJcIixcblxuICAvLyBTY2FubmVyXG4gIFVOVEVSTUlOQVRFRF9DT01NRU5UOiBcIkswMDItMVwiLFxuICBVTlRFUk1JTkFURURfU1RSSU5HOiBcIkswMDItMlwiLFxuICBVTkVYUEVDVEVEX0NIQVJBQ1RFUjogXCJLMDAyLTNcIixcblxuICAvLyBUZW1wbGF0ZSBQYXJzZXJcbiAgVU5FWFBFQ1RFRF9FT0Y6IFwiSzAwMy0xXCIsXG4gIFVORVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy0yXCIsXG4gIEVYUEVDVEVEX1RBR19OQU1FOiBcIkswMDMtM1wiLFxuICBFWFBFQ1RFRF9DTE9TSU5HX0JSQUNLRVQ6IFwiSzAwMy00XCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfVEFHOiBcIkswMDMtNVwiLFxuICBCTEFOS19BVFRSSUJVVEVfTkFNRTogXCJLMDAzLTZcIixcbiAgTUlTUExBQ0VEX0NPTkRJVElPTkFMOiBcIkswMDMtN1wiLFxuICBEVVBMSUNBVEVfSUY6IFwiSzAwMy04XCIsXG5cbiAgLy8gRXhwcmVzc2lvbiBQYXJzZXJcbiAgVU5FWFBFQ1RFRF9UT0tFTjogXCJLMDA0LTFcIixcbiAgSU5WQUxJRF9MVkFMVUU6IFwiSzAwNC0yXCIsXG4gIEVYUEVDVEVEX0VYUFJFU1NJT046IFwiSzAwNC0zXCIsXG4gIElOVkFMSURfRElDVElPTkFSWV9LRVk6IFwiSzAwNC00XCIsXG5cbiAgLy8gSW50ZXJwcmV0ZXJcbiAgSU5WQUxJRF9QT1NURklYX0xWQUxVRTogXCJLMDA1LTFcIixcbiAgVU5LTk9XTl9CSU5BUllfT1BFUkFUT1I6IFwiSzAwNS0yXCIsXG4gIElOVkFMSURfUFJFRklYX1JWQUxVRTogXCJLMDA1LTNcIixcbiAgVU5LTk9XTl9VTkFSWV9PUEVSQVRPUjogXCJLMDA1LTRcIixcbiAgTk9UX0FfRlVOQ1RJT046IFwiSzAwNS01XCIsXG4gIE5PVF9BX0NMQVNTOiBcIkswMDUtNlwiLFxuXG4gIC8vIFNpZ25hbHNcbiAgQ0lSQ1VMQVJfQ09NUFVURUQ6IFwiSzAwNi0xXCIsXG5cbiAgLy8gVHJhbnNwaWxlclxuICBSVU5USU1FX0VSUk9SOiBcIkswMDctMVwiLFxuICBNSVNTSU5HX1JFUVVJUkVEX0FUVFI6IFwiSzAwNy0yXCIsXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBLRXJyb3JDb2RlVHlwZSA9ICh0eXBlb2YgS0Vycm9yQ29kZSlba2V5b2YgdHlwZW9mIEtFcnJvckNvZGVdO1xuXG5leHBvcnQgY29uc3QgRXJyb3JUZW1wbGF0ZXM6IFJlY29yZDxzdHJpbmcsIChhcmdzOiBhbnkpID0+IHN0cmluZz4gPSB7XG4gIFwiSzAwMS0xXCI6IChhKSA9PiBgUm9vdCBlbGVtZW50IG5vdCBmb3VuZDogJHthLnJvb3R9YCxcbiAgXCJLMDAxLTJcIjogKGEpID0+IGBFbnRyeSBjb21wb25lbnQgPCR7YS50YWd9PiBub3QgZm91bmQgaW4gcmVnaXN0cnkuYCxcbiAgXG4gIFwiSzAwMi0xXCI6ICgpID0+ICdVbnRlcm1pbmF0ZWQgY29tbWVudCwgZXhwZWN0aW5nIGNsb3NpbmcgXCIqL1wiJyxcbiAgXCJLMDAyLTJcIjogKGEpID0+IGBVbnRlcm1pbmF0ZWQgc3RyaW5nLCBleHBlY3RpbmcgY2xvc2luZyAke2EucXVvdGV9YCxcbiAgXCJLMDAyLTNcIjogKGEpID0+IGBVbmV4cGVjdGVkIGNoYXJhY3RlciAnJHthLmNoYXJ9J2AsXG5cbiAgXCJLMDAzLTFcIjogKGEpID0+IGBVbmV4cGVjdGVkIGVuZCBvZiBmaWxlLiAke2EuZW9mRXJyb3J9YCxcbiAgXCJLMDAzLTJcIjogKCkgPT4gXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIsXG4gIFwiSzAwMy0zXCI6ICgpID0+IFwiRXhwZWN0ZWQgYSB0YWcgbmFtZVwiLFxuICBcIkswMDMtNFwiOiAoKSA9PiBcIkV4cGVjdGVkIGNsb3NpbmcgdGFnID5cIixcbiAgXCJLMDAzLTVcIjogKGEpID0+IGBFeHBlY3RlZCA8LyR7YS5uYW1lfT5gLFxuICBcIkswMDMtNlwiOiAoKSA9PiBcIkJsYW5rIGF0dHJpYnV0ZSBuYW1lXCIsXG4gIFwiSzAwMy03XCI6IChhKSA9PiBgQCR7YS5uYW1lfSBtdXN0IGJlIHByZWNlZGVkIGJ5IGFuIEBpZiBvciBAZWxzZWlmIGJsb2NrLmAsXG4gIFwiSzAwMy04XCI6ICgpID0+IFwiTXVsdGlwbGUgY29uZGl0aW9uYWwgZGlyZWN0aXZlcyAoQGlmLCBAZWxzZWlmLCBAZWxzZSkgb24gdGhlIHNhbWUgZWxlbWVudCBhcmUgbm90IGFsbG93ZWQuXCIsXG5cbiAgXCJLMDA0LTFcIjogKGEpID0+IGAke2EubWVzc2FnZX0sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtMlwiOiAoKSA9PiBcIkludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuXCIsXG4gIFwiSzAwNC0zXCI6IChhKSA9PiBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7YS50b2tlbn1cImAsXG4gIFwiSzAwNC00XCI6IChhKSA9PiBgU3RyaW5nLCBOdW1iZXIgb3IgSWRlbnRpZmllciBleHBlY3RlZCBhcyBhIEtleSBvZiBEaWN0aW9uYXJ5IHssIHVuZXhwZWN0ZWQgdG9rZW4gJHthLnRva2VufWAsXG5cbiAgXCJLMDA1LTFcIjogKGEpID0+IGBJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIHBvc3RmaXggb3BlcmF0aW9uOiAke2EuZW50aXR5fWAsXG4gIFwiSzAwNS0yXCI6IChhKSA9PiBgVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgJHthLm9wZXJhdG9yfWAsXG4gIFwiSzAwNS0zXCI6IChhKSA9PiBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAke2EucmlnaHR9YCxcbiAgXCJLMDA1LTRcIjogKGEpID0+IGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtNVwiOiAoYSkgPT4gYCR7YS5jYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCxcbiAgXCJLMDA1LTZcIjogKGEpID0+IGAnJHthLmNsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmAsXG5cbiAgXCJLMDA2LTFcIjogKCkgPT4gXCJDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIGluIGNvbXB1dGVkIHNpZ25hbFwiLFxuXG4gIFwiSzAwNy0xXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG4gIFwiSzAwNy0yXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG59O1xuXG5leHBvcnQgY2xhc3MgS2FzcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb2RlOiBLRXJyb3JDb2RlVHlwZSxcbiAgICBwdWJsaWMgYXJnczogYW55ID0ge30sXG4gICAgcHVibGljIGxpbmU/OiBudW1iZXIsXG4gICAgcHVibGljIGNvbD86IG51bWJlcixcbiAgICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZ1xuICApIHtcbiAgICAvLyBEZXRlY3QgZW52aXJvbm1lbnRcbiAgICBjb25zdCBpc0RldiA9XG4gICAgICB0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIlxuICAgICAgICA6IChpbXBvcnQubWV0YSBhcyBhbnkpLmVudj8uTU9ERSAhPT0gXCJwcm9kdWN0aW9uXCI7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IEVycm9yVGVtcGxhdGVzW2NvZGVdO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSBcbiAgICAgID8gdGVtcGxhdGUoYXJncykgXG4gICAgICA6ICh0eXBlb2YgYXJncyA9PT0gJ3N0cmluZycgPyBhcmdzIDogXCJVbmtub3duIGVycm9yXCIpO1xuICAgIFxuICAgIGNvbnN0IGxvY2F0aW9uID0gbGluZSAhPT0gdW5kZWZpbmVkID8gYCAoJHtsaW5lfToke2NvbH0pYCA6IFwiXCI7XG4gICAgY29uc3QgdGFnSW5mbyA9IHRhZ05hbWUgPyBgXFxuICBhdCA8JHt0YWdOYW1lfT5gIDogXCJcIjtcbiAgICBjb25zdCBsaW5rID0gaXNEZXZcbiAgICAgID8gYFxcblxcblNlZTogaHR0cHM6Ly9rYXNwZXJqcy50b3AvcmVmZXJlbmNlL2Vycm9ycyMke2NvZGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKX1gXG4gICAgICA6IFwiXCI7XG5cbiAgICBzdXBlcihgWyR7Y29kZX1dICR7bWVzc2FnZX0ke2xvY2F0aW9ufSR7dGFnSW5mb30ke2xpbmt9YCk7XG4gICAgdGhpcy5uYW1lID0gXCJLYXNwZXJFcnJvclwiO1xuICB9XG59XG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbnR5cGUgTGlzdGVuZXIgPSAoKSA9PiB2b2lkO1xuXG5sZXQgYWN0aXZlRWZmZWN0OiB7IGZuOiBMaXN0ZW5lcjsgZGVwczogU2V0PGFueT4gfSB8IG51bGwgPSBudWxsO1xuY29uc3QgZWZmZWN0U3RhY2s6IGFueVtdID0gW107XG5cbmxldCBiYXRjaGluZyA9IGZhbHNlO1xuY29uc3QgcGVuZGluZ1N1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbmNvbnN0IHBlbmRpbmdXYXRjaGVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBTaWduYWxPcHRpb25zIHtcbiAgc2lnbmFsPzogQWJvcnRTaWduYWw7XG59XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcm90ZWN0ZWQgX3ZhbHVlOiBUO1xuICBwcml2YXRlIHN1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbiAgcHJpdmF0ZSB3YXRjaGVycyA9IG5ldyBTZXQ8V2F0Y2hlcjxUPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWU6IFQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzLmFkZChhY3RpdmVFZmZlY3QuZm4pO1xuICAgICAgYWN0aXZlRWZmZWN0LmRlcHMuYWRkKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGlmIChiYXRjaGluZykge1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmliZXJzKSBwZW5kaW5nU3Vic2NyaWJlcnMuYWRkKHN1Yik7XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSBwZW5kaW5nV2F0Y2hlcnMucHVzaCgoKSA9PiB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycyk7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgICAgICBzdWIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykge1xuICAgICAgICAgIHRyeSB7IHdhdGNoZXIobmV3VmFsdWUsIG9sZFZhbHVlKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlKGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICAgIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgY29uc3Qgc3RvcCA9ICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5jbGFzcyBDb21wdXRlZFNpZ25hbDxUPiBleHRlbmRzIFNpZ25hbDxUPiB7XG4gIHByaXZhdGUgZm46ICgpID0+IFQ7XG4gIHByaXZhdGUgY29tcHV0aW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gICAgc3VwZXIodW5kZWZpbmVkIGFzIGFueSk7XG4gICAgdGhpcy5mbiA9IGZuO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb21wdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEthc3BlckVycm9yKEtFcnJvckNvZGUuQ0lSQ1VMQVJfQ09NUFVURUQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXB1dGluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBFYWdlcmx5IHVwZGF0ZSB0aGUgdmFsdWUgc28gc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkIGltbWVkaWF0ZWx5XG4gICAgICAgIHN1cGVyLnZhbHVlID0gdGhpcy5mbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5jb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zPy5zaWduYWwpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiBzdXBlci52YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShfdjogVCkge1xuICAgIC8vIENvbXB1dGVkIHNpZ25hbHMgYXJlIHJlYWQtb25seSBmcm9tIG91dHNpZGVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lciwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnM/LnNpZ25hbD8uYWJvcnRlZCkgcmV0dXJuICgpID0+IHt9O1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgY29uc3Qgc3RvcDogYW55ID0gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xuICBzdG9wLnJ1biA9IGVmZmVjdE9iai5mbjtcblxuICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBzdG9wIGFzICgoKSA9PiB2b2lkKSAmIHsgcnVuOiAoKSA9PiB2b2lkIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWw8VD4oaW5pdGlhbFZhbHVlOiBUKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBTaWduYWwoaW5pdGlhbFZhbHVlKTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsIGFsaWFzIGZvciBTaWduYWwub25DaGFuZ2UoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICByZXR1cm4gc2lnLm9uQ2hhbmdlKGZuLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIGJhdGNoaW5nID0gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20ocGVuZGluZ1N1YnNjcmliZXJzKTtcbiAgICBwZW5kaW5nU3Vic2NyaWJlcnMuY2xlYXIoKTtcbiAgICBjb25zdCB3YXRjaGVycyA9IHBlbmRpbmdXYXRjaGVycy5zcGxpY2UoMCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgc3ViKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgdHJ5IHsgd2F0Y2hlcigpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZWQ8VD4oZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBDb21wdXRlZFNpZ25hbChmbiwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBTaWduYWwsIGVmZmVjdCBhcyByYXdFZmZlY3QsIGNvbXB1dGVkIGFzIHJhd0NvbXB1dGVkIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS05vZGUgfSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIFdhdGNoZXI8VD4gPSAobmV3VmFsdWU6IFQsIG9sZFZhbHVlOiBUKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50QXJnczxUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XG4gIGFyZ3M6IFRBcmdzO1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XG4gIHN0YXRpYyB0ZW1wbGF0ZT86IHN0cmluZztcbiAgYXJnczogVEFyZ3MgPSB7fSBhcyBUQXJncztcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICRyZW5kZXI/OiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogQ29tcG9uZW50QXJnczxUQXJncz4pIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSB7fSBhcyBUQXJncztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHByb3BzLmFyZ3MpIHtcbiAgICAgIHRoaXMuYXJncyA9IHByb3BzLmFyZ3M7XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZWYpIHtcbiAgICAgIHRoaXMucmVmID0gcHJvcHMucmVmO1xuICAgIH1cbiAgICBpZiAocHJvcHMudHJhbnNwaWxlcikge1xuICAgICAgdGhpcy50cmFuc3BpbGVyID0gcHJvcHMudHJhbnNwaWxlcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHJlYWN0aXZlIGVmZmVjdCB0aWVkIHRvIHRoZSBjb21wb25lbnQncyBsaWZlY3ljbGUuXG4gICAqIFJ1bnMgaW1tZWRpYXRlbHkgYW5kIHJlLXJ1bnMgd2hlbiBhbnkgc2lnbmFsIGRlcGVuZGVuY3kgY2hhbmdlcy5cbiAgICovXG4gIGVmZmVjdChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHJhd0VmZmVjdChmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2hlcyBhIHNwZWNpZmljIHNpZ25hbCBmb3IgY2hhbmdlcy5cbiAgICogRG9lcyBOT1QgcnVuIGltbWVkaWF0ZWx5LlxuICAgKi9cbiAgd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+KTogdm9pZCB7XG4gICAgc2lnLm9uQ2hhbmdlKGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY29tcHV0ZWQgc2lnbmFsIHRpZWQgdG8gdGhlIGNvbXBvbmVudCdzIGxpZmVjeWNsZS5cbiAgICogVGhlIGludGVybmFsIGVmZmVjdCBpcyBhdXRvbWF0aWNhbGx5IGNsZWFuZWQgdXAgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC5cbiAgICovXG4gIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgICByZXR1cm4gcmF3Q29tcHV0ZWQoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgb25Nb3VudCgpIHsgfVxuICBvblJlbmRlcigpIHsgfVxuICBvbkNoYW5nZXMoKSB7IH1cbiAgb25EZXN0cm95KCkgeyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuJHJlbmRlcj8uKCk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgS2FzcGVyRW50aXR5ID0gQ29tcG9uZW50IHwgUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIENvbXBvbmVudENsYXNzID0geyBuZXcoYXJncz86IENvbXBvbmVudEFyZ3M8YW55Pik6IENvbXBvbmVudCB9O1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRSZWdpc3RyeSB7XG4gIFt0YWdOYW1lOiBzdHJpbmddOiB7XG4gICAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgICB0ZW1wbGF0ZT86IEVsZW1lbnQgfCBzdHJpbmcgfCBudWxsO1xuICAgIG5vZGVzPzogS05vZGVbXTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBBcnJvd0Z1bmN0aW9uKTogUjtcbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcjogQXNzaWduKTogUjtcbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcjogQmluYXJ5KTogUjtcbiAgICB2aXNpdENhbGxFeHByKGV4cHI6IENhbGwpOiBSO1xuICAgIHZpc2l0RGVidWdFeHByKGV4cHI6IERlYnVnKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IFBpcGVsaW5lKTogUjtcbiAgICB2aXNpdFNwcmVhZEV4cHIoZXhwcjogU3ByZWFkKTogUjtcbiAgICB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBUZW1wbGF0ZSk6IFI7XG4gICAgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBUZXJuYXJ5KTogUjtcbiAgICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mKTogUjtcbiAgICB2aXNpdFVuYXJ5RXhwcihleHByOiBVbmFyeSk6IFI7XG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogVmFyaWFibGUpOiBSO1xuICAgIHZpc2l0Vm9pZEV4cHIoZXhwcjogVm9pZCk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJvd0Z1bmN0aW9uIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHBhcmFtczogVG9rZW5bXTtcbiAgICBwdWJsaWMgYm9keTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogVG9rZW5bXSwgYm9keTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFycm93RnVuY3Rpb25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXJyb3dGdW5jdGlvbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzaWduRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFzc2lnbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5CaW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNhbGxlZTogRXhwcjtcbiAgICBwdWJsaWMgcGFyZW46IFRva2VuO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG4gICAgcHVibGljIG9wdGlvbmFsOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyLCBvcHRpb25hbCA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBvcHRpb25hbDtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkNhbGwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERlYnVnRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRlYnVnJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsYXp6ID0gY2xheno7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmV3RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk5ldyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxDb2FsZXNjaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbENvYWxlc2NpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTnVsbENvYWxlc2NpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0Zml4IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMgaW5jcmVtZW50OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGluY3JlbWVudDogbnVtYmVyLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBvc3RmaXhFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUG9zdGZpeCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQaXBlbGluZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5QaXBlbGluZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwcmVhZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNwcmVhZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TcHJlYWQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVm9pZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZvaWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVm9pZCc7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAvLyBQYXJzZXIgVG9rZW5zXHJcbiAgRW9mLFxyXG4gIFBhbmljLFxyXG5cclxuICAvLyBTaW5nbGUgQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFtcGVyc2FuZCxcclxuICBBdFNpZ24sXHJcbiAgQ2FyZXQsXHJcbiAgQ29tbWEsXHJcbiAgRG9sbGFyLFxyXG4gIERvdCxcclxuICBIYXNoLFxyXG4gIExlZnRCcmFjZSxcclxuICBMZWZ0QnJhY2tldCxcclxuICBMZWZ0UGFyZW4sXHJcbiAgUGVyY2VudCxcclxuICBQaXBlLFxyXG4gIFJpZ2h0QnJhY2UsXHJcbiAgUmlnaHRCcmFja2V0LFxyXG4gIFJpZ2h0UGFyZW4sXHJcbiAgU2VtaWNvbG9uLFxyXG4gIFNsYXNoLFxyXG4gIFN0YXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFycm93LFxyXG4gIEJhbmcsXHJcbiAgQmFuZ0VxdWFsLFxyXG4gIEJhbmdFcXVhbEVxdWFsLFxyXG4gIENvbG9uLFxyXG4gIEVxdWFsLFxyXG4gIEVxdWFsRXF1YWwsXHJcbiAgRXF1YWxFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnMgKGJpdHdpc2Ugc2hpZnRzKVxyXG4gIExlZnRTaGlmdCxcclxuICBSaWdodFNoaWZ0LFxyXG4gIFBpcGVsaW5lLFxyXG4gIFRpbGRlLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBEZWJ1ZyxcclxuICBGYWxzZSxcclxuICBJbixcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBWb2lkLFxyXG4gIFdpdGgsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbiB7XHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xyXG4gIHB1YmxpYyBsaXRlcmFsOiBhbnk7XHJcbiAgcHVibGljIGxleGVtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHR5cGU6IFRva2VuVHlwZSxcclxuICAgIGxleGVtZTogc3RyaW5nLFxyXG4gICAgbGl0ZXJhbDogYW55LFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sOiBudW1iZXJcclxuICApIHtcclxuICAgIHRoaXMubmFtZSA9IFRva2VuVHlwZVt0eXBlXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxleGVtZSA9IGxleGVtZTtcclxuICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gYFsoJHt0aGlzLmxpbmV9KTpcIiR7dGhpcy5sZXhlbWV9XCJdYDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiIsImltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW107XG5cbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgZXhwcmVzc2lvbnMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBUb2tlbiB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XG4gIH1cblxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09PSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvcihcbiAgICAgIEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9UT0tFTixcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgeyBtZXNzYWdlOiBtZXNzYWdlLCB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgdG9rZW46IFRva2VuLCBhcmdzOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5TZW1pY29sb24pIHx8IHRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9IHdoaWxlICghdGhpcy5lb2YoKSk7XG4gIH1cblxuICBwdWJsaWMgZm9yZWFjaCh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHIge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgICBjb25zdCBuYW1lID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxuICAgICk7XG5cbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLldpdGgpKSB7XG4gICAgICBrZXkgPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgICBgRXhwZWN0ZWQgYSBcImtleVwiIGlkZW50aWZpZXIgYWZ0ZXIgXCJ3aXRoXCIga2V5d29yZCBpbiBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLk9mLFxuICAgICAgYEV4cGVjdGVkIFwib2ZcIiBrZXl3b3JkIGluc2lkZSBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICApO1xuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRWFjaChuYW1lLCBrZXksIGl0ZXJhYmxlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHByZXNzaW9uKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHtcbiAgICAgIC8vIGNvbnN1bWUgYWxsIHNlbWljb2xvbnNcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHsgLyogY29uc3VtZSBzZW1pY29sb25zICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIGFzc2lnbm1lbnQoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnBpcGVsaW5lKCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuSU5WQUxJRF9MVkFMVUUsIG9wZXJhdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHBpcGVsaW5lKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGlwZWxpbmUpKSB7XG4gICAgICBjb25zdCByaWdodCA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLlBpcGVsaW5lKGV4cHIsIHJpZ2h0LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5Db2xvbiwgYEV4cGVjdGVkIFwiOlwiIGFmdGVyIHRlcm5hcnkgPyBleHByZXNzaW9uYCk7XG4gICAgICBjb25zdCBlbHNlRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBudWxsQ29hbGVzY2luZygpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgcmlnaHRFeHByOiBFeHByLkV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbE9yKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuT3IpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5BbmQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGVxdWFsaXR5KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICB3aGlsZSAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5JbnN0YW5jZW9mLFxuICAgICAgICBUb2tlblR5cGUuSW4sXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgc2hpZnQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0U2hpZnQsIFRva2VuVHlwZS5SaWdodFNoaWZ0KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51cywgVG9rZW5UeXBlLlBsdXMpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtb2R1bHVzKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aXBsaWNhdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TbGFzaCwgVG9rZW5UeXBlLlN0YXIpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UeXBlb2YpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UeXBlb2YodmFsdWUsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgIFRva2VuVHlwZS5UaWxkZSxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5jYWxsKCk7XG4gICAgICBpZiAoY29uc3RydWN0IGluc3RhbmNlb2YgRXhwci5DYWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LmNhbGxlZSwgY29uc3RydWN0LmFyZ3MsIGtleXdvcmQubGluZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwgW10sIGtleXdvcmQubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBvc3RmaXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zdGZpeCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAxLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIC0xLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcbiAgICBsZXQgY29uc3VtZWQ6IGJvb2xlYW47XG4gICAgZG8ge1xuICAgICAgY29uc3VtZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCBmYWxzZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2tlbkF0KG9mZnNldDogbnVtYmVyKTogVG9rZW5UeXBlIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50ICsgb2Zmc2V0XT8udHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNBcnJvd1BhcmFtcygpOiBib29sZWFuIHtcbiAgICBsZXQgaSA9IHRoaXMuY3VycmVudCArIDE7IC8vIHNraXAgKFxuICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICB9XG4gICAgd2hpbGUgKGkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLklkZW50aWZpZXIpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuQ29tbWEpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5pc2hDYWxsKGNhbGxlZTogRXhwci5FeHByLCBwYXJlbjogVG9rZW4sIG9wdGlvbmFsOiBib29sZWFuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBhcmdzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgICBhcmdzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgfVxuICAgIGNvbnN0IGNsb3NlUGFyZW4gPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuQ2FsbChjYWxsZWUsIGNsb3NlUGFyZW4sIGFyZ3MsIGNsb3NlUGFyZW4ubGluZSwgb3B0aW9uYWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuSWRlbnRpZmllcikgJiYgdGhpcy50b2tlbkF0KDEpID09PSBUb2tlblR5cGUuQXJyb3cpIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSA9PlxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24oW3BhcmFtXSwgYm9keSwgcGFyYW0ubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZShpZGVudGlmaWVyLCBpZGVudGlmaWVyLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuTGVmdFBhcmVuKSAmJiB0aGlzLmlzQXJyb3dQYXJhbXMoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgKFxuICAgICAgY29uc3QgcGFyYW1zOiBUb2tlbltdID0gW107XG4gICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBwYXJhbXMucHVzaCh0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklkZW50aWZpZXIsIFwiRXhwZWN0ZWQgcGFyYW1ldGVyIG5hbWVcIikpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCJgKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQXJyb3csIGBFeHBlY3RlZCBcIj0+XCJgKTtcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKHBhcmFtcywgYm9keSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZvaWQoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRGVidWcpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcbiAgICAgIEtFcnJvckNvZGUuRVhQRUNURURfRVhQUkVTU0lPTixcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgeyB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICApO1xuICAgIC8vIHVucmVhY2hlYWJsZSBjb2RlXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgMCk7XG4gIH1cblxuICBwdWJsaWMgZGljdGlvbmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZywgVG9rZW5UeXBlLklkZW50aWZpZXIsIFRva2VuVHlwZS5OdW1iZXIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qga2V5OiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbG9uKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgRXhwci5WYXJpYWJsZShrZXksIGtleS5saW5lKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICBLRXJyb3JDb2RlLklOVkFMSURfRElDVElPTkFSWV9LRVksXG4gICAgICAgICAgdGhpcy5wZWVrKCksXG4gICAgICAgICAgeyB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgdmFsdWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFNjYW5uZXIge1xuICAvKiogc2NyaXB0cyBzb3VyY2UgY29kZSAqL1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIC8qKiBjb250YWlucyB0aGUgc291cmNlIGNvZGUgcmVwcmVzZW50ZWQgYXMgbGlzdCBvZiB0b2tlbnMgKi9cbiAgcHVibGljIHRva2VuczogVG9rZW5bXTtcbiAgLyoqIHBvaW50cyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICAvKiogcG9pbnRzIHRvIHRoZSBzdGFydCBvZiB0aGUgdG9rZW4gICovXG4gIHByaXZhdGUgc3RhcnQ6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgbGluZSBvZiBzb3VyY2UgY29kZSBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGNvbHVtbiBvZiB0aGUgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGNvbDogbnVtYmVyO1xuXG4gIHB1YmxpYyBzY2FuKHNvdXJjZTogc3RyaW5nKTogVG9rZW5bXSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgdGhpcy5nZXRUb2tlbigpO1xuICAgIH1cbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xuICAgICAgdGhpcy5saW5lKys7XG4gICAgICB0aGlzLmNvbCA9IDA7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHRoaXMuY29sKys7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpICE9PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWtOZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOVEVSTUlOQVRFRF9DT01NRU5UKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGhlIGNsb3Npbmcgc2xhc2ggJyovJ1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhxdW90ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBxdW90ZSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOVEVSTUlOQVRFRF9TVFJJTkcsIHsgcXVvdGU6IHF1b3RlIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxuICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICB0aGlzLmFkZFRva2VuKHF1b3RlICE9PSBcImBcIiA/IFRva2VuVHlwZS5TdHJpbmcgOiBUb2tlblR5cGUuVGVtcGxhdGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbnVtYmVyKCk6IHZvaWQge1xuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGZyYWN0aW9uXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcbiAgICB3aGlsZSAoVXRpbHMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcbiAgICBpZiAoVXRpbHMuaXNLZXl3b3JkKGNhcGl0YWxpemVkKSkge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGVbY2FwaXRhbGl6ZWRdLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLklkZW50aWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIltcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJdXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIntcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjtcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiflwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5UaWxkZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ2FyZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkhhc2gsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI6XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcInxcIikgPyBUb2tlblR5cGUuT3IgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlBpcGVsaW5lIDpcbiAgICAgICAgICBUb2tlblR5cGUuUGlwZSxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiZcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlJpZ2h0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiIVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkJhbmdFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj9cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiP1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvblxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25Eb3RcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlF1ZXN0aW9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPVwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiK1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCIrXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzUGx1c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5QbHVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCItXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPFwiKSA/IFRva2VuVHlwZS5MZWZ0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXG4gICAgICAgICAgICAgID8gVG9rZW5UeXBlLkxlc3NFcXVhbEdyZWF0ZXJcbiAgICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiL1wiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi9cIikpIHtcbiAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xuICAgICAgICAgIHRoaXMubXVsdGlsaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TbGFzaEVxdWFsIDogVG9rZW5UeXBlLlNsYXNoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGAnYDpcbiAgICAgIGNhc2UgYFwiYDpcbiAgICAgIGNhc2UgXCJgXCI6XG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGlnbm9yZSBjYXNlc1xuICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgIGNhc2UgXCJcXHJcIjpcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjb21wbGV4IGNhc2VzXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdChjaGFyKSkge1xuICAgICAgICAgIHRoaXMubnVtYmVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xuICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0NIQVJBQ1RFUiwgeyBjaGFyOiBjaGFyIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9KTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0ICRpbXBvcnRzID0gKHRoaXMudmFsdWVzPy5jb25zdHJ1Y3RvciBhcyBhbnkpPy4kaW1wb3J0cztcbiAgICBpZiAoJGltcG9ydHMgJiYgdHlwZW9mICRpbXBvcnRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiAkaW1wb3J0c1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5IGFzIGtleW9mIHR5cGVvZiB3aW5kb3ddO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciBhcyBQYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IEV4cHIuUGlwZWxpbmUpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkNhbGwpIHtcbiAgICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodC5jYWxsZWUpO1xuICAgICAgY29uc3QgYXJncyA9IFt2YWx1ZV07XG4gICAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLnJpZ2h0LmFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGFyZyBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGV4cHIucmlnaHQuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLnJpZ2h0LmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3QgZm4gPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHJldHVybiBmbih2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBFeHByLkFycm93RnVuY3Rpb24pOiBhbnkge1xuICAgIGNvbnN0IGNhcHR1cmVkU2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnNjb3BlO1xuICAgICAgdGhpcy5zY29wZSA9IG5ldyBTY29wZShjYXB0dXJlZFNjb3BlKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwci5wYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5wYXJhbXNbaV0ubGV4ZW1lLCBhcmdzW2ldKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuYm9keSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnkgPSB7fSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIGxpbmUsIGNvbCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcblxuICAgIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIuZW50aXR5Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgIGV4cHIuZW50aXR5LmVudGl0eSxcbiAgICAgICAgZXhwci5lbnRpdHkua2V5LFxuICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5JTlZBTElEX1BPU1RGSVhfTFZBTFVFLCB7IGVudGl0eTogZXhwci5lbnRpdHkgfSwgZXhwci5saW5lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXN0RXhwcihleHByOiBFeHByLkxpc3QpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwci52YWx1ZSkge1xuICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICB2YWx1ZXMucHVzaCguLi50aGlzLmV2YWx1YXRlKChleHByZXNzaW9uIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTcHJlYWRFeHByKGV4cHI6IEV4cHIuU3ByZWFkKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluc3RhbmNlb2Y6XG4gICAgICAgIHJldHVybiBsZWZ0IGluc3RhbmNlb2YgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZWZ0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0IDw8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUmlnaHRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5LTk9XTl9CSU5BUllfT1BFUkFUT1IsIHsgb3BlcmF0b3I6IGV4cHIub3BlcmF0b3IgfSwgZXhwci5saW5lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogRXhwci5Mb2dpY2FsKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLk9yKSB7XG4gICAgICBpZiAobGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogRXhwci5UZXJuYXJ5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmNvbmRpdGlvbilcbiAgICAgID8gdGhpcy5ldmFsdWF0ZShleHByLnRoZW5FeHByKVxuICAgICAgOiB0aGlzLmV2YWx1YXRlKGV4cHIuZWxzZUV4cHIpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IEV4cHIuTnVsbENvYWxlc2NpbmcpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgaWYgKGxlZnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuVGlsZGU6XG4gICAgICAgIHJldHVybiB+cmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgS0Vycm9yQ29kZS5JTlZBTElEX1BSRUZJWF9SVkFMVUUsXG4gICAgICAgICAgICB7IHJpZ2h0OiBleHByLnJpZ2h0IH0sXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTktOT1dOX1VOQVJZX09QRVJBVE9SLCB7IG9wZXJhdG9yOiBleHByLm9wZXJhdG9yIH0sIGV4cHIubGluZSk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmIChjYWxsZWUgPT0gbnVsbCAmJiBleHByLm9wdGlvbmFsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5OT1RfQV9GVU5DVElPTiwgeyBjYWxsZWU6IGNhbGxlZSB9LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmd1bWVudCBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb24g4oCUIHByZXNlcnZlIGB0aGlzYCBmb3IgbWV0aG9kIGNhbGxzXG4gICAgaWYgKGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TmV3RXhwcihleHByOiBFeHByLk5ldyk6IGFueSB7XG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2xhenopO1xuXG4gICAgaWYgKHR5cGVvZiBjbGF6eiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKFxuICAgICAgICBLRXJyb3JDb2RlLk5PVF9BX0NMQVNTLFxuICAgICAgICB7IGNsYXp6OiBjbGF6eiB9LFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgaWYgKHByb3BlcnR5IGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkaWN0LCB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGljdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFR5cGVvZkV4cHIoZXhwcjogRXhwci5UeXBlb2YpOiBhbnkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVhY2hFeHByKGV4cHI6IEV4cHIuRWFjaCk6IGFueSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGV4cHIubmFtZS5sZXhlbWUsXG4gICAgICBleHByLmtleSA/IGV4cHIua2V5LmxleGVtZSA6IG51bGwsXG4gICAgICB0aGlzLmV2YWx1YXRlKGV4cHIuaXRlcmFibGUpLFxuICAgIF07XG4gIH1cblxuICB2aXNpdFZvaWRFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIHZpc2l0RGVidWdFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgS05vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS05vZGVWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEVsZW1lbnRLTm9kZShrbm9kZTogRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVLTm9kZShrbm9kZTogQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdFRleHRLTm9kZShrbm9kZTogVGV4dCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRDb21tZW50S05vZGUoa25vZGU6IENvbW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0RG9jdHlwZUtOb2RlKGtub2RlOiBEb2N0eXBlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogS05vZGVbXTtcbiAgICBwdWJsaWMgY2hpbGRyZW46IEtOb2RlW107XG4gICAgcHVibGljIHNlbGY6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IEtOb2RlW10sIGNoaWxkcmVuOiBLTm9kZVtdLCBzZWxmOiBib29sZWFuLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLnNlbGYgPSBzZWxmO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2RvY3R5cGUnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUGFyc2VyIHtcbiAgcHVibGljIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm5vZGVzID0gW107XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKGVvZkVycm9yOiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgdGhpcy5jb2wgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVORVhQRUNURURfRU9GLCB7IGVvZkVycm9yOiBlb2ZFcnJvciB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30pOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0NMT1NJTkdfVEFHKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNvbW1lbnQgY2xvc2luZyAnLS0+J1wiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMyk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkNvbW1lbnQoY29tbWVudCwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9UQUdfTkFNRSk7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVCk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogbmFtZSB9KTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBwYXJlbnQgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuQkxBTktfQVRUUklCVVRFX05BTUUpO1xuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoXCInXCIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKCdcIicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwie3tcIikpIHsgZGVwdGgrKzsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgdGhpcy5tYXRjaChcIn19XCIpKSB7IGRlcHRoLS07IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdGhpcy5wZWVrKFwiPFwiKSkgeyBicmVhazsgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXJhdykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRoaXMuZGVjb2RlRW50aXRpZXMocmF3KSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUVudGl0aWVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCJcXHUwMGEwXCIpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgICAgLnJlcGxhY2UoLyZhcG9zOy9nLCBcIidcIilcbiAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7IC8vIG11c3QgYmUgbGFzdCB0byBhdm9pZCBkb3VibGUtZGVjb2RpbmdcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q2xhc3MgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSb3V0ZUNvbmZpZyB7XG4gIHBhdGg6IHN0cmluZztcbiAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgZ3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGUocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwiXCIsIHBhdGgpO1xuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgUG9wU3RhdGVFdmVudChcInBvcHN0YXRlXCIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoUGF0aChwYXR0ZXJuOiBzdHJpbmcsIHBhdGhuYW1lOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGlmIChwYXR0ZXJuID09PSBcIipcIikgcmV0dXJuIHt9O1xuICBjb25zdCBwYXR0ZXJuUGFydHMgPSBwYXR0ZXJuLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHBhdGhuYW1lLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmIChwYXR0ZXJuUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVyblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHBhdHRlcm5QYXJ0c1tpXS5zdGFydHNXaXRoKFwiOlwiKSkge1xuICAgICAgcGFyYW1zW3BhdHRlcm5QYXJ0c1tpXS5zbGljZSgxKV0gPSBwYXRoUGFydHNbaV07XG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuUGFydHNbaV0gIT09IHBhdGhQYXJ0c1tpXSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBwcml2YXRlIHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuXG4gIHNldFJvdXRlcyhyb3V0ZXM6IFJvdXRlQ29uZmlnW10pOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcbiAgfVxuXG4gIG9uTW91bnQoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCAoKSA9PiB0aGlzLl9uYXZpZ2F0ZSgpLCB7XG4gICAgICBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwsXG4gICAgfSk7XG4gICAgdGhpcy5fbmF2aWdhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX25hdmlnYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGZvciAoY29uc3Qgcm91dGUgb2YgdGhpcy5yb3V0ZXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoUGF0aChyb3V0ZS5wYXRoLCBwYXRobmFtZSk7XG4gICAgICBpZiAocGFyYW1zID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIGlmIChyb3V0ZS5ndWFyZCkge1xuICAgICAgICBjb25zdCBhbGxvd2VkID0gYXdhaXQgcm91dGUuZ3VhcmQoKTtcbiAgICAgICAgaWYgKCFhbGxvd2VkKSByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9tb3VudChyb3V0ZS5jb21wb25lbnQsIHBhcmFtcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbW91bnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5yZWYgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCFlbGVtZW50IHx8ICF0aGlzLnRyYW5zcGlsZXIpIHJldHVybjtcbiAgICB0aGlzLnRyYW5zcGlsZXIubW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3MsIGVsZW1lbnQsIHBhcmFtcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBCb3VuZGFyeSB7XG4gIHByaXZhdGUgc3RhcnQ6IENvbW1lbnQ7XG4gIHByaXZhdGUgZW5kOiBDb21tZW50O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogTm9kZSwgbGFiZWw6IHN0cmluZyA9IFwiYm91bmRhcnlcIikge1xuICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1zdGFydGApO1xuICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tZW5kYCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuc3RhcnQpO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIHRvUmVtb3ZlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRvUmVtb3ZlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmVuZC5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUobm9kZSwgdGhpcy5lbmQpO1xuICB9XG5cbiAgcHVibGljIG5vZGVzKCk6IE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBOb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBOb2RlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucGFyZW50Tm9kZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5cbnR5cGUgVGFzayA9ICgpID0+IHZvaWQ7XG5cbmNvbnN0IHF1ZXVlID0gbmV3IE1hcDxDb21wb25lbnQsIFRhc2tbXT4oKTtcbmNvbnN0IG5leHRUaWNrQ2FsbGJhY2tzOiBUYXNrW10gPSBbXTtcbmxldCBpc1NjaGVkdWxlZCA9IGZhbHNlO1xubGV0IGJhdGNoaW5nRW5hYmxlZCA9IHRydWU7XG5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBpc1NjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIC8vIDEuIFByb2Nlc3MgY29tcG9uZW50IHVwZGF0ZXNcbiAgZm9yIChjb25zdCBbaW5zdGFuY2UsIHRhc2tzXSBvZiBxdWV1ZS5lbnRyaWVzKCkpIHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2FsbCBwcmUtdXBkYXRlIGhvb2sgKG9ubHkgZm9yIHJlYWN0aXZlIHVwZGF0ZXMsIG5vdCBmaXJzdCBtb3VudClcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25DaGFuZ2VzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgaW5zdGFuY2Uub25DaGFuZ2VzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgc3VyZ2ljYWwgRE9NIHVwZGF0ZXMgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICBmb3IgKGNvbnN0IHRhc2sgb2YgdGFza3MpIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuXG4gICAgICAvLyBDYWxsIHBvc3QtdXBkYXRlIGhvb2tcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbS2FzcGVyXSBFcnJvciBkdXJpbmcgY29tcG9uZW50IHVwZGF0ZTpcIiwgZSk7XG4gICAgfVxuICB9XG4gIHF1ZXVlLmNsZWFyKCk7XG5cbiAgLy8gMi4gUHJvY2VzcyBuZXh0VGljayBjYWxsYmFja3NcbiAgY29uc3QgY2FsbGJhY2tzID0gbmV4dFRpY2tDYWxsYmFja3Muc3BsaWNlKDApO1xuICBmb3IgKGNvbnN0IGNiIG9mIGNhbGxiYWNrcykge1xuICAgIHRyeSB7XG4gICAgICBjYigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbS2FzcGVyXSBFcnJvciBpbiBuZXh0VGljayBjYWxsYmFjazpcIiwgZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZVVwZGF0ZShpbnN0YW5jZTogQ29tcG9uZW50LCB0YXNrOiBUYXNrKSB7XG4gIGlmICghYmF0Y2hpbmdFbmFibGVkKSB7XG4gICAgdGFzaygpO1xuICAgIC8vIER1cmluZyBzeW5jIG1vdW50LCB3ZSBkb24ndCBjYWxsIG9uQ2hhbmdlcyBvciBvblJlbmRlciBoZXJlLlxuICAgIC8vIG9uUmVuZGVyIGlzIGNhbGxlZCBtYW51YWxseSBhdCB0aGUgZW5kIG9mIHRyYW5zcGlsZS9ib290c3RyYXAuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFxdWV1ZS5oYXMoaW5zdGFuY2UpKSB7XG4gICAgcXVldWUuc2V0KGluc3RhbmNlLCBbXSk7XG4gIH1cbiAgcXVldWUuZ2V0KGluc3RhbmNlKSEucHVzaCh0YXNrKTtcblxuICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgZnVuY3Rpb24gd2l0aCBiYXRjaGluZyBkaXNhYmxlZC4gXG4gKiBVc2VkIGZvciBpbml0aWFsIG1vdW50IGFuZCBtYW51YWwgcmVuZGVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsdXNoU3luYyhmbjogKCkgPT4gdm9pZCkge1xuICBjb25zdCBwcmV2ID0gYmF0Y2hpbmdFbmFibGVkO1xuICBiYXRjaGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nRW5hYmxlZCA9IHByZXY7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZSBuZXh0IGZyYW1ld29yayB1cGRhdGUgY3ljbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljaygpOiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNiOiBUYXNrKTogdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYj86IFRhc2spOiBQcm9taXNlPHZvaWQ+IHwgdm9pZCB7XG4gIGlmIChjYikge1xuICAgIG5leHRUaWNrQ2FsbGJhY2tzLnB1c2goY2IpO1xuICAgIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbmV4dFRpY2tDYWxsYmFja3MucHVzaChyZXNvbHZlKTtcbiAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudENsYXNzLCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlQ29uZmlnIH0gZnJvbSBcIi4vcm91dGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgZWZmZWN0IH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBCb3VuZGFyeSB9IGZyb20gXCIuL2JvdW5kYXJ5XCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgcXVldWVVcGRhdGUsIGZsdXNoU3luYyB9IGZyb20gXCIuL3NjaGVkdWxlclwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcigpO1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuICBwdWJsaWMgbW9kZTogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCIgPSBcImRldmVsb3BtZW50XCI7XG4gIHByaXZhdGUgaXNSZW5kZXJpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIHRoaXMucmVnaXN0cnlbXCJyb3V0ZXJcIl0gPSB7IGNvbXBvbmVudDogUm91dGVyLCBub2RlczogW10gfTtcbiAgICBpZiAoIW9wdGlvbnMpIHJldHVybjtcbiAgICBpZiAob3B0aW9ucy5yZWdpc3RyeSkge1xuICAgICAgdGhpcy5yZWdpc3RyeSA9IHsgLi4udGhpcy5yZWdpc3RyeSwgLi4ub3B0aW9ucy5yZWdpc3RyeSB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgY29uc3QgZWwgPSBub2RlIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBjb25zdCBtaXNwbGFjZWQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZWlmXCIsIFwiQGVsc2VcIl0pO1xuICAgICAgaWYgKG1pc3BsYWNlZCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgaGFuZGxlZCBieSBkb0lmLCBpZiB3ZSByZWFjaCB0aGVtIGhlcmUgaXQncyBhbiBlcnJvclxuICAgICAgICBjb25zdCBuYW1lID0gbWlzcGxhY2VkLm5hbWUuc3RhcnRzV2l0aChcIkBcIikgPyBtaXNwbGFjZWQubmFtZS5zbGljZSgxKSA6IG1pc3BsYWNlZC5uYW1lO1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTUExBQ0VEX0NPTkRJVElPTkFMLCB7IG5hbWU6IG5hbWUgfSwgZWwubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGtleSk/LmdldCkgY29udGludWU7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgZW50aXR5W2tleV0gPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgIGtleSAhPT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlbnRpdHksIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW50aXR5W2tleV0gPSBlbnRpdHlba2V5XS5iaW5kKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGVzIGFuIGVmZmVjdCB0aGF0IHJlc3RvcmVzIHRoZSBjdXJyZW50IHNjb3BlIG9uIGV2ZXJ5IHJlLXJ1bixcbiAgLy8gc28gZWZmZWN0cyBzZXQgdXAgaW5zaWRlIEBlYWNoIGFsd2F5cyBldmFsdWF0ZSBpbiB0aGVpciBpdGVtIHNjb3BlLlxuICBwcml2YXRlIHNjb3BlZEVmZmVjdChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3BpbGUoXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZW50aXR5OiBhbnksXG4gICAgY29udGFpbmVyOiBFbGVtZW50XG4gICk6IE5vZGUge1xuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBlbnRpdHkpO1xuICAgICAgXG4gICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgICAgICB0aGlzLnRyaWdnZXJSZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlJVTlRJTUVfRVJST1IsIHsgbWVzc2FnZTogZS5tZXNzYWdlIHx8IGAke2V9YCB9LCBcInRleHQgbm9kZVwiKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYXR0ci52YWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGF0dHIsIHN0b3ApO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChyZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja0VmZmVjdCh0YXJnZXQ6IGFueSwgc3RvcDogYW55KSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICBcbiAgICAgIGNvbnN0IHRyYWNraW5nU2NvcGUgPSBpbnN0YW5jZSA/IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKSA6IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICBjb25zdCBwcmV2U2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG5cbiAgICAgIC8vIEV2YWx1YXRlIGNvbmRpdGlvbnMgc3luY2hyb25vdXNseSB0byBlbnN1cmUgc2lnbmFsIHRyYWNraW5nXG4gICAgICBjb25zdCByZXN1bHRzOiBib29sZWFuW10gPSBbXTtcbiAgICAgIHJlc3VsdHMucHVzaCghIXRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvbnNbMF1bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSkpO1xuICAgICAgXG4gICAgICBpZiAoIXJlc3VsdHNbMF0pIHtcbiAgICAgICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZWlmXCJdKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2godmFsKTtcbiAgICAgICAgICAgIGlmICh2YWwpIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlXCJdKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XG4gICAgICAgICAgICBleHByZXNzaW9uc1swXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzW2ldKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zW2ldWzBdLmFjY2VwdCh0aGlzLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gcnVuO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuICAgIGlmIChrZXlBdHRyKSB7XG4gICAgICB0aGlzLmRvRWFjaEtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCwga2V5QXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9FYWNoVW5rZXllZChlYWNoLCBub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoVW5rZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChrZXkpIHNjb3BlVmFsdWVzW2tleV0gPSBpbmRleDtcblxuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUmVmcmVzaChub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgLy8gMS4gUmUtcnVuIHN0cnVjdHVyYWwgbG9naWMgKGlmL2VhY2gvd2hpbGUpXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlclJlZnJlc2gpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlclJlZnJlc2goKTtcbiAgICB9XG4gICAgXG4gICAgLy8gMi4gUmUtcnVuIGFsbCBzdXJnaWNhbCBlZmZlY3RzICh0ZXh0IGludGVycG9sYXRpb24sIGF0dHJpYnV0ZXMsIGV0Yy4pXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0b3AucnVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnRyaWdnZXJSZWZyZXNoKGNoaWxkKSk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBpbmRleEtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXMgaW1tZWRpYXRlbHlcbiAgICAgIGNvbnN0IG5ld0l0ZW1zOiBBcnJheTx7IGl0ZW06IGFueTsgaWR4OiBudW1iZXI7IGtleTogYW55IH0+ID0gW107XG4gICAgICBjb25zdCBzZWVuS2V5cyA9IG5ldyBTZXQoKTtcbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIHNlZW5LZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBbS2FzcGVyXSBEdXBsaWNhdGUga2V5IGRldGVjdGVkIGluIEBlYWNoOiBcIiR7a2V5fVwiLiBLZXlzIG11c3QgYmUgdW5pcXVlIHRvIGVuc3VyZSBjb3JyZWN0IHJlY29uY2lsaWF0aW9uLmApO1xuICAgICAgICB9XG4gICAgICAgIHNlZW5LZXlzLmFkZChrZXkpO1xuXG4gICAgICAgIG5ld0l0ZW1zLnB1c2goeyBpdGVtOiBpdGVtLCBpZHg6IGluZGV4LCBrZXk6IGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBkb21Ob2RlXSBvZiBrZXllZE5vZGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgeyBpdGVtLCBpZHgsIGtleSB9IG9mIG5ld0l0ZW1zKSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG5cbiAgICAgICAgICBpZiAoa2V5ZWROb2Rlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgY29uc3QgZG9tTm9kZSA9IGtleWVkTm9kZXMuZ2V0KGtleSkhO1xuICAgICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGRvbU5vZGUpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgc2NvcGUgYW5kIHRyaWdnZXIgcmUtcmVuZGVyIG9mIG5lc3RlZCBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXNcbiAgICAgICAgICAgIGNvbnN0IG5vZGVTY29wZSA9IChkb21Ob2RlIGFzIGFueSkuJGthc3BlclNjb3BlO1xuICAgICAgICAgICAgaWYgKG5vZGVTY29wZSkge1xuICAgICAgICAgICAgICBub2RlU2NvcGUuc2V0KG5hbWUsIGl0ZW0pO1xuICAgICAgICAgICAgICBpZiAoaW5kZXhLZXkpIG5vZGVTY29wZS5zZXQoaW5kZXhLZXksIGlkeCk7XG5cbiAgICAgICAgICAgICAgLy8gSWYgaXQgaGFzIGl0cyBvd24gcmVuZGVyIGxvZ2ljIChuZXN0ZWQgZWFjaC9pZiksIHRyaWdnZXIgaXQgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyUmVmcmVzaChkb21Ob2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgaWYgKGNyZWF0ZWQpIHtcbiAgICAgICAgICAgICAga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHNjb3BlIG9uIHRoZSBET00gbm9kZSBzbyB3ZSBjYW4gdXBkYXRlIGl0IGxhdGVyXG4gICAgICAgICAgICAgIChjcmVhdGVkIGFzIGFueSkuJGthc3BlclNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cblxuICBwcml2YXRlIGRvV2hpbGUoJHdoaWxlOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJ3aGlsZVwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAvLyBUcmFja2luZzogZXZhbHVhdGUgZmlyc3QgaXRlcmF0aW9uIHN5bmNocm9ub3VzbHkgaW4gYSB0ZW1wb3Jhcnkgc2NvcGVcbiAgICAgICAgY29uc3QgdHJhY2tpbmdTY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG4gICAgICAgIGNvbnN0IGZpcnN0Q29uZGl0aW9uID0gISF0aGlzLmV4ZWN1dGUoJHdoaWxlLnZhbHVlKTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcblxuICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICAgIC8vIFVzZSB0aGUgc2FtZSB0cmFja2luZyBzY29wZSB0byBjb250aW51ZSB0aGUgbG9vcFxuICAgICAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG4gICAgICAgICAgbGV0IGN1cnJlbnRDb25kaXRpb24gPSBmaXJzdENvbmRpdGlvbjtcbiAgICAgICAgICB3aGlsZSAoY3VycmVudENvbmRpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICBjdXJyZW50Q29uZGl0aW9uID0gISF0aGlzLmV4ZWN1dGUoJHdoaWxlLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICAgICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gcnVuO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICAvLyBleGVjdXRlcyBpbml0aWFsaXphdGlvbiBpbiB0aGUgY3VycmVudCBzY29wZVxuICBwcml2YXRlIGRvTGV0KGluaXQ6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSk7XG5cbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG5cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTaWJsaW5ncyhub2RlczogS05vZGUuS05vZGVbXSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gMDtcbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcblxuICAgICAgICAvLyBWYWxpZGF0aW9uOiBPbmx5IG9uZSBjb25kaXRpb25hbCBhbGxvd2VkIHBlciBlbGVtZW50XG4gICAgICAgIGNvbnN0IGlmQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBpZlwiXSk7XG4gICAgICAgIGNvbnN0IGVsc2VpZkF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZWlmXCJdKTtcbiAgICAgICAgY29uc3QgZWxzZUF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZVwiXSk7XG4gICAgICAgIGlmIChbaWZBdHRyLCBlbHNlaWZBdHRyLCBlbHNlQXR0cl0uZmlsdGVyKChhKSA9PiBhKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkRVUExJQ0FURV9JRiwge30sIGVsLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWFjaFwiXSk7XG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGlmID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBpZlwiXSk7XG4gICAgICAgIGlmICgkaWYpIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tub2RlIGFzIEtOb2RlLkVsZW1lbnQsICRpZl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxuICAgICAgICAgICAgICBcIkBlbHNlaWZcIixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChbbm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgYXR0cl0pO1xuICAgICAgICAgICAgICBjdXJyZW50ICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJHdoaWxlID0gdGhpcy5maW5kQXR0cihub2RlIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkB3aGlsZVwiXSk7XG4gICAgICAgIGlmICgkd2hpbGUpIHtcbiAgICAgICAgICB0aGlzLmRvV2hpbGUoJHdoaWxlLCBub2RlIGFzIEtOb2RlLkVsZW1lbnQsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGxldCA9IHRoaXMuZmluZEF0dHIobm9kZSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICB0aGlzLmRvTGV0KCRsZXQsIG5vZGUgYXMgS05vZGUuRWxlbWVudCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1lbnQobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgIHRyeSB7XG4gICAgICBpZiAobm9kZS5uYW1lID09PSBcInNsb3RcIikge1xuICAgICAgICBjb25zdCBuYW1lQXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQG5hbWVcIl0pO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZUF0dHIgPyBuYW1lQXR0ci52YWx1ZSA6IFwiZGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBzbG90cyA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJHNsb3RzXCIpO1xuICAgICAgICBpZiAoc2xvdHMgJiYgc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuXG4gICAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQ29tcG9uZW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgICAgbGV0IGNvbXBvbmVudDogYW55ID0ge307XG4gICAgICAgIGNvbnN0IGFyZ3NBdHRyID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnc0F0dHIgYXMgS05vZGUuQXR0cmlidXRlW10pO1xuXG4gICAgICAgIC8vIENhcHR1cmUgY2hpbGRyZW4gZm9yIHNsb3RzXG4gICAgICAgIGNvbnN0IHNsb3RzOiBSZWNvcmQ8c3RyaW5nLCBLTm9kZS5LTm9kZVtdPiA9IHsgZGVmYXVsdDogW10gfTtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICBjb25zdCBzbG90QXR0ciA9IHRoaXMuZmluZEF0dHIoY2hpbGQgYXMgS05vZGUuRWxlbWVudCwgW1wiQHNsb3RcIl0pO1xuICAgICAgICAgICAgaWYgKHNsb3RBdHRyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzbG90QXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFzbG90c1tuYW1lXSkgc2xvdHNbbmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgc2xvdHNbbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzbG90cy5kZWZhdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXT8uY29tcG9uZW50KSB7XG4gICAgICAgICAgY29tcG9uZW50ID0gbmV3IHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5jb21wb25lbnQoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBjb25zdCBjb21wb25lbnROb2RlcyA9IHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5ub2RlcyE7XG4gICAgICAgICAgY29tcG9uZW50LiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcbiAgICAgICAgICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKGNvbXBvbmVudE5vZGVzLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAobm9kZS5uYW1lID09PSBcInJvdXRlclwiICYmIGNvbXBvbmVudCBpbnN0YW5jZW9mIFJvdXRlcikge1xuICAgICAgICAgICAgY29uc3Qgcm91dGVTY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0Um91dGVzKHRoaXMuZXh0cmFjdFJvdXRlcyhub2RlLmNoaWxkcmVuLCB1bmRlZmluZWQsIHJvdXRlU2NvcGUpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5vbk1vdW50KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEV4cG9zZSBzbG90cyBpbiBjb21wb25lbnQgc2NvcGVcbiAgICAgICAgY29tcG9uZW50LiRzbG90cyA9IHNsb3RzO1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgY2hpbGRyZW4gb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3ModGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLm5vZGVzISwgZWxlbWVudCk7XG5cbiAgICAgICAgICBpZiAoY29tcG9uZW50ICYmIHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgICAgLy8gZXZlbnQgYmluZGluZ1xuICAgICAgICBjb25zdCBldmVudHMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBmaXJzdClcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoXG4gICAgICAgICAgKGF0dHIpID0+ICEoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgYXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXR0ciwgZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG9ydGhhbmQgYXR0cmlidXRlcyAocHJvY2Vzc2VkIHNlY29uZCwgYWxsb3dzIG1lcmdpbmcpXG4gICAgICAgIGNvbnN0IHNob3J0aGFuZEF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgbmFtZS5zdGFydHNXaXRoKFwiQFwiKSAmJlxuICAgICAgICAgICAgIVtcIkBpZlwiLCBcIkBlbHNlaWZcIiwgXCJAZWxzZVwiLCBcIkBlYWNoXCIsIFwiQHdoaWxlXCIsIFwiQGxldFwiLCBcIkBrZXlcIiwgXCJAcmVmXCJdLmluY2x1ZGVzKFxuICAgICAgICAgICAgICBuYW1lXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIHNob3J0aGFuZEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCByZWFsTmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zbGljZSgxKTtcblxuICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICBsZXQgbGFzdER5bmFtaWNWYWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0aWNDbGFzcyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gc3RhdGljQ2xhc3Muc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKGMgPT4gYyAhPT0gbGFzdER5bmFtaWNWYWx1ZSAmJiBjICE9PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY3VycmVudENsYXNzZXMgPyBgJHtjdXJyZW50Q2xhc3Nlc30gJHt2YWx1ZX1gIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICBsYXN0RHluYW1pY1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSAhPT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5yZW1vdmVBdHRyaWJ1dGUocmVhbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBleGlzdGluZyAmJiAhZXhpc3RpbmcuaW5jbHVkZXModmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBgJHtleGlzdGluZy5lbmRzV2l0aChcIjtcIikgPyBleGlzdGluZyA6IGV4aXN0aW5nICsgXCI7XCJ9ICR7dmFsdWV9YFxuICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKHJlYWxOYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCB0YXNrKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmVudCAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZWZBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAcmVmXCJdKTtcbiAgICAgIGlmIChyZWZBdHRyICYmICFpc1ZvaWQpIHtcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSByZWZBdHRyLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgaW5zdGFuY2VbcHJvcE5hbWVdID0gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChwcm9wTmFtZSwgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUuc2VsZikge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlLmNoaWxkcmVuLCBlbGVtZW50KTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG5cbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlJVTlRJTUVfRVJST1IsIHsgbWVzc2FnZTogZS5tZXNzYWdlIHx8IGAke2V9YCB9LCBub2RlLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzOiBLTm9kZS5BdHRyaWJ1dGVbXSk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgY29uc3Qga2V5ID0gYXJnLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmV4ZWN1dGUoYXJnLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBOb2RlLCBhdHRyOiBLTm9kZS5BdHRyaWJ1dGUpOiB2b2lkIHtcbiAgICBjb25zdCBbZXZlbnROYW1lLCAuLi5tb2RpZmllcnNdID0gYXR0ci5uYW1lLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0ge307XG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gICAgfVxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvbmNlXCIpKSAgICBvcHRpb25zLm9uY2UgICAgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKSBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKSBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJzdG9wXCIpKSAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxpc3RlbmVyU2NvcGUuc2V0KFwiJGV2ZW50XCIsIGV2ZW50KTtcbiAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBsaXN0ZW5lclNjb3BlKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xce1xcey4rXFx9XFx9L21zO1xuICAgIGlmIChyZWdleC50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZywgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSBgJHt0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pfWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lOb2RlKG5vZGU6IGFueSk6IHZvaWQge1xuICAgIC8vIDEuIENsZWFudXAgY29tcG9uZW50IGluc3RhbmNlXG4gICAgaWYgKG5vZGUuJGthc3Blckluc3RhbmNlKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5vZGUuJGthc3Blckluc3RhbmNlO1xuICAgICAgaWYgKGluc3RhbmNlLm9uRGVzdHJveSkge1xuICAgICAgICBpbnN0YW5jZS5vbkRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuXG4gICAgLy8gMi4gQ2xlYW51cCBlZmZlY3RzIGF0dGFjaGVkIHRvIHRoZSBub2RlXG4gICAgaWYgKG5vZGUuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyAzLiBDbGVhbnVwIGVmZmVjdHMgb24gYXR0cmlidXRlc1xuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChhdHRyLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDQuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkOiBhbnkpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KGNvbnRhaW5lcjogRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgbW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSAoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKSByZXR1cm47XG5cbiAgICBjb25zdCBub2RlcyA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpLnBhcnNlKHRlbXBsYXRlKTtcbiAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaG9zdCk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50Q2xhc3MoeyBhcmdzOiB7IHBhcmFtczogcGFyYW1zIH0sIHJlZjogaG9zdCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgKGhvc3QgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICBjb25zdCBjb21wb25lbnROb2RlcyA9IG5vZGVzO1xuICAgIGNvbXBvbmVudC4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koaG9zdCk7XG4gICAgICAgIGhvc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUobnVsbCwgY29tcG9uZW50KTtcbiAgICAgICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIFxuICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3MoY29tcG9uZW50Tm9kZXMsIGhvc3QpO1xuICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vbk1vdW50KCk7XG5cbiAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICBcbiAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgaG9zdCk7XG4gICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICB9XG5cbiAgcHVibGljIGV4dHJhY3RSb3V0ZXMoY2hpbGRyZW46IEtOb2RlLktOb2RlW10sIHBhcmVudEd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPiwgc2NvcGU/OiBTY29wZSk6IFJvdXRlQ29uZmlnW10ge1xuICAgIGNvbnN0IHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuICAgIGNvbnN0IHByZXZTY29wZSA9IHNjb3BlID8gdGhpcy5pbnRlcnByZXRlci5zY29wZSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQudHlwZSAhPT0gXCJlbGVtZW50XCIpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZWwgPSBjaGlsZCBhcyBLTm9kZS5FbGVtZW50O1xuICAgICAgaWYgKGVsLm5hbWUgPT09IFwicm91dGVcIikge1xuICAgICAgICBjb25zdCBwYXRoQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBwYXRoXCJdKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50QXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjb21wb25lbnRcIl0pO1xuICAgICAgICBjb25zdCBndWFyZEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZ3VhcmRcIl0pO1xuXG4gICAgICAgIGlmICghcGF0aEF0dHIgfHwgIWNvbXBvbmVudEF0dHIpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTU0lOR19SRVFVSVJFRF9BVFRSLCB7IG1lc3NhZ2U6IFwiPHJvdXRlPiByZXF1aXJlcyBAcGF0aCBhbmQgQGNvbXBvbmVudCBhdHRyaWJ1dGVzLlwiIH0sIGVsLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhBdHRyIS52YWx1ZTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5leGVjdXRlKGNvbXBvbmVudEF0dHIhLnZhbHVlKTtcbiAgICAgICAgY29uc3QgZ3VhcmQgPSBndWFyZEF0dHIgPyB0aGlzLmV4ZWN1dGUoZ3VhcmRBdHRyLnZhbHVlKSA6IHBhcmVudEd1YXJkO1xuICAgICAgICByb3V0ZXMucHVzaCh7IHBhdGg6IHBhdGgsIGNvbXBvbmVudDogY29tcG9uZW50LCBndWFyZDogZ3VhcmQgfSk7XG4gICAgICB9IGVsc2UgaWYgKGVsLm5hbWUgPT09IFwiZ3VhcmRcIikge1xuICAgICAgICBjb25zdCBjaGVja0F0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAY2hlY2tcIl0pO1xuICAgICAgICBpZiAoIWNoZWNrQXR0cikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNTSU5HX1JFUVVJUkVEX0FUVFIsIHsgbWVzc2FnZTogXCI8Z3VhcmQ+IHJlcXVpcmVzIEBjaGVjayBhdHRyaWJ1dGUuXCIgfSwgZWwubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNoZWNrQXR0cikgY29udGludWU7XG4gICAgICAgIGNvbnN0IGNoZWNrID0gdGhpcy5leGVjdXRlKGNoZWNrQXR0ci52YWx1ZSk7XG4gICAgICAgIHJvdXRlcy5wdXNoKC4uLnRoaXMuZXh0cmFjdFJvdXRlcyhlbC5jaGlsZHJlbiwgY2hlY2spKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNjb3BlKSB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgIHJldHVybiByb3V0ZXM7XG4gIH1cblxuICBwcml2YXRlIHRyaWdnZXJSZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSZW5kZXJpbmcpIHJldHVybjtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgIGlmIChpbnN0YW5jZSAmJiB0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUoX25vZGU6IEtOb2RlLkRvY3R5cGUpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gICAgLy8gcmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50VHlwZShcImh0bWxcIiwgXCJcIiwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSwgdGFnTmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBmaW5hbEFyZ3MgPSBhcmdzO1xuICAgIGlmICh0eXBlb2YgYXJncyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgY29uc3QgY2xlYW5NZXNzYWdlID0gYXJncy5pbmNsdWRlcyhcIlJ1bnRpbWUgRXJyb3JcIilcbiAgICAgICAgPyBhcmdzLnJlcGxhY2UoXCJSdW50aW1lIEVycm9yOiBcIiwgXCJcIilcbiAgICAgICAgOiBhcmdzO1xuICAgICAgZmluYWxBcmdzID0geyBtZXNzYWdlOiBjbGVhbk1lc3NhZ2UgfTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgZmluYWxBcmdzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGFnTmFtZSk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICB0cnkge1xuICAgIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcGlsZShcbiAgc291cmNlOiBzdHJpbmcsXG4gIGVudGl0eT86IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gIGNvbnRhaW5lcj86IEhUTUxFbGVtZW50LFxuICByZWdpc3RyeT86IENvbXBvbmVudFJlZ2lzdHJ5XG4pOiBOb2RlIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB8fCB7fSB9KTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudGl0eSB8fCB7fSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gS2FzcGVyKENvbXBvbmVudENsYXNzOiBhbnkpIHtcbiAgYm9vdHN0cmFwKHtcbiAgICByb290OiBcImthc3Blci1hcHBcIixcbiAgICBlbnRyeTogXCJrYXNwZXItcm9vdFwiLFxuICAgIHJlZ2lzdHJ5OiB7XG4gICAgICBcImthc3Blci1yb290XCI6IHtcbiAgICAgICAgc2VsZWN0b3I6IFwidGVtcGxhdGVcIixcbiAgICAgICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcyxcbiAgICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEthc3BlckNvbmZpZyB7XG4gIHJvb3Q/OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcbiAgZW50cnk/OiBzdHJpbmc7XG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeTtcbiAgbW9kZT86IFwiZGV2ZWxvcG1lbnRcIiB8IFwicHJvZHVjdGlvblwiO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoXG4gIHRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsXG4gIHRhZzogc3RyaW5nLFxuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnlcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVnaXN0cnlbdGFnXS5jb21wb25lbnQoe1xuICAgIHJlZjogZWxlbWVudCxcbiAgICB0cmFuc3BpbGVyOiB0cmFuc3BpbGVyLFxuICAgIGFyZ3M6IHt9LFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIG5vZGU6IGVsZW1lbnQsXG4gICAgaW5zdGFuY2U6IGNvbXBvbmVudCxcbiAgICBub2RlczogcmVnaXN0cnlbdGFnXS5ub2RlcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmVnaXN0cnkoXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSxcbiAgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxuKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHsgLi4ucmVnaXN0cnkgfTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocmVnaXN0cnkpKSB7XG4gICAgY29uc3QgZW50cnkgPSByZWdpc3RyeVtrZXldO1xuICAgIGlmICghZW50cnkubm9kZXMpIGVudHJ5Lm5vZGVzID0gW107XG4gICAgaWYgKGVudHJ5Lm5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoZW50cnkuc2VsZWN0b3IpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbnRyeS5zZWxlY3Rvcik7XG4gICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgZW50cnkudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UodGVtcGxhdGUuaW5uZXJIVE1MKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW50cnkudGVtcGxhdGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGVudHJ5Lm5vZGVzID0gcGFyc2VyLnBhcnNlKGVudHJ5LnRlbXBsYXRlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBzdGF0aWNUZW1wbGF0ZSA9IChlbnRyeS5jb21wb25lbnQgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoc3RhdGljVGVtcGxhdGUpIHtcbiAgICAgIGVudHJ5Lm5vZGVzID0gcGFyc2VyLnBhcnNlKHN0YXRpY1RlbXBsYXRlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvb3RzdHJhcChjb25maWc6IEthc3BlckNvbmZpZykge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgcm9vdCA9XG4gICAgdHlwZW9mIGNvbmZpZy5yb290ID09PSBcInN0cmluZ1wiXG4gICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnJvb3QpXG4gICAgICA6IGNvbmZpZy5yb290O1xuXG4gIGlmICghcm9vdCkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihcbiAgICAgIEtFcnJvckNvZGUuUk9PVF9FTEVNRU5UX05PVF9GT1VORCxcbiAgICAgIHsgcm9vdDogY29uZmlnLnJvb3QgfVxuICAgICk7XG4gIH1cblxuICBjb25zdCBlbnRyeVRhZyA9IGNvbmZpZy5lbnRyeSB8fCBcImthc3Blci1hcHBcIjtcbiAgaWYgKCFjb25maWcucmVnaXN0cnlbZW50cnlUYWddKSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5FTlRSWV9DT01QT05FTlRfTk9UX0ZPVU5ELFxuICAgICAgeyB0YWc6IGVudHJ5VGFnIH1cbiAgICApO1xuICB9XG5cbiAgY29uc3QgcmVnaXN0cnkgPSBub3JtYWxpemVSZWdpc3RyeShjb25maWcucmVnaXN0cnksIHBhcnNlcik7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB9KTtcbiAgXG4gIC8vIFNldCB0aGUgZW52aXJvbm1lbnQgbW9kZSBvbiB0aGUgdHJhbnNwaWxlciBvciBnbG9iYWxseVxuICBpZiAoY29uZmlnLm1vZGUpIHtcbiAgICAodHJhbnNwaWxlciBhcyBhbnkpLm1vZGUgPSBjb25maWcubW9kZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEZWZhdWx0IHRvIGRldmVsb3BtZW50IGlmIG5vdCBzcGVjaWZpZWRcbiAgICAodHJhbnNwaWxlciBhcyBhbnkpLm1vZGUgPSBcImRldmVsb3BtZW50XCI7XG4gIH1cblxuICBjb25zdCB7IG5vZGUsIGluc3RhbmNlLCBub2RlcyB9ID0gY3JlYXRlQ29tcG9uZW50KFxuICAgIHRyYW5zcGlsZXIsXG4gICAgZW50cnlUYWcsXG4gICAgcmVnaXN0cnlcbiAgKTtcblxuICBpZiAocm9vdCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICByb290LmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG5cbiAgLy8gSW5pdGlhbCByZW5kZXIgYW5kIGxpZmVjeWNsZVxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGluc3RhbmNlLm9uTW91bnQoKTtcbiAgfVxuXG4gIHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBpbnN0YW5jZSwgbm9kZSBhcyBIVE1MRWxlbWVudCk7XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cbiJdLCJuYW1lcyI6WyJyYXdFZmZlY3QiLCJyYXdDb21wdXRlZCIsIlNldCIsIlRva2VuVHlwZSIsIkV4cHIuRWFjaCIsIkV4cHIuVmFyaWFibGUiLCJFeHByLkJpbmFyeSIsIkV4cHIuQXNzaWduIiwiRXhwci5HZXQiLCJFeHByLlNldCIsIkV4cHIuUGlwZWxpbmUiLCJFeHByLlRlcm5hcnkiLCJFeHByLk51bGxDb2FsZXNjaW5nIiwiRXhwci5Mb2dpY2FsIiwiRXhwci5UeXBlb2YiLCJFeHByLlVuYXJ5IiwiRXhwci5DYWxsIiwiRXhwci5OZXciLCJFeHByLlBvc3RmaXgiLCJFeHByLlNwcmVhZCIsIkV4cHIuS2V5IiwiRXhwci5MaXRlcmFsIiwiRXhwci5UZW1wbGF0ZSIsIkV4cHIuQXJyb3dGdW5jdGlvbiIsIkV4cHIuR3JvdXBpbmciLCJFeHByLlZvaWQiLCJFeHByLkRlYnVnIiwiRXhwci5EaWN0aW9uYXJ5IiwiRXhwci5MaXN0IiwiVXRpbHMuaXNEaWdpdCIsIlV0aWxzLmlzQWxwaGFOdW1lcmljIiwiVXRpbHMuY2FwaXRhbGl6ZSIsIlV0aWxzLmlzS2V5d29yZCIsIlV0aWxzLmlzQWxwaGEiLCJQYXJzZXIiLCJDb21tZW50IiwiTm9kZS5Db21tZW50IiwiTm9kZS5Eb2N0eXBlIiwiTm9kZS5FbGVtZW50IiwiTm9kZS5BdHRyaWJ1dGUiLCJOb2RlLlRleHQiLCJDb21wb25lbnRDbGFzcyIsInNjb3BlIiwicHJldiJdLCJtYXBwaW5ncyI6IkFBQU8sTUFBTSxhQUFhO0FBQUE7QUFBQSxFQUV4Qix3QkFBd0I7QUFBQSxFQUN4QiwyQkFBMkI7QUFBQTtBQUFBLEVBRzNCLHNCQUFzQjtBQUFBLEVBQ3RCLHFCQUFxQjtBQUFBLEVBQ3JCLHNCQUFzQjtBQUFBO0FBQUEsRUFHdEIsZ0JBQWdCO0FBQUEsRUFDaEIsd0JBQXdCO0FBQUEsRUFDeEIsbUJBQW1CO0FBQUEsRUFDbkIsMEJBQTBCO0FBQUEs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QUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsZ0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxpQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxrQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxrQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsS0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLElBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsS0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLElBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEs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LFFBQUE7QUFDbEIsWUFBUSxNQUFBO0FBQUEsTUFDTixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsWUFBWSxJQUFJO0FBQ3hDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsYUFBYSxJQUFJO0FBQ3pDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsY0FBYyxJQUFJO0FBQzFDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsWUFBWSxJQUFJO0FBQ3hDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsTUFBTSxJQUFJO0FBQ2xDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFFBQVEsVUFBVTtBQUFBLFVBQzlDO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFlBQVksVUFBVTtBQUFBLFVBQ2xEO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLGVBQWUsVUFBVTtBQUFBLFVBQ3JEO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEtBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxXQUM1QixVQUFVO0FBQUEsVUFDVjtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxNQUFNLFVBQVU7QUFBQSxVQUM1QztBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxhQUM1QixLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsZUFBZSxVQUFVO0FBQUEsVUFDckQ7QUFBQSxRQUFBO0FBRUY7QUFBQSxNQUNGLEtBQUs7QUFDSCxhQUFLO0FBQUEsVUFDSCxLQUFLLE1BQU0sR0FBRyxJQUNWLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxpQkFBaUIsVUFBVSxZQUN2RCxVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQ1YsVUFBVSxtQkFDVixLQUFLLE1BQU0sR0FBRyxJQUNkLFVBQVUsY0FDVixVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksS0FBSyxNQUFNLEdBQUcsR0FBRztBQUNuQixlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsa0JBQWtCLFVBQVU7QUFBQSxZQUN4RDtBQUFBLFVBQUE7QUFFRjtBQUFBLFFBQ0Y7QUFDQSxhQUFLO0FBQUEsVUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsUUFBUSxVQUFVO0FBQUEsVUFDOUM7QUFBQSxRQUFBO0FBRUY7QUFBQSxNQUNGLEtBQUs7QUFDSCxhQUFLO0FBQUEsVUFDSCxLQUFLLE1BQU0sR0FBRyxJQUNWLFVBQVUsV0FDVixLQUFLLE1BQU0sR0FBRyxJQUNkLFVBQVUsWUFDVixVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQ1YsVUFBVSxhQUNWLEtBQUssTUFBTSxHQUFHLElBQ2QsVUFBVSxhQUNWLFVBQVU7QUFBQSxVQUNkO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFlBQzVCLEtBQUssTUFBTSxHQUFHLElBQ1YsS0FBSyxNQUFNLEdBQUcsSUFDWixVQUFVLG1CQUNWLFVBQVUsWUFDWixVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksS0FBSyxNQUFNLEdBQUcsR0FBRztBQUNuQixjQUFJLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDbkIsaUJBQUssU0FBUyxVQUFVLFdBQVcsSUFBSTtBQUFBLFVBQ3pDLE9BQU87QUFDTCxpQkFBSyxTQUFTLFVBQVUsUUFBUSxJQUFJO0FBQUEsVUFDdEM7QUFBQSxRQUNGLE9BQU87QUFDTCxlQUFLLFNBQVMsVUFBVSxLQUFLLElBQUk7QUFBQSxRQUNuQztBQUNBO0FBQUEsTUFDRixLQUFLO0FBQ0gsWUFBSSxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQ25CLGVBQUssUUFBQTtBQUFBLFFBQ1AsV0FBVyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQzFCLGVBQUssaUJBQUE7QUFBQSxRQUNQLE9BQU87QUFDTCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsYUFBYSxVQUFVO0FBQUEsWUFDbkQ7QUFBQSxVQUFBO0FBQUEsUUFFSjtBQUNBO0FBQUEsTUFDRixLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQ0gsYUFBSyxPQUFPLElBQUk7QUFDaEI7QUFBQTtBQUFBLE1BRUYsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUNIO0FBQUE7QUFBQSxNQUVGO0FBQ0UsWUFBSUgsUUFBYyxJQUFJLEdBQUc7QUFDdkIsZUFBSyxPQUFBO0FBQUEsUUFDUCxXQUFXSSxRQUFjLElBQUksR0FBRztBQUM5QixlQUFLLFdBQUE7QUFBQSxRQUNQLE9BQU87QUFDTCxlQUFLLE1BQU0sV0FBVyxzQkFBc0IsRUFBRSxNQUFZO0FBQUEsUUFDNUQ7QUFDQTtBQUFBLElBQUE7QUFBQSxFQUVOO0FBQUEsRUFFUSxNQUFNLE1BQXNCLE9BQVksSUFBVTtBQUN4RCxVQUFNLElBQUksWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLEtBQUssR0FBRztBQUFBLEVBQ3ZEO0FBQ0Y7QUMvVk8sTUFBTSxNQUFNO0FBQUEsRUFJakIsWUFBWSxRQUFnQixRQUE4QjtBQUN4RCxTQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2hDLFNBQUssU0FBUyxTQUFTLFNBQVMsQ0FBQTtBQUFBLEVBQ2xDO0FBQUEsRUFFTyxLQUFLLFFBQW9DO0FBQzlDLFNBQUssU0FBUyxTQUFTLFNBQVMsQ0FBQTtBQUFBLEVBQ2xDO0FBQUEsRUFFTyxJQUFJLE1BQWMsT0FBWTtBQUNuQyxTQUFLLE9BQU8sSUFBSSxJQUFJO0FBQUEsRUFDdEI7QUFBQSxFQUVPLElBQUksS0FBa0I7QVJqQnhCO0FRa0JILFFBQUksT0FBTyxLQUFLLE9BQU8sR0FBRyxNQUFNLGFBQWE7QUFDM0MsYUFBTyxLQUFLLE9BQU8sR0FBRztBQUFBLElBQ3hCO0FBRUEsVUFBTSxZQUFZLGdCQUFLLFdBQUwsbUJBQWEsZ0JBQWIsbUJBQWtDO0FBQ3BELFFBQUksWUFBWSxPQUFPLFNBQVMsR0FBRyxNQUFNLGFBQWE7QUFDcEQsYUFBTyxTQUFTLEdBQUc7QUFBQSxJQUNyQjtBQUVBLFFBQUksS0FBSyxXQUFXLE1BQU07QUFDeEIsYUFBTyxLQUFLLE9BQU8sSUFBSSxHQUFHO0FBQUEsSUFDNUI7QUFFQSxXQUFPLE9BQU8sR0FBMEI7QUFBQSxFQUMxQztBQUNGO0FDMUJPLE1BQU0sWUFBNkM7QUFBQSxFQUFuRCxjQUFBO0FBQ0wsU0FBTyxRQUFRLElBQUksTUFBQTtBQUNuQixTQUFRLFVBQVUsSUFBSSxRQUFBO0FBQ3RCLFNBQVEsU0FBUyxJQUFJQyxpQkFBQTtBQUFBLEVBQU87QUFBQSxFQUVyQixTQUFTLE1BQXNCO0FBQ3BDLFdBQVEsS0FBSyxTQUFTLEtBQUssT0FBTyxJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUVPLGtCQUFrQixNQUEwQjtBQUNqRCxVQUFNLFFBQVEsS0FBSyxTQUFTLEtBQUssSUFBSTtBQUVyQyxRQUFJLEtBQUssaUJBQWlCbEIsTUFBVztBQUNuQyxZQUFNLFNBQVMsS0FBSyxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQzlDLFlBQU0sT0FBTyxDQUFDLEtBQUs7QUFDbkIsaUJBQVcsT0FBTyxLQUFLLE1BQU0sTUFBTTtBQUNqQyxZQUFJLGVBQWVHLFFBQWE7QUFDOUIsZUFBSyxLQUFLLEdBQUcsS0FBSyxTQUFVLElBQW9CLEtBQUssQ0FBQztBQUFBLFFBQ3hELE9BQU87QUFDTCxlQUFLLEtBQUssS0FBSyxTQUFTLEdBQUcsQ0FBQztBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUNBLFVBQUksS0FBSyxNQUFNLGtCQUFrQlgsS0FBVTtBQUN6QyxlQUFPLE9BQU8sTUFBTSxLQUFLLE1BQU0sT0FBTyxPQUFPLFFBQVEsSUFBSTtBQUFBLE1BQzNEO0FBQ0EsYUFBTyxPQUFPLEdBQUcsSUFBSTtBQUFBLElBQ3ZCO0FBRUEsVUFBTSxLQUFLLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFDbkMsV0FBTyxHQUFHLEtBQUs7QUFBQSxFQUNqQjtBQUFBLEVBRU8sdUJBQXVCLE1BQStCO0FBQzNELFVBQU0sZ0JBQWdCLEtBQUs7QUFDM0IsV0FBTyxJQUFJLFNBQWdCO0FBQ3pCLFlBQU0sT0FBTyxLQUFLO0FBQ2xCLFdBQUssUUFBUSxJQUFJLE1BQU0sYUFBYTtBQUNwQyxlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssT0FBTyxRQUFRLEtBQUs7QUFDM0MsYUFBSyxNQUFNLElBQUksS0FBSyxPQUFPLENBQUMsRUFBRSxRQUFRLEtBQUssQ0FBQyxDQUFDO0FBQUEsTUFDL0M7QUFDQSxVQUFJO0FBQ0YsZUFBTyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBQUEsTUFDaEMsVUFBQTtBQUNFLGFBQUssUUFBUTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxNQUFzQixPQUFZLENBQUEsR0FBSSxNQUFlLEtBQW9CO0FBQ3BGLFVBQU0sSUFBSSxZQUFZLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxFQUM3QztBQUFBLEVBRU8sa0JBQWtCLE1BQTBCO0FBQ2pELFdBQU8sS0FBSyxNQUFNLElBQUksS0FBSyxLQUFLLE1BQU07QUFBQSxFQUN4QztBQUFBLEVBRU8sZ0JBQWdCLE1BQXdCO0FBQzdDLFVBQU0sUUFBUSxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBQ3RDLFNBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxRQUFRLEtBQUs7QUFDdEMsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGFBQWEsTUFBcUI7QUFDdkMsV0FBTyxLQUFLLEtBQUs7QUFBQSxFQUNuQjtBQUFBLEVBRU8sYUFBYSxNQUFxQjtBQUN2QyxVQUFNLFNBQVMsS0FBSyxTQUFTLEtBQUssTUFBTTtBQUN4QyxVQUFNLE1BQU0sS0FBSyxTQUFTLEtBQUssR0FBRztBQUNsQyxRQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsVUFBVSxhQUFhO0FBQ2xELGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTyxPQUFPLEdBQUc7QUFBQSxFQUNuQjtBQUFBLEVBRU8sYUFBYSxNQUFxQjtBQUN2QyxVQUFNLFNBQVMsS0FBSyxTQUFTLEtBQUssTUFBTTtBQUN4QyxVQUFNLE1BQU0sS0FBSyxTQUFTLEtBQUssR0FBRztBQUNsQyxVQUFNLFFBQVEsS0FBSyxTQUFTLEtBQUssS0FBSztBQUN0QyxXQUFPLEdBQUcsSUFBSTtBQUNkLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFTyxpQkFBaUIsTUFBeUI7QUFDL0MsVUFBTSxRQUFRLEtBQUssU0FBUyxLQUFLLE1BQU07QUFDdkMsVUFBTSxXQUFXLFFBQVEsS0FBSztBQUU5QixRQUFJLEtBQUssa0JBQWtCSCxVQUFlO0FBQ3hDLFdBQUssTUFBTSxJQUFJLEtBQUssT0FBTyxLQUFLLFFBQVEsUUFBUTtBQUFBLElBQ2xELFdBQVcsS0FBSyxrQkFBa0JHLEtBQVU7QUFDMUMsWUFBTSxTQUFTLElBQUlDO0FBQUFBLFFBQ2pCLEtBQUssT0FBTztBQUFBLFFBQ1osS0FBSyxPQUFPO0FBQUEsUUFDWixJQUFJWSxRQUFhLFVBQVUsS0FBSyxJQUFJO0FBQUEsUUFDcEMsS0FBSztBQUFBLE1BQUE7QUFFUCxXQUFLLFNBQVMsTUFBTTtBQUFBLElBQ3RCLE9BQU87QUFDTCxXQUFLLE1BQU0sV0FBVyx3QkFBd0IsRUFBRSxRQUFRLEtBQUssT0FBQSxHQUFVLEtBQUssSUFBSTtBQUFBLElBQ2xGO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGNBQWMsTUFBc0I7QUFDekMsVUFBTSxTQUFnQixDQUFBO0FBQ3RCLGVBQVcsY0FBYyxLQUFLLE9BQU87QUFDbkMsVUFBSSxzQkFBc0JGLFFBQWE7QUFDckMsZUFBTyxLQUFLLEdBQUcsS0FBSyxTQUFVLFdBQTJCLEtBQUssQ0FBQztBQUFBLE1BQ2pFLE9BQU87QUFDTCxlQUFPLEtBQUssS0FBSyxTQUFTLFVBQVUsQ0FBQztBQUFBLE1BQ3ZDO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFTyxnQkFBZ0IsTUFBd0I7QUFDN0MsV0FBTyxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBQUEsRUFDakM7QUFBQSxFQUVRLGNBQWMsUUFBd0I7QUFDNUMsVUFBTSxTQUFTLEtBQUssUUFBUSxLQUFLLE1BQU07QUFDdkMsVUFBTSxjQUFjLEtBQUssT0FBTyxNQUFNLE1BQU07QUFDNUMsUUFBSSxTQUFTO0FBQ2IsZUFBVyxjQUFjLGFBQWE7QUFDcEMsZ0JBQVUsS0FBSyxTQUFTLFVBQVUsRUFBRSxTQUFBO0FBQUEsSUFDdEM7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRU8sa0JBQWtCLE1BQTBCO0FBQ2pELFVBQU0sU0FBUyxLQUFLLE1BQU07QUFBQSxNQUN4QjtBQUFBLE1BQ0EsQ0FBQyxHQUFHLGdCQUFnQjtBQUNsQixlQUFPLEtBQUssY0FBYyxXQUFXO0FBQUEsTUFDdkM7QUFBQSxJQUFBO0FBRUYsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGdCQUFnQixNQUF3QjtBQUM3QyxVQUFNLE9BQU8sS0FBSyxTQUFTLEtBQUssSUFBSTtBQUNwQyxVQUFNLFFBQVEsS0FBSyxTQUFTLEtBQUssS0FBSztBQUV0QyxZQUFRLEtBQUssU0FBUyxNQUFBO0FBQUEsTUFDcEIsS0FBSyxVQUFVO0FBQUEsTUFDZixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFBQSxNQUNmLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUFBLE1BQ2YsS0FBSyxVQUFVO0FBQ2IsZUFBTyxPQUFPO0FBQUEsTUFDaEIsS0FBSyxVQUFVO0FBQUEsTUFDZixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFBQSxNQUNmLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUNiLGVBQU8sUUFBUTtBQUFBLE1BQ2pCLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUNiLGVBQU8sUUFBUTtBQUFBLE1BQ2pCLEtBQUssVUFBVTtBQUFBLE1BQ2YsS0FBSyxVQUFVO0FBQ2IsZUFBTyxTQUFTO0FBQUEsTUFDbEIsS0FBSyxVQUFVO0FBQUEsTUFDZixLQUFLLFVBQVU7QUFDYixlQUFPLFNBQVM7QUFBQSxNQUNsQixLQUFLLFVBQVU7QUFDYixlQUFPLGdCQUFnQjtBQUFBLE1BQ3pCLEtBQUssVUFBVTtBQUNiLGVBQU8sUUFBUTtBQUFBLE1BQ2pCLEtBQUssVUFBVTtBQUNiLGVBQU8sUUFBUTtBQUFBLE1BQ2pCLEtBQUssVUFBVTtBQUNiLGVBQU8sUUFBUTtBQUFBLE1BQ2pCO0FBQ0UsYUFBSyxNQUFNLFdBQVcseUJBQXlCLEVBQUUsVUFBVSxLQUFLLFNBQUEsR0FBWSxLQUFLLElBQUk7QUFDckYsZUFBTztBQUFBLElBQUE7QUFBQSxFQUViO0FBQUEsRUFFTyxpQkFBaUIsTUFBeUI7QUFDL0MsVUFBTSxPQUFPLEtBQUssU0FBUyxLQUFLLElBQUk7QUFFcEMsUUFBSSxLQUFLLFNBQVMsU0FBUyxVQUFVLElBQUk7QUFDdkMsVUFBSSxNQUFNO0FBQ1IsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGLE9BQU87QUFDTCxVQUFJLENBQUMsTUFBTTtBQUNULGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUVBLFdBQU8sS0FBSyxTQUFTLEtBQUssS0FBSztBQUFBLEVBQ2pDO0FBQUEsRUFFTyxpQkFBaUIsTUFBeUI7QUFDL0MsV0FBTyxLQUFLLFNBQVMsS0FBSyxTQUFTLElBQy9CLEtBQUssU0FBUyxLQUFLLFFBQVEsSUFDM0IsS0FBSyxTQUFTLEtBQUssUUFBUTtBQUFBLEVBQ2pDO0FBQUEsRUFFTyx3QkFBd0IsTUFBZ0M7QUFDN0QsVUFBTSxPQUFPLEtBQUssU0FBUyxLQUFLLElBQUk7QUFDcEMsUUFBSSxRQUFRLE1BQU07QUFDaEIsYUFBTyxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBQUEsSUFDakM7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRU8sa0JBQWtCLE1BQTBCO0FBQ2pELFdBQU8sS0FBSyxTQUFTLEtBQUssVUFBVTtBQUFBLEVBQ3RDO0FBQUEsRUFFTyxpQkFBaUIsTUFBeUI7QUFDL0MsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUFBLEVBRU8sZUFBZSxNQUF1QjtBQUMzQyxVQUFNLFFBQVEsS0FBSyxTQUFTLEtBQUssS0FBSztBQUN0QyxZQUFRLEtBQUssU0FBUyxNQUFBO0FBQUEsTUFDcEIsS0FBSyxVQUFVO0FBQ2IsZUFBTyxDQUFDO0FBQUEsTUFDVixLQUFLLFVBQVU7QUFDYixlQUFPLENBQUM7QUFBQSxNQUNWLEtBQUssVUFBVTtBQUNiLGVBQU8sQ0FBQztBQUFBLE1BQ1YsS0FBSyxVQUFVO0FBQUEsTUFDZixLQUFLLFVBQVUsWUFBWTtBQUN6QixjQUFNLFdBQ0osT0FBTyxLQUFLLEtBQUssS0FBSyxTQUFTLFNBQVMsVUFBVSxXQUFXLElBQUk7QUFDbkUsWUFBSSxLQUFLLGlCQUFpQmQsVUFBZTtBQUN2QyxlQUFLLE1BQU0sSUFBSSxLQUFLLE1BQU0sS0FBSyxRQUFRLFFBQVE7QUFBQSxRQUNqRCxXQUFXLEtBQUssaUJBQWlCRyxLQUFVO0FBQ3pDLGdCQUFNLFNBQVMsSUFBSUM7QUFBQUEsWUFDakIsS0FBSyxNQUFNO0FBQUEsWUFDWCxLQUFLLE1BQU07QUFBQSxZQUNYLElBQUlZLFFBQWEsVUFBVSxLQUFLLElBQUk7QUFBQSxZQUNwQyxLQUFLO0FBQUEsVUFBQTtBQUVQLGVBQUssU0FBUyxNQUFNO0FBQUEsUUFDdEIsT0FBTztBQUNMLGVBQUs7QUFBQSxZQUNILFdBQVc7QUFBQSxZQUNYLEVBQUUsT0FBTyxLQUFLLE1BQUE7QUFBQSxZQUNkLEtBQUs7QUFBQSxVQUFBO0FBQUEsUUFFVDtBQUNBLGVBQU87QUFBQSxNQUNUO0FBQUEsTUFDQTtBQUNFLGFBQUssTUFBTSxXQUFXLHdCQUF3QixFQUFFLFVBQVUsS0FBSyxTQUFBLEdBQVksS0FBSyxJQUFJO0FBQ3BGLGVBQU87QUFBQSxJQUFBO0FBQUEsRUFFYjtBQUFBLEVBRU8sY0FBYyxNQUFzQjtBQUV6QyxVQUFNLFNBQVMsS0FBSyxTQUFTLEtBQUssTUFBTTtBQUN4QyxRQUFJLFVBQVUsUUFBUSxLQUFLLFNBQVUsUUFBTztBQUM1QyxRQUFJLE9BQU8sV0FBVyxZQUFZO0FBQ2hDLFdBQUssTUFBTSxXQUFXLGdCQUFnQixFQUFFLE9BQUEsR0FBa0IsS0FBSyxJQUFJO0FBQUEsSUFDckU7QUFFQSxVQUFNLE9BQU8sQ0FBQTtBQUNiLGVBQVcsWUFBWSxLQUFLLE1BQU07QUFDaEMsVUFBSSxvQkFBb0JGLFFBQWE7QUFDbkMsYUFBSyxLQUFLLEdBQUcsS0FBSyxTQUFVLFNBQXlCLEtBQUssQ0FBQztBQUFBLE1BQzdELE9BQU87QUFDTCxhQUFLLEtBQUssS0FBSyxTQUFTLFFBQVEsQ0FBQztBQUFBLE1BQ25DO0FBQUEsSUFDRjtBQUVBLFFBQUksS0FBSyxrQkFBa0JYLEtBQVU7QUFDbkMsYUFBTyxPQUFPLE1BQU0sS0FBSyxPQUFPLE9BQU8sUUFBUSxJQUFJO0FBQUEsSUFDckQsT0FBTztBQUNMLGFBQU8sT0FBTyxHQUFHLElBQUk7QUFBQSxJQUN2QjtBQUFBLEVBQ0Y7QUFBQSxFQUVPLGFBQWEsTUFBcUI7QUFDdkMsVUFBTSxRQUFRLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFFdEMsUUFBSSxPQUFPLFVBQVUsWUFBWTtBQUMvQixXQUFLO0FBQUEsUUFDSCxXQUFXO0FBQUEsUUFDWCxFQUFFLE1BQUE7QUFBQSxRQUNGLEtBQUs7QUFBQSxNQUFBO0FBQUEsSUFFVDtBQUVBLFVBQU0sT0FBYyxDQUFBO0FBQ3BCLGVBQVcsT0FBTyxLQUFLLE1BQU07QUFDM0IsV0FBSyxLQUFLLEtBQUssU0FBUyxHQUFHLENBQUM7QUFBQSxJQUM5QjtBQUNBLFdBQU8sSUFBSSxNQUFNLEdBQUcsSUFBSTtBQUFBLEVBQzFCO0FBQUEsRUFFTyxvQkFBb0IsTUFBNEI7QUFDckQsVUFBTSxPQUFZLENBQUE7QUFDbEIsZUFBVyxZQUFZLEtBQUssWUFBWTtBQUN0QyxVQUFJLG9CQUFvQlcsUUFBYTtBQUNuQyxlQUFPLE9BQU8sTUFBTSxLQUFLLFNBQVUsU0FBeUIsS0FBSyxDQUFDO0FBQUEsTUFDcEUsT0FBTztBQUNMLGNBQU0sTUFBTSxLQUFLLFNBQVUsU0FBc0IsR0FBRztBQUNwRCxjQUFNLFFBQVEsS0FBSyxTQUFVLFNBQXNCLEtBQUs7QUFDeEQsYUFBSyxHQUFHLElBQUk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFTyxnQkFBZ0IsTUFBd0I7QUFDN0MsV0FBTyxPQUFPLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFBQSxFQUN4QztBQUFBLEVBRU8sY0FBYyxNQUFzQjtBQUN6QyxXQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUs7QUFBQSxNQUNWLEtBQUssTUFBTSxLQUFLLElBQUksU0FBUztBQUFBLE1BQzdCLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFBQSxJQUFBO0FBQUEsRUFFL0I7QUFBQSxFQUVBLGNBQWMsTUFBc0I7QUFDbEMsU0FBSyxTQUFTLEtBQUssS0FBSztBQUN4QixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsZUFBZSxNQUFzQjtBQUNuQyxVQUFNLFNBQVMsS0FBSyxTQUFTLEtBQUssS0FBSztBQUN2QyxZQUFRLElBQUksTUFBTTtBQUNsQixXQUFPO0FBQUEsRUFDVDtBQUNGO0FDaldPLE1BQWUsTUFBTTtBQUk1QjtBQVVPLE1BQU0sZ0JBQWdCLE1BQU07QUFBQSxFQU0vQixZQUFZLE1BQWMsWUFBcUIsVUFBbUIsTUFBZSxPQUFlLEdBQUc7QUFDL0YsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUNaLFNBQUssYUFBYTtBQUNsQixTQUFLLFdBQVc7QUFDaEIsU0FBSyxPQUFPO0FBQ1osU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVPLE9BQVUsU0FBMEIsUUFBa0I7QUFDekQsV0FBTyxRQUFRLGtCQUFrQixNQUFNLE1BQU07QUFBQSxFQUNqRDtBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDSjtBQUVPLE1BQU0sa0JBQWtCLE1BQU07QUFBQSxFQUlqQyxZQUFZLE1BQWMsT0FBZSxPQUFlLEdBQUc7QUFDdkQsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUNaLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFTyxPQUFVLFNBQTBCLFFBQWtCO0FBQ3pELFdBQU8sUUFBUSxvQkFBb0IsTUFBTSxNQUFNO0FBQUEsRUFDbkQ7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFFTyxNQUFNLGFBQWEsTUFBTTtBQUFBLEVBRzVCLFlBQVksT0FBZSxPQUFlLEdBQUc7QUFDekMsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFTyxPQUFVLFNBQTBCLFFBQWtCO0FBQ3pELFdBQU8sUUFBUSxlQUFlLE1BQU0sTUFBTTtBQUFBLEVBQzlDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNKO2dCQUVPLE1BQU1nQixpQkFBZ0IsTUFBTTtBQUFBLEVBRy9CLFlBQVksT0FBZSxPQUFlLEdBQUc7QUFDekMsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFTyxPQUFVLFNBQTBCLFFBQWtCO0FBQ3pELFdBQU8sUUFBUSxrQkFBa0IsTUFBTSxNQUFNO0FBQUEsRUFDakQ7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFFTyxNQUFNLGdCQUFnQixNQUFNO0FBQUEsRUFHL0IsWUFBWSxPQUFlLE9BQWUsR0FBRztBQUN6QyxVQUFBO0FBQ0EsU0FBSyxPQUFPO0FBQ1osU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVPLE9BQVUsU0FBMEIsUUFBa0I7QUFDekQsV0FBTyxRQUFRLGtCQUFrQixNQUFNLE1BQU07QUFBQSxFQUNqRDtBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDSjtBQy9HTyxNQUFNLGVBQWU7QUFBQSxFQU9uQixNQUFNLFFBQThCO0FBQ3pDLFNBQUssVUFBVTtBQUNmLFNBQUssT0FBTztBQUNaLFNBQUssTUFBTTtBQUNYLFNBQUssU0FBUztBQUNkLFNBQUssUUFBUSxDQUFBO0FBRWIsV0FBTyxDQUFDLEtBQUssT0FBTztBQUNsQixZQUFNLE9BQU8sS0FBSyxLQUFBO0FBQ2xCLFVBQUksU0FBUyxNQUFNO0FBQ2pCO0FBQUEsTUFDRjtBQUNBLFdBQUssTUFBTSxLQUFLLElBQUk7QUFBQSxJQUN0QjtBQUNBLFNBQUssU0FBUztBQUNkLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQUVRLFNBQVMsT0FBMEI7QUFDekMsZUFBVyxRQUFRLE9BQU87QUFDeEIsVUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3BCLGFBQUssV0FBVyxLQUFLO0FBQ3JCLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxRQUFRLFdBQW1CLElBQVU7QUFDM0MsUUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLFVBQUksS0FBSyxNQUFNLElBQUksR0FBRztBQUNwQixhQUFLLFFBQVE7QUFDYixhQUFLLE1BQU07QUFBQSxNQUNiO0FBQ0EsVUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLGFBQUs7QUFBQSxNQUNQLE9BQU87QUFDTCxhQUFLLE1BQU0sV0FBVyxnQkFBZ0IsRUFBRSxVQUFvQjtBQUFBLE1BQzlEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVRLFFBQVEsT0FBMEI7QUFDeEMsZUFBVyxRQUFRLE9BQU87QUFDeEIsVUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3BCLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxNQUFNLE1BQXVCO0FBQ25DLFdBQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxTQUFTLEtBQUssVUFBVSxLQUFLLE1BQU0sTUFBTTtBQUFBLEVBQ3pFO0FBQUEsRUFFUSxNQUFlO0FBQ3JCLFdBQU8sS0FBSyxVQUFVLEtBQUssT0FBTztBQUFBLEVBQ3BDO0FBQUEsRUFFUSxNQUFNLE1BQXNCLE9BQVksSUFBUztBQUN2RCxVQUFNLElBQUksWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLEtBQUssR0FBRztBQUFBLEVBQ3ZEO0FBQUEsRUFFUSxPQUFtQjtBQUN6QixTQUFLLFdBQUE7QUFDTCxRQUFJO0FBRUosUUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3BCLFdBQUssTUFBTSxXQUFXLHNCQUFzQjtBQUFBLElBQzlDO0FBRUEsUUFBSSxLQUFLLE1BQU0sTUFBTSxHQUFHO0FBQ3RCLGFBQU8sS0FBSyxRQUFBO0FBQUEsSUFDZCxXQUFXLEtBQUssTUFBTSxXQUFXLEtBQUssS0FBSyxNQUFNLFdBQVcsR0FBRztBQUM3RCxhQUFPLEtBQUssUUFBQTtBQUFBLElBQ2QsV0FBVyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQzFCLGFBQU8sS0FBSyxRQUFBO0FBQUEsSUFDZCxPQUFPO0FBQ0wsYUFBTyxLQUFLLEtBQUE7QUFBQSxJQUNkO0FBRUEsU0FBSyxXQUFBO0FBQ0wsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLFVBQXNCO0FBQzVCLFVBQU0sUUFBUSxLQUFLO0FBQ25CLE9BQUc7QUFDRCxXQUFLLFFBQVEsZ0NBQWdDO0FBQUEsSUFDL0MsU0FBUyxDQUFDLEtBQUssTUFBTSxLQUFLO0FBQzFCLFVBQU0sVUFBVSxLQUFLLE9BQU8sTUFBTSxPQUFPLEtBQUssVUFBVSxDQUFDO0FBQ3pELFdBQU8sSUFBSUMsVUFBYSxTQUFTLEtBQUssSUFBSTtBQUFBLEVBQzVDO0FBQUEsRUFFUSxVQUFzQjtBQUM1QixVQUFNLFFBQVEsS0FBSztBQUNuQixPQUFHO0FBQ0QsV0FBSyxRQUFRLDBCQUEwQjtBQUFBLElBQ3pDLFNBQVMsQ0FBQyxLQUFLLE1BQU0sR0FBRztBQUN4QixVQUFNLFVBQVUsS0FBSyxPQUFPLE1BQU0sT0FBTyxLQUFLLFVBQVUsQ0FBQyxFQUFFLEtBQUE7QUFDM0QsV0FBTyxJQUFJQyxRQUFhLFNBQVMsS0FBSyxJQUFJO0FBQUEsRUFDNUM7QUFBQSxFQUVRLFVBQXNCO0FBQzVCLFVBQU0sT0FBTyxLQUFLO0FBQ2xCLFVBQU0sT0FBTyxLQUFLLFdBQVcsS0FBSyxHQUFHO0FBQ3JDLFFBQUksQ0FBQyxNQUFNO0FBQ1QsV0FBSyxNQUFNLFdBQVcsaUJBQWlCO0FBQUEsSUFDekM7QUFFQSxVQUFNLGFBQWEsS0FBSyxXQUFBO0FBRXhCLFFBQ0UsS0FBSyxNQUFNLElBQUksS0FDZCxnQkFBZ0IsU0FBUyxJQUFJLEtBQUssS0FBSyxNQUFNLEdBQUcsR0FDakQ7QUFDQSxhQUFPLElBQUlDLFFBQWEsTUFBTSxZQUFZLENBQUEsR0FBSSxNQUFNLEtBQUssSUFBSTtBQUFBLElBQy9EO0FBRUEsUUFBSSxDQUFDLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDcEIsV0FBSyxNQUFNLFdBQVcsd0JBQXdCO0FBQUEsSUFDaEQ7QUFFQSxRQUFJLFdBQXlCLENBQUE7QUFDN0IsU0FBSyxXQUFBO0FBQ0wsUUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEdBQUc7QUFDcEIsaUJBQVcsS0FBSyxTQUFTLElBQUk7QUFBQSxJQUMvQjtBQUVBLFNBQUssTUFBTSxJQUFJO0FBQ2YsV0FBTyxJQUFJQSxRQUFhLE1BQU0sWUFBWSxVQUFVLE9BQU8sSUFBSTtBQUFBLEVBQ2pFO0FBQUEsRUFFUSxNQUFNLE1BQW9CO0FBQ2hDLFFBQUksQ0FBQyxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3JCLFdBQUssTUFBTSxXQUFXLHNCQUFzQixFQUFFLE1BQVk7QUFBQSxJQUM1RDtBQUNBLFFBQUksQ0FBQyxLQUFLLE1BQU0sR0FBRyxJQUFJLEVBQUUsR0FBRztBQUMxQixXQUFLLE1BQU0sV0FBVyxzQkFBc0IsRUFBRSxNQUFZO0FBQUEsSUFDNUQ7QUFDQSxTQUFLLFdBQUE7QUFDTCxRQUFJLENBQUMsS0FBSyxNQUFNLEdBQUcsR0FBRztBQUNwQixXQUFLLE1BQU0sV0FBVyxzQkFBc0IsRUFBRSxNQUFZO0FBQUEsSUFDNUQ7QUFBQSxFQUNGO0FBQUEsRUFFUSxTQUFTLFFBQThCO0FBQzdDLFVBQU0sV0FBeUIsQ0FBQTtBQUMvQixPQUFHO0FBQ0QsVUFBSSxLQUFLLE9BQU87QUFDZCxhQUFLLE1BQU0sV0FBVyxzQkFBc0IsRUFBRSxNQUFNLFFBQVE7QUFBQSxNQUM5RDtBQUNBLFlBQU0sT0FBTyxLQUFLLEtBQUE7QUFDbEIsVUFBSSxTQUFTLE1BQU07QUFDakI7QUFBQSxNQUNGO0FBQ0EsZUFBUyxLQUFLLElBQUk7QUFBQSxJQUNwQixTQUFTLENBQUMsS0FBSyxLQUFLLElBQUk7QUFFeEIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLGFBQStCO0FBQ3JDLFVBQU0sYUFBK0IsQ0FBQTtBQUNyQyxXQUFPLENBQUMsS0FBSyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxPQUFPO0FBQzNDLFdBQUssV0FBQTtBQUNMLFlBQU0sT0FBTyxLQUFLO0FBQ2xCLFlBQU0sT0FBTyxLQUFLLFdBQVcsS0FBSyxLQUFLLElBQUk7QUFDM0MsVUFBSSxDQUFDLE1BQU07QUFDVCxhQUFLLE1BQU0sV0FBVyxvQkFBb0I7QUFBQSxNQUM1QztBQUNBLFdBQUssV0FBQTtBQUNMLFVBQUksUUFBUTtBQUNaLFVBQUksS0FBSyxNQUFNLEdBQUcsR0FBRztBQUNuQixhQUFLLFdBQUE7QUFDTCxZQUFJLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDbkIsa0JBQVEsS0FBSyxlQUFlLEtBQUssT0FBTyxHQUFHLENBQUM7QUFBQSxRQUM5QyxXQUFXLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDMUIsa0JBQVEsS0FBSyxlQUFlLEtBQUssT0FBTyxHQUFHLENBQUM7QUFBQSxRQUM5QyxPQUFPO0FBQ0wsa0JBQVEsS0FBSyxlQUFlLEtBQUssV0FBVyxLQUFLLElBQUksQ0FBQztBQUFBLFFBQ3hEO0FBQUEsTUFDRjtBQUNBLFdBQUssV0FBQTtBQUNMLGlCQUFXLEtBQUssSUFBSUMsVUFBZSxNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQUEsSUFDdkQ7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsT0FBbUI7QUFDekIsVUFBTSxRQUFRLEtBQUs7QUFDbkIsVUFBTSxPQUFPLEtBQUs7QUFDbEIsUUFBSSxRQUFRO0FBQ1osV0FBTyxDQUFDLEtBQUssT0FBTztBQUNsQixVQUFJLEtBQUssTUFBTSxJQUFJLEdBQUc7QUFBRTtBQUFTO0FBQUEsTUFBVTtBQUMzQyxVQUFJLFFBQVEsS0FBSyxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQUU7QUFBUztBQUFBLE1BQVU7QUFDeEQsVUFBSSxVQUFVLEtBQUssS0FBSyxLQUFLLEdBQUcsR0FBRztBQUFFO0FBQUEsTUFBTztBQUM1QyxXQUFLLFFBQUE7QUFBQSxJQUNQO0FBQ0EsVUFBTSxNQUFNLEtBQUssT0FBTyxNQUFNLE9BQU8sS0FBSyxPQUFPLEVBQUUsS0FBQTtBQUNuRCxRQUFJLENBQUMsS0FBSztBQUNSLGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTyxJQUFJQyxLQUFVLEtBQUssZUFBZSxHQUFHLEdBQUcsSUFBSTtBQUFBLEVBQ3JEO0FBQUEsRUFFUSxlQUFlLE1BQXNCO0FBQzNDLFdBQU8sS0FDSixRQUFRLFdBQVcsR0FBUSxFQUMzQixRQUFRLFNBQVMsR0FBRyxFQUNwQixRQUFRLFNBQVMsR0FBRyxFQUNwQixRQUFRLFdBQVcsR0FBRyxFQUN0QixRQUFRLFdBQVcsR0FBRyxFQUN0QixRQUFRLFVBQVUsR0FBRztBQUFBLEVBQzFCO0FBQUEsRUFFUSxhQUFxQjtBQUMzQixRQUFJLFFBQVE7QUFDWixXQUFPLEtBQUssS0FBSyxHQUFHLFdBQVcsS0FBSyxDQUFDLEtBQUssT0FBTztBQUMvQyxlQUFTO0FBQ1QsV0FBSyxRQUFBO0FBQUEsSUFDUDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxjQUFjLFNBQTJCO0FBQy9DLFNBQUssV0FBQTtBQUNMLFVBQU0sUUFBUSxLQUFLO0FBQ25CLFdBQU8sQ0FBQyxLQUFLLEtBQUssR0FBRyxhQUFhLEdBQUcsT0FBTyxHQUFHO0FBQzdDLFdBQUssUUFBUSxvQkFBb0IsT0FBTyxFQUFFO0FBQUEsSUFDNUM7QUFDQSxVQUFNLE1BQU0sS0FBSztBQUNqQixTQUFLLFdBQUE7QUFDTCxXQUFPLEtBQUssT0FBTyxNQUFNLE9BQU8sR0FBRyxFQUFFLEtBQUE7QUFBQSxFQUN2QztBQUFBLEVBRVEsT0FBTyxTQUF5QjtBQUN0QyxVQUFNLFFBQVEsS0FBSztBQUNuQixXQUFPLENBQUMsS0FBSyxNQUFNLE9BQU8sR0FBRztBQUMzQixXQUFLLFFBQVEsb0JBQW9CLE9BQU8sRUFBRTtBQUFBLElBQzVDO0FBQ0EsV0FBTyxLQUFLLE9BQU8sTUFBTSxPQUFPLEtBQUssVUFBVSxDQUFDO0FBQUEsRUFDbEQ7QUFDRjtBQ3RQTyxTQUFTLFNBQVMsTUFBb0I7QUFDM0MsVUFBUSxVQUFVLE1BQU0sSUFBSSxJQUFJO0FBQ2hDLFNBQU8sY0FBYyxJQUFJLGNBQWMsVUFBVSxDQUFDO0FBQ3BEO0FBRU8sU0FBUyxVQUFVLFNBQWlCLFVBQWlEO0FBQzFGLE1BQUksWUFBWSxJQUFLLFFBQU8sQ0FBQTtBQUM1QixRQUFNLGVBQWUsUUFBUSxNQUFNLEdBQUcsRUFBRSxPQUFPLE9BQU87QUFDdEQsUUFBTSxZQUFZLFNBQVMsTUFBTSxHQUFHLEVBQUUsT0FBTyxPQUFPO0FBQ3BELE1BQUksYUFBYSxXQUFXLFVBQVUsT0FBUSxRQUFPO0FBQ3JELFFBQU0sU0FBaUMsQ0FBQTtBQUN2QyxXQUFTLElBQUksR0FBRyxJQUFJLGFBQWEsUUFBUSxLQUFLO0FBQzVDLFFBQUksYUFBYSxDQUFDLEVBQUUsV0FBVyxHQUFHLEdBQUc7QUFDbkMsYUFBTyxhQUFhLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQztBQUFBLElBQ2hELFdBQVcsYUFBYSxDQUFDLE1BQU0sVUFBVSxDQUFDLEdBQUc7QUFDM0MsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNUO0FBRU8sTUFBTSxlQUFlLFVBQVU7QUFBQSxFQUEvQixjQUFBO0FBQUEsVUFBQSxHQUFBLFNBQUE7QUFDTCxTQUFRLFNBQXdCLENBQUE7QUFBQSxFQUFDO0FBQUEsRUFFakMsVUFBVSxRQUE2QjtBQUNyQyxTQUFLLFNBQVM7QUFBQSxFQUNoQjtBQUFBLEVBRUEsVUFBZ0I7QUFDZCxXQUFPLGlCQUFpQixZQUFZLE1BQU0sS0FBSyxhQUFhO0FBQUEsTUFDMUQsUUFBUSxLQUFLLGlCQUFpQjtBQUFBLElBQUEsQ0FDL0I7QUFDRCxTQUFLLFVBQUE7QUFBQSxFQUNQO0FBQUEsRUFFQSxNQUFjLFlBQTJCO0FBQ3ZDLFVBQU0sV0FBVyxPQUFPLFNBQVM7QUFDakMsZUFBVyxTQUFTLEtBQUssUUFBUTtBQUMvQixZQUFNLFNBQVMsVUFBVSxNQUFNLE1BQU0sUUFBUTtBQUM3QyxVQUFJLFdBQVcsS0FBTTtBQUNyQixVQUFJLE1BQU0sT0FBTztBQUNmLGNBQU0sVUFBVSxNQUFNLE1BQU0sTUFBQTtBQUM1QixZQUFJLENBQUMsUUFBUztBQUFBLE1BQ2hCO0FBQ0EsV0FBSyxPQUFPLE1BQU0sV0FBVyxNQUFNO0FBQ25DO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVRLE9BQU9DLGlCQUFnQyxRQUFzQztBQUNuRixVQUFNLFVBQVUsS0FBSztBQUNyQixRQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssV0FBWTtBQUNsQyxTQUFLLFdBQVcsZUFBZUEsaUJBQWdCLFNBQVMsTUFBTTtBQUFBLEVBQ2hFO0FBQ0Y7QUM5RE8sTUFBTSxTQUFTO0FBQUEsRUFJcEIsWUFBWSxRQUFjLFFBQWdCLFlBQVk7QUFDcEQsU0FBSyxRQUFRLFNBQVMsY0FBYyxHQUFHLEtBQUssUUFBUTtBQUNwRCxTQUFLLE1BQU0sU0FBUyxjQUFjLEdBQUcsS0FBSyxNQUFNO0FBQ2hELFdBQU8sWUFBWSxLQUFLLEtBQUs7QUFDN0IsV0FBTyxZQUFZLEtBQUssR0FBRztBQUFBLEVBQzdCO0FBQUEsRUFFTyxRQUFjO0FiWGhCO0FhWUgsUUFBSSxVQUFVLEtBQUssTUFBTTtBQUN6QixXQUFPLFdBQVcsWUFBWSxLQUFLLEtBQUs7QUFDdEMsWUFBTSxXQUFXO0FBQ2pCLGdCQUFVLFFBQVE7QUFDbEIscUJBQVMsZUFBVCxtQkFBcUIsWUFBWTtBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUFBLEVBRU8sT0FBTyxNQUFrQjtBYnBCM0I7QWFxQkgsZUFBSyxJQUFJLGVBQVQsbUJBQXFCLGFBQWEsTUFBTSxLQUFLO0FBQUEsRUFDL0M7QUFBQSxFQUVPLFFBQWdCO0FBQ3JCLFVBQU0sU0FBaUIsQ0FBQTtBQUN2QixRQUFJLFVBQVUsS0FBSyxNQUFNO0FBQ3pCLFdBQU8sV0FBVyxZQUFZLEtBQUssS0FBSztBQUN0QyxhQUFPLEtBQUssT0FBTztBQUNuQixnQkFBVSxRQUFRO0FBQUEsSUFDcEI7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsSUFBVyxTQUFzQjtBQUMvQixXQUFPLEtBQUssTUFBTTtBQUFBLEVBQ3BCO0FBQ0Y7QUNqQ0EsTUFBTSw0QkFBWSxJQUFBO0FBQ2xCLE1BQU0sb0JBQTRCLENBQUE7QUFDbEMsSUFBSSxjQUFjO0FBQ2xCLElBQUksa0JBQWtCO0FBRXRCLFNBQVMsUUFBUTtBQUNmLGdCQUFjO0FBR2QsYUFBVyxDQUFDLFVBQVUsS0FBSyxLQUFLLE1BQU0sV0FBVztBQUMvQyxRQUFJO0FBRUYsVUFBSSxPQUFPLFNBQVMsY0FBYyxZQUFZO0FBQzVDLGlCQUFTLFVBQUE7QUFBQSxNQUNYO0FBR0EsaUJBQVcsUUFBUSxPQUFPO0FBQ3hCLGFBQUE7QUFBQSxNQUNGO0FBR0EsVUFBSSxPQUFPLFNBQVMsYUFBYSxZQUFZO0FBQzNDLGlCQUFTLFNBQUE7QUFBQSxNQUNYO0FBQUEsSUFDRixTQUFTLEdBQUc7QUFDVixjQUFRLE1BQU0sMkNBQTJDLENBQUM7QUFBQSxJQUM1RDtBQUFBLEVBQ0Y7QUFDQSxRQUFNLE1BQUE7QUFHTixRQUFNLFlBQVksa0JBQWtCLE9BQU8sQ0FBQztBQUM1QyxhQUFXLE1BQU0sV0FBVztBQUMxQixRQUFJO0FBQ0YsU0FBQTtBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1YsY0FBUSxNQUFNLHdDQUF3QyxDQUFDO0FBQUEsSUFDekQ7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxTQUFTLFlBQVksVUFBcUIsTUFBWTtBQUMzRCxNQUFJLENBQUMsaUJBQWlCO0FBQ3BCLFNBQUE7QUFHQTtBQUFBLEVBQ0Y7QUFFQSxNQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsR0FBRztBQUN4QixVQUFNLElBQUksVUFBVSxFQUFFO0FBQUEsRUFDeEI7QUFDQSxRQUFNLElBQUksUUFBUSxFQUFHLEtBQUssSUFBSTtBQUU5QixNQUFJLENBQUMsYUFBYTtBQUNoQixrQkFBYztBQUNkLG1CQUFlLEtBQUs7QUFBQSxFQUN0QjtBQUNGO0FBTU8sU0FBUyxVQUFVLElBQWdCO0FBQ3hDLFFBQU0sT0FBTztBQUNiLG9CQUFrQjtBQUNsQixNQUFJO0FBQ0YsT0FBQTtBQUFBLEVBQ0YsVUFBQTtBQUNFLHNCQUFrQjtBQUFBLEVBQ3BCO0FBQ0Y7QUFPTyxTQUFTLFNBQVMsSUFBaUM7QUFDeEQsTUFBSSxJQUFJO0FBQ04sc0JBQWtCLEtBQUssRUFBRTtBQUN6QixRQUFJLENBQUMsYUFBYTtBQUNoQixvQkFBYztBQUNkLHFCQUFlLEtBQUs7QUFBQSxJQUN0QjtBQUNBO0FBQUEsRUFDRjtBQUVBLFNBQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtBQUM5QixzQkFBa0IsS0FBSyxPQUFPO0FBQzlCLFFBQUksQ0FBQyxhQUFhO0FBQ2hCLG9CQUFjO0FBQ2QscUJBQWUsS0FBSztBQUFBLElBQ3RCO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUN0Rk8sTUFBTSxXQUErQztBQUFBLEVBUTFELFlBQVksU0FBMkM7QUFQdkQsU0FBUSxVQUFVLElBQUksUUFBQTtBQUN0QixTQUFRLFNBQVMsSUFBSSxpQkFBQTtBQUNyQixTQUFRLGNBQWMsSUFBSSxZQUFBO0FBQzFCLFNBQVEsV0FBOEIsQ0FBQTtBQUN0QyxTQUFPLE9BQXFDO0FBQzVDLFNBQVEsY0FBYztBQUdwQixTQUFLLFNBQVMsUUFBUSxJQUFJLEVBQUUsV0FBVyxRQUFRLE9BQU8sR0FBQztBQUN2RCxRQUFJLENBQUMsUUFBUztBQUNkLFFBQUksUUFBUSxVQUFVO0FBQ3BCLFdBQUssV0FBVyxFQUFFLEdBQUcsS0FBSyxVQUFVLEdBQUcsUUFBUSxTQUFBO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQUEsRUFFUSxTQUFTLE1BQW1CLFFBQXFCO0FBQ3ZELFFBQUksS0FBSyxTQUFTLFdBQVc7QUFDM0IsWUFBTSxLQUFLO0FBQ1gsWUFBTSxZQUFZLEtBQUssU0FBUyxJQUFJLENBQUMsV0FBVyxPQUFPLENBQUM7QUFDeEQsVUFBSSxXQUFXO0FBRWIsY0FBTSxPQUFPLFVBQVUsS0FBSyxXQUFXLEdBQUcsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksVUFBVTtBQUNsRixhQUFLLE1BQU0sV0FBVyx1QkFBdUIsRUFBRSxLQUFBLEdBQWMsR0FBRyxJQUFJO0FBQUEsTUFDdEU7QUFBQSxJQUNGO0FBQ0EsU0FBSyxPQUFPLE1BQU0sTUFBTTtBQUFBLEVBQzFCO0FBQUEsRUFFUSxZQUFZLFFBQW1CO0FmNUNsQztBZTZDSCxRQUFJLENBQUMsVUFBVSxPQUFPLFdBQVcsU0FBVTtBQUUzQyxRQUFJLFFBQVEsT0FBTyxlQUFlLE1BQU07QUFDeEMsV0FBTyxTQUFTLFVBQVUsT0FBTyxXQUFXO0FBQzFDLGlCQUFXLE9BQU8sT0FBTyxvQkFBb0IsS0FBSyxHQUFHO0FBQ25ELGFBQUksWUFBTyx5QkFBeUIsT0FBTyxHQUFHLE1BQTFDLG1CQUE2QyxJQUFLO0FBQ3RELFlBQ0UsT0FBTyxPQUFPLEdBQUcsTUFBTSxjQUN2QixRQUFRLGlCQUNSLENBQUMsT0FBTyxVQUFVLGVBQWUsS0FBSyxRQUFRLEdBQUcsR0FDakQ7QUFDQSxpQkFBTyxHQUFHLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSyxNQUFNO0FBQUEsUUFDdkM7QUFBQSxNQUNGO0FBQ0EsY0FBUSxPQUFPLGVBQWUsS0FBSztBQUFBLElBQ3JDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQSxFQUlRLGFBQWEsSUFBNEI7QUFDL0MsVUFBTSxRQUFRLEtBQUssWUFBWTtBQUMvQixXQUFPLE9BQU8sTUFBTTtBQUNsQixZQUFNLE9BQU8sS0FBSyxZQUFZO0FBQzlCLFdBQUssWUFBWSxRQUFRO0FBQ3pCLFVBQUk7QUFDRixXQUFBO0FBQUEsTUFDRixVQUFBO0FBQ0UsYUFBSyxZQUFZLFFBQVE7QUFBQSxNQUMzQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBR1EsUUFBUSxRQUFnQixlQUE0QjtBQUMxRCxVQUFNLFNBQVMsS0FBSyxRQUFRLEtBQUssTUFBTTtBQUN2QyxVQUFNLGNBQWMsS0FBSyxPQUFPLE1BQU0sTUFBTTtBQUU1QyxVQUFNLGVBQWUsS0FBSyxZQUFZO0FBQ3RDLFFBQUksZUFBZTtBQUNqQixXQUFLLFlBQVksUUFBUTtBQUFBLElBQzNCO0FBQ0EsVUFBTSxTQUFTLFlBQVk7QUFBQSxNQUFJLENBQUMsZUFDOUIsS0FBSyxZQUFZLFNBQVMsVUFBVTtBQUFBLElBQUE7QUFFdEMsU0FBSyxZQUFZLFFBQVE7QUFDekIsV0FBTyxVQUFVLE9BQU8sU0FBUyxPQUFPLE9BQU8sU0FBUyxDQUFDLElBQUk7QUFBQSxFQUMvRDtBQUFBLEVBRU8sVUFDTCxPQUNBLFFBQ0EsV0FDTTtBQUNOLFNBQUssY0FBYztBQUNuQixRQUFJO0FBQ0YsV0FBSyxRQUFRLFNBQVM7QUFDdEIsZ0JBQVUsWUFBWTtBQUN0QixXQUFLLFlBQVksTUFBTTtBQUN2QixXQUFLLFlBQVksTUFBTSxLQUFLLE1BQU07QUFDbEMsV0FBSyxZQUFZLE1BQU0sSUFBSSxhQUFhLE1BQU07QUFFOUMsZ0JBQVUsTUFBTTtBQUNkLGFBQUssZUFBZSxPQUFPLFNBQVM7QUFDcEMsYUFBSyxjQUFBO0FBQUEsTUFDUCxDQUFDO0FBRUQsYUFBTztBQUFBLElBQ1QsVUFBQTtBQUNFLFdBQUssY0FBYztBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBRU8sa0JBQWtCLE1BQXFCLFFBQXFCO0FBQ2pFLFNBQUssY0FBYyxNQUFNLE1BQU07QUFBQSxFQUNqQztBQUFBLEVBRU8sZUFBZSxNQUFrQixRQUFxQjtBQUMzRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLFNBQVMsZUFBZSxFQUFFO0FBQ3ZDLFVBQUksUUFBUTtBQUNWLFlBQUssT0FBZSxVQUFVLE9BQVEsT0FBZSxXQUFXLFlBQVk7QUFDekUsaUJBQWUsT0FBTyxJQUFJO0FBQUEsUUFDN0IsT0FBTztBQUNMLGlCQUFPLFlBQVksSUFBSTtBQUFBLFFBQ3pCO0FBQUEsTUFDRjtBQUVBLFlBQU0sT0FBTyxLQUFLLGFBQWEsTUFBTTtBQUNuQyxjQUFNLFdBQVcsS0FBSyx1QkFBdUIsS0FBSyxLQUFLO0FBQ3ZELGNBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFDdkQsWUFBSSxVQUFVO0FBQ1osc0JBQVksVUFBVSxNQUFNO0FBQzFCLGlCQUFLLGNBQWM7QUFBQSxVQUNyQixDQUFDO0FBQUEsUUFDSCxPQUFPO0FBQ0wsZUFBSyxjQUFjO0FBQUEsUUFDckI7QUFBQSxNQUNGLENBQUM7QUFDRCxXQUFLLFlBQVksTUFBTSxJQUFJO0FBQUEsSUFDN0IsU0FBUyxHQUFRO0FBQ2YsV0FBSyxNQUFNLFdBQVcsZUFBZSxFQUFFLFNBQVMsRUFBRSxXQUFXLEdBQUcsQ0FBQyxHQUFBLEdBQU0sV0FBVztBQUFBLElBQ3BGO0FBQUEsRUFDRjtBQUFBLEVBRU8sb0JBQW9CLE1BQXVCLFFBQXFCO0FBQ3JFLFVBQU0sT0FBTyxTQUFTLGdCQUFnQixLQUFLLElBQUk7QUFFL0MsVUFBTSxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQ25DLFdBQUssUUFBUSxLQUFLLHVCQUF1QixLQUFLLEtBQUs7QUFBQSxJQUNyRCxDQUFDO0FBQ0QsU0FBSyxZQUFZLE1BQU0sSUFBSTtBQUUzQixRQUFJLFFBQVE7QUFDVCxhQUF1QixpQkFBaUIsSUFBSTtBQUFBLElBQy9DO0FBQUEsRUFDRjtBQUFBLEVBRU8sa0JBQWtCLE1BQXFCLFFBQXFCO0FBQ2pFLFVBQU0sU0FBUyxJQUFJLFFBQVEsS0FBSyxLQUFLO0FBQ3JDLFFBQUksUUFBUTtBQUNWLFVBQUssT0FBZSxVQUFVLE9BQVEsT0FBZSxXQUFXLFlBQVk7QUFDekUsZUFBZSxPQUFPLE1BQU07QUFBQSxNQUMvQixPQUFPO0FBQ0wsZUFBTyxZQUFZLE1BQU07QUFBQSxNQUMzQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFUSxZQUFZLFFBQWEsTUFBVztBQUMxQyxRQUFJLENBQUMsT0FBTyxlQUFnQixRQUFPLGlCQUFpQixDQUFBO0FBQ3BELFdBQU8sZUFBZSxLQUFLLElBQUk7QUFBQSxFQUNqQztBQUFBLEVBRVEsU0FDTixNQUNBLE1BQ3dCO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxjQUFjLENBQUMsS0FBSyxXQUFXLFFBQVE7QUFDeEQsYUFBTztBQUFBLElBQ1Q7QUFFQSxVQUFNLFNBQVMsS0FBSyxXQUFXO0FBQUEsTUFBSyxDQUFDLFNBQ25DLEtBQUssU0FBVSxLQUF5QixJQUFJO0FBQUEsSUFBQTtBQUU5QyxRQUFJLFFBQVE7QUFDVixhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxLQUFLLGFBQTJCLFFBQW9CO0FBQzFELFVBQU0sV0FBVyxJQUFJLFNBQVMsUUFBUSxJQUFJO0FBRTFDLFVBQU0sTUFBTSxNQUFNO0FBQ2hCLFlBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFFdkQsWUFBTSxnQkFBZ0IsV0FBVyxJQUFJLE1BQU0sS0FBSyxZQUFZLEtBQUssSUFBSSxLQUFLLFlBQVk7QUFDdEYsWUFBTSxZQUFZLEtBQUssWUFBWTtBQUNuQyxXQUFLLFlBQVksUUFBUTtBQUd6QixZQUFNLFVBQXFCLENBQUE7QUFDM0IsY0FBUSxLQUFLLENBQUMsQ0FBQyxLQUFLLFFBQVMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFzQixLQUFLLENBQUM7QUFFekUsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHO0FBQ2YsbUJBQVcsY0FBYyxZQUFZLE1BQU0sQ0FBQyxHQUFHO0FBQzdDLGNBQUksS0FBSyxTQUFTLFdBQVcsQ0FBQyxHQUFvQixDQUFDLFNBQVMsQ0FBQyxHQUFHO0FBQzlELGtCQUFNLE1BQU0sQ0FBQyxDQUFDLEtBQUssUUFBUyxXQUFXLENBQUMsRUFBc0IsS0FBSztBQUNuRSxvQkFBUSxLQUFLLEdBQUc7QUFDaEIsZ0JBQUksSUFBSztBQUFBLFVBQ1gsV0FBVyxLQUFLLFNBQVMsV0FBVyxDQUFDLEdBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUc7QUFDbkUsb0JBQVEsS0FBSyxJQUFJO0FBQ2pCO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQ0EsV0FBSyxZQUFZLFFBQVE7QUFFekIsWUFBTSxPQUFPLE1BQU07QUFDakIsaUJBQVMsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUM7QUFDbkQsaUJBQVMsTUFBQTtBQUVULGNBQU0sZUFBZSxLQUFLLFlBQVk7QUFDdEMsYUFBSyxZQUFZLFFBQVE7QUFDekIsWUFBSTtBQUNGLGNBQUksUUFBUSxDQUFDLEdBQUc7QUFDZCx3QkFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sTUFBTSxRQUFlO0FBQzlDO0FBQUEsVUFDRjtBQUVBLG1CQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsUUFBUSxLQUFLO0FBQ3ZDLGdCQUFJLFFBQVEsQ0FBQyxHQUFHO0FBQ2QsMEJBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLE1BQU0sUUFBZTtBQUM5QztBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRixVQUFBO0FBQ0UsZUFBSyxZQUFZLFFBQVE7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFFQSxVQUFJLFVBQVU7QUFDWixvQkFBWSxVQUFVLElBQUk7QUFBQSxNQUM1QixPQUFPO0FBQ0wsYUFBQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUMsYUFBaUIsTUFBTSxpQkFBaUI7QUFFekMsVUFBTSxPQUFPLEtBQUssYUFBYSxHQUFHO0FBQ2xDLFNBQUssWUFBWSxVQUFVLElBQUk7QUFBQSxFQUNqQztBQUFBLEVBRVEsT0FBTyxNQUF1QixNQUFxQixRQUFjO0FBQ3ZFLFVBQU0sVUFBVSxLQUFLLFNBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM1QyxRQUFJLFNBQVM7QUFDWCxXQUFLLFlBQVksTUFBTSxNQUFNLFFBQVEsT0FBTztBQUFBLElBQzlDLE9BQU87QUFDTCxXQUFLLGNBQWMsTUFBTSxNQUFNLE1BQU07QUFBQSxJQUN2QztBQUFBLEVBQ0Y7QUFBQSxFQUVRLGNBQWMsTUFBdUIsTUFBcUIsUUFBYztBQUM5RSxVQUFNLFdBQVcsSUFBSSxTQUFTLFFBQVEsTUFBTTtBQUM1QyxVQUFNLGdCQUFnQixLQUFLLFlBQVk7QUFFdkMsVUFBTSxNQUFNLE1BQU07QUFDaEIsWUFBTSxTQUFTLEtBQUssUUFBUSxLQUFLLEtBQUssS0FBSztBQUMzQyxZQUFNLENBQUMsTUFBTSxLQUFLLFFBQVEsSUFBSSxLQUFLLFlBQVk7QUFBQSxRQUM3QyxLQUFLLE9BQU8sUUFBUSxNQUFNO0FBQUEsTUFBQTtBQUU1QixZQUFNLFdBQVcsS0FBSyxZQUFZLE1BQU0sSUFBSSxXQUFXO0FBRXZELFlBQU0sT0FBTyxNQUFNO0FBQ2pCLGlCQUFTLE1BQUEsRUFBUSxRQUFRLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDO0FBQ25ELGlCQUFTLE1BQUE7QUFFVCxZQUFJLFFBQVE7QUFDWixtQkFBVyxRQUFRLFVBQVU7QUFDM0IsZ0JBQU0sY0FBbUIsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFBO0FBQ25DLGNBQUksSUFBSyxhQUFZLEdBQUcsSUFBSTtBQUU1QixlQUFLLFlBQVksUUFBUSxJQUFJLE1BQU0sZUFBZSxXQUFXO0FBQzdELGVBQUssY0FBYyxNQUFNLFFBQWU7QUFDeEMsbUJBQVM7QUFBQSxRQUNYO0FBQ0EsYUFBSyxZQUFZLFFBQVE7QUFBQSxNQUMzQjtBQUVBLFVBQUksVUFBVTtBQUNaLG9CQUFZLFVBQVUsSUFBSTtBQUFBLE1BQzVCLE9BQU87QUFDTCxhQUFBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQyxhQUFpQixNQUFNLGlCQUFpQjtBQUV6QyxVQUFNLE9BQU8sS0FBSyxhQUFhLEdBQUc7QUFDbEMsU0FBSyxZQUFZLFVBQVUsSUFBSTtBQUFBLEVBQ2pDO0FBQUEsRUFFUSxlQUFlLE1BQWtCO0FmclRwQztBZXVUSCxRQUFLLEtBQWEsZ0JBQWdCO0FBQy9CLFdBQWEsZUFBQTtBQUFBLElBQ2hCO0FBR0EsUUFBSyxLQUFhLGdCQUFnQjtBQUMvQixXQUFhLGVBQWUsUUFBUSxDQUFDLFNBQWM7QUFDbEQsWUFBSSxPQUFPLEtBQUssUUFBUSxZQUFZO0FBQ2xDLGVBQUssSUFBQTtBQUFBLFFBQ1A7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBR0EsZUFBSyxlQUFMLG1CQUFpQixRQUFRLENBQUMsVUFBVSxLQUFLLGVBQWUsS0FBSztBQUFBLEVBQy9EO0FBQUEsRUFFUSxZQUFZLE1BQXVCLE1BQXFCLFFBQWMsU0FBMEI7QUFDdEcsVUFBTSxXQUFXLElBQUksU0FBUyxRQUFRLE1BQU07QUFDNUMsVUFBTSxnQkFBZ0IsS0FBSyxZQUFZO0FBQ3ZDLFVBQU0saUNBQWlCLElBQUE7QUFFdkIsVUFBTSxNQUFNLE1BQU07QUFDaEIsWUFBTSxTQUFTLEtBQUssUUFBUSxLQUFLLEtBQUssS0FBSztBQUMzQyxZQUFNLENBQUMsTUFBTSxVQUFVLFFBQVEsSUFBSSxLQUFLLFlBQVk7QUFBQSxRQUNsRCxLQUFLLE9BQU8sUUFBUSxNQUFNO0FBQUEsTUFBQTtBQUU1QixZQUFNLFdBQVcsS0FBSyxZQUFZLE1BQU0sSUFBSSxXQUFXO0FBR3ZELFlBQU0sV0FBd0QsQ0FBQTtBQUM5RCxZQUFNLCtCQUFlLElBQUE7QUFDckIsVUFBSSxRQUFRO0FBQ1osaUJBQVcsUUFBUSxVQUFVO0FBQzNCLGNBQU0sY0FBbUIsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFBO0FBQ25DLFlBQUksU0FBVSxhQUFZLFFBQVEsSUFBSTtBQUN0QyxhQUFLLFlBQVksUUFBUSxJQUFJLE1BQU0sZUFBZSxXQUFXO0FBQzdELGNBQU0sTUFBTSxLQUFLLFFBQVEsUUFBUSxLQUFLO0FBRXRDLFlBQUksS0FBSyxTQUFTLGlCQUFpQixTQUFTLElBQUksR0FBRyxHQUFHO0FBQ3BELGtCQUFRLEtBQUssOENBQThDLEdBQUcsMERBQTBEO0FBQUEsUUFDMUg7QUFDQSxpQkFBUyxJQUFJLEdBQUc7QUFFaEIsaUJBQVMsS0FBSyxFQUFFLE1BQVksS0FBSyxPQUFPLEtBQVU7QUFDbEQ7QUFBQSxNQUNGO0FBRUEsWUFBTSxPQUFPLE1BQU07QWZ2V2xCO0FleVdDLGNBQU0sWUFBWSxJQUFJLElBQUksU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztBQUNwRCxtQkFBVyxDQUFDLEtBQUssT0FBTyxLQUFLLFlBQVk7QUFDdkMsY0FBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUc7QUFDdkIsaUJBQUssWUFBWSxPQUFPO0FBQ3hCLDBCQUFRLGVBQVIsbUJBQW9CLFlBQVk7QUFDaEMsdUJBQVcsT0FBTyxHQUFHO0FBQUEsVUFDdkI7QUFBQSxRQUNGO0FBR0EsbUJBQVcsRUFBRSxNQUFNLEtBQUssSUFBQSxLQUFTLFVBQVU7QUFDekMsZ0JBQU0sY0FBbUIsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFBO0FBQ25DLGNBQUksU0FBVSxhQUFZLFFBQVEsSUFBSTtBQUN0QyxlQUFLLFlBQVksUUFBUSxJQUFJLE1BQU0sZUFBZSxXQUFXO0FBRTdELGNBQUksV0FBVyxJQUFJLEdBQUcsR0FBRztBQUN2QixrQkFBTSxVQUFVLFdBQVcsSUFBSSxHQUFHO0FBQ2xDLHFCQUFTLE9BQU8sT0FBTztBQUd2QixrQkFBTSxZQUFhLFFBQWdCO0FBQ25DLGdCQUFJLFdBQVc7QUFDYix3QkFBVSxJQUFJLE1BQU0sSUFBSTtBQUN4QixrQkFBSSxTQUFVLFdBQVUsSUFBSSxVQUFVLEdBQUc7QUFHekMsbUJBQUssZUFBZSxPQUFPO0FBQUEsWUFDN0I7QUFBQSxVQUNGLE9BQU87QUFDTCxrQkFBTSxVQUFVLEtBQUssY0FBYyxNQUFNLFFBQWU7QUFDeEQsZ0JBQUksU0FBUztBQUNYLHlCQUFXLElBQUksS0FBSyxPQUFPO0FBRTFCLHNCQUFnQixlQUFlLEtBQUssWUFBWTtBQUFBLFlBQ25EO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFDQSxhQUFLLFlBQVksUUFBUTtBQUFBLE1BQzNCO0FBRUEsVUFBSSxVQUFVO0FBQ1osb0JBQVksVUFBVSxJQUFJO0FBQUEsTUFDNUIsT0FBTztBQUNMLGFBQUE7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVDLGFBQWlCLE1BQU0saUJBQWlCO0FBRXpDLFVBQU0sT0FBTyxLQUFLLGFBQWEsR0FBRztBQUNsQyxTQUFLLFlBQVksVUFBVSxJQUFJO0FBQUEsRUFDakM7QUFBQSxFQUdRLFFBQVEsUUFBeUIsTUFBcUIsUUFBYztBQUMxRSxVQUFNLFdBQVcsSUFBSSxTQUFTLFFBQVEsT0FBTztBQUM3QyxVQUFNLGdCQUFnQixLQUFLLFlBQVk7QUFFdkMsVUFBTSxNQUFNLE1BQU07QUFDaEIsWUFBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUV2RCxVQUFJLFVBQVU7QUFFWixjQUFNLGdCQUFnQixJQUFJLE1BQU0sYUFBYTtBQUM3QyxjQUFNLFlBQVksS0FBSyxZQUFZO0FBQ25DLGFBQUssWUFBWSxRQUFRO0FBQ3pCLGNBQU0saUJBQWlCLENBQUMsQ0FBQyxLQUFLLFFBQVEsT0FBTyxLQUFLO0FBQ2xELGFBQUssWUFBWSxRQUFRO0FBRXpCLGNBQU0sT0FBTyxNQUFNO0FBQ2pCLG1CQUFTLE1BQUEsRUFBUSxRQUFRLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDO0FBQ25ELG1CQUFTLE1BQUE7QUFHVCxnQkFBTSxlQUFlLEtBQUssWUFBWTtBQUN0QyxlQUFLLFlBQVksUUFBUTtBQUN6QixjQUFJLG1CQUFtQjtBQUN2QixpQkFBTyxrQkFBa0I7QUFDdkIsaUJBQUssY0FBYyxNQUFNLFFBQWU7QUFDeEMsK0JBQW1CLENBQUMsQ0FBQyxLQUFLLFFBQVEsT0FBTyxLQUFLO0FBQUEsVUFDaEQ7QUFDQSxlQUFLLFlBQVksUUFBUTtBQUFBLFFBQzNCO0FBQ0Esb0JBQVksVUFBVSxJQUFJO0FBQUEsTUFDNUIsT0FBTztBQUNMLGlCQUFTLE1BQUEsRUFBUSxRQUFRLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDO0FBQ25ELGlCQUFTLE1BQUE7QUFDVCxhQUFLLFlBQVksUUFBUSxJQUFJLE1BQU0sYUFBYTtBQUNoRCxlQUFPLEtBQUssUUFBUSxPQUFPLEtBQUssR0FBRztBQUNqQyxlQUFLLGNBQWMsTUFBTSxRQUFlO0FBQUEsUUFDMUM7QUFDQSxhQUFLLFlBQVksUUFBUTtBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUVDLGFBQWlCLE1BQU0saUJBQWlCO0FBRXpDLFVBQU0sT0FBTyxLQUFLLGFBQWEsR0FBRztBQUNsQyxTQUFLLFlBQVksVUFBVSxJQUFJO0FBQUEsRUFDakM7QUFBQTtBQUFBLEVBR1EsTUFBTSxNQUF1QixNQUFxQixRQUFjO0FBQ3RFLFVBQU0sZUFBZSxLQUFLLFlBQVk7QUFDdEMsU0FBSyxZQUFZLFFBQVEsSUFBSSxNQUFNLFlBQVk7QUFFL0MsU0FBSyxRQUFRLEtBQUssS0FBSztBQUN2QixTQUFLLGNBQWMsTUFBTSxNQUFNO0FBRS9CLFNBQUssWUFBWSxRQUFRO0FBQUEsRUFDM0I7QUFBQSxFQUVRLGVBQWUsT0FBc0IsUUFBcUI7QUFDaEUsUUFBSSxVQUFVO0FBQ2QsV0FBTyxVQUFVLE1BQU0sUUFBUTtBQUM3QixZQUFNLE9BQU8sTUFBTSxTQUFTO0FBQzVCLFVBQUksS0FBSyxTQUFTLFdBQVc7QUFDM0IsY0FBTSxLQUFLO0FBR1gsY0FBTSxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sYUFBYSxLQUFLLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNoRCxjQUFNLFdBQVcsS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDNUMsWUFBSSxDQUFDLFFBQVEsWUFBWSxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsR0FBRztBQUM5RCxlQUFLLE1BQU0sV0FBVyxjQUFjLENBQUEsR0FBSSxHQUFHLElBQUk7QUFBQSxRQUNqRDtBQUVBLGNBQU0sUUFBUSxLQUFLLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN6QyxZQUFJLE9BQU87QUFDVCxlQUFLLE9BQU8sT0FBTyxNQUF1QixNQUFPO0FBQ2pEO0FBQUEsUUFDRjtBQUVBLGNBQU0sTUFBTSxLQUFLLFNBQVMsTUFBdUIsQ0FBQyxLQUFLLENBQUM7QUFDeEQsWUFBSSxLQUFLO0FBQ1AsZ0JBQU0sY0FBNEIsQ0FBQyxDQUFDLE1BQXVCLEdBQUcsQ0FBQztBQUUvRCxpQkFBTyxVQUFVLE1BQU0sUUFBUTtBQUM3QixrQkFBTSxPQUFPLEtBQUssU0FBUyxNQUFNLE9BQU8sR0FBb0I7QUFBQSxjQUMxRDtBQUFBLGNBQ0E7QUFBQSxZQUFBLENBQ0Q7QUFDRCxnQkFBSSxNQUFNO0FBQ1IsMEJBQVksS0FBSyxDQUFDLE1BQU0sT0FBTyxHQUFvQixJQUFJLENBQUM7QUFDeEQseUJBQVc7QUFBQSxZQUNiLE9BQU87QUFDTDtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBRUEsZUFBSyxLQUFLLGFBQWEsTUFBTztBQUM5QjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLFNBQVMsS0FBSyxTQUFTLE1BQXVCLENBQUMsUUFBUSxDQUFDO0FBQzlELFlBQUksUUFBUTtBQUNWLGVBQUssUUFBUSxRQUFRLE1BQXVCLE1BQU87QUFDbkQ7QUFBQSxRQUNGO0FBRUEsY0FBTSxPQUFPLEtBQUssU0FBUyxNQUF1QixDQUFDLE1BQU0sQ0FBQztBQUMxRCxZQUFJLE1BQU07QUFDUixlQUFLLE1BQU0sTUFBTSxNQUF1QixNQUFPO0FBQy9DO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFDQSxXQUFLLFNBQVMsTUFBTSxNQUFNO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBQUEsRUFFUSxjQUFjLE1BQXFCLFFBQWlDO0FmbmhCdkU7QWVvaEJILFFBQUk7QUFDRixVQUFJLEtBQUssU0FBUyxRQUFRO0FBQ3hCLGNBQU0sV0FBVyxLQUFLLFNBQVMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUM5QyxjQUFNLE9BQU8sV0FBVyxTQUFTLFFBQVE7QUFDekMsY0FBTSxRQUFRLEtBQUssWUFBWSxNQUFNLElBQUksUUFBUTtBQUNqRCxZQUFJLFNBQVMsTUFBTSxJQUFJLEdBQUc7QUFDeEIsZUFBSyxlQUFlLE1BQU0sSUFBSSxHQUFHLE1BQU07QUFBQSxRQUN6QztBQUNBLGVBQU87QUFBQSxNQUNUO0FBRUEsWUFBTSxTQUFTLEtBQUssU0FBUztBQUM3QixZQUFNLGNBQWMsQ0FBQyxDQUFDLEtBQUssU0FBUyxLQUFLLElBQUk7QUFFN0MsWUFBTSxVQUFVLFNBQVMsU0FBUyxTQUFTLGNBQWMsS0FBSyxJQUFJO0FBQ2xFLFlBQU0sZUFBZSxLQUFLLFlBQVk7QUFFdEMsVUFBSSxXQUFXLFlBQVksUUFBUTtBQUNqQyxhQUFLLFlBQVksTUFBTSxJQUFJLFFBQVEsT0FBTztBQUFBLE1BQzVDO0FBRUEsVUFBSSxhQUFhO0FBRWYsWUFBSSxZQUFpQixDQUFBO0FBQ3JCLGNBQU0sV0FBVyxLQUFLLFdBQVc7QUFBQSxVQUFPLENBQUMsU0FDdEMsS0FBeUIsS0FBSyxXQUFXLElBQUk7QUFBQSxRQUFBO0FBRWhELGNBQU0sT0FBTyxLQUFLLG9CQUFvQixRQUE2QjtBQUduRSxjQUFNLFFBQXVDLEVBQUUsU0FBUyxHQUFDO0FBQ3pELG1CQUFXLFNBQVMsS0FBSyxVQUFVO0FBQ2pDLGNBQUksTUFBTSxTQUFTLFdBQVc7QUFDNUIsa0JBQU0sV0FBVyxLQUFLLFNBQVMsT0FBd0IsQ0FBQyxPQUFPLENBQUM7QUFDaEUsZ0JBQUksVUFBVTtBQUNaLG9CQUFNLE9BQU8sU0FBUztBQUN0QixrQkFBSSxDQUFDLE1BQU0sSUFBSSxFQUFHLE9BQU0sSUFBSSxJQUFJLENBQUE7QUFDaEMsb0JBQU0sSUFBSSxFQUFFLEtBQUssS0FBSztBQUN0QjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQ0EsZ0JBQU0sUUFBUSxLQUFLLEtBQUs7QUFBQSxRQUMxQjtBQUVBLGFBQUksVUFBSyxTQUFTLEtBQUssSUFBSSxNQUF2QixtQkFBMEIsV0FBVztBQUN2QyxzQkFBWSxJQUFJLEtBQUssU0FBUyxLQUFLLElBQUksRUFBRSxVQUFVO0FBQUEsWUFDakQ7QUFBQSxZQUNBLEtBQUs7QUFBQSxZQUNMLFlBQVk7QUFBQSxVQUFBLENBQ2I7QUFFRCxlQUFLLFlBQVksU0FBUztBQUN6QixrQkFBZ0Isa0JBQWtCO0FBRW5DLGdCQUFNLGlCQUFpQixLQUFLLFNBQVMsS0FBSyxJQUFJLEVBQUU7QUFDaEQsb0JBQVUsVUFBVSxNQUFNO0FBQ3hCLGlCQUFLLGNBQWM7QUFDbkIsZ0JBQUk7QUFDRixtQkFBSyxRQUFRLE9BQXNCO0FBQ2xDLHNCQUF3QixZQUFZO0FBQ3JDLG9CQUFNLFFBQVEsSUFBSSxNQUFNLGNBQWMsU0FBUztBQUMvQyxvQkFBTSxJQUFJLGFBQWEsU0FBUztBQUNoQyx3QkFBVSxTQUFTO0FBQ25CLG9CQUFNLFlBQVksS0FBSyxZQUFZO0FBQ25DLG1CQUFLLFlBQVksUUFBUTtBQUV6Qix3QkFBVSxNQUFNO0FBQ2QscUJBQUssZUFBZSxnQkFBZ0IsT0FBTztBQUMzQyxvQkFBSSxPQUFPLFVBQVUsYUFBYSxzQkFBc0IsU0FBQTtBQUFBLGNBQzFELENBQUM7QUFFRCxtQkFBSyxZQUFZLFFBQVE7QUFBQSxZQUMzQixVQUFBO0FBQ0UsbUJBQUssY0FBYztBQUFBLFlBQ3JCO0FBQUEsVUFDRjtBQUVBLGNBQUksS0FBSyxTQUFTLFlBQVkscUJBQXFCLFFBQVE7QUFDekQsa0JBQU0sYUFBYSxJQUFJLE1BQU0sY0FBYyxTQUFTO0FBQ3BELHNCQUFVLFVBQVUsS0FBSyxjQUFjLEtBQUssVUFBVSxRQUFXLFVBQVUsQ0FBQztBQUFBLFVBQzlFO0FBRUEsY0FBSSxPQUFPLFVBQVUsWUFBWSxZQUFZO0FBQzNDLHNCQUFVLFFBQUE7QUFBQSxVQUNaO0FBQUEsUUFDRjtBQUVBLGtCQUFVLFNBQVM7QUFFbkIsYUFBSyxZQUFZLFFBQVEsSUFBSSxNQUFNLGNBQWMsU0FBUztBQUMxRCxhQUFLLFlBQVksTUFBTSxJQUFJLGFBQWEsU0FBUztBQUdqRCxrQkFBVSxNQUFNO0FBQ2QsZUFBSyxlQUFlLEtBQUssU0FBUyxLQUFLLElBQUksRUFBRSxPQUFRLE9BQU87QUFFNUQsY0FBSSxhQUFhLE9BQU8sVUFBVSxhQUFhLFlBQVk7QUFDekQsc0JBQVUsU0FBQTtBQUFBLFVBQ1o7QUFBQSxRQUNGLENBQUM7QUFFRCxhQUFLLFlBQVksUUFBUTtBQUN6QixZQUFJLFFBQVE7QUFDVixjQUFLLE9BQWUsVUFBVSxPQUFRLE9BQWUsV0FBVyxZQUFZO0FBQ3pFLG1CQUFlLE9BQU8sT0FBTztBQUFBLFVBQ2hDLE9BQU87QUFDTCxtQkFBTyxZQUFZLE9BQU87QUFBQSxVQUM1QjtBQUFBLFFBQ0Y7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUVBLFVBQUksQ0FBQyxRQUFRO0FBRVgsY0FBTSxTQUFTLEtBQUssV0FBVztBQUFBLFVBQU8sQ0FBQyxTQUNwQyxLQUF5QixLQUFLLFdBQVcsTUFBTTtBQUFBLFFBQUE7QUFHbEQsbUJBQVcsU0FBUyxRQUFRO0FBQzFCLGVBQUssb0JBQW9CLFNBQVMsS0FBd0I7QUFBQSxRQUM1RDtBQUdBLGNBQU0sYUFBYSxLQUFLLFdBQVc7QUFBQSxVQUNqQyxDQUFDLFNBQVMsQ0FBRSxLQUF5QixLQUFLLFdBQVcsR0FBRztBQUFBLFFBQUE7QUFHMUQsbUJBQVcsUUFBUSxZQUFZO0FBQzdCLGVBQUssU0FBUyxNQUFNLE9BQU87QUFBQSxRQUM3QjtBQUdBLGNBQU0sc0JBQXNCLEtBQUssV0FBVyxPQUFPLENBQUMsU0FBUztBQUMzRCxnQkFBTSxPQUFRLEtBQXlCO0FBQ3ZDLGlCQUNFLEtBQUssV0FBVyxHQUFHLEtBQ25CLENBQUMsQ0FBQyxPQUFPLFdBQVcsU0FBUyxTQUFTLFVBQVUsUUFBUSxRQUFRLE1BQU0sRUFBRTtBQUFBLFlBQ3RFO0FBQUEsVUFBQSxLQUVGLENBQUMsS0FBSyxXQUFXLE1BQU0sS0FDdkIsQ0FBQyxLQUFLLFdBQVcsSUFBSTtBQUFBLFFBRXpCLENBQUM7QUFFRCxtQkFBVyxRQUFRLHFCQUFxQjtBQUN0QyxnQkFBTSxXQUFZLEtBQXlCLEtBQUssTUFBTSxDQUFDO0FBRXZELGNBQUksYUFBYSxTQUFTO0FBQ3hCLGdCQUFJLG1CQUFtQjtBQUN2QixrQkFBTSxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQ25DLG9CQUFNLFFBQVEsS0FBSyxRQUFTLEtBQXlCLEtBQUs7QUFDMUQsb0JBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFDdkQsb0JBQU0sT0FBTyxNQUFNO0FBQ2pCLHNCQUFNLGNBQWUsUUFBd0IsYUFBYSxPQUFPLEtBQUs7QUFDdEUsc0JBQU0saUJBQWlCLFlBQVksTUFBTSxHQUFHLEVBQ3pDLE9BQU8sQ0FBQSxNQUFLLE1BQU0sb0JBQW9CLE1BQU0sRUFBRSxFQUM5QyxLQUFLLEdBQUc7QUFDWCxzQkFBTSxXQUFXLGlCQUFpQixHQUFHLGNBQWMsSUFBSSxLQUFLLEtBQUs7QUFDaEUsd0JBQXdCLGFBQWEsU0FBUyxRQUFRO0FBQ3ZELG1DQUFtQjtBQUFBLGNBQ3JCO0FBRUEsa0JBQUksVUFBVTtBQUNaLDRCQUFZLFVBQVUsSUFBSTtBQUFBLGNBQzVCLE9BQU87QUFDTCxxQkFBQTtBQUFBLGNBQ0Y7QUFBQSxZQUNGLENBQUM7QUFDRCxpQkFBSyxZQUFZLFNBQVMsSUFBSTtBQUFBLFVBQ2hDLE9BQU87QUFDTCxrQkFBTSxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQ25DLG9CQUFNLFFBQVEsS0FBSyxRQUFTLEtBQXlCLEtBQUs7QUFDMUQsb0JBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFDdkQsb0JBQU0sT0FBTyxNQUFNO0FBQ2pCLG9CQUFJLFVBQVUsU0FBUyxVQUFVLFFBQVEsVUFBVSxRQUFXO0FBQzVELHNCQUFJLGFBQWEsU0FBUztBQUN2Qiw0QkFBd0IsZ0JBQWdCLFFBQVE7QUFBQSxrQkFDbkQ7QUFBQSxnQkFDRixPQUFPO0FBQ0wsc0JBQUksYUFBYSxTQUFTO0FBQ3hCLDBCQUFNLFdBQVksUUFBd0IsYUFBYSxPQUFPO0FBQzlELDBCQUFNLFdBQVcsWUFBWSxDQUFDLFNBQVMsU0FBUyxLQUFLLElBQ2pELEdBQUcsU0FBUyxTQUFTLEdBQUcsSUFBSSxXQUFXLFdBQVcsR0FBRyxJQUFJLEtBQUssS0FDOUQ7QUFDSCw0QkFBd0IsYUFBYSxTQUFTLFFBQVE7QUFBQSxrQkFDekQsT0FBTztBQUNKLDRCQUF3QixhQUFhLFVBQVUsS0FBSztBQUFBLGtCQUN2RDtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUVBLGtCQUFJLFVBQVU7QUFDWiw0QkFBWSxVQUFVLElBQUk7QUFBQSxjQUM1QixPQUFPO0FBQ0wscUJBQUE7QUFBQSxjQUNGO0FBQUEsWUFDRixDQUFDO0FBQ0QsaUJBQUssWUFBWSxTQUFTLElBQUk7QUFBQSxVQUNoQztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBRUEsVUFBSSxVQUFVLENBQUMsUUFBUTtBQUNyQixZQUFLLE9BQWUsVUFBVSxPQUFRLE9BQWUsV0FBVyxZQUFZO0FBQ3pFLGlCQUFlLE9BQU8sT0FBTztBQUFBLFFBQ2hDLE9BQU87QUFDTCxpQkFBTyxZQUFZLE9BQU87QUFBQSxRQUM1QjtBQUFBLE1BQ0Y7QUFFQSxZQUFNLFVBQVUsS0FBSyxTQUFTLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDNUMsVUFBSSxXQUFXLENBQUMsUUFBUTtBQUN0QixjQUFNLFdBQVcsUUFBUSxNQUFNLEtBQUE7QUFDL0IsY0FBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUN2RCxZQUFJLFVBQVU7QUFDWixtQkFBUyxRQUFRLElBQUk7QUFBQSxRQUN2QixPQUFPO0FBQ0wsZUFBSyxZQUFZLE1BQU0sSUFBSSxVQUFVLE9BQU87QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFFQSxVQUFJLEtBQUssTUFBTTtBQUNiLGVBQU87QUFBQSxNQUNUO0FBRUEsV0FBSyxlQUFlLEtBQUssVUFBVSxPQUFPO0FBQzFDLFdBQUssWUFBWSxRQUFRO0FBRXpCLGFBQU87QUFBQSxJQUNULFNBQVMsR0FBUTtBQUNmLFdBQUssTUFBTSxXQUFXLGVBQWUsRUFBRSxTQUFTLEVBQUUsV0FBVyxHQUFHLENBQUMsR0FBQSxHQUFNLEtBQUssSUFBSTtBQUFBLElBQ2xGO0FBQUEsRUFDRjtBQUFBLEVBRVEsb0JBQW9CLE1BQThDO0FBQ3hFLFFBQUksQ0FBQyxLQUFLLFFBQVE7QUFDaEIsYUFBTyxDQUFBO0FBQUEsSUFDVDtBQUNBLFVBQU0sU0FBOEIsQ0FBQTtBQUNwQyxlQUFXLE9BQU8sTUFBTTtBQUN0QixZQUFNLE1BQU0sSUFBSSxLQUFLLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakMsYUFBTyxHQUFHLElBQUksS0FBSyxRQUFRLElBQUksS0FBSztBQUFBLElBQ3RDO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLG9CQUFvQixTQUFlLE1BQTZCO0FBQ3RFLFVBQU0sQ0FBQyxXQUFXLEdBQUcsU0FBUyxJQUFJLEtBQUssS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHO0FBQ25FLFVBQU0sZ0JBQWdCLElBQUksTUFBTSxLQUFLLFlBQVksS0FBSztBQUN0RCxVQUFNLFdBQVcsS0FBSyxZQUFZLE1BQU0sSUFBSSxXQUFXO0FBRXZELFVBQU0sVUFBZSxDQUFBO0FBQ3JCLFFBQUksWUFBWSxTQUFTLGtCQUFrQjtBQUN6QyxjQUFRLFNBQVMsU0FBUyxpQkFBaUI7QUFBQSxJQUM3QztBQUNBLFFBQUksVUFBVSxTQUFTLE1BQU0sV0FBYyxPQUFVO0FBQ3JELFFBQUksVUFBVSxTQUFTLFNBQVMsV0FBVyxVQUFVO0FBQ3JELFFBQUksVUFBVSxTQUFTLFNBQVMsV0FBVyxVQUFVO0FBRXJELFlBQVEsaUJBQWlCLFdBQVcsQ0FBQyxVQUFVO0FBQzdDLFVBQUksVUFBVSxTQUFTLFNBQVMsU0FBUyxlQUFBO0FBQ3pDLFVBQUksVUFBVSxTQUFTLE1BQU0sU0FBWSxnQkFBQTtBQUN6QyxvQkFBYyxJQUFJLFVBQVUsS0FBSztBQUNqQyxXQUFLLFFBQVEsS0FBSyxPQUFPLGFBQWE7QUFBQSxJQUN4QyxHQUFHLE9BQU87QUFBQSxFQUNaO0FBQUEsRUFFUSx1QkFBdUIsTUFBc0I7QUFDbkQsUUFBSSxDQUFDLE1BQU07QUFDVCxhQUFPO0FBQUEsSUFDVDtBQUNBLFVBQU0sUUFBUTtBQUNkLFFBQUksTUFBTSxLQUFLLElBQUksR0FBRztBQUNwQixhQUFPLEtBQUssUUFBUSx1QkFBdUIsQ0FBQyxHQUFHLGdCQUFnQjtBQUM3RCxlQUFPLEtBQUssbUJBQW1CLFdBQVc7QUFBQSxNQUM1QyxDQUFDO0FBQUEsSUFDSDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxtQkFBbUIsUUFBd0I7QUFDakQsVUFBTSxTQUFTLEtBQUssUUFBUSxLQUFLLE1BQU07QUFDdkMsVUFBTSxjQUFjLEtBQUssT0FBTyxNQUFNLE1BQU07QUFFNUMsUUFBSSxTQUFTO0FBQ2IsZUFBVyxjQUFjLGFBQWE7QUFDcEMsZ0JBQVUsR0FBRyxLQUFLLFlBQVksU0FBUyxVQUFVLENBQUM7QUFBQSxJQUNwRDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxZQUFZLE1BQWlCO0FmdnpCaEM7QWV5ekJILFFBQUksS0FBSyxpQkFBaUI7QUFDeEIsWUFBTSxXQUFXLEtBQUs7QUFDdEIsVUFBSSxTQUFTLFdBQVc7QUFDdEIsaUJBQVMsVUFBQTtBQUFBLE1BQ1g7QUFDQSxVQUFJLFNBQVMsaUJBQWtCLFVBQVMsaUJBQWlCLE1BQUE7QUFBQSxJQUMzRDtBQUdBLFFBQUksS0FBSyxnQkFBZ0I7QUFDdkIsV0FBSyxlQUFlLFFBQVEsQ0FBQyxTQUFxQixNQUFNO0FBQ3hELFdBQUssaUJBQWlCLENBQUE7QUFBQSxJQUN4QjtBQUdBLFFBQUksS0FBSyxZQUFZO0FBQ25CLGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxXQUFXLFFBQVEsS0FBSztBQUMvQyxjQUFNLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDOUIsWUFBSSxLQUFLLGdCQUFnQjtBQUN2QixlQUFLLGVBQWUsUUFBUSxDQUFDLFNBQXFCLE1BQU07QUFDeEQsZUFBSyxpQkFBaUIsQ0FBQTtBQUFBLFFBQ3hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFHQSxlQUFLLGVBQUwsbUJBQWlCLFFBQVEsQ0FBQyxVQUFlLEtBQUssWUFBWSxLQUFLO0FBQUEsRUFDakU7QUFBQSxFQUVPLFFBQVEsV0FBMEI7QUFDdkMsY0FBVSxXQUFXLFFBQVEsQ0FBQyxVQUFVLEtBQUssWUFBWSxLQUFLLENBQUM7QUFBQSxFQUNqRTtBQUFBLEVBRU8sZUFBZUEsaUJBQWdDLFdBQXdCLFNBQWlDLENBQUEsR0FBVTtBQUN2SCxTQUFLLFFBQVEsU0FBUztBQUN0QixjQUFVLFlBQVk7QUFFdEIsVUFBTSxXQUFZQSxnQkFBdUI7QUFDekMsUUFBSSxDQUFDLFNBQVU7QUFFZixVQUFNLFFBQVEsSUFBSSxpQkFBaUIsTUFBTSxRQUFRO0FBQ2pELFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxjQUFVLFlBQVksSUFBSTtBQUUxQixVQUFNLFlBQVksSUFBSUEsZ0JBQWUsRUFBRSxNQUFNLEVBQUUsT0FBQSxHQUFrQixLQUFLLE1BQU0sWUFBWSxLQUFBLENBQU07QUFDOUYsU0FBSyxZQUFZLFNBQVM7QUFDekIsU0FBYSxrQkFBa0I7QUFFaEMsVUFBTSxpQkFBaUI7QUFDdkIsY0FBVSxVQUFVLE1BQU07QUFDeEIsV0FBSyxjQUFjO0FBQ25CLFVBQUk7QUFDRixhQUFLLFFBQVEsSUFBSTtBQUNqQixhQUFLLFlBQVk7QUFDakIsY0FBTUMsU0FBUSxJQUFJLE1BQU0sTUFBTSxTQUFTO0FBQ3ZDQSxlQUFNLElBQUksYUFBYSxTQUFTO0FBQ2hDLGNBQU1DLFFBQU8sS0FBSyxZQUFZO0FBQzlCLGFBQUssWUFBWSxRQUFRRDtBQUV6QixrQkFBVSxNQUFNO0FBQ2QsZUFBSyxlQUFlLGdCQUFnQixJQUFJO0FBQ3hDLGNBQUksT0FBTyxVQUFVLGFBQWEsc0JBQXNCLFNBQUE7QUFBQSxRQUMxRCxDQUFDO0FBRUQsYUFBSyxZQUFZLFFBQVFDO0FBQUFBLE1BQzNCLFVBQUE7QUFDRSxhQUFLLGNBQWM7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFFQSxRQUFJLE9BQU8sVUFBVSxZQUFZLHNCQUFzQixRQUFBO0FBRXZELFVBQU0sUUFBUSxJQUFJLE1BQU0sTUFBTSxTQUFTO0FBQ3ZDLFVBQU0sSUFBSSxhQUFhLFNBQVM7QUFDaEMsVUFBTSxPQUFPLEtBQUssWUFBWTtBQUM5QixTQUFLLFlBQVksUUFBUTtBQUV6QixjQUFVLE1BQU07QUFDZCxXQUFLLGVBQWUsT0FBTyxJQUFJO0FBQy9CLFVBQUksT0FBTyxVQUFVLGFBQWEsc0JBQXNCLFNBQUE7QUFBQSxJQUMxRCxDQUFDO0FBRUQsU0FBSyxZQUFZLFFBQVE7QUFFekIsUUFBSSxPQUFPLFVBQVUsYUFBYSxzQkFBc0IsU0FBQTtBQUFBLEVBQzFEO0FBQUEsRUFFTyxjQUFjLFVBQXlCLGFBQXNDLE9BQThCO0FBQ2hILFVBQU0sU0FBd0IsQ0FBQTtBQUM5QixVQUFNLFlBQVksUUFBUSxLQUFLLFlBQVksUUFBUTtBQUNuRCxRQUFJLE1BQU8sTUFBSyxZQUFZLFFBQVE7QUFDcEMsZUFBVyxTQUFTLFVBQVU7QUFDNUIsVUFBSSxNQUFNLFNBQVMsVUFBVztBQUM5QixZQUFNLEtBQUs7QUFDWCxVQUFJLEdBQUcsU0FBUyxTQUFTO0FBQ3ZCLGNBQU0sV0FBVyxLQUFLLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM1QyxjQUFNLGdCQUFnQixLQUFLLFNBQVMsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUN0RCxjQUFNLFlBQVksS0FBSyxTQUFTLElBQUksQ0FBQyxRQUFRLENBQUM7QUFFOUMsWUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlO0FBQy9CLGVBQUssTUFBTSxXQUFXLHVCQUF1QixFQUFFLFNBQVMsb0RBQUEsR0FBdUQsR0FBRyxJQUFJO0FBQUEsUUFDeEg7QUFFQSxjQUFNLE9BQU8sU0FBVTtBQUN2QixjQUFNLFlBQVksS0FBSyxRQUFRLGNBQWUsS0FBSztBQUNuRCxjQUFNLFFBQVEsWUFBWSxLQUFLLFFBQVEsVUFBVSxLQUFLLElBQUk7QUFDMUQsZUFBTyxLQUFLLEVBQUUsTUFBWSxXQUFzQixPQUFjO0FBQUEsTUFDaEUsV0FBVyxHQUFHLFNBQVMsU0FBUztBQUM5QixjQUFNLFlBQVksS0FBSyxTQUFTLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDOUMsWUFBSSxDQUFDLFdBQVc7QUFDZCxlQUFLLE1BQU0sV0FBVyx1QkFBdUIsRUFBRSxTQUFTLHFDQUFBLEdBQXdDLEdBQUcsSUFBSTtBQUFBLFFBQ3pHO0FBRUEsWUFBSSxDQUFDLFVBQVc7QUFDaEIsY0FBTSxRQUFRLEtBQUssUUFBUSxVQUFVLEtBQUs7QUFDMUMsZUFBTyxLQUFLLEdBQUcsS0FBSyxjQUFjLEdBQUcsVUFBVSxLQUFLLENBQUM7QUFBQSxNQUN2RDtBQUFBLElBQ0Y7QUFDQSxRQUFJLE1BQU8sTUFBSyxZQUFZLFFBQVE7QUFDcEMsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLGdCQUFzQjtBQUM1QixRQUFJLEtBQUssWUFBYTtBQUN0QixVQUFNLFdBQVcsS0FBSyxZQUFZLE1BQU0sSUFBSSxXQUFXO0FBQ3ZELFFBQUksWUFBWSxPQUFPLFNBQVMsYUFBYSxZQUFZO0FBQ3ZELGVBQVMsU0FBQTtBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFFTyxrQkFBa0IsT0FBNEI7QUFDbkQ7QUFBQSxFQUVGO0FBQUEsRUFFTyxNQUFNLE1BQXNCLE1BQVcsU0FBd0I7QUFDcEUsUUFBSSxZQUFZO0FBQ2hCLFFBQUksT0FBTyxTQUFTLFVBQVU7QUFDNUIsWUFBTSxlQUFlLEtBQUssU0FBUyxlQUFlLElBQzlDLEtBQUssUUFBUSxtQkFBbUIsRUFBRSxJQUNsQztBQUNKLGtCQUFZLEVBQUUsU0FBUyxhQUFBO0FBQUEsSUFDekI7QUFFQSxVQUFNLElBQUksWUFBWSxNQUFNLFdBQVcsUUFBVyxRQUFXLE9BQU87QUFBQSxFQUN0RTtBQUVGO0FDdjhCTyxTQUFTLFFBQVEsUUFBd0I7QUFDOUMsUUFBTSxTQUFTLElBQUksZUFBQTtBQUNuQixNQUFJO0FBQ0YsVUFBTSxRQUFRLE9BQU8sTUFBTSxNQUFNO0FBQ2pDLFdBQU8sS0FBSyxVQUFVLEtBQUs7QUFBQSxFQUM3QixTQUFTLEdBQUc7QUFDVixXQUFPLEtBQUssVUFBVSxDQUFDLGFBQWEsUUFBUSxFQUFFLFVBQVUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUFBLEVBQ3BFO0FBQ0Y7QUFFTyxTQUFTLFVBQ2QsUUFDQSxRQUNBLFdBQ0EsVUFDTTtBQUNOLFFBQU0sU0FBUyxJQUFJLGVBQUE7QUFDbkIsUUFBTSxRQUFRLE9BQU8sTUFBTSxNQUFNO0FBQ2pDLFFBQU0sYUFBYSxJQUFJLFdBQVcsRUFBRSxVQUFVLFlBQVksQ0FBQSxHQUFJO0FBQzlELFFBQU0sU0FBUyxXQUFXLFVBQVUsT0FBTyxVQUFVLENBQUEsR0FBSSxTQUFTO0FBQ2xFLFNBQU87QUFDVDtBQUdPLFNBQVMsT0FBTyxnQkFBcUI7QUFDMUMsWUFBVTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsVUFBVTtBQUFBLE1BQUE7QUFBQSxJQUNaO0FBQUEsRUFDRixDQUNEO0FBQ0g7QUFTQSxTQUFTLGdCQUNQLFlBQ0EsS0FDQSxVQUNBO0FBQ0EsUUFBTSxVQUFVLFNBQVMsY0FBYyxHQUFHO0FBQzFDLFFBQU0sWUFBWSxJQUFJLFNBQVMsR0FBRyxFQUFFLFVBQVU7QUFBQSxJQUM1QyxLQUFLO0FBQUEsSUFDTDtBQUFBLElBQ0EsTUFBTSxDQUFBO0FBQUEsRUFBQyxDQUNSO0FBRUQsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsT0FBTyxTQUFTLEdBQUcsRUFBRTtBQUFBLEVBQUE7QUFFekI7QUFFQSxTQUFTLGtCQUNQLFVBQ0EsUUFDQTtBQUNBLFFBQU0sU0FBUyxFQUFFLEdBQUcsU0FBQTtBQUNwQixhQUFXLE9BQU8sT0FBTyxLQUFLLFFBQVEsR0FBRztBQUN2QyxVQUFNLFFBQVEsU0FBUyxHQUFHO0FBQzFCLFFBQUksQ0FBQyxNQUFNLE1BQU8sT0FBTSxRQUFRLENBQUE7QUFDaEMsUUFBSSxNQUFNLE1BQU0sU0FBUyxHQUFHO0FBQzFCO0FBQUEsSUFDRjtBQUNBLFFBQUksTUFBTSxVQUFVO0FBQ2xCLFlBQU0sV0FBVyxTQUFTLGNBQWMsTUFBTSxRQUFRO0FBQ3RELFVBQUksVUFBVTtBQUNaLGNBQU0sV0FBVztBQUNqQixjQUFNLFFBQVEsT0FBTyxNQUFNLFNBQVMsU0FBUztBQUM3QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQ0EsUUFBSSxPQUFPLE1BQU0sYUFBYSxVQUFVO0FBQ3RDLFlBQU0sUUFBUSxPQUFPLE1BQU0sTUFBTSxRQUFRO0FBQ3pDO0FBQUEsSUFDRjtBQUNBLFVBQU0saUJBQWtCLE1BQU0sVUFBa0I7QUFDaEQsUUFBSSxnQkFBZ0I7QUFDbEIsWUFBTSxRQUFRLE9BQU8sTUFBTSxjQUFjO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNUO0FBRU8sU0FBUyxVQUFVLFFBQXNCO0FBQzlDLFFBQU0sU0FBUyxJQUFJLGVBQUE7QUFDbkIsUUFBTSxPQUNKLE9BQU8sT0FBTyxTQUFTLFdBQ25CLFNBQVMsY0FBYyxPQUFPLElBQUksSUFDbEMsT0FBTztBQUViLE1BQUksQ0FBQyxNQUFNO0FBQ1QsVUFBTSxJQUFJO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxFQUFFLE1BQU0sT0FBTyxLQUFBO0FBQUEsSUFBSztBQUFBLEVBRXhCO0FBRUEsUUFBTSxXQUFXLE9BQU8sU0FBUztBQUNqQyxNQUFJLENBQUMsT0FBTyxTQUFTLFFBQVEsR0FBRztBQUM5QixVQUFNLElBQUk7QUFBQSxNQUNSLFdBQVc7QUFBQSxNQUNYLEVBQUUsS0FBSyxTQUFBO0FBQUEsSUFBUztBQUFBLEVBRXBCO0FBRUEsUUFBTSxXQUFXLGtCQUFrQixPQUFPLFVBQVUsTUFBTTtBQUMxRCxRQUFNLGFBQWEsSUFBSSxXQUFXLEVBQUUsVUFBb0I7QUFHeEQsTUFBSSxPQUFPLE1BQU07QUFDZCxlQUFtQixPQUFPLE9BQU87QUFBQSxFQUNwQyxPQUFPO0FBRUosZUFBbUIsT0FBTztBQUFBLEVBQzdCO0FBRUEsUUFBTSxFQUFFLE1BQU0sVUFBVSxNQUFBLElBQVU7QUFBQSxJQUNoQztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFBQTtBQUdGLE1BQUksTUFBTTtBQUNSLFNBQUssWUFBWTtBQUNqQixTQUFLLFlBQVksSUFBSTtBQUFBLEVBQ3ZCO0FBR0EsTUFBSSxPQUFPLFNBQVMsWUFBWSxZQUFZO0FBQzFDLGFBQVMsUUFBQTtBQUFBLEVBQ1g7QUFFQSxhQUFXLFVBQVUsT0FBTyxVQUFVLElBQW1CO0FBRXpELE1BQUksT0FBTyxTQUFTLGFBQWEsWUFBWTtBQUMzQyxhQUFTLFNBQUE7QUFBQSxFQUNYO0FBRUEsU0FBTztBQUNUOyJ9
