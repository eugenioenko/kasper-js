---
title: Signals & Reactivity
description: Fine-grained reactivity with signals, computed values, and effects.
---

Kasper's reactivity system is built on **Signals** — reactive primitives that track their dependencies automatically. Unlike frameworks that re-render entire components, Kasper uses signals to perform surgical updates directly to the specific text nodes or attributes that changed.

## signal()

A `signal` is a writable piece of state. In a component, you declare signals as class fields.

```html
<!-- Counter.kasper -->
<template>
  <div class="counter">
    <p>Count: {{count.value}}</p>
    <button @on:click="increment()">+</button>
  </div>
</template>

<script>
import { Component, signal } from 'kasper-js';

export class Counter extends Component {
  count = signal(0);

  increment() {
    this.count.value++;
  }
}
</script>
```

### peek()

Sometimes you want to read a signal's value without subscribing to it (so the effect doesn't re-run when the signal changes). Use `peek()`.

```ts
const val = this.count.peek();
```

## Component Reactivity (Auto-Cleaning)

Kasper provides built-in methods on the `Component` class that automatically clean up when the component is destroyed. This is the **recommended** way to use reactivity inside components.

### this.effect()

Creates a reactive effect tied to the component's lifecycle. It runs immediately and re-runs whenever any signal it "touches" changes.

```ts
onMount() {
  this.effect(() => {
    console.log('Syncing count:', this.count.value);
  });
}
```

### this.watch()

Watches a specific signal for changes. Unlike `effect()`, it does **not** run immediately and provides the previous value.

```ts
onMount() {
  this.watch(this.count, (newVal, oldVal) => {
    console.log(`Changed from ${oldVal} to ${newVal}`);
  });
}
```

### this.computed()

A `computed` signal is a derived value. When created via `this.computed()`, the internal effect is automatically stopped when the component dies.

```ts
export class Sidebar extends Component {
  isExpanded = this.computed(() => globalState.sidebarOpen.value);
}
```

## Global Reactivity (Manual Cleaning)

If you use `effect()` or `watch()` as standalone functions (without `this.`), they are not tied to any component lifecycle and **must be cleaned up manually** to prevent memory leaks.

```ts
import { effect, watch } from 'kasper-js';

// Returns a stop function
const stopEffect = effect(() => { ... });
const stopWatch = watch(sig, (n, o) => { ... });

// Later, you must call them manually
stopEffect();
stopWatch();
```

Use standalone reactivity for global state stores or logic that exists outside of the component tree.

## Reactivity Rules

1. **Reference Equality**: Signals use strict equality (`===`). Only reassigning the `.value` triggers an update.
2. **Immutability for Objects/Arrays**: Mutating a property inside an object or pushing to an array will **not** trigger reactivity. You must reassign the value.

```ts
// ✗ Won't trigger update
this.items.value.push(newItem);

// ✓ Will trigger update
this.items.value = [...this.items.value, newItem];
```