import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const styleFile = fileURLToPath(new URL("./src/site.css", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "portfolio-style-aliases",
      resolveId(source) {
        if (source === "./styles/global.css" || source === "./styles/layout.css") {
          return styleFile;
        }
      },
    },
  ],
  build: {
    target: "es2020",
  },
});
