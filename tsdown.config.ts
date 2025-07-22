import { defineConfig } from "tsdown/config"

export default defineConfig({
  entry: ["src/index.ts", "src/test-matchers/vitest.ts"],
  format: ["esm", "cjs"],
  dts: true,
  silent: true
})
