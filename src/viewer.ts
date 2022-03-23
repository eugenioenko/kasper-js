import * as KNode from "./types/nodes";

export class Viewer implements KNode.KNodeVisitor<string> {
  public errors: string[] = [];

  private evaluate(node: KNode.KNode): string {
    return node.accept(this);
  }

  public transpile(nodes: KNode.KNode[]): string[] {
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

  public visitElementKNode(node: KNode.Element): string {
    let attrs = node.attributes.map((attr) => this.evaluate(attr)).join(" ");
    if (attrs.length) {
      attrs = " " + attrs;
    }

    if (node.self) {
      return `<${node.name}${attrs}/>`;
    }

    const children = node.children.map((elm) => this.evaluate(elm)).join("");
    return `<${node.name}${attrs}>${children}</${node.name}>`;
  }

  public visitAttributeKNode(node: KNode.Attribute): string {
    if (node.value) {
      return `${node.name}="${node.value}"`;
    }
    return node.name;
  }

  public visitTextKNode(node: KNode.Text): string {
    return node.value;
  }

  public visitCommentKNode(node: KNode.Comment): string {
    return `<!-- ${node.value} -->`;
  }

  public visitDoctypeKNode(node: KNode.Doctype): string {
    return `<!doctype ${node.value}>`;
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
