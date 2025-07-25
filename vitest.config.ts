import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["./src/test-matchers/vitest.ts"],
    passWithNoTests: true,
    watch: false
  }
})
