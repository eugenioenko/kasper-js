---
title: Signals
description: Complete Signals API reference for Kasper.js.
---


Signals are the reactive primitive in Kasper. They hold a value and notify subscribers whenever that value changes. All template bindings (`{{ }}`, directives) automatically track the signals they read — no manual wiring needed.

---

## signal()

```js
const count = kasper.signal(0);

count.value        // read — subscribes the current effect
count.value = 5    // write — notifies all subscribers
count.peek()       // read without subscribing
```

`signal(initialValue)` returns a `Signal<T>`. The `.value` getter/setter is the primary interface.

Use `peek()` when you need the current value without creating a reactive dependency — useful inside event handlers or `onDestroy` where you don't want to subscribe.

---

## computed()

```js
const double = kasper.computed(() => count.value * 2);

double.value  // always count.value * 2
```

`computed(fn)` creates a derived signal whose value is kept in sync with its dependencies automatically. It is read-only — setting `.value` on a computed signal has no effect.

```js
class Cart extends Component {
  items = kasper.signal([]);
  total = kasper.computed(() =>
    this.items.value.reduce((sum, item) => sum + item.price, 0)
  );
}
```

Computed signals are lazy — they only re-evaluate when their value is read after a dependency has changed.

---

## effect()

```js
const stop = kasper.effect(() => {
  console.log('count is', count.value);
});

stop(); // unsubscribe and stop re-running
```

`effect(fn)` runs `fn` immediately, tracks every signal read during execution, and re-runs whenever any of those signals change. Returns a stop function to dispose the effect.

Effects are the mechanism behind all template bindings — every `{{ }}` interpolation and reactive directive runs inside an effect under the hood.

```js
class Logger extends Component {
  data = kasper.signal(null);

  onInit() {
    const stop = kasper.effect(() => {
      if (this.data.value) console.log('data:', this.data.value);
    });

    // if needed, stop it later
    this._stopLogger = stop;
  }

  onDestroy() {
    this._stopLogger?.();
  }
}
```

---

## onChange()

```js
const stop = signal.onChange((newValue, oldValue) => {
  console.log(`${oldValue} → ${newValue}`);
});

stop(); // remove the watcher
```

`onChange(fn)` registers a watcher that fires **only when the value changes** — it does not run immediately. The callback always receives both the new and the previous value.

This is the key difference from `effect`:

| | `effect` | `onChange` |
|---|---|---|
| Runs immediately | yes | no |
| Receives old value | no | yes |
| Tracks dependencies | yes (any signal read inside) | no (single signal only) |

### In components — own signals

When watching a signal that lives on the component itself, no cleanup is needed. Both the signal and the watcher are owned by the same object — when the component is removed and goes out of scope, everything is garbage collected together.

```js
class MyComp extends Component {
  count = kasper.signal(0);

  onInit() {
    this.count.onChange((newVal, oldVal) => {
      console.log(`count: ${oldVal} → ${newVal}`);
    });
  }
}
```

No cleanup needed here — the signal is owned by the component and will be garbage collected along with it.

### In components — external signals

When watching a signal that outlives the component, the watcher holds a reference to the component via the callback closure. Call `stop()` in `onDestroy` to break that reference and allow the component to be garbage collected.

```js
class MyComp extends Component {
  onInit() {
    this._stop = globalTheme.onChange((theme) => {
      this.applyTheme(theme);
    });
  }

  onDestroy() {
    this._stop();
  }
}
```

---

## In components

Signals are typically declared as class fields and accessed via `this`:

```js
class Counter extends Component {
  count = kasper.signal(0);
  double = kasper.computed(() => this.count.value * 2);

  increment() {
    this.count.value++;
  }
}
```

Template bindings track signals automatically — no subscriptions needed in the template:

```html
<p>{{count.value}} × 2 = {{double.value}}</p>
<button @on:click="increment()">+</button>
```

### Shorthand in the playground

Inside playground examples, `signal` and `computed` are available without the `kasper.` prefix:

```js
class App extends Component {
  count = signal(0);
  double = computed(() => this.count.value * 2);
}
```
