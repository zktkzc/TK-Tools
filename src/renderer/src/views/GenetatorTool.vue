<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const menuList = [
  {
    value: 0,
    label: '随机字符',
    path: '/gen/randomCh'
  },
  {
    value: 1,
    label: 'UUID',
    path: '/gen/uuid'
  }
]
const activeMenu = ref(0)
const router = useRouter()
const handleChange = (value: number): void => {
  const item = menuList.find((item) => item.value === value)
  router.push(item!.path)
}

onMounted(() => {
  handleChange(activeMenu.value)
})
</script>

<template>
  <div class="h-[calc(100vh-96px)] dark:bg-[#242424] flex flex-col items-center justify-center">
    <div class="h-[40px] w-full dark:text-[#bdc6cd] flex items-center px-2">
      <el-radio-group v-model="activeMenu" @change="handleChange">
        <el-radio v-for="item in menuList" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
    <div class="h-full w-full px-2">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-radio) {
  margin-right: 10px;
  --el-radio-text-color: #515a6e;
  --el-radio-input-border-color-hover: #18bc9c;

  @media (prefers-color-scheme: dark) {
    --el-radio-text-color: #bdc6cd;
    --el-radio-input-bg-color: #252525;
  }
}

:deep(.el-radio__inner) {
  @apply dark:border-[#4C4D4F];
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #18bc9c !important;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: transparent;
  border-color: #18bc9c;

  &::after {
    background-color: #18bc9c !important;
    transform: translate(-50%, -50%) scale(2);
  }
}
</style>
