import { Component } from "../src/component";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";
import { signal } from "../src/signal";
import { nextTick } from "../src/scheduler";

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

describe("Transpiler", () => {
  describe("transpile()", () => {
    it("returns the container element", () => {
      const container = makeContainer();
      const parser = new TemplateParser();
      const transpiler = new Transpiler();
      const result = transpiler.transpile(parser.parse("<div></div>"), {}, container);
      expect(result).toBe(container);
    });

    it("clears container before rendering", () => {
      const container = makeContainer();
      container.innerHTML = "<span>old</span>";
      transpile("<div></div>", {}, container);
      expect(container.querySelector("span")).toBeNull();
    });
  });

  describe("text nodes", () => {
    it("renders plain text", () => {
      const container = transpile("hello");
      expect(container.textContent).toBe("hello");
    });

    it("renders interpolated variable", () => {
      const container = transpile("{{name}}", { name: "Alice" });
      expect(container.textContent).toBe("Alice");
    });

    it("renders expression result", () => {
      const container = transpile("{{1 + 2}}");
      expect(container.textContent).toBe("3");
    });

    it("renders mixed text and interpolation", () => {
      const container = transpile("Hello {{name}}!", { name: "World" });
      expect(container.textContent).toBe("Hello World!");
    });

    it("handles multiline interpolation", () => {
      const source = "{{ \n  1 + \n  1 \n }}";
      const container = transpile(source);
      expect(container.textContent!.trim()).toBe("2");
    });
  });

  describe("element nodes", () => {
    it("creates a basic element", () => {
      const container = transpile("<div></div>");
      expect(container.querySelector("div")).not.toBeNull();
    });

    it("creates nested elements", () => {
      const container = transpile("<div><span></span></div>");
      expect(container.querySelector("div > span")).not.toBeNull();
    });

    it("creates element with text child", () => {
      const container = transpile("<p>hello</p>");
      expect(container.querySelector("p")!.textContent).toBe("hello");
    });

    it("creates multiple sibling elements", () => {
      const container = transpile("<div></div><span></span>");
      expect(container.children).toHaveLength(2);
    });

    it("creates deeply nested elements", () => {
      const container = transpile("<a><b><c></c></b></a>");
      expect(container.querySelector("a > b > c")).not.toBeNull();
    });

    it("self-closing element (explicit />) is appended to parent container", () => {
      const container = transpile("<br/>");
      expect(container.childNodes).toHaveLength(1);
      expect((container.firstChild as HTMLElement).tagName.toLowerCase()).toBe("br");
    });
  });

  describe("attributes", () => {
    it("sets a regular attribute", () => {
      const container = transpile('<div class="foo"></div>');
      expect(container.querySelector("div")!.getAttribute("class")).toBe("foo");
    });

    it("sets multiple attributes", () => {
      const container = transpile('<div id="a" class="b"></div>');
      const div = container.querySelector("div")!;
      expect(div.getAttribute("id")).toBe("a");
      expect(div.getAttribute("class")).toBe("b");
    });

    it("interpolates attribute values", () => {
      const container = transpile('<div class="{{cls}}"></div>', { cls: "active" });
      expect(container.querySelector("div")!.getAttribute("class")).toBe("active");
    });

    it("excludes kasper directives from DOM attributes", () => {
      const container = transpile('<div @if="true"></div>');
      const div = container.querySelector("div")!;
      expect(div.hasAttribute("@if")).toBe(false);
    });

    it("supports shorthand attribute binding with @ prefix", () => {
      const container = transpile('<div @class="myClass" @id="\'id-\' + num" @disabled="true"></div>', {
        myClass: "active",
        num: 123
      });
      const div = container.querySelector("div")!;
      expect(div.getAttribute("class")).toBe("active");
      expect(div.getAttribute("id")).toBe("id-123");
      expect(div.hasAttribute("disabled")).toBe(true);
      expect(div.hasAttribute("@class")).toBe(false);
    });

    it("supports shorthand binding for hyphenated attributes like @aria-label", () => {
      const container = transpile('<button @aria-label="labelText" @data-id="itemId"></button>', {
        labelText: "Close dialog",
        itemId: "42"
      });
      const btn = container.querySelector("button")!;
      expect(btn.getAttribute("aria-label")).toBe("Close dialog");
      expect(btn.getAttribute("data-id")).toBe("42");
    });

    it("removes shorthand attribute if value is false/null/undefined", () => {
      const container = transpile('<div @disabled="isDisabled" @title="myTitle"></div>', {
        isDisabled: false,
        myTitle: null
      });
      const div = container.querySelector("div")!;
      expect(div.hasAttribute("disabled")).toBe(false);
      expect(div.hasAttribute("title")).toBe(false);
    });

    it("merges static class and shorthand @class", () => {
      const container = transpile('<div class="static" @class="\'dynamic\'"></div>');
      const div = container.querySelector("div")!;
      expect(div.getAttribute("class")).toBe("static dynamic");
    });

    it("surgically swaps @class values when signal changes", async () => {
      const state = signal("selected");
      const entity = { state };
      const container = transpile('<div class="base" @class="state.value"></div>', entity);
      const div = container.querySelector("div")!;

      expect(div.getAttribute("class")).toBe("base selected");

      state.value = "disabled";
      await nextTick();
      expect(div.getAttribute("class")).toBe("base disabled");
      expect(div.getAttribute("class")).not.toContain("selected");

      state.value = "focused";
      await nextTick();
      expect(div.getAttribute("class")).toBe("base focused");
      expect(div.getAttribute("class")).not.toContain("disabled");
    });

    it("merges static style and shorthand @style", () => {
      const container = transpile('<div style="color: red" @style="\'display: block\'"></div>');
      const div = container.querySelector("div")!;
      expect(div.getAttribute("style")).toMatch(/color:\s*red;?\s*display:\s*block/);
    });
  });

  describe("comment nodes", () => {
    it("creates a comment node", () => {
      const container = transpile("<!-- hello -->");
      const comment = Array.from(container.childNodes).find(
        (n) => n.nodeType === Node.COMMENT_NODE
      );
      expect(comment).toBeDefined();
    });
  });

  describe("doctype nodes", () => {
    it("doctype is a no-op and does not throw", () => {
      expect(() => transpile("<!DOCTYPE html>")).not.toThrow();
    });

    it("doctype does not add child nodes", () => {
      const container = transpile("<!DOCTYPE html>");
      expect(container.childNodes).toHaveLength(0);
    });
  });

  describe("@if directive", () => {
    it("renders element when condition is truthy", () => {
      const container = transpile('<div @if="show"></div>', { show: true });
      expect(container.querySelector("div")).not.toBeNull();
    });

    it("does not render element when condition is falsy", () => {
      const container = transpile('<div @if="show"></div>', { show: false });
      expect(container.querySelector("div")).toBeNull();
    });

    it("renders @else branch when @if is false", () => {
      const source = '<div @if="show">yes</div><div @else>no</div>';
      const container = transpile(source, { show: false });
      expect(container.textContent).toBe("no");
    });

    it("does not render @else when @if is true", () => {
      const source = '<div @if="show">yes</div><div @else>no</div>';
      const container = transpile(source, { show: true });
      expect(container.textContent).toBe("yes");
    });

    it("renders @elseif branch when @if is false and @elseif is true", () => {
      const source = '<div @if="a">A</div><div @elseif="b">B</div><div @else>C</div>';
      const container = transpile(source, { a: false, b: true });
      expect(container.textContent).toBe("B");
    });

    it("renders @else when all conditions are false", () => {
      const source = '<div @if="a">A</div><div @elseif="b">B</div><div @else>C</div>';
      const container = transpile(source, { a: false, b: false });
      expect(container.textContent).toBe("C");
    });

    it("renders nothing when @if is false and no else branch", () => {
      const container = transpile('<div @if="false">hidden</div>');
      expect(container.children).toHaveLength(0);
    });

    it("associates @else with @if even when tags are different", () => {
      const source = '<div @if="false">if</div><span @else>else</span>';
      const container = transpile(source);
      expect(container.textContent).toBe("else");
      expect(container.querySelector("span")).not.toBeNull();
    });

    it("associates @elseif and @else with @if across different tag names", () => {
      const source = '<div @if="a">A</div><section @elseif="b">B</section><span @else>C</span>';
      expect(transpile(source, { a: true, b: false }).textContent).toBe("A");
      expect(transpile(source, { a: false, b: true }).textContent).toBe("B");
      expect(transpile(source, { a: false, b: false }).textContent).toBe("C");
    });

    it("updates @if content reactively when signal changes", async () => {
      const show = signal(true);
      const container = transpile('<div @if="show.value">visible</div>', { show });
      
      expect(container.textContent).toBe("visible");
      
      show.value = false;
      await nextTick();
      expect(container.textContent).toBe("");
      
      show.value = true;
      await nextTick();
      expect(container.textContent).toBe("visible");
    });

    it("updates @each content reactively when array signal changes", async () => {
      const list = signal(["a", "b"]);
      const container = transpile('<li @each="item of list.value">{{item}}</li>', { list });
      
      expect(container.querySelectorAll("li")).toHaveLength(2);
      expect(container.textContent).toBe("ab");
      
      list.value = ["a", "b", "c"];
      await nextTick();
      expect(container.querySelectorAll("li")).toHaveLength(3);
      expect(container.textContent).toBe("abc");
      
      list.value = ["x"];
      await nextTick();
      expect(container.querySelectorAll("li")).toHaveLength(1);
      expect(container.textContent).toBe("x");
    });
  });

  describe("nested directives", () => {
    it("renders @each inside @if", () => {
      const source = `
        <div @if="show">
          <span @each="item of list">{{item}}</span>
        </div>
      `;
      const container = transpile(source, { show: true, list: ["A", "B"] });
      expect(container.querySelectorAll("span")).toHaveLength(2);
      expect(container.textContent!.trim()).toBe("AB");
    });

    it("renders @if inside @each", () => {
      const source = `
        <div @each="item of list">
          <span @if="item % 2 === 0">{{item}}</span>
        </div>
      `;
      const container = transpile(source, { list: [1, 2, 3, 4] });
      const spans = container.querySelectorAll("span");
      expect(spans).toHaveLength(2);
      expect(spans[0].textContent).toBe("2");
      expect(spans[1].textContent).toBe("4");
    });
  });

  describe("@each directive", () => {
    it("renders one element per item", () => {
      const container = transpile('<li @each="item of list">x</li>', { list: [1, 2, 3] });
      expect(container.querySelectorAll("li")).toHaveLength(3);
    });

    it("exposes item value in child scope", () => {
      const container = transpile('<li @each="item of list">{{item}}</li>', { list: ["a", "b"] });
      const items = container.querySelectorAll("li");
      expect(items[0].textContent).toBe("a");
      expect(items[1].textContent).toBe("b");
    });

    it("exposes index when key is specified using 'with' syntax", () => {
      const container = transpile('<li @each="item with i of list">{{i}}</li>', { list: ["x", "y", "z"] });
      const items = container.querySelectorAll("li");
      expect(items[0].textContent).toBe("0");
      expect(items[1].textContent).toBe("1");
      expect(items[2].textContent).toBe("2");
    });

    it("renders nothing for an empty array", () => {
      const container = transpile('<li @each="item of list">{{item}}</li>', { list: [] });
      expect(container.querySelectorAll("li")).toHaveLength(0);
    });

    it("evaluates < comparison between index and item inside @each", () => {
      const source = '<div @each="step with index of list"><span>{{index < step}}</span></div>';
      const container = transpile(source, { list: [0, 1, 2, 3] });
      const spans = container.querySelectorAll("span");
      // index < step: 0<0=false, 1<1=false, 2<2=false, 3<3=false
      // Wait: list is [0,1,2,3], index is position (0,1,2,3), step is value (0,1,2,3) — all equal
      // Use a list where values differ from indices to get meaningful results
      const source2 = '<div @each="step with index of list"><span>{{index < step}}</span></div>';
      const container2 = transpile(source2, { list: [5, 5, 5, 5] });
      const spans2 = container2.querySelectorAll("span");
      expect(spans2[0].textContent).toBe("true");   // 0 < 5
      expect(spans2[1].textContent).toBe("true");   // 1 < 5
      expect(spans2[2].textContent).toBe("true");   // 2 < 5
      expect(spans2[3].textContent).toBe("true");   // 3 < 5
    });

    it("evaluates <= comparison inside @each with index", () => {
      const source = '<div @each="step with index of list"><span>{{index <= step}}</span></div>';
      const container = transpile(source, { list: [0, 1, 2, 3] });
      const spans = container.querySelectorAll("span");
      expect(spans[0].textContent).toBe("true");   // 0 <= 0
      expect(spans[1].textContent).toBe("true");   // 1 <= 1
      expect(spans[2].textContent).toBe("true");   // 2 <= 2
      expect(spans[3].textContent).toBe("true");   // 3 <= 3
    });

    it("does not leak item into outer scope", () => {
      const container = transpile(
        '<li @each="item of list">{{item}}</li><span>{{item}}</span>',
        { list: ["a"] }
      );
      // The span is outside the each — item is not in the outer scope
      const span = container.querySelector("span")!;
      expect(span.textContent).not.toBe("a");
    });

    it("calls onDestroy on components inside @each when list changes", async () => {
      const destroyed: number[] = [];
      class Item extends Component {
        onDestroy() { destroyed.push(1); }
      }
      const list = signal([1, 2, 3]);
      const parser = new TemplateParser();
      const itemNodes = parser.parse("<span>item</span>");
      const registry = {
        "x-item": { selector: "", component: Item as any, template: null, nodes: itemNodes },
      };
      const transpiler = new Transpiler({ registry });
      const container = makeContainer();
      transpiler.transpile(
        parser.parse('<x-item @each="id of list.value"></x-item>'),
        { list },
        container
      );

      expect(container.querySelectorAll("x-item")).toHaveLength(3);
      expect(destroyed).toHaveLength(0);

      list.value = [4, 5];
      await Promise.resolve();

      expect(container.querySelectorAll("x-item")).toHaveLength(2);
      expect(destroyed).toHaveLength(3);
    });
  });

  describe("@key keyed reconciliation", () => {
    it("renders the same as unkeyed initially", () => {
      const list = signal([{ id: 1, name: "a" }, { id: 2, name: "b" }]);
      const container = transpile('<li @each="item of list.value" @key="item.id">{{item.name}}</li>', { list });
      const items = container.querySelectorAll("li");
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toBe("a");
      expect(items[1].textContent).toBe("b");
    });

    it("reuses existing DOM nodes for matching keys", async () => {
      const list = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const container = transpile('<li @each="item of list.value" @key="item.id">x</li>', { list });
      const [li1, li2, li3] = Array.from(container.querySelectorAll("li"));

      list.value = [{ id: 1 }, { id: 3 }]; // remove id:2
      await Promise.resolve();

      const remaining = container.querySelectorAll("li");
      expect(remaining).toHaveLength(2);
      expect(remaining[0]).toBe(li1); // reused
      expect(remaining[1]).toBe(li3); // reused
    });

    it("reorders DOM nodes without recreating them", async () => {
      const list = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const container = transpile('<li @each="item of list.value" @key="item.id">x</li>', { list });
      const [li1, li2, li3] = Array.from(container.querySelectorAll("li"));

      list.value = [{ id: 3 }, { id: 1 }, { id: 2 }];
      await Promise.resolve();

      const reordered = container.querySelectorAll("li");
      expect(reordered[0]).toBe(li3);
      expect(reordered[1]).toBe(li1);
      expect(reordered[2]).toBe(li2);
    });

    it("calls onDestroy only for removed keys", async () => {
      const destroyed: number[] = [];
      class Item extends Component {
        id = 0;
        onMount() { this.id = this.args.id; }
        onDestroy() { destroyed.push(this.id); }
      }
      const list = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const parser = new TemplateParser();
      const registry = {
        "x-item": { selector: "", component: Item as any, template: null, nodes: parser.parse("<span></span>") },
      };
      const transpiler = new Transpiler({ registry });
      const container = makeContainer();
      transpiler.transpile(
        parser.parse('<x-item @each="item of list.value" @key="item.id" @:id="item.id"></x-item>'),
        { list },
        container
      );

      list.value = [{ id: 1 }, { id: 3 }];
      await Promise.resolve();

      expect(destroyed).toEqual([2]);
    });

    it("does not set @key as a DOM attribute", () => {
      const list = [{ id: 1 }];
      const container = transpile('<li @each="item of list" @key="item.id">x</li>', { list });
      expect(container.querySelector("li")!.hasAttribute("@key")).toBe(false);
    });
  });

  describe("@let directive", () => {
    it("makes initialized variable available in children", () => {
      const container = transpile('<div @let="x = 42">{{x}}</div>');
      expect(container.querySelector("div")!.textContent).toBe("42");
    });

    it("creates the element in the DOM", () => {
      const container = transpile('<div @let="x = 1"></div>');
      expect(container.querySelector("div")).not.toBeNull();
    });

    it("can reference scope variable in expression", () => {
      const container = transpile('<div @let="label = prefix + \' world\'">{{label}}</div>', {
        prefix: "hello",
      });
      expect(container.querySelector("div")!.textContent).toBe("hello world");
    });

    it("makes $ref available to refer to the current element", () => {
      const container = transpile('<div @let="x = 1" id="test"></div>');
      const div = container.querySelector("div")!;
      // In Kasper, @let sets $ref in the scope to the current element.
      // We can verify this by using it in an interpolation or similar.
      const container2 = transpile('<div @let="x = 1" id="myid">{{$ref.id}}</div>');
      expect(container2.querySelector("div")!.textContent).toBe("myid");
    });
  });

  describe("void elements", () => {
    it("renders children into parent when using <void>", () => {
      const container = transpile("<void><span>1</span><span>2</span></void>");
      expect(container.querySelectorAll("span")).toHaveLength(2);
      expect(container.querySelector("void")).toBeNull();
    });

    it("does not create a wrapper element for <void>", () => {
      const container = transpile("<void>hello</void>");
      expect(container.childNodes).toHaveLength(1);
      expect(container.firstChild!.nodeType).toBe(Node.TEXT_NODE);
    });

    it("renders multiple children without a wrapper when used with @if", () => {
      const source = '<void @if="show"><p>A</p><p>B</p></void>';
      const container = transpile(source, { show: true });
      expect(container.querySelectorAll("p")).toHaveLength(2);
      expect(container.querySelector("void")).toBeNull();
    });

    it("renders nothing with @if false and no wrapper element", () => {
      const source = '<void @if="show"><p>A</p><p>B</p></void>';
      const container = transpile(source, { show: false });
      expect(container.querySelectorAll("p")).toHaveLength(0);
      expect(container.querySelector("void")).toBeNull();
    });

    it("renders multiple children per iteration with @each", () => {
      const source = '<void @each="item of list"><dt>{{item.k}}</dt><dd>{{item.v}}</dd></void>';
      const container = transpile(source, { list: [{ k: "a", v: 1 }, { k: "b", v: 2 }] });
      expect(container.querySelectorAll("dt")).toHaveLength(2);
      expect(container.querySelectorAll("dd")).toHaveLength(2);
      expect(container.querySelector("void")).toBeNull();
    });
  });

  describe("components", () => {
    class MyComponent {
      args: any;
      constructor(props: any) {
        this.args = props.args;
      }
      greet() {
        return "Hello " + (this.args.name || "World");
      }
    }

    it("renders a component from registry", () => {
      const parser = new TemplateParser();
      // Component template: <p>{{greet()}}</p>
      const nodes = parser.parse("<p>{{greet()}}</p>");
      const registry = {
        "my-comp": {
          selector: "my-comp",
          component: MyComponent as any,
          template: document.createElement("div"),
          nodes: nodes,
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = makeContainer();
      transpiler.transpile(parser.parse(`<my-comp @:name="'Alice'"></my-comp>`), {}, container);

      expect(container.querySelector("p")!.textContent).toBe("Hello Alice");
    });

    it("passes multiple arguments to components", () => {
      const parser = new TemplateParser();
      const nodes = parser.parse("<span>{{args.a}} {{args.b}}</span>");
      const registry = {
        "test-args": {
          selector: "test-args",
          component: MyComponent as any,
          template: document.createElement("div"),
          nodes: nodes,
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = makeContainer();
      transpiler.transpile(
        parser.parse('<test-args @:a="1" @:b="2"></test-args>'),
        {},
        container
      );

      expect(container.querySelector("span")!.textContent).toBe("1 2");
    });

    it("passes non-string args as their actual type", () => {
      const received: any[] = [];
      class TypeChecker extends Component {
        onMount() { received.push(this.args.num, this.args.flag, this.args.obj); }
      }
      const parser = new TemplateParser();
      const registry = {
        "type-check": {
          selector: "",
          component: TypeChecker as any,
          template: null,
          nodes: parser.parse("<span></span>"),
        },
      };
      const transpiler = new Transpiler({ registry });
      transpiler.transpile(
        parser.parse('<type-check @:num="42" @:flag="true" @:obj="myObj"></type-check>'),
        { myObj: { x: 1 } },
        makeContainer()
      );

      expect(received[0]).toBe(42);
      expect(typeof received[0]).toBe("number");
      expect(received[1]).toBe(true);
      expect(typeof received[1]).toBe("boolean");
      expect(received[2]).toEqual({ x: 1 });
    });

    it("getter returning a function arg is accessible and callable via the getter", () => {
      const onDelete = () => "deleted";
      let instance: any;
      class WithGetter extends Component {
        get onDelete() { return this.args.onDelete; }
        onMount() { instance = this; }
      }
      const parser = new TemplateParser();
      const registry = {
        "x-getter": {
          selector: "",
          component: WithGetter as any,
          template: null,
          nodes: parser.parse("<span></span>"),
        },
      };
      const transpiler = new Transpiler({ registry });
      transpiler.transpile(
        parser.parse('<x-getter @:onDelete="onDelete"></x-getter>'),
        { onDelete },
        makeContainer()
      );
      expect(instance.onDelete).toBe(onDelete);
      expect(instance.onDelete()).toBe("deleted");
    });

    it("passes a signal reference as an arg", () => {
      const count = signal(0);
      let receivedSignal: any;
      class Watcher extends Component {
        onMount() { receivedSignal = this.args.count; }
      }
      const parser = new TemplateParser();
      const registry = {
        "x-watch": {
          selector: "",
          component: Watcher as any,
          template: null,
          nodes: parser.parse("<span></span>"),
        },
      };
      const transpiler = new Transpiler({ registry });
      transpiler.transpile(
        parser.parse('<x-watch @:count="count"></x-watch>'),
        { count },
        makeContainer()
      );

      expect(receivedSignal).toBe(count);
      count.value = 5;
      expect(receivedSignal.value).toBe(5);
    });
  });

  describe("error handling", () => {
    it("throws error on invalid expression in interpolation", () => {
      expect(() => transpile("{{ 1 + }}")).toThrow(/\[K007-1\].*\[K004-3\]/s);
    });

    it("includes the tag name in the error context", () => {
      // Trigger error inside a specific tag
      const source = '<div id="{{ 1 + }}"></div>';
      expect(() => transpile(source)).toThrow(/at <div>/s);
    });
  });

  describe("@on: event binding", () => {
    it("calls handler on event", () => {
      const handler = vi.fn();
      const container = transpile('<button @on:click="handler()"></button>', { handler });
      container.querySelector("button")!.click();
      expect(handler).toHaveBeenCalledOnce();
    });

    it("provides $event to handler expression", () => {
      let captured: Event | null = null;
      const container = transpile('<button @on:click="capture($event)"></button>', {
        capture: (e: Event) => {
          captured = e;
        },
      });
      container.querySelector("button")!.click();
      expect(captured).not.toBeNull();
    });

    it("does not set @on: as a DOM attribute", () => {
      const handler = vi.fn();
      const container = transpile('<button @on:click="handler()"></button>', { handler });
      expect(container.querySelector("button")!.hasAttribute("@on:click")).toBe(false);
    });

    describe("form input binding", () => {
      it("text input: @on:input updates signal, @value reflects it", () => {
        const name = signal("initial");
        const container = transpile(
          '<input type="text" @value="name.value" @on:input="name.value = $event.target.value" />',
          { name }
        );
        const input = container.querySelector("input")! as HTMLInputElement;
        expect(input.getAttribute("value")).toBe("initial");

        input.value = "updated";
        input.dispatchEvent(new Event("input"));
        expect(name.value).toBe("updated");
      });

      it("checkbox: @on:change updates signal, @checked reflects it", () => {
        const agreed = signal(false);
        const container = transpile(
          '<input type="checkbox" @checked="agreed.value" @on:change="agreed.value = $event.target.checked" />',
          { agreed }
        );
        const input = container.querySelector("input")! as HTMLInputElement;
        expect(input.getAttribute("checked")).toBeNull();

        input.checked = true;
        input.dispatchEvent(new Event("change"));
        expect(agreed.value).toBe(true);
      });

      it("select: @on:change updates signal, @value reflects it", () => {
        const color = signal("red");
        const container = transpile(
          '<select @value="color.value" @on:change="color.value = $event.target.value"><option value="red">Red</option><option value="blue">Blue</option></select>',
          { color }
        );
        const select = container.querySelector("select")! as HTMLSelectElement;
        expect(select.getAttribute("value")).toBe("red");

        select.value = "blue";
        select.dispatchEvent(new Event("change"));
        expect(color.value).toBe("blue");
      });

      it("textarea: @on:input updates signal, @value reflects it", () => {
        const bio = signal("hello");
        const container = transpile(
          '<textarea @value="bio.value" @on:input="bio.value = $event.target.value"></textarea>',
          { bio }
        );
        const textarea = container.querySelector("textarea")! as HTMLTextAreaElement;
        expect(textarea.getAttribute("value")).toBe("hello");

        textarea.value = "world";
        textarea.dispatchEvent(new Event("input"));
        expect(bio.value).toBe("world");
      });

      it("text input: signal update reflects back into the DOM attribute", async () => {
        const name = signal("first");
        const container = transpile(
          '<input type="text" @value="name.value" @on:input="name.value = $event.target.value" />',
          { name }
        );
        const input = container.querySelector("input")! as HTMLInputElement;
        expect(input.getAttribute("value")).toBe("first");

        name.value = "second";
        await nextTick();
        expect(input.getAttribute("value")).toBe("second");
      });
    });

    describe("modifiers", () => {
      it(".prevent calls preventDefault", () => {
        let prevented = false;
        const container = transpile('<button @on:click.prevent="handler()"></button>', { handler: () => {} });
        container.querySelector("button")!.addEventListener("click", (e) => {
          prevented = e.defaultPrevented;
        });
        container.querySelector("button")!.click();
        expect(prevented).toBe(true);
      });

      it(".stop calls stopPropagation", () => {
        let bubbled = false;
        const container = transpile('<div><button @on:click.stop="handler()"></button></div>', { handler: () => {} });
        container.querySelector("div")!.addEventListener("click", () => { bubbled = true; });
        container.querySelector("button")!.click();
        expect(bubbled).toBe(false);
      });

      it(".once fires the handler only once", () => {
        const handler = vi.fn();
        const container = transpile('<button @on:click.once="handler()"></button>', { handler });
        const btn = container.querySelector("button")!;
        btn.click();
        btn.click();
        btn.click();
        expect(handler).toHaveBeenCalledOnce();
      });

      it("multiple modifiers can be combined", () => {
        let prevented = false;
        let bubbled = false;
        const container = transpile('<div><button @on:click.prevent.stop="handler()"></button></div>', { handler: () => {} });
        container.querySelector("div")!.addEventListener("click", () => { bubbled = true; });
        container.querySelector("button")!.addEventListener("click", (e) => { prevented = e.defaultPrevented; });
        container.querySelector("button")!.click();
        expect(prevented).toBe(true);
        expect(bubbled).toBe(false);
      });
    });
  });

  describe("@ref", () => {
    it("sets a property on the component instance after render", () => {
      const parser = new TemplateParser();

      class FormComp extends Component {
        emailInput: HTMLElement | null = null;
      }

      const registry = {
        "form-comp": {
          selector: "form-comp",
          component: FormComp as any,
          template: document.createElement("div"),
          nodes: parser.parse('<input @ref="emailInput" type="email" />'),
        },
      };

      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      let instance: FormComp | null = null;

      class Wrapper extends Component {
        onRender() {
          instance = (container.querySelector("form-comp") as any)?.$kasperInstance ?? null;
        }
      }
      const outerRegistry = {
        ...registry,
        "wrap-comp": {
          selector: "wrap-comp",
          component: Wrapper as any,
          template: document.createElement("div"),
          nodes: parser.parse("<form-comp></form-comp>"),
        },
      };
      const outerTranspiler = new Transpiler({ registry: outerRegistry });
      outerTranspiler.transpile(parser.parse("<wrap-comp></wrap-comp>"), {}, container);

      const formInstance = (container.querySelector("form-comp") as any)?.$kasperInstance as FormComp;
      expect(formInstance.emailInput).not.toBeNull();
      expect((formInstance.emailInput as HTMLElement).tagName.toLowerCase()).toBe("input");
    });

    it("sets a scope variable when used outside a component", () => {
      const entity: any = { myDiv: null };
      const container = transpile('<div @ref="myDiv"></div>', entity);
      expect(entity.myDiv).not.toBeNull();
      expect((entity.myDiv as HTMLElement).tagName.toLowerCase()).toBe("div");
    });

    it("does not set @ref as a DOM attribute", () => {
      const entity: any = { myEl: null };
      const container = transpile('<span @ref="myEl">text</span>', entity);
      expect(container.querySelector("span")!.hasAttribute("ref")).toBe(false);
      expect(container.querySelector("span")!.hasAttribute("@ref")).toBe(false);
    });
  });
});
