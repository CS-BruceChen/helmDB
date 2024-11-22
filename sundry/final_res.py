# import pandas as pd
# import ast
# import json

# # 1. 读取李国良老师的论文信息，提取其引用，转化为一个列表
# df = pd.read_csv('/data1/paper_li.csv')
# df['references'] = df['references'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
# references_list = df['references'].tolist()

# # Flatten the list of references, so we get all the reference IDs
# reference_ids = [item for sublist in references_list for item in sublist]

# # 2. 读取包含所有论文的 JSON 文件
# df_18later_hasRef = pd.read_json('/data1/dblpv13_standard.json', orient='records', lines=True)

# # 3. 根据 reference_ids 查找匹配的文献
# matched_papers = df_18later_hasRef[df_18later_hasRef['_id'].isin(reference_ids)]
# matched_papers.to_csv('/data1/cited_by_li_papers.csv', index=False)

# # 打印部分匹配的论文数据进行验证
# print(matched_papers.head())


import pandas as pd
import random

# 1. 读取两个 CSV 文件
df_cited_by_li = pd.read_csv('/data1/cited_by_li_papers.csv')
df_paper_li = pd.read_csv('/data1/paper_li.csv')

# 2. 合并 DataFrame 成 li_and_his_cited
li_and_his_cited = pd.concat([df_cited_by_li, df_paper_li], ignore_index=True)

# 3. 读取 JSON 文件并从中随机抽取 65432 条数据
df_with_references = pd.read_json('/data1/dblpv13_>=2018_hasRef.json', orient='records', lines=True)
noise_rows = df_with_references.sample(n=65432, random_state=42)

# 4. 合并 li_and_his_cited 和 noise_rows
final_result = pd.concat([li_and_his_cited, noise_rows], ignore_index=True)

# 5. 保存合并后的结果为 CSV 文件
final_result.to_csv('/data1/li_and_his_cited_with_noise.csv', index=False)

# 6. 打印合并后的结果的前几行进行验证
print(final_result.head())
