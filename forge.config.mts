import type { ForgeConfig } from '@electron-forge/shared-types'
import MakerSquirrel from '@electron-forge/maker-squirrel'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    prune: process.env.NODE_ENV !== 'test',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel(
      {
        name: "Electron Boilerplate",
        owners: "WebdriverIO",
        authors: "WebdriverIO",
        copyright: "WebdriverIO",
      },
      ["darwin"]
    )
  ],
  plugins: [],
};

export default config
