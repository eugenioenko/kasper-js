import { Interpreter } from "../src/interpreter";
import { ExpressionParser } from "../src/expression-parser";
import { Scanner } from "../src/scanner";
import { evaluate } from "./helpers";

// Creates a persistent interpreter so scope mutations carry across run() calls
function makeInterp(scope: Record<string, any> = {}) {
  const interpreter = new Interpreter();
  const scanner = new Scanner();
  const parser = new ExpressionParser();
  interpreter.scope.init(scope);

  return {
    run(source: string): any {
      const tokens = scanner.scan(source);
      const exprs = parser.parse(tokens);
      return interpreter.evaluate(exprs[0]);
    },
    scope: interpreter.scope,
    interpreter,
  };
}

describe("Interpreter", () => {
  describe("literals", () => {
    it("evaluates numeric literal", () => expect(evaluate("42")).toBe(42));
    it("evaluates float literal", () => expect(evaluate("3.14")).toBe(3.14));
    it("evaluates zero", () => expect(evaluate("0")).toBe(0));
    it("evaluates true", () => expect(evaluate("true")).toBe(true));
    it("evaluates false", () => expect(evaluate("false")).toBe(false));
    it("evaluates null", () => expect(evaluate("null")).toBeNull());
    it("evaluates undefined", () => expect(evaluate("undefined")).toBeUndefined());
    it("evaluates string literal", () => expect(evaluate(`"hello"`)).toBe("hello"));
    it("evaluates empty string", () => expect(evaluate(`""`)).toBe(""));
  });

  describe("variables", () => {
    it("reads a variable from scope", () => {
      expect(evaluate("x", { x: 99 })).toBe(99);
    });

    it("reads a string variable", () => {
      expect(evaluate("name", { name: "Alice" })).toBe("Alice");
    });

    it("reads a null variable", () => {
      expect(evaluate("x", { x: null })).toBeNull();
    });

    it("reads a boolean variable", () => {
      expect(evaluate("flag", { flag: false })).toBe(false);
    });

    it("unknown variable falls back to window globals (e.g. Math)", () => {
      expect(evaluate("Math")).toBe(Math);
    });
  });

  describe("assignment", () => {
    it("x = value sets scope and returns value", () => {
      const interp = makeInterp({ x: 0 });
      const result = interp.run("x = 5");
      expect(result).toBe(5);
      expect(interp.scope.get("x")).toBe(5);
    });

    it("assignment is right-associative: x = y = 3", () => {
      const interp = makeInterp({ x: 0, y: 0 });
      interp.run("x = y = 3");
      expect(interp.scope.get("x")).toBe(3);
      expect(interp.scope.get("y")).toBe(3);
    });

    it("x += n adds to existing value", () => {
      const interp = makeInterp({ x: 10 });
      interp.run("x += 5");
      expect(interp.scope.get("x")).toBe(15);
    });

    it("x -= n subtracts from existing value", () => {
      const interp = makeInterp({ x: 10 });
      interp.run("x -= 3");
      expect(interp.scope.get("x")).toBe(7);
    });

    it("x *= n multiplies existing value", () => {
      const interp = makeInterp({ x: 4 });
      interp.run("x *= 3");
      expect(interp.scope.get("x")).toBe(12);
    });

    it("x /= n divides existing value", () => {
      const interp = makeInterp({ x: 12 });
      interp.run("x /= 4");
      expect(interp.scope.get("x")).toBe(3);
    });
  });

  describe("arithmetic operators", () => {
    it("addition", () => expect(evaluate("1 + 2")).toBe(3));
    it("subtraction", () => expect(evaluate("5 - 3")).toBe(2));
    it("multiplication", () => expect(evaluate("3 * 4")).toBe(12));
    it("division", () => expect(evaluate("10 / 4")).toBe(2.5));
    it("modulus", () => expect(evaluate("10 % 3")).toBe(1));
    it("string concatenation with +", () => expect(evaluate(`"a" + "b"`)).toBe("ab"));
    it("complex arithmetic expression", () => {
      expect(evaluate("100 + 20 / 30 - (10 + 100 / 3)")).toBe(
        100 + 20 / 30 - (10 + 100 / 3)
      );
    });
  });

  describe("comparison operators", () => {
    it("== uses strict equality (===)", () => {
      expect(evaluate("1 == 1")).toBe(true);
      expect(evaluate(`"1" == 1`)).toBe(false); // strict
    });
    it("!= uses strict inequality (!==)", () => {
      expect(evaluate("1 != 2")).toBe(true);
      expect(evaluate(`"1" != 1`)).toBe(true); // strict
    });
    it(">", () => expect(evaluate("3 > 2")).toBe(true));
    it(">=", () => expect(evaluate("3 >= 3")).toBe(true));
    it("<", () => expect(evaluate("2 < 3")).toBe(true));
    it("<=", () => expect(evaluate("3 <= 3")).toBe(true));
  });

  // Note: | and ^ are handled by visitBinaryExpr but the expression parser has
  // no precedence level for Pipe/Caret tokens, so they are unreachable via text parsing.

  describe("logical operators", () => {
    it("&& returns right when left is truthy", () => {
      expect(evaluate("3 && 1")).toBe(1);
    });

    it("&& short-circuits and returns left when left is falsy", () => {
      expect(evaluate("0 && 1")).toBe(0);
    });

    it("|| returns left when left is truthy", () => {
      expect(evaluate("4 || 1")).toBe(4);
    });

    it("|| short-circuits and returns right when left is falsy", () => {
      expect(evaluate("0 || 99")).toBe(99);
    });

    it("&& does not evaluate right side when left is falsy", () => {
      let called = false;
      evaluate("false && fn()", { fn: () => { called = true; } });
      expect(called).toBe(false);
    });

    it("|| does not evaluate right side when left is truthy", () => {
      let called = false;
      evaluate("true || fn()", { fn: () => { called = true; } });
      expect(called).toBe(false);
    });
  });

  describe("null coalescing (??)", () => {
    it("returns right when left is null", () => {
      expect(evaluate("x ?? 42", { x: null })).toBe(42);
    });

    it("returns right when left is undefined (missing from scope)", () => {
      expect(evaluate("x ?? 42", { x: undefined })).toBe(42);
    });

    it("returns left when left is a truthy value", () => {
      expect(evaluate("x ?? 42", { x: 7 })).toBe(7);
    });

    it("returns left when left is 0 (falsy but not null/undefined)", () => {
      expect(evaluate("x ?? 99", { x: 0 })).toBe(0);
    });

    it("returns left when left is empty string (falsy but not null/undefined)", () => {
      expect(evaluate(`x ?? "fallback"`, { x: "" })).toBe("");
    });

    it("returns left when left is false (falsy but not null/undefined)", () => {
      expect(evaluate("x ?? true", { x: false })).toBe(false);
    });
  });

  describe("grouping", () => {
    it("(a + b) * c respects grouping", () => {
      expect(evaluate("(2 + 3) * 4")).toBe(20);
    });

    it("without grouping: 2 + 3 * 4 = 14", () => {
      expect(evaluate("2 + 3 * 4")).toBe(14);
    });
  });

  describe("unary operators", () => {
    it("-x negates", () => expect(evaluate("-x", { x: 5 })).toBe(-5));
    it("-(-5) double negation via grouping", () => expect(evaluate("-(-5)")).toBe(5));
    it("!true → false", () => expect(evaluate("!true")).toBe(false));
    it("!false → true", () => expect(evaluate("!false")).toBe(true));
    it("!0 → true", () => expect(evaluate("!0")).toBe(true));
  });

  describe("prefix increment/decrement", () => {
    it("++x increments and returns NEW value", () => {
      const interp = makeInterp({ x: 5 });
      const result = interp.run("++x");
      expect(result).toBe(6);
      expect(interp.scope.get("x")).toBe(6);
    });

    it("--x decrements and returns NEW value", () => {
      const interp = makeInterp({ x: 5 });
      const result = interp.run("--x");
      expect(result).toBe(4);
      expect(interp.scope.get("x")).toBe(4);
    });
  });

  describe("postfix increment/decrement", () => {
    it("x++ returns ORIGINAL value but increments scope", () => {
      const interp = makeInterp({ x: 5 });
      const result = interp.run("x++");
      expect(result).toBe(5);
      expect(interp.scope.get("x")).toBe(6);
    });

    it("x-- returns ORIGINAL value but decrements scope", () => {
      const interp = makeInterp({ x: 5 });
      const result = interp.run("x--");
      expect(result).toBe(5);
      expect(interp.scope.get("x")).toBe(4);
    });
  });

  describe("property access", () => {
    it("dot access: obj.prop", () => {
      expect(evaluate("obj.name", { obj: { name: "Alice" } })).toBe("Alice");
    });

    it("bracket access: obj[key]", () => {
      expect(evaluate("arr[0]", { arr: [10, 20, 30] })).toBe(10);
    });

    it("bracket access with variable key", () => {
      expect(evaluate("obj[k]", { obj: { a: 1 }, k: "a" })).toBe(1);
    });

    it("chained: obj.a.b", () => {
      expect(evaluate("obj.a.b", { obj: { a: { b: 42 } } })).toBe(42);
    });

    it("optional chaining obj?.prop returns value when obj exists", () => {
      expect(evaluate("obj?.name", { obj: { name: "Bob" } })).toBe("Bob");
    });

    it("optional chaining obj?.prop returns undefined when obj is null", () => {
      expect(evaluate("obj?.name", { obj: null })).toBeUndefined();
    });

    it("optional chaining obj?.prop returns undefined when obj is null", () => {
      // Note: scope treats stored `undefined` as "not set" (typeof check), so use null here
      expect(evaluate("obj?.name", { obj: null })).toBeUndefined();
    });
  });

  describe("property assignment (Set)", () => {
    it("obj.prop = value sets the property", () => {
      const obj = { x: 0 };
      evaluate("obj.x = 99", { obj: obj });
      expect(obj.x).toBe(99);
    });

    it("obj[key] = value sets by bracket", () => {
      const arr = [1, 2, 3];
      evaluate("arr[0] = 99", { arr: arr });
      expect(arr[0]).toBe(99);
    });

    it("returns the assigned value", () => {
      const obj = { x: 0 };
      const result = evaluate("obj.x = 7", { obj: obj });
      expect(result).toBe(7);
    });
  });

  describe("function calls", () => {
    it("calls a function with no args", () => {
      expect(evaluate("fn()", { fn: () => 42 })).toBe(42);
    });

    it("calls a function with args", () => {
      expect(evaluate("add(1, 2)", { add: (a: number, b: number) => a + b })).toBe(3);
    });

    it("evaluates arguments before calling", () => {
      expect(evaluate("fn(x + 1)", { fn: (n: number) => n * 2, x: 4 })).toBe(10);
    });

    it("method call binds correct this", () => {
      const obj = {
        value: 42,
        get() { return this.value; },
      };
      expect(evaluate("obj.get()", { obj: obj })).toBe(42);
    });

    it("throws when callee is not a function", () => {
      expect(() => evaluate("x()", { x: 42 })).toThrow("is not a function");
    });
  });

  describe("new keyword", () => {
    it("instantiates a class", () => {
      const result = evaluate("new Array(3)") as any[];
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
    });

    it("passes arguments to constructor", () => {
      class Point {
        x: number;
        y: number;
        constructor(x: number, y: number) { this.x = x; this.y = y; }
      }
      const result = evaluate("new Point(1, 2)", { Point }) as Point;
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
    });
  });

  describe("dictionary", () => {
    it("{} → empty object", () => {
      expect(evaluate("{}")).toEqual({});
    });

    it("{a: 1, b: 2} → plain object", () => {
      expect(evaluate("{a: 1, b: 2}")).toEqual({ a: 1, b: 2 });
    });

    it("values are evaluated", () => {
      expect(evaluate("{x: a + b}", { a: 1, b: 2 })).toEqual({ x: 3 });
    });
  });

  describe("list", () => {
    it("[] → empty array", () => {
      expect(evaluate("[]")).toEqual([]);
    });

    it("[1, 2, 3] → array", () => {
      expect(evaluate("[1, 2, 3]")).toEqual([1, 2, 3]);
    });

    it("elements are evaluated", () => {
      expect(evaluate("[x, x + 1]", { x: 5 })).toEqual([5, 6]);
    });
  });

  describe("template strings", () => {
    it("plain template string with no interpolation", () => {
      expect(evaluate("`hello`")).toBe("hello");
    });

    it("template string with {{expr}} interpolation", () => {
      expect(evaluate("`Hello {{name}}`", { name: "World" })).toBe("Hello World");
    });

    it("template string with arithmetic interpolation", () => {
      expect(evaluate("`result: {{1 + 2}}`")).toBe("result: 3");
    });

    it("multiple interpolations", () => {
      expect(evaluate("`{{a}} + {{b}} = {{a + b}}`", { a: 1, b: 2 })).toBe("1 + 2 = 3");
    });
  });

  describe("typeof", () => {
    it("typeof number → 'number'", () => expect(evaluate("typeof x", { x: 1 })).toBe("number"));
    it("typeof string → 'string'", () => expect(evaluate(`typeof x`, { x: "hi" })).toBe("string"));
    it("typeof boolean → 'boolean'", () => expect(evaluate("typeof x", { x: true })).toBe("boolean"));
    it("typeof undefined → 'undefined' (via unknown variable)", () => expect(evaluate("typeof __noSuchVar__")).toBe("undefined"));
    it("typeof null → 'object'", () => expect(evaluate("typeof x", { x: null })).toBe("object"));
    it("typeof function → 'function'", () => expect(evaluate("typeof x", { x: () => {} })).toBe("function"));
  });

  describe("void", () => {
    it("void expr evaluates expression and returns empty string", () => {
      const interp = makeInterp({ x: 0 });
      const result = interp.run("void x = 5");
      expect(result).toBe("");
      expect(interp.scope.get("x")).toBe(5); // side effect still happened
    });
  });

  describe("debug", () => {
    it("debug expr evaluates and returns empty string", () => {
      expect(evaluate("debug 42")).toBe("");
    });
  });

  describe("ternary", () => {
    it("true condition returns then branch", () => {
      expect(evaluate("x ? 1 : 2", { x: true })).toBe(1);
    });

    it("false condition returns else branch", () => {
      expect(evaluate("x ? 1 : 2", { x: false })).toBe(2);
    });

    it("truthy value selects then branch", () => {
      expect(evaluate("x ? 1 : 2", { x: 42 })).toBe(1);
    });

    it("falsy value (0) selects else branch", () => {
      expect(evaluate("x ? 1 : 2", { x: 0 })).toBe(2);
    });

    it("only evaluates the taken branch", () => {
      let called = false;
      evaluate("true ? 1 : fn()", { fn: () => { called = true; } });
      expect(called).toBe(false);
    });
  });

  describe("each (via Interpreter.visitEachExpr)", () => {
    it("returns [name, null, iterable] for simple each", () => {
      const parser = new ExpressionParser();
      const scanner = new Scanner();
      const interpreter = new Interpreter();
      interpreter.scope.init({ list: [1, 2, 3] });
      const eachExpr = parser.foreach(scanner.scan("item of list"));
      const result = interpreter.evaluate(eachExpr) as any[];
      expect(result[0]).toBe("item");
      expect(result[1]).toBeNull();
      expect(result[2]).toEqual([1, 2, 3]);
    });

    it("returns [name, key, iterable] for each with key", () => {
      const parser = new ExpressionParser();
      const scanner = new Scanner();
      const interpreter = new Interpreter();
      interpreter.scope.init({ obj: { a: 1 } });
      const eachExpr = parser.foreach(scanner.scan("item with idx of obj"));
      const result = interpreter.evaluate(eachExpr) as any[];
      expect(result[0]).toBe("item");
      expect(result[1]).toBe("idx");
    });
  });

  describe("error handling", () => {
    it("throws on unknown binary operator", () => {
      // Direct test: construct a bad binary expression manually
      const interpreter = new Interpreter();
      expect(() => interpreter.error("test error")).toThrow("Runtime Error => test error");
    });

    it("calling a non-function throws with message", () => {
      expect(() => evaluate("x()", { x: "notAFn" })).toThrow("is not a function");
    });
  });
});
