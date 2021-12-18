const kasper = require("./helpers");
const fs = require("fs");

describe("kasper interpreter", () => {
  let target = "";
  beforeAll(() => {
    target = fs.readFileSync(__dirname + "/samples/output.txt", {
      encoding: "utf8",
      flag: "r",
    });
  });

  it("kasper parses a file ", () => {
    const source = fs.readFileSync(__dirname + "/samples/sample1.txt", {
      encoding: "utf8",
      flag: "r",
    });

    const parsed = kasper.parse(source);

    expect(parsed).toEqual(target);
  });

  it("kasper renders a file ", () => {
    const source = fs.readFileSync(__dirname + "/samples/sample1.txt", {
      encoding: "utf8",
      flag: "r",
    });

    const rendered = kasper.view(source);

    expect(rendered.toLowerCase().replace(/\s+/g, "")).toEqual(
      source.toLowerCase().replace(/\s+/g, "")
    );
  });

  it("kasper parses a file with random white spaces", () => {
    const source = fs.readFileSync(__dirname + "/samples/sample2.txt", {
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
