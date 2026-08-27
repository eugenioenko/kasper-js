# Lazy Loading & Virtual Registry — Design Notes

## Context

This document captures a design discussion about lazy loading, virtual registry, and related vite plugin improvements for Kasper.js.

---

## Template-Only Components

Components with no script block. The vite plugin would detect the missing class, derive the class name from the filename, and generate a base `Component` subclass automatically.

```html
<!-- Button.kasper -->
<template>
  <button class="btn">{{args.label}}</button>
</template>
```

Plugin generates `export class Button extends Component {}` under the hood, attaches `.template`, done. No boilerplate required from the author.

---

## Virtual Registry

### Problem

Today, registration is manual and can go out of sync — delete a component, the registry still references it. The CLI/codegen approach (generating a static `registry.ts`) drifts over time.

### Solution

A `virtual:kasper-registry` Vite virtual module that is always derived at build time from what exists on disk. Delete a component, it disappears from the registry automatically.

```ts
// main.ts
import { registry } from 'virtual:kasper-registry';
import { App } from 'kasper-js';

App({
  root: document.body,
  entry: 'app',
  registry,
});
```

### Tag Name Convention

Class name → kebab-case:

- `MyButton` → `my-button`
- `UserCard` → `user-card`
- `NavBar` → `nav-bar`

For template-only components (no class), derive from filename instead.

Filename-based path nesting (Ember style) was explicitly rejected — `Account::View::List::Username` is unworkable.

### Tag Override

When the derived tag name is wrong, override on the template element:

```html
<template tag="my-custom-tag">
```

### Registry Entry Shape

```ts
registry: {
  'my-button': { component: MyButton }
}
```

The wrapper object `{ component }` is kept intentionally to allow future per-component options (e.g. `lazy`). Removing it later would be a breaking change.

---

## Lazy Loading

### Template Syntax

```html
<template lazy>
  <div class="chart">...</div>
</template>

<template fallback>
  <div class="skeleton chart-skeleton"></div>
</template>
```

- `<template lazy>` — marks the component for code splitting via dynamic import
- `<template fallback>` — optional UI rendered synchronously while the import resolves
- `<template tag="...">` — tag name override (composable with `lazy`)
- `<template lazy tag="heavy-chart">` — combined form

### How It Works

The vite plugin, during virtual module generation:
1. Reads both `<template lazy>` and `<template fallback>` blocks
2. Inlines the fallback template string directly in the registry entry (so it's available synchronously before the component loads)
3. Generates a dynamic import for the component class

```ts
// virtual:kasper-registry (generated)
export const registry = {
  'my-button': { component: MyButton },                        // eager
  'heavy-chart': {                                             // lazy
    component: () => import('./HeavyChart.kasper').then(m => m.HeavyChart),
    lazy: true,
    fallback: '<div class="skeleton chart-skeleton"></div>',   // inlined
  },
};
```

Vite automatically code-splits on dynamic imports — no extra configuration needed.

### Transpiler Mechanism

When mounting a lazy component:

1. Encounters `<heavy-chart>` in the DOM
2. Sees `lazy: true` in the registry
3. Renders `fallback` template synchronously inside the `<heavy-chart>` host element
4. Fires the dynamic import and **continues** with the rest of the tree synchronously (does not await)
5. When the Promise resolves: clears the host element contents, mounts the real component inside it

No DOM Boundary needed — the custom element tag itself (`<heavy-chart>`) is the natural container, the same as how eager components mount today. This is simpler than `@if`/`@each` which need boundaries because they have no host element.

### Why the Fallback Is Inlined in the Registry

`fallbackTemplate` would normally be attached to the class (e.g. `HeavyChart.fallbackTemplate`), but the class isn't loaded yet when the transpiler first encounters the tag. The virtual module must extract and inline it at build time so the transpiler has it synchronously.

---

## `<template once>` — Rejected

A `<template once>` flag to skip reactive setup for static components was considered and rejected.

If a component has no signals, effects run once during initial render, find no dependencies, and sit dormant. No subscriptions registered, never triggered again. The ongoing cost is essentially zero. `<template once>` would only save the memory of a few empty effect objects — not worth adding a user-facing concept for it.

---

## `<style scoped>` — Rejected

Scoped styles (generating unique attribute selectors per component) were considered and rejected. Modern projects either use Tailwind (no custom CSS) or BEM (naming discipline). The debugging experience with generated attribute selectors is poor. Not worth the complexity.

---

## Block Parsing

The vite plugin currently parses blocks with:

```ts
/<template>([\s\S]*?)<\/template>/
```

This needs to be updated to capture attributes on the template tag:

```ts
/<template([^>]*)>([\s\S]*?)<\/template>/g
```

The first capture group contains any attributes (`lazy`, `fallback`, `tag="..."`), the second is the template content.

---

## Comparison to Ember

Ember's lazy loading took years because:
1. The resolver required all module names upfront at boot — a component not in the registry can't be resolved
2. The build system (Broccoli/Ember CLI) predated sophisticated code splitting — required a full switch to Embroider (Webpack-based)
3. No natural place to declare laziness — tag name comes from the filename, template is a separate file, class is another file

Kasper's single-file format solves this by accident. `<template lazy>` is natural because the template block already owns rendering behavior. Everything about how the component renders lives in one file.

---

## Open Questions

- Should `virtual:kasper-registry` be opt-in (via vite config) or the default?
- Does the transpiler need a new async component mounting path, or can it fire-and-forget the dynamic import and handle the swap in a Promise continuation?
- Should the entry component be excluded from auto-registration (it stays explicit in `App()` config)?
