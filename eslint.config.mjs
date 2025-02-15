import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "off", // Disable warning for using <img>
      "@typescript-eslint/no-explicit-any": "off", // Optional: Ignore 'any' type warnings
      "@typescript-eslint/ban-ts-comment": "off", // Optional: Allow @ts-ignore comments
    },
  },
];

export default eslintConfig;
