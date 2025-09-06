import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { SettingsType, WinTitleAction } from '../types'

// Custom APIs for renderer
const api = {
  winTitleOp: (action: WinTitleAction) => {
    ipcRenderer.send('winTitleOp', action)
  },
  openDevTools: () => {
    ipcRenderer.send('openDevTools')
  },
  getThemeMode: (): Promise<string> => {
    return ipcRenderer.invoke('getThemeMode')
  },
  changeThemeMode: (value: string) => {
    ipcRenderer.send('changeThemeMode', value)
  },
  calculateHash: (originValue: string) => {
    return ipcRenderer.invoke('calculateHash', originValue)
  },
  calculateFileHash: (filePath: string) => {
    return ipcRenderer.invoke('calculateFileHash', filePath)
  },
  switchOnTop: (value: boolean) => {
    ipcRenderer.send('switchOnTop', value)
  },
  changeSettings: (settings: SettingsType) => {
    ipcRenderer.send('changeSettings', settings)
  },
  getSettings: () => {
    return ipcRenderer.invoke('getSettings')
  },
  onThemeChanged: (callback: () => void) => {
    ipcRenderer.on('themeChanged', () => {
      callback()
    })
  },
  onClear: (callback: () => void) => {
    ipcRenderer.on('clear', () => {
      callback()
    })
  },
  selectFile: () => {
    return ipcRenderer.invoke('selectFile')
  },
  readFile: (filePath: string) => {
    return ipcRenderer.invoke('readFile', filePath)
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
