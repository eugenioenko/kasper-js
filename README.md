# Kasper.js 👻

[![npm](https://img.shields.io/npm/v/kasper-js)](https://www.npmjs.com/package/kasper-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build & Test](https://github.com/eugenioenko/kasper-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/eugenioenko/kasper-js/actions)

A signal, a class, and an HTML template. That's all you need, whether you're writing the code yourself or working with an AI agent.

- **[Documentation](https://kasperjs.top)**
- **[Live Demos](https://stackblitz.com/github/eugenioenko/kasper-js/tree/main/demos)**
- **[LLM AI Agent Documentation](https://kasperjs.top/llms.txt)**

---

## Why Kasper.js

Kasper exists because building reactive UIs shouldn't require understanding a compiler, a scheduler, a virtual DOM reconciler, and a hook dependency system.

**No build step required.** Drop a 16KB script tag and you have a complete reactive component framework — signals, router, slots, lazy loading, the works. The only thing a build pipeline adds is the `.kasper` single-file component format, which needs the Vite plugin to transform. Everything else runs directly in the browser.

**Templates that read like HTML.** Kasper directives are standard HTML attributes: `@if`, `@each`, `@on:click`. Write `@if` where you'd write `if`, `@each` where you'd write a loop. Any template is readable by anyone who knows HTML, with no framework knowledge required. The expression evaluator is a custom recursive-descent parser, not `eval` and not `new Function`, so it works under strict Content Security Policies too.

**Components that clean up after themselves.** A component is a class. `this.watch()`, `this.effect()`, and `this.computed()` are all released automatically when the component is destroyed, via a single `AbortController` the class owns. No dependency arrays. No `return () => unsubscribe()`. No stale closure warnings. The component lifecycle is the class lifecycle.

Under 4000 lines of TypeScript. 95% test coverage. Zero runtime dependencies. Built to stay that way.

---

## Quick Start

**Option 1: Script tag, no build step.**

```html
<!DOCTYPE html>
<html>
<body>
  <counter></counter>
  <script type="module">
    import { App, Component, signal } from 'https://cdn.jsdelivr.net/npm/kasper-js/dist/kasper.min.js';

    class Counter extends Component {
      count = signal(0);
    }

    Counter.template = `
      <div>
        <p>Count: {{count.value}}</p>
        <button @on:click="count.value++">+</button>
      </div>
    `;

    App({ root: document.body, entry: 'counter', registry: { counter: { component: Counter } } });
  </script>
</body>
</html>
```

**Option 2: Vite project with single-file components.**

```bash
npm create kasper-app@latest my-project
cd my-project
npm install
npm run dev
```

---

## What it looks like

With the Vite plugin, using single-file components:

```html
<!-- Counter.kasper -->
<template>
  <div class="counter">
    <p>Count: <strong>{{count.value}}</strong></p>
    <p>Double: {{double.value}}</p>
    <button @on:click="increment()">+</button>
    <button @on:click="reset()">Reset</button>
  </div>
</template>

<script>
import { Component, signal, computed } from 'kasper-js';

export class Counter extends Component {
  count = signal(0);
  double = computed(() => this.count.value * 2);

  increment() { this.count.value++; }
  reset() { this.count.value = 0; }
}
</script>

<style>
.counter { font-family: sans-serif; text-align: center; }
</style>
```

```ts
// main.ts
import { App } from 'kasper-js';
import { Counter } from './Counter.kasper';

App({
  root: document.body,
  entry: 'counter',
  registry: { counter: { component: Counter } },
});
```

---

## Features

- **No build step** — runs from a CDN import or a local dist file. Signals, router, slots, and lazy loading all work without a bundler. The only thing a build adds is the `.kasper` single-file component format.
- **HTML-first templates** — directives are standard HTML attributes: `@if`, `@elseif`, `@else`, `@each`, `@let`, `@on:event`, `@attr`, `@class`, `@style`, `@ref`. Structural directives use DOM boundaries — lightweight comment-node bookmarks that surgically replace only their own content when dependencies change.
- **Automatic cleanup** — components are classes. `this.watch()`, `this.effect()`, and `this.computed()` are all released automatically when the component is destroyed via a shared `AbortController`. No dependency arrays, no manual unsubscribe.
- **Fine-grained signals** — `signal()`, `computed()`, `effect()`, `batch()`, `peek()`. Reactivity is tracked at the binding level, not the component level. When a signal changes, Kasper updates only the specific DOM text nodes, attributes, and structural boundaries that depend on it. Siblings, parent elements, and unrelated components are untouched.
- **Event modifiers** — `@on:submit.prevent`, `@on:click.stop`, `@on:click.once`, `@on:scroll.passive`, `@on:click.capture`. All `@on:` listeners are registered via the component's `AbortController` and removed automatically on destroy.
- **Client-side router** — built-in `<router>`, `<route>`, `<guard>` components. Supports static paths, dynamic `:param` segments, catch-all `*` routes, per-route guards, and `<guard>` groups for protecting multiple routes under a single async check. Routes are declared in the template, no configuration object needed.
- **Slots** — default and named content transclusion via `<slot />` and `@slot`. Named slots use `@name` / `@slot` for attribute consistency across the framework.
- **Lifecycle hooks** — `onMount`, `onRender`, `onChanges`, `onDestroy` with clear execution ordering. `onMount` fires once after the first render with the DOM ready and `args` populated. `onRender` fires after every render cycle. `onChanges` fires before each reactive re-render, not on first mount.
- **State management** — global signals as plain ES modules. No store class, no reducers, no context API, no provider tree. Import a signal from any file; any component that reads it in its template will update automatically.
- **Single-file components (optional)** — with the Vite plugin, write `<template>`, `<script>`, and `<style>` in one `.kasper` file. Imports in the script block are hoisted into template scope via `$imports` automatically.
- **Expression language** — custom recursive-descent parser supporting arrow functions, ternary, optional chaining, nullish coalescing, pipeline operator (`|>`), spread, array/object literals, and method calls. No `eval`, no `new Function`, compatible with strict Content Security Policies.
- **TypeScript** — fully typed throughout. Declaration files generated separately. `.kasper` files typed via ambient module declaration.
- **Zero dependencies** — no runtime dependencies. Ships as a single ES module.

---

## Architecture

```
HTML string
  → TemplateParser     (HTML → KNode AST)
  → Transpiler         (KNode AST → live DOM)
    → ExpressionParser (directive values → expression AST)
    → Interpreter      (expression AST → JS values, tracked via Scope)
    → Signal bindings  (effect() per DOM node, surgical updates)
```

**Scope chain** — each component creates a `Scope` that resolves names first against the component instance, then against `$imports` (module-level imports collected by the Vite plugin), then against `window`. Nested directives (`@each`, `@let`) push child scopes onto this chain, giving iteration variables and local bindings proper lexical visibility.

**DOM Boundaries** — structural directives (`@if`, `@each`) do not wrap their content in extra elements. Instead, they insert paired comment nodes as bookmarks. When a condition or list changes, only the nodes between the boundary markers are destroyed and recreated. Adjacent nodes are never touched.

**Component rendering** — the transpiler resolves custom element tag names against the registry, instantiates the component class, injects a `$render` closure for manual re-render support, sets up the scope chain, and renders the component's template nodes into the element. Each component gets its own `AbortController` for event cleanup.

**Router** — `<router>` is a built-in component auto-registered at startup. `<route>` and `<guard>` are config nodes — the transpiler's `extractRoutes()` walks their KNode children to build a `RouteConfig[]` at parse time, never rendering the config nodes themselves. On navigation, the router evaluates any async guard, destroys the previous mounted component, and mounts the matched component into its container using `mountComponent()`.

---

## Signals

```ts
import { signal, computed, effect, watch, batch } from 'kasper-js';

const count = signal(0);
const double = computed(() => count.value * 2);

// effect runs immediately and re-runs whenever count changes
const stopEffect = effect(() => console.log(`double is ${double.value}`));

// watch runs only on change and provides old value
const stopWatch = watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`);
});

// batch defers effect flushes until the callback returns
batch(() => {
  count.value++;
  count.value++;
}); // effect fires once, not twice

stopEffect(); // unsubscribe
stopWatch(); // unsubscribe

// peek() reads the current value without registering a dependency
const current = count.peek();

// Signals use reference equality — only reassignment triggers reactivity
// Arrays: reassign, never mutate in-place
items.value = [...items.value, newItem]; // triggers ✓
items.value.push(newItem);               // does NOT trigger ✗

// Objects: same rule — mutating a nested property does NOT trigger
user.value = { ...user.value, name: 'Alice' }; // triggers ✓
user.value.name = 'Alice';                     // does NOT trigger ✗
```

Signals declared as component fields are garbage-collected when the component is destroyed. Effects created with `effect()` return a stop function — call it in `onDestroy` if you create one outside the framework's tracking. Template bindings are cleaned up automatically.

---

## Template Syntax

### Interpolation

```html
<!-- Only the text node updates when its signal dependencies change -->
<p>Hello, {{user.name ?? 'Anonymous'}}!</p>
<p>Total: {{price.value * qty.value}}</p>
```

### Conditionals

```html
<div @if="session.isAdmin.value">Admin panel</div>
<div @elseif="session.isLoggedIn.value">Dashboard</div>
<div @else>Please log in</div>
```

Boundaries — not wrapper elements — delimit conditional DOM. When the signal changes, only the content between boundary markers is replaced.

### Lists

```html
<!-- Basic iteration -->
<ul>
  <li @each="item of items.value">{{item.name}}</li>
</ul>

<!-- With index -->
<ul>
  <li @each="item with i of items.value">{{i + 1}}. {{item.name}}</li>
</ul>
```

### Events and modifiers

```html
<button @on:click="increment()">+</button>
<input @on:input="search($event)" />
<form @on:submit.prevent="submit()">...</form>
<button @on:click.stop.once="handleOnce()">...</button>
<input @on:keydown.enter="addTodo()" />
<button @on:click.ctrl="specialAction()">...</button>
```

Available modifiers:
- **Event:** `.prevent`, `.stop`, `.once`, `.passive`, `.capture`
- **Keyboard:** `.enter`, `.escape`, `.tab`, `.space`, `.up`, `.down`, `.left`, `.right`, `.delete`, `.backspace`, etc.
- **System:** `.ctrl`, `.shift`, `.alt`, `.meta`

### Dynamic attributes

```html
<!-- Object merge — class and style are deeply merged with static values -->
<div class="btn" @attr="{ class: isPrimary ? 'btn-primary' : 'btn-secondary', disabled: isLoading }"></div>

<!-- Shorthand -->
<div @class="isActive ? 'active' : ''"></div>
<div @style="{ color: textColor, opacity: isVisible ? 1 : 0 }"></div>
```

### Local variables and refs

```html
<!-- @let scopes the variable to the element and its children -->
<div @let="discount = price.value * 0.1">
  <p>You save: {{discount}}</p>
  <p>Total: {{price.value - discount}}</p>
</div>

<!-- @ref captures the element into a component property -->
<input @ref="inputEl" type="text" />
```

### Pipeline operator

```html
<!-- Custom functional pipelines without intermediate variables -->
<p>{{items.value |> filter(x => x.active) |> length}}</p>
```

---

## Components

### Single-file format

```html
<!-- UserCard.kasper -->
<template>
  <div class="user-card">
    <img :src="avatar" @attr="{ alt: name }" />
    <h2>{{name}}</h2>
    <p @if="bio">{{bio}}</p>
    <p @else class="muted">No bio provided.</p>
  </div>
</template>

<script>
import { Component } from 'kasper-js';

export class UserCard extends Component {
  get name()   { return this.args.name   ?? 'Unknown'; }
  get avatar() { return this.args.avatar ?? '/default.png'; }
  get bio()    { return this.args.bio    ?? null; }
}
</script>
```

### Passing args

```html
<!-- @: passes any expression — signal, object, function, or literal -->
<user-card
  @:name="currentUser.value.name"
  @:avatar="currentUser.value.avatarUrl"
  @:bio="currentUser.value.bio"
></user-card>
```

Args are evaluated as full expressions and passed by reference. Signals passed as args remain reactive inside the child.

> **Note:** `@:onClick="add(item)"` evaluates `add(item)` immediately during render and passes its return value as the prop. This is intentional — it supports patterns like factory functions that return a handler. If `add(item)` returns a function, that function becomes the click handler. If it returns `undefined` (a void function), the prop receives `undefined` and the click does nothing. When the called function has reactive side effects that write to a signal it also reads, this creates an infinite reactive loop. In development mode, Kasper warns when a call expression is detected in an `on*` prop binding as a reminder.
>
> ```html
> <!-- add(item) is called during render — if it returns a function, that's the handler -->
> <my-btn @:onClick="add(item)"></my-btn>
>
> <!-- pass a method reference directly (no args) -->
> <my-btn @:onClick="add"></my-btn>
>
> <!-- for parameterized handlers on native elements, use @on:click -->
> <button @on:click="add(item)">Add</button>
> ```

### Registration

```ts
App({
  root: document.body,
  entry: 'app',
  registry: {
    'user-card':   { component: UserCard },
    'product-list': { component: ProductList },
    'nav-bar':     { component: NavBar },
  },
});
```

---

## Lifecycle

```ts
export class DataTable extends Component {
  rows    = signal<Row[]>([]);
  loading = signal(true);
  error   = signal<string | null>(null);

  async onMount() {
    // Fires once after first render. DOM is ready, args are populated.
    // Use for data fetching, timers, third-party lib init, focus management.
    try {
      this.rows.value = await fetchRows(this.args.endpoint);
    } catch (e) {
      this.error.value = String(e);
    } finally {
      this.loading.value = false;
    }
  }

  onRender() {
    // Fires after every render cycle — after onMount on first render, then after each reactive update.
    // Use for things that must run on each update: scroll sync, external state.
    // Do not use for one-time setup — that belongs in onMount.
    console.log('table rendered, rows:', this.rows.value.length);
  }

  onChanges() {
    // Fires before each reactive re-render (not on first mount).
    // Use for logging, derived non-signal state, or gating updates.
    console.log('table data changed, rows:', this.rows.value.length);
  }

  onDestroy() {
    // Fires when removed from DOM.
    // @on: listeners are cleaned up automatically via AbortController.
    // this.watch() and this.effect subscriptions are released automatically.
    // Manual timers, WebSocket connections, etc. go here.
  }
}
```

### Lifecycle order

**First mount:**
```
new ComponentClass()   ← constructor runs here if needed
  └─ template rendered into DOM
  └─ onMount()         ← DOM ready, args populated, runs once
  └─ onRender()        ← also fires here, and on every subsequent update
```

**Reactive update:**
```
signal.value changes
  └─ onChanges()
  └─ affected bindings updated surgically
  └─ onRender()
```

**Destroy:**
```
parent @if / @each removes the component
  └─ onDestroy()
  └─ @on: listeners aborted (AbortController)
  └─ this.effect() / this.watch() / this.computed() stopped
  └─ reactive effects stopped
```

### Manual rendering

For cases where imperative re-rendering is preferable to signal-driven updates (e.g., integrating with non-reactive data or third-party libraries):

```ts
export class Clock extends Component {
  time = new Date().toLocaleTimeString();

  onMount() {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString();
      this.render(); // tears down and rebuilds the component's template
    }, 1000);
  }
}
```

`render()` is a full teardown and rebuild — prefer signals for normal reactivity.

---

## Routing

```html
<!-- App.kasper -->
<template>
  <nav-bar></nav-bar>

  <router>
    <route @path="/"         @component="HomePage" />
    <route @path="/about"    @component="AboutPage" />
    <route @path="/users/:id" @component="UserPage" />
    <route @path="/login"    @component="LoginPage" />

    <guard @check="checkAuth">
      <route @path="/dashboard" @component="DashboardPage" />
      <route @path="/settings"  @component="SettingsPage" />

      <guard @check="checkAdmin">
        <route @path="/admin" @component="AdminPage" />
      </guard>
    </guard>

    <route @path="*" @component="NotFound" />
  </router>
