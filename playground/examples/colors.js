window.EXAMPLES.push({
  name: "Color Mixer",
  id: "colors",
  template: String.raw`
<div class="cm-app">
  <div class="cm-preview" @style="'background:' + hex">
    <div class="cm-hex" @style="'color:' + contrast">{{hex}}</div>
    <div class="cm-codes" @style="'color:' + contrast + '; opacity: 0.6'">
      <span>{{rgb}}</span>
      <span>{{hsl}}</span>
    </div>
    <button class="cm-save" @style="'color:' + contrast + '; border-color: ' + contrast" @on:click="save()">
      SAVE
    </button>
  </div>

  <div class="cm-sliders">
    <div class="cm-slider-group">
      <div class="cm-slider-header">
        <span class="cm-channel cm-r">R</span>
        <span class="cm-val">{{r.value}}</span>
      </div>
      <input class="cm-range cm-range-r" type="range" min="0" max="255" @attr:value="r.value" @on:input="r.value = Number($event.target.value)" />
    </div>
    <div class="cm-slider-group">
      <div class="cm-slider-header">
        <span class="cm-channel cm-g">G</span>
        <span class="cm-val">{{g.value}}</span>
      </div>
      <input class="cm-range cm-range-g" type="range" min="0" max="255" @attr:value="g.value" @on:input="g.value = Number($event.target.value)" />
    </div>
    <div class="cm-slider-group">
      <div class="cm-slider-header">
        <span class="cm-channel cm-b">B</span>
        <span class="cm-val">{{b.value}}</span>
      </div>
      <input class="cm-range cm-range-b" type="range" min="0" max="255" @attr:value="b.value" @on:input="b.value = Number($event.target.value)" />
    </div>
  </div>

  <div class="cm-palette" @if="saved.value.length > 0">
    <div class="cm-palette-label">SAVED</div>
    <div class="cm-swatches">
      <div @each="c of saved.value"
           class="cm-swatch"
           @style="'background:' + c.hex"
           @attr:title="c.hex"
           @on:click="load(c.hex)">
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  r = signal(0);
  g = signal(180);
  b = signal(255);
  saved = signal([]);

  get hex() {
    const toHex = v => v.toString(16).padStart(2, '0');
    return '#' + toHex(this.r.value) + toHex(this.g.value) + toHex(this.b.value);
  }

  get rgb() {
    return 'rgb(' + this.r.value + ', ' + this.g.value + ', ' + this.b.value + ')';
  }

  get hsl() {
    const r = this.r.value / 255, g = this.g.value / 255, b = this.b.value / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return 'hsl(' + Math.round(h * 360) + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';
  }

  get contrast() {
    const lum = (0.299 * this.r.value + 0.587 * this.g.value + 0.114 * this.b.value) / 255;
    return lum > 0.55 ? '#000000' : '#ffffff';
  }

  save() {
    const h = this.hex;
    if (this.saved.value.find(c => c.hex === h)) return;
    this.saved.value = [{ hex: h }, ...this.saved.value].slice(0, 12);
  }

  load(hex) {
    this.r.value = parseInt(hex.slice(1, 3), 16);
    this.g.value = parseInt(hex.slice(3, 5), 16);
    this.b.value = parseInt(hex.slice(5, 7), 16);
  }
}
`,
  style: `
.cm-app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cm-preview {
  border-radius: 16px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  transition: background 0.1s;
  padding: 20px;
}

.cm-hex {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1;
  transition: color 0.1s;
}

.cm-codes {
  display: flex;
  gap: 16px;
  font-size: 10px;
  letter-spacing: 1px;
  transition: color 0.1s;
}

.cm-save {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: transparent;
  border: 1px solid;
  border-radius: 6px;
  padding: 4px 10px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.cm-save:hover { opacity: 1; }

.cm-sliders {
  background: #0a0a0a;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #111;
}

.cm-slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cm-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cm-channel {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}
.cm-r { color: #ff4444; }
.cm-g { color: #44ff88; }
.cm-b { color: #4488ff; }

.cm-val {
  font-size: 11px;
  color: #555;
  font-variant-numeric: tabular-nums;
  width: 28px;
  text-align: right;
}

.cm-range {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.cm-range-r { background: linear-gradient(to right, #000, #ff4444); }
.cm-range-g { background: linear-gradient(to right, #000, #44ff88); }
.cm-range-b { background: linear-gradient(to right, #000, #4488ff); }

.cm-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  cursor: pointer;
}

.cm-palette {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cm-palette-label {
  font-size: 8px;
  color: #333;
  letter-spacing: 3px;
  font-weight: 800;
}

.cm-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cm-swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1px solid rgba(255,255,255,0.05);
}

.cm-swatch:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
`
});
