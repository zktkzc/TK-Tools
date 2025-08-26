<script setup lang="ts">
import TitleBar from './components/TitleBar.vue'
import Footer from '@renderer/components/Footer.vue'
import { onMounted, onUnmounted } from 'vue'
import { useSystemThemeStore } from '@renderer/store/useSystemThemeStore'

let { setSystemThemeMode } = useSystemThemeStore()

const init = async (): Promise<void> => {
  const mode = await window.api.getSystemTheme()
  setSystemThemeMode(mode)
}

onMounted(() => {
  init()

  window.api.onThemeChange((theme: string) => {
    setSystemThemeMode(theme)
  })
})

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('system-theme-changed')
})
</script>

<template>
  <TitleBar />
  <router-view />
  <Footer />
</template>
