window.EXAMPLES.push({
  name: "Secure Uplink",
  id: "form",
  template: String.raw`
<div class="form-container">
  <div class="form-header">
    <h3>SECURE_UPLINK</h3>
    <div class="enc-mode">AES-256_ENABLED</div>
  </div>

  <div class="form-body">
    <div class="field">
      <label>ACCESS_CODE</label>
      <input type="password" @on:input="pass.value = $event.target.value" placeholder="••••••••" />
      
      <div class="hints">
        <div @class="pass.value.length >= 8 ? 'valid' : 'invalid'">[ ] 8+ CHARACTERS</div>
        <div @class="hasNumber.value ? 'valid' : 'invalid'">[ ] CONTAINS_DIGIT</div>
      </div>
    </div>

    <div @if="isStrong.value" class="success-msg">
      SECURITY_PROTOCOL_MET // READY_FOR_UPLINK
    </div>

    <button class="btn-uplink" @disabled="!isStrong.value" @on:click="alert('UPLINK SUCCESSFUL')">
      ESTABLISH_CONNECTION
    </button>
  </div>
</div>
`,
  script: `
class App extends Component {
  pass = signal("");

  hasNumber = computed(() => {
    return /\\d/.test(this.pass.value);
  });

  isStrong = computed(() => {
    return this.pass.value.length >= 8 && this.hasNumber.value;
  });
}
`,
  style: `
.form-container { max-width: 350px; margin: 50px auto; background: #000; border: 2px solid #222; padding: 30px; border-radius: 4px; }
.form-header { margin-bottom: 30px; border-bottom: 1px solid #222; padding-bottom: 15px; }
.form-header h3 { margin: 0; font-size: 16px; color: #fff; }
.enc-mode { font-size: 8px; color: #22c55e; margin-top: 5px; font-weight: bold; }

.field { display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px; }
.field label { font-size: 9px; color: #666; font-weight: bold; }
.field input { background: #0a0a0a; border: 1px solid #333; padding: 12px; color: #fff; font-family: inherit; }

.hints { display: grid; gap: 5px; margin-top: 10px; }
.hints div { font-size: 9px; font-weight: bold; }
.hints .invalid { color: #450a0a; }
.hints .valid { color: #22c55e; }

.success-msg { background: rgba(34,197,94,0.1); color: #22c55e; padding: 10px; font-size: 9px; font-weight: bold; border: 1px solid #22c55e; margin-bottom: 20px; text-align: center; }

.btn-uplink { 
  width: 100%; padding: 12px; font-family: inherit; font-weight: 900; font-size: 11px;
  background: #fff; color: #000; border: none; cursor: pointer; transition: all 0.2s;
}
.btn-uplink:not(:disabled):hover { background: #22c55e; color: #fff; }
.btn-uplink:disabled { opacity: 0.1; cursor: not-allowed; }
`
});
