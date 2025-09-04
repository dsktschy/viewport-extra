import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'dot' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },

  /* Configure projects for devices of various viewport widths */
  projects: [
    /* Mobile device with viewport width of 320px */
    {
      name: 'xs',
      use: { ...devices['iPhone SE'] }
    },
    /* Mobile device with viewport width of 412px */
    {
      name: 'sm',
      use: { ...devices['Pixel 7'] }
    },
    /* Mobile device with viewport width of 768px */
    {
      name: 'lg',
      use: { ...devices['iPad Mini'] }
    },
    /* Mobile device with viewport width of 1024px */
    {
      name: 'xl',
      use: { ...devices['iPad Mini landscape'] }
    }
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm run preview-e2e',
    url: 'http://localhost:3000/tests/e2e/__fixtures__/src/dummy.html',
    reuseExistingServer: !process.env.CI
  }
})
