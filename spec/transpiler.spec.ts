import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";
import { Viewer } from "../src/viewer";

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

    it("starts with empty errors", () => {
      const transpiler = new Transpiler();
      const parser = new TemplateParser();
      transpiler.transpile(parser.parse("<div></div>"), {}, makeContainer());
      expect(transpiler.errors).toHaveLength(0);
    });

    it("resets errors between calls", () => {
      const transpiler = new Transpiler();
      const parser = new TemplateParser();
      transpiler.transpile(parser.parse("<div></div>"), {}, makeContainer());
      transpiler.transpile(parser.parse("<span></span>"), {}, makeContainer());
      expect(transpiler.errors).toHaveLength(0);
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

    it("self-closing element (explicit />) is not appended to parent container", () => {
      // Transpiler returns self-closing elements early without appending to parent
      const container = transpile("<br/>");
      expect(container.childNodes).toHaveLength(0);
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

    it("does not leak item into outer scope", () => {
      const container = transpile(
        '<li @each="item of list">{{item}}</li><span>{{item}}</span>',
        { list: ["a"] }
      );
      // The span is outside the each — item is not in the outer scope
      const span = container.querySelector("span")!;
      expect(span.textContent).not.toBe("a");
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
});
