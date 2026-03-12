import { ComponentRegistry } from "./component";
import * as KNode from "./types/nodes";
export declare class Transpiler implements KNode.KNodeVisitor<void> {
    private scanner;
    private parser;
    private interpreter;
    private registry;
    constructor(options?: {
        registry: ComponentRegistry;
    });
    private evaluate;
    private bindMethods;
    private scopedEffect;
    private execute;
    transpile(nodes: KNode.KNode[], entity: any, container: Element): Node;
    visitElementKNode(node: KNode.Element, parent?: Node): void;
    visitTextKNode(node: KNode.Text, parent?: Node): void;
    visitAttributeKNode(node: KNode.Attribute, parent?: Node): void;
    visitCommentKNode(node: KNode.Comment, parent?: Node): void;
    private trackEffect;
    private findAttr;
    private doIf;
    private doEach;
    private doEachUnkeyed;
    private doEachKeyed;
    private doWhile;
    private doLet;
    private createSiblings;
    private createElement;
    private createComponentArgs;
    private createEventListener;
    private evaluateTemplateString;
    private evaluateExpression;
    private destroyNode;
    destroy(container: Element): void;
    visitDoctypeKNode(_node: KNode.Doctype): void;
    error(message: string, tagName?: string): void;
}
