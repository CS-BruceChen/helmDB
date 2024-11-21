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
        <SaveOutlined />
        Save
      </a-button>
      <a-dropdown :trigger="['click']">
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <!-- 循环渲染savedSQL.savedSQL.length个数组 -->
            <a-menu-item v-for="i in savedSQL.savedSQL.length" :key="i-1">
              <CodeOutlined />
              {{ savedSQL.savedSQL[i-1].desc }}
            </a-menu-item>
          </a-menu>
        </template>
        <a-button>
          <ConsoleSqlOutlined />
          Saved SQL
          <DownOutlined />
        </a-button>
      </a-dropdown>
    </a-space>
    <a-tag :color="tagColor" style="line-height: 32px;">
      <component :is="currentIcon" :spin="tagSpinning" />
      {{ tagDesc }}
    </a-tag>
  </a-flex>
</template>

<script lang="js" setup>
import { PlayCircleFilled, ImportOutlined, ExportOutlined, SaveOutlined,DownOutlined, SyncOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,ConsoleSqlOutlined,CodeOutlined } from '@ant-design/icons-vue';
import { executionStore,savedSQLStore } from '@/stores';
import { ref, watch } from 'vue';
import { executeSQL } from '@/api';
const execution = executionStore();
const savedSQL = savedSQLStore();

watch(
  () => execution.status,
  (newStatus, oldStatus) => {
    if (newStatus === 'running' && oldStatus !== 'running') {
      executeSQL(execution)
    }
  }
)

function run() {
  execution.start();
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

function handleMenuClick(item) {
  // console.log(item.key)
  savedSQL.select(item.key)
}

</script>

<style lang="css" scoped>
.button-area {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
}
</style>