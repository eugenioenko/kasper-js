import { describe, it, expect, vi } from "vitest";
import { Component } from "../src/component";
import { signal } from "../src/signal";
import { Transpiler } from "../src/transpiler";

function makeTranspiler(registry: any) {
  return new Transpiler({ registry });
}

function render(html: string, transpiler: Transpiler) {
  const container = document.createElement("div");
  transpiler.transpile(
    (transpiler as any).templateParser.parse(html),
    {},
    container
  );
  return container;
}

describe("Lazy loading", () => {
  it("mounts fallback synchronously while component loads", async () => {
    class Skeleton extends Component {
      static template = "<span>loading...</span>";
    }

    class Heavy extends Component {
      static template = "<span>loaded</span>";
    }

    const transpiler = makeTranspiler({
      "heavy-comp": {
        component: () => Promise.resolve(Heavy),
        lazy: true,
        fallback: Skeleton,
      },
    });

    const container = render("<heavy-comp></heavy-comp>", transpiler);

    // fallback is visible synchronously
    expect(container.textContent).toBe("loading...");

    await Promise.resolve();
    await Promise.resolve();

    // real component replaces fallback
    expect(container.textContent).toBe("loaded");
  });

  it("mounts without fallback", async () => {
    class Heavy extends Component {
      static template = "<span>loaded</span>";
    }

    const transpiler = makeTranspiler({
      "heavy-comp": {
        component: () => Promise.resolve(Heavy),
        lazy: true,
      },
    });

    const container = render("<heavy-comp></heavy-comp>", transpiler);
    expect(container.textContent).toBe("");

    await Promise.resolve();
    await Promise.resolve();

    expect(container.textContent).toBe("loaded");
  });

  it("shares a single import promise across multiple instances", async () => {
    let importCount = 0;

    class Heavy extends Component {
      static template = "<span>loaded</span>";
    }

    const thunk = () => {
      importCount++;
      return Promise.resolve(Heavy);
    };

    const transpiler = makeTranspiler({
      "heavy-comp": {
        component: thunk,
        lazy: true,
      },
    });

    render("<div><heavy-comp></heavy-comp><heavy-comp></heavy-comp></div>", transpiler);

    await Promise.resolve();
    await Promise.resolve();

    expect(importCount).toBe(1);
  });

  it("converts to eager after resolving — subsequent mounts skip the lazy path", async () => {
    let importCount = 0;

    class Heavy extends Component {
      static template = "<span>loaded</span>";
    }

    const entry = {
      component: () => { importCount++; return Promise.resolve(Heavy); },
      lazy: true as const,
    };

    const transpiler = makeTranspiler({ "heavy-comp": entry });

    render("<heavy-comp></heavy-comp>", transpiler);

    await Promise.resolve();
    await Promise.resolve();

    // entry.lazy should be gone now
    expect((entry as any).lazy).toBeUndefined();

    // second render — entry is now eager
    const container2 = render("<heavy-comp></heavy-comp>", transpiler);
    expect(container2.textContent).toBe("loaded");
    expect(importCount).toBe(1);
  });

  it("passes args to the real component after load", async () => {
    class Heavy extends Component {
      static template = "<span>{{args.label}}</span>";
    }

    const transpiler = makeTranspiler({
      "heavy-comp": {
        component: () => Promise.resolve(Heavy),
        lazy: true,
      },
    });

    const container = render('<heavy-comp @:label="\'hello\'"></heavy-comp>', transpiler);

    await Promise.resolve();
    await Promise.resolve();

    expect(container.textContent).toBe("hello");
  });

  it("fallback with signal animates while loading", async () => {
    class Skeleton extends Component {
      static template = "<span>{{count.value}}</span>";
      count = signal(0);
      onMount() {
        this.count.value = 42;
      }
    }

    class Heavy extends Component {
      static template = "<span>done</span>";
    }

    const transpiler = makeTranspiler({
      "heavy-comp": {
        component: () => Promise.resolve(Heavy),
        lazy: true,
        fallback: Skeleton,
      },
    });

    const container = render("<heavy-comp></heavy-comp>", transpiler);
    expect(container.textContent).toBe("42");

    await Promise.resolve();
    await Promise.resolve();

    expect(container.textContent).toBe("done");
  });
});
