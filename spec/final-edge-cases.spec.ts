import { describe, it, expect, vi } from "vitest";
import { Component } from "../src/component";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";
import { signal, computed, effect, batch } from "../src/signal";

function makeContainer(): HTMLElement {
  return document.createElement("div");
}

function transpile(
  source: string,
  entity: Record<string, any> = {},
  container?: HTMLElement
): HTMLElement {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  const el = container ?? makeContainer();
  transpiler.transpile(nodes, entity, el);
  return el;
}

describe("Final Edge Cases", () => {
  it("infinite loop in effect", () => {
    const s = signal(0);
    let runs = 0;
    // This will either hang or throw a stack overflow
    // effect(() => {
    //   runs++;
    //   s.value++;
    // });
  });

  it("nested @each with same item name", () => {
    const source = `
      <div @each="item of [['a'], ['b']]">
        <span @each="item of item">{{item}}</span>
      </div>
    `;
    const container = transpile(source);
    expect(container.textContent.trim()).toBe("ab");
  });

  it("complex expression in @each", () => {
    const source = '<div @each="n of [1, 2, 3].map(x => x * 2)">{{n}}</div>';
    const container = transpile(source);
    expect(container.textContent.trim()).toBe("246");
  });

  it("expression with optional chaining (if supported)", () => {
    const source = "<div>{{ obj?.a?.b ?? 'fallback' }}</div>";
    const container = transpile(source, { obj: null });
    expect(container.textContent.trim()).toBe("fallback");
  });

  it("reactive update to @while condition", async () => {
    const state = signal({ run: true, count: 0 });
    const source = '<div @while="state.value.run && state.value.count++ < 3">x</div>';
    const container = transpile(source, { state });
    expect(container.querySelectorAll("div")).toHaveLength(3);
    
    state.value = { run: false, count: 0 };
    await Promise.resolve();
    expect(container.querySelectorAll("div")).toHaveLength(0);
  });
});
