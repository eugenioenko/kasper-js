import { ComponentClass, ComponentRegistry, setActiveComponent } from "./component";
import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Router, RouteConfig } from "./router";
import { Scanner } from "./scanner";
import { Scope } from "./scope";
import { effect } from "./signal";
import { Boundary } from "./boundary";
import { TemplateParser } from "./template-parser";
import * as KNode from "./types/nodes";

type IfElseNode = [KNode.Element, KNode.Attribute];

export class Transpiler implements KNode.KNodeVisitor<void> {
  private scanner = new Scanner();
  private parser = new ExpressionParser();
  private interpreter = new Interpreter();
  private registry: ComponentRegistry = {};

  constructor(options?: { registry: ComponentRegistry }) {
    this.registry["router"] = { component: Router, nodes: [] };
    if (!options) return;
    if (options.registry) {
      this.registry = { ...this.registry, ...options.registry };
    }
  }

  private evaluate(node: KNode.KNode, parent?: Node): void {
    node.accept(this, parent);
  }

  private bindMethods(entity: any): void {
    if (!entity || typeof entity !== "object") return;

    let proto = Object.getPrototypeOf(entity);
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (Object.getOwnPropertyDescriptor(proto, key)?.get) continue;
        if (
          typeof entity[key] === "function" &&
          key !== "constructor" &&
          !Object.prototype.hasOwnProperty.call(entity, key)
        ) {
          entity[key] = entity[key].bind(entity);
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
  }

  // Creates an effect that restores the current scope on every re-run,
  // so effects set up inside @each always evaluate in their item scope.
  private scopedEffect(fn: () => void): () => void {
    const scope = this.interpreter.scope;
    return effect(() => {
      const prev = this.interpreter.scope;
      this.interpreter.scope = scope;
      try {
        fn();
      } finally {
        this.interpreter.scope = prev;
      }
    });
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
    entity: any,
    container: Element
  ): Node {
    this.destroy(container);
    container.innerHTML = "";
    this.bindMethods(entity);
    this.interpreter.scope.init(entity);
    this.createSiblings(nodes, container);
    return container;
  }

  public visitElementKNode(node: KNode.Element, parent?: Node): void {
    this.createElement(node, parent);
  }

  public visitTextKNode(node: KNode.Text, parent?: Node): void {
    try {
      const text = document.createTextNode("");
      if (parent) {
        if ((parent as any).insert && typeof (parent as any).insert === "function") {
          (parent as any).insert(text);
        } else {
          parent.appendChild(text);
        }
      }

      const stop = this.scopedEffect(() => {
        text.textContent = this.evaluateTemplateString(node.value);
      });
      this.trackEffect(text, stop);
    } catch (e: any) {
      this.error(e.message || `${e}`, "text node");
    }
  }

  public visitAttributeKNode(node: KNode.Attribute, parent?: Node): void {
    const attr = document.createAttribute(node.name);

    const stop = this.scopedEffect(() => {
      attr.value = this.evaluateTemplateString(node.value);
    });
    this.trackEffect(attr, stop);

    if (parent) {
      (parent as HTMLElement).setAttributeNode(attr);
    }
  }

  public visitCommentKNode(node: KNode.Comment, parent?: Node): void {
    const result = new Comment(node.value);
    if (parent) {
      if ((parent as any).insert && typeof (parent as any).insert === "function") {
        (parent as any).insert(result);
      } else {
        parent.appendChild(result);
      }
    }
  }

  private trackEffect(target: any, stop: () => void) {
    if (!target.$kasperEffects) target.$kasperEffects = [];
    target.$kasperEffects.push(stop);
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
    const boundary = new Boundary(parent, "if");

    const stop = this.scopedEffect(() => {
      boundary.nodes().forEach((n) => this.destroyNode(n));
      boundary.clear();

      const $if = this.execute((expressions[0][1] as KNode.Attribute).value);
      if ($if) {
        this.createElement(expressions[0][0], boundary as any);
        return;
      }

      for (const expression of expressions.slice(1, expressions.length)) {
        if (this.findAttr(expression[0] as KNode.Element, ["@elseif"])) {
          const $elseif = this.execute((expression[1] as KNode.Attribute).value);
          if ($elseif) {
            this.createElement(expression[0], boundary as any);
            return;
          } else {
            continue;
          }
        }
        if (this.findAttr(expression[0] as KNode.Element, ["@else"])) {
          this.createElement(expression[0], boundary as any);
          return;
        }
      }
    });

    this.trackEffect(boundary, stop);
  }

  private doEach(each: KNode.Attribute, node: KNode.Element, parent: Node) {
    const keyAttr = this.findAttr(node, ["@key"]);
    if (keyAttr) {
      this.doEachKeyed(each, node, parent, keyAttr);
    } else {
      this.doEachUnkeyed(each, node, parent);
    }
  }

  private doEachUnkeyed(each: KNode.Attribute, node: KNode.Element, parent: Node) {
    const boundary = new Boundary(parent, "each");
    const originalScope = this.interpreter.scope;

    const stop = effect(() => {
      boundary.nodes().forEach((n) => this.destroyNode(n));
      boundary.clear();

      const tokens = this.scanner.scan(each.value);
      const [name, key, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );

      let index = 0;
      for (const item of iterable) {
        const scopeValues: any = { [name]: item };
        if (key) scopeValues[key] = index;

        this.interpreter.scope = new Scope(originalScope, scopeValues);
        this.createElement(node, boundary as any);
        index += 1;
      }
      this.interpreter.scope = originalScope;
    });

    this.trackEffect(boundary, stop);
  }

  private doEachKeyed(each: KNode.Attribute, node: KNode.Element, parent: Node, keyAttr: KNode.Attribute) {
    const boundary = new Boundary(parent, "each");
    const originalScope = this.interpreter.scope;
    const keyedNodes = new Map<any, Node>();

    const stop = effect(() => {
      const tokens = this.scanner.scan(each.value);
      const [name, indexKey, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );

      // Compute new items and their keys
      const newItems: Array<{ item: any; idx: number; key: any }> = [];
      let index = 0;
      for (const item of iterable) {
        const scopeValues: any = { [name]: item };
        if (indexKey) scopeValues[indexKey] = index;
        this.interpreter.scope = new Scope(originalScope, scopeValues);
        const key = this.execute(keyAttr.value);
        newItems.push({ item: item, idx: index, key: key });
        index++;
      }

      // Destroy nodes whose keys are no longer present
      const newKeySet = new Set(newItems.map((i) => i.key));
      for (const [key, domNode] of keyedNodes) {
        if (!newKeySet.has(key)) {
          this.destroyNode(domNode);
          domNode.parentNode?.removeChild(domNode);
          keyedNodes.delete(key);
        }
      }

      // Insert/reuse nodes in new order
      for (const { item, idx, key } of newItems) {
        const scopeValues: any = { [name]: item };
        if (indexKey) scopeValues[indexKey] = idx;
        this.interpreter.scope = new Scope(originalScope, scopeValues);

        if (keyedNodes.has(key)) {
          boundary.insert(keyedNodes.get(key)!);
        } else {
          const created = this.createElement(node, boundary as any);
          if (created) keyedNodes.set(key, created);
        }
      }

      this.interpreter.scope = originalScope;
    });

    this.trackEffect(boundary, stop);
  }

  private doWhile($while: KNode.Attribute, node: KNode.Element, parent: Node) {
    const boundary = new Boundary(parent, "while");
    const originalScope = this.interpreter.scope;

    const stop = this.scopedEffect(() => {
      boundary.nodes().forEach((n) => this.destroyNode(n));
      boundary.clear();

      this.interpreter.scope = new Scope(originalScope);
      while (this.execute($while.value)) {
        this.createElement(node, boundary as any);
      }
      this.interpreter.scope = originalScope;
    });

    this.trackEffect(boundary, stop);
  }

  // executes initialization in the current scope
  private doLet(init: KNode.Attribute, node: KNode.Element, parent: Node) {
    this.execute(init.value);
    const element = this.createElement(node, parent);
    this.interpreter.scope.set("$ref", element);
  }

  private createSiblings(nodes: KNode.KNode[], parent?: Node): void {
    let current = 0;
    while (current < nodes.length) {
      const node = nodes[current++];
      if (node.type === "element") {
        const $each = this.findAttr(node as KNode.Element, ["@each"]);
        if ($each) {
          this.doEach($each, node as KNode.Element, parent!);
          continue;
        }

        const $if = this.findAttr(node as KNode.Element, ["@if"]);
        if ($if) {
          const expressions: IfElseNode[] = [[node as KNode.Element, $if]];

          while (current < nodes.length) {
            const attr = this.findAttr(nodes[current] as KNode.Element, [
              "@else",
              "@elseif",
            ]);
            if (attr) {
              expressions.push([nodes[current] as KNode.Element, attr]);
              current += 1;
            } else {
              break;
            }
          }

          this.doIf(expressions, parent!);
          continue;
        }

        const $while = this.findAttr(node as KNode.Element, ["@while"]);
        if ($while) {
          this.doWhile($while, node as KNode.Element, parent!);
          continue;
        }

        const $let = this.findAttr(node as KNode.Element, ["@let"]);
        if ($let) {
          this.doLet($let, node as KNode.Element, parent!);
          continue;
        }
      }
      this.evaluate(node, parent);
    }
  }

  private createElement(node: KNode.Element, parent?: Node): Node | undefined {
    try {
      if (node.name === "slot") {
        const nameAttr = this.findAttr(node, ["@name"]);
        const name = nameAttr ? nameAttr.value : "default";
        const slots = this.interpreter.scope.get("$slots");
        if (slots && slots[name]) {
          this.createSiblings(slots[name], parent);
        }
        return undefined;
      }

      const isVoid = node.name === "void";
      const isComponent = !!this.registry[node.name];
      const element = isVoid ? parent : document.createElement(node.name);
      const restoreScope = this.interpreter.scope;

      if (element && element !== parent) {
        this.interpreter.scope.set("$ref", element);
      }

      if (isComponent) {
        // create a new instance of the component and set it as the current scope
        let component: any = {};
        const argsAttr = node.attributes.filter((attr) =>
          (attr as KNode.Attribute).name.startsWith("@:")
        );
        const args = this.createComponentArgs(argsAttr as KNode.Attribute[]);

        // Capture children for slots
        const slots: Record<string, KNode.KNode[]> = { default: [] };
        for (const child of node.children) {
          if (child.type === "element") {
            const slotAttr = this.findAttr(child as KNode.Element, ["@slot"]);
            if (slotAttr) {
              const name = slotAttr.value;
              if (!slots[name]) slots[name] = [];
              slots[name].push(child);
              continue;
            }
          }
          slots.default.push(child);
        }

        if (this.registry[node.name]?.component) {
          component = new this.registry[node.name].component({
            args: args,
            ref: element,
            transpiler: this,
          });

          this.bindMethods(component);
          (element as any).$kasperInstance = component;

          const componentNodes = this.registry[node.name].nodes!;
          component.$render = () => {
            this.destroy(element as HTMLElement);
            (element as HTMLElement).innerHTML = "";
            const scope = new Scope(restoreScope, component);
            scope.set("$instance", component);
            component.$slots = slots;
            const prevScope = this.interpreter.scope;
            this.interpreter.scope = scope;
            this.createSiblings(componentNodes, element);
            this.interpreter.scope = prevScope;
            if (typeof component.onRender === "function") component.onRender();
          };

          if (node.name === "router" && component instanceof Router) {
            const routeScope = new Scope(restoreScope, component);
            component.setRoutes(this.extractRoutes(node.children, undefined, routeScope));
          }

          if (typeof component.onMount === "function") {
            component.onMount();
          }
        }
        // Expose slots in component scope
        component.$slots = slots;

        this.interpreter.scope = new Scope(restoreScope, component);
        this.interpreter.scope.set("$instance", component);

        // create the children of the component
        this.createSiblings(this.registry[node.name].nodes!, element);

        if (component && typeof component.onRender === "function") {
          component.onRender();
        }

        this.interpreter.scope = restoreScope;
        if (parent) {
          if ((parent as any).insert && typeof (parent as any).insert === "function") {
            (parent as any).insert(element);
          } else {
            parent.appendChild(element);
          }
        }
        return element;
      }

      if (!isVoid) {
        // event binding
        const events = node.attributes.filter((attr) =>
          (attr as KNode.Attribute).name.startsWith("@on:")
        );

        for (const event of events) {
          this.createEventListener(element, event as KNode.Attribute);
        }

        // regular attributes (processed first)
        const attributes = node.attributes.filter(
          (attr) => !(attr as KNode.Attribute).name.startsWith("@")
        );

        for (const attr of attributes) {
          this.evaluate(attr, element);
        }

        // shorthand attributes (processed second, allows merging)
        const shorthandAttributes = node.attributes.filter((attr) => {
          const name = (attr as KNode.Attribute).name;
          return (
            name.startsWith("@") &&
            !["@if", "@elseif", "@else", "@each", "@while", "@let", "@key", "@ref"].includes(
              name
            ) &&
            !name.startsWith("@on:") &&
            !name.startsWith("@:")
          );
        });

        for (const attr of shorthandAttributes) {
          const realName = (attr as KNode.Attribute).name.slice(1);

          if (realName === "class") {
            let lastDynamicValue = "";
            const stop = this.scopedEffect(() => {
              const value = this.execute((attr as KNode.Attribute).value);
              const staticClass = (element as HTMLElement).getAttribute("class") || "";
              const currentClasses = staticClass.split(" ")
                .filter(c => c !== lastDynamicValue && c !== "")
                .join(" ");
              const newValue = currentClasses ? `${currentClasses} ${value}` : value;
              (element as HTMLElement).setAttribute("class", newValue);
              lastDynamicValue = value;
            });
            this.trackEffect(element, stop);
          } else {
            const stop = this.scopedEffect(() => {
              const value = this.execute((attr as KNode.Attribute).value);

              if (value === false || value === null || value === undefined) {
                if (realName !== "style") {
                  (element as HTMLElement).removeAttribute(realName);
                }
              } else {
                if (realName === "style") {
                  const existing = (element as HTMLElement).getAttribute("style");
                  const newValue = existing && !existing.includes(value)
                    ? `${existing.endsWith(";") ? existing : existing + ";"} ${value}`
                    : value;
                  (element as HTMLElement).setAttribute("style", newValue);
                } else {
                  (element as HTMLElement).setAttribute(realName, value);
                }
              }
            });
            this.trackEffect(element, stop);
          }
        }
      }

      if (parent && !isVoid) {
        if ((parent as any).insert && typeof (parent as any).insert === "function") {
          (parent as any).insert(element);
        } else {
          parent.appendChild(element);
        }
      }

      const refAttr = this.findAttr(node, ["@ref"]);
      if (refAttr && !isVoid) {
        const propName = refAttr.value.trim();
        const instance = this.interpreter.scope.get("$instance");
        if (instance) {
          instance[propName] = element;
        } else {
          this.interpreter.scope.set(propName, element);
        }
      }

      if (node.self) {
        return element;
      }

      this.createSiblings(node.children, element);
      this.interpreter.scope = restoreScope;

      return element;
    } catch (e: any) {
      this.error(e.message || `${e}`, node.name);
    }
  }

  private createComponentArgs(args: KNode.Attribute[]): Record<string, any> {
    if (!args.length) {
      return {};
    }
    const result: Record<string, any> = {};
    for (const arg of args) {
      const key = arg.name.split(":")[1];
      result[key] = this.execute(arg.value);
    }
    return result;
  }

  private createEventListener(element: Node, attr: KNode.Attribute): void {
    const [eventName, ...modifiers] = attr.name.split(":")[1].split(".");
    const listenerScope = new Scope(this.interpreter.scope);
    const instance = this.interpreter.scope.get("$instance");

    const options: any = {};
    if (instance && instance.$abortController) {
      options.signal = instance.$abortController.signal;
    }
    if (modifiers.includes("once"))    options.once    = true;
    if (modifiers.includes("passive")) options.passive = true;
    if (modifiers.includes("capture")) options.capture = true;

    element.addEventListener(eventName, (event) => {
      if (modifiers.includes("prevent")) event.preventDefault();
      if (modifiers.includes("stop"))    event.stopPropagation();
      listenerScope.set("$event", event);
      this.execute(attr.value, listenerScope);
    }, options);
  }

  private evaluateTemplateString(text: string): string {
    if (!text) {
      return text;
    }
    const regex = /\{\{.+\}\}/ms;
    if (regex.test(text)) {
      return text.replace(/\{\{([\s\S]+?)\}\}/g, (m, placeholder) => {
        return this.evaluateExpression(placeholder);
      });
    }
    return text;
  }

  private evaluateExpression(source: string): string {
    const tokens = this.scanner.scan(source);
    const expressions = this.parser.parse(tokens);

    let result = "";
    for (const expression of expressions) {
      result += `${this.interpreter.evaluate(expression)}`;
    }
    return result;
  }

  private destroyNode(node: any): void {
    // 1. Cleanup component instance
    if (node.$kasperInstance) {
      const instance = node.$kasperInstance;
      if (instance.onDestroy) {
        setActiveComponent(instance);
        instance.onDestroy();
        setActiveComponent(null);
      }
      if (instance.$abortController) instance.$abortController.abort();
    }

    // 2. Cleanup effects attached to the node
    if (node.$kasperEffects) {
      node.$kasperEffects.forEach((stop: () => void) => stop());
      node.$kasperEffects = [];
    }

    // 3. Cleanup effects on attributes
    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        if (attr.$kasperEffects) {
          attr.$kasperEffects.forEach((stop: () => void) => stop());
          attr.$kasperEffects = [];
        }
      }
    }

