<template>
  <a-flex class="button-area">
    <a-space>
      <a-button type="primary">
        <PlayCircleFilled />
        Run
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
  </a-flex>
</template>

<script lang="js" setup>
import { PlayCircleFilled, ExportOutlined,FormatPainterOutlined } from '@ant-design/icons-vue';
</script>

<style lang="css" scoped>
.button-area {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
}
</style>