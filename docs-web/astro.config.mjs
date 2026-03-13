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
        { label: 'Guides', autogenerate: { directory: 'guides' } },
        { label: 'Reference', autogenerate: { directory: 'reference' } },
      ],
    }),
  ],
});
