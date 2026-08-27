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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvZXJyb3ItaGFuZGxlci50cyIsIi4uL3NyYy9zaWduYWwudHMiLCIuLi9zcmMvY29tcG9uZW50LnRzIiwiLi4vc3JjL3R5cGVzL2V4cHJlc3Npb25zLnRzIiwiLi4vc3JjL3R5cGVzL3Rva2VuLnRzIiwiLi4vc3JjL2V4cHJlc3Npb24tcGFyc2VyLnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL3NjYW5uZXIudHMiLCIuLi9zcmMvc2NvcGUudHMiLCIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiLCIuLi9zcmMvdHlwZXMvbm9kZXMudHMiLCIuLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwiLi4vc3JjL3JvdXRlci50cyIsIi4uL3NyYy9ib3VuZGFyeS50cyIsIi4uL3NyYy9zY2hlZHVsZXIudHMiLCIuLi9zcmMvdHJhbnNwaWxlci50cyIsIi4uL3NyYy9rYXNwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEtFcnJvckNvZGUgPSB7XG4gIC8vIEJvb3RzdHJhcFxuICBST09UX0VMRU1FTlRfTk9UX0ZPVU5EOiBcIkswMDEtMVwiLFxuICBFTlRSWV9DT01QT05FTlRfTk9UX0ZPVU5EOiBcIkswMDEtMlwiLFxuXG4gIC8vIFNjYW5uZXJcbiAgVU5URVJNSU5BVEVEX0NPTU1FTlQ6IFwiSzAwMi0xXCIsXG4gIFVOVEVSTUlOQVRFRF9TVFJJTkc6IFwiSzAwMi0yXCIsXG4gIFVORVhQRUNURURfQ0hBUkFDVEVSOiBcIkswMDItM1wiLFxuXG4gIC8vIFRlbXBsYXRlIFBhcnNlclxuICBVTkVYUEVDVEVEX0VPRjogXCJLMDAzLTFcIixcbiAgVU5FWFBFQ1RFRF9DTE9TSU5HX1RBRzogXCJLMDAzLTJcIixcbiAgRVhQRUNURURfVEFHX05BTUU6IFwiSzAwMy0zXCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVDogXCJLMDAzLTRcIixcbiAgRVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy01XCIsXG4gIEJMQU5LX0FUVFJJQlVURV9OQU1FOiBcIkswMDMtNlwiLFxuICBNSVNQTEFDRURfQ09ORElUSU9OQUw6IFwiSzAwMy03XCIsXG4gIERVUExJQ0FURV9JRjogXCJLMDAzLThcIixcbiAgTVVMVElQTEVfU1RSVUNUVVJBTF9ESVJFQ1RJVkVTOiBcIkswMDMtOVwiLFxuXG4gIC8vIEV4cHJlc3Npb24gUGFyc2VyXG4gIFVORVhQRUNURURfVE9LRU46IFwiSzAwNC0xXCIsXG4gIElOVkFMSURfTFZBTFVFOiBcIkswMDQtMlwiLFxuICBFWFBFQ1RFRF9FWFBSRVNTSU9OOiBcIkswMDQtM1wiLFxuICBJTlZBTElEX0RJQ1RJT05BUllfS0VZOiBcIkswMDQtNFwiLFxuXG4gIC8vIEludGVycHJldGVyXG4gIElOVkFMSURfUE9TVEZJWF9MVkFMVUU6IFwiSzAwNS0xXCIsXG4gIFVOS05PV05fQklOQVJZX09QRVJBVE9SOiBcIkswMDUtMlwiLFxuICBJTlZBTElEX1BSRUZJWF9SVkFMVUU6IFwiSzAwNS0zXCIsXG4gIFVOS05PV05fVU5BUllfT1BFUkFUT1I6IFwiSzAwNS00XCIsXG4gIE5PVF9BX0ZVTkNUSU9OOiBcIkswMDUtNVwiLFxuICBOT1RfQV9DTEFTUzogXCJLMDA1LTZcIixcblxuICAvLyBTaWduYWxzXG4gIENJUkNVTEFSX0NPTVBVVEVEOiBcIkswMDYtMVwiLFxuXG4gIC8vIFRyYW5zcGlsZXJcbiAgUlVOVElNRV9FUlJPUjogXCJLMDA3LTFcIixcbiAgTUlTU0lOR19SRVFVSVJFRF9BVFRSOiBcIkswMDctMlwiLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgS0Vycm9yQ29kZVR5cGUgPSAodHlwZW9mIEtFcnJvckNvZGUpW2tleW9mIHR5cGVvZiBLRXJyb3JDb2RlXTtcblxuZXhwb3J0IGNvbnN0IEVycm9yVGVtcGxhdGVzOiBSZWNvcmQ8c3RyaW5nLCAoYXJnczogYW55KSA9PiBzdHJpbmc+ID0ge1xuICBcIkswMDEtMVwiOiAoYSkgPT4gYFJvb3QgZWxlbWVudCBub3QgZm91bmQ6ICR7YS5yb290fWAsXG4gIFwiSzAwMS0yXCI6IChhKSA9PiBgRW50cnkgY29tcG9uZW50IDwke2EudGFnfT4gbm90IGZvdW5kIGluIHJlZ2lzdHJ5LmAsXG4gIFxuICBcIkswMDItMVwiOiAoKSA9PiAnVW50ZXJtaW5hdGVkIGNvbW1lbnQsIGV4cGVjdGluZyBjbG9zaW5nIFwiKi9cIicsXG4gIFwiSzAwMi0yXCI6IChhKSA9PiBgVW50ZXJtaW5hdGVkIHN0cmluZywgZXhwZWN0aW5nIGNsb3NpbmcgJHthLnF1b3RlfWAsXG4gIFwiSzAwMi0zXCI6IChhKSA9PiBgVW5leHBlY3RlZCBjaGFyYWN0ZXIgJyR7YS5jaGFyfSdgLFxuXG4gIFwiSzAwMy0xXCI6IChhKSA9PiBgVW5leHBlY3RlZCBlbmQgb2YgZmlsZS4gJHthLmVvZkVycm9yfWAsXG4gIFwiSzAwMy0yXCI6ICgpID0+IFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiLFxuICBcIkswMDMtM1wiOiAoKSA9PiBcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIixcbiAgXCJLMDAzLTRcIjogKCkgPT4gXCJFeHBlY3RlZCBjbG9zaW5nIHRhZyA+XCIsXG4gIFwiSzAwMy01XCI6IChhKSA9PiBgRXhwZWN0ZWQgPC8ke2EubmFtZX0+YCxcbiAgXCJLMDAzLTZcIjogKCkgPT4gXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiLFxuICBcIkswMDMtN1wiOiAoYSkgPT4gYEAke2EubmFtZX0gbXVzdCBiZSBwcmVjZWRlZCBieSBhbiBAaWYgb3IgQGVsc2VpZiBibG9jay5gLFxuICBcIkswMDMtOFwiOiAoKSA9PiBcIk11bHRpcGxlIGNvbmRpdGlvbmFsIGRpcmVjdGl2ZXMgKEBpZiwgQGVsc2VpZiwgQGVsc2UpIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXJlIG5vdCBhbGxvd2VkLlwiLFxuICBcIkswMDMtOVwiOiAoKSA9PiBcIk11bHRpcGxlIHN0cnVjdHVyYWwgZGlyZWN0aXZlcyAoQGlmLCBAZWFjaCkgb24gdGhlIHNhbWUgZWxlbWVudCBhcmUgbm90IGFsbG93ZWQuIE5lc3QgdGhlbSBvciB1c2UgPHZvaWQ+IGluc3RlYWQuXCIsXG5cbiAgXCJLMDA0LTFcIjogKGEpID0+IGAke2EubWVzc2FnZX0sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtMlwiOiAoKSA9PiBcIkludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuXCIsXG4gIFwiSzAwNC0zXCI6IChhKSA9PiBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7YS50b2tlbn1cImAsXG4gIFwiSzAwNC00XCI6IChhKSA9PiBgU3RyaW5nLCBOdW1iZXIgb3IgSWRlbnRpZmllciBleHBlY3RlZCBhcyBhIEtleSBvZiBEaWN0aW9uYXJ5IHssIHVuZXhwZWN0ZWQgdG9rZW4gJHthLnRva2VufWAsXG5cbiAgXCJLMDA1LTFcIjogKGEpID0+IGBJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIHBvc3RmaXggb3BlcmF0aW9uOiAke2EuZW50aXR5fWAsXG4gIFwiSzAwNS0yXCI6IChhKSA9PiBgVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgJHthLm9wZXJhdG9yfWAsXG4gIFwiSzAwNS0zXCI6IChhKSA9PiBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAke2EucmlnaHR9YCxcbiAgXCJLMDA1LTRcIjogKGEpID0+IGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtNVwiOiAoYSkgPT4gYCR7YS5jYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCxcbiAgXCJLMDA1LTZcIjogKGEpID0+IGAnJHthLmNsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmAsXG5cbiAgXCJLMDA2LTFcIjogKCkgPT4gXCJDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIGluIGNvbXB1dGVkIHNpZ25hbFwiLFxuXG4gIFwiSzAwNy0xXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG4gIFwiSzAwNy0yXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG59O1xuXG5mdW5jdGlvbiBjb2RlU25pcHBldChzb3VyY2U6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlciwgY29udGV4dCA9IDIpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdChcIlxcblwiKTtcbiAgY29uc3QgZXJyb3JMaW5lID0gbGluZSAtIDE7XG4gIGNvbnN0IHN0YXJ0ID0gTWF0aC5tYXgoMCwgZXJyb3JMaW5lIC0gY29udGV4dCk7XG4gIGNvbnN0IGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCAtIDEsIGVycm9yTGluZSArIGNvbnRleHQpO1xuXG4gIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXCJcIl07XG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgIGNvbnN0IGluZGljYXRvciA9IGkgPT09IGVycm9yTGluZSA/IFwiPlwiIDogXCIgXCI7XG4gICAgcmVzdWx0LnB1c2goYCAgJHtpbmRpY2F0b3J9IHwgJHtsaW5lc1tpXX1gKTtcbiAgICBpZiAoaSA9PT0gZXJyb3JMaW5lICYmIGNvbCA+IDApIHtcbiAgICAgIGNvbnN0IHBvaW50ZXIgPSBcIiBcIi5yZXBlYXQoNiArIGNvbCAtIDEpICsgXCJeXCI7XG4gICAgICByZXN1bHQucHVzaChwb2ludGVyKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKFwiXFxuXCIpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEthc3BlckVycm9yT3B0aW9ucyB7XG4gIGxpbmU/OiBudW1iZXI7XG4gIGNvbD86IG51bWJlcjtcbiAgdGFnPzogc3RyaW5nO1xuICBzb3VyY2U/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcHVibGljIGxpbmU/OiBudW1iZXI7XG4gIHB1YmxpYyBjb2w/OiBudW1iZXI7XG4gIHB1YmxpYyB0YWdOYW1lPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb2RlOiBLRXJyb3JDb2RlVHlwZSxcbiAgICBwdWJsaWMgYXJnczogYW55ID0ge30sXG4gICAgb3B0aW9uczogS2FzcGVyRXJyb3JPcHRpb25zID0ge31cbiAgKSB7XG4gICAgY29uc3QgeyBsaW5lLCBjb2wsIHRhZywgc291cmNlIH0gPSBvcHRpb25zO1xuXG4gICAgY29uc3QgaXNEZXYgPVxuICAgICAgdHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCJcbiAgICAgICAgOiAoaW1wb3J0Lm1ldGEgYXMgYW55KS5lbnY/Lk1PREUgIT09IFwicHJvZHVjdGlvblwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBFcnJvclRlbXBsYXRlc1tjb2RlXTtcbiAgICBjb25zdCBtZXNzYWdlID0gdGVtcGxhdGVcbiAgICAgID8gdGVtcGxhdGUoYXJncylcbiAgICAgIDogKHR5cGVvZiBhcmdzID09PSAnc3RyaW5nJyA/IGFyZ3MgOiBcIlVua25vd24gZXJyb3JcIik7XG5cbiAgICBjb25zdCB0YWdJbmZvID0gdGFnID8gYFxcbiAgYXQgPCR7dGFnfT5gIDogXCJcIjtcbiAgICBjb25zdCBzbmlwcGV0ID0gbGluZSAhPT0gdW5kZWZpbmVkICYmIHNvdXJjZSA/IGNvZGVTbmlwcGV0KHNvdXJjZSwgbGluZSwgY29sID8/IDApIDogXCJcIjtcbiAgICBjb25zdCBsaW5rID0gaXNEZXZcbiAgICAgID8gYFxcblxcblNlZTogaHR0cHM6Ly9rYXNwZXJqcy50b3AvcmVmZXJlbmNlL2Vycm9ycyMke2NvZGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKX1cXG5gXG4gICAgICA6IFwiXCI7XG5cbiAgICBzdXBlcihgWyR7Y29kZX1dICR7bWVzc2FnZX0ke3RhZ0luZm99JHtzbmlwcGV0fSR7bGlua31gKTtcbiAgICB0aGlzLm5hbWUgPSBcIkthc3BlckVycm9yXCI7XG4gICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgICB0aGlzLnRhZ05hbWUgPSB0YWc7XG4gIH1cblxuICBwdWJsaWMgd2l0aFRhZyh0YWdOYW1lOiBzdHJpbmcpOiB0aGlzIHtcbiAgICBpZiAoIXRoaXMudGFnTmFtZSkge1xuICAgICAgdGhpcy50YWdOYW1lID0gdGFnTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSArPSBgXFxuICBhdCA8JHt0YWdOYW1lfT5gO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiZXhwb3J0IHR5cGUgRXJyb3JQaGFzZSA9ICdyZW5kZXInIHwgJ3dhdGNoZXInO1xuXG5leHBvcnQgdHlwZSBFcnJvckhhbmRsZXJGbiA9IChcbiAgZXJyb3I6IEVycm9yLFxuICBjb250ZXh0OiB7IGNvbXBvbmVudD86IGFueTsgcGhhc2U6IEVycm9yUGhhc2UgfVxuKSA9PiB2b2lkO1xuXG5sZXQgZ2xvYmFsSGFuZGxlcjogRXJyb3JIYW5kbGVyRm4gfCBudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEVycm9ySGFuZGxlcihoYW5kbGVyOiBFcnJvckhhbmRsZXJGbiB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICBnbG9iYWxIYW5kbGVyID0gaGFuZGxlciA/PyBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3I6IHVua25vd24sIHBoYXNlOiBFcnJvclBoYXNlLCBjb21wb25lbnQ/OiBhbnkpOiB2b2lkIHtcbiAgY29uc3QgZXJyID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yIDogbmV3IEVycm9yKFN0cmluZyhlcnJvcikpO1xuXG4gIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC5vbkVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbXBvbmVudC5vbkVycm9yKGVyciwgcGhhc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIG9uRXJyb3IgaXRzZWxmIHRocmV3LCBmYWxsIHRocm91Z2ggd2l0aCBvcmlnaW5hbCBlcnJvclxuICAgIH1cbiAgfVxuXG4gIGlmIChnbG9iYWxIYW5kbGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGdsb2JhbEhhbmRsZXIoZXJyLCB7IGNvbXBvbmVudCwgcGhhc2UgfSk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoXykge31cbiAgfVxuXG4gIGNvbnNvbGUuZXJyb3IoYFtLYXNwZXJdIEVycm9yIGR1cmluZyAke3BoYXNlfTpgLCBlcnIpO1xufVxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tIFwiLi9lcnJvci1oYW5kbGVyXCI7XG5cbnR5cGUgTGlzdGVuZXIgPSAoKSA9PiB2b2lkO1xuXG5sZXQgYWN0aXZlRWZmZWN0OiB7IGZuOiBMaXN0ZW5lcjsgZGVwczogU2V0PGFueT4gfSB8IG51bGwgPSBudWxsO1xuY29uc3QgZWZmZWN0U3RhY2s6IGFueVtdID0gW107XG5cbmxldCBiYXRjaGluZyA9IGZhbHNlO1xuY29uc3QgcGVuZGluZ1N1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbmNvbnN0IHBlbmRpbmdXYXRjaGVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBTaWduYWxPcHRpb25zIHtcbiAgc2lnbmFsPzogQWJvcnRTaWduYWw7XG59XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcm90ZWN0ZWQgX3ZhbHVlOiBUO1xuICBwcml2YXRlIHN1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbiAgcHJpdmF0ZSB3YXRjaGVycyA9IG5ldyBTZXQ8V2F0Y2hlcjxUPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWU6IFQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzLmFkZChhY3RpdmVFZmZlY3QuZm4pO1xuICAgICAgYWN0aXZlRWZmZWN0LmRlcHMuYWRkKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGlmIChiYXRjaGluZykge1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmliZXJzKSBwZW5kaW5nU3Vic2NyaWJlcnMuYWRkKHN1Yik7XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSBwZW5kaW5nV2F0Y2hlcnMucHVzaCgoKSA9PiB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycyk7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgICAgICBzdWIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykge1xuICAgICAgICAgIHRyeSB7IHdhdGNoZXIobmV3VmFsdWUsIG9sZFZhbHVlKTsgfSBjYXRjaCAoZSkgeyBoYW5kbGVFcnJvcihlLCAnd2F0Y2hlcicpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZShmbjogV2F0Y2hlcjxUPiwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpOiAoKSA9PiB2b2lkIHtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsPy5hYm9ydGVkKSByZXR1cm4gKCkgPT4ge307XG4gICAgdGhpcy53YXRjaGVycy5hZGQoZm4pO1xuICAgIGNvbnN0IHN0b3AgPSAoKSA9PiB0aGlzLndhdGNoZXJzLmRlbGV0ZShmbik7XG4gICAgaWYgKG9wdGlvbnM/LnNpZ25hbCkge1xuICAgICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0b3A7XG4gIH1cblxuICB1bnN1YnNjcmliZShmbjogTGlzdGVuZXIpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmRlbGV0ZShmbik7XG4gIH1cblxuICB0b1N0cmluZygpIHsgcmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKTsgfVxuICBwZWVrKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbn1cblxuY2xhc3MgQ29tcHV0ZWRTaWduYWw8VD4gZXh0ZW5kcyBTaWduYWw8VD4ge1xuICBwcml2YXRlIGZuOiAoKSA9PiBUO1xuICBwcml2YXRlIGNvbXB1dGluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGZuOiAoKSA9PiBULCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucykge1xuICAgIHN1cGVyKHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHRoaXMuZm4gPSBmbjtcblxuICAgIGNvbnN0IHN0b3AgPSBlZmZlY3QoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29tcHV0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihLRXJyb3JDb2RlLkNJUkNVTEFSX0NPTVBVVEVEKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wdXRpbmcgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gRWFnZXJseSB1cGRhdGUgdGhlIHZhbHVlIHNvIHN1YnNjcmliZXJzIGFyZSBub3RpZmllZCBpbW1lZGlhdGVseVxuICAgICAgICBzdXBlci52YWx1ZSA9IHRoaXMuZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuY29tcHV0aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICByZXR1cm4gc3VwZXIudmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUoX3Y6IFQpIHtcbiAgICAvLyBDb21wdXRlZCBzaWduYWxzIGFyZSByZWFkLW9ubHkgZnJvbSBvdXRzaWRlXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVmZmVjdChmbjogTGlzdGVuZXIsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgY29uc3QgZWZmZWN0T2JqID0ge1xuICAgIGZuOiAoKSA9PiB7XG4gICAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuXG4gICAgICBlZmZlY3RTdGFjay5wdXNoKGVmZmVjdE9iaik7XG4gICAgICBhY3RpdmVFZmZlY3QgPSBlZmZlY3RPYmo7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdFN0YWNrW2VmZmVjdFN0YWNrLmxlbmd0aCAtIDFdIHx8IG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZXBzOiBuZXcgU2V0PFNpZ25hbDxhbnk+PigpXG4gIH07XG5cbiAgZWZmZWN0T2JqLmZuKCk7XG4gIGNvbnN0IHN0b3A6IGFueSA9ICgpID0+IHtcbiAgICBlZmZlY3RPYmouZGVwcy5mb3JFYWNoKHNpZyA9PiBzaWcudW5zdWJzY3JpYmUoZWZmZWN0T2JqLmZuKSk7XG4gICAgZWZmZWN0T2JqLmRlcHMuY2xlYXIoKTtcbiAgfTtcbiAgc3RvcC5ydW4gPSBlZmZlY3RPYmouZm47XG5cbiAgaWYgKG9wdGlvbnM/LnNpZ25hbCkge1xuICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gIH1cblxuICByZXR1cm4gc3RvcCBhcyAoKCkgPT4gdm9pZCkgJiB7IHJ1bjogKCkgPT4gdm9pZCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbmFsPFQ+KGluaXRpYWxWYWx1ZTogVCk6IFNpZ25hbDxUPiB7XG4gIHJldHVybiBuZXcgU2lnbmFsKGluaXRpYWxWYWx1ZSk7XG59XG5cbi8qKlxuICogRnVuY3Rpb25hbCBhbGlhcyBmb3IgU2lnbmFsLm9uQ2hhbmdlKClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhdGNoPFQ+KHNpZzogU2lnbmFsPFQ+LCBmbjogV2F0Y2hlcjxUPiwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpOiAoKSA9PiB2b2lkIHtcbiAgcmV0dXJuIHNpZy5vbkNoYW5nZShmbiwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXRjaChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBiYXRjaGluZyA9IHRydWU7XG4gIHRyeSB7XG4gICAgZm4oKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBiYXRjaGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IHN1YnMgPSBBcnJheS5mcm9tKHBlbmRpbmdTdWJzY3JpYmVycyk7XG4gICAgcGVuZGluZ1N1YnNjcmliZXJzLmNsZWFyKCk7XG4gICAgY29uc3Qgd2F0Y2hlcnMgPSBwZW5kaW5nV2F0Y2hlcnMuc3BsaWNlKDApO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgIHN1YigpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2Ygd2F0Y2hlcnMpIHtcbiAgICAgIHRyeSB7IHdhdGNoZXIoKTsgfSBjYXRjaCAoZSkgeyBoYW5kbGVFcnJvcihlLCAnd2F0Y2hlcicpOyB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlZDxUPihmbjogKCkgPT4gVCwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpOiBTaWduYWw8VD4ge1xuICByZXR1cm4gbmV3IENvbXB1dGVkU2lnbmFsKGZuLCBvcHRpb25zKTtcbn1cbiIsImltcG9ydCB7IFNpZ25hbCwgZWZmZWN0IGFzIHJhd0VmZmVjdCwgY29tcHV0ZWQgYXMgcmF3Q29tcHV0ZWQgfSBmcm9tIFwiLi9zaWduYWxcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLTm9kZSB9IGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbnR5cGUgV2F0Y2hlcjxUPiA9IChuZXdWYWx1ZTogVCwgb2xkVmFsdWU6IFQpID0+IHZvaWQ7XG5cbmludGVyZmFjZSBDb21wb25lbnRBcmdzPFRBcmdzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIGFueT4+IHtcbiAgYXJnczogVEFyZ3M7XG4gIHJlZj86IE5vZGU7XG4gIHRyYW5zcGlsZXI/OiBUcmFuc3BpbGVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PFRBcmdzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiA9IFJlY29yZDxzdHJpbmcsIGFueT4+IHtcbiAgc3RhdGljIHRlbXBsYXRlPzogc3RyaW5nO1xuICBhcmdzOiBUQXJncyA9IHt9IGFzIFRBcmdzO1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbiAgJGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgJHJlbmRlcj86ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBDb21wb25lbnRBcmdzPFRBcmdzPikge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgIHRoaXMuYXJncyA9IHt9IGFzIFRBcmdzO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocHJvcHMuYXJncykge1xuICAgICAgdGhpcy5hcmdzID0gcHJvcHMuYXJncztcbiAgICB9XG4gICAgaWYgKHByb3BzLnJlZikge1xuICAgICAgdGhpcy5yZWYgPSBwcm9wcy5yZWY7XG4gICAgfVxuICAgIGlmIChwcm9wcy50cmFuc3BpbGVyKSB7XG4gICAgICB0aGlzLnRyYW5zcGlsZXIgPSBwcm9wcy50cmFuc3BpbGVyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcmVhY3RpdmUgZWZmZWN0IHRpZWQgdG8gdGhlIGNvbXBvbmVudCdzIGxpZmVjeWNsZS5cbiAgICogUnVucyBpbW1lZGlhdGVseSBhbmQgcmUtcnVucyB3aGVuIGFueSBzaWduYWwgZGVwZW5kZW5jeSBjaGFuZ2VzLlxuICAgKi9cbiAgZWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgcmF3RWZmZWN0KGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaGVzIGEgc3BlY2lmaWMgc2lnbmFsIGZvciBjaGFuZ2VzLlxuICAgKiBEb2VzIE5PVCBydW4gaW1tZWRpYXRlbHkuXG4gICAqL1xuICB3YXRjaDxUPihzaWc6IFNpZ25hbDxUPiwgZm46IFdhdGNoZXI8VD4pOiB2b2lkIHtcbiAgICBzaWcub25DaGFuZ2UoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjb21wdXRlZCBzaWduYWwgdGllZCB0byB0aGUgY29tcG9uZW50J3MgbGlmZWN5Y2xlLlxuICAgKiBUaGUgaW50ZXJuYWwgZWZmZWN0IGlzIGF1dG9tYXRpY2FsbHkgY2xlYW5lZCB1cCB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgKi9cbiAgY29tcHV0ZWQ8VD4oZm46ICgpID0+IFQpOiBTaWduYWw8VD4ge1xuICAgIHJldHVybiByYXdDb21wdXRlZChmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICBvbk1vdW50KCkgeyB9XG4gIG9uUmVuZGVyKCkgeyB9XG4gIG9uQ2hhbmdlcygpIHsgfVxuICBvbkRlc3Ryb3koKSB7IH1cbiAgb25FcnJvcj8oZXJyb3I6IEVycm9yLCBwaGFzZTogc3RyaW5nKTogdm9pZDtcblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy4kcmVuZGVyPy4oKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBLYXNwZXJFbnRpdHkgPSBDb21wb25lbnQgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50Q2xhc3MgPSB7IG5ldyhhcmdzPzogQ29tcG9uZW50QXJnczxhbnk+KTogQ29tcG9uZW50IH07XG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFJlZ2lzdHJ5IHtcbiAgW3RhZ05hbWU6IHN0cmluZ106IHtcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzIHwgKCgpID0+IFByb21pc2U8Q29tcG9uZW50Q2xhc3M+KTtcbiAgICBub2Rlcz86IEtOb2RlW107XG4gICAgbGF6eT86IGJvb2xlYW47XG4gICAgZmFsbGJhY2s/OiBDb21wb25lbnRDbGFzcztcbiAgfTtcbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBBcnJvd0Z1bmN0aW9uKTogUjtcbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcjogQXNzaWduKTogUjtcbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcjogQmluYXJ5KTogUjtcbiAgICB2aXNpdENhbGxFeHByKGV4cHI6IENhbGwpOiBSO1xuICAgIHZpc2l0RGVidWdFeHByKGV4cHI6IERlYnVnKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IFBpcGVsaW5lKTogUjtcbiAgICB2aXNpdFNwcmVhZEV4cHIoZXhwcjogU3ByZWFkKTogUjtcbiAgICB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBUZW1wbGF0ZSk6IFI7XG4gICAgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBUZXJuYXJ5KTogUjtcbiAgICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mKTogUjtcbiAgICB2aXNpdFVuYXJ5RXhwcihleHByOiBVbmFyeSk6IFI7XG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogVmFyaWFibGUpOiBSO1xuICAgIHZpc2l0Vm9pZEV4cHIoZXhwcjogVm9pZCk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJvd0Z1bmN0aW9uIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHBhcmFtczogVG9rZW5bXTtcbiAgICBwdWJsaWMgYm9keTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogVG9rZW5bXSwgYm9keTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFycm93RnVuY3Rpb25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXJyb3dGdW5jdGlvbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzaWduRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFzc2lnbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5CaW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNhbGxlZTogRXhwcjtcbiAgICBwdWJsaWMgcGFyZW46IFRva2VuO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG4gICAgcHVibGljIG9wdGlvbmFsOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyLCBvcHRpb25hbCA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBvcHRpb25hbDtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkNhbGwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERlYnVnRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRlYnVnJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsYXp6ID0gY2xheno7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmV3RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk5ldyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxDb2FsZXNjaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbENvYWxlc2NpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTnVsbENvYWxlc2NpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0Zml4IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMgaW5jcmVtZW50OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGluY3JlbWVudDogbnVtYmVyLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBvc3RmaXhFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUG9zdGZpeCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQaXBlbGluZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5QaXBlbGluZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwcmVhZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNwcmVhZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TcHJlYWQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVm9pZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZvaWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVm9pZCc7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAvLyBQYXJzZXIgVG9rZW5zXHJcbiAgRW9mLFxyXG4gIFBhbmljLFxyXG5cclxuICAvLyBTaW5nbGUgQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFtcGVyc2FuZCxcclxuICBBdFNpZ24sXHJcbiAgQ2FyZXQsXHJcbiAgQ29tbWEsXHJcbiAgRG9sbGFyLFxyXG4gIERvdCxcclxuICBIYXNoLFxyXG4gIExlZnRCcmFjZSxcclxuICBMZWZ0QnJhY2tldCxcclxuICBMZWZ0UGFyZW4sXHJcbiAgUGVyY2VudCxcclxuICBQaXBlLFxyXG4gIFJpZ2h0QnJhY2UsXHJcbiAgUmlnaHRCcmFja2V0LFxyXG4gIFJpZ2h0UGFyZW4sXHJcbiAgU2VtaWNvbG9uLFxyXG4gIFNsYXNoLFxyXG4gIFN0YXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFycm93LFxyXG4gIEJhbmcsXHJcbiAgQmFuZ0VxdWFsLFxyXG4gIEJhbmdFcXVhbEVxdWFsLFxyXG4gIENvbG9uLFxyXG4gIEVxdWFsLFxyXG4gIEVxdWFsRXF1YWwsXHJcbiAgRXF1YWxFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnMgKGJpdHdpc2Ugc2hpZnRzKVxyXG4gIExlZnRTaGlmdCxcclxuICBSaWdodFNoaWZ0LFxyXG4gIFBpcGVsaW5lLFxyXG4gIFRpbGRlLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBEZWJ1ZyxcclxuICBGYWxzZSxcclxuICBJbixcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBWb2lkLFxyXG4gIFdpdGgsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbiB7XHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xyXG4gIHB1YmxpYyBsaXRlcmFsOiBhbnk7XHJcbiAgcHVibGljIGxleGVtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHR5cGU6IFRva2VuVHlwZSxcclxuICAgIGxleGVtZTogc3RyaW5nLFxyXG4gICAgbGl0ZXJhbDogYW55LFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sOiBudW1iZXJcclxuICApIHtcclxuICAgIHRoaXMubmFtZSA9IFRva2VuVHlwZVt0eXBlXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxleGVtZSA9IGxleGVtZTtcclxuICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gYFsoJHt0aGlzLmxpbmV9KTpcIiR7dGhpcy5sZXhlbWV9XCJdYDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiIsImltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW107XG4gIHByaXZhdGUgc291cmNlOiBzdHJpbmc7XG5cbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSwgc291cmNlID0gXCJcIik6IEV4cHIuRXhwcltdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgZXhwcmVzc2lvbnMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBUb2tlbiB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XG4gIH1cblxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09PSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvcihcbiAgICAgIEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9UT0tFTixcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgeyBtZXNzYWdlOiBtZXNzYWdlLCB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgdG9rZW46IFRva2VuLCBhcmdzOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHsgbGluZTogdG9rZW4ubGluZSwgY29sOiB0b2tlbi5jb2wsIHNvdXJjZTogdGhpcy5zb3VyY2UgfSk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5TZW1pY29sb24pIHx8IHRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9IHdoaWxlICghdGhpcy5lb2YoKSk7XG4gIH1cblxuICBwdWJsaWMgZm9yZWFjaCh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHIge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgICBjb25zdCBuYW1lID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxuICAgICk7XG5cbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLldpdGgpKSB7XG4gICAgICBrZXkgPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgICBgRXhwZWN0ZWQgYSBcImtleVwiIGlkZW50aWZpZXIgYWZ0ZXIgXCJ3aXRoXCIga2V5d29yZCBpbiBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLk9mLFxuICAgICAgYEV4cGVjdGVkIFwib2ZcIiBrZXl3b3JkIGluc2lkZSBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICApO1xuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRWFjaChuYW1lLCBrZXksIGl0ZXJhYmxlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHByZXNzaW9uKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHtcbiAgICAgIC8vIGNvbnN1bWUgYWxsIHNlbWljb2xvbnNcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHsgLyogY29uc3VtZSBzZW1pY29sb25zICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIGFzc2lnbm1lbnQoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnBpcGVsaW5lKCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuSU5WQUxJRF9MVkFMVUUsIG9wZXJhdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHBpcGVsaW5lKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGlwZWxpbmUpKSB7XG4gICAgICBjb25zdCByaWdodCA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLlBpcGVsaW5lKGV4cHIsIHJpZ2h0LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5Db2xvbiwgYEV4cGVjdGVkIFwiOlwiIGFmdGVyIHRlcm5hcnkgPyBleHByZXNzaW9uYCk7XG4gICAgICBjb25zdCBlbHNlRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBudWxsQ29hbGVzY2luZygpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgcmlnaHRFeHByOiBFeHByLkV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbE9yKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuT3IpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5BbmQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGVxdWFsaXR5KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICB3aGlsZSAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5JbnN0YW5jZW9mLFxuICAgICAgICBUb2tlblR5cGUuSW4sXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgc2hpZnQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0U2hpZnQsIFRva2VuVHlwZS5SaWdodFNoaWZ0KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51cywgVG9rZW5UeXBlLlBsdXMpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtb2R1bHVzKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aXBsaWNhdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TbGFzaCwgVG9rZW5UeXBlLlN0YXIpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UeXBlb2YpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UeXBlb2YodmFsdWUsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgIFRva2VuVHlwZS5UaWxkZSxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5jYWxsKCk7XG4gICAgICBpZiAoY29uc3RydWN0IGluc3RhbmNlb2YgRXhwci5DYWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LmNhbGxlZSwgY29uc3RydWN0LmFyZ3MsIGtleXdvcmQubGluZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwgW10sIGtleXdvcmQubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBvc3RmaXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zdGZpeCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAxLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIC0xLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcbiAgICBsZXQgY29uc3VtZWQ6IGJvb2xlYW47XG4gICAgZG8ge1xuICAgICAgY29uc3VtZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCBmYWxzZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2tlbkF0KG9mZnNldDogbnVtYmVyKTogVG9rZW5UeXBlIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50ICsgb2Zmc2V0XT8udHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNBcnJvd1BhcmFtcygpOiBib29sZWFuIHtcbiAgICBsZXQgaSA9IHRoaXMuY3VycmVudCArIDE7IC8vIHNraXAgKFxuICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICB9XG4gICAgd2hpbGUgKGkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLklkZW50aWZpZXIpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuQ29tbWEpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5pc2hDYWxsKGNhbGxlZTogRXhwci5FeHByLCBwYXJlbjogVG9rZW4sIG9wdGlvbmFsOiBib29sZWFuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBhcmdzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgICBhcmdzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgfVxuICAgIGNvbnN0IGNsb3NlUGFyZW4gPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuQ2FsbChjYWxsZWUsIGNsb3NlUGFyZW4sIGFyZ3MsIGNsb3NlUGFyZW4ubGluZSwgb3B0aW9uYWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuSWRlbnRpZmllcikgJiYgdGhpcy50b2tlbkF0KDEpID09PSBUb2tlblR5cGUuQXJyb3cpIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSA9PlxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24oW3BhcmFtXSwgYm9keSwgcGFyYW0ubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZShpZGVudGlmaWVyLCBpZGVudGlmaWVyLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuTGVmdFBhcmVuKSAmJiB0aGlzLmlzQXJyb3dQYXJhbXMoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgKFxuICAgICAgY29uc3QgcGFyYW1zOiBUb2tlbltdID0gW107XG4gICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBwYXJhbXMucHVzaCh0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklkZW50aWZpZXIsIFwiRXhwZWN0ZWQgcGFyYW1ldGVyIG5hbWVcIikpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCJgKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQXJyb3csIGBFeHBlY3RlZCBcIj0+XCJgKTtcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKHBhcmFtcywgYm9keSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZvaWQoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRGVidWcpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcbiAgICAgIEtFcnJvckNvZGUuRVhQRUNURURfRVhQUkVTU0lPTixcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgeyB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICApO1xuICAgIC8vIHVucmVhY2hlYWJsZSBjb2RlXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgMCk7XG4gIH1cblxuICBwdWJsaWMgZGljdGlvbmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZywgVG9rZW5UeXBlLklkZW50aWZpZXIsIFRva2VuVHlwZS5OdW1iZXIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qga2V5OiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbG9uKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgRXhwci5WYXJpYWJsZShrZXksIGtleS5saW5lKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICBLRXJyb3JDb2RlLklOVkFMSURfRElDVElPTkFSWV9LRVksXG4gICAgICAgICAgdGhpcy5wZWVrKCksXG4gICAgICAgICAgeyB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgdmFsdWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFNjYW5uZXIge1xuICAvKiogc2NyaXB0cyBzb3VyY2UgY29kZSAqL1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIC8qKiBjb250YWlucyB0aGUgc291cmNlIGNvZGUgcmVwcmVzZW50ZWQgYXMgbGlzdCBvZiB0b2tlbnMgKi9cbiAgcHVibGljIHRva2VuczogVG9rZW5bXTtcbiAgLyoqIHBvaW50cyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICAvKiogcG9pbnRzIHRvIHRoZSBzdGFydCBvZiB0aGUgdG9rZW4gICovXG4gIHByaXZhdGUgc3RhcnQ6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgbGluZSBvZiBzb3VyY2UgY29kZSBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGNvbHVtbiBvZiB0aGUgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGNvbDogbnVtYmVyO1xuXG4gIHB1YmxpYyBzY2FuKHNvdXJjZTogc3RyaW5nKTogVG9rZW5bXSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgdGhpcy5nZXRUb2tlbigpO1xuICAgIH1cbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xuICAgICAgdGhpcy5saW5lKys7XG4gICAgICB0aGlzLmNvbCA9IDA7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHRoaXMuY29sKys7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpICE9PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWtOZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOVEVSTUlOQVRFRF9DT01NRU5UKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGhlIGNsb3Npbmcgc2xhc2ggJyovJ1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhxdW90ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBxdW90ZSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOVEVSTUlOQVRFRF9TVFJJTkcsIHsgcXVvdGU6IHF1b3RlIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxuICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICB0aGlzLmFkZFRva2VuKHF1b3RlICE9PSBcImBcIiA/IFRva2VuVHlwZS5TdHJpbmcgOiBUb2tlblR5cGUuVGVtcGxhdGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbnVtYmVyKCk6IHZvaWQge1xuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGZyYWN0aW9uXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcbiAgICB3aGlsZSAoVXRpbHMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcbiAgICBpZiAoVXRpbHMuaXNLZXl3b3JkKGNhcGl0YWxpemVkKSkge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGVbY2FwaXRhbGl6ZWRdLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLklkZW50aWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIltcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJdXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIntcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjtcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiflwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5UaWxkZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ2FyZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkhhc2gsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI6XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcInxcIikgPyBUb2tlblR5cGUuT3IgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlBpcGVsaW5lIDpcbiAgICAgICAgICBUb2tlblR5cGUuUGlwZSxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiZcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlJpZ2h0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiIVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkJhbmdFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj9cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiP1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvblxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25Eb3RcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlF1ZXN0aW9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPVwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiK1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCIrXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzUGx1c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5QbHVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCItXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPFwiKSA/IFRva2VuVHlwZS5MZWZ0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXG4gICAgICAgICAgICAgID8gVG9rZW5UeXBlLkxlc3NFcXVhbEdyZWF0ZXJcbiAgICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiL1wiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi9cIikpIHtcbiAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xuICAgICAgICAgIHRoaXMubXVsdGlsaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TbGFzaEVxdWFsIDogVG9rZW5UeXBlLlNsYXNoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGAnYDpcbiAgICAgIGNhc2UgYFwiYDpcbiAgICAgIGNhc2UgXCJgXCI6XG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGlnbm9yZSBjYXNlc1xuICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgIGNhc2UgXCJcXHJcIjpcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjb21wbGV4IGNhc2VzXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdChjaGFyKSkge1xuICAgICAgICAgIHRoaXMubnVtYmVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xuICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0NIQVJBQ1RFUiwgeyBjaGFyOiBjaGFyIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9KTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHsgbGluZTogdGhpcy5saW5lLCBjb2w6IHRoaXMuY29sLCBzb3VyY2U6IHRoaXMuc291cmNlIH0pO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0ICRpbXBvcnRzID0gKHRoaXMudmFsdWVzPy5jb25zdHJ1Y3RvciBhcyBhbnkpPy4kaW1wb3J0cztcbiAgICBpZiAoJGltcG9ydHMgJiYgdHlwZW9mICRpbXBvcnRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiAkaW1wb3J0c1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5IGFzIGtleW9mIHR5cGVvZiB3aW5kb3ddO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciBhcyBQYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IEV4cHIuUGlwZWxpbmUpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkNhbGwpIHtcbiAgICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodC5jYWxsZWUpO1xuICAgICAgY29uc3QgYXJncyA9IFt2YWx1ZV07XG4gICAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLnJpZ2h0LmFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGFyZyBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGV4cHIucmlnaHQuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLnJpZ2h0LmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3QgZm4gPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHJldHVybiBmbih2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBFeHByLkFycm93RnVuY3Rpb24pOiBhbnkge1xuICAgIGNvbnN0IGNhcHR1cmVkU2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnNjb3BlO1xuICAgICAgdGhpcy5zY29wZSA9IG5ldyBTY29wZShjYXB0dXJlZFNjb3BlKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwci5wYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5wYXJhbXNbaV0ubGV4ZW1lLCBhcmdzW2ldKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuYm9keSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnkgPSB7fSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHsgbGluZSwgY29sIH0pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IEV4cHIuVmFyaWFibGUpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnNjb3BlLmdldChleHByLm5hbWUubGV4ZW1lKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFzc2lnbkV4cHIoZXhwcjogRXhwci5Bc3NpZ24pOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0S2V5RXhwcihleHByOiBFeHByLktleSk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIubmFtZS5saXRlcmFsO1xuICB9XG5cbiAgcHVibGljIHZpc2l0R2V0RXhwcihleHByOiBFeHByLkdldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgaWYgKCFlbnRpdHkgJiYgZXhwci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHlba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNldEV4cHIoZXhwcjogRXhwci5TZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBlbnRpdHlba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IEV4cHIuUG9zdGZpeCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlICsgZXhwci5pbmNyZW1lbnQ7XG5cbiAgICBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICB0aGlzLnNjb3BlLnNldChleHByLmVudGl0eS5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICBleHByLmVudGl0eS5lbnRpdHksXG4gICAgICAgIGV4cHIuZW50aXR5LmtleSxcbiAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuSU5WQUxJRF9QT1NURklYX0xWQUxVRSwgeyBlbnRpdHk6IGV4cHIuZW50aXR5IH0sIGV4cHIubGluZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgdmFsdWVzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoZXhwcmVzc2lvbiBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U3ByZWFkRXhwcihleHByOiBFeHByLlNwcmVhZCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHRlbXBsYXRlUGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMsIHNvdXJjZSk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluc3RhbmNlb2Y6XG4gICAgICAgIHJldHVybiBsZWZ0IGluc3RhbmNlb2YgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZWZ0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0IDw8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUmlnaHRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5LTk9XTl9CSU5BUllfT1BFUkFUT1IsIHsgb3BlcmF0b3I6IGV4cHIub3BlcmF0b3IgfSwgZXhwci5saW5lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogRXhwci5Mb2dpY2FsKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLk9yKSB7XG4gICAgICBpZiAobGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogRXhwci5UZXJuYXJ5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmNvbmRpdGlvbilcbiAgICAgID8gdGhpcy5ldmFsdWF0ZShleHByLnRoZW5FeHByKVxuICAgICAgOiB0aGlzLmV2YWx1YXRlKGV4cHIuZWxzZUV4cHIpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IEV4cHIuTnVsbENvYWxlc2NpbmcpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgaWYgKGxlZnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuVGlsZGU6XG4gICAgICAgIHJldHVybiB+cmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgS0Vycm9yQ29kZS5JTlZBTElEX1BSRUZJWF9SVkFMVUUsXG4gICAgICAgICAgICB7IHJpZ2h0OiBleHByLnJpZ2h0IH0sXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTktOT1dOX1VOQVJZX09QRVJBVE9SLCB7IG9wZXJhdG9yOiBleHByLm9wZXJhdG9yIH0sIGV4cHIubGluZSk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmIChjYWxsZWUgPT0gbnVsbCAmJiBleHByLm9wdGlvbmFsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5OT1RfQV9GVU5DVElPTiwgeyBjYWxsZWU6IGNhbGxlZSB9LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmd1bWVudCBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb24g4oCUIHByZXNlcnZlIGB0aGlzYCBmb3IgbWV0aG9kIGNhbGxzXG4gICAgaWYgKGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TmV3RXhwcihleHByOiBFeHByLk5ldyk6IGFueSB7XG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2xhenopO1xuXG4gICAgaWYgKHR5cGVvZiBjbGF6eiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKFxuICAgICAgICBLRXJyb3JDb2RlLk5PVF9BX0NMQVNTLFxuICAgICAgICB7IGNsYXp6OiBjbGF6eiB9LFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgaWYgKHByb3BlcnR5IGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkaWN0LCB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGljdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFR5cGVvZkV4cHIoZXhwcjogRXhwci5UeXBlb2YpOiBhbnkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVhY2hFeHByKGV4cHI6IEV4cHIuRWFjaCk6IGFueSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGV4cHIubmFtZS5sZXhlbWUsXG4gICAgICBleHByLmtleSA/IGV4cHIua2V5LmxleGVtZSA6IG51bGwsXG4gICAgICB0aGlzLmV2YWx1YXRlKGV4cHIuaXRlcmFibGUpLFxuICAgIF07XG4gIH1cblxuICB2aXNpdFZvaWRFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIHZpc2l0RGVidWdFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgS05vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS05vZGVWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEVsZW1lbnRLTm9kZShrbm9kZTogRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVLTm9kZShrbm9kZTogQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdFRleHRLTm9kZShrbm9kZTogVGV4dCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRDb21tZW50S05vZGUoa25vZGU6IENvbW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0RG9jdHlwZUtOb2RlKGtub2RlOiBEb2N0eXBlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogS05vZGVbXTtcbiAgICBwdWJsaWMgY2hpbGRyZW46IEtOb2RlW107XG4gICAgcHVibGljIHNlbGY6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IEtOb2RlW10sIGNoaWxkcmVuOiBLTm9kZVtdLCBzZWxmOiBib29sZWFuLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLnNlbGYgPSBzZWxmO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2RvY3R5cGUnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUGFyc2VyIHtcbiAgcHVibGljIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm5vZGVzID0gW107XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKGVvZkVycm9yOiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgdGhpcy5jb2wgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVORVhQRUNURURfRU9GLCB7IGVvZkVycm9yOiBlb2ZFcnJvciB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30pOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB7IGxpbmU6IHRoaXMubGluZSwgY29sOiB0aGlzLmNvbCwgc291cmNlOiB0aGlzLnNvdXJjZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0NMT1NJTkdfVEFHKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IG51bGwge1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNvbW1lbnQgY2xvc2luZyAnLS0+J1wiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNsb3NpbmcgZG9jdHlwZVwiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcbiAgICBjb25zdCBkb2N0eXBlID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpLnRyaW0oKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRG9jdHlwZShkb2N0eXBlLCB0aGlzLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbGVtZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX1RBR19OQU1FKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzKCk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFwiLz5cIikgfHxcbiAgICAgIChTZWxmQ2xvc2luZ1RhZ3MuaW5jbHVkZXMobmFtZSkgJiYgdGhpcy5tYXRjaChcIj5cIikpXG4gICAgKSB7XG4gICAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBbXSwgdHJ1ZSwgdGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19CUkFDS0VUKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGlmICghdGhpcy5wZWVrKFwiPC9cIikpIHtcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbihuYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKG5hbWUpO1xuICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuLCBmYWxzZSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogbmFtZSB9KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBuYW1lIH0pO1xuICAgIH1cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogbmFtZSB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoaWxkcmVuKHBhcmVudDogc3RyaW5nKTogTm9kZS5LTm9kZVtdIHtcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5LTm9kZVtdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IHBhcmVudCB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5CTEFOS19BVFRSSUJVVEVfTkFNRSk7XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiJ1wiKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLnN0cmluZyhcIidcIikpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goJ1wiJykpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoJ1wiJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5kZWNvZGVFbnRpdGllcyh0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgTm9kZS5BdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGxpbmUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gIH1cblxuICBwcml2YXRlIHRleHQoKTogTm9kZS5LTm9kZSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICBsZXQgZGVwdGggPSAwO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCJ7e1wiKSkgeyBkZXB0aCsrOyBjb250aW51ZTsgfVxuICAgICAgaWYgKGRlcHRoID4gMCAmJiB0aGlzLm1hdGNoKFwifX1cIikpIHsgZGVwdGgtLTsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA9PT0gMCAmJiB0aGlzLnBlZWsoXCI8XCIpKSB7IGJyZWFrOyB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgY29uc3QgcmF3ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCkudHJpbSgpO1xuICAgIGlmICghcmF3KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlLlRleHQodGhpcy5kZWNvZGVFbnRpdGllcyhyYXcpLCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb2RlRW50aXRpZXModGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dFxuICAgICAgLnJlcGxhY2UoLyZuYnNwOy9nLCBcIlxcdTAwYTBcIilcbiAgICAgIC5yZXBsYWNlKC8mbHQ7L2csIFwiPFwiKVxuICAgICAgLnJlcGxhY2UoLyZndDsvZywgXCI+XCIpXG4gICAgICAucmVwbGFjZSgvJnF1b3Q7L2csICdcIicpXG4gICAgICAucmVwbGFjZSgvJmFwb3M7L2csIFwiJ1wiKVxuICAgICAgLnJlcGxhY2UoLyZhbXA7L2csIFwiJlwiKTsgLy8gbXVzdCBiZSBsYXN0IHRvIGF2b2lkIGRvdWJsZS1kZWNvZGluZ1xuICB9XG5cbiAgcHJpdmF0ZSB3aGl0ZXNwYWNlKCk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzLCAuLi5jbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgZW5kKS50cmltKCk7XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhjbG9zaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIHdoaWxlICghdGhpcy5tYXRjaChjbG9zaW5nKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKGBFeHBlY3RlZCBjbG9zaW5nICR7Y2xvc2luZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDbGFzcyB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJvdXRlQ29uZmlnIHtcbiAgcGF0aDogc3RyaW5nO1xuICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzO1xuICBndWFyZD86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0ZShwYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgXCJcIiwgcGF0aCk7XG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBQb3BTdGF0ZUV2ZW50KFwicG9wc3RhdGVcIikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hQYXRoKHBhdHRlcm46IHN0cmluZywgcGF0aG5hbWU6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsIHtcbiAgaWYgKHBhdHRlcm4gPT09IFwiKlwiKSByZXR1cm4ge307XG4gIGNvbnN0IHBhdHRlcm5QYXJ0cyA9IHBhdHRlcm4uc3BsaXQoXCIvXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgcGF0aFBhcnRzID0gcGF0aG5hbWUuc3BsaXQoXCIvXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKHBhdHRlcm5QYXJ0cy5sZW5ndGggIT09IHBhdGhQYXJ0cy5sZW5ndGgpIHJldHVybiBudWxsO1xuICBjb25zdCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocGF0dGVyblBhcnRzW2ldLnN0YXJ0c1dpdGgoXCI6XCIpKSB7XG4gICAgICBwYXJhbXNbcGF0dGVyblBhcnRzW2ldLnNsaWNlKDEpXSA9IHBhdGhQYXJ0c1tpXTtcbiAgICB9IGVsc2UgaWYgKHBhdHRlcm5QYXJ0c1tpXSAhPT0gcGF0aFBhcnRzW2ldKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZXhwb3J0IGNsYXNzIFJvdXRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHByaXZhdGUgcm91dGVzOiBSb3V0ZUNvbmZpZ1tdID0gW107XG5cbiAgc2V0Um91dGVzKHJvdXRlczogUm91dGVDb25maWdbXSk6IHZvaWQge1xuICAgIHRoaXMucm91dGVzID0gcm91dGVzO1xuICB9XG5cbiAgb25Nb3VudCgpOiB2b2lkIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsICgpID0+IHRoaXMuX25hdmlnYXRlKCksIHtcbiAgICAgIHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCxcbiAgICB9KTtcbiAgICB0aGlzLl9uYXZpZ2F0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfbmF2aWdhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgZm9yIChjb25zdCByb3V0ZSBvZiB0aGlzLnJvdXRlcykge1xuICAgICAgY29uc3QgcGFyYW1zID0gbWF0Y2hQYXRoKHJvdXRlLnBhdGgsIHBhdGhuYW1lKTtcbiAgICAgIGlmIChwYXJhbXMgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgaWYgKHJvdXRlLmd1YXJkKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWQgPSBhd2FpdCByb3V0ZS5ndWFyZCgpO1xuICAgICAgICBpZiAoIWFsbG93ZWQpIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX21vdW50KHJvdXRlLmNvbXBvbmVudCwgcGFyYW1zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9tb3VudChDb21wb25lbnRDbGFzczogQ29tcG9uZW50Q2xhc3MsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHZvaWQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLnJlZiBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIXRoaXMudHJhbnNwaWxlcikgcmV0dXJuO1xuICAgIHRoaXMudHJhbnNwaWxlci5tb3VudENvbXBvbmVudChDb21wb25lbnRDbGFzcywgZWxlbWVudCwgcGFyYW1zKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEJvdW5kYXJ5IHtcbiAgcHJpdmF0ZSBzdGFydDogQ29tbWVudDtcbiAgcHJpdmF0ZSBlbmQ6IENvbW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBOb2RlLCBsYWJlbDogc3RyaW5nID0gXCJib3VuZGFyeVwiKSB7XG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoYCR7bGFiZWx9LXN0YXJ0YCk7XG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1lbmRgKTtcbiAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHRoaXMuc3RhcnQpO1xuICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0aGlzLmVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0KTtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVuZCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgY29uc3QgdG9SZW1vdmUgPSBjdXJyZW50O1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICB0b1JlbW92ZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZCh0b1JlbW92ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc2VydChub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5lbmQucGFyZW50Tm9kZT8uaW5zZXJ0QmVmb3JlKG5vZGUsIHRoaXMuZW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBub2RlcygpOiBOb2RlW10ge1xuICAgIGNvbnN0IHJlc3VsdDogTm9kZVtdID0gW107XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICByZXN1bHQucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGdldCBwYXJlbnQoKTogTm9kZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnBhcmVudE5vZGU7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tIFwiLi9lcnJvci1oYW5kbGVyXCI7XG5cbnR5cGUgVGFzayA9ICgpID0+IHZvaWQ7XG5cbmNvbnN0IHF1ZXVlID0gbmV3IE1hcDxDb21wb25lbnQsIFRhc2tbXT4oKTtcbmNvbnN0IG5leHRUaWNrQ2FsbGJhY2tzOiBUYXNrW10gPSBbXTtcbmxldCBpc1NjaGVkdWxlZCA9IGZhbHNlO1xubGV0IGJhdGNoaW5nRW5hYmxlZCA9IHRydWU7XG5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBpc1NjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIC8vIDEuIFByb2Nlc3MgY29tcG9uZW50IHVwZGF0ZXNcbiAgZm9yIChjb25zdCBbaW5zdGFuY2UsIHRhc2tzXSBvZiBxdWV1ZS5lbnRyaWVzKCkpIHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2FsbCBwcmUtdXBkYXRlIGhvb2sgKG9ubHkgZm9yIHJlYWN0aXZlIHVwZGF0ZXMsIG5vdCBmaXJzdCBtb3VudClcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25DaGFuZ2VzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgaW5zdGFuY2Uub25DaGFuZ2VzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgc3VyZ2ljYWwgRE9NIHVwZGF0ZXMgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICBmb3IgKGNvbnN0IHRhc2sgb2YgdGFza3MpIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuXG4gICAgICAvLyBDYWxsIHBvc3QtdXBkYXRlIGhvb2tcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGhhbmRsZUVycm9yKGUsICdyZW5kZXInLCBpbnN0YW5jZSk7XG4gICAgfVxuICB9XG4gIHF1ZXVlLmNsZWFyKCk7XG5cbiAgLy8gMi4gUHJvY2VzcyBuZXh0VGljayBjYWxsYmFja3NcbiAgY29uc3QgY2FsbGJhY2tzID0gbmV4dFRpY2tDYWxsYmFja3Muc3BsaWNlKDApO1xuICBmb3IgKGNvbnN0IGNiIG9mIGNhbGxiYWNrcykge1xuICAgIHRyeSB7XG4gICAgICBjYigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGhhbmRsZUVycm9yKGUsICdyZW5kZXInKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlVXBkYXRlKGluc3RhbmNlOiBDb21wb25lbnQsIHRhc2s6IFRhc2spIHtcbiAgaWYgKCFiYXRjaGluZ0VuYWJsZWQpIHtcbiAgICB0YXNrKCk7XG4gICAgLy8gRHVyaW5nIHN5bmMgbW91bnQsIHdlIGRvbid0IGNhbGwgb25DaGFuZ2VzIG9yIG9uUmVuZGVyIGhlcmUuXG4gICAgLy8gb25SZW5kZXIgaXMgY2FsbGVkIG1hbnVhbGx5IGF0IHRoZSBlbmQgb2YgdHJhbnNwaWxlL2Jvb3RzdHJhcC5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXF1ZXVlLmhhcyhpbnN0YW5jZSkpIHtcbiAgICBxdWV1ZS5zZXQoaW5zdGFuY2UsIFtdKTtcbiAgfVxuICBxdWV1ZS5nZXQoaW5zdGFuY2UpIS5wdXNoKHRhc2spO1xuXG4gIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgcXVldWVNaWNyb3Rhc2soZmx1c2gpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JhdGNoaW5nKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gYmF0Y2hpbmdFbmFibGVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmx1c2hTeW5jKGZuOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IHByZXYgPSBiYXRjaGluZ0VuYWJsZWQ7XG4gIGJhdGNoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICB0cnkge1xuICAgIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgYmF0Y2hpbmdFbmFibGVkID0gcHJldjtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlIG5leHQgZnJhbWV3b3JrIHVwZGF0ZSBjeWNsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKCk6IFByb21pc2U8dm9pZD47XG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2I6IFRhc2spOiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNiPzogVGFzayk6IFByb21pc2U8dm9pZD4gfCB2b2lkIHtcbiAgaWYgKGNiKSB7XG4gICAgbmV4dFRpY2tDYWxsYmFja3MucHVzaChjYik7XG4gICAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgcXVldWVNaWNyb3Rhc2soZmx1c2gpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBuZXh0VGlja0NhbGxiYWNrcy5wdXNoKHJlc29sdmUpO1xuICAgIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50Q2xhc3MsIENvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IFJvdXRlciwgUm91dGVDb25maWcgfSBmcm9tIFwiLi9yb3V0ZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBlZmZlY3QgfSBmcm9tIFwiLi9zaWduYWxcIjtcbmltcG9ydCB7IEJvdW5kYXJ5IH0gZnJvbSBcIi4vYm91bmRhcnlcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBxdWV1ZVVwZGF0ZSwgZmx1c2hTeW5jIH0gZnJvbSBcIi4vc2NoZWR1bGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tIFwiLi9lcnJvci1oYW5kbGVyXCI7XG5pbXBvcnQgeyBpc0JhdGNoaW5nIH0gZnJvbSBcIi4vc2NoZWR1bGVyXCI7XG5pbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG5jb25zdCBLRVlfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XG4gIGVzYzogW1wiRXNjYXBlXCIsIFwiRXNjXCJdLFxuICBlc2NhcGU6IFtcIkVzY2FwZVwiLCBcIkVzY1wiXSxcbiAgc3BhY2U6IFtcIiBcIiwgXCJTcGFjZWJhclwiXSxcbiAgdXA6IFtcIkFycm93VXBcIiwgXCJVcFwiXSxcbiAgZG93bjogW1wiQXJyb3dEb3duXCIsIFwiRG93blwiXSxcbiAgbGVmdDogW1wiQXJyb3dMZWZ0XCIsIFwiTGVmdFwiXSxcbiAgcmlnaHQ6IFtcIkFycm93UmlnaHRcIiwgXCJSaWdodFwiXSxcbiAgZGVsOiBbXCJEZWxldGVcIiwgXCJEZWxcIl0sXG4gIGRlbGV0ZTogW1wiRGVsZXRlXCIsIFwiRGVsXCJdLFxuICBpbnM6IFtcIkluc2VydFwiXSxcbiAgZG90OiBbXCIuXCJdLFxuICBjb21tYTogW1wiLFwiXSxcbiAgc2xhc2g6IFtcIi9cIl0sXG4gIGJhY2tzbGFzaDogW1wiXFxcXFwiXSxcbiAgcGx1czogW1wiK1wiXSxcbiAgbWludXM6IFtcIi1cIl0sXG4gIGVxdWFsOiBbXCI9XCJdLFxufTtcblxudHlwZSBJZkVsc2VOb2RlID0gW0tOb2RlLkVsZW1lbnQsIEtOb2RlLkF0dHJpYnV0ZV07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc3BpbGVyIGltcGxlbWVudHMgS05vZGUuS05vZGVWaXNpdG9yPHZvaWQ+IHtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgRXhwcmVzc2lvblBhcnNlcigpO1xuICBwcml2YXRlIHRlbXBsYXRlUGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHByaXZhdGUgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIoKTtcbiAgcHVibGljIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuICBwdWJsaWMgbW9kZTogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCIgPSBcImRldmVsb3BtZW50XCI7XG4gIHByaXZhdGUgaXNSZW5kZXJpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIHRoaXMucmVnaXN0cnlbXCJyb3V0ZXJcIl0gPSB7IGNvbXBvbmVudDogUm91dGVyIH07XG4gICAgaWYgKCFvcHRpb25zKSByZXR1cm47XG4gICAgaWYgKG9wdGlvbnMucmVnaXN0cnkpIHtcbiAgICAgIHRoaXMucmVnaXN0cnkgPSB7IC4uLnRoaXMucmVnaXN0cnksIC4uLm9wdGlvbnMucmVnaXN0cnkgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckNvbXBvbmVudEluc3RhbmNlKFxuICAgIGluc3RhbmNlOiBhbnksXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgcmVzdG9yZVNjb3BlOiBTY29wZSxcbiAgICBzbG90cz86IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgKTogdm9pZCB7XG4gICAgaWYgKHNsb3RzKSBpbnN0YW5jZS4kc2xvdHMgPSBzbG90cztcblxuICAgIGluc3RhbmNlLiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50KTtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGluc3RhbmNlKTtcbiAgICAgICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGluc3RhbmNlKTtcbiAgICAgICAgaWYgKHNsb3RzKSBpbnN0YW5jZS4kc2xvdHMgPSBzbG90cztcbiAgICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGVsZW1lbnQpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgaW5zdGFuY2Uub25SZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSBpbnN0YW5jZS5vbk1vdW50KCk7XG5cbiAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGluc3RhbmNlKTtcbiAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgaW5zdGFuY2UpO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgZWxlbWVudCk7XG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgfSk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlTm9kZXModGFnOiBzdHJpbmcpOiBLTm9kZS5LTm9kZVtdIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMucmVnaXN0cnlbdGFnXTtcbiAgICBpZiAoZW50cnkubm9kZXMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGVudHJ5Lm5vZGVzO1xuICAgIGNvbnN0IHNvdXJjZSA9IChlbnRyeS5jb21wb25lbnQgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgZW50cnkubm9kZXMgPSBbXTtcbiAgICAgIHJldHVybiBlbnRyeS5ub2RlcztcbiAgICB9XG4gICAgZW50cnkubm9kZXMgPSB0aGlzLnRlbXBsYXRlUGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIGVudHJ5Lm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZShub2RlOiBLTm9kZS5LTm9kZSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcbiAgICAgIGNvbnN0IG1pc3BsYWNlZCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlbHNlaWZcIiwgXCJAZWxzZVwiXSk7XG4gICAgICBpZiAobWlzcGxhY2VkKSB7XG4gICAgICAgIC8vIFRoZXNlIGFyZSBoYW5kbGVkIGJ5IGRvSWYsIGlmIHdlIHJlYWNoIHRoZW0gaGVyZSBpdCdzIGFuIGVycm9yXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtaXNwbGFjZWQubmFtZS5zdGFydHNXaXRoKFwiQFwiKSA/IG1pc3BsYWNlZC5uYW1lLnNsaWNlKDEpIDogbWlzcGxhY2VkLm5hbWU7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNQTEFDRURfQ09ORElUSU9OQUwsIHsgbmFtZTogbmFtZSB9LCBlbC5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbm9kZS5hY2NlcHQodGhpcywgcGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZE1ldGhvZHMoZW50aXR5OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIWVudGl0eSB8fCB0eXBlb2YgZW50aXR5ICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZW50aXR5KTtcbiAgICB3aGlsZSAocHJvdG8gJiYgcHJvdG8gIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywga2V5KT8uZ2V0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlba2V5XSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAga2V5ICE9PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVudGl0eSwga2V5KVxuICAgICAgICApIHtcbiAgICAgICAgICBlbnRpdHlba2V5XSA9IGVudGl0eVtrZXldLmJpbmQoZW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZXMgYW4gZWZmZWN0IHRoYXQgcmVzdG9yZXMgdGhlIGN1cnJlbnQgc2NvcGUgb24gZXZlcnkgcmUtcnVuLFxuICAvLyBzbyBlZmZlY3RzIHNldCB1cCBpbnNpZGUgQGVhY2ggYWx3YXlzIGV2YWx1YXRlIGluIHRoZWlyIGl0ZW0gc2NvcGUuXG4gIHByaXZhdGUgc2NvcGVkRWZmZWN0KGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiBlZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoaXNCYXRjaGluZygpKSB7XG4gICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgICBoYW5kbGVFcnJvcihlLCBcInJlbmRlclwiLCBpbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBXcmFwcyBhIHJlZnJlc2ggZnVuY3Rpb24gc28gaXQgcmVzdG9yZXMgdGhlIGNvcnJlY3Qgc2NvcGUgd2hlbiBjYWxsZWRcbiAgLy8gZGlyZWN0bHkgYnkgdHJpZ2dlclJlZnJlc2ggKG91dHNpZGUgb2YgdGhlIHNpZ25hbCBlZmZlY3QgbWFjaGluZXJ5KS5cbiAgcHJpdmF0ZSBzY29wZWRSZWZyZXNoKGZuOiAoKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMsIHNvdXJjZSk7XG5cbiAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGlmIChvdmVycmlkZVNjb3BlKSB7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3ZlcnJpZGVTY29wZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbnMubWFwKChleHByZXNzaW9uKSA9PlxuICAgICAgdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKVxuICAgICk7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPyByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRyYW5zcGlsZShcbiAgICBub2RlczogS05vZGUuS05vZGVbXSxcbiAgICBlbnRpdHk6IGFueSxcbiAgICBjb250YWluZXI6IEVsZW1lbnRcbiAgKTogTm9kZSB7XG4gICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICB0aGlzLmJpbmRNZXRob2RzKGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLmluaXQoZW50aXR5KTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGVudGl0eSk7XG5cbiAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMudHJpZ2dlclJlbmRlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFbGVtZW50S05vZGUobm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGV4dEtOb2RlKG5vZGU6IEtOb2RlLlRleHQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KHRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsICgpID0+IHtcbiAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gbmV3VmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QodGV4dCwgc3RvcCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYXR0ci52YWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGF0dHIsIHN0b3ApO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUoX25vZGU6IEtOb2RlLkNvbW1lbnQsIF9wYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgLy8gdGVtcGxhdGUgY29tbWVudHMgYXJlIHN0cmlwcGVkIGZyb20gRE9NIG91dHB1dFxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja0VmZmVjdCh0YXJnZXQ6IGFueSwgc3RvcDogYW55KSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICAgIGNvbnN0IHRyYWNraW5nU2NvcGUgPSBpbnN0YW5jZSA/IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKSA6IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICBjb25zdCBwcmV2U2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG5cbiAgICAgIC8vIEV2YWx1YXRlIGNvbmRpdGlvbnMgc3luY2hyb25vdXNseSB0byBlbnN1cmUgc2lnbmFsIHRyYWNraW5nXG4gICAgICBjb25zdCByZXN1bHRzOiBib29sZWFuW10gPSBbXTtcbiAgICAgIHJlc3VsdHMucHVzaCghIXRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvbnNbMF1bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSkpO1xuXG4gICAgICBpZiAoIXJlc3VsdHNbMF0pIHtcbiAgICAgICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZWlmXCJdKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2godmFsKTtcbiAgICAgICAgICAgIGlmICh2YWwpIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlXCJdKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XG4gICAgICAgICAgICBleHByZXNzaW9uc1swXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzW2ldKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zW2ldWzBdLmFjY2VwdCh0aGlzLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gdGhpcy5zY29wZWRSZWZyZXNoKHJ1bik7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QocnVuKTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3Qga2V5QXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQGtleVwiXSk7XG4gICAgaWYgKGtleUF0dHIpIHtcbiAgICAgIHRoaXMuZG9FYWNoS2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50LCBrZXlBdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb0VhY2hVbmtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2hVbmtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSBuZXcgQm91bmRhcnkocGFyZW50LCBcImVhY2hcIik7XG4gICAgY29uc3Qgb3JpZ2luYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBrZXksIGl0ZXJhYmxlXSA9IHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoXG4gICAgICAgIHRoaXMucGFyc2VyLmZvcmVhY2godG9rZW5zKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICAgIGJvdW5kYXJ5LmNsZWFyKCk7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgICAgaWYgKGtleSkgc2NvcGVWYWx1ZXNba2V5XSA9IGluZGV4O1xuXG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gb3JpZ2luYWxTY29wZTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gdGhpcy5zY29wZWRSZWZyZXNoKHJ1bik7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QocnVuKTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclJlZnJlc2gobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIC8vIDEuIFJlLXJ1biBzdHJ1Y3R1cmFsIGxvZ2ljIChpZi9lYWNoL3doaWxlKVxuICAgIGlmICgobm9kZSBhcyBhbnkpLiRrYXNwZXJSZWZyZXNoKSB7XG4gICAgICAobm9kZSBhcyBhbnkpLiRrYXNwZXJSZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgLy8gMi4gUmUtcnVuIGFsbCBzdXJnaWNhbCBlZmZlY3RzICh0ZXh0IGludGVycG9sYXRpb24sIGF0dHJpYnV0ZXMsIGV0Yy4pXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0b3AucnVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnRyaWdnZXJSZWZyZXNoKGNoaWxkKSk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBpbmRleEtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXMgaW1tZWRpYXRlbHlcbiAgICAgIGNvbnN0IG5ld0l0ZW1zOiBBcnJheTx7IGl0ZW06IGFueTsgaWR4OiBudW1iZXI7IGtleTogYW55IH0+ID0gW107XG4gICAgICBjb25zdCBzZWVuS2V5cyA9IG5ldyBTZXQoKTtcbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIHNlZW5LZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBbS2FzcGVyXSBEdXBsaWNhdGUga2V5IGRldGVjdGVkIGluIEBlYWNoOiBcIiR7a2V5fVwiLiBLZXlzIG11c3QgYmUgdW5pcXVlIHRvIGVuc3VyZSBjb3JyZWN0IHJlY29uY2lsaWF0aW9uLmApO1xuICAgICAgICB9XG4gICAgICAgIHNlZW5LZXlzLmFkZChrZXkpO1xuXG4gICAgICAgIG5ld0l0ZW1zLnB1c2goeyBpdGVtOiBpdGVtLCBpZHg6IGluZGV4LCBrZXk6IGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBkb21Ob2RlXSBvZiBrZXllZE5vZGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyIHVzaW5nIGEgY3Vyc29yIHRvIGF2b2lkIHVubmVjZXNzYXJ5IG1vdmVzXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IChib3VuZGFyeSBhcyBhbnkpLmVuZC5wYXJlbnROb2RlIGFzIE5vZGU7XG4gICAgICAgIGxldCBsYXN0SW5zZXJ0ZWQ6IE5vZGUgPSAoYm91bmRhcnkgYXMgYW55KS5zdGFydDtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgaXRlbSwgaWR4LCBrZXkgfSBvZiBuZXdJdGVtcykge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaWR4O1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuXG4gICAgICAgICAgaWYgKGtleWVkTm9kZXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBrZXllZE5vZGVzLmdldChrZXkpITtcblxuICAgICAgICAgICAgLy8gT25seSBtb3ZlIHRoZSBub2RlIGlmIGl0J3Mgbm90IGFscmVhZHkgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcgIT09IGRvbU5vZGUpIHtcbiAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShkb21Ob2RlLCBsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdEluc2VydGVkID0gZG9tTm9kZTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHNjb3BlIGFuZCB0cmlnZ2VyIHJlLXJlbmRlciBvZiBuZXN0ZWQgc3RydWN0dXJhbCBkaXJlY3RpdmVzXG4gICAgICAgICAgICBjb25zdCBub2RlU2NvcGUgPSAoZG9tTm9kZSBhcyBhbnkpLiRrYXNwZXJTY29wZTtcbiAgICAgICAgICAgIGlmIChub2RlU2NvcGUpIHtcbiAgICAgICAgICAgICAgbm9kZVNjb3BlLnNldChuYW1lLCBpdGVtKTtcbiAgICAgICAgICAgICAgaWYgKGluZGV4S2V5KSBub2RlU2NvcGUuc2V0KGluZGV4S2V5LCBpZHgpO1xuXG4gICAgICAgICAgICAgIC8vIElmIGl0IGhhcyBpdHMgb3duIHJlbmRlciBsb2dpYyAobmVzdGVkIGVhY2gvaWYpLCB0cmlnZ2VyIGl0IHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgIHRoaXMudHJpZ2dlclJlZnJlc2goZG9tTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIGlmIChjcmVhdGVkKSB7XG4gICAgICAgICAgICAgIC8vIGNyZWF0ZUVsZW1lbnQgaW5zZXJ0cyBiZWZvcmUgZW5kOyBtb3ZlIHRvIGNvcnJlY3QgcG9zaXRpb24gaWYgbmVlZGVkXG4gICAgICAgICAgICAgIGlmIChsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcgIT09IGNyZWF0ZWQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNyZWF0ZWQsIGxhc3RJbnNlcnRlZC5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGFzdEluc2VydGVkID0gY3JlYXRlZDtcbiAgICAgICAgICAgICAga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHNjb3BlIG9uIHRoZSBET00gbm9kZSBzbyB3ZSBjYW4gdXBkYXRlIGl0IGxhdGVyXG4gICAgICAgICAgICAgIChjcmVhdGVkIGFzIGFueSkuJGthc3BlclNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHRoaXMuc2NvcGVkUmVmcmVzaChydW4pO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuXG4gIHByaXZhdGUgY3JlYXRlU2libGluZ3Mobm9kZXM6IEtOb2RlLktOb2RlW10sIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IDA7XG4gICAgY29uc3QgaW5pdGlhbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBsZXQgZ3JvdXBTY29wZTogU2NvcGUgfCBudWxsID0gbnVsbDtcblxuICAgIHdoaWxlIChjdXJyZW50IDwgbm9kZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZXNbY3VycmVudCsrXTtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgIGNvbnN0IGVsID0gbm9kZSBhcyBLTm9kZS5FbGVtZW50O1xuXG4gICAgICAgIC8vIDEuIFByb2Nlc3MgQGxldCAobGVha3MgdG8gc2libGluZ3MgYW5kIGF2YWlsYWJsZSB0byBvdGhlciBkaXJlY3RpdmVzIG9uIHRoaXMgbm9kZSlcbiAgICAgICAgY29uc3QgJGxldCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBsZXRcIl0pO1xuICAgICAgICBpZiAoJGxldCkge1xuICAgICAgICAgIGlmICghZ3JvdXBTY29wZSkge1xuICAgICAgICAgICAgZ3JvdXBTY29wZSA9IG5ldyBTY29wZShpbml0aWFsU2NvcGUpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IGdyb3VwU2NvcGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZSgkbGV0LnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIuIFZhbGlkYXRpb246IFN0cnVjdHVyYWwgZGlyZWN0aXZlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlXG4gICAgICAgIGNvbnN0IGlmQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBpZlwiXSk7XG4gICAgICAgIGNvbnN0IGVsc2VpZkF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZWlmXCJdKTtcbiAgICAgICAgY29uc3QgZWxzZUF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZVwiXSk7XG4gICAgICAgIGNvbnN0ICRlYWNoID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVhY2hcIl0pO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIikge1xuICAgICAgICAgIGNvbnN0IHN0cnVjdHVyYWxDb3VudCA9IFtpZkF0dHIsIGVsc2VpZkF0dHIsIGVsc2VBdHRyLCAkZWFjaF0uZmlsdGVyKGEgPT4gYSkubGVuZ3RoO1xuICAgICAgICAgIGlmIChzdHJ1Y3R1cmFsQ291bnQgPiAxKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTVVMVElQTEVfU1RSVUNUVVJBTF9ESVJFQ1RJVkVTLCB7fSwgZWwubmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gMy4gUHJvY2VzcyBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgKG9uZSB3aWxsIG1hdGNoIGFuZCBjb250aW51ZSlcbiAgICAgICAgaWYgKCRlYWNoKSB7XG4gICAgICAgICAgdGhpcy5kb0VhY2goJGVhY2gsIGVsLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpZkF0dHIpIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uczogSWZFbHNlTm9kZVtdID0gW1tlbCwgaWZBdHRyXV07XG5cbiAgICAgICAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IG5vZGVzW2N1cnJlbnRdO1xuICAgICAgICAgICAgaWYgKG5leHQudHlwZSAhPT0gXCJlbGVtZW50XCIpIGJyZWFrO1xuICAgICAgICAgICAgY29uc3QgYXR0ciA9IHRoaXMuZmluZEF0dHIobmV4dCBhcyBLTm9kZS5FbGVtZW50LCBbXG4gICAgICAgICAgICAgIFwiQGVsc2VcIixcbiAgICAgICAgICAgICAgXCJAZWxzZWlmXCIsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goW25leHQgYXMgS05vZGUuRWxlbWVudCwgYXR0cl0pO1xuICAgICAgICAgICAgICBjdXJyZW50ICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXZhbHVhdGUobm9kZSwgcGFyZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gaW5pdGlhbFNjb3BlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFbGVtZW50KG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBOb2RlIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5vZGUubmFtZSA9PT0gXCJzbG90XCIpIHtcbiAgICAgICAgY29uc3QgbmFtZUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBuYW1lXCJdKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVBdHRyID8gbmFtZUF0dHIudmFsdWUgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgY29uc3Qgc2xvdHMgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRzbG90c1wiKTtcbiAgICAgICAgaWYgKHNsb3RzICYmIHNsb3RzW25hbWVdKSB7XG4gICAgICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgLy8gUmVzdG9yZSB0aGUgc2NvcGUgd2hlcmUgdGhlIHNsb3QgY29udGVudCB3YXMgZGVmaW5lZCAoTGV4aWNhbCBTY29waW5nKS5cbiAgICAgICAgICAvLyBXZSBzdG9yZSB0aGUgc2NvcGUgcmVmZXJlbmNlIGRpcmVjdGx5IG9uIHRoZSBBcnJheSBpbnN0YW5jZSB0byBhdm9pZCBjaGFuZ2luZyBzaWduYXR1cmVzLlxuICAgICAgICAgIGlmIChzbG90c1tuYW1lXS5zY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNsb3RzW25hbWVdLnNjb3BlO1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Moc2xvdHNbbmFtZV0sIHBhcmVudCk7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNWb2lkID0gbm9kZS5uYW1lID09PSBcInZvaWRcIjtcbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gISF0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBpc1ZvaWQgPyBwYXJlbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSk7XG4gICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCBzY29wZVxuICAgICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSB7fTtcbiAgICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBjaGlsZHJlbiBmb3Igc2xvdHMuIFxuICAgICAgICAvLyBXZSB1c2UgYSBwbGFpbiBvYmplY3Qga2V5ZWQgYnkgc2xvdCBuYW1lLiBFYWNoIHZhbHVlIGlzIGFuIEFycmF5IG9mIEtOb2Rlcy5cbiAgICAgICAgLy8gVG8gc3VwcG9ydCBsZXhpY2FsIHNjb3BpbmcsIHdlIGF0dGFjaCB0aGUgY3VycmVudCBzY29wZSB0byB0aGUgQXJyYXkgaW5zdGFuY2UuXG4gICAgICAgIGNvbnN0IHNsb3RzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyBkZWZhdWx0OiBbXSB9O1xuICAgICAgICBzbG90cy5kZWZhdWx0LnNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICBjb25zdCBzbG90QXR0ciA9IHRoaXMuZmluZEF0dHIoY2hpbGQgYXMgS05vZGUuRWxlbWVudCwgW1wiQHNsb3RcIl0pO1xuICAgICAgICAgICAgaWYgKHNsb3RBdHRyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzbG90QXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFzbG90c1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIHNsb3RzW25hbWVdID0gW107XG4gICAgICAgICAgICAgICAgc2xvdHNbbmFtZV0uc2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNsb3RzW25hbWVdLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2xvdHMuZGVmYXVsdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmxhenkpIHtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXTtcblxuICAgICAgICAgIGlmIChlbnRyeS5mYWxsYmFjaykge1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tOb2RlcyA9IHRoaXMudGVtcGxhdGVQYXJzZXIucGFyc2UoKGVudHJ5LmZhbGxiYWNrIGFzIGFueSkudGVtcGxhdGUgPz8gXCJcIik7XG4gICAgICAgICAgICBjb25zdCBmYWxsYmFja0luc3RhbmNlOiBhbnkgPSBuZXcgZW50cnkuZmFsbGJhY2soeyBhcmdzOiB7fSwgcmVmOiBlbGVtZW50LCB0cmFuc3BpbGVyOiB0aGlzIH0pO1xuICAgICAgICAgICAgdGhpcy5iaW5kTWV0aG9kcyhmYWxsYmFja0luc3RhbmNlKTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gZmFsbGJhY2tJbnN0YW5jZTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50SW5zdGFuY2UoZmFsbGJhY2tJbnN0YW5jZSwgZmFsbGJhY2tOb2RlcywgZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcmVzdG9yZVNjb3BlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIShlbnRyeSBhcyBhbnkpLl9wcm9taXNlKSB7XG4gICAgICAgICAgICAoZW50cnkgYXMgYW55KS5fcHJvbWlzZSA9IChlbnRyeS5jb21wb25lbnQgYXMgKCkgPT4gUHJvbWlzZTxDb21wb25lbnRDbGFzcz4pKCkudGhlbigoY2xzKSA9PiB7XG4gICAgICAgICAgICAgIGVudHJ5Lm5vZGVzID0gdGhpcy50ZW1wbGF0ZVBhcnNlci5wYXJzZSgoY2xzIGFzIGFueSkudGVtcGxhdGUgPz8gXCJcIik7XG4gICAgICAgICAgICAgIGVudHJ5LmNvbXBvbmVudCA9IGNscztcbiAgICAgICAgICAgICAgZGVsZXRlIGVudHJ5Lmxhenk7XG4gICAgICAgICAgICAgIGRlbGV0ZSAoZW50cnkgYXMgYW55KS5fcHJvbWlzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIChlbnRyeSBhcyBhbnkpLl9wcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBjbHMgPSBlbnRyeS5jb21wb25lbnQgYXMgQ29tcG9uZW50Q2xhc3M7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZTogYW55ID0gbmV3IGNscyh7IGFyZ3M6IGFyZ3MsIHJlZjogZWxlbWVudCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoaW5zdGFuY2UpO1xuICAgICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50SW5zdGFuY2UoaW5zdGFuY2UsIGVudHJ5Lm5vZGVzISwgZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcmVzdG9yZVNjb3BlLCBzbG90cyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVnaXN0cnlbbm9kZS5uYW1lXT8uY29tcG9uZW50KSB7XG4gICAgICAgICAgY29tcG9uZW50ID0gbmV3ICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0uY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzKSh7XG4gICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgcmVmOiBlbGVtZW50LFxuICAgICAgICAgICAgdHJhbnNwaWxlcjogdGhpcyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgICAgICAgIGlmIChub2RlLm5hbWUgPT09IFwicm91dGVyXCIgJiYgY29tcG9uZW50IGluc3RhbmNlb2YgUm91dGVyKSB7XG4gICAgICAgICAgICBjb25zdCByb3V0ZVNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXRSb3V0ZXModGhpcy5leHRyYWN0Um91dGVzKG5vZGUuY2hpbGRyZW4sIHVuZGVmaW5lZCwgcm91dGVTY29wZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50SW5zdGFuY2UoY29tcG9uZW50LCB0aGlzLnJlc29sdmVOb2Rlcyhub2RlLm5hbWUpLCBlbGVtZW50IGFzIEhUTUxFbGVtZW50LCByZXN0b3JlU2NvcGUsIHNsb3RzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgICAgLy8gZXZlbnQgYmluZGluZ1xuICAgICAgICBjb25zdCBldmVudHMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50IGFzIEtOb2RlLkF0dHJpYnV0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBmaXJzdClcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoXG4gICAgICAgICAgKGF0dHIpID0+ICEoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2YgYXR0cmlidXRlcykge1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXR0ciwgZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG9ydGhhbmQgYXR0cmlidXRlcyAocHJvY2Vzc2VkIHNlY29uZCwgYWxsb3dzIG1lcmdpbmcpXG4gICAgICAgIGNvbnN0IHNob3J0aGFuZEF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgbmFtZS5zdGFydHNXaXRoKFwiQFwiKSAmJlxuICAgICAgICAgICAgIVtcIkBpZlwiLCBcIkBlbHNlaWZcIiwgXCJAZWxzZVwiLCBcIkBlYWNoXCIsIFwiQGxldFwiLCBcIkBrZXlcIiwgXCJAcmVmXCJdLmluY2x1ZGVzKFxuICAgICAgICAgICAgICBuYW1lXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQG9uOlwiKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIHNob3J0aGFuZEF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCByZWFsTmFtZSA9IChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zbGljZSgxKTtcblxuICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhlY3V0ZSgoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLnZhbHVlKTtcbiAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdmFsdWUpO1xuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCB0YXNrKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFja0VmZmVjdChlbGVtZW50LCBzdG9wKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocmVhbE5hbWUgIT09IFwic3R5bGVcIikge1xuICAgICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkucmVtb3ZlQXR0cmlidXRlKHJlYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gZXhpc3RpbmcgJiYgIWV4aXN0aW5nLmluY2x1ZGVzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgID8gYCR7ZXhpc3RpbmcuZW5kc1dpdGgoXCI7XCIpID8gZXhpc3RpbmcgOiBleGlzdGluZyArIFwiO1wifSAke3ZhbHVlfWBcbiAgICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShyZWFsTmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJlbnQgJiYgIWlzVm9pZCkge1xuICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVmQXR0ciA9IHRoaXMuZmluZEF0dHIobm9kZSwgW1wiQHJlZlwiXSk7XG4gICAgICBpZiAocmVmQXR0ciAmJiAhaXNWb2lkKSB7XG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcmVmQXR0ci52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IGVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQocHJvcE5hbWUsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnNlbGYpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZS5jaGlsZHJlbiwgZWxlbWVudCk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuXG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgS2FzcGVyRXJyb3IpIHRocm93IGUud2l0aFRhZyhub2RlLm5hbWUpO1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlJVTlRJTUVfRVJST1IsIHsgbWVzc2FnZTogZS5tZXNzYWdlIHx8IGAke2V9YCB9LCBub2RlLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzOiBLTm9kZS5BdHRyaWJ1dGVbXSk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgY29uc3Qga2V5ID0gYXJnLm5hbWUuc3BsaXQoXCI6XCIpWzFdO1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGtleS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJvblwiKSkge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gYXJnLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgY29uc3QgaXNDYWxsRXhwciA9IC9eW1xcdyQuXVtcXHckLl0qXFxzKlxcKC4qXFwpXFxzKiQvLnRlc3QodHJpbW1lZCkgJiYgIXRyaW1tZWQuaW5jbHVkZXMoXCI9PlwiKTtcbiAgICAgICAgaWYgKGlzQ2FsbEV4cHIpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgW0thc3Blcl0gQDoke2tleX09XCIke2FyZy52YWx1ZX1cIiDigJQgdGhlIGV4cHJlc3Npb24gaXMgY2FsbGVkIGR1cmluZyByZW5kZXIgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgcGFzc2VkIGFzIHRoZSBwcm9wLiBgICtcbiAgICAgICAgICAgIGBJZiBpdCByZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQgZnVuY3Rpb24gYmVjb21lcyB0aGUgaGFuZGxlciAoZmFjdG9yeSBwYXR0ZXJuKS4gYCArXG4gICAgICAgICAgICBgSWYgaXQgcmV0dXJucyB1bmRlZmluZWQsIHRoZSBwcm9wIHJlY2VpdmVzIHVuZGVmaW5lZC4gYCArXG4gICAgICAgICAgICBgSWYgdGhlIGZ1bmN0aW9uIGhhcyByZWFjdGl2ZSBzaWRlIGVmZmVjdHMsIGVuc3VyZSBpdCBkb2VzIG5vdCBib3RoIHJlYWQgYW5kIHdyaXRlIHRoZSBzYW1lIHNpZ25hbC5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmV4ZWN1dGUoYXJnLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBOb2RlLCBhdHRyOiBLTm9kZS5BdHRyaWJ1dGUpOiB2b2lkIHtcbiAgICBjb25zdCBbZXZlbnROYW1lLCAuLi5tb2RpZmllcnNdID0gYXR0ci5uYW1lLnNwbGl0KFwiOlwiKVsxXS5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgbGlzdGVuZXJTY29wZSA9IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKTtcbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0ge307XG4gICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsID0gaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gICAgfVxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvbmNlXCIpKSBvcHRpb25zLm9uY2UgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKSBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKSBvcHRpb25zLmNhcHR1cmUgPSB0cnVlO1xuXG4gICAgLy8gQW55dGhpbmcgbm90IGluIHRoaXMgbGlzdCBpcyB0cmVhdGVkIGFzIGEgcG90ZW50aWFsIGtleSBtb2RpZmllclxuICAgIGNvbnN0IGNvbnRyb2xNb2RpZmllcnMgPSBbXCJwcmV2ZW50XCIsIFwic3RvcFwiLCBcIm9uY2VcIiwgXCJwYXNzaXZlXCIsIFwiY2FwdHVyZVwiLCBcImN0cmxcIiwgXCJzaGlmdFwiLCBcImFsdFwiLCBcIm1ldGFcIl07XG4gICAgY29uc3QgcG90ZW50aWFsS2V5TW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigobSkgPT4gIWNvbnRyb2xNb2RpZmllcnMuaW5jbHVkZXMobS50b0xvd2VyQ2FzZSgpKSk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBldmVudE5hbWUsXG4gICAgICAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAocG90ZW50aWFsS2V5TW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBtYXRjaGVkID0gcG90ZW50aWFsS2V5TW9kaWZpZXJzLnNvbWUoKG0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyTSA9IG0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChLRVlfTUFQW2xvd2VyTV0gJiYgS0VZX01BUFtsb3dlck1dLmluY2x1ZGVzKGV2ZW50LmtleSkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvd2VyTSA9PT0gZXZlbnQua2V5Py50b0xvd2VyQ2FzZSgpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY3RybFwiKSAmJiAhZXZlbnQuY3RybEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic2hpZnRcIikgJiYgIWV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJhbHRcIikgJiYgIWV2ZW50LmFsdEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibWV0YVwiKSAmJiAhZXZlbnQubWV0YUtleSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwcmV2ZW50XCIpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic3RvcFwiKSkgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGxpc3RlbmVyU2NvcGUuc2V0KFwiJGV2ZW50XCIsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5leGVjdXRlKGF0dHIudmFsdWUsIGxpc3RlbmVyU2NvcGUpO1xuICAgICAgfSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgcmVnZXggPSAvXFx7XFx7LitcXH1cXH0vbXM7XG4gICAgaWYgKHJlZ2V4LnRlc3QodGV4dCkpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLCAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uKHBsYWNlaG9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zLCBzb3VyY2UpO1xuXG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gYCR7dGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShleHByZXNzaW9uKX1gO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95Tm9kZShub2RlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyAxLiBDbGVhbnVwIGNvbXBvbmVudCBpbnN0YW5jZVxuICAgIGlmIChub2RlLiRrYXNwZXJJbnN0YW5jZSkge1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSBub2RlLiRrYXNwZXJJbnN0YW5jZTtcbiAgICAgIGlmIChpbnN0YW5jZS5vbkRlc3Ryb3kpIHtcbiAgICAgICAgaW5zdGFuY2Uub25EZXN0cm95KCk7XG4gICAgICB9XG4gICAgICBpZiAoaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlci5hYm9ydCgpO1xuICAgIH1cblxuICAgIC8vIDIuIENsZWFudXAgZWZmZWN0cyBhdHRhY2hlZCB0byB0aGUgbm9kZVxuICAgIGlmIChub2RlLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICBub2RlLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgfVxuXG4gICAgLy8gMy4gQ2xlYW51cCBlZmZlY3RzIG9uIGF0dHJpYnV0ZXNcbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBhdHRyID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICBpZiAoYXR0ci4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA0LiBSZWN1cnNlXG4gICAgbm9kZS5jaGlsZE5vZGVzPy5mb3JFYWNoKChjaGlsZDogYW55KSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveShjb250YWluZXI6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIG1vdW50Q29tcG9uZW50KENvbXBvbmVudENsYXNzOiBDb21wb25lbnRDbGFzcywgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gKENvbXBvbmVudENsYXNzIGFzIGFueSkudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLnRlbXBsYXRlUGFyc2VyLnBhcnNlKHRlbXBsYXRlKTtcbiAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaG9zdCk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50Q2xhc3MoeyBhcmdzOiB7IHBhcmFtczogcGFyYW1zIH0sIHJlZjogaG9zdCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgKGhvc3QgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICBjb25zdCBjb21wb25lbnROb2RlcyA9IG5vZGVzO1xuICAgIGNvbXBvbmVudC4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koaG9zdCk7XG4gICAgICAgIGhvc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUobnVsbCwgY29tcG9uZW50KTtcbiAgICAgICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG5cbiAgICAgICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKGNvbXBvbmVudE5vZGVzLCBob3N0KTtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKG51bGwsIGNvbXBvbmVudCk7XG4gICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuXG4gICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGhvc3QpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vbk1vdW50KCk7XG4gICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZXh0cmFjdFJvdXRlcyhjaGlsZHJlbjogS05vZGUuS05vZGVbXSwgcGFyZW50R3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+LCBzY29wZT86IFNjb3BlKTogUm91dGVDb25maWdbXSB7XG4gICAgY29uc3Qgcm91dGVzOiBSb3V0ZUNvbmZpZ1tdID0gW107XG4gICAgY29uc3QgcHJldlNjb3BlID0gc2NvcGUgPyB0aGlzLmludGVycHJldGVyLnNjb3BlIDogdW5kZWZpbmVkO1xuICAgIGlmIChzY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC50eXBlICE9PSBcImVsZW1lbnRcIikgY29udGludWU7XG4gICAgICBjb25zdCBlbCA9IGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBpZiAoZWwubmFtZSA9PT0gXCJyb3V0ZVwiKSB7XG4gICAgICAgIGNvbnN0IHBhdGhBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQHBhdGhcIl0pO1xuICAgICAgICBjb25zdCBjb21wb25lbnRBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGNvbXBvbmVudFwiXSk7XG4gICAgICAgIGNvbnN0IGd1YXJkQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBndWFyZFwiXSk7XG5cbiAgICAgICAgaWYgKCFwYXRoQXR0ciB8fCAhY29tcG9uZW50QXR0cikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNTSU5HX1JFUVVJUkVEX0FUVFIsIHsgbWVzc2FnZTogXCI8cm91dGU+IHJlcXVpcmVzIEBwYXRoIGFuZCBAY29tcG9uZW50IGF0dHJpYnV0ZXMuXCIgfSwgZWwubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoID0gcGF0aEF0dHIhLnZhbHVlO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmV4ZWN1dGUoY29tcG9uZW50QXR0ciEudmFsdWUpO1xuICAgICAgICBjb25zdCBndWFyZCA9IGd1YXJkQXR0ciA/IHRoaXMuZXhlY3V0ZShndWFyZEF0dHIudmFsdWUpIDogcGFyZW50R3VhcmQ7XG4gICAgICAgIHJvdXRlcy5wdXNoKHsgcGF0aDogcGF0aCwgY29tcG9uZW50OiBjb21wb25lbnQsIGd1YXJkOiBndWFyZCB9KTtcbiAgICAgIH0gZWxzZSBpZiAoZWwubmFtZSA9PT0gXCJndWFyZFwiKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjaGVja1wiXSk7XG4gICAgICAgIGlmICghY2hlY2tBdHRyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1JU1NJTkdfUkVRVUlSRURfQVRUUiwgeyBtZXNzYWdlOiBcIjxndWFyZD4gcmVxdWlyZXMgQGNoZWNrIGF0dHJpYnV0ZS5cIiB9LCBlbC5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hlY2tBdHRyKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY2hlY2sgPSB0aGlzLmV4ZWN1dGUoY2hlY2tBdHRyLnZhbHVlKTtcbiAgICAgICAgcm91dGVzLnB1c2goLi4udGhpcy5leHRyYWN0Um91dGVzKGVsLmNoaWxkcmVuLCBjaGVjaykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclJlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JlbmRlcmluZykgcmV0dXJuO1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgaWYgKGluc3RhbmNlICYmIHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShfbm9kZTogS05vZGUuRG9jdHlwZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55LCB0YWdOYW1lPzogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGZpbmFsQXJncyA9IGFyZ3M7XG4gICAgaWYgKHR5cGVvZiBhcmdzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25zdCBjbGVhbk1lc3NhZ2UgPSBhcmdzLmluY2x1ZGVzKFwiUnVudGltZSBFcnJvclwiKVxuICAgICAgICA/IGFyZ3MucmVwbGFjZShcIlJ1bnRpbWUgRXJyb3I6IFwiLCBcIlwiKVxuICAgICAgICA6IGFyZ3M7XG4gICAgICBmaW5hbEFyZ3MgPSB7IG1lc3NhZ2U6IGNsZWFuTWVzc2FnZSB9O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBmaW5hbEFyZ3MsIHsgdGFnOiB0YWdOYW1lIH0pO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudENsYXNzLCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgeyBzZXRFcnJvckhhbmRsZXIsIEVycm9ySGFuZGxlckZuIH0gZnJvbSBcIi4vZXJyb3ItaGFuZGxlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbGF6eShcbiAgaW1wb3J0ZXI6ICgpID0+IFByb21pc2U8UmVjb3JkPHN0cmluZywgQ29tcG9uZW50Q2xhc3M+PlxuKTogeyBjb21wb25lbnQ6ICgpID0+IFByb21pc2U8Q29tcG9uZW50Q2xhc3M+OyBsYXp5OiB0cnVlIH0ge1xuICByZXR1cm4ge1xuICAgIGxhenk6IHRydWUsXG4gICAgY29tcG9uZW50OiAoKSA9PiBpbXBvcnRlcigpLnRoZW4oKG0pID0+IE9iamVjdC52YWx1ZXMobSlbMF0pLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICB0cnkge1xuICAgIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcGlsZShcbiAgc291cmNlOiBzdHJpbmcsXG4gIGVudGl0eT86IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gIGNvbnRhaW5lcj86IEhUTUxFbGVtZW50LFxuICByZWdpc3RyeT86IENvbXBvbmVudFJlZ2lzdHJ5XG4pOiBOb2RlIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiByZWdpc3RyeSB8fCB7fSB9KTtcbiAgY29uc3QgcmVzdWx0ID0gdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGVudGl0eSB8fCB7fSwgY29udGFpbmVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLYXNwZXJDb25maWcge1xuICByb290Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XG4gIGVudHJ5Pzogc3RyaW5nO1xuICByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnk7XG4gIG1vZGU/OiBcImRldmVsb3BtZW50XCIgfCBcInByb2R1Y3Rpb25cIjtcbiAgb25FcnJvcj86IEVycm9ySGFuZGxlckZuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQodHJhbnNwaWxlcjogVHJhbnNwaWxlciwgdGFnOiBzdHJpbmcpIHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgY29uc3QgY29tcG9uZW50ID0gbmV3ICh0cmFuc3BpbGVyLnJlZ2lzdHJ5W3RhZ10uY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzKSh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiB0cmFuc3BpbGVyLnJlc29sdmVOb2Rlcyh0YWcpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbmZpZzogS2FzcGVyQ29uZmlnKSB7XG4gIGNvbnN0IHJvb3QgPVxuICAgIHR5cGVvZiBjb25maWcucm9vdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KVxuICAgICAgOiBjb25maWcucm9vdDtcblxuICBpZiAoIXJvb3QpIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLlJPT1RfRUxFTUVOVF9OT1RfRk9VTkQsXG4gICAgICB7IHJvb3Q6IGNvbmZpZy5yb290IH1cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZW50cnlUYWcgPSBjb25maWcuZW50cnkgfHwgXCJrYXNwZXItYXBwXCI7XG4gIGlmICghY29uZmlnLnJlZ2lzdHJ5W2VudHJ5VGFnXSkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihcbiAgICAgIEtFcnJvckNvZGUuRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORCxcbiAgICAgIHsgdGFnOiBlbnRyeVRhZyB9XG4gICAgKTtcbiAgfVxuXG4gIGlmIChjb25maWcub25FcnJvcikge1xuICAgIHNldEVycm9ySGFuZGxlcihjb25maWcub25FcnJvcik7XG4gIH1cblxuICBjb25zdCB0cmFuc3BpbGVyID0gbmV3IFRyYW5zcGlsZXIoeyByZWdpc3RyeTogY29uZmlnLnJlZ2lzdHJ5IH0pO1xuXG4gIGlmIChjb25maWcubW9kZSkge1xuICAgIHRyYW5zcGlsZXIubW9kZSA9IGNvbmZpZy5tb2RlO1xuICB9XG5cbiAgY29uc3QgeyBub2RlLCBpbnN0YW5jZSwgbm9kZXMgfSA9IGNyZWF0ZUNvbXBvbmVudCh0cmFuc3BpbGVyLCBlbnRyeVRhZyk7XG5cbiAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICByb290LmFwcGVuZENoaWxkKG5vZGUpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25Nb3VudCgpO1xuICB9XG5cbiAgdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGluc3RhbmNlLCBub2RlIGFzIEhUTUxFbGVtZW50KTtcblxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuIl0sIm5hbWVzIjpbInJhd0VmZmVjdCIsInJhd0NvbXB1dGVkIiwiU2V0IiwiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5QaXBlbGluZSIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLkNhbGwiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuU3ByZWFkIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5BcnJvd0Z1bmN0aW9uIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsIk5vZGUuRG9jdHlwZSIsIk5vZGUuRWxlbWVudCIsIk5vZGUuQXR0cmlidXRlIiwiTm9kZS5UZXh0IiwiQ29tcG9uZW50Q2xhc3MiLCJzY29wZSIsInBhcmVudCIsInByZXYiXSwibWFwcGluZ3MiOiJBQUFPLE1BQU0sYUFBYTtBQUFBO0FBQUEsRUFFeEIsd0JBQXdCO0FBQUEsRUFDeEIsMkJBQTJCO0FBQUE7QUFBQSxFQUczQixzQkFBc0I7QUFBQSxFQUN0QixxQkFBcUI7QUFBQSxFQUNyQixzQkFBc0I7QUFBQTtBQUFBLEVBR3RCLGdCQUFnQjtBQUFBLEVBQ2hCLHdCQUF3QjtBQUFBLEVBQ3hCLG1CQUFtQjtBQUFBLEVBQ25CLDBCQUEwQjtBQUFBLEVBQzFCLHNCQUFzQjtBQUFBLEVBQ3RCLHNCQUFzQjtBQUFBLEVBQ3RCLHVCQUF1QjtBQUFBLEVBQ3ZCLGNBQWM7QUFBQSxFQUNkLGdDQUFnQztBQUFBO0FBQUEsRUFHaEMsa0JB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QUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGdCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsaUJBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLElBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQWpGVSxTQUFBQTtBQUFBLEdBQUEsYUFBQSxDQUFBLENBQUE7QUFvRkwsTUFBTSxNQUFNO0FBQUEsRUFRakIsWUFDRSxNQUNBLFFBQ0EsU0FDQSxNQUNBLEtBQ0E7QUFDQSxTQUFLLE9BQU8sVUFBVSxJQUFJO0FBQzFCLFNBQUssT0FBTztBQUNaLFNBQUssU0FBUztBQUNkLFNBQUssVUFBVTtBQUNmLFNBQUssT0FBTztBQUNaLFNBQUssTUFBTTtBQUFBLEVBQ2I7QUFBQSxFQUVPLFdBQVc7QUFDaEIsV0FBTyxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssTUFBTTtBQUFBLEVBQ3hDO0FBQ0Y7QUFFTyxNQUFNLGNBQWMsQ0FBQyxLQUFLLE1BQU0sS0FBTSxJQUFJO0FBRTFDLE1BQU0sa0JBQWtCO0FBQUEsRUFDN0I7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUM3SE8sTUFBTSxpQkFBaUI7QUFBQSxFQUtyQixNQUFNLFFBQWlCLFNBQVMsSUFBaUI7QUFDdEQsU0FBSyxVQUFVO0FBQ2YsU0FBSyxTQUFTO0FBQ2QsU0FBSyxTQUFTO0FBQ2QsVUFBTSxjQUEyQixDQUFBO0FBQ2pDLFdBQU8sQ0FBQyxLQUFLLE9BQU87QUFDbEIsa0JBQVksS0FBSyxLQUFLLFlBQVk7QUFBQSxJQUNwQztBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxTQUFTLE9BQTZCO0FBQzVDLGVBQVcsUUFBUSxPQUFPO0FBQ3hCLFVBQUksS0FBSyxNQUFNLElBQUksR0FBRztBQUNwQixhQUFLLFFBQUE7QUFDTCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsVUFBaUI7QUFDdkIsUUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLFdBQUs7QUFBQSxJQUNQO0FBQ0EsV0FBTyxLQUFLLFNBQUE7QUFBQSxFQUNkO0FBQUEsRUFFUSxPQUFjO0FBQ3BCLFdBQU8sS0FBSyxPQUFPLEtBQUssT0FBTztBQUFBLEVBQ2pDO0FBQUEsRUFFUSxXQUFrQjtBQUN4QixXQUFPLEtBQUssT0FBTyxLQUFLLFVBQVUsQ0FBQztBQUFBLEVBQ3JDO0FBQUEsRUFFUSxNQUFNLE1BQTBCO0FBQ3RDLFdBQU8sS0FBSyxPQUFPLFNBQVM7QUFBQSxFQUM5QjtBQUFBLEVBRVEsTUFBZTtBQUNyQixXQUFPLEtBQUssTUFBTSxVQUFVLEdBQUc7QUFBQSxFQUNqQztBQUFBLEVBRVEsUUFBUSxNQUFpQixTQUF3QjtBQUN2RCxRQUFJLEtBQUssTUFBTSxJQUFJLEdBQUc7QUFDcEIsYUFBTyxLQUFLLFFBQUE7QUFBQSxJQUNkO0FBRUEsV0FBTyxLQUFLO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxLQUFLLEtBQUE7QUFBQSxNQUNMLEVBQUUsU0FBa0IsT0FBTyxLQUFLLEtBQUEsRUFBTyxPQUFBO0FBQUEsSUFBTztBQUFBLEVBRWxEO0FBQUEsRUFFUSxNQUFNLE1BQXNCLE9BQWMsT0FBWSxDQUFBLEdBQVM7QUFDckUsVUFBTSxJQUFJLFlBQVksTUFBTSxNQUFNLEVBQUUsTUFBTSxNQUFNLE1BQU0sS0FBSyxNQUFNLEtBQUssUUFBUSxLQUFLLFFBQVE7QUFBQSxFQUM3RjtBQUFBLEVBRVEsY0FBb0I7QUFDMUIsT0FBRztBQUNELFVBQUksS0FBSyxNQUFNLFVBQVUsU0FBUyxLQUFLLEtBQUssTUFBTSxVQUFVLFVBQVUsR0FBRztBQUN2RSxhQUFLLFFBQUE7QUFDTDtBQUFBLE1BQ0Y7QUFDQSxXQUFLLFFBQUE7QUFBQSxJQUNQLFNBQVMsQ0FBQyxLQUFLLElBQUE7QUFBQSxFQUNqQjtBQUFBLEVBRU8sUUFBUSxRQUE0QjtBQUN6QyxTQUFLLFVBQVU7QUFDZixTQUFLLFNBQVM7QUFFZCxVQUFNLE9BQU8sS0FBSztBQUFBLE1BQ2hCLFVBQVU7QUFBQSxNQUNWO0FBQUEsSUFBQTtBQUdGLFFBQUksTUFBYTtBQUNqQixRQUFJLEtBQUssTUFBTSxVQUFVLElBQUksR0FBRztBQUM5QixZQUFNLEtBQUs7QUFBQSxRQUNULFVBQVU7QUFBQSxRQUNWO0FBQUEsTUFBQTtBQUFBLElBRUo7QUFFQSxTQUFLO0FBQUEsTUFDSCxVQUFVO0FBQUEsTUFDVjtBQUFBLElBQUE7QUFFRixVQUFNLFdBQVcsS0FBSyxXQUFBO0FBRXRCLFdBQU8sSUFBSUMsS0FBVSxNQUFNLEtBQUssVUFBVSxLQUFLLElBQUk7QUFBQSxFQUNyRDtBQUFBLEVBRVEsYUFBd0I7QUFDOUIsVUFBTSxhQUF3QixLQUFLLFdBQUE7QUFDbkMsUUFBSSxLQUFLLE1BQU0sVUFBVSxTQUFTLEdBQUc7QUFHbkMsYUFBTyxLQUFLLE1BQU0sVUFBVSxTQUFTLEdBQUc7QUFBQSxNQUEyQjtBQUFBLElBQ3JFO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLGFBQXdCO0FBQzlCLFVBQU0sT0FBa0IsS0FBSyxTQUFBO0FBQzdCLFFBQ0UsS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLElBQUEsR0FFWjtBQUNBLFlBQU0sV0FBa0IsS0FBSyxTQUFBO0FBQzdCLFVBQUksUUFBbUIsS0FBSyxXQUFBO0FBQzVCLFVBQUksZ0JBQWdCQyxVQUFlO0FBQ2pDLGNBQU0sT0FBYyxLQUFLO0FBQ3pCLFlBQUksU0FBUyxTQUFTLFVBQVUsT0FBTztBQUNyQyxrQkFBUSxJQUFJQztBQUFBQSxZQUNWLElBQUlELFNBQWMsTUFBTSxLQUFLLElBQUk7QUFBQSxZQUNqQztBQUFBLFlBQ0E7QUFBQSxZQUNBLFNBQVM7QUFBQSxVQUFBO0FBQUEsUUFFYjtBQUNBLGVBQU8sSUFBSUUsT0FBWSxNQUFNLE9BQU8sS0FBSyxJQUFJO0FBQUEsTUFDL0MsV0FBVyxnQkFBZ0JDLEtBQVU7QUFDbkMsWUFBSSxTQUFTLFNBQVMsVUFBVSxPQUFPO0FBQ3JDLGtCQUFRLElBQUlGO0FBQUFBLFlBQ1YsSUFBSUUsSUFBUyxLQUFLLFFBQVEsS0FBSyxLQUFLLEtBQUssTUFBTSxLQUFLLElBQUk7QUFBQSxZQUN4RDtBQUFBLFlBQ0E7QUFBQSxZQUNBLFNBQVM7QUFBQSxVQUFBO0FBQUEsUUFFYjtBQUNBLGVBQU8sSUFBSUMsTUFBUyxLQUFLLFFBQVEsS0FBSyxLQUFLLE9BQU8sS0FBSyxJQUFJO0FBQUEsTUFDN0Q7QUFDQSxXQUFLLE1BQU0sV0FBVyxnQkFBZ0IsUUFBUTtBQUFBLElBQ2hEO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLFdBQXNCO0FBQzVCLFFBQUksT0FBTyxLQUFLLFFBQUE7QUFDaEIsV0FBTyxLQUFLLE1BQU0sVUFBVSxRQUFRLEdBQUc7QUFDckMsWUFBTSxRQUFRLEtBQUssUUFBQTtBQUNuQixhQUFPLElBQUlDLFNBQWMsTUFBTSxPQUFPLEtBQUssSUFBSTtBQUFBLElBQ2pEO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLFVBQXFCO0FBQzNCLFVBQU0sT0FBTyxLQUFLLGVBQUE7QUFDbEIsUUFBSSxLQUFLLE1BQU0sVUFBVSxRQUFRLEdBQUc7QUFDbEMsWUFBTSxXQUFzQixLQUFLLFFBQUE7QUFDakMsV0FBSyxRQUFRLFVBQVUsT0FBTyx5Q0FBeUM7QUFDdkUsWUFBTSxXQUFzQixLQUFLLFFBQUE7QUFDakMsYUFBTyxJQUFJQyxRQUFhLE1BQU0sVUFBVSxVQUFVLEtBQUssSUFBSTtBQUFBLElBQzdEO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLGlCQUE0QjtBQUNsQyxVQUFNLE9BQU8sS0FBSyxVQUFBO0FBQ2xCLFFBQUksS0FBSyxNQUFNLFVBQVUsZ0JBQWdCLEdBQUc7QUFDMUMsWUFBTSxZQUF1QixLQUFLLGVBQUE7QUFDbEMsYUFBTyxJQUFJQyxlQUFvQixNQUFNLFdBQVcsS0FBSyxJQUFJO0FBQUEsSUFDM0Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsWUFBdUI7QUFDN0IsUUFBSSxPQUFPLEtBQUssV0FBQTtBQUNoQixXQUFPLEtBQUssTUFBTSxVQUFVLEVBQUUsR0FBRztBQUMvQixZQUFNLFdBQWtCLEtBQUssU0FBQTtBQUM3QixZQUFNLFFBQW1CLEtBQUssV0FBQTtBQUM5QixhQUFPLElBQUlDLFFBQWEsTUFBTSxVQUFVLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDOUQ7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsYUFBd0I7QUFDOUIsUUFBSSxPQUFPLEtBQUssU0FBQTtBQUNoQixXQUFPLEtBQUssTUFBTSxVQUFVLEdBQUcsR0FBRztBQUNoQyxZQUFNLFdBQWtCLEtBQUssU0FBQTtBQUM3QixZQUFNLFFBQW1CLEtBQUssU0FBQTtBQUM5QixhQUFPLElBQUlBLFFBQWEsTUFBTSxVQUFVLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDOUQ7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsV0FBc0I7QUFDNUIsUUFBSSxPQUFrQixLQUFLLE1BQUE7QUFDM0IsV0FDRSxLQUFLO0FBQUEsTUFDSCxVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsSUFBQSxHQUVaO0FBQ0EsWUFBTSxXQUFrQixLQUFLLFNBQUE7QUFDN0IsWUFBTSxRQUFtQixLQUFLLE1BQUE7QUFDOUIsYUFBTyxJQUFJUCxPQUFZLE1BQU0sVUFBVSxPQUFPLFNBQVMsSUFBSTtBQUFBLElBQzdEO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLFFBQW1CO0FBQ3pCLFFBQUksT0FBa0IsS0FBSyxTQUFBO0FBQzNCLFdBQU8sS0FBSyxNQUFNLFVBQVUsV0FBVyxVQUFVLFVBQVUsR0FBRztBQUM1RCxZQUFNLFdBQWtCLEtBQUssU0FBQTtBQUM3QixZQUFNLFFBQW1CLEtBQUssU0FBQTtBQUM5QixhQUFPLElBQUlBLE9BQVksTUFBTSxVQUFVLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDN0Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsV0FBc0I7QUFDNUIsUUFBSSxPQUFrQixLQUFLLFFBQUE7QUFDM0IsV0FBTyxLQUFLLE1BQU0sVUFBVSxPQUFPLFVBQVUsSUFBSSxHQUFHO0FBQ2xELFlBQU0sV0FBa0IsS0FBSyxTQUFBO0FBQzdCLFlBQU0sUUFBbUIsS0FBSyxRQUFBO0FBQzlCLGFBQU8sSUFBSUEsT0FBWSxNQUFNLFVBQVUsT0FBTyxTQUFTLElBQUk7QUFBQSxJQUM3RDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxVQUFxQjtBQUMzQixRQUFJLE9BQWtCLEtBQUssZUFBQTtBQUMzQixXQUFPLEtBQUssTUFBTSxVQUFVLE9BQU8sR0FBRztBQUNwQyxZQUFNLFdBQWtCLEtBQUssU0FBQTtBQUM3QixZQUFNLFFBQW1CLEtBQUssZUFBQTtBQUM5QixhQUFPLElBQUlBLE9BQVksTUFBTSxVQUFVLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDN0Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsaUJBQTRCO0FBQ2xDLFFBQUksT0FBa0IsS0FBSyxPQUFBO0FBQzNCLFdBQU8sS0FBSyxNQUFNLFVBQVUsT0FBTyxVQUFVLElBQUksR0FBRztBQUNsRCxZQUFNLFdBQWtCLEtBQUssU0FBQTtBQUM3QixZQUFNLFFBQW1CLEtBQUssT0FBQTtBQUM5QixhQUFPLElBQUlBLE9BQVksTUFBTSxVQUFVLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDN0Q7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsU0FBb0I7QUFDMUIsUUFBSSxLQUFLLE1BQU0sVUFBVSxNQUFNLEdBQUc7QUFDaEMsWUFBTSxXQUFrQixLQUFLLFNBQUE7QUFDN0IsWUFBTSxRQUFtQixLQUFLLE9BQUE7QUFDOUIsYUFBTyxJQUFJUSxPQUFZLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDN0M7QUFDQSxXQUFPLEtBQUssTUFBQTtBQUFBLEVBQ2Q7QUFBQSxFQUVRLFFBQW1CO0FBQ3pCLFFBQ0UsS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsVUFBVTtBQUFBLElBQUEsR0FFWjtBQUNBLFlBQU0sV0FBa0IsS0FBSyxTQUFBO0FBQzdCLFlBQU0sUUFBbUIsS0FBSyxNQUFBO0FBQzlCLGFBQU8sSUFBSUMsTUFBVyxVQUFVLE9BQU8sU0FBUyxJQUFJO0FBQUEsSUFDdEQ7QUFDQSxXQUFPLEtBQUssV0FBQTtBQUFBLEVBQ2Q7QUFBQSxFQUVRLGFBQXdCO0FBQzlCLFFBQUksS0FBSyxNQUFNLFVBQVUsR0FBRyxHQUFHO0FBQzdCLFlBQU0sVUFBVSxLQUFLLFNBQUE7QUFDckIsWUFBTSxZQUF1QixLQUFLLEtBQUE7QUFDbEMsVUFBSSxxQkFBcUJDLE1BQVc7QUFDbEMsZUFBTyxJQUFJQyxJQUFTLFVBQVUsUUFBUSxVQUFVLE1BQU0sUUFBUSxJQUFJO0FBQUEsTUFDcEU7QUFDQSxhQUFPLElBQUlBLElBQVMsV0FBVyxDQUFBLEdBQUksUUFBUSxJQUFJO0FBQUEsSUFDakQ7QUFDQSxXQUFPLEtBQUssUUFBQTtBQUFBLEVBQ2Q7QUFBQSxFQUVRLFVBQXFCO0FBQzNCLFVBQU0sT0FBTyxLQUFLLEtBQUE7QUFDbEIsUUFBSSxLQUFLLE1BQU0sVUFBVSxRQUFRLEdBQUc7QUFDbEMsYUFBTyxJQUFJQyxRQUFhLE1BQU0sR0FBRyxLQUFLLElBQUk7QUFBQSxJQUM1QztBQUNBLFFBQUksS0FBSyxNQUFNLFVBQVUsVUFBVSxHQUFHO0FBQ3BDLGFBQU8sSUFBSUEsUUFBYSxNQUFNLElBQUksS0FBSyxJQUFJO0FBQUEsSUFDN0M7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsT0FBa0I7QUFDeEIsUUFBSSxPQUFrQixLQUFLLFFBQUE7QUFDM0IsUUFBSTtBQUNKLE9BQUc7QUFDRCxpQkFBVztBQUNYLFVBQUksS0FBSyxNQUFNLFVBQVUsU0FBUyxHQUFHO0FBQ25DLG1CQUFXO0FBQ1gsV0FBRztBQUNELGlCQUFPLEtBQUssV0FBVyxNQUFNLEtBQUssU0FBQSxHQUFZLEtBQUs7QUFBQSxRQUNyRCxTQUFTLEtBQUssTUFBTSxVQUFVLFNBQVM7QUFBQSxNQUN6QztBQUNBLFVBQUksS0FBSyxNQUFNLFVBQVUsS0FBSyxVQUFVLFdBQVcsR0FBRztBQUNwRCxtQkFBVztBQUNYLGNBQU0sV0FBVyxLQUFLLFNBQUE7QUFDdEIsWUFBSSxTQUFTLFNBQVMsVUFBVSxlQUFlLEtBQUssTUFBTSxVQUFVLFdBQVcsR0FBRztBQUNoRixpQkFBTyxLQUFLLFdBQVcsTUFBTSxRQUFRO0FBQUEsUUFDdkMsV0FBVyxTQUFTLFNBQVMsVUFBVSxlQUFlLEtBQUssTUFBTSxVQUFVLFNBQVMsR0FBRztBQUNyRixpQkFBTyxLQUFLLFdBQVcsTUFBTSxLQUFLLFNBQUEsR0FBWSxJQUFJO0FBQUEsUUFDcEQsT0FBTztBQUNMLGlCQUFPLEtBQUssT0FBTyxNQUFNLFFBQVE7QUFBQSxRQUNuQztBQUFBLE1BQ0Y7QUFDQSxVQUFJLEtBQUssTUFBTSxVQUFVLFdBQVcsR0FBRztBQUNyQyxtQkFBVztBQUNYLGVBQU8sS0FBSyxXQUFXLE1BQU0sS0FBSyxVQUFVO0FBQUEsTUFDOUM7QUFBQSxJQUNGLFNBQVM7QUFDVCxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsUUFBUSxRQUEyQjtBTjNWdEM7QU00VkgsWUFBTyxVQUFLLE9BQU8sS0FBSyxVQUFVLE1BQU0sTUFBakMsbUJBQW9DO0FBQUEsRUFDN0M7QUFBQSxFQUVRLGdCQUF5QjtBTi9WNUI7QU1nV0gsUUFBSSxJQUFJLEtBQUssVUFBVTtBQUN2QixVQUFJLFVBQUssT0FBTyxDQUFDLE1BQWIsbUJBQWdCLFVBQVMsVUFBVSxZQUFZO0FBQ2pELGVBQU8sVUFBSyxPQUFPLElBQUksQ0FBQyxNQUFqQixtQkFBb0IsVUFBUyxVQUFVO0FBQUEsSUFDaEQ7QUFDQSxXQUFPLElBQUksS0FBSyxPQUFPLFFBQVE7QUFDN0IsWUFBSSxVQUFLLE9BQU8sQ0FBQyxNQUFiLG1CQUFnQixVQUFTLFVBQVUsV0FBWSxRQUFPO0FBQzFEO0FBQ0EsWUFBSSxVQUFLLE9BQU8sQ0FBQyxNQUFiLG1CQUFnQixVQUFTLFVBQVUsWUFBWTtBQUNqRCxpQkFBTyxVQUFLLE9BQU8sSUFBSSxDQUFDLE1BQWpCLG1CQUFvQixVQUFTLFVBQVU7QUFBQSxNQUNoRDtBQUNBLFlBQUksVUFBSyxPQUFPLENBQUMsTUFBYixtQkFBZ0IsVUFBUyxVQUFVLE1BQU8sUUFBTztBQUNyRDtBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsV0FBVyxRQUFtQixPQUFjLFVBQThCO0FBQ2hGLFVBQU0sT0FBb0IsQ0FBQTtBQUMxQixRQUFJLENBQUMsS0FBSyxNQUFNLFVBQVUsVUFBVSxHQUFHO0FBQ3JDLFNBQUc7QUFDRCxZQUFJLEtBQUssTUFBTSxVQUFVLFNBQVMsR0FBRztBQUNuQyxlQUFLLEtBQUssSUFBSUMsT0FBWSxLQUFLLFdBQUEsR0FBYyxLQUFLLFdBQVcsSUFBSSxDQUFDO0FBQUEsUUFDcEUsT0FBTztBQUNMLGVBQUssS0FBSyxLQUFLLFlBQVk7QUFBQSxRQUM3QjtBQUFBLE1BQ0YsU0FBUyxLQUFLLE1BQU0sVUFBVSxLQUFLO0FBQUEsSUFDckM7QUFDQSxVQUFNLGFBQWEsS0FBSyxRQUFRLFVBQVUsWUFBWSw4QkFBOEI7QUFDcEYsV0FBTyxJQUFJSCxLQUFVLFFBQVEsWUFBWSxNQUFNLFdBQVcsTUFBTSxRQUFRO0FBQUEsRUFDMUU7QUFBQSxFQUVRLE9BQU8sTUFBaUIsVUFBNEI7QUFDMUQsVUFBTSxPQUFjLEtBQUs7QUFBQSxNQUN2QixVQUFVO0FBQUEsTUFDVjtBQUFBLElBQUE7QUFFRixVQUFNLE1BQWdCLElBQUlJLElBQVMsTUFBTSxLQUFLLElBQUk7QUFDbEQsV0FBTyxJQUFJWixJQUFTLE1BQU0sS0FBSyxTQUFTLE1BQU0sS0FBSyxJQUFJO0FBQUEsRUFDekQ7QUFBQSxFQUVRLFdBQVcsTUFBaUIsVUFBNEI7QUFDOUQsUUFBSSxNQUFpQjtBQUVyQixRQUFJLENBQUMsS0FBSyxNQUFNLFVBQVUsWUFBWSxHQUFHO0FBQ3ZDLFlBQU0sS0FBSyxXQUFBO0FBQUEsSUFDYjtBQUVBLFNBQUssUUFBUSxVQUFVLGNBQWMsNkJBQTZCO0FBQ2xFLFdBQU8sSUFBSUEsSUFBUyxNQUFNLEtBQUssU0FBUyxNQUFNLFNBQVMsSUFBSTtBQUFBLEVBQzdEO0FBQUEsRUFFUSxVQUFxQjtBQUMzQixRQUFJLEtBQUssTUFBTSxVQUFVLEtBQUssR0FBRztBQUMvQixhQUFPLElBQUlhLFFBQWEsT0FBTyxLQUFLLFNBQUEsRUFBVyxJQUFJO0FBQUEsSUFDckQ7QUFDQSxRQUFJLEtBQUssTUFBTSxVQUFVLElBQUksR0FBRztBQUM5QixhQUFPLElBQUlBLFFBQWEsTUFBTSxLQUFLLFNBQUEsRUFBVyxJQUFJO0FBQUEsSUFDcEQ7QUFDQSxRQUFJLEtBQUssTUFBTSxVQUFVLElBQUksR0FBRztBQUM5QixhQUFPLElBQUlBLFFBQWEsTUFBTSxLQUFLLFNBQUEsRUFBVyxJQUFJO0FBQUEsSUFDcEQ7QUFDQSxRQUFJLEtBQUssTUFBTSxVQUFVLFNBQVMsR0FBRztBQUNuQyxhQUFPLElBQUlBLFFBQWEsUUFBVyxLQUFLLFNBQUEsRUFBVyxJQUFJO0FBQUEsSUFDekQ7QUFDQSxRQUFJLEtBQUssTUFBTSxVQUFVLE1BQU0sS0FBSyxLQUFLLE1BQU0sVUFBVSxNQUFNLEdBQUc7QUFDaEUsYUFBTyxJQUFJQSxRQUFhLEtBQUssU0FBQSxFQUFXLFNBQVMsS0FBSyxTQUFBLEVBQVcsSUFBSTtBQUFBLElBQ3ZFO0FBQ0EsUUFBSSxLQUFLLE1BQU0sVUFBVSxRQUFRLEdBQUc7QUFDbEMsYUFBTyxJQUFJQyxTQUFjLEtBQUssU0FBQSxFQUFXLFNBQVMsS0FBSyxTQUFBLEVBQVcsSUFBSTtBQUFBLElBQ3hFO0FBQ0EsUUFBSSxLQUFLLE1BQU0sVUFBVSxVQUFVLEtBQUssS0FBSyxRQUFRLENBQUMsTUFBTSxVQUFVLE9BQU87QUFDM0UsWUFBTSxRQUFRLEtBQUssUUFBQTtBQUNuQixXQUFLLFFBQUE7QUFDTCxZQUFNLE9BQU8sS0FBSyxXQUFBO0FBQ2xCLGFBQU8sSUFBSUMsY0FBbUIsQ0FBQyxLQUFLLEdBQUcsTUFBTSxNQUFNLElBQUk7QUFBQSxJQUN6RDtBQUNBLFFBQUksS0FBSyxNQUFNLFVBQVUsVUFBVSxHQUFHO0FBQ3BDLFlBQU0sYUFBYSxLQUFLLFNBQUE7QUFDeEIsYUFBTyxJQUFJbEIsU0FBYyxZQUFZLFdBQVcsSUFBSTtBQUFBLElBQ3REO0FBQ0EsUUFBSSxLQUFLLE1BQU0sVUFBVSxTQUFTLEtBQUssS0FBSyxpQkFBaUI7QUFDM0QsV0FBSyxRQUFBO0FBQ0wsWUFBTSxTQUFrQixDQUFBO0FBQ3hCLFVBQUksQ0FBQyxLQUFLLE1BQU0sVUFBVSxVQUFVLEdBQUc7QUFDckMsV0FBRztBQUNELGlCQUFPLEtBQUssS0FBSyxRQUFRLFVBQVUsWUFBWSx5QkFBeUIsQ0FBQztBQUFBLFFBQzNFLFNBQVMsS0FBSyxNQUFNLFVBQVUsS0FBSztBQUFBLE1BQ3JDO0FBQ0EsV0FBSyxRQUFRLFVBQVUsWUFBWSxjQUFjO0FBQ2pELFdBQUssUUFBUSxVQUFVLE9BQU8sZUFBZTtBQUM3QyxZQUFNLE9BQU8sS0FBSyxXQUFBO0FBQ2xCLGFBQU8sSUFBSWtCLGNBQW1CLFFBQVEsTUFBTSxLQUFLLFNBQUEsRUFBVyxJQUFJO0FBQUEsSUFDbEU7QUFDQSxRQUFJLEtBQUssTUFBTSxVQUFVLFNBQVMsR0FBRztBQUNuQyxZQUFNLE9BQWtCLEtBQUssV0FBQTtBQUM3QixXQUFLLFFBQVEsVUFBVSxZQUFZLCtCQUErQjtBQUNsRSxhQUFPLElBQUlDLFNBQWMsTUFBTSxLQUFLLElBQUk7QUFBQSxJQUMxQztBQUNBLFFBQUksS0FBSyxNQUFNLFVBQVUsU0FBUyxHQUFHO0FBQ25DLGFBQU8sS0FBSyxXQUFBO0FBQUEsSUFDZDtBQUNBLFFBQUksS0FBSyxNQUFNLFVBQVUsV0FBVyxHQUFHO0FBQ3JDLGFBQU8sS0FBSyxLQUFBO0FBQUEsSUFDZDtBQUNBLFFBQUksS0FBSyxNQUFNLFVBQVUsSUFBSSxHQUFHO0FBQzlCLFlBQU0sT0FBa0IsS0FBSyxXQUFBO0FBQzdCLGFBQU8sSUFBSUMsS0FBVSxNQUFNLEtBQUssU0FBQSxFQUFXLElBQUk7QUFBQSxJQUNqRDtBQUNBLFFBQUksS0FBSyxNQUFNLFVBQVUsS0FBSyxHQUFHO0FBQy9CLFlBQU0sT0FBa0IsS0FBSyxXQUFBO0FBQzdCLGFBQU8sSUFBSUMsTUFBVyxNQUFNLEtBQUssU0FBQSxFQUFXLElBQUk7QUFBQSxJQUNsRDtBQUVBLFVBQU0sS0FBSztBQUFBLE1BQ1QsV0FBVztBQUFBLE1BQ1gsS0FBSyxLQUFBO0FBQUEsTUFDTCxFQUFFLE9BQU8sS0FBSyxLQUFBLEVBQU8sT0FBQTtBQUFBLElBQU87QUFBQSxFQUloQztBQUFBLEVBRU8sYUFBd0I7QUFDN0IsVUFBTSxZQUFZLEtBQUssU0FBQTtBQUN2QixRQUFJLEtBQUssTUFBTSxVQUFVLFVBQVUsR0FBRztBQUNwQyxhQUFPLElBQUlDLFdBQWdCLENBQUEsR0FBSSxLQUFLLFNBQUEsRUFBVyxJQUFJO0FBQUEsSUFDckQ7QUFDQSxVQUFNLGFBQTBCLENBQUE7QUFDaEMsT0FBRztBQUNELFVBQUksS0FBSyxNQUFNLFVBQVUsU0FBUyxHQUFHO0FBQ25DLG1CQUFXLEtBQUssSUFBSVIsT0FBWSxLQUFLLFdBQUEsR0FBYyxLQUFLLFdBQVcsSUFBSSxDQUFDO0FBQUEsTUFDMUUsV0FDRSxLQUFLLE1BQU0sVUFBVSxRQUFRLFVBQVUsWUFBWSxVQUFVLE1BQU0sR0FDbkU7QUFDQSxjQUFNLE1BQWEsS0FBSyxTQUFBO0FBQ3hCLFlBQUksS0FBSyxNQUFNLFVBQVUsS0FBSyxHQUFHO0FBQy9CLGdCQUFNLFFBQVEsS0FBSyxXQUFBO0FBQ25CLHFCQUFXO0FBQUEsWUFDVCxJQUFJVixNQUFTLE1BQU0sSUFBSVcsSUFBUyxLQUFLLElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxJQUFJO0FBQUEsVUFBQTtBQUFBLFFBRW5FLE9BQU87QUFDTCxnQkFBTSxRQUFRLElBQUlmLFNBQWMsS0FBSyxJQUFJLElBQUk7QUFDN0MscUJBQVc7QUFBQSxZQUNULElBQUlJLE1BQVMsTUFBTSxJQUFJVyxJQUFTLEtBQUssSUFBSSxJQUFJLEdBQUcsT0FBTyxJQUFJLElBQUk7QUFBQSxVQUFBO0FBQUEsUUFFbkU7QUFBQSxNQUNGLE9BQU87QUFDTCxhQUFLO0FBQUEsVUFDSCxXQUFXO0FBQUEsVUFDWCxLQUFLLEtBQUE7QUFBQSxVQUNMLEVBQUUsT0FBTyxLQUFLLEtBQUEsRUFBTyxPQUFBO0FBQUEsUUFBTztBQUFBLE1BRWhDO0FBQUEsSUFDRixTQUFTLEtBQUssTUFBTSxVQUFVLEtBQUs7QUFDbkMsU0FBSyxRQUFRLFVBQVUsWUFBWSxtQ0FBbUM7QUFFdEUsV0FBTyxJQUFJTyxXQUFnQixZQUFZLFVBQVUsSUFBSTtBQUFBLEVBQ3ZEO0FBQUEsRUFFUSxPQUFrQjtBQUN4QixVQUFNLFNBQXNCLENBQUE7QUFDNUIsVUFBTSxjQUFjLEtBQUssU0FBQTtBQUV6QixRQUFJLEtBQUssTUFBTSxVQUFVLFlBQVksR0FBRztBQUN0QyxhQUFPLElBQUlDLEtBQVUsQ0FBQSxHQUFJLEtBQUssU0FBQSxFQUFXLElBQUk7QUFBQSxJQUMvQztBQUNBLE9BQUc7QUFDRCxVQUFJLEtBQUssTUFBTSxVQUFVLFNBQVMsR0FBRztBQUNuQyxlQUFPLEtBQUssSUFBSVQsT0FBWSxLQUFLLFdBQUEsR0FBYyxLQUFLLFdBQVcsSUFBSSxDQUFDO0FBQUEsTUFDdEUsT0FBTztBQUNMLGVBQU8sS0FBSyxLQUFLLFlBQVk7QUFBQSxNQUMvQjtBQUFBLElBQ0YsU0FBUyxLQUFLLE1BQU0sVUFBVSxLQUFLO0FBRW5DLFNBQUs7QUFBQSxNQUNILFVBQVU7QUFBQSxNQUNWO0FBQUEsSUFBQTtBQUVGLFdBQU8sSUFBSVMsS0FBVSxRQUFRLFlBQVksSUFBSTtBQUFBLEVBQy9DO0FBQ0Y7QUNsaEJPLFNBQVMsUUFBUSxNQUF1QjtBQUM3QyxTQUFPLFFBQVEsT0FBTyxRQUFRO0FBQ2hDO0FBRU8sU0FBUyxRQUFRLE1BQXVCO0FBQzdDLFNBQ0csUUFBUSxPQUFPLFFBQVEsT0FBUyxRQUFRLE9BQU8sUUFBUSxPQUFRLFNBQVMsT0FBTyxTQUFTO0FBRTdGO0FBRU8sU0FBUyxlQUFlLE1BQXVCO0FBQ3BELFNBQU8sUUFBUSxJQUFJLEtBQUssUUFBUSxJQUFJO0FBQ3RDO0FBRU8sU0FBUyxXQUFXLE1BQXNCO0FBQy9DLFNBQU8sS0FBSyxPQUFPLENBQUMsRUFBRSxnQkFBZ0IsS0FBSyxVQUFVLENBQUMsRUFBRSxZQUFBO0FBQzFEO0FBRU8sU0FBUyxVQUFVLE1BQXVDO0FBQy9ELFNBQU8sVUFBVSxJQUFJLEtBQUssVUFBVTtBQUN0QztBQ2xCTyxNQUFNLFFBQVE7QUFBQSxFQWNaLEtBQUssUUFBeUI7QUFDbkMsU0FBSyxTQUFTO0FBQ2QsU0FBSyxTQUFTLENBQUE7QUFDZCxTQUFLLFVBQVU7QUFDZixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFDWixTQUFLLE1BQU07QUFFWCxXQUFPLENBQUMsS0FBSyxPQUFPO0FBQ2xCLFdBQUssUUFBUSxLQUFLO0FBQ2xCLFdBQUssU0FBQTtBQUFBLElBQ1A7QUFDQSxTQUFLLE9BQU8sS0FBSyxJQUFJLE1BQU0sVUFBVSxLQUFLLElBQUksTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQUVRLE1BQWU7QUFDckIsV0FBTyxLQUFLLFdBQVcsS0FBSyxPQUFPO0FBQUEsRUFDckM7QUFBQSxFQUVRLFVBQWtCO0FBQ3hCLFFBQUksS0FBSyxLQUFBLE1BQVcsTUFBTTtBQUN4QixXQUFLO0FBQ0wsV0FBSyxNQUFNO0FBQUEsSUFDYjtBQUNBLFNBQUs7QUFDTCxTQUFLO0FBQ0wsV0FBTyxLQUFLLE9BQU8sT0FBTyxLQUFLLFVBQVUsQ0FBQztBQUFBLEVBQzVDO0FBQUEsRUFFUSxTQUFTLFdBQXNCLFNBQW9CO0FBQ3pELFVBQU0sT0FBTyxLQUFLLE9BQU8sVUFBVSxLQUFLLE9BQU8sS0FBSyxPQUFPO0FBQzNELFNBQUssT0FBTyxLQUFLLElBQUksTUFBTSxXQUFXLE1BQU0sU0FBUyxLQUFLLE1BQU0sS0FBSyxHQUFHLENBQUM7QUFBQSxFQUMzRTtBQUFBLEVBRVEsTUFBTSxVQUEyQjtBQUN2QyxRQUFJLEtBQUssT0FBTztBQUNkLGFBQU87QUFBQSxJQUNUO0FBRUEsUUFBSSxLQUFLLE9BQU8sT0FBTyxLQUFLLE9BQU8sTUFBTSxVQUFVO0FBQ2pELGFBQU87QUFBQSxJQUNUO0FBRUEsU0FBSztBQUNMLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxPQUFlO0FBQ3JCLFFBQUksS0FBSyxPQUFPO0FBQ2QsYUFBTztBQUFBLElBQ1Q7QUFDQSxXQUFPLEtBQUssT0FBTyxPQUFPLEtBQUssT0FBTztBQUFBLEVBQ3hDO0FBQUEsRUFFUSxXQUFtQjtBQUN6QixRQUFJLEtBQUssVUFBVSxLQUFLLEtBQUssT0FBTyxRQUFRO0FBQzFDLGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTyxLQUFLLE9BQU8sT0FBTyxLQUFLLFVBQVUsQ0FBQztBQUFBLEVBQzVDO0FBQUEsRUFFUSxVQUFnQjtBQUN0QixXQUFPLEtBQUssS0FBQSxNQUFXLFFBQVEsQ0FBQyxLQUFLLE9BQU87QUFDMUMsV0FBSyxRQUFBO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUVRLG1CQUF5QjtBQUMvQixXQUFPLENBQUMsS0FBSyxJQUFBLEtBQVMsRUFBRSxLQUFLLFdBQVcsT0FBTyxLQUFLLFNBQUEsTUFBZSxNQUFNO0FBQ3ZFLFdBQUssUUFBQTtBQUFBLElBQ1A7QUFDQSxRQUFJLEtBQUssT0FBTztBQUNkLFdBQUssTUFBTSxXQUFXLG9CQUFvQjtBQUFBLElBQzVDLE9BQU87QUFFTCxXQUFLLFFBQUE7QUFDTCxXQUFLLFFBQUE7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBRVEsT0FBTyxPQUFxQjtBQUNsQyxXQUFPLEtBQUssS0FBQSxNQUFXLFNBQVMsQ0FBQyxLQUFLLE9BQU87QUFDM0MsV0FBSyxRQUFBO0FBQUEsSUFDUDtBQUdBLFFBQUksS0FBSyxPQUFPO0FBQ2QsV0FBSyxNQUFNLFdBQVcscUJBQXFCLEVBQUUsT0FBYztBQUMzRDtBQUFBLElBQ0Y7QUFHQSxTQUFLLFFBQUE7QUFHTCxVQUFNLFFBQVEsS0FBSyxPQUFPLFVBQVUsS0FBSyxRQUFRLEdBQUcsS0FBSyxVQUFVLENBQUM7QUFDcEUsU0FBSyxTQUFTLFVBQVUsTUFBTSxVQUFVLFNBQVMsVUFBVSxVQUFVLEtBQUs7QUFBQSxFQUM1RTtBQUFBLEVBRVEsU0FBZTtBQUVyQixXQUFPQyxRQUFjLEtBQUssS0FBQSxDQUFNLEdBQUc7QUFDakMsV0FBSyxRQUFBO0FBQUEsSUFDUDtBQUdBLFFBQUksS0FBSyxXQUFXLE9BQU9BLFFBQWMsS0FBSyxTQUFBLENBQVUsR0FBRztBQUN6RCxXQUFLLFFBQUE7QUFBQSxJQUNQO0FBR0EsV0FBT0EsUUFBYyxLQUFLLEtBQUEsQ0FBTSxHQUFHO0FBQ2pDLFdBQUssUUFBQTtBQUFBLElBQ1A7QUFHQSxRQUFJLEtBQUssS0FBQSxFQUFPLFlBQUEsTUFBa0IsS0FBSztBQUNyQyxXQUFLLFFBQUE7QUFDTCxVQUFJLEtBQUssV0FBVyxPQUFPLEtBQUssS0FBQSxNQUFXLEtBQUs7QUFDOUMsYUFBSyxRQUFBO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFFQSxXQUFPQSxRQUFjLEtBQUssS0FBQSxDQUFNLEdBQUc7QUFDakMsV0FBSyxRQUFBO0FBQUEsSUFDUDtBQUVBLFVBQU0sUUFBUSxLQUFLLE9BQU8sVUFBVSxLQUFLLE9BQU8sS0FBSyxPQUFPO0FBQzVELFNBQUssU0FBUyxVQUFVLFFBQVEsT0FBTyxLQUFLLENBQUM7QUFBQSxFQUMvQztBQUFBLEVBRVEsYUFBbUI7QUFDekIsV0FBT0MsZUFBcUIsS0FBSyxLQUFBLENBQU0sR0FBRztBQUN4QyxXQUFLLFFBQUE7QUFBQSxJQUNQO0FBRUEsVUFBTSxRQUFRLEtBQUssT0FBTyxVQUFVLEtBQUssT0FBTyxLQUFLLE9BQU87QUFDNUQsVUFBTSxjQUFjQyxXQUFpQixLQUFLO0FBQzFDLFFBQUlDLFVBQWdCLFdBQVcsR0FBRztBQUNoQyxXQUFLLFNBQVMsVUFBVSxXQUFXLEdBQUcsS0FBSztBQUFBLElBQzdDLE9BQU87QUFDTCxXQUFLLFNBQVMsVUFBVSxZQUFZLEtBQUs7QUFBQSxJQUMzQztBQUFBLEVBQ0Y7QUFBQSxFQUVRLFdBQWlCO0FBQ3ZCLFVBQU0sT0FBTyxLQUFLLFFBQUE7QUFDbEIsWUFBUSxNQUFBO0FBQUEsTUFDTixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsWUFBWSxJQUFJO0FBQ3hDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsYUFBYSxJQUFJO0FBQ3pDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsY0FBYyxJQUFJO0FBQzFDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsWUFBWSxJQUFJO0FBQ3hDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ3ZDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsT0FBTyxJQUFJO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSyxTQUFTLFVBQVUsTUFBTSxJQUFJO0FBQ2xDO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFFBQVEsVUFBVTtBQUFBLFVBQzlDO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFlBQVksVUFBVTtBQUFBLFVBQ2xEO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLGVBQWUsVUFBVTtBQUFBLFVBQ3JEO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEtBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxXQUM1QixVQUFVO0FBQUEsVUFDVjtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxNQUFNLFVBQVU7QUFBQSxVQUM1QztBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxhQUM1QixLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsZUFBZSxVQUFVO0FBQUEsVUFDckQ7QUFBQSxRQUFBO0FBRUY7QUFBQSxNQUNGLEtBQUs7QUFDSCxhQUFLO0FBQUEsVUFDSCxLQUFLLE1BQU0sR0FBRyxJQUNWLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxpQkFBaUIsVUFBVSxZQUN2RCxVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQ1YsVUFBVSxtQkFDVixLQUFLLE1BQU0sR0FBRyxJQUNkLFVBQVUsY0FDVixVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksS0FBSyxNQUFNLEdBQUcsR0FBRztBQUNuQixlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsa0JBQWtCLFVBQVU7QUFBQSxZQUN4RDtBQUFBLFVBQUE7QUFFRjtBQUFBLFFBQ0Y7QUFDQSxhQUFLO0FBQUEsVUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsUUFBUSxVQUFVO0FBQUEsVUFDOUM7QUFBQSxRQUFBO0FBRUY7QUFBQSxNQUNGLEtBQUs7QUFDSCxhQUFLO0FBQUEsVUFDSCxLQUFLLE1BQU0sR0FBRyxJQUNWLFVBQVUsV0FDVixLQUFLLE1BQU0sR0FBRyxJQUNkLFVBQVUsWUFDVixVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILGFBQUs7QUFBQSxVQUNILEtBQUssTUFBTSxHQUFHLElBQ1YsVUFBVSxhQUNWLEtBQUssTUFBTSxHQUFHLElBQ2QsVUFBVSxhQUNWLFVBQVU7QUFBQSxVQUNkO0FBQUEsUUFBQTtBQUVGO0FBQUEsTUFDRixLQUFLO0FBQ0gsYUFBSztBQUFBLFVBQ0gsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLFlBQzVCLEtBQUssTUFBTSxHQUFHLElBQ1YsS0FBSyxNQUFNLEdBQUcsSUFDWixVQUFVLG1CQUNWLFVBQVUsWUFDWixVQUFVO0FBQUEsVUFDZDtBQUFBLFFBQUE7QUFFRjtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksS0FBSyxNQUFNLEdBQUcsR0FBRztBQUNuQixjQUFJLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDbkIsaUJBQUssU0FBUyxVQUFVLFdBQVcsSUFBSTtBQUFBLFVBQ3pDLE9BQU87QUFDTCxpQkFBSyxTQUFTLFVBQVUsUUFBUSxJQUFJO0FBQUEsVUFDdEM7QUFBQSxRQUNGLE9BQU87QUFDTCxlQUFLLFNBQVMsVUFBVSxLQUFLLElBQUk7QUFBQSxRQUNuQztBQUNBO0FBQUEsTUFDRixLQUFLO0FBQ0gsWUFBSSxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQ25CLGVBQUssUUFBQTtBQUFBLFFBQ1AsV0FBVyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQzFCLGVBQUssaUJBQUE7QUFBQSxRQUNQLE9BQU87QUFDTCxlQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsYUFBYSxVQUFVO0FBQUEsWUFDbkQ7QUFBQSxVQUFBO0FBQUEsUUFFSjtBQUNBO0FBQUEsTUFDRixLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQ0gsYUFBSyxPQUFPLElBQUk7QUFDaEI7QUFBQTtBQUFBLE1BRUYsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUNIO0FBQUE7QUFBQSxNQUVGO0FBQ0UsWUFBSUgsUUFBYyxJQUFJLEdBQUc7QUFDdkIsZUFBSyxPQUFBO0FBQUEsUUFDUCxXQUFXSSxRQUFjLElBQUksR0FBRztBQUM5QixlQUFLLFdBQUE7QUFBQSxRQUNQLE9BQU87QUFDTCxlQUFLLE1BQU0sV0FBVyxzQkFBc0IsRUFBRSxNQUFZO0FBQUEsUUFDNUQ7QUFDQTtBQUFBLElBQUE7QUFBQSxFQUVOO0FBQUEsRUFFUSxNQUFNLE1BQXNCLE9BQVksSUFBVTtBQUN4RCxVQUFNLElBQUksWUFBWSxNQUFNLE1BQU0sRUFBRSxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUssS0FBSyxRQUFRLEtBQUssUUFBUTtBQUFBLEVBQzNGO0FBQ0Y7QUMvVk8sTUFBTSxNQUFNO0FBQUEsRUFJakIsWUFBWSxRQUFnQixRQUE4QjtBQUN4RCxTQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2hDLFNBQUssU0FBUyxTQUFTLFNBQVMsQ0FBQTtBQUFBLEVBQ2xDO0FBQUEsRUFFTyxLQUFLLFFBQW9DO0FBQzlDLFNBQUssU0FBUyxTQUFTLFNBQVMsQ0FBQTtBQUFBLEVBQ2xDO0FBQUEsRUFFTyxJQUFJLE1BQWMsT0FBWTtBQUNuQyxTQUFLLE9BQU8sSUFBSSxJQUFJO0FBQUEsRUFDdEI7QUFBQSxFQUVPLElBQUksS0FBa0I7QVRqQnhCO0FTa0JILFFBQUksT0FBTyxLQUFLLE9BQU8sR0FBRyxNQUFNLGFBQWE7QUFDM0MsYUFBTyxLQUFLLE9BQU8sR0FBRztBQUFBLElBQ3hCO0FBRUEsVUFBTSxZQUFZLGdCQUFLLFdBQUwsbUJBQWEsZ0JBQWIsbUJBQWtDO0FBQ3BELFFBQUksWUFBWSxPQUFPLFNBQVMsR0FBRyxNQUFNLGFBQWE7QUFDcEQsYUFBTyxTQUFTLEdBQUc7QUFBQSxJQUNyQjtBQUVBLFFBQUksS0FBSyxXQUFXLE1BQU07QUFDeEIsYUFBTyxLQUFLLE9BQU8sSUFBSSxHQUFHO0FBQUEsSUFDNUI7QUFFQSxXQUFPLE9BQU8sR0FBMEI7QUFBQSxFQUMxQztBQUNGO0FDMUJPLE1BQU0sWUFBNkM7QUFBQSxFQUFuRCxjQUFBO0FBQ0wsU0FBTyxRQUFRLElBQUksTUFBQTtBQUNuQixTQUFRLFVBQVUsSUFBSSxRQUFBO0FBQ3RCLFNBQVEsU0FBUyxJQUFJQyxpQkFBQTtBQUFBLEVBQU87QUFBQSxFQUVyQixTQUFTLE1BQXNCO0FBQ3BDLFdBQVEsS0FBSyxTQUFTLEtBQUssT0FBTyxJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUVPLGtCQUFrQixNQUEwQjtBQUNqRCxVQUFNLFFBQVEsS0FBSyxTQUFTLEtBQUssSUFBSTtBQUVyQyxRQUFJLEtBQUssaUJBQWlCbEIsTUFBVztBQUNuQyxZQUFNLFNBQVMsS0FBSyxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQzlDLFlBQU0sT0FBTyxDQUFDLEtBQUs7QUFDbkIsaUJBQVcsT0FBTyxLQUFLLE1BQU0sTUFBTTtBQUNqQyxZQUFJLGVBQWVHLFFBQWE7QUFDOUIsZUFBSyxLQUFLLEdBQUcsS0FBSyxTQUFVLElBQW9CLEtBQUssQ0FBQztBQUFBLFFBQ3hELE9BQU87QUFDTCxlQUFLLEtBQUssS0FBSyxTQUFTLEdBQUcsQ0FBQztBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUNBLFVBQUksS0FBSyxNQUFNLGtCQUFrQlgsS0FBVTtBQUN6QyxlQUFPLE9BQU8sTUFBTSxLQUFLLE1BQU0sT0FBTyxPQUFPLFFBQVEsSUFBSTtBQUFBLE1BQzNEO0FBQ0EsYUFBTyxPQUFPLEdBQUcsSUFBSTtBQUFBLElBQ3ZCO0FBRUEsVUFBTSxLQUFLLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFDbkMsV0FBTyxHQUFHLEtBQUs7QUFBQSxFQUNqQjtBQUFBLEVBRU8sdUJBQXVCLE1BQStCO0FBQzNELFVBQU0sZ0JBQWdCLEtBQUs7QUFDM0IsV0FBTyxJQUFJLFNBQWdCO0FBQ3pCLFlBQU0sT0FBTyxLQUFLO0FBQ2xCLFdBQUssUUFBUSxJQUFJLE1BQU0sYUFBYTtBQUNwQyxlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssT0FBTyxRQUFRLEtBQUs7QUFDM0MsYUFBSyxNQUFNLElBQUksS0FBSyxPQUFPLENBQUMsRUFBRSxRQUFRLEtBQUssQ0FBQyxDQUFDO0FBQUEsTUFDL0M7QUFDQSxVQUFJO0FBQ0YsZUFBTyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBQUEsTUFDaEMsVUFBQTtBQUNFLGFBQUssUUFBUTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRU8sTUFBTSxNQUFzQixPQUFZLENBQUEsR0FBSSxNQUFlLEtBQW9CO0FBQ3BGLFVBQU0sSUFBSSxZQUFZLE1BQU0sTUFBTSxFQUFFLE1BQU0sS0FBSztBQUFBLEVBQ2pEO0FBQUEsRUFFTyxrQkFBa0IsTUFBMEI7QUFDakQsV0FBTyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssTUFBTTtBQUFBLEVBQ3hDO0FBQUEsRUFFTyxnQkFBZ0IsTUFBd0I7QUFDN0MsVUFBTSxRQUFRLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFDdEMsU0FBSyxNQUFNLElBQUksS0FBSyxLQUFLLFFBQVEsS0FBSztBQUN0QyxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRU8sYUFBYSxNQUFxQjtBQUN2QyxXQUFPLEtBQUssS0FBSztBQUFBLEVBQ25CO0FBQUEsRUFFTyxhQUFhLE1BQXFCO0FBQ3ZDLFVBQU0sU0FBUyxLQUFLLFNBQVMsS0FBSyxNQUFNO0FBQ3hDLFVBQU0sTUFBTSxLQUFLLFNBQVMsS0FBSyxHQUFHO0FBQ2xDLFFBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxVQUFVLGFBQWE7QUFDbEQsYUFBTztBQUFBLElBQ1Q7QUFDQSxXQUFPLE9BQU8sR0FBRztBQUFBLEVBQ25CO0FBQUEsRUFFTyxhQUFhLE1BQXFCO0FBQ3ZDLFVBQU0sU0FBUyxLQUFLLFNBQVMsS0FBSyxNQUFNO0FBQ3hDLFVBQU0sTUFBTSxLQUFLLFNBQVMsS0FBSyxHQUFHO0FBQ2xDLFVBQU0sUUFBUSxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBQ3RDLFdBQU8sR0FBRyxJQUFJO0FBQ2QsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGlCQUFpQixNQUF5QjtBQUMvQyxVQUFNLFFBQVEsS0FBSyxTQUFTLEtBQUssTUFBTTtBQUN2QyxVQUFNLFdBQVcsUUFBUSxLQUFLO0FBRTlCLFFBQUksS0FBSyxrQkFBa0JILFVBQWU7QUFDeEMsV0FBSyxNQUFNLElBQUksS0FBSyxPQUFPLEtBQUssUUFBUSxRQUFRO0FBQUEsSUFDbEQsV0FBVyxLQUFLLGtCQUFrQkcsS0FBVTtBQUMxQyxZQUFNLFNBQVMsSUFBSUM7QUFBQUEsUUFDakIsS0FBSyxPQUFPO0FBQUEsUUFDWixLQUFLLE9BQU87QUFBQSxRQUNaLElBQUlZLFFBQWEsVUFBVSxLQUFLLElBQUk7QUFBQSxRQUNwQyxLQUFLO0FBQUEsTUFBQTtBQUVQLFdBQUssU0FBUyxNQUFNO0FBQUEsSUFDdEIsT0FBTztBQUNMLFdBQUssTUFBTSxXQUFXLHdCQUF3QixFQUFFLFFBQVEsS0FBSyxPQUFBLEdBQVUsS0FBSyxJQUFJO0FBQUEsSUFDbEY7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRU8sY0FBYyxNQUFzQjtBQUN6QyxVQUFNLFNBQWdCLENBQUE7QUFDdEIsZUFBVyxjQUFjLEtBQUssT0FBTztBQUNuQyxVQUFJLHNCQUFzQkYsUUFBYTtBQUNyQyxlQUFPLEtBQUssR0FBRyxLQUFLLFNBQVUsV0FBMkIsS0FBSyxDQUFDO0FBQUEsTUFDakUsT0FBTztBQUNMLGVBQU8sS0FBSyxLQUFLLFNBQVMsVUFBVSxDQUFDO0FBQUEsTUFDdkM7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGdCQUFnQixNQUF3QjtBQUM3QyxXQUFPLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFBQSxFQUNqQztBQUFBLEVBRVEsY0FBYyxRQUF3QjtBQUM1QyxVQUFNLFNBQVMsS0FBSyxRQUFRLEtBQUssTUFBTTtBQUN2QyxVQUFNLGNBQWMsS0FBSyxPQUFPLE1BQU0sUUFBUSxNQUFNO0FBQ3BELFFBQUksU0FBUztBQUNiLGVBQVcsY0FBYyxhQUFhO0FBQ3BDLGdCQUFVLEtBQUssU0FBUyxVQUFVLEVBQUUsU0FBQTtBQUFBLElBQ3RDO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGtCQUFrQixNQUEwQjtBQUNqRCxVQUFNLFNBQVMsS0FBSyxNQUFNO0FBQUEsTUFDeEI7QUFBQSxNQUNBLENBQUMsR0FBRyxnQkFBZ0I7QUFDbEIsZUFBTyxLQUFLLGNBQWMsV0FBVztBQUFBLE1BQ3ZDO0FBQUEsSUFBQTtBQUVGLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFTyxnQkFBZ0IsTUFBd0I7QUFDN0MsVUFBTSxPQUFPLEtBQUssU0FBUyxLQUFLLElBQUk7QUFDcEMsVUFBTSxRQUFRLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFFdEMsWUFBUSxLQUFLLFNBQVMsTUFBQTtBQUFBLE1BQ3BCLEtBQUssVUFBVTtBQUFBLE1BQ2YsS0FBSyxVQUFVO0FBQ2IsZUFBTyxPQUFPO0FBQUEsTUFDaEIsS0FBSyxVQUFVO0FBQUEsTUFDZixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFBQSxNQUNmLEtBQUssVUFBVTtBQUNiLGVBQU8sT0FBTztBQUFBLE1BQ2hCLEtBQUssVUFBVTtBQUFBLE1BQ2YsS0FBSyxVQUFVO0FBQ2IsZUFBTyxPQUFPO0FBQUEsTUFDaEIsS0FBSyxVQUFVO0FBQUEsTUFDZixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFDYixlQUFPLFFBQVE7QUFBQSxNQUNqQixLQUFLLFVBQVU7QUFDYixlQUFPLE9BQU87QUFBQSxNQUNoQixLQUFLLFVBQVU7QUFDYixlQUFPLFFBQVE7QUFBQSxNQUNqQixLQUFLLFVBQVU7QUFBQSxNQUNmLEtBQUssVUFBVTtBQUNiLGVBQU8sU0FBUztBQUFBLE1BQ2xCLEtBQUssVUFBVTtBQUFBLE1BQ2YsS0FBSyxVQUFVO0FBQ2IsZUFBTyxTQUFTO0FBQUEsTUFDbEIsS0FBSyxVQUFVO0FBQ2IsZUFBTyxnQkFBZ0I7QUFBQSxNQUN6QixLQUFLLFVBQVU7QUFDYixlQUFPLFFBQVE7QUFBQSxNQUNqQixLQUFLLFVBQVU7QUFDYixlQUFPLFFBQVE7QUFBQSxNQUNqQixLQUFLLFVBQVU7QUFDYixlQUFPLFFBQVE7QUFBQSxNQUNqQjtBQUNFLGFBQUssTUFBTSxXQUFXLHlCQUF5QixFQUFFLFVBQVUsS0FBSyxTQUFBLEdBQVksS0FBSyxJQUFJO0FBQ3JGLGVBQU87QUFBQSxJQUFBO0FBQUEsRUFFYjtBQUFBLEVBRU8saUJBQWlCLE1BQXlCO0FBQy9DLFVBQU0sT0FBTyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBRXBDLFFBQUksS0FBSyxTQUFTLFNBQVMsVUFBVSxJQUFJO0FBQ3ZDLFVBQUksTUFBTTtBQUNSLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRixPQUFPO0FBQ0wsVUFBSSxDQUFDLE1BQU07QUFDVCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFFQSxXQUFPLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFBQSxFQUNqQztBQUFBLEVBRU8saUJBQWlCLE1BQXlCO0FBQy9DLFdBQU8sS0FBSyxTQUFTLEtBQUssU0FBUyxJQUMvQixLQUFLLFNBQVMsS0FBSyxRQUFRLElBQzNCLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFBQSxFQUNqQztBQUFBLEVBRU8sd0JBQXdCLE1BQWdDO0FBQzdELFVBQU0sT0FBTyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBQ3BDLFFBQUksUUFBUSxNQUFNO0FBQ2hCLGFBQU8sS0FBSyxTQUFTLEtBQUssS0FBSztBQUFBLElBQ2pDO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVPLGtCQUFrQixNQUEwQjtBQUNqRCxXQUFPLEtBQUssU0FBUyxLQUFLLFVBQVU7QUFBQSxFQUN0QztBQUFBLEVBRU8saUJBQWlCLE1BQXlCO0FBQy9DLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQUVPLGVBQWUsTUFBdUI7QUFDM0MsVUFBTSxRQUFRLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFDdEMsWUFBUSxLQUFLLFNBQVMsTUFBQTtBQUFBLE1BQ3BCLEtBQUssVUFBVTtBQUNiLGVBQU8sQ0FBQztBQUFBLE1BQ1YsS0FBSyxVQUFVO0FBQ2IsZUFBTyxDQUFDO0FBQUEsTUFDVixLQUFLLFVBQVU7QUFDYixlQUFPLENBQUM7QUFBQSxNQUNWLEtBQUssVUFBVTtBQUFBLE1BQ2YsS0FBSyxVQUFVLFlBQVk7QUFDekIsY0FBTSxXQUNKLE9BQU8sS0FBSyxLQUFLLEtBQUssU0FBUyxTQUFTLFVBQVUsV0FBVyxJQUFJO0FBQ25FLFlBQUksS0FBSyxpQkFBaUJkLFVBQWU7QUFDdkMsZUFBSyxNQUFNLElBQUksS0FBSyxNQUFNLEtBQUssUUFBUSxRQUFRO0FBQUEsUUFDakQsV0FBVyxLQUFLLGlCQUFpQkcsS0FBVTtBQUN6QyxnQkFBTSxTQUFTLElBQUlDO0FBQUFBLFlBQ2pCLEtBQUssTUFBTTtBQUFBLFlBQ1gsS0FBSyxNQUFNO0FBQUEsWUFDWCxJQUFJWSxRQUFhLFVBQVUsS0FBSyxJQUFJO0FBQUEsWUFDcEMsS0FBSztBQUFBLFVBQUE7QUFFUCxlQUFLLFNBQVMsTUFBTTtBQUFBLFFBQ3RCLE9BQU87QUFDTCxlQUFLO0FBQUEsWUFDSCxXQUFXO0FBQUEsWUFDWCxFQUFFLE9BQU8sS0FBSyxNQUFBO0FBQUEsWUFDZCxLQUFLO0FBQUEsVUFBQTtBQUFBLFFBRVQ7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0E7QUFDRSxhQUFLLE1BQU0sV0FBVyx3QkFBd0IsRUFBRSxVQUFVLEtBQUssU0FBQSxHQUFZLEtBQUssSUFBSTtBQUNwRixlQUFPO0FBQUEsSUFBQTtBQUFBLEVBRWI7QUFBQSxFQUVPLGNBQWMsTUFBc0I7QUFFekMsVUFBTSxTQUFTLEtBQUssU0FBUyxLQUFLLE1BQU07QUFDeEMsUUFBSSxVQUFVLFFBQVEsS0FBSyxTQUFVLFFBQU87QUFDNUMsUUFBSSxPQUFPLFdBQVcsWUFBWTtBQUNoQyxXQUFLLE1BQU0sV0FBVyxnQkFBZ0IsRUFBRSxPQUFBLEdBQWtCLEtBQUssSUFBSTtBQUFBLElBQ3JFO0FBRUEsVUFBTSxPQUFPLENBQUE7QUFDYixlQUFXLFlBQVksS0FBSyxNQUFNO0FBQ2hDLFVBQUksb0JBQW9CRixRQUFhO0FBQ25DLGFBQUssS0FBSyxHQUFHLEtBQUssU0FBVSxTQUF5QixLQUFLLENBQUM7QUFBQSxNQUM3RCxPQUFPO0FBQ0wsYUFBSyxLQUFLLEtBQUssU0FBUyxRQUFRLENBQUM7QUFBQSxNQUNuQztBQUFBLElBQ0Y7QUFFQSxRQUFJLEtBQUssa0JBQWtCWCxLQUFVO0FBQ25DLGFBQU8sT0FBTyxNQUFNLEtBQUssT0FBTyxPQUFPLFFBQVEsSUFBSTtBQUFBLElBQ3JELE9BQU87QUFDTCxhQUFPLE9BQU8sR0FBRyxJQUFJO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBQUEsRUFFTyxhQUFhLE1BQXFCO0FBQ3ZDLFVBQU0sUUFBUSxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBRXRDLFFBQUksT0FBTyxVQUFVLFlBQVk7QUFDL0IsV0FBSztBQUFBLFFBQ0gsV0FBVztBQUFBLFFBQ1gsRUFBRSxNQUFBO0FBQUEsUUFDRixLQUFLO0FBQUEsTUFBQTtBQUFBLElBRVQ7QUFFQSxVQUFNLE9BQWMsQ0FBQTtBQUNwQixlQUFXLE9BQU8sS0FBSyxNQUFNO0FBQzNCLFdBQUssS0FBSyxLQUFLLFNBQVMsR0FBRyxDQUFDO0FBQUEsSUFDOUI7QUFDQSxXQUFPLElBQUksTUFBTSxHQUFHLElBQUk7QUFBQSxFQUMxQjtBQUFBLEVBRU8sb0JBQW9CLE1BQTRCO0FBQ3JELFVBQU0sT0FBWSxDQUFBO0FBQ2xCLGVBQVcsWUFBWSxLQUFLLFlBQVk7QUFDdEMsVUFBSSxvQkFBb0JXLFFBQWE7QUFDbkMsZUFBTyxPQUFPLE1BQU0sS0FBSyxTQUFVLFNBQXlCLEtBQUssQ0FBQztBQUFBLE1BQ3BFLE9BQU87QUFDTCxjQUFNLE1BQU0sS0FBSyxTQUFVLFNBQXNCLEdBQUc7QUFDcEQsY0FBTSxRQUFRLEtBQUssU0FBVSxTQUFzQixLQUFLO0FBQ3hELGFBQUssR0FBRyxJQUFJO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRU8sZ0JBQWdCLE1BQXdCO0FBQzdDLFdBQU8sT0FBTyxLQUFLLFNBQVMsS0FBSyxLQUFLO0FBQUEsRUFDeEM7QUFBQSxFQUVPLGNBQWMsTUFBc0I7QUFDekMsV0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLO0FBQUEsTUFDVixLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVM7QUFBQSxNQUM3QixLQUFLLFNBQVMsS0FBSyxRQUFRO0FBQUEsSUFBQTtBQUFBLEVBRS9CO0FBQUEsRUFFQSxjQUFjLE1BQXNCO0FBQ2xDLFNBQUssU0FBUyxLQUFLLEtBQUs7QUFDeEIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLGVBQWUsTUFBc0I7QUFDbkMsVUFBTSxTQUFTLEtBQUssU0FBUyxLQUFLLEtBQUs7QUFDdkMsWUFBUSxJQUFJLE1BQU07QUFDbEIsV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQ2pXTyxNQUFlLE1BQU07QUFJNUI7QUFVTyxNQUFNLGdCQUFnQixNQUFNO0FBQUEsRUFNL0IsWUFBWSxNQUFjLFlBQXFCLFVBQW1CLE1BQWUsT0FBZSxHQUFHO0FBQy9GLFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFDWixTQUFLLGFBQWE7QUFDbEIsU0FBSyxXQUFXO0FBQ2hCLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFTyxPQUFVLFNBQTBCLFFBQWtCO0FBQ3pELFdBQU8sUUFBUSxrQkFBa0IsTUFBTSxNQUFNO0FBQUEsRUFDakQ7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFFTyxNQUFNLGtCQUFrQixNQUFNO0FBQUEsRUFJakMsWUFBWSxNQUFjLE9BQWUsT0FBZSxHQUFHO0FBQ3ZELFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFDWixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRU8sT0FBVSxTQUEwQixRQUFrQjtBQUN6RCxXQUFPLFFBQVEsb0JBQW9CLE1BQU0sTUFBTTtBQUFBLEVBQ25EO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNKO0FBRU8sTUFBTSxhQUFhLE1BQU07QUFBQSxFQUc1QixZQUFZLE9BQWUsT0FBZSxHQUFHO0FBQ3pDLFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRU8sT0FBVSxTQUEwQixRQUFrQjtBQUN6RCxXQUFPLFFBQVEsZUFBZSxNQUFNLE1BQU07QUFBQSxFQUM5QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDSjtBQXFCTyxNQUFNLGdCQUFnQixNQUFNO0FBQUEsRUFHL0IsWUFBWSxPQUFlLE9BQWUsR0FBRztBQUN6QyxVQUFBO0FBQ0EsU0FBSyxPQUFPO0FBQ1osU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVPLE9BQVUsU0FBMEIsUUFBa0I7QUFDekQsV0FBTyxRQUFRLGtCQUFrQixNQUFNLE1BQU07QUFBQSxFQUNqRDtBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDSjtBQy9HTyxNQUFNLGVBQWU7QUFBQSxFQU9uQixNQUFNLFFBQThCO0FBQ3pDLFNBQUssVUFBVTtBQUNmLFNBQUssT0FBTztBQUNaLFNBQUssTUFBTTtBQUNYLFNBQUssU0FBUztBQUNkLFNBQUssUUFBUSxDQUFBO0FBRWIsV0FBTyxDQUFDLEtBQUssT0FBTztBQUNsQixZQUFNLE9BQU8sS0FBSyxLQUFBO0FBQ2xCLFVBQUksU0FBUyxNQUFNO0FBQ2pCO0FBQUEsTUFDRjtBQUNBLFdBQUssTUFBTSxLQUFLLElBQUk7QUFBQSxJQUN0QjtBQUNBLFNBQUssU0FBUztBQUNkLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQUVRLFNBQVMsT0FBMEI7QUFDekMsZUFBVyxRQUFRLE9BQU87QUFDeEIsVUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3BCLGFBQUssV0FBVyxLQUFLO0FBQ3JCLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxRQUFRLFdBQW1CLElBQVU7QUFDM0MsUUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLFVBQUksS0FBSyxNQUFNLElBQUksR0FBRztBQUNwQixhQUFLLFFBQVE7QUFDYixhQUFLLE1BQU07QUFBQSxNQUNiO0FBQ0EsVUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLGFBQUs7QUFBQSxNQUNQLE9BQU87QUFDTCxhQUFLLE1BQU0sV0FBVyxnQkFBZ0IsRUFBRSxVQUFvQjtBQUFBLE1BQzlEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVRLFFBQVEsT0FBMEI7QUFDeEMsZUFBVyxRQUFRLE9BQU87QUFDeEIsVUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3BCLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxNQUFNLE1BQXVCO0FBQ25DLFdBQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxTQUFTLEtBQUssVUFBVSxLQUFLLE1BQU0sTUFBTTtBQUFBLEVBQ3pFO0FBQUEsRUFFUSxNQUFlO0FBQ3JCLFdBQU8sS0FBSyxVQUFVLEtBQUssT0FBTztBQUFBLEVBQ3BDO0FBQUEsRUFFUSxNQUFNLE1BQXNCLE9BQVksSUFBUztBQUN2RCxVQUFNLElBQUksWUFBWSxNQUFNLE1BQU0sRUFBRSxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUssS0FBSyxRQUFRLEtBQUssUUFBUTtBQUFBLEVBQzNGO0FBQUEsRUFFUSxPQUFtQjtBQUN6QixTQUFLLFdBQUE7QUFDTCxRQUFJO0FBRUosUUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQ3BCLFdBQUssTUFBTSxXQUFXLHNCQUFzQjtBQUFBLElBQzlDO0FBRUEsUUFBSSxLQUFLLE1BQU0sTUFBTSxHQUFHO0FBQ3RCLGFBQU8sS0FBSyxRQUFBO0FBQUEsSUFDZCxXQUFXLEtBQUssTUFBTSxXQUFXLEtBQUssS0FBSyxNQUFNLFdBQVcsR0FBRztBQUM3RCxhQUFPLEtBQUssUUFBQTtBQUFBLElBQ2QsV0FBVyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQzFCLGFBQU8sS0FBSyxRQUFBO0FBQUEsSUFDZCxPQUFPO0FBQ0wsYUFBTyxLQUFLLEtBQUE7QUFBQSxJQUNkO0FBRUEsU0FBSyxXQUFBO0FBQ0wsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLFVBQWdCO0FBQ3RCLE9BQUc7QUFDRCxXQUFLLFFBQVEsZ0NBQWdDO0FBQUEsSUFDL0MsU0FBUyxDQUFDLEtBQUssTUFBTSxLQUFLO0FBQzFCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxVQUFzQjtBQUM1QixVQUFNLFFBQVEsS0FBSztBQUNuQixPQUFHO0FBQ0QsV0FBSyxRQUFRLDBCQUEwQjtBQUFBLElBQ3pDLFNBQVMsQ0FBQyxLQUFLLE1BQU0sR0FBRztBQUN4QixVQUFNLFVBQVUsS0FBSyxPQUFPLE1BQU0sT0FBTyxLQUFLLFVBQVUsQ0FBQyxFQUFFLEtBQUE7QUFDM0QsV0FBTyxJQUFJZ0IsUUFBYSxTQUFTLEtBQUssSUFBSTtBQUFBLEVBQzVDO0FBQUEsRUFFUSxVQUFzQjtBQUM1QixVQUFNLE9BQU8sS0FBSztBQUNsQixVQUFNLE9BQU8sS0FBSyxXQUFXLEtBQUssR0FBRztBQUNyQyxRQUFJLENBQUMsTUFBTTtBQUNULFdBQUssTUFBTSxXQUFXLGlCQUFpQjtBQUFBLElBQ3pDO0FBRUEsVUFBTSxhQUFhLEtBQUssV0FBQTtBQUV4QixRQUNFLEtBQUssTUFBTSxJQUFJLEtBQ2QsZ0JBQWdCLFNBQVMsSUFBSSxLQUFLLEtBQUssTUFBTSxHQUFHLEdBQ2pEO0FBQ0EsYUFBTyxJQUFJQyxRQUFhLE1BQU0sWUFBWSxDQUFBLEdBQUksTUFBTSxLQUFLLElBQUk7QUFBQSxJQUMvRDtBQUVBLFFBQUksQ0FBQyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQ3BCLFdBQUssTUFBTSxXQUFXLHdCQUF3QjtBQUFBLElBQ2hEO0FBRUEsUUFBSSxXQUF5QixDQUFBO0FBQzdCLFNBQUssV0FBQTtBQUNMLFFBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxHQUFHO0FBQ3BCLGlCQUFXLEtBQUssU0FBUyxJQUFJO0FBQUEsSUFDL0I7QUFFQSxTQUFLLE1BQU0sSUFBSTtBQUNmLFdBQU8sSUFBSUEsUUFBYSxNQUFNLFlBQVksVUFBVSxPQUFPLElBQUk7QUFBQSxFQUNqRTtBQUFBLEVBRVEsTUFBTSxNQUFvQjtBQUNoQyxRQUFJLENBQUMsS0FBSyxNQUFNLElBQUksR0FBRztBQUNyQixXQUFLLE1BQU0sV0FBVyxzQkFBc0IsRUFBRSxNQUFZO0FBQUEsSUFDNUQ7QUFDQSxRQUFJLENBQUMsS0FBSyxNQUFNLEdBQUcsSUFBSSxFQUFFLEdBQUc7QUFDMUIsV0FBSyxNQUFNLFdBQVcsc0JBQXNCLEVBQUUsTUFBWTtBQUFBLElBQzVEO0FBQ0EsU0FBSyxXQUFBO0FBQ0wsUUFBSSxDQUFDLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDcEIsV0FBSyxNQUFNLFdBQVcsc0JBQXNCLEVBQUUsTUFBWTtBQUFBLElBQzVEO0FBQUEsRUFDRjtBQUFBLEVBRVEsU0FBUyxRQUE4QjtBQUM3QyxVQUFNLFdBQXlCLENBQUE7QUFDL0IsT0FBRztBQUNELFVBQUksS0FBSyxPQUFPO0FBQ2QsYUFBSyxNQUFNLFdBQVcsc0JBQXNCLEVBQUUsTUFBTSxRQUFRO0FBQUEsTUFDOUQ7QUFDQSxZQUFNLE9BQU8sS0FBSyxLQUFBO0FBQ2xCLFVBQUksU0FBUyxNQUFNO0FBQ2pCO0FBQUEsTUFDRjtBQUNBLGVBQVMsS0FBSyxJQUFJO0FBQUEsSUFDcEIsU0FBUyxDQUFDLEtBQUssS0FBSyxJQUFJO0FBRXhCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxhQUErQjtBQUNyQyxVQUFNLGFBQStCLENBQUE7QUFDckMsV0FBTyxDQUFDLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssT0FBTztBQUMzQyxXQUFLLFdBQUE7QUFDTCxZQUFNLE9BQU8sS0FBSztBQUNsQixZQUFNLE9BQU8sS0FBSyxXQUFXLEtBQUssS0FBSyxJQUFJO0FBQzNDLFVBQUksQ0FBQyxNQUFNO0FBQ1QsYUFBSyxNQUFNLFdBQVcsb0JBQW9CO0FBQUEsTUFDNUM7QUFDQSxXQUFLLFdBQUE7QUFDTCxVQUFJLFFBQVE7QUFDWixVQUFJLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFDbkIsYUFBSyxXQUFBO0FBQ0wsWUFBSSxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQ25CLGtCQUFRLEtBQUssZUFBZSxLQUFLLE9BQU8sR0FBRyxDQUFDO0FBQUEsUUFDOUMsV0FBVyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQzFCLGtCQUFRLEtBQUssZUFBZSxLQUFLLE9BQU8sR0FBRyxDQUFDO0FBQUEsUUFDOUMsT0FBTztBQUNMLGtCQUFRLEtBQUssZUFBZSxLQUFLLFdBQVcsS0FBSyxJQUFJLENBQUM7QUFBQSxRQUN4RDtBQUFBLE1BQ0Y7QUFDQSxXQUFLLFdBQUE7QUFDTCxpQkFBVyxLQUFLLElBQUlDLFVBQWUsTUFBTSxPQUFPLElBQUksQ0FBQztBQUFBLElBQ3ZEO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLE9BQW1CO0FBQ3pCLFVBQU0sUUFBUSxLQUFLO0FBQ25CLFVBQU0sT0FBTyxLQUFLO0FBQ2xCLFFBQUksUUFBUTtBQUNaLFdBQU8sQ0FBQyxLQUFLLE9BQU87QUFDbEIsVUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFHO0FBQUU7QUFBUztBQUFBLE1BQVU7QUFDM0MsVUFBSSxRQUFRLEtBQUssS0FBSyxNQUFNLElBQUksR0FBRztBQUFFO0FBQVM7QUFBQSxNQUFVO0FBQ3hELFVBQUksVUFBVSxLQUFLLEtBQUssS0FBSyxHQUFHLEdBQUc7QUFBRTtBQUFBLE1BQU87QUFDNUMsV0FBSyxRQUFBO0FBQUEsSUFDUDtBQUNBLFVBQU0sTUFBTSxLQUFLLE9BQU8sTUFBTSxPQUFPLEtBQUssT0FBTyxFQUFFLEtBQUE7QUFDbkQsUUFBSSxDQUFDLEtBQUs7QUFDUixhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sSUFBSUMsS0FBVSxLQUFLLGVBQWUsR0FBRyxHQUFHLElBQUk7QUFBQSxFQUNyRDtBQUFBLEVBRVEsZUFBZSxNQUFzQjtBQUMzQyxXQUFPLEtBQ0osUUFBUSxXQUFXLEdBQVEsRUFDM0IsUUFBUSxTQUFTLEdBQUcsRUFDcEIsUUFBUSxTQUFTLEdBQUcsRUFDcEIsUUFBUSxXQUFXLEdBQUcsRUFDdEIsUUFBUSxXQUFXLEdBQUcsRUFDdEIsUUFBUSxVQUFVLEdBQUc7QUFBQSxFQUMxQjtBQUFBLEVBRVEsYUFBcUI7QUFDM0IsUUFBSSxRQUFRO0FBQ1osV0FBTyxLQUFLLEtBQUssR0FBRyxXQUFXLEtBQUssQ0FBQyxLQUFLLE9BQU87QUFDL0MsZUFBUztBQUNULFdBQUssUUFBQTtBQUFBLElBQ1A7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsY0FBYyxTQUEyQjtBQUMvQyxTQUFLLFdBQUE7QUFDTCxVQUFNLFFBQVEsS0FBSztBQUNuQixXQUFPLENBQUMsS0FBSyxLQUFLLEdBQUcsYUFBYSxHQUFHLE9BQU8sR0FBRztBQUM3QyxXQUFLLFFBQVEsb0JBQW9CLE9BQU8sRUFBRTtBQUFBLElBQzVDO0FBQ0EsVUFBTSxNQUFNLEtBQUs7QUFDakIsU0FBSyxXQUFBO0FBQ0wsV0FBTyxLQUFLLE9BQU8sTUFBTSxPQUFPLEdBQUcsRUFBRSxLQUFBO0FBQUEsRUFDdkM7QUFBQSxFQUVRLE9BQU8sU0FBeUI7QUFDdEMsVUFBTSxRQUFRLEtBQUs7QUFDbkIsV0FBTyxDQUFDLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFDM0IsV0FBSyxRQUFRLG9CQUFvQixPQUFPLEVBQUU7QUFBQSxJQUM1QztBQUNBLFdBQU8sS0FBSyxPQUFPLE1BQU0sT0FBTyxLQUFLLFVBQVUsQ0FBQztBQUFBLEVBQ2xEO0FBQ0Y7QUNwUE8sU0FBUyxTQUFTLE1BQW9CO0FBQzNDLFVBQVEsVUFBVSxNQUFNLElBQUksSUFBSTtBQUNoQyxTQUFPLGNBQWMsSUFBSSxjQUFjLFVBQVUsQ0FBQztBQUNwRDtBQUVPLFNBQVMsVUFBVSxTQUFpQixVQUFpRDtBQUMxRixNQUFJLFlBQVksSUFBSyxRQUFPLENBQUE7QUFDNUIsUUFBTSxlQUFlLFFBQVEsTUFBTSxHQUFHLEVBQUUsT0FBTyxPQUFPO0FBQ3RELFFBQU0sWUFBWSxTQUFTLE1BQU0sR0FBRyxFQUFFLE9BQU8sT0FBTztBQUNwRCxNQUFJLGFBQWEsV0FBVyxVQUFVLE9BQVEsUUFBTztBQUNyRCxRQUFNLFNBQWlDLENBQUE7QUFDdkMsV0FBUyxJQUFJLEdBQUcsSUFBSSxhQUFhLFFBQVEsS0FBSztBQUM1QyxRQUFJLGFBQWEsQ0FBQyxFQUFFLFdBQVcsR0FBRyxHQUFHO0FBQ25DLGFBQU8sYUFBYSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUM7QUFBQSxJQUNoRCxXQUFXLGFBQWEsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxHQUFHO0FBQzNDLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNBLFNBQU87QUFDVDtBQUVPLE1BQU0sZUFBZSxVQUFVO0FBQUEsRUFBL0IsY0FBQTtBQUFBLFVBQUEsR0FBQSxTQUFBO0FBQ0wsU0FBUSxTQUF3QixDQUFBO0FBQUEsRUFBQztBQUFBLEVBRWpDLFVBQVUsUUFBNkI7QUFDckMsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQSxFQUVBLFVBQWdCO0FBQ2QsV0FBTyxpQkFBaUIsWUFBWSxNQUFNLEtBQUssYUFBYTtBQUFBLE1BQzFELFFBQVEsS0FBSyxpQkFBaUI7QUFBQSxJQUFBLENBQy9CO0FBQ0QsU0FBSyxVQUFBO0FBQUEsRUFDUDtBQUFBLEVBRUEsTUFBYyxZQUEyQjtBQUN2QyxVQUFNLFdBQVcsT0FBTyxTQUFTO0FBQ2pDLGVBQVcsU0FBUyxLQUFLLFFBQVE7QUFDL0IsWUFBTSxTQUFTLFVBQVUsTUFBTSxNQUFNLFFBQVE7QUFDN0MsVUFBSSxXQUFXLEtBQU07QUFDckIsVUFBSSxNQUFNLE9BQU87QUFDZixjQUFNLFVBQVUsTUFBTSxNQUFNLE1BQUE7QUFDNUIsWUFBSSxDQUFDLFFBQVM7QUFBQSxNQUNoQjtBQUNBLFdBQUssT0FBTyxNQUFNLFdBQVcsTUFBTTtBQUNuQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFUSxPQUFPQyxpQkFBZ0MsUUFBc0M7QUFDbkYsVUFBTSxVQUFVLEtBQUs7QUFDckIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLFdBQVk7QUFDbEMsU0FBSyxXQUFXLGVBQWVBLGlCQUFnQixTQUFTLE1BQU07QUFBQSxFQUNoRTtBQUNGO0FDOURPLE1BQU0sU0FBUztBQUFBLEVBSXBCLFlBQVksUUFBYyxRQUFnQixZQUFZO0FBQ3BELFNBQUssUUFBUSxTQUFTLGNBQWMsR0FBRyxLQUFLLFFBQVE7QUFDcEQsU0FBSyxNQUFNLFNBQVMsY0FBYyxHQUFHLEtBQUssTUFBTTtBQUNoRCxRQUFLLE9BQWUsVUFBVSxPQUFRLE9BQWUsV0FBVyxZQUFZO0FBQ3pFLGFBQWUsT0FBTyxLQUFLLEtBQUs7QUFDaEMsYUFBZSxPQUFPLEtBQUssR0FBRztBQUFBLElBQ2pDLE9BQU87QUFDTCxhQUFPLFlBQVksS0FBSyxLQUFLO0FBQzdCLGFBQU8sWUFBWSxLQUFLLEdBQUc7QUFBQSxJQUM3QjtBQUFBLEVBQ0Y7QUFBQSxFQUVPLFFBQWM7QWRoQmhCO0FjaUJILFFBQUksVUFBVSxLQUFLLE1BQU07QUFDekIsV0FBTyxXQUFXLFlBQVksS0FBSyxLQUFLO0FBQ3RDLFlBQU0sV0FBVztBQUNqQixnQkFBVSxRQUFRO0FBQ2xCLHFCQUFTLGVBQVQsbUJBQXFCLFlBQVk7QUFBQSxJQUNuQztBQUFBLEVBQ0Y7QUFBQSxFQUVPLE9BQU8sTUFBa0I7QWR6QjNCO0FjMEJILGVBQUssSUFBSSxlQUFULG1CQUFxQixhQUFhLE1BQU0sS0FBSztBQUFBLEVBQy9DO0FBQUEsRUFFTyxRQUFnQjtBQUNyQixVQUFNLFNBQWlCLENBQUE7QUFDdkIsUUFBSSxVQUFVLEtBQUssTUFBTTtBQUN6QixXQUFPLFdBQVcsWUFBWSxLQUFLLEtBQUs7QUFDdEMsYUFBTyxLQUFLLE9BQU87QUFDbkIsZ0JBQVUsUUFBUTtBQUFBLElBQ3BCO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLElBQVcsU0FBc0I7QUFDL0IsV0FBTyxLQUFLLE1BQU07QUFBQSxFQUNwQjtBQUNGO0FDckNBLE1BQU0sNEJBQVksSUFBQTtBQUNsQixNQUFNLG9CQUE0QixDQUFBO0FBQ2xDLElBQUksY0FBYztBQUNsQixJQUFJLGtCQUFrQjtBQUV0QixTQUFTLFFBQVE7QUFDZixnQkFBYztBQUdkLGFBQVcsQ0FBQyxVQUFVLEtBQUssS0FBSyxNQUFNLFdBQVc7QUFDL0MsUUFBSTtBQUVGLFVBQUksT0FBTyxTQUFTLGNBQWMsWUFBWTtBQUM1QyxpQkFBUyxVQUFBO0FBQUEsTUFDWDtBQUdBLGlCQUFXLFFBQVEsT0FBTztBQUN4QixhQUFBO0FBQUEsTUFDRjtBQUdBLFVBQUksT0FBTyxTQUFTLGFBQWEsWUFBWTtBQUMzQyxpQkFBUyxTQUFBO0FBQUEsTUFDWDtBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1Ysa0JBQVksR0FBRyxVQUFVLFFBQVE7QUFBQSxJQUNuQztBQUFBLEVBQ0Y7QUFDQSxRQUFNLE1BQUE7QUFHTixRQUFNLFlBQVksa0JBQWtCLE9BQU8sQ0FBQztBQUM1QyxhQUFXLE1BQU0sV0FBVztBQUMxQixRQUFJO0FBQ0YsU0FBQTtBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1Ysa0JBQVksR0FBRyxRQUFRO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxTQUFTLFlBQVksVUFBcUIsTUFBWTtBQUMzRCxNQUFJLENBQUMsaUJBQWlCO0FBQ3BCLFNBQUE7QUFHQTtBQUFBLEVBQ0Y7QUFFQSxNQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsR0FBRztBQUN4QixVQUFNLElBQUksVUFBVSxFQUFFO0FBQUEsRUFDeEI7QUFDQSxRQUFNLElBQUksUUFBUSxFQUFHLEtBQUssSUFBSTtBQUU5QixNQUFJLENBQUMsYUFBYTtBQUNoQixrQkFBYztBQUNkLG1CQUFlLEtBQUs7QUFBQSxFQUN0QjtBQUNGO0FBRU8sU0FBUyxhQUFzQjtBQUNwQyxTQUFPO0FBQ1Q7QUFFTyxTQUFTLFVBQVUsSUFBZ0I7QUFDeEMsUUFBTSxPQUFPO0FBQ2Isb0JBQWtCO0FBQ2xCLE1BQUk7QUFDRixPQUFBO0FBQUEsRUFDRixVQUFBO0FBQ0Usc0JBQWtCO0FBQUEsRUFDcEI7QUFDRjtBQU9PLFNBQVMsU0FBUyxJQUFpQztBQUN4RCxNQUFJLElBQUk7QUFDTixzQkFBa0IsS0FBSyxFQUFFO0FBQ3pCLFFBQUksQ0FBQyxhQUFhO0FBQ2hCLG9CQUFjO0FBQ2QscUJBQWUsS0FBSztBQUFBLElBQ3RCO0FBQ0E7QUFBQSxFQUNGO0FBRUEsU0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzlCLHNCQUFrQixLQUFLLE9BQU87QUFDOUIsUUFBSSxDQUFDLGFBQWE7QUFDaEIsb0JBQWM7QUFDZCxxQkFBZSxLQUFLO0FBQUEsSUFDdEI7QUFBQSxFQUNGLENBQUM7QUFDSDtBQ3ZGQSxNQUFNLFVBQW9DO0FBQUEsRUFDeEMsS0FBSyxDQUFDLFVBQVUsS0FBSztBQUFBLEVBQ3JCLFFBQVEsQ0FBQyxVQUFVLEtBQUs7QUFBQSxFQUN4QixPQUFPLENBQUMsS0FBSyxVQUFVO0FBQUEsRUFDdkIsSUFBSSxDQUFDLFdBQVcsSUFBSTtBQUFBLEVBQ3BCLE1BQU0sQ0FBQyxhQUFhLE1BQU07QUFBQSxFQUMxQixNQUFNLENBQUMsYUFBYSxNQUFNO0FBQUEsRUFDMUIsT0FBTyxDQUFDLGNBQWMsT0FBTztBQUFBLEVBQzdCLEtBQUssQ0FBQyxVQUFVLEtBQUs7QUFBQSxFQUNyQixRQUFRLENBQUMsVUFBVSxLQUFLO0FBQUEsRUFDeEIsS0FBSyxDQUFDLFFBQVE7QUFBQSxFQUNkLEtBQUssQ0FBQyxHQUFHO0FBQUEsRUFDVCxPQUFPLENBQUMsR0FBRztBQUFBLEVBQ1gsT0FBTyxDQUFDLEdBQUc7QUFBQSxFQUNYLFdBQVcsQ0FBQyxJQUFJO0FBQUEsRUFDaEIsTUFBTSxDQUFDLEdBQUc7QUFBQSxFQUNWLE9BQU8sQ0FBQyxHQUFHO0FBQUEsRUFDWCxPQUFPLENBQUMsR0FBRztBQUNiO0FBSU8sTUFBTSxXQUErQztBQUFBLEVBUzFELFlBQVksU0FBMkM7QUFSdkQsU0FBUSxVQUFVLElBQUksUUFBQTtBQUN0QixTQUFRLFNBQVMsSUFBSSxpQkFBQTtBQUNyQixTQUFRLGlCQUFpQixJQUFJLGVBQUE7QUFDN0IsU0FBUSxjQUFjLElBQUksWUFBQTtBQUMxQixTQUFPLFdBQThCLENBQUE7QUFDckMsU0FBTyxPQUFxQztBQUM1QyxTQUFRLGNBQWM7QUFHcEIsU0FBSyxTQUFTLFFBQVEsSUFBSSxFQUFFLFdBQVcsT0FBQTtBQUN2QyxRQUFJLENBQUMsUUFBUztBQUNkLFFBQUksUUFBUSxVQUFVO0FBQ3BCLFdBQUssV0FBVyxFQUFFLEdBQUcsS0FBSyxVQUFVLEdBQUcsUUFBUSxTQUFBO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQUEsRUFFUSx3QkFDTixVQUNBLE9BQ0EsU0FDQSxjQUNBLE9BQ007QUFDTixRQUFJLGdCQUFnQixTQUFTO0FBRTdCLGFBQVMsVUFBVSxNQUFNO0FBQ3ZCLFdBQUssY0FBYztBQUNuQixVQUFJO0FBQ0YsYUFBSyxRQUFRLE9BQU87QUFDcEIsZ0JBQVEsWUFBWTtBQUNwQixjQUFNQyxTQUFRLElBQUksTUFBTSxjQUFjLFFBQVE7QUFDOUNBLGVBQU0sSUFBSSxhQUFhLFFBQVE7QUFDL0IsWUFBSSxnQkFBZ0IsU0FBUztBQUM3QixjQUFNLFlBQVksS0FBSyxZQUFZO0FBQ25DLGFBQUssWUFBWSxRQUFRQTtBQUN6QixrQkFBVSxNQUFNO0FBQ2QsZUFBSyxlQUFlLE9BQU8sT0FBTztBQUNsQyxjQUFJLE9BQU8sU0FBUyxhQUFhLHFCQUFxQixTQUFBO0FBQUEsUUFDeEQsQ0FBQztBQUNELGFBQUssWUFBWSxRQUFRO0FBQUEsTUFDM0IsVUFBQTtBQUNFLGFBQUssY0FBYztBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUVBLFFBQUksT0FBTyxTQUFTLFlBQVkscUJBQXFCLFFBQUE7QUFFckQsVUFBTSxRQUFRLElBQUksTUFBTSxjQUFjLFFBQVE7QUFDOUMsVUFBTSxJQUFJLGFBQWEsUUFBUTtBQUMvQixTQUFLLFlBQVksUUFBUTtBQUN6QixjQUFVLE1BQU07QUFDZCxXQUFLLGVBQWUsT0FBTyxPQUFPO0FBQ2xDLFVBQUksT0FBTyxTQUFTLGFBQWEscUJBQXFCLFNBQUE7QUFBQSxJQUN4RCxDQUFDO0FBQ0QsU0FBSyxZQUFZLFFBQVE7QUFBQSxFQUMzQjtBQUFBLEVBRU8sYUFBYSxLQUE0QjtBQUM5QyxVQUFNLFFBQVEsS0FBSyxTQUFTLEdBQUc7QUFDL0IsUUFBSSxNQUFNLFVBQVUsT0FBVyxRQUFPLE1BQU07QUFDNUMsVUFBTSxTQUFVLE1BQU0sVUFBa0I7QUFDeEMsUUFBSSxDQUFDLFFBQVE7QUFDWCxZQUFNLFFBQVEsQ0FBQTtBQUNkLGFBQU8sTUFBTTtBQUFBLElBQ2Y7QUFDQSxVQUFNLFFBQVEsS0FBSyxlQUFlLE1BQU0sTUFBTTtBQUM5QyxXQUFPLE1BQU07QUFBQSxFQUNmO0FBQUEsRUFFUSxTQUFTLE1BQW1CLFFBQXFCO0FBQ3ZELFFBQUksS0FBSyxTQUFTLFdBQVc7QUFDM0IsWUFBTSxLQUFLO0FBQ1gsWUFBTSxZQUFZLEtBQUssU0FBUyxJQUFJLENBQUMsV0FBVyxPQUFPLENBQUM7QUFDeEQsVUFBSSxXQUFXO0FBRWIsY0FBTSxPQUFPLFVBQVUsS0FBSyxXQUFXLEdBQUcsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksVUFBVTtBQUNsRixhQUFLLE1BQU0sV0FBVyx1QkFBdUIsRUFBRSxLQUFBLEdBQWMsR0FBRyxJQUFJO0FBQUEsTUFDdEU7QUFBQSxJQUNGO0FBQ0EsU0FBSyxPQUFPLE1BQU0sTUFBTTtBQUFBLEVBQzFCO0FBQUEsRUFFUSxZQUFZLFFBQW1CO0FoQnhIbEM7QWdCeUhILFFBQUksQ0FBQyxVQUFVLE9BQU8sV0FBVyxTQUFVO0FBRTNDLFFBQUksUUFBUSxPQUFPLGVBQWUsTUFBTTtBQUN4QyxXQUFPLFNBQVMsVUFBVSxPQUFPLFdBQVc7QUFDMUMsaUJBQVcsT0FBTyxPQUFPLG9CQUFvQixLQUFLLEdBQUc7QUFDbkQsYUFBSSxZQUFPLHlCQUF5QixPQUFPLEdBQUcsTUFBMUMsbUJBQTZDLElBQUs7QUFDdEQsWUFDRSxPQUFPLE9BQU8sR0FBRyxNQUFNLGNBQ3ZCLFFBQVEsaUJBQ1IsQ0FBQyxPQUFPLFVBQVUsZUFBZSxLQUFLLFFBQVEsR0FBRyxHQUNqRDtBQUNBLGlCQUFPLEdBQUcsSUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLE1BQU07QUFBQSxRQUN2QztBQUFBLE1BQ0Y7QUFDQSxjQUFRLE9BQU8sZUFBZSxLQUFLO0FBQUEsSUFDckM7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBLEVBSVEsYUFBYSxJQUE0QjtBQUMvQyxVQUFNLFFBQVEsS0FBSyxZQUFZO0FBQy9CLFdBQU8sT0FBTyxNQUFNO0FBQ2xCLFlBQU0sT0FBTyxLQUFLLFlBQVk7QUFDOUIsV0FBSyxZQUFZLFFBQVE7QUFDekIsVUFBSTtBQUNGLFdBQUE7QUFBQSxNQUNGLFNBQVMsR0FBRztBQUNWLFlBQUksY0FBYztBQUNoQixnQkFBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUN2RCxzQkFBWSxHQUFHLFVBQVUsUUFBUTtBQUFBLFFBQ25DLE9BQU87QUFDTCxnQkFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGLFVBQUE7QUFDRSxhQUFLLFlBQVksUUFBUTtBQUFBLE1BQzNCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUE7QUFBQSxFQUlRLGNBQWMsSUFBNEI7QUFDaEQsVUFBTSxRQUFRLEtBQUssWUFBWTtBQUMvQixXQUFPLE1BQU07QUFDWCxZQUFNLE9BQU8sS0FBSyxZQUFZO0FBQzlCLFdBQUssWUFBWSxRQUFRO0FBQ3pCLFVBQUk7QUFDRixXQUFBO0FBQUEsTUFDRixVQUFBO0FBQ0UsYUFBSyxZQUFZLFFBQVE7QUFBQSxNQUMzQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdRLFFBQVEsUUFBZ0IsZUFBNEI7QUFDMUQsVUFBTSxTQUFTLEtBQUssUUFBUSxLQUFLLE1BQU07QUFDdkMsVUFBTSxjQUFjLEtBQUssT0FBTyxNQUFNLFFBQVEsTUFBTTtBQUVwRCxVQUFNLGVBQWUsS0FBSyxZQUFZO0FBQ3RDLFFBQUksZUFBZTtBQUNqQixXQUFLLFlBQVksUUFBUTtBQUFBLElBQzNCO0FBQ0EsVUFBTSxTQUFTLFlBQVk7QUFBQSxNQUFJLENBQUMsZUFDOUIsS0FBSyxZQUFZLFNBQVMsVUFBVTtBQUFBLElBQUE7QUFFdEMsU0FBSyxZQUFZLFFBQVE7QUFDekIsV0FBTyxVQUFVLE9BQU8sU0FBUyxPQUFPLE9BQU8sU0FBUyxDQUFDLElBQUk7QUFBQSxFQUMvRDtBQUFBLEVBRU8sVUFDTCxPQUNBLFFBQ0EsV0FDTTtBQUNOLFNBQUssY0FBYztBQUNuQixRQUFJO0FBQ0YsV0FBSyxRQUFRLFNBQVM7QUFDdEIsZ0JBQVUsWUFBWTtBQUN0QixXQUFLLFlBQVksTUFBTTtBQUN2QixXQUFLLFlBQVksTUFBTSxLQUFLLE1BQU07QUFDbEMsV0FBSyxZQUFZLE1BQU0sSUFBSSxhQUFhLE1BQU07QUFFOUMsZ0JBQVUsTUFBTTtBQUNkLGFBQUssZUFBZSxPQUFPLFNBQVM7QUFDcEMsYUFBSyxjQUFBO0FBQUEsTUFDUCxDQUFDO0FBRUQsYUFBTztBQUFBLElBQ1QsVUFBQTtBQUNFLFdBQUssY0FBYztBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBRU8sa0JBQWtCLE1BQXFCLFFBQXFCO0FBQ2pFLFNBQUssY0FBYyxNQUFNLE1BQU07QUFBQSxFQUNqQztBQUFBLEVBRU8sZUFBZSxNQUFrQixRQUFxQjtBQUMzRCxVQUFNLE9BQU8sU0FBUyxlQUFlLEVBQUU7QUFDdkMsUUFBSSxRQUFRO0FBQ1YsVUFBSyxPQUFlLFVBQVUsT0FBUSxPQUFlLFdBQVcsWUFBWTtBQUN6RSxlQUFlLE9BQU8sSUFBSTtBQUFBLE1BQzdCLE9BQU87QUFDTCxlQUFPLFlBQVksSUFBSTtBQUFBLE1BQ3pCO0FBQUEsSUFDRjtBQUVBLFVBQU0sT0FBTyxLQUFLLGFBQWEsTUFBTTtBQUNuQyxZQUFNLFdBQVcsS0FBSyx1QkFBdUIsS0FBSyxLQUFLO0FBQ3ZELFlBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFDdkQsVUFBSSxVQUFVO0FBQ1osb0JBQVksVUFBVSxNQUFNO0FBQzFCLGVBQUssY0FBYztBQUFBLFFBQ3JCLENBQUM7QUFBQSxNQUNILE9BQU87QUFDTCxhQUFLLGNBQWM7QUFBQSxNQUNyQjtBQUFBLElBQ0YsQ0FBQztBQUNELFNBQUssWUFBWSxNQUFNLElBQUk7QUFBQSxFQUM3QjtBQUFBLEVBRU8sb0JBQW9CLE1BQXVCLFFBQXFCO0FBQ3JFLFVBQU0sT0FBTyxTQUFTLGdCQUFnQixLQUFLLElBQUk7QUFFL0MsVUFBTSxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQ25DLFdBQUssUUFBUSxLQUFLLHVCQUF1QixLQUFLLEtBQUs7QUFBQSxJQUNyRCxDQUFDO0FBQ0QsU0FBSyxZQUFZLE1BQU0sSUFBSTtBQUUzQixRQUFJLFFBQVE7QUFDVCxhQUF1QixpQkFBaUIsSUFBSTtBQUFBLElBQy9DO0FBQUEsRUFDRjtBQUFBLEVBRU8sa0JBQWtCLE9BQXNCLFNBQXNCO0FBQUEsRUFFckU7QUFBQSxFQUVRLFlBQVksUUFBYSxNQUFXO0FBQzFDLFFBQUksQ0FBQyxPQUFPLGVBQWdCLFFBQU8saUJBQWlCLENBQUE7QUFDcEQsV0FBTyxlQUFlLEtBQUssSUFBSTtBQUFBLEVBQ2pDO0FBQUEsRUFFUSxTQUNOLE1BQ0EsTUFDd0I7QUFDeEIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLGNBQWMsQ0FBQyxLQUFLLFdBQVcsUUFBUTtBQUN4RCxhQUFPO0FBQUEsSUFDVDtBQUVBLFVBQU0sU0FBUyxLQUFLLFdBQVc7QUFBQSxNQUFLLENBQUMsU0FDbkMsS0FBSyxTQUFVLEtBQXlCLElBQUk7QUFBQSxJQUFBO0FBRTlDLFFBQUksUUFBUTtBQUNWLGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVRLEtBQUssYUFBMkIsUUFBb0I7QUFDMUQsVUFBTSxXQUFXLElBQUksU0FBUyxRQUFRLElBQUk7QUFFMUMsVUFBTSxNQUFNLE1BQU07QUFDaEIsWUFBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUV2RCxZQUFNLGdCQUFnQixXQUFXLElBQUksTUFBTSxLQUFLLFlBQVksS0FBSyxJQUFJLEtBQUssWUFBWTtBQUN0RixZQUFNLFlBQVksS0FBSyxZQUFZO0FBQ25DLFdBQUssWUFBWSxRQUFRO0FBR3pCLFlBQU0sVUFBcUIsQ0FBQTtBQUMzQixjQUFRLEtBQUssQ0FBQyxDQUFDLEtBQUssUUFBUyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQXNCLEtBQUssQ0FBQztBQUV6RSxVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFDZixtQkFBVyxjQUFjLFlBQVksTUFBTSxDQUFDLEdBQUc7QUFDN0MsY0FBSSxLQUFLLFNBQVMsV0FBVyxDQUFDLEdBQW9CLENBQUMsU0FBUyxDQUFDLEdBQUc7QUFDOUQsa0JBQU0sTUFBTSxDQUFDLENBQUMsS0FBSyxRQUFTLFdBQVcsQ0FBQyxFQUFzQixLQUFLO0FBQ25FLG9CQUFRLEtBQUssR0FBRztBQUNoQixnQkFBSSxJQUFLO0FBQUEsVUFDWCxXQUFXLEtBQUssU0FBUyxXQUFXLENBQUMsR0FBb0IsQ0FBQyxPQUFPLENBQUMsR0FBRztBQUNuRSxvQkFBUSxLQUFLLElBQUk7QUFDakI7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFDQSxXQUFLLFlBQVksUUFBUTtBQUV6QixZQUFNLE9BQU8sTUFBTTtBQUNqQixpQkFBUyxNQUFBLEVBQVEsUUFBUSxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQztBQUNuRCxpQkFBUyxNQUFBO0FBRVQsY0FBTSxlQUFlLEtBQUssWUFBWTtBQUN0QyxhQUFLLFlBQVksUUFBUTtBQUN6QixZQUFJO0FBQ0YsY0FBSSxRQUFRLENBQUMsR0FBRztBQUNkLHdCQUFZLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxNQUFNLFFBQWU7QUFDOUM7QUFBQSxVQUNGO0FBRUEsbUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxRQUFRLEtBQUs7QUFDdkMsZ0JBQUksUUFBUSxDQUFDLEdBQUc7QUFDZCwwQkFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sTUFBTSxRQUFlO0FBQzlDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGLFVBQUE7QUFDRSxlQUFLLFlBQVksUUFBUTtBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUVBLFVBQUksVUFBVTtBQUNaLG9CQUFZLFVBQVUsSUFBSTtBQUFBLE1BQzVCLE9BQU87QUFDTCxhQUFBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQyxhQUFpQixNQUFNLGlCQUFpQixLQUFLLGNBQWMsR0FBRztBQUUvRCxVQUFNLE9BQU8sS0FBSyxhQUFhLEdBQUc7QUFDbEMsU0FBSyxZQUFZLFVBQVUsSUFBSTtBQUFBLEVBQ2pDO0FBQUEsRUFFUSxPQUFPLE1BQXVCLE1BQXFCLFFBQWM7QUFDdkUsVUFBTSxVQUFVLEtBQUssU0FBUyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzVDLFFBQUksU0FBUztBQUNYLFdBQUssWUFBWSxNQUFNLE1BQU0sUUFBUSxPQUFPO0FBQUEsSUFDOUMsT0FBTztBQUNMLFdBQUssY0FBYyxNQUFNLE1BQU0sTUFBTTtBQUFBLElBQ3ZDO0FBQUEsRUFDRjtBQUFBLEVBRVEsY0FBYyxNQUF1QixNQUFxQixRQUFjO0FBQzlFLFVBQU0sV0FBVyxJQUFJLFNBQVMsUUFBUSxNQUFNO0FBQzVDLFVBQU0sZ0JBQWdCLEtBQUssWUFBWTtBQUV2QyxVQUFNLE1BQU0sTUFBTTtBQUNoQixZQUFNLFNBQVMsS0FBSyxRQUFRLEtBQUssS0FBSyxLQUFLO0FBQzNDLFlBQU0sQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWTtBQUFBLFFBQzdDLEtBQUssT0FBTyxRQUFRLE1BQU07QUFBQSxNQUFBO0FBRTVCLFlBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFFdkQsWUFBTSxPQUFPLE1BQU07QUFDakIsaUJBQVMsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUM7QUFDbkQsaUJBQVMsTUFBQTtBQUVULFlBQUksUUFBUTtBQUNaLG1CQUFXLFFBQVEsVUFBVTtBQUMzQixnQkFBTSxjQUFtQixFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUE7QUFDbkMsY0FBSSxJQUFLLGFBQVksR0FBRyxJQUFJO0FBRTVCLGVBQUssWUFBWSxRQUFRLElBQUksTUFBTSxlQUFlLFdBQVc7QUFDN0QsZUFBSyxjQUFjLE1BQU0sUUFBZTtBQUN4QyxtQkFBUztBQUFBLFFBQ1g7QUFDQSxhQUFLLFlBQVksUUFBUTtBQUFBLE1BQzNCO0FBRUEsVUFBSSxVQUFVO0FBQ1osb0JBQVksVUFBVSxJQUFJO0FBQUEsTUFDNUIsT0FBTztBQUNMLGFBQUE7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVDLGFBQWlCLE1BQU0saUJBQWlCLEtBQUssY0FBYyxHQUFHO0FBRS9ELFVBQU0sT0FBTyxLQUFLLGFBQWEsR0FBRztBQUNsQyxTQUFLLFlBQVksVUFBVSxJQUFJO0FBQUEsRUFDakM7QUFBQSxFQUVRLGVBQWUsTUFBa0I7QWhCNVlwQztBZ0I4WUgsUUFBSyxLQUFhLGdCQUFnQjtBQUMvQixXQUFhLGVBQUE7QUFBQSxJQUNoQjtBQUdBLFFBQUssS0FBYSxnQkFBZ0I7QUFDL0IsV0FBYSxlQUFlLFFBQVEsQ0FBQyxTQUFjO0FBQ2xELFlBQUksT0FBTyxLQUFLLFFBQVEsWUFBWTtBQUNsQyxlQUFLLElBQUE7QUFBQSxRQUNQO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUdBLGVBQUssZUFBTCxtQkFBaUIsUUFBUSxDQUFDLFVBQVUsS0FBSyxlQUFlLEtBQUs7QUFBQSxFQUMvRDtBQUFBLEVBRVEsWUFBWSxNQUF1QixNQUFxQixRQUFjLFNBQTBCO0FBQ3RHLFVBQU0sV0FBVyxJQUFJLFNBQVMsUUFBUSxNQUFNO0FBQzVDLFVBQU0sZ0JBQWdCLEtBQUssWUFBWTtBQUN2QyxVQUFNLGlDQUFpQixJQUFBO0FBRXZCLFVBQU0sTUFBTSxNQUFNO0FBQ2hCLFlBQU0sU0FBUyxLQUFLLFFBQVEsS0FBSyxLQUFLLEtBQUs7QUFDM0MsWUFBTSxDQUFDLE1BQU0sVUFBVSxRQUFRLElBQUksS0FBSyxZQUFZO0FBQUEsUUFDbEQsS0FBSyxPQUFPLFFBQVEsTUFBTTtBQUFBLE1BQUE7QUFFNUIsWUFBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUd2RCxZQUFNLFdBQXdELENBQUE7QUFDOUQsWUFBTSwrQkFBZSxJQUFBO0FBQ3JCLFVBQUksUUFBUTtBQUNaLGlCQUFXLFFBQVEsVUFBVTtBQUMzQixjQUFNLGNBQW1CLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBQTtBQUNuQyxZQUFJLFNBQVUsYUFBWSxRQUFRLElBQUk7QUFDdEMsYUFBSyxZQUFZLFFBQVEsSUFBSSxNQUFNLGVBQWUsV0FBVztBQUM3RCxjQUFNLE1BQU0sS0FBSyxRQUFRLFFBQVEsS0FBSztBQUV0QyxZQUFJLEtBQUssU0FBUyxpQkFBaUIsU0FBUyxJQUFJLEdBQUcsR0FBRztBQUNwRCxrQkFBUSxLQUFLLDhDQUE4QyxHQUFHLDBEQUEwRDtBQUFBLFFBQzFIO0FBQ0EsaUJBQVMsSUFBSSxHQUFHO0FBRWhCLGlCQUFTLEtBQUssRUFBRSxNQUFZLEtBQUssT0FBTyxLQUFVO0FBQ2xEO0FBQUEsTUFDRjtBQUVBLFlBQU0sT0FBTyxNQUFNO0FoQjlibEI7QWdCZ2NDLGNBQU0sWUFBWSxJQUFJLElBQUksU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztBQUNwRCxtQkFBVyxDQUFDLEtBQUssT0FBTyxLQUFLLFlBQVk7QUFDdkMsY0FBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUc7QUFDdkIsaUJBQUssWUFBWSxPQUFPO0FBQ3hCLDBCQUFRLGVBQVIsbUJBQW9CLFlBQVk7QUFDaEMsdUJBQVcsT0FBTyxHQUFHO0FBQUEsVUFDdkI7QUFBQSxRQUNGO0FBR0EsY0FBTUMsVUFBVSxTQUFpQixJQUFJO0FBQ3JDLFlBQUksZUFBc0IsU0FBaUI7QUFFM0MsbUJBQVcsRUFBRSxNQUFNLEtBQUssSUFBQSxLQUFTLFVBQVU7QUFDekMsZ0JBQU0sY0FBbUIsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFBO0FBQ25DLGNBQUksU0FBVSxhQUFZLFFBQVEsSUFBSTtBQUN0QyxlQUFLLFlBQVksUUFBUSxJQUFJLE1BQU0sZUFBZSxXQUFXO0FBRTdELGNBQUksV0FBVyxJQUFJLEdBQUcsR0FBRztBQUN2QixrQkFBTSxVQUFVLFdBQVcsSUFBSSxHQUFHO0FBR2xDLGdCQUFJLGFBQWEsZ0JBQWdCLFNBQVM7QUFDeENBLHNCQUFPLGFBQWEsU0FBUyxhQUFhLFdBQVc7QUFBQSxZQUN2RDtBQUNBLDJCQUFlO0FBR2Ysa0JBQU0sWUFBYSxRQUFnQjtBQUNuQyxnQkFBSSxXQUFXO0FBQ2Isd0JBQVUsSUFBSSxNQUFNLElBQUk7QUFDeEIsa0JBQUksU0FBVSxXQUFVLElBQUksVUFBVSxHQUFHO0FBR3pDLG1CQUFLLGVBQWUsT0FBTztBQUFBLFlBQzdCO0FBQUEsVUFDRixPQUFPO0FBQ0wsa0JBQU0sVUFBVSxLQUFLLGNBQWMsTUFBTSxRQUFlO0FBQ3hELGdCQUFJLFNBQVM7QUFFWCxrQkFBSSxhQUFhLGdCQUFnQixTQUFTO0FBQ3hDQSx3QkFBTyxhQUFhLFNBQVMsYUFBYSxXQUFXO0FBQUEsY0FDdkQ7QUFDQSw2QkFBZTtBQUNmLHlCQUFXLElBQUksS0FBSyxPQUFPO0FBRTFCLHNCQUFnQixlQUFlLEtBQUssWUFBWTtBQUFBLFlBQ25EO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFDQSxhQUFLLFlBQVksUUFBUTtBQUFBLE1BQzNCO0FBRUEsVUFBSSxVQUFVO0FBQ1osb0JBQVksVUFBVSxJQUFJO0FBQUEsTUFDNUIsT0FBTztBQUNMLGFBQUE7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVDLGFBQWlCLE1BQU0saUJBQWlCLEtBQUssY0FBYyxHQUFHO0FBRS9ELFVBQU0sT0FBTyxLQUFLLGFBQWEsR0FBRztBQUNsQyxTQUFLLFlBQVksVUFBVSxJQUFJO0FBQUEsRUFDakM7QUFBQSxFQUdRLGVBQWUsT0FBc0IsUUFBcUI7QUFDaEUsUUFBSSxVQUFVO0FBQ2QsVUFBTSxlQUFlLEtBQUssWUFBWTtBQUN0QyxRQUFJLGFBQTJCO0FBRS9CLFdBQU8sVUFBVSxNQUFNLFFBQVE7QUFDN0IsWUFBTSxPQUFPLE1BQU0sU0FBUztBQUM1QixVQUFJLEtBQUssU0FBUyxXQUFXO0FBQzNCLGNBQU0sS0FBSztBQUdYLGNBQU0sT0FBTyxLQUFLLFNBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN2QyxZQUFJLE1BQU07QUFDUixjQUFJLENBQUMsWUFBWTtBQUNmLHlCQUFhLElBQUksTUFBTSxZQUFZO0FBQ25DLGlCQUFLLFlBQVksUUFBUTtBQUFBLFVBQzNCO0FBQ0EsZUFBSyxRQUFRLEtBQUssS0FBSztBQUFBLFFBQ3pCO0FBR0EsY0FBTSxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sYUFBYSxLQUFLLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNoRCxjQUFNLFdBQVcsS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDNUMsY0FBTSxRQUFRLEtBQUssU0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRXpDLFlBQUksS0FBSyxTQUFTLGVBQWU7QUFDL0IsZ0JBQU0sa0JBQWtCLENBQUMsUUFBUSxZQUFZLFVBQVUsS0FBSyxFQUFFLE9BQU8sQ0FBQSxNQUFLLENBQUMsRUFBRTtBQUM3RSxjQUFJLGtCQUFrQixHQUFHO0FBQ3ZCLGlCQUFLLE1BQU0sV0FBVyxnQ0FBZ0MsQ0FBQSxHQUFJLEdBQUcsSUFBSTtBQUFBLFVBQ25FO0FBQUEsUUFDRjtBQUdBLFlBQUksT0FBTztBQUNULGVBQUssT0FBTyxPQUFPLElBQUksTUFBTztBQUM5QjtBQUFBLFFBQ0Y7QUFFQSxZQUFJLFFBQVE7QUFDVixnQkFBTSxjQUE0QixDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7QUFFL0MsaUJBQU8sVUFBVSxNQUFNLFFBQVE7QUFDN0Isa0JBQU0sT0FBTyxNQUFNLE9BQU87QUFDMUIsZ0JBQUksS0FBSyxTQUFTLFVBQVc7QUFDN0Isa0JBQU0sT0FBTyxLQUFLLFNBQVMsTUFBdUI7QUFBQSxjQUNoRDtBQUFBLGNBQ0E7QUFBQSxZQUFBLENBQ0Q7QUFDRCxnQkFBSSxNQUFNO0FBQ1IsMEJBQVksS0FBSyxDQUFDLE1BQXVCLElBQUksQ0FBQztBQUM5Qyx5QkFBVztBQUFBLFlBQ2IsT0FBTztBQUNMO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFFQSxlQUFLLEtBQUssYUFBYSxNQUFPO0FBQzlCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFQSxXQUFLLFNBQVMsTUFBTSxNQUFNO0FBQUEsSUFDNUI7QUFFQSxTQUFLLFlBQVksUUFBUTtBQUFBLEVBQzNCO0FBQUEsRUFFUSxjQUFjLE1BQXFCLFFBQWlDO0FoQnZrQnZFO0FnQndrQkgsUUFBSTtBQUNGLFVBQUksS0FBSyxTQUFTLFFBQVE7QUFDeEIsY0FBTSxXQUFXLEtBQUssU0FBUyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzlDLGNBQU0sT0FBTyxXQUFXLFNBQVMsUUFBUTtBQUN6QyxjQUFNLFFBQVEsS0FBSyxZQUFZLE1BQU0sSUFBSSxRQUFRO0FBQ2pELFlBQUksU0FBUyxNQUFNLElBQUksR0FBRztBQUN4QixnQkFBTSxPQUFPLEtBQUssWUFBWTtBQUc5QixjQUFJLE1BQU0sSUFBSSxFQUFFLFlBQVksWUFBWSxRQUFRLE1BQU0sSUFBSSxFQUFFO0FBQzVELGVBQUssZUFBZSxNQUFNLElBQUksR0FBRyxNQUFNO0FBQ3ZDLGVBQUssWUFBWSxRQUFRO0FBQUEsUUFDM0I7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUVBLFlBQU0sU0FBUyxLQUFLLFNBQVM7QUFDN0IsWUFBTSxjQUFjLENBQUMsQ0FBQyxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBRTdDLFlBQU0sVUFBVSxTQUFTLFNBQVMsU0FBUyxjQUFjLEtBQUssSUFBSTtBQUNsRSxZQUFNLGVBQWUsS0FBSyxZQUFZO0FBRXRDLFVBQUksV0FBVyxZQUFZLFFBQVE7QUFDakMsYUFBSyxZQUFZLE1BQU0sSUFBSSxRQUFRLE9BQU87QUFBQSxNQUM1QztBQUVBLFVBQUksYUFBYTtBQUVmLFlBQUksWUFBaUIsQ0FBQTtBQUNyQixjQUFNLFdBQVcsS0FBSyxXQUFXO0FBQUEsVUFBTyxDQUFDLFNBQ3RDLEtBQXlCLEtBQUssV0FBVyxJQUFJO0FBQUEsUUFBQTtBQUVoRCxjQUFNLE9BQU8sS0FBSyxvQkFBb0IsUUFBNkI7QUFLbkUsY0FBTSxRQUE2QixFQUFFLFNBQVMsR0FBQztBQUMvQyxjQUFNLFFBQVEsUUFBUSxLQUFLLFlBQVk7QUFDdkMsbUJBQVcsU0FBUyxLQUFLLFVBQVU7QUFDakMsY0FBSSxNQUFNLFNBQVMsV0FBVztBQUM1QixrQkFBTSxXQUFXLEtBQUssU0FBUyxPQUF3QixDQUFDLE9BQU8sQ0FBQztBQUNoRSxnQkFBSSxVQUFVO0FBQ1osb0JBQU0sT0FBTyxTQUFTO0FBQ3RCLGtCQUFJLENBQUMsTUFBTSxJQUFJLEdBQUc7QUFDaEIsc0JBQU0sSUFBSSxJQUFJLENBQUE7QUFDZCxzQkFBTSxJQUFJLEVBQUUsUUFBUSxLQUFLLFlBQVk7QUFBQSxjQUN2QztBQUNBLG9CQUFNLElBQUksRUFBRSxLQUFLLEtBQUs7QUFDdEI7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUNBLGdCQUFNLFFBQVEsS0FBSyxLQUFLO0FBQUEsUUFDMUI7QUFFQSxhQUFJLFVBQUssU0FBUyxLQUFLLElBQUksTUFBdkIsbUJBQTBCLE1BQU07QUFDbEMsZ0JBQU0sUUFBUSxLQUFLLFNBQVMsS0FBSyxJQUFJO0FBRXJDLGNBQUksTUFBTSxVQUFVO0FBQ2xCLGtCQUFNLGdCQUFnQixLQUFLLGVBQWUsTUFBTyxNQUFNLFNBQWlCLFlBQVksRUFBRTtBQUN0RixrQkFBTSxtQkFBd0IsSUFBSSxNQUFNLFNBQVMsRUFBRSxNQUFNLENBQUEsR0FBSSxLQUFLLFNBQVMsWUFBWSxLQUFBLENBQU07QUFDN0YsaUJBQUssWUFBWSxnQkFBZ0I7QUFDaEMsb0JBQWdCLGtCQUFrQjtBQUNuQyxpQkFBSyx3QkFBd0Isa0JBQWtCLGVBQWUsU0FBd0IsWUFBWTtBQUFBLFVBQ3BHO0FBRUEsY0FBSSxDQUFFLE1BQWMsVUFBVTtBQUMzQixrQkFBYyxXQUFZLE1BQU0sWUFBOEMsS0FBSyxDQUFDLFFBQVE7QUFDM0Ysb0JBQU0sUUFBUSxLQUFLLGVBQWUsTUFBTyxJQUFZLFlBQVksRUFBRTtBQUNuRSxvQkFBTSxZQUFZO0FBQ2xCLHFCQUFPLE1BQU07QUFDYixxQkFBUSxNQUFjO0FBQUEsWUFDeEIsQ0FBQztBQUFBLFVBQ0g7QUFFQyxnQkFBYyxTQUFTLEtBQUssTUFBTTtBQUNqQyxpQkFBSyxRQUFRLE9BQXNCO0FBQ2xDLG9CQUF3QixZQUFZO0FBQ3JDLGtCQUFNLE1BQU0sTUFBTTtBQUNsQixrQkFBTSxXQUFnQixJQUFJLElBQUksRUFBRSxNQUFZLEtBQUssU0FBUyxZQUFZLE1BQU07QUFDNUUsaUJBQUssWUFBWSxRQUFRO0FBQ3hCLG9CQUFnQixrQkFBa0I7QUFDbkMsaUJBQUssd0JBQXdCLFVBQVUsTUFBTSxPQUFRLFNBQXdCLGNBQWMsS0FBSztBQUFBLFVBQ2xHLENBQUM7QUFFRCxjQUFJLFFBQVE7QUFDVixnQkFBSyxPQUFlLFVBQVUsT0FBUSxPQUFlLFdBQVcsWUFBWTtBQUN6RSxxQkFBZSxPQUFPLE9BQU87QUFBQSxZQUNoQyxPQUFPO0FBQ0wscUJBQU8sWUFBWSxPQUFPO0FBQUEsWUFDNUI7QUFBQSxVQUNGO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsYUFBSSxVQUFLLFNBQVMsS0FBSyxJQUFJLE1BQXZCLG1CQUEwQixXQUFXO0FBQ3ZDLHNCQUFZLElBQUssS0FBSyxTQUFTLEtBQUssSUFBSSxFQUFFLFVBQTZCO0FBQUEsWUFDckU7QUFBQSxZQUNBLEtBQUs7QUFBQSxZQUNMLFlBQVk7QUFBQSxVQUFBLENBQ2I7QUFFRCxlQUFLLFlBQVksU0FBUztBQUN6QixrQkFBZ0Isa0JBQWtCO0FBRW5DLGNBQUksS0FBSyxTQUFTLFlBQVkscUJBQXFCLFFBQVE7QUFDekQsa0JBQU0sYUFBYSxJQUFJLE1BQU0sY0FBYyxTQUFTO0FBQ3BELHNCQUFVLFVBQVUsS0FBSyxjQUFjLEtBQUssVUFBVSxRQUFXLFVBQVUsQ0FBQztBQUFBLFVBQzlFO0FBRUEsZUFBSyx3QkFBd0IsV0FBVyxLQUFLLGFBQWEsS0FBSyxJQUFJLEdBQUcsU0FBd0IsY0FBYyxLQUFLO0FBQUEsUUFDbkg7QUFDQSxZQUFJLFFBQVE7QUFDVixjQUFLLE9BQWUsVUFBVSxPQUFRLE9BQWUsV0FBVyxZQUFZO0FBQ3pFLG1CQUFlLE9BQU8sT0FBTztBQUFBLFVBQ2hDLE9BQU87QUFDTCxtQkFBTyxZQUFZLE9BQU87QUFBQSxVQUM1QjtBQUFBLFFBQ0Y7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUVBLFVBQUksQ0FBQyxRQUFRO0FBRVgsY0FBTSxTQUFTLEtBQUssV0FBVztBQUFBLFVBQU8sQ0FBQyxTQUNwQyxLQUF5QixLQUFLLFdBQVcsTUFBTTtBQUFBLFFBQUE7QUFHbEQsbUJBQVcsU0FBUyxRQUFRO0FBQzFCLGVBQUssb0JBQW9CLFNBQVMsS0FBd0I7QUFBQSxRQUM1RDtBQUdBLGNBQU0sYUFBYSxLQUFLLFdBQVc7QUFBQSxVQUNqQyxDQUFDLFNBQVMsQ0FBRSxLQUF5QixLQUFLLFdBQVcsR0FBRztBQUFBLFFBQUE7QUFHMUQsbUJBQVcsUUFBUSxZQUFZO0FBQzdCLGVBQUssU0FBUyxNQUFNLE9BQU87QUFBQSxRQUM3QjtBQUdBLGNBQU0sc0JBQXNCLEtBQUssV0FBVyxPQUFPLENBQUMsU0FBUztBQUMzRCxnQkFBTSxPQUFRLEtBQXlCO0FBQ3ZDLGlCQUNFLEtBQUssV0FBVyxHQUFHLEtBQ25CLENBQUMsQ0FBQyxPQUFPLFdBQVcsU0FBUyxTQUFTLFFBQVEsUUFBUSxNQUFNLEVBQUU7QUFBQSxZQUM1RDtBQUFBLFVBQUEsS0FFRixDQUFDLEtBQUssV0FBVyxNQUFNLEtBQ3ZCLENBQUMsS0FBSyxXQUFXLElBQUk7QUFBQSxRQUV6QixDQUFDO0FBRUQsbUJBQVcsUUFBUSxxQkFBcUI7QUFDdEMsZ0JBQU0sV0FBWSxLQUF5QixLQUFLLE1BQU0sQ0FBQztBQUV2RCxjQUFJLGFBQWEsU0FBUztBQUN4QixrQkFBTSxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQ25DLG9CQUFNLFFBQVEsS0FBSyxRQUFTLEtBQXlCLEtBQUs7QUFDMUQsb0JBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFDdkQsb0JBQU0sT0FBTyxNQUFNO0FBQ2hCLHdCQUF3QixhQUFhLFNBQVMsS0FBSztBQUFBLGNBQ3REO0FBRUEsa0JBQUksVUFBVTtBQUNaLDRCQUFZLFVBQVUsSUFBSTtBQUFBLGNBQzVCLE9BQU87QUFDTCxxQkFBQTtBQUFBLGNBQ0Y7QUFBQSxZQUNGLENBQUM7QUFDRCxpQkFBSyxZQUFZLFNBQVMsSUFBSTtBQUFBLFVBQ2hDLE9BQU87QUFDTCxrQkFBTSxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQ25DLG9CQUFNLFFBQVEsS0FBSyxRQUFTLEtBQXlCLEtBQUs7QUFDMUQsb0JBQU0sV0FBVyxLQUFLLFlBQVksTUFBTSxJQUFJLFdBQVc7QUFDdkQsb0JBQU0sT0FBTyxNQUFNO0FBQ2pCLG9CQUFJLFVBQVUsU0FBUyxVQUFVLFFBQVEsVUFBVSxRQUFXO0FBQzVELHNCQUFJLGFBQWEsU0FBUztBQUN2Qiw0QkFBd0IsZ0JBQWdCLFFBQVE7QUFBQSxrQkFDbkQ7QUFBQSxnQkFDRixPQUFPO0FBQ0wsc0JBQUksYUFBYSxTQUFTO0FBQ3hCLDBCQUFNLFdBQVksUUFBd0IsYUFBYSxPQUFPO0FBQzlELDBCQUFNLFdBQVcsWUFBWSxDQUFDLFNBQVMsU0FBUyxLQUFLLElBQ2pELEdBQUcsU0FBUyxTQUFTLEdBQUcsSUFBSSxXQUFXLFdBQVcsR0FBRyxJQUFJLEtBQUssS0FDOUQ7QUFDSCw0QkFBd0IsYUFBYSxTQUFTLFFBQVE7QUFBQSxrQkFDekQsT0FBTztBQUNKLDRCQUF3QixhQUFhLFVBQVUsS0FBSztBQUFBLGtCQUN2RDtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUVBLGtCQUFJLFVBQVU7QUFDWiw0QkFBWSxVQUFVLElBQUk7QUFBQSxjQUM1QixPQUFPO0FBQ0wscUJBQUE7QUFBQSxjQUNGO0FBQUEsWUFDRixDQUFDO0FBQ0QsaUJBQUssWUFBWSxTQUFTLElBQUk7QUFBQSxVQUNoQztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBRUEsVUFBSSxVQUFVLENBQUMsUUFBUTtBQUNyQixZQUFLLE9BQWUsVUFBVSxPQUFRLE9BQWUsV0FBVyxZQUFZO0FBQ3pFLGlCQUFlLE9BQU8sT0FBTztBQUFBLFFBQ2hDLE9BQU87QUFDTCxpQkFBTyxZQUFZLE9BQU87QUFBQSxRQUM1QjtBQUFBLE1BQ0Y7QUFFQSxZQUFNLFVBQVUsS0FBSyxTQUFTLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDNUMsVUFBSSxXQUFXLENBQUMsUUFBUTtBQUN0QixjQUFNLFdBQVcsUUFBUSxNQUFNLEtBQUE7QUFDL0IsY0FBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUN2RCxZQUFJLFVBQVU7QUFDWixtQkFBUyxRQUFRLElBQUk7QUFBQSxRQUN2QixPQUFPO0FBQ0wsZUFBSyxZQUFZLE1BQU0sSUFBSSxVQUFVLE9BQU87QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFFQSxVQUFJLEtBQUssTUFBTTtBQUNiLGVBQU87QUFBQSxNQUNUO0FBRUEsV0FBSyxlQUFlLEtBQUssVUFBVSxPQUFPO0FBQzFDLFdBQUssWUFBWSxRQUFRO0FBRXpCLGFBQU87QUFBQSxJQUNULFNBQVMsR0FBUTtBQUNmLFVBQUksYUFBYSxZQUFhLE9BQU0sRUFBRSxRQUFRLEtBQUssSUFBSTtBQUN2RCxXQUFLLE1BQU0sV0FBVyxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsR0FBRyxDQUFDLEdBQUEsR0FBTSxLQUFLLElBQUk7QUFBQSxJQUNsRjtBQUFBLEVBQ0Y7QUFBQSxFQUVRLG9CQUFvQixNQUE4QztBQUN4RSxRQUFJLENBQUMsS0FBSyxRQUFRO0FBQ2hCLGFBQU8sQ0FBQTtBQUFBLElBQ1Q7QUFDQSxVQUFNLFNBQThCLENBQUE7QUFDcEMsZUFBVyxPQUFPLE1BQU07QUFDdEIsWUFBTSxNQUFNLElBQUksS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLFVBQUksS0FBSyxTQUFTLGlCQUFpQixJQUFJLGNBQWMsV0FBVyxJQUFJLEdBQUc7QUFDckUsY0FBTSxVQUFVLElBQUksTUFBTSxLQUFBO0FBQzFCLGNBQU0sYUFBYSw4QkFBOEIsS0FBSyxPQUFPLEtBQUssQ0FBQyxRQUFRLFNBQVMsSUFBSTtBQUN4RixZQUFJLFlBQVk7QUFDZCxrQkFBUTtBQUFBLFlBQ04sY0FBYyxHQUFHLEtBQUssSUFBSSxLQUFLO0FBQUEsVUFBQTtBQUFBLFFBS25DO0FBQUEsTUFDRjtBQUNBLGFBQU8sR0FBRyxJQUFJLEtBQUssUUFBUSxJQUFJLEtBQUs7QUFBQSxJQUN0QztBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxvQkFBb0IsU0FBZSxNQUE2QjtBQUN0RSxVQUFNLENBQUMsV0FBVyxHQUFHLFNBQVMsSUFBSSxLQUFLLEtBQUssTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRztBQUNuRSxVQUFNLGdCQUFnQixJQUFJLE1BQU0sS0FBSyxZQUFZLEtBQUs7QUFDdEQsVUFBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUV2RCxVQUFNLFVBQWUsQ0FBQTtBQUNyQixRQUFJLFlBQVksU0FBUyxrQkFBa0I7QUFDekMsY0FBUSxTQUFTLFNBQVMsaUJBQWlCO0FBQUEsSUFDN0M7QUFDQSxRQUFJLFVBQVUsU0FBUyxNQUFNLFdBQVcsT0FBTztBQUMvQyxRQUFJLFVBQVUsU0FBUyxTQUFTLFdBQVcsVUFBVTtBQUNyRCxRQUFJLFVBQVUsU0FBUyxTQUFTLFdBQVcsVUFBVTtBQUdyRCxVQUFNLG1CQUFtQixDQUFDLFdBQVcsUUFBUSxRQUFRLFdBQVcsV0FBVyxRQUFRLFNBQVMsT0FBTyxNQUFNO0FBQ3pHLFVBQU0sd0JBQXdCLFVBQVUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsU0FBUyxFQUFFLFlBQUEsQ0FBYSxDQUFDO0FBRWpHLFlBQVE7QUFBQSxNQUNOO0FBQUEsTUFDQSxDQUFDLFVBQWU7QUFDZCxZQUFJLHNCQUFzQixTQUFTLEdBQUc7QUFDcEMsZ0JBQU0sVUFBVSxzQkFBc0IsS0FBSyxDQUFDLE1BQU07QWhCbjJCckQ7QWdCbzJCSyxrQkFBTSxTQUFTLEVBQUUsWUFBQTtBQUNqQixnQkFBSSxRQUFRLE1BQU0sS0FBSyxRQUFRLE1BQU0sRUFBRSxTQUFTLE1BQU0sR0FBRyxFQUFHLFFBQU87QUFDbkUsZ0JBQUksYUFBVyxXQUFNLFFBQU4sbUJBQVcsZUFBZSxRQUFPO0FBQ2hELG1CQUFPO0FBQUEsVUFDVCxDQUFDO0FBQ0QsY0FBSSxDQUFDLFNBQVM7QUFDWjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBRUEsWUFBSSxVQUFVLFNBQVMsTUFBTSxLQUFLLENBQUMsTUFBTSxRQUFTO0FBQ2xELFlBQUksVUFBVSxTQUFTLE9BQU8sS0FBSyxDQUFDLE1BQU0sU0FBVTtBQUNwRCxZQUFJLFVBQVUsU0FBUyxLQUFLLEtBQUssQ0FBQyxNQUFNLE9BQVE7QUFDaEQsWUFBSSxVQUFVLFNBQVMsTUFBTSxLQUFLLENBQUMsTUFBTSxRQUFTO0FBRWxELFlBQUksVUFBVSxTQUFTLFNBQVMsU0FBUyxlQUFBO0FBQ3pDLFlBQUksVUFBVSxTQUFTLE1BQU0sU0FBUyxnQkFBQTtBQUN0QyxzQkFBYyxJQUFJLFVBQVUsS0FBSztBQUNqQyxhQUFLLFFBQVEsS0FBSyxPQUFPLGFBQWE7QUFBQSxNQUN4QztBQUFBLE1BQ0E7QUFBQSxJQUFBO0FBQUEsRUFFSjtBQUFBLEVBRVEsdUJBQXVCLE1BQXNCO0FBQ25ELFFBQUksQ0FBQyxNQUFNO0FBQ1QsYUFBTztBQUFBLElBQ1Q7QUFDQSxVQUFNLFFBQVE7QUFDZCxRQUFJLE1BQU0sS0FBSyxJQUFJLEdBQUc7QUFDcEIsYUFBTyxLQUFLLFFBQVEsdUJBQXVCLENBQUMsR0FBRyxnQkFBZ0I7QUFDN0QsZUFBTyxLQUFLLG1CQUFtQixXQUFXO0FBQUEsTUFDNUMsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRVEsbUJBQW1CLFFBQXdCO0FBQ2pELFVBQU0sU0FBUyxLQUFLLFFBQVEsS0FBSyxNQUFNO0FBQ3ZDLFVBQU0sY0FBYyxLQUFLLE9BQU8sTUFBTSxRQUFRLE1BQU07QUFFcEQsUUFBSSxTQUFTO0FBQ2IsZUFBVyxjQUFjLGFBQWE7QUFDcEMsZ0JBQVUsR0FBRyxLQUFLLFlBQVksU0FBUyxVQUFVLENBQUM7QUFBQSxJQUNwRDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxZQUFZLE1BQWlCO0FoQnA1QmhDO0FnQnM1QkgsUUFBSSxLQUFLLGlCQUFpQjtBQUN4QixZQUFNLFdBQVcsS0FBSztBQUN0QixVQUFJLFNBQVMsV0FBVztBQUN0QixpQkFBUyxVQUFBO0FBQUEsTUFDWDtBQUNBLFVBQUksU0FBUyxpQkFBa0IsVUFBUyxpQkFBaUIsTUFBQTtBQUFBLElBQzNEO0FBR0EsUUFBSSxLQUFLLGdCQUFnQjtBQUN2QixXQUFLLGVBQWUsUUFBUSxDQUFDLFNBQXFCLE1BQU07QUFDeEQsV0FBSyxpQkFBaUIsQ0FBQTtBQUFBLElBQ3hCO0FBR0EsUUFBSSxLQUFLLFlBQVk7QUFDbkIsZUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLFdBQVcsUUFBUSxLQUFLO0FBQy9DLGNBQU0sT0FBTyxLQUFLLFdBQVcsQ0FBQztBQUM5QixZQUFJLEtBQUssZ0JBQWdCO0FBQ3ZCLGVBQUssZUFBZSxRQUFRLENBQUMsU0FBcUIsTUFBTTtBQUN4RCxlQUFLLGlCQUFpQixDQUFBO0FBQUEsUUFDeEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUdBLGVBQUssZUFBTCxtQkFBaUIsUUFBUSxDQUFDLFVBQWUsS0FBSyxZQUFZLEtBQUs7QUFBQSxFQUNqRTtBQUFBLEVBRU8sUUFBUSxXQUEwQjtBQUN2QyxjQUFVLFdBQVcsUUFBUSxDQUFDLFVBQVUsS0FBSyxZQUFZLEtBQUssQ0FBQztBQUFBLEVBQ2pFO0FBQUEsRUFFTyxlQUFlRixpQkFBZ0MsV0FBd0IsU0FBaUMsQ0FBQSxHQUFVO0FBQ3ZILFNBQUssUUFBUSxTQUFTO0FBQ3RCLGNBQVUsWUFBWTtBQUV0QixVQUFNLFdBQVlBLGdCQUF1QjtBQUN6QyxRQUFJLENBQUMsU0FBVTtBQUVmLFVBQU0sUUFBUSxLQUFLLGVBQWUsTUFBTSxRQUFRO0FBQ2hELFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxjQUFVLFlBQVksSUFBSTtBQUUxQixVQUFNLFlBQVksSUFBSUEsZ0JBQWUsRUFBRSxNQUFNLEVBQUUsT0FBQSxHQUFrQixLQUFLLE1BQU0sWUFBWSxLQUFBLENBQU07QUFDOUYsU0FBSyxZQUFZLFNBQVM7QUFDekIsU0FBYSxrQkFBa0I7QUFFaEMsVUFBTSxpQkFBaUI7QUFDdkIsY0FBVSxVQUFVLE1BQU07QUFDeEIsV0FBSyxjQUFjO0FBQ25CLFVBQUk7QUFDRixhQUFLLFFBQVEsSUFBSTtBQUNqQixhQUFLLFlBQVk7QUFDakIsY0FBTUMsU0FBUSxJQUFJLE1BQU0sTUFBTSxTQUFTO0FBQ3ZDQSxlQUFNLElBQUksYUFBYSxTQUFTO0FBQ2hDLGNBQU1FLFFBQU8sS0FBSyxZQUFZO0FBQzlCLGFBQUssWUFBWSxRQUFRRjtBQUV6QixrQkFBVSxNQUFNO0FBQ2QsZUFBSyxlQUFlLGdCQUFnQixJQUFJO0FBQ3hDLGNBQUksT0FBTyxVQUFVLGFBQWEsc0JBQXNCLFNBQUE7QUFBQSxRQUMxRCxDQUFDO0FBRUQsYUFBSyxZQUFZLFFBQVFFO0FBQUFBLE1BQzNCLFVBQUE7QUFDRSxhQUFLLGNBQWM7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFFQSxVQUFNLFFBQVEsSUFBSSxNQUFNLE1BQU0sU0FBUztBQUN2QyxVQUFNLElBQUksYUFBYSxTQUFTO0FBQ2hDLFVBQU0sT0FBTyxLQUFLLFlBQVk7QUFDOUIsU0FBSyxZQUFZLFFBQVE7QUFFekIsY0FBVSxNQUFNO0FBQ2QsV0FBSyxlQUFlLE9BQU8sSUFBSTtBQUFBLElBQ2pDLENBQUM7QUFFRCxTQUFLLFlBQVksUUFBUTtBQUV6QixRQUFJLE9BQU8sVUFBVSxZQUFZLHNCQUFzQixRQUFBO0FBQ3ZELFFBQUksT0FBTyxVQUFVLGFBQWEsc0JBQXNCLFNBQUE7QUFBQSxFQUMxRDtBQUFBLEVBRU8sY0FBYyxVQUF5QixhQUFzQyxPQUE4QjtBQUNoSCxVQUFNLFNBQXdCLENBQUE7QUFDOUIsVUFBTSxZQUFZLFFBQVEsS0FBSyxZQUFZLFFBQVE7QUFDbkQsUUFBSSxNQUFPLE1BQUssWUFBWSxRQUFRO0FBQ3BDLGVBQVcsU0FBUyxVQUFVO0FBQzVCLFVBQUksTUFBTSxTQUFTLFVBQVc7QUFDOUIsWUFBTSxLQUFLO0FBQ1gsVUFBSSxHQUFHLFNBQVMsU0FBUztBQUN2QixjQUFNLFdBQVcsS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDNUMsY0FBTSxnQkFBZ0IsS0FBSyxTQUFTLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDdEQsY0FBTSxZQUFZLEtBQUssU0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBRTlDLFlBQUksQ0FBQyxZQUFZLENBQUMsZUFBZTtBQUMvQixlQUFLLE1BQU0sV0FBVyx1QkFBdUIsRUFBRSxTQUFTLG9EQUFBLEdBQXVELEdBQUcsSUFBSTtBQUFBLFFBQ3hIO0FBRUEsY0FBTSxPQUFPLFNBQVU7QUFDdkIsY0FBTSxZQUFZLEtBQUssUUFBUSxjQUFlLEtBQUs7QUFDbkQsY0FBTSxRQUFRLFlBQVksS0FBSyxRQUFRLFVBQVUsS0FBSyxJQUFJO0FBQzFELGVBQU8sS0FBSyxFQUFFLE1BQVksV0FBc0IsT0FBYztBQUFBLE1BQ2hFLFdBQVcsR0FBRyxTQUFTLFNBQVM7QUFDOUIsY0FBTSxZQUFZLEtBQUssU0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxXQUFXO0FBQ2QsZUFBSyxNQUFNLFdBQVcsdUJBQXVCLEVBQUUsU0FBUyxxQ0FBQSxHQUF3QyxHQUFHLElBQUk7QUFBQSxRQUN6RztBQUVBLFlBQUksQ0FBQyxVQUFXO0FBQ2hCLGNBQU0sUUFBUSxLQUFLLFFBQVEsVUFBVSxLQUFLO0FBQzFDLGVBQU8sS0FBSyxHQUFHLEtBQUssY0FBYyxHQUFHLFVBQVUsS0FBSyxDQUFDO0FBQUEsTUFDdkQ7QUFBQSxJQUNGO0FBQ0EsUUFBSSxNQUFPLE1BQUssWUFBWSxRQUFRO0FBQ3BDLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSxnQkFBc0I7QUFDNUIsUUFBSSxLQUFLLFlBQWE7QUFDdEIsVUFBTSxXQUFXLEtBQUssWUFBWSxNQUFNLElBQUksV0FBVztBQUN2RCxRQUFJLFlBQVksT0FBTyxTQUFTLGFBQWEsWUFBWTtBQUN2RCxlQUFTLFNBQUE7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBRU8sa0JBQWtCLE9BQTRCO0FBQ25EO0FBQUEsRUFFRjtBQUFBLEVBRU8sTUFBTSxNQUFzQixNQUFXLFNBQXdCO0FBQ3BFLFFBQUksWUFBWTtBQUNoQixRQUFJLE9BQU8sU0FBUyxVQUFVO0FBQzVCLFlBQU0sZUFBZSxLQUFLLFNBQVMsZUFBZSxJQUM5QyxLQUFLLFFBQVEsbUJBQW1CLEVBQUUsSUFDbEM7QUFDSixrQkFBWSxFQUFFLFNBQVMsYUFBQTtBQUFBLElBQ3pCO0FBRUEsVUFBTSxJQUFJLFlBQVksTUFBTSxXQUFXLEVBQUUsS0FBSyxTQUFTO0FBQUEsRUFDekQ7QUFFRjtBQ2ppQ08sU0FBUyxLQUNkLFVBQzBEO0FBQzFELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFdBQVcsTUFBTSxTQUFBLEVBQVcsS0FBSyxDQUFDLE1BQU0sT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFBQSxFQUFBO0FBRS9EO0FBRU8sU0FBUyxRQUFRLFFBQXdCO0FBQzlDLFFBQU0sU0FBUyxJQUFJLGVBQUE7QUFDbkIsTUFBSTtBQUNGLFVBQU0sUUFBUSxPQUFPLE1BQU0sTUFBTTtBQUNqQyxXQUFPLEtBQUssVUFBVSxLQUFLO0FBQUEsRUFDN0IsU0FBUyxHQUFHO0FBQ1YsV0FBTyxLQUFLLFVBQVUsQ0FBQyxhQUFhLFFBQVEsRUFBRSxVQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFBQSxFQUNwRTtBQUNGO0FBRU8sU0FBUyxVQUNkLFFBQ0EsUUFDQSxXQUNBLFVBQ007QUFDTixRQUFNLFNBQVMsSUFBSSxlQUFBO0FBQ25CLFFBQU0sUUFBUSxPQUFPLE1BQU0sTUFBTTtBQUNqQyxRQUFNLGFBQWEsSUFBSSxXQUFXLEVBQUUsVUFBVSxZQUFZLENBQUEsR0FBSTtBQUM5RCxRQUFNLFNBQVMsV0FBVyxVQUFVLE9BQU8sVUFBVSxDQUFBLEdBQUksU0FBUztBQUNsRSxTQUFPO0FBQ1Q7QUFVQSxTQUFTLGdCQUFnQixZQUF3QixLQUFhO0FBQzVELFFBQU0sVUFBVSxTQUFTLGNBQWMsR0FBRztBQUMxQyxRQUFNLFlBQVksSUFBSyxXQUFXLFNBQVMsR0FBRyxFQUFFLFVBQTZCO0FBQUEsSUFDM0UsS0FBSztBQUFBLElBQ0w7QUFBQSxJQUNBLE1BQU0sQ0FBQTtBQUFBLEVBQUMsQ0FDUjtBQUVELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLE9BQU8sV0FBVyxhQUFhLEdBQUc7QUFBQSxFQUFBO0FBRXRDO0FBRU8sU0FBUyxVQUFVLFFBQXNCO0FBQzlDLFFBQU0sT0FDSixPQUFPLE9BQU8sU0FBUyxXQUNuQixTQUFTLGNBQWMsT0FBTyxJQUFJLElBQ2xDLE9BQU87QUFFYixNQUFJLENBQUMsTUFBTTtBQUNULFVBQU0sSUFBSTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsRUFBRSxNQUFNLE9BQU8sS0FBQTtBQUFBLElBQUs7QUFBQSxFQUV4QjtBQUVBLFFBQU0sV0FBVyxPQUFPLFNBQVM7QUFDakMsTUFBSSxDQUFDLE9BQU8sU0FBUyxRQUFRLEdBQUc7QUFDOUIsVUFBTSxJQUFJO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxFQUFFLEtBQUssU0FBQTtBQUFBLElBQVM7QUFBQSxFQUVwQjtBQUVBLE1BQUksT0FBTyxTQUFTO0FBQ2xCLG9CQUFnQixPQUFPLE9BQU87QUFBQSxFQUNoQztBQUVBLFFBQU0sYUFBYSxJQUFJLFdBQVcsRUFBRSxVQUFVLE9BQU8sVUFBVTtBQUUvRCxNQUFJLE9BQU8sTUFBTTtBQUNmLGVBQVcsT0FBTyxPQUFPO0FBQUEsRUFDM0I7QUFFQSxRQUFNLEVBQUUsTUFBTSxVQUFVLFVBQVUsZ0JBQWdCLFlBQVksUUFBUTtBQUV0RSxPQUFLLFlBQVk7QUFDakIsT0FBSyxZQUFZLElBQUk7QUFFckIsTUFBSSxPQUFPLFNBQVMsWUFBWSxZQUFZO0FBQzFDLGFBQVMsUUFBQTtBQUFBLEVBQ1g7QUFFQSxhQUFXLFVBQVUsT0FBTyxVQUFVLElBQW1CO0FBRXpELE1BQUksT0FBTyxTQUFTLGFBQWEsWUFBWTtBQUMzQyxhQUFTLFNBQUE7QUFBQSxFQUNYO0FBRUEsU0FBTztBQUNUOyJ9
