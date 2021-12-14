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

  private advance(): void {
    if (!this.eof()) {
      if (this.check("\n")) {
        this.line += 1;
        this.col = 0;
      }
      this.col += 1;
      this.current++;
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
    const node = this.comment();
    this.whitespace();
    return node;
  }

  private comment(): Node.Node {
    if (this.match("<!--")) {
      const start = this.current;
      do {
        this.advance();
      } while (!this.match(`-->`));
      const comment = this.source.slice(start, this.current - 3);
      return new Node.Comment(comment, this.line);
    }
    return this.doctype();
  }

  private doctype(): Node.Node {
    if (this.match("<!doctype")) {
      const start = this.current;
      do {
        this.advance();
      } while (!this.match(`>`));
      const doctype = this.source.slice(start, this.current - 1);
      return new Node.Doctype(doctype, this.line);
    }
    return this.element();
  }

  private element(): Node.Node {
    if (this.match("</")) {
      this.error("Unexpected closing tag");
    }
    if (!this.match("<")) {
      return this.text();
    }

    const name = this.identifier("/", ">");
    if (!name) {
      this.error("Expected a tag name");
    }

    const attributes = this.attributes();

    if (
      this.match("/>") ||
      (SelfClosingTags.includes(name) && this.match(">"))
    ) {
      return new Node.Element(name, attributes, [], this.line);
    }

    if (!this.match(">")) {
      this.error("Expected closing tag");
    }

    let children: Node.Node[] = [];
    if (!this.peek("</")) {
      children = this.children(name);
    }

    this.close(name);
    return new Node.Element(name, attributes, children, this.line);
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
      const name = this.identifier("=", ">", "/>");
      if (!name) {
        debugger;
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
      attributes.push(new Node.Attribute(name, value, this.line));
    }
    return attributes;
  }

  private text(): Node.Node {
    const start = this.current;
    while (!this.peek("<") && !this.eof()) {
      this.advance();
    }
    const text = this.source.slice(start, this.current).trim();
    if (!text) {
      return null;
    }
    return new Node.Text(text, this.line);
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
    while (!this.peek(...WhiteSpaces, ...closing) && !this.eof()) {
      this.advance();
    }
    const end = this.current;
    this.whitespace();
    return this.source.slice(start, end).trim();
  }

  private string(...closing: string[]): string {
    const start = this.current;
    while (!this.match(...closing) && !this.eof()) {
      this.advance();
    }
    return this.source.slice(start, this.current - 1);
  }
}
