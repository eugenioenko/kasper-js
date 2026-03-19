import { App as KasperApp } from './components/App.kasper';
import { Example } from './components/Example.kasper';
import { App } from 'kasper-js';

App({
  root: document.querySelector<HTMLElement>('#app')!,
  entry: 'app',
  registry: {
    app: { component: KasperApp },
    example: { component: Example },
    lazy: {
      component: () => import('./components/Lazy.kasper').then(m => m.Lazy), lazy: true
    },
  },
  mode: import.meta.env.MODE as any,
});
