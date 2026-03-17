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
import { CartPage } from './components/Cart/CartPage.kasper';
import { ProductGrid } from './components/Cart/ProductGrid.kasper';
import { CartPanel } from './components/Cart/CartPanel.kasper';
import { ProductCatalog } from './components/Products/ProductCatalog.kasper';
import { SignupForm } from './components/Form/SignupForm.kasper';
import { Dashboard } from './components/Dashboard/Dashboard.kasper';
import { MarkdownEditor } from './components/MarkdownEditor.kasper';
import { ToastContainer } from './components/Toast/ToastContainer.kasper';
import { ToastPage } from './components/Toast/ToastPage.kasper';
import { ProductForm } from './components/Products/ProductForm.kasper';
import { TreeView } from './components/TreeView/TreeView.kasper';
import { TreeNode } from './components/TreeView/TreeNode.kasper';
import { HexExplorer } from './components/HexExplorer.kasper';
import { WizardPage } from './components/WizardPage.kasper';
import { App } from 'kasper-js';

App({
  root: document.body,
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
    'cart-page': { component: CartPage },
    'cart-product-grid': { component: ProductGrid },
    'cart-panel': { component: CartPanel },
    'product-catalog': { component: ProductCatalog },
    'signup-form': { component: SignupForm },
    'dashboard': { component: Dashboard },
    'markdown-editor': { component: MarkdownEditor },
    'toast-container': { component: ToastContainer },
    'toast-page': { component: ToastPage },
    'product-form': { component: ProductForm },
    'tree-view': { component: TreeView },
    'tree-node': { component: TreeNode },
    'hex-explorer': { component: HexExplorer },
    'wizard-page': { component: WizardPage },
  },
});
