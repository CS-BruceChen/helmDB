import csv
import json

def csv_to_json_array(csv_file_path):
    data_list = []
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        reader = csv.reader(csv_file, delimiter=',')
        for row in reader:
            # 将每一行的数据转换为合适的类型，这里假设都是浮点数类型（根据实际情况可能需要调整）
            converted_row = [int(item) for item in row]
            data_list.append(converted_row)

    return json.dumps(data_list)

# 这里假设你的CSV文件名为data.csv，你可以根据实际情况修改文件名
csv_file_path = 'edge.csv'
json_result = csv_to_json_array(csv_file_path)
with open('edge.json', 'w', encoding='utf-8') as json_file:
    json_file.write(json_result)