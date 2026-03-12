---
title: Expression Language
description: Full reference for Kasper's expression language.
---

Kasper expressions are used in `{{ }}` interpolation and directive values. The language is a JavaScript subset with a few additions.

## Literals

```
42          // number
3.14        // float
"hello"     // string
'hello'     // string
true        // boolean
false       // boolean
null        // null
undefined   // undefined
`Hello ${name}` // template string
```

## Operators

| Operator | Description |
|---|---|
| `+` `-` `*` `/` `%` | Arithmetic |
| `==` `===` `!=` `!==` | Equality |
| `>` `>=` `<` `<=` | Comparison |
| `&&` `\|\|` | Logical |
| `!` `-` `~` | Unary |
| `??` | Null coalescing |
| `? :` | Ternary |
| `\|>` | Pipeline |
| `instanceof` `in` | Type/membership |
| `<<` `>>` `\|` `^` | Bitwise |
| `++` `--` | Prefix / postfix increment |
| `=` `+=` `-=` `*=` `/=` `%=` | Assignment |

## Property access

```js
user.name
user['name']
user?.address?.city     // optional chaining
user?.['key']           // optional bracket access
fn?.()                  // optional call
```

## Arrays and objects

```js
[1, 2, 3]
[...a, ...b]            // spread

{ name: 'Alice', age: 30 }
{ ...defaults, color: 'red' }   // spread
```

## Arrow functions

```js
(x) => x * 2
(x, y) => x + y
() => 42
```

Used with array methods in expressions:

```html
<li @each="item of items.filter((i) => i.active)">{{item.name}}</li>
```

## Pipeline operator

The `|>` operator passes the left side as the first argument to the right side:

```js
items |> filter((x) => x.active)
// equivalent to: filter(items, x => x.active)

value |> Math.abs |> Math.round
// chains: Math.round(Math.abs(value))
```

With extra arguments:

```js
items |> slice(0, 5)
// equivalent to: slice(items, 0, 5)
```

## Function calls

```js
greet()
greet('Alice')
fn(...args)             // spread args
new Date()
typeof value
void sideEffect()
```

## Scope

Expressions evaluate in the component's scope. `this` is not used — component properties are accessed directly:

```html
<p>{{count.value}}</p>   <!-- not this.count.value -->
```

Inside `@each`, the loop variable is added to scope:

```html
<li @each="item of items">{{item.name}}</li>
```
