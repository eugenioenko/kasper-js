# Kasper-js 1.0.1

This is a work in progress of a javascript template parser and renderer

### > [Try it out in playground!](https://eugenioenko.github.io/kasper-js/live/)

## Project goals

> Create a full modern javascript framework

Realistic goal is to write a javascript template parser and use it later to create a base for a javascript framework (components, dependency injection, build, etc..) and learn, research and understand the complexity of the task.

## Template syntax goals

Kasper's template syntax should always be a valid html syntax. Any html editor should work correctly with it.
The template language should be cohesive and clean, ideally with no compromises

## Implemented so far

- html parser
- javascript like syntax parser and interpreter
- template renderer

## Conditional expression

```
  <div @if="this.something > 20">less 20</div>
  <div @elseif="this.something === 30">its 30</div>
  <div @else>other</div>
```

## Foreach expression

```
<ul>
  <li @each="item of this.items">
    <button @on:click="this.open(index)">{{item}}</button>
  </li>
</ul>
```

## Init expression

Evaluated during element creation

```
<div @init="student = {name: person.name, degree: 'Masters'}; console.log(student.name)">
    {{student.name}}
</div>
```

## While expression

```
<span @while="index < 3">
  {{index = index + 1}},
</span>
```

## Event listener expression

```
<button @on:click="alert('Hello World')">
  Button
</button>
```

## Template string expression

Evaluates the expression to string and inserts it into the dom as a TextNode

```
{{ "Hello" + " " + "World" }}
```

# Template expression interpreter

Kasper's expression interpreter emulates basic javascript expressions.
So far it implements the following expressions:
Assign, Binary, Call, Debug, Dictionary, Each, Get, Grouping, Key, Logical, List, Literal, New, NullCoalescing, Postfix, Set, Template, Ternary, Typeof, Unary, Variable, Void

## Assignment expression

`identifier [operator] expression;`
Valid operators are: `= += -= *= /=`

```
number = 22;
list = [1, 2, "hello"];
dict = {"green": "#00FF00 };
text += "Hello World";
```

## Binary expression

`identifier [operator] expression;`
Valid operators are: `+ - / *`

```
text + list[0] * dict.value;
```

## Function call expression

`identifier(arg*);`

```
console.log('something');
```
