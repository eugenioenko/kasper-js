import { Signal } from "./signal";
import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";
type Watcher<T> = (newValue: T, oldValue: T) => void;
interface ComponentArgs {
    args: Record<string, any>;
    ref?: Node;
    transpiler?: Transpiler;
}
export declare class Component {
    static template?: string;
    args: Record<string, any>;
    ref?: Node;
    transpiler?: Transpiler;
    $abortController: AbortController;
    $watchStops: Array<() => void>;
    $render?: () => void;
    constructor(props?: ComponentArgs);
    haunt<T>(sig: Signal<T>, fn: Watcher<T>): void;
    onInit(): void;
    onRender(): void;
    onChanges(): void;
    onDestroy(): void;
    render(): void;
}
export type KasperEntity = Component | Record<string, any> | null | undefined;
export type ComponentClass = {
    new (args?: ComponentArgs): Component;
};
export interface ComponentRegistry {
    [tagName: string]: {
        selector?: string;
        component: ComponentClass;
        template?: Element | null;
        nodes?: KNode[];
    };
}
export {};
