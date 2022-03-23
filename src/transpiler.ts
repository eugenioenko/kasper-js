import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Scanner } from "./scanner";
import { Scope } from "./scope";
import * as KNode from "./types/nodes";

export class Transpiler implements KNode.NodeVisitor<Node> {
  private scanner = new Scanner();
  private parser = new ExpressionParser();
  private interpreter = new Interpreter();
  public errors: string[] = [];

  private evaluate(node: KNode.Node): Node {
    return node.accept(this);
  }

  public transpile(
    nodes: KNode.Node[],
    entries?: { [key: string]: any }
  ): Node[] {
    this.interpreter.scope.init(entries);
    this.errors = [];
    const result = [];
    for (const node of nodes) {
      try {
        result.push(this.evaluate(node));
      } catch (e) {
        console.error(`${e}`);
        this.errors.push(`${e}`);
        if (this.errors.length > 100) {
          this.errors.push("Error limit exceeded");
          return result;
        }
      }
    }
    return result;
  }

  public visitElementNode(node: KNode.Element): Node {
    const element = document.createElement(node.name);

    const attrs = node.attributes.map((attr) => this.evaluate(attr));
    for (const attr of attrs) {
      element.setAttributeNode(attr as Attr);
    }

    if (node.self) {
      return element;
    }

    const children = node.children.map((elm) => this.evaluate(elm));
    for (const child of children) {
      element.append(child);
    }

    return element;
  }

  public visitAttributeNode(node: KNode.Attribute): Node {
    const attr = document.createAttribute(node.name);
    if (node.value) {
      attr.value = node.value;
    }
    return attr;
  }

  private templateParse(source: string): string {
    const tokens = this.scanner.scan(source);
    const expressions = this.parser.parse(tokens);
    if (this.parser.errors.length) {
      this.error(`Template string  error: ${this.parser.errors[0]}`);
    }
    let result = "";
    for (const expression of expressions) {
      result += `${this.interpreter.evaluate(expression)}`;
    }
    return result;
  }

  public visitTextNode(node: KNode.Text): Node {
    const regex = /\{\{.+\}\}/;
    if (regex.test(node.value)) {
      const result = node.value.replace(
        /\{\{([\s\S]+?)\}\}/g,
        (m, placeholder) => {
          return this.templateParse(placeholder);
        }
      );

      return document.createTextNode(result);
    } else {
      return document.createTextNode(node.value);
    }
  }

  public visitCommentNode(node: KNode.Comment): Node {
    return new Comment(node.value);
  }

  public visitDoctypeNode(node: KNode.Doctype): Node {
    return document.implementation.createDocumentType("html", "", "");
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
