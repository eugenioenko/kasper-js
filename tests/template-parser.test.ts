import { describe, test, expect } from "vitest";
import { TemplateParser } from "@src/template-parser";
import * as Node from "@src/types/nodes";

describe("TemplateParser", () => {
  test("parses a single element", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<div></div>");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBeInstanceOf(Node.Element);
    const el = nodes[0] as Node.Element;
    expect(el.name).toBe("div");
    expect(el.children).toHaveLength(0);
  });

  test("parses text node", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("hello world");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBeInstanceOf(Node.Text);
    expect((nodes[0] as Node.Text).value).toBe("hello world");
  });

  test("parses comment node", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<!-- comment -->");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBeInstanceOf(Node.Comment);
    expect((nodes[0] as Node.Comment).value).toBe(" comment ");
  });

  test("parses doctype node", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<!DOCTYPE html>");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBeInstanceOf(Node.Doctype);
    expect((nodes[0] as Node.Doctype).value.toLowerCase()).toBe("html");
  });

  test("parses self-closing tag", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<img/>");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBeInstanceOf(Node.Element);
    const el = nodes[0] as Node.Element;
    expect(el.self).toBe(true);
  });

  test("parses br element as self-closing", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<br>");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toBeInstanceOf(Node.Element);
    const el = nodes[0] as Node.Element;
    expect(el.self).toBe(true);
  });

  test("parses nested elements", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<div><span>text</span></div>");
    expect(nodes).toHaveLength(1);
    const div = nodes[0] as Node.Element;
    expect(div.children).toHaveLength(1);
    const span = div.children[0] as Node.Element;
    expect(span).toBeInstanceOf(Node.Element);
    expect(span.name).toBe("span");
    expect(span.children[0] as Node.Text).toBeInstanceOf(Node.Text);
  });

  test("parses multiple root nodes", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<a></a><b></b>");
    expect(nodes).toHaveLength(2);
    const a = nodes[0] as Node.Element;
    const b = nodes[1] as Node.Element;
    expect(a.name).toBe("a");
    expect(b.name).toBe("b");
  });

  test("parses attributes (quoted, unquoted, empty)", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse('<input type="text" value=foo empty >');
    const input = nodes[0] as Node.Element;
    expect(input.attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "type", value: "text" }),
        expect.objectContaining({ name: "value", value: "foo" }),
        expect.objectContaining({ name: "empty", value: "" }),
      ])
    );
  });

  test("parses attributes with single and double quotes", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<div a='1' b=\"2\"></div>");
    const attrs = (nodes[0] as Node.Element).attributes;
    expect(
      (attrs.find((a) => (a as Node.Attribute).name === "a") as Node.Attribute)
        ?.value
    ).toBe("1");
    expect(
      (attrs.find((a) => (a as Node.Attribute).name === "b") as Node.Attribute)
        ?.value
    ).toBe("2");
  });

  test("parses text between elements", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("<div>foo</div>bar");
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toBeInstanceOf(Node.Element);
    expect(nodes[1]).toBeInstanceOf(Node.Text);
    expect((nodes[1] as Node.Text).value).toBe("bar");
  });

  test("handles whitespace and newlines", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("  <div>\n  <span>hi</span>\n</div>  ");
    expect(nodes).toHaveLength(1);
    const div = nodes[0] as Node.Element;
    expect(div.children[0]).toBeInstanceOf(Node.Element);
  });

  test("throws on unterminated comment", () => {
    const parser = new TemplateParser();
    parser.parse("<!-- unterminated");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toMatch(/Unterminated comment/);
  });

  test("throws on unterminated doctype", () => {
    const parser = new TemplateParser();
    parser.parse("<!DOCTYPE html");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toMatch(/Unterminated doctype/);
  });

  test("throws on unterminated tag", () => {
    const parser = new TemplateParser();
    parser.parse("<div");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toContain("Unterminated tag: expected '/', '>'");
  });

  test("throws on unexpected closing tag", () => {
    const parser = new TemplateParser();
    parser.parse("</div>");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toMatch(/Unexpected closing tag/);
  });

  test("throws on unterminated string attribute", () => {
    const parser = new TemplateParser();
    parser.parse("<div a='unterminated></div>");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toMatch(/Unterminated string/);
  });

  test("throws on blank attribute name", () => {
    const parser = new TemplateParser();
    parser.parse("<div =foo></div>");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toMatch(/Blank attribute name/);
  });

  test("throws on unterminated identifier", () => {
    const parser = new TemplateParser();
    parser.parse("<div foo");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toContain(
      "Unterminated tag: expected '=', '>', '/>'"
    );
  });

  test("handles empty input", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("");
    expect(nodes).toHaveLength(0);
  });

  test("handles only whitespace input", () => {
    const parser = new TemplateParser();
    const nodes = parser.parse("   \n\t  ");
    expect(nodes).toHaveLength(0);
  });

  test("tracks line and column for errors", () => {
    const parser = new TemplateParser();
    parser.parse("<div>\n<span></div>");
    expect(parser.errors.length).toBeGreaterThan(0);
    expect(parser.errors[0]).toMatch(/Parse Error \(2:/);
  });
});
