import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      path.resolve(import.meta.dirname, "src/**/*.{test,spec}.?(c|m)[jt]s"),
    ],
    workspace: [
      {
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.node.{test,spec}.?(c|m)[jt]s"],
        },
      },
      {
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["src/**/*.{test,spec}.?(c|m)[jt]s"],
          exclude: ["src/**/*.node.{test,spec}.?(c|m)[jt]s"],
        },
      },
    ],
    passWithNoTests: true,
  },
});
