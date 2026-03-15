window.EXAMPLES.push({
  name: "Kanban Protocol",
  id: "kanban",
  template: String.raw`
<div class="kanban-app">
  <div class="kanban-board">
    <div @each="col of columns.value" class="kanban-column" @key="col.id">
      <div class="column-header">
        <div class="title-group">
          <span class="status-dot"></span>
          <h2>{{ col.title }}</h2>
          <span class="count-badge">{{ col.tasks.length }}</span>
        </div>
        <button class="add-inline-btn" @on:click="addTask(col.id)">+</button>
      </div>
      
      <div class="task-list" 
           @on:dragover.prevent="" 
           @on:drop="handleDrop($event, col.id)"
           @class="col.isOver ? 'drag-over' : ''">
        
        <div @each="task of col.tasks" 
             class="task-card" 
             draggable="true"
             @key="task.id"
             @on:dragstart="handleDragStart($event, task, col.id)">
          <div class="card-accent" @style="'background:' + task.color"></div>
          <div class="card-body">
            <p>{{ task.title }}</p>
            <div class="card-meta">
              <span class="id-tag">#{{ task.id }}</span>
              <button class="card-delete" @on:click="deleteTask(col.id, task.id)">×</button>
            </div>
          </div>
        </div>

        <div @if="col.tasks.length === 0" class="empty-col">NO_TASKS</div>
      </div>
    </div>
  </div>
</div>
`,
  script: `
class App extends Component {
  columns = signal([
    { id: 'todo', title: 'BACKLOG', tasks: [{ id: '101', title: 'Fix neural leak', color: '#6366f1' }], isOver: false },
    { id: 'doing', title: 'IN_PROGRESS', tasks: [{ id: '201', title: 'Syncing buffers', color: '#f59e0b' }], isOver: false },
    { id: 'done', title: 'RESOLVED', tasks: [{ id: '301', title: 'Audit complete', color: '#10b981' }], isOver: false }
  ]);

  _dragData = null;

  handleDragStart(e, task, colId) {
    window.__draggedTask = { task, colId };
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDrop(e, targetColId) {
    if (!window.__draggedTask) return;
    const { task, colId: sourceColId } = window.__draggedTask;
    if (sourceColId === targetColId) return;

    const cols = [...this.columns.value];
    const sourceCol = cols.find(c => c.id === sourceColId);
    const targetCol = cols.find(c => c.id === targetColId);
    
    sourceCol.tasks = sourceCol.tasks.filter(t => t.id !== task.id);
    targetCol.tasks = [...targetCol.tasks, task];

    this.columns.value = cols;
    window.__draggedTask = null;
  }

  addTask(colId) {
    const title = prompt("Enter task title:");
    if (!title) return;

    const cols = [...this.columns.value];
    const col = cols.find(c => c.id === colId);
    
    col.tasks = [...col.tasks, {
      id: Math.random().toString(36).substr(2, 3).toUpperCase(),
      title,
      color: '#6366f1'
    }];

    this.columns.value = cols;
  }

  deleteTask(colId, taskId) {
    const cols = [...this.columns.value];
    const col = cols.find(c => c.id === colId);
    col.tasks = col.tasks.filter(t => t.id !== taskId);
    this.columns.value = cols;
  }
}
`,
  style: `
.kanban-app { height: 100%; background: #f8fafc; padding: 40px; color: #1e293b; }
.kanban-board { display: flex; gap: 30px; height: 100%; overflow-x: auto; }
.kanban-column { flex: 1; min-width: 300px; display: flex; flex-direction: column; }
.column-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 5px; }
.title-group { display: flex; align-items: center; gap: 10px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; }
.kanban-column:nth-child(1) .status-dot { background: #6366f1; }
.kanban-column:nth-child(2) .status-dot { background: #f59e0b; }
.kanban-column:nth-child(3) .status-dot { background: #10b981; }
.column-header h2 { font-size: 13px; font-weight: 800; letter-spacing: 1px; margin: 0; color: #64748b; }
.count-badge { font-size: 10px; background: #e2e8f0; color: #64748b; padding: 2px 8px; border-radius: 10px; font-weight: bold; }
.add-inline-btn { background: #fff; border: 1px solid #e2e8f0; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.add-inline-btn:hover { background: #6366f1; color: #fff; border-color: #6366f1; }
.task-list { flex-grow: 1; background: #f1f5f9; border-radius: 12px; padding: 12px; transition: all 0.2s; min-height: 200px; border: 2px solid transparent; }
.task-card { background: #fff; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); padding: 16px; margin-bottom: 12px; cursor: grab; position: relative; border: 1px solid transparent; }
.task-card:active { cursor: grabbing; }
.task-card:hover { border-color: #6366f144; transform: translateY(-2px); }
.card-accent { position: absolute; left: 0; top: 16px; bottom: 16px; width: 3px; border-radius: 0 4px 4px 0; }
.card-body p { margin: 0 0 12px 0; font-size: 14px; font-weight: 500; color: #334155; line-height: 1.5; }
.card-meta { display: flex; justify-content: space-between; align-items: center; }
.id-tag { font-size: 10px; font-weight: 700; color: #94a3b8; }
.card-delete { background: none; border: none; color: #e2e8f0; cursor: pointer; font-size: 18px; }
.task-card:hover .card-delete { color: #cbd5e1; }
.card-delete:hover { color: #f43f5e !important; }
.empty-col { text-align: center; padding: 40px 0; color: #cbd5e1; font-size: 10px; letter-spacing: 2px; }
`
});
