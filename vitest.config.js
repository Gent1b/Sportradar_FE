// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom", // ✅ use lightweight DOM
    globals: true,            // optional, lets you use describe/it/expect without imports
    setupFiles: [],           // if you ever want global mocks later
  },
});
