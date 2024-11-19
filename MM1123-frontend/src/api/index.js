// @/api/index.js
import { ref } from 'vue';
import { executionStore } from '@/stores';
// 创建一个响应式引用来存储响应数据
const response = ref(null);
const execution = executionStore();

// function run() {
//     execution.start();
//     // 执行executeSQL函数，执行完之后再调用execution.finish()
//     executeSQL(execution.currSQL).then(() => {
//       execution.finish();
//     });

//     // executeSQL(execution.currSQL);
//     // execution.finish();
//     //设置execution.currResult为2-22000之间的随机整数数组，长度在5-10之间
//     execution.currResult = Array.from({ length: Math.floor(Math.random() * 5) + 5 }, () => Math.floor(Math.random() * 20000) + 2);
//   }

// 定义executeSQL函数
const executeSQL = async (sqlStr) => {
    execution.start();
    try {
        // 使用fetch发送POST请求
        const result = await fetch('http://101.126.23.182:15138/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: sqlStr })
        });

        if (result.ok) {
            const data = await result.json();
            response.value = data;
            execution.finish();
            execution.currResult = Array.from(
                { length: Math.floor(Math.random() * 5) + 5 },
                () => Math.floor(Math.random() * 20000) + 2
            );
        } else {
            execution.err()
            console.error('Network response was not ok');
        }
    } catch (error) {
        execution.err()
        response.value = { error: error.message };
        console.error('Error:', error.message);
    }
};

// 导出executeSQL函数和响应式引用
export { executeSQL, response };