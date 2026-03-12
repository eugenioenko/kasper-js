window.EXAMPLES.push({
  name: "Context Switcher",
  id: "tabs",
  template: String.raw`
<div class="tabs-app">
  <div class="tab-triggers">
    <button @class="tab.value === 'nodes' ? 'active' : ''" @on:click="tab.value = 'nodes'">NODES</button>
    <button @class="tab.value === 'uplink' ? 'active' : ''" @on:click="tab.value = 'uplink'">UPLINK</button>
    <button @class="tab.value === 'config' ? 'active' : ''" @on:click="tab.value = 'config'">CONFIG</button>
  </div>

  <div class="tab-window">
    <div @if="tab.value === 'nodes'" class="view">
      <div class="node-item">LOCAL_SERVER [ONLINE]</div>
      <div class="node-item text-dim">REMOTE_EDGE [OFFLINE]</div>
    </div>
    
    <div @elseif="tab.value === 'uplink'" class="view">
      <div class="signal-gauge">SIGNAL_STRENGTH: 84%</div>
      <div class="loader-line"></div>
    </div>
    
    <div @else class="view">
      <div class="config-row">VERSION: 1.0.4-STABLE</div>
      <div class="config-row text-dim">DEBUG_MODE: FALSE</div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  tab = signal("nodes");
}
`,
  style: `
.tabs-app { padding: 20px; }
.tab-triggers { display: flex; gap: 5px; margin-bottom: 20px; }
.tab-triggers button { 
  background: #111; border: 1px solid #333; color: #666; padding: 10px 20px;
  font-family: inherit; font-size: 10px; font-weight: bold; cursor: pointer;
}
.tab-triggers button.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }

.tab-window { background: #000; border: 1px solid #333; min-height: 200px; padding: 20px; border-radius: 4px; }
.view { animation: slideIn 0.2s ease-out; }

.node-item { padding: 10px; border-bottom: 1px solid #111; font-size: 11px; }
.signal-gauge { font-size: 14px; font-weight: 900; color: #22c55e; margin-bottom: 15px; }
.loader-line { height: 2px; background: #22c55e; width: 84%; box-shadow: 0 0 10px #22c55e; }
.config-row { padding: 5px 0; font-size: 11px; }
.text-dim { color: #333; }

@keyframes slideIn { from { opacity: 0; transform: translateY(5px); } }
`
});
