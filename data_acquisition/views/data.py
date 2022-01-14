# -*- coding:utf-8 -*-
import json
from functools import wraps
from flask import Blueprint, session, redirect, request
from psutil import cpu_percent, virtual_memory

data_bp = Blueprint('data', __name__)

DATA_LIST = ['k1', 'k2', 'k3']
DATA_DICT = {}


def login_required(func):
    @wraps(func)
    def inner(*args, **kwargs):
        user_name = session.get('user_name')
        if not user_name:
            return redirect('/login')
        return func(*args, **kwargs)

    return inner


@data_bp.route('/receive', methods=['POST'])
def receive():
    for k in DATA_LIST:
        v = request.form.get(k)
        if v:
            DATA_DICT[k] = v
    print('POST request:', DATA_DICT)
    return 'received'


@data_bp.route('/get')
def get_all():
    print('GET request:', json.dumps(DATA_DICT))

    return json.dumps(DATA_DICT)


@data_bp.route('/get_sys')
def get_sys():
    cpu = cpu_percent()
    mem = virtual_memory()
    used_mem = round(float(mem.used)/1024/1024/1024, 2)
    total_mem = float(mem.total)/1024/1024/1024
    res = {'cpu': cpu,
           'used_mem': used_mem,
           'total_mem': total_mem}
    print('GET request:', res)

    return json.dumps(res)
