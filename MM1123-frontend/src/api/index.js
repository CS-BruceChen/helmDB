// @/api/index.js

// 定义executeSQL函数
const executeSQL = async (execution) => {
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
            execution.finish(data);
        } else {
            execution.err()
            console.error('Network response was not ok');
        }
    } catch (error) {
        execution.err()
        console.error('Error:', error.message);
    }
};

// 导出executeSQL函数和响应式引用
export { executeSQL };