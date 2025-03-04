import type { UserConfig } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Do not set max length because external systems create long message
    // https://github.com/conventional-changelog/commitlint/issues/2930
    "body-max-length": [0],
    "body-max-line-length": [0],
    "footer-max-length": [0],
    "footer-max-line-length": [0],
    "header-max-length": [0],
    "scope-max-length": [0],
    "subject-max-length": [0],
    "type-max-length": [0],
  },
} satisfies UserConfig;
