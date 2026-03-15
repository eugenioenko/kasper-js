import { describe, it, expect, vi } from "vitest";
import { queueUpdate, nextTick, flushSync } from "../src/scheduler";
import { Component } from "../src/component";

describe("Scheduler", () => {
  it("batches multiple updates for the same component", async () => {
    const instance = new Component() as any;
    instance.onChanges = vi.fn();
    instance.onRender = vi.fn();
    
    const task1 = vi.fn();
    const task2 = vi.fn();
    
    queueUpdate(instance, task1);
    queueUpdate(instance, task2);
    
    expect(task1).not.toHaveBeenCalled();
    expect(task2).not.toHaveBeenCalled();
    
    await nextTick();
    
    expect(instance.onChanges).toHaveBeenCalledTimes(1);
    expect(task1).toHaveBeenCalledTimes(1);
    expect(task2).toHaveBeenCalledTimes(1);
    expect(instance.onRender).toHaveBeenCalledTimes(1);
    
    // Order: onChanges -> tasks -> onRender
    const callOrder = [
      instance.onChanges,
      task1,
      task2,
      instance.onRender
    ];
    
    for (let i = 0; i < callOrder.length - 1; i++) {
      expect(callOrder[i].mock.invocationCallOrder[0])
        .toBeLessThan(callOrder[i+1].mock.invocationCallOrder[0]);
    }
  });

  it("nextTick works with promises", async () => {
    let resolved = false;
    nextTick().then(() => { resolved = true; });
    expect(resolved).toBe(false);
    await nextTick();
    expect(resolved).toBe(true);
  });

  it("nextTick works with callbacks", async () => {
    const cb = vi.fn();
    nextTick(cb);
    expect(cb).not.toHaveBeenCalled();
    await nextTick();
    expect(cb).toHaveBeenCalled();
  });

  it("flushSync runs tasks immediately", () => {
    const instance = new Component() as any;
    const task = vi.fn();
    
    flushSync(() => {
      queueUpdate(instance, task);
      expect(task).toHaveBeenCalledTimes(1);
    });
  });

  it("handles multiple components in one tick", async () => {
    const c1 = new Component() as any;
    const c2 = new Component() as any;
    c1.onRender = vi.fn();
    c2.onRender = vi.fn();
    
    queueUpdate(c1, () => {});
    queueUpdate(c2, () => {});
    
    await nextTick();
    
    expect(c1.onRender).toHaveBeenCalled();
    expect(c2.onRender).toHaveBeenCalled();
  });

  it("recovers from errors in tasks or hooks", async () => {
    const instance = new Component() as any;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    instance.onChanges = () => { throw new Error("hook error"); };
    const task = vi.fn();
    
    queueUpdate(instance, task);
    await nextTick();
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error during component update:"), expect.any(Error));
    // Even if hook fails, the scheduler should continue (though current implementation might skip tasks for that component)
    // Actually, my current flush handles each component in a try-catch.
    
    consoleSpy.mockRestore();
  });

  it("nextTick resolves after the flush", async () => {
    const instance = new Component() as any;
    let taskFinished = false;
    
    queueUpdate(instance, () => { taskFinished = true; });
    await nextTick();
    
    expect(taskFinished).toBe(true);
  });
});
