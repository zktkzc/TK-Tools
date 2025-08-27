<script lang="ts" setup>
import { Down } from '@icon-park/vue-next'
import { ref } from 'vue'

const activeType = ref<string>('text')
const handleCommand = (type: string): void => {
  activeType.value = type
}
</script>

<template>
  <div
    class="w-[calc(100wh-10px)] h-[calc(100vh-105px)] m-2 grid grid-rows-5 grid-cols-2 gap-2 dark:bg-[#252525]"
  >
    <div class="h-full col-1 row-span-full">
      <div v-if="activeType === 'text'" class="h-full relative">
        <el-input
          type="textarea"
          placeholder="请输入文本..."
          resize="none"
          autofocus
          class="h-full"
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
      <div v-else></div>
    </div>
    <div class="h-full col-2 row-1 relative">
      <el-input type="textarea" placeholder="md5" resize="none" readonly class="h-full disable" />
      <el-button type="primary" size="small" class="absolute bottom-1 right-1">md5</el-button>
    </div>
    <div class="h-full col-2 row-2 relative">
      <el-input type="textarea" placeholder="sha1" resize="none" readonly class="h-full disable" />
      <el-button type="primary" size="small" class="absolute bottom-1 right-1">sha1</el-button>
    </div>
    <div class="h-full col-2 row-3 relative">
      <el-input
        type="textarea"
        placeholder="sha256"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button type="primary" size="small" class="absolute bottom-1 right-1">sha256</el-button>
    </div>
    <div class="h-full col-2 row-4 relative">
      <el-input
        type="textarea"
        placeholder="sha512"
        resize="none"
        readonly
        class="h-full disable"
      />
      <el-button type="primary" size="small" class="absolute bottom-1 right-1">sha512</el-button>
    </div>
    <div class="h-full col-2 row-5 relative">
      <el-input type="textarea" placeholder="sm3" resize="none" readonly class="h-full disable" />
      <el-button type="primary" size="small" class="absolute bottom-1 right-1">sm3</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-textarea__inner) {
  height: 100%;
  outline: #4c4d4f solid 1px;
  box-shadow: none !important;
  @apply text-xs;

  &:focus {
    box-shadow: none !important;
    outline: #18bc9c solid 1px;
  }

  @media (prefers-color-scheme: dark) {
    @apply bg-[#212123] text-slate-300;
  }
}

.disable {
  :deep(.el-textarea__inner) {
    @apply cursor-default;

    &:focus {
      outline: #4c4d4f solid 1px !important;
    }
  }
}

:deep(.el-button) {
  @apply text-xs font-normal;
}

:deep(.el-button--primary) {
  --el-button-bg-color: #18bc9c;
  --el-button-border-color: #18bc9c;
  --el-button-hover-bg-color: #6ebfa8;
  --el-button-hover-border-color: #6ebfa8;
}

.dropdown {
  :deep(.el-button) {
    @apply bg-transparent font-normal dark:text-[#B7C3CB] dark:border-[#4c4d4f];
  }
}
</style>
