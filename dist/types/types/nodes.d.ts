export declare abstract class KNode {
    line: number;
    type: string;
    abstract accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
}
export interface KNodeVisitor<R> {
    visitElementKNode(knode: Element, parent?: Node): R;
    visitAttributeKNode(knode: Attribute, parent?: Node): R;
    visitTextKNode(knode: Text, parent?: Node): R;
    visitCommentKNode(knode: Comment, parent?: Node): R;
    visitDoctypeKNode(knode: Doctype, parent?: Node): R;
}
export declare class Element extends KNode {
    name: string;
    attributes: KNode[];
    children: KNode[];
    self: boolean;
    constructor(name: string, attributes: KNode[], children: KNode[], self: boolean, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}
export declare class Attribute extends KNode {
    name: string;
    value: string;
    constructor(name: string, value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}
export declare class Text extends KNode {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}
export declare class Comment extends KNode {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}
export declare class Doctype extends KNode {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}
