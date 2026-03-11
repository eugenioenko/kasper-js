import { describe, it, expect, vi } from "vitest";
import { signal, effect } from "../src/signal";

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
});
