let fs = require("fs");

const NodeAST = {
  Element: [
    "name: string",
    "attributes: KNode[]",
    "children: KNode[]",
    "self: boolean",
  ],
  Attribute: ["name: string", "value: string"],
  Text: ["value: string"],
  Comment: ["value: string"],
  Doctype: ["value: string"],
};

const ExpressionAST = {
  Assign: ["name: Token", "value: Expr"],
  Binary: ["left: Expr", "operator: Token", "right: Expr"],
  Call: ["callee: Expr", "paren: Token", "args: Expr[]"],
  Debug: ["value: Expr"],
  Dictionary: ["properties: Expr[]"],
  Each: ["name: Token", "key: Token", "iterable: Expr"],
  Get: ["entity: Expr", "key: Expr", "type: TokenType"],
  Grouping: ["expression: Expr"],
  Key: ["name: Token"],
  Logical: ["left: Expr", "operator: Token", "right: Expr"],
  List: ["value: Expr[]"],
  Literal: ["value: any"],
  New: ["clazz: Expr"],
  NullCoalescing: ["left: Expr", "right: Expr"],
  Postfix: ["name: Token", "increment: number"],
  Set: ["entity: Expr", "key: Expr", "value: Expr"],
  Template: ["value: string"],
  Ternary: ["condition: Expr", "thenExpr: Expr", "elseExpr: Expr"],
  Typeof: ["value: Expr"],
  Unary: ["operator: Token", "right: Expr"],
  Variable: ["name: Token"],
  Void: ["value: Expr"],
};

function generateNodeAST(baseClass, AST, filename, imports = "") {
  let file =
    imports +
    `export abstract class ${baseClass} {
    public line: number;
    public type: string;
    public abstract accept<R>(visitor: ${baseClass}Visitor<R>, parent?: Node): R;
}\n\n`;

  file += `export interface ${baseClass}Visitor<R> {\n`;
  Object.keys(AST).forEach((name) => {
    file += `    visit${name}${baseClass}(${baseClass.toLowerCase()}: ${name}, parent?: Node): R;\n`;
  });
  file += "}\n\n";

  Object.keys(AST).forEach((name) => {
    const syntax = AST[name];
    file += `export class ${name} extends ${baseClass} {\n`;
    syntax.forEach((member) => {
      file += "    public " + member + ";\n";
    });
    file += `\n    constructor(${syntax.join(
      ", "
    )}, line: number = 0) {\n        super();\n`;
    file += `        this.type = '${name.toLowerCase()}';\n`;
    syntax.forEach((member) => {
      const name = member.split(": ")[0];
      file += "        this." + name + " = " + name + ";\n";
    });
    file += "        this.line = line;\n";
    file += "    }\n";
    file += `
    public accept<R>(visitor: ${baseClass}Visitor<R>, parent?: Node): R {
        return visitor.visit${name}${baseClass}(this, parent);
    }\n`;
    file += `
    public toString(): string {
        return '${baseClass}.${name}';
    }\n`;
    file += "}\n\n";
  });

  fs.writeFile(`src/types/${filename}.ts`, file, function (err, data) {
    if (err) console.log(err);
    console.log(`${filename}.ts generated`);
  });
}

function generateExpressionAST(baseClass, AST, filename, imports = "") {
  let file =
    imports +
    `export abstract class ${baseClass} {
  public result: any;
  public line: number;
  // tslint:disable-next-line
  constructor() { }
  public abstract accept<R>(visitor: ${baseClass}Visitor<R>): R;
}\n\n`;

  file += `// tslint:disable-next-line\nexport interface ${baseClass}Visitor<R> {\n`;
  Object.keys(AST).forEach((name) => {
    file += `    visit${name}${baseClass}(${baseClass.toLowerCase()}: ${name}): R;\n`;
  });
  file += "}\n\n";

  Object.keys(AST).forEach((name) => {
    const syntax = AST[name];
    file += `export class ${name} extends ${baseClass} {\n`;
    syntax.forEach((member) => {
      file += "    public " + member + ";\n";
    });
    file += `\n    constructor(${syntax.join(
      ", "
    )}, line: number) {\n        super();\n`;
    syntax.forEach((member) => {
      const name = member.split(": ")[0];
      file += "        this." + name + " = " + name + ";\n";
    });
    file += "        this.line = line;\n";
    file += "    }\n";
    file += `
  public accept<R>(visitor: ${baseClass}Visitor<R>): R {
      return visitor.visit${name}${baseClass}(this);
  }\n`;
    file += `
  public toString(): string {
      return '${baseClass}.${name}';
  }\n`;
    file += "}\n\n";
  });

  fs.writeFile(`src/types/${filename}.ts`, file, function (err, data) {
    if (err) console.log(err);
    console.log(`${filename}.ts generated`);
  });
}

generateNodeAST("KNode", NodeAST, "nodes");
generateExpressionAST(
  "Expr",
  ExpressionAST,
  "expressions",
  `import { Token, TokenType } from 'token';\n\n`
);
