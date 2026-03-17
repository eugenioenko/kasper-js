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

  it("renders @each with component and props on same element without throwing", async () => {
    class UICard extends Component {
      static template = '<div class="card"><slot @name="header" /><slot /></div>';
    }

    class TaskCard extends Component {
      static template = `
        <div class="task-card-wrapper">
          <ui-card>
            <div @slot="header">{{ args.task.title }}</div>
            <p class="desc" @if="args.task.description">{{ args.task.description }}</p>
          </ui-card>
        </div>
      `;
    }

    class KanbanColumn extends Component {
      tasks = this.computed(() => {
        const all = this.args.allTasks?.value ?? [];
        return all.filter((t: any) => t && t.status === "todo");
      });
      static template = '<task-card @each="task of tasks.value" @:task="task" @key="task.id"></task-card>';
    }

    class Parent extends Component {
      all = signal<any[]>([]);
      static template = '<h1>Repro</h1><kanban-column @:allTasks="all"></kanban-column>';

      onMount() {
        this.all.value = [
          { id: 1, title: "Item 1", status: "todo" },
          { id: 2, title: "Item 2", status: "todo", description: "desc" }
        ];
      }
    }

    const parser = new TemplateParser();
    const registry = {
      "ui-card": {
        component: UICard as any,
        template: UICard.template,
        nodes: parser.parse(UICard.template)
      },
      "task-card": {
        component: TaskCard as any,
        template: TaskCard.template,
        nodes: parser.parse(TaskCard.template)
      },
      "kanban-column": {
        component: KanbanColumn as any,
        template: KanbanColumn.template,
        nodes: parser.parse(KanbanColumn.template)
      },
      "parent-comp": {
        component: Parent as any,
        template: Parent.template,
        nodes: parser.parse(Parent.template)
      }
    };

    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    // Should not throw now
    transpiler.mountComponent(Parent, container);
    await nextTick();

    expect(container.textContent).toContain("Item 1");
    expect(container.textContent).toContain("Item 2");
    expect(container.textContent).toContain("desc");
  });

  it("renders @each and @:prop on same element (simple)", () => {
    class SimpleChild extends Component {
      static template = "<span>{{ args.val }}</span>";
    }
    const parser = new TemplateParser();
    const registry = {
      "simple-child": {
        component: SimpleChild as any,
        template: SimpleChild.template,
        nodes: parser.parse(SimpleChild.template)
      }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    const list = [{ id: 1, v: "A" }, { id: 2, v: "B" }];

    transpiler.transpile(
      parser.parse('<simple-child @each="item of list" @key="item.id" @:val="item.v"></simple-child>'),
      { list },
      container
    );

    expect(container.textContent).toBe("AB");
  });

  it("isolates slot scopes for multiple instances of the same component", async () => {
    // This tests if the WeakMap correctly separates scopes for different instances
    // sharing the same KNodes.
    class Box extends Component {
      static template = '<div><slot /></div>';
    }
    const parser = new TemplateParser();
    const registry = {
      "x-box": { component: Box as any, nodes: parser.parse(Box.template!) }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    
    const source = `
      <div @each="item of ['A', 'B']">
        <x-box>{{item}}</x-box>
      </div>
    `;

    transpiler.transpile(parser.parse(source), { }, container);
    expect(container.textContent.trim()).toBe("AB");
  });

  it("allows @let variable from parent to be used in a slot", () => {
    class Wrapper extends Component {
      static template = '<section><slot /></section>';
    }
    const parser = new TemplateParser();
    const registry = {
      "x-wrapper": { component: Wrapper as any, nodes: parser.parse(Wrapper.template!) }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const source = `
      <div @let="secret = 'shhh'">
        <x-wrapper>
          <span>{{secret}}</span>
        </x-wrapper>
      </div>
    `;

    transpiler.transpile(parser.parse(source), {}, container);
    expect(container.querySelector("span")!.textContent).toBe("shhh");
  });

  it("passes @each index as a component prop", () => {
    class ItemView extends Component {
      static template = '<i>{{args.index}}:{{args.name}}</i>';
    }
    const parser = new TemplateParser();
    const registry = {
      "item-view": { component: ItemView as any, nodes: parser.parse(ItemView.template!) }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const list = ["apple", "banana"];
    const source = '<item-view @each="name with i of list" @:name="name" @:index="i"></item-view>';

    transpiler.transpile(parser.parse(source), { list }, container);
    expect(container.textContent).toBe("0:apple1:banana");
  });

  it("handles deep nested slots with parent scope preservation", () => {
    class Level1 extends Component { static template = '<div>L1:<slot /></div>'; }
    class Level2 extends Component { static template = '<span>L2:<slot /></span>'; }
    
    const parser = new TemplateParser();
    const registry = {
      "l-1": { component: Level1 as any, nodes: parser.parse(Level1.template!) },
      "l-2": { component: Level2 as any, nodes: parser.parse(Level2.template!) }
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const source = `
      <div @let="val = 'target'">
        <l-1>
          <l-2>
            <b>{{val}}</b>
          </l-2>
        </l-1>
      </div>
    `;

    transpiler.transpile(parser.parse(source), {}, container);
    expect(container.querySelector("b")!.textContent).toBe("target");
  });

  it("reactively updates parent variables used inside a slot", async () => {
    class Wrapper extends Component { static template = '<div><slot /></div>'; }
    const parser = new TemplateParser();
    const registry = { "x-wrapper": { component: Wrapper as any, nodes: parser.parse(Wrapper.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const count = signal(0);
    const source = '<x-wrapper><span>{{count.value}}</span></x-wrapper>';

    transpiler.transpile(parser.parse(source), { count }, container);
    expect(container.textContent).toBe("0");

    count.value = 1;
    await nextTick();
    expect(container.textContent).toBe("1");
  });

  it("handles nested @each where inner loop is inside a slot", () => {
    class Wrapper extends Component { static template = '<section><slot /></section>'; }
    const parser = new TemplateParser();
    const registry = { "x-wrapper": { component: Wrapper as any, nodes: parser.parse(Wrapper.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const matrix = [["a1", "a2"], ["b1"]];
    const source = `
      <div @each="row of matrix">
        <x-wrapper>
          <i @each="cell of row">{{cell}}</i>
        </x-wrapper>
      </div>
    `;

    transpiler.transpile(parser.parse(source), { matrix }, container);
    expect(container.textContent.replace(/\s/g, "")).toBe("a1a2b1");
  });

  it("respects @if inside a slot using parent scope", async () => {
    class Wrapper extends Component { static template = '<div><slot /></div>'; }
    const parser = new TemplateParser();
    const registry = { "x-wrapper": { component: Wrapper as any, nodes: parser.parse(Wrapper.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const visible = signal(true);
    const source = `
      <x-wrapper>
        <span @if="visible.value">Visible</span>
      </x-wrapper>
    `;

    transpiler.transpile(parser.parse(source), { visible }, container);
    expect(container.textContent).toContain("Visible");

    visible.value = false;
    await nextTick();
    expect(container.textContent).not.toContain("Visible");
  });

  it("bug repro: $slots is undefined when unmounting a component with @if on named slot", async () => {
    // Mirrors the exact demos scenario that produced the crash.
    //
    // Key conditions:
    //   1. Dialog controls its OWN visibility via @if="args.isOpen.value" (same signal as parent @if)
    //   2. Dialog checks @if="$slots.footer" to conditionally render a named slot wrapper
    //   3. Parent mounts Dialog via an intermediate wrapper that is itself conditionally shown
    //   4. Two signals change WITHOUT batch():
    //      - isOpen = false  → triggers BOTH the parent @if AND Dialog's internal @if
    //      - data = null     → triggers a second reactive update in the dialog content
    //
    // This creates concurrent tasks in the scheduler where Dialog's internal @if task runs
    // AFTER the parent has already destroyed the Dialog, causing $slots to be undefined
    // when the @if="$slots.footer" condition is re-evaluated.

    // Dialog-like component: controls its own visibility AND checks a named slot
    class DialogComponent extends Component {
      static template = `
        <div class="overlay" @if="args.isOpen.value">
          <div class="body">
            <slot />
          </div>
          <div @if="$slots.footer">
            <slot @name="footer" />
          </div>
        </div>
      `;
    }

    // Intermediate wrapper (like ProductForm): uses Dialog and passes slots through
    class FormComponent extends Component {
      static template = `
        <dialog-comp @:isOpen="args.isOpen" @:data="args.data">
          <p>{{ args.data.value?.name ?? 'no data' }}</p>
          <div @slot="footer">
            <button>Submit</button>
          </div>
        </dialog-comp>
      `;
    }

    // Parent: controls FormComponent visibility AND has a second independent signal
    class ParentComponent extends Component {
      isOpen = signal(true);
      data = signal<any>({ name: "Product A" });
      static template = `
        <form-comp @if="isOpen.value" @:isOpen="isOpen" @:data="data"></form-comp>
      `;
    }

    const parser = new TemplateParser();
    const dialogNodes = parser.parse(DialogComponent.template!);
    const formNodes = parser.parse(FormComponent.template!);
    const registry = {
      "dialog-comp": { component: DialogComponent as any, template: DialogComponent.template, nodes: dialogNodes },
      "form-comp": { component: FormComponent as any, template: FormComponent.template, nodes: formNodes },
    };

    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    const parent = new ParentComponent();

    transpiler.transpile(parser.parse(ParentComponent.template!), parent, container);
    await nextTick();
    expect(container.textContent).toContain("Product A");

    // Spy on console.error — the scheduler swallows thrown errors via try/catch
    // and logs them. If the bug is present we'll see the TypeError here.
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Two separate signal changes WITHOUT batch() — the original buggy pattern
    parent.isOpen.value = false;
    parent.data.value = null;

    await nextTick();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();

    expect(container.textContent).not.toContain("Product A");
  });

  it("does not crash when unmounting a component that checks $slots in @if", async () => {
    class Child extends Component {
      // Accessing a property of a signal that might become null
      static template = `
        <div @if="$slots.header">
          Has Header: {{ args.data.value?.name }}
        </div>
      `;
    }

    class Parent extends Component {
      isVisible = signal(true);
      data = signal<any>({ name: "Initial" });
      
      static template = `
        <child-comp @if="isVisible.value" @:data="data">
          <div @slot="header">Header</div>
        </child-comp>
      `;
    }

    const parser = new TemplateParser();
    const registry = {
      "child-comp": {
        component: Child as any,
        template: Child.template,
        nodes: parser.parse(Child.template)
      }
    };

    const transpiler = new Transpiler({ registry });
    const container = makeContainer();
    const parent = new Parent();

    transpiler.transpile(parser.parse(Parent.template), parent, container);
    expect(container.textContent).toContain("Has Header");

    // Trigger race condition: Unmount and clear data in separate ticks (no batch)
    parent.isVisible.value = false;
    parent.data.value = null; 
    
    await nextTick();
    
    expect(container.textContent).not.toContain("Has Header");
  });
});

describe("@: prop binding gotchas", () => {
  it("@:prop with a call expression evaluates the call immediately during render", () => {
    // Gotcha: @:onClick="fn()" calls fn() during render, it does NOT pass fn as a callback.
    // The correct pattern for parameterized callbacks is @on:click="fn(arg)" on the
    // native element, or @:onClick="fn" (reference, no args) for ui-button.
    let callCount = 0;

    class Btn extends Component {
      static template = '<button>btn</button>';
    }
    const parser = new TemplateParser();
    const registry = { 'x-btn': { component: Btn as any, nodes: parser.parse(Btn.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const entity = { doSomething() { callCount++; } };

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    transpiler.transpile(
      parser.parse('<x-btn @:onClick="doSomething()"></x-btn>'),
      entity,
      container
    );
    warnSpy.mockRestore();

    // doSomething() was called once during render, not deferred until click
    expect(callCount).toBe(1);

    // The button click does nothing because args.onClick received the return value
    // of doSomething() (undefined), not the function itself
    container.querySelector('button')!.click();
    expect(callCount).toBe(1); // still 1 — click did not call doSomething
  });

  it("@:prop call expression with reactive side effects causes an infinite loop", async () => {
    // When the called function both reads AND writes the same signal, the @: reactive
    // effect subscribes to the signal (via the read), then the write re-triggers the
    // effect, which calls the function again — infinite loop.
    //
    // This is what caused the shopping cart demo to freeze: @:onClick="add(product)"
    // where add() does cartItems.value.find() (read) then cartItems.value = [...] (write).
    //
    // Requires mountComponent to get the full reactive lifecycle.

    // The loop only manifests when @: is inside @each — the @each subscribes to the
    // signal, the call expression writes it, and @each tries to rebuild infinitely.
    // This mirrors the demo exactly: @each over products, @:onClick="add(product)"
    // where add() reads+writes cartItems.

    class Btn extends Component {
      static template = '<button>btn</button>';
    }

    class Parent extends Component {
      products = signal([{ id: 1 }, { id: 2 }]);

      addProduct(p: any) {
        const current = this.products.value;        // READ  → @each subscribes to products
        this.products.value = [...current, { id: current.length + 1 }]; // WRITE → @each rebuilds → calls addProduct again
      }

      static template = '<x-btn @each="p of products.value" @:onClick="addProduct(p)"></x-btn>';
    }

    const parser = new TemplateParser();
    const registry = {
      'x-btn': { component: Btn as any, nodes: parser.parse(Btn.template!) },
    };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    // During flushSync the loop hits a stack overflow synchronously.
    // The error should contain exactly one [K007-1] code — not thousands of
    // accumulated wrappers from each retry re-catching and re-wrapping the error.
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    let thrown: Error | null = null;
    try { transpiler.mountComponent(Parent, container); } catch (e: any) { thrown = e; }
    warnSpy.mockRestore();

    expect(thrown).not.toBeNull();
    expect(thrown!.message).toMatch(/K007-1/);
    const count = (thrown!.message.match(/K007-1/g) ?? []).length;
    expect(count).toBe(1);
  });
});

describe("@each + outer signal reactivity", () => {
  it("@class inside @each reacts to an outer signal change (plain array iterable)", async () => {
    // Replicates the data-table pagination bug:
    // clicking page 3 highlighted pages 1, 2 AND 3 instead of only 3.
    const selected = signal(1);
    const items = [1, 2, 3];

    const source = `
      <button @each="n of items" @class="selected.value === n ? 'active' : ''">{{ n }}</button>
    `;
    const container = transpile(source, { items, selected });
    const buttons = () => container.querySelectorAll("button");

    expect(buttons()[0].className).toBe("active");
    expect(buttons()[1].className).toBe("");
    expect(buttons()[2].className).toBe("");

    selected.value = 3;
    await nextTick();

    expect(buttons()[0].className).toBe("");
    expect(buttons()[1].className).toBe("");
    expect(buttons()[2].className).toBe("active");
  });

  it("@class inside @each reacts to outer signal when iterable is also a signal", async () => {
    // Closer to the real demo: pageNumbers is a signal, page is a separate signal.
    // Both are read in the same @class expression — the @each rebuilds only when
    // pageNumbers changes, but @class should still update when page changes alone.
    // Could not reproduce the demo accumulation bug (pages 1+2+3 all active after
    // clicking 3) in isolation — the framework handles it correctly here.
    // Tests serve as regression guards for this expected behavior.
    const page = signal(1);
    const pageNumbers = signal([1, 2, 3]);

    const source = `
      <button @each="n of pageNumbers.value" @class="page.value === n ? 'active' : ''">{{ n }}</button>
    `;
    const container = transpile(source, { page, pageNumbers });
    const buttons = () => container.querySelectorAll("button");

    expect(buttons()[0].className).toBe("active");
    expect(buttons()[1].className).toBe("");
    expect(buttons()[2].className).toBe("");

    page.value = 3;
    await nextTick();

    // Bug: all previously-active buttons retain the class → [0] and [2] both have "active"
    // Expected: only [2] has "active"
    expect(buttons()[0].className).toBe("");
    expect(buttons()[1].className).toBe("");
    expect(buttons()[2].className).toBe("active");
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

  it("appending to keyed @each does not move existing DOM nodes", async () => {
    // Bug: doEachKeyed called boundary.insert(domNode) for every existing keyed node
    // unconditionally, detaching and reinserting them in order. This caused ALL items
    // to restart CSS animations (e.g. slide-in) whenever a single new item was appended.
    // Fix: use a cursor — only move a node if it's not already in the correct position.
    const list = signal([
      { id: 1, text: "first" },
      { id: 2, text: "second" },
    ]);

    const source = '<div @each="item of list.value" @key="item.id">{{item.text}}</div>';
    const container = transpile(source, { list });

    const divsBefore = Array.from(container.querySelectorAll("div"));
    expect(divsBefore).toHaveLength(2);

    // Track every childList mutation on the container
    const moves: Node[] = [];
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => moves.push(n));
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    // Append a new item
    list.value = [...list.value, { id: 3, text: "third" }];
    await nextTick();

    observer.disconnect();

    const divsAfter = Array.from(container.querySelectorAll("div"));
    expect(divsAfter).toHaveLength(3);

    // Existing nodes must be the exact same DOM elements (not re-created or moved)
    expect(divsAfter[0]).toBe(divsBefore[0]);
    expect(divsAfter[1]).toBe(divsBefore[1]);

    // Existing nodes must NOT appear in the mutation records (were not moved)
    expect(moves).not.toContain(divsBefore[0]);
    expect(moves).not.toContain(divsBefore[1]);
    // Only the new node was added at the list level
    expect(moves).toContain(divsAfter[2]);
    expect(divsAfter[2].textContent).toBe("third");
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

describe("onDestroy", () => {
  it("fires when a component is removed via @if", async () => {
    let destroyed = false;

    class Child extends Component {
      static template = '<span>child</span>';
      onDestroy() { destroyed = true; }
    }

    const parser = new TemplateParser();
    const registry = { 'x-child': { component: Child as any, nodes: parser.parse(Child.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const visible = signal(true);
    transpiler.transpile(parser.parse('<x-child @if="visible.value"></x-child>'), { visible }, container);

    expect(destroyed).toBe(false);
    visible.value = false;
    await nextTick();
    expect(destroyed).toBe(true);
  });

  it("does not fire again on subsequent re-renders after removal", async () => {
    let destroyCount = 0;

    class Child extends Component {
      static template = '<span>child</span>';
      onDestroy() { destroyCount++; }
    }

    const parser = new TemplateParser();
    const registry = { 'x-child': { component: Child as any, nodes: parser.parse(Child.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const visible = signal(true);
    transpiler.transpile(parser.parse('<x-child @if="visible.value"></x-child>'), { visible }, container);

    visible.value = false;
    await nextTick();
    expect(destroyCount).toBe(1);

    // further signal changes should not re-trigger onDestroy
    visible.value = true;
    await nextTick();
    visible.value = false;
    await nextTick();
    expect(destroyCount).toBe(2); // one destroy per removal, not accumulating
  });

  it("cleans up effects registered in onMount when destroyed", async () => {
    let effectRuns = 0;
    const shared = signal(0);

    class Child extends Component {
      static template = '<span>child</span>';
      onMount() {
        this.effect(() => {
          shared.value; // subscribe
          effectRuns++;
        });
      }
    }

    const parser = new TemplateParser();
    const registry = { 'x-child': { component: Child as any, nodes: parser.parse(Child.template!) } };
    const transpiler = new Transpiler({ registry });
    const container = makeContainer();

    const visible = signal(true);
    transpiler.transpile(parser.parse('<x-child @if="visible.value"></x-child>'), { visible }, container);

    expect(effectRuns).toBe(1); // initial run

    shared.value++;
    await nextTick();
    expect(effectRuns).toBe(2); // effect still active

    // destroy the component
    visible.value = false;
    await nextTick();

    // effect should be cleaned up — further signal changes should not trigger it
    shared.value++;
    await nextTick();
    expect(effectRuns).toBe(2); // still 2, effect was stopped
  });
});

describe("@class reactivity", () => {
  it("@class with a multi-token expression does not accumulate on repeated updates", async () => {
    // Bug: @class reads element.className on each reactive update instead of the
    // original static class. When the expression returns multiple tokens like
    // 'sf-field sf-field--error', the filter removes only exact token matches —
    // but lastDynamicValue is the full multi-token string, not individual tokens.
    // Result: each update appends the full string again.
    const hasError = signal(true);

    const source = `<div @class="hasError.value ? 'box box--error' : 'box'">content</div>`;
    const container = transpile(source, { hasError });
    const div = container.querySelector("div")!;

    expect(div.className).toBe("box box--error");

    // Toggle to no-error and back several times
    hasError.value = false;
    await nextTick();
    expect(div.className).toBe("box");

    hasError.value = true;
    await nextTick();
    // Bug: would produce "box box--error box box--error" after second toggle
    expect(div.className).toBe("box box--error");

    hasError.value = false;
    await nextTick();
    expect(div.className).toBe("box");
  });

  it("@class overrides a static class attribute — static class goes in the expression", async () => {
    // @class replaces the class attribute entirely.
    // Static + dynamic classes should both be in the @class expression.
    const active = signal(false);

    const source = `<div @class="'base' + (active.value ? ' active' : '')">x</div>`;
    const container = transpile(source, { active });
    const div = container.querySelector("div")!;

    expect(div.className).toBe("base");

    active.value = true;
    await nextTick();
    expect(div.className).toBe("base active");

    active.value = false;
    await nextTick();
    expect(div.className).toBe("base");

    active.value = true;
    await nextTick();
    expect(div.className).toBe("base active");
  });
});
