---
title: Component Lifecycle
description: Lifecycle hooks for Kasper.js components.
---

Every Kasper component goes through a predictable lifecycle from creation to removal. Override these methods in your component class to hook into each phase.

---

## Hooks at a Glance

| Hook | When it fires |
|---|---|
| `onMount()` | After the first render — DOM is ready, args are populated |
| `onRender()` | After every render — DOM is ready for querying/measuring |
| `onChanges()` | Before a re-render triggered by a signal change |
| `onDestroy()` | When the component is removed from the DOM — use for cleanup |

---

## constructor

If you need to run logic before anything else — before args, before the DOM, before the first render — you can use the standard JavaScript constructor. Call `super()` first to ensure the component initialises correctly:

```js
class MyComponent extends Component {
  constructor(props) {
    super(props);
    // runs before everything — no args, no DOM
    this.startedAt = Date.now();
  }
}
```

In practice, this is rarely needed. `onMount()` is the right place for setup in almost every case — prefer it over the constructor.

---

## onMount()

Called **once**, after the first render. The DOM is ready and `this.args` is populated.

Use it to:
- Fetch data
- Start timers or intervals
- Set up third-party libraries
- Subscribe to external events

```js
class UserProfile extends Component {
  user = signal(null);
  loading = signal(true);

  onMount() {
    fetch('/api/user/1')
      .then(r => r.json())
      .then(data => {
        this.user.value = data;
        this.loading.value = false;
      });
  }
}
```

---

## onRender()

Called **after every render cycle** — both the first render and every subsequent reactive update. The DOM is live and queryable at this point.

Use it to:
- Scroll to a position after new content is added
- Sync an external library's state after a data change
- Read layout measurements after an update

```js
class LiveFeed extends Component {
  onRender() {
    // Scroll to bottom every time new messages are added
    const list = this.ref.querySelector('.feed');
    if (list) list.scrollTop = list.scrollHeight;
  }
}
```

> `onRender` fires on **every** render — including reactive signal updates. Do not use it for one-time DOM setup like setting focus or initialising a library. Use `onMount` for that.

---

## onChanges()

Called **before** a re-render triggered by a reactive signal change. It is *not* called on the first render — only on subsequent updates.

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
- Clear timers or intervals started in `onMount`
- Cancel in-flight network requests
- Unsubscribe from external event sources
- Release any resources held by the component

```js
class Ticker extends Component {
  time = signal(new Date());
  _timer = null;

  onMount() {
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
  └─ onMount()
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
- **Reactive effects** registered through the framework are stopped automatically. Only effects you create manually with `effect()` outside a component need explicit cleanup.

---

## Example: Full Lifecycle

```js
class LiveFeed extends Component {
  messages = signal([]);
  _ws = null;

  onMount() {
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

  onMount() {
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
