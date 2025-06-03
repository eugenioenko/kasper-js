declare interface AppConfig {
    root?: string;
    entry?: string;
    registry: ComponentRegistry;
}

declare class Attribute extends KNode_2 {
    name: string;
    value: string;
    constructor(name: string, value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Comment_2 extends KNode_2 {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Component {
    args: Record<string, any>;
    ref?: Node;
    transpiler?: Transpiler;
    $onInit: () => void;
    $onRender: () => void;
    $onChanges: () => void;
    $onDestroy: () => void;
    constructor(props?: ComponentArgs);
    $doRender(): void;
}

declare interface ComponentArgs {
    args: Record<string, any>;
    ref?: Node;
    transpiler?: Transpiler;
}

declare type ComponentClass = {
    new (args?: ComponentArgs): Component;
};

declare interface ComponentRegistry {
    [tagName: string]: {
        selector: string;
        component: ComponentClass;
        template: Element;
        nodes: KNode_2[];
    };
}

declare class Doctype extends KNode_2 {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Element_2 extends KNode_2 {
    name: string;
    attributes: KNode_2[];
    children: KNode_2[];
    self: boolean;
    constructor(name: string, attributes: KNode_2[], children: KNode_2[], self: boolean, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

export declare function execute(source: string): string;

export declare function Kasper(Component: any): void;

export declare function KasperInit(config: AppConfig): void;

export declare class KasperRenderer {
    entity?: Component;
    changes: number;
    dirty: boolean;
    render: () => void;
}

export declare class KasperState {
    _value: any;
    constructor(initial: any);
    get value(): any;
    set(value: any): void;
    toString(): any;
}

export declare function kasperState(initial: any): KasperState;

declare namespace KNode {
    export {
        KNode_2 as KNode,
        KNodeVisitor,
        Element_2 as Element,
        Attribute,
        Text_2 as Text,
        Comment_2 as Comment,
        Doctype
    }
}

declare abstract class KNode_2 {
    line: number;
    type: string;
    abstract accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
}

declare interface KNodeVisitor<R> {
    visitElementKNode(knode: Element_2, parent?: Node): R;
    visitAttributeKNode(knode: Attribute, parent?: Node): R;
    visitTextKNode(knode: Text_2, parent?: Node): R;
    visitCommentKNode(knode: Comment_2, parent?: Node): R;
    visitDoctypeKNode(knode: Doctype, parent?: Node): R;
}

export declare function render(entity: any): void;

declare class Text_2 extends KNode_2 {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

export declare function transpile(source: string, entity?: {
    [key: string]: any;
}, container?: HTMLElement): Node;

declare class Transpiler implements KNode.KNodeVisitor<void> {
    private scanner;
    private parser;
    private interpreter;
    errors: string[];
    private registry;
    constructor(options?: {
        registry: ComponentRegistry;
    });
    private evaluate;
    private execute;
    transpile(nodes: KNode.KNode[], entity: object, container: Element): Node;
    visitElementKNode(node: KNode.Element, parent?: Node): void;
    visitTextKNode(node: KNode.Text, parent?: Node): void;
    visitAttributeKNode(node: KNode.Attribute, parent?: Node): void;
    visitCommentKNode(node: KNode.Comment, parent?: Node): void;
    private findAttr;
    private doIf;
    private doEach;
    private doWhile;
    private doLet;
    private createSiblings;
    private createElement;
    private createComponentArgs;
    private createEventListener;
    private evaluateTemplateString;
    private evaluateExpression;
    visitDoctypeKNode(_: KNode.Doctype): void;
    error(message: string): void;
}

export { }
