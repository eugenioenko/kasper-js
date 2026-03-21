import { describe, it, expect, vi, afterEach } from "vitest";
import { Component } from "../src/component";
import { signal } from "../src/signal";
import { queueUpdate, nextTick } from "../src/scheduler";
import { setErrorHandler } from "../src/error-handler";
import { Transpiler } from "../src/transpiler";
import { App } from "../src/index";

// Reset the global error handler after every test to avoid cross-contamination
afterEach(() => {
  setErrorHandler(undefined);
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTranspiler(registry: any = {}) {
  return new Transpiler({ registry });
}

function render(html: string, transpiler: Transpiler, entity: Record<string, any> = {}) {
  const container = document.createElement("div");
  transpiler.transpile(
    (transpiler as any).templateParser.parse(html),
    entity,
    container
  );
  return container;
}

// ---------------------------------------------------------------------------

describe("Error handling — global handler", () => {
  it("is called with phase='render' when a render task throws", async () => {
    const handler = vi.fn();
    setErrorHandler(handler);

    const instance = new Component() as any;
    instance.onChanges = () => { throw new Error("render boom"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(handler).toHaveBeenCalledOnce();
    const [err, ctx] = handler.mock.calls[0];
    expect(err.message).toBe("render boom");
    expect(ctx.phase).toBe("render");
    expect(ctx.component).toBe(instance);
  });

  it("is called with phase='watcher' when a watch callback throws", async () => {
    const handler = vi.fn();
    setErrorHandler(handler);

    const count = signal(0);
    count.onChange(() => { throw new Error("watcher boom"); });

    count.value = 1;

    expect(handler).toHaveBeenCalledOnce();
    const [err, ctx] = handler.mock.calls[0];
    expect(err.message).toBe("watcher boom");
    expect(ctx.phase).toBe("watcher");
    expect(ctx.component).toBeUndefined();
  });

  it("receives the Error object even when a non-Error is thrown", async () => {
    const handler = vi.fn();
    setErrorHandler(handler);

    const instance = new Component() as any;
    instance.onChanges = () => { throw "string error"; };

    queueUpdate(instance, vi.fn());
    await nextTick();

    const [err] = handler.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("string error");
  });

  it("falls back to console.error when no handler is registered", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const instance = new Component() as any;
    instance.onChanges = () => { throw new Error("unhandled"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(consoleSpy).toHaveBeenCalledOnce();
    expect(consoleSpy.mock.calls[0][0]).toContain("[Kasper]");
  });

  it("is registered via App() onError config option", async () => {
    const handler = vi.fn();
    const root = document.createElement("div");

    class Broken extends Component {
      static template = "<span></span>";
    }

    App({
      root,
      entry: "broken",
      registry: { broken: { component: Broken as any } },
      onError: handler,
    });

    const instance = new Component() as any;
    instance.onChanges = () => { throw new Error("app-level error"); };
    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].message).toBe("app-level error");
  });
});

// ---------------------------------------------------------------------------

describe("Error handling — component onError hook", () => {
  it("is called before the global handler", async () => {
    const order: string[] = [];
    setErrorHandler(() => order.push("global"));

    const instance = new Component() as any;
    instance.onError = () => order.push("component");
    instance.onChanges = () => { throw new Error("boom"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(order).toEqual(["component"]);
  });

  it("suppresses the global handler when it handles the error normally", async () => {
    const globalHandler = vi.fn();
    setErrorHandler(globalHandler);

    const instance = new Component() as any;
    instance.onError = vi.fn(); // handles silently
    instance.onChanges = () => { throw new Error("boom"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(instance.onError).toHaveBeenCalledOnce();
    expect(globalHandler).not.toHaveBeenCalled();
  });

  it("reaches the global handler when component onError re-throws", async () => {
    const globalHandler = vi.fn();
    setErrorHandler(globalHandler);

    const instance = new Component() as any;
    instance.onError = (err: Error) => { throw err; };
    instance.onChanges = () => { throw new Error("rethrown"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(globalHandler).toHaveBeenCalledOnce();
    expect(globalHandler.mock.calls[0][0].message).toBe("rethrown");
  });

  it("receives the correct error and phase", async () => {
    const instance = new Component() as any;
    const onError = vi.fn();
    instance.onError = onError;
    instance.onChanges = () => { throw new Error("phase-check"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "phase-check" }),
      "render"
    );
  });

  it("falls back to console.error when component onError itself throws and no global handler", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const instance = new Component() as any;
    instance.onError = () => { throw new Error("handler exploded"); };
    instance.onChanges = () => { throw new Error("original"); };

    queueUpdate(instance, vi.fn());
    await nextTick();

    expect(consoleSpy).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------

describe("Error handling — reactive template errors", () => {
  it("calls the global handler when a template expression throws during reactive update", async () => {
    const handler = vi.fn();
    setErrorHandler(handler);

    class BrokenComp extends Component {
      static template = "<span>{{ data.value.name }}</span>";
      data = signal<any>({ name: "Alice" });
    }

    const transpiler = makeTranspiler({ "broken-comp": { component: BrokenComp } });
    const container = document.createElement("div");
    transpiler.transpile(
      (transpiler as any).templateParser.parse("<broken-comp></broken-comp>"),
      {},
      container
    );

    const comp = (container.querySelector("broken-comp") as any)?.$kasperInstance as BrokenComp;

    // Setting data to null makes data.value.name throw on re-render
    comp.data.value = null;

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][1].phase).toBe("render");
  });

  it("component onError can set a fallback signal to show error UI", async () => {
    class SafeComp extends Component {
      static template = `
        <div @if="!broken.value">{{ data.value.name }}</div>
        <div @if="broken.value" class="fallback">Error occurred</div>
      `;
      data = signal<any>({ name: "Alice" });
      broken = signal(false);

      onError() {
        this.broken.value = true;
      }
    }

    const transpiler = makeTranspiler({ "safe-comp": { component: SafeComp } });
    const container = document.createElement("div");
    transpiler.transpile(
      (transpiler as any).templateParser.parse("<safe-comp></safe-comp>"),
      {},
      container
    );

    const comp = (container.querySelector("safe-comp") as any)?.$kasperInstance as SafeComp;

    expect(container.textContent).toContain("Alice");
    expect(container.querySelector(".fallback")).toBeNull();

    // Trigger an error: set data to null so data.value.name throws
    comp.data.value = null;
    await nextTick();

    expect(comp.broken.value).toBe(true);
    expect(container.querySelector(".fallback")).not.toBeNull();
  });
});
