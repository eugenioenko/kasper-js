const kasperSrc = () => {
  if (process.env.NODE_ENV === "production") {
    return "../dist/kasper.min.js";
  }
  return "../dist/kasper.js";
};

const kasper = require(kasperSrc()).kasper;

function parse(source) {
  const parser = new kasper.TemplateParser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  return JSON.stringify(nodes);
}

function view(source) {
  const parser = new kasper.TemplateParser();
  const nodes = parser.parse(source);
  const viewer = new kasper.Viewer();
  const view = viewer.transpile(nodes);
  return view.join("");
}

function eval(source, scope) {
  const scanner = new kasper.Scanner();
  const tokens = scanner.scan(source);
  const parser = new kasper.ExpressionParser();
  const expressions = parser.parse(tokens);
  const interpreter = new kasper.Interpreter();
  interpreter.scope.init(scope);
  return interpreter.evaluate(expressions[0]);
}

module.exports = {
  eval,
  parse,
  view,
};
