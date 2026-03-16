import { defineConfig } from 'vite';
import kasper from 'vite-plugin-kasper';

export default defineConfig({
  plugins: [kasper()],
});
