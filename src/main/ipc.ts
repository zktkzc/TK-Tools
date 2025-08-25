import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { WinTitleAction, WinTitleOpParam } from '../types'

ipcMain.on('winTitleOp', (e: IpcMainEvent, { action, data }: WinTitleOpParam) => {
  const webContents = e.sender
  const win: BrowserWindow | null = BrowserWindow.fromWebContents(webContents)
  if (!win) return

  switch (action) {
    case WinTitleAction.Close:
      if (data.closeType === 0) {
        win.close()
      } else {
        win.setSkipTaskbar(true)
        win.hide()
      }
      break
    case WinTitleAction.Minimize:
      win.minimize()
      break
    case WinTitleAction.Maximize:
      win.maximize()
      break
    case WinTitleAction.Unmaximize:
      win.unmaximize()
      break
  }
})
