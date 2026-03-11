type Listener = () => void;

let activeEffect: Listener | null = null;
const effectStack: Listener[] = [];

export class Signal<T> {
  private _value: T;
  private subscribers = new Set<Listener>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  private notify() {
    // To avoid infinite loops if an effect modifies the signal it listens to,
    // we take a snapshot of subscribers
    const subs = Array.from(this.subscribers);
    for (const sub of subs) {
      sub();
    }
  }

  toString() {
    return String(this.value);
  }

  peek() {
    return this._value;
  }
}

export function effect(fn: Listener) {
  const wrappedEffect = () => {
    effectStack.push(wrappedEffect);
    activeEffect = wrappedEffect;
    try {
      fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1] || null;
    }
  };
  wrappedEffect();
  return wrappedEffect;
}

export function signal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}
