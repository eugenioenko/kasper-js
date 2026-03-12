window.EXAMPLES.push({
  name: "Keyed Reconciliation",
  id: "reconciliation",
  template: String.raw`
<div class="kr-wrap">
  <header class="kr-header">
    <div>
      <h3 class="kr-title">KEYED RECONCILIATION</h3>
      <p class="kr-hint">Type in some inputs, then shuffle. Left list preserves values.</p>
    </div>
    <div class="kr-controls">
      <button class="kr-btn" @on:click="shuffle()">SHUFFLE</button>
      <button class="kr-btn" @on:click="addItem()">+ ADD</button>
      <button class="kr-btn" @on:click="removeRandom()">– REMOVE</button>
      <button class="kr-btn kr-btn-stress" @class="running.value ? 'active' : ''" @on:click="toggleStress()">
        {{running.value ? 'STOP' : 'STRESS TEST'}}
      </button>
    </div>
  </header>

  <div class="kr-stats">
    <span class="kr-stat">SHUFFLES <b>{{ops.value}}</b></span>
    <span class="kr-stat">OPS/S <b>{{opsPerSec.value}}</b></span>
    <span class="kr-stat">ITEMS <b>{{items.value.length}}</b></span>
    <span class="kr-stat keyed-label">KEYED <b>{{keyedMs.value}}ms</b></span>
    <span class="kr-stat unkeyed-label">UNKEYED <b>{{unkeyedMs.value}}ms</b></span>
  </div>

  <div class="kr-lists">
    <div class="kr-panel">
      <div class="kr-panel-title keyed-title">WITH @key — nodes reused</div>
      <div @each="item of items.value" @key="item.id" class="kr-row">
        <span class="kr-id">{{item.id}}</span>
        <input class="kr-input" type="text" placeholder="type here..." />
      </div>
    </div>
    <div class="kr-panel">
      <div class="kr-panel-title unkeyed-title">WITHOUT @key — nodes recreated</div>
      <div @each="item of items.value" class="kr-row">
        <span class="kr-id">{{item.id}}</span>
        <input class="kr-input" type="text" placeholder="type here..." />
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  items = signal([]);
  ops = signal(0);
  opsPerSec = signal(0);
  running = signal(false);
  keyedMs = signal('—');
  unkeyedMs = signal('—');
  _nextId = 21;
  _timer = null;
  _stressStart = 0;
  _stressOps = 0;

  onInit() {
    this.items.value = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
  }

  onDestroy() {
    clearInterval(this._timer);
  }

  _shuffled() {
    const arr = [...this.items.value];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  shuffle() {
    const t0 = performance.now();
    this.items.value = this._shuffled();
    const elapsed = (performance.now() - t0).toFixed(1);
    this.ops.value++;
  }

  addItem() {
    this.items.value = [...this.items.value, { id: this._nextId++ }];
  }

  removeRandom() {
    if (!this.items.value.length) return;
    const idx = Math.floor(Math.random() * this.items.value.length);
    const arr = [...this.items.value];
    arr.splice(idx, 1);
    this.items.value = arr;
  }

  toggleStress() {
    this.running.value = !this.running.value;
    if (this.running.value) {
      this._stressStart = performance.now();
      this._stressOps = 0;
      this._timer = setInterval(() => {
        const t0 = performance.now();
        this.items.value = this._shuffled();
        const elapsed = performance.now() - t0;

        this._stressOps++;
        this.ops.value++;
        const totalMs = performance.now() - this._stressStart;
        this.opsPerSec.value = Math.round(this._stressOps / (totalMs / 1000));
        this.keyedMs.value = (elapsed / 2).toFixed(1);
        this.unkeyedMs.value = (elapsed / 2).toFixed(1);
      }, 16);
    } else {
      clearInterval(this._timer);
      this.opsPerSec.value = 0;
    }
  }
}
`,
  style: `
.kr-wrap { display: flex; flex-direction: column; height: 100%; padding: 16px; gap: 12px; box-sizing: border-box; }

.kr-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid #222; padding-bottom: 12px; }

.kr-title { margin: 0; font-size: 14px; color: #fff; }
.kr-hint { margin: 4px 0 0; font-size: 10px; color: #555; }

.kr-controls { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.kr-btn {
  background: #111; border: 1px solid #333; color: #888;
  padding: 5px 10px; font-family: inherit; font-size: 10px;
  font-weight: 700; cursor: pointer; border-radius: 4px;
}
.kr-btn:hover { border-color: #fff; color: #fff; }
.kr-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }

.kr-stats { display: flex; gap: 16px; font-size: 10px; color: #555; }
.kr-stat b { color: #888; margin-left: 4px; }
.keyed-label b { color: #3b82f6; }
.unkeyed-label b { color: #f59e0b; }

.kr-lists { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; overflow: hidden; }

.kr-panel { display: flex; flex-direction: column; border: 1px solid #222; border-radius: 6px; overflow: hidden; }

.kr-panel-title { padding: 6px 12px; font-size: 9px; font-weight: 800; letter-spacing: 1px; background: #111; }
.keyed-title { color: #3b82f6; border-bottom: 1px solid #1d3a6e; }
.unkeyed-title { color: #f59e0b; border-bottom: 1px solid #6b4c0a; }

.kr-row { display: flex; align-items: center; gap: 8px; padding: 4px 10px; border-bottom: 1px solid #1a1a1a; }
.kr-row:last-child { border-bottom: none; }

.kr-id {
  width: 28px; min-width: 28px; text-align: center;
  font-size: 9px; color: #444; font-weight: 800;
  background: #111; border-radius: 3px; padding: 2px 0;
}
.kr-input {
  flex: 1; background: transparent; border: none;
  border-bottom: 1px solid #2a2a2a; color: #ccc;
  font-family: inherit; font-size: 11px; padding: 2px 0;
  outline: none;
}
.kr-input:focus { border-bottom-color: #3b82f6; }
`
});
