const kasper = require("../dist/kasper.js").kasper;

describe("kasper interpreter", () => {
  it("kasper should be defined ", () => {
    expect(kasper.execute).toBeDefined();
  });
});
