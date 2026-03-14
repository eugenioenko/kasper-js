---
title: API Reference
description: Complete API reference for Kasper.js.
---

## App bootstrap

### App(config)

Bootstrap a Kasper application.

```ts
import { App } from 'kasper-js';

App({
  root: document.querySelector('#app'),
  entry: 'my-app',
  registry: {
    'my-app': { component: MyApp },
  },
});
```

| Option | Type | Description |
|---|---|---|
| `root` | `string \| HTMLElement` | Root DOM element or selector |
| `entry` | `string` | Tag name of the root component |
| `registry` | `ComponentRegistry` | Map of tag names to component definitions |

## Signals

### signal(initialValue)

Create a reactive signal.

```ts
const count = signal(0);
count.value;        // read
count.value = 1;    // write
count.peek();       // read without tracking
count.scry();       // ghostly peek alias 👻
count.onChange((newVal, oldVal) => {}); // watch
```

### computed(fn)

Create a derived signal.

```ts
const double = computed(() => count.value * 2);
double.value; // read-only
```

### effect(fn)

Run a function reactively. Returns a stop function.

```ts
const stop = effect(() => {
  console.log(count.value);
});
stop(); // cleanup
```

### watch(sig, fn)

Watch a specific signal for changes. Unlike `effect()`, it does not run immediately. Returns a stop function.

```ts
const stop = watch(count, (newVal, oldVal) => {
  console.log(`Changed: ${newVal}`);
});
stop(); // cleanup
```

### batch(fn)

Group signal writes into a single flush.

```ts
batch(() => {
  a.value = 1;
  b.value = 2;
});
```

## Component

### class Component

Base class for all Kasper components.

```ts
class Component {
  static template?: string;   // set by vite-plugin-kasper
  args: Record<string, any>;  // passed from parent via @:
  ref?: Node;                 // root DOM element
  $abortController: AbortController;

  onMount(): void {}
  onRender(): void {}
  onChanges(): void {}
  onDestroy(): void {}

  // Reactive methods (Auto-cleaning)
  effect(fn: () => void): void;
  watch<T>(sig: Signal<T>, fn: (newVal: T, oldVal: T) => void): void;
  computed<T>(fn: () => T): Signal<T>;
  haunt<T>(sig: Signal<T>, fn: (newVal: T, oldVal: T) => void): void; // watch alias
}
```

### haunt(arg1, arg2?)

The "magic" standalone helper for reactive logic inside components. 👻

- **`haunt(() => ...)`**: Creates a reactive effect.
- **`haunt(sig, (new, old) => ...)`**: Creates a signal watcher.

**Constraint**: Must be called **synchronously** inside a component lifecycle hook (e.g., `onMount`). If called outside a valid component context (or after an `await`), it will throw an error.

```ts
import { Component, haunt } from 'kasper-js';

export class MyComponent extends Component {
  onMount() {
    haunt(() => console.log(this.count.value));
  }
}
```

## Lifecycle order

1. `onMount()` — before first render
2. Template is transpiled into DOM
3. `onRender()` — after first render, DOM available
4. `onChanges()` — on arg changes
5. `onDestroy()` — on removal

## Utilities

### transpile(source, entity, container, registry)

Low-level: parse and transpile an HTML string into a DOM node.

```ts
import { transpile } from 'kasper-js';

const node = transpile('<p>{{message}}</p>', { message: 'hello' });
document.body.appendChild(node);
```

### execute(source)

Parse an HTML template and return the KNode AST as JSON. Useful for debugging.

```ts
import { execute } from 'kasper-js';

console.log(execute('<p>{{x}}</p>'));
```
