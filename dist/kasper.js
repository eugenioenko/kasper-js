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
function codeSnippet(source, line, col, context = 2) {
  const lines = source.split("\n");
  const errorLine = line - 1;
  const start = Math.max(0, errorLine - context);
  const end = Math.min(lines.length - 1, errorLine + context);
  const result = [""];
  for (let i = start; i <= end; i++) {
    const indicator = i === errorLine ? ">" : " ";
    result.push(`  ${indicator} | ${lines[i]}`);
    if (i === errorLine && col > 0) {
      const pointer = " ".repeat(6 + col - 1) + "^";
      result.push(pointer);
    }
  }
  return result.join("\n");
}
class KasperError extends Error {
  constructor(code, args = {}, options = {}) {
    const { line, col, tag, source } = options;
    const isDev = typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
    const template = ErrorTemplates[code];
    const message = template ? template(args) : typeof args === "string" ? args : "Unknown error";
    const tagInfo = tag ? `
  at <${tag}>` : "";
    const snippet = line !== void 0 && source ? codeSnippet(source, line, col ?? 0) : "";
    const link = isDev ? `

See: https://kasperjs.top/reference/errors#${code.toLowerCase().replace(".", "")}
` : "";
    super(`[${code}] ${message}${tagInfo}${snippet}${link}`);
    this.code = code;
    this.args = args;
    this.name = "KasperError";
    this.line = line;
    this.col = col;
    this.tagName = tag;
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
    } catch {
    }
  }
  if (globalHandler) {
    try {
      globalHandler(err, { component, phase });
      return;
    } catch {
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
  parse(tokens, source = "") {
    this.current = 0;
    this.tokens = tokens;
    this.source = source;
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
    throw new KasperError(code, args, { line: token.line, col: token.col, source: this.source });
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
    throw new KasperError(code, args, { line: this.line, col: this.col, source: this.source });
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
    throw new KasperError(code, args, { line, col });
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
    const expressions = this.parser.parse(tokens, source);
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
    throw new KasperError(code, args, { line: this.line, col: this.col, source: this.source });
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
function isBatching() {
  return batchingEnabled;
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
      } catch (e) {
        if (isBatching()) {
          const instance = this.interpreter.scope.get("$instance");
          handleError(e, "render", instance);
        } else {
          throw e;
        }
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
    const expressions = this.parser.parse(tokens, source);
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
    const expressions = this.parser.parse(tokens, source);
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
    throw new KasperError(code, finalArgs, { tag: tagName });
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
  Signal,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvZXJyb3ItaGFuZGxlci50cyIsIi4uL3NyYy9zaWduYWwudHMiLCIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3JvdXRlci50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy9zY2hlZHVsZXIudHMiLCIuLi9zcmMvdHJhbnNwaWxlci50cyIsIi4uL3NyYy9rYXNwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEtFcnJvckNvZGUgPSB7XG4gIC8vIEJvb3RzdHJhcFxuICBST09UX0VMRU1FTlRfTk9UX0ZPVU5EOiBcIkswMDEtMVwiLFxuICBFTlRSWV9DT01QT05FTlRfTk9UX0ZPVU5EOiBcIkswMDEtMlwiLFxuXG4gIC8vIFNjYW5uZXJcbiAgVU5URVJNSU5BVEVEX0NPTU1FTlQ6IFwiSzAwMi0xXCIsXG4gIFVOVEVSTUlOQVRFRF9TVFJJTkc6IFwiSzAwMi0yXCIsXG4gIFVORVhQRUNURURfQ0hBUkFDVEVSOiBcIkswMDItM1wiLFxuXG4gIC8vIFRlbXBsYXRlIFBhcnNlclxuICBVTkVYUEVDVEVEX0VPRjogXCJLMDAzLTFcIixcbiAgVU5FWFBFQ1RFRF9DTE9TSU5HX1RBRzogXCJLMDAzLTJcIixcbiAgRVhQRUNURURfVEFHX05BTUU6IFwiSzAwMy0zXCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVDogXCJLMDAzLTRcIixcbiAgRVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy01XCIsXG4gIEJMQU5LX0FUVFJJQlVURV9OQU1FOiBcIkswMDMtNlwiLFxuICBNSVNQTEFDRURfQ09ORElUSU9OQUw6IFwiSzAwMy03XCIsXG4gIERVUExJQ0FURV9JRjogXCJLMDAzLThcIixcbiAgTVVMVElQTEVfU1RSVUNUVVJBTF9ESVJFQ1RJVkVTOiBcIkswMDMtOVwiLFxuXG4gIC8vIEV4cHJlc3Npb24gUGFyc2VyXG4gIFVORVhQRUNURURfVE9LRU46IFwiSzAwNC0xXCIsXG4gIElOVkFMSURfTFZBTFVFOiBcIkswMDQtMlwiLFxuICBFWFBFQ1RFRF9FWFBSRVNTSU9OOiBcIkswMDQtM1wiLFxuICBJTlZBTElEX0RJQ1RJT05BUllfS0VZOiBcIkswMDQtNFwiLFxuXG4gIC8vIEludGVycHJldGVyXG4gIElOVkFMSURfUE9TVEZJWF9MVkFMVUU6IFwiSzAwNS0xXCIsXG4gIFVOS05PV05fQklOQVJZX09QRVJBVE9SOiBcIkswMDUtMlwiLFxuICBJTlZBTElEX1BSRUZJWF9SVkFMVUU6IFwiSzAwNS0zXCIsXG4gIFVOS05PV05fVU5BUllfT1BFUkFUT1I6IFwiSzAwNS00XCIsXG4gIE5PVF9BX0ZVTkNUSU9OOiBcIkswMDUtNVwiLFxuICBOT1RfQV9DTEFTUzogXCJLMDA1LTZcIixcblxuICAvLyBTaWduYWxzXG4gIENJUkNVTEFSX0NPTVBVVEVEOiBcIkswMDYtMVwiLFxuXG4gIC8vIFRyYW5zcGlsZXJcbiAgUlVOVElNRV9FUlJPUjogXCJLMDA3LTFcIixcbiAgTUlTU0lOR19SRVFVSVJFRF9BVFRSOiBcIkswMDctMlwiLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgS0Vycm9yQ29kZVR5cGUgPSAodHlwZW9mIEtFcnJvckNvZGUpW2tleW9mIHR5cGVvZiBLRXJyb3JDb2RlXTtcblxuZXhwb3J0IGNvbnN0IEVycm9yVGVtcGxhdGVzOiBSZWNvcmQ8c3RyaW5nLCAoYXJnczogYW55KSA9PiBzdHJpbmc+ID0ge1xuICBcIkswMDEtMVwiOiAoYSkgPT4gYFJvb3QgZWxlbWVudCBub3QgZm91bmQ6ICR7YS5yb290fWAsXG4gIFwiSzAwMS0yXCI6IChhKSA9PiBgRW50cnkgY29tcG9uZW50IDwke2EudGFnfT4gbm90IGZvdW5kIGluIHJlZ2lzdHJ5LmAsXG4gIFxuICBcIkswMDItMVwiOiAoKSA9PiAnVW50ZXJtaW5hdGVkIGNvbW1lbnQsIGV4cGVjdGluZyBjbG9zaW5nIFwiKi9cIicsXG4gIFwiSzAwMi0yXCI6IChhKSA9PiBgVW50ZXJtaW5hdGVkIHN0cmluZywgZXhwZWN0aW5nIGNsb3NpbmcgJHthLnF1b3RlfWAsXG4gIFwiSzAwMi0zXCI6IChhKSA9PiBgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7YS5jaGFyfSdgLFxuXG4gIFwiSzAwMy0xXCI6IChhKSA9PiBgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHthLmVvZkVycm9yfWAsXG4gIFwiSzAwMy0yXCI6ICgpID0+IFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiLFxuICBcIkswMDMtM1wiOiAoKSA9PiBcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIixcbiAgXCJLMDAzLTRcIjogKCkgPT4gXCJFeHBlY3RlZCBjbG9zaW5nIHRhZyA+XCIsXG4gIFwiSzAwMy01XCI6IChhKSA9PiBgRXhwZWN0ZWQgPC8ke2EubmFtZX0+YCxcbiAgXCJLMDAzLTZcIjogKCkgPT4gXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiLFxuICBcIkswMDMtN1wiOiAoYSkgPT4gYEAke2EubmFtZX0gbXVzdCBiZSBwcmVjZWRlZCBieSBhbiBAaWYgb3IgQGVsc2VpZiBibG9jay5gLFxuICBcIkswMDMtOFwiOiAoKSA9PiBcIk11bHRpcGxlIGNvbmRpdGlvbmFsIGRpcmVjdGl2ZXMgKEBpZiwgQGVsc2VpZiwgQGVsc2UpIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXJlIG5vdCBhbGxvd2VkLlwiLFxuICBcIkswMDMtOVwiOiAoKSA9PiBcIk11bHRpcGxlIHN0cnVjdHVyYWwgZGlyZWN0aXZlcyAoQGlmLCBAZWFjaCkgb24gdGhlIHNhbWUgZWxlbWVudCBhcmUgbm90IGFsbG93ZWQuIE5lc3QgdGhlbSBvciB1c2UgPHZvaWQ+IGluc3RlYWQuXCIsXG5cbiAgXCJLMDA0LTFcIjogKGEpID0+IGAke2EubWVzc2FnZX0sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtMlwiOiAoKSA9PiBcIkludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuXCIsXG4gIFwiSzAwNC0zXCI6IChhKSA9PiBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7YS50b2tlbn1cImAsXG4gIFwiSzAwNC00XCI6IChhKSA9PiBgU3RyaW5nLCBOdW1iZXIgb3IgSWRlbnRpZmllciBleHBlY3RlZCBhcyBhIEtleSBvZiBEaWN0aW9uYXJ5IHssIHVuZXhwZWN0ZWQgdG9rZW4gJHthLnRva2VufWAsXG5cbiAgXCJLMDA1LTFcIjogKGEpID0+IGBJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIHBvc3RmaXggb3BlcmF0aW9uOiAke2EuZW50aXR5fWAsXG4gIFwiSzAwNS0yXCI6IChhKSA9PiBgVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgJHthLm9wZXJhdG9yfWAsXG4gIFwiSzAwNS0zXCI6IChhKSA9PiBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAke2EucmlnaHR9YCxcbiAgXCJLMDA1LTRcIjogKGEpID0+IGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtNVwiOiAoYSkgPT4gYCR7YS5jYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCxcbiAgXCJLMDA1LTZcIjogKGEpID0+IGAnJHthLmNsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmAsXG5cbiAgXCJLMDA2LTFcIjogKCkgPT4gXCJDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIGluIGNvbXB1dGVkIHNpZ25hbFwiLFxuXG4gIFwiSzAwNy0xXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG4gIFwiSzAwNy0yXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG59O1xuXG5mdW5jdGlvbiBjb2RlU25pcHBldChzb3VyY2U6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlciwgY29udGV4dCA9IDIpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdChcIlxcblwiKTtcbiAgY29uc3QgZXJyb3JMaW5lID0gbGluZSAtIDE7XG4gIGNvbnN0IHN0YXJ0ID0gTWF0aC5tYXgoMCwgZXJyb3JMaW5lIC0gY29udGV4dCk7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCAtIDEsIGVycm9yTGluZSArIGNvbnRleHQpO1xuXG4gIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXCJcIl07XG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgIGNvbnN0IGluZGljYXRvciA9IGkgPT09IGVycm9yTGluZSA/IFwiPlwiIDogXCIgXCI7XG4gICAgcmVzdWx0LnB1c2goYCAgJHtpbmRpY2F0b3J9IHwgJHtsaW5lc1tpXX1gKTtcbiAgICBpZiAoaSA9PT0gZXJyb3JMaW5lICYmIGNvbCA+IDApIHtcbiAgICAgIGNvbnN0IHBvaW50ZXIgPSBcIiBcIi5yZXBlYXQoNiArIGNvbCAtIDEpICsgXCJeXCI7XG4gICAgICByZXN1bHQucHVzaChwb2ludGVyKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKFwiXFxuXCIpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEthc3BlckVycm9yT3B0aW9ucyB7XG4gIGxpbmU/OiBudW1iZXI7XG4gIGNvbD86IG51bWJlcjtcbiAgdGFnPzogc3RyaW5nO1xuICBzb3VyY2U/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHVibGljIGxpbmU/OiBudW1iZXI7XG4gIHB1YmxpYyBjb2w/OiBudW1iZXI7XG4gIHB1YmxpYyB0YWdOYW1lPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb2RlOiBLRXJyb3JDb2RlVHlwZSxcbiAgICBwdWJsaWMgYXJnczogYW55ID0ge30sXG4gICAgb3B0aW9uczogS2FzcGVyRXJyb3JPcHRpb25zID0ge31cbiAgKSB7XG4gICAgY29uc3QgeyBsaW5lLCBjb2wsIHRhZywgc291cmNlIH0gPSBvcHRpb25zO1xuXG4gICAgY29uc3QgaXNEZXYgPVxuICAgICAgdHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCJcbiAgICAgICAgOiAoaW1wb3J0Lm1ldGEgYXMgYW55KS5lbnY/Lk1PREUgIT09IFwicHJvZHVjdGlvblwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBFcnJvclRlbXBsYXRlc1tjb2RlXTtcbiAgICBjb25zdCBtZXNzYWdlID0gdGVtcGxhdGVcbiAgICAgID8gdGVtcGxhdGUoYXJncylcbiAgICAgIDogKHR5cGVvZiBhcmdzID09PSAnc3RyaW5nJyA/IGFyZ3MgOiBcIlVua25vd24gZXJyb3JcIik7XG5cbiAgICBjb25zdCB0YWdJbmZvID0gdGFnID8gYFxcbiAgYXQgPCR7dGFnfT5gIDogXCJcIjtcbiAgICBjb25zdCBzbmlwcGV0ID0gbGluZSAhPT0gdW5kZWZpbmVkICYmIHNvdXJjZSA/IGNvZGVTbmlwcGV0KHNvdXJjZSwgbGluZSwgY29sID8/IDApIDogXCJcIjtcbiAgICBjb25zdCBsaW5rID0gaXNEZXZcbiAgICAgID8gYFxcblxcblNlZTogaHR0cHM6Ly9rYXNwZXJqcy50b3AvcmVmZXJlbmNlL2Vycm9ycyMke2NvZGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKX1cXG5gXG4gICAgICA6IFwiXCI7XG5cbiAgICBzdXBlcihgWyR7Y29kZX1dICR7bWVzc2FnZX0ke3RhZ0luZm99JHtzbmlwcGV0fSR7bGlua31gKTtcbiAgICB0aGlzLm5hbWUgPSBcIkthc3BlckVycm9yXCI7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgICB0aGlzLnRhZ05hbWUgPSB0YWc7XG4gIH1cblxuICBwdWJsaWMgd2l0aFRhZyh0YWdOYW1lOiBzdHJpbmcpOiB0aGlzIHtcbiAgICBpZiAoIXRoaXMudGFnTmFtZSkge1xuICAgICAgdGhpcy50YWdOYW1lID0gdGFnTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSArPSBgXFxuICBhdCA8JHt0YWdOYW1lfT5gO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiZXhwb3J0IHR5cGUgRXJyb3JQaGFzZSA9ICdyZW5kZXInIHwgJ3dhdGNoZXInO1xuXG5leHBvcnQgdHlwZSBFcnJvckhhbmRsZXJGbiA9IChcbiAgZXJyb3I6IEVycm9yLFxuICBjb250ZXh0OiB7IGNvbXBvbmVudD86IGFueTsgcGhhc2U6IEVycm9yUGhhc2UgfVxuKSA9PiB2b2lkO1xuXG5sZXQgZ2xvYmFsSGFuZGxlcjogRXJyb3JIYW5kbGVyRm4gfCBudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEVycm9ySGFuZGxlcihoYW5kbGVyOiBFcnJvckhhbmRsZXJGbiB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICBnbG9iYWxIYW5kbGVyID0gaGFuZGxlciA/PyBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3I6IHVua25vd24sIHBoYXNlOiBFcnJvclBoYXNlLCBjb21wb25lbnQ/OiBhbnkpOiB2b2lkIHtcbiAgY29uc3QgZXJyID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yIDogbmV3IEVycm9yKFN0cmluZyhlcnJvcikpO1xuXG4gIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC5vbkVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbXBvbmVudC5vbkVycm9yKGVyciwgcGhhc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gb25FcnJvciBpdHNlbGYgdGhyZXcsIGZhbGwgdGhyb3VnaFxuICAgIH1cbiAgfVxuXG4gIGlmIChnbG9iYWxIYW5kbGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGdsb2JhbEhhbmRsZXIoZXJyLCB7IGNvbXBvbmVudDogY29tcG9uZW50LCBwaGFzZTogcGhhc2UgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBnbG9iYWwgaGFuZGxlciB0aHJldywgZmFsbCB0aHJvdWdoXG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5lcnJvcihgW0thc3Blcl0gRXJyb3IgZHVyaW5nICR7cGhhc2V9OmAsIGVycik7XG59XG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgeyBoYW5kbGVFcnJvciB9IGZyb20gXCIuL2Vycm9yLWhhbmRsZXJcIjtcblxudHlwZSBMaXN0ZW5lciA9ICgpID0+IHZvaWQ7XG5cbmxldCBhY3RpdmVFZmZlY3Q6IHsgZm46IExpc3RlbmVyOyBkZXBzOiBTZXQ8YW55PiB9IHwgbnVsbCA9IG51bGw7XG5jb25zdCBlZmZlY3RTdGFjazogYW55W10gPSBbXTtcblxubGV0IGJhdGNoaW5nID0gZmFsc2U7XG5jb25zdCBwZW5kaW5nU3Vic2NyaWJlcnMgPSBuZXcgU2V0PExpc3RlbmVyPigpO1xuY29uc3QgcGVuZGluZ1dhdGNoZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG50eXBlIFdhdGNoZXI8VD4gPSAobmV3VmFsdWU6IFQsIG9sZFZhbHVlOiBUKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25hbE9wdGlvbnMge1xuICBzaWduYWw/OiBBYm9ydFNpZ25hbDtcbn1cblxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUPiB7XG4gIHByb3RlY3RlZCBfdmFsdWU6IFQ7XG4gIHByaXZhdGUgc3Vic2NyaWJlcnMgPSBuZXcgU2V0PExpc3RlbmVyPigpO1xuICBwcml2YXRlIHdhdGNoZXJzID0gbmV3IFNldDxXYXRjaGVyPFQ+PigpO1xuXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZTogVCkge1xuICAgIHRoaXMuX3ZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIGlmIChhY3RpdmVFZmZlY3QpIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlcnMuYWRkKGFjdGl2ZUVmZmVjdC5mbik7XG4gICAgICBhY3RpdmVFZmZlY3QuZGVwcy5hZGQodGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogVCkge1xuICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgaWYgKGJhdGNoaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuc3Vic2NyaWJlcnMpIHBlbmRpbmdTdWJzY3JpYmVycy5hZGQoc3ViKTtcbiAgICAgICAgZm9yIChjb25zdCB3YXRjaGVyIG9mIHRoaXMud2F0Y2hlcnMpIHBlbmRpbmdXYXRjaGVycy5wdXNoKCgpID0+IHdhdGNoZXIobmV3VmFsdWUsIG9sZFZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdWJzID0gQXJyYXkuZnJvbSh0aGlzLnN1YnNjcmliZXJzKTtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgICAgIHN1YigpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSB7XG4gICAgICAgICAgdHJ5IHsgd2F0Y2hlcihuZXdWYWx1ZSwgb2xkVmFsdWUpOyB9IGNhdGNoIChlKSB7IGhhbmRsZUVycm9yKGUsICd3YXRjaGVyJyk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlKGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICAgIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgY29uc3Qgc3RvcCA9ICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5jbGFzcyBDb21wdXRlZFNpZ25hbDxUPiBleHRlbmRzIFNpZ25hbDxUPiB7XG4gIHByaXZhdGUgZm46ICgpID0+IFQ7XG4gIHByaXZhdGUgY29tcHV0aW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gICAgc3VwZXIodW5kZWZpbmVkIGFzIGFueSk7XG4gICAgdGhpcy5mbiA9IGZuO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb21wdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEthc3BlckVycm9yKEtFcnJvckNvZGUuQ0lSQ1VMQVJfQ09NUFVURUQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXB1dGluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBFYWdlcmx5IHVwZGF0ZSB0aGUgdmFsdWUgc28gc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkIGltbWVkaWF0ZWx5XG4gICAgICAgIHN1cGVyLnZhbHVlID0gdGhpcy5mbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5jb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zPy5zaWduYWwpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiBzdXBlci52YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShfdjogVCkge1xuICAgIC8vIENvbXB1dGVkIHNpZ25hbHMgYXJlIHJlYWQtb25seSBmcm9tIG91dHNpZGVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lciwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnM/LnNpZ25hbD8uYWJvcnRlZCkgcmV0dXJuICgpID0+IHt9O1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgY29uc3Qgc3RvcDogYW55ID0gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xuICBzdG9wLnJ1biA9IGVmZmVjdE9iai5mbjtcblxuICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBzdG9wIGFzICgoKSA9PiB2b2lkKSAmIHsgcnVuOiAoKSA9PiB2b2lkIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWw8VD4oaW5pdGlhbFZhbHVlOiBUKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBTaWduYWwoaW5pdGlhbFZhbHVlKTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsIGFsaWFzIGZvciBTaWduYWwub25DaGFuZ2UoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICByZXR1cm4gc2lnLm9uQ2hhbmdlKGZuLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIGJhdGNoaW5nID0gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20ocGVuZGluZ1N1YnNjcmliZXJzKTtcbiAgICBwZW5kaW5nU3Vic2NyaWJlcnMuY2xlYXIoKTtcbiAgICBjb25zdCB3YXRjaGVycyA9IHBlbmRpbmdXYXRjaGVycy5zcGxpY2UoMCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgc3ViKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgdHJ5IHsgd2F0Y2hlcigpOyB9IGNhdGNoIChlKSB7IGhhbmRsZUVycm9yKGUsICd3YXRjaGVyJyk7IH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBULCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgQ29tcHV0ZWRTaWduYWwoZm4sIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHsgU2lnbmFsLCBlZmZlY3QgYXMgcmF3RWZmZWN0LCBjb21wdXRlZCBhcyByYXdDb21wdXRlZCB9IGZyb20gXCIuL3NpZ25hbFwiO1xuaW1wb3J0IHsgVHJhbnNwaWxlciB9IGZyb20gXCIuL3RyYW5zcGlsZXJcIjtcbmltcG9ydCB7IEtOb2RlIH0gZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIENvbXBvbmVudEFyZ3M8VEFyZ3MgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgYW55Pj4ge1xuICBhcmdzOiBUQXJncztcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8VEFyZ3MgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gUmVjb3JkPHN0cmluZywgYW55Pj4ge1xuICBzdGF0aWMgdGVtcGxhdGU/OiBzdHJpbmc7XG4gIGFyZ3M6IFRBcmdzID0ge30gYXMgVEFyZ3M7XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xuICAkYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAkcmVuZGVyPzogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz86IENvbXBvbmVudEFyZ3M8VEFyZ3M+KSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgdGhpcy5hcmdzID0ge30gYXMgVEFyZ3M7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5hcmdzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSBwcm9wcy5hcmdzO1xuICAgIH1cbiAgICBpZiAocHJvcHMucmVmKSB7XG4gICAgICB0aGlzLnJlZiA9IHByb3BzLnJlZjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRyYW5zcGlsZXIpIHtcbiAgICAgIHRoaXMudHJhbnNwaWxlciA9IHByb3BzLnRyYW5zcGlsZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSByZWFjdGl2ZSBlZmZlY3QgdGllZCB0byB0aGUgY29tcG9uZW50J3MgbGlmZWN5Y2xlLlxuICAgKiBSdW5zIGltbWVkaWF0ZWx5IGFuZCByZS1ydW5zIHdoZW4gYW55IHNpZ25hbCBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gICAqL1xuICBlZmZlY3QoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICByYXdFZmZlY3QoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoZXMgYSBzcGVjaWZpYyBzaWduYWwgZm9yIGNoYW5nZXMuXG4gICAqIERvZXMgTk9UIHJ1biBpbW1lZGlhdGVseS5cbiAgICovXG4gIHdhdGNoPFQ+KHNpZzogU2lnbmFsPFQ+LCBmbjogV2F0Y2hlcjxUPik6IHZvaWQge1xuICAgIHNpZy5vbkNoYW5nZShmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNvbXB1dGVkIHNpZ25hbCB0aWVkIHRvIHRoZSBjb21wb25lbnQncyBsaWZlY3ljbGUuXG4gICAqIFRoZSBpbnRlcm5hbCBlZmZlY3QgaXMgYXV0b21hdGljYWxseSBjbGVhbmVkIHVwIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBjb21wdXRlZDxUPihmbjogKCkgPT4gVCk6IFNpZ25hbDxUPiB7XG4gICAgcmV0dXJuIHJhd0NvbXB1dGVkKGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIG9uTW91bnQoKSB7IH1cbiAgb25SZW5kZXIoKSB7IH1cbiAgb25DaGFuZ2VzKCkgeyB9XG4gIG9uRGVzdHJveSgpIHsgfVxuICBvbkVycm9yPyhlcnJvcjogRXJyb3IsIHBoYXNlOiBzdHJpbmcpOiB2b2lkO1xuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLiRyZW5kZXI/LigpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIEthc3BlckVudGl0eSA9IENvbXBvbmVudCB8IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBDb21wb25lbnRDbGFzcyA9IHsgbmV3KGFyZ3M/OiBDb21wb25lbnRBcmdzPGFueT4pOiBDb21wb25lbnQgfTtcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cnkge1xuICBbdGFnTmFtZTogc3RyaW5nXToge1xuICAgIGNvbXBvbmVudDogQ29tcG9uZW50Q2xhc3MgfCAoKCkgPT4gUHJvbWlzZTxDb21wb25lbnRDbGFzcz4pO1xuICAgIG5vZGVzPzogS05vZGVbXTtcbiAgICBsYXp5PzogYm9vbGVhbjtcbiAgICBmYWxsYmFjaz86IENvbXBvbmVudENsYXNzO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gJ3Rva2VuJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4cHIge1xuICBwdWJsaWMgcmVzdWx0OiBhbnk7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUjtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgaW50ZXJmYWNlIEV4cHJWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEFycm93RnVuY3Rpb24pOiBSO1xuICAgIHZpc2l0QXNzaWduRXhwcihleHByOiBBc3NpZ24pOiBSO1xuICAgIHZpc2l0QmluYXJ5RXhwcihleHByOiBCaW5hcnkpOiBSO1xuICAgIHZpc2l0Q2FsbEV4cHIoZXhwcjogQ2FsbCk6IFI7XG4gICAgdmlzaXREZWJ1Z0V4cHIoZXhwcjogRGVidWcpOiBSO1xuICAgIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRGljdGlvbmFyeSk6IFI7XG4gICAgdmlzaXRFYWNoRXhwcihleHByOiBFYWNoKTogUjtcbiAgICB2aXNpdEdldEV4cHIoZXhwcjogR2V0KTogUjtcbiAgICB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBHcm91cGluZyk6IFI7XG4gICAgdmlzaXRLZXlFeHByKGV4cHI6IEtleSk6IFI7XG4gICAgdmlzaXRMb2dpY2FsRXhwcihleHByOiBMb2dpY2FsKTogUjtcbiAgICB2aXNpdExpc3RFeHByKGV4cHI6IExpc3QpOiBSO1xuICAgIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogTGl0ZXJhbCk6IFI7XG4gICAgdmlzaXROZXdFeHByKGV4cHI6IE5ldyk6IFI7XG4gICAgdmlzaXROdWxsQ29hbGVzY2luZ0V4cHIoZXhwcjogTnVsbENvYWxlc2NpbmcpOiBSO1xuICAgIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogUG9zdGZpeCk6IFI7XG4gICAgdmlzaXRTZXRFeHByKGV4cHI6IFNldCk6IFI7XG4gICAgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogUGlwZWxpbmUpOiBSO1xuICAgIHZpc2l0U3ByZWFkRXhwcihleHByOiBTcHJlYWQpOiBSO1xuICAgIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IFRlbXBsYXRlKTogUjtcbiAgICB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IFRlcm5hcnkpOiBSO1xuICAgIHZpc2l0VHlwZW9mRXhwcihleHByOiBUeXBlb2YpOiBSO1xuICAgIHZpc2l0VW5hcnlFeHByKGV4cHI6IFVuYXJ5KTogUjtcbiAgICB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBWYXJpYWJsZSk6IFI7XG4gICAgdmlzaXRWb2lkRXhwcihleHByOiBWb2lkKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEFycm93RnVuY3Rpb24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcGFyYW1zOiBUb2tlbltdO1xuICAgIHB1YmxpYyBib2R5OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBUb2tlbltdLCBib2R5OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXJyb3dGdW5jdGlvbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5BcnJvd0Z1bmN0aW9uJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzaWduIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBc3NpZ25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXNzaWduJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkJpbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENhbGwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2FsbGVlOiBFeHByO1xuICAgIHB1YmxpYyBwYXJlbjogVG9rZW47XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcbiAgICBwdWJsaWMgb3B0aW9uYWw6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsZWU6IEV4cHIsIHBhcmVuOiBUb2tlbiwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIsIG9wdGlvbmFsID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgIHRoaXMucGFyZW4gPSBwYXJlbjtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IG9wdGlvbmFsO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdENhbGxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQ2FsbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVidWdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGVidWcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaWN0aW9uYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHByb3BlcnRpZXM6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGljdGlvbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EaWN0aW9uYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWFjaCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMga2V5OiBUb2tlbjtcbiAgICBwdWJsaWMgaXRlcmFibGU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwga2V5OiBUb2tlbiwgaXRlcmFibGU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVhY2hFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRWFjaCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHR5cGU6IFRva2VuVHlwZSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JvdXBpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdyb3VwaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdyb3VwaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5LZXknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2dpY2FsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCBvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TG9naWNhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Mb2dpY2FsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpc3QnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGl0ZXJhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5ldyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjbGF6ejogRXhwcjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IoY2xheno6IEV4cHIsIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xhenogPSBjbGF6ejtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROZXdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTmV3JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbENvYWxlc2NpbmcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXROdWxsQ29hbGVzY2luZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OdWxsQ29hbGVzY2luZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RmaXggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBpbmNyZW1lbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwgaW5jcmVtZW50OiBudW1iZXIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UG9zdGZpeEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Qb3N0Zml4JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBpcGVsaW5lRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBpcGVsaW5lJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3ByZWFkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U3ByZWFkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNwcmVhZCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlbXBsYXRlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlbXBsYXRlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVybmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjb25kaXRpb246IEV4cHI7XG4gICAgcHVibGljIHRoZW5FeHByOiBFeHByO1xuICAgIHB1YmxpYyBlbHNlRXhwcjogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmRpdGlvbjogRXhwciwgdGhlbkV4cHI6IEV4cHIsIGVsc2VFeHByOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgICAgIHRoaXMudGhlbkV4cHIgPSB0aGVuRXhwcjtcbiAgICAgICAgdGhpcy5lbHNlRXhwciA9IGVsc2VFeHByO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRlcm5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVybmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVvZiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFR5cGVvZkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UeXBlb2YnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3Iob3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlVuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFyaWFibGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VmFyaWFibGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVmFyaWFibGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWb2lkIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Vm9pZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Wb2lkJztcbiAgfVxufVxuXG4iLCJleHBvcnQgZW51bSBUb2tlblR5cGUge1xyXG4gIC8vIFBhcnNlciBUb2tlbnNcclxuICBFb2YsXHJcbiAgUGFuaWMsXHJcblxyXG4gIC8vIFNpbmdsZSBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQW1wZXJzYW5kLFxyXG4gIEF0U2lnbixcclxuICBDYXJldCxcclxuICBDb21tYSxcclxuICBEb2xsYXIsXHJcbiAgRG90LFxyXG4gIEhhc2gsXHJcbiAgTGVmdEJyYWNlLFxyXG4gIExlZnRCcmFja2V0LFxyXG4gIExlZnRQYXJlbixcclxuICBQZXJjZW50LFxyXG4gIFBpcGUsXHJcbiAgUmlnaHRCcmFjZSxcclxuICBSaWdodEJyYWNrZXQsXHJcbiAgUmlnaHRQYXJlbixcclxuICBTZW1pY29sb24sXHJcbiAgU2xhc2gsXHJcbiAgU3RhcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zXHJcbiAgQXJyb3csXHJcbiAgQmFuZyxcclxuICBCYW5nRXF1YWwsXHJcbiAgQmFuZ0VxdWFsRXF1YWwsXHJcbiAgQ29sb24sXHJcbiAgRXF1YWwsXHJcbiAgRXF1YWxFcXVhbCxcclxuICBFcXVhbEVxdWFsRXF1YWwsXHJcbiAgR3JlYXRlcixcclxuICBHcmVhdGVyRXF1YWwsXHJcbiAgTGVzcyxcclxuICBMZXNzRXF1YWwsXHJcbiAgTWludXMsXHJcbiAgTWludXNFcXVhbCxcclxuICBNaW51c01pbnVzLFxyXG4gIFBlcmNlbnRFcXVhbCxcclxuICBQbHVzLFxyXG4gIFBsdXNFcXVhbCxcclxuICBQbHVzUGx1cyxcclxuICBRdWVzdGlvbixcclxuICBRdWVzdGlvbkRvdCxcclxuICBRdWVzdGlvblF1ZXN0aW9uLFxyXG4gIFNsYXNoRXF1YWwsXHJcbiAgU3RhckVxdWFsLFxyXG4gIERvdERvdCxcclxuICBEb3REb3REb3QsXHJcbiAgTGVzc0VxdWFsR3JlYXRlcixcclxuXHJcbiAgLy8gTGl0ZXJhbHNcclxuICBJZGVudGlmaWVyLFxyXG4gIFRlbXBsYXRlLFxyXG4gIFN0cmluZyxcclxuICBOdW1iZXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2VucyAoYml0d2lzZSBzaGlmdHMpXHJcbiAgTGVmdFNoaWZ0LFxyXG4gIFJpZ2h0U2hpZnQsXHJcbiAgUGlwZWxpbmUsXHJcbiAgVGlsZGUsXHJcblxyXG4gIC8vIEtleXdvcmRzXHJcbiAgQW5kLFxyXG4gIENvbnN0LFxyXG4gIERlYnVnLFxyXG4gIEZhbHNlLFxyXG4gIEluLFxyXG4gIEluc3RhbmNlb2YsXHJcbiAgTmV3LFxyXG4gIE51bGwsXHJcbiAgVW5kZWZpbmVkLFxyXG4gIE9mLFxyXG4gIE9yLFxyXG4gIFRydWUsXHJcbiAgVHlwZW9mLFxyXG4gIFZvaWQsXHJcbiAgV2l0aCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuIHtcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XHJcbiAgcHVibGljIGxpdGVyYWw6IGFueTtcclxuICBwdWJsaWMgbGV4ZW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHlwZTogVG9rZW5UeXBlLFxyXG4gICAgbGV4ZW1lOiBzdHJpbmcsXHJcbiAgICBsaXRlcmFsOiBhbnksXHJcbiAgICBsaW5lOiBudW1iZXIsXHJcbiAgICBjb2w6IG51bWJlclxyXG4gICkge1xyXG4gICAgdGhpcy5uYW1lID0gVG9rZW5UeXBlW3R5cGVdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGV4ZW1lID0gbGV4ZW1lO1xyXG4gICAgdGhpcy5saXRlcmFsID0gbGl0ZXJhbDtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiBgWygke3RoaXMubGluZX0pOlwiJHt0aGlzLmxleGVtZX1cIl1gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblBhcnNlciB7XG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICBwcml2YXRlIHRva2VuczogVG9rZW5bXTtcbiAgcHJpdmF0ZSBzb3VyY2U6IHN0cmluZztcblxuICBwdWJsaWMgcGFyc2UodG9rZW5zOiBUb2tlbltdLCBzb3VyY2UgPSBcIlwiKTogRXhwci5FeHByW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgY29uc3QgZXhwcmVzc2lvbnM6IEV4cHIuRXhwcltdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi50eXBlczogVG9rZW5UeXBlW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IFRva2VuIHtcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50XTtcbiAgfVxuXG4gIHByaXZhdGUgcHJldmlvdXMoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgLSAxXTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2sodHlwZTogVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGVlaygpLnR5cGUgPT09IHR5cGU7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jaGVjayhUb2tlblR5cGUuRW9mKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3VtZSh0eXBlOiBUb2tlblR5cGUsIG1lc3NhZ2U6IHN0cmluZyk6IFRva2VuIHtcbiAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5VTkVYUEVDVEVEX1RPS0VOLFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICB7IG1lc3NhZ2U6IG1lc3NhZ2UsIHRva2VuOiB0aGlzLnBlZWsoKS5sZXhlbWUgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCB0b2tlbjogVG9rZW4sIGFyZ3M6IGFueSA9IHt9KTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgeyBsaW5lOiB0b2tlbi5saW5lLCBjb2w6IHRva2VuLmNvbCwgc291cmNlOiB0aGlzLnNvdXJjZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3luY2hyb25pemUoKTogdm9pZCB7XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLlNlbWljb2xvbikgfHwgdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH0gd2hpbGUgKCF0aGlzLmVvZigpKTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JlYWNoKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwciB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcblxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3RlZCBhbiBpZGVudGlmaWVyIGluc2lkZSBcImVhY2hcIiBzdGF0ZW1lbnRgXG4gICAgKTtcblxuICAgIGxldCBrZXk6IFRva2VuID0gbnVsbDtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuV2l0aCkpIHtcbiAgICAgIGtleSA9IHRoaXMuY29uc3VtZShcbiAgICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICAgIGBFeHBlY3RlZCBhIFwia2V5XCIgaWRlbnRpZmllciBhZnRlciBcIndpdGhcIiBrZXl3b3JkIGluIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuT2YsXG4gICAgICBgRXhwZWN0ZWQgXCJvZlwiIGtleXdvcmQgaW5zaWRlIGZvcmVhY2ggc3RhdGVtZW50YFxuICAgICk7XG4gICAgY29uc3QgaXRlcmFibGUgPSB0aGlzLmV4cHJlc3Npb24oKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5FYWNoKG5hbWUsIGtleSwgaXRlcmFibGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGV4cHJlc3Npb24oKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByZXNzaW9uOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkge1xuICAgICAgLy8gY29uc3VtZSBhbGwgc2VtaWNvbG9uc1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2VtaWNvbG9uKSkgeyAvKiBjb25zdW1lIHNlbWljb2xvbnMgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgYXNzaWdubWVudCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucGlwZWxpbmUoKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU3RhckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuU2xhc2hFcXVhbFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgbGV0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLmFzc2lnbm1lbnQoKTtcbiAgICAgIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgICBjb25zdCBuYW1lOiBUb2tlbiA9IGV4cHIubmFtZTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuVmFyaWFibGUobmFtZSwgbmFtZS5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuQXNzaWduKG5hbWUsIHZhbHVlLCBuYW1lLmxpbmUpO1xuICAgICAgfSBlbHNlIGlmIChleHByIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgIT09IFRva2VuVHlwZS5FcXVhbCkge1xuICAgICAgICAgIHZhbHVlID0gbmV3IEV4cHIuQmluYXJ5KFxuICAgICAgICAgICAgbmV3IEV4cHIuR2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgZXhwci50eXBlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5TZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCB2YWx1ZSwgZXhwci5saW5lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5JTlZBTElEX0xWQUxVRSwgb3BlcmF0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgcGlwZWxpbmUoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QaXBlbGluZSkpIHtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuUGlwZWxpbmUoZXhwciwgcmlnaHQsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXJuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCB0aGVuRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkNvbG9uLCBgRXhwZWN0ZWQgXCI6XCIgYWZ0ZXIgdGVybmFyeSA/IGV4cHJlc3Npb25gKTtcbiAgICAgIGNvbnN0IGVsc2VFeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZXJuYXJ5KGV4cHIsIHRoZW5FeHByLCBlbHNlRXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG51bGxDb2FsZXNjaW5nKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMubG9naWNhbE9yKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCByaWdodEV4cHI6IEV4cHIuRXhwciA9IHRoaXMubnVsbENvYWxlc2NpbmcoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5OdWxsQ29hbGVzY2luZyhleHByLCByaWdodEV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsT3IoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5PcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dpY2FsQW5kKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkFuZCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmVxdWFsaXR5KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgZXF1YWxpdHkoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgIHdoaWxlIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlckVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3NFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkluc3RhbmNlb2YsXG4gICAgICAgIFRva2VuVHlwZS5JbixcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnNoaWZ0KCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBzaGlmdCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRTaGlmdCwgVG9rZW5UeXBlLlJpZ2h0U2hpZnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgYWRkaXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzLCBUb2tlblR5cGUuUGx1cykpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG1vZHVsdXMoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QZXJjZW50KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIG11bHRpcGxpY2F0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNsYXNoLCBUb2tlblR5cGUuU3RhcikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdHlwZW9mKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlR5cGVvZikpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHZhbHVlOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlR5cGVvZih2YWx1ZSwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuYXJ5KCk7XG4gIH1cblxuICBwcml2YXRlIHVuYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgVG9rZW5UeXBlLlRpbGRlLFxuICAgICAgICBUb2tlblR5cGUuRG9sbGFyLFxuICAgICAgICBUb2tlblR5cGUuUGx1c1BsdXMsXG4gICAgICAgIFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy51bmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlVuYXJ5KG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5ld0tleXdvcmQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV3S2V5d29yZCgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OZXcpKSB7XG4gICAgICBjb25zdCBrZXl3b3JkID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgY29uc3RydWN0OiBFeHByLkV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICAgIGlmIChjb25zdHJ1Y3QgaW5zdGFuY2VvZiBFeHByLkNhbGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QuY2FsbGVlLCBjb25zdHJ1Y3QuYXJncywga2V5d29yZC5saW5lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LCBbXSwga2V5d29yZC5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucG9zdGZpeCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3N0Zml4KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwciA9IHRoaXMuY2FsbCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5QbHVzUGx1cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIDEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51c01pbnVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgLTEsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMucHJpbWFyeSgpO1xuICAgIGxldCBjb25zdW1lZDogYm9vbGVhbjtcbiAgICBkbyB7XG4gICAgICBjb25zdW1lZCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIGZhbHNlKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90LCBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZG90R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgdGhpcy5wcmV2aW91cygpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChjb25zdW1lZCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRva2VuQXQob2Zmc2V0OiBudW1iZXIpOiBUb2tlblR5cGUge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnQgKyBvZmZzZXRdPy50eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Fycm93UGFyYW1zKCk6IGJvb2xlYW4ge1xuICAgIGxldCBpID0gdGhpcy5jdXJyZW50ICsgMTsgLy8gc2tpcCAoXG4gICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgIH1cbiAgICB3aGlsZSAoaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuSWRlbnRpZmllcikgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlID09PSBUb2tlblR5cGUuUmlnaHRQYXJlbikge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5Db21tYSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGZpbmlzaENhbGwoY2FsbGVlOiBFeHByLkV4cHIsIHBhcmVuOiBUb2tlbiwgb3B0aW9uYWw6IGJvb2xlYW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGFyZ3M6IEV4cHIuRXhwcltdID0gW107XG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICAgIGFyZ3MucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB9XG4gICAgY29uc3QgY2xvc2VQYXJlbiA9IHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGFyZ3VtZW50c2ApO1xuICAgIHJldHVybiBuZXcgRXhwci5DYWxsKGNhbGxlZSwgY2xvc2VQYXJlbiwgYXJncywgY2xvc2VQYXJlbi5saW5lLCBvcHRpb25hbCk7XG4gIH1cblxuICBwcml2YXRlIGRvdEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbmFtZTogVG9rZW4gPSB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgIGBFeHBlY3QgcHJvcGVydHkgbmFtZSBhZnRlciAnLidgXG4gICAgKTtcbiAgICBjb25zdCBrZXk6IEV4cHIuS2V5ID0gbmV3IEV4cHIuS2V5KG5hbWUsIG5hbWUubGluZSk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG5hbWUubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGJyYWNrZXRHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGxldCBrZXk6IEV4cHIuRXhwciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIGtleSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYW4gaW5kZXhgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgb3BlcmF0b3IubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHByaW1hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRmFsc2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChmYWxzZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHJ1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRydWUsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bGwpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5VbmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh1bmRlZmluZWQsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk51bWJlcikgfHwgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlbXBsYXRlKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5JZGVudGlmaWVyKSAmJiB0aGlzLnRva2VuQXQoMSkgPT09IFRva2VuVHlwZS5BcnJvdykge1xuICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lID0+XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihbcGFyYW1dLCBib2R5LCBwYXJhbS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLklkZW50aWZpZXIpKSB7XG4gICAgICBjb25zdCBpZGVudGlmaWVyID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZhcmlhYmxlKGlkZW50aWZpZXIsIGlkZW50aWZpZXIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5MZWZ0UGFyZW4pICYmIHRoaXMuaXNBcnJvd1BhcmFtcygpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSAoXG4gICAgICBjb25zdCBwYXJhbXM6IFRva2VuW10gPSBbXTtcbiAgICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHBhcmFtcy5wdXNoKHRoaXMuY29uc3VtZShUb2tlblR5cGUuSWRlbnRpZmllciwgXCJFeHBlY3RlZCBwYXJhbWV0ZXIgbmFtZVwiKSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcImApO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5BcnJvdywgYEV4cGVjdGVkIFwiPT5cImApO1xuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24ocGFyYW1zLCBib2R5LCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiIGFmdGVyIGV4cHJlc3Npb25gKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Hcm91cGluZyhleHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXN0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Wb2lkKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVm9pZChleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5EZWJ1ZykpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRlYnVnKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG5cbiAgICB0aHJvdyB0aGlzLmVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5FWFBFQ1RFRF9FWFBSRVNTSU9OLFxuICAgICAgdGhpcy5wZWVrKCksXG4gICAgICB7IHRva2VuOiB0aGlzLnBlZWsoKS5sZXhlbWUgfVxuICAgICk7XG4gICAgLy8gdW5yZWFjaGVhYmxlIGNvZGVcbiAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbChudWxsLCAwKTtcbiAgfVxuXG4gIHB1YmxpYyBkaWN0aW9uYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgbGVmdEJyYWNlID0gdGhpcy5wcmV2aW91cygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgY29uc3QgcHJvcGVydGllczogRXhwci5FeHByW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICBwcm9wZXJ0aWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaChUb2tlblR5cGUuU3RyaW5nLCBUb2tlblR5cGUuSWRlbnRpZmllciwgVG9rZW5UeXBlLk51bWJlcilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29sb24pKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBFeHByLlZhcmlhYmxlKGtleSwga2V5LmxpbmUpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgIEtFcnJvckNvZGUuSU5WQUxJRF9ESUNUSU9OQVJZX0tFWSxcbiAgICAgICAgICB0aGlzLnBlZWsoKSxcbiAgICAgICAgICB7IHRva2VuOiB0aGlzLnBlZWsoKS5sZXhlbWUgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNlLCBgRXhwZWN0ZWQgXCJ9XCIgYWZ0ZXIgb2JqZWN0IGxpdGVyYWxgKTtcblxuICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KHByb3BlcnRpZXMsIGxlZnRCcmFjZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IHZhbHVlczogRXhwci5FeHByW10gPSBbXTtcbiAgICBjb25zdCBsZWZ0QnJhY2tldCA9IHRoaXMucHJldmlvdXMoKTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGlzdChbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRG90RG90RG90KSkge1xuICAgICAgICB2YWx1ZXMucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5SaWdodEJyYWNrZXQsXG4gICAgICBgRXhwZWN0ZWQgXCJdXCIgYWZ0ZXIgYXJyYXkgZGVjbGFyYXRpb25gXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuTGlzdCh2YWx1ZXMsIGxlZnRCcmFja2V0LmxpbmUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIikgfHwgY2hhciA9PT0gXCIkXCIgfHwgY2hhciA9PT0gXCJfXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGFOdW1lcmljKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleXdvcmQod29yZDoga2V5b2YgdHlwZW9mIFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gVG9rZW5UeXBlW3dvcmRdID49IFRva2VuVHlwZS5BbmQ7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgU2Nhbm5lciB7XG4gIC8qKiBzY3JpcHRzIHNvdXJjZSBjb2RlICovXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgLyoqIGNvbnRhaW5zIHRoZSBzb3VyY2UgY29kZSByZXByZXNlbnRlZCBhcyBsaXN0IG9mIHRva2VucyAqL1xuICBwdWJsaWMgdG9rZW5zOiBUb2tlbltdO1xuICAvKiogcG9pbnRzIHRvIHRoZSBjdXJyZW50IGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIC8qKiBwb2ludHMgdG8gdGhlIHN0YXJ0IG9mIHRoZSB0b2tlbiAgKi9cbiAgcHJpdmF0ZSBzdGFydDogbnVtYmVyO1xuICAvKiogY3VycmVudCBsaW5lIG9mIHNvdXJjZSBjb2RlIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGxpbmU6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgY29sdW1uIG9mIHRoZSBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY29sOiBudW1iZXI7XG5cbiAgcHVibGljIHNjYW4oc291cmNlOiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5zdGFydCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmdldFRva2VuKCk7XG4gICAgfVxuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKFRva2VuVHlwZS5Fb2YsIFwiXCIsIG51bGwsIHRoaXMubGluZSwgMCkpO1xuICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPj0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIlxcblwiKSB7XG4gICAgICB0aGlzLmxpbmUrKztcbiAgICAgIHRoaXMuY29sID0gMDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgdGhpcy5jb2wrKztcbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb2tlbih0b2tlblR5cGU6IFRva2VuVHlwZSwgbGl0ZXJhbDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMudG9rZW5zLnB1c2gobmV3IFRva2VuKHRva2VuVHlwZSwgdGV4dCwgbGl0ZXJhbCwgdGhpcy5saW5lLCB0aGlzLmNvbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaChleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCkgIT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcGVla05leHQoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICsgMSA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCArIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gXCJcXG5cIiAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVDb21tZW50KCk6IHZvaWQge1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSAmJiAhKHRoaXMucGVlaygpID09PSBcIipcIiAmJiB0aGlzLnBlZWtOZXh0KCkgPT09IFwiL1wiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5URVJNSU5BVEVEX0NPTU1FTlQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGUgY2xvc2luZyBzbGFzaCAnKi8nXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RyaW5nKHF1b3RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IHF1b3RlICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBVbnRlcm1pbmF0ZWQgc3RyaW5nLlxuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5URVJNSU5BVEVEX1NUUklORywgeyBxdW90ZTogcXVvdGUgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGNsb3NpbmcgXCIuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG5cbiAgICAvLyBUcmltIHRoZSBzdXJyb3VuZGluZyBxdW90ZXMuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCArIDEsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIHRoaXMuYWRkVG9rZW4ocXVvdGUgIT09IFwiYFwiID8gVG9rZW5UeXBlLlN0cmluZyA6IFRva2VuVHlwZS5UZW1wbGF0ZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBudW1iZXIoKTogdm9pZCB7XG4gICAgLy8gZ2V0cyBpbnRlZ2VyIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZnJhY3Rpb25cbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLlwiICYmIFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrTmV4dCgpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gZ2V0cyBmcmFjdGlvbiBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGV4cG9uZW50XG4gICAgaWYgKHRoaXMucGVlaygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZVwiKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCItXCIgfHwgdGhpcy5wZWVrKCkgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5OdW1iZXIsIE51bWJlcih2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKCk6IHZvaWQge1xuICAgIHdoaWxlIChVdGlscy5pc0FscGhhTnVtZXJpYyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWQgPSBVdGlscy5jYXBpdGFsaXplKHZhbHVlKSBhcyBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlO1xuICAgIGlmIChVdGlscy5pc0tleXdvcmQoY2FwaXRhbGl6ZWQpKSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZVtjYXBpdGFsaXplZF0sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSWRlbnRpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSBcIihcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodFBhcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIsXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNvbW1hLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiO1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5TZW1pY29sb24sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlRpbGRlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5DYXJldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuSGFzaCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5Db2xvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TdGFyRXF1YWwgOiBUb2tlblR5cGUuU3RhcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5QZXJjZW50RXF1YWwgOiBUb2tlblR5cGUuUGVyY2VudCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwifFwiKSA/IFRva2VuVHlwZS5PciA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUGlwZWxpbmUgOlxuICAgICAgICAgIFRva2VuVHlwZS5QaXBlLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCImXCIpID8gVG9rZW5UeXBlLkFuZCA6IFRva2VuVHlwZS5BbXBlcnNhbmQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuUmlnaHRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuR3JlYXRlckVxdWFsIDogVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwgOiBUb2tlblR5cGUuQmFuZ0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5CYW5nLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiP1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI/XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCIuXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5RdWVzdGlvbkRvdFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUXVlc3Rpb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWwgOiBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj5cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuRXF1YWwsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIrXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIitcIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNQbHVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlBsdXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIi1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLk1pbnVzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLk1pbnVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI8XCIpID8gVG9rZW5UeXBlLkxlZnRTaGlmdCA6XG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gdGhpcy5tYXRjaChcIj5cIilcbiAgICAgICAgICAgICAgPyBUb2tlblR5cGUuTGVzc0VxdWFsR3JlYXRlclxuICAgICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKFwiLlwiKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90RG90LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90RG90LCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuRG90LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIvXCI6XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiL1wiKSkge1xuICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCIqXCIpKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aWxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlNsYXNoRXF1YWwgOiBUb2tlblR5cGUuU2xhc2gsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYCdgOlxuICAgICAgY2FzZSBgXCJgOlxuICAgICAgY2FzZSBcImBcIjpcbiAgICAgICAgdGhpcy5zdHJpbmcoY2hhcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gaWdub3JlIGNhc2VzXG4gICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgY2FzZSBcIlxcclwiOlxuICAgICAgY2FzZSBcIlxcdFwiOlxuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNvbXBsZXggY2FzZXNcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChVdGlscy5pc0RpZ2l0KGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5udW1iZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChVdGlscy5pc0FscGhhKGNoYXIpKSB7XG4gICAgICAgICAgdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVORVhQRUNURURfQ0hBUkFDVEVSLCB7IGNoYXI6IGNoYXIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30pOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgeyBsaW5lOiB0aGlzLmxpbmUsIGNvbDogdGhpcy5jb2wsIHNvdXJjZTogdGhpcy5zb3VyY2UgfSk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY29wZSB7XG4gIHB1YmxpYyB2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIHB1YmxpYyBwYXJlbnQ6IFNjb3BlO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudD86IFNjb3BlLCBlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgPyBwYXJlbnQgOiBudWxsO1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgaW5pdChlbnRpdHk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICh0eXBlb2YgdGhpcy52YWx1ZXNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2tleV07XG4gICAgfVxuXG4gICAgY29uc3QgJGltcG9ydHMgPSAodGhpcy52YWx1ZXM/LmNvbnN0cnVjdG9yIGFzIGFueSk/LiRpbXBvcnRzO1xuICAgIGlmICgkaW1wb3J0cyAmJiB0eXBlb2YgJGltcG9ydHNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuICRpbXBvcnRzW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvd1trZXkgYXMga2V5b2YgdHlwZW9mIHdpbmRvd107XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIEV4cHIgZnJvbSBcIi4vdHlwZXMvZXhwcmVzc2lvbnNcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIGFzIFBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIEludGVycHJldGVyIGltcGxlbWVudHMgRXhwci5FeHByVmlzaXRvcjxhbnk+IHtcbiAgcHVibGljIHNjb3BlID0gbmV3IFNjb3BlKCk7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuXG4gIHB1YmxpYyBldmFsdWF0ZShleHByOiBFeHByLkV4cHIpOiBhbnkge1xuICAgIHJldHVybiAoZXhwci5yZXN1bHQgPSBleHByLmFjY2VwdCh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQaXBlbGluZUV4cHIoZXhwcjogRXhwci5QaXBlbGluZSk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG5cbiAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuQ2FsbCkge1xuICAgICAgY29uc3QgY2FsbGVlID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0LmNhbGxlZSk7XG4gICAgICBjb25zdCBhcmdzID0gW3ZhbHVlXTtcbiAgICAgIGZvciAoY29uc3QgYXJnIG9mIGV4cHIucmlnaHQuYXJncykge1xuICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJnIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXhwci5yaWdodC5jYWxsZWUgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIucmlnaHQuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxlZSguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjb25zdCBmbiA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgcmV0dXJuIGZuKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFycm93RnVuY3Rpb25FeHByKGV4cHI6IEV4cHIuQXJyb3dGdW5jdGlvbik6IGFueSB7XG4gICAgY29uc3QgY2FwdHVyZWRTY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuc2NvcGU7XG4gICAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlKGNhcHR1cmVkU2NvcGUpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHByLnBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnBhcmFtc1tpXS5sZXhlbWUsIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5ib2R5KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9LCBsaW5lPzogbnVtYmVyLCBjb2w/OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgeyBsaW5lOiBsaW5lLCBjb2w6IGNvbCB9KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFZhcmlhYmxlRXhwcihleHByOiBFeHByLlZhcmlhYmxlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5zY29wZS5nZXQoZXhwci5uYW1lLmxleGVtZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEV4cHIuQXNzaWduKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgdGhpcy5zY29wZS5zZXQoZXhwci5uYW1lLmxleGVtZSwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEtleUV4cHIoZXhwcjogRXhwci5LZXkpOiBhbnkge1xuICAgIHJldHVybiBleHByLm5hbWUubGl0ZXJhbDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdldEV4cHIoZXhwcjogRXhwci5HZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGlmICghZW50aXR5ICYmIGV4cHIudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5W2tleV07XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTZXRFeHByKGV4cHI6IEV4cHIuU2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgZW50aXR5W2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRQb3N0Zml4RXhwcihleHByOiBFeHByLlBvc3RmaXgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSArIGV4cHIuaW5jcmVtZW50O1xuXG4gICAgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5WYXJpYWJsZSkge1xuICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5lbnRpdHkubmFtZS5sZXhlbWUsIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGV4cHIuZW50aXR5IGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgZXhwci5lbnRpdHkuZW50aXR5LFxuICAgICAgICBleHByLmVudGl0eS5rZXksXG4gICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgIGV4cHIubGluZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLklOVkFMSURfUE9TVEZJWF9MVkFMVUUsIHsgZW50aXR5OiBleHByLmVudGl0eSB9LCBleHByLmxpbmUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExpc3RFeHByKGV4cHI6IEV4cHIuTGlzdCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWVzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByLnZhbHVlKSB7XG4gICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGV4cHJlc3Npb24gYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLmV2YWx1YXRlKGV4cHJlc3Npb24pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNwcmVhZEV4cHIoZXhwcjogRXhwci5TcHJlYWQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zLCBzb3VyY2UpO1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBFeHByLlRlbXBsYXRlKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSBleHByLnZhbHVlLnJlcGxhY2UoXG4gICAgICAvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVQYXJzZShwbGFjZWhvbGRlcik7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0QmluYXJ5RXhwcihleHByOiBFeHByLkJpbmFyeSk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAtIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2g6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnQ6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50RXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICUgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGlwZTpcbiAgICAgICAgcmV0dXJuIGxlZnQgfCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkNhcmV0OlxuICAgICAgICByZXR1cm4gbGVmdCBeIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlcjpcbiAgICAgICAgcmV0dXJuIGxlZnQgPiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzOlxuICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzc0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA8PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbnN0YW5jZW9mOlxuICAgICAgICByZXR1cm4gbGVmdCBpbnN0YW5jZW9mIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuSW46XG4gICAgICAgIHJldHVybiBsZWZ0IGluIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVmdFNoaWZ0OlxuICAgICAgICByZXR1cm4gbGVmdCA8PCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlJpZ2h0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0ID4+IHJpZ2h0O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOS05PV05fQklOQVJZX09QRVJBVE9SLCB7IG9wZXJhdG9yOiBleHByLm9wZXJhdG9yIH0sIGV4cHIubGluZSk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IEV4cHIuTG9naWNhbCk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5Pcikge1xuICAgICAgaWYgKGxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IEV4cHIuVGVybmFyeSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5jb25kaXRpb24pXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmIChsZWZ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBFeHByLkdyb3VwaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogRXhwci5MaXRlcmFsKTogYW55IHtcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFVuYXJ5RXhwcihleHByOiBFeHByLlVuYXJ5KTogYW55IHtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgICByZXR1cm4gLXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZzpcbiAgICAgICAgcmV0dXJuICFyaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlRpbGRlOlxuICAgICAgICByZXR1cm4gfnJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgICBOdW1iZXIocmlnaHQpICsgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlBsdXNQbHVzID8gMSA6IC0xKTtcbiAgICAgICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5yaWdodC5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgICAgIGV4cHIucmlnaHQuZW50aXR5LFxuICAgICAgICAgICAgZXhwci5yaWdodC5rZXksXG4gICAgICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICAgIEtFcnJvckNvZGUuSU5WQUxJRF9QUkVGSVhfUlZBTFVFLFxuICAgICAgICAgICAgeyByaWdodDogZXhwci5yaWdodCB9LFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5LTk9XTl9VTkFSWV9PUEVSQVRPUiwgeyBvcGVyYXRvcjogZXhwci5vcGVyYXRvciB9LCBleHByLmxpbmUpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gc2hvdWxkIGJlIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q2FsbEV4cHIoZXhwcjogRXhwci5DYWxsKTogYW55IHtcbiAgICAvLyB2ZXJpZnkgY2FsbGVlIGlzIGEgZnVuY3Rpb25cbiAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2FsbGVlKTtcbiAgICBpZiAoY2FsbGVlID09IG51bGwgJiYgZXhwci5vcHRpb25hbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIGNhbGxlZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTk9UX0FfRlVOQ1RJT04sIHsgY2FsbGVlOiBjYWxsZWUgfSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgLy8gZXZhbHVhdGUgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgY29uc3QgYXJncyA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJndW1lbnQgb2YgZXhwci5hcmdzKSB7XG4gICAgICBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJndW1lbnQgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmd1bWVudCkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBleGVjdXRlIGZ1bmN0aW9uIOKAlCBwcmVzZXJ2ZSBgdGhpc2AgZm9yIG1ldGhvZCBjYWxsc1xuICAgIGlmIChleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShleHByLmNsYXp6KTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgS0Vycm9yQ29kZS5OT1RfQV9DTEFTUyxcbiAgICAgICAgeyBjbGF6ejogY2xhenogfSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgZXhwci5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChwcm9wZXJ0eSBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGljdCwgdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkua2V5KTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50S05vZGUoa25vZGU6IEVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlS05vZGUoa25vZGU6IEF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRUZXh0S05vZGUoa25vZGU6IFRleHQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0Q29tbWVudEtOb2RlKGtub2RlOiBDb21tZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdERvY3R5cGVLTm9kZShrbm9kZTogRG9jdHlwZSwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IEtOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBzZWxmOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBLTm9kZVtdLCBjaGlsZHJlbjogS05vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0VPRiwgeyBlb2ZFcnJvcjogZW9mRXJyb3IgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2soY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9KTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgeyBsaW5lOiB0aGlzLmxpbmUsIGNvbDogdGhpcy5jb2wsIHNvdXJjZTogdGhpcy5zb3VyY2UgfSk7XG4gIH1cblxuICBwcml2YXRlIG5vZGUoKTogTm9kZS5LTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuS05vZGU7XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9DTE9TSU5HX1RBRyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IS0tXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5jb21tZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPCFkb2N0eXBlXCIpIHx8IHRoaXMubWF0Y2goXCI8IURPQ1RZUEVcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmRvY3R5cGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8XCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5lbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiBudWxsIHtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9UQUdfTkFNRSk7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVCk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogbmFtZSB9KTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBwYXJlbnQgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuQkxBTktfQVRUUklCVVRFX05BTUUpO1xuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoXCInXCIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKCdcIicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwie3tcIikpIHsgZGVwdGgrKzsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgdGhpcy5tYXRjaChcIn19XCIpKSB7IGRlcHRoLS07IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdGhpcy5wZWVrKFwiPFwiKSkgeyBicmVhazsgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXJhdykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRoaXMuZGVjb2RlRW50aXRpZXMocmF3KSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUVudGl0aWVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCJcXHUwMGEwXCIpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgICAgLnJlcGxhY2UoLyZhcG9zOy9nLCBcIidcIilcbiAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7IC8vIG11c3QgYmUgbGFzdCB0byBhdm9pZCBkb3VibGUtZGVjb2RpbmdcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q2xhc3MgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSb3V0ZUNvbmZpZyB7XG4gIHBhdGg6IHN0cmluZztcbiAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgZ3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGUocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwiXCIsIHBhdGgpO1xuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgUG9wU3RhdGVFdmVudChcInBvcHN0YXRlXCIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoUGF0aChwYXR0ZXJuOiBzdHJpbmcsIHBhdGhuYW1lOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGlmIChwYXR0ZXJuID09PSBcIipcIikgcmV0dXJuIHt9O1xuICBjb25zdCBwYXR0ZXJuUGFydHMgPSBwYXR0ZXJuLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHBhdGhuYW1lLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmIChwYXR0ZXJuUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVyblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHBhdHRlcm5QYXJ0c1tpXS5zdGFydHNXaXRoKFwiOlwiKSkge1xuICAgICAgcGFyYW1zW3BhdHRlcm5QYXJ0c1tpXS5zbGljZSgxKV0gPSBwYXRoUGFydHNbaV07XG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuUGFydHNbaV0gIT09IHBhdGhQYXJ0c1tpXSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBwcml2YXRlIHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuXG4gIHNldFJvdXRlcyhyb3V0ZXM6IFJvdXRlQ29uZmlnW10pOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcbiAgfVxuXG4gIG9uTW91bnQoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCAoKSA9PiB0aGlzLl9uYXZpZ2F0ZSgpLCB7XG4gICAgICBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwsXG4gICAgfSk7XG4gICAgdGhpcy5fbmF2aWdhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX25hdmlnYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGZvciAoY29uc3Qgcm91dGUgb2YgdGhpcy5yb3V0ZXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoUGF0aChyb3V0ZS5wYXRoLCBwYXRobmFtZSk7XG4gICAgICBpZiAocGFyYW1zID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIGlmIChyb3V0ZS5ndWFyZCkge1xuICAgICAgICBjb25zdCBhbGxvd2VkID0gYXdhaXQgcm91dGUuZ3VhcmQoKTtcbiAgICAgICAgaWYgKCFhbGxvd2VkKSByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9tb3VudChyb3V0ZS5jb21wb25lbnQsIHBhcmFtcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbW91bnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5yZWYgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCFlbGVtZW50IHx8ICF0aGlzLnRyYW5zcGlsZXIpIHJldHVybjtcbiAgICB0aGlzLnRyYW5zcGlsZXIubW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3MsIGVsZW1lbnQsIHBhcmFtcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBCb3VuZGFyeSB7XG4gIHByaXZhdGUgc3RhcnQ6IENvbW1lbnQ7XG4gIHByaXZhdGUgZW5kOiBDb21tZW50O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogTm9kZSwgbGFiZWw6IHN0cmluZyA9IFwiYm91bmRhcnlcIikge1xuICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1zdGFydGApO1xuICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tZW5kYCk7XG4gICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0aGlzLnN0YXJ0KTtcbiAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGhpcy5lbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5lbmQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSBcIi4vZXJyb3ItaGFuZGxlclwiO1xuXG50eXBlIFRhc2sgPSAoKSA9PiB2b2lkO1xuXG5jb25zdCBxdWV1ZSA9IG5ldyBNYXA8Q29tcG9uZW50LCBUYXNrW10+KCk7XG5jb25zdCBuZXh0VGlja0NhbGxiYWNrczogVGFza1tdID0gW107XG5sZXQgaXNTY2hlZHVsZWQgPSBmYWxzZTtcbmxldCBiYXRjaGluZ0VuYWJsZWQgPSB0cnVlO1xuXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgaXNTY2hlZHVsZWQgPSBmYWxzZTtcblxuICAvLyAxLiBQcm9jZXNzIGNvbXBvbmVudCB1cGRhdGVzXG4gIGZvciAoY29uc3QgW2luc3RhbmNlLCB0YXNrc10gb2YgcXVldWUuZW50cmllcygpKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbGwgcHJlLXVwZGF0ZSBob29rIChvbmx5IGZvciByZWFjdGl2ZSB1cGRhdGVzLCBub3QgZmlyc3QgbW91bnQpXG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uQ2hhbmdlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGluc3RhbmNlLm9uQ2hhbmdlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBSdW4gYWxsIHN1cmdpY2FsIERPTSB1cGRhdGVzIGZvciB0aGlzIGNvbXBvbmVudFxuICAgICAgZm9yIChjb25zdCB0YXNrIG9mIHRhc2tzKSB7XG4gICAgICAgIHRhc2soKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FsbCBwb3N0LXVwZGF0ZSBob29rXG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBoYW5kbGVFcnJvcihlLCAncmVuZGVyJywgaW5zdGFuY2UpO1xuICAgIH1cbiAgfVxuICBxdWV1ZS5jbGVhcigpO1xuXG4gIC8vIDIuIFByb2Nlc3MgbmV4dFRpY2sgY2FsbGJhY2tzXG4gIGNvbnN0IGNhbGxiYWNrcyA9IG5leHRUaWNrQ2FsbGJhY2tzLnNwbGljZSgwKTtcbiAgZm9yIChjb25zdCBjYiBvZiBjYWxsYmFja3MpIHtcbiAgICB0cnkge1xuICAgICAgY2IoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBoYW5kbGVFcnJvcihlLCAncmVuZGVyJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZVVwZGF0ZShpbnN0YW5jZTogQ29tcG9uZW50LCB0YXNrOiBUYXNrKSB7XG4gIGlmICghYmF0Y2hpbmdFbmFibGVkKSB7XG4gICAgdGFzaygpO1xuICAgIC8vIER1cmluZyBzeW5jIG1vdW50LCB3ZSBkb24ndCBjYWxsIG9uQ2hhbmdlcyBvciBvblJlbmRlciBoZXJlLlxuICAgIC8vIG9uUmVuZGVyIGlzIGNhbGxlZCBtYW51YWxseSBhdCB0aGUgZW5kIG9mIHRyYW5zcGlsZS9ib290c3RyYXAuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFxdWV1ZS5oYXMoaW5zdGFuY2UpKSB7XG4gICAgcXVldWUuc2V0KGluc3RhbmNlLCBbXSk7XG4gIH1cbiAgcXVldWUuZ2V0KGluc3RhbmNlKSEucHVzaCh0YXNrKTtcblxuICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCYXRjaGluZygpOiBib29sZWFuIHtcbiAgcmV0dXJuIGJhdGNoaW5nRW5hYmxlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsdXNoU3luYyhmbjogKCkgPT4gdm9pZCkge1xuICBjb25zdCBwcmV2ID0gYmF0Y2hpbmdFbmFibGVkO1xuICBiYXRjaGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nRW5hYmxlZCA9IHByZXY7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZSBuZXh0IGZyYW1ld29yayB1cGRhdGUgY3ljbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljaygpOiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNiOiBUYXNrKTogdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYj86IFRhc2spOiBQcm9taXNlPHZvaWQ+IHwgdm9pZCB7XG4gIGlmIChjYikge1xuICAgIG5leHRUaWNrQ2FsbGJhY2tzLnB1c2goY2IpO1xuICAgIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbmV4dFRpY2tDYWxsYmFja3MucHVzaChyZXNvbHZlKTtcbiAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudENsYXNzLCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlQ29uZmlnIH0gZnJvbSBcIi4vcm91dGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgZWZmZWN0IH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBCb3VuZGFyeSB9IGZyb20gXCIuL2JvdW5kYXJ5XCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgcXVldWVVcGRhdGUsIGZsdXNoU3luYyB9IGZyb20gXCIuL3NjaGVkdWxlclwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSBcIi4vZXJyb3ItaGFuZGxlclwiO1xuaW1wb3J0IHsgaXNCYXRjaGluZyB9IGZyb20gXCIuL3NjaGVkdWxlclwiO1xuaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxuY29uc3QgS0VZX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge1xuICBlc2M6IFtcIkVzY2FwZVwiLCBcIkVzY1wiXSxcbiAgZXNjYXBlOiBbXCJFc2NhcGVcIiwgXCJFc2NcIl0sXG4gIHNwYWNlOiBbXCIgXCIsIFwiU3BhY2ViYXJcIl0sXG4gIHVwOiBbXCJBcnJvd1VwXCIsIFwiVXBcIl0sXG4gIGRvd246IFtcIkFycm93RG93blwiLCBcIkRvd25cIl0sXG4gIGxlZnQ6IFtcIkFycm93TGVmdFwiLCBcIkxlZnRcIl0sXG4gIHJpZ2h0OiBbXCJBcnJvd1JpZ2h0XCIsIFwiUmlnaHRcIl0sXG4gIGRlbDogW1wiRGVsZXRlXCIsIFwiRGVsXCJdLFxuICBkZWxldGU6IFtcIkRlbGV0ZVwiLCBcIkRlbFwiXSxcbiAgaW5zOiBbXCJJbnNlcnRcIl0sXG4gIGRvdDogW1wiLlwiXSxcbiAgY29tbWE6IFtcIixcIl0sXG4gIHNsYXNoOiBbXCIvXCJdLFxuICBiYWNrc2xhc2g6IFtcIlxcXFxcIl0sXG4gIHBsdXM6IFtcIitcIl0sXG4gIG1pbnVzOiBbXCItXCJdLFxuICBlcXVhbDogW1wiPVwiXSxcbn07XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XG4gIHB1YmxpYyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgPSB7fTtcbiAgcHVibGljIG1vZGU6IFwiZGV2ZWxvcG1lbnRcIiB8IFwicHJvZHVjdGlvblwiID0gXCJkZXZlbG9wbWVudFwiO1xuICBwcml2YXRlIGlzUmVuZGVyaW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IHsgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5IH0pIHtcbiAgICB0aGlzLnJlZ2lzdHJ5W1wicm91dGVyXCJdID0geyBjb21wb25lbnQ6IFJvdXRlciB9O1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuO1xuICAgIGlmIChvcHRpb25zLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0geyAuLi50aGlzLnJlZ2lzdHJ5LCAuLi5vcHRpb25zLnJlZ2lzdHJ5IH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJDb21wb25lbnRJbnN0YW5jZShcbiAgICBpbnN0YW5jZTogYW55LFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHJlc3RvcmVTY29wZTogU2NvcGUsXG4gICAgc2xvdHM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICk6IHZvaWQge1xuICAgIGlmIChzbG90cykgaW5zdGFuY2UuJHNsb3RzID0gc2xvdHM7XG5cbiAgICBpbnN0YW5jZS4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koZWxlbWVudCk7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBpbnN0YW5jZSk7XG4gICAgICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBpbnN0YW5jZSk7XG4gICAgICAgIGlmIChzbG90cykgaW5zdGFuY2UuJHNsb3RzID0gc2xvdHM7XG4gICAgICAgIGNvbnN0IHByZXZTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBlbGVtZW50KTtcbiAgICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikgaW5zdGFuY2Uub25Nb3VudCgpO1xuXG4gICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBpbnN0YW5jZSk7XG4gICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGluc3RhbmNlKTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGVsZW1lbnQpO1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgIH0pO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZU5vZGVzKHRhZzogc3RyaW5nKTogS05vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLnJlZ2lzdHJ5W3RhZ107XG4gICAgaWYgKGVudHJ5Lm5vZGVzICE9PSB1bmRlZmluZWQpIHJldHVybiBlbnRyeS5ub2RlcztcbiAgICBjb25zdCBzb3VyY2UgPSAoZW50cnkuY29tcG9uZW50IGFzIGFueSkudGVtcGxhdGU7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIGVudHJ5Lm5vZGVzID0gW107XG4gICAgICByZXR1cm4gZW50cnkubm9kZXM7XG4gICAgfVxuICAgIGVudHJ5Lm5vZGVzID0gdGhpcy50ZW1wbGF0ZVBhcnNlci5wYXJzZShzb3VyY2UpO1xuICAgIHJldHVybiBlbnRyeS5ub2RlcztcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgY29uc3QgZWwgPSBub2RlIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBjb25zdCBtaXNwbGFjZWQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZWlmXCIsIFwiQGVsc2VcIl0pO1xuICAgICAgaWYgKG1pc3BsYWNlZCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgaGFuZGxlZCBieSBkb0lmLCBpZiB3ZSByZWFjaCB0aGVtIGhlcmUgaXQncyBhbiBlcnJvclxuICAgICAgICBjb25zdCBuYW1lID0gbWlzcGxhY2VkLm5hbWUuc3RhcnRzV2l0aChcIkBcIikgPyBtaXNwbGFjZWQubmFtZS5zbGljZSgxKSA6IG1pc3BsYWNlZC5uYW1lO1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTUExBQ0VEX0NPTkRJVElPTkFMLCB7IG5hbWU6IG5hbWUgfSwgZWwubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGtleSk/LmdldCkgY29udGludWU7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgZW50aXR5W2tleV0gPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgIGtleSAhPT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlbnRpdHksIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW50aXR5W2tleV0gPSBlbnRpdHlba2V5XS5iaW5kKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGVzIGFuIGVmZmVjdCB0aGF0IHJlc3RvcmVzIHRoZSBjdXJyZW50IHNjb3BlIG9uIGV2ZXJ5IHJlLXJ1bixcbiAgLy8gc28gZWZmZWN0cyBzZXQgdXAgaW5zaWRlIEBlYWNoIGFsd2F5cyBldmFsdWF0ZSBpbiB0aGVpciBpdGVtIHNjb3BlLlxuICBwcml2YXRlIHNjb3BlZEVmZmVjdChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGlzQmF0Y2hpbmcoKSkge1xuICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgICAgaGFuZGxlRXJyb3IoZSwgXCJyZW5kZXJcIiwgaW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gV3JhcHMgYSByZWZyZXNoIGZ1bmN0aW9uIHNvIGl0IHJlc3RvcmVzIHRoZSBjb3JyZWN0IHNjb3BlIHdoZW4gY2FsbGVkXG4gIC8vIGRpcmVjdGx5IGJ5IHRyaWdnZXJSZWZyZXNoIChvdXRzaWRlIG9mIHRoZSBzaWduYWwgZWZmZWN0IG1hY2hpbmVyeSkuXG4gIHByaXZhdGUgc2NvcGVkUmVmcmVzaChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIGV2YWx1YXRlcyBleHByZXNzaW9ucyBhbmQgcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBmaXJzdCBldmFsdWF0aW9uXG4gIHByaXZhdGUgZXhlY3V0ZShzb3VyY2U6IHN0cmluZywgb3ZlcnJpZGVTY29wZT86IFNjb3BlKTogYW55IHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zLCBzb3VyY2UpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3BpbGUoXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZW50aXR5OiBhbnksXG4gICAgY29udGFpbmVyOiBFbGVtZW50XG4gICk6IE5vZGUge1xuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBlbnRpdHkpO1xuXG4gICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgICAgICB0aGlzLnRyaWdnZXJSZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCAoKSA9PiB7XG4gICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ciA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShub2RlLm5hbWUpO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGF0dHIudmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFja0VmZmVjdChhdHRyLCBzdG9wKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIChwYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKF9ub2RlOiBLTm9kZS5Db21tZW50LCBfcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIC8vIHRlbXBsYXRlIGNvbW1lbnRzIGFyZSBzdHJpcHBlZCBmcm9tIERPTSBvdXRwdXRcbiAgfVxuXG4gIHByaXZhdGUgdHJhY2tFZmZlY3QodGFyZ2V0OiBhbnksIHN0b3A6IGFueSkge1xuICAgIGlmICghdGFyZ2V0LiRrYXNwZXJFZmZlY3RzKSB0YXJnZXQuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB0YXJnZXQuJGthc3BlckVmZmVjdHMucHVzaChzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEF0dHIoXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcbiAgICBuYW1lOiBzdHJpbmdbXVxuICApOiBLTm9kZS5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuYXR0cmlidXRlcyB8fCAhbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmliID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+XG4gICAgICBuYW1lLmluY2x1ZGVzKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZSlcbiAgICApO1xuICAgIGlmIChhdHRyaWIpIHtcbiAgICAgIHJldHVybiBhdHRyaWIgYXMgS05vZGUuQXR0cmlidXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9JZihleHByZXNzaW9uczogSWZFbHNlTm9kZVtdLCBwYXJlbnQ6IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiaWZcIik7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0cmFja2luZ1Njb3BlID0gaW5zdGFuY2UgPyBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSkgOiB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuXG4gICAgICAvLyBFdmFsdWF0ZSBjb25kaXRpb25zIHN5bmNocm9ub3VzbHkgdG8gZW5zdXJlIHNpZ25hbCB0cmFja2luZ1xuICAgICAgY29uc3QgcmVzdWx0czogYm9vbGVhbltdID0gW107XG4gICAgICByZXN1bHRzLnB1c2goISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25zWzBdWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpKTtcblxuICAgICAgaWYgKCFyZXN1bHRzWzBdKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxKSkge1xuICAgICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICEhdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHZhbCk7XG4gICAgICAgICAgICBpZiAodmFsKSBicmVhaztcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZVwiXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gdHJhY2tpbmdTY29wZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0c1swXSkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnNbMF1bMF0uYWNjZXB0KHRoaXMsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0c1tpXSkge1xuICAgICAgICAgICAgICBleHByZXNzaW9uc1tpXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHRoaXMuc2NvcGVkUmVmcmVzaChydW4pO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuICAgIGlmIChrZXlBdHRyKSB7XG4gICAgICB0aGlzLmRvRWFjaEtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCwga2V5QXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9FYWNoVW5rZXllZChlYWNoLCBub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoVW5rZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChrZXkpIHNjb3BlVmFsdWVzW2tleV0gPSBpbmRleDtcblxuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHRoaXMuc2NvcGVkUmVmcmVzaChydW4pO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIHRyaWdnZXJSZWZyZXNoKG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICAvLyAxLiBSZS1ydW4gc3RydWN0dXJhbCBsb2dpYyAoaWYvZWFjaC93aGlsZSlcbiAgICBpZiAoKG5vZGUgYXMgYW55KS4ka2FzcGVyUmVmcmVzaCkge1xuICAgICAgKG5vZGUgYXMgYW55KS4ka2FzcGVyUmVmcmVzaCgpO1xuICAgIH1cblxuICAgIC8vIDIuIFJlLXJ1biBhbGwgc3VyZ2ljYWwgZWZmZWN0cyAodGV4dCBpbnRlcnBvbGF0aW9uLCBhdHRyaWJ1dGVzLCBldGMuKVxuICAgIGlmICgobm9kZSBhcyBhbnkpLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAobm9kZSBhcyBhbnkpLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6IGFueSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHN0b3AucnVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdG9wLnJ1bigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAzLiBSZWN1cnNlXG4gICAgbm9kZS5jaGlsZE5vZGVzPy5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy50cmlnZ2VyUmVmcmVzaChjaGlsZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hLZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSwga2V5QXR0cjogS05vZGUuQXR0cmlidXRlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgY29uc3Qga2V5ZWROb2RlcyA9IG5ldyBNYXA8YW55LCBOb2RlPigpO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwgaW5kZXhLZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IGl0ZW1zIGFuZCB0aGVpciBrZXlzIGltbWVkaWF0ZWx5XG4gICAgICBjb25zdCBuZXdJdGVtczogQXJyYXk8eyBpdGVtOiBhbnk7IGlkeDogbnVtYmVyOyBrZXk6IGFueSB9PiA9IFtdO1xuICAgICAgY29uc3Qgc2VlbktleXMgPSBuZXcgU2V0KCk7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGluZGV4O1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5leGVjdXRlKGtleUF0dHIudmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBzZWVuS2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgW0thc3Blcl0gRHVwbGljYXRlIGtleSBkZXRlY3RlZCBpbiBAZWFjaDogXCIke2tleX1cIi4gS2V5cyBtdXN0IGJlIHVuaXF1ZSB0byBlbnN1cmUgY29ycmVjdCByZWNvbmNpbGlhdGlvbi5gKTtcbiAgICAgICAgfVxuICAgICAgICBzZWVuS2V5cy5hZGQoa2V5KTtcblxuICAgICAgICBuZXdJdGVtcy5wdXNoKHsgaXRlbTogaXRlbSwgaWR4OiBpbmRleCwga2V5OiBrZXkgfSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgIC8vIERlc3Ryb3kgbm9kZXMgd2hvc2Uga2V5cyBhcmUgbm8gbG9uZ2VyIHByZXNlbnRcbiAgICAgICAgY29uc3QgbmV3S2V5U2V0ID0gbmV3IFNldChuZXdJdGVtcy5tYXAoKGkpID0+IGkua2V5KSk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZG9tTm9kZV0gb2Yga2V5ZWROb2Rlcykge1xuICAgICAgICAgIGlmICghbmV3S2V5U2V0LmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lOb2RlKGRvbU5vZGUpO1xuICAgICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChkb21Ob2RlKTtcbiAgICAgICAgICAgIGtleWVkTm9kZXMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5zZXJ0L3JldXNlIG5vZGVzIGluIG5ldyBvcmRlciB1c2luZyBhIGN1cnNvciB0byBhdm9pZCB1bm5lY2Vzc2FyeSBtb3Zlc1xuICAgICAgICBjb25zdCBwYXJlbnQgPSAoYm91bmRhcnkgYXMgYW55KS5lbmQucGFyZW50Tm9kZSBhcyBOb2RlO1xuICAgICAgICBsZXQgbGFzdEluc2VydGVkOiBOb2RlID0gKGJvdW5kYXJ5IGFzIGFueSkuc3RhcnQ7XG5cbiAgICAgICAgZm9yIChjb25zdCB7IGl0ZW0sIGlkeCwga2V5IH0gb2YgbmV3SXRlbXMpIHtcbiAgICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgICBpZiAoaW5kZXhLZXkpIHNjb3BlVmFsdWVzW2luZGV4S2V5XSA9IGlkeDtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcblxuICAgICAgICAgIGlmIChrZXllZE5vZGVzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBkb21Ob2RlID0ga2V5ZWROb2Rlcy5nZXQoa2V5KSE7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgbW92ZSB0aGUgbm9kZSBpZiBpdCdzIG5vdCBhbHJlYWR5IGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAobGFzdEluc2VydGVkLm5leHRTaWJsaW5nICE9PSBkb21Ob2RlKSB7XG4gICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgbGFzdEluc2VydGVkLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RJbnNlcnRlZCA9IGRvbU5vZGU7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzY29wZSBhbmQgdHJpZ2dlciByZS1yZW5kZXIgb2YgbmVzdGVkIHN0cnVjdHVyYWwgZGlyZWN0aXZlc1xuICAgICAgICAgICAgY29uc3Qgbm9kZVNjb3BlID0gKGRvbU5vZGUgYXMgYW55KS4ka2FzcGVyU2NvcGU7XG4gICAgICAgICAgICBpZiAobm9kZVNjb3BlKSB7XG4gICAgICAgICAgICAgIG5vZGVTY29wZS5zZXQobmFtZSwgaXRlbSk7XG4gICAgICAgICAgICAgIGlmIChpbmRleEtleSkgbm9kZVNjb3BlLnNldChpbmRleEtleSwgaWR4KTtcblxuICAgICAgICAgICAgICAvLyBJZiBpdCBoYXMgaXRzIG93biByZW5kZXIgbG9naWMgKG5lc3RlZCBlYWNoL2lmKSwgdHJpZ2dlciBpdCByZWN1cnNpdmVseVxuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJSZWZyZXNoKGRvbU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjcmVhdGVkID0gdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICBpZiAoY3JlYXRlZCkge1xuICAgICAgICAgICAgICAvLyBjcmVhdGVFbGVtZW50IGluc2VydHMgYmVmb3JlIGVuZDsgbW92ZSB0byBjb3JyZWN0IHBvc2l0aW9uIGlmIG5lZWRlZFxuICAgICAgICAgICAgICBpZiAobGFzdEluc2VydGVkLm5leHRTaWJsaW5nICE9PSBjcmVhdGVkKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjcmVhdGVkLCBsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxhc3RJbnNlcnRlZCA9IGNyZWF0ZWQ7XG4gICAgICAgICAgICAgIGtleWVkTm9kZXMuc2V0KGtleSwgY3JlYXRlZCk7XG4gICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBzY29wZSBvbiB0aGUgRE9NIG5vZGUgc28gd2UgY2FuIHVwZGF0ZSBpdCBsYXRlclxuICAgICAgICAgICAgICAoY3JlYXRlZCBhcyBhbnkpLiRrYXNwZXJTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgICAgfTtcblxuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCB0YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhc2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgKGJvdW5kYXJ5IGFzIGFueSkuc3RhcnQuJGthc3BlclJlZnJlc2ggPSB0aGlzLnNjb3BlZFJlZnJlc2gocnVuKTtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZVNpYmxpbmdzKG5vZGVzOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSAwO1xuICAgIGNvbnN0IGluaXRpYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgbGV0IGdyb3VwU2NvcGU6IFNjb3BlIHwgbnVsbCA9IG51bGw7XG5cbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcblxuICAgICAgICAvLyAxLiBQcm9jZXNzIEBsZXQgKGxlYWtzIHRvIHNpYmxpbmdzIGFuZCBhdmFpbGFibGUgdG8gb3RoZXIgZGlyZWN0aXZlcyBvbiB0aGlzIG5vZGUpXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICBpZiAoIWdyb3VwU2NvcGUpIHtcbiAgICAgICAgICAgIGdyb3VwU2NvcGUgPSBuZXcgU2NvcGUoaW5pdGlhbFNjb3BlKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBncm91cFNjb3BlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmV4ZWN1dGUoJGxldC52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAyLiBWYWxpZGF0aW9uOiBTdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgICBjb25zdCBpZkF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAaWZcIl0pO1xuICAgICAgICBjb25zdCBlbHNlaWZBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VpZlwiXSk7XG4gICAgICAgIGNvbnN0IGVsc2VBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VcIl0pO1xuICAgICAgICBjb25zdCAkZWFjaCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlYWNoXCJdKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlID09PSBcImRldmVsb3BtZW50XCIpIHtcbiAgICAgICAgICBjb25zdCBzdHJ1Y3R1cmFsQ291bnQgPSBbaWZBdHRyLCBlbHNlaWZBdHRyLCBlbHNlQXR0ciwgJGVhY2hdLmZpbHRlcihhID0+IGEpLmxlbmd0aDtcbiAgICAgICAgICBpZiAoc3RydWN0dXJhbENvdW50ID4gMSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUywge30sIGVsLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIFByb2Nlc3Mgc3RydWN0dXJhbCBkaXJlY3RpdmVzIChvbmUgd2lsbCBtYXRjaCBhbmQgY29udGludWUpXG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBlbCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWZBdHRyKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbZWwsIGlmQXR0cl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBub2Rlc1tjdXJyZW50XTtcbiAgICAgICAgICAgIGlmIChuZXh0LnR5cGUgIT09IFwiZWxlbWVudFwiKSBicmVhaztcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5leHQgYXMgS05vZGUuRWxlbWVudCwgW1xuICAgICAgICAgICAgICBcIkBlbHNlXCIsXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKFtuZXh0IGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IGluaXRpYWxTY29wZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudChub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChub2RlLm5hbWUgPT09IFwic2xvdFwiKSB7XG4gICAgICAgIGNvbnN0IG5hbWVBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAbmFtZVwiXSk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lQXR0ciA/IG5hbWVBdHRyLnZhbHVlIDogXCJkZWZhdWx0XCI7XG4gICAgICAgIGNvbnN0IHNsb3RzID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkc2xvdHNcIik7XG4gICAgICAgIGlmIChzbG90cyAmJiBzbG90c1tuYW1lXSkge1xuICAgICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIHNjb3BlIHdoZXJlIHRoZSBzbG90IGNvbnRlbnQgd2FzIGRlZmluZWQgKExleGljYWwgU2NvcGluZykuXG4gICAgICAgICAgLy8gV2Ugc3RvcmUgdGhlIHNjb3BlIHJlZmVyZW5jZSBkaXJlY3RseSBvbiB0aGUgQXJyYXkgaW5zdGFuY2UgdG8gYXZvaWQgY2hhbmdpbmcgc2lnbmF0dXJlcy5cbiAgICAgICAgICBpZiAoc2xvdHNbbmFtZV0uc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzbG90c1tuYW1lXS5zY29wZTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuXG4gICAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQ29tcG9uZW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgICAgbGV0IGNvbXBvbmVudDogYW55ID0ge307XG4gICAgICAgIGNvbnN0IGFyZ3NBdHRyID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnc0F0dHIgYXMgS05vZGUuQXR0cmlidXRlW10pO1xuXG4gICAgICAgIC8vIENhcHR1cmUgY2hpbGRyZW4gZm9yIHNsb3RzLiBcbiAgICAgICAgLy8gV2UgdXNlIGEgcGxhaW4gb2JqZWN0IGtleWVkIGJ5IHNsb3QgbmFtZS4gRWFjaCB2YWx1ZSBpcyBhbiBBcnJheSBvZiBLTm9kZXMuXG4gICAgICAgIC8vIFRvIHN1cHBvcnQgbGV4aWNhbCBzY29waW5nLCB3ZSBhdHRhY2ggdGhlIGN1cnJlbnQgc2NvcGUgdG8gdGhlIEFycmF5IGluc3RhbmNlLlxuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgZGVmYXVsdDogW10gfTtcbiAgICAgICAgc2xvdHMuZGVmYXVsdC5zY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBzbG90XCJdKTtcbiAgICAgICAgICAgIGlmIChzbG90QXR0cikge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc2xvdEF0dHIudmFsdWU7XG4gICAgICAgICAgICAgIGlmICghc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBzbG90c1tuYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgIHNsb3RzW25hbWVdLnNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzbG90c1tuYW1lXS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsb3RzLmRlZmF1bHQucHVzaChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5sYXp5KSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG5cbiAgICAgICAgICBpZiAoZW50cnkuZmFsbGJhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrTm9kZXMgPSB0aGlzLnRlbXBsYXRlUGFyc2VyLnBhcnNlKChlbnRyeS5mYWxsYmFjayBhcyBhbnkpLnRlbXBsYXRlID8/IFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tJbnN0YW5jZTogYW55ID0gbmV3IGVudHJ5LmZhbGxiYWNrKHsgYXJnczoge30sIHJlZjogZWxlbWVudCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoZmFsbGJhY2tJbnN0YW5jZSk7XG4gICAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGZhbGxiYWNrSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGZhbGxiYWNrSW5zdGFuY2UsIGZhbGxiYWNrTm9kZXMsIGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHJlc3RvcmVTY29wZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCEoZW50cnkgYXMgYW55KS5fcHJvbWlzZSkge1xuICAgICAgICAgICAgKGVudHJ5IGFzIGFueSkuX3Byb21pc2UgPSAoZW50cnkuY29tcG9uZW50IGFzICgpID0+IFByb21pc2U8Q29tcG9uZW50Q2xhc3M+KSgpLnRoZW4oKGNscykgPT4ge1xuICAgICAgICAgICAgICBlbnRyeS5ub2RlcyA9IHRoaXMudGVtcGxhdGVQYXJzZXIucGFyc2UoKGNscyBhcyBhbnkpLnRlbXBsYXRlID8/IFwiXCIpO1xuICAgICAgICAgICAgICBlbnRyeS5jb21wb25lbnQgPSBjbHM7XG4gICAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5sYXp5O1xuICAgICAgICAgICAgICBkZWxldGUgKGVudHJ5IGFzIGFueSkuX3Byb21pc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAoZW50cnkgYXMgYW55KS5fcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3QgY2xzID0gZW50cnkuY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2U6IGFueSA9IG5ldyBjbHMoeyBhcmdzOiBhcmdzLCByZWY6IGVsZW1lbnQsIHRyYW5zcGlsZXI6IHRoaXMgfSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGluc3RhbmNlKTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGluc3RhbmNlLCBlbnRyeS5ub2RlcyEsIGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHJlc3RvcmVTY29wZSwgc2xvdHMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLmNvbXBvbmVudCBhcyBDb21wb25lbnRDbGFzcykoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBpZiAobm9kZS5uYW1lID09PSBcInJvdXRlclwiICYmIGNvbXBvbmVudCBpbnN0YW5jZW9mIFJvdXRlcikge1xuICAgICAgICAgICAgY29uc3Qgcm91dGVTY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0Um91dGVzKHRoaXMuZXh0cmFjdFJvdXRlcyhub2RlLmNoaWxkcmVuLCB1bmRlZmluZWQsIHJvdXRlU2NvcGUpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGNvbXBvbmVudCwgdGhpcy5yZXNvbHZlTm9kZXMobm9kZS5uYW1lKSwgZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcmVzdG9yZVNjb3BlLCBzbG90cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWb2lkKSB7XG4gICAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgICAgY29uc3QgZXZlbnRzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudCBhcyBLTm9kZS5BdHRyaWJ1dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgZmlyc3QpXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAgIChhdHRyKSA9PiAhKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGF0dHIsIGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvcnRoYW5kIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBzZWNvbmQsIGFsbG93cyBtZXJnaW5nKVxuICAgICAgICBjb25zdCBzaG9ydGhhbmRBdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG5hbWUuc3RhcnRzV2l0aChcIkBcIikgJiZcbiAgICAgICAgICAgICFbXCJAaWZcIiwgXCJAZWxzZWlmXCIsIFwiQGVsc2VcIiwgXCJAZWFjaFwiLCBcIkBsZXRcIiwgXCJAa2V5XCIsIFwiQHJlZlwiXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIikgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzaG9ydGhhbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgcmVhbE5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZkF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkByZWZcIl0pO1xuICAgICAgaWYgKHJlZkF0dHIgJiYgIWlzVm9pZCkge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHJlZkF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KHByb3BOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB0aHJvdyBlLndpdGhUYWcobm9kZS5uYW1lKTtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5SVU5USU1FX0VSUk9SLCB7IG1lc3NhZ2U6IGUubWVzc2FnZSB8fCBgJHtlfWAgfSwgbm9kZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBrZXkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwib25cIikpIHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IGFyZy52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IGlzQ2FsbEV4cHIgPSAvXltcXHckLl1bXFx3JC5dKlxccypcXCguKlxcKVxccyokLy50ZXN0KHRyaW1tZWQpICYmICF0cmltbWVkLmluY2x1ZGVzKFwiPT5cIik7XG4gICAgICAgIGlmIChpc0NhbGxFeHByKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFtLYXNwZXJdIEA6JHtrZXl9PVwiJHthcmcudmFsdWV9XCIg4oCUIHRoZSBleHByZXNzaW9uIGlzIGNhbGxlZCBkdXJpbmcgcmVuZGVyIGFuZCBpdHMgcmV0dXJuIHZhbHVlIGlzIHBhc3NlZCBhcyB0aGUgcHJvcC4gYCArXG4gICAgICAgICAgICBgSWYgaXQgcmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0IGZ1bmN0aW9uIGJlY29tZXMgdGhlIGhhbmRsZXIgKGZhY3RvcnkgcGF0dGVybikuIGAgK1xuICAgICAgICAgICAgYElmIGl0IHJldHVybnMgdW5kZWZpbmVkLCB0aGUgcHJvcCByZWNlaXZlcyB1bmRlZmluZWQuIGAgK1xuICAgICAgICAgICAgYElmIHRoZSBmdW5jdGlvbiBoYXMgcmVhY3RpdmUgc2lkZSBlZmZlY3RzLCBlbnN1cmUgaXQgZG9lcyBub3QgYm90aCByZWFkIGFuZCB3cml0ZSB0aGUgc2FtZSBzaWduYWwuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5leGVjdXRlKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgW2V2ZW50TmFtZSwgLi4ubW9kaWZpZXJzXSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGxpc3RlbmVyU2NvcGUgPSBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbCA9IGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkgb3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSkgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcblxuICAgIC8vIEFueXRoaW5nIG5vdCBpbiB0aGlzIGxpc3QgaXMgdHJlYXRlZCBhcyBhIHBvdGVudGlhbCBrZXkgbW9kaWZpZXJcbiAgICBjb25zdCBjb250cm9sTW9kaWZpZXJzID0gW1wicHJldmVudFwiLCBcInN0b3BcIiwgXCJvbmNlXCIsIFwicGFzc2l2ZVwiLCBcImNhcHR1cmVcIiwgXCJjdHJsXCIsIFwic2hpZnRcIiwgXCJhbHRcIiwgXCJtZXRhXCJdO1xuICAgIGNvbnN0IHBvdGVudGlhbEtleU1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKG0pID0+ICFjb250cm9sTW9kaWZpZXJzLmluY2x1ZGVzKG0udG9Mb3dlckNhc2UoKSkpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgZXZlbnROYW1lLFxuICAgICAgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHBvdGVudGlhbEtleU1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlZCA9IHBvdGVudGlhbEtleU1vZGlmaWVycy5zb21lKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb3dlck0gPSBtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoS0VZX01BUFtsb3dlck1dICYmIEtFWV9NQVBbbG93ZXJNXS5pbmNsdWRlcyhldmVudC5rZXkpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb3dlck0gPT09IGV2ZW50LmtleT8udG9Mb3dlckNhc2UoKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImN0cmxcIikgJiYgIWV2ZW50LmN0cmxLZXkpIHJldHVybjtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInNoaWZ0XCIpICYmICFldmVudC5zaGlmdEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYWx0XCIpICYmICFldmVudC5hbHRLZXkpIHJldHVybjtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm1ldGFcIikgJiYgIWV2ZW50Lm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBsaXN0ZW5lclNjb3BlKTtcbiAgICAgIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xce1xcey4rXFx9XFx9L21zO1xuICAgIGlmIChyZWdleC50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZywgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucywgc291cmNlKTtcblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveU5vZGUobm9kZTogYW55KTogdm9pZCB7XG4gICAgLy8gMS4gQ2xlYW51cCBjb21wb25lbnQgaW5zdGFuY2VcbiAgICBpZiAobm9kZS4ka2FzcGVySW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbm9kZS4ka2FzcGVySW5zdGFuY2U7XG4gICAgICBpZiAoaW5zdGFuY2Uub25EZXN0cm95KSB7XG4gICAgICAgIGluc3RhbmNlLm9uRGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9XG5cbiAgICAvLyAyLiBDbGVhbnVwIGVmZmVjdHMgYXR0YWNoZWQgdG8gdGhlIG5vZGVcbiAgICBpZiAobm9kZS4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIH1cblxuICAgIC8vIDMuIENsZWFudXAgZWZmZWN0cyBvbiBhdHRyaWJ1dGVzXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gNC4gUmVjdXJzZVxuICAgIG5vZGUuY2hpbGROb2Rlcz8uZm9yRWFjaCgoY2hpbGQ6IGFueSkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koY29udGFpbmVyOiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBtb3VudENvbXBvbmVudChDb21wb25lbnRDbGFzczogQ29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95KGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IChDb21wb25lbnRDbGFzcyBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmICghdGVtcGxhdGUpIHJldHVybjtcblxuICAgIGNvbnN0IG5vZGVzID0gdGhpcy50ZW1wbGF0ZVBhcnNlci5wYXJzZSh0ZW1wbGF0ZSk7XG4gICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGhvc3QpO1xuXG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudENsYXNzKHsgYXJnczogeyBwYXJhbXM6IHBhcmFtcyB9LCByZWY6IGhvc3QsIHRyYW5zcGlsZXI6IHRoaXMgfSk7XG4gICAgdGhpcy5iaW5kTWV0aG9kcyhjb21wb25lbnQpO1xuICAgIChob3N0IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gY29tcG9uZW50O1xuXG4gICAgY29uc3QgY29tcG9uZW50Tm9kZXMgPSBub2RlcztcbiAgICBjb21wb25lbnQuJHJlbmRlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5kZXN0cm95KGhvc3QpO1xuICAgICAgICBob3N0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKG51bGwsIGNvbXBvbmVudCk7XG4gICAgICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgICAgICBjb25zdCBwcmV2ID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuXG4gICAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhjb21wb25lbnROb2RlcywgaG9zdCk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBjb21wb25lbnQpO1xuICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcblxuICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBob3N0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuXG4gICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25Nb3VudCgpO1xuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICB9XG5cbiAgcHVibGljIGV4dHJhY3RSb3V0ZXMoY2hpbGRyZW46IEtOb2RlLktOb2RlW10sIHBhcmVudEd1YXJkPzogKCkgPT4gUHJvbWlzZTxib29sZWFuPiwgc2NvcGU/OiBTY29wZSk6IFJvdXRlQ29uZmlnW10ge1xuICAgIGNvbnN0IHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuICAgIGNvbnN0IHByZXZTY29wZSA9IHNjb3BlID8gdGhpcy5pbnRlcnByZXRlci5zY29wZSA6IHVuZGVmaW5lZDtcbiAgICBpZiAoc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQudHlwZSAhPT0gXCJlbGVtZW50XCIpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgZWwgPSBjaGlsZCBhcyBLTm9kZS5FbGVtZW50O1xuICAgICAgaWYgKGVsLm5hbWUgPT09IFwicm91dGVcIikge1xuICAgICAgICBjb25zdCBwYXRoQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBwYXRoXCJdKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50QXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjb21wb25lbnRcIl0pO1xuICAgICAgICBjb25zdCBndWFyZEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZ3VhcmRcIl0pO1xuXG4gICAgICAgIGlmICghcGF0aEF0dHIgfHwgIWNvbXBvbmVudEF0dHIpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTU0lOR19SRVFVSVJFRF9BVFRSLCB7IG1lc3NhZ2U6IFwiPHJvdXRlPiByZXF1aXJlcyBAcGF0aCBhbmQgQGNvbXBvbmVudCBhdHRyaWJ1dGVzLlwiIH0sIGVsLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhBdHRyIS52YWx1ZTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5leGVjdXRlKGNvbXBvbmVudEF0dHIhLnZhbHVlKTtcbiAgICAgICAgY29uc3QgZ3VhcmQgPSBndWFyZEF0dHIgPyB0aGlzLmV4ZWN1dGUoZ3VhcmRBdHRyLnZhbHVlKSA6IHBhcmVudEd1YXJkO1xuICAgICAgICByb3V0ZXMucHVzaCh7IHBhdGg6IHBhdGgsIGNvbXBvbmVudDogY29tcG9uZW50LCBndWFyZDogZ3VhcmQgfSk7XG4gICAgICB9IGVsc2UgaWYgKGVsLm5hbWUgPT09IFwiZ3VhcmRcIikge1xuICAgICAgICBjb25zdCBjaGVja0F0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAY2hlY2tcIl0pO1xuICAgICAgICBpZiAoIWNoZWNrQXR0cikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNTSU5HX1JFUVVJUkVEX0FUVFIsIHsgbWVzc2FnZTogXCI8Z3VhcmQ+IHJlcXVpcmVzIEBjaGVjayBhdHRyaWJ1dGUuXCIgfSwgZWwubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNoZWNrQXR0cikgY29udGludWU7XG4gICAgICAgIGNvbnN0IGNoZWNrID0gdGhpcy5leGVjdXRlKGNoZWNrQXR0ci52YWx1ZSk7XG4gICAgICAgIHJvdXRlcy5wdXNoKC4uLnRoaXMuZXh0cmFjdFJvdXRlcyhlbC5jaGlsZHJlbiwgY2hlY2spKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNjb3BlKSB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgIHJldHVybiByb3V0ZXM7XG4gIH1cblxuICBwcml2YXRlIHRyaWdnZXJSZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSZW5kZXJpbmcpIHJldHVybjtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgIGlmIChpbnN0YW5jZSAmJiB0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXREb2N0eXBlS05vZGUoX25vZGU6IEtOb2RlLkRvY3R5cGUpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gICAgLy8gcmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50VHlwZShcImh0bWxcIiwgXCJcIiwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSwgdGFnTmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBmaW5hbEFyZ3MgPSBhcmdzO1xuICAgIGlmICh0eXBlb2YgYXJncyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgY29uc3QgY2xlYW5NZXNzYWdlID0gYXJncy5pbmNsdWRlcyhcIlJ1bnRpbWUgRXJyb3JcIilcbiAgICAgICAgPyBhcmdzLnJlcGxhY2UoXCJSdW50aW1lIEVycm9yOiBcIiwgXCJcIilcbiAgICAgICAgOiBhcmdzO1xuICAgICAgZmluYWxBcmdzID0geyBtZXNzYWdlOiBjbGVhbk1lc3NhZ2UgfTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgZmluYWxBcmdzLCB7IHRhZzogdGFnTmFtZSB9KTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRDbGFzcywgQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0IHsgc2V0RXJyb3JIYW5kbGVyLCBFcnJvckhhbmRsZXJGbiB9IGZyb20gXCIuL2Vycm9yLWhhbmRsZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkoXG4gIGltcG9ydGVyOiAoKSA9PiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIENvbXBvbmVudENsYXNzPj5cbik6IHsgY29tcG9uZW50OiAoKSA9PiBQcm9taXNlPENvbXBvbmVudENsYXNzPjsgbGF6eTogdHJ1ZSB9IHtcbiAgcmV0dXJuIHtcbiAgICBsYXp5OiB0cnVlLFxuICAgIGNvbXBvbmVudDogKCkgPT4gaW1wb3J0ZXIoKS50aGVuKChtKSA9PiBPYmplY3QudmFsdWVzKG0pWzBdKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgdHJ5IHtcbiAgICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShub2Rlcyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW2UgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKV0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3BpbGUoXG4gIHNvdXJjZTogc3RyaW5nLFxuICBlbnRpdHk/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LFxuICBjb250YWluZXI/OiBIVE1MRWxlbWVudCxcbiAgcmVnaXN0cnk/OiBDb21wb25lbnRSZWdpc3RyeVxuKTogTm9kZSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogcmVnaXN0cnkgfHwge30gfSk7XG4gIGNvbnN0IHJlc3VsdCA9IHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBlbnRpdHkgfHwge30sIGNvbnRhaW5lcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2FzcGVyQ29uZmlnIHtcbiAgcm9vdD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xuICBtb2RlPzogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCI7XG4gIG9uRXJyb3I/OiBFcnJvckhhbmRsZXJGbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KHRyYW5zcGlsZXI6IFRyYW5zcGlsZXIsIHRhZzogc3RyaW5nKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyAodHJhbnNwaWxlci5yZWdpc3RyeVt0YWddLmNvbXBvbmVudCBhcyBDb21wb25lbnRDbGFzcykoe1xuICAgIHJlZjogZWxlbWVudCxcbiAgICB0cmFuc3BpbGVyOiB0cmFuc3BpbGVyLFxuICAgIGFyZ3M6IHt9LFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIG5vZGU6IGVsZW1lbnQsXG4gICAgaW5zdGFuY2U6IGNvbXBvbmVudCxcbiAgICBub2RlczogdHJhbnNwaWxlci5yZXNvbHZlTm9kZXModGFnKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvb3RzdHJhcChjb25maWc6IEthc3BlckNvbmZpZykge1xuICBjb25zdCByb290ID1cbiAgICB0eXBlb2YgY29uZmlnLnJvb3QgPT09IFwic3RyaW5nXCJcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdClcbiAgICAgIDogY29uZmlnLnJvb3Q7XG5cbiAgaWYgKCFyb290KSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5ST09UX0VMRU1FTlRfTk9UX0ZPVU5ELFxuICAgICAgeyByb290OiBjb25maWcucm9vdCB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuICBpZiAoIWNvbmZpZy5yZWdpc3RyeVtlbnRyeVRhZ10pIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLkVOVFJZX0NPTVBPTkVOVF9OT1RfRk9VTkQsXG4gICAgICB7IHRhZzogZW50cnlUYWcgfVxuICAgICk7XG4gIH1cblxuICBpZiAoY29uZmlnLm9uRXJyb3IpIHtcbiAgICBzZXRFcnJvckhhbmRsZXIoY29uZmlnLm9uRXJyb3IpO1xuICB9XG5cbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IGNvbmZpZy5yZWdpc3RyeSB9KTtcblxuICBpZiAoY29uZmlnLm1vZGUpIHtcbiAgICB0cmFuc3BpbGVyLm1vZGUgPSBjb25maWcubW9kZTtcbiAgfVxuXG4gIGNvbnN0IHsgbm9kZSwgaW5zdGFuY2UsIG5vZGVzIH0gPSBjcmVhdGVDb21wb25lbnQodHJhbnNwaWxlciwgZW50cnlUYWcpO1xuXG4gIHJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgcm9vdC5hcHBlbmRDaGlsZChub2RlKTtcblxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGluc3RhbmNlLm9uTW91bnQoKTtcbiAgfVxuXG4gIHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzLCBpbnN0YW5jZSwgbm9kZSBhcyBIVE1MRWxlbWVudCk7XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cbiJdLCJuYW1lcyI6WyJyYXdFZmZlY3QiLCJyYXdDb21wdXRlZCIsIlNldCIsIlRva2VuVHlwZSIsIkV4cHIuRWFjaCIsIkV4cHIuVmFyaWFibGUiLCJFeHByLkJpbmFyeSIsIkV4cHIuQXNzaWduIiwiRXhwci5HZXQiLCJFeHByLlNldCIsIkV4cHIuUGlwZWxpbmUiLCJFeHByLlRlcm5hcnkiLCJFeHByLk51bGxDb2FsZXNjaW5nIiwiRXhwci5Mb2dpY2FsIiwiRXhwci5UeXBlb2YiLCJFeHByLlVuYXJ5IiwiRXhwci5DYWxsIiwiRXhwci5OZXciLCJFeHByLlBvc3RmaXgiLCJFeHByLlNwcmVhZCIsIkV4cHIuS2V5IiwiRXhwci5MaXRlcmFsIiwiRXhwci5UZW1wbGF0ZSIsIkV4cHIuQXJyb3dGdW5jdGlvbiIsIkV4cHIuR3JvdXBpbmciLCJFeHByLlZvaWQiLCJFeHByLkRlYnVnIiwiRXhwci5EaWN0aW9uYXJ5IiwiRXhwci5MaXN0IiwiVXRpbHMuaXNEaWdpdCIsIlV0aWxzLmlzQWxwaGFOdW1lcmljIiwiVXRpbHMuY2FwaXRhbGl6ZSIsIlV0aWxzLmlzS2V5d29yZCIsIlV0aWxzLmlzQWxwaGEiLCJQYXJzZXIiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCIsIkNvbXBvbmVudENsYXNzIiwic2NvcGUiLCJwYXJlbnQiLCJwcmV2Il0sIm1hcHBpbmdzIjoiQUFBTyxNQUFNLGFBQWE7QUFBQTtBQUFBLEVBRXhCLHdCQUF3QjtBQUFBLEVBQ3hCLDJCQUEyQjtBQUFBO0FBQUEsRUFHM0Isc0JBQXNCO0FBQUEsRUFDdEIscUJBQXFCO0FBQUEsRUFDckIsc0JBQXNCO0FBQUE7QUFBQSxFQUd0QixnQkFBZ0I7QUFBQSxFQUNoQix3QkFBd0I7QUFBQSxFQUN4QixtQkFBbUI7QUFBQSxFQUNuQiwwQkFBMEI7QUFBQSxFQUMxQixzQkFBc0I7QUFBQSxFQUN0QixzQkFBc0I7QUFBQSxFQUN0Qix1QkFBdUI7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QUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxnQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGlCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJ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
