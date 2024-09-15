import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/

export default defineConfig(() => {
  return {
    plugins: [react()],
    publicDir: './assets',
    build: {
      outDir: './public',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
