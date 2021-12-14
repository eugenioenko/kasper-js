import { DemoSource } from "./demo";
import { Parser } from "./parser";

export function execute(source: string): string {
  const parser = new Parser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  const result = JSON.stringify(nodes);
  return result;
}

export function parse(source: string): string {
  const parser = new Parser();
  const nodes = parser.parse(source);
  return JSON.stringify(nodes);
}

if (typeof window !== "undefined") {
  (window as any).demoSourceCode = DemoSource;
  (window as any).kasper = {
    execute,
    parse,
  };
} else {
  exports.kasper = {
    execute,
    parse,
  };
}
