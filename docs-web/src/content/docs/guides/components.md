---
title: Components
description: Building reusable components with Kasper.js.
---

Every Kasper UI is built from components. A component is a TypeScript class that extends `Component` paired with an HTML template.

## Defining a component

```html
<!-- Greeting.kasper -->
<template>
  <div>
    <h1>Hello, {{name}}!</h1>
  </div>
</template>

<script>
import { Component } from 'kasper';

export class Greeting extends Component {
  name = 'World';
}
</script>
```

The class name (`Greeting`) is automatically picked up by the Vite plugin and attached as `Greeting.template`.

## Component args

Parent components pass data to children via `@:` attributes:

```html
<greeting @:name="'Kasper'"></greeting>
```

Inside the component, args are available on `this.args`:

```ts
export class Greeting extends Component {
  get name() {
    return this.args.name ?? 'World';
  }
}
```

Args are evaluated as expressions — you can pass signals, arrays, objects, or any value.

## Lifecycle hooks

```ts
export class MyComponent extends Component {
  onInit() {
    // Called before first render — set up state here
  }

  onRender() {
    // Called after first render — DOM is available
  }

  onChanges() {
    // Called when args change
  }

  onDestroy() {
    // Called when component is removed — clean up side effects
  }
}
```

## Registering components

Components must be registered before use. Pass them in the `registry` when bootstrapping:

```ts
import { App } from 'kasper';
import { Counter } from './Counter.kasper';
import { Greeting } from './Greeting.kasper';

App({
  root: document.querySelector('#app'),
  entry: 'app',
  registry: {
    counter: { component: Counter, nodes: [] },
    greeting: { component: Greeting, nodes: [] },
  },
});
```

The registry key is the HTML tag name used in templates.

## DOM reference

Access the component's root DOM element via `this.ref`:

```ts
onRender() {
  console.log(this.ref); // the root element
}
```

Use `@ref` to capture specific child elements:

```html
<input @ref="inputEl" type="text" />
```

```ts
export class MyForm extends Component {
  inputEl: HTMLInputElement;

  onRender() {
    this.inputEl.focus();
  }
}
```
