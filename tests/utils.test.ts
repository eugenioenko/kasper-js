import { describe, test, expect } from "vitest";
import {
  isDigit,
  isAlpha,
  isAlphaNumeric,
  capitalize,
  isKeyword,
} from "@src/utils";
import { TokenType } from "@src/types/token";

describe("utils", () => {
  test("isDigit returns true for digits", () => {
    expect(isDigit("0")).toBe(true);
    expect(isDigit("5")).toBe(true);
    expect(isDigit("9")).toBe(true);
  });
  test("isDigit returns false for non-digits", () => {
    expect(isDigit("a")).toBe(false);
    expect(isDigit(" ")).toBe(false);
    expect(isDigit("$")).toBe(false);
  });

  test("isAlpha returns true for letters and $", () => {
    expect(isAlpha("a")).toBe(true);
    expect(isAlpha("Z")).toBe(true);
    expect(isAlpha("$")).toBe(true);
  });
  test("isAlpha returns false for non-letters", () => {
    expect(isAlpha("1")).toBe(false);
    expect(isAlpha("_")).toBe(false);
    expect(isAlpha(" ")).toBe(false);
  });

  test("isAlphaNumeric returns true for alphanumerics and $", () => {
    expect(isAlphaNumeric("a")).toBe(true);
    expect(isAlphaNumeric("Z")).toBe(true);
    expect(isAlphaNumeric("0")).toBe(true);
    expect(isAlphaNumeric("9")).toBe(true);
    expect(isAlphaNumeric("$")).toBe(true);
  });
  test("isAlphaNumeric returns false for non-alphanumerics", () => {
    expect(isAlphaNumeric("_")).toBe(false);
    expect(isAlphaNumeric(" ")).toBe(false);
  });

  test("capitalize capitalizes first letter and lowercases the rest", () => {
    expect(capitalize("foo")).toBe("Foo");
    expect(capitalize("FOO")).toBe("Foo");
    expect(capitalize("fOoBaR")).toBe("Foobar");
    expect(capitalize("")).toBe("");
  });

  test("isKeyword returns true for keywords", () => {
    // TokenType.And is the first keyword, so test all >= And
    for (const key in TokenType) {
      if (isNaN(Number(key))) continue;
      const name = TokenType[key] as keyof typeof TokenType;
      if (Number(key) >= TokenType.And) {
        expect(isKeyword(name as any)).toBe(true);
      }
    }
  });
  test("isKeyword returns false for non-keywords", () => {
    // Test a value < TokenType.And
    for (const key in TokenType) {
      if (isNaN(Number(key))) continue;
      const name = TokenType[key] as keyof typeof TokenType;
      if (Number(key) < TokenType.And) {
        expect(isKeyword(name as any)).toBe(false);
      }
    }
  });
});
