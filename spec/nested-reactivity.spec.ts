import { describe, it, expect, vi } from "vitest";
import { Component } from "../src/component";
import { TemplateParser } from "../src/template-parser";
import { Transpiler } from "../src/transpiler";
import { signal } from "../src/signal";
import { nextTick } from "../src/scheduler";

function makeTranspiler(registry: any) {
  return new Transpiler({ registry });
}

function render(html: string, transpiler: Transpiler, entity: Record<string, any> = {}) {
  const container = document.createElement("div");
  transpiler.transpile(
    (transpiler as any).templateParser.parse(html),
    entity,
    container
  );
  return container;
}

function makeContainer(): HTMLElement {
  return document.createElement("div");
}

function transpile(
  source: string,
  entity: Record<string, any> = {},
  container?: HTMLElement
): HTMLElement {
  const parser = new TemplateParser();
  const nodes = parser.parse(source);
  const transpiler = new Transpiler();
  const el = container ?? makeContainer();
  transpiler.transpile(nodes, entity, el);
  return el;
}

describe("Nested Reactivity (Kanban Case)", () => {
  it("fails to update inner loop when re-assigning outer signal with shallow clone", async () => {
    const data = signal([
      { 
        id: "c1", 
        title: "Col 1", 
        tasks: [
          { id: "t1", text: "task 1" },
          { id: "t2", text: "task 2" }
        ] 
      }
    ]);

    const source = "<div @each='col of data.value' @key='col.id' class='column'> <span @each='task of col.tasks' @key='task.id' class='task'>{{ task.text }}</span> </div>";

    const container = makeContainer();
    transpile(source, { data }, container);

    expect(container.querySelectorAll(".task")).toHaveLength(2);
    expect(container.textContent).toContain("task 1");
    expect(container.textContent).toContain("task 2");

    // REPRODUCTION:
    const cols = [...data.value];
    cols[0].tasks = cols[0].tasks.filter(t => t.id !== "t1");
    data.value = cols;

    await nextTick();

    // EXPECTATION: Should have only 1 task now.
    // If the bug exists, this will still be 2 because the re-used DOM node
    // for 'col' is still using the old reference to the 'tasks' array.
    expect(container.querySelectorAll(".task")).toHaveLength(1);
    expect(container.textContent).not.toContain("task 1");
    expect(container.textContent).toContain("task 2");
  });

  it("@if inside a keyed @each child component evaluates in the correct scope after list update", async () => {
    // Regression: triggerRefresh called $kasperRefresh on child @if nodes without
    // restoring the scope they were created in. The @if would run in the parent
    // @each's scope (the column), making args.task undefined and throwing.
    class TaskCard extends Component {
      static template = `<p @if="args.task.description">{{args.task.description}}</p>`;
    }

    const tasks = signal([
      { id: "1", description: "first" },
      { id: "2", description: "second" },
    ]);

    const transpiler = makeTranspiler({
      "task-card": { component: TaskCard },
    });

    const container = render(
      `<task-card @each="task of tasks.value" @:task="task" @key="task.id"></task-card>`,
      transpiler,
      { tasks }
    );

    expect(container.textContent).toContain("first");
    expect(container.textContent).toContain("second");

    // Add a new task — this triggers triggerRefresh on existing keyed nodes,
    // which previously ran @if in the wrong scope and threw.
    tasks.value = [...tasks.value, { id: "3", description: "third" }];

    await nextTick();

    expect(container.textContent).toContain("first");
    expect(container.textContent).toContain("second");
    expect(container.textContent).toContain("third");
  });
});
