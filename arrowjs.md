Docs
API
Playground
2.7k

@arrow-js/core
reactive()
watch()
html
component()
onCleanup()
pick() / props()
nextTick()
@arrow-js/framework
render()
boundary()
toTemplate()
renderDocument()
@arrow-js/ssr
renderToString()
serializePayload()
@arrow-js/hydrate
hydrate()
readPayload()
@arrow-js/sandbox
sandbox()
Types
Type Reference
API Reference

Copy page

@arrow-js/core
reactive()
Creates observable state or computed values.

Signatures
import type {
Computed,
Reactive,
ReactiveTarget } from '@arrow-js/core'

// Observable state
declare function
reactive<
T extends
ReactiveTarget>(
data:
T):
Reactive<
T>

// Computed value
declare function
reactive<
T>(
effect: () =>
T):
Computed<
T>
Observable state
Pass an object or array to get a reactive proxy. Property reads are tracked inside watchers and template expressions. Property writes notify observers.

import {
reactive } from '@arrow-js/core'

const
data =
reactive({
count: 0,
items: [] as string[] })

data.
count++ // triggers observers
data.
items.
push('hello') // array mutations trigger parent observers
Computed values
Pass an arrow function to create a computed value. The expression re-evaluates when tracked reads change.

import {
reactive } from '@arrow-js/core'

const
props =
reactive({
count: 2,
multiplier: 10 })

const
data =
reactive({

total:
reactive(() =>
props.
count \*
props.
multiplier)
})

data.
total // 20 — reads like a normal value, auto-updates
Manual subscriptions
data.
$on('count', (
newVal,
oldVal) => { /* ... */ })
data.
$off('count',
callback)
Prefer watch() or template expressions over manual subscriptions. Use $on/$off only when you need direct per-property control.

Rules
Only objects and arrays can be reactive. Primitives cannot.
Nested objects are lazily made reactive on first access.
reactive() on an already-reactive object returns the same proxy (idempotent).
watch()
Runs side effects that re-execute when tracked reactive reads change.

Signatures
// Single-effect form
declare function
watch<
F extends () => unknown>(

effect:
F
): [
returnValue:
ReturnType<
F>,
stop: () => void]

// Getter + afterEffect form
declare function
watch<
F extends () => unknown,
A extends (
arg:
ReturnType<
F>) => unknown>(

effect:
F,

afterEffect:
A
): [
returnValue:
ReturnType<
A>,
stop: () => void]
Parameters
effect — A function that reads reactive properties. Runs immediately on creation. In the single-effect form, this is both the tracker and the side effect.
afterEffect (optional) — Receives the return value of effect. Only the effect function tracks dependencies; the afterEffect runs after dependency collection.
Returns
A tuple [returnValue, stop]. Call stop() to unsubscribe from all tracked dependencies.

When a watcher is created inside component(), Arrow also stops it automatically when that component unmounts.

Examples
import {
reactive,
watch } from '@arrow-js/core'

const
data =
reactive({
price: 25,
quantity: 10 })

// Single-effect: tracks and runs in one function
const [,
stop] =
watch(() => {

console.
log(`Total: ${
data.
price *
data.
quantity}`)
})

// Getter + effect: separates tracking from side effect
watch(
() =>
data.
price \*
data.
quantity,
(
total) =>
console.
log(`Total: ${
total}`)
)

// Stop watching
stop()
Rules
Dependencies are auto-discovered from reactive reads.
Dependencies no longer read on subsequent runs are dropped.
html
Tagged template literal that creates an ArrowTemplate.

Signature
import type {
ArrowExpression, ArrowTemplate } from '@arrow-js/core'

declare function
html(

strings: TemplateStringsArray | string[],
...
expSlots:
ArrowExpression[]
): ArrowTemplate
Mounting
An ArrowTemplate is callable. Pass a parent node to mount into the DOM, or call with no arguments to get a DocumentFragment.

const
template =
html`<h1>Hello</h1>`

// Mount to a DOM node
template(
document.
getElementById('app'))

