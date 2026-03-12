import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";

interface ComponentArgs {
  args: Record<string, any>;
  ref?: Node;
  transpiler?: Transpiler;
}

export class Component {
  static template?: string;
  args: Record<string, any> = {};
  ref?: Node;
  transpiler?: Transpiler;
  $abortController = new AbortController();

  constructor(props?: ComponentArgs) {
    if (!props) {
      this.args = {};
      return;
    }
    if (props.args) {
      this.args = props.args || {};
    }
    if (props.ref) {
      this.ref = props.ref;
    }
    if (props.transpiler) {
      this.transpiler = props.transpiler;
    }
  }

  onInit() {}
  onRender() {}
  onChanges() {}
  onDestroy() {}

  $doRender() {
    if (!this.transpiler) {
      return;
    }
  }
}

export type KasperEntity = Component | Record<string, any> | null | undefined;

export type ComponentClass = { new (args?: ComponentArgs): Component };
export interface ComponentRegistry {
  [tagName: string]: {
    selector?: string;
    component: ComponentClass;
    template?: Element | null;
    nodes: KNode[];
  };
}
