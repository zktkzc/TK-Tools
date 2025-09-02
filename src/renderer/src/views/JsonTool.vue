<script setup lang="ts">
import { jsonrepair } from 'jsonrepair'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Editor from '@renderer/components/Editor.vue'
import { Down } from '@icon-park/vue-next'
import { format } from 'prettier/standalone'
import babel from 'prettier/plugins/babel'
import estree from 'prettier/plugins/estree'

const jsonStr = ref()
const result = ref()

const validate = (): Promise<string> => {
  return format(jsonStr.value, {
    parser: 'json5',
    plugins: [babel, estree],
    quoteProps: 'preserve',
    trailingComma: 'none',
    tabWidth: Number(activeDropItem.value.command),
    printWidth: 1
  })
}

const beautify = (): void => {
  validate()
    .catch((e: SyntaxError) => {
      console.error(e.message)
      ElMessage.error({
        message: e.message,
        grouping: true,
        customClass: 'syntax-error'
      })
    })
    .then((value: string | void) => {
      console.log(value)
      result.value = value
      // result.value = JSON.stringify(jsonStr.value, null, 4)
    })
}

const repair = (): void => {
  try {
    if (!jsonStr.value || jsonStr.value.trim() === '') {
      ElMessage.error({ message: '请输入JSON字符串', grouping: true })
      return
    }

    jsonStr.value = jsonrepair(jsonStr.value)
    ElMessage.success({ message: '已自动修复语法错误', grouping: true })
  } catch (e) {
    ElMessage.error({ message: `修复失败: ${(e as Error).message}`, grouping: true })
  }
}

const minimal = (): void => {}

const dropDownItems = [
  { command: '0', label: '无缩进' },
  { command: '2', label: '缩进空格 2' },
  { command: '4', label: '缩进空格 4' },
  { command: '6', label: '缩进空格 6' },
  { command: '8', label: '缩进空格 8' }
]
const activeDropItem = ref<{ command: string; label: string }>(dropDownItems[0])
const handleCommand = (command: string): void => {
  activeDropItem.value = dropDownItems.find((item) => item.command === command)!
}
</script>

<template>
  <div class="m-2 flex flex-col justify-between gap-1 dark:bg-[#252525]">
    <div class="grid grid-flow-row grid-cols-2 h-[calc(100vh-145px)] gap-2">
      <div class="h-full border border-[#DDDFE5] dark:border-[#4C4D4F] rounded-md p-[1px]">
        <Editor v-model:code="jsonStr" lang="json" />
      </div>
      <div class="h-full border border-[#DDDFE5] dark:border-[#4C4D4F] rounded-md p-[1px]">
        <Editor v-model:code="result" lang="json" />
      </div>
    </div>
    <div class="h-[40px] flex items-center px-2 gap-2">
      <el-dropdown
        trigger="click"
        class="dropdown"
        popper-class="custom-dropdown"
        @command="handleCommand"
      >
        <el-button plain>
          {{ activeDropItem.label }}
          <down class="pl-1" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in dropDownItems"
              :key="item.command"
              :command="item.command"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button type="primary" @click="beautify">格式化</el-button>
      <el-button type="primary" @click="repair">JSON修复</el-button>
      <el-button type="primary" @click="minimal">压缩</el-button>
      <el-button type="primary" @click="minimal">转义</el-button>
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
  --el-button-bg-color: #252525;
  --el-button-border-color: #4c4d4f;
  --el-button-text-color: #bbc6ce;
  --el-button-hover-bg-color: #252525;
  --el-button-hover-border-color: #23923d;
  --el-button-hover-text-color: #23923d;
  --el-button-active-bg-color: #252525;
  --el-button-active-border-color: #23923d;
}

.el-button + .el-button {
  margin-left: 0;
}

.dropdown {
  :deep(.el-button) {
    @apply bg-transparent font-normal dark:text-[#B7C3CB] dark:border-[#4c4d4f];
    height: 32px !important;

    --el-button-bg-color: #252525;
    --el-button-border-color: #4c4d4f;
    --el-button-text-color: #bbc6ce;
    --el-button-hover-bg-color: #252525;
    --el-button-hover-border-color: #23923d;
    --el-button-hover-text-color: #23923d;
    --el-button-active-bg-color: #252525;
    --el-button-active-border-color: #23923d;
    &:hover {
      border-color: #29a745 !important;
      color: #29a745 !important;
    }
  }
}
</style>