</template>

<script>
import { Component } from 'kasper-js';
import { HomePage, AboutPage, UserPage, LoginPage,
         DashboardPage, SettingsPage, AdminPage, NotFound } from './pages';
import { checkAuth, checkAdmin } from './guards';

export class App extends Component {}
</script>
```

### Navigation

```ts
import { navigate } from 'kasper-js';

navigate('/dashboard');
navigate('/users/42');
```

`navigate` uses the History API (`pushState`) — URLs are clean, no hash routing.

### Route params

Dynamic segments are passed to the component via `this.args.params`:

```ts
export class UserPage extends Component {
  user = signal<User | null>(null);

  async onMount() {
    const { id } = this.args.params;
    this.user.value = await fetchUser(id);
  }
}
```

```html
<template>
  <div @if="user.value">
    <h1>{{user.value.name}}</h1>
  </div>
</template>
```

### Guards

Guards are async functions that return `Promise<boolean>`. A `false` return blocks the route. The guard is responsible for redirecting:

```ts
import { navigate } from 'kasper-js';

export async function checkAuth(): Promise<boolean> {
  const user = await fetchCurrentUser();
  if (!user) {
    navigate('/login');
    return false;
  }
  return true;
}

export async function checkAdmin(): Promise<boolean> {
  const user = await fetchCurrentUser();
  if (!user?.isAdmin) {
    navigate('/dashboard');
    return false;
  }
  return true;
}
```

`<guard @check="checkAdmin">` applies the guard to all child routes. Guards can be nested for layered permission levels.

---

## State Management

Signals are plain objects — define them at module scope and import them anywhere. No store class, no reducers, no dispatch.

```ts
// src/store/cart.ts
import { signal, computed } from 'kasper-js';

