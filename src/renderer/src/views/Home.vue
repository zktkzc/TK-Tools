<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const activeIndex = ref('0')
const menuItems = [
  { index: '0', label: 'JSON工具', path: '/json' },
  { index: '1', label: '日期工具', path: '/date' },
  { index: '2', label: '哈希工具', path: '/hash' },
  { index: '3', label: '生成工具', path: '/gen' }
]
const handleSelect = (key: string): void => {
  const item = menuItems.find((i) => i.index === key)
  if (item) router.push(item.path)
}

onMounted(() => {
  handleSelect(activeIndex.value)
})
</script>

<template>
  <main class="h-[calc(100vh-60px)] w-full bg-white overflow-hidden">
    <el-menu
      v-model="activeIndex"
      class=""
      style="user-select: none"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.index"
        :index="item.index"
        class="cursor-pointer"
      >
        {{ item.label }}
      </el-menu-item>
    </el-menu>
    <router-view />
  </main>
</template>

<style lang="scss" scoped>
:deep(.el-menu--horizontal) {
  --el-menu-horizontal-height: 30px;
  @media (prefers-color-scheme: dark) {
    --el-menu-bg-color: #333;
    --el-menu-text-color: #bdc6cd;
    --el-menu-hover-bg-color: rgba(15, 173, 142, 0.12);
    --el-menu-hover-text-color: #bdc6cd;
    --el-menu-active-color: #18bc9c;
  }
}
</style>
