# RAMP VIS UI

## API 

The API code can be found in [ScottishCovidResponse/rampvis-api](https://github.com/ScottishCovidResponse/rampvis-api)

## Getting Started

Requirements
- Python 3.8.3
- conda 

Start development instance

```bash
conda remove --name rampvis-ui --all
conda env create -f environment.yml
conda activate rampvis-ui

./run.sh
```

Access the dashboard in browser: localhost:5000