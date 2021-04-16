# RAMPVIS UI


## Developing a new visualisation 

This section summarises what a vis-function developer (VFD) needs to do to build a new visualisation in our system. Step 1 is just communication between VFD and a vis-infrastructure manager (VIM) who is Saiful or Phong. Step 2 & 3 will be handled by VIM (good to read them though). So, only need to follow a simple instruction in Step 4.

### 1. [VFD + VIM] Register a new vis function
The VFD needs to talk to a VIM to register a new vis function with the following information:
- Name: such as `VisExample`
- Vis type: either `plot` or `dashboard`
- Data type: all data types you want to use such as `timeseries` and `matrix`.
- Description

### 2. [VIM] Create an example
The VIM checks the database and discusses with the VFD to select suitable data streams for the visualisation to create an example. The VIM will provide a link (localhost:5000/some_id_here) where the VFD can develop and test the example.

### 3. [VIM] Prepare JS and CSS files
The VIM will
- Implement the class with the same name as your vis function (`VisExample`) in a Javascript file (`app/base/static/assets/js/vis/vis-example.js`) that wraps your visualisation code around. Please check out the `vis-example.js` file for a minimal example and see how the class defines, how to get the data and the DOM element to render.
- Include your Javascript file in `app/base/templates/site_template/scripts.html`
- If you have a css file, include it in `app/base/templates/base-site.html`

### 4. [VFD] Build your vis
The VIM will point the VFD to a JS file and a CSS file created in step 3. The VFD just needs to start a server that use production data (see the steps below) and start building inside the JS file.

`Python 3.8` is required before running

```bash
pip install virtualenv
virtualenv venv

source ./venv/bin/activate
pip install -r requirements.txt
```

```bash
source ./venv/bin/activate
./run-use-prod-api.sh
```

Access the dashboard in browser: `http://localhost:5000`.


## Instruction for Infrastructure Manager

`Python 3.8` is required before running

```bash
pip install virtualenv
virtualenv venv

source ./venv/bin/activate
pip install -r requirements.txt
```

Starting the server

```bash
source ./venv/bin/activate

# to use production RESTful API data
./run-use-prod-api.sh
# to use development or local RESTful API instance
./run-use-dev-api.sh
```

Access the dashboard in browser: `http://localhost:5000`.
