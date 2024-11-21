import json
# 读取edge.json文件
def read_edge_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

#edge.json是一个二维数组，每个元素都是一个长度为2的数组，分别表示一条边的两个顶点
#根据edge.json文件生成邻接表
def generate_adjacency_list(edges):
    adjacency_list = {}
    inverted_adjacency_list = {}
    for edge in edges:
        u, v = edge
        if u not in adjacency_list:
            adjacency_list[u] = []
        if v not in inverted_adjacency_list:
            inverted_adjacency_list[v] = []
        adjacency_list[u].append(v)
        inverted_adjacency_list[v].append(u)
    # 邻接表保存成json文件
    with open('adjacency_list.json', 'w') as file:
        json.dump(adjacency_list, file)
    # 逆邻接表保存成json文件
    with open('inverted_adjacency_list.json', 'w') as file:
        json.dump(inverted_adjacency_list, file)

# 主函数
def main():
    file_path = 'edge.json'
    edges = read_edge_json(file_path)
    generate_adjacency_list(edges)

if __name__ == '__main__':
    main()