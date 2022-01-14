# -*- coding:utf-8 -*-
from functools import wraps
from flask import Blueprint, session, redirect, render_template

index_bp = Blueprint('index', __name__)


def login_required(func):
    @wraps(func)
    def inner(*args, **kwargs):
        user_name = session.get('user_name')
        if not user_name:
            return redirect('/login')
        return func(*args, **kwargs)
    return inner


@index_bp.route('/index')
@login_required
def index():
    return render_template('index.html')


@index_bp.route('/', redirect_to='/index')
def homepage():
    return redirect('/index')
