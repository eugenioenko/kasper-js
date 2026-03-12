import { describe, it, expect, vi } from "vitest";
import { signal, effect, computed, batch } from "../src/signal";

describe("Signals", () => {
  it("holds a value", () => {
    const s = signal(10);
    expect(s.value).toBe(10);
  });

  it("updates value", () => {
    const s = signal(10);
    s.value = 20;
    expect(s.value).toBe(20);
  });

  it("triggers effect on change", () => {
    const s = signal(10);
    let result = 0;
    effect(() => {
      result = s.value;
    });
    expect(result).toBe(10);
    s.value = 42;
    expect(result).toBe(42);
  });

  it("tracks multiple dependencies", () => {
    const a = signal(1);
    const b = signal(2);
    let sum = 0;
    effect(() => {
      sum = a.value + b.value;
    });
    expect(sum).toBe(3);
    a.value = 10;
    expect(sum).toBe(12);
    b.value = 20;
    expect(sum).toBe(30);
  });

  it("works with nested effects", () => {
    const parent = signal("p");
    const child = signal("c");
    const spy = vi.fn();

    effect(() => {
      parent.value; // subscribe parent
      effect(() => {
        child.value; // subscribe child
        spy();
      });
    });

    expect(spy).toHaveBeenCalledTimes(1);
    child.value = "c2";
    expect(spy).toHaveBeenCalledTimes(2);
    parent.value = "p2";
    // Parent re-run triggers a new child effect
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("computed updates when dependencies change", () => {
    const firstName = signal("John");
    const lastName = signal("Doe");
    const fullName = computed(() => `${firstName.value} ${lastName.value}`);

    expect(fullName.value).toBe("John Doe");

    firstName.value = "Jane";
    expect(fullName.value).toBe("Jane Doe");

    lastName.value = "Smith";
    expect(fullName.value).toBe("Jane Smith");
  });

  it("toString returns string representation of value", () => {
    expect(signal(42).toString()).toBe("42");
    expect(signal("hello").toString()).toBe("hello");
    expect(signal(true).toString()).toBe("true");
  });

  it("peek returns value without tracking dependencies", () => {
    const s = signal(99);
    let effectRuns = 0;
    effect(() => {
      effectRuns++;
      // read via peek — should NOT subscribe
      s.peek();
    });
    expect(effectRuns).toBe(1);
    s.value = 100;
    // effect should not re-run because peek was used, not .value
    expect(effectRuns).toBe(1);
    expect(s.peek()).toBe(100);
  });

  it("effect disposer stops re-runs after cleanup", () => {
    const s = signal(0);
    let runs = 0;
    const dispose = effect(() => {
      s.value;
      runs++;
    });
    expect(runs).toBe(1);
    s.value = 1;
    expect(runs).toBe(2);
    dispose();
    s.value = 2;
    // should not re-run after disposal
    expect(runs).toBe(2);
  });

  it("does not notify subscribers when value is set to the same value", () => {
    const s = signal("same");
    let runs = 0;
    effect(() => { s.value; runs++; });
    expect(runs).toBe(1);
    s.value = "same";
    expect(runs).toBe(1);
  });

  describe("batch", () => {
    it("flushes all effects once after all writes", () => {
      const a = signal(0);
      const b = signal(0);
      let runs = 0;
      effect(() => { a.value; b.value; runs++; });
      expect(runs).toBe(1);

      batch(() => {
        a.value = 1;
        b.value = 2;
      });

      expect(runs).toBe(2);
      expect(a.value).toBe(1);
      expect(b.value).toBe(2);
    });

    it("flushes onChange watchers once with final value", () => {
      const s = signal(0);
      const calls: [number, number][] = [];
      s.onChange((n, o) => calls.push([n, o]));

      batch(() => {
        s.value = 1;
        s.value = 2;
      });

      expect(calls).toEqual([[1, 0], [2, 1]]);
    });

    it("deduplicates effects triggered by multiple signals", () => {
      const a = signal(0);
      const b = signal(0);
      let runs = 0;
      effect(() => { a.value + b.value; runs++; });
      expect(runs).toBe(1);

      batch(() => {
        a.value = 10;
        b.value = 20;
      });

      expect(runs).toBe(2);
    });
  });

  describe("onChange", () => {
    it("calls the watcher with new and old values on change", () => {
      const s = signal(1);
      const calls: [number, number][] = [];
      s.onChange((n, o) => calls.push([n, o]));
      s.value = 2;
      s.value = 3;
      expect(calls).toEqual([[2, 1], [3, 2]]);
    });

    it("does not fire when value is set to the same value", () => {
      const s = signal("a");
      const spy = vi.fn();
      s.onChange(spy);
      s.value = "a";
      expect(spy).not.toHaveBeenCalled();
    });

    it("does not fire immediately — only on subsequent changes", () => {
      const s = signal(42);
      const spy = vi.fn();
      s.onChange(spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it("stop function removes the watcher", () => {
      const s = signal(0);
      const spy = vi.fn();
      const stop = s.onChange(spy);
      s.value = 1;
      expect(spy).toHaveBeenCalledTimes(1);
      stop();
      s.value = 2;
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
