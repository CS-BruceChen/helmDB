from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import re

app = Flask(__name__)
CORS(app)  # 这将允许所有域名进行跨域请求

# 定义 SQL 文件路径
SQL_FILE_PATH = "/home/wym/HELMDB_dest/bin/show_sql/show.sql"

# 定义处理 SQL 的函数
def sql_process(input_sql):
    """
    对传入的 SQL 字符串进行包装，返回 JSON 格式的 SQL。
    """
    # 包装 SQL，使其返回 JSON 格式
    res_sql = "SELECT json_agg(row_to_json(t)) FROM ({}) t;".format(input_sql)
    return res_sql


# 定义执行命令的函数
def execute_sql_file(skip_lines=0):
    """
    执行生成的 SQL 文件，并返回结果字符串，同时支持忽略前 n 行。
    """
    command = f"/home/wym/HELMDB_dest/bin/gsql -U wym -d tech_demo -p 5432 -f {SQL_FILE_PATH}"
    try:
        result = subprocess.run(command, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            cleaned_output = result.stdout.replace("\n", "")
            match = re.search(r"\[.*\]", cleaned_output)
            if match:
                jsonstr=match.group(0)
                return jsonstr  # 返回匹配到的 JSON 对象
            else:
                raise ValueError("未找到 JSON 对象")
        else:
            return {"status": "error", "output": result.stderr}
    except Exception as e:
        return {"status": "error", "output": str(e)}


@app.route('/execute', methods=['POST'])
def execute():
    """
    接收前端传来的 SQL 字符串，处理后写入文件并执行
    """
    try:
        # 获取前端发送的 JSON 数据
        data = request.json
        input_sql = data.get("sql")

        if not input_sql:
            return jsonify({"status": "error", "message": "No SQL provided"}), 400

        # 处理 SQL
        processed_sql = sql_process(input_sql)

        # 写入处理后的 SQL 到文件
        with open(SQL_FILE_PATH, "w") as sql_file:
            sql_file.write(processed_sql)

        # 执行 SQL 文件
        result = execute_sql_file(1)
        # jsonres=jsonify(result)

        # 返回结果
        return result

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    # 确保 SQL 文件目录存在
    os.makedirs(os.path.dirname(SQL_FILE_PATH), exist_ok=True)

    # 启动 Flask 应用
    app.run(host="0.0.0.0", port=15138, debug=True)
