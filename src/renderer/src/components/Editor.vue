<script lang="ts" setup>
import { computed, PropType, ref } from 'vue'
import CodeMirror from 'vue-codemirror6'
import { json } from '@codemirror/lang-json'
import { useSystemThemeStore } from '@renderer/store/useSystemThemeStore'
import { oneDark } from '@codemirror/theme-one-dark'
import { LangType } from '../../../types'

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  lang: {
    type: String as PropType<LangType>,
    default: 'json'
  },
  gutter: {
    type: Boolean,
    default: false
  }
})

const lang_map = { json: { lang: json() } }

const getLang = (type: string) => {
  return lang_map[type]
}

const extentsions = computed(() => {
  return [getSystemThemeMode() === 'dark' ? oneDark : []]
})

const { getSystemThemeMode } = useSystemThemeStore()
const value = ref(props.code)
</script>

<template>
  <code-mirror
    id="editor"
    v-model="value"
    :lang="getLang(lang).lang"
    basic
    :dark="getSystemThemeMode() === 'dark'"
    :gutter="gutter"
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
  @apply dark:bg-[#333] rounded-tl-md rounded-bl-md;
}

:deep(.cm-content) {
  @apply rounded-tr-md rounded-br-md;
}

:deep(.cm-editor .cm-selectionBackground) {
  background-color: #5d656e83 !important; /* 自定义选中色 */
}
</style>
