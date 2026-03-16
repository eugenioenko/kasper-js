import { App as KasperApp } from './components/App.kasper';
import { Home } from './components/Home.kasper';
import { TodoApp } from './components/TodoApp.kasper';
import { CounterExample } from './components/CounterExample.kasper';
import { DisplayCounter } from './components/DisplayCounter.kasper';
import { KanbanBoard } from './components/KanbanBoard.kasper';
import { KanbanColumn } from './components/Kanban/KanbanColumn.kasper';
import { TaskCard } from './components/Kanban/TaskCard.kasper';
import { AddTaskDialog } from './components/Kanban/AddTaskDialog.kasper';
import { Card as UICard } from './components/UI/Card.kasper';
import { Dialog as UIDialog } from './components/UI/Dialog.kasper';
import { UIButton } from './components/UI/UIButton.kasper';
import { UISidebar } from './components/UI/UISidebar.kasper';
import { UIContent } from './components/UI/UIContent.kasper';
import { GameOfLife } from './components/GameOfLife.kasper';
import { DataTable } from './components/DataTable.kasper';
import { ProductCatalog } from './components/Products/ProductCatalog.kasper';
import { ProductForm } from './components/Products/ProductForm.kasper';
import { App } from 'kasper-js';

App({
  root: document.querySelector<HTMLElement>('#app')!,
  entry: 'app',
  registry: {
    app: { component: KasperApp },
    home: { component: Home },
    'todo-app': { component: TodoApp },
    'counter-example': { component: CounterExample },
    'display-counter': { component: DisplayCounter },
    'kanban-board': { component: KanbanBoard },
    'kanban-column': { component: KanbanColumn },
    'task-card': { component: TaskCard },
    'add-task-dialog': { component: AddTaskDialog },
    'ui-card': { component: UICard },
    'ui-dialog': { component: UIDialog },
    'ui-button': { component: UIButton },
    'ui-sidebar': { component: UISidebar },
    'ui-content': { component: UIContent },
    'game-of-life': { component: GameOfLife },
    'data-table': { component: DataTable },
    'product-catalog': { component: ProductCatalog },
    'product-form': { component: ProductForm },
  },
});
