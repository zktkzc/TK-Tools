<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { LangType } from '../../../types'
import { EditorView, placeholder } from '@codemirror/view'
import { computedAsync } from '@vueuse/core'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'

const props = defineProps({
  modelValue: {
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
  },
  placeholderStr: {
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

const editor = ref<HTMLElement | null>(null)
const editorView = ref<EditorView | null>(null)
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const extensions = computed(() => {
  return [
    basicSetup,
    getLang(props.lang).lang,
    ...(props.placeholderStr ? [placeholder(props.placeholderStr)] : []),
    ...(themeMode.value === 'dark' ? [oneDark] : []),
    ...(props.lineWrap ? [EditorView.lineWrapping] : []),
    EditorView.updateListener.of((update) => {
      if (!editorView.value) return

      if (update.docChanged) {
        if (props.modelValue !== update.state.doc.toString()) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }
    })
  ]
})

const initEditor = () => {
  if (editorView.value) {
    editorView.value.destroy()
  }

  editorView.value = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: extensions.value
    }),
    parent: editor.value as HTMLDivElement
  })
}

const updateEditor = (text: string) => {
  if (!editorView.value) return

  if (text !== editorView.value.state.doc.toString()) {
    editorView.value?.dispatch({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: text || ''
      }
    })
  }
}

defineExpose({
  initEditor,
  updateEditor
})

onMounted(() => {
  window.api.onThemeChanged(async () => {
    themeMode.value = await window.api.getThemeMode()
  })
})

onUnmounted(() => {
  editorView.value?.destroy()
})

watch(
  () => themeMode.value,
  () => {
    initEditor()
  },
  { immediate: true }
)
</script>

<template>
  <div ref="editor" style="height: 100%" />
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
