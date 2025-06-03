import * as Utils from "./utils";
import { Token, TokenType } from "./types/token";

export function scan(source: string): Token[] {
  let tokens: Token[] = [];
  let errors: string[] = [];
  let current = 0;
  let start = 0;
  let line = 1;
  let col = 1;

  function eof(): boolean {
    return current >= source.length;
  }

  function advance(): string {
    if (peek() === "\n") {
      line++;
      col = 0;
    }
    current++;
    col++;
    return source.charAt(current - 1);
  }

  function addToken(tokenType: TokenType, literal: any): void {
    const text = source.substring(start, current);
    tokens.push(new Token(tokenType, text, literal, line, col));
  }

  function match(expected: string): boolean {
    if (eof()) {
      return false;
    }
    if (source.charAt(current) !== expected) {
      return false;
    }
    current++;
    return true;
  }

  function peek(): string {
    if (eof()) {
      return "\0";
    }
    return source.charAt(current);
  }

  function peekNext(): string {
    if (current + 1 >= source.length) {
      return "\0";
    }
    return source.charAt(current + 1);
  }

  function comment(): void {
    while (peek() !== "\n" && !eof()) {
      advance();
    }
  }

  function multilineComment(): void {
    while (!eof() && !(peek() === "*" && peekNext() === "/")) {
      advance();
    }
    if (eof()) {
      error('Unterminated comment, expecting closing "*/"');
    } else {
      advance();
      advance();
    }
  }

  function string(quote: string): void {
    while (peek() !== quote && !eof()) {
      advance();
    }
    if (eof()) {
      error(`Unterminated string, expecting closing ${quote}`);
      return;
    }
    advance();
    const value = source.substring(start + 1, current - 1);
    if (quote !== "`") {
      addToken(TokenType.String, value);
    } else {
      addToken(TokenType.Template, value);
    }
  }

  function number(): void {
    while (Utils.isDigit(peek())) advance();
    if (peek() === "." && Utils.isDigit(peekNext())) advance();
    while (Utils.isDigit(peek())) advance();
    if (peek().toLowerCase() === "e") {
      advance();
      if (peek() === "-" || peek() === "+") advance();
      // Require at least one digit after e/E
      if (!Utils.isDigit(peek())) {
        error("Invalid exponent: expected digit after e/E");
        return;
      }
      while (Utils.isDigit(peek())) advance();
    }
    const value = source.substring(start, current);
    addToken(TokenType.Number, Number(value));
  }

  function identifier(): void {
    while (Utils.isAlphaNumeric(peek())) advance();
    const value = source.substring(start, current);
    const capitalized = Utils.capitalize(value) as keyof typeof TokenType;
    if (Utils.isKeyword(capitalized)) {
      addToken(TokenType[capitalized], value);
    } else {
      addToken(TokenType.Identifier, value);
    }
  }

  function getToken(): void {
    const char = advance();
    switch (char) {
      case "(":
        addToken(TokenType.LeftParen, null);
        break;
      case ")":
        addToken(TokenType.RightParen, null);
        break;
      case "[":
        addToken(TokenType.LeftBracket, null);
        break;
      case "]":
        addToken(TokenType.RightBracket, null);
        break;
      case "{":
        addToken(TokenType.LeftBrace, null);
        break;
      case "}":
        addToken(TokenType.RightBrace, null);
        break;
      case ",":
        addToken(TokenType.Comma, null);
        break;
      case ";":
        addToken(TokenType.Semicolon, null);
        break;
      case "^":
        addToken(TokenType.Caret, null);
        break;
      case "#":
        addToken(TokenType.Hash, null);
        break;
      case ":":
        if (match("=")) {
          addToken(TokenType.Arrow, null);
        } else {
          addToken(TokenType.Colon, null);
        }
        break;
      case "*":
        if (match("=")) {
          addToken(TokenType.StarEqual, null);
        } else {
          addToken(TokenType.Star, null);
        }
        break;
      case "%":
        if (match("=")) {
          addToken(TokenType.PercentEqual, null);
        } else {
          addToken(TokenType.Percent, null);
        }
        break;
      case "|":
        if (match("|")) {
          addToken(TokenType.Or, null);
        } else {
          addToken(TokenType.Pipe, null);
        }
        break;
      case "&":
        if (match("&")) {
          addToken(TokenType.And, null);
        } else {
          addToken(TokenType.Ampersand, null);
        }
        break;
      case ">":
        if (match("=")) {
          addToken(TokenType.GreaterEqual, null);
        } else {
          addToken(TokenType.Greater, null);
        }
        break;
      case "!":
        if (match("=")) {
          addToken(TokenType.BangEqual, null);
        } else {
          addToken(TokenType.Bang, null);
        }
        break;
      case "?":
        if (match("?")) {
          addToken(TokenType.QuestionQuestion, null);
        } else if (match(".")) {
          addToken(TokenType.QuestionDot, null);
        } else {
          addToken(TokenType.Question, null);
        }
        break;
      case "=":
        if (match("=")) {
          if (match("=")) {
            addToken(TokenType.EqualEqualEqual, null);
          } else {
            addToken(TokenType.EqualEqual, null);
          }
          break;
        }
        if (match(">")) {
          addToken(TokenType.Arrow, null);
          break;
        }
        addToken(TokenType.Equal, null);
        break;
      case "+":
        if (match("+")) {
          addToken(TokenType.PlusPlus, null);
        } else if (match("=")) {
          addToken(TokenType.PlusEqual, null);
        } else {
          addToken(TokenType.Plus, null);
        }
        break;
      case "-":
        if (match("-")) {
          addToken(TokenType.MinusMinus, null);
        } else if (match("=")) {
          addToken(TokenType.MinusEqual, null);
        } else {
          addToken(TokenType.Minus, null);
        }
        break;
      case "<":
        if (match("=")) {
          if (match(">")) {
            addToken(TokenType.LessEqualGreater, null);
          } else {
            addToken(TokenType.LessEqual, null);
          }
        } else {
          addToken(TokenType.Less, null);
        }
        break;
      case ".":
        if (match(".")) {
          if (match(".")) {
            addToken(TokenType.DotDotDot, null);
          } else {
            addToken(TokenType.DotDot, null);
          }
        } else {
          addToken(TokenType.Dot, null);
        }
        break;
      case "/":
        if (match("/")) {
          comment();
        } else if (match("*")) {
          multilineComment();
        } else {
          if (match("=")) {
            addToken(TokenType.SlashEqual, null);
          } else {
            addToken(TokenType.Slash, null);
          }
        }
        break;
      case "'":
      case '"':
      case "`":
        string(char);
        break;
      case "\n":
      case " ":
      case "\r":
      case "\t":
        break;
      default:
        if (Utils.isDigit(char)) {
          number();
        } else if (Utils.isAlpha(char)) {
          identifier();
        } else {
          error(`Unexpected character '${char}'`);
        }
        break;
    }
  }

  function error(message: string): void {
    throw new Error(`Scan Error (${line}:${col}) => ${message}`);
  }

  while (!eof()) {
    start = current;
    try {
      getToken();
    } catch (e) {
      errors.push(`${e}`);
      if (errors.length > 100) {
        errors.push("Error limit exceeded");
        return tokens;
      }
    }
  }
  tokens.push(new Token(TokenType.Eof, "", null, line, 0));
  return tokens;
}
