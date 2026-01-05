
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Priority: System Env (Zeabur) > .env file
  const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || env.UNSPLASH_ACCESS_KEY;
  const unsplashSecretKey = process.env.UNSPLASH_SECRET_KEY || env.UNSPLASH_SECRET_KEY;

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(geminiKey),
      'process.env.UNSPLASH_ACCESS_KEY': JSON.stringify(unsplashAccessKey),
      'process.env.UNSPLASH_SECRET_KEY': JSON.stringify(unsplashSecretKey)
    },
    server: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist'
    }
  };
});
