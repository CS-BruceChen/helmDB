<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <main>
    <div class="sql-container">div1</div>
    <div class="res-container">
      <div class="vector-canvas">div2</div>
      <div class="relation-terminal">div3</div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;
}

.sql-container {
  flex: 1;
  height: 100%;
}

.res-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vector-canvas {
  flex: 1;
}

.relation-terminal {
  flex: 1;
}
</style>
