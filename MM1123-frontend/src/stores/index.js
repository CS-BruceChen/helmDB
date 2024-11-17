import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const executionStore = defineStore('execution', {
  state: () => {
    return {
      counter: 0,
      time: 0,
      status: 'beforeStart',
      currSQL: '',
    }
  },
  actions: {
    start() {
      this.counter++
      this.time = new Date().getTime()
      this.status = 'running'
    },
    finish() {
      this.status = 'finished'
      this.time = new Date().getTime() - this.time
    },
    err() {
      this.status = 'error'
      this.time = 0
    }
  },
})