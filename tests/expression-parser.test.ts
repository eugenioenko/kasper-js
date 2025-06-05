import { expect, describe, it } from "vitest";
import { ExpressionParser } from "../src/expression-parser";
import { Token, TokenType } from "../src/types/token";
import * as Expr from "../src/types/expressions";

describe("ExpressionParser", () => {
  function token(type: TokenType, lexeme = "", literal: any = null): Token {
    // Default line and col to 1 for all test tokens, and set name to lexeme for identifiers
    return {
      type,
      lexeme,
      literal,
      line: 1,
      col: 1,
      name: type === TokenType.Identifier ? lexeme : undefined,
    } as Token;
  }
  function eof() {
    return token(TokenType.Eof, "", null);
  }

  it("parses a simple literal expression", () => {
    const parser = new ExpressionParser();
    const tokens = [token(TokenType.Number, "42", 42), eof()];
    const exprs = parser.parse(tokens);
    expect(exprs.length).toBe(1);
    expect(exprs[0]).toBeInstanceOf(Expr.Literal);
    expect((exprs[0] as Expr.Literal).value).toBe(42);
  });

  it("parses a variable and assignment", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "x"),
      token(TokenType.Equal, "="),
      token(TokenType.Number, "1", 1),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Assign);
  });

  it("parses a binary expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Number, "1", 1),
      token(TokenType.Plus, "+"),
      token(TokenType.Number, "2", 2),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Binary);
  });

  it("parses a grouping expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.LeftParen, "("),
      token(TokenType.Number, "1", 1),
      token(TokenType.RightParen, ")"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Grouping);
  });

  it("parses a list expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.LeftBracket, "["),
      token(TokenType.Number, "1", 1),
      token(TokenType.Comma, ","),
      token(TokenType.Number, "2", 2),
      token(TokenType.RightBracket, "]"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.List);
    // Fix: Expr.List uses 'value' not 'values'
    expect((exprs[0] as Expr.List).value.length).toBe(2);
  });

  it("parses a dictionary expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.LeftBrace, "{"),
      token(TokenType.Identifier, "foo"),
      token(TokenType.Colon, ":"),
      token(TokenType.Number, "1", 1),
      token(TokenType.Comma, ","),
      token(TokenType.Identifier, "bar"),
      token(TokenType.Colon, ":"),
      token(TokenType.Number, "2", 2),
      token(TokenType.RightBrace, "}"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Dictionary);
    expect((exprs[0] as Expr.Dictionary).properties.length).toBe(2);
  });

  it("parses a call expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "f"),
      token(TokenType.LeftParen, "("),
      token(TokenType.Number, "1", 1),
      token(TokenType.Comma, ","),
      token(TokenType.Number, "2", 2),
      token(TokenType.RightParen, ")"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Call);
  });

  it("parses a dot get expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "obj"),
      token(TokenType.Dot, "."),
      token(TokenType.Identifier, "prop"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Get);
  });

  it("parses a bracket get expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "arr"),
      token(TokenType.LeftBracket, "["),
      token(TokenType.Number, "0", 0),
      token(TokenType.RightBracket, "]"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Get);
  });

  it("parses a ternary expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.True, "true"),
      token(TokenType.Question, "?"),
      token(TokenType.Number, "1", 1),
      token(TokenType.Colon, ":"),
      token(TokenType.Number, "2", 2),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Ternary);
  });

  it("parses a null coalescing expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "a"),
      token(TokenType.QuestionQuestion, "??"),
      token(TokenType.Identifier, "b"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.NullCoalescing);
  });

  it("parses a logical and/or expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.True, "true"),
      token(TokenType.And, "&&"),
      token(TokenType.False, "false"),
      token(TokenType.Or, "||"),
      token(TokenType.True, "true"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Logical);
  });

  it("parses a typeof expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Typeof, "typeof"),
      token(TokenType.Identifier, "x"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Typeof);
  });

  it("parses a unary expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Bang, "!"),
      token(TokenType.Identifier, "x"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Unary);
  });

  it("parses a postfix expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "x"),
      token(TokenType.PlusPlus, "++"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Postfix);
  });

  it("parses a void and debug expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Void, "void"),
      token(TokenType.Number, "1", 1),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.Void);

    const tokens2 = [
      token(TokenType.Debug, "debug"),
      token(TokenType.Number, "1", 1),
      eof(),
    ];
    const exprs2 = parser.parse(tokens2);
    expect(exprs2[0]).toBeInstanceOf(Expr.Debug);
  });

  it("parses a new expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.New, "new"),
      token(TokenType.Identifier, "Foo"),
      token(TokenType.LeftParen, "("),
      token(TokenType.RightParen, ")"),
      eof(),
    ];
    const exprs = parser.parse(tokens);
    expect(exprs[0]).toBeInstanceOf(Expr.New);
  });

  it("parses foreach expression", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "item"),
      token(TokenType.Of, "of"),
      token(TokenType.Identifier, "arr"),
      eof(),
    ];
    const expr = parser.foreach(tokens);
    expect(expr).toBeInstanceOf(Expr.Each);
  });

  it("parses foreach with key", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Identifier, "item"),
      token(TokenType.With, "with"),
      token(TokenType.Identifier, "key"),
      token(TokenType.Of, "of"),
      token(TokenType.Identifier, "arr"),
      eof(),
    ];
    const expr = parser.foreach(tokens);
    expect(expr).toBeInstanceOf(Expr.Each);
    expect((expr as Expr.Each).key.lexeme).toBe("key");
  });

  it("handles parse errors and synchronizes", () => {
    const parser = new ExpressionParser();
    // Missing right paren
    const tokens = [
      token(TokenType.LeftParen, "("),
      token(TokenType.Number, "1", 1),
      token(TokenType.Semicolon, ";"),
      eof(),
    ];
    parser.parse(tokens);
    expect(parser.errors.length).toBeGreaterThan(0);
  });

  it("throws on invalid dictionary key", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.LeftBrace, "{"),
      token(TokenType.RightBracket, "]"), // invalid key
      token(TokenType.RightBrace, "}"),
      eof(),
    ];
    parser.parse(tokens);
    const error = parser.errors[0];
    expect(error.value).toContain(
      "String, Number or Identifier expected as a Key of Dictionary"
    );
  });

  it("throws on invalid l-value in assignment", () => {
    const parser = new ExpressionParser();
    const tokens = [
      token(TokenType.Number, "1", 1),
      token(TokenType.Equal, "="),
      token(TokenType.Number, "2", 2),
      eof(),
    ];
    parser.parse(tokens);
    const error = parser.errors[0];
    expect(error.value).toContain(
      "Invalid l-value, is not an assigning target."
    );
  });

  it("handles empty input", () => {
    const parser = new ExpressionParser();
    const tokens: Token[] = [];
    const exprs = parser.parse(tokens);
    expect(exprs.length).toBe(0);
  });
});
