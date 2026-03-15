import { ComponentRegistry } from "./component";
import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";
import { KasperError, KErrorCode } from "./types/error";

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


export function Kasper(ComponentClass: any) {
  bootstrap({
    root: "kasper-app",
    entry: "kasper-root",
    registry: {
      "kasper-root": {
        selector: "template",
        component: ComponentClass,
        template: null,
      },
    },
  });
}

export interface KasperConfig {
  root?: string | HTMLElement;
  entry?: string;
  registry: ComponentRegistry;
  mode?: "development" | "production";
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
    if (!entry.nodes) entry.nodes = [];
    if (entry.nodes.length > 0) {
      continue;
    }
    if (entry.selector) {
      const template = document.querySelector(entry.selector);
      if (template) {
        entry.template = template;
        entry.nodes = parser.parse(template.innerHTML);
        continue;
      }
    }
    if (typeof entry.template === "string") {
      entry.nodes = parser.parse(entry.template);
      continue;
    }
    const staticTemplate = (entry.component as any).template;
    if (staticTemplate) {
      entry.nodes = parser.parse(staticTemplate);
    }
  }
  return result;
}

export function bootstrap(config: KasperConfig) {
  const parser = new TemplateParser();
  const root =
    typeof config.root === "string"
      ? document.querySelector(config.root)
      : config.root;

  if (!root) {
    throw new KasperError(
      KErrorCode.ROOT_ELEMENT_NOT_FOUND,
      { root: config.root }
    );
  }

  const entryTag = config.entry || "kasper-app";
  if (!config.registry[entryTag]) {
    throw new KasperError(
      KErrorCode.ENTRY_COMPONENT_NOT_FOUND,
      { tag: entryTag }
    );
  }

  const registry = normalizeRegistry(config.registry, parser);
  const transpiler = new Transpiler({ registry: registry });
  
  // Set the environment mode on the transpiler or globally
  if (config.mode) {
    (transpiler as any).mode = config.mode;
  } else {
    // Default to development if not specified
    (transpiler as any).mode = "development";
  }

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
  if (typeof instance.onMount === "function") {
    instance.onMount();
  }

  transpiler.transpile(nodes, instance, node as HTMLElement);

  if (typeof instance.onRender === "function") {
    instance.onRender();
  }

  return instance;
}
