import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Scanner } from "./scanner";
import { Scope } from "./scope";
import * as KNode from "./types/nodes";

export class Transpiler implements KNode.KNodeVisitor<void> {
  private scanner = new Scanner();
  private parser = new ExpressionParser();
  private interpreter = new Interpreter();
  public errors: string[] = [];

  private evaluate(node: KNode.KNode, parent?: Node): void {
    node.accept(this, parent);
  }

  public transpile(
    nodes: KNode.KNode[],
    entries?: { [key: string]: any }
  ): Node {
    const container = document.createElement("kasper");
    this.interpreter.scope.init(entries);
    this.errors = [];
    for (const node of nodes) {
      try {
        this.evaluate(node, container);
      } catch (e) {
        console.error(`${e}`);
      }
    }
    return container;
  }

  public visitElementKNode(node: KNode.Element, parent?: Node): void {
    const each = node.attributes.find(
      (attr) => (attr as KNode.Attribute).name === "@each"
    );

    if (each) {
      const tokens = this.scanner.scan((each as KNode.Attribute).value);
      const [name, key, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );
      const currentScope = this.interpreter.scope;
      let index = 0;
      for (const item of iterable) {
        const scope: { [key: string]: any } = { [name]: item };
        if (key) {
          scope[key] = index;
        }
        this.interpreter.scope = new Scope(currentScope, scope);
        this.createElementKNode(node, parent);
        index += 1;
      }
      this.interpreter.scope = currentScope;
      return;
    }

    this.createElementKNode(node, parent);
  }

  private createElementKNode(node: KNode.Element, parent?: Node): void {
    const element = document.createElement(node.name);

    node.attributes
      .filter((attr) => !(attr as KNode.Attribute).name.startsWith("@"))
      .map((attr) => this.evaluate(attr, element));

    if (node.self) {
      return;
    }

    node.children.map((elm) => this.evaluate(elm, element));

    if (parent) {
      parent.appendChild(element);
    }
  }

  public visitAttributeKNode(node: KNode.Attribute, parent?: Node): void {
    const attr = document.createAttribute(node.name);
    if (node.value) {
      attr.value = node.value;
    }

    if (parent) {
      (parent as HTMLElement).setAttributeNode(attr);
    }
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

  public visitTextKNode(node: KNode.Text, parent?: Node): void {
    const regex = /\{\{.+\}\}/;
    let text: Text;
    if (regex.test(node.value)) {
      const result = node.value.replace(
        /\{\{([\s\S]+?)\}\}/g,
        (m, placeholder) => {
          return this.templateParse(placeholder);
        }
      );
      text = document.createTextNode(result);
    } else {
      text = document.createTextNode(node.value);
    }
    if (parent) {
      parent.appendChild(text);
    }
  }

  public visitCommentKNode(node: KNode.Comment, parent?: Node): void {
    const result = new Comment(node.value);
    if (parent) {
      parent.appendChild(result);
    }
  }

  public visitDoctypeKNode(node: KNode.Doctype): void {
    return;
    // return document.implementation.createDocumentType("html", "", "");
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
