import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";
import { DemoSource } from "./types/demo";
import { Viewer } from "./viewer";

export function execute(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  const result = JSON.stringify(nodes);
  return result;
}

export function transpile(source: string): Node[] {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  const result = transpiler.transpile(nodes);
  return result;
}

export function parse(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  return JSON.stringify(nodes);
}

if (typeof window !== "undefined") {
  ((window as any) || {}).kasper = {
    demoSourceCode: DemoSource,
    execute,
    parse,
    transpile,
  };
}

if (typeof exports !== "undefined") {
  exports.kasper = {
    TemplateParser,
    Transpiler,
    Viewer,
    execute,
    parse,
    transpile,
  };
}
