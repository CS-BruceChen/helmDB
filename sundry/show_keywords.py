import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('/data1/cited_by_li_papers.csv')

# 提取 'keywords' 列
keywords_column = df['keywords']

# 打印 'keywords' 列的前几行，验证提取是否正确
print(keywords_column)
