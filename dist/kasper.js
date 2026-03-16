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
  MULTIPLE_STRUCTURAL_DIRECTIVES: "K003-9",
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
  "K003-9": () => "Multiple structural directives (@if, @each) on the same element are not allowed. Nest them or use <void> instead.",
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
const KEY_MAP = {
  esc: ["Escape", "Esc"],
  escape: ["Escape", "Esc"],
  space: [" ", "Spacebar"],
  up: ["ArrowUp", "Up"],
  down: ["ArrowDown", "Down"],
  left: ["ArrowLeft", "Left"],
  right: ["ArrowRight", "Right"],
  del: ["Delete", "Del"],
  delete: ["Delete", "Del"],
  ins: ["Insert"],
  dot: ["."],
  comma: [","],
  slash: ["/"],
  backslash: ["\\"],
  plus: ["+"],
  minus: ["-"],
  equal: ["="]
};
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
  createSiblings(nodes, parent) {
    let current = 0;
    const initialScope = this.interpreter.scope;
    let groupScope = null;
    while (current < nodes.length) {
      const node = nodes[current++];
      if (node.type === "element") {
        const el = node;
        const $let = this.findAttr(el, ["@let"]);
        if ($let) {
          if (!groupScope) {
            groupScope = new Scope(initialScope);
            this.interpreter.scope = groupScope;
          }
          this.execute($let.value);
        }
        const ifAttr = this.findAttr(el, ["@if"]);
        const elseifAttr = this.findAttr(el, ["@elseif"]);
        const elseAttr = this.findAttr(el, ["@else"]);
        const $each = this.findAttr(el, ["@each"]);
        if (this.mode === "development") {
          const structuralCount = [ifAttr, elseifAttr, elseAttr, $each].filter((a) => a).length;
          if (structuralCount > 1) {
            this.error(KErrorCode.MULTIPLE_STRUCTURAL_DIRECTIVES, {}, el.name);
          }
        }
        if ($each) {
          this.doEach($each, el, parent);
          continue;
        }
        if (ifAttr) {
          const expressions = [[el, ifAttr]];
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
      }
      this.evaluate(node, parent);
    }
    this.interpreter.scope = initialScope;
  }
  createElement(node, parent) {
    var _a;
    try {
      if (node.name === "slot") {
        const nameAttr = this.findAttr(node, ["@name"]);
        const name = nameAttr ? nameAttr.value : "default";
        const slots = this.interpreter.scope.get("$slots");
        if (slots && slots[name]) {
          const prev = this.interpreter.scope;
          if (slots[name].scope) this.interpreter.scope = slots[name].scope;
          this.createSiblings(slots[name], parent);
          this.interpreter.scope = prev;
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
        slots.default.scope = this.interpreter.scope;
        for (const child of node.children) {
          if (child.type === "element") {
            const slotAttr = this.findAttr(child, ["@slot"]);
            if (slotAttr) {
              const name = slotAttr.value;
              if (!slots[name]) {
                slots[name] = [];
                slots[name].scope = this.interpreter.scope;
              }
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
          return name.startsWith("@") && !["@if", "@elseif", "@else", "@each", "@let", "@key", "@ref"].includes(
            name
          ) && !name.startsWith("@on:") && !name.startsWith("@:");
        });
        for (const attr of shorthandAttributes) {
          const realName = attr.name.slice(1);
          if (realName === "class") {
            const stop = this.scopedEffect(() => {
              const value = this.execute(attr.value);
              const instance = this.interpreter.scope.get("$instance");
              const task = () => {
                element.setAttribute("class", value);
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
      if (e instanceof KasperError && e.code === KErrorCode.RUNTIME_ERROR) throw e;
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
      if (this.mode === "development" && key.toLowerCase().startsWith("on")) {
        const trimmed = arg.value.trim();
        const isCallExpr = /^[\w$.][\w$.]*\s*\(.*\)\s*$/.test(trimmed) && !trimmed.includes("=>");
        if (isCallExpr) {
          console.warn(
            `[Kasper] @:${key}="${arg.value}" — the expression is called during render and its return value is passed as the prop. If it returns a function, that function becomes the handler (factory pattern). If it returns undefined, the prop receives undefined. If the function has reactive side effects, ensure it does not both read and write the same signal.`
          );
        }
      }
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
    const controlModifiers = ["prevent", "stop", "once", "passive", "capture", "ctrl", "shift", "alt", "meta"];
    const potentialKeyModifiers = modifiers.filter((m) => !controlModifiers.includes(m.toLowerCase()));
    element.addEventListener(
      eventName,
      (event) => {
        if (potentialKeyModifiers.length > 0) {
          const matched = potentialKeyModifiers.some((m) => {
            var _a;
            const lowerM = m.toLowerCase();
            if (KEY_MAP[lowerM] && KEY_MAP[lowerM].includes(event.key)) return true;
            if (lowerM === ((_a = event.key) == null ? void 0 : _a.toLowerCase())) return true;
            return false;
          });
          if (!matched) {
            return;
          }
        }
        if (modifiers.includes("ctrl") && !event.ctrlKey) return;
        if (modifiers.includes("shift") && !event.shiftKey) return;
        if (modifiers.includes("alt") && !event.altKey) return;
        if (modifiers.includes("meta") && !event.metaKey) return;
        if (modifiers.includes("prevent")) event.preventDefault();
        if (modifiers.includes("stop")) event.stopPropagation();
        listenerScope.set("$event", event);
        this.execute(attr.value, listenerScope);
      },
      options
    );
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
    const scope = new Scope(null, component);
    scope.set("$instance", component);
    const prev = this.interpreter.scope;
    this.interpreter.scope = scope;
    flushSync(() => {
      this.createSiblings(nodes, host);
    });
    this.interpreter.scope = prev;
    if (typeof component.onMount === "function") component.onMount();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvc2lnbmFsLnRzIiwiLi4vc3JjL2NvbXBvbmVudC50cyIsIi4uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIi4uL3NyYy90eXBlcy90b2tlbi50cyIsIi4uL3NyYy9leHByZXNzaW9uLXBhcnNlci50cyIsIi4uL3NyYy91dGlscy50cyIsIi4uL3NyYy9zY2FubmVyLnRzIiwiLi4vc3JjL3Njb3BlLnRzIiwiLi4vc3JjL2ludGVycHJldGVyLnRzIiwiLi4vc3JjL3R5cGVzL25vZGVzLnRzIiwiLi4vc3JjL3RlbXBsYXRlLXBhcnNlci50cyIsIi4uL3NyYy9yb3V0ZXIudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvc2NoZWR1bGVyLnRzIiwiLi4vc3JjL3RyYW5zcGlsZXIudHMiLCIuLi9zcmMva2FzcGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBLRXJyb3JDb2RlID0ge1xuICAvLyBCb290c3RyYXBcbiAgUk9PVF9FTEVNRU5UX05PVF9GT1VORDogXCJLMDAxLTFcIixcbiAgRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORDogXCJLMDAxLTJcIixcblxuICAvLyBTY2FubmVyXG4gIFVOVEVSTUlOQVRFRF9DT01NRU5UOiBcIkswMDItMVwiLFxuICBVTlRFUk1JTkFURURfU1RSSU5HOiBcIkswMDItMlwiLFxuICBVTkVYUEVDVEVEX0NIQVJBQ1RFUjogXCJLMDAyLTNcIixcblxuICAvLyBUZW1wbGF0ZSBQYXJzZXJcbiAgVU5FWFBFQ1RFRF9FT0Y6IFwiSzAwMy0xXCIsXG4gIFVORVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy0yXCIsXG4gIEVYUEVDVEVEX1RBR19OQU1FOiBcIkswMDMtM1wiLFxuICBFWFBFQ1RFRF9DTE9TSU5HX0JSQUNLRVQ6IFwiSzAwMy00XCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfVEFHOiBcIkswMDMtNVwiLFxuICBCTEFOS19BVFRSSUJVVEVfTkFNRTogXCJLMDAzLTZcIixcbiAgTUlTUExBQ0VEX0NPTkRJVElPTkFMOiBcIkswMDMtN1wiLFxuICBEVVBMSUNBVEVfSUY6IFwiSzAwMy04XCIsXG4gIE1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUzogXCJLMDAzLTlcIixcblxuICAvLyBFeHByZXNzaW9uIFBhcnNlclxuICBVTkVYUEVDVEVEX1RPS0VOOiBcIkswMDQtMVwiLFxuICBJTlZBTElEX0xWQUxVRTogXCJLMDA0LTJcIixcbiAgRVhQRUNURURfRVhQUkVTU0lPTjogXCJLMDA0LTNcIixcbiAgSU5WQUxJRF9ESUNUSU9OQVJZX0tFWTogXCJLMDA0LTRcIixcblxuICAvLyBJbnRlcnByZXRlclxuICBJTlZBTElEX1BPU1RGSVhfTFZBTFVFOiBcIkswMDUtMVwiLFxuICBVTktOT1dOX0JJTkFSWV9PUEVSQVRPUjogXCJLMDA1LTJcIixcbiAgSU5WQUxJRF9QUkVGSVhfUlZBTFVFOiBcIkswMDUtM1wiLFxuICBVTktOT1dOX1VOQVJZX09QRVJBVE9SOiBcIkswMDUtNFwiLFxuICBOT1RfQV9GVU5DVElPTjogXCJLMDA1LTVcIixcbiAgTk9UX0FfQ0xBU1M6IFwiSzAwNS02XCIsXG5cbiAgLy8gU2lnbmFsc1xuICBDSVJDVUxBUl9DT01QVVRFRDogXCJLMDA2LTFcIixcblxuICAvLyBUcmFuc3BpbGVyXG4gIFJVTlRJTUVfRVJST1I6IFwiSzAwNy0xXCIsXG4gIE1JU1NJTkdfUkVRVUlSRURfQVRUUjogXCJLMDA3LTJcIixcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEtFcnJvckNvZGVUeXBlID0gKHR5cGVvZiBLRXJyb3JDb2RlKVtrZXlvZiB0eXBlb2YgS0Vycm9yQ29kZV07XG5cbmV4cG9ydCBjb25zdCBFcnJvclRlbXBsYXRlczogUmVjb3JkPHN0cmluZywgKGFyZ3M6IGFueSkgPT4gc3RyaW5nPiA9IHtcbiAgXCJLMDAxLTFcIjogKGEpID0+IGBSb290IGVsZW1lbnQgbm90IGZvdW5kOiAke2Eucm9vdH1gLFxuICBcIkswMDEtMlwiOiAoYSkgPT4gYEVudHJ5IGNvbXBvbmVudCA8JHthLnRhZ30+IG5vdCBmb3VuZCBpbiByZWdpc3RyeS5gLFxuICBcbiAgXCJLMDAyLTFcIjogKCkgPT4gJ1VudGVybWluYXRlZCBjb21tZW50LCBleHBlY3RpbmcgY2xvc2luZyBcIiovXCInLFxuICBcIkswMDItMlwiOiAoYSkgPT4gYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7YS5xdW90ZX1gLFxuICBcIkswMDItM1wiOiAoYSkgPT4gYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2EuY2hhcn0nYCxcblxuICBcIkswMDMtMVwiOiAoYSkgPT4gYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7YS5lb2ZFcnJvcn1gLFxuICBcIkswMDMtMlwiOiAoKSA9PiBcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIixcbiAgXCJLMDAzLTNcIjogKCkgPT4gXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIsXG4gIFwiSzAwMy00XCI6ICgpID0+IFwiRXhwZWN0ZWQgY2xvc2luZyB0YWcgPlwiLFxuICBcIkswMDMtNVwiOiAoYSkgPT4gYEV4cGVjdGVkIDwvJHthLm5hbWV9PmAsXG4gIFwiSzAwMy02XCI6ICgpID0+IFwiQmxhbmsgYXR0cmlidXRlIG5hbWVcIixcbiAgXCJLMDAzLTdcIjogKGEpID0+IGBAJHthLm5hbWV9IG11c3QgYmUgcHJlY2VkZWQgYnkgYW4gQGlmIG9yIEBlbHNlaWYgYmxvY2suYCxcbiAgXCJLMDAzLThcIjogKCkgPT4gXCJNdWx0aXBsZSBjb25kaXRpb25hbCBkaXJlY3RpdmVzIChAaWYsIEBlbHNlaWYsIEBlbHNlKSBvbiB0aGUgc2FtZSBlbGVtZW50IGFyZSBub3QgYWxsb3dlZC5cIixcbiAgXCJLMDAzLTlcIjogKCkgPT4gXCJNdWx0aXBsZSBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgKEBpZiwgQGVhY2gpIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXJlIG5vdCBhbGxvd2VkLiBOZXN0IHRoZW0gb3IgdXNlIDx2b2lkPiBpbnN0ZWFkLlwiLFxuXG4gIFwiSzAwNC0xXCI6IChhKSA9PiBgJHthLm1lc3NhZ2V9LCB1bmV4cGVjdGVkIHRva2VuIFwiJHthLnRva2VufVwiYCxcbiAgXCJLMDA0LTJcIjogKCkgPT4gXCJJbnZhbGlkIGwtdmFsdWUsIGlzIG5vdCBhbiBhc3NpZ25pbmcgdGFyZ2V0LlwiLFxuICBcIkswMDQtM1wiOiAoYSkgPT4gYEV4cGVjdGVkIGV4cHJlc3Npb24sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtNFwiOiAoYSkgPT4gYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7YS50b2tlbn1gLFxuXG4gIFwiSzAwNS0xXCI6IChhKSA9PiBgSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBwb3N0Zml4IG9wZXJhdGlvbjogJHthLmVudGl0eX1gLFxuICBcIkswMDUtMlwiOiAoYSkgPT4gYFVua25vd24gYmluYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtM1wiOiAoYSkgPT4gYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogJHthLnJpZ2h0fWAsXG4gIFwiSzAwNS00XCI6IChhKSA9PiBgVW5rbm93biB1bmFyeSBvcGVyYXRvciAke2Eub3BlcmF0b3J9YCxcbiAgXCJLMDA1LTVcIjogKGEpID0+IGAke2EuY2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmAsXG4gIFwiSzAwNS02XCI6IChhKSA9PiBgJyR7YS5jbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gLFxuXG4gIFwiSzAwNi0xXCI6ICgpID0+IFwiQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCBpbiBjb21wdXRlZCBzaWduYWxcIixcblxuICBcIkswMDctMVwiOiAoYSkgPT4gYS5tZXNzYWdlLFxuICBcIkswMDctMlwiOiAoYSkgPT4gYS5tZXNzYWdlLFxufTtcblxuZXhwb3J0IGNsYXNzIEthc3BlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY29kZTogS0Vycm9yQ29kZVR5cGUsXG4gICAgcHVibGljIGFyZ3M6IGFueSA9IHt9LFxuICAgIHB1YmxpYyBsaW5lPzogbnVtYmVyLFxuICAgIHB1YmxpYyBjb2w/OiBudW1iZXIsXG4gICAgcHVibGljIHRhZ05hbWU/OiBzdHJpbmdcbiAgKSB7XG4gICAgLy8gRGV0ZWN0IGVudmlyb25tZW50XG4gICAgY29uc3QgaXNEZXYgPVxuICAgICAgdHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCJcbiAgICAgICAgOiAoaW1wb3J0Lm1ldGEgYXMgYW55KS5lbnY/Lk1PREUgIT09IFwicHJvZHVjdGlvblwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBFcnJvclRlbXBsYXRlc1tjb2RlXTtcbiAgICBjb25zdCBtZXNzYWdlID0gdGVtcGxhdGUgXG4gICAgICA/IHRlbXBsYXRlKGFyZ3MpIFxuICAgICAgOiAodHlwZW9mIGFyZ3MgPT09ICdzdHJpbmcnID8gYXJncyA6IFwiVW5rbm93biBlcnJvclwiKTtcbiAgICBcbiAgICBjb25zdCBsb2NhdGlvbiA9IGxpbmUgIT09IHVuZGVmaW5lZCA/IGAgKCR7bGluZX06JHtjb2x9KWAgOiBcIlwiO1xuICAgIGNvbnN0IHRhZ0luZm8gPSB0YWdOYW1lID8gYFxcbiAgYXQgPCR7dGFnTmFtZX0+YCA6IFwiXCI7XG4gICAgY29uc3QgbGluayA9IGlzRGV2XG4gICAgICA/IGBcXG5cXG5TZWU6IGh0dHBzOi8va2FzcGVyanMudG9wL3JlZmVyZW5jZS9lcnJvcnMjJHtjb2RlLnRvTG93ZXJDYXNlKCkucmVwbGFjZShcIi5cIiwgXCJcIil9YFxuICAgICAgOiBcIlwiO1xuXG4gICAgc3VwZXIoYFske2NvZGV9XSAke21lc3NhZ2V9JHtsb2NhdGlvbn0ke3RhZ0luZm99JHtsaW5rfWApO1xuICAgIHRoaXMubmFtZSA9IFwiS2FzcGVyRXJyb3JcIjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG50eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxubGV0IGFjdGl2ZUVmZmVjdDogeyBmbjogTGlzdGVuZXI7IGRlcHM6IFNldDxhbnk+IH0gfCBudWxsID0gbnVsbDtcbmNvbnN0IGVmZmVjdFN0YWNrOiBhbnlbXSA9IFtdO1xuXG5sZXQgYmF0Y2hpbmcgPSBmYWxzZTtcbmNvbnN0IHBlbmRpbmdTdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG5jb25zdCBwZW5kaW5nV2F0Y2hlcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbnR5cGUgV2F0Y2hlcjxUPiA9IChuZXdWYWx1ZTogVCwgb2xkVmFsdWU6IFQpID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2lnbmFsT3B0aW9ucyB7XG4gIHNpZ25hbD86IEFib3J0U2lnbmFsO1xufVxuXG5leHBvcnQgY2xhc3MgU2lnbmFsPFQ+IHtcbiAgcHJvdGVjdGVkIF92YWx1ZTogVDtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG4gIHByaXZhdGUgd2F0Y2hlcnMgPSBuZXcgU2V0PFdhdGNoZXI8VD4+KCk7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZhbHVlOiBUKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgaWYgKGFjdGl2ZUVmZmVjdCkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5hZGQoYWN0aXZlRWZmZWN0LmZuKTtcbiAgICAgIGFjdGl2ZUVmZmVjdC5kZXBzLmFkZCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX3ZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl92YWx1ZTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICBpZiAoYmF0Y2hpbmcpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5zdWJzY3JpYmVycykgcGVuZGluZ1N1YnNjcmliZXJzLmFkZChzdWIpO1xuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykgcGVuZGluZ1dhdGNoZXJzLnB1c2goKCkgPT4gd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN1YnMgPSBBcnJheS5mcm9tKHRoaXMuc3Vic2NyaWJlcnMpO1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiBzdWJzKSB7XG4gICAgICAgICAgc3ViKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCB3YXRjaGVyIG9mIHRoaXMud2F0Y2hlcnMpIHtcbiAgICAgICAgICB0cnkgeyB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7IH0gY2F0Y2ggKGUpIHsgY29uc29sZS5lcnJvcihcIldhdGNoZXIgZXJyb3I6XCIsIGUpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZShmbjogV2F0Y2hlcjxUPiwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpOiAoKSA9PiB2b2lkIHtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsPy5hYm9ydGVkKSByZXR1cm4gKCkgPT4ge307XG4gICAgdGhpcy53YXRjaGVycy5hZGQoZm4pO1xuICAgIGNvbnN0IHN0b3AgPSAoKSA9PiB0aGlzLndhdGNoZXJzLmRlbGV0ZShmbik7XG4gICAgaWYgKG9wdGlvbnM/LnNpZ25hbCkge1xuICAgICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0b3A7XG4gIH1cblxuICB1bnN1YnNjcmliZShmbjogTGlzdGVuZXIpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmRlbGV0ZShmbik7XG4gIH1cblxuICB0b1N0cmluZygpIHsgcmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKTsgfVxuICBwZWVrKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbn1cblxuY2xhc3MgQ29tcHV0ZWRTaWduYWw8VD4gZXh0ZW5kcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIGZuOiAoKSA9PiBUO1xuICBwcml2YXRlIGNvbXB1dGluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGZuOiAoKSA9PiBULCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucykge1xuICAgIHN1cGVyKHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHRoaXMuZm4gPSBmbjtcblxuICAgIGNvbnN0IHN0b3AgPSBlZmZlY3QoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29tcHV0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihLRXJyb3JDb2RlLkNJUkNVTEFSX0NPTVBVVEVEKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wdXRpbmcgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gRWFnZXJseSB1cGRhdGUgdGhlIHZhbHVlIHNvIHN1YnNjcmliZXJzIGFyZSBub3RpZmllZCBpbW1lZGlhdGVseVxuICAgICAgICBzdXBlci52YWx1ZSA9IHRoaXMuZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuY29tcHV0aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICByZXR1cm4gc3VwZXIudmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUoX3Y6IFQpIHtcbiAgICAvLyBDb21wdXRlZCBzaWduYWxzIGFyZSByZWFkLW9ubHkgZnJvbSBvdXRzaWRlXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVmZmVjdChmbjogTGlzdGVuZXIsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgY29uc3QgZWZmZWN0T2JqID0ge1xuICAgIGZuOiAoKSA9PiB7XG4gICAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuXG4gICAgICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdE9iaik7XG4gICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RPYmo7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXBzOiBuZXcgU2V0PFNpZ25hbDxhbnk+PigpXG4gIH07XG5cbiAgZWZmZWN0T2JqLmZuKCk7XG4gIGNvbnN0IHN0b3A6IGFueSA9ICgpID0+IHtcbiAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcbiAgfTtcbiAgc3RvcC5ydW4gPSBlZmZlY3RPYmouZm47XG5cbiAgaWYgKG9wdGlvbnM/LnNpZ25hbCkge1xuICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gIH1cblxuICByZXR1cm4gc3RvcCBhcyAoKCkgPT4gdm9pZCkgJiB7IHJ1bjogKCkgPT4gdm9pZCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbmFsPFQ+KGluaXRpYWxWYWx1ZTogVCk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgU2lnbmFsKGluaXRpYWxWYWx1ZSk7XG59XG5cbi8qKlxuICogRnVuY3Rpb25hbCBhbGlhcyBmb3IgU2lnbmFsLm9uQ2hhbmdlKClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhdGNoPFQ+KHNpZzogU2lnbmFsPFQ+LCBmbjogV2F0Y2hlcjxUPiwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpOiAoKSA9PiB2b2lkIHtcbiAgcmV0dXJuIHNpZy5vbkNoYW5nZShmbiwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXRjaChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBiYXRjaGluZyA9IHRydWU7XG4gIHRyeSB7XG4gICAgZm4oKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBiYXRjaGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IHN1YnMgPSBBcnJheS5mcm9tKHBlbmRpbmdTdWJzY3JpYmVycyk7XG4gICAgcGVuZGluZ1N1YnNjcmliZXJzLmNsZWFyKCk7XG4gICAgY29uc3Qgd2F0Y2hlcnMgPSBwZW5kaW5nV2F0Y2hlcnMuc3BsaWNlKDApO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgIHN1YigpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2Ygd2F0Y2hlcnMpIHtcbiAgICAgIHRyeSB7IHdhdGNoZXIoKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBULCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgQ29tcHV0ZWRTaWduYWwoZm4sIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHsgU2lnbmFsLCBlZmZlY3QgYXMgcmF3RWZmZWN0LCBjb21wdXRlZCBhcyByYXdDb21wdXRlZCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3M8VEFyZ3MgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgYW55Pj4ge1xuICBhcmdzOiBUQXJncztcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8VEFyZ3MgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgYW55Pj4ge1xuICBzdGF0aWMgdGVtcGxhdGU/OiBzdHJpbmc7XG4gIGFyZ3M6IFRBcmdzID0ge30gYXMgVEFyZ3M7XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xuICAkYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAkcmVuZGVyPzogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz86IENvbXBvbmVudEFyZ3M8VEFyZ3M+KSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge30gYXMgVEFyZ3M7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzO1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSByZWFjdGl2ZSBlZmZlY3QgdGllZCB0byB0aGUgY29tcG9uZW50J3MgbGlmZWN5Y2xlLlxuICAgKiBSdW5zIGltbWVkaWF0ZWx5IGFuZCByZS1ydW5zIHdoZW4gYW55IHNpZ25hbCBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gICAqL1xuICBlZmZlY3QoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICByYXdFZmZlY3QoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoZXMgYSBzcGVjaWZpYyBzaWduYWwgZm9yIGNoYW5nZXMuXG4gICAqIERvZXMgTk9UIHJ1biBpbW1lZGlhdGVseS5cbiAgICovXG4gIHdhdGNoPFQ+KHNpZzogU2lnbmFsPFQ+LCBmbjogV2F0Y2hlcjxUPik6IHZvaWQge1xuICAgIHNpZy5vbkNoYW5nZShmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNvbXB1dGVkIHNpZ25hbCB0aWVkIHRvIHRoZSBjb21wb25lbnQncyBsaWZlY3ljbGUuXG4gICAqIFRoZSBpbnRlcm5hbCBlZmZlY3QgaXMgYXV0b21hdGljYWxseSBjbGVhbmVkIHVwIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBjb21wdXRlZDxUPihmbjogKCkgPT4gVCk6IFNpZ25hbDxUPiB7XG4gICAgcmV0dXJuIHJhd0NvbXB1dGVkKGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIG9uTW91bnQoKSB7IH1cbiAgb25SZW5kZXIoKSB7IH1cbiAgb25DaGFuZ2VzKCkgeyB9XG4gIG9uRGVzdHJveSgpIHsgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLiRyZW5kZXI/LigpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEthc3BlckVudGl0eSA9IENvbXBvbmVudCB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBDb21wb25lbnRDbGFzcyA9IHsgbmV3KGFyZ3M/OiBDb21wb25lbnRBcmdzPGFueT4pOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIHNlbGVjdG9yPzogc3RyaW5nO1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gICAgdGVtcGxhdGU/OiBFbGVtZW50IHwgc3RyaW5nIHwgbnVsbDtcbiAgICBub2Rlcz86IEtOb2RlW107XG4gIH07XG59XG4iLCJpbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAndG9rZW4nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXhwciB7XG4gIHB1YmxpYyByZXN1bHQ6IGFueTtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBpbnRlcmZhY2UgRXhwclZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0QXJyb3dGdW5jdGlvbkV4cHIoZXhwcjogQXJyb3dGdW5jdGlvbik6IFI7XG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEFzc2lnbik6IFI7XG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEJpbmFyeSk6IFI7XG4gICAgdmlzaXRDYWxsRXhwcihleHByOiBDYWxsKTogUjtcbiAgICB2aXNpdERlYnVnRXhwcihleHByOiBEZWJ1Zyk6IFI7XG4gICAgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBEaWN0aW9uYXJ5KTogUjtcbiAgICB2aXNpdEVhY2hFeHByKGV4cHI6IEVhY2gpOiBSO1xuICAgIHZpc2l0R2V0RXhwcihleHByOiBHZXQpOiBSO1xuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEdyb3VwaW5nKTogUjtcbiAgICB2aXNpdEtleUV4cHIoZXhwcjogS2V5KTogUjtcbiAgICB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IExvZ2ljYWwpOiBSO1xuICAgIHZpc2l0TGlzdEV4cHIoZXhwcjogTGlzdCk6IFI7XG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByOiBMaXRlcmFsKTogUjtcbiAgICB2aXNpdE5ld0V4cHIoZXhwcjogTmV3KTogUjtcbiAgICB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBOdWxsQ29hbGVzY2luZyk6IFI7XG4gICAgdmlzaXRQb3N0Zml4RXhwcihleHByOiBQb3N0Zml4KTogUjtcbiAgICB2aXNpdFNldEV4cHIoZXhwcjogU2V0KTogUjtcbiAgICB2aXNpdFBpcGVsaW5lRXhwcihleHByOiBQaXBlbGluZSk6IFI7XG4gICAgdmlzaXRTcHJlYWRFeHByKGV4cHI6IFNwcmVhZCk6IFI7XG4gICAgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogVGVtcGxhdGUpOiBSO1xuICAgIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogVGVybmFyeSk6IFI7XG4gICAgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IFR5cGVvZik6IFI7XG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcjogVW5hcnkpOiBSO1xuICAgIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IFZhcmlhYmxlKTogUjtcbiAgICB2aXNpdFZvaWRFeHByKGV4cHI6IFZvaWQpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgQXJyb3dGdW5jdGlvbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwYXJhbXM6IFRva2VuW107XG4gICAgcHVibGljIGJvZHk6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFRva2VuW10sIGJvZHk6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBcnJvd0Z1bmN0aW9uRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFycm93RnVuY3Rpb24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFzc2lnbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Bc3NpZ24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQmluYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjYWxsZWU6IEV4cHI7XG4gICAgcHVibGljIHBhcmVuOiBUb2tlbjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuICAgIHB1YmxpYyBvcHRpb25hbDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKGNhbGxlZTogRXhwciwgcGFyZW46IFRva2VuLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlciwgb3B0aW9uYWwgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgdGhpcy5wYXJlbiA9IHBhcmVuO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gb3B0aW9uYWw7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FsbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5DYWxsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWJ1Z0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EZWJ1Zyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcHJvcGVydGllczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREaWN0aW9uYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRpY3Rpb25hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFYWNoIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBrZXk6IFRva2VuO1xuICAgIHB1YmxpYyBpdGVyYWJsZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBrZXk6IFRva2VuLCBpdGVyYWJsZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLml0ZXJhYmxlID0gaXRlcmFibGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWFjaEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5FYWNoJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdHlwZTogVG9rZW5UeXBlLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5HZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cGluZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R3JvdXBpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR3JvdXBpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLZXkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0S2V5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLktleSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2ljYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMb2dpY2FsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxvZ2ljYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpc3RFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGlzdCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXRlcmFsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmV3IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNsYXp6OiBFeHByO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3RvcihjbGF6ejogRXhwciwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGF6eiA9IGNsYXp6O1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE5ld0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OZXcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsQ29hbGVzY2luZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE51bGxDb2FsZXNjaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk51bGxDb2FsZXNjaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9zdGZpeCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQb3N0Zml4RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBvc3RmaXgnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UGlwZWxpbmVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUGlwZWxpbmUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcHJlYWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTcHJlYWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU3ByZWFkJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVtcGxhdGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVtcGxhdGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXJuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogRXhwcjtcbiAgICBwdWJsaWMgdGhlbkV4cHI6IEV4cHI7XG4gICAgcHVibGljIGVsc2VFeHByOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBFeHByLCB0aGVuRXhwcjogRXhwciwgZWxzZUV4cHI6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuRXhwciA9IHRoZW5FeHByO1xuICAgICAgICB0aGlzLmVsc2VFeHByID0gZWxzZUV4cHI7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVybmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZXJuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHlwZW9mIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHlwZW9mRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlR5cGVvZic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJpYWJsZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5WYXJpYWJsZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZvaWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWb2lkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZvaWQnO1xuICB9XG59XG5cbiIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgLy8gUGFyc2VyIFRva2Vuc1xyXG4gIEVvZixcclxuICBQYW5pYyxcclxuXHJcbiAgLy8gU2luZ2xlIENoYXJhY3RlciBUb2tlbnNcclxuICBBbXBlcnNhbmQsXHJcbiAgQXRTaWduLFxyXG4gIENhcmV0LFxyXG4gIENvbW1hLFxyXG4gIERvbGxhcixcclxuICBEb3QsXHJcbiAgSGFzaCxcclxuICBMZWZ0QnJhY2UsXHJcbiAgTGVmdEJyYWNrZXQsXHJcbiAgTGVmdFBhcmVuLFxyXG4gIFBlcmNlbnQsXHJcbiAgUGlwZSxcclxuICBSaWdodEJyYWNlLFxyXG4gIFJpZ2h0QnJhY2tldCxcclxuICBSaWdodFBhcmVuLFxyXG4gIFNlbWljb2xvbixcclxuICBTbGFzaCxcclxuICBTdGFyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnNcclxuICBBcnJvdyxcclxuICBCYW5nLFxyXG4gIEJhbmdFcXVhbCxcclxuICBCYW5nRXF1YWxFcXVhbCxcclxuICBDb2xvbixcclxuICBFcXVhbCxcclxuICBFcXVhbEVxdWFsLFxyXG4gIEVxdWFsRXF1YWxFcXVhbCxcclxuICBHcmVhdGVyLFxyXG4gIEdyZWF0ZXJFcXVhbCxcclxuICBMZXNzLFxyXG4gIExlc3NFcXVhbCxcclxuICBNaW51cyxcclxuICBNaW51c0VxdWFsLFxyXG4gIE1pbnVzTWludXMsXHJcbiAgUGVyY2VudEVxdWFsLFxyXG4gIFBsdXMsXHJcbiAgUGx1c0VxdWFsLFxyXG4gIFBsdXNQbHVzLFxyXG4gIFF1ZXN0aW9uLFxyXG4gIFF1ZXN0aW9uRG90LFxyXG4gIFF1ZXN0aW9uUXVlc3Rpb24sXHJcbiAgU2xhc2hFcXVhbCxcclxuICBTdGFyRXF1YWwsXHJcbiAgRG90RG90LFxyXG4gIERvdERvdERvdCxcclxuICBMZXNzRXF1YWxHcmVhdGVyLFxyXG5cclxuICAvLyBMaXRlcmFsc1xyXG4gIElkZW50aWZpZXIsXHJcbiAgVGVtcGxhdGUsXHJcbiAgU3RyaW5nLFxyXG4gIE51bWJlcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zIChiaXR3aXNlIHNoaWZ0cylcclxuICBMZWZ0U2hpZnQsXHJcbiAgUmlnaHRTaGlmdCxcclxuICBQaXBlbGluZSxcclxuICBUaWxkZSxcclxuXHJcbiAgLy8gS2V5d29yZHNcclxuICBBbmQsXHJcbiAgQ29uc3QsXHJcbiAgRGVidWcsXHJcbiAgRmFsc2UsXHJcbiAgSW4sXHJcbiAgSW5zdGFuY2VvZixcclxuICBOZXcsXHJcbiAgTnVsbCxcclxuICBVbmRlZmluZWQsXHJcbiAgT2YsXHJcbiAgT3IsXHJcbiAgVHJ1ZSxcclxuICBUeXBlb2YsXHJcbiAgVm9pZCxcclxuICBXaXRoLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcclxuICBwdWJsaWMgbGl0ZXJhbDogYW55O1xyXG4gIHB1YmxpYyBsZXhlbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0eXBlOiBUb2tlblR5cGUsXHJcbiAgICBsZXhlbWU6IHN0cmluZyxcclxuICAgIGxpdGVyYWw6IGFueSxcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBUb2tlblR5cGVbdHlwZV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XHJcbiAgICB0aGlzLmxpdGVyYWwgPSBsaXRlcmFsO1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBbKCR7dGhpcy5saW5lfSk6XCIke3RoaXMubGV4ZW1lfVwiXWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlbGZDbG9zaW5nVGFncyA9IFtcclxuICBcImFyZWFcIixcclxuICBcImJhc2VcIixcclxuICBcImJyXCIsXHJcbiAgXCJjb2xcIixcclxuICBcImVtYmVkXCIsXHJcbiAgXCJoclwiLFxyXG4gIFwiaW1nXCIsXHJcbiAgXCJpbnB1dFwiLFxyXG4gIFwibGlua1wiLFxyXG4gIFwibWV0YVwiLFxyXG4gIFwicGFyYW1cIixcclxuICBcInNvdXJjZVwiLFxyXG4gIFwidHJhY2tcIixcclxuICBcIndiclwiLFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uUGFyc2VyIHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xuXG4gIHB1YmxpYyBwYXJzZSh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHJbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLnR5cGVzOiBUb2tlblR5cGVbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogVG9rZW4ge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnRdO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmV2aW91cygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCAtIDFdO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayh0eXBlOiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrKFRva2VuVHlwZS5Fb2YpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdW1lKHR5cGU6IFRva2VuVHlwZSwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLlVORVhQRUNURURfVE9LRU4sXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIHsgbWVzc2FnZTogbWVzc2FnZSwgdG9rZW46IHRoaXMucGVlaygpLmxleGVtZSB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIHRva2VuOiBUb2tlbiwgYXJnczogYW55ID0ge30pOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB0b2tlbi5saW5lLCB0b2tlbi5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBzeW5jaHJvbml6ZSgpOiB2b2lkIHtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfSB3aGlsZSAoIXRoaXMuZW9mKCkpO1xuICB9XG5cbiAgcHVibGljIGZvcmVhY2godG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdGVkIGFuIGlkZW50aWZpZXIgaW5zaWRlIFwiZWFjaFwiIHN0YXRlbWVudGBcbiAgICApO1xuXG4gICAgbGV0IGtleTogVG9rZW4gPSBudWxsO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5XaXRoKSkge1xuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxuICAgICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgICAgYEV4cGVjdGVkIGEgXCJrZXlcIiBpZGVudGlmaWVyIGFmdGVyIFwid2l0aFwiIGtleXdvcmQgaW4gZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5PZixcbiAgICAgIGBFeHBlY3RlZCBcIm9mXCIga2V5d29yZCBpbnNpZGUgZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgKTtcbiAgICBjb25zdCBpdGVyYWJsZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHJlc3Npb246IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7XG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7IC8qIGNvbnN1bWUgc2VtaWNvbG9ucyAqLyB9XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5waXBlbGluZSgpO1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TdGFyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBsZXQgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XG4gICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5HZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCBleHByLnR5cGUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlNldChleHByLmVudGl0eSwgZXhwci5rZXksIHZhbHVlLCBleHByLmxpbmUpO1xuICAgICAgfVxuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLklOVkFMSURfTFZBTFVFLCBvcGVyYXRvcik7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBwaXBlbGluZSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBpcGVsaW5lKSkge1xuICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5QaXBlbGluZShleHByLCByaWdodCwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRlcm5hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHRoZW5FeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQ29sb24sIGBFeHBlY3RlZCBcIjpcIiBhZnRlciB0ZXJuYXJ5ID8gZXhwcmVzc2lvbmApO1xuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlcm5hcnkoZXhwciwgdGhlbkV4cHIsIGVsc2VFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5sb2dpY2FsT3IoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk51bGxDb2FsZXNjaW5nKGV4cHIsIHJpZ2h0RXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk9yKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxBbmQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBlcXVhbGl0eSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnNoaWZ0KCk7XG4gICAgd2hpbGUgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxuICAgICAgICBUb2tlblR5cGUuTGVzc0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuSW5zdGFuY2VvZixcbiAgICAgICAgVG9rZW5UeXBlLkluLFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHNoaWZ0KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFNoaWZ0LCBUb2tlblR5cGUuUmlnaHRTaGlmdCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRpdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXMsIFRva2VuVHlwZS5QbHVzKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbW9kdWx1cygpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBlcmNlbnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlwbGljYXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2xhc2gsIFRva2VuVHlwZS5TdGFyKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0eXBlb2YoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHlwZW9mKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVHlwZW9mKHZhbHVlLCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudW5hcnkoKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuTWludXMsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nLFxuICAgICAgICBUb2tlblR5cGUuVGlsZGUsXG4gICAgICAgIFRva2VuVHlwZS5Eb2xsYXIsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzUGx1cyxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnVuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmV3S2V5d29yZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXdLZXl3b3JkKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk5ldykpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCBjb25zdHJ1Y3Q6IEV4cHIuRXhwciA9IHRoaXMuY2FsbCgpO1xuICAgICAgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIEV4cHIuQ2FsbCkge1xuICAgICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdC5jYWxsZWUsIGNvbnN0cnVjdC5hcmdzLCBrZXl3b3JkLmxpbmUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QsIFtdLCBrZXl3b3JkLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wb3N0Zml4KCk7XG4gIH1cblxuICBwcml2YXRlIHBvc3RmaXgoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5jYWxsKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBsdXNQbHVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgMSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzTWludXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAtMSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGNhbGwoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5wcmltYXJ5KCk7XG4gICAgbGV0IGNvbnN1bWVkOiBib29sZWFuO1xuICAgIGRvIHtcbiAgICAgIGNvbnN1bWVkID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgZmFsc2UpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3QsIFRva2VuVHlwZS5RdWVzdGlvbkRvdCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCB0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGNvbnN1bWVkKTtcbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdG9rZW5BdChvZmZzZXQ6IG51bWJlcik6IFRva2VuVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCArIG9mZnNldF0/LnR5cGU7XG4gIH1cblxuICBwcml2YXRlIGlzQXJyb3dQYXJhbXMoKTogYm9vbGVhbiB7XG4gICAgbGV0IGkgPSB0aGlzLmN1cnJlbnQgKyAxOyAvLyBza2lwIChcbiAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgPT09IFRva2VuVHlwZS5SaWdodFBhcmVuKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgfVxuICAgIHdoaWxlIChpIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5JZGVudGlmaWVyKSByZXR1cm4gZmFsc2U7XG4gICAgICBpKys7XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgPT09IFRva2VuVHlwZS5SaWdodFBhcmVuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLkNvbW1hKSByZXR1cm4gZmFsc2U7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgZmluaXNoQ2FsbChjYWxsZWU6IEV4cHIuRXhwciwgcGFyZW46IFRva2VuLCBvcHRpb25hbDogYm9vbGVhbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgYXJnczogRXhwci5FeHByW10gPSBbXTtcbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIH1cbiAgICBjb25zdCBjbG9zZVBhcmVuID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgYXJndW1lbnRzYCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkNhbGwoY2FsbGVlLCBjbG9zZVBhcmVuLCBhcmdzLCBjbG9zZVBhcmVuLmxpbmUsIG9wdGlvbmFsKTtcbiAgfVxuXG4gIHByaXZhdGUgZG90R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBuYW1lOiBUb2tlbiA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdCBwcm9wZXJ0eSBuYW1lIGFmdGVyICcuJ2BcbiAgICApO1xuICAgIGNvbnN0IGtleTogRXhwci5LZXkgPSBuZXcgRXhwci5LZXkobmFtZSwgbmFtZS5saW5lKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgYnJhY2tldEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgbGV0IGtleTogRXhwci5FeHByID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAga2V5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhbiBpbmRleGApO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBvcGVyYXRvci5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJpbWFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5GYWxzZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKGZhbHNlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UcnVlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodHJ1ZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTnVsbCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlVuZGVmaW5lZCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHVuZGVmaW5lZCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTnVtYmVyKSB8fCB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVGVtcGxhdGUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVtcGxhdGUodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLklkZW50aWZpZXIpICYmIHRoaXMudG9rZW5BdCgxKSA9PT0gVG9rZW5UeXBlLkFycm93KSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgPT5cbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKFtwYXJhbV0sIGJvZHksIHBhcmFtLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLkxlZnRQYXJlbikgJiYgdGhpcy5pc0Fycm93UGFyYW1zKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lIChcbiAgICAgIGNvbnN0IHBhcmFtczogVG9rZW5bXSA9IFtdO1xuICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgcGFyYW1zLnB1c2godGhpcy5jb25zdW1lKFRva2VuVHlwZS5JZGVudGlmaWVyLCBcIkV4cGVjdGVkIHBhcmFtZXRlciBuYW1lXCIpKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiYCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkFycm93LCBgRXhwZWN0ZWQgXCI9PlwiYCk7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihwYXJhbXMsIGJvZHksIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgZXhwcmVzc2lvbmApO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkdyb3VwaW5nKGV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlZvaWQpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRlYnVnKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGVidWcoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cblxuICAgIHRocm93IHRoaXMuZXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLkVYUEVDVEVEX0VYUFJFU1NJT04sXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIHsgdG9rZW46IHRoaXMucGVlaygpLmxleGVtZSB9XG4gICAgKTtcbiAgICAvLyB1bnJlYWNoZWFibGUgY29kZVxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xuICB9XG5cbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBsZWZ0QnJhY2UgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgIHByb3BlcnRpZXMucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcsIFRva2VuVHlwZS5JZGVudGlmaWVyLCBUb2tlblR5cGUuTnVtYmVyKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db2xvbikpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEV4cHIuVmFyaWFibGUoa2V5LCBrZXkubGluZSk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgS0Vycm9yQ29kZS5JTlZBTElEX0RJQ1RJT05BUllfS0VZLFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIHsgdG9rZW46IHRoaXMucGVlaygpLmxleGVtZSB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIGBFeHBlY3RlZCBcIn1cIiBhZnRlciBvYmplY3QgbGl0ZXJhbGApO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkocHJvcGVydGllcywgbGVmdEJyYWNlLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgdmFsdWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGNvbnN0IGxlZnRCcmFja2V0ID0gdGhpcy5wcmV2aW91cygpO1xuXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXN0KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCxcbiAgICAgIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhcnJheSBkZWNsYXJhdGlvbmBcbiAgICApO1xuICAgIHJldHVybiBuZXcgRXhwci5MaXN0KHZhbHVlcywgbGVmdEJyYWNrZXQubGluZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpZ2l0KGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gY2hhciA+PSBcIjBcIiAmJiBjaGFyIDw9IFwiOVwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYShjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAoY2hhciA+PSBcImFcIiAmJiBjaGFyIDw9IFwielwiKSB8fCAoY2hhciA+PSBcIkFcIiAmJiBjaGFyIDw9IFwiWlwiKSB8fCBjaGFyID09PSBcIiRcIiB8fCBjaGFyID09PSBcIl9cIlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYU51bWVyaWMoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0FscGhhKGNoYXIpIHx8IGlzRGlnaXQoY2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzS2V5d29yZCh3b3JkOiBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBUb2tlblR5cGVbd29yZF0gPj0gVG9rZW5UeXBlLkFuZDtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XG4gIC8qKiBwb2ludHMgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgLyoqIHBvaW50cyB0byB0aGUgc3RhcnQgb2YgdGhlIHRva2VuICAqL1xuICBwcml2YXRlIHN0YXJ0OiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGxpbmUgb2Ygc291cmNlIGNvZGUgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgbGluZTogbnVtYmVyO1xuICAvKiogY3VycmVudCBjb2x1bW4gb2YgdGhlIGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjb2w6IG51bWJlcjtcblxuICBwdWJsaWMgc2Nhbihzb3VyY2U6IHN0cmluZyk6IFRva2VuW10ge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcbiAgICB9XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4oVG9rZW5UeXBlLkVvZiwgXCJcIiwgbnVsbCwgdGhpcy5saW5lLCAwKSk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiXFxuXCIpIHtcbiAgICAgIHRoaXMubGluZSsrO1xuICAgICAgdGhpcy5jb2wgPSAwO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB0aGlzLmNvbCsrO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRva2VuKHRva2VuVHlwZTogVG9rZW5UeXBlLCBsaXRlcmFsOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4odG9rZW5UeXBlLCB0ZXh0LCBsaXRlcmFsLCB0aGlzLmxpbmUsIHRoaXMuY29sKSk7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKGV4cGVjdGVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrTmV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgKyAxID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50ICsgMSk7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBcIlxcblwiICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG11bHRpbGluZUNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpICYmICEodGhpcy5wZWVrKCkgPT09IFwiKlwiICYmIHRoaXMucGVla05leHQoKSA9PT0gXCIvXCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTlRFUk1JTkFURURfQ09NTUVOVCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTlRFUk1JTkFURURfU1RSSU5HLCB7IHF1b3RlOiBxdW90ZSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgY2xvc2luZyBcIi5cbiAgICB0aGlzLmFkdmFuY2UoKTtcblxuICAgIC8vIFRyaW0gdGhlIHN1cnJvdW5kaW5nIHF1b3Rlcy5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0ICsgMSwgdGhpcy5jdXJyZW50IC0gMSk7XG4gICAgdGhpcy5hZGRUb2tlbihxdW90ZSAhPT0gXCJgXCIgPyBUb2tlblR5cGUuU3RyaW5nIDogVG9rZW5UeXBlLlRlbXBsYXRlLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIG51bWJlcigpOiB2b2lkIHtcbiAgICAvLyBnZXRzIGludGVnZXIgcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBmcmFjdGlvblxuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCIuXCIgJiYgVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWtOZXh0KCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBnZXRzIGZyYWN0aW9uIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZXhwb25lbnRcbiAgICBpZiAodGhpcy5wZWVrKCkudG9Mb3dlckNhc2UoKSA9PT0gXCJlXCIpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgaWYgKHRoaXMucGVlaygpID09PSBcIi1cIiB8fCB0aGlzLnBlZWsoKSA9PT0gXCIrXCIpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLk51bWJlciwgTnVtYmVyKHZhbHVlKSk7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoKTogdm9pZCB7XG4gICAgd2hpbGUgKFV0aWxzLmlzQWxwaGFOdW1lcmljKHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICBjb25zdCBjYXBpdGFsaXplZCA9IFV0aWxzLmNhcGl0YWxpemUodmFsdWUpIGFzIGtleW9mIHR5cGVvZiBUb2tlblR5cGU7XG4gICAgaWYgKFV0aWxzLmlzS2V5d29yZChjYXBpdGFsaXplZCkpIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlW2NhcGl0YWxpemVkXSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5JZGVudGlmaWVyLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRUb2tlbigpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFyID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICBjYXNlIFwiKFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIpXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJbXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIixcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ29tbWEsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlNlbWljb2xvbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuVGlsZGUsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJeXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNhcmV0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiOlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkNvbG9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlN0YXJFcXVhbCA6IFRva2VuVHlwZS5TdGFyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlBlcmNlbnRFcXVhbCA6IFRva2VuVHlwZS5QZXJjZW50LFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5QaXBlbGluZSA6XG4gICAgICAgICAgVG9rZW5UeXBlLlBpcGUsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIiZcIikgPyBUb2tlblR5cGUuQW5kIDogVG9rZW5UeXBlLkFtcGVyc2FuZCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5SaWdodFNoaWZ0IDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5HcmVhdGVyRXF1YWwgOiBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiFcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5CYW5nRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiK1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTWludXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIjxcIikgPyBUb2tlblR5cGUuTGVmdFNoaWZ0IDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPlwiKVxuICAgICAgICAgICAgICA/IFRva2VuVHlwZS5MZXNzRXF1YWxHcmVhdGVyXG4gICAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3NFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3REb3QsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3QsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3QsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIvXCIpKSB7XG4gICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIipcIikpIHtcbiAgICAgICAgICB0aGlzLm11bHRpbGluZUNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU2xhc2hFcXVhbCA6IFRva2VuVHlwZS5TbGFzaCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBgJ2A6XG4gICAgICBjYXNlIGBcImA6XG4gICAgICBjYXNlIFwiYFwiOlxuICAgICAgICB0aGlzLnN0cmluZyhjaGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBpZ25vcmUgY2FzZXNcbiAgICAgIGNhc2UgXCJcXG5cIjpcbiAgICAgIGNhc2UgXCIgXCI6XG4gICAgICBjYXNlIFwiXFxyXCI6XG4gICAgICBjYXNlIFwiXFx0XCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY29tcGxleCBjYXNlc1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFV0aWxzLmlzRGlnaXQoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLm51bWJlcigpO1xuICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzQWxwaGEoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLmlkZW50aWZpZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9DSEFSQUNURVIsIHsgY2hhcjogY2hhciB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnkgPSB7fSk6IHZvaWQge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgcHVibGljIHZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgcHVibGljIHBhcmVudDogU2NvcGU7XG5cbiAgY29uc3RydWN0b3IocGFyZW50PzogU2NvcGUsIGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlc1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXNba2V5XTtcbiAgICB9XG5cbiAgICBjb25zdCAkaW1wb3J0cyA9ICh0aGlzLnZhbHVlcz8uY29uc3RydWN0b3IgYXMgYW55KT8uJGltcG9ydHM7XG4gICAgaWYgKCRpbXBvcnRzICYmIHR5cGVvZiAkaW1wb3J0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gJGltcG9ydHNba2V5XTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93W2tleSBhcyBrZXlvZiB0eXBlb2Ygd2luZG93XTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJwcmV0ZXIgaW1wbGVtZW50cyBFeHByLkV4cHJWaXNpdG9yPGFueT4ge1xuICBwdWJsaWMgc2NvcGUgPSBuZXcgU2NvcGUoKTtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG5cbiAgcHVibGljIGV2YWx1YXRlKGV4cHI6IEV4cHIuRXhwcik6IGFueSB7XG4gICAgcmV0dXJuIChleHByLnJlc3VsdCA9IGV4cHIuYWNjZXB0KHRoaXMpKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBpcGVsaW5lRXhwcihleHByOiBFeHByLlBpcGVsaW5lKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5DYWxsKSB7XG4gICAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQuY2FsbGVlKTtcbiAgICAgIGNvbnN0IGFyZ3MgPSBbdmFsdWVdO1xuICAgICAgZm9yIChjb25zdCBhcmcgb2YgZXhwci5yaWdodC5hcmdzKSB7XG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmcgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChleHByLnJpZ2h0LmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5yaWdodC5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0IGZuID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICByZXR1cm4gZm4odmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXJyb3dGdW5jdGlvbkV4cHIoZXhwcjogRXhwci5BcnJvd0Z1bmN0aW9uKTogYW55IHtcbiAgICBjb25zdCBjYXB0dXJlZFNjb3BlID0gdGhpcy5zY29wZTtcbiAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gdGhpcy5zY29wZTtcbiAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGUoY2FwdHVyZWRTY29wZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cHIucGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucGFyYW1zW2ldLmxleGVtZSwgYXJnc1tpXSk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmJvZHkpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcik6IHZvaWQge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCBsaW5lLCBjb2wpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IEV4cHIuVmFyaWFibGUpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnNjb3BlLmdldChleHByLm5hbWUubGV4ZW1lKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFzc2lnbkV4cHIoZXhwcjogRXhwci5Bc3NpZ24pOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0S2V5RXhwcihleHByOiBFeHByLktleSk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIubmFtZS5saXRlcmFsO1xuICB9XG5cbiAgcHVibGljIHZpc2l0R2V0RXhwcihleHByOiBFeHByLkdldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgaWYgKCFlbnRpdHkgJiYgZXhwci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHlba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNldEV4cHIoZXhwcjogRXhwci5TZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBlbnRpdHlba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IEV4cHIuUG9zdGZpeCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlICsgZXhwci5pbmNyZW1lbnQ7XG5cbiAgICBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICB0aGlzLnNjb3BlLnNldChleHByLmVudGl0eS5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICBleHByLmVudGl0eS5lbnRpdHksXG4gICAgICAgIGV4cHIuZW50aXR5LmtleSxcbiAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuSU5WQUxJRF9QT1NURklYX0xWQUxVRSwgeyBlbnRpdHk6IGV4cHIuZW50aXR5IH0sIGV4cHIubGluZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgdmFsdWVzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoZXhwcmVzc2lvbiBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U3ByZWFkRXhwcihleHByOiBFeHByLlNwcmVhZCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHRlbXBsYXRlUGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBFeHByLlRlbXBsYXRlKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSBleHByLnZhbHVlLnJlcGxhY2UoXG4gICAgICAvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVQYXJzZShwbGFjZWhvbGRlcik7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0QmluYXJ5RXhwcihleHByOiBFeHByLkJpbmFyeSk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAtIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2g6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnQ6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50RXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICUgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGlwZTpcbiAgICAgICAgcmV0dXJuIGxlZnQgfCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkNhcmV0OlxuICAgICAgICByZXR1cm4gbGVmdCBeIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlcjpcbiAgICAgICAgcmV0dXJuIGxlZnQgPiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzOlxuICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzc0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA8PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbnN0YW5jZW9mOlxuICAgICAgICByZXR1cm4gbGVmdCBpbnN0YW5jZW9mIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuSW46XG4gICAgICAgIHJldHVybiBsZWZ0IGluIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVmdFNoaWZ0OlxuICAgICAgICByZXR1cm4gbGVmdCA8PCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlJpZ2h0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0ID4+IHJpZ2h0O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOS05PV05fQklOQVJZX09QRVJBVE9SLCB7IG9wZXJhdG9yOiBleHByLm9wZXJhdG9yIH0sIGV4cHIubGluZSk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IEV4cHIuTG9naWNhbCk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5Pcikge1xuICAgICAgaWYgKGxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IEV4cHIuVGVybmFyeSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5jb25kaXRpb24pXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmIChsZWZ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBFeHByLkdyb3VwaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogRXhwci5MaXRlcmFsKTogYW55IHtcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFVuYXJ5RXhwcihleHByOiBFeHByLlVuYXJ5KTogYW55IHtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgICByZXR1cm4gLXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZzpcbiAgICAgICAgcmV0dXJuICFyaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlRpbGRlOlxuICAgICAgICByZXR1cm4gfnJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgICBOdW1iZXIocmlnaHQpICsgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlBsdXNQbHVzID8gMSA6IC0xKTtcbiAgICAgICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5yaWdodC5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgICAgIGV4cHIucmlnaHQuZW50aXR5LFxuICAgICAgICAgICAgZXhwci5yaWdodC5rZXksXG4gICAgICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICAgIEtFcnJvckNvZGUuSU5WQUxJRF9QUkVGSVhfUlZBTFVFLFxuICAgICAgICAgICAgeyByaWdodDogZXhwci5yaWdodCB9LFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5LTk9XTl9VTkFSWV9PUEVSQVRPUiwgeyBvcGVyYXRvcjogZXhwci5vcGVyYXRvciB9LCBleHByLmxpbmUpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gc2hvdWxkIGJlIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q2FsbEV4cHIoZXhwcjogRXhwci5DYWxsKTogYW55IHtcbiAgICAvLyB2ZXJpZnkgY2FsbGVlIGlzIGEgZnVuY3Rpb25cbiAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2FsbGVlKTtcbiAgICBpZiAoY2FsbGVlID09IG51bGwgJiYgZXhwci5vcHRpb25hbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIGNhbGxlZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTk9UX0FfRlVOQ1RJT04sIHsgY2FsbGVlOiBjYWxsZWUgfSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgLy8gZXZhbHVhdGUgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgY29uc3QgYXJncyA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJndW1lbnQgb2YgZXhwci5hcmdzKSB7XG4gICAgICBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJndW1lbnQgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmd1bWVudCkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBleGVjdXRlIGZ1bmN0aW9uIOKAlCBwcmVzZXJ2ZSBgdGhpc2AgZm9yIG1ldGhvZCBjYWxsc1xuICAgIGlmIChleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShleHByLmNsYXp6KTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgS0Vycm9yQ29kZS5OT1RfQV9DTEFTUyxcbiAgICAgICAgeyBjbGF6ejogY2xhenogfSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgZXhwci5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChwcm9wZXJ0eSBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGljdCwgdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkua2V5KTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50S05vZGUoa25vZGU6IEVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlS05vZGUoa25vZGU6IEF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRUZXh0S05vZGUoa25vZGU6IFRleHQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0Q29tbWVudEtOb2RlKGtub2RlOiBDb21tZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdERvY3R5cGVLTm9kZShrbm9kZTogRG9jdHlwZSwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IEtOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBzZWxmOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBLTm9kZVtdLCBjaGlsZHJlbjogS05vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0VPRiwgeyBlb2ZFcnJvcjogZW9mRXJyb3IgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2soY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9KTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgdGhpcy5saW5lLCB0aGlzLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIG5vZGUoKTogTm9kZS5LTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuS05vZGU7XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9DTE9TSU5HX1RBRyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IS0tXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5jb21tZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPCFkb2N0eXBlXCIpIHx8IHRoaXMubWF0Y2goXCI8IURPQ1RZUEVcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmRvY3R5cGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8XCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5lbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDMpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Db21tZW50KGNvbW1lbnQsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRvY3R5cGUoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY2xvc2luZyBkb2N0eXBlXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGA+YCkpO1xuICAgIGNvbnN0IGRvY3R5cGUgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSkudHJpbSgpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Eb2N0eXBlKGRvY3R5cGUsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGVsZW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiL1wiLCBcIj5cIik7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfVEFHX05BTUUpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXCIvPlwiKSB8fFxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIFtdLCB0cnVlLCB0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX0JSQUNLRVQpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWF0Y2goYCR7bmFtZX1gKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogcGFyZW50IH0pO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRyaWJ1dGVzKCk6IE5vZGUuQXR0cmlidXRlW10ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIj5cIiwgXCIvPlwiKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIj1cIiwgXCI+XCIsIFwiLz5cIik7XG4gICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkJMQU5LX0FUVFJJQlVURV9OQU1FKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKFwiJ1wiKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZygnXCInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChcInt7XCIpKSB7IGRlcHRoKys7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPiAwICYmIHRoaXMubWF0Y2goXCJ9fVwiKSkgeyBkZXB0aC0tOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmIHRoaXMucGVlayhcIjxcIikpIHsgYnJlYWs7IH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCFyYXcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0aGlzLmRlY29kZUVudGl0aWVzKHJhdyksIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVFbnRpdGllcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiXFx1MDBhMFwiKVxuICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgIC5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcbiAgICAgIC5yZXBsYWNlKC8mYXBvczsvZywgXCInXCIpXG4gICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpOyAvLyBtdXN0IGJlIGxhc3QgdG8gYXZvaWQgZG91YmxlLWRlY29kaW5nXG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENsYXNzIH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm91dGVDb25maWcge1xuICBwYXRoOiBzdHJpbmc7XG4gIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gIGd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBcIlwiLCBwYXRoKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFBvcFN0YXRlRXZlbnQoXCJwb3BzdGF0ZVwiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaFBhdGgocGF0dGVybjogc3RyaW5nLCBwYXRobmFtZTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICBpZiAocGF0dGVybiA9PT0gXCIqXCIpIHJldHVybiB7fTtcbiAgY29uc3QgcGF0dGVyblBhcnRzID0gcGF0dGVybi5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBwYXRoUGFydHMgPSBwYXRobmFtZS5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAocGF0dGVyblBhcnRzLmxlbmd0aCAhPT0gcGF0aFBhcnRzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm5QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwYXR0ZXJuUGFydHNbaV0uc3RhcnRzV2l0aChcIjpcIikpIHtcbiAgICAgIHBhcmFtc1twYXR0ZXJuUGFydHNbaV0uc2xpY2UoMSldID0gcGF0aFBhcnRzW2ldO1xuICAgIH0gZWxzZSBpZiAocGF0dGVyblBhcnRzW2ldICE9PSBwYXRoUGFydHNbaV0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgY2xhc3MgUm91dGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcHJpdmF0ZSByb3V0ZXM6IFJvdXRlQ29uZmlnW10gPSBbXTtcblxuICBzZXRSb3V0ZXMocm91dGVzOiBSb3V0ZUNvbmZpZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXM7XG4gIH1cblxuICBvbk1vdW50KCk6IHZvaWQge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgKCkgPT4gdGhpcy5fbmF2aWdhdGUoKSwge1xuICAgICAgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgIH0pO1xuICAgIHRoaXMuX25hdmlnYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9uYXZpZ2F0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHRoaXMucm91dGVzKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBtYXRjaFBhdGgocm91dGUucGF0aCwgcGF0aG5hbWUpO1xuICAgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBpZiAocm91dGUuZ3VhcmQpIHtcbiAgICAgICAgY29uc3QgYWxsb3dlZCA9IGF3YWl0IHJvdXRlLmd1YXJkKCk7XG4gICAgICAgIGlmICghYWxsb3dlZCkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fbW91bnQocm91dGUuY29tcG9uZW50LCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX21vdW50KENvbXBvbmVudENsYXNzOiBDb21wb25lbnRDbGFzcywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMucmVmIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICghZWxlbWVudCB8fCAhdGhpcy50cmFuc3BpbGVyKSByZXR1cm47XG4gICAgdGhpcy50cmFuc3BpbGVyLm1vdW50Q29tcG9uZW50KENvbXBvbmVudENsYXNzLCBlbGVtZW50LCBwYXJhbXMpO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQm91bmRhcnkge1xuICBwcml2YXRlIHN0YXJ0OiBDb21tZW50O1xuICBwcml2YXRlIGVuZDogQ29tbWVudDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IE5vZGUsIGxhYmVsOiBzdHJpbmcgPSBcImJvdW5kYXJ5XCIpIHtcbiAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tc3RhcnRgKTtcbiAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LWVuZGApO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0KTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5lbmQpO1xuICB9XG5cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgY29uc3QgdG9SZW1vdmUgPSBjdXJyZW50O1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICB0b1JlbW92ZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZCh0b1JlbW92ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc2VydChub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5lbmQucGFyZW50Tm9kZT8uaW5zZXJ0QmVmb3JlKG5vZGUsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBub2RlcygpOiBOb2RlW10ge1xuICAgIGNvbnN0IHJlc3VsdDogTm9kZVtdID0gW107XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICByZXN1bHQucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJlbnQoKTogTm9kZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnBhcmVudE5vZGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuXG50eXBlIFRhc2sgPSAoKSA9PiB2b2lkO1xuXG5jb25zdCBxdWV1ZSA9IG5ldyBNYXA8Q29tcG9uZW50LCBUYXNrW10+KCk7XG5jb25zdCBuZXh0VGlja0NhbGxiYWNrczogVGFza1tdID0gW107XG5sZXQgaXNTY2hlZHVsZWQgPSBmYWxzZTtcbmxldCBiYXRjaGluZ0VuYWJsZWQgPSB0cnVlO1xuXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgaXNTY2hlZHVsZWQgPSBmYWxzZTtcblxuICAvLyAxLiBQcm9jZXNzIGNvbXBvbmVudCB1cGRhdGVzXG4gIGZvciAoY29uc3QgW2luc3RhbmNlLCB0YXNrc10gb2YgcXVldWUuZW50cmllcygpKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbGwgcHJlLXVwZGF0ZSBob29rIChvbmx5IGZvciByZWFjdGl2ZSB1cGRhdGVzLCBub3QgZmlyc3QgbW91bnQpXG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uQ2hhbmdlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGluc3RhbmNlLm9uQ2hhbmdlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBSdW4gYWxsIHN1cmdpY2FsIERPTSB1cGRhdGVzIGZvciB0aGlzIGNvbXBvbmVudFxuICAgICAgZm9yIChjb25zdCB0YXNrIG9mIHRhc2tzKSB7XG4gICAgICAgIHRhc2soKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FsbCBwb3N0LXVwZGF0ZSBob29rXG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW0thc3Blcl0gRXJyb3IgZHVyaW5nIGNvbXBvbmVudCB1cGRhdGU6XCIsIGUpO1xuICAgIH1cbiAgfVxuICBxdWV1ZS5jbGVhcigpO1xuXG4gIC8vIDIuIFByb2Nlc3MgbmV4dFRpY2sgY2FsbGJhY2tzXG4gIGNvbnN0IGNhbGxiYWNrcyA9IG5leHRUaWNrQ2FsbGJhY2tzLnNwbGljZSgwKTtcbiAgZm9yIChjb25zdCBjYiBvZiBjYWxsYmFja3MpIHtcbiAgICB0cnkge1xuICAgICAgY2IoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW0thc3Blcl0gRXJyb3IgaW4gbmV4dFRpY2sgY2FsbGJhY2s6XCIsIGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVldWVVcGRhdGUoaW5zdGFuY2U6IENvbXBvbmVudCwgdGFzazogVGFzaykge1xuICBpZiAoIWJhdGNoaW5nRW5hYmxlZCkge1xuICAgIHRhc2soKTtcbiAgICAvLyBEdXJpbmcgc3luYyBtb3VudCwgd2UgZG9uJ3QgY2FsbCBvbkNoYW5nZXMgb3Igb25SZW5kZXIgaGVyZS5cbiAgICAvLyBvblJlbmRlciBpcyBjYWxsZWQgbWFudWFsbHkgYXQgdGhlIGVuZCBvZiB0cmFuc3BpbGUvYm9vdHN0cmFwLlxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghcXVldWUuaGFzKGluc3RhbmNlKSkge1xuICAgIHF1ZXVlLnNldChpbnN0YW5jZSwgW10pO1xuICB9XG4gIHF1ZXVlLmdldChpbnN0YW5jZSkhLnB1c2godGFzayk7XG5cbiAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIHdpdGggYmF0Y2hpbmcgZGlzYWJsZWQuIFxuICogVXNlZCBmb3IgaW5pdGlhbCBtb3VudCBhbmQgbWFudWFsIHJlbmRlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbHVzaFN5bmMoZm46ICgpID0+IHZvaWQpIHtcbiAgY29uc3QgcHJldiA9IGJhdGNoaW5nRW5hYmxlZDtcbiAgYmF0Y2hpbmdFbmFibGVkID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBiYXRjaGluZ0VuYWJsZWQgPSBwcmV2O1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciB0aGUgbmV4dCBmcmFtZXdvcmsgdXBkYXRlIGN5Y2xlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soKTogUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYjogVGFzayk6IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2I/OiBUYXNrKTogUHJvbWlzZTx2b2lkPiB8IHZvaWQge1xuICBpZiAoY2IpIHtcbiAgICBuZXh0VGlja0NhbGxiYWNrcy5wdXNoKGNiKTtcbiAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIG5leHRUaWNrQ2FsbGJhY2tzLnB1c2gocmVzb2x2ZSk7XG4gICAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgcXVldWVNaWNyb3Rhc2soZmx1c2gpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRDbGFzcywgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZUNvbmZpZyB9IGZyb20gXCIuL3JvdXRlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IGVmZmVjdCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgQm91bmRhcnkgfSBmcm9tIFwiLi9ib3VuZGFyeVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IHF1ZXVlVXBkYXRlLCBmbHVzaFN5bmMgfSBmcm9tIFwiLi9zY2hlZHVsZXJcIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG5jb25zdCBLRVlfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gIGVzYzogW1wiRXNjYXBlXCIsIFwiRXNjXCJdLFxuICBlc2NhcGU6IFtcIkVzY2FwZVwiLCBcIkVzY1wiXSxcbiAgc3BhY2U6IFtcIiBcIiwgXCJTcGFjZWJhclwiXSxcbiAgdXA6IFtcIkFycm93VXBcIiwgXCJVcFwiXSxcbiAgZG93bjogW1wiQXJyb3dEb3duXCIsIFwiRG93blwiXSxcbiAgbGVmdDogW1wiQXJyb3dMZWZ0XCIsIFwiTGVmdFwiXSxcbiAgcmlnaHQ6IFtcIkFycm93UmlnaHRcIiwgXCJSaWdodFwiXSxcbiAgZGVsOiBbXCJEZWxldGVcIiwgXCJEZWxcIl0sXG4gIGRlbGV0ZTogW1wiRGVsZXRlXCIsIFwiRGVsXCJdLFxuICBpbnM6IFtcIkluc2VydFwiXSxcbiAgZG90OiBbXCIuXCJdLFxuICBjb21tYTogW1wiLFwiXSxcbiAgc2xhc2g6IFtcIi9cIl0sXG4gIGJhY2tzbGFzaDogW1wiXFxcXFwiXSxcbiAgcGx1czogW1wiK1wiXSxcbiAgbWludXM6IFtcIi1cIl0sXG4gIGVxdWFsOiBbXCI9XCJdLFxufTtcblxudHlwZSBJZkVsc2VOb2RlID0gW0tOb2RlLkVsZW1lbnQsIEtOb2RlLkF0dHJpYnV0ZV07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XG4gIHByaXZhdGUgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5ID0ge307XG4gIHB1YmxpYyBtb2RlOiBcImRldmVsb3BtZW50XCIgfCBcInByb2R1Y3Rpb25cIiA9IFwiZGV2ZWxvcG1lbnRcIjtcbiAgcHJpdmF0ZSBpc1JlbmRlcmluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiB7IHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSB9KSB7XG4gICAgdGhpcy5yZWdpc3RyeVtcInJvdXRlclwiXSA9IHsgY29tcG9uZW50OiBSb3V0ZXIsIG5vZGVzOiBbXSB9O1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuO1xuICAgIGlmIChvcHRpb25zLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0geyAuLi50aGlzLnJlZ2lzdHJ5LCAuLi5vcHRpb25zLnJlZ2lzdHJ5IH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcbiAgICAgIGNvbnN0IG1pc3BsYWNlZCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlbHNlaWZcIiwgXCJAZWxzZVwiXSk7XG4gICAgICBpZiAobWlzcGxhY2VkKSB7XG4gICAgICAgIC8vIFRoZXNlIGFyZSBoYW5kbGVkIGJ5IGRvSWYsIGlmIHdlIHJlYWNoIHRoZW0gaGVyZSBpdCdzIGFuIGVycm9yXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtaXNwbGFjZWQubmFtZS5zdGFydHNXaXRoKFwiQFwiKSA/IG1pc3BsYWNlZC5uYW1lLnNsaWNlKDEpIDogbWlzcGxhY2VkLm5hbWU7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNQTEFDRURfQ09ORElUSU9OQUwsIHsgbmFtZTogbmFtZSB9LCBlbC5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbm9kZS5hY2NlcHQodGhpcywgcGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZE1ldGhvZHMoZW50aXR5OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0eSB8fCB0eXBlb2YgZW50aXR5ICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZW50aXR5KTtcbiAgICB3aGlsZSAocHJvdG8gJiYgcHJvdG8gIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywga2V5KT8uZ2V0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBldmFsdWF0ZXMgZXhwcmVzc2lvbnMgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgZmlyc3QgZXZhbHVhdGlvblxuICBwcml2YXRlIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcsIG92ZXJyaWRlU2NvcGU/OiBTY29wZSk6IGFueSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRyYW5zcGlsZShcbiAgICBub2RlczogS05vZGUuS05vZGVbXSxcbiAgICBlbnRpdHk6IGFueSxcbiAgICBjb250YWluZXI6IEVsZW1lbnRcbiAgKTogTm9kZSB7XG4gICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICB0aGlzLmJpbmRNZXRob2RzKGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLmluaXQoZW50aXR5KTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGVudGl0eSk7XG4gICAgICBcbiAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMudHJpZ2dlclJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsICgpID0+IHtcbiAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbmV3VmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QodGV4dCwgc3RvcCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYXR0ci52YWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGF0dHIsIHN0b3ApO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChyZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja0VmZmVjdCh0YXJnZXQ6IGFueSwgc3RvcDogYW55KSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICBcbiAgICAgIGNvbnN0IHRyYWNraW5nU2NvcGUgPSBpbnN0YW5jZSA/IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKSA6IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICBjb25zdCBwcmV2U2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG5cbiAgICAgIC8vIEV2YWx1YXRlIGNvbmRpdGlvbnMgc3luY2hyb25vdXNseSB0byBlbnN1cmUgc2lnbmFsIHRyYWNraW5nXG4gICAgICBjb25zdCByZXN1bHRzOiBib29sZWFuW10gPSBbXTtcbiAgICAgIHJlc3VsdHMucHVzaCghIXRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvbnNbMF1bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSkpO1xuICAgICAgXG4gICAgICBpZiAoIXJlc3VsdHNbMF0pIHtcbiAgICAgICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZWlmXCJdKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2godmFsKTtcbiAgICAgICAgICAgIGlmICh2YWwpIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlXCJdKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XG4gICAgICAgICAgICBleHByZXNzaW9uc1swXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzW2ldKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zW2ldWzBdLmFjY2VwdCh0aGlzLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gcnVuO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuICAgIGlmIChrZXlBdHRyKSB7XG4gICAgICB0aGlzLmRvRWFjaEtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCwga2V5QXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9FYWNoVW5rZXllZChlYWNoLCBub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoVW5rZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChrZXkpIHNjb3BlVmFsdWVzW2tleV0gPSBpbmRleDtcblxuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUmVmcmVzaChub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgLy8gMS4gUmUtcnVuIHN0cnVjdHVyYWwgbG9naWMgKGlmL2VhY2gvd2hpbGUpXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlclJlZnJlc2gpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlclJlZnJlc2goKTtcbiAgICB9XG4gICAgXG4gICAgLy8gMi4gUmUtcnVuIGFsbCBzdXJnaWNhbCBlZmZlY3RzICh0ZXh0IGludGVycG9sYXRpb24sIGF0dHJpYnV0ZXMsIGV0Yy4pXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0b3AucnVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnRyaWdnZXJSZWZyZXNoKGNoaWxkKSk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBpbmRleEtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXMgaW1tZWRpYXRlbHlcbiAgICAgIGNvbnN0IG5ld0l0ZW1zOiBBcnJheTx7IGl0ZW06IGFueTsgaWR4OiBudW1iZXI7IGtleTogYW55IH0+ID0gW107XG4gICAgICBjb25zdCBzZWVuS2V5cyA9IG5ldyBTZXQoKTtcbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIHNlZW5LZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBbS2FzcGVyXSBEdXBsaWNhdGUga2V5IGRldGVjdGVkIGluIEBlYWNoOiBcIiR7a2V5fVwiLiBLZXlzIG11c3QgYmUgdW5pcXVlIHRvIGVuc3VyZSBjb3JyZWN0IHJlY29uY2lsaWF0aW9uLmApO1xuICAgICAgICB9XG4gICAgICAgIHNlZW5LZXlzLmFkZChrZXkpO1xuXG4gICAgICAgIG5ld0l0ZW1zLnB1c2goeyBpdGVtOiBpdGVtLCBpZHg6IGluZGV4LCBrZXk6IGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBkb21Ob2RlXSBvZiBrZXllZE5vZGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgeyBpdGVtLCBpZHgsIGtleSB9IG9mIG5ld0l0ZW1zKSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG5cbiAgICAgICAgICBpZiAoa2V5ZWROb2Rlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgY29uc3QgZG9tTm9kZSA9IGtleWVkTm9kZXMuZ2V0KGtleSkhO1xuICAgICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGRvbU5vZGUpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgc2NvcGUgYW5kIHRyaWdnZXIgcmUtcmVuZGVyIG9mIG5lc3RlZCBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXNcbiAgICAgICAgICAgIGNvbnN0IG5vZGVTY29wZSA9IChkb21Ob2RlIGFzIGFueSkuJGthc3BlclNjb3BlO1xuICAgICAgICAgICAgaWYgKG5vZGVTY29wZSkge1xuICAgICAgICAgICAgICBub2RlU2NvcGUuc2V0KG5hbWUsIGl0ZW0pO1xuICAgICAgICAgICAgICBpZiAoaW5kZXhLZXkpIG5vZGVTY29wZS5zZXQoaW5kZXhLZXksIGlkeCk7XG5cbiAgICAgICAgICAgICAgLy8gSWYgaXQgaGFzIGl0cyBvd24gcmVuZGVyIGxvZ2ljIChuZXN0ZWQgZWFjaC9pZiksIHRyaWdnZXIgaXQgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyUmVmcmVzaChkb21Ob2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgaWYgKGNyZWF0ZWQpIHtcbiAgICAgICAgICAgICAga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHNjb3BlIG9uIHRoZSBET00gbm9kZSBzbyB3ZSBjYW4gdXBkYXRlIGl0IGxhdGVyXG4gICAgICAgICAgICAgIChjcmVhdGVkIGFzIGFueSkuJGthc3BlclNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZVNpYmxpbmdzKG5vZGVzOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSAwO1xuICAgIGNvbnN0IGluaXRpYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgbGV0IGdyb3VwU2NvcGU6IFNjb3BlIHwgbnVsbCA9IG51bGw7XG5cbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcblxuICAgICAgICAvLyAxLiBQcm9jZXNzIEBsZXQgKGxlYWtzIHRvIHNpYmxpbmdzIGFuZCBhdmFpbGFibGUgdG8gb3RoZXIgZGlyZWN0aXZlcyBvbiB0aGlzIG5vZGUpXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICBpZiAoIWdyb3VwU2NvcGUpIHtcbiAgICAgICAgICAgIGdyb3VwU2NvcGUgPSBuZXcgU2NvcGUoaW5pdGlhbFNjb3BlKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBncm91cFNjb3BlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmV4ZWN1dGUoJGxldC52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAyLiBWYWxpZGF0aW9uOiBTdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgICBjb25zdCBpZkF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAaWZcIl0pO1xuICAgICAgICBjb25zdCBlbHNlaWZBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VpZlwiXSk7XG4gICAgICAgIGNvbnN0IGVsc2VBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VcIl0pO1xuICAgICAgICBjb25zdCAkZWFjaCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlYWNoXCJdKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlID09PSBcImRldmVsb3BtZW50XCIpIHtcbiAgICAgICAgICBjb25zdCBzdHJ1Y3R1cmFsQ291bnQgPSBbaWZBdHRyLCBlbHNlaWZBdHRyLCBlbHNlQXR0ciwgJGVhY2hdLmZpbHRlcihhID0+IGEpLmxlbmd0aDtcbiAgICAgICAgICBpZiAoc3RydWN0dXJhbENvdW50ID4gMSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUywge30sIGVsLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIFByb2Nlc3Mgc3RydWN0dXJhbCBkaXJlY3RpdmVzIChvbmUgd2lsbCBtYXRjaCBhbmQgY29udGludWUpXG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBlbCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWZBdHRyKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbZWwsIGlmQXR0cl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxuICAgICAgICAgICAgICBcIkBlbHNlaWZcIixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChbbm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgYXR0cl0pO1xuICAgICAgICAgICAgICBjdXJyZW50ICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gaW5pdGlhbFNjb3BlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJzbG90XCIpIHtcbiAgICAgICAgY29uc3QgbmFtZUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBuYW1lXCJdKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVBdHRyID8gbmFtZUF0dHIudmFsdWUgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgY29uc3Qgc2xvdHMgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRzbG90c1wiKTtcbiAgICAgICAgaWYgKHNsb3RzICYmIHNsb3RzW25hbWVdKSB7XG4gICAgICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgLy8gUmVzdG9yZSB0aGUgc2NvcGUgd2hlcmUgdGhlIHNsb3QgY29udGVudCB3YXMgZGVmaW5lZCAoTGV4aWNhbCBTY29waW5nKS5cbiAgICAgICAgICAvLyBXZSBzdG9yZSB0aGUgc2NvcGUgcmVmZXJlbmNlIGRpcmVjdGx5IG9uIHRoZSBBcnJheSBpbnN0YW5jZSB0byBhdm9pZCBjaGFuZ2luZyBzaWduYXR1cmVzLlxuICAgICAgICAgIGlmIChzbG90c1tuYW1lXS5zY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNsb3RzW25hbWVdLnNjb3BlO1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Moc2xvdHNbbmFtZV0sIHBhcmVudCk7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNWb2lkID0gbm9kZS5uYW1lID09PSBcInZvaWRcIjtcbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gISF0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBpc1ZvaWQgPyBwYXJlbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSk7XG4gICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCBzY29wZVxuICAgICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSB7fTtcbiAgICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBjaGlsZHJlbiBmb3Igc2xvdHMuIFxuICAgICAgICAvLyBXZSB1c2UgYSBwbGFpbiBvYmplY3Qga2V5ZWQgYnkgc2xvdCBuYW1lLiBFYWNoIHZhbHVlIGlzIGFuIEFycmF5IG9mIEtOb2Rlcy5cbiAgICAgICAgLy8gVG8gc3VwcG9ydCBsZXhpY2FsIHNjb3BpbmcsIHdlIGF0dGFjaCB0aGUgY3VycmVudCBzY29wZSB0byB0aGUgQXJyYXkgaW5zdGFuY2UuXG4gICAgICAgIGNvbnN0IHNsb3RzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyBkZWZhdWx0OiBbXSB9O1xuICAgICAgICBzbG90cy5kZWZhdWx0LnNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICBjb25zdCBzbG90QXR0ciA9IHRoaXMuZmluZEF0dHIoY2hpbGQgYXMgS05vZGUuRWxlbWVudCwgW1wiQHNsb3RcIl0pO1xuICAgICAgICAgICAgaWYgKHNsb3RBdHRyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzbG90QXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFzbG90c1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIHNsb3RzW25hbWVdID0gW107XG4gICAgICAgICAgICAgICAgc2xvdHNbbmFtZV0uc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNsb3RzW25hbWVdLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2xvdHMuZGVmYXVsdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0uY29tcG9uZW50KHtcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICByZWY6IGVsZW1lbnQsXG4gICAgICAgICAgICB0cmFuc3BpbGVyOiB0aGlzLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5iaW5kTWV0aG9kcyhjb21wb25lbnQpO1xuICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gY29tcG9uZW50O1xuXG4gICAgICAgICAgY29uc3QgY29tcG9uZW50Tm9kZXMgPSB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMhO1xuICAgICAgICAgIGNvbXBvbmVudC4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3koZWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgICBjb21wb25lbnQuJHNsb3RzID0gc2xvdHM7XG4gICAgICAgICAgICAgIGNvbnN0IHByZXZTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhjb21wb25lbnROb2RlcywgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJyb3V0ZXJcIiAmJiBjb21wb25lbnQgaW5zdGFuY2VvZiBSb3V0ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdXRlU2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgY29tcG9uZW50LnNldFJvdXRlcyh0aGlzLmV4dHJhY3RSb3V0ZXMobm9kZS5jaGlsZHJlbiwgdW5kZWZpbmVkLCByb3V0ZVNjb3BlKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnQub25Nb3VudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFeHBvc2Ugc2xvdHMgaW4gY29tcG9uZW50IHNjb3BlXG4gICAgICAgIGNvbXBvbmVudC4kc2xvdHMgPSBzbG90cztcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXS5ub2RlcyEsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgaWYgKGNvbXBvbmVudCAmJiB0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWb2lkKSB7XG4gICAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgICAgY29uc3QgZXZlbnRzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudCBhcyBLTm9kZS5BdHRyaWJ1dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgZmlyc3QpXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAgIChhdHRyKSA9PiAhKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGF0dHIsIGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvcnRoYW5kIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBzZWNvbmQsIGFsbG93cyBtZXJnaW5nKVxuICAgICAgICBjb25zdCBzaG9ydGhhbmRBdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG5hbWUuc3RhcnRzV2l0aChcIkBcIikgJiZcbiAgICAgICAgICAgICFbXCJAaWZcIiwgXCJAZWxzZWlmXCIsIFwiQGVsc2VcIiwgXCJAZWFjaFwiLCBcIkBsZXRcIiwgXCJAa2V5XCIsIFwiQHJlZlwiXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIikgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzaG9ydGhhbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgcmVhbE5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZkF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkByZWZcIl0pO1xuICAgICAgaWYgKHJlZkF0dHIgJiYgIWlzVm9pZCkge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHJlZkF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KHByb3BOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yICYmIGUuY29kZSA9PT0gS0Vycm9yQ29kZS5SVU5USU1FX0VSUk9SKSB0aHJvdyBlO1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlJVTlRJTUVfRVJST1IsIHsgbWVzc2FnZTogZS5tZXNzYWdlIHx8IGAke2V9YCB9LCBub2RlLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzOiBLTm9kZS5BdHRyaWJ1dGVbXSk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgY29uc3Qga2V5ID0gYXJnLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGtleS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJvblwiKSkge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gYXJnLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgY29uc3QgaXNDYWxsRXhwciA9IC9eW1xcdyQuXVtcXHckLl0qXFxzKlxcKC4qXFwpXFxzKiQvLnRlc3QodHJpbW1lZCkgJiYgIXRyaW1tZWQuaW5jbHVkZXMoXCI9PlwiKTtcbiAgICAgICAgaWYgKGlzQ2FsbEV4cHIpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgW0thc3Blcl0gQDoke2tleX09XCIke2FyZy52YWx1ZX1cIiDigJQgdGhlIGV4cHJlc3Npb24gaXMgY2FsbGVkIGR1cmluZyByZW5kZXIgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgcGFzc2VkIGFzIHRoZSBwcm9wLiBgICtcbiAgICAgICAgICAgIGBJZiBpdCByZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQgZnVuY3Rpb24gYmVjb21lcyB0aGUgaGFuZGxlciAoZmFjdG9yeSBwYXR0ZXJuKS4gYCArXG4gICAgICAgICAgICBgSWYgaXQgcmV0dXJucyB1bmRlZmluZWQsIHRoZSBwcm9wIHJlY2VpdmVzIHVuZGVmaW5lZC4gYCArXG4gICAgICAgICAgICBgSWYgdGhlIGZ1bmN0aW9uIGhhcyByZWFjdGl2ZSBzaWRlIGVmZmVjdHMsIGVuc3VyZSBpdCBkb2VzIG5vdCBib3RoIHJlYWQgYW5kIHdyaXRlIHRoZSBzYW1lIHNpZ25hbC5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmV4ZWN1dGUoYXJnLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBOb2RlLCBhdHRyOiBLTm9kZS5BdHRyaWJ1dGUpOiB2b2lkIHtcbiAgICBjb25zdCBbZXZlbnROYW1lLCAuLi5tb2RpZmllcnNdID0gYXR0ci5uYW1lLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0ge307XG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gICAgfVxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvbmNlXCIpKSAgICBvcHRpb25zLm9uY2UgICAgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKSBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKSBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuXG4gICAgLy8gQW55dGhpbmcgbm90IGluIHRoaXMgbGlzdCBpcyB0cmVhdGVkIGFzIGEgcG90ZW50aWFsIGtleSBtb2RpZmllclxuICAgIGNvbnN0IGNvbnRyb2xNb2RpZmllcnMgPSBbXCJwcmV2ZW50XCIsIFwic3RvcFwiLCBcIm9uY2VcIiwgXCJwYXNzaXZlXCIsIFwiY2FwdHVyZVwiLCBcImN0cmxcIiwgXCJzaGlmdFwiLCBcImFsdFwiLCBcIm1ldGFcIl07XG4gICAgY29uc3QgcG90ZW50aWFsS2V5TW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigobSkgPT4gIWNvbnRyb2xNb2RpZmllcnMuaW5jbHVkZXMobS50b0xvd2VyQ2FzZSgpKSk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBldmVudE5hbWUsXG4gICAgICAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAocG90ZW50aWFsS2V5TW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBtYXRjaGVkID0gcG90ZW50aWFsS2V5TW9kaWZpZXJzLnNvbWUoKG0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyTSA9IG0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChLRVlfTUFQW2xvd2VyTV0gJiYgS0VZX01BUFtsb3dlck1dLmluY2x1ZGVzKGV2ZW50LmtleSkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvd2VyTSA9PT0gZXZlbnQua2V5Py50b0xvd2VyQ2FzZSgpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY3RybFwiKSAmJiAhZXZlbnQuY3RybEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic2hpZnRcIikgJiYgIWV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJhbHRcIikgJiYgIWV2ZW50LmFsdEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibWV0YVwiKSAmJiAhZXZlbnQubWV0YUtleSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwcmV2ZW50XCIpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic3RvcFwiKSkgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGxpc3RlbmVyU2NvcGUuc2V0KFwiJGV2ZW50XCIsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5leGVjdXRlKGF0dHIudmFsdWUsIGxpc3RlbmVyU2NvcGUpO1xuICAgICAgfSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgcmVnZXggPSAvXFx7XFx7LitcXH1cXH0vbXM7XG4gICAgaWYgKHJlZ2V4LnRlc3QodGV4dCkpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLCAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uKHBsYWNlaG9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveU5vZGUobm9kZTogYW55KTogdm9pZCB7XG4gICAgLy8gMS4gQ2xlYW51cCBjb21wb25lbnQgaW5zdGFuY2VcbiAgICBpZiAobm9kZS4ka2FzcGVySW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbm9kZS4ka2FzcGVySW5zdGFuY2U7XG4gICAgICBpZiAoaW5zdGFuY2Uub25EZXN0cm95KSB7XG4gICAgICAgIGluc3RhbmNlLm9uRGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9XG5cbiAgICAvLyAyLiBDbGVhbnVwIGVmZmVjdHMgYXR0YWNoZWQgdG8gdGhlIG5vZGVcbiAgICBpZiAobm9kZS4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIH1cblxuICAgIC8vIDMuIENsZWFudXAgZWZmZWN0cyBvbiBhdHRyaWJ1dGVzXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gNC4gUmVjdXJzZVxuICAgIG5vZGUuY2hpbGROb2Rlcz8uZm9yRWFjaCgoY2hpbGQ6IGFueSkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koY29udGFpbmVyOiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBtb3VudENvbXBvbmVudChDb21wb25lbnRDbGFzczogQ29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95KGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IChDb21wb25lbnRDbGFzcyBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmICghdGVtcGxhdGUpIHJldHVybjtcblxuICAgIGNvbnN0IG5vZGVzID0gbmV3IFRlbXBsYXRlUGFyc2VyKCkucGFyc2UodGVtcGxhdGUpO1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChob3N0KTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRDbGFzcyh7IGFyZ3M6IHsgcGFyYW1zOiBwYXJhbXMgfSwgcmVmOiBob3N0LCB0cmFuc3BpbGVyOiB0aGlzIH0pO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAoaG9zdCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgIGNvbnN0IGNvbXBvbmVudE5vZGVzID0gbm9kZXM7XG4gICAgY29tcG9uZW50LiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGVzdHJveShob3N0KTtcbiAgICAgICAgaG9zdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgXG4gICAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhjb21wb25lbnROb2RlcywgaG9zdCk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKG51bGwsIGNvbXBvbmVudCk7XG4gICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuXG4gICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGhvc3QpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vbk1vdW50KCk7XG4gICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZXh0cmFjdFJvdXRlcyhjaGlsZHJlbjogS05vZGUuS05vZGVbXSwgcGFyZW50R3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+LCBzY29wZT86IFNjb3BlKTogUm91dGVDb25maWdbXSB7XG4gICAgY29uc3Qgcm91dGVzOiBSb3V0ZUNvbmZpZ1tdID0gW107XG4gICAgY29uc3QgcHJldlNjb3BlID0gc2NvcGUgPyB0aGlzLmludGVycHJldGVyLnNjb3BlIDogdW5kZWZpbmVkO1xuICAgIGlmIChzY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC50eXBlICE9PSBcImVsZW1lbnRcIikgY29udGludWU7XG4gICAgICBjb25zdCBlbCA9IGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBpZiAoZWwubmFtZSA9PT0gXCJyb3V0ZVwiKSB7XG4gICAgICAgIGNvbnN0IHBhdGhBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQHBhdGhcIl0pO1xuICAgICAgICBjb25zdCBjb21wb25lbnRBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGNvbXBvbmVudFwiXSk7XG4gICAgICAgIGNvbnN0IGd1YXJkQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBndWFyZFwiXSk7XG5cbiAgICAgICAgaWYgKCFwYXRoQXR0ciB8fCAhY29tcG9uZW50QXR0cikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNTSU5HX1JFUVVJUkVEX0FUVFIsIHsgbWVzc2FnZTogXCI8cm91dGU+IHJlcXVpcmVzIEBwYXRoIGFuZCBAY29tcG9uZW50IGF0dHJpYnV0ZXMuXCIgfSwgZWwubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoID0gcGF0aEF0dHIhLnZhbHVlO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmV4ZWN1dGUoY29tcG9uZW50QXR0ciEudmFsdWUpO1xuICAgICAgICBjb25zdCBndWFyZCA9IGd1YXJkQXR0ciA/IHRoaXMuZXhlY3V0ZShndWFyZEF0dHIudmFsdWUpIDogcGFyZW50R3VhcmQ7XG4gICAgICAgIHJvdXRlcy5wdXNoKHsgcGF0aDogcGF0aCwgY29tcG9uZW50OiBjb21wb25lbnQsIGd1YXJkOiBndWFyZCB9KTtcbiAgICAgIH0gZWxzZSBpZiAoZWwubmFtZSA9PT0gXCJndWFyZFwiKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjaGVja1wiXSk7XG4gICAgICAgIGlmICghY2hlY2tBdHRyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1JU1NJTkdfUkVRVUlSRURfQVRUUiwgeyBtZXNzYWdlOiBcIjxndWFyZD4gcmVxdWlyZXMgQGNoZWNrIGF0dHJpYnV0ZS5cIiB9LCBlbC5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hlY2tBdHRyKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY2hlY2sgPSB0aGlzLmV4ZWN1dGUoY2hlY2tBdHRyLnZhbHVlKTtcbiAgICAgICAgcm91dGVzLnB1c2goLi4udGhpcy5leHRyYWN0Um91dGVzKGVsLmNoaWxkcmVuLCBjaGVjaykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclJlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JlbmRlcmluZykgcmV0dXJuO1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgaWYgKGluc3RhbmNlICYmIHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShfbm9kZTogS05vZGUuRG9jdHlwZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55LCB0YWdOYW1lPzogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGZpbmFsQXJncyA9IGFyZ3M7XG4gICAgaWYgKHR5cGVvZiBhcmdzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25zdCBjbGVhbk1lc3NhZ2UgPSBhcmdzLmluY2x1ZGVzKFwiUnVudGltZSBFcnJvclwiKVxuICAgICAgICA/IGFyZ3MucmVwbGFjZShcIlJ1bnRpbWUgRXJyb3I6IFwiLCBcIlwiKVxuICAgICAgICA6IGFyZ3M7XG4gICAgICBmaW5hbEFyZ3MgPSB7IG1lc3NhZ2U6IGNsZWFuTWVzc2FnZSB9O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBmaW5hbEFyZ3MsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0YWdOYW1lKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnQsXG4gIHJlZ2lzdHJ5PzogQ29tcG9uZW50UmVnaXN0cnlcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IHx8IHt9IH0pO1xuICBjb25zdCByZXN1bHQgPSB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgZW50aXR5IHx8IHt9LCBjb250YWluZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXIoQ29tcG9uZW50Q2xhc3M6IGFueSkge1xuICBib290c3RyYXAoe1xuICAgIHJvb3Q6IFwia2FzcGVyLWFwcFwiLFxuICAgIGVudHJ5OiBcImthc3Blci1yb290XCIsXG4gICAgcmVnaXN0cnk6IHtcbiAgICAgIFwia2FzcGVyLXJvb3RcIjoge1xuICAgICAgICBzZWxlY3RvcjogXCJ0ZW1wbGF0ZVwiLFxuICAgICAgICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzLFxuICAgICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2FzcGVyQ29uZmlnIHtcbiAgcm9vdD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xuICBtb2RlPzogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChcbiAgdHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeVxuKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZWdpc3RyeVt0YWddLmNvbXBvbmVudCh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiByZWdpc3RyeVt0YWddLm5vZGVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZWdpc3RyeShcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5LFxuICBwYXJzZXI6IFRlbXBsYXRlUGFyc2VyXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0geyAuLi5yZWdpc3RyeSB9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWdpc3RyeSkpIHtcbiAgICBjb25zdCBlbnRyeSA9IHJlZ2lzdHJ5W2tleV07XG4gICAgaWYgKCFlbnRyeS5ub2RlcykgZW50cnkubm9kZXMgPSBbXTtcbiAgICBpZiAoZW50cnkubm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChlbnRyeS5zZWxlY3Rvcikge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICBlbnRyeS50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICBlbnRyeS5ub2RlcyA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZS5pbm5lckhUTUwpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbnRyeS50ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UoZW50cnkudGVtcGxhdGUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHN0YXRpY1RlbXBsYXRlID0gKGVudHJ5LmNvbXBvbmVudCBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmIChzdGF0aWNUZW1wbGF0ZSkge1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2Uoc3RhdGljVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbmZpZzogS2FzcGVyQ29uZmlnKSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCByb290ID1cbiAgICB0eXBlb2YgY29uZmlnLnJvb3QgPT09IFwic3RyaW5nXCJcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdClcbiAgICAgIDogY29uZmlnLnJvb3Q7XG5cbiAgaWYgKCFyb290KSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5ST09UX0VMRU1FTlRfTk9UX0ZPVU5ELFxuICAgICAgeyByb290OiBjb25maWcucm9vdCB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuICBpZiAoIWNvbmZpZy5yZWdpc3RyeVtlbnRyeVRhZ10pIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLkVOVFJZX0NPTVBPTkVOVF9OT1RfRk9VTkQsXG4gICAgICB7IHRhZzogZW50cnlUYWcgfVxuICAgICk7XG4gIH1cblxuICBjb25zdCByZWdpc3RyeSA9IG5vcm1hbGl6ZVJlZ2lzdHJ5KGNvbmZpZy5yZWdpc3RyeSwgcGFyc2VyKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IH0pO1xuICBcbiAgLy8gU2V0IHRoZSBlbnZpcm9ubWVudCBtb2RlIG9uIHRoZSB0cmFuc3BpbGVyIG9yIGdsb2JhbGx5XG4gIGlmIChjb25maWcubW9kZSkge1xuICAgICh0cmFuc3BpbGVyIGFzIGFueSkubW9kZSA9IGNvbmZpZy5tb2RlO1xuICB9IGVsc2Uge1xuICAgIC8vIERlZmF1bHQgdG8gZGV2ZWxvcG1lbnQgaWYgbm90IHNwZWNpZmllZFxuICAgICh0cmFuc3BpbGVyIGFzIGFueSkubW9kZSA9IFwiZGV2ZWxvcG1lbnRcIjtcbiAgfVxuXG4gIGNvbnN0IHsgbm9kZSwgaW5zdGFuY2UsIG5vZGVzIH0gPSBjcmVhdGVDb21wb25lbnQoXG4gICAgdHJhbnNwaWxlcixcbiAgICBlbnRyeVRhZyxcbiAgICByZWdpc3RyeVxuICApO1xuXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cblxuICAvLyBJbml0aWFsIHJlbmRlciBhbmQgbGlmZWN5Y2xlXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25Nb3VudCgpO1xuICB9XG5cbiAgdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGluc3RhbmNlLCBub2RlIGFzIEhUTUxFbGVtZW50KTtcblxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuIl0sIm5hbWVzIjpbInJhd0VmZmVjdCIsInJhd0NvbXB1dGVkIiwiU2V0IiwiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5QaXBlbGluZSIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLkNhbGwiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuU3ByZWFkIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5BcnJvd0Z1bmN0aW9uIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsIkNvbW1lbnQiLCJOb2RlLkNvbW1lbnQiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCIsIkNvbXBvbmVudENsYXNzIiwic2NvcGUiLCJwcmV2Il0sIm1hcHBpbmdzIjoiQUFBTyxNQUFNLGFBQWE7QUFBQTtBQUFBLEVBRXhCLHdCQUF3QjtBQUFBLEVBQ3hCLDJCQUEyQjtBQUFBO0FBQUEsRUFHM0Isc0JBQXNCO0FBQUEsRUFDdEIscUJBQXFCO0FBQUEsRUFDckIsc0JBQXNCO0FBQUE7QUFBQSxFQUd0QixnQkFBZ0I7QUFBQSxFQUNoQix3QkFBd0I7QUFBQSxFQUN4QixtQkFBbUI7QUFBQSxFQUNuQiwwQkFBMEI7QUFBQSxFQUMxQixzQkFBc0I7QUFBQSxFQUN0QixzQkFBc0I7QUFBQSxFQUN0Qix1QkFBdUI7QUFBQSxFQUN2QixjQUFjO0FBQUEsRUFDZCxnQ0FBZ0M7QUFBQTtBQUFBLEVBR2hDLGtCQUFrQjtBQUFBLEVBQ2xCLGdCQUFnQjtBQUFBLEVBQ2hCLHFCQUFxQjtBQUFBLEVBQ3JCLHdCQUF3QjtBQUFBO0FBQUEsRUFHeEIsd0JBQXdCO0FBQUEsRUFDeEIseUJBQXlCO0FBQUEsRUFDekIsdUJBQXVC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QSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxnQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGlCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFqRlUsU0FBQUE7QUFBQSxHQUFBLGFBQUEsQ0FBQSxDQUFBO0FBb0ZMLE1BQU0sTUFBTTtBQUFBLEVBUWpCLFlBQ0UsTUFDQSxRQUNBLFNBQ0EsTUFDQSxLQUNBO0FBQ0EsU0FBSyxPQUFPLFVBQVUsSUFBSTtBQUMxQixTQUFLLE9BQU87QUFDWixTQUFLLFNB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
