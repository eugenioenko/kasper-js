type Listener = () => void;

let activeEffect: { fn: Listener; deps: Set<any> } | null = null;
const effectStack: any[] = [];

let batching = false;
const pendingSubscribers = new Set<Listener>();
const pendingWatchers: Array<() => void> = [];

type Watcher<T> = (newValue: T, oldValue: T) => void;

export class Signal<T> {
  private _value: T;
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
        for (const sub of Array.from(this.subscribers)) {
          try { sub(); } catch (e) { console.error("Effect error:", e); }
        }
        for (const watcher of this.watchers) {
          try { watcher(newValue, oldValue); } catch (e) { console.error("Watcher error:", e); }
        }
      }
    }
  }

  onChange(fn: Watcher<T>): () => void {
    this.watchers.add(fn);
    return () => this.watchers.delete(fn);
  }

  unsubscribe(fn: Listener) {
    this.subscribers.delete(fn);
  }

  toString() { return String(this.value); }
  peek() { return this._value; }
}

export function effect(fn: Listener) {
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
  return () => {
    effectObj.deps.forEach(sig => sig.unsubscribe(effectObj.fn));
    effectObj.deps.clear();
  };
}

export function signal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
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
      try { sub(); } catch (e) { console.error("Effect error:", e); }
    }
    for (const watcher of watchers) {
      try { watcher(); } catch (e) { console.error("Watcher error:", e); }
    }
  }
}

export function computed<T>(fn: () => T): Signal<T> {
  const s = signal<T>(undefined as any);
  effect(() => {
    s.value = fn();
  });
  return s;
}
