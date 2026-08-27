import { Signal, effect as rawEffect, computed as rawComputed } from "./signal";
import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";

type Watcher<T> = (newValue: T, oldValue: T) => void;

interface ComponentArgs<TArgs extends Record<string, any> = Record<string, any>> {
  args: TArgs;
  ref?: Node;
  transpiler?: Transpiler;
}

export class Component<TArgs extends Record<string, any> = Record<string, any>> {
  static template?: string;
  args: TArgs = {} as TArgs;
  ref?: Node;
  transpiler?: Transpiler;
  $abortController = new AbortController();
  $render?: () => void;

  constructor(props?: ComponentArgs<TArgs>) {
    if (!props) {
      this.args = {} as TArgs;
      return;
    }
    if (props.args) {
      this.args = props.args;
    }
    if (props.ref) {
      this.ref = props.ref;
    }
    if (props.transpiler) {
      this.transpiler = props.transpiler;
    }
  }

  /**
   * Creates a reactive effect tied to the component's lifecycle.
   * Runs immediately and re-runs when any signal dependency changes.
   */
  effect(fn: () => void): void {
    rawEffect(fn, { signal: this.$abortController.signal });
  }

  /**
   * Watches a specific signal for changes.
   * Does NOT run immediately.
   */
  watch<T>(sig: Signal<T>, fn: Watcher<T>): void {
    sig.onChange(fn, { signal: this.$abortController.signal });
  }

  /**
   * Creates a computed signal tied to the component's lifecycle.
   * The internal effect is automatically cleaned up when the component is destroyed.
   */
  computed<T>(fn: () => T): Signal<T> {
    return rawComputed(fn, { signal: this.$abortController.signal });
  }

  onMount() { }
  onRender() { }
  onChanges() { }
  onDestroy() { }
  onError?(error: Error, phase: string): void;

  render() {
    this.$render?.();
  }
}

export type KasperEntity = Component | Record<string, any> | null | undefined;

export type ComponentClass = { new(args?: ComponentArgs<any>): Component };
export interface ComponentRegistry {
  [tagName: string]: {
    component: ComponentClass | (() => Promise<ComponentClass>);
    nodes?: KNode[];
    lazy?: boolean;
    fallback?: ComponentClass;
  };
}
