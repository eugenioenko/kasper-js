// @vitest-environment node
import { Scanner } from "../src/scanner";
import { TokenType } from "../src/types/token";

// Scan source and return the types of all tokens except EOF
function scanTypes(source: string): TokenType[] {
  const scanner = new Scanner();
  return scanner.scan(source).slice(0, -1).map((t) => t.type);
}

// Scan source and return a single token (first non-EOF)
function scanOne(source: string) {
  const scanner = new Scanner();
  return scanner.scan(source)[0];
}

describe("Scanner", () => {
  describe("EOF", () => {
    it("always appends an EOF token", () => {
      const scanner = new Scanner();
      const tokens = scanner.scan("");
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.Eof);
    });

    it("EOF token has empty lexeme and null literal", () => {
      const scanner = new Scanner();
      const [eof] = scanner.scan("");
      expect(eof.lexeme).toBe("");
      expect(eof.literal).toBeNull();
    });
  });

  describe("single-character tokens", () => {
    const cases: [string, TokenType][] = [
      ["(", TokenType.LeftParen],
      [")", TokenType.RightParen],
      ["[", TokenType.LeftBracket],
      ["]", TokenType.RightBracket],
      ["{", TokenType.LeftBrace],
      ["}", TokenType.RightBrace],
      [",", TokenType.Comma],
      [";", TokenType.Semicolon],
      ["^", TokenType.Caret],
      ["#", TokenType.Hash],
    ];

    for (const [char, type] of cases) {
      it(`'${char}' → ${TokenType[type]}`, () => {
        expect(scanTypes(char)).toEqual([type]);
      });
    }

    it("lexeme matches the source character", () => {
      expect(scanOne("(").lexeme).toBe("(");
      expect(scanOne(",").lexeme).toBe(",");
    });

    it("literal is null for punctuation tokens", () => {
      expect(scanOne("(").literal).toBeNull();
    });
  });

  describe("one-or-two character tokens", () => {
    it(": → Colon", () => expect(scanTypes(":")).toEqual([TokenType.Colon]));
    it(":= → Arrow", () => expect(scanTypes(":=")).toEqual([TokenType.Arrow]));

    it("* → Star", () => expect(scanTypes("*")).toEqual([TokenType.Star]));
    it("*= → StarEqual", () => expect(scanTypes("*=")).toEqual([TokenType.StarEqual]));

    it("% → Percent", () => expect(scanTypes("%")).toEqual([TokenType.Percent]));
    it("%= → PercentEqual", () => expect(scanTypes("%=")).toEqual([TokenType.PercentEqual]));

    it("| → Pipe", () => expect(scanTypes("|")).toEqual([TokenType.Pipe]));
    it("|| → Or", () => expect(scanTypes("||")).toEqual([TokenType.Or]));

    it("& → Ampersand", () => expect(scanTypes("&")).toEqual([TokenType.Ampersand]));
    it("&& → And", () => expect(scanTypes("&&")).toEqual([TokenType.And]));

    it("> → Greater", () => expect(scanTypes(">")).toEqual([TokenType.Greater]));
    it(">= → GreaterEqual", () => expect(scanTypes(">=")).toEqual([TokenType.GreaterEqual]));

    it("! → Bang", () => expect(scanTypes("!")).toEqual([TokenType.Bang]));
    it("!= → BangEqual", () => expect(scanTypes("!=")).toEqual([TokenType.BangEqual]));

    it("? → Question", () => expect(scanTypes("?")).toEqual([TokenType.Question]));
    it("?? → QuestionQuestion", () => expect(scanTypes("??")).toEqual([TokenType.QuestionQuestion]));
    it("?. → QuestionDot", () => expect(scanTypes("?.")).toEqual([TokenType.QuestionDot]));

    it("= → Equal", () => expect(scanTypes("=")).toEqual([TokenType.Equal]));
    it("== → EqualEqual", () => expect(scanTypes("==")).toEqual([TokenType.EqualEqual]));
    it("=== → EqualEqual", () => expect(scanTypes("===")).toEqual([TokenType.EqualEqual]));
    it("=> → Arrow", () => expect(scanTypes("=>")).toEqual([TokenType.Arrow]));

    it("+ → Plus", () => expect(scanTypes("+")).toEqual([TokenType.Plus]));
    it("++ → PlusPlus", () => expect(scanTypes("++")).toEqual([TokenType.PlusPlus]));
    it("+= → PlusEqual", () => expect(scanTypes("+=")).toEqual([TokenType.PlusEqual]));

    it("- → Minus", () => expect(scanTypes("-")).toEqual([TokenType.Minus]));
    it("-- → MinusMinus", () => expect(scanTypes("--")).toEqual([TokenType.MinusMinus]));
    it("-= → MinusEqual", () => expect(scanTypes("-=")).toEqual([TokenType.MinusEqual]));

    it("< → Less", () => expect(scanTypes("<")).toEqual([TokenType.Less]));
    it("<= → LessEqual", () => expect(scanTypes("<=")).toEqual([TokenType.LessEqual]));
    it("<=> → LessEqualGreater", () => expect(scanTypes("<=>")).toEqual([TokenType.LessEqualGreater]));

    it(". → Dot", () => expect(scanTypes(".")).toEqual([TokenType.Dot]));
    it(".. → DotDot", () => expect(scanTypes("..")).toEqual([TokenType.DotDot]));
    it("... → DotDotDot", () => expect(scanTypes("...")).toEqual([TokenType.DotDotDot]));

    it("/ → Slash", () => expect(scanTypes("/")).toEqual([TokenType.Slash]));
    it("/= → SlashEqual", () => expect(scanTypes("/=")).toEqual([TokenType.SlashEqual]));
  });

  describe("comments", () => {
    it("single-line comment produces no tokens", () => {
      expect(scanTypes("// this is a comment")).toEqual([]);
    });

    it("single-line comment stops at newline", () => {
      expect(scanTypes("// comment\n123")).toEqual([TokenType.Number]);
    });

    it("multiline comment produces no tokens", () => {
      expect(scanTypes("/* this is\na comment */")).toEqual([]);
    });

    it("multiline comment allows code before and after", () => {
      expect(scanTypes("1 /* comment */ 2")).toEqual([
        TokenType.Number,
        TokenType.Number,
      ]);
    });

    it("unterminated multiline comment records an error", () => {
      const scanner = new Scanner();
      scanner.scan("/* unterminated");
      expect(scanner.errors).toHaveLength(1);
      expect(scanner.errors[0]).toContain('Unterminated comment');
    });
  });

  describe("whitespace", () => {
    it("spaces are ignored", () => expect(scanTypes("   ")).toEqual([]));
    it("tabs are ignored", () => expect(scanTypes("\t\t")).toEqual([]));
    it("carriage returns are ignored", () => expect(scanTypes("\r")).toEqual([]));
    it("newlines are ignored as tokens", () => expect(scanTypes("\n\n")).toEqual([]));

    it("whitespace between tokens is ignored", () => {
      expect(scanTypes("( )")).toEqual([TokenType.LeftParen, TokenType.RightParen]);
    });
  });

  describe("strings", () => {
    it("double-quoted string → String token", () => {
      expect(scanTypes(`"hello"`)).toEqual([TokenType.String]);
    });

    it("single-quoted string → String token", () => {
      expect(scanTypes(`'hello'`)).toEqual([TokenType.String]);
    });

    it("backtick string → Template token", () => {
      expect(scanTypes("`hello`")).toEqual([TokenType.Template]);
    });

    it("string literal is the content without quotes", () => {
      expect(scanOne(`"hello"`).literal).toBe("hello");
      expect(scanOne(`'world'`).literal).toBe("world");
      expect(scanOne("`tmpl`").literal).toBe("tmpl");
    });

    it("empty string has empty literal", () => {
      expect(scanOne(`""`).literal).toBe("");
    });

    it("unterminated double-quoted string records an error", () => {
      const scanner = new Scanner();
      scanner.scan(`"unterminated`);
      expect(scanner.errors).toHaveLength(1);
      expect(scanner.errors[0]).toContain("Unterminated string");
    });

    it("unterminated single-quoted string records an error", () => {
      const scanner = new Scanner();
      scanner.scan(`'unterminated`);
      expect(scanner.errors).toHaveLength(1);
    });
  });

  describe("numbers", () => {
    it("integer literal", () => {
      const token = scanOne("42");
      expect(token.type).toBe(TokenType.Number);
      expect(token.literal).toBe(42);
    });

    it("zero", () => {
      expect(scanOne("0").literal).toBe(0);
    });

    it("decimal literal", () => {
      expect(scanOne("3.14").literal).toBe(3.14);
    });

    it("number with exponent (e)", () => {
      const token = scanOne("1e3");
      expect(token.type).toBe(TokenType.Number);
    });

    it("number with positive exponent (e+)", () => {
      const token = scanOne("1e+3");
      expect(token.type).toBe(TokenType.Number);
    });

    it("number with negative exponent (e-)", () => {
      const token = scanOne("1e-3");
      expect(token.type).toBe(TokenType.Number);
    });

    it("uppercase E exponent", () => {
      const token = scanOne("2E3");
      expect(token.type).toBe(TokenType.Number);
    });

    it("number lexeme matches source", () => {
      expect(scanOne("123").lexeme).toBe("123");
      expect(scanOne("3.14").lexeme).toBe("3.14");
    });
  });

  describe("identifiers", () => {
    it("simple identifier", () => {
      const token = scanOne("foo");
      expect(token.type).toBe(TokenType.Identifier);
      expect(token.lexeme).toBe("foo");
    });

    it("identifier with underscore", () => {
      expect(scanOne("_bar").type).toBe(TokenType.Identifier);
    });

    it("identifier with digits", () => {
      expect(scanOne("foo1").type).toBe(TokenType.Identifier);
    });

    it("identifier starting with capital letter", () => {
      expect(scanOne("MyClass").type).toBe(TokenType.Identifier);
    });
  });

  describe("keywords", () => {
    const keywords: [string, TokenType][] = [
      ["true", TokenType.True],
      ["false", TokenType.False],
      ["null", TokenType.Null],
      ["undefined", TokenType.Undefined],
      ["typeof", TokenType.Typeof],
      ["void", TokenType.Void],
      ["new", TokenType.New],
      ["instanceof", TokenType.Instanceof],
      ["of", TokenType.Of],
      ["const", TokenType.Const],
      ["with", TokenType.With],
      ["debug", TokenType.Debug],
    ];

    for (const [word, type] of keywords) {
      it(`'${word}' → ${TokenType[type]}`, () => {
        expect(scanTypes(word)).toEqual([type]);
      });
    }

    it("keyword lexeme matches source text", () => {
      expect(scanOne("true").lexeme).toBe("true");
      expect(scanOne("null").lexeme).toBe("null");
    });
  });

  describe("line tracking", () => {
    it("starts at line 1", () => {
      expect(scanOne("x").line).toBe(1);
    });

    it("increments line on newline", () => {
      const scanner = new Scanner();
      const tokens = scanner.scan("x\ny");
      expect(tokens[0].line).toBe(1);
      expect(tokens[1].line).toBe(2);
    });

    it("tracks multiple newlines", () => {
      const scanner = new Scanner();
      const tokens = scanner.scan("a\n\n\nb");
      expect(tokens[1].line).toBe(4);
    });
  });

  describe("error handling", () => {
    it("unexpected character records an error", () => {
      const scanner = new Scanner();
      scanner.scan("@");
      expect(scanner.errors).toHaveLength(1);
      expect(scanner.errors[0]).toContain("Unexpected character");
    });

    it("error message includes line and column", () => {
      const scanner = new Scanner();
      scanner.scan("@");
      expect(scanner.errors[0]).toMatch(/\(\d+:\d+\)/);
    });

    it("scanning continues after an error", () => {
      const scanner = new Scanner();
      const tokens = scanner.scan("@ 123");
      expect(tokens.some((t) => t.type === TokenType.Number)).toBe(true);
    });

    it("stops after 100 errors", () => {
      const scanner = new Scanner();
      scanner.scan("@".repeat(102));
      expect(scanner.errors.length).toBeLessThanOrEqual(102);
      expect(scanner.errors.some((e) => e.includes("Error limit exceeded"))).toBe(true);
    });
  });

  describe("multi-token sequences", () => {
    it("scans an arithmetic expression", () => {
      expect(scanTypes("a + b * c")).toEqual([
        TokenType.Identifier,
        TokenType.Plus,
        TokenType.Identifier,
        TokenType.Star,
        TokenType.Identifier,
      ]);
    });

    it("scans a function call", () => {
      expect(scanTypes("fn(x, y)")).toEqual([
        TokenType.Identifier,
        TokenType.LeftParen,
        TokenType.Identifier,
        TokenType.Comma,
        TokenType.Identifier,
        TokenType.RightParen,
      ]);
    });

    it("scans a property access chain", () => {
      expect(scanTypes("a.b.c")).toEqual([
        TokenType.Identifier,
        TokenType.Dot,
        TokenType.Identifier,
        TokenType.Dot,
        TokenType.Identifier,
      ]);
    });

    it("scans a ternary expression", () => {
      expect(scanTypes("a ? b : c")).toEqual([
        TokenType.Identifier,
        TokenType.Question,
        TokenType.Identifier,
        TokenType.Colon,
        TokenType.Identifier,
      ]);
    });

    it("scans a string concatenation", () => {
      expect(scanTypes(`"hello" + " " + "world"`)).toEqual([
        TokenType.String,
        TokenType.Plus,
        TokenType.String,
        TokenType.Plus,
        TokenType.String,
      ]);
    });

    it("scanner state resets between scan() calls", () => {
      const scanner = new Scanner();
      scanner.scan("1 + 2");
      const second = scanner.scan("x");
      expect(second).toHaveLength(2); // Identifier + EOF
      expect(scanner.errors).toHaveLength(0);
    });
  });
});
