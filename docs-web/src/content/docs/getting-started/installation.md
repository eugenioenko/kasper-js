---
title: Installation
description: How to install Kasper.js in your project.
---

## Scaffold a new project

The fastest way to get started is with the official scaffold tool:

```bash
npm create kasper-app my-project
cd my-project
npm install
npm run dev
```

This creates a new Vite project with the Kasper plugin configured and a working example component.

## Manual installation

Install the framework and Vite plugin:

```bash
npm install kasper-js
npm install -D vite-plugin-kasper
```

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import kasper from 'vite-plugin-kasper';

export default defineConfig({
  plugins: [kasper()],
});
```

Add a type declaration file so TypeScript recognises `.kasper` imports. Create `src/kasper.d.ts`:

```ts
declare module '*.kasper' {
  import type { Component } from 'kasper-js';
  type AnyComponent = new (...args: any[]) => Component;
  const exports: Record<string, AnyComponent>;
  export = exports;
}
```

## Requirements

- Node.js 18+
- Vite 5+
- TypeScript 5+ (recommended)
