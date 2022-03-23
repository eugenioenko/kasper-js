const kasper = require("./helpers");

describe("kasper interpreter", () => {
  it("it correctly evaluates expressions", () => {
    expect(2).toEqual(kasper.eval(`2`));
    expect(true).toEqual(kasper.eval(`true`));
    expect(false).toEqual(kasper.eval(`false`));
    expect(null).toEqual(kasper.eval(`null`));
    expect(undefined).toEqual(kasper.eval(`undefined`));
    expect("string").toEqual(kasper.eval(`"string"`));
    expect(100.1).toEqual(kasper.eval(`100.1`));
    expect(0).toEqual(kasper.eval(`0`));
    const list = ["a", "b", "c"];
    expect(list[0]).toEqual(kasper.eval(`list[0]`, { list }));
    expect(100 + 20 / 30 - (10 + 100 / 3)).toEqual(
      kasper.eval(`100 + 20 / 30 - (10 + 100 / 3)`)
    );
    expect(3 && 1).toEqual(kasper.eval(`3 && 1`));
    expect(4 || 1).toEqual(kasper.eval(`4 || 1`));
  });
});
