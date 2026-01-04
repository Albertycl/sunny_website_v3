
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.UNSPLASH_ACCESS_KEY': JSON.stringify(env.UNSPLASH_ACCESS_KEY),
      'process.env.UNSPLASH_SECRET_KEY': JSON.stringify(env.UNSPLASH_SECRET_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist'
    }
  };
});
