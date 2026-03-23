---
title: Introduction
description: What is Kasper.js and why use it?
sidebar:
  order: 1
---

Kasper.js is a reactive component framework that runs from a single 16KB CDN file. Templates use standard HTML attributes. Components are classes with signals that clean up after themselves.

Kasper exists because building reactive UIs shouldn't require understanding a compiler, a scheduler, a virtual DOM reconciler, and a hook dependency system.

## Core ideas

**No build step required.** The core framework is a single CDN file. Signals, router, slots, and lazy loading all work directly in the browser. The Vite plugin adds the `.kasper` single-file component format — colocated `<template>`, `<script>`, and `<style>` — when you want it.

**HTML-first templates.** Directives are standard HTML attributes: `@if`, `@each`, `@on:click`. Write `@if` where you'd write `if`, `@each` where you'd write a loop. Templates are readable by anyone who knows HTML.

**Components that clean up after themselves.** Components are classes. `this.watch()`, `this.effect()`, and `this.computed()` all release automatically when the component is destroyed. No manual unsubscribe, no cleanup functions, no dependency arrays. The component lifecycle is the class lifecycle.

**Fine-grained signals.** When a signal changes, only the exact DOM nodes that depend on it update. No diffing, no full re-renders.

## When to use Kasper

- You want to add interactivity to an existing page without setting up a build config
- You've outgrown plain JS but a full framework feels like too much
- You're building with AI tools and want code that stays readable and easy to review

## When not to use Kasper

- You need SSR (Kasper is browser-only)
- You need a large ecosystem of third-party components
- You're building a simple static page (plain HTML is fine)
