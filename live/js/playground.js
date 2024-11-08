const state = {
  htmlSource: DemoSourceCode,
  scriptSource: DemoScript,
  stylesSource: DemoStyle,
  activeTab: "htmlSource",
  renderBtn: document.getElementById("execute"),
  editor: createEditor("editor", DemoSourceCode),
  render: document.getElementById("render"),
  headTag: document.getElementById("script"),
  status: document.getElementById("status"),
  tabs: [...document.querySelectorAll('button[role="tab"]')],
};

const tabToAceMode = {
  htmlSource: "ace/mode/html",
  scriptSource: "ace/mode/javascript",
  stylesSource: "ace/mode/css",
};

function createEditor(id, source) {
  const editor = ace.edit(id);
  editor.session.setMode(`ace/mode/html`);
  editor.getSession().setUseWorker(false);
  editor.setTheme("ace/theme/tomorrow_night");
  editor.setFontSize(15);
  editor.setValue(source);
  editor.selection.moveCursorToPosition({ row: 21, column: 0 });
  editor.selection.selectLine();
  return editor;
}

function injectScriptAndStyles() {
  state.headTag.innerHTML = "";
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.textContent = state.scriptSource;
  state.headTag.appendChild(script);
  const style = document.createElement("style");
  style.textContent = state.stylesSource;
  state.headTag.appendChild(style);
}

state.renderBtn.addEventListener("click", () => {
  state[state.activeTab] = state.editor.getValue();
  const source = state.htmlSource;
  const result = kasper.execute(source);
  injectScriptAndStyles();
  kasper.transpile(source, {}, render);
  state.status.textContent = `Rendered at ${new Date().toJSON()}`;
});

function switchTab(nextElement) {
  next = nextElement.getAttribute("aria-controls");
  current = document.querySelector('button[aria-selected="true"]');
  if (current) {
    current.setAttribute("aria-selected", "false");
    state[state.activeTab] = state.editor.getValue();
  }
  state.editor.setValue(state[next]);
  nextElement.setAttribute("aria-selected", "true");
  state.activeTab = next;
  const mode = tabToAceMode[next];
  if (mode) {
    state.editor.session.setMode(mode);
    state.editor.selection.moveCursorToPosition({ row: 1, column: 0 });
    state.editor.selection.selectLine();
  }
}

for (const tab of state.tabs) {
  tab.addEventListener("click", function (e) {
    switchTab(e.currentTarget);
  });
}

window.addEventListener(
  "wheel",
  function doPreventDefault(e) {
    e?.preventDefault?.();
  },
  { passive: false }
);
