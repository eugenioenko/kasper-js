---
title: Styling
description: Styling components with CSS and Tailwind CSS.
---

## The `<style>` block

Every `.kasper` file can include a `<style>` block. The styles are extracted at build time and injected as a `<style>` tag in `<head>`:

```html
<!-- Button.kasper -->
<template>
  <button class="btn">{{label}}</button>
</template>

<script>
import { Component } from 'kasper-js';

export class Button extends Component {
  get label() { return this.args.label ?? 'Click me'; }
}
</script>

<style>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background: #2563eb;
}
</style>
```

## Styles are global

Styles from `.kasper` files are **not scoped**. They are injected into `<head>` and apply to the entire page. This means class names can collide between components.

To avoid conflicts, prefix your classes with the component name:

```css
/* Instead of .title */
.user-card__title { ... }
.user-card__avatar { ... }
```

Or use [BEM](https://getbem.com/), a utility library, or Tailwind CSS.

## Global stylesheet

For base styles, resets, and shared utilities, import a regular CSS file in `main.ts`:

```ts
// main.ts
import './style.css';
import { App } from 'kasper-js';
```

```css
/* style.css */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
```

---

## Tailwind CSS

Kasper works with Tailwind CSS out of the box via Vite. No special configuration is needed to make Tailwind recognise `.kasper` files.

### Tailwind v4

Install the Vite plugin:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add it to `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import kasper from 'vite-plugin-kasper';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [kasper(), tailwindcss()],
});
```

Import Tailwind in your main stylesheet:

```css
/* src/style.css */
@import "tailwindcss";
```

```ts
// main.ts
import './style.css';
```

Tailwind v4 detects class names from all files the bundler processes — `.kasper` files are included automatically.

### Tailwind v3

Install Tailwind and its peer dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add `*.kasper` to the `content` array in `tailwind.config.js` so Tailwind scans your component files:

```js
// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,kasper}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Import Tailwind in your main stylesheet:

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// main.ts
import './style.css';
```

### Using Tailwind in components

With Tailwind set up, use utility classes directly in your templates:

```html
<template>
  <div class="p-4 rounded-lg bg-white shadow">
    <h2 class="text-xl font-semibold text-gray-800">{{title}}</h2>
    <p class="mt-2 text-gray-500">{{description}}</p>
    <button
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      @on:click="handleClick()"
    >
      {{label}}
    </button>
  </div>
</template>
```

The `<style>` block is still available for component-specific styles that don't map cleanly to utilities.
