import { ElectronAPI } from '@electron-toolkit/preload'
import { SettingsType, WinTitleAction } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      winTitleOp: (action: WinTitleAction) => void
      openDevTools: () => void
      getThemeMode: () => Promise<string>
      changeThemeMode: (value: string) => void
      onThemeChange: (callback: (theme: string) => void) => any
      calculateHash: (originValue: string) => any
      calculateFileHash: (filePath: string) => Promise<any>
      switchOnTop: (value: boolean) => void
      changeSettings: (settings: SettingsType) => void
      getSettings: () => Promise<SettingsType>
      onThemeChanged: (callback: () => void) => any
      onClear: (callback: () => void) => any
      selectFile: () => Promise<any>
      readFile: (filePath: string) => Promise<any>
    }
  }
}
