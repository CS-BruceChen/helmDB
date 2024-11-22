import pandas as pd
import json

# 读取 JSON 文件并加载到 pandas DataFrame
with open('/data1/dblpv13_standard.json', 'r') as file:
    data = json.load(file)

# 将数据转换为 pandas DataFrame
df = pd.DataFrame(data)

# 显示 DataFrame 的前几行，查看数据格式
print("原始数据的前几行：")
print(df.head())

# 筛选出 2018 年及之后的记录
df_filtered = df[df['year'] >= 2018]

# 显示筛选后的数据
print("筛选后的数据：")
print(df_filtered)

# 打印筛选后数据的数量
print(f"筛选后的数据条数: {df_filtered.shape[0]}")

# 可选：将筛选后的数据保存为新的 JSON 文件
df_filtered.to_json('/data1/dblpv13_>=2018.json', orient='records', lines=True)
