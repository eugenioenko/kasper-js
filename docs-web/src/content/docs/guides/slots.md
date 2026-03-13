---
title: Slots
description: Content transclusion with slots.
---

Slots allow a parent component to inject content into a child component's template.

## Default slot

In the child component template, use `<slot />` as a placeholder:

```html
<!-- Card.kasper -->
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

The parent passes content between the component's tags:

```html
<card>
  <p>This content goes into the slot.</p>
</card>
```

## Named slots

Use `name` to define multiple slots:

```html
<!-- Modal.kasper -->
<template>
  <div class="modal">
    <header>
      <slot @name="title" />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot @name="actions" />
    </footer>
  </div>
</template>
```

Pass content to named slots using the `@slot` attribute:

```html
<modal>
  <span @slot="title">Confirm action</span>
  <p>Are you sure you want to proceed?</p>
  <div @slot="actions">
    <button @on:click="confirm()">Yes</button>
    <button @on:click="cancel()">No</button>
  </div>
</modal>
```

Content without a `@slot` attribute goes to the default slot.
