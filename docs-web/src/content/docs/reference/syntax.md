---
title: Syntax Reference
description: Full template and expression syntax reference for Kasper.js.
---


Kasper templates are valid HTML extended with `{{ }}` interpolation and `@`-prefixed directives. All directives are standard HTML attributes — no special parser or build step required.

---

## Table of Contents

1. [Interpolation](#interpolation)
2. [Directives](#directives)
   - [@if / @elseif / @else](#if--elseif--else)
   - [@each](#each)
   - [@let](#let)   - [@on:event](#onevent)
   - [@attr (dynamic attributes)](#attr-dynamic-attributes)
   - [@class](#class)
   - [@style](#style)
   - [@ref](#ref)
3. [Void elements](#void-elements)
4. [Components](#components)
   - [@: (argument passing)](#-argument-passing) — Kasper's convention for passing values to child components
   - [Slots](#slots)
5. [Expression Language](#expression-language)
   - [Pipeline operator](#pipeline-operator)
   - [Spread](#spread)
   - [Arrow functions](#arrow-functions)
6. [Signals](#signals)
7. [Component Class](#component-class)
8. [App Bootstrap](#app-bootstrap)

---

## Interpolation

```html
<p>Hello, {{name}}!</p>
<p>{{count.value * 2}}</p>
<p>{{user.firstName + ' ' + user.lastName}}</p>
```

`{{ expr }}` evaluates the expression and renders the result as text. The binding is **surgical** — only the text node updates when the expression's signals change, not the surrounding element.

Multiple interpolations in a single text node are supported:

```html
<p>{{first}} and {{second}}</p>
```

---

## Directives

All directives are placed as attributes on HTML elements. They use the `@` prefix to distinguish them from regular HTML attributes.

### @if / @elseif / @else

```html
<div @if="isLoggedIn">Welcome back!</div>
<div @elseif="isGuest">Hello, guest.</div>
<div @else>Please log in.</div>
```

- The elements can be **any tag** — `@if`, `@elseif`, and `@else` do not need to be on the same tag type.
- The chain is reactive: when signals in the condition change, the DOM updates surgically using boundary markers (no full re-render of the parent).
- `@elseif` and `@else` must immediately follow an `@if` or `@elseif` element in the DOM (no unrelated siblings between them).

```html
<!-- Multiple elseif branches -->
<p @if="score >= 90">A</p>
<p @elseif="score >= 80">B</p>
<p @elseif="score >= 70">C</p>
<p @else>F</p>
```

---

### @each

```html
<!-- Basic iteration -->
<li @each="item of items">{{item}}</li>

<!-- With index -->
<li @each="item with index of items">{{index}}: {{item}}</li>
```

**Syntax:** `@each="<item> [with <index>] of <expr>"`

- `item` — name for the current element
- `index` — (optional) name for the zero-based position, introduced with the `with` keyword
- `expr` — any expression that evaluates to an iterable (array, Set, etc.)

The list re-renders reactively when the source signal changes. `onDestroy` is called on any components inside the list before they are removed.

### @key — keyed reconciliation

By default `@each` destroys and recreates all DOM nodes on every re-run. Adding `@key` enables keyed reconciliation — nodes whose key matches an existing node are reused and moved rather than recreated.

```html
<li @each="item of items.value" @key="item.id">{{item.name}}</li>
```

**Syntax:** `@key="<expr>"` — expression is evaluated in the item's scope.

Benefits:
- DOM nodes are reused on reorder (no destroy/recreate)
- `onDestroy` is only called for genuinely removed items
- Components inside `@each` preserve their internal state across list updates

```html
<!-- Components keep their state when the list is reordered -->
<todo-item
  @each="todo of todos.value"
  @key="todo.id"
  @:todo="todo"
></todo-item>
```

> **Note:** Keyed reconciliation does not automatically propagate new item data to existing nodes when items are plain objects — only the DOM position updates. For per-item reactivity, use signals as item values.

```html
<!-- Iterating a signal -->
<div @each="user of users.value">
  <span>{{user.name}}</span>
</div>
```

---

### @let

```html
<div @let="x = 42">{{x}}</div>
<div @let="total = price * quantity">Total: {{total}}</div>
```

**Syntax:** `@let="<name> = <expr>"`

Evaluates the expression, binds the result to `name` in the local scope, and makes it available to the element and all its descendants. The element itself is also rendered normally. `$ref` is automatically set to the created element after initialization.

---

### @on:event

```html
<button @on:click="increment()">+</button>
<input @on:input="search.value = $event.target.value" />
<form @on:submit="handleSubmit($event)">...</form>
```

**Syntax:** `@on:<eventName>[.modifier]*="<expr>"`

Attaches a DOM event listener. Inside the handler expression:

- `$event` — the native DOM `Event` object
- All component properties and methods are in scope

Listeners are automatically removed when the component is destroyed (via `AbortController`).

```html
<!-- Any DOM event name works -->
<div @on:mouseover="highlight()" @on:mouseleave="reset()"></div>
<input @on:keydown="onKey($event)" />
```

### Event modifiers

Modifiers are appended to the event name with a dot. Multiple modifiers can be combined.

| Modifier | Effect |
|---|---|
| `.prevent` | calls `event.preventDefault()` |
| `.stop` | calls `event.stopPropagation()` |
| `.once` | listener fires at most once then is removed |
| `.passive` | marks listener as passive (improves scroll performance) |
| `.capture` | listener fires during capture phase instead of bubble |

```html
<form @on:submit.prevent="save()">...</form>
<button @on:click.stop="toggle()">...</button>
<button @on:click.once="init()">...</button>
<button @on:click.prevent.stop="handle()">...</button>
```

---

### @attr (dynamic attributes)

```html
<input @disabled="isDisabled" />
<a @href="currentUrl" @target="'_blank'">Link</a>
<img @src="user.avatar" @alt="user.name" />
```

**Syntax:** `@<attrName>="<expr>"`

Evaluates the expression and sets it as the attribute value. The binding is reactive.

- If the value is `false`, `null`, or `undefined`, the attribute is **removed** from the element.
- For `style`, the value is merged with any existing static style.

```html
<!-- Attribute is removed when false -->
<button @disabled="items.value.length === 0">Submit</button>
```

---

### @class

```html
<div class="card" @class="isActive ? 'active' : ''"></div>
<li @class="index === selected.value ? 'selected' : ''">{{item}}</li>
```

**Syntax:** `@class="<expr>"`

Evaluates the expression and **merges** the result with any existing static `class` attribute. The dynamic class replaces only the previously set dynamic class on re-runs — static classes are never removed.

```html
<!-- Both 'card' (static) and 'active' (dynamic) apply when condition is true -->
<div class="card" @class="active ? 'active' : ''"></div>
```

---

### @style

```html
<div @style="'color: ' + color.value"></div>
<div style="padding: 8px" @style="'background: ' + bg.value"></div>
```

**Syntax:** `@style="<expr>"`

Evaluates the expression and merges it with any existing static `style` attribute.

---

### @ref

```html
<input @ref="emailInput" type="email" />
<canvas @ref="canvas"></canvas>
```

**Syntax:** `@ref="<propertyName>"`

After the element is created and inserted into the DOM, sets `this.<propertyName>` on the component instance to the DOM element. The value is a plain property name — not an expression.

```js
class MyForm extends Component {
  emailInput = null;

  onRender() {
    this.emailInput.focus();
  }
}
```

- The property is set before `onRender()` fires, so it is safe to access there.
- `@ref` does not set any attribute on the DOM element.
- Inside a `@each` loop, the property is overwritten on each iteration — it will hold the last element created.

---

## Void elements

`<void>` renders its children directly into the parent without creating a wrapper DOM element. It is Kasper's fragment primitive.

```html
<!-- Without void: wraps children in a <div> -->
<div @if="show">
  <p>First</p>
  <p>Second</p>
</div>

<!-- With void: no wrapper element in the DOM -->
<void @if="show">
  <p>First</p>
  <p>Second</p>
</void>
```

`<void>` is most useful when a directive like `@if` or `@each` is needed but adding a real wrapper element would break the layout or semantics (e.g. inside a `<table>`, `<ul>`, or flex/grid container).

```html
<ul>
  <void @each="section of sections.value">
    <li class="section-header">{{section.title}}</li>
    <li @each="item of section.items">{{item}}</li>
  </void>
</ul>
```

---

## Components

Components are registered by tag name. When Kasper encounters a registered tag, it instantiates the component class and renders its template.

### @: (argument passing)

`@:` is Kasper's convention for passing values into a child component. The colon is intentionally short — you write it constantly.

```html
<user-card @:userId="currentUser.id" @:role="'admin'"></user-card>
```

**Syntax:** `@:<name>="<expr>"`

Passes the **evaluated result** of the expression to the component as `this.args.<name>`. Any JS type is passed as-is: numbers, booleans, objects, arrays, and signals are not coerced to strings.

```html
<!-- Pass a signal reference — child can read and write it -->
<counter-display @:count="mySignal"></counter-display>
```

```js
// Inside child component — two-way binding via signal reference
this.args.count.value++;
```

Passing a callback function is the standard pattern for child-to-parent communication:

```html
<modal @:onClose="closeModal"></modal>
```

```js
// Inside modal component
this.args.onClose();
```

---

### Slots

Components can accept content from the parent via named or default slots.

**Default slot:**

```html
<!-- In parent template -->
<panel-card>
  <p>This content goes into the default slot.</p>
</panel-card>

<!-- In panel-card template -->
<div class="card">
  <slot />
</div>
```

**Named slots:**

```html
<!-- In parent template -->
<page-layout>
  <header @slot="header"><h1>Title</h1></header>
  <p @slot="footer">Footer text</p>
  <p>Default content</p>
</page-layout>

<!-- In page-layout template -->
<div class="layout">
  <div class="header"><slot @name="header" /></div>
  <div class="body"><slot /></div>
  <div class="footer"><slot @name="footer" /></div>
</div>
```

Any element with a `@slot="<name>"` attribute is routed to the matching `<slot @name="<name>">`. All other children go to the default `<slot>`.

---

## Expression Language

Kasper has its own expression evaluator used in all `{{ }}` and directive values. It is a subset of JavaScript.

### Literals

```js
42          // number
3.14        // float
"hello"     // string (double quotes)
'hello'     // string (single quotes)
`hello`     // template literal (supports {{ }} interpolation)
true        // boolean
false       // boolean
null        // null
undefined   // undefined
```

### Template literals

```html
<p>{{`Hello, ${name}!`}}</p>
<div @style="`color: ${theme.value.color}; font-size: ${size}px`"></div>
```

Template literals use `` ` `` and support `${ }` interpolation of any expression.

### Operators

| Category | Operators |
|---|---|
| Arithmetic | `+` `-` `*` `/` `%` |
| Comparison | `>` `>=` `<` `<=` `==` `===` `!=` `!==` |
| Logical | `&&` `\|\|` `!` |
| Ternary | `cond ? a : b` |
| Null coalescing | `??` |
| Optional chaining | `?.` `?.[key]` `?.()` |
| Bitwise | `\|` `^` `~` `<<` `>>` |
| Type | `instanceof` `in` `typeof` |
| Prefix | `++x` `--x` `-x` |
| Postfix | `x++` `x--` |
| Pipeline | `\|>` |

### Assignment operators

```js
x = value
x += value
x -= value
x *= value
x /= value
x %= value
```

### Property access

```js
user.name           // dot notation
items[0]            // bracket notation
user?.address?.city // optional chaining — returns undefined if any part is null/undefined
```

### Collections

```js
[1, 2, 3]           // array literal
{ key: value }      // object literal
{ a, b }            // shorthand properties
```

### Function calls

```js
greet()
items.filter(fn)
Math.max(a, b)
```

### Constructors

```js
new Date()
new Map()
```

### Keywords

```js
typeof x            // returns type string
void expr           // evaluates expr, discards result (returns "")
debug expr          // evaluates expr, console.logs it, returns ""
```

### Pipeline operator

**Syntax:** `value |> fn` or `value |> fn(arg)`

Passes the left-hand value as the **first argument** to the right-hand function. Chains naturally left to right.

```js
name |> uppercase                  // uppercase(name)
price |> formatCurrency('USD')     // formatCurrency(price, 'USD')
items |> filter(x => x.active) |> slice(0, 10)
score |> Math.round |> toPercent
```

Pipeline functions are just regular functions in component scope or `window` — no registry needed:

```js
class MyComp extends Component {
  items = signal([]);

  uppercase(s) { return s.toUpperCase(); }
  truncate(s, len) { return s.slice(0, len); }
}
```

```html
<p>{{ title |> uppercase }}</p>
<p>{{ description |> truncate(100) }}</p>
```

---

### Spread

```js
[...arr, 4]          // array spread
{ ...obj, key: val } // object spread
fn(...args)          // call spread
```

### Arrow functions

```js
items.filter(x => x.active)
items.filter((x) => x.active)
items.reduce((acc, x) => acc + x, 0)
() => defaultValue
```

---

### Scope

Expressions are evaluated against the current component instance. All component properties and methods are directly accessible by name:

```html
<p>{{title}}</p>              <!-- reads this.title -->
<button @on:click="save()">   <!-- calls this.save() -->
```

Unresolved names fall through to `window` — so `Math`, `Date`, `JSON`, `console`, and other globals work naturally.

---

## Signals

Signals are the reactive primitive. All `{{ }}` bindings and directive expressions automatically track the signals they read — no manual subscription needed.

```js
const count = signal(0);
count.value        // read — subscribes the current effect
count.value = 5    // write — notifies all subscribers
count.peek()       // read without subscribing
```

For the full signals API — `signal`, `computed`, `effect`, `onChange` — see [SIGNALS.md](./SIGNALS.md).

---

## Component Class

```js
class MyComponent extends Component {
  // Reactive state
  items = signal([]);
  loading = signal(false);

  // Lifecycle hooks
  onMount()    {}  // called before first render
  onRender()  {}  // called after each render
  onChanges() {}  // called before re-render when state changes
  onDestroy() {}  // called when component is removed from DOM

  // Available properties
  // this.args        — object passed in via @: attributes
  // this.ref         — the component's root DOM element
  // this.transpiler  — the Transpiler instance (advanced use)
}
```

### Lifecycle order

On first mount:
1. `onMount()`
2. Template is rendered
3. `onRender()`

On destroy (component removed):
1. `onDestroy()`
2. All `@on:` event listeners are aborted
3. All reactive effects are stopped

---

## App Bootstrap

### bootstrap (recommended)

Bootstrap the application using `App` (aliased to `bootstrap` internally).

```js
App({
  root: document.body,  // HTMLElement for the mount point
  entry: "my-app",      // tag name of the root component
  registry: {
    "my-app": {
      selector: "template#my-app",  // <template> element to read innerHTML from
      component: MyApp,
      template: null,
    },
    "user-card": {
      selector: "template#user-card",
      component: UserCard,
      template: null,
    },
  },
  mode: import.meta.env.MODE, // 'development' or 'production'
});
```

```html
<template id="my-app">
  <h1>{{title}}</h1>
  <user-card @:userId="currentUser.id"></user-card>
</template>

<template id="user-card">
  <div class="card">{{args.userId}}</div>
</template>
```

> **Note:** Browser `innerHTML` serialization escapes `<` to `&lt;` in attribute values. Kasper decodes these automatically, so `@if="count.value < 5"` works correctly when read from a `<template>` element. This limitation disappears entirely with a Vite build pipeline.

### Kasper (single-component shorthand)

```js
Kasper(MyApp);
```

Equivalent to calling `bootstrap` with `root: "kasper-app"`, `entry: "kasper-root"`, and a single component mapped to the first `<template>` on the page. Useful for simple single-component apps.
