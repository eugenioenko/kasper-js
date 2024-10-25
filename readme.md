# Kasper-js 1.0.1

**Kasper-js** is a work-in-progress JavaScript HTML template parser and renderer designed to help create and learn core mechanics of modern JavaScript frameworks.

## > [Try it out in playground!](https://eugenioenko.github.io/kasper-js/live/)

Here you can find a small demo of Kanban board done with kasper-js

### > [KasperJS Kanban board demo](https://eugenioenko.github.io/kasper-js/live/demo.html)

## Project Vision

Kasper-js aims to bridge the gap between simple templating engines and full-fledged JavaScript frameworks by providing a lightweight, extensible solution that emphasizes performance and developer experience. As web applications continue to evolve, the need for flexible and efficient frameworks has never been greater.

## Project Goals
The primary goal of Kasper-js is to create a comprehensive modern JavaScript framework. This includes:

- Developing a JavaScript HTML template parser and view renderer engine.
- Establishing a base for a full JavaScript framework, including components, dependency injection, and build tools.
- Gaining insights into the complexities of framework development through research and practical implementation.


## Template syntax goals

Kasper's template syntax aims to maintain valid HTML syntax, ensuring compatibility with any HTML editor. The syntax is designed to be:

- Cohesive and clean.
- Intuitive with minimal compromises.

## Best Practices

The framework adheres to the following best practices:
- **Modular Design**: Each component is encapsulated, promoting reusability.
- **Separation of Concerns**: Logic is separated from presentation, enhancing readability and maintainability.

## Features Implemented So Far

- HTML parser
- JavaScript-like syntax parser and interpreter
- Template renderer
- Re-rendering on state updates

To use Kasper, follow these steps:

1. Include the `kasper.js` script in your HTML file.
2. Create a `<template>` element for your UI.
3. Extend the `KasperApp` class to create your application.
4. Render the app by calling `Kasper`.

```
<html>
  <head>
    <script src="kasper.min.js"></script>
  </head>
  <body>
    <template>
      <div>{{myAppName}}</div>
    </template>
    <script>
      class MyApp extends KasperApp {
        myAppName = "MyAppName"
      }
      Kasper(MyApp);
    </script>
  </body>
</html>
```


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

## Let expression

Evaluated during element creation

```
<div @let="student = {name: person.name, degree: 'Masters'}; console.log(student.name)">
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

## Template Expression Interpreter

The **Kasper** expression interpreter is designed to emulate basic JavaScript expressions, providing a versatile framework for template rendering and dynamic content management. It allows developers to use familiar JavaScript syntax and constructs, enhancing the functionality and flexibility of the templates.


## Supported JavaScript Expressions

Currently, the interpreter supports the following expressions:

- **Assign**: Assigns a value to a variable.
- **Binary**: Performs binary operations (e.g., addition, subtraction).
- **Call**: Invokes a function or method.
- **Debug**: Outputs debug information.
- **Dictionary**: Creates and manages key-value pairs.
- **Each**: Iterates over a collection or array.
- **Get**: Retrieves a value from an object or array.
- **Grouping**: Groups expressions for evaluation.
- **Key**: Accesses object properties using keys.
- **Logical**: Performs logical operations (e.g., AND, OR).
- **List**: Represents a list of values.
- **Literal**: Represents a fixed value (e.g., strings, numbers).
- **New**: Creates new instances of objects or arrays.
- **Null Coalescing**: Returns the first non-null value.
- **Postfix**: Applies operations after the value.
- **Set**: Sets a value to a variable.
- **Template**: Processes template literals for rendering.
- **Ternary**: Implements conditional expressions (ternary operator).
- **Typeof**: Returns the type of a variable or expression.
- **Unary**: Applies unary operations (e.g., negation).
- **Variable**: Represents a variable that can store values.
- **Void**: Represents an expression that does not return a value.

### Future Enhancements

Future updates will focus on expanding the capabilities of the expression interpreter, incorporating additional expressions and features to enhance the framework's power and usability.

## Testing

Kasper-js employs **Jasmine** for unit testing to ensure code reliability and maintainability. The tests are organized in the `/specs` folder, allowing for easy navigation and management of test cases. However, the current test coverage needs improvement, and additional tests are encouraged to enhance the robustness of the framework.

## Todo

- fix state re-render
