REM Initial Setup
py -3 -m venv venv
venv\Scripts\activate
pip install Flask
pip install gunicorn
pip freeze > requirements.txt
echo web: gunicorn app:app > Procfile

REM Prepare Repo for python coding
cd .\venv\Scripts
activate
cd ..\..

REM Create Minimal Application from 
REM https://flask.palletsprojects.com/en/1.1.x/quickstart/
REM into 'app.py'

REM Prepare App For Running
set FLASK_APP=app.py
set MONGOPASS=Murphy321!
set FLASK_DEBUG=1


REM Run App
flask run



REM For Heroku
heroku apps:create unit-converter-tool
git remote -v
git push heroku master