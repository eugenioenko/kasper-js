const SIZE = 50;

window.EXAMPLES.push({
  name: "Game of Life",
  id: "game",
  template: String.raw`
<div class="game-container">
  <header class="game-header">
    <div class="game-brand">
      <h3>GAME OF LIFE</h3>
      <div class="game-meta">GEN: {{generation.value}} &nbsp;|&nbsp; {{aliveCount}} ALIVE &nbsp;|&nbsp; {{fps.value}} FPS</div>
    </div>
    <div class="game-controls">
      <button class="g-btn" @on:click="tick()">STEP</button>
      <button class="g-btn" @class="isRunning.value ? 'active' : ''" @on:click="toggle()">
        {{isRunning.value ? 'STOP' : 'RUN'}}
      </button>
      <button class="g-btn" @on:click="randomize()">RESET</button>
    </div>
  </header>

  <div class="grid-canvas">
    <div @each="cell of grid.value"
         @class="cell.alive ? 'cell alive' : 'cell'"
         @on:click="clickCell(index)">
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  generation = signal(0);
  isRunning = signal(false);
  grid = signal([]);
  fps = signal(0);
  _timer = null;
  _lastTick = 0;
  _fpsHistory = [];

  onMount() {
    this.randomize();
  }

  onDestroy() {
    clearInterval(this._timer);
  }

  _trackFps() {
    const now = performance.now();
    if (this._lastTick > 0) {
      this._fpsHistory.push(1000 / (now - this._lastTick));
      if (this._fpsHistory.length > 10) this._fpsHistory.shift();
      const avg = this._fpsHistory.reduce((a, b) => a + b, 0) / this._fpsHistory.length;
      this.fps.value = Math.round(avg);
    }
    this._lastTick = now;
  }

  get aliveCount() {
    return this.grid.value.filter(c => c.alive).length;
  }

  randomize() {
    const total = ${SIZE} * ${SIZE};
    const cells = Array.from({ length: total }, () => ({ alive: Math.random() > 0.7 }));
    this.grid.value = cells;
    this.generation.value = 0;
  }

  toggle() {
    this.isRunning.value = !this.isRunning.value;
    if (this.isRunning.value) {
      this._lastTick = 0;
      this._fpsHistory = [];
      this._timer = setInterval(() => this.tick(), 50);
    } else {
      clearInterval(this._timer);
      this.fps.value = 0;
    }
  }

  tick() {
    const s = ${SIZE};
    const current = this.grid.value;
    const next = current.map((cell, i) => {
      const x = i % s, y = Math.floor(i / s);
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < s && ny >= 0 && ny < s) {
            if (current[ny * s + nx].alive) n++;
          }
        }
      }
      return { alive: cell.alive ? (n === 2 || n === 3) : n === 3 };
    });

    const changed = next.some((c, i) => c.alive !== current[i].alive);
    if (!changed) {
      this.isRunning.value = false;
      clearInterval(this._timer);
      this.fps.value = 0;
      return;
    }
    this._trackFps();
    this.grid.value = next;
    this.generation.value++;
  }

  clickCell(index) {
    const cells = this.grid.value.slice();
    cells[index] = { alive: !cells[index].alive };
    this.grid.value = cells;
  }
}
`,
  style: `
.game-container { padding: 16px; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
.game-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #333; padding-bottom: 10px; }
.game-brand h3 { margin: 0; font-size: 16px; color: #fff; }
.game-meta { font-size: 9px; color: #3b82f6; font-weight: bold; margin-top: 3px; }
.game-controls { display: flex; gap: 8px; }
.g-btn {
  background: #111; border: 2px solid #333; color: #666; padding: 5px 12px;
  font-family: inherit; font-size: 10px; font-weight: 800; cursor: pointer; border-radius: 6px;
}
.g-btn:hover { border-color: #fff; color: #fff; }
.g-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.grid-canvas {
  display: grid;
  grid-template-columns: repeat(${SIZE}, 1fr);
  gap: 1px;
  background: #1a1a1a;
  border: 2px solid #333;
  width: 100%;
  aspect-ratio: 1 / 1;
}
.cell { background: #000; cursor: crosshair; transition: background 0.05s; }
.cell.alive { background: #00f2ff; box-shadow: 0 0 4px #00f2ff; }
`,
});
