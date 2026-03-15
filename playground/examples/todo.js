const TodoExample = {
  name: "Todo App",
  id: "todo",
  template: String.raw`
<!------------------------------------------------------------------------------
KASPER-JS // MODAL-DRIVEN REACTIVE CRUD
------------------------------------------------------------------------------->

<div class="app-container">
  <!-- header -->
  <header class="main-header">
    <div class="brand">
      <div class="logo-orb"></div>
      <div>
        <h3>KASPER_CORE</h3>
        <div class="badge-row">
          <span class="badge badge-cyan">UPTIME: {{uptime.value}}S</span>
          <span class="badge badge-purple">SYS: STABLE</span>
        </div>
      </div>
    </div>
    
    <button class="btn-create" @on:click="isAdding.value = true">
      + NEW_TASK
    </button>
  </header>

  <!-- search filter -->
  <div class="search-bar-simple">
    <input 
      type="text" 
      placeholder="FILTER_REGISTRY..." 
      @on:input="searchQuery.value = $event.target.value"
    />
    <span class="search-meta">{{filteredTodos.length}} MATCHES</span>
  </div>

  <!-- loader -->
  <div @if="loading.value" class="loader">
    <div class="scanner-bar"></div>
    <span>SYNCHRONIZING...</span>
  </div>

  <!-- list -->
  <div @if="!loading.value" class="task-grid">
    <div @if="filteredTodos.length == 0" class="empty-state">
      {{ searchQuery.value ? 'NO_MATCHES_FOUND' : 'SYSTEM_IDLE' }}
    </div>

    <div @each="todo of filteredTodos">
      <todo-card @class="todo.completed ? 'completed' : ''">
        <div class="card-inner">
          <div class="card-main">
            <div class="neon-checkbox" @on:click="toggleTodo(todo)">
              <div @if="todo.completed" class="neon-check"></div>
            </div>
            <span class="task-text">{{todo.title}}</span>
          </div>
          <div class="card-footer">
            <span class="tag">#{{todo.id}}</span>
            <button class="action-btn delete" @on:click="deleteTodo(todo.id)">TERMINATE</button>
          </div>
        </div>
      </todo-card>
    </div>
  </div>

  <!-- modal dialog -->
  <div @if="isAdding.value" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h4>INITIALIZE_NEW_ENTRY</h4>
        <button class="close-modal" @on:click="isAdding.value = false">×</button>
      </div>
      
      <div class="modal-body">
        <div class="input-field">
          <label>TASK_TITLE</label>
          <input 
            type="text" 
            placeholder="Enter task name..."
            @on:input="newTitle.value = $event.target.value"
            @on:keydown="$event.key == 'Enter' && addTodo()"
          />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @on:click="isAdding.value = false">CANCEL</button>
        <button 
          class="btn-execute-modal"
          @on:click="addTodo()"
          @disabled="!newTitle.value">
          EXECUTE_ADD
        </button>
      </div>
    </div>
  </div>
</div>
`,
  script: `
const API_URL = 'https://69b23f3de06ef68ddd946d85.mockapi.io/todos';

class App extends Component {
  todos = signal([]);
  loading = signal(true);
  uptime = signal(0);
  newTitle = signal("");
  searchQuery = signal("");
  isAdding = signal(false);

  onMount() {
    this.fetchTodos();
    this.timer = setInterval(() => {
      this.uptime.value++;
    }, 1000);
  }

  get filteredTodos() {
    const q = this.searchQuery.value.toLowerCase();
    if (!q) return this.todos.value;
    return this.todos.value.filter(t => t.title.toLowerCase().includes(q));
  }

  get completedCount() {
    return (this.todos.value || []).filter(t => t.completed).length;
  }

  onDestroy() {
    clearInterval(this.timer);
  }

  async fetchTodos() {
    this.loading.value = true;
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      this.todos.value = data.sort((a, b) => b.id - a.id);
    } finally {
      this.loading.value = false;
    }
  }

  async addTodo() {
    if (!this.newTitle.value) return;
    const title = this.newTitle.value;
    
    this.isAdding.value = false;
    this.newTitle.value = "";

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false })
    });
    
    if (response.ok) {
      const newTodo = await response.json();
      this.todos.value = [newTodo, ...this.todos.value];
    }
  }

  async toggleTodo(todo) {
    const updated = { ...todo, completed: !todo.completed };
    this.todos.value = this.todos.value.map(t => t.id === todo.id ? updated : t);
    await fetch(\`\${API_URL}/\${todo.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  }

  async deleteTodo(id) {
    const original = [...this.todos.value];
    this.todos.value = this.todos.value.filter(t => t.id !== id);
    const response = await fetch(\`\${API_URL}/\${id}\`, { method: 'DELETE' });
    if (!response.ok) {
      this.todos.value = original;
      alert("TERMINATION_FAILED");
    }
  }
}

class TodoCard extends Component {}
register("todo-card", TodoCard, '<div class="glass-card" @class="args.class"><slot></slot></div>');
`,
  style: `
.app-container { max-width: 650px; margin: 0 auto; font-family: 'JetBrains Mono', monospace; color: #e0e0e0; padding: 20px; }
body { background-color: #1a1c1e !important; }

/* HEADER */
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.brand { display: flex; align-items: center; gap: 15px; }
.logo-orb {
  width: 30px; height: 30px;
  background: conic-gradient(from 180deg at 50% 50%, #00f2ff, #7000ff, #00f2ff);
  border-radius: 50%; box-shadow: 0 0 15px rgba(112, 0, 255, 0.5);
  animation: rotate 4s linear infinite;
}
.brand h3 { font-size: 18px; font-weight: 800; letter-spacing: -1px; margin: 0; color: #fff; }
.badge-row { display: flex; gap: 8px; margin-top: 2px; }
.badge { font-size: 8px; padding: 1px 6px; border-radius: 4px; font-weight: bold; }
.badge-cyan { background: rgba(0, 242, 255, 0.1); color: #00f2ff; border: 1px solid rgba(0, 242, 255, 0.2); }
.badge-purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.2); }

.btn-create {
  background: #3b82f6; color: #fff; border: none; padding: 8px 16px; border-radius: 8px;
  font-family: inherit; font-size: 11px; font-weight: 800; cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); transition: all 0.2s;
}
.btn-create:hover { background: #60a5fa; transform: translateY(-1px); }

/* SEARCH BAR SIMPLE */
.search-bar-simple {
  display: flex; align-items: center; justify-content: space-between;
  background: #0a0a0a; border: 2px solid #222; border-radius: 10px;
  padding: 8px 15px; margin-bottom: 25px;
}
.search-bar-simple input {
  background: transparent; border: none; color: #fff; font-family: inherit;
  font-size: 11px; outline: none; flex-grow: 1;
}
.search-meta { font-size: 9px; color: #444; font-weight: bold; }

/* TASK LIST */
.task-grid { display: flex; flex-direction: column; gap: 10px; }
.glass-card {
  background: rgba(255,255,255,0.04); border-radius: 12px; border: 2px solid rgba(255,255,255,0.1);
  padding: 12px 16px; transition: all 0.2s ease;
}
.glass-card:hover { border-color: rgba(59, 130, 246, 0.4); background: rgba(255,255,255,0.06); }
.glass-card.completed { opacity: 0.3; }
.card-inner { display: flex; flex-direction: column; gap: 8px; }
.card-main { display: flex; align-items: center; gap: 12px; }
.task-text { font-size: 13px; font-weight: 600; color: #eee; }
.completed .task-text { text-decoration: line-through; color: #666; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.03); }
.tag { color: #333; font-size: 9px; font-weight: bold; }
.action-btn { background: transparent; border: none; font-size: 9px; font-weight: 800; cursor: pointer; color: #450a0a; }
.action-btn:hover { color: #ef4444; }

.neon-checkbox { width: 18px; height: 18px; border-radius: 5px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.neon-check { width: 8px; height: 8px; background: #3b82f6; border-radius: 1px; box-shadow: 0 0 8px #3b82f6; }

/* MODAL STYLES */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: #111; border: 2px solid #333; border-radius: 20px;
  width: 90%; max-width: 400px; min-height: 250px; padding: 30px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex; flex-direction: column;
}
@keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } }

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h4 { margin: 0; font-size: 14px; letter-spacing: 1px; color: #3b82f6; }
.close-modal { background: transparent; border: none; color: #444; font-size: 24px; cursor: pointer; }
.close-modal:hover { color: #fff; }

.input-field { display: flex; flex-direction: column; gap: 8px; }
.input-field label { font-size: 9px; color: #555; font-weight: bold; }
.input-field input {
  background: #000; border: 2px solid #222; border-radius: 10px;
  padding: 12px; color: #fff; font-family: inherit; outline: none;
}
.input-field input:focus { border-color: #3b82f6; }

.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
.btn-cancel { background: transparent; border: none; color: #555; font-family: inherit; font-weight: bold; cursor: pointer; }
.btn-cancel:hover { color: #fff; }
.btn-execute-modal {
  background: #fff; color: #000; border: none; padding: 10px 25px; border-radius: 10px;
  font-family: inherit; font-weight: 900; cursor: pointer; transition: all 0.2s;
}
.btn-execute-modal:hover:not(:disabled) { background: #3b82f6; color: #fff; }
.btn-execute-modal:disabled { opacity: 0.1; }

@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`
};

window.EXAMPLES.push(TodoExample);
