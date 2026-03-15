(function() {
  const state = {
    examples: window.EXAMPLES || [],
    currentExample: null,
    activeTab: 'template',
    editor: null,
    renderContainer: document.getElementById('render-area'),
    statusEl: document.getElementById('status-text'),
    stylesEl: document.getElementById('injected-styles'),
    exampleListEl: document.getElementById('example-list')
  };

  function init() {
    // Initialize Ace Editor
    state.editor = ace.edit("editor");
    state.editor.setTheme("ace/theme/tomorrow_night");
    state.editor.setFontSize(14);
    state.editor.session.setMode("ace/mode/html");

    // Populate Sidebar
    renderExampleList();

    // Setup Tabs
    document.getElementById('tab-group').addEventListener('click', (e) => {
      if (e.target.classList.contains('pg-tab')) {
        switchTab(e.target.dataset.tab);
      }
    });

    // Setup Run Button
    document.getElementById('run-btn').addEventListener('click', () => {
      renderApp();
    });

    // Load first example by default
    if (state.examples.length > 0) {
      loadExample(state.examples[0].id);
    }
  }

  function renderExampleList() {
    state.exampleListEl.innerHTML = '';
    state.examples.forEach(ex => {
      const li = document.createElement('li');
      li.className = 'pg-example-item' + (state.currentExample?.id === ex.id ? ' active' : '');
      li.textContent = ex.name;
      li.onclick = () => loadExample(ex.id);
      state.exampleListEl.appendChild(li);
    });
  }

  function loadExample(id) {
    const example = state.examples.find(ex => ex.id === id);
    if (!example) return;

    state.currentExample = { ...example };
    renderExampleList();
    
    // Switch to template without saving whatever was in the editor before
    switchTab('template', true);
    renderApp();
  }

  function switchTab(tab, skipSave = false) {
    // 1. Save current editor content to the tab we are LEAVING
    if (!skipSave && state.currentExample && state.editor) {
      state.currentExample[state.activeTab] = state.editor.getValue();
    }

    // 2. Set the new tab as active
    state.activeTab = tab;
    
    // 3. Update UI classes
    document.querySelectorAll('.pg-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // 4. Update Editor Mode and Value
    if (state.currentExample) {
      const modes = {
        template: 'ace/mode/html',
        script: 'ace/mode/javascript',
        style: 'ace/mode/css'
      };
      state.editor.session.setMode(modes[tab]);
      state.editor.setValue(state.currentExample[tab], -1);
    }
  }

  function renderApp() {
    if (!state.currentExample) return;

    // Sync current tab
    state.currentExample[state.activeTab] = state.editor.getValue();

    const { template, script, style } = state.currentExample;

    try {
      state.stylesEl.textContent = style;

      const userRegistry = {};
      const parser = new window.kasper.TemplateParser();

      // EXPLICIT CLEANUP: Remove old event listeners and effects
      const transpiler = new window.kasper.Transpiler();
      transpiler.destroy(state.renderContainer);
      state.renderContainer.innerHTML = "";

      function register(tag, component, template) {
        userRegistry[tag] = {
          selector: tag,
          component: component,
          template: document.createElement("div"),
          nodes: parser.parse(template),
        };
      }

      // Safe execution of user script
      const executeScript = new Function("register", `
        const { Component, signal, batch, nextTick } = window;
        ${script}
        return typeof App !== 'undefined' ? App : null;
      `);

      const UserAppClass = executeScript(register);
      
      if (UserAppClass) {
          window.kasper.App({
              root: state.renderContainer,
              entry: 'user-root',
              mode: 'development',
              registry: {
                ...userRegistry,
                'user-root': {
                  selector: 'user-root',
                  component: UserAppClass,
                  template: document.createElement("div"),
                  nodes: parser.parse(template)
                }
              }
          });
      } else {
          // Use the transpiler instance to respect registry and mode
          const transpiler = new window.kasper.Transpiler({ registry: userRegistry });
          transpiler.mode = 'development';
          transpiler.transpile(parser.parse(template), window, state.renderContainer);
      }

      state.statusEl.textContent = `SYSTEM_INITIALIZED AT ${new Date().toLocaleTimeString()}`;
    } catch (e) {
      console.error(e);
      const el = document.createElement('div');
      el.className = 'pg-error';
      const title = document.createElement('div');
      title.className = 'pg-error-title';
      title.textContent = '⚠ Error';
      const body = document.createElement('div');
      body.textContent = e.stack || e.message || String(e);
      el.appendChild(title);
      el.appendChild(body);
      state.renderContainer.innerHTML = '';
      state.renderContainer.appendChild(el);
      state.statusEl.textContent = `ERROR: ${e.message}`;
    }
  }

  // Kick off
  init();
})();
