import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { WinTitleAction } from '../types'

ipcMain.on('winTitleOp', (e: IpcMainEvent, action: WinTitleAction) => {
  const webContents = e.sender
  const win: BrowserWindow | null = BrowserWindow.fromWebContents(webContents)
  if (!win) return

  switch (action) {
    case WinTitleAction.Close:
      app.quit()
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
