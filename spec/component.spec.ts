import { describe, it, expect, vi } from "vitest";
import { Component } from "../src/component";
import { signal } from "../src/signal";
import { Transpiler } from "../src/transpiler";
import { TemplateParser } from "../src/template-parser";

describe("Component", () => {
  it("initializes with default values", () => {
    const component = new Component();
    expect(component.args).toEqual({});
    expect(component.ref).toBeUndefined();
    expect(component.transpiler).toBeUndefined();
  });

  it("$doRender does nothing when transpiler is not set", () => {
    const component = new Component();
    expect(() => component.$doRender()).not.toThrow();
  });

  it("lifecycle hook methods exist and are callable", () => {
    const component = new Component();
    expect(() => component.onInit()).not.toThrow();
    expect(() => component.onRender()).not.toThrow();
    expect(() => component.onChanges()).not.toThrow();
    expect(() => component.onDestroy()).not.toThrow();
  });

  it("initializes with provided props", () => {
    const ref = document.createElement("div");
    const transpiler = new Transpiler();
    const args = { foo: "bar" };
    const component = new Component({ args, ref, transpiler });
    
    expect(component.args).toBe(args);
    expect(component.ref).toBe(ref);
    expect(component.transpiler).toBe(transpiler);
  });

  describe("haunt", () => {
    it("calls the callback when signal changes", () => {
      const component = new Component();
      const count = signal(0);
      const calls: number[] = [];

      component.haunt(count, (val) => calls.push(val));
      count.value = 1;
      count.value = 2;

      expect(calls).toEqual([1, 2]);
    });

    it("stops the subscription when $watchStops are called", () => {
      const component = new Component();
      const count = signal(0);
      const calls: number[] = [];

      component.haunt(count, (val) => calls.push(val));
      count.value = 1;

      component.$watchStops.forEach((stop) => stop());
      count.value = 2;

      expect(calls).toEqual([1]);
    });

    it("cleans up haunt subscriptions on component destroy via transpiler", () => {
      const parser = new TemplateParser();
      const theme = signal("dark");
      const calls: string[] = [];

      class ThemedComponent extends Component {
        onInit() {
          this.haunt(theme, (val) => calls.push(val));
        }
      }

      const registry = {
        "themed-comp": {
          selector: "themed-comp",
          component: ThemedComponent as any,
          template: document.createElement("div"),
          nodes: parser.parse("<span></span>"),
        },
      };

      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      transpiler.transpile(parser.parse("<themed-comp></themed-comp>"), {}, container);

      theme.value = "light";
      expect(calls).toEqual(["light"]);

      transpiler.destroy(container);
      theme.value = "dark";

      expect(calls).toEqual(["light"]);
    });
  });

  describe("Lifecycle hooks", () => {
    it("executes onInit and onRender when transpiled", () => {
      const parser = new TemplateParser();
      let initCalled = false;
      let renderCalled = false;

      class LifecycleComponent extends Component {
        onInit = () => { initCalled = true; };
        onRender = () => { renderCalled = true; };
      }

      const registry = {
        "test-comp": {
          selector: "test-comp",
          component: LifecycleComponent as any,
          template: document.createElement("div"),
          nodes: parser.parse("<span></span>"),
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      
      transpiler.transpile(parser.parse("<test-comp></test-comp>"), {}, container);
      
      expect(initCalled).toBe(true);
      expect(renderCalled).toBe(true);
    });
  });
});

describe("Component Integration", () => {
  class GreetComponent extends Component {
    greet() {
      return "Hello " + this.args.name;
    }
  }

  it("binds 'this' correctly in component methods", () => {
    const parser = new TemplateParser();
    const registry = {
      "greet-comp": {
        selector: "greet-comp",
        component: GreetComponent as any,
        template: document.createElement("div"),
        nodes: parser.parse("<span>{{greet()}}</span>"),
      },
    };
    const transpiler = new Transpiler({ registry });
    const container = document.createElement("div");
    
    transpiler.transpile(parser.parse(`<greet-comp @:name="'Kasper'"></greet-comp>`), {}, container);
    
    expect(container.textContent).toContain("Hello Kasper");
  });

  it("supports nested components", () => {
    const parser = new TemplateParser();
    const registry = {
      "child-comp": {
        selector: "child-comp",
        component: Component as any,
        template: document.createElement("div"),
        nodes: parser.parse("<b>child</b>"),
      },
      "parent-comp": {
        selector: "parent-comp",
        component: Component as any,
        template: document.createElement("div"),
        nodes: parser.parse("<div>parent<child-comp></child-comp></div>"),
      },
    };
    
    const transpiler = new Transpiler({ registry });
    const container = document.createElement("div");
    transpiler.transpile(parser.parse("<parent-comp></parent-comp>"), {}, container);
    
    expect(container.querySelector("parent-comp")).not.toBeNull();
    expect(container.querySelector("child-comp")).not.toBeNull();
    expect(container.textContent).toContain("parentchild");
  });

  describe("Slots", () => {
    it("renders default slot content", () => {
      const parser = new TemplateParser();
      const registry = {
        "my-layout": {
          selector: "my-layout",
          component: Component as any,
          template: document.createElement("div"),
          nodes: parser.parse('<div class="wrapper"><slot></slot></div>'),
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      transpiler.transpile(
        parser.parse('<my-layout><span>Inside Slot</span></my-layout>'),
        {},
        container
      );
      expect(container.querySelector(".wrapper span")).not.toBeNull();
      expect(container.textContent).toBe("Inside Slot");
    });

    it("renders default slot content with self-closing slot", () => {
      const parser = new TemplateParser();
      const registry = {
        "my-layout": {
          selector: "my-layout",
          component: Component as any,
          template: document.createElement("div"),
          nodes: parser.parse('<div class="wrapper"><slot /></div>'),
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      transpiler.transpile(
        parser.parse('<my-layout><span>Inside Slot</span></my-layout>'),
        {},
        container
      );
      expect(container.querySelector(".wrapper span")).not.toBeNull();
      expect(container.textContent).toBe("Inside Slot");
    });

    it("renders named slots", () => {
      const parser = new TemplateParser();
      const registry = {
        "multi-slot": {
          selector: "multi-slot",
          component: Component as any,
          template: document.createElement("div"),
          nodes: parser.parse(`
            <header><slot @name="header"></slot></header>
            <main><slot></slot></main>
            <footer><slot @name="footer"></slot></footer>
          `),
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      const source = `
        <multi-slot>
          <h1 @slot="header">Title</h1>
          <p>Body Content</p>
          <small @slot="footer">Copyright</small>
        </multi-slot>
      `;
      transpiler.transpile(parser.parse(source), {}, container);
      expect(container.querySelector("header h1")!.textContent).toBe("Title");
      expect(container.querySelector("main p")!.textContent).toBe("Body Content");
      expect(container.querySelector("footer small")!.textContent).toBe("Copyright");
    });

    it("renders named slots with self-closing slot", () => {
      const parser = new TemplateParser();
      const registry = {
        "multi-slot": {
          selector: "multi-slot",
          component: Component as any,
          template: document.createElement("div"),
          nodes: parser.parse(`
            <header><slot @name="header" /></header>
            <main><slot /></main>
            <footer><slot @name="footer" /></footer>
          `),
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      const source = `
        <multi-slot>
          <h1 @slot="header">Title</h1>
          <p>Body Content</p>
          <small @slot="footer">Copyright</small>
        </multi-slot>
      `;
      transpiler.transpile(parser.parse(source), {}, container);
      expect(container.querySelector("header h1")!.textContent).toBe("Title");
      expect(container.querySelector("main p")!.textContent).toBe("Body Content");
      expect(container.querySelector("footer small")!.textContent).toBe("Copyright");
    });
  });
});
