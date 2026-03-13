---
title: State Management
description: Sharing state across components with global signals.
sidebar:
  order: 6
---

Kasper does not require a dedicated state management library. Because signals are plain JavaScript objects, you can define them outside any component and import them wherever needed.

## Global signals

Create a file that exports shared signals:

```ts
// src/store/cart.ts
import { signal, computed } from 'kasper-js';

export const cartItems = signal<string[]>([]);
export const cartCount = computed(() => cartItems.value.length);

export function addItem(item: string) {
  cartItems.value = [...cartItems.value, item];
}

export function removeItem(item: string) {
  cartItems.value = cartItems.value.filter((i) => i !== item);
}
```

Any component can import and use these directly:

```ts
// src/components/ProductCard.kasper
import { Component } from 'kasper-js';
import { addItem } from '../store/cart';

export class ProductCard extends Component {
  add(name: string) {
    addItem(name);
  }
}
```

```ts
// src/components/CartBadge.kasper
import { Component } from 'kasper-js';
import { cartCount } from '../store/cart';

export class CartBadge extends Component {
  count = cartCount;
}
```

```html
<!-- CartBadge template -->
<span class="badge">{{count.value}}</span>
```

`CartBadge` will update reactively whenever `cartItems` changes — even though it never received a prop from a parent.

## Why this works

Signals track their own subscribers. When `cartItems.value` is written from anywhere — a button click in `ProductCard`, a fetch response, a timer — every `effect` and template binding that read it will re-run automatically.

There is no store boilerplate, no reducers, no dispatch. A module with exported signals *is* the store.

## Structuring shared state

For larger apps, group related signals by domain:

```
src/
  store/
    cart.ts       — cartItems, cartCount, addItem, removeItem
    user.ts       — currentUser, isLoggedIn, login, logout
    theme.ts      — theme, toggleTheme
```

Each file is independently importable. Components only import what they need.

## Cleaning up

Template bindings (`{{user.value}}`, `@if`, `@each`) are cleaned up automatically on destroy.

For `onChange` on a global signal, use `this.haunt()` instead of calling `onChange` directly — it registers the subscription and cleans it up automatically when the component is destroyed:

```ts
export class Navbar extends Component {
  onInit() {
    this.haunt(currentUser, (user) => {
      console.log('user changed', user);
    });
  }
}
```

No `onDestroy` needed. `this.haunt()` is always the preferred way to subscribe to external signals inside a component.
