type Listener = () => void;
type Watcher<T> = (newValue: T, oldValue: T) => void;
export interface SignalOptions {
    signal?: AbortSignal;
}
export declare class Signal<T> {
    protected _value: T;
    private subscribers;
    private watchers;
    constructor(initialValue: T);
    get value(): T;
    set value(newValue: T);
    onChange(fn: Watcher<T>, options?: SignalOptions): () => void;
    unsubscribe(fn: Listener): void;
    toString(): string;
    peek(): T;
}
export declare function effect(fn: Listener, options?: SignalOptions): () => void;
export declare function signal<T>(initialValue: T): Signal<T>;
/**
 * Functional alias for Signal.onChange()
 */
export declare function watch<T>(sig: Signal<T>, fn: Watcher<T>, options?: SignalOptions): () => void;
export declare function batch(fn: () => void): void;
export declare function computed<T>(fn: () => T, options?: SignalOptions): Signal<T>;
export {};
