import { expect, browser } from '@wdio/globals'

describe('Electron Testing', () => {
  it('should print application metadata', async () => {
    expect(await browser.electron.app('getName')).toBe('electron-boilerplate')
    expect(await browser.electron.app('getVersion')).toBe('1.0.0')
  })
})
