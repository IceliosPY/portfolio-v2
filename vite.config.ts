import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/portfolio-v2/", // ⚠️ nom exact de ton repo
  plugins: [react()],
});