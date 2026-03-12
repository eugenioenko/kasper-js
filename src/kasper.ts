import { ComponentRegistry } from "./component";
import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";

export function execute(source: string): string {
  const parser = new TemplateParser();
  try {
    const nodes = parser.parse(source);
    return JSON.stringify(nodes);
  } catch (e) {
    return JSON.stringify([e instanceof Error ? e.message : String(e)]);
  }
}

export function transpile(
  source: string,
  entity?: { [key: string]: any },
  container?: HTMLElement,
  registry?: ComponentRegistry
): Node {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler({ registry: registry || {} });
  const result = transpiler.transpile(nodes, entity || {}, container);
  return result;
}

export class KasperRenderer {
  entity?: any = undefined;
  nodes?: any[] = undefined;
  container?: HTMLElement = undefined;
  transpiler?: Transpiler = undefined;
  changes = 0;
  dirty = false;

  setup(config: {
    entity: any;
    nodes: any[];
    container: HTMLElement;
    transpiler: Transpiler;
  }) {
    this.entity = config.entity;
    this.nodes = config.nodes;
    this.container = config.container;
    this.transpiler = config.transpiler;
  }

  render = () => {
    this.changes += 1;
    if (!this.entity || !this.nodes || !this.container || !this.transpiler) {
      return;
    }

    if (this.changes > 0 && !this.dirty) {
      this.dirty = true;
      queueMicrotask(() => {
        if (typeof this.entity?.$onChanges === "function") {
          this.entity.$onChanges();
        }

        this.transpiler.transpile(this.nodes, this.entity, this.container);

        if (typeof this.entity?.$onRender === "function") {
          this.entity.$onRender();
        }
        this.dirty = false;
        this.changes = 0;
      });
    }
  };
}

const renderer = new KasperRenderer();

export class KasperState {
  _value: any;

  constructor(initial: any) {
    this._value = initial;
  }

  get value(): any {
    return this._value;
  }

  set(value: any) {
    this._value = value;
    renderer.render();
  }

  toString() {
    return this._value?.toString() || "";
  }
}

export function kasperState(initial: any): KasperState {
  return new KasperState(initial);
}

export function Kasper(ComponentClass: any) {
  KasperInit({
    root: "kasper-app",
    entry: "kasper-root",
    registry: {
      "kasper-root": {
        selector: "template",
        component: ComponentClass,
        template: null,
        nodes: [],
      },
    },
  });
}

interface AppConfig {
  root?: string | HTMLElement;
  entry?: string;
  registry: ComponentRegistry;
}

function createComponent(
  transpiler: Transpiler,
  tag: string,
  registry: ComponentRegistry
) {
  const element = document.createElement(tag);
  const component = new registry[tag].component({
    ref: element,
    transpiler: transpiler,
    args: {},
  });

  return {
    node: element,
    instance: component,
    nodes: registry[tag].nodes,
  };
}

function normalizeRegistry(
  registry: ComponentRegistry,
  parser: TemplateParser
) {
  const result = { ...registry };
  for (const key of Object.keys(registry)) {
    const entry = registry[key];
    if (entry.nodes && entry.nodes.length > 0) {
      continue;
    }
    const template = document.querySelector(entry.selector);
    if (template) {
      entry.template = template;
      entry.nodes = parser.parse(template.innerHTML);
    }
  }
  return result;
}

export function KasperInit(config: AppConfig) {
  const parser = new TemplateParser();
  const root =
    typeof config.root === "string"
      ? document.querySelector(config.root)
      : config.root;

  if (!root) {
    throw new Error(`Root element not found: ${config.root}`);
  }

  const registry = normalizeRegistry(config.registry, parser);
  const transpiler = new Transpiler({ registry: registry });
  const entryTag = config.entry || "kasper-app";

  const { node, instance, nodes } = createComponent(
    transpiler,
    entryTag,
    registry
  );

  if (root) {
    root.innerHTML = "";
    root.appendChild(node);
  }

  // Initial render and lifecycle
  if (typeof instance.$onInit === "function") {
    instance.$onInit();
  }

  transpiler.transpile(nodes, instance, node as HTMLElement);

  if (typeof instance.$onRender === "function") {
    instance.$onRender();
  }

  return instance;
}
