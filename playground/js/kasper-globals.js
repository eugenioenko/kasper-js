import {
  execute,
  transpile,
  App,
  Component,
  TemplateParser,
  Transpiler,
  Viewer,
  signal,
  effect,
  computed,
  batch,
  Kasper,
} from '../../dist/kasper.js';

window.kasper = {
  execute,
  transpile,
  App,
  Component,
  TemplateParser,
  Transpiler,
  Viewer,
  signal,
  effect,
  computed,
  batch,
};

window.Kasper = Kasper;
window.Component = Component;
