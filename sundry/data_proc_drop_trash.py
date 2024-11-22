import pandas as pd

# 读取筛选后的 JSON 文件
df_loaded = pd.read_json('/data1/dblpv13_>=2018.json', orient='records', lines=True)

# 提取 'references' 列中非空的行
df_with_references = df_loaded[df_loaded['references'].notna()]

# 将提取的结果保存为新的 JSON 文件
df_with_references.to_json('/data1/dblpv13_>=2018_hasRef.json', orient='records', lines=True)

# 打印提取后的行数
print(f"提取的包含非空 'references' 的行数: {len(df_with_references)}")
