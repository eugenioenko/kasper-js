import { TemplateParser } from "./template-parser";
import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Transpiler } from "./transpiler";
import { DemoJson, DemoSource } from "./types/demo";
import { Viewer } from "./viewer";
import { Scanner } from "./scanner";

function execute(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  const result = JSON.stringify(nodes);
  return result;
}

function transpile(source: string, entries?: { [key: string]: any }): Node {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  const result = transpiler.transpile(nodes, entries);
  return result;
}

if (typeof window !== "undefined") {
  ((window as any) || {}).kasper = {
    demoJson: DemoJson,
    demoSourceCode: DemoSource,
    execute,
    transpile,
  };
} else if (typeof exports !== "undefined") {
  exports.kasper = {
    ExpressionParser,
    Interpreter,
    Scanner,
    TemplateParser,
    Transpiler,
    Viewer,
  };
}
