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
  withTag(tagName) {
    if (!this.tagName) {
      this.tagName = tagName;
      this.message += `
  at <${tagName}>`;
    }
    return this;
  }
}
let globalHandler = null;
function setErrorHandler(handler) {
  globalHandler = handler ?? null;
}
function handleError(error, phase, component) {
  const err = error instanceof Error ? error : new Error(String(error));
  if (component && typeof component.onError === "function") {
    try {
      component.onError(err, phase);
      return;
    } catch (e) {
    }
  }
  if (globalHandler) {
    try {
      globalHandler(err, { component, phase });
      return;
    } catch (_) {
    }
  }
  console.error(`[Kasper] Error during ${phase}:`, err);
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
            handleError(e, "watcher");
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
        handleError(e, "watcher");
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
    do {
      this.advance("Expected comment closing '-->'");
    } while (!this.match(`-->`));
    return null;
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
    if (parent.insert && typeof parent.insert === "function") {
      parent.insert(this.start);
      parent.insert(this.end);
    } else {
      parent.appendChild(this.start);
      parent.appendChild(this.end);
    }
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
      handleError(e, "render", instance);
    }
  }
  queue.clear();
  const callbacks = nextTickCallbacks.splice(0);
  for (const cb of callbacks) {
    try {
      cb();
    } catch (e) {
      handleError(e, "render");
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
    this.templateParser = new TemplateParser();
    this.interpreter = new Interpreter();
    this.registry = {};
    this.mode = "development";
    this.isRendering = false;
    this.registry["router"] = { component: Router };
    if (!options) return;
    if (options.registry) {
      this.registry = { ...this.registry, ...options.registry };
    }
  }
  renderComponentInstance(instance, nodes, element, restoreScope, slots) {
    if (slots) instance.$slots = slots;
    instance.$render = () => {
      this.isRendering = true;
      try {
        this.destroy(element);
        element.innerHTML = "";
        const scope2 = new Scope(restoreScope, instance);
        scope2.set("$instance", instance);
        if (slots) instance.$slots = slots;
        const prevScope = this.interpreter.scope;
        this.interpreter.scope = scope2;
        flushSync(() => {
          this.createSiblings(nodes, element);
          if (typeof instance.onRender === "function") instance.onRender();
        });
        this.interpreter.scope = prevScope;
      } finally {
        this.isRendering = false;
      }
    };
    if (typeof instance.onMount === "function") instance.onMount();
    const scope = new Scope(restoreScope, instance);
    scope.set("$instance", instance);
    this.interpreter.scope = scope;
    flushSync(() => {
      this.createSiblings(nodes, element);
      if (typeof instance.onRender === "function") instance.onRender();
    });
    this.interpreter.scope = restoreScope;
  }
  resolveNodes(tag) {
    const entry = this.registry[tag];
    if (entry.nodes !== void 0) return entry.nodes;
    const source = entry.component.template;
    if (!source) {
      entry.nodes = [];
      return entry.nodes;
    }
    entry.nodes = this.templateParser.parse(source);
    return entry.nodes;
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
  // Wraps a refresh function so it restores the correct scope when called
  // directly by triggerRefresh (outside of the signal effect machinery).
  scopedRefresh(fn) {
    const scope = this.interpreter.scope;
    return () => {
      const prev = this.interpreter.scope;
      this.interpreter.scope = scope;
      try {
        fn();
      } finally {
        this.interpreter.scope = prev;
      }
    };
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
  visitCommentKNode(_node, _parent) {
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
    boundary.start.$kasperRefresh = this.scopedRefresh(run);
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
    boundary.start.$kasperRefresh = this.scopedRefresh(run);
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
        const parent2 = boundary.end.parentNode;
        let lastInserted = boundary.start;
        for (const { item, idx, key } of newItems) {
          const scopeValues = { [name]: item };
          if (indexKey) scopeValues[indexKey] = idx;
          this.interpreter.scope = new Scope(originalScope, scopeValues);
          if (keyedNodes.has(key)) {
            const domNode = keyedNodes.get(key);
            if (lastInserted.nextSibling !== domNode) {
              parent2.insertBefore(domNode, lastInserted.nextSibling);
            }
            lastInserted = domNode;
            const nodeScope = domNode.$kasperScope;
            if (nodeScope) {
              nodeScope.set(name, item);
              if (indexKey) nodeScope.set(indexKey, idx);
              this.triggerRefresh(domNode);
            }
          } else {
            const created = this.createElement(node, boundary);
            if (created) {
              if (lastInserted.nextSibling !== created) {
                parent2.insertBefore(created, lastInserted.nextSibling);
              }
              lastInserted = created;
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
    boundary.start.$kasperRefresh = this.scopedRefresh(run);
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
            const next = nodes[current];
            if (next.type !== "element") break;
            const attr = this.findAttr(next, [
              "@else",
              "@elseif"
            ]);
            if (attr) {
              expressions.push([next, attr]);
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
    var _a, _b;
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
        if ((_a = this.registry[node.name]) == null ? void 0 : _a.lazy) {
          const entry = this.registry[node.name];
          if (entry.fallback) {
            const fallbackNodes = this.templateParser.parse(entry.fallback.template ?? "");
            const fallbackInstance = new entry.fallback({ args: {}, ref: element, transpiler: this });
            this.bindMethods(fallbackInstance);
            element.$kasperInstance = fallbackInstance;
            this.renderComponentInstance(fallbackInstance, fallbackNodes, element, restoreScope);
          }
          if (!entry._promise) {
            entry._promise = entry.component().then((cls) => {
              entry.nodes = this.templateParser.parse(cls.template ?? "");
              entry.component = cls;
              delete entry.lazy;
              delete entry._promise;
            });
          }
          entry._promise.then(() => {
            this.destroy(element);
            element.innerHTML = "";
            const cls = entry.component;
            const instance = new cls({ args, ref: element, transpiler: this });
            this.bindMethods(instance);
            element.$kasperInstance = instance;
            this.renderComponentInstance(instance, entry.nodes, element, restoreScope, slots);
          });
          if (parent) {
            if (parent.insert && typeof parent.insert === "function") {
              parent.insert(element);
            } else {
              parent.appendChild(element);
            }
          }
          return element;
        }
        if ((_b = this.registry[node.name]) == null ? void 0 : _b.component) {
          component = new this.registry[node.name].component({
            args,
            ref: element,
            transpiler: this
          });
          this.bindMethods(component);
          element.$kasperInstance = component;
          if (node.name === "router" && component instanceof Router) {
            const routeScope = new Scope(restoreScope, component);
            component.setRoutes(this.extractRoutes(node.children, void 0, routeScope));
          }
          this.renderComponentInstance(component, this.resolveNodes(node.name), element, restoreScope, slots);
        }
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
      if (e instanceof KasperError) throw e.withTag(node.name);
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
    const nodes = this.templateParser.parse(template);
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
function lazy(importer) {
  return {
    lazy: true,
    component: () => importer().then((m) => Object.values(m)[0])
  };
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
function createComponent(transpiler, tag) {
  const element = document.createElement(tag);
  const component = new transpiler.registry[tag].component({
    ref: element,
    transpiler,
    args: {}
  });
  return {
    node: element,
    instance: component,
    nodes: transpiler.resolveNodes(tag)
  };
}
function bootstrap(config) {
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
  if (config.onError) {
    setErrorHandler(config.onError);
  }
  const transpiler = new Transpiler({ registry: config.registry });
  if (config.mode) {
    transpiler.mode = config.mode;
  }
  const { node, instance, nodes } = createComponent(transpiler, entryTag);
  root.innerHTML = "";
  root.appendChild(node);
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
  Router,
  Scanner,
  TemplateParser,
  Transpiler,
  batch,
  computed,
  effect,
  execute,
  lazy,
  navigate,
  nextTick,
  signal,
  transpile,
  watch
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvZXJyb3ItaGFuZGxlci50cyIsIi4uL3NyYy9zaWduYWwudHMiLCIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3JvdXRlci50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy9zY2hlZHVsZXIudHMiLCIuLi9zcmMvdHJhbnNwaWxlci50cyIsIi4uL3NyYy9rYXNwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEtFcnJvckNvZGUgPSB7XG4gIC8vIEJvb3RzdHJhcFxuICBST09UX0VMRU1FTlRfTk9UX0ZPVU5EOiBcIkswMDEtMVwiLFxuICBFTlRSWV9DT01QT05FTlRfTk9UX0ZPVU5EOiBcIkswMDEtMlwiLFxuXG4gIC8vIFNjYW5uZXJcbiAgVU5URVJNSU5BVEVEX0NPTU1FTlQ6IFwiSzAwMi0xXCIsXG4gIFVOVEVSTUlOQVRFRF9TVFJJTkc6IFwiSzAwMi0yXCIsXG4gIFVORVhQRUNURURfQ0hBUkFDVEVSOiBcIkswMDItM1wiLFxuXG4gIC8vIFRlbXBsYXRlIFBhcnNlclxuICBVTkVYUEVDVEVEX0VPRjogXCJLMDAzLTFcIixcbiAgVU5FWFBFQ1RFRF9DTE9TSU5HX1RBRzogXCJLMDAzLTJcIixcbiAgRVhQRUNURURfVEFHX05BTUU6IFwiSzAwMy0zXCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVDogXCJLMDAzLTRcIixcbiAgRVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy01XCIsXG4gIEJMQU5LX0FUVFJJQlVURV9OQU1FOiBcIkswMDMtNlwiLFxuICBNSVNQTEFDRURfQ09ORElUSU9OQUw6IFwiSzAwMy03XCIsXG4gIERVUExJQ0FURV9JRjogXCJLMDAzLThcIixcbiAgTVVMVElQTEVfU1RSVUNUVVJBTF9ESVJFQ1RJVkVTOiBcIkswMDMtOVwiLFxuXG4gIC8vIEV4cHJlc3Npb24gUGFyc2VyXG4gIFVORVhQRUNURURfVE9LRU46IFwiSzAwNC0xXCIsXG4gIElOVkFMSURfTFZBTFVFOiBcIkswMDQtMlwiLFxuICBFWFBFQ1RFRF9FWFBSRVNTSU9OOiBcIkswMDQtM1wiLFxuICBJTlZBTElEX0RJQ1RJT05BUllfS0VZOiBcIkswMDQtNFwiLFxuXG4gIC8vIEludGVycHJldGVyXG4gIElOVkFMSURfUE9TVEZJWF9MVkFMVUU6IFwiSzAwNS0xXCIsXG4gIFVOS05PV05fQklOQVJZX09QRVJBVE9SOiBcIkswMDUtMlwiLFxuICBJTlZBTElEX1BSRUZJWF9SVkFMVUU6IFwiSzAwNS0zXCIsXG4gIFVOS05PV05fVU5BUllfT1BFUkFUT1I6IFwiSzAwNS00XCIsXG4gIE5PVF9BX0ZVTkNUSU9OOiBcIkswMDUtNVwiLFxuICBOT1RfQV9DTEFTUzogXCJLMDA1LTZcIixcblxuICAvLyBTaWduYWxzXG4gIENJUkNVTEFSX0NPTVBVVEVEOiBcIkswMDYtMVwiLFxuXG4gIC8vIFRyYW5zcGlsZXJcbiAgUlVOVElNRV9FUlJPUjogXCJLMDA3LTFcIixcbiAgTUlTU0lOR19SRVFVSVJFRF9BVFRSOiBcIkswMDctMlwiLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgS0Vycm9yQ29kZVR5cGUgPSAodHlwZW9mIEtFcnJvckNvZGUpW2tleW9mIHR5cGVvZiBLRXJyb3JDb2RlXTtcblxuZXhwb3J0IGNvbnN0IEVycm9yVGVtcGxhdGVzOiBSZWNvcmQ8c3RyaW5nLCAoYXJnczogYW55KSA9PiBzdHJpbmc+ID0ge1xuICBcIkswMDEtMVwiOiAoYSkgPT4gYFJvb3QgZWxlbWVudCBub3QgZm91bmQ6ICR7YS5yb290fWAsXG4gIFwiSzAwMS0yXCI6IChhKSA9PiBgRW50cnkgY29tcG9uZW50IDwke2EudGFnfT4gbm90IGZvdW5kIGluIHJlZ2lzdHJ5LmAsXG4gIFxuICBcIkswMDItMVwiOiAoKSA9PiAnVW50ZXJtaW5hdGVkIGNvbW1lbnQsIGV4cGVjdGluZyBjbG9zaW5nIFwiKi9cIicsXG4gIFwiSzAwMi0yXCI6IChhKSA9PiBgVW50ZXJtaW5hdGVkIHN0cmluZywgZXhwZWN0aW5nIGNsb3NpbmcgJHthLnF1b3RlfWAsXG4gIFwiSzAwMi0zXCI6IChhKSA9PiBgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7YS5jaGFyfSdgLFxuXG4gIFwiSzAwMy0xXCI6IChhKSA9PiBgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHthLmVvZkVycm9yfWAsXG4gIFwiSzAwMy0yXCI6ICgpID0+IFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiLFxuICBcIkswMDMtM1wiOiAoKSA9PiBcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIixcbiAgXCJLMDAzLTRcIjogKCkgPT4gXCJFeHBlY3RlZCBjbG9zaW5nIHRhZyA+XCIsXG4gIFwiSzAwMy01XCI6IChhKSA9PiBgRXhwZWN0ZWQgPC8ke2EubmFtZX0+YCxcbiAgXCJLMDAzLTZcIjogKCkgPT4gXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiLFxuICBcIkswMDMtN1wiOiAoYSkgPT4gYEAke2EubmFtZX0gbXVzdCBiZSBwcmVjZWRlZCBieSBhbiBAaWYgb3IgQGVsc2VpZiBibG9jay5gLFxuICBcIkswMDMtOFwiOiAoKSA9PiBcIk11bHRpcGxlIGNvbmRpdGlvbmFsIGRpcmVjdGl2ZXMgKEBpZiwgQGVsc2VpZiwgQGVsc2UpIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXJlIG5vdCBhbGxvd2VkLlwiLFxuICBcIkswMDMtOVwiOiAoKSA9PiBcIk11bHRpcGxlIHN0cnVjdHVyYWwgZGlyZWN0aXZlcyAoQGlmLCBAZWFjaCkgb24gdGhlIHNhbWUgZWxlbWVudCBhcmUgbm90IGFsbG93ZWQuIE5lc3QgdGhlbSBvciB1c2UgPHZvaWQ+IGluc3RlYWQuXCIsXG5cbiAgXCJLMDA0LTFcIjogKGEpID0+IGAke2EubWVzc2FnZX0sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtMlwiOiAoKSA9PiBcIkludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuXCIsXG4gIFwiSzAwNC0zXCI6IChhKSA9PiBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7YS50b2tlbn1cImAsXG4gIFwiSzAwNC00XCI6IChhKSA9PiBgU3RyaW5nLCBOdW1iZXIgb3IgSWRlbnRpZmllciBleHBlY3RlZCBhcyBhIEtleSBvZiBEaWN0aW9uYXJ5IHssIHVuZXhwZWN0ZWQgdG9rZW4gJHthLnRva2VufWAsXG5cbiAgXCJLMDA1LTFcIjogKGEpID0+IGBJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIHBvc3RmaXggb3BlcmF0aW9uOiAke2EuZW50aXR5fWAsXG4gIFwiSzAwNS0yXCI6IChhKSA9PiBgVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgJHthLm9wZXJhdG9yfWAsXG4gIFwiSzAwNS0zXCI6IChhKSA9PiBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAke2EucmlnaHR9YCxcbiAgXCJLMDA1LTRcIjogKGEpID0+IGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtNVwiOiAoYSkgPT4gYCR7YS5jYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCxcbiAgXCJLMDA1LTZcIjogKGEpID0+IGAnJHthLmNsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmAsXG5cbiAgXCJLMDA2LTFcIjogKCkgPT4gXCJDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIGluIGNvbXB1dGVkIHNpZ25hbFwiLFxuXG4gIFwiSzAwNy0xXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG4gIFwiSzAwNy0yXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG59O1xuXG5leHBvcnQgY2xhc3MgS2FzcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb2RlOiBLRXJyb3JDb2RlVHlwZSxcbiAgICBwdWJsaWMgYXJnczogYW55ID0ge30sXG4gICAgcHVibGljIGxpbmU/OiBudW1iZXIsXG4gICAgcHVibGljIGNvbD86IG51bWJlcixcbiAgICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZ1xuICApIHtcbiAgICAvLyBEZXRlY3QgZW52aXJvbm1lbnRcbiAgICBjb25zdCBpc0RldiA9XG4gICAgICB0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIlxuICAgICAgICA6IChpbXBvcnQubWV0YSBhcyBhbnkpLmVudj8uTU9ERSAhPT0gXCJwcm9kdWN0aW9uXCI7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IEVycm9yVGVtcGxhdGVzW2NvZGVdO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSBcbiAgICAgID8gdGVtcGxhdGUoYXJncykgXG4gICAgICA6ICh0eXBlb2YgYXJncyA9PT0gJ3N0cmluZycgPyBhcmdzIDogXCJVbmtub3duIGVycm9yXCIpO1xuICAgIFxuICAgIGNvbnN0IGxvY2F0aW9uID0gbGluZSAhPT0gdW5kZWZpbmVkID8gYCAoJHtsaW5lfToke2NvbH0pYCA6IFwiXCI7XG4gICAgY29uc3QgdGFnSW5mbyA9IHRhZ05hbWUgPyBgXFxuICBhdCA8JHt0YWdOYW1lfT5gIDogXCJcIjtcbiAgICBjb25zdCBsaW5rID0gaXNEZXZcbiAgICAgID8gYFxcblxcblNlZTogaHR0cHM6Ly9rYXNwZXJqcy50b3AvcmVmZXJlbmNlL2Vycm9ycyMke2NvZGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKX1gXG4gICAgICA6IFwiXCI7XG5cbiAgICBzdXBlcihgWyR7Y29kZX1dICR7bWVzc2FnZX0ke2xvY2F0aW9ufSR7dGFnSW5mb30ke2xpbmt9YCk7XG4gICAgdGhpcy5uYW1lID0gXCJLYXNwZXJFcnJvclwiO1xuICB9XG5cbiAgcHVibGljIHdpdGhUYWcodGFnTmFtZTogc3RyaW5nKTogdGhpcyB7XG4gICAgaWYgKCF0aGlzLnRhZ05hbWUpIHtcbiAgICAgIHRoaXMudGFnTmFtZSA9IHRhZ05hbWU7XG4gICAgICB0aGlzLm1lc3NhZ2UgKz0gYFxcbiAgYXQgPCR7dGFnTmFtZX0+YDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsImV4cG9ydCB0eXBlIEVycm9yUGhhc2UgPSAncmVuZGVyJyB8ICd3YXRjaGVyJztcblxuZXhwb3J0IHR5cGUgRXJyb3JIYW5kbGVyRm4gPSAoXG4gIGVycm9yOiBFcnJvcixcbiAgY29udGV4dDogeyBjb21wb25lbnQ/OiBhbnk7IHBoYXNlOiBFcnJvclBoYXNlIH1cbikgPT4gdm9pZDtcblxubGV0IGdsb2JhbEhhbmRsZXI6IEVycm9ySGFuZGxlckZuIHwgbnVsbCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRFcnJvckhhbmRsZXIoaGFuZGxlcjogRXJyb3JIYW5kbGVyRm4gfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgZ2xvYmFsSGFuZGxlciA9IGhhbmRsZXIgPz8gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yOiB1bmtub3duLCBwaGFzZTogRXJyb3JQaGFzZSwgY29tcG9uZW50PzogYW55KTogdm9pZCB7XG4gIGNvbnN0IGVyciA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvciA6IG5ldyBFcnJvcihTdHJpbmcoZXJyb3IpKTtcblxuICAvLyBUcnkgY29tcG9uZW50LWxldmVsIG9uRXJyb3IgZmlyc3RcbiAgaWYgKGNvbXBvbmVudCAmJiB0eXBlb2YgY29tcG9uZW50Lm9uRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgY29tcG9uZW50Lm9uRXJyb3IoZXJyLCBwaGFzZSk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gb25FcnJvciBpdHNlbGYgdGhyZXcg4oCUIGZhbGwgdGhyb3VnaCB3aXRoIG9yaWdpbmFsIGVycm9yXG4gICAgfVxuICB9XG5cbiAgLy8gVHJ5IGdsb2JhbCBoYW5kbGVyXG4gIGlmIChnbG9iYWxIYW5kbGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGdsb2JhbEhhbmRsZXIoZXJyLCB7IGNvbXBvbmVudCwgcGhhc2UgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoXykge31cbiAgfVxuXG4gIC8vIEZpbmFsIGZhbGxiYWNrXG4gIGNvbnNvbGUuZXJyb3IoYFtLYXNwZXJdIEVycm9yIGR1cmluZyAke3BoYXNlfTpgLCBlcnIpO1xufVxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG50eXBlIExpc3RlbmVyID0gKCkgPT4gdm9pZDtcblxuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tIFwiLi9lcnJvci1oYW5kbGVyXCI7XG5cbmxldCBhY3RpdmVFZmZlY3Q6IHsgZm46IExpc3RlbmVyOyBkZXBzOiBTZXQ8YW55PiB9IHwgbnVsbCA9IG51bGw7XG5jb25zdCBlZmZlY3RTdGFjazogYW55W10gPSBbXTtcblxubGV0IGJhdGNoaW5nID0gZmFsc2U7XG5jb25zdCBwZW5kaW5nU3Vic2NyaWJlcnMgPSBuZXcgU2V0PExpc3RlbmVyPigpO1xuY29uc3QgcGVuZGluZ1dhdGNoZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG50eXBlIFdhdGNoZXI8VD4gPSAobmV3VmFsdWU6IFQsIG9sZFZhbHVlOiBUKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25hbE9wdGlvbnMge1xuICBzaWduYWw/OiBBYm9ydFNpZ25hbDtcbn1cblxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUPiB7XG4gIHByb3RlY3RlZCBfdmFsdWU6IFQ7XG4gIHByaXZhdGUgc3Vic2NyaWJlcnMgPSBuZXcgU2V0PExpc3RlbmVyPigpO1xuICBwcml2YXRlIHdhdGNoZXJzID0gbmV3IFNldDxXYXRjaGVyPFQ+PigpO1xuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZTogVCkge1xuICAgIHRoaXMuX3ZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlcnMuYWRkKGFjdGl2ZUVmZmVjdC5mbik7XG4gICAgICBhY3RpdmVFZmZlY3QuZGVwcy5hZGQodGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogVCkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgaWYgKGJhdGNoaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuc3Vic2NyaWJlcnMpIHBlbmRpbmdTdWJzY3JpYmVycy5hZGQoc3ViKTtcbiAgICAgICAgZm9yIChjb25zdCB3YXRjaGVyIG9mIHRoaXMud2F0Y2hlcnMpIHBlbmRpbmdXYXRjaGVycy5wdXNoKCgpID0+IHdhdGNoZXIobmV3VmFsdWUsIG9sZFZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbSh0aGlzLnN1YnNjcmliZXJzKTtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgICAgIHN1YigpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSB7XG4gICAgICAgICAgdHJ5IHsgd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpOyB9IGNhdGNoIChlKSB7IGhhbmRsZUVycm9yKGUsICd3YXRjaGVyJyk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlKGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICAgIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgY29uc3Qgc3RvcCA9ICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5jbGFzcyBDb21wdXRlZFNpZ25hbDxUPiBleHRlbmRzIFNpZ25hbDxUPiB7XG4gIHByaXZhdGUgZm46ICgpID0+IFQ7XG4gIHByaXZhdGUgY29tcHV0aW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gICAgc3VwZXIodW5kZWZpbmVkIGFzIGFueSk7XG4gICAgdGhpcy5mbiA9IGZuO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb21wdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEthc3BlckVycm9yKEtFcnJvckNvZGUuQ0lSQ1VMQVJfQ09NUFVURUQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXB1dGluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBFYWdlcmx5IHVwZGF0ZSB0aGUgdmFsdWUgc28gc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkIGltbWVkaWF0ZWx5XG4gICAgICAgIHN1cGVyLnZhbHVlID0gdGhpcy5mbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5jb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zPy5zaWduYWwpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiBzdXBlci52YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShfdjogVCkge1xuICAgIC8vIENvbXB1dGVkIHNpZ25hbHMgYXJlIHJlYWQtb25seSBmcm9tIG91dHNpZGVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lciwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnM/LnNpZ25hbD8uYWJvcnRlZCkgcmV0dXJuICgpID0+IHt9O1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgY29uc3Qgc3RvcDogYW55ID0gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xuICBzdG9wLnJ1biA9IGVmZmVjdE9iai5mbjtcblxuICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBzdG9wIGFzICgoKSA9PiB2b2lkKSAmIHsgcnVuOiAoKSA9PiB2b2lkIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWw8VD4oaW5pdGlhbFZhbHVlOiBUKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBTaWduYWwoaW5pdGlhbFZhbHVlKTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsIGFsaWFzIGZvciBTaWduYWwub25DaGFuZ2UoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICByZXR1cm4gc2lnLm9uQ2hhbmdlKGZuLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIGJhdGNoaW5nID0gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20ocGVuZGluZ1N1YnNjcmliZXJzKTtcbiAgICBwZW5kaW5nU3Vic2NyaWJlcnMuY2xlYXIoKTtcbiAgICBjb25zdCB3YXRjaGVycyA9IHBlbmRpbmdXYXRjaGVycy5zcGxpY2UoMCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgc3ViKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgdHJ5IHsgd2F0Y2hlcigpOyB9IGNhdGNoIChlKSB7IGhhbmRsZUVycm9yKGUsICd3YXRjaGVyJyk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBULCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgQ29tcHV0ZWRTaWduYWwoZm4sIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHsgU2lnbmFsLCBlZmZlY3QgYXMgcmF3RWZmZWN0LCBjb21wdXRlZCBhcyByYXdDb21wdXRlZCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3M8VEFyZ3MgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgYW55Pj4ge1xuICBhcmdzOiBUQXJncztcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8VEFyZ3MgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgYW55Pj4ge1xuICBzdGF0aWMgdGVtcGxhdGU/OiBzdHJpbmc7XG4gIGFyZ3M6IFRBcmdzID0ge30gYXMgVEFyZ3M7XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xuICAkYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAkcmVuZGVyPzogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz86IENvbXBvbmVudEFyZ3M8VEFyZ3M+KSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge30gYXMgVEFyZ3M7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzO1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSByZWFjdGl2ZSBlZmZlY3QgdGllZCB0byB0aGUgY29tcG9uZW50J3MgbGlmZWN5Y2xlLlxuICAgKiBSdW5zIGltbWVkaWF0ZWx5IGFuZCByZS1ydW5zIHdoZW4gYW55IHNpZ25hbCBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gICAqL1xuICBlZmZlY3QoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICByYXdFZmZlY3QoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoZXMgYSBzcGVjaWZpYyBzaWduYWwgZm9yIGNoYW5nZXMuXG4gICAqIERvZXMgTk9UIHJ1biBpbW1lZGlhdGVseS5cbiAgICovXG4gIHdhdGNoPFQ+KHNpZzogU2lnbmFsPFQ+LCBmbjogV2F0Y2hlcjxUPik6IHZvaWQge1xuICAgIHNpZy5vbkNoYW5nZShmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNvbXB1dGVkIHNpZ25hbCB0aWVkIHRvIHRoZSBjb21wb25lbnQncyBsaWZlY3ljbGUuXG4gICAqIFRoZSBpbnRlcm5hbCBlZmZlY3QgaXMgYXV0b21hdGljYWxseSBjbGVhbmVkIHVwIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBjb21wdXRlZDxUPihmbjogKCkgPT4gVCk6IFNpZ25hbDxUPiB7XG4gICAgcmV0dXJuIHJhd0NvbXB1dGVkKGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIG9uTW91bnQoKSB7IH1cbiAgb25SZW5kZXIoKSB7IH1cbiAgb25DaGFuZ2VzKCkgeyB9XG4gIG9uRGVzdHJveSgpIHsgfVxuICBvbkVycm9yPyhlcnJvcjogRXJyb3IsIHBoYXNlOiBzdHJpbmcpOiB2b2lkO1xuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLiRyZW5kZXI/LigpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEthc3BlckVudGl0eSA9IENvbXBvbmVudCB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBDb21wb25lbnRDbGFzcyA9IHsgbmV3KGFyZ3M/OiBDb21wb25lbnRBcmdzPGFueT4pOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3MgfCAoKCkgPT4gUHJvbWlzZTxDb21wb25lbnRDbGFzcz4pO1xuICAgIG5vZGVzPzogS05vZGVbXTtcbiAgICBsYXp5PzogYm9vbGVhbjtcbiAgICBmYWxsYmFjaz86IENvbXBvbmVudENsYXNzO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJ3Rva2VuJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4cHIge1xuICBwdWJsaWMgcmVzdWx0OiBhbnk7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUjtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEFycm93RnVuY3Rpb24pOiBSO1xuICAgIHZpc2l0QXNzaWduRXhwcihleHByOiBBc3NpZ24pOiBSO1xuICAgIHZpc2l0QmluYXJ5RXhwcihleHByOiBCaW5hcnkpOiBSO1xuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcjogQ2FsbCk6IFI7XG4gICAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRGVidWcpOiBSO1xuICAgIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRGljdGlvbmFyeSk6IFI7XG4gICAgdmlzaXRFYWNoRXhwcihleHByOiBFYWNoKTogUjtcbiAgICB2aXNpdEdldEV4cHIoZXhwcjogR2V0KTogUjtcbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBHcm91cGluZyk6IFI7XG4gICAgdmlzaXRLZXlFeHByKGV4cHI6IEtleSk6IFI7XG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByOiBMb2dpY2FsKTogUjtcbiAgICB2aXNpdExpc3RFeHByKGV4cHI6IExpc3QpOiBSO1xuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogTGl0ZXJhbCk6IFI7XG4gICAgdmlzaXROZXdFeHByKGV4cHI6IE5ldyk6IFI7XG4gICAgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogTnVsbENvYWxlc2NpbmcpOiBSO1xuICAgIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogUG9zdGZpeCk6IFI7XG4gICAgdmlzaXRTZXRFeHByKGV4cHI6IFNldCk6IFI7XG4gICAgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogUGlwZWxpbmUpOiBSO1xuICAgIHZpc2l0U3ByZWFkRXhwcihleHByOiBTcHJlYWQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG4gICAgdmlzaXRWb2lkRXhwcihleHByOiBWb2lkKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEFycm93RnVuY3Rpb24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcGFyYW1zOiBUb2tlbltdO1xuICAgIHB1YmxpYyBib2R5OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBUb2tlbltdLCBib2R5OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXJyb3dGdW5jdGlvbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5BcnJvd0Z1bmN0aW9uJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzaWduIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXNzaWduJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkJpbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2FsbGVlOiBFeHByO1xuICAgIHB1YmxpYyBwYXJlbjogVG9rZW47XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcbiAgICBwdWJsaWMgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHIsIHBhcmVuOiBUb2tlbiwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIsIG9wdGlvbmFsID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IG9wdGlvbmFsO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdENhbGxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQ2FsbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVidWdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGVidWcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHByb3BlcnRpZXM6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGljdGlvbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EaWN0aW9uYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWFjaCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMga2V5OiBUb2tlbjtcbiAgICBwdWJsaWMgaXRlcmFibGU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwga2V5OiBUb2tlbiwgaXRlcmFibGU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVhY2hFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRWFjaCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHR5cGU6IFRva2VuVHlwZSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JvdXBpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdyb3VwaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5LZXknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dpY2FsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TG9naWNhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Mb2dpY2FsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpc3QnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGl0ZXJhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjbGF6ejogRXhwcjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IoY2xheno6IEV4cHIsIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xhenogPSBjbGF6ejtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZXdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTmV3JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbENvYWxlc2NpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsQ29hbGVzY2luZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OdWxsQ29hbGVzY2luZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RmaXggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBpbmNyZW1lbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwgaW5jcmVtZW50OiBudW1iZXIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UG9zdGZpeEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Qb3N0Zml4JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBpcGVsaW5lRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBpcGVsaW5lJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3ByZWFkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U3ByZWFkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNwcmVhZCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlbXBsYXRlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlbXBsYXRlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVybmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjb25kaXRpb246IEV4cHI7XG4gICAgcHVibGljIHRoZW5FeHByOiBFeHByO1xuICAgIHB1YmxpYyBlbHNlRXhwcjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbjogRXhwciwgdGhlbkV4cHI6IEV4cHIsIGVsc2VFeHByOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgICAgIHRoaXMudGhlbkV4cHIgPSB0aGVuRXhwcjtcbiAgICAgICAgdGhpcy5lbHNlRXhwciA9IGVsc2VFeHByO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlcm5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVybmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVvZiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFR5cGVvZkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UeXBlb2YnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlVuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VmFyaWFibGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVmFyaWFibGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWb2lkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Vm9pZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Wb2lkJztcbiAgfVxufVxuXG4iLCJleHBvcnQgZW51bSBUb2tlblR5cGUge1xyXG4gIC8vIFBhcnNlciBUb2tlbnNcclxuICBFb2YsXHJcbiAgUGFuaWMsXHJcblxyXG4gIC8vIFNpbmdsZSBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQW1wZXJzYW5kLFxyXG4gIEF0U2lnbixcclxuICBDYXJldCxcclxuICBDb21tYSxcclxuICBEb2xsYXIsXHJcbiAgRG90LFxyXG4gIEhhc2gsXHJcbiAgTGVmdEJyYWNlLFxyXG4gIExlZnRCcmFja2V0LFxyXG4gIExlZnRQYXJlbixcclxuICBQZXJjZW50LFxyXG4gIFBpcGUsXHJcbiAgUmlnaHRCcmFjZSxcclxuICBSaWdodEJyYWNrZXQsXHJcbiAgUmlnaHRQYXJlbixcclxuICBTZW1pY29sb24sXHJcbiAgU2xhc2gsXHJcbiAgU3RhcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQXJyb3csXHJcbiAgQmFuZyxcclxuICBCYW5nRXF1YWwsXHJcbiAgQmFuZ0VxdWFsRXF1YWwsXHJcbiAgQ29sb24sXHJcbiAgRXF1YWwsXHJcbiAgRXF1YWxFcXVhbCxcclxuICBFcXVhbEVxdWFsRXF1YWwsXHJcbiAgR3JlYXRlcixcclxuICBHcmVhdGVyRXF1YWwsXHJcbiAgTGVzcyxcclxuICBMZXNzRXF1YWwsXHJcbiAgTWludXMsXHJcbiAgTWludXNFcXVhbCxcclxuICBNaW51c01pbnVzLFxyXG4gIFBlcmNlbnRFcXVhbCxcclxuICBQbHVzLFxyXG4gIFBsdXNFcXVhbCxcclxuICBQbHVzUGx1cyxcclxuICBRdWVzdGlvbixcclxuICBRdWVzdGlvbkRvdCxcclxuICBRdWVzdGlvblF1ZXN0aW9uLFxyXG4gIFNsYXNoRXF1YWwsXHJcbiAgU3RhckVxdWFsLFxyXG4gIERvdERvdCxcclxuICBEb3REb3REb3QsXHJcbiAgTGVzc0VxdWFsR3JlYXRlcixcclxuXHJcbiAgLy8gTGl0ZXJhbHNcclxuICBJZGVudGlmaWVyLFxyXG4gIFRlbXBsYXRlLFxyXG4gIFN0cmluZyxcclxuICBOdW1iZXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2VucyAoYml0d2lzZSBzaGlmdHMpXHJcbiAgTGVmdFNoaWZ0LFxyXG4gIFJpZ2h0U2hpZnQsXHJcbiAgUGlwZWxpbmUsXHJcbiAgVGlsZGUsXHJcblxyXG4gIC8vIEtleXdvcmRzXHJcbiAgQW5kLFxyXG4gIENvbnN0LFxyXG4gIERlYnVnLFxyXG4gIEZhbHNlLFxyXG4gIEluLFxyXG4gIEluc3RhbmNlb2YsXHJcbiAgTmV3LFxyXG4gIE51bGwsXHJcbiAgVW5kZWZpbmVkLFxyXG4gIE9mLFxyXG4gIE9yLFxyXG4gIFRydWUsXHJcbiAgVHlwZW9mLFxyXG4gIFZvaWQsXHJcbiAgV2l0aCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XHJcbiAgcHVibGljIGxpdGVyYWw6IGFueTtcclxuICBwdWJsaWMgbGV4ZW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHlwZTogVG9rZW5UeXBlLFxyXG4gICAgbGV4ZW1lOiBzdHJpbmcsXHJcbiAgICBsaXRlcmFsOiBhbnksXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2w6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5uYW1lID0gVG9rZW5UeXBlW3R5cGVdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGV4ZW1lID0gbGV4ZW1lO1xyXG4gICAgdGhpcy5saXRlcmFsID0gbGl0ZXJhbDtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiBgWygke3RoaXMubGluZX0pOlwiJHt0aGlzLmxleGVtZX1cIl1gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblBhcnNlciB7XG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICBwcml2YXRlIHRva2VuczogVG9rZW5bXTtcblxuICBwdWJsaWMgcGFyc2UodG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgY29uc3QgZXhwcmVzc2lvbnM6IEV4cHIuRXhwcltdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi50eXBlczogVG9rZW5UeXBlW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50XTtcbiAgfVxuXG4gIHByaXZhdGUgcHJldmlvdXMoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT09IHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVjayhUb2tlblR5cGUuRW9mKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3VtZSh0eXBlOiBUb2tlblR5cGUsIG1lc3NhZ2U6IHN0cmluZyk6IFRva2VuIHtcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5VTkVYUEVDVEVEX1RPS0VOLFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICB7IG1lc3NhZ2U6IG1lc3NhZ2UsIHRva2VuOiB0aGlzLnBlZWsoKS5sZXhlbWUgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCB0b2tlbjogVG9rZW4sIGFyZ3M6IGFueSA9IHt9KTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgdG9rZW4ubGluZSwgdG9rZW4uY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgc3luY2hyb25pemUoKTogdm9pZCB7XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLlNlbWljb2xvbikgfHwgdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcblxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3RlZCBhbiBpZGVudGlmaWVyIGluc2lkZSBcImVhY2hcIiBzdGF0ZW1lbnRgXG4gICAgKTtcblxuICAgIGxldCBrZXk6IFRva2VuID0gbnVsbDtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcbiAgICAgIGtleSA9IHRoaXMuY29uc3VtZShcbiAgICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuT2YsXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICk7XG4gICAgY29uc3QgaXRlcmFibGUgPSB0aGlzLmV4cHJlc3Npb24oKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5FYWNoKG5hbWUsIGtleSwgaXRlcmFibGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGV4cHJlc3Npb24oKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByZXNzaW9uOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xuICAgICAgLy8gY29uc3VtZSBhbGwgc2VtaWNvbG9uc1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkgeyAvKiBjb25zdW1lIHNlbWljb2xvbnMgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWdubWVudCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucGlwZWxpbmUoKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU3RhckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU2xhc2hFcXVhbFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgbGV0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICAgIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICBjb25zdCBuYW1lOiBUb2tlbiA9IGV4cHIubmFtZTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuVmFyaWFibGUobmFtZSwgbmFtZS5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuQXNzaWduKG5hbWUsIHZhbHVlLCBuYW1lLmxpbmUpO1xuICAgICAgfSBlbHNlIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuR2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgZXhwci50eXBlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5TZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCB2YWx1ZSwgZXhwci5saW5lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5JTlZBTElEX0xWQUxVRSwgb3BlcmF0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgcGlwZWxpbmUoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QaXBlbGluZSkpIHtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuUGlwZWxpbmUoZXhwciwgcmlnaHQsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXJuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCB0aGVuRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcbiAgICAgIGNvbnN0IGVsc2VFeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZXJuYXJ5KGV4cHIsIHRoZW5FeHByLCBlbHNlRXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG51bGxDb2FsZXNjaW5nKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubG9naWNhbE9yKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCByaWdodEV4cHI6IEV4cHIuRXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OdWxsQ29hbGVzY2luZyhleHByLCByaWdodEV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsT3IoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsQW5kKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkFuZCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgIHdoaWxlIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3NFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkluc3RhbmNlb2YsXG4gICAgICAgIFRva2VuVHlwZS5JbixcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnNoaWZ0KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBzaGlmdCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRTaGlmdCwgVG9rZW5UeXBlLlJpZ2h0U2hpZnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkaXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzLCBUb2tlblR5cGUuUGx1cykpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QZXJjZW50KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG11bHRpcGxpY2F0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdHlwZW9mKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuYXJ5KCk7XG4gIH1cblxuICBwcml2YXRlIHVuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgVG9rZW5UeXBlLlRpbGRlLFxuICAgICAgICBUb2tlblR5cGUuRG9sbGFyLFxuICAgICAgICBUb2tlblR5cGUuUGx1c1BsdXMsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy51bmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlVuYXJ5KG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld0tleXdvcmQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV3S2V5d29yZCgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OZXcpKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgY29uc3RydWN0OiBFeHByLkV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICAgIGlmIChjb25zdHJ1Y3QgaW5zdGFuY2VvZiBFeHByLkNhbGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QuY2FsbGVlLCBjb25zdHJ1Y3QuYXJncywga2V5d29yZC5saW5lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LCBbXSwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucG9zdGZpeCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3N0Zml4KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuY2FsbCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIDEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgLTEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZDogYm9vbGVhbjtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIGZhbHNlKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90LCBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZG90R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjb25zdW1lZCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRva2VuQXQob2Zmc2V0OiBudW1iZXIpOiBUb2tlblR5cGUge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgKyBvZmZzZXRdPy50eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Fycm93UGFyYW1zKCk6IGJvb2xlYW4ge1xuICAgIGxldCBpID0gdGhpcy5jdXJyZW50ICsgMTsgLy8gc2tpcCAoXG4gICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgIH1cbiAgICB3aGlsZSAoaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuSWRlbnRpZmllcikgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5Db21tYSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGZpbmlzaENhbGwoY2FsbGVlOiBFeHByLkV4cHIsIHBhcmVuOiBUb2tlbiwgb3B0aW9uYWw6IGJvb2xlYW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICAgIGFyZ3MucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB9XG4gICAgY29uc3QgY2xvc2VQYXJlbiA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGFyZ3VtZW50c2ApO1xuICAgIHJldHVybiBuZXcgRXhwci5DYWxsKGNhbGxlZSwgY2xvc2VQYXJlbiwgYXJncywgY2xvc2VQYXJlbi5saW5lLCBvcHRpb25hbCk7XG4gIH1cblxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbmFtZTogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXG4gICAgKTtcbiAgICBjb25zdCBrZXk6IEV4cHIuS2V5ID0gbmV3IEV4cHIuS2V5KG5hbWUsIG5hbWUubGluZSk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGxldCBrZXk6IEV4cHIuRXhwciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIGtleSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYW4gaW5kZXhgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgb3BlcmF0b3IubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHByaW1hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh1bmRlZmluZWQsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlbXBsYXRlKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5JZGVudGlmaWVyKSAmJiB0aGlzLnRva2VuQXQoMSkgPT09IFRva2VuVHlwZS5BcnJvdykge1xuICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lID0+XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihbcGFyYW1dLCBib2R5LCBwYXJhbS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLklkZW50aWZpZXIpKSB7XG4gICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZhcmlhYmxlKGlkZW50aWZpZXIsIGlkZW50aWZpZXIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5MZWZ0UGFyZW4pICYmIHRoaXMuaXNBcnJvd1BhcmFtcygpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSAoXG4gICAgICBjb25zdCBwYXJhbXM6IFRva2VuW10gPSBbXTtcbiAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHBhcmFtcy5wdXNoKHRoaXMuY29uc3VtZShUb2tlblR5cGUuSWRlbnRpZmllciwgXCJFeHBlY3RlZCBwYXJhbWV0ZXIgbmFtZVwiKSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcImApO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5BcnJvdywgYEV4cGVjdGVkIFwiPT5cImApO1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24ocGFyYW1zLCBib2R5LCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGV4cHJlc3Npb25gKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXN0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Wb2lkKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVm9pZChleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5EZWJ1ZykpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRlYnVnKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG5cbiAgICB0aHJvdyB0aGlzLmVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5FWFBFQ1RFRF9FWFBSRVNTSU9OLFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICB7IHRva2VuOiB0aGlzLnBlZWsoKS5sZXhlbWUgfVxuICAgICk7XG4gICAgLy8gdW5yZWFjaGVhYmxlIGNvZGVcbiAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCAwKTtcbiAgfVxuXG4gIHB1YmxpYyBkaWN0aW9uYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbGVmdEJyYWNlID0gdGhpcy5wcmV2aW91cygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgY29uc3QgcHJvcGVydGllczogRXhwci5FeHByW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIEtFcnJvckNvZGUuSU5WQUxJRF9ESUNUSU9OQVJZX0tFWSxcbiAgICAgICAgICB0aGlzLnBlZWsoKSxcbiAgICAgICAgICB7IHRva2VuOiB0aGlzLnBlZWsoKS5sZXhlbWUgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KHByb3BlcnRpZXMsIGxlZnRCcmFjZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcbiAgICBjb25zdCBsZWZ0QnJhY2tldCA9IHRoaXMucHJldmlvdXMoKTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGlzdChbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICB2YWx1ZXMucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5SaWdodEJyYWNrZXQsXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuTGlzdCh2YWx1ZXMsIGxlZnRCcmFja2V0LmxpbmUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIikgfHwgY2hhciA9PT0gXCIkXCIgfHwgY2hhciA9PT0gXCJfXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDoga2V5b2YgdHlwZW9mIFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW5UeXBlW3dvcmRdID49IFRva2VuVHlwZS5BbmQ7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gIC8qKiBzY3JpcHRzIHNvdXJjZSBjb2RlICovXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xuICBwdWJsaWMgdG9rZW5zOiBUb2tlbltdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmdldFRva2VuKCk7XG4gICAgfVxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xuICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPj0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XG4gICAgICB0aGlzLmxpbmUrKztcbiAgICAgIHRoaXMuY29sID0gMDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgdGhpcy5jb2wrKztcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHRva2VuVHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lLCB0aGlzLmNvbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaChleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCArIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVDb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5URVJNSU5BVEVEX0NPTU1FTlQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgY2xvc2luZyBzbGFzaCAnKi8nXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKHF1b3RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IHF1b3RlICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBVbnRlcm1pbmF0ZWQgc3RyaW5nLlxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5URVJNSU5BVEVEX1NUUklORywgeyBxdW90ZTogcXVvdGUgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAvLyBUcmltIHRoZSBzdXJyb3VuZGluZyBxdW90ZXMuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XG4gICAgLy8gZ2V0cyBpbnRlZ2VyIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLlwiICYmIFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGV4cG9uZW50XG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCItXCIgfHwgdGhpcy5wZWVrKCkgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKSBhcyBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlO1xuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZVtjYXBpdGFsaXplZF0sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSBcIihcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIsXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNvbW1hLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiO1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TZW1pY29sb24sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlRpbGRlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSGFzaCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5Db2xvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TdGFyRXF1YWwgOiBUb2tlblR5cGUuU3RhcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5QZXJjZW50RXF1YWwgOiBUb2tlblR5cGUuUGVyY2VudCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwifFwiKSA/IFRva2VuVHlwZS5PciA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUGlwZWxpbmUgOlxuICAgICAgICAgIFRva2VuVHlwZS5QaXBlLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCImXCIpID8gVG9rZW5UeXBlLkFuZCA6IFRva2VuVHlwZS5BbXBlcnNhbmQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUmlnaHRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuR3JlYXRlckVxdWFsIDogVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwgOiBUb2tlblR5cGUuQmFuZ0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5CYW5nLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiP1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI/XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCIuXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvbkRvdFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUXVlc3Rpb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwgOiBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNQbHVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlBsdXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIi1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI8XCIpID8gVG9rZW5UeXBlLkxlZnRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj5cIilcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxuICAgICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90LCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xuICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCIqXCIpKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYCdgOlxuICAgICAgY2FzZSBgXCJgOlxuICAgICAgY2FzZSBcImBcIjpcbiAgICAgICAgdGhpcy5zdHJpbmcoY2hhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gaWdub3JlIGNhc2VzXG4gICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNvbXBsZXggY2FzZXNcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc0FscGhhKGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVORVhQRUNURURfQ0hBUkFDVEVSLCB7IGNoYXI6IGNoYXIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30pOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgdGhpcy5saW5lLCB0aGlzLmNvbCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY29wZSB7XG4gIHB1YmxpYyB2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHB1YmxpYyBwYXJlbnQ6IFNjb3BlO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudD86IFNjb3BlLCBlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgPyBwYXJlbnQgOiBudWxsO1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgaW5pdChlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZXNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2tleV07XG4gICAgfVxuXG4gICAgY29uc3QgJGltcG9ydHMgPSAodGhpcy52YWx1ZXM/LmNvbnN0cnVjdG9yIGFzIGFueSk/LiRpbXBvcnRzO1xuICAgIGlmICgkaW1wb3J0cyAmJiB0eXBlb2YgJGltcG9ydHNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuICRpbXBvcnRzW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvd1trZXkgYXMga2V5b2YgdHlwZW9mIHdpbmRvd107XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIGFzIFBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIEludGVycHJldGVyIGltcGxlbWVudHMgRXhwci5FeHByVmlzaXRvcjxhbnk+IHtcbiAgcHVibGljIHNjb3BlID0gbmV3IFNjb3BlKCk7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG4gIHB1YmxpYyBldmFsdWF0ZShleHByOiBFeHByLkV4cHIpOiBhbnkge1xuICAgIHJldHVybiAoZXhwci5yZXN1bHQgPSBleHByLmFjY2VwdCh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogRXhwci5QaXBlbGluZSk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuQ2FsbCkge1xuICAgICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0LmNhbGxlZSk7XG4gICAgICBjb25zdCBhcmdzID0gW3ZhbHVlXTtcbiAgICAgIGZvciAoY29uc3QgYXJnIG9mIGV4cHIucmlnaHQuYXJncykge1xuICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJnIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXhwci5yaWdodC5jYWxsZWUgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIucmlnaHQuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjb25zdCBmbiA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgcmV0dXJuIGZuKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEV4cHIuQXJyb3dGdW5jdGlvbik6IGFueSB7XG4gICAgY29uc3QgY2FwdHVyZWRTY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuc2NvcGU7XG4gICAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlKGNhcHR1cmVkU2NvcGUpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHByLnBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnBhcmFtc1tpXS5sZXhlbWUsIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5ib2R5KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgbGluZSwgY29sKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBFeHByLlZhcmlhYmxlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5zY29wZS5nZXQoZXhwci5uYW1lLmxleGVtZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEV4cHIuQXNzaWduKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgdGhpcy5zY29wZS5zZXQoZXhwci5uYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEtleUV4cHIoZXhwcjogRXhwci5LZXkpOiBhbnkge1xuICAgIHJldHVybiBleHByLm5hbWUubGl0ZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdldEV4cHIoZXhwcjogRXhwci5HZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGlmICghZW50aXR5ICYmIGV4cHIudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5W2tleV07XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTZXRFeHByKGV4cHI6IEV4cHIuU2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgZW50aXR5W2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQb3N0Zml4RXhwcihleHByOiBFeHByLlBvc3RmaXgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSArIGV4cHIuaW5jcmVtZW50O1xuXG4gICAgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5lbnRpdHkubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgZXhwci5lbnRpdHkuZW50aXR5LFxuICAgICAgICBleHByLmVudGl0eS5rZXksXG4gICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgIGV4cHIubGluZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLklOVkFMSURfUE9TVEZJWF9MVkFMVUUsIHsgZW50aXR5OiBleHByLmVudGl0eSB9LCBleHByLmxpbmUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpc3RFeHByKGV4cHI6IEV4cHIuTGlzdCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWVzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByLnZhbHVlKSB7XG4gICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGV4cHJlc3Npb24gYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNwcmVhZEV4cHIoZXhwcjogRXhwci5TcHJlYWQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogRXhwci5UZW1wbGF0ZSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwci52YWx1ZS5yZXBsYWNlKFxuICAgICAgL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGFyc2UocGxhY2Vob2xkZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEJpbmFyeUV4cHIoZXhwcjogRXhwci5CaW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuXG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2hFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgLyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50OlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAlIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKyByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBpcGU6XG4gICAgICAgIHJldHVybiBsZWZ0IHwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DYXJldDpcbiAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXI6XG4gICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID49IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzczpcbiAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3NFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgIT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuSW5zdGFuY2VvZjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW5zdGFuY2VvZiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluOlxuICAgICAgICByZXR1cm4gbGVmdCBpbiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlZnRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5SaWdodFNoaWZ0OlxuICAgICAgICByZXR1cm4gbGVmdCA+PiByaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTktOT1dOX0JJTkFSWV9PUEVSQVRPUiwgeyBvcGVyYXRvcjogZXhwci5vcGVyYXRvciB9LCBleHByLmxpbmUpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMb2dpY2FsRXhwcihleHByOiBFeHByLkxvZ2ljYWwpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuT3IpIHtcbiAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBFeHByLlRlcm5hcnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuY29uZGl0aW9uKVxuICAgICAgPyB0aGlzLmV2YWx1YXRlKGV4cHIudGhlbkV4cHIpXG4gICAgICA6IHRoaXMuZXZhbHVhdGUoZXhwci5lbHNlRXhwcik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogRXhwci5OdWxsQ29hbGVzY2luZyk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBpZiAobGVmdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICB9XG4gICAgcmV0dXJuIGxlZnQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogRXhwci5Hcm91cGluZyk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5leHByZXNzaW9uKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpdGVyYWxFeHByKGV4cHI6IEV4cHIuTGl0ZXJhbCk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIudmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRVbmFyeUV4cHIoZXhwcjogRXhwci5VbmFyeSk6IGFueSB7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgICAgcmV0dXJuIC1yaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmc6XG4gICAgICAgIHJldHVybiAhcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5UaWxkZTpcbiAgICAgICAgcmV0dXJuIH5yaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXNQbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXNNaW51czoge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgICAgTnVtYmVyKHJpZ2h0KSArIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5QbHVzUGx1cyA/IDEgOiAtMSk7XG4gICAgICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucmlnaHQubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgICAgICBleHByLnJpZ2h0LmVudGl0eSxcbiAgICAgICAgICAgIGV4cHIucmlnaHQua2V5LFxuICAgICAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgICBLRXJyb3JDb2RlLklOVkFMSURfUFJFRklYX1JWQUxVRSxcbiAgICAgICAgICAgIHsgcmlnaHQ6IGV4cHIucmlnaHQgfSxcbiAgICAgICAgICAgIGV4cHIubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOS05PV05fVU5BUllfT1BFUkFUT1IsIHsgb3BlcmF0b3I6IGV4cHIub3BlcmF0b3IgfSwgZXhwci5saW5lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNob3VsZCBiZSB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdENhbGxFeHByKGV4cHI6IEV4cHIuQ2FsbCk6IGFueSB7XG4gICAgLy8gdmVyaWZ5IGNhbGxlZSBpcyBhIGZ1bmN0aW9uXG4gICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLmNhbGxlZSk7XG4gICAgaWYgKGNhbGxlZSA9PSBudWxsICYmIGV4cHIub3B0aW9uYWwpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgaWYgKHR5cGVvZiBjYWxsZWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk5PVF9BX0ZVTkNUSU9OLCB7IGNhbGxlZTogY2FsbGVlIH0sIGV4cHIubGluZSk7XG4gICAgfVxuICAgIC8vIGV2YWx1YXRlIGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIGV4cHIuYXJncykge1xuICAgICAgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGFyZ3VtZW50IGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJndW1lbnQpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZXhlY3V0ZSBmdW5jdGlvbiDigJQgcHJlc2VydmUgYHRoaXNgIGZvciBtZXRob2QgY2FsbHNcbiAgICBpZiAoZXhwci5jYWxsZWUgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXROZXdFeHByKGV4cHI6IEV4cHIuTmV3KTogYW55IHtcbiAgICBjb25zdCBjbGF6eiA9IHRoaXMuZXZhbHVhdGUoZXhwci5jbGF6eik7XG5cbiAgICBpZiAodHlwZW9mIGNsYXp6ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgIEtFcnJvckNvZGUuTk9UX0FfQ0xBU1MsXG4gICAgICAgIHsgY2xheno6IGNsYXp6IH0sXG4gICAgICAgIGV4cHIubGluZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmdzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGV4cHIuYXJncykge1xuICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJnKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgY2xhenooLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBFeHByLkRpY3Rpb25hcnkpOiBhbnkge1xuICAgIGNvbnN0IGRpY3Q6IGFueSA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgZXhwci5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAocHJvcGVydHkgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGRpY3QsIHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLmtleSk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TZXQpLnZhbHVlKTtcbiAgICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaWN0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VHlwZW9mRXhwcihleHByOiBFeHByLlR5cGVvZik6IGFueSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RWFjaEV4cHIoZXhwcjogRXhwci5FYWNoKTogYW55IHtcbiAgICByZXR1cm4gW1xuICAgICAgZXhwci5uYW1lLmxleGVtZSxcbiAgICAgIGV4cHIua2V5ID8gZXhwci5rZXkubGV4ZW1lIDogbnVsbCxcbiAgICAgIHRoaXMuZXZhbHVhdGUoZXhwci5pdGVyYWJsZSksXG4gICAgXTtcbiAgfVxuXG4gIHZpc2l0Vm9pZEV4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRXhwci5Wb2lkKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudEtOb2RlKGtub2RlOiBFbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZUtOb2RlKGtub2RlOiBBdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0VGV4dEtOb2RlKGtub2RlOiBUZXh0LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdENvbW1lbnRLTm9kZShrbm9kZTogQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXREb2N0eXBlS05vZGUoa25vZGU6IERvY3R5cGUsIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogS05vZGVbXTtcbiAgICBwdWJsaWMgc2VsZjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogS05vZGVbXSwgY2hpbGRyZW46IEtOb2RlW10sIHNlbGY6IGJvb2xlYW4sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcbmltcG9ydCB7IFNlbGZDbG9zaW5nVGFncywgV2hpdGVTcGFjZXMgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIge1xuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgcHVibGljIG5vZGVzOiBOb2RlLktOb2RlW107XG5cbiAgcHVibGljIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMubm9kZXMgPSBbXTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHRoaXMuc291cmNlID0gXCJcIjtcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gY2hhci5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoZW9mRXJyb3I6IHN0cmluZyA9IFwiXCIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFwiXFxuXCIpKSB7XG4gICAgICAgIHRoaXMubGluZSArPSAxO1xuICAgICAgICB0aGlzLmNvbCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9FT0YsIHsgZW9mRXJyb3I6IGVvZkVycm9yIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVlayguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPiB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuS05vZGUge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGxldCBub2RlOiBOb2RlLktOb2RlO1xuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVORVhQRUNURURfQ0xPU0lOR19UQUcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogbnVsbCB7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY29tbWVudCBjbG9zaW5nICctLT4nXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGAtLT5gKSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGRvY3R5cGUoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgZG8ge1xuICAgICAgdGhpcy5hZHZhbmNlKFwiRXhwZWN0ZWQgY2xvc2luZyBkb2N0eXBlXCIpO1xuICAgIH0gd2hpbGUgKCF0aGlzLm1hdGNoKGA+YCkpO1xuICAgIGNvbnN0IGRvY3R5cGUgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSkudHJpbSgpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Eb2N0eXBlKGRvY3R5cGUsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGVsZW1lbnQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiL1wiLCBcIj5cIik7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfVEFHX05BTUUpO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXCIvPlwiKSB8fFxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIFtdLCB0cnVlLCB0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX0JSQUNLRVQpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UobmFtZSk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIGZhbHNlLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2UobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWF0Y2goYCR7bmFtZX1gKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogcGFyZW50IH0pO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRyaWJ1dGVzKCk6IE5vZGUuQXR0cmlidXRlW10ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIj5cIiwgXCIvPlwiKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIj1cIiwgXCI+XCIsIFwiLz5cIik7XG4gICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkJMQU5LX0FUVFJJQlVURV9OQU1FKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKFwiJ1wiKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZygnXCInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChcInt7XCIpKSB7IGRlcHRoKys7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPiAwICYmIHRoaXMubWF0Y2goXCJ9fVwiKSkgeyBkZXB0aC0tOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmIHRoaXMucGVlayhcIjxcIikpIHsgYnJlYWs7IH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XG4gICAgaWYgKCFyYXcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0aGlzLmRlY29kZUVudGl0aWVzKHJhdyksIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVFbnRpdGllcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAucmVwbGFjZSgvJm5ic3A7L2csIFwiXFx1MDBhMFwiKVxuICAgICAgLnJlcGxhY2UoLyZsdDsvZywgXCI8XCIpXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIilcbiAgICAgIC5yZXBsYWNlKC8mcXVvdDsvZywgJ1wiJylcbiAgICAgIC5yZXBsYWNlKC8mYXBvczsvZywgXCInXCIpXG4gICAgICAucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpOyAvLyBtdXN0IGJlIGxhc3QgdG8gYXZvaWQgZG91YmxlLWRlY29kaW5nXG4gIH1cblxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKGNsb3Npbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENsYXNzIH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm91dGVDb25maWcge1xuICBwYXRoOiBzdHJpbmc7XG4gIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3M7XG4gIGd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBcIlwiLCBwYXRoKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFBvcFN0YXRlRXZlbnQoXCJwb3BzdGF0ZVwiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaFBhdGgocGF0dGVybjogc3RyaW5nLCBwYXRobmFtZTogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGwge1xuICBpZiAocGF0dGVybiA9PT0gXCIqXCIpIHJldHVybiB7fTtcbiAgY29uc3QgcGF0dGVyblBhcnRzID0gcGF0dGVybi5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBwYXRoUGFydHMgPSBwYXRobmFtZS5zcGxpdChcIi9cIikuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAocGF0dGVyblBhcnRzLmxlbmd0aCAhPT0gcGF0aFBhcnRzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm5QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwYXR0ZXJuUGFydHNbaV0uc3RhcnRzV2l0aChcIjpcIikpIHtcbiAgICAgIHBhcmFtc1twYXR0ZXJuUGFydHNbaV0uc2xpY2UoMSldID0gcGF0aFBhcnRzW2ldO1xuICAgIH0gZWxzZSBpZiAocGF0dGVyblBhcnRzW2ldICE9PSBwYXRoUGFydHNbaV0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgY2xhc3MgUm91dGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcHJpdmF0ZSByb3V0ZXM6IFJvdXRlQ29uZmlnW10gPSBbXTtcblxuICBzZXRSb3V0ZXMocm91dGVzOiBSb3V0ZUNvbmZpZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXMgPSByb3V0ZXM7XG4gIH1cblxuICBvbk1vdW50KCk6IHZvaWQge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgKCkgPT4gdGhpcy5fbmF2aWdhdGUoKSwge1xuICAgICAgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgIH0pO1xuICAgIHRoaXMuX25hdmlnYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9uYXZpZ2F0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBmb3IgKGNvbnN0IHJvdXRlIG9mIHRoaXMucm91dGVzKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBtYXRjaFBhdGgocm91dGUucGF0aCwgcGF0aG5hbWUpO1xuICAgICAgaWYgKHBhcmFtcyA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBpZiAocm91dGUuZ3VhcmQpIHtcbiAgICAgICAgY29uc3QgYWxsb3dlZCA9IGF3YWl0IHJvdXRlLmd1YXJkKCk7XG4gICAgICAgIGlmICghYWxsb3dlZCkgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fbW91bnQocm91dGUuY29tcG9uZW50LCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX21vdW50KENvbXBvbmVudENsYXNzOiBDb21wb25lbnRDbGFzcywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMucmVmIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICghZWxlbWVudCB8fCAhdGhpcy50cmFuc3BpbGVyKSByZXR1cm47XG4gICAgdGhpcy50cmFuc3BpbGVyLm1vdW50Q29tcG9uZW50KENvbXBvbmVudENsYXNzLCBlbGVtZW50LCBwYXJhbXMpO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQm91bmRhcnkge1xuICBwcml2YXRlIHN0YXJ0OiBDb21tZW50O1xuICBwcml2YXRlIGVuZDogQ29tbWVudDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IE5vZGUsIGxhYmVsOiBzdHJpbmcgPSBcImJvdW5kYXJ5XCIpIHtcbiAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tc3RhcnRgKTtcbiAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LWVuZGApO1xuICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGhpcy5zdGFydCk7XG4gICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHRoaXMuZW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuc3RhcnQpO1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZW5kKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIHRvUmVtb3ZlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRvUmVtb3ZlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmVuZC5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUobm9kZSwgdGhpcy5lbmQpO1xuICB9XG5cbiAgcHVibGljIG5vZGVzKCk6IE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBOb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBOb2RlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucGFyZW50Tm9kZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBoYW5kbGVFcnJvciB9IGZyb20gXCIuL2Vycm9yLWhhbmRsZXJcIjtcblxudHlwZSBUYXNrID0gKCkgPT4gdm9pZDtcblxuY29uc3QgcXVldWUgPSBuZXcgTWFwPENvbXBvbmVudCwgVGFza1tdPigpO1xuY29uc3QgbmV4dFRpY2tDYWxsYmFja3M6IFRhc2tbXSA9IFtdO1xubGV0IGlzU2NoZWR1bGVkID0gZmFsc2U7XG5sZXQgYmF0Y2hpbmdFbmFibGVkID0gdHJ1ZTtcblxuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGlzU2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gMS4gUHJvY2VzcyBjb21wb25lbnQgdXBkYXRlc1xuICBmb3IgKGNvbnN0IFtpbnN0YW5jZSwgdGFza3NdIG9mIHF1ZXVlLmVudHJpZXMoKSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBDYWxsIHByZS11cGRhdGUgaG9vayAob25seSBmb3IgcmVhY3RpdmUgdXBkYXRlcywgbm90IGZpcnN0IG1vdW50KVxuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vbkNoYW5nZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBpbnN0YW5jZS5vbkNoYW5nZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gUnVuIGFsbCBzdXJnaWNhbCBET00gdXBkYXRlcyBmb3IgdGhpcyBjb21wb25lbnRcbiAgICAgIGZvciAoY29uc3QgdGFzayBvZiB0YXNrcykge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbGwgcG9zdC11cGRhdGUgaG9va1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaGFuZGxlRXJyb3IoZSwgJ3JlbmRlcicsIGluc3RhbmNlKTtcbiAgICB9XG4gIH1cbiAgcXVldWUuY2xlYXIoKTtcblxuICAvLyAyLiBQcm9jZXNzIG5leHRUaWNrIGNhbGxiYWNrc1xuICBjb25zdCBjYWxsYmFja3MgPSBuZXh0VGlja0NhbGxiYWNrcy5zcGxpY2UoMCk7XG4gIGZvciAoY29uc3QgY2Igb2YgY2FsbGJhY2tzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNiKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaGFuZGxlRXJyb3IoZSwgJ3JlbmRlcicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVldWVVcGRhdGUoaW5zdGFuY2U6IENvbXBvbmVudCwgdGFzazogVGFzaykge1xuICBpZiAoIWJhdGNoaW5nRW5hYmxlZCkge1xuICAgIHRhc2soKTtcbiAgICAvLyBEdXJpbmcgc3luYyBtb3VudCwgd2UgZG9uJ3QgY2FsbCBvbkNoYW5nZXMgb3Igb25SZW5kZXIgaGVyZS5cbiAgICAvLyBvblJlbmRlciBpcyBjYWxsZWQgbWFudWFsbHkgYXQgdGhlIGVuZCBvZiB0cmFuc3BpbGUvYm9vdHN0cmFwLlxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghcXVldWUuaGFzKGluc3RhbmNlKSkge1xuICAgIHF1ZXVlLnNldChpbnN0YW5jZSwgW10pO1xuICB9XG4gIHF1ZXVlLmdldChpbnN0YW5jZSkhLnB1c2godGFzayk7XG5cbiAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFeGVjdXRlcyBhIGZ1bmN0aW9uIHdpdGggYmF0Y2hpbmcgZGlzYWJsZWQuIFxuICogVXNlZCBmb3IgaW5pdGlhbCBtb3VudCBhbmQgbWFudWFsIHJlbmRlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbHVzaFN5bmMoZm46ICgpID0+IHZvaWQpIHtcbiAgY29uc3QgcHJldiA9IGJhdGNoaW5nRW5hYmxlZDtcbiAgYmF0Y2hpbmdFbmFibGVkID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgZm4oKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBiYXRjaGluZ0VuYWJsZWQgPSBwcmV2O1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciB0aGUgbmV4dCBmcmFtZXdvcmsgdXBkYXRlIGN5Y2xlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soKTogUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYjogVGFzayk6IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2I/OiBUYXNrKTogUHJvbWlzZTx2b2lkPiB8IHZvaWQge1xuICBpZiAoY2IpIHtcbiAgICBuZXh0VGlja0NhbGxiYWNrcy5wdXNoKGNiKTtcbiAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIG5leHRUaWNrQ2FsbGJhY2tzLnB1c2gocmVzb2x2ZSk7XG4gICAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgcXVldWVNaWNyb3Rhc2soZmx1c2gpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRDbGFzcywgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgSW50ZXJwcmV0ZXIgfSBmcm9tIFwiLi9pbnRlcnByZXRlclwiO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZUNvbmZpZyB9IGZyb20gXCIuL3JvdXRlclwiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IGVmZmVjdCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgQm91bmRhcnkgfSBmcm9tIFwiLi9ib3VuZGFyeVwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IHF1ZXVlVXBkYXRlLCBmbHVzaFN5bmMgfSBmcm9tIFwiLi9zY2hlZHVsZXJcIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG5jb25zdCBLRVlfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gIGVzYzogW1wiRXNjYXBlXCIsIFwiRXNjXCJdLFxuICBlc2NhcGU6IFtcIkVzY2FwZVwiLCBcIkVzY1wiXSxcbiAgc3BhY2U6IFtcIiBcIiwgXCJTcGFjZWJhclwiXSxcbiAgdXA6IFtcIkFycm93VXBcIiwgXCJVcFwiXSxcbiAgZG93bjogW1wiQXJyb3dEb3duXCIsIFwiRG93blwiXSxcbiAgbGVmdDogW1wiQXJyb3dMZWZ0XCIsIFwiTGVmdFwiXSxcbiAgcmlnaHQ6IFtcIkFycm93UmlnaHRcIiwgXCJSaWdodFwiXSxcbiAgZGVsOiBbXCJEZWxldGVcIiwgXCJEZWxcIl0sXG4gIGRlbGV0ZTogW1wiRGVsZXRlXCIsIFwiRGVsXCJdLFxuICBpbnM6IFtcIkluc2VydFwiXSxcbiAgZG90OiBbXCIuXCJdLFxuICBjb21tYTogW1wiLFwiXSxcbiAgc2xhc2g6IFtcIi9cIl0sXG4gIGJhY2tzbGFzaDogW1wiXFxcXFwiXSxcbiAgcGx1czogW1wiK1wiXSxcbiAgbWludXM6IFtcIi1cIl0sXG4gIGVxdWFsOiBbXCI9XCJdLFxufTtcblxudHlwZSBJZkVsc2VOb2RlID0gW0tOb2RlLkVsZW1lbnQsIEtOb2RlLkF0dHJpYnV0ZV07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuICBwcml2YXRlIHRlbXBsYXRlUGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHByaXZhdGUgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIoKTtcbiAgcHVibGljIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuICBwdWJsaWMgbW9kZTogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCIgPSBcImRldmVsb3BtZW50XCI7XG4gIHByaXZhdGUgaXNSZW5kZXJpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIHRoaXMucmVnaXN0cnlbXCJyb3V0ZXJcIl0gPSB7IGNvbXBvbmVudDogUm91dGVyIH07XG4gICAgaWYgKCFvcHRpb25zKSByZXR1cm47XG4gICAgaWYgKG9wdGlvbnMucmVnaXN0cnkpIHtcbiAgICAgIHRoaXMucmVnaXN0cnkgPSB7IC4uLnRoaXMucmVnaXN0cnksIC4uLm9wdGlvbnMucmVnaXN0cnkgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckNvbXBvbmVudEluc3RhbmNlKFxuICAgIGluc3RhbmNlOiBhbnksXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgcmVzdG9yZVNjb3BlOiBTY29wZSxcbiAgICBzbG90cz86IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgKTogdm9pZCB7XG4gICAgaWYgKHNsb3RzKSBpbnN0YW5jZS4kc2xvdHMgPSBzbG90cztcblxuICAgIGluc3RhbmNlLiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50KTtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGluc3RhbmNlKTtcbiAgICAgICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGluc3RhbmNlKTtcbiAgICAgICAgaWYgKHNsb3RzKSBpbnN0YW5jZS4kc2xvdHMgPSBzbG90cztcbiAgICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGVsZW1lbnQpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSBpbnN0YW5jZS5vbk1vdW50KCk7XG5cbiAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGluc3RhbmNlKTtcbiAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgaW5zdGFuY2UpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgZWxlbWVudCk7XG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgfSk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlTm9kZXModGFnOiBzdHJpbmcpOiBLTm9kZS5LTm9kZVtdIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMucmVnaXN0cnlbdGFnXTtcbiAgICBpZiAoZW50cnkubm9kZXMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVudHJ5Lm5vZGVzO1xuICAgIGNvbnN0IHNvdXJjZSA9IChlbnRyeS5jb21wb25lbnQgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgZW50cnkubm9kZXMgPSBbXTtcbiAgICAgIHJldHVybiBlbnRyeS5ub2RlcztcbiAgICB9XG4gICAgZW50cnkubm9kZXMgPSB0aGlzLnRlbXBsYXRlUGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIGVudHJ5Lm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcbiAgICAgIGNvbnN0IG1pc3BsYWNlZCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlbHNlaWZcIiwgXCJAZWxzZVwiXSk7XG4gICAgICBpZiAobWlzcGxhY2VkKSB7XG4gICAgICAgIC8vIFRoZXNlIGFyZSBoYW5kbGVkIGJ5IGRvSWYsIGlmIHdlIHJlYWNoIHRoZW0gaGVyZSBpdCdzIGFuIGVycm9yXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtaXNwbGFjZWQubmFtZS5zdGFydHNXaXRoKFwiQFwiKSA/IG1pc3BsYWNlZC5uYW1lLnNsaWNlKDEpIDogbWlzcGxhY2VkLm5hbWU7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNQTEFDRURfQ09ORElUSU9OQUwsIHsgbmFtZTogbmFtZSB9LCBlbC5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbm9kZS5hY2NlcHQodGhpcywgcGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZE1ldGhvZHMoZW50aXR5OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0eSB8fCB0eXBlb2YgZW50aXR5ICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZW50aXR5KTtcbiAgICB3aGlsZSAocHJvdG8gJiYgcHJvdG8gIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywga2V5KT8uZ2V0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBXcmFwcyBhIHJlZnJlc2ggZnVuY3Rpb24gc28gaXQgcmVzdG9yZXMgdGhlIGNvcnJlY3Qgc2NvcGUgd2hlbiBjYWxsZWRcbiAgLy8gZGlyZWN0bHkgYnkgdHJpZ2dlclJlZnJlc2ggKG91dHNpZGUgb2YgdGhlIHNpZ25hbCBlZmZlY3QgbWFjaGluZXJ5KS5cbiAgcHJpdmF0ZSBzY29wZWRSZWZyZXNoKGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3BpbGUoXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZW50aXR5OiBhbnksXG4gICAgY29udGFpbmVyOiBFbGVtZW50XG4gICk6IE5vZGUge1xuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBlbnRpdHkpO1xuXG4gICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgICAgICB0aGlzLnRyaWdnZXJSZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCAoKSA9PiB7XG4gICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ciA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShub2RlLm5hbWUpO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGF0dHIudmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFja0VmZmVjdChhdHRyLCBzdG9wKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIChwYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKF9ub2RlOiBLTm9kZS5Db21tZW50LCBfcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIC8vIHRlbXBsYXRlIGNvbW1lbnRzIGFyZSBzdHJpcHBlZCBmcm9tIERPTSBvdXRwdXRcbiAgfVxuXG4gIHByaXZhdGUgdHJhY2tFZmZlY3QodGFyZ2V0OiBhbnksIHN0b3A6IGFueSkge1xuICAgIGlmICghdGFyZ2V0LiRrYXNwZXJFZmZlY3RzKSB0YXJnZXQuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB0YXJnZXQuJGthc3BlckVmZmVjdHMucHVzaChzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEF0dHIoXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcbiAgICBuYW1lOiBzdHJpbmdbXVxuICApOiBLTm9kZS5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuYXR0cmlidXRlcyB8fCAhbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmliID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+XG4gICAgICBuYW1lLmluY2x1ZGVzKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZSlcbiAgICApO1xuICAgIGlmIChhdHRyaWIpIHtcbiAgICAgIHJldHVybiBhdHRyaWIgYXMgS05vZGUuQXR0cmlidXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9JZihleHByZXNzaW9uczogSWZFbHNlTm9kZVtdLCBwYXJlbnQ6IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiaWZcIik7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0cmFja2luZ1Njb3BlID0gaW5zdGFuY2UgPyBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSkgOiB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuXG4gICAgICAvLyBFdmFsdWF0ZSBjb25kaXRpb25zIHN5bmNocm9ub3VzbHkgdG8gZW5zdXJlIHNpZ25hbCB0cmFja2luZ1xuICAgICAgY29uc3QgcmVzdWx0czogYm9vbGVhbltdID0gW107XG4gICAgICByZXN1bHRzLnB1c2goISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25zWzBdWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpKTtcblxuICAgICAgaWYgKCFyZXN1bHRzWzBdKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxKSkge1xuICAgICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICEhdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHZhbCk7XG4gICAgICAgICAgICBpZiAodmFsKSBicmVhaztcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZVwiXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gdHJhY2tpbmdTY29wZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0c1swXSkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnNbMF1bMF0uYWNjZXB0KHRoaXMsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0c1tpXSkge1xuICAgICAgICAgICAgICBleHByZXNzaW9uc1tpXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHRoaXMuc2NvcGVkUmVmcmVzaChydW4pO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuICAgIGlmIChrZXlBdHRyKSB7XG4gICAgICB0aGlzLmRvRWFjaEtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCwga2V5QXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9FYWNoVW5rZXllZChlYWNoLCBub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoVW5rZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChrZXkpIHNjb3BlVmFsdWVzW2tleV0gPSBpbmRleDtcblxuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHRoaXMuc2NvcGVkUmVmcmVzaChydW4pO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIHRyaWdnZXJSZWZyZXNoKG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICAvLyAxLiBSZS1ydW4gc3RydWN0dXJhbCBsb2dpYyAoaWYvZWFjaC93aGlsZSlcbiAgICBpZiAoKG5vZGUgYXMgYW55KS4ka2FzcGVyUmVmcmVzaCkge1xuICAgICAgKG5vZGUgYXMgYW55KS4ka2FzcGVyUmVmcmVzaCgpO1xuICAgIH1cblxuICAgIC8vIDIuIFJlLXJ1biBhbGwgc3VyZ2ljYWwgZWZmZWN0cyAodGV4dCBpbnRlcnBvbGF0aW9uLCBhdHRyaWJ1dGVzLCBldGMuKVxuICAgIGlmICgobm9kZSBhcyBhbnkpLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAobm9kZSBhcyBhbnkpLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6IGFueSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHN0b3AucnVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdG9wLnJ1bigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAzLiBSZWN1cnNlXG4gICAgbm9kZS5jaGlsZE5vZGVzPy5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy50cmlnZ2VyUmVmcmVzaChjaGlsZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hLZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSwga2V5QXR0cjogS05vZGUuQXR0cmlidXRlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgY29uc3Qga2V5ZWROb2RlcyA9IG5ldyBNYXA8YW55LCBOb2RlPigpO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwgaW5kZXhLZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IGl0ZW1zIGFuZCB0aGVpciBrZXlzIGltbWVkaWF0ZWx5XG4gICAgICBjb25zdCBuZXdJdGVtczogQXJyYXk8eyBpdGVtOiBhbnk7IGlkeDogbnVtYmVyOyBrZXk6IGFueSB9PiA9IFtdO1xuICAgICAgY29uc3Qgc2VlbktleXMgPSBuZXcgU2V0KCk7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGluZGV4O1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5leGVjdXRlKGtleUF0dHIudmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBzZWVuS2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgW0thc3Blcl0gRHVwbGljYXRlIGtleSBkZXRlY3RlZCBpbiBAZWFjaDogXCIke2tleX1cIi4gS2V5cyBtdXN0IGJlIHVuaXF1ZSB0byBlbnN1cmUgY29ycmVjdCByZWNvbmNpbGlhdGlvbi5gKTtcbiAgICAgICAgfVxuICAgICAgICBzZWVuS2V5cy5hZGQoa2V5KTtcblxuICAgICAgICBuZXdJdGVtcy5wdXNoKHsgaXRlbTogaXRlbSwgaWR4OiBpbmRleCwga2V5OiBrZXkgfSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgIC8vIERlc3Ryb3kgbm9kZXMgd2hvc2Uga2V5cyBhcmUgbm8gbG9uZ2VyIHByZXNlbnRcbiAgICAgICAgY29uc3QgbmV3S2V5U2V0ID0gbmV3IFNldChuZXdJdGVtcy5tYXAoKGkpID0+IGkua2V5KSk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZG9tTm9kZV0gb2Yga2V5ZWROb2Rlcykge1xuICAgICAgICAgIGlmICghbmV3S2V5U2V0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lOb2RlKGRvbU5vZGUpO1xuICAgICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChkb21Ob2RlKTtcbiAgICAgICAgICAgIGtleWVkTm9kZXMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5zZXJ0L3JldXNlIG5vZGVzIGluIG5ldyBvcmRlciB1c2luZyBhIGN1cnNvciB0byBhdm9pZCB1bm5lY2Vzc2FyeSBtb3Zlc1xuICAgICAgICBjb25zdCBwYXJlbnQgPSAoYm91bmRhcnkgYXMgYW55KS5lbmQucGFyZW50Tm9kZSBhcyBOb2RlO1xuICAgICAgICBsZXQgbGFzdEluc2VydGVkOiBOb2RlID0gKGJvdW5kYXJ5IGFzIGFueSkuc3RhcnQ7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGl0ZW0sIGlkeCwga2V5IH0gb2YgbmV3SXRlbXMpIHtcbiAgICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGlkeDtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcblxuICAgICAgICAgIGlmIChrZXllZE5vZGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBkb21Ob2RlID0ga2V5ZWROb2Rlcy5nZXQoa2V5KSE7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgbW92ZSB0aGUgbm9kZSBpZiBpdCdzIG5vdCBhbHJlYWR5IGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAobGFzdEluc2VydGVkLm5leHRTaWJsaW5nICE9PSBkb21Ob2RlKSB7XG4gICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgbGFzdEluc2VydGVkLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RJbnNlcnRlZCA9IGRvbU5vZGU7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzY29wZSBhbmQgdHJpZ2dlciByZS1yZW5kZXIgb2YgbmVzdGVkIHN0cnVjdHVyYWwgZGlyZWN0aXZlc1xuICAgICAgICAgICAgY29uc3Qgbm9kZVNjb3BlID0gKGRvbU5vZGUgYXMgYW55KS4ka2FzcGVyU2NvcGU7XG4gICAgICAgICAgICBpZiAobm9kZVNjb3BlKSB7XG4gICAgICAgICAgICAgIG5vZGVTY29wZS5zZXQobmFtZSwgaXRlbSk7XG4gICAgICAgICAgICAgIGlmIChpbmRleEtleSkgbm9kZVNjb3BlLnNldChpbmRleEtleSwgaWR4KTtcblxuICAgICAgICAgICAgICAvLyBJZiBpdCBoYXMgaXRzIG93biByZW5kZXIgbG9naWMgKG5lc3RlZCBlYWNoL2lmKSwgdHJpZ2dlciBpdCByZWN1cnNpdmVseVxuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJSZWZyZXNoKGRvbU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICBpZiAoY3JlYXRlZCkge1xuICAgICAgICAgICAgICAvLyBjcmVhdGVFbGVtZW50IGluc2VydHMgYmVmb3JlIGVuZDsgbW92ZSB0byBjb3JyZWN0IHBvc2l0aW9uIGlmIG5lZWRlZFxuICAgICAgICAgICAgICBpZiAobGFzdEluc2VydGVkLm5leHRTaWJsaW5nICE9PSBjcmVhdGVkKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjcmVhdGVkLCBsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxhc3RJbnNlcnRlZCA9IGNyZWF0ZWQ7XG4gICAgICAgICAgICAgIGtleWVkTm9kZXMuc2V0KGtleSwgY3JlYXRlZCk7XG4gICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBzY29wZSBvbiB0aGUgRE9NIG5vZGUgc28gd2UgY2FuIHVwZGF0ZSBpdCBsYXRlclxuICAgICAgICAgICAgICAoY3JlYXRlZCBhcyBhbnkpLiRrYXNwZXJTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgICAgfTtcblxuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCB0YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhc2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgKGJvdW5kYXJ5IGFzIGFueSkuc3RhcnQuJGthc3BlclJlZnJlc2ggPSB0aGlzLnNjb3BlZFJlZnJlc2gocnVuKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZVNpYmxpbmdzKG5vZGVzOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSAwO1xuICAgIGNvbnN0IGluaXRpYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgbGV0IGdyb3VwU2NvcGU6IFNjb3BlIHwgbnVsbCA9IG51bGw7XG5cbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcblxuICAgICAgICAvLyAxLiBQcm9jZXNzIEBsZXQgKGxlYWtzIHRvIHNpYmxpbmdzIGFuZCBhdmFpbGFibGUgdG8gb3RoZXIgZGlyZWN0aXZlcyBvbiB0aGlzIG5vZGUpXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICBpZiAoIWdyb3VwU2NvcGUpIHtcbiAgICAgICAgICAgIGdyb3VwU2NvcGUgPSBuZXcgU2NvcGUoaW5pdGlhbFNjb3BlKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBncm91cFNjb3BlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmV4ZWN1dGUoJGxldC52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAyLiBWYWxpZGF0aW9uOiBTdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgICBjb25zdCBpZkF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAaWZcIl0pO1xuICAgICAgICBjb25zdCBlbHNlaWZBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VpZlwiXSk7XG4gICAgICAgIGNvbnN0IGVsc2VBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VcIl0pO1xuICAgICAgICBjb25zdCAkZWFjaCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlYWNoXCJdKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlID09PSBcImRldmVsb3BtZW50XCIpIHtcbiAgICAgICAgICBjb25zdCBzdHJ1Y3R1cmFsQ291bnQgPSBbaWZBdHRyLCBlbHNlaWZBdHRyLCBlbHNlQXR0ciwgJGVhY2hdLmZpbHRlcihhID0+IGEpLmxlbmd0aDtcbiAgICAgICAgICBpZiAoc3RydWN0dXJhbENvdW50ID4gMSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUywge30sIGVsLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIFByb2Nlc3Mgc3RydWN0dXJhbCBkaXJlY3RpdmVzIChvbmUgd2lsbCBtYXRjaCBhbmQgY29udGludWUpXG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBlbCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWZBdHRyKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbZWwsIGlmQXR0cl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBub2Rlc1tjdXJyZW50XTtcbiAgICAgICAgICAgIGlmIChuZXh0LnR5cGUgIT09IFwiZWxlbWVudFwiKSBicmVhaztcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5leHQgYXMgS05vZGUuRWxlbWVudCwgW1xuICAgICAgICAgICAgICBcIkBlbHNlXCIsXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKFtuZXh0IGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IGluaXRpYWxTY29wZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudChub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChub2RlLm5hbWUgPT09IFwic2xvdFwiKSB7XG4gICAgICAgIGNvbnN0IG5hbWVBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAbmFtZVwiXSk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lQXR0ciA/IG5hbWVBdHRyLnZhbHVlIDogXCJkZWZhdWx0XCI7XG4gICAgICAgIGNvbnN0IHNsb3RzID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkc2xvdHNcIik7XG4gICAgICAgIGlmIChzbG90cyAmJiBzbG90c1tuYW1lXSkge1xuICAgICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIHNjb3BlIHdoZXJlIHRoZSBzbG90IGNvbnRlbnQgd2FzIGRlZmluZWQgKExleGljYWwgU2NvcGluZykuXG4gICAgICAgICAgLy8gV2Ugc3RvcmUgdGhlIHNjb3BlIHJlZmVyZW5jZSBkaXJlY3RseSBvbiB0aGUgQXJyYXkgaW5zdGFuY2UgdG8gYXZvaWQgY2hhbmdpbmcgc2lnbmF0dXJlcy5cbiAgICAgICAgICBpZiAoc2xvdHNbbmFtZV0uc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzbG90c1tuYW1lXS5zY29wZTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuXG4gICAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQ29tcG9uZW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgICAgbGV0IGNvbXBvbmVudDogYW55ID0ge307XG4gICAgICAgIGNvbnN0IGFyZ3NBdHRyID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnc0F0dHIgYXMgS05vZGUuQXR0cmlidXRlW10pO1xuXG4gICAgICAgIC8vIENhcHR1cmUgY2hpbGRyZW4gZm9yIHNsb3RzLiBcbiAgICAgICAgLy8gV2UgdXNlIGEgcGxhaW4gb2JqZWN0IGtleWVkIGJ5IHNsb3QgbmFtZS4gRWFjaCB2YWx1ZSBpcyBhbiBBcnJheSBvZiBLTm9kZXMuXG4gICAgICAgIC8vIFRvIHN1cHBvcnQgbGV4aWNhbCBzY29waW5nLCB3ZSBhdHRhY2ggdGhlIGN1cnJlbnQgc2NvcGUgdG8gdGhlIEFycmF5IGluc3RhbmNlLlxuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgZGVmYXVsdDogW10gfTtcbiAgICAgICAgc2xvdHMuZGVmYXVsdC5zY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBzbG90XCJdKTtcbiAgICAgICAgICAgIGlmIChzbG90QXR0cikge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc2xvdEF0dHIudmFsdWU7XG4gICAgICAgICAgICAgIGlmICghc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBzbG90c1tuYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgIHNsb3RzW25hbWVdLnNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzbG90c1tuYW1lXS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsb3RzLmRlZmF1bHQucHVzaChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5sYXp5KSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG5cbiAgICAgICAgICBpZiAoZW50cnkuZmFsbGJhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrTm9kZXMgPSB0aGlzLnRlbXBsYXRlUGFyc2VyLnBhcnNlKChlbnRyeS5mYWxsYmFjayBhcyBhbnkpLnRlbXBsYXRlID8/IFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tJbnN0YW5jZTogYW55ID0gbmV3IGVudHJ5LmZhbGxiYWNrKHsgYXJnczoge30sIHJlZjogZWxlbWVudCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoZmFsbGJhY2tJbnN0YW5jZSk7XG4gICAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGZhbGxiYWNrSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGZhbGxiYWNrSW5zdGFuY2UsIGZhbGxiYWNrTm9kZXMsIGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHJlc3RvcmVTY29wZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCEoZW50cnkgYXMgYW55KS5fcHJvbWlzZSkge1xuICAgICAgICAgICAgKGVudHJ5IGFzIGFueSkuX3Byb21pc2UgPSAoZW50cnkuY29tcG9uZW50IGFzICgpID0+IFByb21pc2U8Q29tcG9uZW50Q2xhc3M+KSgpLnRoZW4oKGNscykgPT4ge1xuICAgICAgICAgICAgICBlbnRyeS5ub2RlcyA9IHRoaXMudGVtcGxhdGVQYXJzZXIucGFyc2UoKGNscyBhcyBhbnkpLnRlbXBsYXRlID8/IFwiXCIpO1xuICAgICAgICAgICAgICBlbnRyeS5jb21wb25lbnQgPSBjbHM7XG4gICAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5sYXp5O1xuICAgICAgICAgICAgICBkZWxldGUgKGVudHJ5IGFzIGFueSkuX3Byb21pc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAoZW50cnkgYXMgYW55KS5fcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3QgY2xzID0gZW50cnkuY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2U6IGFueSA9IG5ldyBjbHMoeyBhcmdzOiBhcmdzLCByZWY6IGVsZW1lbnQsIHRyYW5zcGlsZXI6IHRoaXMgfSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGluc3RhbmNlKTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGluc3RhbmNlLCBlbnRyeS5ub2RlcyEsIGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHJlc3RvcmVTY29wZSwgc2xvdHMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLmNvbXBvbmVudCBhcyBDb21wb25lbnRDbGFzcykoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBpZiAobm9kZS5uYW1lID09PSBcInJvdXRlclwiICYmIGNvbXBvbmVudCBpbnN0YW5jZW9mIFJvdXRlcikge1xuICAgICAgICAgICAgY29uc3Qgcm91dGVTY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0Um91dGVzKHRoaXMuZXh0cmFjdFJvdXRlcyhub2RlLmNoaWxkcmVuLCB1bmRlZmluZWQsIHJvdXRlU2NvcGUpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGNvbXBvbmVudCwgdGhpcy5yZXNvbHZlTm9kZXMobm9kZS5uYW1lKSwgZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcmVzdG9yZVNjb3BlLCBzbG90cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWb2lkKSB7XG4gICAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgICAgY29uc3QgZXZlbnRzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudCBhcyBLTm9kZS5BdHRyaWJ1dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgZmlyc3QpXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAgIChhdHRyKSA9PiAhKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGF0dHIsIGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvcnRoYW5kIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBzZWNvbmQsIGFsbG93cyBtZXJnaW5nKVxuICAgICAgICBjb25zdCBzaG9ydGhhbmRBdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG5hbWUuc3RhcnRzV2l0aChcIkBcIikgJiZcbiAgICAgICAgICAgICFbXCJAaWZcIiwgXCJAZWxzZWlmXCIsIFwiQGVsc2VcIiwgXCJAZWFjaFwiLCBcIkBsZXRcIiwgXCJAa2V5XCIsIFwiQHJlZlwiXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIikgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzaG9ydGhhbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgcmVhbE5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZkF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkByZWZcIl0pO1xuICAgICAgaWYgKHJlZkF0dHIgJiYgIWlzVm9pZCkge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHJlZkF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KHByb3BOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB0aHJvdyBlLndpdGhUYWcobm9kZS5uYW1lKTtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5SVU5USU1FX0VSUk9SLCB7IG1lc3NhZ2U6IGUubWVzc2FnZSB8fCBgJHtlfWAgfSwgbm9kZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBrZXkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwib25cIikpIHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IGFyZy52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IGlzQ2FsbEV4cHIgPSAvXltcXHckLl1bXFx3JC5dKlxccypcXCguKlxcKVxccyokLy50ZXN0KHRyaW1tZWQpICYmICF0cmltbWVkLmluY2x1ZGVzKFwiPT5cIik7XG4gICAgICAgIGlmIChpc0NhbGxFeHByKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFtLYXNwZXJdIEA6JHtrZXl9PVwiJHthcmcudmFsdWV9XCIg4oCUIHRoZSBleHByZXNzaW9uIGlzIGNhbGxlZCBkdXJpbmcgcmVuZGVyIGFuZCBpdHMgcmV0dXJuIHZhbHVlIGlzIHBhc3NlZCBhcyB0aGUgcHJvcC4gYCArXG4gICAgICAgICAgICBgSWYgaXQgcmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0IGZ1bmN0aW9uIGJlY29tZXMgdGhlIGhhbmRsZXIgKGZhY3RvcnkgcGF0dGVybikuIGAgK1xuICAgICAgICAgICAgYElmIGl0IHJldHVybnMgdW5kZWZpbmVkLCB0aGUgcHJvcCByZWNlaXZlcyB1bmRlZmluZWQuIGAgK1xuICAgICAgICAgICAgYElmIHRoZSBmdW5jdGlvbiBoYXMgcmVhY3RpdmUgc2lkZSBlZmZlY3RzLCBlbnN1cmUgaXQgZG9lcyBub3QgYm90aCByZWFkIGFuZCB3cml0ZSB0aGUgc2FtZSBzaWduYWwuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5leGVjdXRlKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgW2V2ZW50TmFtZSwgLi4ubW9kaWZpZXJzXSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGxpc3RlbmVyU2NvcGUgPSBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbCA9IGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkgb3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSkgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcblxuICAgIC8vIEFueXRoaW5nIG5vdCBpbiB0aGlzIGxpc3QgaXMgdHJlYXRlZCBhcyBhIHBvdGVudGlhbCBrZXkgbW9kaWZpZXJcbiAgICBjb25zdCBjb250cm9sTW9kaWZpZXJzID0gW1wicHJldmVudFwiLCBcInN0b3BcIiwgXCJvbmNlXCIsIFwicGFzc2l2ZVwiLCBcImNhcHR1cmVcIiwgXCJjdHJsXCIsIFwic2hpZnRcIiwgXCJhbHRcIiwgXCJtZXRhXCJdO1xuICAgIGNvbnN0IHBvdGVudGlhbEtleU1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKG0pID0+ICFjb250cm9sTW9kaWZpZXJzLmluY2x1ZGVzKG0udG9Mb3dlckNhc2UoKSkpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgZXZlbnROYW1lLFxuICAgICAgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHBvdGVudGlhbEtleU1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlZCA9IHBvdGVudGlhbEtleU1vZGlmaWVycy5zb21lKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb3dlck0gPSBtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoS0VZX01BUFtsb3dlck1dICYmIEtFWV9NQVBbbG93ZXJNXS5pbmNsdWRlcyhldmVudC5rZXkpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb3dlck0gPT09IGV2ZW50LmtleT8udG9Mb3dlckNhc2UoKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImN0cmxcIikgJiYgIWV2ZW50LmN0cmxLZXkpIHJldHVybjtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInNoaWZ0XCIpICYmICFldmVudC5zaGlmdEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYWx0XCIpICYmICFldmVudC5hbHRLZXkpIHJldHVybjtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm1ldGFcIikgJiYgIWV2ZW50Lm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBsaXN0ZW5lclNjb3BlKTtcbiAgICAgIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xce1xcey4rXFx9XFx9L21zO1xuICAgIGlmIChyZWdleC50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZywgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSBgJHt0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pfWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lOb2RlKG5vZGU6IGFueSk6IHZvaWQge1xuICAgIC8vIDEuIENsZWFudXAgY29tcG9uZW50IGluc3RhbmNlXG4gICAgaWYgKG5vZGUuJGthc3Blckluc3RhbmNlKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5vZGUuJGthc3Blckluc3RhbmNlO1xuICAgICAgaWYgKGluc3RhbmNlLm9uRGVzdHJveSkge1xuICAgICAgICBpbnN0YW5jZS5vbkRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuXG4gICAgLy8gMi4gQ2xlYW51cCBlZmZlY3RzIGF0dGFjaGVkIHRvIHRoZSBub2RlXG4gICAgaWYgKG5vZGUuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyAzLiBDbGVhbnVwIGVmZmVjdHMgb24gYXR0cmlidXRlc1xuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChhdHRyLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDQuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkOiBhbnkpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KGNvbnRhaW5lcjogRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgbW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSAoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKSByZXR1cm47XG5cbiAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVQYXJzZXIucGFyc2UodGVtcGxhdGUpO1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChob3N0KTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRDbGFzcyh7IGFyZ3M6IHsgcGFyYW1zOiBwYXJhbXMgfSwgcmVmOiBob3N0LCB0cmFuc3BpbGVyOiB0aGlzIH0pO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAoaG9zdCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgIGNvbnN0IGNvbXBvbmVudE5vZGVzID0gbm9kZXM7XG4gICAgY29tcG9uZW50LiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGVzdHJveShob3N0KTtcbiAgICAgICAgaG9zdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcblxuICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3MoY29tcG9uZW50Tm9kZXMsIGhvc3QpO1xuICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUobnVsbCwgY29tcG9uZW50KTtcbiAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICBjb25zdCBwcmV2ID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG5cbiAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgaG9zdCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uTW91bnQoKTtcbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBleHRyYWN0Um91dGVzKGNoaWxkcmVuOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnRHdWFyZD86ICgpID0+IFByb21pc2U8Ym9vbGVhbj4sIHNjb3BlPzogU2NvcGUpOiBSb3V0ZUNvbmZpZ1tdIHtcbiAgICBjb25zdCByb3V0ZXM6IFJvdXRlQ29uZmlnW10gPSBbXTtcbiAgICBjb25zdCBwcmV2U2NvcGUgPSBzY29wZSA/IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHNjb3BlKSB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLnR5cGUgIT09IFwiZWxlbWVudFwiKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGVsID0gY2hpbGQgYXMgS05vZGUuRWxlbWVudDtcbiAgICAgIGlmIChlbC5uYW1lID09PSBcInJvdXRlXCIpIHtcbiAgICAgICAgY29uc3QgcGF0aEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAcGF0aFwiXSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAY29tcG9uZW50XCJdKTtcbiAgICAgICAgY29uc3QgZ3VhcmRBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGd1YXJkXCJdKTtcblxuICAgICAgICBpZiAoIXBhdGhBdHRyIHx8ICFjb21wb25lbnRBdHRyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1JU1NJTkdfUkVRVUlSRURfQVRUUiwgeyBtZXNzYWdlOiBcIjxyb3V0ZT4gcmVxdWlyZXMgQHBhdGggYW5kIEBjb21wb25lbnQgYXR0cmlidXRlcy5cIiB9LCBlbC5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhdGggPSBwYXRoQXR0ciEudmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuZXhlY3V0ZShjb21wb25lbnRBdHRyIS52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGd1YXJkID0gZ3VhcmRBdHRyID8gdGhpcy5leGVjdXRlKGd1YXJkQXR0ci52YWx1ZSkgOiBwYXJlbnRHdWFyZDtcbiAgICAgICAgcm91dGVzLnB1c2goeyBwYXRoOiBwYXRoLCBjb21wb25lbnQ6IGNvbXBvbmVudCwgZ3VhcmQ6IGd1YXJkIH0pO1xuICAgICAgfSBlbHNlIGlmIChlbC5uYW1lID09PSBcImd1YXJkXCIpIHtcbiAgICAgICAgY29uc3QgY2hlY2tBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGNoZWNrXCJdKTtcbiAgICAgICAgaWYgKCFjaGVja0F0dHIpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTU0lOR19SRVFVSVJFRF9BVFRSLCB7IG1lc3NhZ2U6IFwiPGd1YXJkPiByZXF1aXJlcyBAY2hlY2sgYXR0cmlidXRlLlwiIH0sIGVsLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjaGVja0F0dHIpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBjaGVjayA9IHRoaXMuZXhlY3V0ZShjaGVja0F0dHIudmFsdWUpO1xuICAgICAgICByb3V0ZXMucHVzaCguLi50aGlzLmV4dHJhY3RSb3V0ZXMoZWwuY2hpbGRyZW4sIGNoZWNrKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUmVuZGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmVuZGVyaW5nKSByZXR1cm47XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICBpZiAoaW5zdGFuY2UgJiYgdHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RG9jdHlwZUtOb2RlKF9ub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnksIHRhZ05hbWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgZmluYWxBcmdzID0gYXJncztcbiAgICBpZiAodHlwZW9mIGFyZ3MgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IGFyZ3MuaW5jbHVkZXMoXCJSdW50aW1lIEVycm9yXCIpXG4gICAgICAgID8gYXJncy5yZXBsYWNlKFwiUnVudGltZSBFcnJvcjogXCIsIFwiXCIpXG4gICAgICAgIDogYXJncztcbiAgICAgIGZpbmFsQXJncyA9IHsgbWVzc2FnZTogY2xlYW5NZXNzYWdlIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGZpbmFsQXJncywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRhZ05hbWUpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudENsYXNzLCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgeyBzZXRFcnJvckhhbmRsZXIsIEVycm9ySGFuZGxlckZuIH0gZnJvbSBcIi4vZXJyb3ItaGFuZGxlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShcbiAgaW1wb3J0ZXI6ICgpID0+IFByb21pc2U8UmVjb3JkPHN0cmluZywgQ29tcG9uZW50Q2xhc3M+PlxuKTogeyBjb21wb25lbnQ6ICgpID0+IFByb21pc2U8Q29tcG9uZW50Q2xhc3M+OyBsYXp5OiB0cnVlIH0ge1xuICByZXR1cm4ge1xuICAgIGxhenk6IHRydWUsXG4gICAgY29tcG9uZW50OiAoKSA9PiBpbXBvcnRlcigpLnRoZW4oKG0pID0+IE9iamVjdC52YWx1ZXMobSlbMF0pLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICB0cnkge1xuICAgIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcGlsZShcbiAgc291cmNlOiBzdHJpbmcsXG4gIGVudGl0eT86IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gIGNvbnRhaW5lcj86IEhUTUxFbGVtZW50LFxuICByZWdpc3RyeT86IENvbXBvbmVudFJlZ2lzdHJ5XG4pOiBOb2RlIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB8fCB7fSB9KTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudGl0eSB8fCB7fSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLYXNwZXJDb25maWcge1xuICByb290Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG4gIGVudHJ5Pzogc3RyaW5nO1xuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnk7XG4gIG1vZGU/OiBcImRldmVsb3BtZW50XCIgfCBcInByb2R1Y3Rpb25cIjtcbiAgb25FcnJvcj86IEVycm9ySGFuZGxlckZuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQodHJhbnNwaWxlcjogVHJhbnNwaWxlciwgdGFnOiBzdHJpbmcpIHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgY29uc3QgY29tcG9uZW50ID0gbmV3ICh0cmFuc3BpbGVyLnJlZ2lzdHJ5W3RhZ10uY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzKSh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiB0cmFuc3BpbGVyLnJlc29sdmVOb2Rlcyh0YWcpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbmZpZzogS2FzcGVyQ29uZmlnKSB7XG4gIGNvbnN0IHJvb3QgPVxuICAgIHR5cGVvZiBjb25maWcucm9vdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KVxuICAgICAgOiBjb25maWcucm9vdDtcblxuICBpZiAoIXJvb3QpIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLlJPT1RfRUxFTUVOVF9OT1RfRk9VTkQsXG4gICAgICB7IHJvb3Q6IGNvbmZpZy5yb290IH1cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZW50cnlUYWcgPSBjb25maWcuZW50cnkgfHwgXCJrYXNwZXItYXBwXCI7XG4gIGlmICghY29uZmlnLnJlZ2lzdHJ5W2VudHJ5VGFnXSkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihcbiAgICAgIEtFcnJvckNvZGUuRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORCxcbiAgICAgIHsgdGFnOiBlbnRyeVRhZyB9XG4gICAgKTtcbiAgfVxuXG4gIGlmIChjb25maWcub25FcnJvcikge1xuICAgIHNldEVycm9ySGFuZGxlcihjb25maWcub25FcnJvcik7XG4gIH1cblxuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogY29uZmlnLnJlZ2lzdHJ5IH0pO1xuXG4gIGlmIChjb25maWcubW9kZSkge1xuICAgIHRyYW5zcGlsZXIubW9kZSA9IGNvbmZpZy5tb2RlO1xuICB9XG5cbiAgY29uc3QgeyBub2RlLCBpbnN0YW5jZSwgbm9kZXMgfSA9IGNyZWF0ZUNvbXBvbmVudCh0cmFuc3BpbGVyLCBlbnRyeVRhZyk7XG5cbiAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICByb290LmFwcGVuZENoaWxkKG5vZGUpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25Nb3VudCgpO1xuICB9XG5cbiAgdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGluc3RhbmNlLCBub2RlIGFzIEhUTUxFbGVtZW50KTtcblxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuIl0sIm5hbWVzIjpbInJhd0VmZmVjdCIsInJhd0NvbXB1dGVkIiwiU2V0IiwiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5QaXBlbGluZSIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLkNhbGwiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuU3ByZWFkIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5BcnJvd0Z1bmN0aW9uIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsIk5vZGUuRG9jdHlwZSIsIk5vZGUuRWxlbWVudCIsIk5vZGUuQXR0cmlidXRlIiwiTm9kZS5UZXh0IiwiQ29tcG9uZW50Q2xhc3MiLCJzY29wZSIsInBhcmVudCIsInByZXYiXSwibWFwcGluZ3MiOiJBQUFPLE1BQU0sYUFBYTtBQUFBO0FBQUEsRUFFeEIsd0JBQXdCO0FBQUEsRUFDeEIsMkJBQTJCO0FBQUE7QUFBQSxFQUczQixzQkFBc0I7QUFBQSxFQUN0QixxQkFBcUI7QUFBQSxFQUNyQixzQkFBc0I7QUFBQTtBQUFBLEVBR3RCLGdCQUFnQjtBQUFBLEVBQ2hCLHdCQUF3QjtBQUFBLEVBQ3hCLG1CQUFtQjtBQUFBLEVBQ25CLDBCQUEwQjtBQUFBLEVBQzFCLHNCQUFzQjtBQUFBLEVBQ3RCLHNCQUFzQjtBQUFBLEVBQ3RCLHVCQUF1QjtBQUFBLEVBQ3ZCLGNBQWM7QUFBQSxFQUNkLGdDQUFnQztBQUFBO0FBQUEsRUFHaEMsa0JBQWtCO0FBQUEsRUFDbEIsZ0JBQWdCO0FBQUEsRUFDaEIscUJBQXFCO0FBQUEsRUFDckIsd0JBQXdCO0FBQUE7QUFBQSxFQUd4Qix3QkFBd0I7QUFBQSxFQUN4Qix5QkFBeUI7QUFBQSxFQUN6Qix1QkFBdUI7QUFBQSxFQUN2Qix3QkFBd0I7QUFBQSxFQUN4QixnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUE7QUFBQSxFQUdiLG1CQUFtQjtBQUFBO0FBQUEsRUFHbkIsZUFBZTtBQUFBLEVBQ2YsdUJBQXVCO0FBQ3pCO0FBSU8sTUFBTSxpQkFBd0Q7QUFBQSxFQUNuRSxVQUFVLENBQUMsTUFBTSwyQkFBMkIsRUFBRSxJQUFJO0FBQUEsRUFDbEQsVUFBVSxDQUFDLE1BQU0sb0JBQW9CLEVBQUUsR0FBRztBQUFBLEVBRTFDLFVBQVUsTUFBTTtBQUFBLEVBQ2hCLFVB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LElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGdCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsaUJBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLElBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdB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
