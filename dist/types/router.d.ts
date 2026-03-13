import { Component, ComponentClass } from "./component";
export interface RouteConfig {
    path: string;
    component: ComponentClass;
    guard?: () => Promise<boolean>;
}
export declare function navigate(path: string): void;
export declare function matchPath(pattern: string, pathname: string): Record<string, string> | null;
export declare class Router extends Component {
    private routes;
    setRoutes(routes: RouteConfig[]): void;
    onInit(): void;
    private _navigate;
    private _mount;
}