// Get a DocumentFragment
const
fragment =
template()
Expression types
Static — Any non-function value. Renders once.
html`<p>${
someString}</p>`
Reactive — A function expression. Re-evaluates when tracked reads change.
html`<p>${() =>
data.
count}</p>`
Template / component — Nest directly.
html`<div>${
otherTemplate}</div>`
html`<div>${
MyComponent({
label: 'hi' })}</div>`
Array — Renders a list of templates.
html`<ul>${() =>
items.
map(
i =>
html`<li>${
i.
name}</li>`)}</ul>`
Attribute binding
Static or reactive. Return false to remove the attribute.

// Static
html`<div class="${
cls}"></div>`

// Reactive
html`<div class="${() =>
data.
active ? 'on' : 'off'}"></div>`

// Boolean removal
html`<button disabled="${() =>
data.
loading ? '' : false}">Submit</button>`
Property binding
Prefix with . to set an IDL property instead of an attribute.

html`<input .value="${() =>
data.
text}" />`
Event binding
Prefix with @ to attach an event listener.

html`<button @click="${(
e) =>
handleClick(
e)}">Click</button>`
List keys
Call .key() on a template to give it stable identity in a list. Without keys, list patches reuse slots by position.

html`<ul>${() =>
items.
map(
item =>

html`<li>${
item.
name}</li>`.
key(
item.
id)
)}</ul>`
component()
Wraps a factory function to provide stable local state across parent re-renders.

Signatures
import type {
ArrowTemplate,
AsyncComponentOptions,
Component,
ComponentWithProps,
Props,
ReactiveTarget,
} from '@arrow-js/core'

// Sync — no props
declare function component(
factory: () => ArrowTemplate
): Component

// Sync — with props
declare function component<T extends ReactiveTarget>(
factory: (props: Props<T>) => ArrowTemplate
): ComponentWithProps<T>

// Async — no props
declare function component<TValue, TSnapshot = TValue>(
factory: () => Promise<TValue> | TValue,
options?: AsyncComponentOptions<ReactiveTarget, TValue, TSnapshot>
): Component

// Async — with props
declare function component<T extends ReactiveTarget, TValue, TSnapshot = TValue>(
factory: (props: Props<T>) => Promise<TValue> | TValue,
options?: AsyncComponentOptions<T, TValue, TSnapshot>
): ComponentWithProps<T>
AsyncComponentOptions
import type {
AsyncComponentOptions } from '@arrow-js/core'
Usage
import {
component,
html,
onCleanup,
reactive } from '@arrow-js/core'
import type {
Props } from '@arrow-js/core'

// Sync component with props
const
Counter =
component((
props:
Props<{
count: number }>) => {
const
local =
reactive({
clicks: 0 })
const
onResize = () =>
console.
log('resize')

window.
addEventListener('resize',
onResize)

onCleanup(() =>
window.
removeEventListener('resize',
onResize))

return
html`<button @click="${() =>
local.
clicks++}">
    Root ${() =>
props.
count} | Local ${() =>
local.
clicks}
  </button>`
})

// Async component
const
UserName =
component(async ({
id }: {
id: string }) => {
const
user = await
fetch(`/api/users/${
id}`).
then(
r =>
r.
json())
return
user.name
})
.key() for lists
Call .key() on the component call to preserve identity when rendering in a keyed list.

html`${() =>
items.
map(
item =>

ItemCard(
item).
key(
item.
id)
)}`
Rules
The factory runs once per slot, not on every update.
Never destructure props at the top of the factory — read them lazily inside reactive expressions.
SSR waits for all async components to resolve before returning HTML.
JSON-safe async results are auto-serialized into the hydration payload.
onCleanup()
Registers teardown work for the current component instance.

Signature
declare function
onCleanup(
fn: () => void): () => void
Behavior
Call it inside component() while setting up local side effects.
Arrow runs the cleanup automatically when that component slot unmounts.
It also returns a disposer so you can stop the side effect early.
Example
import {
component,
html,
onCleanup } from '@arrow-js/core'

