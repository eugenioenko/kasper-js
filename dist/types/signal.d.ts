type Listener = () => void;
type Watcher<T> = (newValue: T, oldValue: T) => void;
export declare class Signal<T> {
    private _value;
    private subscribers;
    private watchers;
    constructor(initialValue: T);
    get value(): T;
    set value(newValue: T);
    onChange(fn: Watcher<T>): () => void;
    unsubscribe(fn: Listener): void;
    toString(): string;
    peek(): T;
}
export declare function effect(fn: Listener): () => void;
export declare function signal<T>(initialValue: T): Signal<T>;
export declare function batch(fn: () => void): void;
export declare function computed<T>(fn: () => T): Signal<T>;
export {};
