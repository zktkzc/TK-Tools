<script lang="ts" setup>
import { ref } from 'vue'
import CodeMirror from 'vue-codemirror6'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { useSystemThemeStore } from '@renderer/store/useSystemThemeStore'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps({
  code: {
    type: String,
    default: ''
  }
})

const { getSystemThemeMode } = useSystemThemeStore()
const value = ref('{"name": "John", "age": 30, "city": "New York"}')
</script>

<template>
  <code-mirror
    id="editor"
    v-model="value"
    :lang="json()"
    :linter="jsonParseLinter()"
    basic
    :dark="getSystemThemeMode() === 'dark'"
    :gutter="true"
    class="h-full"
    :extensions="[oneDark]"
  />
</template>

<style lang="scss" scoped>
:deep(.cm-editor) {
  height: 100%;
}
</style>
