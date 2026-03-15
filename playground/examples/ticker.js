window.EXAMPLES.push({
  name: "Signal Stream",
  id: "ticker",
  template: String.raw`
<div class="ticker-view">
  <header>
    <h3>MARKET_STREAM</h3>
    <div class="live-tag">LIVE_DATA</div>
  </header>

  <div class="market-list">
    <div @each="m of markets.value" class="market-row">
      <span class="m-name">{{m.name}}</span>
      <div class="m-price-group">
        <span class="m-price" @class="m.dir.value">{{m.price.value.toFixed(2)}}</span>
        <span class="m-trend">{{m.dir.value === 'up' ? '▲' : '▼'}}</span>
      </div>
    </div>
  </div>
  
  <p class="footer-note">Surgical updates targeting only price nodes.</p>
</div>
`,
  script: `
class App extends Component {
  markets = signal([
    { name: "BTC/USD", price: signal(64230.50), dir: signal("up") },
    { name: "ETH/USD", price: signal(3450.20), dir: signal("down") },
    { name: "KSP/USD", price: signal(1.24), dir: signal("up") }
  ]);

  onMount() {
    this.timer = setInterval(() => {
      this.markets.value.forEach(m => {
        const change = (Math.random() - 0.5) * (m.price.value * 0.01);
        m.price.value += change;
        m.dir.value = change > 0 ? "up" : "down";
      });
    }, 500);
  }

  onDestroy() {
    clearInterval(this.timer);
  }
}
`,
  style: `
.ticker-view { padding: 30px; max-width: 400px; margin: 0 auto; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.live-tag { font-size: 8px; background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 2px; animation: pulse 1s infinite; }

.market-list { display: grid; gap: 1px; background: #222; border: 1px solid #222; }
.market-row { 
  display: flex; justify-content: space-between; padding: 15px; 
  background: #000; align-items: center;
}

.m-name { font-weight: bold; color: #666; font-size: 12px; }
.m-price-group { display: flex; align-items: center; gap: 10px; }
.m-price { font-family: monospace; font-size: 16px; font-weight: 900; min-width: 80px; text-align: right; }
.m-price.up { color: #22c55e; }
.m-price.down { color: #ef4444; }
.m-trend { font-size: 10px; }

.footer-note { font-size: 9px; color: #333; margin-top: 20px; text-align: center; }

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
`
});
