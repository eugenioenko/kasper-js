import { ExpressionParser } from "../src/expression-parser";
import { Interpreter } from "../src/interpreter";
import { Scanner } from "../src/scanner";
import { TemplateParser } from "../src/template-parser";
import { Viewer } from "../src/viewer";

export function parse(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  return JSON.stringify(nodes);
}

export function view(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const viewer = new Viewer();
  const result = viewer.transpile(nodes);
  return result.join("");
}

export function evaluate(source: string, scope?: Record<string, any>): unknown {
  const scanner = new Scanner();
  const tokens = scanner.scan(source);
  const parser = new ExpressionParser();
  const expressions = parser.parse(tokens);
  const interpreter = new Interpreter();
  interpreter.scope.init(scope);
  return interpreter.evaluate(expressions[0]);
}
