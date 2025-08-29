<script lang="ts" setup>
import { ref } from 'vue'
import { Refresh, Setting } from '@icon-park/vue-next'
import { useSystemThemeStore } from '@renderer/store/useSystemThemeStore'
import CharactersSettingDialog from '@renderer/components/CharactersSettingDialog.vue'

const result = ref<string>('')
const length = ref<number>(32)
const count = ref<number>(1)
const characters = ref<string>('')
const showDialog = ref<boolean>(false)
const { getSystemThemeMode } = useSystemThemeStore()
const handleChange = (result: string): void => {
  characters.value = result
}

const handleSubmit = (value: string): void => {
  characters.value = value
  showDialog.value = false
}
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center gap-2">
    <div class="w-full h-full flex-1">
      <el-input v-model="result" type="textarea" resize="none" class="h-full" />
    </div>
    <div
      class="h-[42px] w-full border dark:border-[#4c4d4f] flex items-center justify-center rounded-md"
    >
      <div class="w-[60%] flex items-center justify-center gap-1">
        <div class="flex w-[60%] h-full items-center">
          <el-input v-model="characters" class="flex-1" readonly />
          <el-button class="w-[32px]" @click="showDialog = true">
            <el-tooltip content="设置" placement="top" :effect="getSystemThemeMode()">
              <setting theme="outline" size="18" />
            </el-tooltip>
          </el-button>
        </div>
        <div class="w-[40%]">
          <el-input v-model="length" type="number" class="length-input">
            <template #prepend>长度</template>
          </el-input>
        </div>
        <div class="w-[40%]">
          <el-input v-model="count" type="number" class="count-input">
            <template #prepend>数量</template>
          </el-input>
        </div>
        <el-button class="w-[32px]">
          <refresh theme="outline" size="18" />
        </el-button>
      </div>
    </div>
  </div>
  <characters-setting-dialog
    :show-dialog="showDialog"
    @close-dialog="showDialog = false"
    @check-change="handleChange"
    @submit="handleSubmit"
  />
</template>

<style lang="scss" scoped>
:deep(.el-textarea__inner) {
  height: 100%;
  outline: #4c4d4f solid 1px;
  box-shadow: none !important;
  @apply dark:bg-[#212123] dark:text-[#BDC6CD];

  &:focus {
    box-shadow: none !important;
  }
}

:deep(.el-input__inner) {
  @apply dark:text-[#BDC6CD];
}

:deep(.el-input__wrapper) {
  @apply dark:bg-[#202124] border dark:border-[#4C4D4F];
  box-shadow: none !important;
}

:deep(.el-input-group__prepend) {
  @apply dark:bg-[#333] border dark:border-[#4C4D4F] dark:text-[#919398];
  box-shadow: none !important;
  user-select: none;
}

:deep(.el-button) {
  @media (prefers-color-scheme: dark) {
    --el-button-bg-color: #202124;
    --el-button-border-color: #4c4d4f;
    --el-button-hover-bg-color: #202124;
    --el-button-hover-border-color: #18bc9c;
    --el-button-hover-text-color: #18bc9c;
    --el-button-active-border-color: #18bc9c;
  }
}
</style>
