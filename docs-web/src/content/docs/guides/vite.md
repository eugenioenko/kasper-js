---
title: Vite Integration
description: Using Kasper.js with Vite and single-file components.
---

`vite-plugin-kasper` transforms `.kasper` single-file components at build time.

## Setup

```bash
npm install -D vite-plugin-kasper
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import kasper from 'vite-plugin-kasper';

export default defineConfig({
  plugins: [kasper()],
});
```

## SFC format

A `.kasper` file has three optional sections:

```html
<template>
  <!-- HTML template -->
</template>

<script>
// TypeScript class
export class MyComponent extends Component { ... }
</script>

<style>
/* CSS — injected globally into <head> */
</style>
```

### Rules

- One component per file
- The class must be a named `export class` — the name is used to attach the template
- The `<script>` block is always treated as TypeScript
- Styles are injected as a `<style>` tag in `<head>` — not scoped

## Importing components

```ts
import { Counter } from './Counter.kasper';
import { Greeting } from './Greeting.kasper';
```

## TypeScript declarations

Add `src/kasper.d.ts` so TypeScript recognises `.kasper` imports:

```ts
declare module '*.kasper' {
  import type { Component } from 'kasper';
  type AnyComponent = new (...args: any[]) => Component;
  const exports: Record<string, AnyComponent>;
  export = exports;
}
```

## How it works

The plugin transforms a `.kasper` file into a TypeScript module:

1. Extracts the `<template>` block and assigns it as `ClassName.template = "..."`
2. Passes the `<script>` block through esbuild as TypeScript
3. Injects `<style>` as a self-executing style tag

The output is a standard ES module — no runtime overhead, no custom loader.
