---
title: Routing
description: Client-side routing with the built-in router.
sidebar:
  order: 7
---

Kasper includes a built-in client-side router. It supports static paths, dynamic segments, catch-all routes, and async guards.

## Setup

Add `<router>` to your app template and declare routes as children:

```html
<!-- App.kasper -->
<template>
  <navbar></navbar>
  <router>
    <route @path="/" @component="HomePage" />
    <route @path="/about" @component="AboutPage" />
    <route @path="/users/:id" @component="UserPage" />
    <route @path="*" @component="NotFound" />
  </router>
</template>

<script>
import { Component } from 'kasper-js';
import { HomePage } from './HomePage.kasper';
import { AboutPage } from './AboutPage.kasper';
import { UserPage } from './UserPage.kasper';
import { NotFound } from './NotFound.kasper';

export class App extends Component {}
</script>
```

`<route>` and `<guard>` are config nodes — they never render themselves. Only the matched route's component is rendered.

## Route params

Use `:segment` in `@path` to define dynamic segments. Params are passed to the component via `this.args.params`:

```ts
export class UserPage extends Component {
  onInit() {
    const id = this.args.params.id;
  }
}
```

```html
<template>
  <h1>User {{args.params.id}}</h1>
</template>
```

## Navigation

Import `navigate` and call it from anywhere — a button handler, a guard, a service:

```ts
import { navigate } from 'kasper-js';

navigate('/about');
navigate('/users/42');
```

`navigate` uses the History API (`pushState`) so URLs are clean with no hash.

## Guards

Add `@guard` to a route to run an async check before rendering. If the guard returns `false`, the route does not render:

```html
<route @path="/dashboard" @component="DashboardPage" @guard="checkAuth" />
```

```ts
import { navigate } from 'kasper-js';

async function checkAuth(): Promise<boolean> {
  const user = await fetchCurrentUser();
  if (!user) {
    navigate('/login');
    return false;
  }
  return true;
}
```

The guard calls `navigate()` itself to handle the redirect — no extra config needed.

## Guard groups

Use `<guard>` to protect multiple routes with a single check:

```html
<router>
  <route @path="/" @component="HomePage" />
  <route @path="/login" @component="LoginPage" />

  <guard @check="checkAuth">
    <route @path="/dashboard" @component="DashboardPage" />
    <route @path="/settings" @component="SettingsPage" />
    <route @path="/profile/:id" @component="ProfilePage" />
  </guard>

  <route @path="*" @component="NotFound" />
</router>
```

Guards can be nested for different permission levels:

```html
<guard @check="checkAuth">
  <route @path="/dashboard" @component="DashboardPage" />

  <guard @check="checkAdmin">
    <route @path="/admin" @component="AdminPage" />
  </guard>
</guard>
```

## Catch-all / 404

Use `@path="*"` as the last route to handle unmatched paths:

```html
<route @path="*" @component="NotFound" />
```

Routes are matched in order — the first match wins.
