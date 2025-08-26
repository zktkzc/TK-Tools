<script setup lang="ts">
import { jsonrepair } from 'jsonrepair'
import { ref } from 'vue'
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/vue3-json-viewer.css'
import { ElMessage } from 'element-plus'

const jsonStr = ref()
const jsonData = ref()

const format = (): void => {
  try {
    jsonData.value = JSON.parse(jsonStr.value)
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
  <div class="flex-1 m-2 flex flex-col justify-between gap-1">
    <div class="grid grid-flow-row grid-cols-2 h-[350px] gap-1">
      <el-input v-model="jsonStr" type="textarea" autofocus resize="none" />
      <json-viewer :value="jsonData" copyable class="h-full overflow-auto border" />
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
  outline: #18bc9c solid 1px;
  box-shadow: none !important;

  &:focus {
    box-shadow: none !important;
  }
}

:deep(.el-button--primary) {
  --el-button-bg-color: #18bc9c;
  --el-button-border-color: #18bc9c;
  --el-button-hover-bg-color: #6ebfa8;
  --el-button-hover-border-color: #6ebfa8;
}
</style>
