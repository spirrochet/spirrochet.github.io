import { defineConfig } from 'astro/config';

// A user site (<user>.github.io) is served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://spirrochet.github.io',
  // The dev and preview servers listen on the IPv4 loopback by address, not on
  // the name `localhost`. In a container that name can resolve to the IPv6
  // loopback first, and the editor's port forwarding connects to 127.0.0.1,
  // so the forward is refused. Loopback only: nothing else on the network
  // can reach it.
  server: { host: '127.0.0.1' },
});
