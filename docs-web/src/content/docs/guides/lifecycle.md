---
title: Component Lifecycle
description: Lifecycle hooks for Kasper.js components.
---


Every Kasper component goes through a predictable lifecycle from creation to removal. Override these methods in your component class to hook into each phase.

---

## Hooks at a Glance

| Hook | When it fires |
|---|---|
| `onInit()` | Before the first render — use for setup, data fetching, initial state |
| `onRender()` | After every render — DOM is ready for querying/measuring |
| `onChanges()` | Before a re-render triggered by a signal change |
| `onDestroy()` | When the component is removed from the DOM — use for cleanup |

---

## onInit()

Called **once**, before the template is rendered into the DOM.

Use it to:
- Set initial signal values
- Fetch data
- Start timers or intervals
- Subscribe to external events

```js
class UserProfile extends Component {
  user = signal(null);
  loading = signal(true);

  onInit() {
    fetch('/api/user/1')
      .then(r => r.json())
      .then(data => {
        this.user.value = data;
        this.loading.value = false;
      });
  }
}
```

At the time `onInit` fires, `this.args` is already populated — you can read component arguments immediately.

---

## onRender()

Called **after** each render cycle. At this point the DOM nodes created by the template are attached and can be queried.

Use it to:
- Read layout measurements (e.g. `getBoundingClientRect`)
- Initialize third-party libraries that require a real DOM node
- Set focus on an input element

```js
class Modal extends Component {
  onRender() {
    this.ref.querySelector('input')?.focus();
  }
}
```

> `this.ref` is the component's root DOM element and is available inside `onRender`.

---

## onChanges()

Called **before** a re-render that was triggered by a reactive signal change. It is *not* called on the first render — only on subsequent updates.

Use it to:
- Log or debug state changes
- Compute derived values that are not reactive signals
- Gate or cancel a pending update

```js
class DataGrid extends Component {
  rows = signal([]);

  onChanges() {
    console.log('Grid data changed, rows:', this.rows.value.length);
  }
}
```

---

## onDestroy()

Called **once**, when the component is about to be removed from the DOM. After this hook fires, all `@on:` event listeners are automatically aborted via `AbortController`.

Use it to:
- Clear timers or intervals started in `onInit`
- Cancel in-flight network requests
- Unsubscribe from external event sources
- Release any resources held by the component

```js
class Ticker extends Component {
  time = signal(new Date());
  _timer = null;

  onInit() {
    this._timer = setInterval(() => {
      this.time.value = new Date();
    }, 1000);
  }

  onDestroy() {
    clearInterval(this._timer);
  }
}
```

---

## Lifecycle Order

### First Mount

```
new ComponentClass()
  └─ onInit()
  └─ template rendered into DOM
  └─ onRender()
```

### Signal Update (reactive re-render)

```
signal.value changes
  └─ onChanges()
  └─ affected bindings updated surgically
  └─ onRender()
```

> Kasper uses fine-grained reactivity — only the specific DOM nodes bound to a changed signal are updated. The entire component is not re-rendered.

### Destroy (component removed from DOM)

```
parent list/condition changes → component removed
  └─ onDestroy()
  └─ @on: event listeners aborted
  └─ reactive effects stopped
```

---

## Automatic Cleanup

Kasper handles several things automatically so you don't have to:

- **Event listeners** added via `@on:` are bound to the component's `AbortController` and removed automatically on destroy. You only need `onDestroy` for listeners you attach manually (e.g. `window.addEventListener`).
- **Reactive effects** registered through the framework are stopped automatically. Only effects you create manually with `kasper.effect()` outside a component need explicit cleanup.

---

## Example: Full Lifecycle

```js
class LiveFeed extends Component {
  messages = signal([]);
  _ws = null;

  onInit() {
    this._ws = new WebSocket('wss://example.com/feed');
    this._ws.onmessage = (e) => {
      this.messages.value = [...this.messages.value, e.data];
    };
  }

  onRender() {
    // Scroll to bottom after each update
    const list = this.ref.querySelector('.feed');
    if (list) list.scrollTop = list.scrollHeight;
  }

  onChanges() {
    if (this.messages.value.length > 100) {
      // Keep the last 100 messages
      this.messages.value = this.messages.value.slice(-100);
    }
  }

  onDestroy() {
    this._ws?.close();
  }
}
```

---

## Manual rendering with render()

By default, Kasper updates the DOM surgically through signals — only the parts that depend on changed values are updated. This is the recommended approach.

In some cases you may want to skip signals entirely and trigger a full component re-render manually — for example when integrating with non-reactive data sources, third-party libraries, or imperative update patterns.

Call `this.render()` to tear down and re-render the component's template:

```ts
export class Clock extends Component {
  time = new Date().toLocaleTimeString();

  onInit() {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString();
      this.render();
    }, 1000);
  }
}
```

```html
<template>
  <p>{{time}}</p>
</template>
```

`render()` will:
1. Destroy existing child effects and DOM nodes inside the component
2. Re-run the template against the current component state
3. Call `onRender()` when done

:::caution
Prefer signals for reactivity — `render()` is a full teardown and rebuild of the component's DOM, which is more expensive than a surgical signal update.
:::
