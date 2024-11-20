// @/api/index.js
import { ref } from 'vue';
// 创建一个响应式引用来存储响应数据
const response = ref(null);

// 定义executeSQL函数
const executeSQL = async (execution) => {
    execution.start();
    try {
        // 使用fetch发送POST请求
        const result = await fetch('http://101.126.23.182:15138/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: execution.currSQL })
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