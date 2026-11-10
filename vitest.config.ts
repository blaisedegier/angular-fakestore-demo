import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        // DevExtreme ships extensionless directory imports that Node's ESM loader rejects,
        // so let Vite resolve them instead.
        inline: [/devextreme/],
      },
    },
  },
});
