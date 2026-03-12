import { describe, it, expect, vi } from "vitest";
import { Viewer } from "../src/viewer";
import { TemplateParser } from "../src/template-parser";

function parse(html: string) {
  return new TemplateParser().parse(html);
}

describe("Viewer", () => {
  it("renders a simple element", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse("<div>hello</div>"));
    expect(result).toEqual(["<div>hello</div>"]);
  });

  it("renders self-closing elements", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse("<br/>"));
    expect(result[0]).toContain("br");
  });

  it("renders element with attributes", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse('<a href="/home">link</a>'));
    expect(result[0]).toContain('href="/home"');
    expect(result[0]).toContain("link");
  });

  it("renders attribute without value (boolean attribute)", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse("<input disabled/>"));
    expect(result[0]).toContain("disabled");
  });

  it("renders text nodes", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse("hello world"));
    expect(result[0]).toBe("hello world");
  });

  it("renders comment nodes", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse("<!-- a comment -->"));
    expect(result[0]).toContain("a comment");
  });

  it("renders doctype nodes", () => {
    const viewer = new Viewer();
    const result = viewer.transpile(parse("<!doctype html>"));
    expect(result[0]).toContain("doctype");
  });

  it("collects errors and continues on bad nodes", () => {
    const viewer = new Viewer();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Inject a broken node directly via a bad accept implementation
    const badNode = {
      accept: () => { throw new Error("bad node"); }
    } as any;

    const result = viewer.transpile([badNode]);
    expect(viewer.errors.length).toBe(1);
    expect(viewer.errors[0]).toContain("bad node");
    spy.mockRestore();
  });

  it("stops collecting after 100 errors and adds limit message", () => {
    const viewer = new Viewer();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const badNode = {
      accept: () => { throw new Error("err"); }
    } as any;

    viewer.transpile(Array(102).fill(badNode));
    expect(viewer.errors).toContain("Error limit exceeded");
    spy.mockRestore();
  });

  it("error() throws a runtime error", () => {
    const viewer = new Viewer();
    expect(() => viewer.error("something went wrong")).toThrow("Runtime Error => something went wrong");
  });
});
