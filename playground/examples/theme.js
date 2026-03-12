window.EXAMPLES.push({
  name: "Visual Overdrive",
  id: "theme",
  template: String.raw`
<div class="theme-container" @class="currentTheme.value">
  <div class="theme-card">
    <div class="card-header" @style="'border-bottom-color: ' + accentColor.value">
      <h3>CORE_OVERRIDE</h3>
      <div class="accent-dot" @style="'background: ' + accentColor.value"></div>
    </div>
    
    <p>Select a visual profile to override the system interface parameters.</p>
    
    <div class="theme-selector">
      <button class="t-btn" @on:click="setTheme('matrix', '#00ff41')">MATRIX</button>
      <button class="t-btn" @on:click="setTheme('fire', '#ff4d00')">FIRE</button>
      <button class="t-btn" @on:click="setTheme('neon', '#00f2ff')">NEON</button>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  currentTheme = signal("matrix");
  accentColor = signal("#00ff41");

  setTheme(name, color) {
    this.currentTheme.value = name;
    this.accentColor.value = color;
  }
}
`,
  style: `
.theme-container { 
  height: 100%; display: flex; align-items: center; justify-content: center; 
  transition: background 0.5s;
}

.theme-card {
  background: #000; border: 2px solid #333; padding: 30px; border-radius: 4px;
  max-width: 300px; text-align: center;
}

.card-header { 
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px;
}

.accent-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }

.theme-selector { display: grid; gap: 10px; margin-top: 30px; }

.t-btn {
  background: transparent; border: 1px solid #333; color: #fff; padding: 10px;
  font-family: inherit; font-size: 10px; cursor: pointer; transition: all 0.2s;
}

/* MATRIX */
.matrix { background: #000a00; color: #00ff41; }
.matrix .t-btn:hover { border-color: #00ff41; color: #00ff41; box-shadow: inset 0 0 10px #00ff41; }

/* FIRE */
.fire { background: #1a0500; color: #ff4d00; }
.fire .t-btn:hover { border-color: #ff4d00; color: #ff4d00; box-shadow: inset 0 0 10px #ff4d00; }

/* NEON */
.neon { background: #05001a; color: #00f2ff; }
.neon .t-btn:hover { border-color: #00f2ff; color: #00f2ff; box-shadow: inset 0 0 10px #00f2ff; }
`
});
