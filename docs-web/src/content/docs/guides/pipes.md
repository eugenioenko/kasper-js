---
title: Pipes
description: Transform values inline in templates using the |> pipeline operator.
sidebar:
  order: 9
---

The `|>` pipeline operator passes a value as the first argument to the function on the right. It lets you transform values inline in templates without cluttering the component class with one-off getters.

## Syntax

```js
value |> fn               // fn(value)
value |> fn(extra)        // fn(value, extra)
value |> fn1 |> fn2       // fn2(fn1(value))  — chains left-to-right
```

## Using class methods

Any method defined on the component class is available as a pipe:

```html
<!-- PriceTag.kasper -->
<template>
  <p>{{ price.value |> formatCurrency }}</p>
  <p>{{ items.value |> pluralize('item') }}</p>
</template>

<script>
import { Component, signal } from 'kasper-js';

export class PriceTag extends Component {
  price = signal(1999);
  items = signal(3);

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);
  }

  pluralize(count, word) {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
  }
}
</script>
```

## Using imported functions

All imports in the `<script>` block are automatically available in the template — no need to assign them to class properties:

```html
<!-- UserList.kasper -->
<template>
  <li @each="user of users.value |> sortBy('name')">
    {{ user.name |> capitalize }}
  </li>
</template>

<script>
import { Component, signal } from 'kasper-js';
import { sortBy, capitalize } from '../utils/format';

export class UserList extends Component {
  users = signal([
    { name: 'charlie', role: 'admin' },
    { name: 'alice', role: 'user' },
    { name: 'bob', role: 'user' },
  ]);
}
</script>
```

```ts
// utils/format.ts
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const sortBy = (arr: any[], key: string) => [...arr].sort((a, b) => a[key].localeCompare(b[key]));
```

## Chaining

Pipes chain left-to-right — each result feeds into the next:

```html
<!-- "  hello world  " → "Hello World" -->
<p>{{ label.value |> trim |> capitalize }}</p>
```

```html
<!-- filter then count -->
<span>{{ tasks.value |> filterActive |> count }} active</span>
```

## With @each

Pipes are especially useful on the iterable in `@each`:

```html
<!-- only show active items, sorted by priority -->
<li @each="task of tasks.value |> filterActive |> sortByPriority" @key="task.id">
  {{ task.title }}
</li>
```

This keeps the template declarative and avoids exposing filtered/sorted computed signals for every permutation.

## Inline arrow functions

For one-off transforms, use an arrow function directly:

```html
<p>{{ items.value |> (arr => arr.filter(x => x.done).length) }} completed</p>
```
