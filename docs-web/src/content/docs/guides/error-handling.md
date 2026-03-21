---
title: Error Handling
description: Catching and reporting render errors with component and global error handlers.
sidebar:
  order: 10
---

By default, errors that occur during a reactive update (signal change triggering a re-render) are caught by the framework to prevent a single component from crashing the whole app. Without error handlers configured those errors are only logged to the console — your application code never sees them.

Kasper provides two levels of error handling: a **component-level `onError` hook** and a **global `onError` handler** on the app config.

## Global error handler

Pass `onError` to `App()` to intercept all unhandled render and watcher errors. Use this for error reporting services like Sentry:

```ts
import { App } from 'kasper-js';
import { AppRoot } from './components/AppRoot.kasper';

App({
  root: document.body,
  entry: 'app-root',
  registry: {
    'app-root': { component: AppRoot },
  },
  onError(error, { component, phase }) {
    console.error(`[${phase}] in`, component?.constructor?.name, error);
    // e.g. Sentry.captureException(error, { extra: { phase } });
  },
});
```

`phase` is either `'render'` (reactive DOM update) or `'watcher'` (a `watch()` callback threw).

## Component-level `onError`

Define `onError` on any component to handle errors locally — for example to show a fallback UI instead of leaving a broken element on screen:

```html
<!-- SafeWidget.kasper -->
<template>
  <div @if="!hasError.value">
    {{ riskyValue |> expensiveFormat }}
  </div>
  <div @else class="error-fallback">
    Something went wrong.
  </div>
</template>

<script>
import { Component, signal } from 'kasper-js';

export class SafeWidget extends Component {
  hasError = signal(false);

  onError(error, phase) {
    this.hasError.value = true;
    // optionally re-throw to also reach the global handler:
    // throw error;
  }
}
</script>
```

If `onError` handles the error (does not re-throw), the global handler is **not** called. Re-throw if you want both — local recovery AND global reporting.

## Error propagation order

```
Error during render / watcher
  │
  ├─ component.onError defined?
  │    ├─ yes → call it
  │    │    ├─ returns normally → done (global handler skipped)
  │    │    └─ throws → fall through with original error
  │    └─ no → fall through
  │
  ├─ global onError configured?
  │    ├─ yes → call it → done
  │    └─ no → fall through
  │
  └─ console.error (final fallback)
```

## TypeScript

`ErrorHandlerFn` is exported for typing the global handler:

```ts
import type { ErrorHandlerFn } from 'kasper-js';

const handler: ErrorHandlerFn = (error, { component, phase }) => {
  // ...
};
```

## What is and isn't caught

| Scenario | Caught |
|---|---|
| Error in template expression during reactive update | ✓ |
| Error in a `watch()` callback | ✓ |
| Error thrown during initial mount (`App()`) | ✗ — propagates to caller |
| Error in `onMount` / `onDestroy` | ✗ — propagates normally |
