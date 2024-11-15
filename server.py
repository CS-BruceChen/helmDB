import pexpect
import os

# 禁用分页器
os.environ['PAGER'] = ''

DB_NAME = "tech_demo"
DB_USER = "wym"
DB_HOST = "127.0.0.1"
DB_PORT = "5432"
SQL_FILE = "/home/wym/HELMDB_dest/bin/show_sql/show.sql"
PASSWORD = "wym_123456"

command = "/home/wym/HELMDB_dest/bin/gsql -d {} -U {} -h {} -p {} -f {}".format(
    DB_NAME, DB_USER, DB_HOST, DB_PORT, SQL_FILE
)

try:
    child = pexpect.spawn(command, encoding='utf-8')
    child.expect("Password for user", timeout=30) 

    child.sendline(PASSWORD)

    while True:
        line = child.readline() 
        if not line:
            break
        print(line, end="")

except pexpect.exceptions.ExceptionPexpect as e:
    print("运行失败：", str(e))
