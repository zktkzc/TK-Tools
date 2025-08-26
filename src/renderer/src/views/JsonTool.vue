<script setup lang="ts">
import { jsonrepair } from 'jsonrepair'
import { ref } from 'vue'
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/vue3-json-viewer.css'

let obj = {
  name: 'qiu',
  age: 18,
  isMan: false,
  date: new Date(),
  fn: () => {},
  arr: [1, 2, 5],
  reg: /ab+c/i,
  sex: 1,
  hobby: ['足球', '篮球', '羽毛球', '网球']
}
const jsonData = ref(obj)
</script>

<template>
  <div class="flex-1 m-2 flex flex-col justify-between gap-1 bg-green-500">
    <div class="grid grid-flow-row grid-cols-2">
      <el-input type="textarea" autofocus resize="none" />
      <json-viewer :value="jsonData" copyable class="h-full" />
    </div>
    <div class="h-[40px] flex items-center px-2">
      <el-button type="primary">格式化</el-button>
      <el-button type="primary">JSON修复</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
