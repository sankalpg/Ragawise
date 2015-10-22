from __future__ import unicode_literals
from flask import Flask, request, jsonify, current_app
import requests
import sys
import os.path
import json
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "raga phrase demo"


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.run(host= '0.0.0.0', debug = True)        