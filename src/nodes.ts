export abstract class Node {
  public line: number;
  public type: string;
  public abstract accept<R>(visitor: NodeVisitor<R>): R;
}

export interface NodeVisitor<R> {
  visitElementNode(node: Element): R;
  visitAttributeNode(node: Attribute): R;
  visitTextNode(node: Text): R;
  visitCommentNode(node: Comment): R;
  visitDoctypeNode(node: Doctype): R;
}

export class Element extends Node {
  public name: string;
  public attributes: Node[];
  public children: Node[];

  constructor(
    name: string,
    attributes: Node[],
    children: Node[],
    line: number = 0
  ) {
    super();
    this.type = "element";
    this.name = name;
    this.attributes = attributes;
    this.children = children;
    this.line = line;
  }

  public accept<R>(visitor: NodeVisitor<R>): R {
    return visitor.visitElementNode(this);
  }

  public toString(): string {
    return "Node.Element";
  }
}

export class Attribute extends Node {
  public name: string;
  public value: string;

  constructor(name: string, value: string, line: number = 0) {
    super();
    this.type = "attribute";
    this.name = name;
    this.value = value;
    this.line = line;
  }

  public accept<R>(visitor: NodeVisitor<R>): R {
    return visitor.visitAttributeNode(this);
  }

  public toString(): string {
    return "Node.Attribute";
  }
}

export class Text extends Node {
  public value: string;

  constructor(value: string, line: number = 0) {
    super();
    this.type = "text";
    this.value = value;
    this.line = line;
  }

  public accept<R>(visitor: NodeVisitor<R>): R {
    return visitor.visitTextNode(this);
  }

  public toString(): string {
    return "Node.Text";
  }
}

export class Comment extends Node {
  public value: string;

  constructor(value: string, line: number = 0) {
    super();
    this.type = "comment";
    this.value = value;
    this.line = line;
  }

  public accept<R>(visitor: NodeVisitor<R>): R {
    return visitor.visitCommentNode(this);
  }

  public toString(): string {
    return "Node.Comment";
  }
}

export class Doctype extends Node {
  public value: string;

  constructor(value: string, line: number = 0) {
    super();
    this.type = "doctype";
    this.value = value;
    this.line = line;
  }

  public accept<R>(visitor: NodeVisitor<R>): R {
    return visitor.visitDoctypeNode(this);
  }

  public toString(): string {
    return "Node.Doctype";
  }
}
