export declare class Scope {
    values: Record<string, any>;
    parent: Scope;
    constructor(parent?: Scope, entity?: Record<string, any>);
    init(entity?: Record<string, any>): void;
    set(name: string, value: any): void;
    get(key: string): any;
}