export const cartItems  = signal<CartItem[]>([]);
export const cartCount  = computed(() => cartItems.value.length);
export const cartTotal  = computed(() => cartItems.value.reduce((sum, i) => sum + i.price, 0));

export function addItem(item: CartItem) {
  cartItems.value = [...cartItems.value, item];
}

export function removeItem(id: string) {
  cartItems.value = cartItems.value.filter(i => i.id !== id);
}
```

Any component that reads a global signal in its template updates automatically — no prop drilling, no context API:

```ts
// CartBadge.kasper
import { Component } from 'kasper-js';
import { cartCount } from '../store/cart';

export class CartBadge extends Component {
  count = cartCount;  // template reads count.value directly
}
```

```ts
// ProductCard.kasper
import { Component } from 'kasper-js';
import { addItem } from '../store/cart';

export class ProductCard extends Component {
  add() {
    addItem({ id: this.args.id, name: this.args.name, price: this.args.price });
  }
}
```

### Subscribing to external signals

Use `this.watch()` to subscribe to an external signal inside a component. The subscription is released automatically when the component is destroyed — no `onDestroy` cleanup needed:

```ts
export class Navbar extends Component {
  onMount() {
    this.watch(currentUser, (user) => {
      console.log('session changed', user);
    });
  }
}
```

Calling `onChange` directly on a global signal inside a component works but leaks — the subscription outlives the component. `this.watch()` is always preferred inside components.

---

## Slots

```html
<!-- Modal.kasper -->
<template>
  <div class="modal" role="dialog">
    <header class="modal-header">
      <slot @name="title" />
    </header>
    <main class="modal-body">
      <slot />
    </main>
    <footer class="modal-footer">
      <slot @name="actions" />
    </footer>
  </div>
