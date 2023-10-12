import { expect, browser, $ } from '@wdio/globals'

describe('Electron Testing', () => {
  it('should print application metadata', async () => {
    expect(await browser.electron.app('getName')).toBe('WebdriverIO + Electron Boilerplate')
    expect(await browser.electron.app('getVersion')).toBe('1.0.0')
  })

  it('can click on button', async () => {
    const btn = await $('>>>.card').$('button')
    await expect(btn).toHaveText('count is 0')
    await btn.click()
    await expect(btn).toHaveText('count is 1')
  })

  /**
   * fails as application freezes after alert pops up
   */
  it.skip('can click the button until a dialog pops up', async () => {
    const btn = await $('>>>.card').$('button')
    await expect(btn).toHaveText('count is 1')
    await btn.click()
    await btn.click()
    await btn.click()
    await btn.click()
    await btn.click()
    await expect(await browser.isAlertOpen()).toBe(true)
    await browser.dismissAlert()
  })

  it('can mock the dialog call', async () => {
    await browser.electron.mock('dialog', 'showMessageBox', {})
    const btn = await $('>>>.card').$('button')
    await btn.click()
    await btn.click()
    await btn.click()
    await btn.click()
    await btn.click()
    await expect(await browser.isAlertOpen()).toBe(false)
    await expect(btn).toHaveText('count is 6')
  })
})
