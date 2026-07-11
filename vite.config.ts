import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replaces the deprecated vite-plugin-rewrite-all: makes the dev server fall
// back to index.html for navigations whose path contains a dot (e.g. gun
// pubkey routes like /profile/abc.def), which the default history fallback
// would otherwise treat as a static file request and 404.
const rewriteAll = () => ({
  name: 'rewrite-all',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      // Only rewrite top-level HTML navigations. Vite's own module/asset
      // requests (/@vite, /src/..., ?import, etc.) don't send Accept: text/html,
      // so they pass through untouched; page loads for dotted route paths get
      // served index.html instead of 404ing.
      if (
        req.method === 'GET' &&
        req.url &&
        !req.url.startsWith('/@') &&
        req.headers.accept?.includes('text/html')
      ) {
        req.url = '/index.html';
      }
      next();
    });
  },
});

const moduleExclude = (match) => {
  const m = (id) => id.indexOf(match) > -1;
  return {
    name: `exclude-${match}`,
    resolveId(id) {
      if (m(id)) return id;
    },
    load(id) {
      if (m(id)) return `export default {}`;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      'gun',
      'gun/gun',
      'gun/sea',
      'gun/sea.js',
      'gun/lib/then',
      'gun/lib/webrtc',
      'gun/lib/radix',
      'gun/lib/radisk',
      'gun/lib/store',
      'gun/lib/rindexed',
    ],
  },
  plugins: [
    rewriteAll(),
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          next();
        });
      },
    },
    moduleExclude('text-encoding'),
  ],
});
