import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import process from 'node:process'
import { spawn, exec } from 'node:child_process'
import https from 'node:https'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win
let activeDownloadProcess = null

// Binary Paths (Self-contained in extraResources)
const binDir = app.isPackaged
  ? path.join(process.resourcesPath, 'bin')
  : path.join(app.getAppPath(), 'bin')

const ytdlpPath = path.join(binDir, 'yt-dlp.exe')
const ffmpegPath = path.join(binDir, 'ffmpeg.exe')

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// IPC Handlers
ipcMain.on('window-control', (event, action) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (action === 'minimize') window.minimize()
  if (action === 'maximize') {
    if (window.isMaximized()) window.unmaximize()
    else window.maximize()
  }
  if (action === 'close') window.close()
})

ipcMain.handle('select-download-dir', async () => {
  const result = await dialog.showOpenDialog(win, {
    title: 'Seleccionar Carpeta de Descarga',
    properties: ['openDirectory']
  })
  if (result.canceled) return null
  return result.filePaths[0]
})

ipcMain.handle('get-default-dir', () => {
  return app.getPath('downloads')
})

// Dependency Checking and Download
ipcMain.handle('check-dependencies', () => {
  try {
    const ytExists = fs.existsSync(ytdlpPath) && fs.statSync(ytdlpPath).size > 1024 * 1024
    const ffmpegExists = fs.existsSync(ffmpegPath) && fs.statSync(ffmpegPath).size > 1024 * 1024
    return ytExists && ffmpegExists
  } catch {
    return false
  }
})

const downloadUrlToFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect before opening any file stream
        downloadUrlToFile(response.headers.location, dest).then(resolve).catch(reject)
        return
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
        return
      }

      const file = fs.createWriteStream(dest)
      
      file.on('finish', () => {
        resolve()
      })
      
      file.on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })

      const totalBytes = parseInt(response.headers['content-length'], 10)
      let downloadedBytes = 0

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length
        file.write(chunk)
        if (win && totalBytes) {
          const percent = Math.round((downloadedBytes / totalBytes) * 100)
          win.webContents.send('dependency-progress', { percent, totalBytes, downloadedBytes })
        }
      })

      response.on('end', () => {
        file.end()
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

ipcMain.handle('download-dependencies', async () => {
  try {
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true })
    }

    // 1. Download yt-dlp
    const ytdlpUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
    await downloadUrlToFile(ytdlpUrl, ytdlpPath)

    // 2. Download ffmpeg zip (using yt-dlp builds for a lightweight Windows ffmpeg)
    const ffmpegZipUrl = 'https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip'
    const ffmpegZipPath = path.join(binDir, 'ffmpeg.zip')
    await downloadUrlToFile(ffmpegZipUrl, ffmpegZipPath)

    // Use PowerShell to extract ffmpeg.exe and ffprobe.exe
    return new Promise((resolve, reject) => {
      const tempExtractDir = path.join(binDir, 'temp_ffmpeg')
      
      // Clean start for temp dir
      if (fs.existsSync(tempExtractDir)) {
        try {
          fs.rmSync(tempExtractDir, { recursive: true, force: true })
        } catch (e) {
          console.error(e)
        }
      }
      fs.mkdirSync(tempExtractDir, { recursive: true })

      // Taskkill to unlock files if they are in use by another zombie process
      exec('taskkill /F /IM ffmpeg.exe /IM ffprobe.exe /IM yt-dlp.exe 2>nul', () => {
        const psCommand = `Expand-Archive -Path "${ffmpegZipPath}" -DestinationPath "${tempExtractDir}" -Force; Get-ChildItem -Path "${tempExtractDir}" -Filter "ffmpeg.exe" -Recurse | Copy-Item -Destination "${binDir}" -Force; Get-ChildItem -Path "${tempExtractDir}" -Filter "ffprobe.exe" -Recurse | Copy-Item -Destination "${binDir}" -Force`
        
        exec(`powershell -Command "${psCommand}"`, (error) => {
          // Clean up zip and temp files
          try {
            if (fs.existsSync(ffmpegZipPath)) fs.unlinkSync(ffmpegZipPath)
            if (fs.existsSync(tempExtractDir)) {
              fs.rmSync(tempExtractDir, { recursive: true, force: true })
            }
          } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError)
          }

          if (error) {
            reject(error)
          } else {
            resolve(true)
          }
        })
      })
    })
  } catch (err) {
    console.error('Error downloading dependencies:', err)
    return false
  }
})

