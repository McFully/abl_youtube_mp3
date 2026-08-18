import { useState, useEffect } from 'react'
import { 
  Download, 
  FolderOpen, 
  X, 
  Minus, 
  Square, 
  AlertTriangle, 
  Music,
  Compass,
  Video,
  Clipboard,
  RotateCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { platform } from './platform/bridge'
import { ChannelModal } from './components/ChannelModal'

function App() {
  const [url, setUrl] = useState('')
  const [downloadDir, setDownloadDir] = useState('')
  const [queue, setQueue] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [isScanning, setIsScanning] = useState(false)
  const [channelData, setChannelData] = useState(null)

  // On Mount: Load default download folder
  useEffect(() => {
    const init = async () => {
      try {
        const defaultDir = await platform.getDefaultDir()
        if (defaultDir) setDownloadDir(defaultDir)
      } catch (err) {
        console.error('Error during init:', err)
      }
    }
    init()
  }, [])

  // Listen to IPC events for track downloads progress
  useEffect(() => {
    const unsubscribeQueue = platform.on('download-progress', (data) => {
      if (data.type === 'init-queue') {
        setQueue(data.items)
      } else if (data.type === 'update-item') {
        setQueue(prev => prev.map(item => {
          if (item.id === data.id) {
            return {
              ...item,
              status: data.status,
              progress: data.progress,
              speed: data.speed || item.speed,
              eta: data.eta || item.eta
            }
          }
          return item
        }))
      }
    })

    return () => {
      unsubscribeQueue()
    }
  }, [])

  const isChannelUrl = (targetUrl) => {
    const clean = targetUrl.trim().toLowerCase()
    return clean.includes('/@') || clean.includes('/channel/') || clean.includes('/c/') || clean.includes('/user/')
  }

  const handleSelectDir = async () => {
    const selected = await platform.selectDownloadDir()
    if (selected) {
      setDownloadDir(selected)
    }
  }

  const handleStartDownload = async () => {
    if (!url.trim()) return
    if (!downloadDir) {
      setErrorMessage('Por favor, selecciona una carpeta de destino.')
      return
    }

    setErrorMessage('')

    // Detect Channel URL
    if (isChannelUrl(url)) {
      setIsScanning(true)
      try {
        const scanRes = await platform.scanChannel(url)
        if (scanRes.success) {
          setChannelData(scanRes)
          return
        } else {
          setErrorMessage(scanRes.error || 'Error al escanear el canal.')
        }
      } catch (err) {
        setErrorMessage('Error al analizar canal: ' + err.message)
      } finally {
        setIsScanning(false)
      }
      return
    }

    executeDownload()
  }

  const executeDownload = async (subDir = null) => {
    setIsDownloading(true)
    setQueue([]) // Reset queue
    setChannelData(null)

    try {
      const options = subDir ? { subDir } : {}
      const result = await platform.startDownload(url, downloadDir, options)
      if (!result.success) {
        setErrorMessage(result.error || 'Fallo al descargar.')
      }
    } catch (err) {
      setErrorMessage('Error en el proceso de descarga: ' + err.message)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCancelDownload = async () => {
    await platform.cancelDownload()
    setIsDownloading(false)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setUrl(text.trim())
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  const handleRetryTrack = async (item) => {
    if (!downloadDir) return
    try {
      await platform.retrySingleTrack(item, downloadDir)
    } catch (err) {
      console.error('Failed to retry track:', err)
    }
  }

  return (
    <>
      {/* Title Bar */}
      <div className="title-bar">
        <div className="app-info">
          <img src="./logo.png" alt="Logo" className="app-logo" />
          <span>ABL YouTube MP3</span>
        </div>
        <div className="window-controls">
          <button className="control-btn" onClick={() => handleWindowControl('minimize')}>
            <Minus size={14} />
          </button>
          <button className="control-btn" onClick={() => handleWindowControl('maximize')}>
            <Square size={12} />
          </button>
          <button className="control-btn close" onClick={() => handleWindowControl('close')}>
            <X size={14} />
          </button>
        </div>
      </div>
 
      {/* Main Container */}
      <div className="main-container">
        
        {/* Header */}
        <div className="header">
          <img src="./logo.png" alt="Logo" className="main-logo" />
          <div className="header-text">
            <h1>ABL YouTube MP3</h1>
            <p>
              Introduce el enlace de un vídeo o una lista de reproducción de YouTube y obtén automáticamente todos los audios en formato MP3 de alta calidad, procesados de forma secuencial.
            </p>
          </div>
        </div>

        {/* Input URL and Target Folder Glass Panel */}
        <div className="glass-panel">
          <div className="input-group">
            <label className="input-label">Enlace de YouTube (Vídeo o Playlist)</label>
            <div className="input-row">
              <input 
                type="text" 
                className="text-input" 
                placeholder="https://www.youtube.com/watch?v=... o https://www.youtube.com/playlist?list=..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isDownloading}
              />
              <button 
                className="btn btn-secondary" 
                onClick={handlePaste} 
                disabled={isDownloading}
                title="Pegar enlace del portapapeles"
              >
                <Clipboard size={16} />
                Pegar
              </button>
              {!isDownloading && !isScanning ? (
                <button className="btn btn-primary" onClick={handleStartDownload} disabled={!url.trim()}>
                  <Download size={16} />
                  Descargar MP3
                </button>
              ) : isScanning ? (
                <button className="btn btn-primary" disabled style={{ opacity: 0.8 }}>
                  Analizando Canal...
                </button>
              ) : (
                <button className="btn btn-danger" onClick={handleCancelDownload}>
                  <X size={16} />
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Carpeta de Destino</label>
            <div className="input-row">
              <input 
                type="text" 
                className="text-input" 
                value={downloadDir} 
                readOnly
                placeholder="Ninguna carpeta seleccionada"
              />
              <button className="btn btn-secondary" onClick={handleSelectDir} disabled={isDownloading}>
                <FolderOpen size={16} />
                Cambiar Carpeta
              </button>
            </div>
          </div>

          {errorMessage && (
            <div style={{ color: '#F87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Queue / Progress List */}
        <div className="queue-container">
          <div className="queue-header">
            <h3 className="queue-title">Cola de Descarga</h3>
            <span className="queue-count">{queue.length} {queue.length === 1 ? 'pista' : 'pistas'}</span>
          </div>

          {queue.length === 0 ? (
            <div className="empty-state">
              <Compass size={48} />
              <p>Introduce un enlace y haz clic en Descargar para iniciar.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              <AnimatePresence initial={false}>
                {queue.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`track-item ${item.status}`}
                  >
                    <div className="track-info">
                      <div className="track-name-container">
                        <Music className="track-icon" size={16} />
                        <span className="track-name" title={item.title}>{item.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`track-status status-${item.status}`}>
                          {item.status === 'queued' && 'En Cola'}
                          {item.status === 'downloading' && 'Descargando'}
                          {item.status === 'converting' && 'Convirtiendo'}
                          {item.status === 'completed' && 'Completado'}
                          {item.status === 'failed' && 'Error'}
                        </span>
                        {item.status === 'failed' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                            onClick={() => handleRetryTrack(item)}
                            title="Reintentar descarga"
                          >
                            <RotateCw size={12} />
                            Reintentar
                          </button>
                        )}
                      </div>
                    </div>

                    {(item.status === 'downloading' || item.status === 'converting') && (
                      <div className="progress-container">
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <div className="progress-details">
                          <span>{Math.round(item.progress)}%</span>
                          <div className="progress-stats">
                            {item.speed && <span>{item.speed}</span>}
                            {item.eta && <span>ETA: {item.eta}</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <ChannelModal 
        channelData={channelData}
        onClose={() => setChannelData(null)}
        onConfirm={() => executeDownload(channelData?.channelTitle || 'Canal')}
      />
    </>
  )
}

export default App
