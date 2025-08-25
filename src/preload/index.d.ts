import { ElectronAPI } from '@electron-toolkit/preload'
import { WinTitleAction } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      winTitleOp: (action: WinTitleAction) => void
    }
  }
}
