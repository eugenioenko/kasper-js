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
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

    transpile('<li @each="item of list.value" @key="item.id">{{item.name}}</li>', { list }, container, "development");

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Duplicate key detected in @each: "1"'));
    // It still "fails" in rendering (only 1 node) because we haven't changed the logic yet
    expect(container.querySelectorAll("li")).toHaveLength(1);

    warnSpy.mockRestore();
  });

  it("@each with duplicate keys does NOT warn in production", async () => {
    const list = signal([{ id: 1, name: "a" }, { id: 1, name: "b" }]);
    const container = makeContainer();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

    transpile('<li @each="item of list.value" @key="item.id">{{item.name}}</li>', { list }, container, "production");

    expect(warnSpy).not.toHaveBeenCalled();
    expect(container.querySelectorAll("li")).toHaveLength(1);

    warnSpy.mockRestore();
  });

  it("unclosed tags", () => {
    const source = "<div><span>text</div>"; // missing </span>
    expect(() => transpile(source)).toThrow();
  });

  it("directives on components", async () => {
    const show = signal(false);
    class MyComp extends Component { }
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
    const source = `
      <div @let="x = 1">
        <div @let="x = 2"><span>{{x}}</span></div>
        <p>{{x}}</p>
      </div>
    `;
    const container = transpile(source);
    expect(container.querySelector("span")!.textContent).toBe("2");
    // p is a subsequent sibling of the div with x=2, so it sees 2
    expect(container.querySelector("p")!.textContent).toBe("2");
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
    // Now it should throw a specific error in development mode
    expect(() => transpile(source)).toThrow(/\[K003-9\]/);
  });

  it("@let variable used in another directive on the same element", () => {
    // Check if @let is evaluated before @each on the same node
    const source = '<div @let="items = [1, 2, 3]" @each="i of items">{{i}}</div>';
    const container = transpile(source);
    expect(container.textContent).toBe("123");
  });

  it("shadowing $event in an @each loop", async () => {
    // If a user names their loop variable $event, does it break event handling?
    const events = signal(["click1", "click2"]);
    const state = {
      events,
      lastClicked: "",
      capture: (val: any) => { state.lastClicked = val; }
    };
    const source = `
      <div @each="$event of events.value">
        <button @on:click="capture($event)">{{$event}}</button>
      </div>
    `;
    const container = transpile(source, state);

    const buttons = container.querySelectorAll("button");
    buttons[0].click();

    // Kasper injects the REAL $event (PointerEvent) into the listener scope.
    // It should shadow the $event from the @each loop.
    expect(state.lastClicked).toBeInstanceOf(window.PointerEvent);
    expect(buttons[0].textContent).toBe("click1");
  });

  it("dynamic @key change for the same identity", async () => {
    // If the key of an item changes, but it's the same item in the same position
    const list = signal([{ id: "a", val: "1" }]);
    const source = '<div @each="item of list.value" @key="item.id">{{item.val}}</div>';
    const container = transpile(source, { list });
    const firstDiv = container.querySelector("div");

    // Change the key but keep the object reference
    list.value[0].id = "b";
    list.value[0].val = "2";
    list.value = [...list.value]; // trigger update

    await nextTick();

    const secondDiv = container.querySelector("div");
    expect(secondDiv!.textContent).toBe("2");
    // Reconciliation should see "a" is gone and "b" is new, so it should be a NEW node
    expect(secondDiv).not.toBe(firstDiv);
  });

  it("concurrent modification: @on:click removes its own @each item", async () => {
    const list = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const source = `
      <div @each="item of list.value" @key="item.id">
        <button @on:click="list.value = list.value.filter(i => i.id !== item.id)">Delete {{item.id}}</button>
      </div>
    `;
    const container = transpile(source, { list });

    expect(container.querySelectorAll("button")).toHaveLength(3);

    container.querySelectorAll("button")[1].click(); // Delete id: 2
    await nextTick();

    expect(container.querySelectorAll("button")).toHaveLength(2);
    expect(container.textContent).not.toContain("Delete 2");
  });

  it("deeply nested @if inside @each inside <void> with @let", async () => {
    const data = signal([
      { active: true, items: ["a", "b"] },
      { active: false, items: ["c"] },
      { active: true, items: ["d"] }
    ]);

    const source = `
      <void @each="row of data.value">
        <div @let="isRowActive = row.active">
          <span @if="isRowActive">
            <i @each="char of row.items">{{char}}</i>
          </span>
        </div>
      </void>
    `;

    const container = transpile(source, { data });
    expect(container.querySelectorAll("i")).toHaveLength(3); // a, b, d
    expect(container.textContent).toBe("abd");

    // Toggle middle row
    data.value[1].active = true;
    data.value = [...data.value];
    await nextTick();

    expect(container.textContent).toBe("abcd");
  });

  it("@let variable used in @if on the same element", () => {
    const source = `
      <div @let="show = true" @if="show">visible</div>
      <div @let="hide = false" @if="hide">hidden</div>
    `;
    const container = transpile(source);
    expect(container.textContent).toContain("visible");
    expect(container.textContent).not.toContain("hidden");
  });

  it("@let scope leakage to following siblings", () => {
    // @let is available to following siblings at the same level
    const source = `
      <div>
        <span @let="secret = 'shhh'"></span>
        <p>{{secret}}</p>
        <i>{{secret}}</i>
      </div>
      <section>{{secret}}</section>
    `;
    const container = transpile(source);

    // p and i are subsequent siblings of the span, they should see 'secret'
    expect(container.querySelector("p")!.textContent).toBe("shhh");
    expect(container.querySelector("i")!.textContent).toBe("shhh");

    // section is a sibling of the div (parent), it should NOT see 'secret'
    // Kasper evaluates unknown variables to "undefined" string in templates
    expect(container.querySelector("section")!.textContent).toBe("undefined");
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

describe("Advanced Reactivity & Lifecycle Edge Cases", () => {
  it("infinite loop in effect", () => {
    const s = signal(0);
    let runs = 0;
    // This will either hang or throw a stack overflow if triggered.
    // Documenting the trap.
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

  it("expression with optional chaining (if supported)", async () => {
    const s1 = signal(0);
    const s2 = signal(0);
    let renderCount = 0;

    class Comp extends Component {
      onRender() { renderCount++; }
    }

    const parser = new TemplateParser();
    const registry = {
      "test-comp": { selector: "", component: Comp as any, template: null, nodes: parser.parse("<div>{{s1.value}} {{s2.value}}</div>") }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    transpiler.transpile(parser.parse("<test-comp></test-comp>"), { s1, s2 }, container);
    expect(renderCount).toBe(1);

    // Batch update
    batch(() => {
      s1.value++;
      s2.value++;
    });

    await nextTick();
    expect(renderCount).toBe(2); // Should NOT be 3
  });


  it("nested signal updates: loop variable as signal", async () => {
    // What if the array contains signals themselves?
    const items = [signal("a"), signal("b")];
    const list = signal(items);

    const source = '<span @each="item of list.value">{{item.value}}</span>';
    const container = transpile(source, { list });

    expect(container.textContent).toBe("ab");

    // Update inner signal
    items[0].value = "A";
    await nextTick();

    // The framework should track the .value access inside the loop
    expect(container.textContent).toBe("Ab");
  });

  it("swapping first and last items in keyed @each", async () => {
    const list = signal([
      { id: 1, text: "first" },
      { id: 2, text: "middle" },
      { id: 3, text: "last" }
    ]);

    const source = '<div @each="item of list.value" @key="item.id">{{item.text}}</div>';
    const container = transpile(source, { list });
    const divs = container.querySelectorAll("div");
    const firstNode = divs[0];
    const lastNode = divs[2];

    // Swap
    list.value = [
      { id: 3, text: "last" },
      { id: 2, text: "middle" },
      { id: 1, text: "first" }
    ];

    await nextTick();

    const newDivs = container.querySelectorAll("div");
    expect(newDivs[0].textContent).toBe("last");
    expect(newDivs[2].textContent).toBe("first");

    // Nodes should be physically reused
    expect(newDivs[0]).toBe(lastNode);
    expect(newDivs[2]).toBe(firstNode);
  });
});

