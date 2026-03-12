import { Component } from "../src/component";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";
import { Viewer } from "../src/viewer";
import { signal } from "../src/signal";

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

    it("surgically swaps @class values when signal changes", () => {
      const state = signal("selected");
      const container = transpile('<div class="base" @class="state.value"></div>', { state });
      const div = container.querySelector("div")!;
      
      expect(div.getAttribute("class")).toBe("base selected");
      
      state.value = "disabled";
      expect(div.getAttribute("class")).toBe("base disabled");
      expect(div.getAttribute("class")).not.toContain("selected");
      
      state.value = "focused";
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

    it("does NOT associate @else with @if if tags are different", () => {
      // In current implementation, tag must match
      const source = '<div @if="false">if</div><span @else>else</span>';
      const container = transpile(source);
      // 'if' is not rendered. 'else' IS rendered because it's not consumed by doIf and evaluated normally.
      expect(container.textContent).toBe("else");
    });

    it("updates @if content reactively when signal changes", () => {
      const show = signal(true);
      const container = transpile('<div @if="show.value">visible</div>', { show });
      
      expect(container.textContent).toBe("visible");
      
      show.value = false;
      expect(container.textContent).toBe("");
      
      show.value = true;
      expect(container.textContent).toBe("visible");
    });

    it("updates @each content reactively when array signal changes", () => {
      const list = signal(["a", "b"]);
      const container = transpile('<li @each="item of list.value">{{item}}</li>', { list });
      
      expect(container.querySelectorAll("li")).toHaveLength(2);
      expect(container.textContent).toBe("ab");
      
      list.value = ["a", "b", "c"];
      expect(container.querySelectorAll("li")).toHaveLength(3);
      expect(container.textContent).toBe("abc");
      
      list.value = ["x"];
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

    it("calls $onDestroy on components inside @each when list changes", async () => {
      const destroyed: number[] = [];
      class Item extends Component {
        $onDestroy() { destroyed.push(1); }
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

  describe("@while directive", () => {
    it("renders elements while condition is true", () => {
      const container = transpile('<div @while="count-- > 0"></div>', { count: 3 });
      expect(container.querySelectorAll("div")).toHaveLength(3);
    });

    it("renders nothing when condition starts false", () => {
      const container = transpile('<div @while="false"></div>');
      expect(container.querySelectorAll("div")).toHaveLength(0);
    });

    it("has access to outer scope and can modify it using an object", () => {
      const entity = { state: { i: 0 } };
      const container = transpile('<div @while="state.i < 3">{{++state.i}}</div>', entity);
      expect(container.querySelectorAll("div")).toHaveLength(3);
      expect(container.textContent).toBe("123");
      // Verify state was modified
      expect(entity.state.i).toBe(3);
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
      transpiler.transpile(parser.parse('<my-comp @:name="Alice"></my-comp>'), {}, container);

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
  });

  describe("error handling", () => {
    it("throws error on invalid expression in interpolation", () => {
      expect(() => transpile("{{ 1 + }}")).toThrow("Parse Error");
    });

    it("includes the tag name in the error context", () => {
      const parser = new TemplateParser();
      // Trigger error inside a specific tag
      const source = '<div id="{{ 1 + }}"></div>';
      expect(() => transpile(source)).toThrow(/Runtime Error:.*at <div>/s);
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
  });
});

describe("Viewer", () => {
  function view(source: string): string {
    const parser = new TemplateParser();
    const nodes = parser.parse(source);
    const viewer = new Viewer();
    return viewer.transpile(nodes).join("");
  }

  describe("transpile()", () => {
    it("returns an array of strings", () => {
      const viewer = new Viewer();
      const parser = new TemplateParser();
      const result = viewer.transpile(parser.parse("<div></div><span></span>"));
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe("string");
    });

    it("resets errors between calls", () => {
      const viewer = new Viewer();
      const parser = new TemplateParser();
      viewer.transpile(parser.parse("<div></div>"));
      viewer.transpile(parser.parse("<span></span>"));
      expect(viewer.errors).toHaveLength(0);
    });
  });

  describe("text nodes", () => {
    it("renders plain text", () => {
      expect(view("hello")).toBe("hello");
    });

    it("preserves interpolation syntax without evaluating it", () => {
      expect(view("{{name}}")).toBe("{{name}}");
    });
  });

  describe("element nodes", () => {
    it("renders open and close tags", () => {
      expect(view("<div></div>")).toBe("<div></div>");
    });

    it("renders self-closing element", () => {
      expect(view("<br/>")).toBe("<br/>");
    });

    it("renders element with text child", () => {
      expect(view("<p>hello</p>")).toBe("<p>hello</p>");
    });

    it("renders nested elements", () => {
      expect(view("<div><span></span></div>")).toBe("<div><span></span></div>");
    });

    it("renders multiple root elements as joined string", () => {
      expect(view("<div></div><span></span>")).toBe("<div></div><span></span>");
    });
  });

  describe("attribute nodes", () => {
    it("renders attribute with value", () => {
      expect(view('<div class="foo"></div>')).toBe('<div class="foo"></div>');
    });

    it("renders boolean attribute without value", () => {
      expect(view("<button disabled></button>")).toBe("<button disabled></button>");
    });

    it("renders multiple attributes", () => {
      expect(view('<div id="a" class="b"></div>')).toBe('<div id="a" class="b"></div>');
    });
  });

  describe("comment nodes", () => {
    it("wraps comment value in delimiters", () => {
      const result = view("<!-- note -->");
      expect(result).toContain("note");
      expect(result).toMatch(/<!--.*-->/s);
    });
  });

  describe("doctype nodes", () => {
    it("outputs a doctype declaration containing the value", () => {
      const result = view("<!DOCTYPE html>");
      expect(result.toLowerCase()).toContain("doctype");
      expect(result).toContain("html");
    });
  });

  describe("error handling", () => {
    it("logs and stores error if evaluation fails", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const viewer = new Viewer();
      // @ts-ignore - passing invalid node
      const result = viewer.transpile([{ type: "invalid" }]);
      expect(viewer.errors.length).toBeGreaterThan(0);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("complex structure", () => {
    it("renders complex nested elements correctly", () => {
      const source = '<div id="1" class="outer"><p>hello<span>world</span></p><!--comment--></div>';
      const expected = '<div id="1" class="outer"><p>hello<span>world</span></p><!-- comment --></div>';
      expect(view(source)).toBe(expected);
    });
  });
});
