window.EXAMPLES.push({
  name: "Neural Grid",
  id: "inventory",
  template: String.raw`
<div class="inventory-app">
  <header>
    <h3>INVENTORY_MODULE</h3>
    <div class="filter-pills">
      <button @class="filter.value == 'all' ? 'active' : ''" @on:click="filter.value = 'all'">ALL</button>
      <button @class="filter.value == 'weapon' ? 'active' : ''" @on:click="filter.value = 'weapon'">WEAPONS</button>
      <button @class="filter.value == 'armor' ? 'active' : ''" @on:click="filter.value = 'armor'">ARMOR</button>
    </div>
  </header>

  <div class="grid">
    <div @each="item of filteredItems.value" class="item-card">
      <div class="item-icon">{{item.type == 'weapon' ? '⚔️' : '🛡️'}}</div>
      <div class="item-info">
        <span class="item-name">{{item.name}}</span>
        <span class="item-power">PWR_{{item.power}}</span>
      </div>
    </div>
    
    <div @if="filteredItems.value.length == 0" class="empty">
      NO_ITEMS_IN_CATEGORY
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  filter = signal("all");
  items = [
    { name: "Plasma Rifle", type: "weapon", power: 85 },
    { name: "Heavy Shield", type: "armor", power: 92 },
    { name: "Laser Blade", type: "weapon", power: 74 },
    { name: "Nano Suit", type: "armor", power: 60 },
    { name: "Arc Cannon", type: "weapon", power: 99 }
  ];

  filteredItems = computed(() => {
    if (this.filter.value === "all") return this.items;
    return this.items.filter(i => i.type === this.filter.value);
  });
}
`,
  style: `
.inventory-app { padding: 20px; }
header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }

.filter-pills { display: flex; gap: 10px; }
.filter-pills button { 
  background: transparent; border: 1px solid #333; color: #666; 
  padding: 4px 12px; border-radius: 20px; font-size: 9px; cursor: pointer;
}
.filter-pills button.active { border-color: #3b82f6; color: #3b82f6; background: rgba(59,130,246,0.1); }

.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.item-card { 
  background: #111; border: 1px solid #222; padding: 15px; border-radius: 8px;
  display: flex; align-items: center; gap: 15px;
}
.item-icon { font-size: 20px; }
.item-info { display: flex; flex-direction: column; }
.item-name { font-size: 12px; font-weight: bold; color: #fff; }
.item-power { font-size: 9px; color: #444; font-family: monospace; }

.empty { grid-column: span 2; text-align: center; padding: 40px; color: #333; font-size: 10px; }
`
});
