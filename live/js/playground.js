class Playground extends kasper.Component {
  activeTab = "htmlSource";
  htmlSource = DemoSourceCode;
  scriptSource = DemoScript;
  stylesSource = DemoStyle;
  status = "Press RENDER to start!";

  $onInit() {
    this.editor = null;
  }

  $onRender() {
    if (!this.editor) {
      const editorEl = this.ref.querySelector("#editor");
      if (editorEl) {
        this.editor = ace.edit(editorEl);
        this.editor.session.setMode("ace/mode/html");
        this.editor.setTheme("ace/theme/tomorrow_night");
        this.editor.setFontSize(15);
        this.editor.setValue(this.htmlSource, -1);
      }
    }
    this.renderApp();
  }

  switchTab(tab) {
    if (!this.editor) return;
    this.saveCurrent();
    this.activeTab = tab;
    this.editor.setValue(this[tab], -1);
    const modes = {
      htmlSource: "ace/mode/html",
      scriptSource: "ace/mode/javascript",
      stylesSource: "ace/mode/css",
    };
    this.editor.session.setMode(modes[tab]);
  }

  saveCurrent() {
    if (this.editor) {
        this[this.activeTab] = this.editor.getValue();
    }
  }

  renderApp() {
    this.saveCurrent();
    const renderContainer = document.getElementById("render-area");
    const statusEl = document.getElementById("status-text");
    const stylesEl = document.getElementById("injected-styles");

    if (!renderContainer) return;

    try {
      if (stylesEl) stylesEl.textContent = this.stylesSource;

      const userRegistry = {};
      const parser = new kasper.TemplateParser();

      function register(tag, component, template) {
        userRegistry[tag] = {
          selector: tag,
          component: component,
          template: document.createElement("div"),
          nodes: parser.parse(template),
        };
      }

      const executeScript = new Function("kasper", "register", `
        ${this.scriptSource}
        return typeof App !== 'undefined' ? App : null;
      `);

      const UserAppClass = executeScript(kasper, register);
      
      if (UserAppClass) {
          // Use kasper.App (KasperInit) for the user app to get full reactivity
          userRegistry['user-root'] = {
              selector: 'user-root',
              component: UserAppClass,
              template: document.createElement("div"),
              nodes: parser.parse(this.htmlSource)
          };

          kasper.App({
              root: renderContainer,
              entry: 'user-root',
              registry: userRegistry
          });
      } else {
          renderContainer.innerHTML = "";
          kasper.transpile(this.htmlSource, window, renderContainer, userRegistry);
      }

      if (statusEl) statusEl.textContent = `Rendered at ${new Date().toLocaleTimeString()}`;
    } catch (e) {
      console.error(e);
      if (statusEl) statusEl.textContent = `Error: ${e.message}`;
    }
  }
}

// Initialize the playground itself
kasper.App({
  root: "kasper-app",
  entry: "playground-root",
  registry: {
    "playground-root": {
      selector: "playground-root",
      component: Playground,
      template: document.createElement("div"),
      nodes: new kasper.TemplateParser().parse(`
        <div class="app w-screen h-screen grid grid-cols-[800px_1fr] grid-rows-1">
          <div class="flex flex-col bg-[#1d1f21] border-r border-gray-700">
            <div class="border-b border-gray-600 px-4 pt-4 flex items-end justify-between">
              <div class="flex gap-1">
                <button @on:click="switchTab('htmlSource')" 
                  class="px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-600 text-sm font-mono transition-colors"
                  @class="activeTab === 'htmlSource' ? 'bg-[#26282c] text-white' : 'bg-[#191a1d] text-gray-400'">
                  App.html
                </button>
                <button @on:click="switchTab('scriptSource')" 
                  class="px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-600 text-sm font-mono transition-colors"
                  @class="activeTab === 'scriptSource' ? 'bg-[#26282c] text-white' : 'bg-[#191a1d] text-gray-400'">
                  App.js
                </button>
                <button @on:click="switchTab('stylesSource')" 
                  class="px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-600 text-sm font-mono transition-colors"
                  @class="activeTab === 'stylesSource' ? 'bg-[#26282c] text-white' : 'bg-[#191a1d] text-gray-400'">
                  App.css
                </button>
              </div>
              <button @on:click="renderApp()"
                class="mb-2 px-6 py-1.5 bg-green-600 hover:bg-green-500 text-white font-mono rounded transition-colors active:scale-95">
                RENDER
              </button>
            </div>
            <div id="editor" class="flex-grow w-full h-full"></div>
          </div>
          <div class="bg-gray-900 flex flex-col overflow-hidden">
            <style id="injected-styles"></style>
            <div id="render-area" class="flex-grow p-8 text-white overflow-auto relative"></div>
            <div id="status-text" class="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 font-mono">
              {{status}}
            </div>
          </div>
        </div>
      `),
    },
  },
});
