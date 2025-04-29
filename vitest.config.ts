import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.node.{test,spec}.?(c|m)[jt]s"],
        },
        define: { __TYPESCRIPT_TARGET__: '"es2022"' },
      },
      {
        test: {
          name: "jsdom.es5",
          environment: "jsdom",
          include: ["src/**/*.es5.{test,spec}.?(c|m)[jt]s"],
        },
        define: { __TYPESCRIPT_TARGET__: '"es5"' },
      },
      {
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["src/**/*.{test,spec}.?(c|m)[jt]s"],
          exclude: [
            "src/**/*.node.{test,spec}.?(c|m)[jt]s",
            "src/**/*.es5.{test,spec}.?(c|m)[jt]s",
          ],
        },
        define: { __TYPESCRIPT_TARGET__: '"es2022"' },
      },
    ],
    passWithNoTests: true,
  },
});