const
ResizeProbe =
component(() => {
const
onResize = () =>
console.
log(
window.
innerWidth)

window.
addEventListener('resize',
onResize)

onCleanup(() =>
window.
removeEventListener('resize',
onResize))

return
html`<div>Watching resize…</div>`
})
Tip
Use onCleanup() for manual subscriptions like DOM listeners, timers, sockets, or anything else Arrow did not create for you.

pick() / props()
Narrows a reactive object down to specific keys. props is an alias for pick.

Signatures
declare function
pick<
T extends object,
K extends keyof
T>(

source:
T,
...
keys:
K[]
):
Pick<
T,
K>

declare function
pick<
T extends object>(
source:
T):
T

const
props =
pick // alias
Usage
import {
pick,
reactive } from '@arrow-js/core'

const
state =
reactive({
count: 1,
theme: 'dark',
locale: 'en' })

// Pass only the keys a component needs
html`${
Counter(
pick(
state, 'count'))}`

// Without keys — returns the source as-is
html`${
Counter(
pick(
state))}`
Tip
The returned object is a live proxy — reads and writes flow through to the source. It is not a copy.

nextTick()
Flushes Arrow's internal microtask queue, then runs an optional callback.

Signature
declare function
nextTick(
fn?: CallableFunction):
Promise<unknown>
Usage
import {
nextTick,
reactive } from '@arrow-js/core'

const
data =
reactive({
count: 0 })

data.
count = 5

// Wait for all pending reactive updates to flush
await
nextTick()
// DOM is now updated

// Or pass a callback
nextTick(() => {

console.
log('DOM updated')
})
Arrow batches reactive updates into a microtask. nextTick lets you wait for that flush before reading the DOM or performing follow-up work.

@arrow-js/framework
render()
Full-lifecycle render that mounts a view into a root element, tracking async components and boundaries.

Signature
import type { RenderOptions, RenderResult } from '@arrow-js/framework'

declare function
render(

root: ParentNode,

view: unknown,

options?: RenderOptions
):
Promise<RenderResult>
RenderOptions
import type { RenderOptions } from '@arrow-js/framework'
RenderResult
import type { RenderPayload, RenderResult } from '@arrow-js/framework'
Usage
import {
render } from '@arrow-js/framework'
import {
html } from '@arrow-js/core'

const
view =
html`<h1>Hello</h1>`
const {
root,
payload } = await
render(
document.
getElementById('app'),
view)
boundary()
Wraps a view in hydration boundary markers, enabling targeted recovery during hydration.

Signature
import type { ArrowTemplate } from '@arrow-js/core'
import type { BoundaryOptions } from '@arrow-js/framework'

declare function
boundary(

view: unknown,

options?: BoundaryOptions
): ArrowTemplate
Usage
import {
boundary } from '@arrow-js/framework'
import {
html } from '@arrow-js/core'

html`

  <main>
    ${
boundary(
Sidebar(), {
idPrefix: 'sidebar' })}
    ${
boundary(
Content(), {
idPrefix: 'content' })}
  </main>
`
This inserts <template data-arrow-boundary-start/end> markers in the HTML. During hydration, if a subtree mismatches, Arrow repairs that boundary region instead of replacing the entire root.

When to use
Always wrap async components in a boundary for SSR/hydration recovery. Also useful around any subtree that may diverge between server and client (e.g. time-dependent content).

toTemplate()
Normalizes any view value into an ArrowTemplate. Useful when you have a value that might be a string, number, template, or component call and need a consistent template type.

Signature
import type { ArrowTemplate } from '@arrow-js/core'

declare function
toTemplate(
view: unknown): ArrowTemplate
Usage
import {
toTemplate } from '@arrow-js/framework'
import {
html } from '@arrow-js/core'

const
view = 'Hello, world'
const
template =
toTemplate(
view)

// Now usable anywhere an ArrowTemplate is expected
template(
document.
getElementById('app'))
renderDocument()
Injects rendered HTML, head content, and payload script into an HTML shell template string. Used in custom server setups.

