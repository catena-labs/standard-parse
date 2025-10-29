import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import gitignore from "eslint-config-flat-gitignore"
import prettier from "eslint-config-prettier/flat"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"
import { importX } from "eslint-plugin-import-x"
import tseslint from "typescript-eslint"

export default defineConfig(
  gitignore(),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver({})]
    },
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import-x/order": [
        "warn",
        {
          "newlines-between": "never",
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "object",
            "type"
          ],
          alphabetize: {
            order: "asc"
          }
        }
      ]
    }
  },
  {
    files: ["**/*.config.{js,ts}"],
    rules: {
      "import-x/no-named-as-default-member": "off"
    }
  },
  {
    files: ["**/*.test.ts", "src/test-matchers/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  },
  prettier
)
