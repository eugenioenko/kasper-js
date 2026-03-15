import {
  execute,
  transpile,
  App,
  Component,
  TemplateParser,
  Transpiler,
  signal,
  effect,
  computed,
  batch,
  watch,
  nextTick,
  Kasper,
} from '../../dist/kasper.js';

window.kasper = {
  execute,
  transpile,
  App,
  Component,
  TemplateParser,
  Transpiler,
  signal,
  effect,
  computed,
  batch,
  watch,
  nextTick,
};

window.Kasper = Kasper;
window.Component = Component;
