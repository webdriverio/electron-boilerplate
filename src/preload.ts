import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => ipcRenderer.send('dialog', method, config)
});
