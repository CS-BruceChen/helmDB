<template>
    <div>{{ queryReturns }}</div>
</template>

<script setup lang="js">
import { executionStore } from '@/stores';
import { ref, watch } from 'vue';
const execution = executionStore();
const queryReturns = ref({});
watch(
    () => execution.status,
    (newStatus, oldStatus) => {
        if (newStatus === 'finished' && oldStatus!== 'finished') {
            console.log(execution.currQueryReturns)
            queryReturns.value = execution.currQueryReturns;
        }
    }
)
</script>