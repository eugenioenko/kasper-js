import { describe, it, expect } from "vitest";
import { Boundary } from "../src/boundary";

describe("Boundary", () => {
  it("creates start and end markers in parent", () => {
    const parent = document.createElement("div");
    new Boundary(parent, "test");
    expect(parent.childNodes).toHaveLength(2);
    expect(parent.childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
    expect(parent.childNodes[0].textContent).toBe("test-start");
    expect(parent.childNodes[1].nodeType).toBe(Node.COMMENT_NODE);
    expect(parent.childNodes[1].textContent).toBe("test-end");
  });

  it("inserts nodes between markers", () => {
    const parent = document.createElement("div");
    const b = new Boundary(parent, "test");
    const span = document.createElement("span");
    b.insert(span);
    
    expect(parent.childNodes).toHaveLength(3);
    expect(parent.childNodes[1]).toBe(span);
  });

  it("parent getter returns the parent node", () => {
    const parent = document.createElement("div");
    const b = new Boundary(parent, "test");
    expect(b.parent).toBe(parent);
  });

  it("accepts another Boundary as parent (nested boundaries)", () => {
    // Bug: Boundary constructor called parent.appendChild() assuming a real DOM node.
    // When void+@if passes a Boundary as parent to a child @each, a nested Boundary
    // was created with a Boundary parent — throwing "parent.appendChild is not a function".
    const dom = document.createElement("div");
    const outer = new Boundary(dom, "if");
    // Should not throw — inner boundary must use outer.insert() instead of appendChild
    expect(() => new Boundary(outer as any, "each")).not.toThrow();

    const inner = new Boundary(outer as any, "each");
    const span = document.createElement("span");
    inner.insert(span);

    // span should be inside the outer boundary (before outer's end marker)
    const outerNodes = outer.nodes();
    expect(outerNodes).toContain(span);
  });

  it("clears only nodes between markers", () => {
    const parent = document.createElement("div");
    const before = document.createTextNode("before");
    parent.appendChild(before);
    
    const b = new Boundary(parent, "test");
    b.insert(document.createElement("span"));
    b.insert(document.createElement("div"));
    
    const after = document.createTextNode("after");
    parent.appendChild(after);
    
    expect(parent.childNodes).toHaveLength(6); // before, start, span, div, end, after
    
    b.clear();
    
    expect(parent.childNodes).toHaveLength(4); // before, start, end, after
    expect(parent.firstChild).toBe(before);
    expect(parent.lastChild).toBe(after);
  });
});
