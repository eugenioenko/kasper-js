import * as Node from "./types/nodes";
export declare class TemplateParser {
    current: number;
    line: number;
    col: number;
    source: string;
    nodes: Node.KNode[];
    parse(source: string): Node.KNode[];
    private match;
    private advance;
    private peek;
    private check;
    private eof;
    private error;
    private node;
    private comment;
    private doctype;
    private element;
    private close;
    private children;
    private attributes;
    private text;
    private decodeEntities;
    private whitespace;
    private identifier;
    private string;
}
