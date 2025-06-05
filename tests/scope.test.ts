import { expect, describe, test } from "vitest";
import { Scope } from "@src/scope";

describe("Scope", () => {
  test("creates a scope instance", () => {
    const scope = new Scope();
    expect(scope).toBeInstanceOf(Scope);
  });

  test("set and get value in scope", () => {
    const scope = new Scope();
    scope.set("foo", 42);
    expect(scope.get("foo")).toBe(42);
  });

  test("get value from parent scope", () => {
    const parent = new Scope();
    parent.set("bar", "baz");
    const child = new Scope(parent);
    expect(child.get("bar")).toBe("baz");
  });

  test("init resets values", () => {
    const scope = new Scope();
    scope.set("a", 1);
    scope.init({ b: 2 });
    expect(scope.get("a")).toBeUndefined();
    expect(scope.get("b")).toBe(2);
  });

  test("constructor with entity sets values", () => {
    const scope = new Scope(undefined, { x: 10 });
    expect(scope.get("x")).toBe(10);
  });

  test("get returns window property if not found in scope or parent", () => {
    const scope = new Scope();
    // Use a property that is always on window in browsers, e.g. 'Array'
    if (typeof window !== "undefined") {
      expect(scope.get("Array")).toBe(window.Array);
    } else {
      expect(scope.get("Array")).toBeUndefined();
    }
  });

  test("get returns undefined if not found anywhere and window is not defined", () => {
    // Simulate no window by temporarily deleting it if possible
    const scope = new Scope();
    // This test is only meaningful in non-browser environments
    if (typeof window === "undefined") {
      expect(scope.get("notfound" as any)).toBeUndefined();
    }
  });

  test("parent can be null", () => {
    const scope = new Scope(null, { foo: 1 });
    expect(scope.get("foo")).toBe(1);
  });

  test("set overwrites existing value", () => {
    const scope = new Scope();
    scope.set("foo", 1);
    scope.set("foo", 2);
    expect(scope.get("foo")).toBe(2);
  });

  test("init with no argument resets to empty object", () => {
    const scope = new Scope();
    scope.set("foo", 1);
    scope.init();
    expect(scope.get("foo")).toBeUndefined();
  });

  test("set/get with falsy values", () => {
    const scope = new Scope();
    scope.set("zero", 0);
    scope.set("empty", "");
    scope.set("no", false);
    scope.set("nul", null);
    expect(scope.get("zero")).toBe(0);
    expect(scope.get("empty")).toBe("");
    expect(scope.get("no")).toBe(false);
    expect(scope.get("nul")).toBe(null);
  });

  test("deep parent chain lookup", () => {
    const root = new Scope(undefined, { a: 1 });
    const mid = new Scope(root, { b: 2 });
    const leaf = new Scope(mid, { c: 3 });
    expect(leaf.get("a")).toBe(1);
    expect(leaf.get("b")).toBe(2);
    expect(leaf.get("c")).toBe(3);
  });
});
