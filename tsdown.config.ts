import { defineConfig } from "tsdown/config"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  silent: true
})
