window.EXAMPLES.push({
  name: "Hex Explorer",
  id: "hex-explorer",
  template: String.raw`
<div class="matrix-app">
  <div class="matrix-top-bar">
    <div class="logo">HEX_EXPLORER_v2.0</div>
    <div class="stats">
      <div class="stat"><span>ROWS:</span> 5,000</div>
      <div class="stat"><span>CELLS:</span> 50,000</div>
      <div class="stat"><span>OFFSET:</span> {{ offsetY.value }}px</div>
    </div>
  </div>

  <div class="matrix-scroll-view" @on:scroll="onScroll($event)">
    <div class="matrix-phantom" @style="'height: ' + totalHeight + 'px'">
      <div class="matrix-viewport" @style="'transform: translateY(' + offsetY.value + 'px)'">
        <div @each="row of visibleRows.value" class="matrix-row" @key="row.index">
          <div class="cell index-cell">{{ row.index }}</div>
          <div @each="cell of row.cells" class="cell data-cell">
            <span class="byte" @class="cell.highlight ? 'high' : ''">{{ cell.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  rowHeight = 32;
  totalRows = 5000;
  visibleCount = 30;
  totalHeight = 5000 * 32;

  offsetY = signal(0);
  visibleRows = signal([]);

  onMount() {
    this.update(0);
  }

  onScroll(e) {
    const top = e.target.scrollTop;
    this.update(top);
  }

  update(top) {
    const start = Math.floor(top / this.rowHeight);
    const end = Math.min(this.totalRows, start + this.visibleCount);
    
    const rows = [];
    for (let i = start; i < end; i++) {
      rows.push({
        index: i,
        cells: Array.from({ length: 10 }, (_, j) => ({
          value: (Math.random() * 255 | 0).toString(16).padStart(2, '0').toUpperCase(),
          highlight: Math.random() > 0.95
        }))
      });
    }
    
    this.visibleRows.value = rows;
    this.offsetY.value = start * this.rowHeight;
  }
}
`,
  style: `
.matrix-app {
  display: flex;
  flex-direction: column;
  height: 100%; /* Force fill container */
  background: #f8f9fa;
  color: #1a1a1a;
  font-family: 'SF Mono', 'Fira Code', monospace;
  position: absolute; /* Take over full parent space */
  inset: 0;
}

.matrix-top-bar {
  padding: 15px 25px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.logo { font-weight: 800; font-size: 14px; color: #6366f1; }
.stats { display: flex; gap: 20px; }
.stat { font-size: 10px; color: #6c757d; }
.stat span { font-weight: bold; color: #adb5bd; }

.matrix-scroll-view {
  flex: 1;
  overflow-y: scroll; /* Force scrollbar */
  background: #fff;
  position: relative;
}

.matrix-phantom {
  width: 100%;
  pointer-events: none;
}

.matrix-viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 15px;
  pointer-events: auto; /* Re-enable pointer events for the rows */
}

.matrix-row {
  display: flex;
  height: 32px;
  align-items: center;
  border-bottom: 1px solid #f1f3f5;
}

.cell { flex: 1; font-size: 11px; padding: 0 5px; }
.index-cell { max-width: 50px; color: #cbd5e1; font-size: 9px; text-align: right; border-right: 1px solid #f1f3f5; margin-right: 10px; }
.data-cell { display: flex; justify-content: center; }
.byte { color: #64748b; }
.byte.high { color: #6366f1; font-weight: 800; }

.matrix-scroll-view::-webkit-scrollbar { width: 10px; }
.matrix-scroll-view::-webkit-scrollbar-track { background: #f8fafc; }
.matrix-scroll-view::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; border: 2px solid #f8fafc; }
.matrix-scroll-view::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
`
});
