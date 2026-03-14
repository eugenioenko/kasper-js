import { ExpressionParser } from "../src/expression-parser";
import { Interpreter } from "../src/interpreter";
import { Scanner } from "../src/scanner";
import { TemplateParser } from "../src/template-parser";

export function parse(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  return JSON.stringify(nodes);
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
