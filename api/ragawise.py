from __future__ import unicode_literals
from flask import Flask, request, jsonify, current_app
import requests
import sys
from functools import wraps
import os.path
import json
from flask.ext.cors import CORS
import codecs

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "raga phrase demo"

def support_jsonp(f):
    """Wraps JSONified output for JSONP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = str(callback) + '(' + str(f(*args, **kwargs)) + ')'
            return current_app.response_class(content, mimetype='application/javascript')
        else:
            return f(*args, **kwargs)

    return decorated_function   

@app.route('/get_raga_info', methods=['GET', 'POST'])
@support_jsonp
def get_raga_info():
	"""
	"""
	#read a wav sound
	raga_info = json.load(codecs.open('../data/raga_infos.json'))
	return jsonify(**raga_info)    


@app.route('/get_raga_indexes', methods=['GET', 'POST'])
@support_jsonp
def get_raga_indexes():
	"""
	"""
	#read a wav sound
	raga_indexes = json.load(codecs.open('../data/raga_indexes.json'))
	return jsonify(**raga_indexes) 	


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.run(host= '0.0.0.0', debug = True)        