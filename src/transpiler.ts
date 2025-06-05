import { type ComponentRegistry } from "./component";
import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Scanner } from "./scanner";
import { Scope } from "./scope";
import * as KNode from "./types/nodes";

// Type alias for a tuple representing an if/else-if/else node and its attribute
// [ElementNode, AttributeNode]
type IfElseNode = [KNode.Element, KNode.Attribute];

// The Transpiler class is responsible for traversing the KNode AST and generating DOM nodes.
// It handles custom directives like @if, @each, @while, @let, and component instantiation.
export class Transpiler implements KNode.KNodeVisitor<void> {
  // Scanner for tokenizing expressions
  private scanner = new Scanner();
  // Parser for parsing expressions
  private parser = new ExpressionParser();
  // Interpreter for evaluating parsed expressions
  private interpreter = new Interpreter();
  // Stores runtime errors encountered during transpilation
  public errors: string[] = [];
  // Registry of custom components
  private registry: ComponentRegistry = {};

  constructor(options?: { registry: ComponentRegistry }) {
    if (!options) {
      return;
    }
    if (options.registry) {
      this.registry = options.registry;
    }
  }

  // Evaluates a KNode and appends the result to the parent node
  private evaluate(node: KNode.KNode, parent?: Node): void {
    node.accept(this, parent);
  }

  // Evaluates a string expression in the current or overridden scope
  // Returns the result of the first evaluation
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

  // Main entry point: transpiles a list of KNodes into DOM nodes inside the container
  public transpile(
    nodes: KNode.KNode[],
    entity: object,
    container: Element
  ): Node {
    container.innerHTML = "";
    this.interpreter.scope.init(entity);
    this.errors = [];
    try {
      this.createSiblings(nodes, container);
    } catch (e) {
      console.error(`${e}`);
    }
    return container;
  }

  // Visitor for element nodes
  public visitElementKNode(node: KNode.Element, parent?: Node): void {
    this.createElement(node, parent);
  }

  // Visitor for text nodes; evaluates template strings
  public visitTextKNode(node: KNode.Text, parent?: Node): void {
    const content = this.evaluateTemplateString(node.value);
    const text = document.createTextNode(content);
    if (parent) {
      parent.appendChild(text);
    }
  }

  // Visitor for attribute nodes; evaluates template strings in attribute values
  public visitAttributeKNode(node: KNode.Attribute, parent?: Node): void {
    const attr = document.createAttribute(node.name);
    if (node.value) {
      attr.value = this.evaluateTemplateString(node.value);
    }

    if (parent) {
      (parent as HTMLElement).setAttributeNode(attr);
    }
  }

  // Visitor for comment nodes
  public visitCommentKNode(node: KNode.Comment, parent?: Node): void {
    const result = new Comment(node.value);
    if (parent) {
      parent.appendChild(result);
    }
  }

  // Finds the first attribute in a node matching any of the provided names
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

  // Handles @if, @elseif, and @else logic for conditional rendering
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

  // Handles @each directive for iterating over collections
  private doEach(each: KNode.Attribute, node: KNode.Element, parent: Node) {
    const tokens = this.scanner.scan((each as KNode.Attribute).value);
    const [name, key, iterable] = this.interpreter.evaluate(
      this.parser.foreach(tokens)
    );
    const originalScope = this.interpreter.scope;
    let index = 0;
    for (const item of iterable) {
      // Create a new scope for each iteration
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

  // Handles @while directive for looping while a condition is true
  private doWhile($while: KNode.Attribute, node: KNode.Element, parent: Node) {
    const originalScope = this.interpreter.scope;
    this.interpreter.scope = new Scope(originalScope);
    while (this.execute($while.value)) {
      this.createElement(node, parent);
    }
    this.interpreter.scope = originalScope;
  }

  // Handles @let directive for variable initialization in the current scope
  private doLet(init: KNode.Attribute, node: KNode.Element, parent: Node) {
    this.execute(init.value);
    const element = this.createElement(node, parent);
    // Store a reference to the created element in the scope
    this.interpreter.scope.set("$ref", element);
  }

  // Recursively creates sibling nodes, handling control flow directives
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
          // Collects all related if/elseif/else nodes for the same tag
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

        const $let = this.findAttr(node as KNode.Element, ["@let"]);
        if ($let) {
          this.doLet($let, node as KNode.Element, parent);
          continue;
        }
      }
      this.evaluate(node, parent);
    }
  }

  // Creates a DOM element or component instance from a KNode.Element
  private createElement(node: KNode.Element, parent?: Node): Node | undefined {
    const isVoid = node.name === "void";
    const isComponent = !!this.registry[node.name];
    const element = isVoid ? parent : document.createElement(node.name);
    const restoreScope = this.interpreter.scope;

    if (isComponent) {
      // Instantiate the component and set up its scope
      let component: any = {};
      const argsAttr = node.attributes.filter((attr) =>
        (attr as KNode.Attribute).name.startsWith("@:")
      );
      const args = this.createComponentArgs(argsAttr as KNode.Attribute[]);
      if (this.registry[node.name]?.component) {
        const ref = element;
        const transpiler = this;
        component = new this.registry[node.name].component({
          args,
          ref,
          transpiler,
        });
      }
      this.interpreter.scope = new Scope(restoreScope, component);
      // Render the component's children
      this.createSiblings(this.registry[node.name].nodes, element);
    }

    if (!isVoid) {
      // Bind event listeners for @on: directives
      const events = node.attributes.filter((attr) =>
        (attr as KNode.Attribute).name.startsWith("@on:")
      );

      for (const event of events) {
        this.createEventListener(element, event as KNode.Attribute);
      }

      // Set regular attributes (not directives)
      const attributes = node.attributes.filter(
        (attr) => !(attr as KNode.Attribute).name.startsWith("@")
      );

      for (const attr of attributes) {
        this.evaluate(attr, element);
      }
    }

    if (node.self) {
      return element;
    }

    // Recursively create child nodes
    this.createSiblings(node.children, element);
    this.interpreter.scope = restoreScope;

    if (!isVoid && parent) {
      parent.appendChild(element);
    }
    return element;
  }

  // Extracts component arguments from @: attributes
  private createComponentArgs(args: KNode.Attribute[]): Record<string, any> {
    if (!args.length) {
      return {};
    }
    const result: Record<string, any> = {};
    for (const arg of args) {
      const key = arg.name.split(":")[1];
      result[key] = this.evaluateTemplateString(arg.value);
    }
    return result;
  }

  // Binds an event listener to a DOM element for @on: directives
  private createEventListener(element: Node, attr: KNode.Attribute): void {
    const type = attr.name.split(":")[1];
    const listenerScope = new Scope(this.interpreter.scope);
    element.addEventListener(type, (event) => {
      listenerScope.set("$event", event);
      this.execute(attr.value, listenerScope);
    });
  }

  // Evaluates template strings like 'Hello {{name}}!'
  private evaluateTemplateString(text: string): string {
    if (!text) {
      return text;
    }
    const regex = /\{\{.+\}\}/ms;
    if (regex.test(text)) {
      return text.replace(/\{\{([\s\S]+?)\}\}/g, (_, placeholder) => {
        return this.evaluateExpression(placeholder);
      });
    }
    return text;
  }

  // Evaluates a single expression and returns its string representation
  private evaluateExpression(source: string): string {
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

  // Throws for unsupported doctype nodes
  public visitDoctypeKNode(_: KNode.Doctype): void {
    throw "Doctype nodes are not supported in the transpiler.";
    // return document.implementation.createDocumentType("html", "", "");
  }

  // Throws a runtime error and halts transpilation
  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
