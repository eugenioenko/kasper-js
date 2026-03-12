# 👻 Kasper-js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

**Kasper-js is a lightweight JavaScript HTML template parser and renderer with a fine-grained Signal-based reactivity system. It sits between simple templating engines and full frameworks like Vue or React.**

## Live Demo

- **Playground**: [Try Kasper-js in the playground](https://eugenioenko.github.io/kasper-js/playground/)

## Features

- **Fine-grained Reactivity**: Signals, computed values, and effects — no virtual DOM, surgical DOM updates only.
- **HTML Parser**: Parses HTML templates into a KNode AST.
- **Expression Parser & Interpreter**: Evaluates a JavaScript-like expression language inside templates.
- **Component System**: Base `Component` class with lifecycle hooks (`$onInit`, `$onRender`, `$onChanges`, `$onDestroy`).
- **Structural Directives**: `@if`/`@elseif`/`@else`, `@each`, `@while`, `@let` with DOM Boundary management for efficient updates.
- **Slots**: Content transclusion via `<slot>` and named slots `<slot name="n">`.
- **Valid HTML Syntax**: All template directives are valid HTML attributes, compatible with standard tooling.

## Installation

Include the built script in your HTML:

```html
<script src="dist/kasper.min.js"></script>
```

Or build from source:

```bash
pnpm install
pnpm build
```

## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Kasper App</title>
    <script src="dist/kasper.min.js"></script>
  </head>
  <body>
    <template id="counter-template">
      <div>
        <p>Count: {{this.count.value}}</p>
        <p>Double: {{this.double.value}}</p>
        <button @on:click="this.increment()">+1</button>
      </div>
    </template>

    <div id="app"></div>

    <script>
      class Counter extends kasper.Component {
        count = kasper.signal(0);
        double = kasper.computed(() => this.count.value * 2);

        constructor(options) {
          super({ ...options, selector: "template#counter-template" });
        }

        increment() {
          this.count.value++;
        }
      }

      kasper.App({
        root: "#app",
        entry: "my-counter",
        registry: {
          "my-counter": { selector: "template#counter-template", component: Counter, nodes: [] },
        },
      });
    </script>
  </body>
</html>
```

## Reactive State (Signals)

`signal(initialValue)` creates a reactive value. Reading `.value` inside an `effect` or template expression automatically tracks the dependency. `computed()` derives a new signal. `effect()` runs a side effect whenever its dependencies change.

```javascript
const count = kasper.signal(0);
const double = kasper.computed(() => count.value * 2);

const dispose = kasper.effect(() => {
  console.log("count:", count.value, "double:", double.value);
});

count.value++; // triggers effect and any bound DOM nodes

dispose(); // cleanup
```

Inside components, declare signals as class fields:

```javascript
class MyApp extends kasper.Component {
  count = kasper.signal(0);
  double = kasper.computed(() => this.count.value * 2);

  increment() {
    this.count.value++;
  }
}
```

## Template Syntax

### Text Interpolation

```html
<p>Hello, {{this.name.value}}!</p>
<p>Sum: {{this.a.value + this.b.value}}</p>
```

### Conditionals

```html
<div @if="this.user.value.isLoggedIn">Welcome, {{this.user.value.name}}!</div>
<div @elseif="this.isLoading.value">Loading...</div>
<div @else>Please log in.</div>
```

### List Rendering

```html
<ul>
  <li @each="item of this.items.value">{{item.name}} ({{index}})</li>
</ul>
```

### Local Variables

```html
<div @let="full = this.first.value + ' ' + this.last.value">
  {{full}}
</div>
```

### Event Handling

```html
<button @on:click="this.handleClick($event)">Click</button>
<input @on:input="this.onInput($event.target.value)" />
```

### Attribute Binding

```html
<a @attr:href="this.url.value">Visit</a>
<div @attr:class="this.active.value ? 'on' : 'off'">Toggle</div>
```

Shorthand `@attr="expr"` merges `class` and `style` attributes.

### While Loops

```html
<span @let="i = 0" @while="i < 3">{{i}}{{ void (i = i + 1) }}</span>
```

## Architecture

**Pipeline:** HTML string → `TemplateParser` → KNode AST → `Transpiler` → live DOM with Signal bindings

| Module | Role |
|---|---|
| `signal.ts` | `signal()`, `computed()`, `effect()` — reactivity core |
| `kasper.ts` | `KasperInit` app bootstrap, `KasperRenderer` |
| `component.ts` | Base `Component` class with lifecycle hooks |
| `boundary.ts` | DOM Boundary management for `@if` and `@each` surgical updates |
| `template-parser.ts` | HTML → KNode AST |
| `scanner.ts` | Lexer for `{{ }}` and directive values |
| `expression-parser.ts` | Tokens → expression AST |
| `interpreter.ts` | Evaluates expression ASTs in a scope |
| `transpiler.ts` | KNode AST → live DOM with fine-grained effects |
| `scope.ts` | Variable resolution for expression evaluation |

## Supported Expressions

Binary, logical, unary, ternary, null coalescing (`??`), function calls, object/array literals, property access, assignment, template strings (`` `Hello ${name}` ``), `typeof`, `new`, postfix `++`/`--`, `void`.

## Testing

Kasper-js has **500 tests across 12 spec files** with **96% statement coverage** and **99% function coverage**.

| Metric | Coverage |
|---|---|
| Statements | 95.99% |
| Branches | 88.00% |
| Functions | 99.25% |
| Lines | 96.34% |

| Spec file | Tests | What it covers |
|---|---|---|
| `scanner.spec.ts` | 104 | Lexer tokenization of all expression and directive syntax |
| `interpreter.spec.ts` | 104 | Expression evaluation — operators, calls, literals, edge cases |
| `expression-parser.spec.ts` | 81 | AST construction for all supported expression types |
| `transpiler.spec.ts` | 74 | DOM output, directives, event binding, component rendering |
| `template-parser.spec.ts` | 49 | HTML parsing → KNode AST (elements, text, comments, doctypes) |
| `types.spec.ts` | 29 | toString / accept on all KNode, Expr, Token, and KasperError types |
| `scope.spec.ts` | 23 | Variable resolution and scope chaining |
| `viewer.spec.ts` | 10 | HTML serialization, error collection, error limit |
| `signal.spec.ts` | 10 | Signal reactivity, computed, effect tracking, disposal, peek |
| `component.spec.ts` | 9 | Lifecycle hooks, argument passing, slots, nested components |
| `boundary.spec.ts` | 4 | DOM Boundary insert, clear, and parent getter |
| `kasper.spec.ts` | 3 | App bootstrap and rendering integration |

```bash
pnpm test           # Run all 500 tests (single pass)
pnpm test:watch     # Watch mode
pnpm test --coverage  # With coverage report
```

Tests import directly from `src/` — no build step required.

## Development

```bash
pnpm dev          # Watch mode build
pnpm build        # Production build → dist/kasper.min.js
pnpm build:dev    # One-off dev build → dist/kasper.js
pnpm type-check   # TypeScript type checking
pnpm lint         # ESLint
```

## License

Kasper-js is licensed under the [MIT License](LICENSE).