</template>
```

```html
<modal>
  <h2 @slot="title">Confirm deletion</h2>
  <p>This action cannot be undone. All associated data will be permanently removed.</p>
  <div @slot="actions">
    <button @on:click="cancel()" class="btn-secondary">Cancel</button>
    <button @on:click="confirm()" class="btn-danger">Delete</button>
  </div>
</modal>
```

Content without a `@slot` attribute goes to the default slot. Named slots use `@name` (in the child template) and `@slot` (on the slotted element) — consistent with the `@` prefix convention used across all framework attributes.

---

## Vite Integration

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

The plugin transforms a `.kasper` file into a standard TypeScript module:

1. Extracts the `<template>` block and assigns it as `ClassName.template = "..."`
2. Collects all imported names from the `<script>` block (`import { X } from '...'`, default and namespace imports included) and assigns them as `ClassName.$imports = { X, Y, Z }`
3. Passes the `<script>` block through esbuild as TypeScript
4. Injects `<style>` as a self-executing style tag into `<head>`

At runtime, the scope resolver checks `$imports` as a fallback when a name is not found on the component instance — making imported helper functions, utility classes, and constants available directly in template expressions without re-declaring them as class fields.

### TypeScript declarations

```ts
// src/kasper.d.ts
declare module '*.kasper' {
  import type { Component } from 'kasper-js';
  type AnyComponent = new (...args: any[]) => Component;
  const exports: Record<string, AnyComponent>;
  export = exports;
}
```

### Imports in templates

```html
<template>
  <p>{{formatDate(createdAt.value)}}</p>
  <user-card @:user="currentUser.value" />