Signature
import type { DocumentRenderParts } from '@arrow-js/framework'

declare function
renderDocument(

template: string,

parts: DocumentRenderParts
): string
Placeholder markers
The template string should contain these HTML comment placeholders:

<!--app-head--> — replaced with parts.head
<!--app-html--> — replaced with parts.html
<!--app-payload--> — replaced with parts.payloadScript

@arrow-js/ssr
renderToString()
Renders a view to an HTML string on the server. Waits for all async components to resolve before returning.

This is the main SSR entry point. Use it inside your request handler after you have chosen the page and built the Arrow view for the incoming URL.

Signature
import type {
HydrationPayload,
SsrRenderOptions,
SsrRenderResult,
} from '@arrow-js/ssr'

declare function
renderToString(

view: unknown,

options?: SsrRenderOptions
):
Promise<SsrRenderResult>
Usage
import {
renderToString,
serializePayload } from '@arrow-js/ssr'

const {
html,
payload } = await
renderToString(
view)

// Serialize payload for client-side hydration
const
script =
serializePayload(
payload)
Typical server flow
import { renderToString, serializePayload } from '@arrow-js/ssr'

export async function renderPage(url: string) {
const page = routeToPage(url)
const result = await renderToString(page.view)

return [
'<!doctype html>',
'<html>',
' <head>',
` <title>${page.title}</title>`,
' </head>',
' <body>',
` <div id="app">${result.html}</div>`,
` ${serializePayload(result.payload)}`,
' </body>',
'</html>'
].join('\n')
}
Internally uses JSDOM to render templates into a virtual DOM, then serializes the result. All async components are awaited and their results captured in the payload.

serializePayload()
Serializes a hydration payload into a <script type="application/json"> tag that can be embedded in the HTML document.

Signature
declare function
serializePayload(

payload: unknown,

id?: string // default: 'arrow-ssr-payload'
): string
Returns
An HTML string containing a <script> tag with the JSON-serialized payload. The id attribute matches what readPayload() looks for on the client.

const
payload = {
rootId: 'app',
async: {},
boundaries: [] }

const
defaultScript =
serializePayload(
payload)
// <script id="arrow-ssr-payload" type="application/json">{...}</script>

// Custom id
const
customScript =
serializePayload(
payload, 'my-payload')
// <script id="my-payload" type="application/json">{...}</script>
Tip
The serializer escapes </script> sequences inside the JSON to prevent injection.

@arrow-js/hydrate
hydrate()
Reconciles server-rendered HTML with the client-side view tree, reconnecting reactivity without replacing existing DOM nodes.

Call it once in your browser entry after reading the server payload and rebuilding the same page view that was used during SSR.

Signature
import type {
HydrationOptions,
HydrationPayload,
HydrationResult,
} from '@arrow-js/hydrate'

declare function
hydrate(

root: ParentNode,

view: unknown,

payload?: HydrationPayload,

options?: HydrationOptions
):
Promise<HydrationResult>
HydrationOptions
import type {
HydrationMismatchDetails,
HydrationOptions,
} from '@arrow-js/hydrate'
HydrationResult
import type { HydrationResult } from '@arrow-js/hydrate'
Usage
import {
hydrate,
readPayload } from '@arrow-js/hydrate'
import {
createApp } from './app'

const
payload =
readPayload()
const
root =
document.
getElementById('app')!

const
result = await
hydrate(
root,
createApp(),
payload, {

onMismatch: (
details) => {

console.
warn('Hydration mismatch:',
details)
}
})
Typical client flow
import { hydrate, readPayload } from '@arrow-js/hydrate'

const payload = readPayload()
const root = document.getElementById(payload.rootId ?? 'app')

if (!root) {
throw new Error('Missing #app root')
}

await hydrate(
root,
routeToPage(window.location.pathname).view,
payload
)
When the server HTML matches the client view, Arrow adopts the existing DOM nodes and attaches reactive bindings. When a mismatch is detected, boundary regions are repaired individually before falling back to a full root replacement.

