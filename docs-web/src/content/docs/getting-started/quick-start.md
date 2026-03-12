---
title: Quick Start
description: Build your first Kasper.js app in minutes.
---

This guide walks you through building a simple counter app from scratch.

## Project structure

```
src/
  components/
    Counter.kasper
  main.ts
index.html
vite.config.ts
```

## Create a component

Create `src/components/Counter.kasper`:

```html
<template>
  <div class="counter">
    <h1>{{count.value}}</h1>
    <button @on:click="decrement()">-</button>
    <button @on:click="increment()">+</button>
  </div>
</template>

<script>
import { signal, Component } from 'kasper-js';

export class Counter extends Component {
  count = signal(0);

  increment() { this.count.value++; }
  decrement() { this.count.value--; }
}
</script>

<style>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
h1 { font-size: 4rem; margin: 0; }
button { font-size: 1.5rem; width: 3rem; height: 3rem; cursor: pointer; }
</style>
```

## Bootstrap the app

Create `src/main.ts`:

```ts
import { App } from 'kasper-js';
import { Counter } from './components/Counter.kasper';

App({
  root: document.querySelector<HTMLElement>('#app')!,
  entry: 'counter',
  registry: {
    counter: { component: Counter, nodes: [] },
  },
});
```

## HTML entry point

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Kasper App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Run it

```bash
npm run dev
```

Open `http://localhost:5173` — you should see a counter that increments and decrements reactively.

## What just happened

- `signal(0)` creates a reactive value. When `.value` changes, any template binding that reads it updates automatically.
- `{{count.value}}` in the template creates a surgical text binding — only that text node re-renders when the signal changes.
- `@on:click="increment()"` attaches a native event listener that is automatically cleaned up when the component is destroyed.
- The `.kasper` file is transformed by `vite-plugin-kasper` into a regular TypeScript module with the template string attached to the class.
