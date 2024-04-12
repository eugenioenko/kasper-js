import { TemplateParser } from "./template-parser";
import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { Transpiler } from "./transpiler";
import { Viewer } from "./viewer";
import { Scanner } from "./scanner";
import { State } from "./state";

function execute(source: string): string {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  const result = JSON.stringify(nodes);
  return result;
}

function transpile(
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

function render(entity: any): void {
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

function Kasper(initializer: any) {
  const entity = new initializer();
  entity.$doRender();
  if (typeof entity.$onInit === "function") {
    entity.$onInit();
  }
}

if (typeof window !== "undefined") {
  ((window as any) || {}).kasper = {
    execute,
    transpile,
  };
  (window as any)["Kasper"] = Kasper;
  (window as any)["KasperApp"] = KasperApp;
} else if (typeof exports !== "undefined") {
  exports.kasper = {
    ExpressionParser,
    Interpreter,
    Scanner,
    TemplateParser,
    Transpiler,
    Viewer,
  };
}
