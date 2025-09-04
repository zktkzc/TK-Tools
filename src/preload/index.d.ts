import { ElectronAPI } from '@electron-toolkit/preload'
import { WinTitleAction } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      winTitleOp: (action: WinTitleAction) => void
      openDevTools: () => void
      getSystemTheme: () => Promise<string>
      onThemeChange: (callback: (theme: string) => void) => any
      calculateHash: (originValue: string) => any
      switchOnTop: (value: boolean) => void
    }
  }
}
