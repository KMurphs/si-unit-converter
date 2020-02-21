from flask import Flask
app = Flask(__name__, static_url_path="", static_folder="build")




@app.route('/Hello')
def hello_world():
  return 'Hello, World!'

@app.route('/')
def get_home_page():
  return app.send_static_file('index.html')