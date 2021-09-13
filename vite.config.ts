import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  // React refresh is the hot reloading supported by React,
  // which keeps the state of components when rebuilding.
  plugins: [reactRefresh()],
});
