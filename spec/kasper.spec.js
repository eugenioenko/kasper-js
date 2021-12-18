const kasperSrc = require("./helpers").kasperSrc();
const kasper = require(kasperSrc).kasper;
const fs = require("fs");

describe("kasper interpreter", () => {
  let target = "";
  beforeAll(() => {
    console.log(kasperSrc);
    target = fs.readFileSync(__dirname + "/samples/output.txt", {
      encoding: "utf8",
      flag: "r",
    });
  });

  it("kasper should be defined ", () => {
    expect(kasper.execute).toBeDefined();
  });

  it("kasper parses a file ", () => {
    const source = fs.readFileSync(__dirname + "/samples/sample1.html", {
      encoding: "utf8",
      flag: "r",
    });

    const parsed = kasper.parse(source);

    expect(parsed).toEqual(target);
  });

  it("kasper parses a file with random white spaces", () => {
    const source = fs.readFileSync(__dirname + "/samples/sample2.html", {
      encoding: "utf8",
      flag: "r",
    });

    const parsed = kasper
      .parse(source)
      .replace(/,"line"\:\d+/g, "")
      .split("},{");
    const origin = target.replace(/,"line"\:\d+/g, "").split("},{");

    for (let i = 0; i < parsed.length; ++i) {
      expect(parsed[i]).toEqual(origin[i]);
    }
  });
});
