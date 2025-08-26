<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleSelect = (key: string, keyPath: string[]): void => {
  if (key === '0') {
    router.push('/json')
  } else if (key === '1') {
    router.push('/date')
  } else if (key === '2') {
    router.push('/hash')
  } else if (key === '3') {
    router.push('/gen')
  }
}
</script>

<template>
  <main class="h-[calc(100vh-60px)] w-full bg-white">
    <el-menu class="" style="user-select: none" mode="horizontal" @select="handleSelect">
      <el-menu-item index="0">JSON工具</el-menu-item>
      <el-menu-item index="1">日期工具</el-menu-item>
      <el-menu-item index="2">哈希工具</el-menu-item>
      <el-menu-item index="3">生成</el-menu-item>
    </el-menu>
    <router-view />
  </main>
</template>

<style lang="scss" scoped>
:deep(.el-menu--horizontal) {
  --el-menu-horizontal-height: 30px;
}

:deep(.el-menu) {
  @apply bg-[#333];
}

:deep(.el-menu-item) {
  @media (prefers-color-scheme: dark) {
    color: #bdc6cd;
    &:hover {
      color: #bdc6cd !important;
      background-color: rgba(15, 173, 142, 0.12) !important;
    }
  }
}
</style>
