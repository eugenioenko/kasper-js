const SIZE2 = 50;

window.EXAMPLES.push({
  name: "Game of Life II",
  id: "game2",
  template: String.raw`
<div class="game-container">
  <header class="game-header">
    <div class="game-brand">
      <h3>GAME OF LIFE II</h3>
      <div class="game-meta">GEN: {{generation.value}} &nbsp;|&nbsp; {{aliveCount.value}} ALIVE &nbsp;|&nbsp; {{fps.value}} FPS</div>
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
    <div @each="cell with index of grid.value"
         class="cell"
         @class="cell.value.alive ? 'alive' : ''"
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
  aliveCount = signal(0);
  _timer = null;
  _lastTick = 0;
  _fpsHistory = [];

  $onInit() {
    this.randomize();
  }

  $onDestroy() {
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

  randomize() {
    const total = ${SIZE2} * ${SIZE2};
    const cells = Array.from({ length: total }, () => signal({ alive: Math.random() > 0.7 }));
    this.grid.value = cells;
    this.aliveCount.value = cells.filter(c => c.value.alive).length;
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
    const s = ${SIZE2};
    const current = this.grid.value;

    // Compute next state for every cell (read-only pass)
    const nextAlive = current.map((cell, i) => {
      const x = i % s, y = Math.floor(i / s);
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < s && ny >= 0 && ny < s) {
            if (current[ny * s + nx].value.alive) n++;
          }
        }
      }
      const alive = cell.value.alive;
      return alive ? (n === 2 || n === 3) : n === 3;
    });

    // Write pass — only update signals that actually changed
    let changed = 0;
    let alive = 0;
    for (let i = 0; i < current.length; i++) {
      if (current[i].value.alive !== nextAlive[i]) {
        current[i].value = { alive: nextAlive[i] };
        changed++;
      }
      if (nextAlive[i]) alive++;
    }

    if (changed === 0) {
      this.isRunning.value = false;
      clearInterval(this._timer);
      this.fps.value = 0;
      return;
    }

    this._trackFps();
    this.aliveCount.value = alive;
    this.generation.value++;
  }

  clickCell(index) {
    const cell = this.grid.value[index];
    cell.value = { alive: !cell.value.alive };
    this.aliveCount.value = this.grid.value.filter(c => c.value.alive).length;
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
  grid-template-columns: repeat(${SIZE2}, 1fr);
  gap: 1px;
  background: #1a1a1a;
  border: 2px solid #333;
  width: 100%;
  aspect-ratio: 1 / 1;
}
.cell { background: #000; cursor: crosshair; transition: background 0.05s; }
.cell.alive { background: #00f2ff; box-shadow: 0 0 4px #00f2ff; }
`
});
