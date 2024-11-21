import { defineStore } from 'pinia'
import rawData from '@/data/TestSet_projection.json'
import idMap from '@/data/idMap.json'

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
        // 如果id不是纯数字，则返回一个2-22000的随机整数
        this.currResult = this.currResult.map(id => {
          if (isNaN(id)) {
            return idMap[id];
          }
          return id;
        });
        // 根据id数组，从rawData数组中提取对应位置的对象
        this.currQueryReturns = {
          status: 'success',
          data: this.currResult.map(id => {
            const item = rawData[id - 1];
            // 创建item的浅拷贝
            const copiedItem = Object.assign({}, item);
            delete copiedItem['3DProjection'];
            return copiedItem;
          })
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

export const savedSQLStore = defineStore('savedSQL', {
  // 可能selectedSQLIndex应该为计算属性，因为不能超过数组长度
  state: () => {
    let relationModalSQL=`SELECT * 
FROM articles 
WHERE article_id = '53e99784b7602d9701f3e151'`
    let relationModal = {
      desc:"Relation Modal Example",
      sql:relationModalSQL,
    }
    
    let graphModalSQL=`SELECT p2._id AS id 
FROM citation_network 
MATCH {(p1: publication)-[c: cites]->(p2: publication)} 
WHERE p1._id = '53e99784b7602d9701f3e151'`

    let graphModal = {
      desc:"Graph Modal Example",
      sql:graphModalSQL,
    }

    let vectorModalSQL=`SELECT id,pub_year,authors
from articles
WHERE id=2
OR id=3
OR id=4
OR id=5
OR id=6
ORDER BY emd <-> (
  select emd from articles where id=1
)
LIMIT 3`
    let vectorModal = {
      desc:"Vector Modal Example",
      sql:vectorModalSQL,
    }

    let crossModalSQL=`WITH target_publication as 
(
SELECT * 
FROM articles 
WHERE article_id = '53e99784b7602d9701f3e151'
),
A as 
(
SELECT p2._id AS id
FROM citation_network
MATCH {(p1: publication)-[c: cites]->(p2: publication)}
WHERE p1._id in (select article_id from target_publication)
)
SELECT id,pub_year,authors
from articles
WHERE pub_year <= 1990 
and article_id in (select id from A)
ORDER BY emd <-> (
  select emd from target_publication
)
limit 5`
    let crossModal = {
      desc:"Cross Modal Example",
      sql:crossModalSQL,
    }

    let savedSQL = [relationModal,graphModal,vectorModal,crossModal]
    
    return {
      savedSQL: savedSQL,
      selectedSQLIndex: 0,
    }
  },
  actions: {
    add(sqlStr) {
      this.saveSQL.push(sqlStr)
    },
    remove(index) {
      // 检查index合法性
      if (index < 0 || index >= this.saveSQL.length) {
        return;
      }
      this.saveSQL.splice(index, 1)
      // 元素移除后，修改selectedSQLIndex的值，使之不要超过数组长度
      if (this.selectedSQLIndex >= this.saveSQL.length) {
        this.selectedSQLIndex = this.saveSQL.length - 1;
      }
    },
    select(index) {
      this.selectedSQLIndex = index
    },
    getCurrentSQL() {
      return this.savedSQL[this.selectedSQLIndex].sql
    }
  },
})