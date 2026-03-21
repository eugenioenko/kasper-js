import { describe, it, expect } from "vitest";
import { Token, TokenType } from "../src/types/token";
import { KasperError } from "../src/types/error";
import * as KNode from "../src/types/nodes";
import * as Expr from "../src/types/expressions";

describe("Token", () => {
  it("toString returns formatted token string", () => {
    const token = new Token(TokenType.Identifier, "foo", null, 1, 0);
    expect(token.toString()).toBe('[(1):"foo"]');
  });
});

describe("KasperError", () => {
  it("is an instance of Error", () => {
    expect(new KasperError("K000" as any, "msg")).toBeInstanceOf(Error);
  });

  it("message includes code and value", () => {
    const err = new KasperError("K000" as any, "something failed");
    expect(err.message).toContain("[K000] something failed");
    expect(err.message).toContain("See: https://kasperjs.top/reference/errors#k000");
  });

  it("exposes line and col", () => {
    const err = new KasperError("K000" as any, "something failed", { line: 3, col: 5 });
    expect(err.line).toBe(3);
    expect(err.col).toBe(5);
  });

  it("has a stack trace", () => {
    expect(new KasperError("K000" as any, "something failed").stack).toBeDefined();
  });
});

describe("KNode toString methods", () => {
  it("Element.toString", () => {
    const el = new KNode.Element("div", [], [], false, 1);
    expect(el.toString()).toBe("KNode.Element");
  });

  it("Attribute.toString", () => {
    const attr = new KNode.Attribute("class", "foo", 1);
    expect(attr.toString()).toBe("KNode.Attribute");
  });

  it("Text.toString", () => {
    const text = new KNode.Text("hello", 1);
    expect(text.toString()).toBe("KNode.Text");
  });

  it("Comment.toString", () => {
    const comment = new KNode.Comment("note", 1);
    expect(comment.toString()).toBe("KNode.Comment");
  });

  it("Doctype.toString", () => {
    const doctype = new KNode.Doctype("html", 1);
    expect(doctype.toString()).toBe("KNode.Doctype");
  });
});

describe("Expr toString methods", () => {
  const tok = (lexeme: string) => new Token(TokenType.Identifier, lexeme, null, 0, 0);
  const lit = () => new Expr.Literal(1, 0);

  it("Assign.toString", () => expect(new Expr.Assign(tok("x"), lit(), 0).toString()).toBe("Expr.Assign"));
  it("Binary.toString", () => expect(new Expr.Binary(lit(), tok("+"), lit(), 0).toString()).toBe("Expr.Binary"));
  it("Call.toString", () => expect(new Expr.Call(lit(), tok("("), [], 0).toString()).toBe("Expr.Call"));
  it("Debug.toString", () => expect(new Expr.Debug(lit(), 0).toString()).toBe("Expr.Debug"));
  it("Dictionary.toString", () => expect(new Expr.Dictionary([], 0).toString()).toBe("Expr.Dictionary"));
  it("Each.toString", () => expect(new Expr.Each(tok("item"), tok("index"), lit(), 0).toString()).toBe("Expr.Each"));
  it("Get.toString", () => expect(new Expr.Get(lit(), lit(), TokenType.Dot, 0).toString()).toBe("Expr.Get"));
  it("Grouping.toString", () => expect(new Expr.Grouping(lit(), 0).toString()).toBe("Expr.Grouping"));
  it("Key.toString", () => expect(new Expr.Key(tok("k"), 0).toString()).toBe("Expr.Key"));
  it("Logical.toString", () => expect(new Expr.Logical(lit(), tok("&&"), lit(), 0).toString()).toBe("Expr.Logical"));
  it("List.toString", () => expect(new Expr.List([], 0).toString()).toBe("Expr.List"));
  it("Literal.toString", () => expect(lit().toString()).toBe("Expr.Literal"));
  it("New.toString", () => expect(new Expr.New(lit(), 0).toString()).toBe("Expr.New"));
  it("NullCoalescing.toString", () => expect(new Expr.NullCoalescing(lit(), lit(), 0).toString()).toBe("Expr.NullCoalescing"));
  it("Postfix.toString", () => expect(new Expr.Postfix(lit(), 1, 0).toString()).toBe("Expr.Postfix"));
  it("Set.toString", () => expect(new Expr.Set(lit(), lit(), lit(), 0).toString()).toBe("Expr.Set"));
  it("Template.toString", () => expect(new Expr.Template("hello", 0).toString()).toBe("Expr.Template"));
  it("Ternary.toString", () => expect(new Expr.Ternary(lit(), lit(), lit(), 0).toString()).toBe("Expr.Ternary"));
  it("Typeof.toString", () => expect(new Expr.Typeof(lit(), 0).toString()).toBe("Expr.Typeof"));
  it("Unary.toString", () => expect(new Expr.Unary(tok("!"), lit(), 0).toString()).toBe("Expr.Unary"));
  it("Variable.toString", () => expect(new Expr.Variable(tok("x"), 0).toString()).toBe("Expr.Variable"));
  it("Void.toString", () => expect(new Expr.Void(lit(), 0).toString()).toBe("Expr.Void"));
});
