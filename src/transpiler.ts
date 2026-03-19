import { ComponentClass, ComponentRegistry } from "./component";
import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Router, RouteConfig } from "./router";
import { Scanner } from "./scanner";
import { Scope } from "./scope";
import { effect } from "./signal";
import { Boundary } from "./boundary";
import { TemplateParser } from "./template-parser";
import { queueUpdate, flushSync } from "./scheduler";
import { KasperError, KErrorCode, KErrorCodeType } from "./types/error";
import * as KNode from "./types/nodes";

const KEY_MAP: Record<string, string[]> = {
  esc: ["Escape", "Esc"],
  escape: ["Escape", "Esc"],
  space: [" ", "Spacebar"],
  up: ["ArrowUp", "Up"],
  down: ["ArrowDown", "Down"],
  left: ["ArrowLeft", "Left"],
  right: ["ArrowRight", "Right"],
  del: ["Delete", "Del"],
  delete: ["Delete", "Del"],
  ins: ["Insert"],
  dot: ["."],
  comma: [","],
  slash: ["/"],
  backslash: ["\\"],
  plus: ["+"],
  minus: ["-"],
  equal: ["="],
};

type IfElseNode = [KNode.Element, KNode.Attribute];

export class Transpiler implements KNode.KNodeVisitor<void> {
  private scanner = new Scanner();
  private parser = new ExpressionParser();
  private templateParser = new TemplateParser();
  private interpreter = new Interpreter();
  public registry: ComponentRegistry = {};
  public mode: "development" | "production" = "development";
  private isRendering = false;

  constructor(options?: { registry: ComponentRegistry }) {
    this.registry["router"] = { component: Router };
    if (!options) return;
    if (options.registry) {
      this.registry = { ...this.registry, ...options.registry };
    }
  }

  private renderComponentInstance(
    instance: any,
    nodes: KNode.KNode[],
    element: HTMLElement,
    restoreScope: Scope,
    slots?: Record<string, any>
  ): void {
    if (slots) instance.$slots = slots;

    instance.$render = () => {
      this.isRendering = true;
      try {
        this.destroy(element);
        element.innerHTML = "";
        const scope = new Scope(restoreScope, instance);
        scope.set("$instance", instance);
        if (slots) instance.$slots = slots;
        const prevScope = this.interpreter.scope;
        this.interpreter.scope = scope;
        flushSync(() => {
          this.createSiblings(nodes, element);
          if (typeof instance.onRender === "function") instance.onRender();
        });
        this.interpreter.scope = prevScope;
      } finally {
        this.isRendering = false;
      }
    };

    if (typeof instance.onMount === "function") instance.onMount();

    const scope = new Scope(restoreScope, instance);
    scope.set("$instance", instance);
    this.interpreter.scope = scope;
    flushSync(() => {
      this.createSiblings(nodes, element);
      if (typeof instance.onRender === "function") instance.onRender();
    });
    this.interpreter.scope = restoreScope;
  }

  public resolveNodes(tag: string): KNode.KNode[] {
    const entry = this.registry[tag];
    if (entry.nodes !== undefined) return entry.nodes;
    const source = (entry.component as any).template;
    if (!source) {
      entry.nodes = [];
      return entry.nodes;
    }
    entry.nodes = this.templateParser.parse(source);
    return entry.nodes;
  }

  private evaluate(node: KNode.KNode, parent?: Node): void {
    if (node.type === "element") {
      const el = node as KNode.Element;
      const misplaced = this.findAttr(el, ["@elseif", "@else"]);
      if (misplaced) {
        // These are handled by doIf, if we reach them here it's an error
        const name = misplaced.name.startsWith("@") ? misplaced.name.slice(1) : misplaced.name;
        this.error(KErrorCode.MISPLACED_CONDITIONAL, { name: name }, el.name);
      }
    }
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
    return result && result.length ? result[result.length - 1] : undefined;
  }

