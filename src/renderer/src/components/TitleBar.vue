<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Close, Minus, Square } from '@icon-park/vue-next'

const props = defineProps({
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
  title: {
    type: String,
    default: 'TK-Tools测试常用工具箱'
  }
})

const isMax = ref(false)
const winOp = (action, data) => {
  window.electron.ipcRenderer.send('winTitleOp', { action, data })
}

const close = () => {
  winOp('close', {})
}

const custClose = () => {
  winOp('close', {})
}

const minimize = () => {
  winOp('minimize')
}

const maximize = () => {
  if (isMax.value) {
    winOp('unmaximize')
  } else {
    winOp('maximize')
  }
}

onMounted(() => {
  isMax.value = false
  window.electron.ipcRenderer.on('winIsMax', (e, result) => {
    isMax.value = result
  })
})

defineExpose({
  custClose
})
</script>

<template>
  <div
    class="w-full flex items-center justify-between relative drag"
    style="-webkit-app-region: drag"
  >
    <div class="h-full w-full text-center" style="user-select: none">{{ title }}</div>
    <div class="h-full flex items-center justify-center absolute top-0 right-0 gap-1">
      <Minus v-if="showMin" class="cursor-pointer" title="最小化" @click="minimize()" />
      <Square
        v-if="showMax"
        class="cursor-pointer"
        :title="isMax ? '还原' : '最大化'"
        @click="maximize()"
      />
      <Close
        v-if="showClose"
        class="cursor-pointer hover:bg-red-500 dark:bg-gray-500"
        title="关闭"
        @click="close()"
      />
    </div>
  </div>
</template>

<style scoped lang="css"></style>
