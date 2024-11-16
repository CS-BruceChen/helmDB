import subprocess

# 定义命令
command = "/home/wym/HELMDB_dest/bin/gsql -U wym -d tech_demo -p 5432 -f /home/wym/HELMDB_dest/bin/show_sql/show.sql"

try:

    # 执行第二条命令
    result = subprocess.run(command, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # 检查输出
    if result.returncode == 0:
        print("查询成功，输出如下：")
        print(result.stdout)
    else:
        print("查询失败，错误信息如下：")
        print(result.stderr)

except subprocess.CalledProcessError as e:
    print(f"命令执行失败：{e}")
