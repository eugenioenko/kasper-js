import { KasperError, KErrorCode } from "./types/error";

type Listener = () => void;

let activeEffect: { fn: Listener; deps: Set<any> } | null = null;
const effectStack: any[] = [];

let batching = false;
const pendingSubscribers = new Set<Listener>();
const pendingWatchers: Array<() => void> = [];

type Watcher<T> = (newValue: T, oldValue: T) => void;

export interface SignalOptions {
  signal?: AbortSignal;
}

export class Signal<T> {
  protected _value: T;
  private subscribers = new Set<Listener>();
  private watchers = new Set<Watcher<T>>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    if (activeEffect) {
      this.subscribers.add(activeEffect.fn);
      activeEffect.deps.add(this);
    }
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      const oldValue = this._value;
      this._value = newValue;
      if (batching) {
        for (const sub of this.subscribers) pendingSubscribers.add(sub);
        for (const watcher of this.watchers) pendingWatchers.push(() => watcher(newValue, oldValue));
      } else {
        const subs = Array.from(this.subscribers);
        for (const sub of subs) {
          sub();
        }
        for (const watcher of this.watchers) {
          try { watcher(newValue, oldValue); } catch (e) { console.error("Watcher error:", e); }
        }
      }
    }
  }

  onChange(fn: Watcher<T>, options?: SignalOptions): () => void {
    if (options?.signal?.aborted) return () => {};
    this.watchers.add(fn);
    const stop = () => this.watchers.delete(fn);
    if (options?.signal) {
      options.signal.addEventListener("abort", stop, { once: true });
    }
    return stop;
  }

  unsubscribe(fn: Listener) {
    this.subscribers.delete(fn);
  }

  toString() { return String(this.value); }
  peek() { return this._value; }
}

class ComputedSignal<T> extends Signal<T> {
  private fn: () => T;
  private computing = false;

  constructor(fn: () => T, options?: SignalOptions) {
    super(undefined as any);
    this.fn = fn;

    const stop = effect(() => {
      if (this.computing) {
        throw new KasperError(KErrorCode.CIRCULAR_COMPUTED);
      }

      this.computing = true;
      try {
        // Eagerly update the value so subscribers are notified immediately
        super.value = this.fn();
      } finally {
        this.computing = false;
      }
    }, options);

    if (options?.signal) {
      options.signal.addEventListener("abort", stop, { once: true });
    }
  }

  get value(): T {
    return super.value;
  }

  set value(_v: T) {
    // Computed signals are read-only from outside
  }
}

export function effect(fn: Listener, options?: SignalOptions) {
  if (options?.signal?.aborted) return () => {};
  const effectObj = {
    fn: () => {
      effectObj.deps.forEach(sig => sig.unsubscribe(effectObj.fn));
      effectObj.deps.clear();

      effectStack.push(effectObj);
      activeEffect = effectObj;
      try {
        fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1] || null;
      }
    },
    deps: new Set<Signal<any>>()
  };

  effectObj.fn();
  const stop: any = () => {
    effectObj.deps.forEach(sig => sig.unsubscribe(effectObj.fn));
    effectObj.deps.clear();
  };
  stop.run = effectObj.fn;

  if (options?.signal) {
    options.signal.addEventListener("abort", stop, { once: true });
  }

  return stop as (() => void) & { run: () => void };
}

export function signal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}

/**
 * Functional alias for Signal.onChange()
 */
export function watch<T>(sig: Signal<T>, fn: Watcher<T>, options?: SignalOptions): () => void {
  return sig.onChange(fn, options);
}

export function batch(fn: () => void): void {
  batching = true;
  try {
    fn();
  } finally {
    batching = false;
    const subs = Array.from(pendingSubscribers);
    pendingSubscribers.clear();
    const watchers = pendingWatchers.splice(0);
    for (const sub of subs) {
      sub();
    }
    for (const watcher of watchers) {
      try { watcher(); } catch (e) { console.error("Watcher error:", e); }
    }
  }
}

export function computed<T>(fn: () => T, options?: SignalOptions): Signal<T> {
  return new ComputedSignal(fn, options);
}
