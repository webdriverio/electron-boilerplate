import http from 'node:http'
import type { AddressInfo } from 'node:net'

const CHAT_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Socket.IO Chat Example</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    .chatPage { display: none; }
    .messages { list-style: none; padding: 0; }
    .messages > li { padding: 4px 0; }
  </style>
</head>
<body>
  <div id="loginPage" class="loginPage">
    <h3>What's your nickname?</h3>
    <input id="usernameInput" class="usernameInput" type="text" maxlength="64" autofocus />
  </div>
  <div id="chatPage" class="chatPage">
    <ul class="messages"></ul>
    <input id="inputMessage" class="inputMessage" placeholder="Type here..." />
  </div>
  <script>
    let username = '';
    let renderedCount = 0;
    const loginPage = document.getElementById('loginPage');
    const chatPage = document.getElementById('chatPage');
    const usernameInput = document.getElementById('usernameInput');
    const inputMessage = document.getElementById('inputMessage');
    const messagesList = document.querySelector('.messages');

    usernameInput.focus();

    function renderMessages(messages) {
      while (renderedCount < messages.length) {
        const li = document.createElement('li');
        li.className = 'message';
        li.textContent = messages[renderedCount];
        messagesList.appendChild(li);
        renderedCount += 1;
      }
    }

    async function pollMessages() {
      try {
        const res = await fetch('/messages');
        if (res.ok) {
          const data = await res.json();
          renderMessages(data.messages || []);
        }
      } catch (_err) {
        // ignore transient polling errors during shutdown
      }
    }

    setInterval(pollMessages, 50);

    async function sendMessage(text) {
      const res = await fetch('/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text })
      });
      if (res.ok) {
        const data = await res.json();
        renderMessages(data.messages || []);
      }
    }

    window.addEventListener('keydown', (event) => {
      const activeInput = username ? inputMessage : usernameInput;
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = activeInput.value.trim();
        if (!value) {
          return;
        }
        if (!username) {
          username = value;
          loginPage.style.display = 'none';
          chatPage.style.display = 'block';
          inputMessage.focus();
          pollMessages();
        } else {
          activeInput.value = '';
          sendMessage(value);
        }
        return;
      }

      if (document.activeElement !== activeInput && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        activeInput.focus();
        activeInput.value += event.key;
        event.preventDefault();
      }
    });
  </script>
</body>
</html>`

export interface ChatServer {
  url: string
  close: () => Promise<void>
}

export async function startChatServer(): Promise<ChatServer> {
  const messages: string[] = []

  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(CHAT_HTML)
      return
    }

    if (req.method === 'GET' && req.url === '/messages') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ messages }))
      return
    }

    if (req.method === 'POST' && req.url === '/messages') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}')
          if (parsed.text) {
            const prefix = parsed.username ? `${parsed.username} ` : ''
            messages.push(`${prefix}${parsed.text}`)
          }
        } catch {
          // ignore malformed payload
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ messages }))
      })
      return
    }

    res.writeHead(404)
    res.end()
  })

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const { port } = server.address() as AddressInfo
  return {
    url: `http://127.0.0.1:${port}/`,
    close: () => new Promise<void>((resolve) => {
      server.close(() => resolve())
    })
  }
}
