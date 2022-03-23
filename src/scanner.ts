import * as Utils from "./utils";
import { Token, TokenType } from "./types/token";

export class Scanner {
  /** scripts source code */
  public source: string;
  /** contains the source code represented as list of tokens */
  public tokens: Token[];
  /** List of errors from scanning */
  public errors: string[];
  /** points to the current character being tokenized */
  private current: number;
  /** points to the start of the token  */
  private start: number;
  /** current line of source code being tokenized */
  private line: number;
  /** current column of the character being tokenized */
  private col: number;

  public scan(source: string): Token[] {
    this.source = source;
    this.tokens = [];
    this.errors = [];
    this.current = 0;
    this.start = 0;
    this.line = 1;
    this.col = 1;

    while (!this.eof()) {
      this.start = this.current;
      try {
        this.getToken();
      } catch (e) {
        this.errors.push(`${e}`);
        if (this.errors.length > 100) {
          this.errors.push("Error limit exceeded");
          return this.tokens;
        }
      }
    }
    this.tokens.push(new Token(TokenType.Eof, "", null, this.line, 0));
    return this.tokens;
  }

  private eof(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    if (this.peek() === "\n") {
      this.line++;
      this.col = 0;
    }
    this.current++;
    this.col++;
    return this.source.charAt(this.current - 1);
  }

  private addToken(tokenType: TokenType, literal: any): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(tokenType, text, literal, this.line, this.col));
  }

  private match(expected: string): boolean {
    if (this.eof()) {
      return false;
    }

    if (this.source.charAt(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private peek(): string {
    if (this.eof()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) {
      return "\0";
    }
    return this.source.charAt(this.current + 1);
  }

  private comment(): void {
    while (this.peek() !== "\n" && !this.eof()) {
      this.advance();
    }
  }

  private multilineComment(): void {
    while (!this.eof() && !(this.peek() === "*" && this.peekNext() === "/")) {
      this.advance();
    }
    if (this.eof()) {
      this.error('Unterminated comment, expecting closing "*/"');
    } else {
      // the closing slash '*/'
      this.advance();
      this.advance();
    }
  }

  private string(quote: string): void {
    while (this.peek() !== quote && !this.eof()) {
      this.advance();
    }

    // Unterminated string.
    if (this.eof()) {
      this.error(`Unterminated string, expecting closing ${quote}`);
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(quote !== "`" ? TokenType.String : TokenType.Template, value);
  }

  private number(): void {
    // gets integer part
    while (Utils.isDigit(this.peek())) {
      this.advance();
    }

    // checks for fraction
    if (this.peek() === "." && Utils.isDigit(this.peekNext())) {
      this.advance();
    }

    // gets fraction part
    while (Utils.isDigit(this.peek())) {
      this.advance();
    }

    // checks for exponent
    if (this.peek().toLowerCase() === "e") {
      this.advance();
      if (this.peek() === "-" || this.peek() === "+") {
        this.advance();
      }
    }

    while (Utils.isDigit(this.peek())) {
      this.advance();
    }

    const value = this.source.substring(this.start, this.current);
    this.addToken(TokenType.Number, Number(value));
  }

  private identifier(): void {
    while (Utils.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const value = this.source.substring(this.start, this.current);
    const capitalized = Utils.capitalize(value);
    if (Utils.isKeyword(capitalized)) {
      this.addToken(TokenType[capitalized], value);
    } else {
      this.addToken(TokenType.Identifier, value);
    }
  }

  private getToken(): void {
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
      case "^":
        this.addToken(TokenType.Caret, null);
        break;
      case "$":
        this.addToken(TokenType.Dollar, null);
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
        this.addToken(this.match("|") ? TokenType.Or : TokenType.Pipe, null);
        break;
      case "&":
        this.addToken(
          this.match("&") ? TokenType.And : TokenType.Ampersand,
          null
        );
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GreaterEqual : TokenType.Greater,
          null
        );
        break;
      case "!":
        this.addToken(
          this.match("=") ? TokenType.BangEqual : TokenType.Bang,
          null
        );
        break;
      case "?":
        this.addToken(
          this.match("?")
            ? TokenType.QuestionQuestion
            : this.match(".")
            ? TokenType.QuestionDot
            : TokenType.Question,
          null
        );
        break;
      case "=":
        this.addToken(
          this.match("=")
            ? TokenType.EqualEqual
            : this.match(">")
            ? TokenType.Arrow
            : TokenType.Equal,
          null
        );
        break;
      case "+":
        this.addToken(
          this.match("+")
            ? TokenType.PlusPlus
            : this.match("=")
            ? TokenType.PlusEqual
            : TokenType.Plus,
          null
        );
        break;
      case "-":
        this.addToken(
          this.match("-")
            ? TokenType.MinusMinus
            : this.match("=")
            ? TokenType.MinusEqual
            : TokenType.Minus,
          null
        );
        break;
      case "<":
        this.addToken(
          this.match("=")
            ? this.match(">")
              ? TokenType.LessEqualGreater
              : TokenType.LessEqual
            : TokenType.Less,
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
      case "\t":
        break;
      // complex cases
      default:
        if (Utils.isDigit(char)) {
          this.number();
        } else if (Utils.isAlpha(char)) {
          this.identifier();
        } else {
          this.error(`Unexpected character '${char}'`);
        }
        break;
    }
  }

  private error(message: string): void {
    throw new Error(`Scan Error (${this.line}:${this.col}) => ${message}`);
  }
}
