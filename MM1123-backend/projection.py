import pandas as pd
import numpy as np

# 读取../TestSet_relation.csv文件的第1到6列以及第8列
# 分别是作者、期刊/会议、年份、关键词、领域、引用次数、嵌入向量
# 论文编号从1开始
data = pd.read_csv('TestSet_relation.csv', usecols=[1, 2, 3, 4, 5, 6, 8],header=None)
data.columns = ["Author", "JournalConference", "Year", "Keywords", "Field", "CitationNum", "Embedding"]
# 对所有的嵌入向量进行主成分分析，投影到二维平面上
# 保留前3个主成分
from sklearn.decomposition import PCA
pca = PCA(n_components=3)
pca.fit(data.iloc[:, 6].apply(lambda x: np.fromstring(x[1:-1], sep=', ')).tolist())
# 对所有的嵌入向量进行投影
data["2DProjection"] = data.iloc[:, 6].apply(lambda x: pca.transform([np.fromstring(x[1:-1], sep=', ')]))

# 保存结果为json，替换Embedding为2DProjection
data = data.drop(columns=["Embedding"])
data.to_json('TestSet_projection.json', orient='records', force_ascii=False, indent=4, lines=False, date_format='iso')