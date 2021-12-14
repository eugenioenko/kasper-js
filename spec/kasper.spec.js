const kasper = require("../dist/kasper.js").kasper;
const fs = require("fs");

describe("kasper interpreter", () => {
  it("kasper should be defined ", () => {
    expect(kasper.execute).toBeDefined();
  });

  it("kasper parses a file ", () => {
    const source = fs.readFileSync(__dirname + "/samples/index.html", {
      encoding: "utf8",
      flag: "r",
    });

    const target = fs.readFileSync(__dirname + "/samples/output.txt", {
      encoding: "utf8",
      flag: "r",
    });

    const parsed = kasper.parse(source);
    //console.log(parsed);
    expect(parsed).toEqual(target);
  });
});
