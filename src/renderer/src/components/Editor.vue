<script lang="ts" setup>
import { computed, PropType } from 'vue'
import CodeMirror from 'vue-codemirror6'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { LangType } from '../../../types'
import { EditorView } from '@codemirror/view'
import { computedAsync } from '@vueuse/core'

const code = defineModel('code', {
  type: String,
  default: ''
})

const props = defineProps({
  lang: {
    type: String as PropType<LangType>,
    default: 'json'
  },
  gutter: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  lineWrap: {
    type: Boolean,
    default: true
  }
})

const lang_map = { json: { lang: json() } }

const getLang = (type: string) => {
  return lang_map[type]
}

const themeMode = computedAsync(async () => {
  return await window.api.getThemeMode()
})

const extensions = computed(() => {
  return [themeMode.value === 'dark' ? oneDark : []].concat([
    props.lineWrap ? EditorView.lineWrapping : []
  ])
})
</script>

<template>
  <code-mirror
    id="editor"
    v-model="code"
    :lang="getLang(lang).lang"
    basic
    :dark="themeMode === 'dark'"
    :gutter="gutter"
    :extensions="extensions"
    :placeholder="placeholder"
    class="h-full w-full min-h-0 max-h-full"
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
