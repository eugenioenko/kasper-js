import { Scope } from "../src/scope";

describe("Scope", () => {
  describe("constructor", () => {
    it("creates empty values and null parent by default", () => {
      const scope = new Scope();
      expect(scope.values).toEqual({});
      expect(scope.parent).toBeNull();
    });

    it("accepts an initial entity", () => {
      const scope = new Scope(null, { x: 1 });
      expect(scope.values).toEqual({ x: 1 });
    });

    it("accepts a parent scope", () => {
      const parent = new Scope();
      const child = new Scope(parent);
      expect(child.parent).toBe(parent);
    });

    it("accepts both parent and entity", () => {
      const parent = new Scope();
      const child = new Scope(parent, { y: 2 });
      expect(child.parent).toBe(parent);
      expect(child.values).toEqual({ y: 2 });
    });
  });

  describe("init()", () => {
    it("sets values to the provided entity", () => {
      const scope = new Scope();
      scope.init({ a: 1, b: 2 });
      expect(scope.values).toEqual({ a: 1, b: 2 });
    });

    it("resets to empty object when called without arguments", () => {
      const scope = new Scope(null, { a: 1 });
      scope.init();
      expect(scope.values).toEqual({});
    });

    it("clears previously set values", () => {
      const scope = new Scope();
      scope.set("x", 99);
      scope.init({ y: 1 });
      expect(scope.values["x"]).toBeUndefined();
      expect(scope.values["y"]).toBe(1);
    });
  });

  describe("set()", () => {
    it("stores a value by key", () => {
      const scope = new Scope();
      scope.set("x", 42);
      expect(scope.values["x"]).toBe(42);
    });

    it("overwrites an existing value", () => {
      const scope = new Scope();
      scope.set("x", 1);
      scope.set("x", 2);
      expect(scope.values["x"]).toBe(2);
    });

    it("stores null", () => {
      const scope = new Scope();
      scope.set("x", null);
      expect(scope.values["x"]).toBeNull();
    });

    it("stores false", () => {
      const scope = new Scope();
      scope.set("x", false);
      expect(scope.values["x"]).toBe(false);
    });

    it("stores zero", () => {
      const scope = new Scope();
      scope.set("x", 0);
      expect(scope.values["x"]).toBe(0);
    });
  });

  describe("get()", () => {
    it("returns a value from the current scope", () => {
      const scope = new Scope(null, { x: 10 });
      expect(scope.get("x")).toBe(10);
    });

    it("returns null values (null is not undefined)", () => {
      const scope = new Scope(null, { x: null });
      expect(scope.get("x")).toBeNull();
    });

    it("returns false values", () => {
      const scope = new Scope(null, { x: false });
      expect(scope.get("x")).toBe(false);
    });

    it("returns zero", () => {
      const scope = new Scope(null, { x: 0 });
      expect(scope.get("x")).toBe(0);
    });

    it("walks up to parent when key not in child", () => {
      const parent = new Scope(null, { x: 99 });
      const child = new Scope(parent);
      expect(child.get("x")).toBe(99);
    });

    it("child value shadows parent value", () => {
      const parent = new Scope(null, { x: 1 });
      const child = new Scope(parent, { x: 2 });
      expect(child.get("x")).toBe(2);
    });

    it("walks up multiple levels", () => {
      const grandparent = new Scope(null, { x: 42 });
      const parent = new Scope(grandparent);
      const child = new Scope(parent);
      expect(child.get("x")).toBe(42);
    });

    it("stops at first ancestor that has the key", () => {
      const grandparent = new Scope(null, { x: 1 });
      const parent = new Scope(grandparent, { x: 2 });
      const child = new Scope(parent);
      expect(child.get("x")).toBe(2);
    });

    it("falls back to window for unknown keys", () => {
      const scope = new Scope();
      expect(scope.get("nonExistentKey_kasper_test")).toBeUndefined();
    });

    it("returns window globals for known browser APIs", () => {
      const scope = new Scope();
      expect(scope.get("Math")).toBe(Math);
    });

    it("undefined stored value falls through to parent (typeof undefined === 'undefined')", () => {
      const parent = new Scope(null, { x: "from-parent" });
      const child = new Scope(parent);
      child.set("x", undefined);
      // undefined is treated as "not set" by the lookup
      expect(child.get("x")).toBe("from-parent");
    });

    it("falls back to $imports on the component constructor", () => {
      function formatDate() { return "2026-01-01"; }
      class MyComponent { static $imports = { formatDate }; }
      const instance = new MyComponent();
      const scope = new Scope(null, instance);
      expect(scope.get("formatDate")).toBe(formatDate);
    });

    it("resolves $imports through nested child scopes", () => {
      function helper() { return 42; }
      class MyComponent { static $imports = { helper }; }
      const instance = new MyComponent();
      const root = new Scope(null, instance);
      const child = new Scope(root, { item: "x" });
      expect(child.get("helper")).toBe(helper);
    });

    it("resolves $imports when the component scope itself has a parent", () => {
      // Regression: components rendered inside another component get a scope with
      // a parent (new Scope(parentScope, componentInstance)). $imports must be
      // checked on the component scope before climbing to the parent, not only
      // at the root scope where parent === null.
      function Helper() { return 42; }
      class ChildComponent { static $imports = { Helper }; }
      const parentScope = new Scope(null, { parentValue: 1 });
      const componentInstance = new ChildComponent();
      const componentScope = new Scope(parentScope, componentInstance);
      expect(componentScope.get("Helper")).toBe(Helper);
    });

    it("component instance property takes priority over $imports", () => {
      function helper() { return "from-imports"; }
      class MyComponent {
        static $imports = { helper };
        helper = () => "from-instance";
      }
      const instance = new MyComponent();
      const scope = new Scope(null, instance);
      expect(scope.get("helper")()).toBe("from-instance");
    });
  });
});
