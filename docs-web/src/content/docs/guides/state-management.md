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

## Persistent Stores

You can use the standalone `effect()` function to create global side-effects, such as syncing state to `localStorage`. This is a powerful pattern for building "Persistent Stores" that exist independently of the UI.

```ts
// src/store/theme.ts
import { signal, effect } from 'kasper-js';

// 1. Initialize from external source
const saved = localStorage.getItem('kasper-theme');
export const theme = signal(saved || 'light');

// 2. Sync changes back (Global side-effect)
// This effect lives for the life of the app and handles initial sync.
effect(() => {
  localStorage.setItem('kasper-theme', theme.value);
  document.body.className = `theme-${theme.value}`;
});

// 3. Simple action to mutate the signal
export function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
```

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

## Component Subscriptions

When a component needs to react to a global signal, use **`this.watch()`**, **`this.effect()`**, or the magic **`haunt()`** helper. These are automatically cleaned up when the component is destroyed.

```ts
import { Component, haunt } from 'kasper-js';
import { currentUser } from '../store/user';

export class Navbar extends Component {
  onMount() {
    // Branded way: haunt() creates a watcher when passed a signal + callback
    haunt(currentUser, (user) => {
      console.log('User changed:', user);
    });

    // Explicit way: always safe
    this.watch(currentUser, (user) => { ... });
  }
}
```

Using these methods ensures you never have a memory leak from a global signal subscription.
