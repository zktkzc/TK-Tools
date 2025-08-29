import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  nativeTheme
} from 'electron'
import { WinTitleAction } from '../types'
import * as crypto from 'node:crypto'

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

ipcMain.on('openDevTools', (e: IpcMainEvent) => {
  const win: BrowserWindow | null = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  if (win.webContents.isDevToolsOpened()) {
    win.webContents.closeDevTools()
  } else {
    win.webContents.openDevTools()
  }
})

ipcMain.handle('getSystemTheme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
})

nativeTheme.on('updated', () => {
  const themeMode = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  // 向所有渲染进程广播主题更新
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('system-theme-changed', themeMode)
  })
})

ipcMain.handle('calculateHash', (_event: IpcMainInvokeEvent, originValue: string) => {
  const md5 = crypto.createHash('md5').update(originValue).digest('hex')
  const sha1 = crypto.createHash('sha1').update(originValue).digest('hex')
  const sha256 = crypto.createHash('sha256').update(originValue).digest('hex')
  const sha512 = crypto.createHash('sha512').update(originValue).digest('hex')
  return { md5, sha1, sha256, sha512 }
})
