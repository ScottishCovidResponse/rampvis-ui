export FLASK_APP=run.py

# Set up the DEBUG environment
export FLASK_ENV=development

export API_JS='http://vis.scrc.uk/api/v1'
export API_PY='http://vis.scrc.uk/stat/v1'

export DATA_API='http://vis.scrc.uk/api/v1'
export STAT_API='http://vis.scrc.uk/stat/v1'


# Start the application (development mode)
flask run --host=0.0.0.0 --port=5000