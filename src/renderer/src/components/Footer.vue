<script setup lang="ts">
import { Browser, SettingConfig } from '@icon-park/vue-next'
import config from '../../../../package.json'

const openDevTools = (): void => {
  window.api.openDevTools()
}
</script>

<template>
  <div
    class="w-full h-[30px] text-sm leading-[30px] text-center border-t border-[#dcdfe6] dark:border-[#4c4d4f] bg-[#F7F7F7] text-[#515A6E] dark:bg-[#333] dark:text-[#BDC6CD] rounded-bl-xl rounded-br-xl relative"
    style="user-select: none"
  >
    tkzc00作品&nbsp;v{{ config.version }}
    <div class="h-full absolute top-0 right-0 flex items-center justify-center gap-2 mx-2">
      <el-tooltip content="打开开发者工具">
        <browser
          theme="outline"
          size="24"
          :stroke-width="4"
          class="cursor-pointer text-[#515A6E] dark:text-[#BDC6CD] hover:text-[#29a745]"
          @click="openDevTools"
        />
      </el-tooltip>
      <el-tooltip content="设置">
        <setting-config
          theme="filled"
          size="24"
          :stroke-width="4"
          class="text-[#515A6E] dark:text-[#BDC6CD] hover:text-[#29a745] cursor-pointer flex items-center"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
