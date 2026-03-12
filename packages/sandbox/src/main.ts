import { App as KasperApp } from 'kasper';
import { App } from './components/App.kasper';
import { Counter } from './components/Counter.kasper';

KasperApp({
  root: document.querySelector<HTMLElement>('#app')!,
  entry: 'app',
  registry: {
    app: { component: App, nodes: [] },
    counter: { component: Counter, nodes: [] },
  },
});
