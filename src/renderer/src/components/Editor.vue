<script lang="ts" setup>
import { computed, ref } from 'vue'
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

const extentsions = computed(() => {
  return [getSystemThemeMode() === 'dark' ? oneDark : []]
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
    :extensions="extentsions"
  />
</template>

<style lang="scss" scoped>
:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-editor.cm-focused) {
  outline: none;
}

:deep(.cm-gutters.cm-gutters-before) {
  @apply rounded-tl-md rounded-bl-md;
}
</style>
