<script lang="ts" setup>
import { ArrowLeft, Setting } from '@icon-park/vue-next'
import { useRoute, useRouter } from 'vue-router'
import { SettingsType } from '../../../types'
import { onMounted, ref, watchEffect } from 'vue'
import { useSettingsStore } from '@renderer/store/useSettingsStore'
import { computedAsync } from '@vueuse/core'

const { setSettings, getSettings, defaultSettings } = useSettingsStore()
const router = useRouter()
const route = useRoute()
const settings = ref<SettingsType>(getSettings() || defaultSettings)
const themeMode = computedAsync(async () => {
  return await window.api.getThemeMode()
})

const changeTheme = (value: 'dark' | 'light' | 'system') => {
  window.api.changeThemeMode(value)
  settings.value.theme = value
}

watchEffect(() => {
  setSettings(settings.value)
  window.api.changeSettings(Object.assign({}, settings.value))
})

onMounted(() => {
  window.api.onThemeChanged(async () => {
    themeMode.value = await window.api.getThemeMode()
  })
})
</script>

<template>
  <div
    class="h-full w-full bg-white overflow-hidden dark:bg-[#252525] flex flex-col justify-center space-y-2 overflow-y-hidden"
  >
    <div
      class="h-[32px] w-full bg-[#F7F7F7] dark:text-[#bdc6cd] dark:bg-[#333] px-2 flex items-center justify-center text-center relative"
      style="user-select: none"
    >
      <div
        class="h-[32px] w-[32px] absolute top-0 left-2 flex items-center justify-center hover:bg-[#eaf5f1] dark:text-[#bdc6cd] dark:hover:bg-[#2a3531] dark:hover:text-[#29a745] cursor-pointer"
        @click="
          () => {
            const to = route.query.from ? (route.query.from as string) : '/home/json'
            router.push({ path: '/home', query: { to } })
          }
        "
      >
        <el-tooltip content="返回" :effect="themeMode">
          <arrow-left theme="outline" size="24" :stroke-width="4" />
        </el-tooltip>
      </div>
      软件设置
    </div>
    <div class="w-full flex-1 px-2 pb-2 overflow-y-auto" style="user-select: none">
      <div
        class="w-full h-full dark:text-[#bdc6cd] border dark:border-[#4C4D4F] rounded-md p-2 overflow-y-auto relative"
      >
        <el-form :model="settings" label-width="100px">
          <el-form-item label="主题" class="w-[180px]">
            <el-select v-model="settings.theme" popper-class="custom-select" @change="changeTheme">
              <el-option label="亮色" value="light" />
              <el-option label="暗色" value="dark" />
              <el-option label="自动" value="system" />
            </el-select>
          </el-form-item>
        </el-form>
        <div
          class="flex items-center justify-center text-slate-100 dark:text-[#515A6E] dark:opacity-15 bg-transparent absolute top-0 left-0 h-full w-full pointer-events-none"
        >
          <setting theme="outline" size="240" :stroke-width="1" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select__wrapper) {
  @apply dark:bg-[#252525] shadow-none hover:shadow-none border border-[#DCDFE6] dark:border-[#4C4D4F] hover:border-[#29a745];
}

:deep(.el-select__placeholder) {
  @apply text-[#545C70] dark:text-[#bbc6ce] hover:text-[#29a745];
}

:deep(.el-form-item__label) {
  @apply text-[#545C70] dark:text-[#bbc6ce];
}
</style>
