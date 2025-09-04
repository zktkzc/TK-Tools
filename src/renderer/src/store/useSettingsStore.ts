import { defineStore } from 'pinia'
import { SettingsType } from '../../../types'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
    'settings',
    () => {
        const settings = ref<SettingsType>({
            theme: 'auto'
        })

        function setSettings(value: SettingsType): void {
            settings.value = value
        }

        function getSettings(): SettingsType {
            return settings.value
        }

        return { setSettings, getSettings }
    },
    { persist: true }
)
