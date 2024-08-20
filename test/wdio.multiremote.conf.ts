import { config as baseConfig } from './wdio.conf'

export const config: WebdriverIO.MultiremoteConfig = {
  ...baseConfig,
  specs: ['./e2e/multiremote.e2e.ts'],
  capabilities: {
    browser: {
      capabilities: {
        browserName: 'chrome',
      }
    },
    app: {
      capabilities: {
        browserName: 'electron',
      }
    }
  }
}
