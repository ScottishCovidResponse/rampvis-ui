# RAMP VIS Flask Dashboard

## API 

The API code can be found in [ScottishCovidResponse/rampvis-api](https://github.com/ScottishCovidResponse/rampvis-api)

## Getting Started

```bash
# Tested the conda env 
conda activate rampvis-ui

# Using conda insteadof conda 
conda activate ramp-vis-flask-dashboard

# Run the app
export DATA_API='http://localhost:2000/api/v1'
export STAT_API='http://localhost:3000/stat/v1'
# MongoDB link is deleted for security reason, you can use your local database
export MONGODB_URL=<set_the_database_url>

export FLASK_APP=run.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5000
```

Access the dashboard in browser: http://127.0.0.1:5000/


## Structure
```
<  ROOT >                                               # application root folder
    |
    |--- app/__init__.py                                # application constructor  
    |--- app/base/                                      # base blueprint
    |--- app/base/static/assets                         # CSS, JavaScript, Img files
    |--- app/base/templates                             # Jinja2 files  
    |                |--- base-site.html                <-- Add reference of our vis CSS here 
    |                |--- login                         # Dir for login and registration page  
    |                |---<errors>                       # Dir - Error pages: 404, 500
    |                |---<site_template>                # Dir - Components: footer, sidebar, header
    |                              |--- scripts.html    <-- Add reference of our vis JavaScripts here 
    |                              |--- sidebar.html    <-- Left navigation bar / sidebar  
    |                              |--- navigation.html <-- Top navigation bar      
    |
    |
    |--- app/home/                                      # The staic HTML pages
    |--- app/home/pages                                 # Jinja2 files (Pages): ...
    |                |---- dashboard.html               # Main dashboard page
    |                |---- page-user.html               # User profile
    |                |----                              <-- The staic HTML pages 
    |
    |--- .env                                           # store env variables
    |--- config.py                                      # app configuration profiles: Debug, Production
    |
    |--- requirements.txt                               # Requirements for development - SQLite storage
    |
    |--- run.py                                         # bootstrap the app
    |
    |-----------------------------
```


# Notes

```
sudo apt-get install chromium-chromedriver

```