</template>

<script>
import { Component, signal } from 'kasper-js';
import { UserCard } from './UserCard.kasper';
import { formatDate } from '../utils/date';
import { currentUser } from '../store/user';

export class ProfilePage extends Component {
  createdAt = signal(new Date());
}
</script>
```

`formatDate`, `UserCard`, and `currentUser` are module-level imports — the plugin makes them available in the template automatically via `$imports`.

---

## Testing

Kasper has **600+ tests across 17 spec files**, all passing. Tests run directly against `src/` — no build step required. Coverage is measured with V8's native instrumentor via Vitest.


**Coverage:**

| Metric     | Coverage |
|------------|----------|
| Statements | 95.33%   |
| Branches   | 88.41%   |
| Functions  | 97.46%   |
| Lines      | 96.18%   |

All core modules — `boundary.ts`, `scope.ts`, `utils.ts`, `viewer.ts` — are at 100% statement and line coverage. The branch gap in `transpiler.ts` covers defensive guards for malformed templates that are intentionally unreachable in the normal execution path.

```bash
pnpm test           # single run
pnpm test:watch     # watch mode
pnpm test --coverage  # with V8 coverage report
```

---

## Installation

```bash
npm install kasper-js
npm install -D vite-plugin-kasper
```

### Bootstrapping

```ts
import { App } from 'kasper-js';
import { MyApp } from './App.kasper';

App({
  root: document.body,
  entry: 'my-app',
  registry: {
    'my-app': { component: MyApp },
  },
  mode: import.meta.env.MODE as any,
});
```

---

## License

MIT © [eugenioenko](https://github.com/eugenioenko)
