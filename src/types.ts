/* eslint-disable @typescript-eslint/no-explicit-any */
export enum WinTitleAction {
  Close = 'close',
  Minimize = 'minimize',
  Maximize = 'maximize',
  Unmaximize = 'unmaximize'
}

export interface WinTitleOpParam {
  action: WinTitleAction
  data: any
}
