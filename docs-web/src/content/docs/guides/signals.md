---
title: Signals & Reactivity
description: Fine-grained reactivity with signals, computed values, and effects.
---

Kasper's reactivity system is built on signals — reactive primitives that track their dependencies automatically. When a signal changes, only the parts of the DOM that depend on it update.

## signal()

```ts
import { signal } from 'kasper';

const count = signal(0);

count.value;      // read
count.value = 5;  // write
count.peek();     // read without tracking
```

## computed()

Derived signals that update automatically when their dependencies change:

```ts
import { signal, computed } from 'kasper';

const count = signal(0);
const double = computed(() => count.value * 2);

console.log(double.value); // 0
count.value = 5;
console.log(double.value); // 10
```

## effect()

Runs a function whenever its signal dependencies change:

```ts
import { signal, effect } from 'kasper';

const name = signal('Alice');

const stop = effect(() => {
  console.log(`Hello, ${name.value}`);
});
// logs: "Hello, Alice"

name.value = 'Bob';
// logs: "Hello, Bob"

stop(); // unsubscribe
```

## batch()

Group multiple signal writes into a single effect flush:

```ts
import { signal, effect, batch } from 'kasper';

const a = signal(0);
const b = signal(0);

effect(() => console.log(a.value + b.value));

batch(() => {
  a.value = 1;
  b.value = 2;
});
// effect fires once, not twice
```

## onChange()

Watch a specific signal for changes, receiving the old and new values:

```ts
const count = signal(0);

const stop = count.onChange((newVal, oldVal) => {
  console.log(`changed from ${oldVal} to ${newVal}`);
});

count.value = 5; // logs: "changed from 0 to 5"

stop(); // unsubscribe
```

## Signals in components

Declare signals as class fields:

```ts
import { signal, computed, Component } from 'kasper';

export class Counter extends Component {
  count = signal(0);
  double = computed(() => this.count.value * 2);

  increment() {
    this.count.value++;
  }

  onDestroy() {
    // effects created with effect() should be stopped here
    // signals owned by the component are garbage collected automatically
  }
}
```

## Cleanup

Signals and computed values owned by a component are garbage collected when the component is destroyed. Effects created with `effect()` return a stop function — call it in `onDestroy` to avoid leaks:

```ts
export class Timer extends Component {
  private stopEffect: () => void;

  onInit() {
    this.stopEffect = effect(() => {
      // some side effect
    });
  }

  onDestroy() {
    this.stopEffect();
  }
}
```
