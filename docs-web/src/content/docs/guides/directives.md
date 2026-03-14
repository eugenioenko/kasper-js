---
title: Directives
description: Structural directives for conditionals, loops, and more.
---

## @if / @elseif / @else

Conditionally render elements:

```html
<div @if="user.isAdmin">Admin panel</div>
<div @elseif="user.isLoggedIn">Dashboard</div>
<div @else>Please log in</div>
```

The condition is reactive — when signals it depends on change, the DOM updates automatically using boundary markers (no wrapping element required).

## @each

Render a list of items:

```html
<ul>
  <li @each="item of items">{{item.name}}</li>
</ul>
```

With index:

```html
<li @each="item with i of items">{{i}}: {{item.name}}</li>
```

The list re-renders reactively when the signal containing `items` changes.

## @key

Add `@key` to `@each` to enable keyed reconciliation. When the list changes, Kasper matches new items to existing DOM nodes by key — reusing and reordering them rather than destroying and recreating the entire list:

```html
<ul>
  <li @each="item of items.value" @key="item.id">{{item.name}}</li>
</ul>
```

Without `@key`, every signal update destroys and recreates all list nodes. With `@key`, only added items create new DOM nodes — existing ones are reused. Use it whenever the list can be reordered, filtered, or partially updated.

The key expression is evaluated in the item's scope and must be unique across the list. Typically `item.id` or another stable identifier.

## @while

Render elements while a condition is true:

```html
<div @while="count.value > 0">
  {{count.value}}
</div>
```

## @let

Declare a local template variable:

```html
<div @let="discount = price * 0.1">
  <p>You save: {{discount}}</p>
  <p>Total: {{price - discount}}</p>
</div>
```

Variables declared with `@let` are scoped to the element and its children.

## @on

Attach event listeners:

```html
<button @on:click="handleClick()">Click</button>
<input @on:input="handleInput($event)" />
<input @on:keydown.enter="submit()" />
```

Available modifiers: `.prevent`, `.stop`, `.once`, `.passive`, `.capture`

Event listeners are automatically removed when the component is destroyed.

## @attr

Bind dynamic attributes as an object:

```html
<div @attr="{ class: isActive ? 'active' : '', 'aria-label': label }"></div>
```

`class` and `style` values are merged with existing static attributes.

## @class

Shorthand for dynamic class binding:

```html
<div class="btn" @class="isPrimary ? 'btn-primary' : 'btn-secondary'"></div>
```

## @style

Shorthand for dynamic style binding:

```html
<div @style="{ color: textColor, opacity: isVisible ? 1 : 0 }"></div>
```

## @ref

Capture a DOM element reference into a component property:

```html
<canvas @ref="canvasEl"></canvas>
```

```ts
export class Chart extends Component {
  canvasEl: HTMLCanvasElement;

  onRender() {
    const ctx = this.canvasEl.getContext('2d');
    // draw chart
  }
}
```

## @: (component arguments)

Pass data to child components:

```html
<user-card @:name="user.name" @:avatar="user.avatar"></user-card>
```

Arguments are evaluated as full expressions — signals, arrays, objects, and functions are passed by reference.
