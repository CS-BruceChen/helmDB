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
      {{ tagColor }}
    </a-tag>
  </a-flex>
</template>

<script lang="js" setup>
import { PlayCircleFilled, ImportOutlined, ExportOutlined, FormatPainterOutlined, SyncOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { executionStore } from '@/stores';
import { ref, watch } from 'vue';
const execution = executionStore();
function run() {
  execution.start();
}

const tagColor = ref('default');
const currentIcon = ref(ClockCircleOutlined);
const tagSpinning = ref(false);
// 使用watch来监听execution.status的变化
watch(() => execution.status, (newStatus) => {
  switch (newStatus) {
    case 'beforeStart':
      tagColor.value = '';
      currentIcon.value = ClockCircleOutlined;
      tagSpinning.value = false;
      break;
    case 'running':
      tagColor.value = 'processing';
      currentIcon.value = SyncOutlined;
      tagSpinning.value = true;
      break;
    case 'finished':
      tagColor.value = 'success';
      currentIcon.value = CheckCircleOutlined;
      tagSpinning.value = false;
      break;
    case 'error':
      tagColor.value = 'error';
      currentIcon.value = CloseCircleOutlined;
      tagSpinning.value = false;
      break;
    default:
      tagColor.value = 'warning';
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