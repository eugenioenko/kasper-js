import { ComponentClass, ComponentRegistry } from "./component";
export declare function lazy(importer: () => Promise<Record<string, ComponentClass>>): {
    component: () => Promise<ComponentClass>;
    lazy: true;
};
export declare function execute(source: string): string;
export declare function transpile(source: string, entity?: {
    [key: string]: any;
}, container?: HTMLElement, registry?: ComponentRegistry): Node;
export interface KasperConfig {
    root?: string | HTMLElement;
    entry?: string;
    registry: ComponentRegistry;
    mode?: "development" | "production";
}
export declare function bootstrap(config: KasperConfig): import("./component").Component<Record<string, any>>;
