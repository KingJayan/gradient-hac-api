import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'gradient HAC API',
      description: 'Documentation for the gradient Home Access Center API.',
      site: 'https://gradient-hac-api-docs.vercel.app',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/KingJayan/gradient-hac-api' },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Getting Started', slug: 'guides/getting-started' },
            { label: 'Authentication', slug: 'guides/authentication' },
            { label: 'Session Reuse', slug: 'guides/sessions' },
            { label: 'Errors', slug: 'guides/errors' },
          ],
        },
        {
          label: 'Endpoints',
          autogenerate: { directory: 'endpoints' },
        },
      ],
    }),
  ],
});
