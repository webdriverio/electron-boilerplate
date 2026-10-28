import { Key } from 'webdriverio'
import { expect, multiremotebrowser } from '@wdio/globals'
import { startChatServer, type ChatServer } from '../chatServer'

describe('Multiremote', () => {
  let chatServer: ChatServer

  before(async () => {
    chatServer = await startChatServer()
  })

  after(async () => {
    await chatServer?.close()
  })

  it('should open chat window', async () => {
    const app = multiremotebrowser.getInstance('app')
    const browser = multiremotebrowser.getInstance('browser')

    await app.electron.execute((electron, url) => {
      const [mainWindow] = electron.BrowserWindow.getAllWindows()
      mainWindow?.loadURL(url)
    }, chatServer.url)
    await app.waitUntil(async () => (
      (await app.getTitle()) === 'Socket.IO Chat Example'
    ))

    await browser.url(chatServer.url)
    await browser.keys('Browser User')
    await browser.pause(500)
    await app.keys('App User')
    await multiremotebrowser.keys(Key.Enter)
  })

  it('have app user write a message', async () => {
    const app = multiremotebrowser.getInstance('app')
    await app.keys(`Hello World, I am user foobar-${Date.now()}`)
    await app.keys(Key.Enter)
  })

  it('read message in browser', async () => {
    const browser = multiremotebrowser.getInstance('browser')
    await browser.waitUntil(async () => (
      (await browser.$$('.messages > li').length) > 0
    ))
    const messages = await browser.$$('.messages > li').getElements()
    const lastMessage = messages[messages.length - 1]
    await expect(lastMessage).toHaveText(expect.stringContaining('Hello World, I am user foobar-'))

    const appUsername = (await lastMessage.getText()).split(' ').pop()
    await browser.keys(`Hello ${appUsername}, I am barfoo-${Date.now()}`)
    await browser.keys(Key.Enter)

    const app = multiremotebrowser.getInstance('app')
    await app.waitUntil(async () => (
      (await app.$$('.messages > li').length) >= 2
    ))
  })
})
