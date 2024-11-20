<template>
  <div class="blank-page" v-if="execution.status==='beforeStart'">
    <p class="kanit-medium">helmDB</p>
  </div>
  <a-table v-if="queryStatus === 'success'" :dataSource="queryReturns" :columns="columns">
    <template #title>
      <h3>Query Results:</h3>
    </template>
  </a-table>
  <div v-if="queryStatus==='error'">
    <a-alert
      message="Error"
      :description="queryOutput"
      type="error"
      show-icon
    />
  </div>
</template>

<script setup lang="js">
import { executionStore } from '@/stores';
import { ref, watch } from 'vue';
const execution = executionStore();
const queryStatus = ref('');
const queryOutput = ref('');
const queryReturns = ref([]);
const columns = ref([]);

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