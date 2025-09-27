<template>
  <div class="h-full w-full flex items-center justify-between p-2 gap-5">
    <div class="h-full w-1/2">
      <Codemirror
        ref="oldCodemirror"
        v-model="oldValue"
        :extensions="oldExtensions"
        class="editor-instance"
      />
    </div>

    <div class="h-full w-1/2">
      <Codemirror
        ref="newCodemirror"
        v-model="newValue"
        :extensions="newExtensions"
        class="editor-instance"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import Codemirror from 'vue-codemirror6'
import { basicSetup } from 'codemirror'
import { Decoration, EditorView, type EditorView as EditorViewType } from '@codemirror/view'
import { RangeSet, StateEffect, StateField } from '@codemirror/state'
import DiffMatchPatch from 'diff-match-patch'
import { useDataStore } from '@renderer/store/useDataStore'
import { TextDiffDataType } from '../../../types'

const { setData, getData } = useDataStore()
const inited = ref(false)

// 文本内容与配置
const oldValue = ref('')
const newValue = ref('')

// 编辑器实例引用（获取底层 EditorView）
const oldCodemirror = ref<{ view: EditorViewType | null } | null>(null)
const newCodemirror = ref<{ view: EditorViewType | null } | null>(null)

// 差异计算实例
const dmp = new DiffMatchPatch()

// 定义装饰状态字段（用于动态更新）
const createDiffField = () =>
  StateField.define<RangeSet<Decoration>>({
    create: () => RangeSet.empty,
    update: (old, tr) => {
      // 从事务中获取新装饰
      for (const effect of tr.effects) {
        if (effect.is(diffEffect)) return effect.value
      }
      return old
    },
    provide: (f) => EditorView.decorations.from(f)
  })

// 定义更新装饰的 Effect
const diffEffect = StateEffect.define<RangeSet<Decoration>>()

// 左右编辑器的装饰字段
const oldDiffField = createDiffField()
const newDiffField = createDiffField()

// 计算差异并生成 RangeSet
const computeDiffs = () => {
  const oldText = oldValue.value
  const newText = newValue.value

  // 按行分割文本（保留空行）
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')

  // 定义装饰样式
  const deleteDeco = Decoration.mark({ class: 'diff-delete' }) // 原始文本删除样式
  const insertDeco = Decoration.mark({ class: 'diff-insert' }) // 新文本新增样式
  const oldDecorations: Array<ReturnType<typeof deleteDeco.range>> = []
  const newDecorations: Array<ReturnType<typeof insertDeco.range>> = []

  // 获取编辑器文档（用于计算行的位置范围）
  const oldDoc = oldCodemirror.value?.view?.state.doc
  const newDoc = newCodemirror.value?.view?.state.doc
  if (!oldDoc || !newDoc) return { old: RangeSet.empty, new: RangeSet.empty }

  // 记录差异行索引（从0开始）
  const oldDiffLineIndices: number[] = [] // 原始文本差异行索引
  const newDiffLineIndices: number[] = [] // 新文本差异行索引

  // 严格按行索引对比（核心修改：不再跨行匹配）
  const maxLines = Math.max(oldLines.length, newLines.length) // 取最大行数循环
  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] // 原始文本第i行
    const newLine = newLines[i] // 新文本第i行

    // 处理行数不一致的情况
    if (i >= oldLines.length) {
      // 原始文本无此第i行 → 新文本第i行为新增
      const line = newDoc.line(i + 1) // CodeMirror行号从1开始
      if (line.from < line.to) {
        newDecorations.push(insertDeco.range(line.from, line.to))
      }
      newDiffLineIndices.push(i + 1)
      continue
    }
    if (i >= newLines.length) {
      // 新文本无此第i行 → 原始文本第i行为删除
      const line = oldDoc.line(i + 1)
      if (line.from < line.to) {
        oldDecorations.push(deleteDeco.range(line.from, line.to))
      }
      oldDiffLineIndices.push(i + 1)
      continue
    }

    // 行数相同但内容不同 → 计算行内字符差异
    if (oldLine !== newLine) {
      // 原始文本行：标记删除的字符
      const oldLineInfo = oldDoc.line(i + 1)
      const charDiffsOld = dmp.diff_main(oldLine, newLine)
      dmp.diff_cleanupSemantic(charDiffsOld)
      let oldCharPos = 0
      charDiffsOld.forEach(([type, text]) => {
        if (type === -1) {
          // 仅在原始文本存在的字符（删除）
          const start = oldLineInfo.from + oldCharPos
          const end = start + text.length
          if (start < end) {
            oldDecorations.push(deleteDeco.range(start, end))
          }
          oldDiffLineIndices.push(i + 1)
        }
        if (type !== 1) oldCharPos += text.length // 跳过新增字符的长度计算
      })

      // 新文本行：标记新增的字符
      const newLineInfo = newDoc.line(i + 1)
      const charDiffsNew = dmp.diff_main(oldLine, newLine)
      dmp.diff_cleanupSemantic(charDiffsNew)
      let newCharPos = 0
      charDiffsNew.forEach(([type, text]) => {
        if (type === 1) {
          // 仅在新文本存在的字符（新增）
          const start = newLineInfo.from + newCharPos
          const end = start + text.length
          if (start < end) {
            newDecorations.push(insertDeco.range(start, end))
          }
          newDiffLineIndices.push(i + 1)
        }
        if (type !== -1) newCharPos += text.length // 跳过删除字符的长度计算
      })
    }
    // 行数相同且内容相同 → 无装饰（不处理）
  }

  return {
    old: RangeSet.of(oldDecorations),
    new: RangeSet.of(newDecorations),
    oldDiffLineIndices,
    newDiffLineIndices
  }
}

