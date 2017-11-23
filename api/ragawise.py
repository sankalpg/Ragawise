import codecs
import json
import os
from functools import wraps

from flask import Flask, request, jsonify, current_app
from flask_cors import CORS

app = Flask(__name__)
app.config.update(DATA_DIR='/data')
CORS(app)


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
    raga_info = json.load(codecs.open(os.path.join(app.config['DATA_DIR'], 'raga_infos.json')))
    return jsonify(**raga_info)


@app.route('/get_raga_indexes', methods=['GET', 'POST'])
@support_jsonp
def get_raga_indexes():
    raga_indexes = json.load(codecs.open(os.path.join(app.config['DATA_DIR'], 'raga_indexes.json')))
    return jsonify(**raga_indexes)


@app.route('/get_thaat_info', methods=['GET', 'POST'])
@support_jsonp
def get_thaat_info():
    thaat_info = json.load(codecs.open(os.path.join(app.config['DATA_DIR'], 'thaat_info.json')))
    return jsonify(**thaat_info)      


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=5000, debug=True)
