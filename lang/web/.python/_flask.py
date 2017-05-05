import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'
# stringはデフォなので省略可
# 他に int float path any uuid
@app.route('/hello/<string:who>')
def hello_who(who):
    return 'Hello %s' % who

@app.route('/site')
def site():
    # テンプレートに使われているのはJinjaのもの
    # http://jinja.pocoo.org/docs/2.9/templates/
    return render_template('site.html', title='title-name')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT', 3333))
