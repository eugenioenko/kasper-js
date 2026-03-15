import { describe, it, expect } from "vitest";
import { App, Component } from "../src/index";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";

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
