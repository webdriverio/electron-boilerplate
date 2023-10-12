import { Key } from 'webdriverio'
import { multiremotebrowser } from "@wdio/globals"

describe('Multiremote', () => {
  it('should open chat window', async () => {
    const app = multiremotebrowser.getInstance('app')
    const browser = multiremotebrowser.getInstance('browser')

    app.electron.api('openChatWindow')
    await app.waitUntil(async () => (
      (await app.getTitle()) === 'Socket.IO Chat Example'
    ))

    await browser.url('https://socketio-chat-h9jt.herokuapp.com/')
    await browser.keys('Browser User')
    await browser.pause(3000)
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
      await browser.$$('.messages > li').length > 0
    ))
    const messages = await browser.$$('.messages > li')
    const lastMessage = messages[messages.length - 1]
    await expect(lastMessage).toHaveTextContaining('Hello World, I am user foobar-')

    const appUsername = (await lastMessage.getText()).split(' ').pop()
    await browser.keys(`Hello ${appUsername}, I am barfoo-${Date.now()}`)
    await browser.keys(Key.Enter)
    await browser.pause(2000)
  })
})