// Channel Scanning IPC
ipcMain.handle('scan-channel', async (event, { url }) => {
  return new Promise((resolve) => {
    // Normalise channel URL base
    let cleanUrl = url.trim().replace(/\/+(releases|playlists|videos|shorts|featured)$/i, '')
    
    // Check full channel info without page limits
    const scanProc = spawn(ytdlpPath, [
      '--dump-json',
      '--flat-playlist',
      cleanUrl
    ])

    let stdoutData = ''
    scanProc.stdout.on('data', (d) => { stdoutData += d.toString() })
    scanProc.on('close', (code) => {
      if (code !== 0 || !stdoutData.trim()) {
        resolve({ success: false, error: 'No se pudo escanear la estructura del canal.' })
        return
      }

      const items = stdoutData.trim().split('\n').map(line => {
        try { return JSON.parse(line) } catch { return null }
      }).filter(Boolean)

      const channelTitle = items[0]?.playlist_title || items[0]?.channel || items[0]?.uploader || 'Canal'

      resolve({
        success: true,
        channelTitle,
        itemCount: items.length,
        items: items.map(i => ({
          id: i.id,
          title: i.title,
          url: i.url || `https://www.youtube.com/watch?v=${i.id}`
        }))
      })
    })
  })
})

// Video/Playlist Download and Metadata Extraction
ipcMain.handle('start-download', async (event, { url, outDir, options = {} }) => {
  return new Promise((resolve) => {
    // 1. Get playlist/video details first using flat-playlist dump-json
    const detailsProcess = spawn(ytdlpPath, [
      '--dump-json',
      '--flat-playlist',
      url
    ])

    let detailsData = ''
    detailsProcess.stdout.on('data', (data) => {
      detailsData += data.toString()
    })

    detailsProcess.on('close', async (code) => {
      if (code !== 0) {
        resolve({ success: false, error: 'No se pudo obtener información del vídeo/playlist.' })
        return
      }

      // Parse JSON lines
      const items = detailsData.trim().split('\n').map(line => {
        try {
          const parsed = JSON.parse(line)
          return {
            id: parsed.id,
            title: parsed.title,
            url: parsed.url || `https://www.youtube.com/watch?v=${parsed.id}`,
            status: 'queued', // queued, downloading, converting, completed, failed
            progress: 0,
            speed: '',
            eta: ''
          }
        } catch {
          return null
        }
      }).filter(Boolean)

      if (items.length === 0) {
        resolve({ success: false, error: 'No se encontraron pistas válidas para descargar.' })
        return
      }

      // Tell renderer what we're about to download
      win.webContents.send('download-progress', { type: 'init-queue', items })

      // Download sequential helper function
      const downloadItem = async (item) => {
        return new Promise((resolveItem) => {
          win.webContents.send('download-progress', { type: 'update-item', id: item.id, status: 'downloading', progress: 0 })

          // Log setup
          const logFile = path.join(app.getPath('userData'), 'download.log')
          try {
            fs.appendFileSync(logFile, `\n\n--- Starting download for ${item.title} ---\n`)
            fs.appendFileSync(logFile, `Command: "${ytdlpPath}" ${JSON.stringify([
              '-x',
              '--audio-format',
              'mp3',
              '--audio-quality',
              '0',
              '--ffmpeg-location',
              binDir,
              '--newline',
              '--progress',
              '--no-colors',
              '-o',
              path.join(outDir, '%(title)s.%(ext)s'),
              item.url
            ])}\n`)
          } catch (e) {
            console.error('Failed to write log', e)
          }

          const outputTemplate = options.subDir 
            ? path.join(outDir, options.subDir, '%(title)s.%(ext)s')
            : path.join(outDir, '%(title)s.%(ext)s')

          const dlp = spawn(ytdlpPath, [
            '-x',
            '--audio-format',
            'mp3',
            '--audio-quality',
            '0',
            '--ffmpeg-location',
            binDir,
            '--newline',
            '--progress',
            '--no-colors',
            '-o',
            outputTemplate,
            item.url
          ], {
            cwd: outDir
          })

          activeDownloadProcess = dlp

          dlp.stdout.on('data', (data) => {
            const line = data.toString().trim()
            try {
              fs.appendFileSync(logFile, `STDOUT: ${line}\n`)
            } catch {}
            
            // Parse progress
            const progressMatch = line.match(/\[download\]\s+(\d+\.\d+)%/)
            const speedMatch = line.match(/at\s+([^\s]+)/)
            const etaMatch = line.match(/ETA\s+([^\s]+)/)
            
            let progressVal = 0
            if (progressMatch) {
              progressVal = parseFloat(progressMatch[1])
              win.webContents.send('download-progress', {
                type: 'update-item',
                id: item.id,
                status: progressVal === 100 ? 'converting' : 'downloading',
                progress: progressVal,
                speed: speedMatch ? speedMatch[1] : '',
                eta: etaMatch ? etaMatch[1] : ''
              })
            }

            if (line.includes('[ExtractAudio]') || line.includes('[ffmpeg]')) {
              win.webContents.send('download-progress', {
                type: 'update-item',
                id: item.id,
                status: 'converting',
                progress: 100
              })
            }
          })

          dlp.stderr.on('data', (data) => {
            try {
              fs.appendFileSync(logFile, `STDERR: ${data.toString()}\n`)
            } catch {}
          })

          dlp.on('error', (err) => {
            try {
              fs.appendFileSync(logFile, `SPAWN ERROR: ${err.message}\n`)
            } catch {}
          })

          dlp.on('close', (code) => {
            activeDownloadProcess = null
            try {
              fs.appendFileSync(logFile, `CLOSE CODE: ${code}\n`)
            } catch {}
            if (code === 0) {
              win.webContents.send('download-progress', {
                type: 'update-item',
                id: item.id,
                status: 'completed',
                progress: 100
              })
              resolveItem(true)
            } else {
              win.webContents.send('download-progress', {
                type: 'update-item',
                id: item.id,
                status: 'failed',
                progress: 0
              })
              resolveItem(false)
            }
          })
        })
      }

      // Process sequential download queue
      for (const item of items) {
        await downloadItem(item)
      }

      resolve({ success: true })
    })
  })
})

