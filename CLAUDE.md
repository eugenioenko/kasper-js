# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # Development build (vite watch mode) → dist/kasper.js
pnpm build          # Production build (minified) → dist/kasper.min.js
pnpm build:dev      # One-off development build
pnpm type-check     # TypeScript type checking (no emit)
pnpm lint           # TSLint against src/
pnpm test           # Run Vitest (single run)
pnpm test:watch     # Run Vitest in watch mode
```

CI pipeline order: `pnpm install → pnpm build → pnpm test`

Bundler: Vite in library mode, UMD format. Both `dist/kasper.js` and `dist/kasper.min.js` are output to the same `dist/` dir (`emptyOutDir: false`).

Tests live in `spec/` and use Vitest with `globals: true` (no imports needed for `describe`/`it`/`expect`). Test helpers import directly from `src/` — no build step required before testing. To add tests, create `spec/**/*.spec.ts` files.

## Architecture

Kasper-js is a lightweight HTML template parser and renderer — a mini-framework between simple templating and full frameworks like Vue/React.

**Pipeline:** HTML template string → TemplateParser → KNode AST → Transpiler → live DOM with reactive bindings

**Core modules in `src/`:**

| Module | Role |
|---|---|
| `kasper.ts` | Core: `KasperRenderer`, `KasperState` (reactive state via `$state()`), `KasperInit` app bootstrap |
| `component.ts` | Base `Component` class with lifecycle hooks: `$onInit`, `$onRender`, `$onChanges`, `$onDestroy` |
| `template-parser.ts` | HTML parser → `KNode` AST (Element, Text, Comment, Doctype nodes) |
| `scanner.ts` | Lexer for Kasper expression syntax (tokenizes `{{ }}` and directive values) |
| `expression-parser.ts` | Parses tokens into expression AST nodes |
| `interpreter.ts` | Evaluates expression ASTs within a scope |
| `transpiler.ts` | Converts KNode AST + expressions into live DOM with event/attribute/conditional bindings |
| `scope.ts` | Variable resolution context for expression evaluation |
| `types/nodes.ts` | KNode type definitions using Visitor pattern |
| `types/expressions.ts` | Expression AST node types |

**Public API** (`src/index.ts`): sets `window.kasper`, `window.Component`, `window.$state` globals for browser use, and exports all classes as named ES exports for module consumers (UMD CJS output, future Vitest tests).

**TypeScript config:** ES2020 target/module, strict mode, path alias `@kasper/*` → `src/*`.

## Template Syntax

Kasper uses valid HTML with special attributes:

- `{{expression}}` — text interpolation
- `@if="cond"`, `@elseif="cond"`, `@else` — conditionals
- `@each="item of array"` — iteration (exposes `item` and `index`)
- `@while="cond"` — loop
- `@let="x = expr"` — local variable binding
- `@on:event="handler()"` — event binding
- `@attr:name="expr"` — dynamic attribute binding

Expressions support: binary/logical/unary ops, ternary, null coalescing (`??`), function calls, object/array literals, property access, template strings, `typeof`, `new`, postfix `++`/`--`.

## Reactive State

`$state(initialValue)` returns a reactive wrapper. Calling `.set(newValue)` triggers re-rendering. Components declare reactive properties as class fields using `$state()`.

```typescript
class MyApp extends kasper.Component {
  count = $state(0);
  increment() { this.count.set(this.count.value + 1); }
}
```
