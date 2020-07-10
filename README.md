# RAMP VIS Flask Dashboard

## Getting Started

```bash

# Install modules
pip3 install -r requirements.txt

# Using conda insteadof conda 
conda activate ramp-vis-flask-dashboard

export FLASK_APP=run.py
# Set up the DEBUG environment
export FLASK_ENV=development
# Start the application (development mode)
flask run --host=0.0.0.0 --port=5001
```

Access the dashboard in browser: http://127.0.0.1:5001/


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


# Acknowledgement
