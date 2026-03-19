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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvc2lnbmFsLnRzIiwiLi4vc3JjL2NvbXBvbmVudC50cyIsIi4uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIi4uL3NyYy90eXBlcy90b2tlbi50cyIsIi4uL3NyYy9leHByZXNzaW9uLXBhcnNlci50cyIsIi4uL3NyYy91dGlscy50cyIsIi4uL3NyYy9zY2FubmVyLnRzIiwiLi4vc3JjL3Njb3BlLnRzIiwiLi4vc3JjL2ludGVycHJldGVyLnRzIiwiLi4vc3JjL3R5cGVzL25vZGVzLnRzIiwiLi4vc3JjL3RlbXBsYXRlLXBhcnNlci50cyIsIi4uL3NyYy9yb3V0ZXIudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvc2NoZWR1bGVyLnRzIiwiLi4vc3JjL3RyYW5zcGlsZXIudHMiLCIuLi9zcmMva2FzcGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBLRXJyb3JDb2RlID0ge1xuICAvLyBCb290c3RyYXBcbiAgUk9PVF9FTEVNRU5UX05PVF9GT1VORDogXCJLMDAxLTFcIixcbiAgRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORDogXCJLMDAxLTJcIixcblxuICAvLyBTY2FubmVyXG4gIFVOVEVSTUlOQVRFRF9DT01NRU5UOiBcIkswMDItMVwiLFxuICBVTlRFUk1JTkFURURfU1RSSU5HOiBcIkswMDItMlwiLFxuICBVTkVYUEVDVEVEX0NIQVJBQ1RFUjogXCJLMDAyLTNcIixcblxuICAvLyBUZW1wbGF0ZSBQYXJzZXJcbiAgVU5FWFBFQ1RFRF9FT0Y6IFwiSzAwMy0xXCIsXG4gIFVORVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy0yXCIsXG4gIEVYUEVDVEVEX1RBR19OQU1FOiBcIkswMDMtM1wiLFxuICBFWFBFQ1RFRF9DTE9TSU5HX0JSQUNLRVQ6IFwiSzAwMy00XCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfVEFHOiBcIkswMDMtNVwiLFxuICBCTEFOS19BVFRSSUJVVEVfTkFNRTogXCJLMDAzLTZcIixcbiAgTUlTUExBQ0VEX0NPTkRJVElPTkFMOiBcIkswMDMtN1wiLFxuICBEVVBMSUNBVEVfSUY6IFwiSzAwMy04XCIsXG4gIE1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUzogXCJLMDAzLTlcIixcblxuICAvLyBFeHByZXNzaW9uIFBhcnNlclxuICBVTkVYUEVDVEVEX1RPS0VOOiBcIkswMDQtMVwiLFxuICBJTlZBTElEX0xWQUxVRTogXCJLMDA0LTJcIixcbiAgRVhQRUNURURfRVhQUkVTU0lPTjogXCJLMDA0LTNcIixcbiAgSU5WQUxJRF9ESUNUSU9OQVJZX0tFWTogXCJLMDA0LTRcIixcblxuICAvLyBJbnRlcnByZXRlclxuICBJTlZBTElEX1BPU1RGSVhfTFZBTFVFOiBcIkswMDUtMVwiLFxuICBVTktOT1dOX0JJTkFSWV9PUEVSQVRPUjogXCJLMDA1LTJcIixcbiAgSU5WQUxJRF9QUkVGSVhfUlZBTFVFOiBcIkswMDUtM1wiLFxuICBVTktOT1dOX1VOQVJZX09QRVJBVE9SOiBcIkswMDUtNFwiLFxuICBOT1RfQV9GVU5DVElPTjogXCJLMDA1LTVcIixcbiAgTk9UX0FfQ0xBU1M6IFwiSzAwNS02XCIsXG5cbiAgLy8gU2lnbmFsc1xuICBDSVJDVUxBUl9DT01QVVRFRDogXCJLMDA2LTFcIixcblxuICAvLyBUcmFuc3BpbGVyXG4gIFJVTlRJTUVfRVJST1I6IFwiSzAwNy0xXCIsXG4gIE1JU1NJTkdfUkVRVUlSRURfQVRUUjogXCJLMDA3LTJcIixcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEtFcnJvckNvZGVUeXBlID0gKHR5cGVvZiBLRXJyb3JDb2RlKVtrZXlvZiB0eXBlb2YgS0Vycm9yQ29kZV07XG5cbmV4cG9ydCBjb25zdCBFcnJvclRlbXBsYXRlczogUmVjb3JkPHN0cmluZywgKGFyZ3M6IGFueSkgPT4gc3RyaW5nPiA9IHtcbiAgXCJLMDAxLTFcIjogKGEpID0+IGBSb290IGVsZW1lbnQgbm90IGZvdW5kOiAke2Eucm9vdH1gLFxuICBcIkswMDEtMlwiOiAoYSkgPT4gYEVudHJ5IGNvbXBvbmVudCA8JHthLnRhZ30+IG5vdCBmb3VuZCBpbiByZWdpc3RyeS5gLFxuICBcbiAgXCJLMDAyLTFcIjogKCkgPT4gJ1VudGVybWluYXRlZCBjb21tZW50LCBleHBlY3RpbmcgY2xvc2luZyBcIiovXCInLFxuICBcIkswMDItMlwiOiAoYSkgPT4gYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7YS5xdW90ZX1gLFxuICBcIkswMDItM1wiOiAoYSkgPT4gYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2EuY2hhcn0nYCxcblxuICBcIkswMDMtMVwiOiAoYSkgPT4gYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7YS5lb2ZFcnJvcn1gLFxuICBcIkswMDMtMlwiOiAoKSA9PiBcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIixcbiAgXCJLMDAzLTNcIjogKCkgPT4gXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIsXG4gIFwiSzAwMy00XCI6ICgpID0+IFwiRXhwZWN0ZWQgY2xvc2luZyB0YWcgPlwiLFxuICBcIkswMDMtNVwiOiAoYSkgPT4gYEV4cGVjdGVkIDwvJHthLm5hbWV9PmAsXG4gIFwiSzAwMy02XCI6ICgpID0+IFwiQmxhbmsgYXR0cmlidXRlIG5hbWVcIixcbiAgXCJLMDAzLTdcIjogKGEpID0+IGBAJHthLm5hbWV9IG11c3QgYmUgcHJlY2VkZWQgYnkgYW4gQGlmIG9yIEBlbHNlaWYgYmxvY2suYCxcbiAgXCJLMDAzLThcIjogKCkgPT4gXCJNdWx0aXBsZSBjb25kaXRpb25hbCBkaXJlY3RpdmVzIChAaWYsIEBlbHNlaWYsIEBlbHNlKSBvbiB0aGUgc2FtZSBlbGVtZW50IGFyZSBub3QgYWxsb3dlZC5cIixcbiAgXCJLMDAzLTlcIjogKCkgPT4gXCJNdWx0aXBsZSBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgKEBpZiwgQGVhY2gpIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXJlIG5vdCBhbGxvd2VkLiBOZXN0IHRoZW0gb3IgdXNlIDx2b2lkPiBpbnN0ZWFkLlwiLFxuXG4gIFwiSzAwNC0xXCI6IChhKSA9PiBgJHthLm1lc3NhZ2V9LCB1bmV4cGVjdGVkIHRva2VuIFwiJHthLnRva2VufVwiYCxcbiAgXCJLMDA0LTJcIjogKCkgPT4gXCJJbnZhbGlkIGwtdmFsdWUsIGlzIG5vdCBhbiBhc3NpZ25pbmcgdGFyZ2V0LlwiLFxuICBcIkswMDQtM1wiOiAoYSkgPT4gYEV4cGVjdGVkIGV4cHJlc3Npb24sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtNFwiOiAoYSkgPT4gYFN0cmluZywgTnVtYmVyIG9yIElkZW50aWZpZXIgZXhwZWN0ZWQgYXMgYSBLZXkgb2YgRGljdGlvbmFyeSB7LCB1bmV4cGVjdGVkIHRva2VuICR7YS50b2tlbn1gLFxuXG4gIFwiSzAwNS0xXCI6IChhKSA9PiBgSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBwb3N0Zml4IG9wZXJhdGlvbjogJHthLmVudGl0eX1gLFxuICBcIkswMDUtMlwiOiAoYSkgPT4gYFVua25vd24gYmluYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtM1wiOiAoYSkgPT4gYEludmFsaWQgcmlnaHQtaGFuZCBzaWRlIGV4cHJlc3Npb24gaW4gcHJlZml4IG9wZXJhdGlvbjogJHthLnJpZ2h0fWAsXG4gIFwiSzAwNS00XCI6IChhKSA9PiBgVW5rbm93biB1bmFyeSBvcGVyYXRvciAke2Eub3BlcmF0b3J9YCxcbiAgXCJLMDA1LTVcIjogKGEpID0+IGAke2EuY2FsbGVlfSBpcyBub3QgYSBmdW5jdGlvbmAsXG4gIFwiSzAwNS02XCI6IChhKSA9PiBgJyR7YS5jbGF6en0nIGlzIG5vdCBhIGNsYXNzLiAnbmV3JyBzdGF0ZW1lbnQgbXVzdCBiZSB1c2VkIHdpdGggY2xhc3Nlcy5gLFxuXG4gIFwiSzAwNi0xXCI6ICgpID0+IFwiQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCBpbiBjb21wdXRlZCBzaWduYWxcIixcblxuICBcIkswMDctMVwiOiAoYSkgPT4gYS5tZXNzYWdlLFxuICBcIkswMDctMlwiOiAoYSkgPT4gYS5tZXNzYWdlLFxufTtcblxuZXhwb3J0IGNsYXNzIEthc3BlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY29kZTogS0Vycm9yQ29kZVR5cGUsXG4gICAgcHVibGljIGFyZ3M6IGFueSA9IHt9LFxuICAgIHB1YmxpYyBsaW5lPzogbnVtYmVyLFxuICAgIHB1YmxpYyBjb2w/OiBudW1iZXIsXG4gICAgcHVibGljIHRhZ05hbWU/OiBzdHJpbmdcbiAgKSB7XG4gICAgLy8gRGV0ZWN0IGVudmlyb25tZW50XG4gICAgY29uc3QgaXNEZXYgPVxuICAgICAgdHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCJcbiAgICAgICAgOiAoaW1wb3J0Lm1ldGEgYXMgYW55KS5lbnY/Lk1PREUgIT09IFwicHJvZHVjdGlvblwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBFcnJvclRlbXBsYXRlc1tjb2RlXTtcbiAgICBjb25zdCBtZXNzYWdlID0gdGVtcGxhdGUgXG4gICAgICA/IHRlbXBsYXRlKGFyZ3MpIFxuICAgICAgOiAodHlwZW9mIGFyZ3MgPT09ICdzdHJpbmcnID8gYXJncyA6IFwiVW5rbm93biBlcnJvclwiKTtcbiAgICBcbiAgICBjb25zdCBsb2NhdGlvbiA9IGxpbmUgIT09IHVuZGVmaW5lZCA/IGAgKCR7bGluZX06JHtjb2x9KWAgOiBcIlwiO1xuICAgIGNvbnN0IHRhZ0luZm8gPSB0YWdOYW1lID8gYFxcbiAgYXQgPCR7dGFnTmFtZX0+YCA6IFwiXCI7XG4gICAgY29uc3QgbGluayA9IGlzRGV2XG4gICAgICA/IGBcXG5cXG5TZWU6IGh0dHBzOi8va2FzcGVyanMudG9wL3JlZmVyZW5jZS9lcnJvcnMjJHtjb2RlLnRvTG93ZXJDYXNlKCkucmVwbGFjZShcIi5cIiwgXCJcIil9YFxuICAgICAgOiBcIlwiO1xuXG4gICAgc3VwZXIoYFske2NvZGV9XSAke21lc3NhZ2V9JHtsb2NhdGlvbn0ke3RhZ0luZm99JHtsaW5rfWApO1xuICAgIHRoaXMubmFtZSA9IFwiS2FzcGVyRXJyb3JcIjtcbiAgfVxuXG4gIHB1YmxpYyB3aXRoVGFnKHRhZ05hbWU6IHN0cmluZyk6IHRoaXMge1xuICAgIGlmICghdGhpcy50YWdOYW1lKSB7XG4gICAgICB0aGlzLnRhZ05hbWUgPSB0YWdOYW1lO1xuICAgICAgdGhpcy5tZXNzYWdlICs9IGBcXG4gIGF0IDwke3RhZ05hbWV9PmA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbnR5cGUgTGlzdGVuZXIgPSAoKSA9PiB2b2lkO1xuXG5sZXQgYWN0aXZlRWZmZWN0OiB7IGZuOiBMaXN0ZW5lcjsgZGVwczogU2V0PGFueT4gfSB8IG51bGwgPSBudWxsO1xuY29uc3QgZWZmZWN0U3RhY2s6IGFueVtdID0gW107XG5cbmxldCBiYXRjaGluZyA9IGZhbHNlO1xuY29uc3QgcGVuZGluZ1N1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbmNvbnN0IHBlbmRpbmdXYXRjaGVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBTaWduYWxPcHRpb25zIHtcbiAgc2lnbmFsPzogQWJvcnRTaWduYWw7XG59XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcm90ZWN0ZWQgX3ZhbHVlOiBUO1xuICBwcml2YXRlIHN1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbiAgcHJpdmF0ZSB3YXRjaGVycyA9IG5ldyBTZXQ8V2F0Y2hlcjxUPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWU6IFQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzLmFkZChhY3RpdmVFZmZlY3QuZm4pO1xuICAgICAgYWN0aXZlRWZmZWN0LmRlcHMuYWRkKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGlmIChiYXRjaGluZykge1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmliZXJzKSBwZW5kaW5nU3Vic2NyaWJlcnMuYWRkKHN1Yik7XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSBwZW5kaW5nV2F0Y2hlcnMucHVzaCgoKSA9PiB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycyk7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgICAgICBzdWIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykge1xuICAgICAgICAgIHRyeSB7IHdhdGNoZXIobmV3VmFsdWUsIG9sZFZhbHVlKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlKGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICAgIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgY29uc3Qgc3RvcCA9ICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5jbGFzcyBDb21wdXRlZFNpZ25hbDxUPiBleHRlbmRzIFNpZ25hbDxUPiB7XG4gIHByaXZhdGUgZm46ICgpID0+IFQ7XG4gIHByaXZhdGUgY29tcHV0aW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gICAgc3VwZXIodW5kZWZpbmVkIGFzIGFueSk7XG4gICAgdGhpcy5mbiA9IGZuO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb21wdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEthc3BlckVycm9yKEtFcnJvckNvZGUuQ0lSQ1VMQVJfQ09NUFVURUQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXB1dGluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBFYWdlcmx5IHVwZGF0ZSB0aGUgdmFsdWUgc28gc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkIGltbWVkaWF0ZWx5XG4gICAgICAgIHN1cGVyLnZhbHVlID0gdGhpcy5mbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5jb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zPy5zaWduYWwpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiBzdXBlci52YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShfdjogVCkge1xuICAgIC8vIENvbXB1dGVkIHNpZ25hbHMgYXJlIHJlYWQtb25seSBmcm9tIG91dHNpZGVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lciwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnM/LnNpZ25hbD8uYWJvcnRlZCkgcmV0dXJuICgpID0+IHt9O1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgY29uc3Qgc3RvcDogYW55ID0gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xuICBzdG9wLnJ1biA9IGVmZmVjdE9iai5mbjtcblxuICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBzdG9wIGFzICgoKSA9PiB2b2lkKSAmIHsgcnVuOiAoKSA9PiB2b2lkIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWw8VD4oaW5pdGlhbFZhbHVlOiBUKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBTaWduYWwoaW5pdGlhbFZhbHVlKTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsIGFsaWFzIGZvciBTaWduYWwub25DaGFuZ2UoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICByZXR1cm4gc2lnLm9uQ2hhbmdlKGZuLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIGJhdGNoaW5nID0gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20ocGVuZGluZ1N1YnNjcmliZXJzKTtcbiAgICBwZW5kaW5nU3Vic2NyaWJlcnMuY2xlYXIoKTtcbiAgICBjb25zdCB3YXRjaGVycyA9IHBlbmRpbmdXYXRjaGVycy5zcGxpY2UoMCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgc3ViKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgdHJ5IHsgd2F0Y2hlcigpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZWQ8VD4oZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBDb21wdXRlZFNpZ25hbChmbiwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBTaWduYWwsIGVmZmVjdCBhcyByYXdFZmZlY3QsIGNvbXB1dGVkIGFzIHJhd0NvbXB1dGVkIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS05vZGUgfSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIFdhdGNoZXI8VD4gPSAobmV3VmFsdWU6IFQsIG9sZFZhbHVlOiBUKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50QXJnczxUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XG4gIGFyZ3M6IFRBcmdzO1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XG4gIHN0YXRpYyB0ZW1wbGF0ZT86IHN0cmluZztcbiAgYXJnczogVEFyZ3MgPSB7fSBhcyBUQXJncztcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICRyZW5kZXI/OiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogQ29tcG9uZW50QXJnczxUQXJncz4pIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSB7fSBhcyBUQXJncztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHByb3BzLmFyZ3MpIHtcbiAgICAgIHRoaXMuYXJncyA9IHByb3BzLmFyZ3M7XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZWYpIHtcbiAgICAgIHRoaXMucmVmID0gcHJvcHMucmVmO1xuICAgIH1cbiAgICBpZiAocHJvcHMudHJhbnNwaWxlcikge1xuICAgICAgdGhpcy50cmFuc3BpbGVyID0gcHJvcHMudHJhbnNwaWxlcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHJlYWN0aXZlIGVmZmVjdCB0aWVkIHRvIHRoZSBjb21wb25lbnQncyBsaWZlY3ljbGUuXG4gICAqIFJ1bnMgaW1tZWRpYXRlbHkgYW5kIHJlLXJ1bnMgd2hlbiBhbnkgc2lnbmFsIGRlcGVuZGVuY3kgY2hhbmdlcy5cbiAgICovXG4gIGVmZmVjdChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHJhd0VmZmVjdChmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2hlcyBhIHNwZWNpZmljIHNpZ25hbCBmb3IgY2hhbmdlcy5cbiAgICogRG9lcyBOT1QgcnVuIGltbWVkaWF0ZWx5LlxuICAgKi9cbiAgd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+KTogdm9pZCB7XG4gICAgc2lnLm9uQ2hhbmdlKGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY29tcHV0ZWQgc2lnbmFsIHRpZWQgdG8gdGhlIGNvbXBvbmVudCdzIGxpZmVjeWNsZS5cbiAgICogVGhlIGludGVybmFsIGVmZmVjdCBpcyBhdXRvbWF0aWNhbGx5IGNsZWFuZWQgdXAgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC5cbiAgICovXG4gIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgICByZXR1cm4gcmF3Q29tcHV0ZWQoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgb25Nb3VudCgpIHsgfVxuICBvblJlbmRlcigpIHsgfVxuICBvbkNoYW5nZXMoKSB7IH1cbiAgb25EZXN0cm95KCkgeyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuJHJlbmRlcj8uKCk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgS2FzcGVyRW50aXR5ID0gQ29tcG9uZW50IHwgUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIENvbXBvbmVudENsYXNzID0geyBuZXcoYXJncz86IENvbXBvbmVudEFyZ3M8YW55Pik6IENvbXBvbmVudCB9O1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRSZWdpc3RyeSB7XG4gIFt0YWdOYW1lOiBzdHJpbmddOiB7XG4gICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcyB8ICgoKSA9PiBQcm9taXNlPENvbXBvbmVudENsYXNzPik7XG4gICAgbm9kZXM/OiBLTm9kZVtdO1xuICAgIGxhenk/OiBib29sZWFuO1xuICAgIGZhbGxiYWNrPzogQ29tcG9uZW50Q2xhc3M7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSAndG9rZW4nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXhwciB7XG4gIHB1YmxpYyByZXN1bHQ6IGFueTtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBpbnRlcmZhY2UgRXhwclZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0QXJyb3dGdW5jdGlvbkV4cHIoZXhwcjogQXJyb3dGdW5jdGlvbik6IFI7XG4gICAgdmlzaXRBc3NpZ25FeHByKGV4cHI6IEFzc2lnbik6IFI7XG4gICAgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEJpbmFyeSk6IFI7XG4gICAgdmlzaXRDYWxsRXhwcihleHByOiBDYWxsKTogUjtcbiAgICB2aXNpdERlYnVnRXhwcihleHByOiBEZWJ1Zyk6IFI7XG4gICAgdmlzaXREaWN0aW9uYXJ5RXhwcihleHByOiBEaWN0aW9uYXJ5KTogUjtcbiAgICB2aXNpdEVhY2hFeHByKGV4cHI6IEVhY2gpOiBSO1xuICAgIHZpc2l0R2V0RXhwcihleHByOiBHZXQpOiBSO1xuICAgIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEdyb3VwaW5nKTogUjtcbiAgICB2aXNpdEtleUV4cHIoZXhwcjogS2V5KTogUjtcbiAgICB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IExvZ2ljYWwpOiBSO1xuICAgIHZpc2l0TGlzdEV4cHIoZXhwcjogTGlzdCk6IFI7XG4gICAgdmlzaXRMaXRlcmFsRXhwcihleHByOiBMaXRlcmFsKTogUjtcbiAgICB2aXNpdE5ld0V4cHIoZXhwcjogTmV3KTogUjtcbiAgICB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBOdWxsQ29hbGVzY2luZyk6IFI7XG4gICAgdmlzaXRQb3N0Zml4RXhwcihleHByOiBQb3N0Zml4KTogUjtcbiAgICB2aXNpdFNldEV4cHIoZXhwcjogU2V0KTogUjtcbiAgICB2aXNpdFBpcGVsaW5lRXhwcihleHByOiBQaXBlbGluZSk6IFI7XG4gICAgdmlzaXRTcHJlYWRFeHByKGV4cHI6IFNwcmVhZCk6IFI7XG4gICAgdmlzaXRUZW1wbGF0ZUV4cHIoZXhwcjogVGVtcGxhdGUpOiBSO1xuICAgIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogVGVybmFyeSk6IFI7XG4gICAgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IFR5cGVvZik6IFI7XG4gICAgdmlzaXRVbmFyeUV4cHIoZXhwcjogVW5hcnkpOiBSO1xuICAgIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IFZhcmlhYmxlKTogUjtcbiAgICB2aXNpdFZvaWRFeHByKGV4cHI6IFZvaWQpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgQXJyb3dGdW5jdGlvbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwYXJhbXM6IFRva2VuW107XG4gICAgcHVibGljIGJvZHk6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IFRva2VuW10sIGJvZHk6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBcnJvd0Z1bmN0aW9uRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFycm93RnVuY3Rpb24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NpZ24gZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFzc2lnbkV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Bc3NpZ24nO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQmluYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBjYWxsZWU6IEV4cHI7XG4gICAgcHVibGljIHBhcmVuOiBUb2tlbjtcbiAgICBwdWJsaWMgYXJnczogRXhwcltdO1xuICAgIHB1YmxpYyBvcHRpb25hbDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKGNhbGxlZTogRXhwciwgcGFyZW46IFRva2VuLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlciwgb3B0aW9uYWwgPSBmYWxzZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgdGhpcy5wYXJlbiA9IHBhcmVuO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gb3B0aW9uYWw7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FsbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5DYWxsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWJ1Z0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5EZWJ1Zyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERpY3Rpb25hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgcHJvcGVydGllczogRXhwcltdO1xuXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREaWN0aW9uYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRpY3Rpb25hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFYWNoIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuICAgIHB1YmxpYyBrZXk6IFRva2VuO1xuICAgIHB1YmxpYyBpdGVyYWJsZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBrZXk6IFRva2VuLCBpdGVyYWJsZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLml0ZXJhYmxlID0gaXRlcmFibGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWFjaEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5FYWNoJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2V0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMga2V5OiBFeHByO1xuICAgIHB1YmxpYyB0eXBlOiBUb2tlblR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdHlwZTogVG9rZW5UeXBlLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEdldEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5HZXQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHcm91cGluZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R3JvdXBpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuR3JvdXBpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBLZXkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0S2V5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLktleSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2ljYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMb2dpY2FsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxvZ2ljYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExpc3RFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTGlzdCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWwgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXRlcmFsJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmV3IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNsYXp6OiBFeHByO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3RvcihjbGF6ejogRXhwciwgYXJnczogRXhwcltdLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGF6eiA9IGNsYXp6O1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE5ld0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5OZXcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsQ29hbGVzY2luZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQ6IEV4cHIsIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdE51bGxDb2FsZXNjaW5nRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk51bGxDb2FsZXNjaW5nJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9zdGZpeCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGluY3JlbWVudDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBpbmNyZW1lbnQ6IG51bWJlciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQb3N0Zml4RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlBvc3RmaXgnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoZW50aXR5OiBFeHByLCBrZXk6IEV4cHIsIHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlNldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UGlwZWxpbmVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUGlwZWxpbmUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcHJlYWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTcHJlYWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU3ByZWFkJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVtcGxhdGVFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVGVtcGxhdGUnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXJuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogRXhwcjtcbiAgICBwdWJsaWMgdGhlbkV4cHI6IEV4cHI7XG4gICAgcHVibGljIGVsc2VFeHByOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uOiBFeHByLCB0aGVuRXhwcjogRXhwciwgZWxzZUV4cHI6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50aGVuRXhwciA9IHRoZW5FeHByO1xuICAgICAgICB0aGlzLmVsc2VFeHByID0gZWxzZUV4cHI7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGVybmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZXJuYXJ5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHlwZW9mIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHZhbHVlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHlwZW9mRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlR5cGVvZic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuYXJ5IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG9wZXJhdG9yOiBUb2tlbjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihvcGVyYXRvcjogVG9rZW4sIHJpZ2h0OiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWYXJpYWJsZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5WYXJpYWJsZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZvaWQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRWb2lkRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZvaWQnO1xuICB9XG59XG5cbiIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgLy8gUGFyc2VyIFRva2Vuc1xyXG4gIEVvZixcclxuICBQYW5pYyxcclxuXHJcbiAgLy8gU2luZ2xlIENoYXJhY3RlciBUb2tlbnNcclxuICBBbXBlcnNhbmQsXHJcbiAgQXRTaWduLFxyXG4gIENhcmV0LFxyXG4gIENvbW1hLFxyXG4gIERvbGxhcixcclxuICBEb3QsXHJcbiAgSGFzaCxcclxuICBMZWZ0QnJhY2UsXHJcbiAgTGVmdEJyYWNrZXQsXHJcbiAgTGVmdFBhcmVuLFxyXG4gIFBlcmNlbnQsXHJcbiAgUGlwZSxcclxuICBSaWdodEJyYWNlLFxyXG4gIFJpZ2h0QnJhY2tldCxcclxuICBSaWdodFBhcmVuLFxyXG4gIFNlbWljb2xvbixcclxuICBTbGFzaCxcclxuICBTdGFyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnNcclxuICBBcnJvdyxcclxuICBCYW5nLFxyXG4gIEJhbmdFcXVhbCxcclxuICBCYW5nRXF1YWxFcXVhbCxcclxuICBDb2xvbixcclxuICBFcXVhbCxcclxuICBFcXVhbEVxdWFsLFxyXG4gIEVxdWFsRXF1YWxFcXVhbCxcclxuICBHcmVhdGVyLFxyXG4gIEdyZWF0ZXJFcXVhbCxcclxuICBMZXNzLFxyXG4gIExlc3NFcXVhbCxcclxuICBNaW51cyxcclxuICBNaW51c0VxdWFsLFxyXG4gIE1pbnVzTWludXMsXHJcbiAgUGVyY2VudEVxdWFsLFxyXG4gIFBsdXMsXHJcbiAgUGx1c0VxdWFsLFxyXG4gIFBsdXNQbHVzLFxyXG4gIFF1ZXN0aW9uLFxyXG4gIFF1ZXN0aW9uRG90LFxyXG4gIFF1ZXN0aW9uUXVlc3Rpb24sXHJcbiAgU2xhc2hFcXVhbCxcclxuICBTdGFyRXF1YWwsXHJcbiAgRG90RG90LFxyXG4gIERvdERvdERvdCxcclxuICBMZXNzRXF1YWxHcmVhdGVyLFxyXG5cclxuICAvLyBMaXRlcmFsc1xyXG4gIElkZW50aWZpZXIsXHJcbiAgVGVtcGxhdGUsXHJcbiAgU3RyaW5nLFxyXG4gIE51bWJlcixcclxuXHJcbiAgLy8gT25lIE9yIFR3byBDaGFyYWN0ZXIgVG9rZW5zIChiaXR3aXNlIHNoaWZ0cylcclxuICBMZWZ0U2hpZnQsXHJcbiAgUmlnaHRTaGlmdCxcclxuICBQaXBlbGluZSxcclxuICBUaWxkZSxcclxuXHJcbiAgLy8gS2V5d29yZHNcclxuICBBbmQsXHJcbiAgQ29uc3QsXHJcbiAgRGVidWcsXHJcbiAgRmFsc2UsXHJcbiAgSW4sXHJcbiAgSW5zdGFuY2VvZixcclxuICBOZXcsXHJcbiAgTnVsbCxcclxuICBVbmRlZmluZWQsXHJcbiAgT2YsXHJcbiAgT3IsXHJcbiAgVHJ1ZSxcclxuICBUeXBlb2YsXHJcbiAgVm9pZCxcclxuICBXaXRoLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcclxuICBwdWJsaWMgbGl0ZXJhbDogYW55O1xyXG4gIHB1YmxpYyBsZXhlbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB0eXBlOiBUb2tlblR5cGUsXHJcbiAgICBsZXhlbWU6IHN0cmluZyxcclxuICAgIGxpdGVyYWw6IGFueSxcclxuICAgIGxpbmU6IG51bWJlcixcclxuICAgIGNvbDogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBUb2tlblR5cGVbdHlwZV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5sZXhlbWUgPSBsZXhlbWU7XHJcbiAgICB0aGlzLmxpdGVyYWwgPSBsaXRlcmFsO1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBbKCR7dGhpcy5saW5lfSk6XCIke3RoaXMubGV4ZW1lfVwiXWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlbGZDbG9zaW5nVGFncyA9IFtcclxuICBcImFyZWFcIixcclxuICBcImJhc2VcIixcclxuICBcImJyXCIsXHJcbiAgXCJjb2xcIixcclxuICBcImVtYmVkXCIsXHJcbiAgXCJoclwiLFxyXG4gIFwiaW1nXCIsXHJcbiAgXCJpbnB1dFwiLFxyXG4gIFwibGlua1wiLFxyXG4gIFwibWV0YVwiLFxyXG4gIFwicGFyYW1cIixcclxuICBcInNvdXJjZVwiLFxyXG4gIFwidHJhY2tcIixcclxuICBcIndiclwiLFxyXG5dO1xyXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uUGFyc2VyIHtcbiAgcHJpdmF0ZSBjdXJyZW50OiBudW1iZXI7XG4gIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdO1xuXG4gIHB1YmxpYyBwYXJzZSh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHJbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnRva2VucyA9IHRva2VucztcbiAgICBjb25zdCBleHByZXNzaW9uczogRXhwci5FeHByW10gPSBbXTtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcmVzc2lvbnM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLnR5cGVzOiBUb2tlblR5cGVbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgdHlwZSBvZiB0eXBlcykge1xuICAgICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogVG9rZW4ge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWsoKTogVG9rZW4ge1xuICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmN1cnJlbnRdO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmV2aW91cygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCAtIDFdO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayh0eXBlOiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wZWVrKCkudHlwZSA9PT0gdHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrKFRva2VuVHlwZS5Fb2YpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdW1lKHR5cGU6IFRva2VuVHlwZSwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICAgIGlmICh0aGlzLmNoZWNrKHR5cGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLlVORVhQRUNURURfVE9LRU4sXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIHsgbWVzc2FnZTogbWVzc2FnZSwgdG9rZW46IHRoaXMucGVlaygpLmxleGVtZSB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIHRva2VuOiBUb2tlbiwgYXJnczogYW55ID0ge30pOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB0b2tlbi5saW5lLCB0b2tlbi5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBzeW5jaHJvbml6ZSgpOiB2b2lkIHtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuU2VtaWNvbG9uKSB8fCB0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfSB3aGlsZSAoIXRoaXMuZW9mKCkpO1xuICB9XG5cbiAgcHVibGljIGZvcmVhY2godG9rZW5zOiBUb2tlbltdKTogRXhwci5FeHByIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdGVkIGFuIGlkZW50aWZpZXIgaW5zaWRlIFwiZWFjaFwiIHN0YXRlbWVudGBcbiAgICApO1xuXG4gICAgbGV0IGtleTogVG9rZW4gPSBudWxsO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5XaXRoKSkge1xuICAgICAga2V5ID0gdGhpcy5jb25zdW1lKFxuICAgICAgICBUb2tlblR5cGUuSWRlbnRpZmllcixcbiAgICAgICAgYEV4cGVjdGVkIGEgXCJrZXlcIiBpZGVudGlmaWVyIGFmdGVyIFwid2l0aFwiIGtleXdvcmQgaW4gZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5PZixcbiAgICAgIGBFeHBlY3RlZCBcIm9mXCIga2V5d29yZCBpbnNpZGUgZm9yZWFjaCBzdGF0ZW1lbnRgXG4gICAgKTtcbiAgICBjb25zdCBpdGVyYWJsZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkVhY2gobmFtZSwga2V5LCBpdGVyYWJsZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhwcmVzc2lvbigpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHJlc3Npb246IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7XG4gICAgICAvLyBjb25zdW1lIGFsbCBzZW1pY29sb25zXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TZW1pY29sb24pKSB7IC8qIGNvbnN1bWUgc2VtaWNvbG9ucyAqLyB9XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NpZ25tZW50KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5waXBlbGluZSgpO1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TdGFyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5TbGFzaEVxdWFsXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBsZXQgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMuYXNzaWdubWVudCgpO1xuICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgIGNvbnN0IG5hbWU6IFRva2VuID0gZXhwci5uYW1lO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5WYXJpYWJsZShuYW1lLCBuYW1lLmxpbmUpLFxuICAgICAgICAgICAgb3BlcmF0b3IsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG9wZXJhdG9yLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5Bc3NpZ24obmFtZSwgdmFsdWUsIG5hbWUubGluZSk7XG4gICAgICB9IGVsc2UgaWYgKGV4cHIgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSAhPT0gVG9rZW5UeXBlLkVxdWFsKSB7XG4gICAgICAgICAgdmFsdWUgPSBuZXcgRXhwci5CaW5hcnkoXG4gICAgICAgICAgICBuZXcgRXhwci5HZXQoZXhwci5lbnRpdHksIGV4cHIua2V5LCBleHByLnR5cGUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLlNldChleHByLmVudGl0eSwgZXhwci5rZXksIHZhbHVlLCBleHByLmxpbmUpO1xuICAgICAgfVxuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLklOVkFMSURfTFZBTFVFLCBvcGVyYXRvcik7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBwaXBlbGluZSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBpcGVsaW5lKSkge1xuICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5QaXBlbGluZShleHByLCByaWdodCwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHRlcm5hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHRoZW5FeHByOiBFeHByLkV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQ29sb24sIGBFeHBlY3RlZCBcIjpcIiBhZnRlciB0ZXJuYXJ5ID8gZXhwcmVzc2lvbmApO1xuICAgICAgY29uc3QgZWxzZUV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlRlcm5hcnkoZXhwciwgdGhlbkV4cHIsIGVsc2VFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbnVsbENvYWxlc2NpbmcoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5sb2dpY2FsT3IoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvbikpIHtcbiAgICAgIGNvbnN0IHJpZ2h0RXhwcjogRXhwci5FeHByID0gdGhpcy5udWxsQ29hbGVzY2luZygpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLk51bGxDb2FsZXNjaW5nKGV4cHIsIHJpZ2h0RXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxPcigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk9yKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubG9naWNhbEFuZCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGxvZ2ljYWxBbmQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQW5kKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuZXF1YWxpdHkoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5Mb2dpY2FsKGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBlcXVhbGl0eSgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnNoaWZ0KCk7XG4gICAgd2hpbGUgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXIsXG4gICAgICAgIFRva2VuVHlwZS5HcmVhdGVyRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzLFxuICAgICAgICBUb2tlblR5cGUuTGVzc0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuSW5zdGFuY2VvZixcbiAgICAgICAgVG9rZW5UeXBlLkluLFxuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHNoaWZ0KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFNoaWZ0LCBUb2tlblR5cGUuUmlnaHRTaGlmdCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLmFkZGl0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRpdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm1vZHVsdXMoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXMsIFRva2VuVHlwZS5QbHVzKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbW9kdWx1cygpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBlcmNlbnQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tdWx0aXBsaWNhdGlvbigpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlwbGljYXRpb24oKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuU2xhc2gsIFRva2VuVHlwZS5TdGFyKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0eXBlb2YoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVHlwZW9mKSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgdmFsdWU6IEV4cHIuRXhwciA9IHRoaXMudHlwZW9mKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVHlwZW9mKHZhbHVlLCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudW5hcnkoKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5hcnkoKTogRXhwci5FeHByIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuTWludXMsXG4gICAgICAgIFRva2VuVHlwZS5CYW5nLFxuICAgICAgICBUb2tlblR5cGUuVGlsZGUsXG4gICAgICAgIFRva2VuVHlwZS5Eb2xsYXIsXG4gICAgICAgIFRva2VuVHlwZS5QbHVzUGx1cyxcbiAgICAgICAgVG9rZW5UeXBlLk1pbnVzTWludXNcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLnVuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVW5hcnkob3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubmV3S2V5d29yZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXdLZXl3b3JkKCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk5ldykpIHtcbiAgICAgIGNvbnN0IGtleXdvcmQgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCBjb25zdHJ1Y3Q6IEV4cHIuRXhwciA9IHRoaXMuY2FsbCgpO1xuICAgICAgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIEV4cHIuQ2FsbCkge1xuICAgICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdC5jYWxsZWUsIGNvbnN0cnVjdC5hcmdzLCBrZXl3b3JkLmxpbmUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBFeHByLk5ldyhjb25zdHJ1Y3QsIFtdLCBrZXl3b3JkLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wb3N0Zml4KCk7XG4gIH1cblxuICBwcml2YXRlIHBvc3RmaXgoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByID0gdGhpcy5jYWxsKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlBsdXNQbHVzKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlBvc3RmaXgoZXhwciwgMSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLk1pbnVzTWludXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAtMSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGNhbGwoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5wcmltYXJ5KCk7XG4gICAgbGV0IGNvbnN1bWVkOiBib29sZWFuO1xuICAgIGRvIHtcbiAgICAgIGNvbnN1bWVkID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBleHByID0gdGhpcy5maW5pc2hDYWxsKGV4cHIsIHRoaXMucHJldmlvdXMoKSwgZmFsc2UpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3QsIFRva2VuVHlwZS5RdWVzdGlvbkRvdCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIG9wZXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QgJiYgdGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHByID0gdGhpcy5kb3RHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdEJyYWNrZXQpKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZXhwciA9IHRoaXMuYnJhY2tldEdldChleHByLCB0aGlzLnByZXZpb3VzKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGNvbnN1bWVkKTtcbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdG9rZW5BdChvZmZzZXQ6IG51bWJlcik6IFRva2VuVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudCArIG9mZnNldF0/LnR5cGU7XG4gIH1cblxuICBwcml2YXRlIGlzQXJyb3dQYXJhbXMoKTogYm9vbGVhbiB7XG4gICAgbGV0IGkgPSB0aGlzLmN1cnJlbnQgKyAxOyAvLyBza2lwIChcbiAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgPT09IFRva2VuVHlwZS5SaWdodFBhcmVuKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbaSArIDFdPy50eXBlID09PSBUb2tlblR5cGUuQXJyb3c7XG4gICAgfVxuICAgIHdoaWxlIChpIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgIT09IFRva2VuVHlwZS5JZGVudGlmaWVyKSByZXR1cm4gZmFsc2U7XG4gICAgICBpKys7XG4gICAgICBpZiAodGhpcy50b2tlbnNbaV0/LnR5cGUgPT09IFRva2VuVHlwZS5SaWdodFBhcmVuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLkNvbW1hKSByZXR1cm4gZmFsc2U7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgZmluaXNoQ2FsbChjYWxsZWU6IEV4cHIuRXhwciwgcGFyZW46IFRva2VuLCBvcHRpb25hbDogYm9vbGVhbik6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgYXJnczogRXhwci5FeHByW10gPSBbXTtcbiAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIH1cbiAgICBjb25zdCBjbG9zZVBhcmVuID0gdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgYXJndW1lbnRzYCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkNhbGwoY2FsbGVlLCBjbG9zZVBhcmVuLCBhcmdzLCBjbG9zZVBhcmVuLmxpbmUsIG9wdGlvbmFsKTtcbiAgfVxuXG4gIHByaXZhdGUgZG90R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBuYW1lOiBUb2tlbiA9IHRoaXMuY29uc3VtZShcbiAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgYEV4cGVjdCBwcm9wZXJ0eSBuYW1lIGFmdGVyICcuJ2BcbiAgICApO1xuICAgIGNvbnN0IGtleTogRXhwci5LZXkgPSBuZXcgRXhwci5LZXkobmFtZSwgbmFtZS5saW5lKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuR2V0KGV4cHIsIGtleSwgb3BlcmF0b3IudHlwZSwgbmFtZS5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgYnJhY2tldEdldChleHByOiBFeHByLkV4cHIsIG9wZXJhdG9yOiBUb2tlbik6IEV4cHIuRXhwciB7XG4gICAgbGV0IGtleTogRXhwci5FeHByID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAga2V5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhbiBpbmRleGApO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBvcGVyYXRvci5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJpbWFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5GYWxzZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKGZhbHNlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UcnVlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodHJ1ZSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTnVsbCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlVuZGVmaW5lZCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHVuZGVmaW5lZCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTnVtYmVyKSB8fCB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVGVtcGxhdGUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVtcGxhdGUodGhpcy5wcmV2aW91cygpLmxpdGVyYWwsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLklkZW50aWZpZXIpICYmIHRoaXMudG9rZW5BdCgxKSA9PT0gVG9rZW5UeXBlLkFycm93KSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgPT5cbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKFtwYXJhbV0sIGJvZHksIHBhcmFtLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuSWRlbnRpZmllcikpIHtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVmFyaWFibGUoaWRlbnRpZmllciwgaWRlbnRpZmllci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2soVG9rZW5UeXBlLkxlZnRQYXJlbikgJiYgdGhpcy5pc0Fycm93UGFyYW1zKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBjb25zdW1lIChcbiAgICAgIGNvbnN0IHBhcmFtczogVG9rZW5bXSA9IFtdO1xuICAgICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodFBhcmVuKSkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgcGFyYW1zLnB1c2godGhpcy5jb25zdW1lKFRva2VuVHlwZS5JZGVudGlmaWVyLCBcIkV4cGVjdGVkIHBhcmFtZXRlciBuYW1lXCIpKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRQYXJlbiwgYEV4cGVjdGVkIFwiKVwiYCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLkFycm93LCBgRXhwZWN0ZWQgXCI9PlwiYCk7XG4gICAgICBjb25zdCBib2R5ID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuQXJyb3dGdW5jdGlvbihwYXJhbXMsIGJvZHksIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCIgYWZ0ZXIgZXhwcmVzc2lvbmApO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkdyb3VwaW5nKGV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlZvaWQpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Wb2lkKGV4cHIsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRlYnVnKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGVidWcoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cblxuICAgIHRocm93IHRoaXMuZXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLkVYUEVDVEVEX0VYUFJFU1NJT04sXG4gICAgICB0aGlzLnBlZWsoKSxcbiAgICAgIHsgdG9rZW46IHRoaXMucGVlaygpLmxleGVtZSB9XG4gICAgKTtcbiAgICAvLyB1bnJlYWNoZWFibGUgY29kZVxuICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKG51bGwsIDApO1xuICB9XG5cbiAgcHVibGljIGRpY3Rpb25hcnkoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBsZWZ0QnJhY2UgPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShbXSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgIHByb3BlcnRpZXMucHVzaChuZXcgRXhwci5TcHJlYWQodGhpcy5leHByZXNzaW9uKCksIHRoaXMucHJldmlvdXMoKS5saW5lKSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLm1hdGNoKFRva2VuVHlwZS5TdHJpbmcsIFRva2VuVHlwZS5JZGVudGlmaWVyLCBUb2tlblR5cGUuTnVtYmVyKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db2xvbikpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgICAgIHByb3BlcnRpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBFeHByLlNldChudWxsLCBuZXcgRXhwci5LZXkoa2V5LCBrZXkubGluZSksIHZhbHVlLCBrZXkubGluZSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEV4cHIuVmFyaWFibGUoa2V5LCBrZXkubGluZSk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXG4gICAgICAgICAgS0Vycm9yQ29kZS5JTlZBTElEX0RJQ1RJT05BUllfS0VZLFxuICAgICAgICAgIHRoaXMucGVlaygpLFxuICAgICAgICAgIHsgdG9rZW46IHRoaXMucGVlaygpLmxleGVtZSB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuQ29tbWEpKTtcbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2UsIGBFeHBlY3RlZCBcIn1cIiBhZnRlciBvYmplY3QgbGl0ZXJhbGApO1xuXG4gICAgcmV0dXJuIG5ldyBFeHByLkRpY3Rpb25hcnkocHJvcGVydGllcywgbGVmdEJyYWNlLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0KCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgdmFsdWVzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGNvbnN0IGxlZnRCcmFja2V0ID0gdGhpcy5wcmV2aW91cygpO1xuXG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXN0KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Eb3REb3REb3QpKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCxcbiAgICAgIGBFeHBlY3RlZCBcIl1cIiBhZnRlciBhcnJheSBkZWNsYXJhdGlvbmBcbiAgICApO1xuICAgIHJldHVybiBuZXcgRXhwci5MaXN0KHZhbHVlcywgbGVmdEJyYWNrZXQubGluZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpZ2l0KGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gY2hhciA+PSBcIjBcIiAmJiBjaGFyIDw9IFwiOVwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYShjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAoY2hhciA+PSBcImFcIiAmJiBjaGFyIDw9IFwielwiKSB8fCAoY2hhciA+PSBcIkFcIiAmJiBjaGFyIDw9IFwiWlwiKSB8fCBjaGFyID09PSBcIiRcIiB8fCBjaGFyID09PSBcIl9cIlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYU51bWVyaWMoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0FscGhhKGNoYXIpIHx8IGlzRGlnaXQoY2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHJpbmcoMSkudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzS2V5d29yZCh3b3JkOiBrZXlvZiB0eXBlb2YgVG9rZW5UeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBUb2tlblR5cGVbd29yZF0gPj0gVG9rZW5UeXBlLkFuZDtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FubmVyIHtcbiAgLyoqIHNjcmlwdHMgc291cmNlIGNvZGUgKi9cbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICAvKiogY29udGFpbnMgdGhlIHNvdXJjZSBjb2RlIHJlcHJlc2VudGVkIGFzIGxpc3Qgb2YgdG9rZW5zICovXG4gIHB1YmxpYyB0b2tlbnM6IFRva2VuW107XG4gIC8qKiBwb2ludHMgdG8gdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgLyoqIHBvaW50cyB0byB0aGUgc3RhcnQgb2YgdGhlIHRva2VuICAqL1xuICBwcml2YXRlIHN0YXJ0OiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGxpbmUgb2Ygc291cmNlIGNvZGUgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgbGluZTogbnVtYmVyO1xuICAvKiogY3VycmVudCBjb2x1bW4gb2YgdGhlIGNoYXJhY3RlciBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBjb2w6IG51bWJlcjtcblxuICBwdWJsaWMgc2Nhbihzb3VyY2U6IHN0cmluZyk6IFRva2VuW10ge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcblxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRoaXMuZ2V0VG9rZW4oKTtcbiAgICB9XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4oVG9rZW5UeXBlLkVvZiwgXCJcIiwgbnVsbCwgdGhpcy5saW5lLCAwKSk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGFkdmFuY2UoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiXFxuXCIpIHtcbiAgICAgIHRoaXMubGluZSsrO1xuICAgICAgdGhpcy5jb2wgPSAwO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB0aGlzLmNvbCsrO1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cblxuICBwcml2YXRlIGFkZFRva2VuKHRva2VuVHlwZTogVG9rZW5UeXBlLCBsaXRlcmFsOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy50b2tlbnMucHVzaChuZXcgVG9rZW4odG9rZW5UeXBlLCB0ZXh0LCBsaXRlcmFsLCB0aGlzLmxpbmUsIHRoaXMuY29sKSk7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKGV4cGVjdGVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50KSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnQrKztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrTmV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgKyAxID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFwiXFwwXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5jdXJyZW50ICsgMSk7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBcIlxcblwiICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG11bHRpbGluZUNvbW1lbnQoKTogdm9pZCB7XG4gICAgd2hpbGUgKCF0aGlzLmVvZigpICYmICEodGhpcy5wZWVrKCkgPT09IFwiKlwiICYmIHRoaXMucGVla05leHQoKSA9PT0gXCIvXCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTlRFUk1JTkFURURfQ09NTUVOVCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoZSBjbG9zaW5nIHNsYXNoICcqLydcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcocXVvdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLnBlZWsoKSAhPT0gcXVvdGUgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIFVudGVybWluYXRlZCBzdHJpbmcuXG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTlRFUk1JTkFURURfU1RSSU5HLCB7IHF1b3RlOiBxdW90ZSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgY2xvc2luZyBcIi5cbiAgICB0aGlzLmFkdmFuY2UoKTtcblxuICAgIC8vIFRyaW0gdGhlIHN1cnJvdW5kaW5nIHF1b3Rlcy5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0ICsgMSwgdGhpcy5jdXJyZW50IC0gMSk7XG4gICAgdGhpcy5hZGRUb2tlbihxdW90ZSAhPT0gXCJgXCIgPyBUb2tlblR5cGUuU3RyaW5nIDogVG9rZW5UeXBlLlRlbXBsYXRlLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIG51bWJlcigpOiB2b2lkIHtcbiAgICAvLyBnZXRzIGludGVnZXIgcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBmcmFjdGlvblxuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCIuXCIgJiYgVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWtOZXh0KCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBnZXRzIGZyYWN0aW9uIHBhcnRcbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrcyBmb3IgZXhwb25lbnRcbiAgICBpZiAodGhpcy5wZWVrKCkudG9Mb3dlckNhc2UoKSA9PT0gXCJlXCIpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgaWYgKHRoaXMucGVlaygpID09PSBcIi1cIiB8fCB0aGlzLnBlZWsoKSA9PT0gXCIrXCIpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLk51bWJlciwgTnVtYmVyKHZhbHVlKSk7XG4gIH1cblxuICBwcml2YXRlIGlkZW50aWZpZXIoKTogdm9pZCB7XG4gICAgd2hpbGUgKFV0aWxzLmlzQWxwaGFOdW1lcmljKHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICBjb25zdCBjYXBpdGFsaXplZCA9IFV0aWxzLmNhcGl0YWxpemUodmFsdWUpIGFzIGtleW9mIHR5cGVvZiBUb2tlblR5cGU7XG4gICAgaWYgKFV0aWxzLmlzS2V5d29yZChjYXBpdGFsaXplZCkpIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlW2NhcGl0YWxpemVkXSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5JZGVudGlmaWVyLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRUb2tlbigpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFyID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICBjYXNlIFwiKFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5MZWZ0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIpXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJbXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFja2V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiXVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRCcmFjZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIixcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ29tbWEsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI7XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlNlbWljb2xvbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIn5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuVGlsZGUsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJeXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkNhcmV0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5IYXNoLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiOlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkNvbG9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiKlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlN0YXJFcXVhbCA6IFRva2VuVHlwZS5TdGFyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLlBlcmNlbnRFcXVhbCA6IFRva2VuVHlwZS5QZXJjZW50LFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCJ8XCIpID8gVG9rZW5UeXBlLk9yIDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5QaXBlbGluZSA6XG4gICAgICAgICAgVG9rZW5UeXBlLlBpcGUsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIiZcIikgPyBUb2tlblR5cGUuQW5kIDogVG9rZW5UeXBlLkFtcGVyc2FuZCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5SaWdodFNoaWZ0IDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5HcmVhdGVyRXF1YWwgOiBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiFcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5CYW5nRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5CYW5nRXF1YWxcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI/XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj9cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uUXVlc3Rpb25cbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIi5cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlF1ZXN0aW9uRG90XG4gICAgICAgICAgICA6IFRva2VuVHlwZS5RdWVzdGlvbixcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbCA6IFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPlwiKSA/IFRva2VuVHlwZS5BcnJvdyA6IFRva2VuVHlwZS5FcXVhbCxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiK1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c1BsdXNcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaChcIj1cIilcbiAgICAgICAgICAgID8gVG9rZW5UeXBlLlBsdXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuUGx1cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiLVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuTWludXNFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTWludXMsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIjxcIikgPyBUb2tlblR5cGUuTGVmdFNoaWZ0IDpcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyB0aGlzLm1hdGNoKFwiPlwiKVxuICAgICAgICAgICAgICA/IFRva2VuVHlwZS5MZXNzRXF1YWxHcmVhdGVyXG4gICAgICAgICAgICAgIDogVG9rZW5UeXBlLkxlc3NFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzcyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIuXCIpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3REb3QsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3REb3QsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Eb3QsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCIvXCIpKSB7XG4gICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIipcIikpIHtcbiAgICAgICAgICB0aGlzLm11bHRpbGluZUNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU2xhc2hFcXVhbCA6IFRva2VuVHlwZS5TbGFzaCxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBgJ2A6XG4gICAgICBjYXNlIGBcImA6XG4gICAgICBjYXNlIFwiYFwiOlxuICAgICAgICB0aGlzLnN0cmluZyhjaGFyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBpZ25vcmUgY2FzZXNcbiAgICAgIGNhc2UgXCJcXG5cIjpcbiAgICAgIGNhc2UgXCIgXCI6XG4gICAgICBjYXNlIFwiXFxyXCI6XG4gICAgICBjYXNlIFwiXFx0XCI6XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY29tcGxleCBjYXNlc1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFV0aWxzLmlzRGlnaXQoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLm51bWJlcigpO1xuICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzQWxwaGEoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLmlkZW50aWZpZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9DSEFSQUNURVIsIHsgY2hhcjogY2hhciB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnkgPSB7fSk6IHZvaWQge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgcHVibGljIHZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgcHVibGljIHBhcmVudDogU2NvcGU7XG5cbiAgY29uc3RydWN0b3IocGFyZW50PzogU2NvcGUsIGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudCA/IHBhcmVudCA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSBlbnRpdHkgPyBlbnRpdHkgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KGVudGl0eT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlc1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZXNba2V5XTtcbiAgICB9XG5cbiAgICBjb25zdCAkaW1wb3J0cyA9ICh0aGlzLnZhbHVlcz8uY29uc3RydWN0b3IgYXMgYW55KT8uJGltcG9ydHM7XG4gICAgaWYgKCRpbXBvcnRzICYmIHR5cGVvZiAkaW1wb3J0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gJGltcG9ydHNba2V5XTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93W2tleSBhcyBrZXlvZiB0eXBlb2Ygd2luZG93XTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRXhwciBmcm9tIFwiLi90eXBlcy9leHByZXNzaW9uc1wiO1xuaW1wb3J0IHsgU2Nhbm5lciB9IGZyb20gXCIuL3NjYW5uZXJcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25QYXJzZXIgYXMgUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IFNjb3BlIH0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJwcmV0ZXIgaW1wbGVtZW50cyBFeHByLkV4cHJWaXNpdG9yPGFueT4ge1xuICBwdWJsaWMgc2NvcGUgPSBuZXcgU2NvcGUoKTtcbiAgcHJpdmF0ZSBzY2FubmVyID0gbmV3IFNjYW5uZXIoKTtcbiAgcHJpdmF0ZSBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG5cbiAgcHVibGljIGV2YWx1YXRlKGV4cHI6IEV4cHIuRXhwcik6IGFueSB7XG4gICAgcmV0dXJuIChleHByLnJlc3VsdCA9IGV4cHIuYWNjZXB0KHRoaXMpKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBpcGVsaW5lRXhwcihleHByOiBFeHByLlBpcGVsaW5lKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLnJpZ2h0IGluc3RhbmNlb2YgRXhwci5DYWxsKSB7XG4gICAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQuY2FsbGVlKTtcbiAgICAgIGNvbnN0IGFyZ3MgPSBbdmFsdWVdO1xuICAgICAgZm9yIChjb25zdCBhcmcgb2YgZXhwci5yaWdodC5hcmdzKSB7XG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmcgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHRoaXMuZXZhbHVhdGUoYXJnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChleHByLnJpZ2h0LmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5yaWdodC5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0IGZuID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICByZXR1cm4gZm4odmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXJyb3dGdW5jdGlvbkV4cHIoZXhwcjogRXhwci5BcnJvd0Z1bmN0aW9uKTogYW55IHtcbiAgICBjb25zdCBjYXB0dXJlZFNjb3BlID0gdGhpcy5zY29wZTtcbiAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gdGhpcy5zY29wZTtcbiAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGUoY2FwdHVyZWRTY29wZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cHIucGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIucGFyYW1zW2ldLmxleGVtZSwgYXJnc1tpXSk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmJvZHkpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHByZXY7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30sIGxpbmU/OiBudW1iZXIsIGNvbD86IG51bWJlcik6IHZvaWQge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCBsaW5lLCBjb2wpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VmFyaWFibGVFeHByKGV4cHI6IEV4cHIuVmFyaWFibGUpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnNjb3BlLmdldChleHByLm5hbWUubGV4ZW1lKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEFzc2lnbkV4cHIoZXhwcjogRXhwci5Bc3NpZ24pOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICB0aGlzLnNjb3BlLnNldChleHByLm5hbWUubGV4ZW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0S2V5RXhwcihleHByOiBFeHByLktleSk6IGFueSB7XG4gICAgcmV0dXJuIGV4cHIubmFtZS5saXRlcmFsO1xuICB9XG5cbiAgcHVibGljIHZpc2l0R2V0RXhwcihleHByOiBFeHByLkdldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgaWYgKCFlbnRpdHkgJiYgZXhwci50eXBlID09PSBUb2tlblR5cGUuUXVlc3Rpb25Eb3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHlba2V5XTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFNldEV4cHIoZXhwcjogRXhwci5TZXQpOiBhbnkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoZXhwci5rZXkpO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBlbnRpdHlba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IEV4cHIuUG9zdGZpeCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlICsgZXhwci5pbmNyZW1lbnQ7XG5cbiAgICBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICB0aGlzLnNjb3BlLnNldChleHByLmVudGl0eS5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZXhwci5lbnRpdHkgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICBleHByLmVudGl0eS5lbnRpdHksXG4gICAgICAgIGV4cHIuZW50aXR5LmtleSxcbiAgICAgICAgbmV3IEV4cHIuTGl0ZXJhbChuZXdWYWx1ZSwgZXhwci5saW5lKSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgICAgdGhpcy5ldmFsdWF0ZShhc3NpZ24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuSU5WQUxJRF9QT1NURklYX0xWQUxVRSwgeyBlbnRpdHk6IGV4cHIuZW50aXR5IH0sIGV4cHIubGluZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGlzdEV4cHIoZXhwcjogRXhwci5MaXN0KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHIudmFsdWUpIHtcbiAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgdmFsdWVzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoZXhwcmVzc2lvbiBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U3ByZWFkRXhwcihleHByOiBFeHByLlNwcmVhZCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHRlbXBsYXRlUGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMuZXZhbHVhdGUoZXhwcmVzc2lvbikudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBFeHByLlRlbXBsYXRlKTogYW55IHtcbiAgICBjb25zdCByZXN1bHQgPSBleHByLnZhbHVlLnJlcGxhY2UoXG4gICAgICAvXFx7XFx7KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVQYXJzZShwbGFjZWhvbGRlcik7XG4gICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0QmluYXJ5RXhwcihleHByOiBFeHByLkJpbmFyeSk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG5cbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAtIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU2xhc2g6XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0YXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgKiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnQ6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QZXJjZW50RXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICUgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzOlxuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGlwZTpcbiAgICAgICAgcmV0dXJuIGxlZnQgfCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkNhcmV0OlxuICAgICAgICByZXR1cm4gbGVmdCBeIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlcjpcbiAgICAgICAgcmV0dXJuIGxlZnQgPiByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzOlxuICAgICAgICByZXR1cm4gbGVmdCA8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVzc0VxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA8PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWw6XG4gICAgICBjYXNlIFRva2VuVHlwZS5FcXVhbEVxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbnN0YW5jZW9mOlxuICAgICAgICByZXR1cm4gbGVmdCBpbnN0YW5jZW9mIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuSW46XG4gICAgICAgIHJldHVybiBsZWZ0IGluIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuTGVmdFNoaWZ0OlxuICAgICAgICByZXR1cm4gbGVmdCA8PCByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlJpZ2h0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0ID4+IHJpZ2h0O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOS05PV05fQklOQVJZX09QRVJBVE9SLCB7IG9wZXJhdG9yOiBleHByLm9wZXJhdG9yIH0sIGV4cHIubGluZSk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyB1bnJlYWNoYWJsZVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdExvZ2ljYWxFeHByKGV4cHI6IEV4cHIuTG9naWNhbCk6IGFueSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZXZhbHVhdGUoZXhwci5sZWZ0KTtcblxuICAgIGlmIChleHByLm9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5Pcikge1xuICAgICAgaWYgKGxlZnQpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRlcm5hcnlFeHByKGV4cHI6IEV4cHIuVGVybmFyeSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5jb25kaXRpb24pXG4gICAgICA/IHRoaXMuZXZhbHVhdGUoZXhwci50aGVuRXhwcilcbiAgICAgIDogdGhpcy5ldmFsdWF0ZShleHByLmVsc2VFeHByKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE51bGxDb2FsZXNjaW5nRXhwcihleHByOiBFeHByLk51bGxDb2FsZXNjaW5nKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGlmIChsZWZ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEdyb3VwaW5nRXhwcihleHByOiBFeHByLkdyb3VwaW5nKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmV4cHJlc3Npb24pO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TGl0ZXJhbEV4cHIoZXhwcjogRXhwci5MaXRlcmFsKTogYW55IHtcbiAgICByZXR1cm4gZXhwci52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFVuYXJ5RXhwcihleHByOiBFeHByLlVuYXJ5KTogYW55IHtcbiAgICBjb25zdCByaWdodCA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgc3dpdGNoIChleHByLm9wZXJhdG9yLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzOlxuICAgICAgICByZXR1cm4gLXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZzpcbiAgICAgICAgcmV0dXJuICFyaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlRpbGRlOlxuICAgICAgICByZXR1cm4gfnJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGx1c1BsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51c01pbnVzOiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgICBOdW1iZXIocmlnaHQpICsgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlBsdXNQbHVzID8gMSA6IC0xKTtcbiAgICAgICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLlZhcmlhYmxlKSB7XG4gICAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5yaWdodC5uYW1lLmxleGVtZSwgbmV3VmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkdldCkge1xuICAgICAgICAgIGNvbnN0IGFzc2lnbiA9IG5ldyBFeHByLlNldChcbiAgICAgICAgICAgIGV4cHIucmlnaHQuZW50aXR5LFxuICAgICAgICAgICAgZXhwci5yaWdodC5rZXksXG4gICAgICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICAgIEtFcnJvckNvZGUuSU5WQUxJRF9QUkVGSVhfUlZBTFVFLFxuICAgICAgICAgICAgeyByaWdodDogZXhwci5yaWdodCB9LFxuICAgICAgICAgICAgZXhwci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5LTk9XTl9VTkFSWV9PUEVSQVRPUiwgeyBvcGVyYXRvcjogZXhwci5vcGVyYXRvciB9LCBleHByLmxpbmUpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gc2hvdWxkIGJlIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q2FsbEV4cHIoZXhwcjogRXhwci5DYWxsKTogYW55IHtcbiAgICAvLyB2ZXJpZnkgY2FsbGVlIGlzIGEgZnVuY3Rpb25cbiAgICBjb25zdCBjYWxsZWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2FsbGVlKTtcbiAgICBpZiAoY2FsbGVlID09IG51bGwgJiYgZXhwci5vcHRpb25hbCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIGNhbGxlZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTk9UX0FfRlVOQ1RJT04sIHsgY2FsbGVlOiBjYWxsZWUgfSwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgLy8gZXZhbHVhdGUgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgY29uc3QgYXJncyA9IFtdO1xuICAgIGZvciAoY29uc3QgYXJndW1lbnQgb2YgZXhwci5hcmdzKSB7XG4gICAgICBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICBhcmdzLnB1c2goLi4udGhpcy5ldmFsdWF0ZSgoYXJndW1lbnQgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmd1bWVudCkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBleGVjdXRlIGZ1bmN0aW9uIOKAlCBwcmVzZXJ2ZSBgdGhpc2AgZm9yIG1ldGhvZCBjYWxsc1xuICAgIGlmIChleHByLmNhbGxlZSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICByZXR1cm4gY2FsbGVlLmFwcGx5KGV4cHIuY2FsbGVlLmVudGl0eS5yZXN1bHQsIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2FsbGVlKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdE5ld0V4cHIoZXhwcjogRXhwci5OZXcpOiBhbnkge1xuICAgIGNvbnN0IGNsYXp6ID0gdGhpcy5ldmFsdWF0ZShleHByLmNsYXp6KTtcblxuICAgIGlmICh0eXBlb2YgY2xhenogIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgS0Vycm9yQ29kZS5OT1RfQV9DTEFTUyxcbiAgICAgICAgeyBjbGF6ejogY2xhenogfSxcbiAgICAgICAgZXhwci5saW5lXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChjb25zdCBhcmcgb2YgZXhwci5hcmdzKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBjbGF6eiguLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IEV4cHIuRGljdGlvbmFyeSk6IGFueSB7XG4gICAgY29uc3QgZGljdDogYW55ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChwcm9wZXJ0eSBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGljdCwgdGhpcy5ldmFsdWF0ZSgocHJvcGVydHkgYXMgRXhwci5TcHJlYWQpLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkua2V5KTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNldCkudmFsdWUpO1xuICAgICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpY3Q7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRUeXBlb2ZFeHByKGV4cHI6IEV4cHIuVHlwZW9mKTogYW55IHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRFYWNoRXhwcihleHByOiBFeHByLkVhY2gpOiBhbnkge1xuICAgIHJldHVybiBbXG4gICAgICBleHByLm5hbWUubGV4ZW1lLFxuICAgICAgZXhwci5rZXkgPyBleHByLmtleS5sZXhlbWUgOiBudWxsLFxuICAgICAgdGhpcy5ldmFsdWF0ZShleHByLml0ZXJhYmxlKSxcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRWb2lkRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICB2aXNpdERlYnVnRXhwcihleHByOiBFeHByLlZvaWQpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZXhwci52YWx1ZSk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50S05vZGUoa25vZGU6IEVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlS05vZGUoa25vZGU6IEF0dHJpYnV0ZSwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRUZXh0S05vZGUoa25vZGU6IFRleHQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0Q29tbWVudEtOb2RlKGtub2RlOiBDb21tZW50LCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdERvY3R5cGVLTm9kZShrbm9kZTogRG9jdHlwZSwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IEtOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBLTm9kZVtdO1xuICAgIHB1YmxpYyBzZWxmOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBLTm9kZVtdLCBjaGlsZHJlbjogS05vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0S05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3R5cGVzL3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciB7XG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xuICBwdWJsaWMgbm9kZXM6IE5vZGUuS05vZGVbXTtcblxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLktOb2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLm5vZGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaCguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZShlb2ZFcnJvcjogc3RyaW5nID0gXCJcIik6IHZvaWQge1xuICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5saW5lICs9IDE7XG4gICAgICAgIHRoaXMuY29sID0gMDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0VPRiwgeyBlb2ZFcnJvcjogZW9mRXJyb3IgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2soY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9KTogYW55IHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoY29kZSwgYXJncywgdGhpcy5saW5lLCB0aGlzLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIG5vZGUoKTogTm9kZS5LTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuS05vZGU7XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwvXCIpKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9DTE9TSU5HX1RBRyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IS0tXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5jb21tZW50KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPCFkb2N0eXBlXCIpIHx8IHRoaXMubWF0Y2goXCI8IURPQ1RZUEVcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmRvY3R5cGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8XCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5lbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSB0aGlzLnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiBudWxsIHtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9UQUdfTkFNRSk7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVCk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogbmFtZSB9KTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBwYXJlbnQgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuQkxBTktfQVRUUklCVVRFX05BTUUpO1xuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoXCInXCIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKCdcIicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwie3tcIikpIHsgZGVwdGgrKzsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgdGhpcy5tYXRjaChcIn19XCIpKSB7IGRlcHRoLS07IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdGhpcy5wZWVrKFwiPFwiKSkgeyBicmVhazsgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXJhdykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRoaXMuZGVjb2RlRW50aXRpZXMocmF3KSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUVudGl0aWVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCJcXHUwMGEwXCIpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgICAgLnJlcGxhY2UoLyZhcG9zOy9nLCBcIidcIilcbiAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7IC8vIG11c3QgYmUgbGFzdCB0byBhdm9pZCBkb3VibGUtZGVjb2RpbmdcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q2xhc3MgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSb3V0ZUNvbmZpZyB7XG4gIHBhdGg6IHN0cmluZztcbiAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgZ3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGUocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwiXCIsIHBhdGgpO1xuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgUG9wU3RhdGVFdmVudChcInBvcHN0YXRlXCIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoUGF0aChwYXR0ZXJuOiBzdHJpbmcsIHBhdGhuYW1lOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGlmIChwYXR0ZXJuID09PSBcIipcIikgcmV0dXJuIHt9O1xuICBjb25zdCBwYXR0ZXJuUGFydHMgPSBwYXR0ZXJuLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHBhdGhuYW1lLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmIChwYXR0ZXJuUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVyblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHBhdHRlcm5QYXJ0c1tpXS5zdGFydHNXaXRoKFwiOlwiKSkge1xuICAgICAgcGFyYW1zW3BhdHRlcm5QYXJ0c1tpXS5zbGljZSgxKV0gPSBwYXRoUGFydHNbaV07XG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuUGFydHNbaV0gIT09IHBhdGhQYXJ0c1tpXSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBwcml2YXRlIHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuXG4gIHNldFJvdXRlcyhyb3V0ZXM6IFJvdXRlQ29uZmlnW10pOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcbiAgfVxuXG4gIG9uTW91bnQoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCAoKSA9PiB0aGlzLl9uYXZpZ2F0ZSgpLCB7XG4gICAgICBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwsXG4gICAgfSk7XG4gICAgdGhpcy5fbmF2aWdhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX25hdmlnYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGZvciAoY29uc3Qgcm91dGUgb2YgdGhpcy5yb3V0ZXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoUGF0aChyb3V0ZS5wYXRoLCBwYXRobmFtZSk7XG4gICAgICBpZiAocGFyYW1zID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIGlmIChyb3V0ZS5ndWFyZCkge1xuICAgICAgICBjb25zdCBhbGxvd2VkID0gYXdhaXQgcm91dGUuZ3VhcmQoKTtcbiAgICAgICAgaWYgKCFhbGxvd2VkKSByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9tb3VudChyb3V0ZS5jb21wb25lbnQsIHBhcmFtcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbW91bnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5yZWYgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCFlbGVtZW50IHx8ICF0aGlzLnRyYW5zcGlsZXIpIHJldHVybjtcbiAgICB0aGlzLnRyYW5zcGlsZXIubW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3MsIGVsZW1lbnQsIHBhcmFtcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBCb3VuZGFyeSB7XG4gIHByaXZhdGUgc3RhcnQ6IENvbW1lbnQ7XG4gIHByaXZhdGUgZW5kOiBDb21tZW50O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogTm9kZSwgbGFiZWw6IHN0cmluZyA9IFwiYm91bmRhcnlcIikge1xuICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1zdGFydGApO1xuICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tZW5kYCk7XG4gICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0aGlzLnN0YXJ0KTtcbiAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGhpcy5lbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5zdGFydCk7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5lbmQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudDtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdG9SZW1vdmUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIHRoaXMuZW5kLnBhcmVudE5vZGU/Lmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgbm9kZXMoKTogTm9kZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5zdGFydC5uZXh0U2libGluZztcbiAgICB3aGlsZSAoY3VycmVudCAmJiBjdXJyZW50ICE9PSB0aGlzLmVuZCkge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcGFyZW50KCk6IE5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wYXJlbnROb2RlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcblxudHlwZSBUYXNrID0gKCkgPT4gdm9pZDtcblxuY29uc3QgcXVldWUgPSBuZXcgTWFwPENvbXBvbmVudCwgVGFza1tdPigpO1xuY29uc3QgbmV4dFRpY2tDYWxsYmFja3M6IFRhc2tbXSA9IFtdO1xubGV0IGlzU2NoZWR1bGVkID0gZmFsc2U7XG5sZXQgYmF0Y2hpbmdFbmFibGVkID0gdHJ1ZTtcblxuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGlzU2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgLy8gMS4gUHJvY2VzcyBjb21wb25lbnQgdXBkYXRlc1xuICBmb3IgKGNvbnN0IFtpbnN0YW5jZSwgdGFza3NdIG9mIHF1ZXVlLmVudHJpZXMoKSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBDYWxsIHByZS11cGRhdGUgaG9vayAob25seSBmb3IgcmVhY3RpdmUgdXBkYXRlcywgbm90IGZpcnN0IG1vdW50KVxuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vbkNoYW5nZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBpbnN0YW5jZS5vbkNoYW5nZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gUnVuIGFsbCBzdXJnaWNhbCBET00gdXBkYXRlcyBmb3IgdGhpcyBjb21wb25lbnRcbiAgICAgIGZvciAoY29uc3QgdGFzayBvZiB0YXNrcykge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbGwgcG9zdC11cGRhdGUgaG9va1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIltLYXNwZXJdIEVycm9yIGR1cmluZyBjb21wb25lbnQgdXBkYXRlOlwiLCBlKTtcbiAgICB9XG4gIH1cbiAgcXVldWUuY2xlYXIoKTtcblxuICAvLyAyLiBQcm9jZXNzIG5leHRUaWNrIGNhbGxiYWNrc1xuICBjb25zdCBjYWxsYmFja3MgPSBuZXh0VGlja0NhbGxiYWNrcy5zcGxpY2UoMCk7XG4gIGZvciAoY29uc3QgY2Igb2YgY2FsbGJhY2tzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNiKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIltLYXNwZXJdIEVycm9yIGluIG5leHRUaWNrIGNhbGxiYWNrOlwiLCBlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlVXBkYXRlKGluc3RhbmNlOiBDb21wb25lbnQsIHRhc2s6IFRhc2spIHtcbiAgaWYgKCFiYXRjaGluZ0VuYWJsZWQpIHtcbiAgICB0YXNrKCk7XG4gICAgLy8gRHVyaW5nIHN5bmMgbW91bnQsIHdlIGRvbid0IGNhbGwgb25DaGFuZ2VzIG9yIG9uUmVuZGVyIGhlcmUuXG4gICAgLy8gb25SZW5kZXIgaXMgY2FsbGVkIG1hbnVhbGx5IGF0IHRoZSBlbmQgb2YgdHJhbnNwaWxlL2Jvb3RzdHJhcC5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXF1ZXVlLmhhcyhpbnN0YW5jZSkpIHtcbiAgICBxdWV1ZS5zZXQoaW5zdGFuY2UsIFtdKTtcbiAgfVxuICBxdWV1ZS5nZXQoaW5zdGFuY2UpIS5wdXNoKHRhc2spO1xuXG4gIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgcXVldWVNaWNyb3Rhc2soZmx1c2gpO1xuICB9XG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYSBmdW5jdGlvbiB3aXRoIGJhdGNoaW5nIGRpc2FibGVkLiBcbiAqIFVzZWQgZm9yIGluaXRpYWwgbW91bnQgYW5kIG1hbnVhbCByZW5kZXJzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmx1c2hTeW5jKGZuOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IHByZXYgPSBiYXRjaGluZ0VuYWJsZWQ7XG4gIGJhdGNoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICB0cnkge1xuICAgIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgYmF0Y2hpbmdFbmFibGVkID0gcHJldjtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlIG5leHQgZnJhbWV3b3JrIHVwZGF0ZSBjeWNsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKCk6IFByb21pc2U8dm9pZD47XG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2I6IFRhc2spOiB2b2lkO1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNiPzogVGFzayk6IFByb21pc2U8dm9pZD4gfCB2b2lkIHtcbiAgaWYgKGNiKSB7XG4gICAgbmV4dFRpY2tDYWxsYmFja3MucHVzaChjYik7XG4gICAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgcXVldWVNaWNyb3Rhc2soZmx1c2gpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBuZXh0VGlja0NhbGxiYWNrcy5wdXNoKHJlc29sdmUpO1xuICAgIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50Q2xhc3MsIENvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uUGFyc2VyIH0gZnJvbSBcIi4vZXhwcmVzc2lvbi1wYXJzZXJcIjtcbmltcG9ydCB7IEludGVycHJldGVyIH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXJcIjtcbmltcG9ydCB7IFJvdXRlciwgUm91dGVDb25maWcgfSBmcm9tIFwiLi9yb3V0ZXJcIjtcbmltcG9ydCB7IFNjYW5uZXIgfSBmcm9tIFwiLi9zY2FubmVyXCI7XG5pbXBvcnQgeyBTY29wZSB9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgeyBlZmZlY3QgfSBmcm9tIFwiLi9zaWduYWxcIjtcbmltcG9ydCB7IEJvdW5kYXJ5IH0gZnJvbSBcIi4vYm91bmRhcnlcIjtcbmltcG9ydCB7IFRlbXBsYXRlUGFyc2VyIH0gZnJvbSBcIi4vdGVtcGxhdGUtcGFyc2VyXCI7XG5pbXBvcnQgeyBxdWV1ZVVwZGF0ZSwgZmx1c2hTeW5jIH0gZnJvbSBcIi4vc2NoZWR1bGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSwgS0Vycm9yQ29kZVR5cGUgfSBmcm9tIFwiLi90eXBlcy9lcnJvclwiO1xuaW1wb3J0ICogYXMgS05vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcblxuY29uc3QgS0VZX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge1xuICBlc2M6IFtcIkVzY2FwZVwiLCBcIkVzY1wiXSxcbiAgZXNjYXBlOiBbXCJFc2NhcGVcIiwgXCJFc2NcIl0sXG4gIHNwYWNlOiBbXCIgXCIsIFwiU3BhY2ViYXJcIl0sXG4gIHVwOiBbXCJBcnJvd1VwXCIsIFwiVXBcIl0sXG4gIGRvd246IFtcIkFycm93RG93blwiLCBcIkRvd25cIl0sXG4gIGxlZnQ6IFtcIkFycm93TGVmdFwiLCBcIkxlZnRcIl0sXG4gIHJpZ2h0OiBbXCJBcnJvd1JpZ2h0XCIsIFwiUmlnaHRcIl0sXG4gIGRlbDogW1wiRGVsZXRlXCIsIFwiRGVsXCJdLFxuICBkZWxldGU6IFtcIkRlbGV0ZVwiLCBcIkRlbFwiXSxcbiAgaW5zOiBbXCJJbnNlcnRcIl0sXG4gIGRvdDogW1wiLlwiXSxcbiAgY29tbWE6IFtcIixcIl0sXG4gIHNsYXNoOiBbXCIvXCJdLFxuICBiYWNrc2xhc2g6IFtcIlxcXFxcIl0sXG4gIHBsdXM6IFtcIitcIl0sXG4gIG1pbnVzOiBbXCItXCJdLFxuICBlcXVhbDogW1wiPVwiXSxcbn07XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBwcml2YXRlIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKCk7XG4gIHB1YmxpYyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgPSB7fTtcbiAgcHVibGljIG1vZGU6IFwiZGV2ZWxvcG1lbnRcIiB8IFwicHJvZHVjdGlvblwiID0gXCJkZXZlbG9wbWVudFwiO1xuICBwcml2YXRlIGlzUmVuZGVyaW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IHsgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5IH0pIHtcbiAgICB0aGlzLnJlZ2lzdHJ5W1wicm91dGVyXCJdID0geyBjb21wb25lbnQ6IFJvdXRlciB9O1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuO1xuICAgIGlmIChvcHRpb25zLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0geyAuLi50aGlzLnJlZ2lzdHJ5LCAuLi5vcHRpb25zLnJlZ2lzdHJ5IH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJDb21wb25lbnRJbnN0YW5jZShcbiAgICBpbnN0YW5jZTogYW55LFxuICAgIG5vZGVzOiBLTm9kZS5LTm9kZVtdLFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHJlc3RvcmVTY29wZTogU2NvcGUsXG4gICAgc2xvdHM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICk6IHZvaWQge1xuICAgIGlmIChzbG90cykgaW5zdGFuY2UuJHNsb3RzID0gc2xvdHM7XG5cbiAgICBpbnN0YW5jZS4kcmVuZGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koZWxlbWVudCk7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBpbnN0YW5jZSk7XG4gICAgICAgIHNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBpbnN0YW5jZSk7XG4gICAgICAgIGlmIChzbG90cykgaW5zdGFuY2UuJHNsb3RzID0gc2xvdHM7XG4gICAgICAgIGNvbnN0IHByZXZTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBlbGVtZW50KTtcbiAgICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGluc3RhbmNlLm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikgaW5zdGFuY2Uub25Nb3VudCgpO1xuXG4gICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBpbnN0YW5jZSk7XG4gICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGluc3RhbmNlKTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgZmx1c2hTeW5jKCgpID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Mobm9kZXMsIGVsZW1lbnQpO1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgIH0pO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZU5vZGVzKHRhZzogc3RyaW5nKTogS05vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLnJlZ2lzdHJ5W3RhZ107XG4gICAgaWYgKGVudHJ5Lm5vZGVzICE9PSB1bmRlZmluZWQpIHJldHVybiBlbnRyeS5ub2RlcztcbiAgICBjb25zdCBzb3VyY2UgPSAoZW50cnkuY29tcG9uZW50IGFzIGFueSkudGVtcGxhdGU7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIGVudHJ5Lm5vZGVzID0gW107XG4gICAgICByZXR1cm4gZW50cnkubm9kZXM7XG4gICAgfVxuICAgIGVudHJ5Lm5vZGVzID0gdGhpcy50ZW1wbGF0ZVBhcnNlci5wYXJzZShzb3VyY2UpO1xuICAgIHJldHVybiBlbnRyeS5ub2RlcztcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgY29uc3QgZWwgPSBub2RlIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBjb25zdCBtaXNwbGFjZWQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZWlmXCIsIFwiQGVsc2VcIl0pO1xuICAgICAgaWYgKG1pc3BsYWNlZCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgaGFuZGxlZCBieSBkb0lmLCBpZiB3ZSByZWFjaCB0aGVtIGhlcmUgaXQncyBhbiBlcnJvclxuICAgICAgICBjb25zdCBuYW1lID0gbWlzcGxhY2VkLm5hbWUuc3RhcnRzV2l0aChcIkBcIikgPyBtaXNwbGFjZWQubmFtZS5zbGljZSgxKSA6IG1pc3BsYWNlZC5uYW1lO1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTUExBQ0VEX0NPTkRJVElPTkFMLCB7IG5hbWU6IG5hbWUgfSwgZWwubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGtleSk/LmdldCkgY29udGludWU7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgZW50aXR5W2tleV0gPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgIGtleSAhPT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlbnRpdHksIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW50aXR5W2tleV0gPSBlbnRpdHlba2V5XS5iaW5kKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGVzIGFuIGVmZmVjdCB0aGF0IHJlc3RvcmVzIHRoZSBjdXJyZW50IHNjb3BlIG9uIGV2ZXJ5IHJlLXJ1bixcbiAgLy8gc28gZWZmZWN0cyBzZXQgdXAgaW5zaWRlIEBlYWNoIGFsd2F5cyBldmFsdWF0ZSBpbiB0aGVpciBpdGVtIHNjb3BlLlxuICBwcml2YXRlIHNjb3BlZEVmZmVjdChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3BpbGUoXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZW50aXR5OiBhbnksXG4gICAgY29udGFpbmVyOiBFbGVtZW50XG4gICk6IE5vZGUge1xuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBlbnRpdHkpO1xuXG4gICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgICAgICB0aGlzLnRyaWdnZXJSZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydCh0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCAoKSA9PiB7XG4gICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXR0cmlidXRlS05vZGUobm9kZTogS05vZGUuQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ciA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZShub2RlLm5hbWUpO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgIGF0dHIudmFsdWUgPSB0aGlzLmV2YWx1YXRlVGVtcGxhdGVTdHJpbmcobm9kZS52YWx1ZSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFja0VmZmVjdChhdHRyLCBzdG9wKTtcblxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIChwYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0Q29tbWVudEtOb2RlKF9ub2RlOiBLTm9kZS5Db21tZW50LCBfcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIC8vIHRlbXBsYXRlIGNvbW1lbnRzIGFyZSBzdHJpcHBlZCBmcm9tIERPTSBvdXRwdXRcbiAgfVxuXG4gIHByaXZhdGUgdHJhY2tFZmZlY3QodGFyZ2V0OiBhbnksIHN0b3A6IGFueSkge1xuICAgIGlmICghdGFyZ2V0LiRrYXNwZXJFZmZlY3RzKSB0YXJnZXQuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB0YXJnZXQuJGthc3BlckVmZmVjdHMucHVzaChzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEF0dHIoXG4gICAgbm9kZTogS05vZGUuRWxlbWVudCxcbiAgICBuYW1lOiBzdHJpbmdbXVxuICApOiBLTm9kZS5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuYXR0cmlidXRlcyB8fCAhbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmliID0gbm9kZS5hdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+XG4gICAgICBuYW1lLmluY2x1ZGVzKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZSlcbiAgICApO1xuICAgIGlmIChhdHRyaWIpIHtcbiAgICAgIHJldHVybiBhdHRyaWIgYXMgS05vZGUuQXR0cmlidXRlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZG9JZihleHByZXNzaW9uczogSWZFbHNlTm9kZVtdLCBwYXJlbnQ6IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiaWZcIik7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0cmFja2luZ1Njb3BlID0gaW5zdGFuY2UgPyBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSkgOiB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuXG4gICAgICAvLyBFdmFsdWF0ZSBjb25kaXRpb25zIHN5bmNocm9ub3VzbHkgdG8gZW5zdXJlIHNpZ25hbCB0cmFja2luZ1xuICAgICAgY29uc3QgcmVzdWx0czogYm9vbGVhbltdID0gW107XG4gICAgICByZXN1bHRzLnB1c2goISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25zWzBdWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpKTtcblxuICAgICAgaWYgKCFyZXN1bHRzWzBdKSB7XG4gICAgICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucy5zbGljZSgxKSkge1xuICAgICAgICAgIGlmICh0aGlzLmZpbmRBdHRyKGV4cHJlc3Npb25bMF0gYXMgS05vZGUuRWxlbWVudCwgW1wiQGVsc2VpZlwiXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICEhdGhpcy5leGVjdXRlKChleHByZXNzaW9uWzFdIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHZhbCk7XG4gICAgICAgICAgICBpZiAodmFsKSBicmVhaztcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZVwiXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gdHJhY2tpbmdTY29wZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0c1swXSkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnNbMF1bMF0uYWNjZXB0KHRoaXMsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0c1tpXSkge1xuICAgICAgICAgICAgICBleHByZXNzaW9uc1tpXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0VhY2goZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCBrZXlBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAa2V5XCJdKTtcbiAgICBpZiAoa2V5QXR0cikge1xuICAgICAgdGhpcy5kb0VhY2hLZXllZChlYWNoLCBub2RlLCBwYXJlbnQsIGtleUF0dHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvRWFjaFVua2V5ZWQoZWFjaCwgbm9kZSwgcGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaFVua2V5ZWQoZWFjaDogS05vZGUuQXR0cmlidXRlLCBub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ6IE5vZGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKGVhY2gudmFsdWUpO1xuICAgICAgY29uc3QgW25hbWUsIGtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgICBjb25zdCBzY29wZVZhbHVlczogYW55ID0geyBbbmFtZV06IGl0ZW0gfTtcbiAgICAgICAgICBpZiAoa2V5KSBzY29wZVZhbHVlc1trZXldID0gaW5kZXg7XG5cbiAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKG9yaWdpbmFsU2NvcGUsIHNjb3BlVmFsdWVzKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBvcmlnaW5hbFNjb3BlO1xuICAgICAgfTtcblxuICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgIHF1ZXVlVXBkYXRlKGluc3RhbmNlLCB0YXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhc2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgKGJvdW5kYXJ5IGFzIGFueSkuc3RhcnQuJGthc3BlclJlZnJlc2ggPSBydW47XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QocnVuKTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGJvdW5kYXJ5LCBzdG9wKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclJlZnJlc2gobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIC8vIDEuIFJlLXJ1biBzdHJ1Y3R1cmFsIGxvZ2ljIChpZi9lYWNoL3doaWxlKVxuICAgIGlmICgobm9kZSBhcyBhbnkpLiRrYXNwZXJSZWZyZXNoKSB7XG4gICAgICAobm9kZSBhcyBhbnkpLiRrYXNwZXJSZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgLy8gMi4gUmUtcnVuIGFsbCBzdXJnaWNhbCBlZmZlY3RzICh0ZXh0IGludGVycG9sYXRpb24sIGF0dHJpYnV0ZXMsIGV0Yy4pXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0b3AucnVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnRyaWdnZXJSZWZyZXNoKGNoaWxkKSk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBpbmRleEtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXMgaW1tZWRpYXRlbHlcbiAgICAgIGNvbnN0IG5ld0l0ZW1zOiBBcnJheTx7IGl0ZW06IGFueTsgaWR4OiBudW1iZXI7IGtleTogYW55IH0+ID0gW107XG4gICAgICBjb25zdCBzZWVuS2V5cyA9IG5ldyBTZXQoKTtcbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIHNlZW5LZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBbS2FzcGVyXSBEdXBsaWNhdGUga2V5IGRldGVjdGVkIGluIEBlYWNoOiBcIiR7a2V5fVwiLiBLZXlzIG11c3QgYmUgdW5pcXVlIHRvIGVuc3VyZSBjb3JyZWN0IHJlY29uY2lsaWF0aW9uLmApO1xuICAgICAgICB9XG4gICAgICAgIHNlZW5LZXlzLmFkZChrZXkpO1xuXG4gICAgICAgIG5ld0l0ZW1zLnB1c2goeyBpdGVtOiBpdGVtLCBpZHg6IGluZGV4LCBrZXk6IGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBkb21Ob2RlXSBvZiBrZXllZE5vZGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyIHVzaW5nIGEgY3Vyc29yIHRvIGF2b2lkIHVubmVjZXNzYXJ5IG1vdmVzXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IChib3VuZGFyeSBhcyBhbnkpLmVuZC5wYXJlbnROb2RlIGFzIE5vZGU7XG4gICAgICAgIGxldCBsYXN0SW5zZXJ0ZWQ6IE5vZGUgPSAoYm91bmRhcnkgYXMgYW55KS5zdGFydDtcblxuICAgICAgICBmb3IgKGNvbnN0IHsgaXRlbSwgaWR4LCBrZXkgfSBvZiBuZXdJdGVtcykge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaWR4O1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuXG4gICAgICAgICAgaWYgKGtleWVkTm9kZXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBrZXllZE5vZGVzLmdldChrZXkpITtcblxuICAgICAgICAgICAgLy8gT25seSBtb3ZlIHRoZSBub2RlIGlmIGl0J3Mgbm90IGFscmVhZHkgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcgIT09IGRvbU5vZGUpIHtcbiAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShkb21Ob2RlLCBsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdEluc2VydGVkID0gZG9tTm9kZTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHNjb3BlIGFuZCB0cmlnZ2VyIHJlLXJlbmRlciBvZiBuZXN0ZWQgc3RydWN0dXJhbCBkaXJlY3RpdmVzXG4gICAgICAgICAgICBjb25zdCBub2RlU2NvcGUgPSAoZG9tTm9kZSBhcyBhbnkpLiRrYXNwZXJTY29wZTtcbiAgICAgICAgICAgIGlmIChub2RlU2NvcGUpIHtcbiAgICAgICAgICAgICAgbm9kZVNjb3BlLnNldChuYW1lLCBpdGVtKTtcbiAgICAgICAgICAgICAgaWYgKGluZGV4S2V5KSBub2RlU2NvcGUuc2V0KGluZGV4S2V5LCBpZHgpO1xuXG4gICAgICAgICAgICAgIC8vIElmIGl0IGhhcyBpdHMgb3duIHJlbmRlciBsb2dpYyAobmVzdGVkIGVhY2gvaWYpLCB0cmlnZ2VyIGl0IHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgIHRoaXMudHJpZ2dlclJlZnJlc2goZG9tTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIGlmIChjcmVhdGVkKSB7XG4gICAgICAgICAgICAgIC8vIGNyZWF0ZUVsZW1lbnQgaW5zZXJ0cyBiZWZvcmUgZW5kOyBtb3ZlIHRvIGNvcnJlY3QgcG9zaXRpb24gaWYgbmVlZGVkXG4gICAgICAgICAgICAgIGlmIChsYXN0SW5zZXJ0ZWQubmV4dFNpYmxpbmcgIT09IGNyZWF0ZWQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNyZWF0ZWQsIGxhc3RJbnNlcnRlZC5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGFzdEluc2VydGVkID0gY3JlYXRlZDtcbiAgICAgICAgICAgICAga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHNjb3BlIG9uIHRoZSBET00gbm9kZSBzbyB3ZSBjYW4gdXBkYXRlIGl0IGxhdGVyXG4gICAgICAgICAgICAgIChjcmVhdGVkIGFzIGFueSkuJGthc3BlclNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZVNpYmxpbmdzKG5vZGVzOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSAwO1xuICAgIGNvbnN0IGluaXRpYWxTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgbGV0IGdyb3VwU2NvcGU6IFNjb3BlIHwgbnVsbCA9IG51bGw7XG5cbiAgICB3aGlsZSAoY3VycmVudCA8IG5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2N1cnJlbnQrK107XG4gICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICBjb25zdCBlbCA9IG5vZGUgYXMgS05vZGUuRWxlbWVudDtcblxuICAgICAgICAvLyAxLiBQcm9jZXNzIEBsZXQgKGxlYWtzIHRvIHNpYmxpbmdzIGFuZCBhdmFpbGFibGUgdG8gb3RoZXIgZGlyZWN0aXZlcyBvbiB0aGlzIG5vZGUpXG4gICAgICAgIGNvbnN0ICRsZXQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAbGV0XCJdKTtcbiAgICAgICAgaWYgKCRsZXQpIHtcbiAgICAgICAgICBpZiAoIWdyb3VwU2NvcGUpIHtcbiAgICAgICAgICAgIGdyb3VwU2NvcGUgPSBuZXcgU2NvcGUoaW5pdGlhbFNjb3BlKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBncm91cFNjb3BlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmV4ZWN1dGUoJGxldC52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAyLiBWYWxpZGF0aW9uOiBTdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICAgICAgICBjb25zdCBpZkF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAaWZcIl0pO1xuICAgICAgICBjb25zdCBlbHNlaWZBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VpZlwiXSk7XG4gICAgICAgIGNvbnN0IGVsc2VBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGVsc2VcIl0pO1xuICAgICAgICBjb25zdCAkZWFjaCA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlYWNoXCJdKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlID09PSBcImRldmVsb3BtZW50XCIpIHtcbiAgICAgICAgICBjb25zdCBzdHJ1Y3R1cmFsQ291bnQgPSBbaWZBdHRyLCBlbHNlaWZBdHRyLCBlbHNlQXR0ciwgJGVhY2hdLmZpbHRlcihhID0+IGEpLmxlbmd0aDtcbiAgICAgICAgICBpZiAoc3RydWN0dXJhbENvdW50ID4gMSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUywge30sIGVsLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIFByb2Nlc3Mgc3RydWN0dXJhbCBkaXJlY3RpdmVzIChvbmUgd2lsbCBtYXRjaCBhbmQgY29udGludWUpXG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBlbCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWZBdHRyKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbZWwsIGlmQXR0cl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBub2Rlc1tjdXJyZW50XTtcbiAgICAgICAgICAgIGlmIChuZXh0LnR5cGUgIT09IFwiZWxlbWVudFwiKSBicmVhaztcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5leHQgYXMgS05vZGUuRWxlbWVudCwgW1xuICAgICAgICAgICAgICBcIkBlbHNlXCIsXG4gICAgICAgICAgICAgIFwiQGVsc2VpZlwiLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKFtuZXh0IGFzIEtOb2RlLkVsZW1lbnQsIGF0dHJdKTtcbiAgICAgICAgICAgICAgY3VycmVudCArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kb0lmKGV4cHJlc3Npb25zLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IGluaXRpYWxTY29wZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudChub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChub2RlLm5hbWUgPT09IFwic2xvdFwiKSB7XG4gICAgICAgIGNvbnN0IG5hbWVBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAbmFtZVwiXSk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lQXR0ciA/IG5hbWVBdHRyLnZhbHVlIDogXCJkZWZhdWx0XCI7XG4gICAgICAgIGNvbnN0IHNsb3RzID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkc2xvdHNcIik7XG4gICAgICAgIGlmIChzbG90cyAmJiBzbG90c1tuYW1lXSkge1xuICAgICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgIC8vIFJlc3RvcmUgdGhlIHNjb3BlIHdoZXJlIHRoZSBzbG90IGNvbnRlbnQgd2FzIGRlZmluZWQgKExleGljYWwgU2NvcGluZykuXG4gICAgICAgICAgLy8gV2Ugc3RvcmUgdGhlIHNjb3BlIHJlZmVyZW5jZSBkaXJlY3RseSBvbiB0aGUgQXJyYXkgaW5zdGFuY2UgdG8gYXZvaWQgY2hhbmdpbmcgc2lnbmF0dXJlcy5cbiAgICAgICAgICBpZiAoc2xvdHNbbmFtZV0uc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzbG90c1tuYW1lXS5zY29wZTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKHNsb3RzW25hbWVdLCBwYXJlbnQpO1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVm9pZCA9IG5vZGUubmFtZSA9PT0gXCJ2b2lkXCI7XG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9ICEhdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdO1xuXG4gICAgICBjb25zdCBlbGVtZW50ID0gaXNWb2lkID8gcGFyZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xuICAgICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJHJlZlwiLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQ29tcG9uZW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgICAgbGV0IGNvbXBvbmVudDogYW55ID0ge307XG4gICAgICAgIGNvbnN0IGFyZ3NBdHRyID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkA6XCIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnc0F0dHIgYXMgS05vZGUuQXR0cmlidXRlW10pO1xuXG4gICAgICAgIC8vIENhcHR1cmUgY2hpbGRyZW4gZm9yIHNsb3RzLiBcbiAgICAgICAgLy8gV2UgdXNlIGEgcGxhaW4gb2JqZWN0IGtleWVkIGJ5IHNsb3QgbmFtZS4gRWFjaCB2YWx1ZSBpcyBhbiBBcnJheSBvZiBLTm9kZXMuXG4gICAgICAgIC8vIFRvIHN1cHBvcnQgbGV4aWNhbCBzY29waW5nLCB3ZSBhdHRhY2ggdGhlIGN1cnJlbnQgc2NvcGUgdG8gdGhlIEFycmF5IGluc3RhbmNlLlxuICAgICAgICBjb25zdCBzbG90czogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgZGVmYXVsdDogW10gfTtcbiAgICAgICAgc2xvdHMuZGVmYXVsdC5zY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3Qgc2xvdEF0dHIgPSB0aGlzLmZpbmRBdHRyKGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBzbG90XCJdKTtcbiAgICAgICAgICAgIGlmIChzbG90QXR0cikge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc2xvdEF0dHIudmFsdWU7XG4gICAgICAgICAgICAgIGlmICghc2xvdHNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBzbG90c1tuYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgIHNsb3RzW25hbWVdLnNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzbG90c1tuYW1lXS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsb3RzLmRlZmF1bHQucHVzaChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5sYXp5KSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG5cbiAgICAgICAgICBpZiAoZW50cnkuZmFsbGJhY2spIHtcbiAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrTm9kZXMgPSB0aGlzLnRlbXBsYXRlUGFyc2VyLnBhcnNlKChlbnRyeS5mYWxsYmFjayBhcyBhbnkpLnRlbXBsYXRlID8/IFwiXCIpO1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tJbnN0YW5jZTogYW55ID0gbmV3IGVudHJ5LmZhbGxiYWNrKHsgYXJnczoge30sIHJlZjogZWxlbWVudCwgdHJhbnNwaWxlcjogdGhpcyB9KTtcbiAgICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoZmFsbGJhY2tJbnN0YW5jZSk7XG4gICAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGZhbGxiYWNrSW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGZhbGxiYWNrSW5zdGFuY2UsIGZhbGxiYWNrTm9kZXMsIGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHJlc3RvcmVTY29wZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCEoZW50cnkgYXMgYW55KS5fcHJvbWlzZSkge1xuICAgICAgICAgICAgKGVudHJ5IGFzIGFueSkuX3Byb21pc2UgPSAoZW50cnkuY29tcG9uZW50IGFzICgpID0+IFByb21pc2U8Q29tcG9uZW50Q2xhc3M+KSgpLnRoZW4oKGNscykgPT4ge1xuICAgICAgICAgICAgICBlbnRyeS5ub2RlcyA9IHRoaXMudGVtcGxhdGVQYXJzZXIucGFyc2UoKGNscyBhcyBhbnkpLnRlbXBsYXRlID8/IFwiXCIpO1xuICAgICAgICAgICAgICBlbnRyeS5jb21wb25lbnQgPSBjbHM7XG4gICAgICAgICAgICAgIGRlbGV0ZSBlbnRyeS5sYXp5O1xuICAgICAgICAgICAgICBkZWxldGUgKGVudHJ5IGFzIGFueSkuX3Byb21pc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAoZW50cnkgYXMgYW55KS5fcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveShlbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3QgY2xzID0gZW50cnkuY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2U6IGFueSA9IG5ldyBjbHMoeyBhcmdzOiBhcmdzLCByZWY6IGVsZW1lbnQsIHRyYW5zcGlsZXI6IHRoaXMgfSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGluc3RhbmNlKTtcbiAgICAgICAgICAgIChlbGVtZW50IGFzIGFueSkuJGthc3Blckluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGluc3RhbmNlLCBlbnRyeS5ub2RlcyEsIGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHJlc3RvcmVTY29wZSwgc2xvdHMpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0/LmNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudCA9IG5ldyAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLmNvbXBvbmVudCBhcyBDb21wb25lbnRDbGFzcykoe1xuICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgIHJlZjogZWxlbWVudCxcbiAgICAgICAgICAgIHRyYW5zcGlsZXI6IHRoaXMsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmJpbmRNZXRob2RzKGNvbXBvbmVudCk7XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS4ka2FzcGVySW5zdGFuY2UgPSBjb21wb25lbnQ7XG5cbiAgICAgICAgICBpZiAobm9kZS5uYW1lID09PSBcInJvdXRlclwiICYmIGNvbXBvbmVudCBpbnN0YW5jZW9mIFJvdXRlcikge1xuICAgICAgICAgICAgY29uc3Qgcm91dGVTY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0Um91dGVzKHRoaXMuZXh0cmFjdFJvdXRlcyhub2RlLmNoaWxkcmVuLCB1bmRlZmluZWQsIHJvdXRlU2NvcGUpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudEluc3RhbmNlKGNvbXBvbmVudCwgdGhpcy5yZXNvbHZlTm9kZXMobm9kZS5uYW1lKSwgZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcmVzdG9yZVNjb3BlLCBzbG90cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWb2lkKSB7XG4gICAgICAgIC8vIGV2ZW50IGJpbmRpbmdcbiAgICAgICAgY29uc3QgZXZlbnRzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT5cbiAgICAgICAgICAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIilcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICAgIHRoaXMuY3JlYXRlRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudCBhcyBLTm9kZS5BdHRyaWJ1dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgZmlyc3QpXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKFxuICAgICAgICAgIChhdHRyKSA9PiAhKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB0aGlzLmV2YWx1YXRlKGF0dHIsIGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2hvcnRoYW5kIGF0dHJpYnV0ZXMgKHByb2Nlc3NlZCBzZWNvbmQsIGFsbG93cyBtZXJnaW5nKVxuICAgICAgICBjb25zdCBzaG9ydGhhbmRBdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcigoYXR0cikgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWU7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG5hbWUuc3RhcnRzV2l0aChcIkBcIikgJiZcbiAgICAgICAgICAgICFbXCJAaWZcIiwgXCJAZWxzZWlmXCIsIFwiQGVsc2VcIiwgXCJAZWFjaFwiLCBcIkBsZXRcIiwgXCJAa2V5XCIsIFwiQHJlZlwiXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgIW5hbWUuc3RhcnRzV2l0aChcIkBvbjpcIikgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAOlwiKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBzaG9ydGhhbmRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgcmVhbE5hbWUgPSAoYXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGUpLm5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBpZiAocmVhbE5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmV4ZWN1dGUoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZkF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkByZWZcIl0pO1xuICAgICAgaWYgKHJlZkF0dHIgJiYgIWlzVm9pZCkge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHJlZkF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KHByb3BOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB0aHJvdyBlLndpdGhUYWcobm9kZS5uYW1lKTtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5SVU5USU1FX0VSUk9SLCB7IG1lc3NhZ2U6IGUubWVzc2FnZSB8fCBgJHtlfWAgfSwgbm9kZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEFyZ3MoYXJnczogS05vZGUuQXR0cmlidXRlW10pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZy5uYW1lLnNwbGl0KFwiOlwiKVsxXTtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBrZXkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwib25cIikpIHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IGFyZy52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IGlzQ2FsbEV4cHIgPSAvXltcXHckLl1bXFx3JC5dKlxccypcXCguKlxcKVxccyokLy50ZXN0KHRyaW1tZWQpICYmICF0cmltbWVkLmluY2x1ZGVzKFwiPT5cIik7XG4gICAgICAgIGlmIChpc0NhbGxFeHByKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFtLYXNwZXJdIEA6JHtrZXl9PVwiJHthcmcudmFsdWV9XCIg4oCUIHRoZSBleHByZXNzaW9uIGlzIGNhbGxlZCBkdXJpbmcgcmVuZGVyIGFuZCBpdHMgcmV0dXJuIHZhbHVlIGlzIHBhc3NlZCBhcyB0aGUgcHJvcC4gYCArXG4gICAgICAgICAgICBgSWYgaXQgcmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0IGZ1bmN0aW9uIGJlY29tZXMgdGhlIGhhbmRsZXIgKGZhY3RvcnkgcGF0dGVybikuIGAgK1xuICAgICAgICAgICAgYElmIGl0IHJldHVybnMgdW5kZWZpbmVkLCB0aGUgcHJvcCByZWNlaXZlcyB1bmRlZmluZWQuIGAgK1xuICAgICAgICAgICAgYElmIHRoZSBmdW5jdGlvbiBoYXMgcmVhY3RpdmUgc2lkZSBlZmZlY3RzLCBlbnN1cmUgaXQgZG9lcyBub3QgYm90aCByZWFkIGFuZCB3cml0ZSB0aGUgc2FtZSBzaWduYWwuYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5leGVjdXRlKGFyZy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudDogTm9kZSwgYXR0cjogS05vZGUuQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgW2V2ZW50TmFtZSwgLi4ubW9kaWZpZXJzXSA9IGF0dHIubmFtZS5zcGxpdChcIjpcIilbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IGxpc3RlbmVyU2NvcGUgPSBuZXcgU2NvcGUodGhpcy5pbnRlcnByZXRlci5zY29wZSk7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHt9O1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbCA9IGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkgb3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkgb3B0aW9ucy5wYXNzaXZlID0gdHJ1ZTtcbiAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSkgb3B0aW9ucy5jYXB0dXJlID0gdHJ1ZTtcblxuICAgIC8vIEFueXRoaW5nIG5vdCBpbiB0aGlzIGxpc3QgaXMgdHJlYXRlZCBhcyBhIHBvdGVudGlhbCBrZXkgbW9kaWZpZXJcbiAgICBjb25zdCBjb250cm9sTW9kaWZpZXJzID0gW1wicHJldmVudFwiLCBcInN0b3BcIiwgXCJvbmNlXCIsIFwicGFzc2l2ZVwiLCBcImNhcHR1cmVcIiwgXCJjdHJsXCIsIFwic2hpZnRcIiwgXCJhbHRcIiwgXCJtZXRhXCJdO1xuICAgIGNvbnN0IHBvdGVudGlhbEtleU1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKG0pID0+ICFjb250cm9sTW9kaWZpZXJzLmluY2x1ZGVzKG0udG9Mb3dlckNhc2UoKSkpO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgZXZlbnROYW1lLFxuICAgICAgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHBvdGVudGlhbEtleU1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlZCA9IHBvdGVudGlhbEtleU1vZGlmaWVycy5zb21lKChtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb3dlck0gPSBtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoS0VZX01BUFtsb3dlck1dICYmIEtFWV9NQVBbbG93ZXJNXS5pbmNsdWRlcyhldmVudC5rZXkpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb3dlck0gPT09IGV2ZW50LmtleT8udG9Mb3dlckNhc2UoKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImN0cmxcIikgJiYgIWV2ZW50LmN0cmxLZXkpIHJldHVybjtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInNoaWZ0XCIpICYmICFldmVudC5zaGlmdEtleSkgcmV0dXJuO1xuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiYWx0XCIpICYmICFldmVudC5hbHRLZXkpIHJldHVybjtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm1ldGFcIikgJiYgIWV2ZW50Lm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsaXN0ZW5lclNjb3BlLnNldChcIiRldmVudFwiLCBldmVudCk7XG4gICAgICAgIHRoaXMuZXhlY3V0ZShhdHRyLnZhbHVlLCBsaXN0ZW5lclNjb3BlKTtcbiAgICAgIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xce1xcey4rXFx9XFx9L21zO1xuICAgIGlmIChyZWdleC50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZywgKG0sIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG5cbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJlc3VsdCArPSBgJHt0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKGV4cHJlc3Npb24pfWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lOb2RlKG5vZGU6IGFueSk6IHZvaWQge1xuICAgIC8vIDEuIENsZWFudXAgY29tcG9uZW50IGluc3RhbmNlXG4gICAgaWYgKG5vZGUuJGthc3Blckluc3RhbmNlKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5vZGUuJGthc3Blckluc3RhbmNlO1xuICAgICAgaWYgKGluc3RhbmNlLm9uRGVzdHJveSkge1xuICAgICAgICBpbnN0YW5jZS5vbkRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyKSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgfVxuXG4gICAgLy8gMi4gQ2xlYW51cCBlZmZlY3RzIGF0dGFjaGVkIHRvIHRoZSBub2RlXG4gICAgaWYgKG5vZGUuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogKCkgPT4gdm9pZCkgPT4gc3RvcCgpKTtcbiAgICAgIG5vZGUuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyAzLiBDbGVhbnVwIGVmZmVjdHMgb24gYXR0cmlidXRlc1xuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChhdHRyLiRrYXNwZXJFZmZlY3RzKSB7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgICAgIGF0dHIuJGthc3BlckVmZmVjdHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDQuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkOiBhbnkpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KGNvbnRhaW5lcjogRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKGNoaWxkKSk7XG4gIH1cblxuICBwdWJsaWMgbW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveShjb250YWluZXIpO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSAoQ29tcG9uZW50Q2xhc3MgYXMgYW55KS50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKSByZXR1cm47XG5cbiAgICBjb25zdCBub2RlcyA9IHRoaXMudGVtcGxhdGVQYXJzZXIucGFyc2UodGVtcGxhdGUpO1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChob3N0KTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRDbGFzcyh7IGFyZ3M6IHsgcGFyYW1zOiBwYXJhbXMgfSwgcmVmOiBob3N0LCB0cmFuc3BpbGVyOiB0aGlzIH0pO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAoaG9zdCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgIGNvbnN0IGNvbXBvbmVudE5vZGVzID0gbm9kZXM7XG4gICAgY29tcG9uZW50LiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGVzdHJveShob3N0KTtcbiAgICAgICAgaG9zdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcblxuICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3MoY29tcG9uZW50Tm9kZXMsIGhvc3QpO1xuICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUobnVsbCwgY29tcG9uZW50KTtcbiAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICBjb25zdCBwcmV2ID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG5cbiAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhub2RlcywgaG9zdCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldjtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uTW91bnQoKTtcbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBleHRyYWN0Um91dGVzKGNoaWxkcmVuOiBLTm9kZS5LTm9kZVtdLCBwYXJlbnRHdWFyZD86ICgpID0+IFByb21pc2U8Ym9vbGVhbj4sIHNjb3BlPzogU2NvcGUpOiBSb3V0ZUNvbmZpZ1tdIHtcbiAgICBjb25zdCByb3V0ZXM6IFJvdXRlQ29uZmlnW10gPSBbXTtcbiAgICBjb25zdCBwcmV2U2NvcGUgPSBzY29wZSA/IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgOiB1bmRlZmluZWQ7XG4gICAgaWYgKHNjb3BlKSB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLnR5cGUgIT09IFwiZWxlbWVudFwiKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGVsID0gY2hpbGQgYXMgS05vZGUuRWxlbWVudDtcbiAgICAgIGlmIChlbC5uYW1lID09PSBcInJvdXRlXCIpIHtcbiAgICAgICAgY29uc3QgcGF0aEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAcGF0aFwiXSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEF0dHIgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAY29tcG9uZW50XCJdKTtcbiAgICAgICAgY29uc3QgZ3VhcmRBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGd1YXJkXCJdKTtcblxuICAgICAgICBpZiAoIXBhdGhBdHRyIHx8ICFjb21wb25lbnRBdHRyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1JU1NJTkdfUkVRVUlSRURfQVRUUiwgeyBtZXNzYWdlOiBcIjxyb3V0ZT4gcmVxdWlyZXMgQHBhdGggYW5kIEBjb21wb25lbnQgYXR0cmlidXRlcy5cIiB9LCBlbC5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhdGggPSBwYXRoQXR0ciEudmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuZXhlY3V0ZShjb21wb25lbnRBdHRyIS52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGd1YXJkID0gZ3VhcmRBdHRyID8gdGhpcy5leGVjdXRlKGd1YXJkQXR0ci52YWx1ZSkgOiBwYXJlbnRHdWFyZDtcbiAgICAgICAgcm91dGVzLnB1c2goeyBwYXRoOiBwYXRoLCBjb21wb25lbnQ6IGNvbXBvbmVudCwgZ3VhcmQ6IGd1YXJkIH0pO1xuICAgICAgfSBlbHNlIGlmIChlbC5uYW1lID09PSBcImd1YXJkXCIpIHtcbiAgICAgICAgY29uc3QgY2hlY2tBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGNoZWNrXCJdKTtcbiAgICAgICAgaWYgKCFjaGVja0F0dHIpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTU0lOR19SRVFVSVJFRF9BVFRSLCB7IG1lc3NhZ2U6IFwiPGd1YXJkPiByZXF1aXJlcyBAY2hlY2sgYXR0cmlidXRlLlwiIH0sIGVsLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjaGVja0F0dHIpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBjaGVjayA9IHRoaXMuZXhlY3V0ZShjaGVja0F0dHIudmFsdWUpO1xuICAgICAgICByb3V0ZXMucHVzaCguLi50aGlzLmV4dHJhY3RSb3V0ZXMoZWwuY2hpbGRyZW4sIGNoZWNrKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUmVuZGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmVuZGVyaW5nKSByZXR1cm47XG4gICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcbiAgICBpZiAoaW5zdGFuY2UgJiYgdHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RG9jdHlwZUtOb2RlKF9ub2RlOiBLTm9kZS5Eb2N0eXBlKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICAgIC8vIHJldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudFR5cGUoXCJodG1sXCIsIFwiXCIsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnksIHRhZ05hbWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgZmluYWxBcmdzID0gYXJncztcbiAgICBpZiAodHlwZW9mIGFyZ3MgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IGFyZ3MuaW5jbHVkZXMoXCJSdW50aW1lIEVycm9yXCIpXG4gICAgICAgID8gYXJncy5yZXBsYWNlKFwiUnVudGltZSBFcnJvcjogXCIsIFwiXCIpXG4gICAgICAgIDogYXJncztcbiAgICAgIGZpbmFsQXJncyA9IHsgbWVzc2FnZTogY2xlYW5NZXNzYWdlIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGZpbmFsQXJncywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRhZ05hbWUpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudENsYXNzLCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5KFxuICBpbXBvcnRlcjogKCkgPT4gUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCBDb21wb25lbnRDbGFzcz4+XG4pOiB7IGNvbXBvbmVudDogKCkgPT4gUHJvbWlzZTxDb21wb25lbnRDbGFzcz47IGxhenk6IHRydWUgfSB7XG4gIHJldHVybiB7XG4gICAgbGF6eTogdHJ1ZSxcbiAgICBjb21wb25lbnQ6ICgpID0+IGltcG9ydGVyKCkudGhlbigobSkgPT4gT2JqZWN0LnZhbHVlcyhtKVswXSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnQsXG4gIHJlZ2lzdHJ5PzogQ29tcG9uZW50UmVnaXN0cnlcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IHx8IHt9IH0pO1xuICBjb25zdCByZXN1bHQgPSB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgZW50aXR5IHx8IHt9LCBjb250YWluZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEthc3BlckNvbmZpZyB7XG4gIHJvb3Q/OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcbiAgZW50cnk/OiBzdHJpbmc7XG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeTtcbiAgbW9kZT86IFwiZGV2ZWxvcG1lbnRcIiB8IFwicHJvZHVjdGlvblwiO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQodHJhbnNwaWxlcjogVHJhbnNwaWxlciwgdGFnOiBzdHJpbmcpIHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgY29uc3QgY29tcG9uZW50ID0gbmV3ICh0cmFuc3BpbGVyLnJlZ2lzdHJ5W3RhZ10uY29tcG9uZW50IGFzIENvbXBvbmVudENsYXNzKSh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiB0cmFuc3BpbGVyLnJlc29sdmVOb2Rlcyh0YWcpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbmZpZzogS2FzcGVyQ29uZmlnKSB7XG4gIGNvbnN0IHJvb3QgPVxuICAgIHR5cGVvZiBjb25maWcucm9vdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy5yb290KVxuICAgICAgOiBjb25maWcucm9vdDtcblxuICBpZiAoIXJvb3QpIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLlJPT1RfRUxFTUVOVF9OT1RfRk9VTkQsXG4gICAgICB7IHJvb3Q6IGNvbmZpZy5yb290IH1cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZW50cnlUYWcgPSBjb25maWcuZW50cnkgfHwgXCJrYXNwZXItYXBwXCI7XG4gIGlmICghY29uZmlnLnJlZ2lzdHJ5W2VudHJ5VGFnXSkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihcbiAgICAgIEtFcnJvckNvZGUuRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORCxcbiAgICAgIHsgdGFnOiBlbnRyeVRhZyB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IHRyYW5zcGlsZXIgPSBuZXcgVHJhbnNwaWxlcih7IHJlZ2lzdHJ5OiBjb25maWcucmVnaXN0cnkgfSk7XG5cbiAgaWYgKGNvbmZpZy5tb2RlKSB7XG4gICAgdHJhbnNwaWxlci5tb2RlID0gY29uZmlnLm1vZGU7XG4gIH1cblxuICBjb25zdCB7IG5vZGUsIGluc3RhbmNlLCBub2RlcyB9ID0gY3JlYXRlQ29tcG9uZW50KHRyYW5zcGlsZXIsIGVudHJ5VGFnKTtcblxuICByb290LmlubmVySFRNTCA9IFwiXCI7XG4gIHJvb3QuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5vbk1vdW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vbk1vdW50KCk7XG4gIH1cblxuICB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgaW5zdGFuY2UsIG5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGluc3RhbmNlLm9uUmVuZGVyKCk7XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG4iXSwibmFtZXMiOlsicmF3RWZmZWN0IiwicmF3Q29tcHV0ZWQiLCJTZXQiLCJUb2tlblR5cGUiLCJFeHByLkVhY2giLCJFeHByLlZhcmlhYmxlIiwiRXhwci5CaW5hcnkiLCJFeHByLkFzc2lnbiIsIkV4cHIuR2V0IiwiRXhwci5TZXQiLCJFeHByLlBpcGVsaW5lIiwiRXhwci5UZXJuYXJ5IiwiRXhwci5OdWxsQ29hbGVzY2luZyIsIkV4cHIuTG9naWNhbCIsIkV4cHIuVHlwZW9mIiwiRXhwci5VbmFyeSIsIkV4cHIuQ2FsbCIsIkV4cHIuTmV3IiwiRXhwci5Qb3N0Zml4IiwiRXhwci5TcHJlYWQiLCJFeHByLktleSIsIkV4cHIuTGl0ZXJhbCIsIkV4cHIuVGVtcGxhdGUiLCJFeHByLkFycm93RnVuY3Rpb24iLCJFeHByLkdyb3VwaW5nIiwiRXhwci5Wb2lkIiwiRXhwci5EZWJ1ZyIsIkV4cHIuRGljdGlvbmFyeSIsIkV4cHIuTGlzdCIsIlV0aWxzLmlzRGlnaXQiLCJVdGlscy5pc0FscGhhTnVtZXJpYyIsIlV0aWxzLmNhcGl0YWxpemUiLCJVdGlscy5pc0tleXdvcmQiLCJVdGlscy5pc0FscGhhIiwiUGFyc2VyIiwiTm9kZS5Eb2N0eXBlIiwiTm9kZS5FbGVtZW50IiwiTm9kZS5BdHRyaWJ1dGUiLCJOb2RlLlRleHQiLCJDb21wb25lbnRDbGFzcyIsInNjb3BlIiwicGFyZW50IiwicHJldiJdLCJtYXBwaW5ncyI6IkFBQU8sTUFBTSxhQUFhO0FBQUE7QUFBQSxFQUV4Qix3QkFBd0I7QUFBQSxFQUN4QiwyQkFBMkI7QUFBQTtBQUFBLEVBRzNCLHNCQUFzQjtBQUFBLEVBQ3RCLHFCQUFxQjtBQUFBLEVBQ3JCLHNCQUFzQjtBQUFBO0FBQUEsRUFHdEIsZ0JBQWdCO0FBQUEsRUFDaEIsd0JBQXdCO0FBQUEsRUFDeEIsbUJBQW1CO0FBQUEsRUFDbkIsMEJBQTBCO0FBQUEsRUFDMUIsc0JBQXNCO0FBQUEsRUFDdEIsc0JBQXNCO0FBQUEsRUFDdEIsdUJBQXVCO0FBQUEsRUFDdkIsY0FBYztBQUFBLEVBQ2QsZ0NBQWdDO0FBQUE7QUFBQSxFQUdoQyxrQkFBa0I7QUFBQSxFQUNsQixnQkFBZ0I7QUFBQSxFQUNoQixxQkFBcUI7QUFBQSxFQUNyQix3QkFBd0I7QUFBQTtBQUFBLEVBR3hCLHdCQUF3QjtBQUFBLEVBQ3hCLHlCQUF5QjtBQUFBLEVBQ3pCLHVCQUF1QjtBQUFBLEVBQ3ZCLHdCQUF3QjtBQUFBLEVBQ3hCLGdCQUFnQjtBQUFBLEVBQ2hCLGFBQWE7QUFBQTtBQUFBLEVBR2IsbUJBQW1CO0FBQUE7QUFBQSxFQUduQixlQUFlO0FBQUEsRUFDZix1QkFBdUI7QUFDekI7QUFJTyxNQUFNLGlCQUF3RDtBQUFBLEVBQ25FLFVBQVUsQ0FBQyxNQUFNLDJCQUEyQixFQUFFLElBQUk7QUFBQSxFQUNsRCxVQUFVLENBQUMsTUFBTSxvQkFBb0IsRUFBRSxHQUFHO0FBQUEsRUFFMUMsVUFBVSxNQUFNO0FB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QUEsT0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsS0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxjQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGdCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsaUJBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxhQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsa0JBQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElB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
