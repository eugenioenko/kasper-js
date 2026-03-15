export const KErrorCode = {
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
  MISSING_REQUIRED_ATTR: "K007-2",
} as const;

export type KErrorCodeType = (typeof KErrorCode)[keyof typeof KErrorCode];

export const ErrorTemplates: Record<string, (args: any) => string> = {
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
  "K007-2": (a) => a.message,
};

export class KasperError extends Error {
  constructor(
    public code: KErrorCodeType,
    public args: any = {},
    public line?: number,
    public col?: number,
    public tagName?: string
  ) {
    // Detect environment
    const isDev =
      typeof process !== "undefined"
        ? process.env.NODE_ENV !== "production"
        : (import.meta as any).env?.MODE !== "production";

    const template = ErrorTemplates[code];
    const message = template 
      ? template(args) 
      : (typeof args === 'string' ? args : "Unknown error");
    
    const location = line !== undefined ? ` (${line}:${col})` : "";
    const tagInfo = tagName ? `\n  at <${tagName}>` : "";
    const link = isDev
      ? `\n\nSee: https://kasperjs.top/reference/errors#${code.toLowerCase().replace(".", "")}`
      : "";

    super(`[${code}] ${message}${location}${tagInfo}${link}`);
    this.name = "KasperError";
  }
}
