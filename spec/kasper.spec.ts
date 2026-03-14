// @vitest-environment node
import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "./helpers";

describe("kasper template parser", () => {
  let target = "";

  beforeAll(() => {
    target = readFileSync(join(__dirname, "samples/output.txt"), {
      encoding: "utf8",
    });
  });

  it("parses a file", () => {
    const source = readFileSync(join(__dirname, "samples/sample1.txt"), {
      encoding: "utf8",
    });
    expect(parse(source)).toEqual(target);
  });

  it("parses a file with random white spaces", () => {
    const source = readFileSync(join(__dirname, "samples/sample2.txt"), {
      encoding: "utf8",
    });
    const parsed = parse(source)
      .replace(/,"line":\d+/g, "")
      .split("},{");
    const origin = target.replace(/,"line":\d+/g, "").split("},{");

    for (let i = 0; i < parsed.length; ++i) {
      expect(parsed[i]).toEqual(origin[i]);
    }
  });
});
