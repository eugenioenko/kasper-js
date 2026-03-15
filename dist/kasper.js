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
  "K003-9": () => "Multiple structural directives (@if, @each, @while) on the same element are not allowed. Nest them or use <void> instead.",
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
        const $while = this.findAttr(el, ["@while"]);
        if (this.mode === "development") {
          const structuralCount = [ifAttr, elseifAttr, elseAttr, $each, $while].filter((a) => a).length;
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
        if ($while) {
          this.doWhile($while, el, parent);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMvZXJyb3IudHMiLCIuLi9zcmMvc2lnbmFsLnRzIiwiLi4vc3JjL2NvbXBvbmVudC50cyIsIi4uL3NyYy90eXBlcy9leHByZXNzaW9ucy50cyIsIi4uL3NyYy90eXBlcy90b2tlbi50cyIsIi4uL3NyYy9leHByZXNzaW9uLXBhcnNlci50cyIsIi4uL3NyYy91dGlscy50cyIsIi4uL3NyYy9zY2FubmVyLnRzIiwiLi4vc3JjL3Njb3BlLnRzIiwiLi4vc3JjL2ludGVycHJldGVyLnRzIiwiLi4vc3JjL3R5cGVzL25vZGVzLnRzIiwiLi4vc3JjL3RlbXBsYXRlLXBhcnNlci50cyIsIi4uL3NyYy9yb3V0ZXIudHMiLCIuLi9zcmMvYm91bmRhcnkudHMiLCIuLi9zcmMvc2NoZWR1bGVyLnRzIiwiLi4vc3JjL3RyYW5zcGlsZXIudHMiLCIuLi9zcmMva2FzcGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBLRXJyb3JDb2RlID0ge1xuICAvLyBCb290c3RyYXBcbiAgUk9PVF9FTEVNRU5UX05PVF9GT1VORDogXCJLMDAxLTFcIixcbiAgRU5UUllfQ09NUE9ORU5UX05PVF9GT1VORDogXCJLMDAxLTJcIixcblxuICAvLyBTY2FubmVyXG4gIFVOVEVSTUlOQVRFRF9DT01NRU5UOiBcIkswMDItMVwiLFxuICBVTlRFUk1JTkFURURfU1RSSU5HOiBcIkswMDItMlwiLFxuICBVTkVYUEVDVEVEX0NIQVJBQ1RFUjogXCJLMDAyLTNcIixcblxuICAvLyBUZW1wbGF0ZSBQYXJzZXJcbiAgVU5FWFBFQ1RFRF9FT0Y6IFwiSzAwMy0xXCIsXG4gIFVORVhQRUNURURfQ0xPU0lOR19UQUc6IFwiSzAwMy0yXCIsXG4gIEVYUEVDVEVEX1RBR19OQU1FOiBcIkswMDMtM1wiLFxuICBFWFBFQ1RFRF9DTE9TSU5HX0JSQUNLRVQ6IFwiSzAwMy00XCIsXG4gIEVYUEVDVEVEX0NMT1NJTkdfVEFHOiBcIkswMDMtNVwiLFxuICBCTEFOS19BVFRSSUJVVEVfTkFNRTogXCJLMDAzLTZcIixcbiAgTUlTUExBQ0VEX0NPTkRJVElPTkFMOiBcIkswMDMtN1wiLFxuICBEVVBMSUNBVEVfSUY6IFwiSzAwMy04XCIsXG4gIE1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUzogXCJLMDAzLTlcIixcblxuICAvLyBFeHByZXNzaW9uIFBhcnNlclxuICBVTkVYUEVDVEVEX1RPS0VOOiBcIkswMDQtMVwiLFxuICBJTlZBTElEX0xWQUxVRTogXCJLMDA0LTJcIixcbiAgRVhQRUNURURfRVhQUkVTU0lPTjogXCJLMDA0LTNcIixcbiAgSU5WQUxJRF9ESUNUSU9OQVJZX0tFWTogXCJLMDA0LTRcIixcblxuICAvLyBJbnRlcnByZXRlclxuICBJTlZBTElEX1BPU1RGSVhfTFZBTFVFOiBcIkswMDUtMVwiLFxuICBVTktOT1dOX0JJTkFSWV9PUEVSQVRPUjogXCJLMDA1LTJcIixcbiAgSU5WQUxJRF9QUkVGSVhfUlZBTFVFOiBcIkswMDUtM1wiLFxuICBVTktOT1dOX1VOQVJZX09QRVJBVE9SOiBcIkswMDUtNFwiLFxuICBOT1RfQV9GVU5DVElPTjogXCJLMDA1LTVcIixcbiAgTk9UX0FfQ0xBU1M6IFwiSzAwNS02XCIsXG5cbiAgLy8gU2lnbmFsc1xuICBDSVJDVUxBUl9DT01QVVRFRDogXCJLMDA2LTFcIixcblxuICAvLyBUcmFuc3BpbGVyXG4gIFJVTlRJTUVfRVJST1I6IFwiSzAwNy0xXCIsXG4gIE1JU1NJTkdfUkVRVUlSRURfQVRUUjogXCJLMDA3LTJcIixcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEtFcnJvckNvZGVUeXBlID0gKHR5cGVvZiBLRXJyb3JDb2RlKVtrZXlvZiB0eXBlb2YgS0Vycm9yQ29kZV07XG5cbmV4cG9ydCBjb25zdCBFcnJvclRlbXBsYXRlczogUmVjb3JkPHN0cmluZywgKGFyZ3M6IGFueSkgPT4gc3RyaW5nPiA9IHtcbiAgXCJLMDAxLTFcIjogKGEpID0+IGBSb290IGVsZW1lbnQgbm90IGZvdW5kOiAke2Eucm9vdH1gLFxuICBcIkswMDEtMlwiOiAoYSkgPT4gYEVudHJ5IGNvbXBvbmVudCA8JHthLnRhZ30+IG5vdCBmb3VuZCBpbiByZWdpc3RyeS5gLFxuICBcbiAgXCJLMDAyLTFcIjogKCkgPT4gJ1VudGVybWluYXRlZCBjb21tZW50LCBleHBlY3RpbmcgY2xvc2luZyBcIiovXCInLFxuICBcIkswMDItMlwiOiAoYSkgPT4gYFVudGVybWluYXRlZCBzdHJpbmcsIGV4cGVjdGluZyBjbG9zaW5nICR7YS5xdW90ZX1gLFxuICBcIkswMDItM1wiOiAoYSkgPT4gYFVuZXhwZWN0ZWQgY2hhcmFjdGVyICcke2EuY2hhcn0nYCxcblxuICBcIkswMDMtMVwiOiAoYSkgPT4gYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7YS5lb2ZFcnJvcn1gLFxuICBcIkswMDMtMlwiOiAoKSA9PiBcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIixcbiAgXCJLMDAzLTNcIjogKCkgPT4gXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIsXG4gIFwiSzAwMy00XCI6ICgpID0+IFwiRXhwZWN0ZWQgY2xvc2luZyB0YWcgPlwiLFxuICBcIkswMDMtNVwiOiAoYSkgPT4gYEV4cGVjdGVkIDwvJHthLm5hbWV9PmAsXG4gIFwiSzAwMy02XCI6ICgpID0+IFwiQmxhbmsgYXR0cmlidXRlIG5hbWVcIixcbiAgXCJLMDAzLTdcIjogKGEpID0+IGBAJHthLm5hbWV9IG11c3QgYmUgcHJlY2VkZWQgYnkgYW4gQGlmIG9yIEBlbHNlaWYgYmxvY2suYCxcbiAgXCJLMDAzLThcIjogKCkgPT4gXCJNdWx0aXBsZSBjb25kaXRpb25hbCBkaXJlY3RpdmVzIChAaWYsIEBlbHNlaWYsIEBlbHNlKSBvbiB0aGUgc2FtZSBlbGVtZW50IGFyZSBub3QgYWxsb3dlZC5cIixcbiAgXCJLMDAzLTlcIjogKCkgPT4gXCJNdWx0aXBsZSBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXMgKEBpZiwgQGVhY2gsIEB3aGlsZSkgb24gdGhlIHNhbWUgZWxlbWVudCBhcmUgbm90IGFsbG93ZWQuIE5lc3QgdGhlbSBvciB1c2UgPHZvaWQ+IGluc3RlYWQuXCIsXG5cbiAgXCJLMDA0LTFcIjogKGEpID0+IGAke2EubWVzc2FnZX0sIHVuZXhwZWN0ZWQgdG9rZW4gXCIke2EudG9rZW59XCJgLFxuICBcIkswMDQtMlwiOiAoKSA9PiBcIkludmFsaWQgbC12YWx1ZSwgaXMgbm90IGFuIGFzc2lnbmluZyB0YXJnZXQuXCIsXG4gIFwiSzAwNC0zXCI6IChhKSA9PiBgRXhwZWN0ZWQgZXhwcmVzc2lvbiwgdW5leHBlY3RlZCB0b2tlbiBcIiR7YS50b2tlbn1cImAsXG4gIFwiSzAwNC00XCI6IChhKSA9PiBgU3RyaW5nLCBOdW1iZXIgb3IgSWRlbnRpZmllciBleHBlY3RlZCBhcyBhIEtleSBvZiBEaWN0aW9uYXJ5IHssIHVuZXhwZWN0ZWQgdG9rZW4gJHthLnRva2VufWAsXG5cbiAgXCJLMDA1LTFcIjogKGEpID0+IGBJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIHBvc3RmaXggb3BlcmF0aW9uOiAke2EuZW50aXR5fWAsXG4gIFwiSzAwNS0yXCI6IChhKSA9PiBgVW5rbm93biBiaW5hcnkgb3BlcmF0b3IgJHthLm9wZXJhdG9yfWAsXG4gIFwiSzAwNS0zXCI6IChhKSA9PiBgSW52YWxpZCByaWdodC1oYW5kIHNpZGUgZXhwcmVzc2lvbiBpbiBwcmVmaXggb3BlcmF0aW9uOiAke2EucmlnaHR9YCxcbiAgXCJLMDA1LTRcIjogKGEpID0+IGBVbmtub3duIHVuYXJ5IG9wZXJhdG9yICR7YS5vcGVyYXRvcn1gLFxuICBcIkswMDUtNVwiOiAoYSkgPT4gYCR7YS5jYWxsZWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCxcbiAgXCJLMDA1LTZcIjogKGEpID0+IGAnJHthLmNsYXp6fScgaXMgbm90IGEgY2xhc3MuICduZXcnIHN0YXRlbWVudCBtdXN0IGJlIHVzZWQgd2l0aCBjbGFzc2VzLmAsXG5cbiAgXCJLMDA2LTFcIjogKCkgPT4gXCJDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIGluIGNvbXB1dGVkIHNpZ25hbFwiLFxuXG4gIFwiSzAwNy0xXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG4gIFwiSzAwNy0yXCI6IChhKSA9PiBhLm1lc3NhZ2UsXG59O1xuXG5leHBvcnQgY2xhc3MgS2FzcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb2RlOiBLRXJyb3JDb2RlVHlwZSxcbiAgICBwdWJsaWMgYXJnczogYW55ID0ge30sXG4gICAgcHVibGljIGxpbmU/OiBudW1iZXIsXG4gICAgcHVibGljIGNvbD86IG51bWJlcixcbiAgICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZ1xuICApIHtcbiAgICAvLyBEZXRlY3QgZW52aXJvbm1lbnRcbiAgICBjb25zdCBpc0RldiA9XG4gICAgICB0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIlxuICAgICAgICA6IChpbXBvcnQubWV0YSBhcyBhbnkpLmVudj8uTU9ERSAhPT0gXCJwcm9kdWN0aW9uXCI7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IEVycm9yVGVtcGxhdGVzW2NvZGVdO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSBcbiAgICAgID8gdGVtcGxhdGUoYXJncykgXG4gICAgICA6ICh0eXBlb2YgYXJncyA9PT0gJ3N0cmluZycgPyBhcmdzIDogXCJVbmtub3duIGVycm9yXCIpO1xuICAgIFxuICAgIGNvbnN0IGxvY2F0aW9uID0gbGluZSAhPT0gdW5kZWZpbmVkID8gYCAoJHtsaW5lfToke2NvbH0pYCA6IFwiXCI7XG4gICAgY29uc3QgdGFnSW5mbyA9IHRhZ05hbWUgPyBgXFxuICBhdCA8JHt0YWdOYW1lfT5gIDogXCJcIjtcbiAgICBjb25zdCBsaW5rID0gaXNEZXZcbiAgICAgID8gYFxcblxcblNlZTogaHR0cHM6Ly9rYXNwZXJqcy50b3AvcmVmZXJlbmNlL2Vycm9ycyMke2NvZGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFwiLlwiLCBcIlwiKX1gXG4gICAgICA6IFwiXCI7XG5cbiAgICBzdXBlcihgWyR7Y29kZX1dICR7bWVzc2FnZX0ke2xvY2F0aW9ufSR7dGFnSW5mb30ke2xpbmt9YCk7XG4gICAgdGhpcy5uYW1lID0gXCJLYXNwZXJFcnJvclwiO1xuICB9XG59XG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbnR5cGUgTGlzdGVuZXIgPSAoKSA9PiB2b2lkO1xuXG5sZXQgYWN0aXZlRWZmZWN0OiB7IGZuOiBMaXN0ZW5lcjsgZGVwczogU2V0PGFueT4gfSB8IG51bGwgPSBudWxsO1xuY29uc3QgZWZmZWN0U3RhY2s6IGFueVtdID0gW107XG5cbmxldCBiYXRjaGluZyA9IGZhbHNlO1xuY29uc3QgcGVuZGluZ1N1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbmNvbnN0IHBlbmRpbmdXYXRjaGVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxudHlwZSBXYXRjaGVyPFQ+ID0gKG5ld1ZhbHVlOiBULCBvbGRWYWx1ZTogVCkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBTaWduYWxPcHRpb25zIHtcbiAgc2lnbmFsPzogQWJvcnRTaWduYWw7XG59XG5cbmV4cG9ydCBjbGFzcyBTaWduYWw8VD4ge1xuICBwcm90ZWN0ZWQgX3ZhbHVlOiBUO1xuICBwcml2YXRlIHN1YnNjcmliZXJzID0gbmV3IFNldDxMaXN0ZW5lcj4oKTtcbiAgcHJpdmF0ZSB3YXRjaGVycyA9IG5ldyBTZXQ8V2F0Y2hlcjxUPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWU6IFQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICBpZiAoYWN0aXZlRWZmZWN0KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzLmFkZChhY3RpdmVFZmZlY3QuZm4pO1xuICAgICAgYWN0aXZlRWZmZWN0LmRlcHMuYWRkKHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5fdmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIGlmIChiYXRjaGluZykge1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLnN1YnNjcmliZXJzKSBwZW5kaW5nU3Vic2NyaWJlcnMuYWRkKHN1Yik7XG4gICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB0aGlzLndhdGNoZXJzKSBwZW5kaW5nV2F0Y2hlcnMucHVzaCgoKSA9PiB3YXRjaGVyKG5ld1ZhbHVlLCBvbGRWYWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20odGhpcy5zdWJzY3JpYmVycyk7XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHN1YnMpIHtcbiAgICAgICAgICBzdWIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHdhdGNoZXIgb2YgdGhpcy53YXRjaGVycykge1xuICAgICAgICAgIHRyeSB7IHdhdGNoZXIobmV3VmFsdWUsIG9sZFZhbHVlKTsgfSBjYXRjaCAoZSkgeyBjb25zb2xlLmVycm9yKFwiV2F0Y2hlciBlcnJvcjpcIiwgZSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlKGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICAgIGlmIChvcHRpb25zPy5zaWduYWw/LmFib3J0ZWQpIHJldHVybiAoKSA9PiB7fTtcbiAgICB0aGlzLndhdGNoZXJzLmFkZChmbik7XG4gICAgY29uc3Qgc3RvcCA9ICgpID0+IHRoaXMud2F0Y2hlcnMuZGVsZXRlKGZuKTtcbiAgICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgICBvcHRpb25zLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgc3RvcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RvcDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKGZuOiBMaXN0ZW5lcikge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZGVsZXRlKGZuKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUpOyB9XG4gIHBlZWsoKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufVxuXG5jbGFzcyBDb21wdXRlZFNpZ25hbDxUPiBleHRlbmRzIFNpZ25hbDxUPiB7XG4gIHByaXZhdGUgZm46ICgpID0+IFQ7XG4gIHByaXZhdGUgY29tcHV0aW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKSB7XG4gICAgc3VwZXIodW5kZWZpbmVkIGFzIGFueSk7XG4gICAgdGhpcy5mbiA9IGZuO1xuXG4gICAgY29uc3Qgc3RvcCA9IGVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb21wdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEthc3BlckVycm9yKEtFcnJvckNvZGUuQ0lSQ1VMQVJfQ09NUFVURUQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbXB1dGluZyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBFYWdlcmx5IHVwZGF0ZSB0aGUgdmFsdWUgc28gc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkIGltbWVkaWF0ZWx5XG4gICAgICAgIHN1cGVyLnZhbHVlID0gdGhpcy5mbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5jb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zPy5zaWduYWwpIHtcbiAgICAgIG9wdGlvbnMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBzdG9wLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiBzdXBlci52YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShfdjogVCkge1xuICAgIC8vIENvbXB1dGVkIHNpZ25hbHMgYXJlIHJlYWQtb25seSBmcm9tIG91dHNpZGVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWZmZWN0KGZuOiBMaXN0ZW5lciwgb3B0aW9ucz86IFNpZ25hbE9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnM/LnNpZ25hbD8uYWJvcnRlZCkgcmV0dXJuICgpID0+IHt9O1xuICBjb25zdCBlZmZlY3RPYmogPSB7XG4gICAgZm46ICgpID0+IHtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICAgIGVmZmVjdE9iai5kZXBzLmNsZWFyKCk7XG5cbiAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0T2JqKTtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdE9iajtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlZmZlY3RTdGFjay5wb3AoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlcHM6IG5ldyBTZXQ8U2lnbmFsPGFueT4+KClcbiAgfTtcblxuICBlZmZlY3RPYmouZm4oKTtcbiAgY29uc3Qgc3RvcDogYW55ID0gKCkgPT4ge1xuICAgIGVmZmVjdE9iai5kZXBzLmZvckVhY2goc2lnID0+IHNpZy51bnN1YnNjcmliZShlZmZlY3RPYmouZm4pKTtcbiAgICBlZmZlY3RPYmouZGVwcy5jbGVhcigpO1xuICB9O1xuICBzdG9wLnJ1biA9IGVmZmVjdE9iai5mbjtcblxuICBpZiAob3B0aW9ucz8uc2lnbmFsKSB7XG4gICAgb3B0aW9ucy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIHN0b3AsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBzdG9wIGFzICgoKSA9PiB2b2lkKSAmIHsgcnVuOiAoKSA9PiB2b2lkIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWw8VD4oaW5pdGlhbFZhbHVlOiBUKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBTaWduYWwoaW5pdGlhbFZhbHVlKTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsIGFsaWFzIGZvciBTaWduYWwub25DaGFuZ2UoKVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+LCBvcHRpb25zPzogU2lnbmFsT3B0aW9ucyk6ICgpID0+IHZvaWQge1xuICByZXR1cm4gc2lnLm9uQ2hhbmdlKGZuLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIGJhdGNoaW5nID0gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nID0gZmFsc2U7XG4gICAgY29uc3Qgc3VicyA9IEFycmF5LmZyb20ocGVuZGluZ1N1YnNjcmliZXJzKTtcbiAgICBwZW5kaW5nU3Vic2NyaWJlcnMuY2xlYXIoKTtcbiAgICBjb25zdCB3YXRjaGVycyA9IHBlbmRpbmdXYXRjaGVycy5zcGxpY2UoMCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygc3Vicykge1xuICAgICAgc3ViKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgdHJ5IHsgd2F0Y2hlcigpOyB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoXCJXYXRjaGVyIGVycm9yOlwiLCBlKTsgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZWQ8VD4oZm46ICgpID0+IFQsIG9wdGlvbnM/OiBTaWduYWxPcHRpb25zKTogU2lnbmFsPFQ+IHtcbiAgcmV0dXJuIG5ldyBDb21wdXRlZFNpZ25hbChmbiwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBTaWduYWwsIGVmZmVjdCBhcyByYXdFZmZlY3QsIGNvbXB1dGVkIGFzIHJhd0NvbXB1dGVkIH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBUcmFuc3BpbGVyIH0gZnJvbSBcIi4vdHJhbnNwaWxlclwiO1xuaW1wb3J0IHsgS05vZGUgfSBmcm9tIFwiLi90eXBlcy9ub2Rlc1wiO1xuXG50eXBlIFdhdGNoZXI8VD4gPSAobmV3VmFsdWU6IFQsIG9sZFZhbHVlOiBUKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgQ29tcG9uZW50QXJnczxUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XG4gIGFyZ3M6IFRBcmdzO1xuICByZWY/OiBOb2RlO1xuICB0cmFuc3BpbGVyPzogVHJhbnNwaWxlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XG4gIHN0YXRpYyB0ZW1wbGF0ZT86IHN0cmluZztcbiAgYXJnczogVEFyZ3MgPSB7fSBhcyBUQXJncztcbiAgcmVmPzogTm9kZTtcbiAgdHJhbnNwaWxlcj86IFRyYW5zcGlsZXI7XG4gICRhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICRyZW5kZXI/OiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogQ29tcG9uZW50QXJnczxUQXJncz4pIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICB0aGlzLmFyZ3MgPSB7fSBhcyBUQXJncztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHByb3BzLmFyZ3MpIHtcbiAgICAgIHRoaXMuYXJncyA9IHByb3BzLmFyZ3M7XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZWYpIHtcbiAgICAgIHRoaXMucmVmID0gcHJvcHMucmVmO1xuICAgIH1cbiAgICBpZiAocHJvcHMudHJhbnNwaWxlcikge1xuICAgICAgdGhpcy50cmFuc3BpbGVyID0gcHJvcHMudHJhbnNwaWxlcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHJlYWN0aXZlIGVmZmVjdCB0aWVkIHRvIHRoZSBjb21wb25lbnQncyBsaWZlY3ljbGUuXG4gICAqIFJ1bnMgaW1tZWRpYXRlbHkgYW5kIHJlLXJ1bnMgd2hlbiBhbnkgc2lnbmFsIGRlcGVuZGVuY3kgY2hhbmdlcy5cbiAgICovXG4gIGVmZmVjdChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHJhd0VmZmVjdChmbiwgeyBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2hlcyBhIHNwZWNpZmljIHNpZ25hbCBmb3IgY2hhbmdlcy5cbiAgICogRG9lcyBOT1QgcnVuIGltbWVkaWF0ZWx5LlxuICAgKi9cbiAgd2F0Y2g8VD4oc2lnOiBTaWduYWw8VD4sIGZuOiBXYXRjaGVyPFQ+KTogdm9pZCB7XG4gICAgc2lnLm9uQ2hhbmdlKGZuLCB7IHNpZ25hbDogdGhpcy4kYWJvcnRDb250cm9sbGVyLnNpZ25hbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY29tcHV0ZWQgc2lnbmFsIHRpZWQgdG8gdGhlIGNvbXBvbmVudCdzIGxpZmVjeWNsZS5cbiAgICogVGhlIGludGVybmFsIGVmZmVjdCBpcyBhdXRvbWF0aWNhbGx5IGNsZWFuZWQgdXAgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC5cbiAgICovXG4gIGNvbXB1dGVkPFQ+KGZuOiAoKSA9PiBUKTogU2lnbmFsPFQ+IHtcbiAgICByZXR1cm4gcmF3Q29tcHV0ZWQoZm4sIHsgc2lnbmFsOiB0aGlzLiRhYm9ydENvbnRyb2xsZXIuc2lnbmFsIH0pO1xuICB9XG5cbiAgb25Nb3VudCgpIHsgfVxuICBvblJlbmRlcigpIHsgfVxuICBvbkNoYW5nZXMoKSB7IH1cbiAgb25EZXN0cm95KCkgeyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuJHJlbmRlcj8uKCk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgS2FzcGVyRW50aXR5ID0gQ29tcG9uZW50IHwgUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIENvbXBvbmVudENsYXNzID0geyBuZXcoYXJncz86IENvbXBvbmVudEFyZ3M8YW55Pik6IENvbXBvbmVudCB9O1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRSZWdpc3RyeSB7XG4gIFt0YWdOYW1lOiBzdHJpbmddOiB7XG4gICAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gICAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgICB0ZW1wbGF0ZT86IEVsZW1lbnQgfCBzdHJpbmcgfCBudWxsO1xuICAgIG5vZGVzPzogS05vZGVbXTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tICd0b2tlbic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHByIHtcbiAgcHVibGljIHJlc3VsdDogYW55O1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFI7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGludGVyZmFjZSBFeHByVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBBcnJvd0Z1bmN0aW9uKTogUjtcbiAgICB2aXNpdEFzc2lnbkV4cHIoZXhwcjogQXNzaWduKTogUjtcbiAgICB2aXNpdEJpbmFyeUV4cHIoZXhwcjogQmluYXJ5KTogUjtcbiAgICB2aXNpdENhbGxFeHByKGV4cHI6IENhbGwpOiBSO1xuICAgIHZpc2l0RGVidWdFeHByKGV4cHI6IERlYnVnKTogUjtcbiAgICB2aXNpdERpY3Rpb25hcnlFeHByKGV4cHI6IERpY3Rpb25hcnkpOiBSO1xuICAgIHZpc2l0RWFjaEV4cHIoZXhwcjogRWFjaCk6IFI7XG4gICAgdmlzaXRHZXRFeHByKGV4cHI6IEdldCk6IFI7XG4gICAgdmlzaXRHcm91cGluZ0V4cHIoZXhwcjogR3JvdXBpbmcpOiBSO1xuICAgIHZpc2l0S2V5RXhwcihleHByOiBLZXkpOiBSO1xuICAgIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogTG9naWNhbCk6IFI7XG4gICAgdmlzaXRMaXN0RXhwcihleHByOiBMaXN0KTogUjtcbiAgICB2aXNpdExpdGVyYWxFeHByKGV4cHI6IExpdGVyYWwpOiBSO1xuICAgIHZpc2l0TmV3RXhwcihleHByOiBOZXcpOiBSO1xuICAgIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IE51bGxDb2FsZXNjaW5nKTogUjtcbiAgICB2aXNpdFBvc3RmaXhFeHByKGV4cHI6IFBvc3RmaXgpOiBSO1xuICAgIHZpc2l0U2V0RXhwcihleHByOiBTZXQpOiBSO1xuICAgIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IFBpcGVsaW5lKTogUjtcbiAgICB2aXNpdFNwcmVhZEV4cHIoZXhwcjogU3ByZWFkKTogUjtcbiAgICB2aXNpdFRlbXBsYXRlRXhwcihleHByOiBUZW1wbGF0ZSk6IFI7XG4gICAgdmlzaXRUZXJuYXJ5RXhwcihleHByOiBUZXJuYXJ5KTogUjtcbiAgICB2aXNpdFR5cGVvZkV4cHIoZXhwcjogVHlwZW9mKTogUjtcbiAgICB2aXNpdFVuYXJ5RXhwcihleHByOiBVbmFyeSk6IFI7XG4gICAgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogVmFyaWFibGUpOiBSO1xuICAgIHZpc2l0Vm9pZEV4cHIoZXhwcjogVm9pZCk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJvd0Z1bmN0aW9uIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIHBhcmFtczogVG9rZW5bXTtcbiAgICBwdWJsaWMgYm9keTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogVG9rZW5bXSwgYm9keTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEFycm93RnVuY3Rpb25FeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuQXJyb3dGdW5jdGlvbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzc2lnbiBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUb2tlbiwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXNzaWduRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkFzc2lnbic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJpbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5CaW5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWxsIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGNhbGxlZTogRXhwcjtcbiAgICBwdWJsaWMgcGFyZW46IFRva2VuO1xuICAgIHB1YmxpYyBhcmdzOiBFeHByW107XG4gICAgcHVibGljIG9wdGlvbmFsOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoY2FsbGVlOiBFeHByLCBwYXJlbjogVG9rZW4sIGFyZ3M6IEV4cHJbXSwgbGluZTogbnVtYmVyLCBvcHRpb25hbCA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2FsbGVlID0gY2FsbGVlO1xuICAgICAgICB0aGlzLnBhcmVuID0gcGFyZW47XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBvcHRpb25hbDtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDYWxsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkNhbGwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1ZyBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERlYnVnRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkRlYnVnJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGljdGlvbmFyeSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBFeHByW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdERpY3Rpb25hcnlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuRGljdGlvbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVhY2ggZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbmFtZTogVG9rZW47XG4gICAgcHVibGljIGtleTogVG9rZW47XG4gICAgcHVibGljIGl0ZXJhYmxlOiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGtleTogVG9rZW4sIGl0ZXJhYmxlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuaXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFYWNoRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkVhY2gnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgZW50aXR5OiBFeHByO1xuICAgIHB1YmxpYyBrZXk6IEV4cHI7XG4gICAgcHVibGljIHR5cGU6IFRva2VuVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGVudGl0eTogRXhwciwga2V5OiBFeHByLCB0eXBlOiBUb2tlblR5cGUsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0R2V0RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkdldCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdyb3VwaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGV4cHJlc3Npb246IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRHcm91cGluZ0V4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5Hcm91cGluZyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBuYW1lOiBUb2tlbjtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IFRva2VuLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXlFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuS2V5JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9naWNhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBsZWZ0OiBFeHByO1xuICAgIHB1YmxpYyBvcGVyYXRvcjogVG9rZW47XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgb3BlcmF0b3I6IFRva2VuLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdExvZ2ljYWxFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTG9naWNhbCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5MaXN0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLkxpdGVyYWwnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOZXcgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY2xheno6IEV4cHI7XG4gICAgcHVibGljIGFyZ3M6IEV4cHJbXTtcblxuICAgIGNvbnN0cnVjdG9yKGNsYXp6OiBFeHByLCBhcmdzOiBFeHByW10sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsYXp6ID0gY2xheno7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TmV3RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLk5ldyc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxDb2FsZXNjaW5nIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGxlZnQ6IEV4cHI7XG4gICAgcHVibGljIHJpZ2h0OiBFeHByO1xuXG4gICAgY29uc3RydWN0b3IobGVmdDogRXhwciwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogRXhwclZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TnVsbENvYWxlc2NpbmdFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuTnVsbENvYWxlc2NpbmcnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0Zml4IGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIGVudGl0eTogRXhwcjtcbiAgICBwdWJsaWMgaW5jcmVtZW50OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGluY3JlbWVudDogbnVtYmVyLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50ID0gaW5jcmVtZW50O1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFBvc3RmaXhFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuUG9zdGZpeCc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyBlbnRpdHk6IEV4cHI7XG4gICAgcHVibGljIGtleTogRXhwcjtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbnRpdHk6IEV4cHIsIGtleTogRXhwciwgdmFsdWU6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRTZXRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuU2V0JztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmUgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgbGVmdDogRXhwcjtcbiAgICBwdWJsaWMgcmlnaHQ6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0OiBFeHByLCByaWdodDogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQaXBlbGluZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5QaXBlbGluZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwcmVhZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFNwcmVhZEV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5TcHJlYWQnO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZW1wbGF0ZUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5UZW1wbGF0ZSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBFeHByO1xuICAgIHB1YmxpYyB0aGVuRXhwcjogRXhwcjtcbiAgICBwdWJsaWMgZWxzZUV4cHI6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25kaXRpb246IEV4cHIsIHRoZW5FeHByOiBFeHByLCBlbHNlRXhwcjogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgICB0aGlzLnRoZW5FeHByID0gdGhlbkV4cHI7XG4gICAgICAgIHRoaXMuZWxzZUV4cHIgPSBlbHNlRXhwcjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXJuYXJ5RXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlRlcm5hcnknO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlb2YgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgdmFsdWU6IEV4cHI7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogRXhwciwgbGluZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUeXBlb2ZFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVHlwZW9mJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5hcnkgZXh0ZW5kcyBFeHByIHtcbiAgICBwdWJsaWMgb3BlcmF0b3I6IFRva2VuO1xuICAgIHB1YmxpYyByaWdodDogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBUb2tlbiwgcmlnaHQ6IEV4cHIsIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBFeHByVmlzaXRvcjxSPik6IFIge1xuICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmFyeUV4cHIodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAnRXhwci5VbmFyeSc7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGV4dGVuZHMgRXhwciB7XG4gICAgcHVibGljIG5hbWU6IFRva2VuO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVG9rZW4sIGxpbmU6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlRXhwcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuICdFeHByLlZhcmlhYmxlJztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVm9pZCBleHRlbmRzIEV4cHIge1xuICAgIHB1YmxpYyB2YWx1ZTogRXhwcjtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBFeHByLCBsaW5lOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEV4cHJWaXNpdG9yPFI+KTogUiB7XG4gICAgICByZXR1cm4gdmlzaXRvci52aXNpdFZvaWRFeHByKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ0V4cHIuVm9pZCc7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAvLyBQYXJzZXIgVG9rZW5zXHJcbiAgRW9mLFxyXG4gIFBhbmljLFxyXG5cclxuICAvLyBTaW5nbGUgQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFtcGVyc2FuZCxcclxuICBBdFNpZ24sXHJcbiAgQ2FyZXQsXHJcbiAgQ29tbWEsXHJcbiAgRG9sbGFyLFxyXG4gIERvdCxcclxuICBIYXNoLFxyXG4gIExlZnRCcmFjZSxcclxuICBMZWZ0QnJhY2tldCxcclxuICBMZWZ0UGFyZW4sXHJcbiAgUGVyY2VudCxcclxuICBQaXBlLFxyXG4gIFJpZ2h0QnJhY2UsXHJcbiAgUmlnaHRCcmFja2V0LFxyXG4gIFJpZ2h0UGFyZW4sXHJcbiAgU2VtaWNvbG9uLFxyXG4gIFNsYXNoLFxyXG4gIFN0YXIsXHJcblxyXG4gIC8vIE9uZSBPciBUd28gQ2hhcmFjdGVyIFRva2Vuc1xyXG4gIEFycm93LFxyXG4gIEJhbmcsXHJcbiAgQmFuZ0VxdWFsLFxyXG4gIEJhbmdFcXVhbEVxdWFsLFxyXG4gIENvbG9uLFxyXG4gIEVxdWFsLFxyXG4gIEVxdWFsRXF1YWwsXHJcbiAgRXF1YWxFcXVhbEVxdWFsLFxyXG4gIEdyZWF0ZXIsXHJcbiAgR3JlYXRlckVxdWFsLFxyXG4gIExlc3MsXHJcbiAgTGVzc0VxdWFsLFxyXG4gIE1pbnVzLFxyXG4gIE1pbnVzRXF1YWwsXHJcbiAgTWludXNNaW51cyxcclxuICBQZXJjZW50RXF1YWwsXHJcbiAgUGx1cyxcclxuICBQbHVzRXF1YWwsXHJcbiAgUGx1c1BsdXMsXHJcbiAgUXVlc3Rpb24sXHJcbiAgUXVlc3Rpb25Eb3QsXHJcbiAgUXVlc3Rpb25RdWVzdGlvbixcclxuICBTbGFzaEVxdWFsLFxyXG4gIFN0YXJFcXVhbCxcclxuICBEb3REb3QsXHJcbiAgRG90RG90RG90LFxyXG4gIExlc3NFcXVhbEdyZWF0ZXIsXHJcblxyXG4gIC8vIExpdGVyYWxzXHJcbiAgSWRlbnRpZmllcixcclxuICBUZW1wbGF0ZSxcclxuICBTdHJpbmcsXHJcbiAgTnVtYmVyLFxyXG5cclxuICAvLyBPbmUgT3IgVHdvIENoYXJhY3RlciBUb2tlbnMgKGJpdHdpc2Ugc2hpZnRzKVxyXG4gIExlZnRTaGlmdCxcclxuICBSaWdodFNoaWZ0LFxyXG4gIFBpcGVsaW5lLFxyXG4gIFRpbGRlLFxyXG5cclxuICAvLyBLZXl3b3Jkc1xyXG4gIEFuZCxcclxuICBDb25zdCxcclxuICBEZWJ1ZyxcclxuICBGYWxzZSxcclxuICBJbixcclxuICBJbnN0YW5jZW9mLFxyXG4gIE5ldyxcclxuICBOdWxsLFxyXG4gIFVuZGVmaW5lZCxcclxuICBPZixcclxuICBPcixcclxuICBUcnVlLFxyXG4gIFR5cGVvZixcclxuICBWb2lkLFxyXG4gIFdpdGgsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbiB7XHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuICBwdWJsaWMgdHlwZTogVG9rZW5UeXBlO1xyXG4gIHB1YmxpYyBsaXRlcmFsOiBhbnk7XHJcbiAgcHVibGljIGxleGVtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHR5cGU6IFRva2VuVHlwZSxcclxuICAgIGxleGVtZTogc3RyaW5nLFxyXG4gICAgbGl0ZXJhbDogYW55LFxyXG4gICAgbGluZTogbnVtYmVyLFxyXG4gICAgY29sOiBudW1iZXJcclxuICApIHtcclxuICAgIHRoaXMubmFtZSA9IFRva2VuVHlwZVt0eXBlXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxleGVtZSA9IGxleGVtZTtcclxuICAgIHRoaXMubGl0ZXJhbCA9IGxpdGVyYWw7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gYFsoJHt0aGlzLmxpbmV9KTpcIiR7dGhpcy5sZXhlbWV9XCJdYDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiIsImltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25QYXJzZXIge1xuICBwcml2YXRlIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW107XG5cbiAgcHVibGljIHBhcnNlKHRva2VuczogVG9rZW5bXSk6IEV4cHIuRXhwcltdIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xuICAgICAgZXhwcmVzc2lvbnMucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgfVxuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goLi4udHlwZXM6IFRva2VuVHlwZVtdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayh0eXBlKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBUb2tlbiB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGVlaygpOiBUb2tlbiB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuY3VycmVudF07XG4gIH1cblxuICBwcml2YXRlIHByZXZpb3VzKCk6IFRva2VuIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50IC0gMV07XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlZWsoKS50eXBlID09PSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2soVG9rZW5UeXBlLkVvZik7XG4gIH1cblxuICBwcml2YXRlIGNvbnN1bWUodHlwZTogVG9rZW5UeXBlLCBtZXNzYWdlOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgaWYgKHRoaXMuY2hlY2sodHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvcihcbiAgICAgIEtFcnJvckNvZGUuVU5FWFBFQ1RFRF9UT0tFTixcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgeyBtZXNzYWdlOiBtZXNzYWdlLCB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgdG9rZW46IFRva2VuLCBhcmdzOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHRva2VuLmxpbmUsIHRva2VuLmNvbCk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNocm9uaXplKCk6IHZvaWQge1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKFRva2VuVHlwZS5TZW1pY29sb24pIHx8IHRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0QnJhY2UpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9IHdoaWxlICghdGhpcy5lb2YoKSk7XG4gIH1cblxuICBwdWJsaWMgZm9yZWFjaCh0b2tlbnM6IFRva2VuW10pOiBFeHByLkV4cHIge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgICBjb25zdCBuYW1lID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0ZWQgYW4gaWRlbnRpZmllciBpbnNpZGUgXCJlYWNoXCIgc3RhdGVtZW50YFxuICAgICk7XG5cbiAgICBsZXQga2V5OiBUb2tlbiA9IG51bGw7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLldpdGgpKSB7XG4gICAgICBrZXkgPSB0aGlzLmNvbnN1bWUoXG4gICAgICAgIFRva2VuVHlwZS5JZGVudGlmaWVyLFxuICAgICAgICBgRXhwZWN0ZWQgYSBcImtleVwiIGlkZW50aWZpZXIgYWZ0ZXIgXCJ3aXRoXCIga2V5d29yZCBpbiBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLk9mLFxuICAgICAgYEV4cGVjdGVkIFwib2ZcIiBrZXl3b3JkIGluc2lkZSBmb3JlYWNoIHN0YXRlbWVudGBcbiAgICApO1xuICAgIGNvbnN0IGl0ZXJhYmxlID0gdGhpcy5leHByZXNzaW9uKCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRWFjaChuYW1lLCBrZXksIGl0ZXJhYmxlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHByZXNzaW9uKCk6IEV4cHIuRXhwciB7XG4gICAgY29uc3QgZXhwcmVzc2lvbjogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHtcbiAgICAgIC8vIGNvbnN1bWUgYWxsIHNlbWljb2xvbnNcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgICAgd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlNlbWljb2xvbikpIHsgLyogY29uc3VtZSBzZW1pY29sb25zICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIGFzc2lnbm1lbnQoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnBpcGVsaW5lKCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcbiAgICAgICAgVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuUGx1c0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuTWludXNFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlN0YXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLlNsYXNoRXF1YWxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGxldCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy5hc3NpZ25tZW50KCk7XG4gICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgY29uc3QgbmFtZTogVG9rZW4gPSBleHByLm5hbWU7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLlZhcmlhYmxlKG5hbWUsIG5hbWUubGluZSksXG4gICAgICAgICAgICBvcGVyYXRvcixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgb3BlcmF0b3IubGluZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFeHByLkFzc2lnbihuYW1lLCB2YWx1ZSwgbmFtZS5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwciBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgIGlmIChvcGVyYXRvci50eXBlICE9PSBUb2tlblR5cGUuRXF1YWwpIHtcbiAgICAgICAgICB2YWx1ZSA9IG5ldyBFeHByLkJpbmFyeShcbiAgICAgICAgICAgIG5ldyBFeHByLkdldChleHByLmVudGl0eSwgZXhwci5rZXksIGV4cHIudHlwZSwgZXhwci5saW5lKSxcbiAgICAgICAgICAgIG9wZXJhdG9yLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBvcGVyYXRvci5saW5lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEV4cHIuU2V0KGV4cHIuZW50aXR5LCBleHByLmtleSwgdmFsdWUsIGV4cHIubGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuSU5WQUxJRF9MVkFMVUUsIG9wZXJhdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHBpcGVsaW5lKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLnRlcm5hcnkoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGlwZWxpbmUpKSB7XG4gICAgICBjb25zdCByaWdodCA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLlBpcGVsaW5lKGV4cHIsIHJpZ2h0LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgdGVybmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgdGhlbkV4cHI6IEV4cHIuRXhwciA9IHRoaXMudGVybmFyeSgpO1xuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5Db2xvbiwgYEV4cGVjdGVkIFwiOlwiIGFmdGVyIHRlcm5hcnkgPyBleHByZXNzaW9uYCk7XG4gICAgICBjb25zdCBlbHNlRXhwcjogRXhwci5FeHByID0gdGhpcy50ZXJuYXJ5KCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuVGVybmFyeShleHByLCB0aGVuRXhwciwgZWxzZUV4cHIsIGV4cHIubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBudWxsQ29hbGVzY2luZygpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmxvZ2ljYWxPcigpO1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5RdWVzdGlvblF1ZXN0aW9uKSkge1xuICAgICAgY29uc3QgcmlnaHRFeHByOiBFeHByLkV4cHIgPSB0aGlzLm51bGxDb2FsZXNjaW5nKCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTnVsbENvYWxlc2NpbmcoZXhwciwgcmlnaHRFeHByLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbE9yKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHIgPSB0aGlzLmxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuT3IpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5sb2dpY2FsQW5kKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuTG9naWNhbChleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgbG9naWNhbEFuZCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5BbmQpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5lcXVhbGl0eSgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkxvZ2ljYWwoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGVxdWFsaXR5KCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuc2hpZnQoKTtcbiAgICB3aGlsZSAoXG4gICAgICB0aGlzLm1hdGNoKFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsLFxuICAgICAgICBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5FcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsLFxuICAgICAgICBUb2tlblR5cGUuR3JlYXRlcixcbiAgICAgICAgVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCxcbiAgICAgICAgVG9rZW5UeXBlLkxlc3MsXG4gICAgICAgIFRva2VuVHlwZS5MZXNzRXF1YWwsXG4gICAgICAgIFRva2VuVHlwZS5JbnN0YW5jZW9mLFxuICAgICAgICBUb2tlblR5cGUuSW4sXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5zaGlmdCgpO1xuICAgICAgZXhwciA9IG5ldyBFeHByLkJpbmFyeShleHByLCBvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgc2hpZnQoKTogRXhwci5FeHByIHtcbiAgICBsZXQgZXhwcjogRXhwci5FeHByID0gdGhpcy5hZGRpdGlvbigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0U2hpZnQsIFRva2VuVHlwZS5SaWdodFNoaWZ0KSkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMuYWRkaXRpb24oKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIGFkZGl0aW9uKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubW9kdWx1cygpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5NaW51cywgVG9rZW5UeXBlLlBsdXMpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy5tb2R1bHVzKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtb2R1bHVzKCk6IEV4cHIuRXhwciB7XG4gICAgbGV0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMubXVsdGlwbGljYXRpb24oKTtcbiAgICB3aGlsZSAodGhpcy5tYXRjaChUb2tlblR5cGUuUGVyY2VudCkpIHtcbiAgICAgIGNvbnN0IG9wZXJhdG9yOiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IHJpZ2h0OiBFeHByLkV4cHIgPSB0aGlzLm11bHRpcGxpY2F0aW9uKCk7XG4gICAgICBleHByID0gbmV3IEV4cHIuQmluYXJ5KGV4cHIsIG9wZXJhdG9yLCByaWdodCwgb3BlcmF0b3IubGluZSk7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSBtdWx0aXBsaWNhdGlvbigpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnR5cGVvZigpO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5TbGFzaCwgVG9rZW5UeXBlLlN0YXIpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCByaWdodDogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIGV4cHIgPSBuZXcgRXhwci5CaW5hcnkoZXhwciwgb3BlcmF0b3IsIHJpZ2h0LCBvcGVyYXRvci5saW5lKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwcml2YXRlIHR5cGVvZigpOiBFeHByLkV4cHIge1xuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UeXBlb2YpKSB7XG4gICAgICBjb25zdCBvcGVyYXRvcjogVG9rZW4gPSB0aGlzLnByZXZpb3VzKCk7XG4gICAgICBjb25zdCB2YWx1ZTogRXhwci5FeHByID0gdGhpcy50eXBlb2YoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UeXBlb2YodmFsdWUsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51bmFyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2goXG4gICAgICAgIFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgVG9rZW5UeXBlLkJhbmcsXG4gICAgICAgIFRva2VuVHlwZS5UaWxkZSxcbiAgICAgICAgVG9rZW5UeXBlLkRvbGxhcixcbiAgICAgICAgVG9rZW5UeXBlLlBsdXNQbHVzLFxuICAgICAgICBUb2tlblR5cGUuTWludXNNaW51c1xuICAgICAgKVxuICAgICkge1xuICAgICAgY29uc3Qgb3BlcmF0b3I6IFRva2VuID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgY29uc3QgcmlnaHQ6IEV4cHIuRXhwciA9IHRoaXMudW5hcnkoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5VbmFyeShvcGVyYXRvciwgcmlnaHQsIG9wZXJhdG9yLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZXdLZXl3b3JkKCk7XG4gIH1cblxuICBwcml2YXRlIG5ld0tleXdvcmQoKTogRXhwci5FeHByIHtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTmV3KSkge1xuICAgICAgY29uc3Qga2V5d29yZCA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdDogRXhwci5FeHByID0gdGhpcy5jYWxsKCk7XG4gICAgICBpZiAoY29uc3RydWN0IGluc3RhbmNlb2YgRXhwci5DYWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXhwci5OZXcoY29uc3RydWN0LmNhbGxlZSwgY29uc3RydWN0LmFyZ3MsIGtleXdvcmQubGluZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTmV3KGNvbnN0cnVjdCwgW10sIGtleXdvcmQubGluZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBvc3RmaXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zdGZpeCgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLmNhbGwoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUGx1c1BsdXMpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuUG9zdGZpeChleHByLCAxLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTWludXNNaW51cykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5Qb3N0Zml4KGV4cHIsIC0xLCBleHByLmxpbmUpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbCgpOiBFeHByLkV4cHIge1xuICAgIGxldCBleHByOiBFeHByLkV4cHIgPSB0aGlzLnByaW1hcnkoKTtcbiAgICBsZXQgY29uc3VtZWQ6IGJvb2xlYW47XG4gICAgZG8ge1xuICAgICAgY29uc3VtZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaENhbGwoZXhwciwgdGhpcy5wcmV2aW91cygpLCBmYWxzZSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRQYXJlbikpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdCwgVG9rZW5UeXBlLlF1ZXN0aW9uRG90KSkge1xuICAgICAgICBjb25zdW1lZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gdGhpcy5wcmV2aW91cygpO1xuICAgICAgICBpZiAob3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLlF1ZXN0aW9uRG90ICYmIHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmJyYWNrZXRHZXQoZXhwciwgb3BlcmF0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCAmJiB0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0UGFyZW4pKSB7XG4gICAgICAgICAgZXhwciA9IHRoaXMuZmluaXNoQ2FsbChleHByLCB0aGlzLnByZXZpb3VzKCksIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmRvdEdldChleHByLCBvcGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5MZWZ0QnJhY2tldCkpIHtcbiAgICAgICAgY29uc3VtZWQgPSB0cnVlO1xuICAgICAgICBleHByID0gdGhpcy5icmFja2V0R2V0KGV4cHIsIHRoaXMucHJldmlvdXMoKSk7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoY29uc3VtZWQpO1xuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2tlbkF0KG9mZnNldDogbnVtYmVyKTogVG9rZW5UeXBlIHtcbiAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5jdXJyZW50ICsgb2Zmc2V0XT8udHlwZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNBcnJvd1BhcmFtcygpOiBib29sZWFuIHtcbiAgICBsZXQgaSA9IHRoaXMuY3VycmVudCArIDE7IC8vIHNraXAgKFxuICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1tpICsgMV0/LnR5cGUgPT09IFRva2VuVHlwZS5BcnJvdztcbiAgICB9XG4gICAgd2hpbGUgKGkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSAhPT0gVG9rZW5UeXBlLklkZW50aWZpZXIpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICAgIGlmICh0aGlzLnRva2Vuc1tpXT8udHlwZSA9PT0gVG9rZW5UeXBlLlJpZ2h0UGFyZW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW2kgKyAxXT8udHlwZSA9PT0gVG9rZW5UeXBlLkFycm93O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudG9rZW5zW2ldPy50eXBlICE9PSBUb2tlblR5cGUuQ29tbWEpIHJldHVybiBmYWxzZTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5pc2hDYWxsKGNhbGxlZTogRXhwci5FeHByLCBwYXJlbjogVG9rZW4sIG9wdGlvbmFsOiBib29sZWFuKTogRXhwci5FeHByIHtcbiAgICBjb25zdCBhcmdzOiBFeHByLkV4cHJbXSA9IFtdO1xuICAgIGlmICghdGhpcy5jaGVjayhUb2tlblR5cGUuUmlnaHRQYXJlbikpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgICBhcmdzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG4gICAgfVxuICAgIGNvbnN0IGNsb3NlUGFyZW4gPSB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBhcmd1bWVudHNgKTtcbiAgICByZXR1cm4gbmV3IEV4cHIuQ2FsbChjYWxsZWUsIGNsb3NlUGFyZW4sIGFyZ3MsIGNsb3NlUGFyZW4ubGluZSwgb3B0aW9uYWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3RHZXQoZXhwcjogRXhwci5FeHByLCBvcGVyYXRvcjogVG9rZW4pOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IG5hbWU6IFRva2VuID0gdGhpcy5jb25zdW1lKFxuICAgICAgVG9rZW5UeXBlLklkZW50aWZpZXIsXG4gICAgICBgRXhwZWN0IHByb3BlcnR5IG5hbWUgYWZ0ZXIgJy4nYFxuICAgICk7XG4gICAgY29uc3Qga2V5OiBFeHByLktleSA9IG5ldyBFeHByLktleShuYW1lLCBuYW1lLmxpbmUpO1xuICAgIHJldHVybiBuZXcgRXhwci5HZXQoZXhwciwga2V5LCBvcGVyYXRvci50eXBlLCBuYW1lLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBicmFja2V0R2V0KGV4cHI6IEV4cHIuRXhwciwgb3BlcmF0b3I6IFRva2VuKTogRXhwci5FeHByIHtcbiAgICBsZXQga2V5OiBFeHByLkV4cHIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmNoZWNrKFRva2VuVHlwZS5SaWdodEJyYWNrZXQpKSB7XG4gICAgICBrZXkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFuIGluZGV4YCk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkdldChleHByLCBrZXksIG9wZXJhdG9yLnR5cGUsIG9wZXJhdG9yLmxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmltYXJ5KCk6IEV4cHIuRXhwciB7XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkZhbHNlKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwoZmFsc2UsIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLlRydWUpKSB7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuTGl0ZXJhbCh0cnVlLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdWxsKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwodW5kZWZpbmVkLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5OdW1iZXIpIHx8IHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZykpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5MaXRlcmFsKHRoaXMucHJldmlvdXMoKS5saXRlcmFsLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5UZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5UZW1wbGF0ZSh0aGlzLnByZXZpb3VzKCkubGl0ZXJhbCwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuSWRlbnRpZmllcikgJiYgdGhpcy50b2tlbkF0KDEpID09PSBUb2tlblR5cGUuQXJyb3cpIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTsgLy8gY29uc3VtZSA9PlxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkFycm93RnVuY3Rpb24oW3BhcmFtXSwgYm9keSwgcGFyYW0ubGluZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1hdGNoKFRva2VuVHlwZS5JZGVudGlmaWVyKSkge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5WYXJpYWJsZShpZGVudGlmaWVyLCBpZGVudGlmaWVyLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGVjayhUb2tlblR5cGUuTGVmdFBhcmVuKSAmJiB0aGlzLmlzQXJyb3dQYXJhbXMoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7IC8vIGNvbnN1bWUgKFxuICAgICAgY29uc3QgcGFyYW1zOiBUb2tlbltdID0gW107XG4gICAgICBpZiAoIXRoaXMuY2hlY2soVG9rZW5UeXBlLlJpZ2h0UGFyZW4pKSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBwYXJhbXMucHVzaCh0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLklkZW50aWZpZXIsIFwiRXhwZWN0ZWQgcGFyYW1ldGVyIG5hbWVcIikpO1xuICAgICAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb25zdW1lKFRva2VuVHlwZS5SaWdodFBhcmVuLCBgRXhwZWN0ZWQgXCIpXCJgKTtcbiAgICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuQXJyb3csIGBFeHBlY3RlZCBcIj0+XCJgKTtcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5BcnJvd0Z1bmN0aW9uKHBhcmFtcywgYm9keSwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuTGVmdFBhcmVuKSkge1xuICAgICAgY29uc3QgZXhwcjogRXhwci5FeHByID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICB0aGlzLmNvbnN1bWUoVG9rZW5UeXBlLlJpZ2h0UGFyZW4sIGBFeHBlY3RlZCBcIilcIiBhZnRlciBleHByZXNzaW9uYCk7XG4gICAgICByZXR1cm4gbmV3IEV4cHIuR3JvdXBpbmcoZXhwciwgZXhwci5saW5lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFjZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkxlZnRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuVm9pZCkpIHtcbiAgICAgIGNvbnN0IGV4cHI6IEV4cHIuRXhwciA9IHRoaXMuZXhwcmVzc2lvbigpO1xuICAgICAgcmV0dXJuIG5ldyBFeHByLlZvaWQoZXhwciwgdGhpcy5wcmV2aW91cygpLmxpbmUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuRGVidWcpKSB7XG4gICAgICBjb25zdCBleHByOiBFeHByLkV4cHIgPSB0aGlzLmV4cHJlc3Npb24oKTtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EZWJ1ZyhleHByLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy5lcnJvcihcbiAgICAgIEtFcnJvckNvZGUuRVhQRUNURURfRVhQUkVTU0lPTixcbiAgICAgIHRoaXMucGVlaygpLFxuICAgICAgeyB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICApO1xuICAgIC8vIHVucmVhY2hlYWJsZSBjb2RlXG4gICAgcmV0dXJuIG5ldyBFeHByLkxpdGVyYWwobnVsbCwgMCk7XG4gIH1cblxuICBwdWJsaWMgZGljdGlvbmFyeSgpOiBFeHByLkV4cHIge1xuICAgIGNvbnN0IGxlZnRCcmFjZSA9IHRoaXMucHJldmlvdXMoKTtcbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFjZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXhwci5EaWN0aW9uYXJ5KFtdLCB0aGlzLnByZXZpb3VzKCkubGluZSk7XG4gICAgfVxuICAgIGNvbnN0IHByb3BlcnRpZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgcHJvcGVydGllcy5wdXNoKG5ldyBFeHByLlNwcmVhZCh0aGlzLmV4cHJlc3Npb24oKSwgdGhpcy5wcmV2aW91cygpLmxpbmUpKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMubWF0Y2goVG9rZW5UeXBlLlN0cmluZywgVG9rZW5UeXBlLklkZW50aWZpZXIsIFRva2VuVHlwZS5OdW1iZXIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qga2V5OiBUb2tlbiA9IHRoaXMucHJldmlvdXMoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbG9uKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leHByZXNzaW9uKCk7XG4gICAgICAgICAgcHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgbmV3IEV4cHIuU2V0KG51bGwsIG5ldyBFeHByLktleShrZXksIGtleS5saW5lKSwgdmFsdWUsIGtleS5saW5lKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBuZXcgRXhwci5WYXJpYWJsZShrZXksIGtleS5saW5lKTtcbiAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goXG4gICAgICAgICAgICBuZXcgRXhwci5TZXQobnVsbCwgbmV3IEV4cHIuS2V5KGtleSwga2V5LmxpbmUpLCB2YWx1ZSwga2V5LmxpbmUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICBLRXJyb3JDb2RlLklOVkFMSURfRElDVElPTkFSWV9LRVksXG4gICAgICAgICAgdGhpcy5wZWVrKCksXG4gICAgICAgICAgeyB0b2tlbjogdGhpcy5wZWVrKCkubGV4ZW1lIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLm1hdGNoKFRva2VuVHlwZS5Db21tYSkpO1xuICAgIHRoaXMuY29uc3VtZShUb2tlblR5cGUuUmlnaHRCcmFjZSwgYEV4cGVjdGVkIFwifVwiIGFmdGVyIG9iamVjdCBsaXRlcmFsYCk7XG5cbiAgICByZXR1cm4gbmV3IEV4cHIuRGljdGlvbmFyeShwcm9wZXJ0aWVzLCBsZWZ0QnJhY2UubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3QoKTogRXhwci5FeHByIHtcbiAgICBjb25zdCB2YWx1ZXM6IEV4cHIuRXhwcltdID0gW107XG4gICAgY29uc3QgbGVmdEJyYWNrZXQgPSB0aGlzLnByZXZpb3VzKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaChUb2tlblR5cGUuUmlnaHRCcmFja2V0KSkge1xuICAgICAgcmV0dXJuIG5ldyBFeHByLkxpc3QoW10sIHRoaXMucHJldmlvdXMoKS5saW5lKTtcbiAgICB9XG4gICAgZG8ge1xuICAgICAgaWYgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkRvdERvdERvdCkpIHtcbiAgICAgICAgdmFsdWVzLnB1c2gobmV3IEV4cHIuU3ByZWFkKHRoaXMuZXhwcmVzc2lvbigpLCB0aGlzLnByZXZpb3VzKCkubGluZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMubWF0Y2goVG9rZW5UeXBlLkNvbW1hKSk7XG5cbiAgICB0aGlzLmNvbnN1bWUoXG4gICAgICBUb2tlblR5cGUuUmlnaHRCcmFja2V0LFxuICAgICAgYEV4cGVjdGVkIFwiXVwiIGFmdGVyIGFycmF5IGRlY2xhcmF0aW9uYFxuICAgICk7XG4gICAgcmV0dXJuIG5ldyBFeHByLkxpc3QodmFsdWVzLCBsZWZ0QnJhY2tldC5saW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpIHx8IGNoYXIgPT09IFwiJFwiIHx8IGNoYXIgPT09IFwiX1wiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cmluZygxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXl3b3JkKHdvcmQ6IGtleW9mIHR5cGVvZiBUb2tlblR5cGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRva2VuVHlwZVt3b3JkXSA+PSBUb2tlblR5cGUuQW5kO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRva2VuLCBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlcy90b2tlblwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFNjYW5uZXIge1xuICAvKiogc2NyaXB0cyBzb3VyY2UgY29kZSAqL1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIC8qKiBjb250YWlucyB0aGUgc291cmNlIGNvZGUgcmVwcmVzZW50ZWQgYXMgbGlzdCBvZiB0b2tlbnMgKi9cbiAgcHVibGljIHRva2VuczogVG9rZW5bXTtcbiAgLyoqIHBvaW50cyB0byB0aGUgY3VycmVudCBjaGFyYWN0ZXIgYmVpbmcgdG9rZW5pemVkICovXG4gIHByaXZhdGUgY3VycmVudDogbnVtYmVyO1xuICAvKiogcG9pbnRzIHRvIHRoZSBzdGFydCBvZiB0aGUgdG9rZW4gICovXG4gIHByaXZhdGUgc3RhcnQ6IG51bWJlcjtcbiAgLyoqIGN1cnJlbnQgbGluZSBvZiBzb3VyY2UgY29kZSBiZWluZyB0b2tlbml6ZWQgKi9cbiAgcHJpdmF0ZSBsaW5lOiBudW1iZXI7XG4gIC8qKiBjdXJyZW50IGNvbHVtbiBvZiB0aGUgY2hhcmFjdGVyIGJlaW5nIHRva2VuaXplZCAqL1xuICBwcml2YXRlIGNvbDogbnVtYmVyO1xuXG4gIHB1YmxpYyBzY2FuKHNvdXJjZTogc3RyaW5nKTogVG9rZW5bXSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMubGluZSA9IDE7XG4gICAgdGhpcy5jb2wgPSAxO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgICAgdGhpcy5nZXRUb2tlbigpO1xuICAgIH1cbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbihUb2tlblR5cGUuRW9mLCBcIlwiLCBudWxsLCB0aGlzLmxpbmUsIDApKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID49IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfVxuXG4gIHByaXZhdGUgYWR2YW5jZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gXCJcXG5cIikge1xuICAgICAgdGhpcy5saW5lKys7XG4gICAgICB0aGlzLmNvbCA9IDA7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHRoaXMuY29sKys7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgLSAxKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW5UeXBlOiBUb2tlblR5cGUsIGxpdGVyYWw6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zdWJzdHJpbmcodGhpcy5zdGFydCwgdGhpcy5jdXJyZW50KTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKG5ldyBUb2tlbih0b2tlblR5cGUsIHRleHQsIGxpdGVyYWwsIHRoaXMubGluZSwgdGhpcy5jb2wpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0Y2goZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQpICE9PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwZWVrKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKCkpIHtcbiAgICAgIHJldHVybiBcIlxcMFwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuY3VycmVudCk7XG4gIH1cblxuICBwcml2YXRlIHBlZWtOZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY3VycmVudCArIDEgPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gXCJcXDBcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrKCkgIT09IFwiXFxuXCIgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbXVsdGlsaW5lQ29tbWVudCgpOiB2b2lkIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkgJiYgISh0aGlzLnBlZWsoKSA9PT0gXCIqXCIgJiYgdGhpcy5wZWVrTmV4dCgpID09PSBcIi9cIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOVEVSTUlOQVRFRF9DT01NRU5UKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGhlIGNsb3Npbmcgc2xhc2ggJyovJ1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0cmluZyhxdW90ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMucGVlaygpICE9PSBxdW90ZSAmJiAhdGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gVW50ZXJtaW5hdGVkIHN0cmluZy5cbiAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVOVEVSTUlOQVRFRF9TVFJJTkcsIHsgcXVvdGU6IHF1b3RlIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBjbG9zaW5nIFwiLlxuICAgIHRoaXMuYWR2YW5jZSgpO1xuXG4gICAgLy8gVHJpbSB0aGUgc3Vycm91bmRpbmcgcXVvdGVzLlxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQgKyAxLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICB0aGlzLmFkZFRva2VuKHF1b3RlICE9PSBcImBcIiA/IFRva2VuVHlwZS5TdHJpbmcgOiBUb2tlblR5cGUuVGVtcGxhdGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbnVtYmVyKCk6IHZvaWQge1xuICAgIC8vIGdldHMgaW50ZWdlciBwYXJ0XG4gICAgd2hpbGUgKFV0aWxzLmlzRGlnaXQodGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVja3MgZm9yIGZyYWN0aW9uXG4gICAgaWYgKHRoaXMucGVlaygpID09PSBcIi5cIiAmJiBVdGlscy5pc0RpZ2l0KHRoaXMucGVla05leHQoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIC8vIGdldHMgZnJhY3Rpb24gcGFydFxuICAgIHdoaWxlIChVdGlscy5pc0RpZ2l0KHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2tzIGZvciBleHBvbmVudFxuICAgIGlmICh0aGlzLnBlZWsoKS50b0xvd2VyQ2FzZSgpID09PSBcImVcIikge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBpZiAodGhpcy5wZWVrKCkgPT09IFwiLVwiIHx8IHRoaXMucGVlaygpID09PSBcIitcIikge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoVXRpbHMuaXNEaWdpdCh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zb3VyY2Uuc3Vic3RyaW5nKHRoaXMuc3RhcnQsIHRoaXMuY3VycmVudCk7XG4gICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTnVtYmVyLCBOdW1iZXIodmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaWRlbnRpZmllcigpOiB2b2lkIHtcbiAgICB3aGlsZSAoVXRpbHMuaXNBbHBoYU51bWVyaWModGhpcy5wZWVrKCkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc291cmNlLnN1YnN0cmluZyh0aGlzLnN0YXJ0LCB0aGlzLmN1cnJlbnQpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkID0gVXRpbHMuY2FwaXRhbGl6ZSh2YWx1ZSkgYXMga2V5b2YgdHlwZW9mIFRva2VuVHlwZTtcbiAgICBpZiAoVXRpbHMuaXNLZXl3b3JkKGNhcGl0YWxpemVkKSkge1xuICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGVbY2FwaXRhbGl6ZWRdLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLklkZW50aWZpZXIsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRva2VuKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBzd2l0Y2ggKGNoYXIpIHtcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkxlZnRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuUmlnaHRQYXJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIltcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNrZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJdXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLlJpZ2h0QnJhY2tldCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIntcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuTGVmdEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwifVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5SaWdodEJyYWNlLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5Db21tYSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjtcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuU2VtaWNvbG9uLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiflwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFRva2VuVHlwZS5UaWxkZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIl5cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihUb2tlblR5cGUuQ2FyZXQsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkhhc2gsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCI6XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuQXJyb3cgOiBUb2tlblR5cGUuQ29sb24sXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuU3RhckVxdWFsIDogVG9rZW5UeXBlLlN0YXIsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuUGVyY2VudEVxdWFsIDogVG9rZW5UeXBlLlBlcmNlbnQsXG4gICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ8XCI6XG4gICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgdGhpcy5tYXRjaChcInxcIikgPyBUb2tlblR5cGUuT3IgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlBpcGVsaW5lIDpcbiAgICAgICAgICBUb2tlblR5cGUuUGlwZSxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIiZcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiJlwiKSA/IFRva2VuVHlwZS5BbmQgOiBUb2tlblR5cGUuQW1wZXJzYW5kLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPlwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLlJpZ2h0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkdyZWF0ZXJFcXVhbCA6IFRva2VuVHlwZS5HcmVhdGVyLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiIVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI9XCIpID8gVG9rZW5UeXBlLkJhbmdFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkJhbmdFcXVhbFxuICAgICAgICAgICAgOiBUb2tlblR5cGUuQmFuZyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIj9cIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiP1wiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25RdWVzdGlvblxuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiLlwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUXVlc3Rpb25Eb3RcbiAgICAgICAgICAgIDogVG9rZW5UeXBlLlF1ZXN0aW9uLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiPVwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcbiAgICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgICAgdGhpcy5tYXRjaChcIj1cIikgPyBUb2tlblR5cGUuRXF1YWxFcXVhbEVxdWFsIDogVG9rZW5UeXBlLkVxdWFsRXF1YWwsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCI+XCIpID8gVG9rZW5UeXBlLkFycm93IDogVG9rZW5UeXBlLkVxdWFsLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiK1wiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCIrXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5QbHVzUGx1c1xuICAgICAgICAgICAgOiB0aGlzLm1hdGNoKFwiPVwiKVxuICAgICAgICAgICAgPyBUb2tlblR5cGUuUGx1c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5QbHVzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLVwiOlxuICAgICAgICB0aGlzLmFkZFRva2VuKFxuICAgICAgICAgIHRoaXMubWF0Y2goXCItXCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c01pbnVzXG4gICAgICAgICAgICA6IHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IFRva2VuVHlwZS5NaW51c0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5NaW51cyxcbiAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjxcIjpcbiAgICAgICAgdGhpcy5hZGRUb2tlbihcbiAgICAgICAgICB0aGlzLm1hdGNoKFwiPFwiKSA/IFRva2VuVHlwZS5MZWZ0U2hpZnQgOlxuICAgICAgICAgIHRoaXMubWF0Y2goXCI9XCIpXG4gICAgICAgICAgICA/IHRoaXMubWF0Y2goXCI+XCIpXG4gICAgICAgICAgICAgID8gVG9rZW5UeXBlLkxlc3NFcXVhbEdyZWF0ZXJcbiAgICAgICAgICAgICAgOiBUb2tlblR5cGUuTGVzc0VxdWFsXG4gICAgICAgICAgICA6IFRva2VuVHlwZS5MZXNzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaChcIi5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdERvdCwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oVG9rZW5UeXBlLkRvdCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiL1wiOlxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIi9cIikpIHtcbiAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiKlwiKSkge1xuICAgICAgICAgIHRoaXMubXVsdGlsaW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWRkVG9rZW4oXG4gICAgICAgICAgICB0aGlzLm1hdGNoKFwiPVwiKSA/IFRva2VuVHlwZS5TbGFzaEVxdWFsIDogVG9rZW5UeXBlLlNsYXNoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGAnYDpcbiAgICAgIGNhc2UgYFwiYDpcbiAgICAgIGNhc2UgXCJgXCI6XG4gICAgICAgIHRoaXMuc3RyaW5nKGNoYXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGlnbm9yZSBjYXNlc1xuICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgIGNhc2UgXCJcXHJcIjpcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjb21wbGV4IGNhc2VzXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdChjaGFyKSkge1xuICAgICAgICAgIHRoaXMubnVtYmVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNBbHBoYShjaGFyKSkge1xuICAgICAgICAgIHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0NIQVJBQ1RFUiwgeyBjaGFyOiBjaGFyIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXJyb3IoY29kZTogS0Vycm9yQ29kZVR5cGUsIGFyZ3M6IGFueSA9IHt9KTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NvcGUge1xuICBwdWJsaWMgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBwdWJsaWMgcGFyZW50OiBTY29wZTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBTY29wZSwgZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50ID8gcGFyZW50IDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IGVudGl0eSA/IGVudGl0eSA6IHt9O1xuICB9XG5cbiAgcHVibGljIGluaXQoZW50aXR5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzID0gZW50aXR5ID8gZW50aXR5IDoge307XG4gIH1cblxuICBwdWJsaWMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWVzW25hbWVdID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsdWVzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlc1trZXldO1xuICAgIH1cblxuICAgIGNvbnN0ICRpbXBvcnRzID0gKHRoaXMudmFsdWVzPy5jb25zdHJ1Y3RvciBhcyBhbnkpPy4kaW1wb3J0cztcbiAgICBpZiAoJGltcG9ydHMgJiYgdHlwZW9mICRpbXBvcnRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiAkaW1wb3J0c1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3dba2V5IGFzIGtleW9mIHR5cGVvZiB3aW5kb3ddO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFeHByIGZyb20gXCIuL3R5cGVzL2V4cHJlc3Npb25zXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciBhcyBQYXJzZXIgfSBmcm9tIFwiLi9leHByZXNzaW9uLXBhcnNlclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcbmltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcnByZXRlciBpbXBsZW1lbnRzIEV4cHIuRXhwclZpc2l0b3I8YW55PiB7XG4gIHB1YmxpYyBzY29wZSA9IG5ldyBTY29wZSgpO1xuICBwcml2YXRlIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICBwcml2YXRlIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICBwdWJsaWMgZXZhbHVhdGUoZXhwcjogRXhwci5FeHByKTogYW55IHtcbiAgICByZXR1cm4gKGV4cHIucmVzdWx0ID0gZXhwci5hY2NlcHQodGhpcykpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UGlwZWxpbmVFeHByKGV4cHI6IEV4cHIuUGlwZWxpbmUpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIucmlnaHQgaW5zdGFuY2VvZiBFeHByLkNhbGwpIHtcbiAgICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodC5jYWxsZWUpO1xuICAgICAgY29uc3QgYXJncyA9IFt2YWx1ZV07XG4gICAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLnJpZ2h0LmFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgICAgYXJncy5wdXNoKC4uLnRoaXMuZXZhbHVhdGUoKGFyZyBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2godGhpcy5ldmFsdWF0ZShhcmcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGV4cHIucmlnaHQuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxlZS5hcHBseShleHByLnJpZ2h0LmNhbGxlZS5lbnRpdHkucmVzdWx0LCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3QgZm4gPSB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICAgIHJldHVybiBmbih2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBcnJvd0Z1bmN0aW9uRXhwcihleHByOiBFeHByLkFycm93RnVuY3Rpb24pOiBhbnkge1xuICAgIGNvbnN0IGNhcHR1cmVkU2NvcGUgPSB0aGlzLnNjb3BlO1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnNjb3BlO1xuICAgICAgdGhpcy5zY29wZSA9IG5ldyBTY29wZShjYXB0dXJlZFNjb3BlKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwci5wYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zY29wZS5zZXQoZXhwci5wYXJhbXNbaV0ubGV4ZW1lLCBhcmdzW2ldKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuYm9keSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnNjb3BlID0gcHJldjtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGVycm9yKGNvZGU6IEtFcnJvckNvZGVUeXBlLCBhcmdzOiBhbnkgPSB7fSwgbGluZT86IG51bWJlciwgY29sPzogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKGNvZGUsIGFyZ3MsIGxpbmUsIGNvbCk7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRWYXJpYWJsZUV4cHIoZXhwcjogRXhwci5WYXJpYWJsZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGUuZ2V0KGV4cHIubmFtZS5sZXhlbWUpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0QXNzaWduRXhwcihleHByOiBFeHByLkFzc2lnbik6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIubmFtZS5sZXhlbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRLZXlFeHByKGV4cHI6IEV4cHIuS2V5KTogYW55IHtcbiAgICByZXR1cm4gZXhwci5uYW1lLmxpdGVyYWw7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRHZXRFeHByKGV4cHI6IEV4cHIuR2V0KTogYW55IHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmV2YWx1YXRlKGV4cHIuZW50aXR5KTtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmV2YWx1YXRlKGV4cHIua2V5KTtcbiAgICBpZiAoIWVudGl0eSAmJiBleHByLnR5cGUgPT09IFRva2VuVHlwZS5RdWVzdGlvbkRvdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eVtrZXldO1xuICB9XG5cbiAgcHVibGljIHZpc2l0U2V0RXhwcihleHByOiBFeHByLlNldCk6IGFueSB7XG4gICAgY29uc3QgZW50aXR5ID0gdGhpcy5ldmFsdWF0ZShleHByLmVudGl0eSk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ldmFsdWF0ZShleHByLmtleSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKGV4cHIudmFsdWUpO1xuICAgIGVudGl0eVtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0UG9zdGZpeEV4cHIoZXhwcjogRXhwci5Qb3N0Zml4KTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5lbnRpdHkpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgKyBleHByLmluY3JlbWVudDtcblxuICAgIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgIHRoaXMuc2NvcGUuc2V0KGV4cHIuZW50aXR5Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChleHByLmVudGl0eSBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICBjb25zdCBhc3NpZ24gPSBuZXcgRXhwci5TZXQoXG4gICAgICAgIGV4cHIuZW50aXR5LmVudGl0eSxcbiAgICAgICAgZXhwci5lbnRpdHkua2V5LFxuICAgICAgICBuZXcgRXhwci5MaXRlcmFsKG5ld1ZhbHVlLCBleHByLmxpbmUpLFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgICB0aGlzLmV2YWx1YXRlKGFzc2lnbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5JTlZBTElEX1BPU1RGSVhfTFZBTFVFLCB7IGVudGl0eTogZXhwci5lbnRpdHkgfSwgZXhwci5saW5lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXN0RXhwcihleHByOiBFeHByLkxpc3QpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGV4cHJlc3Npb24gb2YgZXhwci52YWx1ZSkge1xuICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBFeHByLlNwcmVhZCkge1xuICAgICAgICB2YWx1ZXMucHVzaCguLi50aGlzLmV2YWx1YXRlKChleHByZXNzaW9uIGFzIEV4cHIuU3ByZWFkKS52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRTcHJlYWRFeHByKGV4cHI6IEV4cHIuU3ByZWFkKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVtcGxhdGVQYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oc291cmNlKTtcbiAgICBjb25zdCBleHByZXNzaW9ucyA9IHRoaXMucGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICByZXN1bHQgKz0gdGhpcy5ldmFsdWF0ZShleHByZXNzaW9uKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVtcGxhdGVFeHByKGV4cHI6IEV4cHIuVGVtcGxhdGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHIudmFsdWUucmVwbGFjZShcbiAgICAgIC9cXHtcXHsoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgIChtLCBwbGFjZWhvbGRlcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhcnNlKHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRCaW5hcnlFeHByKGV4cHI6IEV4cHIuQmluYXJ5KTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcblxuICAgIHN3aXRjaCAoZXhwci5vcGVyYXRvci50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5NaW51czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC0gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TbGFzaDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlNsYXNoRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IC8gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5TdGFyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RhckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCAqIHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUGVyY2VudDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBlcmNlbnRFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlBsdXM6XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICsgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QaXBlOlxuICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2FyZXQ6XG4gICAgICAgIHJldHVybiBsZWZ0IF4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5HcmVhdGVyOlxuICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuR3JlYXRlckVxdWFsOlxuICAgICAgICByZXR1cm4gbGVmdCA+PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkxlc3M6XG4gICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZXNzRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0IDw9IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuRXF1YWxFcXVhbDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVxdWFsRXF1YWxFcXVhbDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsOlxuICAgICAgY2FzZSBUb2tlblR5cGUuQmFuZ0VxdWFsRXF1YWw6XG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSByaWdodDtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkluc3RhbmNlb2Y6XG4gICAgICAgIHJldHVybiBsZWZ0IGluc3RhbmNlb2YgcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5JbjpcbiAgICAgICAgcmV0dXJuIGxlZnQgaW4gcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5MZWZ0U2hpZnQ6XG4gICAgICAgIHJldHVybiBsZWZ0IDw8IHJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuUmlnaHRTaGlmdDpcbiAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuVU5LTk9XTl9CSU5BUllfT1BFUkFUT1IsIHsgb3BlcmF0b3I6IGV4cHIub3BlcmF0b3IgfSwgZXhwci5saW5lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHVucmVhY2hhYmxlXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TG9naWNhbEV4cHIoZXhwcjogRXhwci5Mb2dpY2FsKTogYW55IHtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5ldmFsdWF0ZShleHByLmxlZnQpO1xuXG4gICAgaWYgKGV4cHIub3BlcmF0b3IudHlwZSA9PT0gVG9rZW5UeXBlLk9yKSB7XG4gICAgICBpZiAobGVmdCkge1xuICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFsZWZ0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIucmlnaHQpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VGVybmFyeUV4cHIoZXhwcjogRXhwci5UZXJuYXJ5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZShleHByLmNvbmRpdGlvbilcbiAgICAgID8gdGhpcy5ldmFsdWF0ZShleHByLnRoZW5FeHByKVxuICAgICAgOiB0aGlzLmV2YWx1YXRlKGV4cHIuZWxzZUV4cHIpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0TnVsbENvYWxlc2NpbmdFeHByKGV4cHI6IEV4cHIuTnVsbENvYWxlc2NpbmcpOiBhbnkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmV2YWx1YXRlKGV4cHIubGVmdCk7XG4gICAgaWYgKGxlZnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGUoZXhwci5yaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0O1xuICB9XG5cbiAgcHVibGljIHZpc2l0R3JvdXBpbmdFeHByKGV4cHI6IEV4cHIuR3JvdXBpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlKGV4cHIuZXhwcmVzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgdmlzaXRMaXRlcmFsRXhwcihleHByOiBFeHByLkxpdGVyYWwpOiBhbnkge1xuICAgIHJldHVybiBleHByLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHZpc2l0VW5hcnlFeHByKGV4cHI6IEV4cHIuVW5hcnkpOiBhbnkge1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5ldmFsdWF0ZShleHByLnJpZ2h0KTtcbiAgICBzd2l0Y2ggKGV4cHIub3BlcmF0b3IudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuTWludXM6XG4gICAgICAgIHJldHVybiAtcmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5CYW5nOlxuICAgICAgICByZXR1cm4gIXJpZ2h0O1xuICAgICAgY2FzZSBUb2tlblR5cGUuVGlsZGU6XG4gICAgICAgIHJldHVybiB+cmlnaHQ7XG4gICAgICBjYXNlIFRva2VuVHlwZS5QbHVzUGx1czpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk1pbnVzTWludXM6IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICAgIE51bWJlcihyaWdodCkgKyAoZXhwci5vcGVyYXRvci50eXBlID09PSBUb2tlblR5cGUuUGx1c1BsdXMgPyAxIDogLTEpO1xuICAgICAgICBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuVmFyaWFibGUpIHtcbiAgICAgICAgICB0aGlzLnNjb3BlLnNldChleHByLnJpZ2h0Lm5hbWUubGV4ZW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhwci5yaWdodCBpbnN0YW5jZW9mIEV4cHIuR2V0KSB7XG4gICAgICAgICAgY29uc3QgYXNzaWduID0gbmV3IEV4cHIuU2V0KFxuICAgICAgICAgICAgZXhwci5yaWdodC5lbnRpdHksXG4gICAgICAgICAgICBleHByLnJpZ2h0LmtleSxcbiAgICAgICAgICAgIG5ldyBFeHByLkxpdGVyYWwobmV3VmFsdWUsIGV4cHIubGluZSksXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZXZhbHVhdGUoYXNzaWduKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgS0Vycm9yQ29kZS5JTlZBTElEX1BSRUZJWF9SVkFMVUUsXG4gICAgICAgICAgICB7IHJpZ2h0OiBleHByLnJpZ2h0IH0sXG4gICAgICAgICAgICBleHByLmxpbmVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTktOT1dOX1VOQVJZX09QRVJBVE9SLCB7IG9wZXJhdG9yOiBleHByLm9wZXJhdG9yIH0sIGV4cHIubGluZSk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaG91bGQgYmUgdW5yZWFjaGFibGVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDYWxsRXhwcihleHByOiBFeHByLkNhbGwpOiBhbnkge1xuICAgIC8vIHZlcmlmeSBjYWxsZWUgaXMgYSBmdW5jdGlvblxuICAgIGNvbnN0IGNhbGxlZSA9IHRoaXMuZXZhbHVhdGUoZXhwci5jYWxsZWUpO1xuICAgIGlmIChjYWxsZWUgPT0gbnVsbCAmJiBleHByLm9wdGlvbmFsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgY2FsbGVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5OT1RfQV9GVU5DVElPTiwgeyBjYWxsZWU6IGNhbGxlZSB9LCBleHByLmxpbmUpO1xuICAgIH1cbiAgICAvLyBldmFsdWF0ZSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIEV4cHIuU3ByZWFkKSB7XG4gICAgICAgIGFyZ3MucHVzaCguLi50aGlzLmV2YWx1YXRlKChhcmd1bWVudCBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZ3VtZW50KSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGV4ZWN1dGUgZnVuY3Rpb24g4oCUIHByZXNlcnZlIGB0aGlzYCBmb3IgbWV0aG9kIGNhbGxzXG4gICAgaWYgKGV4cHIuY2FsbGVlIGluc3RhbmNlb2YgRXhwci5HZXQpIHtcbiAgICAgIHJldHVybiBjYWxsZWUuYXBwbHkoZXhwci5jYWxsZWUuZW50aXR5LnJlc3VsdCwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYWxsZWUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0TmV3RXhwcihleHByOiBFeHByLk5ldyk6IGFueSB7XG4gICAgY29uc3QgY2xhenogPSB0aGlzLmV2YWx1YXRlKGV4cHIuY2xhenopO1xuXG4gICAgaWYgKHR5cGVvZiBjbGF6eiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmVycm9yKFxuICAgICAgICBLRXJyb3JDb2RlLk5PVF9BX0NMQVNTLFxuICAgICAgICB7IGNsYXp6OiBjbGF6eiB9LFxuICAgICAgICBleHByLmxpbmVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBleHByLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmV2YWx1YXRlKGFyZykpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNsYXp6KC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHZpc2l0RGljdGlvbmFyeUV4cHIoZXhwcjogRXhwci5EaWN0aW9uYXJ5KTogYW55IHtcbiAgICBjb25zdCBkaWN0OiBhbnkgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGV4cHIucHJvcGVydGllcykge1xuICAgICAgaWYgKHByb3BlcnR5IGluc3RhbmNlb2YgRXhwci5TcHJlYWQpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkaWN0LCB0aGlzLmV2YWx1YXRlKChwcm9wZXJ0eSBhcyBFeHByLlNwcmVhZCkudmFsdWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS5rZXkpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUoKHByb3BlcnR5IGFzIEV4cHIuU2V0KS52YWx1ZSk7XG4gICAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGljdDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFR5cGVvZkV4cHIoZXhwcjogRXhwci5UeXBlb2YpOiBhbnkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdEVhY2hFeHByKGV4cHI6IEV4cHIuRWFjaCk6IGFueSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGV4cHIubmFtZS5sZXhlbWUsXG4gICAgICBleHByLmtleSA/IGV4cHIua2V5LmxleGVtZSA6IG51bGwsXG4gICAgICB0aGlzLmV2YWx1YXRlKGV4cHIuaXRlcmFibGUpLFxuICAgIF07XG4gIH1cblxuICB2aXNpdFZvaWRFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIHZpc2l0RGVidWdFeHByKGV4cHI6IEV4cHIuVm9pZCk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5ldmFsdWF0ZShleHByLnZhbHVlKTtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgS05vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS05vZGVWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEVsZW1lbnRLTm9kZShrbm9kZTogRWxlbWVudCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVLTm9kZShrbm9kZTogQXR0cmlidXRlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbiAgICB2aXNpdFRleHRLTm9kZShrbm9kZTogVGV4dCwgcGFyZW50PzogTm9kZSk6IFI7XG4gICAgdmlzaXRDb21tZW50S05vZGUoa25vZGU6IENvbW1lbnQsIHBhcmVudD86IE5vZGUpOiBSO1xuICAgIHZpc2l0RG9jdHlwZUtOb2RlKGtub2RlOiBEb2N0eXBlLCBwYXJlbnQ/OiBOb2RlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogS05vZGVbXTtcbiAgICBwdWJsaWMgY2hpbGRyZW46IEtOb2RlW107XG4gICAgcHVibGljIHNlbGY6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IEtOb2RlW10sIGNoaWxkcmVuOiBLTm9kZVtdLCBzZWxmOiBib29sZWFuLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLnNlbGYgPSBzZWxmO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZUtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgS05vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IEtOb2RlVmlzaXRvcjxSPiwgcGFyZW50PzogTm9kZSk6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHRLTm9kZSh0aGlzLCBwYXJlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ0tOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBLTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogS05vZGVWaXNpdG9yPFI+LCBwYXJlbnQ/OiBOb2RlKTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudEtOb2RlKHRoaXMsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnS05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIEtOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2RvY3R5cGUnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBLTm9kZVZpc2l0b3I8Uj4sIHBhcmVudD86IE5vZGUpOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlS05vZGUodGhpcywgcGFyZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdLTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEthc3BlckVycm9yLCBLRXJyb3JDb2RlLCBLRXJyb3JDb2RlVHlwZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5pbXBvcnQgKiBhcyBOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdHlwZXMvdG9rZW5cIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUGFyc2VyIHtcbiAgcHVibGljIGN1cnJlbnQ6IG51bWJlcjtcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgcHVibGljIGNvbDogbnVtYmVyO1xuICBwdWJsaWMgc291cmNlOiBzdHJpbmc7XG4gIHB1YmxpYyBub2RlczogTm9kZS5LTm9kZVtdO1xuXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLmxpbmUgPSAxO1xuICAgIHRoaXMuY29sID0gMTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm5vZGVzID0gW107XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKGVvZkVycm9yOiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgdGhpcy5jb2wgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlVORVhQRUNURURfRU9GLCB7IGVvZkVycm9yOiBlb2ZFcnJvciB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jdXJyZW50LCB0aGlzLmN1cnJlbnQgKyBjaGFyLmxlbmd0aCkgPT09IGNoYXI7XG4gIH1cblxuICBwcml2YXRlIGVvZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55ID0ge30pOiBhbnkge1xuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBhcmdzLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLktOb2RlIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBsZXQgbm9kZTogTm9kZS5LTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5VTkVYUEVDVEVEX0NMT1NJTkdfVEFHKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb21tZW50KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGRvIHtcbiAgICAgIHRoaXMuYWR2YW5jZShcIkV4cGVjdGVkIGNvbW1lbnQgY2xvc2luZyAnLS0+J1wiKTtcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMyk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkNvbW1lbnQoY29tbWVudCwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLktOb2RlIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9UQUdfTkFNRSk7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfQlJBQ0tFVCk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLktOb2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuRVhQRUNURURfQ0xPU0lOR19UQUcsIHsgbmFtZTogbmFtZSB9KTtcbiAgICB9XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLkVYUEVDVEVEX0NMT1NJTkdfVEFHLCB7IG5hbWU6IG5hbWUgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuS05vZGVbXSB7XG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuS05vZGVbXSA9IFtdO1xuICAgIGRvIHtcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5FWFBFQ1RFRF9DTE9TSU5HX1RBRywgeyBuYW1lOiBwYXJlbnQgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAoIXRoaXMucGVlayhgPC9gKSk7XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuQkxBTktfQVRUUklCVVRFX05BTUUpO1xuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5zdHJpbmcoXCInXCIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRlY29kZUVudGl0aWVzKHRoaXMuc3RyaW5nKCdcIicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZGVjb2RlRW50aXRpZXModGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuS05vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwie3tcIikpIHsgZGVwdGgrKzsgY29udGludWU7IH1cbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgdGhpcy5tYXRjaChcIn19XCIpKSB7IGRlcHRoLS07IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdGhpcy5wZWVrKFwiPFwiKSkgeyBicmVhazsgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhdyA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXJhdykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRoaXMuZGVjb2RlRW50aXRpZXMocmF3KSwgbGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUVudGl0aWVzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgXCJcXHUwMGEwXCIpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIilcbiAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKVxuICAgICAgLnJlcGxhY2UoLyZxdW90Oy9nLCAnXCInKVxuICAgICAgLnJlcGxhY2UoLyZhcG9zOy9nLCBcIidcIilcbiAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7IC8vIG11c3QgYmUgbGFzdCB0byBhdm9pZCBkb3VibGUtZGVjb2RpbmdcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q2xhc3MgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSb3V0ZUNvbmZpZyB7XG4gIHBhdGg6IHN0cmluZztcbiAgY29tcG9uZW50OiBDb21wb25lbnRDbGFzcztcbiAgZ3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGUocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIFwiXCIsIHBhdGgpO1xuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgUG9wU3RhdGVFdmVudChcInBvcHN0YXRlXCIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoUGF0aChwYXR0ZXJuOiBzdHJpbmcsIHBhdGhuYW1lOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgbnVsbCB7XG4gIGlmIChwYXR0ZXJuID09PSBcIipcIikgcmV0dXJuIHt9O1xuICBjb25zdCBwYXR0ZXJuUGFydHMgPSBwYXR0ZXJuLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHBhdGhuYW1lLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmIChwYXR0ZXJuUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVyblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHBhdHRlcm5QYXJ0c1tpXS5zdGFydHNXaXRoKFwiOlwiKSkge1xuICAgICAgcGFyYW1zW3BhdHRlcm5QYXJ0c1tpXS5zbGljZSgxKV0gPSBwYXRoUGFydHNbaV07XG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuUGFydHNbaV0gIT09IHBhdGhQYXJ0c1tpXSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBwcml2YXRlIHJvdXRlczogUm91dGVDb25maWdbXSA9IFtdO1xuXG4gIHNldFJvdXRlcyhyb3V0ZXM6IFJvdXRlQ29uZmlnW10pOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlcztcbiAgfVxuXG4gIG9uTW91bnQoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCAoKSA9PiB0aGlzLl9uYXZpZ2F0ZSgpLCB7XG4gICAgICBzaWduYWw6IHRoaXMuJGFib3J0Q29udHJvbGxlci5zaWduYWwsXG4gICAgfSk7XG4gICAgdGhpcy5fbmF2aWdhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX25hdmlnYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGZvciAoY29uc3Qgcm91dGUgb2YgdGhpcy5yb3V0ZXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoUGF0aChyb3V0ZS5wYXRoLCBwYXRobmFtZSk7XG4gICAgICBpZiAocGFyYW1zID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIGlmIChyb3V0ZS5ndWFyZCkge1xuICAgICAgICBjb25zdCBhbGxvd2VkID0gYXdhaXQgcm91dGUuZ3VhcmQoKTtcbiAgICAgICAgaWYgKCFhbGxvd2VkKSByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9tb3VudChyb3V0ZS5jb21wb25lbnQsIHBhcmFtcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbW91bnQoQ29tcG9uZW50Q2xhc3M6IENvbXBvbmVudENsYXNzLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5yZWYgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKCFlbGVtZW50IHx8ICF0aGlzLnRyYW5zcGlsZXIpIHJldHVybjtcbiAgICB0aGlzLnRyYW5zcGlsZXIubW91bnRDb21wb25lbnQoQ29tcG9uZW50Q2xhc3MsIGVsZW1lbnQsIHBhcmFtcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBCb3VuZGFyeSB7XG4gIHByaXZhdGUgc3RhcnQ6IENvbW1lbnQ7XG4gIHByaXZhdGUgZW5kOiBDb21tZW50O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogTm9kZSwgbGFiZWw6IHN0cmluZyA9IFwiYm91bmRhcnlcIikge1xuICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGAke2xhYmVsfS1zdGFydGApO1xuICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChgJHtsYWJlbH0tZW5kYCk7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuc3RhcnQpO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVuZCk7XG4gIH1cblxuICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nO1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IHRoaXMuZW5kKSB7XG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnQ7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIHRvUmVtb3ZlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRvUmVtb3ZlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KG5vZGU6IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmVuZC5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUobm9kZSwgdGhpcy5lbmQpO1xuICB9XG5cbiAgcHVibGljIG5vZGVzKCk6IE5vZGVbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBOb2RlW10gPSBbXTtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmc7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudCAhPT0gdGhpcy5lbmQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBhcmVudCgpOiBOb2RlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucGFyZW50Tm9kZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5cbnR5cGUgVGFzayA9ICgpID0+IHZvaWQ7XG5cbmNvbnN0IHF1ZXVlID0gbmV3IE1hcDxDb21wb25lbnQsIFRhc2tbXT4oKTtcbmNvbnN0IG5leHRUaWNrQ2FsbGJhY2tzOiBUYXNrW10gPSBbXTtcbmxldCBpc1NjaGVkdWxlZCA9IGZhbHNlO1xubGV0IGJhdGNoaW5nRW5hYmxlZCA9IHRydWU7XG5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBpc1NjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIC8vIDEuIFByb2Nlc3MgY29tcG9uZW50IHVwZGF0ZXNcbiAgZm9yIChjb25zdCBbaW5zdGFuY2UsIHRhc2tzXSBvZiBxdWV1ZS5lbnRyaWVzKCkpIHtcbiAgICB0cnkge1xuICAgICAgLy8gQ2FsbCBwcmUtdXBkYXRlIGhvb2sgKG9ubHkgZm9yIHJlYWN0aXZlIHVwZGF0ZXMsIG5vdCBmaXJzdCBtb3VudClcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25DaGFuZ2VzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgaW5zdGFuY2Uub25DaGFuZ2VzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgc3VyZ2ljYWwgRE9NIHVwZGF0ZXMgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICBmb3IgKGNvbnN0IHRhc2sgb2YgdGFza3MpIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuXG4gICAgICAvLyBDYWxsIHBvc3QtdXBkYXRlIGhvb2tcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Uub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbS2FzcGVyXSBFcnJvciBkdXJpbmcgY29tcG9uZW50IHVwZGF0ZTpcIiwgZSk7XG4gICAgfVxuICB9XG4gIHF1ZXVlLmNsZWFyKCk7XG5cbiAgLy8gMi4gUHJvY2VzcyBuZXh0VGljayBjYWxsYmFja3NcbiAgY29uc3QgY2FsbGJhY2tzID0gbmV4dFRpY2tDYWxsYmFja3Muc3BsaWNlKDApO1xuICBmb3IgKGNvbnN0IGNiIG9mIGNhbGxiYWNrcykge1xuICAgIHRyeSB7XG4gICAgICBjYigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbS2FzcGVyXSBFcnJvciBpbiBuZXh0VGljayBjYWxsYmFjazpcIiwgZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZVVwZGF0ZShpbnN0YW5jZTogQ29tcG9uZW50LCB0YXNrOiBUYXNrKSB7XG4gIGlmICghYmF0Y2hpbmdFbmFibGVkKSB7XG4gICAgdGFzaygpO1xuICAgIC8vIER1cmluZyBzeW5jIG1vdW50LCB3ZSBkb24ndCBjYWxsIG9uQ2hhbmdlcyBvciBvblJlbmRlciBoZXJlLlxuICAgIC8vIG9uUmVuZGVyIGlzIGNhbGxlZCBtYW51YWxseSBhdCB0aGUgZW5kIG9mIHRyYW5zcGlsZS9ib290c3RyYXAuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFxdWV1ZS5oYXMoaW5zdGFuY2UpKSB7XG4gICAgcXVldWUuc2V0KGluc3RhbmNlLCBbXSk7XG4gIH1cbiAgcXVldWUuZ2V0KGluc3RhbmNlKSEucHVzaCh0YXNrKTtcblxuICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgZnVuY3Rpb24gd2l0aCBiYXRjaGluZyBkaXNhYmxlZC4gXG4gKiBVc2VkIGZvciBpbml0aWFsIG1vdW50IGFuZCBtYW51YWwgcmVuZGVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsdXNoU3luYyhmbjogKCkgPT4gdm9pZCkge1xuICBjb25zdCBwcmV2ID0gYmF0Y2hpbmdFbmFibGVkO1xuICBiYXRjaGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbigpO1xuICB9IGZpbmFsbHkge1xuICAgIGJhdGNoaW5nRW5hYmxlZCA9IHByZXY7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZSBuZXh0IGZyYW1ld29yayB1cGRhdGUgY3ljbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljaygpOiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNiOiBUYXNrKTogdm9pZDtcbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYj86IFRhc2spOiBQcm9taXNlPHZvaWQ+IHwgdm9pZCB7XG4gIGlmIChjYikge1xuICAgIG5leHRUaWNrQ2FsbGJhY2tzLnB1c2goY2IpO1xuICAgIGlmICghaXNTY2hlZHVsZWQpIHtcbiAgICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbmV4dFRpY2tDYWxsYmFja3MucHVzaChyZXNvbHZlKTtcbiAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICBpc1NjaGVkdWxlZCA9IHRydWU7XG4gICAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaCk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudENsYXNzLCBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRXhwcmVzc2lvblBhcnNlciB9IGZyb20gXCIuL2V4cHJlc3Npb24tcGFyc2VyXCI7XG5pbXBvcnQgeyBJbnRlcnByZXRlciB9IGZyb20gXCIuL2ludGVycHJldGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlQ29uZmlnIH0gZnJvbSBcIi4vcm91dGVyXCI7XG5pbXBvcnQgeyBTY2FubmVyIH0gZnJvbSBcIi4vc2Nhbm5lclwiO1xuaW1wb3J0IHsgU2NvcGUgfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHsgZWZmZWN0IH0gZnJvbSBcIi4vc2lnbmFsXCI7XG5pbXBvcnQgeyBCb3VuZGFyeSB9IGZyb20gXCIuL2JvdW5kYXJ5XCI7XG5pbXBvcnQgeyBUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL3RlbXBsYXRlLXBhcnNlclwiO1xuaW1wb3J0IHsgcXVldWVVcGRhdGUsIGZsdXNoU3luYyB9IGZyb20gXCIuL3NjaGVkdWxlclwiO1xuaW1wb3J0IHsgS2FzcGVyRXJyb3IsIEtFcnJvckNvZGUsIEtFcnJvckNvZGVUeXBlIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCIuL3R5cGVzL25vZGVzXCI7XG5cbnR5cGUgSWZFbHNlTm9kZSA9IFtLTm9kZS5FbGVtZW50LCBLTm9kZS5BdHRyaWJ1dGVdO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLktOb2RlVmlzaXRvcjx2b2lkPiB7XG4gIHByaXZhdGUgc2Nhbm5lciA9IG5ldyBTY2FubmVyKCk7XG4gIHByaXZhdGUgcGFyc2VyID0gbmV3IEV4cHJlc3Npb25QYXJzZXIoKTtcbiAgcHJpdmF0ZSBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcigpO1xuICBwcml2YXRlIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuICBwdWJsaWMgbW9kZTogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCIgPSBcImRldmVsb3BtZW50XCI7XG4gIHByaXZhdGUgaXNSZW5kZXJpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogeyByZWdpc3RyeTogQ29tcG9uZW50UmVnaXN0cnkgfSkge1xuICAgIHRoaXMucmVnaXN0cnlbXCJyb3V0ZXJcIl0gPSB7IGNvbXBvbmVudDogUm91dGVyLCBub2RlczogW10gfTtcbiAgICBpZiAoIW9wdGlvbnMpIHJldHVybjtcbiAgICBpZiAob3B0aW9ucy5yZWdpc3RyeSkge1xuICAgICAgdGhpcy5yZWdpc3RyeSA9IHsgLi4udGhpcy5yZWdpc3RyeSwgLi4ub3B0aW9ucy5yZWdpc3RyeSB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuS05vZGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgY29uc3QgZWwgPSBub2RlIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBjb25zdCBtaXNwbGFjZWQgPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWxzZWlmXCIsIFwiQGVsc2VcIl0pO1xuICAgICAgaWYgKG1pc3BsYWNlZCkge1xuICAgICAgICAvLyBUaGVzZSBhcmUgaGFuZGxlZCBieSBkb0lmLCBpZiB3ZSByZWFjaCB0aGVtIGhlcmUgaXQncyBhbiBlcnJvclxuICAgICAgICBjb25zdCBuYW1lID0gbWlzcGxhY2VkLm5hbWUuc3RhcnRzV2l0aChcIkBcIikgPyBtaXNwbGFjZWQubmFtZS5zbGljZSgxKSA6IG1pc3BsYWNlZC5uYW1lO1xuICAgICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuTUlTUExBQ0VEX0NPTkRJVElPTkFMLCB7IG5hbWU6IG5hbWUgfSwgZWwubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIG5vZGUuYWNjZXB0KHRoaXMsIHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXRob2RzKGVudGl0eTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFlbnRpdHkgfHwgdHlwZW9mIGVudGl0eSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXG4gICAgbGV0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVudGl0eSk7XG4gICAgd2hpbGUgKHByb3RvICYmIHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGtleSk/LmdldCkgY29udGludWU7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgZW50aXR5W2tleV0gPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgIGtleSAhPT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlbnRpdHksIGtleSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW50aXR5W2tleV0gPSBlbnRpdHlba2V5XS5iaW5kKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGVzIGFuIGVmZmVjdCB0aGF0IHJlc3RvcmVzIHRoZSBjdXJyZW50IHNjb3BlIG9uIGV2ZXJ5IHJlLXJ1bixcbiAgLy8gc28gZWZmZWN0cyBzZXQgdXAgaW5zaWRlIEBlYWNoIGFsd2F5cyBldmFsdWF0ZSBpbiB0aGVpciBpdGVtIHNjb3BlLlxuICBwcml2YXRlIHNjb3BlZEVmZmVjdChmbjogKCkgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICByZXR1cm4gZWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZXZhbHVhdGVzIGV4cHJlc3Npb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0IGV2YWx1YXRpb25cbiAgcHJpdmF0ZSBleGVjdXRlKHNvdXJjZTogc3RyaW5nLCBvdmVycmlkZVNjb3BlPzogU2NvcGUpOiBhbnkge1xuICAgIGNvbnN0IHRva2VucyA9IHRoaXMuc2Nhbm5lci5zY2FuKHNvdXJjZSk7XG4gICAgY29uc3QgZXhwcmVzc2lvbnMgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuXG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBpZiAob3ZlcnJpZGVTY29wZSkge1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG92ZXJyaWRlU2NvcGU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcmVzc2lvbikgPT5cbiAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbilcbiAgICApO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID8gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3BpbGUoXG4gICAgbm9kZXM6IEtOb2RlLktOb2RlW10sXG4gICAgZW50aXR5OiBhbnksXG4gICAgY29udGFpbmVyOiBFbGVtZW50XG4gICk6IE5vZGUge1xuICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmRlc3Ryb3koY29udGFpbmVyKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgdGhpcy5iaW5kTWV0aG9kcyhlbnRpdHkpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5pbml0KGVudGl0eSk7XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlLnNldChcIiRpbnN0YW5jZVwiLCBlbnRpdHkpO1xuICAgICAgXG4gICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBjb250YWluZXIpO1xuICAgICAgICB0aGlzLnRyaWdnZXJSZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZpc2l0RWxlbWVudEtOb2RlKG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUVsZW1lbnQobm9kZSwgcGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdFRleHRLTm9kZShub2RlOiBLTm9kZS5UZXh0LCBwYXJlbnQ/OiBOb2RlKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQodGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5ldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKG5vZGUudmFsdWUpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IG5ld1ZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnRyYWNrRWZmZWN0KHRleHQsIHN0b3ApO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLlJVTlRJTUVfRVJST1IsIHsgbWVzc2FnZTogZS5tZXNzYWdlIHx8IGAke2V9YCB9LCBcInRleHQgbm9kZVwiKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRBdHRyaWJ1dGVLTm9kZShub2RlOiBLTm9kZS5BdHRyaWJ1dGUsIHBhcmVudD86IE5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XG5cbiAgICBjb25zdCBzdG9wID0gdGhpcy5zY29wZWRFZmZlY3QoKCkgPT4ge1xuICAgICAgYXR0ci52YWx1ZSA9IHRoaXMuZXZhbHVhdGVUZW1wbGF0ZVN0cmluZyhub2RlLnZhbHVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYWNrRWZmZWN0KGF0dHIsIHN0b3ApO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlzaXRDb21tZW50S05vZGUobm9kZTogS05vZGUuQ29tbWVudCwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmICgocGFyZW50IGFzIGFueSkuaW5zZXJ0ICYmIHR5cGVvZiAocGFyZW50IGFzIGFueSkuaW5zZXJ0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgKHBhcmVudCBhcyBhbnkpLmluc2VydChyZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja0VmZmVjdCh0YXJnZXQ6IGFueSwgc3RvcDogYW55KSB7XG4gICAgaWYgKCF0YXJnZXQuJGthc3BlckVmZmVjdHMpIHRhcmdldC4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIHRhcmdldC4ka2FzcGVyRWZmZWN0cy5wdXNoKHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQXR0cihcbiAgICBub2RlOiBLTm9kZS5FbGVtZW50LFxuICAgIG5hbWU6IHN0cmluZ1tdXG4gICk6IEtOb2RlLkF0dHJpYnV0ZSB8IG51bGwge1xuICAgIGlmICghbm9kZSB8fCAhbm9kZS5hdHRyaWJ1dGVzIHx8ICFub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWIgPSBub2RlLmF0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT5cbiAgICAgIG5hbWUuaW5jbHVkZXMoKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lKVxuICAgICk7XG4gICAgaWYgKGF0dHJpYikge1xuICAgICAgcmV0dXJuIGF0dHJpYiBhcyBLTm9kZS5BdHRyaWJ1dGU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkb0lmKGV4cHJlc3Npb25zOiBJZkVsc2VOb2RlW10sIHBhcmVudDogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJpZlwiKTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgICBcbiAgICAgIGNvbnN0IHRyYWNraW5nU2NvcGUgPSBpbnN0YW5jZSA/IG5ldyBTY29wZSh0aGlzLmludGVycHJldGVyLnNjb3BlKSA6IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICBjb25zdCBwcmV2U2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG5cbiAgICAgIC8vIEV2YWx1YXRlIGNvbmRpdGlvbnMgc3luY2hyb25vdXNseSB0byBlbnN1cmUgc2lnbmFsIHRyYWNraW5nXG4gICAgICBjb25zdCByZXN1bHRzOiBib29sZWFuW10gPSBbXTtcbiAgICAgIHJlc3VsdHMucHVzaCghIXRoaXMuZXhlY3V0ZSgoZXhwcmVzc2lvbnNbMF1bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSkpO1xuICAgICAgXG4gICAgICBpZiAoIXJlc3VsdHNbMF0pIHtcbiAgICAgICAgZm9yIChjb25zdCBleHByZXNzaW9uIG9mIGV4cHJlc3Npb25zLnNsaWNlKDEpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZmluZEF0dHIoZXhwcmVzc2lvblswXSBhcyBLTm9kZS5FbGVtZW50LCBbXCJAZWxzZWlmXCJdKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gISF0aGlzLmV4ZWN1dGUoKGV4cHJlc3Npb25bMV0gYXMgS05vZGUuQXR0cmlidXRlKS52YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2godmFsKTtcbiAgICAgICAgICAgIGlmICh2YWwpIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maW5kQXR0cihleHByZXNzaW9uWzBdIGFzIEtOb2RlLkVsZW1lbnQsIFtcIkBlbHNlXCJdKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcHJldlNjb3BlO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSB0cmFja2luZ1Njb3BlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XG4gICAgICAgICAgICBleHByZXNzaW9uc1swXVswXS5hY2NlcHQodGhpcywgYm91bmRhcnkgYXMgYW55KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzW2ldKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zW2ldWzBdLmFjY2VwdCh0aGlzLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gcnVuO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGtleUF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkBrZXlcIl0pO1xuICAgIGlmIChrZXlBdHRyKSB7XG4gICAgICB0aGlzLmRvRWFjaEtleWVkKGVhY2gsIG5vZGUsIHBhcmVudCwga2V5QXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9FYWNoVW5rZXllZChlYWNoLCBub2RlLCBwYXJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZG9FYWNoVW5rZXllZChlYWNoOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJlYWNoXCIpO1xuICAgIGNvbnN0IG9yaWdpbmFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gdGhpcy5zY2FubmVyLnNjYW4oZWFjaC52YWx1ZSk7XG4gICAgICBjb25zdCBbbmFtZSwga2V5LCBpdGVyYWJsZV0gPSB0aGlzLmludGVycHJldGVyLmV2YWx1YXRlKFxuICAgICAgICB0aGlzLnBhcnNlci5mb3JlYWNoKHRva2VucylcbiAgICAgICk7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuXG4gICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICBib3VuZGFyeS5ub2RlcygpLmZvckVhY2goKG4pID0+IHRoaXMuZGVzdHJveU5vZGUobikpO1xuICAgICAgICBib3VuZGFyeS5jbGVhcigpO1xuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHNjb3BlVmFsdWVzOiBhbnkgPSB7IFtuYW1lXTogaXRlbSB9O1xuICAgICAgICAgIGlmIChrZXkpIHNjb3BlVmFsdWVzW2tleV0gPSBpbmRleDtcblxuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUmVmcmVzaChub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgLy8gMS4gUmUtcnVuIHN0cnVjdHVyYWwgbG9naWMgKGlmL2VhY2gvd2hpbGUpXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlclJlZnJlc2gpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlclJlZnJlc2goKTtcbiAgICB9XG4gICAgXG4gICAgLy8gMi4gUmUtcnVuIGFsbCBzdXJnaWNhbCBlZmZlY3RzICh0ZXh0IGludGVycG9sYXRpb24sIGF0dHJpYnV0ZXMsIGV0Yy4pXG4gICAgaWYgKChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgIChub2RlIGFzIGFueSkuJGthc3BlckVmZmVjdHMuZm9yRWFjaCgoc3RvcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN0b3AucnVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIFJlY3Vyc2VcbiAgICBub2RlLmNoaWxkTm9kZXM/LmZvckVhY2goKGNoaWxkKSA9PiB0aGlzLnRyaWdnZXJSZWZyZXNoKGNoaWxkKSk7XG4gIH1cblxuICBwcml2YXRlIGRvRWFjaEtleWVkKGVhY2g6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlLCBrZXlBdHRyOiBLTm9kZS5BdHRyaWJ1dGUpIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IG5ldyBCb3VuZGFyeShwYXJlbnQsIFwiZWFjaFwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICBjb25zdCBrZXllZE5vZGVzID0gbmV3IE1hcDxhbnksIE5vZGU+KCk7XG5cbiAgICBjb25zdCBydW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2NhbihlYWNoLnZhbHVlKTtcbiAgICAgIGNvbnN0IFtuYW1lLCBpbmRleEtleSwgaXRlcmFibGVdID0gdGhpcy5pbnRlcnByZXRlci5ldmFsdWF0ZShcbiAgICAgICAgdGhpcy5wYXJzZXIuZm9yZWFjaCh0b2tlbnMpXG4gICAgICApO1xuICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmludGVycHJldGVyLnNjb3BlLmdldChcIiRpbnN0YW5jZVwiKTtcblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgaXRlbXMgYW5kIHRoZWlyIGtleXMgaW1tZWRpYXRlbHlcbiAgICAgIGNvbnN0IG5ld0l0ZW1zOiBBcnJheTx7IGl0ZW06IGFueTsgaWR4OiBudW1iZXI7IGtleTogYW55IH0+ID0gW107XG4gICAgICBjb25zdCBzZWVuS2V5cyA9IG5ldyBTZXQoKTtcbiAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgIGlmIChpbmRleEtleSkgc2NvcGVWYWx1ZXNbaW5kZXhLZXldID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBuZXcgU2NvcGUob3JpZ2luYWxTY29wZSwgc2NvcGVWYWx1ZXMpO1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmV4ZWN1dGUoa2V5QXR0ci52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIHNlZW5LZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBbS2FzcGVyXSBEdXBsaWNhdGUga2V5IGRldGVjdGVkIGluIEBlYWNoOiBcIiR7a2V5fVwiLiBLZXlzIG11c3QgYmUgdW5pcXVlIHRvIGVuc3VyZSBjb3JyZWN0IHJlY29uY2lsaWF0aW9uLmApO1xuICAgICAgICB9XG4gICAgICAgIHNlZW5LZXlzLmFkZChrZXkpO1xuXG4gICAgICAgIG5ld0l0ZW1zLnB1c2goeyBpdGVtOiBpdGVtLCBpZHg6IGluZGV4LCBrZXk6IGtleSB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFzayA9ICgpID0+IHtcbiAgICAgICAgLy8gRGVzdHJveSBub2RlcyB3aG9zZSBrZXlzIGFyZSBubyBsb25nZXIgcHJlc2VudFxuICAgICAgICBjb25zdCBuZXdLZXlTZXQgPSBuZXcgU2V0KG5ld0l0ZW1zLm1hcCgoaSkgPT4gaS5rZXkpKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBkb21Ob2RlXSBvZiBrZXllZE5vZGVzKSB7XG4gICAgICAgICAgaWYgKCFuZXdLZXlTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAga2V5ZWROb2Rlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQvcmV1c2Ugbm9kZXMgaW4gbmV3IG9yZGVyXG4gICAgICAgIGZvciAoY29uc3QgeyBpdGVtLCBpZHgsIGtleSB9IG9mIG5ld0l0ZW1zKSB7XG4gICAgICAgICAgY29uc3Qgc2NvcGVWYWx1ZXM6IGFueSA9IHsgW25hbWVdOiBpdGVtIH07XG4gICAgICAgICAgaWYgKGluZGV4S2V5KSBzY29wZVZhbHVlc1tpbmRleEtleV0gPSBpZHg7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlLCBzY29wZVZhbHVlcyk7XG5cbiAgICAgICAgICBpZiAoa2V5ZWROb2Rlcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgY29uc3QgZG9tTm9kZSA9IGtleWVkTm9kZXMuZ2V0KGtleSkhO1xuICAgICAgICAgICAgYm91bmRhcnkuaW5zZXJ0KGRvbU5vZGUpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgc2NvcGUgYW5kIHRyaWdnZXIgcmUtcmVuZGVyIG9mIG5lc3RlZCBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZXNcbiAgICAgICAgICAgIGNvbnN0IG5vZGVTY29wZSA9IChkb21Ob2RlIGFzIGFueSkuJGthc3BlclNjb3BlO1xuICAgICAgICAgICAgaWYgKG5vZGVTY29wZSkge1xuICAgICAgICAgICAgICBub2RlU2NvcGUuc2V0KG5hbWUsIGl0ZW0pO1xuICAgICAgICAgICAgICBpZiAoaW5kZXhLZXkpIG5vZGVTY29wZS5zZXQoaW5kZXhLZXksIGlkeCk7XG5cbiAgICAgICAgICAgICAgLy8gSWYgaXQgaGFzIGl0cyBvd24gcmVuZGVyIGxvZ2ljIChuZXN0ZWQgZWFjaC9pZiksIHRyaWdnZXIgaXQgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyUmVmcmVzaChkb21Ob2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlZCA9IHRoaXMuY3JlYXRlRWxlbWVudChub2RlLCBib3VuZGFyeSBhcyBhbnkpO1xuICAgICAgICAgICAgaWYgKGNyZWF0ZWQpIHtcbiAgICAgICAgICAgICAga2V5ZWROb2Rlcy5zZXQoa2V5LCBjcmVhdGVkKTtcbiAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHNjb3BlIG9uIHRoZSBET00gbm9kZSBzbyB3ZSBjYW4gdXBkYXRlIGl0IGxhdGVyXG4gICAgICAgICAgICAgIChjcmVhdGVkIGFzIGFueSkuJGthc3BlclNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9O1xuXG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFzaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAoYm91bmRhcnkgYXMgYW55KS5zdGFydC4ka2FzcGVyUmVmcmVzaCA9IHJ1bjtcblxuICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdChydW4pO1xuICAgIHRoaXMudHJhY2tFZmZlY3QoYm91bmRhcnksIHN0b3ApO1xuICB9XG5cblxuICBwcml2YXRlIGRvV2hpbGUoJHdoaWxlOiBLTm9kZS5BdHRyaWJ1dGUsIG5vZGU6IEtOb2RlLkVsZW1lbnQsIHBhcmVudDogTm9kZSkge1xuICAgIGNvbnN0IGJvdW5kYXJ5ID0gbmV3IEJvdW5kYXJ5KHBhcmVudCwgXCJ3aGlsZVwiKTtcbiAgICBjb25zdCBvcmlnaW5hbFNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcblxuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAvLyBUcmFja2luZzogZXZhbHVhdGUgZmlyc3QgaXRlcmF0aW9uIHN5bmNocm9ub3VzbHkgaW4gYSB0ZW1wb3Jhcnkgc2NvcGVcbiAgICAgICAgY29uc3QgdHJhY2tpbmdTY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICAgICAgY29uc3QgcHJldlNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG4gICAgICAgIGNvbnN0IGZpcnN0Q29uZGl0aW9uID0gISF0aGlzLmV4ZWN1dGUoJHdoaWxlLnZhbHVlKTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXZTY29wZTtcblxuICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgIGJvdW5kYXJ5Lm5vZGVzKCkuZm9yRWFjaCgobikgPT4gdGhpcy5kZXN0cm95Tm9kZShuKSk7XG4gICAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcblxuICAgICAgICAgIC8vIFVzZSB0aGUgc2FtZSB0cmFja2luZyBzY29wZSB0byBjb250aW51ZSB0aGUgbG9vcFxuICAgICAgICAgIGNvbnN0IHJlc3RvcmVTY29wZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHRyYWNraW5nU2NvcGU7XG4gICAgICAgICAgbGV0IGN1cnJlbnRDb25kaXRpb24gPSBmaXJzdENvbmRpdGlvbjtcbiAgICAgICAgICB3aGlsZSAoY3VycmVudENvbmRpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgICAgICBjdXJyZW50Q29uZGl0aW9uID0gISF0aGlzLmV4ZWN1dGUoJHdoaWxlLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm91bmRhcnkubm9kZXMoKS5mb3JFYWNoKChuKSA9PiB0aGlzLmRlc3Ryb3lOb2RlKG4pKTtcbiAgICAgICAgYm91bmRhcnkuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShvcmlnaW5hbFNjb3BlKTtcbiAgICAgICAgd2hpbGUgKHRoaXMuZXhlY3V0ZSgkd2hpbGUudmFsdWUpKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIGJvdW5kYXJ5IGFzIGFueSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG9yaWdpbmFsU2NvcGU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIChib3VuZGFyeSBhcyBhbnkpLnN0YXJ0LiRrYXNwZXJSZWZyZXNoID0gcnVuO1xuXG4gICAgY29uc3Qgc3RvcCA9IHRoaXMuc2NvcGVkRWZmZWN0KHJ1bik7XG4gICAgdGhpcy50cmFja0VmZmVjdChib3VuZGFyeSwgc3RvcCk7XG4gIH1cblxuICAvLyBleGVjdXRlcyBpbml0aWFsaXphdGlvbiBpbiB0aGUgY3VycmVudCBzY29wZVxuICBwcml2YXRlIGRvTGV0KGluaXQ6IEtOb2RlLkF0dHJpYnV0ZSwgbm9kZTogS05vZGUuRWxlbWVudCwgcGFyZW50OiBOb2RlKSB7XG4gICAgY29uc3QgcmVzdG9yZVNjb3BlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZTtcbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSk7XG5cbiAgICB0aGlzLmV4ZWN1dGUoaW5pdC52YWx1ZSk7XG4gICAgdGhpcy5jcmVhdGVFbGVtZW50KG5vZGUsIHBhcmVudCk7XG5cbiAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gcmVzdG9yZVNjb3BlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTaWJsaW5ncyhub2RlczogS05vZGUuS05vZGVbXSwgcGFyZW50PzogTm9kZSk6IHZvaWQge1xuICAgIGxldCBjdXJyZW50ID0gMDtcbiAgICBjb25zdCBpbml0aWFsU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgIGxldCBncm91cFNjb3BlOiBTY29wZSB8IG51bGwgPSBudWxsO1xuXG4gICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tjdXJyZW50KytdO1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgY29uc3QgZWwgPSBub2RlIGFzIEtOb2RlLkVsZW1lbnQ7XG5cbiAgICAgICAgLy8gMS4gUHJvY2VzcyBAbGV0IChsZWFrcyB0byBzaWJsaW5ncyBhbmQgYXZhaWxhYmxlIHRvIG90aGVyIGRpcmVjdGl2ZXMgb24gdGhpcyBub2RlKVxuICAgICAgICBjb25zdCAkbGV0ID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGxldFwiXSk7XG4gICAgICAgIGlmICgkbGV0KSB7XG4gICAgICAgICAgaWYgKCFncm91cFNjb3BlKSB7XG4gICAgICAgICAgICBncm91cFNjb3BlID0gbmV3IFNjb3BlKGluaXRpYWxTY29wZSk7XG4gICAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gZ3JvdXBTY29wZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5leGVjdXRlKCRsZXQudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMi4gVmFsaWRhdGlvbjogU3RydWN0dXJhbCBkaXJlY3RpdmVzIGFyZSBtdXR1YWxseSBleGNsdXNpdmVcbiAgICAgICAgY29uc3QgaWZBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGlmXCJdKTtcbiAgICAgICAgY29uc3QgZWxzZWlmQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlbHNlaWZcIl0pO1xuICAgICAgICBjb25zdCBlbHNlQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBlbHNlXCJdKTtcbiAgICAgICAgY29uc3QgJGVhY2ggPSB0aGlzLmZpbmRBdHRyKGVsLCBbXCJAZWFjaFwiXSk7XG4gICAgICAgIGNvbnN0ICR3aGlsZSA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkB3aGlsZVwiXSk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiKSB7XG4gICAgICAgICAgY29uc3Qgc3RydWN0dXJhbENvdW50ID0gW2lmQXR0ciwgZWxzZWlmQXR0ciwgZWxzZUF0dHIsICRlYWNoLCAkd2hpbGVdLmZpbHRlcihhID0+IGEpLmxlbmd0aDtcbiAgICAgICAgICBpZiAoc3RydWN0dXJhbENvdW50ID4gMSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1VTFRJUExFX1NUUlVDVFVSQUxfRElSRUNUSVZFUywge30sIGVsLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIFByb2Nlc3Mgc3RydWN0dXJhbCBkaXJlY3RpdmVzIChvbmUgd2lsbCBtYXRjaCBhbmQgY29udGludWUpXG4gICAgICAgIGlmICgkZWFjaCkge1xuICAgICAgICAgIHRoaXMuZG9FYWNoKCRlYWNoLCBlbCwgcGFyZW50ISk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWZBdHRyKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IElmRWxzZU5vZGVbXSA9IFtbZWwsIGlmQXR0cl1dO1xuXG4gICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGVzW2N1cnJlbnRdIGFzIEtOb2RlLkVsZW1lbnQsIFtcbiAgICAgICAgICAgICAgXCJAZWxzZVwiLFxuICAgICAgICAgICAgICBcIkBlbHNlaWZcIixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChbbm9kZXNbY3VycmVudF0gYXMgS05vZGUuRWxlbWVudCwgYXR0cl0pO1xuICAgICAgICAgICAgICBjdXJyZW50ICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRvSWYoZXhwcmVzc2lvbnMsIHBhcmVudCEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCR3aGlsZSkge1xuICAgICAgICAgIHRoaXMuZG9XaGlsZSgkd2hpbGUsIGVsLCBwYXJlbnQhKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLmV2YWx1YXRlKG5vZGUsIHBhcmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IGluaXRpYWxTY29wZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbWVudChub2RlOiBLTm9kZS5FbGVtZW50LCBwYXJlbnQ/OiBOb2RlKTogTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChub2RlLm5hbWUgPT09IFwic2xvdFwiKSB7XG4gICAgICAgIGNvbnN0IG5hbWVBdHRyID0gdGhpcy5maW5kQXR0cihub2RlLCBbXCJAbmFtZVwiXSk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lQXR0ciA/IG5hbWVBdHRyLnZhbHVlIDogXCJkZWZhdWx0XCI7XG4gICAgICAgIGNvbnN0IHNsb3RzID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkc2xvdHNcIik7XG4gICAgICAgIGlmIChzbG90cyAmJiBzbG90c1tuYW1lXSkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3Moc2xvdHNbbmFtZV0sIHBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNWb2lkID0gbm9kZS5uYW1lID09PSBcInZvaWRcIjtcbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gISF0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV07XG5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBpc1ZvaWQgPyBwYXJlbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSk7XG4gICAgICBjb25zdCByZXN0b3JlU2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuXG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZS5zZXQoXCIkcmVmXCIsIGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNDb21wb25lbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCBzY29wZVxuICAgICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSB7fTtcbiAgICAgICAgY29uc3QgYXJnc0F0dHIgPSBub2RlLmF0dHJpYnV0ZXMuZmlsdGVyKChhdHRyKSA9PlxuICAgICAgICAgIChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuY3JlYXRlQ29tcG9uZW50QXJncyhhcmdzQXR0ciBhcyBLTm9kZS5BdHRyaWJ1dGVbXSk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBjaGlsZHJlbiBmb3Igc2xvdHNcbiAgICAgICAgY29uc3Qgc2xvdHM6IFJlY29yZDxzdHJpbmcsIEtOb2RlLktOb2RlW10+ID0geyBkZWZhdWx0OiBbXSB9O1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHNsb3RBdHRyID0gdGhpcy5maW5kQXR0cihjaGlsZCBhcyBLTm9kZS5FbGVtZW50LCBbXCJAc2xvdFwiXSk7XG4gICAgICAgICAgICBpZiAoc2xvdEF0dHIpIHtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNsb3RBdHRyLnZhbHVlO1xuICAgICAgICAgICAgICBpZiAoIXNsb3RzW25hbWVdKSBzbG90c1tuYW1lXSA9IFtdO1xuICAgICAgICAgICAgICBzbG90c1tuYW1lXS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsb3RzLmRlZmF1bHQucHVzaChjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdPy5jb21wb25lbnQpIHtcbiAgICAgICAgICBjb21wb25lbnQgPSBuZXcgdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLmNvbXBvbmVudCh7XG4gICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgcmVmOiBlbGVtZW50LFxuICAgICAgICAgICAgdHJhbnNwaWxlcjogdGhpcyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE5vZGVzID0gdGhpcy5yZWdpc3RyeVtub2RlLm5hbWVdLm5vZGVzITtcbiAgICAgICAgICBjb21wb25lbnQuJHJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGhpcy5kZXN0cm95KGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUocmVzdG9yZVNjb3BlLCBjb21wb25lbnQpO1xuICAgICAgICAgICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgY29tcG9uZW50LiRzbG90cyA9IHNsb3RzO1xuICAgICAgICAgICAgICBjb25zdCBwcmV2U2NvcGUgPSB0aGlzLmludGVycHJldGVyLnNjb3BlO1xuICAgICAgICAgICAgICB0aGlzLmludGVycHJldGVyLnNjb3BlID0gc2NvcGU7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBmbHVzaFN5bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2libGluZ3MoY29tcG9uZW50Tm9kZXMsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChub2RlLm5hbWUgPT09IFwicm91dGVyXCIgJiYgY29tcG9uZW50IGluc3RhbmNlb2YgUm91dGVyKSB7XG4gICAgICAgICAgICBjb25zdCByb3V0ZVNjb3BlID0gbmV3IFNjb3BlKHJlc3RvcmVTY29wZSwgY29tcG9uZW50KTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXRSb3V0ZXModGhpcy5leHRyYWN0Um91dGVzKG5vZGUuY2hpbGRyZW4sIHVuZGVmaW5lZCwgcm91dGVTY29wZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29tcG9uZW50Lm9uTW91bnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXhwb3NlIHNsb3RzIGluIGNvbXBvbmVudCBzY29wZVxuICAgICAgICBjb21wb25lbnQuJHNsb3RzID0gc2xvdHM7XG5cbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IG5ldyBTY29wZShyZXN0b3JlU2NvcGUsIGNvbXBvbmVudCk7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBjaGlsZHJlbiBvZiB0aGUgY29tcG9uZW50XG4gICAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyh0aGlzLnJlZ2lzdHJ5W25vZGUubmFtZV0ubm9kZXMhLCBlbGVtZW50KTtcblxuICAgICAgICAgIGlmIChjb21wb25lbnQgJiYgdHlwZW9mIGNvbXBvbmVudC5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnQub25SZW5kZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSByZXN0b3JlU2NvcGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICBpZiAoKHBhcmVudCBhcyBhbnkpLmluc2VydCAmJiB0eXBlb2YgKHBhcmVudCBhcyBhbnkpLmluc2VydCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAocGFyZW50IGFzIGFueSkuaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzVm9pZCkge1xuICAgICAgICAvLyBldmVudCBiaW5kaW5nXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+XG4gICAgICAgICAgKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUV2ZW50TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQgYXMgS05vZGUuQXR0cmlidXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZ3VsYXIgYXR0cmlidXRlcyAocHJvY2Vzc2VkIGZpcnN0KVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLmZpbHRlcihcbiAgICAgICAgICAoYXR0cikgPT4gIShhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkubmFtZS5zdGFydHNXaXRoKFwiQFwiKVxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdGhpcy5ldmFsdWF0ZShhdHRyLCBlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNob3J0aGFuZCBhdHRyaWJ1dGVzIChwcm9jZXNzZWQgc2Vjb25kLCBhbGxvd3MgbWVyZ2luZylcbiAgICAgICAgY29uc3Qgc2hvcnRoYW5kQXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcy5maWx0ZXIoKGF0dHIpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBuYW1lLnN0YXJ0c1dpdGgoXCJAXCIpICYmXG4gICAgICAgICAgICAhW1wiQGlmXCIsIFwiQGVsc2VpZlwiLCBcIkBlbHNlXCIsIFwiQGVhY2hcIiwgXCJAd2hpbGVcIiwgXCJAbGV0XCIsIFwiQGtleVwiLCBcIkByZWZcIl0uaW5jbHVkZXMoXG4gICAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICFuYW1lLnN0YXJ0c1dpdGgoXCJAb246XCIpICYmXG4gICAgICAgICAgICAhbmFtZS5zdGFydHNXaXRoKFwiQDpcIilcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGF0dHIgb2Ygc2hvcnRoYW5kQXR0cmlidXRlcykge1xuICAgICAgICAgIGNvbnN0IHJlYWxOYW1lID0gKGF0dHIgYXMgS05vZGUuQXR0cmlidXRlKS5uYW1lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgaWYgKHJlYWxOYW1lID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0RHluYW1pY1ZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRpY0NsYXNzID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBzdGF0aWNDbGFzcy5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiBjICE9PSBsYXN0RHluYW1pY1ZhbHVlICYmIGMgIT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBjdXJyZW50Q2xhc3NlcyA/IGAke2N1cnJlbnRDbGFzc2VzfSAke3ZhbHVlfWAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIGxhc3REeW5hbWljVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVVwZGF0ZShpbnN0YW5jZSwgdGFzayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tFZmZlY3QoZWxlbWVudCwgc3RvcCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLnNjb3BlZEVmZmVjdCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5leGVjdXRlKChhdHRyIGFzIEtOb2RlLkF0dHJpYnV0ZSkudmFsdWUpO1xuICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlYWxOYW1lICE9PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnJlbW92ZUF0dHJpYnV0ZShyZWFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWFsTmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV4aXN0aW5nICYmICFleGlzdGluZy5pbmNsdWRlcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke2V4aXN0aW5nLmVuZHNXaXRoKFwiO1wiKSA/IGV4aXN0aW5nIDogZXhpc3RpbmcgKyBcIjtcIn0gJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zZXRBdHRyaWJ1dGUocmVhbE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgcXVldWVVcGRhdGUoaW5zdGFuY2UsIHRhc2spO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrRWZmZWN0KGVsZW1lbnQsIHN0b3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50ICYmICFpc1ZvaWQpIHtcbiAgICAgICAgaWYgKChwYXJlbnQgYXMgYW55KS5pbnNlcnQgJiYgdHlwZW9mIChwYXJlbnQgYXMgYW55KS5pbnNlcnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIChwYXJlbnQgYXMgYW55KS5pbnNlcnQoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZkF0dHIgPSB0aGlzLmZpbmRBdHRyKG5vZGUsIFtcIkByZWZcIl0pO1xuICAgICAgaWYgKHJlZkF0dHIgJiYgIWlzVm9pZCkge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHJlZkF0dHIudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuZ2V0KFwiJGluc3RhbmNlXCIpO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUuc2V0KHByb3BOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5zZWxmKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGUuY2hpbGRyZW4sIGVsZW1lbnQpO1xuICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHJlc3RvcmVTY29wZTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLmVycm9yKEtFcnJvckNvZGUuUlVOVElNRV9FUlJPUiwgeyBtZXNzYWdlOiBlLm1lc3NhZ2UgfHwgYCR7ZX1gIH0sIG5vZGUubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb21wb25lbnRBcmdzKGFyZ3M6IEtOb2RlLkF0dHJpYnV0ZVtdKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBjb25zdCBrZXkgPSBhcmcubmFtZS5zcGxpdChcIjpcIilbMV07XG4gICAgICByZXN1bHRba2V5XSA9IHRoaXMuZXhlY3V0ZShhcmcudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFdmVudExpc3RlbmVyKGVsZW1lbnQ6IE5vZGUsIGF0dHI6IEtOb2RlLkF0dHJpYnV0ZSk6IHZvaWQge1xuICAgIGNvbnN0IFtldmVudE5hbWUsIC4uLm1vZGlmaWVyc10gPSBhdHRyLm5hbWUuc3BsaXQoXCI6XCIpWzFdLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCBsaXN0ZW5lclNjb3BlID0gbmV3IFNjb3BlKHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG5cbiAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7fTtcbiAgICBpZiAoaW5zdGFuY2UgJiYgaW5zdGFuY2UuJGFib3J0Q29udHJvbGxlcikge1xuICAgICAgb3B0aW9ucy5zaWduYWwgPSBpbnN0YW5jZS4kYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgICB9XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm9uY2VcIikpICAgIG9wdGlvbnMub25jZSAgICA9IHRydWU7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhc3NpdmVcIikpIG9wdGlvbnMucGFzc2l2ZSA9IHRydWU7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhcHR1cmVcIikpIG9wdGlvbnMuY2FwdHVyZSA9IHRydWU7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwcmV2ZW50XCIpKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGlzdGVuZXJTY29wZS5zZXQoXCIkZXZlbnRcIiwgZXZlbnQpO1xuICAgICAgdGhpcy5leGVjdXRlKGF0dHIudmFsdWUsIGxpc3RlbmVyU2NvcGUpO1xuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBldmFsdWF0ZVRlbXBsYXRlU3RyaW5nKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29uc3QgcmVnZXggPSAvXFx7XFx7LitcXH1cXH0vbXM7XG4gICAgaWYgKHJlZ2V4LnRlc3QodGV4dCkpIHtcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLCAobSwgcGxhY2Vob2xkZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uKHBsYWNlaG9sZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0b2tlbnMgPSB0aGlzLnNjYW5uZXIuc2Nhbihzb3VyY2UpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcblxuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZXhwcmVzc2lvbiBvZiBleHByZXNzaW9ucykge1xuICAgICAgcmVzdWx0ICs9IGAke3RoaXMuaW50ZXJwcmV0ZXIuZXZhbHVhdGUoZXhwcmVzc2lvbil9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZGVzdHJveU5vZGUobm9kZTogYW55KTogdm9pZCB7XG4gICAgLy8gMS4gQ2xlYW51cCBjb21wb25lbnQgaW5zdGFuY2VcbiAgICBpZiAobm9kZS4ka2FzcGVySW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbm9kZS4ka2FzcGVySW5zdGFuY2U7XG4gICAgICBpZiAoaW5zdGFuY2Uub25EZXN0cm95KSB7XG4gICAgICAgIGluc3RhbmNlLm9uRGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIpIGluc3RhbmNlLiRhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9XG5cbiAgICAvLyAyLiBDbGVhbnVwIGVmZmVjdHMgYXR0YWNoZWQgdG8gdGhlIG5vZGVcbiAgICBpZiAobm9kZS4ka2FzcGVyRWZmZWN0cykge1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cy5mb3JFYWNoKChzdG9wOiAoKSA9PiB2b2lkKSA9PiBzdG9wKCkpO1xuICAgICAgbm9kZS4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgIH1cblxuICAgIC8vIDMuIENsZWFudXAgZWZmZWN0cyBvbiBhdHRyaWJ1dGVzXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgaWYgKGF0dHIuJGthc3BlckVmZmVjdHMpIHtcbiAgICAgICAgICBhdHRyLiRrYXNwZXJFZmZlY3RzLmZvckVhY2goKHN0b3A6ICgpID0+IHZvaWQpID0+IHN0b3AoKSk7XG4gICAgICAgICAgYXR0ci4ka2FzcGVyRWZmZWN0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gNC4gUmVjdXJzZVxuICAgIG5vZGUuY2hpbGROb2Rlcz8uZm9yRWFjaCgoY2hpbGQ6IGFueSkgPT4gdGhpcy5kZXN0cm95Tm9kZShjaGlsZCkpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koY29udGFpbmVyOiBFbGVtZW50KTogdm9pZCB7XG4gICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuZGVzdHJveU5vZGUoY2hpbGQpKTtcbiAgfVxuXG4gIHB1YmxpYyBtb3VudENvbXBvbmVudChDb21wb25lbnRDbGFzczogQ29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95KGNvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IChDb21wb25lbnRDbGFzcyBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmICghdGVtcGxhdGUpIHJldHVybjtcblxuICAgIGNvbnN0IG5vZGVzID0gbmV3IFRlbXBsYXRlUGFyc2VyKCkucGFyc2UodGVtcGxhdGUpO1xuICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChob3N0KTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRDbGFzcyh7IGFyZ3M6IHsgcGFyYW1zOiBwYXJhbXMgfSwgcmVmOiBob3N0LCB0cmFuc3BpbGVyOiB0aGlzIH0pO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoY29tcG9uZW50KTtcbiAgICAoaG9zdCBhcyBhbnkpLiRrYXNwZXJJbnN0YW5jZSA9IGNvbXBvbmVudDtcblxuICAgIGNvbnN0IGNvbXBvbmVudE5vZGVzID0gbm9kZXM7XG4gICAgY29tcG9uZW50LiRyZW5kZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGVzdHJveShob3N0KTtcbiAgICAgICAgaG9zdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBjb25zdCBzY29wZSA9IG5ldyBTY29wZShudWxsLCBjb21wb25lbnQpO1xuICAgICAgICBzY29wZS5zZXQoXCIkaW5zdGFuY2VcIiwgY29tcG9uZW50KTtcbiAgICAgICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgXG4gICAgICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVTaWJsaW5ncyhjb21wb25lbnROb2RlcywgaG9zdCk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHByZXY7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmlzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uTW91bnQgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uTW91bnQoKTtcblxuICAgIGNvbnN0IHNjb3BlID0gbmV3IFNjb3BlKG51bGwsIGNvbXBvbmVudCk7XG4gICAgc2NvcGUuc2V0KFwiJGluc3RhbmNlXCIsIGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJldiA9IHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGU7XG4gICAgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgIFxuICAgIGZsdXNoU3luYygoKSA9PiB7XG4gICAgICB0aGlzLmNyZWF0ZVNpYmxpbmdzKG5vZGVzLCBob3N0KTtcbiAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIGNvbXBvbmVudC5vblJlbmRlcigpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2O1xuXG4gICAgaWYgKHR5cGVvZiBjb21wb25lbnQub25SZW5kZXIgPT09IFwiZnVuY3Rpb25cIikgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZXh0cmFjdFJvdXRlcyhjaGlsZHJlbjogS05vZGUuS05vZGVbXSwgcGFyZW50R3VhcmQ/OiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+LCBzY29wZT86IFNjb3BlKTogUm91dGVDb25maWdbXSB7XG4gICAgY29uc3Qgcm91dGVzOiBSb3V0ZUNvbmZpZ1tdID0gW107XG4gICAgY29uc3QgcHJldlNjb3BlID0gc2NvcGUgPyB0aGlzLmludGVycHJldGVyLnNjb3BlIDogdW5kZWZpbmVkO1xuICAgIGlmIChzY29wZSkgdGhpcy5pbnRlcnByZXRlci5zY29wZSA9IHNjb3BlO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC50eXBlICE9PSBcImVsZW1lbnRcIikgY29udGludWU7XG4gICAgICBjb25zdCBlbCA9IGNoaWxkIGFzIEtOb2RlLkVsZW1lbnQ7XG4gICAgICBpZiAoZWwubmFtZSA9PT0gXCJyb3V0ZVwiKSB7XG4gICAgICAgIGNvbnN0IHBhdGhBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQHBhdGhcIl0pO1xuICAgICAgICBjb25zdCBjb21wb25lbnRBdHRyID0gdGhpcy5maW5kQXR0cihlbCwgW1wiQGNvbXBvbmVudFwiXSk7XG4gICAgICAgIGNvbnN0IGd1YXJkQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBndWFyZFwiXSk7XG5cbiAgICAgICAgaWYgKCFwYXRoQXR0ciB8fCAhY29tcG9uZW50QXR0cikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoS0Vycm9yQ29kZS5NSVNTSU5HX1JFUVVJUkVEX0FUVFIsIHsgbWVzc2FnZTogXCI8cm91dGU+IHJlcXVpcmVzIEBwYXRoIGFuZCBAY29tcG9uZW50IGF0dHJpYnV0ZXMuXCIgfSwgZWwubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRoID0gcGF0aEF0dHIhLnZhbHVlO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmV4ZWN1dGUoY29tcG9uZW50QXR0ciEudmFsdWUpO1xuICAgICAgICBjb25zdCBndWFyZCA9IGd1YXJkQXR0ciA/IHRoaXMuZXhlY3V0ZShndWFyZEF0dHIudmFsdWUpIDogcGFyZW50R3VhcmQ7XG4gICAgICAgIHJvdXRlcy5wdXNoKHsgcGF0aDogcGF0aCwgY29tcG9uZW50OiBjb21wb25lbnQsIGd1YXJkOiBndWFyZCB9KTtcbiAgICAgIH0gZWxzZSBpZiAoZWwubmFtZSA9PT0gXCJndWFyZFwiKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrQXR0ciA9IHRoaXMuZmluZEF0dHIoZWwsIFtcIkBjaGVja1wiXSk7XG4gICAgICAgIGlmICghY2hlY2tBdHRyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihLRXJyb3JDb2RlLk1JU1NJTkdfUkVRVUlSRURfQVRUUiwgeyBtZXNzYWdlOiBcIjxndWFyZD4gcmVxdWlyZXMgQGNoZWNrIGF0dHJpYnV0ZS5cIiB9LCBlbC5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hlY2tBdHRyKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY2hlY2sgPSB0aGlzLmV4ZWN1dGUoY2hlY2tBdHRyLnZhbHVlKTtcbiAgICAgICAgcm91dGVzLnB1c2goLi4udGhpcy5leHRyYWN0Um91dGVzKGVsLmNoaWxkcmVuLCBjaGVjaykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2NvcGUpIHRoaXMuaW50ZXJwcmV0ZXIuc2NvcGUgPSBwcmV2U2NvcGU7XG4gICAgcmV0dXJuIHJvdXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclJlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JlbmRlcmluZykgcmV0dXJuO1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnRlcnByZXRlci5zY29wZS5nZXQoXCIkaW5zdGFuY2VcIik7XG4gICAgaWYgKGluc3RhbmNlICYmIHR5cGVvZiBpbnN0YW5jZS5vblJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2aXNpdERvY3R5cGVLTm9kZShfbm9kZTogS05vZGUuRG9jdHlwZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnRUeXBlKFwiaHRtbFwiLCBcIlwiLCBcIlwiKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihjb2RlOiBLRXJyb3JDb2RlVHlwZSwgYXJnczogYW55LCB0YWdOYW1lPzogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGZpbmFsQXJncyA9IGFyZ3M7XG4gICAgaWYgKHR5cGVvZiBhcmdzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25zdCBjbGVhbk1lc3NhZ2UgPSBhcmdzLmluY2x1ZGVzKFwiUnVudGltZSBFcnJvclwiKVxuICAgICAgICA/IGFyZ3MucmVwbGFjZShcIlJ1bnRpbWUgRXJyb3I6IFwiLCBcIlwiKVxuICAgICAgICA6IGFyZ3M7XG4gICAgICBmaW5hbEFyZ3MgPSB7IG1lc3NhZ2U6IGNsZWFuTWVzc2FnZSB9O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihjb2RlLCBmaW5hbEFyZ3MsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0YWdOYW1lKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnRSZWdpc3RyeSB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBLYXNwZXJFcnJvciwgS0Vycm9yQ29kZSB9IGZyb20gXCIuL3R5cGVzL2Vycm9yXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIHRyeSB7XG4gICAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwaWxlKFxuICBzb3VyY2U6IHN0cmluZyxcbiAgZW50aXR5PzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgY29udGFpbmVyPzogSFRNTEVsZW1lbnQsXG4gIHJlZ2lzdHJ5PzogQ29tcG9uZW50UmVnaXN0cnlcbik6IE5vZGUge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IHx8IHt9IH0pO1xuICBjb25zdCByZXN1bHQgPSB0cmFuc3BpbGVyLnRyYW5zcGlsZShub2RlcywgZW50aXR5IHx8IHt9LCBjb250YWluZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBLYXNwZXIoQ29tcG9uZW50Q2xhc3M6IGFueSkge1xuICBib290c3RyYXAoe1xuICAgIHJvb3Q6IFwia2FzcGVyLWFwcFwiLFxuICAgIGVudHJ5OiBcImthc3Blci1yb290XCIsXG4gICAgcmVnaXN0cnk6IHtcbiAgICAgIFwia2FzcGVyLXJvb3RcIjoge1xuICAgICAgICBzZWxlY3RvcjogXCJ0ZW1wbGF0ZVwiLFxuICAgICAgICBjb21wb25lbnQ6IENvbXBvbmVudENsYXNzLFxuICAgICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2FzcGVyQ29uZmlnIHtcbiAgcm9vdD86IHN0cmluZyB8IEhUTUxFbGVtZW50O1xuICBlbnRyeT86IHN0cmluZztcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5O1xuICBtb2RlPzogXCJkZXZlbG9wbWVudFwiIHwgXCJwcm9kdWN0aW9uXCI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChcbiAgdHJhbnNwaWxlcjogVHJhbnNwaWxlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHJlZ2lzdHJ5OiBDb21wb25lbnRSZWdpc3RyeVxuKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZWdpc3RyeVt0YWddLmNvbXBvbmVudCh7XG4gICAgcmVmOiBlbGVtZW50LFxuICAgIHRyYW5zcGlsZXI6IHRyYW5zcGlsZXIsXG4gICAgYXJnczoge30sXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZTogZWxlbWVudCxcbiAgICBpbnN0YW5jZTogY29tcG9uZW50LFxuICAgIG5vZGVzOiByZWdpc3RyeVt0YWddLm5vZGVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZWdpc3RyeShcbiAgcmVnaXN0cnk6IENvbXBvbmVudFJlZ2lzdHJ5LFxuICBwYXJzZXI6IFRlbXBsYXRlUGFyc2VyXG4pIHtcbiAgY29uc3QgcmVzdWx0ID0geyAuLi5yZWdpc3RyeSB9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWdpc3RyeSkpIHtcbiAgICBjb25zdCBlbnRyeSA9IHJlZ2lzdHJ5W2tleV07XG4gICAgaWYgKCFlbnRyeS5ub2RlcykgZW50cnkubm9kZXMgPSBbXTtcbiAgICBpZiAoZW50cnkubm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChlbnRyeS5zZWxlY3Rvcikge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVudHJ5LnNlbGVjdG9yKTtcbiAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICBlbnRyeS50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICBlbnRyeS5ub2RlcyA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZS5pbm5lckhUTUwpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbnRyeS50ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2UoZW50cnkudGVtcGxhdGUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHN0YXRpY1RlbXBsYXRlID0gKGVudHJ5LmNvbXBvbmVudCBhcyBhbnkpLnRlbXBsYXRlO1xuICAgIGlmIChzdGF0aWNUZW1wbGF0ZSkge1xuICAgICAgZW50cnkubm9kZXMgPSBwYXJzZXIucGFyc2Uoc3RhdGljVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbmZpZzogS2FzcGVyQ29uZmlnKSB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuICBjb25zdCByb290ID1cbiAgICB0eXBlb2YgY29uZmlnLnJvb3QgPT09IFwic3RyaW5nXCJcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcucm9vdClcbiAgICAgIDogY29uZmlnLnJvb3Q7XG5cbiAgaWYgKCFyb290KSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKFxuICAgICAgS0Vycm9yQ29kZS5ST09UX0VMRU1FTlRfTk9UX0ZPVU5ELFxuICAgICAgeyByb290OiBjb25maWcucm9vdCB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGVudHJ5VGFnID0gY29uZmlnLmVudHJ5IHx8IFwia2FzcGVyLWFwcFwiO1xuICBpZiAoIWNvbmZpZy5yZWdpc3RyeVtlbnRyeVRhZ10pIHtcbiAgICB0aHJvdyBuZXcgS2FzcGVyRXJyb3IoXG4gICAgICBLRXJyb3JDb2RlLkVOVFJZX0NPTVBPTkVOVF9OT1RfRk9VTkQsXG4gICAgICB7IHRhZzogZW50cnlUYWcgfVxuICAgICk7XG4gIH1cblxuICBjb25zdCByZWdpc3RyeSA9IG5vcm1hbGl6ZVJlZ2lzdHJ5KGNvbmZpZy5yZWdpc3RyeSwgcGFyc2VyKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKHsgcmVnaXN0cnk6IHJlZ2lzdHJ5IH0pO1xuICBcbiAgLy8gU2V0IHRoZSBlbnZpcm9ubWVudCBtb2RlIG9uIHRoZSB0cmFuc3BpbGVyIG9yIGdsb2JhbGx5XG4gIGlmIChjb25maWcubW9kZSkge1xuICAgICh0cmFuc3BpbGVyIGFzIGFueSkubW9kZSA9IGNvbmZpZy5tb2RlO1xuICB9IGVsc2Uge1xuICAgIC8vIERlZmF1bHQgdG8gZGV2ZWxvcG1lbnQgaWYgbm90IHNwZWNpZmllZFxuICAgICh0cmFuc3BpbGVyIGFzIGFueSkubW9kZSA9IFwiZGV2ZWxvcG1lbnRcIjtcbiAgfVxuXG4gIGNvbnN0IHsgbm9kZSwgaW5zdGFuY2UsIG5vZGVzIH0gPSBjcmVhdGVDb21wb25lbnQoXG4gICAgdHJhbnNwaWxlcixcbiAgICBlbnRyeVRhZyxcbiAgICByZWdpc3RyeVxuICApO1xuXG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cblxuICAvLyBJbml0aWFsIHJlbmRlciBhbmQgbGlmZWN5Y2xlXG4gIGlmICh0eXBlb2YgaW5zdGFuY2Uub25Nb3VudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaW5zdGFuY2Uub25Nb3VudCgpO1xuICB9XG5cbiAgdHJhbnNwaWxlci50cmFuc3BpbGUobm9kZXMsIGluc3RhbmNlLCBub2RlIGFzIEhUTUxFbGVtZW50KTtcblxuICBpZiAodHlwZW9mIGluc3RhbmNlLm9uUmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBpbnN0YW5jZS5vblJlbmRlcigpO1xuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuIl0sIm5hbWVzIjpbInJhd0VmZmVjdCIsInJhd0NvbXB1dGVkIiwiU2V0IiwiVG9rZW5UeXBlIiwiRXhwci5FYWNoIiwiRXhwci5WYXJpYWJsZSIsIkV4cHIuQmluYXJ5IiwiRXhwci5Bc3NpZ24iLCJFeHByLkdldCIsIkV4cHIuU2V0IiwiRXhwci5QaXBlbGluZSIsIkV4cHIuVGVybmFyeSIsIkV4cHIuTnVsbENvYWxlc2NpbmciLCJFeHByLkxvZ2ljYWwiLCJFeHByLlR5cGVvZiIsIkV4cHIuVW5hcnkiLCJFeHByLkNhbGwiLCJFeHByLk5ldyIsIkV4cHIuUG9zdGZpeCIsIkV4cHIuU3ByZWFkIiwiRXhwci5LZXkiLCJFeHByLkxpdGVyYWwiLCJFeHByLlRlbXBsYXRlIiwiRXhwci5BcnJvd0Z1bmN0aW9uIiwiRXhwci5Hcm91cGluZyIsIkV4cHIuVm9pZCIsIkV4cHIuRGVidWciLCJFeHByLkRpY3Rpb25hcnkiLCJFeHByLkxpc3QiLCJVdGlscy5pc0RpZ2l0IiwiVXRpbHMuaXNBbHBoYU51bWVyaWMiLCJVdGlscy5jYXBpdGFsaXplIiwiVXRpbHMuaXNLZXl3b3JkIiwiVXRpbHMuaXNBbHBoYSIsIlBhcnNlciIsIkNvbW1lbnQiLCJOb2RlLkNvbW1lbnQiLCJOb2RlLkRvY3R5cGUiLCJOb2RlLkVsZW1lbnQiLCJOb2RlLkF0dHJpYnV0ZSIsIk5vZGUuVGV4dCIsIkNvbXBvbmVudENsYXNzIiwic2NvcGUiLCJwcmV2Il0sIm1hcHBpbmdzIjoiQUFBTyxNQUFNLGFBQWE7QUFBQTtBQUFBLEVBRXhCLHdCQUF3QjtBQUFBLEVBQ3hCLDJCQUEyQjtBQUFBO0FBQUEsRUFHM0Isc0JBQXNCO0FBQUEsRUFDdEIscUJBQXFCO0FBQUEsRUFDckIsc0JBQXNCO0FBQUE7QUFBQSxFQUd0QixnQkFBZ0I7QUFBQSxFQUNoQix3QkFBd0I7QUFBQSxFQUN4QixtQkFBbUI7QUFBQSxFQUNuQiwwQkFBMEI7QUFBQSxFQUMxQixzQkFBc0I7QUFBQSxFQUN0QixzQkFBc0I7QUFBQSxFQUN0Qix1QkFBdUI7QUFBQSxFQUN2QixjQUFjO0FBQUEsRUFDZCxnQ0FBZ0M7QUFBQTtBQUFBLEVBR2hDLGtCQUFrQjtBQUFBLEVBQ2xCLGdCQUFnQjtBQUFBLEVBQ2hCLHFCQUFxQjtBQUFBLEVBQ3JCLHdCQUF3QjtBQUFBO0FBQUEsRUFHeEIsd0JBQXdCO0FBQUEsRUFDeEIseUJBQXlCO0FBQUEsRUFDekIsdUJBQXVCO0FBQUEsRUFDdkIsd0JBQXdCO0FBQUEsRUFDeEIsZ0JBQWdCO0FBQUEsRUFDaEIsYUFBYTtBQUFBO0FBQUEsRUFHYixtQkFBbUI7QUFBQTtBQUFBLEVBR25CLGVBQWU7QUFBQSxFQUNmLHVCQUF1QjtBQUN6QjtBQUlPLE1BQU0saUJBQXdEO0FBQUEsRUFDbkUsVUFBVSxDQUFDLE1BQU0sMkJBQTJCLEVBQUUsSUFBSTtBQUFBLEVBQ2xELFVBQVUsQ0FBQyxNQUFNLG9CQUFvQixFQUFFLEdBQUc7QUFBQSxFQUUxQyxVQUFVLE1BQU07QUFBQSxFQUNoQixVQUFVLENBQUMsTUFBTSwwQ0FBMEMsRUFBRSxLQUFLO0FBQUEsRUFDbEUsVUFBVSxDQUFDLE1BQU0seUJBQXlCLEVBQUUsSUFBSTtBQUFBLEVBRWhELFVBQVUsQ0FBQyxNQUFNLDJCQUEyQixFQUFFLFFBQVE7QUFBQSxFQUN0RCxVQUFVLE1BQU07QUFBQSxFQUNoQixVQUFVLE1BQU07QUFBQSxFQUNoQixVQUFVLE1BQU07QUFBQSxFQUNoQixVQUFVLENBQUMsTUFBTSxjQUFjLEVBQUUsSUFBSTtBQUFBLEVBQ3JDLFVBQVUsTUFBTTtBQUFBLEVBQ2hCLFVBQVUsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJO0FBQUEsRUFDM0IsVUFBVSxNQUFNO0FBQUEsRUFDaEIsVUFBVSxNQUFNO0FBQUEsRUFFaEIsVUFBVSxDQUFDLE1BQU0sR0FBRyxFQUFFLE9BQU8sdUJBQXVCLEVBQUUsS0FBSztBQUFBLEVBQzNELFVBQVUsTUFBTTtBQUFBLEVBQ2hCLFVBQVUsQ0FBQyxNQUFNLDBDQUEwQyxFQUFFLEtBQUs7QUFBQSxFQUNsRSxVQUFVLENBQUMsTUFBTSxvRkFBb0YsRUFBRSxLQUFLO0FBQUEsRUFFNUcsVUFBVSxDQUFDLE1BQU0sZ0RBQWdELEVBQUUsTUFBTTtBQUFBLEVBQ3pFLFVBQVUsQ0FBQyxNQUFNLDJCQUEyQixFQUFFLFFBQVE7QUFBQSxFQUN0RCxVQUFVLENBQUMsTUFBTSwyREFBMkQsRUFBRSxLQUFLO0FBQUEsRUFDbkYsVUFBVSxDQUFDLE1BQU0sMEJBQTBCLEVBQUUsUUFBUTtBQUFBLEVBQ3JELFVBQVUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxNQUFNO0FBQUEsRUFDNUIsVUFBVSxDQUFDLE1BQU0sSUFBSSxFQUFFLEtBQUs7QUFBQSxFQUU1QixVQUFVLE1BQU07QUFBQSxFQUVoQixVQUFVLENBQUMsTUFBTSxFQUFFO0FBQUEsRUFDbkIsVUFBVSxDQUFDLE1BQU0sRUFBRTtBQUNyQjtBQUVPLE1BQU0sb0JBQW9CLE1BQU07QUFBQSxFQUNyQyxZQUNTLE1BQ0EsT0FBWSxDQUFBLEdBQ1osTUFDQSxLQUNBLFNBQ1A7QUFFQSxVQUFNLFFBQ0osT0FBTyxZQUFZLGNBQ2YsUUFBUSxJQUFJLGFBQWEsZUFDeEI7QUFFUCxVQUFNLFdBQVcsZUFBZSxJQUFJO0FBQ3BDLFVBQU0sVUFBVSxXQUNaLFNBQVMsSUFBSSxJQUNaLE9BQU8sU0FBUyxXQUFXLE9BQU87QUFFdkMsVUFBTSxXQUFXLFNBQVMsU0FBWSxLQUFLLElBQUksSUFBSSxHQUFHLE1BQU07QUFDNUQsVUFBTSxVQUFVLFVBQVU7QUFBQSxRQUFXLE9BQU8sTUFBTTtBQUNsRCxVQUFNLE9BQU8sUUFDVDtBQUFBO0FBQUEsNkNBQWtELEtBQUssY0FBYyxRQUFRLEtBQUssRUFBRSxDQUFDLEtBQ3JGO0FBRUosVUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLEdBQUcsUUFBUSxHQUFHLE9BQU8sR0FBRyxJQUFJLEVBQUU7QUF2QmpELFNBQUEsT0FBQTtBQUNBLFNBQUEsT0FBQTtBQUNBLFNBQUEsT0FBQTtBQUNBLFNBQUEsTUFBQTtBQUNBLFNBQUEsVUFBQTtBQW9CUCxTQUFLLE9BQU87QUFBQSxFQUNkO0FBQ0Y7QUN6R0EsSUFBSSxlQUF3RDtBQUM1RCxNQUFNLGNBQXFCLENBQUE7QUFFM0IsSUFBSSxXQUFXO0FBQ2YsTUFBTSx5Q0FBeUIsSUFBQTtBQUMvQixNQUFNLGtCQUFxQyxDQUFBO0FBUXBDLE1BQU0sT0FBVTtBQUFBLEVBS3JCLFlBQVksY0FBaUI7QUFIN0IsU0FBUSxrQ0FBa0IsSUFBQTtBQUMxQixTQUFRLCtCQUFlLElBQUE7QUFHckIsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQSxFQUVBLElBQUksUUFBVztBQUNiLFFBQUksY0FBYztBQUNoQixXQUFLLFlBQVksSUFBSSxhQUFhLEVBQUU7QUFDcEMsbUJBQWEsS0FBSyxJQUFJLElBQUk7QUFBQSxJQUM1QjtBQUNBLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQUVBLElBQUksTUFBTSxVQUFhO0FBQ3JCLFFBQUksS0FBSyxXQUFXLFVBQVU7QUFDNUIsWUFBTSxXQUFXLEtBQUs7QUFDdEIsV0FBSyxTQUFTO0FBQ2QsVUFBSSxVQUFVO0FBQ1osbUJBQVcsT0FBTyxLQUFLLFlBQWEsb0JBQW1CLElBQUksR0FBRztBQUM5RCxtQkFBVyxXQUFXLEtBQUssU0FBVSxpQkFBZ0IsS0FBSyxNQUFNLFFBQVEsVUFBVSxRQUFRLENBQUM7QUFBQSxNQUM3RixPQUFPO0FBQ0wsY0FBTSxPQUFPLE1BQU0sS0FBSyxLQUFLLFdBQVc7QUFDeEMsbUJBQVcsT0FBTyxNQUFNO0FBQ3RCLGNBQUE7QUFBQSxRQUNGO0FBQ0EsbUJBQVcsV0FBVyxLQUFLLFVBQVU7QUFDbkMsY0FBSTtBQUFFLG9CQUFRLFVBQVUsUUFBUTtBQUFBLFVBQUcsU0FBUyxHQUFHO0FBQUUsb0JBQVEsTUFBTSxrQkFBa0IsQ0FBQztBQUFBLFVBQUc7QUFBQSxRQUN2RjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUyxJQUFnQixTQUFxQztBRHJEekQ7QUNzREgsU0FBSSx3Q0FBUyxXQUFULG1CQUFpQixRQUFTLFFBQU8sTUFBTTtBQUFBLElBQUM7QUFDNUMsU0FBSyxTQUFTLElBQUksRUFBRTtBQUNwQixVQUFNLE9BQU8sTUFBTSxLQUFLLFNBQVMsT0FBTyxFQUFFO0FBQzFDLFFBQUksbUNBQVMsUUFBUTtBQUNuQixjQUFRLE9BQU8saUJBQWlCLFNBQVMsTUFBTSxFQUFFLE1BQU0sTUFBTTtBQUFBLElBQy9EO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFlBQVksSUFBYztBQUN4QixTQUFLLFlBQVksT0FBTyxFQUFFO0FBQUEsRUFDNUI7QUFBQSxFQUVBLFdBQVc7QUFBRSxXQUFPLE9BQU8sS0FBSyxLQUFLO0FBQUEsRUFBRztBQUFBLEVBQ3hDLE9BQU87QUFBRSxXQUFPLEtBQUs7QUFBQSxFQUFRO0FBQy9CO0FBRUEsTUFBTSx1QkFBMEIsT0FBVTtBQUFBLEVBSXhDLFlBQVksSUFBYSxTQUF5QjtBQUNoRCxVQUFNLE1BQWdCO0FBSHhCLFNBQVEsWUFBWTtBQUlsQixTQUFLLEtBQUs7QUFFVixVQUFNLE9BQU8sT0FBTyxNQUFNO0FBQ3hCLFVBQUksS0FBSyxXQUFXO0FBQ2xCLGNBQU0sSUFBSSxZQUFZLFdBQVcsaUJBQWlCO0FBQUEsTUFDcEQ7QUFFQSxXQUFLLFlBQVk7QUFDakIsVUFBSTtBQUVGLGNBQU0sUUFBUSxLQUFLLEdBQUE7QUFBQSxNQUNyQixVQUFBO0FBQ0UsYUFBSyxZQUFZO0FBQUEsTUFDbkI7QUFBQSxJQUNGLEdBQUcsT0FBTztBQUVWLFFBQUksbUNBQVMsUUFBUTtBQUNuQixjQUFRLE9BQU8saUJBQWlCLFNBQVMsTUFBTSxFQUFFLE1BQU0sTUFBTTtBQUFBLElBQy9EO0FBQUEsRUFDRjtBQUFBLEVBRUEsSUFBSSxRQUFXO0FBQ2IsV0FBTyxNQUFNO0FBQUEsRUFDZjtBQUFBLEVBRUEsSUFBSSxNQUFNLElBQU87QUFBQSxFQUVqQjtBQUNGO0FBRU8sU0FBUyxPQUFPLElBQWMsU0FBeUI7QUQzR3ZEO0FDNEdMLE9BQUksd0NBQVMsV0FBVCxtQkFBaUIsUUFBUyxRQUFPLE1BQU07QUFBQSxFQUFDO0FBQzVDLFFBQU0sWUFBWTtBQUFBLElBQ2hCLElBQUksTUFBTTtBQUNSLGdCQUFVLEtBQUssUUFBUSxDQUFBLFFBQU8sSUFBSSxZQUFZLFVBQVUsRUFBRSxDQUFDO0FBQzNELGdCQUFVLEtBQUssTUFBQTtBQUVmLGtCQUFZLEtBQUssU0FBUztBQUMxQixxQkFBZTtBQUNmLFVBQUk7QUFDRixXQUFBO0FBQUEsTUFDRixVQUFBO0FBQ0Usb0JBQVksSUFBQTtBQUNaLHVCQUFlLFlBQVksWUFBWSxTQUFTLENBQUMsS0FBSztBQUFBLE1BQ3hEO0FBQUEsSUFDRjtBQUFBLElBQ0EsMEJBQVUsSUFBQTtBQUFBLEVBQWlCO0FBRzdCLFlBQVUsR0FBQTtBQUNWLFFBQU0sT0FBWSxNQUFNO0FBQ3RCLGNBQVUsS0FBSyxRQUFRLENBQUEsUUFBTyxJQUFJLFlBQVksVUFBVSxFQUFFLENBQUM7QUFDM0QsY0FBVSxLQUFLLE1BQUE7QUFBQSxFQUNqQjtBQUNBLE9BQUssTUFBTSxVQUFVO0FBRXJCLE1BQUksbUNBQVMsUUFBUTtBQUNuQixZQUFRLE9BQU8saUJBQWlCLFNBQVMsTUFBTSxFQUFFLE1BQU0sTUFBTTtBQUFBLEVBQy9EO0FBRUEsU0FBTztBQUNUO0FBRU8sU0FBUyxPQUFVLGNBQTRCO0FBQ3BELFNBQU8sSUFBSSxPQUFPLFlBQVk7QUFDaEM7QUFLTyxTQUFTLE1BQVMsS0FBZ0IsSUFBZ0IsU0FBcUM7QUFDNUYsU0FBTyxJQUFJLFNBQVMsSUFBSSxPQUFPO0FBQ2pDO0FBRU8sU0FBUyxNQUFNLElBQXNCO0FBQzFDLGFBQVc7QUFDWCxNQUFJO0FBQ0YsT0FBQTtBQUFBLEVBQ0YsVUFBQTtBQUNFLGVBQVc7QUFDWCxVQUFNLE9BQU8sTUFBTSxLQUFLLGtCQUFrQjtBQUMxQyx1QkFBbUIsTUFBQTtBQUNuQixVQUFNLFdBQVcsZ0JBQWdCLE9BQU8sQ0FBQztBQUN6QyxlQUFXLE9BQU8sTUFBTTtBQUN0QixVQUFBO0FBQUEsSUFDRjtBQUNBLGVBQVcsV0FBVyxVQUFVO0FBQzlCLFVBQUk7QUFBRSxnQkFBQTtBQUFBLE1BQVcsU0FBUyxHQUFHO0FBQUUsZ0JBQVEsTUFBTSxrQkFBa0IsQ0FBQztBQUFBLE1BQUc7QUFBQSxJQUNyRTtBQUFBLEVBQ0Y7QUFDRjtBQUVPLFNBQVMsU0FBWSxJQUFhLFNBQW9DO0FBQzNFLFNBQU8sSUFBSSxlQUFlLElBQUksT0FBTztBQUN2QztBQy9KTyxNQUFNLFVBQW1FO0FBQUEsRUFROUUsWUFBWSxPQUE4QjtBQU4xQyxTQUFBLE9BQWMsQ0FBQTtBQUdkLFNBQUEsbUJBQW1CLElBQUksZ0JBQUE7QUFJckIsUUFBSSxDQUFDLE9BQU87QUFDVixXQUFLLE9BQU8sQ0FBQTtBQUNaO0FBQUEsSUFDRjtBQUNBLFFBQUksTUFBTSxNQUFNO0FBQ2QsV0FBSyxPQUFPLE1BQU07QUFBQSxJQUNwQjtBQUNBLFFBQUksTUFBTSxLQUFLO0FBQ2IsV0FBSyxNQUFNLE1BQU07QUFBQSxJQUNuQjtBQUNBLFFBQUksTUFBTSxZQUFZO0FBQ3BCLFdBQUssYUFBYSxNQUFNO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLE9BQU8sSUFBc0I7QUFDM0JBLFdBQVUsSUFBSSxFQUFFLFFBQVEsS0FBSyxpQkFBaUIsUUFBUTtBQUFBLEVBQ3hEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLE1BQVMsS0FBZ0IsSUFBc0I7QUFDN0MsUUFBSSxTQUFTLElBQUksRUFBRSxRQUFRLEtBQUssaUJBQWlCLFFBQVE7QUFBQSxFQUMzRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNQSxTQUFZLElBQXdCO0FBQ2xDLFdBQU9DLFNBQVksSUFBSSxFQUFFLFFBQVEsS0FBSyxpQkFBaUIsUUFBUTtBQUFBLEVBQ2pFO0FBQUEsRUFFQSxVQUFVO0FBQUEsRUFBRTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQUU7QUFBQSxFQUNiLFlBQVk7QUFBQSxFQUFFO0FBQUEsRUFDZCxZQUFZO0FBQUEsRUFBRTtBQUFBLEVBRWQsU0FBUztBRmpFSjtBRWtFSCxlQUFLLFlBQUw7QUFBQSxFQUNGO0FBQ0Y7QUNsRU8sTUFBZSxLQUFLO0FBQUE7QUFBQSxFQUl6QixjQUFjO0FBQUEsRUFBRTtBQUVsQjtBQStCTyxNQUFNLHNCQUFzQixLQUFLO0FBQUEsRUFJcEMsWUFBWSxRQUFpQixNQUFZLE1BQWM7QUFDbkQsVUFBQTtBQUNBLFNBQUssU0FBUztBQUNkLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSx1QkFBdUIsSUFBSTtBQUFBLEVBQzlDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxlQUFlLEtBQUs7QUFBQSxFQUk3QixZQUFZLE1BQWEsT0FBYSxNQUFjO0FBQ2hELFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsZ0JBQWdCLElBQUk7QUFBQSxFQUN2QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sZUFBZSxLQUFLO0FBQUEsRUFLN0IsWUFBWSxNQUFZLFVBQWlCLE9BQWEsTUFBYztBQUNoRSxVQUFBO0FBQ0EsU0FBSyxPQUFPO0FBQ1osU0FBSyxXQUFXO0FBQ2hCLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxnQkFBZ0IsSUFBSTtBQUFBLEVBQ3ZDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxhQUFhLEtBQUs7QUFBQSxFQU0zQixZQUFZLFFBQWMsT0FBYyxNQUFjLE1BQWMsV0FBVyxPQUFPO0FBQ2xGLFVBQUE7QUFDQSxTQUFLLFNBQVM7QUFDZCxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFDWixTQUFLLFdBQVc7QUFBQSxFQUNwQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGNBQWMsS0FBSztBQUFBLEVBRzVCLFlBQVksT0FBYSxNQUFjO0FBQ25DLFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsZUFBZSxJQUFJO0FBQUEsRUFDdEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLG1CQUFtQixLQUFLO0FBQUEsRUFHakMsWUFBWSxZQUFvQixNQUFjO0FBQzFDLFVBQUE7QUFDQSxTQUFLLGFBQWE7QUFDbEIsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLG9CQUFvQixJQUFJO0FBQUEsRUFDM0M7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGFBQWEsS0FBSztBQUFBLEVBSzNCLFlBQVksTUFBYSxLQUFZLFVBQWdCLE1BQWM7QUFDL0QsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssTUFBTTtBQUNYLFNBQUssV0FBVztBQUNoQixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLFlBQVksS0FBSztBQUFBLEVBSzFCLFlBQVksUUFBYyxLQUFXLE1BQWlCLE1BQWM7QUFDaEUsVUFBQTtBQUNBLFNBQUssU0FBUztBQUNkLFNBQUssTUFBTTtBQUNYLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxFQUNwQztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0saUJBQWlCLEtBQUs7QUFBQSxFQUcvQixZQUFZLFlBQWtCLE1BQWM7QUFDeEMsVUFBQTtBQUNBLFNBQUssYUFBYTtBQUNsQixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsa0JBQWtCLElBQUk7QUFBQSxFQUN6QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sWUFBWSxLQUFLO0FBQUEsRUFHMUIsWUFBWSxNQUFhLE1BQWM7QUFDbkMsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxhQUFhLElBQUk7QUFBQSxFQUNwQztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sZ0JBQWdCLEtBQUs7QUFBQSxFQUs5QixZQUFZLE1BQVksVUFBaUIsT0FBYSxNQUFjO0FBQ2hFLFVBQUE7QUFDQSxTQUFLLE9BQU87QUFDWixTQUFLLFdBQVc7QUFDaEIsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGlCQUFpQixJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGFBQWEsS0FBSztBQUFBLEVBRzNCLFlBQVksT0FBZSxNQUFjO0FBQ3JDLFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsY0FBYyxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGdCQUFnQixLQUFLO0FBQUEsRUFHOUIsWUFBWSxPQUFZLE1BQWM7QUFDbEMsVUFBQTtBQUNBLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxpQkFBaUIsSUFBSTtBQUFBLEVBQ3hDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxZQUFZLEtBQUs7QUFBQSxFQUkxQixZQUFZLE9BQWEsTUFBYyxNQUFjO0FBQ2pELFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsYUFBYSxJQUFJO0FBQUEsRUFDcEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLHVCQUF1QixLQUFLO0FBQUEsRUFJckMsWUFBWSxNQUFZLE9BQWEsTUFBYztBQUMvQyxVQUFBO0FBQ0EsU0FBSyxPQUFPO0FBQ1osU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLHdCQUF3QixJQUFJO0FBQUEsRUFDL0M7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGdCQUFnQixLQUFLO0FBQUEsRUFJOUIsWUFBWSxRQUFjLFdBQW1CLE1BQWM7QUFDdkQsVUFBQTtBQUNBLFNBQUssU0FBUztBQUNkLFNBQUssWUFBWTtBQUNqQixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsaUJBQWlCLElBQUk7QUFBQSxFQUN4QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtZQUVPLE1BQU1DLGFBQVksS0FBSztBQUFBLEVBSzFCLFlBQVksUUFBYyxLQUFXLE9BQWEsTUFBYztBQUM1RCxVQUFBO0FBQ0EsU0FBSyxTQUFTO0FBQ2QsU0FBSyxNQUFNO0FBQ1gsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGFBQWEsSUFBSTtBQUFBLEVBQ3BDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxpQkFBaUIsS0FBSztBQUFBLEVBSS9CLFlBQVksTUFBWSxPQUFhLE1BQWM7QUFDL0MsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxrQkFBa0IsSUFBSTtBQUFBLEVBQ3pDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxlQUFlLEtBQUs7QUFBQSxFQUc3QixZQUFZLE9BQWEsTUFBYztBQUNuQyxVQUFBO0FBQ0EsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGdCQUFnQixJQUFJO0FBQUEsRUFDdkM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGlCQUFpQixLQUFLO0FBQUEsRUFHL0IsWUFBWSxPQUFlLE1BQWM7QUFDckMsVUFBQTtBQUNBLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxrQkFBa0IsSUFBSTtBQUFBLEVBQ3pDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxnQkFBZ0IsS0FBSztBQUFBLEVBSzlCLFlBQVksV0FBaUIsVUFBZ0IsVUFBZ0IsTUFBYztBQUN2RSxVQUFBO0FBQ0EsU0FBSyxZQUFZO0FBQ2pCLFNBQUssV0FBVztBQUNoQixTQUFLLFdBQVc7QUFDaEIsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGlCQUFpQixJQUFJO0FBQUEsRUFDeEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGVBQWUsS0FBSztBQUFBLEVBRzdCLFlBQVksT0FBYSxNQUFjO0FBQ25DLFVBQUE7QUFDQSxTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsZ0JBQWdCLElBQUk7QUFBQSxFQUN2QztBQUFBLEVBRU8sV0FBbUI7QUFDdEIsV0FBTztBQUFBLEVBQ1g7QUFDRjtBQUVPLE1BQU0sY0FBYyxLQUFLO0FBQUEsRUFJNUIsWUFBWSxVQUFpQixPQUFhLE1BQWM7QUFDcEQsVUFBQTtBQUNBLFNBQUssV0FBVztBQUNoQixTQUFLLFFBQVE7QUFDYixTQUFLLE9BQU87QUFBQSxFQUNoQjtBQUFBLEVBRUssT0FBVSxTQUE0QjtBQUN6QyxXQUFPLFFBQVEsZUFBZSxJQUFJO0FBQUEsRUFDdEM7QUFBQSxFQUVPLFdBQW1CO0FBQ3RCLFdBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxNQUFNLGlCQUFpQixLQUFLO0FBQUEsRUFHL0IsWUFBWSxNQUFhLE1BQWM7QUFDbkMsVUFBQTtBQUNBLFNBQUssT0FBTztBQUNaLFNBQUssT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFSyxPQUFVLFNBQTRCO0FBQ3pDLFdBQU8sUUFBUSxrQkFBa0IsSUFBSTtBQUFBLEVBQ3pDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FBRU8sTUFBTSxhQUFhLEtBQUs7QUFBQSxFQUczQixZQUFZLE9BQWEsTUFBYztBQUNuQyxVQUFBO0FBQ0EsU0FBSyxRQUFRO0FBQ2IsU0FBSyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVLLE9BQVUsU0FBNEI7QUFDekMsV0FBTyxRQUFRLGNBQWMsSUFBSTtBQUFBLEVBQ3JDO0FBQUEsRUFFTyxXQUFtQjtBQUN0QixXQUFPO0FBQUEsRUFDWDtBQUNGO0FDbmhCTyxJQUFLLDhCQUFBQyxlQUFMO0FBRUxBLGFBQUFBLFdBQUEsS0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLEtBQUEsSUFBQSxDQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLENBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGFBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsY0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxnQkFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGlCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGNBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxNQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsYUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLGtCQUFBLElBQUEsRUFBQSxJQUFBO0FBR0FBLGFBQUFBLFdBQUEsWUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFVBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUdBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsVUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFHQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE9BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFlBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxLQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLFdBQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFDQUEsYUFBQUEsV0FBQSxRQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0FBLGFBQUFBLFdBQUEsTUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBQSxhQUFBQSxXQUFBLE1BQUEsSUFBQSxFQUFBLElBQUE7QUFqRlUsU0FBQUE7QUFBQSxHQUFBLGFBQUEsQ0FBQSxDQUFBO0FBb0ZMLE1BQU0sTUFBTTtBQUFBLEVBUWpCLFlBQ0UsTUFDQSxRQUNBLFNBQ0EsTUFDQSxLQUNBO0FBQ0EsU0FBSyxPQUFPLFVBQVUsSUFBSTtBQUMxQixTQUFLLE9BQU87QUFDWixTQUFLLFNBQVM7QUFDZCxTQUFLLFVBQVU7QUFDZixTQUFLLE9BQU87QUFDWixTQUFLLE1BQU07QUFBQSxFQUNiO0FBQUEsRUFFTyxXQUFXO0FB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
