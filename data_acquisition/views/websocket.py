# -*- coding:utf-8 -*-
from functools import wraps
from flask import Blueprint, request, session, redirect

websocket_bp = Blueprint('websocket', __name__)


def login_required(func):
    @wraps(func)
    def inner(*args, **kwargs):
        user_name = session.get('user_name')
        if not user_name:
            return redirect('/login')
        return func(*args, **kwargs)
    return inner


@websocket_bp.route('/conn_ws')
@login_required
def ws_app():
    user_socket = request.environ.get("wsgi.websocket")
    msg = user_socket.receive()
    while True:
        print(msg)
        user_socket.send(msg)
