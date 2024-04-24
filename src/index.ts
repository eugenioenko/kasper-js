import { Component } from "./component";
import { ExpressionParser } from "./expression-parser";
import { Interpreter } from "./interpreter";
import { execute, transpile, Kasper, kasperState, KasperInit } from "./kasper";
import { Scanner } from "./scanner";
import { TemplateParser } from "./template-parser";
import { Transpiler } from "./transpiler";
import { Viewer } from "./viewer";

if (typeof window !== "undefined") {
  ((window as any) || {}).kasper = {
    execute,
    transpile,
    App: KasperInit,
  };
  (window as any)["Kasper"] = Kasper;
  (window as any)["Component"] = Component;
  (window as any)["$state"] = kasperState;
} else if (typeof exports !== "undefined") {
  exports.kasper = {
    ExpressionParser,
    Interpreter,
    Scanner,
    TemplateParser,
    Transpiler,
    Viewer,
  };
}
