---
title: Lazy Loading
description: Defer component loading with dynamic imports and optional fallback UI.
sidebar:
  order: 8
---

Lazy loading defers a component's JavaScript until it is first needed. This keeps the initial bundle small and is useful for heavy components, rarely-visited sections, or anything that isn't needed on first paint.

## Basic usage

Instead of a direct class reference, provide a function that returns a dynamic import, and set `lazy: true`:

```ts
// main.ts
import { App } from 'kasper-js';
import { AppShell } from './components/AppShell.kasper';

App({
  root: document.body,
  entry: 'app-shell',
  registry: {
    'app-shell': { component: AppShell },
    'heavy-chart': {
      component: () => import('./components/HeavyChart.kasper').then(m => m.HeavyChart),
      lazy: true,
    },
  },
});
```

The component is downloaded the first time `<heavy-chart>` appears in a rendered template. Subsequent uses on the same page reuse the already-loaded class.

## Fallback UI

Pass a `fallback` component to show synchronously while the real component is loading:

```ts
import { Skeleton } from './components/Skeleton.kasper';

registry: {
  'heavy-chart': {
    component: () => import('./components/HeavyChart.kasper').then(m => m.HeavyChart),
    lazy: true,
    fallback: Skeleton,
  },
}
```

`Skeleton` mounts immediately. Once the import resolves, it is replaced by `HeavyChart`.

A skeleton component is a regular Kasper component — it can use signals and lifecycle hooks:

```html
<!-- Skeleton.kasper -->
<template>
  <div class="skeleton-box"></div>
</template>

<script>
import { Component } from 'kasper-js';
export class Skeleton extends Component {}
</script>

<style>
.skeleton-box {
  height: 200px;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

## How it works

- The import promise is **deduplicated** — if the same lazy component appears multiple times on a page, the module is only fetched once.
- After the first load the registry entry is **converted to eager** — subsequent mounts skip the async path entirely and render synchronously.
- Args passed to the lazy tag are forwarded to the real component once it loads.
- The fallback does not receive args.

## Registry shape

```ts
interface RegistryEntry {
  component: ComponentClass | (() => Promise<ComponentClass>);
  lazy?: boolean;
  fallback?: ComponentClass;
}
```
