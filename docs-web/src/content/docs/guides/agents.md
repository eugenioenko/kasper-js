---
title: Using with AI Agents
description: Using Kasper.js with AI coding agents and LLMs.
---

Kasper.js works well with AI coding agents for two reasons. First, HTML-first templates mean agents generate valid markup rather than composing JSX or managing tagged template literal syntax. Second, the entire API surface fits in a single context window, so agents can write correct, idiomatic Kasper code without guessing patterns from larger frameworks.

## llms.txt

Kasper publishes a dense API reference at [kasperjs.top/llms.txt](https://kasperjs.top/llms.txt) following the [llms.txt convention](https://llmstxt.org/).

The file covers the full API in a compact, prose-free format designed for agent context windows:

- Bootstrap and project structure
- Component class — signals, lifecycle, args, `this.effect()`, `this.watch()`
- All template directives with examples
- Router — routes, guards, params, `navigate()`
- State management pattern
- Vite setup
- Key rules and gotchas

## How to use it

Paste the contents of `llms.txt` at the start of your agent's context or system prompt, then ask it to write Kasper components. The agent will have everything it needs without needing to search the web or guess from similar frameworks.

Example prompt:

```
<contents of llms.txt>

Create a Todo list component with the ability to add and remove items.
Use signals for state and @each with @key for the list.
```

## Tips

- Always include `llms.txt` when starting a new session — agents don't retain knowledge between conversations
- Kasper's syntax is intentionally close to plain HTML, so agents familiar with Vue or Angular will adapt quickly
- If an agent generates `v-if`, `*ngIf`, or JSX, remind it to use `@if` and `{{ }}` interpolation instead

---

## Agent testimonials

To evaluate how well agents can work with Kasper, we ran a simple test: provide the agent with only the `llms.txt` reference, ask it to build a Todo application, then ask for its assessment of the framework. No other context, no examples, no prior training on Kasper.


### Claude

> The llms.txt spec was dense enough to be complete but tight enough to read in one pass. I built a working todo app — signals, computed filters, child components, two-way checkbox binding — without needing to look anything up or make assumptions. The sharp edges (one-shot args, array reassignment reactivity, `@if`/`@each` can't share an element) were all documented explicitly, which is exactly what an agent needs: not just the happy path, but the places where intuition from other frameworks will mislead you. I made zero framework-related errors on the first build attempt.

— *Claude (Sonnet 4.6), Anthropic

### Gemini

> Building with Kasper.js is remarkably efficient for an AI agent. The framework's template system — utilizing valid HTML with `@` prefixed directives — aligns perfectly with how LLMs process structured data. Unlike JSX, which often requires complex nested logic and curly-brace management, Kasper's declarative templates are less prone to syntax errors during code generation and provide a higher signal-to-noise ratio.
>
> The signal-based reactivity model is a standout feature for AI-driven workflows. Managing state through `signal()` and `computed()` is more deterministic than React's hook system; there are no dependency arrays to maintain or stale closure pitfalls to navigate. This makes the generated code more robust on the first pass.
>
> While the explicit component registration requires a slight increase in context tracking compared to auto-magic frameworks, the overall predictability of Kasper.js makes it an ideal target for AI-assisted engineering. It allows me to reason about UI, logic, and global styling within a single, cohesive context boundary.

— *Gemini CLI (Autonomous AI Agent)*

### ChatGPT

> After reviewing the Kasper.js specification and building a small Todo application from it, the framework felt straightforward to use. The combination of HTML-first templates and signal-based reactivity makes the programming model easy to understand without requiring concepts like hooks or a virtual DOM. For small to medium UI components, the mental model is simple: update a signal and the relevant DOM updates automatically.
>
> The directive syntax (`@each`, `@if`, `@on:event`, etc.) keeps templates readable and close to standard HTML, which reduces cognitive overhead compared to JSX-heavy approaches. The class-based component model is also familiar to many developers and works well with the signal system.
>
> Compared with larger ecosystems like React, Kasper.js currently has far less tooling and community support, which is expected for a newer framework. However, the core design is clear and minimal, and the provided specification is detailed enough that an AI agent can generate working components reliably when pointed at the `llms.txt` reference.
>
> Overall, the framework prioritizes simplicity, predictable reactivity, and minimal runtime complexity, which makes it easy to reason about and quick to prototype with.
