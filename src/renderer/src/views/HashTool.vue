<script lang="ts" setup>
import { Down } from '@icon-park/vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import { sm3 } from 'sm-crypto-v2'
import { ElMessage } from 'element-plus'

const activeType = ref<string>('text')
const originValue = ref<string>('')
const md5Value = ref<string>('')
const sha1Value = ref<string>('')
const sha256Value = ref<string>('')
const sha512Value = ref<string>('')
const sm3Value = ref<string>('')
const handleCommand = (type: string): void => {
  activeType.value = type
}

const handleInput = async (value: string): Promise<void> => {
  if (value === '') {
    md5Value.value = ''
    sha1Value.value = ''
    sha256Value.value = ''
    sha512Value.value = ''
    sm3Value.value = ''
    return
  }
  const { md5, sha1, sha256, sha512 } = await window.api.calculateHash(value)
  md5Value.value = md5
  sha1Value.value = sha1
  sha256Value.value = sha256
  sha512Value.value = sha512
  sm3Value.value = sm3(value)
}

const copy = (value: string): void => {
  if (value === '') return
  navigator.clipboard.writeText(value)
  ElMessage.success({ message: '复制成功', grouping: true, customClass: 'success' })
}

onMounted(() => {
  window.api.onClear(() => {
    originValue.value = ''
    handleInput('')
  })
})

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('clear')
})
</script>

<template>
  <div
    class="w-[calc(100wh-10px)] h-[calc(100vh-105px)] m-2 grid grid-rows-5 grid-cols-2 gap-2 dark:bg-[#252525]"
  >
    <div class="h-full col-1 row-span-full">
      <div v-if="activeType === 'text'" class="h-full relative">
        <el-input
          v-model="originValue"
          type="textarea"
          placeholder="请输入文本..."
          resize="none"
          class="h-full"
          @input="handleInput"
        />
        <div class="flex flex-wrap items-center absolute top-1 right-1 dropdown">
          <el-dropdown trigger="click" popper-class="custom-dropdown" @command="handleCommand">
            <el-button plain size="small">
              文本
              <down class="pl-1" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="text">文本</el-dropdown-item>
                <el-dropdown-item command="file">文件</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div v-else>
        <div>文件</div>
      </div>
    </div>
    <div class="h-full col-2 row-1 relative">
      <el-input
        v-model="md5Value"
        type="textarea"
        placeholder="md5"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button
        type="primary"
        size="small"
        class="absolute bottom-1 right-1"
        @click="copy(md5Value)"
      >
        md5
      </el-button>
    </div>
    <div class="h-full col-2 row-2 relative">
      <el-input
        v-model="sha1Value"
        type="textarea"
        placeholder="sha1"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button
        type="primary"
        size="small"
        class="absolute bottom-1 right-1"
        @click="copy(sha1Value)"
      >
        sha1
      </el-button>
    </div>
    <div class="h-full col-2 row-3 relative">
      <el-input
        v-model="sha256Value"
        type="textarea"
        placeholder="sha256"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button
        type="primary"
        size="small"
        class="absolute bottom-1 right-1"
        @click="copy(sha256Value)"
      >
        sha256
      </el-button>
    </div>
    <div class="h-full col-2 row-4 relative">
      <el-input
        v-model="sha512Value"
        type="textarea"
        placeholder="sha512"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button
        type="primary"
        size="small"
        class="absolute bottom-1 right-1"
        @click="copy(sha512Value)"
      >
        sha512
      </el-button>
    </div>
    <div class="h-full col-2 row-5 relative">
      <el-input
        v-model="sm3Value"
        type="textarea"
        placeholder="sm3"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button
        type="primary"
        size="small"
        class="absolute bottom-1 right-1"
        @click="copy(sm3Value)"
      >
        sm3
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-textarea) {
  --el-input-placeholder-color: #a8abb2;
}

:deep(.el-textarea__inner) {
  height: 100%;
  @apply text-xs dark:bg-[#212123] dark:text-slate-300;
  box-shadow: none !important;
  outline: #dcdfe6 solid 1px;

  @media (prefers-color-scheme: dark) {
    outline: #4c4d4f solid 1px;
  }

  &:focus {
    box-shadow: none !important;
    outline: #29a745 solid 1px;

    @media (prefers-color-scheme: dark) {
      outline: #29a745 solid 1px;
    }
  }
}

.disable {
  :deep(.el-textarea__inner) {
    @apply cursor-default;

    &:focus {
      outline: #dcdfe6 solid 1px !important;

      @media (prefers-color-scheme: dark) {
        outline: #4c4d4f solid 1px !important;
      }
    }
  }
}

:deep(.el-button) {
  @apply text-xs font-normal;
}

:deep(.el-button--primary) {
  --el-button-bg-color: #29a745;
  --el-button-border-color: #29a745;
  --el-button-hover-bg-color: #23923d;
  --el-button-hover-border-color: #23923d;
}

.dropdown {
  :deep(.el-button) {
    @apply bg-transparent font-normal dark:text-[#B7C3CB] dark:border-[#4c4d4f];
    --el-button-hover-border-color: #29a745;
    --el-button-hover-text-color: #29a745;
    &:hover {
      border-color: #29a745 !important;
      color: #29a745 !important;
    }
  }
}
</style>
