import { describe, it, expect, vi } from "vitest";
import { App, Component } from "../src/index";

describe("Kasper Bootstrap (App / bootstrap)", () => {
  it("successfully mounts a root component", () => {
    const root = document.createElement("div");
    root.id = "app";
    document.body.appendChild(root);
    
    class RootComp extends Component {}
    
    App({
      root: "#app",
      entry: "root-comp",
      registry: {
        "root-comp": {
          component: RootComp as any,
          template: "<span>Hello World</span>"
        }
      }
    });
    
    expect(root.textContent).toBe("Hello World");
    document.body.removeChild(root);
  });

  it("throws error if root element is not found", () => {
    expect(() => {
      App({
        root: "#non-existent",
        registry: {}
      });
    }).toThrow("Root element not found: #non-existent");
  });

  it("works with HTMLElement as root", () => {
    const root = document.createElement("div");
    class RootComp extends Component {}
    
    App({
      root: root,
      entry: "root-comp",
      registry: {
        "root-comp": {
          component: RootComp as any,
          template: "<span>Using HTMLElement</span>"
        }
      }
    });
    
    expect(root.textContent).toBe("Using HTMLElement");
  });

  it("initializes registry from static template on component", () => {
    const root = document.createElement("div");
    class StaticComp extends Component {
      static template = "<b>Static Template</b>";
    }
    
    App({
      root: root,
      entry: "static-comp",
      registry: {
        "static-comp": { component: StaticComp as any }
      }
    });
    
    expect(root.innerHTML).toContain("<b>Static Template</b>");
  });

  it("calls onMount and onRender in order during bootstrap", () => {
    const root = document.createElement("div");
    const order: string[] = [];
    
    class LifecycleComp extends Component {
      static template = "<div></div>";
      onMount() { order.push("mount"); }
      onRender() { order.push("render"); }
    }
    
    App({
      root: root,
      entry: "life-comp",
      registry: {
        "life-comp": { component: LifecycleComp as any }
      }
    });
    
    expect(order).toEqual(["mount", "render"]);
  });

  it("empty registry or missing entry component (should probably handle gracefully or throw)", () => {
    const root = document.createElement("div");
    // This currently might throw because createComponent expects the tag to exist in registry
    expect(() => {
      App({
        root: root,
        entry: "missing",
        registry: {}
      });
    }).toThrow();
  });
});
