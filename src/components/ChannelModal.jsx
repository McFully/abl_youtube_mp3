import React from 'react'
import { Disc, ListMusic, Video, Layers, X, Download } from 'lucide-react'
import { motion } from 'framer-motion'

export function ChannelModal({ channelData, onClose, onConfirm }) {
  if (!channelData) return null

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'rgba(25, 25, 35, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers className="icon-glow" style={{ color: '#8B5CF6' }} size={24} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: 0 }}>
              Estructura de Canal Detectada
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
          Se ha analizado el canal <strong style={{ color: '#F3F4F6' }}>"{channelData.channelTitle}"</strong>. Se extraerán y clasificarán automáticamente en subcarpetas organizadas los siguientes elementos:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Disc size={20} style={{ color: '#EC4899', marginBottom: '6px' }} />
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Álbumes</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF' }}>Auto</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <ListMusic size={20} style={{ color: '#3B82F6', marginBottom: '6px' }} />
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Playlists</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF' }}>Auto</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Video size={20} style={{ color: '#10B981', marginBottom: '6px' }} />
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Pistas Detectadas</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF' }}>{channelData.itemCount || 0}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-primary"
            onClick={onConfirm}
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}
          >
            <Download size={16} />
            Descargar Todo el Canal
          </button>
        </div>
      </motion.div>
    </div>
  )
}
