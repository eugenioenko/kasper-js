# 👻 Kasper-js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](package.json)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) <!-- Placeholder -->
[![Test Coverage](https://img.shields.io/badge/coverage-pending-lightgrey.svg)](#testing) <!-- Placeholder -->

**Kasper-js is a lightweight, work-in-progress JavaScript HTML template parser and renderer. It's designed to help developers create dynamic web UIs with a simple, intuitive syntax while offering insights into the core mechanics of modern JavaScript frameworks.**

## 🌐 Live Demos

- **🧪 Playground**: [Try Kasper-js out in the playground!](https://eugenioenko.github.io/kasper-js/live/)
- **🗂️ Kanban Board Demo**: [View a Kanban board built with Kasper-js.](https://eugenioenko.github.io/kasper-js/live/demo.html)

## ✨ Features

- **HTML Parser**: Efficiently parses HTML templates.
- **JavaScript-like Expression Parser & Interpreter**: Supports a range of JavaScript-like expressions within templates.
- **Template Renderer**: Dynamically renders templates to the DOM.
- **Re-rendering on State Updates**: Automatically updates the UI when underlying data changes.
- **Component-Based Architecture**: Encourages modular design and reusability.
- **Valid HTML Syntax**: Kasper's template syntax remains valid HTML, ensuring compatibility with standard HTML editors and tooling.

## 🎯 Project Vision

Kasper-js aims to bridge the gap between simple templating engines and full-fledged JavaScript frameworks by providing a lightweight, extensible solution that emphasizes performance and developer experience.

## 🏆 Project Goals

- Develop a robust JavaScript HTML template parser and view renderer engine.
- Establish a foundation for a more comprehensive JavaScript framework, potentially including features like advanced component models, dependency injection, and build tools.
- Serve as a learning tool for understanding the complexities of modern framework development.

## ⚙️ Installation

1.  Include the `kasper.min.js` script in your HTML file:

    ```html
    <script src="path/to/kasper.min.js"></script>
    ```

    (Or use a CDN if available in the future).

2.  Alternatively, for development, you can build the project from the source:
    ```bash
    npm install
    npm run build
    ```
    This will generate `kasper.min.js` in the `dist` folder.

## 📦 Usage Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Kasper App</title>
    <script src="dist/kasper.min.js"></script>
    <!-- Adjust path as needed -->
  </head>
  <body>
    <template id="myAppTemplate">
      <div>Hello, {{this.appName}}!</div>
      <button @on:click="this.updateName()">Change Name</button>
    </template>

    <div id="app-root"></div>

    <script>
      class MyApp extends kasper.Component {
        appName = $state("Kasper App"); // Use $state for reactive properties

        constructor() {
          super({
            selector: "template#myAppTemplate", // Define the template to use
          });
        }

        updateName() {
          this.appName.set("Kasper App Updated!");
        }
      }

      // Initialize and render the application
      kasper.App({
        registry: {
          "my-app": MyApp,
        },
        root: "#app-root", // Specify the root element to render into
        main: "<my-app></my-app>", // Specify the main component to render
      });
    </script>
  </body>
</html>
```

## 🏗️ Architecture Overview

Kasper-js is built with a modular architecture:

- **Scanner (Lexer)**: Tokenizes the input HTML and template syntax.
- **HTML Parser**: Parses HTML content into a DOM-like structure.
- **Expression Parser**: Parses Kasper's JavaScript-like expressions within the templates.
- **Interpreter**: Evaluates the parsed expressions, handling logic, data binding, and event handling.
- **Renderer/Viewer**: Manages the rendering of templates to the actual DOM and updates the view when state changes.
- **Component System**: Provides a base `Component` class for creating reusable UI elements with their own logic and state.

### 💡 Design Decisions & Rationale

- **Valid HTML Syntax**: A core design goal is to ensure that Kasper's template syntax (`@if`, `@each`, `{{expression}}`, etc.) is embedded in a way that keeps the overall HTML structure valid. This allows developers to use standard HTML tools and linters.
- **Separation of Concerns**: While Kasper-js allows inline expressions for convenience, the component-based structure encourages separating template logic (in classes) from the presentation (in HTML templates).
- **Lightweight Core**: The focus is on providing essential templating and rendering capabilities without the overhead of a larger framework, making it suitable for smaller projects or for learning purposes.

### 🛠️ Tech Stack

- **TypeScript**: Used for its strong typing capabilities, improving code quality and maintainability.
- **Webpack**: Utilized for bundling the project into distributable files.
- **Jasmine**: Employed for unit testing.

## 📝 Template Syntax Highlights

Kasper's template syntax is designed to be intuitive and integrate seamlessly with HTML.

### 🔀 Conditional Rendering

```html
<div @if="this.user.isLoggedIn">Welcome, {{this.user.name}}!</div>
<div @elseif="this.isLoading">Loading...</div>
<div @else>Please log in.</div>
```

### 📋 List Rendering (`@each`)

```html
<ul>
  <li @each="item of this.items">{{item.name}} (Index: {{index}})</li>
</ul>
```

### 🏷️ Local Variables (`@let`)

Evaluated during element creation, useful for aliasing or pre-calculating values.

```html
<div
  @let="fullName = this.user.firstName + ' ' + this.user.lastName; isActive = this.user.status === 'active'"
>
  User: {{fullName}}, Status: {{isActive ? 'Active' : 'Inactive'}}
</div>
```

### 🔁 While Loops (`@while`)

```html
<div @let:counter="0">
  <span @while="counter < 3">
    Iteration: {{counter}} {{ void (counter = counter + 1) }}
    <!-- Use void for expressions without output -->
  </span>
</div>
```

### 🖱️ Event Handling (`@on:event`)

```html
<button @on:click="this.handleClick($event)">Click Me</button>
<input @on:input="this.onInputChange($event.target.value)" />
```

### 🧩 Text Interpolation (`{{expression}}`)

Evaluates the expression and inserts the result as a text node.

```html
<div>Current count: {{this.count}}</div>
<div>Full Name: {{this.user.firstName + " " + this.user.lastName}}</div>
```

### 🏷️ Attribute Binding (`@attr:name="expression"`)

Dynamically sets HTML attributes.

```html
<a @attr:href="this.url">Visit Site</a>
<img @attr:src="this.imageUrl" @attr:alt="this.imageAltText" />
<div @attr:class="this.isActive ? 'active-class' : 'inactive-class'">
  Dynamic Class
</div>
```

## 🧮 Supported JavaScript Expressions

The Kasper expression interpreter supports a subset of JavaScript expressions, enabling dynamic template rendering:

- **Assign**: `variable = value`
- **Binary**: `a + b`, `a > b`, etc.
- **Call**: `this.myFunction(arg1, arg2)`
- **Dictionary (Object Literals)**: `{ key: 'value', anotherKey: this.data }`
- **Get (Property Access)**: `this.object.property`, `this.array[0]`
- **Grouping**: `(a + b) * c`
- **Key (Object Keys in Literals)**: `{ [this.dynamicKey]: 'value' }` (Note: Support level may vary)
- **Logical**: `a && b`, `a || b`
- **List (Array Literals)**: `[1, 'string', this.value]`
- **Literal**: `"string"`, `123`, `true`, `false`, `null`, `undefined`
- **New**: `new Date()` (Limited to globally accessible constructors or those imported/available in scope)
- **Null Coalescing**: `this.value ?? 'default'`
- **Postfix**: `i++`, `i--` (Primarily within loop constructs or specific contexts)
- **Set (Property Assignment)**: `this.object.property = value`
- **Template (String Interpolation in Expressions)**: `` `Hello, ${this.name}` `` (Note: This is distinct from the `{{ }}` template interpolation)
- **Ternary**: `condition ? valueIfTrue : valueIfFalse`
- **Typeof**: `typeof this.variable`
- **Unary**: `!this.isTrue`, `-this.value`
- **Variable**: `this.myVariable`
- **Void**: `void this.doSomething()` (Used when an expression's return value should not be rendered)

### 🚧 Future Enhancements for Expressions

Future development aims to expand the capabilities of the expression interpreter, potentially including more advanced JavaScript features and better error handling.

## 🧪 Testing

- Kasper-js uses **Jasmine** for unit testing.
- Test files are located in the `/spec` folder.
- Current test coverage needs improvement. Contributions in this area are highly welcome to enhance the framework's robustness.
  ```bash
  npm test
  ```

## 🤝 Contributing

Contributions are welcome! As a work-in-progress, there are many areas for improvement and new features.
Please provide clear descriptions for your changes.

## 🗺️ To-Do / Future Roadmap

- Improve state re-rendering efficiency and granularity.
- Enhance the component lifecycle hooks.
- Expand test coverage significantly.
- Develop more comprehensive documentation.
- Explore possibilities for server-side rendering (SSR).
- Investigate advanced features like routing and global state management.

## 📄 License

Kasper-js is licensed under the [MIT License](LICENSE).
