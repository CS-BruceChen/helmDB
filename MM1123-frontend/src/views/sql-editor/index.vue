<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#00b96b',
    },
  }">
    <ButtonArea />
  </a-config-provider>
  <SqlTextArea />
</template>

<script lang="js" setup>
import ButtonArea from './components/ButtonArea.vue';
import SqlTextArea from './components/SqlTextArea.vue';
</script>

<style lang="css" scoped></style>