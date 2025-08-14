import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default ({ mode }: { mode: string }) => {
  // Load environment variables
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {
        ":bookcars-types": path.resolve(__dirname, "src/types/bookcars-types"),
        ":bookcars-helper": path.resolve(__dirname, "src/utils/bookcars-helper"),
        ":disable-react-devtools": path.resolve(__dirname, "src/utils/disable-react-devtools"),
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "src/assets"),
      },
    },
    optimizeDeps: {
      include: [],
      exclude: [],
      force: true,
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
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'ui': ['@mui/material', '@mui/icons-material'],
          },
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.names?.[0] || 'unknown';
            const info = fileName.split('.');
            const ext = info[info.length - 1];
            
            // Keep CSS in assets/css/ folder
            if (ext === 'css') {
              return 'assets/css/[name].[hash].[ext]';
            }
            
            // Keep images in assets/images/ folder
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return 'assets/images/[name].[hash].[ext]';
            }
            
            // Keep fonts in assets/webfonts/ folder
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return 'assets/webfonts/[name].[hash].[ext]';
            }
            
            return 'assets/[name].[hash].[ext]';
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/assets/css/_variables.css";`
        }
      }
    },
  });
};
