# RAMP VIS UI

## API 

The API code can be found in [ScottishCovidResponse/rampvis-api](https://github.com/ScottishCovidResponse/rampvis-api).

## Getting Started

Requirements
- Python 3.8.3
- conda 

Start development instance

```bash
conda remove --name rampvis-ui --all
conda env create -f environment.yml
conda activate rampvis-ui

# to use production API
./run-use-prod-api.sh

# to use development or local API instance
./run-use-dev-api.sh

```

Access the dashboard in browser: localhost:5000

## Developing a new visualisation
This section summarises what a vis-function developer (VFD) needs to do to build a new visualisation in our system. An example vis-function called `VisExample` has been created.

### 1. Register a new vis function
The VFD needs to talk to a vis-infrastructure manager (VIM) who is Saiful or Phong to register a new vis function with the following information:
- Name: such as `VisExample`
- Vis type: either `plot` or `dashboard`
- Data type: all data types you want to use such as `timeseries` and `matrix`.
- Description

### 2. Create an example
The VIM checks the database and discusses with the VFD to select suitable data streams for the visualisation to create an example. The VIM will provide a link (localhost:5000/some_id_here) where the VFD can develop and test the example.

### 3. Develop the visualisation
- Implement the class with the same name as your vis function (`VisExample`) in a Javascript file (`app/base/static/assets/js/vis/vis-example.js`) that wraps your visualisation code around. Please check out the `vis-example.js` file for a minimal example and see how the class defines, how to get the data and the DOM element to render.
- Include your Javascript file in `app/base/templates/site_template/scripts.html`
- If you have a css file, include it in `app/base/templates/base-site.html`
