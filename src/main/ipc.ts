import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  nativeTheme
} from 'electron'
import { SettingsType, WinTitleAction } from '../types'
import * as crypto from 'node:crypto'
import { getData, setData } from './store'

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

ipcMain.handle('getThemeMode', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
})

ipcMain.handle('calculateHash', (_event: IpcMainInvokeEvent, originValue: string) => {
  const md5 = crypto.createHash('md5').update(originValue).digest('hex')
  const sha1 = crypto.createHash('sha1').update(originValue).digest('hex')
  const sha256 = crypto.createHash('sha256').update(originValue).digest('hex')
  const sha512 = crypto.createHash('sha512').update(originValue).digest('hex')
  return { md5, sha1, sha256, sha512 }
})

ipcMain.on('switchOnTop', (event: IpcMainEvent, value: boolean) => {
  const win: BrowserWindow | null = BrowserWindow.fromWebContents(event.sender)
  if (!win) return

  win.setAlwaysOnTop(value)
})

ipcMain.on('changeSettings', (_event: IpcMainEvent, settings: SettingsType) => {
  setData('settings', settings)
})

ipcMain.handle('getSettings', () => {
  return getData('settings')
})

ipcMain.on('changeThemeMode', (_event: IpcMainEvent, value: string) => {
  nativeTheme.themeSource = value as 'dark' | 'light' | 'system'
})
