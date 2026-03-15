import { KasperError, KErrorCode, KErrorCodeType } from "./types/error";
import * as Node from "./types/nodes";
import { SelfClosingTags, WhiteSpaces } from "./types/token";

export class TemplateParser {
  public current: number;
  public line: number;
  public col: number;
  public source: string;
  public nodes: Node.KNode[];

  public parse(source: string): Node.KNode[] {
    this.current = 0;
    this.line = 1;
    this.col = 1;
    this.source = source;
    this.nodes = [];

    while (!this.eof()) {
      const node = this.node();
      if (node === null) {
        continue;
      }
      this.nodes.push(node);
    }
    this.source = "";
    return this.nodes;
  }

  private match(...chars: string[]): boolean {
    for (const char of chars) {
      if (this.check(char)) {
        this.current += char.length;
        return true;
      }
    }
    return false;
  }

  private advance(eofError: string = ""): void {
    if (!this.eof()) {
      if (this.check("\n")) {
        this.line += 1;
        this.col = 0;
      }
      if (!this.eof()) {
        this.current++;
      } else {
        this.error(KErrorCode.UNEXPECTED_EOF, { eofError: eofError });
      }
    }
  }

  private peek(...chars: string[]): boolean {
    for (const char of chars) {
      if (this.check(char)) {
        return true;
      }
    }
    return false;
  }

  private check(char: string): boolean {
    return this.source.slice(this.current, this.current + char.length) === char;
  }

  private eof(): boolean {
    return this.current > this.source.length;
  }

  private error(code: KErrorCodeType, args: any = {}): any {
    throw new KasperError(code, args, this.line, this.col);
  }

  private node(): Node.KNode {
    this.whitespace();
    let node: Node.KNode;

    if (this.match("</")) {
      this.error(KErrorCode.UNEXPECTED_CLOSING_TAG);
    }

    if (this.match("<!--")) {
      node = this.comment();
    } else if (this.match("<!doctype") || this.match("<!DOCTYPE")) {
      node = this.doctype();
    } else if (this.match("<")) {
      node = this.element();
    } else {
      node = this.text();
    }

    this.whitespace();
    return node;
  }

  private comment(): Node.KNode {
    const start = this.current;
    do {
      this.advance("Expected comment closing '-->'");
    } while (!this.match(`-->`));
    const comment = this.source.slice(start, this.current - 3);
    return new Node.Comment(comment, this.line);
  }

  private doctype(): Node.KNode {
    const start = this.current;
    do {
      this.advance("Expected closing doctype");
    } while (!this.match(`>`));
    const doctype = this.source.slice(start, this.current - 1).trim();
    return new Node.Doctype(doctype, this.line);
  }

  private element(): Node.KNode {
    const line = this.line;
    const name = this.identifier("/", ">");
    if (!name) {
      this.error(KErrorCode.EXPECTED_TAG_NAME);
    }

    const attributes = this.attributes();

    if (
      this.match("/>") ||
      (SelfClosingTags.includes(name) && this.match(">"))
    ) {
      return new Node.Element(name, attributes, [], true, this.line);
    }

    if (!this.match(">")) {
      this.error(KErrorCode.EXPECTED_CLOSING_BRACKET);
    }

    let children: Node.KNode[] = [];
    this.whitespace();
    if (!this.peek("</")) {
      children = this.children(name);
    }

    this.close(name);
    return new Node.Element(name, attributes, children, false, line);
  }

  private close(name: string): void {
    if (!this.match("</")) {
      this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name: name });
    }
    if (!this.match(`${name}`)) {
      this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name: name });
    }
    this.whitespace();
    if (!this.match(">")) {
      this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name: name });
    }
  }

  private children(parent: string): Node.KNode[] {
    const children: Node.KNode[] = [];
    do {
      if (this.eof()) {
        this.error(KErrorCode.EXPECTED_CLOSING_TAG, { name: parent });
      }
      const node = this.node();
      if (node === null) {
        continue;
      }
      children.push(node);
    } while (!this.peek(`</`));

    return children;
  }

  private attributes(): Node.Attribute[] {
    const attributes: Node.Attribute[] = [];
    while (!this.peek(">", "/>") && !this.eof()) {
      this.whitespace();
      const line = this.line;
      const name = this.identifier("=", ">", "/>");
      if (!name) {
        this.error(KErrorCode.BLANK_ATTRIBUTE_NAME);
      }
      this.whitespace();
      let value = "";
      if (this.match("=")) {
        this.whitespace();
        if (this.match("'")) {
          value = this.decodeEntities(this.string("'"));
        } else if (this.match('"')) {
          value = this.decodeEntities(this.string('"'));
        } else {
          value = this.decodeEntities(this.identifier(">", "/>"));
        }
      }
      this.whitespace();
      attributes.push(new Node.Attribute(name, value, line));
    }
    return attributes;
  }

  private text(): Node.KNode {
    const start = this.current;
    const line = this.line;
    let depth = 0;
    while (!this.eof()) {
      if (this.match("{{")) { depth++; continue; }
      if (depth > 0 && this.match("}}")) { depth--; continue; }
      if (depth === 0 && this.peek("<")) { break; }
      this.advance();
    }
    const raw = this.source.slice(start, this.current).trim();
    if (!raw) {
      return null;
    }
    return new Node.Text(this.decodeEntities(raw), line);
  }

  private decodeEntities(text: string): string {
    return text
      .replace(/&nbsp;/g, "\u00a0")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&"); // must be last to avoid double-decoding
  }

  private whitespace(): number {
    let count = 0;
    while (this.peek(...WhiteSpaces) && !this.eof()) {
      count += 1;
      this.advance();
    }
    return count;
  }

  private identifier(...closing: string[]): string {
    this.whitespace();
    const start = this.current;
    while (!this.peek(...WhiteSpaces, ...closing)) {
      this.advance(`Expected closing ${closing}`);
    }
    const end = this.current;
    this.whitespace();
    return this.source.slice(start, end).trim();
  }

  private string(closing: string): string {
    const start = this.current;
    while (!this.match(closing)) {
      this.advance(`Expected closing ${closing}`);
    }
    return this.source.slice(start, this.current - 1);
  }
}
