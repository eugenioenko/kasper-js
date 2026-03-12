window.EXAMPLES.push({
  name: "Data Table",
  id: "table",
  template: String.raw`
<div class="dt-app">
  <div class="dt-toolbar">
    <div class="dt-search">
      <span class="dt-search-icon">⌕</span>
      <input type="text" placeholder="FILTER..." @on:input="query.value = $event.target.value" />
      <span class="dt-count">{{rows.length}} / {{data.value.length}}</span>
    </div>
    <div class="dt-filters">
      <button @each="s of statuses" class="dt-filter-btn" @class="statusFilter.value == s ? 'active' : ''" @on:click="statusFilter.value = s">
        {{s}}
      </button>
    </div>
  </div>

  <div class="dt-table-wrap">
    <table class="dt-table">
      <thead>
        <tr>
          <th class="dt-th" @on:click="sort('name')">
            NAME <span class="dt-sort-icon">{{sortIcon('name')}}</span>
          </th>
          <th class="dt-th" @on:click="sort('category')">
            CATEGORY <span class="dt-sort-icon">{{sortIcon('category')}}</span>
          </th>
          <th class="dt-th dt-th-num" @on:click="sort('value')">
            VALUE <span class="dt-sort-icon">{{sortIcon('value')}}</span>
          </th>
          <th class="dt-th dt-th-num" @on:click="sort('latency')">
            LATENCY <span class="dt-sort-icon">{{sortIcon('latency')}}</span>
          </th>
          <th class="dt-th">STATUS</th>
        </tr>
      </thead>
      <tbody>
        <tr @each="row of rows" class="dt-row">
          <td class="dt-td dt-td-name">{{row.name}}</td>
          <td class="dt-td"><span class="dt-tag">{{row.category}}</span></td>
          <td class="dt-td dt-td-num">{{row.value}}</td>
          <td class="dt-td dt-td-num" @class="row.latency > 200 ? 'dt-warn' : ''">{{row.latency}}ms</td>
          <td class="dt-td"><span class="dt-status" @class="row.status.toLowerCase()">{{row.status}}</span></td>
        </tr>
        <tr @if="rows.length == 0">
          <td colspan="5" class="dt-empty">NO RESULTS FOUND</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`,
  script: `
class App extends Component {
  query = signal('');
  sortCol = signal('name');
  sortDir = signal(1);
  statusFilter = signal('ALL');
  statuses = ['ALL', 'ONLINE', 'IDLE', 'OFFLINE'];

  data = signal([
    { name: 'alpha-node',    category: 'COMPUTE',  value: 4096, latency: 12,  status: 'ONLINE'  },
    { name: 'beta-relay',    category: 'NETWORK',  value: 1200, latency: 340, status: 'IDLE'    },
    { name: 'gamma-store',   category: 'STORAGE',  value: 8192, latency: 5,   status: 'ONLINE'  },
    { name: 'delta-proxy',   category: 'NETWORK',  value: 512,  latency: 88,  status: 'ONLINE'  },
    { name: 'epsilon-vault', category: 'STORAGE',  value: 2048, latency: 21,  status: 'OFFLINE' },
    { name: 'zeta-worker',   category: 'COMPUTE',  value: 768,  latency: 145, status: 'IDLE'    },
    { name: 'eta-cache',     category: 'COMPUTE',  value: 256,  latency: 3,   status: 'ONLINE'  },
    { name: 'theta-bridge',  category: 'NETWORK',  value: 320,  latency: 290, status: 'OFFLINE' },
    { name: 'iota-index',    category: 'STORAGE',  value: 16384,latency: 44,  status: 'ONLINE'  },
    { name: 'kappa-stream',  category: 'COMPUTE',  value: 640,  latency: 190, status: 'IDLE'    },
    { name: 'lambda-sync',   category: 'NETWORK',  value: 480,  latency: 67,  status: 'ONLINE'  },
    { name: 'mu-replica',    category: 'STORAGE',  value: 4096, latency: 410, status: 'OFFLINE' },
  ]);

  get rows() {
    const q = this.query.value.toLowerCase();
    const sf = this.statusFilter.value;
    const col = this.sortCol.value;
    const dir = this.sortDir.value;

    return this.data.value
      .filter(r => {
        const matchQ = !q || r.name.includes(q) || r.category.toLowerCase().includes(q);
        const matchS = sf === 'ALL' || r.status === sf;
        return matchQ && matchS;
      })
      .slice()
      .sort((a, b) => {
        const av = a[col], bv = b[col];
        return typeof av === 'number' ? (av - bv) * dir : av.localeCompare(bv) * dir;
      });
  }

  sort(col) {
    if (this.sortCol.value === col) {
      this.sortDir.value *= -1;
    } else {
      this.sortCol.value = col;
      this.sortDir.value = 1;
    }
  }

  sortIcon(col) {
    if (this.sortCol.value !== col) return '⇅';
    return this.sortDir.value === 1 ? '↑' : '↓';
  }
}
`,
  style: `
.dt-app {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 700px;
  margin: 0 auto;
}

.dt-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dt-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  padding: 8px 12px;
  flex: 1;
  min-width: 180px;
}

.dt-search-icon { color: #333; font-size: 16px; }

.dt-search input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  flex: 1;
}

.dt-count {
  font-size: 9px;
  color: #333;
  font-weight: 700;
  white-space: nowrap;
}

.dt-filters {
  display: flex;
  gap: 4px;
}

.dt-filter-btn {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  color: #444;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.dt-filter-btn:hover { color: #aaa; border-color: #333; }
.dt-filter-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }

.dt-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #111;
}

.dt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.dt-th {
  padding: 10px 14px;
  text-align: left;
  font-size: 8px;
  letter-spacing: 2px;
  color: #444;
  font-weight: 800;
  background: #080808;
  border-bottom: 1px solid #111;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: color 0.15s;
}

.dt-th:hover { color: #aaa; }
.dt-th-num { text-align: right; }

.dt-sort-icon {
  font-size: 10px;
  color: #3b82f6;
  margin-left: 4px;
}

.dt-row {
  border-bottom: 1px solid #0d0d0d;
  transition: background 0.1s;
}

.dt-row:last-child { border-bottom: none; }
.dt-row:hover { background: #0a0a0a; }

.dt-td {
  padding: 10px 14px;
  color: #aaa;
  background: transparent;
}

.dt-td-name { color: #e0e0e0; font-weight: 500; }
.dt-td-num { text-align: right; font-variant-numeric: tabular-nums; color: #666; }

.dt-warn { color: #f59e0b !important; }

.dt-tag {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #3b82f6;
  background: rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.15);
  border-radius: 4px;
  padding: 2px 6px;
}

.dt-status {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 4px;
}

.dt-status.online  { background: rgba(34,197,94,0.1);  color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
.dt-status.idle    { background: rgba(234,179,8,0.1);  color: #eab308; border: 1px solid rgba(234,179,8,0.2); }
.dt-status.offline { background: rgba(239,68,68,0.1);  color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

.dt-empty {
  padding: 40px;
  text-align: center;
  color: #333;
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 700;
}
`
});