// 编辑器扩展（包含装饰字段）
const oldExtensions = computed(() => [
  basicSetup,
  oldDiffField,
  EditorView.lineWrapping,
  EditorView.updateListener.of((update) => {
    if (inited.value && (update.docChanged || update.selectionSet)) {
      oldValue.value = update.state.doc.toString()
      updateDecorations()
      saveData()
    }
  })
])

const newExtensions = computed(() => [
  basicSetup,
  newDiffField,
  EditorView.lineWrapping,
  EditorView.updateListener.of((update) => {
    if (inited.value && (update.docChanged || update.selectionSet)) {
      newValue.value = update.state.doc.toString()
      updateDecorations()
      saveData()
    }
  })
])

// 更新装饰的方法（通过底层 EditorView 分发事务）
const updateDecorations = () => {
  const diffs = computeDiffs()
  // 更新左侧编辑器
  oldCodemirror.value?.view?.dispatch({
    effects: diffEffect.of(diffs.old)
  })
  // 更新右侧编辑器
  newCodemirror.value?.view?.dispatch({
    effects: diffEffect.of(diffs.new)
  })

  // 给差异行的行号添加类
  // 处理原始文本编辑器
  const oldGutters = oldCodemirror.value?.view?.dom.querySelectorAll('.cm-gutterElement')
  if (oldGutters) {
    // 先清除所有旧类
    oldGutters.forEach((el) => {
      el.classList.remove('diff-delete-gutter')
    })
    // 给差异行索引添加类
    diffs.oldDiffLineIndices?.forEach((index) => {
      const gutterEl = oldGutters[index]
      gutterEl?.classList.add('diff-delete-gutter')
    })
  }

  // 处理新文本编辑器
  const newGutters = newCodemirror.value?.view?.dom.querySelectorAll('.cm-gutterElement')
  if (newGutters) {
    // 先清除所有旧类
    newGutters.forEach((el) => {
      el.classList.remove('diff-insert-gutter')
    })
    // 给差异行索引添加类
    diffs.newDiffLineIndices?.forEach((index) => {
      const gutterEl = newGutters[index]
      gutterEl?.classList.add('diff-insert-gutter')
    })
  }
}

const initData = () => {
  const data = getData('text_diff') as TextDiffDataType
  newValue.value = data.data?.newValue || ''
  oldValue.value = data.data?.oldValue || ''
}

const saveData = () => {
  setData('text_diff', {
    time: new Date().getTime(),
    data: {
      newValue: newValue.value,
      oldValue: oldValue.value
    }
  })
}

onMounted(async () => {
  initData()
  await nextTick()
  inited.value = true
  setTimeout(() => updateDecorations(), 50)

  window.api.onClear(() => {
    oldValue.value = ''
    newValue.value = ''
    saveData()
  })
})

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('clear')
  saveData()
})
</script>

<style lang="scss" scoped>
:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-gutters) {
  @apply dark:bg-[#333] dark:text-[#ccc] border-none rounded-tl-md rounded-bl-md;
}

:deep(.cm-activeLineGutter) {
  @apply dark:bg-transparent;
}

:deep(.cm-activeLine) {
  @apply dark:bg-transparent;
}

:deep(.cm-cursor) {
  @media (prefers-color-scheme: dark) {
    border-left-color: #ccc;
  }
}

:deep(.cm-focused .cm-selectionBackground),
:deep(.cm-selectionBackground) {
  @apply dark:bg-[rgba(204,204,204,0.15)];
}

.editor-instance {
  @apply h-[calc(100vh-107px)] dark:text-[#ccc] rounded-md border border-[#e5e7eb] dark:border-[#4C4D4F] overflow-auto;
}

:deep(.diff-delete) {
  @apply bg-[rgba(239,68,68,0.15)] border-b-2 border-[#F6B5AE] dark:border-[#8A625A];
}

:deep(.diff-insert) {
  @apply bg-[rgba(34,197,94,0.15)] border-b-2 border-[#B1E1AD] dark:border-[#518953];
}

:deep(.diff-delete-gutter) {
  @apply border-r-2 border-[#ef4444] dark:border-[#FFAA99];
}

:deep(.diff-insert-gutter) {
  @apply border-r-2 border-[#22c55e] dark:border-[#89FF88];
}
</style>
