window.EXAMPLES.push({
  name: "Style Architect",
  id: "theme-architect",
  template: String.raw`
<div class="architect-container" @style="containerStyle.value">
  <div class="sidebar">
    <div class="sidebar-label">ARCHITECT_CONTROLS</div>
    
    <div class="control-group">
      <label>ACCENT_COLOR</label>
      <input type="color" @value="theme.value.accent" @on:input="updateTheme('accent', $event.target.value)" />
    </div>

    <div class="control-group">
      <label>BORDER_RADIUS: {{ theme.value.radius }}px</label>
      <input type="range" min="0" max="30" @value="theme.value.radius" @on:input="updateTheme('radius', $event.target.value)" />
    </div>

    <div class="control-group">
      <label>GLASS_STRENGTH: {{ theme.value.opacity }}</label>
      <input type="range" min="0" max="1" step="0.1" @value="theme.value.opacity" @on:input="updateTheme('opacity', $event.target.value)" />
    </div>

    <button class="btn-generate" @on:click="randomize()">RANDOMIZE_ID</button>
  </div>

  <div class="preview-area">
    <div class="glass-card" @style="cardStyle.value">
      <div class="card-header" @style="'color:' + theme.value.accent">SYSTEM_PREVIEW</div>
      <h2>Identity Reconstruction</h2>
      <p>Fine-grained reactivity allows for high-performance style injection without triggering full page reflows.</p>
      <div class="button-row">
        <button class="preview-btn" @style="buttonStyle.value">ACTION_A</button>
        <button class="preview-btn secondary" @style="'border-color:' + theme.value.accent">ACTION_B</button>
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  theme = signal({
    accent: '#00f2ff',
    radius: 8,
    opacity: 0.2,
    bg: '#050505'
  });

  containerStyle = this.computed(() => 
    'background:' + this.theme.value.bg
  );

  cardStyle = this.computed(() => 
    'border-radius:' + this.theme.value.radius + 'px;' +
    'background: rgba(255,255,255,' + this.theme.value.opacity + ');' +
    'border: 1px solid ' + this.theme.value.accent + '44'
  );

  buttonStyle = this.computed(() => 
    'background:' + this.theme.value.accent + ';' +
    'border-radius:' + (this.theme.value.radius / 2) + 'px;'
  );

  updateTheme(prop, val) {
    this.theme.value = { ...this.theme.value, [prop]: val };
  }

  randomize() {
    const colors = ['#00f2ff', '#ff3e00', '#00ff66', '#ffcc00', '#ff00ff'];
    this.theme.value = {
      ...this.theme.value,
      accent: colors[Math.floor(Math.random() * colors.length)],
      radius: Math.floor(Math.random() * 30),
      opacity: Math.random().toFixed(1)
    };
  }
}
`,
  style: `
.architect-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100%;
  color: #fff;
  font-family: inherit;
}

.sidebar {
  background: rgba(0,0,0,0.3);
  border-right: 1px solid #222;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar-label {
  font-size: 10px;
  letter-spacing: 2px;
  color: #444;
  margin-bottom: 10px;
}

.control-group label {
  display: block;
  font-size: 9px;
  margin-bottom: 8px;
  color: #888;
}

.control-group input[type="range"] {
  width: 100%;
  accent-color: #00f2ff;
}

.control-group input[type="color"] {
  width: 100%;
  height: 30px;
  background: none;
  border: 1px solid #333;
  cursor: pointer;
}

.btn-generate {
  margin-top: auto;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  padding: 10px;
  font-size: 10px;
  cursor: pointer;
}

.btn-generate:hover { background: #fff; color: #000; }

.preview-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.glass-card {
  padding: 40px;
  max-width: 400px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.card-header {
  font-size: 10px;
  letter-spacing: 3px;
  margin-bottom: 20px;
}

.glass-card h2 {
  margin: 0 0 15px 0;
  font-size: 28px;
}

.glass-card p {
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 30px;
}

.button-row {
  display: flex;
  gap: 15px;
}

.preview-btn {
  border: none;
  padding: 12px 25px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
}

.preview-btn.secondary {
  background: transparent;
  border: 1px solid;
  color: #fff;
}
`
});
