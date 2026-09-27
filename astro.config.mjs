import { defineConfig } from 'astro/config';

// A user site (<user>.github.io) is served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://spirrochet.github.io',
});
