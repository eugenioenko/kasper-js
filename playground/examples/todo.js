window.EXAMPLES.push({
  name: "Daily Task Flow",
  id: "todo",
  template: String.raw`
<div class="todo-app">
  <div class="todo-card">
    <header class="todo-header">
      <h1>My Tasks</h1>
      <div class="stats">
        <span class="count">{{ todos.value.length }} total</span>
        <span class="dot">·</span>
        <span class="count">{{ todos.value.filter(t => t.done).length }} done</span>
      </div>
    </header>

    <div class="input-group">
      <input 
        type="text" 
        placeholder="What needs to be done?" 
        @value="newTodo.value"
        @on:input="newTodo.value = $event.target.value"
      />
      <button class="add-btn" @on:click="add()">+</button>
    </div>

    <div class="todo-list">
      <div @each="todo of todos.value" class="todo-item" @key="todo.id" @class="todo.done ? 'is-done' : ''">
        <label class="checkbox-container">
          <input type="checkbox" @checked="todo.done" @on:change="toggle(todo)" />
          <span class="checkmark"></span>
        </label>
        <span class="todo-text">{{ todo.text }}</span>
        <button class="remove-btn" @on:click="remove(todo.id)">×</button>
      </div>
      
      <div @if="todos.value.length === 0" class="empty-state">
        <div class="empty-icon">✓</div>
        <p>You're all caught up!</p>
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  newTodo = signal("");
  todos = signal([
    { id: 1, text: "Explore Kasper.js reactivity", done: true },
    { id: 2, text: "Build a high-performance dashboard", done: false }
  ]);

  add() {
    const text = this.newTodo.value.trim();
    if (!text) return;
    
    this.todos.value = [
      ...this.todos.value,
      { id: Date.now(), text: text, done: false }
    ];
    
    this.newTodo.value = "";
  }

  toggle(todo) {
    this.todos.value = this.todos.value.map(t => 
      t.id === todo.id ? { ...t, done: !t.done } : t
    );
  }

  remove(id) {
    this.todos.value = this.todos.value.filter(t => t.id !== id);
  }
}
`,
  style: `
.todo-app {
  height: 100%;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  padding-top: 60px;
  color: #1e293b;
}

.todo-card {
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 80vh;
}

.todo-header { padding: 30px 30px 20px; }
.todo-header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 800; }
.stats { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 8px; }

.input-group {
  margin: 0 30px 25px;
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
}

.input-group input {
  flex-grow: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

.add-btn {
  background: #1e293b;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
}

.todo-list { padding: 0 15px 30px; overflow-y: auto; }
.todo-item { display: flex; align-items: center; padding: 12px 15px; border-radius: 10px; }
.todo-item:hover { background: #f8fafc; }

.checkbox-container { position: relative; width: 20px; height: 20px; cursor: pointer; margin-right: 15px; }
.checkbox-container input { visibility: hidden; width: 0; height: 0; }
.checkmark { position: absolute; top: 0; left: 0; height: 20px; width: 20px; border: 2px solid #cbd5e1; border-radius: 6px; }
.checkbox-container input:checked ~ .checkmark { background-color: #1e293b; border-color: #1e293b; }
.checkmark:after { content: ""; position: absolute; display: none; left: 6px; top: 2px; width: 4px; height: 9px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.checkbox-container input:checked ~ .checkmark:after { display: block; }

.todo-text { flex-grow: 1; font-size: 14px; }
.is-done .todo-text { text-decoration: line-through; color: #94a3b8; }

.remove-btn { background: none; border: none; color: #cbd5e1; font-size: 20px; cursor: pointer; opacity: 0; }
.todo-item:hover .remove-btn { opacity: 1; }
.remove-btn:hover { color: #ef4444; }

.empty-state { text-align: center; padding: 40px 0; color: #94a3b8; }
.empty-icon { font-size: 40px; margin-bottom: 10px; }
`
});
