<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import SqlEditor from '@/views/sql-editor/index.vue'
import VectorCanvas from '@/views/vector-canvas/index.vue'
import RelationTerminal from '@/views/relation-terminal/index.vue'
</script>

<template>
  <main>
    <div class="sql-container">
      <SqlEditor />
    </div>
    <div class="res-container">
      <div class="vector-canvas">
        <VectorCanvas />
      </div>
      <div class="relation-terminal">
        <RelationTerminal />
      </div>
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
  display: flex;
  flex-direction: column;
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
  /* overflow: hidden; */
}
</style>
