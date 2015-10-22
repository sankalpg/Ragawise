from __future__ import unicode_literals
from flask import Flask, request, jsonify, current_app
import requests
from functools import wraps
import sys
import os.path
import json
from flask.ext.cors import CORS
from scipy.io.wavfile import read as wavread

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



@app.route('/get_test_sound', methods=['GET', 'POST'])
@support_jsonp
def get_test_sound():
	"""
	http://127.0.0.1:5000/get_test_sound
	simple! and you get the json data :)
	"""
	#read a wav sound
	fs, data = wavread('tun.wav')
	out = {'audio':data.tolist()}
	return jsonify(**out)



@app.route('/upload_audio', methods=['GET', 'POST'])
@support_jsonp
def upload_audio():
	"""
	Example: http://127.0.0.1:5000/upload_audio?audio=[1,2,3]
	you have to see how to send json object, we can parse that. We might need that for passing audio arrays
	"""
	if request.method == 'POST':
		data = request.args.get('audio')
	 	print data
	return "Audio registered"




if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.run(host= '0.0.0.0', debug = True)        