import { App as KasperApp } from './components/App.kasper';
import { Example } from './components/Example.kasper';
import { App } from 'kasper-js';

App({
  root: document.body,
  entry: 'app',
  registry: {
    app: { component: KasperApp },
    example: { component: Example },
  },
  mode: import.meta.env.MODE as any,
});
