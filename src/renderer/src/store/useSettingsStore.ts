import { defineStore } from 'pinia'
import { SettingsType } from '../../../types'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      settings: null as SettingsType | null,
      defaultSettings: {
        theme: 'system'
      } as SettingsType
    }
  },
  actions: {
    setSettings(value: SettingsType): void {
      this.settings = value
    },
    getSettings(): SettingsType | null {
      return this.settings
    }
  },
  persist: {
    key: 'settings',
    storage: localStorage,
    pick: ['settings']
  }
})
