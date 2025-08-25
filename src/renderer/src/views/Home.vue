<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleSelect = (key: string, keyPath: string[]): void => {
  if (key === '0') {
    router.push('/json')
  }
}
</script>

<template>
  <main class="h-[calc(100vh-60px)] w-full">
    <el-menu mode="horizontal" @select="handleSelect">
      <el-menu-item index="0">JSON工具</el-menu-item>
      <el-menu-item index="1">日期工具</el-menu-item>
      <el-menu-item index="2">随机数工具</el-menu-item>
      <el-menu-item index="3">哈希工具</el-menu-item>
    </el-menu>
    <router-view />
  </main>
</template>

<style lang="scss" scoped>
:deep(.el-menu--horizontal) {
  --el-menu-horizontal-height: 30px;
}
</style>
