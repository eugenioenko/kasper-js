window.EXAMPLES.push({
  name: "Digital Pulse",
  id: "counter",
  template: String.raw`
<div class="counter-container">
  <div class="pulse-ring" @style="'transform: scale(' + (1 + count.value/100) + '); opacity: ' + (0.5 - count.value/200)"></div>
  <h1 class="display">{{count.value}}</h1>
  <p class="label">PULSE_FREQUENCY</p>
  
  <div class="controls">
    <button class="btn-cyan" @on:click="count.value--">DECREMENT</button>
    <button class="btn-cyan" @on:click="count.value++">INCREMENT</button>
  </div>
  
  <button class="btn-reset" @on:click="count.value = 0">RESET_CORE</button>
</div>
`,
  script: `
class App extends Component {
  count = signal(0);
}
`,
  style: `
.counter-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.pulse-ring {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 4px solid #00f2ff;
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.display {
  font-size: 120px;
  font-weight: 900;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 30px rgba(0, 242, 255, 0.5);
}

.label {
  color: #00f2ff;
  font-size: 10px;
  letter-spacing: 4px;
  margin-bottom: 40px;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.btn-cyan {
  background: transparent;
  border: 2px solid #00f2ff;
  color: #00f2ff;
  padding: 10px 20px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cyan:hover {
  background: #00f2ff;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
}

.btn-reset {
  background: transparent;
  border: none;
  color: #444;
  font-family: inherit;
  font-size: 9px;
  text-decoration: underline;
  cursor: pointer;
}

.btn-reset:hover { color: #fff; }
`
});
