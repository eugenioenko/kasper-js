window.EXAMPLES.push({
  name: "Recursive Core (Tree)",
  id: "tree-view",
  template: String.raw`
<div class="tree-explorer">
  <div class="sidebar">
    <div class="sidebar-header">FILE_SYSTEM_CORE</div>
    <div class="tree-root">
      <node-item @each="child of data.value" @:item="child"></node-item>
    </div>
  </div>
  <div class="main-view">
    <div @if="selected.value" class="file-details">
      <div class="file-icon">{{ selected.value.type === 'folder' ? '📁' : '📄' }}</div>
      <h2>{{ selected.value.name }}</h2>
      <p class="meta">ID: {{ selected.value.id }}</p>
      <div class="code-box">
        // PREVIEW_NOT_AVAILABLE_IN_DEMO
        // ACCESS_LEVEL: RESTRICTED
      </div>
    </div>
    <div @else class="empty-state">
      SELECT_A_NODE_TO_INSPECT
    </div>
  </div>
</div>
`,
  script: `
const currentSelection = signal(null);

class NodeItem extends Component {
  isOpen = signal(false);
  
  get item() { return this.args.item; }
  
  isSelected = this.computed(() => 
    currentSelection.value && currentSelection.value.id === this.item.id
  );

  handleClick() {
    currentSelection.value = this.item;
    if (this.item.type === 'folder') {
      this.isOpen.value = !this.isOpen.value;
    }
  }
}

// In the playground, we can register components before returning the App class
const nodeItemTemplate = String.raw\`
  <div class="node">
    <div class="node-content" @on:click="handleClick()" @class="isSelected.value ? 'selected' : ''">
      <span class="toggle" @style="item.type === 'file' ? 'visibility: hidden' : ''">
        {{ isOpen.value ? '▼' : '▶' }}
      </span>
      <span class="icon">{{ item.type === 'folder' ? '📁' : '📄' }}</span>
      <span class="name">{{ item.name }}</span>
    </div>
    
    <div @if="isOpen.value && item.children" class="children">
      <node-item @each="child of item.children" @:item="child"></node-item>
    </div>
  </div>
\`;

register('node-item', NodeItem, nodeItemTemplate);

class App extends Component {
  selected = currentSelection;
  
  data = signal([
    {
      id: 'root',
      name: 'system_vol',
      type: 'folder',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          children: [
            { id: 'main', name: 'main.ts', type: 'file' },
            { id: 'utils', name: 'utils.ts', type: 'file' },
            { id: 'kasper', name: 'kasper.ts', type: 'file' }
          ]
        },
        {
          id: 'config',
          name: 'config',
          type: 'folder',
          children: [
            { id: 'vite', name: 'vite.config.ts', type: 'file' },
            { id: 'tsconfig', name: 'tsconfig.json', type: 'file' }
          ]
        },
        { id: 'readme', name: 'README.md', type: 'file' }
      ]
    }
  ]);
}
`,
  style: `
.tree-explorer {
  display: grid;
  grid-template-columns: 250px 1fr;
  height: 100%;
  background: #0a0a0a;
  color: #ccc;
  font-size: 13px;
}

.sidebar {
  border-right: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 15px;
  font-size: 10px;
  letter-spacing: 2px;
  color: #666;
  border-bottom: 1px solid #1a1a1a;
}

.tree-root {
  padding: 10px;
  overflow-y: auto;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 3px;
  white-space: nowrap;
}

.node-content:hover { background: #151515; }
.node-content.selected { background: #00f2ff22; color: #00f2ff; }

.toggle {
  font-size: 8px;
  width: 10px;
  color: #444;
}

.children {
  margin-left: 18px;
  border-left: 1px solid #1a1a1a;
}

.main-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.empty-state {
  color: #333;
  letter-spacing: 2px;
  font-size: 11px;
}

.file-details {
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.file-icon { font-size: 64px; margin-bottom: 20px; }
.file-details h2 { margin: 0; color: #fff; }
.meta { font-size: 10px; color: #666; margin-bottom: 30px; }

.code-box {
  background: #050505;
  border: 1px solid #1a1a1a;
  padding: 20px;
  text-align: left;
  font-family: monospace;
  color: #444;
  line-height: 1.6;
}
`
});
