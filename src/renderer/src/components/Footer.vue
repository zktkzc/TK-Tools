<script setup lang="ts">
import { Browser, ClearFormat, SettingConfig } from '@icon-park/vue-next'
import config from '../../../../package.json'
import { useRoute, useRouter } from 'vue-router'
import { computedAsync } from '@vueuse/core'
import { onMounted } from 'vue'

const platform = window.electron.process.platform
const router = useRouter()
const route = useRoute()
const themeMode = computedAsync(async () => {
  return await window.api.getThemeMode()
})

const openDevTools = (): void => {
  window.api.openDevTools()
}

const handleClear = (): void => {
  window.electron.ipcRenderer.send('clear')
}

onMounted(() => {
  window.api.onThemeChanged(async () => {
    themeMode.value = await window.api.getThemeMode()
  })
})
</script>

<template>
  <div
    :class="[
      'w-full h-full text-sm leading-[30px] text-center border-t border-[#dcdfe6] dark:border-[#4c4d4f] bg-[#F7F7F7] text-[#515A6E] dark:bg-[#333] dark:text-[#BDC6CD] relative',
      platform !== 'win32' ? 'rounded-bl-xl rounded-br-xl' : ''
    ]"
    style="user-select: none"
  >
    tkzc00作品&nbsp;v{{ config.version }}
    <div class="h-full absolute top-0 right-2 flex items-center justify-center gap-2 mx-2">
      <el-tooltip content="清空输入" :effect="themeMode">
        <clear-format
          theme="outline"
          size="24"
          :stroke-width="4"
          class="cursor-pointer text-[#515A6E] dark:text-[#BDC6CD] hover:text-[#29a745]"
          @click="handleClear"
        />
      </el-tooltip>
      <el-tooltip content="打开开发者工具" :effect="themeMode">
        <browser
          theme="outline"
          size="24"
          :stroke-width="4"
          class="cursor-pointer text-[#515A6E] dark:text-[#BDC6CD] hover:text-[#29a745]"
          @click="openDevTools"
        />
      </el-tooltip>
      <el-tooltip content="设置" :effect="themeMode">
        <setting-config
          theme="filled"
          size="24"
          :stroke-width="4"
          class="text-[#515A6E] dark:text-[#BDC6CD] hover:text-[#29a745] cursor-pointer flex items-center"
          @click="router.push({ path: '/config', query: { from: route.path } })"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
