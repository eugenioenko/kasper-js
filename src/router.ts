import { Component, ComponentClass } from "./component";

export interface RouteConfig {
  path: string;
  component: ComponentClass;
  guard?: () => Promise<boolean>;
}

export function navigate(path: string): void {
  history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  if (pattern === "*") return {};
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export class Router extends Component {
  private routes: RouteConfig[] = [];

  setRoutes(routes: RouteConfig[]): void {
    this.routes = routes;
  }

  onInit(): void {
    window.addEventListener("popstate", () => this._navigate(), {
      signal: this.$abortController.signal,
    });
    this._navigate();
  }

  private async _navigate(): Promise<void> {
    const pathname = window.location.pathname;
    for (const route of this.routes) {
      const params = matchPath(route.path, pathname);
      if (params === null) continue;
      if (route.guard) {
        const allowed = await route.guard();
        if (!allowed) return;
      }
      this._mount(route.component, params);
      return;
    }
  }

  private _mount(ComponentClass: ComponentClass, params: Record<string, string>): void {
    const element = this.ref as HTMLElement;
    if (!element || !this.transpiler) return;
    this.transpiler.mountComponent(ComponentClass, element, params);
  }
}
