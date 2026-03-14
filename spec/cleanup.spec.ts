import { describe, it, expect, vi } from "vitest";
import { signal, effect, computed } from "../src/signal";
import { Component, haunt } from "../src/component";

describe("AbortSignal Cleanup & Architecture", () => {
  describe("Signal Primitives with AbortSignal", () => {
    it("stops effect when AbortSignal is aborted", () => {
      const s = signal(0);
      const controller = new AbortController();
      let runs = 0;
      
      effect(() => {
        s.value;
        runs++;
      }, { signal: controller.signal });

      expect(runs).toBe(1);
      s.value = 1;
      expect(runs).toBe(2);

      controller.abort();
      s.value = 2;
      expect(runs).toBe(2); // Should not run again
    });

    it("stops onChange when AbortSignal is aborted", () => {
      const s = signal(0);
      const controller = new AbortController();
      const spy = vi.fn();

      s.onChange(spy, { signal: controller.signal });
      s.value = 1;
      expect(spy).toHaveBeenCalledTimes(1);

      controller.abort();
      s.value = 2;
      expect(spy).toHaveBeenCalledTimes(1); // Should not run again
    });

    it("stops computed internal effect when AbortSignal is aborted", () => {
      const s = signal(10);
      const controller = new AbortController();
      const double = computed(() => s.value * 2, { signal: controller.signal });

      expect(double.value).toBe(20);
      s.value = 20;
      expect(double.value).toBe(40);

      controller.abort();
      s.value = 30;
      // Computed value should be stale/stopped
      expect(double.value).toBe(40); 
    });

    it("immediately stops if AbortSignal is already aborted", () => {
      const s = signal(0);
      const controller = new AbortController();
      controller.abort();
      let runs = 0;

      effect(() => {
        s.value;
        runs++;
      }, { signal: controller.signal });

      expect(runs).toBe(0); // Should not even run the first time
    });
  });

  describe("Component-level Reactive Methods", () => {
    it("auto-cleans this.effect() on destroy", () => {
      const s = signal(0);
      let runs = 0;
      const comp = new Component();
      
      comp.effect(() => {
        s.value;
        runs++;
      });

      expect(runs).toBe(1);
      s.value = 1;
      expect(runs).toBe(2);

      comp.$abortController.abort();
      s.value = 2;
      expect(runs).toBe(2);
    });

    it("auto-cleans this.watch() on destroy", () => {
      const s = signal(0);
      const spy = vi.fn();
      const comp = new Component();

      comp.watch(s, spy);
      s.value = 1;
      expect(spy).toHaveBeenCalledTimes(1);

      comp.$abortController.abort();
      s.value = 2;
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("auto-cleans this.computed() on destroy", () => {
      const s = signal(10);
      const comp = new Component();
      const double = comp.computed(() => s.value * 2);

      expect(double.value).toBe(20);
      comp.$abortController.abort();
      s.value = 20;
      expect(double.value).toBe(20);
    });
  });

  describe("haunt() Magic Function", () => {
    it("throws if called outside lifecycle context", () => {
      expect(() => haunt(() => {})).toThrow("Kasper Error: haunt()");
    });

    it("registers effect via haunt() when 1 arg provided", () => {
      const s = signal(0);
      let runs = 0;
      const comp = new Component();

      // Simulate being inside lifecycle
      import("../src/component").then(({ setActiveComponent }) => {
        setActiveComponent(comp);
        haunt(() => {
          s.value;
          runs++;
        });
        setActiveComponent(null);

        expect(runs).toBe(1);
        s.value = 1;
        expect(runs).toBe(2);

        comp.$abortController.abort();
        s.value = 2;
        expect(runs).toBe(2);
      });
    });

    it("registers watch via haunt() when 2 args provided", () => {
      const s = signal(0);
      const spy = vi.fn();
      const comp = new Component();

      import("../src/component").then(({ setActiveComponent }) => {
        setActiveComponent(comp);
        haunt(s, spy);
        setActiveComponent(null);

        s.value = 1;
        expect(spy).toHaveBeenCalledTimes(1);

        comp.$abortController.abort();
        s.value = 2;
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    it("throws if called after an await in async lifecycle", async () => {
      const comp = new Component();
      const { setActiveComponent } = await import("../src/component");

      setActiveComponent(comp);
      await Promise.resolve(); // Context is lost!
      
      // We need to manually clear it in the transpiler usually, 
      // but in this test let's see what happens if we call it.
      // Wait, the transpiler clears it AFTER calling the hook.
      // So in a real async hook:
      // setActiveComponent(comp)
      // await hook() 
      // setActiveComponent(null)
      
      // If hook is: async () => { await 1; haunt() }
      // haunt will be called AFTER the transpiler has already set context to null.
      
      setActiveComponent(null); // Simulate transpiler finishing its sync part
      
      expect(() => haunt(() => {})).toThrow("👻 Kasper Error: haunt()");
    });
  });

  describe("Quirky Features", () => {
    it("scry() is an alias for peek()", () => {
      const s = signal(42);
      expect(s.scry()).toBe(42);
      
      let runs = 0;
      effect(() => {
        s.scry();
        runs++;
      });
      
      expect(runs).toBe(1);
      s.value = 100;
      expect(runs).toBe(1); // Should not subscribe
    });
  });

  describe("Memory Integrity", () => {
    it("removes internal subscribers from signal when aborted", () => {
      const s = signal(0) as any;
      const controller = new AbortController();
      
      expect(s.subscribers.size).toBe(0);
      
      const stop = effect(() => { s.value; }, { signal: controller.signal });
      expect(s.subscribers.size).toBe(1);

      controller.abort();
      expect(s.subscribers.size).toBe(0);
    });

    it("removes internal watchers from signal when aborted", () => {
      const s = signal(0) as any;
      const controller = new AbortController();
      
      expect(s.watchers.size).toBe(0);
      
      s.onChange(() => {}, { signal: controller.signal });
      expect(s.watchers.size).toBe(1);

      controller.abort();
      expect(s.watchers.size).toBe(0);
    });
  });
});
