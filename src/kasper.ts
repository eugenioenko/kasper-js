import { ComponentClass, ComponentRegistry } from "./component";
import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";
import { KasperError, KErrorCode } from "./types/error";

export function lazy(
  importer: () => Promise<Record<string, ComponentClass>>
): { component: () => Promise<ComponentClass>; lazy: true } {
  return {
    lazy: true,
    component: () => importer().then((m) => Object.values(m)[0]),
  };
}

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

export interface KasperConfig {
  root?: string | HTMLElement;
  entry?: string;
  registry: ComponentRegistry;
  mode?: "development" | "production";
}

function createComponent(transpiler: Transpiler, tag: string) {
  const element = document.createElement(tag);
  const component = new (transpiler.registry[tag].component as ComponentClass)({
    ref: element,
    transpiler: transpiler,
    args: {},
  });

  return {
    node: element,
    instance: component,
    nodes: transpiler.resolveNodes(tag),
  };
}

export function bootstrap(config: KasperConfig) {
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

  const transpiler = new Transpiler({ registry: config.registry });

  if (config.mode) {
    transpiler.mode = config.mode;
  }

  const { node, instance, nodes } = createComponent(transpiler, entryTag);

  root.innerHTML = "";
  root.appendChild(node);

  if (typeof instance.onMount === "function") {
    instance.onMount();
  }

  transpiler.transpile(nodes, instance, node as HTMLElement);

  if (typeof instance.onRender === "function") {
    instance.onRender();
  }

  return instance;
}
