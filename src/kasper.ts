import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";
import { State } from "./state";

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
  $state = (initial: any) => new State(initial, this);
  $changes = 1;
  $dirty = false;
  $doRender = () => {
    if (typeof this.$onChanges === "function") {
      this.$onChanges();
    }
    if (this.$changes > 0 && !this.$dirty) {
      this.$dirty = true;
      queueMicrotask(() => {
        render(this);
        // console.log(this.$changes);
        if (typeof this.$onRender === "function") {
          this.$onRender();
        }
        this.$dirty = false;
        this.$changes = 0;
      });
    }
  };
  $onInit = () => {};
  $onRender = () => {};
  $onChanges = () => {};
}

export function Kasper(initializer: any) {
  const entity = new initializer();
  entity.$doRender();
  if (typeof entity.$onInit === "function") {
    entity.$onInit();
  }
}
