<script setup lang="ts">
import { jsonrepair } from 'jsonrepair'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Editor from '@renderer/components/Editor.vue'

const jsonStr = ref()
const result = ref()

const format = (): void => {
  try {
    result.value = JSON.stringify(jsonStr.value, null, 4)
  } catch (e) {
    const error = e as SyntaxError
    ElMessage.error(`❌ ${error.message || '未知错误'}`)
  }
}

const repair = (): void => {
  try {
    jsonStr.value = jsonrepair(jsonStr.value)
    ElMessage.success('已自动修复语法错误')
  } catch (e) {
    ElMessage.error(`修复失败: ${(e as Error).message}`)
  }
}
</script>

<template>
  <div class="m-2 flex flex-col justify-between gap-1 dark:bg-[#252525]">
    <div class="grid grid-flow-row grid-cols-2 h-[calc(100vh-145px)] gap-2">
      <div class="h-full border border-[#DDDFE5] dark:border-[#4C4D4F] rounded-md p-[1px]">
        <Editor :code="jsonStr" lang="json" />
      </div>
      <div class="h-full border border-[#DDDFE5] dark:border-[#4C4D4F] rounded-md p-[1px]">
        <Editor :code="result" lang="json" />
      </div>
    </div>
    <div class="h-[40px] flex items-center px-2">
      <el-button type="primary" @click="format">格式化</el-button>
      <el-button type="primary" @click="repair">JSON修复</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-textarea__inner) {
  height: 100%;
  outline: #29a745 solid 1px;
  box-shadow: none !important;
  @apply rounded-md;

  &:focus {
    box-shadow: none !important;
  }

  @media (prefers-color-scheme: dark) {
    @apply bg-[#212123] text-slate-300;
  }
}

:deep(.el-button--primary) {
  --el-button-bg-color: #29a745;
  --el-button-border-color: #29a745;
  --el-button-hover-bg-color: #23923d;
  --el-button-hover-border-color: #23923d;
}

:deep(.jv-container) {
  @media (prefers-color-scheme: dark) {
    @apply border-[#166E56FF];
  }
}
</style>
