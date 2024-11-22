import pandas as pd
from sklearn.decomposition import PCA
from ast import literal_eval


def safe_eval_json(x):
    try:
        # 尝试解析JSON字符串
        json_obj = literal_eval(x)
        # 提取'raw'属性的值
        return json_obj.get("raw", x)
    except (ValueError, SyntaxError):
        # 如果解析失败，返回原始值或指定的默认值
        return ""


def safe_convert_to_list(x):
    try:
        # 尝试将字符串转换为列表
        return ",".join(literal_eval(x))
    except (ValueError, SyntaxError, TypeError):
        # 如果转换失败，返回默认值
        return ""


rawFile = "TestSet_relation.csv"
attachedFile = "articles.csv"
columns = [
    "Author",
    "JournalConference",
    "Year",
    "Keywords",
    "Field",
    "CitationNum",
    "Embedding",
]

# process rawFile
rawData = pd.read_csv(
    rawFile, usecols=[1, 2, 3, 4, 5, 6, 8], header=None, low_memory=False
)
rawData.columns = columns

# Embedding 列转换为向量
rawData["Embedding"] = rawData["Embedding"].apply(
    lambda x: list(map(float, x[1:-1].split(", ")))
)

# attachedData = pd.read_csv(
#     attachedFile, usecols=[1, 2, 3, 4, 5, 6, 8], header=None, low_memory=False
# )
# 读取attachedData，跳过表示属性的第一行
attachedData = pd.read_csv(
    attachedFile,
    usecols=[1, 2, 3, 4, 5, 6, 8],
    header=None,
    skiprows=[0],
    low_memory=False,
)

attachedData.columns = columns
# 声明列类型
attachedData["JournalConference"] = attachedData["JournalConference"].astype(str)
attachedData["Keywords"] = attachedData["Keywords"].astype(str)
attachedData["Field"] = attachedData["Field"].astype(str)

#year 列安全转换为整数，指定类型为int，默认值为2021
attachedData["Year"] = pd.to_numeric(attachedData["Year"], errors="coerce").fillna(2018).astype(int)

# JournalConference列解析为json，把整个json替换为json对象中的raw属性的值
attachedData["JournalConference"] = attachedData["JournalConference"].apply(safe_eval_json)

# Keywords列解析为列表，把整个列表替换为列表元素拼接成的字符串，以逗号分隔
attachedData["Keywords"] = attachedData["Keywords"].apply(safe_convert_to_list)

# Field列解析为列表，把整个列表替换为列表元素拼接成的字符串，以逗号分隔
attachedData["Field"] = attachedData["Field"].apply(safe_convert_to_list)

# Embedding 列转换为向量
attachedData["Embedding"] = attachedData["Embedding"].apply(
    lambda x: list(map(float, x[1:-1].split(",")))
)

# 合并数据
mergedData = pd.concat([rawData, attachedData], ignore_index=True)

# 对所有的嵌入向量进行主成分分析，投影到三维
pca = PCA(n_components=3)
pca.fit(mergedData["Embedding"].tolist())
# 对所有的嵌入向量进行投影
mergedData["3DProjection"] = mergedData["Embedding"].apply(
    lambda x: pca.transform([x]).tolist()
)
# 保存结果为json，替换Embedding为3DProjection
mergedData = mergedData.drop(columns=["Embedding"])
mergedData.to_json(
    "MergedData_projection.json",
    orient="records",
    force_ascii=False,
    indent=4,
    lines=False,
    date_format="iso",
)
