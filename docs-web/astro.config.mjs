import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      customCss: ['./src/styles/custom.css'],
      title: 'Kasper.js',
      description: 'A lightweight component framework with fine-grained signal-based reactivity.',
      logo: {
        src: './src/assets/kasper.svg',
      },
      favicon: '/kasper.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/eugenioenko/kasper-js' },
      ],
      sidebar: [
        { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
        {
          label: 'Guides',
          items: [
            { label: 'Components', link: '/guides/components/' },
            { label: 'Template Syntax', link: '/guides/templates/' },
            { label: 'Directives', link: '/guides/directives/' },
            { label: 'Signals', link: '/guides/signals/' },
            { label: 'State Management', link: '/guides/state-management/' },
            { label: 'Component Lifecycle', link: '/guides/lifecycle/' },
            { label: 'Styling', link: '/guides/styling/' },
            { label: 'Slots', link: '/guides/slots/' },
            { label: 'Pipes', link: '/guides/pipes/' },
            { label: 'Routing', link: '/guides/routing/' },
            { label: 'Lazy Loading', link: '/guides/lazy-loading/' },
            { label: 'Error Handling', link: '/guides/error-handling/' },
            { label: 'AI-Driven Development', link: '/guides/agents/' },
            { label: 'Vite Integration', link: '/guides/vite/' }
          ]
        },
        { label: 'Reference', autogenerate: { directory: 'reference' } },
      ],
    }),
  ],
});
