# -*- coding:utf-8 -*-
from flask import Blueprint, request, render_template, session, redirect

account_bp = Blueprint('account', __name__)


@account_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        user_name = session.get('user_name')
        if user_name:
            return redirect('/index')
        return render_template('login.html')

    username = request.form.get('username')
    password = request.form.get('password')
    if username == 'hrt' and password == 'showmethecode':
        session['user_name'] = username
        return redirect('/index')
    else:
        return render_template('login.html', msg='Incorrect username or password.')


@account_bp.route('/logout')
def logout():
    del session['user_name']
    return redirect('/login')
