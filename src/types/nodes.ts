export abstract class KNode {
    public line: number;
    public type: string;
    public abstract accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
}

export interface KNodeVisitor<R> {
    visitElementKNode(knode: Element, parent?: Node): R;
    visitAttributeKNode(knode: Attribute, parent?: Node): R;
    visitTextKNode(knode: Text, parent?: Node): R;
    visitCommentKNode(knode: Comment, parent?: Node): R;
    visitDoctypeKNode(knode: Doctype, parent?: Node): R;
}

export class Element extends KNode {
    public name: string;
    public attributes: KNode[];
    public children: KNode[];
    public self: boolean;

    constructor(name: string, attributes: KNode[], children: KNode[], self: boolean, line: number = 0) {
        super();
        this.type = 'element';
        this.name = name;
        this.attributes = attributes;
        this.children = children;
        this.self = self;
        this.line = line;
    }

    public accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R {
        return visitor.visitElementKNode(this, parent);
    }

    public toString(): string {
        return 'KNode.Element';
    }
}

export class Attribute extends KNode {
    public name: string;
    public value: string;

    constructor(name: string, value: string, line: number = 0) {
        super();
        this.type = 'attribute';
        this.name = name;
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R {
        return visitor.visitAttributeKNode(this, parent);
    }

    public toString(): string {
        return 'KNode.Attribute';
    }
}

export class Text extends KNode {
    public value: string;

    constructor(value: string, line: number = 0) {
        super();
        this.type = 'text';
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R {
        return visitor.visitTextKNode(this, parent);
    }

    public toString(): string {
        return 'KNode.Text';
    }
}

export class Comment extends KNode {
    public value: string;

    constructor(value: string, line: number = 0) {
        super();
        this.type = 'comment';
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R {
        return visitor.visitCommentKNode(this, parent);
    }

    public toString(): string {
        return 'KNode.Comment';
    }
}

export class Doctype extends KNode {
    public value: string;

    constructor(value: string, line: number = 0) {
        super();
        this.type = 'doctype';
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R {
        return visitor.visitDoctypeKNode(this, parent);
    }

    public toString(): string {
        return 'KNode.Doctype';
    }
}

