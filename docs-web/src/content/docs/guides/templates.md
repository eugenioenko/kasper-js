---
title: Template Syntax
description: Kasper.js template syntax reference.
---

Kasper templates are valid HTML. Directives are standard attributes prefixed with `@`. Expressions use `{{ }}` for interpolation.

## Interpolation

```html
<p>{{message}}</p>
<p>{{count.value * 2}}</p>
<p>{{user.firstName + ' ' + user.lastName}}</p>
```

Only the text node updates when the expression's signals change — not the surrounding element.

## Expressions

The expression language is a subset of JavaScript with a few extras:

```html
<!-- Ternary -->
<p>{{isOnline ? 'Online' : 'Offline'}}</p>

<!-- Null coalescing -->
<p>{{user.name ?? 'Anonymous'}}</p>

<!-- Optional chaining -->
<p>{{user?.address?.city}}</p>

<!-- Template strings -->
<p>{{'Hello, ' + name + '!'}}</p>

<!-- Pipeline operator -->
<p>{{items |> filter(x => x.active) |> length}}</p>
```

## Event binding

```html
<button @on:click="increment()">+</button>
<input @on:input="handleInput($event)" />
```

### Modifiers

```html
<form @on:submit.prevent="handleSubmit()">...</form>
<button @on:click.stop="handleClick()">...</button>
<button @on:click.once="handleOnce()">...</button>
```

## Dynamic attributes

```html
<!-- Object merge -->
<div @attr="{ class: isActive ? 'active' : '', disabled: isDisabled }"></div>

<!-- Shorthand class binding -->
<div @class="isActive ? 'active' : ''"></div>

<!-- Shorthand style binding -->
<div @style="{ color: textColor, fontSize: size + 'px' }"></div>
```

## Local variables

```html
<div @let="total = price * quantity">
  <p>Total: {{total}}</p>
</div>
```

## DOM refs

Capture an element reference into a component property:

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
