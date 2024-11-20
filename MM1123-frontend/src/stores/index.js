import { defineStore } from 'pinia'
import rawData from '@/data/TestSet_projection.json'

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
      if (returnedData.status === 'success') {
        // 从returnedData.data中提取每个对象的id属性
        this.currResult = returnedData.data.map(obj => obj.id);
        // 根据id数组，从rawData数组中提取对应位置的对象
        this.currQueryReturns = {
          status: 'success',
          data: this.currResult.map(id => rawData[id])
        }
      } else {
        this.currResult = []
      }
    },
    err() {
      this.status = 'error'
      this.time = 0
    }
  },
})