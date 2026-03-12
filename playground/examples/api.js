window.EXAMPLES.push({
  name: "Proxy Node",
  id: "api",
  template: String.raw`
<div class="api-explorer">
  <header>
    <h3>REMOTE_FETCH_v1.0</h3>
    <button class="btn-refresh" @on:click="fetchData()">RE-SCAN</button>
  </header>

  <div @if="loading.value" class="api-loader">
    QUERYING_REMOTE_SERVER...
  </div>

  <div @if="!loading.value" class="user-list">
    <div @each="u of users.value" class="user-item">
      <div class="user-meta">
        <span class="u-id">ID_{{u.id}}</span>
        <span class="u-name">{{u.name}}</span>
      </div>
      <span class="u-email">{{u.email.toLowerCase()}}</span>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  users = signal([]);
  loading = signal(true);

  $onInit() {
    this.fetchData();
  }

  async fetchData() {
    this.loading.value = true;
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      this.users.value = data.slice(0, 5);
    } finally {
      this.loading.value = false;
    }
  }
}
`,
  style: `
.api-explorer { padding: 30px; }
header { display: flex; justify-content: space-between; margin-bottom: 25px; }

.btn-refresh { 
  background: transparent; border: 1px solid #3b82f6; color: #3b82f6; 
  padding: 4px 12px; border-radius: 4px; font-family: inherit; font-size: 10px; cursor: pointer;
}

.api-loader { padding: 40px; text-align: center; color: #333; font-size: 10px; border: 1px dashed #222; }

.user-list { display: grid; gap: 10px; }
.user-item { background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; }
.user-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
.u-id { font-size: 8px; color: #3b82f6; font-weight: bold; }
.u-name { font-size: 12px; font-weight: bold; color: #fff; }
.u-email { font-size: 9px; color: #444; font-family: monospace; }
`
});