    // 4. Recurse
    node.childNodes?.forEach((child: any) => this.destroyNode(child));
  }

  public destroy(container: Element): void {
    container.childNodes.forEach((child) => this.destroyNode(child));
  }

  public mountComponent(ComponentClass: ComponentClass, container: HTMLElement, params: Record<string, string> = {}): void {
    this.destroy(container);
    container.innerHTML = "";

    const template = (ComponentClass as any).template;
    if (!template) return;

    const nodes = new TemplateParser().parse(template);
    const host = document.createElement("div");
    container.appendChild(host);

    const component = new ComponentClass({ args: { params: params }, ref: host, transpiler: this });
    this.bindMethods(component);
    (host as any).$kasperInstance = component;

    const componentNodes = nodes;
    component.$render = () => {
      this.destroy(host);
      host.innerHTML = "";
      const scope = new Scope(null, component);
      scope.set("$instance", component);
      const prev = this.interpreter.scope;
      this.interpreter.scope = scope;
      this.createSiblings(componentNodes, host);
      this.interpreter.scope = prev;
      setActiveComponent(component);
      if (typeof component.onRender === "function") component.onRender();
      setActiveComponent(null);
    };

    setActiveComponent(component);
    if (typeof component.onMount === "function") component.onMount();
    setActiveComponent(null);

    const scope = new Scope(null, component);
    scope.set("$instance", component);
    const prev = this.interpreter.scope;
    this.interpreter.scope = scope;
    this.createSiblings(nodes, host);
    this.interpreter.scope = prev;

    setActiveComponent(component);
    if (typeof component.onRender === "function") component.onRender();
    setActiveComponent(null);
  }

  public extractRoutes(children: KNode.KNode[], parentGuard?: () => Promise<boolean>, scope?: Scope): RouteConfig[] {
    const routes: RouteConfig[] = [];
    const prevScope = scope ? this.interpreter.scope : undefined;
    if (scope) this.interpreter.scope = scope;
    for (const child of children) {
      if (child.type !== "element") continue;
      const el = child as KNode.Element;
      if (el.name === "route") {
        const pathAttr = this.findAttr(el, ["@path"]);
        const componentAttr = this.findAttr(el, ["@component"]);
        const guardAttr = this.findAttr(el, ["@guard"]);
        if (!pathAttr || !componentAttr) continue;
        const path = pathAttr.value;
        const component = this.execute(componentAttr.value);
        const guard = guardAttr ? this.execute(guardAttr.value) : parentGuard;
        routes.push({ path: path, component: component, guard: guard });
      }
      if (el.name === "guard") {
        const checkAttr = this.findAttr(el, ["@check"]);
        if (!checkAttr) continue;
        const check = this.execute(checkAttr.value);
        routes.push(...this.extractRoutes(el.children, check));
      }
    }
    if (scope) this.interpreter.scope = prevScope;
    return routes;
  }

  public visitDoctypeKNode(_node: KNode.Doctype): void {
    return;
    // return document.implementation.createDocumentType("html", "", "");
  }

  public error(message: string, tagName?: string): void {
    const cleanMessage = message.startsWith("Runtime Error")
      ? message
      : `Runtime Error: ${message}`;

    if (tagName && !cleanMessage.includes(`at <${tagName}>`)) {
      throw new Error(`${cleanMessage}\n  at <${tagName}>`);
    }

    throw new Error(cleanMessage);
  }
}
