<script lang="ts" setup>
import { CheckOne, Down, UploadOne } from '@icon-park/vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { sm3 } from 'sm-crypto-v2'
import { ElMessage } from 'element-plus'
import { HashToolDataType } from '../../../types'
import { useDataStore } from '@renderer/store/useDataStore'

const activeType = ref<string>('text')
const originValue = ref<string>('')
const md5Value = ref<string>('')
const sha1Value = ref<string>('')
const sha256Value = ref<string>('')
const sha512Value = ref<string>('')
const sm3Value = ref<string>('')
const { getData, setData } = useDataStore()

const menuList = [
  { command: 'text', label: '文本' },
  { command: 'file', label: '文件' }
]
const activeMenu = computed(() => {
  return menuList.find((menu) => menu.command === activeType.value)
})

const handleCommand = (type: string): void => {
  activeType.value = type
  calculateSm3ForFile('')

  if (type === 'text') {
    file.value = ''
    initData()
  }
}

const handleInput = async (value: string): Promise<void> => {
  if (!value || value === '') {
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

  setData('hash_tool', {
    time: new Date().getTime(),
    data: { originValue: value }
  } as HashToolDataType)
}

const copy = (value: string): void => {
  if (value === '') return
  navigator.clipboard.writeText(value)
  ElMessage.success({ message: '复制成功', grouping: true, customClass: 'success' })
}

const calculateSm3ForFile = (filePath: string) => {
  if (filePath === '') {
    md5Value.value = ''
    sha1Value.value = ''
    sha256Value.value = ''
    sha512Value.value = ''
    sm3Value.value = ''
    return
  }

  window.api
    .readFile(filePath)
    .then((data: any) => {
      sm3Value.value = sm3(data)
    })
    .catch((err) => {
      ElMessage.error({
        message: `读取文件失败: ${err.message}`,
        grouping: true,
        customClass: 'error'
      })
    })
}

const file = ref('')
const selectFile = async () => {
  const { canceled, filePaths } = await window.api.selectFile()
  if (canceled) return
  window.api
    .calculateFileHash(filePaths[0])
    .then((data: any) => {
      const { md5, sha1, sha256, sha512 } = data
      md5Value.value = md5
      sha1Value.value = sha1
      sha256Value.value = sha256
      sha512Value.value = sha512
      calculateSm3ForFile(filePaths[0])

      if (window.electron.process.platform === 'win32') {
        file.value = filePaths[0].substring(filePaths[0].indexOf('\\') + 1)
      } else {
        file.value = filePaths[0].substring(filePaths[0].lastIndexOf('/') + 1)
      }
    })
    .catch((error: Error) => {
      ElMessage.error({
        message: `计算失败: ${error.message}`,
        customClass: 'error',
        grouping: true
      })
    })
}

const initData = () => {
  const data = getData('hash_tool') as HashToolDataType
  originValue.value = data.data?.originValue
  handleInput(originValue.value)
}

onMounted(() => {
  initData()

  window.api.onClear(() => {
    originValue.value = ''
    handleInput('')

    setData('hash_tool', {
      time: new Date().getTime(),
      data: { originValue: originValue.value }
    } as HashToolDataType)
  })
})

onUnmounted(() => {
  setData('hash_tool', {
    time: new Date().getTime(),
    data: { originValue: originValue.value }
  } as HashToolDataType)

  window.electron.ipcRenderer.removeAllListeners('clear')
})
</script>

<template>
  <div
    class="w-[calc(100wh-10px)] h-[calc(100vh-105px)] m-2 grid grid-rows-5 grid-cols-2 gap-2 dark:bg-[#252525]"
  >
    <div class="h-full col-1 row-span-full relative">
      <div v-if="activeType === 'text'" class="h-full">
        <el-input
          v-model="originValue"
          type="textarea"
          placeholder="请输入文本..."
          resize="none"
          class="h-full"
          @input="handleInput"
        />
      </div>
      <div
        v-else
        class="h-full w-full border dark:border-[#4C4D4F] border-[#DCDFE6] hover:border-[#29a745] rounded-md"
      >
        <div class="h-full w-full flex flex-col items-center justify-center">
          <el-button class="upload-btn" @click="selectFile">
            <template #icon>
              <upload-one />
            </template>
            上传文件
          </el-button>
          <div
            v-if="file && file !== ''"
            class="flex items-center gap-1 text-xs mt-2 text-[#A8ABB2] dark:text-[#8C9095]"
          >
            <check-one theme="filled" />
            {{ file }}
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center absolute top-1 right-1 dropdown">
        <el-dropdown trigger="click" popper-class="custom-dropdown" @command="handleCommand">
          <el-button plain size="small">
            {{ activeMenu?.label }}
            <down class="pl-1" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="menu in menuList"
                :key="menu.command"
                :command="menu.command"
              >
                {{ menu.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
  --el-button-active-bg-color: #23923d;
  --el-button-active-border-color: #23923d;
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

:deep(.el-button) {
  &.upload-btn {
    --el-button-text-color: #fff;
    --el-button-bg-color: #29a745;
    --el-button-border-color: #29a745;
    --el-button-hover-text-color: #fff;
    --el-button-hover-bg-color: #23923d;
    --el-button-hover-border-color: #23923d;
    --el-button-active-bg-color: #23923d;
    --el-button-active-border-color: #23923d;
  }
}
</style>
