import { ComponentRegistry } from "./component";
export declare function execute(source: string): string;
export declare function transpile(source: string, entity?: {
    [key: string]: any;
}, container?: HTMLElement, registry?: ComponentRegistry): Node;
export declare function Kasper(ComponentClass: any): void;
interface AppConfig {
    root?: string | HTMLElement;
    entry?: string;
    registry: ComponentRegistry;
}
export declare function KasperInit(config: AppConfig): import("./component").Component;
export {};
