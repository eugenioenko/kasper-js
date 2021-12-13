import { DemoSource } from "./demo";
import { Parser } from "./parser";

const kasper = {
  execute: (source: string): string => {
    const parser = new Parser();
    const nodes = parser.parse(source);
    console.log(nodes);
    console.log(parser.errors);
    if (parser.errors.length) {
      return JSON.stringify(parser.errors);
    }
    return JSON.stringify(nodes);
  },
};

if (typeof window !== "undefined") {
  (window as any).demoSourceCode = DemoSource;
  (window as any).kasper = kasper;
} else {
  exports.kasper = kasper;
}
