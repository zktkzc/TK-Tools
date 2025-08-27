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
const handleChange = (value): void => {
  const item = menuList.find((item) => item.value === value)
  router.push(item!.path)
}

onMounted(() => {
  handleChange(activeMenu.value)
})
</script>

<template>
  <div>
    <div>
      <el-radio-group v-model="activeMenu" @change="handleChange">
        <el-radio v-for="item in menuList" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
    <router-view />
  </div>
</template>
