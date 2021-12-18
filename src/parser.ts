import { KasperError } from "./error";
import * as Node from "./nodes";
import { SelfClosingTags, WhiteSpaces } from "./utils";

export class Parser {
  public current: number;
  public line: number;
  public col: number;
  public source: string;
  public errors: string[];
  public nodes: Node.Node[];

  public parse(source: string): Node.Node[] {
    this.current = 0;
    this.line = 1;
    this.col = 1;
    this.source = source;
    this.errors = [];
    this.nodes = [];

    while (!this.eof()) {
      try {
        const node = this.node();
        if (node === null) {
          continue;
        }
        this.nodes.push(node);
      } catch (e) {
        if (e instanceof KasperError) {
          this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
        } else {
          this.errors.push(`${e}`);
          if (this.errors.length > 10) {
            this.errors.push("Parse Error limit exceeded");
            return this.nodes;
          }
        }
        break;
      }
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
      this.col += 1;
      this.current++;
    } else {
      this.error(`Unexpected end of file. ${eofError}`);
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

  private error(message: string): any {
    throw new KasperError(message, this.line, this.col);
  }

  private node(): Node.Node {
    this.whitespace();
    let node: Node.Node;

    if (this.match("</")) {
      this.error("Unexpected closing tag");
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

  private comment(): Node.Node {
    const start = this.current;
    do {
      this.advance("Expected comment closing '-->'");
    } while (!this.match(`-->`));
    const comment = this.source.slice(start, this.current - 3);
    return new Node.Comment(comment, this.line);
  }

  private doctype(): Node.Node {
    const start = this.current;
    do {
      this.advance("Expected closing doctype");
    } while (!this.match(`>`));
    const doctype = this.source.slice(start, this.current - 1).trim();
    return new Node.Doctype(doctype, this.line);
  }

  private element(): Node.Node {
    const line = this.line;
    const name = this.identifier("/", ">");
    if (!name) {
      this.error("Expected a tag name");
    }

    const attributes = this.attributes();

    if (
      this.match("/>") ||
      (SelfClosingTags.includes(name) && this.match(">"))
    ) {
      return new Node.Element(name, attributes, [], true, this.line);
    }

    if (!this.match(">")) {
      this.error("Expected closing tag");
    }

    let children: Node.Node[] = [];
    this.whitespace();
    if (!this.peek("</")) {
      children = this.children(name);
    }

    this.close(name);
    return new Node.Element(name, attributes, children, false, line);
  }

  private close(name: string): void {
    if (!this.match("</")) {
      this.error(`Expected </${name}>`);
    }
    if (!this.match(`${name}`)) {
      this.error(`Expected </${name}>`);
    }
    this.whitespace();
    if (!this.match(">")) {
      this.error(`Expected </${name}>`);
    }
  }

  private children(parent: string): Node.Node[] {
    const children: Node.Node[] = [];
    do {
      if (this.eof()) {
        this.error(`Expected </${parent}>`);
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
        this.error("Blank attribute name");
      }
      this.whitespace();
      let value = "";
      if (this.match("=")) {
        this.whitespace();
        if (this.match("'")) {
          value = this.string("'");
        } else if (this.match('"')) {
          value = this.string('"');
        } else {
          value = this.identifier(">", "/>");
        }
      }
      this.whitespace();
      attributes.push(new Node.Attribute(name, value, line));
    }
    return attributes;
  }

  private text(): Node.Node {
    const start = this.current;
    const line = this.line;
    while (!this.peek("<") && !this.eof()) {
      this.advance();
    }
    const text = this.source.slice(start, this.current).trim();
    if (!text) {
      return null;
    }
    return new Node.Text(text, line);
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
