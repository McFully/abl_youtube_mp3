# 07.03 IPC y Procesos Electron - ABL Youtube

## Aislamiento de Contexto y Preload
Por motivos de seguridad OWASP, Electron no expone las APIs nativas de `node:fs` o `node:child_process` directamente en la vista React (`contextIsolation: true`, `nodeIntegration: false`).

## Implementación en `electron/preload.js`
```javascript
const { contextBridge, ipcRenderer } = require('electron')

const electronAPI = {
  send: (channel, data) => {
    const validChannels = ['window-control']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  invoke: (channel, data) => {
    const validChannels = [
      'select-download-dir',
      'get-default-dir',
      'start-download',
      'cancel-download',
      'check-dependencies',
      'download-dependencies'
    ]
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data)
    }
    return Promise.reject(new Error(`Invalid IPC channel: ${channel}`))
  },
  on: (channel, callback) => {
    const validChannels = ['download-progress', 'dependency-progress']
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
```
