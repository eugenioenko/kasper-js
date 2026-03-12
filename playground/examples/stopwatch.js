window.EXAMPLES.push({
  name: "Stopwatch",
  id: "stopwatch",
  template: String.raw`
<div class="sw-app">
  <div class="sw-screen">
    <div class="sw-label">ELAPSED</div>
    <div class="sw-display">{{display}}</div>
    <div class="sw-lap-current">
      <span class="sw-lap-label">LAP</span>
      <span class="sw-lap-time">{{lapDisplay}}</span>
    </div>
  </div>

  <div class="sw-controls">
    <button class="sw-btn sw-btn-lap" @on:click="lap()" @disabled="!running.value">LAP</button>
    <button class="sw-btn sw-btn-main" @class="running.value ? 'sw-stop' : 'sw-start'" @on:click="toggle()">
      {{running.value ? 'STOP' : 'START'}}
    </button>
    <button class="sw-btn sw-btn-reset" @on:click="reset()">RESET</button>
  </div>

  <div class="sw-laps" @if="laps.value.length > 0">
    <div class="sw-laps-header">
      <span>#</span><span>LAP</span><span>TOTAL</span>
    </div>
    <div @each="lap of laps.value" class="sw-lap-row" @class="index == 0 ? 'sw-lap-latest' : ''">
      <span class="sw-lap-n">{{lap.n}}</span>
      <span class="sw-lap-t">{{lap.time}}</span>
      <span class="sw-lap-total">{{lap.total}}</span>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  running = signal(false);
  elapsed = signal(0);
  laps = signal([]);
  _timer = null;
  _startedAt = 0;
  _lapStart = 0;

  $onDestroy() {
    clearInterval(this._timer);
  }

  get display() {
    return this._format(this.elapsed.value);
  }

  get lapDisplay() {
    return this._format(this.elapsed.value - this._lapStart);
  }

  _format(ms) {
    const m  = Math.floor(ms / 60000).toString().padStart(2, '0');
    const s  = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return m + ':' + s + '.' + cs;
  }

  toggle() {
    if (this.running.value) {
      clearInterval(this._timer);
      this.running.value = false;
    } else {
      this._startedAt = Date.now() - this.elapsed.value;
      this._timer = setInterval(() => {
        this.elapsed.value = Date.now() - this._startedAt;
      }, 30);
      this.running.value = true;
    }
  }

  lap() {
    if (!this.running.value) return;
    const lapMs = this.elapsed.value - this._lapStart;
    const entry = {
      n: this.laps.value.length + 1,
      time: this._format(lapMs),
      total: this._format(this.elapsed.value),
    };
    this.laps.value = [entry, ...this.laps.value];
    this._lapStart = this.elapsed.value;
  }

  reset() {
    clearInterval(this._timer);
    this.running.value = false;
    this.elapsed.value = 0;
    this.laps.value = [];
    this._lapStart = 0;
  }
}
`,
  style: `
.sw-app {
  max-width: 380px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sw-screen {
  background: #050505;
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  padding: 30px 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: inset 0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,242,255,0.03);
}

.sw-label {
  font-size: 9px;
  letter-spacing: 4px;
  color: #333;
  font-weight: 800;
}

.sw-display {
  font-size: 58px;
  font-weight: 200;
  letter-spacing: -2px;
  color: #fff;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 30px rgba(0,242,255,0.3);
  line-height: 1;
}

.sw-lap-current {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}

.sw-lap-label {
  font-size: 8px;
  color: #333;
  letter-spacing: 2px;
}

.sw-lap-time {
  font-size: 16px;
  color: #555;
  font-variant-numeric: tabular-nums;
}

.sw-controls {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  gap: 10px;
}

.sw-btn {
  border: none;
  border-radius: 50px;
  padding: 14px 8px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
}

.sw-btn-main {
  font-size: 12px;
}

.sw-btn-lap, .sw-btn-reset {
  background: #111;
  color: #555;
  border: 1px solid #1e1e1e;
}

.sw-btn-lap:hover:not(:disabled), .sw-btn-reset:hover {
  background: #1a1a1a;
  color: #aaa;
}

.sw-btn-lap:disabled {
  opacity: 0.3;
  cursor: default;
}

.sw-start {
  background: #00f2ff;
  color: #000;
  box-shadow: 0 0 20px rgba(0,242,255,0.4);
}

.sw-start:hover { background: #33f5ff; }

.sw-stop {
  background: #ff3b3b;
  color: #fff;
  box-shadow: 0 0 20px rgba(255,59,59,0.4);
}

.sw-stop:hover { background: #ff5555; }

.sw-laps {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 240px;
  overflow-y: auto;
}

.sw-laps::-webkit-scrollbar { width: 2px; }
.sw-laps::-webkit-scrollbar-thumb { background: #222; }

.sw-laps-header {
  display: grid;
  grid-template-columns: 40px 1fr 1fr;
  padding: 4px 12px;
  font-size: 8px;
  color: #333;
  letter-spacing: 2px;
  font-weight: 800;
}

.sw-lap-row {
  display: grid;
  grid-template-columns: 40px 1fr 1fr;
  padding: 10px 12px;
  background: #0a0a0a;
  border-radius: 8px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  transition: background 0.2s;
}

.sw-lap-latest {
  background: #0f1a1a;
  color: #00f2ff;
}

.sw-lap-n { color: #333; font-size: 11px; }
.sw-lap-total { color: #333; }
`
});
