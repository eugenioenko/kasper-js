export declare class Boundary {
    private start;
    private end;
    constructor(parent: Node, label?: string);
    clear(): void;
    insert(node: Node): void;
    nodes(): Node[];
    get parent(): Node | null;
}
