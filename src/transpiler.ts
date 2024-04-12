import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Scanner } from "./scanner";
import { Scope } from "./scope";
import * as KNode from "./types/nodes";

type IfElseNode = [KNode.Element, KNode.Attribute];

export class Transpiler implements KNode.KNodeVisitor<void> {
  private scanner = new Scanner();
  private parser = new ExpressionParser();
  private interpreter = new Interpreter();
  public errors: string[] = [];

  private evaluate(node: KNode.KNode, parent?: Node): void {
    node.accept(this, parent);
  }

  // evaluates expressions and returns the result of the first evaluation
  private execute(source: string, overrideScope?: Scope): any {
    const tokens = this.scanner.scan(source);
    const expressions = this.parser.parse(tokens);

    const restoreScope = this.interpreter.scope;
    if (overrideScope) {
      this.interpreter.scope = overrideScope;
    }
    const result = expressions.map((expression) =>
      this.interpreter.evaluate(expression)
    );
    this.interpreter.scope = restoreScope;
    return result && result.length ? result[0] : undefined;
  }

  public transpile(
    nodes: KNode.KNode[],
    entries?: object,
    container?: HTMLElement
  ): Node {
    container = container || document.createElement("kasper");
    container.innerHTML = "";
    this.interpreter.scope.init(entries);
    this.errors = [];
    try {
      this.createSiblings(nodes, container);
    } catch (e) {
      console.error(`${e}`);
    }
    return container;
  }

  public visitElementKNode(node: KNode.Element, parent?: Node): void {
    this.createElement(node, parent);
  }

  public visitTextKNode(node: KNode.Text, parent?: Node): void {
    const regex = /\{\{.+\}\}/ms;
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

  public visitAttributeKNode(node: KNode.Attribute, parent?: Node): void {
    const attr = document.createAttribute(node.name);
    if (node.value) {
      attr.value = node.value;
    }

    if (parent) {
      (parent as HTMLElement).setAttributeNode(attr);
    }
  }

  public visitCommentKNode(node: KNode.Comment, parent?: Node): void {
    const result = new Comment(node.value);
    if (parent) {
      parent.appendChild(result);
    }
  }

  private findAttr(
    node: KNode.Element,
    name: string[]
  ): KNode.Attribute | null {
    if (!node || !node.attributes || !node.attributes.length) {
      return null;
    }

    const attrib = node.attributes.find((attr) =>
      name.includes((attr as KNode.Attribute).name)
    );
    if (attrib) {
      return attrib as KNode.Attribute;
    }
    return null;
  }

  private doIf(expressions: IfElseNode[], parent: Node): void {
    const $if = this.execute((expressions[0][1] as KNode.Attribute).value);
    if ($if) {
      this.createElement(expressions[0][0], parent);
      return;
    }

    for (const expression of expressions.slice(1, expressions.length)) {
      if (this.findAttr(expression[0] as KNode.Element, ["@elseif"])) {
        const $elseif = this.execute((expression[1] as KNode.Attribute).value);
        if ($elseif) {
          this.createElement(expression[0], parent);
          return;
        } else {
          continue;
        }
      }
      if (this.findAttr(expression[0] as KNode.Element, ["@else"])) {
        this.createElement(expression[0], parent);
        return;
      }
    }
  }

  private doEach(each: KNode.Attribute, node: KNode.Element, parent: Node) {
    const tokens = this.scanner.scan((each as KNode.Attribute).value);
    const [name, key, iterable] = this.interpreter.evaluate(
      this.parser.foreach(tokens)
    );
    const originalScope = this.interpreter.scope;
    let index = 0;
    for (const item of iterable) {
      const scope: { [key: string]: any } = { [name]: item };
      if (key) {
        scope[key] = index;
      }
      this.interpreter.scope = new Scope(originalScope, scope);
      this.createElement(node, parent);
      index += 1;
    }
    this.interpreter.scope = originalScope;
  }

  private doWhile($while: KNode.Attribute, node: KNode.Element, parent: Node) {
    const originalScope = this.interpreter.scope;
    this.interpreter.scope = new Scope(originalScope);
    while (this.execute($while.value)) {
      this.createElement(node, parent);
    }
    this.interpreter.scope = originalScope;
  }

  private doInit(init: KNode.Attribute, node: KNode.Element, parent: Node) {
    const originalScope = this.interpreter.scope;
    this.interpreter.scope = new Scope(originalScope);
    this.execute(init.value);
    this.createElement(node, parent);
    this.interpreter.scope = originalScope;
  }

  private createSiblings(nodes: KNode.KNode[], parent?: Node): void {
    let current = 0;
    while (current < nodes.length) {
      const node = nodes[current++];
      if (node.type === "element") {
        const $each = this.findAttr(node as KNode.Element, ["@each"]);
        if ($each) {
          this.doEach($each, node as KNode.Element, parent);
          continue;
        }

        const $if = this.findAttr(node as KNode.Element, ["@if"]);
        if ($if) {
          const expressions: IfElseNode[] = [[node as KNode.Element, $if]];
          const tag = (node as KNode.Element).name;
          let found = true;

          while (found) {
            if (current >= nodes.length) {
              break;
            }
            const attr = this.findAttr(nodes[current] as KNode.Element, [
              "@else",
              "@elseif",
            ]);
            if ((nodes[current] as KNode.Element).name === tag && attr) {
              expressions.push([nodes[current] as KNode.Element, attr]);
              current += 1;
            } else {
              found = false;
            }
          }

          this.doIf(expressions, parent);
          continue;
        }

        const $while = this.findAttr(node as KNode.Element, ["@while"]);
        if ($while) {
          this.doWhile($while, node as KNode.Element, parent);
          continue;
        }

        const $init = this.findAttr(node as KNode.Element, ["@init"]);
        if ($init) {
          this.doInit($init, node as KNode.Element, parent);
          continue;
        }
      }
      this.evaluate(node, parent);
    }
  }

  private createElement(node: KNode.Element, parent?: Node): void {
    const isTemplate = node.name === "kvoid";
    const element = isTemplate ? parent : document.createElement(node.name);

    if (!isTemplate) {
      // event binding
      const events = node.attributes.filter((attr) =>
        (attr as KNode.Attribute).name.startsWith("@on:")
      );

      for (const event of events) {
        this.createEventListener(element, event as KNode.Attribute);
      }
      // attributes
      node.attributes
        .filter((attr) => !(attr as KNode.Attribute).name.startsWith("@"))
        .map((attr) => this.evaluate(attr, element));
    }

    if (node.self) {
      return;
    }

    this.createSiblings(node.children, element);

    if (!isTemplate && parent) {
      parent.appendChild(element);
    }
  }

  private createEventListener(element: Node, attr: KNode.Attribute): void {
    const type = attr.name.split(":")[1];
    const currentScope = this.interpreter.scope;
    element.addEventListener(type, () => {
      this.execute(attr.value, currentScope);
    });
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

  public visitDoctypeKNode(node: KNode.Doctype): void {
    return;
    // return document.implementation.createDocumentType("html", "", "");
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
