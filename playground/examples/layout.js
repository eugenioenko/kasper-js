window.EXAMPLES.push({
  name: "Component Matrix",
  id: "layout",
  template: String.raw`
<div class="matrix-app">
  <matrix-shell>
    <div slot="header" class="shell-header">
      <span class="logo">KSP_OS</span>
      <span class="user">UNAUTHORIZED_ACCESS</span>
    </div>
    
    <div slot="sidebar" class="shell-nav">
      <div class="nav-item active">OVERVIEW</div>
      <div class="nav-item">NETWORK</div>
      <div class="nav-item">STORAGE</div>
      <div class="nav-item">LOGS</div>
    </div>

    <!-- Default Slot -->
    <div class="main-content">
      <div class="welcome-card">
        <h2>TERMINAL_ROOT</h2>
        <p>You are accessing the core component layout engine. All sectors are operational.</p>
      </div>
    </div>
  </matrix-shell>
</div>
`,
  script: `
class App extends Component {}

class MatrixShell extends Component {}
register("matrix-shell", MatrixShell, \`
  <div class="shell-container">
    <header class="top-bar"><slot name="header"></slot></header>
    <div class="mid-section">
      <aside class="side-bar"><slot name="sidebar"></slot></aside>
      <main class="content-area"><slot></slot></main>
    </div>
  </div>
\`);
`,
  style: `
.matrix-app { height: 100%; display: flex; flex-direction: column; }

.shell-container { display: flex; flex-direction: column; height: 100%; background: #050505; border: 1px solid #222; }
.top-bar { height: 50px; border-bottom: 1px solid #222; background: #000; }
.mid-section { display: flex; flex-grow: 1; }
.side-bar { width: 150px; border-right: 1px solid #222; background: #080808; }
.content-area { flex-grow: 1; padding: 30px; background: #0a0a0a; }

.shell-header { display: flex; justify-content: space-between; align-items: center; height: 100%; padding: 0 20px; }
.logo { font-weight: 900; color: #3b82f6; }
.user { font-size: 8px; color: #ef4444; border: 1px solid #ef4444; padding: 2px 6px; }

.nav-item { padding: 12px 20px; font-size: 10px; color: #444; cursor: pointer; }
.nav-item.active { color: #fff; background: rgba(255,255,255,0.03); border-left: 2px solid #3b82f6; }

.welcome-card { border: 1px solid #222; padding: 25px; border-radius: 4px; }
.welcome-card h2 { margin: 0 0 10px 0; font-size: 18px; color: #fff; }
.welcome-card p { margin: 0; font-size: 12px; color: #666; line-height: 1.6; }
`
});
