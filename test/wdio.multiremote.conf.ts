import { config as baseConfig } from './wdio.conf'

export const config: WebdriverIO.MultiremoteConfig = {
  ...baseConfig,
  specs: ['./e2e/multiremote.e2e.ts'],
  services: [
    {
      before: async (_caps, _specs, browser) => {
        const chromeInstance = (browser as WebdriverIO.MultiRemoteBrowser).getInstance('browser')
        if (chromeInstance) {
          await chromeInstance.execute(() => {
            (window as unknown as { wdioElectron?: { execute: () => undefined } }).wdioElectron ??= {
              execute: () => undefined
            }
          })
        }
      }
    },
    'electron'
  ],
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
