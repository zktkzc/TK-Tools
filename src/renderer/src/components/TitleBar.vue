<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Close, Copy, Minus, Square, Pin } from '@icon-park/vue-next'
import { WinTitleAction } from '../../../types'

defineProps({
  showMin: {
    type: Boolean,
    default: true
  },
  showMax: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showTop: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'TK-Tools测试常用工具箱'
  }
})

const isMax = ref(false)
const onTop = ref(false)

const close = (): void => {
  window.api.winTitleOp(WinTitleAction.Close)
}

const minimize = (): void => {
  window.api.winTitleOp(WinTitleAction.Minimize)
}

const maximize = (): void => {
  if (isMax.value) {
    window.api.winTitleOp(WinTitleAction.Unmaximize)
  } else {
    window.api.winTitleOp(WinTitleAction.Maximize)
  }
}

const top = () => {
  onTop.value = !onTop.value
  window.api.switchOnTop(onTop.value)
}

onMounted(() => {
  isMax.value = false
  window.electron.ipcRenderer.on('winIsMax', (_e, result) => {
    isMax.value = result
  })
})
</script>

<template>
  <div
    class="w-full h-[30px] leading-[30px] flex items-center justify-between relative bg-white dark:bg-gray-800 dark:text-white rounded-tl-xl rounded-tr-xl"
    style="-webkit-app-region: drag"
  >
    <div class="h-full w-full text-center" style="user-select: none">{{ title }}</div>
    <div class="h-full flex items-center justify-center absolute top-0 right-0">
      <Pin
        v-if="showTop && onTop"
        class="h-full w-[30px] cursor-pointer text-[#29a745] dark:bg-gray-800 dark:hover:bg-gray-600 bg-white flex items-center justify-center"
        style="-webkit-app-region: no-drag"
        title="取消置顶"
        theme="filled"
        @click="top()"
      />
      <Pin
        v-if="showTop && !onTop"
        class="h-full w-[30px] cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600 bg-white flex items-center justify-center"
        style="-webkit-app-region: no-drag"
        title="置顶"
        @click="top()"
      />
      <Minus
        v-if="showMin"
        class="h-full w-[30px] cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600 bg-white flex items-center justify-center"
        style="-webkit-app-region: no-drag"
        title="最小化"
        @click="minimize()"
      />
      <Square
        v-if="showMax && !isMax"
        class="h-full w-[30px] cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600 bg-white flex items-center justify-center"
        style="-webkit-app-region: no-drag"
        :title="isMax ? '还原' : '最大化'"
        @click="maximize()"
      />
      <Copy
        v-if="showMax && isMax"
        class="h-full w-[30px] cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600 bg-white flex items-center justify-center"
        style="-webkit-app-region: no-drag"
        :title="isMax ? '还原' : '最大化'"
        @click="maximize()"
      />
      <Close
        v-if="showClose"
        class="h-full w-[30px] cursor-pointer hover:bg-red-500 dark:bg-gray-800 dark:text-white dark:hover:bg-red-500 bg-white flex items-center justify-center rounded-tr-xl"
        style="-webkit-app-region: no-drag"
        title="关闭"
        @click="close()"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
