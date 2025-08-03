import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default ({ mode }: { mode: string }) => {
  // Load environment variables
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        ":bookcars-types": path.resolve(__dirname, "src/types/bookcars-types"),
        ":bookcars-helper": path.resolve(__dirname, "src/utils/bookcars-helper"),
        ":disable-react-devtools": path.resolve(__dirname, "src/utils/disable-react-devtools"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(process.env.VITE_PORT || "3002", 10),
      // Add proxy configuration
      proxy: {
        '/api': {
          target: 'http://13.61.105.200', // Your API base URL
          changeOrigin: true,
          secure: false, // Important for http targets
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: "build",
      target: "esnext",
    },
  });
};
