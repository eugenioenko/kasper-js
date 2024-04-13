import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";

export function execute(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  const result = JSON.stringify(nodes);
  return result;
}

export function transpile(
  source: string,
  entity?: { [key: string]: any },
  container?: HTMLElement
): Node {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  const result = transpiler.transpile(nodes, entity, container);
  return result;
}

export function render(entity: any): void {
  if (typeof window === "undefined") {
    console.error("kasper requires a browser environment to render templates.");
    return;
  }
  const template = document.getElementsByTagName("template")[0];
  if (!template) {
    console.error("No template found in the document.");
    return;
  }

  const container = document.getElementsByTagName("kasper");
  if (container.length) {
    document.body.removeChild(container[0]);
  }
  const node = transpile(template.innerHTML, entity);
  document.body.appendChild(node);
}

export class KasperApp {
  $onInit = () => {};
  $onRender = () => {};
  $onChanges = () => {};
}

export class KasperRenderer {
  entity?: KasperApp = undefined;
  changes = 1;
  dirty = false;

  render = () => {
    this.changes += 1;
    if (!this.entity) {
      // do not render if entity is not set
      return;
    }
    if (typeof this.entity?.$onChanges === "function") {
      this.entity.$onChanges();
    }
    if (this.changes > 0 && !this.dirty) {
      this.dirty = true;
      queueMicrotask(() => {
        render(this.entity);
        // console.log(this.changes);
        if (typeof this.entity?.$onRender === "function") {
          this.entity.$onRender();
        }
        this.dirty = false;
        this.changes = 0;
      });
    }
  };
}

let renderer = new KasperRenderer();

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
    return this._value.toString();
  }
}

export function kasperState(initial: any): KasperState {
  return new KasperState(initial);
}

export function Kasper(Component: any) {
  const entity = new Component();
  renderer.entity = entity;
  renderer.render();
  entity.$doRender();
  if (typeof entity.$onInit === "function") {
    entity.$onInit();
  }
}
