import { describe, it, expect, vi } from "vitest";
import { signal, effect, computed, watch } from "../src/signal";
import { Component } from "../src/component";

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

    it("stops standalone watch when AbortSignal is aborted", () => {
      const s = signal(0);
      const controller = new AbortController();
      const spy = vi.fn();

      watch(s, spy, { signal: controller.signal });
      s.value = 1;
      expect(spy).toHaveBeenCalledTimes(1);

      controller.abort();
      s.value = 2;
      expect(spy).toHaveBeenCalledTimes(1); // Should not run again
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
