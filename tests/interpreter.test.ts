import * as Expr from "@src/types/expressions";
import { Token, TokenType } from "@src/types/token";
import { expect, describe, test } from "vitest";
import { Interpreter } from "@src/interpreter";
import { vi } from "vitest";

describe("Interpreter", () => {
  test("creates a scanner instance", () => {
    const interpreter = new Interpreter();
    expect(interpreter).toBeInstanceOf(Interpreter);
  });

  // Helper to create a Token for tests
  function t(
    type: TokenType,
    lexeme = "",
    literal: any = null,
    line = 1,
    col = 1
  ) {
    return new Token(type, lexeme, literal, line, col);
  }

  test("visitVariableExpr and visitAssignExpr", () => {
    const interpreter = new Interpreter();
    const name = t(TokenType.Identifier, "x");
    const assignExpr = new Expr.Assign(name, new Expr.Literal(42, 1), 1);
    expect(interpreter.visitAssignExpr(assignExpr)).toBe(42);
    const varExpr = new Expr.Variable(name, 1);
    expect(interpreter.visitVariableExpr(varExpr)).toBe(42);
  });

  test("visitKeyExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Key(t(TokenType.String, "foo", "foo"), 1);
    expect(interpreter.visitKeyExpr(expr)).toBe("foo");
  });

  test("visitGetExpr and visitSetExpr", () => {
    const interpreter = new Interpreter();
    const obj = { foo: 1 };
    interpreter.scope.set("obj", obj);
    const getExpr = new Expr.Get(
      new Expr.Variable(t(TokenType.Identifier, "obj"), 1),
      new Expr.Literal("foo", 1),
      TokenType.Dot,
      1
    );
    expect(interpreter.visitGetExpr(getExpr)).toBe(1);
    const setExpr = new Expr.Set(
      new Expr.Variable(t(TokenType.Identifier, "obj"), 1),
      new Expr.Literal("foo", 1),
      new Expr.Literal(99, 1),
      1
    );
    expect(interpreter.visitSetExpr(setExpr)).toBe(99);
    expect(obj.foo).toBe(99);
  });

  test("visitGetExpr with optional chaining", () => {
    const interpreter = new Interpreter();
    const getExpr = new Expr.Get(
      new Expr.Literal(null, 1),
      new Expr.Literal("foo", 1),
      TokenType.QuestionDot,
      1
    );
    expect(interpreter.visitGetExpr(getExpr)).toBeUndefined();
  });

  test("visitPostfixExpr", () => {
    const interpreter = new Interpreter();
    interpreter.scope.set("x", 5);
    const expr = new Expr.Postfix(t(TokenType.Identifier, "x"), 1, 1);
    expr.increment = 1;
    expect(interpreter.visitPostfixExpr(expr)).toBe(5);
    expect(interpreter.scope.get("x")).toBe(6);
  });

  test("visitListExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.List(
      [new Expr.Literal(1, 1), new Expr.Literal(2, 1), new Expr.Literal(3, 1)],
      1
    );
    expect(interpreter.visitListExpr(expr)).toEqual([1, 2, 3]);
  });

  test("visitTemplateExpr", () => {
    const interpreter = new Interpreter();
    interpreter.scope.set("name", "World");
    interpreter["templateParse"] = (s: string) => s.toUpperCase();
    const expr = new Expr.Template("Hello {{name}}!", 1);
    expect(interpreter.visitTemplateExpr(expr)).toBe("Hello NAME!");
  });

  test("visitBinaryExpr", () => {
    const interpreter = new Interpreter();
    const left = new Expr.Literal(2, 1);
    const right = new Expr.Literal(3, 1);
    const ops = [
      [TokenType.Plus, 5],
      [TokenType.Minus, -1],
      [TokenType.Star, 6],
      [TokenType.Slash, 2 / 3],
      [TokenType.Percent, 2 % 3],
      [TokenType.Pipe, 2 | 3],
      [TokenType.Caret, 2 ^ 3],
      [TokenType.Greater, false],
      [TokenType.GreaterEqual, false],
      [TokenType.Less, true],
      [TokenType.LessEqual, true],
      [TokenType.EqualEqual, false],
      [TokenType.BangEqual, true],
    ];
    for (const [type, expected] of ops) {
      const expr = new Expr.Binary(left, t(type as TokenType, ""), right, 1);
      expect(interpreter.visitBinaryExpr(expr)).toEqual(expected);
    }
    // Unknown operator
    expect(() =>
      interpreter.visitBinaryExpr(
        new Expr.Binary(left, t(9999 as TokenType, "?"), right, 1)
      )
    ).toThrow();
  });

  test("visitLogicalExpr", () => {
    const interpreter = new Interpreter();
    // OR
    let expr = new Expr.Logical(
      new Expr.Literal(true, 1),
      t(TokenType.Or, "||"),
      new Expr.Literal(false, 1),
      1
    );
    expect(interpreter.visitLogicalExpr(expr)).toBe(true);
    // AND
    expr = new Expr.Logical(
      new Expr.Literal(false, 1),
      t(TokenType.And, "&&"),
      new Expr.Literal(true, 1),
      1
    );
    expect(interpreter.visitLogicalExpr(expr)).toBe(false);
    // Not short-circuited
    expr = new Expr.Logical(
      new Expr.Literal(true, 1),
      t(TokenType.And, "&&"),
      new Expr.Literal(false, 1),
      1
    );
    expect(interpreter.visitLogicalExpr(expr)).toBe(false);
  });

  test("visitTernaryExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Ternary(
      new Expr.Literal(true, 1),
      new Expr.Literal(1, 1),
      new Expr.Literal(2, 1),
      1
    );
    expect(interpreter.visitTernaryExpr(expr)).toBe(1);
  });

  test("visitNullCoalescingExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.NullCoalescing(
      new Expr.Literal(null, 1),
      new Expr.Literal(42, 1),
      1
    );
    expect(interpreter.visitNullCoalescingExpr(expr)).toBe(42);
    const expr2 = new Expr.NullCoalescing(
      new Expr.Literal("foo", 1),
      new Expr.Literal(42, 1),
      1
    );
    expect(interpreter.visitNullCoalescingExpr(expr2)).toBe("foo");
  });

  test("visitGroupingExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Grouping(new Expr.Literal(123, 1), 1);
    expect(interpreter.visitGroupingExpr(expr)).toBe(123);
  });

  test("visitLiteralExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Literal("abc", 1);
    expect(interpreter.visitLiteralExpr(expr)).toBe("abc");
  });

  test("visitUnaryExpr", () => {
    const interpreter = new Interpreter();
    // -x
    let expr = new Expr.Unary(
      t(TokenType.Minus, "-"),
      new Expr.Literal(2, 1),
      1
    );
    expect(interpreter.visitUnaryExpr(expr)).toBe(-2);
    // !x
    expr = new Expr.Unary(
      t(TokenType.Bang, "!"),
      new Expr.Literal(false, 1),
      1
    );
    expect(interpreter.visitUnaryExpr(expr)).toBe(true);
    // ++var
    interpreter.scope.set("x", 1);
    expr = new Expr.Unary(
      t(TokenType.PlusPlus, "++"),
      new Expr.Variable(t(TokenType.Identifier, "x"), 1),
      1
    );
    expect(interpreter.visitUnaryExpr(expr)).toBe(2);
    // --var
    interpreter.scope.set("y", 2);
    expr = new Expr.Unary(
      t(TokenType.MinusMinus, "--"),
      new Expr.Variable(t(TokenType.Identifier, "y"), 1),
      1
    );
    expect(interpreter.visitUnaryExpr(expr)).toBe(1);
    // ++obj.prop
    const obj = { foo: 1 };
    interpreter.scope.set("obj", obj);
    expr = new Expr.Unary(
      t(TokenType.PlusPlus, "++"),
      new Expr.Get(
        new Expr.Variable(t(TokenType.Identifier, "obj"), 1),
        new Expr.Literal("foo", 1),
        TokenType.Dot,
        1
      ),
      1
    );
    expect(interpreter.visitUnaryExpr(expr)).toBe(2);
    // Invalid LValue
    expr = new Expr.Unary(
      t(TokenType.PlusPlus, "++"),
      new Expr.Literal(1, 1),
      1
    );
    expect(() => interpreter.visitUnaryExpr(expr)).toThrow();
    // Unknown operator
    expr = new Expr.Unary(
      t(9999 as TokenType, "???"),
      new Expr.Literal(1, 1),
      1
    );
    expect(() => interpreter.visitUnaryExpr(expr)).toThrow();
  });

  test("visitCallExpr", () => {
    const interpreter = new Interpreter();
    // Regular function
    const fn = (a: number, b: number) => a + b;
    interpreter.scope.set("fn", fn);
    const expr = new Expr.Call(
      new Expr.Variable(t(TokenType.Identifier, "fn"), 1),
      t(TokenType.RightParen, ")"),
      [new Expr.Literal(1, 1), new Expr.Literal(2, 1)],
      1
    );
    expect(interpreter.visitCallExpr(expr)).toBe(3);
    // Not a function
    interpreter.scope.set("notFn", 123);
    const badExpr = new Expr.Call(
      new Expr.Variable(t(TokenType.Identifier, "notFn"), 1),
      t(TokenType.RightParen, ")"),
      [],
      1
    );
    expect(() => interpreter.visitCallExpr(badExpr)).toThrow();
    // Method call with 'this'
    const obj = {
      x: 10,
      getX(this: any) {
        return this.x;
      },
    };
    interpreter.scope.set("obj", obj);
    const getExpr = new Expr.Get(
      new Expr.Variable(t(TokenType.Identifier, "obj"), 1),
      new Expr.Literal("getX", 1),
      TokenType.Dot,
      1
    );
    const callExpr = new Expr.Call(
      getExpr,
      t(TokenType.RightParen, ")"),
      [],
      1
    );
    getExpr.entity.result = obj;
    expect(interpreter.visitCallExpr(callExpr)).toBe(10);
  });

  test("visitNewExpr", () => {
    const interpreter = new Interpreter();
    function Foo(this: any, x: number) {
      this.x = x;
    }
    const call = new Expr.Call(
      new Expr.Literal(Foo, 1),
      t(TokenType.RightParen, ")"),
      [new Expr.Literal(5, 1)],
      1
    );
    const expr = new Expr.New(call, 1);
    const instance = interpreter.visitNewExpr(expr);
    expect(instance).toBeInstanceOf(Foo);
    expect(instance.x).toBe(5);
    // Not a constructor
    const badCall = new Expr.Call(
      new Expr.Literal(123, 1),
      t(TokenType.RightParen, ")"),
      [],
      1
    );
    const badExpr = new Expr.New(badCall, 1);
    expect(() => interpreter.visitNewExpr(badExpr)).toThrow();
  });

  test("visitDictionaryExpr", () => {
    const interpreter = new Interpreter();
    const prop = new Expr.Set(
      null,
      new Expr.Literal("foo", 1),
      new Expr.Literal(42, 1),
      1
    );
    const expr = new Expr.Dictionary([prop], 1);
    expect(interpreter.visitDictionaryExpr(expr)).toEqual({ foo: 42 });
  });

  test("visitTypeofExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Typeof(new Expr.Literal(123, 1), 1);
    expect(interpreter.visitTypeofExpr(expr)).toBe("number");
  });

  test("visitEachExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Each(
      t(TokenType.Identifier, "item"),
      null,
      new Expr.Literal([1, 2], 1),
      1
    );
    expect(interpreter.visitEachExpr(expr)).toEqual(["item", null, [1, 2]]);
    const expr2 = new Expr.Each(
      t(TokenType.Identifier, "v"),
      t(TokenType.Identifier, "k"),
      new Expr.Literal({ a: 1 }, 1),
      1
    );
    expect(interpreter.visitEachExpr(expr2)).toEqual(["v", "k", { a: 1 }]);
  });

  test("visitVoidExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Void(new Expr.Literal(1, 1), 1);
    expect(interpreter.visitVoidExpr(expr)).toBe("");
  });

  test("visitDebugExpr", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Debug(new Expr.Literal(123, 1), 1);
    const spy = vi.spyOn(console, "log");
    expect(interpreter.visitDebugExpr(expr)).toBe("");
    expect(spy).toHaveBeenCalledWith(123);
    spy.mockRestore();
  });

  test("evaluate stores result", () => {
    const interpreter = new Interpreter();
    const expr = new Expr.Literal(42, 1);
    expect(interpreter.evaluate(expr)).toBe(42);
    expect(expr.result).toBe(42);
  });

  test("error throws", () => {
    const interpreter = new Interpreter();
    expect(() => interpreter.error("fail")).toThrow(/fail/);
  });
});
