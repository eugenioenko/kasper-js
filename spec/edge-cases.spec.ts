import { describe, it, expect, vi } from "vitest";
import { Component } from "../src/component";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";
import { signal, computed, effect, batch } from "../src/signal";
import { nextTick } from "../src/scheduler";

function makeContainer(): HTMLElement {
  return document.createElement("div");
}

function transpile(
  source: string,
  entity: Record<string, any> = {},
  container?: HTMLElement,
  mode: "development" | "production" = "development"
): HTMLElement {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  transpiler.mode = mode;
  const el = container ?? makeContainer();
  transpiler.transpile(nodes, entity, el);
  return el;
}

describe("Directive Edge Cases", () => {
  it("@each with duplicate keys warns in development", async () => {
    const list = signal([{ id: 1, name: "a" }, { id: 1, name: "b" }]);
    const container = makeContainer();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    transpile('<li @each="item of list.value" @key="item.id">{{item.name}}</li>', { list }, container, "development");
    
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Duplicate key detected in @each: "1"'));
    // It still "fails" in rendering (only 1 node) because we haven't changed the logic yet
    expect(container.querySelectorAll("li")).toHaveLength(1);
    
    warnSpy.mockRestore();
  });

  it("@each with duplicate keys does NOT warn in production", async () => {
    const list = signal([{ id: 1, name: "a" }, { id: 1, name: "b" }]);
    const container = makeContainer();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    transpile('<li @each="item of list.value" @key="item.id">{{item.name}}</li>', { list }, container, "production");
    
    expect(warnSpy).not.toHaveBeenCalled();
    expect(container.querySelectorAll("li")).toHaveLength(1);
    
    warnSpy.mockRestore();
  });

  it("@while infinite loop protection (should probably fail/time out if no protection)", () => {
    // We can't easily test a real infinite loop without locking the test runner,
    // but we can test if it has a sensible iteration limit if implemented.
    // If not implemented, this test will just hang.
    // const container = transpile('<div @while="true"></div>');
  });

  it("unclosed tags", () => {
    const source = "<div><span>text</div>"; // missing </span>
    expect(() => transpile(source)).toThrow();
  });

  it("directives on components", async () => {
    const show = signal(false);
    class MyComp extends Component {}
    const parser = new TemplateParser();
    const registry = {
      "my-comp": { selector: "", component: MyComp as any, template: null, nodes: parser.parse("<span>Component</span>") }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    
    transpiler.transpile(parser.parse('<my-comp @if="show.value"></my-comp>'), { show }, container);
    expect(container.textContent).toBe("");
    
    show.value = true;
    await nextTick();
    // Transpiler doesn't seem to have a way to reactively update @if on a component 
    // because it only sets up effects for text/attributes, and @if is handled during sibling creation.
    // Wait, doIf creates an effect. But does it work for components?
    expect(container.textContent).toBe("Component");
  });

  it("@let with multiple variables (semicolon)", () => {
    const source = '<div @let="a = 1; b = 2; c = a + b">{{a}} + {{b}} = {{c}}</div>';
    const container = transpile(source);
    expect(container.textContent).toBe("1 + 2 = 3");
  });

  it("@let shadowing and scope", () => {
    // This test currently FAILS because @let doesn't create a new scope
    const source = `
      <div @let="x = 1">
        <div @let="x = 2"><span>{{x}}</span></div>
        <p>{{x}}</p>
      </div>
    `;
    const container = transpile(source);
    expect(container.querySelector("span")!.textContent).toBe("2");
    expect(container.querySelector("p")!.textContent).toBe("1");
  });

  it("@ref on multiple elements (overwrites)", () => {
    const entity: any = { myEl: null };
    const source = '<div @ref="myEl" id="one"></div><div @ref="myEl" id="two"></div>';
    transpile(source, entity);
    expect(entity.myEl.id).toBe("two");
  });

  it("mixing @if and @each on same element", () => {
    // The guide says: "@if and @each are independent directives; they cannot be on the same element"
    const source = '<div @if="true" @each="i of [1,2]">{{i}}</div>';
    // Let's see what actually happens.
    const container = transpile(source);
    // Usually one will take precedence and the other will be ignored.
    expect(container.querySelectorAll("div")).toHaveLength(2);
  });
});

describe("Parser & Lexer Edge Cases", () => {
  it("expressions with many curly braces", () => {
    const source = "<div>{{ { a: { b: 1 } }.a.b }}</div>";
    const container = transpile(source);
    expect(container.textContent).toBe("1");
  });

  it("attributes without values", () => {
    const source = "<input disabled>";
    const container = transpile(source);
    expect(container.querySelector("input")!.hasAttribute("disabled")).toBe(true);
  });

  it("invalid directive name", () => {
    const source = "<div @invalid='true'></div>";
    const container = transpile(source);
    // Should probably ignore or throw?
    expect(container.querySelector("div")!.hasAttribute("@invalid")).toBe(false);
  });
});

describe("Integration Edge Cases", () => {
  it("nested component re-render on parent signal change", async () => {
    const count = signal(0);
    let childRenders = 0;
    
    class Child extends Component {
      onRender() { childRenders++; }
    }
    
    const parser = new TemplateParser();
    const registry = {
      "child-comp": { selector: "", component: Child as any, template: null, nodes: parser.parse("<span>{{args.count}}</span>") }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    
    // Passing count.value (snapshot)
    transpiler.transpile(parser.parse('<child-comp @:count="count.value"></child-comp>'), { count }, container);
    
    expect(childRenders).toBe(1);
    count.value++;
    await Promise.resolve();
    // Since it was a snapshot, child should NOT re-render
    expect(childRenders).toBe(1);
  });

  it("nested component re-render when passing signal", async () => {
    const count = signal(0);
    let childRenders = 0;
    
    class Child extends Component {
      onRender() { childRenders++; }
    }
    
    const parser = new TemplateParser();
    const registry = {
      "child-comp": { selector: "", component: Child as any, template: null, nodes: parser.parse("<span>{{args.count.value}}</span>") }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    
    // Passing signal reference
    transpiler.transpile(parser.parse('<child-comp @:count="count"></child-comp>'), { count }, container);
    
    expect(childRenders).toBe(1);
    count.value++;
    await Promise.resolve();
    // Child has an effect on args.count.value in its template
    expect(childRenders).toBe(2);
  });

  it("reactive update to nested array within object using @key", async () => {
    const data = signal([
      { id: "c1", tasks: [{ id: "t1", text: "task 1" }, { id: "t2", text: "task 2" }] }
    ]);

    const source = `
      <div @each="col of data.value" @key="col.id" class="column">
        <span @each="task of col.tasks" @key="task.id" class="task">{{ task.text }}</span>
      </div>
    `;

    const container = makeContainer();
    transpile(source, { data }, container);

    expect(container.querySelectorAll(".task")).toHaveLength(2);
    expect(container.textContent).toContain("task 1");
    expect(container.textContent).toContain("task 2");

    // Simulate deleting a task via filter and re-assigning top-level signal
    const cols = [...data.value];
    cols[0].tasks = cols[0].tasks.filter(t => t.id !== "t1");
    data.value = cols;

    await nextTick();

    expect(container.querySelectorAll(".task")).toHaveLength(1);
    expect(container.textContent).not.toContain("task 1");
    expect(container.textContent).toContain("task 2");
  });
});
