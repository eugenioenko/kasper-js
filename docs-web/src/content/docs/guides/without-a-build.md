---
title: Without a Build Pipeline
description: Use Kasper.js directly from a CDN or local file with no bundler required.
sidebar:
  order: 10
---

Kasper.js ships as a standard ES module. You can import it directly in the browser with no bundler, no compiler, and no install step. This is useful for prototypes, embedded widgets, admin tools, or any project where adding a build pipeline is more friction than it is worth.

The only thing a build pipeline adds is support for the `.kasper` single-file component format, which requires the Vite plugin to transform. Everything else — signals, class components, the router, lazy loading, slots — works without one.

## Single file

The simplest setup is a single HTML file:

```html
<!DOCTYPE html>
<html>
<body>
  <todo-app></todo-app>

  <script type="module">
    import { App, Component, signal } from 'https://cdn.jsdelivr.net/npm/kasper-js/dist/kasper.min.js';

    class TodoApp extends Component {
      newTodo = signal('');
      todos = signal([]);

      add() {
        const text = this.newTodo.value.trim();
        if (!text) return;
        this.todos.value = [...this.todos.value, { id: Date.now(), text, done: false }];
        this.newTodo.value = '';
      }

      toggle(todo) {
        this.todos.value = this.todos.value.map(t =>
          t.id === todo.id ? { ...t, done: !t.done } : t
        );
      }
    }

    TodoApp.template = `
      <div>
        <input @value="newTodo.value" @on:input="newTodo.value = $event.target.value" @on:keydown.enter="add()" />
        <button @on:click="add()">Add</button>
        <ul>
          <li @each="todo of todos.value" @key="todo.id">
            <input type="checkbox" @checked="todo.done" @on:change="toggle(todo)" />
            {{todo.text}}
          </li>
        </ul>
      </div>
    `;

    App({
      root: document.body,
      entry: 'todo-app',
      registry: { 'todo-app': { component: TodoApp } },
    });
  </script>
</body>
</html>
```

The template is assigned as a static property on the class. This is exactly what the Vite plugin does automatically with `.kasper` files — without the plugin, you set it yourself.

## Multiple files

For a larger project, split components into separate `.js` files and use native ES module imports:

```
my-project/
  index.html
  components/
    TodoApp.js
    TodoItem.js
  store/
    todos.js
```

**`store/todos.js`**
```js
import { signal, computed } from 'https://cdn.jsdelivr.net/npm/kasper-js/dist/kasper.min.js';

export const todos = signal([]);
export const doneCount = computed(() => todos.value.filter(t => t.done).length);

export function addTodo(text) {
  todos.value = [...todos.value, { id: Date.now(), text, done: false }];
}

export function toggleTodo(id) {
  todos.value = todos.value.map(t => t.id === id ? { ...t, done: !t.done } : t);
}
```

**`components/TodoItem.js`**
```js
import { Component } from 'https://cdn.jsdelivr.net/npm/kasper-js/dist/kasper.min.js';
import { toggleTodo } from '../store/todos.js';

export class TodoItem extends Component {
  get todo() { return this.args.todo; }
  toggle() { toggleTodo(this.todo.id); }
}

TodoItem.template = `
  <li>
    <input type="checkbox" @checked="todo.done" @on:change="toggle()" />
    {{todo.text}}
  </li>
`;
```

**`components/TodoApp.js`**
```js
import { Component, signal } from 'https://cdn.jsdelivr.net/npm/kasper-js/dist/kasper.min.js';
import { todos, addTodo } from '../store/todos.js';
import { TodoItem } from './TodoItem.js';

export class TodoApp extends Component {
  newTodo = signal('');
  todos = todos;

  add() {
    const text = this.newTodo.value.trim();
    if (!text) return;
    addTodo(text);
    this.newTodo.value = '';
  }
}

TodoApp.template = `
  <div>
    <input @value="newTodo.value" @on:input="newTodo.value = $event.target.value" @on:keydown.enter="add()" />
    <button @on:click="add()">Add</button>
    <ul>
      <todo-item @each="todo of todos.value" @key="todo.id" @:todo="todo"></todo-item>
    </ul>
  </div>
`;

TodoApp.$imports = { TodoItem };
```

**`index.html`**
```html
<!DOCTYPE html>
<html>
<body>
  <todo-app></todo-app>
  <script type="module">
    import { App } from 'https://cdn.jsdelivr.net/npm/kasper-js/dist/kasper.min.js';
    import { TodoApp } from './components/TodoApp.js';
    import { TodoItem } from './components/TodoItem.js';

    App({
      root: document.body,
      entry: 'todo-app',
      registry: {
        'todo-app': { component: TodoApp },
        'todo-item': { component: TodoItem },
      },
    });
  </script>
</body>
</html>
```

Note the `$imports` assignment on `TodoApp`. The Vite plugin sets this automatically from the `<script>` block imports. Without the plugin, assign it manually for any names the template needs that are not on the component instance — in this case `TodoItem` is used as a tag in the template and needs to be resolvable.

## Lazy loading

Lazy loading works without a build. Native ES module dynamic imports are supported in all modern browsers:

```js
App({
  root: document.body,
  entry: 'app',
  registry: {
    'app': { component: AppShell },
    'heavy-chart': {
      component: () => import('./components/HeavyChart.js').then(m => m.HeavyChart),
      lazy: true,
    },
  },
});
```

The component file is only fetched when `<heavy-chart>` first appears in a rendered template. See [Lazy Loading](/guides/lazy-loading/) for the full API.

## Serving locally

Browsers block ES module imports from `file://` URLs. Use any static file server:

```bash
# Node.js (npx, no install)
npx serve .

# Python
python3 -m http.server 8080
```

## When a build pipeline helps

A build is not required, but it adds:

- **`.kasper` single-file components** — `<template>`, `<script>`, and `<style>` colocated in one file. The Vite plugin handles the transform; without it, you assign `.template` and `.$imports` manually.
- **TypeScript** — browser-native ES modules run plain JavaScript. TypeScript requires a compilation step.
- **Production bundling** — tree-shaking, minification, and cache-busted output filenames.

For getting started, prototyping, or embedding Kasper into an existing page, the script tag approach is all you need.
