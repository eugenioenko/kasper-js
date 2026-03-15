import { Component } from "./component";
type Task = () => void;
export declare function queueUpdate(instance: Component, task: Task): void;
/**
 * Executes a function with batching disabled.
 * Used for initial mount and manual renders.
 */
export declare function flushSync(fn: () => void): void;
/**
 * Returns a promise that resolves after the next framework update cycle.
 */
export declare function nextTick(): Promise<void>;
export declare function nextTick(cb: Task): void;
export {};
