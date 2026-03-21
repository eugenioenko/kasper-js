import { Component } from "./component";
import { handleError } from "./error-handler";

type Task = () => void;

const queue = new Map<Component, Task[]>();
const nextTickCallbacks: Task[] = [];
let isScheduled = false;
let batchingEnabled = true;

function flush() {
  isScheduled = false;

  // 1. Process component updates
  for (const [instance, tasks] of queue.entries()) {
    try {
      // Call pre-update hook (only for reactive updates, not first mount)
      if (typeof instance.onChanges === "function") {
        instance.onChanges();
      }

      // Run all surgical DOM updates for this component
      for (const task of tasks) {
        task();
      }

      // Call post-update hook
      if (typeof instance.onRender === "function") {
        instance.onRender();
      }
    } catch (e) {
      handleError(e, 'render', instance);
    }
  }
  queue.clear();

  // 2. Process nextTick callbacks
  const callbacks = nextTickCallbacks.splice(0);
  for (const cb of callbacks) {
    try {
      cb();
    } catch (e) {
      handleError(e, 'render');
    }
  }
}

export function queueUpdate(instance: Component, task: Task) {
  if (!batchingEnabled) {
    task();
    // During sync mount, we don't call onChanges or onRender here.
    // onRender is called manually at the end of transpile/bootstrap.
    return;
  }

  if (!queue.has(instance)) {
    queue.set(instance, []);
  }
  queue.get(instance)!.push(task);

  if (!isScheduled) {
    isScheduled = true;
    queueMicrotask(flush);
  }
}

/**
 * Executes a function with batching disabled. 
 * Used for initial mount and manual renders.
 */
export function isBatching(): boolean {
  return batchingEnabled;
}

export function flushSync(fn: () => void) {
  const prev = batchingEnabled;
  batchingEnabled = false;
  try {
    fn();
  } finally {
    batchingEnabled = prev;
  }
}

/**
 * Returns a promise that resolves after the next framework update cycle.
 */
export function nextTick(): Promise<void>;
export function nextTick(cb: Task): void;
export function nextTick(cb?: Task): Promise<void> | void {
  if (cb) {
    nextTickCallbacks.push(cb);
    if (!isScheduled) {
      isScheduled = true;
      queueMicrotask(flush);
    }
    return;
  }

  return new Promise((resolve) => {
    nextTickCallbacks.push(resolve);
    if (!isScheduled) {
      isScheduled = true;
      queueMicrotask(flush);
    }
  });
}