  public transpile(
    nodes: KNode.KNode[],
    entity: any,
    container: Element
  ): Node {
    this.isRendering = true;
    try {
      this.destroy(container);
      container.innerHTML = "";
      this.bindMethods(entity);
      this.interpreter.scope.init(entity);
      this.interpreter.scope.set("$instance", entity);

      flushSync(() => {
        this.createSiblings(nodes, container);
        this.triggerRender();
      });

      return container;
    } finally {
      this.isRendering = false;
    }
  }

  public visitElementKNode(node: KNode.Element, parent?: Node): void {
    this.createElement(node, parent);
  }

  public visitTextKNode(node: KNode.Text, parent?: Node): void {
    const text = document.createTextNode("");
    if (parent) {
      if ((parent as any).insert && typeof (parent as any).insert === "function") {
        (parent as any).insert(text);
      } else {
        parent.appendChild(text);
      }
    }

    const stop = this.scopedEffect(() => {
      const newValue = this.evaluateTemplateString(node.value);
      const instance = this.interpreter.scope.get("$instance");
      if (instance) {
        queueUpdate(instance, () => {
          text.textContent = newValue;
        });
      } else {
        text.textContent = newValue;
      }
    });
    this.trackEffect(text, stop);
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

  public visitCommentKNode(_node: KNode.Comment, _parent?: Node): void {
    // template comments are stripped from DOM output
  }

  private trackEffect(target: any, stop: any) {
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

    const run = () => {
      const instance = this.interpreter.scope.get("$instance");

      const trackingScope = instance ? new Scope(this.interpreter.scope) : this.interpreter.scope;
      const prevScope = this.interpreter.scope;
      this.interpreter.scope = trackingScope;

      // Evaluate conditions synchronously to ensure signal tracking
      const results: boolean[] = [];
      results.push(!!this.execute((expressions[0][1] as KNode.Attribute).value));

      if (!results[0]) {
        for (const expression of expressions.slice(1)) {
          if (this.findAttr(expression[0] as KNode.Element, ["@elseif"])) {
            const val = !!this.execute((expression[1] as KNode.Attribute).value);
            results.push(val);
            if (val) break;
          } else if (this.findAttr(expression[0] as KNode.Element, ["@else"])) {
            results.push(true);
            break;
          }
        }
      }
      this.interpreter.scope = prevScope;

      const task = () => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();

        const restoreScope = this.interpreter.scope;
        this.interpreter.scope = trackingScope;
        try {
          if (results[0]) {
            expressions[0][0].accept(this, boundary as any);
            return;
          }

          for (let i = 1; i < results.length; i++) {
            if (results[i]) {
              expressions[i][0].accept(this, boundary as any);
              return;
            }
          }
        } finally {
          this.interpreter.scope = restoreScope;
        }
      };

      if (instance) {
        queueUpdate(instance, task);
      } else {
        task();
      }
    };

    (boundary as any).start.$kasperRefresh = run;

    const stop = this.scopedEffect(run);
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

    const run = () => {
      const tokens = this.scanner.scan(each.value);
      const [name, key, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );
      const instance = this.interpreter.scope.get("$instance");

      const task = () => {
        boundary.nodes().forEach((n) => this.destroyNode(n));
        boundary.clear();

        let index = 0;
        for (const item of iterable) {
          const scopeValues: any = { [name]: item };
          if (key) scopeValues[key] = index;

          this.interpreter.scope = new Scope(originalScope, scopeValues);
          this.createElement(node, boundary as any);
          index += 1;
        }
        this.interpreter.scope = originalScope;
      };

      if (instance) {
        queueUpdate(instance, task);
      } else {
        task();
      }
    };

    (boundary as any).start.$kasperRefresh = run;

    const stop = this.scopedEffect(run);
    this.trackEffect(boundary, stop);
  }

