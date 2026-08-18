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
      'download-dependencies',
      'scan-channel',
      'retry-single-track'
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

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
} catch (error) {
  console.error('Failed to expose Electron API:', error)
}
