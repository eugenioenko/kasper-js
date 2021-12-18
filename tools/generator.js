let fs = require("fs");

const NodeAST = {
  Element: [
    "name: string",
    "attributes: Node[]",
    "children: Node[]",
    "self: boolean",
  ],
  Attribute: ["name: string", "value: string"],
  Text: ["value: string"],
  Comment: ["value: string"],
  Doctype: ["value: string"],
};

function generateAST(baseClass, AST, filename, imports = "") {
  let file =
    imports +
    `export abstract class ${baseClass} {
    public line: number;
    public type: string;
    public abstract accept<R>(visitor: ${baseClass}Visitor<R>): R;
}\n\n`;

  file += `export interface ${baseClass}Visitor<R> {\n`;
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
    )}, line: number = 0) {\n        super();\n`;
    file += `        this.type = '${name.toLowerCase()}';\n`;
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

  fs.writeFile(`src/${filename}.ts`, file, function (err, data) {
    if (err) console.log(err);
    console.log(`${filename}.ts generated`);
  });
}

generateAST("Node", NodeAST, "nodes");
