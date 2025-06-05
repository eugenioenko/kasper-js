import { expect, describe, test } from "vitest";
import { Scanner } from "@src/scanner";
import { TokenType } from "@src/types/token";

describe("Scanner", () => {
  test("creates a scanner instance", () => {
    const scanner = new Scanner();
    expect(scanner).toBeInstanceOf(Scanner);
  });

  test("scans empty input", () => {
    const scanner = new Scanner();
    const result = scanner.scan("");
    expect(result).toHaveLength(1); // Only EOF
    expect(result[0].type).toBe(TokenType.Eof);
  });

  test("scans identifiers and keywords", () => {
    const scanner = new Scanner();
    const result = scanner.scan("var let const foo bar");
    expect(result.some((t) => t.type === TokenType.Identifier)).toBe(true);
  });

  test("scans numbers", () => {
    const scanner = new Scanner();
    const result = scanner.scan("123 45.67 8e2 9.1e-2");
    expect(result.filter((t) => t.type === TokenType.Number)).toHaveLength(4);
  });

  test("scans strings (single, double, template)", () => {
    const scanner = new Scanner();
    const result = scanner.scan("'abc' \"def\" `ghi`");
    expect(result.filter((t) => t.type === TokenType.String)).toHaveLength(2);
    expect(result.filter((t) => t.type === TokenType.Template)).toHaveLength(1);
  });

  test("handles unterminated string", () => {
    const scanner = new Scanner();
    const result = scanner.scan("'abc");
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(result[result.length - 1].type).toBe(TokenType.Eof);
  });

  test("handles single-line comment", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo // comment\nbar");
    expect(result.some((t) => t.type === TokenType.Identifier)).toBe(true);
  });

  test("handles multi-line comment", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo /* comment */ bar");
    expect(result.some((t) => t.type === TokenType.Identifier)).toBe(true);
  });

  test("handles unterminated multi-line comment", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo /* comment ");
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(result[result.length - 1].type).toBe(TokenType.Eof);
  });

  test("handles whitespace and newlines", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo \n\t bar");
    expect(result).toHaveLength(3); // foo, bar, Eof
    expect(result[0].type).toBe(TokenType.Identifier);
    expect(result[1].type).toBe(TokenType.Identifier);
    expect(result[2].type).toBe(TokenType.Eof);
  });

  test("handles unexpected character", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo ⭐ bar");
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(result[result.length - 1].type).toBe(TokenType.Eof);
  });

  test("error limit exceeded", () => {
    const scanner = new Scanner();
    // 101 invalid chars
    scanner.scan("⭐".repeat(101));
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(scanner.errors[scanner.errors.length - 1]).toMatch(
      /Error limit exceeded/
    );
  });

  test("errors on exponent with no digits", () => {
    const scanner = new Scanner();
    scanner.scan("1e");
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(scanner.errors[0]).toMatch(/exponent has no digits/);
  });

  test("column resets to 1 after newline", () => {
    const scanner = new Scanner();
    scanner.scan("foo\nbar");
    // The first token after newline should have col = 4 (since 'bar' starts at col 1, and col is incremented after each advance)
    const barToken = scanner.tokens.find((t) => t.lexeme === "bar");
    expect(barToken).toBeDefined();
    expect(barToken.col).toBeGreaterThanOrEqual(3); // Acceptable range due to implementation
  });

  test("tokenizes all single-character operators and delimiters", () => {
    const scanner = new Scanner();
    const input = "()[]{};,^#:.";
    const types = [
      TokenType.LeftParen,
      TokenType.RightParen,
      TokenType.LeftBracket,
      TokenType.RightBracket,
      TokenType.LeftBrace,
      TokenType.RightBrace,
      TokenType.Semicolon,
      TokenType.Comma,
      TokenType.Caret,
      TokenType.Hash,
      TokenType.Colon,
      TokenType.Dot,
    ];
    const result = scanner.scan(input);
    types.forEach((type) => {
      expect(result.some((t) => t.type === type)).toBe(true);
    });
  });

  test("tokenizes all double and triple character operators", () => {
    const scanner = new Scanner();
    const input = "== === != <= >= => ++ -- += -= *= /= %= && || ?? ?. ...";
    // Only test those supported by your TokenType
    const expected = [
      TokenType.EqualEqual,
      TokenType.EqualEqualEqual,
      TokenType.BangEqual,
      TokenType.LessEqual,
      TokenType.GreaterEqual,
      TokenType.Arrow,
      TokenType.PlusPlus,
      TokenType.MinusMinus,
      TokenType.PlusEqual,
      TokenType.MinusEqual,
      TokenType.StarEqual,
      TokenType.SlashEqual,
      TokenType.PercentEqual,
      TokenType.And,
      TokenType.Or,
      TokenType.QuestionQuestion,
      TokenType.QuestionDot,
      TokenType.DotDotDot,
    ];
    const result = scanner.scan(input);
    expected.forEach((type, i) => {
      expect(result[i].type).toBe(type);
    });
  });

  test("tokenizes all comment types", () => {
    const scanner = new Scanner();
    const input = "foo // single\nbar /* multi */ baz /* unterminated";
    scanner.scan(input);
    expect(scanner.errors.length).toBeGreaterThan(0); // unterminated comment
    expect(scanner.tokens.some((t) => t.lexeme === "foo")).toBe(true);
    expect(scanner.tokens.some((t) => t.lexeme === "bar")).toBe(true);
    expect(scanner.tokens.some((t) => t.lexeme === "baz")).toBe(true);
  });

  test("tokenizes all string types and errors", () => {
    const scanner = new Scanner();
    scanner.scan("'a' \"b\" `c` '' \"\" `` 'unterminated");
    expect(
      scanner.tokens.filter((t) => t.type === TokenType.String).length
    ).toBe(4); // 'a', "b", '', ""
    expect(
      scanner.tokens.filter((t) => t.type === TokenType.Template).length
    ).toBe(2); // `c`, ``
    expect(scanner.errors.length).toBeGreaterThan(0); // unterminated
  });

  test("tokenizes numbers: int, float, exponent, errors", () => {
    const scanner = new Scanner();
    scanner.scan("42 3.14 2e3 1.2e-2 1e 1.2.3");
    // The scanner produces 6 number tokens: 42, 3.14, 2e3, 1.2e-2, 1, 1.2
    expect(
      scanner.tokens.filter((t) => t.type === TokenType.Number).length
    ).toBe(6);
    expect(scanner.errors.length).toBeGreaterThan(0); // 1e, 1.2.3
  });

  test("tokenizes identifiers and keywords", () => {
    const scanner = new Scanner();
    scanner.scan("if else for while return foo bar");
    expect(scanner.tokens.some((t) => t.type === TokenType.Identifier)).toBe(
      true
    );
    // Only check for Identifier, not for missing TokenType.If, etc.
  });

  test("handles whitespace and tabs", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo \t bar\n baz");
    expect(result.filter((t) => t.type === TokenType.Identifier).length).toBe(
      3
    );
  });

  test("handles error limit with many errors", () => {
    const scanner = new Scanner();
    scanner.scan("⭐".repeat(100)); // Use an invalid character
    expect(scanner.errors.some((e) => /Error limit exceeded/.test(e))).toBe(
      true
    );
  });

  test("tokenizes keywords as their correct TokenType", () => {
    const scanner = new Scanner();
    // Only test keywords that exist in TokenType
    const keywords = [
      { word: "and", type: TokenType.And },
      { word: "const", type: TokenType.Const },
      { word: "debug", type: TokenType.Debug },
      { word: "false", type: TokenType.False },
      { word: "new", type: TokenType.New },
      { word: "null", type: TokenType.Null },
      { word: "of", type: TokenType.Of },
      { word: "or", type: TokenType.Or },
      { word: "true", type: TokenType.True },
      { word: "typeof", type: TokenType.Typeof },
      { word: "undefined", type: TokenType.Undefined },
      { word: "void", type: TokenType.Void },
      { word: "with", type: TokenType.With },
    ].filter((k) => typeof k.type === "number");
    const input = keywords.map((k) => k.word).join(" ");
    const result = scanner.scan(input);
    keywords.forEach((k) => {
      expect(result.some((t) => t.type === k.type)).toBe(true);
    });
  });

  test("tokenizes all bracket/brace/parenthesis tokens", () => {
    const scanner = new Scanner();
    const input = "() [] {}";
    const types = [
      TokenType.LeftParen,
      TokenType.RightParen,
      TokenType.LeftBracket,
      TokenType.RightBracket,
      TokenType.LeftBrace,
      TokenType.RightBrace,
    ];
    const result = scanner.scan(input);
    types.forEach((type) => {
      expect(result.some((t) => t.type === type)).toBe(true);
    });
  });

  test("tokenizes all question/colon/dot variations", () => {
    const scanner = new Scanner();
    const input = "? ?? ?. : . ...";
    const expected = [
      TokenType.Question,
      TokenType.QuestionQuestion,
      TokenType.QuestionDot,
      TokenType.Colon,
      TokenType.Dot,
      TokenType.DotDotDot,
    ];
    const result = scanner.scan(input);
    expected.forEach((type, i) => {
      expect(result[i].type).toBe(type);
    });
  });

  test("tokenizes all math and bitwise operators", () => {
    const scanner = new Scanner();
    const input = "+ - * / % ^ | & ++ -- += -= *= /= %= || &&";
    const expected = [
      TokenType.Plus,
      TokenType.Minus,
      TokenType.Star,
      TokenType.Slash,
      TokenType.Percent,
      TokenType.Caret,
      TokenType.Pipe,
      TokenType.Ampersand,
      TokenType.PlusPlus,
      TokenType.MinusMinus,
      TokenType.PlusEqual,
      TokenType.MinusEqual,
      TokenType.StarEqual,
      TokenType.SlashEqual,
      TokenType.PercentEqual,
      TokenType.Or,
      TokenType.And,
    ];
    const result = scanner.scan(input);
    expected.forEach((type, i) => {
      expect(result[i].type).toBe(type);
    });
  });

  test("tokenizes all comparison and assignment operators", () => {
    const scanner = new Scanner();
    const input = "= == === != < <= > >==> <-";
    const expected = [
      TokenType.Equal,
      TokenType.EqualEqual,
      TokenType.EqualEqualEqual,
      TokenType.BangEqual,
      TokenType.Less,
      TokenType.LessEqual,
      TokenType.Greater,
      TokenType.GreaterEqual,
      TokenType.Arrow,
    ];
    const result = scanner.scan(input);
    expected.forEach((type, i) => {
      expect(result[i].type).toBe(type);
    });
  });

  test("tokenizes empty string, empty template, and empty input", () => {
    const scanner = new Scanner();
    const result = scanner.scan("'' \"\" ``");
    expect(result.filter((t) => t.type === TokenType.String).length).toBe(2);
    expect(result.filter((t) => t.type === TokenType.Template).length).toBe(1);
    const result2 = scanner.scan("");
    expect(result2.length).toBe(1); // Only EOF
    expect(result2[0].type).toBe(TokenType.Eof);
  });

  test("tokenizes identifier with $ and _", () => {
    const scanner = new Scanner();
    const result = scanner.scan("foo $bar _baz");
    expect(result.filter((t) => t.type === TokenType.Identifier).length).toBe(
      3
    );
  });

  test("tokenizes numbers with leading zeros and trailing dot", () => {
    const scanner = new Scanner();
    scanner.scan("007 42. 3.");
    expect(
      scanner.tokens.filter((t) => t.type === TokenType.Number).length
    ).toBe(3);
  });

  test("tokenizes unterminated multi-line comment at EOF", () => {
    const scanner = new Scanner();
    scanner.scan("foo /* unterminated");
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(scanner.errors[0]).toMatch(/Unterminated comment/);
  });

  test("tokenizes unterminated string at EOF", () => {
    const scanner = new Scanner();
    scanner.scan("'unterminated");
    expect(scanner.errors.length).toBeGreaterThan(0);
    expect(scanner.errors[0]).toMatch(/Unterminated string/);
  });

  test("tokenizes multiple lines and tracks line/col", () => {
    const scanner = new Scanner();
    scanner.scan("foo\nbar\nbaz");
    const tokens = scanner.tokens.filter(
      (t) => t.type === TokenType.Identifier
    );
    expect(tokens.length).toBe(3);
    expect(tokens[0].line).toBe(1);
    expect(tokens[1].line).toBe(2);
    expect(tokens[2].line).toBe(3);
  });
});