  private triggerRefresh(node: Node): void {
    // 1. Re-run structural logic (if/each/while)
    if ((node as any).$kasperRefresh) {
      (node as any).$kasperRefresh();
    }

    // 2. Re-run all surgical effects (text interpolation, attributes, etc.)
    if ((node as any).$kasperEffects) {
      (node as any).$kasperEffects.forEach((stop: any) => {
        if (typeof stop.run === "function") {
          stop.run();
        }
      });
    }

    // 3. Recurse
    node.childNodes?.forEach((child) => this.triggerRefresh(child));
  }

  private doEachKeyed(each: KNode.Attribute, node: KNode.Element, parent: Node, keyAttr: KNode.Attribute) {
    const boundary = new Boundary(parent, "each");
    const originalScope = this.interpreter.scope;
    const keyedNodes = new Map<any, Node>();

    const run = () => {
      const tokens = this.scanner.scan(each.value);
      const [name, indexKey, iterable] = this.interpreter.evaluate(
        this.parser.foreach(tokens)
      );
      const instance = this.interpreter.scope.get("$instance");

      // Compute new items and their keys immediately
      const newItems: Array<{ item: any; idx: number; key: any }> = [];
      const seenKeys = new Set();
      let index = 0;
      for (const item of iterable) {
        const scopeValues: any = { [name]: item };
        if (indexKey) scopeValues[indexKey] = index;
        this.interpreter.scope = new Scope(originalScope, scopeValues);
        const key = this.execute(keyAttr.value);

        if (this.mode === "development" && seenKeys.has(key)) {
          console.warn(`[Kasper] Duplicate key detected in @each: "${key}". Keys must be unique to ensure correct reconciliation.`);
        }
        seenKeys.add(key);

        newItems.push({ item: item, idx: index, key: key });
        index++;
      }

      const task = () => {
        // Destroy nodes whose keys are no longer present
        const newKeySet = new Set(newItems.map((i) => i.key));
        for (const [key, domNode] of keyedNodes) {
          if (!newKeySet.has(key)) {
            this.destroyNode(domNode);
            domNode.parentNode?.removeChild(domNode);
            keyedNodes.delete(key);
          }
        }

        // Insert/reuse nodes in new order using a cursor to avoid unnecessary moves
        const parent = (boundary as any).end.parentNode as Node;
        let lastInserted: Node = (boundary as any).start;

        for (const { item, idx, key } of newItems) {
          const scopeValues: any = { [name]: item };
          if (indexKey) scopeValues[indexKey] = idx;
          this.interpreter.scope = new Scope(originalScope, scopeValues);

          if (keyedNodes.has(key)) {
            const domNode = keyedNodes.get(key)!;

            // Only move the node if it's not already in the correct position
            if (lastInserted.nextSibling !== domNode) {
              parent.insertBefore(domNode, lastInserted.nextSibling);
            }
            lastInserted = domNode;

            // Update scope and trigger re-render of nested structural directives
            const nodeScope = (domNode as any).$kasperScope;
            if (nodeScope) {
              nodeScope.set(name, item);
              if (indexKey) nodeScope.set(indexKey, idx);

              // If it has its own render logic (nested each/if), trigger it recursively
              this.triggerRefresh(domNode);
            }
          } else {
            const created = this.createElement(node, boundary as any);
            if (created) {
              // createElement inserts before end; move to correct position if needed
              if (lastInserted.nextSibling !== created) {
                parent.insertBefore(created, lastInserted.nextSibling);
              }
              lastInserted = created;
              keyedNodes.set(key, created);
              // Store the scope on the DOM node so we can update it later
              (created as any).$kasperScope = this.interpreter.scope;
            }
          }
        }
        this.interpreter.scope = originalScope;
      };

      if (instance) {
        queueUpdate(instance, task);
      } else {
        task();
      }
    };

    (boundary as any).start.$kasperRefresh = run;

    const stop = this.scopedEffect(run);
    this.trackEffect(boundary, stop);
  }


