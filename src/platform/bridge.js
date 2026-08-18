export const isElectron = () => !!(window && window.electron);

const electronAPI = window.electron;

export const platform = {
  control(action) {
    if (isElectron()) {
      electronAPI.send('window-control', action);
    }
  },
  async selectDownloadDir() {
    if (isElectron()) {
      return await electronAPI.invoke('select-download-dir');
    }
    return null;
  },
  async getDefaultDir() {
    if (isElectron()) {
      return await electronAPI.invoke('get-default-dir');
    }
    return null;
  },
  async checkDependencies() {
    if (isElectron()) {
      return await electronAPI.invoke('check-dependencies');
    }
    return true;
  },
  async downloadDependencies() {
    if (isElectron()) {
      return await electronAPI.invoke('download-dependencies');
    }
    return true;
  },
  async startDownload(url, outDir, options = {}) {
    if (isElectron()) {
      return await electronAPI.invoke('start-download', { url, outDir, options });
    }
    return { success: false, error: 'Plataforma no soportada' };
  },
  async scanChannel(url) {
    if (isElectron()) {
      return await electronAPI.invoke('scan-channel', { url });
    }
    return { success: false, error: 'Plataforma no soportada' };
  },
  async retrySingleTrack(item, outDir) {
    if (isElectron()) {
      return await electronAPI.invoke('retry-single-track', { item, outDir });
    }
    return { success: false, error: 'Plataforma no soportada' };
  },
  async cancelDownload() {
    if (isElectron()) {
      return await electronAPI.invoke('cancel-download');
    }
    return false;
  },
  on(channel, callback) {
    if (isElectron()) {
      return electronAPI.on(channel, callback);
    }
    return () => {};
  }
};
