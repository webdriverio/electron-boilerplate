import type { ForgeConfig } from '@electron-forge/shared-types'
import MakerSquirrel from '@electron-forge/maker-squirrel'
import MakerDMG from '@electron-forge/maker-dmg'
import MakerZIP from '@electron-forge/maker-zip'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    prune: process.env.NODE_ENV !== 'test',
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ['darwin']),
    new MakerDMG({}, ['darwin']),
    new MakerSquirrel(
      {
        name: 'Electron Boilerplate',
        owners: 'WebdriverIO',
        authors: 'WebdriverIO',
        copyright: 'WebdriverIO',
      },
      ['win32']
    )
  ],
  plugins: [],
};

export default config