  private createSiblings(nodes: KNode.KNode[], parent?: Node): void {
    let current = 0;
    const initialScope = this.interpreter.scope;
    let groupScope: Scope | null = null;

    while (current < nodes.length) {
      const node = nodes[current++];
      if (node.type === "element") {
        const el = node as KNode.Element;

        // 1. Process @let (leaks to siblings and available to other directives on this node)
        const $let = this.findAttr(el, ["@let"]);
        if ($let) {
          if (!groupScope) {
            groupScope = new Scope(initialScope);
            this.interpreter.scope = groupScope;
          }
          this.execute($let.value);
        }

        // 2. Validation: Structural directives are mutually exclusive
        const ifAttr = this.findAttr(el, ["@if"]);
        const elseifAttr = this.findAttr(el, ["@elseif"]);
        const elseAttr = this.findAttr(el, ["@else"]);
        const $each = this.findAttr(el, ["@each"]);

        if (this.mode === "development") {
          const structuralCount = [ifAttr, elseifAttr, elseAttr, $each].filter(a => a).length;
          if (structuralCount > 1) {
            this.error(KErrorCode.MULTIPLE_STRUCTURAL_DIRECTIVES, {}, el.name);
          }
        }

        // 3. Process structural directives (one will match and continue)
        if ($each) {
          this.doEach($each, el, parent!);
          continue;
        }

        if (ifAttr) {
          const expressions: IfElseNode[] = [[el, ifAttr]];

          while (current < nodes.length) {
            const next = nodes[current];
            if (next.type !== "element") break;
            const attr = this.findAttr(next as KNode.Element, [
              "@else",
              "@elseif",
            ]);
            if (attr) {
              expressions.push([next as KNode.Element, attr]);
              current += 1;
            } else {
              break;
            }
          }

          this.doIf(expressions, parent!);
          continue;
        }
      }

      this.evaluate(node, parent);
    }

    this.interpreter.scope = initialScope;
  }

