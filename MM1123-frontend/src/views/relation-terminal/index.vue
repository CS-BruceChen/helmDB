<template>
  <div class="blank-page" v-if="execution.status === 'beforeStart'" ref="elementRef">
    <p class="kanit-medium">helmDB</p>
  </div>
  <div v-if="queryStatus === 'success'">
    <a-table :dataSource="queryReturns" :columns="columns" :scroll="{ x: elementWidth-100,y:elementHeight-220}">
      <template #title>
        <h3>Query Results:</h3>
      </template>
    </a-table>
  </div>
  <div v-if="queryStatus === 'error'">
    <a-alert message="Error" :description="queryOutput" type="error" show-icon style="margin: 10px;" />
  </div>
</template>

<script setup lang="js">
import { executionStore } from '@/stores';
import { ref, watch, onMounted } from 'vue';
const execution = executionStore();
const queryStatus = ref('');
const queryOutput = ref('');
const queryReturns = ref([]);
const columns = ref([]);

// 创建一个ref引用指向DOM元素
const elementRef = ref(null);
// 创建一个响应式的引用来存储元素的宽度高度
const elementWidth = ref(0);
const elementHeight = ref(0);


onMounted(() => {
  // 在组件挂载后，使用getBoundingClientRect或currentStyle来获取宽度
  if (elementRef.value) {
    elementWidth.value = elementRef.value.offsetWidth;
    elementHeight.value = elementRef.value.offsetHeight;
  }
});

watch(
  () => execution.status,
  (newStatus, oldStatus) => {
    if (newStatus === 'finished' && oldStatus !== 'finished') {
      // console.log(execution.currQueryReturns)
      queryStatus.value = execution.currQueryReturns.status;
      if (queryStatus.value === 'success') {
        queryReturns.value = execution.currQueryReturns.data;
        columns.value = [];
        const keys = Object.keys(queryReturns.value[0]);
        keys.forEach((key) => {
          columns.value.push({
            title: key,
            dataIndex: key,
            key: key,
          });
        });
        // console.log(columns.value)

      } else {
        queryOutput.value = execution.currQueryReturns.error;
      }
    }
  }
)
</script>

<style lang="css" scoped>
.blank-page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kanit-medium {
  font-family: "Kanit", sans-serif;
  font-weight: 500;
  font-style: italic;
  font-size: 48px;
}
</style>