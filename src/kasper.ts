import { DemoSource } from "./demo";
import { Parser } from "./parser";
import { Viewer } from "./viewer";

export function execute(source: string): string {
  const parser = new Parser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }

  const result = JSON.stringify(nodes);
  console.log(result);
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
  };
}
if (typeof exports !== "undefined") {
  exports.kasper = {
    Parser,
    Viewer,
    execute,
    parse,
  };
}
