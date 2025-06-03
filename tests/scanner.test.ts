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
});