// Retry single failed track IPC
ipcMain.handle('retry-single-track', async (event, { item, outDir }) => {
  return new Promise((resolveItem) => {
    win.webContents.send('download-progress', { type: 'update-item', id: item.id, status: 'downloading', progress: 0 })

    const dlp = spawn(ytdlpPath, [
      '-x',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '0',
      '--ffmpeg-location',
      binDir,
      '--newline',
      '--progress',
      '--no-colors',
      '-o',
      path.join(outDir, '%(title)s.%(ext)s'),
      item.url
    ], { cwd: outDir })

    activeDownloadProcess = dlp

    dlp.stdout.on('data', (data) => {
      const line = data.toString().trim()
      const progressMatch = line.match(/\[download\]\s+(\d+\.\d+)%/)
      const speedMatch = line.match(/at\s+([^\s]+)/)
      const etaMatch = line.match(/ETA\s+([^\s]+)/)

      if (progressMatch) {
        const progressVal = parseFloat(progressMatch[1])
        win.webContents.send('download-progress', {
          type: 'update-item',
          id: item.id,
          status: progressVal === 100 ? 'converting' : 'downloading',
          progress: progressVal,
          speed: speedMatch ? speedMatch[1] : '',
          eta: etaMatch ? etaMatch[1] : ''
        })
      }
      if (line.includes('[ExtractAudio]') || line.includes('[ffmpeg]')) {
        win.webContents.send('download-progress', {
          type: 'update-item',
          id: item.id,
          status: 'converting',
          progress: 100
        })
      }
    })

    dlp.on('close', (code) => {
      activeDownloadProcess = null
      if (code === 0) {
        win.webContents.send('download-progress', {
          type: 'update-item',
          id: item.id,
          status: 'completed',
          progress: 100
        })
        resolveItem({ success: true })
      } else {
        win.webContents.send('download-progress', {
          type: 'update-item',
          id: item.id,
          status: 'failed',
          progress: 0
        })
        resolveItem({ success: false })
      }
    })
  })
})

ipcMain.handle('cancel-download', () => {
  if (activeDownloadProcess) {
    try {
      activeDownloadProcess.kill()
      activeDownloadProcess = null
      return true
    } catch {
      return false
    }
  }
  return false
})
