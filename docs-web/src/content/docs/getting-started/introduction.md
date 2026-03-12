---
title: Introduction
description: What is Kasper.js and why use it?
---

Kasper.js is a lightweight component framework for building reactive web UIs. It sits between simple templating engines and full frameworks like Vue or React — small enough to understand completely, powerful enough for real applications.

## Core ideas

**Signals, not a virtual DOM.** Kasper uses fine-grained reactivity. When a signal changes, only the exact DOM nodes that depend on it update. No diffing, no full re-renders.

**Valid HTML templates.** Template directives are standard HTML attributes (`@if`, `@each`, `@on:click`). Your editor won't complain, and templates are readable without knowing the framework.

**Single-file components.** With the Vite plugin, you write `<template>`, `<script>`, and `<style>` in a single `.kasper` file — similar to Vue SFCs but without a compiler or build-time transform for most features.

**TypeScript first.** The framework is written in TypeScript and ships declaration files. You get full type checking and autocomplete out of the box.

## When to use Kasper

- You want Vue/Angular-like reactivity without the bundle size or build complexity
- You're building a medium-sized interactive UI and plain JS is getting unwieldy
- You want to learn how signals and template compilers work from the inside

## When not to use Kasper

- You need SSR — Kasper is browser-only
- You need a large ecosystem of third-party components
- You're building a very simple static page — plain HTML is fine
