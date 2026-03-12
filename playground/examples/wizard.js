window.EXAMPLES.push({
  name: "Form Wizard",
  id: "wizard",
  template: String.raw`
<div class="wz-app">
  <div class="wz-progress-bar">
    <div class="wz-progress-fill" @style="'width:' + progress + '%'"></div>
  </div>

  <div class="wz-steps">
    <div @each="s of steps" class="wz-step-dot" @class="index < step.value ? 'done' : index == step.value ? 'active' : ''">
      <div class="wz-dot-inner">{{index < step.value ? '✓' : index + 1}}</div>
      <div class="wz-dot-label">{{s}}</div>
    </div>
  </div>

  <!-- Step 0: Identity -->
  <div @if="step.value == 0" class="wz-card">
    <h2 class="wz-title">WHO ARE YOU?</h2>
    <p class="wz-sub">Establish your operator identity</p>
    <div class="wz-fields">
      <div class="wz-field">
        <label>CALLSIGN</label>
        <input type="text" placeholder="e.g. ghost_zero" @on:input="name.value = $event.target.value" @attr:value="name.value" />
      </div>
      <div class="wz-field">
        <label>EMAIL</label>
        <input type="email" placeholder="operator@grid.io" @on:input="email.value = $event.target.value" @attr:value="email.value" />
      </div>
    </div>
    <div class="wz-error" @if="!stepOneValid && attempted.value">All fields required</div>
  </div>

  <!-- Step 1: Role -->
  <div @if="step.value == 1" class="wz-card">
    <h2 class="wz-title">PICK YOUR CLASS</h2>
    <p class="wz-sub">Select your primary specialization</p>
    <div class="wz-roles">
      <div @each="r of roles" class="wz-role" @class="role.value == r.id ? 'selected' : ''" @on:click="role.value = r.id">
        <div class="wz-role-icon">{{r.icon}}</div>
        <div class="wz-role-name">{{r.name}}</div>
        <div class="wz-role-desc">{{r.desc}}</div>
      </div>
    </div>
    <div class="wz-error" @if="!role.value && attempted.value">Select a class</div>
  </div>

  <!-- Step 2: Settings -->
  <div @if="step.value == 2" class="wz-card">
    <h2 class="wz-title">CONFIGURE</h2>
    <p class="wz-sub">System preferences</p>
    <div class="wz-toggles">
      <div class="wz-toggle-row" @on:click="notifications.value = !notifications.value">
        <div>
          <div class="wz-toggle-label">PUSH NOTIFICATIONS</div>
          <div class="wz-toggle-desc">Receive mission briefings</div>
        </div>
        <div class="wz-toggle" @class="notifications.value ? 'on' : ''">
          <div class="wz-toggle-thumb"></div>
        </div>
      </div>
      <div class="wz-toggle-row" @on:click="darkMode.value = !darkMode.value">
        <div>
          <div class="wz-toggle-label">STEALTH MODE</div>
          <div class="wz-toggle-desc">Minimal UI surface</div>
        </div>
        <div class="wz-toggle" @class="darkMode.value ? 'on' : ''">
          <div class="wz-toggle-thumb"></div>
        </div>
      </div>
      <div class="wz-toggle-row" @on:click="analytics.value = !analytics.value">
        <div>
          <div class="wz-toggle-label">TELEMETRY</div>
          <div class="wz-toggle-desc">Share performance data</div>
        </div>
        <div class="wz-toggle" @class="analytics.value ? 'on' : ''">
          <div class="wz-toggle-thumb"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 3: Confirm -->
  <div @if="step.value == 3" class="wz-card wz-confirm">
    <div class="wz-confirm-icon">◈</div>
    <h2 class="wz-title">READY TO DEPLOY</h2>
    <div class="wz-summary">
      <div class="wz-summary-row"><span>CALLSIGN</span><span>{{name.value}}</span></div>
      <div class="wz-summary-row"><span>EMAIL</span><span>{{email.value}}</span></div>
      <div class="wz-summary-row"><span>CLASS</span><span>{{selectedRole}}</span></div>
      <div class="wz-summary-row"><span>NOTIFICATIONS</span><span>{{notifications.value ? 'ON' : 'OFF'}}</span></div>
      <div class="wz-summary-row"><span>STEALTH</span><span>{{darkMode.value ? 'ON' : 'OFF'}}</span></div>
    </div>
  </div>

  <!-- Step 4: Done -->
  <div @if="step.value == 4" class="wz-card wz-done">
    <div class="wz-done-icon">⬡</div>
    <h2 class="wz-title">OPERATOR ONLINE</h2>
    <p class="wz-sub">Welcome to the grid, <strong>{{name.value}}</strong></p>
    <button class="wz-restart" @on:click="restart()">START OVER</button>
  </div>

  <div class="wz-nav" @if="step.value < 4">
    <button class="wz-btn wz-back" @on:click="back()" @disabled="step.value == 0">BACK</button>
    <button class="wz-btn wz-next" @on:click="next()">
      {{step.value == 3 ? 'DEPLOY' : 'NEXT'}}
    </button>
  </div>
</div>
`,
  script: `
class App extends Component {
  step = signal(0);
  attempted = signal(false);
  name = signal('');
  email = signal('');
  role = signal('');
  notifications = signal(true);
  darkMode = signal(false);
  analytics = signal(false);

  steps = ['Identity', 'Class', 'Config', 'Review'];
  roles = [
    { id: 'hacker',   icon: '⌨', name: 'HACKER',    desc: 'Systems infiltration' },
    { id: 'engineer', icon: '⚙', name: 'ENGINEER',  desc: 'Build and optimize' },
    { id: 'recon',    icon: '◎', name: 'RECON',     desc: 'Intel and analysis' },
  ];

  get progress() {
    return (this.step.value / 4) * 100;
  }

  get stepOneValid() {
    return this.name.value.trim().length > 0 && this.email.value.includes('@');
  }

  get selectedRole() {
    const r = this.roles.find(r => r.id == this.role.value);
    return r ? r.name : '';
  }

  next() {
    this.attempted.value = true;
    if (this.step.value == 0 && !this.stepOneValid) return;
    if (this.step.value == 1 && !this.role.value) return;
    this.attempted.value = false;
    this.step.value++;
  }

  back() {
    if (this.step.value > 0) this.step.value--;
  }

  restart() {
    this.step.value = 0;
    this.name.value = '';
    this.email.value = '';
    this.role.value = '';
    this.notifications.value = true;
    this.darkMode.value = false;
    this.analytics.value = false;
  }
}
`,
  style: `
.wz-app {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wz-progress-bar {
  height: 2px;
  background: #111;
  border-radius: 2px;
  overflow: hidden;
}

.wz-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px #3b82f6;
}

.wz-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.wz-step-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: default;
}

.wz-dot-inner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #333;
  background: #0a0a0a;
  transition: all 0.3s;
}

.wz-step-dot.active .wz-dot-inner {
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 0 12px rgba(59,130,246,0.4);
}

.wz-step-dot.done .wz-dot-inner {
  border-color: #22c55e;
  background: #22c55e;
  color: #000;
}

.wz-dot-label {
  font-size: 8px;
  color: #333;
  letter-spacing: 1px;
  font-weight: 700;
}

.wz-step-dot.active .wz-dot-label { color: #3b82f6; }
.wz-step-dot.done .wz-dot-label { color: #22c55e; }

.wz-card {
  background: #080808;
  border: 1px solid #111;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 260px;
}

.wz-title {
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.5px;
  color: #fff;
}

.wz-sub {
  margin: 0;
  font-size: 11px;
  color: #444;
}

.wz-fields { display: flex; flex-direction: column; gap: 12px; }

.wz-field { display: flex; flex-direction: column; gap: 6px; }
.wz-field label { font-size: 9px; color: #444; letter-spacing: 2px; font-weight: 700; }
.wz-field input {
  background: #0f0f0f;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  padding: 10px 14px;
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.wz-field input:focus { border-color: #3b82f6; }

.wz-error {
  font-size: 10px;
  color: #ef4444;
  letter-spacing: 1px;
}

.wz-roles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wz-role {
  display: grid;
  grid-template-columns: 36px 100px 1fr;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #111;
  background: #0a0a0a;
  cursor: pointer;
  transition: all 0.2s;
}

.wz-role:hover { border-color: #222; background: #0f0f0f; }

.wz-role.selected {
  border-color: #3b82f6;
  background: rgba(59,130,246,0.06);
}

.wz-role-icon { font-size: 20px; text-align: center; }
.wz-role-name { font-size: 11px; font-weight: 800; color: #ccc; letter-spacing: 1px; }
.wz-role-desc { font-size: 10px; color: #444; }
.wz-role.selected .wz-role-name { color: #3b82f6; }

.wz-toggles { display: flex; flex-direction: column; gap: 0; }

.wz-toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #0f0f0f;
  cursor: pointer;
  gap: 16px;
}

.wz-toggle-row:last-child { border-bottom: none; }

.wz-toggle-label { font-size: 10px; font-weight: 700; color: #ccc; letter-spacing: 1px; }
.wz-toggle-desc { font-size: 10px; color: #333; margin-top: 2px; }

.wz-toggle {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: #111;
  border: 1px solid #1a1a1a;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}

.wz-toggle.on {
  background: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59,130,246,0.4);
}

.wz-toggle-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #333;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s, background 0.2s;
}

.wz-toggle.on .wz-toggle-thumb {
  transform: translateX(18px);
  background: #fff;
}

.wz-confirm { align-items: center; text-align: center; }

.wz-confirm-icon {
  font-size: 40px;
  color: #3b82f6;
  text-shadow: 0 0 20px rgba(59,130,246,0.5);
  line-height: 1;
}

.wz-summary {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.wz-summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #0f0f0f;
  border-radius: 6px;
  font-size: 11px;
}

.wz-summary-row span:first-child { color: #444; letter-spacing: 1px; }
.wz-summary-row span:last-child { color: #fff; }

.wz-done {
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.wz-done-icon {
  font-size: 52px;
  color: #22c55e;
  text-shadow: 0 0 30px rgba(34,197,94,0.5);
  animation: pulse-glow 2s ease-in-out infinite;
  line-height: 1;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(34,197,94,0.4); }
  50% { text-shadow: 0 0 40px rgba(34,197,94,0.8); }
}

.wz-restart {
  margin-top: 8px;
  background: transparent;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  padding: 8px 20px;
  color: #444;
  font-family: inherit;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.wz-restart:hover { border-color: #333; color: #fff; }

.wz-nav {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.wz-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.wz-back {
  background: #0f0f0f;
  color: #555;
  border: 1px solid #1a1a1a;
  flex: 1;
}
.wz-back:hover:not(:disabled) { color: #aaa; border-color: #333; }
.wz-back:disabled { opacity: 0.3; cursor: default; }

.wz-next {
  background: #3b82f6;
  color: #fff;
  flex: 2;
  box-shadow: 0 4px 15px rgba(59,130,246,0.3);
}
.wz-next:hover { background: #60a5fa; transform: translateY(-1px); }
`
});