readPayload()
Reads the hydration payload from a <script type="application/json"> tag embedded in the document by the server.

Signature
declare function
readPayload(

doc?: Document, // default: document

id?: string // default: 'arrow-ssr-payload'
):
HydrationPayload
Usage
import {
readPayload } from '@arrow-js/hydrate'

// Default — reads from document, id="arrow-ssr-payload"
const
payload =
readPayload()

// Custom document and id
const
iframe =
document.
querySelector('iframe')
const
payloadFromFrame =
iframe?.
contentDocument
?
readPayload(
iframe.
contentDocument, 'my-payload')
: null
@arrow-js/sandbox
sandbox()
Returns an ArrowTemplate that renders a stable <arrow-sandbox> host element and boots a QuickJS + WASM VM behind it.

Signature
import type { ArrowTemplate } from '@arrow-js/core'

interface SandboxProps {

source:
Record<string, string>

shadowDOM?: boolean;

onError?: (
error: Error | string) => void;

debug?: boolean;
}

interface SandboxEvents {

output?: (
payload: unknown) => void;
}

declare function
sandbox<
T extends {

source: object;

shadowDOM?: boolean;

onError?: (
error: Error | string) => void;

debug?: boolean;
}>(

props:
T,

events?: SandboxEvents
): ArrowTemplate
Rules
source must contain exactly one main.ts or main.js entry file.
main.css is optional and is injected into the sandbox host root. By default that root is an open shadow root.
Pass shadowDOM: false to render into the custom element’s light DOM instead.
Use the optional second argument to receive output(payload) calls from inside the sandbox.
Usage
import {
html } from '@arrow-js/core'
import {
sandbox } from '@arrow-js/sandbox'

const
source = {
'main.ts': [
"import { html, reactive } from '@arrow-js/core'",
'',
'const state = reactive({ count: 0 })',
'',
'export default html`<button @click="${() => state.count++}">',
' Count ${() => state.count}',
'</button>`',
].
join('\n'),
}

html`<main>${
sandbox({
source }, {

output(
payload) {

console.
log(
payload)
},
})}</main>`
Security Model
User-authored Arrow code runs inside QuickJS/WASM. The host page only mounts trusted DOM and forwards sanitized event payloads. It does not run user callbacks in the window realm.

Type Reference
All types are exported from their respective packages. Import them with the type keyword for type-only imports.

@arrow-js/core
export type ParentNode = Node | DocumentFragment

export interface ArrowTemplate {
(parent: ParentNode): ParentNode
(): DocumentFragment
isT: boolean
key: (key: ArrowTemplateKey) => ArrowTemplate
id: (id: ArrowTemplateId) => ArrowTemplate
\_c: () => Chunk
\_k: ArrowTemplateKey
\_i?: ArrowTemplateId
}

export type ArrowTemplateKey = string | number | undefined
type ArrowTemplateId = string | number | undefined

export type ArrowRenderable =
| string
| number
| boolean
| null
| undefined
| ComponentCall
| ArrowTemplate
| Array<string | number | boolean | ComponentCall | ArrowTemplate>

export type ArrowFunction = (...args: unknown[]) => ArrowRenderable

export type ArrowExpression =
| ArrowRenderable
| ArrowFunction
| EventListener
| ((evt: InputEvent) => void)

export type ReactiveTarget = Record<PropertyKey, unknown> | unknown[]

interface ReactiveAPI<T> {
$on: <P extends keyof T>(p: P, c: PropertyObserver<T[P]>) => void
$off: <P extends keyof T>(p: P, c: PropertyObserver<T[P]>) => void
}

export interface Computed<T> extends Readonly<Reactive<{ value: T }>> {}

type ReactiveValue<T> = T extends Computed<infer TValue>
? TValue
: T extends ReactiveTarget
? Reactive<T> | T
: T

export type Reactive<T extends ReactiveTarget> = {
[P in keyof T]: ReactiveValue<T[P]>
} & ReactiveAPI<T>

