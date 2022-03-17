import { DemoSource } from "./demo";
import { Parser } from "./parser";
import { Viewer } from "./viewer";
import { Transpiler } from "./transpiler";

export function execute(source: string): string {
  const parser = new Parser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  const result = JSON.stringify(nodes);
  return result;
}

export function transpile(source: string): Node[] {
  const parser = new Parser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  const result = transpiler.transpile(nodes);
  return result;
}

export function parse(source: string): string {
  const parser = new Parser();
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
    Parser,
    Viewer,
    Transpiler,
    execute,
    parse,
    transpile,
  };
}
