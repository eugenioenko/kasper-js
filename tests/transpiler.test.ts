import { Transpiler } from "@src/transpiler";
import * as KNode from "@src/types/nodes";
import { Scope } from "@src/scope";
import { describe, test, expect, vi } from "vitest";

function makeElement(
  attrs: KNode.Attribute[] = [],
  children: KNode.KNode[] = [],
  name = "div",
  self = false
): KNode.Element {
  return {
    type: "element",
    name,
    attributes: attrs,
    children,
    self,
    accept(visitor: any, parent?: Node) {
      return visitor.visitElementKNode(this, parent);
    },
    line: 0,
  } as unknown as KNode.Element;
}

function makeAttr(name: string, value = ""): KNode.Attribute {
  return {
    type: "attribute",
    name,
    value,
    accept(visitor: any, parent?: Node) {
      return visitor.visitAttributeKNode(this, parent);
    },
    line: 0,
  } as unknown as KNode.Attribute;
}

function makeText(value: string): KNode.Text {
  return {
    type: "text",
    value,
    line: 0,
    accept(visitor: any, parent?: Node) {
      return visitor.visitTextKNode(this, parent);
    },
  } as KNode.Text;
}

function makeComment(value: string): KNode.Comment {
  return {
    type: "comment",
    value,
    line: 0,
    accept(visitor: any, parent?: Node) {
      return visitor.visitCommentKNode(this, parent);
    },
  } as KNode.Comment;
}

