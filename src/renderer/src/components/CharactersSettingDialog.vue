<script setup lang="ts">
import { Close } from '@icon-park/vue-next'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  }
})

const inputValue = ref('')
const checkList = ref(['number', 'slow', 'up'])
const emit = defineEmits(['close-dialog', 'check-change', 'submit'])
const closeDialog = (): void => {
  emit('close-dialog')
}
const reset = (): void => {
  checkList.value = ['number', 'slow', 'up']
  checkChange()
}
const handleChange = (): void => {
  emit('check-change', checkList.value)
}
const submit = (): void => {
  emit('submit', inputValue.value)
}

const checkChange = (): void => {
  if (checkList.value.length < 1 && inputValue.value.trim().length === 0) {
    ElMessage.error('请至少选择一样预设或手动输入字符')
    return
  }

  inputValue.value = ''
  if (checkList.value.includes('number')) {
    inputValue.value = inputValue.value.concat('0123456789')
  }
  if (checkList.value.includes('slow')) {
    inputValue.value = inputValue.value.concat('abcdefghijklmnopqrstuvwxyz')
  }
  if (checkList.value.includes('up')) {
    inputValue.value = inputValue.value.concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }
  if (checkList.value.includes('special')) {
    inputValue.value = inputValue.value.concat("`~!@#$%^&*()-_=+[{]}|;:',<.>/?")
  }
}

onMounted(() => {
  handleChange()
  checkChange()
})
</script>

<template>
  <el-dialog :model-value="showDialog" :show-close="false" class="my-dialog" @close="closeDialog">
    <template #header>
      <div
        class="h-[50px] flex items-center justify-between p-4 text-lg dark:bg-[#333] dark:text-[#BBC6CE] rounded-tl-md rounded-tr-md"
        style="user-select: none"
      >
        设置字符
        <close
          theme="outline"
          size="12"
          :stroke-width="10"
          class="cursor-pointer dark:text-[#555B62] dark:hover:text-[#73828C]"
          @click="closeDialog"
        />
      </div>
    </template>
    <template #default>
      <div class="p-2 flex flex-col gap-2 dark:bg-[#252525]">
        <el-input v-model="inputValue" type="textarea" resize="none" />
        <div class="w-full h-auto flex flex-wrap items-center justify-center gap-2">
          <el-checkbox-group v-model="checkList" @change="checkChange">
            <el-checkbox label="数字" size="small" value="number"></el-checkbox>
            <el-checkbox label="小写字母" size="small" value="slow"></el-checkbox>
            <el-checkbox label="大写字母" size="small" value="up"></el-checkbox>
            <el-checkbox label="特殊符号" size="small" value="special"></el-checkbox>
          </el-checkbox-group>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center p-2 dark:bg-[#333] rounded-bl-md rounded-br-md">
        <el-button class="w-full setting-button" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-textarea__inner) {
  height: 100%;
  outline: #4c4d4f solid 1px;
  box-shadow: none !important;
  @apply dark:bg-[#212123] dark:text-[#BDC6CD];

  &:focus {
    box-shadow: none !important;
    border: 1px solid #18bc9c;
  }
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

.el-button.setting-button {
  @media (prefers-color-scheme: dark) {
    --el-button-bg-color: #18bc9c;
    --el-button-text-color: #fff;
    --el-button-border-color: #18bc9c;
    --el-button-hover-bg-color: #48c9b0;
    --el-button-hover-border-color: #18bc9c;
    --el-button-hover-text-color: #fff;
    --el-button-active-border-color: #18bc9c;
  }
}

:deep(.el-checkbox) {
  @apply border dark:border-[#4C4D4F] dark:text-[#BBC6CE] dark:hover:border-[#18bc9c] dark:hover:text-[#18bc9c]
  m-0 px-2 rounded-md cursor-pointer;
}
</style>
