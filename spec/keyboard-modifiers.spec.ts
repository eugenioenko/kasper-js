
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";

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

describe("Keyboard Modifiers", () => {
  it("should support .enter modifier", () => {
    let called = false;
    const container = transpile('<input @on:keydown.enter="handler()" />', {
      handler: () => { called = true; }
    });
    const input = container.querySelector("input")!;

    // Dispatch a non-enter key
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(called).toBe(false);

    // Dispatch enter key
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(called).toBe(true);
  });

  it("should support .escape modifier", () => {
    let called = false;
    const container = transpile('<input @on:keydown.escape="handler()" />', {
      handler: () => { called = true; }
    });
    const input = container.querySelector("input")!;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(called).toBe(false);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(called).toBe(true);
  });

  it("should support multiple keyboard modifiers", () => {
    let calledCount = 0;
    const container = transpile('<input @on:keydown.enter.escape="handler()" />', {
      handler: () => { calledCount++; }
    });
    const input = container.querySelector("input")!;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(calledCount).toBe(1);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(calledCount).toBe(2);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    expect(calledCount).toBe(2);
  });

  it("should support .delete modifier (Delete only)", () => {
    let calledCount = 0;
    const container = transpile('<input @on:keydown.delete="handler()" />', {
      handler: () => { calledCount++; }
    });
    const input = container.querySelector("input")!;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
    expect(calledCount).toBe(1);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    expect(calledCount).toBe(1); // Backspace should NOT trigger .delete now

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(calledCount).toBe(1);
  });

  it("should support system modifiers (.ctrl, .shift)", () => {
    let called = false;
    const container = transpile('<button @on:click.ctrl="handler()"></button>', {
      handler: () => { called = true; }
    });
    const button = container.querySelector("button")!;

    button.dispatchEvent(new MouseEvent("click", { ctrlKey: false }));
    expect(called).toBe(false);

    button.dispatchEvent(new MouseEvent("click", { ctrlKey: true }));
    expect(called).toBe(true);

    called = false;
    const container2 = transpile('<button @on:click.ctrl.shift="handler()"></button>', {
      handler: () => { called = true; }
    });
    const button2 = container2.querySelector("button")!;

    button2.dispatchEvent(new MouseEvent("click", { ctrlKey: true, shiftKey: false }));
    expect(called).toBe(false);

    button2.dispatchEvent(new MouseEvent("click", { ctrlKey: true, shiftKey: true }));
    expect(called).toBe(true);
  });

  it("should support fallback key matching (letters and numbers)", () => {
    let called = false;
    const container = transpile('<input @on:keydown.a="handler()" />', {
      handler: () => { called = true; }
    });
    const input = container.querySelector("input")!;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
    expect(called).toBe(false);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(called).toBe(true);

    called = false;
    const container2 = transpile('<input @on:keydown.1="handler()" />', {
      handler: () => { called = true; }
    });
    const input2 = container2.querySelector("input")!;

    input2.dispatchEvent(new KeyboardEvent("keydown", { key: "2" }));
    expect(called).toBe(false);

    input2.dispatchEvent(new KeyboardEvent("keydown", { key: "1" }));
    expect(called).toBe(true);
  });

  it("should support symbol aliases (dot, comma, etc.)", () => {
    let called = false;
    const container = transpile('<input @on:keydown.dot="handler()" />', {
      handler: () => { called = true; }
    });
    const input = container.querySelector("input")!;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "," }));
    expect(called).toBe(false);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "." }));
    expect(called).toBe(true);
  });

  it("should support cased key modifiers (.Enter, .ArrowUp)", () => {
    let calledCount = 0;
    const container = transpile('<input @on:keydown.Enter.ArrowUp="handler()" />', {
      handler: () => { calledCount++; }
    });
    const input = container.querySelector("input")!;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(calledCount).toBe(1);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    expect(calledCount).toBe(2);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(calledCount).toBe(2);
  });
});
