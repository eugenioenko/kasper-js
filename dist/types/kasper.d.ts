import { ComponentRegistry } from "./component";
export declare function execute(source: string): string;
export declare function transpile(source: string, entity?: {
    [key: string]: any;
}, container?: HTMLElement, registry?: ComponentRegistry): Node;
export declare function Kasper(ComponentClass: any): void;
export interface KasperConfig {
    root?: string | HTMLElement;
    entry?: string;
    registry: ComponentRegistry;
    mode?: "development" | "production";
}
export declare function bootstrap(config: KasperConfig): import("./component").Component<Record<string, any>>;
