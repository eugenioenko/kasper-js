export enum TokenType {
  // Parser Tokens
  Eof,
  Panic,

  // Single Character Tokens
  Ampersand,
  AtSign,
  Caret,
  Comma,
  Dollar,
  Dot,
  Hash,
  LeftBrace,
  LeftBracket,
  LeftParen,
  Percent,
  Pipe,
  RightBrace,
  RightBracket,
  RightParen,
  Semicolon,
  Slash,
  Star,

  // One Or Two Character Tokens
  Arrow,
  Bang,
  BangEqual,
  Colon,
  Equal,
  EqualEqual,
  Greater,
  GreaterEqual,
  Less,
  LessEqual,
  Minus,
  MinusEqual,
  MinusMinus,
  PercentEqual,
  Plus,
  PlusEqual,
  PlusPlus,
  Question,
  QuestionDot,
  QuestionQuestion,
  SlashEqual,
  StarEqual,
  DotDot,
  DotDotDot,
  LessEqualGreater,

  // Literals
  Identifier,
  Template,
  String,
  Number,

  // Keywords
  And,
  False,
  Instanceof,
  New,
  Null,
  Undefined,
  Or,
  True,
  Typeof,
}

export class Token {
  public name: string;
  public line: number;
  public col: number;
  public type: TokenType;
  public literal: any;
  public lexeme: string;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: any,
    line: number,
    col: number
  ) {
    this.name = TokenType[type];
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
    this.col = col;
  }

  public toString() {
    return `[(${this.line}):"${this.lexeme}"]`;
  }
}

export const WhiteSpaces = [" ", "\n", "\t", "\r"] as const;

export const SelfClosingTags = [
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
  "wbr",
];
