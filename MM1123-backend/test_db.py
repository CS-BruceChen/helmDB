import py_opengauss

query = """WITH target_publication as ( SELECT * FROM articles WHERE article_id = '53e99784b7602d9701f3e151'), A as (SELECT p2._id AS id FROM citation_network MATCH {(p1: publication)-[c: cites]->(p2: publication)} WHERE p1._id in (SELECT article_id FROM target_publication)) SELECT id, pub_year, authors FROM articles WHERE pub_year <= 1990 AND article_id IN (SELECT id FROM A) ORDER BY emd <-> ( SELECT emd FROM target_publication ) LIMIT 5;"""

try:
    # 建立连接
    conn = py_opengauss.open('opengauss://wym:wym_123456@127.0.0.1:5432/tech_demo')

    # 准备查询任务
    task = conn.prepare(query)

    # 执行查询并打印结果
    result = task()
    print("查询结果：")
    for row in result:
        print(row)

except Exception as e:
    print("数据库操作失败：", e)

finally:
    # 确保关闭连接
    if conn:
        conn.close()
        print("数据库连接已关闭。")

