export FLASK_APP=run.py

# Set up the DEBUG environment
export FLASK_ENV=development

export UI_URL='http://localhost:5000'
export DATA_API='http://localhost:2000/api/v1'
export STAT_API='http://localhost:3000/stat/v1'
export API_JS='http://localhost:2000/api/v1'
export API_PY='http://localhost:3000/stat/v1'

# MongoDB link is deleted for security reason, you can use your local database
export MONGODB_URL='<set_the_database_url>'

# Start the application (development mode)
flask run --host=0.0.0.0 --port=5000