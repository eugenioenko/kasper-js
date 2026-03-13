import { describe, it, expect, beforeEach, vi } from "vitest";
import { Component } from "../src/component";
import { matchPath, navigate, Router } from "../src/router";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";

describe("matchPath", () => {
  it("matches exact path", () => {
    expect(matchPath("/", "/")).toEqual({});
    expect(matchPath("/about", "/about")).toEqual({});
  });

  it("returns null for non-matching paths", () => {
    expect(matchPath("/about", "/contact")).toBeNull();
    expect(matchPath("/a/b", "/a")).toBeNull();
  });

  it("extracts params from :segment", () => {
    expect(matchPath("/users/:id", "/users/42")).toEqual({ id: "42" });
    expect(matchPath("/posts/:slug/edit", "/posts/hello-world/edit")).toEqual({ slug: "hello-world" });
  });

  it("matches wildcard *", () => {
    expect(matchPath("*", "/anything/at/all")).toEqual({});
    expect(matchPath("*", "/")).toEqual({});
  });

  it("returns null when segment count differs", () => {
    expect(matchPath("/users/:id", "/users")).toBeNull();
    expect(matchPath("/a", "/a/b")).toBeNull();
  });
});

describe("navigate", () => {
  it("pushes to history and dispatches popstate", () => {
    const pushState = vi.spyOn(history, "pushState");
    const dispatch = vi.spyOn(window, "dispatchEvent");

    navigate("/about");

    expect(pushState).toHaveBeenCalledWith(null, "", "/about");
    expect(dispatch).toHaveBeenCalledWith(expect.any(PopStateEvent));

    pushState.mockRestore();
    dispatch.mockRestore();
  });
});

describe("Router", () => {
  class HomePage extends Component {
    static template = "<p>Home</p>";
  }
  class AboutPage extends Component {
    static template = "<p>About</p>";
  }
  class UserPage extends Component {
    static template = "<p>User {{args.params.id}}</p>";
  }
  class NotFound extends Component {
    static template = "<p>404</p>";
  }

  let container: HTMLElement;
  let transpiler: Transpiler;
  let parser: TemplateParser;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    transpiler = new Transpiler();
    parser = new TemplateParser();
  });

  function mountRouter(routes: any[]) {
    const router = new Router({ args: {}, ref: container, transpiler });
    router.setRoutes(routes);
    router.onInit();
    return router;
  }

  it("renders the matched route on init", () => {
    Object.defineProperty(window, "location", { value: { pathname: "/" }, writable: true });
    mountRouter([
      { path: "/", component: HomePage },
      { path: "*", component: NotFound },
    ]);
    expect(container.textContent).toContain("Home");
  });

  it("renders 404 when no route matches", () => {
    Object.defineProperty(window, "location", { value: { pathname: "/missing" }, writable: true });
    mountRouter([
      { path: "/", component: HomePage },
      { path: "*", component: NotFound },
    ]);
    expect(container.textContent).toContain("404");
  });

  it("passes params to the component", () => {
    Object.defineProperty(window, "location", { value: { pathname: "/users/99" }, writable: true });
    mountRouter([
      { path: "/users/:id", component: UserPage },
    ]);
    expect(container.textContent).toContain("99");
  });

  it("navigates to a new route on popstate", () => {
    Object.defineProperty(window, "location", { value: { pathname: "/" }, writable: true });
    mountRouter([
      { path: "/", component: HomePage },
      { path: "/about", component: AboutPage },
    ]);
    expect(container.textContent).toContain("Home");

    Object.defineProperty(window, "location", { value: { pathname: "/about" }, writable: true });
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(container.textContent).toContain("About");
  });

  it("blocks navigation when guard returns false", async () => {
    Object.defineProperty(window, "location", { value: { pathname: "/dashboard" }, writable: true });
    const guard = async () => false;
    mountRouter([
      { path: "/", component: HomePage },
      { path: "/dashboard", component: AboutPage, guard },
    ]);
    await new Promise((r) => setTimeout(r, 0));
    expect(container.textContent).not.toContain("About");
  });

  it("allows navigation when guard returns true", async () => {
    Object.defineProperty(window, "location", { value: { pathname: "/dashboard" }, writable: true });
    const guard = async () => true;
    mountRouter([
      { path: "/dashboard", component: AboutPage, guard },
    ]);
    await new Promise((r) => setTimeout(r, 0));
    expect(container.textContent).toContain("About");
  });
});

describe("Router template integration", () => {
  class HomePage extends Component {
    static template = "<p>Home</p>";
  }
  class AboutPage extends Component {
    static template = "<p>About</p>";
  }

  it("extracts routes from template KNodes", () => {
    Object.defineProperty(window, "location", { value: { pathname: "/" }, writable: true });
    const parser = new TemplateParser();
    const transpiler = new Transpiler();
    const container = document.createElement("div");

    class App extends Component {
      static $imports = { HomePage, AboutPage };
    }

    transpiler.transpile(
      parser.parse(`<router>
        <route @path="/" @component="HomePage" />
        <route @path="/about" @component="AboutPage" />
      </router>`),
      new App(),
      container
    );
    expect(container.textContent).toContain("Home");
  });
});
