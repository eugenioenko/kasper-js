import { Transpiler } from "./transpiler";
import { KNode } from "./types/nodes";
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
    constructor(props?: ComponentArgs);
    onInit(): void;
    onRender(): void;
    onChanges(): void;
    onDestroy(): void;
    $doRender(): void;
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
        nodes: KNode[];
    };
}
export {};
