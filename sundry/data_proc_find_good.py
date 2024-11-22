import pandas as pd

# 读取包含非空 'references' 的 JSON 文件
df_with_references = pd.read_json('/data1/dblpv13_>=2018_hasRef.json', orient='records', lines=True)

# 查找标题为 "An End-to-End Deep RL Framework for Task Arrangement in Crowdsourcing Platforms" 的条目
paper = df_with_references[df_with_references['_id'] == "5dc149a33a55acb75f3915ac"]

# 保存该条目为 CSV 文件
paper.to_csv('/data1/paper_li.csv', index=False)

# 打印检查保存的数据
print(paper.head())
