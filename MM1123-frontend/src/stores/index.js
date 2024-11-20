import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const executionStore = defineStore('execution', {
  state: () => {
    return {
      counter: 0,
      time: 0,
      status: 'beforeStart',
      currSQL: '',
      currResult: [],
      currQueryReturns: {},
    }
  },
  actions: {
    start() {
      this.counter++
      this.time = new Date().getTime()
    },
    run(sqlStr) {
      this.status = 'running'
      this.currSQL = sqlStr
    },
    finish(returnedData) {
      this.status = 'finished'
      this.time = new Date().getTime() - this.time
      this.currQueryReturns = returnedData;
      this.currResult = Array.from(
        { length: Math.floor(Math.random() * 5) + 5 },
        () => Math.floor(Math.random() * 20000) + 2
      );
    },
    err() {
      this.status = 'error'
      this.time = 0
    }
  },
})