import { defineStore } from 'pinia'
import rawData from '@/data/MergedData_projection.json'
import idMap from '@/data/MergedData_idMap.json'

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
        console.log(returnedData.data);
        // 有article_id就提取article_id属性，否则提取id属性
        this.currResult = returnedData.data.map(obj => obj.hasOwnProperty('article_id')? idMap[obj.article_id] : idMap[obj.id]);
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
WHERE article_id = '5dc149a33a55acb75f3915ac'`
    let relationModal = {
      desc:"Relation Modal Example",
      sql:relationModalSQL,
    }
    
    let graphModalSQL=`SELECT p2._id AS id 
FROM citation 
MATCH {(p1: publication)-[c: cites]->(p2: publication)} 
WHERE p1._id = '5dc149a33a55acb75f3915ac'`

    let graphModal = {
      desc:"Graph Modal Example",
      sql:graphModalSQL,
    }

    let vectorModalSQL=`SELECT *
from articles
WHERE article_id='5b3d98a217c44a510f7fe9cb'
OR article_id='5ff68486d4150a363cbe2ad9'
OR article_id='5dfb4b0b3a55acc370a5e2f2'
OR article_id='5db425183a55ac7b041f0edd'
OR article_id='5e8d92f69fced0a24b64d0b8'
ORDER BY emd <-> (
  select emd from articles where article_id='5dc149a33a55acb75f3915ac'
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
  WHERE article_id = '5dc149a33a55acb75f3915ac'
),
A as 
(
  SELECT p2._id AS id
  FROM citation
  MATCH {(p1: publication)-[c: cites]->(p2: publication)}
  WHERE p1._id in (select article_id from target_publication)
    AND (
        p2.keywords LIKE '%Crowdsourcing%' OR
        p2.keywords LIKE '%Crowd computing%' OR 
        p2.keywords LIKE '%Reinforcement learning%' OR 
        p2.keywords LIKE '%Deep Reinforcement Learning%' OR 
        p2.keywords LIKE '%Recommender System%' 
      )
)
SELECT article_id 
from articles 
WHERE pub_year >= 2018 
and article_id in (select id from A)
ORDER BY emd <-> (
  select emd from target_publication
)
limit 10`
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