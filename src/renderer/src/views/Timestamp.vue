<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const padZero = (num: number) => {
  return num.toString().padStart(2, '0')
}

const padMilliseconds = (ms: number) => {
  return ms.toString().padStart(3, '0')
}

const getStandardTimeSeconds = (now: Date) => {
  const year = now.getFullYear()
  const month = padZero(now.getMonth() + 1) // 月份从0开始，所以要+1
  const day = padZero(now.getDate())
  const hours = padZero(now.getHours())
  const minutes = padZero(now.getMinutes())
  const seconds = padZero(now.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const getUnixTimestampSeconds = (now: Date) => {
  return Math.floor(now.getTime() / 1000)
}

const getStandardTimeMilliseconds = (now: Date) => {
  const milliseconds = padMilliseconds(now.getMilliseconds())
  return `${getStandardTimeSeconds(now)}.${milliseconds}`
}

const getUnixTimestampMilliseconds = (now: Date) => {
  return now.getTime()
}

const tableData = ref<{ type: string; value: string | number }[]>([
  {
    type: '标准时间(秒)',
    value: getStandardTimeSeconds(new Date())
  },
  {
    type: 'Unix时间戳(秒)',
    value: getUnixTimestampSeconds(new Date())
  },
  {
    type: '标准时间(毫秒)',
    value: getStandardTimeMilliseconds(new Date())
  },
  {
    type: 'Unix时间戳(毫秒)',
    value: getUnixTimestampMilliseconds(new Date())
  }
])

const updateAllTimestamps = () => {
  tableData.value = tableData.value.map((row) => {
    const now = new Date() // 获取当前时间
    let newValue: string | number = ''
    // 根据不同的类型设置新的值
    switch (row.type) {
      case '标准时间(秒)':
        newValue = getStandardTimeSeconds(now)
        break
      case 'Unix时间戳(秒)':
        newValue = getUnixTimestampSeconds(now)
        break
      case '标准时间(毫秒)':
        newValue = getStandardTimeMilliseconds(now)
        break
      case 'Unix时间戳(毫秒)': // 毫秒级时间戳和标准时间毫秒显示都用 getTime()
        newValue = getUnixTimestampMilliseconds(now)
        break
      default:
        newValue = row.value // 默认保持不变（虽然应该不会执行到）
    }
    // 返回新的对象，确保响应式更新。如果只修改原对象的属性，可能更新不生效。
    return {
      ...row,
      value: newValue
    }
  })
}

// 声明一个变量来存储定时器 ID，用于清除
let intervalId: any = null

// 在组件挂载后启动定时器
onMounted(() => {
  // 每隔 1000 毫秒（1秒）更新一次时间
  intervalId = setInterval(updateAllTimestamps, 100)
})

// 在组件卸载前清除定时器，防止内存泄漏
onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
const timestampStr = ref('')

const copy = (value: string) => {
  navigator.clipboard.writeText(value)
  ElMessage.success({ message: '复制成功', grouping: true, customClass: 'success' })
}
</script>

<template>
  <div class="h-full w-full p-2 flex flex-col space-y-2">
    <el-input v-model="timestampStr">
      <template #prepend>时间戳</template>
    </el-input>
    <el-input readonly>
      <template #prepend>秒</template>
    </el-input>
    <div class="flex space-x-2">
      <el-input readonly>
        <template #prepend>毫秒</template>
      </el-input>
      <el-input readonly>
        <template #prepend>纳秒</template>
      </el-input>
    </div>
    <el-table :data="tableData" stripe style="user-select: none">
      <el-table-column prop="type" label="格式" />
      <el-table-column prop="value" label="值" class-name="table-value">
        <template #default="scope">
          <span @click="copy(scope.row.value)">
            {{ scope.row.value }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <el-button type="primary" size="small">加载</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
// 表头
:deep(.el-table__header-wrapper th) {
  background-color: #333;
  color: #bdc6cd;
  font-weight: bold;
  border: none !important;
}

// 斑马条纹样式（需配合 stripe 属性）
:deep(.el-table__row--striped td) {
  background-color: #333 !important;
}

// 表体
:deep(.el-table__body tr > td) {
  background-color: #282929;
  color: #bdc6cd;
}

// 行 hover 效果
:deep(.el-table__body tr:hover > td) {
  background-color: #2a3531 !important;
}

:deep(.el-table) {
  td {
    border: none;
  }
}

:deep(.el-table__inner-wrapper::before) {
  height: 0 !important;
}

:deep(.el-table__body .table-value) {
  @media (prefers-color-scheme: dark) {
    &:hover {
      color: #29a745 !important;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

:deep(.el-button--primary) {
  --el-button-bg-color: #252525;
  --el-button-border-color: #4c4d4f;
  --el-button-text-color: #bbc6ce;
  --el-button-hover-bg-color: #252525;
  --el-button-hover-border-color: #23923d;
  --el-button-hover-text-color: #23923d;
  --el-button-active-bg-color: #252525;
  --el-button-active-border-color: #23923d;
}
</style>
