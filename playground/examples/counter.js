window.EXAMPLES.push({
  name: "Neo-Counter",
  id: "counter",
  template: String.raw`
<div class="neo-container">
  <div class="circle-viz" @style="'border-color: ' + (count.value > 0 ? '#6366f1' : '#f43f5e')">
    <div class="ripple" @style="'transform: scale(' + (1 + Math.abs(count.value)/20) + ')'"></div>
    <div class="count-display">{{ count.value }}</div>
  </div>
  
  <div class="controls-pill">
    <button @on:click="count.value--">-</button>
    <div class="divider"></div>
    <button @on:click="count.value++">+</button>
  </div>

  <button class="reset-link" @on:click="count.value = 0">Return to Zero</button>
</div>
`,
  script: `
class App extends Component {
  count = signal(0);
}
`,
  style: `
.neo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #0f172a;
}

.circle-viz {
  width: 200px;
  height: 200px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: border-color 0.4s;
  margin-bottom: 40px;
}

.ripple {
  position: absolute;
  inset: -1px;
  border: inherit;
  border-radius: 50%;
  opacity: 0.1;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.count-display {
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -2px;
}

.controls-pill {
  background: #f1f5f9;
  border-radius: 40px;
  display: flex;
  align-items: center;
  padding: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.controls-pill button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s;
}

.controls-pill button:hover {
  background: #fff;
  color: #6366f1;
}

.divider {
  width: 1px;
  height: 20px;
  background: #cbd5e1;
}

.reset-link {
  margin-top: 30px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.reset-link:hover { color: #64748b; }
`
});
