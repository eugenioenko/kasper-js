// @vitest-environment node
import { TemplateParser } from "../src/template-parser";
import * as Node from "../src/types/nodes";

function parse(source: string): Node.KNode[] {
  return new TemplateParser().parse(source);
}

function parseOne(source: string): Node.KNode {
  return parse(source)[0];
}

function parseElement(source: string): Node.Element {
  return parseOne(source) as Node.Element;
}

describe("TemplateParser", () => {
  describe("state reset", () => {
    it("resets state between parse() calls", () => {
      const parser = new TemplateParser();
      parser.parse("<div></div>");
      const nodes = parser.parse("<span></span>");
      expect(nodes).toHaveLength(1);
      expect((nodes[0] as Node.Element).name).toBe("span");
    });

    it("clears errors between parse() calls", () => {
      const parser = new TemplateParser();
      parser.parse("</orphan>");
      expect(parser.errors).toHaveLength(1);
      parser.parse("<div></div>");
      expect(parser.errors).toHaveLength(0);
    });
  });

  describe("text nodes", () => {
    it("parses plain text", () => {
      const node = parseOne("hello") as Node.Text;
      expect(node.type).toBe("text");
      expect(node.value).toBe("hello");
    });

    it("trims surrounding whitespace from text", () => {
      const node = parseOne("  hello  ") as Node.Text;
      expect(node.value).toBe("hello");
    });

    it("returns no nodes for whitespace-only input", () => {
      expect(parse("   \n\t  ")).toHaveLength(0);
    });

    it("text node preserves interpolation syntax", () => {
      const node = parseOne("{{name}}") as Node.Text;
      expect(node.value).toBe("{{name}}");
    });

    it("text with mixed content", () => {
      const node = parseOne("Hello {{name}}!") as Node.Text;
      expect(node.value).toBe("Hello {{name}}!");
    });
  });

  describe("comment nodes", () => {
    it("parses a comment", () => {
      const node = parseOne("<!-- hello -->") as Node.Comment;
      expect(node.type).toBe("comment");
    });

    it("comment value contains the inner text", () => {
      const node = parseOne("<!-- hello -->") as Node.Comment;
      expect(node.value).toContain("hello");
    });

    it("parses a multiline comment", () => {
      const node = parseOne("<!--\nline1\nline2\n-->") as Node.Comment;
      expect(node.type).toBe("comment");
      expect(node.value).toContain("line1");
    });

    it("comment does not appear as element", () => {
      const node = parseOne("<!-- note -->");
      expect(node.type).not.toBe("element");
    });
  });

  describe("doctype nodes", () => {
    it("parses uppercase DOCTYPE", () => {
      const node = parseOne("<!DOCTYPE html>") as Node.Doctype;
      expect(node.type).toBe("doctype");
      expect(node.value).toContain("html");
    });

    it("parses lowercase doctype", () => {
      const node = parseOne("<!doctype html>") as Node.Doctype;
      expect(node.type).toBe("doctype");
    });
  });

  describe("element nodes", () => {
    it("parses a simple element", () => {
      const el = parseElement("<div></div>");
      expect(el.type).toBe("element");
      expect(el.name).toBe("div");
    });

    it("element has empty children by default", () => {
      const el = parseElement("<div></div>");
      expect(el.children).toHaveLength(0);
    });

    it("element has empty attributes by default", () => {
      const el = parseElement("<div></div>");
      expect(el.attributes).toHaveLength(0);
    });

    it("self is false for regular elements", () => {
      expect(parseElement("<div></div>").self).toBe(false);
    });

    it("parses element with text child", () => {
      const el = parseElement("<p>hello</p>");
      expect(el.children).toHaveLength(1);
      expect((el.children[0] as Node.Text).value).toBe("hello");
    });

    it("parses nested elements", () => {
      const el = parseElement("<div><span></span></div>");
      expect(el.children).toHaveLength(1);
      expect((el.children[0] as Node.Element).name).toBe("span");
    });

    it("parses multiple children", () => {
      const el = parseElement("<ul><li></li><li></li><li></li></ul>");
      expect(el.children).toHaveLength(3);
    });

    it("parses deeply nested elements", () => {
      const el = parseElement("<a><b><c></c></b></a>");
      const b = el.children[0] as Node.Element;
      const c = b.children[0] as Node.Element;
      expect(b.name).toBe("b");
      expect(c.name).toBe("c");
    });

    it("parses multiple root nodes", () => {
      const nodes = parse("<div></div><span></span>");
      expect(nodes).toHaveLength(2);
      expect((nodes[0] as Node.Element).name).toBe("div");
      expect((nodes[1] as Node.Element).name).toBe("span");
    });
  });

  describe("self-closing elements", () => {
    it("explicit self-close with />" , () => {
      expect(parseElement("<div/>").self).toBe(true);
    });

    it("explicit self-close with /> has no children", () => {
      expect(parseElement("<div/>").children).toHaveLength(0);
    });

    it("br is implicitly self-closing", () => {
      expect(parseElement("<br>").self).toBe(true);
    });

    it("img is implicitly self-closing", () => {
      expect(parseElement("<img>").self).toBe(true);
    });

    it("input is implicitly self-closing", () => {
      expect(parseElement("<input>").self).toBe(true);
    });

    it("hr is implicitly self-closing", () => {
      expect(parseElement("<hr>").self).toBe(true);
    });

    it("link is implicitly self-closing", () => {
      expect(parseElement("<link>").self).toBe(true);
    });

    it("meta is implicitly self-closing", () => {
      expect(parseElement("<meta>").self).toBe(true);
    });
  });

  describe("attributes", () => {
    it("parses a double-quoted attribute", () => {
      const el = parseElement(`<div class="foo"></div>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.type).toBe("attribute");
      expect(attr.name).toBe("class");
      expect(attr.value).toBe("foo");
    });

    it("parses a single-quoted attribute", () => {
      const el = parseElement(`<div class='bar'></div>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.value).toBe("bar");
    });

    it("parses a boolean attribute (no value)", () => {
      const el = parseElement(`<button disabled></button>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.name).toBe("disabled");
      expect(attr.value).toBe("");
    });

    it("parses multiple attributes", () => {
      const el = parseElement(`<div id="a" class="b"></div>`);
      expect(el.attributes).toHaveLength(2);
    });

    it("parses kasper @if directive", () => {
      const el = parseElement(`<div @if="show"></div>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.name).toBe("@if");
      expect(attr.value).toBe("show");
    });

    it("parses kasper @each directive", () => {
      const el = parseElement(`<li @each="item of list"></li>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.name).toBe("@each");
      expect(attr.value).toBe("item of list");
    });

    it("parses kasper @on:click directive", () => {
      const el = parseElement(`<button @on:click="handler()"></button>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.name).toBe("@on:click");
      expect(attr.value).toBe("handler()");
    });

    it("parses kasper @attr: directive", () => {
      const el = parseElement(`<input @attr:disabled="isDisabled"/>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.name).toBe("@attr:disabled");
      expect(attr.value).toBe("isDisabled");
    });

    it("parses kasper @let directive", () => {
      const el = parseElement(`<div @let="x = 1"></div>`);
      const attr = el.attributes[0] as Node.Attribute;
      expect(attr.name).toBe("@let");
      expect(attr.value).toBe("x = 1");
    });
  });

  describe("line tracking", () => {
    it("tracks line number on elements", () => {
      const el = parseElement("<div></div>");
      expect(el.line).toBe(1);
    });

    it("increments line for elements on subsequent lines", () => {
      const nodes = parse("<div></div>\n<span></span>");
      expect((nodes[0] as Node.Element).line).toBe(1);
      expect((nodes[1] as Node.Element).line).toBe(2);
    });

    it("tracks line for text nodes", () => {
      const node = parseOne("hello") as Node.Text;
      expect(node.line).toBe(1);
    });
  });

  describe("whitespace handling", () => {
    it("ignores whitespace between sibling elements", () => {
      const el = parseElement("<div>  <span></span>  </div>");
      expect(el.children).toHaveLength(1);
      expect((el.children[0] as Node.Element).name).toBe("span");
    });

    it("ignores leading whitespace before root element", () => {
      const nodes = parse("   <div></div>");
      expect(nodes).toHaveLength(1);
    });

    it("ignores trailing whitespace after root element", () => {
      const nodes = parse("<div></div>   ");
      expect(nodes).toHaveLength(1);
    });
  });

  describe("error handling", () => {
    it("records error for unexpected closing tag", () => {
      const parser = new TemplateParser();
      parser.parse("</div>");
      expect(parser.errors).toHaveLength(1);
      expect(parser.errors[0]).toContain("Unexpected closing tag");
    });

    it("records error for unclosed element", () => {
      const parser = new TemplateParser();
      parser.parse("<div>");
      expect(parser.errors).toHaveLength(1);
    });

    it("records error with line and column info", () => {
      const parser = new TemplateParser();
      parser.parse("</div>");
      expect(parser.errors[0]).toMatch(/\(\d+:\d+\)/);
    });

    it("returns nodes parsed before the error", () => {
      const parser = new TemplateParser();
      const nodes = parser.parse("<span></span></orphan>");
      expect(nodes.length).toBeGreaterThanOrEqual(1);
      expect((nodes[0] as Node.Element).name).toBe("span");
    });
  });
});
