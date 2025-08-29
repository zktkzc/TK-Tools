import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { WinTitleAction } from '../types'

// Custom APIs for renderer
const api = {
  winTitleOp: (action: WinTitleAction) => {
    ipcRenderer.send('winTitleOp', action)
  },
  openDevTools: () => {
    ipcRenderer.send('openDevTools')
  },
  getSystemTheme: (): Promise<string> => {
    return ipcRenderer.invoke('getSystemTheme')
  },
  onThemeChange: (callback: (theme: string) => void) => {
    ipcRenderer.on('system-theme-changed', (_, theme) => callback(theme))
  },
  calculateHash: (originValue: string) => {
    return ipcRenderer.invoke('calculateHash', originValue)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
