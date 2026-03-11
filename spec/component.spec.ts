import { describe, it, expect, vi } from "vitest";
import { Component } from "../src/component";
import { Transpiler } from "../src/transpiler";
import { TemplateParser } from "../src/template-parser";

describe("Component", () => {
  it("initializes with default values", () => {
    const component = new Component();
    expect(component.args).toEqual({});
    expect(component.ref).toBeUndefined();
    expect(component.transpiler).toBeUndefined();
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

  describe("Lifecycle hooks", () => {
    class TestComponent extends Component {
      initialized = false;
      rendered = false;
      
      $onInit = () => {
        this.initialized = true;
      };
      
      $onRender = () => {
        this.rendered = true;
      };
    }

    it("executes $onInit and $onRender when transpiled", () => {
      const parser = new TemplateParser();
      let initCalled = false;
      let renderCalled = false;

      class LifecycleComponent extends Component {
        $onInit = () => { initCalled = true; };
        $onRender = () => { renderCalled = true; };
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
    
    transpiler.transpile(parser.parse('<greet-comp @:name="Kasper"></greet-comp>'), {}, container);
    
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
});
