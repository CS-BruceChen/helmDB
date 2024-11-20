<template>
  <div class="codemirror">
    <div id="monacoEditor" ref="monacoEditor" class="monaco-editor" />
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { executionStore } from '@/stores';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
self.MonacoEnvironment = {
  getWorker(workerId, label) {
    return new editorWorker()
  }
}
// 定义从父组件接收的属性
// const props = defineProps({
//   option: Object
// })
// const code = ref('') // 代码

// 获取 SQL 的关键字
const { keywords } = language

let editor

// 初始化 SQL 代码和表格数据
const tables = {}

// 编辑器的主题设置
const theme = 'vs-light'

const exampleSQL = `WITH target_publication as 
(
  SELECT * 
  FROM articles 
  WHERE article_id = '53e99784b7602d9701f3e151'
),
A as 
(
  SELECT p2._id AS id
  FROM citation_network
  MATCH {(p1: publication)-[c: cites]->(p2: publication)}
  WHERE p1._id in (select article_id from target_publication)
)
SELECT id,pub_year,authors, 
from articles 
WHERE pub_year <= 1990 
and article_id in (select id from A)
ORDER BY emd <-> (
  select emd from target_publication
)
limit 5;`

const testSQL="SELECT * FROM pg_user"

// 组件挂载后创建编辑器实例
onMounted(() => {
  initAutoCompletion()
  editor = monaco.editor.create(document.getElementById('monacoEditor'), {
    value: testSQL,//exampleSQL,
    language: 'sql',
    readOnly: false,
    automaticLayout: true,
    colorDecorators: true, // 颜色装饰器
    theme: theme,
    minimap: {
      enabled: false
    },
    tabSize: 2,
    fontSize: 20
  })
})
// 组件卸载前销毁编辑器实例
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
/**
 * @description: 获取编辑器中填写的值
 */
function getValue() {
  return editor.getValue()
}
/**
 * @description: 初始化自动补全
 */
function initAutoCompletion() {
  monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: ['.', ' ', ...keywords],
    provideCompletionItems: (model, position) => {
      let suggestions = []
      const { lineNumber, column } = position
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column
      })
      const words = textBeforePointer.trim().split(/\s+/)
      const lastWord = words[words.length - 1]

      if (lastWord.endsWith('.')) {
        const tableName = lastWord.slice(0, lastWord.length - 1)
        if (Object.keys(tables).includes(tableName)) {
          suggestions = [...getFieldsSuggest(tableName)]
        }
      } else if (lastWord === '.') {
        suggestions = []
      } else {
        suggestions = [...getTableSuggest(), ...getKeywordsSuggest()]
      }

      return {
        suggestions
      }
    }
  })
}

/**
 * @description: 获取关键字的补全列表
 *
 */
function getKeywordsSuggest() {
  return keywords.map((key) => ({
    label: key,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: key
  }))
}

/**
 * @description: 获取表名的补全列表
 */
function getTableSuggest() {
  return Object.keys(tables).map((key) => ({
    label: key,
    kind: monaco.languages.CompletionItemKind.Variable,
    insertText: key
  }))
}

/**
 * @description: 根据表名获取字段补全列表
 * @param {*} tableName
 */
function getFieldsSuggest(tableName) {
  const fields = tables[tableName]
  if (!fields) {
    return []
  }
  return fields.map((name) => ({
    label: name,
    kind: monaco.languages.CompletionItemKind.Field,
    insertText: name
  }))
}

// 对点击事件的响应，可类似地拓展导入导出的逻辑

const execution = executionStore()

watch(
  () => execution.counter,
  () => {
    execution.run(getValue())
    console.log(execution.currSQL)
  }
)
</script>

<style lang="css" scoped>
.monaco-editor {
  height: 100%;
}

.codemirror {
  flex: 1;
}
</style>