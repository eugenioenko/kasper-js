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

  it("render() does nothing when $render is not set", () => {
    const component = new Component();
    expect(() => component.render()).not.toThrow();
  });

  it("lifecycle hook methods exist and are callable", () => {
    const component = new Component();
    expect(() => component.onMount()).not.toThrow();
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

  it("makes this.args available in the constructor", () => {
    const args = { initialValue: 42 };
    class TestComponent extends Component {
      valueFromConstructor: number;
      constructor(props: any) {
        super(props);
        this.valueFromConstructor = this.args.initialValue;
      }
    }
    const component = new TestComponent({ args });
    expect(component.valueFromConstructor).toBe(42);
  });

  describe("render", () => {
    it("render() does nothing when $render is not set", () => {
      const component = new Component();
      expect(() => component.render()).not.toThrow();
    });

    it("render() re-renders component content", () => {
      const parser = new TemplateParser();
      let label = "first";

      class ManualComponent extends Component {
        getLabel() { return label; }
      }

      const registry = {
        "manual-comp": {
          selector: "manual-comp",
          component: ManualComponent as any,
          template: document.createElement("div"),
          nodes: parser.parse("<span>{{getLabel()}}</span>"),
        },
      };

      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      transpiler.transpile(parser.parse("<manual-comp></manual-comp>"), {}, container);
      expect(container.textContent).toBe("first");

      label = "second";
      const instance = (container.querySelector("manual-comp") as any)?.$kasperInstance;
      instance.render();
      expect(container.textContent).toBe("second");
    });

    it("render() calls onRender after re-render", () => {
      const parser = new TemplateParser();
      let renderCount = 0;

      class RenderCountComponent extends Component {
        onRender() { renderCount++; }
      }

      const registry = {
        "render-count-comp": {
          selector: "render-count-comp",
          component: RenderCountComponent as any,
          template: document.createElement("div"),
          nodes: parser.parse("<span></span>"),
        },
      };

      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      transpiler.transpile(parser.parse("<render-count-comp></render-count-comp>"), {}, container);
      expect(renderCount).toBe(1);

      const instance = (container.querySelector("render-count-comp") as any)?.$kasperInstance;
      instance.render();
      expect(renderCount).toBe(2);
    });
  });

  describe("Lifecycle hooks", () => {
    it("executes onMount and onRender when transpiled", () => {
      const parser = new TemplateParser();
      let initCalled = false;
      let renderCalled = false;

      class LifecycleComponent extends Component {
        onMount = () => { initCalled = true; };
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

    it("calls onChanges and onRender on reactive signal updates", async () => {
      const parser = new TemplateParser();
      const count = signal(0);
      let changesCalled = 0;
      let renderCalled = 0;

      class ReactiveComponent extends Component {
        onChanges() { changesCalled++; }
        onRender() { renderCalled++; }
      }

      const registry = {
        "reactive-comp": {
          selector: "reactive-comp",
          component: ReactiveComponent as any,
          template: document.createElement("div"),
          nodes: parser.parse("<span>{{count.value}}</span>"),
        },
      };
      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");

      transpiler.transpile(parser.parse("<reactive-comp></reactive-comp>"), { count }, container);

      // Initial mount
      expect(renderCalled).toBe(1);
      expect(changesCalled).toBe(0);

      // Trigger update
      count.value = 1;
      await Promise.resolve(); // Wait for effect

      expect(changesCalled).toBe(1);
      expect(renderCalled).toBe(2);
    });

    it("triggers lifecycle hooks for nested components on mount", () => {
      const parser = new TemplateParser();
      let childMounted = false;
      let childRendered = false;

      class ChildComp extends Component {
        onMount() { childMounted = true; }
        onRender() { childRendered = true; }
      }

      const registry = {
        "child-comp": {
          selector: "child-comp",
          component: ChildComp as any,
          template: document.createElement("div"),
          nodes: parser.parse("<b>child</b>"),
        },
        "parent-comp": {
          selector: "parent-comp",
          component: Component as any,
          template: document.createElement("div"),
          nodes: parser.parse("<child-comp></child-comp>"),
        },
      };

      const transpiler = new Transpiler({ registry });
      const container = document.createElement("div");
      transpiler.transpile(parser.parse("<parent-comp></parent-comp>"), {}, container);

      expect(childMounted).toBe(true);
      expect(childRendered).toBe(true);
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
