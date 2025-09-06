import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  nativeTheme
} from 'electron'
import { SettingsType, WinTitleAction } from '../types'
import * as crypto from 'node:crypto'
import { getData, setData } from './store'
import * as fs from 'node:fs'

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

ipcMain.handle('calculateFileHash', (_event: IpcMainInvokeEvent, filePath: string) => {
  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(filePath)

    const md5_hash = crypto.createHash('md5')
    const sha1_hash = crypto.createHash('sha1')
    const sha256_hash = crypto.createHash('sha256')
    const sha512_hash = crypto.createHash('sha512')

    inputStream.on('data', (chunk) => {
      md5_hash.update(chunk)
      sha1_hash.update(chunk)
      sha256_hash.update(chunk)
      sha512_hash.update(chunk)
    })

    // 当流读取结束时，计算最终的哈希值
    inputStream.on('end', () => {
      const md5 = md5_hash.digest('hex')
      const sha1 = sha1_hash.digest('hex')
      const sha256 = sha256_hash.digest('hex')
      const sha512 = sha512_hash.digest('hex')
      resolve({ md5, sha1, sha256, sha512 })
    })

    // 如果流读取过程中发生错误，拒绝 Promise
    inputStream.on('error', (err) => {
      reject(err)
    })
  })
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

ipcMain.on('changeThemeMode', (event: IpcMainEvent, value: string) => {
  nativeTheme.themeSource = value as 'dark' | 'light' | 'system'
  BrowserWindow.fromWebContents(event.sender)?.webContents.send('themeChanged')
})

ipcMain.on('clear', (event: IpcMainEvent) => {
  BrowserWindow.fromWebContents(event.sender)?.webContents.send('clear')
})

ipcMain.handle('selectFile', async () => {
  return await dialog.showOpenDialog({
    title: '选择文件',
    properties: ['openFile']
  })
})

ipcMain.handle('readFile', async (_event: IpcMainInvokeEvent, filePath: string) => {
  return new Promise((resolve, reject) => {
    try {
      const fileBuffer = fs.readFileSync(filePath)
      resolve(fileBuffer)
    } catch (error) {
      reject(error)
    }
  })
})
