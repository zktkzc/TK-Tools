<script lang="ts" setup>
import { ArrowLeft, Setting } from '@icon-park/vue-next'
import { useSystemThemeStore } from '@renderer/store/useSystemThemeStore'
import { useRoute, useRouter } from 'vue-router'
import { SettingsType } from '../../../types'
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@renderer/store/useSettingsStore'
import { Down } from '@icon-park/vue-next'

const { getSystemThemeMode } = useSystemThemeStore()
const { setSettings, getSettings } = useSettingsStore()
const router = useRouter()
const route = useRoute()
const settings = ref<SettingsType>({
  theme: 'auto'
})

onMounted(() => {
  settings.value = getSettings()
})
</script>

<template>
  <div
    class="h-[calc(100vh-61px)] w-full bg-white overflow-hidden dark:bg-[#252525] flex flex-col justify-center space-y-2 pb-2 overflow-y-hidden"
  >
    <div
      class="h-[32px] w-full dark:text-[#bdc6cd] dark:bg-[#333] px-2 flex items-center justify-center text-center relative"
      style="user-select: none"
    >
      <div
        class="h-[32px] w-[32px] absolute top-0 left-2 flex items-center justify-center dark:text-[#bdc6cd] dark:hover:bg-[#2a3531] dark:hover:text-[#29a745] cursor-pointer"
        @click="
          () => {
            const to = route.query.from ? (route.query.from as string) : '/home/json'
            router.push({ path: '/home', query: { to } })
          }
        "
      >
        <el-tooltip content="返回" :effect="getSystemThemeMode()">
          <arrow-left theme="outline" size="24" :stroke-width="4" />
        </el-tooltip>
      </div>
      软件设置
    </div>
    <div
      class="w-full flex-1 dark:text-[#bdc6cd] border dark:border-[#4C4D4F] rounded-md p-2 m-2 overflow-y-auto relative"
    >
      <el-form :model="settings" label-width="100px">
        <el-form-item label="主题">
          <el-select v-model="settings.theme">
            <el-option label="亮色" value="light" />
            <el-option label="暗色" value="dark" />
            <el-option label="自动" value="auto" />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        class="flex items-center justify-center dark:text-[#515A6E] dark:opacity-15 bg-transparent absolute top-0 left-0 h-full w-full"
      >
        <setting theme="outline" size="240" :stroke-width="1" />
      </div>
    </div>
  </div>
</template>
