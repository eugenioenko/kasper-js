---
title: Directive Reference
description: Complete reference for all Kasper.js template directives.
---

## Interpolation

| Syntax | Description |
|---|---|
| `{{expr}}` | Text interpolation — reactive text node |

## Structural directives

| Directive | Description |
|---|---|
| `@if="expr"` | Render element if expression is truthy |
| `@elseif="expr"` | Else-if branch (must follow `@if` sibling) |
| `@else` | Else branch (must follow `@if` or `@elseif` sibling) |
| `@each="item of array"` | Render element for each item |
| `@each="item with index of array"` | Render with index |
| `@let="x = expr"` | Declare a scoped local variable |

## Event binding

| Directive | Description |
|---|---|
| `@on:event="handler()"` | Attach event listener |
| `@on:event.prevent` | Call `event.preventDefault()` |
| `@on:event.stop` | Call `event.stopPropagation()` |
| `@on:event.once` | Remove listener after first call |
| `@on:event.passive` | Add as passive listener |
| `@on:event.capture` | Add in capture phase |

`$event` is available in the handler expression.

## Attribute binding

| Directive | Description |
|---|---|
| `@name="expr"` | Bind ANY valid HTML attribute dynamically (e.g. `@value`, `@aria-label`, `@data-id`) |
| `@attr="{ key: value }"` | Bind multiple attributes from an object |
| `@class="expr"` | Bind class attribute dynamically |
| `@style="{ prop: value }"` | Bind style properties dynamically |

## Component directives

| Directive | Description |
|---|---|
| `@:argName="expr"` | Pass argument to child component |
| `@ref="propName"` | Capture element reference into component property |
| `@key="expr"` | Keyed reconciliation hint for `@each` |

## Slot

| Element | Description |
|---|---|
| `<slot>` | Default slot placeholder |
| `<slot @name="n">` | Named slot placeholder |
| `@slot="n"` attribute | Assign content to a named slot |
