import { App as KasperApp } from './components/App.kasper';
import { Counter } from './components/Counter.kasper';
import { App } from 'kasper-js';

App({
  root: document.querySelector<HTMLElement>('#app')!,
  entry: 'app',
  registry: {
    app: { component: KasperApp, nodes: [] },
    counter: { component: Counter, nodes: [] },
  },
});
