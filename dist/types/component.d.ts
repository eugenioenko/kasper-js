import { Signal } from "./signal";
import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";
type Watcher<T> = (newValue: T, oldValue: T) => void;
interface ComponentArgs<TArgs extends Record<string, any> = Record<string, any>> {
    args: TArgs;
    ref?: Node;
    transpiler?: Transpiler;
}
export declare class Component<TArgs extends Record<string, any> = Record<string, any>> {
    static template?: string;
    args: TArgs;
    ref?: Node;
    transpiler?: Transpiler;
    $abortController: AbortController;
    $render?: () => void;
    constructor(props?: ComponentArgs<TArgs>);
    /**
     * Creates a reactive effect tied to the component's lifecycle.
     * Runs immediately and re-runs when any signal dependency changes.
     */
    effect(fn: () => void): void;
    /**
     * Watches a specific signal for changes.
     * Does NOT run immediately.
     */
    watch<T>(sig: Signal<T>, fn: Watcher<T>): void;
    /**
     * Creates a computed signal tied to the component's lifecycle.
     * The internal effect is automatically cleaned up when the component is destroyed.
     */
    computed<T>(fn: () => T): Signal<T>;
    onMount(): void;
    onRender(): void;
    onChanges(): void;
    onDestroy(): void;
    render(): void;
}
export type KasperEntity = Component | Record<string, any> | null | undefined;
export type ComponentClass = {
    new (args?: ComponentArgs<any>): Component;
};
export interface ComponentRegistry {
    [tagName: string]: {
        component: ComponentClass | (() => Promise<ComponentClass>);
        nodes?: KNode[];
        lazy?: boolean;
        fallback?: ComponentClass;
    };
}
export {};
