<script lang="ts" setup>
import { ArrowLeft, Setting } from '@icon-park/vue-next'
import { useSystemThemeStore } from '@renderer/store/useSystemThemeStore'
import { useRoute, useRouter } from 'vue-router'

const { getSystemThemeMode } = useSystemThemeStore()
const router = useRouter()
const route = useRoute()
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
            console.log(route.query)
            router.push(route.query.from as string)
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
      class="flex-1 dark:text-[#bdc6cd] border dark:border-[#4C4D4F] rounded-md p-2 m-2 overflow-y-auto relative"
    >
      <div
        class="flex items-center justify-center dark:text-[#515A6E] dark:opacity-15 absolute top-0 left-0 h-full w-full"
      >
        <setting theme="outline" size="240" :stroke-width="1" />
      </div>
    </div>
  </div>
</template>