  private createElement(node: KNode.Element, parent?: Node): Node | undefined {
    try {
      if (node.name === "slot") {
        const nameAttr = this.findAttr(node, ["@name"]);
        const name = nameAttr ? nameAttr.value : "default";
        const slots = this.interpreter.scope.get("$slots");
        if (slots && slots[name]) {
          const prev = this.interpreter.scope;
          // Restore the scope where the slot content was defined (Lexical Scoping).
          // We store the scope reference directly on the Array instance to avoid changing signatures.
          if (slots[name].scope) this.interpreter.scope = slots[name].scope;
          this.createSiblings(slots[name], parent);
          this.interpreter.scope = prev;
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

        // Capture children for slots. 
        // We use a plain object keyed by slot name. Each value is an Array of KNodes.
        // To support lexical scoping, we attach the current scope to the Array instance.
        const slots: Record<string, any> = { default: [] };
        slots.default.scope = this.interpreter.scope;
        for (const child of node.children) {
          if (child.type === "element") {
            const slotAttr = this.findAttr(child as KNode.Element, ["@slot"]);
            if (slotAttr) {
              const name = slotAttr.value;
              if (!slots[name]) {
                slots[name] = [];
                slots[name].scope = this.interpreter.scope;
              }
              slots[name].push(child);
              continue;
            }
          }
          slots.default.push(child);
        }

        if (this.registry[node.name]?.lazy) {
          const entry = this.registry[node.name];

          if (entry.fallback) {
            const fallbackNodes = this.templateParser.parse((entry.fallback as any).template ?? "");
            const fallbackInstance: any = new entry.fallback({ args: {}, ref: element, transpiler: this });
            this.bindMethods(fallbackInstance);
            (element as any).$kasperInstance = fallbackInstance;
            this.renderComponentInstance(fallbackInstance, fallbackNodes, element as HTMLElement, restoreScope);
          }

          if (!(entry as any)._promise) {
            (entry as any)._promise = (entry.component as () => Promise<ComponentClass>)().then((cls) => {
              entry.nodes = this.templateParser.parse((cls as any).template ?? "");
              entry.component = cls;
              delete entry.lazy;
              delete (entry as any)._promise;
            });
          }

          (entry as any)._promise.then(() => {
            this.destroy(element as HTMLElement);
            (element as HTMLElement).innerHTML = "";
            const cls = entry.component as ComponentClass;
            const instance: any = new cls({ args: args, ref: element, transpiler: this });
            this.bindMethods(instance);
            (element as any).$kasperInstance = instance;
            this.renderComponentInstance(instance, entry.nodes!, element as HTMLElement, restoreScope, slots);
          });

          if (parent) {
            if ((parent as any).insert && typeof (parent as any).insert === "function") {
              (parent as any).insert(element);
            } else {
              parent.appendChild(element);
            }
          }
          return element;
        }

        if (this.registry[node.name]?.component) {
          component = new (this.registry[node.name].component as ComponentClass)({
            args: args,
            ref: element,
            transpiler: this,
          });

          this.bindMethods(component);
          (element as any).$kasperInstance = component;

          if (node.name === "router" && component instanceof Router) {
            const routeScope = new Scope(restoreScope, component);
            component.setRoutes(this.extractRoutes(node.children, undefined, routeScope));
          }

          this.renderComponentInstance(component, this.resolveNodes(node.name), element as HTMLElement, restoreScope, slots);
        }
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
            !["@if", "@elseif", "@else", "@each", "@let", "@key", "@ref"].includes(
              name
            ) &&
            !name.startsWith("@on:") &&
            !name.startsWith("@:")
          );
        });

        for (const attr of shorthandAttributes) {
          const realName = (attr as KNode.Attribute).name.slice(1);

          if (realName === "class") {
            const stop = this.scopedEffect(() => {
              const value = this.execute((attr as KNode.Attribute).value);
              const instance = this.interpreter.scope.get("$instance");
              const task = () => {
                (element as HTMLElement).setAttribute("class", value);
              };

              if (instance) {
                queueUpdate(instance, task);
              } else {
                task();
              }
            });
            this.trackEffect(element, stop);
          } else {
            const stop = this.scopedEffect(() => {
              const value = this.execute((attr as KNode.Attribute).value);
              const instance = this.interpreter.scope.get("$instance");
              const task = () => {
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
              };

              if (instance) {
                queueUpdate(instance, task);
              } else {
                task();
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
      if (e instanceof KasperError) throw e.withTag(node.name);
      this.error(KErrorCode.RUNTIME_ERROR, { message: e.message || `${e}` }, node.name);
    }
  }

  private createComponentArgs(args: KNode.Attribute[]): Record<string, any> {
    if (!args.length) {
      return {};
    }
    const result: Record<string, any> = {};
    for (const arg of args) {
      const key = arg.name.split(":")[1];
      if (this.mode === "development" && key.toLowerCase().startsWith("on")) {
        const trimmed = arg.value.trim();
        const isCallExpr = /^[\w$.][\w$.]*\s*\(.*\)\s*$/.test(trimmed) && !trimmed.includes("=>");
        if (isCallExpr) {
          console.warn(
            `[Kasper] @:${key}="${arg.value}" — the expression is called during render and its return value is passed as the prop. ` +
            `If it returns a function, that function becomes the handler (factory pattern). ` +
            `If it returns undefined, the prop receives undefined. ` +
            `If the function has reactive side effects, ensure it does not both read and write the same signal.`
          );
        }
      }
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
    if (modifiers.includes("once")) options.once = true;
    if (modifiers.includes("passive")) options.passive = true;
    if (modifiers.includes("capture")) options.capture = true;

    // Anything not in this list is treated as a potential key modifier
    const controlModifiers = ["prevent", "stop", "once", "passive", "capture", "ctrl", "shift", "alt", "meta"];
    const potentialKeyModifiers = modifiers.filter((m) => !controlModifiers.includes(m.toLowerCase()));

    element.addEventListener(
      eventName,
      (event: any) => {
        if (potentialKeyModifiers.length > 0) {
          const matched = potentialKeyModifiers.some((m) => {
            const lowerM = m.toLowerCase();
            if (KEY_MAP[lowerM] && KEY_MAP[lowerM].includes(event.key)) return true;
            if (lowerM === event.key?.toLowerCase()) return true;
            return false;
          });
          if (!matched) {
            return;
          }
        }

        if (modifiers.includes("ctrl") && !event.ctrlKey) return;
        if (modifiers.includes("shift") && !event.shiftKey) return;
        if (modifiers.includes("alt") && !event.altKey) return;
        if (modifiers.includes("meta") && !event.metaKey) return;

        if (modifiers.includes("prevent")) event.preventDefault();
        if (modifiers.includes("stop")) event.stopPropagation();
        listenerScope.set("$event", event);
        this.execute(attr.value, listenerScope);
      },
      options
    );
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
        instance.onDestroy();
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

    const nodes = this.templateParser.parse(template);
    const host = document.createElement("div");
    container.appendChild(host);

    const component = new ComponentClass({ args: { params: params }, ref: host, transpiler: this });
    this.bindMethods(component);
    (host as any).$kasperInstance = component;

    const componentNodes = nodes;
    component.$render = () => {
      this.isRendering = true;
      try {
        this.destroy(host);
        host.innerHTML = "";
        const scope = new Scope(null, component);
        scope.set("$instance", component);
        const prev = this.interpreter.scope;
        this.interpreter.scope = scope;

        flushSync(() => {
          this.createSiblings(componentNodes, host);
          if (typeof component.onRender === "function") component.onRender();
        });

        this.interpreter.scope = prev;
      } finally {
        this.isRendering = false;
      }
    };

    const scope = new Scope(null, component);
    scope.set("$instance", component);
    const prev = this.interpreter.scope;
    this.interpreter.scope = scope;

    flushSync(() => {
      this.createSiblings(nodes, host);
    });

    this.interpreter.scope = prev;

    if (typeof component.onMount === "function") component.onMount();
    if (typeof component.onRender === "function") component.onRender();
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

        if (!pathAttr || !componentAttr) {
          this.error(KErrorCode.MISSING_REQUIRED_ATTR, { message: "<route> requires @path and @component attributes." }, el.name);
        }

        const path = pathAttr!.value;
        const component = this.execute(componentAttr!.value);
        const guard = guardAttr ? this.execute(guardAttr.value) : parentGuard;
        routes.push({ path: path, component: component, guard: guard });
      } else if (el.name === "guard") {
        const checkAttr = this.findAttr(el, ["@check"]);
        if (!checkAttr) {
          this.error(KErrorCode.MISSING_REQUIRED_ATTR, { message: "<guard> requires @check attribute." }, el.name);
        }

        if (!checkAttr) continue;
        const check = this.execute(checkAttr.value);
        routes.push(...this.extractRoutes(el.children, check));
      }
    }
    if (scope) this.interpreter.scope = prevScope;
    return routes;
  }

  private triggerRender(): void {
    if (this.isRendering) return;
    const instance = this.interpreter.scope.get("$instance");
    if (instance && typeof instance.onRender === "function") {
      instance.onRender();
    }
  }

  public visitDoctypeKNode(_node: KNode.Doctype): void {
    return;
    // return document.implementation.createDocumentType("html", "", "");
  }

  public error(code: KErrorCodeType, args: any, tagName?: string): void {
    let finalArgs = args;
    if (typeof args === "string") {
      const cleanMessage = args.includes("Runtime Error")
        ? args.replace("Runtime Error: ", "")
        : args;
      finalArgs = { message: cleanMessage };
    }

    throw new KasperError(code, finalArgs, undefined, undefined, tagName);
  }

}