describe("Transpiler", () => {
  test("constructor sets registry", () => {
    const registry = {
      foo: {
        selector: "foo",
        component: class {} as new (args?: any) => any,
        template: document.createElement("div"),
        nodes: [] as KNode.KNode[],
      },
    };
    const t = new Transpiler({ registry });
    expect((t as any).registry).toBe(registry);
  });

  test("constructor with no options", () => {
    const t = new Transpiler();
    expect(typeof t).toBe("object");
  });

  test("transpile sets up scope and calls createSiblings", () => {
    const t = new Transpiler();
    const nodes = [makeElement()];
    const container = document.createElement("div");
    const spy = vi.spyOn(t as any, "createSiblings");
    t.transpile(nodes, { foo: 1 }, container);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("transpile catches errors", () => {
    const t = new Transpiler();
    const nodes = [makeElement()];
    const container = document.createElement("div");
    vi.spyOn(t as any, "createSiblings").mockImplementation(() => {
      throw new Error("fail");
    });
    expect(() => t.transpile(nodes, {}, container)).not.toThrow();
  });

  test("visitElementKNode calls createElement", () => {
    const t = new Transpiler();
    const node = makeElement();
    const spy = vi.spyOn(t as any, "createElement");
    t.visitElementKNode(node);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("visitTextKNode creates text node and appends to parent", () => {
    const t = new Transpiler();
    const node = makeText("Hello {{foo}}!");
    (t as any).evaluateTemplateString = vi.fn(() => "hi");
    const parent = document.createElement("div");
    t.visitTextKNode(node, parent);
    expect(parent.textContent).toBe("hi");
  });

  test("visitCommentKNode appends comment", () => {
    const t = new Transpiler();
    const node = makeComment("hi");
    const parent = document.createElement("div");
    t.visitCommentKNode(node, parent);
    expect(parent.childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
  });

  test("findAttr returns correct attribute and null", () => {
    const t = new Transpiler();
    const node = makeElement([makeAttr("@if", "x > 1")]);
    expect((t as any).findAttr(node, ["@if"])).toBe(node.attributes[0]);
    expect((t as any).findAttr(node, ["@else"])).toBe(null);
    expect((t as any).findAttr(null, ["@if"])).toBe(null);
    expect((t as any).findAttr(makeElement(), ["@if"])).toBe(null);
  });

  test("doIf handles if/elseif/else", () => {
    const t = new Transpiler();
    const parent = document.createElement("div");
    const ifNode = makeElement([], [], "div");
    const elseifNode = makeElement([], [], "div");
    const elseNode = makeElement([], [], "div");
    const ifAttr = makeAttr("@if", "true");
    const elseifAttr = makeAttr("@elseif", "false");
    const elseAttr = makeAttr("@else");
    vi.spyOn(t as any, "execute").mockImplementation((v) => v === "true");
    vi.spyOn(t as any, "createElement").mockImplementation(() => {
      parent.appendChild(document.createElement("div"));
    });
    (t as any).doIf(
      [
        [ifNode, ifAttr],
        [elseifNode, elseifAttr],
        [elseNode, elseAttr],
      ],
      parent
    );
    expect(parent.childNodes.length).toBe(1);
  });

  test("doEach iterates and creates elements", () => {
    const t = new Transpiler();
    const node = makeElement();
    const attr = makeAttr("@each", "item,,[1,2]");
    (t as any).scanner.scan = vi.fn(() => []);
    (t as any).parser.foreach = vi.fn(() => []);
    (t as any).interpreter.evaluate = vi.fn(() => ["item", null, [1, 2]]);
    (t as any).createElement = vi.fn();
    (t as any).interpreter.scope = new Scope();
    (t as any).doEach(attr, node, document.createElement("div"));
    expect((t as any).createElement).toHaveBeenCalledTimes(2);
  });

  test("doWhile loops and creates elements", () => {
    const t = new Transpiler();
    const node = makeElement();
    const attr = makeAttr("@while", "x < 2");
    let count = 0;
    (t as any).execute = vi.fn(() => count++ < 2);
    (t as any).createElement = vi.fn();
    (t as any).interpreter.scope = new Scope();
    (t as any).doWhile(attr, node, document.createElement("div"));
    expect((t as any).createElement).toHaveBeenCalledTimes(2);
  });

  test("doLet executes and sets $ref", () => {
    const t = new Transpiler();
    const node = makeElement();
    const attr = makeAttr("@let", "x = 1");
    (t as any).execute = vi.fn();
    (t as any).createElement = vi.fn(() => "el");
    (t as any).interpreter.scope = new Scope();
    (t as any).doLet(attr, node, document.createElement("div"));
    expect((t as any).interpreter.scope.get("$ref")).toBe("el");
  });

  test("createSiblings handles all control flow and fallback", () => {
    const t = new Transpiler();
    const parent = document.createElement("div");
    const eachNode = makeElement([makeAttr("@each", "")]);
    const ifNode = makeElement([makeAttr("@if", "")]);
    const whileNode = makeElement([makeAttr("@while", "")]);
    const letNode = makeElement([makeAttr("@let", "")]);
    const normalNode = makeElement();
    vi.spyOn(t as any, "findAttr").mockImplementation((n: any, arr: any) => {
      if (n === eachNode && arr[0] === "@each") return makeAttr("@each");
      if (n === ifNode && arr[0] === "@if") return makeAttr("@if");
      if (n === whileNode && arr[0] === "@while") return makeAttr("@while");
      if (n === letNode && arr[0] === "@let") return makeAttr("@let");
      return null;
    });
    vi.spyOn(t as any, "doEach").mockImplementation(() => {});
    vi.spyOn(t as any, "doIf").mockImplementation(() => {});
    vi.spyOn(t as any, "doWhile").mockImplementation(() => {});
    vi.spyOn(t as any, "doLet").mockImplementation(() => {});
    vi.spyOn(t as any, "evaluate").mockImplementation(() => {});
    (t as any).createSiblings(
      [eachNode, ifNode, whileNode, letNode, normalNode],
      parent
    );
    expect((t as any).evaluate).toHaveBeenCalled();
  });

  test("createElement handles void, component, events, attributes, children", () => {
    const t = new Transpiler({
      registry: {
        Foo: {
          selector: "Foo",
          component: class {
            args: any;
            constructor() {
              this.args = {};
            }
          } as new (args?: any) => any,
          template: document.createElement("div"),
          nodes: [] as KNode.KNode[],
        },
      },
    });
    const node = makeElement(
      [
        makeAttr("@on:click", "foo()"),
        makeAttr("bar", "baz"),
        makeAttr("@:x", "1"),
      ],
      [],
      "Foo"
    );
    (t as any).createComponentArgs = vi.fn(() => ({ x: 1 }));
    (t as any).createSiblings = vi.fn();
    (t as any).interpreter.scope = new Scope();
    const el = (t as any).createElement(node, document.createElement("div"));
    expect(el).toBeDefined();
  });

  test("createComponentArgs extracts args", () => {
    const t = new Transpiler();
    const args = [makeAttr("@:foo", "bar")];
    (t as any).evaluateTemplateString = vi.fn(() => "baz");
    const result = (t as any).createComponentArgs(args);
    expect(result.foo).toBe("baz");
    expect((t as any).createComponentArgs([])).toEqual({});
  });

  test("createEventListener binds event", () => {
    const t = new Transpiler();
    const el = document.createElement("div");
    const attr = makeAttr("@on:click", "foo()");
    (t as any).interpreter.scope = new Scope();
    (t as any).execute = vi.fn();
    (t as any).createEventListener(el, attr);
    el.dispatchEvent(new Event("click"));
    expect((t as any).execute).toHaveBeenCalled();
  });

  test("evaluateTemplateString replaces placeholders", () => {
    const t = new Transpiler();
    (t as any).evaluateExpression = vi.fn(() => "bar");
    expect((t as any).evaluateTemplateString("foo {{baz}} qux")).toBe(
      "foo bar qux"
    );
    expect((t as any).evaluateTemplateString("")).toBe("");
    expect((t as any).evaluateTemplateString("no template")).toBe(
      "no template"
    );
  });

  test("evaluateExpression parses and evaluates", () => {
    const t = new Transpiler();
    (t as any).scanner.scan = vi.fn(() => []);
    (t as any).parser.parse = vi.fn(() => [1, 2]);
    (t as any).parser.errors = [];
    (t as any).interpreter.evaluate = vi.fn(() => "x");
    expect((t as any).evaluateExpression("foo")).toBe("xx");
  });

  test("evaluateExpression throws on parser error", () => {
    const t = new Transpiler();
    (t as any).scanner.scan = vi.fn(() => []);
    (t as any).parser.parse = vi.fn(() => []);
    (t as any).parser.errors = ["fail"];
    expect(() => (t as any).evaluateExpression("foo")).toThrow();
  });

  test("visitDoctypeKNode throws", () => {
    const t = new Transpiler();
    expect(() => t.visitDoctypeKNode({} as KNode.Doctype)).toThrow();
  });

  test("error throws", () => {
    const t = new Transpiler();
    expect(() => t.error("fail")).toThrow(/fail/);
  });
});
