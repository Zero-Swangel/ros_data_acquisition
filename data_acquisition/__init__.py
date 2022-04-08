# -*- coding:utf-8 -*-
from flask import Flask
# from redis import Redis
# from flask_session import RedisSessionInterface
from .views import index, account, data, websocket

app = Flask(__name__, static_folder='static', template_folder='templates')
app.debug = False
app.secret_key = 'Ihazy2a1bnxmvYKtoRYm3lnr0ISfFgOU'

# app.session_interface = RedisSessionInterface(
#     redis=Redis(host='127.0.0.1', port=6379),
#     key_prefix='acquisition'
# )

app.register_blueprint(index.index_bp)
app.register_blueprint(account.account_bp)
app.register_blueprint(data.data_bp)
app.register_blueprint(websocket.websocket_bp)
