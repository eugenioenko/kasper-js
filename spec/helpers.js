const kasperSrc = () => {
  if (process.env.NODE_ENV === "production") {
    return "../dist/kasper.min.js";
  }
  return "../dist/kasper.js";
};

const kasper = require(kasperSrc()).kasper;

function parse(source) {
  const parser = new kasper.Parser();
  const nodes = parser.parse(source);
  if (parser.errors.length) {
    return JSON.stringify(parser.errors);
  }
  return JSON.stringify(nodes);
}

function view(source) {
  const parser = new kasper.Parser();
  const nodes = parser.parse(source);
  const viewer = new kasper.Viewer();
  const view = viewer.transpile(nodes);
  return view.join("");
}

module.exports = {
  parse,
  view,
};