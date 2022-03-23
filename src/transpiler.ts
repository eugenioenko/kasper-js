import * as KNode from "./types/nodes";

export class Transpiler implements KNode.NodeVisitor<Node> {
  public errors: string[] = [];

  private evaluate(node: KNode.Node): Node {
    return node.accept(this);
  }

  public transpile(nodes: KNode.Node[]): Node[] {
    this.errors = [];
    const result = [];
    for (const node of nodes) {
      try {
        result.push(this.evaluate(node));
      } catch (e) {
        console.error(`${e}`);
        this.errors.push(`${e}`);
        if (this.errors.length > 100) {
          this.errors.push("Error limit exceeded");
          return result;
        }
      }
    }
    return result;
  }

  public visitElementNode(node: KNode.Element): Node {
    const element = document.createElement(node.name);

    const attrs = node.attributes.map((attr) => this.evaluate(attr));
    for (const attr of attrs) {
      element.setAttributeNode(attr as Attr);
    }

    if (node.self) {
      return element;
    }

    const children = node.children.map((elm) => this.evaluate(elm));
    for (const child of children) {
      element.append(child);
    }

    return element;
  }

  public visitAttributeNode(node: KNode.Attribute): Node {
    const attr = document.createAttribute(node.name);
    if (node.value) {
      attr.value = node.value;
    }
    return attr;
  }

  public visitTextNode(node: KNode.Text): Node {
    return document.createTextNode(node.value);
  }

  public visitCommentNode(node: KNode.Comment): Node {
    return new Comment(node.value);
  }

  public visitDoctypeNode(node: KNode.Doctype): Node {
    return document.implementation.createDocumentType("html", "", "");
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
