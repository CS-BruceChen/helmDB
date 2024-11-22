import pandas as pd
from sklearn.decomposition import PCA
from ast import literal_eval
import json


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


def safe_split_to_list(x):
    try:
        # 尝试将字符串分割为列表
        # 并且检查每个元素是否是长度为24的固定长度id
        x = list(map(str, x.split(",")))
        # 检查每个元素是否是长度为24的固定长度id
        for i in range(len(x)):
            if len(str(x[i]))!= 24:
                raise Exception("Invalid id")
        return x
    except Exception:
        # 如果有任何异常发生，返回空列表作为默认值
        return []


idMapFile = "./MergedData/MergedData_idMap.json"
edgeFile = "./MergedData/MergedData_edges.csv"
adjListFile = "./MergedData/MergedData_adjList.json"
inverted_adjListFile = "./MergedData/MergedData_inverted_adjList.json"

rawFile = "TestSet_relation.csv"
attachedFile = "articles.csv"
columns = [
    "ArticleID",
    "RefIDs",
]

# process rawFile
rawData = pd.read_csv(rawFile, usecols=[0, 7], header=None, low_memory=False)
rawData.columns = columns
rawData["ArticleID"] = rawData["ArticleID"].astype(str)
rawData["RefIDs"] = rawData["RefIDs"].apply(safe_split_to_list)

# 读取attachedData，跳过表示属性的第一行
attachedData = pd.read_csv(
    attachedFile,
    usecols=[0, 7],
    header=None,
    skiprows=[0],
    low_memory=False,
)

attachedData.columns = columns
# 声明列类型
attachedData["ArticleID"] = attachedData["ArticleID"].astype(str)
attachedData["RefIDs"] = attachedData["RefIDs"].apply(safe_split_to_list)

# 合并数据
mergedData = pd.concat([rawData, attachedData], ignore_index=True)

# id 映射(id比实际的位置大1，遵循处理的惯例)
idMap = {}
for i in range(len(mergedData)):
    idMap[mergedData.iloc[i, 0]] = i + 1

# 构造边集，用csv格式保存，每一行是一条边，格式为source,target
edges = []
for i in range(len(mergedData)):
    for j in range(len(mergedData.iloc[i, 1])):
        # 安全的访问键值，如果idmap中没有，那么这个edge就忽略
        if mergedData.iloc[i, 1][j] not in idMap:
            continue
        edges.append([idMap[mergedData.iloc[i, 0]], idMap[mergedData.iloc[i, 1][j]]])

# 根据边集构造两个单向邻接表，一个是source to target，一个是target to source
adjList = {}
inverted_adjList = {}
for i in range(len(edges)):
    if edges[i][0] not in adjList:
        adjList[edges[i][0]] = []
    if edges[i][1] not in inverted_adjList:
        inverted_adjList[edges[i][1]] = []
    adjList[edges[i][0]].append(edges[i][1])
    inverted_adjList[edges[i][1]].append(edges[i][0])

# 保存mergedData到csv
mergedData.to_csv(
    "MergedData_citations.csv", index=False, header=False
)

# 保存id映射
with open(idMapFile, "w") as f:
    json.dump(idMap, f, ensure_ascii=False, indent=4)

# 保存边集
edges = pd.DataFrame(edges)
edges.to_csv(edgeFile, index=False, header=False)

# 保存两个邻接表
with open(adjListFile, "w") as f:
    json.dump(adjList, f, ensure_ascii=False, indent=4)

with open(inverted_adjListFile, "w") as f:
    json.dump(inverted_adjList, f, ensure_ascii=False, indent=4)