export interface PropertyObserver<T> {
(newValue?: T, oldValue?: T): void
}

export type Props<T extends ReactiveTarget> = {
[P in keyof T]: T[P] extends ReactiveTarget ? Props<T[P]> | T[P] : T[P]
}
export type EventMap = Record<string, unknown>

export type EventMap = Record<string, unknown>

export type Events<T extends EventMap> = {
[K in keyof T]?: (payload: T[K]) => void
}

export type Emit<T extends EventMap> = <K extends keyof T>(
event: K,
payload: T[K]
) => void

export type ComponentFactory = (
props?: Props<ReactiveTarget>,
emit?: Emit<EventMap>
) => ArrowTemplate

export interface AsyncComponentOptions<
TProps extends ReactiveTarget,
TValue,
TEvents extends EventMap = EventMap,
TSnapshot = TValue,

> {
> fallback?: unknown
> onError?: (

    error: unknown,
    props: Props<TProps>,
    emit: Emit<TEvents>

) => unknown
render?: (
value: TValue,
props: Props<TProps>,
emit: Emit<TEvents>
) => unknown
serialize?: (
value: TValue,
props: Props<TProps>,
emit: Emit<TEvents>
) => TSnapshot
deserialize?: (snapshot: TSnapshot, props: Props<TProps>) => TValue
idPrefix?: string
}

export interface ComponentCall {
h: ComponentFactory
p: Props<ReactiveTarget> | undefined
e: Events<EventMap> | undefined
k: ArrowTemplateKey
key: (key: ArrowTemplateKey) => ComponentCall
}

export interface Component<TEvents extends EventMap = EventMap> {
(props?: undefined, events?: Events<TEvents>): ComponentCall
}

export interface ComponentWithProps<
T extends ReactiveTarget,
TEvents extends EventMap = EventMap,

> {
> <S extends T>(props: S, events?: Events<TEvents>): ComponentCall
> }
> @arrow-js/framework
> export interface RenderOptions {

clear?: boolean

hydrationSnapshots?:
Record<string, unknown>
}

export interface RenderPayload {

async:
Record<string, unknown>

boundaries: string[]
}

export interface RenderResult {

root: ParentNode

template: ArrowTemplate

payload: RenderPayload
}

export interface BoundaryOptions {

idPrefix?: string
}

export interface DocumentRenderParts {

head?: string

html: string

payloadScript?: string
}
@arrow-js/ssr
export interface HydrationPayload {

html?: string

rootId?: string

async?:
Record<string, unknown>

boundaries?: string[]
}

export interface SsrRenderOptions {

rootId?: string
}

export interface SsrRenderResult {

html: string

payload: HydrationPayload
}
@arrow-js/hydrate
export interface HydrationPayload {

html?: string

rootId?: string

async?:
Record<string, unknown>

boundaries?: string[]
}

export interface HydrationMismatchDetails {

actual: string

expected: string

mismatches: number

repaired: boolean

boundaryFallbacks: number
}

export interface HydrationOptions {

onMismatch?: (
details: HydrationMismatchDetails) => void
}

export interface HydrationResult {

root:
ParentNode

template: ArrowTemplate

payload: RenderPayload

adopted: boolean

mismatches: number

boundaryFallbacks: number
}
@arrow-js/sandbox
// ---cut-start---

import type { ArrowTemplate } from '@arrow-js/core'

// ---cut-end---

export interface SandboxProps {
source: Record<string, string>
shadowDOM?: boolean
onError?: (error: Error | string) => void
debug?: boolean
}

export interface SandboxEvents {
output?: (payload: unknown) => void
}

export function sandbox<T extends {
source: object
shadowDOM?: boolean
onError?: (error: Error | string) => void
debug?: boolean
}>(
props: T,
events?: SandboxEvents
): ArrowTemplate {
ensureSandboxElement()
return html`${SandboxHostComponent({ config: props as SandboxHostProps, events })}`
}
Built by Standard Agents. Open Source under MIT.

GitHub
Discord
Twitter
