<script lang="ts" setup>
import { ref } from 'vue'

const tableData = ref([
  {
    type: '标准时间(秒)',
    value: new Date()
  },
  {
    type: 'Unix时间戳(秒)',
    value: new Date().getTime().toString()
  },
  {
    type: '标准时间(毫秒)',
    value: new Date().getTime()
  },
  {
    type: 'Unix时间戳(毫秒)',
    value: new Date().getTime()
  }
])
</script>

<template>
  <div class="h-full w-full p-2 flex flex-col space-y-2">
    <el-input>
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
    <el-table :data="tableData" stripe>
      <el-table-column prop="type" label="格式" />
      <el-table-column prop="value" label="值" />
      <el-table-column label="操作">
        <el-button>加载</el-button>
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
</style>
