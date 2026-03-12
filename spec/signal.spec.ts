import { describe, it, expect, vi } from "vitest";
import { signal, effect, computed } from "../src/signal";

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
});
