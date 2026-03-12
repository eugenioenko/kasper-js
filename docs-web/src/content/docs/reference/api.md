---
title: API Reference
description: Complete API reference for Kasper.js.
---

## App bootstrap

### App(config)

Bootstrap a Kasper application.

```ts
import { App } from 'kasper';

App({
  root: document.querySelector('#app'),
  entry: 'my-app',
  registry: {
    'my-app': { component: MyApp, nodes: [] },
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

  onInit(): void {}
  onRender(): void {}
  onChanges(): void {}
  onDestroy(): void {}
}
```

### Lifecycle order

1. `onInit()` — before first render
2. Template is transpiled into DOM
3. `onRender()` — after first render, DOM available
4. `onChanges()` — on arg changes
5. `onDestroy()` — on removal

## Utilities

### transpile(source, entity, container, registry)

Low-level: parse and transpile an HTML string into a DOM node.

```ts
import { transpile } from 'kasper';

const node = transpile('<p>{{message}}</p>', { message: 'hello' });
document.body.appendChild(node);
```

### execute(source)

Parse an HTML template and return the KNode AST as JSON. Useful for debugging.

```ts
import { execute } from 'kasper';

console.log(execute('<p>{{x}}</p>'));
```
