<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const activeIndex = ref('0')
const menuItems = [
  { index: '0', label: 'JSON工具', path: '/home/json' },
  { index: '1', label: '日期工具', path: '/home/date' },
  { index: '2', label: '哈希工具', path: '/home/hash' },
  { index: '3', label: '生成工具', path: '/home/gen' }
]
const handleSelect = (key: string): void => {
  if (route.query.to) {
    const toPath = route.query.to as string
    activeIndex.value =
      menuItems.find((menu) => {
        return toPath.startsWith(menu.path)
      })?.index || '0'
    router.push(route.query.to as string)
    return
  }

  const item = menuItems.find((i) => i.index === key)
  if (item) router.push(item.path)
}

onMounted(() => {
  handleSelect(activeIndex.value)
})
</script>

<template>
  <main class="h-full w-full bg-white overflow-hidden dark:bg-[#252525]">
    <el-menu
      v-model="activeIndex"
      :default-active="activeIndex"
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
  --el-menu-bg-color: #f7f7f7;
  --el-menu-text-color: #576173;
  --el-menu-hover-bg-color: rgba(226, 239, 235, 0.5);
  --el-menu-hover-text-color: #576173;
  --el-menu-active-color: #29a745;
  --el-menu-border-color: #dcdfe6;

  @media (prefers-color-scheme: dark) {
    --el-menu-bg-color: #333;
    --el-menu-text-color: #bdc6cd;
    --el-menu-hover-bg-color: rgba(15, 173, 142, 0.12);
    --el-menu-hover-text-color: #bdc6cd;
    --el-menu-active-color: #29a745;
    --el-menu-border-color: #4c4d4f;
  }
}
</style>
