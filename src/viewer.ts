import * as KNode from "./nodes";

export class Viewer implements KNode.NodeVisitor<string> {
  public errors: string[] = [];

  private evaluate(node: KNode.Node): string {
    return node.accept(this);
  }

  public transpile(nodes: KNode.Node[]): string[] {
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

  public visitElementNode(node: KNode.Element): string {
    return "";
  }
  public visitAttributeNode(node: KNode.Attribute): string {
    return "";
  }
  public visitTextNode(node: KNode.Text): string {
    return "";
  }
  public visitCommentNode(node: KNode.Comment): string {
    return "";
  }
  public visitDoctypeNode(node: KNode.Doctype): string {
    return "";
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }
}
