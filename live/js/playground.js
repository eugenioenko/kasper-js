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
      // this.ref is the <playground-root> element
      const editorEl = this.ref.querySelector("#editor");
      if (editorEl) {
        this.editor = ace.edit(editorEl);
        this.editor.session.setMode("ace/mode/html");
        this.editor.setTheme("ace/theme/tomorrow_night");
        this.editor.setFontSize(15);
        this.editor.setValue(this.htmlSource, -1);
      }
    }
    // Initial render
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

      // Component Registry for the user app
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

      // Execute user script in a scoped function
      const executeScript = new Function("kasper", "register", `
        ${this.scriptSource}
        return typeof App !== 'undefined' ? App : null;
      `);

      const UserAppClass = executeScript(kasper, register);

      // If user defined an 'App' class, use it as the main component
      if (UserAppClass) {
        userRegistry['user-root'] = {
          selector: 'user-root',
          component: UserAppClass,
          template: document.createElement("div"),
          nodes: parser.parse(this.htmlSource)
        };

        const transpiler = new kasper.Transpiler({ registry: userRegistry });
        const element = document.createElement('user-root');
        const instance = new UserAppClass({ ref: element, transpiler, args: {} });
        if (instance.$onInit) instance.$onInit();

        renderContainer.innerHTML = "";
        transpiler.transpile(userRegistry['user-root'].nodes, instance, element);
        renderContainer.appendChild(element);
        if (instance.$onRender) instance.$onRender();
      } else {
        // Legacy mode: just transpile with window/global context
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

// Initialize the playground itself as a Kasper App
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
                  class="px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-600 text-sm font-mono {{activeTab === 'htmlSource' ? 'bg-[#26282c] text-white' : 'bg-[#191a1d] text-gray-400'}}">
                  App.html
                </button>
                <button @on:click="switchTab('scriptSource')" 
                  class="px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-600 text-sm font-mono {{activeTab === 'scriptSource' ? 'bg-[#26282c] text-white' : 'bg-[#191a1d] text-gray-400'}}">
                  App.js
                </button>
                <button @on:click="switchTab('stylesSource')" 
                  class="px-4 py-2 rounded-t-lg border-t border-l border-r border-gray-600 text-sm font-mono {{activeTab === 'stylesSource' ? 'bg-[#26282c] text-white' : 'bg-[#191a1d] text-gray-400'}}">
                  App.css
                </button>
              </div>
              <button @on:click="renderApp()"
                class="mb-2 px-6 py-1.5 bg-green-600 hover:bg-green-500 text-white font-mono rounded transition-colors">
                RENDER
              </button>
            </div>
            <div id="editor" class="flex-grow w-full h-full"></div>
          </div>
          <div class="bg-gray-900 flex flex-col overflow-hidden">
            <style id="injected-styles"></style>
            <div id="render-area" class="flex-grow p-8 text-white overflow-auto">
              <div class="h-full flex items-center justify-center text-gray-500 font-mono italic">
                Press RENDER to see your app in action!
              </div>
            </div>
            <div id="status-text" class="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 font-mono">
              {{status}}
            </div>
          </div>
        </div>
      `),
    },
  },
});
