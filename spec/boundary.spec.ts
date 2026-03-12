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
