def read_from_file(file_name: str):
    """
    从指定地址文件读取点集
    :param file_name: 文件地址
    :return:[[x1,y1,z1],[x2,y2,z2],...,[xn,yn,zn]]
    """
    data_lists = []
    with open(file_name, "r") as f:
        n = int(f.readline())
        for i in range(0, n):
            line = f.readline()
            line = line.strip("\n")
            str_l = line.split(",")
            num_l = []
            for str_ in str_l:
                num_l.append(float(str_))
            data_lists.append(num_l)
    return data_lists


def write_into_file(file_name: str, data_lists: list):
    """
    向指定地址文件写入文件点集
    :param data_lists:
    :param file_name: 文件地址 data_lists:形如[[x1,y1,z1],[x2,y2,z2],...,[xn,yn,zn]]的点集
    :return:none
    """
    with open(file_name, "w") as f:
        n = len(data_lists)
        f.write(str(n))
        f.write("\n")
        for data_list in data_lists:
            data_str = ""
            for data in data_list:
                data_str += str(data) + ","
            data_str = data_str.strip(",")
            f.write(data_str + "\n")
