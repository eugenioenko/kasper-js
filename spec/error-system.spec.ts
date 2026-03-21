import { describe, it, expect } from "vitest";
import { App, Component } from "../src/index";
import { Scanner } from "../src/scanner";
import { ExpressionParser } from "../src/expression-parser";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";

describe("Error message format", () => {
  function catchError(fn: () => void): Error {
    try { fn(); } catch (e: any) { return e; }
    throw new Error("expected an error to be thrown");
  }

  it("scanner: error message contains the source line in the snippet", () => {
    const err = catchError(() => new Scanner().scan("let x = @;"));
    expect(err.message).toMatchInlineSnapshot(`
      "[K002-3] Unexpected character '@'
        > | let x = @;
                     ^

      See: https://kasperjs.top/reference/errors#k002-3
      "
    `);
  });

  it("expression parser: error message contains the source expression in the snippet", () => {
    const source = "foo.bar(";
    const err = catchError(() =>
      new ExpressionParser().parse(new Scanner().scan(source), source)
    );
    expect(err.message).toMatchInlineSnapshot(`
      "[K004-3] Expected expression, unexpected token ""
        > | foo.bar(

      See: https://kasperjs.top/reference/errors#k004-3
      "
    `);
  });

  it("template parser: error message contains the source markup in the snippet", () => {
    const err = catchError(() => new TemplateParser().parse("<div>\n  </wrong>\n</div>"));
    expect(err.message).toMatchInlineSnapshot(`
      "[K003-5] Expected </div>
          | <div>
        > |   </wrong>
          | </div>

      See: https://kasperjs.top/reference/errors#k003-5
      "
    `);
  });

  it("transpiler: error message contains the error code and message, no snippet", () => {
    const nodes = new TemplateParser().parse('<div @else></div>');
    const err = catchError(() => new Transpiler().transpile(nodes, {}, document.createElement("div")));
    expect(err.message).toMatchInlineSnapshot(`
      "[K003-7] @else must be preceded by an @if or @elseif block.
        at <div>

      See: https://kasperjs.top/reference/errors#k003-7
      "
    `);
  });
});

describe("Error System (New Checks)", () => {
  it("K001-2: throws if entry component is missing from registry", () => {
    const root = document.createElement("div");
    expect(() => {
      App({
        root,
        entry: "non-existent",
        registry: {}
      });
    }).toThrow(/\[K001-2\] Entry component <non-existent> not found in registry/);
  });

  it("K007-2: throws if <route> is missing @path", () => {
    const parser = new TemplateParser();
    const transpiler = new Transpiler();
    const container = document.createElement("div");

    const nodes = parser.parse('<router><route @component="Home" /></router>');
    expect(() => {
      transpiler.transpile(nodes, {}, container);
    }).toThrow(/\[K007-2\] <route> requires @path and @component attributes/);
  });

  it("K007-2: throws if <guard> is missing @check", () => {
    const parser = new TemplateParser();
    const transpiler = new Transpiler();
    const container = document.createElement("div");

    const nodes = parser.parse('<router><guard><route @path="/" @component="Home" /></guard></router>');
    expect(() => {
      transpiler.transpile(nodes, {}, container);
    }).toThrow(/\[K007-2\] <guard> requires @check attribute/);
  });

  describe("Edge Case Validations", () => {
    it("K003-7: throws if @else is misplaced", () => {
      const parser = new TemplateParser();
      const transpiler = new Transpiler();
      const container = document.createElement("div");

      const nodes = parser.parse('<div @else></div>');
      expect(() => {
        transpiler.transpile(nodes, {}, container);
      }).toThrow(/\[K003-7\] @else must be preceded by an @if or @elseif block/);
    });

    it("comment node between @if and @elseif is skipped (chain is preserved)", () => {
      // Fix: createSiblings now skips comment nodes and whitespace-only text nodes
      // when scanning for @elseif/@else, so HTML comments no longer break the chain.
      const parser = new TemplateParser();
      const transpiler = new Transpiler();
      const container = document.createElement("div");

      const nodes = parser.parse('<div @if="false">A</div><!-- comment --><div @elseif="true">B</div>');
      expect(() => {
        transpiler.transpile(nodes, {}, container);
      }).not.toThrow();
      // The @elseif branch renders since @if is false
      expect(container.textContent).toBe("B");
    });

    it("K003-7 error nested inside a parent element is not wrapped in K007-1", () => {
      // Bug: when @elseif is inside a parent element, K003-7 is thrown inside
      // createElement's try/catch which re-wraps it as K007-1. The developer
      // sees "[K007-1] [K003-7]..." instead of just "[K003-7]...".
      // Structural directive errors should bubble through createElement unwrapped.
      const parser = new TemplateParser();
      const transpiler = new Transpiler();
      const container = document.createElement("div");

      // @elseif nested inside a <div> — triggers createElement's try/catch
      const nodes = parser.parse('<div><div @elseif="true">orphan</div></div>');
      let thrown: Error | null = null;
      try { transpiler.transpile(nodes, {}, container); } catch (e: any) { thrown = e; }

      expect(thrown).not.toBeNull();
      expect(thrown!.message).toMatch(/\[K003-7\]/);
      // Should NOT be double-wrapped: K007-1 should not appear
      expect(thrown!.message).not.toMatch(/\[K007-1\]/);
    });

    it("K003-9: throws if multiple structural directives on same element", () => {
      const parser = new TemplateParser();
      const transpiler = new Transpiler();
      const container = document.createElement("div");

      const nodes = parser.parse('<div @if="true" @else></div>');
      expect(() => {
        transpiler.transpile(nodes, {}, container);
      }).toThrow(/\[K003-9\] Multiple structural directives/);
    });
  });
});
