import * as kasper from '../../dist/kasper.js';

// Minimal bridge for the playground editor
window.kasper = kasper;

// Expose these for the Function constructor in playground.js
window.Component = kasper.Component;
window.signal = kasper.signal;
window.nextTick = kasper.nextTick;
window.batch = kasper.batch;
