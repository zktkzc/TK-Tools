import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemThemeStore = defineStore(
  'systemTheme',
  () => {
    const systemThemeMode = ref<string>()

    function setSystemThemeMode(mode: string): void {
      systemThemeMode.value = mode
    }

    function getSystemThemeMode(): string | undefined {
      return systemThemeMode.value
    }

    return { setSystemThemeMode, getSystemThemeMode }
  },
  { persist: true }
)
