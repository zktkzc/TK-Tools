<script lang="ts" setup>
import Card from '@renderer/components/Card.vue'
</script>

<template>
  <div class="p-2 flex flex-col justify-center gap-2">
    <Card title="差值计算器" class="dark:text-[#AEB9C0]">
      <el-input style="width: 200px" />
      与
      <el-input style="width: 200px" />
      相差
      <el-input type="number" style="width: 200px" />
      <el-select style="width: 100px">
        <el-option>年</el-option>
        <el-option>月</el-option>
        <el-option>周</el-option>
        <el-option>天</el-option>
        <el-option>小时</el-option>
        <el-option>分钟</el-option>
        <el-option>秒</el-option>
      </el-select>
    </Card>
    <Card title="时间操作" class="dark:text-[#AEB9C0]">
      <el-input style="width: 200px" />
      <el-select style="width: 100px">
        <el-option>加</el-option>
        <el-option>减</el-option>
      </el-select>
      <el-input type="number" style="width: 200px" />
      <el-select style="width: 100px">
        <el-option>年</el-option>
        <el-option>月</el-option>
        <el-option>周</el-option>
        <el-option>天</el-option>
        <el-option>小时</el-option>
        <el-option>分钟</el-option>
        <el-option>秒</el-option>
      </el-select>
      后，为
      <el-input style="width: 200px" />
    </Card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select__wrapper) {
  @apply dark:bg-[#252525] shadow-none hover:shadow-none border border-[#DCDFE6] dark:border-[#4C4D4F] hover:border-[#29a745];
}

:deep(.el-select__placeholder) {
  @apply text-[#545C70] dark:text-[#bbc6ce] hover:text-[#29a745];
}

:deep(.el-form-item__label) {
  @apply text-[#545C70] dark:text-[#bbc6ce];
}
</style>
