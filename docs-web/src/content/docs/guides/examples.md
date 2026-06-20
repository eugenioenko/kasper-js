---
title: Examples
description: Live demo applications built with Kasper.js on StackBlitz.
---

The examples below run on StackBlitz and showcase real Kasper.js applications. **If the preview gets stuck on loading, refresh the browser tab** — StackBlitz requires a one-time Service Worker boot that occasionally needs a second load.

All examples use the `.kasper` single-file component format with `vite-plugin-kasper`.

[Open all examples on StackBlitz](https://stackblitz.com/github/eugenioenko/kasper-js/tree/main/demos)

---

## Counter

Basic signal usage with `signal()`, `computed()`, and `@on:click`. A good first component to read if you're new to Kasper.

**Showcases:** `signal`, `computed`, template interpolation `{{}}`, event handling.

---

## Todo App

Classic todo list with add, complete, and delete. Demonstrates `@each` over a signal array and conditional rendering with `@if`.

**Showcases:** `@each`, `@if`, `@else`, signal arrays, event handling.

---

## Kanban Board

Drag-and-drop task board with columns and cards. Multiple components communicating via shared signals and component args (`@:`).

**Showcases:** multi-component architecture, `@:` props, shared state, `@each` with `@key`.

---

## Product Catalog

Filterable product grid with a detail form. Shows list filtering via `computed` and a form bound to signals.

**Showcases:** `computed` for derived lists, form inputs, component slots.

---

## Shopping Cart

Product grid with a cart panel and running total. State lives in a shared store module (plain signal exports), consumed by two sibling components.

**Showcases:** external signal store, cross-component state, `computed` aggregation.

---

## Data Table

Sortable, paginated table over a dataset. All sort/page state is signals; the displayed rows are a `computed` slice.

**Showcases:** `computed` for derived data, `@each` with `@key`, stateful UI without a library.

---

## Signup Form

Multi-field form with validation. A `use-form.ts` helper manages field state and error signals.

**Showcases:** form validation pattern, reusable non-component logic, signal-per-field approach.

---

## Dashboard

Metrics panel that polls a simulated API and updates charts. Uses `onMount` / `onDestroy` for polling lifecycle and a shared metrics store.

**Showcases:** `onMount`, `onDestroy`, async data fetching, signal store.

---

## Toast Notifications

Global toast system triggered from anywhere in the app. The store exposes `push` / `dismiss` functions that mutate a signal array.

**Showcases:** global event-driven store, `@each` with `@key`, programmatic component interaction.

---

## Tree View

Recursive collapsible tree rendered from nested data. Each `TreeNode` renders its own children, demonstrating recursive component composition.

**Showcases:** recursive components, `@if`/`@each` nesting, tree data structures.

---

## Markdown Editor

Split-pane editor with live preview. The rendered HTML is a `computed` from the raw markdown signal.

**Showcases:** `computed` for transformations, `innerHTML` binding, two-pane layout.

---

## Wizard

Multi-step form with back/next navigation and per-step validation. Step index is a signal; each step is a separate component.

**Showcases:** step-based navigation, conditional component rendering, shared wizard state.

---

## Game of Life

Conway's Game of Life running in a Kasper component. The grid is a signal array updated on each tick via `setInterval` registered in `onMount`.

**Showcases:** `onMount`, `onDestroy` cleanup, high-frequency signal updates, `@each` grid rendering.

---

## Hex Explorer

Interactive hex color picker with live preview and history.

**Showcases:** input binding, `computed` color derivation, signal-backed history list.

---

## Pipeline Demo

Demonstrates the `|>` pipeline operator in template expressions, chaining transformation functions inline.

**Showcases:** pipeline operator `|>`, expression language depth, functional data transformations.
