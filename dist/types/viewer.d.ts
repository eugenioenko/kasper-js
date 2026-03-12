import * as KNode from "./types/nodes";
export declare class Viewer implements KNode.KNodeVisitor<string> {
    errors: string[];
    private evaluate;
    transpile(nodes: KNode.KNode[]): string[];
    visitElementKNode(node: KNode.Element): string;
    visitAttributeKNode(node: KNode.Attribute): string;
    visitTextKNode(node: KNode.Text): string;
    visitCommentKNode(node: KNode.Comment): string;
    visitDoctypeKNode(node: KNode.Doctype): string;
    error(message: string): void;
}
