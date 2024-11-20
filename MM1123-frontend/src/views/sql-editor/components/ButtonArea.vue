<template>
  <a-flex class="button-area" justify="space-between">
    <a-space>
      <a-button type="primary" @click="run">
        <PlayCircleFilled />
        Run
      </a-button>
      <a-button>
        <ImportOutlined />
        Import
      </a-button>
      <a-button>
        <ExportOutlined />
        Export
      </a-button>
      <a-button>
        <FormatPainterOutlined />
        Format
      </a-button>
    </a-space>
    <a-tag :color="tagColor" style="line-height: 32px;">
      <component :is="currentIcon" :spin="tagSpinning" />
      {{ tagDesc }}
    </a-tag>
  </a-flex>
</template>

<script lang="js" setup>
import { PlayCircleFilled, ImportOutlined, ExportOutlined, FormatPainterOutlined, SyncOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { executionStore } from '@/stores';
import { ref, watch } from 'vue';
import { executeSQL, response } from '@/api';
const execution = executionStore();
function run() {
  // 执行executeSQL函数，执行完之后再调用execution.finish()
  executeSQL(execution)

  //设置execution.currResult为2-22000之间的随机整数数组，长度在5-10之间
  execution.currResult = Array.from({ length: Math.floor(Math.random() * 5) + 5 }, () => Math.floor(Math.random() * 20000) + 2);
}

const tagColor = ref('default');
const tagDesc = ref('');
const currentIcon = ref(ClockCircleOutlined);
const tagSpinning = ref(false);
// 使用watch来监听execution.status的变化
watch(() => execution.status, (newStatus) => {
  switch (newStatus) {
    case 'beforeStart':
      tagColor.value = 'default';
      tagDesc.value = '';
      currentIcon.value = ClockCircleOutlined;
      tagSpinning.value = false;
      break;
    case 'running':
      tagColor.value = 'processing';
      tagDesc.value = 'processing';
      currentIcon.value = SyncOutlined;
      tagSpinning.value = true;
      break;
    case 'finished':
      tagColor.value = 'success';
      tagDesc.value = `success: ${execution.time} ms`;
      currentIcon.value = CheckCircleOutlined;
      tagSpinning.value = false;
      break;
    case 'error':
      tagColor.value = 'error';
      tagDesc.value = 'error';
      currentIcon.value = CloseCircleOutlined;
      tagSpinning.value = false;
      break;
    default:
      tagColor.value = 'warning';
      tagDesc.value = 'warning';
      currentIcon.value = ExclamationCircleOutlined;
      tagSpinning.value = false;
  }
}, { immediate: true });


</script>

<style lang="css" scoped>
.button-area {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
}
</style>