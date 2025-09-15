import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3008,
    allowedHosts: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
});
