window.EXAMPLES.push({
  name: "Flow Wizard",
  id: "wizard",
  template: String.raw`
<div class="wizard-app">
  <div class="wizard-card">
    <header class="wizard-header">
      <div class="progress-bar">
        <div class="progress-fill" @style="'width: ' + ((step.value + 1) / 3 * 100) + '%'"></div>
      </div>
      <div class="steps-info">Step {{ step.value + 1 }} of 3</div>
    </header>

    <main class="wizard-content">
      <div @if="step.value === 0" class="step-pane">
        <h1>Welcome</h1>
        <p>Let's begin the initialization sequence.</p>
        <div class="field">
          <label>IDENTITY_NAME</label>
          <input type="text" @value="form.value.name" @on:input="updateField('name', $event.target.value)" placeholder="Enter name..." />
        </div>
      </div>

      <div @elseif="step.value === 1" class="step-pane">
        <h1>Preferences</h1>
        <p>Configure your workspace parameters.</p>
        <div class="options">
          <button @class="form.value.theme === 'dark' ? 'active' : ''" @on:click="updateField('theme', 'dark')">DARK_MODE</button>
          <button @class="form.value.theme === 'light' ? 'active' : ''" @on:click="updateField('theme', 'light')">LIGHT_MODE</button>
        </div>
      </div>

      <div @else class="step-pane">
        <h1>Confirmation</h1>
        <p>Review and finalize setup.</p>
        <div class="summary">
          <div class="row"><span>NAME:</span> {{ form.value.name || 'Anonymous' }}</div>
          <div class="row"><span>THEME:</span> {{ form.value.theme.toUpperCase() }}</div>
        </div>
      </div>
    </main>

    <footer class="wizard-footer">
      <button class="btn-back" @if="step.value > 0" @on:click="step.value--">BACK</button>
      <div class="spacer"></div>
      <button class="btn-next" @if="step.value < 2" @on:click="step.value++" @disabled="!form.value.name && step.value === 0">NEXT</button>
      <button class="btn-finish" @if="step.value === 2" @on:click="finish()">FINISH</button>
    </footer>
  </div>
</div>
`,
  script: `
class App extends Component {
  step = signal(0);
  form = signal({
    name: '',
    theme: 'dark'
  });

  updateField(field, val) {
    this.form.value = { ...this.form.value, [field]: val };
  }

  finish() {
    alert('Setup Complete for ' + this.form.value.name);
    this.step.value = 0;
  }
}
`,
  style: `
.wizard-app {
  height: 100%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1c1e21;
}

.wizard-card {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.wizard-header {
  padding: 20px 30px;
  border-bottom: 1px solid #f0f2f5;
}

.progress-bar {
  height: 4px;
  background: #f0f2f5;
  border-radius: 2px;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.steps-info {
  font-size: 11px;
  font-weight: 700;
  color: #8d949e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.wizard-content {
  padding: 40px 30px;
  min-height: 280px;
}

.step-pane h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 800;
}

.step-pane p {
  color: #606770;
  margin-bottom: 30px;
}

.field label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1c1e21;
}

.field input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f0f2f5;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus { border-color: #007bff; }

.options { display: flex; gap: 10px; }
.options button {
  flex: 1;
  padding: 15px;
  border: 2px solid #f0f2f5;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 11px;
}

.options button.active {
  border-color: #007bff;
  background: #f0f7ff;
  color: #007bff;
}

.summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.summary .row {
  margin-bottom: 10px;
  font-size: 13px;
}

.summary .row span {
  font-weight: 800;
  color: #8d949e;
  margin-right: 10px;
  font-size: 10px;
}

.wizard-footer {
  padding: 20px 30px;
  background: #f8f9fa;
  display: flex;
}

.spacer { flex-grow: 1; }

.wizard-footer button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-back { background: transparent; color: #606770; }
.btn-back:hover { background: #eee; }

.btn-next, .btn-finish { background: #007bff; color: #fff; }
.btn-next:hover, .btn-finish:hover { background: #0056b3; }
.btn-next:disabled { background: #ccc; cursor: not-allowed; }
`
});
