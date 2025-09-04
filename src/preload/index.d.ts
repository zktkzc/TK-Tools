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
      switchOnTop: (value: boolean) => void
      changeSettings: (settings: SettingsType) => void
      getSettings: () => Promise<SettingsType>
    }
  }
}
