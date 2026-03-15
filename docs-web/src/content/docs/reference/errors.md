---
title: Error Reference
description: Complete catalog of Kasper.js error codes and their solutions.
---

When Kasper.js encounters an issue, it throws an error with a specific code. This page explains what each code means and how to fix it.

---

## K001: Bootstrap Errors

### K001-1: ROOT_ELEMENT_NOT_FOUND
**Description:** The root element specified in `App({ root: ... })` could not be found in the DOM.

**Fix:**
- Ensure the ID or selector matches an element in your `index.html`.
- If you are passing an `HTMLElement` directly, ensure it is not `null`.

### K001-2: ENTRY_COMPONENT_NOT_FOUND
**Description:** The entry component tag specified in `App({ entry: ... })` was not found in your component registry.

**Fix:**
- Check for typos in the `entry` property.
- Ensure the component is correctly registered in the `registry` object.

---

## K002: Scanning Errors

### K002-1: UNTERMINATED_COMMENT
**Description:** A CSS-style comment `/* ... */` was started but never closed.

**Fix:** Add `*/` at the end of your comment.

### K002-2: UNTERMINATED_STRING
**Description:** A string literal (single or double quotes) was started but never closed.

**Fix:** Ensure every opening quote has a matching closing quote on the same line.

### K002-3: UNEXPECTED_CHARACTER
**Description:** The expression scanner found a character it doesn't recognize.

**Fix:** Check for typos in your expressions, such as unusual symbols or invisible characters.

---

## K003: Template Parsing Errors

### K003-1: UNEXPECTED_EOF
**Description:** The template ended abruptly while the parser was still expecting more content.

**Fix:** Check for unclosed tags or attributes.

### K003-2: UNEXPECTED_CLOSING_TAG
**Description:** Found a closing tag (e.g. `</div>`) that doesn't match any open tag.

**Fix:** Ensure your HTML structure is valid and every tag is correctly nested.

### K003-3: EXPECTED_TAG_NAME
**Description:** An opening `<` was found but wasn't followed by a valid tag name.

**Fix:** Ensure you don't have stray `<` characters in your template.

### K003-4: EXPECTED_CLOSING_BRACKET
**Description:** An element was started but the closing `>` was never found.

**Fix:** Close your HTML tags properly.

### K003-5: EXPECTED_CLOSING_TAG
**Description:** A specific closing tag was expected to match an open one, but was missing or mismatched.

**Fix:** Correct the nesting of your elements.

### K003-6: BLANK_ATTRIBUTE_NAME
**Description:** An attribute was found without a name (e.g. `<div ="val">`).

**Fix:** Provide a name for the attribute or remove the stray `=`.

### K003-7: MISPLACED_CONDITIONAL
**Description:** An `@elseif` or `@else` directive was used on an element that was not immediately preceded by an `@if` or `@elseif` block.

**Fix:** Ensure that `@elseif` and `@else` are immediate siblings of an `@if` element. Only whitespace and comments are allowed between them.

### K003-8: DUPLICATE_IF
**Description:** More than one conditional directive (`@if`, `@elseif`, `@else`) was found on the same element.

**Fix:** Use only one conditional directive per element. Use nested elements if you need complex logic.

---

## K004: Expression Parsing Errors

### K004-1: UNEXPECTED_TOKEN
**Description:** The expression parser found a symbol in a place where it doesn't belong.

**Fix:** Review the syntax of the expression in your `{{ }}` or `@` directive.

### K004-2: INVALID_LVALUE
**Description:** You tried to assign a value to something that cannot be assigned to (e.g. `{{ 1 = 2 }}`).

**Fix:** Ensure the left side of your assignment is a variable or property.

### K004-3: EXPECTED_EXPRESSION
**Description:** A directive or interpolation was empty or ended prematurely.

**Fix:** Provide a valid expression.

### K004-4: INVALID_DICTIONARY_KEY
**Description:** A dictionary/object key must be a string, number, or identifier.

**Fix:** Check your object literals: `{ key: value }`.

---

## K005: Runtime Errors (Interpreter)

### K005-1: INVALID_POSTFIX_LVALUE
**Description:** Increment/Decrement operators (`++`, `--`) can only be used on variables.

**Fix:** Use a variable: `count++` instead of `5++`.

### K005-2: UNKNOWN_BINARY_OPERATOR
**Description:** An unsupported math or logic operator was used.

**Fix:** Use standard JS operators (+, -, *, /, &&, ||, etc).

### K005-3: INVALID_PREFIX_RVALUE
**Description:** Prefix increment/decrement used incorrectly.

**Fix:** Use a variable: `++count`.

### K005-4: UNKNOWN_UNARY_OPERATOR
**Description:** An unsupported single-operand operator was used.

**Fix:** Check your syntax.

### K005-5: NOT_A_FUNCTION
**Description:** You tried to call a value as a function, but it is not a function.

**Fix:** Ensure the variable you are calling is defined as a method in your component class.

### K005-6: NOT_A_CLASS
**Description:** The `new` keyword was used on a value that is not a class.

**Fix:** Ensure you are instantiating a valid class.

---

## K006: Signal Errors

### K006-1: CIRCULAR_COMPUTED
**Description:** A circular dependency was detected between computed signals.

**Fix:** Ensure computed signals don't depend on each other in a loop (e.g. A depends on B, and B depends on A).

---

## K007: Transpiler Errors

### K007-1: RUNTIME_ERROR
**Description:** A general error occurred during the transpilation of a component.

**Fix:** Check the console for the component name and the specific error message provided.

### K007-2: MISSING_REQUIRED_ATTR
**Description:** A framework-level tag (like `<route>` or `<guard>`) is missing a required attribute.

**Fix:**
- For `<route>`, ensure you provide `@path` and `@component`.
- For `<guard>`, ensure you provide `@check`.
