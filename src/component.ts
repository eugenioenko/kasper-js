import { Signal, SignalOptions, effect as rawEffect, computed as rawComputed } from "./signal";
import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";

type Watcher<T> = (newValue: T, oldValue: T) => void;

let activeComponent: Component | null = null;

/**
 * Internal helper to set the active component context during lifecycle hooks.
 * @internal
 */
export function setActiveComponent(comp: Component | null) {
  activeComponent = comp;
}

/**
 * The ghostly way to add reactive logic to a component. 👻
 * 
 * - `haunt(() => ...)` -> Creates a reactive effect.
 * - `haunt(sig, (new, old) => ...)` -> Creates a signal watcher.
 * 
 * Must be called synchronously inside a component lifecycle hook (onMount, onRender, etc).
 */
export function haunt(arg1: any, arg2?: any): void {
  if (!activeComponent) {
    throw new Error("👻 Kasper Error: haunt() must be called synchronously inside a component lifecycle hook (onMount, onRender, etc.)");
  }

  if (typeof arg1 === "function") {
    activeComponent.effect(arg1);
  } else {
    activeComponent.watch(arg1, arg2);
  }
}

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

  /**
   * Alias for `watch` - keeps the Kasper spirit alive! 👻
   */
  haunt<T>(sig: Signal<T>, fn: Watcher<T>): void {
    this.watch(sig, fn);
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
