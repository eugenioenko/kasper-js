window.EXAMPLES.push({
  name: "Identity Architect",
  id: "identity",
  template: String.raw`
<div class="identity-panel">
  <header>
    <h2>IDENTITY_GENERATOR</h2>
    <p>DERIVED_STATE_v2.4</p>
  </header>

  <div class="form-grid">
    <div class="input-group">
      <label>FIRST_NAME</label>
      <input type="text" @on:input="first.value = $event.target.value" placeholder="Enter..." />
    </div>
    <div class="input-group">
      <label>LAST_NAME</label>
      <input type="text" @on:input="last.value = $event.target.value" placeholder="Enter..." />
    </div>
  </div>

  <div class="output-card">
    <div class="output-row">
      <span class="out-label">FULL_NAME:</span>
      <span class="out-value">{{fullName.value}}</span>
    </div>
    <div class="output-row">
      <span class="out-label">ACCESS_TOKEN:</span>
      <span class="out-value token">{{token.value}}</span>
    </div>
    <div class="output-row">
      <span class="out-label">STRENGTH:</span>
      <div class="strength-bar">
        <div class="fill" @style="'width: ' + (fullName.value.length * 5) + '%; background: ' + (fullName.value.length > 10 ? '#22c55e' : '#eab308')"></div>
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  first = signal("John");
  last = signal("Doe");

  fullName = computed(() => {
    return this.first.value + " " + this.last.value;
  });

  token = computed(() => {
    if (!this.first.value || !this.last.value) return "PENDING_DATA...";
    const raw = (this.first.value + this.last.value).toUpperCase();
    return "KSP-" + btoa(raw).substring(0, 12);
  });
}
`,
  style: `
.identity-panel { max-width: 400px; margin: 40px auto; }
header { margin-bottom: 30px; border-left: 4px solid #a855f7; padding-left: 15px; }
header h2 { margin: 0; font-size: 18px; }
header p { font-size: 9px; color: #a855f7; margin: 0; font-weight: bold; }

.form-grid { display: grid; gap: 15px; margin-bottom: 30px; }
.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-group label { font-size: 9px; color: #444; font-weight: bold; }
.input-group input { 
  background: #111; border: 1px solid #333; padding: 10px; color: #fff; 
  font-family: inherit; outline: none; border-radius: 4px;
}
.input-group input:focus { border-color: #a855f7; }

.output-card { 
  background: #0a0a0a; border: 1px solid #222; padding: 20px; border-radius: 8px;
  display: flex; flex-direction: column; gap: 12px;
}
.output-row { display: flex; justify-content: space-between; align-items: center; }
.out-label { font-size: 9px; color: #555; }
.out-value { font-size: 12px; font-weight: bold; color: #fff; }
.out-value.token { font-family: monospace; color: #a855f7; }

.strength-bar { width: 100px; height: 4px; background: #222; border-radius: 2px; overflow: hidden; }
.strength-bar .fill { h-full transition: all 0.3s; }
`
});
