import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Kasper.js',
      description: 'A lightweight component framework with fine-grained Signal-based reactivity.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/eugenioenko/kasper-js' },
      ],
      sidebar: [
        { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
        { label: 'Guides', autogenerate: { directory: 'guides' } },
        { label: 'Reference', autogenerate: { directory: 'reference' } },
      ],
    }),
  ],
});
