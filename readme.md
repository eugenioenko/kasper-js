# Kasper.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

A lightweight component framework with fine-grained Signal-based reactivity and a Vite plugin for single-file components.

## Quick Start

```bash
npm create kasper-app my-project
cd my-project
npm install
npm run dev
```

## Installation

```bash
npm install kasper-js
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

## Single-File Components

```html
<!-- Counter.kasper -->
<template>
  <div>
    <h1>{{count.value}}</h1>
    <button @on:click="increment()">+</button>
  </div>
</template>

<script>
import { signal, Component } from 'kasper-js';

export class Counter extends Component {
  count = signal(0);
  increment() { this.count.value++; }
}
</script>

<style>
h1 { font-size: 3rem; }
</style>
```

```ts
// main.ts
import { App } from 'kasper-js';
import { Counter } from './Counter.kasper';

App({
  root: document.querySelector('#app'),
  entry: 'counter',
  registry: {
    counter: { component: Counter, nodes: [] },
  },
});
```

## Features

- **Signals** — fine-grained reactivity, surgical DOM updates, no virtual DOM
- **Single-file components** — `<template>`, `<script>`, `<style>` in one `.kasper` file
- **Template directives** — `@if`, `@each`, `@while`, `@let`, `@on`, `@attr`, `@ref`
- **Rich expression language** — arrow functions, pipeline operator, spread, optional chaining
- **Slots** — default and named content transclusion
- **Lifecycle hooks** — `onInit`, `onRender`, `onChanges`, `onDestroy`
- **TypeScript** — fully typed, declaration files included

## Signals

```ts
import { signal, computed, effect, batch } from 'kasper-js';

const count = signal(0);
const double = computed(() => count.value * 2);

effect(() => console.log(double.value)); // runs on every change

batch(() => {
  count.value++;
  count.value++;
}); // effect fires once
```

## Template Syntax

```html
<!-- Interpolation -->
<p>{{message}}</p>

<!-- Conditionals -->
<div @if="isLoggedIn">Welcome back!</div>
<div @else>Please log in.</div>

<!-- Lists -->
<ul>
  <li @each="item of items">{{item.name}}</li>
</ul>

<!-- Events -->
<button @on:click="handleClick()">Click me</button>
<button @on:click.prevent="submit()">Submit</button>

<!-- Dynamic attributes -->
<div @attr="{ class: isActive ? 'active' : '' }"></div>

<!-- Local variables -->
<div @let="total = price * qty">{{total}}</div>

<!-- DOM refs -->
<input @ref="inputEl" />
```

## Links

- [Playground](https://eugenioenko.github.io/kasper-js/playground/)
- [Documentation](https://eugenioenko.github.io/kasper-js/docs/)
- [Changelog](CHANGELOG.md)
