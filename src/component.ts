import { Signal } from "./signal";
import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";

type Watcher<T> = (newValue: T, oldValue: T) => void;

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
  $watchStops: Array<() => void> = [];
  $render?: () => void;

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

  haunt<T>(sig: Signal<T>, fn: Watcher<T>): void {
    this.$watchStops.push(sig.onChange(fn));
  }

  onMount() {}
  onRender() {}
  onChanges() {}
  onDestroy() {}

  render() {
    this.$render?.();
  }
}

export type KasperEntity = Component | Record<string, any> | null | undefined;

export type ComponentClass = { new (args?: ComponentArgs): Component };
export interface ComponentRegistry {
  [tagName: string]: {
    selector?: string;
    component: ComponentClass;
    template?: Element | null;
    nodes?: KNode[];
  };
}
